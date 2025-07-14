---
title: xmake v2.2.1 大版本发布，Qt, WDK和Cuda编译环境支持
tags: [xmake, lua, 版本更新, Qt, WDK, Cuda]
date: 2018-06-17
author: Ruki
---

为了使[xmake](https://github.com/xmake-io/xmake)更方便灵活地支持其他编译环境，我花了四个多月的时间，对[自定义规则rule](/zh/manual#%E6%9E%84%E5%BB%BA%E8%A7%84%E5%88%99)，进行了大规模升级。
现在用户可以通过自定义规则，来实现各种编译规则，并且xmake也内置了一些常用的编译规则，可以直接应用到当前工程，去实现对Qt, WDK驱动和Cuda编译环境的支持。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

相关文章介绍：

* [xmake新增对WDK驱动编译环境支持](http://tboox.org/cn/2018/06/14/support-wdk/)
* [xmake新增对Qt编译环境支持](http://tboox.org/cn/2018/05/30/support-qt/)
* [xmake新增对Cuda代码编译支持](http://tboox.org/cn/2018/03/09/support-cuda/)
* [xmake自定义构建规则的使用](http://tboox.org/cn/2017/11/13/custom-rule/)

### 新特性

* [#158](https://github.com/xmake-io/xmake/issues/158): 增加对Cuda编译环境的支持
* 添加`set_tools`和`add_tools`接口为指定target目标设置编译工具链
* 添加内建规则：`mode.debug`, `mode.release`, `mode.profile`和`mode.check`
* 添加`is_mode`, `is_arch` 和`is_plat`内置接口到自定义脚本域
* 添加color256代码
* [#160](https://github.com/xmake-io/xmake/issues/160): 增加对Qt SDK编译环境的跨平台支持，并且增加`qt.console`, `qt.application`等规则
* 添加一些Qt工程模板
* [#169](https://github.com/xmake-io/xmake/issues/169): 支持yasm汇编器
* [#159](https://github.com/xmake-io/xmake/issues/159): 增加对WDK驱动编译环境支持

### 改进

* 添加FAQ到自动生成的xmake.lua文件，方便用户快速上手
* 支持Android NDK >= r14的版本
* 改进swiftc对warning flags的支持
* [#167](https://github.com/xmake-io/xmake/issues/167): 改进自定义规则：`rule()`
* 改进`os.files`和`os.dirs`接口，加速文件模式匹配
* [#171](https://github.com/xmake-io/xmake/issues/171): 改进Qt环境的构建依赖
* 在makefile生成插件中实现`make clean`

### Bugs修复

* 修复无法通过`add_ldflags("xx", "xx", {force = true})`强制设置多个flags的问题
* [#157](https://github.com/xmake-io/xmake/issues/157): 修复pdb符号输出目录不存在情况下编译失败问题
* 修复对macho格式目标strip all符号失效问题
* [#168](https://github.com/xmake-io/xmake/issues/168): 修复生成vs201x工程插件，在x64下失败的问题







### 新特性简介

#### 内置常用规则简化工程描述

新版本添加了`mode.debug`, `mode.release`等内建规则，用于简化常用工程配置，像之前我们在xmake.lua配置debug和release模式编译时候，需要增加下面的配置：

```lua
if is_mode("debug") then
    set_symbols("debug")
    set_optimize("none")
end
if is_mode("release") then
    set_symbols("hidden")
    set_optimize("fastest")
    set_strip("all")
end

target("test")
    set_kind("binary")
    add_files("src/*.c")
```

在新版本中，就可以简化为：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.c")
```

除了debug和release模式，xmake还提供了profile，check，coverage等编译模式，分别对程序的性能分析、内存检测、覆盖分析提供内置的编译模式。

#### Cuda工程项目支持

更多使用说明请见：[xmake新增对Cuda代码编译支持](http://tboox.org/cn/2018/03/09/support-cuda/)

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cu")

    for _, sm in ipairs({"30", "35", "37", "50", "52", "60", "61", "70"}) do
        add_cuflags("-gencode arch=compute_" .. sm .. ",code=sm_" .. sm)
        add_ldflags("-gencode arch=compute_" .. sm .. ",code=sm_" .. sm)
    end
    sm = "70"
    add_cuflags("-gencode arch=compute_" .. sm .. ",code=compute_" .. sm)
    add_ldflags("-gencode arch=compute_" .. sm .. ",code=compute_" .. sm)
```

#### Qt工程项目支持

更多使用说明请见：[xmake新增对Qt编译环境支持](http://tboox.org/cn/2018/05/30/support-qt/)

##### Quick应用程序

```lua
target("qt_demo")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/qml.qrc")
    add_frameworks("QtQuick")
```

##### Widgets应用程序

```lua
target("qt_widgetapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- 添加带有 Q_OBJECT 的meta头文件
    add_frameworks("QtWidgets")
```

##### 静态库程序

```lua
target("test")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

#### WDK驱动程序支持

更多使用说明请见：[xmake新增对WDK驱动编译环境支持](http://tboox.org/cn/2018/06/14/support-wdk/)

##### umdf驱动程序

```lua
target("echo")
    add_rules("wdk.driver", "wdk.env.umdf")
    add_files("driver/*.c") 
    add_files("driver/*.inx")
    add_includedirs("exe")
```

##### kmdf驱动程序

```lua
target("nonpnp")
    add_rules("wdk.driver", "wdk.env.kmdf")
    add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)")
    add_values("wdk.tracewpp.flags", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")
    add_files("driver/*.c", {rule = "wdk.tracewpp"}) 
    add_files("driver/*.rc")
```

##### wdm驱动程序

```lua
target("kcs")
    add_rules("wdk.driver", "wdk.env.wdm")
    add_values("wdk.man.flags", "-prefix Kcs")
    add_values("wdk.man.resource", "kcsCounters.rc")
    add_values("wdk.man.header", "kcsCounters.h")
    add_values("wdk.man.counter_header", "kcsCounters_counters.h")
    add_files("*.c", "*.rc", "*.man") 
```

##### 签名驱动程序

测试签名：

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
    add_files("src/*.c")
```

正式签名：

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "release")
    set_values("wdk.sign.company", "xxxx")
    set_values("wdk.sign.certfile", path.join(os.projectdir(), "xxxx.cer"))
```

### 其他特性说明

在之前的版本中，用户可以通过`is_plat`, `is_arch`和`is_mode`去快速方便的判断平台、模式、架构，然后去处理不同的配置，例如：

```lua
target("test")
    set_kind("binary")
    if is_plat("macosx", "iphoneos") then
        add_defines("TEST")
    end
```

虽然这样更加方便，但是有时候一些更加定制化的需要，仅仅通过外层描述域配置是完成不了的，这个时候用户需要根据自己的需求，实现一些自定义脚本，而这些api之前是没法在自定义脚本中使用。

而在新版本中，xmake对这些常用api在自定义脚本中进行了扩充，现在也能直接调用来简化脚本实现：

```lua
target("test")
    set_kind("binary")
    on_load(function (target)
        if is_plat("macosx", "iphoneos") then
            target:add("defines", "TEST")
        end
        if is_mode("debug") then
            target:add("defines", "DEBUG")
        end
    end)
```