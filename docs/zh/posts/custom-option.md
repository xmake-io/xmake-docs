---
title: xmake高级特性之自定义选项
tags: [xmake, 自定义选项]
date: 2016-08-07
author: Ruki
outline: deep
---

xmake还可以支持一些自定义选项开关，使得工程支持可选编译，方便工程的模块化管理。

## 增加自定义编译开关

我们拿一个实际的例子来说：

我们想在自己的工程中增加一个新开关选项：hello， 如果这个开关被启用，会在target中添加特定的一些源码文件，但是这个开挂默认是不被启用的，需要通过配置`xmake f --hello=true`才会被链接和使用

并且使用的时候，需要定义一些特殊的宏定义：`-DHELLO_TEST -DHELLO_ENABLE`

那么我们开始进行xmake.lua修改，过程并不复杂：

1. 在xmake.lua的头部通过option接口定义一个名叫hello的开关选项

```lua

--定义一个名叫hello的开关选项，这个接口跟add_target是同级的，不要在add_target里面使用（使用了也没什么问题，只是不大好看）
option("hello")

    -- 默认禁用这个开关，需要手动xmake f --hello=true才会启用，当然你也可以默认启用它
    set_default(false)

    -- 定义一些宏开关，这个只有在hello被启用的时候才会被定义
    add_defines_if_ok("HELLO_ENABLE", "HELLO_TEST")
```




2. 将定义好的hello开关选项，与你的target项目进行绑定

```lua

-- 添加一个test目标
target("test")
    
    -- 生成可执行程序
    set_kind("binary")

    -- 绑定hello开关选项
    add_options("hello")

    -- 添加一些hello才需要的源码文件
    if options("hello") then
        add_files("hello/*.c")
    end
```

ok了，只要两步，接下来就是编译了：

```bash

# 直接编译，默认是禁用hello的，所以hello的相关代码，都没有被编译进去
$ xmake 

# 接下来我们启用它，重新编译下，这个时候，hello/*.c的代码也被编译进去了，同时-DHELLO_TEST -DHELLO_ENABLE也被添加到编译选项中了
$ xmake f --hello=true
$ xmake -r
```

很方便吧。。只需两步就行。。接下来，我们再稍微修饰下：

```lua

option("hello")

    -- 默认禁用这个开关，需要手动xmake f --hello=true才会启用，当然你也可以默认启用它
    set_default(false)

    -- 定义一些宏开关，这个只有在hello被启用的时候才会被定义
    add_defines_if_ok("HELLO_ENABLE", "HELLO_TEST")

    -- 启用显示菜单，这样xmake f --help的时候，你这个新加的开关就会被显示出来
    set_showmenu(true)

    -- 对菜单中开关进行分类，这样显示的时候 布局会更好看，这个不是必须的
    set_category("module_xxx")

    -- 在菜单中，对这个开关进行详细描述
    set_description("Enable or disable the hello module")

```

这个时候，你再敲下：

```bash
$ xmake f --help
```

会显示如下菜单信息：

```
此处省略...

--hello=HELLO       Enable or disable the hello module (default: false)

此处省略...
```

这样给别人看的时候，也就更明了些。。。

## 自动检测机制

接下来，我们整的稍微复杂些，让这个hello被启用的时候，自动链接上libhello.a库，并且可以对libhello.a进行自动检测，如果不存在，就禁用hello开关。。

修改如下：

```lua

option("hello")

    -- 默认禁用这个开关，需要手动xmake f --hello=true才会启用，当然你也可以默认启用它
    set_default(false)

    -- 定义一些宏开关，这个只有在hello被启用的时候才会被定义
    add_defines_if_ok("HELLO_ENABLE", "HELLO_TEST")

    -- 启用显示菜单，这样xmake f --help的时候，你这个新加的开关就会被显示出来
    set_showmenu(true)

    -- 在菜单中，对这个开关进行详细描述
    set_description("Enable or disable the hello module")

    -- 添加链接库libhello.a，这个在xmake f 会去自动检测，如果检测链接不通过，那么这个开关就会被禁用掉
    -- 如果ok，编译的时候会自动加上-lhello
    add_links("hello")

    -- 添加链接库检测搜索目录，如果路径不对，检测就会链接不通过，如果ok，在编译的时候，会自动加上-L./libs
    add_linkdirs("libs")

```

修改后，如果这个hello开关被手动启用，或者自动检测通过，会在编译连接的时候，自动加上-L./libs -lhello的连接选项。

## 增加一些其他的检测规则

针对自动检测，除了可以检测链接库，还可以增加一些其他的检测规则：

* 检测头文件是否能够正常包含
* 类型定义是否存在
* 接口api是否存在
* 检测链接库是否能够正常链接

例如：

```lua

option("hello")

    -- 默认禁用这个开关，需要手动xmake f --hello=true才会启用，当然你也可以默认启用它
    set_default(false)

    -- 定义一些宏开关，这个只有在hello被启用的时候才会被定义
    add_defines_if_ok("HELLO_ENABLE", "HELLO_TEST")

    -- 启用显示菜单，这样xmake f --help的时候，你这个新加的开关就会被显示出来
    set_showmenu(true)

    -- 在菜单中，对这个开关进行详细描述
    set_description("Enable or disable the hello module")

    -- 添加链接库libhello.a，这个在xmake f 会去自动检测，如果检测链接不通过，那么这个开关就会被禁用掉
    -- 如果ok，编译的时候会自动加上-lhello
    add_links("hello")

    -- 添加链接库检测搜索目录，如果路径不对，检测就会链接不通过，如果ok，在编译的时候，会自动加上-L./libs
    add_linkdirs("libs")

    -- 检测在c代码中: include "hello/hello.h"，是否成功，ok的话才启用hello
    -- 检测c++代码请使用：add_cxxincludes
    add_cincludes("hello/hello.h")

    -- 添加头文件检测路径，ok的话，会自动加上：-Iinc/xxx -I./inc的 编译选项
    add_includedirs("inc/$(plat)", "inc")

    -- 检测对c代码类型wchar_t的支持，如果不存在这个类型，就检测失败
    -- 检测会依赖add_cincludes中提供的头文件，如果给定的头文件中定义了这个类型，就能检测通过
    -- 检测c++代码请使用：add_cxxtypes
    add_ctypes("wchar_t")

    -- 检测对c代码中是否存在接口api：hello_test()
    -- 检测会依赖add_cincludes中提供的头文件，如果给定的头文件中定义了这个类型，就能检测通过
    -- 检测c++代码请使用：add_cxxfuncs
    add_cfuncs("hello_test")

```

需要注意的是，所有的检测都是and关系，必须全部通过，才会自动启用hello开关。

## 其他可以被自动添加的api

并且在检测ok或者被手动启用后，可以自动添加一些特殊的编译选项、宏定义，这些接口如下：

* `add_cflags`：选项开关被启用后，自动添加c编译选项
* `add_cxflags`：选项开关被启用后，自动添加c/c++编译选项
* `add_cxxflags`：选项开关被启用后，自动添加c++编译选项
* `add_ldflags`：选项开关被启用后，自动添加链接选项
* `add_vectorexts`：选项开关被启用后，自动添加指令扩展选项，例如：mmx, sse ...

## 自动生成config.h配置文件

option不仅可以在编译的时候，自动添加编译选项，还可以在启用后，自动生成各种宏开关到config.h文件中，方便我们在代码里面控制编译逻辑

具体的使用说明，见：[依赖包的添加和自动检测机制](https://xmake.io/zh/)

