import type { PoolClient } from 'pg';

export async function dailyNotesContent(client: PoolClient) {
    await client.query(`
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS daily_notes (
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          VARCHAR(50)   NOT NULL REFERENCES user_info(user_id) ON DELETE CASCADE,
  note_key         TEXT          NOT NULL,
  note_kind        TEXT          NOT NULL DEFAULT 'daily',
  note_date        DATE          NOT NULL,
  title            TEXT          NOT NULL,
  summary          TEXT          NULL,
  content_markdown TEXT          NULL,
  blocks           JSONB         NOT NULL DEFAULT '[]'::jsonb,
  tags             TEXT[]        NOT NULL DEFAULT '{}',
  source           TEXT          NOT NULL DEFAULT 'codex',
  source_url       TEXT          NULL,
  status           TEXT          NOT NULL DEFAULT 'draft',
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_daily_notes_kind
    CHECK (note_kind = ANY (ARRAY['daily'::text, 'memory'::text, 'product'::text, 'clip'::text, 'learning'::text, 'other'::text])),
  CONSTRAINT chk_daily_notes_status
    CHECK (status = ANY (ARRAY['draft'::text, 'published'::text, 'private'::text, 'archived'::text])),
  CONSTRAINT uq_daily_notes_user_key UNIQUE (user_id, note_key)
);

CREATE INDEX IF NOT EXISTS idx_daily_notes_user_date
  ON daily_notes(user_id, note_date DESC);

CREATE INDEX IF NOT EXISTS idx_daily_notes_kind
  ON daily_notes(user_id, note_kind);

CREATE INDEX IF NOT EXISTS idx_daily_notes_status
  ON daily_notes(user_id, status);

CREATE INDEX IF NOT EXISTS idx_daily_notes_tags
  ON daily_notes USING GIN (tags);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM pg_trigger
     WHERE tgname = 'trg_daily_notes_updated'
       AND tgrelid = 'daily_notes'::regclass
  ) THEN
    CREATE TRIGGER trg_daily_notes_updated
      BEFORE UPDATE ON daily_notes
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;
    `);
}

export async function ensureDailyNotesSchema(client: PoolClient) {
    await client.query(`
ALTER TABLE daily_notes
  ADD COLUMN IF NOT EXISTS note_key TEXT,
  ADD COLUMN IF NOT EXISTS note_kind TEXT NOT NULL DEFAULT 'daily',
  ADD COLUMN IF NOT EXISTS source_url TEXT NULL;

UPDATE daily_notes
   SET note_key = CONCAT('daily:', note_date::text)
 WHERE note_key IS NULL OR note_key = '';

ALTER TABLE daily_notes
  ALTER COLUMN note_key SET NOT NULL;

ALTER TABLE daily_notes
  DROP CONSTRAINT IF EXISTS uq_daily_notes_user_date;

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_notes_user_key
  ON daily_notes(user_id, note_key);

CREATE INDEX IF NOT EXISTS idx_daily_notes_kind
  ON daily_notes(user_id, note_kind);
    `);
}
