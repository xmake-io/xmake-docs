---
title: 插件使用之批量打包
tags: [xmake, 插件, 宏脚本, 打包]
date: 2016-06-09
author: Ruki
---

xmake提供了一些比较实用的内置宏脚本，比如 批量打包宏脚本 `xmake macro package`

这个宏脚本可以批量打包指定平台的所有架构，例如：

```bash
    # 批量打包当前平台的所有架构
    xmake macro package 

    # 批量打包iphoneos平台的所有架构
    xmake macro package -p iphoneos

    # 批量打包iphoneos平台的所有架构，并且传入"-m debug"给 `xmake config` 进行打包debug版本，包输出到/tmp/output目录
    xmake macro package -p iphoneos -f "-m debug" -o /tmp/output
```

这个打包宏针对iphoneos平台，还会自动将所有arch的包打成一个universal包。

针对这个宏的详细使用说明，可以参看：`xmake macro package --help` 