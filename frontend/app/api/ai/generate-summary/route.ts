import { NextResponse } from 'next/server';
import path from '@/app/axios/path';
import { CVPersonalDetail } from '@/types/cv-builder';

export async function POST(request: Request) {
    let data: CVPersonalDetail | undefined; // Declared outside try/catch
    try {
        data = await request.json();

        // Call the Python backend to generate the summary
        const response = await path.post('/analysis/generate-profile-summary/', {
            full_name: data?.full_name,
            job_title: data?.job_title,
            skills: [], 
            experience_level: "Entry Level",
        });

        // Backend expected to return { summary: "..." }
        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Error generating summary:', error);

        // Fallback for demo/testing
        if (process.env.NODE_ENV === 'development') {
            return NextResponse.json({
                // Safe access with ?. in case data is undefined
                summary: `Driven ${data?.job_title || 'Professional'} with a passion for excellence. Proven track record in delivery high-quality results. (Generated Mock)`
            });
        }

        return NextResponse.json(
            { error: 'Failed to generate summary' },
            { status: 500 }
        );
    }
}