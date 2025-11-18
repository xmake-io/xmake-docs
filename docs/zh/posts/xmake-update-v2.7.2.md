---
title: Xmake v2.7.2 发布，更加智能化构建第三方库
tags: [xmake, lua, C/C++, trybuild, rule, cmake, autoconf]
date: 2022-10-09
author: Ruki
outline: deep
---

## 新特性介绍

### 更加智能化构建第三方库

在先前的版本中，Xmake 提供了一种 TryBuild 模式，可以在没有 xmake.lua 的情况下，使用 Xmake 尝试对 autoconf/cmake/meson 等维护的第三方项目进行直接构建。

其实，也就是让 Xmake 检测到对应的构建系统后，调用 cmake 等命令来实现，但是会帮助用户简化配置操作，另外还能对接 xmake 的交叉编译工具链配置。

但是，这种模式有一定的失败率，比如以下一些情况，都会可能导致构建失败：

1. 项目代码自身存在缺陷，导致编译错误
2. 项目代码不支持当前平台
3. 构建脚本存在缺陷
4. 缺少特定的配置参数
5. 缺少依赖库，需要用户手动安装
6. 编译器版本太低，不支持部分代码

而 TryBuild 模式通常处理这些情况，但是在新版本中，我们对 TryBuild 模式引入了一种新的机制，通过复用 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库中的构建脚本，来改进构建逻辑。

它大概得处理流程是这样子的：

1. 在第三方源码库目录执行 xmake 命令
2. Xmake 获取目录名，尝试解析项目名和版本
3. 尝试从 xmake-repo 仓库匹配现有的包
4. 如果匹配成功，直接采用包中构建逻辑来构建
5. 如果没匹配成功，回退到原来的 TryBuild 逻辑

这能带来什么好处呢，如果匹配成功，我们能够解决上面提到的各种问题。

即使当前项目源码不支持指定平台，或者源码和构建脚本存在一定的缺陷，Xmake 也能自动打入特定 patch 去修复它，并引入需要的依赖包，确保它肯定能够一键编译通过。

我们使用 libjpeg 库为例，来直观的感受下。

#### 首先是下载对应源码包

```bash
$ wget https://jaist.dl.sourceforge.net/project/libjpeg-turbo/2.1.4/libjpeg-turbo-2.1.4.tar.gz
$ tar -xvf libjpeg-turbo-2.1.4.tar.gz
$ cd libjpeg-turbo-2.1.4
```

#### 然后进入目录执行 Xmake 命令

Xmake 如果检测到是 libjpeg 库，就会提示用户，是否作为 libjpeg 2.1.4 来构建。

```bash
ruki-2:libjpeg-turbo-2.1.4 ruki$ xmake
note: libjpeg-turbo 2.1.4 in xmake-repo found, try building it or you can run `xmake f --trybuild=` to set buildsystem (pass -y or --confirm=y/n/d to skip confirm)?
please input: y (y/n)
```

我们按下回车键确认继续构建。







```bash
checking for cmake ... /usr/local/bin/cmake
/usr/local/bin/cmake -DCMAKE_BUILD_TYPE=Release -DENABLE_SHARED=OFF -DENABLE_STATIC=ON -DCMAKE_POSITION_INDEPENDENT_CODE=ON -DCMAKE_INSTALL_LIBDIR:PATH=lib -DCMAKE_INSTALL_PREFIX=/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2 -G "Unix Makefiles" -DCMAKE_POSITION_INDEPENDENT_CODE=ON /Users/ruki/Downloads/libjpeg-turbo-2.1.4
-- CMAKE_BUILD_TYPE = Release
-- VERSION = 2.1.4, BUILD = 20220923
-- 64-bit build (x86_64)
-- CMAKE_INSTALL_PREFIX = /Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2
-- CMAKE_INSTALL_BINDIR = bin (/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2/bin)
-- CMAKE_INSTALL_DATAROOTDIR = share (/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2/share)
-- CMAKE_INSTALL_DOCDIR = share/doc/libjpeg-turbo (/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2/share/doc/libjpeg-turbo)
-- CMAKE_INSTALL_INCLUDEDIR = include (/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2/include)
-- CMAKE_INSTALL_LIBDIR = lib (/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2/lib)
-- CMAKE_INSTALL_MANDIR = share/man (/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2/share/man)
-- Shared libraries disabled (ENABLE_SHARED = 0)
-- Static libraries enabled (ENABLE_STATIC = 1)
-- 12-bit JPEG support disabled (WITH_12BIT = 0)
-- Arithmetic decoding support enabled (WITH_ARITH_DEC = 1)
-- Arithmetic encoding support enabled (WITH_ARITH_ENC = 1)
-- TurboJPEG API library enabled (WITH_TURBOJPEG = 1)
-- TurboJPEG Java wrapper disabled (WITH_JAVA = 0)
-- In-memory source/destination managers enabled (WITH_MEM_SRCDST = 1)
-- Emulating libjpeg API/ABI v6.2 (WITH_JPEG7 = 0, WITH_JPEG8 = 0)
-- libjpeg API shared library version = 62.3.0
-- Compiler flags =  -O3 -DNDEBUG
-- Linker flags =
-- INLINE = __inline__ __attribute__((always_inline)) (FORCE_INLINE = 1)
-- THREAD_LOCAL = __thread
-- CMAKE_EXECUTABLE_SUFFIX =
-- CMAKE_ASM_NASM_COMPILER = /usr/local/bin/nasm
-- CMAKE_ASM_NASM_OBJECT_FORMAT = macho64
-- CMAKE_ASM_NASM_FLAGS =  -DMACHO -D__x86_64__ -DPIC
-- SIMD extensions: x86_64 (WITH_SIMD = 1)
-- FLOATTEST = sse
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/ruki/Downloads/libjpeg-turbo-2.1.4/build_646b7957
make -j10
[  2%] Built target md5cmp
[ 19%] Built target wrjpgcom
[ 20%] Built target simd
[ 21%] Built target strtest
[ 22%] Built target rdjpgcom
[ 80%] Built target jpeg-static
[ 84%] Built target turbojpeg-static
[ 90%] Built target tjbench-static
[ 90%] Built target tjunittest-static
[ 91%] Built target jpegtran-static
[ 98%] Built target djpeg-static
[100%] Built target cjpeg-static
make install
[  1%] Built target strtest
[  3%] Built target wrjpgcom
[ 19%] Built target simd
[ 52%] Built target turbojpeg-static
[ 53%] Built target rdjpgcom
[ 82%] Built target jpeg-static
[ 85%] Built target jpegtran-static
[ 90%] Built target djpeg-static
[ 93%] Built target tjunittest-static
[ 97%] Built target cjpeg-static
[ 98%] Built target tjbench-static
[100%] Built target md5cmp
Install the project...
exporting libjpeg-turbo-2.1.4
  -> /Users/ruki/Downloads/libjpeg-turbo-2.1.4/build/artifacts/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2
output to /Users/ruki/Downloads/libjpeg-turbo-2.1.4/build/artifacts
build ok!
```

只要检测匹配成功，通常肯定能够完成编译，成功率接近 100%，最后 Xmake 会将编译产物输出到当前目录的 `build/artifacts` 下面。

#### 对接交叉编译工具链

这种智能构建模式，我们不仅能够编译本机程序，还可以对接交叉编译工具链，实现对 ios/android 以及任意交叉编译平台的支持。

例如，编译 Android 平台，我们只需要传递 `--trybuild=xrepo` 参数，然后切换到 android 平台即可，Xmake 会透传所有 ndk 工具链信息。

```bash
$ xmake f -p android --trybuild=xrepo --ndk=~/files/android-ndk-r20b -c
$ xmake
xmake f -c --require=n -v -p android -a armeabi-v7a -m release -k static --ndk=/Users/ruki/files/android-ndk-r20b
checking for Android SDK directory ... ~/Library/Android/sdk
checking for Build Tools Version of Android SDK ... 33.0.0
checking for NDK directory ... /Users/ruki/files/android-ndk-r20b
checking for SDK version of NDK ... 21
checking for clang++ ... /Users/ruki/files/android-ndk-r20b/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang++
checking for the shared library linker (sh) ... clang++
checking for clang++ ... /Users/ruki/files/android-ndk-r20b/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang++
checking for the linker (ld) ... clang++
...
exporting libjpeg-turbo-2.1.4
  -> /Users/ruki/Downloads/libjpeg-turbo-2.1.4/build/artifacts/l/libjpeg-turbo/2.1.4/79c2e21f436b4ab08a3c23a6cbae8c0e
output to /Users/ruki/Downloads/libjpeg-turbo-2.1.4/build/artifacts
build ok!
```

#### 回退到直接编译

如果我们不想使用 xmake-repo 的构建脚本，我们也能回退到 cmake/autoconf 直接去尝试构建它们。

但是这样可能会存在一定的失败率，并且有可能会额外编译一些不需要的二进制目标。而 xmake-repo 里面的构建脚本是最优化的，精简了很多没必要的构建参数，比如禁用 tests/examples 构建等等。

我们只需要先敲 n 取消基于包脚本的智能构建模式，Xmake 会有新的提示，让用户选择是否继续采用 cmake/autoconf 来尝试构建。

```bash
$ xmake
note: libjpeg-turbo 2.1.4 in xmake-repo found, try building it or you can run `xmake f --trybuild=` to set buildsystem (pass -y or --confirm=y/n/d to skip confirm)?
please input: y (y/n)
n
note: CMakeLists.txt found, try building it or you can run `xmake f --trybuild=` to set buildsystem (pass -y or --confirm=y/n/d to skip confirm)?
please input: y (y/n)
```

### 支持 Windows Arm64

新版本我们还对 Windows 的构建支持做了改进，新增了 Windows Arm64 平台支持，只需要切换到 arm64 架构即可。

```bash
$ xmake f -a arm64
$ xmake
```

### 改进规则支持依赖顺序执行

关联依赖可以绑定一批规则，也就是不必对 target 挨个去使用 `add_rules()` 添加规则，只需要应用一个规则，就能生效它和它的所有依赖规则。

例如：

```lua
rule("foo")
    add_deps("bar")

rule("bar")
   ...
```

我们只需要 `add_rules("foo")`，就能同时应用 foo 和 bar 两个规则。

但是，默认情况下，依赖之间是不存在执行的先后顺序的，foo 和 bar 的 `on_build_file` 等脚本是并行执行的，顺序未定义。

如果要严格控制执行顺序，在新版本中，我们可以配置 `add_deps("bar", {order = true})`，告诉 xmake，我们需要根据依赖顺序来执行同级别的脚本。

例如：

```lua
rule("foo")
    add_deps("bar", {order = true})
    on_build_file(function (target, sourcefile)
    end)

rule("bar")
    on_build_file(function (target, sourcefile)
    end)
```

bar 的 `on_build_file` 将会被先执行。

### 更好的动态配置目标和规则

上面这种控制规则依赖的方式，只适合 foo 和 bar 两个规则都是自定义规则，如果想要将自己的规则插入到 xmake 的内置规则之前执行，这就不适用了。

这个时候，我们需要使用更加灵活的动态规则创建和注入的方式，去修改内置规则。

例如，我们想在内置的 `c++.build` 规则之前，执行自定义 cppfront 规则的 `on_build_file` 脚本，我们可以通过下面的方式来实现。

```lua
rule("cppfront")
    set_extensions(".cpp2")
    on_load(function (target)
        local rule = target:rule("c++.build"):clone()
        rule:add("deps", "cppfront", {order = true})
        target:rule_add(rule)
    end)
    on_build_file(function (target, sourcefile, opt)
        print("build cppfront file")
    end)

target("test")
    set_kind("binary")
    add_rules("cppfront")
    add_files("src/*.cpp")
    add_files("src/*.cpp2")
```

### 支持从包中引入自定义规则

现在，我们还可以在包管理仓库中，添加自定义构架规则脚本，实现跟随包进行动态下发和安装。

我们需要将自定义规则放到仓库的 `packages/x/xxx/rules` 目录中，它会跟随包一起被安装。

当然，它也存在一些限制：

- 在包中规则，我们不能添加 `on_load`, `after_load` 脚本，但是通常我们可以使用 `on_config` 来代替。

#### 添加包规则

我们需要将规则脚本添加到 rules 固定目录下，例如：packages/z/zlib/rules/foo.lua

```lua
rule("foo")
    on_config(function (target)
        print("foo: on_config %s", target:name())
    end)
```

#### 应用包规则

使用规则的方式跟之前类似，唯一的区别就是，我们需要通过 `@packagename/` 前缀去指定访问哪个包里面的规则。

具体格式：`add_rules("@packagename/rulename")`，例如：`add_rules("@zlib/foo")`。

```lua
add_requires("zlib", {system = false})
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("zlib")
    add_rules("@zlib/foo")
```

#### 通过包别名引用规则

如果存在一个包的别名，xmake 将优先考虑包的别名来获得规则。

```lua
add_requires("zlib", {alias = "zlib2", system = false})
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("zlib2")
    add_rules("@zlib2/foo")
```

#### 添加包规则依赖

我们可以使用`add_deps("@bar")`来添加相对于当前包目录的其他规则。

然而，我们不能添加来自其他包的规则依赖，它们是完全隔离的，我们只能参考用户项目中由`add_requires`导入的其他包的规则。

packages/z/zlib/rules/foo.lua

```lua
rule("foo")
    add_deps("@bar")
    on_config(function (target)
        print("foo: on_config %s", target:name())
    end)
```

packages/z/zlib/rules/bar.lua

```lua
rule("bar")
    on_config(function (target)
        print("bar: on_config %s", target:name())
    end)
```

### 更加严格的包依赖兼容性支持

我们新增了两个包相关的策略，用于开启更加严格的包依赖兼容性控制。

这主要用于解决一些包每次版本更新，可能都会存在一些 abi 不兼容，或者破坏其他依赖它的包，而默认 Xmake 是不会去重新编译安装它们的，除非它们的版本和配置也被更新了。

这就可能存在一定概率编译兼容性被破坏，导致最终链接失败。

#### package.librarydeps.strict_compatibility

默认禁用，如果启用它，那么当前包和它的所有库依赖包之间会保持严格的兼容性，任何依赖包的版本更新，都会强制触发当前包的重新编译安装。

以确保所有的包都是二进制兼容的，不会因为某个依赖包接口改动，导致和其他已被安装的其他包一起链接时候，发生链接和运行错误。

```lua
package("foo")
    add_deps("bar", "zoo")
    set_policy("package.librarydeps.strict_compatibility", true)
```

例如，如果 bar 或者 zoo 的版本有更新，那么 foo 也会重新编译安装。

#### package.strict_compatibility

默认禁用，如果启用它，那么当前包和其他所有依赖它的包之间会保持严格的兼容性，这个包的版本更新，都会强制触发其他父包的重新编译安装。

以确保所有的包都是二进制兼容的，不会因为某个依赖包接口改动，导致和其他已被安装的其他包一起链接时候，发生链接和运行错误。

```lua
package("foo")
    set_policy("package.strict_compatibility", true)

package("bar")
    add_deps("foo")

package("zoo")
    add_deps("foo")
```

例如，如果 foo 的版本有更新，那么 bar 和 zoo 都会被强制重新编译安装。

#### package.install_always

每次运行 `xmake f -c` 重新配置的时候，总是会重新安装包，这对于本地第三方源码包集成时候比较有用。

因为，用户可能随时需要修改第三方源码，然后重新编译集成它们。

之前只能通过每次修改包版本号，来触发重新编译，但是有了这个策略，就能每次都会触发重编。

```lua
add_rules("mode.debug", "mode.release")

package("foo")
    add_deps("cmake")
    set_sourcedir(path.join(os.scriptdir(), "foo"))
    set_policy("package.install_always", true)
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


### 新增 clang-cl 工具链

尽管之前的版本，我们也支持切换到 clang-cl 编译器，但是切换比较繁琐，得挨个设置。

```bash
$ xmake f --cxx=clang-cl --cc=clang-cl -c
$ xmake
```

而且还得将 clang-cl.exe 所在目录加入 %PATH% 才行。

既然现在 vs 都自带了 clang-cl 工具链，那么 Xmake 完全可以自动检测到并使用它。

因此，在新版本中，我们新增了 clang-cl 工具链，仅仅只需要 `xmake f --toolchain=clang-cl` 就可以快速切换到 clang-cl 工具链，而无需任何 PATH 设置。

## 更新内容

### 新特性

* [#2140](https://github.com/xmake-io/xmake/issues/2140): 支持 Windows Arm64
* [#2719](https://github.com/xmake-io/xmake/issues/2719): 添加 `package.librarydeps.strict_compatibility` 策略严格限制包依赖兼容性
* [#2810](https://github.com/xmake-io/xmake/pull/2810): 支持 os.execv 去执行 shell 脚本文件
* [#2817](https://github.com/xmake-io/xmake/pull/2817): 改进规则支持依赖顺序执行
* [#2824](https://github.com/xmake-io/xmake/pull/2824): 传递 cross-file 交叉编译环境给 meson.install 和 trybuild
* [#2856](https://github.com/xmake-io/xmake/pull/2856): xrepo 支持从当前指定源码目录调试程序
* [#2859](https://github.com/xmake-io/xmake/issues/2859): 改进对三方库的 trybuild 构建，利用 xmake-repo 仓库脚本更加智能化地构建三方库
* [#2879](https://github.com/xmake-io/xmake/issues/2879): 更好的动态创建和配置 target 和 rule
* [#2374](https://github.com/xmake-io/xmake/issues/2374): 允许 xmake 包中引入自定义规则
* 添加 clang-cl 工具链

### 改进

* [#2745](https://github.com/xmake-io/xmake/pull/2745): 改进 os.cp 支持符号链接复制
* [#2773](https://github.com/xmake-io/xmake/pull/2773): 改进 vcpkg 包安装，支持 freebsd 平台
* [#2778](https://github.com/xmake-io/xmake/pull/2778): 改进 xrepo.env 支持 target 的运行环境加载
* [#2783](https://github.com/xmake-io/xmake/issues/2783): 添加摘要算法选项到 WDK 的 signtool 签名工具
* [#2787](https://github.com/xmake-io/xmake/pull/2787): 改进 json 支持空数组
* [#2782](https://github.com/xmake-io/xmake/pull/2782): 改进查找 matlib sdk 和运行时
* [#2793](https://github.com/xmake-io/xmake/issues/2793): 改进 mconfdialog 配置操作体验
* [#2804](https://github.com/xmake-io/xmake/issues/2804): 安装依赖包支持 macOS arm64/x86_64 交叉编译
* [#2809](https://github.com/xmake-io/xmake/issues/2809): 改进 msvc 的编译优化选项
* 改进 trybuild 模式，为 meson/autoconf/cmake 提供更好的交叉编译支持
* [#2846](https://github.com/xmake-io/xmake/discussions/2846): 改进对 configfiles 的生成
* [#2866](https://github.com/xmake-io/xmake/issues/2866): 更好地控制 rule 规则执行顺序

### Bugs 修复

* [#2740](https://github.com/xmake-io/xmake/issues/2740): 修复 msvc 构建 C++ modules 卡死问题
* [#2875](https://github.com/xmake-io/xmake/issues/2875): 修复构建 linux 驱动错误
* [#2885](https://github.com/xmake-io/xmake/issues/2885): 修复 ccache 下，msvc 编译 pch 失败问题
