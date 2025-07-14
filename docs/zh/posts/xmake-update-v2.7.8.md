---
title: Xmake v2.7.8 发布，改进包虚拟环境和构建速度
tags: [xmake, lua, C/C++, package, performance, mingw64, wasm]
date: 2023-04-04
author: Ruki
---

[Xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具。

它非常的轻量，没有任何依赖，因为它内置了 Lua 运行时。

它使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

我们能够使用它像 Make/Ninja 那样可以直接编译项目，也可以像 CMake/Meson 那样生成工程文件，另外它还有内置的包管理系统来帮助用户解决 C/C++ 依赖库的集成使用问题。

目前，Xmake 主要用于 C/C++ 项目的构建，但是同时也支持其他 native 语言的构建，可以实现跟 C/C++ 进行混合编译，同时编译速度也是非常的快，可以跟 Ninja 持平。

```
Xmake = Build backend + Project Generator + Package Manager + [Remote|Distributed] Build + Cache
```

尽管不是很准确，但我们还是可以把 Xmake 按下面的方式来理解：

```
Xmake ≈ Make/Ninja + CMake/Meson + Vcpkg/Conan + distcc + ccache/sccache
```

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](/zh/about/course)

<img src="https://github.com/xmake-io/xmake-docs/raw/master/assets/img/index/package.gif" width="650px" />

## 新特性介绍

### 快速切换临时虚拟环境

Xmake 很早就支持了包的虚拟环境管理，可以通过配置文件的方式，实现不同包环境之间的切换。

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

也可以通过导入自定义环境配置文件，来切换环境：

```console
$ xrepo env --add /tmp/base.lua
$ xrepo env -b base shell
```

而在新版本中，我们进一步做了改进，让 Xrepo 能够直接在命令行临时指定需要绑定的环境包列表，实现快速切换，无需任何配置。

并且支持同时指定多个包环境。

例如，我们想进入一个带有 python 3.0, luajit 和 cmake 的环境，只需要执行：

```console
$ xrepo env -b "python 3.x,luajit,cmake" shell
[python,luajit,cmake] $ python --version
Python 3.10.6
[python,luajit,cmake] $ cmake --version
cmake version 3.25.3
```

Xmake 会自动安装相关依赖，然后开启一个新的 shell 环境，新环境终端左边也有 prompt 提示。

如果我们想退出当前环境，仅仅需要执行

```console
[python,luajit,cmake] $ xrepo env quit
$
```







### 改进代码特性检测

has_cfuncs/check_cxxsnippets 等系列检测接口，在 option 中已经有提供，并且有对应的辅助 API 来帮助检测。

相关文档可以参考：[辅助检测接口](/zh/manual/helper_interfaces)。

但是目前 option 提供的检测接口仅仅针对全局平台工具链，无法根据每个特定的 target 配置在针对性做一些检测。

因为 target 本身可能还会附带依赖包，不同的工具链，编译宏等差异性，检测结果也会有一些差异。

因此，如果用户想要更加灵活细粒度的检测每个 target 目标的编译特性，可以通过新版本提供的 target 目标实例接口。

- target:has_cfuncs
- target:has_cxxfuncs
- target:has_ctypes
- target:has_cxxtypes
- target:has_cincludes
- target:has_cxxincludes
- target:has_cflags
- target:has_cxxflags
- target:has_features
- target:check_csnippets
- target:check_cxxsnippets

这里，仅仅针对其中一些比较常用的接口，稍微展开介绍下使用方式。

#### target:has_cfuncs

- 检测目标编译配置能否获取给定的 C 函数

这应该在 `on_config` 中使用，比如可以用它来判断当前目标能否获取到 zlib 依赖包的一些函数接口，然后自动定义 `HAVE_INFLATE`：

```lua
add_requires("zlib")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
    on_config(function (target)
        if target:has_cfuncs("inflate", {includes = "zlib.h"}) then
            target:add("defines", "HAVE_INFLATE")
        end
    end)
```

尽管 option 也提供了类似的检测功能，但 option 的检测使用的是全局的平台工具链，它无法附带上 target 相关的一些编译配置，
也无法根据 target 设置不同编译工具链来适配检测，并且无法检测包里面的一些接口。

如果我们仅仅是想粗粒度的检测函数接口，并且 target 没有额外设置不同的工具链，那么 option 提供的检测功能已经足够使用了。

如果想要更细粒度控制检测，可以使用 target 实例接口提供的检测特性。

#### target:has_cxxfuncs

- 检测目标编译配置能否获取给定的 C++ 函数

用法跟 [target:has_cfuncs](/zh/api/description/project-target.html#has-cfuncs) 类似，只是这里主要用于检测 C++ 的函数。

不过，在检测函数的同时，我们还可以额外配置 std languages，来辅助检测。

```
target:has_cxxfuncs("foo", {includes = "foo.h", configs = {languages = "cxx17"}})
```

#### target:has_ctypes

- 检测目标编译配置能否获取给定的 C 类型

这应该在 `on_config` 中使用，如下所示：

```lua
add_requires("zlib")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
    on_config(function (target)
        if target:has_ctypes("z_stream", {includes = "zlib.h"}) then
            target:add("defines", "HAVE_ZSTEAM_T")
        end
    end)
```

#### target:has_cflags

- 检测目标编译配置能否获取给定的 C 编译 flags

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    on_config(function (target)
        if target:has_cxxflags("-fPIC") then
            target:add("defines", "HAS_PIC")
        end
    end)
```

#### target:has_cincludes

- 检测目标编译配置能否获取给定的 C 头文件

这应该在 `on_config` 中使用，比如可以用它来判断当前目标能否获取到 zlib 依赖包的 zlib.h 头文件，然后自动定义 `HAVE_INFLATE`：

```lua
add_requires("zlib")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
    on_config(function (target)
        if target:has_cincludes("zlib.h") then
            target:add("defines", "HAVE_ZLIB_H")
        end
    end)
```

#### target:check_cxxsnippets

- 检测是否可以编译和链接给定的 C++ 代码片段

这应该在 `on_config` 中使用，如下所示：

```lua
add_requires("libtins")
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("libtins")
    on_config(function (target)
        local has_snippet = target:check_cxxsnippets({test = [[
            #include <string>
            using namespace Tins;
            void test() {
                std::string name = NetworkInterface::default_interface().name();
                printf("%s\n", name.c_str());
            }
        ]]}, {configs = {languages = "c++11"}, includes = {"tins/tins.h"}}))
        if has_snippet then
            target:add("defines", "HAS_XXX")
        end
    end)
```

默认仅仅检测编译链接是否通过，如果想要尝试运行时检测，可以再设置 `tryrun = true`。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    on_config(function (target)
        local has_int_4 = target:check_cxxsnippets({test = [[
            return (sizeof(int) == 4)? 0 : -1;
        ]]}, {configs = {languages = "c++11"}, tryrun = true}))
        if has_int_4 then
            target:add("defines", "HAS_INT4")
        end
    end)
```

我们也可以继续通过设置 `output = true` 来捕获检测的运行输出，并且加上自定义的 `main` 入口，实现完整的测试代码，而不仅仅是代码片段。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    on_config(function (target)
        local int_size = target:check_cxxsnippets({test = [[
            #include <stdio.h>
            int main(int argc, char** argv) {
                printf("%d", sizeof(int)); return 0;
                return 0;
            }
        ]]}, {configs = {languages = "c++11"}, tryrun = true, output = true}))
    end)
```

#### target:has_features

- 检测是否指定的 C/C++ 编译特性

它相比使用 `check_cxxsnippets` 来检测，会更加快一些，因为它仅仅执行一次预处理就能检测所有的编译器特性，而不是每次都去调用编译器尝试编译。

```
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    on_config(function (target)
        if target:has_features("c_static_assert") then
            target:add("defines", "HAS_STATIC_ASSERT")
        end
        if target:has_features("cxx_constexpr") then
            target:add("defines", "HAS_CXX_CONSTEXPR")
        end
    end)
```

### 优化编译性能

Xmake 的 build cache 加速类似 ccache，采用预处理器计算 hash 后缓存编译对象文件来实现加速，它在 linux/mac 上提速效果非常明显。

而由于 msvc 的预处理器很慢，也可能是起进程相比 linux/mac 下更重，导致开启 build cache 后，windows 上使用 msvc 的整体编译效率反而慢了非常多。

尝试使用第三方的 ccache 来测试对比，也是一样的问题，因此我暂时针对 msvc 默认禁用了 build cache，使得整体构建速度恢复到正常水平。

### clang-tidy 自动修复

上个版本，我们新增了对 clang-tidy 支持，可以通过 `xmake check clang.tidy` 来检测代码。
而在这个版本中，我们继续对它做了改进，新增了 `--fix` 参数，可以让 clang-tidy 去自动修复检测出来的问题代码。

```console
$ xmake check clang.tidy --fix
$ xmake check clang.tidy --fix_errors
$ xmake check clang.tidy --fix_notes
```

### Swig/Java 模块构建支持

另外，其他用户也帮忙贡献了 Swig/Java 模块的构建支持。

```
add_rules("mode.release", "mode.debug")

target("example")
    set_kind('shared')
    -- set moduletype to java
    add_rules("swig.c", {moduletype = "java"})
    -- use swigflags to provider package name and output path of java files
    add_files("src/example.i", {swigflags = {
        "-package",
        "com.example",
        "-outdir",
        "build/java/com/example/"
    }})
    add_files("src/example.c")
    before_build(function()
        -- ensure output path exists before running swig
        os.mkdir("build/java/com/example/")
    end)
```

完整例子见：[Swig/Java Example](https://github.com/xmake-io/xmake/tree/master/tests/projects/swig/java_c)

### 开源之夏 2023

今年 Xmake 社区继续参加了开源之夏 2023 活动，它是由中科院软件所“开源软件供应链点亮计划”发起并长期支持的一项暑期开源活动
旨在鼓励在校学生积极参与开源软件的开发维护。

如果有感兴趣的同学，欢迎报名参与 Xmake 社区发布的项目开发（具体项目待定中），相关详情进展，请关注：[Xmake 开源之夏](https://summer-ospp.ac.cn/org/orgdetail/090748c6-6504-4d2d-9a11-f9f3e1876f7b)。


## 更新内容

### 新特性

* [#3518](https://github.com/xmake-io/xmake/issues/3518): 分析编译和链接性能
* [#3522](https://github.com/xmake-io/xmake/issues/3522): 为 target 添加 has_cflags, has_xxx 等辅助接口
* [#3537](https://github.com/xmake-io/xmake/issues/3537): 为 clang.tidy 检测器添加 `--fix` 自动修复

### 改进

* [#3433](https://github.com/xmake-io/xmake/issues/3433): 改进 QT 在 msys2/mingw64 和 wasm 上的构建支持
* [#3419](https://github.com/xmake-io/xmake/issues/3419): 支持 fish shell 环境
* [#3455](https://github.com/xmake-io/xmake/issues/3455): Dlang 增量编译支持
* [#3498](https://github.com/xmake-io/xmake/issues/3498): 改进绑定包虚拟环境
* [#3504](https://github.com/xmake-io/xmake/pull/3504): 添加 swig java 支持
* [#3508](https://github.com/xmake-io/xmake/issues/3508): 改进 trybuild/cmake 去支持工具链切换
* 为 msvc 禁用 build cache 加速，因为 msvc 的预处理器太慢，反而极大影响构建性能。

### Bugs 修复

* [#3436](https://github.com/xmake-io/xmake/issues/3436): 修复自动补全和 menuconf
* [#3463](https://github.com/xmake-io/xmake/issues/3463): 修复 c++modules 缓存问题
* [#3545](https://github.com/xmake-io/xmake/issues/3545): 修复 armcc 的头文件依赖解析
败