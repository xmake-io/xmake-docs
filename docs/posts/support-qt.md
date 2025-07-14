---
title: XMake, Support for the Qt SDK environment
tags: [xmake, lua, Qt, Widgets, QuickApplication]
date: 2018-05-30
author: Ruki
---

In the latest [xmake](https://github.com/xmake-io/xmake) v2.2.1 release, we have supported for the QT SDK environment, and we can fully develop QT applications 
in VScode/Sublime Text/IDEA Intellij and xmake plugin ([xmake-vscode](https://github.com/xmake-io/xmake-vscode), [xmake-idea](https://github.com/tboox/
xmake-idea) ...).

Users can completely switch to their most commonly used editor environments to develop and build QT programs, such as:

<img src="/assets/img/posts/xmake/vscode-qt.jpeg">

#### Create an empty project from a template

xmake provides some project templates that can be used to quickly create an empty project based on QT, for example:

```console
$ xmake create -l c++ -t console_qt test
$ xmake create -l c++ -t static_qt test
$ xmake create -l c++ -t shared_qt test
$ xmake create -l c++ -t quickapp_qt test
```

At present, mainly provide the four types of engineering templates, corresponding to: console programs, static libraries, dynamic libraries, UI applications.

The content of xmake.lua for quickapp is this:

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










#### Qt SDK Configuration

The QT environment is automatically detected by xmake by default, but if the QT SDK environment is not found, users can manually specify the QT SDK Environment directory:

```console
$ xmake f --qt=~/Qt/Qt5.9.1
```

##### Static Library 

xmake uses the built-in build rule `qt.static` to apply it to target to support the compilation of the QT Static library.

```lua
target("test")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

If you need to use some Qt libraries, you can add them through `add_frameworks`.

Then we can build this program via the following command:

```console
$ xmake
```

##### Shared Library

The dynamic library program is similar to the static library description rule described in the previous section, 
and the only difference is that the build rule is changed to `add_rules("qt.shared")` on the line.

```lua
target("test")
    add_rules("qt.shared")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

##### Console Program

```lua
target("test")
    add_rules("qt.console")
    add_files("src/*.cpp")
```

##### Quick Application Program

从Qt目前最新的SDK，主要提供了两种ui app的构建框架，Quick App 和 Widgets App，xmake也都进行了支持，并且统一规范成：`qt.application` Qt应用程序规则来简化设置。

```lua
target("qt_quickapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/qml.qrc")
    add_frameworks("QtQuick")
```

Note: Although xmake's `add_links` is also used to add dependent libraries for linking, 
it is recommended that the library provided by the QT SDK be added with `add_frameworks` because all Qt build rules extend to `add_frameworks`.

##### Widgets Application Program

The Widgets app description rule is also `qt.application`, just add the `.ui` file and the only thing to note is that the header file with `Q_OBJECT` meta, for example: `mainwindow.h`.

```lua
target("qt_widgetapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- add files with Q_OBJECT meta (only for qt.moc)
    add_frameworks("QtWidgets")
```

For more information on QT SDK Environment support, refer to: [#160] (https://github.com/xmake-io/xmake/issues/160)