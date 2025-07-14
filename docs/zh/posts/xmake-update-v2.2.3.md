---
title: xmake v2.2.3, 大量新特性支持
tags: [xmake, lua, C/C++, 版本更新, 远程包管理, 包依赖, 自动构建]
date: 2018-11-30
author: Ruki
---

此版本主要是对远程依赖包管理进行了一些改进，并且新增了很多小特性，并且此版本已经可以支持通过`xmake update`来自我更新升级了，以后升级xmake将会更加方便。

关于新特性的详细说明见文章下文。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

## 更新内容

### 新特性

* [#233](https://github.com/xmake-io/xmake/issues/233): 对mingw平台增加windres的支持
* [#239](https://github.com/xmake-io/xmake/issues/239): 添加cparser编译器支持
* 添加插件管理器，`xmake plugin --help`
* 添加`add_syslinks`接口去设置系统库依赖，分离与`add_links`添加的库依赖之间的链接顺序
* 添加 `xmake l time xmake [--rebuild]` 去记录编译耗时
* [#250](https://github.com/xmake-io/xmake/issues/250): 添加`xmake f --vs_sdkver=10.0.15063.0`去改变windows sdk版本
* 添加`lib.luajit.ffi`和`lib.luajit.jit`扩展模块
* [#263](https://github.com/xmake-io/xmake/issues/263): 添加object目标类型，仅仅用于编译生成object对象文件
* [#269](https://github.com/xmake-io/xmake/issues/269): 每天第一次构建时候后台进程自动清理最近30天的临时文件
* 增加`xmake update`命令实现自我更新

### 改进

* [#229](https://github.com/xmake-io/xmake/issues/229): 改进vs toolset选择已经vcproj工程文件生成
* 改进编译依赖，对源文件列表的改动进行依赖判断
* 支持解压*.xz文件
* [#249](https://github.com/xmake-io/xmake/pull/249): 改进编译进度信息显示格式
* [#247](https://github.com/xmake-io/xmake/pull/247): 添加`-D`和`--diagnosis`去替换`--backtrace`，改进诊断信息显示
* [#259](https://github.com/xmake-io/xmake/issues/259): 改进 on_build, on_build_file 和 on_xxx 等接口
* 改进远程包管理器，更加方便的包依赖配置切换
* 支持only头文件依赖包的安装
* 支持对包内置links的手动调整，`add_packages("xxx", {links = {}})`

### Bugs修复

* 修复安装依赖包失败中断后的状态不一致性问题





## 新特性说明

### 自我更新升级支持

我们可以通过以下命令，进行快速升级：

```console
$ xmake update
```

也可以指定分支，升级更新到master/dev版本：

```console
$ xmake update dev
$ xmake update master
```

### 新增插件管理器

用于拉取通过[xmake-plugins](https://github.com/xmake-io/xmake-plugins)官方插件仓库维护的扩展插件，更新集成到本地：

```console
$ xmake plugin --install
```

执行上面的命令，就会安装所有扩展插件。

### 添加系统链接库

新增`add_syslinks`设置接口，此接口使用上跟[add_links](/zh/manual#add-links)类似，唯一的区别就是，通过这个接口添加的链接库顺序在所有`add_links`之后。

因此主要用于添加系统库依赖，因为系统库的链接顺序是非常靠后的，例如：

```lua
add_syslinks("pthread", "m", "dl")
target("demo")
    add_links("a", "b")
    add_linkdirs("$(buildir)/lib")
```

上面的配置，即使`add_syslinks`被优先提前设置了，但最后的链接顺序依然是：`-la -lb -lpthread -lm -ldl`

### hook内置的文件编译过程

target里面新增了三个接口，用户hook每个文件编译过程：

```lua
target("test")

    set_kind("binary")
    add_files("src/*.c")

    before_build_file(function (target, sourcefile, opt)
    end)

    on_build_file(function (target, sourcefile, opt)
        opt.origin(target, sourcefile, opt)
    end)

    after_build_file(function (target, sourcefile, opt)
    end)
```

其中opt.origin保存的是`on_build_file`的内建build脚本，如果还想使用内建的构建行为，可以继续调用它执行源文件编译。

### 新增vs toolset和winsdk ver的快速切换

如果我们要在vs2017下支持编译xp兼容程序，可以这么设置：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c") 

    -- compatible with xp
    add_defines("_USING_V140_SDK71_")
    add_ldflags("/SUBSYSTEM:CONSOLE,5.01")
```

然后执行：

```console
$ xmake f --vs_toolset=14.0
$ xmake
```

我们也可以指定winsdk版本：

```console
$ xmake f --vs_sdkver=10.0.15063.0 -c
$ xmake project -k vs2015
```

### 改进的依赖包设置

add_packages现在可以支持覆写内置的links，控制实际链接的库：


```lua
-- 默认会有 ncurses, panel, form等links
add_requires("ncurses") 

target("test")
    
    -- 显示指定，只使用ncurses一个链接库
    add_packages("ncurses", {links = "ncurses"})
```

或者干脆禁用links，只使用头文件：

```lua
add_requires("lua")
target("test")
    add_packages("lua", {links = {}})
```


并且我们也新增了group参数到`add_requires`，来分组依赖包，同一个组下的所有依赖包，只能有一个生效启用，启用顺序依赖`add_requires`添加的顺序:

```lua
add_requires("openssl", {group = "ssl", optional = true})
add_requires("mbedtls", {group = "ssl", optional = true})

target("test")
    add_packages("openssl", "mbedtls")
```

例如上面，所以同时依赖两个ssl包，实际上只会启用生效实际安装成功的那一个ssl包，并不会同时链接两个依赖包。

我们还新增了`on_load`参数，在依赖包加载成功后，会被调用，提供用户一个机会去设置一些其他的flags，例如：

```lua
add_requires("tbox", {on_load = function (package)
    package:add("defines_h", "PACKAGE_HAVE_TBOX")
end})
```

当依赖包tbox生效加载后，添加`PACKAGE_HAVE_TBOX`宏到`config.h`中去。