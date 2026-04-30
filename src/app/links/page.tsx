import Link from 'next/link';
import { ExternalLink, Github, Link2 } from 'lucide-react';
import { personalSites, personalToolbox } from '@/lib/aitool2';

const externalLinks = [
    {
        title: 'GitHub / AiTool',
        href: 'https://github.com/owenshen0907/AiTool',
        description: '当前 AiTool 代码仓库。',
    },
    {
        title: '线上 StepFun 文件管理',
        href: 'https://owenshen.top/stepfun/file',
        description: '老服务保留路径，2.0 继续兼容。',
    },
];

const appStoreLinks = [
    { title: '隐私政策', href: '/legal/apple-privacy' },
    { title: '支持页面', href: '/support' },
    { title: '使用条款', href: '/legal/terms' },
    { title: '数据删除说明', href: '/legal/data-deletion' },
    { title: '上架材料清单', href: '/legal/app-store-checklist' },
];

export default function LinksPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(226,232,240,0.9),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-10 text-slate-900 md:px-8 md:py-14">
            <section className="mx-auto max-w-7xl rounded-[42px] border border-slate-900/10 bg-[linear-gradient(135deg,#0f172a_0%,#334155_100%)] p-6 text-white shadow-[0_28px_100px_rgba(15,23,42,0.18)] md:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-bold text-slate-200">
                    <Link2 size={16} />
                    Site Links
                </div>
                <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
                    把个人站点路径整理成可复制的目录。
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200/85 md:text-lg">
                    产品介绍、工具入口、隐私政策、GitHub 和常用 Demo 后续都可以从这里找。
                </p>
            </section>

            <section className="mx-auto mt-8 grid max-w-7xl gap-5 lg:grid-cols-2">
                <div className="rounded-[34px] border border-slate-900/10 bg-white/[0.84] p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
                    <h2 className="text-2xl font-black tracking-tight text-slate-900">内部路径</h2>
                    <div className="mt-5 space-y-3">
                        {[...personalSites, ...personalToolbox, ...appStoreLinks.map((item) => ({
                            ...item,
                            description: 'App Store 上架材料 URL',
                            tag: 'app-store',
                            accent: 'bg-slate-100 text-slate-900 border-slate-200',
                            icon: Link2,
                        }))].map((item) => (
                            <Link key={`${item.title}-${item.href}`} href={item.href} className="flex items-center justify-between gap-3 rounded-[22px] border border-slate-900/10 bg-white/[0.76] px-4 py-3 transition hover:bg-white">
                                <div className="min-w-0">
                                    <div className="text-sm font-black text-slate-900">{item.title}</div>
                                    <div className="mt-1 truncate font-mono text-xs text-slate-500">{item.href}</div>
                                </div>
                                <ExternalLink size={14} className="shrink-0 text-slate-500" />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="rounded-[34px] border border-slate-900/10 bg-white/[0.82] p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
                    <div className="flex items-center gap-3">
                        <Github size={24} className="text-slate-900" />
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">外部链接</h2>
                    </div>
                    <div className="mt-5 space-y-3">
                        {externalLinks.map((item) => (
                            <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="block rounded-[22px] border border-slate-900/10 bg-slate-50 px-4 py-3 transition hover:bg-white">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm font-black text-slate-900">{item.title}</div>
                                    <ExternalLink size={14} className="shrink-0 text-slate-500" />
                                </div>
                                <div className="mt-1 break-all font-mono text-xs text-slate-500">{item.href}</div>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
