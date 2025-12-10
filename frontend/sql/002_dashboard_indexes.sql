-- Optimizing data fetching for user dashboard
-- This index speeds up queries that filter by user_id and order by created_at (common pattern: "Show My Recent Analyses")
CREATE INDEX IF NOT EXISTS idx_ai_cv_results_user_created 
ON ai_cv_results (user_id, created_at DESC);

-- Optimizing interview history retrieval
CREATE INDEX IF NOT EXISTS idx_interviews_user_created 
ON interviews (user_id, created_at DESC);

-- Optimizing enterprise CV dashboard (if applicable)
CREATE INDEX IF NOT EXISTS idx_enterprise_cvs_user_created
ON enterprise_cvs (user_id, created_at DESC);
