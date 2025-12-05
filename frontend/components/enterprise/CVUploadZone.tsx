"use client";

import { useState, useCallback } from "react";
import { Upload, X, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadEnterpriseCVs } from "@/app/actions/enterpriseActions";
import { useToast } from "@/hooks/use-toast";

interface CVUploadZoneProps {
    onUploadComplete: () => void;
}

export default function CVUploadZone({ onUploadComplete }: CVUploadZoneProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const { toast } = useToast();

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files).filter(
            file => file.type === "application/pdf"
        );

        setFiles(prev => [...prev, ...droppedFiles]);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...selectedFiles]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            // Create FormData and upload to server action
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files", file);
            });

            await uploadEnterpriseCVs(formData);

            toast({
                title: "Success",
                description: `${files.length} CV(s) uploaded successfully`,
            });

            setFiles([]);
            onUploadComplete();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to upload CVs",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                className={`
                    border-2 border-dashed rounded-xl p-8 text-center transition-all
                    ${isDragOver
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-700 hover:border-blue-400"
                    }
                `}
            >
                <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="cv-upload"
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                        <div className={`p-4 rounded-full ${isDragOver ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-800"}`}>
                            <Upload className={`w-8 h-8 ${isDragOver ? "text-blue-500" : "text-gray-500"}`} />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-gray-900 dark:text-white">
                                Drop CVs here or click to upload
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                PDF files only, up to 10MB each
                            </p>
                        </div>
                    </div>
                </label>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {files.length} file(s) selected
                    </p>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-red-500" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                    className="text-gray-500 hover:text-red-500"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="w-full"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload {files.length} CV(s)
                            </>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}
