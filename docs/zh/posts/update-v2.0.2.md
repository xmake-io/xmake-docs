---
title: xmake v2.0.2 更新!
tags: [xmake, 版本更新, xmake.io, windows]
date: 2016-07-06
author: Ruki
---

[主页](https://xmake.io/cn)
[源码](https://github.com/waruqi/xmake)

# 更新内容

此版本，主要修复一些bug和稳定性改善

### 改进

* 修改安装和卸载的action处理
* 更新工程模板
* 增强函数检测

### Bugs修复

* [#7](https://github.com/waruqi/xmake/issues/7): 修复用模板创建工程后，target名不对问题：'[targetname]'
* [#9](https://github.com/waruqi/xmake/issues/9): 修复clang不支持c++11的问题
* 修复api作用域泄露问题
* 修复在windows上的一些路径问题
* 修复检测宏函数失败问题
* 修复检测工具链失败问题
* 修复windows上编译android版本失败