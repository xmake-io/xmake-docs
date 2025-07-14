#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// 为英文博客文章添加导航组件
function addNavToEnglishPosts() {
  const postsDir = join(process.cwd(), 'docs/posts')
  const files = readdirSync(postsDir)
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // 检查是否已经添加了导航组件
      if (!content.includes('<BlogPostNav />')) {
        const navComponent = `

<script setup>
import BlogPostNav from '../.vitepress/theme/BlogPostNav.vue'
</script>

<BlogPostNav />`
        
        const newContent = content + navComponent
        writeFileSync(filePath, newContent)
        console.log(`Added nav to: ${file}`)
      }
    }
  }
}

// 为中文博客文章添加导航组件
function addNavToChinesePosts() {
  const postsDir = join(process.cwd(), 'docs/zh/posts')
  const files = readdirSync(postsDir)
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // 检查是否已经添加了导航组件
      if (!content.includes('<BlogPostNavZh />')) {
        const navComponent = `

<script setup>
import BlogPostNavZh from '../../.vitepress/theme/BlogPostNavZh.vue'
</script>

<BlogPostNavZh />`
        
        const newContent = content + navComponent
        writeFileSync(filePath, newContent)
        console.log(`Added nav to: ${file}`)
      }
    }
  }
}

// 执行脚本
console.log('Adding navigation components to blog posts...')
addNavToEnglishPosts()
addNavToChinesePosts()
console.log('Done!') 