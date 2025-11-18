---
title: 如何为windows编译启用pdb支持
tags: [xmake, pdb, 调试符号, windows]
date: 2016-07-18
author: Ruki
outline: deep
---

xmake默认情况下是不会去生成pdb文件，就算是debug编译，启用了调试符号：

```lua
set_symbols("debug")
```

也是不会生成额外的pdb文件，它会把所有调试符号内置到程序里面，如果要独立生成pdb文件，可以对`xmake.lua`进行如下修改：

```lua

-- 先禁用内置的调试符号开关
--set_symbols("debug")
   
-- 静态库目标
target("test")

    set_kind("static")

    -- 仅针对windows平台
    if is_plat("windows") then

        -- 启用pdb生成
        add_cxflags("-ZI", "-Fd$(buildir)\\test.pdb")
        add_ldflags("-pdb:$(buildir)\\test.pdb")
        add_arflags("-pdb:$(buildir)\\test.pdb")
    end

-- 可执行目标
target("demo")

    set_kind("binary")
    add_deps("test")
    add_links("test")

    -- 仅针对windows平台
    if is_plat("windows") then

        -- 启用pdb生成
        add_cxflags("-ZI", "-Fd$(buildir)\\demo.pdb")
        add_ldflags("-pdb:$(buildir)\\demo.pdb")
    end
```