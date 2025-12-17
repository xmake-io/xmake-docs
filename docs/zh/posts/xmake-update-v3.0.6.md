---
title: Xmake v3.0.6 预览版，原生 Android 应用、Flang、CUDA 13、Qt 打包
tags: [xmake, android, flang, cuda, qt, packaging, msvc, binutils]
date: 2025-12-17
author: Ruki
outline: deep
---

## 新特性介绍

### Android 原生应用构建支持

新版本对 Android 原生应用的构建支持进行了进一步改进。我们现在可以在 `android.native_app` 规则中配置更多参数，包括 `android_sdk_version`, `android_manifest`, `android_res`, `keystore` 等。

此外，对于需要自定义入口和事件循环的场景（例如游戏引擎集成），我们支持通过设置 `native_app_glue = false` 来禁用默认的 `android_native_app_glue` 库。

```lua
add_rules("mode.debug", "mode.release")

add_requires("raylib 5.5.0")

target("raydemo_custom_glue")
    set_kind("binary")
    set_languages("c++17")
    add_files("src/main.cpp", "src/android_native_app_glue.c")
    add_syslinks("log")
    add_packages("raylib")
    add_rules("android.native_app", {
        android_sdk_version = "35",
        android_manifest = "android/AndroidManifest.xml",
        android_res = "android/res",
        keystore = "android/debug.jks",
        keystore_pass = "123456",
        package_name = "com.raylib.custom_glue",
        native_app_glue = false, -- 禁用默认 glue
        logcat_filters = {"raydemo_custom_glue", "raylib"}
    })
```

### bin2obj 规则

新增的 `utils.bin2obj` 规则相比 `utils.bin2c` 具有极快的构建速度。因为它跳过了 C 代码生成和编译步骤，直接生成对象文件（COFF, ELF, Mach-O）参与链接。

**性能对比 (120MB 文件):**
- **bin2obj**: ~1.8s
- **bin2c**: ~354s

它支持多种架构（x86, ARM, RISC-V 等）和格式（Windows COFF, Linux/Android ELF, macOS/iOS Mach-O）。

**基本用法**

```lua
target("myapp")
    set_kind("binary")
    add_rules("utils.bin2obj", {extensions = {".bin", ".ico"}})
    add_files("src/*.c")
    -- 嵌入 data.bin，并确保以零结尾
    add_files("assets/data.bin", {zeroend = true})
```

**在 C/C++ 中访问数据**

符号名称会根据文件名自动生成（例如 `_binary_<filename>_start` 和 `_binary_<filename>_end`）。

```c
#include <stdio.h>
#include <stdint.h>

extern const uint8_t _binary_data_bin_start[];
extern const uint8_t _binary_data_bin_end[];

int main() {
    // 计算大小
    const uint32_t size = (uint32_t)(_binary_data_bin_end - _binary_data_bin_start);
    
    // 访问数据
    printf("Data size: %u bytes\n", size);
    for (uint32_t i = 0; i < size; i++) {
        printf("%02x ", _binary_data_bin_start[i]);
    }
    return 0;
}
```

此外，`glsl2spv` 和 `hlsl2spv` 规则也新增了对 `bin2obj` 的支持，可以直接将编译后的 SPIR-V 文件作为对象文件嵌入。

```lua
target("test")
    set_kind("binary")
    add_rules("utils.glsl2spv", {bin2obj = true})
    add_files("src/*.c")
    add_files("src/*.vert", "src/*.frag")
```

### Flang 工具链支持

Xmake 现在支持 LLVM Flang 编译器，可以更方便地构建 Fortran 项目。通常情况下，Xmake 会自动检测并使用系统中可用的 Flang 编译器。

你也可以手动指定使用 Flang 工具链：

```bash
$ xmake f --toolchain=flang
$ xmake
```

或者在 `xmake.lua` 中配置：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.f90") 
```

### Qt Pack 与 AppImage/dmg 打包

XPack 打包模块现在支持生成 Qt 部署包，以及 Linux 下的 AppImage 和 macOS 下的 dmg 格式。这使得分发跨平台 GUI 应用变得更加简单。

例如，配置一个 Qt Widget 应用的打包：

```lua
includes("@builtin/xpack")

target("qtapp")
    add_rules("qt.widgetapp")
    add_files("src/*.cpp") 
    -- ... 其他配置

xpack("qtapp")
    set_formats("nsis", "dmg", "appimage", "zip")
    set_title("Qt Widget App")
    add_targets("qtapp")
    
    -- 根据格式设置图标
    on_load(function (package)
        local scriptdir = os.scriptdir()
        if package:format() == "appimage" then
            package:set("iconfile", path.join(scriptdir, "src/assets/xmake.png"))
        else
            package:set("iconfile", path.join(scriptdir, "src/assets/xmake.ico"))
        end
    end)
```

执行打包命令：

```bash
$ xmake pack
```

### 快速语法检查

新增 `xmake check syntax` 命令，用于快速检测工程源代码的语法错误。

这通常用于在 CI 流程中，快速检测代码的语法合法性，而不需要进行完整的编译链接过程，因此速度非常快。

它的内部原理是：xmake 会向编译器传递 `-fsyntax-only` (GCC/Clang) 或 `/Zs` (MSVC) 等语法检测标志。

这使得编译器仅进行语法分析，不生成目标文件，也不进行链接操作，从而极大地提升了检测速度。

```bash
$ xmake check syntax
```

如果有语法错误，它会报告具体的文件和行号。

### MSVC C++ 动态调试

我们新增了对 MSVC 的 C++ 动态调试支持（需要 MSVC 工具集 14.44+，仅支持 x64）。

它与 LTCG/PGO/OPT-ICF 不兼容。

```lua
set_policy("build.c++.dynamic_debugging", true)
```

### 二进制工具库

我们新增了 `core.base.binutils` 模块以及 `utils.binary` 扩展模块，用于处理二进制文件。

它们提供了 `bin2c`, `bin2obj`, `readsyms`, `deplibs`, `extractlib` 等功能接口，可用于从二进制文件生成代码、读取符号、获取依赖库以及解压静态库等。

```lua
import("utils.binary.deplibs")
import("utils.binary.readsyms")
import("utils.binary.extractlib")

-- 获取依赖库
local deps = deplibs("/path/to/bin")

-- 读取符号
local syms = readsyms("/path/to/obj")

-- 解压静态库
extractlib("/path/to/lib.a", "/path/to/outputdir")
```

此外，我们还改进了依赖库解析，静态库合并用到的对象文件抽取，以及符号导出功能。

---

## 更新日志

### 新特性

* [#7141](https://github.com/xmake-io/xmake/pull/7141)：支持在 Android 禁用 native app glue
* [#7139](https://github.com/xmake-io/xmake/pull/7139)：新增 Android 原生应用构建支持
* [#7127](https://github.com/xmake-io/xmake/pull/7127)：binutils 新增 deplibs 支持
* [#7120](https://github.com/xmake-io/xmake/pull/7120)：binutils 新增 extractlib 支持
* [#7106](https://github.com/xmake-io/xmake/pull/7106)：MSVC 新增 `/std:c++23preview` 支持
* [#7105](https://github.com/xmake-io/xmake/pull/7105)：为 glsl/hlsl2spv 新增 `bin2obj` 支持
* [#7103](https://github.com/xmake-io/xmake/pull/7103)：新增 `bin2obj` 规则（快于 `bin2c`）
* [#7096](https://github.com/xmake-io/xmake/pull/7096)：新增 Flang 工具链支持
* [#7094](https://github.com/xmake-io/xmake/pull/7094)：新增 `xmake check syntax` 支持
* [#7091](https://github.com/xmake-io/xmake/pull/7091)：MSVC 新增动态调试支持
* [#7083](https://github.com/xmake-io/xmake/pull/7083)：新增对 CUDA 11~13 的支持
* [#7071](https://github.com/xmake-io/xmake/pull/7071)：新增 Qt pack 支持
* [#7064](https://github.com/xmake-io/xmake/pull/7064)：新增 Linux 应用打包的 AppImage xpack 格式
* [#7062](https://github.com/xmake-io/xmake/pull/7062)：新增 macOS 应用打包的 dmg xpack 格式

### 改进

* [#7136](https://github.com/xmake-io/xmake/pull/7136)：改进 clang-cl 依赖文件生成
* [#7135](https://github.com/xmake-io/xmake/pull/7135)：`xrepo env` 增加 session ID
* [#7109](https://github.com/xmake-io/xmake/pull/7109)：binutils 支持从二进制文件读取符号
* [#7102](https://github.com/xmake-io/xmake/pull/7102)：改进 bin2c 规则
* [#7098](https://github.com/xmake-io/xmake/pull/7098)：重构并改进 Golang 支持
* [#7095](https://github.com/xmake-io/xmake/pull/7095)：将 target/package/toolchain:memcache 标记为 public
* [#7093](https://github.com/xmake-io/xmake/pull/7093)：改进 mirror 仓库 URL
* [#7088](https://github.com/xmake-io/xmake/pull/7088)：改进 C++/ObjC 规则
* [#7087](https://github.com/xmake-io/xmake/pull/7087)：为策略 `package.download.http_headers` 添加类型约束
* [#7069](https://github.com/xmake-io/xmake/pull/7069)：保存 LLVM 工具链的 Qt 规则
* [#7061](https://github.com/xmake-io/xmake/pull/7061)：更新 CI 配置
* [#7039](https://github.com/xmake-io/xmake/pull/7039)：更新 macOS CI

### Bug 修复

* [#7132](https://github.com/xmake-io/xmake/pull/7132)：修复启用 ASan 时的 clang-cl 工具链问题
* [#7125](https://github.com/xmake-io/xmake/pull/7125)：修复 cosmocc CI
* [#7124](https://github.com/xmake-io/xmake/pull/7124)：修复 Clang 工具链的默认 MSVC 运行库
* [#7112](https://github.com/xmake-io/xmake/pull/7112)：修复 Windows 上的目录切换
* [#7104](https://github.com/xmake-io/xmake/pull/7104)：修复项目生成器的准备阶段问题
* [#7092](https://github.com/xmake-io/xmake/pull/7092)：修复 Solaris 构建
* [#7086](https://github.com/xmake-io/xmake/pull/7086)：修复 Qt QML 规则中的 targetdir 设置
* [#7085](https://github.com/xmake-io/xmake/pull/7085)：修复针对 Clang 工具链的 CMake 标志
* [#7084](https://github.com/xmake-io/xmake/pull/7084)：修复 pacman 的 find_package
* [#7082](https://github.com/xmake-io/xmake/pull/7082)：修复 Clang CUDA 标志检查
* [#7081](https://github.com/xmake-io/xmake/pull/7081)：修复 `get_headerunit_key`
* [#7074](https://github.com/xmake-io/xmake/pull/7074)：修复 libc++ 无法找到 std 模块问题
* [#7067](https://github.com/xmake-io/xmake/pull/7067)：修复跨工具链的 get_stdmodules
