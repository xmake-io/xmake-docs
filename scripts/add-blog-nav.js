#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Add navigation component to English blog posts
function addNavToEnglishPosts() {
  const postsDir = join(process.cwd(), 'docs/posts')
  const files = readdirSync(postsDir)

  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')

      // Check if the navigation component has already been added
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

// Add navigation component to Chinese blog posts
function addNavToChinesePosts() {
  const postsDir = join(process.cwd(), 'docs/zh/posts')
  const files = readdirSync(postsDir)

  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')

      // Check if the navigation component has already been added
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

// Execute script
console.log('Adding navigation components to blog posts...')
addNavToEnglishPosts()
addNavToChinesePosts()
console.log('Done!') 