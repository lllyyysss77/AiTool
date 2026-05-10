import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildLoginModalHomePath, normalizeLoginNext } from '@/lib/auth/loginModal';
import { buildPublicUrl } from '@/lib/publicUrl';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const next = normalizeLoginNext(request.nextUrl.searchParams.get('next'));
    const response = NextResponse.redirect(
        buildPublicUrl(buildLoginModalHomePath(next), request),
    );

    response.cookies.set('postLoginRedirect', next, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 10,
    });

    return response;
}
