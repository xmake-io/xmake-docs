---
title: xmake新增对Qt编译环境支持
tags: [xmake, lua, Qt, Widgets, QuickApplication]
date: 2018-05-30
author: Ruki
---

在最新的[xmake](https://github.com/xmake-io/xmake) v2.2.1版本中，新增了对Qt SDK环境的支持，我们完全可以脱离Qt Creater进行Qt应用程序的开发，甚至配合vscode/idea等编辑器+xmake插件([xmake-vscode](https://github.com/xmake-io/xmake-vscode), [xmake-idea](https://github.com/xmake-io/xmake-idea) ...)，
用户完全可以切换到自己最常用的编辑器环境中去开发和构建Qt程序，例如这样：

<img src="/assets/img/posts/xmake/vscode-qt.jpeg">

#### 通过模板创建空工程

xmake内置了一些工程模板可以用来快速创建一个基于Qt的空工程，例如：

```console
$ xmake create -l c++ -t console_qt test
$ xmake create -l c++ -t static_qt test
$ xmake create -l c++ -t shared_qt test
$ xmake create -l c++ -t quickapp_qt test
```

目前主要提供上述四种工程模板，对应：控制台程序、静态库、动态库、ui应用程序。

以quickapp工程为例，最后生成的空工程`xmake.lua`内容大概长这样：

```lua
target("qt_demo")

    -- add rules
    add_rules("qt.application")

    -- add headers
    add_headers("src/*.h")

    -- add files
    add_files("src/*.cpp") 
    add_files("src/qml.qrc")

    -- add frameworks
    add_frameworks("QtQuick")
```










#### Qt SDK环境配置

默认情况下xmake会自动探测Qt环境，当然如果找不到Qt SDK环境，用户也可以手动指定Qt SDK环境目录：

```console
$ xmake f --qt=~/Qt/Qt5.9.1
```

##### 静态库程序

xmake通过内置的构建规则`qt.static`，将其应用到对应的target，即可让相关target支持Qt静态库的构建，非常的方便简洁，关于构建规则的说明，可参考相关文档：[内建规则](/zh/api/description/builtin-rules)

如果大家想要支持其他构建环境，也只需要方便的自定义一个自己的扩展规则，应用到对应的target即可实现，言归正传，我们看下Qt静态库的`xmake.lua`描述：

```lua
target("test")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

非常简单，一般只需要这几行就ok了，如果需要用到Qt的一些框架库，可以通过`add_frameworks`来添加, 接着就是正常的编译过程：

```console
$ xmake
```

##### 动态库程序

动态库程序跟上节介绍的静态库描述规则类似，唯一的区别就是吧构建规则改成`add_rules("qt.shared")`就行了。

```lua
target("test")
    add_rules("qt.shared")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

那`add_rules("qt.shared")`和之前的`set_kind("shared")`有什么区别呢，区别就是：

- `set_kind("shared")`: 是xmake最为基础的动态库构建模式，非常原始，不附加任何框架层的依赖库和配置
- `add_rules("qt.shared")`：仅用于Qt动态库的构建，属于内置的扩展规则，会附加Qt SDK的构建环境

##### 控制台程序

控制台也是类似，直接替换构建规则就可以了：qt.console

```lua
target("test")
    add_rules("qt.console")
    add_files("src/*.cpp")
```

##### Quick应用程序

从Qt目前最新的SDK，主要提供了两种ui app的构建框架，Quick App 和 Widgets App，xmake也都进行了支持，并且统一规范成：`qt.application` Qt应用程序规则来简化设置。

```lua
target("qt_quickapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/qml.qrc")
    add_frameworks("QtQuick")
```

看上述描述，仅仅只需要把对应的`qml.qrc`作为源文件添加进去，然后附加需要的QtQuick依赖库就行了。

注：虽然xmake的`add_links`也是用来添加依赖库进行链接的，但是这里建议对于Qt SDK提供的库还是用`add_frameworks`来添加，因为所有Qt的构建规则都对`add_frameworks`进行了扩展，
对Qt自带的框架库进行了更好的支持，也能根据构建模式自动切换debug/release版本的Qt库。

##### Widgets应用程序

Widgets App的描述规则还是用的`qt.application`，只需要把.ui文件添加进去就行了，唯一需要注意的是，带`Q_OBJECT`meta的头文件，例如：`mainwindow.h`这种，
因为有个moc预处理过程，所以也需要把它添加到源文件中，这样Qt的构建规则就会检测到，将其自动进行moc预处理。

```lua
target("qt_widgetapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- 添加带有 Q_OBJECT 的meta头文件
    add_frameworks("QtWidgets")
```


关于Qt SDK环境支持的更多详情可以参考：[#160](https://github.com/xmake-io/xmake/issues/160)