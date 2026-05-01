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
import type { DailyNote } from "@/lib/models/dailyNote";
import {
  getPublicNotesUserId,
  listDailyNotes,
} from "@/lib/repositories/dailyNoteRepository";
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
  { label: "我想看正在做的产品", href: "#product-streams" },
  { label: "今天推进了什么", href: "#live-memory" },
  { label: "App Store 材料在哪", href: "/legal/app-store-checklist" },
  { label: "有哪些工具可用", href: "/tools" },
  { label: "长期主线是什么", href: "#operating-loop" },
];

const systemSignals = [
  { label: "Public Build", value: "X 运营启动", icon: Radio },
  { label: "Release Prep", value: "日语 App 上架准备", icon: PackageOpen },
  { label: "Core Engine", value: "evomap-farmer", icon: BrainCircuit },
];

const productStreams: ProductStream[] = [
  {
    id: "japanese-learning",
    label: "Mainline 01",
    title: "日语学习工具体系",
    icon: Mic2,
    status: "App Store 准备中",
    mission:
      "把输入、理解、练习和输出串成一个完整学习闭环，而不是继续堆孤立工具。",
    now: [
      "语音方向正在准备备案与 App Store 上架。",
      "学习助手承接单词、语法、翻译和笔记体系。",
      "Web 词典继续推进图文解释能力。",
    ],
    next: [
      "补齐上架截图、隐私政策和支持 URL。",
      "整理第一批可公开的学习内容和使用场景。",
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
    label: "Stream 02",
    title: "亲人关系的 AI 社交",
    icon: HeartHandshake,
    status: "概念验证",
    mission: "不做泛社交，只做亲人之间更轻、更顺的表达和回应。",
    now: [
      "聚焦想表达但表达不好的人。",
      "聚焦被需要但没有精力回应的人。",
      "让 AI 帮关系变近，而不是把人推远。",
    ],
    next: ["沉淀第一批真实沟通场景。", "定义隐私边界和本地优先的数据策略。"],
    artifacts: [
      { label: "产品目录", href: "/products" },
      { label: "记录时间线", href: "/notes" },
    ],
    tone: "from-rose-100 via-orange-50 to-white",
    signal: "表达 / 回应 / 关系修复",
  },
  {
    id: "ai-vlog",
    label: "Stream 03",
    title: "AI Vlog 工作台",
    icon: Video,
    status: "工作流设计中",
    mission:
      "用户只负责记录素材，AI 负责整理、规划结构，并把生活记录自动变成作品。",
    now: [
      "输入形态先覆盖图片、音频和文字。",
      "把素材整理、结构规划、剪辑成片拆成可复用流水线。",
      "保持记录低摩擦，而不是让用户先学复杂编辑器。",
    ],
    next: [
      "定义素材入库和自动分镜格式。",
      "把视频生成供应商接入 API Lab 的实验层。",
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
    label: "Long Run 04",
    title: "自进化个人 Agent",
    icon: Bot,
    status: "长期主线",
    mission:
      "围绕主流 Agent 做长期记忆和能力进化系统，为未来更高效开发新项目打底。",
    now: [
      "evomap-farmer 是当前核心项目。",
      "重要信息优先沉淀在本地和可控系统里。",
      "把每次开发经验变成下一次可复用的方法。",
    ],
    next: [
      "让记录页和工具页成为 Agent 的公开外部记忆。",
      "把项目经验、供应商体验和构建过程持续结构化。",
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
    label: "Capture",
    title: "记录现实素材",
    body: "想法、截图、音频、App 上架材料和踩坑都先进入同一个低摩擦入口。",
    icon: ScanSearch,
  },
  {
    label: "Structure",
    title: "转成可复用记忆",
    body: "用标签、类型、日期和关联产品，把碎片整理成长期记忆，而不是一次性博客。",
    icon: DatabaseZap,
  },
  {
    label: "Build",
    title: "工具辅助产品推进",
    body: "API Lab、Mermaid、文件管理和后续模型工具，直接服务正在做的产品。",
    icon: Wrench,
  },
  {
    label: "Publish",
    title: "公开成产品产物",
    body: "隐私政策、支持页、产品介绍、发布说明和 X 内容都从这里生成和沉淀。",
    icon: FileText,
  },
  {
    label: "Evolve",
    title: "喂给自进化 Agent",
    body: "每次推进都反过来增强 evomap-farmer 和个人 Agent 的上下文。",
    icon: GitBranch,
  },
];

const capabilityNodes = [
  {
    title: "Model Lab",
    body: "统一测试文本、图片、语音、文件接口。",
    href: "/tools/api-lab",
    icon: Braces,
  },
  {
    title: "Memory Line",
    body: "公开每日总结和旧内容补录。",
    href: "/notes",
    icon: NotebookPen,
  },
  {
    title: "Release Kit",
    body: "Apple 审核需要的 URL 与说明。",
    href: "/legal/app-store-checklist",
    icon: CheckCircle2,
  },
  {
    title: "Product Shelf",
    body: "每个产品的状态、链接和材料。",
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

function noteToMemory(note: DailyNote): MemoryItem {
  return {
    title: note.title,
    date: note.noteDate,
    summary:
      note.summary ||
      note.contentMarkdown?.split("\n").find(Boolean) ||
      "这条记录还没有摘要，但已经进入公开时间线。",
    tags: note.tags.slice(0, 4),
    href: `/notes#note-${note.id}`,
  };
}

async function loadRecentMemories(): Promise<MemoryItem[]> {
  try {
    const userId = await getPublicNotesUserId();
    if (!userId) return fallbackMemories;
    const notes = await listDailyNotes(userId, { limit: 3 });
    return notes.length > 0 ? notes.map(noteToMemory) : fallbackMemories;
  } catch {
    return fallbackMemories;
  }
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
            Mission
          </div>
          <p className="mt-3 text-base font-bold leading-8 text-slate-800">
            {stream.mission}
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-white/62 bg-white/42 p-4 backdrop-blur">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Now
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
              Next
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
          Memory
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
          <div className="aios-hero aios-reveal relative overflow-hidden rounded-[46px] border border-white/10 p-6 text-white md:p-10">
            <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-cyan-300/18 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-36 left-10 h-80 w-80 rounded-full bg-amber-300/14 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-black text-slate-200 backdrop-blur">
                <Orbit size={16} />
                Owen&apos;s AI Product OS
              </div>

              <h1 className="aios-dark-title mt-8 max-w-5xl text-5xl font-black leading-[0.92] md:text-7xl lg:text-8xl">
                不是展示一个网站，而是展示一个正在进化的 AI 产品系统。
              </h1>

              <p className="mt-7 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                这里把日语学习、亲人沟通、AI Vlog 和自进化 Agent
                放在同一条工作流里：想法被记录，工具被使用，产品持续推进，经验再回到个人
                Agent 的长期记忆。
              </p>

              <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl md:p-5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  <Sparkles size={15} />
                  Intent Console
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
                  进入产品流
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/notes"
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.08] px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/[0.14]"
                >
                  查看公开记忆
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
                  Live Briefing
                </span>
              </div>
              <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] text-slate-950">
                今日系统简报
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                这个区域不只是欢迎语，而是把公开记录和产品状态整理成当前上下文。
              </p>

              <div className="mt-5 rounded-[28px] border border-slate-900/10 bg-slate-950 p-4 text-white">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-slate-400">
                    latest.memory
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
                Product Streams
              </div>
              <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-[-0.055em] text-slate-950 md:text-6xl">
                4 条产品线，按“任务流”而不是“介绍卡”呈现。
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
                Operating Loop
              </div>
              <h2 className="mt-6 text-4xl font-black leading-tight tracking-[-0.055em] md:text-5xl">
                AI 驱动不是口号，是内容如何被系统复用。
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                网站不只负责展示最终结果。它负责把日常输入、工具实验、产品发布和个人
                Agent 的进化连起来，让每次推进都留下可被下一次调用的结构。
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
              Live Memory
            </div>
            <h2 className="mt-6 text-4xl font-black tracking-[-0.055em] text-slate-950 md:text-5xl">
              记录不是博客，是产品系统的长期记忆。
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
              打开完整记忆流
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
