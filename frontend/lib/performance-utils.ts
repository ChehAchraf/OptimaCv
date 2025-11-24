// Performance Monitoring Utilities

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: {
    id: string;
    name: string;
    value: number;
    label: 'web-vital' | 'custom';
}) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log('[Web Vitals]', metric);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
        // Example: Send to Google Analytics
        // window.gtag?.('event', metric.name, {
        //   value: Math.round(metric.value),
        //   event_label: metric.id,
        //   non_interaction: true,
        // });
    }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Measure component render time
 */
export function measureRenderTime(componentName: string) {
    if (typeof window === 'undefined') return;

    const startMark = `${componentName}-start`;
    const endMark = `${componentName}-end`;
    const measureName = `${componentName}-render`;

    performance.mark(startMark);

    return () => {
        performance.mark(endMark);
        performance.measure(measureName, startMark, endMark);

        const measure = performance.getEntriesByName(measureName)[0];
        if (measure && process.env.NODE_ENV === 'development') {
            console.log(`[Performance] ${componentName} rendered in ${measure.duration.toFixed(2)}ms`);
        }

        // Clean up
        performance.clearMarks(startMark);
        performance.clearMarks(endMark);
        performance.clearMeasures(measureName);
    };
}
