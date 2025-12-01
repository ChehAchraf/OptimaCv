/**
 * Comprehensive error handling system
 * Provides user-friendly error messages while maintaining security
 */

export enum ErrorCode {
    // Authentication Errors
    AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
    AUTH_SESSION_EXPIRED = 'AUTH_SESSION_EXPIRED',
    AUTH_UNAUTHORIZED = 'AUTH_UNAUTHORIZED',
    AUTH_FORBIDDEN = 'AUTH_FORBIDDEN',

    // Validation Errors
    VALIDATION_INVALID_EMAIL = 'VALIDATION_INVALID_EMAIL',
    VALIDATION_INVALID_PASSWORD = 'VALIDATION_INVALID_PASSWORD',
    VALIDATION_REQUIRED_FIELD = 'VALIDATION_REQUIRED_FIELD',
    VALIDATION_INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT',

    // File Upload Errors
    FILE_TOO_LARGE = 'FILE_TOO_LARGE',
    FILE_INVALID_TYPE = 'FILE_INVALID_TYPE',
    FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',

    // Network Errors
    NETWORK_ERROR = 'NETWORK_ERROR',
    NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
    NETWORK_OFFLINE = 'NETWORK_OFFLINE',

    // API Errors
    API_RATE_LIMIT = 'API_RATE_LIMIT',
    API_SERVER_ERROR = 'API_SERVER_ERROR',
    API_NOT_FOUND = 'API_NOT_FOUND',
    API_BAD_REQUEST = 'API_BAD_REQUEST',

    // Payment Errors
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    PAYMENT_DECLINED = 'PAYMENT_DECLINED',
    PAYMENT_INVALID_CARD = 'PAYMENT_INVALID_CARD',

    // Business Logic Errors
    INSUFFICIENT_CREDITS = 'INSUFFICIENT_CREDITS',
    PLAN_LIMIT_EXCEEDED = 'PLAN_LIMIT_EXCEEDED',
    SUBSCRIPTION_REQUIRED = 'SUBSCRIPTION_REQUIRED',

    // Unknown Error
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
    code: ErrorCode;
    message: string;
    userMessage: string;
    statusCode: number;
    details?: any;
    timestamp: string;
}

/**
 * Create a standardized error object
 */
export function createError(
    code: ErrorCode,
    message: string,
    userMessage?: string,
    statusCode: number = 500,
    details?: any
): AppError {
    return {
        code,
        message,
        userMessage: userMessage || getUserFriendlyMessage(code),
        statusCode,
        details,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Get user-friendly error messages
 * These are safe to display to end users
 */
function getUserFriendlyMessage(code: ErrorCode): string {
    const messages: Record<ErrorCode, string> = {
        // Authentication
        [ErrorCode.AUTH_INVALID_CREDENTIALS]:
            'Invalid email or password. Please try again.',
        [ErrorCode.AUTH_SESSION_EXPIRED]:
            'Your session has expired. Please sign in again.',
        [ErrorCode.AUTH_UNAUTHORIZED]:
            'You need to sign in to access this feature.',
        [ErrorCode.AUTH_FORBIDDEN]:
            'You don\'t have permission to perform this action.',

        // Validation
        [ErrorCode.VALIDATION_INVALID_EMAIL]:
            'Please enter a valid email address.',
        [ErrorCode.VALIDATION_INVALID_PASSWORD]:
            'Password must be at least 8 characters with uppercase, lowercase, and numbers.',
        [ErrorCode.VALIDATION_REQUIRED_FIELD]:
            'This field is required.',
        [ErrorCode.VALIDATION_INVALID_FORMAT]:
            'Please check the format and try again.',

        // File Upload
        [ErrorCode.FILE_TOO_LARGE]:
            'File size is too large. Please upload a smaller file.',
        [ErrorCode.FILE_INVALID_TYPE]:
            'File type is not supported. Please upload a different file.',
        [ErrorCode.FILE_UPLOAD_FAILED]:
            'File upload failed. Please try again.',

        // Network
        [ErrorCode.NETWORK_ERROR]:
            'Network error. Please check your connection and try again.',
        [ErrorCode.NETWORK_TIMEOUT]:
            'Request timed out. Please try again.',
        [ErrorCode.NETWORK_OFFLINE]:
            'You appear to be offline. Please check your internet connection.',

        // API
        [ErrorCode.API_RATE_LIMIT]:
            'Too many requests. Please wait a moment and try again.',
        [ErrorCode.API_SERVER_ERROR]:
            'Something went wrong. Please try again later.',
        [ErrorCode.API_NOT_FOUND]:
            'The requested resource was not found.',
        [ErrorCode.API_BAD_REQUEST]:
            'Invalid request. Please check your input and try again.',

        // Payment
        [ErrorCode.PAYMENT_FAILED]:
            'Payment failed. Please try again or use a different payment method.',
        [ErrorCode.PAYMENT_DECLINED]:
            'Your payment was declined. Please check your card details or try another card.',
        [ErrorCode.PAYMENT_INVALID_CARD]:
            'Invalid card details. Please check and try again.',

        // Business Logic
        [ErrorCode.INSUFFICIENT_CREDITS]:
            'You don\'t have enough credits to perform this action.',
        [ErrorCode.PLAN_LIMIT_EXCEEDED]:
            'You\'ve reached your plan limit. Please upgrade to continue.',
        [ErrorCode.SUBSCRIPTION_REQUIRED]:
            'This feature requires an active subscription.',

        // Unknown
        [ErrorCode.UNKNOWN_ERROR]:
            'An unexpected error occurred. Please try again later.',
    };

    return messages[code] || messages[ErrorCode.UNKNOWN_ERROR];
}

/**
 * Parse HTTP error responses
 */
export function parseApiError(error: any): AppError {
    // Network errors
    if (!navigator.onLine) {
        return createError(
            ErrorCode.NETWORK_OFFLINE,
            'User is offline',
            undefined,
            0
        );
    }

    // Timeout errors
    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        return createError(
            ErrorCode.NETWORK_TIMEOUT,
            'Request timeout',
            undefined,
            408
        );
    }

    // HTTP response errors
    if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
            case 400:
                return createError(
                    ErrorCode.API_BAD_REQUEST,
                    data?.message || 'Bad request',
                    data?.userMessage,
                    400,
                    data?.details
                );

            case 401:
                return createError(
                    ErrorCode.AUTH_UNAUTHORIZED,
                    data?.message || 'Unauthorized',
                    data?.userMessage,
                    401
                );

            case 403:
                return createError(
                    ErrorCode.AUTH_FORBIDDEN,
                    data?.message || 'Forbidden',
                    data?.userMessage,
                    403
                );

            case 404:
                return createError(
                    ErrorCode.API_NOT_FOUND,
                    data?.message || 'Not found',
                    data?.userMessage,
                    404
                );

            case 429:
                return createError(
                    ErrorCode.API_RATE_LIMIT,
                    data?.message || 'Rate limit exceeded',
                    data?.userMessage,
                    429,
                    data?.retryAfter
                );

            case 500:
            case 502:
            case 503:
            case 504:
                return createError(
                    ErrorCode.API_SERVER_ERROR,
                    data?.message || 'Server error',
                    undefined,
                    status
                );

            default:
                return createError(
                    ErrorCode.UNKNOWN_ERROR,
                    `HTTP ${status}: ${data?.message || 'Unknown error'}`,
                    undefined,
                    status
                );
        }
    }

    // Generic network error
    return createError(
        ErrorCode.NETWORK_ERROR,
        error.message || 'Network error',
        undefined,
        0
    );
}

/**
 * Log error for monitoring (sanitized for production)
 */
export function logError(error: AppError | Error, context?: any): void {
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', error);
        if (context) {
            console.error('Context:', context);
        }
    } else {
        // In production, send to error tracking service (e.g., Sentry)
        // Only send sanitized error information
        const sanitizedError = error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
                name: error.name,
            }
            : {
                code: error.code,
                message: error.message,
                statusCode: error.statusCode,
                timestamp: error.timestamp,
            };

        // TODO: Integrate with error tracking service
        // sentry.captureException(sanitizedError, { extra: context });
    }
}

/**
 * Error boundary helper for React
 */
export function getErrorDisplayInfo(error: Error | AppError): {
    title: string;
    message: string;
    action?: string;
} {
    if ('code' in error) {
        return {
            title: 'Oops! Something went wrong',
            message: error.userMessage,
            action: error.code === ErrorCode.AUTH_SESSION_EXPIRED ? 'Sign in again' : 'Try again',
        };
    }

    return {
        title: 'Unexpected Error',
        message: 'An unexpected error occurred. Our team has been notified.',
        action: 'Refresh page',
    };
}

/**
 * Retry logic for failed requests
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    let lastError: any;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;

            // Don't retry on client errors (4xx)
            if (error instanceof Error && 'statusCode' in error) {
                const statusCode = (error as any).statusCode;
                if (statusCode >= 400 && statusCode < 500) {
                    throw error;
                }
            }

            // Exponential backoff
            if (i < maxRetries - 1) {
                const delay = baseDelay * Math.pow(2, i) + Math.random() * 100;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError;
}
