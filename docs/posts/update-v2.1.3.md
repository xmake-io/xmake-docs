---
title: xmake v2.1.3 released, improve security and stability
tags: [xmake, lua, version]
date: 2017-04-02
author: Ruki
---

## Links

* [Homepage](http://www.xmake.io/)
* [Documents](http://www.xmake.io/#home)

This version provide safer `xmake install` and `xmake uninstall`.

![safer_installation](/assets/img/posts/xmake/safer_installation.png)

### New features

* [#65](https://github.com/xmake-io/xmake/pull/65): Add `set_default` api for target to modify default build and install behavior
* Allows to run `xmake` command in project subdirectories, it will find the project root directory automatically
* Add `add_rpathdirs` for target and option

### Changes

* [#61](https://github.com/xmake-io/xmake/pull/61): Provide safer `xmake install` and `xmake uninstall` task with administrator permission
* Provide `rpm`, `deb` and `osxpkg` install package
* [#63](https://github.com/xmake-io/xmake/pull/63): More safer build and install xmake
* [#61](https://github.com/xmake-io/xmake/pull/61): Check run command as root
* Improve check toolchains and implement delay checking
* Add user tips when scanning and generating `xmake.lua` automatically

## Bugs fixed

* Fix error tips for checking xmake min version
* [#60](https://github.com/xmake-io/xmake/issues/60): Fix self-build for macosx and windows
* [#64](https://github.com/xmake-io/xmake/issues/64): Fix compile android `armv8-a` error
* [#50](https://github.com/xmake-io/xmake/issues/50): Fix only position independent executables issue for android program








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

