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
    label: "Passport 01",
    title: "日语学习工具体系",
    status: "App Store 准备中",
    mission:
      "用 AI 把日语学习里的输入、理解、练习和输出连成闭环，让学习者不只是查词，而是真的能开口、理解和复用。",
    role: "主线产品。它会持续验证语音、翻译、笔记、词典和学习历史如何组合成一个真正可用的学习系统。",
    icon: Mic2,
    tone: "from-cyan-100 via-sky-50 to-white",
    current: [
      "日语对话练习 App 正在备案并准备上架 App Store。",
      "学习助手方向承接单词、语法、翻译和笔记体系。",
      "Web 词典继续推进图文结合的解释方式。",
    ],
    next: [
      "准备 6.5 英寸预览图、隐私政策、支持页和审核备注。",
      "把第一批真实学习场景整理成可演示内容。",
      "把语音模型、图片模型和文本接口统一放进 API Lab 里验证。",
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
    label: "Passport 02",
    title: "亲人关系的 AI 社交",
    status: "概念验证",
    mission:
      "不做泛社交，只做亲人之间的表达和回应。AI 的作用不是替代关系，而是让想说的话更容易被说出来。",
    role: "关系产品。它关注亲人之间真实存在的表达压力、回应成本和长期连接。",
    icon: HeartHandshake,
    tone: "from-rose-100 via-orange-50 to-white",
    current: [
      "定义核心人群：想表达但表达不好的人，以及被需要但没有精力回应的人。",
      "先从沟通场景和隐私边界开始，而不是急着做泛社交功能。",
      "把可公开的产品判断沉淀到记录页。",
    ],
    next: [
      "整理 10 个真实沟通场景。",
      "设计本地优先、少采集数据的产品边界。",
      "明确哪些内容可以由 AI 生成，哪些必须保留人的确认。",
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
    label: "Passport 03",
    title: "AI Vlog 工作台",
    status: "工作流设计中",
    mission:
      "用户只负责记录生活素材，AI 负责整理、规划结构和剪辑成片，把低摩擦记录变成可分享作品。",
    role: "创作产品。它把素材管理、结构规划、模型生成和成片输出拆成可复用流水线。",
    icon: Video,
    tone: "from-amber-100 via-stone-50 to-white",
    current: [
      "先定义图、音、文三类素材如何进入系统。",
      "把自动整理、分镜规划、字幕和剪辑拆成工作流节点。",
      "供应商能力会先在 API Lab 里做实验。",
    ],
    next: [
      "设计素材入库格式和生成任务结构。",
      "用 Mermaid 画出第一版自动成片流程。",
      "整理可测试的视频模型、语音模型和字幕工具。",
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
    label: "Passport 04",
    title: "自进化个人 Agent",
    status: "长期主线",
    mission:
      "围绕主流 Agent 做长期记忆和能力进化系统，让每次开发、运营和产品判断都能成为下一次的上下文。",
    role: "底层系统。它不是单个功能，而是未来持续做新项目的生产力基础设施。",
    icon: Bot,
    tone: "from-lime-100 via-emerald-50 to-white",
    current: [
      "evomap-farmer 是当前重点推进的项目。",
      "AiTool 2.0 正在变成公开工具、记录和产品材料入口。",
      "每天的总结和旧内容补录会逐步形成长期记忆。",
    ],
    next: [
      "让记录页按产品、标签、日期持续聚合上下文。",
      "把工具使用经验、供应商体验和开发过程结构化。",
      "让 Codex 生成内容后可以自动写入公开记录。",
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
  "确认 App 名称、分类、年龄分级和审核备注。",
  "准备隐私政策 URL、支持 URL、使用条款和数据删除说明。",
  "准备 6.5 英寸截图、功能说明、测试账号和演示路径。",
  "把每次提交、拒审和修改记录回到 notes，作为下一次上架经验。",
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
              Mission
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
              Stack Signals
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
              Current State
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
              Next Move
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
        <div className="aios-hero relative overflow-hidden rounded-[46px] border border-white/10 p-6 text-white md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-300/18 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-black text-slate-200">
              <PackageOpen size={16} />
              Product Passport
            </div>
            <h1 className="aios-dark-title mt-7 max-w-4xl text-5xl font-black leading-[0.94] md:text-7xl">
              每个产品都应该有任务、状态、证据和下一步。
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              这个页面不只是产品列表，而是 AiTool 2.0
              的产品护照：记录它们为什么存在、现在推进到哪里、接下来要做什么，以及对外发布时需要哪些公开材料。
            </p>
          </div>
        </div>

        <aside className="aios-paper rounded-[40px] p-6 backdrop-blur-2xl md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#20342b_0%,#5f6b3f_55%,#d49b42_100%)] text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
              <Rocket size={22} />
            </div>
            <span className="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
              Release Cockpit
            </span>
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] text-slate-950">
            发布不是最后一步，而是产品系统的一部分。
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
              可以直接给 Apple 使用的公开 URL。
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
              旧产品信息仍然保留，但不再作为主叙事。
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
