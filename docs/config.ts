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
      '/examples/': { base: '/examples/', items: examplesGuide() },
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
        { text: 'Examples', link: '/examples/cpp/basic' },
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
            { text: 'Feedback', link: 'https://github.com/xmake-io/xmake/issues' },
            { text: 'Who is using Xmake?', link: '/about/who_is_using_xmake' }
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

function examplesGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'C/C++',
      collapsed: false,
      items: [
        { text: 'Basic Programs', link: 'cpp/basic' },
        { text: 'Wasm Programs', link: 'cpp/wasm' },
        { text: 'Qt Programs', link: 'cpp/qt' },
        { text: 'WDK Programs', link: 'cpp/wdk' },
        { text: 'WinSDK Programs', link: 'cpp/winsdk' },
        { text: 'MFC Programs', link: 'cpp/mfc' },
        { text: 'Protobuf Programs', link: 'cpp/protobuf' },
        { text: 'OpenMP Programs', link: 'cpp/openmp' },
        { text: 'C++ Modules', link: 'cpp/modules' },
        { text: 'Linux Bpf Programs', link: 'cpp/linux-bpf' },
        { text: 'Swig Modules', link: 'cpp/swig' },
      ]
    },
    {
      text: 'Other Languages',
      collapsed: false,
      items: [
        { text: 'ObjC Programs', link: 'other/objc' },
        { text: 'Cuda Programs', link: 'other/cuda' },
        { text: 'Lex/Yacc Programs', link: 'other/lex-yacc' },
        { text: 'Fortran Programs', link: 'other/fortran' },
        { text: 'Golang Programs', link: 'other/golang' },
        { text: 'Dlang Programs', link: 'other/dlang' },
        { text: 'Rust Programs', link: 'other/rust' },
        { text: 'Swift Programs', link: 'other/swift' },
        { text: 'Zig Programs', link: 'other/zig' },
        { text: 'Vala Programs', link: 'other/vala' },
        { text: 'Pascal Programs', link: 'other/pascal' },
      ]
    }
  ]
}

