"use client";

import { useState } from 'react';
import { ZodSchema } from 'zod';
import { validateData } from './utils';

export function useFormValidation<T>(schema: ZodSchema<T>) {
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const validate = (data: unknown): T | null => {
        const result = validateData(schema, data);

        if (result.success) {
            setErrors({});
            return result.data;
        } else {
            setErrors(result.errors);
            return null;
        }
    };

    const clearErrors = () => setErrors({});

    const getFieldError = (fieldName: string): string | undefined => {
        return errors[fieldName]?.[0];
    };

    const hasError = (fieldName: string): boolean => {
        return !!errors[fieldName];
    };

    return {
        errors,
        validate,
        clearErrors,
        getFieldError,
        hasError,
    };
}
