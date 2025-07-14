---
title: xmake v2.1.3版本更新，修复安全和稳定性问题
tags: [xmake, lua, 版本更新]
date: 2017-04-02
author: Ruki
---

### 概述

此次更新，主要修复xmake的一些稳定性问题，并且对安装和卸载提供更加安全的权限处理，相关更新细节见：[改进权限问题，提升操作安全性](/cn/2017/03/30/safer-install-and-uninstall/)

![safer_installation](/assets/img/posts/xmake/safer_installation.png)

并且此版本还对用户使用上的体验进行了一些优化，例如：

* 减少冗余检测和提示信息，提升检测效率
* 在非xmake工程自动生成`xmake.lua`时提供更加友好的提示，避免误操作
* 在任意工程子目录也可正常执行xmake操作，类似git
* 提供更加安全友好的安装和卸载提示信息

详细更新信息，可参考下面的更新细节：

### 新特性

* [#65](https://github.com/xmake-io/xmake/pull/65): 为target添加`set_default`接口用于修改默认的构建所有targets行为
* 允许在工程子目录执行`xmake`命令进行构建，xmake会自动检测所在的工程根目录
* 添加`add_rpathdirs` api到target和option，支持动态库的自动加载运行

### 改进

* [#61](https://github.com/xmake-io/xmake/pull/61): 提供更加安全的`xmake install` and `xmake uninstall`任务，更友好的处理root安装问题
* 提供`rpm`, `deb`和`osxpkg`安装包
* [#63](https://github.com/xmake-io/xmake/pull/63): 改进安装脚本，实现更加安全的构建和安装xmake
* [#61](https://github.com/xmake-io/xmake/pull/61): 禁止在root权限下运行xmake命令，增强安全性
* 改进工具链检测，通过延迟延迟检测提升整体检测效率
* 当自动扫面生成`xmake.lua`时，添加更友好的用户提示，避免用户无操作

### Bugs修复

* 修复版本检测的错误提示信息
* [#60](https://github.com/xmake-io/xmake/issues/60): 修复macosx和windows平台的xmake自举编译
* [#64](https://github.com/xmake-io/xmake/issues/64): 修复构建android `armv8-a`架构失败问题
* [#50](https://github.com/xmake-io/xmake/issues/50): 修复构建android可执行程序，无法运行问题








## 简介

XMake是一个基于Lua的轻量级跨平台自动构建工具，支持在各种主流平台上构建项目

xmake的目标是开发者更加关注于项目本身开发，简化项目的描述和构建，并且提供平台无关性，使得一次编写，随处构建

它跟cmake、automake、premake有点类似，但是机制不同，它默认不会去生成IDE相关的工程文件，采用直接编译，并且更加的方便易用
采用lua的工程描述语法更简洁直观，支持在大部分常用平台上进行构建，以及交叉编译

并且xmake提供了创建、配置、编译、打包、安装、卸载、运行等一些actions，使得开发和构建更加的方便和流程化。

不仅如此，它还提供了许多更加高级的特性，例如插件扩展、脚本宏记录、批量打包、自动文档生成等等。。

如果你想要了解更多，请参考：

* [在线文档](https://xmake.io/zh/)
* [在线源码](https://github.com/waruqi/xmake)
* [项目主页](http://www.xmake.io/cn)

## 简单的工程描述

```lua
target("console")
    set_kind("binary")
    add_files("src/*.c") 
```

## 构建工程

```bash
$ xmake
```

## 运行目标

```bash
$ xmake run console
```

## 调试程序

```bash
$ xmake run -d console
```

## 支持特性

* Tasks
* Macros
* Actions
* Options
* Plugins
* Templates

## 支持平台

* Windows (x86, x64, amd64, x86_amd64)
* Macosx (i386, x86_64)
* Linux (i386, x86_64, cross-toolchains ...)
* Android (armv5te, armv6, armv7-a, armv8-a, arm64-v8a)
* iPhoneOS (armv7, armv7s, arm64, i386, x86_64)
* WatchOS (armv7k, i386)
* Mingw (i386, x86_64)

## 支持语言

* C/C++
* Objc/Objc++
* Swift
* Assembly
* Golang
* Rust
* Dlang

## 内置插件

* 宏记录脚本和回放插件
* 加载自定义lua脚本插件
* 生成IDE工程文件插件（makefile, vs2002 - vs2017, ...）
* 生成doxygen文档插件
* iOS app2ipa插件

## 构建演示

[![build_demo](/assets/img/posts/xmake/build_demo.gif)](https://github.com/xmake-io/xmake)
