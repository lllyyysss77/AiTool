export type ToolCapability = 'chat' | 'image' | 'tts' | 'asr' | 'realtime' | 'file';

export interface PlaygroundProvider {
    key: string;
    name: string;
    status: 'ready' | 'next' | 'later';
    summary: string;
    focus: string[];
}

export interface PlaygroundModel {
    id: string;
    capability: ToolCapability;
    category: string;
    subtitle: string;
    metric: string;
    description: string;
    tags: string[];
}

export interface ApiLabRecipe {
    id: string;
    capability: ToolCapability;
    serviceKey: string;
    serviceName: string;
    name: string;
    description: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'WS';
    path: string;
    contentType: 'application/json' | 'multipart/form-data' | 'none';
    responseType: 'json' | 'text' | 'sse' | 'audio' | 'binary';
    defaultModel?: string;
    requestTemplate: Record<string, unknown>;
    queryTemplate?: Record<string, unknown>;
    docUrl: string;
    notes: string;
}

export interface PromptPreset {
    label: string;
    prompt: string;
}

export interface VoicePreset {
    id: string;
    label: string;
    tone: string;
    bestFor: string;
}

export const providerRoadmap: PlaygroundProvider[] = [
    {
        key: 'openai-compatible',
        name: 'OpenAI Compatible',
        status: 'ready',
        summary: '先把通用的 chat、image、audio、file 请求模板整理成可复用实验台。',
        focus: ['Chat', 'Image', 'Audio', 'Files', 'Realtime'],
    },
    {
        key: 'openai',
        name: 'OpenAI',
        status: 'next',
        summary: '后续补充 Responses、Images、Realtime 和 Embeddings 的常用请求模板。',
        focus: ['Responses', 'Images', 'Realtime', 'Embeddings'],
    },
    {
        key: 'volcengine',
        name: '火山 / 豆包',
        status: 'next',
        summary: '作为国内图像、语音和视频模型的常用供应商扩展位。',
        focus: ['Doubao', 'Seedream', 'Seedance'],
    },
    {
        key: 'elevenlabs',
        name: 'ElevenLabs',
        status: 'later',
        summary: '语音克隆、旁白和音效生成可以沉淀成独立供应商配置。',
        focus: ['Voice', 'Music', 'SFX'],
    },
];

export const providerModels: PlaygroundModel[] = [
    {
        id: 'reasoning-large',
        capability: 'chat',
        category: '推理 / 文本',
        subtitle: '复杂任务',
        metric: '长上下文 / 工具调用',
        description: '适合复杂规划、代码协作、产品分析和需要稳定工具调用的任务。',
        tags: ['推理', 'Agent', '工具调用'],
    },
    {
        id: 'chat-fast',
        capability: 'chat',
        category: '文本 / 代码',
        subtitle: '极速文本',
        metric: '低延迟',
        description: '适合摘要、翻译、改写、信息抽取和高频轻量文本任务。',
        tags: ['文本', '低延迟', '问答'],
    },
    {
        id: 'vision-chat',
        capability: 'chat',
        category: '视觉理解',
        subtitle: '图文理解',
        metric: '图片 / 视频输入',
        description: '适合图片和视频理解、社媒文案、内容问答和视觉信息提取。',
        tags: ['视觉', '视频理解', '内容提取'],
    },
    {
        id: 'image-large',
        capability: 'image',
        category: '图像生成',
        subtitle: '高质量文生图',
        metric: '产品素材 / 海报',
        description: '适合产品海报、发布图、App Store 背景和社交媒体视觉草稿。',
        tags: ['文生图', '产品素材', '社媒'],
    },
    {
        id: 'image-edit',
        capability: 'image',
        category: '图像编辑',
        subtitle: '图片编辑',
        metric: '参考图 / 局部修改',
        description: '适合基于已有图片做局部编辑、人像增强和风格转换。',
        tags: ['图片编辑', '局部修改', '增强'],
    },
    {
        id: 'tts-default',
        capability: 'tts',
        category: '语音合成',
        subtitle: '自然旁白',
        metric: '多语言 / 多音色',
        description: '适合客服、陪伴、产品旁白、日语学习听力材料和短视频配音。',
        tags: ['语音生成', '音色', '多语言'],
    },
    {
        id: 'tts-expressive',
        capability: 'tts',
        category: '语音合成',
        subtitle: '表现力增强',
        metric: '情绪 / 风格',
        description: '适合更高表现力的旁白、课程讲解和品牌内容。',
        tags: ['TTS', '情绪', '候选'],
    },
    {
        id: 'asr-default',
        capability: 'asr',
        category: '语音识别',
        subtitle: '音频转写',
        metric: '文件 / 流式',
        description: '适合语音输入、会议记录、日语学习跟读转写和素材整理。',
        tags: ['ASR', '转写', '语音输入'],
    },
    {
        id: 'asr-stream',
        capability: 'asr',
        category: '流式识别',
        subtitle: '实时字幕',
        metric: '低延迟场景',
        description: '适合实时字幕、语音控制和边说边整理的工作流。',
        tags: ['流式', '字幕', '实时'],
    },
    {
        id: 'realtime-audio',
        capability: 'realtime',
        category: '实时语音',
        subtitle: '双向语音',
        metric: '低延迟交互',
        description: '适合日语对话练习、实时语音助手和语音 Agent。',
        tags: ['Realtime', '语音对话', 'Agent'],
    },
];

export const apiLabRecipes: ApiLabRecipe[] = [
    {
        id: 'openai-compatible-chat',
        capability: 'chat',
        serviceKey: 'openai-compatible',
        serviceName: 'OpenAI Compatible',
        name: 'Chat Completions',
        description: 'OpenAI 兼容的对话接口，用来测试文本、推理和图文模型。',
        method: 'POST',
        path: '/chat/completions',
        contentType: 'application/json',
        responseType: 'json',
        defaultModel: 'chat-fast',
        requestTemplate: {
            model: 'chat-fast',
            stream: false,
            temperature: 0.7,
            messages: [
                { role: 'system', content: '你是一个专业的 AI 助手。' },
                { role: 'user', content: '请用 3 句话介绍这个接口适合调试哪些能力。' },
            ],
        },
        docUrl: 'https://platform.openai.com/docs/api-reference/chat',
        notes: '通用对话模板，后续可以按供应商复制出不同环境和模型。',
    },
    {
        id: 'openai-compatible-image-generation',
        capability: 'image',
        serviceKey: 'openai-compatible',
        serviceName: 'OpenAI Compatible',
        name: 'Image Generation',
        description: '根据 prompt 生成产品素材、视觉草图和社媒配图。',
        method: 'POST',
        path: '/images/generations',
        contentType: 'application/json',
        responseType: 'json',
        defaultModel: 'image-large',
        requestTemplate: {
            model: 'image-large',
            prompt: '未来感 AI 产品发布海报，玻璃质感，冷暖对撞光，中文主标题“AiTool 2.0”。',
            response_format: 'b64_json',
            size: '1024x1024',
        },
        docUrl: 'https://platform.openai.com/docs/api-reference/images',
        notes: '图片生成能力直接在 API Lab 中沉淀，不再单独作为工具入口。',
    },
    {
        id: 'openai-compatible-image-edits',
        capability: 'image',
        serviceKey: 'openai-compatible',
        serviceName: 'OpenAI Compatible',
        name: 'Image Edits',
        description: '上传图片并按 prompt 做整体或局部编辑。',
        method: 'POST',
        path: '/images/edits',
        contentType: 'multipart/form-data',
        responseType: 'json',
        defaultModel: 'image-edit',
        requestTemplate: {
            model: 'image-edit',
            prompt: '保持主体和构图，改成更干净的产品发布海报质感。',
            size: '1024x1024',
        },
        docUrl: 'https://platform.openai.com/docs/api-reference/images',
        notes: '适合沉淀参考图编辑、App Store 素材修图和社媒视觉调整。',
    },
    {
        id: 'openai-compatible-audio-speech',
        capability: 'tts',
        serviceKey: 'openai-compatible',
        serviceName: 'OpenAI Compatible',
        name: 'Audio Speech',
        description: '文本转语音，适合配音、日语听力材料和产品介绍旁白。',
        method: 'POST',
        path: '/audio/speech',
        contentType: 'application/json',
        responseType: 'audio',
        defaultModel: 'tts-default',
        requestTemplate: {
            model: 'tts-default',
            input: '欢迎来到 AiTool 2.0，这里会沉淀我的个人工具、模型实验和产品记录。',
            voice: 'default',
            response_format: 'mp3',
            speed: 1,
            volume: 1,
        },
        docUrl: 'https://platform.openai.com/docs/api-reference/audio',
        notes: '语音生成能力直接在 API Lab 中管理，后续按供应商补充音色配置。',
    },
    {
        id: 'openai-compatible-audio-transcriptions',
        capability: 'asr',
        serviceKey: 'openai-compatible',
        serviceName: 'OpenAI Compatible',
        name: 'Audio Transcriptions',
        description: '上传音频转写，用于学习跟读、会议记录和素材整理。',
        method: 'POST',
        path: '/audio/transcriptions',
        contentType: 'multipart/form-data',
        responseType: 'json',
        defaultModel: 'asr-default',
        requestTemplate: {
            model: 'asr-default',
            response_format: 'json',
        },
        docUrl: 'https://platform.openai.com/docs/api-reference/audio',
        notes: '后续可以拆出更细的 ASR 场景，但入口仍集中在 API Lab。',
    },
    {
        id: 'openai-compatible-realtime-audio',
        capability: 'realtime',
        serviceKey: 'openai-compatible',
        serviceName: 'OpenAI Compatible',
        name: 'Realtime Audio WS',
        description: '通过 WebSocket 做实时语音交互或流式语音任务。',
        method: 'WS',
        path: '/realtime/audio',
        contentType: 'application/json',
        responseType: 'text',
        defaultModel: 'realtime-audio',
        queryTemplate: {
            model: 'realtime-audio',
        },
        requestTemplate: {
            type: 'start',
            voice: 'default',
            text: '你好，我们开始一段日语对话练习。',
            response_format: 'mp3',
            sample_rate: 24000,
        },
        docUrl: 'https://platform.openai.com/docs/guides/realtime',
        notes: '暂时生成 wscat 命令，真正的浏览器实时链路后续独立实现。',
    },
    {
        id: 'openai-compatible-files-upload',
        capability: 'file',
        serviceKey: 'openai-compatible',
        serviceName: 'OpenAI Compatible',
        name: 'Files Upload',
        description: '上传文件并获取 file_id，供语音、ASR 或其它链路复用。',
        method: 'POST',
        path: '/files',
        contentType: 'multipart/form-data',
        responseType: 'json',
        requestTemplate: {
            purpose: 'assistants',
        },
        docUrl: 'https://platform.openai.com/docs/api-reference/files',
        notes: '通用文件上传模板；具体 purpose 和文件限制按供应商配置调整。',
    },
];

export const imagePromptPresets: PromptPreset[] = [
    {
        label: '产品发布海报',
        prompt: '未来感 AI 产品发布海报，玻璃质感，冷暖对撞光，中文主标题“AiTool 2.0”，高端品牌广告风。',
    },
    {
        label: 'App Store 截图背景',
        prompt: '干净的 iOS App Store 预览图背景，浅色玻璃拟态，留出手机截图位置，蓝灰色调，专业工具产品感。',
    },
    {
        label: '日语学习封面',
        prompt: '日语学习 App 封面图，东京清晨街道，温柔自然光，笔记、耳机、手机界面，治愈但专业。',
    },
    {
        label: 'X 分享配图',
        prompt: '适合 X 平台发布的 AI 产品进展配图，极简排版，深色文字，浅色纹理背景，一眼能看出是开发日志。',
    },
];

export const voicePresets: VoicePreset[] = [
    { id: 'default', label: '默认旁白', tone: '稳重、清晰', bestFor: '产品介绍、教程旁白' },
    { id: 'warm-female', label: '亲切女声', tone: '自然、温柔', bestFor: '学习陪伴、客服提示' },
    { id: 'bright-youth', label: '轻快青年', tone: '明亮、轻快', bestFor: '短视频、社媒内容' },
    { id: 'calm-teacher', label: '知性讲解', tone: '成熟、可信', bestFor: '课程讲解、知识类内容' },
    { id: 'brand-narrator', label: '品牌旁白', tone: '舒展、精致', bestFor: '品牌片、产品展示' },
];
