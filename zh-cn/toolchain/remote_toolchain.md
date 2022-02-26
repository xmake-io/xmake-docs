
从 2.5.2 版本开始，我们可以拉取指定的工具链来集成编译项目，我们也支持将依赖包切换到对应的远程工具链参与编译后集成进来。

相关例子代码见：[Toolchain/Packages Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/package)

相关的 issue [#1217](https://github.com/xmake-io/xmake/issues/1217)

### 拉取指定版本的 llvm 工具链

我们使用 llvm-10 中的 clang 来编译项目。

```lua
add_requires("llvm 10.x", {alias = "llvm-10"})
target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("llvm@llvm-10")
```

### 拉取交叉编译工具链

我们也可以拉取指定的交叉编译工具链来编译项目。

```lua
add_requires("muslcc")
target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("@muslcc")
```

### 拉取工具链并且集成对应工具链编译的依赖包

我们也可以使用指定的muslcc交叉编译工具链去编译和集成所有的依赖包。

```lua
add_requires("muslcc")
add_requires("zlib", "libogg", {system = false})

set_toolchains("@muslcc")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "libogg")
```

完整例子见：[Examples (muslcc)](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/toolchain_muslcc/xmake.lua)

### 拉取集成 Zig 工具链

```lua
add_rules("mode.debug", "mode.release")
add_requires("zig 0.7.x")

target("test")
    set_kind("binary")
    add_files("src/*.zig")
    set_toolchains("@zig")
```
