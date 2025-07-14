---
title: xmake v2.1.2版本更新，增强vs工程支持
tags: [xmake, lua, 版本, vs201x]
date: 2017-03-23
author: Ruki
---

## 概述

此版本主要增强了vs201x工程的生成，以及支持vs2017编译环境，并且针对archlinux提供更加方便的aur安装。

* [项目主页](http://www.xmake.io/cn/)
* [查看文档](http://www.xmake.io/#zh/)


详细更新内容如下：

### 新特性

* 添加aur打包脚本，并支持用`yaourt`包管理器进行安装。
* 添加[set_basename](#/zh/manual#targetset_basename)接口，便于定制化修改生成后的目标文件名

### 改进

* 支持vs2017编译环境
* 支持编译android版本的rust程序
* 增强vs201x工程生成插件，支持同时多模式、架构编译

### Bugs修复

* 修复编译android程序，找不到系统头文件问题
* 修复检测选项行为不正确问题
* [#57](https://github.com/xmake-io/xmake/issues/57): 修复代码文件权限到0644

### 构建演示

[![build_demo](/assets/img/posts/xmake/build_demo.gif)](https://github.com/xmake-io/xmake)





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