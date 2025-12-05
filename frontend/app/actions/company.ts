"use server";

import { CompanyRankPayload, CompanyRankResponse } from "@/types/type";
import path from "@/app/axios/path";
import { checkUserAccess } from "@/lib/auth-check";
import { handleApiError } from "@/lib/api/handle-api-error";

/**
 * Ranks candidates based on job description and CV files
 * Used by enterprise features to filter and rank multiple CVs at once
 */
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
