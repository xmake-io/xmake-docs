#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Add navigation mark to English blog posts
function addNavToEnglishPosts() {
  const postsDir = join(process.cwd(), 'docs/posts')
  const files = readdirSync(postsDir)
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // Check if the navigation mark has already been added
      if (!content.includes('<!-- BLOG_NAV -->')) {
        const navMark = '\n\n<!-- BLOG_NAV -->\n'
        const newContent = content + navMark
        writeFileSync(filePath, newContent)
        console.log(`Added nav mark to: ${file}`)
      }
    }
  }
}

// Add navigation mark to Chinese blog posts
function addNavToChinesePosts() {
  const postsDir = join(process.cwd(), 'docs/zh/posts')
  const files = readdirSync(postsDir)
  
  for (const file of files) {
    if (file.endsWith('.md')) {
      const filePath = join(postsDir, file)
      const content = readFileSync(filePath, 'utf-8')
      
      // Check if the navigation mark has already been added
      if (!content.includes('<!-- BLOG_NAV -->')) {
        const navMark = '\n\n<!-- BLOG_NAV -->\n'
        const newContent = content + navMark
        writeFileSync(filePath, newContent)
        console.log(`Added nav mark to: ${file}`)
      }
    }
  }
}

// Execute script
console.log('Adding navigation marks to blog posts...')
addNavToEnglishPosts()
addNavToChinesePosts()
console.log('Done!') 