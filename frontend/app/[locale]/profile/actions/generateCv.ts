"use server";

import { CompanyRankPayload, CompanyRankResponse } from "@/types/type";
import path from "@/app/axios/path";
import { checkUserAccess } from "@/lib/auth-check";

export async function generateCV(payload: CompanyRankPayload): Promise<CompanyRankResponse> {
    // Check authentication and ban status
    await checkUserAccess();

    try {
        const { jobDescription, files } = payload;

        const formData = new FormData();
        formData.append('job_description', jobDescription);

        const filesArray = Array.from(files);
        filesArray.forEach((file) => {
            formData.append('cv_pdfs', file);
        });

        const { data } = await path.post('/analysis/companies/rank-candidates/', formData);
        return data;
    } catch (err: any) {
        throw new Error(err.response?.data?.detail || err.message || "Erreur du serveur");
    }
}
