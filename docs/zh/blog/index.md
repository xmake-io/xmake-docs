---
title: Xmake 博客
subtext: Xmake 团队的更新、技巧和观点。
---

<script setup>
import { posts } from '../../.vitepress/data/zh-blog-data.js'
import BlogPaginationZh from '../../.vitepress/theme/BlogPaginationZh.vue'
</script>

# Xmake 博客

Xmake 团队的更新、技巧和观点。

<BlogPaginationZh :posts="posts" :posts-per-page="10" /> 