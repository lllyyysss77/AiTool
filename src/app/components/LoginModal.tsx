'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Chrome, Loader2, X } from 'lucide-react';
import { useUser } from '@/app/providers/UserProvider';
import {
    buildLoginModalClosePath,
    getCurrentRouteForLogin,
    isLoginModalOpen,
    readLoginModalNext,
} from '@/lib/auth/loginModal';

type Mode = 'login' | 'register';

interface AuthResponse {
    ok?: boolean;
    msg?: string;
    redirectTo?: string;
    verificationRequired?: boolean;
}

interface HumanChallenge {
    challengeToken: string;
    expiresAt: string;
    minDurationMs: number;
    minDragDistance: number;
    message?: string;
}

interface HumanVerification {
    humanToken: string;
    expiresAt: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginModal() {
    const pathname = usePathname() || '/';
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useUser();
    const search = searchParams?.toString() ? `?${searchParams.toString()}` : '';
    const modalOpen = isLoginModalOpen(search);
    const fallbackNext = getCurrentRouteForLogin(pathname, search);
    const nextUrl = readLoginModalNext(search, fallbackNext);
    const closeHref = buildLoginModalClosePath(pathname, search);

    const [mode, setMode] = useState<Mode>('login');
    const [loginIdentifier, setLoginIdentifier] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerDisplayName, setRegisterDisplayName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPasswordResetSubmitting, setIsPasswordResetSubmitting] = useState(false);
    const [humanChallenge, setHumanChallenge] = useState<HumanChallenge | null>(null);
    const [humanToken, setHumanToken] = useState('');
    const [humanTokenExpiresAt, setHumanTokenExpiresAt] = useState('');
    const [humanHoldProgress, setHumanHoldProgress] = useState(0);
    const [humanStatus, setHumanStatus] = useState('按住按钮完成真人验证。');
    const [isHumanLoading, setIsHumanLoading] = useState(false);
    const [isHumanVerifying, setIsHumanVerifying] = useState(false);
    const humanPressRef = useRef({ startedAt: 0, moves: 0, pointerType: 'pointer' });
    const humanHoldProgressRef = useRef(0);
    const humanPressFrameRef = useRef<number | null>(null);
    const humanPressPointerRef = useRef<number | null>(null);
    const humanVerifyInFlightRef = useRef(false);

    const isHumanVerified = useCallback(() => {
        if (!humanToken) return false;

        const expiresAt = Date.parse(humanTokenExpiresAt || '');
        return Number.isFinite(expiresAt) && expiresAt > Date.now() + 60_000;
    }, [humanToken, humanTokenExpiresAt]);

    const cancelHumanPress = useCallback((message?: string) => {
        if (humanPressFrameRef.current !== null) {
            window.cancelAnimationFrame(humanPressFrameRef.current);
            humanPressFrameRef.current = null;
        }
        humanPressPointerRef.current = null;
        humanPressRef.current.startedAt = 0;
        humanPressRef.current.moves = 0;
        if (!isHumanVerified()) {
            setHumanHoldProgress(0);
            humanHoldProgressRef.current = 0;
        }
        if (message) setHumanStatus(message);
    }, [isHumanVerified]);

    const clearHumanVerification = useCallback((message = '按住按钮完成真人验证。') => {
        setHumanToken('');
        setHumanTokenExpiresAt('');
        cancelHumanPress();
        setHumanHoldProgress(0);
        humanHoldProgressRef.current = 0;
        setHumanStatus(message);
    }, [cancelHumanPress]);

    const loadHumanChallenge = useCallback(async (force = false) => {
        if (!force && humanChallenge) {
            const expiresAt = Date.parse(humanChallenge.expiresAt || '');
            if (Number.isFinite(expiresAt) && expiresAt > Date.now() + 10_000) {
                return humanChallenge;
            }
        }

        setIsHumanLoading(true);
        try {
            const response = await fetch('/api/auth/human/challenge', {
                method: 'GET',
                cache: 'no-store',
            });
            const payload = (await response.json().catch(() => null)) as
                | (HumanChallenge & { msg?: string })
                | null;

            if (!response.ok || !payload?.challengeToken) {
                throw new Error(payload?.msg || '真人验证初始化失败');
            }

            setHumanChallenge(payload);
            if (!isHumanVerified()) {
                setHumanHoldProgress(0);
                humanHoldProgressRef.current = 0;
                setHumanStatus('按住按钮完成真人验证。');
            }
            return payload;
        } finally {
            setIsHumanLoading(false);
        }
    }, [humanChallenge, isHumanVerified]);

    const verifyHuman = useCallback(async () => {
        if (humanVerifyInFlightRef.current || isHumanVerified()) return;

        humanVerifyInFlightRef.current = true;
        setIsHumanVerifying(true);
        setHumanStatus('正在确认真人验证...');

        try {
            const challenge = await loadHumanChallenge();
            const startedAt = humanPressRef.current.startedAt || Date.now() - challenge.minDurationMs;
            const durationMs = Math.max(Date.now() - startedAt, challenge.minDurationMs + 120);
            const dragDistance = Math.max(challenge.minDragDistance + 24, 140);

            const response = await fetch('/api/auth/human/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    challengeToken: challenge.challengeToken,
                    durationMs,
                    dragDistance,
                    pointerMoves: Math.max(humanPressRef.current.moves, 3),
                    pointerType: humanPressRef.current.pointerType,
                }),
            });
            const payload = (await response.json().catch(() => null)) as
                | (HumanVerification & { msg?: string })
                | null;

            if (!response.ok || !payload?.humanToken) {
                throw new Error(payload?.msg || '真人验证失败，请重试');
            }

            setHumanToken(payload.humanToken);
            setHumanTokenExpiresAt(payload.expiresAt);
            cancelHumanPress();
            setHumanHoldProgress(100);
            humanHoldProgressRef.current = 100;
            setHumanStatus('验证完成。');
        } catch (error) {
            setHumanChallenge(null);
            clearHumanVerification(error instanceof Error ? error.message : '真人验证失败，请重试');
        } finally {
            humanVerifyInFlightRef.current = false;
            setIsHumanVerifying(false);
        }
    }, [cancelHumanPress, clearHumanVerification, isHumanVerified, loadHumanChallenge]);

    useEffect(() => {
        if (!modalOpen || user || isHumanVerified()) return;
        void loadHumanChallenge().catch((error) => {
            setHumanStatus(error instanceof Error ? error.message : '真人验证初始化失败');
        });
    }, [isHumanVerified, loadHumanChallenge, modalOpen, user]);

    useEffect(() => () => {
        if (humanPressFrameRef.current !== null) {
            window.cancelAnimationFrame(humanPressFrameRef.current);
        }
    }, []);

    useEffect(() => {
        if (!modalOpen) return;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isSubmitting) {
                router.replace(closeHref, { scroll: false });
            }
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [closeHref, isSubmitting, modalOpen, router]);

    useEffect(() => {
        if (!modalOpen || !user) return;
        router.replace(closeHref, { scroll: false });
    }, [closeHref, modalOpen, router, user]);

    const title = useMemo(() => (mode === 'login' ? '登录 / 注册' : '创建账号'), [mode]);
    const emailValue = mode === 'login' ? loginIdentifier : registerEmail;
    const humanVerified = isHumanVerified();
    const authActionsDisabled = !humanVerified || isSubmitting;
    const googleLoginHref = `/api/auth/google/start?${new URLSearchParams({
        next: nextUrl,
        humanToken,
    }).toString()}`;

    useEffect(() => {
        if (!modalOpen) return;
        try {
            const message = window.sessionStorage.getItem('aitool.googleAuthError');
            if (!message) return;
            setErrorMessage(`Google 登录失败：${message}`);
            window.sessionStorage.removeItem('aitool.googleAuthError');
        } catch {
            // Session storage is optional; ignore when unavailable.
        }
    }, [modalOpen]);

    if (!modalOpen || user) {
        return null;
    }

    const handleClose = () => {
        if (isSubmitting) return;
        router.replace(closeHref, { scroll: false });
    };

    const switchMode = (nextMode: Mode) => {
        if (isSubmitting) return;
        setMode(nextMode);
        setErrorMessage('');
        setInfoMessage('');
    };

    const resetHumanAfterFailure = (message = '真人验证已失效，请重新长按验证。') => {
        setHumanChallenge(null);
        clearHumanVerification(message);
        void loadHumanChallenge(true).catch((error) => {
            setHumanStatus(error instanceof Error ? error.message : '真人验证初始化失败');
        });
    };

    const validateClientSide = () => {
        if (!emailValue.trim()) return '请输入邮箱';
        if (!EMAIL_REGEX.test(emailValue.trim())) return '邮箱格式不正确';
        if (mode === 'login' && !loginPassword) return '请输入密码';
        if (mode === 'register' && !registerPassword) return '请输入密码';
        if (mode === 'register' && registerPassword.length < 8) return '密码至少需要 8 位';
        if (!isHumanVerified()) return '请先长按完成人机验证';
        return '';
    };

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationMessage = validateClientSide();
        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');
        setInfoMessage('');

        try {
            const endpoint = mode === 'login' ? '/api/auth/password-login' : '/api/auth/register';
            const payload =
                mode === 'login'
                    ? {
                          email: loginIdentifier.trim().toLowerCase(),
                          password: loginPassword,
                          humanToken,
                          next: nextUrl,
                      }
                    : {
                          email: registerEmail.trim().toLowerCase(),
                          password: registerPassword,
                          confirmPassword: registerPassword,
                          displayName: registerDisplayName.trim(),
                          humanToken,
                          next: nextUrl,
                      };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = (await response.json().catch(() => null)) as AuthResponse | null;
            if (!response.ok || !result?.ok) {
                const message = result?.msg || (mode === 'login' ? '登录失败' : '注册失败');
                if (message.includes('真人') || message.includes('人机') || message.toLowerCase().includes('human')) {
                    resetHumanAfterFailure();
                }
                setErrorMessage(message);
                return;
            }

            if (mode === 'register' && result.verificationRequired) {
                setMode('login');
                setRegisterPassword('');
                setInfoMessage(result.msg || '注册成功，请先完成邮箱验证后再登录。');
                return;
            }

            window.location.href = result.redirectTo || nextUrl;
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : '请求失败');
        } finally {
            setIsSubmitting(false);
        }
    };

    const requestPasswordReset = async () => {
        const email = emailValue.trim().toLowerCase();
        setErrorMessage('');
        setInfoMessage('');

        if (!email) {
            setErrorMessage('请先填写邮箱');
            return;
        }
        if (!EMAIL_REGEX.test(email)) {
            setErrorMessage('邮箱格式不正确');
            return;
        }
        if (!isHumanVerified()) {
            setErrorMessage('请先长按完成人机验证');
            return;
        }

        setIsPasswordResetSubmitting(true);
        try {
            const response = await fetch('/api/auth/password-forgot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, humanToken }),
            });
            const result = (await response.json().catch(() => null)) as AuthResponse | null;
            if (!response.ok || !result?.ok) {
                const message = result?.msg || '发送失败，请稍后再试。';
                if (message.includes('真人') || message.includes('人机') || message.toLowerCase().includes('human')) {
                    resetHumanAfterFailure();
                }
                setErrorMessage(message);
                return;
            }
            setInfoMessage(result.msg || '如果该邮箱已注册，重设密码邮件已发送。');
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : '发送失败，请稍后再试。');
        } finally {
            setIsPasswordResetSubmitting(false);
        }
    };

    const startHumanPress = async (event: React.PointerEvent<HTMLButtonElement>) => {
        if (isSubmitting || isHumanLoading || isHumanVerifying || isHumanVerified()) return;

        event.preventDefault();
        cancelHumanPress();

        const pointerId = event.pointerId;
        humanPressPointerRef.current = pointerId;
        try {
            event.currentTarget.setPointerCapture(pointerId);
        } catch {
            // Pointer capture is best-effort for consistent release/cancel events.
        }

        let challenge: HumanChallenge;
        try {
            challenge = await loadHumanChallenge();
        } catch (error) {
            setHumanStatus(error instanceof Error ? error.message : '真人验证初始化失败');
            return;
        }
        if (humanPressPointerRef.current !== pointerId) return;

        humanPressRef.current = {
            startedAt: Date.now(),
            moves: 1,
            pointerType: event.pointerType || 'pointer',
        };
        setHumanStatus('保持按住，直到进度完成。');

        const tick = () => {
            if (!humanPressRef.current.startedAt || humanPressPointerRef.current !== pointerId) return;

            const elapsed = Date.now() - humanPressRef.current.startedAt;
            const progress = Math.min(100, Math.round((elapsed / challenge.minDurationMs) * 100));
            humanHoldProgressRef.current = progress;
            setHumanHoldProgress(progress);

            if (progress >= 100) {
                humanPressFrameRef.current = null;
                void verifyHuman();
                return;
            }

            humanPressFrameRef.current = window.requestAnimationFrame(tick);
        };

        humanPressFrameRef.current = window.requestAnimationFrame(tick);
    };

    const releaseHumanPress = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (humanPressPointerRef.current !== event.pointerId) return;
        if (isHumanVerified() || humanVerifyInFlightRef.current || humanHoldProgressRef.current >= 100) return;
        cancelHumanPress('按住时间不够，请重新长按。');
    };

    return (
        <section
            className="fixed inset-0 z-[120] grid place-items-center px-4 py-6"
            role="dialog"
            aria-modal="true"
            aria-label="登录注册"
        >
            <button
                type="button"
                className="absolute inset-0 bg-slate-950/35 backdrop-blur-md"
                aria-label="关闭登录弹框"
                onClick={handleClose}
            />
            <div className="relative z-10 max-h-[calc(100vh-32px)] w-full max-w-[500px] overflow-y-auto rounded-[28px] border border-white/75 bg-[linear-gradient(145deg,rgba(255,252,244,0.98),rgba(232,246,252,0.96))] p-6 shadow-[0_30px_80px_rgba(32,50,65,0.25)]">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Account</p>
                        <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                            游客不需要登录也能看博客。登录主要用于账号找回、后续学习记录同步，以及我自己的管理入口。
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 bg-white/70 text-xl leading-none text-slate-700 transition hover:bg-white"
                        aria-label="关闭"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="mt-5 rounded-[22px] border border-slate-200 bg-white/65 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="text-sm font-black text-slate-700">真人验证</span>
                        <button
                            type="button"
                            onClick={() => {
                                clearHumanVerification();
                                void loadHumanChallenge(true).catch((error) => {
                                    setHumanStatus(error instanceof Error ? error.message : '真人验证初始化失败');
                                });
                            }}
                            disabled={isSubmitting || isHumanLoading || isHumanVerifying}
                            className="text-sm font-black text-cyan-700 transition hover:text-cyan-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            重新获取
                        </button>
                    </div>
                    <button
                        type="button"
                        onPointerDown={startHumanPress}
                        onPointerUp={releaseHumanPress}
                        onPointerCancel={(event) => {
                            if (humanPressPointerRef.current === event.pointerId && !isHumanVerified()) {
                                cancelHumanPress('验证已取消，请重新长按。');
                            }
                        }}
                        onPointerLeave={(event) => {
                            if (humanPressPointerRef.current === event.pointerId && !isHumanVerified()) {
                                cancelHumanPress('请不要移出按钮，重新长按即可。');
                            }
                        }}
                        onPointerMove={() => {
                            humanPressRef.current.moves += 1;
                        }}
                        onContextMenu={(event) => event.preventDefault()}
                        disabled={isSubmitting || isHumanLoading || isHumanVerifying || humanVerified}
                        className="relative h-12 w-full touch-none select-none overflow-hidden rounded-full border border-cyan-100 bg-cyan-50 text-sm font-black text-slate-600 transition disabled:cursor-not-allowed disabled:opacity-80"
                        aria-label="长按完成真人验证"
                    >
                        <div
                            className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(135deg,rgba(37,184,255,0.28),rgba(64,181,130,0.28))] transition-[width]"
                            style={{ width: `${humanHoldProgress}%` }}
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-black text-slate-600">
                            {isHumanLoading
                                ? '准备中...'
                                : isHumanVerifying
                                  ? '验证中...'
                                  : humanVerified
                                    ? '已完成'
                                    : humanHoldProgress > 0
                                      ? `继续按住 ${humanHoldProgress}%`
                                      : '先按住验证'}
                        </div>
                    </button>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{humanStatus}</p>
                    {!humanVerified ? (
                        <p className="mt-2 text-xs font-bold text-slate-400">
                            完成真人验证后，才可以使用 Google、邮箱登录或注册。
                        </p>
                    ) : null}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 rounded-full border border-slate-200 bg-white/55 p-1.5">
                    <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className={
                            mode === 'login'
                                ? 'rounded-full bg-[linear-gradient(135deg,rgba(37,184,255,0.18),rgba(64,181,130,0.18))] px-4 py-2.5 text-sm font-black text-slate-950 shadow-[0_10px_20px_rgba(38,90,120,0.12)]'
                                : 'rounded-full px-4 py-2.5 text-sm font-black text-slate-500 transition hover:text-slate-950'
                        }
                    >
                        登录
                    </button>
                    <button
                        type="button"
                        onClick={() => switchMode('register')}
                        className={
                            mode === 'register'
                                ? 'rounded-full bg-[linear-gradient(135deg,rgba(37,184,255,0.18),rgba(64,181,130,0.18))] px-4 py-2.5 text-sm font-black text-slate-950 shadow-[0_10px_20px_rgba(38,90,120,0.12)]'
                                : 'rounded-full px-4 py-2.5 text-sm font-black text-slate-500 transition hover:text-slate-950'
                        }
                    >
                        注册
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        if (!humanVerified) {
                            setErrorMessage('请先长按完成人机验证');
                            return;
                        }
                        setErrorMessage('');
                        setInfoMessage('正在跳转到 Google...');
                        window.location.href = googleLoginHref;
                    }}
                    disabled={!humanVerified || isSubmitting}
                    className="mt-4 inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-5 py-3.5 text-sm font-black text-slate-800 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-slate-200 bg-white text-sm font-black text-slate-900">
                        <Chrome size={16} />
                    </span>
                    使用 Google 账号继续
                </button>

                <div className="mt-4 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span>邮箱登录</span>
                    <span className="h-px flex-1 bg-slate-200" />
                </div>

                <form className="mt-5 grid gap-3" onSubmit={submit}>
                    <label className="grid gap-2 text-sm font-black text-slate-600">
                        邮箱
                        <input
                            value={emailValue}
                            onChange={(event) =>
                                mode === 'login'
                                    ? setLoginIdentifier(event.target.value)
                                    : setRegisterEmail(event.target.value)
                            }
                            type="email"
                            placeholder="you@example.com"
                            disabled={authActionsDisabled}
                            className="rounded-2xl border border-slate-200 bg-white/75 px-4 py-3 text-base font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
                            autoComplete="email"
                            inputMode="email"
                        />
                    </label>

                    {mode === 'register' ? (
                        <label className="grid gap-2 text-sm font-black text-slate-600">
                            昵称（可选）
                            <input
                                value={registerDisplayName}
                                onChange={(event) => setRegisterDisplayName(event.target.value)}
                                placeholder="展示昵称"
                                disabled={authActionsDisabled}
                                className="rounded-2xl border border-slate-200 bg-white/75 px-4 py-3 text-base font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
                                autoComplete="nickname"
                            />
                        </label>
                    ) : null}

                    <label className="grid gap-2 text-sm font-black text-slate-600">
                        密码
                        <input
                            value={mode === 'login' ? loginPassword : registerPassword}
                            onChange={(event) =>
                                mode === 'login'
                                    ? setLoginPassword(event.target.value)
                                    : setRegisterPassword(event.target.value)
                            }
                            type="password"
                            placeholder={mode === 'login' ? '请输入密码' : '至少 8 位'}
                            disabled={authActionsDisabled}
                            className="rounded-2xl border border-slate-200 bg-white/75 px-4 py-3 text-base font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100"
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            minLength={mode === 'register' ? 8 : undefined}
                            maxLength={128}
                        />
                    </label>

                    {infoMessage ? (
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-700">
                            {infoMessage}
                        </div>
                    ) : null}

                    {errorMessage ? (
                        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold leading-6 text-rose-700">
                            {errorMessage}
                        </div>
                    ) : null}

                    {mode === 'login' ? (
                        <button
                            type="button"
                            onClick={requestPasswordReset}
                            disabled={isPasswordResetSubmitting || authActionsDisabled}
                            className="justify-self-start text-sm font-black text-cyan-700 transition hover:text-cyan-900 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPasswordResetSubmitting ? '正在发送...' : '忘记密码？发送重设邮件'}
                        </button>
                    ) : null}

                    <button
                        type="submit"
                        disabled={authActionsDisabled}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1f6c8f,#1aa47f)] px-5 py-3.5 text-sm font-black text-white shadow-[0_16px_28px_rgba(28,111,122,0.2)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={17} className="animate-spin" />
                                {mode === 'login' ? '登录中...' : '注册中...'}
                            </>
                        ) : (
                            <>
                                {mode === 'login' ? '登录' : '注册并发送验证邮件'}
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white/55 p-4">
                    <div className="text-sm font-black text-slate-900">登录后可以获得什么？</div>
                    <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-600">
                        <li>游客：公开博客和记录不需要登录。</li>
                        <li>注册用户：保留账号、找回密码，后续承接学习记录和私有工具权限。</li>
                        <li>管理员：登录后进入个人导航页，集中打开后台、AI API 和密码相关服务。</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
