-- Enable Row Level Security for all tables
ALTER TABLE "user_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_usage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ai_cv_results" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "enterprise_cvs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "enterprise_analyses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "enterprise_analysis_results" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "interview_analyses" ENABLE ROW LEVEL SECURITY;

-- Policy for user_plans: Users can read their own plans
CREATE POLICY "Users can view own plans" ON "user_plans"
FOR SELECT USING (auth.uid() = user_id);

-- Policy for user_usage: Users can read their own usage
CREATE POLICY "Users can view own usage" ON "user_usage"
FOR SELECT USING (auth.uid() = user_id);

-- Policy for ai_cv_results: Users can view and insert their own results
CREATE POLICY "Users can view own cv results" ON "ai_cv_results"
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cv results" ON "ai_cv_results"
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cv results" ON "ai_cv_results"
FOR DELETE USING (auth.uid() = user_id);

-- Policy for enterprise_cvs: Users can manage own enterprise cvs
CREATE POLICY "Users can manage own enterprise cvs" ON "enterprise_cvs"
USING (auth.uid() = user_id);

-- Policy for enterprise_analyses: Users can manage own enterprise analyses
CREATE POLICY "Users can manage own enterprise analyses" ON "enterprise_analyses"
USING (auth.uid() = user_id);

-- Policy for enterprise_analysis_results: Users can view results linked to their analyses
CREATE POLICY "Users can view own enterprise analysis results" ON "enterprise_analysis_results"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM enterprise_analyses
    WHERE enterprise_analyses.id = enterprise_analysis_results.analysis_id
    AND enterprise_analyses.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own enterprise analysis results" ON "enterprise_analysis_results"
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM enterprise_analyses
    WHERE enterprise_analyses.id = enterprise_analysis_results.analysis_id
    AND enterprise_analyses.user_id = auth.uid()
  )
);

-- Policy for interview_analyses
CREATE POLICY "Users can manage own interview analyses" ON "interview_analyses"
USING (auth.uid() = user_id);
