import { NextRequest, NextResponse } from 'next/server';
import { withUser } from '@/lib/api/auth';
import {
    buildDailyNoteInput,
    getDailyNoteByKey,
    getPublicNotesUserId,
    listDailyNotesByDate,
    listDailyNotes,
    upsertDailyNote,
} from '@/lib/repositories/dailyNoteRepository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const userId = await getPublicNotesUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Public notes owner not found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const date = searchParams.get('date');

    if (key) {
        const item = await getDailyNoteByKey(userId, key);
        if (!item) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return NextResponse.json(item);
    }

    if (date) {
        const items = await listDailyNotesByDate(userId, date);
        if (items.length === 0) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }
        return NextResponse.json({ items });
    }

    const limit = Number(searchParams.get('limit') || '20');
    const cursor = searchParams.get('cursor');
    const items = await listDailyNotes(userId, {
        limit: Number.isFinite(limit) ? limit : 20,
        cursor,
    });

    return NextResponse.json({
        items,
        nextCursor: items.length > 0 ? items[items.length - 1].noteDate : null,
    });
}

export const POST = withUser(async (req: NextRequest, userId: string) => {
    try {
        const input = buildDailyNoteInput(await req.json());
        const item = await upsertDailyNote(userId, input);
        return NextResponse.json(item);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Invalid daily note payload';
        return NextResponse.json({ error: message }, { status: 400 });
    }
});
