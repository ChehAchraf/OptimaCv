"use server";

import { CVBuildPayload, CVBuildResponse } from "@/types/type";
import path from "@/app/axios/path";



export async function generateCV(payload: CVBuildPayload): Promise<CVBuildResponse> {
    try {
        const res = await path.post<CVBuildResponse>(
            "/analysis/generator/build-cv/",
            payload
        );
        return res.data;
    } catch (err: any) {
        throw new Error(err.response?.data?.detail || err.message || "Erreur du serveur");
    }
}
