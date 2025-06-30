# 运行目标 {#run-targets}

Xmake 提供了内置的 `xmake run` 命令，可以快速的运行被构建的目标程序，而无需手动找到对应的可执行文件来运行。

这会提供许多的便利，并且它还会自动绑定运行需要的环境，确保资源，动态库等都能正常被自动加载。

## 命令格式

```sh
$ xmake run [options] [target] [runargs]
```

:::tip 注意
前面的 options 是 `xmake run` 的参数选项，而后面的 `runargs` 是特定于 target 目标的可执行参数，可以原样传递进 target 目标程序内部。
:::

## 运行一个程序

通常我们只需要执行 `xmake run` 即可运行所有的可执行程序。

```sh
$ xmake run
hello world!
```

## 运行特定的目标程序

如果要运行指定的目标程序，可以执行：

```sh
$ xmake run foo
```

## 运行所有程序

如果 target 被配置为 `default = false`，那么默认是不会运行它的。

```lua
target("test")
    set_default(false)
    add_files("src/*.c")
```

如果想要运行所有目标， 包括这些 `default = false` 的目标程序，那么可以传递 `-a/--all` 参数。

```sh
$ xmake run -a
```

## 传递运行参数

我们还可以传递运行参数给内部的目标程序。

```sh
$ xmake run foo --arg1=xxx --arg2=yyy
```

:::tip 注意
这个时候，我们不能省略目标名称，必须指定需要运行的目标名，否则会导致参数歧义。
:::

我们也可以通过 target 的 [set_runargs](/zh/api/description/project-target#set-runargs) 配置接口，来指定传入的运行参数，而不需要每次命令行指定它。

## 设置运行的工作目录

默认情况下，`xmake run` 的工作目录是在可执行文件所在的目录，这有助于它能够方便的找到一些资源和动态库，也能做一些路径隔离，避免一些程序生成文件到当前工程根目录下。

如果我们想修改工作目录，我们可以通过 `-w workdir` 参数来指定。

```sh
$ xmake run -w /tmp foo
```

我们将 foo 程序的运行目录改成了 /tmp/ 。

另外，我们也可以通过 target 的 [set_rundir](/zh/api/description/project-target#set-rundir) 配置接口，来指定传入的运行参数，而不需要每次命令行指定它。

## 调试程序

我们也可以传递 `-d` 参数，让 `xmake run` 在运行程序的同时，加载当前系统环境可用的调试器，例如：gdb/lldb。

但前提是，当前程序必须是调试模式编译的，否则会因为缺少必要的符号信息，看不到调用栈，行号等信息，不便于调试。

```sh
$ xmake f -m debug
$ xmake
```

```sh
$ xmake run -d hello
```

Xmake 将会使用调试器去加载程序运行，目前支持：lldb, gdb, windbg, vsjitdebugger, ollydbg 等各种调试器。

```sh
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

另外，我们也能够切换使用指定的调试器：

```sh
$ xmake f --debugger=gdb
$ xmake run -d hello
```

