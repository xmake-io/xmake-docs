---
title: xmake 描述语法和作用域详解
tags: [xmake, api, 工程描述, 作用域]
date: 2016-10-26
author: Ruki
outline: deep
---

xmake的工程描述文件xmake.lua虽然基于lua语法，但是为了使得更加方便简洁得编写项目构建逻辑，xmake对其进行了一层封装，使得编写xmake.lua不会像些makefile那样繁琐

基本上写个简单的工程构建描述，只需三行就能搞定，例如：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

然后只需要执行编译并且运行它：

```bash
$ xmake run test
```

这对于想要临时写些测试代码来讲，极大地提升了开发效率。。


### 作用域与工程描述语法

xmake的描述语法是按作用域划分的，主要分为：

* 外部作用域
* 内部作用域






那哪些属于外部，哪些又属于内部呢，看看下面的注释，就知道个大概了：

```lua

-- 外部作用域

target("test")

    -- 外部作用域
    set_kind("binary")
    add_files("src/*.c")

    on_run(function ()
        -- 内部作用域
        end)

    after_package(function ()
        -- 内部作用域
        end)


-- 外部作用域

task("hello")

    -- 外部作用域

    on_run(function ()
        -- 内部作用域
        end)
```

简单的说，就是在自定义脚本`function () end`之内的都属于内部作用域，也就是脚本作用域，其他地方都是都属于于外部作用域。。

#### 外部作用域

对于大部分工程来说，并不需要很复杂的工程描述，也不需要自定义脚本支持，只需要简单的 `set_xxx` 或者 `add_xxx` 就能满足需求了

那么根据二八定律，80%的情况下，我们只需要这么写：

```lua
target("test")
    set_kind("static")
    add_files("src/test/*.c")

target("demo")
    add_deps("test")
    set_kind("binary")
    add_links("test")
    add_files("src/demo/*.c")
```

不需要复杂的api调用，也不需要各种繁琐的变量定义，以及 `if` 判断 和 `for` 循环，要的就是简洁可读，一眼看过去，就算不懂lua语法也没关系

就当做简单的描述语法，看上去有点像函数调用而已，会点编程的基本一看就知道怎么配置。

为了做到简洁、安全，在这个作用域内，很多lua 内置api是不开放出来的，尤其是跟写文件、修改操作环境相关的，仅仅提供一些基本的只读接口，和逻辑操作

目前外部作用域开放的lua内置api有：

* table
* string
* pairs
* ipairs
* print：修改版，提供格式化打印支持
* os：仅提供只读接口，例如getenv等等

当然虽然内置lua api提供不多，但xmake还提供了很多扩展api，像描述api就不多说，详细可参考：[工程描述api文档](https://github.com/waruqi/xmake/wiki/%E5%B7%A5%E7%A8%8B%E6%8F%8F%E8%BF%B0api%E6%96%87%E6%A1%A3)

还有些辅助api，例如：

* dirs：扫描获取当前指定路径中的所有目录
* files：扫描获取当前指定路径中的所有文件
* format: 格式化字符串，string.format的简写版本

还有变量定义、逻辑操作也是可以使用的，毕竟是基于lua的，该有的基础语法，还是要有的，我们可以通过if来切换编译文件：

```lua
target("test")
    set_kind("static")

    if is_plat("iphoneos") then
        add_files("src/test/ios/*.c")
    else
        add_files("src/test/*.c")
    end
```

我们也可以启用和禁用某个子工程target：

```lua
if is_arch("arm*") then

    target("test1")
        set_kind("static")
        add_files("src/*.c")
 
else

    target("test2")
        set_kind("static")
        add_files("src/*.c")
 
end
```

需要注意的是，变量定义分全局变量和局部变量，局部变量只对当前xmake.lua有效，不影响子xmake.lua

```lua

-- 局部变量，只对当前xmake.lua有效
local var1 = 0

-- 全局变量，影响所有之后 add_subfiles(), add_subdirs() 包含的子 xmake.lua 
var2 = 1

add_subdirs("src")
```


#### 内部作用域

也称插件、脚本作用域，提供更加复杂、灵活的脚本支持，一般用于编写一些自定义脚本、插件开发、自定义task任务、自定义模块等等

一般通过 `function () end` 包含，并且被传入到 `on_xxx`, `before_xxx`和`after_xxx`接口内的，都属于自作用域。

例如：

```lua

-- 自定义脚本
target("hello")
    after_build(function ()
        -- 内部作用域
        end)

-- 自定义任务、插件
task("hello")
    on_run(function ()
        -- 内部作用域
        end)
```

在此作用域中，不仅可以使用大部分lua的api，还可以使用很多xmake提供的扩展模块，所有扩展模块，通过`import`来导入

具体可参考：[插件开发之import类库](https://xmake.io/zh/)

这里我们给个简单的例子，在编译完成后，对ios目标程序进行ldid签名：

```lua
target("iosdemo")

    set_kind("binary")
    add_files("*.m")
    after_build( function (target) 

        -- 执行签名，如果失败，自动中断，给出高亮错误信息
        os.run("ldid -S$(projectdir)/entitlements.plist %s", target:targetfile())
    end)
```

需要注意的是，在内部作用域中，所有的调用都是启用异常捕获机制的，如果运行出错，会自动中断xmake，并给出错误提示信息

因此，脚本写起来，不需要繁琐的`if retval then` 判断，脚本逻辑更加一目了然

#### 接口作用域

在外部作用域中的所有描述api设置，本身也是有作用域之分的，在不同地方调用，影响范围也不相同，例如：

```lua

-- 全局根作用域，影响所有target，包括 add_subdirs() 中的子工程target设置
add_defines("DEBUG")

-- 定义或者进入demo目标作用域（支持多次进入来追加设置）
target("demo")
    set_kind("shared")
    add_files("src/*.c")

    -- 当前target作用域，仅仅影响当前target
    add_defines("DEBUG2")

-- 选项设置，仅支持局部设置，不受全局api设置所影响
option("test")
    
    -- 当前选项的局部作用域
    set_default(false)

-- 其他target设置，-DDEBUG 也会被设置上
target("demo2")
    set_kind("binary")
    add_files("src/*.c")
    

-- 重新进入demo目标作用域
target("demo")

    -- 追加宏定义，只对当前demo目标有效
    add_defines("DEBUG3")

```

xmake里面还有些全局api，仅提供全局作用域支持，例如：

* add_subfiles()
* add_subdirs()
* add_packagedirs()

等等，这些调用不要放置在 target 或者 option 的局部作用域之间，虽然没什么实际区别，但是会影响可读性，容易被误导

使用方式，如下：

```lua
target("xxxx")
    set_kind("binary")
    add_files("*.c")

-- 包含子模块文件
add_subdirs("src")
```

#### 作用域缩进

xmake.lua里面缩进，只是个编写规范，用于更加清楚的区分，当前的设置 是针对 那个作用域的，虽然就算不缩进，也一样ok，但是可读性上 并不是很好。。

例如：

```lua
target("xxxx")
    set_kind("binary")
    add_files("*.c")
```

和

```lua
target("xxxx")
set_kind("binary")
add_files("*.c")
```

上述两种方式，效果上都是一样的，但是理解上，第一种更加直观，一看就知道 add_files 仅仅只是针对 target 设置的，并不是全局设置

因此，适当的进行缩进，有助于更好的维护xmake.lua

最后附上，[tbox](https://github.com/waruqi/tbox)的[xmake.lua](https://github.com/waruqi/tbox/blob/master/xmake.lua)和[src/tbox/xmake.lua](https://github.com/waruqi/tbox/blob/master/src/tbox/xmake.lua)描述，仅供参考。。