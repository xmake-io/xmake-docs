---
title: xmake v2.1.4版本更新，增加交互式命令执行(REPL)
tags: [xmake, lua, 版本更新]
date: 2017-05-10
author: Ruki
---

### 概述

此次更新，主要增强`xmake lua`插件，支持交互式命令执行(read-eval-print, REPL)以及一些稳定性问题修复。

有时候在交互模式下，运行命令更加的方便测试和验证一些模块和api，也更加的灵活，不需要再去额外写一个脚本文件来加载。

我们先看下，如何进入交互模式：

```bash
# 不带任何参数执行，就可以进入
$ xmake lua
>

# 进行表达式计算
> 1 + 2
3

# 赋值和打印变量值
> a = 1
> a
1

# 多行输入和执行
> for _, v in pairs({1, 2, 3}) do
>> print(v)
>> end
1
2
3
```






我们也能够通过 `import` 来导入扩展模块：

```bash
> task = import("core.project.task")
> task.run("hello")
hello xmake!
```

如果要中途取消多行输入，只需要输入字符：`q` 就行了

```bash
> for _, v in ipairs({1, 2}) do
>> print(v)
>> q             <--  取消多行输入，清空先前的输入数据
> 1 + 2
3
```

详细更新信息，可参考下面的更新细节：

### 新特性

* [#68](https://github.com/xmake-io/xmake/issues/68): 增加`$(programdir)`和`$(xmake)`内建变量
* 添加`is_host`接口去判断当前的主机环境
* [#79](https://github.com/xmake-io/xmake/issues/79): 增强`xmake lua`，支持交互式解释执行

### 改进

* 修改菜单选项颜色
* [#71](https://github.com/xmake-io/xmake/issues/71): 针对widows编译器改进优化选项映射
* [#73](https://github.com/xmake-io/xmake/issues/73): 尝试获取可执行文件路径来作为xmake的脚本目录 
* 在`add_subdirs`中的子`xmake.lua`中，使用独立子作用域，避免作用域污染导致的干扰问题
* [#78](https://github.com/xmake-io/xmake/pull/78): 美化非全屏终端窗口下的`xmake --help`输出
* 避免产生不必要的`.xmake`目录，如果不在工程中的时候

### Bugs修复

* [#67](https://github.com/xmake-io/xmake/issues/67): 修复 `sudo make install` 命令权限问题
* [#70](https://github.com/xmake-io/xmake/issues/70): 修复检测android编译器错误
* 修复临时文件路径冲突问题
* 修复`os.host`, `os.arch`等接口
* 修复根域api加载干扰其他子作用域问题
* [#77](https://github.com/xmake-io/xmake/pull/77): 修复`cprint`色彩打印中断问题









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
