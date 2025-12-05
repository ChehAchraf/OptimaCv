'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/type';
import { createUserProfile } from '@/app/actions/createUserProfile';

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        let mounted = true;

        const checkSession = async () => {

            try {
                const cookieNames = document.cookie.split(';').map(c => c.trim().split('=')[0])

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Session check timeout')), 5000)
                );

                const { data, error } = await Promise.race([
                    supabase.auth.getSession(),
                    timeoutPromise
                ]) as any;

                if (!mounted) return;

                if (error) {
                    setUser(null);
                } else {

                    setUser(data.session?.user ?? null);
                    if (data.session?.user) {
                        createUserProfile();
                    }
                }
            } catch (error) {
                if (mounted) setUser(null);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        checkSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) {
                setUser(session?.user ?? null);
                if (session?.user) {
                    createUserProfile();
                }
                setIsLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [supabase]);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        setUser(null);
    };

    const authValue = {
        user,
        isAuthenticated: !!user,
        isLoading,
        signOut,
    };

    if (process.env.NODE_ENV === 'development') {
        console.log('📊 AuthProvider value:', {
            isAuthenticated: authValue.isAuthenticated,
            userEmail: user?.email,
            isLoading
        });
    }

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
