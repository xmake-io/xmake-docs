<template>
  <h1 v-if="showTitle && title" :id="titleId" tabindex="-1">
    {{ title }}
    <a class="header-anchor" :href="`#${titleId}`" :aria-label="`Permalink to "${title}"`">​</a>
  </h1>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

const title = computed(() => frontmatter.value.title)
const showTitle = computed(() => {
  const path = page.value.relativePath || ''
  return path.includes('/posts/') && title.value
})

const titleId = computed(() => {
  if (!title.value) return ''
  // Generate a URL-friendly ID from the title
  return title.value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
})
</script>

