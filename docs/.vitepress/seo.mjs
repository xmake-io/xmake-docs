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

// Reuse MarkdownIt's parsed prose; code blocks, HTML components, image alt text,
// tables and navigation lists are not suitable search descriptions.
export function proseDescription(tokens, isZh = false) {
  const paragraphs = []
  for (let i = 0; i < tokens.length - 1; i++) {
    if (tokens[i].type === 'heading_open' && paragraphs.length) break
    if (tokens[i].type !== 'paragraph_open' || tokens[i].level !== 0) continue
    const inline = tokens[i + 1]
    if (inline.type !== 'inline') continue
    const text = (inline.children ?? []).map(token =>
      ['text', 'code_inline'].includes(token.type) ? token.content :
      ['softbreak', 'hardbreak'].includes(token.type) ? ' ' : ''
    ).join('').replace(/\s+/g, ' ').trim()
    if (text.length < 25 || text.includes('{{')) continue
    paragraphs.push(text)
    if (paragraphs.join(' ').length >= (isZh ? 80 : 140) || paragraphs.length === 2) break
  }
  const text = paragraphs.join(' ')
  const limit = isZh ? 110 : 190
  if (text.length <= limit) return text
  const boundary = !isZh ? text.lastIndexOf(' ', limit) : limit
  return text.slice(0, boundary > limit / 2 ? boundary : limit).replace(/[\s,;，；]+$/, '') + '…'
}

export function descriptionPlugin(md) {
  md.core.ruler.push('xmake-description', state => {
    const frontmatter = state.env.frontmatter
    if (!frontmatter || Object.hasOwn(frontmatter, 'description')) return
    const relativePath = state.env.relativePath || ''
    if (!/^(zh\/)?(guide|api|examples|posts)\//.test(relativePath)) return
    const description = proseDescription(state.tokens, relativePath.startsWith('zh/'))
    if (description) frontmatter.description = description
  })
}
