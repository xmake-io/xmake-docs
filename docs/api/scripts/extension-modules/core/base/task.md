
# core.base.task

Used for task operations, generally used to call other task tasks in custom scripts and plug-in tasks.

## task.run

- Run the specified task

#### Function Prototype

::: tip API
```lua
task.run(name: <string>, opt: <table>, ...)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Required. Task name |
| opt | Optional. Task options table |
| ... | Optional. Arguments passed to the task function |

#### Usage

Used to run tasks or plugins defined by [task](/api/description/plugin-and-task.html#task) in custom scripts, plugin tasks, for example:

```lua
task("hello")
    on_run(function ()
        print("hello xmake!")
    end)

target("demo")
    on_clean(function(target)

        -- Import task module
        import("core.base.task")

        -- Run this hello task
        task.run("hello")
    end)
```

We can also increase parameter passing when running a task, for example:

```lua
task("hello")
    on_run(function (arg1, arg2)
        print("hello xmake: %s %s!", arg1, arg2)
    end)

target("demo")
    on_clean(function(target)

        -- Import task
        import("core.base.task")

        -- {} This is used for the first option, which is set to null, where two arguments are passed in the last: arg1, arg2
        task.run("hello", {}, "arg1", "arg2")
    end)
```

The second argument to `task.run` is used to pass options from the command line menu instead of passing directly into the `function (arg, ...)` function entry, for example:

```lua
-- Import task
import("core.base.task")

-- Plugin entry
function main(...)

    -- Run the built-in xmake configuration task, equivalent to: xmake f|config --plat=iphoneos --arch=armv7
    task.run("config", {plat="iphoneos", arch="armv7"})
end
```
