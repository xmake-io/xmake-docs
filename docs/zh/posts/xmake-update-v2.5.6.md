---
title: xmake v2.5.6 发布，改进预编译二进制镜像包兼容性
tags: [xmake, lua, C/C++, precompiled, package]
date: 2021-07-26
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具，使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

这是一个稳定性修复版本，主要修复和改进了一些跟预编译二进制包相关的兼容性问题。另外新增了一些实用的接口来设置默认的编译平台、架构和模式，以及允许的编译平台、架构列表等等。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](https://xmake.io/zh/)

## 新特性介绍

### windows 预编译包的兼容性修复

上个版本对 Windows 下的 预编译包安装做了初步的支持，但是由于没有考虑 toolset 版本的兼容性问题，因此如果用户的 vs 版本过低，就会在集成包时候出现链接问题。

根据 ms 的官方描述，其实 msvc 的二进制库对于 toolset 的版本是向下兼容的。[https://docs.microsoft.com/en-us/cpp/porting/binary-compat-2015-2017?view=msvc-160](https://docs.microsoft.com/en-us/cpp/porting/binary-compat-2015-2017?view=msvc-160)

> You can mix binaries built by different versions of the v140, v141, and v142 toolsets. However, you must link by using a toolset at least as recent as the most recent binary in your app. Here's an example: you can link an app compiled using any 2017 toolset (v141, versions 15.0 through 15.9) to a static library compiled using, say, Visual Studio 2019 version 16.2 (v142), if they're linked using a version 16.2 or later toolset. You can link a version 16.2 library to a version 16.4 app as long as you use a 16.4 or later toolset.

也就是说，云端采用 v141 编译的库，用户的 msvc toolset 只要是 >=141 就可以兼容支持。

因此，我们改进了云端的预编译逻辑，针对 vs2015/14.16 和 vs2019/14.29 两个工具集分别进行预编译，然后 xmake 会根据用户 msvc 的 toolset 版本，优先选取最优的兼容版本库下载集成。








### set_defaultplat

#### 设置默认的编译平台

v2.5.6 以上版本才支持，用于设置工程默认的编译平台，如果没有设置，默认平台跟随当前系统平台，也就是 os.host()。

比如，在 macOS 上默认编译平台是 macosx，如果当前项目是 ios 项目，那么可以设置默认编译平台为 iphoneos。

```lua
set_defaultplat("iphoneos")
```

它等价于，`xmake f -p iphoneos`。

### set_defaultarch

#### 设置默认的编译架构

v2.5.6 以上版本才支持，用于设置工程默认的编译架构，如果没有设置，默认平台跟随当前系统架构，也就是 os.arch()。

```lua
set_defaultplat("iphoneos")
set_defaultarch("arm64")
```

它等价于，`xmake f -p iphoneos -a arm64`。

我们也可以设置多个平台下的默认架构。

```lua
set_defaultarch("iphoneos|arm64", "windows|x64")
```

在 iphoneos 上默认编译 arm64 架构，在 windows 上默认编译 x64 架构。

### set_defaultmode

#### 设置默认的编译模式

v2.5.6 以上版本才支持，用于设置工程默认的编译模式，如果没有设置，默认是 release 模式编译。

```lua
set_defaultmode("releasedbg")
```

它等价于，`xmake f -m releasedbg`。

### set_allowedplats

#### 设置允许编译的平台列表

v2.5.6 以上版本才支持，用于设置工程支持的编译平台列表，如果用户指定了其他平台，会提示错误，这通常用于限制用户指定错误的无效平台。

如果没有设置，那么没有任何平台限制。

```lua
set_allowedplats("windows", "mingw")
```

设置当前项目仅仅支持 windows 和 mingw 平台。

### set_allowedarchs

#### 设置允许编译的平台架构

v2.5.6 以上版本才支持，用于设置工程支持的编译架构列表，如果用户指定了其他架构，会提示错误，这通常用于限制用户指定错误的无效架构。

如果没有设置，那么没有任何架构限制。

```lua
set_allowedarchs("x64", "x86")
```

当前项目，仅仅支持 x64/x86 平台。

我们也可以同时指定多个平台下允许的架构列表。

```lua
set_allowedarchs("windows|x64", "iphoneos|arm64")
```

设置当前项目在 windows 上仅仅支持 x64 架构，并且在 iphoneos 上仅仅支持 arm64 架构。

### set_allowedmodes

#### 设置允许的编译模式列表

v2.5.6 以上版本才支持，用于设置工程支持的编译模式列表，如果用户指定了其他模式，会提示错误，这通常用于限制用户指定错误的无效模式。

如果没有设置，那么没有任何模式限制。

```lua
set_allowedmodes("release", "releasedbg")
```

设置当前项目仅仅支持 release/releasedbg 两个编译模式。


## 更新内容

### 新特性

* [#1483](https://github.com/xmake-io/xmake/issues/1483): 添加 `os.joinenvs()` 和改进包工具环境
* [#1523](https://github.com/xmake-io/xmake/issues/1523): 添加 `set_allowedmodes`, `set_allowedplats` 和 `set_allowedarchs`
* [#1523](https://github.com/xmake-io/xmake/issues/1523): 添加 `set_defaultmode`, `set_defaultplat` 和 `set_defaultarch`

### 改进

* 改进 vs/vsxmake 工程插件支持 vs2022
* [#1513](https://github.com/xmake-io/xmake/issues/1513): 改进 windows 预编译包的兼容性问题
* 改进 vcpkg 包在 windows 上的查找
* 改进对 Qt6 的支持

### Bugs 修复

* [#489](https://github.com/xmake-io/xmake-repo/pull/489): 修复 run os.execv 带有过长环境变量值出现的一些问题
