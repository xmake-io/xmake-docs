---
title: xmake v2.3.9 released, Add independent Xrepo C/C++ package manager
tags: [xmake, lua, C/C++, toolchains, xrepo, packages, vcpkg, conan]
date: 2020-11-24
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) is a lightweight cross-platform build tool based on Lua. It uses xmake.lua to maintain project builds. Compared with makefile/CMakeLists.txt, the configuration syntax is more Concise and intuitive, very friendly to novices, can get started quickly in a short time, allowing users to focus more on the actual project development.

In this new version, we focus on improving the dependency package management of xmake, adding support for the pacman package manager under Archlinux and MSYS2/Mingw, and we have further enriched the official package repository of xmake [xmake-repo](https: //github.com/xmake-io/xmake-repo), more than 50 commonly used C/C++ packages have been added.

In addition, we have added an independent subcommand based on xmake: [xrepo](https://github.com/xmake-io/xrepo/), a complete and independent cross-platform C/C++ package manager, which is convenient for users Conveniently manage the installation and integrated use of daily C/C++ packages.

At the same time, we have also released the xrepo related site [xrepo.xmake.io](https://xrepo.xmake.io), we can quickly check the usage of xrepo and each package in the official xmake-repo repository. Support and usage of

* [Project source code](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io/)
* [Xrepo Command](https://github.com/xmake-io/xrepo)

## New feature introduction

### Xrepo Package Manager

xrepo is a cross-platform C/C++ package manager based on [Xmake](https://github.com/xmake-io/xmake).

It is based on the runtime provided by xmake, but it is a complete and independent package management program. Compared with package managers such as vcpkg/homebrew, xrepo can provide C/C++ packages for more platforms and architectures at the same time.

And it also supports multi-version semantic selection. In addition, it is also a decentralized distributed warehouse. It not only provides the official [xmake-repo](https://github.com/xmake-io/xmake-repo) warehouse, It also supports users to build multiple private warehouses.

At the same time, xrepo also supports installing packages from third-party package managers such as vcpkg/homebrew/conan, and provides unified and consistent library link information to facilitate integration and docking with third-party projects.

If you want to know more, please refer to: [online documentation](https://xrepo.xmake.io/#/zh-cn/getting_started), [Github](https://github.com/xmake-io /xrepo) and [Gitee](https://gitee.com/tboox/xrepo)

![](https://xrepo.xmake.io/assets/img/xrepo.gif)






#### Installation

We only need to install xmake to use the xrepo command. For the installation of xmake, we can see: [xmake installation document](/zh/guide/installation).

#### Support platform

* Windows (x86, x64)
* macOS (i386, x86_64, arm64)
* Linux (i386, x86_64, cross-toolchains ..)
* *BSD (i386, x86_64)
* Android (x86, x86_64, armeabi, armeabi-v7a, arm64-v8a)
* iOS (armv7, armv7s, arm64, i386, x86_64)
* MSYS (i386, x86_64)
* MinGW (i386, x86_64, arm, arm64)
* Cross Toolchains

#### Supported package management warehouse

* Official self-built warehouse [xmake-repo](https://github.com/xmake-io/xmake-repo) (tbox >1.6.1)
* [User-built warehouse](/zh/package/remote_package#%e4%bd%bf%e7%94%a8%e8%87%aa%e5%bb %ba%e7%a7%81%e6%9c%89%e5%8c%85%e4%bb%93%e5%ba%93)
* Conan (conan::openssl/1.1.1g)
* Vcpkg (vcpkg:ffmpeg)
* Homebrew/Linuxbrew (brew::pcre2/libpcre2-8)
* Pacman on archlinux/msys2 (pacman::libcurl)
* Clib (clib::clibs/bytes@0.0.4)
* Dub (dub::log 0.4.3)

#### Distributed repository support

In addition to directly retrieve the installation package from the official repository: [xmake-repo](https://github.com/xmake-io/xmake-repo),
We can also add any number of self-built warehouses, and even completely isolate the external network, and only maintain the installation and integration of private packages on the company's internal network.

Just use the following command to add your own warehouse address:

```console
$ xrepo add-repo myrepo https://github.com/mygroup/myrepo
```

#### Install C/C++ package independently

Various installation methods are available, supporting semantic version, debugging package, dynamic library, configurable parameters, and C/C++ package installation in various third-party package management.

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

#### Seamless integration with xmake project

```lua
add_requires("tbox >1.6.1", "libuv master", "vcpkg::ffmpeg", "brew::pcre2/libpcre2-8")
add_requires("conan::openssl/1.1.1g", {alias = "openssl", optional = true, debug = true})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libuv", "vcpkg::ffmpeg", "brew::pcre2/libpcre2-8", "openssl")
```

The following is the overall architecture and compilation process integrated with xmake.

<img src="/assets/img/index/package_arch.png" width="650px" />


For more information about how to use xrepo, please refer to the document: [Xrepo Quick Start](https://xrepo.xmake.io/#/zh-cn/getting_started).


### Support the installation of cross-compiled dependency packages

In the new version, we have improved the dependency package installation mechanism inside xmake, and added support for the installation of C/C++ dependency packages for the cross-compilation tool chain, for example:

```lua
add_requires("zlib", "openssl")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "openssl")
```

We have configured two dependency packages above: zlib, openssl, and then we switch to the cross-compilation environment and use the compilation tool chain on musl.cc to compile.

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
[50%]: ccache compiling.release src/main.cpp
[75%]: linking.release test
[100%]: build ok!
```

xmake will automatically pull the zlib/openssl source code package, and then use the `arm-linux-musleabi-cross` cross tool chain to compile and install zlib and openssl. After the installation is complete, it will be automatically integrated into the test project to participate in the link until it is fully compiled.

Of course, to make C/C++ support cross-compilation, you first need to maintain the official xmake-repo repository and increase the support for cross-compilation. At present, there are not many C/C++ packages that support crossover in the warehouse, but many have already been included, and they will continue to be expanded in the future.

If you want to see which packages support cross-compilation, you can go directly to the package warehouse site to view: [List of C/C++ packages that support cross-compilation](https://xrepo.xmake.io/#/packages/cross)

We can also use the xrepo command provided in the new version to directly retrieve the packages supported by the specified platform (support fuzzy query):

```console
$ xrepo search -p cross zli*
```

We also welcome everyone to help contribute more packages to the official repository of [xmake-repo](https://github.com/xmake-io/xmake-repo), and work together to improve the construction of the C/C++ package management ecosystem so that users can It is more convenient to use various dependency packages, and no longer be bothered by various tedious porting tasks.


### Package license detection mechanism

Taking into account the different licenses of the packages in the warehouse, some packages may conflict with the license of the user project after use, so xmake adds a package dependency license compatibility detection mechanism in the new version.

And a new `set_license` interface is added, allowing users to set the license of each target.

For example, we integrated a LGPL-2.0 package libplist library, but our project does not have any license settings.

```lua
add_requires("libplist") - LGPL-2.0
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("libplist")
```

When compiling, there will be the following prompt to warn users that there may be a risk of code license conflict when using libplist.

```bash
$ xmake
warning: target(test) maybe is not compatible with license(LGPL-2.1) of package(libplist),
we can use shared libraries with LGPL-2.1 or use set_license()/set_policy() to modify/disable license!
```

And if we explicitly pass the project through `set_license("LGPL-2.0")` to ensure full compatibility, there will be no warning messages, and for `GPL`-related licenses, xmake will also have corresponding detections.

The relatively loose license packages such as MIT, BSD, etc., are directly integrated and used without any warning.

In addition, if we explicitly set `set_license()` and the package license conflicts, we will also prompt a warning.

### Pacman package support

In the previous version, xmake already supports the automatic integration of third-party warehouse package sources such as vcpkg, conan, clib, homebrew, etc. In the new version, we have added support for the integration of packages managed by pacman.

We support both the installation and integration of the pacman package on archlinux, and the installation and integration of the mingw `x86_64`/`i386` package of pacman on msys2.

```lua
add_requires("pacman::zlib", {alias = "zlib"})
add_requires("pacman::libpng", {alias = "libpng"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "libpng")
```

On archlinux, only:

```console
xmake
```

To install the mingw package on msys2, you need to specify the mingw platform:

```console
xmake f -p mingw -a [x86_64|i386]
xmake
```

### Install any version of the package

Because the packages in the xmake-repo warehouse have a strict version list and the corresponding sha256 value for the integrity check of the download, this will ensure the reliability and integrity of the package download.

However, it also leads to the inability to fully include all versions of a package. If there is a required version that has not been included, one way is for the user to add pr to the xmake-repo repository to increase the support for the corresponding version.

Another way is to configure `{verify = false}` in xmake.lua to force the skip verification mechanism, so that you can choose to download any version of the package.

```lua
add_requires("libcurl 7.73.0", {verify = false})
```

### Improve vcpkg package integration

Regarding the dependency integration of the vcpkg package, a lot of improvements have been made in the new version. Not only has the switch support for the windows-static-md package been added, but we have also improved the automatic detection mechanism of the vcpkg command, making it possible in more scenarios It can be detected automatically instead of requiring manual configuration.

### Improve custom cross toolchain

In the new version, we continue to make improvements to the custom tool chain to make the automatic detection more intelligent. Usually only need to specify sdkdir, xmake can automatically detect other configurations, such as cross and other information, for example:

```lua
toolchain("my_toolchain")
    set_kind("standalone")
    set_sdkdir("/tmp/arm-linux-musleabi-cross")
toolchain_end()

target("hello")
    set_kind("binary")
    add_files("apps/hello/*.c")
```

This is the most streamlined cross-toolchain configuration. It only sets the corresponding SDK path, and then marks it as a complete and independent toolchain by `set_kind("standalone")`.

At this time, we can use the command line `--toolchain=my_toolchain` to manually switch to this toolchain.

```console
xmake f --toolchain=my_toolchain
xmake
```

In addition, we can also directly bind it to the corresponding target through `set_toolchains` in xmake.lua, then only when this target is compiled, will we switch to our custom toolchain.


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

In this way, we no longer need to switch the toolchain manually, just execute xmake and it will automatically switch to the my_toolchain toolchain by default.

This is especially useful for embedded development, because there are many cross-compilation tool chains for embedded platforms, and we often need various switches to complete the compilation of different platforms.

Therefore, we can place all toolchain definitions in a separate lua file to define, for example:

```
projectdir
    -xmake.lua
    -toolchains
      -my_toolchain1.lua
      -my_toolchain2.lua
      -...
```

Then, we only need to import them through includes in xmake.lua, and bind different tool chains according to different custom platforms:

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

In this way, we can quickly switch the designated platform when compiling to automatically switch the corresponding tool chain.

```console
xmake f -p myplat1
xmake
```

If some cross-compilation toolchains are complex in structure and automatic detection is not enough, you can use `set_toolset`, `set_cross` and `set_bindir` interfaces according to the actual situation to configure other settings in a targeted manner.

For example, in the following example, we also added some cxflags/ldflags and the built-in system library links.

```lua
toolchain("my_toolchain")
    set_kind("standalone")
    set_sdkdir("/tmp/arm-linux-musleabi-cross")
    on_load(function (toolchain)
        - add flags for arch
        if toolchain:is_arch("arm") then
            toolchain:add("cxflags", "-march=armv7-a", "-msoft-float", {force = true})
            toolchain:add("ldflags", "-march=armv7-a", "-msoft-float", {force = true})
        end
        toolchain:add("ldflags", "--static", {force = true})
        toolchain:add("syslinks", "gcc", "c")
    end)
```

For more examples of custom toolchains, you can refer to the built-in toolchain definition in the directory of xmake source code: [Internal Toolchain List](https://github.com/xmake-io/xmake/blob/master/xmake/ toolchains/)

### Support mouse for menu configuration

Remember that xmake also provides graphical terminal menu configuration? It is the classic menu config graphical configuration interface similar to linux kernel.

```bash
xmake f --menu
```

In the new version, we have also made further improvements to it, adding cross-platform mouse operations. We can use the mouse to click and select various configuration items, which is more convenient.

<img src="/assets/img/index/menuconf.png" width="650px" />

## Changelog

### New features

* Add new [xrepo](https://github.com/xmake-io/xrepo) command to manage C/C++ packages
* Support for installing packages of cross-compilation
* Add musl.cc toolchains
* [#1009](https://github.com/xmake-io/xmake/issues/1009): Support select and install any version package, e.g. `add_requires("libcurl 7.73.0", {verify = false})`
* [#1016](https://github.com/xmake-io/xmake/issues/1016): Add license checking for target/packages
* [#1017](https://github.com/xmake-io/xmake/issues/1017): Support external/system include directories `add_sysincludedirs` for package and toolchains
* [#1020](https://github.com/xmake-io/xmake/issues/1020): Support to find and install pacman package on archlinux and msys2
* Support mouse for `xmake f --menu`

### Change

* [#997](https://github.com/xmake-io/xmake/issues/997): Support to set std lanuages for `xmake project -k cmake`
* [#998](https://github.com/xmake-io/xmake/issues/998): Support to install vcpkg packages with windows-static-md
* [#996](https://github.com/xmake-io/xmake/issues/996): Improve to find vcpkg directory
* [#1008](https://github.com/xmake-io/xmake/issues/1008): Improve cross toolchains
* [#1030](https://github.com/xmake-io/xmake/issues/1030): Improve xcode.framework and xcode.application rules
* [#1051](https://github.com/xmake-io/xmake/issues/1051): Add `edit` and `embed` to `set_symbols()` only for msvc
* [#1062](https://github.com/xmake-io/xmake/issues/1062): Improve `xmake project -k vs` plugin.
