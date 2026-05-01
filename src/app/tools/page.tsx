import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  Braces,
  CheckCircle2,
  Code2,
  DatabaseZap,
  ExternalLink,
  FileText,
  GitBranch,
  Layers3,
  Network,
  NotebookPen,
  Orbit,
  PackageOpen,
  PenTool,
  ShieldCheck,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { personalToolbox } from "@/lib/aitool2";
import AiosTicker from "../components/AiosTicker";

type CapabilityNode = {
  layer: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  status: string;
  inputs: string[];
  outputs: string[];
  tone: string;
};

const capabilityEntries: CapabilityNode[] = [
  {
    layer: "我试模型的地方",
    title: "API Lab",
    description:
      "我平时会反复试不同供应商的模型，先集中放在这里，不要每次都重新拼请求。",
    href: "/tools/api-lab",
    icon: Network,
    status: "常用",
    inputs: ["供应商", "模型", "请求内容", "文件"],
    outputs: ["返回结果", "cURL", "踩坑记录"],
    tone: "from-slate-100 via-cyan-50 to-white",
  },
  {
    layer: "我画流程的地方",
    title: "Mermaid 在线查看",
    description:
      "很多想法只写文字会绕，先用 Mermaid 画一下，自己也更容易看清楚。",
    href: "/tools/mermaid",
    icon: Code2,
    status: "顺手工具",
    inputs: ["流程", "架构", "路线图"],
    outputs: ["SVG 预览", "Mermaid 代码", "说明图"],
    tone: "from-sky-100 via-blue-50 to-white",
  },
  {
    layer: "旧文件能力",
    title: "StepFun 文件管理",
    description:
      "保留旧服务里真正有用的文件能力，用来查询、清理和管理历史文件资产。",
    href: "/stepfun/file",
    icon: FileText,
    status: "保留兼容",
    inputs: ["文件 ID", "用途", "分页"],
    outputs: ["文件列表", "批量删除", "状态确认"],
    tone: "from-amber-100 via-stone-50 to-white",
  },
  {
    layer: "公开记录",
    title: "记录时间线",
    description:
      "本地 Markdown 仓库 (AiTool-content) push 即发布,顶部 5 个快捷视图按 tag 过滤。",
    href: "/notes",
    icon: NotebookPen,
    status: "记录入口",
    inputs: ["frontmatter", "标签", "Markdown", "iframe 媒体"],
    outputs: ["公开记录", "标签云", "详情页"],
    tone: "from-lime-100 via-emerald-50 to-white",
  },
  {
    layer: "我准备上架材料的地方",
    title: "App Store 材料",
    description:
      "最近要上架 App，这些页面就先固定下来，之后每个产品都可以复用。",
    href: "/legal/app-store-checklist",
    icon: ShieldCheck,
    status: "上架相关",
    inputs: ["App 行为", "隐私标签", "截图", "审核说明"],
    outputs: ["公开 URL", "检查清单", "审核材料"],
    tone: "from-rose-100 via-orange-50 to-white",
  },
  {
    layer: "我放产品笔记的地方",
    title: "产品护照",
    description:
      "每个项目先留一页，写清楚我为什么做、现在做到哪、下一步是什么。",
    href: "/products",
    icon: PackageOpen,
    status: "产品笔记",
    inputs: ["产品想法", "进度", "发布材料"],
    outputs: ["产品状态", "对外说明", "下一步"],
    tone: "from-violet-100 via-slate-50 to-white",
  },
];

const workflowRecipes = [
  {
    title: "准备一个 App 上架",
    steps: [
      "先确认这个 App 到底解决什么",
      "再检查上架材料有没有漏",
      "需要模型能力的地方先去 API Lab 试",
      "过程和踩坑写回记录",
    ],
    icon: CheckCircle2,
  },
  {
    title: "验证一个模型供应商",
    steps: [
      "在 API Lab 配请求",
      "保存几个真实输入输出",
      "记一下价格、错误和限制",
      "决定要不要继续做",
    ],
    icon: Braces,
  },
  {
    title: "把想法变成系统能力",
    steps: [
      "先在 notes 写原始想法",
      "再用 Mermaid 画流程",
      "放回对应产品页",
      "以后给 Agent 复用",
    ],
    icon: GitBranch,
  },
];

const operatingLayers = [
  { label: "先记下", body: "素材和想法别丢", icon: PenTool },
  { label: "试一下", body: "模型和接口先跑通", icon: Braces },
  { label: "整理一下", body: "加标签、画流程", icon: DatabaseZap },
  { label: "能发布", body: "变成对外材料", icon: Layers3 },
  { label: "再复用", body: "回到 Agent 记忆里", icon: BrainCircuit },
];

function CapabilityCard({ node }: { node: CapabilityNode }) {
  const Icon = node.icon;

  return (
    <Link
      href={node.href}
      className={`aios-card group relative overflow-hidden rounded-[38px] bg-gradient-to-br ${node.tone} p-6 transition hover:-translate-y-1 hover:shadow-[0_30px_95px_rgba(15,23,42,0.12)]`}
    >
      <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-white/72 blur-3xl transition group-hover:scale-125" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-slate-950 text-white shadow-[0_18px_46px_rgba(15,23,42,0.2)]">
            <Icon size={23} />
          </div>
          <span className="rounded-full border border-slate-900/10 bg-white/75 px-3 py-1 text-xs font-black text-slate-600 backdrop-blur">
            {node.status}
          </span>
        </div>
        <div className="mt-5 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
          {node.layer}
        </div>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950">
          {node.title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          {node.description}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-white/70 bg-white/48 p-3 backdrop-blur">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              我放进去
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {node.inputs.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white/75 px-2 py-1 text-[11px] font-bold text-slate-500"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-[22px] border border-white/70 bg-white/48 p-3 backdrop-blur">
            <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              我拿出来
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {node.outputs.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-white/75 px-2 py-1 text-[11px] font-bold text-slate-500"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-slate-700">
          打开这个入口
          <ArrowRight size={15} />
        </div>
      </div>
    </Link>
  );
}

export default function ToolsPage() {
  return (
    <main className="aios-page min-h-screen px-4 py-10 text-slate-950 md:px-8 md:py-14">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.06fr_0.94fr]">
        <div
          className="aios-hero relative overflow-hidden rounded-[46px] border border-white/10 p-6 text-white md:p-10"
          data-watermark="TOOLS"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-300/18 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-amber-300/14 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-black text-slate-200">
              <Orbit size={16} />
              工具入口
            </div>
            <h1 className="aios-dark-title mt-7 max-w-4xl text-4xl font-black leading-[0.98] md:text-6xl">
              这些不是展示用的工具，是我自己会反复打开的入口。
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              这里不再把工具当作散落链接，而是按“我放进去什么、能拿出来什么、最后服务哪件事”来整理。用过的经验以后也能回到长期记录里。
            </p>
          </div>
        </div>

        <aside className="aios-paper rounded-[40px] p-6 backdrop-blur-2xl md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#20342b_0%,#5f6b3f_55%,#d49b42_100%)] text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
              <Boxes size={22} />
            </div>
            <span className="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
              我的使用顺序
            </span>
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] text-slate-950">
            我希望这些入口能接成一条顺手的链路。
          </h2>
          <div className="mt-5 space-y-3">
            {operatingLayers.map((layer, index) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.label}
                  className="flex items-center gap-3 rounded-[22px] border border-slate-900/10 bg-white/70 p-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-slate-950 text-white">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">
                        0{index + 1}
                      </span>
                      <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                        {layer.label}
                      </span>
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-700">
                      {layer.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </section>

      <div className="mx-auto mt-8 max-w-7xl overflow-hidden rounded-[28px] border border-[#181b1a]/10">
        <AiosTicker />
      </div>

      <section className="mx-auto mt-8 max-w-7xl">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">
              入口
            </div>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] text-slate-950 md:text-5xl">
              现在先放这些入口
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-white hover:text-slate-950"
          >
            看它们对应哪些项目
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {capabilityEntries.map((node) => (
            <CapabilityCard key={node.title} node={node} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-7xl gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[40px] border border-slate-900/10 bg-slate-950 p-6 text-white shadow-[0_24px_90px_rgba(15,23,42,0.2)] md:p-8">
          <Sparkles size={28} className="text-cyan-200" />
          <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] md:text-4xl">
            工具多少不重要，关键是我真的会用。
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-300 md:text-base">
            AiTool 2.0
            的工具页应该回答：我现在遇到一个产品任务，应该从哪个入口开始，生成什么产物，最后沉淀到哪里。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {workflowRecipes.map((recipe) => {
            const Icon = recipe.icon;
            return (
              <article
                key={recipe.title}
                className="rounded-[32px] border border-slate-900/10 bg-white/[0.78] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur-2xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-slate-100 text-slate-700">
                  <Icon size={21} />
                </div>
                <h3 className="mt-4 text-xl font-black tracking-tight text-slate-950">
                  {recipe.title}
                </h3>
                <div className="mt-4 space-y-2">
                  {recipe.steps.map((step, index) => (
                    <div
                      key={step}
                      className="flex gap-2 text-sm leading-6 text-slate-600"
                    >
                      <span className="font-mono text-xs text-slate-400">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl rounded-[40px] border border-slate-900/10 bg-white/[0.76] p-6 shadow-[0_22px_75px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-50 px-4 py-2 text-sm font-black text-slate-500">
              <Wrench size={16} />
              直接打开
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] text-slate-950 md:text-5xl">
              如果已经知道要用哪个，也可以直接点。
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {personalToolbox.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-[30px] border border-slate-900/10 bg-white/[0.82] p-5 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_45px_rgba(15,23,42,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-slate-950 text-white">
                    <Icon size={21} />
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-black ${tool.accent}`}
                  >
                    {tool.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-black tracking-tight text-slate-950">
                  {tool.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {tool.description}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-slate-700">
                  打开工具
                  {tool.external ? (
                    <ExternalLink size={15} />
                  ) : (
                    <ArrowRight size={15} />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
