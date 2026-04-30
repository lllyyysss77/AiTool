import Link from 'next/link';
import {
    ArrowRight,
    Bot,
    BookOpenText,
    Compass,
    Layers3,
    MessageCircleHeart,
    Mic2,
    NotebookPen,
    Sparkles,
    Video,
    Wrench,
} from 'lucide-react';

const directions = [
    {
        label: 'Mainline',
        title: '日语学习工具体系',
        subtitle: '做一套完整学习闭环，而不是单个孤立工具。',
        icon: Mic2,
        tone: 'from-cyan-100 via-sky-50 to-white',
        badge: '输入 → 理解 → 练习 → 输出',
        points: [
            '语音方向：对话练习 + 同声传译，解决“开口说”和“实时理解”。',
            '学习助手：单词 / 语法 / 翻译 + 笔记体系，解决“理解 + 记录 + 复用”。',
            'Web 词典：图文结合，把日语知识讲清楚，不只是查词。',
        ],
    },
    {
        label: 'Relationship AI',
        title: '亲人关系的 AI 社交',
        subtitle: '不做泛社交，只做亲人之间更轻、更顺的沟通。',
        icon: MessageCircleHeart,
        tone: 'from-rose-100 via-orange-50 to-white',
        badge: '表达与回应',
        points: [
            '帮助想表达但表达不好的人，把真实想法说清楚。',
            '帮助被需要但没有精力回应的人，用更轻的方式保持连接。',
            '让沟通更顺畅，而不是让关系更疏远。',
        ],
    },
    {
        label: 'Creation Desk',
        title: 'AI Vlog 工作台',
        subtitle: '用户只负责记录素材，其它整理、规划和剪辑交给 AI。',
        icon: Video,
        tone: 'from-amber-100 via-stone-50 to-white',
        badge: '记录生活 → 自动成片',
        points: [
            '输入可以是图片、音频和文字。',
            'AI 自动整理素材、规划结构，并剪辑成片。',
            '把日常记录变成可分享的作品。',
        ],
    },
    {
        label: 'Long Run',
        title: '自进化个人 Agent',
        subtitle: '围绕主流 Agent，做属于个人的长期记忆系统。',
        icon: Bot,
        tone: 'from-lime-100 via-emerald-50 to-white',
        badge: '本地记忆 / 能力进化',
        points: [
            '重要信息只保存在本地。',
            '持续积累个人经验、方法和上下文。',
            '通过类似 evomap 的平台进行能力进化。',
        ],
    },
];

const siteLinks = [
    {
        title: '工具箱',
        body: 'API Lab、Mermaid、文件管理和之后会不断补充的个人高频工具。',
        href: '/tools',
        icon: Wrench,
    },
    {
        title: '产品目录',
        body: '把正在做的 App、Web 产品、隐私政策和发布说明整理在一起。',
        href: '/products',
        icon: Layers3,
    },
    {
        title: '想法记录',
        body: '产品判断、模型体验、开发过程和踩坑记录先低摩擦收进来。',
        href: '/notes',
        icon: NotebookPen,
    },
];

const principles = [
    '先做自己每天真的会用的东西。',
    '工具、产品和记录放在同一个工作网站里。',
    '从真实场景开始，再逐步沉淀成可复用系统。',
];

export default function HomePage() {
    return (
        <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_8%_0%,rgba(203,213,225,0.76),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(186,230,253,0.62),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#edf2f7_48%,#f8fafc_100%)] text-slate-900">
            <section className="relative px-4 py-10 md:px-8 md:py-14">
                <div className="pointer-events-none absolute left-1/2 top-8 h-40 w-[48rem] -translate-x-1/2 rounded-full bg-white/55 blur-3xl" />
                <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
                    <div className="rounded-[44px] border border-slate-900/10 bg-slate-950 p-6 text-white shadow-[0_32px_120px_rgba(15,23,42,0.22)] md:p-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-bold text-slate-200">
                            <Sparkles size={16} />
                            AI Products · Personal Toolbox · Build Notes
                        </div>

                        <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
                            把 AI 产品、工具和记录，整理成一个长期工作的个人站点。
                        </h1>

                        <p className="mt-7 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                            过去十年，我一直在做传统软件开发和交付。现在我更关注：如何把 AI 真正落到语言学习、亲人沟通、生活记录和个人生产力里，并持续公开记录开发过程与踩坑。
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-[0_16px_38px_rgba(255,255,255,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-100"
                            >
                                看产品方向
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/tools"
                                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/[0.14]"
                            >
                                打开工具箱
                            </Link>
                        </div>
                    </div>

                    <aside className="grid gap-4">
                        <div className="rounded-[38px] border border-white/75 bg-white/[0.78] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:p-7">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#20342b_0%,#5f6b3f_55%,#d49b42_100%)] text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
                                    <Compass size={22} />
                                </div>
                                <span className="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                                    Current Focus
                                </span>
                            </div>
                            <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-slate-950">
                                4 条产品线，一个个人操作系统。
                            </h2>
                            <div className="mt-5 space-y-3">
                                {principles.map((item, index) => (
                                    <div key={item} className="flex items-center gap-3 rounded-[20px] border border-slate-900/10 bg-white/70 p-3">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
                                            {index + 1}
                                        </span>
                                        <span className="text-sm font-bold leading-6 text-slate-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            {['Learning', 'Family', 'Agent'].map((item) => (
                                <div key={item} className="rounded-[26px] border border-white/75 bg-white/[0.72] p-4 text-center shadow-[0_14px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl">
                                    <div className="text-2xl font-black tracking-[-0.05em] text-slate-950">AI</div>
                                    <div className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{item}</div>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </section>

            <section className="px-4 pb-10 md:px-8 md:pb-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <div className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">
                                Product Directions
                            </div>
                            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-slate-950 md:text-5xl">
                                现在主要做的事情
                            </h2>
                        </div>
                        <Link href="/notes" className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-white hover:text-slate-950">
                            看开发记录
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                        {directions.map((direction, index) => {
                            const Icon = direction.icon;
                            return (
                                <article
                                    key={direction.title}
                                    className={`group relative overflow-hidden rounded-[38px] border border-slate-900/10 bg-gradient-to-br ${direction.tone} p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(15,23,42,0.12)] md:p-7 ${index === 0 ? 'lg:row-span-2' : ''}`}
                                >
                                    <div className="absolute right-[-3rem] top-[-3rem] h-40 w-40 rounded-full bg-white/70 blur-2xl transition group-hover:scale-125" />
                                    <div className="relative">
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-slate-950 p-3 text-white shadow-[0_16px_42px_rgba(15,23,42,0.18)]">
                                                    <Icon size={22} />
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                                                        {direction.label}
                                                    </div>
                                                    <h3 className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-950 md:text-3xl">
                                                        {direction.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <span className="rounded-full border border-slate-900/10 bg-white/72 px-3 py-1 text-xs font-black text-slate-600">
                                                {direction.badge}
                                            </span>
                                        </div>

                                        <p className="mt-5 text-base font-bold leading-7 text-slate-700 md:text-lg">
                                            {direction.subtitle}
                                        </p>
                                        <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                                            {direction.points.map((point) => (
                                                <li key={point} className="flex gap-3 rounded-[18px] bg-white/45 px-4 py-3 backdrop-blur">
                                                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="px-4 pb-16 md:px-8 md:pb-24">
                <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                    <div className="rounded-[38px] border border-slate-900/10 bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)] md:p-8">
                        <BookOpenText size={28} className="text-cyan-200" />
                        <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] md:text-4xl">
                            继续分享开发过程、产品判断和踩坑记录。
                        </h2>
                        <p className="mt-4 text-sm leading-8 text-slate-300 md:text-base">
                            这个站点会慢慢变成我的公开工作台：产品方向在这里说明，工具在这里沉淀，过程和想法也在这里持续记录。
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {siteLinks.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group rounded-[32px] border border-slate-900/10 bg-white/[0.78] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
                                        <Icon size={21} />
                                    </div>
                                    <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
                                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-slate-700">
                                        打开
                                        <ArrowRight size={15} />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
}
