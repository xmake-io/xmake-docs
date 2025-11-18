---
title: xmake从入门到精通11：如何组织构建大型工程
tags: [xmake, lua, 子工程, 子模块]
date: 2020-04-11
author: Ruki
outline: deep
---

xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。

本文主要详细讲解下，如何通过配置子工程模块，来组织构建一个大规模的工程项目。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

### 维护简单的项目结构

对于一些轻量型的小工程，通常只需要单个xmake.lua文件就能搞定，大体结构如下：

```
projectdir
  - xmake.lua
  - src
    - test
      - *.c
    - demo
      - *.c
```

源码下面层级简单，通常只需要在项目根目录维护一个xmake.lua来定义所有target就能完成构建，看上去并不是很复杂，也很清晰。

```lua
-- 在根域设置通用配置，当前所有targets都会生效
add_defines("COMMON")

target("test")
    set_kind("static")
    add_files("src/test/*.c")
    add_defines("TEST")

target("demo")
    set_kind("static")
    add_files("src/demo/*.c")
    add_defines("DEMO")
```

### 维护复杂的项目结构

但是对于一些大型项目，通常的组织结构层次很多也很深，需要编译的target目标也可能有十几甚至上百个，这个时候如果还是都在根xmake.lua文件中维护，就有点吃不消了。

这个时候，我们就需要通过在每个子工程模块里面，单独创建xmake.lua来维护他们，然后使用xmake提供的includes接口，将他们按层级关系包含进来，最终变成一个树状结构：


```
projectdir
  - xmake.lua
  - src
    - test
      - xmake.lua
      - test1
        - xmake.lua
      - test2
        - xmake.lua
      - test3
        - xmake.lua
    - demo
      - xmake.lua
      - demo1
        - xmake.lua
      - demo2
        - xmake.lua
    ...
```

然后，根xmake.lua会将所有子工程的xmake.lua通过层级includes全部引用进来，那么所有定义在子工程的target配置也会完全引用进来，我们在编译的时候永远不需要单独去切到某个子工程目录下操作，只需要：

```bash
$ xmake build test1
$ xmake run test3
$ xmake install demo1
```

就可以编译，运行，打包以及安装指定的子工程target，所以除非特殊情况，平常不推荐来回切换目录到子工程下单独编译，非常的繁琐。







### 根xmake.lua文件配置

通常推荐的做法就是在根xmake.lua中仅仅配置一些对所有target都通用的设置，以及includes对子工程的引用，不放置对targets的定义，例如：

```lua
-- define project
set_project("tbox")
set_xmakever("2.3.2")
set_version("1.6.5", {build = "%Y%m%d%H%M"})

-- set common flags
set_warnings("all", "error")
set_languages("c99")
add_cxflags("-Wno-error=deprecated-declarations", "-fno-strict-aliasing", "-Wno-error=expansion-to-defined")
add_mxflags("-Wno-error=deprecated-declarations", "-fno-strict-aliasing", "-Wno-error=expansion-to-defined")

-- add build modes
add_rules("mode.release", "mode.debug")

-- includes sub-projects
includes("test", "demo")
```

xmake里面所有的设置都是按tree状继承的，根xmake.lua中的root域设置会对所有includes的子xmake.lua里面的targets生效，
但反过来不会，子xmake.lua里面的root域设置仅对它下面的子xmake.lua生效，不会影响到父xmake.lua中定义的targets。

### 子xmake.lua文件配置

所以，我们可以在每个子工程目录中，单独配置xmake.lua，里面的所有配置不会干扰父xmake.lua，只对它下面的更细粒度的子工程生效，就这样一层层按tree状生效下去。

由于，已经在根xmake.lua配置了大部分通用配置，那么我们可以在test子工程下，专心配置只对test有用的设置，例如对于`projectdir/test/xmake.lua`：

```lua
add_defines("TEST")

target("test1")
    set_kind("static")
    add_files("test1/*.c")
    add_defines("TEST1")

target("test2")
    set_kind("static")
    add_files("test2/*.c")
    add_defines("TEST2")
```

我们可以在这里定义test的所有target，当然也可以继续分层，在每个test1, test2目录下单独维护xmake.lua，这个看自己项目的规模来决定。

比如：

```lua
add_defines("TEST")
includes("test1", "test2")
```

test1/xmake.lua

```lua
target("test1")
    set_kind("static")
    add_files("test1/*.c")
    add_defines("TEST1")
```

test2/xmake.lua

```lua
target("test2")
    set_kind("static")
    add_files("test2/*.c")
    add_defines("TEST2")
```


而这里面的`add_defines("TEST")`在root域，会对test1/test2两个target都生效，但是对于demo目录的target不生效，因为它们是平级的，没有tree状继承关系。

### 跨xmake.lua间目标依赖

虽然，`projectdir/test/xmake.lua`和`projectdir/demo/xmake.lua`两个子工程目录是平级关系，配置无法相互干扰，但是targets是可以跨xmake.lua访问的，来实现目标间的依赖。

比如demo需要依赖test静态库，进行链接使用，那么demo下xmake.lua可以这么写：

```lua
target("demo1")
    set_kind("binary")
    add_files("demo1/*.c")
    add_deps("test1")
```

只要通过`add_deps("test1")`关联上对应其他子工程目标作为依赖即可，test1静态库会优先编译，并且demo可执行程序会自动link上它生成的libtest1.a库。

### 文件路径的层级关系

我们需要记住，所有跟路径相关的配置接口，比如`add_files`, `add_includedirs`等都是相对于当前子工程xmake.lua所在的目录的，所以只要添加的文件不跨模块，那么设置起来只需要考虑当前的相对路径就行了。

```
projectdir
  - test
    - xmake.lua
    - test1/*.c
    - test2/*.c
```

比如，这里添加的源文件路径，都是相对于test子工程目录的，我们不需要去设置绝对路径，这样会简化很多。

```lua
target("test1")
    add_files("test1/*.c")
target("test2")
    add_files("test2/*.c")
```

当然，如果我们有特殊需求，非要设置工程其他子模块下的文件路径呢？两种办法，通过`../../`的方式一层层绕出去，另外一种就是使用`$(projectdir)`内置变量，它表示项目全局根目录。

比如在demo子工程下：

```lua
target("demo1")
    set_kind("binary")
    add_files("demo1/*.c")
    add_files("../../test/test1/*.c")
```

或者：

```lua
target("demo1")
    set_kind("binary")
    add_files("demo1/*.c")
    add_files("$(projectdir)/test/test1/*.c")
```

### includes接口使用进阶

#### 错误的使用方式

includes这个接口属于全局接口，不隶属于任何target，所以请不要在target内部调用，下面是错误的用法：

```lua
target("test")
    set_kind("static")
    includes("test1", "test2")
    add_files("test/*.c")
```

正确的用法是：


```lua
includes("test1", "test2")
target("test")
    set_kind("static")
    add_files("test/*.c")
```

或者：

```lua
target("test")
    set_kind("static")
    add_files("test/*.c")
target_end()

-- 在下面调用，需要先显式退出target作用域
includes("test1", "test2")
```

#### 引用目录或文件

另外，includes既可以引用目录，也可以直接引用文件，如果test1目录下存在xmake.lua，那么可以直接`includes("test1")`来引用目录。

如果test1目录下是其他xxxx.lua命令的项目文件，可以通过指定文件来引用：`includes("test1/xxxx.lua")`，效果一样的。

#### 模式匹配进行批量导入

includes还支持通过模式匹配的方式来批量导入多个子工程，比如：

```lua
includes("test/*/xmake.lua")
```

可以导入test目录下，所有test1, test2等子工程目录下的配置，如果是`**`还支持递归多级匹配

```lua
includes("test/**/xmake.lua")
```

通过模式匹配，我们只需要在test/xmake.lua一处地方进行includes，以后用户在新增其他子工程xmake.lua，就会自动导入进来，非常方便。

#### 注意事项

另外，在使用includes的过程中，需要注意的一点是，它不是c语言的`#include`，因此在当前配置中includes子配置，当前配置是不会有任何影响的，比如：

```lua
includes("xxx")

target("test")
  -- ...
```

上面includes了一些子工程，但是这些子工程的配置是不会干扰当前test目标程序的。