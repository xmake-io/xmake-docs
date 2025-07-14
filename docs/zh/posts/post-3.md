---
title: Xmake 入门指南
date: 2024-01-05
author: waruqi
tags: [教程, 入门]
---

# Xmake 入门指南

Xmake 是一个现代化的构建系统，让 C/C++ 开发变得更加简单和高效。在本指南中，我们将介绍 Xmake 的基本设置和使用方法。

## 安装

安装 Xmake 非常简单。您可以使用以下方法之一：

### 使用 curl (Linux/macOS)
```bash
curl -fsSL https://xmake.io/install.sh | bash
```

### 使用 PowerShell (Windows)
```powershell
Invoke-Expression (Invoke-Webrequest 'https://xmake.io/install.ps1' -UseBasicParsing).Content
```

## 创建您的第一个项目

让我们创建一个简单的 C++ 项目：

```bash
xmake create -l c++ hello
cd hello
xmake
```

这将创建一个基本的 C++ 项目，具有以下结构：
- src/main.cpp
- xmake.lua

## 基本配置

xmake.lua 文件包含您的项目配置：

```lua
add_rules("mode.debug", "mode.release")

target("hello")
    set_kind("binary")
    add_files("src/*.cpp")
```

## 构建和运行

```bash
xmake build
xmake run
```

就是这样！您已经成功创建并构建了您的第一个 Xmake 项目。