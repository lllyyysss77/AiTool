import type { LucideIcon } from 'lucide-react';
import { FileText, Headphones, ListChecks, ShieldCheck, Trash2 } from 'lucide-react';

export const supportEmail = 'support@owenshen.top';
export const legalUpdatedAt = '2026-05-01';
export const siteBaseUrl = 'https://owenshen.top';

export interface AppStoreUrlItem {
    title: string;
    href: string;
    url: string;
    description: string;
    requiredFor: string;
    icon: LucideIcon;
}

export const appStoreUrls: AppStoreUrlItem[] = [
    {
        title: '隐私政策 URL',
        href: '/legal/apple-privacy',
        url: `${siteBaseUrl}/legal/apple-privacy`,
        description: '说明 App 会处理哪些数据、用途、第三方服务、保留周期和用户权利。',
        requiredFor: 'App Store Connect 必填',
        icon: ShieldCheck,
    },
    {
        title: '支持 URL',
        href: '/support',
        url: `${siteBaseUrl}/support`,
        description: '给审核人员和用户查看功能说明、联系方式、FAQ、问题反馈方式。',
        requiredFor: 'App Store Connect 必填',
        icon: Headphones,
    },
    {
        title: '使用条款 URL',
        href: '/legal/terms',
        url: `${siteBaseUrl}/legal/terms`,
        description: '说明账号、AI 生成内容、订阅、禁止行为、免责声明和终止条款。',
        requiredFor: '订阅/付费/账号型产品建议填写',
        icon: FileText,
    },
    {
        title: '数据与账号删除说明',
        href: '/legal/data-deletion',
        url: `${siteBaseUrl}/legal/data-deletion`,
        description: '说明如何删除账号、学习历史、音频、图片、云端数据和本地缓存。',
        requiredFor: '有账号系统时必须在 App 内提供删除入口',
        icon: Trash2,
    },
    {
        title: '上架材料清单',
        href: '/legal/app-store-checklist',
        url: `${siteBaseUrl}/legal/app-store-checklist`,
        description: '整理审核信息、隐私标签、元数据、截图、年龄分级和测试账号。',
        requiredFor: '内部准备页',
        icon: ListChecks,
    },
];

export const japaneseLearningAppName = '日语同传与跟读 App';

