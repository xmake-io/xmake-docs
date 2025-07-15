---
title: Xmake v2.6.3 released, Support Vcpkg manifest mode
tags: [xmake, lua, C/C++, Vcpkg]
date: 2022-01-22
author: Ruki
---
## New version changes

This version mainly adds the following features:

1. Implement version selection of vcpkg package through vcpkg's manifest mode
2. Python module build support
3. Support integration of Xrepo/Xmake package management in CMakeLists.txt

The rest are mainly some scattered functional improvements and Bugs fixes. You can see the details of the update at the end of the following. Some major changes will be explained one by one below.

## Introduction of new features

### Support Vcpkg manifest mode

In the new version, Xmake adds vcpkg manifest mode support, through which we can support the version selection of vcpkg package, for example:

```lua
add_requires("vcpkg::zlib 1.2.11+10")
add_requires("vcpkg::fmt >=8.0.1", {configs = {baseline = "50fd3d9957195575849a49fa591e645f1d8e7156"}})
add_requires("vcpkg::libpng", {configs = {features = {"apng"}}})

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("vcpkg::zlib", "vcpkg::fmt", "vcpkg::libpng")
```

However, the version selection of vcpkg is still quite limited. It must be hard-coded to specify the baseline, and version semantic selection such as `<=1.0`, `1.x` is not supported, but it is better than the previous version that cannot be selected.

### Using Xrepo's package management in CMake

CMake wrapper for [Xrepo](https://xrepo.xmake.io/) C and C++ package manager.

This allows using CMake to build your project, while using Xrepo to manage
dependent packages. This project is partially inspired by
[cmake-conan](https://github.com/conan-io/cmake-conan).

Example use cases for this project:

- Existing CMake projects which want to use Xrepo to manage packages.
- New projects which have to use CMake, but want to use Xrepo to manage
  packages.

#### Use package from official repository

Xrepo official repository: [xmake-repo](https://github.com/xmake-io/xmake-repo)

[xrepo.cmake](https://github.com/xmake-io/xrepo-cmake/blob/main/xrepo.cmake) provides `xrepo_package` function to manage packages.

```cmake
xrepo_package(
    "foo 1.2.3"
    [CONFIGS feature1=true,feature2=false]
    [MODE debug|release]
    [OUTPUT verbose|diagnosis|quiet]
    [DIRECTORY_SCOPE]
)
```





Some of the function arguments correspond directly to Xrepo command options.

After calling `xrepo_package(foo)`, there are two ways to use `foo` package:

- Call `find_package(foo)` if package provides cmake modules to find it
  - Refer to CMake [`find_package`](https://cmake.org/cmake/help/latest/command/find_package.html) documentation for more details
- If the package does not provide cmake modules, `foo_INCLUDE_DIR` and
  `foo_LINK_DIR` variables will be set to the package include and library paths.
  Use these variables to setup include and library paths in your CMake code.
  - If `DIRECTORY_SCOPE` is specified, `xrepo_package` will run following code
    (so that user only need to specify lib name in `target_link_libraries`)
  ```cmake
    include_directories(foo_INCLUDE_DIR)
    link_directories(foo_LINK_DIR)
  ```

Here's an example `CMakeLists.txt` that uses `gflags` package version 2.2.2
managed by Xrepo.

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

#### Use package from 3rd repository

In addition to installing packages from officially maintained repository,
Xrepo can also install packages from third-party package managers such as vcpkg/conan/conda/pacman/homebrew/apt/dub/cargo.

For the use of the command line, we can refer to the documentation: [Xrepo command usage](https://xrepo.xmake.io/#/getting_started#install-packages-from-third-party-package-manager)

We can also use it directly in cmake to install packages from third-party repositories, just add the repository name as a namespace. e.g. `vcpkg::zlib`, `conan::pcre2`

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

### Python module building support

We can use this rule to generate python library modules with pybind11, which will adjust the module name of the python library.

```lua
add_rules("mode.release", "mode.debug")
add_requires("pybind11")

target("example")
    add_rules("python.library")
    add_files("src/*.cpp")
    add_packages("pybind11")
    set_languages("c++11")
```

with soabi:

```lua
add_rules("mode.release", "mode.debug")
add_requires("pybind11")

target("example")
    add_rules("python.library", {soabi = true})
    add_files("src/*.cpp")
    add_packages("pybind11")
    set_languages("c++11")
```

### Added delete header file list interface

Through this interface, the specified file can be removed from the list of header files added by the `add_headerfiles` interface, for example:

```lua
target("test")
    add_headerfiles("src/*.h")
    remove_headerfiles("src/test.h")
```

In the above example, all header files except `test.h` can be added from the `src` directory, of course, this can also be achieved by `add_headerfiles("src/*.h|test.h")` to achieve the same purpose , but this way is more flexible.

### Added on_config configuration script

After `xmake config` is executed, this script is executed before Build, which is usually used for configuration work before compilation. It differs from on_load in that on_load is executed as soon as the target is loaded, and the execution timing is earlier.

If some configuration cannot be configured prematurely in on_load, it can be configured in on_config.

In addition, its execution time is earlier than before_build, and the approximate execution flow is as follows:

```
on_load -> after_load -> on_config -> before_build -> on_build -> after_build
```

### Built-in Github proxy mirror configuration

Xmake provides some built-in mirror configurations that can be used directly, such as github's mirror acceleration:

```console
$ xmake g --proxy_pac=github_mirror.lua
```

We don't have to write pac.lua ourselves, we can use it directly to speed up the download of github sources.

## Changelog

### New features

* [#1298](https://github.com/xmake-io/xmake/issues/1928): Support vcpkg manifest mode and select version for package/install
* [#1896](https://github.com/xmake-io/xmake/issues/1896): Add `python.library` rule to build pybind modules
* [#1939](https://github.com/xmake-io/xmake/issues/1939): Add `remove_files`, `remove_headerfiles` and mark `del_files` as deprecated
* Made on_config as the official api for rule/target
* Add riscv32/64 support
* [#1970](https://github.com/xmake-io/xmake/issues/1970): Add CMake wrapper for Xrepo C and C++ package manager.
* Add builtin github mirror pac files, `xmake g --proxy_pac=github_mirror.lua`

### Changes

* [#1923](https://github.com/xmake-io/xmake/issues/1923): Improve to build linux driver, support set custom linux-headers path
* [#1962](https://github.com/xmake-io/xmake/issues/1962): Improve armclang toolchain to support to build asm
* [#1959](https://github.com/xmake-io/xmake/pull/1959): Improve vstudio project generator
* [#1969](https://github.com/xmake-io/xmake/issues/1969): Add default option description

### Bugs fixed

* [#1875](https://github.com/xmake-io/xmake/issues/1875): Fix deploy android qt apk issue
* [#1973](https://github.com/xmake-io/xmake/issues/1973): Fix merge static archive
