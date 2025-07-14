---
title: xmake v2.2.6 released, Support Qt/Adnroid application
tags: [xmake, lua, C/C++, Package]
date: 2019-05-26
author: Ruki
---

This version mainly improves the support of remote dependencies, and adds support for clib package dependencies. 
In addition, xmake has been able to directly compile Qt/Android projects, and can directly generate apk packages and install them to device support.

* [project source](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io)

## Introduction of new features

### Qt/Android Compilation Support

We can create a Qt empty project first, and try to compile and generate apk, for example:

```console
xmake create -t quickapp_qt -l c ++ appdemo
cd appdemo
xmake f -p android --ndk=~/Downloads/android-ndk-r19c/ --android_sdk=~/Library/Android/sdk/ -c
xmake
[0%]: compiling.qt.qrc src/qml.qrc
[ 50%]: ccache compiling.release src/main.cpp
[100%]: linking.release libappdemo.so
[100%]: generating.qt.app appdemo.apk
```

Then install to the device:

```console
xmake install
installing appdemo ...
installing build/android/armv7-a/release/appdemo.apk ..
success
install ok!👌
```

Very simple, we can look at its xmake.lua description, in fact, there is no difference between compiling and maintaining the Qt project on the pc. The exact same description file is just switched to the android platform when compiling.

```lua
add_rules("mode.debug", "mode.release")

target("appdemo")
    add_rules("qt.application")
    add_headerfiles("src/*.h")

    add_files("src/*.cpp")
    add_files("src/qml.qrc")

    add_frameworks("QtQuick")
```






### clib package dependency integration

Clib is a source-based dependency package manager. The dependent package is downloaded directly to the corresponding library source code, integrated into the project to compile, rather than binary library dependencies.

It is also very convenient to integrate in xmake. The only thing to note is that you need to add the source code of the corresponding library to xmake.lua, for example:

```lua
add_requires("clib::clibs/bytes@0.0.4", {alias = "bytes"})

target("xmake-test")
    set_kind("binary")
    add_files("clib/bytes/*.c")
    add_files("src/*.c")
    add_packages("bytes")
```

### Syntax simplification

The configuration field syntax of xmake.lua is very flexible and can be used in a variety of complex and flexible configurations in the relevant domain, but for many streamlined small block configurations, this time is slightly redundant:

```lua
option("test1")
    set_default(true)
    set_showmenu(true)
    set_description("test1 option")

option("test2")
    set_default(true)
    set_showmeu(true)

option("test3")
    set_default("hello")
```

For the above small block option domain settings, we can simplify the description into a single line:

```lua
option("test1", {default = true, showmenu = true, description = "test1 option"})
option("test2", {default = true, showmenu = true})
option("test3", {default = "hello"})
```

In addition to the option field, this simplified writing is also supported for other domains, such as:

```lua
target("demo")
    set_kind("binary")
    add_files("src/*.c")
```

Simplified to:

```lua
target("demo", {kind = "binary", files = "src/*.c"})
```

Of course, if the configuration requirements are more complicated, or the original multi-line setting method is more convenient, this depends on your own needs to evaluate which method is used.

### New features

* [#380](https://github.com/xmake-io/xmake/pull/380): Add support to export compile_flags.txt 
* [#382](https://github.com/xmake-io/xmake/issues/382): Simplify simple scope settings
* [#397](https://github.com/xmake-io/xmake/issues/397): Add clib package manager support
* [#404](https://github.com/xmake-io/xmake/issues/404): Support Qt for android and deploy android apk
* Add some qt empty project templates, e.g. `widgetapp_qt`, `quickapp_qt_static` and `widgetapp_qt_static`
* [#415](https://github.com/xmake-io/xmake/issues/415): Add `--cu-cxx` config arguments to `nvcc/-ccbin`
* Add `--ndk_stdcxx=y` and `--ndk_cxxstl=gnustl_static` argument options for android NDK

### Changes

* Improve remote package manager
* Improve `target:on_xxx` scripts to support to match `android|armv7-a@macosx,linux|x86_64` pattern
* Improve loadfile to optimize startup speed, decrease 98% time

### Bugs fixed

* [#400](https://github.com/xmake-io/xmake/issues/400): fix c++ languages bug for qt rules

