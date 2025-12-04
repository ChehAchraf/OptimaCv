"use client";

import { useEffect, useRef } from "react";

interface AudioVisualizerProps {
    stream: MediaStream | null;
    width?: number;
    height?: number;
    barColor?: string;
}

export default function AudioVisualizer({
    stream,
    width = 300,
    height = 100,
    barColor = "#3b82f6" // blue-500
}: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    useEffect(() => {
        if (!stream || !canvasRef.current) return;

        // Initialize Audio Context
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const audioCtx = audioContextRef.current;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        const draw = () => {
            animationRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, width, height);

            const barWidth = (width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * height;

                // Draw rounded bars
                ctx.fillStyle = barColor;

                // Simple gradient opacity based on height
                ctx.globalAlpha = 0.5 + (barHeight / height) * 0.5;

                ctx.fillRect(x, height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
            ctx.globalAlpha = 1.0;
        };

        draw();

        return () => {
            cancelAnimationFrame(animationRef.current);
            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }
            // Note: We don't close the AudioContext here to reuse it, 
            // but in a real app you might want to manage its lifecycle more carefully.
        };
    }, [stream, width, height, barColor]);

    if (!stream) return null;

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full h-full"
        />
    );
}
