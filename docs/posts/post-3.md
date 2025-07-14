---
title: Getting Started with Xmake
date: 2024-01-05
author: waruqi
tags: [tutorial, getting-started]
---

# Getting Started with Xmake

Xmake is a modern build system that makes C/C++ development easier and more efficient. In this guide, we'll walk through the basics of setting up and using Xmake.

## Installation

Installing Xmake is straightforward. You can use one of the following methods:

### Using curl (Linux/macOS)
```bash
curl -fsSL https://xmake.io/install.sh | bash
```

### Using PowerShell (Windows)
```powershell
Invoke-Expression (Invoke-Webrequest 'https://xmake.io/install.ps1' -UseBasicParsing).Content
```

## Creating Your First Project

Let's create a simple C++ project:

```bash
xmake create -l c++ hello
cd hello
xmake
```

This creates a basic C++ project with the following structure:
- src/main.cpp
- xmake.lua

## Basic Configuration

The xmake.lua file contains your project configuration:

```lua
add_rules("mode.debug", "mode.release")

target("hello")
    set_kind("binary")
    add_files("src/*.cpp")
```

## Building and Running

```bash
xmake build
xmake run
```

That's it! You've successfully created and built your first Xmake project.