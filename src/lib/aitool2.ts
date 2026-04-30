import type { LucideIcon } from 'lucide-react';
import {
    Brain,
    Code2,
    Compass,
    FileText,
    Layers,
    Link2,
    Network,
    NotebookPen,
    PackageOpen,
    ShieldCheck,
    Headphones,
    Wrench,
} from 'lucide-react';

export interface AitoolRouteItem {
    title: string;
    description: string;
    href: string;
    tag: string;
    accent: string;
    external?: boolean;
    icon: LucideIcon;
}

export interface PersonalProductItem {
    title: string;
    status: string;
    description: string;
    audience: string;
    href: string;
    privacyHref: string;
    supportHref: string;
    termsHref: string;
    stack: string[];
}

export interface PersonalNoteItem {
    title: string;
    label: string;
    body: string;
}

export const aitool2Principles = [
    '工具不是越多越好，要能被我每天想起来、点得进去、用得顺手。',
    '供应商、模型、API、素材、产品说明和隐私政策都应该在一个地方被整理。',
    '记录不需要一开始就结构完美，先把想法、发现和产品判断收进来。',
    '个人工作网站既是工具箱，也是产品目录、笔记本和对外说明页。',
];

export const personalToolbox: AitoolRouteItem[] = [
    {
        title: 'StepFun 文件管理',
        description: '保留老服务的核心能力：按用途查询 StepFun 文件、分页查看、批量删除。',
        href: '/stepfun/file',
        tag: '保留功能',
        accent: 'bg-amber-100 text-amber-900 border-amber-200',
        icon: FileText,
    },
    {
        title: 'Mermaid 在线查看',
        description: '临时画流程、架构和路线图，生成可复制代码与在线 SVG 预览链接。',
        href: '/tools/mermaid',
        tag: '新工具',
        accent: 'bg-cyan-100 text-cyan-900 border-cyan-200',
        icon: Code2,
    },
    {
        title: 'API Lab',
        description: '集中整理模型供应商接口、请求样例、图片/语音能力和 cURL 模板。',
        href: '/tools/api-lab',
        tag: '模型实验室',
        accent: 'bg-slate-100 text-slate-900 border-slate-200',
        icon: Network,
    },
];

export const personalSites: AitoolRouteItem[] = [
    {
        title: '个人主页',
        description: 'AiTool 2.0 的总入口：工具、产品、记录、链接和隐私政策都从这里分流。',
        href: '/',
        tag: 'home',
        accent: 'bg-stone-100 text-stone-900 border-stone-200',
        icon: Compass,
    },
    {
        title: '工具目录',
        description: '把日常工具按供应商、生成、文件、研发辅助重新整理。',
        href: '/tools',
        tag: 'tools',
        accent: 'bg-cyan-100 text-cyan-900 border-cyan-200',
        icon: Wrench,
    },
    {
        title: '产品与隐私政策',
        description: '个人产品介绍、App Store 审核 URL 和发布说明的固定入口。',
        href: '/products',
        tag: 'products',
        accent: 'bg-amber-100 text-amber-900 border-amber-200',
        icon: PackageOpen,
    },
    {
        title: 'App 支持页面',
        description: '给 App Store Connect 填写的 Support URL，包含联系方式、FAQ 和数据删除入口。',
        href: '/support',
        tag: 'support',
        accent: 'bg-emerald-100 text-emerald-900 border-emerald-200',
        icon: Headphones,
    },
    {
        title: '想法与记录',
        description: '随手发现、产品判断、模型体验和个人工作方法的收纳页。',
        href: '/notes',
        tag: 'notes',
        accent: 'bg-lime-100 text-lime-900 border-lime-200',
        icon: NotebookPen,
    },
    {
        title: '常用链接',
        description: '个人站点路径、GitHub、Demo、部署后要给别人看的链接。',
        href: '/links',
        tag: 'links',
        accent: 'bg-sky-100 text-sky-900 border-sky-200',
        icon: Link2,
    },
];

export const personalProducts: PersonalProductItem[] = [
    {
        title: '日语同传与跟读 App',
        status: 'App Store 准备中',
        description: '面向中文用户的日语学习工具，聚焦同传、影子跟读、场景对练和学习历史沉淀。',
        audience: '日语学习者、需要临场理解日语内容的人',
        href: '/products#japanese-learning-app',
        privacyHref: '/legal/apple-privacy',
        supportHref: '/support',
        termsHref: '/legal/terms',
        stack: ['iOS', 'ASR', 'TTS', 'Shadowing', '学习记录'],
    },
    {
        title: 'AiTool 2.0',
        status: '重构中',
        description: '个人工具与工作网站，把模型供应商、API 实验、在线小工具、产品介绍和想法记录放在一起。',
        audience: '我自己、协作者、需要查看产品/隐私说明的人',
        href: '/',
        privacyHref: '/legal/apple-privacy',
        supportHref: '/support',
        termsHref: '/legal/terms',
        stack: ['Next.js', '工具箱', '个人站点', '产品说明'],
    },
];

export const thoughtNotes: PersonalNoteItem[] = [
    {
        title: '个人工具站应该像杂物盘，但入口要清楚',
        label: 'Product Thought',
        body: 'AiTool 2.0 不追求像 SaaS 官网一样单一，而是把我每天真实会用的入口摆出来：模型、文件、图、语音、流程图、产品说明、隐私政策。',
    },
    {
        title: '模型供应商需要被当成资产管理',
        label: 'Model Ops',
        body: '语音、图片、LLM、文件接口经常散在不同平台。更好的方式是把供应商、模型名、用途、价格、样例和常见错误都放到工具站里。',
    },
    {
        title: '记录先低摩擦，再慢慢结构化',
        label: 'Record',
        body: '随手发现的东西如果一开始就要求分类完美，最后就不会记录。先有一个可以放进去的地方，再逐步整理成产品思想、实验记录和复用模板。',
    },
];

export const siteSections = [
    {
        title: '工具',
        description: '文件、Mermaid、API、模型供应商和生成工作流。',
        href: '/tools',
        icon: Wrench,
    },
    {
        title: '产品',
        description: '个人产品介绍、发布状态、App Store 隐私政策 URL。',
        href: '/products',
        icon: PackageOpen,
    },
    {
        title: '记录',
        description: '产品思想、模型体验、随手发现和日常判断。',
        href: '/notes',
        icon: Brain,
    },
    {
        title: '链接',
        description: '个人站点路径、GitHub、Demo 和对外说明页。',
        href: '/links',
        icon: Layers,
    },
    {
        title: '隐私政策',
        description: '给 Apple App Store Connect 使用的隐私政策 URL。',
        href: '/legal/apple-privacy',
        icon: ShieldCheck,
    },
    {
        title: '支持',
        description: 'App Store Connect 使用的 Support URL。',
        href: '/support',
        icon: Headphones,
    },
];
