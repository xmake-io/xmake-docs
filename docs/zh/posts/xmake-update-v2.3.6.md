---
title: xmake v2.3.6 发布, 新增fortran编译支持
tags: [xmake, lua, C/C++, toolchains, fortran, zig, golang, dlang]
date: 2020-07-28
author: Ruki
---

这个版本重点对其他语言的支持做了一些改进，比如新增了fortran的编译支持，zig语言的实验性支持，另外对golang/dlang增加了第三方依赖包支持以及交叉编译支持。

虽然，xmake重点关注c/c++的构建支持，但是其他语言的支持xmake也会不定期做一些改进，其主要目的并不是替代它们官方自身的构建系统，仅仅只是为了支持与c/c++的混合编译，更好的为c/c++项目服务，
毕竟有些c/c++项目中，还是会偶尔调用其他语言的代码接口，比如与cuda, dlang, objc，swift, asm等语言的混合调用，所以xmake还是会对他们做一些基础性的编译支持。

另外，关于c/c++方面，我们也对vs预览版中新的`/sourceDependencies xxx.json`输出的头文件依赖格式也做了支持（这对于多语言下，头文件依赖检测会更加的可靠稳定）。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

![](/assets/img/index/xmake-basic-render.gif)

## 新特性介绍

### Fortran语言编译支持

这个版本开始，我们已经完全支持使用gfortran编译器来编译fortran项目，我们可以通过下面的命令，快速创建一个基于fortran的空工程：

```console
$ xmake create -l fortran -t console test
```

它的xmake.lua内容如下：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.f90")
```

更多代码例子可以到这里查看：[Fortran Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/fortran)








### Zig语言实验性支持

注：目前这个语言xmake还在试验性支持阶段，还很不完善，比如：windows上不支持，linux/macOS下动态库编译还不支持，请自行评估使用。

我们可以通过下面的配置方式，尝试性体验下，至少linux/macOS下console和static library程序还是可以跑的。

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.zig")
```

至于为啥windows不支持呢，详情见我之前提给zig的issues，[#5825](https://github.com/ziglang/zig/issues/5825)

而动态库不支持，也是因为我躺了一些坑（zig生成的动态库会自动追加`.0.0.0`），详情见：[issue 5827](https://github.com/ziglang/zig/issues/5827)

另外还躺了下其他坑，个人感觉坑有点多，所以我暂时还是试验阶段，等过段时间再看看。

更多例子见：[Zig Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/zig)

### Go依赖包和交叉编译支持

新版本xmake对go构建支持继续做了一些改进，比如对go的交叉编译也进行了支持，例如我们可以在macOS和linux上编译windows程序：

```console
$ xmake f -p windows -a x86
```

另外，新版本对go的第三方依赖包管理也进行了初步支持：

```lua
add_rules("mode.debug", "mode.release")

add_requires("go::github.com/sirupsen/logrus", {alias = "logrus"})
add_requires("go::golang.org/x/sys/internal/unsafeheader", {alias = "unsafeheader"})
if is_plat("windows") then
    add_requires("go::golang.org/x/sys/windows", {alias = "syshost"})
else
    add_requires("go::golang.org/x/sys/unix", {alias = "syshost"})
end

target("test")
    set_kind("binary")
    add_files("src/*.go")
    add_packages("logrus", "syshost", "unsafeheader")
```

不过还有一些不完善的地方，比如目前必须手动配置所有级联依赖包，会稍微繁琐些，后续有待改进。

更多例子见：[Go Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/go)

### Dlang/Dub依赖包支持

xmake对dlang的dub包管理也进行了支持，可以快速集成dlang的第三方依赖包：

```lua
add_rules("mode.debug", "mode.release")

add_requires("dub::log 0.4.3", {alias = "log"})
add_requires("dub::dateparser", {alias = "dateparser"})
add_requires("dub::emsi_containers", {alias = "emsi_containers"})
add_requires("dub::stdx-allocator", {alias = "stdx-allocator"})
add_requires("dub::mir-core", {alias = "mir-core"})

target("test")
    set_kind("binary")
    add_files("src/*.d")
    add_packages("log", "dateparser", "emsi_containers", "stdx-allocator", "mir-core")
```

### cl.exe新的头文件依赖文件支持

msvc的头文件依赖通常需要解析`/showIncludes`的输出内容，提取里面的includes文件列表来处理依赖编译问题，但是呢，cl.exe对这个的输出做的很不好，includes信息和编译输出是混在一起的。

对构建工具处理依赖解析非常不友好，尤其是多语言环境下，如何判断是includes，需要通过前置的`Note: including file: `字符串来判断提取，但中文下，又是`注意: 包含文件: `，
如果换成日语环境，又是日文的前缀字符串，编码格式问题、硬编码问题导致解析处理上，总归不是很完美。

关于这一点，最新的vs2019预览版中，微软终于对齐做了改进，通过新的`/sourceDependencies xxx.json`编译选项，可以更好的输出includes依赖信息，方便多语言环境下的解析提取。

另外，这个新选项的输出是独立到单独的json文件中去的，终于不是跟编译输出混一起了，也终于不用痛苦地解析分离编译错误、警告信息、includes列表信息了。

输出内容大概长这样：

```
{
    "Version": "1.0",
    "Data": {
        "Source": "z:\\personal\\tbox\\src\\tbox\\tbox.c",
        "Includes": [
            "z:\\personal\\tbox\\src\\tbox\\tbox.h",
            "z:\\personal\\tbox\\src\\tbox\\prefix.h",
            "z:\\personal\\tbox\\src\\tbox\\prefix\\prefix.h",
            "z:\\personal\\tbox\\src\\tbox\\prefix\\config.h",
            "z:\\personal\\tbox\\src\\tbox\\config.h",
            ...
```

而新版本中，xmake通过新增内置的`core.base.json`模块处理json解析，很方便地对新的头文件依赖数据进行解析和支持，优先使用此模式（如果cl是新版本支持的话，老版本cl还是使用`/showIncludes`）。

### Xcode插件生成支持

目前，我们还没有时间去自己实现xcode工程的生成，但不代表不支持，因为xmake支持生成cmakelists.txt文件，而cmake是支持xcode工程文件生成的，在官方还没有实现之前，
我们也可以通过cmake变相支持它，xmake会自动内部调用cmake中转下生成结果，对用户而言使用上没啥区别，只需要确保cmake已经安装即可：

```console
$ xmake project -k xcode
```

!> 等之后有时间，我们会重新自己实现各更加完善的xcode输出插件，也欢迎大家帮忙贡献。

### xmake-vscode插件intellisense支持

近期，我们也更新了下[xmake-vscode](https://github.com/xmake-io/xmake-vscode)插件，通过自动生成`compile_commands.json`到当前项目的`.vscode`目录下，然后我们只需要配置`.vscode/c_cpp_properties.json`在里面关联上这个`.vscode/compile_commands.json`路径
就能实现intellisense自动提示，同步xmake.lua里面的includedirs等配置信息。

至于，具体怎么生成`c_cpp_properties`，官方文档里面有详细说明：https://code.visualstudio.com/docs/cpp/configure-intellisense-crosscompilation

里面的主要配置项：

```
  "configurations": [
    {
      "compileCommands": ".vscode/compile_commands.json",
    }
  ],
```

## 更新内容

### 新特性

* 添加xcode工程生成器插件，`xmake project -k cmake` （当前采用cmake生成）
* [#870](https://github.com/xmake-io/xmake/issues/870): 支持gfortran编译器
* [#887](https://github.com/xmake-io/xmake/pull/887): 支持zig编译器
* [#893](https://github.com/xmake-io/xmake/issues/893): 添加json模块
* [#898](https://github.com/xmake-io/xmake/issues/898): 改进golang项目构建，支持交叉编译
* [#275](https://github.com/xmake-io/xmake/issues/275): 支持go包管理器去集成第三方go依赖包
* [#581](https://github.com/xmake-io/xmake/issues/581): 支持dub包管理器去集成第三方dlang依赖包

### 改进

* [#868](https://github.com/xmake-io/xmake/issues/868): 支持新的cl.exe的头文件依赖输出文件格式，`/sourceDependencies xxx.json`
* [#902](https://github.com/xmake-io/xmake/issues/902): 改进交叉编译工具链
