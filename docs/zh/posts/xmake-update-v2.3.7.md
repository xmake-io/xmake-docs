---
title: xmake v2.3.7 发布, 新增 tinyc 和 emscripten 工具链支持
tags: [xmake, lua, C/C++, toolchains, tinyc, emscripten, qt, cuda]
date: 2020-09-14
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具，使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

随着 xmake 最近几年不断的迭代发展，xmake 已经在 Github 收获 2.9K star，300+ fork，30+ 贡献者，并且处理了 900+ issues，5400+ Commits，活跃用户也在不断增长。

![](https://tboox.org/static/img/xmake/star-history.png)

现在，xmake v2.3.7 版本发布了，在新版本中，我们主要完善了 xmake 自身的稳定性和兼容性，通过两个月的不断迭代，修复了很多用户反馈的各种使用问题，使用体验和稳定性有了很大的提升。

另外，我们在这个版本中也新增对 TinyC 和 Emscripten (WebAssembly) 编译工具链的支持。

尤其是针对 windows 平台，我们提供了额外的 xmake-tinyc 安装包，里面内置了 tinyc 编译器，使得用户可以完全脱离臃肿的 vs 环境，一键安装，开箱即用，只需要 5M 的安装包即可开发简单的 C 程序，同时还自带了整套 winapi 头文件。

最后，我们还改进了 trybuild 模式编译，通过 xmake 可以快速编译 autotools/cmake 维护的第三方项目，并且可以快速对接 android/ios/mingw等交叉编译环境，实现快速移植编译。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

## 新特性介绍

### 更加多样的安装方式

新版本中，我们将 xmake 安装包提交到了 windows winget 以及 ubuntu ppa 仓库，我们可以更加方便快捷地安装 xmake。

#### Winget 安装

```bash
winget install xmake
```

#### Ubuntu PPA 安装

```bash
sudo add-apt-repository ppa:xmake-io/xmake
sudo apt update
sudo apt install xmake
```

当然，我们还支持很多其他的安装方式，对于其他平台的详细安装方式见：[安装文档](/zh/guide/installation)。

### 更加丰富的工具链支持

当前我们已经支持非常多的工具链环境，而在这个版本中，我们又新增了 TinyC 和 Emscripten (WebAssembly) 编译工具链的支持，我们可以通过下面的命令快速切换到对应的工具链来编译。

```bash
xmake f --toolchain=[tinyc|emscripten]
xmake
```

我们还在新版本中，额外提供了两个安装包，内置集成了 TinyC 编译环境，整个安装包只需要 5M，还包含了 winsdk api。

安装包可以在 xmake 的 github/releases 目录下找到。

* [xmake-tinyc-v2.3.7.win64.exe](https://github.com/xmake-io/xmake/releases/download/v2.3.7/xmake-tinyc-v2.3.7.win64.exe)
* [xmake-tinyc-v2.3.7.win32.exe](https://github.com/xmake-io/xmake/releases/download/v2.3.7/xmake-tinyc-v2.3.7.win32.exe)


通过这个安装包，我们编译开发 C 程序就可以完全摆脱臃肿的 vs 开发环境（好几个 G），实现一键安装，开箱即用，对于我们平常刷刷 leetcode，写点 C 测试代码还是非常有用的，没必要为此特定安装整个 vs 进来。

另外，如果我们要查看 xmake 支持的所有工具链，可以执行下面的命令，另外 `xmake f -p cross --sdk=/xxx` 的编译配置可以支持更多通用的交叉工具链。 


```bash
$ xmake show -l toolchains
xcode         Xcode IDE
vs            VisualStudio IDE
yasm          The Yasm Modular Assembler
clang         A C language family frontend for LLVM
go            Go Programming Language Compiler
dlang         D Programming Language Compiler
gfortran      GNU Fortran Programming Language Compiler
zig           Zig Programming Language Compiler
sdcc          Small Device C Compiler
cuda          CUDA Toolkit
ndk           Android NDK
rust          Rust Programming Language Compiler
llvm          A collection of modular and reusable compiler and toolchain technologies
cross         Common cross compilation toolchain
nasm          NASM Assembler
gcc           GNU Compiler Collection
mingw         Minimalist GNU for Windows
gnu-rm        GNU Arm Embedded Toolchain
envs          Environment variables toolchain
fasm          Flat Assembler
tinyc         Tiny C Compiler
emcc          A toolchain for compiling to asm.js and WebAssembly
```





### TryBuild 编译模式改进

所谓 trybuild 模式，就是 xmake 推出的一个适配现有第三方构建系统的特性，因为现在大部分已有的第三方项目都是用 autotools/cmake 等第三方构建系统维护的，如果将它们迁移到 xmake 配置那么迁移成本还是比较高的。

虽然 xmake 的配置编写非常简单上手，但也没必要对已经稳定维护的项目去大改构建系统，xmake 主要还是用于一些新项目的构建维护。

基于此背景，xmake 采用 trybuild 编译模式，也就是所谓的尝试编译模式，通过自动探测第三方项目的构建系统，如果检测到是 autotools 维护的项目，那么自动调用 `./configure; make` 来编译。

如果检测到是用 cmake 维护的项目，那么自动调用 cmake 来生成 makefile/build.ninja 来编译，对于使用 xmake 的用户而言，始终只是执行 xmake 这一个命令就可以完成编译，例如：

```bash
$ xmake
note: configure found, try building it or you can run `xmake f --trybuild=` to set buildsystem (pass -y or --confirm=y/n/d to skip confirm)?
please input: y (y/n)
y
  ...
  CC       src/pcre2grep-pcre2grep.o
  CC       src/libpcre2_8_la-pcre2_auto_possess.lo
  CC       src/libpcre2_8_la-pcre2_config.lo
  ...
build ok!
```

xmake检测到 autotools 构建系统后，就会提示用户是否需要尝试调用 autotools 来编译，输入y确认后，就可以直接完成编译，对于 cmake 的项目也是，只需要执行相同的 `xmake` 命令即可。 

而不需要关心 autotools/cmake 需要如何去配置使用和编译，毕竟 cmake 对于 windows 和 linux 平台，需要生成不同的构建文件，编译方式也是不同的，一会调用 make，一会调用 msbuild，看着就头大。

不仅如此，xmake 还对接了 `xmake -r` 来直接重新编译，对接 `xmake clean` 实现统一的文件清理，对接 `xmake -v` 实现统一的详细编译命令的查看。

#### TryBuild 的交叉编译支持

如果只是当前主机平台的编译，也许你们会说，这有啥，cmake 也有 `cmake --build .` 来直接编译，并不怎么麻烦么。

那么问题来了，交叉编译怎么搞？如果你们用过 autotools/cmake 去交叉编译生成 mingw/android/ios 的目标程序，cmake 和 autotools 还能够简单一致的处理么？

autotools 不多说，反正我是对它的交叉体验是深恶痛绝的，每次交叉编译移植一个带有 autotools 项目的代码，都要折腾半天，经常要包各种错误，研究各种配置参数的传递，不同平台的配置还不同。

而 cmake 我感觉用起来也不省事，比如对于 Android 平台得这样搞：

```bash
$ cmake \
    -DCMAKE_TOOLCHAIN_FILE=$NDK/build/cmake/android.toolchain.cmake \
    -DANDROID_ABI=$ABI \
    -DANDROID_NATIVE_API_LEVEL=$MINSDKVERSION \
    $OTHER_ARGS
```

而对于 ios 平台，没找到简答的配置方式，就找到个第三方的 ios 工具链配置，很复杂：https://github.com/leetal/ios-cmake/blob/master/ios.toolchain.cmake

对于 mingw 又是另外一种方式，我又折腾了半天环境，很是折腾。

那如果使用 xmake 去对接 cmake 实现交叉编译呢，只需要这样。

编译 android 程序：

```bash
xmake f -p android --trybuild=cmake --ndk=/xxx
xmake
```

编译 ios 程序：

```bash
xmake f -p iphoneos --trybuild=cmake
xmake
```

编译 mingw 程序：

```bash
xmake f -p mingw --trybuild=cmake --mingw=/sdk/xxx
xmake
```

我们只需要配置的时候，通过 `--trybuild=cmake` 启用 cmake 的尝试编译模式，然后通过 `-p android/iphoneos/mingw` 切到对应的平台，对接对应的sdk，就可以使用相同的方式来快速实现交叉编译，哪怕这个项目是使用 cmake 来维护的。

用户不需要关系如果使用 cmake 去传递不同工具链的配置，xmake 都帮你自动处理了，你只需要简单的执行 xmake 来编译，也可以执行 `xmake -r` 来重编，或者查看编译详情 `xmake -v`。

另外，还可以通过 `xmake f -p iphoneos -a arm64 --trybuild=cmake` 快速的切换编译架构。

最后，我们需要说明的是，虽然 trybuild 模式可以极大帮助用户节省编译和配置操作，但是如果条件运行，我们还是希望大家能够直接使用 xmake.lua 来维护自己的项目。

这样，就不需要走 trybuild 编译了，xmake 会更加完美的支持交叉编译，因为内部 xmake 会直接去编译项目，而不需要在调用 cmake、autotools 等工具了，例如：

```bash
xmake f -p iphoneos
xmake
```

或者

```bash
xmake f -p android --ndk=/xxx
xmake
```

可以看到，这回我们省去了 `--trybuild=cmake` 参数，因为不需要了，我们是直接编译的，这个时候 xmake 相当于独立的 make/ninja，并且完全不依赖 make，编译速度也可以完全媲美 ninja。

### 改进远程依赖包的集成

#### 交叉编译支持

xmake 不仅对 trybuild 支持了 mingw/autotools 的交叉编译支持，还对远程包仓库中使用 cmake/autotools 维护的第三方也支持上了交叉编译安装和集成。

例如：

```lua
add_requires("pcre2")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("pcre2")
```

然后通过切换到 iphoneos 平台，就可以快速集成安装 iphoneos 平台的 pcre2 包，然后编译链接它，哪怕这个 pcre2 包是通过 autotools/cmake 维护的。

```bash
xmake f -p iphoneos
xmake
```

#### 私有网络包仓库

这个版本中，我们对远程依赖包的集成也稍微做了一些改进，比如可以通过配置 `xmake g --network=private` 切到私有网络模式。

这个主要用于一些公司内部网络通过 xmake 自建的包管理仓库，实现封闭式的 C/C++ 依赖包集成，完全不会从 xmake 提供的官方仓库下来依赖包。

#### 递归导出安装的包

xmake 之前提供了一个命令，可以导出通过 xmake 安装的所有第三方依赖包。

```bash
xmake require --export
```

但是，之前的版本对应一些存在依赖的包，导出时候只会导出自身，它的所有依赖是不会被导出的，而这个版本中，我们对其进行了改进，将对应的所有依赖包也进行了导出。

### 改进对 Qt SDK 环境的支持

另外，这个版本我们还对 Qt SDK 的工具链环境进行了更好的支持，比如 ubuntu 系统下通过 apt 命令安装的 Qt SDK 工具链也进行了支持，而之前的版本只能支持从 Qt 官网下载安装的 Qt SDK 环境。

## 更新内容

### 新特性

* [#2941](https://github.com/microsoft/winget-pkgs/pull/2941): 支持通过 winget 来安装 xmake
* 添加 xmake-tinyc 安装包，内置tinyc编译器，支持windows上无msvc环境也可直接编译c代码
* 添加 tinyc 编译工具链
* 添加 emcc (emscripten) 编译工具链去编译 asm.js 和 WebAssembly
* [#947](https://github.com/xmake-io/xmake/issues/947): 通过 `xmake g --network=private` 配置设置私有网络模式，避免远程依赖包下载访问外网导致编译失败

### 改进

* [#907](https://github.com/xmake-io/xmake/issues/907): 改进msvc的链接器优化选项，生成更小的可执行程序
* 改进ubuntu下Qt环境的支持
* [#918](https://github.com/xmake-io/xmake/pull/918): 改进cuda11工具链的支持
* 改进Qt支持，对通过 ubuntu/apt 安装的Qt sdk也进行了探测支持，并且检测效率也优化了下
* 改进 CMake 工程文件生成器
* [#931](https://github.com/xmake-io/xmake/issues/931): 改进导出包，支持导出所有依赖包
* [#930](https://github.com/xmake-io/xmake/issues/930): 如果私有包定义没有版本定义，支持直接尝试下载包
* [#927](https://github.com/xmake-io/xmake/issues/927): 改进android ndk，支持arm/thumb指令模式切换
* 改进 trybuild/cmake 支持 Android/Mingw/iPhoneOS/WatchOS 工具链

### Bugs修复

* [#903](https://github.com/xmake-io/xmake/issues/903): 修复vcpkg包安装失败问题
* [#912](https://github.com/xmake-io/xmake/issues/912): 修复自定义工具链
* [#914](https://github.com/xmake-io/xmake/issues/914): 修复部分aarch64设备上运行lua出现bad light userdata pointer问题
