"use client";

import { useEffect, useRef, useState } from "react";
import { FaceLandmarkerResult } from "@mediapipe/tasks-vision";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import AudioVisualizer from "./AudioVisualizer";
import { Mic, Square, Play, Loader2, CheckCircle, Circle, Clock, ArrowRight } from "lucide-react";
import axios from "axios";

import { InterviewQuestion } from "./InterviewSetup";

interface AnalysisResult {
    feedback: string;
    score: number;
    next_question_suggestion: string;
}

interface WebcamProcessorProps {
    questions?: InterviewQuestion[];
}

export default function WebcamProcessor({ questions = [] }: WebcamProcessorProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const requestRef = useRef<number>(0);
    const lastVideoTimeRef = useRef(-1);

    // Question State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = questions[currentQuestionIndex];

    // Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    // Use Ref for stats to avoid re-renders and stale closures
    const accumulatedStatsRef = useRef<any[]>([]);

    const submitAnswer = async (blob: Blob, stats: any[]) => {
        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append("audio_file", blob, "answer.webm");
            formData.append("video_analysis", JSON.stringify(stats));
            // Use the actual current question context
            formData.append("question_context", currentQuestion?.question || "General Interview Question");

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

    // Audio Recorder Hook with onStop callback
    const {
        startRecording,
        stopRecording,
        isRecording,
        recordingTime,
        mediaStream
    } = useAudioRecorder((blob) => {
        // Automatic submission when recording stops
        submitAnswer(blob, accumulatedStatsRef.current);
    });

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
                if (accumulatedStatsRef.current) {
                    // Throttle saving to save memory (approx 10% of frames)
                    if (Math.random() < 0.1) {
                        accumulatedStatsRef.current.push({
                            timestamp: performance.now(),
                            faceBlendshapes: faceData.faceBlendshapes
                        });
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
    }, []);

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
        // Safety Check
        if (
            !videoRef.current ||
            videoRef.current.paused ||
            videoRef.current.ended ||
            videoRef.current.readyState < 2 ||
            !workerRef.current ||
            !isModelLoaded
        ) {
            requestRef.current = requestAnimationFrame(processVideo);
            return;
        }

        if (videoRef.current.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = videoRef.current.currentTime;

            createImageBitmap(videoRef.current).then((bitmap) => {
                workerRef.current?.postMessage({
                    frame: bitmap,
                    timestamp: performance.now()
                }, [bitmap]);
            }).catch(err => console.error("Frame capture error:", err));
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
        accumulatedStatsRef.current = []; // Reset ref
        setAnalysisResult(null);
        startRecording();
    };

    const handleNextQuestion = () => {
        setAnalysisResult(null);
        accumulatedStatsRef.current = [];
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            alert("Interview Completed!");
            // Handle completion logic here (e.g., redirect or show summary)
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Sidebar: Questions List */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            Interview Progress
                        </h2>
                        <div className="space-y-3">
                            {questions.map((q, idx) => {
                                const isActive = idx === currentQuestionIndex;
                                const isCompleted = idx < currentQuestionIndex;
                                const isPending = idx > currentQuestionIndex;

                                return (
                                    <div
                                        key={q.id}
                                        className={`p-4 rounded-xl border transition-all ${isActive
                                                ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                                                : isCompleted
                                                    ? 'bg-green-500/10 border-green-500/20 opacity-75'
                                                    : 'bg-white/5 border-white/5 opacity-50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                {isCompleted ? (
                                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                                ) : isActive ? (
                                                    <div className="w-5 h-5 rounded-full border-2 border-blue-400 flex items-center justify-center">
                                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                                    </div>
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                                                    Question {idx + 1}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                                                    {q.question}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Area: Video & Controls */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Active Question Card */}
                    {currentQuestion && (
                        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-500/30">
                                {currentQuestion.topic}
                            </span>
                            <h3 className="text-2xl font-bold text-white leading-relaxed">
                                {currentQuestion.question}
                            </h3>
                            <p className="text-gray-400 text-sm mt-2 italic border-l-2 border-gray-600 pl-3">
                                Context: {currentQuestion.context}
                            </p>
                        </div>
                    )}

                    {/* Video Container */}
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
                        <div className="flex items-center justify-center gap-4 p-6 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10">
                            {!isRecording ? (
                                <button
                                    onClick={handleStartRecording}
                                    disabled={isAnalyzing}
                                    className="flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-red-500/25 disabled:opacity-50 transform hover:scale-105"
                                >
                                    <Mic className="w-6 h-6" />
                                    Start Answer
                                </button>
                            ) : (
                                <button
                                    onClick={stopRecording}
                                    className="flex items-center gap-3 px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold text-lg transition-all border border-white/10 transform hover:scale-105"
                                >
                                    <Square className="w-6 h-6 fill-current" />
                                    Finish Answer
                                </button>
                            )}
                        </div>
                    )}

                    {/* Results Display */}
                    {analysisResult && (
                        <div className="w-full bg-gray-900/80 backdrop-blur-md rounded-2xl border border-white/10 p-8 animate-in fade-in slide-in-from-bottom-4 shadow-2xl">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Analysis Result</h3>
                                    <p className="text-gray-400">Feedback for Question {currentQuestionIndex + 1}</p>
                                </div>
                                <div className={`flex items-center justify-center w-20 h-20 rounded-full border-4 text-3xl font-bold ${analysisResult.score >= 8 ? 'border-green-500 text-green-400' :
                                    analysisResult.score >= 5 ? 'border-yellow-500 text-yellow-400' :
                                        'border-red-500 text-red-400'
                                    }`}>
                                    {analysisResult.score}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                    <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Feedback</h4>
                                    <p className="text-gray-200 leading-relaxed text-lg">{analysisResult.feedback}</p>
                                </div>

                                <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
                                    <h4 className="text-sm font-semibold text-blue-300 mb-3 uppercase tracking-wider flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Suggested Follow-up
                                    </h4>
                                    <p className="text-blue-100 font-medium text-lg">"{analysisResult.next_question_suggestion}"</p>
                                </div>

                                <button
                                    onClick={handleNextQuestion}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                                >
                                    {currentQuestionIndex < questions.length - 1 ? (
                                        <>
                                            Next Question
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    ) : (
                                        <>
                                            Finish Interview
                                            <CheckCircle className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}