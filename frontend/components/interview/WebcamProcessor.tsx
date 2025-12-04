"use client";

import { useEffect, useRef, useState } from "react";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import AudioVisualizer from "./AudioVisualizer";
import { Mic, Square, Play, Loader2, Send, CheckCircle } from "lucide-react";
import axios from "axios";

interface AnalysisResult {
    feedback: string;
    score: number;
    next_question_suggestion: string;
}

export default function WebcamProcessor() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const requestRef = useRef<number>(0);
    const lastVideoTimeRef = useRef(-1);

    // Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [accumulatedStats, setAccumulatedStats] = useState<any[]>([]);

    // Audio Recorder Hook
    const {
        startRecording,
        stopRecording,
        isRecording,
        recordingTime,
        audioBlob,
        mediaStream
    } = useAudioRecorder();

    useEffect(() => {
        // Initialize the Web Worker
        workerRef.current = new Worker(new URL("../../workers/face-mesh-worker.ts", import.meta.url));

        workerRef.current.onmessage = (event) => {
            const { type, results, error } = event.data;

            if (type === "LOADED") {
                console.log("MediaPipe Worker Loaded");
                setIsModelLoaded(true);
            } else if (type === "RESULT") {
                const faceData = results as FaceLandmarkerResult;

                // If recording, accumulate stats
                if (isRecording) {
                    // We only save a simplified version to save memory
                    // For example, just blendshapes or specific landmarks
                    // Here we save the whole object but throttle it in the worker logic or here
                    // For this demo, we'll just save it every 10th frame roughly
                    if (Math.random() < 0.1) {
                        setAccumulatedStats(prev => [...prev, {
                            timestamp: performance.now(),
                            faceBlendshapes: faceData.faceBlendshapes
                        }]);
                    }
                }
            } else if (type === "ERROR") {
                console.error("Worker Error:", error);
            }
        };

        return () => {
            workerRef.current?.terminate();
            cancelAnimationFrame(requestRef.current);
        };
    }, [isRecording]); // Re-bind listener when isRecording changes if needed, but ref is stable

    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 640,
                    height: 480,
                    frameRate: { ideal: 30 }
                }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadeddata = () => {
                    setCameraActive(true);
                    processVideo();
                };
            }
        } catch (err) {
            console.error("Error accessing webcam:", err);
            alert("Could not access webcam. Please allow permissions.");
        }
    };

    const processVideo = () => {
        if (
            videoRef.current &&
            workerRef.current &&
            videoRef.current.readyState >= 2 &&
            isModelLoaded
        ) {
            if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
                lastVideoTimeRef.current = videoRef.current.currentTime;

                createImageBitmap(videoRef.current).then((bitmap) => {
                    workerRef.current?.postMessage({
                        frame: bitmap,
                        timestamp: performance.now()
                    }, [bitmap]);
                }).catch(err => console.error("Frame capture error:", err));
            }
        }
        requestRef.current = requestAnimationFrame(processVideo);
    };

    useEffect(() => {
        if (isModelLoaded && cameraActive) {
            requestRef.current = requestAnimationFrame(processVideo);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isModelLoaded, cameraActive]);

    // Reset stats when starting recording
    const handleStartRecording = () => {
        setAccumulatedStats([]);
        setAnalysisResult(null);
        startRecording();
    };

    const handleSubmitAnswer = async () => {
        if (!audioBlob) return;

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append("audio_file", audioBlob, "answer.webm");
            formData.append("video_analysis", JSON.stringify(accumulatedStats));
            formData.append("question_context", "Tell me about a time you faced a challenge."); // Hardcoded for now

            const response = await axios.post("http://localhost:8000/api/v1/interview/analyze-answer", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setAnalysisResult(response.data);
        } catch (error) {
            console.error("Error analyzing answer:", error);
            alert("Failed to analyze answer. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 space-y-6 w-full max-w-4xl mx-auto">

            {/* Main Video Container */}
            <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 ring-1 ring-white/10">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                />

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${isModelLoaded ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'}`}>
                        AI Model: {isModelLoaded ? "Ready" : "Loading..."}
                    </div>
                    {isRecording && (
                        <div className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            Recording {formatTime(recordingTime)}
                        </div>
                    )}
                </div>

                {/* Start Camera Overlay */}
                {!cameraActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20">
                        <button
                            onClick={startWebcam}
                            disabled={!isModelLoaded}
                            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-3"
                        >
                            {isModelLoaded ? (
                                <>
                                    <Play className="w-5 h-5 fill-current" />
                                    Start Interview
                                </>
                            ) : (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Initializing AI...
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Audio Visualizer Overlay */}
                {isRecording && (
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-4 px-4">
                        <div className="w-full max-w-md h-16">
                            <AudioVisualizer stream={mediaStream} height={64} barColor="#60a5fa" />
                        </div>
                    </div>
                )}

                {/* Analysis Loading Overlay */}
                {isAnalyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-30">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-white font-medium text-lg animate-pulse">Analyzing your answer...</p>
                        <p className="text-gray-400 text-sm mt-2">Checking body language & vocal confidence</p>
                    </div>
                )}
            </div>

            {/* Controls */}
            {cameraActive && !analysisResult && (
                <div className="flex items-center gap-4 p-4 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10">
                    {!isRecording ? (
                        <button
                            onClick={handleStartRecording}
                            disabled={isAnalyzing}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50"
                        >
                            <Mic className="w-5 h-5" />
                            {audioBlob ? "Record Again" : "Start Answer"}
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all border border-white/10"
                        >
                            <Square className="w-5 h-5 fill-current" />
                            Finish Answer
                        </button>
                    )}

                    {audioBlob && !isRecording && (
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={isAnalyzing}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                            Submit for Analysis
                        </button>
                    )}
                </div>
            )}

            {/* Results Display */}
            {analysisResult && (
                <div className="w-full bg-gray-900/80 backdrop-blur-md rounded-2xl border border-white/10 p-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Analysis Result</h3>
                            <p className="text-gray-400">Here is how you performed</p>
                        </div>
                        <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 text-2xl font-bold ${analysisResult.score >= 8 ? 'border-green-500 text-green-400' :
                                analysisResult.score >= 5 ? 'border-yellow-500 text-yellow-400' :
                                    'border-red-500 text-red-400'
                            }`}>
                            {analysisResult.score}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">Feedback</h4>
                            <p className="text-gray-200 leading-relaxed">{analysisResult.feedback}</p>
                        </div>

                        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                            <h4 className="text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Suggested Follow-up
                            </h4>
                            <p className="text-blue-100 font-medium">"{analysisResult.next_question_suggestion}"</p>
                        </div>

                        <button
                            onClick={() => {
                                setAnalysisResult(null);
                                setAccumulatedStats([]);
                                // Ideally reset audio blob here too via hook reset if available
                            }}
                            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
                        >
                            Try Another Question
                        </button>
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-500 max-w-md text-center">
                Your video and audio are processed locally.
                {isRecording ? " Recording in progress..." : " Ready to record."}
            </p>
        </div>
    );
}
