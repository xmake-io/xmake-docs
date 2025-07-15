---
title: Xmake v2.7.7 released, Support Haiku, Improve API check and C++ Modules
date: 2023-02-23
author: Ruki
---
### Improve target configuration source analysis

We have improved the presentation of target information in the `xmake show -t target` command by adding a new configuration source analysis and streamlining some of the relatively redundant information.

We can use it to better troubleshoot where some of the flags we configure actually come from.

The display looks like this.

```bash
$ xmake show -t tbox
The information of target(tbox):
    at: /Users/ruki/projects/personal/tbox/src/tbox/xmake.lua
    kind: static
    targetfile: build/macosx/x86_64/release/libtbox.a
    rules:
      -> mode.release -> ./xmake.lua:26
      -> mode.debug -> ./xmake.lua:26
      -> utils.install.cmake_importfiles -> ./src/tbox/xmake.lua:15
      -> utils.install.pkgconfig_importfiles -> ./src/tbox/xmake.lua:16
    options:
      -> object -> ./src/tbox/xmake.lua:53
      -> charset -> ./src/tbox/xmake.lua:53
      -> database -> ./src/tbox/xmake.lua:53
    packages:
      -> mysql -> ./src/tbox/xmake.lua:43
      -> sqlite3 -> ./src/tbox/xmake.lua:43
    links:
      -> pthread -> option(__keyword_thread_local) -> @programdir/includes/check_csnippets.lua:100
    syslinks:
      -> pthread -> ./xmake.lua:71
      -> dl -> ./xmake.lua:71
      -> m -> ./xmake.lua:71
      -> c -> ./xmake.lua:71
    defines:
      -> __tb_small__ -> ./xmake.lua:42
      -> __tb_prefix__="tbox" -> ./src/tbox/xmake.lua:19
      -> _GNU_SOURCE=1 -> option(__systemv_semget) -> @programdir/includes/check_cfuncs.lua:104
    cxflags:
      -> -Wno-error=deprecated-declarations -> ./xmake.lua:22
      -> -fno-strict-aliasing -> ./xmake.lua:22
      -> -Wno-error=expansion-to-defined -> ./xmake.lua:22
      -> -fno-stack-protector -> ./xmake.lua:51
    frameworks:
      -> CoreFoundation -> ./src/tbox/xmake.lua:38
      -> CoreServices -> ./src/tbox/xmake.lua:38
    mxflags:
      -> -Wno-error=deprecated-declarations -> ./xmake.lua:23
      -> -fno-strict-aliasing -> ./xmake.lua:23
      -> -Wno-error=expansion-to-defined -> ./xmake.lua:23
    includedirs:
      -> src -> ./src/tbox/xmake.lua:26
      -> build/macosx/x86_64/release -> ./src/tbox/xmake.lua:27
    headerfiles:
      -> src/(tbox/**.h)|**/impl/**.h -> ./src/tbox/xmake.lua:30
      -> src/(tbox/prefix/**/prefix.S) -> ./src/tbox/xmake.lua:31
      -> build/macosx/x86_64/release/tbox.config.h -> ./src/tbox/xmake.lua:34
    files:
      -> src/tbox/*.c -> ./src/tbox/xmake.lua:56
      -> src/tbox/hash/bkdr.c -> ./src/tbox/xmake.lua:57
      -> src/tbox/hash/fnv32.c -> ./src/tbox/xmake.lua:57
    compiler (cc): /usr/bin/xcrun -sdk macosx clang
      -> -Qunused-arguments -target x86_64-apple-macos12.6 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX13.0.sdk
    linker (ar): /usr/bin/xcrun -sdk macosx ar
      -> -cr
    compflags (cc):
      -> -Qunused-arguments -target x86_64-apple-macos12.6 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX13.0.sdk -Wall -Werror -Oz -std=c99 -Isrc -Ibuild/macosx/x86_64/release -D__tb_small__ -D__tb_prefix__=\"tbox\" -D_GNU_SOURCE=1 -framework CoreFoundation -framework CoreServices -Wno-error=deprecated-declarations -fno-strict-aliasing -Wno-error=expansion-to-defined -fno-stack-protector
    linkflags (ar):
      -> -cr
```

### Improve package download configuration

If there are packages whose url downloads require specific http headers to be set to authenticate them before they can be downloaded, this policy can be specified.

This is often used for the maintenance of private repository packages within some companies.

```lua
package("xxx")
    set_policy("package.download.http_headers", "TEST1: foo", "TEST2: bar")
```

We can also set the http headers for the specified urls: ```

```lua
package("zlib")
    add_urls("https://github.com/madler/zlib/archive/$(version).tar.gz", {
        http_headers = {"TEST1: foo", "TEST2: bar"}
    })
```

### Improve dlang toolchain support

In previous versions, Xmake only provided a toolchain for dlang, which automatically looked up dmd, ldc2, gdc to adapt to the dlang compiler that was available to compile the project.

However, this approach does not allow the user more flexibility in selecting a specific compiler, and if both dmd and ldc2 are installed, Xmake will always use dmd as the compiler for dlang.

Therefore, in this new version, xmake provides three separate toolchains to select the required dlang compiler.

For example, you can quickly switch to the ldc2 compiler to compile your project by running the following command

```bash
$ xmake f --toolchain=ldc
$ xmake
```

In addition to the ldc toolchain, two other toolchains, dmd, and gdc, can be used separately.

And we have also improved the configuration of the dmd/ldc2 build optimisation options to make the production dlang binaries even smaller and faster.

### Support for external working directory configuration

#### The default build directory mode

Xmake currently provides a build directory model that is a built-in build directory, which means that if we run the xmake command in the root of the current project, the build directory is automatically generated and .xmake is used to store some configuration cache.

```
- projectdir (workdir)
  - build (generated)
  - .xmake (generated)
  - src
  - xmake.lua
```

```bash
$ cd projectdir
$ xmake
```

Of course, we can configure the build directory with `xmake f -o . /build` to configure the build directory, but the .xmake directory will still be in the project source directory.

```bash
$ cd projectdir
$ xmake f -o ... /build
```

This may not be to the liking of some users who like their complete code directories to remain intact and clean.

#### The new external build directory mode

Therefore, with this new version, Xmake offers an alternative way of configuring build directories, namely external directory builds (similar to CMake).

For example, we would like to use a directory structure like the following to build a project, always keeping the source directory clean.

```
- workdir
  - build (generated)
  - .xmake (generated)
- projectdir
  - projectdir
  - xmake.lua
```

We just need to go into the working directory where we need to store the build/.xmake directory and then use the ``xmake f -P [projectdir]` configuration command to specify the source root directory.

```bash
$ cd workdir
$ xmake f -P ... /projectdir
$ xmake
```

Once the configuration is complete, the source code root is completely remembered and there is no need to set it up again for any subsequent build commands.

For example, the commands to build, rebuild, run or install are exactly the same as before and the user will not feel any difference.

```bash
$ xmake
$ xmake run
$ xmake --rebuild
$ xmake clean
$ xmake install
```

We can also use the `-o/--buildir` argument to set the build directory separately to another location, for example to the following structure.

```
- build (generated)
- workdir
  - .xmake (generated)
- projectdir
  - src
  - xmake.lua
```

```bash
$ cd workdir
$ xmake f -P ... /projectdir -o ... /build
```
## Changelog

### New features

* Add Haiku support
* [#3326](https://github.com/xmake-io/xmake/issues/3326): Add `xmake check` to check project code (clang-tidy) and configuration
* [#3332](https://github.com/xmake-io/xmake/pull/3332): add custom http headers when downloading packages

### Changes

* [#3318](https://github.com/xmake-io/xmake/pull/3318): Improve dlang toolchains
* [#2591](https://github.com/xmake-io/xmake/issues/2591): Improve target analysis
* [#3342](https://github.com/xmake-io/xmake/issues/3342): Improve to configure working and build directories
* [#3373](https://github.com/xmake-io/xmake/issues/3373): Improve std modules support for clang-17
* Improve to strip/optimization for dmd/ldc2

### Bugs fixed

* [#3317](https://github.com/xmake-io/xmake/pull/3317): Fix languages for qt project.
* [#3321](https://github.com/xmake-io/xmake/issues/3321): Fix dependfile when generating configiles
* [#3296](https://github.com/xmake-io/xmake/issues/3296): Fix build error on macOS arm64
