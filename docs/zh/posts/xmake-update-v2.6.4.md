---
title: xmake v2.6.4 发布，大量包管理特性改进
tags: [xmake, lua, C/C++, Package, Manager]
date: 2022-03-07
author: Ruki
outline: deep
---

## 新特性介绍

### 更灵活的包扩展

现在，我们可以通过 `set_base` 接口去继承一个已有的包的全部配置，然后在此基础上重写部分配置。

这通常在用户自己的项目中，修改 [xmake-repo](https://github.com/xmake-io/xmake-repo) 官方仓库的内置包比较有用，比如：修复改 urls，修改版本列表，安装逻辑等等。

例如，修改内置 zlib 包的 url，切到自己的 zlib 源码地址。

```lua
package("myzlib")
    set_base("zlib")
    set_urls("https://github.com/madler/zlib.git")
package_end()

add_requires("myzlib", {system = false, alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

我们也可以用来单纯添加一个别名包。

```lua
package("onetbb")
    set_base("tbb")
```

我们可以通过 `add_requires("onetbb")` 集成安装 tbb 包，只是包名不同而已。

### 包管理支持工具链切换

之前，我们限制了只能在 cross 平台下切换包安装的工具链，新版本中，我们可以支持更多平台下，对工具链的切换。

例如：

```bash
$ xrepo install --toolchains=clang zlib
```

我们可以在 linux 等平台上，快速切换到 clang 工具链编译安装 zlib 库。

我们也可以在 xmake.lua 的配置文件中去切换他们。

```lua
add_requires("zlib", {configs = {toolchains = "gcc-11"}})
```

不同的工具链安装的 zlib 包，会被分别存储在不同目录，互不干扰，不会存在编译器差异导致的链接兼容问题。






### 内置的包虚拟环境

Xrepo 命令之前已经很好的支持了包虚拟环境管理，`xrepo env shell`，但是对于复杂的包环境，还是需要用户自己配置一个 xmake.lua 文件，用于管理自己的包环境。

例如，我们需要一个常用的开发环境 shell，默认带有 cmake, python 和 vs/autoconf 等常用的开发工具链，我们需要自己起一个配置文件 devel.lua。

```lua
add_requires("cmake")
add_requires("python")
if is_host("linux", "bsd", "macosx") then
    add_requires("pkg-config", "autoconf", "automake", "libtool")
elseif is_host("windows") then
    set_toolchains("msvc")
end
```

然后，执行下面的命令去导入到全局配置。

```bash
$ xrepo env --add devel.lua
```

这样，我们可以通过下面的命令，去加载 shell 绑定这个环境：

```bash
$ xrepo env -b devel shell
> cmake --version
cmake version 3.19.3
```

而在新版本中，我们内置了一些常用的环境，可以通过 `xrepo env -l` 查看：

```bash
$ xrepo env -l
  - msvc
  - llvm-mingw
  - llvm
  - mingw-w64
  - devel
  - python3
  - depot_tools
  - python2
```

其中 devel 也在里面，所以，我们只需要执行 `xrepo env -b devel shell` 就可以带起一个 devel 开发环境，而不需要自己配置它们。

像 python, msvc 等也都是一些比较常用的环境，都可以直接使用。

当然，我们也支持临时在本地创建一个 xmake.lua 来配置加载包环境，而不放置到全局配置中去。

### 自定义安装包下载

我们可以通过新增的 `on_download` 接口，自定义包的下载逻辑，通常用不到，使用 Xmake 的内置下载就足够了。

如果用户自建私有仓库，对包的下载有更复杂的鉴权机制，特殊处理逻辑，那么可以重写内部的下载逻辑来实现。

```lua
on_download(function (package, opt)
    -- download packages:urls() to opt.sourcedir
end)
```

opt 参数里面，可以获取到下载包的目的源码目录 `opt.sourcedir`，我们只需要从 `package:urls()` 获取到包地址，下载下来就可以了。

然后，根据需要，添加一些自定义的处理逻辑。另外，自己可以添加下载缓存处理等等。

### ASN.1 程序构建支持

ASN.1 程序，需要借助 [ASN.1 Compiler](https://github.com/vlm/asn1c) 去生成相关的 .c 文件参与项目编译。

而 Xmake 内置提供了 `add_rules("asn1c")` 规则去处理 `.c` 文件生成，`add_requires("asn1c")` 自动拉取集成 ASN.1 编译器工具。

下面是一个基础的配置例子：

```lua
add_rules("mode.debug", "mode.release")
add_requires("asn1c")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_files("src/*.asn1")
    add_rules("asn1c")
    add_packages("asn1c")
```

具体见 [完整例子工程](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/asn1c)。

### 支持全平台构建 Swift 程序

之前，Xmake 仅支持 macOS 下借助 Xcode 工具链实现对 Swift 程序的构建，新版本中，我们也进行了改进，可以独立使用 swift 工具链，支持在 linux/windows 上构架 swift 程序，用法跟之前相同。

### 支持指定符号列表导出

在之前的版本中，我们提供了 `utils.symbols.export_all` 对 windows 的 dll 库实现自动的完整符号导出。

这尽管很方便，但只能支持 windows 程序，并且全量导出对生成的 dll 大小不好控制，有可能会存在不少根本不需要的内部符号被导出。

而，我们新版本提供的 `utils.symbols.export_list` 规则，可以在 xmake.lua 里面直接定义导出的符号列表，例如：

```lua
target("foo")
    set_kind("shared")
    add_files("src/foo.c")
    add_rules("utils.symbols.export_list", {symbols = {
        "add",
        "sub"}})
```

或者，在 `*.export.txt` 文件中添加导出的符号列表。

```lua
target("foo2")
    set_kind("shared")
    add_files("src/foo.c")
    add_files("src/foo.export.txt")
    add_rules("utils.symbols.export_list")
```

完整的工程例子见：[导出符号例子](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c/shared_library_export_list)

通过指定符号导出，我们可以使得生成的动态库尽可能的小，无关的内部符号完全不去导出它们，另外这个规则支持 linux, macOS 和 windows，更加的通用。

它内部会自动使用 .def, version scripts 和 `--exported_symbols_list` 去处理符号导出。

### 内置支持 linker scripts

新版中，我们也内置了 对 linker scripts 和 version scripts 文件的支持，我们可以使用 `add_files` 直接添加它们，而不需要配置 `add_ldflags("-Txxx.lds")`。


当前支持 `.ld` 和 `.lds` 作为 linker scripts 配置文件来添加：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    add_deps("foo")
    set_kind("binary")
    add_files("src/main.c")
    add_files("src/main.lds")
```

我们也支持 `.ver`, `.map` 后缀文件作为 version script 来添加。

```lua
target("foo")
    set_kind("shared")
    add_files("src/foo.c")
    add_files("src/foo.map")
```

foo.map 文件内容如下：

```
{
    global:
        foo;

    local:
        *;
};
```

## 更新内容

### 新特性

* [#2011](https://github.com/xmake-io/xmake/issues/2011): 支持继承和局部修改官方包，例如对现有的包更换 urls 和 versions
* 支持在 sparc, alpha, powerpc, s390x 和 sh4 上编译运行 xmake
* 为 package() 添加 on_download 自定义下载
* [#2021](https://github.com/xmake-io/xmake/issues/2021): 支持 Linux/Windows 下构建 Swift 程序
* [#2024](https://github.com/xmake-io/xmake/issues/2024): 添加 asn1c 支持
* [#2031](https://github.com/xmake-io/xmake/issues/2031): 为 add_files 增加 linker scripts 和 version scripts 支持
* [#2033](https://github.com/xmake-io/xmake/issues/2033): 捕获 ctrl-c 去打印当前运行栈，用于调试分析卡死问题
* [#2059](https://github.com/xmake-io/xmake/pull/2059): 添加 `xmake update --integrate` 命令去整合 shell
* [#2070](https://github.com/xmake-io/xmake/issues/2070): 添加一些内置的 xrepo env 环境配置
* [#2117](https://github.com/xmake-io/xmake/pull/2117): 支持为任意平台传递工具链到包
* [#2121](https://github.com/xmake-io/xmake/issues/2121): 支持导出指定的符号列表，可用于减少动态库的大小

### 改进

* [#2036](https://github.com/xmake-io/xmake/issues/2036): 改进 xrepo 支持从配置文件批量安装包，例如：`xrepo install xxx.lua`
* [#2039](https://github.com/xmake-io/xmake/issues/2039): 改进 vs generator 的 filter 目录展示
* [#2025](https://github.com/xmake-io/xmake/issues/2025): 支持为 phony 和 headeronly 目标生成 vs 工程
* 优化 vs 和 codesign 的探测速度
* [#2077](https://github.com/xmake-io/xmake/issues/2077): 改进 vs 工程生成器去支持 cuda

### Bugs 修复

* [#2005](https://github.com/xmake-io/xmake/issues/2005): 修复 path.extension
* [#2008](https://github.com/xmake-io/xmake/issues/2008): 修复 windows manifest 文件编译
* [#2016](https://github.com/xmake-io/xmake/issues/2016): 修复 vs project generator 里，对象文件名冲突导致的编译失败
