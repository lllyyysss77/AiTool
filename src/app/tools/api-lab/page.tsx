import { Network } from 'lucide-react';
import ApiLabWorkbench from './ApiLabWorkbench';

const integrationNotes = [
    {
        title: '一个入口管理多种能力',
        body: '图片、语音、文本、文件和实时接口都放进同一个实验台，不再拆成多个零散工具。',
    },
    {
        title: '页面按 AiTool 2.0 重写',
        body: '新 API Lab 统一使用当前顶部导航的玻璃风格，作为个人工具箱里的模型接口实验室。',
    },
    {
        title: '供应商后续可扩展',
        body: '默认先用通用 OpenAI-compatible 模板承载，后面按需要补 OpenAI、豆包、ElevenLabs 等具体供应商配置。',
    },
];

export default function ApiLabToolPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(226,232,240,0.9),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-10 text-slate-900 md:px-8 md:py-14">
            <section className="mx-auto max-w-7xl">
                <div className="relative overflow-hidden rounded-[42px] border border-slate-900/10 bg-[linear-gradient(135deg,#0f172a_0%,#334155_100%)] p-6 text-white shadow-[0_28px_100px_rgba(15,23,42,0.18)] md:p-10">
                    <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-cyan-300/[0.16] blur-3xl" />
                    <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-amber-300/[0.12] blur-3xl" />
                    <div className="relative">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-bold text-slate-200">
                            <Network size={16} />
                            API Lab 2.0
                        </div>
                        <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
                            一个统一的模型接口实验室。
                        </h1>
                        <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200/85 md:text-lg">
                            把常用供应商的模型、接口、请求模板和 cURL 预览集中到一个页面。图片生成、语音合成、ASR、文本对话和文件上传都在这里统一编排。
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-6 grid max-w-7xl gap-4 md:grid-cols-3">
                {integrationNotes.map((note) => (
                    <article key={note.title} className="rounded-[30px] border border-slate-900/10 bg-white/[0.82] p-5 shadow-[0_16px_45px_rgba(15,23,42,0.07)] backdrop-blur">
                        <h2 className="text-lg font-black tracking-tight text-slate-900">{note.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{note.body}</p>
                    </article>
                ))}
            </section>

            <section className="mx-auto mt-8 max-w-7xl">
                <ApiLabWorkbench />
            </section>
        </main>
    );
}
