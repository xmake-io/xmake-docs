<script setup lang="ts">
import Date from './Date.vue'
import Author from './Author.vue'
import { data as posts } from './zh-posts.data.js'
import { useData } from 'vitepress'
import { computed, ref } from 'vue'

const { frontmatter } = useData()

// 分页配置
const postsPerPage = 10
const currentPage = ref(1)

// 计算分页数据
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return posts.slice(start, end)
})

const totalPages = computed(() => Math.ceil(posts.length / postsPerPage))

// 分页导航
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPrevPage = () => goToPage(currentPage.value - 1)
const goToNextPage = () => goToPage(currentPage.value + 1)
</script>

<template>
  <div class="divide-y divide-gray-200 dark:divide-slate-200/5">
    <div class="pt-6 pb-8 space-y-2 md:space-y-5">
      <h1
        class="text-3xl leading-9 font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14"
      >
        {{ frontmatter.title }}
      </h1>
      <p class="text-lg leading-7 text-gray-500 dark:text-gray-300">
        {{ frontmatter.subtext }}
      </p>
    </div>
    
    <ul class="divide-y divide-gray-200 dark:divide-slate-200/5">
      <li class="py-12" v-for="{ title, url, date, excerpt, author } of paginatedPosts">
        <article
          class="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline"
        >
          <Date :date="date" />
          <div class="space-y-5 xl:col-span-3">
            <div class="space-y-6">
              <h2 class="text-2xl leading-8 font-bold tracking-tight">
                <a class="text-black dark:text-white hover:text-black dark:hover:text-white font-bold no-underline" 
                   :href="url"
                   style="color: #1f2937 !important; font-weight: bold !important; text-decoration: none !important;"
                   :style="{ color: '#1f2937 !important', fontWeight: 'bold !important', textDecoration: 'none !important' }">
                  {{
                    title
                  }}
                </a>
              </h2>
              <Author :author="author" />
              <div
                v-if="excerpt"
                class="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-300"
                v-html="excerpt"
              ></div>
            </div>
            <div class="text-base leading-6 font-medium">
              <a class="link hover:text-gray-600 dark:hover:text-gray-300" aria-label="read more" :href="url">阅读更多 →</a>
            </div>
          </div>
        </article>
      </li>
    </ul>

    <!-- 分页导航 -->
    <div v-if="totalPages > 1" class="flex justify-center items-center space-x-4 py-8">
      <button
        @click="goToPrevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        上一页
      </button>
      
      <span class="text-sm text-gray-500 dark:text-gray-400">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </span>
      
      <button
        @click="goToNextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<style scoped>
.link {
  @apply text-blue-600 dark:text-blue-400;
}
</style> 