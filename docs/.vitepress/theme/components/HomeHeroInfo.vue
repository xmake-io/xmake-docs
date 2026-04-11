<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { xmakeRelease } from '../../data/xmake-release.js'

type HeroConfig = {
  name?: string
  text?: string
  tagline?: string
}

const { frontmatter, lang, page } = useData()

const hero = computed<HeroConfig>(() => {
  const heroConfig = frontmatter.value.hero
  if (!heroConfig || typeof heroConfig !== 'object') {
    return {}
  }
  return heroConfig as HeroConfig
})

const isZh = computed(() => {
  return lang.value === 'zh' || lang.value === 'zh-CN' || page.value.relativePath.startsWith('zh/')
})

const releaseTag = computed(() => xmakeRelease.tagName.trim())
const releaseUrl = computed(() => xmakeRelease.url || 'https://github.com/xmake-io/xmake/releases/latest')
const badgeTitle = computed(() => {
  if (!releaseTag.value) {
    return ''
  }
  return isZh.value ? `查看 ${releaseTag.value} 发布说明` : `View ${releaseTag.value} release notes`
})
</script>

<template>
  <h1 class="heading">
    <span v-if="hero.name" class="xmake-hero-name">
      <span v-html="hero.name" class="name clip"></span>
      <a
        v-if="releaseTag"
        class="xmake-release-badge"
        :href="releaseUrl"
        target="_blank"
        rel="noreferrer"
        :title="badgeTitle"
        :aria-label="badgeTitle"
      >
        {{ releaseTag }}
      </a>
    </span>
    <span v-if="hero.text" v-html="hero.text" class="text"></span>
  </h1>
  <p v-if="hero.tagline" v-html="hero.tagline" class="tagline"></p>
</template>

<style scoped>
.heading {
  display: flex;
  flex-direction: column;
}

.xmake-hero-name {
  display: inline-block;
  width: fit-content;
  max-width: 392px;
  letter-spacing: -0.4px;
  line-height: 40px;
  font-size: 32px;
  font-weight: 700;
  white-space: pre-wrap;
}

.name {
  color: var(--vp-home-hero-name-color);
}

.text {
  width: fit-content;
  max-width: 392px;
  letter-spacing: -0.4px;
  line-height: 40px;
  font-size: 32px;
  font-weight: 700;
  white-space: pre-wrap;
}

.name:lang(ja),
.text:lang(ja) {
  font-feature-settings: 'palt';
  word-break: auto-phrase;
}

.clip {
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: var(--vp-home-hero-name-color);
}

.tagline {
  padding-top: 8px;
  max-width: 392px;
  line-height: 28px;
  font-size: 18px;
  font-weight: 500;
  white-space: pre-wrap;
  color: var(--vp-c-text-2);
}

.xmake-release-badge {
  position: relative;
  top: -1.9em;
  margin-left: 0.04em;
  padding: 0.05em 0.16em;
  border-radius: 0.45em;
  background: transparent;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 0.16em;
  white-space: nowrap;
  font-size: 0.26em;
  line-height: 1;
  font-weight: 700;
  letter-spacing: 0.01em;
  font-variant-numeric: tabular-nums;
  transition: background-color 0.2s ease, color 0.2s ease, text-decoration-color 0.2s ease;
}

.xmake-release-badge:hover {
  background: rgba(66, 211, 146, 0.12);
  color: var(--vp-c-brand-2);
  text-decoration-color: currentColor;
}

@media (min-width: 640px) {
  .xmake-hero-name,
  .text {
    max-width: 576px;
    line-height: 56px;
    font-size: 48px;
  }

  .tagline {
    padding-top: 12px;
    max-width: 576px;
    line-height: 32px;
    font-size: 20px;
  }
}

@media (min-width: 960px) {
  .xmake-hero-name,
  .text {
    line-height: 64px;
    font-size: 56px;
  }

  .tagline {
    line-height: 36px;
    font-size: 24px;
  }
}
</style>