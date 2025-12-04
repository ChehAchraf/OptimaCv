import { useState, useRef, useCallback, useEffect } from "react";

export interface AudioRecorderState {
    isRecording: boolean;
    recordingTime: number;
    audioBlob: Blob | null;
    mediaStream: MediaStream | null;
}

export const useAudioRecorder = (onStop?: (blob: Blob) => void) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setMediaStream(stream);

            // Determine supported MIME type
            let mimeType = "audio/webm;codecs=opus";
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = "audio/mp4"; // Safari fallback
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = ""; // Default
                }
            }

            const recorder = new MediaRecorder(stream, { mimeType: mimeType || undefined });
            mediaRecorderRef.current = recorder;
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType || "audio/webm" });
                setAudioBlob(blob);
                if (onStop) {
                    onStop(blob);
                }

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
                setMediaStream(null);
            };

            recorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            setAudioBlob(null);

            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

        } catch (error) {
            console.error("Error starting recording:", error);
            alert("Could not access microphone. Please allow permissions.");
        }
    }, [onStop]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());
        };
    }, []);

    return {
        startRecording,
        stopRecording,
        isRecording,
        recordingTime,
        audioBlob,
        mediaStream
    };
};
