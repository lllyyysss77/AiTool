// src/app/ClientBoot.tsx
'use client';

import { useEffect } from 'react';
import { patchFetchOnce } from '@/lib/fetchPatch';
import { buildLoginModalHomePath, normalizeLoginNext } from '@/lib/auth/loginModal';
import { useUser } from '@/app/providers/UserProvider';

interface GoogleSessionResponse {
    ok?: boolean;
    msg?: string;
    redirectTo?: string;
    user?: {
        name: string;
        displayName: string;
        email?: string | null;
        isAdmin?: boolean;
    };
}

function readGoogleLoginNext() {
    return normalizeLoginNext(new URLSearchParams(window.location.search).get('loginNext'), '/dashboard');
}

function rememberGoogleAuthError(message: string) {
    try {
        window.sessionStorage.setItem('aitool.googleAuthError', message);
    } catch {
        // Ignore storage failures; the login modal still opens normally.
    }
}

function clearGoogleAuthHash(params: URLSearchParams) {
    params.delete('google_auth');
    params.delete('google_error');
    const nextHash = params.toString();
    window.history.replaceState(
        {},
        document.title,
        `${window.location.pathname}${window.location.search}${nextHash ? `#${nextHash}` : ''}`,
    );
}

export default function ClientBoot() {
    const { setUser } = useUser();

    useEffect(() => {
        patchFetchOnce(); // 只在客户端运行一次
    }, []);

    useEffect(() => {
        const consumeGoogleHash = () => {
            if (!window.location.hash.includes('google_auth=') && !window.location.hash.includes('google_error=')) {
                return;
            }

            const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
            const next = readGoogleLoginNext();
            const googleError = hashParams.get('google_error');

            if (googleError) {
                clearGoogleAuthHash(hashParams);
                rememberGoogleAuthError(googleError);
                window.location.href = buildLoginModalHomePath(next);
                return;
            }

            const googleAuth = hashParams.get('google_auth');
            if (!googleAuth) return;

            clearGoogleAuthHash(hashParams);

            void fetch('/api/auth/google/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ googleAuth, next }),
            })
                .then(async (response) => {
                    const payload = (await response.json().catch(() => null)) as GoogleSessionResponse | null;
                    if (!response.ok || !payload?.ok) {
                        throw new Error(payload?.msg || 'Google 登录失败，请稍后再试。');
                    }
                    if (payload.user) setUser(payload.user);
                    window.location.href = payload.redirectTo || next;
                })
                .catch((error) => {
                    rememberGoogleAuthError(error instanceof Error ? error.message : 'Google 登录失败，请稍后再试。');
                    window.location.href = buildLoginModalHomePath(next);
                });
        };

        const timer = window.setTimeout(consumeGoogleHash, 0);
        window.addEventListener('hashchange', consumeGoogleHash);

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('hashchange', consumeGoogleHash);
        };
    }, [setUser]);

    return null;
}
