## Introduction

XMake supports the plugin module and we can develop ourself plugin module conveniently.

We can run command `xmake -h` to look over some builtin plugins of xmake

```
Plugins: 
    l, lua                                 Run the lua script.
    m, macro                               Run the given macro.
       doxygen                             Generate the doxygen document.
       hello                               Hello xmake!
       project                             Create the project file.
```

* lua: Run a given lua script.
* macro: Record and playback some xmake commands repeatably.
* doxygen：Generate doxygen document automatically.
* hello:  The demo plugin and only print: 'hello xmake!'
* project：Generate project file for IDE, and now it can generate make, cmake, vs, xcode (need cmake), ninja project file and compile_commands.json and compile_flags.txt

## Quick Start

Now we write a simple plugin demo for printing 'hello xmake!'

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

Now one of the most simple plugin finished, how was it to be xmake detected it, there are three ways:

1. Put this plugin directory into xmake/plugins the source codes as the builtin plugin.
2. Put this plugin directory into ~/.xmake/plugins as the global user plugin.
3. Put this plugin directory (hello) to the `./plugins` directory of the current project and call `add_plugindirs("plugins")` in xmake.lua as the local project plugin.

## Run Plugin

Next we run this plugin

```bash
xmake hello
```

The results is 

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
