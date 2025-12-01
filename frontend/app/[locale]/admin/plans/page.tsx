import AdminPlansClient from "@/components/admin/AdminPlansClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Manage Subscriptions - Admin Panel",
};

export default function AdminPlansPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <AdminPlansClient />
        </div>
    );
}
