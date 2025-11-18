---
title: xmake从入门到精通8：切换编译模式
tags: [xmake, lua, 编译模式]
date: 2019-12-05
author: Ruki
outline: deep
---

xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。

本文我们会详细介绍下如何在项目构建过程中切换debug/release等常用构建模式，以及自定义其他编译模式。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

### 调试和发布模式

通常，如果我们是通过`xmake create`命令创建的项目，会在xmake.lua里面自动添加一行编译规则的配置，如下：

```lua
add_rules("mode.release", "mode.debug")
target("hello")
    set_kind("binary")
    add_files("src/*.c")
```

通过`add_rules`接口，我们默认添加了release和debug两个常用的内置规则，它们会在编译的时候附带上对应模式相关的一些编译flags，来开启优化用于发布或者调试编译。

如果仅仅执行了`xmake`命令，没有额外的配置，那么默认就会是release编译，等价于：

```bash
$ xmake f -m release
$ xmake
[  0%]: ccache compiling.release src/main.cpp
[100%]: linking.release test
build ok!
```

如果我们要切换到debug编译模式，只需要：

```bash
$ xmake f -m debug
$ xmake
[  0%]: ccache compiling.debug src/main.cpp
[100%]: linking.debug test
build ok!
```

上面的`-m/--mode=`参数就是用来设置编译模式，会跟`mode.release`和`mode.debug`这两个规则做关联。






那么，他们是如何关联上的呢？我们可以先来看下这两个规则的内部实现：

```lua
rule("mode.debug")
    after_load(function (target)
        if is_mode("debug") then
            if not target:get("symbols") then
                target:set("symbols", "debug")
            end
            if not target:get("optimize") then
                target:set("optimize", "none")
            end
        end
    end)

rule("mode.release")
    after_load(function (target)
        if is_mode("release") then
            if not target:get("symbols") and target:targetkind() ~= "shared" then
                target:set("symbols", "hidden")
            end
            if not target:get("optimize") then
                if is_plat("android", "iphoneos") then
                    target:set("optimize", "smallest")
                else
                    target:set("optimize", "fastest")
                end
            end
            if not target:get("strip") then
                target:set("strip", "all")
            end
        end
    end)
```

可以看到，在target被加载阶段，xmake会去判断用户对`xmake f --mode=xxx`的参数配置，如果通过`is_mode()`接口获取到是debug模式，那么会禁用相关优化并且启用符号输出。
而如果是release模式，那么会开启编译优化并且strip掉所有调试符号。

### 定制化的模式配置

当然，内置的这两规则默认设置的这些编译配置，只能满足大部分场景的常规需求，如果用户想要在不同的编译模式下定制化一些个人的编译配置，那么需要自己在xmake.lua做判断。

例如，我们想在release下也启用调试符号，那么只需要：

```lua
if is_mode("release") then
    set_symbols("debug")
end
```

或者额外增加一些编译flags：

```lua
if is_mode("release") then
    add_cflags("-fomit-frame-pointer")
end
```

注：如果用户自己的配置和`mode.release`内置的配置冲突，会优先使用用户的设置。

当然，我们也可以完全不去通过`add_rules("mode.debug", "mode.release")`添加默认的配置规则，让用户完全自己控制模式配置：

```lua
-- 如果当前编译模式是debug
if is_mode("debug") then

    -- 添加DEBUG编译宏
    add_defines("DEBUG")

    -- 启用调试符号
    set_symbols("debug")

    -- 禁用优化
    set_optimize("none")
end

-- 如果是release或者profile模式
if is_mode("release", "profile") then

    -- 如果是release模式
    if is_mode("release") then

        -- 隐藏符号
        set_symbols("hidden")

        -- strip所有符号
        set_strip("all")

        -- 忽略帧指针
        add_cxflags("-fomit-frame-pointer")
        add_mxflags("-fomit-frame-pointer")

    -- 如果是profile模式
    else
        -- 启用调试符号
        set_symbols("debug")
    end

    -- 添加扩展指令集
    add_vectorexts("sse2", "sse3", "ssse3", "mmx")
end
```

### 其他内置模式规则

通过上文的例子，我们看到除了debug/release模式，还加了个profile模式的配置判断，其实xmake也提供了对应的内置模式，还有哪些，我们具体来看下：

#### mode.debug

为当前工程xmake.lua添加debug编译模式的配置规则，例如：

```lua
add_rules("mode.debug")
```

相当于：

```lua
if is_mode("debug") then
    set_symbols("debug")
    set_optimize("none")
end
```

我们可以通过：`xmake f -m debug`来切换到此编译模式。

#### mode.release

为当前工程xmake.lua添加release编译模式的配置规则，例如：

```lua
add_rules("mode.release")
```

相当于：

```lua
if is_mode("release") then
    set_symbols("hidden")
    set_optimize("fastest")
    set_strip("all")
end
```

我们可以通过：`xmake f -m release`来切换到此编译模式。

#### mode.check

为当前工程xmake.lua添加check编译模式的配置规则，一般用于内存检测，例如：

```lua
add_rules("mode.check")
```

相当于：

```lua
if is_mode("check") then
    set_symbols("debug")
    set_optimize("none")
    add_cxflags("-fsanitize=address", "-ftrapv")
    add_mxflags("-fsanitize=address", "-ftrapv")
    add_ldflags("-fsanitize=address")
end
```

我们可以通过：`xmake f -m check`来切换到此编译模式。

#### mode.profile

为当前工程xmake.lua添加profile编译模式的配置规则，一般用于性能分析，例如：

```lua
add_rules("mode.profile")
```

相当于：

```lua
if is_mode("profile") then
    set_symbols("debug")
    add_cxflags("-pg")
    add_ldflags("-pg")
end
```

我们可以通过：`xmake f -m profile`来切换到此编译模式。

#### mode.coverage

为当前工程xmake.lua添加coverage编译模式的配置规则，一般用于覆盖分析，例如：

```lua
add_rules("mode.coverage")
```

相当于：

```lua
if is_mode("coverage") then
    add_cxflags("--coverage")
    add_mxflags("--coverage")
    add_ldflags("--coverage")
end
```

我们可以通过：`xmake f -m coverage`来切换到此编译模式。

注：生成的gcno文件一般都是个obj所在目录对应的哦，因此需要从build目录下去找。

### 扩展自己的编译模式

xmake的模式配置，并没有固定值，用户可以随意传入和配置，只要`xmake f -m/--mode=xxx`传入的模式值和xmake.lua里面的`is_mode("xxx")`能对应上就行。

比如，我们设置了一个自己独有的编译模式`my_mode`，可以直接在命令行配置切换；

```bash
$ xmake f -m my_mode
$ xmake
[  0%]: ccache compiling.my_mode src/main.cpp
[100%]: linking.my_mode test
build ok!
```

然后xmake.lua里面对相应的值进行判断即可：

```lua
if is_mode("my_mode") then
    add_defines("ENABLE_MY_MODE")
end
```

### 使用模式变量

我们也可以直接在配置值中传递模式变量`$(mode)`，比如根据不同模式选择链接不同的库：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_links("xxx_$(mode)")
```

上面的配置，如果是调试模式编译就会选择链接：`libxxx_debug.a`库，而release下就会链接`libxxx_release.a`，当然，我们也可以设置到库搜索路径中，根据目录来选择对应的库。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_linkdirs("lib/$(mode)")
    add_links("xxx")
```

另外，我们可以通过`get_config("mode")`直接获取到传入的模式配置值，并且这几种获取方式，在自定义脚本也是同样有效的哦，例如：


```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load(function (target)
        if is_mode("release") then
            print(get_config("mode"), "$(mode)")
        end
    end)
```