import { NextRequest, NextResponse } from 'next/server';

interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
    message?: string;
}

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

// In-memory store for rate limiting
// For production, use Redis or similar distributed cache
const rateLimitStore: RateLimitStore = {};

/**
 * Clean up expired entries from rate limit store
 */
function cleanupExpiredEntries() {
    const now = Date.now();
    Object.keys(rateLimitStore).forEach(key => {
        if (rateLimitStore[key].resetTime < now) {
            delete rateLimitStore[key];
        }
    });
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

/**
 * Rate limiting middleware for Next.js API routes
 * @param config - Rate limit configuration
 * @returns Middleware function
 */
export function rateLimit(config: RateLimitConfig) {
    const {
        windowMs = 60 * 1000, // 1 minute default
        maxRequests = 10,
        message = 'Too many requests, please try again later.',
    } = config;

    return async function rateLimitMiddleware(
        request: NextRequest,
        identifier?: string
    ): Promise<NextResponse | null> {
        // Get client identifier (IP address or user ID)
        const clientId =
            identifier ||
            request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';

        const key = `ratelimit:${clientId}:${request.nextUrl.pathname}`;
        const now = Date.now();

        // Get or create rate limit entry
        if (!rateLimitStore[key]) {
            rateLimitStore[key] = {
                count: 0,
                resetTime: now + windowMs,
            };
        }

        const entry = rateLimitStore[key];

        // Reset if window has expired
        if (now > entry.resetTime) {
            entry.count = 0;
            entry.resetTime = now + windowMs;
        }

        // Increment request count
        entry.count++;

        // Check if limit exceeded
        if (entry.count > maxRequests) {
            const retryAfter = Math.ceil((entry.resetTime - now) / 1000);

            return NextResponse.json(
                {
                    error: message,
                    retryAfter,
                },
                {
                    status: 429,
                    headers: {
                        'Retry-After': retryAfter.toString(),
                        'X-RateLimit-Limit': maxRequests.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
                    },
                }
            );
        }

        // Add rate limit headers to response
        const remaining = maxRequests - entry.count;

        // Return null to continue processing, headers will be added by the calling code
        return null;
    };
}

/**
 * Apply rate limit headers to a response
 */
export function addRateLimitHeaders(
    response: NextResponse,
    config: {
        limit: number;
        remaining: number;
        reset: number;
    }
): NextResponse {
    response.headers.set('X-RateLimit-Limit', config.limit.toString());
    response.headers.set('X-RateLimit-Remaining', config.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(config.reset).toISOString());

    return response;
}

/**
 * Pre-configured rate limiters for common use cases
 */
export const rateLimiters = {
    // Strict: 5 requests per minute (for sensitive operations)
    strict: rateLimit({
        windowMs: 60 * 1000,
        maxRequests: 5,
        message: 'Too many requests. Please wait before trying again.',
    }),

    // Moderate: 20 requests per minute (for API calls)
    moderate: rateLimit({
        windowMs: 60 * 1000,
        maxRequests: 20,
        message: 'Rate limit exceeded. Please slow down.',
    }),

    // Lenient: 100 requests per minute (for general endpoints)
    lenient: rateLimit({
        windowMs: 60 * 1000,
        maxRequests: 100,
        message: 'Too many requests. Please try again later.',
    }),

    // Auth: 5 attempts per 15 minutes (for authentication)
    auth: rateLimit({
        windowMs: 15 * 60 * 1000,
        maxRequests: 5,
        message: 'Too many login attempts. Please try again later.',
    }),

    // File upload: 10 uploads per hour
    upload: rateLimit({
        windowMs: 60 * 60 * 1000,
        maxRequests: 10,
        message: 'Upload limit exceeded. Please try again later.',
    }),
};

/**
 * Helper function to use rate limiter in API routes
 * 
 * Example usage:
 * ```ts
 * export async function POST(request: NextRequest) {
 *   const rateLimitResult = await rateLimiters.moderate(request);
 *   if (rateLimitResult) return rateLimitResult;
 *   
 *   // Your API logic here
 *   return NextResponse.json({ success: true });
 * }
 * ```
 */
export async function withRateLimit(
    request: NextRequest,
    limiter: ReturnType<typeof rateLimit>,
    handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
    const rateLimitResult = await limiter(request);
    if (rateLimitResult) {
        return rateLimitResult;
    }

    return handler(request);
}

/**
 * Get rate limit status for a client
 */
export function getRateLimitStatus(
    clientId: string,
    pathname: string
): {
    remaining: number;
    resetTime: number;
    isLimited: boolean;
} | null {
    const key = `ratelimit:${clientId}:${pathname}`;
    const entry = rateLimitStore[key];

    if (!entry) {
        return null;
    }

    const now = Date.now();
    const isLimited = entry.count >= entry.resetTime && now < entry.resetTime;

    return {
        remaining: Math.max(0, entry.resetTime - entry.count),
        resetTime: entry.resetTime,
        isLimited,
    };
}
