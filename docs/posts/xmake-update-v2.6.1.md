---
title: xmake v2.6.1 released, Switch to Lua5.4 runtime, Support Rust and C++ mixed compilation
tags: [xmake, lua, C/C++, Rust, Lua5.4, C++20, Modules]
date: 2021-12-03
author: Ruki
outline: deep
---
### Switch to Lua5.4 runtime by default

After several versions of iterative testing, we officially switched to the Lua5.4 runtime in version 2.6.1.

However, this is completely unaware to users, and basically there is no compatibility problem, because xmake encapsulates most of the interfaces, which completely eliminates the compatibility problem between Lua versions.

In terms of build performance, because the performance bottleneck of the build mainly comes from the compiler, the performance loss of Lua itself is completely negligible, and xmake rewrites all lua native io interfaces with c, and optimizes the time-consuming interfaces with c .

Therefore, through comparative tests, whether it is using Lua or Luajit, the time-consuming to build the project is basically the same, and there is no significant difference.

#### Why switch?

Because Luajit basically does not support some new architectures, such as: riscv, lonngarch, and the author of luajit has basically not maintained it, some new architecture support and stability repair progress is in a stagnant state.

In order to be able to better support more platforms and have obtained faster iterative maintenance, we choose to use Lua will bring many benefits.

### Add Cargo package dependency

In this version, we have added support for the Cargo package dependency manager, but it is currently mainly used in Rust projects.

Example: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cargo_deps

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::base64 0.13.0")
add_requires("cargo::flate2 1.0.17", {configs = {features = "zlib"}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::base64", "cargo::flate2")
```

### Rust and C++ mixed compilation

#### Use cxxbridge to call rust in c++

Example: [cxx_call_rust_library](https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cxx_call_rust_library)







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

We also need to add the bridge file bridge.rsx to the c++ project

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

#### Calling C++ in Rust

Example: [rust_call_cxx_library](https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/rust_call_cxx_library)

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

### Added glsl shader compilation rules

We have added a new compilation rule of `utils.glsl2spv`, which can introduce glsl shader files such as `*.vert/*.frag` into the project, and then realize automatic compilation to generate `*.spv` files.

In addition, we also support binary embedding spv file data in the form of C/C++ header file, which is convenient for program use.

#### Compile and generate spv file

xmake will automatically call glslangValidator or glslc to compile shaders to generate .spv files, and then output them to the specified `{outputdir = "build"}` directory.

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

Note that the `add_packages("glslang")` here is mainly used to import and bind the glslangValidator in the glslang package to ensure that xmake can always use it.

Of course, if you have already installed it on your own system, you don’t need to bind this package additionally, but I still recommend adding it.

#### Compile and generate c/c++ header files

We can also use the bin2c module internally to generate the corresponding binary header file from the compiled spv file, which is convenient for direct import in user code. We only need to enable `{bin2c = true}`. :w

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

Then we can introduce in the code like this:

```c
static unsigned char g_test_vert_spv_data[] = {
    #include "test.vert.spv.h"
};

static unsigned char g_test_frag_spv_data[] = {
    #include "test.frag.spv.h"
};
```

Similar to the usage of bin2c rules, see the complete example: [glsl2spv example](https://github.com/xmake-io/xmake/tree/master/tests/projects/other/glsl2spv)

### Improve C++ Modules construction

In the last version, we refactored the C++20 Modules build support, and in this version, we continue to improve it.

For the msvc compiler, we have been able to import the std standard library module in the module. In addition, we have fixed the problem that the module import compilation fails when there are dependencies between multiple targets.

### Improve MDK program build configuration

In the last version, we added support for building MDK programs. It should be noted that when some mdk programs currently use the microlib library to run, it requires the compiler to add the `__MICROLIB` macro definition, and the linker to add `-- library_type=microlib` and other configurations.

In this version, we can directly set to the microlib runtime library through `set_runtimes("microlib")`, and all relevant options can be set automatically.

#### Console Program

```lua
target("hello")
    add_deps("foo")
    add_rules("mdk.console")
    add_files("src/*.c", "src/*.s")
    add_includedirs("src/lib/cmsis")
    set_runtimes("microlib")
```

#### Static library program

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    add_rules("mdk.static")
    add_files("src/foo/*.c")
    set_runtimes("microlib")
```

### Improve OpenMP project configuration

We have also improved the configuration of the openmp project, which is more simplified and unified. We no longer need to configure additional rules. The same effect can be achieved only through a common openmp package.

```lua
add_requires("openmp")
target("loop")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("openmp")
```

In the previous version, we need to configure this way, and by comparison, we can see that the new configuration is more concise.

```lua
add_requires("libomp", {optional = true})
target("loop")
    set_kind("binary")
    add_files("src/*.cpp")
    add_rules("c++.openmp")
     add_packages("libomp")
```

## Changelog

### New features

* [#1799](https://github.com/xmake-io/xmake/issues/1799): Support mixed rust & c++ target and cargo dependences
* Add `utils.glsl2spv` rules to compile *.vert/*.frag shader files to spirv file and binary c header file

### Changes

* Switch to Lua5.4 runtime by default
* [#1776](https://github.com/xmake-io/xmake/issues/1776): Improve system::find_package, support to find package from envs
* [#1786](https://github.com/xmake-io/xmake/issues/1786): Improve apt:find_package, support to find alias package
* [#1819](https://github.com/xmake-io/xmake/issues/1819): Add precompiled header to cmake generator
* Improve C++20 module to support std libraries for msvc
* [#1792](https://github.com/xmake-io/xmake/issues/1792): Add custom command in vs project generator
* [#1835](https://github.com/xmake-io/xmake/issues/1835): Improve MDK program supports and add `set_runtimes("microlib")`
* [#1858](https://github.com/xmake-io/xmake/issues/1858): Improve to build c++20 modules with libraries
* Add $XMAKE_BINARY_REPO and $XMAKE_MAIN_REPO repositories envs
* [#1865](https://github.com/xmake-io/xmake/issues/1865): Improve openmp projects
* [#1845](https://github.com/xmake-io/xmake/issues/1845): Install pdb files for static library

### Bugs Fixed

* Fix semver to parse build string with zero prefix
* [#50](https://github.com/libbpf/libbpf-bootstrap/issues/50): Fix rule and build bpf program errors
* [#1610](https://github.com/xmake-io/xmake/issues/1610): Fix `xmake f --menu` not responding in vscode and support ConPTY terminal virtkeys
