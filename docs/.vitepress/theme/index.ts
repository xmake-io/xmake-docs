import Theme from 'vitepress/theme'
import './styles.css'
import 'virtual:group-icons.css'

const hashToRoute = {
  '#/about/sponsor': '/about/sponsor',
  '#/manual/project_target': '/api/description/project-target',
  '#/manual/project_target?id=phony': '/api/description/project-target#phony',
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
