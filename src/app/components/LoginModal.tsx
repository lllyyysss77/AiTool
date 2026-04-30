'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Loader2, LockKeyhole, Mail, UserRound, X } from 'lucide-react';
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
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [registerDisplayName, setRegisterDisplayName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [humanChallenge, setHumanChallenge] = useState<HumanChallenge | null>(null);
    const [humanToken, setHumanToken] = useState('');
    const [humanTokenExpiresAt, setHumanTokenExpiresAt] = useState('');
    const [humanSliderValue, setHumanSliderValue] = useState(0);
    const [humanStatus, setHumanStatus] = useState('拖动滑块到最右侧，完成真人验证。');
    const [isHumanLoading, setIsHumanLoading] = useState(false);
    const [isHumanVerifying, setIsHumanVerifying] = useState(false);
    const humanDragRef = useRef({ startedAt: 0, moves: 0, pointerType: 'pointer' });
    const humanSliderValueRef = useRef(0);
    const humanVerifyInFlightRef = useRef(false);

    const isHumanVerified = useCallback(() => {
        if (!humanToken) return false;

        const expiresAt = Date.parse(humanTokenExpiresAt || '');
        return Number.isFinite(expiresAt) && expiresAt > Date.now() + 60_000;
    }, [humanToken, humanTokenExpiresAt]);

    const clearHumanVerification = useCallback((message = '拖动滑块到最右侧，完成真人验证。') => {
        setHumanToken('');
        setHumanTokenExpiresAt('');
        setHumanSliderValue(0);
        humanSliderValueRef.current = 0;
        setHumanStatus(message);
    }, []);

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
                setHumanSliderValue(0);
                humanSliderValueRef.current = 0;
                setHumanStatus(payload.message || '拖动滑块到最右侧，完成真人验证。');
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
            const startedAt = humanDragRef.current.startedAt || Date.now() - challenge.minDurationMs;
            const durationMs = Math.max(Date.now() - startedAt, challenge.minDurationMs + 120);
            const dragDistance = Math.max(challenge.minDragDistance + 24, 140);

            const response = await fetch('/api/auth/human/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    challengeToken: challenge.challengeToken,
                    durationMs,
                    dragDistance,
                    pointerMoves: Math.max(humanDragRef.current.moves, 3),
                    pointerType: humanDragRef.current.pointerType,
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
            setHumanSliderValue(100);
            humanSliderValueRef.current = 100;
            setHumanStatus('验证完成，登录请求会使用 unified-app-backend 的人机令牌。');
        } catch (error) {
            setHumanChallenge(null);
            clearHumanVerification(error instanceof Error ? error.message : '真人验证失败，请重试');
        } finally {
            humanVerifyInFlightRef.current = false;
            setIsHumanVerifying(false);
        }
    }, [clearHumanVerification, isHumanVerified, loadHumanChallenge]);

    useEffect(() => {
        if (!modalOpen || user || isHumanVerified()) return;
        void loadHumanChallenge().catch((error) => {
            setHumanStatus(error instanceof Error ? error.message : '真人验证初始化失败');
        });
    }, [isHumanVerified, loadHumanChallenge, modalOpen, user]);

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

    const title = useMemo(
        () => (mode === 'login' ? '欢迎回到 AiTool' : '创建你的 AiTool 账号'),
        [mode]
    );

    const description = useMemo(
        () =>
            mode === 'login'
                ? '直接在当前弹层输入邮箱和密码登录，成功后会回到刚才正在访问的页面。'
                : '注册会通过 unified-app-backend 创建账号，并在成功后自动登录，不再跳转到外部页面。',
        [mode]
    );

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
    };

    const validateClientSide = () => {
        if (mode === 'login') {
            if (!loginIdentifier.trim()) return '请输入邮箱';
            if (!EMAIL_REGEX.test(loginIdentifier.trim())) return '邮箱格式不正确';
            if (!loginPassword) return '请输入密码';
            if (!isHumanVerified()) return '请先拖动滑块完成人机验证';
            return '';
        }

        if (!registerEmail.trim()) return '请输入邮箱';
        if (!EMAIL_REGEX.test(registerEmail.trim())) return '邮箱格式不正确';
        if (!registerPassword) return '请输入密码';
        if (registerPassword.length < 8) return '密码至少需要 8 位';
        if (registerPassword !== registerConfirmPassword) return '两次输入的密码不一致';
        if (!isHumanVerified()) return '请先拖动滑块完成人机验证';
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

        try {
            const endpoint =
                mode === 'login' ? '/api/auth/password-login' : '/api/auth/register';
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
                          confirmPassword: registerConfirmPassword,
                          displayName: registerDisplayName.trim(),
                          humanToken,
                          next: nextUrl,
                      };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = (await response.json().catch(() => null)) as AuthResponse | null;
            if (!response.ok || !result?.ok) {
                const message = result?.msg || (mode === 'login' ? '登录失败' : '注册失败');
                if (message.includes('真人') || message.includes('人机') || message.toLowerCase().includes('human')) {
                    setHumanChallenge(null);
                    clearHumanVerification('真人验证已失效，请重新拖动滑块。');
                    void loadHumanChallenge(true).catch((error) => {
                        setHumanStatus(error instanceof Error ? error.message : '真人验证初始化失败');
                    });
                }
                setErrorMessage(message);
                return;
            }

            window.location.href = result.redirectTo || nextUrl;
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : '请求失败');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
            onClick={handleClose}
        >
            <section
                className="relative w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-[#eef4fb] shadow-[0_28px_100px_rgba(15,23,42,0.26)]"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="login-modal-title"
            >
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-5 top-5 z-20 rounded-full border border-white/60 bg-white/75 p-2 text-slate-500 transition hover:bg-white hover:text-slate-900"
                    aria-label="关闭登录弹窗"
                >
                    <X size={18} />
                </button>

                <div className="grid min-h-[720px] lg:grid-cols-[1.18fr_0.82fr]">
                    <div className="relative overflow-hidden border-b border-white/35 bg-gradient-to-br from-[#dfe9f8] via-[#d7e3f4] to-[#c5d9f2] px-7 py-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
                        <div className="inline-flex items-center rounded-full border border-[#b8cae5] bg-white/55 px-5 py-3 text-[15px] font-medium text-[#597196] shadow-sm">
                            AiTool / Secure Access
                        </div>

                        <div className="relative mt-14 flex min-h-[420px] items-center justify-center">
                            <div className="absolute h-[340px] w-[340px] rounded-full border border-white/45 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.86),rgba(209,228,248,0.35)_68%,rgba(209,228,248,0)_100%)]" />
                            <div className="absolute bottom-[-140px] left-1/2 h-[240px] w-[760px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(circle_at_center,rgba(147,179,228,0.42),rgba(147,179,228,0.18)_60%,rgba(147,179,228,0)_78%)]" />
                            <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-[28px] border border-white/55 bg-white/58 text-5xl font-semibold text-[#30558a] shadow-[0_18px_45px_rgba(122,151,194,0.24)] backdrop-blur">
                                A
                            </div>
                        </div>

                        <div className="relative z-10 mt-auto space-y-4 text-[#47648f]">
                            <div className="text-sm uppercase tracking-[0.22em] text-[#7a93b8]">
                                AiTool Platform
                            </div>
                            <div className="text-4xl font-semibold text-[#2d4d82]">
                                统一身份认证入口
                            </div>
                            <p className="max-w-xl text-lg leading-8 text-[#5c769b]">
                                登录后进入个人工具站和需要权限的工具入口。认证交互在站内完成，并由 unified-app-backend 统一签发会话。
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#f7f9fc] px-7 py-8 sm:px-9 lg:px-10 lg:py-10">
                        <div className="flex h-full flex-col">
                            <div className="text-[48px] font-semibold leading-none text-[#173b6d]">
                                AiTool
                            </div>
                            <h2
                                id="login-modal-title"
                                className="mt-10 text-[36px] font-semibold leading-tight text-[#173b6d]"
                            >
                                {title}
                            </h2>
                            <p className="mt-5 max-w-md text-[15px] leading-8 text-[#6b82a8]">
                                {description}
                            </p>

                            <div className="mt-8 inline-flex rounded-[24px] border border-[#c7d4e6] bg-white p-2 shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => switchMode('login')}
                                    className={`rounded-[18px] px-7 py-3 text-lg font-semibold transition ${
                                        mode === 'login'
                                            ? 'bg-[#dbe6f8] text-[#173b6d]'
                                            : 'text-[#7286a7] hover:text-[#173b6d]'
                                    }`}
                                >
                                    账号登录
                                </button>
                                <button
                                    type="button"
                                    onClick={() => switchMode('register')}
                                    className={`rounded-[18px] px-7 py-3 text-lg font-semibold transition ${
                                        mode === 'register'
                                            ? 'bg-[#dbe6f8] text-[#173b6d]'
                                            : 'text-[#7286a7] hover:text-[#173b6d]'
                                    }`}
                                >
                                    邮箱注册
                                </button>
                            </div>

                            <form className="mt-8 flex flex-1 flex-col" onSubmit={submit}>
                                {mode === 'register' && (
                                    <label className="mb-5 block">
                                        <span className="mb-3 block text-lg font-medium text-[#4b678f]">
                                            昵称
                                        </span>
                                        <div className="flex h-20 items-center rounded-[999px] border border-[#c4d2e5] bg-white px-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                                            <UserRound size={20} className="mr-4 text-[#86a0c4]" />
                                            <input
                                                value={registerDisplayName}
                                                onChange={(event) => setRegisterDisplayName(event.target.value)}
                                                placeholder="可选，不填则默认取邮箱前缀"
                                                className="h-full w-full bg-transparent text-[18px] text-[#173b6d] outline-none placeholder:text-[#9aaec9]"
                                                autoComplete="nickname"
                                            />
                                        </div>
                                    </label>
                                )}

                                <label className="mb-5 block">
                                    <span className="mb-3 block text-lg font-medium text-[#4b678f]">
                                        邮箱
                                    </span>
                                    <div className="flex h-20 items-center rounded-[999px] border border-[#c4d2e5] bg-white px-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                                        <Mail size={20} className="mr-4 text-[#86a0c4]" />
                                        <input
                                            value={mode === 'login' ? loginIdentifier : registerEmail}
                                            onChange={(event) =>
                                                mode === 'login'
                                                    ? setLoginIdentifier(event.target.value)
                                                    : setRegisterEmail(event.target.value)
                                            }
                                            placeholder="请输入邮箱"
                                            className="h-full w-full bg-transparent text-[18px] text-[#173b6d] outline-none placeholder:text-[#9aaec9]"
                                            autoComplete="email"
                                            inputMode="email"
                                        />
                                    </div>
                                </label>

                                <label className="mb-5 block">
                                    <span className="mb-3 block text-lg font-medium text-[#4b678f]">
                                        密码
                                    </span>
                                    <div className="flex h-20 items-center rounded-[999px] border border-[#c4d2e5] bg-white px-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                                        <LockKeyhole size={20} className="mr-4 text-[#86a0c4]" />
                                        <input
                                            value={mode === 'login' ? loginPassword : registerPassword}
                                            onChange={(event) =>
                                                mode === 'login'
                                                    ? setLoginPassword(event.target.value)
                                                    : setRegisterPassword(event.target.value)
                                            }
                                            type="password"
                                            placeholder="请输入密码"
                                            className="h-full w-full bg-transparent text-[18px] text-[#173b6d] outline-none placeholder:text-[#9aaec9]"
                                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                        />
                                    </div>
                                </label>

                                {mode === 'register' && (
                                    <label className="mb-5 block">
                                        <span className="mb-3 block text-lg font-medium text-[#4b678f]">
                                            确认密码
                                        </span>
                                        <div className="flex h-20 items-center rounded-[999px] border border-[#c4d2e5] bg-white px-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                                            <LockKeyhole size={20} className="mr-4 text-[#86a0c4]" />
                                            <input
                                                value={registerConfirmPassword}
                                                onChange={(event) =>
                                                    setRegisterConfirmPassword(event.target.value)
                                                }
                                                type="password"
                                                placeholder="请再次输入密码"
                                                className="h-full w-full bg-transparent text-[18px] text-[#173b6d] outline-none placeholder:text-[#9aaec9]"
                                                autoComplete="new-password"
                                            />
                                        </div>
                                    </label>
                                )}

                                <div className="mb-5 rounded-[28px] border border-[#c4d2e5] bg-white/75 px-5 py-4 shadow-sm">
                                    <div className="mb-3 flex items-center justify-between gap-3 text-sm text-[#5f789f]">
                                        <span className="font-semibold text-[#365d91]">真人验证</span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                clearHumanVerification();
                                                void loadHumanChallenge(true).catch((error) => {
                                                    setHumanStatus(error instanceof Error ? error.message : '真人验证初始化失败');
                                                });
                                            }}
                                            disabled={isSubmitting || isHumanLoading || isHumanVerifying}
                                            className="text-[#295b9a] transition hover:text-[#173b6d] disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            重新验证
                                        </button>
                                    </div>
                                    <div className="relative h-14 overflow-hidden rounded-full border border-[#bdd0eb] bg-[#edf4ff]">
                                        <div
                                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#c9dbf7] to-[#9fbceb] transition-[width]"
                                            style={{ width: `${humanSliderValue}%` }}
                                        />
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            value={humanSliderValue}
                                            onPointerDown={(event) => {
                                                if (isHumanVerified()) return;
                                                humanDragRef.current = {
                                                    startedAt: Date.now(),
                                                    moves: 0,
                                                    pointerType: event.pointerType || 'pointer',
                                                };
                                                setHumanStatus('继续拖到最右侧完成验证。');
                                                if (!humanChallenge) {
                                                    void loadHumanChallenge().catch((error) => {
                                                        setHumanStatus(error instanceof Error ? error.message : '真人验证初始化失败');
                                                    });
                                                }
                                            }}
                                            onPointerUp={() => {
                                                if (!isHumanVerified() && humanSliderValueRef.current < 100) {
                                                    setHumanStatus('还没有拖到最右侧，请继续拖动。');
                                                }
                                            }}
                                            onChange={(event) => {
                                                if (isHumanVerified()) return;
                                                const nextValue = Number(event.target.value);
                                                humanSliderValueRef.current = nextValue;
                                                humanDragRef.current.moves += 1;
                                                setHumanSliderValue(nextValue);
                                                if (nextValue >= 100) {
                                                    void verifyHuman();
                                                } else if (nextValue > 0) {
                                                    setHumanStatus('继续拖到最右侧完成验证。');
                                                }
                                            }}
                                            disabled={isSubmitting || isHumanLoading || isHumanVerifying || isHumanVerified()}
                                            className="absolute inset-0 z-10 h-full w-full cursor-pointer bg-transparent px-3 accent-[#537fbd] disabled:cursor-not-allowed"
                                            aria-label="拖动滑块完成真人验证"
                                        />
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#426899]">
                                            {isHumanLoading
                                                ? '正在准备验证...'
                                                : isHumanVerifying
                                                  ? '验证中...'
                                                  : isHumanVerified()
                                                    ? '已完成验证'
                                                    : '拖动到最右侧'}
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm leading-6 text-[#6d84a9]">{humanStatus}</div>
                                </div>

                                {errorMessage && (
                                    <div className="mb-5 rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-[15px] text-red-600">
                                        {errorMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-4 inline-flex h-20 items-center justify-center gap-3 rounded-[999px] bg-gradient-to-r from-[#bed2f4] to-[#a7c2f0] text-[20px] font-semibold text-[#173b6d] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition hover:from-[#b2caf2] hover:to-[#9bb9ec] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            {mode === 'login' ? '登录中...' : '注册中...'}
                                        </>
                                    ) : (
                                        <>
                                            {mode === 'login' ? '登录' : '注册并登录'}
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>

                                <div className="mt-8 text-center text-[16px] text-[#6c83a8]">
                                    {mode === 'login' ? '还没有账号？' : '已经有账号？'}
                                    <button
                                        type="button"
                                        onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                                        className="ml-2 font-semibold text-[#295b9a] transition hover:text-[#173b6d]"
                                    >
                                        {mode === 'login' ? '去注册' : '去登录'}
                                    </button>
                                </div>

                                <div className="mt-6 text-sm leading-7 text-[#7a90b1]">
                                    登录即表示继续使用当前工具站。认证成功后将返回：
                                    <span className="ml-2 font-mono text-[#47648f] break-all">
                                        {nextUrl}
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
