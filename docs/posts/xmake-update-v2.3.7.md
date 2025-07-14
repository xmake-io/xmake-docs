---
title: xmake v2.3.7 released, Add tinyc and emscripten toolchains
tags: [xmake, lua, C/C++, toolchains, tinyc, emscripten, qt, cuda]
date: 2020-09-14
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) is a lightweight cross-platform build tool based on Lua. It uses xmake.lua to maintain project builds. Compared with makefile/CMakeLists.txt, the configuration syntax is more Concise and intuitive, very friendly to novices, can get started quickly in a short time, allowing users to focus more on the actual project development.

With the continuous iterative development of xmake in recent years, xmake has harvested 2.9K stars, 300+ forks, 30+ contributors on Github, and handled 900+ issues, 5400+ Commits, and active users are also growing.

![](https://tboox.org/static/img/xmake/star-history.png)

Now, the xmake v2.3.7 version is released. In the new version, we mainly improved the stability and compatibility of xmake itself. Through two months of continuous iteration, we have fixed various user feedback problems, user experience and The stability has been greatly improved.

In addition, we also added support for TinyC and Emscripten (WebAssembly) compilation tool chains in this version.

Especially for the windows platform, we provide an additional xmake-tinyc installation package, which has a built-in tinyc compiler, so that users can completely escape the bloated vs environment, one-click installation, out of the box, only 5M installation package is needed Simple C programs can be developed, and a complete set of winapi header files are also included.

Finally, we also improved the trybuild mode compilation. Through xmake, third-party projects maintained by autotools/cmake can be quickly compiled, and cross-compilation environments such as android/ios/mingw can be quickly connected to achieve rapid migration and compilation.

* [Project source code](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io/)

## New feature introduction

### More diverse installation methods

In the new version, we submitted the xmake installation package to windows winget and ubuntu ppa repositories, we can install xmake more conveniently and quickly.

#### Winget installation

```bash
winget install xmake
```

#### Ubuntu PPA installation

```bash
sudo add-apt-repository ppa:xmake-io/xmake
sudo apt update
sudo apt install xmake
```

Of course, we also support many other installation methods. For detailed installation methods for other platforms, see: [Installation Document](/zh/guide/installation).

### Richer toolchain support

Currently we have supported a lot of toolchain environments, and in this version, we have added support for TinyC and Emscripten (WebAssembly) compilation toolchains. We can quickly switch to the corresponding toolchain to compile with the following command.

```bash
xmake f --toolchain=[tinyc|emscripten]
xmake
```

In the new version, we also provide two additional installation packages, built-in and integrated TinyC compilation environment, the entire installation package only needs 5M, and also contains winsdk api.

The installation package can be found in the github/releases directory of xmake.

* [xmake-tinyc-v2.3.7.win64.exe](https://github.com/xmake-io/xmake/releases/download/v2.3.7/xmake-tinyc-v2.3.7.win64.exe)
* [xmake-tinyc-v2.3.7.win32.exe](https://github.com/xmake-io/xmake/releases/download/v2.3.7/xmake-tinyc-v2.3.7.win32.exe)

Through this installation package, we can completely get rid of the bloated vs development environment (several G) by compiling and developing C programs, realize one-click installation, and use it out of the box. It is very useful for us to brush leetcode and write some C test code. Yes, there is no need to install the entire vs for this particular installation.

In addition, if we want to view all toolchains supported by xmake, we can execute the following command, and the compilation configuration of `xmake f -p cross --sdk=/xxx` can support more general cross toolchains.

```bash
$ xmake show -l toolchains
xcode         Xcode IDE
vs            VisualStudio IDE
yasm          The Yasm Modular Assembler
clang         A C language family frontend for LLVM
go            Go Programming Language Compiler
dlang         D Programming Language Compiler
gfortran      GNU Fortran Programming Language Compiler
zig           Zig Programming Language Compiler
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
tinyc         Tiny C Compiler
emcc          A toolchain for compiling to asm.js and WebAssembly
```





### TryBuild compilation mode improvement

The so-called trybuild mode is a feature introduced by xmake that adapts to existing third-party build systems, because most existing third-party projects are maintained by third-party build systems such as autotools/cmake. If they are migrated to xmake The cost of migration is relatively high for configuration.

Although the configuration of xmake is very easy to use, there is no need to change the build system for projects that have been stably maintained. xmake is mainly used for the construction and maintenance of some new projects.

Based on this background, xmake adopts the trybuild compilation mode, which is the so-called trial compilation mode, which automatically detects the build system of third-party projects. If it detects that the project is maintained by autotools, it will automatically call `./configure; make` to compile.

If a project maintained by cmake is detected, cmake is automatically called to generate makefile/build.ninja to compile. For users who use xmake, the compilation can always be completed by just executing the command xmake, for example:

```bash
$ xmake
note: configure found, try building it or you can run `xmake f --trybuild=` to set buildsystem (pass -y or --confirm=y/n/d to skip confirm)?
please input: y (y/n)
y
  ...
  CC src/pcre2grep-pcre2grep.o
  CC src/libpcre2_8_la-pcre2_auto_possess.lo
  CC src/libpcre2_8_la-pcre2_config.lo
  ...
build ok!
```

After xmake detects the autotools build system, it will prompt the user if you need to try to call autotools to compile. After typing y to confirm, you can directly complete the compilation. For cmake projects, you only need to execute the same `xmake` command.

You don’t need to care about how autotools/cmake needs to be configured, used and compiled. After all, cmake needs to generate different build files for windows and linux platforms. The compilation methods are also different. One will call make and the other will call msbuild. Big.

Not only that, xmake also docked with `xmake -r` to directly recompile, docked with `xmake clean` to achieve unified file cleaning, and docked with `xmake -v` to achieve unified detailed compilation command viewing.

#### TryBuild's cross-compilation support

If it's just the compilation of the current host platform, you might say, what's the matter, cmake also has `cmake --build .` to compile directly, it is not too troublesome.

So the question is, how to do cross compilation? If you have used autotools/cmake to cross-compile and generate mingw/android/ios target programs, can cmake and autotools still handle it simply and consistently?

Autotools will not say much, anyway, I hate its cross-experience. Every time I cross-compile and transplant a code with an autotools project, it takes a long time. I often have to package various errors and study the transfer of various configuration parameters. Different platforms have different configurations.

And cmake I don’t think it’s easy to use, for example, for the Android platform, I have to do it like this:

```bash
$ cmake \
    -DCMAKE_TOOLCHAIN_FILE=$NDK/build/cmake/android.toolchain.cmake \
    -DANDROID_ABI=$ABI \
    -DANDROID_NATIVE_API_LEVEL=$MINSDKVERSION \
    $OTHER_ARGS
```

For the ios platform, I did not find a short-answer configuration method, but found a third-party ios toolchain configuration, which is very complicated: https://github.com/leetal/ios-cmake/blob/master/ios.toolchain.cmake

For mingw, it is another way. I have been tossing about the environment for a long time, which is very tossing.

Then if you use xmake to dock cmake to achieve cross-compilation, you only need to do this.

Compile the android program:

```bash
xmake f -p android --trybuild=cmake --ndk=/xxx
xmake
```

Compile the ios program:

```bash
xmake f -p iphoneos --trybuild=cmake
xmake
```

Compile the mingw program:

```bash
xmake f -p mingw --trybuild=cmake --mingw=/sdk/xxx
xmake
```

When we only need to configure, enable cmake's try-compilation mode through `--trybuild=cmake`, and then switch to the corresponding platform through `-p android/iphoneos/mingw`, dock the corresponding SDK, and you can use the same method To quickly implement cross-compilation, even if this project is maintained by cmake.

The user does not need to be concerned. If you use cmake to transfer the configuration of different toolchains, xmake will automatically handle it for you. You only need to execute xmake to compile, or execute `xmake -r` to recompile, or view compilation details` xmake -v`.

In addition, you can quickly switch the build architecture by `xmake f -p iphoneos -a arm64 --trybuild=cmake`.

Finally, we need to explain that although trybuild mode can greatly help users save compilation and configuration operations, if the conditions are run, we still hope that everyone can directly use xmake.lua to maintain their projects.

In this way, there is no need to compile with trybuild, and xmake will support cross-compilation more perfectly, because internal xmake will directly compile the project without calling cmake, autotools and other tools, for example:

```bash
xmake f -p iphoneos
xmake
```

or

```bash
xmake f -p android --ndk=/xxx
xmake
```

As you can see, this time we omit the `--trybuild=cmake` parameter, because we don’t need it, we compile directly. At this time, xmake is equivalent to independent make/ninja and does not rely on make at all, and the compilation speed is also Can be completely comparable to ninja.

### Improve the integration of remote dependency packages

#### Cross compilation support

xmake not only supports mingw/autotools cross-compilation support for trybuild, but also supports cross-compilation installation and integration for third parties maintained by cmake/autotools in remote package warehouses.

E.g:

```lua
add_requires("pcre2")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("pcre2")
```

Then by switching to the iphoneos platform, you can quickly integrate and install the pcre2 package of the iphoneos platform, and then compile and link it, even if the pcre2 package is maintained by autotools/cmake.

```bash
xmake f -p iphoneos
xmake
```

#### Private network package warehouse

In this version, we have also made some improvements to the integration of remote dependency packages. For example, you can switch to private network mode by configuring `xmake g --network=private`.

This is mainly used for some company's internal network through xmake's self-built package management warehouse to achieve closed C/C++ dependency package integration, and will not rely on packages from the official warehouse provided by xmake.

#### Recursively export installed packages

xmake previously provided a command to export all third-party dependency packages installed by xmake.

```bash
xmake require --export
```

However, the previous version corresponds to some packages that have dependencies. When exporting, only itself will be exported, and all its dependencies will not be exported. In this version, we have improved it and will also perform all corresponding dependent packages.了export.

### Improve support for Qt SDK environment

In addition, this version also provides better support for the Qt SDK toolchain environment. For example, the Qt SDK toolchain installed by the apt command under the ubuntu system is also supported, while the previous version can only support downloading and installing from the Qt official website The Qt SDK environment.

## Changelog

### New features

* [#2941](https://github.com/microsoft/winget-pkgs/pull/2941): Add support for winget
* Add xmake-tinyc installer without msvc compiler for windows
* Add tinyc compiler toolchain
* Add emcc compiler toolchain (emscripten) to compiling to asm.js and WebAssembly
* [#947](https://github.com/xmake-io/xmake/issues/947): Add `xmake g --network=private` to enable the private network

### Change

* [#907](https://github.com/xmake-io/xmake/issues/907): Improve to the linker optimization for msvc
* Improve to detect qt sdk environment
* [#918](https://github.com/xmake-io/xmake/pull/918): Improve to support cuda11 toolchains
* Improve Qt support for ubuntu/apt
* Improve CMake project generator
* [#931](https://github.com/xmake-io/xmake/issues/931): Support to export packages with all dependences
* [#930](https://github.com/xmake-io/xmake/issues/930): Support to download package without version list directly 
* [#927](https://github.com/xmake-io/xmake/issues/927): Support to switch arm/thumb mode for android ndk
* Improve trybuild/cmake to support android/mingw/iphoneos/watchos toolchains

### Bugs fixed

* [#903](https://github.com/xmake-io/xmake/issues/903): Fix install vcpkg packages fails
* [#912](https://github.com/xmake-io/xmake/issues/912): Fix the custom toolchain
* [#914](https://github.com/xmake-io/xmake/issues/914): Fix bad light userdata pointer for lua on some aarch64 devices