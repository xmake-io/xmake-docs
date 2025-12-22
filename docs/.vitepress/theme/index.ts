import Theme from 'vitepress/theme'
import { h, computed } from 'vue'
import VPDoc from './components/VPDoc.vue'
import AIAssistant from './components/AIAssistant.vue'
import WWAds from './components/WWAds.vue'
import VPCarbonAds from './components/VPCarbonAds.vue'
import SponsorButton from './components/SponsorButton.vue'
import { useData } from 'vitepress'
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
    const { lang, page, theme } = useData()
    const isZh = computed(() => {
      return lang.value === 'zh' || 
             lang.value === 'zh-CN' || 
             page.value.relativePath.startsWith('zh/') || 
             page.value.filePath.includes('/zh/')
    })

    return h(Theme.Layout, null, {
      'doc-content-before': () => h(VPDoc),
      'doc-after': () => {
        if (isZh.value) {
          return h('div', { class: 'mobile-only-ads' }, h(WWAds))
        }
        return null
      }
    })
  },
  enhanceApp({ app, router }) {
    // Register global components
    app.component('AIAssistant', AIAssistant)
    app.component('SponsorButton', SponsorButton)
    
    if (typeof window !== 'undefined') {
      const lang = navigator.language
      if (lang && lang.toLowerCase().startsWith('zh') && window.location.pathname === '/') {
        window.location.pathname = '/zh/'
      }
    }

    router.onBeforeRouteChange = (to) => {
      const u = new URL(to, 'https://xmake.io')
      if (u.pathname === '/') {
        const route = hashToRoute[u.hash]
        if (route) window.location.href = route
      }
    }
  }
}
