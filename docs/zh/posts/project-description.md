---
title: xmake工程描述入门
tags: [xmake, premake]
date: 2016-02-03
author: Ruki
---

xmake的工程描述文件，摈弃了makefile的繁琐复杂，借鉴了premake的简洁明了，原生支持lua脚本，使得更加的灵活、方便扩展。

工程默认描述文件名为xmake.lua，支持多级目录嵌套，也可以通过以下命令，指定其他文件作为工程描述文件：

```bash
    xmake -f /tmp/xxx.lua
    xmake --file=xxx.lua
```

下面先来看一个最简单的例子：

```lua
    -- 添加一个名为demo的目标到工程
    target("demo")

        -- 设置目标程序类型为二进制可执行程序，一般为console的终端命令行程序
        set_kind("binary")

        -- 添加src目录下的所有c文件
        add_files("src/*.c") 
```

怎么样简单吧，这样就已经完成了一个最简单的工程描述。。



下面我们看一个稍微复杂一点的例子，这个例子中对release、debug模式进行了不同的设置：

```lua
    -- 如果当前编译的是debug模式
    if is_mode("debug") then
        
        -- 启用调试符号
        set_symbols("debug")

        -- 禁用优化
        set_optimize("none")
    end

    -- 如果当前编译的是release模式
    if is_mode("release") then

        -- 设置符号可见性为不可见
        set_symbols("hidden")

        -- 启用最快优化模式
        set_optimize("fastest")

        -- 去除所有符号信息，包括调试符号
        set_strip("all")
    end

    -- 添加一个名为test的目标
    target("test")

        -- 将test编译成为静态库类型
        set_kind("static")

        -- 添加所有c++文件，包括子目录（注：**表明多级递归匹配模式）
        add_files("src/**.cpp") 
```

其实也不是很复杂吧，由于采用lua语法，所以逻辑上更加的灵活，你完全可以用lua的分支、循环、函数等语法，进行更加灵活的配置。。

