---
title: Advanced Package Management
date: 2024-01-03
author: waruqi
tags: [package-management, advanced]
---

# Advanced Package Management with Xmake

Xmake provides a powerful package management system that simplifies dependency handling in C/C++ projects.

## Adding Packages

Adding packages to your project is simple:

```lua
target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("fmt", "spdlog", "nlohmann_json")
```

## Package Sources

Xmake supports multiple package sources:

- Official packages (xmake-repo)
- Third-party packages
- Local packages
- System packages

## Version Management

You can specify package versions:

```lua
add_packages("fmt@8.1.1", "spdlog@1.11.0")
```

## Custom Package Repositories

Add your own package repositories:

```lua
add_repositories("myrepo https://github.com/myorg/xmake-repo")
```

This advanced package management system makes dependency handling much easier than traditional approaches.