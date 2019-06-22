## 用法视频

[![asciicast](https://asciinema.org/a/133693.png)](https://asciinema.org/a/133693)

## 创建工程

创建一个名叫`hello`的`c`控制台工程：

```bash
$ xmake create -l c -P ./hello
```

执行完后，将会生成一个简单工程结构：

```
hello
├── src
│   └── main.c
└── xmake.lua
```

其中`xmake.lua`是工程描述文件，内容非常简单，告诉xmake添加`src`目录下的所有`.c`源文件：

```lua
target("hello")
    set_kind("binary")
    add_files("src/*.c") 
```

目前支持的语言如下：

* c/c++
* objc/c++
* cuda
* asm
* swift
* dlang
* golang
* rust

<p class="tip">
    如果你想了解更多参数选项，请运行: `xmake create --help`
</p>

## 构建工程

```bash
$ xmake
```

## 运行程序

```bash
$ xmake run hello
```

## 调试程序

```bash
$ xmake run -d hello 
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

<p class="tip">
    你也可以使用简写的命令行选项，例如: `xmake r` 或者 `xmake run`
</p>

