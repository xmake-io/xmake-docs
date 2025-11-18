---
title: xmake v2.6.2 发布，新增 Linux 内核驱动模块构建支持
tags: [xmake, lua, C/C++, Linux, Driver]
date: 2021-12-17
author: Ruki
outline: deep
---

## 新版本改动

这个版本主要新增两大特性：

1. Linux 内核驱动模块的构建支持
2. 分组构建和批量运行支持，可用于实现 `Run all tests` 功能

剩下的主要是一些零散的功能改进和 Bugs 修复，可以看下文末的更新内容明细，一些比较大的改动，下面也会逐一说明。

## 新特性介绍

### 构建 Linux 内核驱动模块

Xmake 也许是首个提供 Linux 内核驱动开发 内置支持的第三方构建工具了。

尽管网上也有介绍 CMake 如何去配置构建 linux 驱动，但是大都是通过 `add_custom_command` 方式自定义各种命令，然后执行 `echo` 去自己拼接生成 Linux 的 Makefile 文件。

也就是说，其实还是依赖 Linux 内核源码的 Makefile 来执行的构建，因此如果想自己追加一些编译配置和宏定义都会非常麻烦。

而使用 Xmake，我们可以提供更加灵活的可配置性，更加简单的配置文件，以及一键编译、自动依赖拉取集成、Linux kernel 源码自动下载集成，内核驱动交叉编译等特性。

#### Hello World

我们通过一个最简单的字符驱动来直观感受下。

首先，我们准备一个 Hello World 驱动代码，例如：

```lua
add_requires("linux-headers", {configs = {driver_modules = true}})

target("hello")
    add_rules("platform.linux.driver")
    add_files("src/*.c")
    add_packages("linux-headers")
    set_license("GPL-2.0")
```

它的配置非常简单，只需要配置上支持模块的 linux-headers 包，然后应用 `platform.linux.driver` 构建规则就行了。

然后直接执行 xmake 命令，一键编译，生成内核驱动模块 hello.ko。

```console
$ xmake
[ 20%]: ccache compiling.release src/add.c
[ 20%]: ccache compiling.release src/hello.c
[ 60%]: linking.release build/linux/x86_64/release/hello.ko
[100%]: build ok!
```





简单么，也许你会说，这跟直接用 Makefile 配置，然后 make 编译也没啥太大区别么。

那么重点来了，Xmake 是会自动帮你拉取指定版本依赖内核源码，make 不会，CMake 也不会，用户必须通过 `sudo apt install linux-headers-generic` 自己安装它们。

但是 Xmake 不需要，上面的一键编译，我其实省略了部分输出，实际上是这样的。

```console
$ xmake
note: install or modify (m) these packages (pass -y to skip confirm)?
in xmake-repo:
  -> m4 1.4.19 [from:linux-headers,bison,flex,elfutils]
  -> flex 2.6.4 [from:bc,linux-headers]
  -> bison 3.8.2 [from:bc,linux-headers]
  -> ed 1.17 [from:bc,linux-headers]
  -> texinfo 6.7 [from:bc,linux-headers]
  -> bc 1.07.1 [from:linux-headers]
  -> pkg-config 0.29.2 [from:linux-headers]
  -> openssl 1.1.1l [private, from:linux-headers]
  -> elfutils 0.183 [private, from:linux-headers]
  -> linux-headers 5.10.46 [driver_modules:y]
please input: y (y/n/m)

  => download https://github.com/xmake-mirror/ed/archive/refs/tags/1.17.tar.gz .. ok
  => install ed 1.17 .. ok
  => download https://ftp.gnu.org/gnu/m4/m4-1.4.19.tar.xz .. ok
  => download https://ftp.gnu.org/gnu/texinfo/texinfo-6.7.tar.xz .. ok
  => download https://pkgconfig.freedesktop.org/releases/pkg-config-0.29.2.tar.gz .. ok
  => download https://github.com/openssl/openssl/archive/OpenSSL_1_1_1l.zip .. ok
  => install m4 1.4.19 .. ok
  => download https://github.com/westes/flex/releases/download/v2.6.4/flex-2.6.4.tar.gz .. ok
  => install texinfo 6.7 .. ok
  => install pkg-config 0.29.2 .. ok
  => download http://ftp.gnu.org/gnu/bison/bison-3.8.2.tar.gz .. ok
  => install flex 2.6.4 .. ok
  => download https://sourceware.org/elfutils/ftp/0.183/elfutils-0.183.tar.bz2 .. ok
  => install elfutils 0.183 .. ok
  => install bison 3.8.2 .. ok
  => download https://ftp.gnu.org/gnu/bc/bc-1.07.1.tar.gz .. ok
  => install bc 1.07.1 .. ok
  => install openssl 1.1.1l .. ok
  => download https://cdn.kernel.org/pub/linux/kernel/v5.x/linux-5.10.46.tar.xz .. ok
  => install linux-headers 5.10.46 .. ok
[ 16%]: ccache compiling.release src/add.c
[ 16%]: ccache compiling.release src/hello.c
[ 16%]: ccache compiling.release src/hello.mod.c
[ 66%]: linking.release build/linux/x86_64/release/hello.ko
[100%]: build ok!
```

首次编译，Xmake 会拉取所有依赖，如果用户自己已经通过 apt 等第三方包管理安装了它们，Xmake 也会优先用系统已经安装的版本，省去下载安装过程。

也就是说，不管在哪个环境，用户都不需要关心如何去搭建内核驱动开发环境，仅仅只需要一个 `xmake` 命令，就能搞定一切。

而这些依赖拉取，都是通过 `add_requires("linux-headers", {configs = {driver_modules = true}})` 配置包来实现的。

另外，我们也可以看完整构建命令参数。

```console
$ xmake -v
[ 20%]: ccache compiling.release src/add.c
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno-80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect-branch-register -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"add\" -o build/.objs/hello/linux/x86_64/release/src/add.c.o src/add.c
[ 20%]: ccache compiling.release src/hello.c
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno-80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect-branch-register -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"hello\" -o build/.objs/hello/linux/x86_64/release/src/hello.c.o src/hello.c
[ 60%]: linking.release build/linux/x86_64/release/hello.ko
/usr/bin/ld -m elf_x86_64 -r -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.o build/.objs/hello/linux/x86_64/release/src/add.c.o build/.objs/hello/linux/x86_64/release/src/hello.c.o
/usr/src/linux-headers-5.11.0-41-generic/scripts/mod/modpost -m -a -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/Module.symvers -e -N -T -
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno-80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect-branch-register -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod.o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod.c
/usr/bin/ld -m elf_x86_64 -r --build-id=sha1 -T /usr/src/linux-headers-5.11.0-41-generic/scripts/module.lds -o build/linux/x86_64/release/hello.ko build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod.o
```

#### 使用特定版本的内核源码

我们也可以指定版本语义规则，选取自己需要的内核源码作为构建源。

```lua
add_requires("linux-headers 5.9.x", {configs = {driver_modules = true}})
```

#### 交叉编译

我们也支持内核驱动模块的交叉编译，比如在 Linux x86_64 上使用交叉编译工具链来构建 Linux Arm/Arm64 的驱动模块。

我们只需要准备好自己的交叉编译工具链，通过 `--sdk=` 指定它的根目录，然后配置切换到 `-p cross` 平台， 最后指定需要构建的架构 arm/arm64 即可。

同样的，我们不用关心如何准备 linux-headers 去支持交叉编译，Xmake 的依赖包管理会帮你准本好一切，拉取构建支持对应架构的内核源码。

这里用到的交叉工具链，可以从这里下载: [Download toolchains](https://releases.linaro.org/components/toolchain/binaries/latest-7/aarch64-linux-gnu/)

更多，交叉编译配置文档，见：[配置交叉编译](https://xmake.io/zh/)

注：目前仅仅支持 arm/arm64 交叉编译架构，后续会支持更多的平台架构。

##### 构建 Arm 驱动模块

```console
$ xmake f -p cross -a arm --sdk=/mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf -c
$ xmake
[ 20%]: ccache compiling.release src/add.c
[ 20%]: ccache compiling.release src/hello.c
[ 60%]: linking.release build/cross/arm/release/hello.ko
[100%]: build ok!

```

##### 构建 Arm64 驱动模块

```console
$ xmake f -p cross -a arm64 --sdk=/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu -c
$ xmake
[ 20%]: ccache compiling.release src/add.c
[ 20%]: ccache compiling.release src/hello.c
[ 60%]: linking.release build/cross/arm64/release/hello.ko
[100%]: build ok!
```


### 分组批量构建和运行支持

早期，我们已经支持了通过 `set_group` 设置目标分组，实现 vs/vsxmake 工程在 vs 下的源文件分组管理展示。

但是，这个分组仅限于这个特性，没有用于其他地方，而新版本中，我们继续改进利用分组特性，实现指定构建一批目标程序，以及批量运行一批目标程序。

这通常有什么用呢，比如可以用来提供 `Run all tests` 和 `Run all benchmarks` 等功能。

#### 编译指定一批目标程序

我们可以使用 `set_group()` 将给定的目标标记为 `test/benchmark/...` 并使用 `set_default(false)` 禁用来默认构建它。

这样，默认情况下 Xmake 不会去构建它们，但是我们可以通过 `xmake -g xxx` 命令就能指定构建一批目标程序了。

比如，我们可以使用此功能来构建所有测试。

```lua
target("test1")
    set_kind("binary")
    set_default(false)
    set_group("test")
    add_files("src/*.cpp")

target("test2")
    set_kind("binary")
    set_default(false)
    set_group("test")
    add_files("src/*.cpp")
```

```console
$ xmake -g test
$ xmake --group=test
```

#### 运行指定一批目标程序

我们也可以通过设置分组，来指定运行所有带有 `test` 分组的测试程序。

这通常非常有用，在此之前想要实现 `Run all tests` 功能，我们只能通过定义一个 `task("tests")` 在里面调用 `os.exec` 去挨个执行测试目标，配置比较繁琐，对用户要求比较高。

而现在，我们只需要对需要执行的测试目标程序标记为 `set_group("test")`，然后就可以批量运行它们了。

```console
$ xmake run -g test
$ xmake run --group=test
```

#### 支持分组模式匹配

另外，我们还可以支持分组的模式匹配，非常的灵活：

```
$ xmake build -g test_*
$ xmake run -g test/foo_*
$ xmake build -g bench*
$ xmake run -g bench*
```

更多信息见：[#1913](https://github.com/xmake-io/xmake/issues/1913)

### 改进 CMake 包源的查找和集成

之前的版本中，我们提供了 `find_package("cmake::xxx")` 来查找 cmake 内部的包，但是这种方式对于用户集成使用还是很繁琐。

因此，新版本中，我们进一步改进它，通过 `add_requires` 来实现统一快速的 cmake 包集成。

```lua
add_requires("cmake::ZLIB", {alias = "zlib", system = true})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

我们指定 `system = true` 告诉 xmake 强制从系统中调用 cmake 查找包，如果找不到，不再走安装逻辑，因为 cmake 没有提供类似 vcpkg/conan 等包管理器的安装功能，
只提供了包查找特性。

#### 指定版本

```lua
add_requires("cmake::OpenCV 4.1.1", {system = true})
```

#### 指定组件

```lua
add_requires("cmake::Boost", {system = true, configs = {components = {"regex", "system"}})}
```

#### 预设开关

```lua
add_requires("cmake::Boost", {system = true, configs = {components = {"regex", "system"},
                                             presets = {Boost_USE_STATIC_LIB = true}}})
```

相当于内部调用 find_package 查找包之前，在 CMakeLists.txt 中预定义一些配置，控制 find_package 的查找策略和状态。

```
set(Boost_USE_STATIC_LIB ON) -- will be used in FindBoost.cmake
find_package(Boost REQUIRED COMPONENTS regex system)
```

#### 设置环境变量

```lua
add_requires("cmake::OpenCV", {system = true, configs = {envs = {CMAKE_PREFIX_PATH = "xxx"}}})
```

#### 指定自定义 FindFoo.cmake 模块脚本目录

mydir/cmake_modules/FindFoo.cmake

```lua
add_requires("cmake::Foo", {system = true, configs = {moduledirs = "mydir/cmake_modules"}})
```

相关 issues: [#1632](https://github.com/xmake-io/xmake/issues/1632)

### xmake-idea 插件更新

[xmake-idea](https://github.com/xmake-io/xmake-idea) 这个插件由于个人时间和精力的关系，一直没有花时间去维护更新，而 IDEA 插件的兼容性问题有非常多，只要一段时间不用，就无法在新的 Idea/Clion 上正常使用。

最近，我花了点时间，修复了一些兼容性问题，比如 Windows 上创建工程会卡死的问题，新版本 Clion 无法安装等问题。

目前，最新版本应该可以在全平台正常使用了。

<img src="https://tboox.org/static/img/xmake/xmake-idea-output_panel.png" width="50%" />

## 另外一些值得提起的事情

### 年终总结

这是 2021 年我发布的最后一个版本，这一年下来，经历了很多，Xmake 也在逐渐成长为一个更加强大的构建工具。

到今年年底，Xmake 总共收获了 4.2k stars，处理了 1.9k 的 issues/pr，超过 8k 多次 commits。

<img src="https://tboox.org/static/img/xmake/xmake-star-history.png" width="50%" />

而官方的包管理仓库 [xmake-repo](https://github.com/xmake-io/xmake-repo) 也已经收录了近 500+ 的常用依赖包。

### 感谢

感谢各位贡献者对 xmake-repo 仓库 和 Xmake 的贡献，完整贡献者列表见：[Contributors](https://github.com/xmake-io/xmake/graphs/contributors)。

也非常感谢大家对 Xmake 的赞助的支持，使得我能够有足够的动力去持续维护，完整捐助列表见：[Sponsors](https://xmake.io/zh/)。

## 更新内容

### 新特性

* [#1902](https://github.com/xmake-io/xmake/issues/1902): 支持构建 linux 内核驱动模块
* [#1913](https://github.com/xmake-io/xmake/issues/1913): 通过 group 模式匹配，指定构建和运行一批目标程序

### 改进

* [#1872](https://github.com/xmake-io/xmake/issues/1872): 支持转义 set_configvar 中字符串值
* [#1888](https://github.com/xmake-io/xmake/issues/1888): 改进 windows 安装器，避免错误删除其他安装目录下的文件
* [#1895](https://github.com/xmake-io/xmake/issues/1895): 改进 `plugin.vsxmake.autoupdate` 规则
* [#1893](https://github.com/xmake-io/xmake/issues/1893): 改进探测 icc 和 ifort 工具链
* [#1905](https://github.com/xmake-io/xmake/pull/1905): 改进 msvc 对 external 头文件搜索探测支持
* [#1904](https://github.com/xmake-io/xmake/pull/1904): 改进 vs201x 工程生成器
* 添加 `XMAKE_THEME` 环境变量去切换主题配置
* [#1907](https://github.com/xmake-io/xmake/issues/1907): 添加 `-f/--force` 参数使得 `xmake create` 可以在费控目录被强制创建
* [#1917](https://github.com/xmake-io/xmake/pull/1917): 改进 find_package 和配置

### Bugs 修复

* [#1885](https://github.com/xmake-io/xmake/issues/1885): 修复 package:fetch_linkdeps 链接顺序问题
* [#1903](https://github.com/xmake-io/xmake/issues/1903): 修复包链接顺序

