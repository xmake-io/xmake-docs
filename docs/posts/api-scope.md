---
title: xmake Description Syntax and Scope Explained
tags: [xmake, api, project description, scope]
date: 2016-10-26
author: Ruki
outline: deep
---

Although xmake's project description file `xmake.lua` is based on lua syntax, xmake has wrapped it with an additional layer to make writing project build logic more convenient and concise, so that writing `xmake.lua` won't be as tedious as writing makefiles.

Basically, writing a simple project build description only takes three lines, for example:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

Then just compile and run it:

```bash
$ xmake run test
```

This greatly improves development efficiency for those who want to write some test code temporarily.

### Scope and Project Description Syntax

xmake's description syntax is divided by scope, mainly divided into:

* External scope
* Internal scope

So which ones belong to external scope and which ones belong to internal scope? Looking at the comments below, you'll get a general idea:

```lua

-- External scope

target("test")

    -- External scope
    set_kind("binary")
    add_files("src/*.c")

    on_run(function ()
        -- Internal scope
        end)

    after_package(function ()
        -- Internal scope
        end)


-- External scope

task("hello")

    -- External scope

    on_run(function ()
        -- Internal scope
        end)
```

Simply put, everything inside custom scripts `function () end` belongs to internal scope, which is the script scope. Everything else belongs to external scope.

#### External Scope

For most projects, you don't need very complex project descriptions or custom script support. Simple `set_xxx` or `add_xxx` can meet the requirements.

According to the Pareto principle, 80% of the time, we only need to write like this:

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

No complex API calls, no various tedious variable definitions, and no `if` judgments and `for` loops. What we want is simplicity and readability. At a glance, even if you don't understand lua syntax, it doesn't matter.

Just treat it as simple description syntax, which looks a bit like function calls. Anyone with basic programming knowledge can basically see how to configure it at a glance.

To achieve simplicity and security, in this scope, many lua built-in APIs are not exposed, especially those related to writing files and modifying the operating environment. Only some basic read-only interfaces and logical operations are provided.

Currently, the lua built-in APIs exposed in external scope are:

* `table`
* `string`
* `pairs`
* `ipairs`
* `print`: Modified version, providing formatted printing support
* `os`: Only provides read-only interfaces, such as `getenv`, etc.

Of course, although not many built-in lua APIs are provided, xmake also provides many extension APIs. The description APIs are not mentioned in detail. For details, please refer to: [Project Description API Documentation](https://github.com/waruqi/xmake/wiki/%E5%B7%A5%E7%A8%8B%E6%8F%8F%E8%BF%B0api%E6%96%87%E6%A1%A3)

There are also some auxiliary APIs, such as:

* `dirs`: Scan and get all directories in the specified path
* `files`: Scan and get all files in the specified path
* `format`: Format string, shorthand version of `string.format`

Variable definitions and logical operations can also be used. After all, it's based on lua. The basic syntax should still be available. We can use `if` to switch compilation files:

```lua
target("test")
    set_kind("static")

    if is_plat("iphoneos") then
        add_files("src/test/ios/*.c")
    else
        add_files("src/test/*.c")
    end
```

We can also enable and disable a certain sub-project target:

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

Note that variable definitions are divided into global variables and local variables. Local variables are only valid for the current `xmake.lua` and do not affect sub `xmake.lua` files:

```lua

-- Local variable, only valid for current xmake.lua
local var1 = 0

-- Global variable, affects all subsequent sub xmake.lua files included by add_subfiles(), add_subdirs()
var2 = 1

add_subdirs("src")
```

#### Internal Scope

Also known as plugin and script scope, it provides more complex and flexible script support, generally used for writing custom scripts, plugin development, custom task tasks, custom modules, etc.

Generally, everything contained by `function () end` and passed into `on_xxx`, `before_xxx` and `after_xxx` interfaces belongs to internal scope.

For example:

```lua

-- Custom script
target("hello")
    after_build(function ()
        -- Internal scope
        end)

-- Custom task, plugin
task("hello")
    on_run(function ()
        -- Internal scope
        end)
```

In this scope, you can not only use most of lua's APIs, but also use many extension modules provided by xmake. All extension modules are imported through `import`.

For details, please refer to: [Plugin Development: Import Libraries](https://xmake.io/)

Here we give a simple example. After compilation, sign the ios target program with ldid:

```lua
target("iosdemo")

    set_kind("binary")
    add_files("*.m")
    after_build( function (target) 

        -- Execute signing, if it fails, automatically interrupt and give highlighted error information
        os.run("ldid -S$(projectdir)/entitlements.plist %s", target:targetfile())
    end)
```

Note that in internal scope, all calls enable exception capture mechanism. If an error occurs during operation, xmake will automatically interrupt and give error prompt information.

Therefore, scripts don't need tedious `if retval then` judgments, and script logic is more clear at a glance.

#### Interface Scope

All description API settings in external scope also have scope distinctions. Calling them in different places has different impact ranges, for example:

```lua

-- Global root scope, affects all targets, including sub-project target settings in add_subdirs()
add_defines("DEBUG")

-- Define or enter demo target scope (supports multiple entries to append settings)
target("demo")
    set_kind("shared")
    add_files("src/*.c")

    -- Current target scope, only affects current target
    add_defines("DEBUG2")

-- Option settings, only support local settings, not affected by global API settings
option("test")
    
    -- Current option's local scope
    set_default(false)

-- Other target settings, -DDEBUG will also be set
target("demo2")
    set_kind("binary")
    add_files("src/*.c")
    

-- Re-enter demo target scope
target("demo")

    -- Append macro definition, only valid for current demo target
    add_defines("DEBUG3")

```

xmake also has some global APIs that only provide global scope support, for example:

* `add_subfiles()`
* `add_subdirs()`
* `add_packagedirs()`

etc. These calls should not be placed between the local scopes of `target` or `option`. Although there is no actual difference, it will affect readability and can easily be misleading.

Usage is as follows:

```lua
target("xxxx")
    set_kind("binary")
    add_files("*.c")

-- Include sub-module files
add_subdirs("src")
```

#### Scope Indentation

Indentation in `xmake.lua` is just a writing specification, used to more clearly distinguish which scope the current setting is for. Although it's okay even without indentation, readability is not very good.

For example:

```lua
target("xxxx")
    set_kind("binary")
    add_files("*.c")
```

and

```lua
target("xxxx")
set_kind("binary")
add_files("*.c")
```

The above two methods have the same effect, but in terms of understanding, the first one is more intuitive. At a glance, you can see that `add_files` is only set for the target, not a global setting.

Therefore, appropriate indentation helps to better maintain `xmake.lua`.

Finally, here are [tbox](https://github.com/waruqi/tbox)'s [xmake.lua](https://github.com/waruqi/tbox/blob/master/xmake.lua) and [src/tbox/xmake.lua](https://github.com/waruqi/tbox/blob/master/src/tbox/xmake.lua) descriptions for reference.

