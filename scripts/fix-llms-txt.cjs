const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

const distDir = path.join(__dirname, '../docs/.vitepress/dist');
const docsDir = path.join(__dirname, '../docs');
const codesSrcDir = path.join(__dirname, '../docs/codes');
const files = ['llms.txt', 'llms-full.txt'];

function cleanTitle(title) {
  // Remove markdown anchors like {#...}
  let cleaned = title.replace(/\s*\{#[^}]+\}\s*/g, '');
  
  // Decode HTML entities (basic ones)
  cleaned = cleaned.replace(/&#x20;/g, ' ')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&amp;/g, '&')
                   .replace(/&quot;/g, '"')
                   .replace(/&apos;/g, "'");
                   
  return cleaned.trim();
}

function getProjectCodes(rootFilesDir) {
  const fullProjectDir = path.join(codesSrcDir, rootFilesDir);
  if (!fs.existsSync(fullProjectDir)) return '';

  const projectFiles = globSync('**/*.*', {
    cwd: fullProjectDir,
    ignore: [
      '**/build/**',
      '**/.*',
      '**/*.o',
      '**/*.obj',
      '**/*.exe',
      '**/*.bin',
      '**/test.lua',
      '**/*.cache/**',
      '**/*.gcm',
      '**/compile_commands.json',
      '**/compile_command.json'
    ],
    nodir: true
  });

  if (projectFiles.length === 0) return '';

  let output = `\n\n### Code Examples (${rootFilesDir})\n`;

  // Sort files
  projectFiles.sort((a, b) => {
    if (a === 'xmake.lua') return -1;
    if (b === 'xmake.lua') return 1;
    return a.localeCompare(b);
  });

  for (const file of projectFiles) {
    const fullPath = path.join(fullProjectDir, file);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const ext = path.extname(file).toLowerCase().substring(1);
    const lang = (file.endsWith('xmake.lua') || ext === 'lua') ? 'lua' : 
                 (['c', 'cpp', 'h', 'hpp', 'm', 'mm'].includes(ext) ? 'cpp' : 
                 (ext || 'text'));

    output += `\n#### ${file}\n\n\`\`\`${lang}\n${content}\n\`\`\`\n`;
  }
  return output;
}

function processFile(filename) {
  const filePath = path.join(distDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Inject FileExplorer codes
  const parts = content.split(/^---\r?\nurl: (.*?)\r?\n---/gm);
  if (parts.length > 1) {
    let newContent = parts[0];
    for (let i = 1; i < parts.length; i += 2) {
      const url = parts[i];
      let sectionContent = parts[i+1];
      
      const relPath = url.startsWith('/') ? url.substring(1) : url;
      // Remove .html if present and add .md, but usually url in llms.txt keeps .md or original
      // The Read result showed /zh/guide/.../install-and-uninstall.md
      // So we assume it maps to docs/...
      
      // If url ends with .html, replace with .md
      let mdRelPath = relPath;
      if (mdRelPath.endsWith('.html')) {
        mdRelPath = mdRelPath.replace(/\.html$/, '.md');
      }
      
      const mdPath = path.join(docsDir, mdRelPath);

      if (fs.existsSync(mdPath)) {
        const mdContent = fs.readFileSync(mdPath, 'utf8');
        // Find FileExplorer tags
        const regex = /<FileExplorer\s+rootFilesDir="([^"]+)"\s*\/>/g;
        let match;
        const codesToAdd = [];
        while ((match = regex.exec(mdContent)) !== null) {
          const rootFilesDir = match[1];
          const codes = getProjectCodes(rootFilesDir);
          if (codes) {
            codesToAdd.push(codes);
          }
        }

        if (codesToAdd.length > 0) {
          sectionContent += codesToAdd.join('\n');
        }
      }

      newContent += `---
url: ${url}
---${sectionContent}`;
    }
    content = newContent;
  }

  // Fix TOC titles in format: - [Title](link)
  // We match the line starting with - [
  content = content.replace(/^-\s+\[(.*?)\]\((.*?)\)/gm, (match, title, link) => {
    const newTitle = cleanTitle(title);
    return `- [${newTitle}](${link})`;
  });
  
  // Also fix titles in the content (for llms-full.txt)
  content = content.replace(/^(#+)\s+(.*?)(\s+\{#[^}]+\})?\s*$/gm, (match, hashes, title, anchor) => {
     return match; // Don't change headers in content for now
  });

  // Add BOM if not present
  if (!content.startsWith('\uFEFF')) {
    content = '\uFEFF' + content;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${filename}`);
}

files.forEach(processFile);
