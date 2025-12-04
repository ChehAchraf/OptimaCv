"use server"

import { CompanyRankPayload, CVBuildResponse } from "@/types/type";
import path from "@/app/axios/path";


export async function companyRank(payload: CompanyRankPayload): Promise<CVBuildResponse> {
    try {
        const { data } = await path.post('/analysis/companies/rank-candidates/', payload);
        return data;
    } catch (err: any) {
        throw new Error(err.response?.data?.detail || err.message || "Erreur du serveur");
    }
}