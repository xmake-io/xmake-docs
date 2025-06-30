import Theme from 'vitepress/theme'
import './styles.css'
import 'virtual:group-icons.css'

const hashToRoute = {
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
