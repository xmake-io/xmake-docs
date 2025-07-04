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


## 目标类型配置 {#configure-target-types}

### 设置目标类型

通过 `set_kind()` 可以设置不同的目标类型：

```lua
target("app")
    set_kind("binary")      -- 可执行程序
    add_files("src/*.cpp")

target("lib")
    set_kind("static")      -- 静态库
    add_files("src/*.cpp")

target("dll")
    set_kind("shared")      -- 动态库
    add_files("src/*.cpp")

target("obj")
    set_kind("object")      -- 对象文件集合
    add_files("src/*.cpp")

target("header")
    set_kind("headeronly")  -- 纯头文件库
    add_headerfiles("include/*.h")
```

### 目标类型说明

| 类型 | 描述 | 输出文件 |
|------|------|----------|
| binary | 可执行程序 | app.exe, app |
| static | 静态库 | libapp.a, app.lib |
| shared | 动态库 | libapp.so, app.dll |
| object | 对象文件集合 | *.o, *.obj |
| headeronly | 纯头文件库 | 无编译输出 |
| phony | 虚拟目标 | 无输出，仅用于依赖管理 |

### 虚拟目标 (phony)

虚拟目标不生成实际文件，仅用于管理依赖关系：

```lua
target("test1")
    set_kind("binary")
    add_files("src/test1.cpp")

target("test2")
    set_kind("binary")
    add_files("src/test2.cpp")

target("all-tests")
    set_kind("phony")
    add_deps("test1", "test2")
```

执行 `xmake build all-tests` 会同时构建 test1 和 test2。

## 配置目标依赖 {#configure-targetdeps}

我们可以通过 [add_deps](/zh/api/description/project-target#add-deps) 接口来配置两个目标程序间的依赖。

这通常可用于一个可执行程序依赖一个静态库（或者动态库）的场景，例如：

```lua
target("foo")
    set_kind("static")
    add_files("src/foo.cpp")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.cpp")
```

由于 test 和 foo 库程序之间通过 `add_deps` 配置了依赖关系，当我们编译 test 的时候，会自动编译 foo 依赖库，并且也会自动的去链接它，而不再需要额外的 `add_links` 和 `add_linkdirs` 配置。

更多关于依赖的配置说明，请参考文档：[add_deps](/zh/api/description/project-target#add-deps)。

## 目标文件配置 {#configure-target-files}

### 添加源文件

```lua
target("app")
    add_files("src/*.cpp")           -- 添加所有 cpp 文件
    add_files("src/*.c")             -- 添加所有 c 文件
    add_files("src/*.asm")           -- 添加汇编文件
    add_files("src/*.m")             -- 添加 Objective-C 文件
    add_files("src/*.mm")            -- 添加 Objective-C++ 文件
```

### 排除特定文件

```lua
target("app")
    add_files("src/*.cpp", {exclude = "src/test.cpp"})  -- 排除测试文件
```

### 添加头文件

```lua
target("header-lib")
    set_kind("headeronly")
    add_headerfiles("include/*.h")           -- 添加头文件
    add_headerfiles("include/*.hpp")         -- 添加 C++ 头文件
    add_headerfiles("include/*.h", {install = false})  -- 不安装的头文件
```

### 添加安装文件

```lua
target("app")
    add_installfiles("assets/*.png", {prefixdir = "share/app"})  -- 安装资源文件
    add_installfiles("config/*.conf", {prefixdir = "etc"})       -- 安装配置文件
```

## 目标属性配置 {#configure-target-properties}

### 设置目标文件名

```lua
target("app")
    set_basename("myapp")  -- 生成的文件名为 myapp.exe
```

### 设置目标目录

```lua
target("app")
    set_targetdir("bin")   -- 输出到 bin 目录
```

### 设置安装目录

```lua
target("app")
    set_installdir("bin")  -- 安装到 bin 目录
```

### 设置版本信息

```lua
target("app")
    set_version("1.0.0")   -- 设置版本号
```

## 目标可见性配置 {#configure-target-visibility}

### 设置符号可见性

```lua
target("lib")
    set_kind("shared")
    set_symbols("hidden")  -- 隐藏符号，减少导出表大小
```

### 设置可见性级别

```lua
target("lib")
    set_kind("shared")
    set_visibility("hidden")  -- 设置默认可见性为隐藏
```

## 目标优化配置 {#configure-target-optimization}

### 设置优化级别

```lua
target("app")
    set_optimize("fast")     -- 快速优化
    set_optimize("faster")   -- 更快速优化
    set_optimize("fastest")  -- 最快优化
    set_optimize("smallest") -- 大小优化
    set_optimize("none")     -- 无优化
```

### 设置调试信息

```lua
target("app")
    set_symbols("debug")     -- 添加调试符号
    set_strip("debug")       -- 链接时去除调试符号
    set_strip("all")         -- 链接时去除所有符号
```

## 目标语言配置 {#configure-target-languages}

### 设置语言标准

```lua
target("app")
    set_languages("c++17")   -- 设置 C++ 标准
    set_languages("c11")     -- 设置 C 标准
```

### 设置语言特性

```lua
target("app")
    set_languages("c++17", "c11")  -- 同时支持 C++17 和 C11
```

## 目标平台配置 {#configure-target-platforms}

### 设置目标平台

```lua
target("app")
    set_plat("android")      -- 设置为 Android 平台
    set_arch("arm64-v8a")    -- 设置为 ARM64 架构
```

### 条件配置

```lua
target("app")
    if is_plat("windows") then
        add_defines("WIN32")
        add_links("user32")
    elseif is_plat("linux") then
        add_defines("LINUX")
        add_links("pthread")
    end
```

## 目标选项配置 {#configure-target-options}

### 关联选项

```lua
option("enable_gui")
    set_default(false)
    set_description("Enable GUI support")

target("app")
    set_options("enable_gui")  -- 关联选项
```

### 条件选项

```lua
target("app")
    if has_config("enable_gui") then
        add_defines("GUI_ENABLED")
        add_links("gtk+-3.0")
    end
```

## 目标规则配置 {#configure-target-rules}

### 添加构建规则

```lua
target("app")
    add_rules("mode.debug", "mode.release")  -- 添加调试和发布模式
    add_rules("qt.widgetapp")                -- 添加 Qt 应用规则
    add_rules("wdk.driver")                  -- 添加 WDK 驱动规则
```

### 自定义规则

```lua
rule("myrule")
    set_extensions(".my")
    on_build_file(function (target, sourcefile, opt)
        -- 自定义构建逻辑
    end)

target("app")
    add_rules("myrule")  -- 应用自定义规则
```

## 目标运行时配置 {#configure-target-runtime}

### 设置运行时库

```lua
target("app")
    set_runtimes("MT")      -- 静态运行时 (MSVC)
    set_runtimes("MD")      -- 动态运行时 (MSVC)
```

### 设置运行时路径

```lua
target("app")
    set_runtimes("MD")
    add_rpathdirs("$ORIGIN")  -- 设置相对路径查找
```

## 目标工具链配置 {#configure-target-toolchain}

### 设置工具链

```lua
target("app")
    set_toolset("clang")    -- 使用 Clang 工具链
    set_toolset("gcc")      -- 使用 GCC 工具链
    set_toolset("msvc")     -- 使用 MSVC 工具链
```

### 设置编译器

```lua
target("app")
    set_toolset("cc", "clang")   -- 设置 C 编译器
    set_toolset("cxx", "clang++") -- 设置 C++ 编译器
```

## 目标分组配置 {#configure-target-groups}

### 设置目标分组

```lua
target("app")
    set_group("apps")       -- 设置分组为 apps

target("lib")
    set_group("libs")       -- 设置分组为 libs

target("test")
    set_group("tests")      -- 设置分组为 tests
```

## 目标默认配置 {#configure-target-defaults}

### 设置默认目标

```lua
target("app")
    set_default(true)       -- 设为默认构建目标

target("test")
    set_default(false)      -- 不设为默认构建目标
```

### 启用/禁用目标

```lua
target("app")
    set_enabled(true)       -- 启用目标

target("old")
    set_enabled(false)      -- 禁用目标
```

## 更多信息 {#more-information}

- 完整的 API 文档：[工程目标 API](/zh/api/description/project-target)
- 目标实例接口：[目标实例 API](/zh/api/scripts/target-instance)
- 内置规则参考：[内置规则](/zh/api/description/builtin-rules)

