import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Boxes,
  Braces,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  DatabaseZap,
  FileText,
  GitBranch,
  HeartHandshake,
  Layers3,
  Mic2,
  NotebookPen,
  Orbit,
  PackageOpen,
  Radio,
  ScanSearch,
  Sparkles,
  Video,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import type { PostMeta } from "@/lib/posts/types";
import AiosTicker from "./components/AiosTicker";

export const dynamic = "force-dynamic";

type ProductStream = {
  id: string;
  label: string;
  title: string;
  icon: LucideIcon;
  status: string;
  mission: string;
  now: string[];
  next: string[];
  artifacts: Array<{ label: string; href: string }>;
  tone: string;
  signal: string;
};

type MemoryItem = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  href: string;
};

const intentChips = [
  { label: "最近在做什么", href: "#product-streams" },
  { label: "今天记了什么", href: "#live-memory" },
  { label: "上架材料放哪了", href: "/legal/app-store-checklist" },
  { label: "我常用哪些工具", href: "/tools" },
  { label: "最长期的事是什么", href: "#operating-loop" },
];

const systemSignals = [
  { label: "公开记录", value: "开始认真写 X", icon: Radio },
  { label: "上架准备", value: "日语 App 准备上线", icon: PackageOpen },
  { label: "长期主线", value: "evomap-farmer", icon: BrainCircuit },
];

const productStreams: ProductStream[] = [
  {
    id: "japanese-learning",
    label: "最近最重要",
    title: "日语学习工具体系",
    icon: Mic2,
    status: "App Store 准备中",
    mission:
      "我学日语的时候一直觉得，单个工具解决不了问题。真正需要的是把听、懂、练、记串起来。",
    now: [
      "语音对话练习的 App 已经在准备备案和 App Store 上架。",
      "学习助手先把单词、语法、翻译和笔记这些每天会用的东西接住。",
      "日语学习网站继续往前推，希望以后能把一个知识点讲得更清楚。",
    ],
    next: [
      "先把上架截图、隐私政策、支持页这些材料补齐。",
      "再整理几组真实学习场景，方便自己测试，也方便以后对外说明。",
    ],
    artifacts: [
      { label: "隐私政策", href: "/legal/apple-privacy" },
      { label: "支持页", href: "/support" },
      { label: "上架清单", href: "/legal/app-store-checklist" },
    ],
    tone: "from-sky-100 via-cyan-50 to-white",
    signal: "输入 -> 理解 -> 练习 -> 输出",
  },
  {
    id: "family-ai",
    label: "想法 02",
    title: "亲人关系的 AI 社交",
    icon: HeartHandshake,
    status: "概念验证",
    mission:
      "这个方向还很早，但我一直觉得亲人之间很多话不是不想说，而是说不好，或者没力气回。",
    now: [
      "先看那些想表达但总是表达不好的人。",
      "也看那些被需要、但真的没有精力回应的人。",
      "如果 AI 要介入关系，前提应该是让人更靠近，而不是更疏远。",
    ],
    next: [
      "先慢慢记一些真实沟通场景，不急着做大功能。",
      "隐私边界要先想清楚，尤其是亲人关系里的内容。",
    ],
    artifacts: [
      { label: "产品目录", href: "/products" },
      { label: "记录时间线", href: "/notes" },
    ],
    tone: "from-rose-100 via-orange-50 to-white",
    signal: "表达 / 回应 / 关系修复",
  },
  {
    id: "ai-vlog",
    label: "草稿 03",
    title: "AI Vlog 工作台",
    icon: Video,
    status: "工作流设计中",
    mission:
      "我自己也经常拍了很多东西，最后没有整理。这个方向想解决的是：先低成本记录，后面让 AI 帮我变成作品。",
    now: [
      "先从图片、音频、文字这几类最容易留下来的素材开始。",
      "再把整理、分镜、字幕、剪辑这些步骤拆出来。",
      "重点不是再造一个复杂编辑器，而是让记录这件事更容易坚持。",
    ],
    next: [
      "先定义素材怎么入库，自动分镜怎么描述。",
      "相关的视频和语音模型，先都放到 API Lab 里试。",
    ],
    artifacts: [
      { label: "API Lab", href: "/tools/api-lab" },
      { label: "Mermaid 工作流", href: "/tools/mermaid" },
    ],
    tone: "from-amber-100 via-stone-50 to-white",
    signal: "素材 -> 结构 -> 成片",
  },
  {
    id: "self-evolving-agent",
    label: "长期 04",
    title: "自进化个人 Agent",
    icon: Bot,
    status: "长期主线",
    mission:
      "这是我最长期的方向。不是为了做一个单点功能，而是希望以后每次做项目都能少丢上下文。",
    now: [
      "evomap-farmer 是现在最核心的一条线。",
      "重要信息还是希望优先放在本地和自己可控的系统里。",
      "每次开发、运营、踩坑都应该变成下一次能复用的东西。",
    ],
    next: [
      "先让记录页和工具页承接一部分公开上下文。",
      "再慢慢把项目经验、供应商体验和构建过程整理出来。",
    ],
    artifacts: [
      { label: "每日记录", href: "/notes" },
      { label: "工具箱", href: "/tools" },
      { label: "路线图", href: "/roadmap" },
    ],
    tone: "from-lime-100 via-emerald-50 to-white",
    signal: "长期记忆 / 能力复用",
  },
];

const operatingLoop = [
  {
    label: "记录",
    title: "先把事情记下来",
    body: "想法、截图、音频、上架材料、踩坑，先别散在各处，能放进来就放进来。",
    icon: ScanSearch,
  },
  {
    label: "整理",
    title: "以后能再找到",
    body: "用日期、标签和项目把碎片串起来，至少以后我自己能找回当时怎么想的。",
    icon: DatabaseZap,
  },
  {
    label: "推进",
    title: "需要的时候打开工具",
    body: "API Lab、Mermaid、文件管理这些入口，先服务我正在做的几个产品。",
    icon: Wrench,
  },
  {
    label: "公开",
    title: "能公开的就整理出来",
    body: "隐私政策、支持页、产品介绍、X 内容，都是做产品过程中顺手沉淀出来的。",
    icon: FileText,
  },
  {
    label: "复用",
    title: "再回到 Agent 里",
    body: "我希望每次推进，最后都能反过来增强 evomap-farmer 和自己的 Agent 上下文。",
    icon: GitBranch,
  },
];

const capabilityNodes = [
  {
    title: "模型试验",
    body: "统一测试文本、图片、语音、文件接口。",
    href: "/tools/api-lab",
    icon: Braces,
  },
  {
    title: "记录时间线",
    body: "公开每日总结和旧内容补录。",
    href: "/notes",
    icon: NotebookPen,
  },
  {
    title: "上架材料",
    body: "Apple 审核需要的 URL 与说明。",
    href: "/legal/app-store-checklist",
    icon: CheckCircle2,
  },
  {
    title: "产品草稿",
    body: "我给每个项目留下的状态和入口。",
    href: "/products",
    icon: Layers3,
  },
];

const fallbackMemories: MemoryItem[] = [
  {
    title: "开始运营 X 的第一天",
    date: "2026-05-01",
    summary:
      "从今天开始，把 AI 产品、日语学习工具和自进化 Agent 的过程放到公开时间线里。",
    tags: ["X运营", "自进化Agent", "日语学习"],
    href: "/notes",
  },
];

function postToMemory(post: PostMeta): MemoryItem {
  return {
    title: post.title,
    date: post.date,
    summary:
      post.excerpt ||
      "这篇内容还没有摘要,但已经按时间放进公开记录。",
    tags: post.tags.slice(0, 4),
    href: `/notes/${post.slug}`,
  };
}

async function loadRecentMemories(): Promise<MemoryItem[]> {
  const posts = getAllPosts().slice(0, 3);
  return posts.length > 0 ? posts.map(postToMemory) : fallbackMemories;
}

function ProductStreamCard({ stream }: { stream: ProductStream }) {
  const Icon = stream.icon;

  return (
    <article
      id={stream.id}
      className={`aios-card group relative overflow-hidden rounded-[38px] bg-gradient-to-br ${stream.tone} p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_95px_rgba(15,23,42,0.13)] md:p-7`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/70 blur-3xl transition duration-500 group-hover:scale-125" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-slate-950 text-white shadow-[0_18px_46px_rgba(15,23,42,0.20)]">
              <Icon size={23} />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                {stream.label}
              </div>
              <h3 className="mt-1 text-2xl font-black tracking-[-0.04em] text-slate-950 md:text-3xl">
                {stream.title}
              </h3>
            </div>
          </div>
          <span className="rounded-full border border-slate-900/10 bg-white/75 px-3 py-1 text-xs font-black text-slate-600 backdrop-blur">
            {stream.status}
          </span>
        </div>

        <div className="mt-5 rounded-[26px] border border-white/70 bg-white/58 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            <CircleDot size={14} />
            为什么记在这里
          </div>
          <p className="mt-3 text-base font-bold leading-8 text-slate-800">
            {stream.mission}
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-white/62 bg-white/42 p-4 backdrop-blur">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              现在做到哪
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              {stream.now.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[24px] border border-white/62 bg-white/42 p-4 backdrop-blur">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              接下来先做什么
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              {stream.next.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-900/10 bg-slate-950 px-3 py-1 text-xs font-black text-white">
            {stream.signal}
          </span>
          {stream.artifacts.map((artifact) => (
            <Link
              key={`${stream.id}-${artifact.href}`}
              href={artifact.href}
              className="inline-flex items-center gap-1 rounded-full border border-slate-900/10 bg-white/70 px-3 py-1 text-xs font-black text-slate-600 transition hover:bg-white hover:text-slate-950"
            >
              {artifact.label}
              <ChevronRight size={13} />
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

function MemoryCard({ memory }: { memory: MemoryItem }) {
  return (
    <Link
      href={memory.href}
      className="group block rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white"
    >
      <div className="flex items-center justify-between gap-3">
        <time
          className="font-mono text-xs text-slate-400"
          dateTime={memory.date}
        >
          {memory.date}
        </time>
        <span className="rounded-full border border-slate-900/10 bg-slate-50 px-2.5 py-1 text-[11px] font-black text-slate-500">
          记录
        </span>
      </div>
      <h3 className="mt-4 text-xl font-black tracking-[-0.03em] text-slate-950">
        {memory.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
        {memory.summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {memory.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500"
          >
            #{tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const recentMemories = await loadRecentMemories();
  const latestMemory = recentMemories[0] ?? fallbackMemories[0];

  return (
    <main className="aios-page min-h-screen text-slate-950">
      <section className="relative px-4 pb-12 pt-8 md:px-8 md:pb-16 md:pt-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(14,165,233,0.20),transparent_28%),radial-gradient(circle_at_78%_8%,rgba(217,119,6,0.18),transparent_27%),linear-gradient(180deg,rgba(255,255,255,0.74)_0%,rgba(244,241,234,0)_64%)]" />
        <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1.08fr)_420px] lg:items-stretch">
          <div
            className="aios-hero aios-reveal relative overflow-hidden rounded-[46px] border border-white/10 p-6 text-white md:p-10"
            data-watermark="OWEN"
          >
            <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-cyan-300/18 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-36 left-10 h-80 w-80 rounded-full bg-amber-300/14 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-black text-slate-200 backdrop-blur">
                <Orbit size={16} />
                欧文的公开工作笔记
              </div>

              <h1 className="aios-dark-title mt-7 max-w-5xl text-4xl font-black leading-[0.96] md:text-6xl lg:text-7xl">
                我把最近做的 AI 产品和每天的想法，先都放在这里。
              </h1>

              <p className="mt-7 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                它更像一个公开的工作笔记：我在日本学习、做产品、试模型、准备 App
                上架，也把一些还不成熟的判断和过程先记下来。
              </p>

              <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl md:p-5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  <Sparkles size={15} />
                  随手看看
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {intentChips.map((chip) => (
                    <Link
                      key={chip.label}
                      href={chip.href}
                      className="rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.14] hover:text-white"
                    >
                      {chip.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#product-streams"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 shadow-[0_16px_38px_rgba(255,255,255,0.14)] transition hover:-translate-y-0.5 hover:bg-slate-100"
                >
                  看看最近在做什么
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/notes"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/[0.14]"
                >
                  翻最近记录
                </Link>
              </div>
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="aios-paper aios-reveal rounded-[38px] p-6 backdrop-blur-2xl md:p-7 lg:stagger-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#20342b_0%,#5f6b3f_55%,#d49b42_100%)] text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
                  <Sparkles size={22} />
                </div>
                <span className="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                  今日记录
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] text-slate-950">
                今天先记到这里
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                我会把当天比较重要的进展放到这里，方便自己下次打开时先接上上下文。
              </p>

              <div className="mt-5 rounded-[28px] border border-slate-900/10 bg-slate-950 p-4 text-white">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-slate-400">
                    latest.note
                  </span>
                  <time
                    className="font-mono text-xs text-cyan-200"
                    dateTime={latestMemory.date}
                  >
                    {latestMemory.date}
                  </time>
                </div>
                <h3 className="mt-4 text-xl font-black tracking-tight">
                  {latestMemory.title}
                </h3>
                <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-300">
                  {latestMemory.summary}
                </p>
                <div className="aios-barcode mt-5 rounded opacity-70" />
              </div>
            </div>

            <div className="grid gap-3">
              {systemSignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <div
                    key={signal.label}
                    className="rounded-[26px] border border-white/75 bg-white/[0.72] p-4 shadow-[0_14px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-slate-950 text-white">
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                          {signal.label}
                        </div>
                        <div className="mt-1 text-sm font-black text-slate-800">
                          {signal.value}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <div className="px-4 pb-10 md:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-[#181b1a]/10">
          <AiosTicker />
        </div>
      </div>

      <section id="product-streams" className="px-4 pb-12 md:px-8 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">
                最近
              </div>
              <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.055em] text-slate-950 md:text-6xl">
                最近反复在想的几件事。
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-white hover:text-slate-950"
            >
              查看产品目录
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {productStreams.map((stream) => (
              <ProductStreamCard key={stream.id} stream={stream} />
            ))}
          </div>
        </div>
      </section>

      <section id="operating-loop" className="px-4 pb-12 md:px-8 md:pb-16">
        <div className="mx-auto max-w-7xl rounded-[44px] border border-slate-900/10 bg-[linear-gradient(135deg,#101820_0%,#1d2a22_48%,#5f6b3f_100%)] p-6 text-white shadow-[0_30px_110px_rgba(15,23,42,0.22)] md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-black text-slate-200">
                <Boxes size={16} />
                我的整理方式
              </div>
              <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] md:text-5xl">
                我希望这个站点能帮我少忘一点东西。
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                这里不只放最终结果。更重要的是把日常输入、工具实验、产品发布和个人
                Agent 的上下文连起来，让每次推进都不要从零开始。
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-5 lg:grid-cols-1">
              {operatingLoop.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.label}
                    className="group rounded-[28px] border border-white/10 bg-white/[0.08] p-4 backdrop-blur transition hover:bg-white/[0.13]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-white text-slate-950 shadow-[0_14px_36px_rgba(0,0,0,0.18)]">
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-cyan-200">
                            0{index + 1}
                          </span>
                          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                            {step.label}
                          </span>
                        </div>
                        <h3 className="mt-1 text-lg font-black text-white">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-7 text-slate-300">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="live-memory" className="px-4 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[40px] border border-slate-900/10 bg-white/[0.76] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-50 px-4 py-2 text-sm font-black text-slate-500">
              <NotebookPen size={16} />
              Notes
            </div>
            <h2 className="mt-6 text-4xl font-black tracking-[-0.055em] text-slate-950 md:text-5xl">
              记录先写下来，后面再慢慢整理。
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              每日总结、旧 QQ
              空间补录、产品判断和素材摘录都会进入同一条时间线。以后 Codex
              可以继续生成记录，页面负责公开呈现，Agent 负责复用上下文。
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {capabilityNodes.map((node) => {
                const Icon = node.icon;
                return (
                  <Link
                    key={node.title}
                    href={node.href}
                    className="rounded-[24px] border border-slate-900/10 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_38px_rgba(15,23,42,0.08)]"
                  >
                    <Icon size={20} className="text-slate-700" />
                    <h3 className="mt-3 text-base font-black text-slate-950">
                      {node.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {node.body}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4">
            {recentMemories.map((memory) => (
              <MemoryCard
                key={`${memory.date}-${memory.title}`}
                memory={memory}
              />
            ))}
            <Link
              href="/notes"
              className="inline-flex items-center justify-center gap-2 rounded-[24px] border border-slate-900/10 bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-[0_16px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              打开完整记录
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
