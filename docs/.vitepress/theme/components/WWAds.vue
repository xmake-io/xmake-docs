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
    max-width: 350px !important; /* Limit width for better look */
    margin: 20px auto 0;
    display: flex;
    justify-content: center;
    background-color: #f8f9fa; /* Placeholder to verify rendering */
    min-height: 150px;
  }
}
</style>
