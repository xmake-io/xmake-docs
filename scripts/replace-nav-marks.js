#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Replace navigation mark with Vue component in English blog posts
function replaceNavInEnglishPosts() {
  const postsDir = join(process.cwd(), 'docs/posts')
  const files = readdirSync(postsDir)

  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')

      // Replace navigation mark with Vue component
      const navComponent = '\n\n<script setup>\nimport BlogNav from \'../.vitepress/theme/BlogNav.vue\'\n</script>\n\n<BlogNav />'
      const newContent = content.replace('<!-- BLOG_NAV -->', navComponent)

      if (content !== newContent) {
        writeFileSync(filePath, newContent)
        console.log(`Replaced nav mark in: ${file}`)
      }
    }
  }
}

// Replace navigation mark with Vue component in Chinese blog posts
function replaceNavInChinesePosts() {
  const postsDir = join(process.cwd(), 'docs/zh/posts')
  const files = readdirSync(postsDir)

  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')

      // Replace navigation mark with Vue component
      const navComponent = '\n\n<script setup>\nimport BlogNav from \'../../.vitepress/theme/BlogNav.vue\'\n</script>\n\n<BlogNav />'
      const newContent = content.replace('<!-- BLOG_NAV -->', navComponent)

      if (content !== newContent) {
        writeFileSync(filePath, newContent)
        console.log(`Replaced nav mark in: ${file}`)
      }
    }
  }
}

// Execute script
console.log('Replacing navigation marks with Vue components...')
replaceNavInEnglishPosts()
replaceNavInChinesePosts()
console.log('Done!') 