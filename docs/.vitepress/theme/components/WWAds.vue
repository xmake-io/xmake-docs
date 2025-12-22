<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://cdn.wwads.cn/js/makemoney.js'
  script.async = true
  script.charset = 'UTF-8'
  document.body.appendChild(script)
})
</script>

<template>
  <div class="wwads-cn wwads-vertical wwads-sticky" data-id="239" style="max-width:180px"></div>
</template>

<style scoped>
.wwads-cn {
  margin-top: 20px;
}
</style>
