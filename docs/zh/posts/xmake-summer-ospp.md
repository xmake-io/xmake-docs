---
title: Summer2021：暑期来 Xmake 社区做项目吧，还有奖金领取哦
tags: [xmake, lua, C/C++, summer, 开源之夏]
date: 2021-04-29
author: Ruki
outline: deep
---

### "开源之夏" 简介

中科院软件所与华为 openEuler 社区去年共同举办了 “开源软件供应链点亮计划——暑期2020” 活动，今年为第二届。该活动旨在鼓励大家关注开源软件和开源社区，致力于培养和发掘更多优秀的开发者。

开源之夏网站：[https://summer.iscas.ac.cn/](https://summer.iscas.ac.cn/)

### 来 Xmake 社区一起做项目

今年 Xmake 社区也报名参加了此活动，并且提供了三个活动项目，难易程度中等，欢迎大家一起参与进来，还有奖金可以领取哦。

Summer2021 活动为期 3 个月：

Mentor 负责指导报名的 Student 完成并达成预期的目标
达成目标后，活动主办方会给与 Mentor 和 Student 一定的奖励和资助
数额因项目难度和完成情况而略有差异，从 6000 - 12000 不等，具体情况以开源之夏活动官网为准，解释权归活动主办方所有








### 活动项目介绍

#### xmake 仓库包制作

难度：低

项目介绍：

在 xmake 的官方 C/C++ 仓库 [https://github.com/xmake-io/xmake-repo](https://github.com/xmake-io/xmake-repo) 中，新增提交 20 个常用的 C/C++ 库 其中，需要包括以下开发库：

1. matlab sdk 开发库
2. gtk3/glib 系列相关库 剩下的自己挑选一些 github star > 500 的 C/C++ 库提交收录。

项目产出要求：

- 完成 matlab 相关库收录
- 完成 gtk 库收录
- 完成 glib 库收录
- 完成其他 C/C++ 库收录

相关资料文档：

- [包制作和提交文档](https://xmake.io/zh/)
- [包仓库地址](https://github.com/xmake-io/xmake-repo)

#### 实现 xcode 工程生成插件

难度：中

项目介绍：

将 xmake.lua 维护的 C/C++ 项目，通过 `xmake project -k xcode` 命令，生成完整的 xcode 工程文件，并且能够在 xcode 中编译运行项目。

背景：

xmake 当前版本也是有提供生成 xcode 工程生成的，但是是基于 cmake，先通过 `xmake project -k cmake` 在内部生成 CMakelist.txt，再去使用 cmake 生成的 xcodo 工程文件。

通过这种方式，增加了对 cmake 的依赖，并且不够灵活可控，受限于 cmake 的支持力度，很多 xmake 特有的功能特性都没法直接支持。

因此，需要重写一个完全新版本的插件，直接基于 xmake 的模块，读取 xmake.lua 工程信息来生成 xcode 工程。

项目产出要求：

- 生成 xcode 工程文件
- 支持在 xcode 中编译运行
- 支持分组展示源文件树
- 支持 debug 和 release 等模式切换

相关资料文档：

- [插件开发文档](https://xmake.io/zh/)
- [现有插件代码目录](https://github.com/xmake-io/xmake/tree/master/xmake/plugins/project/xcode)

#### 重构升级基于 xmake 的 IntelliJ IDEA 插件

难度：中

项目介绍：

原有插件项目地址：https://github.com/xmake-io/xmake-idea 原有的插件代码太老，Clion/Idea 等 2021 新版本已经完全不兼容，需要重构下。 并且需要在现有功能的基础上，增加 intelligense 和 断点调试支持。

项目产出要求：

- 支持最新版 Idea/Clion IDE 2021
- 完全支持老插件的所有功能，创建，配置，编译和运行
- C/C++ Intelligense 支持
- xmake.lua 的自动补全
- 断点调试支持

相关的资料文档：

- [老的项目地址](https://github.com/xmake-io/xmake-idea)
- [相关的 Issues 讨论](https://github.com/xmake-io/xmake-idea/issues/5)
- [参考其他插件: bazelbuild](https://github.com/bazelbuild/intellij)

### 导师联系方式

- 邮箱：waruqi@gmail.com
- 微信：waruqi (备注：summber2021)
- QQ 群：343118190
- Discord: [https://discord.gg/xmake](https://discord.gg/xmake)
- 直接 Issues 上沟通：[https://github.com/xmake-io/xmake/issues](https://github.com/xmake-io/xmake/issues)