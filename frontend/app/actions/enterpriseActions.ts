"use server";

import { createClient } from "@/lib/supabase/server";
import { checkUserAccess, checkEnterpriseAccess } from "@/lib/auth-check";
import { revalidatePath, revalidateTag } from "next/cache";
import {
    EnterpriseCV,
    EnterpriseAnalysis,
    CreateEnterpriseCVPayload,
    CreateEnterpriseAnalysisPayload,
    EnterpriseCVFilters
} from "@/types/enterprise";

/**
 * Get all CVs for the current enterprise user
 */
export async function getEnterpriseCVs(
    filters?: EnterpriseCVFilters,
    limit: number = 50,
    offset: number = 0
): Promise<{ data: EnterpriseCV[]; total: number }> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    let query = supabase
        .from("enterprise_cvs")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });

    if (filters?.status) {
        query = query.eq("status", filters.status);
    }

    if (filters?.search) {
        query = query.or(
            `file_name.ilike.%${filters.search}%,candidate_name.ilike.%${filters.search}%,candidate_email.ilike.%${filters.search}%`
        );
    }

    if (filters?.tags && filters.tags.length > 0) {
        query = query.contains("tags", filters.tags);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
        console.error("Error fetching enterprise CVs:", error);
        throw new Error("Failed to fetch CVs");
    }

    return { data: data || [], total: count || 0 };
}

/**
 * Upload and save a new CV
 */
export async function createEnterpriseCV(payload: CreateEnterpriseCVPayload): Promise<EnterpriseCV> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("enterprise_cvs")
        .insert({
            user_id: user.id,
            file_name: payload.file_name,
            file_path: payload.file_path,
            file_size: payload.file_size,
            mime_type: payload.mime_type || "application/pdf",
            candidate_name: payload.candidate_name,
            candidate_email: payload.candidate_email,
            tags: payload.tags || [],
            status: "pending"
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating enterprise CV:", error);
        throw new Error("Failed to save CV");
    }

    revalidateTag("enterprise-cvs", {});
    return data;
}

/**
 * Upload multiple CVs at once (without actual file storage - legacy)
 */
export async function createMultipleEnterpriseCVs(
    files: Array<{ file_name: string; file_path: string; file_size: number }>
): Promise<EnterpriseCV[]> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const cvs = files.map(file => ({
        user_id: user.id,
        file_name: file.file_name,
        file_path: file.file_path,
        file_size: file.file_size,
        mime_type: "application/pdf",
        status: "pending"
    }));

    const { data, error } = await supabase
        .from("enterprise_cvs")
        .insert(cvs)
        .select();

    if (error) {
        console.error("Error creating enterprise CVs:", error);
        throw new Error("Failed to save CVs");
    }

    revalidateTag("enterprise-cvs", {});
    return data;
}

/**
 * Upload CVs to Supabase Storage and save metadata
 */
/**
 * Upload CVs to Supabase Storage and save metadata
 */
export async function uploadEnterpriseCVs(formData: FormData): Promise<{
    success: string[];
    failed: { file_name: string; error: string }[];
}> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
        throw new Error("No files provided");
    }

    const result = {
        success: [] as string[],
        failed: [] as { file_name: string; error: string }[]
    };

    for (const file of files) {
        try {
            // Generate unique file path
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const filePath = `${user.id}/${timestamp}-${safeName}`;

            // Get file content as ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();
            const fileBuffer = new Uint8Array(arrayBuffer);

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from("enterprise-cvs")
                .upload(filePath, fileBuffer, {
                    contentType: "application/pdf",
                    upsert: false
                });

            if (uploadError) {
                console.error(`Error uploading file ${file.name}:`, uploadError);
                result.failed.push({ file_name: file.name, error: "Upload failed" });
                continue;
            }

            // Save CV metadata to database
            const { data, error: dbError } = await supabase
                .from("enterprise_cvs")
                .insert({
                    user_id: user.id,
                    file_name: file.name,
                    file_path: filePath,
                    file_size: file.size,
                    mime_type: "application/pdf",
                    status: "pending"
                })
                .select()
                .single();

            if (dbError) {
                console.error(`Error saving metadata for ${file.name}:`, dbError);
                // Cleanup
                await supabase.storage.from("enterprise-cvs").remove([filePath]);
                result.failed.push({ file_name: file.name, error: "Database error" });
                continue;
            }

            result.success.push(data.id);

        } catch (error: any) {
            console.error(`Unexpected error for ${file.name}:`, error);
            result.failed.push({ file_name: file.name, error: error.message || "Unknown error" });
        }
    }

    if (result.success.length === 0 && result.failed.length > 0) {
        // If all failed, throw an error to alert the user clearly
        throw new Error(`Failed to upload any CVs. Errors: ${result.failed.map(f => f.file_name).join(', ')}`);
    }

    revalidateTag("enterprise-cvs", {});
    return result;
}

/**
 * Get CV files from storage for analysis
 */
export async function getEnterpriseCVFiles(cvIds: string[]): Promise<File[]> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    console.log(`[getEnterpriseCVFiles] Fetching files for ${cvIds.length} IDs for user ${user.id}`);

    // Get CV metadata
    const { data: cvs, error } = await supabase
        .from("enterprise_cvs")
        .select("*")
        .in("id", cvIds)
        .eq("user_id", user.id)
        .eq("is_deleted", false);

    if (error) {
        console.error("[getEnterpriseCVFiles] Error fetching CV metadata:", error);
        throw new Error(`Failed to fetch CVs: ${error.message}`);
    }

    if (!cvs || cvs.length === 0) {
        console.warn(`[getEnterpriseCVFiles] No metadata records found for IDs: ${cvIds.join(', ')} and user: ${user.id}`);
        throw new Error(`No CV records found in database for the selected candidates. Please ensure they haven't been deleted. (User: ${user.id})`);
    }

    console.log(`[getEnterpriseCVFiles] Found ${cvs.length} metadata records`);

    const files: File[] = [];
    const downloadErrors: string[] = [];

    for (const cv of cvs) {
        if (!cv.file_size || cv.file_size === 0 || cv.file_size === "0") {
            const errorMsg = `CV "${cv.file_name}" is a metadata-only record (size 0) and cannot be re-analyzed because the original file was not saved.`;
            downloadErrors.push(errorMsg);
            continue;
        }

        const cleanPath = cv.file_path.startsWith('/') ? cv.file_path.slice(1) : cv.file_path;

        const { data, error: downloadError } = await supabase.storage
            .from("enterprise-cvs")
            .download(cleanPath);

        if (downloadError) {
            const errorDetails = JSON.stringify(downloadError, Object.getOwnPropertyNames(downloadError));
            const errorMsg = `Error downloading CV ${cv.file_name} (${cleanPath}): ${errorDetails}`;
            downloadErrors.push(errorMsg);

            // Auto-clean: Soft delete the broken record
            console.error(`[getEnterpriseCVFiles] File missing for ${cv.id}. Auto-deleting record.`);
            await supabase
                .from("enterprise_cvs")
                .update({ is_deleted: true })
                .eq("id", cv.id);

            // Revalidate to update UI immediately
            revalidateTag("enterprise-cvs", {});
            revalidatePath("/entreprise");

            continue;
        }

        if (!data) {
            const errorMsg = `No data returned for ${cv.file_path}`;
            downloadErrors.push(errorMsg);

            // Auto-clean
            await supabase
                .from("enterprise_cvs")
                .update({ is_deleted: true })
                .eq("id", cv.id);

            // Revalidate to update UI immediately
            revalidateTag("enterprise-cvs", {});
            revalidatePath("/entreprise");

            continue;
        }

        try {
            const file = new File([data], cv.file_name, { type: "application/pdf" });
            files.push(file);
        } catch (fileError) {
            downloadErrors.push(`Failed to create File object for ${cv.file_name}`);
        }
    }

    if (files.length === 0) {
        // Collect names of failed CVs for the error message
        const failedNames = cvs.map(cv => cv.file_name).join(", ");
        const errorMsg = `
            Unable to retrieve source files for: ${failedNames}.
            These missing records have been automatically removed from your dashboard.
            Action: Please re-upload the CVs to analyze them.
        `.trim();

        throw new Error(errorMsg);
    }

    console.log(`[getEnterpriseCVFiles] Returning ${files.length} valid files`);
    return files;
}

/**
 * Update CV details
 */
export async function updateEnterpriseCV(
    cvId: string,
    updates: Partial<Pick<EnterpriseCV, 'candidate_name' | 'candidate_email' | 'tags' | 'status'>>
): Promise<EnterpriseCV> {
    // const user = await checkEnterpriseAccess();
    const user = await checkUserAccess();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("enterprise_cvs")
        .update(updates)
        .eq("id", cvId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error) {
        console.error("Error updating enterprise CV:", error);
        throw new Error("Failed to update CV");
    }

    revalidateTag("enterprise-cvs", {});
    return data;
}

/**
 * Soft delete a CV
 */
export async function deleteEnterpriseCV(cvId: string): Promise<boolean> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const { error } = await supabase
        .from("enterprise_cvs")
        .update({ is_deleted: true })
        .eq("id", cvId)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting enterprise CV:", error);
        throw new Error("Failed to delete CV");
    }

    revalidateTag("enterprise-cvs", {});
    return true;
}

/**
 * Delete multiple CVs
 */
export async function deleteMultipleEnterpriseCVs(cvIds: string[]): Promise<boolean> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const { error } = await supabase
        .from("enterprise_cvs")
        .update({ is_deleted: true })
        .in("id", cvIds)
        .eq("user_id", user.id);

    if (error) {
        console.error("Error deleting enterprise CVs:", error);
        throw new Error("Failed to delete CVs");
    }

    revalidateTag("enterprise-cvs", {});
    return true;
}

/**
 * Get CVs by IDs
 */
export async function getEnterpriseCVsByIds(cvIds: string[]): Promise<EnterpriseCV[]> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const validIds = cvIds.filter(id =>
        id && id.trim().length > 0 && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim())
    );

    if (validIds.length === 0) {
        return [];
    }

    const { data, error } = await supabase
        .from("enterprise_cvs")
        .select("*")
        .in("id", validIds)
        .eq("user_id", user.id)
        .eq("is_deleted", false);

    if (error) {
        console.error("Supabase Error fetching enterprise CVs by IDs:", error);
        // Supabase error object usually has code, message, details, hint
        console.error("Error Details:", { code: error.code, message: error.message, details: error.details });
        throw new Error(`Failed to fetch CVs: ${error.message}`);
    }

    return data || [];
}

/**
 * Create a new bulk analysis
 */
export async function createEnterpriseAnalysis(
    payload: CreateEnterpriseAnalysisPayload
): Promise<EnterpriseAnalysis> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("enterprise_analyses")
        .insert({
            user_id: user.id,
            job_description: payload.job_description,
            job_title: payload.job_title,
            cv_ids: payload.cv_ids || [],
            total_cvs: payload.cv_ids ? payload.cv_ids.length : 0,
            status: "pending"
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating enterprise analysis:", error);
        throw new Error("Failed to create analysis");
    }

    revalidateTag("enterprise-analyses", {});
    return data;
}

/**
 * Get all analyses for the current user
 */
export async function getEnterpriseAnalyses(
    limit: number = 20,
    offset: number = 0
): Promise<{ data: EnterpriseAnalysis[]; total: number }> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const { data, error, count } = await supabase
        .from("enterprise_analyses")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error("Error fetching enterprise analyses:", error);
        throw new Error("Failed to fetch analyses");
    }

    return { data: data || [], total: count || 0 };
}

/**
 * Get analysis by ID with results
 */
export async function getEnterpriseAnalysisById(
    analysisId: string
): Promise<EnterpriseAnalysis | null> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("enterprise_analyses")
        .select("*")
        .eq("id", analysisId)
        .eq("user_id", user.id)
        .single();

    if (error) {
        console.error("Error fetching enterprise analysis:", error);
        return null;
    }

    return data;
}

/**
 * Get analysis results for an analysis
 */
export async function getEnterpriseAnalysisResults(analysisId: string) {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("enterprise_analysis_results")
        .select(`
            *,
            cv:enterprise_cvs(*)
        `)
        .eq("analysis_id", analysisId)
        .order("rank", { ascending: true });

    if (error) {
        console.error("Error fetching analysis results:", error);
        throw new Error("Failed to fetch results");
    }

    return data || [];
}

/**
 * Save analysis results
 */
export async function saveEnterpriseAnalysisResults(
    analysisId: string,
    results: Array<{
        cv_id: string;
        match_score: number;
        summary: string;
        strengths: string[];
        weaknesses: string[];
        detailed_analysis: Record<string, unknown>;
        rank: number;
    }>
): Promise<boolean> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const { error: resultsError } = await supabase
        .from("enterprise_analysis_results")
        .insert(
            results.map(r => ({
                analysis_id: analysisId,
                cv_id: r.cv_id,
                match_score: r.match_score,
                summary: r.summary,
                strengths: r.strengths,
                weaknesses: r.weaknesses,
                detailed_analysis: r.detailed_analysis,
                rank: r.rank
            }))
        );

    if (resultsError) {
        console.error("Error saving analysis results:", resultsError);
        throw new Error(`Failed to save results: ${resultsError.message || resultsError.details || "Database insertion failed"}`);
    }

    const { error: updateError } = await supabase
        .from("enterprise_analyses")
        .update({
            status: "completed",
            analyzed_count: results.length,
            completed_at: new Date().toISOString(),
            results: results
        })
        .eq("id", analysisId)
        .eq("user_id", user.id);

    if (updateError) {
        console.error("Error updating analysis status:", updateError);
    }

    // Update CV statuses
    const cvIds = results.map(r => r.cv_id);
    await supabase
        .from("enterprise_cvs")
        .update({ status: "analyzed" })
        .in("id", cvIds)
        .eq("user_id", user.id);

    revalidateTag("enterprise-analyses", {});
    revalidateTag("enterprise-cvs", {});

    return true;
}

/**
 * Save results for direct analysis (files not in DB)
 */
export async function saveDirectAnalysisResults(payload: {
    job_title?: string;
    job_description: string;
    results: any[];
}): Promise<string> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const { data: analysis, error } = await supabase
        .from("enterprise_analyses")
        .insert({
            user_id: user.id,
            job_description: payload.job_description,
            job_title: payload.job_title,
            cv_ids: [],
            total_cvs: payload.results.length,
            status: "completed",
            analyzed_count: payload.results.length,
            completed_at: new Date().toISOString(),
            results: payload.results
        })
        .select()
        .single();

    if (error) {
        console.error("Error saving direct analysis:", error);
        throw new Error(`Failed to save analysis history: ${error.message || error.details || "Database error"}`);
    }

    const resultsToInsert = [];
    const newCvIds: string[] = [];

    for (const res of payload.results) {
        let cvId = res.cv_id;

        // Only create a new "ghost" CV if we don't already have an ID
        if (!cvId) {
            const { data: cv, error: cvError } = await supabase
                .from("enterprise_cvs")
                .insert({
                    user_id: user.id,
                    file_name: res.filename || "Unknown CV",
                    file_path: `direct-upload/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.pdf`,
                    file_size: 0,
                    mime_type: "application/pdf",
                    candidate_name: res.contact_info?.name,
                    candidate_email: res.contact_info?.email,
                    status: "analyzed",
                    is_deleted: false
                })
                .select()
                .single();

            if (cv && !cvError) {
                cvId = cv.id;
                newCvIds.push(cvId);
            }
        } else {
            newCvIds.push(cvId);
        }

        if (cvId) {
            resultsToInsert.push({
                analysis_id: analysis.id,
                cv_id: cvId,
                match_score: res.recruiter_analysis ? res.recruiter_analysis.match_percentage : res.match_score,
                summary: res.recruiter_analysis ? res.recruiter_analysis.executive_summary : res.summary,
                strengths: res.recruiter_analysis ? res.recruiter_analysis.key_strengths : res.strengths,
                weaknesses: res.recruiter_analysis ?
                    res.recruiter_analysis.gaps_and_red_flags?.map((g: any) => `${g.severity}: ${g.issue}`) :
                    res.weaknesses,
                detailed_analysis: res.recruiter_analysis || res.detailed_analysis,
                rank: res.rank
            });
        }
    }

    if (resultsToInsert.length > 0) {
        const { error: resultsError } = await supabase
            .from("enterprise_analysis_results")
            .insert(resultsToInsert);

        if (resultsError) {
            console.error("Error inserting result rows:", resultsError);
        }
    }

    if (newCvIds.length > 0) {
        await supabase
            .from("enterprise_analyses")
            .update({ cv_ids: newCvIds })
            .eq("id", analysis.id);
    }

    revalidateTag("enterprise-analyses", {});
    revalidateTag("enterprise-cvs", {});

    return analysis.id;
}
