import { NextResponse, NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
        return response;
    } catch (err: any) {
        const requestUrl = new URL(request.url);
        const origin = requestUrl.origin;
        return NextResponse.redirect(
            `${origin}/en/auth/login?error=${encodeURIComponent(err.message || 'UnexpectedError')}`
        );
    }
}
