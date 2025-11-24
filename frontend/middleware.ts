import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Security: Validate locale parameter
    const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
    if (localeMatch) {
        const locale = localeMatch[1];
        if (!routing.locales.includes(locale as any)) {
            // Redirect to default locale if invalid
            const url = request.nextUrl.clone();
            url.pathname = `/${routing.defaultLocale}${pathname.slice(3)}`;
            return NextResponse.redirect(url);
        }
    }

    // Apply next-intl middleware
    return intlMiddleware(request);
}

export const config = {
    // Match all pathnames except for
    // - API routes, Next.js internals, static files
    matcher: [
        '/((?!api|_next|_vercel|.*\\..*).*)',
        '/',
        '/(ar|en|fr)/:path*'
    ]
};
