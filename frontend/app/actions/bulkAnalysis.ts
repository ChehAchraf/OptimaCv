"use server";

import { rankCandidates } from "./company";
import { getEnterpriseCVFiles } from "./enterpriseActions";
import { checkUserAccess } from "@/lib/auth-check";

/**
 * Process CVs in batches to avoid timeouts and memory issues
 */
export async function processBatchAnalysis(params: {
    cvIds: string[];
    jobTitle?: string;
    jobDescription: string;
    batchSize?: number;
}): Promise<{
    success: boolean;
    processedCount: number;
    totalCount: number;
    results: any[];
    errors: string[];
}> {
    await checkUserAccess();

    const { cvIds, jobDescription, batchSize = 5 } = params;
    const allResults: any[] = [];
    const errors: string[] = [];
    let processedCount = 0;

    // Split CVs into batches
    const batches: string[][] = [];
    for (let i = 0; i < cvIds.length; i += batchSize) {
        batches.push(cvIds.slice(i, i + batchSize));
    }

    console.log(`[processBatchAnalysis] Processing ${cvIds.length} CVs in ${batches.length} batches`);

    // Process each batch sequentially
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        console.log(`[processBatchAnalysis] Processing batch ${batchIndex + 1}/${batches.length} with ${batch.length} CVs`);

        try {
            // Get files for this batch
            const files = await getEnterpriseCVFiles(batch);

            if (files.length === 0) {
                errors.push(`Batch ${batchIndex + 1}: No valid files found`);
                continue;
            }

            // Analyze this batch
            const response = await rankCandidates({
                jobDescription,
                files
            });

            // Process and store results
            const batchResults = response.ranked_results.map((result: any, index: number) => {
                const recruiter = result.recruiter_analysis;
                const legacy = result.analysis;

                return {
                    match_score: recruiter ? recruiter.match_percentage : (legacy?.match_score ?? 0),
                    summary: recruiter ? recruiter.executive_summary : (legacy?.summary ?? ""),
                    strengths: recruiter ? recruiter.key_strengths : (legacy?.strengths ?? []),
                    weaknesses: recruiter ?
                        recruiter.gaps_and_red_flags?.map((g: any) => `${g.severity}: ${g.issue}`) || []
                        : (legacy?.weaknesses ?? []),
                    filename: result.filename,
                    contact_info: recruiter?.contact_info || legacy?.contact_info,
                    detailed_analysis: recruiter || legacy?.detailed_analysis || {},
                    batch: batchIndex + 1
                };
            });

            allResults.push(...batchResults);
            processedCount += files.length;

        } catch (error: any) {
            console.error(`[processBatchAnalysis] Error in batch ${batchIndex + 1}:`, error);
            errors.push(`Batch ${batchIndex + 1}: ${error.message || 'Unknown error'}`);
            // Continue with next batch instead of failing completely
        }
    }

    // Assign ranks to all results based on match score
    const rankedResults = allResults
        .sort((a, b) => b.match_score - a.match_score)
        .map((result, index) => ({
            ...result,
            rank: index + 1
        }));

    return {
        success: rankedResults.length > 0,
        processedCount,
        totalCount: cvIds.length,
        results: rankedResults,
        errors
    };
}

/**
 * Single batch processing endpoint (for progressive updates)
 */
export async function processSingleBatch(params: {
    cvIds: string[];
    jobDescription: string;
    batchIndex: number;
    totalBatches: number;
}): Promise<{
    success: boolean;
    batchIndex: number;
    results: any[];
    error?: string;
}> {
    await checkUserAccess();

    const { cvIds, jobDescription, batchIndex, totalBatches } = params;

    console.log(`[processSingleBatch] Batch ${batchIndex + 1}/${totalBatches}: Processing ${cvIds.length} CVs`);

    try {
        // Get files for this batch
        const files = await getEnterpriseCVFiles(cvIds);

        if (files.length === 0) {
            return {
                success: false,
                batchIndex,
                results: [],
                error: "No valid files found in this batch"
            };
        }

        // Analyze this batch
        const response = await rankCandidates({
            jobDescription,
            files
        });

        // Process results
        // Process results
        const batchResults = response.ranked_results.map((result: any) => {
            const recruiter = result.recruiter_analysis;
            const legacy = result.analysis;

            return {
                match_score: recruiter ? recruiter.match_percentage : (legacy?.match_score ?? 0),
                summary: recruiter ? recruiter.executive_summary : (legacy?.summary ?? ""),
                strengths: recruiter ? recruiter.key_strengths : (legacy?.strengths ?? []),
                weaknesses: recruiter ?
                    recruiter.gaps_and_red_flags?.map((g: any) => `${g.severity}: ${g.issue}`) || []
                    : (legacy?.weaknesses ?? []),
                filename: result.filename,
                contact_info: recruiter?.contact_info || legacy?.contact_info,
                detailed_analysis: recruiter || legacy?.detailed_analysis || {}
            };
        });

        return {
            success: true,
            batchIndex,
            results: batchResults
        };

    } catch (error: any) {
        console.error(`[processSingleBatch] Error in batch ${batchIndex + 1}:`, error);
        return {
            success: false,
            batchIndex,
            results: [],
            error: error.message || "Unknown error"
        };
    }
}
