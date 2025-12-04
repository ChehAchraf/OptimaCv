"use server";

import path from "@/app/axios/path";
import { OptimizationResponse } from "@/types/cv-builder";

export async function optimizeText(text: string, context: string, job_title?: string): Promise<OptimizationResponse> {
    try {
        const res = await path.post("/builder/optimize", {
            text,
            context,
            job_title
        });
        return res.data;
    } catch (error: any) {
        console.error("Optimization failed:", error);
        throw new Error(error.response?.data?.detail || "Failed to optimize text");
    }
}
