---
title: Advanced Feature: Custom Task
tags: [xmake, task, custom script, plugin]
date: 2016-06-09
author: Ruki
outline: deep
---

`task` is a new feature starting from xmake 2.0 and is also the core of plugin development. In [Plugin Development: Hello xmake](https://xmake.io/) we briefly introduced the definition and usage of tasks.

Of course, tasks can not only be used to write plugins, but also to write some simple custom tasks.

Let's first look at a simple task implementation:

```lua
    -- Define a task named hello
    task("hello")

        -- Entry point for task execution
        on_run(function ()

            -- Display hello xmake!
            print("hello xmake!")

        end)
```

This is the simplest task. Compared to plugin tasks, it lacks the `set_menu` setting. Of course, you can also add it, so it can be called from the command line.

And this `hello` task doesn't have `set_menu` set, so it can only be called in custom scripts.

```lua
    target("demo")

        -- Custom clean action
        on_clean(function(target)

            -- Import task module
            import("core.project.task")

            -- Run this hello task
            task.run("hello")
        end)
```

If you want to add parameter passing, there are two ways:

1. Add a command-line option menu through `set_menu`, and access parameters through the `option` module (supports command-line and script parameter passing)
2. Directly pass parameters through scripts

Let's first look at the second method, which is simpler. It doesn't need to define a command-line menu. You only need to agree on parameter rules between the task definition and the call site:

```lua
    -- Direct parameter passing, {} is for the first option parameter passing, leave it empty here
    -- Here we pass two parameters at the end: arg1, arg2
    task.run("hello", {}, "arg1", "arg2")
```

So how to get these two parameters?

```lua
    -- Define a task named hello
    task("hello")

        -- Entry point for task execution, defined with two parameters
        on_run(function (arg1, arg2)

            -- Display hello xmake!
            print("hello xmake: %s %s!", arg1, arg2)

        end)
```

How simple is that? Of course, this parameter passing method cannot pass parameters externally through the command line, so it's generally used for some built-in task calls. For advanced tasks like plugins, the first parameter passing method is needed.

For details, please refer to: [Plugin Development: Parameter Configuration](https://xmake.io/)

