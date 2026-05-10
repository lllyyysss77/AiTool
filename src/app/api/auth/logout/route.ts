import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clearAuthCookies } from '@/lib/auth/unifiedBackend';
import { buildPublicUrl } from '@/lib/publicUrl';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const redirectRes = NextResponse.redirect(buildPublicUrl('/', req));

    clearAuthCookies(redirectRes);
    return redirectRes;
}
