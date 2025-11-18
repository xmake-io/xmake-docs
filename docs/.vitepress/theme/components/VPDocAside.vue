<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import VPDocAsideOutline from 'vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue'
import VPCarbonAds from './VPCarbonAds.vue'

const { theme, page } = useData()

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

</script>

<template>
  <div class="VPDocAside">
    <slot name="aside-top" />

    <!-- Show carbonAds at the top of right sidebar, only for post pages -->
    <VPCarbonAds 
      v-if="isPost && theme.carbonAds" 
      :carbon-ads="theme.carbonAds" 
    />

    <slot name="aside-outline-before" />
    <VPDocAsideOutline />
    <slot name="aside-outline-after" />

    <div class="spacer" />

    <slot name="aside-bottom" />
  </div>
</template>

