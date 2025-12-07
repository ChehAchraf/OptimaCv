import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { generatePdf, getReportHTML } from '@/lib/services/pdf-service';
import { AnalysisResult } from '@/types/dashboard';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export interface ExportAnalysisParams {
    result: AnalysisResult;
    score: number;
    config: { label: string; color: string };
    date: string;
    filename: string;
    actionType: 'export' | 'share';
}

export type ExportStatus = 'idle' | 'preparing-html' | 'rendering' | 'downloading' | 'success' | 'error';

export type UseExportPdfReturn = UseMutationResult<
    { filename: string },
    Error,
    ExportAnalysisParams,
    unknown
> & {
    exportStatus: ExportStatus;
    statusLabel: string;
    isPreparing: boolean;
    isRendering: boolean;
    isDownloading: boolean;
};

export function useExportPdf() {
    const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');

    const mutation = useMutation({
        mutationKey: ['export-analysis'],
        mutationFn: async ({ result, score, config, date, filename }: ExportAnalysisParams) => {
            setExportStatus('preparing-html');
            const htmlContent = getReportHTML(result, score, config, date);

            await generatePdf({
                htmlContent,
                filename,
                onStatusChange: (status) => setExportStatus(status)
            });

            return { filename };
        },
        onSuccess: (data, variables) => {
            setExportStatus('success');

            if (variables.actionType === 'share') {
                toast({
                    title: "Ready to Share on LinkedIn",
                    description: "PDF downloaded! Click below to open LinkedIn and upload the file.",
                    action: (
                        <div
                            className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer border-slate-200 ml-auto"
                            onClick={() => window.open('https://www.linkedin.com/feed/', '_blank')}
                        >
                            Open LinkedIn
                        </div>
                    ),
                    duration: 10000,
                });
            } else {
                toast({
                    title: "Report Exported",
                    description: `Successfully downloaded ${data.filename}.pdf`,
                });
            }

            // Reset status after delay
            setTimeout(() => setExportStatus('idle'), 3000);
        },
        onError: (error) => {
            setExportStatus('error');
            console.error("Export failed:", error);

            toast({
                variant: 'destructive',
                title: "Export Failed",
                description: "There was an error generating the PDF report. Please try again.",
            });
        }
    });

    const getStatusLabel = () => {
        switch (exportStatus) {
            case 'preparing-html': return 'Preparing components...';
            case 'rendering': return 'Rendering image...';
            case 'downloading': return 'Downloading report...';
            case 'success': return 'Complete!';
            case 'error': return 'Failed';
            default: return 'Loading...';
        }
    };

    return {
        ...mutation,
        exportStatus,
        statusLabel: getStatusLabel(),
        isPreparing: exportStatus === 'preparing-html',
        isRendering: exportStatus === 'rendering',
        isDownloading: exportStatus === 'downloading'
    };
}
