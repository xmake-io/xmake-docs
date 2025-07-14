---
title: xmake中add_files的使用
tags: [xmake, 模式匹配]
date: 2016-02-04
author: Ruki
---

如果你看了[工程描述入门](/cn/2016/02/03/project-description/)，那么是否觉得通过 add_files 添加源文件相当的方便？

目前它可以支持`.c/.cpp/.s/.S/.m/.mm/.o/.obj/.a/.lib`这些后缀的源代码和库文件，其中通配符*表示匹配当前目录下文件，而**则匹配多级目录下的文件。

例如：

```lua
    add_files("src/test_*.c")
    add_files("src/xxx/**.cpp")
    add_files("src/asm/*.S", "src/objc/**/hello.m")
```

`add_files`的使用其实是相当灵活方便的，其匹配模式我借鉴了premake的风格，但是又对其进行了改善和增强。

使得不仅可以匹配文件，还有可以在添加文件同时，过滤排除指定模式的一批文件。。

例如：

```lua
    -- 递归添加src下的所有c文件，但是不包括src/impl/下的所有c文件
    add_files("src/**.c|impl/*.c")

    -- 添加src下的所有cpp文件，但是不包括src/test.cpp、src/hello.cpp以及src下所有带xx_前缀的cpp文件
    add_files("src/*.cpp|test.cpp|hello.cpp|xx_*.cpp")
```

其中分隔符之后的都是需要排除的文件，这些文件也同样支持匹配模式，并且可以同时添加多个过滤模式，只要中间用竖线分割就行了。。

注： 为了使得描述上更加的精简, 分隔符之后的过滤描述都是基于起一个模式：src/*.cpp 中 *之前的目录为基础的。



所以上面的例子后面过滤的都是在src下的文件，这个是要注意的。。

下面来看个[TBOX](https://github.com/waruqi/tbox)的xmake.lua中`add_files`的例子：

```lua
    add_files("*.c") 
    add_files("asio/aioo.c") 
    add_files("asio/aiop.c") 
    add_files("math/**.c") 

    -- 这里过滤了libc/string/impl/**.c
    add_files("libc/**.c|string/impl/**.c") 

    add_files("utils/*.c|option.c") 
    add_files("prefix/**.c") 
    add_files("memory/**.c") 
    add_files("string/**.c") 

    -- 这里过滤了stream/**/charset.c，stream/**/zip.c，stream/**async_**.c，stream/transfer_pool.c
    add_files("stream/**.c|**/charset.c|**/zip.c|**async_**.c|transfer_pool.c") 

    -- 这里过滤了network/impl/ssl下的所有c文件
    add_files("network/**.c|impl/ssl/*.c") 

    add_files("algorithm/**.c") 
    add_files("container/**.c") 
    add_files("libm/libm.c") 
    add_files("libm/idivi8.c") 
    add_files("libm/ilog2i.c") 
    add_files("libm/isqrti.c") 
    add_files("libm/isqrti64.c") 
    add_files("libm/idivi8.c") 
    add_files("platform/*.c|aicp.c")

    -- 如果当前架构是arm，则添加arm相关的asm优化代码
    if is_arch("arm.*") then
        add_files("utils/impl/crc_arm.S")
    end

    -- 如果当前启用了charset模块，那么添加对应的c文件（这里的文件在上面是被过滤掉的）
    -- options接口后续会详解
    if options("charset") then 
        add_files("charset/**.c")
        add_files("stream/impl/filter/charset.c")
    end
```

添加文件的时候支持过滤一些文件的一个好处就是，可以为后续根据不同开关逻辑添加文件提供基础。

尤其需要提一下的是，xmake还支持直接添加`.o/obj/.a/.lib`的对象文件和库文件到目标中

这个跟add_links是有区别的，links是链接库中的代码，而这个是直接将静态库中的对象文件合并到目标程序中。。

这个的详细介绍，可参看[高级特性之合并静态库](/cn/2016/02/04/merge-static-library/)
