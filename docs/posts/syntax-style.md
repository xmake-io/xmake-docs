---
title: Two Syntax Styles of xmake
tags: [xmake, syntax, style]
date: 2016-11-15
author: Ruki
---

Recently, xmake's description syntax has been enhanced to support two different grammar styles at the same time.

* The `set-add` style
* The `key-val` style

#### The `set-add` style

This is xmake's classic style, for example:

```lua
target("test")
    set_kind("static")
    add_defines("DEBUG")
    add_files("src/*.c", "test/*.cpp")
```

* Advantages: more flexible control, you can control a variety of highly complex configuration requirements.
* Disadvantages: scope control is not obvious, need to manually standardized indentation

#### The `key-val` style

This is added style recently, for example:

```lua
target
{
    name = "test",
    defines = "DEBUG",
    files = {"src/*.c", "test/*.cpp"}
}
```

* Advantages: more readable
* Disadvantages: conditional compilation is not very flexible





These two styles, xmake are currently compatible with the support, but our recommendations are:

* For simple projects, do not need too complicated conditional compilation, you can use the key-val way, more streamlined, good readability
* For complex engineering, the need for greater control, and flexibility, it is recommended to use set-add way
* Try not to mix and write the two styles, although it is supported, but this description of the entire project will feel confused, so try to unify the style as their description of the specification

In addition, not only for target, like option, task, template are supported in two ways to write, for example:

```lua
-- set-add style
option("demo")
    set_default(true)
    set_showmenu(true)
    set_category("option")
    set_description("Enable or disable the demo module", "    =y|n")

-- key-val style
option
{
    name = "demo",
    default = true,
    showmenu = true,
    category = "option",
    desciption = {"Enable or disable the demo module", "    =y|n"}
}
```

The custom tasks or plugins can be written like this:

```lua
-- set-add style
task("hello")

    -- on run
    on_run(function ()

        -- trace
        print("hello xmake!")

    end)

    -- set menu
    set_menu({
                    -- usage
                    usage = "xmake hello [options]"

                    -- description
                ,   description = "Hello xmake!"

                    -- options
                ,   options = {}
                }) 

-- key-val style
task
{
    name = "hello",
    run = (function ()

        -- trace
        print("hello xmake!")

    end),
    menu = {
                -- usage
                usage = "xmake hello [options]"

                -- description
            ,   description = "Hello xmake!"

                -- options
            ,   options = {}
            }
}
```
