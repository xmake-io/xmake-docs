
xmake's project description file xmake.lua is based on the lua syntax, but in order to make the project build logic more convenient and concise, xmake encapsulates it, making writing xmake.lua not as cumbersome as some makefiles.

Basically write a simple project build description, just three lines, for example:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

## Configuration Separation

Xmake.lua uses the 28th principle to implement a two-layer separate configuration of the description domain and the script domain.

What is the 28th principle? In short, most of the project configuration, 80% of the cases, are basic basic configurations, such as: `add_cxflags`, `add_links`, etc.
Only less than 20% of the space needs to be extra complex to meet some special configuration needs.

The remaining 20% of the configuration is usually more complicated. if it is directly flooded in the whole xmake.lua, the whole project configuration will be very confusing and very unreadable.

Therefore, xmake isolates 80% of simple configuration and 20% of complex configuration by describing two different configurations of domain and script domain, making the whole xmake.lua look very clear and intuitive, readable and maintainable. Get the best.

### Description Scope

for beginners who are just getting started, or just to maintain some simple small projects, the requirements are fully met by describing the configuration completely. What is the description domain? It looks like this:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("DEBUG")
    add_syslinks("pthread")
```

At first glance, it is actually a configuration set of `set_xxx`/`add_xxx`. for the novice, you can not use it as a lua script, just as an ordinary, but there are some basic rules configuration files.

if, by looking, there are parentheses, or function calls like scripting languages, then we can also write this (whether with parentheses to see personal preferences):

```lua
target "test"
    set_kind "binary"
    add_files "src/*.c"
    add_defines "DEBUG"
    add_syslinks "pthread"
```

Is this looking more like a profile? In fact, the description field is a configuration file, similar to the configuration of keys/values such as json, so even if you are not a newcomer to lua, you can quickly get started.

Moreover, for the usual projects, only the various settings of the project are configured by `set_xxx/add_xxx`, which has fully met the requirements.

This is what I said at the beginning: 80% of the time, you can use the simplest configuration rules to simplify the configuration of the project, improve readability and maintainability, so that users and developers will be very friendly and more intuitive.

What if we want to make some conditional judgments for different platforms and architectures? It doesn't matter, the description field is in addition to the basic configuration, it also supports conditional judgment, as well as the for loop:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("DEBUG")
    if is_plat("linux", "macosx") then
        add_links("pthread", "m", "dl")
    end
```

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("DEBUG")
    for _, name in ipairs({"pthread", "m", "dl"}) do
        add_links(name)
    end
```

Is this looking a bit like lua? Although, it can usually be regarded as a common configuration problem, but xmake is based on lua after all, so the description domain still supports the basic language features of lua.

!> However, it should be noted that although the description field supports lua script syntax, try not to write too complicated lua scripts in the description field, such as some time-consuming function calls and for loops.

And in the description field, the main purpose is to set the configuration item, so xmake does not completely open all module interfaces, many interfaces are forbidden to be called in the description field.
Even open callable interfaces are completely read-only, and time-consuming security interfaces such as `os.getenv()` read some general system information for configuration logic control.

!> Also note that xmake.lua is parsed multiple times to resolve different configuration fields at different stages: for example: `option()`, `target()`, etc.

So, don't think about writing complex lua scripts in the description field of xmake.lua, and don't call print in the description field to display the information, because it will be executed multiple times, remember: it will be executed multiple times! ! !

### Script Scope

Restrict the description field to write complex lua, all kinds of lua modules and interfaces are not used? How to do? This time is the time for the script domain to appear.

if the user is already fully familiar with xmake's description domain configuration and feels that some of the special configuration maintenance on the project is not met, then we can do more complex configuration logic in the script domain:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load(function (target)
        if is_plat("linux", "macosx") then
            target:add("links", "pthread", "m", "dl")
        end
    end)
    after_build(function (target)
        Import("core.project.config")
        Local targetfile = target:targetfile()
        Os.cp(targetfile, path.join(config.buildir(), path.filename(targetfile)))
        Print("build %s", targetfile)
    end)
```

As long as it is similar: `on_xxx`, `after_xxx`, `before_xxx`, etc. The script inside the function body belongs to the script field.

In the script domain, the user can do anything, xmake provides an import interface to import various lua modules built into xmake, and can also import user-supplied lua scripts.

We can implement any function you want to implement in the script domain, even if you write a separate project.

for some script fragments, it is not very bloated, such as the above built-in writing is enough, if you need to implement more complex scripts, do not want to be filled in a xmake.lua, you can separate the script into a separate lua file for maintenance.

E.g:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load("modules.test.load")
    on_install("modules.test.install")
```

We can place the custom scripts in the corresponding directory of xmake.lua, and maintain them independently in `modules/test/load.lua` and `modules/test/install.lua`.

In these independent lua scripts, we can also import various built-in modules and custom modules through [import](/zh-cn/manual/builtin_modules?id=import), just like to write lua, java is no different. .

for the different stages of the script's domain, `on_load` is mainly used for target loading, do some dynamic configuration, not like the description field, it will only be executed once!!!

In other stages, there are many, such as: `on/after/before`_`build/install/package/run`, etc. See the target api manual section later, so I won’t go into details here.

## Configuration Type

In the description domain configuration, you can configure the configuration fields and configuration items. In the configuration domain, you can configure various configuration items through the interface of `set_xxx`/`add_xxx`.

```lua
target("test1")
    set_kind("binary")
    add_files("src/*.c")

target("test2")
    set_kind("binary")
    add_files("src/*.c")
```

In the above configuration, the target belongs to the configuration domain, and all the `set_xx`/`add_xxx` interface configurations below it belong to the configuration item, which is partially effective for this target.

We can understand it as a local scope, similar to the block block in c:

```
target("test1")
{
    set_kind("binary")
    add_files("src/*.c")
}
target("test2")
{
    set_kind("binary")
    add_files("src/*.c")
}
```

However, in order to simplify the writing, xmake stipulates that each newly defined target field starts, and the last configuration field ends automatically. Of course, if the user feels troubled, you can manually configure the leaving domain:


```lua
target("test1")
    set_kind("binary")
    add_files("src/*.c")
target_end()

target("test2")
    set_kind("binary")
    add_files("src/*.c")
target_end()
```

### Configuration Scope

Currently available configuration scopes are: `target()`, `option()`, `task()`, `package()`

for a detailed description of each domain, see: [API Manual](/manual/project_target)

### Configuration Item

As long as the configuration with the words `set_xxx` and `add_xxx` is a configuration item, multiple configuration items can be set in one configuration field.

for a description of the configuration items, see: [Interface Specifications](/manual/specification)

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

### Scope Indentation

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

### Code formatting

The default indentation of the description field configuration syntax does not conform to the lua formatting specification, so the lua language server does not support formatting it.

If you want the IDE, the editor, to support formatting indentation of the configuration better, you can do so by writing `do end` as follows

```lua
target("bar") do
    set_kind("binary")
    add_files("src/*.cpp")
end

target("foo") do
    set_kind("binary")
    add_files("src/*.cpp")
end
```

This allows the Lua LSP to format it correctly as standard lua code, whether this is required or not depends on the user's needs.

If you don't have a habit of using automatic code formatting, then you don't need to do this.

## Multi-level Configuration

In the script field we can import various rich extension modules by import, and in the description field we can introduce the project subdirectory through the [includes](/#/zh-cn/manual/global_interfaces?id=includes) interface. The xmake.lua configuration.

Remember: xmake's includes handles the configuration relationship according to the tree structure. The target configuration in xmake.lua in the subdirectory inherits the root domain configuration in the parent xmake.lua, for example:

Currently there are the following project structures:

```
Projectdir
    - xmake.lua
    - src
      - xmake.lua
```

`projectdir/xmake.lua` is the project's root xmake.lua configuration, and `src/xmake.lua` is a sub-configuration of the project.

`projectdir/xmake.lua` content:

```lua
add_defines("ROOT")

target("test1")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("TEST1")

target("test2")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("TEST2")

Includes("src")
```

The global root domain is configured with `add_defines("ROOT")`, which affects all target configurations below, including all target configurations in the sub-xmake.lua of includes, so this is the global total configuration.

The `add_defines("TEST1")` and `add_defines("TEST2")` in test1/test2 belong to the local configuration and only take effect on the current target.

`src/xmake.lua` content:

```lua
add_defines("ROOT2")

target("test3")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("TEST3")
```

In the `src/xmake.lua` sub-configuration, there is also a global root domain, configured with `add_defines("ROOT2")`, which belongs to the sub-configuration root domain and only takes effect on all targets in the current sub-xmake.lua. For the target xmake.lua in the lower level includes the target, because previously said, xmake is the configuration inheritance relationship of the tree structure.

Therefore, the final configuration results of these targets are:

```
target("test1"): -DROOT -DTEST1
target("test2"): -DROOT -DTEST2
target("test3"): -DROOT -DROOT2 -DTEST3
```

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

