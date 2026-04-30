import Link from 'next/link';
import { ArrowRight, Bug, CheckCircle2, Headphones, Mail, MessageSquare, RotateCcw } from 'lucide-react';
import { appStoreUrls, japaneseLearningAppName, legalUpdatedAt, supportEmail } from '@/lib/appStore';

const faqs = [
    {
        q: '语音识别或同传结果不准确怎么办？',
        a: '请确认网络稳定、麦克风权限已开启，并尽量在安静环境下录音。AI 结果可能存在误差，重要内容请自行核对。',
    },
    {
        q: '如何删除学习历史或录音？',
        a: '你可以在 App 内的历史记录或设置页面删除本地数据。账号和云端数据删除请参考数据删除说明。',
    },
    {
        q: '订阅或购买后没有生效怎么办？',
        a: '请先尝试恢复购买。如果仍未生效，请提供 Apple 订单截图、App 版本、设备型号和账号信息给支持邮箱。',
    },
    {
        q: 'App 是否可以替代人工翻译或正式语言考试辅导？',
        a: '不可以。App 适合作为学习、练习和辅助理解工具，不保证翻译、发音评分或生成内容完全准确。',
    },
];

const reportItems = [
    'App 名称与版本号',
    'iOS 版本与设备型号',
    '问题发生的页面和时间',
    '复现步骤、截图或录屏',
    '如果涉及购买，请提供订单截图或交易时间',
];

export default function SupportPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(226,232,240,0.9),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-10 text-slate-900 md:px-8 md:py-14">
            <section className="mx-auto max-w-6xl rounded-[42px] border border-slate-900/10 bg-white/[0.86] p-6 shadow-[0_28px_100px_rgba(15,23,42,0.12)] backdrop-blur md:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm font-bold text-slate-600">
                    <Headphones size={16} />
                    Support
                </div>
                <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 md:text-6xl">
                    App 支持与帮助
                </h1>
                <p className="mt-5 max-w-4xl text-sm leading-8 text-slate-600 md:text-base">
                    本页面是 {japaneseLearningAppName} 和相关个人产品的支持 URL，可用于 App Store Connect。更新日期：{legalUpdatedAt}。
                </p>

                <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
                    <section className="rounded-[30px] border border-slate-900/10 bg-white/80 p-6">
                        <div className="flex items-center gap-3">
                            <Mail size={22} className="text-slate-900" />
                            <h2 className="text-2xl font-black tracking-tight text-slate-900">联系方式</h2>
                        </div>
                        <p className="mt-4 text-sm leading-8 text-slate-600">
                            如遇到登录、订阅、语音识别、翻译、数据删除或隐私相关问题，请发送邮件到：
                        </p>
                        <a href={`mailto:${supportEmail}`} className="mt-4 block rounded-2xl border border-slate-900/10 bg-slate-950 px-4 py-4 font-mono text-sm font-black text-white">
                            {supportEmail}
                        </a>
                        <p className="mt-4 text-sm leading-7 text-slate-500">
                            建议使用中文、英文或日文描述问题。通常会在 3 个工作日内尽力回复。
                        </p>
                    </section>

                    <section className="rounded-[30px] border border-slate-900/10 bg-slate-950 p-6 text-white">
                        <div className="flex items-center gap-3">
                            <Bug size={22} />
                            <h2 className="text-2xl font-black tracking-tight">反馈时请提供</h2>
                        </div>
                        <ul className="mt-5 space-y-3">
                            {reportItems.map((item) => (
                                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-200">
                                    <CheckCircle2 size={16} className="mt-1 shrink-0 text-emerald-300" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <section className="mt-8 rounded-[30px] border border-slate-900/10 bg-white/80 p-6">
                    <div className="flex items-center gap-3">
                        <MessageSquare size={22} className="text-slate-900" />
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">常见问题</h2>
                    </div>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                        {faqs.map((faq) => (
                            <article key={faq.q} className="rounded-2xl border border-slate-900/10 bg-slate-50 p-4">
                                <h3 className="text-sm font-black text-slate-900">{faq.q}</h3>
                                <p className="mt-2 text-sm leading-7 text-slate-600">{faq.a}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mt-8 rounded-[30px] border border-slate-900/10 bg-white/80 p-6">
                    <div className="flex items-center gap-3">
                        <RotateCcw size={22} className="text-slate-900" />
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">相关页面</h2>
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {appStoreUrls.filter((item) => item.href !== '/support').map((item) => (
                            <Link key={item.href} href={item.href} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-900/10 bg-white px-4 py-3 transition hover:bg-slate-50">
                                <div>
                                    <div className="text-sm font-black text-slate-900">{item.title}</div>
                                    <div className="mt-1 text-xs text-slate-500">{item.requiredFor}</div>
                                </div>
                                <ArrowRight size={16} className="shrink-0 text-slate-500" />
                            </Link>
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
}

