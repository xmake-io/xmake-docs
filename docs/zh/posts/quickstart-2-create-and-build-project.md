---
title: xmake从入门到精通2：创建和编译工程
tags: [xmake, lua, c/c++, 创建工程]
date: 2019-11-09
author: Ruki
outline: deep
---

xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。

本文主要详细讲解如何创建一个基于xmake的工程以及编译操作。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

### 创建空工程

xmake提供了`xmake create`命令，可以很方便的快速创建基于c/c++, swift, objc等各种语言的空工程项目，比如：

```bash
$ xmake create test
create test ...
  [+]: xmake.lua
  [+]: src/main.cpp
  [+]: .gitignore
create ok!
```

默认会创建一个c++的hello world工程，根目录下会生成一个xmake.lua用于描述项目的构建规则。

```lua
add_rules("mode.debug", "mode.release")
target("test")
    set_kind("binary")
    add_files("src/*.cpp") 
```






这是一个非常简单的xmake.lua描述，`target("test")`定义了一个子工程模块test，每个target会生成一个对应的目标文件，此处的binary类型，指定创建一个最基础的可执行文件。

而最上面的`mode.debug`和`mode.release`规则设置，是可选设置，但是通常我们都会建议加上，这样默认就可以生效两种常用的构建模式：debug和release

### 执行编译

通常我们如果只是编译当前主机环境的可执行文件，只需要执行xmake这个命令就可以了：

```bash
$ xmake
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.15
[  0%]: ccache compiling.release src/main.cpp
[100%]: linking.release test
```

xmake默认会检测当前环境已存在的构建环境，比如笔者当前的xcode环境，然后默认采用release模式编译，如果设置了`mode.release`规则，那么就会生效。

### 编译模式切换

而如果我们要切到`mode.debug`编译，只需要：

```bash
$ xmake f -m debug
$ xmake
```

其中，`xmake f`是`xmake config`命令的简写，用来快速的切换配置，如果上手之后，通常采用简写会更加方便，更多命令的简写，都可执行`xmake --help`查看。 

### 创建其他模板工程

`xmake create`还可以用来创建各种其他类型的工程项目，我们可以敲`xmake create --help`看下：

```bash
$ xmake create --help
Usage: $xmake create [options] [target]

Create a new project.

Options: 
                                           
    -l LANGUAGE, --language=LANGUAGE       The project language (default: c++)
                                               - c++
                                               - go
                                               - dlang
                                               - cuda
                                               - rust
                                               - swift
                                               - objc
                                               - c
                                               - objc++
    -t TEMPLATE, --template=TEMPLATE       Select the project template id or name of the given language. 
                                           (default: console)
                                               - console: c++, go, dlang, cuda, rust, swift, objc, c, objc++
                                               - qt.console: c++
                                               - qt.quickapp: c++
                                               - qt.quickapp_static: c++
                                               - qt.shared: c++
                                               - qt.static: c++
                                               - qt.widgetapp: c++
                                               - qt.widgetapp_static: c++
                                               - shared: c++, dlang, cuda, c
                                               - static: c++, go, dlang, cuda, rust, c
                                               - tbox.console: c++, c
                                               - tbox.shared: c++, c
                                               - tbox.static: c++, c
                                           
    target                                 Create the given target.
                                           Uses the project name as target if not exists.
```

从上面的帮助菜单，我们可以大概了解到，可以通过`-l/--language`来指定工程语言，而`-t/--template`用来指定闯将的工程模板类型。

比如，我们创建一个基于c的静态库项目：

```bash
$ xmake create -l c -t static test
create test ...
  [+]: xmake.lua
  [+]: src/interface.c
  [+]: src/interface.h
  [+]: src/test.c
  [+]: src/main.cpp
  [+]: .gitignore
create ok!
```

我们也可以创建基于qt的quickapp项目：

```bash
$ xmake create -l c++ -t qt.quickapp test
create test ...
  [+]: xmake.lua
  [+]: src/interface.c
  [+]: src/main.qml
  [+]: src/interface.h
  [+]: src/test.c
  [+]: src/main.cpp
  [+]: src/qml.qrc
  [+]: .gitignore
create ok!
```

除了c/c++项目，xmake还支持其他语言的项目编译，但xmake重点还是在c/c++上，支持其他语言也主要是为了支持跟c/c++进行混合编译，毕竟其他语言向rust什么的官方有提供更好的构建方案。

不过我们还是可以使用xmake来尝试编译他们：

```bash
$ xmake create -l rust test
create test ...
  [+]: xmake.lua
  [+]: src/main.rs
  [+]: .gitignore
create ok!
```

```bash
$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.15
[  0%]: linking.release test
```
