"use client";

import { useState } from "react";
import WebcamProcessor from "@/components/interview/WebcamProcessor";
import InterviewSetup, { InterviewQuestion } from "@/components/interview/InterviewSetup";

export default function InterviewPage() {
    const [step, setStep] = useState<'setup' | 'interview'>('setup');
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);

    const handleSessionStart = (generatedQuestions: InterviewQuestion[]) => {
        setQuestions(generatedQuestions);
        setStep('interview');
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-4 md:p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-8">
                <h1 className="text-4xl font-bold text-white">AI Mock Interview</h1>
            </div>

            {step === 'setup' ? (
                <InterviewSetup onSessionStart={handleSessionStart} />
            ) : (
                <WebcamProcessor questions={questions} />
            )}
        </main>
    );
}
