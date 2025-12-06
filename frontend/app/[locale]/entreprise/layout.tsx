import { checkEnterpriseAccess } from "@/lib/auth-check";
import { redirect } from "next/navigation";
import AccessDenied from "@/components/enterprise/AccessDenied";

export default async function EnterpriseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // try {
    //     await checkEnterpriseAccess();
    // } catch (error: any) {
    //     if (error.digest?.startsWith('NEXT_REDIRECT')) {
    //         throw error;
    //     }

    //     console.error("Enterprise access denied:", error.message);

    //     if (error.message.includes("Unauthorized") || error.message.includes("logged in")) {
    //         redirect("/auth/login?callbackUrl=/entreprise");
    //     }

    //     return (
    //         <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
    //             <AccessDenied />
    //         </div>
    //     );
    // }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {children}
        </div>
    );  
}
