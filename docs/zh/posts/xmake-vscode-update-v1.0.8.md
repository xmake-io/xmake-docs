---
title: xmake-vscode v1.0.8版本发布，在vscode中构建Qt/WDK程序
tags: [xmake, lua, 版本更新]
date: 2018-06-25
author: Ruki
---

[xmake-vscode](https://github.com/xmake-io/xmake-vscode)插件深度集成了[xmake](https://github.com/xmake-io/xmake)和vscode，提供方便快速的跨平台c/c++构建。

此版本主要更新内容如下：

* 兼容windows下VScode+shell(cmd/bash)
* 修复windows下使用，偶尔出现命令在终端下被截断的问题
* 更新xmake的自动补全，支持最新版本API
* 增加对Qt、WDK环境的支持和配置
* 新增附加参数配置，实现交叉编译的配置支持

新增的配置内容如下:

```json
"xmake.QtDirectory": {
    "type": "string",
    "default": "",
    "description": "The Qt Directory"
},
"xmake.WDKDirectory": {
    "type": "string",
    "default": "",
    "description": "The WDK Directory"
},
"xmake.additionalConfigArguments": {
    "type": "string",
    "default": "",
    "description": "The Additional Config Arguments, .e.g --cc=gcc --cxflags=\"-DDEBUG\""
}
```