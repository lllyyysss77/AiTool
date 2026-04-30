import Link from 'next/link';
import { ArrowRight, Apple, FileText, Headphones, ListChecks, PackageOpen, ShieldCheck, Trash2 } from 'lucide-react';
import { personalProducts } from '@/lib/aitool2';
import { appStoreUrls } from '@/lib/appStore';

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(226,232,240,0.9),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-10 text-slate-900 md:px-8 md:py-14">
            <section className="mx-auto max-w-7xl rounded-[42px] border border-slate-900/10 bg-[linear-gradient(135deg,#0f172a_0%,#334155_100%)] p-6 text-white shadow-[0_28px_100px_rgba(15,23,42,0.18)] md:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2 text-sm font-bold text-slate-200">
                    <PackageOpen size={16} />
                    Products
                </div>
                <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.05em] md:text-6xl">
                    个人产品、发布说明和隐私政策 URL 集中管理。
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-200/85 md:text-lg">
                    这个页面用来给自己和外部审核者看：我在做哪些产品、服务对象是谁、用到了哪些能力，以及 App Store Connect 要填的隐私政策链接。
                </p>
            </section>

            <section className="mx-auto mt-8 grid max-w-7xl gap-5 lg:grid-cols-2">
                {personalProducts.map((product, index) => (
                    <article
                        key={product.title}
                        id={index === 0 ? 'japanese-learning-app' : undefined}
                        className="rounded-[36px] border border-slate-900/10 bg-white/[0.84] p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur md:p-8"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="rounded-full border border-amber-300/60 bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                                {product.status}
                            </span>
                            <Apple size={22} className="text-slate-900" />
                        </div>
                        <h2 className="mt-5 text-3xl font-black tracking-[-0.04em] text-slate-900">
                            {product.title}
                        </h2>
                        <p className="mt-4 text-sm leading-8 text-slate-600 md:text-base">
                            {product.description}
                        </p>
                        <div className="mt-5 rounded-[24px] border border-slate-900/10 bg-white/[0.76] p-4">
                            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                                Audience
                            </div>
                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                {product.audience}
                            </p>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                            {product.stack.map((item) => (
                                <span key={item} className="rounded-full border border-slate-900/10 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                                    {item}
                                </span>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href={product.privacyHref}
                                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                            >
                                <ShieldCheck size={16} />
                                隐私政策 URL
                            </Link>
                            <Link
                                href={product.supportHref}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-white"
                            >
                                <Headphones size={16} />
                                支持 URL
                            </Link>
                            <Link
                                href={product.termsHref}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-white"
                            >
                                <FileText size={16} />
                                使用条款
                            </Link>
                            <Link
                                href="/legal/data-deletion"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-white"
                            >
                                <Trash2 size={16} />
                                数据删除
                            </Link>
                            <Link
                                href={product.href}
                                className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/75 px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-white"
                            >
                                查看说明
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </article>
                ))}
            </section>

            <section className="mx-auto mt-8 max-w-7xl rounded-[36px] border border-slate-900/10 bg-white/70 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur md:p-8">
                <div className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
                    App Store Connect
                </div>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-900">
                    可用于 Apple 的公开 URL
                </h2>
                <p className="mt-3 text-sm leading-8 text-slate-600 md:text-base">
                    部署到 owenshen.top 后，可以把这些地址填入 App Store Connect 或审核备注。支持邮箱先统一使用 support@owenshen.top，正式提交前请确认该邮箱可收信。
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {appStoreUrls.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link key={item.href} href={item.href} className="rounded-[24px] border border-slate-900/10 bg-white/[0.82] p-4 transition hover:bg-white">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-slate-900">{item.title}</div>
                                        <div className="mt-1 text-xs text-slate-500">{item.requiredFor}</div>
                                    </div>
                                </div>
                                <div className="mt-3 break-all rounded-2xl bg-slate-950 p-3 font-mono text-xs text-slate-100">
                                    {item.url}
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <Link href="/legal/app-store-checklist" className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800">
                    <ListChecks size={16} />
                    查看完整上架清单
                </Link>
            </section>
        </main>
    );
}
