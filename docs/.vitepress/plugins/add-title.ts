/**
 * Extract title from frontmatter and add it to content if not present
 * Only processes files that have frontmatter with a title field
 */
export function addTitleFromFrontmatter(src: string): string {
  // Extract frontmatter
  const frontmatterMatch = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n/)
  if (!frontmatterMatch) {
    return src
  }

  // Get content after frontmatter
  const contentAfterFrontmatter = src.slice(frontmatterMatch[0].length)
  
  // Check if content already starts with a heading (H1)
  const trimmedContent = contentAfterFrontmatter.trim()
  if (/^#\s+/.test(trimmedContent)) {
    return src
  }

  // Extract title from frontmatter
  const frontmatter = frontmatterMatch[1]
  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m)
  if (!titleMatch) {
    return src
  }

  // Extract title (handle quoted and unquoted strings)
  let title = titleMatch[1].trim()
  // Remove quotes if present
  if ((title.startsWith('"') && title.endsWith('"')) || 
      (title.startsWith("'") && title.endsWith("'"))) {
    title = title.slice(1, -1)
  }
  
  // Ensure title is not empty
  if (!title) {
    return src
  }

  // Add title as H1 after frontmatter
  // Replace newlines and ensure title is properly formatted
  const escapedTitle = title.replace(/\n/g, ' ').trim()
  
  return frontmatterMatch[0] + `# ${escapedTitle}\n\n` + contentAfterFrontmatter
}

