---
title: xmake-vscode v1.0.8 released, support Qt/WDK development
tags: [xmake, lua, update]
date: 2018-06-25
author: Ruki
---

[xmake-vscode](https://github.com/xmake-io/xmake-vscode) plugin is a xmake integration in Visual Studio Code.

It is deeply integrated with [xmake](https://github.com/xmake-io/xmake) and vscode to provide a convenient and fast cross-platform c/c++ development and building.

This version is mainly updated as follows:

* Support windows下VScode+shell(cmd/bash)
* Fix incomplete command bug in terminal on windows
* Update xmake API list for auto-complete tips
* Add Qt, WDK configuration to build Qt and WDK driver program
* Add additional configuration arguments to support cross-compilation

Newly added configuration:

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