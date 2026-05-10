import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Mic2,
  NotebookPen,
  Radio,
  Sparkles,
  Video,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { getAllPosts } from "@/lib/posts";
import type { PostMeta } from "@/lib/posts/types";

export const dynamic = "force-dynamic";

type HomeLink = {
  title: string;
  label: string;
  href: string;
  external?: boolean;
  icon: LucideIcon;
  tone: string;
};

const mainLinks: HomeLink[] = [
  {
    title: "欧文日语工坊",
    label: "词汇与语法图鉴",
    href: "https://nihonngo.owenshen.top",
    external: true,
    icon: Mic2,
    tone: "bg-emerald-50 text-emerald-800 border-emerald-100",
  },
  {
    title: "最新记录",
    label: "公开笔记时间线",
    href: "/notes",
    icon: NotebookPen,
    tone: "bg-slate-50 text-slate-800 border-slate-200",
  },
  {
    title: "工具箱",
    label: "API Lab / Mermaid / 文件",
    href: "/tools",
    icon: Wrench,
    tone: "bg-cyan-50 text-cyan-800 border-cyan-100",
  },
  {
    title: "产品与上架材料",
    label: "App Store 支持页、隐私政策",
    href: "/products",
    icon: FileText,
    tone: "bg-amber-50 text-amber-800 border-amber-100",
  },
];

const socialLinks: HomeLink[] = [
  {
    title: "X",
    label: "@OWENSHEN0907",
    href: "https://x.com/OWENSHEN0907",
    external: true,
    icon: Radio,
    tone: "bg-neutral-950 text-white border-neutral-950",
  },
  {
    title: "Bilibili",
    label: "欧文的视频空间",
    href: "https://space.bilibili.com/120184324?spm_id_from=333.788.0.0",
    external: true,
    icon: Video,
    tone: "bg-pink-50 text-pink-800 border-pink-100",
  },
  {
    title: "YouTube",
    label: "@owenshen0907",
    href: "https://www.youtube.com/@owenshen0907",
    external: true,
    icon: Video,
    tone: "bg-red-50 text-red-800 border-red-100",
  },
];

const fallbackPosts: PostMeta[] = [
  {
    slug: "",
    title: "开始运营 X 的第一天",
    date: "2026-05-01",
    publishedAt: "2026-05-01T00:00:00.000Z",
    tags: ["X运营", "日语学习", "AI"],
    series: null,
    cover: null,
    excerpt: "把 AI 产品、日语学习工具和自进化 Agent 的过程放到公开时间线里。",
  },
];

function getRecentPosts() {
  const posts = getAllPosts().slice(0, 5);
  return posts.length > 0 ? posts : fallbackPosts;
}

function postHref(post: PostMeta) {
  return post.slug ? `/notes/${post.slug}` : "/notes";
}

function LinkCard({ item }: { item: HomeLink }) {
  const Icon = item.icon;
  const className =
    "group flex h-full items-center justify-between gap-4 rounded-lg border bg-white/80 p-4 shadow-[0_12px_36px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:bg-white";
  const body = (
    <>
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${item.tone}`}
        >
          <Icon size={19} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-base font-black text-slate-950">
            {item.title}
          </span>
          <span className="mt-1 block truncate text-sm text-slate-500">
            {item.label}
          </span>
        </span>
      </div>
      <ArrowRight
        size={17}
        className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-900"
      />
    </>
  );

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={className}>
        {body}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {body}
    </Link>
  );
}

function LatestPostCard({ post, featured = false }: { post: PostMeta; featured?: boolean }) {
  return (
    <Link
      href={postHref(post)}
      className={
        featured
          ? "group block rounded-lg border border-slate-900 bg-slate-950 p-5 text-white shadow-[0_18px_55px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 hover:bg-slate-900"
          : "group block rounded-lg border border-slate-200 bg-white/[0.82] p-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:bg-white"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <time
          dateTime={post.date}
          className={featured ? "font-mono text-xs text-slate-400" : "font-mono text-xs text-slate-500"}
        >
          {post.date}
        </time>
        <span
          className={
            featured
              ? "rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300"
              : "rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-500"
          }
        >
          记录
        </span>
      </div>
      <h3
        className={
          featured
            ? "mt-4 text-2xl font-black tracking-tight text-white"
            : "mt-3 line-clamp-2 text-lg font-black tracking-tight text-slate-950"
        }
      >
        {post.title}
      </h3>
      {post.excerpt ? (
        <p
          className={
            featured
              ? "mt-3 line-clamp-3 text-sm leading-7 text-slate-300"
              : "mt-2 line-clamp-2 text-sm leading-6 text-slate-600"
          }
        >
          {post.excerpt}
        </p>
      ) : null}
      {post.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.slice(0, featured ? 4 : 3).map((tag) => (
            <span
              key={tag}
              className={
                featured
                  ? "rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300"
                  : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500"
              }
            >
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}

export default async function HomePage() {
  const recentPosts = getRecentPosts();
  const latestPost = recentPosts[0];
  const otherPosts = recentPosts.slice(1);

  return (
    <main className="aios-page min-h-screen px-4 py-8 text-slate-950 md:px-8 md:py-12">
      <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-lg border border-slate-900/10 bg-white/[0.82] p-6 shadow-[0_22px_80px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
          <div className="grid gap-7 lg:grid-cols-[1fr_340px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-black text-slate-600">
                <Sparkles size={16} />
                OWEN SHEN
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 md:text-6xl">
                AI 产品、日语学习和公开记录。
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                这里先放能直接打开的东西：日语词汇与语法图鉴、最近写的记录、常用工具和几个公开账号。
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://nihonngo.owenshen.top"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  打开欧文日语工坊
                  <ArrowRight size={16} />
                </a>
                <Link
                  href="/notes"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 transition hover:border-slate-400"
                >
                  看最新记录
                </Link>
              </div>
            </div>

            <a
              href="https://nihonngo.owenshen.top"
              target="_blank"
              rel="noreferrer"
              className="group block overflow-hidden rounded-lg border border-slate-200 bg-slate-950 text-white shadow-[0_18px_55px_rgba(15,23,42,0.16)]"
            >
              <img
                src="/notes-template-demo/tokyo-morning-hero.png"
                alt="欧文日语工坊"
                className="aspect-[16/7] w-full object-cover opacity-90 transition group-hover:scale-[1.02] lg:aspect-[16/10]"
              />
              <div className="p-3.5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-200">
                  <BookOpen size={15} />
                  Nihongo
                </div>
                <div className="mt-2 text-xl font-black">词汇与语法图鉴</div>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  把日语知识点做成更容易查、也更容易复习的图鉴。
                </p>
              </div>
            </a>
          </div>
        </div>

        <aside className="grid gap-5">
          <LatestPostCard post={latestPost} featured />
          <div className="rounded-lg border border-slate-200 bg-white/[0.82] p-4 shadow-[0_12px_36px_rgba(15,23,42,0.05)] backdrop-blur">
            <div className="text-sm font-black text-slate-950">公开账号</div>
            <div className="mt-3 grid gap-3">
              {socialLinks.map((item) => (
                <LinkCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-6 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mainLinks.map((item) => (
          <LinkCard key={item.title} item={item} />
        ))}
      </section>

      <section className="mx-auto mt-10 max-w-7xl">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
              Latest
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 md:text-4xl">
              最新记录
            </h2>
          </div>
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/[0.82] px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-white"
          >
            全部记录
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {otherPosts.map((post) => (
            <LatestPostCard key={post.slug || post.title} post={post} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-4 pb-8 md:grid-cols-3">
        <Link
          href="/tools/api-lab"
          className="rounded-lg border border-slate-200 bg-white/[0.82] p-5 transition hover:bg-white"
        >
          <Wrench size={20} className="text-slate-700" />
          <h3 className="mt-3 text-lg font-black">API Lab</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">模型接口先在这里试。</p>
        </Link>
        <Link
          href="/legal/app-store-checklist"
          className="rounded-lg border border-slate-200 bg-white/[0.82] p-5 transition hover:bg-white"
        >
          <FileText size={20} className="text-slate-700" />
          <h3 className="mt-3 text-lg font-black">上架材料</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">隐私政策、支持页、审核清单。</p>
        </Link>
        <a
          href="https://x.com/OWENSHEN0907"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-slate-200 bg-white/[0.82] p-5 transition hover:bg-white"
        >
          <Radio size={20} className="text-slate-700" />
          <h3 className="mt-3 text-lg font-black">最近动态</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">日常想法先发到 X，再沉淀到记录。</p>
        </a>
      </section>
    </main>
  );
}
