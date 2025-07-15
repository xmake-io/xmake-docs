---
title: Xmake v2.8.1 发布，大量细节特性改进
tags: [xmake, lua, C/C++, package, performance, mingw64, wasm]
date: 2023-07-11
author: Ruki
---

## 新特性介绍

### Windows 长路径问题改进

windows 的长路径限制一直是一个大问题，嵌套层级太深的工程，在读写文件的时候，都有可能失败，这会影响 xmake 的可用性和体验。

尽管，xmake 已经提供各种措施也避免这个问题，但是偶尔还是会受到一些限制。而在这个版本中，我们改进了安装器，提供一个安装选项，让用户选择性开启长路径支持。

这需要管理员权限，因为它需要写注册表。

```
WriteRegDWORD ${HKLM} "SYSTEM\CurrentControlSet\Control\FileSystem" "LongPathsEnabled" 1
```

用户可以自己决定，是否需要开启它。

感谢 @A2va 的贡献。

### zypper 包管理器支持

新增 OpenSUSE 的 zypper 包管理器支持，可以直接通过 zypper 自动下载安装，并集成它提供的包。

感谢 @iphelf 的贡献。

```lua
add_requires("zypper::libsfml2 2.5")
```

### 改进 msbuild 包安装

一些第三方包，没有使用 cmake 维护，仅仅提供了 vcproj 的工程文件，如果我们把它做成包，需要使用 `tools.msbuild` 模块去编译安装它。

但是 vcproj 的 vs 版本如果很老，就需要升级它，否则编译会失败。

因此我们改进了 tools.msbuild 模块，提供自动升级 vcproj 的功能，只需要指定下需要升级的 vcproj/sln 文件即可。

```lua
package("test")
    on_install(function (package)
        import("package.tools.msbuild").build(package, configs, {upgrade={"wolfssl64.sln", "wolfssl.vcxproj"}})
    end)
```





### 改进 protobuf 支持 grpc

我们改进了对 protobuf 的支持，可以同时支持上 grpc_cpp_plugin。

```lua
add_rules("mode.debug", "mode.release")
add_requires("protobuf-cpp")
add_requires("grpc", {system = false})

target("test")
    set_kind("binary")
    set_languages("c++17")
    add_packages("protobuf-cpp")
    add_packages("grpc")
    add_rules("protobuf.cpp")
    add_files("src/*.cpp")
    add_files("src/test.proto", {proto_rootdir = "src", proto_grpc_cpp_plugin = true})
    add_files("src/subdir/test2.proto", {proto_rootdir = "src"})
```

完整例子见：[protobuf_grpc_cpp_plugin](https://github.com/xmake-io/xmake/blob/dev/tests/projects/c%2B%2B/protobuf_grpc_cpp_plugin/xmake.lua)

### add_links 支持库路径

通常 add_links 需要配合 add_linkdirs 使用，才能让链接器找到指定目录下的库文件。

但是有时候配置不对，或者不同路径下库重名，就容易找错库文件。而现在 add_links 可以支持直接设置库文件路径，避免隐式搜索。

也可以用于显式指定链接 so/a 库。

下面的几种写法都是支持的：

```lua
add_links("foo")
add_links("libfoo.a")
add_links("libfoo.so")
add_links("/tmp/libfoo.a")
add_links("/tmp/libfoo.so")
add_links("foo.lib")
```

### Objc/Objc++ 头文件预编译支持

之前的版本，我们如果使用 `set_pcxxheader` 设置 c++ 头文件预编译，会同时影响 objc 代码。

因此如果 C++/ObjC++ 代码混合编译，用了预编译头，就会遇到编译问题。

```bash
Objective-C was disabled in PCH file but is currently enabled
```

这是因为，预编译头的编译，也是需要指定语言的 `-x c++-header`, `-x objective-c++-header`，pch 文件不能混用。

因此，我们新增了 `set_pmheader` 和 `set_pmxxheader` 接口，单独设置 objc/objc++ 的预编译头文件，跟 C/C++ 预编译头互不冲突。

但用法完全一样。

```lua
target("test")
    set_pmxxheader("header.h")
```

完整例子见：[Objc Precompiled Header Example](https://github.com/xmake-io/xmake/tree/master/tests/projects/objc%2B%2B/precompiled_header)

### 改进 Conan 2.0 支持

上个版本，我们初步支持了 Conan 2.0，但是还遇到了一些细节问题，这个版本我们持续做了改进，比如改进对 vs_runtime 设置问题。

### 更新 lua 运行时

最近 Lua 已经发布了 5.4.6 版本，我们对 xmake 中内置的 Lua 运行时也做了升级，跟上游保持同步。

## 更新日志

### 新特性

* [#3821](https://github.com/xmake-io/xmake/pull/3821): windows 安装器添加长路径支持选项
* [#3828](https://github.com/xmake-io/xmake/pull/3828): 添加 zypper 包管理器支持
* [#3871](https://github.com/xmake-io/xmake/issues/3871): 改进 tools.msbuild 支持对 vsproj 进行自动升级
* [#3148](https://github.com/xmake-io/xmake/issues/3148): 改进 protobuf 支持 grpc
* [#3889](https://github.com/xmake-io/xmake/issues/3889): add_links 支持库路径添加
* [#3912](https://github.com/xmake-io/xmake/issues/3912): 添加 set_pmxxheader 去支持 objc 预编译头
* add_links 支持库文件路径

### 改进

* [#3752](https://github.com/xmake-io/xmake/issues/3752): 改进 windows 上 os.getenvs 的获取
* [#3371](https://github.com/xmake-io/xmake/issues/3371): 改进 tools.cmake 支持使用 ninja 去构建 wasm 包
* [#3777](https://github.com/xmake-io/xmake/issues/3777): 改进从 pkg-config 中查找包
* [#3815](https://github.com/xmake-io/xmake/pull/3815): 改进 tools.xmake 支持为 windows 平台传递工具链
* [#3857](https://github.com/xmake-io/xmake/issues/3857): 改进生成 compile_commands.json
* [#3892](https://github.com/xmake-io/xmake/issues/3892): 改进包搜索，支持从描述中找包
* [#3916](https://github.com/xmake-io/xmake/issues/3916): 改进构建 swift 程序，支持模块间符号调用
* 更新 lua 运行时到 5.4.6

### Bugs 修复

* [#3755](https://github.com/xmake-io/xmake/pull/3755): 修复 find_tool 从 xmake/packages 中查找程序
* [#3787](https://github.com/xmake-io/xmake/issues/3787): 修复从 conan 2.x 中使用包
* [#3839](https://github.com/orgs/xmake-io/discussions/3839): 修复 conan 2.x 包的 vs_runtime 设置
