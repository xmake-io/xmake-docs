---
title: Xmake v2.8.2 Released, Official package repository count over 1k
tags: [xmake, lua, C/C++, package, performance, API, rust]
date: 2023-08-22
author: Ruki
---

[Xmake](https://github.com/xmake-io/xmake) is a lightweight cross-platform build utility based on Lua.

It is very lightweight and has no dependencies because it has a built-in Lua runtime.

It uses xmake.lua to maintain project builds and its configuration syntax is very simple and readable.

We can use it to build project directly like Make/Ninja, or generate project files like CMake/Meson, and it also has a built-in package management system to help users solve the integrated use of C/C++ dependent libraries.

```
Xmake = Build backend + Project Generator + Package Manager + [Remote|Distributed] Build + Cache
```

Although not very precise, we can still understand Xmake in the following way:

```
Xmake ≈ Make/Ninja + CMake/Meson + Vcpkg/Conan + distcc + ccache/sccache
```

* [Github](https://github.com/xmake-io/xmake)
* [Document](https://xmake.io/)

<img src="https://github.com/xmake-io/xmake-docs/raw/master/assets/img/index/package.gif" width="650px" />

## Introduction of new features


In this release, we've added a number of useful APIs, removed some interfaces that were marked as deprecated a few years ago, and improved soname support for dynamic libraries.

Meanwhile, we've had some good news in the meantime: our [xmake-repo](https://github.com/xmake-io/xmake-repo) official repository has surpassed 1k packages, thanks to every contributor to Xmake, which is basically a repository of packages contributed by the community.

Especially @xq114, @star-hengxing, @SirLynix contributed a lot of packages, thank you very much~.

Also, the Xmake repository commits have reached 12k, and have been iterating rapidly. Here's a brief introduction to some of the major updates in the new version.

### Add soname support

In this release, we have added soname version support to the `set_version` interface, which is used to control the version compatibility of the so/dylib dynamic library.

You can configure the soname version suffix, and xmake will automatically generate a symbolic link to execute the specified version of the library when compiling and installing it.

For example, if we configure:

```lua
set_version("1.0.1", {soname = true})
```

xmake will automatically resolve the major version of the version number as the soname version, generating the following structure:

```
└── lib
    ├── libfoo.1.0.1.dylib
    ├── libfoo.1.0.1.dylib -> libfoo.1.0.1.dylib
    └── libfoo.dylib -> libfoo.1.dylib
```

Of course, we can also specify soname to a specific version naming:

```lua
set_version("1.0.1", {soname = "1.0"}) -> libfoo.so.1.0, libfoo.1.0.dylib
set_version("1.0.1", {soname = "1"}) -> libfoo.so.1, libfoo.1.dylib
set_version("1.0.1", {soname = "A"}) -> libfoo.so.A, libfoo.A.dylib
set_version("1.0.1", {soname = ""}) -> libfoo.so, libfoo.dylib
```

And if soname is not set, then soname version control is not enabled by default:

```lua
set_version("1.0.1") -> libfoo.so, libfoo.dylib
```





### Improve the add_vectorexts interface


The add_vectorexts interface is mainly used to add extended instruction optimisation options, and currently supports the following extended instruction sets:

```lua
add_vectorexts("mmx")
add_vectorexts("neon")
add_vectorexts("avx", "avx2", "avx512")
add_vectorexts("sse", "sse2", "sse3", "sse3", "sse4.2")
```

Where `avx512`, `sse4.2` are new directive configurations added to our new version, and we have also added a new `all` configuration item that can be used to turn on all extended directive optimisations as much as possible.

```lua
add_vectorexts("all")
```

### New set_encodings interface

This new interface is mainly used to set the encoding of source and target executables.

By default, if we just specify the encoding, it will work for both the source and target files.

```lua
-- for all source/target encodings
set_encodings("utf-8") -- msvc: /utf-8
```

It is equivalent to:

```lua
set_encodings("source:utf-8", "target:utf-8")
```

And it only supports utf-8 encodings for now, but will be expanded in the future.

If we just want to set the source file encoding or target file encoding individually, we can do that too.

#### Set source encoding

Usually this refers to the encoding of the source file of the compiled code, and we can set it like this.

```lua
-- gcc/clang: -finput-charset=UTF-8, msvc: -source-charset=utf-8
set_encodings("source:utf-8")
```

#### Set the target file encoding

It usually refers to the runtime output encoding of the target executable.

```lua
-- gcc/clang: -fexec-charset=UTF-8, msvc: -target-charset=utf-8
set_encodings("target:utf-8")
```

### New add_forceincludes interface

We have also added the ``add_forceincludes`` interface, which can be used to force the addition of ``includes`` headers directly in the configuration file.

```lua
add_forceincludes("config.h")
```

It works like `#include <config.h>`, but you don't need to add it explicitly in the source code.

Also, its search path is controlled by ``add_includedirs`` instead of the direct config file path.

```lua
add_forceincludes("config.h")
add_includedirs("src")
```

By default `add_forceincludes` matches c/c++/objc, if you just want to match c++ you can do so:

```lua
add_forceincludes("config.h", {sourcekinds = "cxx"})
```

If you want to match multiple source file types at the same time, that's also possible:


```lua
add_forceincludes("config.h", {sourcekinds = {"cxx", "mxx"}})
```

For gcc it sets the ``-include config.h`` flag, for msvc it sets the ``-FI config.h`` flag.

### New add_extrafiles interface

In previous versions, if we wanted to add extra files to the project list in the vs/vsxmake project builder, we could only add them via `add_headerfiles`, but that was a bit of a Hack.

Therefore, we have added the `add_extrafiles` interface specifically for configuring extra files to the project so that the user can also edit them with a quick click.

These added files are not code files, they are not compiled, they are not installed, they are just a way for the user to quickly edit and access them in the generated project IDE.

In the future, we may use this interface for other things as well.

```lua
add_extrafiles("assets/other.txt")
```

### sdasstm8 assembler support

@lanjackg2003 helped contribute sdcc/sdasstm8 assembler support, many thanks.

Related patch, [#4071](https://github.com/xmake-io/xmake/pull/4071)

### Improve Rust cross-compilation support

In this new release, we've also improved our Rust project builds by adding cross-compilation support, including cross-compilation of dependent packages.

```lua
set_arch("aarch64-unknown-none")
add_rules("mode.release", "mode.debug")
add_requires("cargo::test", {configs = {
    std = false,
    main = false, {cargo_toml = path
    cargo_toml = path.join(os.projectdir(), "Cargo.toml")}}))

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::test")
```

For example, in the project configuration above, we can cross-compile dependent packages, as well as our own project, by globally modifying the compilation architecture with `set_arch("aarch64-unknown-none")`.

If you don't have `set_arch` configured, you can also dynamically switch compilation architectures with the command `xmake f -a aarch64-unknown-none; xmake`.

Of course, don't forget to run `rustup target add aarch64-unknown-none` to install the corresponding target first.

For more context, see [#4049](https://github.com/xmake-io/xmake/issues/4049).


## Changelog

### New features

* [#4002](https://github.com/xmake-io/xmake/issues/4002): Add soname and version support
* [#1613](https://github.com/xmake-io/xmake/issues/1613): Add avx512 and sse4.2 for add_vectorexts
* [#2471](https://github.com/xmake-io/xmake/issues/2471): Add set_encodings to set source/target encodings
* [#4071](https://github.com/xmake-io/xmake/pull/4071): Support the stm8 assembler on the sdcc toolchain.
* [#4101](https://github.com/xmake-io/xmake/issues/4101): Add force includes for c/c++
* [#2384](https://github.com/xmake-io/xmake/issues/2384): Add extrafiles for vs/vsxmake generator

### Changes

* [#3960](https://github.com/xmake-io/xmake/issues/3960): Improve msys2/crt64 support
* [#4032](https://github.com/xmake-io/xmake/pull/4032): Remove some old deprecated apis
* Improve to upgrade vcproj files in tools.msbuild
* Support add_requires("xmake::xxx") package
* [#4049](https://github.com/xmake-io/xmake/issues/4049): Improve rust to support cross-compilation
* Improve clang modules support

### Bugs fixed

* Fix exit all child processes on macOS/Linux
