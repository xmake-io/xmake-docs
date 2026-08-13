<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

const { lang, page } = useData()
const question = ref('')
const isSubmitting = ref(false)
const copiedSkills = ref(false)

const skillsCommand = 'claude plugins install xmake-io/xmake-skills'

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
      skillsTitle: '推荐：使用 Agent Skills',
      skillsDesc: '如果你使用 Claude Code 等支持 Agent Skills 的 AI 编程助手，安装 xmake-skills 后无需再手动粘贴提示词，助手会按任务自动加载对应的 xmake 文档。',
      skillsCopy: '复制',
      skillsCopied: '已复制',
      skillsLink: '了解 xmake-skills',
      promptTemplate: `你是 xmake 构建系统的专家助手。请基于官方文档回答，不要凭记忆猜测 API。

请按需检索文档（不要一次性抓取全部文档）：
1. 先获取文档索引：https://xmake.io/llms.txt（包含所有文档页面的标题和链接）
2. 从索引中挑选 1~3 个最相关的页面，抓取其 Markdown 原文，例如 https://xmake.io/zh/guide/basic-commands/build-targets.md
3. 只依据文档内容作答，如果文档中没有说明，请直接说明，不要编造 API 或参数

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
      skillsTitle: 'Recommended: use Agent Skills',
      skillsDesc: 'If you use an AI coding assistant with Agent Skills support (such as Claude Code), install xmake-skills once and you no longer need to paste prompts — the assistant loads the matching xmake docs on demand.',
      skillsCopy: 'Copy',
      skillsCopied: 'Copied',
      skillsLink: 'About xmake-skills',
      promptTemplate: `You are an expert assistant for the xmake build system. Answer based on the official documentation, do not guess APIs from memory.

Look up the docs on demand (do not fetch the whole documentation at once):
1. First fetch the documentation index: https://xmake.io/llms.txt (titles and links of all documentation pages)
2. Pick the 1-3 most relevant pages from the index and fetch their Markdown source, e.g. https://xmake.io/guide/basic-commands/build-targets.md
3. Answer only from the documentation content. If the docs do not cover it, say so instead of inventing APIs or flags

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

function copySkillsCommand() {
  navigator.clipboard.writeText(skillsCommand).then(() => {
    copiedSkills.value = true
    setTimeout(() => {
      copiedSkills.value = false
    }, 2000)
  }).catch(() => {
    alert(texts.value.copyFailed)
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
    <div class="ai-assistant-skills">
      <div class="ai-assistant-skills-text">
        <strong>{{ texts.skillsTitle }}</strong>
        <p>{{ texts.skillsDesc }}</p>
      </div>
      <div class="ai-assistant-skills-cmd">
        <code>{{ skillsCommand }}</code>
        <button class="ai-assistant-copy" @click="copySkillsCommand">
          {{ copiedSkills ? texts.skillsCopied : texts.skillsCopy }}
        </button>
      </div>
      <a
        class="ai-assistant-skills-link"
        href="https://github.com/xmake-io/xmake-skills"
        target="_blank"
        rel="noreferrer"
      >{{ texts.skillsLink }} →</a>
    </div>
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
      <div class="ai-assistant-actions">
        <button
          class="ai-assistant-button"
          :disabled="isSubmitting || !question.trim()"
          @click="copyPrompt"
        >
          {{ isSubmitting ? texts.submitting : texts.button }}
        </button>
      </div>
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

.ai-assistant-skills {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-left: 3px solid var(--vp-c-brand);
  border-radius: 6px;
  background: var(--vp-c-bg);
}

.ai-assistant-skills-text strong {
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.ai-assistant-skills-text p {
  margin: 0.4rem 0 0.75rem 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.ai-assistant-skills-cmd {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.ai-assistant-skills-cmd code {
  flex: 1;
  min-width: 0;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow-x: auto;
  white-space: nowrap;
}

.ai-assistant-copy {
  padding: 0.5rem 0.9rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.ai-assistant-copy:hover {
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.ai-assistant-skills-link {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--vp-c-brand);
  text-decoration: none;
}

.ai-assistant-skills-link:hover {
  text-decoration: underline;
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

.ai-assistant-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
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

