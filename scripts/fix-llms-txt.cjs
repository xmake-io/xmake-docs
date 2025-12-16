const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../docs/.vitepress/dist');
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

function processFile(filename) {
  const filePath = path.join(distDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix TOC titles in format: - [Title](link)
  // We match the line starting with - [
  content = content.replace(/^-\s+\[(.*?)\]\((.*?)\)/gm, (match, title, link) => {
    const newTitle = cleanTitle(title);
    return `- [${newTitle}](${link})`;
  });
  
  // Also fix titles in the content (for llms-full.txt)
  // Titles usually start with # 
  // e.g. # 安装卸载 {#install-and-uninstall}
  content = content.replace(/^(#+)\s+(.*?)(\s+\{#[^}]+\})?\s*$/gm, (match, hashes, title, anchor) => {
     // If it's a header, we also want to clean the title part
     // But wait, the anchor in header is actually useful for linking?
     // In llms-full.txt, we might want to keep the header as is, or maybe clean it too?
     // The user complaint was "garbled", which likely refers to the messy text.
     // For headers in full text, keeping anchor is fine as it defines the ID.
     // But looking at llms-full.txt content:
     // # 安装卸载 {#install-and-uninstall}
     // This is standard markdown header with ID. It is NOT garbled.
     
     // However, the TOC in llms.txt has:
     // - [安装卸载 {#install-and-uninstall}](/zh/guide/basic-commands/install-and-uninstall.md)
     // This looks messy in a list of links.
     
     return match; // Don't change headers in content for now, unless requested.
  });

  // Add BOM if not present
  if (!content.startsWith('\uFEFF')) {
    content = '\uFEFF' + content;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${filename}`);
}

files.forEach(processFile);
