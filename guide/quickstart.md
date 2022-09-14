## Usage Video

[![asciicast](https://asciinema.org/a/133693.png)](https://asciinema.org/a/133693)

## Create Project

```bash
$ xmake create -l c -P ./hello
```

And xmake will generate some files for c language project:

```
hello
├── src
│   └── main.c
└── xmake.lua
```

It is a simple console program only for printing `hello xmake!`

The content of `xmake.lua` is very simple:

```lua
target("hello")
    set_kind("binary")
    add_files("src/*.c") 
```

Supported Languages

* C
* C++
* Objective-C and Objective-C++
* Swift
* Assembly
* Golang
* Rust
* Dlang
* Fortran
* Cuda
* Zig
* Vala
* Pascal
* Nim

<p class="tip">
    If you want to known more options, please run: `xmake create --help`
</p>

## Build Project

```bash
$ cd hello
$ xmake
```

## Run Program

```bash
$ xmake run hello
```

## Debug Program
to debug the hello,you can change the mode to debug
```bash
# xmake f -m debug, the f is the short command for config
$ xmake config -m debug 
$ xmake
```

```bash
#default clang in docker ,run the next command view lldb
#xmake l lib.detect.find_tool lldb
$ xmake run -d hello 
```

It will start the debugger (.e.g lldb, gdb, windbg, vsjitdebugger, ollydbg ..) to load our program.

to study more debug command,please click the url [GDB to LLDB command map](https://lldb.llvm.org/use/map.html)

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
    You can also use short command option, for example: `xmake r` or `xmake run`
</p>

