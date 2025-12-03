import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
        'Missing Supabase admin credentials. ' +
        'Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your environment variables.'
    );
}

let adminClientInstance: ReturnType<typeof createClient> | null = null;

export function getAdminClient() {
    if (!adminClientInstance) {
        adminClientInstance = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }

    return adminClientInstance;
}

export async function getAllUsers() {
    const admin = getAdminClient();
    const { data, error } = await admin.auth.admin.listUsers();

    if (error) {
        throw new Error(`Failed to fetch users: ${error.message}`);
    }

    return data.users;
}

export async function deleteUser(userId: string) {
    const admin = getAdminClient();
    const { data, error } = await admin.auth.admin.deleteUser(userId);

    if (error) {
        throw new Error(`Failed to delete user: ${error.message}`);
    }

    return data;
}
