"use client";

import { useAnalytics } from "@/hooks/useAnalytics";

export default function AnalyticsWrapper() {
    useAnalytics();
    return null;
}
