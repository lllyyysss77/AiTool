'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, Copy, ExternalLink, FileCode2, Network, RefreshCcw, Search } from 'lucide-react';
import {
    apiLabRecipes,
    providerModels,
    providerRoadmap,
    type ApiLabRecipe,
    type ToolCapability,
} from '@/lib/providerLab';

type CapabilityFilter = ToolCapability | 'all';

const capabilityOptions: { key: CapabilityFilter; label: string; hint: string }[] = [
    { key: 'all', label: '全部', hint: '看完整接口盘点' },
    { key: 'chat', label: '文本', hint: 'LLM / Agent' },
    { key: 'image', label: '图像', hint: '生成 / 编辑' },
    { key: 'tts', label: 'TTS', hint: '配音 / 音色' },
    { key: 'asr', label: 'ASR', hint: '转写 / 字幕' },
    { key: 'realtime', label: '实时', hint: 'WS / 语音' },
    { key: 'file', label: '文件', hint: '上传 / file_id' },
];

function normalizeCapability(value: string | null | undefined): CapabilityFilter {
    if (
        value === 'chat' ||
        value === 'image' ||
        value === 'tts' ||
        value === 'asr' ||
        value === 'realtime' ||
        value === 'file'
    ) {
        return value;
    }

    return 'all';
}

function getFirstRecipeId(capability: CapabilityFilter) {
    return (
        apiLabRecipes.find((recipe) => capability === 'all' || recipe.capability === capability)?.id ??
        apiLabRecipes[0]?.id ??
        ''
    );
}

function prettyJson(value: Record<string, unknown>) {
    return JSON.stringify(value, null, 2);
}

function parseObject(text: string) {
    try {
        const parsed = JSON.parse(text) as unknown;
        if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
            return { value: {}, error: 'JSON 顶层需要是对象。' };
        }
        return { value: parsed as Record<string, unknown>, error: '' };
    } catch (error) {
        return { value: {}, error: error instanceof Error ? error.message : 'JSON 格式错误。' };
    }
}

function shellQuote(value: string) {
    return `'${value.replace(/'/g, `'"'"'`)}'`;
}

function normalizeBaseUrl(value: string) {
    return value.trim().replace(/\/+$/, '');
}

function toWsBaseUrl(value: string) {
    if (value.startsWith('wss://') || value.startsWith('ws://')) return value;
    if (value.startsWith('https://')) return value.replace(/^https:\/\//, 'wss://');
    if (value.startsWith('http://')) return value.replace(/^http:\/\//, 'ws://');
    return value;
}

function buildCurl(recipe: ApiLabRecipe, baseUrl: string, apiKey: string, bodyText: string) {
    const parsed = parseObject(bodyText);
    const safeBaseUrl = normalizeBaseUrl(baseUrl || 'https://api.example.com/v1');
    const token = apiKey.trim() || '$MODEL_API_KEY';

    if (parsed.error) {
        return `# JSON 当前有错误：${parsed.error}`;
    }

    if (recipe.method === 'WS') {
        const wsUrl = new URL(`${normalizeBaseUrl(toWsBaseUrl(safeBaseUrl))}${recipe.path}`);
        Object.entries(recipe.queryTemplate ?? {}).forEach(([key, value]) => {
            wsUrl.searchParams.set(key, String(value));
        });
        return [
            `wscat -c ${shellQuote(wsUrl.toString())} -H ${shellQuote(`Authorization: Bearer ${token}`)}`,
            '',
            '# 连接成功后发送：',
            prettyJson(parsed.value),
        ].join('\n');
    }

    const url = `${safeBaseUrl}${recipe.path}`;
    const parts = ['curl', '--location', shellQuote(url), '--request', recipe.method];

    if (recipe.contentType !== 'none' && recipe.contentType !== 'multipart/form-data') {
        parts.push('--header', shellQuote(`Content-Type: ${recipe.contentType}`));
    }
    parts.push('--header', shellQuote(`Authorization: Bearer ${token}`));

    if (recipe.contentType === 'application/json' && recipe.method !== 'GET') {
        parts.push('--data-raw', shellQuote(JSON.stringify(parsed.value)));
    }

    if (recipe.contentType === 'multipart/form-data') {
        Object.entries(parsed.value).forEach(([key, value]) => {
            parts.push('--form', shellQuote(`${key}=${typeof value === 'string' ? value : JSON.stringify(value)}`));
        });
        parts.push('--form', shellQuote(recipe.capability === 'file' ? 'file=@./demo.pdf' : 'file=@./demo.wav'));
    }

    if (recipe.responseType === 'audio' || recipe.responseType === 'binary') {
        parts.push('--output', shellQuote(recipe.responseType === 'audio' ? 'response.mp3' : 'response.bin'));
    }

    return parts.join(' \\\n  ');
}

function statusLabel(status: (typeof providerRoadmap)[number]['status']) {
    if (status === 'ready') return '已接入';
    if (status === 'next') return '下一批';
    return '待排期';
}

export default function ApiLabWorkbench() {
    const searchParams = useSearchParams();
    const initialCapability = normalizeCapability(searchParams?.get('capability'));
    const [capability, setCapability] = useState<CapabilityFilter>(initialCapability);
    const [query, setQuery] = useState('');
    const [selectedId, setSelectedId] = useState(getFirstRecipeId(initialCapability));
    const [baseUrl, setBaseUrl] = useState('https://api.example.com/v1');
    const [apiKey, setApiKey] = useState('$MODEL_API_KEY');
    const selectedRecipe = apiLabRecipes.find((recipe) => recipe.id === selectedId) ?? apiLabRecipes[0];
    const [bodyText, setBodyText] = useState(prettyJson(selectedRecipe.requestTemplate));
    const [copied, setCopied] = useState(false);

    const filteredRecipes = useMemo(() => {
        const normalized = query.trim().toLowerCase();
        return apiLabRecipes.filter((recipe) => {
            const matchCapability = capability === 'all' || recipe.capability === capability;
            if (!matchCapability) return false;
            if (!normalized) return true;
            return [recipe.name, recipe.description, recipe.path, recipe.serviceName, recipe.notes]
                .join(' ')
                .toLowerCase()
                .includes(normalized);
        });
    }, [capability, query]);

    const visibleModels = useMemo(() => {
        if (capability === 'all') return providerModels;
        return providerModels.filter((model) => model.capability === capability || (capability === 'file' && model.capability === 'tts'));
    }, [capability]);

    const curlPreview = useMemo(
        () => buildCurl(selectedRecipe, baseUrl, apiKey, bodyText),
        [apiKey, baseUrl, bodyText, selectedRecipe],
    );

    useEffect(() => {
        if (!filteredRecipes.some((recipe) => recipe.id === selectedId)) {
            const nextRecipe = filteredRecipes[0] ?? apiLabRecipes[0];
            setSelectedId(nextRecipe.id);
        }
    }, [filteredRecipes, selectedId]);

    useEffect(() => {
        setBodyText(prettyJson(selectedRecipe.requestTemplate));
    }, [selectedRecipe]);

    async function copyCurl() {
        await navigator.clipboard.writeText(curlPreview);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
    }

    return (
        <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
            <section className="space-y-5">
                <div className="rounded-[34px] border border-slate-900/10 bg-white/[0.84] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                                Provider Roadmap
                            </div>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                                先用通用模板，再按供应商扩展
                            </h2>
                        </div>
                        <Network size={26} className="text-slate-400" />
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {providerRoadmap.map((provider) => (
                            <article key={provider.key} className="rounded-[24px] border border-slate-900/10 bg-slate-50/80 p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-base font-black text-slate-900">{provider.name}</h3>
                                        <p className="mt-2 text-xs leading-5 text-slate-600">{provider.summary}</p>
                                    </div>
                                    <span className="rounded-full border border-slate-900/10 bg-white px-2.5 py-1 text-[10px] font-black text-slate-600">
                                        {statusLabel(provider.status)}
                                    </span>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                    {provider.focus.map((item) => (
                                        <span key={item} className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-slate-500">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="rounded-[34px] border border-slate-900/10 bg-white/[0.84] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
                    <div className="flex flex-wrap gap-2">
                        {capabilityOptions.map((option) => (
                            <button
                                key={option.key}
                                type="button"
                                onClick={() => setCapability(option.key)}
                                className={`rounded-full border px-4 py-2 text-left transition ${
                                    capability === option.key
                                        ? 'border-slate-900 bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)]'
                                        : 'border-slate-900/10 bg-white/75 text-slate-600 hover:bg-white hover:text-slate-900'
                                }`}
                            >
                                <span className="block text-sm font-black">{option.label}</span>
                                <span className={capability === option.key ? 'block text-[10px] text-white/65' : 'block text-[10px] text-slate-400'}>
                                    {option.hint}
                                </span>
                            </button>
                        ))}
                    </div>

                    <label className="mt-5 flex items-center gap-2 rounded-[22px] border border-slate-900/10 bg-slate-50/90 px-4 py-3">
                        <Search size={16} className="text-slate-400" />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="搜索接口、路径、说明..."
                            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                        />
                    </label>

                    <div className="mt-5 space-y-3">
                        {filteredRecipes.map((recipe) => (
                            <button
                                key={recipe.id}
                                type="button"
                                onClick={() => setSelectedId(recipe.id)}
                                className={`block w-full rounded-[26px] border p-4 text-left transition ${
                                    selectedRecipe.id === recipe.id
                                        ? 'border-slate-900 bg-slate-950 text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)]'
                                        : 'border-slate-900/10 bg-white/72 text-slate-700 hover:border-slate-900/20 hover:bg-white'
                                }`}
                            >
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={selectedRecipe.id === recipe.id ? 'rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-black text-white' : 'rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-500'}>
                                        {recipe.method}
                                    </span>
                                    <span className="text-sm font-black">{recipe.name}</span>
                                </div>
                                <p className={selectedRecipe.id === recipe.id ? 'mt-2 text-xs leading-5 text-white/70' : 'mt-2 text-xs leading-5 text-slate-500'}>
                                    {recipe.description}
                                </p>
                                <div className={selectedRecipe.id === recipe.id ? 'mt-3 font-mono text-xs text-cyan-100' : 'mt-3 font-mono text-xs text-slate-400'}>
                                    {recipe.path}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="space-y-5">
                <div className="rounded-[34px] border border-slate-900/10 bg-white/[0.86] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                                Request Builder
                            </div>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                                {selectedRecipe.name}
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                                {selectedRecipe.notes}
                            </p>
                        </div>
                        <a
                            href={selectedRecipe.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-slate-50 px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-white hover:text-slate-900"
                        >
                            文档
                            <ExternalLink size={14} />
                        </a>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
                        <label className="block rounded-[24px] border border-slate-900/10 bg-slate-50/85 p-4">
                            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Base URL</span>
                            <input
                                value={baseUrl}
                                onChange={(event) => setBaseUrl(event.target.value)}
                                className="mt-2 w-full bg-transparent font-mono text-sm font-semibold text-slate-800 outline-none"
                            />
                        </label>
                        <label className="block rounded-[24px] border border-slate-900/10 bg-slate-50/85 p-4">
                            <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">API Key</span>
                            <input
                                value={apiKey}
                                onChange={(event) => setApiKey(event.target.value)}
                                className="mt-2 w-full bg-transparent font-mono text-sm font-semibold text-slate-800 outline-none"
                            />
                        </label>
                    </div>

                    <div className="mt-5 grid gap-4 lg:grid-cols-2">
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="text-sm font-black text-slate-700">请求体</span>
                                <button
                                    type="button"
                                    onClick={() => setBodyText(prettyJson(selectedRecipe.requestTemplate))}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-white px-3 py-1.5 text-xs font-black text-slate-500 transition hover:text-slate-900"
                                >
                                    <RefreshCcw size={13} />
                                    重置
                                </button>
                            </div>
                            <textarea
                                value={bodyText}
                                onChange={(event) => setBodyText(event.target.value)}
                                spellCheck={false}
                                className="min-h-[360px] w-full resize-y rounded-[24px] border border-slate-900/10 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100 outline-none ring-0 transition focus:border-cyan-300"
                            />
                        </div>
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <span className="text-sm font-black text-slate-700">cURL 预览</span>
                                <button
                                    type="button"
                                    onClick={copyCurl}
                                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-slate-950 px-3 py-1.5 text-xs font-black text-white transition hover:bg-slate-800"
                                >
                                    {copied ? <Check size={13} /> : <Copy size={13} />}
                                    {copied ? '已复制' : '复制'}
                                </button>
                            </div>
                            <pre className="min-h-[360px] overflow-auto rounded-[24px] border border-slate-900/10 bg-[#0b1220] p-4 text-xs leading-6 text-cyan-50">
                                <code>{curlPreview}</code>
                            </pre>
                        </div>
                    </div>
                </div>

                <div className="rounded-[34px] border border-slate-900/10 bg-white/[0.78] p-5 shadow-[0_18px_55px_rgba(15,23,42,0.07)] backdrop-blur md:p-6">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                        <FileCode2 size={15} />
                        Model Registry Snapshot
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {visibleModels.slice(0, 8).map((model) => (
                            <article key={model.id} className="rounded-[22px] border border-slate-900/10 bg-white/74 p-4">
                                <div className="font-mono text-xs font-black text-slate-900">{model.id}</div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {[model.category, model.subtitle, model.metric].map((item) => (
                                        <span key={item} className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                                            {item}
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-3 text-xs leading-5 text-slate-500">{model.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
