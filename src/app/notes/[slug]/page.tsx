import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, CalendarDays } from 'lucide-react';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import MarkdownView from '../MarkdownView';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return { title: 'Not found' };
    return {
        title: `${post.title} - Owen 的记录`,
        description: post.excerpt ?? undefined,
    };
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const all = getAllPosts();
    const idx = all.findIndex((p) => p.slug === slug);
    const prev = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
    const next = idx > 0 ? all[idx - 1] : null;
    const sidebarPosts = post.series
        ? all.filter((item) => item.series === post.series)
        : all.filter((item) => item.slug !== post.slug).slice(0, 6);

    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,#f8faf9_0%,#ffffff_55%,#f4f6f4_100%)] px-4 py-10 md:px-8 md:py-14">
            <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,760px)_320px] lg:items-start">
                <article className="min-w-0">
                    <Link
                        href="/notes"
                        className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
                    >
                        <ArrowLeft size={14} />
                        回到记录列表
                    </Link>

                    <header className="mt-6 border-b border-slate-200 pb-8">
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <CalendarDays size={14} />
                            <time dateTime={post.date} className="font-mono">{post.date}</time>
                            {post.series ? (
                                <Link
                                    href={`/notes?series=${encodeURIComponent(post.series)}`}
                                    className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                                >
                                    <BookOpen size={13} />
                                    {post.series}
                                </Link>
                            ) : null}
                        </div>
                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                            {post.title}
                        </h1>
                        {post.excerpt ? (
                            <p className="mt-5 text-lg leading-8 text-slate-600">{post.excerpt}</p>
                        ) : null}
                        {post.tags.length > 0 ? (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/notes?tag=${encodeURIComponent(tag)}`}
                                        className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 transition hover:bg-slate-200"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        ) : null}
                    </header>

                    {post.cover ? (
                        <figure className="mt-8">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={post.cover} alt={post.title} className="w-full rounded-2xl border border-slate-200" />
                        </figure>
                    ) : null}

                    <div className="mt-8">
                        <MarkdownView content={post.content} />
                    </div>

                    <nav className="mt-12 grid gap-3 border-t border-slate-200 pt-8 sm:grid-cols-2">
                        {prev ? (
                            <Link
                                href={`/notes/${prev.slug}`}
                                className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-400"
                            >
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">上一篇</div>
                                <div className="mt-2 text-sm font-semibold text-slate-950 line-clamp-2">{prev.title}</div>
                            </Link>
                        ) : <div />}
                        {next ? (
                            <Link
                                href={`/notes/${next.slug}`}
                                className="rounded-2xl border border-slate-200 bg-white p-4 text-right transition hover:border-slate-400"
                            >
                                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">下一篇</div>
                                <div className="mt-2 text-sm font-semibold text-slate-950 line-clamp-2">{next.title}</div>
                            </Link>
                        ) : null}
                    </nav>
                </article>

                <aside className="space-y-5 lg:sticky lg:top-28">
                    <section className="rounded-[26px] border border-slate-200 bg-white/80 p-4 shadow-[0_12px_34px_rgba(15,23,42,0.04)] backdrop-blur">
                        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                            <BookOpen size={15} />
                            {post.series ? '专栏目录' : '推荐阅读'}
                        </h2>
                        <p className="mt-2 text-xs leading-6 text-slate-500">
                            {post.series ? `当前专栏：${post.series}` : '这篇文章还没有归入专栏，先显示最新推荐。'}
                        </p>
                        {post.series ? (
                            <Link
                                href={`/notes?series=${encodeURIComponent(post.series)}`}
                                className="mt-3 inline-flex rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                            >
                                查看专栏全部文章
                            </Link>
                        ) : null}

                        <div className="mt-4 space-y-2">
                            {sidebarPosts.map((item) => {
                                const active = item.slug === post.slug;
                                return (
                                    <Link
                                        key={item.slug}
                                        href={`/notes/${item.slug}`}
                                        className={
                                            active
                                                ? 'block rounded-2xl border border-slate-950 bg-slate-950 px-3 py-3 text-white'
                                                : 'block rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3 transition hover:border-slate-200 hover:bg-white'
                                        }
                                    >
                                        <time dateTime={item.date} className={active ? 'font-mono text-xs text-slate-400' : 'font-mono text-xs text-slate-400'}>
                                            {item.date}
                                        </time>
                                        <span className={active ? 'mt-1 block text-sm font-semibold leading-6 text-white' : 'mt-1 block text-sm font-semibold leading-6 text-slate-800'}>
                                            {item.title}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                </aside>
            </div>
        </main>
    );
}
