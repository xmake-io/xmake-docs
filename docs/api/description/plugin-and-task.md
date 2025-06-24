# Plugin and Task

Xmake can implement custom tasks or plugins. The core of both is the `task` task. The two are actually the same. The xmake plugins are implemented with `task`.

## task

- Defining plugins or tasks

The `task` field is used to describe a custom task implementation, in the same level as [target](/api/description/project-target) and [option](/api/description/configuration-option).

For example, here is a simple task defined:

```lua
task("hello")

    -- Set the run script
    on_run(function ()
        print("hello xmake!")
    end)
```

This task only needs to print `hello xmake!`, how do you run it?

Since the [set_menu](#set_menu) setting menu is not used here, this task can only be called inside the custom script of `xmake.lua` or other tasks, for example:

```lua
target("test")

    after_build(function (target)

        -- Import task module
        import("core.project.task")

        -- Run the hello task
        task.run("hello")
    end)
```

Run the `hello` task after building the `test` target.

## task_end

- End defining plugins or tasks

This is an optional api that shows the departure option scope, similar to [target_end](/api/description/project-target#target-end).

## set_menu

- Setting the task menu

By setting a menu, this task can be opened to the user to manually call through the command line. The menu settings are as follows:

```lua
task("echo")

    -- Set the run script
    on_run(function ()

        -- Import parameter option module
        import("core.base.option")

        -- Initialize color mode
        local modes = ""
        for _, mode in ipairs({"bright", "dim", "blink", "reverse"}) do
            if option.get(mode) then
                modes = modes .. " " .. mode
            end
        end

        -- Get parameter content and display information
        cprint("${%s%s}%s", option.get("color"), modes, table.concat(option.get("contents") or {}, " "))
    end)

    -- Set the command line options for the plugin. There are no parameter options here, just the plugin description.
    set_menu {
                -- Settings menu usage
                usage = "xmake echo [options]"

                -- Setup menu description
            ,   description = "Echo the given info!"

                -- Set menu options, if there are no options, you can set it to {}
            ,   options =
                {
                    -- Set k mode as key-only bool parameter
                    {'b', "bright", "k", nil, "Enable bright." }
                ,   {'d', "dim", "k", nil, "Enable dim." }
                ,   {'-', "blink", "k", nil, "Enable blink." }
                ,   {'r', "reverse", "k", nil, "Reverse color." }

                    -- When the menu is displayed, a blank line
                ,   {}

                    -- Set kv as the key-value parameter and set the default value: black
                ,   {'c', "color", "kv", "black", "Set the output color."
                                                     , " - red"
                                                     , " - blue"
                                                     , " - yellow"
                                                     , " - green"
                                                     , " - magenta"
                                                     , " - cyan"
                                                     , " - white" }

                    -- Set `vs` as a value multivalued parameter and a `v` single value type
                    -- generally placed last, used to get a list of variable parameters
                ,   {}
                ,   {nil, "contents", "vs", nil, "The info contents." }
                }
            }
```

After defining this task, execute `xmake --help` and you will have one more task item:

```
Tasks:

    ...

    Echo Echo the given info!
```

If the classification is `plugin` by [set_category](#set_category), then this task is a plugin:

```
Plugins:

    ...

    Echo Echo the given info!
```

To run this task manually, you can execute:

```bash
$ xmake echo hello xmake!
```

Just fine, if you want to see the menu defined by this task, you only need to execute: `xmake echo [-h|--help]`, the result is as follows:

```bash
Usage: $xmake echo [options]

Echo the given info!

Options:
    -v, --verbose Print lots of verbose information.
        --backtrace Print backtrace information for debugging.
        --profile Print performance data for debugging.
        --version Print the version number and exit.
    -h, --help Print this help message and exit.

    -F FILE, --file=FILE Read a given xmake.lua file.
    -P PROJECT, --project=PROJECT Change to the given project directory.
                                           Search priority:
                                               1. The Given Command Argument
                                               2. The Environment Variable: XMAKE_PROJECT_DIR
                                               3. The Current Directory

    -b, --bright Enable bright.
    -d, --dim Enable dim.
    --, --blink Enable blink.
    -r, --reverse Reverse color.

    -c COLOR, --color=COLOR Set the output color. (default: black)
                                               - red
                                               - blue
                                               - yellow
                                               - green
                                               - magenta
                                               - cyan
                                               - white

    Contents ... The info contents.
```

::: tip NOTE
The most part of the menu is the common options built into xmake. Basically, each task will be used. You don't need to define it yourself to simplify the menu definition.
:::

Below, let's actually run this task, for example, I want to display the red `hello xmake!`, only need to:

```bash
$ xmake echo -c red hello xmake!
```

You can also use the full name of the option and highlight it:

```bash
$ xmake echo --color=red --bright hello xmake!
```

The last variable argument list is retrieved by `option.get("contents")` in the `run` script, which returns an array of type `table`.

## set_category

- Setting task categories

It is only used for grouping of menus. Of course, the plugin will use `plugin` by default. The built-in task will use `action` by default, but it is just a convention.

::: tip NOTE
You can use any name you define yourself. The same name will be grouped and displayed together. If it is set to `plugin`, it will be displayed in the Plugins group of xmake.
:::

E.g:

```lua
plugins:
    l, lua Run the lua script.
    m, macro Run the given macro.
       doxygen Generate the doxygen document.
       project Generate the project file.
       hello Hello xmake!
       app2ipa Generate .ipa file from theGiven .app
       echo Echo the given info!
```

If you do not call this interface to set the classification, the default is to use the `Tasks` group display, which represents the normal task.

## on_run

- Setting up a task to run a script

There are two ways to set it up. The easiest way is to set the inline function:

```lua
task("hello")

    on_run(function ()
        print("hello xmake!")
    end)
```

This is convenient and small for small tasks, but it is not suitable for large tasks, such as plugins, which require complex scripting support.

This time you need a separate module file to set up the run script, for example:

```lua
task("hello")
    on_run("main")
```

Here the `main` is set to run the main entry module for the script. The file name is `main.lua`, placed in the same directory as `xmake.lua` that defines `task`. Of course, you can use other file names.

The directory structure is as follows:

```
projectdir
    - xmake.lua
    - main.lua
```

The contents of `main.lua` are as follows:

```lua
function main(...)
    print("hello xmake!")
end
```

It's a simple script file with the main function of `main`. You can import various extension modules via [import](/api/scripts/builtin-modules/import) to implement complex functions, such as:

```lua
-- Import parameter option module
import("core.base.option")

-- Entrance function
function main(...)

    -- Get the parameter content
    print("color: %s", option.get("color"))
end
```

You can also create multiple custom module files in the current directory and use them after importing via [import](/api/scripts/builtin-modules/import), for example:

```
Projectdir
    - xmake.lua
    - main.lua
    - module.lua
```

The contents of `module.lua` are as follows:

```lua
-- Define an export interface
function hello()
    print("hello xmake!")
end
```

::: tip NOTE
The private interface is named by the `_hello` with a descending line prefix, so that the imported module will not contain this interface and will only be used inside the module itself.
:::

Then make a call in `main.lua`:


```lua
import("module")

function main(...)
    module.hello()
end
```

For more modules, see: [Builtin Module](/api/scripts/builtin-modules/import) and [Extension Module](/api/scripts/extension-modules/core-base-option)

Among them, the parameter in `main(...)` is specified by `task.run`, for example:

```lua
task.run("hello", {color="red"}, arg1, arg2, arg3)
```

Inside the `arg1, arg2` these are the arguments to the `hello` task `main(...)` entry, and `{color="red"}` to specify the parameter options in the task menu.

For a more detailed description of `task.run`, see: [task.run](#task-run)
