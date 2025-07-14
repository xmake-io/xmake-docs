---
title: Running and debugging program using xmake
tags: [xmake, symbolfile, run, debug, windbg, ollydbg, windows]
date: 2016-07-25
author: Ruki
---

xmake can run and debug the given target program now.

We only need configure the debug mode to compile this target and run it.

e.g.

```lua

-- enable debug symbols
if is_mode("debug")
    set_symbols("debug")
end

-- define target
target("demo")
    set_kind("kind")
    add_files("src/*.c")
```

And we compile and run this program with the debug symbols.

```bash
$ xmake f -m debug
$ xmake r -d demo
```

It will generate pdb debug symbol files and detect the default debugger automatically on windows. (.e.g vsjitdebugger, windbg, ollydbg ...)

![vsjitdebugger](/assets/img/posts/xmake/vsjitdebugger.png)





![ollydbg](/assets/img/posts/xmake/ollydbg.png)


And we can set the given third-party debugger manually.


```bash
$ xmake f --dd="C:\Program Files\Debugging Tools for Windows (x86)\windbg.exe"
$ xmake r -d demo 
```

Or we set it to the global configuration.

```bash
$ xmake g --dd="C:\Program Files\Debugging Tools for Windows (x86)\windbg.exe"
```

xmake will load the debugger (lldb or gdb ..) to debug program in default case on macosx and linux.

```bash
$ xmake r -d demo

$ [lldb]$target create "build/demo"
  Current executable set to 'build/demo' (x86_64).
$ [lldb]$
```