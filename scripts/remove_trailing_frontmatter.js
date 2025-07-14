#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function removeAllExtraFrontmatters(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        let newLines = [];
        let inFrontmatter = false;
        let frontmatterCount = 0;
        let i = 0;
        // Step 1: Keep only the first frontmatter block
        while (i < lines.length) {
            if (lines[i].trim() === '---') {
                frontmatterCount++;
                newLines.push(lines[i]);
                i++;
                // Enter frontmatter
                while (i < lines.length) {
                    newLines.push(lines[i]);
                    if (lines[i].trim() === '---') {
                        i++;
                        break;
                    }
                    i++;
                }
                break;
            }
            newLines.push(lines[i]);
            i++;
        }
        // Step 2: Skip all subsequent frontmatter blocks
        let inExtraFrontmatter = false;
        for (; i < lines.length; i++) {
            if (lines[i].trim() === '---') {
                if (!inExtraFrontmatter) {
                    inExtraFrontmatter = true;
                    continue;
                } else {
                    inExtraFrontmatter = false;
                    continue;
                }
            }
            if (!inExtraFrontmatter) {
                newLines.push(lines[i]);
            }
        }
        const newContent = newLines.join('\n');
        if (newContent !== content) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return false;
    }
}

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    let processedCount = 0;
    let changedCount = 0;
    for (const file of files) {
        if (file.endsWith('.md')) {
            const filePath = path.join(dirPath, file);
            processedCount++;
            if (removeAllExtraFrontmatters(filePath)) {
                changedCount++;
                console.log(`Fixed: ${filePath}`);
            }
        }
    }
    return { processedCount, changedCount };
}

const englishPostsDir = 'docs/posts';
const chinesePostsDir = 'docs/zh/posts';
console.log('Processing English posts...');
const englishStats = processDirectory(englishPostsDir);
console.log('Processing Chinese posts...');
const chineseStats = processDirectory(chinesePostsDir);
console.log('\nSummary:');
console.log(`English posts: ${englishStats.processedCount} processed, ${englishStats.changedCount} changed`);
console.log(`Chinese posts: ${chineseStats.processedCount} processed, ${chineseStats.changedCount} changed`);
console.log(`Total: ${englishStats.processedCount + chineseStats.processedCount} processed, ${englishStats.changedCount + chineseStats.changedCount} changed`); 