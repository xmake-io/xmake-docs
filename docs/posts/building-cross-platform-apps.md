---
---
title: Building Cross-Platform Applications with Xmake
tags: [cross-platform, tutorial, cpp]
date: 2024-01-10
author: Ruki
---

Building applications that work across multiple platforms can be challenging, but Xmake makes it much easier. In this post, we'll explore how to use Xmake to build cross-platform applications.

## Why Cross-Platform Development Matters

In today's diverse computing landscape, your users expect your applications to work on their preferred platform. Whether it's Windows, macOS, or Linux, Xmake provides the tools you need to build for all of them from a single codebase.

## Setting Up Cross-Platform Builds

### Basic Configuration

Here's a simple example of how to configure Xmake for cross-platform builds:

```lua
add_rules("mode.debug", "mode.release")

target("myapp")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("fmt", "spdlog")
    
    -- Platform-specific configurations
    if is_plat("windows") then
        add_defines("WIN32")
        add_files("src/win/*.cpp")
    elseif is_plat("macosx") then
        add_defines("MACOS")
        add_files("src/mac/*.cpp")
    elseif is_plat("linux") then
        add_defines("LINUX")
        add_files("src/linux/*.cpp")
    end
```

### Cross-Compilation

Xmake also supports cross-compilation for embedded systems:

```lua
target("embedded_app")
    set_kind("binary")
    add_files("src/*.c")
    
    -- Cross-compile for ARM
    set_plat("cross")
    set_arch("arm")
    set_toolchain("gcc")
    
    add_toolchains("arm-none-eabi-gcc")
```

## Best Practices

1. **Use Platform Abstractions**: Create platform-specific abstractions for system calls
2. **Test on All Platforms**: Set up CI/CD to test on all target platforms
3. **Use Conditional Compilation**: Use Xmake's platform detection for platform-specific code
4. **Package Dependencies**: Use Xmake's package management for cross-platform dependencies

## Conclusion

With Xmake, cross-platform development becomes much more manageable. The unified build system and excellent package management make it easy to target multiple platforms from a single configuration.

For more information, check out our [cross-compilation guide](/guide/basic-commands/cross-compilation). 