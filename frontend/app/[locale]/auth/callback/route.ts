import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Auth callback handler
 * 
 * This route handles the OAuth callback after a user authenticates.
 * It also assigns the Free plan to new users who don't have any plan yet.
 * 
 * Database tables used:
 * - plans: to get the Free plan ID and duration_days
 * - user_plans: to check if user has a plan and insert new plan assignment
 */
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ locale: string }> }
) {
    try {
        const { locale } = await context.params;
        const requestUrl = new URL(request.url);
        const code = requestUrl.searchParams.get('code');
        const next = requestUrl.searchParams.get('next');
        const origin = requestUrl.origin;


        if (!code) {
            return NextResponse.redirect(`${origin}/${locale}/auth/login?error=NoCode`);
        }

        const cookieStore = await cookies();

        const redirectUrl = next ? `/${locale}${next}` : `/${locale}`;
        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';

        const finalRedirectUrl = isLocalEnv
            ? `${origin}${redirectUrl}`
            : forwardedHost
                ? `https://${forwardedHost}${redirectUrl}`
                : `${origin}${redirectUrl}`;

        let response = NextResponse.redirect(finalRedirectUrl);

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            const cookieOptions = {
                                ...options,
                                secure: isLocalEnv ? false : options.secure,
                                sameSite: 'lax' as const,
                                path: '/',
                                maxAge: 60 * 60 * 24 * 7, // 1 week
                            };
                            response.cookies.set(name, value, cookieOptions);
                        });
                    },
                },
            }
        );

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            return NextResponse.redirect(
                `${origin}/${locale}/auth/login?error=${encodeURIComponent(error.message || 'AuthCallbackError')}`
            );
        }

        if (!data?.session) {
            return NextResponse.redirect(
                `${origin}/${locale}/auth/login?error=NoSession`
            );
        }

        const userId = data.session.user.id;
        await assignFreePlanIfNeeded(supabase, userId);

        return response;
    } catch (err: any) {
        const requestUrl = new URL(request.url);
        const origin = requestUrl.origin;
        return NextResponse.redirect(
            `${origin}/en/auth/login?error=${encodeURIComponent(err.message || 'UnexpectedError')}`
        );
    }
}

/**
 * Assigns the Free plan to a user if they don't have any plan yet.
 * 
 * This function:
 * 1. Checks if the user already has a plan in user_plans
 * 2. If not, finds the Free plan from the plans table
 * 3. Creates a new user_plans entry with the Free plan
 * 
 * @param supabase - Supabase client
 * @param userId - The user's ID
 */
async function assignFreePlanIfNeeded(supabase: any, userId: string) {
    try {
        const { data: existingPlan } = await supabase
            .from('user_plans')
            .select('id')
            .eq('user_id', userId)
            .limit(1)
            .single();

        if (existingPlan) {
            return;
        }
        const { data: freePlan, error: planError } = await supabase
            .from('plans')
            .select('id, duration_days')
            .ilike('name', 'free')
            .limit(1)
            .single();

        if (planError || !freePlan) {
            console.error('Error finding Free plan:', planError?.message || 'Free plan not found');
            return;
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + (freePlan.duration_days || 30));
        const { error: insertError } = await supabase
            .from('user_plans')
            .insert({
                user_id: userId,
                plan_id: freePlan.id,
                status: 'active',
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                cv_builds_used: 0,
                cv_analyses_used: 0
            });

        if (insertError) {
            console.error('Error assigning Free plan to user:', insertError.message);
        } else {
            console.log(`✅ Free plan assigned to new user: ${userId}`);
        }
    } catch (err) {
        console.error('Error in assignFreePlanIfNeeded:', err);
    }
}
