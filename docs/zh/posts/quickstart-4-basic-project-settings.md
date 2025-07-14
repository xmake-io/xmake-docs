---
title: xmake从入门到精通4：常用C/C++项目描述设置详解
tags: [xmake, lua, c/c++, xmake配置描述]
date: 2019-11-10
author: Ruki
---

xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。

本文主要详细讲解如何编写一些常用的基础xmake.lua描述配置，来实现一些简单的C/C++项目构建管理。
对于大部分小项目，这些配置已经完全足够使用，本系列后期进阶教程中，我会深入详细讲解如果使用一些高级特性来更加灵活定制化地配置项目。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

### 先来一段最简短的

一行描述即可编译src目录下所有c源文件，然后生成一个名为demo的可执行文件。

```lua
target("demo", {kind = "binary", files = "src/*.c"})
```

上面的写法是精简写法，通常我们更推荐使用下面展开式写法：

```lua
target("demo")
    set_kind("binary")
    add_files("src/*.c")
```

这两者完全等价，如果配置很简短，可以完全精简成一行，而拆分成多行更加方便灵活配置。

如果没有特殊目的，下文我们都会采用第二段的写法。

### 配置项目目标类型

通常的C/C++项目生成的目标文件主要有三大类：可执行程序，静态库，动态库。

我们可以通过`set_kind()`配置来设置，分别对应：binary, static, shared

例如，我们想要编译动态库，只需要修改kind：

```lua
target("demo")
    set_kind("shared")
    add_files("src/*.c")
```

### 添加宏定义

编译宏的设置，大多数c/c++项目都会用到，一般如果我们设置编译flags传给gcc/clang，都是要配置：`-DXXX`

而在xmake里面，提供了`add_defines()`内置接口来配置：

```lua
target("demo")
    set_kind("shared")
    add_files("src/*.c")
    add_defines("XXX")
```






### 条件配置

那如果我们想在不同编译平台，分别设置不同的宏开关呢？我们可以利用lua内置的if语句很方便的实现：

```lua
target("demo")
    set_kind("shared")
    add_files("src/*.c")
    add_defines("XXX")
    if is_plat("linux", "macosx") then
        add_defines("YYY")
    end
```

我们通过`is_plat()`判断，如果当前编译目标平台是linux或者macosx，那么target会额外增加`-DYYY`宏定义。

### 全局配置

我们在`target("demo")`下面的所有配置，都属于demo这个target子域，并不是全局的，所以你会看到通常配置上都加了缩进，就是为了凸显作用域的影响范围。

通常如果多个target连续定义，下一个target定义就会自动结束上个target的作用域，每个target的配置完全独立，互不干扰：

```lua
target("test1")
    set_kind("shared")
    add_files("src/*.c")
    add_defines("TEST1")

target("test2")
    set_kind("shared")
    add_files("src/*.c")
    add_defines("TEST2")
```

例如，上面的配置两个target，各自拥有自己独立的宏定义：`TEST1`和`TEST2`。

那么，我们要对这两个target，设置共用的宏定义，应该如何配置呢？

每个target下面都配置一遍`add_defines("TEST")`? 当然可以，不过这样就有点冗余了，配置多了就会很难维护，其实我们只需要放置到全局根作用域就行了：

```lua
-- 全局设置
add_defines("TEST")
if is_arch("arm64", "armv7") then
    add_defines("ARM")
end

target("test1")
    set_kind("shared")
    add_files("src/*.c")
    add_defines("TEST1")

target("test2")
    set_kind("shared")
    add_files("src/*.c")
    add_defines("TEST2")
```

在target的外层的所有配置都属于全局配置，我们也可以调用`target_end()`强制结束target子域，切回全局作用域：

```lua
target("test1")
    set_kind("shared")
    add_files("src/*.c")
    add_defines("TEST1")
target_end()

-- 全局设置
add_defines("TEST")
if is_arch("arm64", "armv7") then
    add_defines("ARM")
end

target("test2")
    set_kind("shared")
    add_files("src/*.c")
    add_defines("TEST2")
target_end()
```

### 添加编译选项

如果有些编译选项，xmake没有提供内置api设置，那么我们可以退化到`add_cflags`, `add_cxflags`, `add_cxxflags`来设置，
不过这就需要用户自己去判断编译平台了，因为并不是所有编译flags每个平台都支持。

比如：

```lua
add_cflags("-g", "-O2", "-DDEBUG")
if is_plat("windows") then
    add_cflags("/MT")
end
```

所有选项值都基于gcc的定义为标准，如果其他编译器不兼容（例如：vc），xmake会自动内部将其转换成对应编译器支持的选项值。 
用户无需操心其兼容性，如果其他编译器没有对应的匹配值，那么xmake会自动忽略器设置。

我们也可以通过force参数来强制禁用flags的自动检测，直接传入编译器，哪怕编译器有可能不支持，也会设置：

```lua
add_cflags("-g", "-O2", {force = true})
```

那如何知道，哪些flags检测失败给忽略了呢，带`-v`编译就可以看到，比如：

```bash
$ xmake -v
checking for the /usr/bin/xcrun -sdk macosx clang ... ok
checking for the flags (-Oz) ... ok
checking for the flags (-Wno-error=deprecated-declarations) ... ok
checking for the flags (-fno-strict-aliasing) ... ok
checking for the flags (-Wno-error=expansion-to-defined) ... no
```

最后备注下这三个api的区别：

* `add_cflags`：仅添加C代码相关编译flags
* `add_cxflags`：添加C/C++代码相关编译flags
* `add_cxxflags`：仅添加C++代码相关编译flags

### 添加库相关设置

一个C/C++库的集成使用，通常需要设置头文件搜索目录，链接库名，库搜索目录，比如：

```lua
target("test")
    set_kind("binary")
    add_links("pthread")
    add_includedirs("/usr/local/include")
    add_linkdirs("/usr/local/lib")
```

通常，为了保证链接库的依赖顺序，系统库链接通常都会比较靠后，我们通过`add_syslinks()`来专门设置系统库链接，而`add_links()`通常用于非系统库链接：

```lua
target("test")
    set_kind("binary")
    add_links("A", "B")
    add_syslinks("pthread")
```

上面的配置，我们添加了两个第三方链接库：A, B，以及系统库pthread，整个完整的链接顺序是：`-lA -lB -lpthread`，syslinks会放在最后面。

如果你不确定实际的链接顺序，我们可以执行`xmake -v`编译，查看完整的链接参数命令行。

### 设置语言标准

c标准和c++标准可同时进行设置，例如：

```lua
-- 设置c代码标准：c99， c++代码标准：c++11
set_languages("c99", "c++11")
```

注：并不是设置了指定的标准，编译器就一定会按这个标准来编译，毕竟每个编译器支持的力度不一样，但是xmake会尽最大可能的去适配当前编译工具的支持标准。

例如：windows下vs的编译器并不支持按c99的标准来编译c代码，只能支持到c89，但是xmake为了尽可能的支持它，所以在设置c99的标准后，
xmake会强制按c++代码模式去编译c代码，从一定程度上解决了windows下编译c99的c代码问题。

### 设置编译优化

xmake提供了几种内置的编译优化配置：none, fast, faster, fastest, smallest, aggressive，来实现各种级别的编译优化。

```lua
set_optimize("fastest")
```

如果用户通过flags来设置，还需额外考虑不同编译器的不同编译选项，xmake对其进行了内部映射处理，极大程度方便用户提供跨平台性。

如果想查看详细的映射规则，可以到xmake的官方文档进行查看：[编译优化设置](https://xmake.io/zh/)

### 调试和发布模式

即使xmake提供了`set_optimize`简化了不同编译器的复杂配置，但是对于不同的编译模式: debug/release，还是要自己做一些繁琐的判断和配置：

```lua
if is_mode("debug") then
    set_symbols("debug")
    set_optimize("none")
end
if is_mode("release") then
    set_symbols("hidden")
    set_strip("all")
    if is_plat("iphoneos", "android") then
        set_optimize("smallest")
    else
        set_optimize("fastest")
    end
end
```

这些看似常用的设置，如果每个项目都来一遍，那也很繁琐了，导致xmake.lua不够精简可读，因此xmake提供了一些常用内置规则来简化设置：

```lua
add_rules("mode.release", "mode.debug")
```

只需这一行即可，效果是完全一致，用户还可以基于此在做一些额外的定制化配置来改写：

```lua
add_rules("mode.release", "mode.debug")
if is_mode("release") then
    set_optimize("fastest")
end
```

比如我想在release模式下，强制启用fastest编译优化，既然有了模式配置，那我们怎么切换到debug模式编译呢？（默认是release编译）

答案：

```lua
xmake f -m debug;
xmake
```

### 添加源文件

最后，我们在介绍下xmake最常用，也最为强大的设置之一，也就是对编译源文件的配置管理：`add_files()`。

我们可以用这个接口，添加各类xmake支持的源文件，比如：c/c++, asm, objc, swift, go, dlang等源文件，甚至是：`.obj`, `.a/.lib`等二进制对象和库文件。

例如：

```lua
add_files("src/test_*.c")
add_files("src/xxx/**.cpp")
add_files("src/asm/*.S", "src/objc/**/hello.m")
```

其中通配符`*`表示匹配当前目录下文件，而`**`则匹配多级目录下的文件。

`add_files`的使用其实是相当灵活方便的，其匹配模式借鉴了premake的风格，但是又对其进行了改善和增强。

使得不仅可以匹配文件，还有可以在添加文件同时，过滤排除指定模式的一批文件。

例如：

```lua
-- 递归添加src下的所有c文件，但是不包括src/impl/下的所有c文件
add_files("src/**.c|impl/*.c")

-- 添加src下的所有cpp文件，但是不包括src/test.cpp、src/hello.cpp以及src下所有带xx_前缀的cpp文件
add_files("src/*.cpp|test.cpp|hello.cpp|xx_*.cpp")
```

其中分隔符`|`之后的都是需要排除的文件，这些文件也同样支持匹配模式，并且可以同时添加多个过滤模式，只要中间用`|`分割就行了。。

添加文件的时候支持过滤一些文件的一个好处就是，可以为后续根据不同开关逻辑添加文件提供基础。

注：为了使得描述上更加的精简，`|`之后的过滤描述都是基于起一个模式：`src/*.cpp` 中`*`之前的目录为基础的。
所以上面的例子后面过滤的都是在src下的文件，这个是要注意的。

2.1.6版本之后，对`add_files`进行了改进，支持基于files更细粒度的编译选项控制，例如：

```lua
target("test")
    add_defines("TEST1")
    add_files("src/*.c")
    add_files("test/*.c", "test2/test2.c", {defines = "TEST2", languages = "c99", includedirs = ".", cflags = "-O0"})
```

可以在`add_files`的最后一个参数，传入一个配置table，去控制指定files的编译选项，里面的配置参数跟target的一致，并且这些文件还会继承target的通用配置`-DTEST1`。

2.1.9版本之后，支持添加未知的代码文件，通过设置rule自定义规则，实现这些文件的自定义构建，例如：

```lua
target("test")
    -- ...
    add_files("src/test/*.md", {rule = "markdown"})
```

并且在2.1.9版本之后，可以通过force参数来强制禁用cxflags,cflags等编译选项的自动检测，直接传入编译器，哪怕编译器有可能不支持，也会设置：

```lua
add_files("src/*.c", {force = {cxflags = "-DTEST", mflags = "-framework xxx"}})
```

### 删除指定源文件

既然讲到了添加源文件，那么如何删除，我们也顺带着讲下吧，我们只需要通过`del_files()`接口，就可以从前面`add_files`接口添加的文件列表中，删除指定的文件，例如：

```lua
target("test")
    add_files("src/*.c")
    del_files("src/test.c")
```

上面的例子，可以从`src`目录下添加除`test.c`以外的所有文件，当然这个也可以通过`add_files("src/*.c|test.c")`来达到相同的目的，但是这种方式更加灵活。

例如，我们可以条件判断来控制删除哪些文件，并且此接口也支持`add_files`的匹配模式，过滤模式，进行批量移除。

```lua
target("test")
    add_files("src/**.c")
    del_files("src/test*.c")
    del_files("src/subdir/*.c|xxx.c")
    if is_plat("iphoneos") then
        add_files("xxx.m")
    end
```

通过上面的例子，我们可以看出`add_files`和`del_files`是根据调用顺序，进行顺序添加和删除的，并且通过`del_files("src/subdir/*.c|xxx.c")`删除一批文件，
并且排除`src/subdir/xxx.c`（就是说，不删除这个文件）。