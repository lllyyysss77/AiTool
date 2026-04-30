# AiTool 2.0

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.20.7-green)](https://nodejs.org/) [![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black)](https://nextjs.org/) [![License](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/licenses/MIT)

AiTool 2.0 是 Owen 的个人工具与工作网站：把正在做的 AI 产品、日常工具、App Store 上架材料、个人链接和长期记录收在同一个入口。

线上地址：[https://owenshen.top](https://owenshen.top)

## 当前定位

这个项目不再是旧版的“功能堆叠式工作台”，而是一个个人大杂烩式的长期站点：

- **产品展示**：整理日语学习、亲人关系 AI 社交、AI Vlog、自进化 Agent 等方向。
- **工具入口**：沉淀自己日常会用的模型接口、文件管理、Mermaid 预览等工具。
- **公开记录**：按时间线公开记录每日总结、产品判断、旧内容补录和素材摘录。
- **App Store 支持材料**：集中放隐私政策、支持页、条款、数据删除说明和上架检查清单。
- **个人链接**：把常用站点、产品入口和公开资料整理成自己的工作导航。

## 功能概览

### 首页与个人站点

- `/`：个人介绍与 4 条主要产品方向。
- `/products`：产品目录与 App Store 相关入口。
- `/links`：个人常用链接与站点导航。
- `/roadmap`：产品和站点后续规划。

### 工具箱

- `/tools`：AiTool 2.0 工具入口。
- `/tools/api-lab`：统一的模型接口实验室，后续承接文本、图片、语音、文件等供应商能力。
- `/tools/mermaid`：Mermaid 在线查看与调试。
- `/stepfun/file`：保留的历史文件管理工具入口，仅作为兼容工具继续使用。

### 公开记录

- `/notes`：公开时间线，默认按日期倒序展示记录。
- `/api/notes/daily`：每日记录 API，支持读取公开记录与登录后写入。
- 记录支持 `daily`、`memory`、`product`、`clip`、`learning`、`other` 等类型。
- 正文支持 Markdown，扩展块支持图片、音频、视频、B 站 / YouTube 嵌入和外部链接。

### App Store 材料

- `/legal/apple-privacy`：Apple App 隐私政策。
- `/support`：App 支持页。
- `/legal/terms`：服务条款。
- `/legal/data-deletion`：数据删除说明。
- `/legal/app-store-checklist`：App Store 上架材料检查清单。

## 技术栈

- **框架**：Next.js 14 App Router
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **数据库**：PostgreSQL (`pg` + `pgvector`)
- **认证**：unified-app-backend
- **实时能力**：WebSocket
- **运行方式**：本地 Node.js / Docker Compose

## 本地开发

### 依赖要求

| 依赖项 | 版本要求 |
| --- | --- |
| Node.js | >= 18.20.7 |
| npm | >= 10.8.2 |

### 安装

```bash
git clone https://github.com/owenshen0907/AiTool.git
cd AiTool
npm install
```

### 环境变量

项目默认读取根目录的 `.env.local`。最少需要配置数据库：

```env
DATABASE_URL=postgres://username:password@localhost:5432/aitool
```

如果需要启用登录、写入记录或受保护接口，需要配置 unified-app-backend：

```env
UNIFIED_APP_BACKEND_URL=https://appapi.example.com
NEXT_PUBLIC_UNIFIED_APP_BACKEND_URL=https://appapi.example.com

UNIFIED_APP_CODE=aitool
NEXT_PUBLIC_UNIFIED_APP_CODE=aitool

UNIFIED_APP_NAME=AiTool 2.0
NEXT_PUBLIC_UNIFIED_APP_NAME=AiTool 2.0

UNIFIED_APP_BUNDLE_ID=top.owenshen.aitool
NEXT_PUBLIC_UNIFIED_APP_BUNDLE_ID=top.owenshen.aitool

NEXT_PUBLIC_APP_URL=http://localhost:3002
```

公开记录默认会优先读取下面两个变量指定的用户；未配置时，会回退到昵称为 `欧文` 的用户：

```env
AITOOL_PUBLIC_NOTES_USER_ID=your_user_id
# 或
PUBLIC_NOTES_USER_ID=your_user_id
```

### 启动

开发服务器默认跑在 `3002` 端口，并会先执行数据库初始化：

```bash
npm run dev
```

生产构建：

```bash
npm run build
npm run start
```

单独执行数据库初始化：

```bash
npm run init-db
```

## 数据与记录 API

读取公开记录：

```bash
curl http://localhost:3002/api/notes/daily
```

按日期读取：

```bash
curl "http://localhost:3002/api/notes/daily?date=2026-05-01"
```

写入或更新每日总结需要登录态，请求体示例：

```json
{
  "noteDate": "2026-05-01",
  "title": "开始运营 X 的第一天",
  "summary": "今天把对外表达正式拉起来。",
  "contentMarkdown": "今天做了什么...",
  "tags": ["daily", "X运营", "产品记录"],
  "status": "published"
}
```

每日总结会使用 `daily:YYYY-MM-DD` 作为默认 `noteKey`，便于 Codex 或其他自动化流程幂等更新。

## 项目结构

```text
AiTool/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # 首页
│   │   ├── tools/                   # 工具箱与 API Lab / Mermaid
│   │   ├── notes/                   # 公开记录页
│   │   ├── products/                # 产品目录
│   │   ├── legal/                   # 隐私政策、条款、检查清单
│   │   ├── support/                 # App 支持页
│   │   ├── stepfun/file/            # 保留的历史文件管理入口
│   │   └── api/                     # App Router API
│   ├── lib/
│   │   ├── auth/                    # unified-app-backend 鉴权
│   │   ├── db/                      # 数据库连接、初始化和迁移
│   │   ├── repositories/            # 数据访问层
│   │   ├── models/                  # 类型定义
│   │   └── ws/                      # WebSocket 能力
│   └── config.ts                    # 站点与后端配置
├── public/                          # 静态资源与上传文件
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

## 部署

项目可以通过 Docker Compose 部署，默认将 Next.js 服务暴露在 `3000` 端口：

```bash
docker compose up -d --build aitool
docker exec aitool npm run init-db
```

生产环境建议：

- 使用 Nginx / HTTPS 反向代理到容器 `3000` 端口。
- `.env.local` 只保存在服务器，不提交到仓库。
- 部署前先确认 `DATABASE_URL` 指向正确的生产数据库。
- Casdoor 已不再作为本项目登录依赖。

## 许可证

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。
