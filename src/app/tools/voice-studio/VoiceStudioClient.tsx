'use client';

import { useMemo, useState } from 'react';
import { Check, Copy, Mic2, RefreshCcw, Volume2 } from 'lucide-react';
import { providerModels, voicePresets } from '@/lib/providerLab';

const ttsModels = providerModels.filter((model) => model.capability === 'tts');
const defaultText = '欢迎来到 AiTool 2.0。这里会沉淀我的个人工具、模型实验、产品记录和日常工作方法。';

function shellQuote(value: string) {
    return "'" + value.replace(/'/g, "'\"'\"'") + "'";
}

function buildCurl(args: {
    model: string;
    voice: string;
    input: string;
    speed: number;
    volume: number;
    format: string;
}) {
    const body = {
        model: args.model,
        input: args.input,
        voice: args.voice,
        speed: args.speed,
        volume: args.volume,
        response_format: args.format,
    };

    return [
        'curl --location \'https://api.example.com/v1/audio/speech\' \\',
        '  --request POST \\',
        '  --header \'Content-Type: application/json\' \\',
        '  --header \'Authorization: Bearer $MODEL_API_KEY\' \\',
        `  --data-raw ${shellQuote(JSON.stringify(body))} \\`,
        `  --output ${shellQuote(`voice-preview.${args.format}`)}`,
    ].join('\n');
}

export default function VoiceStudioClient() {
    const [model, setModel] = useState('step-tts-mini');
    const [voice, setVoice] = useState(voicePresets[0]?.id ?? 'cixingnansheng');
    const [input, setInput] = useState(defaultText);
    const [speed, setSpeed] = useState(1);
    const [volume, setVolume] = useState(1);
    const [format, setFormat] = useState('mp3');
    const [copied, setCopied] = useState(false);

    const currentVoice = voicePresets.find((item) => item.id === voice) ?? voicePresets[0];
    const currentModel = ttsModels.find((item) => item.id === model) ?? ttsModels[0];
    const curlPreview = useMemo(
        () => buildCurl({ model, voice, input, speed, volume, format }),
        [format, input, model, speed, voice, volume],
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
                                Voice Setup
                            </div>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                                语音工具先统一到 Voice Studio
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                不再从工具菜单跳旧 TTS 页面。这里先整理 API Lab 的语音模型、音色和请求模板，后面再接真实生成、音频历史和批量配音。
                            </p>
                        </div>
                        <Mic2 size={28} className="text-slate-400" />
                    </div>

                    <label className="mt-5 block rounded-[24px] border border-slate-900/10 bg-slate-50/85 p-4">
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Model</span>
                        <select
                            value={model}
                            onChange={(event) => setModel(event.target.value)}
                            className="mt-2 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
                        >
                            {ttsModels.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.id} · {item.subtitle}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="mt-4 block rounded-[24px] border border-slate-900/10 bg-slate-50/85 p-4">
                        <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Script</span>
                        <textarea
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            className="mt-3 min-h-[190px] w-full resize-y bg-transparent text-sm leading-7 text-slate-800 outline-none placeholder:text-slate-400"
                            placeholder="输入要合成的文案..."
                        />
                    </label>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <label className="block rounded-[24px] border border-slate-900/10 bg-slate-50/85 p-4">
                            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Format</span>
                            <select
                                value={format}
                                onChange={(event) => setFormat(event.target.value)}
                                className="mt-2 w-full bg-transparent text-sm font-black text-slate-800 outline-none"
                            >
                                <option value="mp3">mp3</option>
                                <option value="wav">wav</option>
                                <option value="opus">opus</option>
                            </select>
                        </label>
                        <label className="block rounded-[24px] border border-slate-900/10 bg-slate-50/85 p-4">
                            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Speed</span>
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={speed}
                                onChange={(event) => setSpeed(Number(event.target.value))}
                                className="mt-3 w-full accent-slate-900"
                            />
                            <div className="mt-1 text-sm font-black text-slate-700">{speed.toFixed(1)}</div>
                        </label>
                        <label className="block rounded-[24px] border border-slate-900/10 bg-slate-50/85 p-4">
                            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Volume</span>
                            <input
                                type="range"
                                min="0.1"
                                max="2"
                                step="0.1"
                                value={volume}
                                onChange={(event) => setVolume(Number(event.target.value))}
                                className="mt-3 w-full accent-slate-900"
                            />
                            <div className="mt-1 text-sm font-black text-slate-700">{volume.toFixed(1)}</div>
                        </label>
                    </div>
                </div>

                <div className="rounded-[34px] border border-slate-900/10 bg-white/[0.78] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur md:p-6">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                        <Volume2 size={15} />
                        Voice Presets
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {voicePresets.map((preset) => (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => setVoice(preset.id)}
                                className={`rounded-[22px] border p-4 text-left transition ${voice === preset.id ? 'border-slate-900 bg-slate-950 text-white shadow-[0_16px_38px_rgba(15,23,42,0.16)]' : 'border-slate-900/10 bg-white/80 text-slate-700 hover:bg-white'}`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm font-black">{preset.label}</span>
                                    <span className={voice === preset.id ? 'font-mono text-[10px] text-white/55' : 'font-mono text-[10px] text-slate-400'}>
                                        {preset.id}
                                    </span>
                                </div>
                                <p className={voice === preset.id ? 'mt-2 text-xs leading-5 text-white/68' : 'mt-2 text-xs leading-5 text-slate-500'}>
                                    {preset.tone} · {preset.bestFor}
                                </p>
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
                                {currentVoice?.label ?? voice}
                            </h2>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                {currentModel?.description} 当前页面只做新工具台和请求预览，真实生成会接 API Lab runner 或专用 TTS API。
                            </p>
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
                                setInput(defaultText);
                                setVoice(voicePresets[0]?.id ?? 'cixingnansheng');
                                setSpeed(1);
                                setVolume(1);
                                setFormat('mp3');
                            }}
                            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-600 transition hover:text-slate-900"
                        >
                            <RefreshCcw size={13} />
                            重置
                        </button>
                    </div>
                    <div className="mt-4 grid gap-3">
                        {['接真实 TTS 生成，结果直接内嵌播放器。', '把常用旁白、学习材料、X 视频文案做成模板。', '接 ElevenLabs / OpenAI / 豆包音色，统一音色资产管理。'].map((item, index) => (
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
