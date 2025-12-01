/**
 * Accessibility utilities and helpers
 * Provides tools for WCAG 2.1 AA compliance
 */

/**
 * Check if color contrast meets WCAG AA standards
 * Minimum ratio: 4.5:1 for normal text, 3:1 for large text
 */
export function getContrastRatio(fg: string, bg: string): number {
    const getLuminance = (hex: string): number => {
        // Remove # if present
        hex = hex.replace('#', '');

        // Convert to RGB
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;

        // Calculate relative luminance
        const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
        const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
        const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

        return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
    };

    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate color contrast meets WCAG AA requirements
 */
export function meetsContrastRequirements(
    foreground: string,
    background: string,
    largeText: boolean = false
): boolean {
    const ratio = getContrastRatio(foreground, background);
    const requiredRatio = largeText ? 3 : 4.5;

    return ratio >= requiredRatio;
}

/**
 * Generate accessible ID for form controls
 */
export function generateA11yId(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${prefix}-${timestamp}-${random}`;
}

/**
 * Announce message to screen readers using ARIA live region
 */
export function announceToScreenReader(
    message: string,
    priority: 'polite' | 'assertive' = 'polite'
): void {
    if (typeof document === 'undefined') return;

    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only'; // Screen reader only
    liveRegion.textContent = message;

    document.body.appendChild(liveRegion);

    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(liveRegion);
    }, 1000);
}

/**
 * Create screen reader only class styles
 * Use this CSS class for elements that should only be visible to screen readers
 */
export const srOnlyStyles = {
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap' as const,
    borderWidth: '0',
};

/**
 * Get readable label from error code
 */
export function getAccessibleErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
        'required': 'This field is required',
        'invalid_email': 'Please enter a valid email address',
        'invalid_password': 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
        'password_mismatch': 'Passwords do not match',
        'invalid_phone': 'Please enter a valid phone number',
        'file_too_large': 'File size is too large',
        'invalid_file_type': 'File type is not supported',
        'network_error': 'Network error. Please check your connection and try again',
        'auth_error': 'Authentication failed. Please try again',
        'server_error': 'Server error. Please try again later',
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again';
}

/**
 * Focus trap for modals and dialogs
 */
export function createFocusTrap(element: HTMLElement): () => void {
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const focusableElements = Array.from(
        element.querySelectorAll<HTMLElement>(focusableSelector)
    ).filter(el => !el.hasAttribute('disabled') && el.tabIndex >= 0);

    if (focusableElements.length === 0) return () => { };

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    };

    element.addEventListener('keydown', handleTab);
    firstElement.focus();

    // Return cleanup function
    return () => {
        element.removeEventListener('keydown', handleTab);
    };
}

/**
 * Check if reduced motion is preferred by user
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration based on user preference
 */
export function getAnimationDuration(defaultMs: number): number {
    return prefersReducedMotion() ? 0 : defaultMs;
}

/**
 * Validate keyboard navigation key
 */
export function isActivationKey(event: React.KeyboardEvent): boolean {
    return event.key === 'Enter' || event.key === ' ';
}

/**
 * Format text for screen readers (e.g., numbers, dates)
 */
export function formatForScreenReader(value: string | number, type: 'number' | 'currency' | 'date' | 'time'): string {
    if (typeof window === 'undefined') return String(value);

    const locale = navigator.language || 'en-US';

    switch (type) {
        case 'number':
            return new Intl.NumberFormat(locale).format(Number(value));

        case 'currency':
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: 'USD', // Could be parameterized
            }).format(Number(value));

        case 'date':
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(new Date(value));

        case 'time':
            return new Intl.DateTimeFormat(locale, {
                hour: 'numeric',
                minute: 'numeric',
            }).format(new Date(value));

        default:
            return String(value);
    }
}

/**
 * Get ARIA label for form validation state
 */
export function getAriaValidationProps(
    error?: string,
    success?: boolean
): {
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
    'aria-errormessage'?: string;
} {
    if (error) {
        const errorId = generateA11yId('error');
        return {
            'aria-invalid': true,
            'aria-describedby': errorId,
            'aria-errormessage': errorId,
        };
    }

    if (success) {
        return {
            'aria-invalid': false,
        };
    }

    return {};
}

/**
 * Create skip navigation link props
 * Returns props object that can be spread onto an anchor element
 */
export function createSkipLink(targetId: string, label: string = 'Skip to main content') {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
            target.focus();
            target.scrollIntoView();
        }
    };

    return {
        href: `#${targetId}`,
        onClick: handleClick,
        className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:rounded",
        children: label,
    };
}
