---
title: xmake进阶之简化你的构建描述
tags: [xmake, lua, 工程描述, xmake.lua, 简化]
date: 2018-06-08
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake)的初衷就是为了让用户能够用最简单直接的方式去描述工程，提供跨平台项目构建，因此，`简洁，灵活` 是xmake.lua的核心设计思想。

通过之前的那篇文章:[xmake入门，构建项目原来可以如此简单](http://tboox.org/cn/2018/03/26/build-project-so-simply/)，我们对如何使用xmake去构建项目有了大概的了解，并且能够编写一些简单的xmake.lua去描述项目，例如:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

但是平常我们实际的项目维护，不可能这么简单，会有各种各样的配置需求，例如: 添加每个平台特有的flags，处理debug/release编译模式，多个target的依赖编译等等，在混杂了用户各种配置需求后，xmake.lua的维护很容易变得很臃肿，可读性变差。

因此本文会介绍一些常用的编写模式，去尽可能的利用xmake的设计特性，去简化对工程的描述，提高可读性和易维护性，避免用户因为不了解xmake而导致的一些错误写法。

## 在根域添加通用配置

xmake的配置关系是根据tree结构继承，子xmake.lua会集成父xmake.lua中的配置，同一个xmake.lua中，所有target的配置会集成根作用域的配置，因此一些通用配置，可以放置在根域，避免重复设置，例如:








#### 简化前

```lua
target("test1")
    set_kind("binary")
    add_files("src1/*.c")
    if is_mode("debug") then
        set_symbols("debug")
        set_optimize("none")
    end
    if is_mode("release") then
        set_symbols("hidden")
        set_optimize("fastest")
        set_strip("all")
    end
    if is_plat("linux") then
        add_defines("PLAT_IS_LINUX")
    end
    if is_plat("macosx") then
        add_defines("PLAT_IS_MACOSX")
    end
    if is_plat("android") then
        add_defines("PLAT_IS_ANDROID")
    end

target("test2")
    set_kind("binary")
    add_files("src2/*.c")
    if is_mode("debug") then
        set_symbols("debug")
        set_optimize("none")
    end
    if is_mode("release") then
        set_symbols("hidden")
        set_optimize("fastest")
        set_strip("all")
    end
    if is_plat("linux") then
        add_defines("PLAT_IS_LINUX")
    end
    if is_plat("macosx") then
        add_defines("PLAT_IS_MACOSX")
    end
    if is_plat("android") then
        add_defines("PLAT_IS_ANDROID")
    end

```

#### 简化后

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
if is_plat("linux") then
    add_defines("PLAT_IS_LINUX")
end
if is_plat("macosx") then
    add_defines("PLAT_IS_MACOSX")
end
if is_plat("android") then
    add_defines("PLAT_IS_ANDROID")
end

target("test1")
    set_kind("binary")
    add_files("src1/*.c")

target("test2")
    set_kind("binary")
    add_files("src2/*.c")
```

把通用的设置放到根域后，可以避免对每个target的重复设置，target越多，效果越明显。

## 利用rule去简化常用配置

对于一些常用的配置，xmake最新版本中提供了内置规则去简化它，例如: `mode.debug`, `mode.release`规则等，提供对编译模式的内置配置处理，我们还是以刚才的代码为例，看看应用规则后的效果: 

```lua
add_rules("mode.debug", "mode.release")

if is_plat("linux") then
    add_defines("PLAT_IS_LINUX")
end
if is_plat("macosx") then
    add_defines("PLAT_IS_MACOSX")
end
if is_plat("android") then
    add_defines("PLAT_IS_ANDROID")
end

target("test1")
    set_kind("binary")
    add_files("src1/*.c")

target("test2")
    set_kind("binary")
    add_files("src2/*.c")
```

看上去，比刚才的结果更加简化了不少，其中`mode.release`规则被应用后，相当于配置了:

```lua
if is_mode("release") then
    set_symbols("hidden")
    set_optimize("fastest")
    set_strip("all")
end
```

这其实有点像c/c++中的宏，不过rule更加强大，因为它还可以对一个target同时叠加多个rule，甚至用户可以自定义一些rule去简化自己的常用配置，或者自定义扩展构建规则。

具体对rule的使用说明，我后续会有单独的文章来介绍，如果用户感兴趣的话，可以先看下相关文档深入了解下，里面还有很多xmake提供的内建规则: [构建规则文档](/zh/api/description/builtin-rules)

## 利用内建变量条件配置

上述代码中，其实还是有许多冗余的地方，例如:

```lua
if is_plat("linux") then
    add_defines("PLAT_IS_LINUX")
end
```

这里每次都判断下平台，仅仅只是为了设置一个宏定义的话，没必要这么写，直接使用xmake提供的内建变量`$(plat)`会更加简单直接，例如:

```lua
add_defines("PLAT_IS_$(plat)")
```

不过，这里还不是完全一致，我们需要的是大写的定义，因此可以改成:

```lua
add_defines("PLAT_IS_$(plat:upper)")
```

最后贴下完整的简化代码:

```lua
add_rules("mode.debug", "mode.release")
add_defines("PLAT_IS_$(plat:upper)")

target("test1")
    set_kind("binary")
    add_files("src1/*.c")

target("test2")
    set_kind("binary")
    add_files("src2/*.c")
```

相比最初的配置，现在已经相当精简了，并且更加可读，易维护。如果想了解更多的内建变量，请参考文档：[内建变量](/zh/api/description/builtin-variables)

## 利用lua脚本简化配置

很多时候，会有一些重复的逻辑配置，并且包含了一些用户的配置逻辑在里面，单纯用内建变量满足不了需求，这个时候就可以通过写一小段lua脚本，或者封装个lua函数去简化它们。

例如，我们想定义好几个target，但是他们的编译选项完全相同，仅仅是源码所在目录不同，就比如之前的代码，我们可以继续简化：

```lua
add_rules("mode.debug", "mode.release")

add_defines("PLAT_IS_$(plat:upper)")

for _, id in ipairs({"1", "2"}) do
    target("test" .. id)
        set_kind("binary")
        add_files("src" .. id .. "/*.c")
end
```

或者通过定义个function来实现：

```lua
function define_target(...)
    for _, id in ipairs({...}) do
        target("test" .. id)
            set_kind("binary")
            add_files("src" .. id .. "/*.c")
    end
end

add_rules("mode.debug", "mode.release")
add_defines("PLAT_IS_$(plat:upper)")

define_target(1, 2)
```

注：这种方式，不能滥用，对于确实有太多的重复配置的时候，可以通过脚本适当简化下，使用不当也会起一些反效果，反而令整体可读性降低。

## 利用includes分离单个xmake.lua

上节介绍的方法去简化target的定义，可读性还不是很好，对于单个xmake.lua，如果充斥太多target，有可能会变得非常臃肿，这个时候，我更倾向于使用includes去分离`xmake.lua`，每个子目录提供一个单独的`xmake.lua`

假如有下面的目录结构：

```
├── src1
│   └── main.c
├── src2
│   └── main.c
└── xmake.lua
```

我们可以在每个src子目录下，单独提供一个子`xmake.lua`去维护：

```
├── src1
│   ├── main.c
│   └── xmake.lua
├── src2
│   ├── main.c
│   └── xmake.lua
└── xmake.lua
```

然后根`xmake.lua`中可以通过includes去包含子目录的`xmake.lua`配置，之前的配置代码可以简化成：

```lua
add_rules("mode.debug", "mode.release")
add_defines("PLAT_IS_$(plat:upper)")

includes("src1", "src2")
```

然后子`xmake.lua`中，仅对当前目录下的源码提供一个对应的target，比如`src1/xmake.lua`的内容如下：

```lua
target("test1")
    set_kind("binary")
    add_files("*.c")
```

另外，根`xmake.lua`的配置会自动继承给子配置，不需要再去设置一遍，除非有当前子target特有的配置，那么可以在子`xmake.lua`里面单独设置。

## 利用文件匹配模式简化源文件配置

`add_files`提供了强大的文件匹配模式去简化源文件的添加，用户不需要每次单独添加一个文件，这样太过繁琐：

```lua
target("test")
    add_files("src/test1.c")
    add_files("src/test2.c")
    add_files("src/subdir/test1.c")
    add_files("src/subdir/test2.c")
```

通过匹配模式，我们可以递归添加所有相关源文件：

```lua
target("test")
    add_files("src/**.c")
```

其中通配符*表示匹配当前目录下文件，而**则匹配多级目录下的文件。我们再贴一些例子代码，直观感受下：

```lua
add_files("src/test_*.c")
add_files("src/xxx/**.cpp")
add_files("src/asm/*.S", "src/objc/**/hello.m")
```

`add_files`不仅可以匹配文件，还有可以在添加文件同时，过滤排除指定模式的一批文件，例如：

```lua
-- 递归添加src下的所有c文件，但是不包括src/impl/下的所有c文件
add_files("src/**.c|impl/*.c")

-- 添加src下的所有cpp文件，但是不包括src/test.cpp、src/hello.cpp以及src下所有带xx_前缀的cpp文件
add_files("src/*.cpp|test.cpp|hello.cpp|xx_*.cpp")
```

我们也可以通过`del_files`接口，从前面`add_files`接口添加的文件列表中，删除指定的文件，例如：

```lua
target("test")
    add_files("src/*.c")
    del_files("src/test.c")
```

灵活合理运用[add_files](/zh/api/description/project-target#add-files)和[del_files](/zh/api/description/project-target#del-files)，我们可以极大程度的简化工程源码的配置管理。

## 利用内置配置简化flags设置

对于一些常用的flags设置，例如：`-O3`, `-g`, `-std=c++11`等编译选项，xmake提供了一些更加通用内置的配置，来简化设置，用户不需要再去考虑不同平台、不同编译器上对应的这些flags的一些差异性，只需要设置：

```lua
set_optimize("fastest")
set_symbols("debug")
set_languages("cxx11")
set_warnings("all", "error")
```

具体配置说明，以及目前提供的配置值，都可以去看下相关文档，里面有详细说明：[内置配置说明](/zh/api/description/project-target#set-symbols)