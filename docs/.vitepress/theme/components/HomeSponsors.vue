<script setup>
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { platinumSponsors, goldSponsors } from '../../data/sponsors'
const props = defineProps({ tier: { type: String, default: 'platinum' } })
const isPlatinum = computed(() => props.tier === 'platinum')
const sponsors = computed(() => isPlatinum.value ? platinumSponsors : goldSponsors)
const titleId = computed(() => `${props.tier}-sponsors-title`)
const { lang } = useData()
const isZh = computed(() => lang.value.startsWith('zh'))
</script>

<template>
  <section class="home-sponsors" :class="tier" :aria-labelledby="titleId">
    <div class="sponsors-inner">
      <h2 :id="titleId">{{ isZh ? (isPlatinum ? '白金赞助商' : '黄金赞助商') : (isPlatinum ? 'Platinum sponsors' : 'Gold sponsors') }}</h2>
      <div class="sponsor-logos">
        <a v-for="sponsor in sponsors" :key="sponsor.name" :href="sponsor.url" target="_blank" rel="sponsored noopener noreferrer" :aria-label="sponsor.name">
          <img :src="withBase(sponsor.logo)" :alt="sponsor.name" :class="{ 'light-logo': sponsor.logoDark }" loading="lazy" width="180" height="64" />
          <img v-if="sponsor.logoDark" class="dark-logo" :src="withBase(sponsor.logoDark)" :alt="sponsor.name" loading="lazy" width="180" height="64" />
        </a>
        <a class="sponsor-placeholder" :href="withBase((isZh ? '/zh' : '') + '/about/sponsor#' + tier + '-sponsor')" :aria-label="isZh ? '在这里展示你的品牌，了解赞助' : 'Your brand here — explore sponsorship'">
          <svg class="placeholder-art" viewBox="0 0 180 64" width="180" height="64" aria-hidden="true">
            <rect class="placeholder-back" x="17" y="15" width="32" height="32" rx="10" transform="rotate(-14 33 31)" />
            <rect class="placeholder-front" x="25" y="17" width="32" height="32" rx="10" />
            <path class="placeholder-mark" d="M36 33h10m-5-5v10" />
            <text x="70" y="38">{{ isZh ? '你的品牌' : 'Your brand' }}</text>
          </svg>
          <span>{{ isZh ? '成为赞助商' : 'Become a sponsor' }} <span aria-hidden="true">↗</span></span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-sponsors { padding: 32px 24px 0; }
.home-sponsors.platinum { padding-top: 48px; }
.sponsors-inner { max-width: 1152px; margin: 0 auto; padding-top: 32px; border-top: 1px solid var(--vp-c-divider); }
h2 { font-size: 18px; line-height: 28px; font-weight: 600; letter-spacing: -.02em; }
a:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 4px; }
.sponsor-logos { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(220px, 100%), 1fr)); gap: 16px; margin-top: 24px; }
.sponsor-logos a { display: flex; align-items: center; justify-content: center; min-height: 128px; padding: 24px; border-radius: 12px; background: var(--vp-c-bg-soft); }
.sponsor-logos img { width: 180px; max-width: 100%; height: 64px; object-fit: contain; }
.sponsor-logos .sponsor-placeholder { position: relative; flex-direction: column; gap: 4px; padding: 16px 24px; border: 1px dashed var(--vp-c-divider); background: linear-gradient(135deg, var(--vp-c-bg-soft), var(--vp-c-bg)); transition: border-color .2s, background-color .2s; }
.sponsor-placeholder:hover { border-color: var(--vp-c-brand-1); background: var(--vp-c-bg-soft); }
.placeholder-art { width: 180px; max-width: 100%; height: 64px; overflow: visible; }
.placeholder-back { fill: var(--vp-c-brand-1); opacity: .12; }
.placeholder-front { fill: var(--vp-c-bg); stroke: var(--vp-c-divider); filter: drop-shadow(0 3px 4px #0000000d); }
.placeholder-mark { fill: none; stroke: var(--vp-c-brand-1); stroke-width: 1.5; stroke-linecap: round; opacity: .7; }
.placeholder-art text { fill: var(--vp-c-text-2); font-family: inherit; font-size: 15px; font-weight: 600; }
.sponsor-placeholder > span { color: var(--vp-c-text-3); font-size: 12px; line-height: 20px; }
.sponsor-placeholder:hover > span { color: var(--vp-c-brand-1); }
.dark-logo { display: none; }
:global(.dark) .light-logo { display: none; }
:global(.dark) .dark-logo { display: block; }
@media (min-width: 640px) { .home-sponsors { padding-inline: 48px; } }
@media (min-width: 960px) { .home-sponsors { padding-inline: 64px; } }
@media (max-width: 639px) {
  .home-sponsors { padding-top: 24px; }
  .home-sponsors.platinum { padding-top: 32px; }
  .sponsors-inner { padding-top: 24px; }
  .sponsor-logos { margin-top: 16px; gap: 12px; }
  .sponsor-logos a { min-height: 112px; padding: 16px; }
}
</style>
