---
layout: default
title: {{ site.name }}
---

## Installation

#### via curl

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh)
```

#### via wget

```bash
bash <(wget https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh -O -)
```

#### via powershell

```bash
Invoke-Expression (Invoke-Webrequest 'https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.ps1' -UseBasicParsing).Content
```

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
* Modules
* Templates

## Support platforms

* Windows (x86, x64)
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

#### Macros script plugin

```bash
$ xmake m -b                        # start to record
$ xmake f -p iphoneos -m debug
$ xmake
$ xmake m -e                        # stop to record
$ xmake m .                         # playback commands
```

#### Run the custom lua script plugin

```bash
$ xmake l ./test.lua
$ xmake l -c "print('hello xmake!')"
$ xmake l lib.detect.find_tool gcc
```

#### Generate IDE project file plugin（makefile, vs2002 - vs2017 .. ）

```bash
$ xmake project -k vs2017 -m "debug,release"
```

#### Generate doxygen document plugin

```bash
$ xmake doxygen [srcdir]
```

## More Plugins

Please download and install from the plugins repository [xmake-plugins](https://github.com/tboox/xmake-plugins).

## IDE/Editor Integration

* [xmake-vscode](https://github.com/tboox/xmake-vscode)

<img src="https://raw.githubusercontent.com/tboox/xmake-vscode/master/res/problem.gif" width="60%" />

* [xmake-sublime](https://github.com/tboox/xmake-sublime)

<img src="https://raw.githubusercontent.com/tboox/xmake-sublime/master/res/problem.gif" width="60%" />

* [xmake-idea](https://github.com/tboox/xmake-idea)

<img src="https://raw.githubusercontent.com/tboox/xmake-idea/master/res/problem.gif" width="60%" />

* [xmake.vim](https://github.com/luzhlon/xmake.vim) (third-party, thanks [@luzhlon](https://github.com/luzhlon))

## More Examples

Debug and release modes:

```lua
if is_mode("debug") then
    set_symbols("debug")
    set_optimize("none")
end

if is_mode("release") then
    set_symbols("hidden")
    set_optimize("fastest")
    set_strip("all")
end

target("console")
    set_kind("binary")
    add_files("src/*.c") 
```

Custom script:

```lua
target("test")
    set_kind("static")
    add_files("src/*.cpp")
    after_build(function (target)
        print("build %s ok!", target:targetfile())
    end)
```

Extension Modules:

```lua
target("test")
    set_kind("shared")
    add_files("src/*.c")
    on_load(function (target)
        import("lib.detect.find_package")
        target:add(find_package("zlib"))
    end)
```

## Project Examples

Some projects using xmake:

* [tbox](https://github.com/tboox/tbox)
* [gbox](https://github.com/tboox/gbox)
* [vm86](https://github.com/tboox/vm86)
* [more](https://github.com/tboox/xmake/wiki/xmake-projects)

## Example Video

[![asciicast](https://asciinema.org/a/133693.png)](https://asciinema.org/a/133693)

## Contacts

* Email：[waruqi@gmail.com](mailto:waruqi@gmail.com)
* Homepage：[tboox.org](http://www.tboox.org)
* Community：[tboox@community](https://github.com/tboox/community/issues)
* ChatRoom：[![Join the chat at https://gitter.im/tboox/tboox](https://badges.gitter.im/tboox/tboox.svg)](https://gitter.im/tboox/tboox?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
* Source Code：[Github](https://github.com/tboox/xmake), [Gitee](https://gitee.com/tboox/xmake)
