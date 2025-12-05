"use server";

import { CVBuildPayload, CVBuildResponse } from "@/types/type";
import path from "@/app/axios/path";
import { checkUserAccess } from "@/lib/auth-check";

export async function buildCV(payload: CVBuildPayload): Promise<CVBuildResponse> {
    await checkUserAccess();

    try {
        const { data } = await path.post('/analysis/build-cv/', payload);
        return data;
    } catch (err: any) {
        throw new Error(err.response?.data?.detail || err.message || "Erreur du serveur");
    }
}
