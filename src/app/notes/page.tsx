import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CalendarDays,
  CircleDot,
  DatabaseZap,
  FileText,
  GitBranch,
  Hash,
  Layers3,
  NotebookPen,
  Sparkles,
  Tags,
} from "lucide-react";
import type { DailyNote, DailyNoteBlock } from "@/lib/models/dailyNote";
import {
  getPublicNotesUserId,
  listDailyNotes,
} from "@/lib/repositories/dailyNoteRepository";
import AiosTicker from "../components/AiosTicker";

export const dynamic = "force-dynamic";

const fallbackNotes: DailyNote[] = [
  {
    id: "template-2026-05-01",
    userId: "local",
    noteKey: "daily:2026-05-01",
    noteKind: "daily",
    noteDate: "2026-05-01",
    title: "今日总结模板",
    summary:
      "这里以后按时间倒序记录每天的总结。内容不需要很复杂，先把今天做了什么、有什么判断、下一步要做什么留下来。",
    contentMarkdown: [
      "今天做了什么",
      "- 记录 3-5 条实际完成的事情。",
      "- 图、音频、视频可以作为附件或嵌入块放在正文后面。",
      "",
      "今天有什么判断",
      "- 写一个产品判断、技术判断或模型体验。",
      "",
      "下一步",
      "- 留给明天或下次打开 Codex 时继续执行的动作。",
    ].join("\n"),
    blocks: [],
    tags: ["daily", "template"],
    source: "system",
    sourceUrl: null,
    status: "draft",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
  },
];

async function loadNotes() {
  const userId = await getPublicNotesUserId();
  if (!userId) {
    return {
      notes: fallbackNotes,
      isPublicFallback: true,
      error: null,
    };
  }

  try {
    const notes = await listDailyNotes(userId, { limit: 30 });
    return {
      notes: notes.length > 0 ? notes : fallbackNotes,
      isPublicFallback: notes.length === 0,
      error: null,
    };
  } catch (error) {
    return {
      notes: fallbackNotes,
      isPublicFallback: true,
      error: error instanceof Error ? error.message : "记录读取失败",
    };
  }
}

const kindLabels: Record<DailyNote["noteKind"], string> = {
  daily: "每日总结",
  memory: "旧内容补录",
  product: "产品想法",
  clip: "素材摘录",
  learning: "学习记录",
  other: "其它记录",
};

const importTagIdeas = [
  "qq空间",
  "学生时代",
  "上海",
  "日本",
  "家庭",
  "朋友",
  "学习",
  "工作",
  "产品",
  "低谷",
  "高光",
  "旅行",
  "音乐",
  "灵感",
];

const productSignalRules = [
  {
    label: "日语学习体系",
    keywords: ["日语", "同传", "App Store", "学习", "词典", "Shadowing"],
  },
  {
    label: "亲人关系 AI",
    keywords: ["亲人", "家庭", "关系", "沟通", "表达"],
  },
  {
    label: "AI Vlog",
    keywords: ["Vlog", "视频", "素材", "剪辑", "成片"],
  },
  {
    label: "自进化 Agent",
    keywords: ["Agent", "自进化", "evomap", "evomap-farmer", "长期记忆"],
  },
  {
    label: "公开运营",
    keywords: ["X运营", "X 运营", "运营", "发帖", "公开"],
  },
];

function noteText(note: DailyNote) {
  return [note.title, note.summary, note.contentMarkdown, note.tags.join(" ")]
    .filter(Boolean)
    .join(" ");
}

function inferSignals(note: DailyNote) {
  const text = noteText(note).toLowerCase();
  const matched = productSignalRules
    .filter((rule) =>
      rule.keywords.some((keyword) => text.includes(keyword.toLowerCase())),
    )
    .map((rule) => rule.label);

  return matched.length > 0 ? matched : [kindLabels[note.noteKind]];
}

function buildTagStats(notes: DailyNote[]) {
  const counts = new Map<string, number>();
  notes.forEach((note) => {
    note.tags.forEach((tag) => counts.set(tag, (counts.get(tag) ?? 0) + 1));
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .slice(0, 18);
}

function buildKindStats(notes: DailyNote[]) {
  const counts = new Map<DailyNote["noteKind"], number>();
  notes.forEach((note) =>
    counts.set(note.noteKind, (counts.get(note.noteKind) ?? 0) + 1),
  );

  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
}

function buildSystemSignals(notes: DailyNote[]) {
  return productSignalRules
    .map((rule) => {
      const count = notes.filter((note) => {
        const text = noteText(note).toLowerCase();
        return rule.keywords.some((keyword) =>
          text.includes(keyword.toLowerCase()),
        );
      }).length;
      return { label: rule.label, count };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
}

function buildAiSummary(note: DailyNote) {
  if (note.summary) return note.summary;
  const firstLine = note.contentMarkdown
    ?.split("\n")
    .find((line) => line.trim());
  return (
    firstLine ||
    "这条记录已经进入公开时间线，后续可以继续补充摘要、标签和关联产品。"
  );
}

function buildReusableContext(note: DailyNote) {
  const signals = inferSignals(note);
  const contexts = [
    `关联方向：${signals.join(" / ")}`,
    note.tags.length > 0
      ? `可检索标签：${note.tags.slice(0, 6).join("、")}`
      : "可检索标签：后续补充",
    note.noteKind === "daily"
      ? "复用方式：作为后续周报、X 内容和产品进度回顾的原始材料。"
      : "复用方式：作为产品判断、旧内容补录或素材索引的一部分。",
  ];

  return contexts;
}

function isHttpUrl(url: string) {
  return /^https?:\/\//i.test(url) || url.startsWith("/");
}

function buildEmbedUrl(block: Extract<DailyNoteBlock, { type: "embed" }>) {
  if (!isHttpUrl(block.url)) return null;

  try {
    const url = new URL(block.url);

    if (block.provider === "youtube") {
      const videoId = url.hostname.includes("youtu.be")
        ? url.pathname.split("/").filter(Boolean)[0]
        : url.searchParams.get("v") ||
          url.pathname.match(/\/shorts\/([^/]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (block.provider === "bilibili") {
      const bvid = url.pathname.match(/\/video\/([^/?]+)/)?.[1];
      return bvid
        ? `https://player.bilibili.com/player.html?bvid=${bvid}&page=1`
        : null;
    }
  } catch {
    return null;
  }

  return null;
}

function MarkdownText({ text }: { text: string }) {
  return (
    <div className="whitespace-pre-wrap text-[15px] leading-8 text-slate-800">
      {text}
    </div>
  );
}

function BlockView({ block }: { block: DailyNoteBlock }) {
  if (block.type === "markdown") {
    return <MarkdownText text={block.text} />;
  }

  if (block.type === "image") {
    return (
      <figure className="space-y-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.url}
          alt={block.alt || block.caption || "daily note image"}
          className="max-h-[520px] w-full rounded-xl border border-slate-200 object-contain"
        />
        {block.caption ? (
          <figcaption className="text-sm text-slate-500">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "audio") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        {block.title ? (
          <div className="mb-2 text-sm font-semibold text-slate-800">
            {block.title}
          </div>
        ) : null}
        <audio controls src={block.url} className="w-full" />
        {block.caption ? (
          <p className="mt-2 text-sm text-slate-500">{block.caption}</p>
        ) : null}
      </div>
    );
  }

  if (block.type === "video") {
    return (
      <figure className="space-y-2">
        <video
          controls
          src={block.url}
          className="w-full rounded-xl border border-slate-200 bg-black"
        />
        {block.caption ? (
          <figcaption className="text-sm text-slate-500">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "embed") {
    const embedUrl = buildEmbedUrl(block);
    if (!embedUrl) {
      return (
        <a
          href={block.url}
          target="_blank"
          rel="noreferrer"
          className="block rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 underline-offset-4 hover:underline"
        >
          {block.title || block.url}
        </a>
      );
    }

    return (
      <div className="space-y-2">
        {block.title ? (
          <div className="text-sm font-semibold text-slate-700">
            {block.title}
          </div>
        ) : null}
        <iframe
          src={embedUrl}
          title={block.title || block.url}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="aspect-video w-full rounded-xl border border-slate-200 bg-white"
        />
      </div>
    );
  }

  return (
    <a
      href={block.url}
      target="_blank"
      rel="noreferrer"
      className="block rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700"
    >
      <span className="font-semibold text-slate-900">
        {block.title || block.url}
      </span>
      {block.description ? (
        <span className="mt-1 block text-slate-500">{block.description}</span>
      ) : null}
    </a>
  );
}

function NoteArticle({ note }: { note: DailyNote }) {
  const signals = inferSignals(note);
  const context = buildReusableContext(note);

  return (
    <article
      id={`note-${note.id}`}
      className="scroll-mt-28 border-b border-slate-200 py-8 first:pt-0"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <time
            dateTime={note.noteDate}
            className="font-mono text-sm text-slate-500"
          >
            {note.noteDate}
          </time>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {note.title}
          </h2>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-right text-xs leading-5 text-slate-400">
          <div>{kindLabels[note.noteKind]}</div>
          {note.sourceUrl ? (
            <a
              href={note.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:text-slate-700 hover:underline"
            >
              {note.source}
            </a>
          ) : (
            <div>{note.source}</div>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-[26px] border border-slate-200 bg-white/80 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          <Sparkles size={14} />
          AI Digest
        </div>
        <p className="mt-3 text-[15px] leading-8 text-slate-600">
          {buildAiSummary(note)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {signals.map((signal) => (
            <span
              key={signal}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {signal}
            </span>
          ))}
        </div>
      </div>

      {note.contentMarkdown ? (
        <div className="mt-6">
          <MarkdownText text={note.contentMarkdown} />
        </div>
      ) : null}

      {note.blocks.length > 0 ? (
        <div className="mt-6 space-y-5">
          {note.blocks.map((block, index) => (
            <BlockView
              key={`${note.id}-${block.type}-${index}`}
              block={block}
            />
          ))}
        </div>
      ) : null}

      <div className="mt-6 rounded-[24px] border border-slate-200 bg-[#f8faf9] p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          <BrainCircuit size={14} />
          Reusable Context
        </div>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-600">
          {context.map((item) => (
            <li key={item} className="flex gap-2">
              <CircleDot className="mt-1 shrink-0 text-slate-400" size={14} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {note.tags.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function RecordSidebar({ notes }: { notes: DailyNote[] }) {
  const tagStats = buildTagStats(notes);
  const kindStats = buildKindStats(notes);
  const systemSignals = buildSystemSignals(notes);

  return (
    <aside className="space-y-5 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-auto">
      <section className="rounded-[26px] border border-slate-200 bg-white/[0.82] p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-950">记忆索引</h2>
          <span className="font-mono text-xs text-slate-400">
            {notes.length}
          </span>
        </div>
        <div className="mt-3 space-y-2">
          {notes.map((note) => (
            <a
              key={note.id}
              href={`#note-${note.id}`}
              className="block rounded-xl border border-transparent px-3 py-2 transition hover:border-slate-200 hover:bg-slate-50"
            >
              <div className="font-mono text-[11px] text-slate-400">
                {note.noteDate}
              </div>
              <div className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-slate-800">
                {note.title}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                {kindLabels[note.noteKind]} · {note.source}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-slate-950 p-4 text-white shadow-[0_16px_45px_rgba(15,23,42,0.16)]">
        <h2 className="text-sm font-semibold text-white">产品信号</h2>
        {systemSignals.length > 0 ? (
          <div className="mt-3 space-y-2">
            {systemSignals.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl bg-white/[0.08] px-3 py-2 text-sm"
              >
                <span className="text-slate-200">{item.label}</span>
                <span className="font-mono text-xs text-cyan-200">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs leading-6 text-slate-400">
            写入记录后，会自动从标签和正文里聚合产品方向。
          </p>
        )}
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-white/[0.82] p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)] backdrop-blur">
        <h2 className="text-sm font-semibold text-slate-950">类型</h2>
        <div className="mt-3 space-y-2">
          {kindStats.map(([kind, count]) => (
            <div
              key={kind}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm"
            >
              <span className="text-slate-700">{kindLabels[kind]}</span>
              <span className="font-mono text-xs text-slate-400">{count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-white/[0.82] p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)] backdrop-blur">
        <h2 className="text-sm font-semibold text-slate-950">标签</h2>
        {tagStats.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {tagStats.map(([tag, count]) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
              >
                #{tag} <span className="font-mono text-slate-400">{count}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs leading-6 text-slate-500">
            写入记录后会自动聚合标签。
          </p>
        )}
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-white/[0.82] p-4 text-sm leading-7 text-slate-600 shadow-[0_12px_34px_rgba(15,23,42,0.04)] backdrop-blur">
        <h2 className="text-sm font-semibold text-slate-950">旧内容补录</h2>
        <p className="mt-3">
          QQ 空间、旧博客、朋友圈截图这类内容，建议作为{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">memory</code>{" "}
          类型补进同一条时间线。
        </p>
        <p className="mt-2">
          日期用原始发布日期；来源写{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">qq-space</code>
          ；标签保留当时的人、地点、阶段和情绪。
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {importTagIdeas.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>

      <section className="rounded-[26px] border border-slate-200 bg-white/[0.82] p-4 text-sm leading-7 text-slate-600 shadow-[0_12px_34px_rgba(15,23,42,0.04)] backdrop-blur">
        <h2 className="text-sm font-semibold text-slate-950">接口格式</h2>
        <p className="mt-3">
          每条记录都用{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">noteKey</code>{" "}
          去重：每日总结固定为{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">daily:日期</code>
          ；旧内容可以是{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">
            qq-space:日期:编号
          </code>
          。
        </p>
      </section>
    </aside>
  );
}

export default async function NotesPage() {
  const { notes, isPublicFallback, error } = await loadNotes();
  const latest = notes[0];
  const tagStats = buildTagStats(notes);
  const signals = buildSystemSignals(notes);

  return (
    <main className="aios-page min-h-screen px-4 py-10 text-slate-900 md:px-8 md:py-14">
      <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_0.78fr]">
        <div className="aios-hero rounded-[42px] border border-white/10 p-6 text-white md:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-slate-200">
            <NotebookPen size={16} />
            Memory Timeline
          </div>
          <h1 className="aios-dark-title mt-6 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            公开记录不是博客，是我正在积累的长期记忆。
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
            每日总结、旧内容补录、产品判断和素材摘录都会按真实发生时间进入同一条时间线。页面保持朴实阅读，但多一层
            AI Digest，方便未来被 Codex、Agent 和产品回顾继续复用。
          </p>
        </div>

        <aside className="aios-paper rounded-[36px] p-6 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#20342b_0%,#5f6b3f_55%,#d49b42_100%)] text-white">
              <DatabaseZap size={20} />
            </div>
            <span className="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
              {notes.length} records
            </span>
          </div>
          <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">
            当前记忆状态
          </h2>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-slate-50 p-3">
              <CalendarDays size={16} className="text-slate-500" />
              <div className="mt-2 font-mono text-lg text-slate-950">
                {latest?.noteDate ?? "-"}
              </div>
              <div className="text-xs text-slate-500">最新日期</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <Hash size={16} className="text-slate-500" />
              <div className="mt-2 font-mono text-lg text-slate-950">
                {tagStats.length}
              </div>
              <div className="text-xs text-slate-500">标签簇</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <Tags size={16} className="text-slate-500" />
              <div className="mt-2 font-mono text-lg text-slate-950">
                {signals.length}
              </div>
              <div className="text-xs text-slate-500">产品信号</div>
            </div>
          </div>
          {latest ? (
            <Link
              href={`#note-${latest.id}`}
              className="mt-5 block rounded-[24px] border border-slate-900/10 bg-slate-950 p-4 text-white transition hover:bg-slate-800"
            >
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Latest
              </div>
              <div className="mt-2 text-lg font-semibold">{latest.title}</div>
              <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-300">
                {buildAiSummary(latest)}
              </p>
            </Link>
          ) : null}
        </aside>
      </section>

      <div className="mx-auto mt-8 max-w-7xl overflow-hidden rounded-[28px] border border-[#181b1a]/10">
        <AiosTicker />
      </div>

      <section className="mx-auto mt-8 grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,760px)_320px] lg:justify-center">
        <section className="min-w-0">
          <div className="border-b border-slate-300 pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <FileText size={14} />
                Daily Notes
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <Bot size={14} />
                Codex Writable
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                <GitBranch size={14} />
                Agent Reusable
              </span>
            </div>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl">
              时间线
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-slate-600">
              中间放主题内容，右边放记录列表和标签索引。新的每日总结、旧 QQ
              空间补录、产品想法和素材摘录，都按真实发生时间进入同一条时间线。
            </p>
            {isPublicFallback && !error ? (
              <p className="mt-3 text-sm text-amber-700">
                暂时还没有公开记录，先展示模板。
              </p>
            ) : null}
            {error ? (
              <p className="mt-3 text-sm text-rose-600">
                数据库读取失败，暂时展示模板：{error}
              </p>
            ) : null}
          </div>

          <div className="py-8">
            {notes.map((note) => (
              <NoteArticle key={note.id} note={note} />
            ))}
          </div>
        </section>

        <RecordSidebar notes={notes} />
      </section>
    </main>
  );
}
