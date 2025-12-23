
创建空工程：

```sh
$ xmake create -l rust -t console test
```

<FileExplorer rootFilesDir="examples/other-languages/rust/basic" />

更多例子见：[Rust Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/rust)

## 添加 Cargo 包依赖 {#cargo-deps}

例子: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cargo_deps

<FileExplorer rootFilesDir="examples/other-languages/rust/cargo_deps" />

## 集成 Cargo.toml 的依赖包 {#cargo-toml}

上面直接使用 `add_requires("cargo::base64 0.13.0")` 的方式集成依赖，会有一个问题：

如果依赖很多，并且有几个依赖都共同依赖了相同的子依赖，那么会出现重定义问题，因此如果我们使用完整的 Cargo.toml 去管理依赖就不会存在这个问题。

例如：

<FileExplorer rootFilesDir="examples/other-languages/rust/cargo_deps_with_toml" />

完整例子见：[cargo_deps_with_toml](https://github.com/xmake-io/xmake/blob/dev/tests/projects/rust/cargo_deps_with_toml/xmake.lua)

## 使用 cxxbridge 在 c++ 中调用 rust {#call-rust-in-cxx}

例子: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cxx_call_rust_library

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

```rust [foo.rs]
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

```c++ [main.cc]
#include <stdio.h>
#include "bridge.rs.h"

int main(int argc, char** argv) {
    printf("add(1, 2) == %d\n", add(1, 2));
    return 0;
}
```

## 在 Rust 中调用 C++ {#call-cxx-in-rust}

例子: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/rust_call_cxx_library

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

```rust [main.rs]
extern "C" {
	fn add(a: i32, b: i32) -> i32;
}

fn main() {
    unsafe {
	    println!("add(1, 2) = {}", add(1, 2));
    }
}
```

```c++ [foo.cc]
extern "C" int add(int a, int b) {
    return a + b;
}
```
