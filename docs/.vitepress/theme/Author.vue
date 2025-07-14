<script setup lang="ts">
interface Props {
  author?: string
  twitter?: string
}

defineProps<Props>()
</script>

<template>
  <div v-if="author" class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
    <span>by</span>
    <span v-if="twitter" class="font-medium">
      <a :href="`https://twitter.com/${twitter}`" target="_blank" rel="noopener noreferrer" class="hover:text-gray-700 dark:hover:text-gray-200">
        {{ author }}
      </a>
    </span>
    <span v-else class="font-medium">{{ author }}</span>
  </div>
</template> 