'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, ImageIcon, RefreshCcw, Sparkles } from 'lucide-react';
import { imagePromptPresets, providerModels } from '@/lib/providerLab';

type ImageMode = 'generate' | 'edit';

const imageModels = providerModels.filter((model) => model.capability === 'image');
const defaultPrompt = imagePromptPresets[0]?.prompt ?? 'AI 产品发布海报，干净、专业、有高级感。';

function shellQuote(value: string) {
    return `'${value.replace(/'/g, `'"'"'`)}'`;
}

function buildCurl(args: {
    mode: ImageMode;
    model: string;
    prompt: string;
    size: string;
}) {
    const { mode, model, prompt, size } = args;
    if (mode === 'edit') {
        return [
            'curl --location \'https://api.example.com/v1/images/edits\' \\',
            '  --request POST \\',
            '  --header \'Authorization: Bearer $MODEL_API_KEY\' \\',
            `  --form ${shellQuote(`model=${model}`)} \\`,
            `  --form ${shellQuote(`prompt=${prompt}`)} \\`,
            `  --form ${shellQuote(`size=${size}`)} \\`,
            '  --form \'image=@./source.png\'',
        ].join('\n');
    }

    const body = {
        model,
        prompt,
        response_format: 'b64_json',
        size,
    };

    return [
        'curl --location \'https://api.example.com/v1/images/generations\' \\',
        '  --request POST \\',
        '  --header \'Content-Type: application/json\' \\',
        '  --header \'Authorization: Bearer $MODEL_API_KEY\' \\',
        `  --data-raw ${shellQuote(JSON.stringify(body))}`,
    ].join('\n');
}

export default function ImageStudioClient() {
    const [mode, setMode] = useState<ImageMode>('generate');
    const [model, setModel] = useState('step-2x-large');
    const [prompt, setPrompt] = useState(defaultPrompt);
    const [size, setSize] = useState('1024x1024');
    const [sourceWeight, setSourceWeight] = useState(0.7);
    const [copied, setCopied] = useState(false);

    const selectedModel = imageModels.find((item) => item.id === model) ?? imageModels[0];
    const curlPreview = useMemo(
        () => buildCurl({ mode, model, prompt, size }),
        [mode, model, prompt, size],
    );

    async function copyCurl() {
        await navigator.clipboard.writeText(curlPreview);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    }

    return (
        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
            <section className="space-y-5">
                <div className="rounded-[34px] border border-slate-900/10 bg-white/[0.84] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                                Image Setup
                            </div>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                                先做素材请求编排
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                这版先把 API Lab 的图像模型和 Prompt 预设整理进来，后续再接真实运行、历史记录和 App Store 素材批处理。
                            </p>
                        </div>
                        <ImageIcon size={28} className="text-slate-400" />
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setMode('generate')}
                            className={`rounded-[24px] border p-4 text-left transition ${mode === 'generate' ? 'border-slate-900 bg-slate-950 text-white shadow-[0_16px_42px_rgba(15,23,42,0.18)]' : 'border-slate-900/10 bg-slate-50 text-slate-700 hover:bg-white'}`}
                        >
                            <span className="text-sm font-black">文生图</span>
                            <span className={mode === 'generate' ? 'mt-1 block text-xs leading-5 text-white/65' : 'mt-1 block text-xs leading-5 text-slate-500'}>
                                产品海报、App Store 背景、X 配图。
                            </span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMode('edit');
                                setModel('step-1x-edit');
                            }}
                            className={`rounded-[24px] border p-4 text-left transition ${mode === 'edit' ? 'border-slate-900 bg-slate-950 text-white shadow-[0_16px_42px_rgba(15,23,42,0.18)]' : 'border-slate-900/10 bg-slate-50 text-slate-700 hover:bg-white'}`}
                        >
                            <span className="text-sm font-black">图片编辑</span>
                            <span className={mode === 'edit' ? 'mt-1 block text-xs leading-5 text-white/65' : 'mt-1 block text-xs leading-5 text-slate-500'}>
                                基于原图做风格转换、局部调整。
                            </span>
                        </button>
                    </div>

                    <label className="mt-5 block rounded-[24px] border border-slate-900/10 bg-slate-50/85 p-4">
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Model</span>
                        <select
                            value={model}
                            onChange={(event) => setModel(event.target.value)}
                            className="mt-2 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
                        >
                            {imageModels.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.id} · {item.subtitle}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="mt-4 block rounded-[24px] border border-slate-900/10 bg-slate-50/85 p-4">
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Prompt</span>
                        <textarea
                            value={prompt}
                            onChange={(event) => setPrompt(event.target.value)}
                            className="mt-3 min-h-[180px] w-full resize-y bg-transparent text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400"
                            placeholder="写下你要生成的画面、风格、文字、构图..."
                        />
                    </label>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <label className="block rounded-[24px] border border-slate-900/10 bg-slate-50/85 p-4">
                            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Size</span>
                            <select
                                value={size}
                                onChange={(event) => setSize(event.target.value)}
                                className="mt-2 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
                            >
                                <option value="1024x1024">1024 x 1024</option>
                                <option value="1024x1536">1024 x 1536</option>
                                <option value="1536x1024">1536 x 1024</option>
                            </select>
                        </label>
                        <label className="block rounded-[24px] border border-slate-900/10 bg-slate-50/85 p-4">
                            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">I2I Weight</span>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.1"
                                value={sourceWeight}
                                onChange={(event) => setSourceWeight(Number(event.target.value))}
                                className="mt-3 w-full accent-slate-900"
                            />
                            <div className="mt-1 text-sm font-black text-slate-700">{sourceWeight.toFixed(1)} · 图生图预留</div>
                        </label>
                    </div>
                </div>

                <div className="rounded-[34px] border border-slate-900/10 bg-white/[0.78] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur md:p-6">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                        <Sparkles size={15} />
                        Prompt Presets
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {imagePromptPresets.map((preset) => (
                            <button
                                key={preset.label}
                                type="button"
                                onClick={() => setPrompt(preset.prompt)}
                                className="rounded-[22px] border border-slate-900/10 bg-white/80 p-4 text-left transition hover:border-slate-900/20 hover:bg-white"
                            >
                                <div className="text-sm font-black text-slate-900">{preset.label}</div>
                                <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-500">{preset.prompt}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="space-y-5">
                <div className="rounded-[34px] border border-slate-900/10 bg-white/[0.86] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                                Request Preview
                            </div>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                                {selectedModel?.id ?? model}
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-slate-600">{selectedModel?.description}</p>
                        </div>
                        <button
                            type="button"
                            onClick={copyCurl}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800"
                        >
                            {copied ? <Check size={15} /> : <Copy size={15} />}
                            {copied ? '已复制' : '复制 cURL'}
                        </button>
                    </div>
                    <pre className="mt-5 min-h-[420px] overflow-auto rounded-[26px] bg-[#0b1220] p-5 text-xs leading-6 text-cyan-50">
                        <code>{curlPreview}</code>
                    </pre>
                </div>

                <div className="rounded-[34px] border border-slate-900/10 bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)] md:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-black tracking-tight text-slate-900">后续接入顺序</h3>
                        <button
                            type="button"
                            onClick={() => {
                                setPrompt(defaultPrompt);
                                setMode('generate');
                                setModel('step-2x-large');
                                setSize('1024x1024');
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-600 transition hover:text-slate-900"
                        >
                            <RefreshCcw size={13} />
                            重置
                        </button>
                    </div>
                    <div className="mt-4 grid gap-3">
                        {['接 API Lab runner，支持真实生成和错误记录。', '加入 App Store 预览图尺寸模板与批量导出。', '把历史 prompt、生成结果和产品素材库关联起来。'].map((item, index) => (
                            <div key={item} className="flex items-center gap-3 rounded-[20px] border border-white/70 bg-white/72 p-4">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
                                    {index + 1}
                                </span>
                                <span className="text-sm font-semibold text-slate-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
