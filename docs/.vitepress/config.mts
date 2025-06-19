import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Xmake",
  description: "A cross-platform build utility based on Lua",
  lang: 'en-US',

  sitemap: {
    hostname: 'https://newdocs.xmake.io',
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

    nav: [
    {
        text: 'Docs',
        activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
        items: [
          { text: 'Guide', link: '/guide/introduction' },
          { text: 'Examples', link: '/examples/' },
          { text: 'Quick Start', link: '/guide/quick-start' },
          { text: 'API Reference', link: '/api/' }
        ]
      },
      { text: 'Sponsor', link: '/about/sponsor' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/test1' },
          { text: 'Runtime API Examples', link: '/test2' },
          { text: 'Runtime API Examples', link: '/test3' },
          { text: 'Runtime API Examples', link: '/test4' },
          { text: 'Runtime API Examples', link: '/test5' },
          { text: 'Runtime API Examples', link: '/test6' },
          { text: 'Runtime API Examples', link: '/test7' },
          { text: 'Runtime API Examples', link: '/test8' },
          { text: 'Runtime API Examples', link: '/test9' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    editLink: {
      pattern: 'https://github.com/xmake-io/xmake-docs/edit/master/docs/:path',
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
        appId: 'BML13VM9HE',
        apiKey: '2c01bab700081b9d4322ce0c65ab3bfd',
        indexName: 'xmake_pages'
      }
    },

    carbonAds: { code: 'CEBDT27Y', placement: 'xmakeio' }
  },

  locales: {
    root: { label: 'English' },
    zh: { label: '简体中文' }
  }
})
