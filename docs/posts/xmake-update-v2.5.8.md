---
title: xmake v2.5.8 is released, Support Pascal/Swig program and Lua53 runtime
tags: [xmake, lua, C/C++, pascal, swig, lua5.3]
date: 2021-10-08
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) is a lightweight cross-platform build tool based on Lua. It uses xmake.lua to maintain project builds. Compared with makefile/CMakeLists.txt, the configuration syntax is more Concise and intuitive, it is very friendly to novices, and you can get started quickly in a short time, allowing users to focus more on actual project development.

In this version, we mainly added support for the construction of Pascal language projects and Swig modules, and for the Vala language support added in the previous version, we have also made further improvements, adding support for the construction of dynamic and static libraries.

In addition, xmake now also supports the optional Lua5.3 runtime, which provides better cross-platform support. At present, xmake has been able to run normally on the LoongArch architecture.

* [Github](https://github.com/xmake-io/xmake)
* [Document](https://xmake.io/)

## New feature introduction

### Pascal language support

Currently, we can use the cross-platform Free Pascal toolchain fpc to compile and build Pascal programs, for example:

#### Console Program

```lua
add_rules("mode.debug", "mode.release")
target("test")
    set_kind("binary")
    add_files("src/*.pas")
```

#### Dynamic library program

```lua
add_rules("mode.debug", "mode.release")
target("foo")
    set_kind("shared")
    add_files("src/foo.pas")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.pas")
```

We can also add compilation options related to Pascal code through the `add_fcflags()` interface.

For more examples, see: [Pascal examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/pascal)







### Vala library compilation support

In the last version, we added support for the Vala language, but before, we could only support the compilation of console programs, and could not generate library files. In this version, we have added additional compilation support for static libraries and dynamic libraries.

#### Static library program

We can set the exported interface header file name by `add_values("vala.header", "mymath.h")`, and set the exported vapi by `add_values("vala.vapi", "mymath-1.0.vapi")` file name.

```lua
add_rules("mode.release", "mode.debug")

add_requires("glib")

target("mymath")
    set_kind("static")
    add_rules("vala")
    add_files("src/mymath.vala")
    add_values("vala.header", "mymath.h")
    add_values("vala.vapi", "mymath-1.0.vapi")
    add_packages("glib")

target("test")
    set_kind("binary")
    add_deps("mymath")
    add_rules("vala")
    add_files("src/main.vala")
    add_packages("glib")
```

#### Dynamic library program

```lua
add_rules("mode.release", "mode.debug")

add_requires("glib")

target("mymath")
    set_kind("shared")
    add_rules("vala")
    add_files("src/mymath.vala")
    add_values("vala.header", "mymath.h")
    add_values("vala.vapi", "mymath-1.0.vapi")
    add_packages("glib")

target("test")
    set_kind("binary")
    add_deps("mymath")
    add_rules("vala")
    add_files("src/main.vala")
    add_packages("glib")
```

For more examples, see: [Vala examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/vala)

### Swig module support

We provide `swig.c` and `swig.cpp` rules, which can call the swig program to generate the c/c++ module interface code for the specified script language, and then cooperate with the xmake package management system to achieve fully automated module and dependency package integration .

Related issues: [#1622](https://github.com/xmake-io/xmake/issues/1622)

#### Lua/C Module

```lua
add_rules("mode.release", "mode.debug")
add_requires("lua")

target("example")
    add_rules("swig.c", {moduletype = "lua"})
    add_files("src/example.i", {swigflags = "-no-old-metatable-bindings"})
    add_files("src/example.c")
    add_packages("lua")
```

Among them, swigflags can be set to pass some swig-specific flags options.

#### Python/C module

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.c", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.c")
    add_packages("python")
```

If scriptdir is set, then when we perform the installation, the python wrap script of the corresponding module will be installed to the specified directory.

#### Python/C++ Module

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.cpp", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.cpp")
    add_packages("python")
```

### Lua5.3 runtime support

Xmake has always used Luajit as the default runtime, because it was considered that Luajit is relatively faster, and the fixed Lua 5.1 syntax is more suitable for the needs of xmake's internal implementation.

However, considering that Luajit's update is not strong, the author's maintenance is not very active, and its cross-platform performance is relatively poor. For some new architectures, such as Loongarch, riscv, etc., the support is not timely, which somewhat limits the platform support of xmake. .

For this reason, in the new version, we also built Lua5.3 as an optional runtime. We only need to compile and install xmake with the following command to switch from Luajit to Lua5.3 runtime:

#### Linux/macOS

```bash
$ make RUNTIME=lua
```

#### Windows

```bash
$ cd core
$ xmake f --runtime=lua
$ xmake
```

At present, the current version is still the default luajit runtime. Users can switch to Lua5.3 runtime according to their needs, but this has almost no compatibility impact on the user's project xmake.lua configuration script.

Because the configuration interface of xmake has already done a layer of abstract encapsulation, some native interfaces with compatibility differences in Luajit/Lua5.3 will not be open to users, so it is completely unaware for project construction.

The only difference is that xmake with Lua5.3 supports more platforms and architectures.

#### Performance comparison

I have done some basic build tests. Whether it is startup time, build performance or memory usage, Lua5.3 and Luajit's xmake are almost the same. Because for the build system, the main performance bottleneck is the compiler, and the loss of its own scripts is very small.

Moreover, some low-level Lua modules inside xmake, such as io, character encoding, string manipulation, etc., have all been rewritten in c code by themselves, and do not rely on a specific Lua runtime engine at all.

#### Will you consider switching to Lua by default?

Since we have just supported Lua5.3, although it is relatively stable after testing, in order to ensure that the user environment is not affected in any way, we still need to observe for a period of time. In the short term, we still use Luajit by default.

When the 2.6.1 version starts, we will start to switch to Lua5.3 as the default runtime environment. If you are interested, you can also help test it online. If you encounter any problems, please feel free to report on issues.

#### LoongArch architecture support

Since we added Lua5.3 runtime support, we can now support running xmake on the LoongArch architecture, and all test examples have been tested.

#### Lua 5.4

At present, we are still on the sidelines of Lua 5.4. If we wait for Lua 5.4 to become stable later, we will also try to consider continuing to upgrade to Lua 5.4.

### Third-party source code mixed compilation support

#### Integrated CMake source library

In the new version, we have been able to directly integrate the source library with CMakeLists.txt in our project through the package mode of xmake, instead of downloading and installing it remotely.

Related issues: [#1714](https://github.com/xmake-io/xmake/issues/1714)

For example, we have the following project structure:

```
├── foo
│ ├── CMakeLists.txt
│ └── src
│ ├── foo.c
│ └── foo.h
├── src
│ └── main.c
├── test.lua
└── xmake.lua
```

The foo directory is a static library maintained by cmake, and the root directory is maintained by xmake. We can define the `package("foo")` package in xmake.lua to describe how to build the foo code library.

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

Among them, we set the code directory location of the foo package through `set_sourcedir()`, and then import the auxiliary module of `package.tools.cmake` through import to call cmake to build the code, xmake will automatically obtain the generated libfoo.a and the corresponding header document.

!> If only the local source code is integrated, we don't need to set additional `add_urls` and `add_versions`.

For the configuration description of the package, see: [Package description description](/zh/guide/package-management/package-distribution).

After defining the package, we can integrate it with `add_requires("foo")` and `add_packages("foo")`, just like integrating remote packages.

In addition, `on_test` is optional. If you want to strictly check whether the package is compiled and installed successfully, you can do some tests in it.

For a complete example, see: [Library with CMakeLists](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/library_with_cmakelists)

#### Integrate autoconf source library

We can also use `package.tools.autoconf` to locally integrate third-party code libraries maintained by autoconf.

```lua
package("pcre2")

    set_sourcedir(path.join(os.scriptdir(), "3rd/pcre2"))

    add_configs("jit", {description = "Enable jit.", default = true, type = "boolean"})
    add_configs("bitwidth", {description = "Set the code unit width.", default = "8", values = {"8", "16", "32"}})

    on_load(function (package)
        local bitwidth = package:config("bitwidth") or "8"
        package:add("links", "pcre2-" .. bitwidth)
        package:add("defines", "PCRE2_CODE_UNIT_WIDTH=" .. bitwidth)
        if not package:config("shared") then
            package:add("defines", "PCRE2_STATIC")
        end
    end)

    on_install("macosx", "linux", "mingw", function (package)
        local configs = {}
        table.insert(configs, "--enable-shared=" .. (package:config("shared") and "yes" or "no"))
        table.insert(configs, "--enable-static=" .. (package:config("shared") and "no" or "yes"))
        if package:debug() then
            table.insert(configs, "--enable-debug")
        end
        if package:config("pic") ~= false then
            table.insert(configs, "--with-pic")
        end
        if package:config("jit") then
            table.insert(configs, "--enable-jit")
        end
        local bitwidth = package:config("bitwidth") or "8"
        if bitwidth ~= "8" then
            table.insert(configs, "--disable-pcre2-8")
            table.insert(configs, "--enable-pcre2-" .. bitwidth)
        end
        import("package.tools.autoconf").install(package, configs)
    end)

    on_test(function (package)
        assert(package:has_cfuncs("pcre2_compile", {includes = "pcre2.h"}))
    end)
```

Both `package.tools.autoconf` and `package.tools.cmake` modules can support cross-compilation platforms and toolchains such as mingw/cross/iphoneos/android, xmake will automatically pass the corresponding toolchain into it, and the user does not need to do Anything else.

#### Integrate with other build systems

We also support the integration of code libraries maintained by other build systems such as Meson/Scons/Make. You only need to import the corresponding build auxiliary modules. I won’t go into details here. We can further check the documentation: [Integrate local third-party source code libraries ](/zh/guide/package-management/using-official-packages)

### Improve compiler feature detection

In the previous version, we can use the `check_features` auxiliary interface to detect specific compiler features, such as:

```lua
includes("check_features.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")
    configvar_check_features("HAS_CONSTEXPR", "cxx_constexpr")
    configvar_check_features("HAS_CONSEXPR_AND_STATIC_ASSERT", {"cxx_constexpr", "c_static_assert"}, {languages = "c++11"})
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

If the current cxx_constexpr feature supports it, the HAS_CONSTEXPR macro will be enabled in config.h.

#### Added C/C++ standard support detection

After 2.5.8, we continue to add support for cstd and c++ std version detection, related issues: [#1715](https://github.com/xmake-io/xmake/issues/1715)

E.g:

```lua
configvar_check_features("HAS_CXX_STD_98", "cxx_std_98")
configvar_check_features("HAS_CXX_STD_11", "cxx_std_11", {languages = "c++11"})
configvar_check_features("HAS_CXX_STD_14", "cxx_std_14", {languages = "c++14"})
configvar_check_features("HAS_CXX_STD_17", "cxx_std_17", {languages = "c++17"})
configvar_check_features("HAS_CXX_STD_20", "cxx_std_20", {languages = "c++20"})
configvar_check_features("HAS_C_STD_89", "c_std_89")
configvar_check_features("HAS_C_STD_99", "c_std_99")
configvar_check_features("HAS_C_STD_11", "c_std_11", {languages = "c11"})
configvar_check_features("HAS_C_STD_17", "c_std_17", {languages = "c17"})
```

#### New compiler built-in macro detection

We can also detect the existence of some built-in macro definitions in the compiler, such as `__GNUC__`, etc. We can use the `check_macros` and `configvar_check_macros` auxiliary scripts to detect their existence.

Related issues: [#1715](https://github.com/xmake-io/xmake/issues/1715)

```lua
- Check whether the macro is defined
configvar_check_macros("HAS_GCC", "__GNUC__")
- The detection macro is not defined
configvar_check_macros("NO_GCC", "__GNUC__", {defined = false})
- Detect macro conditions
configvar_check_macros("HAS_CXX20", "__cplusplus >= 202002L", {languages = "c++20"})
```

### Added support for Qt 4.x

In addition to Qt 5.x and 6.x, we have also added support for some old projects based on Qt 4.x.

### Added support for Android NDK r23

Due to some structural changes made by google to the Android NDK, r23 has affected the support of xmake for some compilation features of the android project. In this version, we have also made a repair.

### Fix the Unicode encoding problem of the vsxmake plugin

In addition, if Unicode is used as the project directory, the generated vsxmake project will be affected, causing many problems in the compilation and access of the vs project. We have also fixed it in the new version.

## Changelog

### New features

* [#388](https://github.com/xmake-io/xmake/issues/388): Pascal Language Support
* [#1682](https://github.com/xmake-io/xmake/issues/1682): Add optional lua5.3 backend instead of luajit to provide better compatibility
* [#1622](https://github.com/xmake-io/xmake/issues/1622): Support Swig
* [#1714](https://github.com/xmake-io/xmake/issues/1714): Support build local embed cmake projects
* [#1715](https://github.com/xmake-io/xmake/issues/1715): Support to detect compiler language standards as features and add `check_macros`
* Support Loongarch

### Change

* [#1618](https://github.com/xmake-io/xmake/issues/1618): Improve vala to support to generate libraries and bindings
* Improve Qt rules to support Qt 4.x
* Improve `set_symbols("debug")` to generate pdb file for clang on windows
* [#1638](https://github.com/xmake-io/xmake/issues/1638): Improve to merge static library
* Improve on_load/after_load to support to add target deps dynamically
* [#1675](https://github.com/xmake-io/xmake/pull/1675): Rename dynamic and import library suffix for mingw
* [#1694](https://github.com/xmake-io/xmake/issues/1694): Support to define a variable without quotes for configuration files
* Support Android NDK r23
* Add `c++latest` and `clatest` for `set_languages`
* [#1720](https://github.com/xmake-io/xmake/issues/1720): Add `save_scope` and `restore_scope` to fix `check_xxx` apis
* [#1726](https://github.com/xmake-io/xmake/issues/1726): Improve compile_commands generator to support nvcc

### Bugs fixed

* [#1671](https://github.com/xmake-io/xmake/issues/1671): Fix incorrect absolute path after installing precompiled packages
* [#1689](https://github.com/xmake-io/xmake/issues/1689): Fix unicode chars bug for vsxmake
