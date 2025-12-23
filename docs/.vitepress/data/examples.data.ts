import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createHighlighter } from 'shiki'
import { glob } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  async load() {
    const examplesSrcDir = path.resolve(__dirname, '../../codes/examples')
    
    if (!fs.existsSync(examplesSrcDir)) {
      return {}
    }

    const highlighter = await createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['cpp', 'lua', 'json', 'bash', 'xml', 'toml', 'yaml']
    })
    
    // Find all xmake.lua files to identify project roots
    const projectRoots = await glob('**/xmake.lua', { 
      cwd: examplesSrcDir,
      ignore: ['**/build/**', '**/.*/**'] 
    })

    const examples: Record<string, any[]> = {}

    for (const rootFile of projectRoots) {
      const projectDir = path.dirname(rootFile)
      // Use project directory relative path as key (e.g. "examples/cpp/basic_console")
      const key = 'examples/' + projectDir
      const fullProjectDir = path.join(examplesSrcDir, projectDir)
      
      // Get all files in this project
      const projectFiles = await glob('**/*.*', {
        cwd: fullProjectDir,
        ignore: ['**/build/**', '**/.*', '**/*.o', '**/*.obj', '**/*.exe', '**/*.bin'],
        nodir: true
      })

      const files = []

      for (const file of projectFiles) {
        const fullPath = path.join(fullProjectDir, file)
        const content = fs.readFileSync(fullPath, 'utf-8')
        const ext = path.extname(file).toLowerCase().substring(1)
        
        // Map extension to language
        let language = ext
        if (file.endsWith('xmake.lua')) language = 'lua'
        else if (['h', 'hpp', 'c', 'cc', 'cxx'].includes(ext)) language = 'cpp'
        
        try {
          files.push({
            name: file,
            code: content,
            language: language,
            highlightedCode: highlighter.codeToHtml(content, {
              lang: language,
              themes: {
                light: 'github-light',
                dark: 'github-dark'
              }
            })
          })
        } catch (e) {
            // Fallback for unknown languages or binary files
            files.push({
                name: file,
                code: content,
                language: 'text'
            })
        }
      }

      // Sort files: xmake.lua first, then folders, then files
      files.sort((a, b) => {
        if (a.name === 'xmake.lua') return -1
        if (b.name === 'xmake.lua') return 1
        return a.name.localeCompare(b.name)
      })

      examples[key] = files
    }
    
    return examples
  }
}
