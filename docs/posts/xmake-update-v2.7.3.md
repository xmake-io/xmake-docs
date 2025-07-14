---
title: Xmake v2.7.3 Released, Package Components and C++ Modules Incremental Build Support
tags: [xmake, lua, C/C++, package, components]
date: 2022-11-08
author: Ruki
---

Support', tags: [xmake, lua, C/C++, package, components], date: '2022-11-08',]
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
Xmake ~= Make/Ninja + CMake/Meson + Vcpkg/Conan + distcc + ccache/sccache
```

* [Github](https://github.com/xmake-io/xmake)
* [Document](https://xmake.io/)

<img src="https://github.com/xmake-io/xmake-docs/raw/master/assets/img/index/package.gif" width="650px" />

## Introduction of new features

### Package component support

#### Introduction

This new feature is intended to enable the integration of specific sub-libraries from a C/C++ package, and is generally used for library component integration in larger packages.

This is because such packages provide a number of sub-libraries, not all of which are required by the user, and linking them all may be problematic.

Although, previous versions were able to support the feature of sublibrary selection, e.g.

```lua
add_requires("sfml~foo", {configs = {graphics = true, window = true}})
add_requires("sfml~bar", {configs = {network = true}})

target("foo")
    set_kind("binary")
    add_packages("sfml~foo")

target("bar")
    set_kind("binary")
    add_packages("sfml~bar")
```

This is done by custom configuration of each package, but there are some problems with this approach.

1. `sfml~foo` and `sfml~bar` will be installed repeatedly as two separate packages, taking up double the disk space
2. some common code will be compiled repeatedly, which will affect the efficiency of the installation
3. if a target depends on both `sfml~foo` and `sfml~bar`, there will be link conflicts

The impact of double-compilation and disk usage can be very high for very large package integrations such as boost, and can even lead to more than N times the disk usage if there are a large number of sub-library combinations.

To solve this problem, Xmake has added a package component mode, which offers some of the following benefits.

1. fast integration of any number of components in just one compile, greatly improving installation efficiency and reducing disk footprint
2. component abstraction, across compilers and platforms, so users don't need to worry about configuring link order dependencies between each sub library
3. easier to use

For more background details see: [#2636](https://github.com/xmake-io/xmake/issues/2636)

#### Use package components

For the user, using package components is very convenient because the user is not required to maintain the package, as long as the package is used, it is configured with the relevant set of components and we can quickly integrate and use it, e.g.

```lua
add_requires("sfml")

target("foo")
    set_kind("binary")
    add_packages("sfml", {components = "graphics"})

target("bar")
    set_kind("binary")
    add_packages("sfml", {components = "network"})
```







#### View package components

So how do we know what components are provided by a given package? We can check by executing the following command.

```bash
$ xrepo info sfml
The package info of project:
    require(sfml):
      -> description: Simple and Fast Multimedia Library
      -> version: 2.5.1
      ...
      -> components:
         -> system:
         -> graphics: system, window
         -> window: system
         -> audio: system
         -> network: system
```

#### Package component configuration

If you are a package maintainer and want to add component support to a package, then you need to configure the package components via the following two interfaces.

- add_components: adds a list of package components
- on_component: Configures each package component

##### Link configuration for package components

In most cases, a package component only needs to be configured with some of its own sub-link information, e.g.

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")

    on_component("graphics", function (package, component)
        local e = package:config("shared") and "" or "-s"
        component:add("links", "sfml-graphics" ... e)
        if package:is_plat("windows", "mingw") and not package:config("shared") then
            component:add("links", "freetype")
            component:add("syslinks", "opengl32", "gdi32", "user32", "advapi32")
        end
    end)

    on_component("window", function (package, component)
        local e = package:config("shared") and "" or "-s"
        component:add("links", "sfml-window" ... e)
        if package:is_plat("windows", "mingw") and not package:config("shared") then
            component:add("syslinks", "opengl32", "gdi32", "user32", "advapi32")
        end
    end)

    ...
```

The above is an incomplete package configuration, I have only extracted a part of the configuration related to the package components.

A full example of the configuration and use of package components can be found at: [components example](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/components/xmake.lua)

##### Configure compilation information for components

We can configure not only the linking information for each component, but also the compilation information for includedirs, defines etc. We can also configure each component individually.

```lua
package("sfml")
    on_component("graphics", function (package, component)
        package:add("defines", "TEST")
    end)
```

##### Configure component dependencies

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")

    on_component("graphics", function (package, component)
          component:add("deps", "window", "system")
    end)
```

The above configuration tells the package that our graphics component will have additional dependencies on the `window` and `system` components.

So, on the user side, our use of the graphics component can be done from the

```lua
add_packages("sfml", {components = {"graphics", "window", "system"})
```

Simplified to.

```lua
add_packages("sfml", {components = "graphics")
```

Because, as soon as we turn on the graphics component, it will also automatically enable the dependent window and system components and automatically ensure that the links are in the right order.

Alternatively, we can configure component dependencies with `add_components("graphics", {deps = {"window", "system"}})`.

##### Find components from the system library

We know that configuring `add_extsources` in the package configuration can improve package discovery on the system, for example by finding libraries from system package managers such as apt/pacman.

Of course, we can also make it possible for each component to prioritise finding them from the system repositories via the `extsources` configuration as well.

For example, the sfml package, which is actually also componentized in homebrew, can be made to find each component from the system repository without having to install them in source each time.

```bash
$ ls -l /usr/local/opt/sfml/lib/pkgconfig
-r--r--r-- 1 ruki admin 317 10 19 17:52 sfml-all.pc
-r--r--r-- 1 ruki admin 534 10 19 17:52 sfml-audio.pc
-r--r--r-- 1 ruki admin 609 10 19 17:52 sfml-graphics.pc
-r--r--r-- 1 ruki admin 327 10 19 17:52 sfml-network.pc
-r--r--r-- 1 ruki admin 302 10 19 17:52 sfml-system.pc
-r--r--r-- 1 ruki admin 562 10 19 17:52 sfml-window.pc
````

We just need, for each component, to configure its extsources: the

```lua
if is_plat("macosx") then
    add_extsources("brew::sfml/sfml-all")
end

on_component("graphics", function (package, component)
    -- ...
    component:add("extsources", "brew::sfml/sfml-graphics")
end)
```

##### Default Global Component Configuration

In addition to configuring specific components by specifying component names, if we do not specify a component name, the default is to globally configure all components.

```lua
package("sfml")
    on_component(function (package, component)
        -- configure all components
    end)
```

Of course, we could also specify the configuration of the graphics component and the rest of the components would be configured via the default global configuration interface in the following way.

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")

    on_component("graphics", function (package, component)
        -- configure graphics
    end)

    on_component(function (package, component)
        -- component audio, network, window, system
    end)
```

### C++ module build improvements

#### Incremental build support

I thought that Xmake already had good support for C++ modules, but then I realised that its incremental builds don't work properly yet.

So this version of Xmake also does a good job of supporting incremental builds of C++ modules, although the support process still took a lot of effort.

My analysis shows that the format of the include dependency information (`*.d`) generated with modules varies considerably between the compilers.

The gcc format is the most complex, but I got it to support it anyway.

```
build/.objs/dependence/linux/x86_64/release/src/foo.mpp.o: src/foo.mpp\
build/.objs/dependence/linux/x86_64/release/src/foo.mpp.o gcm.cache/foo.gcm: bar.c++m cat.c++m\
foo.c++m: gcm.cache/foo.gcm\
.PHONY: foo.c++m\
gcm.cache/foo.gcm:| build/.objs/dependence/linux/x86_64/release/src/foo.mpp.o\
CXX_IMPORTS += bar.c++m cat.c++m\
```

clang has the best format compatibility and supports it without any special changes.

```
build//hello.pcm: /usr/lib/llvm-15/lib/clang/15.0.2/include/module.modulemap src/hello.mpp\
```

The msvc format is more extensible and easier to parse and support: the

```
{
    "Version": "1.2",
    "Data": {
        "Source": "c:\users\ruki\desktop\user_headerunit\src\main.cpp",
        "ProvidedModule": "",
        "Includes": [],
        "ImportedModules": [
            {
                "Name": "hello",
                "BMI": "c:\users\ruki\desktop\user_headerunit\src\hello.ifc"
            }
        ],
        "ImportedHeaderUnits": [
            {
                "Header": "c:\users\ruki\desktop\user_headerunit\src\header.hpp",
                "BMI": "c:\users\ruki\desktop\user_headerunit\src\header.hpp.ifc"
            }
        ]
    }
}
```

#### Circular Dependency Detection Support

As there are dependencies between modules, it is not possible to compile if there are circular dependencies between several modules.

However, in previous versions Xmake was unable to detect this, and when a circular dependency was encountered, the compilation would get stuck without any message, which was very unfriendly to the user.

In this new version, we have improved this situation by adding the detection of cyclic dependencies for modules, and the following error message will appear when compiling to make it easier for the user to locate the problem.

```bash
$ xmake
[ 0%]: generating.cxx.module.deps Foo.mpp
[ 0%]: generating.cxx.module.deps Foo2.mpp
[ 0%]: generating.cxx.module.deps Foo3.mpp
[ 0%]: generating.cxx.module.deps main.cpp
error: circular modules dependency(Foo2, Foo, Foo3, Foo2) detected!
  -> module(Foo2) in Foo2.mpp
  -> module(Foo) in Foo.mpp
  -> module(Foo3) in Foo3.mpp
  -> module(Foo2) in Foo2.mpp
```

### A more LSP friendly syntax format

Our default convention of domain configuration syntax, although very clean, is not very friendly to auto-formatted indentation and IDEs, and if you format your configuration, the indentation is completely misplaced.

```lua
target("foo")
    set_kind("binary")
    add_files("src/*.cpp")
```

Also, if some global configuration is configured between two targets, it does not automatically end the current target scope and the user needs to explicitly call ``target_end()`.

```lua
target("foo")
    set_kind("binary")
    add_files("src/*.cpp")
target_end()

add_defines("ROOT")

target("bar")
    set_kind("binary")
    add_files("src/*.cpp")
```

Although, as we mentioned above, you can use the `do end` mode to solve the auto-indentation problem, the problem of needing `target_end()` still exists.

``` lua
target("foo") do
    set_kind("binary")
    add_files("src/*.cpp")
end
target_end()

add_defines("ROOT")

target("bar") do
    set_kind("binary")
    add_files("src/*.cpp")
end
```

Therefore, in this new version, we provide a better optional domain configuration syntax to solve the auto-indentation, target domain isolation problem, e.g.

```lua
target("foo", function ()
    set_kind("binary")
    add_files("src/*.cpp")
end)

add_defines("ROOT")

target("bar", function ()
    set_kind("binary")
    add_files("src/*.cpp")
end)
```

The foo and bar fields are completely isolated, so we can configure other settings between them without affecting them, plus it's very LSP friendly and won't cause indentation confusion, even with one-click formatting.

Note: This is only an optional extension syntax, the existing configuration syntax is still fully supported and the user can choose the right one according to their needs preferences.

### Add flags to specific compilers

Values configured using interfaces such as `add_cflags`, `add_cxxflags`, etc. are usually compiler specific, although Xmake does provide automatic detection and mapping mechanisms.
Even if a flags is set that is not supported by the current compiler, Xmake can automatically ignore it, but there will still be a warning.

In this new version, we have improved the interface for adding all flags to avoid additional warnings by specifying flags only for specific compilers, e.g.

```lua
add_cxxflags("clang::-stdlib=libc++")
add_cxxflags("gcc::-stdlib=libc++")
```

Or

```lua
add_cxxflags("-stdlib=libc++", {tools = "clang"})
add_cxxflags("-stdlib=libc++", {tools = "gcc"})
```

Note: Not just compile flags, but also for link flags such as add_ldflags, which also work.

### renderdoc debugger support

Thanks to [@SirLynix](https://github.com/SirLynix) for contributing this great feature which allows Xmake to load renderdoc directly to debug some graphics renderers.

It's very simple to use, we first make sure renderdoc is installed, then configure the debugger to renderdoc and load the debug run as follows

```bash
$ xmake f --debugger=renderdoc
$ xmake run -d
```

The concrete usage effect is as follows.

<img src="/assets/img/posts/xmake/renderdoc.gif">

### New C++ exception interface configuration

Xmake has added a new `set_exceptions` abstraction configuration interface, which allows us to configure C++/Objc exceptions to be enabled and disabled.

Normally, if we configure them via the add_cxxflags interface, it would be cumbersome for the compiler to handle them separately, depending on the platform.

For example

```lua
on_config(function (target)
    if (target:has_tool("cxx", "cl")) then
        target:add("cxflags", "/EHsc", {force = true})
        target:add("defines", "_HAS_EXCEPTIONS=1", {force = true})
    elseif(target:has_tool("cxx", "clang") or target:has_tool("cxx", "clang-cl")) then
        target:add("cxflags", "-fexceptions", {force = true})
        target:add("cxflags", "-fcxx-exceptions", {force = true})
    end
end)
```

And with this interface, we can abstract to configure them in a compiler-independent way.

Enabling C++ exceptions:

```lua
set_exceptions("cxx")
```

Disable C++ exceptions:

```lua
set_exceptions("no-cxx")
```

We can also configure to turn on objc exceptions at the same time.

```lua
set_exceptions("cxx", "objc")
```

or disable them.

```lua
set_exceptions("no-cxx", "no-objc")
```

Xmake automatically adapts the flags internally to the different compilers.

### Support for ispc compilation rules

Xmake has added support for built-in rules for the ipsc compiler, thanks to [@star-hengxing](https://github.com/star-hengxing), which is used in the following way.

```lua
target("test")
    set_kind("binary")
    add_rules("utils.ispc", {header_extension = "_ispc.h"})
    set_values("ispc.flags", "--target=host")
    add_files("src/*.ispc")
    add_files("src/*.cpp")
```

### Support for msvc's armasm compiler

Previous versions of Xmake added initial support for Windows ARM, but did not yet have good support for asm compilation, so in this version we have continued to improve Windows ARM support.

Support for msvc's `armasm.exe` and `armasm64.exe` is now available.

In addition, we have also improved package cross-compilation support for the Windows ARM platform.

### New gnu-rm build rules

Xmake has also added a new rule and example project for building embedded projects using the gnu-rm toolchain, thanks to [@JacobPeng](https://github.com/JacobPeng) for this.

```lua
add_rules("mode.debug", "mode.release")

add_requires("gnu-rm")
set_toolchains("@gnu-rm")
set_plat("cross")
set_arch("armv7")

target("foo")
    add_rules("gnu-rm.static")
    add_files("src/foo/*.c")

target("hello")
    add_deps("foo")
    add_rules("gnu-rm.binary")
    add_files("src/*.c", "src/*.S")
    add_files("src/*.ld")
    add_includedirs("src/lib/cmsis")
```

For the full project see: [Embed GNU-RM Example](https://github.com/xmake-io/xmake/blob/master/tests/projects/embed/gnu-rm/hello/xmake.lua)

### Add OpenBSD system support

In previous versions, Xmake only supported FreeBSD, and OpenBSD had a number of differences that prevented Xmake from compiling and installing on it.

The new version now fully supports running Xmake on OpenBSD.

## Changelog

### New features

* A new optional configuration syntax. It is LSP friendly, automatically calls target_end() to achieve scope isolation.
* [#2944](https://github.com/xmake-io/xmake/issues/2944): Add `gnu-rm.binary` and `gnu-rm.static` rules and tests for embed project
* [#2636](https://github.com/xmake-io/xmake/issues/2636): Support package components
* Support armasm/armasm64 for msvc
* [#3023](https://github.com/xmake-io/xmake/pull/3023): Add support for debugging with renderdoc
* [#3022](https://github.com/xmake-io/xmake/issues/3022): Add flags for specific compilers and linkers
* [#3025](https://github.com/xmake-io/xmake/pull/3025): C++ exception enabled/disabled switch method
* [#3017](https://github.com/xmake-io/xmake/pull/3017): Support ispc compiler

### Changes

* [#2925](https://github.com/xmake-io/xmake/issues/2925): Improve doxygen plugin
* [#2948](https://github.com/xmake-io/xmake/issues/2948): Support OpenBSD
* Add `xmake g --insecure-ssl=y` option to disable ssl certificate when downloading packages
* [#2971](https://github.com/xmake-io/xmake/pull/2971): Stabilize vs and vsxmake project generation
* [#3000](https://github.com/xmake-io/xmake/issues/3000): Incremental compilation support for modules
* [#3016](https://github.com/xmake-io/xmake/pull/3016): Improve clang/msvc to better support std modules

### Bugs fixed

* [#2949](https://github.com/xmake-io/xmake/issues/2949): Fix vs group
* [#2952](https://github.com/xmake-io/xmake/issues/2952): Fix armlink for long args
* [#2954](https://github.com/xmake-io/xmake/issues/2954): Fix c++ module partitions path issue
* [#3033](https://github.com/xmake-io/xmake/issues/3033): Detect circular modules dependency