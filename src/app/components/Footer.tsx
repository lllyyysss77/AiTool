'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Sparkles } from 'lucide-react';

const footerLinks = [
    { title: '工具目录', href: '/tools' },
    { title: '产品介绍', href: '/products' },
    { title: '想法记录', href: '/notes' },
    { title: '常用链接', href: '/links' },
    { title: '支持', href: '/support' },
    { title: '隐私政策', href: '/legal/apple-privacy' },
    { title: '使用条款', href: '/legal/terms' },
];

export default function Footer() {
    const pathname = usePathname();

    if (
        pathname === '/trip' ||
        pathname?.startsWith('/trip/')
    ) {
        return null;
    }

    return (
        <footer className="border-t border-slate-900/10 bg-[linear-gradient(180deg,rgba(248,250,252,0.92)_0%,rgba(238,242,247,0.88)_100%)] backdrop-blur-sm">
            <div className="mx-auto flex max-w-7xl flex-col gap-7 px-6 py-10 md:flex-row md:items-center md:justify-between md:py-12">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#20342b_0%,#5f6b3f_55%,#d49b42_100%)] text-white">
                        <Sparkles size={15} />
                    </div>
                    <div>
                        <div className="text-sm font-black tracking-tight text-slate-900">AiTool 2.0</div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Personal toolbox</div>
                    </div>
                </div>

                <nav className="flex flex-wrap items-center gap-4 md:justify-center md:gap-6">
                    {footerLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-semibold text-slate-600 transition-colors duration-200 hover:text-slate-900"
                        >
                            {link.title}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/owenshen0907/AiTool"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 transition-colors duration-200 hover:text-slate-900"
                        aria-label="GitHub"
                    >
                        <Github size={18} />
                    </a>
                    <span className="text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} Owen Shen
                    </span>
                </div>
            </div>
        </footer>
    );
}
