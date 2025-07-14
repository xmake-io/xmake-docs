const fs = require('fs');
const path = require('path');

// English blog post templates
const enTemplates = [
  {
    title: "Getting Started with Xmake",
    date: "2024-01-05",
    author: "waruqi",
    tags: ["tutorial", "getting-started"],
    content: `# Getting Started with Xmake

Xmake is a modern build system that makes C/C++ development easier and more efficient. In this guide, we'll walk through the basics of setting up and using Xmake.

## Installation

Installing Xmake is straightforward. You can use one of the following methods:

### Using curl (Linux/macOS)
\`\`\`bash
curl -fsSL https://xmake.io/install.sh | bash
\`\`\`

### Using PowerShell (Windows)
\`\`\`powershell
Invoke-Expression (Invoke-Webrequest 'https://xmake.io/install.ps1' -UseBasicParsing).Content
\`\`\`

## Creating Your First Project

Let's create a simple C++ project:

\`\`\`bash
xmake create -l c++ hello
cd hello
xmake
\`\`\`

This creates a basic C++ project with the following structure:
- src/main.cpp
- xmake.lua

## Basic Configuration

The xmake.lua file contains your project configuration:

\`\`\`lua
add_rules("mode.debug", "mode.release")

target("hello")
    set_kind("binary")
    add_files("src/*.cpp")
\`\`\`

## Building and Running

\`\`\`bash
xmake build
xmake run
\`\`\`

That's it! You've successfully created and built your first Xmake project.`
  },
  {
    title: "Advanced Package Management",
    date: "2024-01-03",
    author: "waruqi",
    tags: ["package-management", "advanced"],
    content: `# Advanced Package Management with Xmake

Xmake provides a powerful package management system that simplifies dependency handling in C/C++ projects.

## Adding Packages

Adding packages to your project is simple:

\`\`\`lua
target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("fmt", "spdlog", "nlohmann_json")
\`\`\`

## Package Sources

Xmake supports multiple package sources:

- Official packages (xmake-repo)
- Third-party packages
- Local packages
- System packages

## Version Management

You can specify package versions:

\`\`\`lua
add_packages("fmt@8.1.1", "spdlog@1.11.0")
\`\`\`

## Custom Package Repositories

Add your own package repositories:

\`\`\`lua
add_repositories("myrepo https://github.com/myorg/xmake-repo")
\`\`\`

This advanced package management system makes dependency handling much easier than traditional approaches.`
  },
  {
    title: "IDE Integration Guide",
    date: "2024-01-01",
    author: "waruqi",
    tags: ["ide", "integration"],
    content: `# IDE Integration Guide

Xmake provides excellent integration with popular IDEs and editors, making development more efficient.

## VS Code Integration

Install the Xmake extension for VS Code:

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Xmake"
4. Install the extension

## CLion Integration

CLion supports Xmake projects natively:

1. Open CLion
2. Open your project directory
3. CLion will automatically detect the xmake.lua file
4. Configure your run configurations

## Vim/Neovim Integration

For Vim/Neovim users, there are several plugins available:

- xmake.nvim
- vim-xmake

## Benefits of IDE Integration

- IntelliSense support
- Debugging integration
- Build task integration
- Error highlighting

Proper IDE integration significantly improves the development experience.`
  }
];

// Chinese blog post templates
const zhTemplates = [
  {
    title: "Xmake 入门指南",
    date: "2024-01-05",
    author: "waruqi",
    tags: ["教程", "入门"],
    content: `# Xmake 入门指南

Xmake 是一个现代化的构建系统，让 C/C++ 开发变得更加简单和高效。在本指南中，我们将介绍 Xmake 的基本设置和使用方法。

## 安装

安装 Xmake 非常简单。您可以使用以下方法之一：

### 使用 curl (Linux/macOS)
\`\`\`bash
curl -fsSL https://xmake.io/install.sh | bash
\`\`\`

### 使用 PowerShell (Windows)
\`\`\`powershell
Invoke-Expression (Invoke-Webrequest 'https://xmake.io/install.ps1' -UseBasicParsing).Content
\`\`\`

## 创建您的第一个项目

让我们创建一个简单的 C++ 项目：

\`\`\`bash
xmake create -l c++ hello
cd hello
xmake
\`\`\`

这将创建一个基本的 C++ 项目，具有以下结构：
- src/main.cpp
- xmake.lua

## 基本配置

xmake.lua 文件包含您的项目配置：

\`\`\`lua
add_rules("mode.debug", "mode.release")

target("hello")
    set_kind("binary")
    add_files("src/*.cpp")
\`\`\`

## 构建和运行

\`\`\`bash
xmake build
xmake run
\`\`\`

就是这样！您已经成功创建并构建了您的第一个 Xmake 项目。`
  },
  {
    title: "高级包管理",
    date: "2024-01-03",
    author: "waruqi",
    tags: ["包管理", "高级"],
    content: `# Xmake 高级包管理

Xmake 提供了一个强大的包管理系统，简化了 C/C++ 项目中的依赖处理。

## 添加包

向您的项目添加包很简单：

\`\`\`lua
target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("fmt", "spdlog", "nlohmann_json")
\`\`\`

## 包源

Xmake 支持多个包源：

- 官方包 (xmake-repo)
- 第三方包
- 本地包
- 系统包

## 版本管理

您可以指定包版本：

\`\`\`lua
add_packages("fmt@8.1.1", "spdlog@1.11.0")
\`\`\`

## 自定义包仓库

添加您自己的包仓库：

\`\`\`lua
add_repositories("myrepo https://github.com/myorg/xmake-repo")
\`\`\`

这个高级包管理系统使依赖处理比传统方法更加容易。`
  },
  {
    title: "IDE 集成指南",
    date: "2024-01-01",
    author: "waruqi",
    tags: ["ide", "集成"],
    content: `# IDE 集成指南

Xmake 为流行的 IDE 和编辑器提供了出色的集成，使开发更加高效。

## VS Code 集成

为 VS Code 安装 Xmake 扩展：

1. 打开 VS Code
2. 转到扩展 (Ctrl+Shift+X)
3. 搜索 "Xmake"
4. 安装扩展

## CLion 集成

CLion 原生支持 Xmake 项目：

1. 打开 CLion
2. 打开您的项目目录
3. CLion 将自动检测 xmake.lua 文件
4. 配置您的运行配置

## Vim/Neovim 集成

对于 Vim/Neovim 用户，有几个可用的插件：

- xmake.nvim
- vim-xmake

## IDE 集成的好处

- IntelliSense 支持
- 调试集成
- 构建任务集成
- 错误高亮

适当的 IDE 集成显著改善了开发体验。`
  }
];

// Generate English blog posts
enTemplates.forEach((template, index) => {
  const filename = `docs/posts/post-${index + 3}.md`;
  const content = `---
title: ${template.title}
date: ${template.date}
author: ${template.author}
tags: [${template.tags.join(', ')}]
---

${template.content}`;
  
  fs.writeFileSync(filename, content);
  console.log(`Generated: ${filename}`);
});

// Generate Chinese blog posts
zhTemplates.forEach((template, index) => {
  const filename = `docs/zh/posts/post-${index + 3}.md`;
  const content = `---
title: ${template.title}
date: ${template.date}
author: ${template.author}
tags: [${template.tags.join(', ')}]
---

${template.content}`;
  
  fs.writeFileSync(filename, content);
  console.log(`Generated: ${filename}`);
});

console.log('Blog posts generation completed!'); 