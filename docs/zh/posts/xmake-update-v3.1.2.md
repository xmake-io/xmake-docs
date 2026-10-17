---
title: Xmake v3.1.2 发布，增量构建改进与 Inno Setup 打包
tags: [xmake, cpp, modules, pch, xpack, addon]
date: 2026-10-17
author: Ruki
outline: deep
---

Xmake v3.1.2 改进了静态库、C++ Modules 和预编译头的增量构建，同时新增 Inno Setup 打包、
测试失败时显示输出、HTTP 下载工具选择，以及自定义 pkg-config 搜索目录等功能。

在 v3.1.1 引入的 addon 基础上，这次修复了本地仓库路径和已安装版本选择，并提供八组可直接运行的分发示例。
此外，仓库更新不再因为克隆失败而误操作用户工程的 Git 仓库。

## 增量构建改进

### 只重新归档真正变化的静态库

对于 `a -> b -> c -> app` 这样的依赖链，修改 `a` 的实现文件后，应当只编译该文件、重新归档 `a`，
最后重新链接 `app`。普通 `b`、`c` 静态库只包含自己的对象文件，不需要因为 `a` 变化而重新生成。

v3.1.2 移除了这类无效归档依赖。启用 `set_policy("build.merge_archive", true)` 的目标仍保留依赖：
其输出实际包含依赖库的对象文件，必须先重新归档再合并，避免旧成员残留。
相关改动见 [#7798](https://github.com/xmake-io/xmake/pull/7798)。

### Clang reduced BMI 支持

可以通过策略选择 Clang 的 reduced BMI 编译流程：

```lua
set_policy("build.c++.modules.two_phases", true)
set_policy("build.c++.modules.clang.precompile_reduced_bmi", true)
```

Xmake 会探测编译器是否支持 `--precompile-reduced-bmi`。Reduced BMI 为模块使用方提供信息，
生成对象文件时仍编译原始模块源文件。不支持这一模式的编译器继续使用原有流程，策略默认关闭。
这与将完整 PCM 编译为对象文件不同，后者现在会跳过无用的头文件搜索配置。

模块缓存也会按构建模式隔离，Clang 模块扫描和编译数据库生成对 MSVC 环境的处理更加一致。
相关改动见 [#7742](https://github.com/xmake-io/xmake/pull/7742)、
[#7849](https://github.com/xmake-io/xmake/pull/7849)，配置方式参见
[策略文档](/zh/api/description/builtin-policies)。

### Windows PCH 依赖和缓存修复

修改 clang-cl PCH 包装文件引用的头文件后，现在能够正确触发 PCH 更新。
MSVC 创建 PCH 产物时会跳过编译缓存，包括 `.pch.obj` 输出，避免缓存处理不适用的编译步骤。
相关改动见 [#7815](https://github.com/xmake-io/xmake/pull/7815) 和
[#7819](https://github.com/xmake-io/xmake/pull/7819)。

## Inno Setup 安装包

Xpack 现在支持在 Windows 上生成 Inno Setup 安装包：

```lua
includes("@builtin/xpack")

target("demo")
    set_kind("binary")
    add_files("src/main.c")

xpack("demo")
    set_formats("inno")
    set_version("1.0.0")
    add_targets("demo")
    set_displayicon("bin/demo.exe")
```

```sh
xmake pack -f inno
```

`set_displayicon` 用于设置“添加或删除程序”中的显示图标，供 Inno Setup 和 NSIS 共用。
原来的 `set_nsis_displayicon` 仍兼容，但已弃用，建议迁移到新接口。
相关改动见 [#7854](https://github.com/xmake-io/xmake/pull/7854)，接口说明参见
[xpack 文档](/zh/api/description/xpack-interfaces#set-displayicon)。

## 只在测试失败时显示输出

```sh
xmake test --output-on-failure
```

保留正常测试报告，只为失败或非预期通过的测试显示标准输出、标准错误。
成功测试保持安静，适合减少 CI 日志；需要查看全部测试输出时仍可使用 `-v`。
相关改动见 [#7791](https://github.com/xmake-io/xmake/pull/7791)。

## 下载与包配置

### 选择 HTTP 下载工具

```sh
xmake g --downloader=curl
```

也可以设置 `XMAKE_DOWNLOADER=curl`，或仅为某次调用指定工具：

```lua
import("net.http")
http.download("https://xmake.io", "index.html", {downloader = "curl"})
```

支持 `aria2`、`curl`、`wget`、`powershell` 和 `pwsh`。
优先级依次为调用选项、命令行选项、全局配置和环境变量。
显式选择的工具不可用时会报错，不会静默切换后端。Aria2 的连接参数和 DNS 处理也作了调整。
相关改动见 [#7758](https://github.com/xmake-io/xmake/pull/7758)。

### 指定 pkg-config 搜索目录

```lua
add_requires("pkgconfig::ncurses", {configs = {
    configdirs = {"/opt/ncurses/lib/pkgconfig", "/opt/ncurses/share/pkgconfig"}
}})
```

`configdirs` 为当前包指定 `.pc` 搜索目录，支持单个目录或目录列表，无需修改全局 `PKG_CONFIG_PATH`。
相关改动见 [#7792](https://github.com/xmake-io/xmake/pull/7792)。

### 配置文件中的版本元数据

使用 `set_version("1.2.3-rc.1+build.7")` 时，配置模板可以通过 `${VERSION_PRERELEASE}` 读取 `rc.1`，
通过 `${VERSION_BUILD}` 读取 `build.7`。显式指定的 `{build = ...}` 仍优先于版本字符串中的元数据。
将这些值用于 C 字符串时，应在模板中添加引号。
相关改动见 [#7799](https://github.com/xmake-io/xmake/pull/7799)。

## Addon 修复和分发示例

自动安装、升级 addon 时会保留工程中本地仓库相对路径的基准目录。
工程要求的版本已经安装时，会先激活这个版本再锁定和加载，避免误用最后安装的其他版本。
直接从本地目录安装的 addon 也能正常识别，不再进行无效的仓库查找。

[Addon 示例](/zh/examples/configuration/addons)提供八组独立工程，包含用户工程、addon 定义和本地仓库配方，
涵盖 includes、描述域 API/函数、规则、模块、插件、模板和工具链。
描述域扩展示例在首次预读时检查 API 是否存在，让自动安装完成后再执行对应配置。
相关改动见 [#7809](https://github.com/xmake-io/xmake/pull/7809)、
[#7821](https://github.com/xmake-io/xmake/pull/7821) 和
[#7860](https://github.com/xmake-io/xmake/pull/7860)。

## 仓库更新修复

克隆失败或中断可能留下不完整的仓库目录。如果在这里执行 Git 命令，Git 可能向上查找到用户工程仓库。
本次更新将修改命令显式绑定到预期仓库，防止误改用户 remote 或重置工作区，并处理不完整的远程仓库缓存。
本地仓库源码目录不参与这类缓存清理。相关改动见 [#7820](https://github.com/xmake-io/xmake/pull/7820)。

## 其他改动

本次还新增 nvcc 的 C++23 配置和 Linux 上的 raddbg 支持，更新 MATLAB 版本检测到 R2026b，
并修复 Make 工具链传递、Conan 引号参数和 Homebrew `latest` 查找。
基础库方面完善了 JSON Unicode 转义、深拷贝、图、堆、列表、hashset 及加权 Levenshtein 距离等行为。

## 更新内容

### 新特性

* [#7742](https://github.com/xmake-io/xmake/pull/7742): 支持 Clang reduced BMI 编译
* [#7791](https://github.com/xmake-io/xmake/pull/7791): 添加 `xmake test --output-on-failure`
* [#7854](https://github.com/xmake-io/xmake/pull/7854): 添加 Inno Setup 打包和 `set_displayicon` 支持
* [#7758](https://github.com/xmake-io/xmake/pull/7758): 支持自定义下载工具，改进 aria2 下载
* [#7792](https://github.com/xmake-io/xmake/pull/7792): 支持为 `pkgconfig::` 包设置 `configs.configdirs`
* [#7799](https://github.com/xmake-io/xmake/pull/7799): 支持配置文件中的 `VERSION_PRERELEASE` 和语义版本 `VERSION_BUILD`
* [#7808](https://github.com/xmake-io/xmake/pull/7808): 支持 nvcc 的 C++23 标准配置
* [#7766](https://github.com/xmake-io/xmake/pull/7766): 添加 Linux 平台的 raddbg 支持
* [#7743](https://github.com/xmake-io/xmake/pull/7743): 通过 `lib.lua.*` 提供更多原生 Lua 函数
* [#7752](https://github.com/xmake-io/xmake/pull/7752): 支持纯 Lua JSON 解码器的 Unicode 转义

### 改进

* [#7852](https://github.com/xmake-io/xmake/pull/7852): 抑制 clang-cl 的未使用参数警告
* [#7855](https://github.com/xmake-io/xmake/pull/7855): 更新 MATLAB 版本检测，支持到 R2026b
* [#7767](https://github.com/xmake-io/xmake/pull/7767): 提示缓存配置覆盖当前目录工程的情况
* [#7780](https://github.com/xmake-io/xmake/pull/7780): 移除内置 Gitee 和 GitCode 镜像
* [#7860](https://github.com/xmake-io/xmake/pull/7860): 添加独立的 addon 分发示例
* [#7800](https://github.com/xmake-io/xmake/pull/7800): 完善 `isnan` 非法输入测试
* 更新内置 tbox
* 更新 Ubuntu PPA 目标和 NetBSD CI 依赖
* 更新 PowerShell 安装脚本和 RPM 版本信息
* 添加 `AGENTS.md` 开发规范

### Bug 修复

* [#7750](https://github.com/xmake-io/xmake/pull/7750): 修复 MSVC 环境下的 Clang 模块和编译数据库
* [#7770](https://github.com/xmake-io/xmake/pull/7770): 保留 clangd 编译数据库中的 MSVC 系统头文件配置
* [#7849](https://github.com/xmake-io/xmake/pull/7849): 移除 Clang PCM 编译为对象文件时的无用 include 参数
* [#7788](https://github.com/xmake-io/xmake/pull/7788): 修复跨构建模式及工程生成时的 C++ 模块缓存
* [#7815](https://github.com/xmake-io/xmake/pull/7815): 修复 clang-cl PCH 依赖跟踪
* [#7819](https://github.com/xmake-io/xmake/pull/7819): 禁用 MSVC PCH 创建步骤的编译缓存
* [#7798](https://github.com/xmake-io/xmake/pull/7798): 避免静态库无效重归档及合并归档残留旧成员
* [#7820](https://github.com/xmake-io/xmake/pull/7820): 防止仓库更新误重置用户工程，并处理克隆中断残留
* [#7776](https://github.com/xmake-io/xmake/pull/7776): 修复本地安装 addon 的识别
* [#7809](https://github.com/xmake-io/xmake/pull/7809): 修复安装、升级 addon 时的本地仓库路径
* [#7821](https://github.com/xmake-io/xmake/pull/7821): 激活已安装 addon 中工程要求的版本
* [#7761](https://github.com/xmake-io/xmake/pull/7761): 工具集探测失败时保留可用的 MSVC 环境
* [#7813](https://github.com/xmake-io/xmake/pull/7813): 修复 Ascend C 工具链探测及未确认 SDK 的加载
* [#7853](https://github.com/xmake-io/xmake/pull/7853): 修复 `gxx`/`gcc` 工具和参数匹配
* [#7763](https://github.com/xmake-io/xmake/pull/7763): 为 clang-cl 包默认启用 C++ 异常
* [#7779](https://github.com/xmake-io/xmake/pull/7779): 安装 Windows、MinGW 包时添加编译器运行库路径
* [#7782](https://github.com/xmake-io/xmake/pull/7782): 修复交叉编译到 ARM64 时的 MIDL 检测
* [#7772](https://github.com/xmake-io/xmake/pull/7772): 修复 HarmonyOS 上的 Qt debug 库名
* [#7789](https://github.com/xmake-io/xmake/pull/7789): 修复 Homebrew 包 `latest` 版本的查找
* [#7760](https://github.com/xmake-io/xmake/pull/7760): 修复 Conan 生成器中的引号参数和 Windows 路径
* [#7857](https://github.com/xmake-io/xmake/pull/7857): 向 Make 包构建传递所选工具链
* [#7803](https://github.com/xmake-io/xmake/pull/7803): 修复误报的 `vs_runtime` 弃用警告
* [#7749](https://github.com/xmake-io/xmake/pull/7749): Verilator 工具或参数变化时重新生成输出
* [#7757](https://github.com/xmake-io/xmake/pull/7757): 修复 `set_xmakever` 的版本比较和校验
* [#7765](https://github.com/xmake-io/xmake/pull/7765): 检测数值和布尔依赖值的变化
* [#7816](https://github.com/xmake-io/xmake/pull/7816): 修复 GCC 依赖文件中的美元符号转义
* [#7753](https://github.com/xmake-io/xmake/pull/7753): 修复 `path.pattern` 的方括号转义
* [#7801](https://github.com/xmake-io/xmake/pull/7801): 修复含 nil 成员的 hashset 相等判断
* [#7810](https://github.com/xmake-io/xmake/pull/7810): 修复移除非根元素后的堆排序
* [#7811](https://github.com/xmake-io/xmake/pull/7811): 让 list 的 `pop`、`shift` 返回移除值
* [#7812](https://github.com/xmake-io/xmake/pull/7812): 克隆、反转图时保留孤立顶点
* [#7825](https://github.com/xmake-io/xmake/pull/7825): 修复空字符串的加权 Levenshtein 距离
* [#7827](https://github.com/xmake-io/xmake/pull/7827): 修复 `table.clone(value, -1)` 深拷贝
