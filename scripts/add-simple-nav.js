#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// 为英文博客文章添加导航标记
function addNavToEnglishPosts() {
  const postsDir = join(process.cwd(), 'docs/posts')
  const files = readdirSync(postsDir)
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // 检查是否已经添加了导航标记
      if (!content.includes('<!-- BLOG_NAV -->')) {
        const navMark = '\n\n<!-- BLOG_NAV -->\n'
        const newContent = content + navMark
        writeFileSync(filePath, newContent)
        console.log(`Added nav mark to: ${file}`)
      }
    }
  }
}

// 为中文博客文章添加导航标记
function addNavToChinesePosts() {
  const postsDir = join(process.cwd(), 'docs/zh/posts')
  const files = readdirSync(postsDir)
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // 检查是否已经添加了导航标记
      if (!content.includes('<!-- BLOG_NAV -->')) {
        const navMark = '\n\n<!-- BLOG_NAV -->\n'
        const newContent = content + navMark
        writeFileSync(filePath, newContent)
        console.log(`Added nav mark to: ${file}`)
      }
    }
  }
}

// 执行脚本
console.log('Adding navigation marks to blog posts...')
addNavToEnglishPosts()
addNavToChinesePosts()
console.log('Done!') 