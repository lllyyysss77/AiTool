import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyHumanChallenge } from '@/lib/auth/unifiedBackend';

function badRequest(message: string, status = 400) {
    return NextResponse.json({ ok: false, msg: message }, { status });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const challengeToken = String(body?.challengeToken || '').trim();
        const durationMs = Number(body?.durationMs);
        const dragDistance = Number(body?.dragDistance);
        const pointerMoves = body?.pointerMoves === undefined ? undefined : Number(body.pointerMoves);
        const pointerType = body?.pointerType ? String(body.pointerType).slice(0, 32) : undefined;

        if (!challengeToken) return badRequest('验证 challenge 缺失');
        if (!Number.isFinite(durationMs)) return badRequest('验证耗时无效');
        if (!Number.isFinite(dragDistance)) return badRequest('拖动距离无效');

        const verification = await verifyHumanChallenge({
            challengeToken,
            durationMs,
            dragDistance,
            pointerMoves,
            pointerType,
        }, request);

        return NextResponse.json(verification, { status: 200 });
    } catch (error) {
        return badRequest(error instanceof Error ? error.message : '真人验证失败');
    }
}
