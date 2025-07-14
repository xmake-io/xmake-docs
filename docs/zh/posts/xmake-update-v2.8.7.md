---
title: Xmake v2.8.7 发布，新增 cosmocc 工具链支持，一次编译到处运行
tags: [xmake, lua, C/C++]
date: 2024-02-25
author: Ruki
---

[Xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具。

它非常的轻量，没有任何依赖，因为它内置了 Lua 运行时。

它使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

我们能够使用它像 Make/Ninja 那样可以直接编译项目，也可以像 CMake/Meson 那样生成工程文件，另外它还有内置的包管理系统来帮助用户解决 C/C++ 依赖库的集成使用问题。

目前，Xmake 主要用于 C/C++ 项目的构建，但是同时也支持其他 native 语言的构建，可以实现跟 C/C++ 进行混合编译，同时编译速度也是非常的快，可以跟 Ninja 持平。

```
Xmake = Build backend + Project Generator + Package Manager + [Remote|Distributed] Build + Cache
```

尽管不是很准确，但我们还是可以把 Xmake 按下面的方式来理解：

```
Xmake ≈ Make/Ninja + CMake/Meson + Vcpkg/Conan + distcc + ccache/sccache
```

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](/zh/about/course)

## 新特性介绍

新版本中，我们新增了 cosmocc 工具链支持，使用它，我们可以实现一次编译，到处运行。另外，我们还重构了 C++ Modules 的实现，解决了很多 C++ Modules 相关的问题。

### Cosmocc 工具链支持

cosmocc 工具链是 [cosmopolitan](https://github.com/jart/cosmopolitan) 项目提供的编译工具链，使用这个工具链编译的程序可以实现一次编译，到处运行。

而新版本中，我们对这个工具链也做了支持，可以实现在 macosx/linux/windows 下编译程序，并且还能够支持自动下载 cosmocc 工具链。

对于用户，仅仅只需要配置 xmake.lua 工程文件，然后执行 `xmake` 命令，即可实现一键编译，到处运行。

xmake.lua 内容如下，这是一个最基础的 hello world 终端程序的构建配置。

```lua
add_rules("mode.debug", "mode.release")

add_requires("cosmocc")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("@cosmocc")
```

然后，我们执行 xmake 命令，它会先下载集成 cosmocc 工具链，然后使用这个工具链去编译程序。

```bash
ruki:console$ xmake
checking for platform ... linux
checking for architecture ... x86_64
note: install or modify (m) these packages (pass -y to skip confirm)?
in xmake-repo:
  -> cosmocc 3.2.4
please input: y (y/n/m)

  => install cosmocc 3.2.4 .. ok
[ 25%]: cache compiling.release src/main.c
[ 50%]: linking.release test
[100%]: build ok, spent 1.548s
ruki:console$ xmake run
hello world
```







### C++ Modules 改进

非常感谢 @Arthapz 对 C++ Modules 做了大量的改进工作，使得 xmake 更好地支持 C++ Modules 构建，也修复了很多已知的问题，例如 msys2/mingw 下对 C++ Modules 编译支持等问题。

### 改进 xmake test

2.8.5 版本开始，我们增加了内置的测试命令：`xmake test`，我们只需要在需要测试的 target 上通过 add_tests 配置一些测试用例，就可以自动执行测试。

执行的效果如下：

```bash
ruki-2:test ruki$ xmake test
running tests ...
[  2%]: test_1/args        .................................... passed 7.000s
[  5%]: test_1/default     .................................... passed 5.000s
[  8%]: test_1/fail_output .................................... passed 5.000s
[ 11%]: test_1/pass_output .................................... passed 6.000s
[ 13%]: test_2/args        .................................... passed 7.000s
[ 16%]: test_2/default     .................................... passed 6.000s
[ 19%]: test_2/fail_output .................................... passed 6.000s
[ 22%]: test_2/pass_output .................................... passed 6.000s
[ 25%]: test_3/args        .................................... passed 7.000s
...
[ 77%]: test_7/pass_output .................................... failed 5.000s
[ 80%]: test_8/args        .................................... passed 7.000s
[ 83%]: test_8/default     .................................... passed 6.000s
[ 86%]: test_8/fail_output .................................... passed 6.000s
[ 88%]: test_8/pass_output .................................... failed 5.000s
[ 91%]: test_9/args        .................................... passed 6.000s
[ 94%]: test_9/default     .................................... passed 6.000s
[ 97%]: test_9/fail_output .................................... passed 6.000s
[100%]: test_9/pass_output .................................... passed 6.000s

80% tests passed, 7 tests failed out of 36, spent 0.242s
```

而新版本中，我们新增了对超时运行的测试支持。

如果一些测试程序长时间运行不退出，就会卡住，我们可以通过配置超时时间，强制退出，并返回失败。

```lua
target("test_timeout")
    set_kind("binary")
    set_default(false)
    add_files("src/run_timeout.cpp")
    add_tests("run_timeout", {run_timeout = 1000})
```

上面的配置中，我们通过 `{run_timeout = 1000}` 可以配置指定的测试程序运行的超时时间，如果运行超时，就会作为测试失败。

```bash
$ xmake test
[100%]: test_timeout/run_timeout .................................... failed 1.006s
run failed, exit code: -1, exit error: wait process timeout
```


### 支持 Android NDK r26b

自从 Android NDK r26b 之后，NDK 对内部构建工具链的结构做了很大的改动，完全采用 llvm clang 来构建程序，因此新版本 xmake 对它做了一些适配，使得能够继续很好地支持新的 NDK。

### 改进运行时配置

另外，我们还改进了 `set_runtimes` 接口，除了先前已经支持的 `MT/MD/MTd/MDd` 等 windows msvc 的运行时库配置，还新增了 `c++_static`, `c++_shared`, `stdc++_static`, `stdc++_shared` 等库配置，

它们用于 clang/gcc 的 c++ 运行时库配置。而对于 Android 平台编译， 我们也将已有的 `xmake f --ndk_cxxstl=` 等配置，也合并统一到 `xmake f --runtimes=` 中，与 `set_runtimes` 相对应。

除了设置，我们也可以在 target 中，通过 `target:runtimes()` 和 `target:has_runtime()` 等接口去获取和判断当前的 runtimes 库，在 package 中，也有一样的接口可用。

例如：

```lua
target("test")
    add_files("src/*.cpp")
    on_load(function (target)
        if target:has_runtime("c++_shared", "c++_static") then
            -- TODO
        end
    end)
```

如果 `c++_static` 配置生效，在 Clang 编译的时候，就会被自动添加 `-stdlib=libc++ -static-libstdc++` 等 flags，而如果 `stdc++_static` 则对应 `-stdlib=slibtdc++`。

### 改进脚本匹配模式

xmake 中的所有 `on_xxx`, `before_xxx` 和 `after_xxx` 等脚本配置接口，都可以在第一个参数中，设置脚本能够被运行的平台架构模式。

如果指定的模式和当前架构模式匹配，配置的脚本才能够被执行，它的完整的过滤语法如下：`plat|arch1,arch2@host|arch1,arch2`

看上去非常的复杂，其实很简单，其中每个阶段都是可选的，可部分省略，对应：`编译平台|编译架构@主机平台|主机架构`

如果不设置任何平台过滤条件，那么默认全平台支持，里面的脚本对所有平台生效，例如：

```lua
on_install(function (package)
    -- TODO
end)
```

如果安装脚本对特定平台生效，那么直接指定对应的编译平台，可以同时指定多个：

```lua
on_install("linux", "macosx", function (package)
    -- TODO
end)
```

如果还要细分到指定架构才能生效，可以这么写：


```lua
on_install("linux|x86_64", "iphoneos|arm64", function (package)
    -- TODO
end)
```

如果还要限制执行的主机环境平台和架构，可以在后面追加`@host|arch`，例如：

```lua
on_install("mingw@windows", function (package)
    -- TODO
end)
```

意思就是仅对windows下编译mingw平台生效。

我们也可以不指定比那一平台和架构，仅设置主机平台和架构，这通常用于描述一些跟编译工具相关的依赖包，只能在主机环境运行。

例如，我们编译的包，依赖了cmake，需要添加cmake的包描述，那么里面编译安装环境，只能是主机平台：

```lua
on_install("@windows", "@linux", "@macosx", function (package)
    -- TODO
end)
```

其他一些例子：

```lua
-- `@linux`
-- `@linux|x86_64`
-- `@macosx,linux`
-- `android@macosx,linux`
-- `android|armeabi-v7a@macosx,linux`
-- `android|armeabi-v7a@macosx,linux|x86_64`
-- `android|armeabi-v7a@linux|x86_64`
```

而在 2.8.7 中，我们改进了模式匹配支持，新增排除指定平台和架构，例如：

```
!plat|!arch@!subhost|!subarch
```

```bash
@!linux
@!linux|x86_64
@!macosx,!linux
!android@macosx,!linux
android|!armeabi-v7a@macosx,!linux
android|armeabi-v7a,!iphoneos@macosx,!linux|x86_64
!android|armeabi-v7a@!linux|!x86_64
!linux|*
```

同时，还提供了一个内置的 `native` 架构，用于匹配当前平台的本地架构，主要用于指定或者排除交叉编译平台。

```lua
on_install("macosx|native", ...)
```

上面的配置，如果在 macOS x86_64 的设备上，它仅仅只会匹配 `xmake f -a x86_64` 的本地架构编译。

如果是 `xmake f -a arm64` 交叉编译，就不会被匹配到。

同理，如果只想匹配交叉编译，可以使用 `macosx|!native` 进行取反排除就行了。

这个模式改进，其实主要用于仓库包配置的简化，更好的处理不同平台下包安装脚本的配置支持。

## 更新日志

### 新特性

* [#4544](https://github.com/xmake-io/xmake/issues/4544): 改进 `xmake test`，支持等待进程超时
* [#4606](https://github.com/xmake-io/xmake/pull/4606): 为 package 添加 `add_versionfiles` 接口
* [#4709](https://github.com/xmake-io/xmake/issues/4709): 添加 cosmocc 工具链支持
* [#4715](https://github.com/xmake-io/xmake/issues/4715): 在描述域添加 is_cross() 接口
* [#4747](https://github.com/xmake-io/xmake/issues/4747): 添加 `build.always_update_configfiles` 策略

### 改进

* [#4575](https://github.com/xmake-io/xmake/issues/4575): 检测无效的域参数
* 添加更多的 loong64 支持
* 改进 dlang/dmd 对 frameworks 的支持
* [#4571](https://github.com/xmake-io/xmake/issues/4571): 改进 `xmake test` 的输出支持
* [#4609](https://github.com/xmake-io/xmake/issues/4609): 改进探测 vs 构建工具环境
* [#4614](https://github.com/xmake-io/xmake/issues/4614): 改进支持 android ndk 26b
* [#4473](https://github.com/xmake-io/xmake/issues/4473): 默认启用警告输出
* [#4477](https://github.com/xmake-io/xmake/issues/4477): 改进 runtimes 去支持 libc++/libstdc++
* [#4657](https://github.com/xmake-io/xmake/issues/4657): 改进脚本的模式匹配
* [#4673](https://github.com/xmake-io/xmake/pull/4673): 重构模块支持
* [#4746](https://github.com/xmake-io/xmake/pull/4746): 为 cmake generator 添加原生 c++ modules 支持

### Bugs 修复

* [#4596](https://github.com/xmake-io/xmake/issues/4596): 修复远程构建缓存
* [#4689](https://github.com/xmake-io/xmake/issues/4689): 修复目标依赖继承
