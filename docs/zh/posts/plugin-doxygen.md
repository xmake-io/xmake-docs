---
title: xmake插件使用之doxygen文档生成
tags: [xmake, doxygen, 插件, 文档生成]
date: 2016-08-02
author: Ruki
outline: deep
---

这个doxygen插件比较简单，说白了就是一键生成工程文档，只需要执行下面这行命令就行了

```bash
xmake doxygen
```

当然你也可以指定输出目录，可以工程源码目录：

```bash
xmake doxygen -o /tmp/output project/src
```




生成的文档中，工程名和版本号，就是xmake.lua中通过如下两条api设置的：

```lua

-- 设置工程名
set_project("tbox")

-- 设置版本号
set_version("v1.5.1")
```

这个插件执行的时候回去检测当前平台是否存在doxygen工具，如果没有的话，是没法生成文档的哦。。: )
