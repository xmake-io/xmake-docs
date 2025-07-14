---
title: xmake v2.0.4发布！
tags: [xmake, 版本更新]
date: 2016-08-29
author: Ruki
---

### 新特性

* 在`xmake.lua`中添加原生shell支持，例如：`add_ldflags("$(shell pkg-config --libs sqlite3)")`
* 编译windows目标程序，默认默认启用pdb符号文件
* 在windows上添加调试器支持（vsjitdebugger, ollydbg, windbg ... ）
* 添加`getenv`接口到`xmake.lua`的全局作用域中
* 添加生成vstudio工程插件(支持：vs2002 - vs2015)
* 为option添加`set_default`接口

### 改进

* 增强内建变量的处理
* 支持字符串类型的选项option设置

### Bugs修复

* 修复在linux下检测ld连接器失败，如果没装g++的话
* 修复`*.cxx`编译失败问题
