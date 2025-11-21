"use server";

import path from "@/app/axios/path";
import { CVPayload } from "@/types/type";


export async function analyzeCv(payload: CVPayload) {
    const res = await path.post("/analysis/analyze-full-cv/", payload);
    console.log(res.data, "res.data");
    
    return res.data;
}
