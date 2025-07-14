---
title: 利用xmake运行和调试程序
tags: [xmake, 调试, 运行]
date: 2016-07-16
author: Ruki
---

xmake默认在编译完程序后，可以通过以下命令运行指定目标程序：

```bash
    $xmake run [target] [arguments] ...
```

并且在linux/macosx下面，目前已经支持关联调试器，去直接调试指定目标了，只需要加上`-d/--debug`参数选项：

```bash
    $xmake run -d [target] [arguments] ...
```

默认情况下，xmake在macosx下用的是lldb，在linux下用的是gdb，调试器xmake会在配置的时候去自动检测，如果需要指定调试器路径，可以手动去配置它：

```bash
    $xmake f --debugger=/usr/bin/gdb
    $xmake run -d demo 
```

需要注意的是，目前windows上还没有支持，不过已经在计划中了，后续不久就会去支持它。。

