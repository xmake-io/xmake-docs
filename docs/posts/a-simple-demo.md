---
title: A simple xmake.lua
tags: [xmake, example, xmake.lua]
date: 2016-06-26
author: Ruki
---

A simplest xmake.lua

```lua
    -- define a target with named 'demo'
    target("demo")

        -- set the target kind, .e.g 'binary' is a console program
        -- - static: a static library
        -- - shared: a shared library
        set_kind("binary")

        -- add all c source files in the directory: src
        add_files("src/*.c") 
```

And we run the following command for building it.

```bash
    xmake
```


Next, we write another xmake.lua for switching 'debug' or 'release' mode.

```lua
    -- is debug now?
    if is_mode("debug") then
        
        -- enable debug symbols for debugger
        set_symbols("debug")

        -- disable optimization
        set_optimize("none")
    end

    -- is release now?
    if is_mode("release") then

        -- set visibility as hidden
        set_symbols("hidden")

        -- enable optimization for fastest mode
        set_optimize("fastest")

        -- strip all symbols
        set_strip("all")
    end

    -- define a target
    target("test")

        -- set the program kind as a static library
        set_kind("static")

        -- add all c++ files recursively
        add_files("src/**.cpp") 
```

We configure this project with the debug mode now.

```bash
    xmake f -m debug
    #xmake config --mode=debug
```

And we build it.

```bash
    xmake
```