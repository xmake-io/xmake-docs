const origin = 'https://xmake.io'

// Match VitePress output URLs; do not silently change the site's routing policy.
export function pageUrl(relativePath, cleanUrls = false) {
  return `${origin}/${relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, cleanUrls ? '' : '.html')}`
}

export function isIndexable(path) {
  return !/(^|\/)404\.(md|html)$/.test(path) && !path.includes('migration')
}

export function seoHead({ relativePath, pages, cleanUrls = false, title, description, lang }) {
  const url = pageUrl(relativePath, cleanUrls)
  const head = [
    ['link', { rel: 'canonical', href: url }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:locale', content: lang.startsWith('zh') ? 'zh_CN' : 'en_US' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }]
  ]
  if (!isIndexable(relativePath)) {
    head.push(['meta', { name: 'robots', content: 'noindex, follow' }])
    return head
  }
  const en = relativePath.replace(/^zh\//, '')
  const zh = `zh/${en}`
  // Only publish reciprocal alternates when both translations actually exist.
  if (pages.includes(en) && pages.includes(zh)) {
    for (const [hreflang, path] of [['en', en], ['zh-Hans', zh], ['x-default', en]]) {
      head.push(['link', { rel: 'alternate', hreflang, href: pageUrl(path, cleanUrls) }])
    }
  }
  return head
}

export function mergeSeoHead(existing, generated) {
  const key = ([tag, attrs]) => `${tag}:${attrs.rel === 'alternate' ? `alternate:${attrs.hreflang}` : attrs.rel || attrs.property || attrs.name}`
  const managed = new Set(generated.map(key))
  return [...existing.filter(item => !managed.has(key(item))), ...generated]
}
