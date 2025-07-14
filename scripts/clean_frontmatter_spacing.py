#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
清理 frontmatter 中 author: Ruki 和 --- 之间多余的空行
"""

import os
import re
from pathlib import Path

def clean_frontmatter_spacing(content):
    """清理 frontmatter 中的多余空行"""
    
    # 匹配 frontmatter 部分
    def clean_frontmatter(match):
        frontmatter = match.group(1)
        
        # 分割 frontmatter 行
        lines = frontmatter.split('\n')
        cleaned_lines = []
        
        for line in lines:
            line = line.strip()
            if line:  # 保留非空行
                cleaned_lines.append(line)
        
        # 重新组装 frontmatter，确保 author: Ruki 后面没有多余空行
        cleaned_frontmatter = '\n'.join(cleaned_lines)
        
        return f'---\n{cleaned_frontmatter}\n---\n\n'
    
    # 匹配整个 frontmatter 块
    content = re.sub(
        r'^---\s*\n(.*?)\n---\s*\n',
        clean_frontmatter,
        content,
        flags=re.DOTALL
    )
    
    return content

def fix_file(filepath):
    """修复单个文件的 frontmatter 间距"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 清理 frontmatter 间距
        content = clean_frontmatter_spacing(content)
        
        # 如果内容有变化，写回文件
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")
            return True
        
        return False
        
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")
        return False

def main():
    """主函数"""
    target_dirs = ["docs/posts", "docs/zh/posts"]
    total_files = 0
    fixed_files = 0
    
    for target_dir in target_dirs:
        if not os.path.exists(target_dir):
            print(f"Directory not found: {target_dir}")
            continue
            
        for filepath in Path(target_dir).rglob("*.md"):
            total_files += 1
            if fix_file(str(filepath)):
                fixed_files += 1
    
    print(f"\nFrontmatter spacing cleaning completed!")
    print(f"Total files processed: {total_files}")
    print(f"Files fixed: {fixed_files}")

if __name__ == "__main__":
    main() 