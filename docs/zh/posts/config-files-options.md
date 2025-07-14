---
title: 更细粒度的文件编译选项控制
tags: [xmake, lua, 编译选项]
date: 2017-08-10
author: Ruki
---

之前的版本对编译控制粒度，只能到target这一级：

```lua
-- 全局根配置，所有target都会被影响
add_defines("ROOT")

target("test")

    -- target目标配置，只对test目标下的所有源文件编译生效
    add_defines("TEST")
    add_files("src/*.c")
```

最近给2.1.6开发版本中的`add_files`进行了改进，支持基于files更细粒度的编译选项控制，例如：

```lua
target("test")
    add_defines("TEST1")
    add_files("src/*.c")
    add_files("test/*.c", "test2/test2.c", {defines = "TEST2", languages = "c99", includedirs = ".", cflags = "-O0"})
```

可以在`add_files`的最后一个参数，传入一个配置table，去控制指定files的编译选项，里面的配置参数跟target的一致，并且这些文件还会继承target的通用配置`-DTEST1`。

针对`add_files`的更多描述，见[手册文档](https://xmake.io/zh/)，大家可以下载master版本来预先体验这一新特性。

