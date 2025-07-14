---
title: 高级包管理
date: 2024-01-03
author: waruqi
tags: [包管理, 高级]
---

# Xmake 高级包管理

Xmake 提供了一个强大的包管理系统，简化了 C/C++ 项目中的依赖处理。

## 添加包

向您的项目添加包很简单：

```lua
target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("fmt", "spdlog", "nlohmann_json")
```

## 包源

Xmake 支持多个包源：

- 官方包 (xmake-repo)
- 第三方包
- 本地包
- 系统包

## 版本管理

您可以指定包版本：

```lua
add_packages("fmt@8.1.1", "spdlog@1.11.0")
```

## 自定义包仓库

添加您自己的包仓库：

```lua
add_repositories("myrepo https://github.com/myorg/xmake-repo")
```

这个高级包管理系统使依赖处理比传统方法更加容易。