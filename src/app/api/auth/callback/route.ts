import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildLoginModalHomePath, normalizeLoginNext } from '@/lib/auth/loginModal';
import { buildPublicUrl } from '@/lib/publicUrl';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const postLoginRedirect = normalizeLoginNext(
        request.nextUrl.searchParams.get('next') || request.cookies.get('postLoginRedirect')?.value,
    );
    const response = NextResponse.redirect(
        buildPublicUrl(buildLoginModalHomePath(postLoginRedirect), request),
    );
    response.cookies.set('postLoginRedirect', '', { maxAge: 0, path: '/' });
    return response;
}
