"use client";

import { useState } from "react";
import { Upload, FileText, Loader2, ArrowRight } from "lucide-react";
import axios from "axios";

export interface InterviewQuestion {
    id: number;
    question: string;
    context: string;
    topic: string;
}

interface InterviewSetupProps {
    onSessionStart: (questions: InterviewQuestion[]) => void;
}

export default function InterviewSetup({ onSessionStart }: InterviewSetupProps) {
    const [resume, setResume] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resume || !jobDescription) return;

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("resume", resume);
            formData.append("job_description", jobDescription);

            const response = await axios.post("http://localhost:8000/api/v1/interview/init-session", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data && response.data.questions) {
                onSessionStart(response.data.questions);
            }
        } catch (error) {
            console.error("Error initializing session:", error);
            alert("Failed to generate interview. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Setup Your Interview</h2>
                <p className="text-gray-400">Upload your resume and the job description to get tailored questions.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Resume Upload */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Upload Resume (PDF)</label>
                    <div className={`relative border-2 border-dashed rounded-xl p-8 transition-all text-center ${resume ? 'border-green-500/50 bg-green-500/5' : 'border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5'}`}>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-3">
                            <div className={`p-3 rounded-full ${resume ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                                {resume ? <FileText className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
                            </div>
                            <div>
                                <p className="text-white font-medium">{resume ? resume.name : "Click to upload or drag and drop"}</p>
                                <p className="text-xs text-gray-500 mt-1">PDF up to 5MB</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Job Description</label>
                    <textarea
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here..."
                        className="w-full h-40 bg-gray-950/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={!resume || !jobDescription || isLoading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing Profile...
                        </>
                    ) : (
                        <>
                            Generate Interview
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
