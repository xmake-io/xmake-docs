<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

const { lang, page } = useData()
const question = ref('')
const isSubmitting = ref(false)

// 检测中文页面：通过 lang 值或路径判断
const isZh = computed(() => {
  const langValue = lang.value
  const path = page.value?.relativePath || page.value?.filePath || ''
  const route = page.value?.route || ''
  
  // 检查 lang 值（可能是 'zh-Hans', 'zh-CN', 'zh' 等）
  if (langValue && (langValue.includes('zh') || langValue.includes('ZH'))) {
    return true
  }
  
  // 检查路径是否包含 /zh/
  if (path.includes('/zh/') || route.includes('/zh/')) {
    return true
  }
  
  return false
})

const texts = computed(() => {
  if (isZh.value) {
    return {
      title: '快速提问',
      description: '输入您的问题，复制提示词后可在任何 AI 助手（如 ChatGPT、Claude、Cursor、GitHub Copilot 等）中使用',
      placeholder: '例如：如何配置一个使用 C++20 模块的目标？',
      button: '复制提示词',
      submitting: '复制中...',
      hint: '提示：按',
      hintKey: 'Ctrl/Cmd + Enter',
      hintSuffix: '快速复制',
      alertEmpty: '请输入您的问题',
      copySuccess: '提示词已复制到剪贴板！您可以在任何 AI 助手中粘贴使用。',
      copyFailed: '复制失败，请手动复制',
      promptTemplate: `请参考 https://xmake.io/llms-full.txt 了解 xmake 的完整 API 和功能。

我的问题：
`
    }
  } else {
    return {
      title: 'Quick Question',
      description: 'Enter your question, copy the prompt and use it in any AI assistant (such as ChatGPT, Claude, Cursor, GitHub Copilot, etc.)',
      placeholder: 'For example: How do I configure a target that uses C++20 modules?',
      button: 'Copy Prompt',
      submitting: 'Copying...',
      hint: 'Tip: Press',
      hintKey: 'Ctrl/Cmd + Enter',
      hintSuffix: 'to copy quickly',
      alertEmpty: 'Please enter your question',
      copySuccess: 'Prompt copied to clipboard! You can paste it in any AI assistant.',
      copyFailed: 'Copy failed, please copy manually',
      promptTemplate: `Please refer to https://xmake.io/llms-full.txt to understand xmake's complete API and features.

My question:
`
    }
  }
})

function copyPrompt() {
  if (!question.value.trim()) {
    alert(texts.value.alertEmpty)
    return
  }

  isSubmitting.value = true

  const fullPrompt = texts.value.promptTemplate + question.value.trim()
  
  navigator.clipboard.writeText(fullPrompt).then(() => {
    alert(texts.value.copySuccess)
    isSubmitting.value = false
  }).catch(() => {
    alert(texts.value.copyFailed)
    isSubmitting.value = false
  })
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    copyPrompt()
  }
}
</script>

<template>
  <div class="ai-assistant">
    <div class="ai-assistant-header">
      <h3>{{ texts.title }}</h3>
      <p>{{ texts.description }}</p>
    </div>
    <div class="ai-assistant-form">
      <textarea
        v-model="question"
        class="ai-assistant-input"
        :placeholder="texts.placeholder"
        rows="4"
        @keydown="handleKeyPress"
      ></textarea>
      <button
        class="ai-assistant-button"
        :disabled="isSubmitting || !question.trim()"
        @click="copyPrompt"
      >
        {{ isSubmitting ? texts.submitting : texts.button }}
      </button>
      <p class="ai-assistant-hint">
        {{ texts.hint }} <kbd>{{ texts.hintKey }}</kbd> {{ texts.hintSuffix }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.ai-assistant {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.ai-assistant-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.ai-assistant-header p {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.ai-assistant-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ai-assistant-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.95rem;
  font-family: inherit;
  line-height: 1.5;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  resize: vertical;
  transition: border-color 0.2s;
}

.ai-assistant-input:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.ai-assistant-button {
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--vp-c-bg);
  background: var(--vp-c-brand);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  align-self: flex-start;
}

.ai-assistant-button:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
  transform: translateY(-1px);
}

.ai-assistant-button:active:not(:disabled) {
  transform: translateY(0);
}

.ai-assistant-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-assistant-hint {
  margin: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.ai-assistant-hint kbd {
  padding: 0.2rem 0.4rem;
  font-size: 0.8rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 3px;
  box-shadow: 0 1px 0 var(--vp-c-divider);
}
</style>

