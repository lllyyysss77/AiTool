import Link from 'next/link';
import { ArrowRight, Clock, Database, Eraser, Mail, Smartphone, Trash2 } from 'lucide-react';
import { legalUpdatedAt, supportEmail } from '@/lib/appStore';

const deletionScopes = [
    {
        title: '本地数据',
        icon: Smartphone,
        body: '包括设备上的缓存、草稿、学习历史、录音、离线资料和偏好设置。你可以在 App 内删除历史、清理缓存，或卸载 App 移除本地数据。',
    },
    {
        title: '云端账号数据',
        icon: Database,
        body: '包括账号标识、同步记录、学习历史、上传素材、订阅权益状态和服务日志。删除后可能无法恢复历史、收藏和跨设备同步内容。',
    },
    {
        title: 'AI 请求内容',
        icon: Eraser,
        body: '包括为完成翻译、语音识别、同传、跟读或生成任务而提交的文本、音频和请求参数。第三方模型供应商的保留周期以其政策和服务配置为准。',
    },
];

const steps = [
    '在 App 内打开“设置”。',
    '进入“账号与隐私”。',
    '选择“删除账号与云端数据”。',
    '阅读影响说明并确认删除。',
    '如果无法登录或 App 暂未显示入口，请发送邮件申请人工处理。',
];

export default function DataDeletionPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(226,232,240,0.9),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-10 text-slate-900 md:px-8 md:py-14">
            <article className="mx-auto max-w-5xl rounded-[42px] border border-slate-900/10 bg-white/[0.86] p-6 shadow-[0_28px_100px_rgba(15,23,42,0.12)] backdrop-blur md:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/70 px-4 py-2 text-sm font-bold text-slate-600">
                    <Trash2 size={16} />
                    Data Deletion
                </div>
                <h1 className="mt-6 text-4xl font-black leading-tight tracking-[-0.05em] text-slate-950 md:text-6xl">
                    数据与账号删除说明
                </h1>
                <p className="mt-5 text-sm leading-8 text-slate-600 md:text-base">
                    更新日期：{legalUpdatedAt}。本页面说明用户如何删除学习历史、素材、缓存、账号和云端数据。若 App 支持账号创建，正式提交审核前，请确保 App 内也提供清晰可见的删除账号入口。
                </p>

                <section className="mt-8 rounded-[30px] border border-slate-900/10 bg-slate-950 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <Clock size={22} />
                        <h2 className="text-2xl font-black tracking-tight">删除流程</h2>
                    </div>
                    <ol className="mt-5 space-y-3">
                        {steps.map((step, index) => (
                            <li key={step} className="flex gap-3 text-sm leading-6 text-slate-200">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-slate-950">
                                    {index + 1}
                                </span>
                                {step}
                            </li>
                        ))}
                    </ol>
                </section>

                <div className="mt-8 grid gap-5 md:grid-cols-3">
                    {deletionScopes.map((item) => {
                        const Icon = item.icon;
                        return (
                            <section key={item.title} className="rounded-[28px] border border-slate-900/10 bg-white/[0.76] p-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                    <Icon size={18} />
                                </div>
                                <h2 className="mt-4 text-xl font-black tracking-tight text-slate-900">{item.title}</h2>
                                <p className="mt-3 text-sm leading-8 text-slate-600">{item.body}</p>
                            </section>
                        );
                    })}
                </div>

                <section className="mt-8 rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-sm leading-8 text-amber-900">
                    <div className="flex items-center gap-3">
                        <Mail size={18} />
                        <h2 className="text-lg font-black">人工删除申请</h2>
                    </div>
                    <p className="mt-2">
                        如果你无法在 App 内完成删除，请发送邮件到
                        <a href={`mailto:${supportEmail}`} className="mx-1 font-black underline underline-offset-4">{supportEmail}</a>
                        ，并提供账号邮箱、App 名称、需要删除的数据范围。我们会在合理期限内处理，并在完成后回复。
                    </p>
                </section>

                <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/legal/apple-privacy" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">
                        查看隐私政策
                        <ArrowRight size={16} />
                    </Link>
                    <Link href="/support" className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-white">
                        联系支持
                    </Link>
                </div>
            </article>
        </main>
    );
}

