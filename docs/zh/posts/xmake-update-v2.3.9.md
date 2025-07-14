---
title: xmake v2.3.9 发布, 新增独立 Xrepo C/C++ 包管理器
tags: [xmake, lua, C/C++, toolchains, xrepo, packages, vcpkg, conan]
date: 2020-11-24
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具，使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

在这个新版本中，我们重点改进了 xmake 的依赖包管理，新增了 Archlinux 和 MSYS2/Mingw 下 的 pacman 包管理器支持，另外我们进一步丰富了 xmake 的官方包仓库 [xmake-repo](https://github.com/xmake-io/xmake-repo)，新增了 50 多个常用的 C/C++ 包。

此外，我们新增了一个基于 xmake 的独立子命令：[xrepo](https://github.com/xmake-io/xrepo/)，一个完整独立的跨平台 C/C++ 包管理器，便于用户更加方便的管理日常 C/C++ 包的安装和集成使用。

同时，我们还上线了 xrepo 的相关站点 [xrepo.xmake.io](https://xrepo.xmake.io)，我们可以在上面快速查看 xrepo 的使用方式，以及 xmake-repo 官方仓库中每个包的支持情况和使用方式。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](/zh/about/course)
* [Xrepo 命令](https://github.com/xmake-io/xrepo)

## 入门课程

近期，我们也上线了官方的 xmake 入门课程，[Xmake 带你轻松构建 C/C++ 项目](/zh/about/course) 以边学边做实验的方式快速学习 xmake 的使用。

## 新特性介绍

### Xrepo 包管理器

xrepo 是一个基于 [Xmake](https://github.com/xmake-io/xmake) 的跨平台 C/C++ 包管理器。

它基于 xmake 提供的运行时，但却是一个完整独立的包管理程序，相比 vcpkg/homebrew 此类包管理器，xrepo 能够同时提供更多平台和架构的 C/C++ 包。

并且还支持多版本语义选择，另外它还是一个去中心化的分布式仓库，不仅仅提供了官方的 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库，还支持用户自建多个私有仓库。

同时，xrepo 也支持从 vcpkg/homebrew/conan 等第三方包管理器中安装包，并提供统一一致的库链接信息，方便与第三方项目的集成对接。

如果你想要了解更多，请参考：[在线文档](https://xrepo.xmake.io/#/zh-cn/getting_started), [Github](https://github.com/xmake-io/xrepo) 以及 [Gitee](https://gitee.com/tboox/xrepo)

![](https://xrepo.xmake.io/assets/img/xrepo.gif)






#### 安装

我们只需要安装上 xmake 就可以使用 xrepo 命令，关于 xmake 的安装，我们可以看下：[xmake 安装文档](/zh/guide/installation)。

#### 支持平台

* Windows (x86, x64)
* macOS (i386, x86_64, arm64)
* Linux (i386, x86_64, cross-toolchains ..)
* *BSD (i386, x86_64)
* Android (x86, x86_64, armeabi, armeabi-v7a, arm64-v8a)
* iOS (armv7, armv7s, arm64, i386, x86_64)
* MSYS (i386, x86_64)
* MinGW (i386, x86_64, arm, arm64)
* Cross Toolchains

#### 支持的包管理仓库

* 官方自建仓库 [xmake-repo](https://github.com/xmake-io/xmake-repo) (tbox >1.6.1)
* [用户自建仓库](/zh/guide/package-management/package-distribution)
* Conan (conan::openssl/1.1.1g)
* Vcpkg (vcpkg:ffmpeg)
* Homebrew/Linuxbrew (brew::pcre2/libpcre2-8)
* Pacman on archlinux/msys2 (pacman::libcurl)
* Clib (clib::clibs/bytes@0.0.4)
* Dub (dub::log 0.4.3)

#### 分布式仓库支持

除了可以直接从官方仓库：[xmake-repo](https://github.com/xmake-io/xmake-repo) 检索安装包之外，
我们还可以添加任意多个自建的仓库，甚至可以完全隔离外网，仅仅在公司内部网络维护私有包的安装集成。

只需要通过下面的命令，添加上自己的仓库地址：

```console
$ xrepo add-repo myrepo https://github.com/mygroup/myrepo
```

#### 独立安装 C/C++ 包

各种安装方式一应俱全，支持语义版本、调试包、动态库、可配置参数，也支持各种第三方包管理中的 C/C++ 包安装。

```console
$ xrepo install zlib tbox
$ xrepo install "zlib 1.2.x"
$ xrepo install "zlib >=1.2.0"
$ xrepo install -p iphoneos -a arm64 zlib
$ xrepo install -p android [--ndk=/xxx] zlib
$ xrepo install -p mingw [--mingw=/xxx] zlib
$ xrepo install -p cross --sdk=/xxx/arm-linux-musleabi-cross zlib
$ xrepo install -m debug zlib
$ xrepo install -k shared zlib
$ xrepo install -f "vs_runtime=MD" zlib
$ xrepo install -f "regex=true,thread=true" boost
$ xrepo install brew::zlib
$ xrepo install vcpkg::zlib
$ xrepo install conan::zlib/1.2.11
$ xrepo install pacman:libpng
$ xrepo install dub:log
```

#### 与 xmake 的工程无缝集成

```lua
add_requires("tbox >1.6.1", "libuv master", "vcpkg::ffmpeg", "brew::pcre2/libpcre2-8")
add_requires("conan::openssl/1.1.1g", {alias = "openssl", optional = true, debug = true})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libuv", "vcpkg::ffmpeg", "brew::pcre2/libpcre2-8", "openssl")
```

下面是与 xmake 集成的整体架构和编译流程。

<img src="/assets/img/index/package_arch.png" width="650px" />


更多关于 xrepo 的使用方式，请参考文档：[Xrepo 快速上手](https://xrepo.xmake.io/#/zh-cn/getting_started)。


### 支持安装交叉编译的依赖包

新版本中，我们改进了 xmake 内部的依赖包安装机制，增加了对交叉编译工具链的 C/C++ 依赖包安装支持，例如：

```lua
add_requires("zlib", "openssl")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "openssl")
```

我们上面配置了两个依赖包：zlib, openssl，然后我们切到交叉编译环境，使用 musl.cc 上的编译工具链进行编译。

```console
$ xmake f -p cross --sdk=/tmp/arm-linux-musleabi-cross
in xmake-repo:
  -> openssl 1.1.1h
please input: y (y/n)

  => http://zlib.net/zlib-1.2.11.tar.gz .. ok
  => download https://github.com/openssl/openssl/archive/OpenSSL_1_1_1h.zip .. ok
  => installing zlib .. ok
  => installing openssl .. ok
$ xmake
[ 50%]: ccache compiling.release src/main.cpp
[ 75%]: linking.release test
[100%]: build ok!
```

xmake 就会自动拉取 zlib/openssl 源码包，然后使用 `arm-linux-musleabi-cross` 交叉工具链编译安装 zlib 和 openssl，安装完成后，自动集成到 test 工程参与链接直到完全编译通过。

当然，要让 C/C++ 支持交叉编译，首先需要维护 xmake-repo 官方仓库，增加对交叉编译的支持。目前仓库中支持交叉的 C/C++ 包还不是很多，但也已经收录了不少了，后期还会不断扩充。

如果要看哪些包支持交叉编译，可以直接到包仓库站点查看：[支持交叉编译的C/C++包列表](https://xrepo.xmake.io/#/packages/cross)

我们也可以使用新版本中提供的 xrepo 命令，直接检索指定平台支持的包（支持模糊查询）：

```console
$ xrepo search -p cross zli*
```

我们也欢迎大家帮忙贡献更多的包进入 [xmake-repo](https://github.com/xmake-io/xmake-repo) 官方仓库，一起完善 C/C++ 包管理生态的建设，使用户能够更加方便的使用各种依赖包，不再为各种繁琐的移植工作所困扰。


### 依赖包的 license 检测机制

考虑到仓库中包各自的 license 不同，有些包也许使用后会跟用户项目的 license 冲突，因此 xmake 在新版本中增加了包依赖 license 兼容性检测机制。

并且新增了 `set_license` 接口，可以让用户设置每个 target 的 license 。

例如，我们集成了一个 LGPL-2.0 的包 libplist 库，但是自身项目没有任何 license 设置。

```lua
add_requires("libplist") -- LGPL-2.0
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("libplist")
```

编译的时候，就会有下面的提示，警告用户使用 libplist 有可能代码 license 冲突风险。

```bash
$ xmake
warning: target(test) maybe is not compatible with license(LGPL-2.1) of package(libplist),
we can use shared libraries with LGPL-2.1 or use set_license()/set_policy() to modify/disable license!
```

而如果我们把项目显式通过 `set_license("LGPL-2.0")`，确保完全兼容，就不会再有警告信息，同样对于 `GPL` 相关的 license，xmake也会有对应的检测。

而相对比较宽松的 MIT, BSD 等 license 的包，直接集成使用，是不会有任何警告的。

另外，如果我们显式设置的 `set_license()` 和包的 license 冲突，我们也会提示警告。

### Pacman 包源支持

之前的版本，xmake 已经支持自动集成 vcpkg, conan, clib, homebrew 等第三方仓库包源，而新版本中，我们新增加了对 pacman 管理的包进行集成支持。

我们既支持 archlinux 上的 pacman 包安装和集成，也支持 msys2 上 pacman 的 mingw `x86_64`/`i386` 包安装和集成。

```lua
add_requires("pacman::zlib", {alias = "zlib"})
add_requires("pacman::libpng", {alias = "libpng"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "libpng")
```

archlinux 上只需要：

```console
xmake
```

msys2 上安装 mingw 包，需要指定到 mingw 平台：

```console
xmake f -p mingw -a [x86_64|i386]
xmake
```

### 强制安装任意版本的包

由于 xmake-repo 仓库中的包，有严格的 版本列表以及对应的 sha256 值用于下载的完整性校验，这会保证包下载的可靠性和完整性。

但是，也导致没法完全收录一个包的所有版本，如果有需要的版本还没被收录，一种方式就是用户自己提 pr 进 xmake-repo 仓库来增加支持对应版本。

还有一种方式，就是用户在 xmake.lua 配置 `{verify = false}` 强制跳过校验机制，这样就能够选择下载任意版本的包了。

```lua
add_requires("libcurl 7.73.0", {verify = false})
```


### vcpkg 包集成改进

关于 vcpkg 包的依赖集成，新版本里面也做了不少的改进，不仅增加了对 windows-static-md 包的切换支持，另外我们还改进了 vcpkg 命令的自动探测机制，使得在更多的场景能够自动检测到它，而不是需要手动配置。


### 自定义交叉工具链改进

新版本中，我们继续对自定义工具链做了改进，使得自动检测更加的智能化，通常只需要指定 sdkdir，xmake就可以自动检测其他的配置，比如 cross 等信息，例如:

```lua
toolchain("my_toolchain")
    set_kind("standalone")
    set_sdkdir("/tmp/arm-linux-musleabi-cross")
toolchain_end()

target("hello")
    set_kind("binary")
    add_files("apps/hello/*.c")
```

这是一个最精简的交叉工具链配置，仅仅设置了对应的sdk路径，然后通过 `set_kind("standalone")` 将其标记为完整独立的工具链。

这个时候，我们就可以通过命令行 `--toolchain=my_toolchain` 去手动切换到此工具链来使用。

```console
xmake f --toolchain=my_toolchain
xmake
```

另外，我们还可以直接在 xmake.lua 中通过 `set_toolchains` 将其绑定到对应的 target 上去，那么仅仅只在编译此 target 时候，才会切换到我们自定义的工具链。


```lua
toolchain("my_toolchain")
    set_kind("standalone")
    set_sdkdir("/tmp/arm-linux-musleabi-cross")
toolchain_end()

target("hello")
    set_kind("binary")
    add_files("apps/hello/*.c")
    set_toolchains("my_toolchain")
```

这样，我们不再需要手动切换工具链了，只需要执行 xmake，就会默认自动切换到 my_toolchain 工具链。

这对于嵌入式开发来讲尤其有用，因为嵌入式平台的交叉编译工具链非常多，我们经常需要各种切换来完成不同平台的编译。

因此，我们可以将所有的工具链定义放置到独立的 lua 文件中去定义，例如：

```
projectdir
    - xmake.lua
    - toolchains
      - my_toolchain1.lua
      - my_toolchain2.lua
      - ...
```

然后，我们只需要再 xmake.lua 中通过 includes 去引入它们，并根据不同的自定义平台，绑定不同的工具链：

```lua
includes("toolchains/*.lua")
target("hello")
    set_kind("binary")
    add_files("apps/hello/*.c")
    if is_plat("myplat1") then
        set_toolchains("my_toolchain1")
    elseif is_plat("myplat2") then
        set_toolchains("my_toolchain2")
    end
```

这样，我们就可以编译的时候，直接快速切换指定平台，来自动切换对应的工具链了。

```console
xmake f -p myplat1
xmake
```

如果，有些交叉编译工具链结构复杂，自动检测还不足够，那么可以根据实际情况，使用 `set_toolset`, `set_cross` 和 `set_bindir` 等接口，针对性的配置上其他的设置。

例如下面的例子，我们还额外添加了一些 cxflags/ldflags 以及内置的系统库 links。

```lua
toolchain("my_toolchain")
    set_kind("standalone")
    set_sdkdir("/tmp/arm-linux-musleabi-cross")
    on_load(function (toolchain)
        -- add flags for arch
        if toolchain:is_arch("arm") then
            toolchain:add("cxflags", "-march=armv7-a", "-msoft-float", {force = true})
            toolchain:add("ldflags", "-march=armv7-a", "-msoft-float", {force = true})
        end
        toolchain:add("ldflags", "--static", {force = true})
        toolchain:add("syslinks", "gcc", "c")
    end)
```

更多自定义工具链的例子，可以到 xmake 的源码的目录参考内置的工具链定义：[内部工具链列表](https://github.com/xmake-io/xmake/blob/master/xmake/toolchains/)

### 菜单配置支持鼠标操作

还记得 xmake 还有提供终端图形化的菜单配置么？就是类似 linux kernel 的经典 menu config 图形化配置界面。

```bash
xmake f --menu
```

新版本中，我们也对它做了进一步的改进，增加的跨平台的鼠标操作，我们可以用鼠标来进行各种配置项的点击和选择操作，更加的方便。

<img src="/assets/img/index/menuconf.png" width="650px" />

## 更新内容

### 新特性

* 添加新的 [xrepo](https://github.com/xmake-io/xrepo) 命令去管理安装 C/C++ 包
* 支持安装交叉编译的依赖包
* 新增musl.cc上的工具链支持
* [#1009](https://github.com/xmake-io/xmake/issues/1009): 支持忽略校验去安装任意版本的包，`add_requires("libcurl 7.73.0", {verify = false})`
* [#1016](https://github.com/xmake-io/xmake/issues/1016): 针对依赖包增加license兼容性检测
* [#1017](https://github.com/xmake-io/xmake/issues/1017): 支持外部/系统头文件支持 `add_sysincludedirs`，依赖包默认使用`-isystem`
* [#1020](https://github.com/xmake-io/xmake/issues/1020): 支持在 archlinux 和 msys2 上查找安装 pacman 包
* 改进 `xmake f --menu` 菜单配置，支持鼠标操作

### 改进

* [#997](https://github.com/xmake-io/xmake/issues/997): `xmake project -k cmake` 插件增加对 `set_languages` 的支持
* [#998](https://github.com/xmake-io/xmake/issues/998): 支持安装 windows-static-md 类型的 vcpkg 包
* [#996](https://github.com/xmake-io/xmake/issues/996): 改进 vcpkg 目录查找
* [#1008](https://github.com/xmake-io/xmake/issues/1008): 改进交叉编译工具链
* [#1030](https://github.com/xmake-io/xmake/issues/1030): 改进 xcode.framework and xcode.application 规则
* [#1051](https://github.com/xmake-io/xmake/issues/1051): 为 msvc 编译器添加 `edit` 和 `embed` 调试信息格式类型到 `set_symbols()`
* [#1062](https://github.com/xmake-io/xmake/issues/1062): 改进 `xmake project -k vs` 插件
