import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createHighlighter } from 'shiki'
import { glob } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const codesSrcDir = path.resolve(__dirname, '../docs/codes')
const outputDir = path.resolve(__dirname, '../docs/.vitepress/data')
const outputFile = path.join(outputDir, 'codes-data.js')

async function generate() {
  if (!fs.existsSync(codesSrcDir)) {
    console.log('Codes directory not found:', codesSrcDir)
    return
  }

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  console.log('Generating codes data...')

  const highlighter = await createHighlighter({
    themes: ['github-dark', 'github-light'],
    langs: ['cpp', 'lua', 'json', 'bash', 'xml', 'toml', 'yaml']
  })
  
  // Find all xmake.lua files to identify project roots
  const projectRoots = await glob('**/xmake.lua', { 
    cwd: codesSrcDir,
    ignore: ['**/build/**', '**/.*/**'] 
  })

  const codes = {}

  for (const rootFile of projectRoots) {
    const projectDir = path.dirname(rootFile)
    // Use project directory relative path as key (e.g. "examples/cpp/basic_console")
    const key = projectDir
    const fullProjectDir = path.join(codesSrcDir, projectDir)
    
    // Get all files in this project
    const projectFiles = await glob('**/*.*', {
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

    codes[key] = files
  }

  const content = `export const data = ${JSON.stringify(codes, null, 2)}`
  fs.writeFileSync(outputFile, content)
  console.log(`Generated ${outputFile}`)
}

generate().catch(console.error)
