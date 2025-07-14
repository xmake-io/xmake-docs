---
title: xmake vs cmake
tags: [xmake, lua, cmake]
date: 2019-05-29
author: Ruki
---

title: xmake vs cmake
tags: [xmake, lua, cmake]
date: 2019-05-29
author: Ruki

---
First of all, I have to admit that cmake is very powerful and has developed for so many years. The whole ecology is quite perfect and the functions are quite rich. This is not the case with xmake.

The purpose of doing xmake at the beginning was not to completely replace cmake. It didn't make any sense. I just thought that the syntax and ease of use of cmake couldn't satisfy me. I still prefer a simpler and more intuitive way to describe and maintain the project. Provides a near-consistent experience under the platform.

Therefore, xmake's syntax description and experience is still very good, which is one of the biggest highlights of xmake. I have made a lot of improvements in this design, and it is easier to get started quickly in order to lower the threshold of learning and project maintenance.

Here, I only use some of the more dominant features of xmake to compare with cmake, just to highlight the advantages and ease of use of xmake in some aspects, and there is no meaning to devalue cmake.

If you have read the comparative analysis of this article, I feel that xmake is really easy to use, can meet the needs of some project maintenance, solve some pain points, and improve the efficiency of project maintenance.

* [Github](https://github.com/xmake-io/xmake)
* [Documents](https://xmake.io)
* [xmake v2.2.6 released, Support Qt/Adnroid application](https://tboox.org/2019/05/26/xmake-update-v2.2.6/)

### Feature Support

I will first list some of the main basic features of the build tools. Most of the features are supported, and the advantages of xmake are mainly: syntax, package repository management, build experience.

| feature                                    | xmake                                                         | cmake                                                |
|--------                                    | -----                                                         | ------                                               |
| Grammar                                    | Lua syntax, simple and intuitive, fast to get started         | DSL, complex, high learning cost                     |
| Self-built package warehouse management    | Multi-warehouse support, self-built private package warehouse | Not supported                                        |
| Third Party Package Management Integration | vcpkg/conan/brew                                              | vcpkg/conan/Other                                    |
| Build Behavior                             | Direct Build, No Dependencies                                 | Generate Project Files, Call Third Party Build Tools |
| Dependencies                               | Depends only on the build toolchain                           | Dependent build toolchain + third-party build tools  |
| Find Dependencies                          | Support                                                       | Support                                              |
| Compiler Feature Detection                 | Support                                                       | Support                                              |
| Project File Generation                    | Support                                                       | Support                                              |
| Cross-platform                             | Support                                                       | Support                                              |
| IDE/Editor Plugin                          | Support                                                       | Support                                              |
| Modules and Plugin Extensions              | Support                                                       | Support                                              |

### Syntax

#### Empty Project

##### xmake

```lua
target("test")
    set_kind("binary")
    add_files("src/main.c")
```

##### cmake

```lua
add_executable(test "")
target_sources(test PRIVATE src/main.c)
```

#### Add Source Files

##### xmake

xmake supports wildcard matching, adding a batch of source files, `*.c` matches all files in the current directory, `**.c` matches all files in the recursive directory.

In this way, for some new files compiled in the normal project, you don't need to modify xmake.lua every time, and automatically synchronize, which can save a lot of time.

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_files("test/*.c", "example/**.cpp")
```

Xmake's `add_files()` is very flexible and powerful. It not only supports the addition of various types of source files, but also excludes certain specified files while adding them.

For example: recursively add all c files under src, but not all c files under `src/impl/`.

```lua
add_files("src/**.c|impl/*.c")
```

For more instructions on using this interface, see the related documentation: [add_files](https://xmake.io/#/manual#targetadd_files)








##### cmake

```lua
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

#### Conditional compilation

##### xmake

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

##### cmake

```lua
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

#### Custom script

##### xmake

Xmake can be used to insert a custom script to handle its own logic at different stages of compilation and build (including compiling, installing, packaging, running), such as printing a line of output after compilation is complete:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    after_build(function (target)
        print("target file: %s", target:targetfile())
    end)
```

Or customize the run and install logic:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_install(function (target)
        os.cp(target:targetfile(), "/usr/local/bin")
    end)
    on_run(function (target)
        os.run("%s --help", target:targetfile())
    end)
```

In the custom script, users can write a variety of complex scripts, through the [import](https://xmake.io/#/manual#import) interface, you can import a variety of extension modules to use.

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    before_build(function (target)
        import("net.http")
        import("devel.git")
        http.download("https://xmake.io", "/tmp/index.html")
        git.clone("git@github.com:tboox/xmake.git", {depth = 1, branch = "master", outputdir = "/tmp/xmake"})
    end)
```

##### cmake

cmake can also be implemented with `add_custom_command`:

```lua
add_executable(test "")
target_sources(test PRIVATE src/main.c)
add_custom_command(TARGET test POST_BUILD
    COMMENT "hello cmake!"
)
```

However, looked at the different stages, the way to customize the script is not exactly the same, `add_custom_command` can only be used for the customization of the build phase, if you want to customize the installation phase, you have:

```lua
install(SCRIPT cmake_install.cmake)
```

And only the entire installation logic can be replaced, some custom logic can not be implemented before and after the installation, and other customizations such as packaging, running, etc. do not seem to support.

### Build behavior

#### Compile the default platform

##### xmake

Normally, the default platform is compiled to execute xmake. During the build, xmake does not depend on other third-party build tools. Even make does not depend on it, nor does it generate IDE/Makefile files.
Instead, the compiled toolchain is directly compiled for compilation. By default, the multitask acceleration build is automatically started according to the cpu core number.

```console
xmake
```

##### cmake

The cmake is usually a third-party build file such as IDE/Makefile, and then a third-party build tool such as make/msbuild is called to compile.

```console
cmake .
cmake --build .
```

#### Compile the given platform

##### xmake

Xmake can quickly switch between different platforms and architectures in a nearly consistent way.

```console
xmake f -p [iphoneos|android|linux|windows|mingw] -a [arm64|armv7|i386|x86_64]
xmake
```

##### cmake

Cmake seems to be different for the compilation and configuration of different platforms and architectures. The difference is still somewhat, and it takes a little time to study.

```console
cmake -G Xcode -DIOS_ARCH="arm64" .
cmake --build .
```

```console
cmake -G "Visual Studio 9 2008" -A x64
cmake --build .
```

Like the android platform to compile, the way to configure ndk seems to be very cumbersome.

```console
cmake .. -DCMAKE_TOOLCHAIN_FILE=%ANDROID_NDK%\build\cmake\android.toolchain.cmake -DCMAKE_SYSTEM_NAME="Android" -DANDROID_NDK=%ANDROID_NDK% -DANDROID_TOOLCHAIN=clang -DANDROID_PLATFORM=android-24
```

#### Install target

##### xmake

```console
xmake install 
```

##### cmake

```console
cmake -P cmake_install.cmake
```

#### Run target

##### xmake

In most cases, xmake can load the target program running the compiled build without writing a custom script.

```console
xmake run 
```

##### cmake

I haven't found a way to quickly run the specified target program, but I should be able to load it by writing a custom script.

```console
cmake -P cmake_run.cmake
```

### Dependency support

#### Find dependent libraries

##### xmake

Xmake also supports the interface similar to cmake's `find_package` to directly find the system library, and then integrate it. After finding the library, it will automatically add includers, links, linkdirs and other related settings.

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load(function (target)
        target:add(find_packages("openssl", "zlib"))
    end)
```

##### cmake

```lua
add_executable(test main.c)

find_package(OpenSSL REQUIRED)
if (OpenSSL_FOUND)
    target_include_directories(test ${OpenSSL_INCLUDE_DIRS})
    target_link_libraries(test ${OpenSSL_LIBRARIES})
endif() 

find_package(Zlib REQUIRED)
if (Zlib_FOUND)
    target_include_directories(test ${Zlib_INCLUDE_DIRS})
    target_link_libraries(test ${Zlib_LIBRARIES})
endif() 
```

#### Using a third-party library (Conan)

##### xmake

Xmake will automatically call the conan tool to download and install the openssl library, and then integrate it, just execute the xmake command to complete the compilation.

```lua
add_requires("conan::OpenSSL/1.0.2n@conan/stable", {alias = "openssl"}) 
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("openssl")
```

##### cmake

```lua
if(NOT EXISTS "${CMAKE_BINARY_DIR}/conan.cmake")
   message(STATUS "Downloading conan.cmake from https://github.com/conan-io/cmake-conan")
   file(DOWNLOAD "https://github.com/conan-io/cmake-conan/raw/v0.14/conan.cmake"
                 "${CMAKE_BINARY_DIR}/conan.cmake")
endif()

include(${CMAKE_BINARY_DIR}/conan.cmake)

conan_cmake_run(REQUIRES OpenSSL/1.0.2n@conan/stable
                BASIC_SETUP 
                BUILD missing)

add_executable(test main.c)
target_link_libraries(main ${CONAN_LIBS})
```

#### Using the built-in package repository

##### xmake

Xmake has a self-built package repository. Although there aren't a lot of bread here, it will be improved in the future: [xmake-repo](https://github.com/xmake-io/xmake-repo)

We only need to add the relevant required packages, it is very convenient, and support multi-version selection and semantic version control.

Even some common packages support multi-platform integration, such as: zlib library, etc. Even if you compile android/iphoneos/mingw and other platforms, you can download and install them directly.

```lua
add_requires("libuv master", "ffmpeg", "zlib 1.20.*")
add_requires("tbox >1.6.1", {optional = true, debug = true})
target("test")
    set_kind("shared")
    add_files("src/*.c")
    add_packages("libuv", "ffmpeg", "tbox", "zlib")
```

After executing the xmake command, it will automatically download the corresponding package from the repository and compile and install. The integrated link comes in, the effect is as follows:

<div align="center">
<img src="/assets/img/index/package_manage.png" width="80%" />
</div>

In addition to the official package repository, users can also create multiple private repositories themselves to integrate some private packages, which is very helpful for the maintenance of the company's internal projects.

We only need to add our own private repository address to xmake.lua:

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git")
```

Or add it directly from the command line:

```console
xmake repo --add my-repo git@github.com:myrepo/xmake-repo.git
```

A detailed description of this block can be seen in the relevant documentation:

- [Remote dependency mode](/#remote-dependency-mode)
- [add_requires](https://xmake.io/#/manual#add_requires)

Finally, with a xmake dependency package management architecture diagram:

<div align="center">
<img src="/assets/img/index/package_arch.png" width="80%" />
</div>


##### cmake

I didn't see cmake support, but cmake I didn't use much. If there is something wrong, everyone can correct me.