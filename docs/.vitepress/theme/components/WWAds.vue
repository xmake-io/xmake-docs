<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  // Check if script exists, if not append it
  // In SPA, we might need to re-trigger script execution or use a fresh script tag
  // to force WWAds to scan the new DOM element.
  const existingScript = document.getElementById('wwads-script')
  if (existingScript) {
    existingScript.remove()
  }

  const script = document.createElement('script')
  script.id = 'wwads-script'
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
  min-height: 150px; /* Placeholder height */
}
/* Mobile view adjustment */
@media (max-width: 1280px) {
  .wwads-cn {
    width: 100% !important;
    max-width: 350px !important;
    margin: 20px auto 0;
    display: flex;
    justify-content: center;
    min-height: auto !important;
  }
}
</style>
