---
title: xmake内建变量和外置变量的使用
tags: [xmake, 内建变量, 外置变量]
date: 2016-08-08
author: Ruki
outline: deep
---

title: xmake内建变量和外置变量的使用
tags: [xmake, 内建变量, 外置变量]
date: 2016-08-08
author: Ruki

---
## 内建变量

内置在字符串中，例如：

```lua
    set_objectdir("$(buildir)/.objs")
```

其中的$(buildir)就是内建变量，这些是随着每次xmake config的配置改变而自动改变的。

目前支持的一些变量如下：

* $(buildir): 编译输出目录，可通过：`xmake f -o /tmp` 修改
* $(projectdir): 工程主目录，可通过：`xmake f -P ./project` 修改
* $(os): 编译目标的操作系统
* $(plat): 编译目标的所在的平台，可通过：`xmake f -p android`修改
* $(mode): 编译模式：debug、release、profile，可通过： `xmake f -m debug` 修改
* $(arch): 编译目标的架构，可通过： `xmake f -a armv7` 修改





注：所有通过`xmake f/config`配置的参数选项都可以通过内置变量访问，例如android下：

```lua
xmake f -p android --ndk=/xxxx
```

那么$(ndk)就是可访问变量，并且随着配置的改变而改变，但是这个在非android平台不能使用。

其他所有的配置相关变量，可以通过以下命令来查看：

```lua
xmake f --help 
```

## 外置变量

外置变量很简单，就是lua的变量操作，因为xmake.lua本身就是lua脚本，那么lua的所有特性当然都能直接使用，因此可以这么使用：

```lua

local root = "/tmp"
set_objectdir(root .. ".objs")
```

通过lua的字符串变量追加语法就行了，是不是很简单。

