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
  <div class="wwads-cn wwads-vertical" data-id="239" style="max-width:200px"></div>
</template>

<style scoped>
.wwads-cn {
  margin-top: 20px;
}
/* Mobile view adjustment */
@media (max-width: 1280px) {
  .wwads-cn {
    width: 100% !important;
    max-width: 100% !important;
    margin: 20px auto 0;
    display: flex;
    justify-content: center;
  }
}
</style>
