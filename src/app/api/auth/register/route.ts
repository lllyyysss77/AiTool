import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { normalizeLoginNext } from '@/lib/auth/loginModal';
import {
    getUnifiedProfileAccountName,
    getUnifiedProfileDisplayName,
    registerWithUnifiedBackend,
    setAuthCookies,
    syncUnifiedProfile,
} from '@/lib/auth/unifiedBackend';

function badRequest(message: string, status: number = 400) {
    return NextResponse.json({ ok: false, msg: message }, { status });
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = String(body?.email || '').trim().toLowerCase();
        const password = String(body?.password || '');
        const confirmPassword = String(body?.confirmPassword || '');
        const displayName = String(body?.displayName || '').trim();
        const humanToken = String(body?.humanToken || '').trim();
        const next = normalizeLoginNext(body?.next);

        if (!email) return badRequest('请输入邮箱');
        if (!EMAIL_REGEX.test(email)) return badRequest('邮箱格式不正确');
        if (!password) return badRequest('请输入密码');
        if (password.length < 8) return badRequest('密码至少需要 8 位');
        if (password !== confirmPassword) return badRequest('两次输入的密码不一致');
        if (!humanToken) return badRequest('请先完成真人验证');

        const payload = await registerWithUnifiedBackend({
            email,
            password,
            displayName,
            humanToken,
        }, request);

        if (payload.verification_required) {
            return badRequest(
                payload.email_delivery
                    ? '注册成功，验证邮件已发送。请先点击邮箱里的验证链接，再回来登录。'
                    : '注册成功，请先完成邮箱验证后再登录。',
                202,
            );
        }

        const accessToken = payload.access_token;
        const profile = payload.profile;

        if (!accessToken || !profile?.id) {
            return badRequest('注册成功但凭证不完整，请稍后登录', 502);
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
        const message = error instanceof Error ? error.message : '注册失败';
        return badRequest(message);
    }
}
