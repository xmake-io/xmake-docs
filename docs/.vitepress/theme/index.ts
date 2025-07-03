import Theme from 'vitepress/theme'
import './styles.css'
import 'virtual:group-icons.css'

const hashToRoute = {
  '#/guide/quickstart': '/guide/quick-start',
  '#/guide/installation': '/guide/quick-start#installation',
  '#/guide/configuration': '/guide/basic-commands/build-configuration',
  '#/about/sponsor': '/about/sponsor',
  '#/manual/project_target': '/api/description/project-target',
  '#/manual/project_target?id=phony': '/api/description/project-target#phony',
  '/mirror/guide/project_examples': '/examples/cpp/basic',
  '/mirror/guide/project_examples.html': '/examples/cpp/basic',
  '/mirror/zh-cn/plugin/builtin_plugins': '/guide/extensions/builtin-plugins',
  '/mirror/zh-cn/plugin/builtin_plugins.html': '/guide/extensions/builtin-plugins',
  '#/zh-cn/guide/quickstart': '/zh/guide/quick-start',
  '#/zh-cn/guide/installation': '/zh/guide/quick-start#installation',
  '#/zh-cn/guide/configuration': '/zh/guide/basic-commands/build-configuration',
  '#/zh-cn/manual/project_target': '/zh/api/description/project-target',
  '#/zh-cn/manual/project_target?id=phony': '/zh/api/description/project-target#phony',
  '#/zh-cn/about/sponsor': '/zh/about/sponsor',
  '#/zh-cn/about/course': '/zh/about/course'
}

export default {
  extends: Theme,
  enhanceApp({ router }) {
    router.onBeforeRouteChange = (to) => {
      const u = new URL(to, 'https://xmake.io')
      if (u.pathname === '/') {
        const route = hashToRoute[u.hash]
        if (route) window.location.href = route
      }
    }
  }
} satisfies Theme
