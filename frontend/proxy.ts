import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
    console.log(`Proxy Middleware: Processing ${request.nextUrl.pathname}`);

    // Update Supabase session (handles auth token refresh)
    const { response: supabaseResponse, user } = await updateSession(request);
    console.log(`Proxy Middleware: User authenticated: ${!!user}`);

    // Protect routes
    const protectedPaths = ['/entreprise', '/build-cv', '/CV_analyze', '/interview',];
    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.includes(path));

    if (isProtected && !user) {
        const locale = request.nextUrl.pathname.split('/')[1] || 'en';
        const validLocale = ['en', 'fr', 'ar'].includes(locale) ? locale : 'en';
        return NextResponse.redirect(new URL(`/${validLocale}/auth/login`, request.url));
    }

    // Run i18n Middleware (handles locale routing)
    const intlResponse = intlMiddleware(request);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
        intlResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    return intlResponse;
}

export const config = {
    // Match all pathnames except for
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /_vercel (Vercel internals)
    // - /favicon.ico, /sitemap.xml, /robots.txt (static files)
    matcher: [
        // Match all pathnames except for:
        // - /api (API routes)
        // - /_next (Next.js internals)
        // - /_vercel (Vercel internals)
        // - /images (Static images)
        // - /.*\..* (Static files with extensions, e.g. .css, .js, .png, .jpg)
        '/((?!api|_next|_vercel|images|.*\\..*).*)'
    ]
};
