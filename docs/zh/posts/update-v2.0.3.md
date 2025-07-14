---
title: xmake v2.0.3 更新!
tags: [xmake, 版本更新, xmake.io, windows]
date: 2016-07-17
author: Ruki
---

[主页](http://www.xmake.io/cn)
[源码](https://github.com/waruqi/xmake)

# 更新内容

### 新特性

* 增加头文件依赖自动检测和增量编译，提高编译速度
* 在终端中进行颜色高亮提示
* 添加调试器支持，`xmake run -d program ...`

### 改进

* 增强运行shell的系列接口
* 更新luajit到v2.0.4版本
* 改进makefile生成插件，移除对xmake的依赖，并且支持`windows/linux/macosx`等大部分pc平台
* 优化多任务编译速度，在windows下编译提升较为明显

### Bugs修复

* 修复安装目录错误问题
* 修复`import`根目录错误问题
* 修复在多版本vs同时存在的情况下，检测vs环境失败问题
