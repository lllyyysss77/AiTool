import type { NextRequest } from 'next/server';

function normalizeOrigin(value?: string | null) {
    const trimmed = value?.trim().replace(/\/+$/, '');
    if (!trimmed) return '';

    try {
        const url = new URL(trimmed);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
        return url.origin;
    } catch {
        return '';
    }
}

function firstHeaderValue(value?: string | null) {
    return value?.split(',')[0]?.trim() || '';
}

export function getPublicOrigin(request?: NextRequest) {
    const configuredOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL);
    if (configuredOrigin) return configuredOrigin;

    const forwardedHost = firstHeaderValue(request?.headers.get('x-forwarded-host'));
    const host = forwardedHost || firstHeaderValue(request?.headers.get('host'));
    if (host) {
        const forwardedProto = firstHeaderValue(request?.headers.get('x-forwarded-proto'));
        const protocol = forwardedProto || request?.nextUrl.protocol.replace(/:$/, '') || 'https';
        return normalizeOrigin(`${protocol}://${host}`) || request?.nextUrl.origin || 'http://localhost:3002';
    }

    return request?.nextUrl.origin || 'http://localhost:3002';
}

export function buildPublicUrl(path: string, request?: NextRequest) {
    return new URL(path, getPublicOrigin(request));
}
