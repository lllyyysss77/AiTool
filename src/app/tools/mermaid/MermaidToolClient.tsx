'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, ExternalLink, RefreshCcw } from 'lucide-react';

const starterDiagram = `flowchart TD
    A[AiTool 2.0] --> B[个人工具]
    A --> C[产品说明]
    A --> D[想法记录]
    B --> E[StepFun 文件管理]
    B --> F[Mermaid 在线查看]
    B --> I[API Lab 2.0]
    C --> G[Apple 隐私政策 URL]
    D --> H[随手发现与模型体验]`;

function encodeMermaid(value: string) {
    if (typeof window === 'undefined') return '';
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

export default function MermaidToolClient() {
    const [diagram, setDiagram] = useState(starterDiagram);
    const [copied, setCopied] = useState(false);
    const encoded = useMemo(() => encodeMermaid(diagram), [diagram]);
    const previewUrl = encoded ? `https://mermaid.ink/svg/${encoded}` : '';
    const pngUrl = encoded ? `https://mermaid.ink/img/${encoded}` : '';

    async function copyDiagram() {
        await navigator.clipboard.writeText(diagram);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    }

    return (
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <section className="rounded-[34px] border border-slate-900/10 bg-white/[0.84] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                            Mermaid Source
                        </div>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                            写代码，右侧即时生成在线预览
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => setDiagram(starterDiagram)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-white"
                    >
                        <RefreshCcw size={15} />
                        重置
                    </button>
                </div>
                <textarea
                    value={diagram}
                    onChange={(event) => setDiagram(event.target.value)}
                    spellCheck={false}
                    className="mt-5 min-h-[460px] w-full resize-y rounded-[26px] border border-slate-900/10 bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-100 outline-none shadow-inner transition focus:border-slate-500"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => void copyDiagram()}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? '已复制' : '复制 Mermaid'}
                    </button>
                    <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-white"
                    >
                        打开 SVG
                        <ExternalLink size={16} />
                    </a>
                    <a
                        href={pngUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-white"
                    >
                        打开 PNG
                        <ExternalLink size={16} />
                    </a>
                </div>
            </section>

            <section className="rounded-[34px] border border-slate-900/10 bg-white/[0.84] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                            Preview
                        </div>
                        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                            在线 SVG 预览
                        </h2>
                    </div>
                    <span className="rounded-full border border-cyan-200 bg-cyan-100 px-3 py-1 text-xs font-black text-cyan-900">
                        powered by mermaid.ink
                    </span>
                </div>
                <div className="mt-5 min-h-[520px] overflow-auto rounded-[30px] border border-slate-900/10 bg-slate-50 p-4">
                    {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={previewUrl}
                            alt="Mermaid diagram preview"
                            className="mx-auto max-w-full rounded-[20px] bg-white p-4"
                        />
                    ) : (
                        <div className="flex min-h-[420px] items-center justify-center text-sm text-slate-600">
                            输入 Mermaid 代码后会生成预览。
                        </div>
                    )}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                    这个页面不保存内容，适合临时查看流程图、复制代码，或把 SVG/PNG 链接贴到文档里。
                </p>
            </section>
        </div>
    );
}
