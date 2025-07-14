---
title: xmake vs cmake对比分析
tags: [xmake, lua, cmake]
date: 2019-05-29
author: Ruki
---

title: xmake vs cmake对比分析
tags: [xmake, lua, cmake]
date: 2019-05-29
author: Ruki

---
首先，不得不承认，cmake很强大，发展了这么多年，整个生态已经相当完善，功能也相当丰富，这点xmake目前是比不了的。

当初我做xmake的目的，也并不是为了完全替代cmake，这没啥意义，只是觉得cmake的语法和易用性满足不了我，我还是更喜欢更简单直观的方式去描述和维护项目，在不同平台下提供近乎一致的使用体验。

因此，xmake的语法描述和使用体验还是非常好的，这也是xmake最大的亮点之一，我在这块设计上做了很多改进，为了降低学习和项目维护门槛，也更容易快速上手。

在这里，我只拿xmake中一些比较占优的特性去跟cmake作对比，仅仅只是为了突出说明xmake在某些方面的优势和易用性，并没有任何贬低cmake的意思。

如果大家看完此篇文章的对比分析，觉得xmake确实好用，能够满足部分项目维护上的需求，解决一些痛点，提高项目维护效率的话，不妨试试体验下。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [xmake v2.2.6 发布, Qt/Android编译支持](https://tboox.org/cn/2019/05/26/xmake-update-v2.2.6/)

### 特性支持

我先罗列下构建工具的一些主要基础特性对比，大部分特性两者都是支持的，而xmake的优势主要还是在：语法、包仓库管理、构建体验上

| feature          | xmake                        | cmake                            |
|--------          | -----                        | ------                           |
| 语法             | Lua语法，简洁直观，快速上手  | DSL，复杂，学习成本高            |
| 自建包仓库管理   | 多仓库支持，可自建私有包仓库 | 不支持                           |
| 第三方包管理集成 | vcpkg/conan/brew             | vcpkg/conan/其他                 |
| 构建行为         | 直接构建，无依赖             | 生成工程文件，调用第三方构建工具 |
| 依赖             | 仅依赖编译工具链             | 依赖编译工具链+第三方构建工具    |
| 查找依赖包       | 支持                         | 支持                             |
| 编译器特性检测   | 支持                         | 支持                             |
| 工程文件生成     | 支持                         | 支持                             |
| 跨平台           | 支持                         | 支持                             |
| IDE/编辑器插件   | 支持                         | 支持                             |
| 模块和插件扩展   | 支持                         | 支持                             |

### 语法对比

#### 空工程

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

#### 源文件添加

##### xmake

xmake支持通配符匹配的方式，添加一批源文件进来，`*.c`匹配当前目录下所有文件，`**.c`匹配递归目录下所有文件。

这种方式，对于平常项目中新增一些文件编译，就不需要每次修改xmake.lua了，自动同步，可以节省不少时间。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_files("test/*.c", "example/**.cpp")
```

xmake的`add_files()`是非常灵活强大的，不仅可以支持各种不同类型源文件添加，还可以在添加的同时排除一些指定文件。

比如：递归添加src下的所有c文件，但是不包括src/impl/下的所有c文件。

```lua
add_files("src/**.c|impl/*.c")
```

更多关于这个接口的使用说明，见相关文档：[add_files接口文档](/zh/manual#add-files)








##### cmake

cmake似乎需要先遍历文件列表到对应变量，再添加到对应的target中去才行，稍微繁琐些。

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

#### 条件编译

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

#### 自定义脚本

##### xmake

xmake可以在编译构建的不同阶段（包括编译、安装、打包、运行），方便的插入一段自定义脚本来处理自己的逻辑，比如编译完成之后打印一行输出：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    after_build(function (target)
        print("target file: %s", target:targetfile())
    end)
```

或者自定义运行和安装逻辑：

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

在自定义脚本中，用户可以写各种复杂脚本，通过[import](/zh/manual#import)接口，可以导入各种扩展模块来使用。

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

cmake也可以通过`add_custom_command`来实现：

```lua
add_executable(test "")
target_sources(test PRIVATE src/main.c)
add_custom_command(TARGET test POST_BUILD
    COMMENT "hello cmake!"
)
```

不过看了下，不同阶段，自定义脚本的方式并不完全一样，`add_custom_command`只能用于构建阶段的自定义，如果要对安装阶段进行自定义，得：

```lua
install(SCRIPT cmake_install.cmake)
```

并且只能整个替换安装逻辑，无法对安装前后的实现一些自定义逻辑，另外像打包、运行等其他阶段的自定义似乎不支持。

### 构建方式

#### 编译默认平台

##### xmake

通常情况，编译默认平台执行敲xmake，执行构建期间，xmake不会依赖其他第三方构建工具，连make也不依赖，也不会生成IDE/Makefile文件，
而是直接调用的编译工具链进行编译，默认会根据cpu核数自动开启多任务加速构建。

```console
xmake
```

##### cmake

而cmake的通常是先生成对应IDE/Makefile等第三方构建文件，然后调用make/msbuild等第三方构建工具去编译。

```console
cmake .
cmake --build .
```

#### 编译指定平台

##### xmake

xmake可以以近乎一致的方式快速切换不同平台和架构来编译。

```console
xmake f -p [iphoneos|android|linux|windows|mingw] -a [arm64|armv7|i386|x86_64]
xmake
```

##### cmake

cmake似乎对不同平台和架构的编译配置方式，差异性还是有些的，需要花点时间研究下才行。

```console
cmake -G Xcode -DIOS_ARCH="arm64" .
cmake --build .
```

```console
cmake -G "Visual Studio 9 2008" -A x64
cmake --build .
```

像android平台编译，配置ndk的方式似乎也很繁琐。

```console
cmake .. -DCMAKE_TOOLCHAIN_FILE=%ANDROID_NDK%\build\cmake\android.toolchain.cmake -DCMAKE_SYSTEM_NAME="Android" -DANDROID_NDK=%ANDROID_NDK% -DANDROID_TOOLCHAIN=clang -DANDROID_PLATFORM=android-24
```

#### 安装目标

##### xmake

```console
xmake install 
```

##### cmake

```console
cmake -P cmake_install.cmake
```

#### 运行目标

##### xmake

大部分情况下，xmake不需要写自定义脚本就可以直接加载运行编译生成的目标程序。

```console
xmake run 
```

##### cmake

cmake我没找到可以快速运行指定目标程序的方式，但是应该可以通过写一个自定义脚本去加载运行它。

```console
cmake -P cmake_run.cmake
```

### 依赖支持

#### 查找依赖库

##### xmake

xmake也是支持跟cmake的`find_package`类似的接口去直接查找系统库，然后集成使用，找到库后，会自动追加includedirs, links, linkdirs等相关设置。

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

#### 使用第三方库(Conan)

##### xmake

xmake会自动调用conan工具去下载安装openssl库，然后集成使用，只需要执行xmake命令即可完成编译。

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

#### 使用内建包仓库

##### xmake

xmake有自建的包仓库，虽然现在里面包还不是很多，但后期会不断完善：[xmake-repo](https://github.com/xmake-io/xmake-repo)

我们只需要添加相关需要的包就行了，非常方便，并且支持多版本选择和语义版本控制哦。

甚至有些常用包支持多平台集成使用，例如：zlib库等，即使编译android/iphoneos/mingw等平台，也都可以直接下载安装使用。

```lua
add_requires("libuv master", "ffmpeg", "zlib 1.20.*")
add_requires("tbox >1.6.1", {optional = true, debug = true})
target("test")
    set_kind("shared")
    add_files("src/*.c")
    add_packages("libuv", "ffmpeg", "tbox", "zlib")
```

执行xmake命令后，会去自动从仓库中下载对应的包然后编译安装，集成链接进来，效果如下：

<div align="center">
<img src="/assets/img/index/package_manage.png" width="80%" />
</div>

除了官方的包仓库，用户也可以自己创建多个私有仓库，用来集成使用一些私有包，这对于公司内部项目的依赖维护还是很有帮助的。

我们只需要在xmake.lua加上自己的私有仓库地址就行了：

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git")
```

或者直接命令行添加：

```console
xmake repo --add my-repo git@github.com:myrepo/xmake-repo.git
```

关于这块的详细说明可以看下相关文档：

- [远程依赖模式](/zh/#%E8%BF%9C%E7%A8%8B%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%BC%8F)
- [add_requires接口说明](/zh/manual#add-requires)

最后，附带一张xmake的依赖包管理架构图：

<div align="center">
<img src="/assets/img/index/package_arch.png" width="80%" />
</div>


##### cmake

这块我没看到cmake有支持，不过cmake我用得并不多，如果有写的不对的地方，大家可以指正。