<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
const { lang } = useData()
const isZh = computed(() => lang.value.startsWith('zh'))
</script>

<template>
  <div class="sponsor-prompt">
    <p>{{ isZh ? 'Xmake 帮你简化了构建？你的支持能让维护与改进持续下去。' : 'Has Xmake made your builds easier? Help keep its development going.' }}</p>
    <a :href="withBase((isZh ? '/zh' : '') + '/about/sponsor')">{{ isZh ? '支持 Xmake' : 'Sponsor Xmake' }} <span aria-hidden="true">→</span></a>
  </div>
</template>

<style scoped>
.sponsor-prompt { display: flex; align-items: center; gap: 16px; justify-content: space-between; margin-bottom: 24px; padding: 16px 20px; border-radius: 10px; background: var(--vp-c-bg-soft); }
p { margin: 0; color: var(--vp-c-text-2); font-size: 13px; line-height: 22px; }
a { flex-shrink: 0; font-size: 13px; font-weight: 600; color: var(--vp-c-brand-1); }
a:hover { text-decoration: underline; }
a:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 4px; }
@media (max-width: 639px) { .sponsor-prompt { flex-direction: column; align-items: flex-start; gap: 8px; } }
</style>
