import { createRequire } from 'module'
import { defineAdditionalConfig, type DefaultTheme } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

export default defineAdditionalConfig({
  lang: 'zh-Hans',
  description: '一个基于Lua的轻量级跨平台自动构建工具',

  themeConfig: {
    nav: nav(),

    search: { options: searchOptions() },

    sidebar: {
      '/zh/guide/': { base: '/zh/guide/', items: guideSidebar() },
      '/zh/api/description': { base: '/zh/api/description/', items: descriptionApiSidebar() },
      '/zh/api/scripts': { base: '/zh/api/scripts/', items: scriptsApiSidebar() },
      '/zh/api/': { base: '/zh/api/', items: apiSidebar() },
      '/zh/examples/': { base: '/zh/examples/', items: examplesSidebar() },
    },

    editLink: {
      pattern: 'https://github.com/xmake-io/xmake-docs/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    outline: {
      label: '页面导航'
    },

    notFound: {
      title: '页面未找到',
      quote:
        '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
      linkLabel: '前往首页',
      linkText: '带我回首页'
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    skipToContentLabel: '跳转到内容'
  }
})

function searchOptions(): Partial<DefaultTheme.AlgoliaSearchOptions> {
  return {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档'
      },
      modal: {
        searchBox: {
          resetButtonTitle: '清除查询条件',
          resetButtonAriaLabel: '清除查询条件',
          cancelButtonText: '取消',
          cancelButtonAriaLabel: '取消'
        },
        startScreen: {
          recentSearchesTitle: '搜索历史',
          noRecentSearchesText: '没有搜索历史',
          saveRecentSearchButtonTitle: '保存至搜索历史',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          favoriteSearchesTitle: '收藏',
          removeFavoriteSearchButtonTitle: '从收藏中移除'
        },
        errorScreen: {
          titleText: '无法获取结果',
          helpText: '你可能需要检查你的网络连接'
        },
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭',
          searchByText: '搜索提供者'
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          suggestedQueryText: '你可以尝试查询',
          reportMissingResultsText: '你认为该查询应该有结果？',
          reportMissingResultsLinkText: '点击反馈'
        }
      }
    }
  }
}

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '文档',
      activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
      items: [
        { text: '使用指南', link: '/zh/guide/what-is-xmake', activeMatch: '/zh/guide/' },
        { text: '快速上手', link: '/zh/guide/getting-started' },
        { text: '示例', link: '/zh/examples/cpp/basic' },
        { text: 'API 手册', link: '/zh/api/' }
      ]
    },
    {
      text: '生态系统',
      items: [
        {
          text: '资源',
          items: [
            { text: 'Xmake 包仓库', link: 'https://xmake.microblock.cc/' }
          ]
        },
        {
          text: '帮助',
          items: [
            { text: '社区', link: '/zh/about/contact' },
            { text: '问题反馈', link: 'https://github.com/xmake-io/xmake/issues' },
            { text: '谁在使用 Xmake?', link: '/zh/about/who_is_using_xmake' }
          ]
        },
        {
          text: '其他',
          items: [
            { text: '实验楼课程', link: '/zh/about/course' },
            { text: '周边物品', link: '/zh/about/peripheral_items' }
          ]
        }
      ]
    },
    { text: '赞助', link: '/zh/about/sponsor' }
  ]
}

function guideSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      collapsed: false,
      items: [
        { text: '什么是 Xmake？', link: 'what-is-xmake' },
        { text: '快速开始', link: 'getting-started' }
      ]
    },
    {
      text: '下一步',
      collapsed: false,
      items: [
        { text: 'API 手册', link: '../api/' },
        { text: '示例', link: '../examples/cpp/basic' },
      ]
    }
  ]
}

function apiSidebar(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'API 手册', link: '/#api-reference' },
    {
      text: '下一步',
      collapsed: false,
      items: [
        { text: '使用指南', link: '../guide/what-is-xmake' },
        { text: '示例', link: '../examples/cpp/basic' },
      ]
    }
  ]
}

function descriptionApiSidebar(): DefaultTheme.SidebarItem[] {
  return [
    { text: '接口规范', link: '/specification' },
    { text: '全局接口', link: '/global-interfaces' },
    { text: '条件判断', link: '/conditions' },
    { text: '辅助接口', link: '/helper-interfaces' },
    { text: '工程目标', link: '/project-target' },
    { text: '配置选项', link: '/configuration-option' },
    { text: '插件任务', link: '/plugin-and-task' },
    { text: '自定义规则', link: '/custom-rule' },
    { text: '自定义工具链', link: '/custom-toolchain' },
    { text: '内置变量', link: '/builtin-variables' },
    { text: '内置规则', link: '/builtin-rules' },
    {
      text: '下一步',
      collapsed: false,
      items: [
        { text: '脚本域 API', link: '../scripts/target-instance' },
        { text: '使用指南', link: '../../guide/what-is-xmake' },
        { text: '示例', link: '../../examples/cpp/basic' },
      ]
    }
  ]
}

function scriptsApiSidebar(): DefaultTheme.SidebarItem[] {
  return [
    { text: '目标实例', link: '/target-instance' },
    { text: '选项实例', link: '/option-instance' },
    { text: '包实例', link: '/package-instance' },
    {
      text: '内建模块',
      collapsed: false,
      items: [
        { text: 'import', link: '/builtin-modules/import' },
        { text: 'os', link: '/builtin-modules/os' },
      ]
    },
    {
      text: '扩展模块',
      collapsed: false,
      items: [
        { text: 'core.base.option', link: '/extension-modules/core-base-option' },
        { text: 'core.base.global', link: '/extension-modules/core-base-global' },
        { text: 'core.base.task', link: '/extension-modules/core-base-task' },
        { text: 'core.base.json', link: '/extension-modules/core-base-json' },
        { text: 'core.base.semver', link: '/extension-modules/core-base-semver' },
        { text: 'core.project.config', link: '/extension-modules/core-project-config' },
      ]
    },
    { text: '原生模块', link: '/native-modules' },
    {
      text: '下一步',
      collapsed: false,
      items: [
        { text: '描述域 API', link: '../description/specification' },
        { text: '使用指南', link: '../../guide/what-is-xmake' },
        { text: '示例', link: '../../examples/cpp/basic' },
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
        { text: '基础程序', link: 'cpp/basic' },
        { text: 'C++ 模块', link: 'cpp/cxx-modules' },
        { text: 'Wasm 程序', link: 'cpp/wasm' },
        { text: 'Qt 程序', link: 'cpp/qt' },
        { text: 'WDK 程序', link: 'cpp/wdk' },
        { text: 'WinSDK 程序', link: 'cpp/winsdk' },
        { text: 'MFC 程序', link: 'cpp/mfc' },
        { text: 'Protobuf 程序', link: 'cpp/protobuf' },
        { text: 'OpenMP 程序', link: 'cpp/openmp' },
        { text: 'Linux Bpf 程序', link: 'cpp/linux-bpf' },
        { text: 'Linux 内核驱动模块', link: 'cpp/linux-driver-module' },
        { text: 'ASN.1 程序', link: 'cpp/asn1' },
        { text: 'CppFront 程序', link: 'cpp/cppfront' },
        { text: 'Cosmocc 程序', link: 'cpp/cosmocc' },
        { text: '合并静态库', link: 'cpp/merge-static-libraries' },
      ]
    },
    {
      text: '语言绑定模块',
      collapsed: false,
      items: [
        { text: 'Swig 模块', link: 'bindings/swig' },
        { text: 'Lua 模块', link: 'bindings/lua-module' },
        { text: 'Python 模块', link: 'bindings/python-module' },
        { text: 'NodeJS 模块', link: 'bindings/nodejs-module' },
      ]
    },
    {
      text: '嵌入式程序',
      collapsed: false,
      items: [
        { text: 'Keil/MDK 程序', link: 'embed/keil-mdk' },
        { text: 'Keil/C51 程序', link: 'embed/keil-c51' },
        { text: 'Verilog 仿真程序', link: 'embed/verilog' },
      ]
    },
    {
      text: '其他语言',
      collapsed: false,
      items: [
        { text: 'ObjC 程序', link: 'other-languages/objc' },
        { text: 'Cuda 程序', link: 'other-languages/cuda' },
        { text: 'Lex/Yacc 程序', link: 'other-languages/lex-yacc' },
        { text: 'Fortran 程序', link: 'other-languages/fortran' },
        { text: 'Golang 程序', link: 'other-languages/golang' },
        { text: 'Dlang 程序', link: 'other-languages/dlang' },
        { text: 'Rust 程序', link: 'other-languages/rust' },
        { text: 'Swift 程序', link: 'other-languages/swift' },
        { text: 'Zig 程序', link: 'other-languages/zig' },
        { text: 'Vala 程序', link: 'other-languages/vala' },
        { text: 'Pascal 程序', link: 'other-languages/pascal' },
        { text: 'Nim 程序', link: 'other-languages/nim' },
      ]
    },
    {
      text: '下一步',
      collapsed: false,
      items: [
        { text: 'API 手册', link: '../api/' },
        { text: '使用指南', link: '../guide/what-is-xmake' },
      ]
    }
  ]
}

