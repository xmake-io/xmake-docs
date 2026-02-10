---
title: Xmake v3.0.7 发布，包方案支持，Wasm 浏览器运行与 UTF-8 模块
tags: [xmake, verilator, alpine, nix, qt, nim, zig, wasm, utf8]
date: 2026-02-07
author: Ruki
outline: deep
---

在此版本中，我们新增了包方案 (Package Schemes) 支持，提供了更加灵活的包安装和回退机制。同时，我们改进了 Nix 包管理器支持，优化了 Verilator 构建，并新增了对 Qt SDK 动态 mkspec 的选择支持。

此外，我们还支持了在浏览器中运行 Wasm 程序，支持从标准输入 (stdin) 读取脚本运行，并引入了 `cli.iconv`, `utf8` 和 `os.access` 等多个新模块和函数。

## 新特性介绍

### 包方案 (Package Schemes)

`scheme` 特性主要用于提供多种安装方案，每种方案可能使用不同的 url、version 和 install 逻辑。每当一种方案安装失败时，会自动尝试下一种安装方案，从而提高安装成功率。尤其是在二进制包和源码安装同时存在时，非常有用。

#### `add_schemes`

定义包的可用方案列表。顺序很重要：如果没有显式选择，第一个方案是默认方案。

```lua
package("mypkg")
    add_schemes("binary", "source")
```

#### `package:scheme(name)`

按名称检索方案实例。这用于配置特定于方案的设置（URL、版本、哈希等），通常在 `on_source` 或 `on_load` 中使用。

```lua
on_source(function (package)
    -- 配置 'binary' 方案
    local binary = package:scheme("binary")
    binary:add("urls", "https://example.com/mypkg-v$(version)-bin.zip")
    binary:add("versions", "1.0.0", "<sha256_of_binary>")

    -- 配置 'source' 方案
    local source = package:scheme("source")
    source:add("urls", "https://example.com/mypkg-v$(version)-src.tar.gz")
    source:add("versions", "1.0.0", "<sha256_of_source>")
end)
```

#### `package:current_scheme()`

检索当前选定的方案。这在 `on_install` 中用于确定要执行的构建逻辑。

```lua
on_install(function (package)
    local scheme = package:current_scheme()
    if scheme and scheme:name() == "binary" then
        -- 预编译二进制文件的安装逻辑
        os.cp("*", package:installdir("bin"))
    else
        -- 源码构建逻辑
        import("package.tools.cmake").install(package)
    end
end)
```

#### Scheme 对象方法

`package:scheme("name")` 返回的 scheme 对象支持以下方法：

-   `scheme:add(name, ...)`: 向配置添加值（例如，`urls`, `versions`, `patches`, `resources`）。
-   `scheme:set(name, ...)`: 设置配置的值。
-   `scheme:name()`: 获取方案名称。
-   `scheme:urls()`: 获取此方案的 URL 列表。
-   `scheme:version()`: 获取版本对象。
-   `scheme:version_str()`: 获取版本字符串。
-   `scheme:sourcehash(url_alias)`: 获取当前版本/URL 的 SHA256 哈希。
-   `scheme:revision(url_alias)`: 获取 git 修订/提交。
-   `scheme:patches()`: 获取当前版本的补丁。
-   `scheme:resources()`: 获取当前版本的资源。

#### 定义带方案的包

这个例子中，优先尝试 `binary` 二进制安装方案，如果不存在匹配的二进制包，或者安装后运行不起来，则回退到 `source` 源码安装。

```lua
package("ninja")
    set_homepage("https://ninja-build.org/")
    set_description("Small build system for use with gyp or CMake.")

    -- 定义可用方案
    add_schemes("binary", "source")

    on_source(function (package)
        -- 'binary' 方案配置
        local binary = package:scheme("binary")
        if is_host("macosx") then
            binary:add("urls", "https://github.com/ninja-build/ninja/releases/download/v$(version)/ninja-mac.zip")
            binary:add("versions", "1.13.1", "da7797794153629aca5570ef7c813342d0be214ba84632af886856e8f0063dd9")
        elseif is_host("linux") then
            binary:add("urls", "https://github.com/ninja-build/ninja/releases/download/v$(version)/ninja-linux.zip")
            binary:add("versions", "1.13.1", "0830252db77884957a1a4b87b05a1e2d9b5f658b8367f82999a941884cbe0238")
        elseif is_host("windows") then
            binary:add("urls", "https://github.com/ninja-build/ninja/releases/download/v$(version)/ninja-win.zip")
            binary:add("versions", "1.13.1", "26a40fa8595694dec2fad4911e62d29e10525d2133c9a4230b66397774ae25bf")
        end

        -- 'source' 方案配置
        local source = package:scheme("source")
        source:add("urls", "https://github.com/ninja-build/ninja/archive/refs/tags/v$(version).tar.gz")
        source:add("versions", "1.13.1",  "f0055ad0369bf2e372955ba55128d000cfcc21777057806015b45e4accbebf23")
    end)

    on_install("@linux", "@windows", "@msys", "@cygwin", "@macosx", function (package)
        local scheme = package:current_scheme()
        if scheme and scheme:name() == "binary" then
            -- 直接安装二进制文件
            os.cp(is_host("windows") and "ninja.exe" or "ninja", package:installdir("bin"))
        else
            -- 从源码构建
            import("package.tools.xmake").install(package)
        end
    end)
```

#### 方案选择和回退

Xmake 根据 `add_schemes` 中定义的顺序自动管理方案选择。

1.  **默认方案**：`add_schemes` 中列出的第一个方案是默认方案。Xmake 将首先尝试使用此方案安装包。
2.  **回退**：如果使用当前方案安装失败，Xmake 将自动回退到列表中的下一个方案并重试安装。

例如，对于 `add_schemes("binary", "source")`：
1.  Xmake 尝试安装 "binary" 方案（下载预编译二进制文件）。
2.  如果二进制文件下载或安装失败，它会自动切换到 "source" 方案（从源码构建）。

这提供了一个健壮的安装过程，用户可以在可用时获得快速的二进制安装，并在需要时获得可靠的源码构建回退。

```console
note: install or modify (m) these packages (pass -y to skip confirm)?
  -> ninja 1.13.1 [host]
please input: y (y/n/m)

  => download https://github.com/ninja-build/ninja/releases/download/v1.13.1/ninja-win.zip .. ok
  => install ninja 1.13.1 (binary) .. failed
  => download https://github.com/ninja-build/ninja/archive/refs/tags/v1.13.1.tar.gz .. ok
  => install ninja 1.13.1 (source) .. ok
```

#### 每个方案的自定义安装脚本

除了在全局 `on_install` 中检查 `package:current_scheme()` 之外，您还可以使用 `scheme:set("install", ...)` 为每个方案定义特定的安装脚本。这使得逻辑更加封装。

```lua
on_source(function (package)
    local binary = package:scheme("binary")
    binary:set("install", function (package)
        -- 二进制方案的自定义安装逻辑
        os.cp(is_host("windows") and "ninja.exe" or "ninja", package:installdir("bin"))
    end)
end)
```

#### 预编译二进制包

下载和安装预编译二进制包的内部逻辑也已重构为使用 scheme 机制。

当 Xmake 检测到可用的预编译二进制包（例如来自官方仓库）时，它会在内部为它们创建一个 scheme 并优先考虑它。

### 新模块和函数

我们引入了几个新的模块和函数来增强脚本能力：

#### cli.iconv

用于字符编码转换的新模块。它支持在各种编码（如 UTF-8、GBK、UTF-16 等）之间转换文件。

```lua
import("cli.iconv")

-- 将文件从 GBK 转换为 UTF-8
iconv.convert("src.txt", "dst.txt", {from = "gbk", to = "utf8"})
```

你也可以从命令行使用它：

```bash
$ xmake l cli.iconv --from=gbk --to=utf8 src.txt dst.txt
```

#### os.access

新增了 `os.access` 函数来检查文件访问权限，类似于 C 语言的 `access` 函数。

```lua
if os.access("file.txt", "w") then
    print("file is writable")
end
```

#### utf8

新增了 `utf8` 模块，用于处理 UTF-8 字符串的各种操作，提供了更加便捷的编码处理接口。
该模块是内置模块，无需 `import` 即可在描述域和脚本域直接使用。

它提供了与 Lua 5.3+ `utf8` 模块兼容的接口，包括：

- `utf8.len(s [, i [, j [, lax]]])`
- `utf8.char(...)`
- `utf8.codepoint(s [, i [, j]])`
- `utf8.offset(s, n [, i])`
- `utf8.codes(s [, lax])`
- `utf8.sub(s, i [, j])`
- `utf8.reverse(s)`
- `utf8.lastof(s, pattern [, plain])`
- `utf8.find(s, pattern [, init [, plain]])`
- `utf8.width(s)`
- `utf8.byte(s [, i [, j]])`

使用示例：

```lua
local s = "你好 xmake"
print(utf8.len(s)) -- 8
print(utf8.sub(s, 1, 2)) -- 你好
```

### 浏览器中运行 Wasm

`xmake run` 现在支持直接在浏览器中运行 WebAssembly (Wasm) 目标。这对于基于 Emscripten 的项目特别有用。

如果 `emrun` 可用，Xmake 将使用它。否则，它会回退到使用 Python HTTP 服务器来服务目录。

你只需执行以下命令即可运行 Wasm 应用程序：

```bash
$ xmake run
```

然后，根据输出提示，在浏览器中访问 `http://localhost:8000` 即可运行 Wasm 程序。

### Xmake Lua 从标准输入运行

`xmake lua` 命令现在支持通过标准输入（stdin）读取并运行脚本，这使得我们可以通过管道将脚本内容传递给 xmake 运行。

```bash
$ echo 'print("hello xmake")' | xmake lua --stdin
hello xmake
```

或者：

```bash
$ cat script.lua | xmake lua --stdin
```

### 测试输出文件匹配

`add_tests` 配置现在支持通过 `pass_output_files` 和 `fail_output_files` 来匹配测试输出到文件内容。这对于测试输出较多且复杂的场景非常有用。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_tests("test1", {
        runargs = {"arg1"},
        pass_output_files = "test1.out"
    })
```

`test1.out` 文件内容即为预期的标准输出内容。如果实际输出与文件内容匹配，则测试通过。

### install/uninstall 支持自定义安装目录

`xmake install/uninstall` 命令新增了 `--bindir`, `--libdir` 和 `--includedir` 参数，允许用户根据需要自定义二进制文件、库文件和头文件的安装目录。

我们不仅支持绝对路径，还支持相对于前缀目录的相对路径，例如：`--libdir=lib64`。

这对于打包系统（如 Homebrew, ArchLinux PKGBUILD）在构建包时，需要将特定文件安装到系统指定目录非常有用。

```bash
$ xmake install --bindir=/usr/bin --libdir=/usr/lib64 --includedir=/usr/include
```

### 多远程构建主机配置

远程构建配置现在支持多个主机，允许您轻松切换不同的远程构建服务器，而无需手动编辑配置文件。

您可以在 `client.conf` 文件中配置多个主机：

```lua
remote_build = {
    hosts = {
        {
            name = "local",
            connect = "127.0.0.1:9691",
            token = "ab9dcb6fe6ddd9ec93338361f7e2e320"
        },
        {
            name = "windows",
            connect = "10.5.138.247:9691",
            token = "0e052f8c7153a6111d5a418e514020ee"
        }
    }
}
```

然后可以使用以下命令连接到指定主机：

```bash
# 连接到第一个主机（local）
xmake service --connect

# 通过名称连接到指定主机
xmake service --connect --host=windows

# 连接到指定 IP 地址
xmake service --connect --host=10.5.138.247
xmake service --connect --host=10.5.138.247:9691
```

这使得管理多个远程构建环境并在需要时切换它们变得更加容易。

### 改进 Windows 运行程序错误提示

改进了 Windows 程序执行时，DLL 缺失的错误信息。现在会自动显示缺少的 DLL 名称，并弹窗提示错误。

我们还可以通过 `set_policy("run.windows_error_dialog", true)` 策略来显式开启/关闭错误弹窗提示。

```lua
set_policy("run.windows_error_dialog", true)
```

错误提示示例：

```bash
PS > xmake r
[ 42%]: linking.release foo.dll 
error: execv(build\windows\x64\release\test_foo_dll_presence.exe ) failed(-1073741515), system error 0xC0000135 (STATUS_DLL_NOT_FOUND). 
The application failed to start because the following DLLs were not found: 
  - foo.dll 
Please check your PATH environment variable or copy the missing DLLs to the executable directory.
```


### os.isexec 和 os.shell 改进

我们还改进了 `os.isexec` 和 `os.shell` 的内部实现，提供了更加准确的检测。

对于 `os.isexec`，在 Windows 上现在会更加准确地根据文件扩展名（`PATHEXT`）以及文件头（PE, Shebang 等）来判断文件是否可执行。

而对于 `os.shell`，我们改进了其检测机制，例如通过检测父进程来获取更加准确的 Shell 环境。

### Nix 包管理器集成

在这个版本中，我们显著改进了与 Nix 包管理器的集成。我们添加了对语义化版本控制（Semantic Versioning）的支持，并改进了版本选择机制。

以前，Xmake 的 Nix 集成在版本控制能力上有所欠缺。通过此次更新，我们利用 `core.base.semver` 模块来更准确地处理版本比较。

我们还引入了缓存机制来加速包的查找。Xmake 现在利用全局缓存和内存缓存来存储包的 derivation 信息。

这确保了对相同 Nix store 路径的重复查找是瞬时的，从而显著提高了包含大量 Nix 依赖项的项目的配置速度。

### Qt SDK 动态 mkspec 选择

针对 Qt SDK，我们改进了 mkspec 的选择机制。现在 Xmake 可以根据当前的编译平台和 Qt SDK 版本，自动动态选择最合适的 mkspec 配置，而无需用户手动指定。这极大地简化了跨平台 Qt 项目的配置工作。

### Nim 语言支持改进

我们还对 Nim 语言支持进行了改进。新增了对 Nim 源文件的依赖文件生成支持，这使得 Nim 项目的增量编译更加准确。

此外，我们还增强了 Nim 对动态库（Shared Libraries）和 RPATH 的支持，改进了跨平台构建体验。

## 更新日志

### 新特性

* [#7178](https://github.com/xmake-io/xmake/pull/7178): 将 Verilator 构建文件解析从 cmake to json 格式
* [#7186](https://github.com/xmake-io/xmake/pull/7186): 添加 alpine ci
* [#7187](https://github.com/xmake-io/xmake/pull/7187): 添加 CUDA 架构后缀支持
* [#7190](https://github.com/xmake-io/xmake/pull/7190): Nix 包管理器：添加语义版本控制并改进版本选择
* [#7189](https://github.com/xmake-io/xmake/pull/7189): 添加包方案 (schemes) 支持
* [#7208](https://github.com/xmake-io/xmake/pull/7208): 支持 Qt SDK 的动态 mkspec 选择
* [#7219](https://github.com/xmake-io/xmake/pull/7219): 添加 cli.iconv 模块
* [#7235](https://github.com/xmake-io/xmake/pull/7235): 添加字符串大小写转换函数：lower 和 upper
* [#7246](https://github.com/xmake-io/xmake/pull/7246): 添加 utf8 模块
* [#7268](https://github.com/xmake-io/xmake/pull/7268): 为 Nim 源文件添加依赖文件生成
* [#7269](https://github.com/xmake-io/xmake/pull/7269): 在 zig 工具链中添加交叉编译的目标架构验证
* [#7274](https://github.com/xmake-io/xmake/pull/7274): 添加 os.access 函数用于文件访问检查
* [#7284](https://github.com/xmake-io/xmake/pull/7284): 添加 `--stdin` 支持
* [#7293](https://github.com/xmake-io/xmake/pull/7293): 支持在浏览器中运行 wasm 目标
* [#7300](https://github.com/xmake-io/xmake/pull/7300): 为 install/uninstall 添加 libdir, includedir, bindir 支持
* [#7295](https://github.com/xmake-io/xmake/pull/7295): 支持测试输出文件
* [#7306](https://github.com/xmake-io/xmake/pull/7306): 支持多远程构建主机配置

### 改进

* [#7203](https://github.com/xmake-io/xmake/pull/7203): 改进 mingw 工具链
* [#7206](https://github.com/xmake-io/xmake/pull/7206): WDK: 将共享目录添加到 KMDF 包含路径
* [#7214](https://github.com/xmake-io/xmake/pull/7214): 改进警告输出
* [#7216](https://github.com/xmake-io/xmake/pull/7216): 改进 requirelock
* [#7223](https://github.com/xmake-io/xmake/pull/7223): 改进 NuGet 库文件匹配，使用基于分数的选择
* [#7226](https://github.com/xmake-io/xmake/pull/7226): 改进 clang-tidy 查找
* [#7232](https://github.com/xmake-io/xmake/pull/7232): 改进 linker.link_scripts
* [#7237](https://github.com/xmake-io/xmake/pull/7237): 更新 tbox 以支持大小写
* [#7240](https://github.com/xmake-io/xmake/pull/7240): 改进 verilator 标志
* [#7258](https://github.com/xmake-io/xmake/pull/7258): 改进 qt xpack
* [#7262](https://github.com/xmake-io/xmake/pull/7262): 改进与其他目标并发时的 pch 处理
* [#7260](https://github.com/xmake-io/xmake/pull/7260): 改进 fpc
* [#7270](https://github.com/xmake-io/xmake/pull/7270): 改进方案版本选择
* [#7272](https://github.com/xmake-io/xmake/pull/7272): 增强 Nim 对共享库和 rpath 处理的支持
* [#7273](https://github.com/xmake-io/xmake/pull/7273): 改进 io.read 和 io.readfile
* [#7267](https://github.com/xmake-io/xmake/pull/7267): 增强 Linux 下的 Shell 检测（检查父进程）
* [#7278](https://github.com/xmake-io/xmake/pull/7278): 改进 os.isexec
* [#7283](https://github.com/xmake-io/xmake/pull/7283): 增强 compile_commands 支持并添加测试用例
* [#7285](https://github.com/xmake-io/xmake/pull/7285): 改进 Windows 下 cmd/powershell 的 Shell 检测
* [#7286](https://github.com/xmake-io/xmake/pull/7286): 在检测 vs 时检查长环境变量值
* [#7280](https://github.com/xmake-io/xmake/pull/7280): 仅为交叉编译添加目标标志
* [#7290](https://github.com/xmake-io/xmake/pull/7290): 改进 vcvars
* [#7302](https://github.com/xmake-io/xmake/pull/7302): 改进运行进程错误处理
* [#7298](https://github.com/xmake-io/xmake/pull/7298): 添加 Windows DLL foo/main 示例的初始实现

### Bug 修复

* [#7210](https://github.com/xmake-io/xmake/pull/7210): 修复包版本
* [#7213](https://github.com/xmake-io/xmake/pull/7213): 修复 importfiles 的 installdir
* [#7231](https://github.com/xmake-io/xmake/pull/7231): 修复 module support 中的 get flag
* [#7245](https://github.com/xmake-io/xmake/pull/7245): 修复方案版本选择
* [#7259](https://github.com/xmake-io/xmake/pull/7259): 修复导出 c++ 函数符号
* [#7266](https://github.com/xmake-io/xmake/pull/7266): 修复 pch 头文件扩展名
* [#7282](https://github.com/xmake-io/xmake/pull/7282): find_cuda: 撤销破坏性变更
* [#7294](https://github.com/xmake-io/xmake/pull/7294): 修复包工具链
* [#7296](https://github.com/xmake-io/xmake/pull/7296): 修复 find emsdk
* [#7202](https://github.com/xmake-io/xmake/pull/7202): 修复 getfenv
