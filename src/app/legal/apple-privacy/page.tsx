import Link from 'next/link';
import { ArrowRight, Brain, Cloud, Database, Headphones, Lock, Mic, ShieldCheck, Trash2 } from 'lucide-react';
import { appStoreUrls, japaneseLearningAppName, legalUpdatedAt, supportEmail } from '@/lib/appStore';

const sections = [
    {
        title: '适用范围',
        icon: ShieldCheck,
        body: `${japaneseLearningAppName} 以及 Owen Shen 发布的相关个人学习工具，会在你主动使用翻译、语音识别、跟读、同声传译、笔记、历史记录、学习资料管理等功能时处理必要数据。本政策适用于 App、网站和相关后台服务。`,
    },
    {
        title: '我们可能处理的数据',
        icon: Database,
        body: '包括账号标识、邮箱或昵称、设备与应用版本、你主动输入的文本、上传或录制的音频、学习笔记、翻译结果、跟读记录、收藏内容、应用设置、错误日志和必要的服务请求信息。我们不会主动索取身份证件、银行卡、精确定位、通讯录或健康数据。',
    },
    {
        title: '语音与 AI 处理',
        icon: Mic,
        body: '当你使用语音识别、同传、跟读评分、翻译、文本生成或语音合成功能时，相关文本、音频片段和请求参数可能会发送到云端服务或第三方模型供应商处理。处理目的仅限于完成你请求的学习、翻译、理解和生成任务。',
    },
    {
        title: '本地保存与云端同步',
        icon: Lock,
        body: '部分历史记录、草稿、缓存、学习进度和偏好设置可能保存在设备本地。登录后，为了跨设备同步、恢复历史或排查问题，部分记录可能会保存在服务器。你可以在 App 内删除历史记录、清理缓存，或按照数据删除说明申请删除云端数据。',
    },
    {
        title: '第三方服务',
        icon: Cloud,
        body: 'App 可能接入登录、云数据库、对象存储、语音识别、翻译、语音合成、模型推理、支付、崩溃分析或基础统计服务。第三方只会在实现对应功能所需范围内接收必要数据，并根据其自身隐私政策处理。',
    },
    {
        title: '数据用途',
        icon: Brain,
        body: '我们使用数据来提供核心功能、保存学习进度、改进体验、排查错误、防止滥用、处理订阅或额度、保障账户安全，以及满足法律法规或平台审核要求。除非取得你的明确同意，我们不会出售你的个人数据。',
    },
    {
        title: '保留与删除',
        icon: Trash2,
        body: '本地数据会保留在设备上，直到你主动删除 App、清理缓存或删除历史。云端数据会在提供服务、问题排查、安全审计和合规要求所需期间保留。你可以通过 App 内入口或支持邮箱申请删除账号与相关数据。',
    },
    {
        title: '未成年人',
        icon: Headphones,
        body: '本产品主要面向需要学习日语的普通用户，不面向 13 岁以下儿童设计。如果你是未成年人，请在监护人同意和指导下使用。我们不会有意收集儿童的个人敏感信息。',
    },
];

const dataTable = [
    ['账号信息', '邮箱、昵称、用户 ID', '登录、同步、客服支持、账号安全'],
    ['用户内容', '文本、笔记、翻译内容、学习记录', '提供学习、翻译、历史回看和复用功能'],
    ['语音数据', '录音、发音片段、识别结果', '语音识别、跟读练习、同传和发音反馈'],
    ['设备与诊断', '设备类型、系统版本、应用版本、错误日志', '排查问题、提升稳定性和防止滥用'],
    ['购买信息', '订阅状态、交易标识、权益状态', '恢复购买、开通权益和处理售后'],
];

export default function ApplePrivacyPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(226,232,240,0.9),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-10 text-slate-900 md:px-8 md:py-14">
            <article className="mx-auto max-w-6xl rounded-[42px] border border-slate-900/10 bg-white/[0.86] p-6 shadow-[0_28px_100px_rgba(15,23,42,0.12)] backdrop-blur md:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm font-bold text-slate-600">
                    <ShieldCheck size={16} />
                    Privacy Policy
                </div>
                <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 md:text-6xl">
                    隐私政策
                </h1>
                <p className="mt-5 max-w-4xl text-sm leading-8 text-slate-600 md:text-base">
                    更新日期：{legalUpdatedAt}。本页面可作为提交 Apple App Store Connect 时填写的隐私政策网址。正式提交前，请确保 App Store 隐私标签与你实际使用的数据、SDK 和后台服务一致。
                </p>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <section key={section.title} className="rounded-[28px] border border-slate-900/10 bg-white/[0.76] p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                        <Icon size={18} />
                                    </div>
                                    <h2 className="text-xl font-black tracking-tight text-slate-900">
                                        {section.title}
                                    </h2>
                                </div>
                                <p className="mt-3 text-sm leading-8 text-slate-600 md:text-base">
                                    {section.body}
                                </p>
                            </section>
                        );
                    })}
                </div>

                <section className="mt-8 rounded-[28px] border border-slate-900/10 bg-slate-50 p-5">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">数据类型与用途</h2>
                    <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-900/10 bg-white">
                        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                            <thead className="bg-slate-100 text-slate-600">
                            <tr>
                                <th className="px-4 py-3 font-black">类别</th>
                                <th className="px-4 py-3 font-black">示例</th>
                                <th className="px-4 py-3 font-black">用途</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dataTable.map(([category, examples, purpose]) => (
                                <tr key={category} className="border-t border-slate-900/10">
                                    <td className="px-4 py-3 font-semibold text-slate-900">{category}</td>
                                    <td className="px-4 py-3 text-slate-600">{examples}</td>
                                    <td className="px-4 py-3 text-slate-600">{purpose}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="mt-8 rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-sm leading-8 text-amber-900">
                    <h2 className="text-lg font-black">联系我们与用户权利</h2>
                    <p className="mt-2">
                        如果你需要访问、更正、导出或删除数据，或对隐私政策有疑问，可以通过
                        <a href={`mailto:${supportEmail}`} className="mx-1 font-black underline underline-offset-4">{supportEmail}</a>
                        联系。你也可以查看
                        <Link href="/legal/data-deletion" className="mx-1 font-black underline underline-offset-4">数据与账号删除说明</Link>
                        了解处理流程。
                    </p>
                </section>

                <div className="mt-8 grid gap-3 md:grid-cols-2">
                    {appStoreUrls.filter((item) => item.href !== '/legal/apple-privacy').map((item) => (
                        <Link key={item.href} href={item.href} className="rounded-[24px] border border-slate-900/10 bg-white/75 p-4 transition hover:bg-white">
                            <div className="text-sm font-black text-slate-900">{item.title}</div>
                            <p className="mt-1 text-xs leading-6 text-slate-500">{item.description}</p>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">
                        回到产品页
                        <ArrowRight size={16} />
                    </Link>
                    <Link href="/support" className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-white">
                        查看支持页
                    </Link>
                </div>
            </article>
        </main>
    );
}

