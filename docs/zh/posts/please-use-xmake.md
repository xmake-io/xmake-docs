---
title: C/C++ 构建系统，我用 xmake
tags: [xmake, lua, C/C++, Buildsystem]
date: 2021-05-03
author: Ruki
---

### XMake 是什么

[XMake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的 现代化 C/C++ 构建系统。

它的语法简洁易上手，对新手友好，即使完全不会 lua 也能够快速入门，并且完全无任何依赖，轻量，跨平台。

同时，它也是一个自满足的构建系统，拥有强大的包管理系统，快速的构建引擎。

相比 Ninja/Scons/Make 作为 Build backend，CMake/Meson 作为 Project Generator，那么 XMake 就是这两者外加一个包管理。

```
xmake = Build backend + Project Generator + Package Manager
```

因此，只需要安装一个不到 3M 的 XMake 安装包，你就可以不用再安装其他各种工具，甚至连 make 都不需要安装，也不需要安装 Python、Java 等重量级的运行时环境，就可以开始您的 C/C++ 开发之旅。

也许，有人会说，编译器总需要安装的吧。这也不是必须的，因为 XMake 的包管理也支持自动远程拉取需要的各种编译工具链，比如：llvm, Mingw, Android NDK 或者交叉编译工具链。

### 为什么要做 XMake

每当在 Reddit 社区跟别人讨论起 XMake，大家总是会拿下面这张图来吐槽。

![](https://imgs.xkcd.com/comics/standards.png)

尽管有些无奈，也被吐槽的有些麻木了，不过我还是想说明下，做 XMake 的初衷，并不是为了分裂 C/C++  生态，相反，XMake 尽可能地复用了现有生态。

同时也让用户在开发 C/C++ 项目的时候，拥有与其他语言一样的良好体验，比如：Rust/Cargo，Nodejs/Npm, Dlang/Dub，不再为到处找第三包，研究如何移植编译而折腾。

因此，如果您还不了解 XMake，请不要过早下定论，可以先尝试使用下，或者花点时间看完下文的详细介绍。

### XMake 的特性和优势

经常有人问我 XMake 有什么特别之处，相比现有 CMake、Meson 此类构建工具有什么优势，我为什么要使用 XMake 而不是 CMake？

先说特点和优势，XMake 有以下几点：

- 简洁易学的配置语法，非 DSL
- 强大的包管理，支持语义版本，工具链管理
- 足够轻量，无依赖
- 极速编译，构建速度和 Ninja 一样快
- 简单方便的多平台、工具链切换
- 完善的插件系统
- 灵活的构建规则








至于 CMake，毕竟已成事实上的标准，生态完善，功能强大。

我从没想过让 XMake 去替代它，也替代不了，完全不是一个量级的，但是 CMake 也有许多为人所诟病的短板，比如：语法复杂难懂，包管理支持不完善等等。

因此使用 XMake 可以作为一种补充，对于那些想要简单快速入门 C/C++ 开发的新手，或者想要更加方便易用的包管理，或者想临时快速写一些短小的测试项目。

XMake 都可以帮他们提升开发效率，让其更加关注 C/C++ 项目本身，而不是花更多的时间在构建工具和开发环境上。

下面，我来具体介绍 XMake 的这些主要特性。

### 语法简洁易上手

CMake 自己设计一门 DSL 语言用来做项目配置，这对用户来讲提高了学习成本，而且它的语法可读性不是很直观，很容易写出过于复杂的配置脚本，也提高了维护成本。

而 XMake 复用现有知名的 Lua 语言作为基础，并且其上提供了更加简单直接的配置语法。

Lua 本身就是一门简单轻量的胶水语言，关键字和内置类型就那么几种，看个一篇文章，就能基本入门了，并且相比 DSL，能够从网上更方便的获取到大量相关资料和教程。

#### 基础语法

不过，还是有人会吐槽：那不是还得学习 Lua 么？

其实也不用，XMake 采用了 `描述域` 和 `脚本域` 分离的方式，使得初学者用户在 80% 的情况下，只需要在描述域以更简单直接的方式来配置，完全可以不把它当成 Lua 脚本，例如：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_files("test/*.c", "example/**.cpp")
```

如果因为，看着有括号，还是像脚本语言的函数调用，那我们也可以这么写（是否带括号看个人喜好，不过我个人还是建议使用上面的方式）

```lua
target "test"
    set_kind "binary"
    add_files "src/*.c"
    add_files "test/*.c"
    add_files "example/**.cpp"
```

我们只需要知道常用配置接口，即使不完全不会 Lua 也能快速配置了。

我们可以对比下 CMake 的配置：

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

哪个更直观可读，一目了然。

#### 条件配置

如果，你已经初步了解了一些 Lua 等基础知识，比如 `if then` 等条件判断，那么可以进一步做一些条件配置。

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

继续对比下 CMake 版本配置：

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

#### 复杂脚本

如果你已经晋升为 XMake 的高端玩家，Lua 语法了然于胸，想要更加灵活的定制化配置需要，并且描述域的几行简单配置已经满足不了你的需求。

那么 XMake 也提供了更加完整的 Lua 脚本定制化能力，你可以写任何复杂的脚本。

比如在构建之前，对所有源文件进行一些预处理，在构建之后，执行外部 gradle 命令进行后期打包，甚至我们还可以重写内部链接规则，实现深度定制编译，我们可以通过[import](/zh/manual#import) 接口，导入内置的 linker 扩展模块，实现复杂灵活的链接过程。

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

如果换成 CMake，也可以 add_custom_command 里面实现，不过里面似乎只能简单的执行一些批处理命令，没法做各种复杂的逻辑判断，模块加载，自定义配置脚本等等。

当然，使用 cmake 肯定也能实现上面描述的功能，但绝对不会那么简单。

如果有熟悉 cmake 的人，也可以尝试帮忙完成下面的配置：

```cmake
add_executable(test "")
file(GLOB SRC_FILES "src/*.c")
add_custom_command(TARGET test PRE_BUILD
    -- TODO
    COMMAND echo hello
)
add_custom_command(TARGET test POST_BUILD
    COMMAND cd android/app
    COMMAND ./gradlew app:assembleDebug
)
-- How can we override link stage?
target_sources(test PRIVATE
    ${SRC_FILES}
)
```

### 强大的包管理

众所周知，做 C/C++ 相关项目开发，最头大的就是各种依赖包的集成，由于没有像 Rust/Cargo 那样完善的包管理系统。

因此，我们每次想使用一个第三方库，都需要各种找，研究各种平台的移植编译，还经常遇到各种编译问题，极大耽误了开发者时间，无法集中精力去投入到实际的项目开发中去。

好不容易当前平台搞定了，换到其他平台，有需要重新折腾一遍依赖包，为了解决这个问题，出现了一些第三方的包管理器，比如 vcpkg/conan/conda等等，但有些不支持语义版本，有些支持的平台有限，但不管怎样，总算是为解决 C/C++ 库的依赖管理迈进了很大一步。

但是，光有包管理器，C/C++ 项目中使用它们还是比较麻烦，因为还需要对应构建工具能够很好的对其进行集成支持才行。

#### CMake 和 Vcpkg

我们先来看下 CMake 和 Vcpkg 的集成支持：

```
cmake_minimum_required(VERSION 3.0)
project(test)
find_package(unofficial-sqlite3 CONFIG REQUIRED)
add_executable(main main.cpp)
target_link_libraries(main PRIVATE unofficial::sqlite3::sqlite3)
```

缺点：

- 还需要额外配置 `-DCMAKE_TOOLCHAIN_FILE=<vcpkg_dir>/scripts/buildsystems/vcpkg.cmake"`
- 不支持自动安装依赖包，还需要用户手动执行 `vcpkg install xxx` 命令安装
- vcpkg 的语义版本选择不支持 （据说新版本开始支持了）

#### CMake 和 Conan

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

缺点：

- 同样，还是需要额外调用 `conan install ..` 来安装包
- 还需要额外配置一个 conanfile.txt 文件去描述包依赖规则

#### Meson 和 Vcpkg

我没找到如何在 Meson 中去使用 vcpkg 包，仅仅找到一篇相关的 [Issue #3500](https://github.com/mesonbuild/meson/issues/3500) 讨论。

#### Meson 和 Conan

Meson 似乎还没有对 Conan 进行支持，但是 Conan 官方文档上有解决方案，对齐进行支持，但是很复杂，我是没看会，大家可以自行研究：[https://docs.conan.io/en/latest/reference/build_helpers/meson.html](https://docs.conan.io/en/latest/reference/build_helpers/meson.html)

#### XMake 和 Vcpkg

前面讲了这么多，其他构建工具和包管理的集成，个人感觉用起来很麻烦，而且不同的包管理器，集成方式差别很大，用户想要快速从 Vcpkg 切换到 Conan 包，改动量非常大。

接下来，我们来看看 XMake 中集成使用 Vcpkg 提供的包：

```lua
add_requires("vcpkg::zlib", {alias = "zlib"})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

我们只需要通过 `add_requires` 配置上对应的包名，以及 `vcpkg::` 包命名空间，就能直接集成使用 vcpkg 提供的 zlib 包。

然后，我们只需要执行 xmake 命令，既可完成整个编译过程，包括 zlib 包的自动安装，无需额外手动执行 `vcpkg install zlib`。

```bash
$ xmake
note: try installing these packages (pass -y to skip confirm)?
-> vcpkg::zlib
please input: y (y/n)

=> install vcpkg::zlib .. ok
[ 25%]: compiling.release src\main.cpp
[ 50%]: linking.release test
[100%]: build ok!
```

#### XMake 和 Conan

接下来是集成 Conan 的包，完全一样的方式，仅仅执行换个包管理器名字。

```lua
add_requires("conan::zlib", {alias = "zlib"})
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

XMake 同样会自动安装 conan 中的 zlib 包，然后自动集成编译。

#### XMake 自建包管理

XMake 跟 CMake 还有其他构建系统，最大的不同点，也就是最大的优势之一，就是它有完全自建的包管理系统，我们完全可以不依赖 vcpkg/conan，也可以快速集成依赖包，比如：

```lua
add_requires("zlib 1.2.x", "tbox >= 1.6.0")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "tbox")
```

而且，它还支持完整的语义版本选择，多平台的包集成，交叉编译工具链的包集成，甚至编译工具链包的自动拉取使用。

不仅如此，我们开可以对定制化配置对自建包的依赖，例如：

##### 使用调式版本依赖包

我们可以使用 debug 版本库，实现对依赖库的断点调试。

```lua
add_requires("zlib", {debug = true})
```

##### 设置 msvc 运行时库

```lua
add_requires("zlib", {configs = {vs_runtime = "MD"}})
```

##### 使用动态库

默认集成的是静态库，我们也可以切换到动态库。

```lua
add_requires("zlib", {configs = {shared = true}})
```

##### 语义版本支持

XMake 的自建包集成支持完整的版本语义规范。

```lua
add_requires("zlib 1.2.x")
add_requires("zlib >=1.2.10")
add_requires("zlib ~1.2.0")
```

##### 禁止使用系统库

默认情况下，如果版本匹配，XMake 会优先查找使用系统上用户已经安装的库，当然我们也可以强制禁止查找使用系统库，仅仅从自建包仓库中下载安装包。

```lua
add_requires("zlib", {system = true})
```

##### 可选依赖包

如果依赖包集成失败，XMake 会自动报错，中断编译，提示用户：`zlib not found`，但是我们也可以设置为可选包集成，这样的话，即使库最终没安装成功，也不影响项目的编译，仅仅只是跳过这个依赖。

```lua
add_requires("zlib", {optional = true})
```

##### 包的定制化配置

比如，集成使用开启了 context/coroutine 模块配置的 boost 库。

```lua
add_requires("boost", {configs = {context = true, coroutine = true}})
```

#### 支持的包管理仓库

XMake 除了支持 vcpkg/conan 还有自建仓库的包集成支持，还支持其他的包管理仓库，例如：Conda/Homebrew/Apt/Pacman/Clib/Dub 等等，而且集成方式完全一致。

用户可与快速切换使用其他的仓库包，而不需要花太多时间去研究如何集成它们。

因此，XMake 并没有破坏 C/C++ 生态，而是极大的复用现有 C/C++ 生态的基础上，努力改进用户对 C/C++ 依赖包的使用体验，提高开发效率，让用户能够拥有更多的时间去关注项目本身。

* 官方自建仓库 [xmake-repo](https://github.com/xmake-io/xmake-repo) (tbox >1.6.1)
* 官方包管理器 [Xrepo](https://github.com/xmake-io/xrepo)
* [用户自建仓库](/zh/guide/package-management/package-distribution)
* Conan (conan::openssl/1.1.1g)
* Conda (conda::libpng 1.3.67)
* Vcpkg (vcpkg:ffmpeg)
* Homebrew/Linuxbrew (brew::pcre2/libpcre2-8)
* Pacman on archlinux/msys2 (pacman::libcurl)
* Apt on ubuntu/debian (apt::zlib1g-dev)
* Clib (clib::clibs/bytes@0.0.4)
* Dub (dub::log 0.4.3)

#### 独立的包管理命令（Xrepo）

为了方便 XMake 的自建仓库中的包管理，以及第三方包的管理使用，我们也提供了独立的 Xrepo cli 命令工具，来方便的管理我们的依赖包

我们可以使用这个工具，快速方便的完成下面的管理操作：

- 安装包：`xrepo install zlib`
- 卸载包：`xrepo remove zlib`
- 获取包信息：`xrepo info zlib`
- 获取包编译链接 flags：`xrepo fetch zlib`
- 加载包虚拟 Shell 环境：`xrepo env shell` （这是一个很强大的特性）

我们可以到 [Xrepo 项目主页](https://github.com/xmake-io/xrepo) 查看更多的介绍和使用方式。

![](https://xrepo.xmake.io/assets/img/xrepo.gif)


### 轻量无依赖

使用 Meson/Scons 需要先安装 python/pip，使用 Bazel 需要先安装 java 等运行时环境，而 XMake 不需要额外安装任何依赖库和环境，自身安装包仅仅2-3M，非常的轻量。

尽管 XMake 是基于 lua，但是借助于 lua 胶水语言的轻量级特性，xmake 已将其完全内置，因此安装完 XMake 等同于拥有了一个完整的 lua vm。

有人会说，编译工具链总还是需要的吧，也不完全是，Windows 上，我们提供了预编译安装包，可以直接下载安装编译，地址见：[Releases](https://github.com/xmake-io/xmake/releases)

另外，XMake 还支持远程拉取编译工具链，因此即使你的系统环境，还没有安装任何编译器，也没关系，用户完全不用考虑如何折腾编译环境，只需要在 xmake.lua 里面配置上需要的工具链即可。

比如，我们在 Windows 上使用 mingw-w64 工具链来编译 C/C++ 工程，只需要做如下配置即可。

```lua
add_requires("mingw-w64")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("mingw@mingw-w64")
```

通过 `set_toolchains` 配置绑定 mingw-w64 工具链包后，XMake 就会自动检测当前系统是否存在 mingw-64，如果还没安装，它会自动下载安装，然后完成项目编译，整个过程，用户仅仅只需要执行 `xmake` 这个命令就能完成。

```bash
$ xmake
note: try installing these packages (pass -y to skip confirm)?
in xmake-repo:
-> mingw-w64 8.1.0 [vs_runtime:MT]
please input: y (y/n)

=> download https://jaist.dl.sourceforge.net/project/mingw-w64/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/8.1.0/threads-posix/seh/x86_64-8.1.0-release-posix-seh-rt_v6-rev0.7z .. ok
checking for mingw directory ... C:\Users\ruki\AppData\Local\.xmake\packages\m\mingw-w64\8.1.0\aad6257977e0449595004d7441358fc5
[ 25%]: compiling.release src\main.cpp
[ 50%]: linking.release test.exe
[100%]: build ok!
```

除了 mingw-w64，我们还可以配置远程拉取使用其他的工具链，甚至交叉编译工具链，例如：llvm-mingw, llvm, tinycc, muslcc, gnu-rm, zig 等等。

如果大家还想进一步了解远程工具链的拉取集成，可以看下文档：[自动拉取远程工具链](/zh/package/remote_package#%e8%87%aa%e5%8a%a8%e6%8b%89%e5%8f%96%e8%bf%9c%e7%a8%8b%e5%b7%a5%e5%85%b7%e9%93%be)。

### 极速并行编译

大家都知道 Ninja 构建非常快，因此很多人都喜欢用 CMake/Meson 生成 build.ninja  后，使用 Ninja 来满足极速构建的需求。

尽管 Ninja 很快，但是我们还是需要先通过 meson.build 和 CMakelist.txt 文件生成 build.ninja 才行，这个生成过程也会占用几秒甚至十几秒的时间。

而 XMake 不仅仅拥有和 Ninja 近乎相同的构建速度，而且不需要额外再生成其他构建文件，直接内置构建系统，任何情况下，只需要一个 `xmake` 命令就可以实现极速编译。

我们也做过一些对比测试数据，供大家参考：

#### 多任务并行编译测试

| 构建系统        | Termux (8core/-j12) | 构建系统         | MacOS (8core/-j12) |
|-----            | ----                | ---              | ---                |
|xmake            | 24.890s             | xmake            | 12.264s            |
|ninja            | 25.682s             | ninja            | 11.327s            |
|cmake(gen+make)  | 5.416s+28.473s      | cmake(gen+make)  | 1.203s+14.030s     |
|cmake(gen+ninja) | 4.458s+24.842s      | cmake(gen+ninja) | 0.988s+11.644s     |

#### 单任务编译测试

| 构建系统        | Termux (-j1)     | 构建系统         | MacOS (-j1)    |
|-----            | ----             | ---              | ---            |
|xmake            | 1m57.707s        | xmake            | 39.937s        |
|ninja            | 1m52.845s        | ninja            | 38.995s        |
|cmake(gen+make)  | 5.416s+2m10.539s | cmake(gen+make)  | 1.203s+41.737s |
|cmake(gen+ninja) | 4.458s+1m54.868s | cmake(gen+ninja) | 0.988s+38.022s |


### 傻瓜式多平台编译

XMake 的另外一个特点，就是高效简单的多平台编译，不管你是编译 windows/linux/macOS 下的程序，还是编译 iphoneos/android 又或者是交叉编译。

编译的配置方式大同小异，不必让用户去这折腾研究各个平台下如何去编译。

![](/assets/img/index/xmake-basic-render.gif)

#### 编译本机 Windows/Linux/MacOS  程序

当前本机程序编译，我们仅仅只需要执行：

```bash
$ xmake
```

对比 CMake

```bash
$ mkdir build
$ cd build
$ cmake --build ..
```

#### 编译 Android 程序

```bash
$ xmake f -p android --ndk=~/android-ndk-r21e
$ xmake
```

对比 CMake

```bash
$ mkdir build
$ cd build
$ cmake -DCMAKE_TOOLCHAIN_FILE=~/android-ndk-r21e/build/cmake/android.toolchain.cmake ..
$ make
```

#### 编译 iOS 程序

```bash
$ xmake f -p iphoneos
$ xmake
```

对比 CMake

```bash
$ mkdir build
$ cd build
$ wget https://raw.githubusercontent.com/leetal/ios-cmake/master/ios.toolchain.cmake
$ cmake -DCMAKE_TOOLCHAIN_FILE=`pwd`/ios.toolchain.cmake ..
$ make
```

我没有找到很方便的方式去配置编译 ios 程序，仅仅只能从其他地方找到一个第三方的 ios 工具链去配置编译。

#### 交叉编译

我们通常只需要设置交叉编译工具链根目录，XMake 会自动检测工具链结构，提取里面的编译器参与编译，不需要额外配置什么。

```bash
$ xmake f -p cross --sdk=~/aarch64-linux-musl-cross
$ xmake
```

对比 CMake

我们需要先额外写一个 cross-toolchain.cmake 的交叉工具链配置文件。

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

### 结语

如果你是 C/C++ 开发的新手，可以通过 XMake 快速上手入门 C/C++ 编译构建。

如果你想开发维护跨平台 C/C++ 项目，也可以考虑使用 XMake 来维护构建，提高开发效率，让你更加专注于项目本身，不再为折腾移植依赖库而烦恼。

欢迎关注 XMake 项目：

- [Github 项目地址](https://github.com/xmake-io/xmake/)
- [项目主页](https://xmake.io/#/)
- [XMake 包管理仓库](https://github.com/xmake-io/xmake-repo)
- 社区
  - [Telegram 群组](https://t.me/tbooxorg)
  - [Discord 聊天室](https://discord.gg/xmake)
  - QQ 群：343118190, 662147501
  - 微信公众号：tboox-os
 - 课程：[Xmake 带你轻松构建 C/C++ 项目](/zh/about/course)
 - 活动：[开源之夏 & Xmake](https://tboox.org/cn/2021/04/29/xmake-summer-ospp/)

