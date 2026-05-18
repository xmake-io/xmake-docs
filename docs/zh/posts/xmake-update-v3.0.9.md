---
title: Xmake v3.0.9 预览，升级 Lua 5.5，Zig C 互操作，Fil-C 与 Ascend C 工具链
tags: [xmake, lua, zig, filc, ascendc, depgraph, aria2, clang-cl]
date: 2026-05-14
author: Ruki
outline: deep
---

在此版本中，我们将内置 Lua 运行时升级到 5.5，新增了 `utils.replace` 内置规则，为 Zig 工具链添加了 C 互操作支持，并引入了两个新工具链：Fil-C（内存安全的 C/C++ 实现）和华为昇腾 Ascend C（用于 NPU 编程）。

此外，我们还新增了基于 aria2 的多线程下载后端，支持以 JSON / DOT 格式导出目标和包依赖图，vsxmake 对 C# 目标生成 `.csproj` 工程，以及围绕自定义工具链、`clang-cl[llvm]` 工具集、包静态库合并等方面的多项改进。

## 新特性介绍

### 升级到 Lua 5.5 运行时

内置 Lua 运行时已从 5.4 升级到 5.5。Lua 5.5 在语法和行为上有一些改动（例如 for-in 循环变量被视为 const 局部变量、部分旧版库 API 被移除等），可能导致一些在旧版本 xmake 下能正常工作的 `xmake.lua` 配置代码出现兼容性问题。为了尽可能保持向下兼容，本次升级伴随了几项补丁，把 5.5 之前的常见语义还原回来：

- 新增 `utils.replace` 内置规则（见下文），用于在编译 `lparser.c` 之前打补丁，使得 for-in 循环变量在 Lua 5.5 下仍然可以被重新赋值；
- 改进沙箱 `pairs` 迭代器，在循环体中重新赋值循环 key 的写法依然能正常工作；
- 构建时启用了 `LUA_COMPAT_5_1` / `LUA_COMPAT_5_2` / `LUA_COMPAT_5_3` 兼容宏，旧版本的 Lua API 依旧可用。

因此，下面这种常见写法以及用户已有的类似配置代码，在升级到 Lua 5.5 之后无需任何修改即可继续工作：

```lua
for k, v in pairs(t) do
    k = k:gsub("_", "-")
    do_something(k, v)
end
```

如果升级后仍然在自己的 `xmake.lua` 中遇到 Lua 5.5 相关的兼容性问题，欢迎提 issue 反馈 —— 我们希望这次升级对用户尽可能透明。

### utils.replace 内置规则

新增了内置规则 `utils.replace`，可以在源码送入编译器之前对其做文本替换。支持 Lua 模式匹配替换（默认）、纯文本替换以及任意 Lua 转换函数。

#### Lua 模式替换（默认）

```lua
target("foo")
    set_kind("binary")
    add_files("src/foo.c", {rules = "utils.replace", replaces = {
        {"old_pattern", "new_text"},
    }})
```

#### 纯文本替换

```lua
target("foo")
    set_kind("binary")
    add_files("src/foo.c", {rules = "utils.replace",
        replaces = {{"old text", "new text"}},
        replace_plain = true})
```

#### 函数式转换

```lua
target("foo")
    set_kind("binary")
    add_files("src/foo.c", {rules = "utils.replace", replaces = function (content)
        content = content:gsub("old", "new")
        return content
    end})
```

替换后的文件会写到 `target:autogenfile(sourcefile)` 路径，并通过依赖追踪保证只有源文件或替换规则真正变化时才会重新生成。同时原始文件所在目录也会被自动加入 `includedirs`，所以替换后的文件里的相对 `#include` 依然能正确解析。

### Zig 工具链：C 互操作

Zig 工具链现在完整支持 C 互操作。可以在同一个目标里混合 `.zig` 和 `.c` 文件，依赖 xmake 编译的 C/C++ 静态库，也可以从 `add_requires` 直接消费 C 语言包，并通过 `@cImport` / `@cInclude` 在 Zig 中使用它们。

#### 依赖 C 静态库

```lua
add_rules("mode.debug", "mode.release")

target("mathlib")
    set_kind("static")
    add_files("src/native/*.c")
    add_includedirs("src/native", {public = true})

target("test")
    set_kind("binary")
    add_deps("mathlib")
    add_files("src/*.zig")
    add_includedirs("src/native")
```

在 Zig 中调用：

```zig
const std = @import("std");
const c = @cImport({
    @cInclude("mathlib.h");
});

pub fn main() void {
    const sum = c.c_add(3, 4);
    const product = c.c_multiply(5, 6);
    std.debug.print("c_add(3,4)={d}\n", .{sum});
    std.debug.print("c_multiply(5,6)={d}\n", .{product});
}
```

#### 在 Zig 中使用 C 语言包

```lua
add_rules("mode.debug", "mode.release")
add_requires("zlib", {system = false})

target("test")
    set_kind("binary")
    add_files("src/*.zig")
    add_packages("zlib")
```

```zig
const c = @cImport({
    @cInclude("zlib.h");
});

pub fn main() void {
    const version = c.zlibVersion();
    // ...
}
```

#### C/Zig 混合源码

```lua
target("demo")
    set_kind("binary")
    add_files("src/*.c")
    add_files("src/*.zig")
    set_toolchains("@zig")
```

### Fil-C 工具链

新增了 `filc` 工具链，通过 `filcc` / `fil++` 编译器驱动接入 [Fil-C](https://fil-c.org/) —— 一个内存安全的 C/C++ 实现。目前仅支持 Linux x86_64，需要配合 xmake-repo 中的 `filc` 包一起使用。

```lua
add_rules("mode.debug", "mode.release")
add_requires("filc")

target("safety_test")
    set_kind("binary")
    set_toolchains("@filc")
    add_packages("filc")
    add_files("src/*.c")
```

Fil-C 提供了 `<stdfil.h>` 等额外头文件，工具链会自动配置 `pizfix` 运行时目录，包括链接目录和系统头文件搜索路径。内存安全问题会在运行时被捕获，并输出 `filc safety error` 与 `filc panic` 等诊断信息。

### 华为 Ascend C 工具链

新增了 `ascendc` 工具链与 `ascendc` 语言支持，用于华为昇腾 NPU 编程。引入了两种新的源文件类型：

- `.asc` —— Ascend C 内核代码，使用 `bisheng` 驱动编译
- `.aicpu` —— AI-CPU 代码，使用同样的驱动但带 AI-CPU 专用参数

工具链通过 `ASCEND_HOME_PATH` / `ASCEND_TOOLKIT_HOME` 自动检测 CANN SDK，并自动选择对应的 host 架构子目录。新增的 `add_ascnpuarchs(...)` 目标接口会映射成底层的 `--npu-arch=...` 编译参数。

#### 混合 asc / aicpu 的可执行程序

```lua
add_rules("mode.debug", "mode.release")

target("ascendc_mixed")
    set_kind("binary")
    add_files("src/main.asc", "src/helper.aicpu")
    add_ascnpuarchs("dav-2201")
```

#### 静态库与动态库

```lua
add_rules("mode.debug", "mode.release")

target("ascendc_static")
    set_kind("static")
    add_files("src/lib.asc")
    add_ascnpuarchs("dav-2201")

target("ascendc_shared")
    set_kind("shared")
    add_files("src/lib.asc")
    add_ascnpuarchs("dav-2201")

target("app")
    set_kind("binary")
    add_deps("ascendc_static", "ascendc_shared")
    add_files("src/main.asc")
    add_ascnpuarchs("dav-2201")
```

当 target 包含 `.asc` / `.aicpu` 源文件时，xmake 会根据文件后缀自动加载 `ascendc` 工具链，无需手动 `--toolchain=ascendc`。SDK 通过 `ASCEND_HOME_PATH` / `ASCEND_TOOLKIT_HOME` 自动检测，也可以在命令行覆盖：

```bash
# 通过 ASCEND_HOME_PATH 自动检测，直接构建即可
$ xmake

# 或显式指定 SDK 路径
$ xmake f --sdk=/usr/local/Ascend/ascend-toolkit/latest
$ xmake
```

`.asc` 和 `.aicpu` 源文件可以与 `.c` / `.cpp` / `.S` 自由混合在同一个 target 里。

### 目标依赖图导出

`xmake show --info=depgraph` 现在支持结构化输出目标依赖图，除了原有的 ASCII 树形视图外，还新增了两个参数：

- `--format=plain|json|dot` —— 输出格式
- `--target=<name>` —— 仅显示指定根目标及其传递依赖

```bash
# ASCII 树形（默认）
$ xmake show --info=depgraph

# 限定为单个目标
$ xmake show --info=depgraph --target=app

# JSON 输出，便于工具集成
$ xmake show --info=depgraph --format=json

# Graphviz DOT 输出
$ xmake show --info=depgraph --format=dot
```

JSON 输出结构如下：

```json
{
  "root_targets": ["app"],
  "targets": [
    {"name": "core",     "deps": []},
    {"name": "ui",       "deps": ["core"]},
    {"name": "ext::net", "deps": ["core"]},
    {"name": "app",      "deps": ["core", "ui", "ext::net"]}
  ]
}
```

DOT 输出可以渲染为有向图：

```
digraph {
    "core"
    "ui" -> "core"
    "ext::net" -> "core"
    "app" -> "core"
    "app" -> "ui"
    "app" -> "ext::net"
}
```

### 包依赖图导出

包侧也新增了对称的能力。`xrepo info --depgraph`（以及 `xmake require --depgraph`）可以打印一个或多个包的依赖图，输出格式同样支持三种：

```bash
# ASCII 树形（默认）
$ xrepo info --depgraph libpng
$ xmake require --depgraph libpng

# JSON 输出
$ xrepo info --depgraph --format=json libpng

# Graphviz DOT 输出
$ xrepo info --depgraph --format=dot libpng

# 带包配置
$ xrepo info --depgraph -k shared -m debug --configs="thread=true" boost
```

JSON 输出结构与目标依赖图类似：

```json
{
  "root_packages": ["libpng"],
  "packages": [
    {"name": "libpng", "version": "1.6.x", "deps": ["zlib"]},
    {"name": "zlib",   "version": "1.3.2", "deps": []}
  ]
}
```

### aria2 下载后端

新增了 [aria2](https://aria2.github.io/) 作为包下载后端。当系统中能找到 `aria2c` 时，xmake 会自动启用 aria2 进行多连接下载，找不到时仍然回落到 `curl` / `wget` / PowerShell。

```bash
# macOS
$ brew install aria2

# Debian / Ubuntu
$ sudo apt install aria2

# Arch Linux
$ sudo pacman -S aria2
```

无需修改 `xmake.lua`，安装好 aria2 后下次 `xmake require` / `xrepo install` 即可自动启用。aria2 后端会继承 xmake 已有的代理配置（`xmake g --proxy=...`）。

### vsxmake：C# 工程生成 .csproj

vsxmake 生成器现在能识别 C# 目标，对它们生成 `.csproj` 而不是 `.vcxproj`。生成的 `.csproj` 重写了 MSBuild 的 `CoreCompile` 步骤，把编译动作回调给 xmake —— 也就是 Visual Studio 负责组织解决方案，实际构建仍由 xmake 驱动。

```bash
$ xmake project -k vsxmake
$ xmake project -k vsxmake -m "debug,release" -a "x64"
```

用户侧的 `xmake.lua` 与普通 C# 工程完全一致：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/Program.cs")
```

目标类型会被映射成 csproj 的 `OutputType`：`binary` → `Exe`，`shared` / `static` → `Library`。

### 改进的自定义工具链定义

通过 `add_toolchaindirs(...)` 引入的用户自定义工具链现在更加灵活：

1. **自动注册 modules 目录。** 每个工具链子目录下的 `modules/` 会被自动加入 `import()` 搜索路径，方便把工具模块和工具链定义放在一起。

2. **字符串引用脚本文件。** `on_check`、`on_load`、`on_check_main` 现在接受字符串参数，引用同目录下的 `.lua` 文件。对于较大的工具链定义，可以拆分到多个文件里。

```lua
-- xmake/toolchains/mytoolchain/xmake.lua
toolchain("mytoolchain")
    set_kind("standalone")
    set_toolset("cc",  "mycc")
    set_toolset("cxx", "mycxx")
    on_check("check")    -- 实际加载 xmake/toolchains/mytoolchain/check.lua
    on_load("load")      -- 实际加载 xmake/toolchains/mytoolchain/load.lua
toolchain_end()
```

推荐的目录结构：

```
xmake/toolchains/mytoolchain/
├── xmake.lua          -- toolchain("mytoolchain") 定义
├── check.lua          -- function main(toolchain) ... end
├── load.lua           -- function main(toolchain) ... end
└── modules/           -- 自动加入 import() 搜索路径
    └── helper.lua
```

新加入的 `ascendc` 工具链就是采用这种组织方式。

### clang-cl 工具链：通过 `llvm` 配置切换到 lld-link

为 `clang-cl` 工具链新增了 `llvm` 配置，开启后会把链接器 / 归档器 / 汇编器 / 资源编译器整体切换到对应的 LLVM 工具，其中链接器就是 `lld-link`。默认情况下 `clang-cl` 仍然使用 MSVC 的 `link.exe`、`ml64.exe`、`rc.exe` 等；加上 `[llvm]` 即可整体切换到 LLVM 工具链。

```lua
-- 默认：clang-cl 配合 link.exe / ml64.exe / rc.exe
set_toolchains("clang-cl")

-- 加上 [llvm]：切换 ld/sh 到 lld-link，ar 到 llvm-ar，
-- as 到 llvm-ml(64).exe，mrc 到 llvm-rc.exe
set_toolchains("clang-cl[llvm]")
```

另外，clang-cl 下开启 LTO 时，xmake 也会自动把链接器切换到 `lld-link`（因为 `link.exe` 不支持 LLVM bitcode），所以单独设置 `set_policy("build.optimization.lto", true)` 也能直接工作，不需要显式开启 `llvm` 配置。

配套地，新增了 `find_lld_link` 检测模块，并把 `lld-link` 与 `windows.subsystem` 规则、LTO 规则、Qt 规则以及 clang-cl 的 ASan thunk 进行了整合，使这些特性在 `clang-cl[llvm]` 下都能正常工作。

### build.merge_archive 现在包含包静态库

`build.merge_archive` 策略已经扩展为同时合并 `add_packages(...)` 引入的静态库，而不仅仅是 `add_deps(...)` 来的静态库依赖。

```lua
add_rules("mode.debug", "mode.release")
add_requires("libpng", {system = false})
add_requireconfs("libpng.*", {system = false, override = true})

target("foo")
    set_kind("static")
    add_files("src/png.c")
    add_packages("libpng")
    set_policy("build.merge_archive", true)

target("test")
    add_deps("foo")
    add_files("src/main.c")
```

构建完成后，`libfoo.a` 里会包含 `png.c.o` 以及 `libpng.a` 与其传递依赖 `zlib.a` 中的全部目标文件，`test` 只需要链接 `foo` 一个静态库即可。

### utils.checker 模块

新增了一个公开的工具模块 `utils.checker`，允许用户脚本查询自己是否正在 `xmake check <name>` 中被调用。对那些希望在 `xmake check syntax`、`xmake check clang.tidy` 等场景下行为不同的规则/脚本非常有用。

```lua
import("utils.checker")

if checker.is_running("syntax") then
    -- 当前处于 `xmake check syntax`，可以跳过 codegen
end
```

## 更新日志

### 新特性

* [#7430](https://github.com/xmake-io/xmake/pull/7430): 为 Zig 工具链添加 C 互操作支持
* [#7443](https://github.com/xmake-io/xmake/pull/7443): 新增 `utils.replace` 内置规则
* [#7437](https://github.com/xmake-io/xmake/pull/7437): 内置 Lua 运行时升级到 5.5
* [#7446](https://github.com/xmake-io/xmake/pull/7446): 新增 Fil-C 工具链支持
* [#7489](https://github.com/xmake-io/xmake/pull/7489): vsxmake：为 C# 目标生成 `.csproj`
* [#7491](https://github.com/xmake-io/xmake/pull/7491): 新增 `xrepo info --depgraph`，打印包依赖图
* [#7490](https://github.com/xmake-io/xmake/pull/7490): 支持以 JSON / DOT 格式导出目标依赖图
* [#7518](https://github.com/xmake-io/xmake/pull/7518): 新增 aria2 多线程下载后端
* [#7535](https://github.com/xmake-io/xmake/pull/7535): 新增华为 Ascend C 工具链支持

### 改进

* [#7420](https://github.com/xmake-io/xmake/pull/7420): 改进 zsh 自动补全
* [#7423](https://github.com/xmake-io/xmake/pull/7423): 改进 cl / clang-cl 的 `has_flags` 检测
* [#7424](https://github.com/xmake-io/xmake/pull/7424): 改进代码注释
* [#7439](https://github.com/xmake-io/xmake/pull/7439): Windows 上将 `icx` 切换为 `icx-cc`
* [#7434](https://github.com/xmake-io/xmake/pull/7434): 改进 nix 包配置与源选择
* [#7440](https://github.com/xmake-io/xmake/pull/7440): 改进代码注释
* [#7435](https://github.com/xmake-io/xmake/pull/7435): 改进 C++ 模块的错误信息
* [#7461](https://github.com/xmake-io/xmake/pull/7461): 将 checker 暴露为公开 API
* [#7463](https://github.com/xmake-io/xmake/pull/7463): 升级 C++ 模块测试中的包版本
* [#7465](https://github.com/xmake-io/xmake/pull/7465): 再次升级 C++ 模块测试版本
* [#7467](https://github.com/xmake-io/xmake/pull/7467): 通过 `option.boolean` 解析 `XMAKE_ROOT` / `XMAKE_STATS`
* [#7478](https://github.com/xmake-io/xmake/pull/7478): 改进自定义工具链定义
* [#7485](https://github.com/xmake-io/xmake/pull/7485): 改进 Lua 5.5 下的 `pairs` 行为
* [#7505](https://github.com/xmake-io/xmake/pull/7505): 在 README 中添加 NuGet 包仓库入口
* [#7524](https://github.com/xmake-io/xmake/pull/7524): 新增 `lld-link` 配置支持
* [#7529](https://github.com/xmake-io/xmake/pull/7529): 将 clang PCH 支持拆分为独立模块
* [#7542](https://github.com/xmake-io/xmake/pull/7542): 合并包提供的静态库到目标归档

### Bug 修复

* [#7432](https://github.com/xmake-io/xmake/pull/7432): 修复 `set_kind("test")` 处理
* [#7433](https://github.com/xmake-io/xmake/pull/7433): 修复 xpack AppImage 包命名
* [#7445](https://github.com/xmake-io/xmake/pull/7445): 修复包本地缓存目录
* [#7455](https://github.com/xmake-io/xmake/pull/7455): 避免 `xcode.application` 重复插入 bundle rpath
* [#7451](https://github.com/xmake-io/xmake/pull/7451): 修正 `xcode.application` 中 iOS 应用的 framework rpath
* [#7449](https://github.com/xmake-io/xmake/pull/7449): 避免私有依赖的 flags 泄漏到重建的 C++ 模块 BMI
* [#7470](https://github.com/xmake-io/xmake/pull/7470): 生成的 CMakeLists 使用 `target_link_libraries` 链接 object 库
* [#7477](https://github.com/xmake-io/xmake/pull/7477): 修复 clang 使用 `c++_static` 时的问题
* [#7483](https://github.com/xmake-io/xmake/pull/7483): 修复 MinGW 下的 syslink 处理
* [#7493](https://github.com/xmake-io/xmake/pull/7493): 修复 Qt 交叉编译
* [#7495](https://github.com/xmake-io/xmake/pull/7495): 修复 "cannot find known tool script for `ar.cmd`"
* [#7500](https://github.com/xmake-io/xmake/pull/7500): 修复 Linux 内核 6.12+ 上的内核模块 `insmod` 失败
* [#7502](https://github.com/xmake-io/xmake/pull/7502): 修复 Rust 构建
* [#7501](https://github.com/xmake-io/xmake/pull/7501): 修复 Linux 内核模块的中间文件名
* [#7503](https://github.com/xmake-io/xmake/pull/7503): 修复 xpack deb / srpm 打包
* [#7512](https://github.com/xmake-io/xmake/pull/7512): Meson 后端正确处理 Windows 交叉编译前缀与安装路径
* [#7516](https://github.com/xmake-io/xmake/pull/7516): 恢复缺失的 `path.isdir` API
* [#7520](https://github.com/xmake-io/xmake/pull/7520): 修复检测 flags 时的 cl 异常
* [#7523](https://github.com/xmake-io/xmake/pull/7523): 修复 temp 路径包含空格时的 MSVC / Intel snippet 检测
* [#7525](https://github.com/xmake-io/xmake/pull/7525): 修复 Zig CC 的 stdlib 与 LTO 参数
* [#7527](https://github.com/xmake-io/xmake/pull/7527): 生成 CMakeLists 时更准确地处理编译器 / 链接器 frontend 变体
* [#7533](https://github.com/xmake-io/xmake/pull/7533): `find_mingw` 支持 `mingw/current/bin` 这类路径
* [#7538](https://github.com/xmake-io/xmake/pull/7538): 对齐 ascendc 参数与 Bisheng 编译器用户手册
* [#7540](https://github.com/xmake-io/xmake/pull/7540): `xmake show -l targets` 现在列出所有 target，无论是否 `set_default`
* [#7541](https://github.com/xmake-io/xmake/pull/7541): 修复 Qt 交叉编译时 `find_qt` 缓存与依赖配置被覆盖
* [#7545](https://github.com/xmake-io/xmake/pull/7545): 在 `add_moduledirs` 中调用 `path.is_absolute` 前先展开内置变量
