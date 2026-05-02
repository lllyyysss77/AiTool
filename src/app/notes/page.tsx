import Link from 'next/link';
import { ArrowRight, BookOpen, Hash, NotebookPen, Tags } from 'lucide-react';
import { getAllPosts, getAllSeries, getAllTags } from '@/lib/posts';
import { QUICK_VIEWS, postMatchesView, type QuickView } from '@/lib/posts/types';
import AiosTicker from '../components/AiosTicker';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams?: Promise<{ view?: string; tag?: string; series?: string }>;
}

function isQuickView(value: string | undefined): value is QuickView {
    if (!value) return false;
    return QUICK_VIEWS.some((v) => v.id === value);
}

function buildHref(view: QuickView, filters: { tag?: string | null; series?: string | null } = {}) {
    const params = new URLSearchParams();
    if (view !== 'all') params.set('view', view);
    if (filters.tag) params.set('tag', filters.tag);
    if (filters.series) params.set('series', filters.series);
    const qs = params.toString();
    return qs ? `/notes?${qs}` : '/notes';
}

function stripSeriesHeading(content: string) {
    return content.replace(/^# .+?(?:\r?\n){1,2}/, '');
}

function renderInline(text: string) {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
        }
        return part;
    });
}

function renderSeriesIntro(content: string) {
    return stripSeriesHeading(content)
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block, index) => {
            if (block.startsWith('### ')) {
                return <h4 key={index} className="mt-5 text-base font-bold text-slate-900">{block.slice(4)}</h4>;
            }
            if (block.startsWith('## ')) {
                return <h3 key={index} className="mt-6 text-lg font-black text-slate-950">{block.slice(3)}</h3>;
            }

            const lines = block.split('\n').map((line) => line.trim()).filter(Boolean);
            if (lines.length > 0 && lines.every((line) => line.startsWith('- '))) {
                return (
                    <ul key={index} className="mt-3 list-disc space-y-1 pl-5 text-sm leading-7 text-slate-600">
                        {lines.map((line) => <li key={line}>{renderInline(line.slice(2))}</li>)}
                    </ul>
                );
            }
            if (lines.length > 0 && lines.every((line) => /^\d+\.\s/.test(line))) {
                return (
                    <ol key={index} className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-7 text-slate-600">
                        {lines.map((line) => <li key={line}>{renderInline(line.replace(/^\d+\.\s/, ''))}</li>)}
                    </ol>
                );
            }

            return (
                <p key={index} className="mt-3 text-sm leading-7 text-slate-600">
                    {renderInline(lines.join(' '))}
                </p>
            );
        });
}

export default async function NotesPage({ searchParams }: PageProps) {
    const sp = (await searchParams) ?? {};
    const view: QuickView = isQuickView(sp.view) ? sp.view : 'all';
    const tagFilter = typeof sp.tag === 'string' && sp.tag.trim() ? sp.tag.trim() : null;
    const seriesFilter = typeof sp.series === 'string' && sp.series.trim() ? sp.series.trim() : null;

    const allPosts = getAllPosts();
    const filtered = allPosts.filter((p) => {
        if (!postMatchesView(p, view)) return false;
        if (tagFilter && !p.tags.includes(tagFilter)) return false;
        if (seriesFilter && p.series !== seriesFilter) return false;
        return true;
    });

    const tagStats = getAllTags(allPosts);
    const seriesStats = getAllSeries(allPosts);
    const selectedSeries = seriesFilter ? seriesStats.find((item) => item.series === seriesFilter) ?? null : null;
    const latest = filtered[0] ?? allPosts[0] ?? null;

    return (
        <main className="aios-page min-h-screen px-4 py-10 text-slate-900 md:px-8 md:py-14">
            <section className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_0.78fr]">
                <div className="aios-hero rounded-[42px] border border-white/10 p-6 text-white md:p-8" data-watermark="NOTES">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-slate-200">
                        <NotebookPen size={16} />
                        公开记录
                    </div>
                    <h1 className="aios-dark-title mt-6 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
                        把想法、产品、生活,慢慢都写下来。
                    </h1>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                        所有内容都从独立的 Markdown 仓库读取。tag 自由打,顶部快捷视图只是过滤。视频走 iframe(YouTube/B 站),图音保存在自己的存储里。
                    </p>
                </div>

                <aside className="aios-paper rounded-[36px] p-6 backdrop-blur-2xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                            当前
                        </h2>
                        <span className="rounded-full border border-slate-900/10 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                            {filtered.length} / {allPosts.length} 篇
                        </span>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-slate-50 p-3">
                            <Hash size={16} className="text-slate-500" />
                            <div className="mt-2 font-mono text-lg text-slate-950">{tagStats.length}</div>
                            <div className="text-xs text-slate-500">标签数</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                            <Tags size={16} className="text-slate-500" />
                            <div className="mt-2 font-mono text-lg text-slate-950">
                                {QUICK_VIEWS.find((v) => v.id === view)?.label ?? '全部'}
                            </div>
                            <div className="text-xs text-slate-500">当前视图</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-3">
                            <BookOpen size={16} className="text-slate-500" />
                            <div className="mt-2 font-mono text-lg text-slate-950">{seriesStats.length}</div>
                            <div className="text-xs text-slate-500">专栏数</div>
                        </div>
                    </div>
                    {latest ? (
                        <Link
                            href={`/notes/${latest.slug}`}
                            className="mt-5 block rounded-[24px] border border-slate-900/10 bg-slate-950 p-4 text-white transition hover:bg-slate-800"
                        >
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">最新</div>
                            <div className="mt-2 text-lg font-semibold">{latest.title}</div>
                            {latest.excerpt ? (
                                <p className="mt-2 line-clamp-3 text-sm leading-7 text-slate-300">{latest.excerpt}</p>
                            ) : null}
                        </Link>
                    ) : null}
                </aside>
            </section>

            <div className="mx-auto mt-8 max-w-7xl overflow-hidden rounded-[28px] border border-[#181b1a]/10">
                <AiosTicker />
            </div>

            <section className="mx-auto mt-8 max-w-7xl">
                <div className="flex flex-wrap items-center gap-2">
                    {QUICK_VIEWS.map((spec) => {
                        const active = spec.id === view;
                        return (
                            <Link
                                key={spec.id}
                                href={buildHref(spec.id, { tag: tagFilter, series: seriesFilter })}
                                className={
                                    active
                                        ? 'rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-[0_10px_28px_rgba(15,23,42,0.18)]'
                                        : 'rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-950'
                                }
                            >
                                {spec.label}
                            </Link>
                        );
                    })}
                    {tagFilter ? (
                        <Link
                            href={buildHref(view, { series: seriesFilter })}
                            className="ml-2 inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                            #{tagFilter} ✕
                        </Link>
                    ) : null}
                    {seriesFilter ? (
                        <Link
                            href={buildHref(view, { tag: tagFilter })}
                            className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                        >
                            专栏：{seriesFilter} ✕
                        </Link>
                    ) : null}
                </div>
            </section>

            {selectedSeries ? (
                <section className="mx-auto mt-6 max-w-7xl">
                    <div className="rounded-[30px] border border-sky-100 bg-sky-50/70 p-5 shadow-[0_14px_44px_rgba(14,165,233,0.08)] md:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-sky-700">
                                <BookOpen size={14} />
                                当前专栏
                            </div>
                            <span className="font-mono text-xs text-sky-700">{selectedSeries.count} 篇文章</span>
                        </div>
                        <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
                            {selectedSeries.series}
                        </h2>
                        {selectedSeries.excerpt ? (
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">{selectedSeries.excerpt}</p>
                        ) : (
                            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">这个专栏还没有写引子。可以在内容仓的 <code className="rounded bg-white px-1 py-0.5">series/</code> 里新增说明。</p>
                        )}
                        {selectedSeries.content ? (
                            <div className="mt-5 rounded-[24px] border border-white/80 bg-white/70 p-5">
                                {renderSeriesIntro(selectedSeries.content)}
                            </div>
                        ) : null}
                    </div>
                </section>
            ) : null}

            <section className="mx-auto mt-6 grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,760px)_320px] lg:justify-center">
                <div className="min-w-0">
                    {filtered.length === 0 ? (
                        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500">
                            这个视图下还没有内容。在 <code className="rounded bg-slate-100 px-1.5 py-0.5">AiTool-content/posts/</code> 里写一篇符合当前筛选的 Markdown 就行。
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {filtered.map((post) => (
                                <article
                                    key={post.slug}
                                    className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white/80 shadow-[0_14px_44px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
                                >
                                    {post.cover ? (
                                        <Link href={`/notes/${post.slug}`}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={post.cover} alt={post.title} className="aspect-[16/7] w-full object-cover" />
                                        </Link>
                                    ) : null}
                                    <div className="p-6 md:p-7">
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <time dateTime={post.date} className="font-mono">{post.date}</time>
                                            {post.series ? (
                                                <Link
                                                    href={buildHref(view, { tag: tagFilter, series: post.series })}
                                                    className="rounded-full bg-sky-50 px-2.5 py-1 font-semibold text-sky-700 transition hover:bg-sky-100"
                                                >
                                                    专栏 / {post.series}
                                                </Link>
                                            ) : null}
                                        </div>
                                        <Link href={`/notes/${post.slug}`} className="mt-3 block">
                                            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 transition group-hover:text-sky-700">
                                                {post.title}
                                            </h2>
                                        </Link>
                                        {post.excerpt ? (
                                            <p className="mt-3 line-clamp-3 text-[15px] leading-8 text-slate-600">{post.excerpt}</p>
                                        ) : null}
                                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.map((tag) => (
                                                    <Link
                                                        key={tag}
                                                        href={buildHref(view, { tag, series: seriesFilter })}
                                                        className={
                                                            tagFilter === tag
                                                                ? 'rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700'
                                                                : 'rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 transition hover:bg-slate-200'
                                                        }
                                                    >
                                                        #{tag}
                                                    </Link>
                                                ))}
                                            </div>
                                            <Link
                                                href={`/notes/${post.slug}`}
                                                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
                                            >
                                                阅读
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                <aside className="space-y-5 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-auto">
                    <section className="rounded-[26px] border border-slate-200 bg-white/80 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)] backdrop-blur">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                            <BookOpen size={15} />
                            专栏筛选
                        </h3>
                        {seriesStats.length > 0 ? (
                            <div className="mt-3 space-y-2">
                                {seriesStats.map(({ series, count, excerpt, defined }) => {
                                    const active = seriesFilter === series;
                                    return (
                                        <Link
                                            key={series}
                                            href={buildHref(view, { tag: tagFilter, series })}
                                            className={
                                                active
                                                    ? 'block rounded-2xl border border-sky-200 bg-sky-50 px-3 py-3 text-sm font-semibold text-sky-800'
                                                    : 'block rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-200 hover:bg-white hover:text-slate-950'
                                            }
                                        >
                                            <span className="block">{series}</span>
                                            {excerpt ? (
                                                <span className="mt-1 line-clamp-2 block text-xs font-normal leading-5 text-slate-500">{excerpt}</span>
                                            ) : null}
                                            <span className="mt-2 block font-mono text-xs text-slate-400">
                                                {count} 篇{defined ? '' : ' / 未建引子'}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="mt-3 text-xs leading-6 text-slate-500">还没有设置专栏。先在内容仓新增 <code className="rounded bg-slate-100 px-1 py-0.5">series/*.md</code> 引子，再给真正相关的文章加 <code className="rounded bg-slate-100 px-1 py-0.5">series</code>。</p>
                        )}
                    </section>

                    <section className="rounded-[26px] border border-slate-200 bg-white/80 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)] backdrop-blur">
                        <h3 className="text-sm font-semibold text-slate-950">标签云</h3>
                        {tagStats.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {tagStats.map(({ tag, count }) => (
                                    <Link
                                        key={tag}
                                        href={buildHref(view, { tag, series: seriesFilter })}
                                        className={
                                            tagFilter === tag
                                                ? 'rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700'
                                                : 'rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-200'
                                        }
                                    >
                                        #{tag} <span className="font-mono text-slate-400">{count}</span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-3 text-xs text-slate-500">还没有 tag。</p>
                        )}
                    </section>

                    <section className="rounded-[26px] border border-slate-200 bg-white/80 p-4 text-sm leading-7 text-slate-600 shadow-[0_12px_34px_rgba(15,23,42,0.04)] backdrop-blur">
                        <h3 className="text-sm font-semibold text-slate-950">写作流程</h3>
                        <p className="mt-3">
                            内容来自独立 git 仓库 <code className="rounded bg-slate-100 px-1.5 py-0.5">AiTool-content</code>。本地 VS Code 写 Markdown,git push 即发布。
                        </p>
                        <p className="mt-2">
                            tag 完全自由,顶部快捷视图只匹配若干常用 tag(产品 / 生活 / AI / 工具 / 全部)。
                        </p>
                        <p className="mt-2">
                            专栏是长期主题,先在内容仓 <code className="rounded bg-slate-100 px-1.5 py-0.5">series/</code> 写引子,文章再按需加入。
                        </p>
                    </section>
                </aside>
            </section>
        </main>
    );
}
