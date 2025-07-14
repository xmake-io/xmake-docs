---
title: xmake v2.3.8 released, Add Intel C++/Fortran Compiler Support
tags: [xmake, lua, C/C++, toolchains, wasm, emscripten, qt, intel, icc, fortran]
date: 2020-10-17
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) is a lightweight cross-platform build tool based on Lua. It uses xmake.lua to maintain project builds. Compared with makefile/CMakeLists.txt, the configuration syntax is more Concise and intuitive, very friendly to novices, can get started quickly in a short time, allowing users to focus more on the actual project development.

In this new version, we have made full platform support for the Intel series of C++ and Fortran compilers, and improved the Wasm tool chain support added in the previous version, and also supported the Qt SDK for Wasm.

In addition, we have also upgraded luajit to the latest v2.1 version. In terms of cross-platform, xmake has also made great improvements and added support for mips64 architecture.

* [Project source code](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io/)


## New feature introduction

### Add Intel C++ Compiler support

On this version, we have made full platform support for the Intel series of C++ compilers, including icl on windows and icc/icpc under linux/macOS.

To enable the Intel C++ compiler, we only need to switch to the corresponding toolchain through the `--toolchain=icc` parameter on the system where the Intel compiler is installed.

```bash
$ xmake f --toolchain=icc
$ xmake
```

### Add Intel Fortran Compiler support

In the previous version, xmake only supported the gfortran compiler. In this version, we also support the Intel Fortran compiler, which is ifort. We only need to switch to the corresponding ifort tool chain to use it.

```bash
$ xmake f --toolchain=ifort
$ xmake
```

### Add Wasm platform and Qt/Wasm support

In the last version, we added the `--toolchain=emcc` toolchain to support the compilation of wasm programs, but just specifying the toolchain does not adjust the extension of the target program well, for example, for `*.js` and The file of `*.wasm` is generated.

In the new version, we continue to add the `xmake f -p wasm` platform, the built-in emcc tool chain is enabled, and the surrounding configuration has been improved again based on it.

As long as you switch to the wasm platform, xmake will generate `*.js` and corresponding `*.wasm` and other target files by default, and additionally generate `*.html` pages that can load js to run the wasm program.

In addition, we also support Qt SDK for Wasm, for example, we create a Qt QuickApp project.

```bash
$ xmake create -t qt.quickapp_static quickapp
```

Here, we noticed that what we created is a Qt project that requires a static link. Because of the wasm version of the Qt library, we need to force a static link to the program to use it normally.

The content of the generated project file xmake.lua is roughly as follows:

```lua
add_rules("mode.debug", "mode.release")

includes("qt_add_static_plugins.lua")

target("demo")
    add_rules("qt.quickapp_static")
    add_headerfiles("src/*.h")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
    add_frameworks("QtQuickControls2", "QtQuickTemplates2")
    qt_add_static_plugins("QtQuick2Plugin", {linkdirs = "qml/QtQuick.2", links = "qtquick2plugin"})
    qt_add_static_plugins("QtQuick2WindowPlugin", {linkdirs = "qml/QtQuick/Window.2", links = "windowplugin"})
    qt_add_static_plugins("QtQuickControls2Plugin", {linkdirs = "qml/QtQuick/Controls.2", links = "qtquickcontrols2plugin"})
    qt_add_static_plugins("QtQuickTemplates2Plugin", {linkdirs = "qml/QtQuick/Templates.2", links = "qtquicktemplates2plugin"})
```

In the above configuration, in addition to enabling the `qt.quickapp_static` compilation rules, we also configure some necessary Qt plugins through `qt_add_static_plugins`.

Next, we only need to switch to the wasm platform and make sure that the Qt SDK is set to complete the compilation.

```bash
$ xmake f -p wasm [--qt=~/Qt]
$ xmake
```

After the compilation is completed, xmake will generate demo.html and the corresponding demo.js/demo.wasm program in the build directory. We can open the demo.html page to run the Qt program we compiled. The display effect is as follows:

![](/assets/img/posts/xmake/xmake-qt-wasm.png)

For a more detailed description of Qt/Wasm, see: [Issue #956](https://github.com/xmake-io/xmake/issues/956)






### Add Math/Float-point compilation optimization settings

We have added a new `set_fpmodels()` setting interface, which is used to set the floating-point compilation mode and the compilation abstraction settings for the optimization of mathematical calculations. It provides several commonly used levels such as fast, strict, except, precise, and some Set at the same time, some conflicts, the last setting takes effect.

For the description of these levels, you can refer to the Microsoft document: [Specify floating-point behavior](https://docs.microsoft.com/en-us/cpp/build/reference/fp-specify-floating-point-behavior ?view=vs-2019)

Of course, for other compilers such as gcc/icc, xmake will map to different compilation flags.

```lua
set_fpmodels("fast")
set_fpmodels("strict")
set_fpmodels("fast", "except")
set_fpmodels("precise") - default
```

For details on this, see: [Issue #981](https://github.com/xmake-io/xmake/issues/981)

### Add OpenMP Support

In order to enable the openmp feature more abstractly and simply, we can set it through the newly added `c.openmp` and `c++.openmp` rules. In addition, we need additional libomp libraries on linux and macOS, so we can pass ʻAdd_requires("libomp")` for quick reference and integration.


```lua
add_requires("libomp", {optional = true})
target("loop")
    set_kind("binary")
    add_files("src/*.cpp")
    add_rules("c++.openmp")
    add_packages("libomp")
```

If it is c code, you need to enable ʻadd_rules("c.openmp")`. If it is c/c++ mixed compilation, then these two rules must be set.

### Add c11/c17 support

In the new version, xmake has also made improvements to `set_languages`, adding new c11/c17 settings, and at the same time adapting and adapting `/std:c11` and `/std:c17` provided by the latest version of msvc. stand by.

We only need simple settings:

```lua
set_languages("c17")
```

You can enable the c17 standard to compile, even if the lower version of msvc and other compilers do not support it, xmake will automatically ignore the settings.

### Better Mingw support

Regarding this improvement, several aspects are involved. The first is the improvement of the automatic detection of the Mingw SDK root directory under Windows. In most cases, we do not need to configure the `--mingw=` parameter to specify the path explicitly, and it can also It was automatically detected.

For details on this, see: [Issue #977](https://github.com/xmake-io/xmake/issues/977)

In addition, in addition to Msys2/Mingw as well as macOS, linux/Mingw, we additionally support [llvm-mingw](https://github.com/mstorsjo/llvm-mingw) this SDK in the new version, so that we can use mingw to compile the program of arm/arm64 architecture.

```bash
$ xmake f -p mingw -a arm64
$ xmake
```

In addition, in the automatic compilation and integration of remote dependency packages, there are now third-party libraries with cmakelists. Even on the mingw platform, xmake can be automatically compiled and integrated for direct use, which is very fast and convenient.

Recently, in the [xmake-repo](https://github.com/xmake-io/xmake-repo) official C/C++ package repository, we have also added a lot of new libraries that support the mingw platform, which can be used directly .

### Better cross-platform operation

We have added support for mips64-based Linux system operation, and improved the stability of xmake under arm/arm64. By incorporating the latest luajit v2.1, we have solved many problems left by luajit, such as the bad of lightuserdata under arm64. Pointer and other issues.

### Add macOS Sierra for arm64 support

xmake has also adapted the latest Xcode-beta, and added macOs for arm64 target program compilation support, just switch to the arm64 architecture compilation.

```bash
$ xmake f -a arm64 [--xcode=Applications/Xcode-beta.app/]
$ xmake
```

Of course, the premise is to run under macOS and use the latest Xcode-beta version that supports the Developer Transition Kit (DTK).

### Add more C/C++ libraries for the official repository

In the official C/C++ repository of xmake [xmake-repo](https://github.com/xmake-io/xmake-repo), we have recently added dozens of commonly used C/C++ libraries, and also The libraries of the libx11 series are all included.

Although the warehouse package maintenance workload is huge, the current development trend is also becoming more and more active. We have received more and more users' contributions and improved maintenance to the warehouse package.

And, now our official warehouse can be quickly integrated: linux, macOS, windows, mingw, bsd, msys, iphoneos, android and other eight common platform libraries, to achieve true cross-platform C/C++ remote dependency library integration and use support.

![](/assets/img/posts/xmake/xmake-packages.png)

Currently we have included a list of some packages and supporting platforms, you can view from here: [PKGLIST.md](https://github.com/xmake-io/xmake-repo/blob/master/PKGLIST.md)

We have been working hard to solve the problems of messy C/C++ library ecology and cumbersome integration and use, and provide quick and consistent automatic integration and compilation solutions. xmake not only supports the integration of third-party official warehouse packages such as vcpkg/conan/clib/homebrew, but also We are working hard to improve our self-built official warehouse to achieve a better integrated experience.

for example:

```lua
add_requires("tbox >1.6.1", "libuv master", "vcpkg::ffmpeg", "brew::pcre2/libpcre2-8")
add_requires("conan::openssl/1.1.1g", {alias = "openssl", optional = true, debug = true})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libuv", "vcpkg::ffmpeg", "brew::pcre2/libpcre2-8", "openssl")
```

Packages with namespaces such as `vcpkg::`, `brew::` and `conan::` will automatically switch to the corresponding third-party package warehouse to download and integrate, and the default `tbox >1.6.1` etc. Library, the package provided in the official xmake-repo repository will be used by default.

The usage and integration methods are exactly the same, xmake will automatically download, compile, integrate and link.

For more detailed instructions on the dependency integration of remote packages, we can look at the relevant documentation: [Remote dependency library integration and use](/zh/guide/package-management/using-official-packages)

At the same time, we also welcome more people to participate to help improve the construction of the C/C++ library ecology, and provide a concise and consistent library experience. I believe that C/C++ package management and library ecology are not worse than Rust/Go.

### More release version installation support

In the new version, we submitted xmake to the Ubuntu PPA source, so in addition to the existing script installation method, we can also quickly install xmake through apt.

```bash
sudo add-apt-repository ppa:xmake-io/xmake
sudo apt update
sudo apt install xmake
```

At the same time, we also submitted the package to the Copr package management repository, so that we can also quickly install xmake through dnf in Fedora, RHEL, OpenSUSE, CentOS and other distributions.

```bash
sudo dnf copr enable waruqi/xmake
sudo dnf install xmake
```

## Changelog

### New features

* [#955](https://github.com/xmake-io/xmake/issues/955): Add zig project templates
* [#956](https://github.com/xmake-io/xmake/issues/956): Add wasm platform and support Qt/Wasm SDK
* Upgrade luajit vm and support for runing on mips64 device
* [#972](https://github.com/xmake-io/xmake/issues/972): Add `depend.on_changed()` api to simplify adding dependent files
* [#981](https://github.com/xmake-io/xmake/issues/981): Add `set_fpmodels()` for math optimization mode
* [#980](https://github.com/xmake-io/xmake/issues/980): Support Intel C/C++ and Fortran Compiler
* [#986](https://github.com/xmake-io/xmake/issues/986): Support for `c11` and `c17` for MSVC Version 16.8 and Above
* [#979](https://github.com/xmake-io/xmake/issues/979): Add Abstraction for OpenMP. `add_rules("c++.openmp")`

### Change

* [#958](https://github.com/xmake-io/xmake/issues/958): Improve mingw platform to support llvm-mingw toolchain
* Improve `add_requires("zlib~xxx")` to support for installing multi-packages at same time
* [#977](https://github.com/xmake-io/xmake/issues/977): Improve find_mingw for windows
* [#978](https://github.com/xmake-io/xmake/issues/978): Improve toolchain flags order
* Improve Xcode toolchain to support for macOS/arm64

### Bugs fixed

* [#951](https://github.com/xmake-io/xmake/issues/951): Fix emcc support for windows
* [#992](https://github.com/xmake-io/xmake/issues/992): Fix filelock bug