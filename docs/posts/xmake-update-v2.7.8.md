---
title: Xmake v2.7.8 released, Improve package virtual environment and build speed
tags: [xmake, lua, C/C++, package, performance, mingw64, wasm]
date: 2023-04-04
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

### Quickly switch temporary virtual environments

Xmake has long supported the virtual environment management of packages, and can switch between different package environments through configuration files.

We can customize some package configurations by adding the xmake.lua file in the current directory, and then enter a specific package virtual environment.

```lua
add_requires("zlib 1.2.11")
add_requires("python 3.x", "luajit")
```

```console
$ xrepo env shell
> python --version
> luajit --version
```

You can also switch environments by importing custom environment configuration files:

```console
$ xrepo env --add /tmp/base.lua
$ xrepo env -b base shell
```

In the new version, we have made further improvements, allowing Xrepo to temporarily specify the list of environment packages that need to be bound directly on the command line to achieve fast switching without any configuration.

And it supports specifying multiple package environments at the same time.

For example, we want to enter an environment with python 3.0, luajit and cmake, just execute:

```console
$ xrepo env -b "python 3.x,luajit,cmake" shell
[python, luajit, cmake] $ python --version
Python 3.10.6
[python, luajit, cmake] $ cmake --version
cmake version 3.25.3
```

Xmake will automatically install the relevant dependencies, and then open a new shell environment. There is also a prompt prompt on the left side of the terminal in the new environment.

If we want to exit the current environment, we only need to execute

```console
[python, luajit, cmake] $ xrepo env quit
$
```







### Improve code feature detection

A series of detection interfaces such as has_cfuncs/check_cxxsnippets have been provided in option, and there are corresponding auxiliary APIs to help detection.

For related documents, please refer to: [helper detection interface](https://xmake.io/api/description/helper-interfaces.html).

However, the current detection interface provided by option is only for the global platform tool chain, and it is impossible to perform targeted detection according to each specific target configuration.

Because the target itself may also have dependent packages, different tool chains, compilation macros and other differences, the detection results will also have some differences.

Therefore, if users want more flexible and fine-grained detection of the compilation characteristics of each target target, they can use the target target instance interface provided by the new version.

- target: has_cfuncs
- target: has_cxxfuncs
- target:has_ctypes
- target:has_cxxtypes
- target: has_cincludes
- target:has_cxxincludes
- target:has_cflags
- target:has_cxxflags
- target:has_features
- target: check_csnippets
- target: check_cxxsnippets

Here, only for some of the more commonly used interfaces, a little introduction to the usage.

#### target:has_cfuncs

- Check whether the target compilation configuration can obtain the given C function

This should be used in `on_config`, for example, it can be used to determine whether the current target can obtain some function interfaces of the zlib dependent package, and then automatically define `HAVE_INFLATE`:

```lua
add_requires("zlib")
target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib")
     on_config(function(target)
         if target:has_cfuncs("inflate", {includes = "zlib.h"}) then
             target:add("defines", "HAVE_INFLATE")
         end
     end)
```

Although option also provides similar detection functions, the detection of option uses the global platform tool chain, which cannot be accompanied by some compilation configurations related to target.
It is also impossible to set different compilation toolchains according to the target to adapt the detection, and it is impossible to detect some interfaces in the package.

If we only want a coarse-grained detection function interface, and the target does not additionally set different tool chains, then the detection function provided by option is sufficient.

If you want more fine-grained control over detection, you can use the detection features provided by the target instance interface.

#### target:has_cxxfuncs

- Check whether the target compilation configuration can obtain the given C++ function

The usage is similar to [target:has_cfuncs](https://xmake.io), except that it is mainly used to detect C++ functions.

However, while detecting functions, we can also additionally configure std languages to assist detection.

```
target:has_cxxfuncs("foo", {includes = "foo.h", configs = {languages = "cxx17"}})
```

#### target:has_ctypes

- Check whether the target compilation configuration can obtain the given C type

This should be used in `on_config` like this:

```lua
add_requires("zlib")
target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib")
     on_config(function(target)
         if target:has_ctypes("z_stream", {includes = "zlib.h"}) then
             target:add("defines", "HAVE_ZSTEAM_T")
         end
     end)
```

#### target:has_cflags

- Check whether the target compilation configuration can obtain the given C compilation flags

```lua
target("test")
     set_kind("binary")
     add_files("src/*.cpp")
     on_config(function(target)
         if target:has_cxxflags("-fPIC") then
             target:add("defines", "HAS_PIC")
         end
     end)
```

#### target:has_cincludes

- Check whether the target compilation configuration can obtain the given C header file

This should be used in `on_config`, for example, it can be used to determine whether the current target can obtain the zlib.h header file of the zlib dependency package, and then automatically define `HAVE_INFLATE`:

```lua
add_requires("zlib")
target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("zlib")
     on_config(function(target)
         if target:has_cincludes("zlib.h") then
             target:add("defines", "HAVE_ZLIB_H")
         end
     end)
```

#### target:check_cxxsnippets

- Detect if a given piece of C++ code can be compiled and linked

This should be used in `on_config` like this:

```lua
add_requires("libtins")
target("test")
     set_kind("binary")
     add_files("src/*.cpp")
     add_packages("libtins")
     on_config(function(target)
         local has_snippet = target:check_cxxsnippets({test = [[
             #include <string>
             using namespace Tins;
             void test() {
                 std::string name = NetworkInterface::default_interface().name();
                 printf("%s\n", name.c_str());
             }
         ]]}, {configs = {languages = "c++11"}, includes = {"tins/tins.h"}}))
         if has_snippet then
             target:add("defines", "HAS_XXX")
         end
     end)
```

By default, it only checks whether the compilation link is passed. If you want to try the runtime check, you can set `tryrun = true`.

```lua
target("test")
     set_kind("binary")
     add_files("src/*.cpp")
     on_config(function(target)
         local has_int_4 = target:check_cxxsnippets({test = [[
             return (sizeof(int) == 4)? 0 : -1;
         ]]}, {configs = {languages = "c++11"}, tryrun = true}))
         if has_int_4 then
             target:add("defines", "HAS_INT4")
         end
     end)
```

We can also continue to capture the running output of the detection by setting `output = true`, and add a custom `main` entry to achieve a complete test code, not just a code snippet.

```lua
target("test")
     set_kind("binary")
     add_files("src/*.cpp")
     on_config(function(target)
         local int_size = target:check_cxxsnippets({test = [[
             #include <stdio.h>
             int main(int argc, char** argv) {
                 printf("%d", sizeof(int)); return 0;
                 return 0;
             }
         ]]}, {configs = {languages = "c++11"}, tryrun = true,output = true}))
     end)
```

#### target:has_features

- Detect if specified C/C++ compilation feature

It is faster than using `check_cxxsnippets`, because it only performs preprocessing once to check all compiler features, instead of calling the compiler every time to try to compile.

```
target("test")
     set_kind("binary")
     add_files("src/*.cpp")
     on_config(function(target)
         if target:has_features("c_static_assert") then
             target:add("defines", "HAS_STATIC_ASSERT")
         end
         if target:has_features("cxx_constexpr") then
             target:add("defines", "HAS_CXX_CONSTEXPR")
         end
     end)
```

### Optimize compilation performance

The build cache acceleration of Xmake is similar to ccache, which uses the preprocessor to calculate the hash and cache the compiled object files to achieve acceleration. It has a very obvious speed-up effect on linux/mac.

And because the preprocessor of msvc is very slow, it may also be that the starting process is heavier than that under linux/mac. After the build cache is enabled, the overall compilation efficiency of using msvc on windows is much slower.

Trying to use a third-party ccache to test and compare, the same problem, so I temporarily disabled the build cache for msvc by default, so that the overall build speed returned to normal levels.

### clang-tidy autofix

In the last version, we added support for clang-tidy, and you can check the code through `xmake check clang.tidy`.
In this version, we continue to improve it and add the `--fix` parameter, which allows clang-tidy to automatically fix the detected problem code.

```console
$ xmake check clang.tidy --fix
$ xmake check clang.tidy --fix_errors
$ xmake check clang.tidy --fix_notes
```

### Swig/Java module build support

Additionally, other users have helped contribute build support for Swig/Java modules.

```
add_rules("mode. release", "mode. debug")

target("example")
     set_kind('shared')
     --set moduletype to java
     add_rules("swig.c", {moduletype = "java"})
     -- use swigflags to provider package name and output path of java files
     add_files("src/example.i", {swigflags = {
         "-package",
         "com. example",
         "-outdir",
         "build/java/com/example/"
     }})
     add_files("src/example.c")
     before_build(function()
         -- ensure output path exists before running swig
         os.mkdir("build/java/com/example/")
     end)
```

For a complete example, see: [Swig/Java Example](https://github.com/xmake-io/xmake/tree/master/tests/projects/swig/java_c)

## Changelog

### New features

* [#3518](https://github.com/xmake-io/xmake/issues/3518): Profile compile and link performance
* [#3522](https://github.com/xmake-io/xmake/issues/3522): Add has_cflags, has_xxx for target
* [#3537](https://github.com/xmake-io/xmake/issues/3537): Add --fix for clang.tidy checker

### Changes

* [#3433](https://github.com/xmake-io/xmake/issues/3433): Improve to build Qt project on msys2/mingw64 and wasm
* [#3419](https://github.com/xmake-io/xmake/issues/3419): Support fish shell envirnoment
* [#3455](https://github.com/xmake-io/xmake/issues/3455): Dlang incremental build support
* [#3498](https://github.com/xmake-io/xmake/issues/3498): Improve to bind package virtual envirnoments
* [#3504](https://github.com/xmake-io/xmake/pull/3504): Add swig java support
* [#3508](https://github.com/xmake-io/xmake/issues/3508): Improve trybuild/cmake to support for switching toolchain
* disable build cache for msvc, because msvc's preprocessor is too slow.

### Bugs fixed

* [#3436](https://github.com/xmake-io/xmake/issues/3436): Fix complete and menuconf
* [#3463](https://github.com/xmake-io/xmake/issues/3463): Fix c++modules cache issue
* [#3545](https://github.com/xmake-io/xmake/issues/3545): Fix parsedeps for armcc
