import test from 'node:test'
import assert from 'node:assert/strict'
import { pageUrl, seoHead, mergeSeoHead, isIndexable } from '../../docs/.vitepress/seo.mjs'
const pages = ['index.md', 'zh/index.md', 'guide/quick-start.md', 'zh/guide/quick-start.md', 'posts/english-only.md']
const render = relativePath => seoHead({relativePath, pages, title:'Quick start | Xmake', description:'Build a C++ project.', lang:relativePath.startsWith('zh/')?'zh-Hans':'en-US'})
test('canonical URLs match index and HTML routes, including clean URL option', () => {
 assert.equal(pageUrl('index.md'), 'https://xmake.io/')
 assert.equal(pageUrl('zh/index.md'), 'https://xmake.io/zh/')
 assert.equal(pageUrl('guide/quick-start.md'), 'https://xmake.io/guide/quick-start.html')
 assert.equal(pageUrl('guide/quick-start.md', true), 'https://xmake.io/guide/quick-start')
})
test('translations have reciprocal existing alternates and self canonicals', () => {
 for(const path of ['guide/quick-start.md','zh/guide/quick-start.md']) {
  const head=render(path)
  assert.equal(head.find(([,a])=>a.rel==='canonical')[1].href,pageUrl(path))
  assert.deepEqual(head.filter(([,a])=>a.rel==='alternate').map(([,a])=>a.href),[pageUrl(pages[2]),pageUrl(pages[3]),pageUrl(pages[2])])
  assert.equal(head.find(([,a])=>a.property==='og:url')[1].content,pageUrl(path))
 }
 assert.equal(render('posts/english-only.md').filter(([,a])=>a.rel==='alternate').length,0)
})
test('repeat transforms replace managed tags and retain unrelated author metadata', () => {
 const custom=[['meta',{name:'author',content:'Ruki'}]]
 const once=mergeSeoHead(custom,render('index.md'))
 assert.deepEqual(mergeSeoHead(once,render('index.md')),once)
 assert.ok(once.includes(custom[0]))
})
test('error and migration pages are not indexed', () => {
 assert.equal(isIndexable('404.html'),false)
 assert.equal(isIndexable('zh/404.md'),false)
 assert.equal(isIndexable('migration.html'),false)
 assert.equal(isIndexable('guide/quick-start.html'),true)
 assert.equal(render('404.md').find(([,a])=>a.name==='robots')[1].content,'noindex, follow')
})

test('descriptions use prose and inline code, never code blocks or image alt text', async () => {
 const { proseDescription } = await import('../../docs/.vitepress/seo.mjs')
 const paragraph = children => [{type:'paragraph_open',level:0},{type:'inline',children}]
 const tokens = [{type:'fence',content:'SECRET_CODE'}, ...paragraph([{type:'image',content:'IMAGE_ALT'}]),
  ...paragraph([{type:'text',content:'Configure dependencies with '},{type:'code_inline',content:'add_requires'},{type:'text',content:' and link them to your build targets.'}])]
 assert.equal(proseDescription(tokens),'Configure dependencies with add_requires and link them to your build targets.')
 assert.equal(proseDescription([{type:'html_block',content:'<FileExplorer />'}]),'')
 const long=proseDescription(paragraph([{type:'text',content:'Build C++ projects with Xmake. '.repeat(20)}]))
 assert.ok(long.length<=191)
 assert.ok(long.endsWith('…'))
})
test('authored descriptions are preserved and source-code pages are excluded', async () => {
 const { descriptionPlugin }=await import('../../docs/.vitepress/seo.mjs')
 let run
 descriptionPlugin({core:{ruler:{push:(_name,fn)=>{run=fn}}}})
 const tokens=[{type:'paragraph_open',level:0},{type:'inline',children:[{type:'text',content:'A complete tutorial for building C++ programs with Xmake.'}]}]
 const env={relativePath:'guide/example.md',frontmatter:{description:'Handwritten description'}}
 run({env,tokens});assert.equal(env.frontmatter.description,'Handwritten description')
 const source={relativePath:'codes/example.md',frontmatter:{}}
 run({env:source,tokens});assert.equal(source.frontmatter.description,undefined)
 const guide={relativePath:'guide/example.md',frontmatter:{}}
 run({env:guide,tokens});assert.ok(guide.frontmatter.description.startsWith('A complete'))
})
