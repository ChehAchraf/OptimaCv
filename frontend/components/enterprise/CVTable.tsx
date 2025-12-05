"use client";

import { useState } from "react";
import {
    FileText,
    Trash2,
    CheckCircle2,
    Clock,
    Archive,
    MoreHorizontal,
    Mail,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnterpriseCV } from "@/types/enterprise";
import { deleteEnterpriseCV, updateEnterpriseCV } from "@/app/actions/enterpriseActions";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface CVTableProps {
    cvs: EnterpriseCV[];
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
    onRefresh: () => void;
}

const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    analyzed: { label: "Analyzed", icon: CheckCircle2, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    archived: { label: "Archived", icon: Archive, color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400" },
};

export default function CVTable({ cvs, selectedIds, onSelectionChange, onRefresh }: CVTableProps) {
    const { toast } = useToast();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleSelectAll = () => {
        if (selectedIds.length === cvs.length) {
            onSelectionChange([]);
        } else {
            onSelectionChange(cvs.map(cv => cv.id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(i => i !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await deleteEnterpriseCV(id);
            toast({ title: "CV deleted successfully" });
            onRefresh();
        } catch (error) {
            toast({ title: "Failed to delete CV", variant: "destructive" });
        } finally {
            setDeletingId(null);
        }
    };

    const handleArchive = async (id: string) => {
        try {
            await updateEnterpriseCV(id, { status: "archived" });
            toast({ title: "CV archived successfully" });
            onRefresh();
        } catch (error) {
            toast({ title: "Failed to archive CV", variant: "destructive" });
        }
    };

    if (cvs.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No CVs uploaded yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Upload CVs to start building your talent pool
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left">
                            <Checkbox
                                checked={selectedIds.length === cvs.length && cvs.length > 0}
                                onCheckedChange={toggleSelectAll}
                            />
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            File Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Candidate
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                            Uploaded
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cvs.map((cv) => {
                        const status = statusConfig[cv.status];
                        const StatusIcon = status.icon;

                        return (
                            <tr
                                key={cv.id}
                                className={`
                                    hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors
                                    ${selectedIds.includes(cv.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                                `}
                            >
                                <td className="px-4 py-4">
                                    <Checkbox
                                        checked={selectedIds.includes(cv.id)}
                                        onCheckedChange={() => toggleSelect(cv.id)}
                                    />
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                            <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                                {cv.file_name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(cv.file_size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="space-y-1">
                                        {cv.candidate_name ? (
                                            <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                                                <User className="w-4 h-4 text-gray-400" />
                                                {cv.candidate_name}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">Not set</span>
                                        )}
                                        {cv.candidate_email && (
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Mail className="w-3 h-3" />
                                                {cv.candidate_email}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <Badge className={status.color}>
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {status.label}
                                    </Badge>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">
                                    {formatDistanceToNow(new Date(cv.created_at), { addSuffix: true })}
                                </td>
                                <td className="px-4 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleArchive(cv.id)}>
                                                <Archive className="w-4 h-4 mr-2" />
                                                Archive
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(cv.id)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
