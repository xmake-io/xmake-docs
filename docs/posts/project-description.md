---
title: Introduction to xmake Project Description
tags: [xmake, premake]
date: 2016-02-03
author: Ruki
outline: deep
---

xmake's project description file abandons the tedious complexity of makefiles, learns from premake's simplicity and clarity, and natively supports lua scripts, making it more flexible and convenient to extend.

The default project description file name is `xmake.lua`, which supports multi-level directory nesting. You can also specify other files as project description files through the following commands:

```bash
    xmake -f /tmp/xxx.lua
    xmake --file=xxx.lua
```

Let's first look at the simplest example:

```lua
    -- Add a target named demo to the project
    target("demo")

        -- Set target program type to binary executable, generally a console terminal command-line program
        set_kind("binary")

        -- Add all c files in src directory
        add_files("src/*.c") 
```

How simple is that? This has already completed the simplest project description.

Let's look at a slightly more complex example. In this example, different settings are made for release and debug modes:

```lua
    -- If currently compiling in debug mode
    if is_mode("debug") then
        
        -- Enable debug symbols
        set_symbols("debug")

        -- Disable optimization
        set_optimize("none")
    end

    -- If currently compiling in release mode
    if is_mode("release") then

        -- Set symbol visibility to hidden
        set_symbols("hidden")

        -- Enable fastest optimization mode
        set_optimize("fastest")

        -- Strip all symbol information, including debug symbols
        set_strip("all")
    end

    -- Add a target named test
    target("test")

        -- Compile test as static library type
        set_kind("static")

        -- Add all c++ files, including subdirectories (Note: ** indicates multi-level recursive matching pattern)
        add_files("src/**.cpp") 
```

Actually, it's not very complicated. Since lua syntax is used, the logic is more flexible. You can completely use lua's branching, loops, functions and other syntax for more flexible configuration.

