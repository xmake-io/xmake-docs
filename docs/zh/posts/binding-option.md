---
title: xmake高级特性之选项绑定
tags: [xmake, 选项绑定]
date: 2016-08-02
author: Ruki
---

什么是选项的绑定呢？

例如我想在命令行中配置一个smallest的参数：`xmake f --smallest=y` 

这个时候，需要同时禁用多个其他的选项开关，来禁止编译多个模块，就是这个需求，相当于一个选项 与其他 多个选项之间 是有联动效应的。。

那如何实现呢，可以通过下面两个api来实现：

* add_bindings: 添加正向绑定
* add_rbindings: 添加反向绑定





我们看下如何实现smallest的这个效果：

```lua

-- 定义选项开关: --smallest=y|n
option("smallest")

    -- 默认不启用
    set_enable(false)

    -- 在命令行菜单中显示描述，并且可手动配置
    set_showmenu(true)
    
    -- 设置描述
    set_description("Enable the smallest compile mode and disable all modules.")

    -- 添加反向绑定，如果smallest被启用，下面的所有模块全部禁用
    add_rbindings("xml", "zip", "asio", "regex", "object", "thread", "network", "charset", "database")
    add_rbindings("zlib", "mysql", "sqlite3", "openssl", "polarssl", "pcre2", "pcre", "base")

```

需要注意的是，命令行配置是有顺序的，你可以先通过启用smallest禁用所有模块，然后添加其他选项，逐一启用，例如：

```lua

-- 禁用所有模块，然后仅仅启用xml和zip模块
xmake f --smallest=y --xml=y --zip=y
```
