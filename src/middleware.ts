import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildLoginModalHomePath } from '@/lib/auth/loginModal';

function decodeJwtPayload(token: string) {
    const [, rawPayload] = token.split('.');
    if (!rawPayload) return null;

    const normalized = rawPayload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
    return JSON.parse(atob(padded));
}

function isExpired(payload: any) {
    return typeof payload?.exp === 'number' && payload.exp * 1000 < Date.now();
}

export function middleware(request: NextRequest) {
    const { pathname, origin, search } = request.nextUrl;

    if (
        pathname.startsWith('/api/auth/') ||
        pathname.startsWith('/api/public/trip/') ||
        pathname === '/' ||
        pathname === '/trip' ||
        pathname.startsWith('/trip/') ||
        pathname.startsWith('/trip-assets/') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/public') ||
        pathname.startsWith('/login-confirm') ||
        pathname.startsWith('/stepfun')
    ) {
        return NextResponse.next();
    }

    const token = request.cookies.get('sessionToken')?.value;
    if (token) {
        try {
            const payload = decodeJwtPayload(token);
            if (payload && !isExpired(payload)) {
                const userId = payload.sub ?? payload.username;
                if (userId) {
                    const headers = new Headers(request.headers);
                    headers.set('x-user-id', userId);
                    return NextResponse.next({ request: { headers } });
                }
            }
        } catch {
            // Invalid token: clear it below and send the user back to the login modal.
        }
    }

    const confirmUrl = new URL(buildLoginModalHomePath(`${pathname}${search}`), origin);
    const res = NextResponse.redirect(confirmUrl);
    res.cookies.set('sessionToken', '', { maxAge: 0, path: '/' });
    res.cookies.set('userId', '', { maxAge: 0, path: '/' });
    return res;
}

export const config = {
    matcher: '/:path*',
};
