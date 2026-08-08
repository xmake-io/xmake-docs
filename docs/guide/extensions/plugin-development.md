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

## Install Plugins <Badge type="tip" text="v3.1.0" />

Since v3.1.0, `xmake plugin` can install plugins for you instead of copying directories by hand.

```sh
# install from the configured repositories, by name
$ xmake plugin --install hello

# install from the given repository
$ xmake plugin --install xmake-repo@hello

# install from a git url, the `github:` shortcut and `#branch` are supported
$ xmake plugin --install https://github.com/myrepo/hello-world
$ xmake plugin --install github:myrepo/hello-world
$ xmake plugin --install github:myrepo/hello-world#dev

# install from a local directory, this is handy while developing a plugin
$ xmake plugin --install /tmp/my-plugin
```

Installed plugins live in `~/.xmake/plugins/<name>`, so they take effect globally.

`--list` groups the built-in plugins, the installed ones, and the ones that are available in the configured repositories but not installed yet, each with its description.

```sh
$ xmake plugin --list
```

And to remove them:

```sh
# remove the given plugin
$ xmake plugin --remove hello

# remove all installed plugins
$ xmake plugin --clear
```

## Distribute Plugins <Badge type="tip" text="v3.1.0" />

To make a plugin installable from a repository, describe it as a package of the `plugin` kind, using the same directory layout as packages, i.e. `<repodir>/plugins/<first-letter>/<name>/xmake.lua`.

```lua
-- plugins/h/hello/xmake.lua
package("hello")
    set_kind("plugin")
    set_description("Hello xmake!")
    set_sourcedir(path.join(os.scriptdir(), "src"))
```

The `src` directory holds the plugin implementation itself, that is the `xmake.lua` + `main.lua` pair described above.

```
plugins
|-- h
|  |-- hello
|  |  |-- xmake.lua      -- the package description
|  |  |-- src
|  |  |  |-- xmake.lua   -- the plugin task definition
|  |  |  |-- main.lua    -- the plugin entry
```

For plugins whose sources live directly in the repository, `on_install` can be omitted, xmake copies the plugin directory into `~/.xmake/plugins/<name>` by default.

Since a plugin is really just a package of the `plugin` kind, it also gets all the usual package capabilities, e.g. `add_urls`, `add_versions`, `add_deps`, and a custom `on_install` / `on_test`.

See also [Repository Management](../package-management/repository-management.md) for how to add your own repository.
