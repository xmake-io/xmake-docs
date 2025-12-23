
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

<FileExplorer rootFilesDir="examples/other-languages/rust/cxx_call_rust_library" />

## 在 Rust 中调用 C++ {#call-cxx-in-rust}

<FileExplorer rootFilesDir="examples/other-languages/rust/rust_call_cxx_library" />
