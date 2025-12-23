export interface File {
  name: string
  code: string
  language: string
  highlightedCode?: string
}

export interface TreeNode {
  name: string
  path: string
  type: 'file' | 'folder'
  children?: TreeNode[]
  isOpen?: boolean
  fileData?: File
}
