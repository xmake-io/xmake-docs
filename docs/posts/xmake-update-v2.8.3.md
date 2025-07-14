---
title: Xmake v2.8.3 Released, Improve Wasm and Support Xmake Source Debugging
tags: [xmake, lua, C/C++, package, performance, API, rust]
date: 2023-09-26
author: Ruki
---

tags: [xmake, lua, C/C++, package, performance, API, rust], date: '2023-09-26',]
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

In the new version, we have added breakpoint debugging support for Xmake's own source code, which can help contributors to get familiar with xmake's source code more quickly, and also help users to debug and analyse their own project's configure scripts.

In addition, the number of packages in our [xmake-repo](https://github.com/xmake-io/xmake-repo) repository is about to exceed 1100, with more than 100 packages added in just one month, thanks to @star-hengxing's contribution.

At the same time, we focused on improving build support for Wasm and Qt6 for wasm.

### Breakpoint Debugging Xmake

In version 2.8.3, we added Lua breakpoint debugging support, with [VSCode-EmmyLua](https://github.com/EmmyLua/VSCode-EmmyLua) plugin, we can easily debug Xmake source code in VSCode breakpoints.

First of all, we need to install VSCode-EmmyLua plugin in VSCode's plugin market, and then run the following command to update the xmake-repo repository to keep it up-to-date.

```bash
$ xrepo update-repo
```

!> Xmake also needs to be kept up to date.

Then, execute the following command in your own project directory:

```bash
$ xrepo env -b emmylua_debugger -- xmake build
```

The `xrepo env -b emmylua_debugger` is used to bind the EmmyLua debugger plugin environment, and the arguments after `--` are the actual xmake commands we need to debug.

Usually we just debug the `xmake build` build, but if you want to debug other commands, you can tweak it yourself, for example, if you want to debug the `xmake install -o /tmp` install command, you can change it to:

```bash
$ xrepo env -b emmylua_debugger -- xmake install -o /tmp
```

After executing the above command, it will not exit immediately, it will remain in a waiting debugging state, possibly without any output.

At this point, instead of exiting it, let's go ahead and open VSCode and open Xmake's Lua script source directory in VSCode.

That is, this directory: [Xmake Lua Scripts](https://github.com/xmake-io/xmake/tree/master/xmake), which we can download locally or directly open the lua script directory in the Xmake installation directory.

Then switch to VSCode's debugging tab and click `RunDebug` -> `Emmylua New Debug` to connect to our `xmake build` command debugger and start debugging.

As you can see below, the default start breakpoint will automatically break inside `debugger:_start_emmylua_debugger`, and we can click on the single-step to jump out of the current function, which will take us to the main entry.

![](/assets/img/manual/xmake-debug.png)

Then set your own breakpoint and click Continue to Run to break to the code location you want to debug.

We can also set breakpoints in our project's configuration scripts, which also allows us to quickly debug our own configuration scripts, not just Xmake's own source code.

![](/assets/img/manual/xmake-debug2.png)






### Remote debugging xmake

Version 2.8.3 now supports remote debugging, but this feature is mainly for the author: because the author's development computer is a mac, but sometimes he still needs to be able to debug xmake source scripts on windows.

But debugging in a virtual machine is too laggy, not good experience, and the author's own computer does not have enough disk space, so I usually connect to a separate windows host to debug xmake source code remotely.

Let's start the remote compilation service on the windows machine:

```bash
$ xmake service
```

Then locally, open the project directory where you want to build, make a remote connection, and then run `xmake service --sync --xmakesrc=` to synchronise the local source:

```bash
$ xmake service --connect
$ xmake service --sync --xmakesrc=~/projects/personal/xmake/xmake/
$ xmake build
$ xmake run
```

This way, we can modify the xmake script source locally, sync it to a remote windows machine, and then execute the xmake build command remotely to get the corresponding debug output and analyse the build behaviour.

We can also pull the remote files back to the local machine for analysis with the `xmake service --pull=` command.

Note: See [Remote Build Documentation](https://xmake.io/#/features/remote_build) for a detailed description of remote build features.

![](/assets/img/manual/xmake-remote.png)

### Support for Cppfront programmes

We have also added a new build rule to support the compilation of [cppfront](https://github.com/hsutter/cppfront) programs:

```bash
add_rules("mode.debug", "mode.release")

add_requires("cppfront")

target("test")
    add_rules("cppfront")
    set_kind("binary")
    add_files("src/*.cpp2")
    add_packages("cppfront")
```

### Added utils.hlsl2spv build rule

We've already provided the `utils.glsl2spv` rule to support the compilation and use of glsl, but now we've added the `utils.hlsl2spv` rule to support the compilation of hlsl.

```bash
add_rules("mode.debug", "mode.release")

add_requires("glslang", {configs = {binaryonly = true}})

target("test")
    set_kind("binary")
    add_rules("utils.hlsl2spv", {bin2c = true})
    add_files("src/*.c")
    add_files("src/*.hlsl", "src/*.hlsl")
    add_packages("directxshadercompiler")
```

For a detailed description of this rule, see the documentation: [utils.glsl2spv](https://xmake.io/#/manual/custom_rule#utilsglsl2spv), both are used in a similar way and principle.

### Add lib.lua.package module.

Xmake restricts access to native lua modules and interfaces by default, and this module is mainly used to open up some of the APIs provided by lua to be used on demand.

Currently, it only provides the `package.loadlib` interface for loading lua modules from the native so/dylib/dll dynamic library.

This is typically used in high-performance scenarios.

```Lua
import("lib.lub.package")

local script = package.loadlib("/xxx/libfoo.so", "luaopen_mymodule")
local mymodule = script()
mymodule.hello()
```

### Improved Address sanitizer support

Address Sanitizer (ASan) is a fast memory error detection tool that is built-in by the compiler, and normally we need to configure `-fsanitize-address` in both compilation and linking flags to enable it properly.

In previous versions, we supported this by configuring `add_rules("mode.asan")` and then `xmake f -m asan` to switch build modes.

But there are a few problems with this:

1. it doesn't work on dependent packages
2. you need to switch build modes
3. asan and ubsan cannot be detected at the same time.

Therefore, in the new version, we have switched to using policy to support them better.

We can quickly enable it globally by turning on the `build.sanitizer.address` policy, which will enable compiled applications to support ASan detection directly.

For example, we can enable it from the command line:

```bash
$ xmake f --policies=build.sanitizer.address
```

It can also be enabled globally via the interface configuration:

```lua
set_policy("build.sanitizer.address", true)
```

Of course, we can also enable it for a specific target individually, and if we configure it globally, we can enable it for all dependent packages at the same time.

```lua
set_policy("build.sanitizer.address", true)

add_requires("zlib")
add_requires("libpng")
```

It is equivalent to setting the asan configuration for each package in turn.

```lua
add_requires("zlib", {configs = {asan = true}})
add_requires("libpng", {configs = {asan = true}})
```

Alternatively, we can have multiple sanitizer detections in effect at the same time, for example:

```lua
set_policy("build.sanitizer.address", true)
set_policy("build.sanitizer.undefined", true)
```

or

```bash
$ xmake f --policies=build.sanitizer.address,build.sanitizer.undefined
```

In addition to Asan, we provide other similar policies for detecting threads, memory leaks, and so on.

- build.sanitizer.thread
- build.sanitizer.memory
- build.sanitizer.leak
- build.sanitizer.undefined

### Autobuild before running

We have added a new `run.atuobuild` policy to adjust the behaviour of `xmake run`. By default, running `xmake run` does not automatically build the target application, but prompts the user to build it manually if the application has not yet been compiled.

By turning on this policy, we can automatically build the target program before running it.

```bash
$ xmake f --policies=run.autobuild
$ xmake run
```

If you want this policy to take effect globally, you can turn it on globally.

```bash
$ xmake g --policies=run.autobuild
```

### Shallow build of a specified target

When we specify to rebuild a target, if it has a lot of dependent targets, then they are usually all rebuilt.

```bash
$ xmake --rebuild foo
rebuild foo
rebuild foo.dep1
rebuild foo.dep2
...
```

This can be very slow for large projects with a lot of target dependencies, and can mean that half of the project has to be rebuilt.

In the new version, we've added a `--shallow` parameter to tell Xmake to only rebuild the specified target, and not to rebuild all of its dependencies.

```bash
$ xmake --rebuild --shallow foo
only rebuild foo
```

### Improved warning settings

The `set_warnings` interface has new `extra` and `pedantic` settings and supports combining multiple warning values.

```lua
set_warnings("all", "extra")
set_warnings("pedantic")
```

### Improving Wasm Builds

Now we can pull the emscripten toolchain ourselves and use it to build wasm programs automatically with the following configuration.

```lua
if is_plat("wasm") then
    add_requires("emscripten")
    set_toolchains("emcc@emscripten")
end
```

Simply just run

```bash
$ xmake f -p wasm
$ xmake
```

to build the wasm application, so you don't have to manually install emscripten yourself, which is much more convenient.

We also have good support for Qt6 for wasm.

## Changelog

### New features

* [#4122](https://github.com/xmake-io/xmake/issues/4122): Support Lua Debugger (EmmyLua)
* [#4132](https://github.com/xmake-io/xmake/pull/4132): Support cppfront
* [#4147](https://github.com/xmake-io/xmake/issues/4147): Add hlsl2spv rule
* [#4226](https://github.com/xmake-io/xmake/issues/4226): Support sanitizers for package and policy
* Add lib.lua.package module
* Add `run.autobuild` policy
* Add global policies `xmake g --policies=`

### Changes

* [#4119](https://github.com/xmake-io/xmake/issues/4119): Improve to support emcc toolchain and emscripten package
* [#4154](https://github.com/xmake-io/xmake/issues/4154): Add `xmake -r --shallow target` to rebuild target without deps
* Add global ccache storage directory
* [#4137](https://github.com/xmake-io/xmake/issues/4137): Support Qt6 for Wasm
* [#4173](https://github.com/xmake-io/xmake/issues/4173): Add recheck argument to on_config
* [#4200](https://github.com/xmake-io/xmake/pull/4200): Improve remote build to support debugging xmake source code.
* [#4209](https://github.com/xmake-io/xmake/issues/4209): Add extra and pedantic warnings

### Bugs fixed

* [#4110](https://github.com/xmake-io/xmake/issues/4110): Fix extrafiles
* [#4115](https://github.com/xmake-io/xmake/issues/4115): Fix compile_commands generator for clangd
* [#4199](https://github.com/xmake-io/xmake/pull/4199): Fix compile_commands generator for c++ modules
* Fix os.mv fail on window
* [#4214](https://github.com/xmake-io/xmake/issues/4214): Fix rust workspace build error