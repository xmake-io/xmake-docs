---
title: Xmake and C/C++ Package Management
tags: [xmake, lua, C/C++, Package, Manager]
date: 2022-03-12
author: Ruki
---

[Xmake](https://github.com/xmake-io/xmake) is a lightweight cross-platform build tool based on Lua.
We have done a detailed introduction to Xmake and build system in previous articles. Introduction: [C/C++ build system, I use xmake](https://github.com/xmake-io/xmake/wiki/C-and-Cplusplus-build-system,-I-use-xmake).

If you already have a general understanding of Xmake, you will know that it is not only a build tool,
but also has built-in support for C/C++ package management. We can also understand Xmake as:

```
Xmake = Build backend + Project Generator + Package Manager
```

After several years of continuous iteration, Xmake's support for C/C++ package management has been continuously improved,
and many useful package management features have been added. Therefore, in this article, we will make some summaries on it, hoping to help everyone.

* [Github](https://github.com/xmake-io/xmake)
* [Document](https://xmake.io/)

### Build system and package management

The ecology of C++ is very complex, and there are certain historical reasons for this.
In any case, the official does not provide native package management support.
For our developers, it is somewhat inconvenient to use third-party C++ dependent libraries.

In fact, there are already many powerful C/C++ package managers, the most well-known and most used are: vcpkg, conan, conda, etc.
Although they are very powerful, they have a common problem: The build system doesn't have built-in support for them.

Since CMake does not provide built-in support for them, it is very cumbersome to use them in CMake to integrate dependencies,
and the way of integration and use is inconsistent.

#### Using Conan with CMake

To use conan to integrate C/C++ packages in CMake, we need to provide additional CMake Wrapper scripts and
inject them into our own projects in a similar way as plug-ins.






```cmake
cmake_minimum_required(VERSION 3.5)
project(FormatOutput CXX)

list(APPEND CMAKE_MODULE_PATH ${CMAKE_BINARY_DIR})
list(APPEND CMAKE_PREFIX_PATH ${CMAKE_BINARY_DIR})

add_definitions("-std=c++11")

if(NOT EXISTS "${CMAKE_BINARY_DIR}/conan.cmake")
  message(STATUS "Downloading conan.cmake from https://github.com/conan-io/cmake-conan")
  file(DOWNLOAD "https://raw.githubusercontent.com/conan-io/cmake-conan/v0.16.1/conan.cmake"
                "${CMAKE_BINARY_DIR}/conan.cmake"
                EXPECTED_HASH SHA256=396e16d0f5eabdc6a14afddbcfff62a54a7ee75c6da23f32f7a31bc85db23484
                TLS_VERIFY ON)
endif()

include(${CMAKE_BINARY_DIR}/conan.cmake)

conan_cmake_configure(REQUIRES fmt/6.1.2
                      GENERATORS cmake_find_package)

conan_cmake_autodetect(settings)

conan_cmake_install(PATH_OR_REFERENCE .
                    BUILD missing
                    REMOTE conancenter
                    SETTINGS ${settings})

find_package(fmt)

add_executable(main main.cpp)
target_link_libraries(main fmt::fmt)
```

In order to integrate a package, a lot of additional scripts need to be configured.

#### Using Vcpkg with CMake

To use the vcpkg integration package in CMake, we also need to inject an additional toolchain script file.

```bash
cmake -B [build directory] -S . -DCMAKE_TOOLCHAIN_FILE=[path to vcpkg]/scripts/buildsystems/vcpkg.cmake
cmake --build [build directory]
```

In addition, there is another problem, that is, we need to additionally call the `vcpkg install [packages]` command to install this package.

Each of these links requires an additional exploration process for users, and it is impossible to achieve real one-click compilation.

When we download a cmake project that integrates the vcpkg package, and if we want to compile it,
what additional things need to be done in addition to the project configuration:

1. Install vcpkg
2. Execute `vcpkg install xxx` to install the required packages
3. Execute cmake to pass the vcpkg.cmake script to cmake for project configuration

#### Using FetchContent in CMake

CMake can also provide `FetchContent` to manage dependencies, but it seems to need download source code,
and all dependencies must be maintained and built based on CMake.

In addition, we need to configure various package information such as url, version, etc. for each dependency.

```cmake
cmake_minimum_required(VERSION 3.14)
project(fetchContent_example CXX)

include(FetchContent)

FetchContent_Declare(
        DocTest
        GIT_REPOSITORY "https://github.com/onqtam/doctest"
        GIT_TAG "932a2ca50666138256dae56fbb16db3b1cae133a"
)
FetchContent_Declare(
        Range-v3
        GIT_REPOSITORY "https://github.com/ericniebler/range-v3"
        GIT_TAG "4d6a463bca51bc316f9b565edd94e82388206093"
)

FetchContent_MakeAvailable(DocTest Range-v3)

add_executable(${PROJECT_NAME} src/main.cpp)
target_link_libraries(${PROJECT_NAME} doctest range-v3)
```

#### Using dependencies in Meson

Meson is very powerful and also provides its own package management support,
but it is also cumbersome to use other package managers in Meson, such as vcpkg/conan, etc., and does not provide builtin support.

#### Using dependencies in Xmake

Xmake not only provides a built-in [xmake-repo](https://github.com/xmake-io/xmake-repo) package management repository,
which can be directly integrated and used, but also supports the same integration method to quickly integrate third-party dependencies such as vcpkg/conan.

we need only a few lines of configuration to integrate a built-in dependency package:

```lua
add_requires("zlib 1.2.11")
target("test")
    add_files("src/*.c")
    add_packages("zlib")
```

To integrate a vcpkg package, we only need to add the corresponding package manager namespace. like this:

```lua
add_requires("vcpkg::zlib 1.2.11")
target("test")
    add_files("src/*.c")
    add_packages("vcpkg::zlib")
```

To integrate a conan package, or a third-party package such as conda, homebrew, pacman, apt, clib, etc., we only need to change it to `conan::zlib`, and users can switch package sources at will.

In addition, Xmake will automatically call the `vcpkg/conan install` installation command for you to install the dependent packages, and then integrate them, without requiring the user to do anything else, just execute `xmake` one-click compilation.

<img src="/assets/img/index/package_manage.png" width="650px" />

### Too few C/C++ packages?

Do you think there are too few packages in the built-in package repository of Xmake?
It doesn't matter at all. In theory, you can use 90% of the common dependencies in the entire C/C++ ecosystem through Xmake,
because Xmake can quickly integrate packages from various other package managers to use.

The package sources currently supported by Xmake are as follows:

* Official package repository [xmake-repo](https://github.com/xmake-io/xmake-repo) (tbox >1.6.1)
* Official package manager [Xrepo](https://github.com/xmake-io/xrepo)
* [User-built repositories](/zh/guide/package-management/package-distribution)
* Conan (conan::openssl/1.1.1g)
* Conda (conda::libpng 1.3.67)
* Vcpkg (vcpkg:ffmpeg)
* Homebrew/Linuxbrew (brew::pcre2/libpcre2-8)
* Pacman on archlinux/msys2 (pacman::libcurl)
* Apt on ubuntu/debian (apt::zlib1g-dev)
* Clib (clib::clibs/bytes@0.0.4)
* Dub (dub::log 0.4.3)
* Portage on Gentoo/Linux (portage::libhandy)
* Nimble for nimlang (nimble::zip >1.3)
* Cargo for rust (cargo::base64 0.13.0)

Basically, these repositories have basically covered all the packages that C/C++ users need on a daily basis.

We counted the number of packages in the vcpkg/conan/xmake-repo repositories:

* vcpkg: 1859
* conan: 1218
* xmake-repo: 651

It can be seen that the current number of packages in Xmake's built-in repository is approaching vcpkg/conan, and there are quite a few, and we are constantly including new packages.

But that doesn't matter at all because we can use packages from any package repository.

If we use vcpkg in CMake, we can only use 1859 packages.
If we use conan in CMake, we can only use 1218 packages.

And if using packages in Xmake, we can use packages in 651 (xmake-repo) + vcpkg/conan (1k+) + more (conda, homebrew, pacman, apt, clib ...).

Even if C/C++ packages are not enough, packages from other languages can also be used. For example, Xmake also supports pulling packages from Dlang/Rust package managers such as dub/cargo for use in C/C++ projects.

### Xmake built-in package management integration

In addition to accessing third-party package management, we also recommend using the packages provided in the integrated xmake-repo built-in repository first, and Xmake will provide more feature support.

Therefore, if the package you need has not been included, you can try to submit it to [xmake-repo](https://github.com/xmake-io/xmake-repo) first.

Next, we systematically introduce some features of the integrated built-in package.

#### Semantic Versioning Settings

Xmake's dependency package management fully supports semantic version selection, for example: "~1.6.1", for the specific description of semantic version, see: [https://semver.org/](https://semver.org/)

For example, some semantic versions are written as follows:

```lua
add_requires("tbox 1.6.*", "pcre 1.3.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

Of course, if we have no special requirements for the version of the current dependency package, we can write it directly like this:

```lua
add_requires("tbox", "libpng", "zlib")
```

This will use the latest known version of the package, or a package compiled from the source code of the master branch. If the current package has a git repo address, we can also specify a specific branch version:

```lua
add_requires("tbox master")
add_requires("tbox dev")
```

Xmake's semantic versioning support has been well supported for a few years, and vcpkg has barely supported it through manifest mode in the last year.

Even now, vcpkg's support for version semantics is very limited, it can only support several version modes such as `>=1.0`, `1.0`, and you want to select any version of the package, such as `>=1.0 <1.5` and other complex Version-conditional packages, vcpkg still cannot support.

#### Optional package settings

If the specified dependency package is not supported by the current platform, or the compilation and installation fails, Xmake will compile and report an error, which is reasonable for some projects that must depend on certain packages to work.
But if some packages are optional dependencies, they can be compiled and used normally even if they are not available, they can be set as optional packages:

```lua
add_requires("tbox", {optional = true})
```

#### Using system libraries

By default, Xmake will firstly detect whether the system library exists (if no version requirement is set). If the user does not want to use the system library and the library provided by the third-party package management, you can set:

```lua
add_requires("tbox", {system = false})
```

And if configured as:

```lua
add_requires("tbox", {system = true})
```

It just finds and uses the system library, and does not download and install it remotely.
This is similar to CMake's find_package, but the integration method is simpler and more consistent.


#### Use debug builds of packages

If we want to debug the dependency package at the same time, we can set it to use the debug version of the package (of course, the premise is that this package supports debug compilation):

```lua
add_requires("tbox", {debug = true})
```

#### Enable optional features of the package

We can also install packages with specific features, such as installing the ffmpeg package with zlib and libx265 enabled.

```lua
add_requires("ffmpeg", {configs = {zlib = true, libx265 = true}})
```

#### Pass additional compile options

We can also pass additional compile options to the package:


```lua
add_requires("spdlog", {configs = {cxflags = "-Dxxx"}})
```

### Standalone package management commands Xrepo

Xrepo is a cross-platform C/C++ package manager based on [Xmake](https://github.com/xmake-io/xmake).

It is a command program independent of Xmake, which is used to assist users to manage dependency packages, similar to vcpkg/conan, but compared with them, it has some additional practical features, we will briefly introduce some.

![](https://xrepo.xmake.io/assets/img/xrepo.gif)

#### Multiple repository management

In addition to retrieving the installation package directly from the official repository: [xmake-repo](https://github.com/xmake-io/xmake-repo),
We can also add any number of self-built repositories, and even completely isolate the external network, and only maintain the installation and integration of private packages on the company's internal network.

Just add your own repository url with the following command:

```bash
$ xrepo add-repo myrepo https://github.com/mygroup/myrepo
```

#### Basic usage

```bash
$ xrepo install zlib tbox
```

#### Install the specified version package

Full support for Semantic Versioning.

```bash
$ xrepo install "zlib 1.2.x"
$ xrepo install "zlib >=1.2.0"
```

#### Install the specified platform package

```bash
$ xrepo install -p iphoneos -a arm64 zlib
$ xrepo install -p android [--ndk=/xxx] zlib
$ xrepo install -p mingw [--mingw=/xxx] zlib
$ xrepo install -p cross --sdk=/xxx/arm-linux-musleabi-cross zlib
```

#### Install debug version package

```bash
$ xrepo install -m debug zlib
```

#### Install dynamic library version package

```bash
$ xrepo install -k shared zlib
```

#### Install the specified configuration package

```bash
$ xrepo install -f "vs_runtime=MD" zlib
$ xrepo install -f "regex=true,thread=true" boost
```

#### Install packages from third-party package managers

```bash
$ xrepo install brew::zlib
$ xrepo install vcpkg::zlib
$ xrepo install conan::zlib/1.2.11
```

#### View the library usage information of the package

```bash
$ xrepo fetch pcre2
{
  {
    linkdirs = {
      "/usr/local/Cellar/pcre2/10.33/lib"
    },
    links = {
      "pcre2-8"
    },
    defines = {
      "PCRE2_CODE_UNIT_WIDTH=8"
    },
    includedirs = "/usr/local/Cellar/pcre2/10.33/include"
  }
}
```

```bash
$ xrepo fetch --ldflags openssl
-L/Users/ruki/.xmake/packages/o/openssl/1.1.1/d639b7d6e3244216b403b39df5101abf/lib -lcrypto -lssl
```

```bash
$ xrepo fetch --cflags openssl
-I/Users/ruki/.xmake/packages/o/openssl/1.1.1/d639b7d6e3244216b403b39df5101abf/include
```

```bash
$ xrepo fetch -p [iphoneos|android] --cflags "zlib 1.2.x"
-I/Users/ruki/.xmake/packages/z/zlib/1.2.11/df72d410e7e14391b1a4375d868a240c/include
```

```bash
$ xrepo fetch --cflags --ldflags conan::zlib/1.2.11
-I/Users/ruki/.conan/data/zlib/1.2.11/_/_/package/f74366f76f700cc6e991285892ad7a23c30e6d47/include -L/Users/ruki/.conan/data/zlib/1.2.11/_/_/package /f74366f76f700cc6e991285892ad7a23c30e6d47/lib -lz
```

#### Import and export installed packages

xrepo can quickly export installed packages, including corresponding library files, header files, etc.

```bash
$ xrepo export -o /tmp/output zlib
```

You can also import the previously exported installation package on other machines to implement package migration.

```bash
$ xrepo import -i /xxx/packagedir zlib
```

#### Search for supported packages

```bash
$ xrepo search zlib "pcr*"
    zlib:
      -> zlib: A Massively Spiffy Yet Delicately Unobtrusive Compression Library (in xmake-repo)
    pcr*:
      -> pcre2: A Perl Compatible Regular Expressions Library (in xmake-repo)
      -> pcre: A Perl Compatible Regular Expressions Library (in xmake-repo)
```

In addition, you can now search for their packages from third-party package managers such as vcpkg, conan, conda and apt, just add the corresponding package namespace, for example:

```bash
$ xrepo search vcpkg::pcre
The package names:
    vcpkg::pcre:
      -> vcpkg::pcre-8.44#8: Perl Compatible Regular Expressions
      -> vcpkg::pcre2-10.35#2: PCRE2 is a re-working of the original Perl Compatible Regular Expressions library
```

```bash
$ xrepo search conan::openssl
The package names:
    conan::openssl:
      -> conan::openssl/1.1.1g:
      -> conan::openssl/1.1.1h:
```

#### Package virtual environment management

We can customize some package configurations by adding the xmake.lua file in the current directory, and then enter a specific package shell environment.

```lua
add_requires("zlib 1.2.11")
add_requires("python 3.x", "luajit")
```

```bash
$ xrepo env shell
> python --version
> luajit --version
```

### Integrate third-party build systems in Xmake

#### Integrate Cmake projects in Xmake

Xmake does not intend to split the C/C++ ecosystem. It can be well and compatible with existing projects maintained by cmake/autoconf/meson. For example, some other code libraries maintained by CMake can be directly integrated locally and participate in mixed compilation.

In other words, Xmake will not force users to re-port all projects to xmake.lua, and existing CMake projects can be quickly integrated into Xmake projects.

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

The foo directory is a static library maintained by CMake, and the root directory is maintained by Xmake. We can describe how to build the foo code base by defining the `package("foo")` package in xmake.lua.

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

Among them, we use `set_sourcedir()` to set the code directory location of the foo package, and then import the `package.tools.cmake` auxiliary module to call cmake to build the code, xmake will automatically obtain the generated libfoo.a and the corresponding header document.

!> For local source integration only, we don't need to set additional `add_urls` and `add_versions`.

Once the package is defined, we can use it through `add_requires("foo")` and `add_packages("foo")`, just like integrating a remote package.

Also, `on_test` is optional, if you want strictTo check whether the compilation and installation of the package is successful, you can do some tests in it.

For a complete example, see: [Library with CMakeLists](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/library_with_cmakelists)

#### Integrate the Meson project in Xmake

Xmake supports the integration of more third-party source code libraries maintained by other build systems, such as Meson, just need to import and use the `package.tools.meson` auxiliary building module to call meson to build them.

For example, let's pick a package built with meson from the xmake-repo repository as an example:

```lua
package("harfbuzz")
    set_sourcedir(path.join(os.scriptdir(), "3rd/harfbuzz"))
    add_deps("meson")
    on_install(function (package)
        local configs = {"-Dtests=disabled", "-Ddocs=disabled", "-Dbenchmark=disabled", "-Dcairo=disabled", "-Dfontconfig=disabled", "-Dglib=disabled", "-Dgobject= disabled"}
        table.insert(configs, "-Ddefault_library=" .. (package:config("shared") and "shared" or "static"))
        import("package.tools.meson").install(package, configs)
    end)
```

#### Integrate Autoconf project in Xmake

We can also use `package.tools.autoconf` to natively integrate third-party codebases with autoconf maintenance.

```lua
package("libev")
    set_sourcedir(path.join(os.scriptdir(), "3rd/libev"))
    on_install(function (package)
        import("package.tools.autoconf").install(package)
    end)
```

Both `package.tools.autoconf` and `package.tools.cmake` modules can support cross-compilation platforms and toolchains such as mingw/cross/iphoneos/android, xmake will automatically pass the corresponding toolchain into it, users do not need to do any other thing.

#### Integrate Gn project in Xmake

We can also use `package.tools.gn` to natively integrate third-party codebases maintained by GN.

```lua
package("skia")
    set_sourcedir(path.join(os.scriptdir(), "3rd/skia"))
    add_deps("gn", "ninja")
    on_install(function (package)
        import("package.tools.gn").install(package)
    end)
```

Here is the complete script example: [Skia with GN](https://github.com/xmake-io/xmake-repo/blob/master/packages/s/skia/xmake.lua)

### Find packages using CMake/C++ in Xmake

Now CMake is the de facto standard, so the find_package provided by CMake can already find a large number of system libraries and modules. We can also fully reuse this part of the ecology of CMake to expand xmake's integration of packages.

Just change the package namespace to `cmake::` like integrating the vcpkg/conan package.

```lua
add_requires("cmake::ZLIB", {alias = "zlib", system = true})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

We specify `system = true` to tell xmake to force cmake to find the package from the system. If it can't find it, it will not follow the installation logic, because cmake does not provide the installation function of package managers such as vcpkg/conan, but only provides package search. characteristic.

#### Specify the version

```lua
add_requires("cmake::OpenCV 4.1.1", {system = true})
```

#### Specify components

```lua
add_requires("cmake::Boost", {system = true, configs = {components = {"regex", "system"}})}
```

#### Preset switch

```lua
add_requires("cmake::Boost", {system = true, configs = {components = {"regex", "system"},
                                             presets={Boost_USE_STATIC_LIB=true}}})
```

It is equivalent to pre-define some configurations in CMakeLists.txt before calling find_package to find packages internally to control the search strategy and status of find_package.

```
set(Boost_USE_STATIC_LIB ON) -- will be used in FindBoost.cmake
find_package(Boost REQUIRED COMPONENTS regex system)
```

#### Setting environment variables

```lua
add_requires("cmake::OpenCV", {system = true, configs = {envs = {CMAKE_PREFIX_PATH = "xxx"}}})
```

#### Specify custom FindFoo.cmake module script directory

mydir/cmake_modules/FindFoo.cmake

```lua
add_requires("cmake::Foo", {system = true, configs = {moduledirs = "mydir/cmake_modules"}})
```


### Integrate Xrepo dependencies in Cmake

In addition to integrating CMake projects in Xmake, we can also directly integrate the packages provided by Xmake/Xrepo in CMake, just use [xrepo-cmake](https://github.com/xmake-io/xrepo-cmake) to provide CMake Wrapper.

E.g:

```cmake
cmake_minimum_required(VERSION 3.13.0)
project(foo)

# Download xrepo.cmake if not exists in build directory.
if(NOT EXISTS "${CMAKE_BINARY_DIR}/xrepo.cmake")
    message(STATUS "Downloading xrepo.cmake from https://github.com/xmake-io/xrepo-cmake/")
    # mirror https://cdn.jsdelivr.net/gh/xmake-io/xrepo-cmake@main/xrepo.cmake
    file(DOWNLOAD "https://raw.githubusercontent.com/xmake-io/xrepo-cmake/main/xrepo.cmake"
                  "${CMAKE_BINARY_DIR}/xrepo.cmake"
                  TLS_VERIFY ON)
endif()

# Include xrepo.cmake so we can use xrepo_package function.
include(${CMAKE_BINARY_DIR}/xrepo.cmake)

xrepo_package("zlib")

add_executable(example-bin "")
target_sources(example-bin PRIVATE
    src/main.cpp
)
xrepo_target_packages(example-bin zlib)
```

#### Add package with configuration

We, too, can customize the optional features of packages, as in Xmake.

```cmake
xrepo_package("gflags 2.2.2" CONFIGS "shared=true,mt=true")

add_executable(example-bin "")
target_sources(example-bin PRIVATE
    src/main.cpp
)
xrepo_target_packages(example-bin gflags)
```

#### Using packages from third repository

In addition to installing packages from repositories officially maintained by Xmake, we can also use it directly in CMake to install packages from third-party repositories, just by adding the repository name as a namespace.

For example: `vcpkg::zlib`, `conan::pcre2`.

```cmake
xrepo_package("conan::gflags/2.2.2")
xrepo_package("conda::gflags 2.2.2")
xrepo_package("vcpkg::gflags")
xrepo_package("brew::gflags")
```

In this way, we unify the way we integrate and use vcpkg/conan packages in CMake, and additionally provide automatic package installation features, as well as support for other package repositories such as homebrew/conda.