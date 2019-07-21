
xmake's project description file xmake.lua is based on the lua syntax, but in order to make the project build logic more convenient and concise, xmake encapsulates it, making writing xmake.lua not as cumbersome as some makefiles.

Basically write a simple project build description, just three lines, for example:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

## Scope

The description syntax of xmake is divided by scope, which is mainly divided into:

- external scope
- Internal scope
- Interface scope

Which ones belong to the outside and which ones belong to the inside? if you look at the comments below, you know what it is:

```lua
-- external scope
target("test")

    -- external scope
    set_kind("binary")
    add_files("src/*.c")

    on_run(function ()
        -- Internal scope
        end)

    after_package(function ()
        -- Internal scope
        end)

-- external scope
task("hello")

    -- external scope
    on_run(function ()
        -- Internal scope
        end)
```

Simply put, all within the custom script `function () end` belongs to the internal scope, which is the script scope, and all other places belong to the external scope. .

### external Scope

For most projects, you don't need complicated engineering descriptions, and you don't need custom scripting support. You just need a simple `set_xxx` or `add_xxx` to meet your needs.

Then according to the 28th law, 80% of the cases, we only need to write:

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

No complicated api calls, no complicated variable definitions, and if judgments and for loops. It's succinct and readable. At a glance, it doesn't matter if you don't understand lua grammar.

As a simple description of the syntax, it looks a bit like a function call, you will know how to configure it at a basic point of programming.

In order to be concise and secure, in this scope, many lua built-in apis are not open, especially related to writing files and modifying the operating environment, only providing some basic read-only interfaces, and logical operations.

The current external scope lating lua built-in apis are:

- table
- string
- pairs
- ipairs
- print
- os

Of course, although the built-in lua api does not provide much, xmake also provides a lot of extension APIs. It is not much to describe the api. For details, please refer to: [API Manual](/manual)

There are also some auxiliary apis, for example:

- dirs: scan to get all the directories in the currently specified path
- files: scan to get all the files in the current specified path
- format: format string, short version of string.format

There are also variable definitions and logical operations that can be used. after all, it is based on lua. The basic syntax is still there. We can switch the compiled files by if:

```lua
target("test")
    set_kind("static")
    if is_plat("iphoneos") then
        add_files("src/test/ios/*.c")
    else
        add_files("src/test/*.c")
    end
```

It should be noted that the variable definition is divided into global variables and local variables. The local variables are only valid for the current xmake.lua, and do not affect the child xmake.lua.

```lua
-- local variables, only valid for current xmake.lua
local var1 = 0

-- global variables that affect all subsmake.lua included after includes()
var2 = 1

includes("src")
```

### Internal Scope

Also known as plug-ins, script scope, provide more complex and flexible script support, generally used to write some custom scripts, plug-in development, custom task tasks, custom modules, etc.

Usually included by `function () end`, and passed to the `on_xxx`, `before_xxx` and `after_xxx` interfaces, are all self-scoped.

E.g:

```lua
-- custom script
target("hello")
    after_build(function ()
        -- Internal scope
        end)

-- custom tasks, plugins
task("hello")
    on_run(function ()
        -- Internal scope
        end)
```

In this scope, not only can you use most lua apis, but you can also use many extension modules provided by xmake. All extension modules are imported through import.

For details, please refer to: [import module document](/manual/builtin_modules?id=import)

Here we give a simple example, after the compilation is complete, ldid signature on the ios target program:

```lua
target("iosdemo")
    set_kind("binary")
    add_files("*.m")
    after_build(function (target)

        -- Execute signature, if it fails, automatically interrupt, giving a highlight error message
        os.run("ldid -S$(projectdir)/entitlements.plist %s", target:targetfile())
    end)
```

It should be noted that in the internal scope, all calls are enabled with the exception catching mechanism. if the operation is wrong, xmake will be automatically interrupted and an error message will be given.

Therefore, the script is written without the cumbersome `if retval then` judgment, and the script logic is more clear.

### Interface Scope

All descriptions of api settings in the external scope are also scoped. They are called in different places and have different scopes of influence, for example:

```lua
-- global root scope, affecting all targets, including subproject target settings in includes()
add_defines("DEBUG")

-- define or enter the demo target scope (support multiple entry to append settings)
target("demo")
    set_kind("shared")
    add_files("src/*.c")
    -- the current target scope only affects the current target
    add_defines("DEBUG2")

-- option settings, only local settings are supported, not affected by global api settings
option("test")
    -- local scope of the current option
    set_default(false)

-- other target settings, -DDEBUG will also be set
target("demo2")
    set_kind("binary")
    add_files("src/*.c")

-- re-enter the demo target scope
target("demo")
    -- append macro definitions, only valid for the current demo target
    add_defines("DEBUG3")
```

Normally, entering another target/option domain setting will automatically leave the previous target/option field, but sometimes in order to compare some scope pollution, we can show off a domain, for example:

```lua
option("test")
    set_default(false)
option_end()

target("demo")
    set_kind("binary")
    add_files("src/*.c")
target_end()
```

Call `option_end()`, `target_end()` to explicitly leave the current target/option field setting.

### Scope indentation

Indentation in xmake.lua is just a specification for more clear distinction. The current setting is for that scope, although it is ok even if it is not indented, but it is not very readable. .

e.g:

```lua
target("xxxx")
    set_kind("binary")
    add_files("*.c")
```

with

```lua
target("xxxx")
set_kind("binary")
add_files("*.c")
```

The above two methods are the same in effect, but in understanding, the first one is more intuitive. At first glance, you know that `add_files` is only set for target, not global.

Therefore, proper indentation helps to better maintain xmake.lua

Finally attached, tbox's [xmake.lua](https://github.com/tboox/tbox/blob/master/src/tbox/xmake.lua) description, for reference only. .

## Syntax simplification

The configuration field syntax of xmake.lua is very flexible and can be used in a variety of complex and flexible configurations in the relevant domain, but for many streamlined small block configurations, this time is slightly redundant:

```lua
option("test1")
    set_default(true)
    set_showmenu(true)
    set_description("test1 option")

option("test2")
    set_default(true)
    set_showmeu(true)

option("test3")
    set_default("hello")
```

xmake 2.2.6 or later, for the above small block option domain settings, we can simplify the description into a single line:

```lua
option("test1", {default = true, showmenu = true, description = "test1 option"})
option("test2", {default = true, showmenu = true})
option("test3", {default = "hello"})
```

In addition to the option field, this simplified writing is also supported for other domains, such as:

```lua
target("demo")
    set_kind("binary")
    add_files("src/*.c")
```

Simplified to:

```lua
target("demo", {kind = "binary", files = "src/*.c"})
```

Of course, if the configuration requirements are more complicated, or the original multi-line setting method is more convenient, this depends on your own needs to evaluate which method is used.

