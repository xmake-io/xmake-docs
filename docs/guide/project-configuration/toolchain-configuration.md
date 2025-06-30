# Toolchain Configuration {#toolchain-configuration}

## Switch toolchains {#switch-toolchains}

Previously, we mentioned that we can use the command line `xmake f --toolchain=[name]` to switch toolchains globally. For more information,
see: [Command line toolchain switching](/guide/basic-commands/switch-toolchains).

Although switching in the command line is fast and convenient, it can only switch globally. If there are multiple targets in the project, and we only want to switch the toolchain for one of them, we can only use [set_toolchains](/zh/api/description/project-target.html#set-toolchains) in the configuration file to configure it.

For example:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("clang", "yasm")
```

Of course, if we place set_toolchains in the top-level root scope of the configuration file, it will take effect on all targets and can also play a global configuration switch effect.

```lua
set_toolchains("clang", "yasm")

target("foo")
    set_kind("binary")
    add_files("src/*.c")

target("bar")
    set_kind("binary")
    add_files("src/*.c")
```

For more description of this interface, please go to the [set_toolchains](/api/description/project-target#set-toolchains) API manual page for details.

## Switch toolset {#switch-toolsets}

In addition to switching toolchains through set_toolchains, we can also use the set_toolset interface to switch a compiler locally for a target.

The difference between it and set_toolchains is that toolchain is a collection of all series of tools including compiler, linker, library archiver and assembler, while toolset only switches a compilation tool within a toolchain.

```lua
target("test1")
    add_files("*.c")

target("test2")
    add_files("*.c")
    set_toolset("cc", "$(projectdir)/tools/bin/clang-5.0")
```

:::tip NOTE
Its granularity is smaller, but unless necessary, we still recommend users to use set_toolchains to achieve unified switching.
:::

For more information about this interface, please visit the [set_toolset](/api/description/project-target#set-set_toolset) API manual page.

## Custom toolchain {#custom-toolchains}

We can also implement custom toolchains through the toolchain interface, for example:

```lua
toolchain("my_muslcc")
    set_homepage("https://musl.cc/")
    set_description("The musl-based cross-compilation toolchains")
    set_kind("cross")
    on_load(function (toolchain)
        toolchain:load_cross_toolchain()
        if toolchain:is_arch("arm") then
            toolchain:add("cxflags", "-march=armv7-a", "-msoft-float", {force = true})
            toolchain:add("ldflags", "-march=armv7-a", "-msoft-float", {force = true})
        end
        toolchain:add("syslinks", "gcc", "c")
    end)
toolchain_end()

target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("my_muslcc")
```

Here, we customize a my_muslcc cross-compilation toolchain and set it to the test target.

For more information about custom toolchains, you can go to the [Custom Toolchain](/api/description/custom-toolchain) manual.

## Automatically pull remote toolchains {#pull-remote-toolchains}

Starting from version 2.5.2, we can pull the specified toolchain to integrate the compilation project. We also support switching the dependent package to the corresponding remote toolchain to participate in the compilation and then integrate it.

For relevant example codes, see: [Toolchain/Packages Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/package)

Related issue [#1217](https://github.com/xmake-io/xmake/issues/1217)

### Pull the specified version of the llvm toolchain

We use clang in llvm-10 to compile the project.

```lua
add_requires("llvm 10.x", {alias = "llvm-10"})

target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("llvm@llvm-10")
```

### Pull cross-compilation toolchain {#pull-and-bind-cross-toolchain}

We can also pull the specified cross-compilation toolchain to compile the project.

```lua
add_requires("muslcc")

target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("@muslcc")
```

### Pull toolchain and integrate the corresponding toolchain compiled dependency packages

We can also use the specified muslcc cross-compilation toolchain to compile and integrate all dependency packages.

```lua
add_requires("muslcc")
add_requires("zlib", "libogg", {system = false})

set_toolchains("@muslcc")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "libogg")
```

For complete examples, see: [Examples (muslcc)](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/toolchain_muslcc/xmake.lua)

### Pull integrated Zig toolchain

```lua
add_rules("mode.debug", "mode.release")
add_requires("zig 0.7.x")

target("test")
    set_kind("binary") add_files("src/*.zig")
    set_toolchains("@zig")
```

### Pull and bind a custom toolchain

We can also customize a toolchain `my_muslcc` and bind it to the corresponding toolchain package `muslcc`.

```lua
toolchain("my_muslcc")
    set_homepage("https://musl.cc/")
    set_description("The musl-based cross-compilation toolchains")
    set_kind("cross")
    on_load(function (toolchain)
        toolchain:load_cross_toolchain()
        if toolchain:is_arch("arm") then
            toolchain:add("cxflags", "-march=armv7-a", "-msoft-float", {force = true})
            toolchain:add("ldflags", "-march=armv7-a", "-msoft-float", {force = true})
        end
        toolchain:add("syslinks", "gcc", "c")
    end)
toolchain_end()

add_requires("muslcc")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("my_muslcc@muslcc")
```

:::tip NOTE
In addition to configuring `set_toolchains("my_muslcc@muslcc")`, the binding logic of the toolchain and the package also requires you to search for the toolchain package in the toolchain to take effect.
:::

For example, in the on_load of the cross-compilation toolchain, you need to configure the following code to find the corresponding toolchain from the installation directory of the bound toolchain package `muslccc`.

```lua
    for _, package in ipairs(toolchain:packages()) do
        local installdir = package:installdir()
        if installdir and os.isdir(installdir) then
            cross_toolchain = find_cross_toolchain(installdir, {cross = cross})
            if cross_toolchain then
                break
            end
        end
    end
```

Of course, if we customize the cross-compilation toolchain, we can also simply call `toolchain:load_cross_toolchain()` to achieve the same effect, which has encapsulated the above search logic.

```lua
on_load(function (toolchain)
    toolchain:load_cross_toolchain()
end)
```
For more details, you can refer to the complete example: [Binding remote custom toolchain](https://github.com/xmake-io/xmake/blob/dev/tests/projects/package/toolchain_muslcc/xmake.lua)

## Customize unknown compilation toolchain

The custom toolchains we talked about before are all for some known compilers, such as gcc, clang, msvc, etc. Xmake has adapted them internally and knows how to configure compilation parameters and how to execute compilation commands.

If it is a completely unknown compiler, its compilation parameters and usage are very different from gcc and clang, Xmake cannot know how to call them to compile.

Therefore, we need to further customize them, including mapping compilation parameters, compilation parameter detection, compilation command generation and execution, etc.

We provide a complete example, which can be directly referenced: [Complete Custom Unknown Toolchain](https://github.com/xmake-io/xmake/tree/dev/tests/apis/custom_toolchain).

::: tip NOTE
If the compiler's compilation parameters and usage are completely similar to gcc/clang, it is a derivative compiler of the same type as gcc/clang, and only the tool name is different. We do not need to completely customize them.
For example, if the mycompiler.exe compiler is similar to the usage of gcc, then you only need to configure `set_toolset("gcc@mycompiler.exe")` to tell xmake to force it to be used as a gcc compiler.
:::
