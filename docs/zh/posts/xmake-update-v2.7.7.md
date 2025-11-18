---
title: Xmake v2.7.7 发布，支持 Haiku 平台，改进 API 检测和 C++ Modules 支持
tags: [xmake, lua, C/C++, package, modules, haiku, c++modules]
date: 2023-02-23
author: Ruki
outline: deep
---

## 新特性介绍

### 支持 Haiku 系统

Xmake 现在已经完全可以在 [Haiku 系统](https://www.haiku-os.org/) 上运行，并且我们对 Xmake 新增了一个 haiku 编译平台，用于在 Haiku 系统上进行代码编译。

效果如下:

<img src="https://tboox.org/static/img/xmake/haiku.jpeg" width="650px" />




### 改进 C++20 Modules 支持

最新构建的 clang-17 对 C++20 Modules 做了不少改进，因此我们在 Xmake 中也针对性地对其进行了更好的适配，并且修复了一些 std modules 相关的问题。

关于 C++ Modules 的完整工程例子，可以看下 [C++ Modules Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules)。

现在也有一些实际的 C++ Modules 项目已经使用了 Xmake 来构建，例如：

- [async_simple](https://github.com/alibaba/async_simple)
- [StormKit](https://github.com/TapzCrew/StormKit)

### 改进 API 检测

先前的版本，对 xmake.lua 的配置 API 的传参有效性检测比较弱，仅仅针对 `add_includedirs`, `add_files` 等几个少数的 API 做了检测。

而新版中，我们新增了一个 `xmake check` 专门用于检测 API 和代码的插件，可以更好地对用户的配置进行检测，避免用户由于不熟悉 Xmake 导致各种配置值设置不对的问题。

另外，除了手动运行 `xmake check` 命令来触发检测，Xmake 在编译中，编译失败等各个阶段，
也会及时地自动触发一些常规 API 和配置的检测，毕竟不是所有用户都知道 `xmake check` 这个命令的存在。

#### 默认检测所有 API

```lua
set_lanuages("c91") -- typo
```

```console
$ xmake check
./xmake.lua:15: warning: unknown language value 'c91', it may be 'c90'
0 notes, 1 warnings, 0 errors
```

默认也可以指定检测特定组：

```console
$ xmake check api
$ xmake check api.target
```

#### 显示详细输出

这会额外提供 note 级别的检测信息。

```console
$ xmake check -v
./xmake.lua:15: warning: unknown language value 'cxx91', it may be 'cxx98'
./src/tbox/xmake.lua:43: note: unknown package value 'mbedtls'
./src/tbox/xmake.lua:43: note: unknown package value 'polarssl'
./src/tbox/xmake.lua:43: note: unknown package value 'openssl'
./src/tbox/xmake.lua:43: note: unknown package value 'pcre2'
./src/tbox/xmake.lua:43: note: unknown package value 'pcre'
./src/tbox/xmake.lua:43: note: unknown package value 'zlib'
./src/tbox/xmake.lua:43: note: unknown package value 'mysql'
./src/tbox/xmake.lua:43: note: unknown package value 'sqlite3'
8 notes, 1 warnings, 0 errors
```

#### 检测指定的 API

```console
$ xmake check api.target.languages
./xmake.lua:15: warning: unknown language value 'cxx91', it may be 'cxx98'
0 notes, 1 warnings, 0 errors
```

#### 检测编译 flags

```console
$ xmake check
./xmake.lua:10: warning: clang: unknown c compiler flag '-Ox'
0 notes, 1 warnings, 0 errors
```

#### 检测 includedirs

除了 includedirs，还有 linkdirs 等路径都会去检测。


```console
$ xmake check
./xmake.lua:11: warning: includedir 'xxx' not found
0 notes, 1 warnings, 0 errors
```


### 支持检测工程代码（clang-tidy）

#### 显示 clang-tidy 检测列表

```console
$ xmake check clang.tidy --list
Enabled checks:
    clang-analyzer-apiModeling.StdCLibraryFunctions
    clang-analyzer-apiModeling.TrustNonnull
    clang-analyzer-apiModeling.google.GTest
    clang-analyzer-apiModeling.llvm.CastValue
    clang-analyzer-apiModeling.llvm.ReturnValue
    ...
```

#### 检测所有 targets 中的源码

```console
$ xmake check clang.tidy
1 error generated.
Error while processing /private/tmp/test2/src/main.cpp.
/tmp/test2/src/main.cpp:1:10: error: 'iostr' file not found [clang-diagnostic-error]
#include <iostr>
         ^~~~~~~
Found compiler error(s).
error: execv(/usr/local/opt/llvm/bin/clang-tidy -p compile_commands.json /private/tmp/test2/src
/main.cpp) failed(1)
```

#### 指定检测类型

我们可以在 `--check=` 中指定需要检测的类型，具体用法可以参考 `clang-tidy` 的 `--check=` 参数，完全一致的。

```console
$ xmake check clang.tidy --checks="*"
6 warnings and 1 error generated.
Error while processing /private/tmp/test2/src/main.cpp.
/tmp/test2/src/main.cpp:1:10: error: 'iostr' file not found [clang-diagnostic-error]
#include <iostr>
         ^~~~~~~
/tmp/test2/src/main.cpp:3:1: warning: do not use namespace using-directives; use using-declarat
ions instead [google-build-using-namespace]
using namespace std;
^
/tmp/test2/src/main.cpp:3:17: warning: declaration must be declared within the '__llvm_libc' na
mespace [llvmlibc-implementation-in-namespace]
using namespace std;
                ^
/tmp/test2/src/main.cpp:5:5: warning: declaration must be declared within the '__llvm_libc' nam
espace [llvmlibc-implementation-in-namespace]
int main(int argc, char **argv) {
    ^
/tmp/test2/src/main.cpp:5:5: warning: use a trailing return type for this function [modernize-u
se-trailing-return-type]
int main(int argc, char **argv) {
~~~ ^
auto                            -> int
/tmp/test2/src/main.cpp:5:14: warning: parameter 'argc' is unused [misc-unused-parameters]
int main(int argc, char **argv) {
             ^~~~
              /*argc*/
/tmp/test2/src/main.cpp:5:27: warning: parameter 'argv' is unused [misc-unused-parameters]
int main(int argc, char **argv) {
                          ^~~~
                           /*argv*/
Found compiler error(s).
error: execv(/usr/local/opt/llvm/bin/clang-tidy --checks=* -p compile_commands.json /private/tm
p/test2/src/main.cpp) failed(1)
```

#### 检测指定 target 的代码

```console
$ xmake check clang.tidy [targetname]
```

#### 检测给定的源文件列表

```console
$ xmake check clang.tidy -f src/main.c
$ xmake check clang.tidy -f 'src/*.c:src/**.cpp'
```

#### 设置 .clang-tidy 配置文件

```console
$ xmake check clang.tidy --configfile=/tmp/.clang-tidy
```

#### 创建 .clang-tidy 配置文件

```console
$ xmake check clang.tidy --checks="*" --create
$ cat .clang-tidy
---
Checks:          'clang-diagnostic-*,clang-analyzer-*,*'
WarningsAsErrors: ''
HeaderFilterRegex: ''
AnalyzeTemporaryDtors: false
FormatStyle:     none
User:            ruki
CheckOptions:
  - key:             readability-suspicious-call-argument.PrefixSimilarAbove
    value:           '30'
  - key:             cppcoreguidelines-no-malloc.Reallocations
    value:           '::realloc'

```

### 改进 target 配置来源分析

我们改进了 `xmake show -t target` 命令对 target 信息的展示，新增了配置来源分析，并且精简了一些相对冗余的信息。

我们可以用它更好地排查定位自己配置的一些 flags 实际来自那一行配置。

显示效果如下：

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

### 改进包的下载配置

如果有些包的 url 下载，需要设置特定 http headers 去鉴权后，才能通过下载，可以通过这个策略来指定。

这通常用于一些公司内部的私有仓库包的维护。

```lua
package("xxx")
    set_policy("package.download.http_headers", "TEST1: foo", "TEST2: bar")
```

我们也可以设置指定的 urls 的 http headers：

```lua
package("zlib")
    add_urls("https://github.com/madler/zlib/archive/$(version).tar.gz", {
        http_headers = {"TEST1: foo", "TEST2: bar"}
    })
```

### 改进 dlang 工具链支持

先前的版本，Xmake 仅仅提供了 dlang 这一个工具链，内部会自动取查找 dmd, ldc2, gdc 来适配选择能够获取到的 dlang 编译器去编译项目。

但是这种方式，对用户而言，无法更加灵活地去选择指定的编译器，如果同时安装了 dmd, ldc2，那么 Xmake 总是会优先使用 dmd 作为 dlang 的编译器。

因此，新版本中，xmake 额外提供了三个独立的工具链可以单独选择需要的 dlang 编译器。

比如，运行下面的命令，就可以快速切换到 ldc2 编译器去编译项目。

```bash
$ xmake f --toolchain=ldc
$ xmake
```

除了 ldc 工具链，还有 dmd, gdc 这两个工具链可以单独选择使用。

并且，我们还改进了 dmd/ldc2 的编译优化选项配置，使得生产的 dlang 二进制程序更加的小而快。

### 支持外置构建目录配置

#### 现有的内置构建目录模式

Xmake 目前提供的构建目录模式，属于内置构建目录，也就是如果我们在当前工程根目录下运行 xmake 命令，就会自动生成 build 目录，并且 .xmake 用于存放一些配置缓存。

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

当然，我们可以通过 `xmake f -o ../build` 去配置修改构建目录，但是 .xmake 目录还是在工程源码目录下。

```bash
$ cd projectdir
$ xmake f -o ../build
```

这对于一些喜欢完全代码目录保持完整干净的用户而言，可能并不喜欢这种方式。

#### 新的外置构建目录模式

因此，新版本中，Xmake 提供了另外一种构建目录配置方式，也就是外置目录构建（类似 CMake）。

比如，我们想使用下面这种目录结构去构建项目，总是保持源码目录干净。

```
- workdir
  - build (generated)
  - .xmake (generated)
- projectdir
  - src
  - xmake.lua
```

我们只需要进入需要存储 build/.xmake 目录的工作目录下，然后使用 `xmake f -P [projectdir]` 配置命令去指定源码根目录即可。

```bash
$ cd workdir
$ xmake f -P ../projectdir
$ xmake
```

配置完成后，源码根目录就被完全记住了，后面的任何构建命令，都不需要再去设置它，就跟之前一样使用就行。

比如，构建，重建，运行或者安装等命令，跟之前的使用完全一致，用户感觉不到任何差异。

```bash
$ xmake
$ xmake run
$ xmake --rebuild
$ xmake clean
$ xmake install
```

我们同样可以使用 `-o/--buildir` 参数去单独设置构建目录到其他地方，例如设置成下面这个结构。

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
$ xmake f -P ../projectdir -o ../build
```

## 更新内容

### 新特性

* 添加 Haiku 支持
* [#3326](https://github.com/xmake-io/xmake/issues/3326): 添加 `xmake check` 去检测工程代码 (clang-tidy) 和 API 参数配置
* [#3332](https://github.com/xmake-io/xmake/pull/3332): 在包中配置添加自定义 http headers

### 改进

* [#3318](https://github.com/xmake-io/xmake/pull/3318): 改进 dlang 工具链
* [#2591](https://github.com/xmake-io/xmake/issues/2591): 改进 target 配置来源分析
* 为 dmd/ldc2 改进 strip/optimization
* [#3342](https://github.com/xmake-io/xmake/issues/3342): 改进配置构建目录，支持外置目录构建，保持源码目录更加干净
* [#3373](https://github.com/xmake-io/xmake/issues/3373): 为 clang-17 改进 std 模块支持

### Bugs 修复

* [#3317](https://github.com/xmake-io/xmake/pull/3317): 针对 Qt 工程，修复 lanuages 设置
* [#3321](https://github.com/xmake-io/xmake/issues/3321): 修复隔天 configfiles 重新生成导致重编问题
* [#3296](https://github.com/xmake-io/xmake/issues/3296): 修复 macOS arm64 上构建失败
