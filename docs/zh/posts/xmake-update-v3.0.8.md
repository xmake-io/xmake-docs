---
title: Xmake v3.0.8 发布，C# 语言支持，自定义模板与 WASI 运行
tags: [xmake, csharp, dotnet, pinvoke, wasi, nnd, templates]
date: 2026-03-24
author: Ruki
outline: deep
---

在此版本中，我们新增了 C# 语言和 dotnet 工具链支持，并支持了 C# 与 C/C++ 通过 P/Invoke 进行互操作。同时，我们引入了自定义工程模板功能，支持 `xmake create --list` 列出模板和远程模板分发。

此外，我们还新增了 `build.release.strip` 策略、`winos.file_signature` 函数、WASI 目标运行支持、nnd 调试器支持以及 tarxz 打包格式。

## 新特性介绍

### C# 语言和 dotnet 工具链支持

我们新增了对 C# 语言的完整支持，集成了 dotnet 工具链，可以直接在 xmake 中构建 C# 项目，包括控制台应用、共享库、多库依赖和 NuGet 包集成。

#### 基本控制台应用

```lua
add_rules("mode.debug", "mode.release")

target("hello")
    set_kind("binary")
    add_files("src/Program.cs")
```

#### C# 共享库与依赖

支持构建 C# 共享库，并在多个目标之间建立依赖关系：

```lua
target("mylib")
    set_kind("shared")
    add_files("src/lib/*.cs")

target("app")
    set_kind("binary")
    add_deps("mylib")
    add_files("src/app/*.cs")
```

也支持多个库之间的级联依赖：

```lua
target("libalpha")
    set_kind("shared")
    add_files("src/libalpha/*.cs")

target("libbeta")
    set_kind("shared")
    add_deps("libalpha")
    add_files("src/libbeta/*.cs")

target("sample")
    set_kind("binary")
    add_deps("libbeta")
    add_files("src/sample/*.cs")
```

#### NuGet 包集成

可以直接通过 `add_requires` 使用 NuGet 包：

```lua
add_requires("nuget::Humanizer.Core 2.14.1")

target("app")
    set_kind("binary")
    add_files("src/Program.cs")
    add_packages("nuget::Humanizer.Core")
```

#### ASP.NET Core Web 项目

支持通过 `csharp.sdk` 设置 SDK 类型，构建 ASP.NET Core Web 项目：

```lua
target("webapp")
    set_kind("binary")
    add_values("csharp.sdk", "Microsoft.NET.Sdk.Web")
    add_files("src/Program.cs")
```

#### 丰富的配置选项

C# 规则支持通过 `set_values()` 配置大量 .NET 项目属性，例如：

```lua
target("app")
    set_kind("binary")
    add_files("src/*.cs")
    set_values("csharp.target_framework", "net8.0")
    set_values("csharp.lang_version", "12")
    set_values("csharp.nullable", "enable")
    set_values("csharp.allow_unsafe_blocks", true)
    set_values("csharp.publish_single_file", true)
    set_values("csharp.publish_trimmed", true)
```

### C# 与 C/C++ 互操作 (P/Invoke)

支持了 C# 通过 P/Invoke 调用 C/C++ 原生库，实现跨语言互操作。xmake 会自动处理原生共享库的搜索路径，无需手动配置 `LD_LIBRARY_PATH` 等环境变量。

#### xmake.lua 配置

```lua
add_rules("mode.debug", "mode.release")

-- 编译 C 原生库
target("mathlib")
    set_kind("shared")
    add_files("src/native/*.c")

-- C# 应用，依赖原生库
target("app")
    set_kind("binary")
    add_deps("mathlib")
    add_files("src/app/*.cs")
```

#### C 原生库代码 (mathlib.c)

```c
#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT __attribute__((visibility("default")))
#endif

EXPORT int add(int a, int b) {
    return a + b;
}

EXPORT int multiply(int a, int b) {
    return a * b;
}
```

#### C# 调用代码 (Program.cs)

```csharp
using System.Runtime.InteropServices;

int sum = NativeMethods.add(3, 4);
int product = NativeMethods.multiply(5, 6);
Console.WriteLine($"add(3,4)={sum}");
Console.WriteLine($"multiply(5,6)={product}");

internal static class NativeMethods {
    private const string NativeLib = "mathlib";

    [DllImport(NativeLib)]
    internal static extern int add(int a, int b);

    [DllImport(NativeLib)]
    internal static extern int multiply(int a, int b);
}
```

### 自定义模板

新增了自定义模板支持。模板按优先级从以下位置搜索：

1. **仓库模板** - `<global-repo>/templates` 目录
2. **全局模板** - `<globaldir>/templates` 目录

模板以 `<rootdir>/<language>/<template_id>/xmake.lua` 的结构组织，模板文件中可使用 `${TARGET_NAME}` 等变量，在创建工程时自动替换。

```bash
# 列出所有可用模板（包含仓库、全局和内置模板）
$ xmake create --list

# 按语言过滤模板列表
$ xmake create --list -l c++

# 使用指定模板创建工程
$ xmake create -t mytemplate hello
```

模板还支持通过远程仓库分发，用户可以将自定义模板上传到仓库，其他人通过添加仓库即可使用这些模板。

### build.release.strip 策略

新增了 `build.release.strip` 策略（默认启用），在 `mode.release` 和 `mode.releasedbg` 模式下自动裁剪二进制文件中的调试符号，减小最终产物的体积。

```lua
-- 默认已启用，如需关闭可以设置为 false
set_policy("build.release.strip", false)
```

当该策略启用且目标未显式设置 `set_strip()` 时，会自动设置 `set_strip("all")`。

### WASI 目标运行支持

新增了对 WASI 目标的运行支持。通过 WASI SDK 工具链编译后，可以使用 `xmake run` 直接运行 WASI 程序：

```bash
$ xmake f --toolchain=wasi --sdk=/path/to/wasi-sdk
$ xmake
$ xmake run
```

### nnd 调试器支持

新增了对 [nnd](https://github.com/nicbarker/nnd) 调试器的支持，这是一个轻量级的 Linux 调试器。可以通过以下方式使用：

```bash
$ xmake f --debugger=nnd
$ xmake run -d hello
```

### tarxz 打包格式

新增了 `tarxz` 和 `srctarxz` 打包格式，可以通过 xpack 将程序打包为 `.tar.xz` 格式，提供更好的压缩比：

```lua
xpack("mypkg")
    set_formats("tarxz")
    -- ...
```

### winos.file_signature 函数

新增了 `winos.file_signature` 函数，用于获取 Windows 下文件的数字签名信息。返回一个包含签名状态的 table：

```lua
local info = winos.file_signature("C:\\Windows\\System32\\notepad.exe")
if info then
    print(info.is_signed)    -- 文件是否已签名
    print(info.is_trusted)   -- 签名是否受信任
    print(info.signer_name)  -- 签名者名称，如 "Microsoft Corporation"
end
```

## 更新日志

### 新特性

* [#7398](https://github.com/xmake-io/xmake/pull/7398): 添加 C# 语言和 dotnet 工具链支持
* [#7410](https://github.com/xmake-io/xmake/pull/7410): 添加 C# 和 C/C++ 通过 P/Invoke 互操作支持
* [#7360](https://github.com/xmake-io/xmake/pull/7360): 支持自定义模板
* [#7367](https://github.com/xmake-io/xmake/pull/7367): 添加 `xmake create --list` 和远程模板分发
* [#7313](https://github.com/xmake-io/xmake/pull/7313): 添加 `build.release.strip` 策略
* [#7333](https://github.com/xmake-io/xmake/pull/7333): 添加 `winos.file_signature` 函数
* [#7336](https://github.com/xmake-io/xmake/pull/7336): 添加 WASI 目标运行支持
* [#7346](https://github.com/xmake-io/xmake/pull/7346): 添加 nnd 调试器支持
* [#7366](https://github.com/xmake-io/xmake/pull/7366): 添加 tarxz 打包格式

### 改进

* [#7309](https://github.com/xmake-io/xmake/pull/7309): 保留包源码
* [#7310](https://github.com/xmake-io/xmake/pull/7310): 改进检测提示
* [#7311](https://github.com/xmake-io/xmake/pull/7311): 改进 Xcode 工具链
* [#7312](https://github.com/xmake-io/xmake/pull/7312): 改进 binutils 以支持 wasm
* [#7320](https://github.com/xmake-io/xmake/pull/7320): 添加 haiku ci
* [#7329](https://github.com/xmake-io/xmake/pull/7329): 改进 macapp 的 qt deploy
* [#7349](https://github.com/xmake-io/xmake/pull/7349): 为 C++ 模块在 clang/gcc 上裁剪 embed-dir
* [#7368](https://github.com/xmake-io/xmake/pull/7368): 将模板移动到仓库
* [#7383](https://github.com/xmake-io/xmake/pull/7383): 拆分 zig 工具链为 zig/zigcc
* [#7384](https://github.com/xmake-io/xmake/pull/7384): 改进 find_hdk
* [#7387](https://github.com/xmake-io/xmake/pull/7387): 在进度中显示目标名称
* [#7391](https://github.com/xmake-io/xmake/pull/7391): 改进通过 vcpkg features 查找包
* [#7392](https://github.com/xmake-io/xmake/pull/7392): 修复 zig 共享库
* [#7396](https://github.com/xmake-io/xmake/pull/7396): 改进 vcpkg
* [#7399](https://github.com/xmake-io/xmake/pull/7399): 将格式化扩展到 C++ 模块
* [#7409](https://github.com/xmake-io/xmake/pull/7409): 改进 Windows 上的 ldc

### Bug 修复

* [#7299](https://github.com/xmake-io/xmake/pull/7299): 修复 vcpkg 的依赖处理
* [#7316](https://github.com/xmake-io/xmake/pull/7316): 修复 components 拼写错误
* [#7318](https://github.com/xmake-io/xmake/pull/7318): 更新 tbox 修复 tolower/toupper
* [#7339](https://github.com/xmake-io/xmake/pull/7339): 更新 tbox 修复 win7 上启动进程问题
* [#7344](https://github.com/xmake-io/xmake/pull/7344): 修复 swig jar 包模块
* [#7345](https://github.com/xmake-io/xmake/pull/7345): 修复检测 clang 信息
* [#7341](https://github.com/xmake-io/xmake/pull/7341): 修复 WASM QT 6.9
* [#7356](https://github.com/xmake-io/xmake/pull/7356): 修复 issue #7354
* [#7371](https://github.com/xmake-io/xmake/pull/7371): 修复测试 verbose 输出
* [#7386](https://github.com/xmake-io/xmake/pull/7386): 修复安装脚本与 coreutils 9.10 的不兼容
* [#7393](https://github.com/xmake-io/xmake/pull/7393): 修复构建目标验证
