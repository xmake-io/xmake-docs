---
title: xmake v2.5.1 发布, 支持 Apple Silicon 并改进 C/C++ 包依赖管理
tags: [xmake, lua, C/C++, toolchains, xrepo, packages, vcpkg, conan, Apple, Silicon]
date: 2021-01-16
author: Ruki
---
这是 xmake 在今年的首个版本，也是完全适配支持 Apple Silicon (macOS ARM) 设备的首个版本。

这个版本，我们主要改进了对 C/C++ 依赖包的集成支持，更加的稳定，并且能够更加灵活的实现定制化配置编译。

另外，我们还重点改进 vs/vsxmake 两个vs工程生成器插件，修复了很多细节问题，并且对子工程`分组`也做了支持，现在可以生成类似下图的工程结构。


![](/assets/img/manual/set_group.png)


关于 Zig 方面，0.7.1 版本修复了很多我之前反馈的问题，现在 xmake 也已经可以很好的支持对 zig 项目的编译。

同时，我们还新开发了一个 [luarocks=build-xmake](https://github.com/xmake-io/luarocks-build-xmake) 插件去用 xmake 替换 luarocks 内置的构建系统。

最后，在这个版本中，我们继续改进了 `xmake f --menu` 图形化配置菜单，完全支持鼠标操作和滚动支持，也对 utf8 做了支持。


* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](https://xmake.io/zh/)









## 新特性介绍

### 新增 add_requireconfs 改进包配置

尽管之前的版本，我们可以通过 `add_requires("libpng", {configs = {shared = true}})` 的方式来定义和配置依赖包。

但是，如果用户项目的工程庞大，依赖包非常多，且每个包都需要不同的编译配置参数，那么配置起来还是会非常繁琐，并且具有局限性，比如无法改写内部的子依赖包配置。

因此，我们新增了 `add_requireconfs` 去更灵活方便的配置每个包的配置以及它的子依赖，下面我们重点介绍几种用法：

##### 扩充指定包的配置

这是基本用法，比如我们已经通过 `add_requires("zlib")` 声明了一个包，想要在后面对这个 zlib 的配置进行扩展，改成动态库编译，可以通过下面的方式配置。

```lua
add_requires("zlib")
add_requireconfs("zlib", {configs = {shared = true}})
```

它等价于

```lua
add_requires("zlib", {configs = {shared = true}})
```

##### 设置通用的默认配置

上面的用法，我们还看不出有什么实际用处，但如果依赖多了就能看出效果了，比如下面这样：

```lua
add_requires("zlib", {configs = {shared = true}})
add_requires("pcre", {configs = {shared = true}})
add_requires("libpng", {configs = {shared = true}})
add_requires("libwebp", {configs = {shared = true}})
add_requires("libcurl", {configs = {shared = false}})
```

是不是非常繁琐，如果我们用上 `add_requireconfs` 来设置默认配置，就可以极大的简化成下面的配置：


```lua
add_requireconfs("*", {configs = {shared = true}})
add_requires("zlib")
add_requires("pcre")
add_requires("libpng")
add_requires("libwebp")
add_requires("libcurl", {configs = {shared = false}})
```

上面的配置，我们通过 `add_requireconfs("*", {configs = {shared = true}})` 使用模式匹配的方式，设置所有的依赖包默认走动态库编译安装。

但是，我们又通过 `add_requires("libcurl", {configs = {shared = false}})` 将 libcurl 进行了特殊配置，强制走静态库编译安装。

最终的配置结果为：zlib/pcre/libpng/libwebp 是 shared 库，libcurl 是静态库。

我们通过模式匹配的方式，可以将一些每个包的常用配置都放置到统一的 `add_requireconfs` 中去预先配置好，极大简化每个 `add_requires` 的定义。

:::注意
默认情况下，对于相同的配置，xmake 会优先使用 add_requires 中的配置，而不是 add_requireconfs。
:::

如果 `add_requires("zlib 1.2.11")` 中设置了版本，就会优先使用 add_requires 的配置，完全忽略 add_requireconfs 里面的版本配置，当然我们也可以通过 override 来完全重写 `add_requires` 中指定的版本。

```lua
add_requires("zlib 1.2.11")
add_requireconfs("zlib", {override = true, version = "1.2.10"})
```

##### 改写包依赖配置

其实 `add_requireconfs` 最大的用处是可以让用户改写安装包的特定依赖包的配置。

什么意思呢，比如我们项目中集成使用 libpng 这个包，并且使用了动态库版本，但是 libpng 内部依赖的 zlib 库其实还是静态库版本。

```lua
add_requires("libpng", {configs = {shared = true}})
```

那如果我们想让 libpng 依赖的 zlib 包也改成动态库编译，应该怎么配置呢？这就需要 `add_requireconfs` 了。


```lua
add_requires("libpng", {configs = {shared = true}})
add_requireconfs("libpng.zlib", {configs = {shared = true}})
```

通过 `libpng.zlib` 依赖路径的写法，指定内部某个依赖，改写内部依赖配置。

如果依赖路径很深，比如 `foo -> bar -> xyz` 的依赖链，我们可以写成：`foo.bar.xyz`

我们也可以改写 libpng 依赖的内部 zlib 库版本：


```lua
add_requires("libpng")
add_requireconfs("libpng.zlib", {version = "1.2.10"})
```

##### 级联依赖的模式匹配

如果一个包的依赖非常多，且依赖层次也很深，怎么办呢，比如 libwebp 这个包，它的依赖有：

```
libwebp
  - libpng
    - zlib
    - cmake
  - libjpeg
  - libtiff
    - zlib
  - giflib
  - cmake
```

如果我想改写 libwebp 里面的所有的依赖库都加上特定配置，那么挨个配置，就会非常繁琐，这个时候就需要 `add_requireconfs()` 的递归依赖模式匹配来支持了。

```lua
add_requires("libwebp")
add_requireconfs("libwebp.**|cmake", {configs = {cxflags = "-DTEST"}})
```

上面的配置，我们将 libwebp 中所以的库依赖就额外加上了 `-DTEST` 来编译，但是 cmake 依赖属于构建工具依赖，我们可以通过 `|xxx` 的方式排除它。

这里的模式匹配写法，与 `add_files()` 非常类似。

我们在给几个例子，比如这回我们只改写 libwebp 下单级的依赖配置，启用调试库：

```lua
add_requires("libwebp")
add_requireconfs("libwebp.*|cmake", {debug = true})
```

### 图形化配置支持鼠标和滚动操作

我们升级了 xmake 所使用的 tui 组件库：[LTUI](https://github.com/tboox/ltui)，增加了对鼠标的支持，以及部分组件的滚动支持，我们可以再图形化配置中，更加灵活方便的配置编译选项。

<img src="https://tboox.org/static/img/ltui/choicebox_scrollbar.png" width="650px" />

### stdin 重定向输入支持

之前的版本中，xmake 提供的 os.execv/os.runv 等进程执行接口，仅仅只支持 stdout/stderr 输出重定向，但是并不支持 stdin 输入重定向，因此在这个版本中，我们对其也做了支持。

使用方式如下：

```lua
os.execv("foo", {"arg1", "arg2"}, {stdin = "/tmp/a"})
```

我们可以执行进程的时候，将 /tmp/a 文件作为重定向输入，当然我们还可以传递 `{stdout = "/tmp/out"}` 等作为重定向输出。

### vs 工程分组支持

我们新增了一个接口 `set_group`，来对每个 target 进行分组支持，此接口目前仅用于 vs/vsxmake 工程生成，对 vs 工程内部子工程目录树按指定结构分组展示，不过后续也可能对其他模块增加分组支持。

比如对于下面的分组配置：

```lua
add_rules("mode.debug", "mode.release")

target("test1")
    set_kind("binary")
    add_files("src/*.cpp")
    set_group("group1")

target("test2")
    set_kind("binary")
    add_files("src/*.cpp")
    set_group("group1")

target("test3")
    set_kind("binary")
    add_files("src/*.cpp")
    set_group("group1/group2")

target("test4")
    set_kind("binary")
    add_files("src/*.cpp")
    set_group("group3/group4")

target("test5")
    set_kind("binary")
    add_files("src/*.cpp")

target("test6")
    set_kind("binary")
    add_files("src/*.cpp")
```

生成的 vs 工程目录结构效果如下：

![](/assets/img/manual/set_group.png)

其中 `set_group("group1/group2")` 可以将 target 设置到二级分组中去。

### vs 工程自动更新规则

如果觉得每次通过 `xmake project -k vsxmake` 命令来生成和更新 vs 工程很繁琐，我们现在可以通过在 xmake.lua 中配置 `plugin.vsxmake.autoupdate` 规则来实现自动更新。

用户可以在 vs 工程中每次执行构建后，如果文件列表或者 xmake.lua 有改动，vs 工程都会自动更新。

```lua
add_rules("plugin.vsxmake.autoupdate")

target("test")
    set_kind("binary")
    add_files("src/*.c")
```

### vs/vsxmake 工程插件改进

除了上面提到的分组支持和自动更新，这个版本中，我们还修复了不少 vs 工程相关的问题，比如：intellisense 提示改进，路径被截断的问题修复，全面支持远程依赖包

### 改进 windows 注册表支持

xmake 改进了内部的 winos 模块，新增了一些接口来更加方便的访问注册表，获取 windows 上的注册表配置。

#### winos.registry_keys

- 获取注册表建列表

支持通过模式匹配的方式，遍历获取注册表键路径列表，`*` 为单级路径匹配，`**` 为递归路径匹配。

```lua
local keypaths = winos.registry_keys("HKEY_LOCAL_MACHINE\\SOFTWARE\\*\\Windows NT\\*\\CurrentVersion\\AeDebug")
for _, keypath in ipairs(keypaths) do
    print(winos.registry_query(keypath .. ";Debugger"))
end
```

#### winos.registry_values

- 获取注册表值名列表

支持通过模式匹配的方式，获取指定键路径的值名列表，`;` 之后的就是指定的键名模式匹配字符串。

```lua
local valuepaths = winos.registry_values("HKEY_LOCAL_MACHINE\\SOFTWARE\\xx\\AeDebug;Debug*")
for _, valuepath in ipairs(valuepaths) do
    print(winos.registry_query(valuepath))
end
```

#### winos.registry_query

- 获取注册表建值

获取指定注册表建路径下的值，如果没有指定值名，那么获取键路径默认值

```lua
local value, errors = winos.registry_query("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug")
local value, errors = winos.registry_query("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug;Debugger")
```

### Zig 项目构建支持

在上个版本中，xmake 已经对 zig 进行了实验性支持，但是期间也躺了不少坑，尤其是 windows/macos 上构建中遇到了不少问题。

然后在最新的 zig 0.7.1 中，已经将我遇到的大部分问题都修复了，现在 xmake 已经可以很好的支持 zig 项目编译。

我们可以通过下面的命令，快速创建一个 Zig 空工程：

```bash
$ xmake create -l zig console
```

xmake.lua 内容如下：

```lua
add_rules("mode.debug", "mode.release")

target("console")
    set_kind("binary")
    add_files("src/*.zig")
```

可以看到，其实配置方式跟 C/C++ 并没有什么不同，由于 Zig 和 C 有很好的二进制兼容，因此我们也可以使用 `add_requires` 来给 zig 项目添加 C/C++ 包的远程依赖支持。

然后执行 xmake 就可以完成编译了。

```bash
$ xmake
```

然后继续运行 run 命令，就可以直接执行 zig 程序，输出运行结果。

```bash
$ xmake run
Hello world!
```

我们还可以很方便的实现 C 和 Zig 的混合编译支持，只需要添加上对应的 C 代码文件就可以了。

```lua
add_rules("mode.debug", "mode.release")

target("console")
    set_kind("binary")
    add_files("src/*.zig", "src/*.c")
```

完整代码例子见：[Zig with C](https://github.com/xmake-io/xmake/blob/dev/tests/projects/zig/console_c_call_zig/xmake.lua)

### Luarocks 插件

[luarocks](https://luarocks.org/) 是 lua 的一个包管理工具，提供了各种 lua 模块的安装集成，不过它本身在对 lua c 模块进行构建是采用的内建的构建机制。

比如在它的 rockspec 文件中通过 builtin 构建类型来描述常用 lua c 模块的构建：

```lua
build = {
    type = "builtin",
    modules = {
        ["module.hello"] = {
            sources = "src/test.c"
        }
    },
    copy_directories = {}
}
```

这对于小模块而言，并没有什么问题，但如果模块的 c 代码结构比较复杂，它内置的构建规则还是有很多的局限性，并不灵活，另外切换 msvc / mingw 工具链以及参数配置什么的都不够灵活。

因此，xmake 提供了 [luarocks=build-xmake](https://github.com/xmake-io/luarocks-build-xmake) 插件去替换 luarocks 内置的构建系统，替换方式也很简单，只需要将 builtin 构建类型改成 xmake，并加上 luarocks-build-xmake 依赖就行了。

```lua
dependencies = {
    "lua >= 5.1",
    "luarocks-build-xmake"
}
build = {
    type = "xmake",
    modules = {
        ["module.hello"] = {
            sources = "src/test.c"
        }
    },
    copy_directories = {}
}
```

但是这样还是很繁琐，还是要基于 rockspec 文件中 modules 中的源文件列表来描述规则，然后 luarocks-build-xmake 会自动根据配置生成 xmake.lua 来完成构建。

不过既然用了 xmake，那么自己的 lua 模块，完全可以用 xmake.lua 来维护，这样构建配置就更加灵活了，因此我们只需要下面这样就行了。

```lua
dependencies = {
    "lua >= 5.1",
    "luarocks-build-xmake"
}
build = {
    type = "xmake",
    copy_directories = {}
}
```

只需要设置当前切换到 xmake 编译，完全使用 lua 模块项目内置的 xmake.lua 规则文件。

### 支持在 windows 安装部署 Qt 程序

非常感谢 @SirLynix 的贡献，xmake 已经可以支持在 windows 上部署安装 Qt 应用程序。

我们只需要正常维护一个 Qt 程序，例如：

```lua
add_rules("mode.debug", "mode.release")

target("demo")
    add_rules("qt.quickapp")
    add_headerfiles("src/*.h")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
```

然后，我们只需要执行下面的编译安装命令，xmake 就会自动调用 windeployqt.exe 程序去安装部署我们的 Qt 应用。

```bash
$ xmake
$ xmake install -o d:\installdir
```

相关补丁：[#1145](https://github.com/xmake-io/xmake/pull/1145)

另外，在之前的版本中，xmake 也已经支持对 macOS 和 android 版本的 Qt 程序进行部署打包，每次只需要正常的编译命令，就可以生成 QT .app/.apk 安装包。

```bash
$ xmake f -p android --ndk=/xxx/android-ndk-r20b --sdk=/xxx
$ xmake
```


### 一些问题修复

我们还修复了不少用户反馈的问题，这里我们介绍一些比较重要的 bug 修复，例如：

我们修复了 `add_defines("TEST=\"hello world\"")` 中内部带有空的双引号问题，之前编译会出错。

另外我们改进了 vstudio 环境的查找和支持，解决了用户 home 目录和环境变量中带有中文导致的编译失败问题。

我们也改进了 llvm 工具链，解决了 macOS 下如果没有安装 xcode 的情况下，使用 llvm 工具链缺少 isysroot 配置问题，以及 msvc 下头文件依赖编译偶尔失效问题。


## 更新内容

### 新特性

* [#1035](https://github.com/xmake-io/xmake/issues/1035): 图形配置菜单完整支持鼠标事件，并且新增滚动栏
* [#1098](https://github.com/xmake-io/xmake/issues/1098): 支持传递 stdin 到 os.execv 进行输入重定向
* [#1079](https://github.com/xmake-io/xmake/issues/1079): 为 vsxmake 插件添加工程自动更新插件，`add_rules("plugin.vsxmake.autoupdate")`
* 添加 `xmake f --vs_runtime=MT` 和 `set_runtimes("MT")` 去更方便的对 target 和 package 进行设置
* [#1032](https://github.com/xmake-io/xmake/issues/1032): 支持枚举注册表 keys 和 values
* [#1026](https://github.com/xmake-io/xmake/issues/1026): 支持对 vs/vsmake 工程增加分组设置
* [#1178](https://github.com/xmake-io/xmake/issues/1178): 添加 `add_requireconfs()` 接口去重写依赖包的配置
* [#1043](https://github.com/xmake-io/xmake/issues/1043): 为 luarocks 模块添加 `luarocks.module` 构建规则
* [#1190](https://github.com/xmake-io/xmake/issues/1190): 添加对 Apple Silicon (macOS ARM) 设备的支持
* [#1145](https://github.com/xmake-io/xmake/pull/1145): 支持在 windows 上安装部署 Qt 程序, 感谢 @SirLynix

### 改进

* [#1072](https://github.com/xmake-io/xmake/issues/1072): 修复并改进 cl 编译器头文件依赖信息
* 针对 ui 模块和 `xmake f --menu` 增加 utf8 支持
* 改进 zig 语言在 macOS 上的支持
* [#1135](https://github.com/xmake-io/xmake/issues/1135): 针对特定 target 改进多平台多工具链同时配置支持
* [#1153](https://github.com/xmake-io/xmake/issues/1153): 改进 llvm 工具链，针对 macos 上编译增加 isysroot 支持
* [#1071](https://github.com/xmake-io/xmake/issues/1071): 改进 vs/vsxmake 生成插件去支持远程依赖包
* 改进 vs/vsxmake 工程生成插件去支持全局的 `set_arch()` 设置
* [#1164](https://github.com/xmake-io/xmake/issues/1164): 改进 vsxmake 插件调试加载 console 程序
* [#1179](https://github.com/xmake-io/xmake/issues/1179): 改进 llvm 工具链，添加 isysroot

### Bugs 修复

* [#1091](https://github.com/xmake-io/xmake/issues/1091): 修复不正确的继承链接依赖
* [#1105](https://github.com/xmake-io/xmake/issues/1105): 修复 vsxmake 插件 c++ 语言标准智能提示错误
* [#1132](https://github.com/xmake-io/xmake/issues/1132): 修复 vsxmake 插件中配置路径被截断问题
* [#1142](https://github.com/xmake-io/xmake/issues/1142): 修复安装包的时候，出现git找不到问题
* 修复在 macOS Big Sur 上 macos.version 问题
* [#1084](https://github.com/xmake-io/xmake/issues/1084): 修复 `add_defines()` 中带有双引号和空格导致无法正确处理宏定义的问题
* [#1195](https://github.com/xmake-io/xmake/pull/1195): 修复 unicode 编码问题，改进 vs 环境查找和进程执行
