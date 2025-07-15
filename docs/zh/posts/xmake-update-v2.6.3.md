---
title: xmake v2.6.3 发布，支持 vcpkg 清单模式
tags: [xmake, lua, C/C++, Linux, Vcpkg]
date: 2022-01-22
author: Ruki
---

## 新版本改动

这个版本主要新增下面几个特性：

1. 通过 vcpkg 的清单模式实现 vcpkg 包的版本选择
2. python 模块构建支持
3. 支持在 CMakeLists.txt 中集成 Xrepo/Xmake 包管理

剩下的主要是一些零散的功能改进和 Bugs 修复，可以看下文末的更新内容明细，一些比较大的改动，下面也会逐一说明。

## 新特性介绍

### 支持 Vcpkg 清单模式

新版本中，Xmake 新增了 vcpkg 清单模式支持，通过它，我们就能支持 vcpkg 包的版本选择，例如：

```lua
add_requires("vcpkg::zlib 1.2.11+10")
add_requires("vcpkg::fmt >=8.0.1", {configs = {baseline = "50fd3d9957195575849a49fa591e645f1d8e7156"}})
add_requires("vcpkg::libpng", {configs = {features = {"apng"}}})

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("vcpkg::zlib", "vcpkg::fmt", "vcpkg::libpng")
```

但是，vcpkg 的版本选择限制还是不少，必须要硬编码指定 baseline，而且还不支持 `<=1.0`, `1.x` 等版本语义选择，不过总比之前不能选择版本好了不少。

### 在 CMake 中使用 Xrepo 的依赖包管理

我们新增了一个独立项目 [xrepo-cmake](https://github.com/xmake-io/xrepo-cmake)。

它是一个基于 Xrepo/Xmake 的 C/C++ 包管理器的 CMake 包装器。

这允许使用 CMake 来构建您的项目，同时使用 Xrepo 来管理依赖包。这个项目的部分灵感来自 [cmake-conan](https://github.com/conan-io/cmake-conan)。

此项目的示例用例：

- 想要使用 Xrepo 管理包的现有 CMake 项目。
- 必须使用 CMake，但想使用 Xrepo 管理的新项目包。

#### 使用来自官方存储库的包

Xrepo 官方仓库：[xmake-repo](https://github.com/xmake-io/xmake-repo)

[xrepo.cmake](https://github.com/xmake-io/xrepo-cmake/blob/main/xrepo.cmake) 提供`xrepo_package`函数来管理包。

```cmake
xrepo_package(
    "foo 1.2.3"
    [CONFIGS feature1=true,feature2=false]
    [MODE debug|release]
    [OUTPUT verbose|diagnosis|quiet]
    [DIRECTORY_SCOPE]
)
```






一些函数参数直接对应于 Xrepo 命令选项。

调用 `xrepo_package(foo)` 后，有两种使用 `foo` 包的方法：

- 如果包提供 cmake 模块来查找它，则调用 `find_package(foo)`, 参考 CMake [`find_package`](https://cmake.org/cmake/help/latest/command/find_package.html) 文档了解更多详情
- 如果包不提供 cmake 模块，`foo_INCLUDE_DIR` 和 `foo_LINK_DIR` 变量将设置为包包含和库路径。使用这些变量在 CMake 代码中设置包含和库路径。
- 如果指定了 `DIRECTORY_SCOPE`，则 `xrepo_package` 将运行以下代码（这样用户只需要在 `target_link_libraries` 中指定库名称）

```cmake
include_directories(foo_INCLUDE_DIR)
link_directories(foo_LINK_DIR)
```

这是一个使用 `gflags` 包版本 2.2.2 的示例 `CMakeLists.txt` 由 Xrepo 管理。

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

# Call `xrepo_package` function to use gflags 2.2.2 with specific configs.
xrepo_package("gflags 2.2.2" CONFIGS "shared=true,mt=true")

# `xrepo_package` sets `gflags_DIR` variable in parent scope because gflags
# provides cmake modules. So we can now call `find_package` to find gflags
# package.
find_package(gflags CONFIG COMPONENTS shared)
```

#### 使用来自第三个存储库的包

除了从官方维护的存储库安装软件包之外，Xrepo 还可以安装来自第三方包管理器的包，例如 vcpkg/conan/conda/pacman/homebrew/apt/dub/cargo。

关于命令行的使用，我们可以参考文档：[Xrepo命令用法](https://xrepo.xmake.io/#/getting_started#install-packages-from-third-party-package-manager)

我们也可以直接在 cmake 中使用它来安装来自第三方仓库的包，只需将仓库名称添加为命名空间即可。例如：`vcpkg::zlib`, `conan::pcre2`

##### Conan

```cmake
xrepo_package("conan::gflags/2.2.2")
```

##### Conda

```cmake
xrepo_package("conda::gflags 2.2.2")
```

##### Vcpkg

```cmake
xrepo_package("vcpkg::gflags")
```

##### Homebrew

```cmake
xrepo_package("brew::gflags")
```

### Python 模块构建支持

我们可以用这个规则，配合 pybind11 生成 python 库模块，它会调整 python 库的模块名。

```lua
add_rules("mode.release", "mode.debug")
add_requires("pybind11")

target("example")
    add_rules("python.library")
    add_files("src/*.cpp")
    add_packages("pybind11")
    set_languages("c++11")
```

带有 soabi：

```lua
add_rules("mode.release", "mode.debug")
add_requires("pybind11")

target("example")
    add_rules("python.library", {soabi = true})
    add_files("src/*.cpp")
    add_packages("pybind11")
    set_languages("c++11")
```

### 新增删除头文件列表接口

通过此接口，可以从 `add_headerfiles` 接口添加的头文件列表中，删除指定的文件，例如：

```lua
target("test")
    add_headerfiles("src/*.h")
    remove_headerfiles("src/test.h")
```

上面的例子，可以从`src`目录下添加除`test.h`以外的所有头文件，当然这个也可以通过 `add_headerfiles("src/*.h|test.h")` 来达到相同的目的，但是这种方式更加灵活。

### 新增 on_config 配置脚本

在 `xmake config` 执行完成后，Build 之前会执行此脚本，通常用于编译前的配置工作。它与 on_load 不同的是，on_load 只要 target 被加载就会执行，执行时机更早。

如果一些配置，无法在 on_load 中过早配置，那么都可以在 on_config 中去配置它。

另外，它的执行时机比 before_build 还要早，大概的执行流程如下：

```
on_load -> after_load -> on_config -> before_build -> on_build -> after_build
```

### 内置 Github 代理镜像配置

Xmake 提供了一些内置的镜像配置可以直接使用，例如 github 的镜像加速：

```console
$ xmake g --proxy_pac=github_mirror.lua
```

我们不用自己编写 pac.lua，就可以直接使用它来加速 github 源的下载。

## 更新内容

### 新特性

* [#1298](https://github.com/xmake-io/xmake/issues/1928): 支持 vcpkg 清单模式安装包，实现安装包的版本选择
* [#1896](https://github.com/xmake-io/xmake/issues/1896): 添加 `python.library` 规则去构建 pybind 模块，并且支持 soabi
* [#1939](https://github.com/xmake-io/xmake/issues/1939): 添加 `remove_files`, `remove_headerfiles` 并且标记 `del_files` 作为废弃接口
* 将 on_config 作为正式的公开接口，用于 target 和 rule
* 添加 riscv32/64 支持
* [#1970](https://github.com/xmake-io/xmake/issues/1970): 添加 CMake wrapper 支持在 CMakelists 中去调用 xrepo 集成 C/C++ 包
* 添加内置的 github 镜像加速 pac 代理文件, `xmake g --proxy_pac=github_mirror.lua`

### 改进

* [#1923](https://github.com/xmake-io/xmake/issues/1923): 改进构建 linux 驱动，支持设置自定义 linux-headers 路径
* [#1962](https://github.com/xmake-io/xmake/issues/1962): 改进 armclang 工具链去支持构建 asm
* [#1959](https://github.com/xmake-io/xmake/pull/1959): 改进 vstudio 工程生成器
* [#1969](https://github.com/xmake-io/xmake/issues/1969): 添加默认的 option 描述

### Bugs 修复

* [#1875](https://github.com/xmake-io/xmake/issues/1875): 修复部署生成 Android Qt 程序包失败问题
* [#1973](https://github.com/xmake-io/xmake/issues/1973): 修复合并静态库
* [#1982](https://github.com/xmake-io/xmake/pull/1982): 修复 clang 下对 c++20 子模块的依赖构建
