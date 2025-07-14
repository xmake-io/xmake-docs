---
title: xmake v2.1.2 released, Improve vs201x project generator
tags: [xmake, lua, version, golang, rust, dlang]
date: 2017-03-23
author: Ruki
---

## Links

* [Homepage](http://www.xmake.io/)
* [Documents](http://www.xmake.io/#home)

### New features

* Add aur package script and support to install xmake from yaourt
* Add [set_basename](#https://xmake.io/#/manual#targetset_basename) api for target

### Changes

* Support vs2017
* Support compile rust for android
* Improve vs201x project plugin and support multi-modes compilation.

### Bugs fixed

* Fix cannot find android sdk header files
* Fix checking option bug
* [#57](https://github.com/xmake-io/xmake/issues/57): Fix code files mode to 0644

### Demo

[![build_demo](/assets/img/posts/xmake/build_demo.gif)](https://github.com/xmake-io/xmake)





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
