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

const capabilityNodes: CapabilityNode[] = [
  {
    layer: "Model Interface",
    title: "API Lab",
    description:
      "把文本、图片、语音、文件和实时接口放进同一个模型实验室，先验证供应商能力，再沉淀成产品工作流。",
    href: "/tools/api-lab",
    icon: Network,
    status: "核心实验层",
    inputs: ["供应商", "模型", "请求体", "文件"],
    outputs: ["响应结果", "cURL", "经验记录"],
    tone: "from-slate-100 via-cyan-50 to-white",
  },
  {
    layer: "Visual Thinking",
    title: "Mermaid 在线查看",
    description:
      "快速把产品流程、Agent 流程、App Store 准备路径和系统架构画出来，帮助想法从文字变成结构。",
    href: "/tools/mermaid",
    icon: Code2,
    status: "结构化工具",
    inputs: ["流程", "架构", "路线图"],
    outputs: ["SVG 预览", "Mermaid 代码", "说明图"],
    tone: "from-sky-100 via-blue-50 to-white",
  },
  {
    layer: "File Memory",
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
    layer: "Public Memory",
    title: "每日记录 API",
    description:
      "Codex 生成的每日总结、旧内容补录、产品判断和素材摘录，可以进入公开时间线。",
    href: "/notes",
    icon: NotebookPen,
    status: "长期记忆层",
    inputs: ["日期", "标签", "Markdown", "媒体块"],
    outputs: ["公开记录", "标签索引", "Agent 上下文"],
    tone: "from-lime-100 via-emerald-50 to-white",
  },
  {
    layer: "Release System",
    title: "App Store 材料",
    description:
      "把隐私政策、支持页、条款、数据删除说明和上架清单变成可复用的发布工具包。",
    href: "/legal/app-store-checklist",
    icon: ShieldCheck,
    status: "发布支撑层",
    inputs: ["App 行为", "隐私标签", "截图", "审核说明"],
    outputs: ["公开 URL", "检查清单", "审核材料"],
    tone: "from-rose-100 via-orange-50 to-white",
  },
  {
    layer: "Product Context",
    title: "产品护照",
    description:
      "每个产品都记录 Mission、Current State、Next Move 和 Artifacts，避免方向散掉。",
    href: "/products",
    icon: PackageOpen,
    status: "产品上下文",
    inputs: ["产品想法", "进度", "发布材料"],
    outputs: ["产品状态", "对外说明", "下一步"],
    tone: "from-violet-100 via-slate-50 to-white",
  },
];

const workflowRecipes = [
  {
    title: "准备一个 App 上架",
    steps: [
      "产品护照确认功能边界",
      "上架清单检查材料",
      "API Lab 验证模型能力",
      "记录页沉淀踩坑",
    ],
    icon: CheckCircle2,
  },
  {
    title: "验证一个模型供应商",
    steps: [
      "API Lab 配置请求",
      "保存输入输出样例",
      "记录价格和错误",
      "决定是否进入产品流",
    ],
    icon: Braces,
  },
  {
    title: "把想法变成系统能力",
    steps: [
      "notes 记录原始想法",
      "Mermaid 画流程",
      "产品页绑定方向",
      "Agent 长期复用",
    ],
    icon: GitBranch,
  },
];

const operatingLayers = [
  { label: "Capture", body: "记录素材和想法", icon: PenTool },
  { label: "Experiment", body: "验证模型与接口", icon: Braces },
  { label: "Structure", body: "流程化和标签化", icon: DatabaseZap },
  { label: "Ship", body: "形成公开产品材料", icon: Layers3 },
  { label: "Evolve", body: "回流到个人 Agent", icon: BrainCircuit },
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
              Input
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
              Output
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
          打开能力节点
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
        <div className="aios-hero relative overflow-hidden rounded-[46px] border border-white/10 p-6 text-white md:p-10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-cyan-300/18 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-amber-300/14 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-black text-slate-200">
              <Orbit size={16} />
              Capability Map
            </div>
            <h1 className="aios-dark-title mt-7 max-w-4xl text-5xl font-black leading-[0.94] md:text-7xl">
              工具不是导航，是 AI 产品系统的能力节点。
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              这里不再把工具当作散落入口，而是按“输入什么、产出什么、服务哪条产品线”来组织。每个工具都应该回到产品推进、内容记录和
              Agent 进化里。
            </p>
          </div>
        </div>

        <aside className="aios-paper rounded-[40px] p-6 backdrop-blur-2xl md:p-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#20342b_0%,#5f6b3f_55%,#d49b42_100%)] text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
              <Boxes size={22} />
            </div>
            <span className="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
              Operating Layers
            </span>
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-[-0.045em] text-slate-950">
            从想法到产品，工具应该接在同一条链路上。
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
              Nodes
            </div>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.055em] text-slate-950 md:text-5xl">
              当前能力地图
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-white hover:text-slate-950"
          >
            看产品如何使用这些能力
            <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {capabilityNodes.map((node) => (
            <CapabilityCard key={node.title} node={node} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-7xl gap-5 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="rounded-[40px] border border-slate-900/10 bg-slate-950 p-6 text-white shadow-[0_24px_90px_rgba(15,23,42,0.2)] md:p-8">
          <Sparkles size={28} className="text-cyan-200" />
          <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] md:text-4xl">
            真实工作流比工具数量更重要。
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
              Direct Tools
            </div>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] text-slate-950 md:text-5xl">
              仍然可以直接打开工具。
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
