---
title: Xmake v2.8.3 发布，改进 Wasm 并支持 Xmake 源码调试
tags: [xmake, lua, C/C++, package, API, rust]
date: 2023-09-26
author: Ruki
---

## 新特性介绍

新版本中，我们新增了 Xmake 自身源码的断点调试支持，这可以帮助贡献者更加快速的熟悉 xmake 源码，也可以帮助用户去快速调试分析自身项目的配置脚本。

另外，我们 [xmake-repo](https://github.com/xmake-io/xmake-repo) 官方仓库包的数量也即将突破 1100，短短一个月的时间，就新增了 100 多个包，非常感谢 @star-hengxing 的贡献。

同时，我们重点改进了 Wasm 的构建支持，以及 Qt6 for wasm 的支持。

### 断点调试 Xmake 源码

2.8.3 版本，我们新增了 Lua 断点调试支持，配合 [VSCode-EmmyLua](https://github.com/EmmyLua/VSCode-EmmyLua) 插件，我们可以很方便的在 VSCode 中断点调试 Xmake 自身源码。

首先，我们需要在 VSCode 的插件市场安装 VSCode-EmmyLua 插件，然后执行下面的命令更新下 xmake-repo 仓库保持最新。

```bash
xrepo update-repo
```

:::注意
Xmake 也需要保持最新版本。
:::

然后，在自己的工程目录下执行以下命令：

```bash
$ xrepo env -b emmylua_debugger -- xmake build
```

其中 `xrepo env -b emmylua_debugger` 用于绑定 EmmyLua 调试器插件环境，而 `--` 后面的参数，就是我们实际需要被调试的 xmake 命令。

通常我们仅仅调试 `xmake build` 构建，如果想要调试其他命令，可以自己调整，比如想要调试 `xmake install -o /tmp` 安装命令，那么可以改成：

```bash
$ xrepo env -b emmylua_debugger -- xmake install -o /tmp
```

执行完上面的命令后，它不会立即退出，会一直处于等待调试状态，有可能没有任何输出。

这个时候，我们不要急着退出它，继续打开 VSCode，并在 VSCode 中打开 Xmake 的 Lua 脚本源码目录。

也就是这个目录：[Xmake Lua Scripts](https://github.com/xmake-io/xmake/tree/master/xmake)，我们可以下载的本地，也可以直接打开 Xmake 安装目录中的 lua 脚本目录。

然后切换到 VSCode 的调试 Tab 页，点击 `RunDebug` -> `Emmylua New Debug` 就能连接到我们的 `xmake build` 命令调试端，开启调试。

如下图所示，默认的起始断点会自动中断到 `debugger:_start_emmylua_debugger` 内部，我们可以点击单步跳出当前函数，就能进入 main 入口。

![](/assets/img/manual/xmake-debug.png)

然后设置自己的断点，点击继续运行，就能中断到自己想要调试的代码位置。

我们也可以在项目工程的配置脚本中设置断点，也可以实现快速调试自己的配置脚本，而不仅仅是 Xmake 自身源码。

![](/assets/img/manual/xmake-debug2.png)






### 远程调试 Xmake 源码

2.8.3 版本现在也能支持远程调试，其实这个功能主要是给作者用的，因为作者本人的开发电脑是 mac，但是有时候还是需要能够在 windows 上调试 xmake 源码脚本。

但是在虚拟机中调试，太卡，体验不好，并且作者本人的电脑磁盘空间不够，因此我通常会远程连到单独的 windows 主机上去调试 xmake 源码。

我们先在 windows 机器上开启远程编译服务：

```bash
$ xmake service
```

然后本机打开需要构建的工程目录，执行远程连接，然后执行 `xmake service --sync --xmakesrc=` 去同步本地源码：

```bash
$ xmake service --connect
$ xmake service --sync --xmakesrc=~/projects/personal/xmake/xmake/
$ xmake build
$ xmake run
```

这样，我们就能本地修改 xmake 脚本源码，然后同步到远程 windows 机器上，然后远程执行 xmake 构建命令，获取对应的调试输出，以及分析构建行为。

我们也能够通过 `xmake service --pull=` 命令，回拉远程的文件到本地，进行分析。

注：详细的远程编译特性说明，见 [远程编译文档](https://xmake.io/#/zh-cn/features/remote_build)。

![](/assets/img/manual/xmake-remote.png)

### 支持 Cppfront 程序

我么也新增了一个构建规则，用于支持 [cppfront](https://github.com/hsutter/cppfront) 程序的编译：

```bash
add_rules("mode.debug", "mode.release")

add_requires("cppfront")

target("test")
    add_rules("cppfront")
    set_kind("binary")
    add_files("src/*.cpp2")
    add_packages("cppfront")
```

### 新增 utils.hlsl2spv 构建规则

早期我们已经提供了 `utils.glsl2spv` 规则去支持 glsl 的编译和使用，现在我们又新增了 `utils.hlsl2spv` 规则，实现对 hlsl 的编译支持。

```bash
add_rules("mode.debug", "mode.release")

add_requires("glslang", {configs = {binaryonly = true}})

target("test")
    set_kind("binary")
    add_rules("utils.hlsl2spv", {bin2c = true})
    add_files("src/*.c")
    add_files("src/*.hlsl", "src/*.hlsl")
    add_packages("directxshadercompiler")
```

关于这个规则的详细描述，可以参考文档：[utils.glsl2spv](https://xmake.io/zh/)，两者的使用方式和原理都是类似的。

### 新增 lib.lua.package 模块

Xmake 默认会限制对 lua 原生模块和接口的访问，而这个模块主要用于开放一些 lua 原生提供的 API，用户可以按需使用。

目前，它仅仅提供了 `package.loadlib` 接口，用于加载本地 so/dylib/dll 动态库中的 lua 模块。

这通常用于一些高性能要求的场景。

```lua
import("lib.lub.package")

local script = package.loadlib("/xxx/libfoo.so", "luaopen_mymodule")
local mymodule = script()
mymodule.hello()
```

### 改进 Address sanitizer 支持

Address Sanitizer（ASan）是一个快速的内存错误检测工具，由编译器内置支持，通常我们需要在编译和链接的 flags 中同时配置 `-fsanitize-address` 才能正确开启。

而之前的版本中，我们是通过配置 `add_rules("mode.asan")` 然后 `xmake f -m asan` 去切换构建模式的方式来支持。

但这会有一些问题：

1. 不能对依赖包生效
2. 需要切换构建模式
3. 不能同时检测 asan 和 ubsan

因此，新版本中，我们改用 policy 去更好的支持它们。

而我们可以通过开启 `build.sanitizer.address` 策略，就可以快速全局启用它，这会使得编译出来的程序，直接支持 ASan 检测。

例如，我们可以通过命令行的方式去启用：

```bash
$ xmake f --policies=build.sanitizer.address
```

也可以通过接口配置去全局启用：

```lua
set_policy("build.sanitizer.address", true)
```

当然，我们也可以单独对某个特定的 target 去配置开启，另外，如果全局配置它，我们就可以同时对所有依赖包也生效。

```lua
set_policy("build.sanitizer.address", true)

add_requires("zlib")
add_requires("libpng")
```

它等价于，对每个包依次设置 asan 配置。

```lua
add_requires("zlib", {configs = {asan = true}})
add_requires("libpng", {configs = {asan = true}})
```

另外，我们也可以同时生效多个 sanitizer 检测，例如：

```lua
set_policy("build.sanitizer.address", true)
set_policy("build.sanitizer.undefined", true)
```

或者

```bash
$ xmake f --policies=build.sanitizer.address,build.sanitizer.undefined
```

除了 Asan，我们还提供了其他类似的 policies，用于检测线程，内存泄漏等问题。

- build.sanitizer.thread
- build.sanitizer.memory
- build.sanitizer.leak
- build.sanitizer.undefined


### 运行前自动构建

我们新增了 `run.atuobuild` 策略用于调整 `xmake run` 的行为，默认情况下，执行 `xmake run` 并不会自动构建目标程序，如果程序还没被编译，就是提示用户手动构建一下。

而开启这个策略，我们就可以在运行程序前，先自动构建对应的目标程序。

```bash
$ xmake f --policies=run.autobuild
$ xmake run
```

如果想要全局生效这个策略，可以全局开启它。

```bash
$ xmake g --policies=run.autobuild
```

### 浅构建指定目标

当我们指定重新构建某个目标的时候，如果它有很多的依赖目标，那么通常都会全部被重新构建。

```bash
$ xmake --rebuild foo
rebuild foo
rebuild foo.dep1
rebuild foo.dep2
...
```

这对于一些大型项目，依赖了大量 target 时候，非常影响编译速度，几乎等于大半个项目都要被重新构建。

新版本中，我们新增了 `--shallow` 参数，用于告诉 Xmake，当前仅仅重新构建指定的 target，它的所有依赖不需要被全部重新编译。

```bash
$ xmake --rebuild --shallow foo
only rebuild foo
```

### 改进警告设置

`set_warnings` 接口新增 `extra` 和 `pedantic` 设置，并且支持多个警告值组合。

```lua
set_warnings("all", "extra")
set_warnings("pedantic")
```

### 改进 Wasm 构建

现在，我们可以通过下面的配置，自己拉取 emscripten 工具链，并自动使用它去构建 wasm 程序。

```lua
if is_plat("wasm") then
    add_requires("emscripten")
    set_toolchains("emcc@emscripten")
end
```

仅仅只需要执行

```bash
$ xmake f -p wasm
$ xmake
```

就可以完成 wasm 程序构建，用户可以不用自己手动安装 emscripten，更加的方便。

另外，我们也对 Qt6 for wasm 做了很好的支持。

## 更新日志

### 新特性

* [#4122](https://github.com/xmake-io/xmake/issues/4122): 支持 Lua 调试 (EmmyLua)
* [#4132](https://github.com/xmake-io/xmake/pull/4132): 支持 cppfront
* [#4147](https://github.com/xmake-io/xmake/issues/4147): 添加 hlsl2spv 规则
* 添加 lib.lua.package 模块
* [#4226](https://github.com/xmake-io/xmake/issues/4226): 新增 asan 相关策略和对包的支持
* 添加 `run.autobuild` 策略开启运行前自动构建
* 添加全局策略 `xmake g --policies=`

### 改进

* [#4119](https://github.com/xmake-io/xmake/issues/4119): 改进支持 emcc 工具链和 emscripten 包的整合
* [#4154](https://github.com/xmake-io/xmake/issues/4154): 添加 `xmake -r --shallow target` 去改进重建目标，避免重建所有依赖目标
* 添加全局 ccache 存储目录
* [#4137](https://github.com/xmake-io/xmake/issues/4137): 改进 Qt，支持 Qt6 for Wasm
* [#4173](https://github.com/xmake-io/xmake/issues/4173): 添加 recheck 参数到 on_config
* [#4200](https://github.com/xmake-io/xmake/pull/4200): 改进远程构建，支持调试本地 xmake 源码
* [#4209](https://github.com/xmake-io/xmake/issues/4209): 添加 extra 和 pedantic 警告

### Bugs 修复

* [#4110](https://github.com/xmake-io/xmake/issues/4110): 修复 extrafiles
* [#4115](https://github.com/xmake-io/xmake/issues/4115): 修复 compile_commands 生成器
* [#4199](https://github.com/xmake-io/xmake/pull/4199): 修复 compile_commands 生成器对 c++ modules 的支持
* 修复 os.mv 在 windows 上跨驱动盘失败问题
* [#4214](https://github.com/xmake-io/xmake/issues/4214): 修复 rust workspace 构建问题
