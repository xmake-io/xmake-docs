---
title: xmake v2.6.5 发布，远程编译支持
tags: [xmake, lua, C/C++, cargo, rust, remote-compilation]
date: 2022-04-24
author: Ruki
---

## 新特性介绍

### 远程编译支持

新版本提供了远程编译支持，我们可以通过它可以远程服务器上编译代码，远程运行和调试。

服务器可以部署在 Linux/MacOS/Windows 上，实现跨平台编译，例如：在 Linux 上编译运行 Windows 程序，在 Windows 上编译运行 macOS/Linux 程序。

相比 ssh 远程登入编译，它更加的稳定，使用更加流畅，不会因为网络不稳定导致 ssh 终端输入卡顿，也可以实现本地快速编辑代码文件。

甚至我们可以在 vs/sublime/vscode/idea 等编辑器和IDE 中无缝实现远程编译，而不需要依赖 IDE 本身对远程编译的支持力度。

#### 开启服务

```console
$ xmake service
<remote_build_server>: listening 0.0.0.0:9096 ..
```

我们也可以开启服务的同时，回显详细日志信息。

```console
$ xmake service -vD
<remote_build_server>: listening 0.0.0.0:9096 ..
```

#### 以 Daemon 模式开启服务

```console
$ xmake service --start
$ xmake service --restart
$ xmake service --stop
```

#### 配置服务端

我们首先，运行 `xmake service` 命令，它会自动生成一个默认的 `service.conf` 配置文件，存储到 `~/.xmake/service.conf`。

然后，我们编辑它，修复服务器的监听端口（可选）。

```lua
{
    logfile = "/Users/ruki/.xmake/service/logs.txt",
    remote_build = {
        server = {
            listen = "0.0.0.0:9096"
        }
    }
}
```

#### 配置客户端

我们还是编辑这个文件 `~/.xmake/service.conf`，配置客户端需要连接的服务器地址。

```lua
{
    logfile = "/Users/ruki/.xmake/service/logs.txt",
    remote_build = {
        client = {
            connect = "192.168.56.101:9096",
        }
    }
}
```

#### 导入给定的配置文件

我们也可以通过下面的命令，导入指定的配置文件。

```console
$ xmake service --config=/tmp/service.conf
```

#### 连接远程的服务器

接下来，我们只需要进入需要远程编译的工程根目录，执行 `xmake service --connect` 命令，进行连接。

```console
$ xmake create test
$ cd test
$ xmake service --connect 
<remote_build_client>: connect 192.168.56.110:9096 ..
<remote_build_client>: connected!
<remote_build_client>: sync files in 192.168.56.110:9096 ..
Scanning files ..
Comparing 3 files ..
    [+]: src/main.cpp
    [+]: .gitignore
    [+]: xmake.lua
3 files has been changed!
Archiving files ..
Uploading files with 1372 bytes ..
<remote_build_client>: sync files ok!
```

#### 远程构建工程

连接成功后，我们就可以像正常本地编译一样，进行远程编译。

```console
$ xmake
<remote_build_client>: run xmake in 192.168.56.110:9096 ..
checking for platform ... macosx
checking for architecture ... x86_64
checking for Xcode directory ... /Applications/Xcode.app
checking for Codesign Identity of Xcode ... Apple Development: waruqi@gmail.com (T3NA4MRVPU)
checking for SDK version of Xcode for macosx (x86_64) ... 11.3
checking for Minimal target version of Xcode for macosx (x86_64) ... 11.4
[ 25%]: ccache compiling.release src/main.cpp
[ 50%]: linking.release test
[100%]: build ok!
<remote_build_client>: run command ok!
```








#### 远程运行目标程序

我们也可以像本地运行调试那样，远程运行调试编译的目标程序。

```console
$ xmake run
<remote_build_client>: run xmake run in 192.168.56.110:9096 ..
hello world!
<remote_build_client>: run command ok!
```

#### 远程重建工程

```console
$ xmake -rv
<remote_build_client>: run xmake -rv in 192.168.56.110:9096 ..
[ 25%]: ccache compiling.release src/main.cpp
/usr/local/bin/ccache /usr/bin/xcrun -sdk macosx clang -c -Qunused-arguments -arch x86_64 -mmacosx-version-min=11.4 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX11.3.sdk -fvisibility=hidden -fvisibility-inlines-hidden -O3 -DNDEBUG -o build/.objs/test/macosx/x86_64/release/src/main.cpp.o src/main.cpp
[ 50%]: linking.release test
"/usr/bin/xcrun -sdk macosx clang++" -o build/macosx/x86_64/release/test build/.objs/test/macosx/x86_64/release/src/main.cpp.o -arch x86_64 -mmacosx-version-min=11.4 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX11.3.sdk -stdlib=libc++ -Wl,-x -lz
[100%]: build ok!
<remote_build_client>: run command ok!
```

#### 远程配置编译参数

```console
$ xmake f --xxx --yy
```

#### 手动同步工程文件

连接的时候，会自动同步一次代码，后期代码改动，可以执行此命令来手动同步改动的文件。

```console
$ xmake service --sync
<remote_build_client>: sync files in 192.168.56.110:9096 ..
Scanning files ..
Comparing 3 files ..
    [+]: src/main.cpp
    [+]: .gitignore
    [+]: xmake.lua
3 files has been changed!
Archiving files ..
Uploading files with 1372 bytes ..
<remote_build_client>: sync files ok!
```

#### 断开远程连接

针对当前工程，断开连接，这仅仅影响当前工程，其他项目还是可以同时连接和编译。

```console
$ xmake service --disconnect
<remote_build_client>: disconnect 192.168.56.110:9096 ..
<remote_build_client>: disconnected!
```

#### 查看服务器日志

```console
$ xmake service --logs
```

#### 清理远程服务缓存和构建文件

我们也可以手动清理远程的任何缓存和构建生成的文件。

```console
$ cd projectdir
$ xmake service --clean
```

### 改进 Cargo 包依赖

在之前的版本中，我们已经可以通过 `add_requires("cargo::base64")` 去单独集成每个 cargo 包，用于编译 rust 项目，以及与 C/C++ 的混合编译，例如：

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::base64 0.13.0")
add_requires("cargo::flate2 1.0.17", {configs = {features = "zlib"}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::base64", "cargo::flate2")
```


但是上面的方式会有一个问题：

如果依赖很多，并且有几个依赖都共同依赖了相同的子依赖，那么会出现重定义问题，因此如果我们使用完整的 Cargo.toml 去管理依赖就不会存在这个问题。

例如：

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::test", {configs = {cargo_toml = path.join(os.projectdir(), "Cargo.toml")}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::test")
```

然后，我们就可以在 Cargo.toml 中集成所有需要的依赖，让 Rust 自己去分析依赖关系，避免重复的子依赖冲突。

完整例子见：[cargo_deps_with_toml](https://github.com/xmake-io/xmake/blob/dev/tests/projects/rust/cargo_deps_with_toml/xmake.lua)

当然，如果用户的依赖比较单一，那么之前的集成方式还是完全可用。

#### 为什么使用 Xmake 编译 Rust?

这个时候，肯定会有人问，既然都用了 Cargo.toml 和 Cargo 了，为什么还要在 xmake.lua 中去配置呢，直接 Cargo 编译不就好了么。

如果我们是在用 Xmake 开发 C/C++ 项目，但是需要引入一些 Rust 子模块给 C/C++ 项目使用，那么就可以借助这种方式，快速方便地在 C/C++ 中调用 Rust 库和代码。

更多关于 C/C++ 中调用 Rust 代码库的说明，见：[使用 cxxbridge 在 C/C++ 中调用 Rust](https://xmake.io/zh/)

### 支持源文件分组

新版本，我们提供了一个新接口 `add_filegroups`，用于对 vs/vsxmake/cmakelists generator 生成的工程文件进行源文件分组展示。

如果不设置分组展示，Xmake 也会默认按照树状模式展示，但是有些极端情况下，目录层级显示不是很好，例如：

```lua
target("test")
    set_kind("binary")
    add_files("../../../../src/**.cpp")
```

![](/assets/img/manual/filegroup1.png)

目前主要支持两种展示模式：

- plain: 平坦模式
- tree: 树形展示，这也是默认模式

另外，它也支持对 `add_headerfiles` 添加的文件进行分组。

#### 设置分组并指定根目录

```lua
target("test")
    set_kind("binary")
    add_files("../../../../src/**.cpp")
    add_filegroups("group1/group2", {rootdir = "../../../../"})
```

![](/assets/img/manual/filegroup2.png)

#### 设置分组并指定文件匹配模式

```lua
target("test")
    set_kind("binary")
    add_files("../../../../src/**.cpp")
    add_filegroups("group1/group2", {rootdir = "../../../../", files = {"src/**.cpp"}})
```

#### 作为平坦模式展示

这种模式下，所有源文件忽略嵌套的目录层级，在分组下同一层级展示。

```lua
target("test")
    set_kind("binary")
    add_files("../../../../src/**.cpp")
    add_filegroups("group1/group2", {rootdir = "../../../../", mode = "plain"})
```

![](/assets/img/manual/filegroup3.png)

### 包版本选择支持 Git Commit

Xmake 的包依赖管理接口 `add_requires` 支持版本语义选择，分支选择，例如：

```lua
add_requires("tbox 1.6.1")
add_requires("tbox >=1.6.1")
add_requires("tbox master")
```

但是，之前的版本，我们还不支持从 Git Commit 中选择版本，而现在我们也支持上了。

```lua
add_requires("tbox e807230557aac69e4d583c75626e3a7ebdb922f8")
```

只要，这个包的配置中带有 Git url，就能从 Commit 中选择版本。

### 更好地支持 iOS 模拟器编译

如果要编译 iOS 平台目标程序，之前可以使用如下配置，仅仅通过切换 arch，就能分别编译真机，模拟器版本程序。

```bash
$ xmake f -p iphoneos [-a armv7|armv7s|arm64|i386|x86_64]
$ xmake
```

但是由于 M1 设备上模拟器也支持 arm64 架构，因此之前单纯从 arch 去区分是否为模拟器，已无法满足需求。
因此，在新版本中，我们新增了一个参数配置去区分是否为模拟器目标。

```bash
$ xmake f -p iphoneos --appledev=simulator
$ xmake f -p watchos --appledev=simulator
$ xmake f -p appletvos --appledev=simulator
```

而如果没有指定 `--appledev=` 参数，默认就是编译真机程序，当然，之前的模式也是完全兼容的。

## 更新内容

### 新特性

* [#2138](https://github.com/xmake-io/xmake/issues/2138): 支持模板包
* [#2185](https://github.com/xmake-io/xmake/issues/2185): 添加 `--appledev=simulator` 去改进 Apple 模拟器目标编译支持
* [#2227](https://github.com/xmake-io/xmake/issues/2227): 改进 cargo 包，支持指定 Cargo.toml 文件
* 改进 `add_requires` 支持 git command 作为版本
* [#622](https://github.com/xmake-io/xmake/issues/622): 支持远程编译
* [#2282](https://github.com/xmake-io/xmake/issues/2282): 添加 `add_filegroups` 接口为 vs/vsxmake/cmake generator 增加文件组支持

### 改进

* [#2137](https://github.com/xmake-io/xmake/pull/2137): 改进 path 模块
* macOS 下，减少 50% 的 Xmake 二进制文件大小
* 改进 tools/autoconf,cmake 去更好地支持工具链切换
* [#2221](https://github.com/xmake-io/xmake/pull/2221): 改进注册表 api 去支持 unicode
* [#2225](https://github.com/xmake-io/xmake/issues/2225): 增加对 protobuf 的依赖分析和构建支持
* [#2265](https://github.com/xmake-io/xmake/issues/2265): 排序 CMakeLists.txt
* 改进 os.files 的文件遍历速度

### Bugs 修复

* [#2233](https://github.com/xmake-io/xmake/issues/2233): 修复 c++ modules 依赖
