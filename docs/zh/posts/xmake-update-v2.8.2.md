---
title: Xmake v2.8.2 发布，官方包仓库数量突破 1k
tags: [xmake, lua, C/C++, package, API, rust]
date: 2023-08-22
author: Ruki
---

## 新特性介绍

这个版本，我们新增了不少实用的 API，并且移除了一些几年前就被标记为废弃的接口，另外改进了动态库对 soname 的支持。

同时，在这期间，我们迎来了一些喜人的数据，我们的 [xmake-repo](https://github.com/xmake-io/xmake-repo) 官方仓库包的数量也突破了 1k，非常感谢 Xmake 的每位贡献者，我们的包仓库基本上都是社区贡献者贡献进来的。

尤其是 @xq114, @star-hengxing, @SirLynix 帮忙贡献了大量的包，非常感谢~

还有，Xmake 仓库 Commits 也突破到了 12k，一直在持续快速迭代中。下面我们简单介绍下，新版本中的一些主要更新内容。

### 增加 soname 支持

新版本中，我们对 `set_version` 接口新增了 soname 版本支持，用于控制 so/dylib 动态库的版本兼容性控制。

我们可以配置 soname 的版本后缀名称，xmake 会在编译、安装动态库的时候，自动生成符号链接，执行指定版本的动态库。

例如，如果我们配置：

```lua
set_version("1.0.1", {soname = true})
```

xmake 会自动解析版本号的 major 版本作为 soname 版本，生成的结构如下：

```
└── lib
    ├── libfoo.1.0.1.dylib
    ├── libfoo.1.dylib -> libfoo.1.0.1.dylib
    └── libfoo.dylib -> libfoo.1.dylib
```

当然，我们也可以指定 soname 到特定的版本命名：

```lua
set_version("1.0.1", {soname = "1.0"}) -> libfoo.so.1.0, libfoo.1.0.dylib
set_version("1.0.1", {soname = "1"}) -> libfoo.so.1, libfoo.1.dylib
set_version("1.0.1", {soname = "A"}) -> libfoo.so.A, libfoo.A.dylib
set_version("1.0.1", {soname = ""}) -> libfoo.so, libfoo.dylib
```

而如果没设置 soname，那么默认不开启 soname 版本兼容控制：

```lua
set_version("1.0.1") -> libfoo.so, libfoo.dylib
```





### 改进 add_vectorexts 接口


add_vectorexts 接口主要用于添加扩展指令优化选项，目前支持以下几种扩展指令集：

```lua
add_vectorexts("mmx")
add_vectorexts("neon")
add_vectorexts("avx", "avx2", "avx512")
add_vectorexts("sse", "sse2", "sse3", "ssse3", "sse4.2")
```

其中，`avx512`, `sse4.2` 是我们新版本新增的指令配置，另外我们还新增了一个 `all` 配置项，可以用于尽可能的开启所有扩展指令优化。

```lua
add_vectorexts("all")
```

### 新增 set_encodings 接口

这个新接口主要用于设置源文件、目标执行文件的编码。

默认情况下，我们仅仅指定编码，是会同时对源文件，目标文件生效。

```lua
-- for all source/target encodings
set_encodings("utf-8") -- msvc: /utf-8
```

它等价于：

```lua
set_encodings("source:utf-8", "target:utf-8")
```

并且，目前仅仅支持设置成 utf-8 编码，将来会不断扩展。

如果，我们仅仅想单独设置源文件编码，或者目标文件编码，也是可以的。

#### 设置源文件编码

通常指的是编译的代码源文件的编码，我们可以这么设置。

```lua
-- gcc/clang: -finput-charset=UTF-8, msvc: -source-charset=utf-8
set_encodings("source:utf-8")
```

#### 设置目标文件编码

它通常指的是目标可执行文件的运行输出编码。

```lua
-- gcc/clang: -fexec-charset=UTF-8, msvc: -target-charset=utf-8
set_encodings("target:utf-8")
```

### 新增 add_forceincludes 接口

我们还新增了 `add_forceincludes` 接口，用于在配置文件中直接强制添加 `includes` 头文件。

```lua
add_forceincludes("config.h")
```

它的效果类似于 `#include <config.h>`，但是不需要在源码中显式添加它了。

另外，它的搜索路径也是需要通过 `add_includedirs` 来控制，而不是直接配置文件路径。

```lua
add_forceincludes("config.h")
add_includedirs("src")
```

默认 `add_forceincludes` 匹配 c/c++/objc。如果仅仅只想匹配 c++ 可以这么配置：

```lua
add_forceincludes("config.h", {sourcekinds = "cxx"})
```

如果想同时匹配多个源文件类型，也是可以的：


```lua
add_forceincludes("config.h", {sourcekinds = {"cxx", "mxx"}})
```

对于 gcc，它会设置 `-include config.h` 标志，对于 msvc，它会设置 `-FI config.h` 标志。

### 新增 add_extrafiles 接口

在之前的版本中，如果我们要在 vs/vsxmake 工程生成器中添加一些额外的文件到工程列表中去，只能通过 `add_headerfiles` 来添加，但是这有一点 Hack。

因此，我们新增了 `add_extrafiles` 接口，专门用于配置一些额外的文件到工程中，这样，用户也可以快速点击编辑它们。

这些被添加文件不是代码文件，不会参与编译，也不会被安装，仅仅只是能够让用户方便的在生成的工程 IDE 中，快速编辑访问它们。

将来，我们也可能用此接口做更多其他的事情。

```lua
add_extrafiles("assets/other.txt")
```

### sdasstm8 汇编器支持

@lanjackg2003 帮忙贡献了 sdcc/sdasstm8 汇编器的支持，非常感谢。

相关 patch, [#4071](https://github.com/xmake-io/xmake/pull/4071)

### 改进 Rust 交叉编译支持

新版本中，我们还对 Rust 项目构建做了改进，新增了交叉编译支持，包括对依赖包的交叉编译。

```lua
set_arch("aarch64-unknown-none")
add_rules("mode.release", "mode.debug")
add_requires("cargo::test", {configs = {
    std = false,
    main = false,
    cargo_toml = path.join(os.projectdir(), "Cargo.toml")}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::test")
```

例如上面的项目配置，我们通过 `set_arch("aarch64-unknown-none")` 全局修改编译架构，就能对依赖包，以及自身项目进行交叉编译。

如果没有配置 `set_arch`，我们也可以通过命令 `xmake f -a aarch64-unknown-none; xmake` 来动态切换编译架构。

当然，别忘了先得执行 `rustup target add aarch64-unknown-none ` 安装对应的 target 才行。

更多上下文，见：[#4049](https://github.com/xmake-io/xmake/issues/4049)


## 更新日志

### 新特性

* [#4002](https://github.com/xmake-io/xmake/issues/4002): 增加 soname 支持
* [#1613](https://github.com/xmake-io/xmake/issues/1613): 为 add_vectorexts 增加 avx512 和 sse4.2 支持
* [#2471](https://github.com/xmake-io/xmake/issues/2471): 添加 set_encodings API 去设置源文件和目标文件的编码
* [#4071](https://github.com/xmake-io/xmake/pull/4071): 支持 sdcc 的 stm8 汇编器
* [#4101](https://github.com/xmake-io/xmake/issues/4101): 为 c/c++ 添加 force includes
* [#2384](https://github.com/xmake-io/xmake/issues/2384): 为 vs/vsxmake 生成器添加 add_extrafiles 接口

### 改进

* [#3960](https://github.com/xmake-io/xmake/issues/3960): 改进 msys2/crt64 支持
* [#4032](https://github.com/xmake-io/xmake/pull/4032): 移除一些非常老的废弃接口
* 改进 tools.msbuild 升级 vcproj 文件
* 支持 add_requires("xmake::xxx") 包
* [#4049](https://github.com/xmake-io/xmake/issues/4049): 改进 Rust 支持交叉编译
* 改进 clang 下 c++ modules 支持

### Bugs 修复

* 修复 macOS/Linux 上子子进程无法快速退出问题
