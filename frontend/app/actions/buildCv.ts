"use server";

import { CVBuildPayload, CVBuildResponse } from "@/types/type";
import path from "@/app/axios/path";

export async function buildCV(payload: CVBuildPayload): Promise<CVBuildResponse> {
    try {
        const { data } = await path.post('/analysis/build-cv/', payload);
        return data;
    } catch (err: any) {
        throw new Error(err.response?.data?.detail || err.message || "Erreur du serveur");
    }
}
