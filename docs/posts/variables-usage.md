---
title: Using Built-in Variables and External Variables in xmake
tags: [xmake, built-in variables, external variables]
date: 2016-08-08
author: Ruki
outline: deep
---

## Built-in Variables

Embedded in strings, for example:

```lua
    set_objectdir("$(buildir)/.objs")
```

Among them, `$(buildir)` is a built-in variable. These automatically change as the configuration changes with each `xmake config`.

Currently supported variables are as follows:

* `$(buildir)`: Compilation output directory, can be modified via: `xmake f -o /tmp`
* `$(projectdir)`: Project main directory, can be modified via: `xmake f -P ./project`
* `$(os)`: Operating system of the compilation target
* `$(plat)`: Platform where the compilation target is located, can be modified via: `xmake f -p android`
* `$(mode)`: Compilation mode: debug, release, profile, can be modified via: `xmake f -m debug`
* `$(arch)`: Architecture of the compilation target, can be modified via: `xmake f -a armv7`

Note: All parameter options configured through `xmake f/config` can be accessed through built-in variables, for example on android:

```lua
xmake f -p android --ndk=/xxxx
```

Then `$(ndk)` is an accessible variable and changes as the configuration changes, but this cannot be used on non-android platforms.

All other configuration-related variables can be viewed through the following command:

```lua
xmake f --help 
```

## External Variables

External variables are simple, they are lua variable operations. Since `xmake.lua` itself is a lua script, all features of lua can be directly used, so it can be used like this:

```lua

local root = "/tmp"
set_objectdir(root .. ".objs")
```

Just use lua's string variable concatenation syntax. Isn't it simple?

