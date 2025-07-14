---
title: xmake v2.3.1 发布, 无缝对接其他构建系统
tags: [xmake, lua, C/C++, autotools, cmake, ninja, mingw, msys]
date: 2020-02-23
author: Ruki
---

最近对xmake内部做了不少的重构来改进，并且新增了不少实用的新特性，欢迎来体验。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

一些新特性：

1. 一键编译其他构建系统维护的项目，实现无缝对接，并且支持交叉编译（比如autotools的快速交叉编译，见下文详述）
2. 新增`xmake project -k ninja`工程生成插件，支持对build.ninja构建系统文件的生成

一些改进点：

1. 改进命令行参数输入，支持*nix style的参数输入，感谢[@OpportunityLiu](https://github.com/OpportunityLiu)的贡献
2. 改进tab命令补全，增加对参数values的命令补全支持
3. 优化get.sh安装和xmake update更新脚本，添加国内镜像源，加速下载和安装更新
4. gcc/clang编译错误输出支持原生色彩高亮支持
5. 新增msys/cygwin平台，并且xmake源码也支持msys/mingw平台编译

一些看不见的改进点：

1. 添加socket, pipe模块，改进process模块
2. 重构整个进程调度器，更好的调度并行构建
3. 重构改进整个coroutine协程模块，支持对socket/pipe/process三者的同时调度支持（为后续远程编译和分布式编译做准备）

还有一些零散的bug修复，见下文更新内容。

## 新特性介绍

### 生成build.ninja构建文件

xmake现已支持对ninja构建文件的生成，让用户可以使用ninja来快速构建xmake维护的项目。不得不承认，目前就构建速度来讲，ninja确实比xmake快不少，后续版本我会尝试优化下xmake的构建速度。

```bash
$ xmake project -k ninja
```

然后调用ninja来构建：

```bash
$ ninja
```

或者直接使用xmake命令来调用ninja构建，见下文。

### 尝试使用其他构建系统构建

xmake v2.3.1以上版本直接对接了其他第三方构建系统，即使其他项目中没有使用xmake.lua来维护，xmake也可以直接调用其他构建工具来完成编译。

那用户直接调用使用第三方构建工具来编译不就行了，为啥还要用xmake去调用呢？主要有以下好处：

1. 完全的行为一致，简化编译流程，不管用了哪个其他构建系统，都只需要执行xmake这个命令就可以编译，用户不再需要去研究其他工具的不同的编译流程
2. 完全对接`xmake config`的配置环境，复用xmake的平台探测和sdk环境检测，简化平台配置
3. 对接交叉编译环境，即使是用autotools维护的项目，也能通过xmake快速实现交叉编译

目前已支持的构建系统：

* autotools（已完全对接xmake的交叉编译环境）
* xcodebuild
* cmake
* make
* msbuild
* scons
* meson
* bazel
* ndkbuild
* ninja

#### 自动探测构建系统并编译

例如，对于一个使用cmake维护的项目，直接在项目根目录执行xmake，就会自动触发探测机制，检测到CMakeLists.txt，然后提示用户是否需要使用cmake来继续完成编译。

```bash
$ xmake 
note: CMakeLists.txt found, try building it (pass -y or --confirm=y/n/d to skip confirm)?
please input: y (y/n)
-- Symbol prefix:
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/ruki/Downloads/libpng-1.6.35/build
[  7%] Built target png-fix-itxt
[ 21%] Built target genfiles
[ 81%] Built target png
[ 83%] Built target png_static
...
output to /Users/ruki/Downloads/libpng-1.6.35/build/artifacts
build ok!
```






#### 无缝对接xmake命令

目前支持`xmake clean`, `xmake --rebuild`和`xmake config`等常用命令与第三方系统的无缝对接。

我们可以直接清理cmake维护项目的编译输出文件

```bash
$ xmake clean
$ xmake clean --all
```

如果带上`--all`执行清理，会清除autotools/cmake生成的所有文件，不仅仅只清理对象文件。

默认`xmake`对接的是增量构建行为，不过我们也可以强制快速重建：

```bash
$ xmake --rebuild
```

#### 手动切换指定构建系统

如果一个项目下有多个构建系统同时在维护，比如libpng项目，自带autotools/cmake/makefile等构建系统维护，xmake默认优先探测使用了autotools，如果想要强制切换其他构建系统，可以执行：

```bash
$ xmake f --trybuild=[autotools|cmake|make|msbuild| ..]
$ xmake
```

另外，配置了`--trybuild=`参数手动指定了默认的构建系统，后续的build过程就不会额外提示用户选择了。

#### 实现快速交叉编译

众所周知，autotools维护的项目虽然很多都支持交叉编译，但是交叉编译的配置过程很复杂，不同的工具链处理方式还有很多的差异，中途会踩到很多的坑。

即使跑通了一个工具链的交叉编译，如果切到另外一个工具链环境，可能又要折腾好久，而如果使用xmake，通常只需要两条简单的命令即可：

!> 目前就autotools对接支持了xmake的交叉编译，后期还会对cmake等其他构建系统加上支持。

##### 交叉编译android平台

```bash
$ xmake f -p android --trybuild=autotools [--ndk=xxx]
$ xmake
```

!> 其中，--ndk参数配置是可选的，如果用户设置了ANDROID_NDK_HOME环境变量，或者ndk放置在~/Library/Android/sdk/ndk-bundle，xmake都能自动检测到。

是不是很简单？如果你觉得这没啥，那么可以对比下直接操作`./configure`去配置交叉编译，可以看下这篇文档对比下：[将NDK 与其他编译系统配合使用](https://developer.android.com/ndk/guides/other_build_systems#autoconf)

说白了，你大概得这样，还不一定一次就能搞定：

```bash
$ export TOOLCHAIN=$NDK/toolchains/llvm/prebuilt/$HOST_TAG
$ export AR=$TOOLCHAIN/bin/aarch64-linux-android-ar
$ export AS=$TOOLCHAIN/bin/aarch64-linux-android-as
$ export CC=$TOOLCHAIN/bin/aarch64-linux-android21-clang
$ export CXX=$TOOLCHAIN/bin/aarch64-linux-android21-clang++
$ export LD=$TOOLCHAIN/bin/aarch64-linux-android-ld
$ export RANLIB=$TOOLCHAIN/bin/aarch64-linux-android-ranlib
$ export STRIP=$TOOLCHAIN/bin/aarch64-linux-android-strip
$ ./configure --host aarch64-linux-android
$ make
```

##### 交叉编译iphoneos平台

```bash
$ xmake f -p iphoneos --trybuild=autotools
$ xmake
```

##### 交叉编译mingw平台

```bash
$ xmake f -p mingw --trybuild=autotools [--mingw=xxx]
$ xmake
```

##### 使用其他交叉编译工具链

```bash
$ xmake f -p cross --trybuild=autotools --sdk=/xxxx
$ xmake
```

关于更多交叉编译的配置细节，请参考文档：[交叉编译](/zh/guide/configuration#%e4%ba%a4%e5%8f%89%e7%bc%96%e8%af%91)，除了多了一个`--trybuild=`参数，其他交叉编译配置参数都是完全通用的。

#### 传递用户配置参数

我们可以通过`--tryconfigs=`来传递用户额外的配置参数到对应的第三方构建系统，比如：autotools会传递给`./configure`，cmake会传递给`cmake`命令。

```bash
$ xmake f --trybuild=autotools --tryconfigs="--enable-shared=no"
$ xmake
```

比如上述命令，传递`--enable-shared=no`给`./configure`，来禁用动态库编译。

另外，对于`--cflags`, `--includedirs`和`--ldflags`等参数，不需要通过`--tryconfigs`，通过`xmake config --cflags=`等内置参数就可透传过去。

#### 编译其他构建系统过程示例

##### 通用编译方式

大多数情况下，每个构建系统对接后的编译方式都是一致的，除了`--trybuild=`配置参数除外。

```bash
$ xmake f --trybuild=[autotools|cmake|meson|ninja|bazel|make|msbuild|xcodebuild]
$ xmake
```

!> 我们还需要确保--trybuild指定的构建工具已经安装能够正常使用。

##### 构建Android jni程序

如果当前项目下存在`jni/Android.mk`，那么xmake可以直接调用ndk-build来构建jni库。

```bash
$ xmake f -p android --trybuild=ndkbuild [--ndk=]
$ xmake
```

### *nix style命令参数输入

目前的输入规范参考自：[https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html)

也非常感谢[@OpportunityLiu](https://github.com/OpportunityLiu)的贡献，现在的输入方式，可以支持采用如下写法：

```bash
$ xmake -j8 -rvD
```

之前只能这么写：

```bash
$ xmake -j 8 -r -v -D
```

### tab命令自动补全

之前的版本，只能对参数名进行补全，现在可以对参数值进行补全和值列表提示，比如敲如下命令后：

```bash
$ xmake f --plat=and
```

按tab键就可以补全platform参数，变成

```bash
$ xmake f --plat=android
```

### 强制将c代码作为c++编译

xmake新增一个配置参数，可以指定源文件的类型，强制作为对应的源文件来编译，比如将c代码作为c++来编译。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c", {sourcekind = "cxx"})
```

## 更新内容

### 新特性

* [#675](https://github.com/xmake-io/xmake/issues/675): 支持通过设置强制将`*.c`作为c++代码编译, `add_files("*.c", {sourcekind = "cxx"})`。
* [#681](https://github.com/xmake-io/xmake/issues/681): 支持在msys/cygwin上编译xmake，以及添加msys/cygwin编译平台
* 添加socket/pipe模块，并且支持在协程中同时调度process/socket/pipe
* [#192](https://github.com/xmake-io/xmake/issues/192): 尝试构建带有第三方构建系统的项目，还支持autotools项目的交叉编译
* 启用gcc/clang的编译错误色彩高亮输出
* [#588](https://github.com/xmake-io/xmake/issues/588): 改进工程生成插件`xmake project -k ninja`，增加对build.ninja生成支持

### 改进

* [#665](https://github.com/xmake-io/xmake/issues/665): 支持 *nix style 的参数输入，感谢[@OpportunityLiu](https://github.com/OpportunityLiu)的贡献
* [#673](https://github.com/xmake-io/xmake/pull/673): 改进tab命令补全，增加对参数values的补全支持
* [#680](https://github.com/xmake-io/xmake/issues/680): 优化get.sh安装脚本，添加国内镜像源，加速下载
* 改进process调度器
* [#651](https://github.com/xmake-io/xmake/issues/651): 改进os/io模块系统操作错误提示

### Bugs修复

* 修复增量编译检测依赖文件的一些问题
* 修复log输出导致xmake-vscode插件解析编译错误信息失败问题
* [#684](https://github.com/xmake-io/xmake/issues/684): 修复windows下android ndk的一些linker错误