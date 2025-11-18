---
title: xmake v2.5.8 发布，新增 Pascal/Swig 程序和 Lua53 运行时支持
tags: [xmake, lua, C/C++, pascal, swig, lua5.3]
date: 2021-10-08
author: Ruki
outline: deep
---
### Pascal 语言支持

目前，我们可以使用跨平台的 Free pascal 工具链 fpc 去编译构建 Pascal 程序，例如：

#### 控制台程序

```lua
add_rules("mode.debug", "mode.release")
target("test")
    set_kind("binary")
    add_files("src/*.pas")
```

#### 动态库程序

```lua
add_rules("mode.debug", "mode.release")
target("foo")
    set_kind("shared")
    add_files("src/foo.pas")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.pas")
```

我们也可以通过 `add_fcflags()` 接口添加 Pascal 代码相关的编译选项。

更多例子见：[Pascal examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/pascal)







### Vala 库编译支持

上个版本，我们新增了对 Vala 语言的支持，但是之前只能支持控制台程序的编译，无法生成库文件。而这个版本中，我们额外增加了对静态库和动态库的编译支持。

#### 静态库程序

我们能够通过 `add_values("vala.header", "mymath.h")` 设置导出的接口头文件名，通过 `add_values("vala.vapi", "mymath-1.0.vapi")` 设置导出的 vapi 文件名。

```lua
add_rules("mode.release", "mode.debug")

add_requires("glib")

target("mymath")
    set_kind("static")
    add_rules("vala")
    add_files("src/mymath.vala")
    add_values("vala.header", "mymath.h")
    add_values("vala.vapi", "mymath-1.0.vapi")
    add_packages("glib")

target("test")
    set_kind("binary")
    add_deps("mymath")
    add_rules("vala")
    add_files("src/main.vala")
    add_packages("glib")
```

#### 动态库程序

```lua
add_rules("mode.release", "mode.debug")

add_requires("glib")

target("mymath")
    set_kind("shared")
    add_rules("vala")
    add_files("src/mymath.vala")
    add_values("vala.header", "mymath.h")
    add_values("vala.vapi", "mymath-1.0.vapi")
    add_packages("glib")

target("test")
    set_kind("binary")
    add_deps("mymath")
    add_rules("vala")
    add_files("src/main.vala")
    add_packages("glib")
```

更多例子见：[Vala examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/vala)

### Swig 模块支持

我们提供了 `swig.c` 和 `swig.cpp` 规则，可以对指定的脚本语言，调用 swig 程序生成 c/c++ 模块接口代码，然后配合 xmake 的包管理系统实现完全自动化的模块和依赖包整合。

相关 issues: [#1622](https://github.com/xmake-io/xmake/issues/1622)

#### Lua/C 模块

```lua
add_rules("mode.release", "mode.debug")
add_requires("lua")

target("example")
    add_rules("swig.c", {moduletype = "lua"})
    add_files("src/example.i", {swigflags = "-no-old-metatable-bindings"})
    add_files("src/example.c")
    add_packages("lua")
```

其中，swigflags 可以设置传递一些 swig 特有的 flags 选项。

#### Python/C 模块

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.c", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.c")
    add_packages("python")
```

如果设置了 scriptdir，那么我们执行安装的时候，会将对应模块的 python wrap 脚本安装到指定目录。

#### Python/C++ 模块

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.cpp", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.cpp")
    add_packages("python")
```

### Lua5.3 运行时支持

xmake 之前一直使用的 Luajit 作为默认的运行时，因为当初考虑到 Luajit 相对更加快速，并且固定的 lua 5.1 语法更加适合 xmake 内部实现的需要。

但是考虑到 Luajit 的更新不给力，作者维护不是很积极，并且它的跨平台性比较差，对于一些新出的架构，比如：Loongarch，riscv 等支持不及时，这多少限制了 xmake 的平台支持力度。

为此，新版本中，我们也将 Lua5.3 作为可选的运行时内置了进来，我们只需要通过下面的命令编译安装 xmake，就可以从 Luajit 切换到 Lua5.3 运行时：

#### Linux/macOS

```bash
$ make RUNTIME=lua
```

#### Windows

```bash
$ cd core
$ xmake f --runtime=lua
$ xmake
```

目前，当前版本还是默认采用的 luajit 运行时，用户可以根据自己的需求切换到 Lua5.3 运行时，但这对于用户的项目 xmake.lua 配置脚本几乎没有任何兼容性影响。

因为 xmake 的配置接口都已经做了一层的抽象封装，一些 Luajit/Lua5.3 存在兼容性差异的原生接口是不会开放给用户使用的，所以对项目构建来说，是完全无感知的。

唯一的区别就是，带有 Lua5.3 的 xmake 支持更多的平台和架构。

#### 性能对比

我做过一些基础构建测试，不管是启动时间，构建性能还是内存占用，Lua5.3 和 Luajit 的 xmake 都几乎没有任何差别。因为对于构建系统，主要的性能瓶颈是在编译器上，自身脚本的损耗占比是非常小的。

而且 xmake 内部的一些底层 Lua 模块，比如 io，字符编码，字符串操作等，都自己用 c 代码全部重写过的，完全不依赖特定的 Lua 运行时引擎。

#### 是否会考虑默认切换到 Lua?

由于我们刚刚支持 Lua5.3，尽管目前测试下来已经比较稳定，但是为了确保用户环境不受到任何影响，我们还需要再观察一段时间，短期还是默认使用 Luajit。

等到 2.6.1 版本开始，我们会全面开始切换到 Lua5.3 作为默认的运行时环境，大家有兴趣的话，也可以线帮忙测试下，如果遇到问题，欢迎到 issues 上反馈。

#### LoongArch 架构支持

由于我们增加了 Lua5.3 运行时支持，所以现在我们已经可以支持再 LoongArch 架构上运行 xmake，并且所有测试例子都已经测试通过。

#### Lua 5.4

目前，我们对 Lua 5.4 还保持观望状态，如果后面等 lua5.4 稳定了，我们也会尝试考虑继续升级到 Lua5.4。

### 第三方源码混合编译支持

#### 集成 CMake 代码库

新版本中，我们已经能够通过 xmake 的包模式直接集成自己项目中带有 CMakeLists.txt 的代码库，而不是通过远程下载安装。

相关 issues: [#1714](https://github.com/xmake-io/xmake/issues/1714)

例如，我们有如下项目结构：

```
├── foo
│   ├── CMakeLists.txt
│   └── src
│       ├── foo.c
│       └── foo.h
├── src
│   └── main.c
├── test.lua
└── xmake.lua
```

foo 目录下是一个使用 cmake 维护的静态库，而根目录下使用了 xmake 来维护，我们可以在 xmake.lua 中通过定义 `package("foo")` 包来描述如何构建 foo 代码库。

```lua
add_rules("mode.debug", "mode.release")

package("foo")
    add_deps("cmake")
    set_sourcedir(path.join(os.scriptdir(), "foo"))
    on_install(function (package)
        local configs = {}
        table.insert(configs, "-DCMAKE_BUILD_TYPE=" .. (package:debug() and "Debug" or "Release"))
        table.insert(configs, "-DBUILD_SHARED_LIBS=" .. (package:config("shared") and "ON" or "OFF"))
        import("package.tools.cmake").install(package, configs)
    end)
    on_test(function (package)
        assert(package:has_cfuncs("add", {includes = "foo.h"}))
    end)
package_end()

add_requires("foo")

target("demo")
    set_kind("binary")
    add_files("src/main.c")
    add_packages("foo")
```

其中，我们通过 `set_sourcedir()` 来设置 foo 包的代码目录位置，然后通过 import 导入 `package.tools.cmake` 辅助模块来调用 cmake 构建代码，xmake 会自动获取生成的 libfoo.a 和对应的头文件。

:::注意
如果仅仅本地源码集成，我们不需要额外设置 `add_urls` 和 `add_versions`。
:::

关于包的配置描述，详情见：[包描述说明](https://xmake.io/zh/)

定义完包后，我们就可以通过 `add_requires("foo")` 和 `add_packages("foo")` 来集成使用它了，就跟集成远程包一样的使用方式。

另外，`on_test` 是可选的，如果想要严格检测包的编译安装是否成功，可以在里面做一些测试。

完整例子见：[Library with CMakeLists](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/library_with_cmakelists)

#### 集成 autoconf 代码库

我们也可以使用 `package.tools.autoconf` 来本地集成带有 autoconf 维护的第三方代码库。

```lua
package("pcre2")

    set_sourcedir(path.join(os.scriptdir(), "3rd/pcre2"))

    add_configs("jit", {description = "Enable jit.", default = true, type = "boolean"})
    add_configs("bitwidth", {description = "Set the code unit width.", default = "8", values = {"8", "16", "32"}})

    on_load(function (package)
        local bitwidth = package:config("bitwidth") or "8"
        package:add("links", "pcre2-" .. bitwidth)
        package:add("defines", "PCRE2_CODE_UNIT_WIDTH=" .. bitwidth)
        if not package:config("shared") then
            package:add("defines", "PCRE2_STATIC")
        end
    end)

    on_install("macosx", "linux", "mingw", function (package)
        local configs = {}
        table.insert(configs, "--enable-shared=" .. (package:config("shared") and "yes" or "no"))
        table.insert(configs, "--enable-static=" .. (package:config("shared") and "no" or "yes"))
        if package:debug() then
            table.insert(configs, "--enable-debug")
        end
        if package:config("pic") ~= false then
            table.insert(configs, "--with-pic")
        end
        if package:config("jit") then
            table.insert(configs, "--enable-jit")
        end
        local bitwidth = package:config("bitwidth") or "8"
        if bitwidth ~= "8" then
            table.insert(configs, "--disable-pcre2-8")
            table.insert(configs, "--enable-pcre2-" .. bitwidth)
        end
        import("package.tools.autoconf").install(package, configs)
    end)

    on_test(function (package)
        assert(package:has_cfuncs("pcre2_compile", {includes = "pcre2.h"}))
    end)
```

`package.tools.autoconf` 和 `package.tools.cmake` 模块都是可以支持 mingw/cross/iphoneos/android 等交叉编译平台和工具链的，xmake 会自动传递对应的工具链进去，用户不需要做任何其他事情。

#### 集成其他构建系统

我们还支持集成 Meson/Scons/Make 等其他构建系统维护的代码库，仅仅只需要导入对应的构建辅助模块，这里就不一一细讲了，我们可以进一步查阅文档：[集成本地第三方源码库](https://xmake.io/zh/)

### 改进编译器特性检测

在之前的版本中，我们可以通过 `check_features` 辅助接口来检测指定的编译器特性，比如：

```lua
includes("check_features.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")
    configvar_check_features("HAS_CONSTEXPR", "cxx_constexpr")
    configvar_check_features("HAS_CONSEXPR_AND_STATIC_ASSERT", {"cxx_constexpr", "c_static_assert"}, {languages = "c++11"})
```

config.h.in

```c
${define HAS_CONSTEXPR}
${define HAS_CONSEXPR_AND_STATIC_ASSERT}
```

config.h

```c
/* #undef HAS_CONSTEXPR */
#define HAS_CONSEXPR_AND_STATIC_ASSERT 1
```

如果当前 cxx_constexpr 特性支持，就会在 config.h 中启用 HAS_CONSTEXPR 宏。

#### 新增 C/C++ 标准支持检测

2.5.8 之后，我们继续新增了对 cstd 和 c++ std 版本检测支持，相关 issues: [#1715](https://github.com/xmake-io/xmake/issues/1715)

例如：

```lua
configvar_check_features("HAS_CXX_STD_98", "cxx_std_98")
configvar_check_features("HAS_CXX_STD_11", "cxx_std_11", {languages = "c++11"})
configvar_check_features("HAS_CXX_STD_14", "cxx_std_14", {languages = "c++14"})
configvar_check_features("HAS_CXX_STD_17", "cxx_std_17", {languages = "c++17"})
configvar_check_features("HAS_CXX_STD_20", "cxx_std_20", {languages = "c++20"})
configvar_check_features("HAS_C_STD_89", "c_std_89")
configvar_check_features("HAS_C_STD_99", "c_std_99")
configvar_check_features("HAS_C_STD_11", "c_std_11", {languages = "c11"})
configvar_check_features("HAS_C_STD_17", "c_std_17", {languages = "c17"})
```

#### 新增编译器内置宏检测

我们还能检测编译器存在一些内置的宏定义，比如：`__GNUC__` 等，我们可以通过 `check_macros` 和 `configvar_check_macros` 辅助脚本来检测它们是否存在。

相关 issues: [#1715](https://github.com/xmake-io/xmake/issues/1715)

```lua
-- 检测宏是否定义
configvar_check_macros("HAS_GCC", "__GNUC__")
-- 检测宏没有被定义
configvar_check_macros("NO_GCC", "__GNUC__", {defined = false})
-- 检测宏条件
configvar_check_macros("HAS_CXX20", "__cplusplus >= 202002L", {languages = "c++20"})
```

### 增加对 Qt 4.x 的支持

除了 Qt 5.x 和 6.x，我们对于一些基于 Qt 4.x 的老项目，xmake 也增加了支持。

### 增加对 Android NDK r23 的支持

由于 google 对 Android NDK 的一些结构改动，导致 r23 影响了 xmake 对 android 项目部分编译特性的支持，在这个版本中，我们也做了修复。

### 修复 vsxmake 插件 Unicode 编码问题

另外，如果基于 Unicode 作为项目目录，那么生成的 vsxmake 项目会收到影响，导致 vs 项目编译和访问上存在很多问题，我们也在新版本中做了修复。

## 更新内容

### 新特性

* [#388](https://github.com/xmake-io/xmake/issues/388): Pascal 语言支持，可以使用 fpc 来编译 free pascal
* [#1682](https://github.com/xmake-io/xmake/issues/1682): 添加可选的额lua5.3 运行时替代 luajit，提供更好的平台兼容性。
* [#1622](https://github.com/xmake-io/xmake/issues/1622): 支持 Swig
* [#1714](https://github.com/xmake-io/xmake/issues/1714): 支持内置 cmake 等第三方项目的混合编译
* [#1715](https://github.com/xmake-io/xmake/issues/1715): 支持探测编译器语言标准特性，并且新增 `check_macros` 检测接口
* xmake 支持在 Loongarch 架构上运行

### 改进

* [#1618](https://github.com/xmake-io/xmake/issues/1618): 改进 vala 支持构建动态库和静态库程序
* 改进 Qt 规则去支持 Qt 4.x
* 改进 `set_symbols("debug")` 支持 clang/windows 生成 pdb 文件
* [#1638](https://github.com/xmake-io/xmake/issues/1638): 改进合并静态库
* 改进 on_load/after_load 去支持动态的添加 target deps
* [#1675](https://github.com/xmake-io/xmake/pull/1675): 针对 mingw 平台，重命名动态库和导入库文件名后缀
* [#1694](https://github.com/xmake-io/xmake/issues/1694): 支持在 set_configvar 中定义一个不带引号的字符串变量
* 改进对 Android NDK r23 的支持
* 为 `set_languages` 新增 `c++latest` 和 `clatest` 配置值
* [#1720](https://github.com/xmake-io/xmake/issues/1720): 添加 `save_scope` 和 `restore_scope` 去修复 `check_xxx` 相关接口
* [#1726](https://github.com/xmake-io/xmake/issues/1726): 改进 compile_commands 生成器去支持 nvcc

### Bugs 修复

* [#1671](https://github.com/xmake-io/xmake/issues/1671): 修复安装预编译包后，*.cmake 里面的一些不正确的绝对路径
* [#1689](https://github.com/xmake-io/xmake/issues/1689): 修复 vsxmake 插件的 unicode 字符显示和加载问题
