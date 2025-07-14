#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const glob = require('glob');

const DOCS_ROOT = path.resolve(__dirname, '../docs');
const EN_POSTS = path.join(DOCS_ROOT, 'posts');
const ZH_POSTS = path.join(DOCS_ROOT, 'zh/posts');

const EN_REPLACE = 'https://xmake.io';
const ZH_REPLACE = 'https://xmake.io/zh/';

// 匹配 markdown 链接 [text](url)
const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;

// 检查 http(s) 链接是否可访问
function checkHttpLink(url) {
  return new Promise((resolve) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve(res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

// 检查内部链接是否存在对应 md 文件
function checkInternalLink(mdRoot, url) {
  // 只处理 /xx 或 /xx/yy 形式
  let clean = url.split('#')[0].split('?')[0];
  if (clean.endsWith('/')) clean += 'index';
  if (clean.startsWith('/')) clean = clean.slice(1);
  // 支持 .md 或 index.md
  const candidates = [
    path.join(mdRoot, clean + '.md'),
    path.join(mdRoot, clean, 'index.md'),
  ];
  return candidates.some((f) => fs.existsSync(f));
}

// 处理单个文件
async function processFile(file, isZh) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  const tasks = [];
  content = content.replace(LINK_REGEX, (match, text, url) => {
    // 只处理 http(s) 或 / 开头的链接
    if (/^https?:\/\//.test(url)) {
      tasks.push(
        checkHttpLink(url).then((ok) => {
          if (!ok) {
            changed = true;
            return `[${text}](${isZh ? ZH_REPLACE : EN_REPLACE})`;
          }
          return match;
        })
      );
      return `__LINK_PLACEHOLDER_${tasks.length - 1}__`;
    } else if (url.startsWith('/')) {
      const mdRoot = isZh ? path.join(DOCS_ROOT, 'zh') : DOCS_ROOT;
      if (!checkInternalLink(mdRoot, url)) {
        changed = true;
        return `[${text}](${isZh ? ZH_REPLACE : EN_REPLACE})`;
      }
    }
    return match;
  });
  // 等待所有 http(s) 检查
  if (tasks.length > 0) {
    const results = await Promise.all(tasks);
    let idx = 0;
    content = content.replace(/__LINK_PLACEHOLDER_(\d+)__/g, (_, n) => results[Number(n)]);
  }
  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed:', file);
  }
}

async function main() {
  const files = [
    ...glob.sync(path.join(EN_POSTS, '*.md')),
    ...glob.sync(path.join(ZH_POSTS, '*.md')),
  ];
  for (const file of files) {
    const isZh = file.includes('/zh/posts/');
    await processFile(file, isZh);
  }
  console.log('All done.');
}

main(); 