import {
  defineConfig,
  resolveSiteDataByRoute,
  type HeadConfig
} from 'vitepress'

import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { fileURLToPath, URL } from 'node:url'

import llmstxt from 'vitepress-plugin-llms'
import { addTitleFromFrontmatter } from './plugins/add-title'

export default defineConfig({
  title: "Xmake",
  metaChunk: true,

  markdown: {
    config(md) {
      // Add title from frontmatter plugin FIRST, before other plugins
      // Process all files - the function will check if title should be added
      const originalParse = md.parse.bind(md)
      md.parse = (src: string, env: any) => {
        // Always process - addTitleFromFrontmatter will check if title exists
        // and content doesn't already start with H1
        const processedSrc = addTitleFromFrontmatter(src)
        return originalParse(processedSrc, env)
      }
      
      md.use(groupIconMdPlugin, {
        titleBar: {
          includeSnippet: true,
        },
      })
    },
  },

  sitemap: {
    hostname: 'https://xmake.io',
    transformItems(items) {
      return items.filter((item) => !item.url.includes('migration'))
    }
  },

  head: [
    [
      'link',
      { rel: 'icon', type: 'image/svg+xml', href: '/assets/img/logo.svg' }
    ],
    [
      'link',
      { rel: 'icon', type: 'image/png', href: '/assets/img/logo.png' }
    ],
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Xmake' }],
    ['meta', { property: 'og:url', content: 'https://xmake.io/' }],
    ['meta', { name: 'algolia-site-verification', content: '47A51984C60C423B' }]
  ],

  themeConfig: {
    logo: { src: '/assets/img/logo.svg', width: 24, height: 24 },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xmake-io/xmake' },
      { icon: 'twitter', link: 'https://twitter.com/waruqi' },
      { icon: 'discord', link: 'https://discord.gg/xmake' }
    ],

    search: {
      provider: 'local',
      options: {
        searchOptions: {
          detailedView: true
        }
      }
    },

    /*
    search: {
      provider: 'algolia',
      options: {
        appId: 'BML13VM9HE',
        apiKey: '2c01bab700081b9d4322ce0c65ab3bfd',
        indexName: 'xmake'
      }
    },*/

    carbonAds: { code: 'CE7I52QU', placement: 'xmakeio' }
  },

  vite: {
    plugins: [
      groupIconVitePlugin(),
      llmstxt()
    ],
    experimental: {
      enableNativePlugin: true
    },
    resolve: {
      alias: [
        {
          find: /^.*\/VPDocAside\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPDocAside.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPSidebar\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPSidebar.vue', import.meta.url)
          )
        },
        {
          find: /^.*\/VPCarbonAds\.vue$/,
          replacement: fileURLToPath(
            new URL('./theme/components/VPCarbonAds.vue', import.meta.url)
          )
        }
      ]
    }
  },

  locales: {
    root: { label: 'English' },
    zh: { label: '简体中文' }
  },

  transformPageData: (pageData, ctx) => {
    const site = resolveSiteDataByRoute(
      ctx.siteConfig.site,
      pageData.relativePath
    )
    const title = `${pageData.title || site.title} | ${pageData.description || site.description}`
    ;((pageData.frontmatter.head ??= []) as HeadConfig[]).push(
      ['meta', { property: 'og:locale', content: site.lang }],
      ['meta', { property: 'og:title', content: title }]
    )
  }
})
