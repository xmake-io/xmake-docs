<script setup lang="ts">
import type { DefaultTheme } from 'vitepress/theme'
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useData } from 'vitepress/dist/client/theme-default/composables/data'
import { registerCarbonSlot } from '../carbonAds'
const { page } = useData()
const props = defineProps<{ carbonAds: DefaultTheme.CarbonAdsOptions; mobileFooter?: boolean; mobileSidebar?: boolean }>()
const container = ref<HTMLElement>()
let slot: ReturnType<typeof registerCarbonSlot> | undefined
const longArticle = ref(false)
let resizeObserver: ResizeObserver | undefined
let sidebarObserver: MutationObserver | undefined
let sidebar: HTMLElement | null = null
function register() {
  slot?.dispose()
  if (!container.value) return
  slot = registerCarbonSlot(container.value, {
    ...props.carbonAds, path: page.value.relativePath,
    minWidth: props.mobileFooter || (props.mobileSidebar && longArticle.value) ? 0 : 960,
  })
}
function measure() {
  const article = document.querySelector('.VPDoc .vp-doc')
  // Pages without a navigation drawer retain their footer placement.
  const next = !!document.querySelector('.VPSidebar') && (article?.getBoundingClientRect().height || 0) > window.innerHeight * 2
  if (next !== longArticle.value) {
    longArticle.value = next
    nextTick(register)
  }
}
async function observeArticle() {
  await nextTick()
  resizeObserver?.disconnect()
  const article = document.querySelector('.VPDoc .vp-doc')
  if (article) resizeObserver?.observe(article)
  measure()
  slot?.update(page.value.relativePath)
}
onMounted(() => {
  resizeObserver = new ResizeObserver(measure)
  window.addEventListener('resize', measure)
  sidebar = document.querySelector('.VPSidebar')
  if (props.mobileSidebar && sidebar) {
    sidebarObserver = new MutationObserver(register)
    sidebarObserver.observe(sidebar, { attributes: true, attributeFilter: ['class'] })
    sidebar.addEventListener('transitionend', register)
  }
  register()
  observeArticle()
})
watch(() => page.value.relativePath, observeArticle, { flush: 'post' })
onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  sidebarObserver?.disconnect()
  window.removeEventListener('resize', measure)
  sidebar?.removeEventListener('transitionend', register)
  slot?.dispose()
})
</script>

<template>
  <div class="VPCarbonAds" :class="{ 'carbon-mobile-footer': mobileFooter, 'carbon-hide-mobile': (mobileFooter && longArticle) || (mobileSidebar && !longArticle) }" ref="container" />
</template>

<style scoped>
.VPCarbonAds {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  border-radius: 12px;
  max-width: 300px;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  font-weight: 500;
  background-color: var(--vp-carbon-ads-bg-color);
  min-height: 150px;
}

/* Mobile view adjustment */
@media (max-width: 1280px) {
  .VPCarbonAds {
    width: 100% !important;
    max-width: 350px !important;
    margin: 20px auto 0;
    float: none !important;
  }
}

.VPCarbonAds :deep(img) {
  margin: 0 auto;
  border-radius: 6px;
}

.VPCarbonAds :deep(.carbon-text) {
  display: block;
  margin: 0 auto;
  padding-top: 12px;
  color: var(--vp-carbon-ads-text-color);
  transition: color 0.25s;
}

.VPCarbonAds :deep(.carbon-text:hover) {
  color: var(--vp-carbon-ads-hover-text-color);
}

.VPCarbonAds :deep(.carbon-poweredby) {
  display: block;
  padding-top: 6px;
  font-size: 11px;
  font-weight: 500;
  color: var(--vp-carbon-ads-poweredby-color);
  text-transform: uppercase;
  transition: color 0.25s;
}

.VPCarbonAds :deep(.carbon-poweredby:hover) {
  color: var(--vp-carbon-ads-hover-poweredby-color);
}

.VPCarbonAds :deep(> div) {
  display: none;
}

.VPCarbonAds :deep(> div:first-of-type) {
  display: block;
}

#carbonads * {
  margin: initial;
  padding: initial;
}

#carbonads {
  max-width: 330px;
  background-color: #fafafa;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", Helvetica, Arial,
    sans-serif;
}

#carbonads a {
  color: inherit;
  text-decoration: none;
}

#carbonads a:hover {
  color: inherit;
}

#carbonads span {
  display: block;
  position: relative;
  overflow: hidden;
}

#carbonads .carbon-wrap {
  display: flex;
}

#carbonads .carbon-img img {
  display: block;
}

#carbonads .carbon-text {
  align-self: center;
  margin-bottom: 20px;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.5;
  text-align: left;
}

#carbonads .carbon-poweredby {
  display: block;
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 6px 8px;
  border-top-left-radius: 3px;
  background-color: #f1f1f1;
  font-size: 8px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.5px;
  text-align: center;
  text-transform: uppercase;
}
</style>

<style scoped>
.VPCarbonAds.carbon-mobile-footer { display: none; }
@media (max-width: 959px) {
  .VPCarbonAds.carbon-mobile-footer {
    display: flex;
    width: 100%;
    max-width: 400px !important;
    margin: 24px auto;
    padding: 12px;
    min-height: 0;
  }
  .carbon-mobile-footer :deep(.carbon-wrap) { display: flex; align-items: center; gap: 12px; }
  .carbon-mobile-footer :deep(.carbon-img) { flex: 0 0 130px; }
  .carbon-mobile-footer :deep(.carbon-img img) { width: 130px; height: auto; }
  .carbon-mobile-footer :deep(.carbon-text) { padding: 0; text-align: left; min-width: 0; }
}
</style>

<style scoped>
@media (max-width: 959px) {
  .VPCarbonAds.carbon-hide-mobile { display: none; }
}
</style>
