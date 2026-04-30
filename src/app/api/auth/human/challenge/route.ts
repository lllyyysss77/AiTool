import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createHumanChallenge } from '@/lib/auth/unifiedBackend';

function errorResponse(error: unknown, fallback = '真人验证初始化失败') {
    return NextResponse.json(
        { ok: false, msg: error instanceof Error ? error.message : fallback },
        { status: 500 },
    );
}

export async function GET(request: NextRequest) {
    try {
        const challenge = await createHumanChallenge(request);
        return NextResponse.json(challenge, { status: 200 });
    } catch (error) {
        return errorResponse(error);
    }
}
