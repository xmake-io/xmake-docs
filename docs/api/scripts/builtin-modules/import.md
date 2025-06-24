# import

Used in script code such as custom scripts, plug-in scripts, task scripts, platform extensions, template extensions, etc., that is, in code blocks like the following, you can use these module interfaces:

```lua
on_run(function (target)
    print("hello xmake!")
end)
```

::: tip NOTE
In order to ensure that the description scope of the outer layer is as simple and secure as possible, it is generally not recommended to use the interface and module operation api in this domain. Therefore, most module interfaces can only be used in the script domain to implement complex functions. </br>
:::

Of course, a small number of read-only built-in interfaces can still be used in the description scope, as shown in the following table:

An example of using an interface call in a description scope is as follows, generally only for conditional control:

```lua
-- Scan all subdirectories under the current xmake.lua directory, defining a task task with the name of each directory
for _, taskname in ipairs(os.dirs("*"), path.basename) do
    task(taskname)
        on_run(function ()
        end)
end
```

The script scope and description scope mentioned above mainly refer to:

```lua
-- description scope
target("test")

    -- description scope
    set_kind("static")
    add_files("src/*.c")

    on_run(function (target)
        -- Script domain
    end)

-- description scope
```

## Importing extension blocks

Import is mainly used to import xmake's extension class library and some custom class library modules, generally used to:

* Custom script ([on_build](/api/description/project-target#on-build), [on_run](/api/description/project-target#on-run) ..)
* Plugin development
* Template development
* Platform extension
* Custom task task

The import mechanism is as follows:

1. Import from the current script directory first
2. Import from the extended class library

Imported grammar rules:

Class library path rules based on `.`, for example:

Import core core extension module

```lua
import("core.base.option")
import("core.base.task")

function main()

    -- Get parameter options
    print(option.get("version"))

    -- Run tasks and plugins
    task.run("hello")
end
```

Import the custom module in the current directory:

Directory Structure:

```
Plugin
  - xmake.lua
  - main.lua
  - modules
    - hello1.lua
    - hello2.lua
```

Import modules in main.lua

```lua
import("modules.hello1")
import("modules.hello2")
```

After importing, you can directly use all the public interfaces inside. The private interface is marked with the `_` prefix, indicating that it will not be exported and will not be called externally. .

In addition to the current directory, we can also import libraries in other specified directories, for example:

```lua
import("hello3", {rootdir = "/home/xxx/modules"})
```

To prevent naming conflicts, you can also specify an alias after import:

```lua
import("core.platform.platform", {alias = "p"})

function main()

    -- So we can use p to call the plats interface of the platform module to get a list of all the platforms supported by xmake.
    utils.dump(p.plats())
end
```

Import can not only import the class library, but also import and import as inheritance, realize the inheritance relationship between modules.

```lua
import("xxx.xxx", {inherit = true})
```

This is not a reference to the module, but all the public interfaces of the module imported, so that it will be merged with the interface of the current module to achieve inheritance between modules.

Version 2.1.5 adds two new properties: `import("xxx.xxx", {try = true, anonymous = true}).

If the try is true, the imported module does not exist, only return nil, and will not interrupt xmake after throwing an exception.
If anonymous is true, the imported module will not introduce the current scope, only the imported object reference will be returned in the import interface.

## Custom extension module

Through import, we can import not only many built-in extension modules of xmake, but also user-defined extension modules.

Just put your own module in the project directory and import it according to the import method described above.

So, what if you want to define a module? xmake has a set of convention rules for module writing specifications, and does not follow Lua's native require import mechanism, and there is no need to use return in the module to return it globally.

If we have a module file foo.lua, its content is as follows:

```lua
function _foo(a, b)
    return a + b
end

function add(a, b)
    _foo(a, b)
end

function main(a, b)
    add(a, b)
end
```

Among them main is the entry function, optional, if set, the module foo can be called directly, for example:

```lua
import("foo")
foo(1, 2)
```

Or directly like this:

```lua
import("foo")(1, 2)
```


Others without underscore are public module interface functions, such as add.

```lua
import("foo")
foo.add(1, 2)
```

The underscore prefixed `_foo` is a private function that is used internally by the module and is not exported, so users cannot call it outside.
