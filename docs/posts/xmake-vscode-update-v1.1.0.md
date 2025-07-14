---
title: xmake-vscode v1.1.0 released, Support breakpoint debugging
tags: [xmake, lua, update]
date: 2018-06-28
author: Ruki
---

[xmake-vscode](https://github.com/xmake-io/xmake-vscode) plugin is a xmake integration in Visual Studio Code.

It is deeply integrated with [xmake](https://github.com/xmake-io/xmake) and vscode to provide a convenient and fast cross-platform c/c++ development and building.

This version is mainly updated as follows:

* Support breakpoint debugging, need [vscode-cpptools](https://github.com/Microsoft/vscode-cpptools) plugin
* Support multi-project workspaces
* Improve mingw platform








### Breakpoint Debugging

<img src="/assets/img/posts/xmake/xmake-vscode-debug.gif">

### Multi-project workspaces

<img src="/assets/img/posts/xmake/xmake-vscode-projects.jpg">

### MinGW configuration

We need only add `--sdk=` option to additional configuration in vscode.

```json
"xmake.additionalConfigArguments": {
    "type": "string",
    "default": "--sdk=\"c:\xxx\mingwsdk\"",
    "description": "The Additional Config Arguments, .e.g --cc=gcc --cxflags=\"-DDEBUG\""
}
```
