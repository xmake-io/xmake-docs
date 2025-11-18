---
title: Xmake v2.8.1 Released, Lots of Detailed Feature Improvements
tags: [xmake, lua, C/C++, package, performance, mingw64, wasm]
date: 2023-07-11
author: Ruki
outline: deep
---

## Introduction of new features

### Windows long path problem improvement

Windows' long path limitation has always been a big problem. Projects that are nested too deeply may fail when reading or writing files, which affects xmake's usability and experience.

Although xmake has provided various measures to avoid this problem, it still suffers from some limitations occasionally. In this release, we have improved the installer by providing an installation option that lets you selectively enable long path support.

This requires administrator privileges, as it requires a registry write.

```
WriteRegDWORD ${HKLM} "SYSTEM\CurrentControlSet\Control\FileSystem" "LongPathsEnabled" 1
```

Users can decide for themselves, whether they need to turn it on or not.

Thanks to @A2va for the contribution.

### zypper package manager support

Added support for OpenSUSE's zypper package manager, which can be automatically downloaded and installed directly from zypper, and integrates with the packages it provides.

Thanks to @iphelf for his contribution.

```lua
add_requires("zypper::libsfml2 2.5")
```

### Improve msbuild package installation

Some third-party packages, which are not maintained by cmake, just provide the vcproj project file, and if we make it into a package, we need to use the ``tools.msbuild`` module to compile and install it.

But if the vs version of vcproj is very old, we need to upgrade it, otherwise the compilation will fail.

So we have improved the tools.msbuild module to provide automatic vcproj upgrades by specifying the vcproj/sln files that need to be upgraded.

```lua
package("test")
    on_install(function (package)
        import("package.tools.msbuild").build(package, configs, {upgrade={"wolfssl64.sln", "wolfssl.vcxproj"}}))
    end)
```






### Improved protobuf support for grpc

We have improved protobuf support to also support the grpc_cpp_plugin.

```lua
add_rules("mode.debug", "mode.release")
add_requires("protobuf-cpp")
add_requires("grpc", {system = false})

target("test")
    set_kind("binary")
    set_languages("c++17")
    add_packages("protobuf-cpp")
    add_packages("grpc")
    add_rules("protobuf.cpp")
    add_files("src/*.cpp")
    add_files("src/test.proto", {proto_rootdir = "src", proto_grpc_cpp_plugin = true})
    add_files("src/subdir/test2.proto", {proto_rootdir = "src"})
```

For a full example see: [protobuf_grpc_cpp_plugin](https://github.com/xmake-io/xmake/blob/dev/tests/projects/c%2B%2B/protobuf_grpc_cpp_plugin/xmake. lua)

### add_links support for library paths

Normally add_links needs to be used in conjunction with add_linkdirs in order for the linker to find library files in the specified directory.

However, sometimes it is easy to find the wrong library if it is not configured correctly, or if libraries are renamed in different paths. Now add_links can be used to set the path of library files directly to avoid implicit search.

It can also be used to explicitly link so/a libraries.

The following writeups are supported:

```lua
add_links("foo")
add_links("libfoo.a")
add_links("libfoo.so")
add_links("/tmp/libfoo.a")
add_links("/tmp/libfoo.so")
add_links("foo.lib")
``

### Objc/Objc++ header pre-compilation support

In previous versions, if we used `set_pcxxheader` to set c++ header precompilation, it would also affect objc code.

So if the C++/ObjC++ code is compiled mixed with pre-compiled headers, you will encounter compilation problems.

```bash
Objective-C was disabled in PCH file but is currently enabled
``

This is because the compilation of the precompiled header also requires the language `-x c++-header`, `-x objective-c++-header`, which cannot be mixed in the PCH file.

Therefore, we added `set_pmheader` and `set_pmxxheader` interfaces to set objc/objc++ precompiled headers separately, which do not conflict with C/C++ precompiled headers.

But the usage is exactly the same.

```lua
target("test")
    set_pmxxheader("header.h")
```

For a full example see: [Objc Precompiled Header Example](https://github.com/xmake-io/xmake/tree/master/tests/projects/objc%2B%2B/precompiled_header)

### Improved Conan 2.0 support

In the last release, we initially supported Conan 2.0, but we encountered a number of detailed problems. In this release, we have continued to make improvements, such as improving the vs_runtime setting.

### Updating the lua runtime

Lua has recently released version 5.4.6, and we've updated the Lua runtime built into xmake to keep up with the upstream.

## Changelog

### New features

* [#3821](https://github.com/xmake-io/xmake/pull/3821): Add longpath option for windows installer
* [#3828](https://github.com/xmake-io/xmake/pull/3828): Add support for zypper package manager
* [#3871](https://github.com/xmake-io/xmake/issues/3871): Improve tools.msbuild to support for upgrading vsproj
* [#3148](https://github.com/xmake-io/xmake/issues/3148): Support grpc for protobuf
* [#3889](https://github.com/xmake-io/xmake/issues/3889): Support to add library path for add_links
* [#3912](https://github.com/orgs/xmake-io/issues/3912): Add set_pmxxheader to support objc precompiled header
* add_links support library file path

### Changes

* [#3752](https://github.com/xmake-io/xmake/issues/3752): Improve os.getenvs for windows
* [#3371](https://github.com/xmake-io/xmake/issues/3371): Improve tools.cmake to support ninja generator for wasm
* [#3777](https://github.com/xmake-io/xmake/issues/3777): Improve to find package from pkg-config
* [#3815](https://github.com/xmake-io/xmake/pull/3815): Improve tools.xmake to pass toolchains for windows
* [#3857](https://github.com/xmake-io/xmake/issues/3857): Improve to generate compile_commands.json
* [#3892](https://github.com/xmake-io/xmake/issues/3892): Improve to search packages from description
* [#3916](https://github.com/xmake-io/xmake/issues/3916): Improve to build swift program, support for multiple modules
* Update lua runtime to 5.4.6

### Bugs fixed

* [#3755](https://github.com/xmake-io/xmake/pull/3755): Fix find_tool from xmake/packages
* [#3787](https://github.com/xmake-io/xmake/issues/3787): Fix packages from conan 2.x
* [#3839](https://github.com/orgs/xmake-io/discussions/3839): Fix vs_runtime for conan 2.x
