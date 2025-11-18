import Theme from 'vitepress/theme'
import { h } from 'vue'
import VPDoc from './components/VPDoc.vue'
import AIAssistant from './components/AIAssistant.vue'
import './styles.css'
import 'virtual:group-icons.css'

const hashToRoute = {
  '#/guide/quickstart': '/guide/quick-start',
  '#/guide/installation': '/guide/quick-start#installation',
  '#/guide/configuration': '/guide/basic-commands/build-configuration',
  '#/about/sponsor': '/about/sponsor',
  '#/manual/project_target': '/api/description/project-target',
  '#/manual/project_target?id=phony': '/api/description/project-target#phony',
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
  Layout: () => {
    return h(Theme.Layout, null, {
      'doc-content-before': () => h(VPDoc)
    })
  },
  enhanceApp({ app, router }) {
    // Register global components
    app.component('AIAssistant', AIAssistant)
    
    router.onBeforeRouteChange = (to) => {
      const u = new URL(to, 'https://xmake.io')
      if (u.pathname === '/') {
        const route = hashToRoute[u.hash]
        if (route) window.location.href = route
      }
    }
  }
}
