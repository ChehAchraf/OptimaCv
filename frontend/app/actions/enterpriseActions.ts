"use server";

import { createClient } from "@/lib/supabase/server";
import { checkUserAccess } from "@/lib/auth-check";
import {
    EnterpriseCV,
    EnterpriseAnalysis,
    CreateEnterpriseCVPayload,
    CreateEnterpriseAnalysisPayload,
    EnterpriseCVFilters
} from "@/types/enterprise";
import { revalidateTag } from "next/cache";

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
export async function uploadEnterpriseCVs(formData: FormData): Promise<EnterpriseCV[]> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
        throw new Error("No files provided");
    }

    const uploadedCVs: EnterpriseCV[] = [];

    for (const file of files) {
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
            console.error("Error uploading file:", uploadError);
            // Continue with other files even if one fails
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
            console.error("Error saving CV metadata:", dbError);
            // Try to delete the uploaded file
            await supabase.storage.from("enterprise-cvs").remove([filePath]);
            continue;
        }

        uploadedCVs.push(data);
    }

    if (uploadedCVs.length === 0) {
        throw new Error("Failed to upload any CVs");
    }

    revalidateTag("enterprise-cvs", {});
    return uploadedCVs;
}

/**
 * Get CV files from storage for analysis
 */
export async function getEnterpriseCVFiles(cvIds: string[]): Promise<File[]> {
    const user = await checkUserAccess();
    const supabase = await createClient();

    // Get CV metadata
    const { data: cvs, error } = await supabase
        .from("enterprise_cvs")
        .select("*")
        .in("id", cvIds)
        .eq("user_id", user.id)
        .eq("is_deleted", false);

    if (error || !cvs) {
        console.error("Error fetching CVs:", error);
        throw new Error("Failed to fetch CVs");
    }

    const files: File[] = [];

    for (const cv of cvs) {
        // Download file from storage
        const { data, error: downloadError } = await supabase.storage
            .from("enterprise-cvs")
            .download(cv.file_path);

        if (downloadError) {
            console.error(`Error downloading CV ${cv.file_name}:`, downloadError);
            continue;
        }

        // Convert Blob to File
        const file = new File([data], cv.file_name, { type: "application/pdf" });
        files.push(file);
    }

    return files;
}

/**
 * Update CV details
 */
export async function updateEnterpriseCV(
    cvId: string,
    updates: Partial<Pick<EnterpriseCV, 'candidate_name' | 'candidate_email' | 'tags' | 'status'>>
): Promise<EnterpriseCV> {
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

    const { data, error } = await supabase
        .from("enterprise_cvs")
        .select("*")
        .in("id", cvIds)
        .eq("user_id", user.id)
        .eq("is_deleted", false);

    if (error) {
        console.error("Error fetching enterprise CVs by IDs:", error);
        throw new Error("Failed to fetch CVs");
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
        throw new Error("Failed to save results");
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
        throw new Error("Failed to save analysis history");
    }

    const resultsToInsert = [];
    const newCvIds: string[] = [];

    for (const res of payload.results) {
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
            newCvIds.push(cv.id);
            resultsToInsert.push({
                analysis_id: analysis.id,
                cv_id: cv.id,
                match_score: res.match_score,
                summary: res.summary,
                strengths: res.strengths,
                weaknesses: res.weaknesses,
                detailed_analysis: res.detailed_analysis,
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
