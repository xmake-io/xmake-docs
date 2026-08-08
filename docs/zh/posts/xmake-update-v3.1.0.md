---
title: Xmake v3.1.0 发布，插件仓库分发，二进制资源转换与 alignof 检测
tags: [xmake, plugin, xrepo, bin2c, bin2obj, alignof, xpack, gcc]
date: 2026-08-08
author: Ruki
outline: deep
---

在此版本中，我们重构了 `xmake plugin` 插件管理器，插件现在可以像包一样，从 xmake-repo 这样的仓库中安装，也支持从 git 地址和本地目录安装，并且能够列出内置、已安装以及仓库中可用的所有插件。

此外，我们还新增了 `check_alignof` / `configvar_check_alignof` 类型对齐检测，为 `utils.bin2c` / `utils.bin2obj` 规则添加了二进制资源的 transform 支持，新增了 `batchcmds:call` 接口，`xmake show` 支持统一的 `--format=json` 输出，`build` / `clean` / `install` 等命令支持一次传入多个目标名，xpack 的安装文件列表支持内置变量，以及 gcc-16 工具链支持。

## 新特性介绍

### 全新的插件管理与仓库分发

以前想要分发一个 xmake 插件，只能让用户手动把插件目录拷贝到 `~/.xmake/plugins/` 下，或者自己去 clone 仓库。这个版本我们重写了 `xmake plugin` 命令，插件的安装、删除、列举现在都有了统一的入口，并且完全复用了 xmake 的包安装流程。

#### 从仓库安装插件

插件在仓库中以包的形式描述，采用和 packages 一致的目录布局，即 `<repodir>/plugins/<首字母>/<插件名>/xmake.lua`：

```lua
-- plugins/h/hello/xmake.lua
package("hello")
    set_kind("plugin")
    set_description("say hello from hello")
    set_sourcedir(path.join(os.scriptdir(), "src"))
```

其中 `src` 目录里就是插件本身的实现，也就是我们熟悉的 `xmake.lua` + `main.lua`：

```lua
-- plugins/h/hello/src/xmake.lua
task("hello")
    set_category("plugin")
    on_run("main")
    set_menu {usage = "xmake hello", description = "say hello"}
```

```lua
-- plugins/h/hello/src/main.lua
function main()
    print("hello xmake!")
end
```

对于这种源码直接内置在仓库里的插件，`on_install` 是可以省略的，xmake 会默认把插件目录整个拷贝到 `~/.xmake/plugins/<插件名>` 下。当然，因为它本质上就是一个 `plugin` 类型的包，所以 `add_urls`、`add_versions`、`add_deps`、自定义 `on_install` / `on_test` 这些包的能力它同样都有。

安装的时候，可以直接指定插件名，xmake 会在所有已配置的仓库中查找：

```bash
$ xmake plugin --install hello
```

也可以显式指定从哪个仓库安装：

```bash
$ xmake plugin --install xmake-repo@hello
```

#### 从 git 地址和本地目录安装

除了仓库，`--install` 也支持直接从 git 地址安装，并且提供了 `github:` 简写，还可以用 `#` 指定分支：

```bash
$ xmake plugin --install https://github.com/myrepo/hello-world
$ xmake plugin --install github:myrepo/hello-world
$ xmake plugin --install github:myrepo/hello-world#dev
```

本地开发调试插件时，直接给一个目录即可：

```bash
$ xmake plugin --install /tmp/my-plugin
```

#### 列举、删除与清理

`xmake plugin --list` 现在会把内置插件、已安装插件，以及仓库中可安装但尚未安装的插件分组列出，并且带上各自的描述：

```bash
$ xmake plugin --list
the built-in plugins:
  project        Generate the project file.
  pack           Pack binary installation packages.
  ...
the installed plugins:
  hello          say hello from hello
available in configured repositories:
  world          say hello from world (run xmake plugin --install world to install)
```

删除和清理：

```bash
$ xmake plugin --remove hello
$ xmake plugin --clear
```

### alignof 类型对齐检测

新增了 `check_alignof` 和 `configvar_check_alignof` 两个检测接口，用于探测指定类型在目标平台上的对齐大小，用法和已有的 `check_sizeof` 完全一致。

```lua
includes("@builtin/check")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    check_alignof("LONG_ALIGN", "long")
    check_alignof("STRING_ALIGN", "std::string", {includes = "string"})
```

它会自动定义出 `LONG_ALIGN=8` 这样的宏。如果希望把检测结果写入 `config.h`，则使用 `configvar_check_alignof`：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_configfiles("config.h.in")
    configvar_check_alignof("ALIGNOF_LONG", "long")
```

```c
// config.h.in
#define ALIGNOF_LONG ${ALIGNOF_LONG}
```

检测代码内部会根据编译器和语言标准，自动选择 `alignof` / `_Alignof` / `__alignof` / `__alignof__`，因此 C11 之前的 C 代码以及 MSVC 也都能正常工作。由于检测结果是通过编译产物中的特征串提取的，无需真正运行程序，所以交叉编译下同样可用。

### bin2c / bin2obj 支持二进制资源转换

`utils.bin2c` 和 `utils.bin2obj` 规则新增了 `transform` 配置，可以在把二进制文件嵌入到程序之前，先对它的内容做一次转换，比如压缩、加密、混淆等等。

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_rules("utils.bin2c")
    add_files("src/*.c")
    add_files("src/asset.bin", {transform = function (inputfile, outputfile, opt)
        local data = io.readfile(inputfile, {encoding = "binary"})
        io.writefile(outputfile, data:reverse(), {encoding = "binary"})
    end})
```

`transform` 也可以是一个 lua 脚本文件的路径，这样在导出到 vs/cmake 等其他工程时，转换步骤依然能被生成器保留：

```lua
target("test")
    set_kind("binary")
    add_rules("utils.bin2obj")
    add_files("src/*.c")
    add_files("src/asset.bin", {transform = path.join(os.projectdir(), "transform.lua")})
```

```lua
-- transform.lua
function main(inputfile, outputfile)
    local data = io.readfile(inputfile, {encoding = "binary"})
    io.writefile(outputfile, data:reverse(), {encoding = "binary"})
end
```

`transform` 除了配置在文件级别，也可以配置在规则级别，对该规则处理的所有二进制文件生效：

```lua
add_rules("utils.bin2c", {transform = path.join(os.projectdir(), "transform.lua")})
```

转换后的文件会写到 `target:autogenfile(...)` 下，并纳入依赖追踪，只有源文件或转换脚本变化时才会重新生成。

### batchcmds:call

配合上面的 transform，我们新增了 `batchcmds:call` 接口，可以在 `on_buildcmd_file` 等 batchcmds 上下文中，直接注册一个 lua 函数作为构建命令，而不必再走 `os.execv` 拉起子进程。

```lua
rule("myrule")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        batchcmds:call(function (inputfile, outputfile, opt)
            io.writefile(outputfile, io.readfile(inputfile))
        end, {sourcefile, target:autogenfile(sourcefile)}, {name = "myrule/copy", target = target})
    end)
```

传入的函数会被自动 fork 到当前沙盒环境中执行，所以在函数体内可以照常使用 `import()`、`os.*`、`io.*` 等接口。`batchcmds:call` 的第一个参数也支持传入 lua 脚本文件的路径，此时它等价于 `batchcmds:lua(...)`。

需要注意的是，直接传入 lua 函数的方式无法被 vs/cmake 等工程生成器导出，生成器会跳过它并给出警告，所以如果你的规则需要支持导出到其他工程，建议使用脚本文件的形式。

### xmake show 统一的输出格式参数

`xmake show` 之前的 `--json` 参数只对部分信息生效，这个版本我们把输出格式统一到了 `--format` 参数上，`-l/--list` 列表信息现在也支持 JSON 输出了：

```bash
# 纯文本输出（默认）
$ xmake show -l targets
$ xmake show -l targets --format=plain

# JSON 输出
$ xmake show -l targets --format=json
["app","core","ui"]
```

`--format` 目前支持 `plain`、`json` 和 `dot`，其中 `dot` 只对 `--info=depgraph` 有效：

```bash
$ xmake show --info=depgraph --format=json
$ xmake show --info=depgraph --format=dot
```

如果给列表信息传入了不支持的格式，xmake 现在会直接报错，而不是静默地回退到纯文本。原有的 `--json` 参数依然可用，但已经标记为废弃，建议统一改用 `--format=json`。

### 命令支持传入多个目标名

`build`、`clean`、`install`、`uninstall`、`package` 以及 `format` 等命令，现在都支持一次传入多个目标名，不再需要反复执行：

```bash
$ xmake build target1 target2 target3
$ xmake clean target1 target2
$ xmake install target1 target2
$ xmake uninstall target1 target2
```

重复的目标名会被自动去重，不存在的目标名会在执行前统一检查并报错，同时给出相近目标名的提示。

### xpack 安装文件支持内置变量

`xpack` 的 `add_installfiles` 和 `add_sourcefiles` 现在会对路径做内置变量展开，可以直接在里面使用 `$(projectdir)`、`$(builddir)` 这类变量，以及 xpack 自身的 `$(version)` 等值。

```lua
xpack("test")
    set_formats("zip")
    add_targets("demo")
    add_installfiles("$(projectdir)/assets/(**.png)", {prefixdir = "share"})
    add_sourcefiles("$(projectdir)/src/(**.c)")
```

之前这些路径是原样传给文件匹配的，导致带内置变量的路径无法正确展开。这里的展开发生在解析 `(...)` 根目录标记之前，所以内置变量语法和 xmake 的路径分组语法可以正常共存。

### gcc-16 工具链

新增了 `gcc-16` 工具链，可以直接切到 gcc 16 版本的编译器：

```bash
$ xmake f --toolchain=gcc-16
$ xmake
```

### clang 静态 libc++ 运行时链接改进

以前使用 `set_runtimes("c++_static")` 配合 clang 时，xmake 会传递 `-static-libstdc++`，但这个参数只会链接 `libc++.a`，并不会链接 `libc++abi.a`，导致 `typeinfo`、`__cxa_*` 等符号未定义而链接失败 —— 在 C++ 模块场景下由于会引用到更多 libc++ 的实现，这个问题尤其明显。

这个版本中，xmake 会通过 clang 的 `-print-file-name` 主动定位 `libc++.a` 和 `libc++abi.a` 的绝对路径（包括 `lib/<target-triple>/` 这种按目标三元组划分的运行时目录），然后用 `-nostdlib++` 关掉驱动自带的 C++ 运行时链接，改为显式链接这两个静态库，并且在非 Apple 平台上用 `--start-group` / `--end-group` 包裹，解决它们之间的相互引用。

同时，C++ 的链接顺序也做了调整，`target.runtimes` 从最前面移动到了用户链接库之后、syslinks 之前，这样显式链接的静态运行时库才能正确解析目标文件里的符号。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    set_runtimes("c++_static")
    set_toolchains("clang")
```

如果找不到这两个静态库，或者编译器不支持 `-nostdlib++`，则依旧回退到原有的 `-static-libstdc++` 行为。

### 下载失败时的 SSL 回退

包下载时如果因为 SSL/TLS 证书校验失败（常见于某些企业网络或系统证书过期的环境），xmake 现在会自动给出警告，并关闭证书校验重试一次。

```bash
warning: download failed due to ssl certificate verification, retrying with ssl verification disabled ..
```

这个回退只在包文件、资源文件和补丁文件的下载中启用，因为它们随后都会用 sha256 校验完整性，所以不会因此引入安全风险。如果希望始终禁用证书校验，依然可以使用 `xmake g --insecure-ssl=y`。

## 更新日志

### 新特性

* [#7558](https://github.com/xmake-io/xmake/pull/7558): 添加 `check_alignof` / `alignof` 检测支持
* [#7587](https://github.com/xmake-io/xmake/pull/7587): 支持 `xmake show --format=json`
* [#7607](https://github.com/xmake-io/xmake/pull/7607): 支持给 `build` / `clean` 等命令传递多个目标名
* [#7634](https://github.com/xmake-io/xmake/pull/7634): 为 xpack 添加过滤器支持
* [#7654](https://github.com/xmake-io/xmake/pull/7654): 为 `bin2obj` / `bin2c` 添加 `batchcmds:call` 和 lua 文件 transform 支持
* [#7680](https://github.com/xmake-io/xmake/pull/7680): 重构 `xmake plugin`，支持从仓库（`repo@name` 或名称）、git 地址（`github:user/repo[#branch]`）以及本地目录安装插件，仓库中的插件采用与 packages 相同的 `plugins/<首字母>/<名称>` 布局，并列出内置、已安装和仓库中可安装的插件及其描述
* 添加 gcc-16 工具链支持

### 改进

* [#7562](https://github.com/xmake-io/xmake/pull/7562): 改进 nuget 版本处理
* [#7564](https://github.com/xmake-io/xmake/pull/7564): 改进 `find_package` 中的 vcpkg 依赖信息
* [#7582](https://github.com/xmake-io/xmake/pull/7582): 支持 nvcc 的 `set_encodings` 并过滤其输出
* [#7609](https://github.com/xmake-io/xmake/pull/7609): 使用 `FormatMessageW` 获取 Windows 系统错误信息
* [#7614](https://github.com/xmake-io/xmake/pull/7614): 改进 `cargo` 包安装
* [#7619](https://github.com/xmake-io/xmake/pull/7619): 规避 clangd 盘符大小写问题
* [#7620](https://github.com/xmake-io/xmake/pull/7620): 改进 vs2015 下 cl 的编译选项检测和输出处理
* [#7625](https://github.com/xmake-io/xmake/pull/7625): 改进 verilator 规则
* [#7629](https://github.com/xmake-io/xmake/pull/7629): vsxmake: 支持解决方案资源管理器中的自定义源类型和 nonetype 目标
* [#7630](https://github.com/xmake-io/xmake/pull/7630): 添加 `add_toolset` api 检查器
* [#7637](https://github.com/xmake-io/xmake/pull/7637): 改进 mingw 下的 readline / curses 选项
* [#7648](https://github.com/xmake-io/xmake/pull/7648): 改进错误提示
* [#7655](https://github.com/xmake-io/xmake/pull/7655): 改进 bin2obj 的目标文件 flag 检测并添加 ppc / mips 支持
* [#7657](https://github.com/xmake-io/xmake/pull/7657): 更新 riscv64 的 NDK sdkver
* [#7666](https://github.com/xmake-io/xmake/pull/7666): 改进 vcpkg 包查找
* [#7672](https://github.com/xmake-io/xmake/pull/7672): 添加下载失败回退支持
* [#7688](https://github.com/xmake-io/xmake/pull/7688): 改进 clang 的静态 libc++ 运行时链接
* [#7689](https://github.com/xmake-io/xmake/pull/7689): 重写 `xmake plugin --install`，将插件作为 `plugin` 类型的包从 xmake-repo 安装，复用包安装流程
* [#7693](https://github.com/xmake-io/xmake/pull/7693): 替换 tbox 中已废弃的接口
* 改进 elf rpath 清理和包路径处理
* 添加 xcodebuild 检测
* 更新内置的 tbox

### Bugs 修复

* [#7561](https://github.com/xmake-io/xmake/pull/7561): 修复 clang-cl 的 `-flto=thin` 回归问题
* [#7563](https://github.com/xmake-io/xmake/pull/7563): 修复 `contains` 崩溃并改进 C++ std 模块的 PCH
* [#7580](https://github.com/xmake-io/xmake/pull/7580): 修复 format 插件在头文件路径已是绝对路径时的处理
* [#7581](https://github.com/xmake-io/xmake/pull/7581): 修复包加载函数中缺失的括号
* [#7583](https://github.com/xmake-io/xmake/pull/7583): 修复 cmake 包的全局 flags 拆分
* [#7599](https://github.com/xmake-io/xmake/pull/7599): 修复 OpenBSD 上的 gzip / tar 检测
* [#7600](https://github.com/xmake-io/xmake/pull/7600): 修复构建缓存 memcache 的启用
* [#7601](https://github.com/xmake-io/xmake/pull/7601): 修复 verilator 确保定义 `TRACE`
* [#7602](https://github.com/xmake-io/xmake/pull/7602): 修复包加载 memcache
* [#7603](https://github.com/xmake-io/xmake/pull/7603): 通过更新 tbox 修复 `rmdir`
* [#7604](https://github.com/xmake-io/xmake/pull/7604): 修复 elf 的 rpath 清理
* [#7608](https://github.com/xmake-io/xmake/pull/7608): 修复拼写错误并格式化命令菜单
* [#7611](https://github.com/xmake-io/xmake/pull/7611): 修复缓存环境变量处理（[#7576](https://github.com/xmake-io/xmake/issues/7576)）
* [#7622](https://github.com/xmake-io/xmake/pull/7622): 修复 deb 打包的默认 maintainer
* [#7627](https://github.com/xmake-io/xmake/pull/7627): 修复 debuild 中的 PATH 处理
* [#7631](https://github.com/xmake-io/xmake/pull/7631): 修复安装 deb 包时的 PATH 处理
* [#7633](https://github.com/xmake-io/xmake/pull/7633): 修复 Meson 后端在 BSD 上的 pkg-config 路径
* [#7640](https://github.com/xmake-io/xmake/pull/7640): 改进 emcc 检测，添加回退查找
* [#7644](https://github.com/xmake-io/xmake/pull/7644): 修复路径转换中长路径的栈缓冲区溢出
* [#7645](https://github.com/xmake-io/xmake/pull/7645): 修复删除只读目录
* [#7659](https://github.com/xmake-io/xmake/pull/7659): 修复 Windows 上 emcc 的 `.exe` / `.bat` 检测
* [#7661](https://github.com/xmake-io/xmake/pull/7661): 回退 clang 的静态 libc++ 链接
* [#7668](https://github.com/xmake-io/xmake/pull/7668): 修复向 cmake 传递路径
* [#7671](https://github.com/xmake-io/xmake/pull/7671): 修复 tbox 的一些 bug
* [#7674](https://github.com/xmake-io/xmake/pull/7674): 修复 macOS 上的 Mach host send-right 泄漏
* [#7676](https://github.com/xmake-io/xmake/pull/7676): 修复 masm 的 embed / edit 级别符号 flag
* [#7679](https://github.com/xmake-io/xmake/pull/7679): 修复 msvc 在 C 模式下的 `set_pcheader`
* [#7684](https://github.com/xmake-io/xmake/pull/7684): 修复 `process.open` 中错误的 Lua 栈索引
* [#7685](https://github.com/xmake-io/xmake/pull/7685): 修复引擎资源泄漏
* [#7687](https://github.com/xmake-io/xmake/pull/7687): 修复 ninja 生成器未给 `win.sdk.resource` 源文件批次生成构建边的问题（[#7682](https://github.com/xmake-io/xmake/issues/7682)）
* [#7692](https://github.com/xmake-io/xmake/pull/7692): 修复 `build.c++.modules.tryreuse` 的依赖顺序
* 修复 scons 的 trybuild
