const langs = [
  {title: 'English', path: '/home'},
  {title: '中文', path: '/zh/'},
]

docute.init({
    landing: true,
    repo: 'tboox/xmake',
    twitter: 'waruqi',
    'edit-link': 'https://github.com/tboox/xmake-docs/blob/master/',
    announcement(route) {
    const info = { type: 'success' }
    if (/\/zh/.test(route.path)) {
      info.html = '<a style="margin-right:10px;" class="docute-button docute-button-mini docute-button-success" href="/cn/pages/donation.html#donate" target="_blank">捐赠!</a> 通过成为赞助商或者一次性捐赠支持xmake的开发和文档更新。'
    } else {
      info.html = '<a style="margin-right:10px;" class="docute-button docute-button-mini docute-button-success" href="/pages/donation.html#donate" target="_blank">Donate!</a> Support xmake development and documentation updates by becoming a sponsor or one-time donation.'
    }
    return info
   },
    nav: {
    default: [
      {
        title: 'Home', path: '/home'
      },
      {
        title: 'Plugins', path: '/plugins'
      },
      {
        title: 'Manual', path: '/manual'
      },
      {
        title: 'Articles', path: 'http://www.tboox.org/category/#xmake'
      },
      {
        title: 'Feedback', path: 'https://github.com/tboox/xmake/issues'
      },
      {
        title: 'Community', path: 'https://www.reddit.com/r/tboox/'
      },
      {
        title: 'English', type: 'dropdown', items: langs, exact: true
      }
    ],
    'zh': [
      {
        title: '首页', path: '/zh/'
      },
      {
        title: '插件', path: '/zh/plugins'
      },
      {
        title: '手册', path: '/zh/manual'
      },
      {
        title: '文章', path: 'http://www.tboox.org/cn/category/#xmake'
      },
      {
        title: '反馈', path: 'https://github.com/tboox/xmake/issues'
      },
      {
        title: '社区', path: 'https://www.reddit.com/r/tboox/'
      },
      {
        title: '中文', type: 'dropdown', items: langs, exact: true
      }
    ]
  },
  plugins: [
    docsearch({
      apiKey: 'fbba61eefc60a833d8caf1fa72bd8ef8',
      indexName: 'xmake',
      tags: ['en', 'zh'],
      url: 'http://xmake.io'
    }),
    function valine(context) {
      context.registerComponent('content:end', {
        template: '<div class="markdown-body content"><h2 id="comments">Comments</h2><div id="valine_thread"></div></div>',
        mounted() {
          this.init()
        },
        methods: {
          init() {
            var valine = new Valine();
            valine.init({
              el: '#valine_thread',
              appId: 'RD4nYKDcOrU4XBWJRB2H4g6D-gzGzoHsz',
              appKey: 'I6DiXvhBgTfKKcJ68D1zQXsr',
              notify:true,
              placeholder: 'Welcome to read xmake online documents!',
              lang: 'en',
              avatar:'mm' 
            })
          }
        }
      })
    }
  ]
})
