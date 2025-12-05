"use client";

import { useState } from "react";
import WebcamProcessor from "@/components/interview/WebcamProcessor";
import Link from "next/link";
import { InterviewQuestion } from "@/components/interview/InterviewSetup";

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
                <Link
                    href="/interview/history"
                    className="mt-4 lg:mt-0 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all border border-white/10"
                >
                    View History
                </Link>
            </div>

            <WebcamProcessor />
        </main>
    );
}
