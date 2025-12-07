
import { AnalysisResult } from '@/types/dashboard';

interface PdfConfig {
    label: string;
    color: string;
}

export const getReportHTML = (result: AnalysisResult, score: number, config: PdfConfig, date: string) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 40px; color: #000; background: #fff; width: 210mm; box-sizing: border-box;">
            <div style="border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
                <h1 style="margin: 0; font-size: 28px; color: #111;">Analysis Report</h1>
                <p style="color: #666; margin: 5px 0 0; font-size: 14px;">Generated on ${date}</p>
            </div>

            <div style="margin-bottom: 30px;">
                <h2 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px;">Overview</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Job Title:</td>
                        <td style="padding: 8px 0; color: #000;">${result.job_title || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #555;">Company:</td>
                        <td style="padding: 8px 0; color: #000;">${result.company_name || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; color: #555;">Match Score:</td>
                        <td style="padding: 8px 0;">
                            <span style="display: inline-block; padding: 4px 12px; border-radius: 4px; background-color: ${score >= 70 ? '#d1fae5' : score >= 60 ? '#fef3c7' : '#ffe4e6'}; color: ${score >= 70 ? '#065f46' : score >= 60 ? '#92400e' : '#9f1239'}; font-weight: bold;">
                                ${score}/100 - ${config.label}
                            </span>
                        </td>
                    </tr>
                </table>
            </div>

            ${result.analysis_vs_jd?.summary ? `
            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333; margin-bottom: 12px;">Executive Summary</h3>
                <p style="line-height: 1.6; font-size: 14px; color: #444; margin: 0;">
                    ${result.analysis_vs_jd.summary}
                </p>
            </div>
            ` : ''}

            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333; margin-bottom: 12px;">Key Strengths</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    ${(result.strengths || result.analysis_vs_jd?.strengths || []).slice(0, 5).map(item =>
        `<li style="margin-bottom: 8px; font-size: 14px; color: #444;">${item}</li>`
    ).join('')}
                </ul>
            </div>

            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: bold; border-bottom: 1px solid #eee; padding-bottom: 8px; color: #333; margin-bottom: 12px;">Areas for Improvement</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    ${(result.improvements || result.analysis_vs_jd?.improvements || []).slice(0, 5).map(item =>
        `<li style="margin-bottom: 8px; font-size: 14px; color: #444;">${item}</li>`
    ).join('')}
                </ul>
            </div>
            
            <div style="margin-top: 50px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
                Powered by OptimaCV
            </div>
        </div>
    `;
};


interface GeneratePdfOptions {
    htmlContent: string;
    filename: string;
    onStatusChange?: (status: 'preparing-html' | 'rendering' | 'downloading') => void;
}


/**
 * Force convert any color string to Hex/RGB using the browser's native engine.
 * This handles 'oklch', 'lch', variables, etc. by letting the browser resolve them.
 */
function toStandardColor(color: string, ctx: CanvasRenderingContext2D | null): string {
    if (!ctx || !color) return color;

    // If it's already safe, return it
    if (!color.includes('oklch') && !color.includes('var(')) {
        return color;
    }

    try {
        ctx.fillStyle = color;
        // ctx.fillStyle returns the computed hex/rgba string
        return ctx.fillStyle;
    } catch (e) {
        console.warn('Failed to convert color:', color);
        return color;
    }
}

/**
 * Sanitizes the container DOM to replace unsupported CSS (like oklch) with computed RGB values.
 * This "bakes" the browser's interpreted styles into inline styles that html2canvas understands.
 */
function sanitizeContainerStyles(container: HTMLElement) {
    const elements = container.querySelectorAll('*');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Pre-calculate convenient property lists
    const colorProps = [
        'color', 'backgroundColor', 'outlineColor',
        'textDecorationColor', 'fill', 'stroke',
        'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'
    ] as const;

    elements.forEach((el) => {
        const element = el as HTMLElement;
        const computed = window.getComputedStyle(element);

        // 1. Bake Colors (Converting oklch -> RGB/Hex)
        colorProps.forEach(prop => {
            const val = computed[prop as any];
            if (val && val !== 'none' && val !== 'transparent' && val !== 'rgba(0, 0, 0, 0)') {
                // @ts-ignore
                element.style[prop] = toStandardColor(val, ctx);
            }
        });

        // 2. Bake Border Widths/Styles (Essential for visibility)
        if (computed.borderWidth && computed.borderWidth !== '0px') {
            element.style.borderWidth = computed.borderWidth;
            element.style.borderStyle = computed.borderStyle;
        }

        // 3. Handle complex properties like boxShadow
        // If boxShadow contains oklch, it's very hard to parse safely. 
        // We act conservatively: attempt to convert or remove if dangerous.
        if (computed.boxShadow && computed.boxShadow !== 'none') {
            if (computed.boxShadow.includes('oklch')) {
                // Fallback: Simplest shadow or remove. "none" is safest to prevent crash.
                element.style.boxShadow = 'none';
            } else {
                element.style.boxShadow = computed.boxShadow;
            }
        }

        // 4. Handle gradients in background-image
        if (computed.backgroundImage && computed.backgroundImage !== 'none') {
            if (computed.backgroundImage.includes('oklch')) {
                // Remove unsupported gradients
                element.style.backgroundImage = 'none';
            }
        }
    });
}

export async function generatePdf({ htmlContent, filename, onStatusChange }: GeneratePdfOptions): Promise<void> {
    onStatusChange?.('preparing-html');

    // Dynamic imports
    const html2canvas = (await import('html2canvas')).default;
    const { jsPDF } = await import('jspdf');

    // Create container
    const container = document.createElement('div');
    container.innerHTML = htmlContent;

    // Position off-screen but visible
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.visibility = 'visible';

    // Must append to body for getComputedStyle to work
    document.body.appendChild(container);

    try {
        // Stage 2: Sanitize (Convert oklch to hex/rgb) by baking computed styles
        sanitizeContainerStyles(container);

        // Stage 2.5: Remove classes NOW that styles are baked to avoid issues
        container.querySelectorAll('*').forEach(el => el.removeAttribute('class'));

        onStatusChange?.('rendering');

        // Stage 3: Pass the sanitized node to html2canvas
        const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
            scale: 2, // Higher quality
            backgroundColor: "#ffffff",
            useCORS: true,
            logging: false,
            allowTaint: true,
            imageTimeout: 15000,
            // CRITICAL FIX: Remove all external stylesheets from the clone.
            // Since we baked all styles into inline attributes, we don't need the external CSS.
            // This prevents html2canvas from parsing Tailwind's oklch() colors in the stylesheet.
            onclone: (clonedDoc) => {
                const styles = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]');
                styles.forEach(style => style.remove());

                // Also ensure the cloned body uses standard font in case it was on the body tag
                clonedDoc.body.style.fontFamily = 'Arial, sans-serif';
            }
        });

        onStatusChange?.('downloading');

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${filename}.pdf`);

    } catch (error) {
        console.error("PDF generation error details:", error);
        throw new Error("Failed to generate PDF. The content might be too large or contain unsupported elements.");
    } finally {
        // Cleanup
        if (document.body.contains(container)) {
            document.body.removeChild(container);
        }
    }
}
