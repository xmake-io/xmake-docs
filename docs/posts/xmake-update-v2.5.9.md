---
title: xmake v2.5.9 released, Improve C++20 Modules and support Nim, Keil MDK and Unity Build
tags: [xmake, lua, C/C++, Nim, Keil, MDK, circle, Unity, Build, C++20, Modules, lua5.4]
date: 2021-10-30
author: Ruki
---

Unity Build', tags: [xmake, lua, C/C++, Nim, Keil, MDK, circle, Unity, Build,]
---

[xmake](https://github.com/xmake-io/xmake) is a lightweight cross-platform build tool based on Lua. It uses xmake.lua to maintain project builds. Compared with makefile/CMakeLists.txt, the configuration syntax is more Concise and intuitive, it is very friendly to novices, and you can get started quickly in a short time, allowing users to focus more on actual project development.

In this version, we have added a lot of heavyweight new features, such as: Nim language project build support, Keil MDK, Circle and Wasi toolchain support.

In addition, we have made major improvements to C++20 Modules, not only supporting the latest gcc-11, clang and msvc compilers,
but also automatic analysis of inter-module dependencies to achieve maximum parallel compilation support.

Finally, there is a more useful feature that is Unity Build support, through which we can greatly improve the compilation speed of C++ code.

* [Github](https://github.com/xmake-io/xmake)
* [Document](https://xmake.io/)

## New feature introduction

### Nimlang project construction

Recently, we have added build support for the Nimlang project. For related issues, see: [#1756](https://github.com/xmake-io/xmake/issues/1756)

#### Create an empty project

We can use the `xmake create` command to create an empty project.

```console
xmake create -l nim -t console test
xmake create -l nim -t static test
xmake create -l nim -t shared test
```

#### Console Program

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
```

```console
$ xmake -v
[33%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache -o:b
uild/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```






#### Static library program

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("static")
    add_files("src/foo.nim")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.nim")
```

```console
$ xmake -v
[33%]: linking.release libfoo.a
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/foo/macosx/x86_64/release/nimcache --app
:staticlib --noMain --passC:-DNimMain=NimMain_B6D5BD02 --passC:-DNimMainInner=NimMainInner_B6D5B
D02 --passC:-DNimMainModule=NimMainModule_B6D5BD02 --passC:-DPreMain=PreMain_B6D5BD02 --passC:-D
PreMainInner=PreMainInner_B6D5BD02 -o:build/macosx/x86_64/release/libfoo.a src/foo.nim
[66%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache --pa
ssL:-Lbuild/macosx/x86_64/release --passL:-lfoo -o:build/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

#### Dynamic library program

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("shared")
    add_files("src/foo.nim")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.nim")
```

```console
$ xmake -rv
[33%]: linking.release libfoo.dylib
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/foo/macosx/x86_64/release/nimcache --app
:lib --noMain -o:build/macosx/x86_64/release/libfoo.dylib src/foo.nim
[66%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache --pa
ssL:-Lbuild/macosx/x86_64/release --passL:-lfoo -o:build/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

#### C code mixed compilation

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("static")
    add_files("src/*.c")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.nim")
```

#### Nimble dependency package integration

For a complete example, see: [Nimble Package Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/nim/nimble_package)

```lua
add_rules("mode.debug", "mode.release")

add_requires("nimble::zip >0.3")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
    add_packages("nimble::zip")
```

main.nim

```nim
import zip/zlib

echo zlibVersion()
```

#### Native dependency package integration

For a complete example, see: [Native Package Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/nim/native_package)

```lua
add_rules("mode.debug", "mode.release")

add_requires("zlib")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
    add_packages("zlib")
```

main.nim

```nim
proc zlibVersion(): cstring {.cdecl, importc}

echo zlibVersion()
```

### Unity Build acceleration

We know that C++ code compilation speed is usually very slow, because each code file needs to parse the imported header file.

With Unity Build, we accelerate the compilation of the project by combining multiple cpp files into one. The main benefit is to reduce the repetitive work of parsing and compiling the contents of the header files contained in multiple source files. The contents of the header files are usually It accounts for most of the code in the source file after preprocessing.

Unity build also reduces the overhead caused by having a large number of small source files by reducing the number of object files created and processed by the compilation chain, and allows inter-procedural analysis and optimization across files that form a unified build task (similar to optimization during effect linking ).

It can greatly improve the compilation speed of C/C++ code, usually by 30%. However, depending on the complexity of the project, the benefits it brings depend on the situation of the project.

xmake has also supported this build mode in v2.5.9. For related issues, see [#1019](https://github.com/xmake-io/xmake/issues/1019).

#### How to enable?

We provide two built-in rules to handle Unity Build for C and C++ code respectively.

```lua
add_rules("c.unity_build")
add_rules("c++.unity_build")
```

#### Batch mode

By default, as long as the above rules are set, Unity Build in Batch mode will be enabled, that is, xmake will automatically organize and merge according to the project code files.

```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2})
    add_files("src/*.c", "src/*.cpp")
```

We can additionally specify the size of each merged Batch by setting the `{batchsize = 2}` parameter to the rule, which means that every two C++ files are automatically merged and compiled.

The compilation effect is roughly as follows:

```console
$ xmake -r
[11%]: ccache compiling.release build/.gens/test/unity_build/unity_642A245F.cpp
[11%]: ccache compiling.release build/.gens/test/unity_build/unity_bar.cpp
[11%]: ccache compiling.release build/.gens/test/unity_build/unity_73161A20.cpp
[11%]: ccache compiling.release build/.gens/test/unity_build/unity_F905F036.cpp
[11%]: ccache compiling.release build/.gens/test/unity_build/unity_foo.cpp
[11%]: ccache compiling.release build/.gens/test/unity_build/main.c
[77%]: linking.release test
[100%]: build ok
```

Since we only enabled the Unity Build of C++, the C code is still compiled one by one normally. In addition, in the Unity Build mode, we can still speed up the parallel compilation as much as possible without conflicting each other.

If the `batchsize` parameter is not set, all files will be merged into one file for compilation by default.

#### Group Mode

If the automatic merging effect of the above Batch mode is not satisfactory, we can also use custom grouping to manually configure which files are merged together to participate in the compilation, which makes users more flexible and controllable.

```lua
target("test")
    set_kind("binary")
    add_rules("c++.unity_build", {batchsize = 0}) - disable batch mode
    add_files("src/*.c", "src/*.cpp")
    add_files("src/foo/*.c", {unity_group = "foo"})
    add_files("src/bar/*.c", {unity_group = "bar"})
```

We use `{unity_group = "foo"}` to specify the name of each group and which files are included. The files in each group will be merged into one code file separately.

In addition, `batchsize = 0` also forcibly disables the Batch mode, that is, if there is no unity_group grouped code files, we will still compile them separately, and will not automatically turn on automatic merging.

#### Batch and Group mixed mode

As long as we change the above `batchsize = 0` to a value other than 0, we can let the remaining code files continue to open the Batch mode in the grouping mode to automatically merge and compile.

```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2})
    add_files("src/*.c", "src/*.cpp")
    add_files("src/foo/*.c", {unity_group = "foo"})
    add_files("src/bar/*.c", {unity_group = "bar"})
```

#### Ignore the specified file

If it is in Batch mode, because it is an automatic merge operation, all files will be merged by default, but if some code files do not want to participate in the merge, then we can also ignore them through `{unity_ignored = true}`.

```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2})
    add_files("src/*.c", "src/*.cpp")
    add_files("src/test/*.c", {unity_ignored = true}) - ignore these files
```

#### Unique ID

Although the benefits of Unity Build are good, we still encounter some unexpected situations. For example, in our two code files, under the global namespace, there are global variables and functions with the same name.

Then, merge compilation will bring about compilation conflicts, and the compiler usually reports global variable redefinition errors.

In order to solve this problem, we need to make some modifications to the user code, and then cooperate with the build tool to solve it.

For example, our foo.cpp and bar.cpp both have global variable i.

foo.cpp

```c
namespace {
    int i = 42;
}

int foo()
{
    return i;
}
```

bar.cpp

```c
namespace {
    int i = 42;
}

int bar()
{
    return i;
}
```

Then, our merge compilation will conflict, and we can introduce a Unique ID to isolate the global anonymous space.


foo.cpp

```c
namespace MY_UNITY_ID {
    int i = 42;
}

int foo()
{
    return MY_UNITY_ID::i;
}
```

bar.cpp

```c
namespace MY_UNITY_ID {
    int i = 42;
}

int bar()
{
    return MY_UNITY_ID::i;
}
```

Next, we also need to ensure that after the code is merged, the definitions of `MY_UNITY_ID` in foo and bar are completely different, and a unique ID value can be calculated according to the file name, which does not conflict with each other, which is to achieve the following merge effect:

```c
#define MY_UNITY_ID <hash(foo.cpp)>
#include "foo.c"
#undef MY_UNITY_ID
#define MY_UNITY_ID <hash(bar.cpp)>
#include "bar.c"
#undef MY_UNITY_ID
```

This may seem troublesome, but the user does not need to care about these, xmake will automatically process them when merging, the user only needs to specify the name of the Unique ID, for example, the following:


```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2, uniqueid = "MY_UNITY_ID"})
    add_files("src/*.c", "src/*.cpp")
```

Dealing with global variables, as well as global macro definitions with the same name, functions, etc., can be used in this way to avoid conflicts.

### C++20 Modules

xmake uses `.mpp` as the default module extension, but also supports `.ixx`, `.cppm`, `.mxx` and other extensions.

In the early days, xmake experimentally supported C++ Modules TS, but at that time, gcc could not support it well, and the dependencies between modules were not supported either.

Recently, we have made a lot of improvements to xmake. We have fully supported the C++20 Modules construction support of gcc-11/clang/msvc, and can automatically analyze the dependencies between modules to maximize parallel compilation.

At the same time, the new version of clang/msvc has also been better handled.

```lua
set_languages("c++20")
target("test")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

For more examples, see: [C++ Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules)

### Lua5.4 runtime support

In the last version, we added support for the Lua5.3 runtime. In this version, we further upgraded the Lua runtime to 5.4. Compared with 5.3, the runtime performance and memory utilization have been greatly improved.

However, the current default runtime of xmake is still luajit, and it is expected that version 2.6.1 (that is, the next version) will officially switch to Lua5.4 as the default runtime.

Although the Lua runtime is switched, it is completely unaware to the user side and fully compatible with the existing project configuration, because xmake originally provides a layer of encapsulation for the exposed api.
The interfaces that have compatibility issues between Lua versions, such as setfenv, ffi, etc., are hidden internally and are not exposed to users.

### Keil MDK tool chain support

In this version, we also added Keil/MDK embedded compilation tool chain support, related example projects: [Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects /mdk/hello)

xmake will automatically detect the compiler installed by Keil/MDK, related issues [#1753](https://github.com/xmake-io/xmake/issues/1753).

#### Compile with armcc

```console
$ xmake f -p cross -a cortex-m3 --toolchain=armcc -c
$ xmake
```

#### Compile with armclang

```console
$ xmake f -p cross -a cortex-m3 --toolchain=armclang -c
$ xmake
```

#### Console Program

```lua
target("hello")
    add_deps("foo")
    add_rules("mdk.console")
    add_files("src/*.c", "src/*.s")
    add_defines("__EVAL", "__MICROLIB")
    add_includedirs("src/lib/cmsis")
```

#### Static library program

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    add_rules("mdk.static")
    add_files("src/foo/*.c")
```

### Wasi toolchain support

We previously supported the emcc tool chain of the wasm platform to build the wasm program, and here, we added another Wasm tool chain with WASI enabled to replace emcc.

```console
$ xmake f -p wasm --toolchain=wasi
$ xmake
```

### Circle toolchain support

We also added support for the circle compiler, which is a new C++20 compiler with some interesting compile-time meta-programming features. Those who are interested can check it out on the official website: https://www.circle -lang.org/

```console
$ xmake f --toolchain=circle
$ xmake
```

### gcc-8/9/10/11 specific version support

If the user additionally installs a specific version of the gcc tool chain such as gcc-11, gcc-10, the local gcc program may be named `/usr/bin/gcc-11`.

One way is to switch by specifying the configuration one by one through `xmake f --cc=gcc-11 --cxx=gcc-11 --ld=g++-11`, but it is very cumbersome.

Therefore, xmake also provides a faster switching method:

```console
$ xmake f --toolchain=gcc-11 -c
$ xmake
```

You only need to specify the version name corresponding to `gcc-11` to quickly switch the entire gcc tool chain.

### C++17/20 Compiler feature detection

xmake provides the check_features auxiliary interface to detect compiler features.

```lua
includes("check_features.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")
    configvar_check_features("HAS_CONSTEXPR", "cxx_constexpr")
    configvar_check_features("HAS_CONSEXPR_AND_STATIC_ASSERT", {"cxx_constexpr", "c_static_assert"}, {languages ​​= "c++11"})
```

config.h.in

```c
${define HAS_CONSTEXPR}
${define HAS_CONSEXPR_AND_STATIC_ASSERT}
```

config.h

```c
/* #undef HAS_CONSTEXPR */
#define HAS_CONSEXPR_AND_STATIC_ASSERT 1
```

In version 2.5.9, we added c++17 feature detection:

| Feature name |
| ------------------------------------ |
| cxx_aggregate_bases |
| cxx_aligned_new |
| cxx_capture_star_this |
| cxx_constexpr |
| cxx_deduction_guides |
| cxx_enumerator_attributes |
| cxx_fold_expressions |
| cxx_guaranteed_copy_elision |
| cxx_hex_float |
| cxx_if_constexpr |
| cxx_inheriting_constructors |
| cxx_inline_variables |
| cxx_namespace_attributes |
| cxx_noexcept_function_type |
| cxx_nontype_template_args |
| cxx_nontype_template_parameter_auto |
| cxx_range_based_for |
| cxx_static_assert |
| cxx_structured_bindings |
| cxx_template_template_args |
| cxx_variadic_using |

Also added c++20 feature detection:

| Feature name |
| ------------------------------------ |
| cxx_aggregate_paren_init |
| cxx_char8_t |
| cxx_concepts |
| cxx_conditional_explicit |
| cxx_consteval |
| cxx_constexpr |
| cxx_constexpr_dynamic_alloc |
| cxx_constexpr_in_decltype |
| cxx_constinit |
| cxx_deduction_guides |
| cxx_designated_initializers |
| cxx_generic_lambdas |
| cxx_impl_coroutine |
| cxx_impl_destroying_delete |
| cxx_impl_three_way_comparison |
| cxx_init_captures |
| cxx_modules |
| cxx_nontype_template_args |
| cxx_using_enum |

### Xrepo package virtual environment management

#### Enter the virtual environment

The xrepo package management tool that comes with xmake can now well support package virtual machine environment management, similar to nixos' nixpkgs.

We can customize some package configurations by adding the xmake.lua file in the current directory, and then enter the specific package virtual environment.

```lua
add_requires("zlib 1.2.11")
add_requires("python 3.x", "luajit")
```

```console
$ xrepo env shell
> python --version
> luajit --version
```

We can also configure and load the corresponding toolchain environment in xmake.lua, for example, load the VS compilation environment.

```lua
set_toolchains("msvc")
```

#### Manage virtual environments

We can use the following command to register the specified virtual environment configuration globally to the system for quick switching.

```console
$ xrepo env --add /tmp/base.lua
```

At this time, we have saved a global virtual environment called base, and we can view it through the list command.

```console
$ xrepo env --list
/Users/ruki/.xmake/envs:
  -base
envs(1) found!
```

We can also delete it.

```console
$ xrepo env --remove base
```

#### Switch global virtual environment

If we register multiple virtual environments, we can also switch them quickly.

```console
$ xrepo env -b base shell
> python --version
```

Or directly load the specified virtual environment to run specific commands

```console
$ xrepo env -b base python --version
```

`xrepo env -b/--bind` is to bind the specified virtual environment. For more details, see: [#1762](https://github.com/xmake-io/xmake/issues/1762)

### Header Only Target Type

For the target, we added the `headeronly` target type. For this type of target program, we will not actually compile them because it has no source files to be compiled.

But it contains a list of header files, which are usually used for the installation of headeronly library projects, the generation of file lists for IDE projects, and the generation of cmake/pkgconfig import files during the installation phase.

E.g:

```lua
add_rules("mode.release", "mode.debug")

target("foo")
    set_kind("headeronly")
    add_headerfiles("src/foo.h")
    add_rules("utils.install.cmake_importfiles")
    add_rules("utils.install.pkgconfig_importfiles")
```

For more details, please see: [#1747](https://github.com/xmake-io/xmake/issues/1747)

### Find packages from CMake

Now cmake is the de facto standard, so the find_package provided by CMake can already find a large number of libraries and modules. We fully reuse this part of cmake's ecology to expand xmake's integration of packages.

We can use `find_package("cmake::xxx")` to find some packages with cmake, xmake will automatically generate a cmake script to call cmake's find_package to find some packages and get the bread information.

E.g:

```console
$ xmake l find_package cmake::ZLIB
{
  links = {
    "z"
  },
  includedirs = {
    "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.
15.sdk/usr/include"
  },
  linkdirs = {
    "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.
15.sdk/usr/lib"
  }
}
$ xmake l find_package cmake::LibXml2
{
  links = {
    "xml2"
  },
  includedirs = {
    "/Library/Developer/CommandLineTools/SDKs/MacOSX10.15.sdk/usr/include/libxml2"
  },
  linkdirs = {
    "/usr/lib"
  }
}
```

#### Specify version

```lua
find_package("cmake::OpenCV", {required_version = "4.1.1"})
```

#### Specified components

```lua
find_package("cmake::Boost", {components = {"regex", "system"}})
```

#### Default switch

```lua
find_package("cmake::Boost", {components = {"regex", "system"}, presets = {Boost_USE_STATIC_LIB = true}})
set(Boost_USE_STATIC_LIB ON) - will be used in FindBoost.cmake
find_package(Boost REQUIRED COMPONENTS regex system)
```

#### Set environment variables

```lua
find_package("cmake::OpenCV", {envs = {CMAKE_PREFIX_PATH = "xxx"}})
```

#### Specify custom FindFoo.cmake module script directory

mydir/cmake_modules/FindFoo.cmake

```lua
find_package("cmake::Foo", {moduledirs = "mydir/cmake_modules"})
```

#### Package dependency integration

```lua
package("xxx")
    on_fetch(function (package, opt)
         return package:find_package("cmake::xxx", opt)
    end)
package_end()

add_requires("xxx")
```

#### Package dependency integration (optional component)

```lua
package("boost")
    add_configs("regex", {description = "Enable regex.", default = false, type = "boolean"})
    on_fetch(function (package, opt)
         opt.components = {}
         if package:config("regex") then
             table.insert(opt.components, "regex")
         end
         return package:find_package("cmake::Boost", opt)
    end)
package_end()

add_requires("boost", {configs = {regex = true}})
```

Related issues: [#1632](https://github.com/xmake-io/xmake/issues/1632)

### Add custom commands to CMakelists.txt

We have further improved the cmake generator. Now you can serialize the custom script in rule into a list of commands and generate them together to CMakelists.txt

However, currently only the serialization of batchcmds series scripts can be supported.

```lua
rule("foo")
    after_buildcmd(function (target, batchcmds, opt)
        batchcmds:show("hello xmake!")
        batchcmds:cp("xmake.lua", "/tmp/")
        - batchcmds:execv("echo", {"hello", "world!"})
        - batchcmds:runv("echo", {"hello", "world!"})
    end)

target("test")
    set_kind("binary")
    add_rules("foo")
    add_files("src/*.c")
```

It will generate CMakelists.txt similar to the following

```
# ...
add_custom_command(TARGET test
    POST_BUILD
    COMMAND echo hello xmake!
    VERBATIM
)
add_custom_command(TARGET test
    POST_BUILD
    COMMAND cp xmake.lua /tmp/
    VERBATIM
)
target_sources(test PRIVATE
    src/main.c
)
```

However, the actual effect of cmake's `ADD_CUSTOM_COMMAND` PRE_BUILD differs greatly on different generators, which cannot meet our needs, so we have done a lot of processing to support it.

Related issues: [#1735](https://github.com/xmake-io/xmake/issues/1735)

## Changelog

### New features

* [#1736](https://github.com/xmake-io/xmake/issues/1736): Support wasi-sdk toolchain
* Support Lua 5.4 runtime
* Add gcc-8, gcc-9, gcc-10, gcc-11 toolchains
* [#1623](https://github.com/xmake-io/xmake/issues/1632): Support find_package from cmake
* [#1747](https://github.com/xmake-io/xmake/issues/1747): Add `set_kind("headeronly")` for target to install files for headeronly library
* [#1019](https://github.com/xmake-io/xmake/issues/1019): Support Unity build
* [#1438](https://github.com/xmake-io/xmake/issues/1438): Support code amalgamation, `xmake l cli.amalgamate`
* [#1765](https://github.com/xmake-io/xmake/issues/1756): Support nim language
* [#1762](https://github.com/xmake-io/xmake/issues/1762): Manage and switch the given package envs for `xrepo env`
* [#1767](https://github.com/xmake-io/xmake/issues/1767): Support Circle compiler
* [#1753](https://github.com/xmake-io/xmake/issues/1753): Support armcc/armclang toolchains for Keil/MDK
* [#1774](https://github.com/xmake-io/xmake/issues/1774): Add table.contains api
* [#1735](https://github.com/xmake-io/xmake/issues/1735): Add custom command in cmake generator

### Changes

* [#1528](https://github.com/xmake-io/xmake/issues/1528): Check c++17/20 features
* [#1729](https://github.com/xmake-io/xmake/issues/1729): Improve C++20 modules for clang/gcc/msvc, support inter-module dependency compilation and parallel optimization
* [#1779](https://github.com/xmake-io/xmake/issues/1779): Remove builtin `-Gd` for ml.exe/x86
* [#1781](https://github.com/xmake-io/xmake/issues/1781): Improve get.sh installation script to support nixos
