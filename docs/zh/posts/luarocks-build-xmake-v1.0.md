---
title: 一个使用 xmake 构建 c/c++ 模块的 luarocks 插件
tags: [xmake, lua, C/C++, xmake, luarocks]
date: 2021-01-22
author: Ruki
---

[luarocks](https://luarocks.org/) 是 lua 的一个包管理工具，提供了各种 lua 模块的安装集成，在用户安装 lua 模块的过程中，它会使用内置的构建系统对 c/c++ 模块进行构建。

但是，它的构建系统只提供简单的配置，对于复杂的 c/c++ 模块的，就有点力不从心了，并且也无法灵活配置切换工具链。

尽管它也提供了 make 和 cmake 的构建后端支持，但是通过 makefile 方式维护同样不够灵活，而 cmake 需要用户自己提前安装好 cmake 工具，否则安装 lua 模块的时候就会被打断。

这里，我实现了一个基于 xmake 构建系统来构建 lua c/c++ 模块的 luarocks 插件 [luarocks-build-xmake](https://github.com/xmake-io/luarocks-build-xmake)，来实现更加灵活方便的 lua 模块维护。

相比 luarocks 内建的构建系统，它提供了更加强大的构建配置，支持 c/c++ 依赖管理，相比 cmake 它不需要用户手动安装 xmake，此插件会自动安装 xmake 后，直接编译 lua 模块，对用户来讲，不需要做额外的操作。

* [luarocks-build-xmake](https://github.com/xmake-io/luarocks-build-xmake)
* [xmake](https://github.com/xmake-io/xmake)


### 例子1 (带有 xmake.lua)

如果模块工程中使用了 xmake.lua 来维护构建，那么我们可以直接使用 xmake 去构建它，rockspec 文件中不需要额外的配置构建规则。

```
├── src
│   ├── test.c
│   └── test.h
└── xmake.lua
```

#### xmake.lua

我们需要使用 `add_rules("luarocks.module")` 添加针对 luarocks 模块构建规则。

```lua
add_rules("mode.debug", "mode.release")

target("example1.hello")
    add_rules("luarocks.module")
    add_files("src/test.c")
```

#### rockspec

```lua
package = "example1"
version = "1.0-1"
source = {
    url = "git://github.com/xmake-io/luarocks-build-xmake",
    tag = "example1"
}
dependencies = {
    "lua >= 5.1",
    "luarocks-build-xmake"
}
build = {
    type = "xmake",
    copy_directories = {}
}
```






### 例子2 (没有 xmake.lua)

如果模块工程中没有使用 xmake.lua 来维护，那么我们也可以使用 xmake 替代 luarocks 内置的构建来编译，只需要在 rockspec 文件中去描述构建规则。

```
├── src
    ├── test.c
    └── test.h
```

#### rockspec

```lua
package = "example2"
version = "1.0-1"
source = {
    url = "git://github.com/xmake-io/luarocks-build-xmake",
    tag = "example2"
}
dependencies = {
    "lua >= 5.1",
    "luarocks-build-xmake"
}
build = {
    type = "xmake",
    modules = {
        ["example2.hello"] = {
            sources = "src/test.c"
        }
    },
    copy_directories = {}
}
```

### 设置特定 xmake 版本

```lua
dependencies = {
    "lua >= 5.1",
    "luarocks-build-xmake"
}
build = {
    type = "xmake",
    variables = {
        xmake = {
            version = "2.5.1"
        }
    },
    copy_directories = {}
}
```

## 设置 xmake 编译参数

此插件提供了更多灵活的工具链配置，比如切换到 mingw 工具链，或者切换 vs 和 sdk 版本，修改 vs 运行时库，又或者切到 debug 编译模式等等。

```lua
dependencies = {
    "lua >= 5.1",
    "luarocks-build-xmake"
}
build = {
    type = "xmake",
    variables = {
        xmake = {
            plat = "mingw",
            arch = "x86_64",
            mode = "debug",
            cflags = "-DTEST1",
            cc = "gcc",
            ld = "gcc",
            ldflags = "...",
            mingw = "mingw sdk path",
            vs = "2019",
            vs_runtime = "MT",
            vs_toolset = "",
            vs_sdkver = "",
        }
    },
    copy_directories = {}
}
```