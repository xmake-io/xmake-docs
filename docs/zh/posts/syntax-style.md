---
title: xmake 工程描述语法更新
tags: [xmake, 描述语法]
date: 2016-11-15
author: Ruki
---

最近对xmake.lua的工程描述语法进行了增强，现已可以同时支持两种不同语法风格。

* set-add描述风格
* key-val描述风格

#### set-add描述风格

这种是xmake经典的设置风格，例如：

```lua
target("test")
    set_kind("static")
    add_defines("DEBUG")
    add_files("src/*.c", "test/*.cpp")
```

* 优势：控制灵活，可以根据各种条件，通过if-then进行灵活的条件编译，可以驾驭各种高度复杂的配置需求。
* 劣势：作用域控制不明显，需要手动规范化缩进


#### key-val描述风格

这种是xmake最近新加的风格，例如：

```lua
target
{
    name = "test",
    defines = "DEBUG",
    files = {"src/*.c", "test/*.cpp"}
}
```

* 优势：更加的精简可读
* 劣势：条件编译虽然也支持，但是不太灵活







这两种风格，目前xmake都是同时兼容支持的，可以根据个人喜好，随意使用，但是这边的建议是：

* 针对简单的工程，不需要太过复杂的条件编译，可以使用key-val方式，更加精简，可读性好
* 针对复杂工程，需要更高的可控性，和灵活性的话，建议使用set-add方式
* 尽量不要两种风格混着写，虽然是支持的，但是这样对整个工程描述会感觉很乱，因此尽量统一风格作为自己的描述规范

另外，不仅对target，像option, task, template都是支持两种方式设置的，例如：

```lua
-- set-add风格
option("demo")
    set_default(true)
    set_showmenu(true)
    set_category("option")
    set_description("Enable or disable the demo module", "    =y|n")

-- key-val风格
option
{
    name = "demo",
    default = true,
    showmenu = true,
    category = "option",
    desciption = {"Enable or disable the demo module", "    =y|n"}
}
```

自定义的任务或者插件可以这么写：

```lua
-- set-add风格
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

-- key-val风格
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
