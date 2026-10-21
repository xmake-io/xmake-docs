<script setup>
import { ref } from 'vue'
import { useData, withBase } from 'vitepress'
const props = defineProps({ text: String, image: String, title: String })
const dialog = ref(null)
const { lang } = useData()
</script>

<template>
  <button type="button" class="sponsor-trigger" @click="dialog.showModal()">{{ text }}</button>
  <dialog ref="dialog" class="sponsor-dialog" :aria-label="title || text" @click="event => { if (event.target === dialog) dialog.close() }">
    <div class="sponsor-content">
      <div class="sponsor-heading"><strong>{{ title || text }}</strong><button type="button" :aria-label="lang.startsWith('zh') ? '关闭' : 'Close'" @click="dialog.close()">×</button></div>
      <img :src="withBase(image)" :alt="title || text" />
    </div>
  </dialog>
</template>

<style scoped>
.sponsor-trigger { color: var(--vp-c-brand-1); cursor: pointer; font-weight: 600; }
.sponsor-trigger:hover { text-decoration: underline; }
.sponsor-trigger:focus-visible, .sponsor-heading button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 4px; }
.sponsor-dialog { margin: auto; padding: 0; border: 1px solid var(--vp-c-divider); border-radius: 16px; width: min(380px, calc(100vw - 32px)); max-height: 90dvh; color: var(--vp-c-text-1); background: var(--vp-c-bg); box-shadow: 0 24px 80px #0003; }
.sponsor-dialog::backdrop { background: #0006; backdrop-filter: blur(4px); }
.sponsor-content { padding: 20px; }
.sponsor-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
.sponsor-heading button { font-size: 26px; width: 36px; height: 36px; cursor: pointer; border-radius: 8px; }
.sponsor-heading button:hover { background: var(--vp-c-bg-soft); }
.sponsor-content img { display: block; width: 100%; max-height: 65dvh; object-fit: contain; border-radius: 8px; background: white; }
</style>
