-- =====================================================
-- Enterprise HR Module - Database Schema
-- =====================================================

-- Table: enterprise_cvs
-- Stores uploaded CVs for enterprise HR users
CREATE TABLE IF NOT EXISTS public.enterprise_cvs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT DEFAULT 'application/pdf',
    candidate_name TEXT,
    candidate_email TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzed', 'archived')),
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: enterprise_analyses
-- Stores bulk analysis results for enterprise users
CREATE TABLE IF NOT EXISTS public.enterprise_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_description TEXT NOT NULL,
    job_title TEXT,
    cv_ids UUID[] NOT NULL,
    results JSONB DEFAULT '[]',
    total_cvs INTEGER DEFAULT 0,
    analyzed_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: enterprise_analysis_results
-- Stores individual CV analysis results linked to bulk analysis
CREATE TABLE IF NOT EXISTS public.enterprise_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID NOT NULL REFERENCES public.enterprise_analyses(id) ON DELETE CASCADE,
    cv_id UUID NOT NULL REFERENCES public.enterprise_cvs(id) ON DELETE CASCADE,
    match_score NUMERIC(5,2),
    summary TEXT,
    strengths TEXT[] DEFAULT '{}',
    weaknesses TEXT[] DEFAULT '{}',
    detailed_analysis JSONB DEFAULT '{}',
    rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_enterprise_cvs_user_id ON public.enterprise_cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_cvs_status ON public.enterprise_cvs(status);
CREATE INDEX IF NOT EXISTS idx_enterprise_cvs_created_at ON public.enterprise_cvs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enterprise_analyses_user_id ON public.enterprise_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_analyses_status ON public.enterprise_analyses(status);
CREATE INDEX IF NOT EXISTS idx_enterprise_analysis_results_analysis_id ON public.enterprise_analysis_results(analysis_id);

-- RLS Policies
ALTER TABLE public.enterprise_cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_analysis_results ENABLE ROW LEVEL SECURITY;

-- enterprise_cvs policies
CREATE POLICY "Users can view their own enterprise CVs"
    ON public.enterprise_cvs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enterprise CVs"
    ON public.enterprise_cvs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enterprise CVs"
    ON public.enterprise_cvs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own enterprise CVs"
    ON public.enterprise_cvs FOR DELETE
    USING (auth.uid() = user_id);

-- enterprise_analyses policies
CREATE POLICY "Users can view their own enterprise analyses"
    ON public.enterprise_analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enterprise analyses"
    ON public.enterprise_analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enterprise analyses"
    ON public.enterprise_analyses FOR UPDATE
    USING (auth.uid() = user_id);

-- enterprise_analysis_results policies
CREATE POLICY "Users can view their own analysis results"
    ON public.enterprise_analysis_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.enterprise_analyses
            WHERE id = enterprise_analysis_results.analysis_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own analysis results"
    ON public.enterprise_analysis_results FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.enterprise_analyses
            WHERE id = enterprise_analysis_results.analysis_id
            AND user_id = auth.uid()
        )
    );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enterprise_cvs_updated_at
    BEFORE UPDATE ON public.enterprise_cvs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enterprise_analyses_updated_at
    BEFORE UPDATE ON public.enterprise_analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for enterprise CVs (run this if using Supabase Storage)
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('enterprise-cvs', 'enterprise-cvs', false)
-- ON CONFLICT (id) DO NOTHING;
