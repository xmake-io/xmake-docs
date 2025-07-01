# 配置目标 {#configure-targets}

当创建完一个空工程后，我们会得到如下一个最为基础的配置文件。

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
```

其中，`mode.release` 是默认的编译模式规则，它会为目标构建自动添加一些常规的优化编译选项，例如：`-O2` 等等。

我们也可以通过 `xmake f -m debug` 切换到 `mode.debug` 调试模式，自动配置上一些调试选项，例如：`-g` 等等。

当然，我们也可以不去配置模式规则，完全自己去配置它们。

```lua [xmake.lua]
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
```

## 配置宏定义 {#configure-defines}

我们可以通过 [add_defines](/zh/api/description/project-target#add-defines) 为目标程序添加一个宏定义选项，例如：

```lua [xmake.lua]
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_defines("DEBUG")
```

在 test 目标作用域下，我们对其配置了一个 `-DDEBUG` 的宏定义编译选项，它只会对 test 这一个目标生效。

我们也可以通过 `xmake -v` 命令去快速验证添加的配置是否生效。

```sh
[ 23%]: cache compiling.release src/main.cpp
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Q
unused-arguments -target x86_64-apple-macos15.2 -isysroot /Applications/Xcode.app/Contents/Develop
er/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.2.sdk -fvisibility=hidden -fvisibility-inline
s-hidden -O3 -DNDEBUG -o build/.objs/test/macosx/x86_64/release/src/main.cpp.o src/main.cpp
```

可以看到，`-DDEBUG` 已经被添加到了 clang 编译命令中。

## 同时配置多个目标 {#configure-multi-targets}

如果想要让多个编译目标同时生效，我们可以将它移到全局根作用域。

```lua [xmake.lua]
add_defines("DEBUG")

target("foo")
    set_kind("binary")
    add_files("src/*.cpp")

target("bar")
    set_kind("binary")
    add_files("src/*.cpp")
```

这个时候，foo 和 bar 两个目标程序都会带上 `-DDEBUG` 编译选项。

根作用域的配置，它会影响当前 xmake.lua 配置文件，以及所有子 xmake.lua 文件中的目标程序（也就是被 includes 引入的子目录配置）。

```lua [xmake.lua]
add_defines("DEBUG")

target("foo")
    set_kind("binary")
    add_files("src/*.cpp")

includes("bar")
```


```lua [bar/xmake.lua]
target("bar")
    set_kind("binary")
    add_files("src/*.cpp")
```

如果 bar 目标在 `bar/xmake.lua` 子配置文件中，也会被生效。

::: tip 注意
但是子文件中的根作用域配置无法影响平级，父级配置文件中的目标。
:::

```lua [xmake.lua]
target("foo")
    set_kind("binary")
    add_files("src/*.cpp")

includes("bar")
```

```lua [bar/xmake.lua]
add_defines("DEBUG")

target("bar")
    set_kind("binary")
    add_files("src/*.cpp")

target("zoo")
    set_kind("binary")
    add_files("src/*.cpp")
```

这里，尽管 `add_defines` 被配置到根作用域，但它仅仅影响 bar 和 zoo 两个目标，无法影响到 foo 目标。

也就是说，根作用域的影响范围是按树状结构，一层层生效下去的。

## 配置优化选项 {#configure-optimization}

`mode.release` 会自动引入一些优化选项，而我们也可以自己通过 [set_optimize](/zh/api/description/project-target#set-optimize) 接口去配置它。

例如：

```lua
set_optimize("faster")
```

就会为目标配置上 `-O2` 编译选项。

::: tip 注意
不同的编译器的优化选项是不同的，xmake 会自动映射到最为合适的编译选项。
:::

更多详情，请参看文档：[set_optimize](/zh/api/description/project-target#set-optimize)。

## 配置头文件搜索目录 {#configure-includedirs}

```lua
add_includedirs("/tmp")
```

它会添加 `-I/tmp` 编译选项给编译器。

更多详情，请参看文档：[add_includedirs](/zh/api/description/project-target#add-includedirs)。

## 配置链接库搜索目录 {#configure-linkdirs}

```lua
add_linkdirs("/tmp")
```

它会添加 `-L/tmp` 链接选项给链接器。

更多详情，请参看文档：[add_linkdirs](/zh/api/description/project-target#add-linkdirs)。

## 配置链接库 {#configure-links}

```lua
add_links("foo")
```

它会添加 `-lfoo` 链接选项给链接器，这通常需要搭配 [add_linkdirs](/zh/api/description/project-target#add-linkdirs) 来使用。

```lua
add_links("foo")
add_linkdirs("/tmp")
```

更多详情，请参看文档：[add_links](/zh/api/description/project-target#add-links)。

## 配置系统链接库

`add_links` 通常用于链接用户生成的库，而 `add_syslinks` 可以添加系统库，不需要额外的 `add_linkdirs`。

并且它的链接顺序也相对靠后。

```lua
add_links("foo")
add_syslinks("pthread", "dl")
```

如果同时配置了 links 和 syslinks，它的链接顺序如下：

```sh
-lfoo -lpthread -ldl
```

## 配置原始编译选项 {#configure-flags}

上述提到的 `add_defines` 等接口，都属于抽象 API，由于大部分编译器都支持，因此 Xmake 对它们做了抽象，使用户能够更加方便的使用，并且能够提供更好的跨平台，跨编译器。

然而，我们也能够通过 `add_cxxflags` 接口，为 C++ 代码添加特定的编译选项，比如：

```lua
add_cxflags("-DDEBUG")
```

它跟 `add_defines("DEBUG")` 效果是等价的，但是 `add_defines` 更加的通用，适用于所有的编译器，
而 `add_cxxflags("-DDEBUG")` 可能仅仅适用于某几个编译器，因为不是所有的编译器都是通过 `-D` 来定义宏的。

另外，我们也可以通过 `add_cflags` 接口，为 C 代码添加编译选项，以及 `add_cxflags` 同时为 C/C++ 代码添加编译选项。

更多详情，请参考文档：

- [add_cflags](/zh/api/description/project-target#add-cflags)
- [add_cxflags](/zh/api/description/project-target#add-cxflags)
- [add_cxxflags](/zh/api/description/project-target#add-cxxflags)

## 其他

更多关于目标配置 API 的完整说明，可以查看文档：[工程目标 API 手册](/zh/api/description/project-target)。

