---
layout: default.cn
title: {{ site.name }}
---

## 安装

#### 使用curl

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh)
```

#### 使用wget

```bash
bash <(wget https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh -O -)
```

#### 使用powershell

```bash
Invoke-Expression (Invoke-Webrequest 'https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.ps1' -UseBasicParsing).Content
```

## 简单的工程描述

<img src="/assets/img/index/showcode1.png" width="40%" />

## 包依赖描述

<img src="/assets/img/index/add_require.png" width="70%" />

官方的xmake包管理仓库: [xmake-repo](https://github.com/tboox/xmake-repo)

## 构建工程

```bash
$ xmake
```

## 运行目标

```bash
$ xmake run console
```

## 调试程序

```bash
$ xmake run -d console
```

## 配置平台

```bash
$ xmake f -p [windows|linux|macosx|android|iphoneos ..] -a [x86|arm64 ..] -m [debug|release]
$ xmake
```

## 图形化菜单配置

```bash
$ xmake f --menu
```

<img src="/assets/img/index/menuconf.png" width="80%" />

## 包依赖管理

<img src="/assets/img/index/package_manage.png" width="80%" />

## 支持平台

* Windows (x86, x64)
* Macosx (i386, x86_64)
* Linux (i386, x86_64, cross-toolchains ...)
* Android (armv5te, armv6, armv7-a, armv8-a, arm64-v8a)
* iPhoneOS (armv7, armv7s, arm64, i386, x86_64)
* WatchOS (armv7k, i386)
* Mingw (i386, x86_64)

## 支持语言

* C/C++
* Objc/Objc++
* Swift
* Assembly
* Golang
* Rust
* Dlang
* Cuda

## 工程类型

* 静态库程序
* 动态库类型
* 控制台程序
* Cuda程序
* Qt应用程序
* WDK驱动程序
* WinSDK应用程序

## 内置插件

#### 宏记录脚本和回放插件

```bash
$ xmake m -b                        # 开始记录
$ xmake f -p iphoneos -m debug
$ xmake 
$ xmake f -p android --ndk=~/files/android-ndk-r16b
$ xmake
$ xmake m -e                        # 结束记录
$ xmake m .                         # 回放命令
```

#### 加载自定义lua脚本插件

```bash
$ xmake l ./test.lua
$ xmake l -c "print('hello xmake!')"
$ xmake l lib.detect.find_tool gcc
```

#### 生成IDE工程文件插件（makefile, vs2002 - vs2017, ...）

```bash
$ xmake project -k vs2017 -m "debug,release"
```

#### 生成doxygen文档插件

```bash
$ xmake doxygen [srcdir]
```

## 更多插件

请到插件仓库进行下载安装: [xmake-plugins](https://github.com/tboox/xmake-plugins).

## IDE和编辑器插件

* [xmake-vscode](https://github.com/tboox/xmake-vscode)

<img src="https://raw.githubusercontent.com/tboox/xmake-vscode/master/res/problem.gif" width="60%" />

* [xmake-sublime](https://github.com/tboox/xmake-sublime)

<img src="https://raw.githubusercontent.com/tboox/xmake-sublime/master/res/problem.gif" width="60%" />

* [xmake-idea](https://github.com/tboox/xmake-idea)

<img src="https://raw.githubusercontent.com/tboox/xmake-idea/master/res/problem.gif" width="60%" />

* [xmake.vim](https://github.com/luzhlon/xmake.vim) (third-party, thanks [@luzhlon](https://github.com/luzhlon))

## 更多例子

Debug和Release模式：

```lua
add_rules("mode.debug", "mode.release")

target("console")
    set_kind("binary")
    add_files("src/*.c") 
    if is_plat("windows", "mingw") then
        add_defines("XXX")
    end
```

自定义脚本：

```lua
target("test")
    set_kind("static")
    add_files("src/*.cpp")
    after_build(function (target)
        print("build %s ok!", target:targetfile())
    end)
```

使用扩展模块：

```lua
target("test")
    set_kind("shared")
    add_files("src/*.c")
    on_load(function (target)
        import("lib.detect.find_package")
        target:add(find_package("zlib"))
    end)
```

## 项目例子

一些使用xmake的项目：

* [tbox](https://github.com/tboox/tbox)
* [gbox](https://github.com/tboox/gbox)
* [vm86](https://github.com/tboox/vm86)
* [更多](https://github.com/tboox/awesome-xmake)

## 演示视频

<a href="https://asciinema.org/a/133693">
<img src="https://asciinema.org/a/133693.png" width="60%" />
</a>

## 联系方式

* 邮箱：[waruqi@gmail.com](mailto:waruqi@gmail.com)
* 主页：[tboox.org](http://www.tboox.org/cn)
* 社区：[Reddit论坛](https://www.reddit.com/r/tboox/)
* 聊天：[Telegram群组](https://t.me/tbooxorg), [Gitter聊天室](https://gitter.im/tboox/tboox?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
* 源码：[Github](https://github.com/tboox/xmake), [Gitee](https://gitee.com/tboox/xmake)
* QQ群：343118190
* 微信公众号：tboox-os
 
