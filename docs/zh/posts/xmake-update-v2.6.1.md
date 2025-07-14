---
title: xmake v2.6.1 发布，使用 Lua5.4 运行时，Rust 和 C++ 混合编译支持
tags: [xmake, lua, C/C++, Rust, Lua5.4, C++20, Modules]
date: 2021-12-03
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具，使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

这个版本，我们正式将默认的 Luajit 运行时切换到 Lua5.4 运行时，并且新增了 Rust 和 C++ 的混合编译支持，我们也集成了 Cargo 的包管理支持。

另外，我们新增了一个实用的 `utils.glsl2spv` 规则，用于实现对 glsl shader 的编译支持，并自动生成对应的 C 代码头文件，方便快速内嵌编译后的 .spv 文件数据到代码中。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](/zh/about/course)

## 新特性介绍

### 默认切换到 Lua5.4 运行时

历经几个版本的迭代测试，我们在 2.6.1 版本，正式切换到 Lua5.4 运行时。

不过，这对于用户来说是完全无感知的，基本上没有任何兼容性问题，因为 xmake 对大部分接口都是封装过的，完全消除了 Lua 版本间的兼容性问题。

对于构建性能方面，由于构建的性能瓶颈主要来自编译器，Lua 自身的性能损耗完全可以忽略，而且 xmake 用 c 重写了 lua 原生的所有 io 接口，并且对耗时的接口都用 c 实现了优化。

因此，通过对比测试，不管是使用 Lua 还是 Luajit，构建项目的耗时基本一致，没有明显差异。

#### 为什么要切换？

因为 Luajit 对一些新架构基本不支持，例如：riscv, lonngarch，而且 luajit 作者基本已经不怎么维护它了，一些新架构支持和稳定性修复进展属于停滞状态。

为了能够更好的支持更多的平台，已经获取更快的迭代维护，我们选择使用 Lua 会带来非常多的好处。

### 添加 Cargo 包依赖

我们在这个版本中，新增了 Cargo 包依赖管理器的支持，不过目前主要用于 Rust 项目。

例子: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cargo_deps

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::base64 0.13.0")
add_requires("cargo::flate2 1.0.17", {configs = {features = "zlib"}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::base64", "cargo::flate2")
```

### Rust 和 C++ 混合编译

#### 使用 cxxbridge 在 c++ 中调用 rust

例子: [cxx_call_rust_library](https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cxx_call_rust_library)







```lua
add_rules("mode.debug", "mode.release")

add_requires("cargo::cxx 1.0")

target("foo")
    set_kind("static")
    add_files("src/foo.rs")
    set_values("rust.cratetype", "staticlib")
    add_packages("cargo::cxx")

target("test")
    set_kind("binary")
    add_rules("rust.cxxbridge")
    add_deps("foo")
    add_files("src/main.cc")
    add_files("src/bridge.rsx")
```

foo.rs

```rust
#[cxx::bridge]
mod foo {
    extern "Rust" {
        fn add(a: i32, b: i32) -> i32;
    }
}

pub fn add(a: i32, b: i32) -> i32 {
    return a + b;
}
```

我们还需要在 c++ 项目中添加桥接文件 bridge.rsx

```rust
#[cxx::bridge]
mod foo {
    extern "Rust" {
        fn add(a: i32, b: i32) -> i32;
    }
}
```

main.cc

```c++
#include <stdio.h>
#include "bridge.rs.h"

int main(int argc, char** argv) {
    printf("add(1, 2) == %d\n", add(1, 2));
    return 0;
}
```

#### 在 Rust 中调用 C++

例子: [rust_call_cxx_library](https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/rust_call_cxx_library)

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("static")
    add_files("src/foo.cc")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.rs")
```

main.rs

```rust
extern "C" {
	fn add(a: i32, b: i32) -> i32;
}

fn main() {
    unsafe {
	    println!("add(1, 2) = {}", add(1, 2));
    }
}
```

foo.cc

```c++
extern "C" int add(int a, int b) {
    return a + b;
}
```

### 新增 glsl shader 编译规则

我们新增了一个 `utils.glsl2spv` 编译规则，可以在项目中引入 `*.vert/*.frag` 等 glsl shader 文件，然后实现自动编译生成 `*.spv` 文件。

另外，我们还支持以 C/C++ 头文件的方式，二进制内嵌 spv 文件数据，方便程序使用。

#### 编译生成 spv 文件

xmake 会自动调用 glslangValidator 或者 glslc 去编译 shaders 生成 .spv 文件，然后输出到指定的 `{outputdir = "build"}` 目录下。

```lua
add_rules("mode.debug", "mode.release")

add_requires("glslang", {configs = {binaryonly = true}})

target("test")
    set_kind("binary")
    add_rules("utils.glsl2spv", {outputdir = "build"})
    add_files("src/*.c")
    add_files("src/*.vert", "src/*.frag")
    add_packages("glslang")
```

注，这里的 `add_packages("glslang")` 主要用于引入和绑定 glslang 包中的 glslangValidator，确保 xmake 总归能够使用它。

当然，如果用户自己系统上已经安装了它，也可以不用额外绑定这个包，不过我还是建议添加一下。

#### 编译生成 c/c++ 头文件

我们也可以内部借助 bin2c 模块，将编译后的 spv 文件生成对应的二进制头文件，方便用户代码中直接引入，我们只需要启用 `{bin2c = true}`。:w

```lua
add_rules("mode.debug", "mode.release")

add_requires("glslang", {configs = {binaryonly = true}})

target("test")
    set_kind("binary")
    add_rules("utils.glsl2spv", {bin2c = true})
    add_files("src/*.c")
    add_files("src/*.vert", "src/*.frag")
    add_packages("glslang")
```

然后我们可以在代码这么引入：

```c
static unsigned char g_test_vert_spv_data[] = {
    #include "test.vert.spv.h"
};

static unsigned char g_test_frag_spv_data[] = {
    #include "test.frag.spv.h"
};
```

跟 bin2c 规则的使用方式类似，完整例子见：[glsl2spv example](https://github.com/xmake-io/xmake/tree/master/tests/projects/other/glsl2spv)

### 改进 C++ Modules 构建

上个版本，我们重构了 C++20 Modules 构建支持，而在这个版本中，我们继续对它做了改进。

对于 msvc 编译器，我们已经能够在模块中导入 std 标准库模块，另外，我们修复了多个 target 之间存在依赖时，模块导入编译失败的问题。

### 改进 MDK 程序构建配置

上个版本，我们新增了 MDK 程序的构建支持，需要注意的是，目前一些 mdk 程序都使用了 microlib 库运行时，它需要编译器加上 `__MICROLIB` 宏定义，链接器加上 `--library_type=microlib` 等各种配置。

而在这个版本中，我们可以通过 `set_runtimes("microlib")` 直接设置到 microlib 运行时库，可以自动设置上所有相关选项。

#### 控制台程序

```lua
target("hello")
    add_deps("foo")
    add_rules("mdk.console")
    add_files("src/*.c", "src/*.s")
    add_includedirs("src/lib/cmsis")
    set_runtimes("microlib")
```

#### 静态库程序

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    add_rules("mdk.static")
    add_files("src/foo/*.c")
    set_runtimes("microlib")
```

### 改进 OpenMP 项目配置

我们也改进了 openmp 项目的配置，更加简化和统一，我们不再需要额外配置 rules，仅仅通过一个通用的 openmp 包就可以实现相同的效果。

```lua
add_requires("openmp")
target("loop")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("openmp")
```

在之前的版本，我们需要这么配置，对比一下，就能看出新的配置更加的简洁。

```lua
add_requires("libomp", {optional = true})
target("loop")
    set_kind("binary")
    add_files("src/*.cpp")
    add_rules("c++.openmp")
    add_packages("libomp")
```

## 更新内容

### 新特性

* [#1799](https://github.com/xmake-io/xmake/issues/1799): 支持混合 Rust 和 C++ 程序，以及集成 Cargo 依赖库
* 添加 `utils.glsl2spv` 规则去编译 *.vert/*.frag shader 文件生成 spirv 文件和二进制 C 头文件

### 改进

* 默认切换到 Lua5.4 运行时
* [#1776](https://github.com/xmake-io/xmake/issues/1776): 改进 system::find_package，支持从环境变量中查找系统库
* [#1786](https://github.com/xmake-io/xmake/issues/1786): 改进 apt:find_package，支持查找 alias 包
* [#1819](https://github.com/xmake-io/xmake/issues/1819): 添加预编译头到 cmake 生成器
* 改进 C++20 Modules 为 msvc 支持 std 标准库
* [#1792](https://github.com/xmake-io/xmake/issues/1792): 添加自定义命令到 vs 工程生成器
* [#1835](https://github.com/xmake-io/xmake/issues/1835): 改进 MDK 程序构建支持，增加 `set_runtimes("microlib")`
* [#1858](https://github.com/xmake-io/xmake/issues/1858): 改进构建 c++20 modules，修复跨 target 构建问题
* 添加 $XMAKE_BINARY_REPO 和 $XMAKE_MAIN_REPO 仓库设置环境变量
* [#1865](https://github.com/xmake-io/xmake/issues/1865): 改进 openmp 工程
* [#1845](https://github.com/xmake-io/xmake/issues/1845): 为静态库安装 pdb 文件

### Bugs 修复

* 修复语义版本中解析带有 0 前缀的 build 字符串问题
* [#50](https://github.com/libbpf/libbpf-bootstrap/issues/50): 修复 rule 和构建 bpf 程序 bug
* [#1610](https://github.com/xmake-io/xmake/issues/1610): 修复 `xmake f --menu` 在 vscode 终端下按键无响应，并且支持 ConPTY 终端虚拟按键
