#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

// Read all markdown files in the posts directory
function getPosts(postsDir) {
  try {
    const files = readdirSync(postsDir)
    const posts = []
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = join(postsDir, file)
        const content = readFileSync(filePath, 'utf-8')
        const { data: frontmatter } = matter(content)
        
        if (frontmatter.title && frontmatter.date) {
          posts.push({
            title: frontmatter.title,
            url: `/posts/${file.replace('.md', '')}`,
            date: formatDate(frontmatter.date),
            author: frontmatter.author,
            tags: frontmatter.tags,
            excerpt: frontmatter.excerpt
              ? md.render(frontmatter.excerpt)
              : generateExcerpt(content)
          })
        }
      }
    }
    
    // Sort by date, newest first
    return posts.sort((a, b) => new Date(b.date.time) - new Date(a.date.time))
  } catch (error) {
    console.error('Error reading posts:', error)
    return []
  }
}

function formatDate(raw) {
  const date = new Date(raw)
  date.setUTCHours(12)
  return {
    time: +date,
    string: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

function generateExcerpt(content) {
  // Remove frontmatter
  const contentWithoutFrontmatter = content.replace(/---[\s\S]*?---/, '')
  
  // Split by paragraphs (separated by blank lines)
  const paragraphs = contentWithoutFrontmatter
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
  
  // Take the first three complete paragraphs
  let excerpt = ''
  let paragraphCount = 0
  const maxParagraphs = 3
  
  for (const paragraph of paragraphs) {
    // Skip heading lines (starting with #)
    if (paragraph.startsWith('#')) {
      continue
    }
    
    // If the paragraph is too long (>300 chars), truncate to 300 chars
    const truncatedParagraph = paragraph.length > 300 
      ? paragraph.slice(0, 300).trim() + '...'
      : paragraph
    
    excerpt += truncatedParagraph + '\n\n'
    paragraphCount++
    
    if (paragraphCount >= maxParagraphs) {
      break
    }
  }
  
  // If no suitable paragraph found, use the original method
  if (!excerpt.trim()) {
    const rawExcerpt = contentWithoutFrontmatter.slice(0, 200).trim() + '...'
    return md.render(rawExcerpt)
  }
  
  // Convert to HTML
  return md.render(excerpt.trim())
}

// Generate English blog data
const enPosts = getPosts(join(process.cwd(), 'docs/posts'))
const enData = `export const posts = ${JSON.stringify(enPosts, null, 2)}`

// Generate Chinese blog data
const zhPosts = getPosts(join(process.cwd(), 'docs/zh/posts'))
// Add /zh/ prefix for Chinese blog post URLs
const zhPostsWithPrefix = zhPosts.map(post => ({
  ...post,
  url: `/zh${post.url}`
}))
const zhData = `export const posts = ${JSON.stringify(zhPostsWithPrefix, null, 2)}`

// Write data files
writeFileSync(join(process.cwd(), 'docs/.vitepress/theme/blog-data.js'), enData)
writeFileSync(join(process.cwd(), 'docs/.vitepress/theme/zh-blog-data.js'), zhData)

console.log(`Generated blog data: ${enPosts.length} English posts, ${zhPosts.length} Chinese posts`) 