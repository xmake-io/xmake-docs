<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useAside } from 'vitepress/dist/client/theme-default/composables/aside'
import VPDocAsideOutline from 'vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue'
import VPCarbonAds from './VPCarbonAds.vue'
import WWAds from './WWAds.vue'

const { theme, page, lang } = useData()
const { isAsideEnabled } = useAside()

// Check if current page is a blog post article
const isPost = computed(() => {
  const path = page.value.relativePath || page.value.filePath || ''
  const routePath = page.value.route || ''
  
  // Post pages are in /posts/ directory, but not the list pages
  const isPostPath = (path.includes('/posts/') || path.startsWith('posts/')) && 
                     path.endsWith('.md') &&
                     path !== 'posts.md' && 
                     path !== 'posts/index.md' &&
                     path !== 'blog.md' &&
                     path !== 'blog/index.md'
  
  const isPostRoute = routePath.includes('/posts/') && 
                      routePath !== '/posts' && 
                      routePath !== '/posts/' &&
                      routePath !== '/blog' &&
                      routePath !== '/blog/'
  
  return isPostPath || isPostRoute
})

const isBlogHome = computed(() => {
  const path = page.value.relativePath || page.value.filePath || ''
  return path === 'blog.md' || path === 'blog/index.md'
})

const isZh = computed(() => {
  return lang.value === 'zh' || 
         lang.value === 'zh-CN' || 
         page.value.relativePath.startsWith('zh/') || 
         page.value.filePath.includes('/zh/')
})
</script>

<template>
  <div class="VPDocAside">
    <slot name="aside-top" />
    <!-- Show carbonAds at the top of right sidebar, only for post pages -->
    <VPCarbonAds 
      v-if="(isPost || isBlogHome) && theme.carbonAds && isAsideEnabled" 
      :carbon-ads="theme.carbonAds" 
    />

    <slot name="aside-outline-before" />
    <VPDocAsideOutline />
    <slot name="aside-outline-after" />

    <div class="spacer" />

    <slot name="aside-bottom" />
    
    <div class="aside-wwads-wrapper">
      <div v-if="isZh">
        <WWAds />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hide aside ads on small screens to avoid duplication with doc-after ads */
@media (max-width: 1280px) {
  .aside-wwads-wrapper {
    display: none;
  }
}
</style>

