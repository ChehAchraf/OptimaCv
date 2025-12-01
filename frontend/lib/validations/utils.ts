import { ZodError, ZodSchema } from 'zod';

/**
 * Validates data against a Zod schema and returns formatted errors
 */
export function validateData<T>(
    schema: ZodSchema<T>,
    data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
    try {
        const validatedData = schema.parse(data);
        return { success: true, data: validatedData };
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedErrors: Record<string, string[]> = {};

            error.issues.forEach((err) => {
                const path = err.path.join('.');
                if (!formattedErrors[path]) {
                    formattedErrors[path] = [];
                }
                formattedErrors[path].push(err.message);
            });

            return { success: false, errors: formattedErrors };
        }

        return {
            success: false,
            errors: { _general: ['An unexpected validation error occurred'] },
        };
    }
}

/**
 * Validates data and throws an error if validation fails
 */
export function validateOrThrow<T>(schema: ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
}

/**
 * Safely validates data and returns null if validation fails
 */
export function validateSafe<T>(schema: ZodSchema<T>, data: unknown): T | null {
    const result = schema.safeParse(data);
    return result.success ? result.data : null;
}

/**
 * Formats Zod errors into a user-friendly string
 */
export function formatZodErrors(error: ZodError): string {
    return error.issues.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
}

/**
 * Gets the first error message from validation errors
 */
export function getFirstError(errors: Record<string, string[]>): string | null {
    const firstKey = Object.keys(errors)[0];
    return firstKey ? errors[firstKey][0] : null;
}

/**
 * Converts FileList to File array for validation
 */
export function fileListToArray(fileList: FileList | null): File[] {
    if (!fileList) return [];
    return Array.from(fileList);
}

/**
 * Validates file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
}

/**
 * Validates file size (size in bytes)
 */
export function validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
