<script setup lang="ts">
import { ref, computed, watchEffect, onMounted, onUnmounted, inject } from 'vue'
import JSZip from 'jszip'
import FileTreeNode from './FileTreeNode.vue'
import type { File, TreeNode } from './types'

interface Props {
  /**
   * List of files to display in the explorer.
   * Example: [{ name: 'xmake.lua', code: '...' }, { name: 'src/main.cpp', code: '...' }]
   * If not provided, will try to load from global 'codes' data using 'project' prop.
   */
  files?: File[]
  /**
   * Project directory path to load from global codes data.
   * Example: 'examples/cpp/basic_console'
   * Used only if 'files' prop is not provided.
   */
  rootFilesDir?: string
  /**
   * Whether to show the fullscreen toggle button.
   * @default true
   */
  showFullscreen?: boolean
  /**
   * Whether the sidebar should be open initially.
   * @default true
   */
  initialSidebarOpen?: boolean
  /**
   * Path of the file to open by default.
   * Example: 'src/main.cpp'
   * If not provided, defaults to 'xmake.lua' or the first file.
   */
  defaultOpenPath?: string
  /**
   * Name of the root folder to display in the sidebar header.
   * Example: 'my_project'
   * @default 'EXPLORER'
   */
  rootPath?: string
  /**
   * Height of the explorer container.
   * Can be a CSS value or 'auto' to fit content.
   * Examples: '500px', '40vh', 'auto'
   * @default 'auto'
   */
  height?: string
  /**
   * Aspect ratio of the explorer container.
   * If provided, overrides height.
   * Examples: '16/9', '4/3'
   */
  aspectRatio?: string
  /**
   * Title to display in a bar above the explorer content.
   * Example: 'Console Application Example'
   */
  title?: string
  /**
   * Whether to show line numbers in the code view.
   * @default true
   */
  showLineNumbers?: boolean
  /**
   * Highlight configuration for files.
   * Map of filename to highlight ranges string.
   * Example:
   * {
   *   'src/main.cpp': '5-7',
   *   'xmake.lua': '1-3, 5'
   * }
   */
  highlights?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  showFullscreen: true,
  initialSidebarOpen: true,
  height: 'auto',
  showLineNumbers: true
})

const globalCodes = inject<Record<string, File[]>>('codes')

const effectiveFiles = computed(() => {
  if (props.files && props.files.length > 0) {
    return props.files
  }
  if (props.rootFilesDir && globalCodes && globalCodes[props.rootFilesDir]) {
    return globalCodes[props.rootFilesDir]
  }
  return []
})

const activeFileIndex = ref(0)
const tree = ref<TreeNode[]>([])
const copied = ref(false)
const downloaded = ref(false)
const isFullscreen = ref(false)
const isSidebarOpen = ref(props.initialSidebarOpen)
const containerRef = ref<HTMLElement | null>(null)
const shared = ref(false)

// Initialize active file index (prefer defaultOpenPath -> xmake.lua -> first file)
const initActiveFileIndex = () => {
  const files = effectiveFiles.value
  if (files.length === 0) return

  // 1. Try defaultOpenPath prop
  if (props.defaultOpenPath) {
    const index = files.findIndex(f => f.name === props.defaultOpenPath)
    if (index !== -1) {
      activeFileIndex.value = index
      return
    }
  }

  // 2. Try xmake.lua
  const xmakeIndex = files.findIndex(f => f.name === 'xmake.lua' || f.name.endsWith('/xmake.lua'))
  if (xmakeIndex !== -1) {
    activeFileIndex.value = xmakeIndex
  } else {
    activeFileIndex.value = 0
  }
}

// Call immediately to set default state
initActiveFileIndex()

// Build tree from files
const buildTree = (files: File[]) => {
  const root: TreeNode[] = []
  
  files.forEach((file) => {
    const parts = file.name.split('/')
    let currentLevel = root
    
    parts.forEach((part, partIndex) => {
      const isFile = partIndex === parts.length - 1
      const existingNode = currentLevel.find(node => node.name === part)
      
      if (existingNode) {
        if (isFile) {
           existingNode.fileData = file
        } else {
           currentLevel = existingNode.children!
        }
      } else {
        const newNode: TreeNode = {
          name: part,
          path: parts.slice(0, partIndex + 1).join('/'),
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
          isOpen: true, // Default open folders
          fileData: isFile ? file : undefined
        }
        currentLevel.push(newNode)
        if (!isFile) {
          currentLevel = newNode.children!
        }
      }
    })
  })
  
  // Sort: Folders first, then files
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name)
      return a.type === 'folder' ? -1 : 1
    })
    nodes.forEach(node => {
      if (node.children) sortNodes(node.children)
    })
  }
  
  sortNodes(root)
  return root
}

watchEffect(() => {
    tree.value = buildTree(effectiveFiles.value)
    // If files change (e.g. project loaded), reset/re-init active file
    if (effectiveFiles.value.length > 0 && activeFileIndex.value >= effectiveFiles.value.length) {
      initActiveFileIndex()
    }
  })
  
  const activeFile = computed(() => {
      if (effectiveFiles.value.length === 0) return { name: '', code: '', language: '' } as File
      return effectiveFiles.value[activeFileIndex.value] || effectiveFiles.value[0]
  })

const activeHighlights = computed(() => {
  if (!props.highlights || !activeFile.value) return new Set<number>()
  const rangeStr = props.highlights[activeFile.value.name]
  if (!rangeStr) return new Set<number>()

  const lines = new Set<number>()
  const ranges = rangeStr.split(',').map(s => s.trim())
  
  for (const range of ranges) {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number)
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) lines.add(i)
      }
    } else {
      const line = Number(range)
      if (!isNaN(line)) lines.add(line)
    }
  }
  return lines
})

const lineCount = computed(() => {
  if (!activeFile.value.code) return 0
  return activeFile.value.code.split('\n').length
})

const selectFile = (file: File) => {
  const index = effectiveFiles.value.findIndex(f => f.name === file.name)
  if (index !== -1) {
    activeFileIndex.value = index
    copied.value = false
  }
}

const toggleFolder = (node: TreeNode) => {
  node.isOpen = !node.isOpen
}

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(activeFile.value.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const downloadZip = async () => {
  try {
    const zip = new JSZip()
    effectiveFiles.value.forEach(file => {
      zip.file(file.name, file.code)
    })
    
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'example.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    downloaded.value = true
    setTimeout(() => {
      downloaded.value = false
    }, 2000)
  } catch (e) {
    console.error('Failed to download zip:', e)
  }
}

const shareLink = async () => {
  try {
    const url = new URL(window.location.href)
    // Add file path as hash param to be somewhat compatible with potential future routing
    // Using query param for simplicity in static site
    url.searchParams.set('file', activeFile.value.name)
    
    await navigator.clipboard.writeText(url.toString())
    shared.value = true
    setTimeout(() => {
      shared.value = false
    }, 2000)
  } catch (e) {
    console.error('Failed to share:', e)
  }
}

// Handle ESC to exit fullscreen
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    toggleFullscreen()
  }
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const containerStyle = computed(() => {
  if (isFullscreen.value) return {}
  
  const style: Record<string, string> = {}
  if (props.aspectRatio) {
    style.aspectRatio = props.aspectRatio
    style.height = 'auto' // Allow aspect-ratio to determine height
  } else {
    style.height = props.height
  }
  
  // When height is auto, we need to ensure the container allows expansion
  if (style.height === 'auto') {
    style.minHeight = '200px' // Reasonable minimum
  }
  
  return style
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  
  // Check URL params for file selection
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const fileName = params.get('file')
    
    // First try to set default to xmake.lua
    initActiveFileIndex()

    if (fileName) {
      const index = effectiveFiles.value.findIndex(f => f.name === fileName)
      if (index !== -1) {
        activeFileIndex.value = index
        // Scroll to the component if a specific file was requested via URL
        setTimeout(() => {
          containerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 300)
      }
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  if (isFullscreen.value) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="file-explorer-container" :class="{ fullscreen: isFullscreen }" ref="containerRef" :style="containerStyle">
    <div v-if="title" class="file-explorer-title-bar">
      {{ title }}
    </div>
    <div class="file-explorer-main-area">
      <div class="file-explorer-sidebar" v-if="isSidebarOpen">
        <div class="explorer-header">{{ rootPath || 'EXPLORER' }}</div>
        <div class="explorer-tree">
          <template v-for="node in tree" :key="node.path">
              <div class="tree-node-wrapper">
                  <FileTreeNode 
                      :node="node" 
                      :active-file="activeFile" 
                      @select-file="selectFile" 
                      @toggle-folder="toggleFolder" 
                  />
              </div>
          </template>
        </div>
      </div>
      <div class="file-explorer-content">
        <div class="editor-tabs">
          <button class="action-button sidebar-toggle" @click="toggleSidebar" :title="isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
          </button>
          <div class="editor-tab active">
              <span class="file-icon-sm">{{ activeFile.name.endsWith('.cpp') ? 'C++' : (activeFile.name.endsWith('.lua') ? 'Lua' : 'File') }}</span>
              {{ activeFile.name.split('/').pop() }}
          </div>
          <div class="spacer"></div>
          
          <button class="action-button" :class="{ active: downloaded }" @click="downloadZip" :title="downloaded ? 'Downloaded' : 'Download Zip'">
              <svg v-if="!downloaded" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              <svg v-else class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </button>

          <button class="action-button" :class="{ active: shared }" @click="shareLink" :title="shared ? 'Link Copied' : 'Share Link'">
              <svg v-if="!shared" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
              <svg v-else class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </button>
          
          <button v-if="showFullscreen" class="action-button" @click="toggleFullscreen" :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'">
              <svg v-if="!isFullscreen" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
          </button>

          <button class="action-button" :class="{ active: copied }" @click="copyCode" :title="copied ? 'Copied' : 'Copy Code'">
              <svg v-if="!copied" class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
              <svg v-else class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </button>
        </div>
        <div class="code-viewport">
          <div class="code-layout">
            <div v-if="showLineNumbers" class="line-numbers">
              <span v-for="n in lineCount" :key="n" class="line-number">{{ n }}</span>
            </div>
            <div class="code-wrapper">
              <div class="highlight-layer" aria-hidden="true">
                <div 
                  v-for="n in lineCount" 
                  :key="n" 
                  class="highlight-line"
                  :class="{ 'highlighted': activeHighlights.has(n) }"
                ></div>
              </div>
              <!-- Use shiki highlighted code -->
              <div v-if="activeFile.highlightedCode" class="vp-doc-code" v-html="activeFile.highlightedCode"></div>
              <pre v-else><code>{{ activeFile.code }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-explorer-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  overflow: hidden;
  font-size: 13px;
  margin: 16px 0;
  transition: all 0.3s ease;
}

.file-explorer-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  border-radius: 0;
  border: none;
  margin: 0;
}

.file-explorer-title-bar {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
}

.file-explorer-main-area {
  display: flex;
  flex: 1;
  min-height: 0;
}

.file-explorer-sidebar {
  width: 240px;
  border-right: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  display: flex;
  flex-direction: column;
}

.explorer-header {
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.explorer-tree {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 10px;
}

.file-explorer-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background-color: var(--vp-code-block-bg);
  /* Ensure content can determine height when container is auto */
  min-height: 0; 
}

.editor-tabs {
  display: flex;
  background-color: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
  height: 36px;
  overflow-x: auto;
}

.editor-tab {
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-right: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 13px;
  min-width: 120px;
}

.editor-tab.active {
  background-color: var(--vp-code-block-bg);
  color: var(--vp-c-text-1);
  border-top: 2px solid var(--vp-c-brand);
}

.spacer {
  flex: 1;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
  background-color: transparent;
  border: none;
  border-left: 1px solid var(--vp-c-divider);
}

.action-button:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-mute);
}

.action-button.active {
  color: var(--vp-c-green-1);
}

.sidebar-toggle {
  border-left: none;
  border-right: 1px solid var(--vp-c-divider);
}

.file-icon-sm {
  font-size: 10px;
  opacity: 0.7;
}

.code-viewport {
  flex: 1;
  overflow: auto;
  padding: 0;
}

.code-layout {
  display: flex;
  min-height: 100%;
}

.line-numbers {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 0 20px 10px;
  background-color: var(--vp-code-block-bg);
  user-select: none;
  text-align: right;
  min-width: 40px;
}

.line-number {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.5;
  color: var(--vp-c-text-3);
  padding-right: 10px;
}

.code-wrapper {
  flex-grow: 1;
  overflow-x: auto;
  display: grid;
}

.highlight-layer {
  grid-area: 1 / 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  pointer-events: none;
  z-index: 0;
  font-size: 14px;
  line-height: 1.5;
}

.highlight-line {
  width: 100%;
  height: 1.5em;
}

.highlight-line.highlighted {
  background-color: var(--vp-code-line-highlight-color, rgba(142, 150, 170, 0.14));
  border-left: 2px solid var(--vp-c-brand);
}

.vp-doc-code,
.code-wrapper > pre {
  grid-area: 1 / 1;
  position: relative;
  z-index: 1;
}

/* Shiki Styles Override */
.vp-doc-code :deep(pre.shiki) {
  margin: 0 !important;
  padding: 20px !important;
  background-color: transparent !important;
  border-radius: 0 !important;
  overflow: visible !important;
  width: fit-content;
  min-width: 100%;
  height: 100%;
}

.vp-doc-code :deep(code) {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .file-explorer-main-area {
    flex-direction: column;
  }
  
  .file-explorer-sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }
  
  .file-explorer-content {
    height: 100%;
  }
}
</style>
