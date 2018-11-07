module.exports = {
  dest: 'docs',
  head: [
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `/favicon.ico` }],
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'xmake',
      description: 'A cross-platform build utility based on Lua'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'xmake',
      description: '一个基于Lua的轻量级跨平台自动构建工具'
    }
  },
  themeConfig: {
    repo: 'tboox/xmake',
    docsRepo: 'tboox/xmake-docs',
    docsDir: 'src',
    editLinks: true,
    sidebarDepth: 2,
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          {
            text: 'Guide',
            link: '/guide/introduction'
          },
          {
            text: 'Plugin',
            link: '/plugin/introduction'
          },
          {
            text: 'API',
            link: '/api/introduction'
          },
          {
            text: 'Articles',
            link: 'http://www.tboox.org/category/#xmake'
          },
          {
            text: 'Feedback',
            link: 'https://github.com/tboox/xmake/issues'
          },
          {
            text: 'Community',
            link: 'https://www.reddit.com/r/tboox/'
          },
          {
            text: 'Donation',
            link: 'http://tboox.org/cn/donation/'
          }
        ],
        sidebar: {
          '/guide/': [
            'introduction',
            'getting-started',
            'faq',
            'sponsors'
          ],
          '/plugin/': [
            'introduction'
          ],
          '/api/': [
            'introduction'
          ]
        }
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
          {
            text: '指南',
            link: '/zh/guide/introduction'
          },
          {
            text: '插件',
            link: '/zh/plugin/introduction'
          },
          {
            text: '接口',
            link: '/zh/api/introduction'
          },
          {
            text: '文章',
            link: 'http://www.tboox.org/cn/category/#xmake'
          },
          {
            text: '反馈',
            link: 'https://github.com/tboox/xmake/issues'
          },
          {
            text: '社区',
            link: 'https://www.reddit.com/r/tboox/'
          },
          {
            text: '捐助',
            link: 'http://tboox.org/cn/donation/'
          }
        ],
        sidebar: {
          '/zh/guide/': [
            'introduction',
            'getting-started',
            'faq',
            'sponsors'
          ],
          '/zh/plugin/': [
            'introduction'
          ],
          '/zh/api/': [
            'introduction'
          ]
        }
      }
    }
  }
}
