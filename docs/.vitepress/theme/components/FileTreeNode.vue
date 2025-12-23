<script setup lang="ts">
import { computed } from 'vue'
import type { TreeNode, File } from './types'

const props = defineProps<{
  node: TreeNode
  activeFile: File
  level?: number
}>()

const emit = defineEmits<{
  (e: 'select-file', file: File): void
  (e: 'toggle-folder', node: TreeNode): void
}>()

const isSelected = computed(() => {
  return props.node.type === 'file' && props.node.fileData?.name === props.activeFile.name
})

const currentLevel = computed(() => props.level || 0)

const handleClick = () => {
  if (props.node.type === 'folder') {
    emit('toggle-folder', props.node)
  } else {
    if (props.node.fileData) {
      emit('select-file', props.node.fileData)
    }
  }
}
</script>

<template>
  <div class="tree-node">
    <div 
      class="node-label" 
      :class="{ 'is-selected': isSelected, 'is-folder': node.type === 'folder' }"
      @click="handleClick"
      :style="{ paddingLeft: (currentLevel * 12 + 10) + 'px' }"
    >
      <span v-if="node.type === 'folder'" class="folder-arrow" :class="{ open: node.isOpen }">
         <svg width="10" height="10" viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
      </span>
      <span class="node-icon">
          <template v-if="node.type === 'folder'">
              <svg v-if="node.isOpen" width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
          </template>
          <template v-else>
              <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          </template>
      </span>
      <span class="node-name">{{ node.name }}</span>
    </div>
    <div v-if="node.type === 'folder' && node.isOpen" class="node-children">
      <FileTreeNode 
        v-for="child in node.children" 
        :key="child.path" 
        :node="child" 
        :active-file="activeFile" 
        :level="currentLevel + 1"
        @select-file="$emit('select-file', $event)" 
        @toggle-folder="$emit('toggle-folder', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.node-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 0;
  color: var(--vp-c-text-2);
  user-select: none;
  transition: color 0.1s;
}

.node-label:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-mute);
}

.node-label.is-selected {
  background-color: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand);
}

.folder-arrow {
  display: flex;
  align-items: center;
  margin-right: 4px;
  transform: rotate(0deg);
  transition: transform 0.2s;
  opacity: 0.7;
}

.folder-arrow.open {
  transform: rotate(90deg);
}

.node-icon {
  margin-right: 6px;
  display: flex;
  align-items: center;
  opacity: 0.8;
}

.node-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
