---
title: 静态库和动态库的编译切换
tags: [xmake, 静态库, 动态库]
date: 2016-08-03
author: Ruki
---

如果你想在同一个target上既编译静态库，又能编译动态库，那么稍微修改下 xmale.lua就行了：

```lua
add_target("test")
 
    -- 设置编译target的类型，之前是：static/shared，现在改成动态的
    set_kind("$(kind)")

    -- 添加文件
    add_files(*.c)
```

好了，现在默认编译的时候，会生成静态库：libtest.a

如果你想生成动态库，只需要执行：

```bash

# 简写
xmake f -k shared

# 或者
xmake config --kind=shared

# 编译
xmake
```





配置成动态库模式，重建下就行了。。参数：`-k/--kind` 可以手动在配置的时候指定，需要编译的target类型，实际会去影响：

```lua
set_kind("$(kind)")
```

中的$(kind)的配置变量。。

如果你想在target针对static/shared类型，分别处理不同的宏开关，也可以使用 `if kinds("static") then ` 来判断

```lua
add_target("test")
 
    -- 设置编译target的类型，之前是：static/shared，现在改成动态的
    set_kind("$(kind)")

    -- 添加文件
    add_files(*.c)

    -- 如果是动态库，则定义宏：SHARED
    if kinds("shared") then
        add_defines("SHARED")
    end
```

上面说的 `-k/--kind`配置参数，是xmake内置参数，影响当前工程的所有指定了 `$(kind)` 的target，如果觉得这样影响面太广，我想让不同的target，在不同的时机切换编译静态库和动态库，可以使用option的接口，自定义一个配置参数：

```lua
-- 自定义一个配置参数
add_option("mykind")
    set_option_showmenu(true)
    set_option_description("Set my target kind: static or shared")

add_target("test")
 
    -- 设置编译target的类型，使用 xmake --mykind=static参数
    set_kind("$(mykind)")

    -- 添加文件
    add_files(*.c)
```

这样，只需要执行`xmake f --mykind=shared` 就可以使用自己的配置参数，进行切换编译类型了。。

