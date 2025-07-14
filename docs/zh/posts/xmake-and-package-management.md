---
title: Xmake 和 C/C++ 包管理
tags: [xmake, lua, C/C++, Package, Manager]
date: 2022-03-12
author: Ruki
---

[Xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具，关于 Xmake 与构建系统的介绍，我们已经在之前的文章中做了详细的介绍：[C/C++ 构建系统，我用 xmake](https://zhuanlan.zhihu.com/p/370008884)。

如果大家已经对 Xmake 已经有了大概的了解，就会知道，它不仅仅是一个构建工具，还内置了对 C/C++ 包管理的支持，我们也可以把 Xmake 理解为：

```
Xmake = Build backend + Project Generator + Package Manager
```

经过几年的持续迭代，Xmake 对 C/C++ 包管理的支持不断完善，也新增了不少实用的包管理特性，因此，在本文中，我们对其做一些总结，希望对大家有所帮助。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](/zh/about/course)

### 构建系统与包管理

C++ 的生态比较繁杂，这其中也有一定历史原因，不管如何，官方没有提供原生的包管理支持，对我们开发者来说，使用第三方 C++ 依赖库多少存在很多不便。

其实，现在已经有很多强大的 C/C++ 包管理器，最知名，用的最多的有：vcpkg, conan, conda 等等，它们虽然很强大，但是有一个共同的问题：构建工具对它们没有提供原生的支持。

由于 CMake 对它们没有提供内置支持，想在 CMake 中使用它们集成依赖包非常繁琐，并且集成和使用的方式都不一致。

#### 在 CMake 中使用 Conan

在 CMake 中使用 conan 集成 C/C++ 包，我们需要提供额外的 CMake Wrapper 脚本，以类似插件的方式注入进自己的工程中去。







```cmake
cmake_minimum_required(VERSION 3.5)
project(FormatOutput CXX)

list(APPEND CMAKE_MODULE_PATH ${CMAKE_BINARY_DIR})
list(APPEND CMAKE_PREFIX_PATH ${CMAKE_BINARY_DIR})

add_definitions("-std=c++11")

if(NOT EXISTS "${CMAKE_BINARY_DIR}/conan.cmake")
  message(STATUS "Downloading conan.cmake from https://github.com/conan-io/cmake-conan")
  file(DOWNLOAD "https://raw.githubusercontent.com/conan-io/cmake-conan/v0.16.1/conan.cmake"
                "${CMAKE_BINARY_DIR}/conan.cmake"
                EXPECTED_HASH SHA256=396e16d0f5eabdc6a14afddbcfff62a54a7ee75c6da23f32f7a31bc85db23484
                TLS_VERIFY ON)
endif()

include(${CMAKE_BINARY_DIR}/conan.cmake)

conan_cmake_configure(REQUIRES fmt/6.1.2
                      GENERATORS cmake_find_package)

conan_cmake_autodetect(settings)

conan_cmake_install(PATH_OR_REFERENCE .
                    BUILD missing
                    REMOTE conancenter
                    SETTINGS ${settings})

find_package(fmt)

add_executable(main main.cpp)
target_link_libraries(main fmt::fmt)
```

为了集成一个包，需要额外配置很多的脚本。

#### 在 CMake 中使用 Vcpkg

在 CMake 中使用 vcpkg 集成包，我们也需要额外注入一个工具链脚本文件。

```bash
cmake -B [build directory] -S . -DCMAKE_TOOLCHAIN_FILE=[path to vcpkg]/scripts/buildsystems/vcpkg.cmake
cmake --build [build directory]
```

另外，还有一个问题，就是我们还需要额外自己调用 `vcpkg install [packages]` 命令，去安装包。

这其中每一个环节，对于用户来讲都需要额外的探索过程，没法做到真正的一键编译。

想象下，用户下载了一个集成了 vcpkg 包的 cmake 项目，想要编译通过，除了项目配置，还需要做哪些额外的事情：

1. 安装 vcpkg
2. 执行 `vcpkg install xxx` 安装里面需要的包
3. 执行 cmake 传递 vcpkg.cmake 脚本给 cmake，进行工程配置

#### 在 CMake 中使用 FetchContent

提供了 FetchContent 模式来管理依赖，但似乎是源码拉取，而且必须依赖也是基于 CMake 维护构建的，另外，我们需要对每个依赖项，配置 url, 版本等各种包信息。

```cmake
cmake_minimum_required(VERSION 3.14)
project(fetchContent_example CXX)

include(FetchContent)

FetchContent_Declare(
        DocTest
        GIT_REPOSITORY "https://github.com/onqtam/doctest"
        GIT_TAG "932a2ca50666138256dae56fbb16db3b1cae133a"
)
FetchContent_Declare(
        Range-v3
        GIT_REPOSITORY "https://github.com/ericniebler/range-v3"
        GIT_TAG "4d6a463bca51bc316f9b565edd94e82388206093"
)

FetchContent_MakeAvailable(DocTest Range-v3)

add_executable(${PROJECT_NAME} src/main.cpp)
target_link_libraries(${PROJECT_NAME} doctest range-v3)
```

#### 在 Meson 中使用依赖包

Meson 很强大，并且也提供了自带的包管理支持，但是想要在 Meson 中使用其他包管理器，例如 vcpkg/conan 等等同样很繁琐，并没有提供原生支持。

#### 在 Xmake 中使用依赖包

Xmake 不仅提供了内置的 [xmake-repo](https://github.com/xmake-io/xmake-repo) 内置的包管理仓库，可以直接集成使用里面的包，还支持以相同的集成方式，去快速集成 vcpkg/conan 等第三方的依赖包。

集成一个内置依赖包只需要几行配置：

```lua
add_requires("zlib 1.2.11")
target("test")
    add_files("src/*.c")
    add_packages("zlib")
```

集成一个 vcpkg 包，仅仅只需要加上对应的包管理器命名空间，集成方式完全相同：

```lua
add_requires("vcpkg::zlib 1.2.11")
target("test")
    add_files("src/*.c")
    add_packages("vcpkg::zlib")
```

集成一个 conan 包，或者 conda, homebrew, pacman, apt, clib 等第三方包，也只需要改成 `conan::zlib` 就行了，用户可以随意切换包源。

另外，Xmake 会自动帮你调用 `vcpkg/conan install` 安装命令去安装依赖包，然后集成它们，不需要用户做任何其他事情，仅仅只需要执行 `xmake` 一键编译。

<img src="/assets/img/index/package_manage.png" width="650px" />

### C/C++ 包太少？

觉得 Xmake 内置的包仓库里面的包太少么？完全没关系，理论上，你可以通过 Xmake 使用整个 C/C++ 生态 90% 的常用依赖包，就是因为 Xmake 可以快速从各种其他包管理器中集成包来使用。

目前 Xmake 支持的包源有以下这些：

* Official package repository [xmake-repo](https://github.com/xmake-io/xmake-repo) (tbox >1.6.1)
* Official package manager [Xrepo](https://github.com/xmake-io/xrepo)
* [User-built repositories](/zh/guide/package-management/package-distribution)
* Conan (conan::openssl/1.1.1g)
* Conda (conda::libpng 1.3.67)
* Vcpkg (vcpkg:ffmpeg)
* Homebrew/Linuxbrew (brew::pcre2/libpcre2-8)
* Pacman on archlinux/msys2 (pacman::libcurl)
* Apt on ubuntu/debian (apt::zlib1g-dev)
* Clib (clib::clibs/bytes@0.0.4)
* Dub (dub::log 0.4.3)
* Portage on Gentoo/Linux (portage::libhandy)
* Nimble for nimlang (nimble::zip >1.3)
* Cargo for rust (cargo::base64 0.13.0)

基本上，这些仓库基本已经覆盖了 C/C++ 用户日常所需的所有包。

作者从写这篇文章开始，统计了下 vcpkg/conan/xmake-repo 仓库的包数量：

* vcpkg: 1859
* conan: 1218
* xmake-repo: 651

可以看到，目前 Xmake 内置仓库的包数量，已经快要接近 vcpkg/conan 了，也不少了，我们也在不断的收录新的包进来。

但是这完全没有关系，因为我们可以使用任意包仓库中的包。

如果在 CMake 中使用 vcpkg，我们只能使用 1859 个包。
如果在 CMake 中使用 conan，我们只能使用 1218 个包。

而如果在 Xmake 中使用包，我们可以使用 651 (xmake-repo) + vcpkg/conan (1k+) + more (conda, homebrew, pacman, apt, clib ...) 中的包。

甚至，C/C++ 包不够，其他语言的包也可以拿过来用，例如：Xmake 也支持从 dub/cargo 等 Dlang/Rust 的包管理器中拉取包，给 C/C++ 项目使用。

### Xmake 内置包管理集成

除了接入第三方包管理，我们也更推荐优先使用集成 xmake-repo 内置仓库中提供的包，Xmake 会提供更多特性支持。

因此，如果用户需要的包还没被收录，可以先尝试提交到 [xmake-repo](https://github.com/xmake-io/xmake-repo) 进来。

接下来，我们系统介绍下，集成内置包的一些特性。

#### 语义版本设置

Xmake 的依赖包管理是完全支持语义版本选择的，例如："~1.6.1"，对于语义版本的具体描述见：[https://semver.org/](https://semver.org/)

比如下面一些语义版本写法：

```lua
add_requires("tbox 1.6.*", "pcre 1.3.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

当然，如果我们对当前的依赖包的版本没有特殊要求，那么可以直接这么写：

```lua
add_requires("tbox", "libpng", "zlib")
```

这会使用已知的最新版本包，或者是master分支的源码编译的包，如果当前包有git repo地址，我们也能指定特定分支版本：

```lua
add_requires("tbox master")
add_requires("tbox dev")
```

Xmake 的语义版本支持，在几年前就已经很好的支持，而 vcpkg 也仅仅在最近一年才通过清单模式勉强支持它。

即使现在，vcpkg 对版本语义的支持也很受限，只能支持 `>=1.0`, `1.0` 等几种版本模式，想要选择任意版本的包，比如 `>=1.0 <1.5` 等复杂版本条件的包，vcpkg 还是无法支持。

#### 可选包设置

如果指定的依赖包当前平台不支持，或者编译安装失败了，那么 Xmake 会编译报错，这对于有些必须要依赖某些包才能工作的项目，这是合理的。
但是如果有些包是可选的依赖，即使没有也可以正常编译使用的话，可以设置为可选包：

```lua
add_requires("tbox", {optional = true})
```

#### 使用系统库

默认的设置，Xmake 会去优先检测系统库是否存在（如果没设置版本要求），如果用户完全不想使用系统库以及第三方包管理提供的库，那么可以设置：

```lua
add_requires("tbox", {system = false})
```

而如果配置成：

```lua
add_requires("tbox", {system = true})
```

就是仅仅查找使用系统库，不会去远程下载安装它，这类似于 CMake 的 find_package，但是集成方式更加简单一致。


#### 使用调试版本的包

如果我们想同时源码调试依赖包，那么可以设置为使用debug版本的包（当然前提是这个包支持debug编译）：

```lua
add_requires("tbox", {debug = true})
```

#### 启用包的可选特性

我们也可以安装带有指定特性的包，比如安装开启了 zlib 和 libx265 的 ffmpeg 包。

```lua
add_requires("ffmpeg", {configs = {zlib = true, libx265 = true}})
```

#### 传递额外的编译选项

我们也可以传递额外的编译选项给包：


```lua
add_requires("spdlog", {configs = {cxflags = "-Dxxx"}})
```

### 独立的包管理命令 Xrepo

Xrepo 是一个基于 [Xmake](https://github.com/xmake-io/xmake) 的跨平台 C/C++ 包管理器。

它是一个独立于 Xmake 的命令程序，用于辅助用户去管理依赖包，类似 vcpkg/conan，但相比它们，有额外多了一些实用的特性，我们会简单介绍一些。

![](https://xrepo.xmake.io/assets/img/xrepo.gif)

#### 多仓库管理

除了可以直接从官方仓库：[xmake-repo](https://github.com/xmake-io/xmake-repo) 检索安装包之外，
我们还可以添加任意多个自建的仓库，甚至可以完全隔离外网，仅仅在公司内部网络维护私有包的安装集成。

只需要通过下面的命令，添加上自己的仓库地址：

```console
$ xrepo add-repo myrepo https://github.com/mygroup/myrepo
```

#### 基本使用

```console
$ xrepo install zlib tbox
```

#### 安装指定版本包

完整支持 Semantic Versioning (语义版本)。

```console
$ xrepo install "zlib 1.2.x"
$ xrepo install "zlib >=1.2.0"
```

#### 安装指定平台包

```console
$ xrepo install -p iphoneos -a arm64 zlib
$ xrepo install -p android [--ndk=/xxx] zlib
$ xrepo install -p mingw [--mingw=/xxx] zlib
$ xrepo install -p cross --sdk=/xxx/arm-linux-musleabi-cross zlib
```

#### 安装调试版本包

```console
$ xrepo install -m debug zlib
```

#### 安装动态库版本包

```console
$ xrepo install -k shared zlib
```

#### 安装指定配置包

```console
$ xrepo install -f "vs_runtime=MD" zlib
$ xrepo install -f "regex=true,thread=true" boost
```

#### 安装第三方包管理器的包

```console
$ xrepo install brew::zlib
$ xrepo install vcpkg::zlib
$ xrepo install conan::zlib/1.2.11
```

#### 查看包的库使用信息

```console
$ xrepo fetch pcre2
{
  {
    linkdirs = {
      "/usr/local/Cellar/pcre2/10.33/lib"
    },
    links = {
      "pcre2-8"
    },
    defines = {
      "PCRE2_CODE_UNIT_WIDTH=8"
    },
    includedirs = "/usr/local/Cellar/pcre2/10.33/include"
  }
}
```

```console
$ xrepo fetch --ldflags openssl
-L/Users/ruki/.xmake/packages/o/openssl/1.1.1/d639b7d6e3244216b403b39df5101abf/lib -lcrypto -lssl
```

```console
$ xrepo fetch --cflags openssl
-I/Users/ruki/.xmake/packages/o/openssl/1.1.1/d639b7d6e3244216b403b39df5101abf/include
```

```console
$ xrepo fetch -p [iphoneos|android] --cflags "zlib 1.2.x"
-I/Users/ruki/.xmake/packages/z/zlib/1.2.11/df72d410e7e14391b1a4375d868a240c/include
```

```console
$ xrepo fetch --cflags --ldflags conan::zlib/1.2.11
-I/Users/ruki/.conan/data/zlib/1.2.11/_/_/package/f74366f76f700cc6e991285892ad7a23c30e6d47/include -L/Users/ruki/.conan/data/zlib/1.2.11/_/_/package/f74366f76f700cc6e991285892ad7a23c30e6d47/lib -lz
```

#### 导入导出安装后的包

xrepo 可以快速导出已经安装后的包，包括对应的库文件，头文件等等。

```console
$ xrepo export -o /tmp/output zlib
```

也可以在其他机器上导入之前导出的安装包，实现包的迁移。

```console
$ xrepo import -i /xxx/packagedir zlib
```

#### 搜索支持的包

```console
$ xrepo search zlib "pcr*"
    zlib:
      -> zlib: A Massively Spiffy Yet Delicately Unobtrusive Compression Library (in xmake-repo)
    pcr*:
      -> pcre2: A Perl Compatible Regular Expressions Library (in xmake-repo)
      -> pcre: A Perl Compatible Regular Expressions Library (in xmake-repo)
```

另外，现在还可以从 vcpkg, conan, conda 以及 apt 等第三方包管理器中搜索它们的包，只需要加上对应的包命名空间就行，例如：

```console
$ xrepo search vcpkg::pcre
The package names:
    vcpkg::pcre:
      -> vcpkg::pcre-8.44#8: Perl Compatible Regular Expressions
      -> vcpkg::pcre2-10.35#2: PCRE2 is a re-working of the original Perl Compatible Regular Expressions library
```

```console
$ xrepo search conan::openssl
The package names:
    conan::openssl:
      -> conan::openssl/1.1.1g:
      -> conan::openssl/1.1.1h:
```

#### 包虚拟环境管理

我们可以通过在当前目录下，添加 xmake.lua 文件，定制化一些包配置，然后进入特定的包 shell 环境。

```lua
add_requires("zlib 1.2.11")
add_requires("python 3.x", "luajit")
```

```console
$ xrepo env shell
> python --version
> luajit --version
```

### 在 Xmake 中集成第三方构建系统

#### 在 Xmake 中集成 Cmake 项目

Xmake 并不打算分裂 C/C++ 生态，它能很好和兼容复用现有 cmake/autoconf/meson 维护的项目，比如可以将一些其他使用 CMake 维护的代码库，直接本地集成进来，参与混合编译。

也就是说，Xmake 不会强制用户将所有的项目重新 port 到 xmake.lua，现有的 CMake 项目，一样可以快速集成到 Xmake 项目中去。

例如，我们有如下项目结构：

```
├── foo
│   ├── CMakeLists.txt
│   └── src
│       ├── foo.c
│       └── foo.h
├── src
│   └── main.c
├── test.lua
└── xmake.lua
```

foo 目录下是一个使用 CMake 维护的静态库，而根目录下使用了 Xmake 来维护，我们可以在 xmake.lua 中通过定义 `package("foo")` 包来描述如何构建 foo 代码库。

```lua
add_rules("mode.debug", "mode.release")

package("foo")
    add_deps("cmake")
    set_sourcedir(path.join(os.scriptdir(), "foo"))
    on_install(function (package)
        local configs = {}
        table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:debug() and "Debug" or "Release"))
        table.insert(configs, "-DBUILD_SHARED_LIBS=" .. (package:config("shared") and "ON" or "OFF"))
        import("package.tools.cmake").install(package, configs)
    end)
    on_test(function (package)
        assert(package:has_cfuncs("add", {includes = "foo.h"}))
    end)
package_end()

add_requires("foo")

target("demo")
    set_kind("binary")
    add_files("src/main.c")
    add_packages("foo")
```

其中，我们通过 `set_sourcedir()` 来设置 foo 包的代码目录位置，然后通过 import 导入 `package.tools.cmake` 辅助模块来调用 cmake 构建代码，xmake 会自动获取生成的 libfoo.a 和对应的头文件。

!> 如果仅仅本地源码集成，我们不需要额外设置 `add_urls` 和 `add_versions`。

关于包的配置描述，详情见：[包描述说明](/zh/package/remote_package#%e5%8c%85%e6%8f%8f%e8%bf%b0%e8%af%b4%e6%98%8e)

定义完包后，我们就可以通过 `add_requires("foo")` 和 `add_packages("foo")` 来集成使用它了，就跟集成远程包一样的使用方式。

另外，`on_test` 是可选的，如果想要严格检测包的编译安装是否成功，可以在里面做一些测试。

完整例子见：[Library with CMakeLists](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/library_with_cmakelists)

#### 在 Xmake 中集成 Meson 项目

Xmake 支持集成更多其他构建系统维护的第三方源码库，比如 Meson，仅仅只需要导入使用 `package.tools.meson` 辅助构建模块调用 meson 来构建它们。

例如，我们从 xmake-repo 仓库中挑选一个使用 meson 构建的包作为例子：

```lua
package("harfbuzz")
    set_sourcedir(path.join(os.scriptdir(), "3rd/harfbuzz"))
    add_deps("meson")
    on_install(function (package)
        local configs = {"-Dtests=disabled", "-Ddocs=disabled", "-Dbenchmark=disabled", "-Dcairo=disabled", "-Dfontconfig=disabled", "-Dglib=disabled", "-Dgobject=disabled"}
        table.insert(configs, "-Ddefault_library=" .. (package:config("shared") and "shared" or "static"))
        import("package.tools.meson").install(package, configs)
    end)
```

#### 在 Xmake 中集成 Autoconf 项目

我们也可以使用 `package.tools.autoconf` 来本地集成带有 autoconf 维护的第三方代码库。

```lua
package("libev")
    set_sourcedir(path.join(os.scriptdir(), "3rd/libev"))
    on_install(function (package)
        import("package.tools.autoconf").install(package)
    end)
```

`package.tools.autoconf` 和 `package.tools.cmake` 模块都是可以支持 mingw/cross/iphoneos/android 等交叉编译平台和工具链的，xmake 会自动传递对应的工具链进去，用户不需要做任何其他事情。

#### 在 Xmake 中集成 Gn 项目

我们也可以使用 `package.tools.gn` 来本地集成带有 GN 维护的第三方代码库。

```lua
package("skia")
    set_sourcedir(path.join(os.scriptdir(), "3rd/skia"))
    add_deps("gn", "ninja")
    on_install(function (package)
        import("package.tools.gn").install(package)
    end)
```

这里有完整的脚本例子：[Skia with GN](https://github.com/xmake-io/xmake-repo/blob/master/packages/s/skia/xmake.lua)

### 在 Xmake 中查找使用 CMake/C++ 包

现在 CMake 已经是事实上的标准，所以 CMake 提供的 find_package 已经可以查找大量的系统库和模块，我们也可以完全复用 CMake 的这部分生态来扩充 xmake 对包的集成。

只需要像集成 vcpkg/conan 包那样，将包命名空间改成 `cmake::` 就可以了。

```lua
add_requires("cmake::ZLIB", {alias = "zlib", system = true})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

我们指定 `system = true` 告诉 xmake 强制从系统中调用 cmake 查找包，如果找不到，不再走安装逻辑，因为 cmake 没有提供类似 vcpkg/conan 等包管理器的安装功能，只提供了包查找特性。

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


### 在 Cmake 中集成 Xrepo 依赖包

除了可以在 Xmake 中集成 CMake 项目，我们也可以在 CMake 中直接集成 Xmake/Xrepo 提供的包，只需要使用 [xrepo-cmake](https://github.com/xmake-io/xrepo-cmake) 提供的 CMake Wrapper。

例如：

```cmake
cmake_minimum_required(VERSION 3.13.0)
project(foo)

# Download xrepo.cmake if not exists in build directory.
if(NOT EXISTS "${CMAKE_BINARY_DIR}/xrepo.cmake")
    message(STATUS "Downloading xrepo.cmake from https://github.com/xmake-io/xrepo-cmake/")
    # mirror https://cdn.jsdelivr.net/gh/xmake-io/xrepo-cmake@main/xrepo.cmake
    file(DOWNLOAD "https://raw.githubusercontent.com/xmake-io/xrepo-cmake/main/xrepo.cmake"
                  "${CMAKE_BINARY_DIR}/xrepo.cmake"
                  TLS_VERIFY ON)
endif()

# Include xrepo.cmake so we can use xrepo_package function.
include(${CMAKE_BINARY_DIR}/xrepo.cmake)

xrepo_package("zlib")

add_executable(example-bin "")
target_sources(example-bin PRIVATE
    src/main.cpp
)
xrepo_target_packages(example-bin zlib)
```

#### 添加带有配置的包

我们，也可以跟在 Xmake 中一样，定制包的可选特性。

```cmake
xrepo_package("gflags 2.2.2" CONFIGS "shared=true,mt=true")

add_executable(example-bin "")
target_sources(example-bin PRIVATE
    src/main.cpp
)
xrepo_target_packages(example-bin gflags)
```

#### 使用来自第三个存储库的包

除了从 Xmake 官方维护的存储库安装软件包之外，我们也可以直接在 CMake 中使用它来安装来自第三方仓库的包，只需将仓库名称添加为命名空间即可。

例如：`vcpkg::zlib`, `conan::pcre2`。

```cmake
xrepo_package("conan::gflags/2.2.2")
xrepo_package("conda::gflags 2.2.2")
xrepo_package("vcpkg::gflags")
xrepo_package("brew::gflags")
```

通过这种方式，我们将在 CMake 中集成使用 vcpkg/conan 包的方式进行了统一，并且额外提供了自动包安装特性，以及对 homebrew/conda 等其他包仓库的支持。
