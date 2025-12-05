"use client";

import { useState } from "react";
import WebcamProcessor from "@/components/interview/WebcamProcessor";
import { InterviewQuestion } from "@/types/interview";

export default function InterviewPage() {
    const [step, setStep] = useState<'setup' | 'interview'>('setup');
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);

    const handleSessionStart = (generatedQuestions: InterviewQuestion[]) => {
        setQuestions(generatedQuestions);
        setStep('interview');
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 md:p-24 transition-colors">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">AI Mock Interview</h1>
            </div>

            <WebcamProcessor />
        </main>
    );
}
