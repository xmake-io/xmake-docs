#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// 替换英文博客文章中的导航标记
function replaceNavInEnglishPosts() {
  const postsDir = join(process.cwd(), 'docs/posts')
  const files = readdirSync(postsDir)
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // 替换导航标记为Vue组件
      const navComponent = '\n\n<script setup>\nimport BlogNav from \'../.vitepress/theme/BlogNav.vue\'\n</script>\n\n<BlogNav />'
      const newContent = content.replace('<!-- BLOG_NAV -->', navComponent)
      
      if (content !== newContent) {
        writeFileSync(filePath, newContent)
        console.log(`Replaced nav mark in: ${file}`)
      }
    }
  }
}

// 替换中文博客文章中的导航标记
function replaceNavInChinesePosts() {
  const postsDir = join(process.cwd(), 'docs/zh/posts')
  const files = readdirSync(postsDir)
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // 替换导航标记为Vue组件
      const navComponent = '\n\n<script setup>\nimport BlogNav from \'../../.vitepress/theme/BlogNav.vue\'\n</script>\n\n<BlogNav />'
      const newContent = content.replace('<!-- BLOG_NAV -->', navComponent)
      
      if (content !== newContent) {
        writeFileSync(filePath, newContent)
        console.log(`Replaced nav mark in: ${file}`)
      }
    }
  }
}

// 执行脚本
console.log('Replacing navigation marks with Vue components...')
replaceNavInEnglishPosts()
replaceNavInChinesePosts()
console.log('Done!') 