---
title: Xmake v2.8.7 released, Add cosmocc toolchain support, build-once run-anywhere
tags: [xmake, lua, C/C++, package, cosmocc]
date: 2024-02-25
author: Ruki
outline: deep
---

## Introduction of new features

In the new version, we have added cosmocc tool chain support. Using it, we can compile once and run everywhere. In addition, we also refactored the implementation of C++ Modules and solved many C++ Modules-related problems.

### Cosmocc toolchain support

The cosmocc tool chain is the compilation tool chain provided by the [cosmopolitan](https://github.com/jart/cosmopolitan) project. Programs compiled using this tool chain can be compiled once and run anywhere.

In the new version, we also support this tool chain, which can compile programs under macosx/linux/windows, and can also support automatic downloading of the cosmocc tool chain.

For users, they only need to configure the xmake.lua project file and then execute the `xmake` command to achieve one-click compilation and run it everywhere.

The content of xmake.lua is as follows. This is the most basic construction configuration of the hello world terminal program.

```lua
add_rules("mode.debug", "mode.release")

add_requires("cosmocc")

target("test")
     set_kind("binary")
     add_files("src/*.c")
     set_toolchains("@cosmocc")
```

Then, we execute the xmake command, which will first download the integrated cosmocc tool chain, and then use this tool chain to compile the program.

```bash
ruki:console$ xmake
checking for platform... linux
checking for architecture ...x86_64
note: install or modify (m) these packages (pass -y to skip confirm)?
in xmake-repo:
   -> cosmocc 3.2.4
please input: y (y/n/m)

   => install cosmocc 3.2.4 .. ok
[25%]: cache compiling.release src/main.c
[50%]: linking.release test
[100%]: build ok, spent 1.548s
ruki:console$ xmake run
hello world
```








### C++ Modules improvements

Thank you very much @Arthapz for doing a lot of improvements to C++ Modules, making xmake better support C++ Modules construction, and also fixed many known issues, such as C++ Modules compilation support under msys2/mingw.

### Improve xmake test

Starting from version 2.8.5, we have added a built-in test command: `xmake test`. We only need to configure some test cases through add_tests on the target that needs to be tested to automatically execute the test.

The effect of execution is as follows:

```bash
ruki-2:test ruki$ xmake test
running tests ...
[  2%]: test_1/args        .................................... passed 7.000s
[  5%]: test_1/default     .................................... passed 5.000s
[  8%]: test_1/fail_output .................................... passed 5.000s
[ 11%]: test_1/pass_output .................................... passed 6.000s
[ 13%]: test_2/args        .................................... passed 7.000s
[ 16%]: test_2/default     .................................... passed 6.000s
[ 19%]: test_2/fail_output .................................... passed 6.000s
[ 22%]: test_2/pass_output .................................... passed 6.000s
[ 25%]: test_3/args        .................................... passed 7.000s
...
[ 77%]: test_7/pass_output .................................... failed 5.000s
[ 80%]: test_8/args        .................................... passed 7.000s
[ 83%]: test_8/default     .................................... passed 6.000s
[ 86%]: test_8/fail_output .................................... passed 6.000s
[ 88%]: test_8/pass_output .................................... failed 5.000s
[ 91%]: test_9/args        .................................... passed 6.000s
[ 94%]: test_9/default     .................................... passed 6.000s
[ 97%]: test_9/fail_output .................................... passed 6.000s
[100%]: test_9/pass_output .................................... passed 6.000s

80% tests passed, 7 tests failed out of 36, spent 0.242s
```

In the new version, we have added test support for timeout running.

If some test programs run for a long time without exiting, they will get stuck. We can configure the timeout to force exit and return failure.

```lua
target("test_timeout")
     set_kind("binary")
     set_default(false)
     add_files("src/run_timeout.cpp")
     add_tests("run_timeout", {run_timeout = 1000})
```

In the above configuration, we can configure the timeout period for the specified test program to run through `{run_timeout = 1000}`. If the run times out, the test will fail.

```bash
$ xmake test
[100%]: test_timeout/run_timeout ............................. failed 1.006s
run failed, exit code: -1, exit error: wait process timeout
```


### Support Android NDK r26b

Since Android NDK r26b, NDK has made great changes to the structure of the internal build tool chain and completely uses llvm clang to build programs. Therefore, the new version of xmake has made some adaptations to it so that it can continue to support new N.D.K.

### Improve runtime configuration

In addition, we have also improved the `set_runtimes` interface. In addition to the previously supported `MT/MD/MTd/MDd` and other Windows msvc runtime library configurations, we have also added `c++_static`, `c++_shared` `, `stdc++_static`, `stdc++_shared` and other library configurations,

They are used in clang/gcc's c++ runtime library configuration. For Android platform compilation, we also merged and unified the existing `xmake f --ndk_cxxstl=` and other configurations into `xmake f --runtimes=`, corresponding to `set_runtimes`.

In addition to settings, we can also obtain and determine the current runtimes library in the target through interfaces such as `target:runtimes()` and `target:has_runtime()`. In the package, the same interface is also available.

For example:

```lua
target("test")
     add_files("src/*.cpp")
     on_load(function (target)
         if target:has_runtime("c++_shared", "c++_static") then
             -- TODO
         end
     end)
```

If the `c++_static` configuration is in effect, flags such as `-stdlib=libc++ -static-libstdc++` will be automatically added when Clang is compiled, and if `stdc++_static` corresponds to `-stdlib=slibtdc++` .

### Improve script matching mode

All script configuration interfaces such as `on_xxx`, `before_xxx` and `after_xxx` in xmake can set the platform architecture mode in which the script can be run in the first parameter.

The configured script can be executed only if the specified mode matches the current architecture mode. Its complete filtering syntax is as follows: `plat|arch1,arch2@host|arch1,arch2`

It looks very complicated, but it is actually very simple. Each stage is optional and can be partially omitted, corresponding to: `Compilation platform|Compilation architecture@Host platform|Host architecture`

If you do not set any platform filter conditions, all platforms will be supported by default, and the scripts inside will take effect on all platforms, for example:

```lua
on_install(function (package)
     -- TODO
end)
```

If the installation script is effective for a specific platform, then directly specify the corresponding compilation platform. You can specify multiple ones at the same time:

```lua
on_install("linux", "macosx", function (package)
     -- TODO
end)
```

If you need to subdivide it into a specific architecture to take effect, you can write like this:


```lua
on_install("linux|x86_64", "iphoneos|arm64", function (package)
     -- TODO
end)
```

If you also want to limit the execution host environment platform and architecture, you can append `@host|arch` behind, for example:

```lua
on_install("mingw@windows", function (package)
     -- TODO
end)
```

This means that it only takes effect when compiling the mingw platform under windows.

We can also not specify which platform and architecture, but only set the host platform and architecture. This is usually used to describe some dependency packages related to compilation tools, which can only be run in the host environment.

For example, if the package we compile depends on cmake, we need to add the package description of cmake, thenThe compilation and installation environment inside can only be the host platform:

```lua
on_install("@windows", "@linux", "@macosx", function (package)
     -- TODO
end)
```

Some other examples:

```lua
-- `@linux`
-- `@linux|x86_64`
-- `@macosx,linux`
-- `android@macosx,linux`
-- `android|armeabi-v7a@macosx,linux`
-- `android|armeabi-v7a@macosx,linux|x86_64`
-- `android|armeabi-v7a@linux|x86_64`
```

In 2.8.7, we improved pattern matching support and added the ability to exclude specified platforms and architectures, such as:

```
!plat|!arch@!subhost|!subarch
```

```bash
@!linux
@!linux|x86_64
@!macosx,!linux
!android@macosx,!linux
android|!armeabi-v7a@macosx,!linux
android|armeabi-v7a,!iphoneos@macosx,!linux|x86_64
!android|armeabi-v7a@!linux|!x86_64
!linux|*
```

At the same time, a built-in `native` architecture is also provided to match the local architecture of the current platform, mainly used to specify or exclude cross-compilation platforms.

```lua
on_install("macosx|native", ...)
```

The above configuration, if used on a macOS x86_64 device, will only match the local architecture compilation of `xmake f -a x86_64`.

If it is cross-compiled with `xmake f -a arm64`, it will not be matched.

In the same way, if you only want to match cross-compilation, you can use `macosx|!native` to negate and exclude.

This mode improvement is actually mainly used to simplify the configuration of warehouse packages and better handle the configuration support of package installation scripts on different platforms.


## Changelog

### New features

* [#4544](https://github.com/xmake-io/xmake/issues/4544): Support to wait process timeout for `xmake test`
* [#4606](https://github.com/xmake-io/xmake/pull/4606): Add `add_versionfiles` api in package
* [#4709](https://github.com/xmake-io/xmake/issues/4709): Add cosmocc toolchain support
* [#4715](https://github.com/xmake-io/xmake/issues/4715): Add is_cross() api in description scope
* [#4747](https://github.com/xmake-io/xmake/issues/4747): Add `build.always_update_configfiles` policy

### Changes

* [#4575](https://github.com/xmake-io/xmake/issues/4575): Check invalid scope name
* Add more loong64 support
* Improve dlang/dmd support for frameworks
* [#4571](https://github.com/xmake-io/xmake/issues/4571): Improve `xmake test` output
* [#4609](https://github.com/xmake-io/xmake/issues/4609): Improve to detect vs build tool envirnoments
* [#4614](https://github.com/xmake-io/xmake/issues/4614): Support android ndk 26b
* [#4473](https://github.com/xmake-io/xmake/issues/4473): Enable warning output by default
* [#4477](https://github.com/xmake-io/xmake/issues/4477): Improve runtimes to support libc++/libstdc++
* [#4657](https://github.com/xmake-io/xmake/issues/4657): Improve to select script pattern
* [#4673](https://github.com/xmake-io/xmake/pull/4673): Refactor modules support
* [#4746](https://github.com/xmake-io/xmake/pull/4746): Add native modules support for cmake generator

### Bugs Fixed

* [#4596](https://github.com/xmake-io/xmake/issues/4596): Fix remote build cache
* [#4689](https://github.com/xmake-io/xmake/issues/4689): Fix deps inherit
