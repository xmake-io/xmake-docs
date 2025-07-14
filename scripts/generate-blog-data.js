#!/usr/bin/env node

import { readdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

// 读取 posts 目录下的所有 markdown 文件
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
    
    // 按日期排序，最新的在前
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
  // 移除 frontmatter
  const contentWithoutFrontmatter = content.replace(/---[\s\S]*?---/, '')
  
  // 按段落分割（空行分隔）
  const paragraphs = contentWithoutFrontmatter
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
  
  // 提取前三个完整段落
  let excerpt = ''
  let paragraphCount = 0
  const maxParagraphs = 3
  
  for (const paragraph of paragraphs) {
    // 跳过标题行（以 # 开头）
    if (paragraph.startsWith('#')) {
      continue
    }
    
    // 如果段落太长（超过300字符），截取前300字符
    const truncatedParagraph = paragraph.length > 300 
      ? paragraph.slice(0, 300).trim() + '...'
      : paragraph
    
    excerpt += truncatedParagraph + '\n\n'
    paragraphCount++
    
    if (paragraphCount >= maxParagraphs) {
      break
    }
  }
  
  // 如果没有找到合适的段落，使用原来的方法
  if (!excerpt.trim()) {
    const rawExcerpt = contentWithoutFrontmatter.slice(0, 200).trim() + '...'
    return md.render(rawExcerpt)
  }
  
  // 转成 HTML
  return md.render(excerpt.trim())
}

// 生成英文博客数据
const enPosts = getPosts(join(process.cwd(), 'docs/posts'))
const enData = `export const posts = ${JSON.stringify(enPosts, null, 2)}`

// 生成中文博客数据
const zhPosts = getPosts(join(process.cwd(), 'docs/zh/posts'))
// 为中文博客文章添加 /zh/ 前缀
const zhPostsWithPrefix = zhPosts.map(post => ({
  ...post,
  url: `/zh${post.url}`
}))
const zhData = `export const posts = ${JSON.stringify(zhPostsWithPrefix, null, 2)}`

// 写入数据文件
writeFileSync(join(process.cwd(), 'docs/.vitepress/theme/blog-data.js'), enData)
writeFileSync(join(process.cwd(), 'docs/.vitepress/theme/zh-blog-data.js'), zhData)

console.log(`Generated blog data: ${enPosts.length} English posts, ${zhPosts.length} Chinese posts`) 