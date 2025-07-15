---
title: Xmake v2.6.2 released, Support building Linux kernel driver module
tags: [xmake, lua, C/C++, Linux, Driver]
date: 2021-12-17
author: Ruki
---
### Build Linux kernel driver module

Xmake may be the first third-party build tool that provides built-in support for Linux kernel driver development.

Although there are also instructions on how CMake configures and builds Linux drivers on the Internet, most of them use `add_custom_command` to customize various commands, and then execute `echo` to splice and generate Linux Makefile files by themselves.

In other words, it is actually a build that relies on the Makefile of the Linux kernel source code to execute, so if you want to add some compilation configuration and macro definitions yourself, it will be very troublesome.

With Xmake, we can provide more flexible configurability, simpler configuration files, and features such as one-click compilation, automatic dependency pull integration, automatic download and integration of Linux kernel source code, and cross-compilation of kernel drivers.

#### Hello World

We intuitively feel it through one of the simplest character drivers.

First, we prepare a Hello World driver code, for example:

```lua
add_requires("linux-headers", {configs = {driver_modules = true}})

target("hello")
    add_rules("platform.linux.driver")
    add_files("src/*.c")
    add_packages("linux-headers")
    set_license("GPL-2.0")
```

Its configuration is very simple. You only need to configure the linux-headers package that supports the module, and then apply the `platform.linux.driver` build rule.

Then directly execute the xmake command, compile with one key, and generate the kernel driver module hello.ko.

```console
$ xmake
[20%]: ccache compiling.release src/add.c
[20%]: ccache compiling.release src/hello.c
[60%]: linking.release build/linux/x86_64/release/hello.ko
[100%]: build ok!
```





Is it simple? Maybe you would say that it is not much different from directly configuring with Makefile and then compiling with make.

So the point is here. Xmake will automatically pull the kernel source code for the specified version for you. Make will not, and CMake will not. Users must install them by themselves through `sudo apt install linux-headers-generic`.

But Xmake doesn't need it. In the one-click compilation above, I actually omitted part of the output, which is actually the case.

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
[16%]: ccache compiling.release src/add.c
[16%]: ccache compiling.release src/hello.c
[16%]: ccache compiling.release src/hello.mod.c
[66%]: linking.release build/linux/x86_64/release/hello.ko
[100%]: build ok!
```

When compiling for the first time, Xmake will pull all dependencies. If the user has installed them through third-party package management such as apt, Xmake will give priority to the version already installed on the system, saving the download and installation process.

In other words, no matter what environment you are in, users don't need to care about how to build a kernel-driven development environment. They only need one `xmake` command to get everything done.

And these dependency pulls are implemented through the `add_requires("linux-headers", {configs = {driver_modules = true}})` configuration package.

In addition, we can also see the complete build command parameters.

```console
$ xmake -v
[20%]: ccache compiling.release src/add.c
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr /src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux -headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr /src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\ "hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno -80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect -branch-re gister -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops= 1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone- fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"add\ "-o build/.objs/hello/linux/x86_64/release/src/add.c.o src/add.c
[20%]: ccache compiling.release src/hello.c
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr /src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux -headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr /src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\ "hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno -80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect -branch-re gister -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops= 1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone- fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"hello\ "-o build/.objs/hello/linux/x86_64/release/src/hello.co src/hello.c
[60%]: linking.release build/linux/x86_64/release/hello.ko
/usr/bin/ld -m elf_x86_64 -r -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.o build/.objs/hello/linux/x86_64/ release/src/add.co build/.objs/hello/linux/x86_64/release/src/hello.co
/usr/src/linux-headers-5.11.0-41-generic/scripts/mod/modpost -m -a -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/Module .symvers -e -N -T-
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr /src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux -headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr /src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\ "hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno -80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect -branch-re gister -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops= 1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone- fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -o build/.objs/ hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod.o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod. c
/usr/bin/ld -m elf_x86_64 -r --build-id=sha1 -T /usr/src/linux-headers-5.11.0-41-generic/scripts/module.lds -o build/linux/x86_64/ release/hello.ko build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/ release/hello.ko.mod.o
```

#### Use a specific version of the kernel source code

We can also specify version semantic rules and select the kernel source code we need as the build source.

```lua
add_requires("linux-headers 5.9.x", {configs = {driver_modules = true}})
```

#### Cross compilation

We also support cross-compilation of kernel driver modules, such as using cross-compilation tool chain on Linux x86_64 to build Linux Arm/Arm64 driver modules.

We only need to prepare our own cross-compilation tool chain, specify its root directory through `--sdk=`, then switch to the `-p cross` platform configuration, and finally specify the architecture arm/arm64 to be built.

Similarly, we don't need to care about how to prepare linux-headers to support cross-compilation. Xmake's dependency package management will help you prepare everything and pull and build the kernel source code that supports the corresponding architecture.

The cross toolchain used here can be downloaded from here: [Download toolchains](https://releases.linaro.org/components/toolchain/binaries/latest-7/aarch64-linux-gnu/)

For more, cross-compilation configuration documents, see: [Configure cross-compilation](https://xmake.io/#/guide/configuration#common-cross-compilation-configuration)

Note: Currently only arm/arm64 cross-compilation architecture is supported, and more platform architectures will be supported in the future.

##### Build Arm driver module

```console
$ xmake f -p cross -a arm --sdk=/mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf -c
$ xmake
[20%]: ccache compiling.release src/add.c
[20%]: ccache compiling.release src/hello.c
[60%]: linking.release build/cross/arm/release/hello.ko
[100%]: build ok!
```

##### Build Arm64 driver module

```console
$ xmake f -p cross -a arm64 --sdk=/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu -c
$ xmake
[20%]: ccache compiling.release src/add.c
[20%]: ccache compiling.release src/hello.c
[60%]: linking.release build/cross/arm64/release/hello.ko
[100%]: build ok!
```

### Group batch build and run support

In the early days, we have supported the setting of target grouping through `set_group` to realize the management and display of the source file grouping of the vs/vsxmake project under VS.

However, this grouping is limited to this feature and is not used in other places. In the new version, we continue to improve and use the grouping feature to achieve designated construction of a batch of target programs and batch operation of a batch of target programs.

What is this usually useful for, for example, it can be used to provide functions such as `Run all tests` and `Run all benchmarks`.

#### Compile and specify a batch of target programs

We can use `set_group()` to mark a given target as `test/benchmark/...` and use `set_default(false)` to disable to build it by default.

In this way, Xmake will not build them by default, but we can specify to build a batch of target programs through the `xmake -g xxx` command.

For example, we can use this feature to build all tests.

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

#### Run a specified batch of target programs

We can also specify to run all test programs with the `test` group by setting the group.

This is usually very useful. Before that, if we want to implement the `Run all tests` function, we can only call `os.exec` by defining a `task("tests")` to execute the test targets one by one. The configuration is cumbersome. The requirements for users are relatively high.

And now, we only need to mark the test target programs that need to be executed as `set_group("test")`, and then run them in batches.

```console
$ xmake run -g test
$ xmake run --group=test
```

#### Support group pattern matching

In addition, we can also support grouped pattern matching, which is very flexible:

```
$ xmake build -g test_*
$ xmake run -g test/foo_*
$ xmake build -g bench*
$ xmake run -g bench*
```

For more information: [#1913](https://github.com/xmake-io/xmake/issues/1913)

### Improve the search and integration of CMake package sources

In the previous version, we provided `find_package("cmake::xxx")` to find packages inside cmake, but this method is still very cumbersome for users to integrate and use.

Therefore, in the new version, we further improve it, through `add_requires` to achieve a unified and fast cmake package integration.

```lua
add_requires("cmake::ZLIB", {alias = "zlib", system = true})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

We specify `system = true` to tell xmake to force cmake to find the package from the system. If it cannot be found, the installation logic will not be followed, because cmake does not provide the installation function of package managers such as vcpkg/conan.
Only the package search feature is provided.

#### Specify version

```lua
add_requires("cmake::OpenCV 4.1.1", {system = true})
```

#### Specified components

```lua
add_requires("cmake::Boost", {system = true, configs = {components = {"regex", "system"}}))
```

#### Default switch

```lua
add_requires("cmake::Boost", {system = true, configs = {components = {"regex", "system"},
                                             presets = {Boost_USE_STATIC_LIB = true}}})
```

It is equivalent to predefine some configurations in CMakeLists.txt before calling find_package internally to find the package to control the find_package search strategy and status.

```
set(Boost_USE_STATIC_LIB ON) - will be used in FindBoost.cmake
find_package(Boost REQUIRED COMPONENTS regex system)
```

#### Set environment variables

```lua
add_requires("cmake::OpenCV", {system = true, configs = {envs = {CMAKE_PREFIX_PATH = "xxx"}}})
```

#### Specify custom FindFoo.cmake module script directory

mydir/cmake_modules/FindFoo.cmake

```lua
add_requires("cmake::Foo", {system = true, configs = {moduledirs = "mydir/cmake_modules"}})
```

Related issues: [#1632](https://github.com/xmake-io/xmake/issues/1632)

### xmake-idea plugin update

[xmake-idea](https://github.com/xmake-io/xmake-idea) Due to personal time and energy, this plug-in has not spent time to maintain and update: and IDEA plug-ins have a lot of compatibility issues , As long as it is not used for a period of time, it cannot be used normally on the new Idea/Clion.

Recently, I took some time to fix some compatibility issues, such as the problem of freezing when creating a project on Windows, and problems such as the inability to install the new version of Clion.

At present, the latest version should be able to be used normally on all platforms.

<img src="https://tboox.org/static/img/xmake/xmake-idea-output_panel.png" width="50%" />

## Some other things worth mentioning

### Year-end summary

This is the last version I released in 2021. After a year, Xmake has gradually grown into a more powerful build tool.

By the end of this year, Xmake had a total of 4.2k stars, processed 1.9k issues/pr, and had more than 8k multiple commits.

<img src="https://tboox.org/static/img/xmake/xmake-star-history.png" width="50%" />

The official package management repository [xmake-repo](https://github.com/xmake-io/xmake-repo) has also included nearly 500+ commonly used dependency packages.

### Thanks

Thank you contributors for your contributions to the xmake-repo repository and Xmake. For the complete list of contributors, see: [Contributors](https://github.com/xmake-io/xmake/graphs/contributors).

Thank you very much for your support for Xmake's sponsorship, so that I can have enough motivation to maintain it. For the complete list of donations, please see: [Sponsors](https://xmake.io/#/about/sponsor).

## Changelog

### New features

* [#1902](https://github.com/xmake-io/xmake/issues/1902): Support to build linux kernel driver modules
* [#1913](https://github.com/xmake-io/xmake/issues/1913): Build and run targets with given group pattern

### Change

* [#1872](https://github.com/xmake-io/xmake/issues/1872): Escape characters for set_configvar
* [#1888](https://github.com/xmake-io/xmake/issues/1888): Improve windows installer to avoid remove other files
* [#1895](https://github.com/xmake-io/xmake/issues/1895): Improve `plugin.vsxmake.autoupdate` rule
* [#1893](https://github.com/xmake-io/xmake/issues/1893): Improve to detect icc and ifort toolchains
* [#1905](https://github.com/xmake-io/xmake/pull/1905): Add support of external headers without experimental for msvc
* [#1904](https://github.com/xmake-io/xmake/pull/1904): Improve vs201x generator
* Add `XMAKE_THEME` envirnoment variable to switch theme
* [#1907](https://github.com/xmake-io/xmake/issues/1907): Add `-f/--force` to force to create project in a non-empty directory
* [#1917](https://github.com/xmake-io/xmake/pull/1917): Improve to find_package and configurations

### Bugs fixed

* [#1885](https://github.com/xmake-io/xmake/issues/1885): Fix package:fetch_linkdeps
* [#1903](https://github.com/xmake-io/xmake/issues/1903): Fix package link order

