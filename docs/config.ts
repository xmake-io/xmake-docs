import { createRequire } from 'node:module'
import { defineAdditionalConfig, type DefaultTheme } from 'vitepress'
import { builtinModulesApiSidebarItems, extensionModulesApiSidebarItems } from './sidebar'
import { posts } from './.vitepress/data/blog-data.js'

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
      '/about/': [
        {
          text: 'About',
          items: [
            { text: 'Sponsor', link: '/about/sponsor' },
            { text: 'Contact', link: '/about/contact' },
            { text: 'Who is using Xmake?', link: '/about/who_is_using_xmake' },
          ]
        },
        {
          text: 'Next Steps',
          items: [
            { text: 'Documentation', link: '/guide/introduction' }
          ]
        }
      ],
      '/blog/': [
        {
          text: 'Blog',
          items: [
            { text: 'Return to Home', link: '/' }
          ]
        },
        {
          text: 'Next Steps',
          items: [
            { text: 'Documentation', link: '/guide/introduction' }
          ]
        }
      ],
      ...postsSidebar(),
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
        { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
        { text: 'Quick Start', link: '/guide/quick-start' },
        { text: 'Examples', link: '/examples/cpp/basic', activeMatch: '/examples/' },
        { text: 'API Reference', link: '/api/description/specification', activeMatch: '/api/' }
      ]
    },
    {
      text: 'Blog',
      link: '/blog/',
      activeMatch: '/blog/'
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

function postsSidebar(): Record<string, DefaultTheme.SidebarItem[]> {
  const sidebar: Record<string, DefaultTheme.SidebarItem[]> = {}
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const next = i > 0 ? posts[i - 1] : null
    const prev = i < posts.length - 1 ? posts[i + 1] : null
    
    const items = []
    if (next) {
      items.push({ text: 'Previous Post', link: next.url })
    }
    if (prev) {
      items.push({ text: 'Next Post', link: prev.url })
    }
    items.push({ 
      text: 'Next Steps',
      items: [
        { text: 'Documentation', link: '/guide/introduction' }
      ]
    })
    
    sidebar[post.url + '.html'] = items
    sidebar[post.url] = items
  }
  return sidebar
}

function guideSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Getting Started',
      collapsed: false,
      items: [
        { text: 'Introduction', link: 'introduction' },
        { text: 'Quick Start', link: 'quick-start' },
      ]
    },
    {
      text: 'Basic Commands',
      collapsed: false,
      items: [
        { text: 'Create Project', link: 'basic-commands/create-project' },
        { text: 'Build Configuration', link: 'basic-commands/build-configuration' },
        { text: 'Build Targets', link: 'basic-commands/build-targets' },
        { text: 'Run Targets', link: 'basic-commands/run-targets' },
        { text: 'Install and Uninstall', link: 'basic-commands/install-and-uninstall' },
        { text: 'Pack Programs', link: 'basic-commands/pack-programs' },
        { text: 'Cross Compilation', link: 'basic-commands/cross-compilation' },
        { text: 'Switch Toolchains', link: 'basic-commands/switch-toolchains' },
      ]
    },
    {
      text: 'Project Configuration',
      collapsed: false,
      items: [
        { text: 'Syntax Description', link: 'project-configuration/syntax-description' },
        { text: 'Configure Targets', link: 'project-configuration/configure-targets' },
        { text: 'Define Options', link: 'project-configuration/define-options' },
        { text: 'Add Packages', link: 'project-configuration/add-packages' },
        { text: 'Multi-level Directories', link: 'project-configuration/multi-level-directories' },
        { text: 'Toolchain Configuration', link: 'project-configuration/toolchain-configuration' },
        { text: 'Namespace Isolation', link: 'project-configuration/namespace-isolation' },
        { text: 'Custom Rules', link: 'project-configuration/custom-rule' },
        { text: 'Plugins and Tasks', link: 'project-configuration/plugin-and-task' },
      ]
    },
    {
      text: 'Package Management',
      collapsed: false,
      items: [
        {
          text: 'Using Remote Packages',
          collapsed: true,
          items: [
            { text: 'Using Official Packages', link: 'package-management/using-official-packages' },
            { text: 'Using Third-party Packages', link: 'package-management/using-third-party-packages' },
            { text: 'Using Packages in CMake', link: 'package-management/using-packages-in-cmake' },
            { text: 'Package Distribution', link: 'package-management/package-distribution' },
          ]
        },
        { text: 'Using Local Packages', link: 'package-management/using-local-packages' },
        { text: 'Using System Packages', link: 'package-management/using-system-packages' },
        { text: 'Using Sourcecode Packages', link: 'package-management/using-source-code-packages' },
        { text: 'Distribute Private Libraries', link: 'package-management/distribute-private-libraries' },
        { text: 'Network Optimization', link: 'package-management/network-optimization' },
        {
          text: 'CLI',
          collapsed: true,
          items: [
            { text: 'Package Management in Project', link: 'package-management/package-management-in-project' },
            { text: 'Repository Management', link: 'package-management/repository-management' },
            { text: 'Xrepo CLI', link: 'package-management/xrepo-cli' },
          ]
        },
      ]
    },
    {
      text: 'Extensions',
      collapsed: false,
      items: [
        { text: 'Plugin Development', link: 'extensions/plugin-development' },
        { text: 'Builtin Plugins', link: 'extensions/builtin-plugins' },
        { text: 'IDE Integration Plugins', link: 'extensions/ide-integration-plugins' },
        { text: 'Theme Style', link: 'extensions/theme-style' },
      ]
    },
    {
      text: 'Best Practices',
      collapsed: false,
      items: [
        { text: 'FAQ', link: 'best-practices/faq' },
        { text: 'Performance', link: 'best-practices/performance' },
        { text: 'AI Q&A Optimization', link: 'best-practices/ai-qa-optimization' },
      ]
    },
    {
      text: 'Extra Topics',
      collapsed: false,
      items: [
        { text: 'Remote Compilation', link: 'extras/remote-compilation' },
        { text: 'Distributed Compilation', link: 'extras/distributed-compilation' },
        { text: 'Build Cache Acceleration', link: 'extras/build-cache' },
        { text: 'Unity Build Acceleration', link: 'extras/unity-build' },
        { text: 'Auto-scan Sourcecode', link: 'extras/autoscan-sourcecode' },
        { text: 'Try Build 3rd Sourcecode', link: 'extras/trybuild-3rd-sourcecode' },
        { text: 'Envirnoment Variables', link: 'extras/environment-variables' },
      ]
    },
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
        { text: 'Builtin Policies', link: 'builtin-policies' },
        { text: 'XPack Interfaces', link: 'xpack-interfaces' },
        { text: 'XPack Component Interfaces', link: 'xpack-component-interfaces' },
      ]
    },
    {
      text: 'Next Steps',
      collapsed: false,
      items: [
        { text: 'Scripts API', link: '../scripts/target-instance' },
        { text: 'Guide', link: '../../guide/introduction' },
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
        { text: 'Guide', link: '../../guide/introduction' },
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
        { text: 'WDK Programs', link: 'cpp/wdk' },
        { text: 'Protobuf Programs', link: 'cpp/protobuf' },
        { text: 'OpenMP Programs', link: 'cpp/openmp' },
        { text: 'Linux Bpf Programs', link: 'cpp/linux-bpf' },
        { text: 'Linux Kernel Driver Module', link: 'cpp/linux-driver-module' },
        { text: 'ASN.1 Programs', link: 'cpp/asn1' },
        { text: 'CppFront Programs', link: 'cpp/cppfront' },
        { text: 'Cosmocc Programs', link: 'cpp/cosmocc' },
        { text: 'Merge Static Libraries', link: 'cpp/merge-static-libraries' },
        { text: 'Bin2c/Bin2obj', link: 'cpp/bin2c-obj' },
        { text: 'Package Management', link: 'cpp/packages' },
        { text: 'XPack Packaging', link: 'cpp/xpack' },
      ]
    },
    {
      text: 'Xmake Configuration',
      collapsed: true,
      items: [
        { text: 'Multi-level Directories', link: 'configuration/multi_level_directories' },
        { text: 'Namespace Isolation', link: 'configuration/namespace_isolation' },
        { text: 'Custom Toolchain', link: 'configuration/custom_toolchain' },
        { text: 'Remote Toolchain', link: 'configuration/remote_toolchain' },
        { text: 'Custom Rule', link: 'configuration/custom_rule' },
        { text: 'Custom Module', link: 'configuration/custom_module' },
        { text: 'Custom Scope API', link: 'configuration/custom_scope_api' },
        { text: 'Config Header Generation', link: 'configuration/add_configfiles' },
        { text: 'Autogen Programs', link: 'configuration/autogen' },
      ]
    },
    {
      text: 'Graphics & Audio',
      collapsed: true,
      items: [
        { text: 'OpenGL', link: 'cpp/graphics/opengl' },
        { text: 'Vulkan', link: 'cpp/graphics/vulkan' },
        { text: 'SDL2', link: 'cpp/graphics/sdl' },
        { text: 'Raylib', link: 'cpp/graphics/raylib' },
        { text: 'ImGui', link: 'cpp/graphics/imgui' },
        { text: 'Qt Programs', link: 'cpp/graphics/qt' },
        { text: 'WinSDK Programs', link: 'cpp/graphics/winsdk' },
        { text: 'MFC Programs', link: 'cpp/graphics/mfc' },
        { text: 'Android Native App', link: 'cpp/graphics/android' },
        { text: 'GLSL/HLSL to SPIR-V', link: 'cpp/graphics/glsl2spv' },
        { text: 'Mac App', link: 'cpp/graphics/mac_app' },
        { text: 'iOS App', link: 'cpp/graphics/ios_app' },
        { text: 'Metal App', link: 'cpp/graphics/metal_app' },
        { text: 'Linux Framebuffer Programs', link: 'cpp/graphics/linux_framebuffer' },
        { text: 'TUI Programs', link: 'cpp/graphics/tui' },
        { text: 'Audio Programs', link: 'cpp/graphics/audio' },
      ]
    },
    {
      text: 'Bindings Programs',
      collapsed: true,
      items: [
        { text: 'Swig Modules', link: 'bindings/swig' },
        { text: 'Lua Modules', link: 'bindings/lua-module' },
        { text: 'Python Modules', link: 'bindings/python-module' },
        { text: 'NodeJS Modules', link: 'bindings/nodejs-module' },
      ]
    },
    {
      text: 'Embed Programs',
      collapsed: true,
      items: [
        { text: 'Keil/MDK Embed Programs', link: 'embed/keil-mdk' },
        { text: 'Keil/C51 Embed Programs', link: 'embed/keil-c51' },
        { text: 'Verilog Programs', link: 'embed/verilog' },
      ]
    },
    {
      text: 'Other Languages',
      collapsed: true,
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
        { text: 'Guide', link: '../guide/introduction' },
      ]
    }
  ]
}

