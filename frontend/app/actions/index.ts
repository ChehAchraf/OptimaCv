/**
 * Server Actions - Barrel Export
 * Import all actions from '@/app/actions'
 */

// CV Analysis Actions
export { analyzeCv, getUserUsage } from './analyzeCv';
export { buildCV } from './buildCv';
export { optimizeText } from './optimize';

// Company Actions
export { rankCandidates } from './company';
export { generateCV } from './generateCv';
export { companyRank } from './campany';

// Interview Actions
export {
    saveInterviewAnalysis,
    getInterviewHistory,
    softDeleteInterviewAnalysis
} from './interviewActions';

export { analyzeInterviewAnswer } from './analyzeInterview';

// CV History Actions
export * from './cvAnalysisHistory';

// Enterprise Actions
export * from './enterpriseActions';
