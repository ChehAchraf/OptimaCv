
import { AnalysisResult } from '@/types/dashboard';

interface PdfConfig {
    label: string;
    color: string;
}

export const getReportHTML = (result: AnalysisResult, score: number, config: PdfConfig, date: string) => {
    const jobTitle = result.job_title || 'CV Analysis Report';
    const company = result.company_name || 'OptimaCV';

    const summary = result.cv_coach_analysis?.summary_feedback ||
        result.cv_coach_analysis?.summary ||
        result.analysis_vs_jd?.summary ||
        (typeof result.summary === 'string' ? result.summary : 'No summary available.');

    const strengths = result.cv_coach_analysis?.key_strengths ||
        result.analysis_vs_jd?.strengths ||
        result.strengths || [];
    const detailedImprovements = result.cv_coach_analysis?.critical_improvements || [];
    const simpleImprovements = result.analysis_vs_jd?.improvements || result.improvements || [];
    const hasDetailed = detailedImprovements.length > 0;

    const scoreBreakdown = result.cv_coach_analysis?.score_breakdown || {};
    const atsKeywords = result.cv_coach_analysis?.ats_keywords_missing || [];
    const primaryColor = '#0F172A'; 
    const accentColor = '#6366F1'; 
    const successColor = '#10B981';
    const warningColor = '#F59E0B'; 
    const errorColor = '#EF4444'; 

    const scoreColor = score >= 70 ? successColor : score >= 50 ? warningColor : errorColor;

    return `
    <div id="pdf-report-root" class="pdf-report-root">
        <style id="report-styles">
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Outfit:wght@500;700;800&display=swap');
            
            * { box-sizing: border-box; }
            
            .pdf-report-root {
                margin: 0;
                padding: 0;
                font-family: 'Inter', sans-serif;
                background: #f3f4f6;
                -webkit-font-smoothing: antialiased;
                color: #334155;
            }

            .page-container {
                width: 210mm;
                min-height: 297mm;
                margin: 0 auto;
                background: #ffffff;
                position: relative;
                overflow: hidden;
            }

            /* Header */
            .header {
                background-color: ${primaryColor};
                color: white;
                padding: 40px 50px;
                position: relative;
            }
            
            .header::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 6px;
                background: linear-gradient(90deg, ${accentColor}, ${successColor});
            }

            .brand-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
            }

            .brand-logo {
                font-family: 'Outfit', sans-serif;
                font-weight: 800;
                font-size: 24px;
                letter-spacing: -0.5px;
                display: flex;
                align-items: center;
                gap: 10px;
                color: white;
            }
            
            .brand-logo span { color: ${accentColor}; }

            .report-date {
                font-size: 14px;
                opacity: 0.8;
                font-weight: 500;
                background: rgba(255,255,255,0.1);
                padding: 6px 14px;
                border-radius: 20px;
                color: white;
            }

            .title-row h1 {
                font-family: 'Outfit', sans-serif;
                font-size: 36px;
                font-weight: 700;
                margin: 0;
                line-height: 1.2;
                color: white;
            }
            
            .title-row h2 {
                font-family: 'Inter', sans-serif;
                font-size: 18px;
                font-weight: 400;
                margin: 8px 0 0 0;
                opacity: 0.9;
                color: #cbd5e1;
            }

            /* Layout */
            .content-grid {
                display: flex;
                min-height: 230mm;
            }

            .main-column {
                width: 65%;
                padding: 40px 50px;
                border-right: 1px solid #f1f5f9;
            }

            .sidebar {
                width: 35%;
                padding: 40px 30px;
                background-color: #F8FAFC;
            }

            /* Typography & Components */
            .section-title {
                font-family: 'Outfit', sans-serif;
                font-size: 16px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1.2px;
                color: ${primaryColor};
                margin: 0 0 20px 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .section-title::before {
                content: '';
                display: block;
                width: 4px;
                height: 18px;
                background: ${accentColor};
                border-radius: 2px;
            }

            /* AI Summary Box */
            .ai-summary-box {
                background: white;
                border-left: 4px solid ${accentColor};
                padding: 25px;
                margin-bottom: 40px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                border-radius: 0 12px 12px 0;
                position: relative;
            }
            
            .ai-icon {
                position: absolute;
                top: 20px;
                right: 20px;
                font-size: 40px;
                opacity: 0.05;
                font-family: serif;
                font-weight: bold;
                color: ${primaryColor};
            }

            .summary-text {
                font-size: 15px;
                line-height: 1.7;
                color: #334155;
                font-weight: 500;
            }

            /* Lists */
            .list-item {
                display: flex;
                gap: 15px;
                margin-bottom: 15px;
                align-items: flex-start;
            }

            .list-icon {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                margin-top: 3px;
                font-weight: bold;
                font-size: 12px;
            }
            
            .icon-check {
                background: #ecfdf5;
                color: ${successColor};
            }
            
            .icon-alert {
                background: #fef2f2;
                color: ${errorColor};
            }

            .list-content {
                font-size: 14px;
                line-height: 1.6;
                color: #475569;
            }
            
            .list-content strong {
                color: ${primaryColor};
                display: block;
                margin-bottom: 2px;
            }

            /* Sidebar Components */
            .score-card {
                background: white;
                padding: 30px 20px;
                border-radius: 20px;
                text-align: center;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                margin-bottom: 40px;
                border: 1px solid #e2e8f0;
            }

            .score-circle {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                border: 8px solid ${scoreColor};
                margin: 0 auto 15px auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: ${scoreColor};
            }

            .score-value {
                font-size: 32px;
                font-weight: 800;
                font-family: 'Outfit', sans-serif;
                line-height: 1;
            }
            
            .score-label {
                font-size: 13px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .score-verdict {
                font-size: 16px;
                font-weight: 700;
                color: ${primaryColor};
                margin-top: 5px;
            }

            /* Progress Bars */
            .metric-item {
                margin-bottom: 15px;
            }

            .metric-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                font-size: 13px;
                font-weight: 600;
                color: #475569;
            }

            .progress-track {
                height: 8px;
                background: #e2e8f0;
                border-radius: 4px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: ${accentColor};
                border-radius: 4px;
            }

            /* Tags */
            .tag-cloud {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .tag {
                padding: 6px 12px;
                background: white;
                border: 1px solid #cbd5e1;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                color: #475569;
            }
            
            .footer {
                position: absolute;
                bottom: 0;
                width: 100%;
                text-align: center;
                padding: 20px;
                font-size: 11px;
                color: #94a3b8;
                border-top: 1px solid #f1f5f9;
                background: white;
            }

        </style>

        <div class="page-container">
            <header class="header">
                <div class="brand-row">
                    <div class="brand-logo">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <rect width="24" height="24" rx="6" fill="white"/>
                           <path d="M7 12L10.5 15.5L17 8.5" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        OPTIMA<span>CV</span>
                    </div>
                    <div class="report-date">${date}</div>
                </div>
                <div class="title-row">
                    <h1>${jobTitle}</h1>
                    ${company ? `<h2>${company}</h2>` : ''}
                </div>
            </header>

            <div class="content-grid">
                <!-- Main Column -->
                <main class="main-column">
                    <!-- Executive Summary -->
                    <div class="ai-summary-box">
                        <div class="ai-icon">✨</div>
                        <h3 class="section-title" style="margin-top:0; font-size: 14px; margin-bottom: 12px;">Executive Summary</h3>
                        <div class="summary-text">
                            ${summary}
                        </div>
                    </div>

                    <!-- Strengths -->
                    <div style="margin-bottom: 40px;">
                        <h3 class="section-title">Key Strengths</h3>
                        ${strengths.slice(0, 5).map(strength => `
                            <div class="list-item">
                                <div class="list-icon icon-check">✓</div>
                                <div class="list-content">${strength}</div>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Improvements -->
                    <div>
                        <h3 class="section-title">Critical Improvements</h3>
                        ${hasDetailed ?
            (detailedImprovements as any[]).slice(0, 4).map(imp => `
                                <div class="list-item">
                                    <div class="list-icon icon-alert">!</div>
                                    <div class="list-content">
                                        <strong>${imp.section || 'General'}</strong>
                                        ${imp.issue}. <br/>
                                        <span style="color: ${accentColor}">Fix: ${imp.fix}</span>
                                    </div>
                                </div>
                            `).join('')
            :
            (simpleImprovements as string[]).slice(0, 5).map(imp => `
                                <div class="list-item">
                                    <div class="list-icon icon-alert">!</div>
                                    <div class="list-content">${imp}</div>
                                </div>
                            `).join('')
        }
                    </div>
                </main>

                <!-- Sidebar -->
                <aside class="sidebar">
                    <!-- Score Card -->
                    <div class="score-card">
                        <div class="score-circle">
                            <span class="score-value">${score}</span>
                        </div>
                        <div class="score-verdict" style="color: ${scoreColor}">${config.label}</div>
                        <div style="font-size: 12px; color: #64748b; margin-top: 5px;">Overall Match Score</div>
                    </div>

                    <!-- Metrics / Breakdown -->
                    ${Object.keys(scoreBreakdown).length > 0 ? `
                        <div style="margin-bottom: 40px;">
                            <h3 class="section-title">Analysis Metrics</h3>
                            ${Object.entries(scoreBreakdown).map(([key, val]) => `
                                <div class="metric-item">
                                    <div class="metric-header">
                                        <span>${key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                                        <span>${val}%</span>
                                    </div>
                                    <div class="progress-track">
                                        <div class="progress-fill" style="width: ${val}%"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}

                    <!-- Stats / Details -->
                     <div style="margin-bottom: 40px;">
                        <h3 class="section-title">Details</h3>
                        <table style="width: 100%; font-size: 13px; color: #475569; border-collapse: collapse;">
                            <tr>
                                <td style="padding-bottom: 8px;">Analysis ID</td>
                                <td style="text-align: right; font-family: monospace; padding-bottom: 8px;">#${result.job_title ? result.job_title.substring(0, 6).toUpperCase() : 'CV-ANA'}</td>
                            </tr>
                            <tr>
                                <td style="padding-bottom: 8px;">Format</td>
                                <td style="text-align: right; padding-bottom: 8px;">PDF/Auto</td>
                            </tr>
                        </table>
                    </div>

                    <!-- ATS Keywords -->
                    ${atsKeywords.length > 0 ? `
                        <div>
                            <h3 class="section-title">Missing Keywords</h3>
                            <div class="tag-cloud">
                                ${atsKeywords.slice(0, 10).map(kw => `<span class="tag">${kw}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}

                </aside>
            </div>

            <footer class="footer">
                Generated by OptimaCV • The #1 AI-Powered Resume Optimizer
            </footer>
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
        // Commenting this out to preserve classes for internal styles to match
        // container.querySelectorAll('*').forEach(el => el.removeAttribute('class'));

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
                const styles = clonedDoc.querySelectorAll('style:not(#report-styles), link[rel="stylesheet"]');
                styles.forEach(style => style.remove());

                // Also ensure the cloned body uses standard font in case it was on the body tag
                clonedDoc.body.style.fontFamily = 'Inter, sans-serif';
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
