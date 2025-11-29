import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
    let locale: 'en' | 'fr' | 'ar' = routing.defaultLocale as 'en' | 'fr' | 'ar';

    if (localeMatch) {
        const matchedLocale = localeMatch[1];
        if (routing.locales.includes(matchedLocale as any)) {
            locale = matchedLocale as 'en' | 'fr' | 'ar';
        } else {
            const url = request.nextUrl.clone();
            url.pathname = `/${routing.defaultLocale}${pathname.slice(3)}`;
            return NextResponse.redirect(url);
        }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase environment variables not configured. Skipping authentication.');
        return intlMiddleware(request);
    }

    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const publicRoutes = [
        '/',
        '/about',
        '/auth/login',
        '/auth/register',
        '/auth/callback'
    ];

    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    const isPublicRoute = publicRoutes.some(route =>
        pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
    );

    const isAuthCallback = pathname.includes('/auth/callback');

    if (isAuthCallback) {
        return supabaseResponse;
    }

    try {

        if (!user && !isPublicRoute) {
            const url = request.nextUrl.clone();
            url.pathname = `/${locale}/auth/register`;
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
    } catch (error) {
        console.error('Middleware Auth Error:', error);
    }

    const response = intlMiddleware(request);

    if (response) {
        supabaseResponse.cookies.getAll().forEach(cookie => {
            response.cookies.set(cookie.name, cookie.value);
        });
        return response;
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!api|_next|_vercel|.*\\..*)*)',
        '/',
        '/(ar|en|fr)/:path*'
    ]
};
