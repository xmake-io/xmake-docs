---
title: Xmake Getting Started Tutorial 2, Create and build project
tags: [xmake, lua, c/c++]
date: 2019-11-09
author: Ruki
---

Xmake is a lightweight modern C/C++ project build tool based on Lua. Its main features are: easy to use syntax, more readable project maintenance, and a consistent build experience across platforms.

This article focuses on how to create a xmake-based project and compilation operations.

* [Project Source](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io/)

### Creating an empty project

Xmake provides the `xmake create` command, which makes it easy to quickly create empty projects in various languages such as c/c++, swift, objc, such as:

```bash
$ xmake create test
create test ...
  [+]: xmake.lua
  [+]: src/main.cpp
  [+]: .gitignore
create ok!
```

By default, a c++ hello world project is created, and a xmake.lua is generated in the root directory to describe the project's build rules.

```lua
add_rules("mode.debug", "mode.release")
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
```






This is a very simple xmake.lua description, `target("test")` defines a sub-project module test, each target will generate a corresponding object file, the binary type here, specify to create a basic executable file.

The top `mode.debug` and `mode.release` rule settings are optional, but we usually recommend adding them so that the default two common build modes are available: debug and release.

### Execution compilation

Usually if we just compile the executable file of the current host environment, we only need to execute the xmake command:

```bash
$ xmake
checking for the Xcode directory ... /Applications/Xcode.app
assessment for the SDK version of Xcode ... 10.15
[0%]: ccache compiling.release src/main.cpp
[100%]: linking.release test
```

Xmake will detect the existing build environment of the current environment by default, such as the author's current xcode environment, and then compile by default release mode. If the `mode.release` rule is set, it will take effect.

### Compile mode switch

And if we want to cut to `mode.debug` compile, we only need to:

```bash
$ xmake f -m debug
$ xmake
```

Among them, `xmake f` is a shorthand for the `xmake config` command, which is used to quickly switch the configuration. If you start with it, it is more convenient to use shorthand. The shorthand for more commands can be executed by `xmake --help`.

### Create another template project

`xmake create` can also be used to create various other types of engineering projects, we can type `xmake create --help` to see:

```bash
$ xmake create --help
Usage: $xmake create [options] [target]

Create a new project.

Options:
                                           
    -l LANGUAGE, --language=LANGUAGE The project language (default: c++)
                                               - c++
                                               - go
                                               - dlang
                                               - cuda
                                               - rust
                                               - swift
                                               - objc
                                               - c
                                               - objc++
    -t TEMPLATE, --template=TEMPLATE Select the project template id or name of the given language.
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
                                           
    Target Create the given target.
                                           Uses the project name as target if not exists.
```

From the help menu above, we can probably understand that the engineering language can be specified by `-l/--language`, and `-t/--template` is used to specify the type of project template.

For example, let's create a static library project based on c:

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

We can also create qt-based quickapp projects:

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

In addition to the c/c++ project, xmake also supports project compilation in other languages, but xmake focuses on c/c++. Other languages ​​are supported mainly to support mixed compilation with c/c++. After all, other languages ​​have official rust to rust. Provide a better build solution.

But we can still use xmake to try to compile them:

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
assessment for the SDK version of Xcode ... 10.15
[0%]: linking.release test
```