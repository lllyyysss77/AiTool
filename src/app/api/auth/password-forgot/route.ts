import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requestPasswordResetWithUnifiedBackend } from '@/lib/auth/unifiedBackend';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(message: string, status: number = 400) {
    return NextResponse.json({ ok: false, msg: message }, { status });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = String(body?.email || '').trim().toLowerCase();
        const humanToken = String(body?.humanToken || '').trim();

        if (!email) return badRequest('请先填写邮箱');
        if (!EMAIL_REGEX.test(email)) return badRequest('邮箱格式不正确');
        if (!humanToken) return badRequest('请先完成真人验证');

        await requestPasswordResetWithUnifiedBackend({ email, humanToken }, request);
        return NextResponse.json({ ok: true, msg: '如果该邮箱已注册，重设密码邮件已发送。' });
    } catch (error) {
        const message = error instanceof Error ? error.message : '发送失败';
        return badRequest(message);
    }
}
