# Xmake 博客系统

这是一个基于 VitePress 的博客系统，支持自动从 markdown 文件生成博客列表。

## 功能特性

- ✅ 自动读取 `docs/posts` 和 `docs/zh/posts` 目录下的 markdown 文件
- ✅ 支持 frontmatter 解析（标题、日期、作者、标签、摘要）
- ✅ 分页显示（每页 10 篇文章）
- ✅ 响应式设计
- ✅ 支持中英文双语
- ✅ 自动排序（按日期倒序）

## 使用方法

### 1. 添加新文章

在 `docs/posts` 目录下创建新的 markdown 文件，格式如下：

```markdown
---
title: "文章标题"
date: "2024-01-15"
author: "作者名"
tags: ["标签1", "标签2"]
excerpt: "文章摘要（可选）"
---

文章内容...
```

### 2. 生成博客数据

运行以下命令生成博客数据：

```bash
npm run generate-blog
```

或者直接运行：

```bash
node scripts/generate-blog-data.js
```

### 3. 启动开发服务器

```bash
npm run docs:dev
```

这会自动生成博客数据并启动开发服务器。

### 4. 构建生产版本

```bash
npm run docs:build
```

## 文件结构

```
docs/
├── posts/                    # 英文博客文章
│   ├── xmake-3-0-release.md
│   ├── building-cross-platform-apps.md
│   └── ...
├── zh/posts/                 # 中文博客文章
│   ├── xmake-3-0-release.md
│   ├── cross-platform-development.md
│   └── ...
├── blog/
│   └── index.md             # 英文博客首页
├── zh/blog/
│   └── index.md             # 中文博客首页
└── .vitepress/
    └── theme/
        ├── blog-data.js      # 英文博客数据（自动生成）
        └── zh-blog-data.js   # 中文博客数据（自动生成）

scripts/
└── generate-blog-data.js     # 博客数据生成脚本
```

## Frontmatter 字段说明

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `title` | string | ✅ | 文章标题 |
| `date` | string | ✅ | 发布日期（YYYY-MM-DD 格式） |
| `author` | string | ❌ | 作者名称 |
| `tags` | array | ❌ | 标签数组 |
| `excerpt` | string | ❌ | 文章摘要，如果不提供会自动生成 |

## 注意事项

1. **自动生成**: 每次运行 `npm run docs:dev` 或 `npm run docs:build` 时，系统会自动重新生成博客数据
2. **文件命名**: 建议使用有意义的文件名，因为 URL 会基于文件名生成
3. **日期格式**: 日期必须使用 `YYYY-MM-DD` 格式
4. **编码**: 确保 markdown 文件使用 UTF-8 编码

## 故障排除

如果遇到问题：

1. 确保所有 markdown 文件都有正确的 frontmatter
2. 检查文件编码是否为 UTF-8
3. 确保 `gray-matter` 包已正确安装
4. 查看控制台错误信息

## 自定义

可以通过修改以下文件来自定义博客系统：

- `scripts/generate-blog-data.js`: 修改数据生成逻辑
- `docs/blog/index.md` 和 `docs/zh/blog/index.md`: 修改博客页面布局
- CSS 样式可以通过 VitePress 主题配置进行自定义 