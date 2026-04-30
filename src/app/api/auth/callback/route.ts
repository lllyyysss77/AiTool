import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildLoginModalHomePath, normalizeLoginNext } from '@/lib/auth/loginModal';

export async function GET(request: NextRequest) {
    const postLoginRedirect = normalizeLoginNext(
        request.nextUrl.searchParams.get('next') || request.cookies.get('postLoginRedirect')?.value,
    );
    const response = NextResponse.redirect(
        new URL(buildLoginModalHomePath(postLoginRedirect), request.nextUrl.origin),
    );
    response.cookies.set('postLoginRedirect', '', { maxAge: 0, path: '/' });
    return response;
}
