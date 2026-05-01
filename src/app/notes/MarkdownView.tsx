'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'highlight.js/styles/github.css';
import remarkDirectives from '@/lib/posts/remarkDirectives';

interface Props {
    content: string;
}

function cx(...parts: Array<string | undefined>) {
    return parts.filter(Boolean).join(' ');
}

export default function MarkdownView({ content }: Props) {
    return (
        <div className="notes-prose prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-950 prose-h2:mt-12 prose-h2:text-3xl prose-h2:tracking-tight prose-h3:mt-10 prose-h3:text-2xl prose-h4:mt-8 prose-h4:text-xl prose-p:leading-8 prose-p:text-slate-700 prose-a:text-sky-700 prose-a:underline-offset-4 hover:prose-a:text-sky-900 prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.92em] prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto prose-pre:rounded-[24px] prose-pre:border prose-pre:border-slate-200 prose-pre:bg-slate-50 prose-pre:p-5 prose-img:rounded-[24px] prose-img:border prose-img:border-slate-200 prose-img:shadow-[0_18px_55px_rgba(15,23,42,0.08)] prose-blockquote:border-l-slate-300 prose-blockquote:text-slate-600 prose-hr:my-12 prose-hr:border-slate-200 prose-table:text-sm">
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkDirective, remarkDirectives]}
                rehypePlugins={[
                    rehypeRaw,
                    rehypeSlug,
                    [
                        rehypeAutolinkHeadings,
                        {
                            behavior: 'append',
                            properties: {
                                className: ['notes-heading-anchor'],
                                ariaLabel: 'Link to section',
                            },
                            content: { type: 'text', value: '#' },
                        },
                    ],
                    rehypeHighlight,
                ]}
                components={{
                    a: ({ href, className, ...props }) => {
                        const external = typeof href === 'string' && /^https?:\/\//.test(href);
                        return (
                            <a
                                {...props}
                                href={href}
                                className={className}
                                target={external ? '_blank' : undefined}
                                rel={external ? 'noreferrer noopener' : undefined}
                            />
                        );
                    },
                    img: ({ className, alt, ...props }) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img {...props} alt={alt || ''} loading="lazy" className={cx(className)} />
                    ),
                    iframe: (props) => (
                        <iframe
                            {...props}
                            loading="lazy"
                            allowFullScreen
                            className={cx(
                                'aspect-video w-full rounded-[24px] border border-slate-200 bg-slate-950 shadow-[0_18px_55px_rgba(15,23,42,0.08)]',
                                props.className,
                            )}
                        />
                    ),
                    audio: (props) => (
                        <audio {...props} controls className={cx('my-4 w-full', props.className)} />
                    ),
                    video: (props) => (
                        <video
                            {...props}
                            controls
                            className={cx(
                                'my-4 w-full rounded-[24px] border border-slate-200 bg-black shadow-[0_18px_55px_rgba(15,23,42,0.08)]',
                                props.className,
                            )}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
