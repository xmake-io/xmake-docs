
# core.base.task

用于任务操作，一般用于在自定义脚本中、插件任务中，调用运行其他task任务。

## task.run

- 运行指定任务

用于在自定义脚本、插件任务中运行[task](/zh/api/description/plugin-and-task.html#task)定义的任务或插件，例如：

```lua
task("hello")
    on_run(function ()
        print("hello xmake!")
    end)

target("demo")
    on_clean(function(target)

        -- 导入task模块
        import("core.base.task")

        -- 运行这个hello task
        task.run("hello")
    end)
```

我们还可以在运行任务时，增加参数传递，例如：

```lua
task("hello")
    on_run(function (arg1, arg2)
        print("hello xmake: %s %s!", arg1, arg2)
    end)

target("demo")
    on_clean(function(target)

        -- 导入task
        import("core.base.task")

        -- {} 这个是给第一种选项传参使用，这里置空，这里在最后面传入了两个参数：arg1, arg2
        task.run("hello", {}, "arg1", "arg2")
    end)
```

对于`task.run`的第二个参数，用于传递命令行菜单中的选项，而不是直接传入`function (arg, ...)`函数入口中，例如：

```lua
-- 导入task
import("core.base.task")

-- 插件入口
function main(...)

    -- 运行内置的xmake配置任务，相当于：xmake f|config --plat=iphoneos --arch=armv7
    task.run("config", {plat="iphoneos", arch="armv7"})
emd
```
