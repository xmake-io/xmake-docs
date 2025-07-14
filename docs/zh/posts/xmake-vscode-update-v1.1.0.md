---
title: xmake-vscode v1.1.0版本发布，断点调试支持
tags: [xmake, lua, 版本更新]
date: 2018-06-28
author: Ruki
---

[xmake-vscode](https://github.com/xmake-io/xmake-vscode)插件深度集成了[xmake](https://github.com/xmake-io/xmake)和vscode，提供方便快速的跨平台c/c++构建。

此版本主要更新内容如下：

* 利用C/C++插件[vscode-cpptools](https://github.com/Microsoft/vscode-cpptools)实现直接加载断点调试xmake编译的程序
* 多工程目录工作区支持，可以随意切换和编译多个工程
* 改进mingw平台支持







### 断点调试

目前xmake-vscode插件需要依赖微软提供的[vscode-cpptools](https://github.com/Microsoft/vscode-cpptools)插件才能进行调试支持，不过由于开发c/c++程序，这个插件几乎是必需，所以并没有太大问题。

就算没有安装此插件，xmake-vscode也会加载lldb/gdb/vsjitdebugger等系统调试器，直接加载调试。

下图就是新的断点调试方式，原生与vscode集成：

<img src="/assets/img/posts/xmake/xmake-vscode-debug.gif">

### 多工程编译

新版本在下方状态栏部分，新增工程列表选择，切换到指定工程后，之后的所有编译、调试操作都是对此工程进行。

<img src="/assets/img/posts/xmake/xmake-vscode-projects.jpg">

### mingw编译配置

对于mingw编译原本就是支持的，只是新版本中稍微做了些改进，需要下载安装最新xmake v2.2.1版本哦。

在使用mingw编译前，我们先来了解下xmake命令行中，是如何利用mingw环境来编译的，我们需要通过`--sdk=`指定mingw的编译环境：

```bash
$ xmake f -p mingw --sdk="c:\xxx\mingwsdk"
```

在vscode中，只需要吧`--sdk=`添加到附加配置参数中去就行了。

```json
"xmake.additionalConfigArguments": {
    "type": "string",
    "default": "--sdk=\"c:\xxx\mingwsdk\"",
    "description": "The Additional Config Arguments, .e.g --cc=gcc --cxflags=\"-DDEBUG\""
}
```

然后切换到mingw编译平台就可以编译了。