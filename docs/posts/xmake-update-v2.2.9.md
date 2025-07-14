---
title: xmake v2.2.9 released, Add experimental support for c++ 20 modules
tags: [xmake, lua, C/C++, c++20, ts-modules]
date: 2019-12-21
author: Ruki
---

There are not many new features in this version. It mainly supports c++ 20 modules experimentally. Currently it supports the clang/msvc compiler. In addition, it improves a lot of user experience and improves some stability.

In addition, this version adds socket.io support and scheduling support for coroutine io to prepare for remote compilation of the next version and subsequent distributed compilation.

* [Project Source](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io/)

## Introduction of new features

### c++20 modules

c++ modules have been officially included in the c++20 draft, and msvc and clang have been basically implemented on [modules-ts](http://www.open-std.org/jtc1/sc22/wg21/docs/papers/2019 /p1103r3.pdf) Support, as c++20's footsteps are getting closer and closer to us, xmake has also begun to support c++modules in advance.

At present xmake has fully supported the implementation of the modules-ts of msvc/clang. For gcc, since its cxx-modules branch is still under development, it has not officially entered the master. I have read the changelog inside, and the related flags are still in the process. Constantly changing, I feel that it has not stabilized, so I have not supported it yet.

For more information about xmake's progress on c++modules: [https://github.com/xmake-io/xmake/pull/569](https://github.com/xmake-io/xmake/pull/569)

#### Hello Module

I will not talk about the introduction of c++modules. This is mainly about how to build a c++modules project under xmake. Let's look at a simple example:

```lua
target("hello")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

The above is a description of the xmake.lua that supports building c++modules files, where `hello.mpp` is the module file:

```c
#include <cstdio>
export module hello;
using namespace std;

export namespace hello {
    void say(const char* str) {
        printf("%s\n", str);
    }
}
```

Main.cpp is the main program that uses the hello module:

```c
import hello;

int main() {
    hello::say("hello module!");
    return 0;
}
```

Next we execute xmake to build this program:

```console
ruki:hello ruki$ xmake
[0%]: ccache compiling.release src/hello.mpp
[50%]: ccache compiling.release src/main.cpp
[100%]: linking.release hello
build ok!
```








xmake will handle all the details logic internally, for developers, just add the module file `*.mpp` as the source file.

#### Module Interface File

The above mentioned `*.mpp` is the module interface file name recommended by xmake. In fact, the default suffix names of the compiler files are not uniform. clang is `*.cppm`, while msvc is `*.ixx`, which is very unfriendly for writing a unified module project across compilers.
Therefore, reference is made to the recommendation method in [build2](https://build2.org/doc/modules-cppcon2017.pdf), and the unified `*.mpp` suffix is used to standardize the command of the module project interface under xmake.

Of course, this also supports xmake's recommended naming scheme. For suffixes such as `*.ixx` and `*.cppm`, xmake is also fully compatible and can be added directly to `add_files`.

#### Other examples

There are also a lot of engineering examples related to c++modules built into the xmake project. Interested students can refer to the following: [c++module examples](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c%2B%2B/modules)

### set_toolchain interface changes

The set_toolchain interface is mainly used to set different compilation toolchains for the target. Versions before 2.2.9 actually have two interfaces: add_tools and set_tools to handle the same thing, but the two interfaces are named and used in accordance with the specifications. It is very consistent, so some adjustments and changes have been made, and the new set_toolchain interface is used to better set up the toolchain.

For source files added by `add_files("*.c")`, by default, they will call the system's most suitable compilation tool to compile, or modify them manually by using the `xmake f --cc=clang` command, but these are all Globally affects all target targets.

If there are special requirements, you need to specify different compilers, linkers, or compilers of a specific version for a specific target under the current project. At this time, this interface can be used, for example:

```lua
target("test1")
    add_files("*.c")

target("test2")
    add_files("*.c")
    set_toolchain("cc", "$(projectdir)/tools/bin/clang-5.0")
```

The above description only makes special settings for the compiler of the test2 target, using a specific clang-5.0 compiler to compile test2, and test1 still uses the default settings.

For some compiler file names that are irregular and cause xmake to fail to recognize and process them as known compiler names, we can also add a tool name hint, for example:

`` `lua
set_toolchain("cc", "gcc@$(projectdir)/tools/bin/mipscc.exe")
`` `

The above description sets mipscc.exe as the C compiler, and prompts xmake to compile as a parameter passing method for gcc.

### socket io

This interface has been initially implemented, supports lua coroutine io scheduling, and achieves high concurrent io reading and writing (it will also support process and pipe scheduling support at the same time). It is currently mainly used for xmake itself and is used for subsequent To prepare for remote compilation and distributed compilation, users are not allowed to use it for the time being, but it will be released after subsequent improvements. Users can also make some service programs through socket io in their plugins.

However, there are not many scenarios that users may use. After all, xmake is only a build tool, and rarely allows users to do io communication by themselves.

## Changelog

### New features

* [#569](https://github.com/xmake-io/xmake/pull/569): Add c++ modules build rules
* Add `xmake project -k xmakefile` generator
* [620](https://github.com/xmake-io/xmake/issues/620): Add global `~/.xmakerc.lua` for all projects.
* [593](https://github.com/xmake-io/xmake/pull/593): Add `core.base.socket` module.

### Change

* [#563](https://github.com/xmake-io/xmake/pull/563): Separate build rules for specific language files from action/build 
* [#570](https://github.com/xmake-io/xmake/issues/570): Add `qt.widgetapp` and `qt.quickapp` rules
* [#576](https://github.com/xmake-io/xmake/issues/576): Uses `set_toolchain` instead of `add_tools` and `set_tools`
* Improve `xmake create` action
* [#589](https://github.com/xmake-io/xmake/issues/589): Improve the default build jobs number to optimize build speed
* [#598](https://github.com/xmake-io/xmake/issues/598): Improve find_package to support .tbd libraries on macOS
* [#615](https://github.com/xmake-io/xmake/issues/615): Support to install and use other archs and ios conan packages
* [#629](https://github.com/xmake-io/xmake/issues/629): Improve hash.uuid and implement uuid v4
* [#639](https://github.com/xmake-io/xmake/issues/639): Improve to parse argument options to support -jN

### Bugs fixed

* [#567](https://github.com/xmake-io/xmake/issues/567): Fix out of memory for serialize 
* [#566](https://github.com/xmake-io/xmake/issues/566): Fix link order problem with remote packages 
* [#565](https://github.com/xmake-io/xmake/issues/565): Fix run path for vcpkg packages
* [#597](https://github.com/xmake-io/xmake/issues/597): Fix run `xmake require` command too slowly
* [#634](https://github.com/xmake-io/xmake/issues/634): Fix mode.coverage rule and check flags
