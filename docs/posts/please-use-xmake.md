---
title: C/C++ build system, I use xmake
tags: [xmake, lua, C/C++, buildsystem]
date: 2021-05-03
author: Ruki
---

### What is XMake?

[XMake](https://github.com/xmake-io/xmake) is a modern C/C++ build system based on Lua.

Its grammar is concise and easy to use, friendly to novices, even if you don't know Lua at all, you can get started quickly, and it is completely free of any dependencies, lightweight, and cross-platform.

At the same time, it is also a self-satisfied build system with a powerful package management system and a fast build engine.

Compared with Ninja/Scons/Make as `Build backend`, CMake/Meson as `Project Generator`, and XMake not only provides `Build backend` and `Project Generator` at the same time, it also provides a built-in package manager.

```
xmake = Build backend + Project Generator + Package Manager
```

Therefore, you only need to install an XMake installation package that is less than 3M, and you don’t need to install other tools. You don’t even need to install make, and you don’t need to install heavyweight runtime environments such as Python and Java. You can quickly start your C/C++ development journey.

Maybe someone will say that the compiler always needs to be installed. This is not necessary, because XMake's package management also supports automatically to pull remote compilation toolchains, such as llvm, Mingw, Android NDK or cross-compilation toolchain.

### Why do XMake

Whenever discussing XMake with others in the Reddit community, everyone will always use the following picture to complain.

![](https://imgs.xkcd.com/comics/standards.png)

Although I was a little helpless and numb by the complaints, I still want to explain that the original intention of XMake was not to split the C/C++ ecology. On the contrary, XMake reuses the existing ecology as much as possible.

At the same time, it also allows users to have the same good experience as other languages when developing C/C++ projects, such as Rust/Cargo, Nodejs/Npm, Dlang/Dub, instead of looking for the third package everywhere, and studying how to transplant and compile. toss.

Therefore, if you don’t know XMake, please don’t draw conclusions too early, you can try it first, or take a moment to read the detailed introduction below.

### Features and advantages of XMake

People often ask me what is special about XMake and what are the advantages compared to existing build tools such as CMake and Meson. Why should I use XMake instead of CMake?

Let me talk about the features and advantages first, XMake has the following points:

- Concise and easy-to-learn configuration syntax, non-DSL
- Powerful package management, support semantic version, toolchain management
- Lightweight enough, no dependence
- Fast, the build speed is as fast as Ninja
- Simple and convenient multi-platform and toolchain switching
- Complete plugin system
- Flexible build rules









XMake can be used as a supplement for those newcomers who want a simple and quick start to C/C++ development, or want more convenient and easy-to-use package management, or want to quickly write some short test projects temporarily.

XMake can help them improve development efficiency and make them pay more attention to the C/C++ project itself instead of spending more time on building tools and development environments.

Now, let us introduce these main features of XMake in detail.

### Simple syntax 

CMake designs a DSL language for project configuration, which increases learning costs for users, and its grammatical readability is not very intuitive, it is easy to write overly complex configuration scripts, and also increases maintenance costs.

XMake reuses the existing well-known Lua language as its foundation, and provides a simpler and more straightforward configuration syntax.

Lua itself is a simple and lightweight language. There are only a few keywords and built-in types. Just read an article and you can basically get started. Compared with DSL, you can get a lot of relevant information more conveniently from the Internet. 

#### Basic syntax

However, some people still complain: don't you still have to learn Lua?

In fact, it is not necessary. XMake adopts the method of separating the description field and the script field, so that in 80% of the cases, beginner users only need to configure the description field in a simpler and more direct way. It is completely unnecessary to configure it. As a Lua script, for example:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_files("test/*.c", "example/**.cpp")
```

If because of the parentheses, it is still like a function call of a scripting language, then we can also write it like this (whether to bring the parentheses depends on personal preference, but I personally recommend the above method)

```lua
target "test"
    set_kind "binary"
    add_files "src/*.c"
    add_files "test/*.c"
    add_files "example/**.cpp"
```

We only need to know the common configuration interface, even if we don't know Lua at all, we can quickly configure it.

We can compare the configuration of CMake:

```cmake
add_executable(test "")
file(GLOB SRC_FILES "src/*.c")
file(GLOB TEST_FILES "test/*.c")
file(GLOB_RECURSE EXAMPLE_FILES "example/*.cpp")
target_sources(test PRIVATE
    ${SRC_FILES}
    ${TEST_FILES}
    ${EXAMPLE_FILES}
)
```

Which is more intuitive and readable, at a glance.

#### Condition configuration

If you have a preliminary understanding of some basic knowledge such as Lua, such as conditional judgments such as `if then`, then you can further configure some conditions.

```lua
target("test")
    set_kind("binary")
    add_files("src/main.c")
    if is_plat("macosx", "linux") then
        add_defines("TEST1", "TEST2")
    end
    if is_plat("windows") and is_mode("release") then
        add_cxflags("-Ox", "-fp:fast")
    end
```

Continue to compare the CMake version configuration:

```cmake
add_executable(test "")
if (APPLE OR LINUX)
    target_compile_definitions(test PRIVATE TEST1 TEST2)
endif()
if (WIN32)
    target_compile_options(test PRIVATE $<$<CONFIG:Release>:-Ox -fp:fast>)
endif()
target_sources(test PRIVATE
    src/main.c
)
```

#### Complex script

If you have basically mastered xmake and are familiar with lua syntax and you want more flexible customized configuration, then XMake also provides more complete Lua script customization capabilities, and you can write any complex script.

For example, before building, do some preprocessing of all source files, after building, execute external gradle commands for later packaging, and even we can rewrite internal link rules to achieve deep custom compilation. We can use [import](https: //xmake.io/#/zh/manual#import) interface, import the built-in linker extension module to realize complex and flexible linking process.

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    before_build_file(function (target, sourcefile)
        io.replace(sourcefile, "#define HAVE_XXX 1", "#define HAVE_XXX 0")
    end)
    on_link(function (target)
        import("core.tool.linker")
        linker.link("binary", "cc", target:objectfiles(), target:targetfile(), {target = target})
    end)
    after_build(function (target)
        if is_plat("android" then
            os.cd("android/app")
            os.exec("./gradlew app:assembleDebug")
        end
    end)
```

If you use CMake, you can also implement it in add_custom_command, but it seems that you can only simply execute some batch commands, and you can't do all kinds of complex logic judgments, module loading, custom configuration scripts, and so on.

Of course, using cmake can certainly achieve the functions described above, but it is definitely not that simple.

If you are familiar with cmake, you can also try to help complete the following configuration:

```cmake
add_executable(test "")
file(GLOB SRC_FILES "src/*.c")
add_custom_command(TARGET test PRE_BUILD
    - TODO
    COMMAND echo hello
)
add_custom_command(TARGET test POST_BUILD
    COMMAND cd android/app
    COMMAND ./gradlew app:assembleDebug
)
- How can we override link stage?
target_sources(test PRIVATE
    ${SRC_FILES}
)
```

### Powerful package management

As we all know, in the development of C/C++ related projects, the most important thing is the integration of various dependent packages, because there is no complete package management system like Rust/Cargo.

Therefore, every time we want to use a third-party library, we need to find and study the porting and compilation of various platforms, and we often encounter various compilation problems, which greatly delays the developer’s time and cannot concentrate on the actual The project is under development.

Finally, the current platform is done. If you change to another platform, you need to toss the dependency package again. In order to solve this problem, some third-party package managers, such as vcpkg/conan/conda, etc., have appeared, but some do not support semantic versions. , Some supported platforms are limited, but no matter what, it is a big step towards solving the dependency management of the C/C++ library.

However, with the package manager alone, it is still more troublesome to use them in C/C++ projects, because the corresponding build tools also need to be able to integrate and support them well.

#### CMake and Vcpkg

Let's first look at the integrated support of CMake and Vcpkg:

```
cmake_minimum_required(VERSION 3.0)
project(test)
find_package(unofficial-sqlite3 CONFIG REQUIRED)
add_executable(main main.cpp)
target_link_libraries(main PRIVATE unofficial::sqlite3::sqlite3)
```

Disadvantages:

- Additional configuration is required `-DCMAKE_TOOLCHAIN_FILE=<vcpkg_dir>/scripts/buildsystems/vcpkg.cmake
- Does not support automatic installation of dependent packages, and requires the user to manually execute the `vcpkg install xxx` command to install
- The semantic version of vcpkg is not supported (it is said that the new version is supported)

#### CMake and Conan

```
```cmake
cmake_minimum_required(VERSION 2.8.12)
project(Hello)

add_definitions("-std=c++11")

include(${CMAKE_BINARY_DIR}/conanbuildinfo.cmake)
conan_basic_setup()

add_executable(hello hello.cpp)
target_link_libraries(hello gtest)
```

conanfile.txt

```text
[requires]
gtest/1.10.0

[generators]
cmake
```

Disadvantages:

- Similarly, you still need to call `conan install ..` to install the package
- An additional conanfile.txt file needs to be configured to describe package dependency rules

#### Meson and Vcpkg

I didn't find how to use the vcpkg package in Meson. I just found a related [Issue #3500](https://github.com/mesonbuild/meson/issues/3500) discussion.

#### Meson and Conan

It seems that Meson has not yet supported Conan, but there is a solution in the official Conan document to support alignment, but it is very complicated. I didn't see it. You can research it yourself: [https://docs.conan.io/en/ latest/reference/build_helpers/meson.html](https://docs.conan.io/en/latest/reference/build_helpers/meson.html)

#### XMake and Vcpkg

I have talked about so much before. The integration of other build tools and package management feels very troublesome to use, and different package managers have very different integration methods. Users want to quickly switch from Vcpkg to the Conan package, and the amount of change is very large. .

Next, let's take a look at the packages provided by Vcpkg integrated in XMake:

```lua
add_requires("vcpkg::zlib", {alias = "zlib"})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

We only need to use the corresponding package name on the `add_requires` configuration and the `vcpkg::` ​​package namespace to directly integrate and use the zlib package provided by vcpkg.

Then, we only need to execute the xmake command to complete the entire compilation process, including the automatic installation of the zlib package, without the need to manually execute `vcpkg install zlib`.

```bash
$ xmake
note: try installing these packages (pass -y to skip confirm)?
-> vcpkg::zlib
please input: y (y/n)

=> install vcpkg::zlib .. ok
[25%]: compiling.release src\main.cpp
[50%]: linking.release test
[100%]: build ok!
```

#### XMake and Conan

The next step is to integrate the Conan package, in exactly the same way, just change the package manager name.

```lua
add_requires("conan::zlib", {alias = "zlib"})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

XMake will also automatically install the zlib package in conan, and then automatically integrate and compile.

#### XMake self-built package management

XMake and CMake have other build systems. The biggest difference, and one of the biggest advantages, is that it has a completely self-built package management system. We can not rely on vcpkg/conan at all, and can also quickly integrate dependent packages, such as :

```lua
add_requires("zlib 1.2.x", "tbox >= 1.6.0")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "tbox")
```

Moreover, it also supports complete semantic version selection, multi-platform package integration, cross-compilation tool chain package integration, and even automatic pull and use of compilation tool chain packages.

Not only that, but we can also rely on self-built packages for customized configurations, such as:

##### Use the debug version to depend on the package

We can use the debug version library to implement breakpoint debugging of dependent libraries.

```lua
add_requires("zlib", {debug = true})
```

##### Set msvc runtime library

```lua
add_requires("zlib", {configs = {vs_runtime = "MD"}})
```

##### Use dynamic libraries

The default integrated is static library, we can also switch to dynamic library.

```lua
add_requires("zlib", {configs = {shared = true}})
```

##### Semantic version support

XMake's self-built package integration supports complete version semantic specifications.

```lua
add_requires("zlib 1.2.x")
add_requires("zlib >=1.2.10")
add_requires("zlib ~1.2.0")
```

##### Prohibit the use of system libraries

By default, if the versions match, XMake will give priority to searching and using the libraries that the user has installed on the system. Of course, we can also forcibly prohibit the search and use of system libraries, and only download the installation package from the self-built package repository.

```lua
add_requires("zlib", {system = true})
```

##### Optional dependency package

If the dependent package integration fails, XMake will automatically report an error, interrupt the compilation, and prompt the user: `zlib not found`, but we can also set it as optional package integration. In this way, even if the library is not installed successfully, it will not affect the compilation of the project. , Just skip this dependency.

```lua
add_requires("zlib", {optional = true})
```

##### Package customization configuration

For example, the integration uses the boost library with the context/coroutine module configuration enabled.

```lua
add_requires("boost", {configs = {context = true, coroutine = true}})
```

#### Support package management repository

In addition to supporting vcpkg/conan and self-built repository package integration support, XMake also supports other package management repositorys, such as Conda/Homebrew/Apt/Pacman/Clib/Dub, etc., and the integration method is exactly the same.

Users can quickly switch to use other repository packs without spending too much time studying how to integrate them.

Therefore, XMake does not destroy the C/C++ ecology, but greatly reuses the existing C/C++ ecology, and strives to improve the user experience of C/C++ dependent packages, improve development efficiency, and enable users to have more More time to focus on the project itself.

* Official self-built repository [xmake-repo](https://github.com/xmake-io/xmake-repo) (tbox >1.6.1)
* Official package manager [Xrepo](https://github.com/xmake-io/xrepo)
* [User-built repository](/zh/package/remote_package#%e4%bd%bf%e7%94%a8%e8%87%aa%e5%bb %ba%e7%a7%81%e6%9c%89%e5%8c%85%e4%bb%93%e5%ba%93)
* Conan (conan::openssl/1.1.1g)
* Conda (conda::libpng 1.3.67)
* Vcpkg (vcpkg:ffmpeg)
* Homebrew/Linuxbrew (brew::pcre2/libpcre2-8)
* Pacman on archlinux/msys2 (pacman::libcurl)
* Apt on ubuntu/debian (apt::zlib1g-dev)
* Clib (clib::clibs/bytes@0.0.4)
* Dub (dub::log 0.4.3)

#### Independent package management command (Xrepo)

In order to facilitate the package management in XMake's self-built repository and the management and use of third-party packages, we also provide an independent Xrepo cli command tool to facilitate the management of our dependent packages

We can use this tool to quickly and easily complete the following management operations:

- Installation package: `xrepo install zlib`
- Uninstall the package: `xrepo remove zlib`
- Get package information: `xrepo info zlib`
- Get package compilation link flags: `xrepo fetch zlib`
- Load package virtual shell environment: `xrepo env shell` (this is a very powerful feature)

We can go to [Xrepo Project Homepage](https://github.com/xmake-io/xrepo) to see more introduction and usage.

![](https://xrepo.xmake.io/assets/img/xrepo.gif)


### Lightweight and no dependencies

To use Meson/Scons, you need to install python/pip first. To use Bazel, you need to install a runtime environment such as java. XMake does not need to install any additional dependent libraries and environments. Its own installation package is only 2-3M, which is very lightweight.

Although XMake is based on lua, thanks to the lightweight features of the lua glue language, xmake has fully built-in it, so installing XMake is equivalent to having a complete lua vm.

Some people will say that the compilation tool chain is always needed, not completely. On Windows, we provide a pre-compiled installation package, which can be downloaded and installed directly. The address is: [Releases](https://github.com/ xmake-io/xmake/releases)

In addition, XMake also supports remotely pulling the compilation toolchain, so even if your system environment has not installed any compiler, it doesn’t matter, users don’t have to worry about how to toss the compilation environment, only need to configure the tools needed in xmake.lua The chain is fine.

For example, if we use the mingw-w64 tool chain to compile C/C++ projects on Windows, we only need to do the following configuration.

```lua
add_requires("mingw-w64")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("mingw@mingw-w64")
```

After binding the mingw-w64 toolchain package through the `set_toolchains` configuration, XMake will automatically detect whether mingw-64 exists in the current system. If it has not been installed, it will automatically download and install, and then complete the project compilation. It can be done by executing the command `xmake`.

```bash
$ xmake
note: try installing these packages (pass -y to skip confirm)?
in xmake-repo:
-> mingw-w64 8.1.0 [vs_runtime:MT]
please input: y (y/n)

=> download https://jaist.dl.sourceforge.net/project/mingw-w64/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/8.1.0/threads-posix/seh/x86_64-8.1.0 -release-posix-seh-rt_v6-rev0.7z .. ok
checking for mingw directory ... C:\Users\ruki\AppData\Local\.xmake\packages\m\mingw-w64\8.1.0\aad6257977e0449595004d7441358fc5
[25%]: compiling.release src\main.cpp
[50%]: linking.release test.exe
[100%]: build ok!
```

In addition to mingw-w64, we can also configure remote pull to use other tool chains, and even cross-compile tool chains, such as: llvm-mingw, llvm, tinycc, muslcc, gnu-rm, zig, etc.

If you want to learn more about the pull integration of the remote toolchain, you can read the document: [Automatically pull the remote toolchain](/zh/package/remote_package#%e8 %87%aa%e5%8a%a8%e6%8b%89%e5%8f%96%e8%bf%9c%e7%a8%8b%e5%b7%a5%e5%e5%85%b7%e9%93 %be).

### Extremely fast parallel compilation

Everyone knows that Ninja builds very fast, so many people like to use CMake/Meson to generate build.ninja, and then use Ninja to meet the needs of extremely fast builds.

Although Ninja is fast, we still need to generate build.ninja through the meson.build and CMakelist.txt files first. This generation process will take several seconds or even ten seconds.

And XMake not only has almost the same build speed as Ninja, but also does not need to generate additional build files. It has a built-in build system directly. In any case, only one `xmake` command can be used to achieve extremely fast compilation.

We have also done some comparative test data for your reference:

#### Multi-task parallel compilation test

| Build System | Termux (8core/-j12) | Build System | MacOS (8core/-j12) |
|----- | ---- | --- | --- |
|xmake | 24.890s | xmake | 12.264s |
|ninja | 25.682s | ninja | 11.327s |
|cmake(gen+make) | 5.416s+28.473s | cmake(gen+make) | 1.203s+14.030s |
|cmake(gen+ninja) | 4.458s+24.842s | cmake(gen+ninja) | 0.988s+11.644s |

#### Single task compilation test

| Build System | Termux (-j1) | Build System | MacOS (-j1) |
|----- | ---- | --- | --- |
|xmake | 1m57.707s | xmake | 39.937s |
|ninja | 1m52.845s | ninja | 38.995s |
|cmake(gen+make) | 5.416s+2m10.539s | cmake(gen+make) | 1.203s+41.737s |
|cmake(gen+ninja) | 4.458s+1m54.868s | cmake(gen+ninja) | 0.988s+38.022s |


### Fool-style multi-platform compilation

Another feature of XMake is efficient and simple multi-platform compilation, whether you are compiling programs under windows/linux/macOS, compiling iphoneos/android or cross compiling.

Compilation configuration methods are similar, so users don't need to go here to study how to compile under various platforms.

![](/assets/img/index/xmake-basic-render.gif)

#### Compile native Windows/Linux/MacOS programs

The current native program compilation, we only need to execute:

```bash
$ xmake
```

##### CMake

```bash
$ mkdir build
$ cd build
$ cmake --build ..
```

#### Compile Android program

```bash
$ xmake f -p android --ndk=~/android-ndk-r21e
$ xmake
```

##### CMake

```bash
$ mkdir build
$ cd build
$ cmake -DCMAKE_TOOLCHAIN_FILE=~/android-ndk-r21e/build/cmake/android.toolchain.cmake ..
$ make
```

#### Compile iOS program

```bash
$ xmake f -p iphoneos
$ xmake
```

##### CMake

```bash
$ mkdir build
$ cd build
$ wget https://raw.githubusercontent.com/leetal/ios-cmake/master/ios.toolchain.cmake
$ cmake -DCMAKE_TOOLCHAIN_FILE=`pwd`/ios.toolchain.cmake ..
$ make
```

I didn't find a very convenient way to configure and compile the ios program. I could only find a third-party ios tool chain from other places to configure and compile.

#### Cross compilation

We usually only need to set the root directory of the cross-compilation toolchain. XMake will automatically detect the toolchain structure and extract the compiler inside to participate in the compilation. No additional configuration is required.

```bash
$ xmake f -p cross --sdk=~/aarch64-linux-musl-cross
$ xmake
```

##### CMake

We need to write an additional cross-toolchain.cmake configuration file first.

```cmake
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR aarch64)

set(TOOL_CHAIN_DIR ~/aarch64-linux-musl)
set(TOOL_CHAIN_INCLUDE ${TOOL_CHAIN_DIR}/aarch64-linux-musl/include)
set(TOOL_CHAIN_LIB ${TOOL_CHAIN_DIR}/aarch64-linux-musl/lib)

set(CMAKE_C_COMPILER "aarch64-linux-gcc")
set(CMAKE_CXX_COMPILER "aarch64-linux-g++")

set(CMAKE_FIND_ROOT_PATH ${TOOL_CHAIN_DIR}/aarch64-linux-musl)

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_PACKAGE ONLY)

include_directories(${TOOL_CHAIN_DIR}/aarch64-linux-musl/include)
set(CMAKE_INCLUDE_PATH ${TOOL_CHAIN_INCLUDE})
set(CMAKE_LIBRARY_PATH ${TOOL_CHAIN_LIB})
```

```bash
$ mkdir build
$ cd build
$ cmake -DCMAKE_TOOLCHAIN_FILE=../cross-toolchain.cmake ..
$ make
```

### Conclusion

If you are new to C/C++ development, you can use XMake to quickly get started with C/C++ compilation and construction.

If you want to develop and maintain a cross-platform C/C++ project, you can also consider using XMake to maintain the build, improve development efficiency, and let you focus more on the project itself, and no longer worry about tossing about transplanting dependent libraries.

Welcome to the XMake project:

- [Github project](https://github.com/xmake-io/xmake/)
- [Project Homepage](https://xmake.io/#/)
- [XMake Package Management Repository](https://github.com/xmake-io/xmake-repo)
- Community
  - [Discord chat room](https://discord.gg/xmake)
