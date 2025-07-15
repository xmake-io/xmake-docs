---
title: xmake v2.5.9 发布，改进 C++20 模块，并支持 Nim, Keil MDK 和 Unity Build
tags: [xmake, lua, C/C++, Nim, Keil, MDK, circle, Unity, Build, C++20, Modules, lua5.4]
date: 2021-10-30
author: Ruki
---

## 新特性介绍

### Nimlang 项目构建

最近，我们新增了对 Nimlang 项目的构建支持，相关 issues 见：[#1756](https://github.com/xmake-io/xmake/issues/1756)

#### 创建空工程

我们可以使用 `xmake create` 命令创建空工程。

```console
xmake create -l nim -t console test
xmake create -l nim -t static test
xmake create -l nim -t shared test
```

#### 控制台程序

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
```

```console
$ xmake -v
[ 33%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache -o:b
uild/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```






#### 静态库程序

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("static")
    add_files("src/foo.nim")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.nim")
```

```console
$ xmake -v
[ 33%]: linking.release libfoo.a
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/foo/macosx/x86_64/release/nimcache --app
:staticlib --noMain --passC:-DNimMain=NimMain_B6D5BD02 --passC:-DNimMainInner=NimMainInner_B6D5B
D02 --passC:-DNimMainModule=NimMainModule_B6D5BD02 --passC:-DPreMain=PreMain_B6D5BD02 --passC:-D
PreMainInner=PreMainInner_B6D5BD02 -o:build/macosx/x86_64/release/libfoo.a src/foo.nim
[ 66%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache --pa
ssL:-Lbuild/macosx/x86_64/release --passL:-lfoo -o:build/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

#### 动态库程序

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("shared")
    add_files("src/foo.nim")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.nim")
```

```console
$ xmake -rv
[ 33%]: linking.release libfoo.dylib
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/foo/macosx/x86_64/release/nimcache --app
:lib --noMain -o:build/macosx/x86_64/release/libfoo.dylib src/foo.nim
[ 66%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache --pa
ssL:-Lbuild/macosx/x86_64/release --passL:-lfoo -o:build/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

#### C 代码混合编译

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("static")
    add_files("src/*.c")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.nim")
```

#### Nimble 依赖包集成

完整例子见：[Nimble Package Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/nim/nimble_package)

```lua
add_rules("mode.debug", "mode.release")

add_requires("nimble::zip >0.3")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
    add_packages("nimble::zip")
```

main.nim

```nim
import zip/zlib

echo zlibVersion()
```

#### Native 依赖包集成

完整例子见：[Native Package Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/nim/native_package)

```lua
add_rules("mode.debug", "mode.release")

add_requires("zlib")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
    add_packages("zlib")
```

main.nim

```nim
proc zlibVersion(): cstring {.cdecl, importc}

echo zlibVersion()
```

### Unity Build 加速

我们知道，C++ 代码编译速度通常很慢，因为每个代码文件都需要解析引入的头文件。

而通过 Unity Build，我们通过将多个 cpp 文件组合成一个来加速项目的编译，其主要好处是减少了解析和编译包含在多个源文件中的头文件内容的重复工作，头文件的内容通常占预处理后源文件中的大部分代码。

Unity 构建还通过减少编译链创建和处理的目标文件的数量来减轻由于拥有大量小源文件而导致的开销，并允许跨形成统一构建任务的文件进行过程间分析和优化（类似于效果链接时优化）。

它可以极大提升 C/C++ 代码的编译速度，通常会有 30% 的速度提升，不过根据项目的复杂程度不同，其带来的效益还是要根据自身项目情况而定。

xmake 在 v2.5.9 版本中，也已经支持了这种构建模式。相关 issues 见 [#1019](https://github.com/xmake-io/xmake/issues/1019)。

#### 如何启用？

我们提供了两个内置规则，分别处理对 C 和 C++ 代码的 Unity Build。

```lua
add_rules("c.unity_build")
add_rules("c++.unity_build")
```

#### Batch 模式

默认情况下，只要设置上述规则，就会启用 Batch 模式的 Unity Build，也就是 xmake 自动根据项目代码文件，自动组织合并。

```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2})
    add_files("src/*.c", "src/*.cpp")
```

我们可以额外通过设置 `{batchsize = 2}` 参数到规则，来指定每个合并 Batch 的大小数量，这里也就是每两个 C++ 文件自动合并编译。

编译效果大概如下：

```console
$ xmake -r
[ 11%]: ccache compiling.release build/.gens/test/unity_build/unity_642A245F.cpp
[ 11%]: ccache compiling.release build/.gens/test/unity_build/unity_bar.cpp
[ 11%]: ccache compiling.release build/.gens/test/unity_build/unity_73161A20.cpp
[ 11%]: ccache compiling.release build/.gens/test/unity_build/unity_F905F036.cpp
[ 11%]: ccache compiling.release build/.gens/test/unity_build/unity_foo.cpp
[ 11%]: ccache compiling.release build/.gens/test/unity_build/main.c
[ 77%]: linking.release test
[100%]: build ok
```

由于我们仅仅启用了 C++ 的 Unity Build，所以 C 代码还是正常挨个编译。另外在 Unity Build 模式下，我们还是可以做到尽可能的并行编译加速，互不冲突。

如果没有设置 `batchsize` 参数，那么默认会吧所有文件合并到一个文件中进行编译。

#### Group 模式

如果上面的 Batch 模式自动合并效果不理想，我们也可以使用自定义分组，来手动配置哪些文件合并到一起参与编译，这使得用户更加地灵活可控。

```lua
target("test")
    set_kind("binary")
    add_rules("c++.unity_build", {batchsize = 0}) -- disable batch mode
    add_files("src/*.c", "src/*.cpp")
    add_files("src/foo/*.c", {unity_group = "foo"})
    add_files("src/bar/*.c", {unity_group = "bar"})
```

我们使用 `{unity_group = "foo"}` 来指定每个分组的名字，以及包含了哪些文件，每个分组的文件都会单独被合并到一个代码文件中去。

另外，`batchsize = 0` 也强行禁用了 Batch 模式，也就是说，没有设置 unity_group 分组的代码文件，我们还是会单独编译它们，也不会自动开启自动合并。

#### Batch 和 Group 混合模式

我们只要把上面的 `batchsize = 0` 改成非 0 值，就可以让分组模式下，剩余的代码文件继续开启 Batch 模式自动合并编译。

```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2})
    add_files("src/*.c", "src/*.cpp")
    add_files("src/foo/*.c", {unity_group = "foo"})
    add_files("src/bar/*.c", {unity_group = "bar"})
```

#### 忽略指定文件

如果是 Batch 模式下，由于是自动合并操作，所以默认会对所有文件执行合并，但如果有些代码文件我们不想让它参与合并，那么我们也可以通过 `{unity_ignored = true}` 去忽略它们。

```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2})
    add_files("src/*.c", "src/*.cpp")
    add_files("src/test/*.c", {unity_ignored = true}) -- ignore these files
```

#### Unique ID

尽管 Unity Build 带啦的收益不错，但是我们还是会遇到一些意外的情况，比如我们的两个代码文件里面，全局命名空间下，都存在相同名字的全局变量和函数。

那么，合并编译就会带来编译冲突问题，编译器通常会报全局变量重定义错误。

为了解决这个问题，我们需要用户代码上做一些修改，然后配合构建工具来解决。

比如，我们的 foo.cpp 和 bar.cpp 都有全局变量 i。

foo.cpp

```c
namespace {
    int i = 42;
}

int foo()
{
    return i;
}
```

bar.cpp

```c
namespace {
    int i = 42;
}

int bar()
{
    return i;
}
```

那么，我们合并编译就会冲突，我们可以引入一个 Unique ID 来隔离全局的匿名空间。


foo.cpp

```c
namespace MY_UNITY_ID {
    int i = 42;
}

int foo()
{
    return MY_UNITY_ID::i;
}
```

bar.cpp

```c
namespace MY_UNITY_ID {
    int i = 42;
}

int bar()
{
    return MY_UNITY_ID::i;
}
```

接下来，我们还需要保证代码合并后， `MY_UNITY_ID` 在 foo 和 bar 中的定义完全不同，可以按文件名算一个唯一 ID 值出来，互不冲突，也就是实现下面的合并效果：

```c
#define MY_UNITY_ID <hash(foo.cpp)>
#include "foo.c"
#undef MY_UNITY_ID
#define MY_UNITY_ID <hash(bar.cpp)>
#include "bar.c"
#undef MY_UNITY_ID
```

这看上去似乎很麻烦，但是用户不需要关心这些，xmake 会在合并时候自动处理它们，用户只需要指定这个 Unique ID 的名字就行了，例如下面这样：


```lua
target("test")
    set_kind("binary")
    add_includedirs("src")
    add_rules("c++.unity_build", {batchsize = 2, uniqueid = "MY_UNITY_ID"})
    add_files("src/*.c", "src/*.cpp")
```

处理全局变量，还有全局的重名宏定义，函数什么的，都可以采用这种方式来避免冲突。

### C++20 Modules

xmake 采用 `.mpp` 作为默认的模块扩展名，但是也同时支持 `.ixx`, `.cppm`, `.mxx` 等扩展名。

早期，xmake 试验性支持过 C++ Modules TS，但是那个时候，gcc 还不能很好的支持，并且模块间的依赖也不支持。

最近，我们对 xmake 做了大量改进，已经完整支持 gcc-11/clang/msvc 的 C++20 Modules 构建支持，并且能够自动分析模块间的依赖关系，实现最大化并行编译。

同时，对新版本的 clang/msvc 也做了更好地处理。

```lua
set_languages("c++20")
target("test")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

更多例子见：[C++ Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules)

### Lua5.4 运行时支持

上个版本，我们增加了对 Lua5.3 运行时支持，而在这个版本中，我们进一步升级 Lua 运行时到 5.4，相比 5.3，运行性能和内存利用率上都有很大的提升。

不过，目前 xmake 的默认运行时还是 luajit，预计 2.6.1 版本（也就是下个版本），会正式切到 Lua5.4 作为默认的运行时。

尽管切换了 Lua 运行时，但是对于用户端，完全是无感知的，并且完全兼容现有工程配置，因为 xmake 原本就对暴露的 api 提供了一层封装，
对于 lua 版本之间存在兼容性问题的接口，例如 setfenv, ffi 等都隐藏在内部，原本就没有暴露给用户使用。

### Keil MDK 工具链支持

我们在这个版本中，还新增了 Keil/MDK 嵌入式编译工具链的支持，相关例子工程：[Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/mdk/hello)

xmake 会自动探测 Keil/MDK 安装的编译器，相关 issues [#1753](https://github.com/xmake-io/xmake/issues/1753)。

#### 使用 armcc 编译

```console
$ xmake f -p cross -a cortex-m3 --toolchain=armcc -c
$ xmake
```

#### 使用 armclang 编译

```console
$ xmake f -p cross -a cortex-m3 --toolchain=armclang -c
$ xmake
```

#### 控制台程序

```lua
target("hello")
    add_deps("foo")
    add_rules("mdk.console")
    add_files("src/*.c", "src/*.s")
    add_defines("__EVAL", "__MICROLIB")
    add_includedirs("src/lib/cmsis")
```

#### 静态库程序

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    add_rules("mdk.static")
    add_files("src/foo/*.c")
```

### Wasi 工具链支持

之前我们支持了 wasm 平台的 emcc 工具链来构建 wasm 程序，而这里，我们新加了另外一个启用了 WASI 的 Wasm 工具链来替换 emcc。

```console
$ xmake f -p wasm --toolchain=wasi
$ xmake
```

### Circle 工具链支持

我们还新增了 circle 编译器的支持，这是个新的 C++20 编译器，额外附带了一些有趣的编译期元编程特性，有兴趣的同学可以到官网查看：https://www.circle-lang.org/

```console
$ xmake f --toolchain=circle
$ xmake
```

### gcc-8/9/10/11 特定版本支持

如果用户额外安装了 gcc-11, gcc-10 等特定版本的 gcc 工具链，在本地的 gcc 程序命名可能是 `/usr/bin/gcc-11`。

一种办法是通过 `xmake f --cc=gcc-11 --cxx=gcc-11 --ld=g++-11` 挨个指定配置来切换，但非常繁琐。

所以，xmake 也提供了更加快捷的切换方式：

```console
$ xmake f --toolchain=gcc-11 -c
$ xmake
```

只需要指定 `gcc-11` 对应的版本名，就可以快速切换整个 gcc 工具链。

### C++17/20 编译器特性检测

xmake 提供了 check_features 辅助接口来检测编译器特性。

```lua
includes("check_features.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")
    configvar_check_features("HAS_CONSTEXPR", "cxx_constexpr")
    configvar_check_features("HAS_CONSEXPR_AND_STATIC_ASSERT", {"cxx_constexpr", "c_static_assert"}, {languages = "c++11"})
```

config.h.in

```c
${define HAS_CONSTEXPR}
${define HAS_CONSEXPR_AND_STATIC_ASSERT}
```

config.h

```c
/* #undef HAS_CONSTEXPR */
#define HAS_CONSEXPR_AND_STATIC_ASSERT 1
```

而在 2.5.9 版本中，我们新增了 c++17 特性检测：

| 特性名                               |
| ------------------------------------ |
| cxx_aggregate_bases                  |
| cxx_aligned_new                      |
| cxx_capture_star_this                |
| cxx_constexpr                        |
| cxx_deduction_guides                 |
| cxx_enumerator_attributes            |
| cxx_fold_expressions                 |
| cxx_guaranteed_copy_elision          |
| cxx_hex_float                        |
| cxx_if_constexpr                     |
| cxx_inheriting_constructors          |
| cxx_inline_variables                 |
| cxx_namespace_attributes             |
| cxx_noexcept_function_type           |
| cxx_nontype_template_args            |
| cxx_nontype_template_parameter_auto  |
| cxx_range_based_for                  |
| cxx_static_assert                    |
| cxx_structured_bindings              |
| cxx_template_template_args           |
| cxx_variadic_using                   |

还新增了 c++20 特性检测：

| 特性名                               |
| ------------------------------------ |
| cxx_aggregate_paren_init             |
| cxx_char8_t                          |
| cxx_concepts                         |
| cxx_conditional_explicit             |
| cxx_consteval                        |
| cxx_constexpr                        |
| cxx_constexpr_dynamic_alloc          |
| cxx_constexpr_in_decltype            |
| cxx_constinit                        |
| cxx_deduction_guides                 |
| cxx_designated_initializers          |
| cxx_generic_lambdas                  |
| cxx_impl_coroutine                   |
| cxx_impl_destroying_delete           |
| cxx_impl_three_way_comparison        |
| cxx_init_captures                    |
| cxx_modules                          |
| cxx_nontype_template_args            |
| cxx_using_enum                       |

### Xrepo 包虚拟环境管理

#### 进入虚拟环境

xmake 自带的 xrepo 包管理工具，现在已经可以很好的支持包虚拟机环境管理，类似 nixos 的 nixpkgs。

我们可以通过在当前目录下，添加 xmake.lua 文件，定制化一些包配置，然后进入特定的包虚拟环境。

```lua
add_requires("zlib 1.2.11")
add_requires("python 3.x", "luajit")
```

```console
$ xrepo env shell
> python --version
> luajit --version
```

我们也可以在 xmake.lua 配置加载对应的工具链环境，比如加载 vs 的编译环境。

```lua
set_toolchains("msvc")
```

#### 管理虚拟环境

我们可以使用下面的命令，把指定的虚拟环境配置全局注册到系统中，方便快速切换。

```console
$ xrepo env --add /tmp/base.lua
```

这个时候，我们就保存了一个名叫 base 的全局虚拟环境，我们可以通过 list 命令去查看它。

```console
$ xrepo env --list
/Users/ruki/.xmake/envs:
  - base
envs(1) found!
```

我们也可以删除它。

```console
$ xrepo env --remove base
```

#### 切换全局虚拟环境

如果我们注册了多个虚拟环境，我们也可以快速切换它们。

```console
$ xrepo env -b base shell
> python --version
```

或者直接加载指定虚拟环境运行特定命令

```console
$ xrepo env -b base python --version
```

`xrepo env -b/--bind` 就是绑定指定的虚拟环境，更多详情见：[#1762](https://github.com/xmake-io/xmake/issues/1762)

### Header Only 目标类型

对于 target，我们新增了 `headeronly` 目标类型，这个类型的目标程序，我们不会实际编译它们，因为它没有源文件需要被编译。

但是它包含了头文件列表，这通常用于 headeronly 库项目的安装，IDE 工程的文件列表生成，以及安装阶段的 cmake/pkgconfig 导入文件的生成。

例如：

```lua
add_rules("mode.release", "mode.debug")

target("foo")
    set_kind("headeronly")
    add_headerfiles("src/foo.h")
    add_rules("utils.install.cmake_importfiles")
    add_rules("utils.install.pkgconfig_importfiles")
```

更多详情见：[#1747](https://github.com/xmake-io/xmake/issues/1747)

### 从 CMake 中查找包

现在 cmake 已经是事实上的标准，所以 CMake 提供的 find_package 已经可以查找大量的库和模块，我们完全复用 cmake 的这部分生态来扩充 xmake 对包的集成。

我们可以通过 `find_package("cmake::xxx")` 去借助 cmake 来找一些包，xmake 会自动生成一个 cmake 脚本来调用 cmake 的 find_package 去查找一些包，获取里面包信息。

例如：

```console
$ xmake l find_package cmake::ZLIB
{
  links = {
    "z"
  },
  includedirs = {
    "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.
15.sdk/usr/include"
  },
  linkdirs = {
    "/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX10.
15.sdk/usr/lib"
  }
}
$ xmake l find_package cmake::LibXml2
{
  links = {
    "xml2"
  },
  includedirs = {
    "/Library/Developer/CommandLineTools/SDKs/MacOSX10.15.sdk/usr/include/libxml2"
  },
  linkdirs = {
    "/usr/lib"
  }
}
```

#### 指定版本

```lua
find_package("cmake::OpenCV", {required_version = "4.1.1"})
```

#### 指定组件

```lua
find_package("cmake::Boost", {components = {"regex", "system"}})
```

#### 预设开关

```lua
find_package("cmake::Boost", {components = {"regex", "system"}, presets = {Boost_USE_STATIC_LIB = true}})
set(Boost_USE_STATIC_LIB ON) -- will be used in FindBoost.cmake
find_package(Boost REQUIRED COMPONENTS regex system)
```

#### 设置环境变量

```lua
find_package("cmake::OpenCV", {envs = {CMAKE_PREFIX_PATH = "xxx"}})
```

#### 指定自定义 FindFoo.cmake 模块脚本目录

mydir/cmake_modules/FindFoo.cmake

```lua
find_package("cmake::Foo", {moduledirs = "mydir/cmake_modules"})
```

#### 包依赖集成

```lua
package("xxx")
    on_fetch(function (package, opt)
         return package:find_package("cmake::xxx", opt)
    end)
package_end()

add_requires("xxx")
```

#### 包依赖集成（可选组件）

```lua
package("boost")
    add_configs("regex",   { description = "Enable regex.", default = false, type = "boolean"})
    on_fetch(function (package, opt)
         opt.components = {}
         if package:config("regex") then
             table.insert(opt.components, "regex")
         end
         return package:find_package("cmake::Boost", opt)
    end)
package_end()

add_requires("boost", {configs = {regex = true}})
```

相关 issues: [#1632](https://github.com/xmake-io/xmake/issues/1632)

### 添加自定义命令到 CMakelists.txt

我们进一步改进了 cmake 生成器，现在可以将 rule 里面自定义的脚本序列化成命令列表，一起生成到 CMakelists.txt

不过目前只能支持 batchcmds 系列脚本的序列化。

```lua
rule("foo")
    after_buildcmd(function (target, batchcmds, opt)
        batchcmds:show("hello xmake!")
        batchcmds:cp("xmake.lua", "/tmp/")
        -- batchcmds:execv("echo", {"hello", "world!"})
        -- batchcmds:runv("echo", {"hello", "world!"})
    end)

target("test")
    set_kind("binary")
    add_rules("foo")
    add_files("src/*.c")
```

它将会生成类似如下的 CMakelists.txt

```
# ...
add_custom_command(TARGET test
    POST_BUILD
    COMMAND echo hello xmake!
    VERBATIM
)
add_custom_command(TARGET test
    POST_BUILD
    COMMAND cp xmake.lua /tmp/
    VERBATIM
)
target_sources(test PRIVATE
    src/main.c
)
```

不过 cmake 的 `ADD_CUSTOM_COMMAND` PRE_BUILD 实际效果在不同生成器上，差异比较大，无法满足我们的需求，因此我们做了很多处理来支持它。

相关 issues: [#1735](https://github.com/xmake-io/xmake/issues/1735)

### 改进对 NixOS 的安装支持

我们还改进了 get.sh 安装脚本，来更好地支持 nixOS。

## 更新内容

### 新特性

* [#1736](https://github.com/xmake-io/xmake/issues/1736): 支持 wasi-sdk 工具链
* 支持 Lua 5.4 运行时
* 添加 gcc-8, gcc-9, gcc-10, gcc-11 工具链
* [#1623](https://github.com/xmake-io/xmake/issues/1632): 支持 find_package 从 cmake 查找包
* [#1747](https://github.com/xmake-io/xmake/issues/1747): 添加 `set_kind("headeronly")` 更好的处理 headeronly 库的安装
* [#1019](https://github.com/xmake-io/xmake/issues/1019): 支持 Unity build
* [#1438](https://github.com/xmake-io/xmake/issues/1438): 增加 `xmake l cli.amalgamate` 命令支持代码合并
* [#1765](https://github.com/xmake-io/xmake/issues/1756): 支持 nim 语言
* [#1762](https://github.com/xmake-io/xmake/issues/1762): 为 `xrepo env` 管理和切换指定的环境配置
* [#1767](https://github.com/xmake-io/xmake/issues/1767): 支持 Circle 编译器
* [#1753](https://github.com/xmake-io/xmake/issues/1753): 支持 Keil/MDK 的 armcc/armclang 工具链
* [#1774](https://github.com/xmake-io/xmake/issues/1774): 添加 table.contains api
* [#1735](https://github.com/xmake-io/xmake/issues/1735): 添加自定义命令到 cmake 生成器
* [#1781](https://github.com/xmake-io/xmake/issues/1781): 改进 get.sh 安装脚本支持 nixos

### 改进

* [#1528](https://github.com/xmake-io/xmake/issues/1528): 检测 c++17/20 特性
* [#1729](https://github.com/xmake-io/xmake/issues/1729): 改进 C++20 modules 对 clang/gcc/msvc 的支持，支持模块间依赖编译和并行优化
* [#1779](https://github.com/xmake-io/xmake/issues/1779): 改进 ml.exe/x86，移除内置的 `-Gd` 选项
