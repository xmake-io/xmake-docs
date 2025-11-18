---
title: xmake从入门到精通3：运行和调试目标程序
tags: [xmake, lua, c/c++, 运行, 调试]
date: 2019-11-09
author: Ruki
outline: deep
---

xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。

本文主要详细讲解如何加载运行编译好的目标程序，以及如何去调试。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

### 运行生成目标

xmake也提供了run命令，直接运行生成后的可执行文件，用于方便快速的进行测试，例如：

```bash
$ xmake run
hello xmake!
```

#### 添加运行环境变量

我们也可以在xmake.lua中通过`add_runenvs`接口来添加设置默认运行target程序的环境变量。

所以，对于PATH这种，通过此接口追加值是非常方便的，而且此接口支持多值设置，所以通常就是用来设置带有path sep的多值env。。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_runenvs("PATH", "/tmp/bin", "xxx/bin")
    add_runenvs("LD_LIBRARY_PATH", "/tmp/lib", "xxx/lib")
```

更多关于此接口的描述，可以看下文档：[add_runenvs接口文档](https://xmake.io/zh/)






#### 自定义运行逻辑

如果单纯的环境设置，以及默认的加载运行规则不满足需求，我们可以通过定制化`on_run`脚本，实现更加复杂的运行逻辑：

例如，运行安装好的apk程序：

```lua
target("test")
    -- ...
    -- 设置自定义运行脚本，自动运行安装好的app程序，并且自动获取设备输出信息
    on_run(function (target) 
        os.run("adb shell am start -n com.demo/com.demo.DemoTest")
        os.run("adb logcat")
    end)
```

### 调试程序

#### 命令行调试

我们也可以传递`-d`参数，调用gdb/lldb等调试器程序，加载目标文件进行调试：


```bash
$ xmake run -d  
```

xmake将会使用系统自带的调试器去加载程序运行，目前支持：lldb, gdb, windbg, vsjitdebugger, ollydbg 等各种调试器。

```bash
[lldb]$target create "build/hello"
Current executable set to 'build/hello' (x86_64).
[lldb]$b main
Breakpoint 1: where = hello`main, address = 0x0000000100000f50
[lldb]$r
Process 7509 launched: '/private/tmp/hello/build/hello' (x86_64)
Process 7509 stopped
* thread #1: tid = 0x435a2, 0x0000000100000f50 hello`main, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x0000000100000f50 hello`main
hello`main:
->  0x100000f50 <+0>:  pushq  %rbp
    0x100000f51 <+1>:  movq   %rsp, %rbp
    0x100000f54 <+4>:  leaq   0x2b(%rip), %rdi          ; "hello world!"
    0x100000f5b <+11>: callq  0x100000f64               ; symbol stub for: puts
[lldb]$
```

#### 使用vscode进行断点调试

我们还可以通过[xmake-vscode](https://github.com/xmake-io/xmake-vscode)插件配合vscode来实现对c/c++项目的断点调试支持。

另外我们还需要依赖vscode的C++插件才能进行调试支持，不过由于开发c/c++程序，这个插件几乎是必需，所以并没有太大问题。

就算没有安装此插件，xmake-vscode也会加载lldb/gdb/vsjitdebugger等系统调试器，直接加载调试。

<img src="/assets/img/posts/xmake/xmake-vscode-debug.gif">