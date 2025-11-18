<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

const showTitle = computed(() => {
  const path = page.value.relativePath || page.value.filePath || ''
  // Check if it's a posts file
  const isPost = path.includes('/posts/')
  return isPost && !!title.value
})

const title = computed(() => frontmatter.value.title)

const titleId = computed(() => {
  if (!title.value) return ''
  return title.value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
})
</script>

<template>
  <div class="vp-doc-wrapper">
    <h1 v-if="showTitle" :id="titleId" tabindex="-1" class="vp-doc-title">
      {{ title }}
      <a class="header-anchor" :href="`#${titleId}`" :aria-label="'Permalink to ' + title">​</a>
    </h1>
    <slot />
  </div>
</template>

<style scoped>
.vp-doc-wrapper {
  width: 100%;
}

.vp-doc-title {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.25;
}
</style>

