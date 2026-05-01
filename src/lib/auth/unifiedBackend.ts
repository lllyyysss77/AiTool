import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { UNIFIED_BACKEND_CONFIG } from '@/config';

export interface UnifiedBackendProfile {
    id: string;
    is_anonymous: boolean;
    email?: string | null;
    email_verified_at?: string | null;
    display_name?: string | null;
}

export interface UnifiedBackendAuthPayload {
    access_token?: string;
    token_type?: string;
    expires_in?: number;
    verification_required?: boolean;
    profile?: UnifiedBackendProfile;
    app?: {
        id: string;
        code: string;
    };
    email_delivery?: unknown;
}

export interface UnifiedHumanChallenge {
    challengeToken: string;
    issuedAt: string;
    expiresAt: string;
    minDurationMs: number;
    minDragDistance: number;
    message: string;
}

export interface UnifiedHumanVerification {
    humanToken: string;
    tokenType: string;
    expiresIn: number;
    expiresAt: string;
}

const isProd = process.env.NODE_ENV === 'production';

function getAuthCookieOptions() {
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax' as const,
        path: '/',
        ...(isProd ? { domain: '.owenshen.top' } : {}),
    };
}

export function clearAuthCookies(response: NextResponse) {
    const cookieOptions = {
        ...getAuthCookieOptions(),
        maxAge: 0,
    } as const;

    response.cookies.set('sessionToken', '', cookieOptions);
    response.cookies.set('userId', '', cookieOptions);
    response.cookies.set('postLoginRedirect', '', { maxAge: 0, path: '/' });
}

export function setAuthCookies(response: NextResponse, accessToken: string, userId: string) {
    const cookieOptions = getAuthCookieOptions();
    response.cookies.set('sessionToken', accessToken, cookieOptions);
    response.cookies.set('userId', userId, cookieOptions);
    response.cookies.set('postLoginRedirect', '', { maxAge: 0, path: '/' });
}

function getForwardedHeaders(request?: NextRequest) {
    const headers: Record<string, string> = {};
    const userAgent = request?.headers.get('user-agent');
    const forwardedFor = request?.headers.get('x-forwarded-for');
    const realIp = request?.headers.get('x-real-ip');

    if (userAgent) headers['user-agent'] = userAgent;
    if (forwardedFor) headers['x-forwarded-for'] = forwardedFor;
    else if (realIp) headers['x-forwarded-for'] = realIp;
    if (realIp) headers['x-real-ip'] = realIp;

    return headers;
}

function buildBackendUrl(path: string) {
    return new URL(path, UNIFIED_BACKEND_CONFIG.baseUrl.replace(/\/$/, '')).toString();
}

async function readJsonSafely<T>(response: Response): Promise<T | null> {
    try {
        return (await response.json()) as T;
    } catch {
        return null;
    }
}

async function readBackendError(response: Response, fallback: string) {
    const payload = await readJsonSafely<any>(response);
    const backendError = payload?.error;
    if (backendError?.message) return backendError.message as string;
    if (backendError?.code === 'email_already_registered') return '该邮箱已经注册';
    if (backendError?.code === 'invalid_email_or_password') return '邮箱或密码错误';
    if (backendError?.code === 'human_verification_required') return '请先完成人机验证';
    if (backendError?.code === 'email_verification_required') return '请先完成邮箱验证后再登录';
    if (payload?.message) return payload.message as string;
    if (payload?.msg) return payload.msg as string;

    try {
        const text = await response.text();
        return text || fallback;
    } catch {
        return fallback;
    }
}

async function backendJson<T>(
    path: string,
    init: RequestInit,
    request?: NextRequest,
): Promise<T> {
    const headers = {
        ...getForwardedHeaders(request),
        ...(init.headers as Record<string, string> | undefined),
    };

    const response = await fetch(buildBackendUrl(path), {
        ...init,
        headers,
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(await readBackendError(response, `Unified backend request failed: ${response.status}`));
    }

    const payload = await readJsonSafely<T>(response);
    if (!payload) {
        throw new Error('Unified backend 返回格式无效');
    }

    return payload;
}

function appPayload() {
    return {
        app_code: UNIFIED_BACKEND_CONFIG.appCode,
        app_name: UNIFIED_BACKEND_CONFIG.appName,
        bundle_id: UNIFIED_BACKEND_CONFIG.bundleId,
    };
}

export async function createHumanChallenge(request?: NextRequest) {
    return backendJson<UnifiedHumanChallenge>('/v1/human/challenge', {
        method: 'GET',
    }, request);
}

export async function verifyHumanChallenge(
    input: {
        challengeToken: string;
        durationMs: number;
        dragDistance: number;
        pointerMoves?: number;
        pointerType?: string;
    },
    request?: NextRequest,
) {
    return backendJson<UnifiedHumanVerification>('/v1/human/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    }, request);
}

export async function loginWithUnifiedBackend(input: {
    email: string;
    password: string;
    humanToken: string;
}, request?: NextRequest) {
    return backendJson<UnifiedBackendAuthPayload>('/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Human-Token': input.humanToken,
        },
        body: JSON.stringify({
            ...appPayload(),
            email: input.email,
            password: input.password,
        }),
    }, request);
}

export async function registerWithUnifiedBackend(input: {
    email: string;
    password: string;
    displayName?: string;
    humanToken: string;
}, request?: NextRequest) {
    return backendJson<UnifiedBackendAuthPayload>('/v1/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Human-Token': input.humanToken,
        },
        body: JSON.stringify({
            ...appPayload(),
            email: input.email,
            password: input.password,
            display_name: input.displayName,
        }),
    }, request);
}

export async function fetchUnifiedProfile(accessToken: string, request?: NextRequest) {
    const payload = await backendJson<{ profile: UnifiedBackendProfile }>('/v1/me', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    }, request);

    if (!payload.profile?.id) {
        throw new Error('Unified backend 账户信息不完整');
    }

    return payload.profile;
}

export function getUnifiedProfileDisplayName(profile: UnifiedBackendProfile) {
    return profile.display_name || profile.email?.split('@')[0] || `user-${profile.id.slice(0, 8)}`;
}

export function getUnifiedProfileAccountName(profile: UnifiedBackendProfile) {
    return profile.email || profile.display_name || profile.id;
}

export async function syncUnifiedProfile(profile: UnifiedBackendProfile) {
    void profile;
}
