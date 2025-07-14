---
title: xmake v2.1.4 released, support REPL
tags: [xmake, lua, version]
date: 2017-05-10
author: Ruki
---

## Introduction

`xmake lua` has supported REPL(read-eval-print), we can write and test script more easily now.

Enter interactive mode:

```bash
$ xmake lua
> 1 + 2
3

> a = 1
> a
1

> for _, v in pairs({1, 2, 3}) do
>> print(v)
>> end
1
2
3
```






And we can `import` modules:

```bash
> task = import("core.project.task")
> task.run("hello")
hello xmake!
```

If you want to cancel multiline input, please input character `q`, for example:

```bash
> for _, v in ipairs({1, 2}) do
>> print(v)
>> q             <--  cancel multiline and clear previous input
> 1 + 2
3
```

## Links

* [Homepage](https://xmake.io/)
* [Documents](https://xmake.io/)

### New features

* [#68](https://github.com/xmake-io/xmake/issues/68): Add `$(programdir)` and `$(xmake)` builtin variables
* add `is_host` api to get current host operating system
* [#79](https://github.com/xmake-io/xmake/issues/79): Improve `xmake lua` to run interactive commands, read-eval-print (REPL)

### Changes

* Modify option menu color.
* [#71](https://github.com/xmake-io/xmake/issues/71): Improve to map optimization flags for cl.exe
* [#73](https://github.com/xmake-io/xmake/issues/73): Attempt to get executable path as xmake's program directory
* Improve the scope of `xmake.lua` in `add_subdirs` and use independent sub-scope to avoid dirty scope
* [#78](https://github.com/xmake-io/xmake/pull/78): Get terminal size in runtime and soft-wrap the help printing
* Avoid generate `.xmake` directory if be not in project

### Bugs fixed

* [#67](https://github.com/xmake-io/xmake/issues/67): Fix `sudo make install` permission problem
* [#70](https://github.com/xmake-io/xmake/issues/70): Fix check android compiler error
* Fix temporary file path conflict
* Fix `os.host` and `os.arch` interfaces
* Fix interpreter bug for loading root api
* [#77](https://github.com/xmake-io/xmake/pull/77): fix `cprint` no color reset eol








## Introduction 

xmake is a make-like build utility based on lua. 

The project focuses on making development and building easier and provides many features (.e.g package, install, plugin, macro, action, option, task ...), 
so that any developer can quickly pick it up and enjoy the productivity boost when developing and building project.

## Simple description

```lua
target("console")
    set_kind("binary")
    add_files("src/*.c") 
```

## Build project

```bash
$ xmake
```

## Run target

```bash
$ xmake run console
```

## Debug target

```bash
$ xmake run -d console
```

## Support features

* Tasks
* Macros
* Actions
* Options
* Plugins
* Templates

## Support platforms

* Windows (x86, x64, amd64, x86_amd64)
* Macosx (i386, x86_64)
* Linux (i386, x86_64, cross-toolchains ...)
* Android (armv5te, armv6, armv7-a, armv8-a, arm64-v8a)
* iPhoneOS (armv7, armv7s, arm64, i386, x86_64)
* WatchOS (armv7k, i386)
* Mingw (i386, x86_64)

## Support Languages

* C/C++
* Objc/Objc++
* Swift
* Assembly
* Golang
* Rust
* Dlang

## Builtin Plugins

* Macros script plugin
* Run the custom lua script plugin
* Generate IDE project file plugin（makefile, vs2002 - vs2017 .. ）
* Generate doxygen document plugin
* Convert .app to .ipa plugin

## Demo

[![build_demo](/assets/img/posts/xmake/build_demo.gif)](https://github.com/xmake-io/xmake)

