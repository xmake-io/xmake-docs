<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  posts: {
    type: Array,
    required: true
  },
  postsPerPage: {
    type: Number,
    default: 10
  }
})

const currentPage = ref(1)

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * props.postsPerPage
  const end = start + props.postsPerPage
  return props.posts.slice(start, end)
})

const totalPages = computed(() => Math.ceil(props.posts.length / props.postsPerPage))

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPrevPage = () => goToPage(currentPage.value - 1)
const goToNextPage = () => goToPage(currentPage.value + 1)
</script>

<template>
  <div>
    <div v-if="posts.length === 0" class="py-12 text-center text-gray-500">
      No posts found.
    </div>
    
    <div v-else class="divide-y divide-gray-200 dark:divide-slate-200/5">
      <ul class="divide-y divide-gray-200 dark:divide-slate-200/5">
        <li class="py-12" v-for="{ title, url, date, excerpt, author } of paginatedPosts">
          <article class="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
            <div class="space-y-5 xl:col-span-3">
              <div class="space-y-6">
                <h2 class="text-2xl leading-8 font-bold tracking-tight">
                  <a class="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300" :href="url">{{ title }}</a>
                </h2>
                <div class="meta-row flex justify-end items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span v-if="author" class="author">by <span class="font-medium">{{ author }}</span></span>
                  <span class="date"><time :datetime="new Date(date.time).toISOString()">{{ date.string }}</time></span>
                </div>
                <div
                  v-if="excerpt"
                  class="prose dark:prose-invert max-w-none text-gray-500 dark:text-gray-300"
                  v-html="excerpt"
                ></div>
              </div>
              <div class="text-base leading-6 font-medium">
                <a class="text-blue-600 dark:text-blue-400 hover:text-gray-600 dark:hover:text-gray-300" aria-label="read more" :href="url">Read more →</a>
              </div>
            </div>
          </article>
        </li>
      </ul>

      <div v-if="totalPages > 1" class="pagination-nav">
        <button
          @click="goToPrevPage"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          Previous
        </button>
        <span class="pagination-info">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="goToNextPage"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template> 

<style scoped>
.pagination-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
  margin-top: 2.5rem;
}

.pagination-btn {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--vp-c-brand);
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.pagination-btn:disabled {
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination-info {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  min-width: 140px;
  text-align: center;
}
.xl\\:col-span-4.flex.items-center.justify-between {
  margin-bottom: 0.5rem;
}
.xl\\:col-span-4 .ml-auto {
  margin-left: auto;
  text-align: right;
  min-width: 120px;
}
.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.meta-row .author {
  margin-right: 1.5rem;
}
.meta-row .date {
  min-width: 100px;
  text-align: right;
}
</style> 