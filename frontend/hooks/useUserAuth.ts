import { useAuth as useContextAuth } from '@/components/providers/AuthProvider';

/**
 * Custom hook to access user authentication state
 * Re-exports functionality from AuthProvider for cleaner imports
 */
export const useUserAuth = () => {
    return useContextAuth();
};
