import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

interface AudioVisualizationData {
  dataArray: Uint8Array;
  bufferLength: number;
  scale: number;
}

interface UniversalAudioHookResult {
  isRecording: boolean;
  audioUrl: string | null;
  visualizationData: AudioVisualizationData | null;
  scale: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecording: () => void;
  error: string | null;
  mediaRecorderRef: React.RefObject<MediaRecorder | null>;
}

/**
 * A custom hook for handling audio recording across different browsers
 * with special handling for Safari and other browsers
 */
export const useUniversalAudio = (): UniversalAudioHookResult => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [visualizationData, setVisualizationData] = useState<AudioVisualizationData | null>(null);

  // Refs to hold media resources
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isAnimatingRef = useRef<boolean>(false);

  // Clean up resources
  const cleanupResources = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    isAnimatingRef.current = false;

    if (audioContextRef.current) {
      if (audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(console.error);
      }
      audioContextRef.current = null;
      analyserRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Detect the best MIME type for the browser
  const getBestMimeType = useCallback((): string => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent) || 
                    /iphone|ipad|ipod/.test(userAgent);
    const isFirefox = userAgent.indexOf('firefox') > -1;
    
    console.log('Browser detection:', { isSafari, isFirefox, userAgent });
    
    // Safari prefers MP4
    if (isSafari) {
      if (MediaRecorder.isTypeSupported('audio/mp4')) {
        console.log('Using audio/mp4 for Safari');
        return 'audio/mp4';
      }
    }
    
    // Firefox works well with ogg opus
    if (isFirefox) {
      if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        console.log('Using audio/ogg;codecs=opus for Firefox');
        return 'audio/ogg;codecs=opus';
      }
    }
    
    // Try common formats in order of preference
    const types = [
      'audio/webm',
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav',
      '' // Empty string as fallback
    ];

    console.log('Checking supported MIME types...');
    for (const type of types) {
      const isSupported = MediaRecorder.isTypeSupported(type);
      console.log(`MIME type ${type}: ${isSupported ? 'Supported' : 'Not supported'}`);
      if (isSupported) {
        return type;
      }
    }

    // If no supported type is found, return a common fallback
    console.warn('No supported MIME types found, using default');
    return '';
  }, []);

  // Setup audio visualization
  const setupVisualization = useCallback((stream: MediaStream) => {
    try {
      // Create audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        console.warn('AudioContext not supported in this browser');
        return;
      }

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      // Start visualization loop
      const updateVisualization = () => {
        if (!analyserRef.current || !isAnimatingRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume for scale
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedScale = Math.min(Math.max(average / 128, 0.1), 2);
        setScale(normalizedScale);
        
        setVisualizationData({ 
          dataArray: new Uint8Array(dataArray), 
          bufferLength,
          scale: normalizedScale 
        });
        
        animationFrameRef.current = requestAnimationFrame(updateVisualization);
      };

      isAnimatingRef.current = true;
      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    } catch (err) {
      console.error('Error setting up audio visualization:', err);
    }
  }, []);

  // Start recording
  const startRecording = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      cleanupResources();
      chunksRef.current = [];

      // Check if we're in a secure context (needed for getUserMedia)
      if (window.isSecureContext === false) {
        throw new Error('Audio recording requires a secure context (HTTPS)');
      }

      // Check browser compatibility
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support audio recording');
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;

      // Setup visualization
      setupVisualization(stream);

      // Create media recorder with best MIME type
      const mimeType = getBestMimeType();
      try {
        mediaRecorderRef.current = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      } catch (mimeError) {
        console.warn(`Failed to create MediaRecorder with MIME type ${mimeType}, trying without MIME type`, mimeError);
        mediaRecorderRef.current = new MediaRecorder(stream);
      }
      
      // Handle data available event
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        try {
          if (chunksRef.current.length === 0) {
            console.warn('No audio data collected');
            setError('No audio data was recorded');
            return;
          }
          
          console.log(`Creating blob from ${chunksRef.current.length} chunks with MIME type: ${mimeType || 'audio/webm'}`);
          chunksRef.current.forEach((chunk, index) => {
            console.log(`Chunk ${index}: size=${chunk.size}, type=${chunk.type}`);
          });
          
          // Ensure we use a valid MIME type for the blob
          const blobType = mimeType || 'audio/webm';
          const blob = new Blob(chunksRef.current, { type: blobType });
          console.log(`Created blob: size=${blob.size}, type=${blob.type}`);
          
          const url = URL.createObjectURL(blob);
          console.log(`Created object URL: ${url}`);
          setAudioUrl(url);
          
          // Stop visualization but keep animation frame for cleanup
          isAnimatingRef.current = false;
          
          // Log success message
          toast.success('Recording completed successfully');
        } catch (err) {
          console.error('Error creating audio blob:', err);
          setError('Failed to process recording');
          toast.error('Failed to process recording');
        }
      };

      // Handle recording errors
      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording error occurred');
        stopRecording();
      };

      // Start recording - use smaller time slices on Safari for better reliability
      const userAgent = navigator.userAgent.toLowerCase();
      const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent) || 
                      /iphone|ipad|ipod/.test(userAgent);
      
      mediaRecorderRef.current.start(isSafari ? 100 : 1000); // Smaller chunks for Safari
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      toast.error(err instanceof Error ? err.message : 'Failed to start recording');
      cleanupResources();
    }
  }, [cleanupResources, getBestMimeType, setupVisualization]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (!isRecording) return;
    
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      setIsRecording(false);
      
      // We'll stop the tracks after a short delay to ensure all data is collected
      setTimeout(() => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }, 500);
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError('Failed to stop recording');
      toast.error('Failed to stop recording');
      // Force state reset on error
      setIsRecording(false);
    }
  }, [isRecording]);

  // Reset recording
  const resetRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setIsRecording(false);
    setError(null);
    cleanupResources();
    chunksRef.current = [];
  }, [audioUrl, cleanupResources]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      cleanupResources();
    };
  }, [audioUrl, cleanupResources]);

  return {
    isRecording,
    audioUrl,
    visualizationData,
    scale,
    startRecording,
    stopRecording,
    resetRecording,
    error,
    mediaRecorderRef
  };
};
