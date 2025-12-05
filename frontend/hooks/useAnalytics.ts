"use client";

import { useEffect } from "react";
import { UAParser } from "ua-parser-js";
import { updateUserOS } from "@/app/actions/updateUserOS";

export function useAnalytics() {
    useEffect(() => {
        const detectAndSaveOS = async () => {
            // 1. Detect OS
            const parser = new UAParser();
            const result = parser.getResult();
            const osName = result.os.name;

            if (osName) {
                // 2. Save to DB via Server Action
                // We fire and forget - no need to await or block UI
                try {
                    await updateUserOS(osName);
                    console.log(`Analytics: OS detected as ${osName}`);
                } catch (err) {
                    console.error("Analytics Error:", err);
                }
            }
        };

        detectAndSaveOS();
    }, []); // Run once on mount
}
