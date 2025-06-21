import { createRequire } from 'module'
import { defineAdditionalConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

export default defineAdditionalConfig({
  lang: 'en-US',
  description: "A cross-platform build utility based on Lua",

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/guide/': { base: '/guide/', items: sidebarGuide() },
      '/api/': { base: '/api/', items: apiGuide() },
    },

    editLink: {
      pattern: 'https://github.com/xmake-io/xmake-docs/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    },
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Docs',
      activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
      items: [
        { text: 'Guide', link: '/guide/what-is-xmake', activeMatch: '/guide/' },
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Examples', link: '/examples/' },
        { text: 'API Reference', link: '/api/description/specification' }
      ]
    },
    {
      text: 'Ecosystem',
      items: [
        {
          text: 'Resources',
          items: [
            { text: 'Xmake Packages', link: 'https://xmake.microblock.cc/' }
          ]
        },
        {
          text: 'Help',
          items: [
            { text: 'Community', link: '/about/contact' },
            { text: 'Feedback', link: 'https://github.com/xmake-io/xmake/issues' }
          ]
        }
      ]

    },
    { text: 'Sponsor', link: '/about/sponsor' }
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'What it Xmake？', link: 'what-is-xmake' },
        { text: 'Getting Started', link: 'getting-started' }
      ]
    }
  ]
}

function apiGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Description API',
      collapsed: false,
      items: [
        { text: 'Specification', link: 'description/specification' },
        { text: 'Conditions', link: 'description/conditions' }
      ]
    },
    {
      text: 'Script API',
      collapsed: false,
      items: [
        { text: 'Native Modules', link: 'scripts/native_modules' }
      ]
    }
  ]
}

