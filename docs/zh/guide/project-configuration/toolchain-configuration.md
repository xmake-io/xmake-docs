# 工具链配置 {#toolchain-configuration}

## 切换工具链 {#switch-toolchains}

之前，我们讲到到，可以通过命令行 `xmake f --toolchain=[name]` 来全局切换工具链。想要了解详情，见：[命令行工具链切换](/zh/guide/basic-commands/switch-toolchains)。

在命令行中切换，尽管快速方便，但是它只能全局切换，如果工程中有多个 target 目标，我们仅仅想要对其中某个 target 进行工具链切换，那么我们只能在配置文件中使用 [set_toolchains](/zh/api/description/project-target.html#set-toolchains) 进行配置。

例如：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("clang", "yasm")
```

当然，我们如果我们将 set_toolchains 放置在配置文件的顶层根作用域，那么它会对所有 targets 目标生效，也能起到全局配置切换的效果。

```lua
set_toolchains("clang", "yasm")

target("foo")
    set_kind("binary")
    add_files("src/*.c")

target("bar")
    set_kind("binary")
    add_files("src/*.c")
```

关于这个接口的更多描述，可以到 [set_toolchains](/zh/api/description/project-target#set-toolchains) API 手册页详细了解。

## 切换工具集 {#switch-toolsets}

除了通过 set_toolchains 进行工具链切换，我们还可以使用 set_toolset 接口对 target 局部切换某个编译器。

它跟 set_toolchains 区别在于，toolchain 是包含 编译器，链接器，库归档器和汇编器等所有系列工具的集合，而 toolset 仅仅只会单独切换某个工具链内部的某个编译工具。


```lua
target("test1")
    add_files("*.c")

target("test2")
    add_files("*.c")
    set_toolset("cc", "$(projectdir)/tools/bin/clang-5.0")
```

:::tip 注意
它的粒度更加的小，但是除非必要，我们还是更建议用户使用 set_toolchains 实现统一的切换。
:::

关于这个接口的更多描述，可以到 [set_toolset](/zh/api/description/project-target#set-set_toolset) API 手册页详细了解。

## 自定义工具链 {#custom-toolchains}

我们还可以通过 toolchain 接口，实现自定义工具链，例如：

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

这里，我们自定义了一个 my_muslcc 交叉编译工具链，并且将它设置到了 test 目标中。

关于自定义工具链，可以到 [自定义工具链](/zh/api/description/custom-toolchain) 手册也进一步了解。

## 远程自动拉取工具链 {#pull-remote-toolchains}

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

### 拉取交叉编译工具链 {#pull-and-bind-cross-toolchain}

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

### 拉取绑定自定义工具链

我们也可以自定义一个工具链 `my_muslcc`，并且绑定到对应的工具链包 `muslcc` 中。

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

:::tip 注意
工具链和包的绑定逻辑，除了配置 `set_toolchains("my_muslcc@muslcc")`，还需要在工具链中自己实现对工具链包的查找才能生效。
:::

例如在交叉编译工具链的 on_load 中，需要配置如下这段代码，实现从绑定的工具链包 `muslccc` 安装目录找到对应的工具链。

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

当然，如果我们自定义的是交叉编译工具链，我们也可以简单的调用 `toolchain:load_cross_toolchain()` 实现同样的效果，它内部已经封装了上述的查找逻辑。

```lua
    on_load(function (toolchain)
        toolchain:load_cross_toolchain()
    end)
```

更多详情，可以直接参考完整例子：[绑定远程自定义工具链](https://github.com/xmake-io/xmake/blob/dev/tests/projects/package/toolchain_muslcc/xmake.lua)

## 自定义未知编译工具链

之前我们讲的自定义工具链，都是针对一些已知的编译器，例如 gcc, clang, msvc 等，Xmake 内部已经对它们做了适配，知道如何配置编译参数，如何执行编译命令。

如果是完全未知的编译器，它的编译参数和使用跟 gcc, clang 差别非常大的话，Xmake 无法知道如何去调用它们实现编译。

因此，我们需要更进一步的自定义它们，包括对编译参数的映射，编译参数检测，编译命令的生成和执行等等。

我们提供了一个完整的例子，可以直接参考：[完整自定义未知工具链](https://github.com/xmake-io/xmake/tree/dev/tests/apis/custom_toolchain)。

::: tip 注意
如果编译器的编译参数和使用完全跟 gcc/clang 类似，属于类 gcc/clang 的衍生编译器，仅仅只是工具名称不同，我们并不需要完全自定义它们。
例如，mycompiler.exe 编译器，如果它跟 gcc 的用法类似，那么只需要通过配置 `set_toolset("gcc@mycompiler.exe")`，告诉 xmake，将它强制作为 gcc 编译器来使用即可。
:::
