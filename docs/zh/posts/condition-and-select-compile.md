---
title: xmake工程描述编写之选择性编译
tags: [xmake, 编译, 工程描述, xmake.lua, 条件判断]
date: 2016-07-23
author: Ruki
---

xmake 提供了一些内置的条件判断api，用于在选择性编译时，获取到一些工程状态的相关信息，来调整编译逻辑。。

例如：`is_os`, `is_plat`, `is_arch`, `is_kind`, `is_mode`, `is_option`

### `is_mode`

我们先拿最常用的`is_mode`来讲讲如何使用，这个api主要用来判断当前的编译模式，例如平常编译配置的时候，会执行：

```bash
$ xmake f -m debug
$ xmake
```

来编译`debug`版本，那么模式就是`debug`，那么`release`版本，也就是`release`了

```bash
$ xmake f -m release
$ xmake
```

但是如果仅仅只是这么配置，xmake还是不知道如果为debug进行编译，如何编译release版本，因为这些模式的值不是内置的

我们可以随便设置，例如：profile, checking等等，用来编译性能模式，检测模式，这些就看咱们项目实际的需求了。。

一般情况下只需要`debug`和`release`就行了，那如何区分呢，这就需要在`xmake.lua`进行配置了，一般可参考如下配置：




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

当然，如果我们的项目还设置了其他模式，例如性能分析模式：profile，那么还可以通过这个来判断是否需要添加一些分析分析上的编译选项。


### `is_plat`

接下来我们讲讲这个编译平台的判断，这个也非常实用哦，虽然我们的工具是为了跨平台开发，通常的配置肯定都是通用的

但是毕竟项目成千上万，需求各不相同，总归会有些项目需要针对不同的平台做些编译上的特殊处理

这个时候，我们就需要这个api了，例如：

```lua
-- 如果当前平台是android
if is_plat("android") then
    add_files("src/xxx/*.c")
end

--如果当前平台是macosx或者iphoneos
if is_plat("macosx", "iphoneos") then
    add_mxflags("-framework Foundation")
    add_ldflags("-framework Foundation")
end
```

这里针对android平台，增加了一些特殊代码的编译，针对macosx和iphoneos平台，增加了Foundation框架的链接。

这里还有个比较实用的小技巧，`is_xxx`系列接口，都是可以同时传递多个参数的，逻辑上是or的关系

我们可以像上面那么写法：

```lua
if is_plat("macosx", "iphoneos", "android", "linux") then
end
```

否则如果用lua的原生语法的话，虽然也可以，但是会很臃肿，例如：

```lua
if is_plat("macosx") or is_plat("iphoneos") or is_plat("android") or is_plat("linux") then
end
```

除了`is_xxx`系列，像：`add_xxxs` 这种后缀有`s`的复数api，都是可以传递多个参数的哦，例如`add_files`：

```lua
add_files("src/*.c", "test.c", "hello.cpp")
```

等等，这里就不一一介绍了。。。

### `is_arch`

这个跟`is_plat`类似，不过是用来判断当前编译的目标架构的，也就是：

```bash
xmake f --arch=x86_64
```

然后，我们在工程描述中，进行判断：

```lua
-- 如果当前架构是x86_64或者i386
if is_arch("x86_64", "i386") then
    add_files("src/xxx/*.c")
end

--如果当前平台是armv7, arm64, armv7s, armv7-a
if is_arch("armv7", "arm64", "armv7s", "armv7-a") then
    -- ...
end
```

如果像上面那样一个个去判断所有arm架构，也许会很繁琐，毕竟每个平台的架构类型很多，xmake提供了类似`add_files`中的通配符匹配模式，来更加简洁的进行判断：

```lua
--如果当前平台是arm平台
if is_arch("arm*") then
    -- ...
end
```

用*就可以匹配所有了。。

### `is_os`

这个很简单，用来判断当前编译目标，例如：

```lua
-- 如果当前操作系统是ios
if is_os("ios") then
    add_files("src/xxx/*.m")
end
```

目前支持的操作系统有：windows、linux、android、macosx、ios

### `is_kind`

用来判断当前是否编译的是动态库还是静态库

一般用于如下场景：

```lua

target("test")
    -- 通过配置设置目标的kind
    set_kind("$(kind)")
    add_files("src/*c")
    
    -- 如果当前编译的是静态库，那么添加指定文件
    if is_kind("static") then
        add_files("src/xxx.c")
    end

```

编译配置的时候，可手动切换，编译类型：

```lua

-- 编译静态库
xmake f -k static
xmake

-- 编译动态库
xmake f -k shared
xmake
```

### `is_option`


如果某个自动检测选项、手动设置选项被启用，那么可以通过`is_option`接口来判断，例如：

```lua

-- 如果手动启用了xmake f --demo=y 选项
if is_option("demo") then
   
    -- 编译demo目录下的代码
    add_subdirs("src/demo")
end
```