---
title: xmake v2.3.4 released, better toolchain support
tags: [xmake, lua, C/C++, toolchains, cross-compilation]
date: 2020-06-05
author: Ruki
---

In order to make xmake better support cross-compilation, this version I refactored the entire tool chain, making the tool chain switching more convenient and fast, and now users can easily extend their tool chain in xmake.lua.

With regard to platform support, we have added support for *BSD systems. In addition, this version also adds a ninja theme style to achieve ninja-like compilation progress display, for example:

<img src="/assets/img/theme/ninja.png" width="60%" />

* [Github](https://github.com/xmake-io/xmake)
* [Documents](https://xmake.io)




## Introduction of New Features

### Toolchain improvements

#### Toolchain and platform are completely separated

In previous versions, the platform and tool chain were too tightly bound. For example, the `xmake f -p windows` platform can only use msvc compilation by default. If you want to switch to clang or other compilers, you can only cross the compilation platform: `xmake f -p cross`.

But in this case, some settings specific to the windows platform are lost, and users cannot use `if is_plat("windows") then` to judge the windows platform to make specific settings.

In fact, the platform and the tool chain can be opened independently. After the new version has been refactored, even the windows platform and any other platforms can easily and quickly switch to other tool chains such as clang, llvm and so on.

```bash
$ xmake f -p windows --toolchain=clang
```

#### Built-in toolchain

Although xmake's cross-compilation configuration supports all toolchains, and also provides a certain degree of intelligent analysis and toolchain detection, the general solution needs to add various additional configurations for specific toolchain support, such as passing some `--ldflags=` , `--cxflags=` parameter or something.

The new version of xmake has some common tool chains built in, which can save the complicated configuration process of cross-compiling tool chains, and only need to pass the tool chain name to `--toolchain=xxx`.

Switch to the llvm tool chain:

```bash
$ xmake f -p cross --toolchain=llvm --sdk="C:\Program Files\LLVM"
$ xmake
```

切换到GNU-RM工具链：

```bash
$ xmake f -p cross --toolchain=gnu-rm --sdk=/xxx/cc-arm-none-eabi-9-2019-q4-major
$ xmake
```

You can quickly switch the designated cross-compilation toolchain. For the built-in toolchain, you can save most of the configuration. Usually only need to be `--toolchain=` and `--sdk=`, other configurations will be automatically set Ok, make sure it compiles normally.

What other built-in tool chains does xmake support? We can view through the following command:

```bash
$ xmake show -l toolchains
xcode         Xcode IDE
vs            VisualStudio IDE
yasm          The Yasm Modular Assembler
clang         A C language family frontend for LLVM
go            Go Programming Language Compiler
dlang         D Programming Language Compiler
sdcc          Small Device C Compiler
cuda          CUDA Toolkit
ndk           Android NDK
rust          Rust Programming Language Compiler
llvm          A collection of modular and reusable compiler and toolchain technologies
cross         Common cross compilation toolchain
nasm          NASM Assembler
gcc           GNU Compiler Collection
mingw         Minimalist GNU for Windows
gnu-rm        GNU Arm Embedded Toolchain
envs          Environment variables toolchain
fasm          Flat Assembler
```

#### Synchronous switching of toolchain

The new version of xmake also supports full synchronous switching of the toolchain. What does this mean?

For example, if we want to switch from the default gcc to clang compilation, we may need to cut some toolset, `xmake f --cc=clang --cxx=clang --ld=clang++ --sh=clang++`, because the compiler cut , Corresponding linker, static library archiver must cut everything at the same time.

It's really painful to cut one side by one, and the author himself can't stand it, so when refactoring the tool chain, this piece has also been focused on improvement. Now only need:

```bash
$ xmake f --toolchain=clang
$ xmake
```

You can completely cut through all the clang tool set as a whole, so how to switch back to gcc, it is also very convenient:

or

```bash
$ xmake f --toolchain=gcc
$ xmake
```


#### Custom toolchain

In addition, we can also customize the toolchain in xmake.lua, and then specify the switch through `xmake f --toolchain=myclang`, for example:

```lua
toolchain("myclang")
    set_kind("standalone")
    set_toolset("cc", "clang")
    set_toolset("cxx", "clang", "clang++")
    set_toolset("ld", "clang++", "clang")
    set_toolset("sh", "clang++", "clang")
    set_toolset("ar", "ar")
    set_toolset("ex", "ar")
    set_toolset("strip", "strip")
    set_toolset("mm", "clang")
    set_toolset("mxx", "clang", "clang++")
    set_toolset("as", "clang")

    -- ...
```

Among them `set_toolset` is used to set different tool sets one by one, such as compiler, linker, assembler, etc.

By default, xmake will detect tools from the sdk parameters of `xmake f --sdk=xx`. Of course, we can also call `set_sdk("/xxx/llvm")` for each custom tool chain in xmake.lua Write the toolchain SDK address.

For more details about this piece, you can go to the [Custom Tool Chain] (https://xmake.io/zh-cn/manual/custom_toolchain) chapter to view

For more details, please see: [#780](https://github.com/xmake-io/xmake/issues/780)

#### Set up a toolchain for a specific target

In addition to custom toolchains, we can also switch different toolchains individually for a specific target. Unlike set_toolset, this interface is an overall switchover of the complete toolchain, such as cc/ld/sh and a series of tools. set.

This is also a recommended practice, because most compiler tool chains like gcc/clang, the compiler and the linker are used together. To cut it, you have to cut it as a whole. Separate and scattered switch settings will be cumbersome.

For example, we switch the test target to two tool chains of clang+yasm:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("clang", "yasm")
```

Or you can set specific tools in each target's tool chain through `set_toolset`.

```lua
target("test")
    set_kind("binary")
    set_toolset("cxx", "clang")
    set_toolset("ld", "clang++")
```

### ninja build theme

The construction progress style is similar to ninja, using a single-line progress bar, no longer rolling back the progress, users can set according to their own preferences.

The configuration of the default theme is the same except that the progress is displayed differently.

```bash
$ xmake g --theme=ninja
```

<img src="/assets/img/theme/ninja.png" width="60%" />

### Set Build Behavior Strategy

Xmake has many default behaviors, such as: automatic detection and mapping of flags, cross-target parallel construction, etc. Although it provides a certain amount of intelligent processing, it is difficult to adjust and may not meet all users' habits and needs.

Therefore, starting with v2.3.4, xmake provides modified settings for the default build strategy, which is open to users to a certain degree of configurability.

The usage is as follows:

```lua
set_policy("check.auto_ignore_flags", false)
```

You only need to set this configuration in the project root domain to disable the automatic detection and ignore mechanism of flags. In addition, set_policy can also take effect locally for a specific target.

```lua
target("test")
    set_policy("check.auto_ignore_flags", false)
```

!> In addition, if the set policy name is invalid, xmake will also have a warning prompt.

If you want to get a list and description of all the policy configurations supported by the current xmake, you can execute the following command:

```bash
$ xmake l core.project.policy.policies
{
  "check.auto_map_flags" = {
    type = "boolean",
    description = "Enable map gcc flags to the current compiler and linker automatically.",
    default = true
  },
  "build.across_targets_in_parallel" = {
    type = "boolean",
    description = "Enable compile the source files for each target in parallel.",
    default = true
  },
  "check.auto_ignore_flags" = {
    type = "boolean",
    description = "Enable check and ignore unsupported flags automatically.",
    default = true
  }
}
```

#### check.auto_ignore_flags

By default, xmake will automatically detect all the original flags set by the `add_cxflags` and `add_ldflags` interfaces. If the current compiler and linker do not support them, they will be automatically ignored.

This is usually very useful. Like some optional compilation flags, it can be compiled normally even if it is not supported, but it is forced to be set up. When compiling, other users may have a certain degree of support due to the different strength of the compiler. The compilation failed.

However, because automatic detection does not guarantee 100% reliability, sometimes there will be a certain degree of misjudgment, so some users do not like this setting (especially for cross-compilation tool chains, which are more likely to fail).

At present, if the detection fails in v2.3.4, there will be a warning prompt to prevent users from lying inexplicably, for example:

```bash
warning: add_ldflags("-static") is ignored, please pass `{force = true}` or call `set_policy("check.auto_ignore_flags", false)` if you want to set it.
```

According to the prompt, we can analyze and judge ourselves whether it is necessary to set this flags. One way is to pass:

```lua
add_ldflags("-static", {force = true})
```

To display the mandatory settings, skip automatic detection, which is an effective and fast way to deal with occasional flags failure, but for cross-compilation, if a bunch of flags settings cannot be detected, each set force Too tedious.

At this time, we can use `set_policy` to directly disable the default automatic detection behavior for a target or the entire project:

```lua
set_policy("check.auto_ignore_flags", false)
target("test")
    add_ldflags("-static")
```

Then we can set various original flags at will, xmake will not automatically detect and ignore them.

#### check.auto_map_flags

This is another intelligent analysis processing of flags by xmake. Usually, the configuration of xmake built-in api like `add_links`, `add_defines` has cross-platform characteristics, and different compiler platforms will automatically process them into corresponding ones. Original flags.

However, in some cases, users still need to set the original compilation link flags by add_cxflags, add_ldflags, these flags are not good cross compiler

Take `-O0` compiler optimization flags. Although `set_optimize` is used to implement cross-compiler configuration, what if the user directly sets `add_cxflags("-O0")`? It can be processed normally under gcc/clang, but it is not supported under msvc

Maybe we can use `if is_plat() then` to process by platform, but it is very cumbersome, so xmake has built-in automatic mapping function of flags.

Based on the popularity of gcc flags, xmake uses gcc's flags naming convention to automatically map it according to different compilations, for example:

```lua
add_cxflags("-O0")
```

This line setting is still `-O0` under gcc/clang, but if it is currently msvc compiler, it will be automatically mapped to msvc corresponding to `-Od` compilation option to disable optimization.

Throughout the process, users are completely unaware, and can execute xmake directly to compile across compilers.

!> Of course, the current implementation of automatic mapping is not very mature. There is no 100% coverage of all gcc flags, so there are still many flags that are not mapped.

Some users do not like this automatic mapping behavior, so we can completely disable this default behavior through the following settings:

```bash
set_policy("check.auto_map_flags", false)
```

#### build.across_targets_in_parallel

This strategy is also enabled by default and is mainly used to perform parallel builds between targets. In versions prior to v2.3.3, parallel builds can only target all source files within a single target.
For cross-target compilation, you must wait until the previous target is fully linked before you can execute the compilation of the next target, which will affect the compilation speed to a certain extent.

However, the source files of each target can be completely parallelized, and finally the link process is executed together. Versions after v2.3.3 through this optimization, the construction speed is increased by 30%.

Of course, if the build source files in some special targets depend on previous targets (especially in the case of some custom rules, although rarely encountered), we can also disable this optimization behavior through the following settings:

```bash
set_policy("build.across_targets_in_parallel", false)
```

### Add compilation mode

#### mode.releasedbg

Add releasedbg compilation mode configuration rules for the current project xmake.lua, for example:

```lua
add_rules("mode.releasedbg")
```

!> Compared with the release mode, this mode will also enable additional debugging symbols, which is usually very useful.

Equivalent to:

```lua
if is_mode("releasedbg") then
    set_symbols("debug")
    set_optimize("fastest")
    set_strip("all")
end
```

We can switch to this compilation mode by: `xmake f -m releasedbg`.

#### mode.minsizerel

Add minsizerel configuration mode configuration rules for the current project xmake.lua, for example:

```lua
add_rules("mode.minsizerel")
```

!> Compared with the release mode, this mode is more inclined to the minimum code compilation optimization, rather than speed priority.

Equivalent to:

```lua
if is_mode("minsizerel") then
    set_symbols("hidden")
    set_optimize("smallest")
    set_strip("all")
end
```

We can switch to this compilation mode by: `xmake f -m minsizerel`.

### Show specified information and list

#### Show basic information about xmake itself and the current project

```bash
$ xmake show
The information of xmake:
    version: 2.3.3+202006011009
    host: macosx/x86_64
    programdir: /Users/ruki/.local/share/xmake
    programfile: /Users/ruki/.local/bin/xmake
    globaldir: /Users/ruki/.xmake
    tmpdir: /var/folders/32/w9cz0y_14hs19lkbs6v6_fm80000gn/T/.xmake501/200603
    workingdir: /Users/ruki/projects/personal/tbox
    packagedir: /Users/ruki/.xmake/packages
    packagedir(cache): /Users/ruki/.xmake/cache/packages/2006

The information of project: tbox
    version: 1.6.5
    plat: macosx
    arch: x86_64
    mode: release
    buildir: build
    configdir: /Users/ruki/projects/personal/tbox/.xmake/macosx/x86_64
    projectdir: /Users/ruki/projects/personal/tbox
    projectfile: /Users/ruki/projects/personal/tbox/xmake.lua
```

#### Show toolchains list

```bash
$ xmake show -l toolchains
xcode         Xcode IDE
vs            VisualStudio IDE
yasm          The Yasm Modular Assembler
clang         A C language family frontend for LLVM
...
```

#### Show the specified target configuration information

```bash
$ xmake show --target=tbox
The information of target(tbox):
    kind: static
    targetfile: build/macosx/x86_64/release/libtbox.a
    rules: mode.release, mode.debug, mode.profile, mode.coverage
    options: info, float, wchar, exception, force-utf8, deprecated, xml, zip, hash, regex, coroutine, object, charset, database
    packages: mbedtls, polarssl, openssl, pcre2, pcre, zlib, mysql, sqlite3
    links: pthread
    syslinks: pthread, dl, m, c
    cxflags: -Wno-error=deprecated-declarations, -fno-strict-aliasing, -Wno-error=expansion-to-defined, -fno-stack-protector
    defines: __tb_small__, __tb_prefix__="tbox"
    mxflags: -Wno-error=deprecated-declarations, -fno-strict-aliasing, -Wno-error=expansion-to-defined
    headerfiles: src/(tbox/**.h)|**/impl/**.h, src/(tbox/prefix/**/prefix.S), src/(tbox/math/impl/*.h), src/(tbox/utils/impl/*.h), build/macosx/x86_64/release/tbox.config.h
    includedirs: src, build/macosx/x86_64/release
    at: /Users/ruki/projects/personal/tbox/src/tbox/xmake.lua
    sourcebatch(cc): with rule(c.build)
      -> src/tbox/string/static_string.c
         -> build/.objs/tbox/macosx/x86_64/release/src/tbox/string/static_string.c.o
         -> build/.deps/tbox/macosx/x86_64/release/src/tbox/string/static_string.c.o.d
      -> src/tbox/platform/sched.c
         -> build/.objs/tbox/macosx/x86_64/release/src/tbox/platform/sched.c.o
         -> build/.deps/tbox/macosx/x86_64/release/src/tbox/platform/sched.c.o.d
      -> src/tbox/stream/stream.c
         -> build/.objs/tbox/macosx/x86_64/release/src/tbox/stream/stream.c.o
         -> build/.deps/tbox/macosx/x86_64/release/src/tbox/stream/stream.c.o.d
      -> src/tbox/utils/base32.c
         -> build/.objs/tbox/macosx/x86_64/release/src/tbox/utils/base32.c.o
         -> build/.deps/tbox/macosx/x86_64/release/src/tbox/utils/base32.c.o.d
```

#### Show a list of built-in compilation modes

```bash
$ xmake show -l modes
```

#### Show the list of built-in compilation rules

```bash
$ xmake show -l rules
```

#### Show additional information

It is still being perfected, see: https://github.com/xmake-io/xmake/issues/798

Or run:

```bash
$ xmake show --help
```

### New features

* [#630](https://github.com/xmake-io/xmake/issues/630): Support *BSD system, e.g. FreeBSD, ..
* Add wprint builtin api to show warnings
* [#784](https://github.com/xmake-io/xmake/issues/784): Add `set_policy()` to set and modify some builtin policies
* [#780](https://github.com/xmake-io/xmake/issues/780): Add set_toolchains/set_toolsets for target and improve to detect cross-compilation toolchains
* [#798](https://github.com/xmake-io/xmake/issues/798): Add `xmake show` plugin to show some builtin configuration values and infos
* [#797](https://github.com/xmake-io/xmake/issues/797): Add ninja theme style, e.g. `xmake g --theme=ninja`
* [#816](https://github.com/xmake-io/xmake/issues/816): Add mode.releasedbg and mode.minsizerel rules
* [#819](https://github.com/xmake-io/xmake/issues/819): Support ansi/vt100 terminal control

### Change

* [#771](https://github.com/xmake-io/xmake/issues/771): Check includedirs, linkdirs and frameworkdirs
* [#774](https://github.com/xmake-io/xmake/issues/774): Support ltui windows resize for `xmake f --menu`
* [#782](https://github.com/xmake-io/xmake/issues/782): Add check flags failed tips for add_cxflags, ..
* [#808](https://github.com/xmake-io/xmake/issues/808): Support add_frameworks for cmakelists
* [#820](https://github.com/xmake-io/xmake/issues/820): Support independent working/build directory

### Bug fixed

* [#786](https://github.com/xmake-io/xmake/issues/786): Fix check header file deps
* [#810](https://github.com/xmake-io/xmake/issues/810): Fix strip debug bug for linux
