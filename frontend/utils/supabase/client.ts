import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables are not configured. Authentication features will not work.')
}

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Supabase credentials not configured. Authentication features will not work.');
        }
        throw new Error('Supabase configuration is missing. Please check your environment variables.');
    }

    return createBrowserClient(url, key);
};
