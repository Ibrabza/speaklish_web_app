

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type UseAudioHook = {
    audioUrl: string | null;
    scale: number;
    setAudioUrl: (url: string | null) => void;
    mediaRecorderRef: React.RefObject<MediaRecorder | null>;
};

type UseAudioProps = {
    stream: MediaStream | null;
    isRecording: boolean;
    setIsRecording: (state: boolean) => void;
    currentPart: number;
    setRecordingStartTime: (time: number) => void;
};

export default function useAudio({
                                     stream,
                                     isRecording,
                                     setIsRecording,
                                     currentPart,
                                     setRecordingStartTime,
                                 }: UseAudioProps): UseAudioHook {
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserNodeRef = useRef<AnalyserNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<BlobPart[]>([]);

    const [scale, setScale] = useState<number>(1);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const isAnimatingRef = useRef<boolean>(false);



    const visualizeAudio = useCallback(() => {
        if (!analyserNodeRef.current) return;

        const bufferLength = analyserNodeRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const animate = () => {
            if (!isAnimatingRef.current) return;

            analyserNodeRef.current!.getByteFrequencyData(dataArray);

            const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            const normalizedScale = Math.min(Math.max(average / 128, 0.1), 2);
            setScale(normalizedScale);

            requestAnimationFrame(animate);
        };

        isAnimatingRef.current = true;
        animate();
    }, []);

    const startRecording = useCallback(async () => {
        try {
            if (!stream || !(stream instanceof MediaStream)) {
                toast.error("MediaStream is invalid. Please check your audio input.");
                console.error("Invalid MediaStream:", stream);
                throw new Error("Cannot start recording: MediaStream is not valid.");
            }
            setRecordingStartTime(Date.now());
            mediaStreamRef.current = stream;

            audioContextRef.current = new (window.AudioContext)();
            analyserNodeRef.current = audioContextRef.current.createAnalyser();

            const source = audioContextRef.current.createMediaStreamSource(stream);
            source.connect(analyserNodeRef.current);
            analyserNodeRef.current.fftSize = 256;

            // const userAgent = navigator.userAgent;
            // const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/mp4" });

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/mp4" });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                chunksRef.current = [];
                setIsRecording(false);
            };

            mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                chunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.start(1000);
            visualizeAudio();
        } catch (error) {
            console.error("Error accessing the microphone:", error);
            toast.error(error instanceof Error ? error.message : "Error starting recording.");
        }
    }, [stream, setRecordingStartTime, visualizeAudio]);

    const stopRecording = useCallback(() => {
        isAnimatingRef.current = false;

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }

        if (mediaStreamRef.current) {
            if (currentPart === 4) {
                mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            }
        }

        if (audioContextRef.current && audioContextRef.current.state !== "closed") {
            audioContextRef.current.close();
        }
    }, [currentPart]);

    useEffect(() => {

        if (isRecording) {
            startRecording();
        } else {
            stopRecording();
        }

        return () => {
            stopRecording();
        };
    }, [stopRecording, startRecording, isRecording]);
    if(stream === null) {
        return { audioUrl, scale, setAudioUrl, mediaRecorderRef };
    }

    return { audioUrl, scale, setAudioUrl, mediaRecorderRef };
}
