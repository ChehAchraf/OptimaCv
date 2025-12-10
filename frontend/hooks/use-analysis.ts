
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { CVAnalysis } from '@/types/dashboard';

async function fetchAnalysis(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('ai_cv_results')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;

    const parsedResult = typeof data.result === 'string'
        ? JSON.parse(data.result)
        : data.result;

    return { ...data, result: parsedResult } as CVAnalysis;
}

export function useAnalysis(id: string) {
    return useQuery({
        queryKey: ['analysis', id],
        queryFn: () => fetchAnalysis(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
}
