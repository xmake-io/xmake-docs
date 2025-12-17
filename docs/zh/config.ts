import { createRequire } from 'module'
import { defineAdditionalConfig, type DefaultTheme } from 'vitepress'
import { builtinModulesApiSidebarItems, extensionModulesApiSidebarItems } from '../sidebar'

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
      '/zh/api/description/': { base: '/zh/api/description/', items: descriptionApiSidebar() },
      '/zh/api/scripts/': { base: '/zh/api/scripts/', items: scriptsApiSidebar() },
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
        { text: '使用指南', link: '/zh/guide/introduction', activeMatch: '/zh/guide/' },
        { text: '快速上手', link: '/zh/guide/quick-start' },
        { text: '示例', link: '/zh/examples/cpp/basic', activeMatch: '/zh/examples/' },
        { text: 'API 手册', link: '/zh/api/description/specification', activeMatch: '/zh/api/' }
      ]
    },
    {
      text: '博客',
      link: '/zh/blog/',
      activeMatch: '/zh/blog/'
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
      text: '开始',
      collapsed: false,
      items: [
        { text: '简介', link: 'introduction' },
        { text: '快速上手', link: 'quick-start' }
      ]
    },
    {
      text: '基础命令',
      collapsed: false,
      items: [
        { text: '创建工程', link: 'basic-commands/create-project' },
        { text: '编译配置', link: 'basic-commands/build-configuration' },
        { text: '构建目标', link: 'basic-commands/build-targets' },
        { text: '运行目标', link: 'basic-commands/run-targets' },
        { text: '安装卸载', link: 'basic-commands/install-and-uninstall' },
        { text: '打包程序', link: 'basic-commands/pack-programs' },
        { text: '交叉编译', link: 'basic-commands/cross-compilation' },
        { text: '切换工具链', link: 'basic-commands/switch-toolchains' },
      ]
    },
    {
      text: '工程配置',
      collapsed: false,
      items: [
        { text: '语法描述', link: 'project-configuration/syntax-description' },
        { text: '配置目标', link: 'project-configuration/configure-targets' },
        { text: '定义选项', link: 'project-configuration/define-options' },
        { text: '添加依赖包', link: 'project-configuration/add-packages' },
        { text: '多级目录配置', link: 'project-configuration/multi-level-directories' },
        { text: '工具链配置', link: 'project-configuration/toolchain-configuration' },
        { text: '命名空间隔离', link: 'project-configuration/namespace-isolation' },
        { text: '自定义规则', link: 'project-configuration/custom-rule' },
        { text: '插件和任务', link: 'project-configuration/plugin-and-task' },
      ]
    },
    {
      text: '包依赖管理',
      collapsed: false,
      items: [
        {
          text: '使用远程包',
          collapsed: true,
          items: [
            { text: '使用官方包', link: 'package-management/using-official-packages' },
            { text: '使用第三方包', link: 'package-management/using-third-party-packages' },
            { text: '在 CMake 中使用包', link: 'package-management/using-packages-in-cmake' },
            { text: '分发包到仓库', link: 'package-management/package-distribution' },
          ]
        },
        { text: '使用本地包', link: 'package-management/using-local-packages' },
        { text: '使用系统包', link: 'package-management/using-system-packages' },
        { text: '使用源码包', link: 'package-management/using-source-code-packages' },
        { text: '分发私有库', link: 'package-management/distribute-private-libraries' },
        { text: '网络优化', link: 'package-management/network-optimization' },
        {
          text: 'CLI',
          collapsed: true,
          items: [
            { text: '工程内包管理', link: 'package-management/package-management-in-project' },
            { text: '仓库管理', link: 'package-management/repository-management' },
            { text: 'Xrepo CLI', link: 'package-management/xrepo-cli' },
          ]
        },
      ]
    },
    {
      text: '扩展',
      collapsed: false,
      items: [
        { text: '插件开发', link: 'extensions/plugin-development' },
        { text: '内置插件', link: 'extensions/builtin-plugins' },
        { text: 'IDE 集成插件', link: 'extensions/ide-integration-plugins' },
        { text: '主题风格', link: 'extensions/theme-style' },
      ]
    },
    {
      text: '最佳实践',
      collapsed: false,
      items: [
        { text: '常见问题', link: 'best-practices/faq' },
        { text: '性能优化', link: 'best-practices/performance' },
        { text: 'AI 问答优化', link: 'best-practices/ai-qa-optimization' },
      ]
    },
    {
      text: '进阶主题',
      collapsed: false,
      items: [
        { text: '远程编译', link: 'extras/remote-compilation' },
        { text: '分布式编译', link: 'extras/distributed-compilation' },
        { text: '编译缓存加速', link: 'extras/build-cache' },
        { text: 'Unity 编译加速', link: 'extras/unity-build' },
        { text: '自动扫描源码', link: 'extras/autoscan-sourcecode' },
        { text: '尝试构建第三方源码', link: 'extras/trybuild-3rd-sourcecode' },
        { text: '环境变量', link: 'extras/environment-variables' },
      ]
    },
    {
      text: '下一步',
      collapsed: false,
      items: [
        { text: 'API 手册', link: '../api/description/specification' },
        { text: '示例', link: '../examples/cpp/basic' },
      ]
    }
  ]
}

function descriptionApiSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '描述域 API',
      collapsed: false,
      items: [
        { text: '接口规范', link: 'specification' },
        { text: '全局接口', link: 'global-interfaces' },
        { text: '条件判断', link: 'conditions' },
        { text: '辅助接口', link: 'helper-interfaces' },
        { text: '工程目标', link: 'project-target' },
        { text: '配置选项', link: 'configuration-option' },
        { text: '插件任务', link: 'plugin-and-task' },
        { text: '自定义规则', link: 'custom-rule' },
        { text: '自定义工具链', link: 'custom-toolchain' },
        { text: '包依赖', link: 'package-dependencies' },
        { text: '内置变量', link: 'builtin-variables' },
        { text: '内置规则', link: 'builtin-rules' },
        { text: '内置策略', link: 'builtin-policies' },
        { text: 'XPack 打包接口', link: 'xpack-interfaces' },
        { text: 'XPack 组件接口', link: 'xpack-component-interfaces' },
      ]
    },
    {
      text: '下一步',
      collapsed: false,
      items: [
        { text: '脚本域 API', link: '../scripts/target-instance' },
        { text: '使用指南', link: '../../guide/introduction' },
        { text: '示例', link: '../../examples/cpp/basic' },
      ]
    }
  ]
}

function scriptsApiSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '脚本域 API',
      collapsed: false,
      items: [
        { text: '目标实例', link: 'target-instance' },
        { text: '选项实例', link: 'option-instance' },
        { text: '包实例', link: 'package-instance' },
      ]
    },
    {
      text: '内置模块',
      collapsed: true,
      items: builtinModulesApiSidebarItems()
    },
    {
      text: '扩展模块',
      collapsed: false,
      items: extensionModulesApiSidebarItems()
    },
    { text: '原生模块', link: 'native-modules' },
    {
      text: '下一步',
      collapsed: false,
      items: [
        { text: '描述域 API', link: '../description/specification' },
        { text: '使用指南', link: '../../guide/introduction' },
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
        { text: '自动代码生成', link: 'cpp/autogen' },
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
        { text: 'API 手册', link: '../api/description/specification' },
        { text: '使用指南', link: '../guide/introduction' },
      ]
    }
  ]
}

