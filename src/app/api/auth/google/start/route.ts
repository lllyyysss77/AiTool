import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UNIFIED_BACKEND_CONFIG } from '@/config';
import { buildLoginModalHomePath, normalizeLoginNext } from '@/lib/auth/loginModal';

function backendUrl(path: string) {
    return new URL(path, UNIFIED_BACKEND_CONFIG.baseUrl.replace(/\/$/, '')).toString();
}

export async function GET(request: NextRequest) {
    const next = normalizeLoginNext(request.nextUrl.searchParams.get('next'), '/dashboard');
    const humanToken = request.nextUrl.searchParams.get('humanToken')?.trim();
    const returnUrl = new URL(buildLoginModalHomePath(next), request.nextUrl.origin);
    const failureUrl = new URL(buildLoginModalHomePath(next), request.nextUrl.origin);

    if (!humanToken) {
        failureUrl.hash = new URLSearchParams({ google_error: '请先长按完成人机验证' }).toString();
        return NextResponse.redirect(failureUrl);
    }

    const googleStartUrl = new URL(backendUrl('/v1/auth/google/start'));

    googleStartUrl.searchParams.set('app_code', UNIFIED_BACKEND_CONFIG.appCode);
    googleStartUrl.searchParams.set('app_name', UNIFIED_BACKEND_CONFIG.appName);
    googleStartUrl.searchParams.set('bundle_id', UNIFIED_BACKEND_CONFIG.bundleId);
    googleStartUrl.searchParams.set('redirect_url', returnUrl.toString());

    const forwardedHeaders: Record<string, string> = {
        'X-Human-Token': humanToken,
    };
    const userAgent = request.headers.get('user-agent');
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    if (userAgent) forwardedHeaders['user-agent'] = userAgent;
    if (forwardedFor) forwardedHeaders['x-forwarded-for'] = forwardedFor;
    else if (realIp) forwardedHeaders['x-forwarded-for'] = realIp;
    if (realIp) forwardedHeaders['x-real-ip'] = realIp;

    const backendResponse = await fetch(googleStartUrl, {
        method: 'GET',
        headers: forwardedHeaders,
        redirect: 'manual',
        cache: 'no-store',
    });
    const location = backendResponse.headers.get('location');

    if (!backendResponse.ok && !location) {
        const payload = (await backendResponse.json().catch(() => null)) as
            | { error?: { message?: string } }
            | null;
        failureUrl.hash = new URLSearchParams({
            google_error: payload?.error?.message || '真人验证无效，请重新长按验证',
        }).toString();
        return NextResponse.redirect(failureUrl);
    }

    if (!location) {
        failureUrl.hash = new URLSearchParams({ google_error: 'Google 登录启动失败' }).toString();
        return NextResponse.redirect(failureUrl);
    }

    const response = NextResponse.redirect(location);
    response.cookies.set('postLoginRedirect', next, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 10,
    });
    return response;
}
