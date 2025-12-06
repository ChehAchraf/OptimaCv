import { AxiosError } from "axios";

interface ApiErrorResponse {
    detail?: string;
    message?: string;
    error?: string;
}

/**
 * Centralized API error handler
 * Extracts meaningful error messages from API responses
 */
export function handleApiError(error: unknown): never {
    if (error instanceof AxiosError) {
        const data = error.response?.data as ApiErrorResponse | undefined;
        let message =
            data?.detail ||
            data?.message ||
            data?.error ||
            error.message;

        if (typeof message === 'object') {
            try {
                message = JSON.stringify(message);
            } catch (e) {
                message = "Unknown error object";
            }
        }

        throw new Error(message);
    }

    if (error instanceof Error) {
        throw error;
    }

    throw new Error("An unexpected error occurred");
}

/**
 * Type guard to check if error is an AxiosError
 */
export function isAxiosError(error: unknown): error is AxiosError {
    return error instanceof AxiosError;
}
