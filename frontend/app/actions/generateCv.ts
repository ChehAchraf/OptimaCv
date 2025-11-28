"use server";

import { CompanyRankPayload, CompanyRankResponse } from "@/types/type";
import path from "@/app/axios/path";

export async function generateCV(payload: CompanyRankPayload): Promise<CompanyRankResponse> {
    try {
        const { jobDescription, files } = payload;
        const filesArray = Array.from(files);

        const { data } = await path.post('/analysis/companies/rank-candidates/', {
            job_description: jobDescription,
            cv_pdfs: filesArray,
        });
        return data;
    } catch (err: any) {
        throw new Error(err.response?.data?.detail || err.message || "Erreur du serveur");
    }
}
