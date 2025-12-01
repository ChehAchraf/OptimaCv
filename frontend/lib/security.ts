/**
 * Security utilities for input sanitization and validation
 * Prevents XSS, SQL Injection, and other common vulnerabilities
 */

/**
 * Sanitize HTML input to prevent XSS attacks
 * Removes potentially dangerous HTML tags and attributes
 */
export function sanitizeHtml(input: string): string {
    if (!input) return '';

    // Remove script tags and their content
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\bon\w+\s*=\s*[^\s>]*/gi, '');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove data: protocol (can be used for XSS)
    sanitized = sanitized.replace(/data:text\/html/gi, '');

    return sanitized.trim();
}

/**
 * Sanitize string input for safe display
 * Escapes HTML special characters
 */
export function escapeHtml(input: string): string {
    if (!input) return '';

    const htmlEscapeMap: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
    };

    return input.replace(/[&<>"'\/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Validate and sanitize email addresses
 */
export function sanitizeEmail(email: string): string | null {
    if (!email) return null;

    const trimmed = email.trim().toLowerCase();

    // Basic email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(trimmed)) {
        return null;
    }

    return trimmed;
}

/**
 * Sanitize phone numbers (remove all non-numeric characters except +)
 */
export function sanitizePhone(phone: string): string {
    if (!phone) return '';

    return phone.replace(/[^\d+]/g, '').trim();
}

/**
 * Sanitize file names to prevent directory traversal attacks
 */
export function sanitizeFileName(fileName: string): string {
    if (!fileName) return '';

    // Remove path traversal attempts
    let sanitized = fileName.replace(/\.\./g, '');

    // Remove path separators
    sanitized = sanitized.replace(/[\/\\]/g, '');

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Limit to safe characters
    sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_');

    return sanitized;
}

/**
 * Validate file upload based on extension and size
 */
export interface FileValidationOptions {
    allowedExtensions: string[];
    maxSizeInMB: number;
}

export function validateFile(
    file: File,
    options: FileValidationOptions
): { valid: boolean; error?: string } {
    const { allowedExtensions, maxSizeInMB } = options;

    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        return {
            valid: false,
            error: `File size exceeds ${maxSizeInMB}MB limit`,
        };
    }

    // Check file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        return {
            valid: false,
            error: `File type .${fileExtension} is not allowed. Allowed types: ${allowedExtensions.join(', ')}`,
        };
    }

    return { valid: true };
}

/**
 * Sanitize URL to prevent malicious redirects
 */
export function sanitizeUrl(url: string): string | null {
    if (!url) return null;

    try {
        const urlObj = new URL(url, window.location.origin);

        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return null;
        }

        return urlObj.toString();
    } catch {
        // If URL is relative, return it as-is if it doesn't start with protocol
        if (!url.includes(':')) {
            return url;
        }
        return null;
    }
}

/**
 * Rate limiting check (client-side)
 * Returns true if action is allowed, false if rate limited
 */
export function checkRateLimit(
    key: string,
    maxAttempts: number,
    windowMs: number
): boolean {
    if (typeof window === 'undefined') return true;

    const now = Date.now();
    const storageKey = `ratelimit_${key}`;

    try {
        const data = localStorage.getItem(storageKey);
        const attempts = data ? JSON.parse(data) : [];

        // Filter out old attempts outside the time window
        const recentAttempts = attempts.filter((timestamp: number) =>
            now - timestamp < windowMs
        );

        if (recentAttempts.length >= maxAttempts) {
            return false; // Rate limited
        }

        // Add current attempt
        recentAttempts.push(now);
        localStorage.setItem(storageKey, JSON.stringify(recentAttempts));

        return true;
    } catch (error) {
        console.error('Rate limit check failed:', error);
        return true; // Fail open to not break functionality
    }
}

/**
 * Generate a secure random string for CSRF tokens, nonces, etc.
 */
export function generateSecureToken(length: number = 32): string {
    if (typeof window === 'undefined' || !window.crypto) {
        // Fallback for environments without crypto
        return Math.random().toString(36).substring(2, length + 2);
    }

    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);

    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate password strength
 */
export interface PasswordStrength {
    score: number; // 0-4
    feedback: string[];
    valid: boolean;
}

export function validatePasswordStrength(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    if (!password) {
        return { score: 0, feedback: ['Password is required'], valid: false };
    }

    // Length check
    if (password.length >= 8) score++;
    else feedback.push('Password should be at least 8 characters long');

    // Uppercase check
    if (/[A-Z]/.test(password)) score++;
    else feedback.push('Add uppercase letters');

    // Lowercase check
    if (/[a-z]/.test(password)) score++;
    else feedback.push('Add lowercase letters');

    // Number check
    if (/\d/.test(password)) score++;
    else feedback.push('Add numbers');

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    else feedback.push('Add special characters (!@#$%...)');

    // Additional length bonus
    if (password.length >= 12) score++;

    const valid = score >= 3; // Require at least 3 criteria

    return { score: Math.min(score, 4), feedback, valid };
}

/**
 * Debounce function to prevent excessive API calls
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

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit execution rate
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
