import Link from 'next/link';
import { ArrowRight, ExternalLink, Hammer, Layers, Wrench } from 'lucide-react';
import { personalToolbox } from '@/lib/aitool2';

const groups = [
    {
        title: '模型供应商',
        description: '语音、图片、LLM、文件接口和临时 API 测试。',
        items: ['StepFun 文件管理', 'API Lab'],
    },
    {
        title: '研发辅助',
        description: '流程图、提示词、测试集和网页生成。',
        items: ['Mermaid 在线查看', 'API Lab'],
    },
    {
        title: '个人站点材料',
        description: '产品介绍、隐私政策、站点链接和记录页。',
        items: ['产品页', '隐私政策 URL', '常用链接', '想法记录'],
    },
];

export default function ToolsPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(226,232,240,0.9),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-10 text-slate-900 md:px-8 md:py-14">
            <section className="mx-auto max-w-7xl">
                <div className="rounded-[42px] border border-slate-900/10 bg-[linear-gradient(135deg,#0f172a_0%,#334155_100%)] p-6 text-white shadow-[0_28px_100px_rgba(15,23,42,0.18)] md:p-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-bold text-slate-200">
                        <Wrench size={16} />
                        AiTool 2.0 Toolbox
                    </div>
                    <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
                        工具先服务我的日常，再慢慢沉淀成产品能力。
                    </h1>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200/85 md:text-lg">
                        这里把高频工具重新归类：StepFun 文件管理继续保留；图片、语音、文本、文件和实时接口能力统一收进 API Lab，不再拆成多个单独入口。
                    </p>
                </div>
            </section>

            <section className="mx-auto mt-8 grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-3">
                {personalToolbox.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link
                            key={tool.href}
                            href={tool.href}
                            className="card-hover rounded-[34px] border border-slate-900/10 bg-white/[0.84] p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-slate-950 p-3 text-white">
                                    <Icon size={22} />
                                </div>
                                <span className={`rounded-full border px-3 py-1 text-xs font-black ${tool.accent}`}>
                                    {tool.tag}
                                </span>
                            </div>
                            <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-900">
                                {tool.title}
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                {tool.description}
                            </p>
                            <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-slate-700">
                                打开工具
                                {tool.external ? <ExternalLink size={15} /> : <ArrowRight size={15} />}
                            </div>
                        </Link>
                    );
                })}
            </section>

            <section className="mx-auto mt-8 grid max-w-7xl gap-4 lg:grid-cols-3">
                {groups.map((group) => (
                    <article key={group.title} className="rounded-[32px] border border-slate-900/10 bg-white/[0.78] p-6 shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-slate-100 text-slate-700">
                            {group.title === '模型供应商' ? <Layers size={20} /> : <Hammer size={20} />}
                        </div>
                        <h3 className="mt-4 text-xl font-black tracking-tight text-slate-900">
                            {group.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600">
                            {group.description}
                        </p>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {group.items.map((item) => (
                                <span key={item} className="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}
