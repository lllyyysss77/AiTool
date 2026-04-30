import Link from 'next/link';
import { AlertTriangle, AppWindow, CheckCircle2, ClipboardList, ExternalLink, KeyRound, ListChecks, ShieldCheck } from 'lucide-react';
import { appStoreUrls, japaneseLearningAppName, legalUpdatedAt, supportEmail } from '@/lib/appStore';

const checklist = [
    {
        title: 'App 信息',
        items: ['App 名称、Subtitle、Bundle ID、SKU', '分类、年龄分级、版权信息', 'App 描述、关键词、推广文本'],
    },
    {
        title: '审核信息',
        items: ['审核联系人姓名、电话、邮箱', '如需登录，提供可用测试账号', '说明语音、AI、订阅、账号删除等关键功能路径'],
    },
    {
        title: '隐私与合规',
        items: ['隐私政策 URL', 'App Privacy 隐私标签', '第三方 SDK 与数据用途', '账号删除入口和删除说明'],
    },
    {
        title: '素材',
        items: ['6.5 英寸 iPhone 截图', '必要时补 5.5 英寸或 iPad 截图', 'App 图标、预览视频、营销 URL'],
    },
    {
        title: '付费与订阅',
        items: ['IAP 商品配置', '订阅说明、价格、恢复购买', '使用条款 URL / EULA'],
    },
];

const reviewNotes = [
    '如果 App 需要登录，请在审核备注里写清楚测试账号和功能入口。',
    '如果使用麦克风，请确保权限弹窗文案说明用途：语音识别、跟读、同传或录音练习。',
    '如果有 AI 输出，请在应用内说明结果仅供学习参考，可能不完全准确。',
    '如果创建账号，请确保 App 内能发起删除账号，单纯提供邮件通常不够。',
    '隐私标签必须和实际 SDK、日志、上传、订阅、账号系统保持一致。',
];

export default function AppStoreChecklistPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(226,232,240,0.9),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-10 text-slate-900 md:px-8 md:py-14">
            <section className="mx-auto max-w-7xl rounded-[42px] border border-slate-900/10 bg-white/[0.86] p-6 shadow-[0_28px_100px_rgba(15,23,42,0.12)] backdrop-blur md:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm font-bold text-slate-600">
                    <ListChecks size={16} />
                    App Store Checklist
                </div>
                <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 md:text-6xl">
                    App Store 上架材料清单
                </h1>
                <p className="mt-5 max-w-4xl text-sm leading-8 text-slate-600 md:text-base">
                    为 {japaneseLearningAppName} 准备。更新日期：{legalUpdatedAt}。这个页面主要给自己检查，不一定要提交给 Apple。
                </p>

                <section className="mt-8 rounded-[30px] border border-slate-900/10 bg-slate-950 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <ShieldCheck size={22} />
                        <h2 className="text-2xl font-black tracking-tight">可填写 URL</h2>
                    </div>
                    <div className="mt-5 grid gap-3 lg:grid-cols-2">
                        {appStoreUrls.map((item) => (
                            <Link key={item.href} href={item.href} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 transition hover:bg-white/[0.1]">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="font-black">{item.title}</div>
                                    <ExternalLink size={14} className="text-slate-300" />
                                </div>
                                <div className="mt-2 break-all font-mono text-xs text-slate-300">{item.url}</div>
                                <p className="mt-2 text-xs leading-6 text-slate-400">{item.requiredFor}</p>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mt-8 grid gap-5 lg:grid-cols-5">
                    {checklist.map((group) => (
                        <article key={group.title} className="rounded-[28px] border border-slate-900/10 bg-white/[0.76] p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                <ClipboardList size={18} />
                            </div>
                            <h2 className="mt-4 text-lg font-black tracking-tight text-slate-900">{group.title}</h2>
                            <ul className="mt-4 space-y-3">
                                {group.items.map((item) => (
                                    <li key={item} className="flex gap-2 text-sm leading-6 text-slate-600">
                                        <CheckCircle2 size={15} className="mt-1 shrink-0 text-emerald-600" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </section>

                <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]">
                    <div className="rounded-[30px] border border-amber-200 bg-amber-50 p-6">
                        <div className="flex items-center gap-3 text-amber-900">
                            <AlertTriangle size={22} />
                            <h2 className="text-2xl font-black tracking-tight">容易被问到的点</h2>
                        </div>
                        <ul className="mt-5 space-y-3">
                            {reviewNotes.map((item) => (
                                <li key={item} className="text-sm leading-7 text-amber-900">- {item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-[30px] border border-slate-900/10 bg-white/80 p-6">
                        <div className="flex items-center gap-3">
                            <KeyRound size={22} className="text-slate-900" />
                            <h2 className="text-2xl font-black tracking-tight text-slate-900">审核联系信息</h2>
                        </div>
                        <p className="mt-4 text-sm leading-8 text-slate-600">
                            支持邮箱先统一写：
                            <a href={`mailto:${supportEmail}`} className="font-black text-slate-900 underline underline-offset-4">{supportEmail}</a>
                            。正式提交前请确认该邮箱可以收信。
                        </p>
                        <p className="mt-3 text-sm leading-8 text-slate-600">
                            如果 App 需要账号登录，请准备一个不会过期的测试账号，并在审核备注写清楚登录步骤。
                        </p>
                    </div>
                </section>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">
                        <AppWindow size={16} />
                        回到产品页
                    </Link>
                    <Link href="/support" className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-white">
                        查看支持 URL
                    </Link>
                </div>
            </section>
        </main>
    );
}
