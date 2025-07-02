# Plugin Development

## Introduction

XMake supports the plugin module and we can conveniently develop our own plugin modules.

We can run the command `xmake -h` to look over some built-in plugins of xmake

```
Plugins:
    l, lua                                 Run the lua script.
    m, macro                               Run the given macro.
       doxygen                             Generate the doxygen document.
       hello                               Hello xmake!
       project                             Create the project file.
```

* lua: Run a given lua script.
* macro: Record and playback some xmake commands repeatedly.
* doxygen: Generate doxygen documentation automatically.
* hello:  The demo plugin and only prints: 'hello xmake!'
* project: Generate project files for IDEs. It can generate make, cmake, vs, xcode (needs cmake), ninja project files, compile_commands.json, and compile_flags.txt

## Quick Start

Now let's write a simple plugin demo for printing 'hello xmake!'

```lua
-- define a plugin task
task("hello")

    -- set the category for showing it in plugin category menu (optional)
    set_category("plugin")

    -- the main entry of the plugin
    on_run(function ()

        -- print 'hello xmake!'
        print("hello xmake!")
    end)

    -- set the menu options, but we put empty options now.
    set_menu {
                -- usage
                usage = "xmake hello [options]"

                -- description
            ,   description = "Hello xmake!"

                -- options
            ,   options = {}
            }
```

The file tree of this plugin:

```
plugins
|-- hello
|  |-- xmake.lua
|...
| notice no xmake.lua in plugins directory
```

Now one of the most simple plugins is finished. How does xmake detect it? There are three ways:

1. Put this plugin directory into xmake/plugins in the source code as a built-in plugin.
2. Put this plugin directory into ~/.xmake/plugins as a global user plugin.
3. Put this plugin directory (hello) into the `./plugins` directory of the current project and call `add_plugindirs("plugins")` in xmake.lua as a local project plugin.

## Run Plugin

Next we run this plugin

```sh
xmake hello
```

The result is

```
hello xmake!
```

Finally, we can also run this plugin in the custom scripts of `xmake.lua`

```lua

target("demo")

    -- run this plugin after building target
    after_build(function (target)

        -- import task module
        import("core.project.task")

        -- run the plugin task
        task.run("hello")
    end)
```
