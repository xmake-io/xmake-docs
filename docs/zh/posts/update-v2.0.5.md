---
title: xmake v2.0.5 发布!
tags: [xmake, 版本更新]
date: 2016-10-30
author: Ruki
---

### 新特性

* 为解释器作用域增加一些内建模块支持
* 针对windows x64平台，支持ml64汇编器

### 改进

* 增强ipairs和pairs接口，支持过滤器模式，简化脚本代码
* 为vs201x工程生成增加文件filter
* 移除`core/tools`目录以及msys工具链，在windows上使用xmake自编译core源码进行安装，优化xmake源码磁盘空间
* 移除`xmake/packages`，默认模板安装不再内置二进制packages，暂时需要手动放置，以后再做成自动包依赖下载编译

### Bugs修复

* 修复msvc的编译选项不支持问题：`-def:xxx.def`
* 修复ml.exe汇编器脚本
* 修复选项链接顺序问题







### 项目源码

[Github](https://github.com/waruqi/xmake)

### 项目文档

[Wiki](https://github.com/waruqi/xmake/wiki)