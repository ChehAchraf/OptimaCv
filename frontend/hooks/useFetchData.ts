import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import path from '@/app/axios/path';

// Define a generic error type
interface ApiError {
    message: string;
    code?: string;
    details?: any;
}

/**
 * Custom hook to fetch data using React Query
 * @param key Unique key for caching
 * @param url URL endpoint to fetch data from
 * @param options React Query options
 * @returns Query result
 */
export function useFetchData<TData = any, TError = ApiError>(
    key: string[],
    url: string,
    options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
    return useQuery<TData, TError>({
        queryKey: key,
        queryFn: async () => {
            const { data } = await path.get<TData>(url);
            return data;
        },
        ...options
    });
}
