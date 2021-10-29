
Starting from version 2.5.2, we can pull the specified toolchain to integrate the compilation project, and we also support switching the dependent package to the corresponding remote toolchain to participate in the compilation and integration.

For related example codes, see: [Toolchain/Packages Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/package)

Related issue [#1217](https://github.com/xmake-io/xmake/issues/1217)

### Pull the specified version of the llvm toolchain

We use clang in llvm-10 to compile the project.

```lua
add_requires("llvm 10.x", {alias = "llvm-10"})
target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("llvm@llvm-10")
````

### Pull cross compilation tool chain

We can also pull the specified cross-compilation tool chain to compile the project.

```lua
add_requires("muslcc")
target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("@muslcc")
```

### Pull the toolchain and integrate the dependency packages compiled by the corresponding toolchain

We can also use the specified muslcc cross-compilation tool chain to compile and integrate all dependent packages.

```lua
add_requires("muslcc")
add_requires("zlib", "libogg", {system = false})

set_toolchains("@muslcc")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "libogg")
```

For a complete example, see: [Examples (muslcc)](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/toolchain_muslcc/xmake.lua)

### Pull zig toolchain

```lua
add_rules("mode.debug", "mode.release")
add_requires("zig 0.7.x")

target("test")
    set_kind("binary")
    add_files("src/*.zig")
    set_toolchains("@zig")
```
