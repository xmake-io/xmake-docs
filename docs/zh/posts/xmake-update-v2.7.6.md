---
title: Xmake v2.7.6 发布，新增 Verilog 和 C++ Modules 分发支持
tags: [xmake, lua, C/C++, package, modules, verilog]
date: 2023-01-22
author: Ruki
---

## 新特性介绍

### Verilog 仿真程序支持

#### iVerilog 仿真器

通过 `add_requires("iverilog")` 配置，我们能够自动拉取 iverilog 工具链包，然后使用 `set_toolchains("@iverilog")` 自动绑定工具链来编译工程。

```lua
add_requires("iverilog")
target("hello")
    add_rules("iverilog.binary")
    set_toolchains("@iverilog")
    add_files("src/*.v")
```

##### 设置抽象配置

```lua
add_requires("iverilog")
target("hello")
    add_rules("iverilog.binary")
    set_toolchains("@iverilog")
    add_files("src/*.v")
    add_defines("TEST")
    add_includedirs("inc")
    set_languages("v1800-2009")
```

我们可以通过 `set_languages("v1800-2009")` 来设置切换 Verilog 的语言标准。

目前支持的一些取值和映射关系如下：

```lua
["v1364-1995"] = "-g1995"
["v1364-2001"] = "-g2001"
["v1364-2005"] = "-g2005"
["v1800-2005"] = "-g2005-sv"
["v1800-2009"] = "-g2009"
["v1800-2012"] = "-g2012"
```

##### 设置自定义 flags


```lua
add_requires("iverilog")
target("hello")
    add_rules("iverilog.binary")
    set_toolchains("@iverilog")
    add_files("src/*.v")
    add_values("iverilogs.flags", "-DTEST")
```

##### 构建工程

```console
$ xmake
checking for iverilog ... iverilog
checking for vvp ... vvp
[ 50%]: linking.iverilog hello.vvp
[100%]: build ok!
```

##### 运行程序

```console
$ xmake run
hello world!
LXT2 info: dumpfile hello.vcd opened for output.
src/main.v:6: $finish called at 0 (1s)
```

更多完整例子：[iVerilog Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/embed/iverilog)







#### Verilator 仿真器

通过 `add_requires("verilator")` 配置，我们能够自动拉取 verilator 工具链包，然后使用 `set_toolchains("@verilator")` 自动绑定到工具链来编译工程。

```lua
add_requires("verilator")
target("hello")
    add_rules("verilator.binary")
    set_toolchains("@verilator")
    add_files("src/*.v")
    add_files("src/*.cpp")
```

verilator 工程，我们需要一个额外的 `sim_main.cpp` 文件参与编译，作为程序的入口代码。

```
#include "hello.h"
#include "verilated.h"

int main(int argc, char** argv) {
    VerilatedContext* contextp = new VerilatedContext;
    contextp->commandArgs(argc, argv);
    hello* top = new hello{contextp};
    while (!contextp->gotFinish()) { top->eval(); }
    delete top;
    delete contextp;
    return 0;
}
```

##### 设置抽象配置

```lua
add_requires("verilator")
target("hello")
    add_rules("verilator.binary")
    set_toolchains("@verilator")
    add_files("src/*.v")
    add_defines("TEST")
    add_includedirs("inc")
    set_languages("v1800-2009")
```

我们可以通过 `set_languages("v1800-2009")` 来设置切换 Verilog 的语言标准。

目前支持的一些取值和映射关系如下：

```lua
-- Verilog
["v1364-1995"] = "+1364-1995ext+v",
["v1364-2001"] = "+1364-2001ext+v",
["v1364-2005"] = "+1364-2005ext+v",
-- SystemVerilog
["v1800-2005"] = "+1800-2005ext+v",
["v1800-2009"] = "+1800-2009ext+v",
["v1800-2012"] = "+1800-2012ext+v",
["v1800-2017"] = "+1800-2017ext+v",
```

##### 设置自定义 flags

```lua
add_requires("verilator")
target("hello")
    add_rules("verilator.binary")
    set_toolchains("@verilator")
    add_files("src/*.v")
    add_files("src/*.cpp")
    add_values("verilator.flags", "--trace", "--timing")
```

##### 构建工程

```console
$ xmake
[  0%]: compiling.verilog src/main.v
[ 15%]: cache compiling.release /Users/ruki/.xmake/packages/v/verilator/2023.1.10/cd2268409c1d44799288c7759b3cbd56/share/verilator/include/verilated.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__Slow.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h9053a130__0__Slow.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello.cpp
[ 15%]: cache compiling.release /Users/ruki/.xmake/packages/v/verilator/2023.1.10/cd2268409c1d44799288c7759b3cbd56/share/verilator/include/verilated_threads.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello__Syms.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h07139e86__0.cpp
[ 15%]: cache compiling.release src/sim_main.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h9053a130__0.cpp
[ 84%]: linking.release hello
[100%]: build ok!
```

##### 运行程序

```console
$ xmake run
ruki-2:hello ruki$ xmake run
hello world!
- src/main.v:4: Verilog $finish
```

更多完整例子：[Verilator](https://github.com/xmake-io/xmake/tree/master/tests/projects/embed/verilator)

### 支持 C++ Module 分发

非常感谢 [Arthapz](https://github.com/Arthapz) 在新版本中继续帮忙改进了 xmake 对 C++ Modules 的支持。

现在，我们可以将 C++ Modules 做成包进行分发，然后在其他项目中进行快速集成和复用。

它是基于 [p2473r1](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2021/p2473r1.pdf) 中对模块分发的设计草案做的一个原型实现。

#### 制作分发 C++ Modules 包

我们先使用 xmake.lua 维护模块的构建，并通过指定 `{install = true}`，来告诉 xmake 哪些模块文件需要安装对外分发。

```lua
add_rules("mode.release", "mode.debug")
set_languages("c++20")

target("foo")
    set_kind("static")
    add_files("*.cpp")
    add_files("*.mpp", { install = true })
```

然后，我们把它做成包，可以提交到 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库，当然也可以直接做成本地包，或者私有仓库包。

这里，为了方便测试验证，我们仅仅通过 `set_sourcedir` 将它做成本地包。

```lua
package("foo")
    set_sourcedir(path.join(os.scriptdir(), "src"))
    on_install(function(package)
        import("package.tools.xmake").install(package, {})
    end)
```

#### 集成 C++ Modules 包

然后，我们通过 `add_requires("foo")` 的包集成接口，对 C++ Modules 包进行快速集成使用。

由于 foo 的模块包，我们放在私有仓库中定义，所以我们通过 `add_repositories("my-repo my-repo")` 引入自己的包仓库。

如果，包已经提交到 xmake-repo 官方仓库，就不需要额外配置它。

```lua
add_rules("mode.release", "mode.debug")
set_languages("c++20")

add_repositories("my-repo my-repo")
add_requires("foo", "bar")

target("packages")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("foo", "bar")
    set_policy("build.c++.modules", true)
```

集成好包后，我们就可以执行 `xmake` 命令，一键下载、编译、集成 C++ Modules 包来使用。

```bash
$ xmake
checking for platform ... linux
checking for architecture ... x86_64
note: install or modify (m) these packages (pass -y to skip confirm)?
in my-repo:
  -> foo latest
  -> bar latest
please input: y (y/n/m)

  => install bar latest .. ok
  => install foo latest .. ok
[  0%]: generating.module.deps src/main.cpp
[  0%]: generating.module.deps /mnt/xmake/tests/projects/c++/modules/packages/build/.packages/b/bar/latest/4e0143c97b65425b855ad5fd03038b6a/modules/bar/bar.mpp
[  0%]: generating.module.deps /mnt/xmake/tests/projects/c++/modules/packages/build/.packages/f/foo/latest/4e0143c97b65425b855ad5fd03038b6a/modules/foo/foo.mpp
[ 14%]: compiling.module.release bar
[ 14%]: compiling.module.release foo
[ 57%]: compiling.release src/main.cpp
[ 71%]: linking.release packages
[100%]: build ok!
```

注：每个包安装后，会在包路径下，存储维护模块的 meta-info 文件，这是 `p2473r1.pdf` 中约定的一种格式规范，也许它不是最终的标准，但这并不影响我们现在去使用模块的分发。

```bash
$ cat ./build/.packages/f/foo/latest/4e0143c97b65425b855ad5fd03038b6a/modules/foo/foo.mpp.meta-info
{"_VENDOR_extension":{"xmake":{"name":"foo","file":"foo.mpp"}},"definitions":{},"include_paths":{}}
```

完整的例子工程见：[C++ Modules 包分发例子工程](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules/packages)

### 支持 C++23 Std Modules

[Arthapz](https://github.com/Arthapz) 也帮忙改进了对 C++23 Std Modules 的支持。

目前三个编译器对它的支持进展：

#### Msvc

最新 Visual Studio 17.5 preview 已经支持，并且非标准的 ifc std modules 将被废弃。

对于标准的 C++23 std modules，我们是这么引入的。

```c
import std;
```

而对于 ifc std modules，我们需要这么写：

```
import std.core;
```

它不是 C++23 标准，仅仅 msvc 提供，对其他编译器并不兼容，以后新版本 msvc 中也会逐步废弃。
因此新版本 Xmake 将仅仅 C++23 std modules，不再支持废弃的 ifc std modules。

#### Clang

目前最新的 clang 似乎也还没完全支持 C++23 std modules，当前还是 draft patch 状态，[#D135507](https://reviews.llvm.org/D135507)。

但是，Xmake 也对它进行了支持，如果大家想要尝鲜，可以自行合入这个 patch，然后使用 xmake 来测试。

另外，低版本的 clang 也有对非标准的 std modules 做了实验性支持。

我们还是可以在低版本 clang 中尝试性使用 xmake 来构建 std modules，尽管它可能还只是个玩具（会遇到很多问题）。

相关讨论见：[#3255](https://github.com/xmake-io/xmake/pull/3255)

#### Gcc

目前还不支持。

### Xrepo 自动补全支持

之前，我们仅仅支持 xmake 命令的不全，新版本中，我们还支持了 `xrepo install` 命令的不全，
可以自动搜索 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库的包，来不全我们的安装命令。

非常感谢 @glcraft 的贡献。

```bash
$ xrepo install libp
libpaper          libpfm            libpng            libpqxx           libpthread-stubs
libpcap           libplist          libpq             libpsl
```

## 更新内容

### 新特性

* [#3228](https://github.com/xmake-io/xmake/pull/3228): C++ modules 的安装发布，以及从包中导入 C++ modules 支持
* [#3257](https://github.com/xmake-io/xmake/issues/3257): 增加对 iverilog 和 verilator 的支持
* 支持 xp 和 vc6.0
* [#3214](https://github.com/xmake-io/xmake/pull/3214): xrepo install 的自动补全支持

### 改进

* [#3255](https://github.com/xmake-io/xmake/pull/3225): 改进 clang libc++ 模块支持
* 支持使用 mingw 编译 xmake
* 改进 xmake 在 win xp 上的兼容性
* 如果外部依赖被启用，切换 json 模块到纯 lua 实现，移除对 lua-cjson 的依赖

### Bugs 修复

* [#3229](https://github.com/xmake-io/xmake/issues/3229): 修复 vs2015 下找不到 rc.exe 问题
* [#3271](https://github.com/xmake-io/xmake/issues/3271): 修复支持带有空格的宏定义
* [#3273](https://github.com/xmake-io/xmake/issues/3273): 修复 nim 链接错误
* [#3286](https://github.com/xmake-io/xmake/issues/3286): 修复 compile_commands 对 clangd 的支持
