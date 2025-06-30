# Run targets {#run-targets}

Xmake provides a built-in `xmake run` command, which can quickly run the built target program without manually finding the corresponding executable file to run.

This will provide a lot of convenience, and it will also automatically bind the environment required for running to ensure that resources, dynamic libraries, etc. can be automatically loaded normally.

## Command format

```sh
$ xmake run [options] [target] [runargs]
```

:::tip NOTE
The options in front are the parameter options of `xmake run`, and the `runargs` behind are the executable parameters specific to the target target, which can be passed into the target target program as is.
:::

## Run a program

Usually we only need to execute `xmake run` to run all executable programs.

```sh
$ xmake run
hello world!
```

## Run a specific target program

If you want to run a specific target program, you can execute:

```sh
$ xmake run foo
```

## Run all programs

If target is configured as `default = false`, it will not be run by default.

```lua
target("test")
    set_default(false)
    add_files("src/*.c")
```

If you want to run all targets, including those with `default = false`, you can pass the `-a/--all` parameter.

```sh
$ xmake run -a
```

## Pass run parameters

We can also pass run parameters to internal target programs.

```sh
$ xmake run foo --arg1=xxx --arg2=yyy
```

:::tip NOTE
At this time, we cannot omit the target name, and must specify the target name to be run, otherwise it will cause parameter ambiguity.
:::

We can also use the [set_runargs](/zh/api/description/project-target#set-runargs) configuration interface of target to specify the incoming run parameters without having to specify it in the command line every time.

## Set the working directory for running

By default, the working directory of `xmake run` is in the directory where the executable file is located, which helps it to easily find some resources and dynamic libraries, and can also do some path isolation to avoid some programs generating files in the current project root directory.

If we want to change the working directory, we can specify it through the `-w workdir` parameter.

```sh
$ xmake run -w /tmp foo
```

We changed the running directory of the foo program to /tmp/ .

In addition, we can also specify the running parameters passed in through the target's [set_rundir](/zh/api/description/project-target#set-rundir) configuration interface, without having to specify it in the command line each time.

## Debugging programs

We can also pass the `-d` parameter to let `xmake run` load the debugger available in the current system environment while running the program, such as: gdb/lldb.

But the premise is that the current program must be compiled in debug mode, otherwise it will be difficult to debug because of the lack of necessary symbol information, and the call stack, line number and other information will not be visible.

```sh
$ xmake f -m debug
$ xmake
```

```sh
$ xmake run -d hello
```

Xmake will use the debugger to load the program and run. Currently, it supports various debuggers such as lldb, gdb, windbg, vsjitdebugger, ollydbg, etc.

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
-> 0x100000f50 <+0>: pushq %rbp
0x100000f51 <+1>: movq %rsp, %rbp
0x100000f54 <+4>: leaq 0x2b(%rip), %rdi ; "hello world!"
0x100000f5b <+11>: callq 0x100000f64 ; symbol stub for: puts
[lldb]$
```

In addition, we can also switch to a specific debugger:

```sh
$ xmake f --debugger=gdb
$ xmake run -d hello
```
