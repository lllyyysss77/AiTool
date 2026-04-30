import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/unifiedBackend';

export async function GET(req: NextRequest) {
    const redirectRes = NextResponse.redirect(`${req.nextUrl.origin}/`);

    clearAuthCookies(redirectRes);
    return redirectRes;
}
