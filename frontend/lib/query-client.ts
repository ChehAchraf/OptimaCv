
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 1 minute
      staleTime: 60 * 1000,
      // Retry failed queries 1 time before showing error
      retry: 1,
      // Don't refetch on window focus for edits to prevent overwriting
      refetchOnWindowFocus: false, 
    },
    mutations: {
        // No retries for mutations (saves) to prevent duplicate side effects
        retry: 0,
    }
  },
});
