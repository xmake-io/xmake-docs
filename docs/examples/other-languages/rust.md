Create an empty project:

```sh
$ xmake create -l rust -t console test
```

<FileExplorer rootFilesDir="examples/other-languages/rust/basic" />

For more examples, see: [Rust Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/rust)

## Add cargo package dependences

example: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cargo_deps

<FileExplorer rootFilesDir="examples/other-languages/rust/cargo_deps" />

## Integrating Cargo.toml dependency packages

Integrating dependencies directly using `add_requires("cargo::base64 0.13.0")` above has a problem.

If there are a lot of dependencies and several dependencies all depend on the same child dependencies, then there will be a redefinition problem, so if we use the full Cargo.toml to manage the dependencies we won't have this problem.

For example

<FileExplorer rootFilesDir="examples/other-languages/rust/cargo_deps_with_toml" />

For a complete example see: [cargo_deps_with_toml](https://github.com/xmake-io/xmake/blob/dev/tests/projects/rust/cargo_deps_with_toml/xmake.lua)

## Use cxxbridge to call rust in c++

example: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cxx_call_rust_library

<FileExplorer rootFilesDir="examples/other-languages/rust/cxx_call_rust_library" />

## Call c++ in rust

example: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/rust_call_cxx_library

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

