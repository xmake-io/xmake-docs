#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Remove navigation component from English blog posts
function removeNavFromEnglishPosts() {
  const postsDir = join(process.cwd(), 'docs/posts')
  const files = readdirSync(postsDir)

  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')

      // Remove navigation component
      const cleanedContent = content.replace(/\n<script setup>\nimport BlogPostNav from '\.\.\/\.vitepress\/theme\/BlogPostNav\.vue'\n<\/script>\n\n<BlogPostNav \/>/g, '')

      if (content !== cleanedContent) {
        writeFileSync(filePath, cleanedContent)
        console.log(`Removed nav from: ${file}`)
      }
    }
  }
}

// Remove navigation component from Chinese blog posts
function removeNavFromChinesePosts() {
  const postsDir = join(process.cwd(), 'docs/zh/posts')
  const files = readdirSync(postsDir)

  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')

      // Remove navigation component
      const cleanedContent = content.replace(/\n<script setup>\nimport BlogPostNavZh from '\.\.\/\.\.\/\.vitepress\/theme\/BlogPostNavZh\.vue'\n<\/script>\n\n<BlogPostNavZh \/>/g, '')

      if (content !== cleanedContent) {
        writeFileSync(filePath, cleanedContent)
        console.log(`Removed nav from: ${file}`)
      }
    }
  }
}

// Execute script
console.log('Removing navigation components from blog posts...')
removeNavFromEnglishPosts()
removeNavFromChinesePosts()
console.log('Done!') 