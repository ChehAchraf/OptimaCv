import PricingClient from "@/components/pricing/PricingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing Plans - OptimaCv",
    description: "Choose the perfect plan for your career needs. From free basic tools to premium enterprise solutions.",
};

export default function PricingPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <PricingClient />
        </div>
    );
}
