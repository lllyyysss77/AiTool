export type DailyNoteStatus = 'draft' | 'published' | 'private' | 'archived';
export type DailyNoteKind = 'daily' | 'memory' | 'product' | 'clip' | 'learning' | 'other';

export type DailyNoteBlock =
    | {
          type: 'markdown';
          text: string;
      }
    | {
          type: 'image';
          url: string;
          alt?: string;
          caption?: string;
          fileId?: string;
      }
    | {
          type: 'audio';
          url: string;
          title?: string;
          caption?: string;
          fileId?: string;
      }
    | {
          type: 'video';
          url: string;
          title?: string;
          caption?: string;
          fileId?: string;
      }
    | {
          type: 'embed';
          provider: 'youtube' | 'bilibili' | 'generic';
          url: string;
          title?: string;
      }
    | {
          type: 'link';
          url: string;
          title?: string;
          description?: string;
      };

export interface DailyNote {
    id: string;
    userId: string;
    noteKey: string;
    noteKind: DailyNoteKind;
    noteDate: string;
    title: string;
    summary: string | null;
    contentMarkdown: string | null;
    blocks: DailyNoteBlock[];
    tags: string[];
    source: string;
    sourceUrl: string | null;
    status: DailyNoteStatus;
    createdAt: string;
    updatedAt: string;
}

export interface DailyNoteRow {
    id: string;
    user_id: string;
    note_key: string;
    note_kind: DailyNoteKind;
    note_date: string | Date;
    title: string;
    summary: string | null;
    content_markdown: string | null;
    blocks: DailyNoteBlock[] | null;
    tags: string[] | null;
    source: string;
    source_url: string | null;
    status: DailyNoteStatus;
    created_at: string | Date;
    updated_at: string | Date;
}

export interface UpsertDailyNoteInput {
    noteKey?: string;
    noteKind?: DailyNoteKind;
    noteDate: string;
    title: string;
    summary?: string | null;
    contentMarkdown?: string | null;
    blocks?: DailyNoteBlock[];
    tags?: string[];
    source?: string;
    sourceUrl?: string | null;
    status?: DailyNoteStatus;
}
