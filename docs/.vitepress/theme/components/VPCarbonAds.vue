<script setup lang="ts">
import type { DefaultTheme } from 'vitepress/theme'
import { ref, watch, onMounted } from 'vue'
import { useAside } from 'vitepress/dist/client/theme-default/composables/aside'
import { useData } from 'vitepress/dist/client/theme-default/composables/data'

const { page } = useData()
const props = defineProps<{
  carbonAds: DefaultTheme.CarbonAdsOptions
}>()

const carbonOptions = props.carbonAds

const { isAsideEnabled } = useAside()
const container = ref()

let isInitialized = false

function init() {
  if (!isInitialized) {
    isInitialized = true
    const s = document.createElement('script')
    s.id = '_carbonads_js'
    s.src = `//cdn.carbonads.com/carbon.js?serve=${carbonOptions.code}&placement=${carbonOptions.placement}`
    s.async = true
    container.value.appendChild(s)
  }
}

watch(() => page.value.relativePath, () => {
  if (isInitialized && isAsideEnabled.value) {
    ;(window as any)._carbonads?.refresh()
  }
})

// no need to account for option changes during dev, we can just
// refresh the page
if (carbonOptions) {
  onMounted(() => {
    // if the page is loaded when aside is active, load carbon directly.
    // otherwise, only load it if the page resizes to wide enough. this avoids
    // loading carbon at all on mobile where it's never shown
    if (isAsideEnabled.value) {
      init()
    } else {
      watch(isAsideEnabled, (wide) => wide && init())
    }
  })
}
</script>

<template>
  <div class="VPCarbonAds" ref="container" />
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
