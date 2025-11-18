---
title: xmake从入门到精通10：多个子工程目标的依赖配置
tags: [xmake, lua, 交叉编译]
date: 2019-12-13
author: Ruki
outline: deep
---

xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。

本文主要详细讲解下，如果在一个项目中维护和生成多个目标文件的生成，以及它们之间的依赖关系设置。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

### target到底是什么？

xmake的概念定义里，一个独立的项目工程可能会有多个子工程组织在一起，每个子工程对应只能生成一个唯一的目标文件，例如：可执行程序，静态库或者动态库等。

而这里所说的每个子工程就是xmake里面所说的`target`，字面意思就是`目标子工程`。

因此每个子工程，我们都可以通过新增一个target在xmake.lua里面维护，例如：

```lua
target("test1")
    set_kind("binary")
    add_files("src/test1/*.c")
    
target("test2")
    set_kind("binary")
    add_files("src/test2/*.c")    
```

上面我们就定义了两个独立的子工程目标，编译时候会生成两个互不依赖的可执行文件。

### 从根域继承全局设置

暂时先不谈target间的依赖问题，如果我们有许多通用设置，每个target下都得设置一遍，那会非常冗余，也不好维护。

因此，我们可以把这些配置移到target域的外面，也就是根作用域中去设置，这样对当前xmake.lua以及所有子xmake.lua中的target都会生效，例如：

```lua
add_links("tbox")
add_linkdirs("lib")
add_includedirs("include")

target("test1")
    set_kind("binary")
    add_files("src/test1/*.c")
    
target("test2")
    set_kind("binary")
    add_files("src/test2/*.c")    
```

比如这两target都需要链接tbox库，放置在外层根域设置，test1和test2都能加上对应links。

### 目标间的依赖设置

那如果某个target需要用到另外一个tatget生成的静态库，应该怎么配置呢？

一种方式就是通过`add_linkdirs`和`add_links`手动指定对应target最后生成的目录库所在目录，然后把链接加上。






```lua
target("foo")
    set_kind("static")
    add_files("foo/*.c")
    add_defines("FOO")

target("test1")
    set_kind("binary")
    add_includedirs("foo/inc")
    add_links("foo")
    add_linkdirs("$(buildir)")
    add_files("test1/*.c")
    add_defines("FOO")
    
target("test2")
    set_kind("binary")
    add_includedirs("foo/inc")
    add_links("foo")
    add_linkdirs("$(buildir)")
    add_files("test2/*.c")
    add_defines("FOO")
```

上述配置中，test1和test2都会用到libfoo库，并且需要获取到libfoo库的头文件路径，库路径和链接，并且在使用过程中还需要额外设置`-DFOO`宏定义开关才行。

看上去没啥，其实这么写有两个问题：

1. test目标和另外两个库目标之间是有编译顺序依赖的，如果test先编译就会提示链接库找不到
2. 配置太过繁琐不好维护，test1和test2有很多冗余配置

那有没有更加简单可靠的配置方式呢，其实我们只需要`add_deps`来对target间配置上依赖关系即可。

```lua
target("foo")
    set_kind("static")
    add_files("*.c")
    add_defines("FOO", {public = true})
    add_includedirs("foo/inc", {public = true})

target("test1")
    set_kind("binary")
    add_deps("foo")
    add_files("test1/*.c")
    
target("test2")
    set_kind("binary")
    add_deps("foo")
    add_files("test2/*.c")
```

对比下，test1和test2的配置，是不是精简了好多？仅仅通过`add_deps("foo")`就继承了libfoo的所有导出设置：linkdirs, links, includedirs以及defines

其中target自身生成的库默认就会自动导出链接设置，而includedirs和defines通过设置public属性，我们也将它们标记为导出，这样可以被test目标继承到。

并且，现在有了依赖关系，xmake在编译的时候，会自动处理这些target之间的编译顺序，保证不会出现链接的时候，libfoo库还没有生成的问题。

### 依赖继承的进一步解析

#### 级联依赖继承

根据上文所说，target会自动继承依赖目标中的配置和属性，不需要额外调用`add_links`, `add_linkdirs`和`add_rpathdirs`等接口去关联依赖目标了。

并且继承关系是支持级联的，例如：

```lua
target("library1")
    set_kind("static")
    add_files("*.c")
    add_includedirs("inc") -- 默认私有头文件目录不会被继承
    add_includedirs("inc1", {public = true}) -- 此处的头文件相关目录也会被继承

target("library2")
    set_kind("static")
    add_deps("library1")
    add_files("*.c")

target("test")
    set_kind("binary")
    add_deps("library2")
```

上面的配置中，test依赖library2，然后library2又依赖library1，那么通过`add_deps`仅仅添加library2的依赖，test就可以完整继承整个依赖链上的所有导出设置。

#### 禁用默认的继承行为

那如果我们不想继承依赖target的任何配置，如何操作呢？

```lua
add_deps("dep1", "dep2", {inherit = false})
```

通过显式设置inherit配置，来告诉xmake，这两个依赖的配置是否需要被继承，如果不设置，默认就是启用继承的。

#### 可继承的导出属性详解

上文，我们还通过 `add_includedirs("inc1", {public = true})`, 设置public为true, 将includedirs的设置公开给其他依赖的子target继承。 

目前对于target的编译链接flags相关接口设置，都是支持继承属性的，可以人为控制是否需要导出给其他target来依赖继承，目前支持的属性有：

| 属性      | 描述                                                             |
| ----      | ----                                                             |
| private   | 默认设置，作为当前target的私有配置，不会被依赖的其他target所继承 |
| public    | 公有配置，当前target，依赖的子target都会被设置                   |
| interface | 接口设置，仅被依赖的子target所继承设置，当前target不参与         |

这个其实参考借鉴了cmake的设计，目前xmake中只要跟target相关的所有编译链接设置接口，都是支持可见性导出的，例如：`add_includedirs`, `add_defines`, `add_cflags`等等。


关于这块的详细信息，可以看下：https://github.com/xmake-io/xmake/issues/368
