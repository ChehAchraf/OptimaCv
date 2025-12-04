import { InterviewAnalysis } from "@/types/type";
import { notFound } from "next/navigation";
import { getInterviewHistory } from "../../profile/actions/interviewActions";

export default async function InterviewHistoryPage() {
    let analyses: InterviewAnalysis[] = [];
    let error: string | null = null;

    try {
        const result = await getInterviewHistory(20);
        analyses = result.data || [];
    } catch (err: any) {
        error = err.message;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Error Loading History</h1>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Interview History</h1>
                    <p className="text-gray-400">Review your past mock interview sessions</p>
                </div>

                {analyses.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-lg mb-4">No interview history yet</p>
                        <a
                            href="/interview"
                            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-all"
                        >
                            Start Your First Interview
                        </a>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {analyses.map((analysis) => (
                            <div
                                key={analysis.id}
                                className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {analysis.question_context}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            {new Date(analysis.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className={`flex items-center justify-center w-16 h-16 rounded-full border-4 text-2xl font-bold ${analysis.score >= 8 ? 'border-green-500 text-green-400' :
                                            analysis.score >= 5 ? 'border-yellow-500 text-yellow-400' :
                                                'border-red-500 text-red-400'
                                        }`}>
                                        {analysis.score}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                        <h4 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                                            Feedback
                                        </h4>
                                        <p className="text-gray-200 leading-relaxed">{analysis.feedback}</p>
                                    </div>

                                    {analysis.next_question_suggestion && (
                                        <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                                            <h4 className="text-sm font-semibold text-blue-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                                Suggested Follow-up
                                            </h4>
                                            <p className="text-blue-100 font-medium">
                                                "{analysis.next_question_suggestion}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
