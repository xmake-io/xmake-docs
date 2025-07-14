---
title: A luarocks build plugin for lua module with c/c++ based on xmake
tags: [xmake, lua, C/C++, toolchains, xrepo, packages, vcpkg, conan, Apple, Silicon]
date: 2021-01-22
author: Ruki
---

[luarocks](https://luarocks.org/) is a package management tool of lua, which provides the installation and integration of various lua modules.

When users install lua modules, it will use the built-in build system to build lua module with c/c++ codes.

However, it's build system only provides simple configuration. For complex c/c++ modules, it is a little bit powerless, and it cannot be flexibly switch the toolchain.

Although it also provides other back-ends (make, cmake), but make/makefile is also not flexible enough,
and cmake requires users to install the cmake program in advance, otherwise the installation of the lua module will be interrupted.

Here, I have implemented a luarocks plugin [luarocks-build-xmake](https://github.com/xmake-io/luarocks-build-xmake) based on xmake to build lua c/c++ modules
to achieve more flexible and convenient lua module maintenance.

Compared with the builtin build system of luarocks, it provides a more powerful build configuration and supports c/c++ dependency management.
Compared with cmake, it does not require users to manually install xmake. This plugin will automatically install xmake and directly compile lua modules.
In terms of users, no additional operations are required.

* [luarocks-build-xmake](https://github.com/xmake-io/luarocks-build-xmake)
* [xmake](https://github.com/xmake-io/xmake)

### Example1 (with xmake.lua)

We can build c/c++ modules if the project contain xmake.lua

```
├── src
│   ├── test.c
│   └── test.h
└── xmake.lua
```

#### xmake.lua

We need to use `add_rules("luarocks.module")` to add build rules for luarocks modules.

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






### Example2 (without xmake.lua)

We can use xmake as builtin build type to build c/c++ modules if the project does not contain xmake.lua

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

### Set special xmake version

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

### Set xmake compilation configuration

This plugin provides more flexible toolchain configuration, such as switching to the mingw toolchain, or switching between vs and sdk versions,
modifying the vs runtime library, or switching to debug compilation mode, etc.

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