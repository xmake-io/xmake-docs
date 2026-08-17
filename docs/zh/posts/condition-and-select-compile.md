---
title: xmake工程描述编写之选择性编译
tags: [xmake, 编译, 工程描述, xmake.lua, 条件判断]
date: 2016-07-23
author: Ruki
outline: deep
---

xmake 提供了一些内置的条件判断api，用于在选择性编译时，获取到一些工程状态的相关信息，来调整编译逻辑。

例如：`is_os`, `is_plat`, `is_arch`, `is_kind`, `is_mode`, `is_option`

### `is_mode`

我们先讲讲最常用的`is_mode`，这个api主要用来判断当前的编译模式，例如平常编译配置的时候，会执行：

```bash
xmake f -m debug
xmake
```

来编译`debug`版本，那么模式就是`debug`，那么`release`版本，也就是`release`了：

```bash
xmake f -m release
xmake
```

但是如果仅仅只是这么配置，xmake不知道在debug模式和release模式分别应该怎么编译，因为模式名只是个代号，没有默认行为。

我们可以随便设置模式名，例如profile、checking，用来代表性能模式、检测模式，具体使用什么名字看咱们项目实际的需求。

一般情况下只需要`debug`和`release`就行了。如何区分编译行为呢，这就需要在`xmake.lua`进行配置了，一般可参考如下配置：

```lua
-- 如果当前编译模式是debug
if is_mode("debug") then

    -- 添加DEBUG编译宏
    add_defines("DEBUG")

    -- 启用调试符号
    set_symbols("debug")

    -- 禁用优化
    set_optimize("none")

-- 如果是release模式
elseif is_mode("release") then

    -- 隐藏符号
    set_symbols("hidden")

    -- strip所有符号
    set_strip("all")

    -- 开启优化为：最快速度模式
    set_optimize("fastest")

    -- 忽略帧指针
    add_cxflags("-fomit-frame-pointer")
    add_mxflags("-fomit-frame-pointer")
end
```

通过判断是否在编译debug版本，来启用和禁用调试符号信息，并且判断是否禁用和启用优化。

当然，如果我们的项目还设置了其他模式，例如性能分析模式：profile，那么还可以通过这个来判断是否需要添加性能分析方面的编译选项。

自 xmake 2.2.1 起，部分常用模式配置可通过内置规则简化，详情可参考[内置规则](zh/api/description/builtin-rules)。

### `is_plat`

接下来我们讲讲编译平台的判断，这个也非常实用哦。

虽然 xmake 是跨平台的工具，其中的设置选项大多是全平台通用的。

但是毕竟项目成千上万，需求各不相同，总归会有项目需要针对不同的平台做些编译上的特殊处理。

这个时候，我们就需要这个api了，例如：

```lua
-- 如果当前平台是android
if is_plat("android") then
    add_files("src/xxx/*.c")
end

-- 如果当前平台是macosx或iphoneos
if is_plat("macosx") or is_plat("iphoneos") then
    add_mxflags("-framework Foundation")
    add_ldflags("-framework Foundation")
end
```

这里针对android平台，增加了一些特殊代码的编译，针对macosx和iphoneos平台，增加了Foundation框架的链接。

这里还有个比较实用的小技巧，`is_xxx`系列接口，都可以同时传递多个参数，相当于用or连接。

我们可以像把刚刚的判断逻辑，改成下面这种写法：

```lua
-- 如果当前平台是android
if is_plat("android") then
    add_files("src/xxx/*.c")
end

-- 如果当前平台是macosx或iphoneos
if is_plat("macosx", "iphoneos") then
    add_mxflags("-framework Foundation")
    add_ldflags("-framework Foundation")
end
```

这对统一处理在特定方面一致的多个平台很有帮助。

一个极端的例子：

```lua
-- 需要判断是否为主流平台

if is_plat("macosx") or is_plat("iphoneos") or is_plat("android") or is_plat("linux") or is_plat("windows") then
    -- ...
end

-- 等价于
if is_plat("macosx", "iphoneos", "android", "linux", "windows") then
    -- ...
end
```

顺带一提，除了`is_xxx`系列，像：`add_xxxs` 这种后缀有`s`的复数api，都可以传递多个参数哦，例如`add_files`：

```lua
add_files("src/*.c", "test.c", "hello.cpp")
```

等等，这里就不一一介绍了。

### `is_arch`

用法和`is_plat`类似，用来判断当前编译的目标架构，也就是：

```bash
xmake f --arch=x86_64
```

然后，我们在工程描述中，进行判断：

```lua
-- 如果当前架构是x86_64或者i386
if is_arch("x86_64", "i386") then
    add_files("src/xxx/*.c")
end

-- 如果当前架构是armv7, arm64, armv7s, armv7-a
if is_arch("armv7", "arm64", "armv7s", "armv7-a") then
    -- ...
end
```

如果像上面那样一个个列出架构名，有时会很繁琐，毕竟同一个架构可能会有很多细分。

xmake为`is_arch`提供了类似`add_files`中的通配符匹配，用来简化架构判断。

例如，判断arm架构时，可以使用下面的写法：

```lua
-- arm架构通常以arm开头
if is_arch("arm*") then
    -- ...
end
```

可以直接匹配到`armv7`、`arm64`、`armv7s`、`armv7-a`等架构。

### `is_os`

和`is_plat`相似，但用来判断当前编译目标所属的操作系统类型。

例如，iphoneos和watchos等平台都是ios系统，使用`is_plat`会显得繁琐，此时可通过`is_os`进行统一处理。

```lua
if is_os("ios") then
    add_files("src/xxx/*.m")
end
```

`is_os`目前支持的操作系统有：windows、linux、android、macosx、ios。

### `is_kind`

用来判断当前是否编译的是动态库还是静态库。

一般用于如下场景：

```lua

target("test")
    -- 通过配置设置目标的kind
    set_kind("$(kind)")
    add_files("src/*.c")
    
    -- 如果当前编译的是静态库，那么添加指定文件
    if is_kind("static") then
        add_files("src/xxx.c")
    end

```

编译配置时，可手动切换编译类型：

```bash

# 编译静态库
xmake f -k static
xmake

# 编译动态库
xmake f -k shared
xmake
```

### `is_option`

如果某个 自动检测 或 手动设置 的选项被启用，那么可以通过`is_option`接口来判断，例如：

```lua

-- 如果手动启用了xmake f --demo=y 选项
if is_option("demo") then
   
    -- 编译demo目录下的代码
    add_subdirs("src/demo")
end
```
