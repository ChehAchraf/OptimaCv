import WebcamProcessor from "@/components/interview/WebcamProcessor";

export default function InterviewPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-8">
                <h1 className="text-4xl font-bold text-white">AI Mock Interview</h1>
            </div>
            
            <WebcamProcessor />
        </main>
    );
}
