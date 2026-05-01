import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenText,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  FileText,
  Headphones,
  HeartHandshake,
  Layers3,
  ListChecks,
  Mic2,
  PackageOpen,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trash2,
  Video,
  type LucideIcon,
} from "lucide-react";
import { personalProducts } from "@/lib/aitool2";
import { appStoreUrls } from "@/lib/appStore";
import AiosTicker from "../components/AiosTicker";

type ProductPassport = {
  id: string;
  label: string;
  title: string;
  status: string;
  mission: string;
  role: string;
  icon: LucideIcon;
  tone: string;
  current: string[];
  next: string[];
  artifacts: Array<{ label: string; href: string }>;
  stack: string[];
};

const productPassports: ProductPassport[] = [
  {
    id: "japanese-learning-app",
    label: "草稿 01",
    title: "日语学习工具体系",
    status: "App Store 准备中",
    mission:
      "这是我最近最想先做好的方向。因为自己在日本学习，能很直接地感受到：查词、翻译、开口练习、笔记复用，应该连在一起。",
    role: "所以它不只是一个 App，而是一组会慢慢长出来的学习工具。先从语音和同传开始，再往笔记和词典延伸。",
    icon: Mic2,
    tone: "from-cyan-100 via-sky-50 to-white",
    current: [
      "日语对话练习 App 已经开始备案，准备往 App Store 上架走。",
      "学习助手这边先接单词、语法、翻译和笔记。",
      "Web 词典继续推进，希望把日语知识讲得更清楚一点。",
    ],
    next: [
      "先把 6.5 英寸预览图、隐私政策、支持页和审核备注准备好。",
      "再整理一批自己真的会用的学习场景。",
      "语音、图片、文本模型都先放到 API Lab 里试，不急着写死。",
    ],
    artifacts: [
      { label: "隐私政策", href: "/legal/apple-privacy" },
      { label: "支持页", href: "/support" },
      { label: "上架清单", href: "/legal/app-store-checklist" },
      { label: "开发记录", href: "/notes" },
    ],
    stack: ["iOS", "ASR", "TTS", "Shadowing", "学习记录", "词典 Web"],
  },
  {
    id: "family-ai",
    label: "草稿 02",
    title: "亲人关系的 AI 社交",
    status: "概念验证",
    mission:
      "这个想法还早，但我一直放不下。亲人之间很多问题不是没有感情，而是不知道怎么表达，或者太累了没有回应。",
    role: "如果以后做，它一定不是泛社交产品，而是围绕亲人之间很具体、很小心的沟通场景。",
    icon: HeartHandshake,
    tone: "from-rose-100 via-orange-50 to-white",
    current: [
      "我先把人群想清楚：想表达但表达不好的人，以及被需要但没有精力回应的人。",
      "这个方向不能急着做功能，先从场景和隐私边界开始。",
      "有些判断可以先写在记录里，慢慢看它是不是成立。",
    ],
    next: [
      "先记 10 个真实沟通场景。",
      "再想清楚哪些数据必须本地优先，哪些根本不该采集。",
      "还要明确：哪些话可以由 AI 辅助，哪些必须由人自己确认。",
    ],
    artifacts: [
      { label: "产品目录", href: "/products" },
      { label: "想法记录", href: "/notes" },
      { label: "隐私原则", href: "/legal/apple-privacy" },
    ],
    stack: ["Relationship AI", "本地记忆", "表达辅助", "隐私优先"],
  },
  {
    id: "ai-vlog-desk",
    label: "草稿 03",
    title: "AI Vlog 工作台",
    status: "工作流设计中",
    mission:
      "我自己经常记录很多素材，但整理成本太高。这个方向想做的是：先把生活记录下来，后面让 AI 帮忙整理成作品。",
    role: "它更像一个工作台，不是一个复杂剪辑软件。关键是降低从“记录”到“成片”的距离。",
    icon: Video,
    tone: "from-amber-100 via-stone-50 to-white",
    current: [
      "先想清楚图片、音频、文字怎么进来。",
      "再把整理、分镜、字幕、剪辑拆成几个小步骤。",
      "模型供应商先都在 API Lab 里试。",
    ],
    next: [
      "先设计素材入库格式和生成任务结构。",
      "用 Mermaid 画出第一版流程。",
      "再整理几个能测试的视频、语音和字幕工具。",
    ],
    artifacts: [
      { label: "API Lab", href: "/tools/api-lab" },
      { label: "Mermaid", href: "/tools/mermaid" },
      { label: "工具箱", href: "/tools" },
    ],
    stack: ["Image", "Audio", "Storyboard", "Subtitle", "Video Agent"],
  },
  {
    id: "self-evolving-agent",
    label: "草稿 04",
    title: "自进化个人 Agent",
    status: "长期主线",
    mission:
      "这是更长期的底层方向。我想让每一次开发、运营和产品判断，都不要只停留在这一次。",
    role: "如果它能做好，以后我做新项目时就不需要一遍遍从零解释背景。",
    icon: Bot,
    tone: "from-lime-100 via-emerald-50 to-white",
    current: [
      "evomap-farmer 是当前重点。",
      "AiTool 2.0 先承担公开工具、记录和产品材料入口。",
      "每天的总结和以后补录的旧内容，会慢慢变成长期记忆。",
    ],
    next: [
      "让记录页先按产品、标签和日期聚合上下文。",
      "把工具使用经验、供应商体验和开发过程慢慢结构化。",
      "以后希望 Codex 生成完内容，可以直接写进公开记录。",
    ],
    artifacts: [
      { label: "记忆流", href: "/notes" },
      { label: "工具能力图", href: "/tools" },
      { label: "路线图", href: "/roadmap" },
    ],
    stack: ["evomap-farmer", "长期记忆", "本地优先", "Agent Economy"],
  },
];

const releaseSteps = [
  "App 名称、分类、年龄分级、审核备注不要临时再想。",
  "隐私政策、支持页、条款、数据删除说明先放在固定位置。",
  "截图、功能说明、测试账号、演示路径每次都要检查。",
  "每次提交、拒审和修改都记回 notes，下次不要再踩同一个坑。",
];

function PassportCard({ product }: { product: ProductPassport }) {
  const Icon = product.icon;

  return (
    <article
      id={product.id}
      className={`aios-card relative overflow-hidden rounded-[40px] bg-gradient-to-br ${product.tone} p-6 md:p-8`}
    >
      <div className="pointer-events-none absolute -right-16 -top-20 h-60 w-60 rounded-full bg-white/70 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-slate-950 text-white shadow-[0_18px_46px_rgba(15,23,42,0.2)]">
              <Icon size={23} />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                {product.label}
              </div>
              <h2 className="mt-1 text-3xl font-black tracking-[-0.045em] text-slate-950">
                {product.title}
              </h2>
            </div>
          </div>
          <span className="rounded-full border border-slate-900/10 bg-white/75 px-3 py-1 text-xs font-black text-slate-600 backdrop-blur">
            {product.status}
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[28px] border border-white/70 bg-white/58 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              <Sparkles size={14} />
              为什么想做
            </div>
            <p className="mt-3 text-base font-bold leading-8 text-slate-800">
              {product.mission}
            </p>
            <p className="mt-4 border-l-2 border-slate-300 pl-4 text-sm leading-7 text-slate-600">
              {product.role}
            </p>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/42 p-5 backdrop-blur-xl">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              可能会用到
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-900/10 bg-white/70 px-3 py-1 text-xs font-bold text-slate-600"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-[26px] border border-white/70 bg-white/46 p-4 backdrop-blur">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              现在做到哪
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
              {product.current.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-slate-500"
                    size={15}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[26px] border border-white/70 bg-white/46 p-4 backdrop-blur">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              下一步先做什么
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
              {product.next.map((item) => (
                <li key={item} className="flex gap-2">
                  <ChevronRight
                    className="mt-1 shrink-0 text-slate-500"
                    size={15}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {product.artifacts.map((artifact) => (
            <Link
              key={`${product.id}-${artifact.href}`}
              href={artifact.href}
              className="inline-flex items-center gap-1 rounded-full border border-slate-900/10 bg-white/72 px-3 py-1.5 text-xs font-black text-slate-600 transition hover:bg-white hover:text-slate-950"
            >
              {artifact.label}
              <ArrowRight size={13} />
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  return (
    <main className="aios-page min-h-screen px-4 py-10 text-slate-950 md:px-8 md:py-14">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <div
          className="aios-hero relative overflow-hidden rounded-[46px] border border-white/10 p-6 text-white md:p-10"
          data-watermark="DRAFT"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-300/18 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-black text-slate-200">
              <PackageOpen size={16} />
              产品草稿
            </div>
            <h1 className="aios-dark-title mt-7 max-w-4xl text-4xl font-black leading-[0.98] md:text-6xl">
              这里先放我的产品草稿，不写成发布会稿子。
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              我先把每个方向为什么想做、现在推进到哪、接下来要补什么写清楚。等以后真的发布，再从这些草稿里整理成正式介绍。
            </p>
          </div>
        </div>

        <aside className="aios-paper rounded-[40px] p-6 backdrop-blur-2xl md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#20342b_0%,#5f6b3f_55%,#d49b42_100%)] text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
              <Rocket size={22} />
            </div>
            <span className="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
              上架备忘
            </span>
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] text-slate-950">
            最近要上架 App，所以这些材料先集中放着。
          </h2>
          <div className="mt-5 space-y-3">
            {releaseSteps.map((step, index) => (
              <div
                key={step}
                className="flex gap-3 rounded-[22px] border border-slate-900/10 bg-white/70 p-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 font-mono text-xs text-white">
                  {index + 1}
                </span>
                <span className="text-sm font-bold leading-6 text-slate-700">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <div className="mx-auto mt-8 max-w-7xl overflow-hidden rounded-[28px] border border-[#181b1a]/10">
        <AiosTicker />
      </div>

      <section className="mx-auto mt-8 grid max-w-7xl gap-5 lg:grid-cols-2">
        {productPassports.map((product) => (
          <PassportCard key={product.id} product={product} />
        ))}
      </section>

      <section className="mx-auto mt-8 max-w-7xl rounded-[40px] border border-slate-900/10 bg-white/[0.76] p-6 shadow-[0_22px_75px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-50 px-4 py-2 text-sm font-black text-slate-500">
              <ListChecks size={16} />
              App Store Connect
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] text-slate-950 md:text-5xl">
              这些链接之后会直接填到 App Store Connect。
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
              这些页面会作为上架材料、审核备注和用户支持入口。正式提交前，只需要确认域名可访问、邮箱可收信、内容和
              App 实际行为一致。
            </p>
          </div>
          <Link
            href="/legal/app-store-checklist"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
          >
            <BadgeCheck size={16} />
            查看完整清单
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {appStoreUrls.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[28px] border border-slate-900/10 bg-white/80 p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_45px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-slate-100 text-slate-700 transition group-hover:bg-slate-950 group-hover:text-white">
                    <Icon size={19} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-950">
                      {item.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {item.requiredFor}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
                <div className="mt-4 break-all rounded-2xl bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100">
                  {item.url}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl rounded-[36px] border border-slate-900/10 bg-slate-950 p-6 text-white shadow-[0_24px_90px_rgba(15,23,42,0.2)] md:p-8">
        <div className="grid gap-5 md:grid-cols-[0.75fr_1.25fr] md:items-center">
          <div>
            <BookOpenText size={28} className="text-cyan-200" />
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em]">
              以前的一些入口先留着，但主线会慢慢收敛。
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {personalProducts.map((product) => (
              <Link
                key={product.title}
                href={product.href}
                className="rounded-[24px] border border-white/10 bg-white/[0.08] p-4 transition hover:bg-white/[0.14]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-black text-white">
                    {product.title}
                  </span>
                  <ArrowRight size={15} className="text-slate-400" />
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-300">
                  {product.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
