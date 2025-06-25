import { createRequire } from 'module'
import { defineAdditionalConfig, type DefaultTheme } from 'vitepress'
import { builtinModulesApiSidebarItems, extensionModulesApiSidebarItems } from './sidebar'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

export default defineAdditionalConfig({
  lang: 'en-US',
  description: "A cross-platform build utility based on Lua",

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/guide/': { base: '/guide/', items: guideSidebar() },
      '/api/description/': { base: '/api/description/', items: descriptionApiSidebar() },
      '/api/scripts/': { base: '/api/scripts/', items: scriptsApiSidebar() },
      '/examples/': { base: '/examples/', items: examplesSidebar() },
    },

    editLink: {
      pattern: 'https://github.com/xmake-io/xmake-docs/edit/master/docs/:path',
      text: 'Edit this page on GitHub'
    }
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
        { text: 'Examples', link: '/examples/cpp/basic', activeMatch: '/examples/' },
        { text: 'API Reference', link: '/api/description/specification', activeMatch: '/api/' }
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

function guideSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'What it Xmake？', link: 'what-is-xmake' },
        { text: 'Getting Started', link: 'getting-started' },
        {
          text: 'Next Steps',
          collapsed: false,
          items: [
            { text: 'API Reference', link: '../api/description/specification' },
            { text: 'Examples', link: '../examples/cpp/basic' },
          ]
        }
      ]
    }
  ]
}

function descriptionApiSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Description API',
      collapsed: false,
      items: [
        { text: 'Specification', link: 'specification' },
        { text: 'Conditions', link: 'conditions' },
        { text: 'Global Interfaces', link: 'global-interfaces' },
        { text: 'Helper Interfaces', link: 'helper-interfaces' },
        { text: 'Project Targets', link: 'project-target' },
        { text: 'Configuration Option', link: 'configuration-option' },
        { text: 'Plugin and Task', link: 'plugin-and-task' },
        { text: 'Custom Rule', link: 'custom-rule' },
        { text: 'Custom Toolchain', link: 'custom-toolchain' },
        { text: 'Package Dependencies', link: 'package-dependencies' },
        { text: 'Builtin Variables', link: 'builtin-variables' },
        { text: 'Builtin Rules', link: 'builtin-rules' },
        { text: 'XPack Interfaces', link: 'xpack-interfaces' },
        { text: 'XPack Component Interfaces', link: 'xpack-component-interfaces' },
      ]
    },
    {
      text: 'Next Steps',
      collapsed: false,
      items: [
        { text: 'Scripts API', link: '../scripts/target-instance' },
        { text: 'Guide', link: '../../guide/what-is-xmake' },
        { text: 'Examples', link: '../../examples/cpp/basic' },
      ]
    }
  ]
}

function scriptsApiSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Scripts API',
      collapsed: false,
      items: [
        { text: 'Target Instance', link: 'target-instance' },
        { text: 'Option Instance', link: 'option-instance' },
        { text: 'Package Instance', link: 'package-instance' },
      ]
    },
    {
      text: 'Builtin Modules',
      collapsed: true,
      items: builtinModulesApiSidebarItems()
    },
    {
      text: 'Extension Modules',
      collapsed: false,
      items: extensionModulesApiSidebarItems()
    },
    { text: 'Native Modules', link: 'native-modules' },
    {
      text: 'Next Steps',
      collapsed: false,
      items: [
        { text: 'Description API', link: '../description/specification' },
        { text: 'Guide', link: '../../guide/what-is-xmake' },
        { text: 'Examples', link: '../../examples/cpp/basic' },
      ]
    }
  ]
}

function examplesSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'C/C++',
      collapsed: false,
      items: [
        { text: 'Basic Programs', link: 'cpp/basic' },
        { text: 'C++ Modules', link: 'cpp/cxx-modules' },
        { text: 'Wasm Programs', link: 'cpp/wasm' },
        { text: 'Qt Programs', link: 'cpp/qt' },
        { text: 'WDK Programs', link: 'cpp/wdk' },
        { text: 'WinSDK Programs', link: 'cpp/winsdk' },
        { text: 'MFC Programs', link: 'cpp/mfc' },
        { text: 'Protobuf Programs', link: 'cpp/protobuf' },
        { text: 'OpenMP Programs', link: 'cpp/openmp' },
        { text: 'Linux Bpf Programs', link: 'cpp/linux-bpf' },
        { text: 'Linux Kernel Driver Module', link: 'cpp/linux-driver-module' },
        { text: 'ASN.1 Programs', link: 'cpp/asn1' },
        { text: 'CppFront Programs', link: 'cpp/cppfront' },
        { text: 'Cosmocc Programs', link: 'cpp/cosmocc' },
        { text: 'Merge Static Libraries', link: 'cpp/merge-static-libraries' },
      ]
    },
    {
      text: 'Bindings Programs',
      collapsed: false,
      items: [
        { text: 'Swig Modules', link: 'bindings/swig' },
        { text: 'Lua Modules', link: 'bindings/lua-module' },
        { text: 'Python Modules', link: 'bindings/python-module' },
        { text: 'NodeJS Modules', link: 'bindings/nodejs-module' },
      ]
    },
    {
      text: 'Embed Programs',
      collapsed: false,
      items: [
        { text: 'Keil/MDK Embed Programs', link: 'embed/keil-mdk' },
        { text: 'Keil/C51 Embed Programs', link: 'embed/keil-c51' },
        { text: 'Verilog Programs', link: 'embed/verilog' },
      ]
    },
    {
      text: 'Other Languages',
      collapsed: false,
      items: [
        { text: 'ObjC Programs', link: 'other-languages/objc' },
        { text: 'Cuda Programs', link: 'other-languages/cuda' },
        { text: 'Lex/Yacc Programs', link: 'other-languages/lex-yacc' },
        { text: 'Fortran Programs', link: 'other-languages/fortran' },
        { text: 'Golang Programs', link: 'other-languages/golang' },
        { text: 'Dlang Programs', link: 'other-languages/dlang' },
        { text: 'Rust Programs', link: 'other-languages/rust' },
        { text: 'Swift Programs', link: 'other-languages/swift' },
        { text: 'Zig Programs', link: 'other-languages/zig' },
        { text: 'Vala Programs', link: 'other-languages/vala' },
        { text: 'Pascal Programs', link: 'other-languages/pascal' },
        { text: 'Nim Programs', link: 'other-languages/nim' },
        { text: 'Verilog Programs', link: 'other-languages/verilog' },
      ]
    },
    {
      text: 'Next Steps',
      collapsed: false,
      items: [
        { text: 'API Reference', link: '../api/description/specification' },
        { text: 'Guide', link: '../guide/what-is-xmake' },
      ]
    }
  ]
}

