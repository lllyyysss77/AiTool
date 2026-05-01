# 记录模块内容规范

这份文档是 `AiTool` 仓里对 `/notes` 记录模块的显示契约。

- `AiTool` 负责渲染和样式
- `AiTool-content` 负责文章内容
- **内容仓怎么写，可以自由演化；但能稳定显示什么，要以这份文档为准**

## 1. 设计目标

记录模块不是“默认博客模板”。

目标是做成更像编辑型文档的页面：

- 允许长文
- 允许图文混排
- 允许音频与视频嵌入
- 允许强调块、判断块、引用块
- 页面要适合做“公开工作笔记 / 产品记录 / 个人随笔”

## 2. 当前渲染栈

`/notes/[slug]` 当前使用的开源渲染链：

- `react-markdown`
- `remark-gfm`
- `remark-directive`
- `rehype-raw`
- `rehype-highlight`
- `rehype-slug`
- `rehype-autolink-headings`

这意味着我们已经不是“纯 Markdown 文本页”，而是一个基于 unified 生态的可扩展内容渲染器。

## 3. Frontmatter 规范

每篇文章必须包含：

```yaml
---
title: 标题
date: 2026-05-02
tags: [产品, AI, daily]
cover: https://cdn.example.com/cover.jpg
excerpt: 一句话摘要
draft: false
---
```

约束：

- `title` 必填
- `date` 必填，格式必须是 `YYYY-MM-DD`
- `tags` 推荐填写，顶部快捷视图会按 tag 过滤
- `cover` 可选，用于列表卡片
- `excerpt` 可选，不写时会取正文首段
- `draft: true` 时不展示

## 4. 正文写法

### 4.1 普通 Markdown

支持：

- 标题
- 列表
- 表格
- 任务列表
- 引用
- 代码块
- 删除线
- 脚注

### 4.2 图片

普通图片：

```md
![封面草图](https://cdn.example.com/idea.jpg)
```

需要说明文字时，优先用原始 HTML：

```html
<figure>
  <img src="https://cdn.example.com/idea.jpg" alt="封面草图" />
  <figcaption>第一版视觉草图，重点不是 UI，而是信息层次。</figcaption>
</figure>
```

### 4.3 音频

```html
<figure>
  <audio controls src="https://cdn.example.com/demo.mp3"></audio>
  <figcaption>这段音频是当天实验出来的第一版播报效果。</figcaption>
</figure>
```

### 4.4 原生视频

```html
<figure>
  <video controls src="https://cdn.example.com/demo.mp4"></video>
  <figcaption>本地录屏，展示用户路径。</figcaption>
</figure>
```

### 4.5 YouTube / Bilibili 嵌入

推荐使用指令语法，而不是手写 iframe。

YouTube：

```md
::youtube[这条视频是这次更新的完整演示]{#VIDEO_ID}
```

Bilibili：

```md
::bilibili[B 站备份版本]{#BV1xx411c7mD}
```

### 4.6 Callout 强调块

可用于结论、提醒、判断、引用。

```md
:::note{title="结论"}
这一版应该先把内容仓独立，而不是把记录模块拆成单独服务。
:::

:::tip{title="写法建议"}
一节只放一个核心判断，不要把 6 个观点塞进同一个段落。
:::

:::warn{title="注意"}
不要把本地素材路径直接写进正文；正文里应该永远放可公开访问的 URL。
:::

:::quote{title="原话"}
这个页面的目标不是 CMS，而是一个长期公开笔记界面。
:::
```

## 5. 推荐版式

每篇文章建议按这个顺序组织：

1. 标题
2. 开头摘要段
3. 第一屏主图 / 主视频 / 主音频
4. 2-5 个分节
5. 每节只讲一个判断
6. 结尾给出结论或下一步

不推荐：

- 一屏全是截图，没有解释
- 大段流水账
- 连续多个嵌入视频
- 过多 emoji 或装饰符号
- 在 Markdown 里写内联样式

## 6. 内容更新流程

推荐流程：

1. 在 `AiTool-content/posts/*.md` 写文章
2. 在 `AiTool` 里本地预览 `http://localhost:3002/notes`
3. 检查标题层级、媒体尺寸、标签、摘要
4. 满意后再提交内容仓

## 7. 后续可继续增强

如果还要继续提升质感，优先加这些能力，而不是重写整套记录模块：

- 图片组 / gallery 指令
- 引用卡片 / 链接卡片
- 代码块标题与文件名
- 自动目录
- 脚注浮层
- 音频 / 视频封面卡片

原则：

- **继续用 Markdown + unified 生态扩展**
- **不要把记录模块做成重 CMS**
- **先保证写作流畅，再增加表达能力**
