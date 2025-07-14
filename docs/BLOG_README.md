# Xmake Blog System

This document describes how to use the blog system for the Xmake documentation site.

## Overview

The blog system is built using VitePress and automatically generates blog pages from markdown files in the `docs/posts/` and `docs/zh/posts/` directories.

## Features

- **Automatic Post Discovery**: Blog posts are automatically discovered from markdown files
- **Pagination**: Blog pages support pagination with 10 posts per page
- **Multi-language Support**: Separate blogs for English and Chinese
- **Author Information**: Display author names and optional Twitter links
- **Tags Support**: Posts can be tagged for categorization
- **Excerpt Generation**: Automatic excerpt generation from post content
- **Responsive Design**: Mobile-friendly layout

## Directory Structure

```
docs/
├── posts/           # English blog posts
├── zh/posts/        # Chinese blog posts
├── blog/            # English blog index
│   └── index.md
├── zh/blog/         # Chinese blog index
│   └── index.md
└── .vitepress/
    └── theme/
        ├── posts.data.ts      # English posts data loader
        ├── zh-posts.data.ts   # Chinese posts data loader
        ├── BlogHome.vue       # English blog home component
        ├── ZhBlogHome.vue     # Chinese blog home component
        ├── Date.vue           # Date display component
        └── Author.vue         # Author display component
```

## Creating Blog Posts

### English Posts

Create markdown files in `docs/posts/` with the following frontmatter:

```markdown
---
title: Your Post Title
date: 2024-01-15
author: Author Name
tags: [tag1, tag2, tag3]
---

Your post content here...
```

### Chinese Posts

Create markdown files in `docs/zh/posts/` with the same frontmatter structure:

```markdown
---
title: 您的文章标题
date: 2024-01-15
author: 作者姓名
tags: [标签1, 标签2, 标签3]
---

您的文章内容...
```

## Frontmatter Fields

- `title` (required): The title of the blog post
- `date` (required): Publication date in YYYY-MM-DD format
- `author` (optional): Author name
- `tags` (optional): Array of tags for categorization

## Blog URLs

- English blog: `/blog/`
- Chinese blog: `/zh/blog/`

## Navigation

Blog links are automatically added to the navigation menu:
- English: "Blog" in the main navigation
- Chinese: "博客" in the main navigation

## Styling

The blog uses Tailwind CSS classes for styling and supports both light and dark themes. The design is responsive and mobile-friendly.

## Customization

### Changing Posts Per Page

Edit the `postsPerPage` variable in the blog home components:
- English: `docs/.vitepress/theme/BlogHome.vue`
- Chinese: `docs/.vitepress/theme/ZhBlogHome.vue`

### Modifying the Layout

The blog layout can be customized by editing the Vue components in `docs/.vitepress/theme/`.

### Adding New Features

To add new features like search, categories, or RSS feeds, you can extend the existing components or create new ones.

## Development

To run the development server:

```bash
npm run docs:dev
```

To build for production:

```bash
npm run docs:build
```

## Example Posts

The system includes several example posts to demonstrate the functionality:

### English Posts
- `docs/posts/xmake-3-0-release.md`
- `docs/posts/building-cross-platform-apps.md`
- `docs/posts/post-3.md` through `docs/posts/post-5.md`

### Chinese Posts
- `docs/zh/posts/xmake-3-0-release.md`
- `docs/zh/posts/cross-platform-development.md`
- `docs/zh/posts/post-3.md` through `docs/zh/posts/post-5.md`

## Generating Sample Posts

You can generate additional sample posts using the provided script:

```bash
node scripts/generate-blog-posts.js
```

This will create additional posts to test pagination and other features. 