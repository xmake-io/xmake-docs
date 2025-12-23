---
title: Xmake Blog
subtext: Updates, tips & opinions from the Xmake team.
---

<script setup>
import { posts } from '../.vitepress/data/blog-data.js'
import BlogPagination from '../.vitepress/theme/BlogPagination.vue'
</script>

# Xmake Blog

Updates, tips & opinions from the Xmake team.

<BlogPagination :posts="posts" :posts-per-page="10" /> 