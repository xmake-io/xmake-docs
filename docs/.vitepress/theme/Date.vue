<script setup lang="ts">
interface Props {
  date: {
    time: number
    string: string
  }
}

defineProps<Props>()
</script>

<template>
  <dl class="text-base leading-6 font-medium leading-6 text-gray-500 dark:text-gray-300">
    <dt class="sr-only">Published on</dt>
    <dd class="text-base leading-6 font-medium leading-6 text-gray-500 dark:text-gray-300">
      <time :datetime="new Date(date.time).toISOString()">{{ date.string }}</time>
    </dd>
  </dl>
</template> 