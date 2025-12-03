import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
    // 1. Update Supabase session (handles auth token refresh)
    const supabaseResponse = await updateSession(request);

    // 2. Run i18n Middleware (handles locale routing)
    const intlResponse = intlMiddleware(request);

    // 3. Merge cookies from Supabase response to Intl response
    // This ensures that if Supabase refreshed the token, we pass that back to the client
    // along with any locale cookies set by next-intl.
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
        // - /.*\\..* (Static files with extensions, e.g. .css, .js, .png, .jpg)
        '/((?!api|_next|_vercel|images|.*\\..*).*)'
    ]
};
