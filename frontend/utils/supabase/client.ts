import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables are not configured. Authentication features will not work.')
}

export const createClient = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    console.log('🔧 Client Supabase Config:', {
        hasUrl: !!url,
        urlLength: url?.length,
        hasKey: !!key,
        keyLength: key?.length,
    });

    return createBrowserClient(
        url || 'https://placeholder.supabase.co',
        key || 'placeholder-key'
    );
};
