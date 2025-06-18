import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Xmake",
  description: "A cross-platform build utility based on Lua",
  lang: 'en-US',

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

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Sponsor', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    editLink: {
      repo: 'xmake-docs/docs',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xmake-io/xmake' },
      { icon: 'twitter', link: 'https://twitter.com/waruqi' },
      { icon: 'discord', link: 'https://discord.gg/xmake' }
    ],

    search: {
      provider: 'algolia',
      options: {
        appId: '',
        apiKey: '',
        indexName: 'xmake'
      }
    },

    carbonAds: { code: 'CEBDT27Y', placement: 'xmakeio' }
  },

  locales: {
    root: { label: 'English' },
    zh: { label: '简体中文' }
  }
})
