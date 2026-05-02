import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import matter from 'gray-matter';
import type { Post, PostFrontmatter, PostMeta } from './types';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function resolveContentDir(): string {
    if (process.env.CONTENT_REPO_PATH) {
        return path.resolve(process.env.CONTENT_REPO_PATH);
    }
    return path.resolve(process.cwd(), '..', 'AiTool-content');
}

function postsDir(): string {
    return path.join(resolveContentDir(), 'posts');
}

function normalizeTags(raw: unknown): string[] {
    if (!Array.isArray(raw)) return [];
    return raw
        .filter((t): t is string => typeof t === 'string')
        .map((t) => t.trim())
        .filter(Boolean);
}

function pickExcerpt(fm: PostFrontmatter, body: string): string | null {
    if (fm.excerpt && typeof fm.excerpt === 'string') return fm.excerpt.trim();
    const firstParagraph = body
        .split(/\n{2,}/)
        .map((s) => s.trim())
        .find((s) => s && !s.startsWith('#') && !s.startsWith('---'));
    if (!firstParagraph) return null;
    return firstParagraph.replace(/[*_`>#-]/g, '').slice(0, 160).trim();
}

function slugFromFile(filename: string): string {
    return filename.replace(/\.md$/, '');
}

function normalizeDateTime(raw: unknown): string | null {
    if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
        return raw.toISOString();
    }
    if (typeof raw !== 'string') return null;

    const value = raw.trim();
    if (!value) return null;
    if (DATE_RE.test(value)) return `${value}T00:00:00.000Z`;

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.toISOString();
}

function gitPublishedAt(fullPath: string): string | null {
    const contentRoot = resolveContentDir();
    const relativePath = path.relative(contentRoot, fullPath);
    if (!relativePath || relativePath.startsWith('..') || path.isAbsolute(relativePath)) return null;

    try {
        const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', relativePath], {
            cwd: contentRoot,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore'],
        }).trim();
        return normalizeDateTime(out);
    } catch {
        return null;
    }
}

function pickPublishedAt(fm: PostFrontmatter, fullPath: string, dateStr: string): string {
    const explicit = normalizeDateTime(fm.publishedAt);
    if (explicit) return explicit;

    const fromGit = gitPublishedAt(fullPath);
    if (fromGit) return fromGit;

    try {
        return fs.statSync(fullPath).mtime.toISOString();
    } catch {
        return `${dateStr}T00:00:00.000Z`;
    }
}

function parseFile(file: string): Post | null {
    const dir = postsDir();
    const fullPath = path.join(dir, file);
    let raw: string;
    try {
        raw = fs.readFileSync(fullPath, 'utf8');
    } catch {
        return null;
    }

    const { data, content } = matter(raw);
    const fm = data as PostFrontmatter;

    if (fm.draft === true) return null;
    if (!fm.title || typeof fm.title !== 'string') return null;
    let dateStr: string | undefined;
    if (fm.date instanceof Date) {
        dateStr = fm.date.toISOString().slice(0, 10);
    } else if (typeof fm.date === 'string' && DATE_RE.test(fm.date)) {
        dateStr = fm.date;
    }
    if (!dateStr) return null;

    return {
        slug: slugFromFile(file),
        title: fm.title.trim(),
        date: dateStr,
        publishedAt: pickPublishedAt(fm, fullPath, dateStr),
        tags: normalizeTags(fm.tags),
        cover: typeof fm.cover === 'string' ? fm.cover : null,
        excerpt: pickExcerpt(fm, content),
        content,
    };
}

export function getAllPosts(): PostMeta[] {
    const dir = postsDir();
    let entries: string[];
    try {
        entries = fs.readdirSync(dir);
    } catch {
        return [];
    }

    const posts = entries
        .filter((f) => f.endsWith('.md'))
        .map((f) => parseFile(f))
        .filter((p): p is Post => p !== null)
        .map(({ content: _content, ...meta }) => meta);

    posts.sort((a, b) => {
        if (a.publishedAt !== b.publishedAt) return a.publishedAt < b.publishedAt ? 1 : -1;
        if (a.date !== b.date) return a.date < b.date ? 1 : -1;
        return a.title.localeCompare(b.title, 'zh-CN');
    });

    return posts;
}

export function getPostBySlug(slug: string): Post | null {
    return parseFile(`${slug}.md`);
}

export function getAllTags(posts: PostMeta[]): Array<{ tag: string; count: number }> {
    const counts = new Map<string, number>();
    posts.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return Array.from(counts.entries())
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}
