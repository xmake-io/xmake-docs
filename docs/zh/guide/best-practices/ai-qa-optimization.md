# AI 问答优化 {#ai-qa-optimization}

<ClientOnly>
  <AIAssistant />
</ClientOnly>

在使用 AI 助手（如 Claude Code、ChatGPT、Cursor 等）提问关于 xmake 的问题时，通过一些技巧可以帮助 AI 更好地理解上下文，提供更准确、更高质量的回答。

## 使用 Xmake Agent Skills（推荐） {#agent-skills}

对于支持 [Agent Skills](https://www.anthropic.com/news/agent-skills) 的 AI 编程助手（例如 Claude Code），最省心的方式是直接安装 [**xmake-skills**](https://github.com/xmake-io/xmake-skills)。

它提供了一套按任务组织的 skill 集合，覆盖工程配置、工具链、交叉编译、包管理、测试、打包、脚本扩展、性能优化、故障排查，以及各语言（Rust、Go、Swift、CUDA、Objective-C、D、Fortran 等）的支持。

### 安装 {#install-skills}

Claude Code 中直接从 GitHub 安装：

```bash
claude plugins install xmake-io/xmake-skills
```

或者先添加为插件市场，再安装：

```bash
# 在 Claude Code 交互会话中执行
/plugin marketplace add xmake-io/xmake-skills
/plugin install xmake-skills
```

其他 Agent 平台可以手动克隆仓库，然后参考对应平台的文档，将 `skills/` 目录中的 skill 安装启用：

```bash
git clone https://github.com/xmake-io/xmake-skills.git
```

### 为什么推荐这种方式 {#why-skills}

- **按需加载，节省 token**：所有 skill 的触发描述加起来只有约 4k tokens，始终常驻上下文，而 skill 的完整内容只有在任务匹配时才会被加载。相比之下，`llms-full.txt` 整个文档接近 150 万 token，塞进对话不仅装不下，还会挤掉真正重要的上下文。
- **基于 xmake 的真实行为编写**：每个 skill 都描述了 *何时* 应被加载，这样 AI 助手能自动拉取与当前任务相关的文档，避免编造 API 或使用过时的参数。
- **无需每次粘贴提示词**：安装一次之后，正常提问即可，助手会自己决定加载哪些文档。

## 在终端里使用 `xmake ai` {#xmake-harness}

[**xmake-harness**](https://github.com/xmake-addons/xmake-harness) 是一个完全用 xmake lua 编写的 Agent 框架。
以 addon 的方式安装后，它提供 `xmake ai` —— 一个就在你工程里、并且会构建这个工程的终端编码助手。

```bash
xmake addon --install xmake-harness
xmake ai --setup                     # 选服务商、填 api key、选模型
xmake ai                             # 交互式界面
xmake ai --print "这个工程构建出什么？"  # 非交互模式，适合脚本和 CI
```

因为它本身就是 xmake addon，所以可以直接执行构建、读取工程配置，也能加载和 Claude Code 相同的
[xmake-skills](https://github.com/xmake-io/xmake-skills)：

```
/skills install xmake
```

::: tip 提示
配置分层、支持的服务商、权限模式、斜杠命令（`/xmake`、`/skills`、`/context` 等）以及 skill 管理，
详见 [xmake-harness](/zh/guide/extensions/addons/official/xmake-harness)。
:::

## 让 AI 按需查阅文档 {#reference-docs}

如果你使用的是普通对话式 AI 助手（不支持 Agent Skills），但它具备联网抓取能力，推荐让它**按需检索**文档，而不是一次性读取完整文档：

1. 文档索引：[https://xmake.io/llms.txt](https://xmake.io/llms.txt) —— 包含所有文档页面的标题和链接
2. 每个文档页面都有对应的 Markdown 原文，只需在页面路径后加上 `.md`，例如 [https://xmake.io/zh/guide/basic-commands/build-targets.md](https://xmake.io/zh/guide/basic-commands/build-targets.md)

对应的提示词：

```
请基于 xmake 官方文档回答，不要凭记忆猜测 API：
1. 先获取文档索引 https://xmake.io/llms.txt
2. 从中挑选 1~3 个最相关的页面，抓取其 Markdown 原文
3. 只依据文档内容作答，文档中没有说明的地方请直接指出

我的问题：如何配置一个使用 C++20 模块的目标？
```

::: tip 关于 llms-full.txt
[https://xmake.io/llms-full.txt](https://xmake.io/llms-full.txt) 包含了全部文档的完整内容，接近 5 MB、约 150 万 token。它更适合用于离线索引、RAG 构建等场景，不建议直接在对话中让 AI 读取，否则会大量消耗 token，也容易导致 AI 抓不住重点。
:::

## 提供完整的上下文信息 {#provide-context}

在提问时，尽量提供完整的上下文信息，包括：

- **项目类型**：是 C/C++ 项目、Swift 项目还是其他语言
- **目标平台**：Windows、Linux、macOS、Android、iOS 等
- **编译器**：使用的工具链（gcc、clang、msvc 等）
- **具体需求**：想要实现什么功能或解决什么问题
- **错误信息**：如果遇到问题，提供完整的错误信息

示例：

```
项目类型：C++ 项目
平台：Linux
编译器：gcc-12
问题：我想在 xmake.lua 中配置一个使用 C++20 模块的目标，但不知道如何设置。
当前的 xmake.lua 内容：
[粘贴你的 xmake.lua 内容]
```

## 引用具体的 API 文档 {#reference-api}

如果问题涉及特定的 API，可以直接给出对应文档页面的链接，这比让 AI 自己去翻找更精准：

```
请参考 https://xmake.io/zh/api/description/project-target.md，帮我配置：
1. 如何设置目标的编译模式（debug/release）
2. 如何添加预编译头文件支持
```

## 提供代码示例 {#provide-code}

在提问时，如果可能，提供你当前的代码或配置：

```
帮我优化以下 xmake.lua 配置：

target("mytarget")
    set_kind("binary")
    add_files("src/*.cpp")

我想添加以下功能：
- 启用 C++20 标准
- 添加预编译头文件
- 配置 debug 和 release 模式的不同优化选项
```

## 明确问题类型 {#clarify-question}

在提问时，明确说明问题的类型：

- **配置问题**：如何配置某个功能
- **编译问题**：编译时遇到的错误
- **性能问题**：构建速度优化
- **最佳实践**：如何更好地使用某个特性

示例：

```
这是一个配置问题：

我想在 xmake 中配置 CUDA 项目的编译，需要：
1. 指定 CUDA SDK 版本
2. 设置 GPU 架构
3. 配置编译选项
```

## 分步骤提问 {#step-by-step}

对于复杂的问题，可以分步骤提问：

```
请分步骤帮我配置：

第一步：如何创建一个基本的 C++ 目标
第二步：如何添加依赖包
第三步：如何配置交叉编译
```

## 验证回答的准确性 {#verify}

AI 的回答可能不完全准确，建议：

1. **查阅官方文档**：验证 AI 提供的 API 和用法是否正确，可参考 [API 手册](/zh/api/description/specification) 和 [使用指南](/zh/guide/introduction)
2. **实际测试**：在项目中实际测试 AI 提供的配置
3. **交叉验证**：如果可能，用不同的方式提问验证答案的一致性

## 示例：完整的提问模板 {#template}

```
请基于 xmake 官方文档回答，不要凭记忆猜测 API：
先获取文档索引 https://xmake.io/llms.txt，从中挑选最相关的页面抓取其 Markdown 原文后再作答。

项目信息：
- 类型：C++ 项目
- 平台：Linux
- 编译器：clang-15
- 标准：C++20

当前问题：
我想配置一个使用 C++20 模块的目标，但遇到了编译错误。

当前配置：
target("mymodule")
    set_kind("binary")
    set_languages("c++20")
    add_files("src/*.cpp")

错误信息：
[粘贴错误信息]

请帮我：
1. 分析问题原因
2. 提供正确的配置方法
3. 给出完整的示例代码
```

通过以上方式，可以帮助 AI 更好地理解你的需求，提供更准确、更有用的回答。
