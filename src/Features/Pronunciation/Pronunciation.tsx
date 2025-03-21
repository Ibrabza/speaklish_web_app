import {FC, useEffect, useState, useRef} from "react";
import styles from "./Pronunciation.module.css"
import BackButton from "@/components/ui/BackButton.tsx";
import DownloadIcon from "@/assets/icons/lesson/DownloadIcon.tsx";
import VoiceAnimation from "@/components/VoiceAnimation/VoiceAnimation.tsx";
import {useParams} from "react-router-dom";
import {useUniversalAudio} from "@/hooks/useUniversalAudio.ts";
import AudioButton from "./AudioButton.tsx";
import WaveAnimation from "./WaveAnimation.tsx";
import {startPronunciation, processPronunciation, getPronunciationResult} from "@/services/apiServices.ts";
import toast from "react-hot-toast";

interface IPronunciation {
    audio?: string;
}

interface PronunciationData {
    id: number;
    topic: string;
}

interface PronunciationResult {
    id: number;
    session_id: string;
    user: number;
    audio: string;
    reference_text: string;
    topic: string;
    pronunciation_score: number;
    accuracy_score: number;
    fluency_score: number;
    prosody_score: number;
    completeness_score: number;
    content_assessment: {
        grammar_score: number;
        vocabulary_score: number;
        topic_score: number;
    };
    words: {
        id: number;
        word: string;
        accuracy_score: number;
        error_type: string;
    }[];
    status: string;
    error_message: string;
    created_at: string;
    updated_at: string;
}

const Pronunciation: FC<IPronunciation> = () => {
    const { id } = useParams<{ id: string }>();
    const [pronunciationData, setPronunciationData] = useState<PronunciationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timer, setTimer] = useState({ minutes: 0, seconds: 0 });
    const [timerActive, setTimerActive] = useState(false);
    // We're keeping the processingId state for API tracking, but not displaying it in the UI
    const [, setProcessingId] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [pronunciationResult, setPronunciationResult] = useState<PronunciationResult | null>(null);
    const resultCheckInterval = useRef<number | null>(null);
    
    // Use the universal audio hook
    const { 
        isRecording, 
        audioUrl, 
        scale, 
        startRecording, 
        stopRecording, 
        resetRecording,
        mediaRecorderRef
    } = useUniversalAudio();
    
    // Fetch pronunciation data
    useEffect(() => {
        const fetchPronunciationData = async () => {
            if (!id) return;
            
            try {
                setIsLoading(true);
                // Try to fetch data from API
                try {
                    const data = await startPronunciation(Number(id));
                    if (data && data.topic) {
                        setPronunciationData(data);
                    } else {
                        // If API returns data but no topic, use mock data
                        console.warn("API returned invalid data, using mock data");
                        setPronunciationData({
                            id: Number(id),
                            topic: "Please read the following text aloud: The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet. It's often used to test fonts, keyboards, and other text-related tools."
                        });
                    }
                } catch (apiError) {
                    console.error("API error, using mock data:", apiError);
                    // Use mock data if API fails
                    setPronunciationData({
                        id: Number(id),
                        topic: "Please read the following text aloud: The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet. It's often used to test fonts, keyboards, and other text-related tools."
                    });
                    toast.error("Using sample text for testing");
                }
            } catch (error) {
                console.error("Error in pronunciation data handling:", error);
                toast.error("Failed to load pronunciation exercise");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPronunciationData();
    }, [id]);
    
    // No need to request microphone permissions separately - the universal audio hook handles this
    
    // Timer effect - counts up from 00:00
    useEffect(() => {
        let interval: number | null = null;
        
        if (timerActive) {
            // Reset timer when starting
            setTimer({ minutes: 0, seconds: 0 });
            
            interval = window.setInterval(() => {
                setTimer(prevTimer => {
                    const newSeconds = prevTimer.seconds + 1;
                    
                    if (newSeconds >= 60) {
                        return { 
                            minutes: prevTimer.minutes + 1, 
                            seconds: 0 
                        };
                    }
                    
                    return { ...prevTimer, seconds: newSeconds };
                });
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerActive]);
    
    // Clear any existing interval when component unmounts or when a new recording starts
    useEffect(() => {
        return () => {
            if (resultCheckInterval.current) {
                clearInterval(resultCheckInterval.current);
                resultCheckInterval.current = null;
            }
        };
    }, []);
    
    // Function to check pronunciation result status
    const checkPronunciationResult = async (uuid: string) => {
        try {
            setIsChecking(true);
            const result = await getPronunciationResult(uuid);
            
            if (result.status === "Completed") {
                // Result is ready
                setPronunciationResult(result);
                toast.success("Pronunciation analysis complete!");
                
                // Clear the interval
                if (resultCheckInterval.current) {
                    clearInterval(resultCheckInterval.current);
                    resultCheckInterval.current = null;
                }
                setIsChecking(false);
                setProcessingId(null);
            } else if (result.status === "Error" || result.error_message) {
                // Error occurred
                toast.error(`Error: ${result.error_message || "Unknown error occurred"}`);
                if (resultCheckInterval.current) {
                    clearInterval(resultCheckInterval.current);
                    resultCheckInterval.current = null;
                }
                setIsChecking(false);
                setProcessingId(null);
            } else if (result.status === "In progress") {
                // Still processing, update UI if needed
                console.log("Pronunciation analysis in progress...");
            } else {
                // Unknown status
                console.warn(`Unknown pronunciation result status: ${result.status}`);
            }
            
        } catch (error) {
            console.error("Error checking pronunciation result:", error);
            // Don't clear interval on network errors, keep trying
        }
    };
    
    // Function to process and submit the audio recording
    const processAudioRecording = async () => {
        console.log('Starting audio processing...');
        
        if (!audioUrl) {
            console.error('No audioUrl available');
            toast.error("Recording not available");
            return;
        }
        
        if (!pronunciationData?.topic) {
            console.error('No topic available');
            toast.error("Topic information not available");
            return;
        }
        
        console.log('Audio URL:', audioUrl);
        console.log('Topic:', pronunciationData.topic);
        
        // Show loading toast
        const loadingToast = toast.loading('Processing recording...');
        
        try {
            setIsSubmitting(true);
            
            // Get the audio element from the DOM if it exists
            const audioElement = document.querySelector('audio[src="' + audioUrl + '"]') as HTMLAudioElement;
            let blob: Blob;
            
            // Try to get the blob directly from the MediaRecorder if possible
            // Access the mediaRecorderRef from the universal audio hook
            const mediaRecorder = mediaRecorderRef.current;
            if (mediaRecorder?.state === 'inactive' && 
                typeof (mediaRecorder as any).blob !== 'undefined') {
                // Some implementations store the blob directly on the MediaRecorder
                blob = (mediaRecorder as any).blob;
                console.log('Got blob directly from MediaRecorder:', blob.size, 'bytes, type:', blob.type);
            } else {
                // Otherwise fetch it from the audio URL
                console.log('Fetching audio blob from URL...');
                const response = await fetch(audioUrl);
                blob = await response.blob();
                console.log('Audio blob fetched from URL:', blob.size, 'bytes, type:', blob.type);
                
                // If the blob is empty or very small, it might be corrupted
                if (blob.size < 100) {
                    console.warn('Audio blob is suspiciously small:', blob.size, 'bytes');
                    
                    // Try to get audio data from the audio element if it exists
                    if (audioElement) {
                        console.log('Attempting to get audio data from audio element...');
                        try {
                            // Create a new MediaRecorder to capture the audio from the element
                            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                            const source = audioContext.createMediaElementSource(audioElement);
                            const destination = audioContext.createMediaStreamDestination();
                            source.connect(destination);
                            
                            // Record the audio
                            const recorder = new MediaRecorder(destination.stream);
                            const chunks: Blob[] = [];
                            
                            recorder.ondataavailable = (e) => {
                                if (e.data.size > 0) chunks.push(e.data);
                            };
                            
                            // Wait for the recording to complete
                            const recordingPromise = new Promise<Blob>((resolve) => {
                                recorder.onstop = () => {
                                    const newBlob = new Blob(chunks, { type: 'audio/webm' });
                                    resolve(newBlob);
                                };
                            });
                            
                            // Start recording and playing
                            recorder.start();
                            audioElement.currentTime = 0;
                            await audioElement.play();
                            
                            // Stop recording when audio ends
                            audioElement.onended = () => recorder.stop();
                            
                            // Get the new blob
                            blob = await recordingPromise;
                            console.log('Got blob from audio element:', blob.size, 'bytes, type:', blob.type);
                        } catch (audioError) {
                            console.error('Failed to get audio from element:', audioError);
                        }
                    }
                }
            }
            
            // Ensure we have a valid blob with content
            if (!blob || blob.size < 100) {
                throw new Error('Could not get a valid audio recording. The file is too small or empty.');
            }
            
            try {
                // Submit the recording to the API
                console.log('Calling processPronunciation API...');
                const result = await processPronunciation(blob, pronunciationData.topic);
                console.log('API response:', result);
                
                // Dismiss the loading toast
                toast.dismiss(loadingToast);
                
                // Check if we received a session_id in the response
                if (result && result.session_id) {
                    const sessionId = result.session_id;
                    console.log('Received session_id:', sessionId);
                    setProcessingId(sessionId);
                    toast.success("Recording submitted for analysis");
                    
                    // Start checking for results every 10 seconds
                    if (resultCheckInterval.current) {
                        clearInterval(resultCheckInterval.current);
                    }
                    
                    console.log('Setting up polling interval for results...');
                    resultCheckInterval.current = window.setInterval(() => {
                        console.log('Polling for results...');
                        checkPronunciationResult(sessionId);
                    }, 10000); // Check every 10 seconds
                    
                    // Do an immediate check as well
                    console.log('Performing immediate result check...');
                    checkPronunciationResult(sessionId);
                } else if (result && result.id) {
                    // Fallback for older API format
                    console.log('Received id (old format):', result.id);
                    setProcessingId(result.id);
                    toast.success("Recording submitted for analysis");
                    
                    if (resultCheckInterval.current) {
                        clearInterval(resultCheckInterval.current);
                    }
                    
                    console.log('Setting up polling interval for results (old format)...');
                    resultCheckInterval.current = window.setInterval(() => {
                        console.log('Polling for results...');
                        checkPronunciationResult(result.id);
                    }, 10000);
                    
                    console.log('Performing immediate result check...');
                    checkPronunciationResult(result.id);
                } else {
                    console.error("Invalid API response:", result);
                    toast.error("Failed to get processing ID from server");
                }
            } catch (apiError) {
                console.error("API error during submission:", apiError);
                toast.dismiss(loadingToast);
                toast.error("Failed to process recording. Please try again.");
            }
        } catch (error) {
            console.error("Error processing recording:", error);
            toast.dismiss(loadingToast);
            toast.error(error instanceof Error ? error.message : "Failed to process recording");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Handle timer click - save the recording but don't submit automatically
    const handleTimerClick = () => {
        if (isRecording) {
            // Stop recording but don't process automatically
            stopRecording();
            setTimerActive(false);
            toast.success("Recording saved. Click 'Submit Recording' when ready.");
        }
    };
    
    const handleRecordToggle = () => {
        if (isRecording) {
            // Stop recording but don't process automatically
            stopRecording();
            setTimerActive(false);
            toast.success("Recording saved. Click 'Submit Recording' when ready.");
        } else {
            // Start recording
            resetRecording();
            startRecording().catch((error: Error) => {
                console.error("Error starting recording:", error);
                toast.error(error.message || "Failed to start recording");
            });
            setTimerActive(true);
            // Reset any previous results
            setPronunciationResult(null);
            setProcessingId(null);
            if (resultCheckInterval.current) {
                clearInterval(resultCheckInterval.current);
                resultCheckInterval.current = null;
            }
        }
    };
    
    // Timer formatting is now handled in the AudioButton component


    return (
        <div className={styles.container}>
            <div className={styles.pronunciation_header}>
                <BackButton/>
                <h3>Pronunciation Practice</h3>
                <DownloadIcon color={"#07DA83"} />
            </div>

            <div className={styles.pronunciation_main}>
                {isLoading ? (
                    <div className={styles.loading}>Loading pronunciation exercise...</div>
                ) : (
                    <>
                        {/* Container for elements that should be blurred */}
                        <div className={`${(isSubmitting || isChecking) ? styles.blurred_background : ''}`}>
                            {/* Only show topic when not viewing results */}
                            {!pronunciationResult && (
                                <div className={styles.pronunciation_text}>
                                    <h4>Topic</h4>
                                    <p>{pronunciationData?.topic || "No topic available"}</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Timer is now inside the AudioButton */}
                        
                        {/* Show waiting overlay during submission or checking */}
                        {(isSubmitting || isChecking) && (
                            <div className={styles.waiting_overlay}>
                                <div className={styles.waiting_modal}>
                                    <div className={styles.stars_animation}>
                                        <img src="/stars_animation.svg" alt="Stars animation" />
                                    </div>
                                    <div className={styles.wave_animation}>
                                        <img src="/pronuncitation_wait_wave.svg" alt="Audio wave" />
                                    </div>
                                    <h3 className={styles.waiting_modal_title}>Processing Audio...</h3>
                                    <p className={styles.waiting_modal_message}>
                                        Please wait while your audio is being processed. This may take a few moments.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Only show recording controls when not submitting or checking and not viewing results */}
                        {!isSubmitting && !isChecking && !pronunciationResult && (
                            <div className={`${styles.pronunciation__button} ${(isSubmitting || isChecking) ? styles.blurred_background : ''}`}>
                                {!isRecording && (
                                    <WaveAnimation isActive={true} scale={1} />
                                )}
                                <AudioButton 
                                    isRecording={isRecording} 
                                    onClick={handleRecordToggle} 
                                    onTimerClick={handleTimerClick}
                                    scale={isRecording ? scale * 0.5 + 1 : 1}
                                    disabled={isSubmitting || isChecking}
                                    timer={timer}
                                    showTimer={isRecording}
                                />
                                {isRecording && (
                                    <div className={styles.voice_animation_container}>
                                        <VoiceAnimation scale={scale * 1.5 + 1}/>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {audioUrl && !pronunciationResult && !isSubmitting && !isChecking && (
                            <div className={`${styles.audio_playback} ${(isSubmitting || isChecking) ? styles.blurred_background : ''}`}>
                                <h4>Your Recording</h4>
                                <audio src={audioUrl} controls />
                                
                                <button 
                                    className={styles.submit_button}
                                    onClick={processAudioRecording}
                                    disabled={isSubmitting || isChecking}
                                >
                                    Submit Recording
                                </button>
                            </div>
                        )}
                        
                        {/* Pronunciation Results Section */}
                        {pronunciationResult && (
                            <div className={`${styles.pronunciation_results} ${(isSubmitting || isChecking) ? styles.blurred_background : ''}`}>
                                
                                {/* Centralized Score Display */}
                                <div className={styles.central_score}>
                                    <div className={styles.main_score_circle}>
                                        <span>{pronunciationResult.pronunciation_score}</span>
                                        <p>Overall</p>
                                    </div>
                                </div>
                                
                                <div className={styles.score_section}>
                                    <div className={styles.score_item}>
                                        <h3>Accuracy</h3>
                                        <div className={styles.score_circle}>
                                            <span>{pronunciationResult.accuracy_score}</span>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.score_item}>
                                        <h3>Fluency</h3>
                                        <div className={styles.score_circle}>
                                            <span>{pronunciationResult.fluency_score}</span>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.score_item}>
                                        <h3>Prosody</h3>
                                        <div className={styles.score_circle}>
                                            <span>{pronunciationResult.prosody_score}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={styles.content_assessment}>
                                    <h3>Content Assessment</h3>
                                    <div className={styles.assessment_items}>
                                        <div className={styles.assessment_item}>
                                            <span>Grammar</span>
                                            <span>{pronunciationResult.content_assessment.grammar_score}</span>
                                        </div>
                                        <div className={styles.assessment_item}>
                                            <span>Vocabulary</span>
                                            <span>{pronunciationResult.content_assessment.vocabulary_score}</span>
                                        </div>
                                        <div className={styles.assessment_item}>
                                            <span>Topic Relevance</span>
                                            <span>{pronunciationResult.content_assessment.topic_score}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {pronunciationResult.words && pronunciationResult.words.length > 0 && (
                                    <div className={styles.word_analysis}>
                                        <h3>Word Analysis</h3>
                                        <div className={styles.words_list}>
                                            {pronunciationResult.words.map((word) => (
                                                <div 
                                                    key={word.id} 
                                                    className={`${styles.word_item} ${word.error_type ? styles.word_error : ''}`}
                                                >
                                                    <span className={styles.word_text}>{word.word}</span>
                                                    {/* Only show error type, not score */}
                                                    {word.error_type && (
                                                        <span className={styles.error_type}>{word.error_type}</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                <div className={styles.reference_text}>
                                    <h3>Reference Text</h3>
                                    <p>{pronunciationResult.reference_text}</p>
                                </div>
                                
                                <div className={styles.button_container}>
                                    <button 
                                        className={styles.try_again_button}
                                        onClick={() => {
                                            // Clear previous results and audio
                                            setPronunciationResult(null);
                                            setProcessingId(null);
                                            resetRecording(); // This will clear the audio recording and URL
                                        }}
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default Pronunciation;