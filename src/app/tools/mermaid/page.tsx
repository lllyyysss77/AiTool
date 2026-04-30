import { Code2 } from 'lucide-react';
import MermaidToolClient from './MermaidToolClient';

export default function MermaidToolPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(226,232,240,0.9),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-10 text-slate-900 md:px-8 md:py-14">
            <section className="mx-auto max-w-7xl">
                <div className="rounded-[42px] border border-slate-900/10 bg-[linear-gradient(135deg,#0f172a_0%,#334155_100%)] p-6 text-white shadow-[0_28px_100px_rgba(15,23,42,0.18)] md:p-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-bold text-slate-200">
                        <Code2 size={16} />
                        Mermaid Lab
                    </div>
                    <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
                        临时画流程图、架构图和产品路线。
                    </h1>
                    <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200/85 md:text-lg">
                        输入 Mermaid 代码，页面会生成 mermaid.ink 在线 SVG/PNG 预览链接。适合写 PR 说明、产品设计、流程拆解和技术文档。
                    </p>
                </div>
            </section>

            <section className="mx-auto mt-8 max-w-7xl">
                <MermaidToolClient />
            </section>
        </main>
    );
}
