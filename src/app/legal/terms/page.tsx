import Link from 'next/link';
import { ArrowRight, FileText, Scale } from 'lucide-react';
import { japaneseLearningAppName, legalUpdatedAt, supportEmail } from '@/lib/appStore';

const terms = [
    {
        title: '接受条款',
        body: `使用 ${japaneseLearningAppName} 或相关服务，即表示你同意本使用条款和隐私政策。如果你不同意，请停止使用相关 App 和服务。`,
    },
    {
        title: '账号与安全',
        body: '你应妥善保管账号、密码和登录设备。请勿共享账号、绕过权限限制、滥用试用或订阅权益。发现异常使用时，我们可能限制、暂停或终止服务。',
    },
    {
        title: 'AI 与学习内容',
        body: 'App 可能提供翻译、语音识别、同传、跟读建议、笔记整理或 AI 生成内容。此类结果仅用于学习和辅助理解，可能存在错误，不应作为法律、医疗、财务、考试认证或正式翻译依据。',
    },
    {
        title: '用户内容',
        body: '你保留自己输入、上传或录制内容的权利。你授予我们在提供功能、同步历史、排查问题和改进服务所需范围内处理这些内容的权限。请勿上传侵犯他人权利、违法或含敏感隐私的数据。',
    },
    {
        title: '订阅、购买与退款',
        body: '如 App 提供订阅或应用内购买，购买、续订、取消和退款会通过 Apple 处理。你可以在 Apple ID 订阅管理中取消自动续订。退款申请请按 Apple 的规则提交。',
    },
    {
        title: '禁止行为',
        body: '不得逆向工程、攻击服务、批量抓取、绕过风控、上传恶意内容、侵犯他人权利、使用 App 从事违法活动，或以可能损害服务稳定性和其他用户体验的方式使用。',
    },
    {
        title: '服务变更',
        body: '我们可能根据产品迭代、供应商能力、成本、安全或合规原因调整、暂停或终止部分功能。重大变化会尽量通过 App、网站或更新说明告知。',
    },
    {
        title: '免责声明与责任限制',
        body: '在法律允许范围内，服务按“现状”和“可用”提供。我们不保证 AI 输出完全准确、服务不中断或适合所有特定用途。对于间接损失、数据丢失或第三方服务问题，我们不承担超出法律要求的责任。',
    },
];

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(226,232,240,0.9),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-10 text-slate-900 md:px-8 md:py-14">
            <article className="mx-auto max-w-5xl rounded-[42px] border border-slate-900/10 bg-white/[0.86] p-6 shadow-[0_28px_100px_rgba(15,23,42,0.12)] backdrop-blur md:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm font-bold text-slate-600">
                    <Scale size={16} />
                    Terms of Use
                </div>
                <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 md:text-6xl">
                    使用条款
                </h1>
                <p className="mt-5 text-sm leading-8 text-slate-600 md:text-base">
                    更新日期：{legalUpdatedAt}。如果 App Store Connect 需要填写 Terms of Use URL，可使用本页面。若使用 Apple 标准 EULA，也可以在 App Store Connect 中选择 Apple 标准许可协议。
                </p>

                <div className="mt-8 space-y-5">
                    {terms.map((item) => (
                        <section key={item.title} className="rounded-[28px] border border-slate-900/10 bg-white/[0.76] p-5">
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-slate-700" />
                                <h2 className="text-xl font-black tracking-tight text-slate-900">{item.title}</h2>
                            </div>
                            <p className="mt-3 text-sm leading-8 text-slate-600 md:text-base">{item.body}</p>
                        </section>
                    ))}
                </div>

                <section className="mt-8 rounded-[28px] border border-slate-900/10 bg-slate-50 p-5 text-sm leading-8 text-slate-600">
                    <h2 className="text-lg font-black text-slate-900">联系我们</h2>
                    <p className="mt-2">
                        如对本条款有疑问，请联系
                        <a href={`mailto:${supportEmail}`} className="mx-1 font-black text-slate-900 underline underline-offset-4">{supportEmail}</a>。
                    </p>
                </section>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/legal/apple-privacy" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">
                        查看隐私政策
                        <ArrowRight size={16} />
                    </Link>
                    <Link href="/support" className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-white">
                        支持页面
                    </Link>
                </div>
            </article>
        </main>
    );
}

