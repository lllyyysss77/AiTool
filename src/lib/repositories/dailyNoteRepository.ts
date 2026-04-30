import { pool } from '@/lib/db/client';
import type {
    DailyNote,
    DailyNoteBlock,
    DailyNoteKind,
    DailyNoteRow,
    DailyNoteStatus,
    UpsertDailyNoteInput,
} from '@/lib/models/dailyNote';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const VALID_STATUSES = new Set<DailyNoteStatus>(['draft', 'published', 'private', 'archived']);
const VALID_KINDS = new Set<DailyNoteKind>(['daily', 'memory', 'product', 'clip', 'learning', 'other']);

function toIsoDate(value: string | Date) {
    if (value instanceof Date) {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    return String(value).slice(0, 10);
}

function toIsoString(value: string | Date) {
    if (value instanceof Date) {
        return value.toISOString();
    }
    return String(value);
}

function normalizeText(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed || null;
}

function normalizeTags(tags: unknown): string[] {
    if (!Array.isArray(tags)) return [];
    return tags
        .filter((tag): tag is string => typeof tag === 'string')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 20);
}

function normalizeStatus(status: unknown): DailyNoteStatus {
    return typeof status === 'string' && VALID_STATUSES.has(status as DailyNoteStatus)
        ? (status as DailyNoteStatus)
        : 'draft';
}

function normalizeKind(kind: unknown): DailyNoteKind {
    return typeof kind === 'string' && VALID_KINDS.has(kind as DailyNoteKind)
        ? (kind as DailyNoteKind)
        : 'daily';
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 48);
}

function normalizeBlock(raw: unknown): DailyNoteBlock | null {
    if (!raw || typeof raw !== 'object') return null;
    const block = raw as Record<string, unknown>;
    const type = block.type;

    if (type === 'markdown') {
        const text = normalizeText(block.text);
        return text ? { type, text } : null;
    }

    if (type === 'image' || type === 'audio' || type === 'video') {
        const url = normalizeText(block.url);
        if (!url) return null;
        return {
            type,
            url,
            alt: normalizeText(block.alt) ?? undefined,
            title: normalizeText(block.title) ?? undefined,
            caption: normalizeText(block.caption) ?? undefined,
            fileId: normalizeText(block.fileId) ?? normalizeText(block.file_id) ?? undefined,
        } as DailyNoteBlock;
    }

    if (type === 'embed') {
        const url = normalizeText(block.url);
        if (!url) return null;
        const provider = block.provider === 'youtube' || block.provider === 'bilibili'
            ? block.provider
            : 'generic';
        return {
            type,
            provider,
            url,
            title: normalizeText(block.title) ?? undefined,
        };
    }

    if (type === 'link') {
        const url = normalizeText(block.url);
        if (!url) return null;
        return {
            type,
            url,
            title: normalizeText(block.title) ?? undefined,
            description: normalizeText(block.description) ?? undefined,
        };
    }

    return null;
}

function normalizeBlocks(blocks: unknown): DailyNoteBlock[] {
    if (!Array.isArray(blocks)) return [];
    return blocks
        .map(normalizeBlock)
        .filter((block): block is DailyNoteBlock => Boolean(block));
}

function mapRow(row: DailyNoteRow): DailyNote {
    return {
        id: row.id,
        userId: row.user_id,
        noteKey: row.note_key,
        noteKind: row.note_kind,
        noteDate: toIsoDate(row.note_date),
        title: row.title,
        summary: row.summary,
        contentMarkdown: row.content_markdown,
        blocks: row.blocks ?? [],
        tags: row.tags ?? [],
        source: row.source,
        sourceUrl: row.source_url,
        status: row.status,
        createdAt: toIsoString(row.created_at),
        updatedAt: toIsoString(row.updated_at),
    };
}

export function buildDailyNoteInput(body: unknown): UpsertDailyNoteInput {
    const input = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
    const noteDate = normalizeText(input.noteDate) ?? normalizeText(input.note_date) ?? normalizeText(input.date);

    if (!noteDate || !DATE_RE.test(noteDate)) {
        throw new Error('date must be YYYY-MM-DD');
    }

    const title = normalizeText(input.title) ?? `${noteDate} 总结`;
    const noteKind =
        normalizeKind(input.noteKind ?? input.note_kind ?? input.kind ?? input.recordKind ?? input.record_kind);
    const noteKey =
        normalizeText(input.noteKey) ??
        normalizeText(input.note_key) ??
        normalizeText(input.key) ??
        (noteKind === 'daily'
            ? `daily:${noteDate}`
            : `${noteKind}:${noteDate}:${slugify(title) || 'record'}`);
    const contentMarkdown =
        normalizeText(input.contentMarkdown) ??
        normalizeText(input.content_markdown) ??
        normalizeText(input.markdown);

    return {
        noteKey,
        noteKind,
        noteDate,
        title,
        summary: normalizeText(input.summary),
        contentMarkdown,
        blocks: normalizeBlocks(input.blocks),
        tags: normalizeTags(input.tags),
        source: normalizeText(input.source) ?? 'codex',
        sourceUrl: normalizeText(input.sourceUrl) ?? normalizeText(input.source_url),
        status: normalizeStatus(input.status),
    };
}

export async function listDailyNotes(
    userId: string,
    options: {
        limit?: number;
        cursor?: string | null;
    } = {},
): Promise<DailyNote[]> {
    const limit = Math.min(Math.max(options.limit ?? 20, 1), 100);
    const values: unknown[] = [userId, limit];
    let cursorClause = '';

    if (options.cursor && DATE_RE.test(options.cursor)) {
        values.push(options.cursor);
        cursorClause = `AND note_date < $${values.length}`;
    }

    const { rows } = await pool.query<DailyNoteRow>(
        `
        SELECT *
          FROM daily_notes
         WHERE user_id = $1
           ${cursorClause}
         ORDER BY note_date DESC, updated_at DESC, created_at DESC
         LIMIT $2
        `,
        values,
    );

    return rows.map(mapRow);
}

export async function getPublicNotesUserId(): Promise<string | null> {
    const configuredUserId =
        process.env.AITOOL_PUBLIC_NOTES_USER_ID?.trim() ||
        process.env.PUBLIC_NOTES_USER_ID?.trim();

    if (configuredUserId) {
        return configuredUserId;
    }

    const { rows } = await pool.query<{ user_id: string }>(
        `
        SELECT user_id
          FROM user_info
         WHERE nickname = $1
         LIMIT 1
        `,
        ['欧文'],
    );

    if (rows[0]?.user_id) {
        return rows[0].user_id;
    }

    const fallback = await pool.query<{ user_id: string }>(
        `SELECT user_id FROM user_info ORDER BY nickname LIMIT 1`,
    );

    return fallback.rows[0]?.user_id ?? null;
}

export async function getDailyNoteByDate(userId: string, noteDate: string): Promise<DailyNote | null> {
    if (!DATE_RE.test(noteDate)) {
        throw new Error('date must be YYYY-MM-DD');
    }

    const { rows } = await pool.query<DailyNoteRow>(
        `SELECT * FROM daily_notes WHERE user_id = $1 AND note_date = $2 LIMIT 1`,
        [userId, noteDate],
    );

    return rows[0] ? mapRow(rows[0]) : null;
}

export async function getDailyNoteByKey(userId: string, noteKey: string): Promise<DailyNote | null> {
    const { rows } = await pool.query<DailyNoteRow>(
        `SELECT * FROM daily_notes WHERE user_id = $1 AND note_key = $2 LIMIT 1`,
        [userId, noteKey],
    );

    return rows[0] ? mapRow(rows[0]) : null;
}

export async function listDailyNotesByDate(userId: string, noteDate: string): Promise<DailyNote[]> {
    if (!DATE_RE.test(noteDate)) {
        throw new Error('date must be YYYY-MM-DD');
    }

    const { rows } = await pool.query<DailyNoteRow>(
        `SELECT * FROM daily_notes WHERE user_id = $1 AND note_date = $2 ORDER BY updated_at DESC, created_at DESC`,
        [userId, noteDate],
    );

    return rows.map(mapRow);
}

export async function upsertDailyNote(
    userId: string,
    input: UpsertDailyNoteInput,
): Promise<DailyNote> {
    const { rows } = await pool.query<DailyNoteRow>(
        `
        INSERT INTO daily_notes(
            user_id, note_key, note_kind, note_date, title, summary,
            content_markdown, blocks, tags, source, source_url, status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12)
        ON CONFLICT (user_id, note_key)
        DO UPDATE SET
            note_kind = EXCLUDED.note_kind,
            note_date = EXCLUDED.note_date,
            title = EXCLUDED.title,
            summary = EXCLUDED.summary,
            content_markdown = EXCLUDED.content_markdown,
            blocks = EXCLUDED.blocks,
            tags = EXCLUDED.tags,
            source = EXCLUDED.source,
            source_url = EXCLUDED.source_url,
            status = EXCLUDED.status,
            updated_at = NOW()
        RETURNING *
        `,
        [
            userId,
            input.noteKey,
            input.noteKind ?? 'daily',
            input.noteDate,
            input.title,
            input.summary ?? null,
            input.contentMarkdown ?? null,
            JSON.stringify(input.blocks ?? []),
            input.tags ?? [],
            input.source ?? 'codex',
            input.sourceUrl ?? null,
            input.status ?? 'draft',
        ],
    );

    return mapRow(rows[0]);
}
