// lib/db/initDb.ts
import type { PoolClient } from 'pg';
import { pool } from './client.js';
import { dailyNotesContent, ensureDailyNotesSchema } from './migrations/dailyNotesMigration.js';

async function tableExists(client: PoolClient, tableName: string) {
    const res = await client.query<{ exists: boolean }>(
        `SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = $1
        ) AS exists`,
        [tableName],
    );

    return Boolean(res.rows[0]?.exists);
}

async function runMigrationIfMissing(
    client: PoolClient,
    tableName: string,
    label: string,
    migration: (client: PoolClient) => Promise<void>,
) {
    if (await tableExists(client, tableName)) {
        console.log(`Skipping ${label}, table "${tableName}" already exists.`);
        return;
    }

    console.log(`Running ${label}...`);
    await migration(client);
}

export async function initDb() {
    if (process.env.DB_INIT !== 'true') {
        console.log('DB_INIT not enabled, skipping initialization.');
        return;
    }

    const client = await pool.connect();
    try {
        console.log('Initializing database...');
        const hasBaseSchema = await tableExists(client, 'ai_suppliers');
        if (!hasBaseSchema) {
            console.log('Base schema not found, creating core tables...');
            await client.query(`
-- 必要的扩展
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- user_info
CREATE TABLE IF NOT EXISTS user_info (
    user_id       VARCHAR(50) PRIMARY KEY,
    nickname      TEXT NOT NULL,
    phone         TEXT,
    email         TEXT,
    wechat        TEXT,
    account_level INTEGER
);

-- AI 供应商表（含新增的 wssurl 字段，可为空）
CREATE TABLE IF NOT EXISTS ai_suppliers (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT        NOT NULL,
    abbreviation  TEXT        NOT NULL,
    api_key       TEXT        NOT NULL,
    api_url       TEXT        NOT NULL,
    wssurl        TEXT,  -- WebSocket URL，可为空
    user_id       VARCHAR(50) NOT NULL REFERENCES user_info(user_id) ON DELETE CASCADE,
    is_default    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON ai_suppliers(user_id);

-- 模型表（已调整 model_type、并新增输入/输出字段及 supports_websocket）
CREATE TABLE IF NOT EXISTS models (
    id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id              UUID        NOT NULL REFERENCES ai_suppliers(id) ON DELETE CASCADE,
    name                     TEXT        NOT NULL,
    model_type               TEXT        NOT NULL
                                      CHECK (model_type IN ('chat','audio','image','video','other')),
    -- 输入能力
    supports_audio_input     BOOLEAN     NOT NULL DEFAULT FALSE,  -- 新增：音频输入
    supports_image_input     BOOLEAN     NOT NULL DEFAULT FALSE,
    supports_video_input     BOOLEAN     NOT NULL DEFAULT FALSE,
    -- 输出能力
    supports_audio_output    BOOLEAN     NOT NULL DEFAULT FALSE,
    supports_image_output    BOOLEAN     NOT NULL DEFAULT FALSE,  -- 新增：图片输出
    supports_video_output    BOOLEAN     NOT NULL DEFAULT FALSE,  -- 新增：视频输出
    -- 其他能力
    supports_json_mode       BOOLEAN     NOT NULL DEFAULT FALSE,
    supports_tool            BOOLEAN     NOT NULL DEFAULT FALSE,
    supports_web_search      BOOLEAN     NOT NULL DEFAULT FALSE,
    supports_deep_thinking   BOOLEAN     NOT NULL DEFAULT FALSE,
    supports_websocket       BOOLEAN     NOT NULL DEFAULT FALSE,  -- 新增：WebSocket 支持
    is_default               BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_models_supplier_id ON models(supplier_id);
CREATE INDEX IF NOT EXISTS idx_models_model_type   ON models(model_type);

-- 音色主表
CREATE TABLE IF NOT EXISTS voice_tones (
    id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),  -- 内部主键
    supplier_id          UUID        NOT NULL
                                     REFERENCES ai_suppliers(id) ON DELETE CASCADE,  -- 所属供应商
    tone_id              TEXT        NOT NULL,       -- 供应商接口生成的音色 ID
    name                 TEXT        NOT NULL,       -- 音色名称
    description          TEXT,                        -- 音色描述
    available_model_ids  UUID[]      NOT NULL DEFAULT '{}',  -- 绑定模型列表，空数组表示全局可用
    original_audio_file_id      UUID,                          -- 原始音频文件 ID
    original_audio_file_path    TEXT,                          -- 原始音频文件路径
    preview_audio_file_id       UUID,                          -- 预览音色音频文件 ID
    sample_audio_path           TEXT,                          -- 预览音色音频文件路径
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 唯一约束：同一供应商下 tone_id 唯一
CREATE UNIQUE INDEX IF NOT EXISTS idx_voice_tones_supplier_toneid
  ON voice_tones(supplier_id, tone_id);

-- 可选：加速按供应商查询
CREATE INDEX IF NOT EXISTS idx_voice_tones_supplier_id
  ON voice_tones(supplier_id);

-- GIN 索引：加速按模型 ID 在 available_model_ids 中搜索
CREATE INDEX IF NOT EXISTS idx_voice_tones_available_models_gin
  ON voice_tones USING GIN (available_model_ids);

-- Agent配置
-- Agent 场景配置表
CREATE TABLE IF NOT EXISTS agent_scene_config (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     VARCHAR(50) NOT NULL,                    -- 对应 user_info.user_id 类型
    agent_id    TEXT        NOT NULL,
    scene_key   TEXT        NOT NULL,
    supplier_id UUID        NOT NULL REFERENCES ai_suppliers(id) ON DELETE CASCADE,
    model_id    UUID        NOT NULL REFERENCES models(id)        ON DELETE CASCADE,
    extras      JSONB       NOT NULL DEFAULT '{}'::jsonb,         -- 预留扩展（可删除）
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- 唯一约束：同一用户的同一 agent 的同一场景只有一条配置
    UNIQUE (user_id, agent_id, scene_key)
);

-- 索引：按用户加载全部
CREATE INDEX IF NOT EXISTS idx_agent_scene_user ON agent_scene_config(user_id);

-- 索引：按用户+agent 查询
CREATE INDEX IF NOT EXISTS idx_agent_scene_user_agent ON agent_scene_config(user_id, agent_id);

-- 可选：统计/分析（供应商、模型维度）
CREATE INDEX IF NOT EXISTS idx_agent_scene_supplier ON agent_scene_config(supplier_id);
CREATE INDEX IF NOT EXISTS idx_agent_scene_model    ON agent_scene_config(model_id);

-- 自动更新时间触发器（如果还没有）
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
     WHERE tgname = 'trg_agent_scene_config_updated'
       AND tgrelid = 'agent_scene_config'::regclass
  ) THEN
    CREATE TRIGGER trg_agent_scene_config_updated
      BEFORE UPDATE ON agent_scene_config
      FOR EACH ROW
      EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS file_uploads (
  file_id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),  -- 文件主键
  user_id        VARCHAR(50) NOT NULL,                              -- 文件所属/上传用户
  module_name    TEXT        NOT NULL,                              -- 上传的模块或业务场景
  file_category  TEXT        NOT NULL,                              -- 文件分类，如 'img' / 'video' / 'audio'
  mime_type      TEXT        NOT NULL,                              -- 文件 MIME 类型
  original_name  TEXT        NOT NULL,                              -- 上传时的原始文件名
  file_path      TEXT        NOT NULL,                              -- 存储在服务器上的相对路径或 URL
  file_size      BIGINT      NOT NULL,                              -- 文件大小（字节）
  form_id        TEXT,                                              -- 关联业务表单的 ID

  -- origin 字段，限定为 'manual' 或 'ai'
  origin         TEXT        NOT NULL DEFAULT 'manual',

  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),                -- 上传时间
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),                -- 最近更新时间

  -- 外键约束
  CONSTRAINT fk_file_user FOREIGN KEY (user_id) REFERENCES user_info(user_id),
  -- 检查约束：origin 只能取 manual 或 ai
  CONSTRAINT chk_origin      CHECK (origin = ANY (ARRAY['manual'::text, 'ai'::text]))
);

-- 常用查询索引
CREATE INDEX IF NOT EXISTS idx_file_uploads_user     ON file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_module   ON file_uploads(module_name);
CREATE INDEX IF NOT EXISTS idx_file_uploads_category ON file_uploads(file_category);
        `);
        } else {
            console.log('Core tables already exist, skipping base schema bootstrap.');
        }

        await runMigrationIfMissing(client, 'daily_notes', 'daily notes migration', dailyNotesContent);
        await ensureDailyNotesSchema(client);

        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Error initializing DB:', err);
    } finally {
        client.release();
    }
}

// auto-run
if (process.argv[1] === new URL(import.meta.url).pathname) {
    initDb()
        .catch((error) => {
            console.error('Database initialization failed:', error);
            process.exitCode = 1;
        })
        .finally(async () => {
            await pool.end();
        });
}
