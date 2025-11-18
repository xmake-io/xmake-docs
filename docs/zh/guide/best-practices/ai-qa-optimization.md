# AI 问答优化 {#ai-qa-optimization}

在使用 AI 助手（如 ChatGPT、Claude、Cursor 等）提问关于 xmake 的问题时，通过一些技巧可以帮助 AI 更好地理解上下文，提供更准确、更高质量的回答。

## 提供参考文档链接

在提问时，显式提供 xmake 的 LLMs 参考文档链接，可以帮助 AI 快速了解 xmake 的完整 API 和功能。

参考文档链接：[https://xmake.io/llms-full.txt](https://xmake.io/llms-full.txt)

```
请参考 https://xmake.io/llms-full.txt 后，回答我的问题：...
```

或者更具体地：

```
请先阅读 https://xmake.io/llms-full.txt 了解 xmake 的 API 和功能，然后回答：
如何配置一个使用 C++20 模块的目标？
```

## 提供完整的上下文信息

在提问时，尽量提供完整的上下文信息，包括：

- **项目类型**：是 C/C++ 项目、Swift 项目还是其他语言
- **目标平台**：Windows、Linux、macOS、Android、iOS 等
- **编译器**：使用的工具链（gcc、clang、msvc 等）
- **具体需求**：想要实现什么功能或解决什么问题
- **错误信息**：如果遇到问题，提供完整的错误信息

示例：

```
请参考 https://xmake.io/llms-full.txt，帮我解决以下问题：

项目类型：C++ 项目
平台：Linux
编译器：gcc-12
问题：我想在 xmake.lua 中配置一个使用 C++20 模块的目标，但不知道如何设置。
当前的 xmake.lua 内容：
[粘贴你的 xmake.lua 内容]
```

## 引用具体的 API 文档

如果问题涉及特定的 API，可以在提问时引用相关的文档链接：

```
请参考 https://xmake.io/llms-full.txt 中的 target 相关 API，帮我配置：
1. 如何设置目标的编译模式（debug/release）
2. 如何添加预编译头文件支持
```

## 提供代码示例

在提问时，如果可能，提供你当前的代码或配置：

```
请参考 https://xmake.io/llms-full.txt，帮我优化以下 xmake.lua 配置：

target("mytarget")
    set_kind("binary")
    add_files("src/*.cpp")

我想添加以下功能：
- 启用 C++20 标准
- 添加预编译头文件
- 配置 debug 和 release 模式的不同优化选项
```

## 明确问题类型

在提问时，明确说明问题的类型：

- **配置问题**：如何配置某个功能
- **编译问题**：编译时遇到的错误
- **性能问题**：构建速度优化
- **最佳实践**：如何更好地使用某个特性

示例：

```
请参考 https://xmake.io/llms-full.txt，这是一个配置问题：

我想在 xmake 中配置 CUDA 项目的编译，需要：
1. 指定 CUDA SDK 版本
2. 设置 GPU 架构
3. 配置编译选项
```

## 分步骤提问

对于复杂的问题，可以分步骤提问：

```
请参考 https://xmake.io/llms-full.txt，分步骤帮我配置：

第一步：如何创建一个基本的 C++ 目标
第二步：如何添加依赖包
第三步：如何配置交叉编译
```

## 验证回答的准确性

AI 的回答可能不完全准确，建议：

1. **查阅官方文档**：验证 AI 提供的 API 和用法是否正确，可参考 [API 手册](/zh/api/description/specification) 和 [使用指南](/zh/guide/introduction)
2. **实际测试**：在项目中实际测试 AI 提供的配置
3. **交叉验证**：如果可能，用不同的方式提问验证答案的一致性

## 示例：完整的提问模板

```
请参考 https://xmake.io/llms-full.txt 了解 xmake 的完整 API 和功能。

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

