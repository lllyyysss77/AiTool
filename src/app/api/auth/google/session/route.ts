import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminProfile } from '@/lib/auth/admin';
import { normalizeLoginNext } from '@/lib/auth/loginModal';
import {
    fetchUnifiedProfile,
    getUnifiedProfileAccountName,
    getUnifiedProfileDisplayName,
    setAuthCookies,
} from '@/lib/auth/unifiedBackend';

interface GoogleAuthPayload {
    access_token?: string;
}

function decodeBase64UrlJson(value: string) {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as GoogleAuthPayload;
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json().catch(() => ({}))) as {
            googleAuth?: string;
            next?: string;
        };
        const next = normalizeLoginNext(body.next, '/dashboard');
        const googleAuth = body.googleAuth?.trim();
        if (!googleAuth) {
            return NextResponse.json({ ok: false, msg: 'Google 登录凭证缺失。' }, { status: 400 });
        }

        const payload = decodeBase64UrlJson(googleAuth);
        const accessToken = payload.access_token;
        if (!accessToken) {
            return NextResponse.json({ ok: false, msg: 'Google 登录凭证无效。' }, { status: 400 });
        }

        const profile = await fetchUnifiedProfile(accessToken, request);
        const response = NextResponse.json({
            ok: true,
            redirectTo: next,
            user: {
                name: getUnifiedProfileAccountName(profile),
                displayName: getUnifiedProfileDisplayName(profile),
                email: profile.email,
                isAdmin: isAdminProfile(profile),
            },
        });

        setAuthCookies(response, accessToken, profile.id);
        return response;
    } catch (error) {
        return NextResponse.json(
            { ok: false, msg: error instanceof Error ? error.message : 'Google 登录失败，请稍后再试。' },
            { status: 500 },
        );
    }
}
