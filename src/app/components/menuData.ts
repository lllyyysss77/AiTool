export interface MenuItem {
    title: string;
    href?: string;
    children?: MenuItem[];
}

export const menuData: MenuItem[] = [
    { title: '首页', href: '/' },
    {
        title: '工具',
        href: '/tools',
        children: [
            { title: '工具目录', href: '/tools' },
            { title: 'StepFun 文件管理', href: '/stepfun/file' },
            { title: 'Mermaid 在线查看', href: '/tools/mermaid' },
            { title: 'API Lab', href: '/tools/api-lab' },
        ],
    },
    {
        title: '产品',
        href: '/products',
        children: [
            { title: '产品介绍', href: '/products' },
            { title: 'Apple 隐私政策', href: '/legal/apple-privacy' },
            { title: '支持页面', href: '/support' },
            { title: '使用条款', href: '/legal/terms' },
            { title: '数据删除说明', href: '/legal/data-deletion' },
            { title: '上架清单', href: '/legal/app-store-checklist' },
            { title: '常用链接', href: '/links' },
        ],
    },
    { title: '记录', href: '/notes' },
];
