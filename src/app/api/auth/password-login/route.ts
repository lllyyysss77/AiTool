import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { normalizeLoginNext } from '@/lib/auth/loginModal';
import {
    getUnifiedProfileAccountName,
    getUnifiedProfileDisplayName,
    loginWithUnifiedBackend,
    setAuthCookies,
    syncUnifiedProfile,
} from '@/lib/auth/unifiedBackend';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(message: string, status: number = 400) {
    return NextResponse.json({ ok: false, msg: message }, { status });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = String(body?.email || body?.identifier || '').trim().toLowerCase();
        const password = String(body?.password || '');
        const humanToken = String(body?.humanToken || '').trim();
        const next = normalizeLoginNext(body?.next);

        if (!email) return badRequest('请输入邮箱');
        if (!EMAIL_REGEX.test(email)) return badRequest('邮箱格式不正确');
        if (!password) return badRequest('请输入密码');
        if (!humanToken) return badRequest('请先完成真人验证');

        const payload = await loginWithUnifiedBackend({ email, password, humanToken }, request);
        const accessToken = payload.access_token;
        const profile = payload.profile;

        if (!accessToken || !profile?.id) {
            return badRequest('登录成功但凭证不完整，请稍后重试', 502);
        }

        await syncUnifiedProfile(profile);

        const response = NextResponse.json({
            ok: true,
            redirectTo: next,
            user: {
                name: getUnifiedProfileAccountName(profile),
                displayName: getUnifiedProfileDisplayName(profile),
            },
        });
        setAuthCookies(response, accessToken, profile.id);

        return response;
    } catch (error) {
        const message = error instanceof Error ? error.message : '登录失败';
        return badRequest(message);
    }
}
