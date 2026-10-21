<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import SponsorButton from './SponsorButton.vue'
const { lang } = useData()
const isZh = computed(() => lang.value.startsWith('zh'))
</script>

<template>
  <div class="sponsor-channels">
    <template v-if="isZh">
      <div class="channel"><strong>微信</strong><span>扫码赞助，自选金额</span><SponsorButton text="查看微信二维码" title="微信赞助" image="/assets/img/weixin.png" /></div>
      <div class="channel"><strong>支付宝</strong><span>扫码赞助，自选金额</span><SponsorButton text="查看支付宝二维码" title="支付宝赞助" image="/assets/img/alipay.png" /></div>
    </template>
    <template v-else>
      <a class="channel" href="https://github.com/sponsors/waruqi" target="_blank" rel="noopener noreferrer"><strong>GitHub Sponsors <span aria-hidden="true">↗</span></strong><span>Support directly on GitHub</span><b>Become a sponsor</b></a>
      <a class="channel" href="https://opencollective.com/xmake" target="_blank" rel="noopener noreferrer"><strong>OpenCollective <span aria-hidden="true">↗</span></strong><span>Contribute to the project fund</span><b>Make a contribution</b></a>
      <a class="channel" href="https://paypal.me/tboox/5" target="_blank" rel="noopener noreferrer"><strong>PayPal <span aria-hidden="true">↗</span></strong><span>Send a personal contribution</span><b>Support with PayPal</b></a>
    </template>
  </div>
</template>

<style scoped>
.sponsor-channels { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 24px 0; }
.channel { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 20px; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); text-decoration: none !important; }
.channel strong { color: var(--vp-c-text-1); font-size: 16px; }
.channel > span { color: var(--vp-c-text-2); font-size: 13px; line-height: 1.6; }
.channel b, .channel :deep(.sponsor-trigger) { margin-top: auto; padding-top: 12px; font-size: 14px; color: var(--vp-c-brand-1); }
a.channel:hover { border-color: var(--vp-c-brand-1); }
a.channel:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
</style>
