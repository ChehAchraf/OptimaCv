"use server";

import { CompanyRankPayload, CompanyRankResponse, CVBuildResponse } from "@/types/type";
import { getEnterpriseCVFiles } from "./enterpriseActions";
import path from "@/app/axios/path";
import { checkUserAccess } from "@/lib/auth-check";
import { handleApiError } from "@/lib/api/handle-api-error";



export async function rankCandidates(payload: CompanyRankPayload): Promise<CompanyRankResponse> {
    await checkUserAccess();

    try {
        const { jobDescription, files } = payload;

        const formData = new FormData();
        formData.append("job_description", jobDescription);

        const filesArray = Array.from(files);
        filesArray.forEach((file) => {
            formData.append("cv_pdfs", file);
        });

        const { data } = await path.post<CompanyRankResponse>(
            "/analysis/companies/rank-candidates/",
            formData
        );
        return data;
    } catch (error) {
        handleApiError(error);
    }
}

export async function rankStoredCandidates(cvIds: string[], jobDescription: string): Promise<CompanyRankResponse> {
    await checkUserAccess();

    try {
        console.log(`[rankStoredCandidates] Fetching ${cvIds.length} CVs...`);
        const files = await getEnterpriseCVFiles(cvIds);
        console.log(`[rankStoredCandidates] Fetched ${files.length} files.`);

        if (files.length > 0) {
            console.log(`[rankStoredCandidates] First file: ${files[0].name}, size: ${files[0].size}, type: ${files[0].type}`);
        }

        if (files.length === 0) {
            throw new Error("No valid CV files found or retrieved for selected candidates.");
        }

        return await rankCandidates({
            jobDescription,
            files
        });
    } catch (error) {
        console.error("[rankStoredCandidates] Error:", error);
        handleApiError(error);
        throw error;
    }
}

export async function companyRank(payload: CompanyRankPayload): Promise<CVBuildResponse> {
    await checkUserAccess();

    try {
        const { data } = await path.post('/analysis/companies/rank-candidates/', payload);
        return data;
    } catch (err: any) {
        throw new Error(err.response?.data?.detail || err.message || "Erreur du serveur");
    }
}

