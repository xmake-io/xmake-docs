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
const badgeLabel = computed(() => (isZh.value ? '最新' : 'release'))
const badgeTitle = computed(() => {
  if (!releaseTag.value) {
    return ''
  }
  return isZh.value ? `查看 ${releaseTag.value} 发布说明` : `View ${releaseTag.value} release notes`
})
</script>

<template>
  <h1 class="heading">
    <span class="xmake-hero-name-row">
      <span v-if="hero.name" v-html="hero.name" class="name clip"></span>
      <a
        v-if="releaseTag"
        class="xmake-release-badge"
        :href="releaseUrl"
        target="_blank"
        rel="noreferrer"
        :title="badgeTitle"
        :aria-label="badgeTitle"
      >
        <span class="xmake-release-label">{{ badgeLabel }}</span>
        <span class="xmake-release-version">{{ releaseTag }}</span>
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

.xmake-hero-name-row {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 12px;
  width: fit-content;
  max-width: 100%;
}

.name,
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

.name {
  color: var(--vp-home-hero-name-color);
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
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 7px;
  padding: 0 12px;
  min-height: 30px;
  border: 1px solid rgba(66, 211, 146, 0.28);
  border-radius: 999px;
  background: rgba(66, 211, 146, 0.1);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}

.xmake-release-badge:hover {
  border-color: rgba(66, 211, 146, 0.44);
  background: rgba(66, 211, 146, 0.16);
  transform: translateY(-1px);
}

.xmake-release-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

.xmake-release-version {
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

@media (min-width: 640px) {
  .name,
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

  .xmake-release-badge {
    margin-top: 11px;
    min-height: 34px;
    padding: 0 14px;
  }

  .xmake-release-label {
    font-size: 12px;
  }

  .xmake-release-version {
    font-size: 14px;
  }
}

@media (min-width: 960px) {
  .name,
  .text {
    line-height: 64px;
    font-size: 56px;
  }

  .tagline {
    line-height: 36px;
    font-size: 24px;
  }

  .xmake-release-badge {
    margin-top: 14px;
  }
}
</style>