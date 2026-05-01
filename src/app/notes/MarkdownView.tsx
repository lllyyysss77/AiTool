'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

interface Props {
    content: string;
}

export default function MarkdownView({ content }: Props) {
    return (
        <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-950 prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-xl prose-p:leading-8 prose-p:text-slate-700 prose-a:text-sky-700 prose-a:underline-offset-4 hover:prose-a:text-sky-900 prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.92em] prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-2xl prose-pre:border prose-pre:border-slate-200 prose-pre:bg-slate-50 prose-pre:p-4 prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 prose-blockquote:border-l-slate-300 prose-blockquote:text-slate-600 prose-table:text-sm">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
                components={{
                    iframe: (props) => (
                        <iframe
                            {...props}
                            loading="lazy"
                            allowFullScreen
                            className="aspect-video w-full rounded-2xl border border-slate-200 bg-slate-950"
                        />
                    ),
                    audio: (props) => (
                        <audio {...props} controls className="my-4 w-full" />
                    ),
                    video: (props) => (
                        <video {...props} controls className="my-4 w-full rounded-2xl border border-slate-200 bg-black" />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
