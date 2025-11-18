---
title: 高级特性之自定义task任务
tags: [xmake, task, 自定义脚本, 插件]
date: 2016-06-09
author: Ruki
outline: deep
---

task是xmake 2.0开始新增的特性，也是插件开发的核心，在 [插件开发之hello xmake](https://xmake.io/zh/) 中我们简单介绍了下task的定义和使用

当然task不仅可以用来写插件，而且还可以写一些简单的自定义任务。。

我们先看下一个简单task实现：

```lua
    -- 定义一个名叫hello的task任务
    task("hello")

        -- task运行的入口
        on_run(function ()

            -- 显示hello xmake!
            print("hello xmake!")

        end)
```

这是一个最简单的task，相比插件task，它少了对 `set_menu` 的设置，当然你也可以加上，好、这样就个可以在命令行中调用它。。



而这个hello task没有设置set_menu，那么只能在自定义脚本里面调用了。。

```lua
    target("demo")

        -- 自定义clean action
        on_clean(function(target)

            -- 导入task模块
            import("core.project.task")

            -- 运行这个hello task
            task.run("hello")
        end)
```

如果想要增加参数传递，有两种方式：

1. 通过`set_menu`添加一个命令行的选项菜单，通过option模块来访问参数（支持命令行、脚本传参）
2. 直接通过脚本传参

我们先看下第二种比较简单，不需要定义命令行菜单，只需要task定义和调用处双方约定好参数规则就行：

```lua
    -- 直接传参，{} 这个是给第一种选项传参使用，这里置空
    -- 这里在最后面传入了两个参数：arg1, arg2
    task.run("hello", {}, "arg1", "arg2")
```

那如何获取这两个参数呢？

```lua
    -- 定义一个名叫hello的task任务
    task("hello")

        -- task运行的入口，定义为两个参数
        on_run(function (arg1, arg2)

            -- 显示hello xmake!
            print("hello xmake: %s %s!", arg1, arg2)

        end)
```

怎么样简单吧，当然这种传参方式没法通过命令行进行外部传参，所以一般用于一些内置的task间调用，像插件这种高级task，就需要第一种传参方式了

这个详情请参考：[插件开发之参数配置](https://xmake.io/zh/)