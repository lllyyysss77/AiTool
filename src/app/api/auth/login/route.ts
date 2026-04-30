import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildLoginModalHomePath, normalizeLoginNext } from '@/lib/auth/loginModal';

export async function GET(request: NextRequest) {
    const next = normalizeLoginNext(request.nextUrl.searchParams.get('next'));
    const response = NextResponse.redirect(
        new URL(buildLoginModalHomePath(next), request.nextUrl.origin),
    );

    response.cookies.set('postLoginRedirect', next, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 10,
    });

    return response;
}
