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

<FileExplorer rootFilesDir="examples/other-languages/rust/cxx_call_rust_library" />

## Call c++ in rust

<FileExplorer rootFilesDir="examples/other-languages/rust/rust_call_cxx_library" />

