
xmake可以实现自定义任务或者插件，其两者的核心就是`task`任务，其两者实际上是一样的，xmake的插件都是用`task`实现的。

本质上都是任务，只是[set_category](#taskset_category)分类不同而已。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [task](#task)                                   | 定义插件或者任务                             | >= 2.0.1 |
| [task_end](#task_end)                           | 结束定义插件或任务                           | >= 2.1.1 |
| [set_menu](#taskset_menu)                       | 设置任务菜单                                 | >= 2.0.1 |
| [set_category](#taskset_category)               | 设置任务类别                                 | >= 2.0.1 |
| [on_run](#taskon_run)                           | 设置任务运行脚本                             | >= 2.0.1 |

### task

#### 定义插件或者任务

`task`域用于描述一个自定义的任务实现，与[target](#target)和[option](#option)同级。

例如，这里定义一个最简单的任务：

```lua
task("hello")

    -- 设置运行脚本
    on_run(function ()
        print("hello xmake!")
    end)
```

这个任务只需要打印`hello xmake!`，那如何来运行呢？

由于这里没有使用[set_menu](#taskset_menu)设置菜单，因此这个任务只能再`xmake.lua`的自定义脚本或者其他任务内部调用，例如：

```lua
target("test")

    after_build(function (target)
 
        -- 导入task模块
        import("core.project.task")

        -- 运行hello任务
        task.run("hello")
    end)
```

在构建完`test`目标后运行`hello`任务。

### task_end

#### 结束定义插件或任务

这是一个可选api，显示离开选项作用域，用法和[target_end](#target_end)类似。

### task:set_menu

#### 设置任务菜单

通过设置一个菜单，这个任务就可以开放给用户自己通过命令行手动调用，菜单的设置如下：

```lua
task("echo")

    -- 设置运行脚本
    on_run(function ()

        -- 导入参数选项模块
        import("core.base.option")

        -- 初始化颜色模式
        local modes = ""
        for _, mode in ipairs({"bright", "dim", "blink", "reverse"}) do
            if option.get(mode) then
                modes = modes .. " " .. mode 
            end
        end

        -- 获取参数内容并且显示信息
        cprint("${%s%s}%s", option.get("color"), modes, table.concat(option.get("contents") or {}, " "))
    end)

    -- 设置插件的命令行选项，这里没有任何参数选项，仅仅显示插件描述
    set_menu {
                -- 设置菜单用法
                usage = "xmake echo [options]"

                -- 设置菜单描述
            ,   description = "Echo the given info!"

                -- 设置菜单选项，如果没有选项，可以设置为{}
            ,   options = 
                {
                    -- 设置k模式作为key-only型bool参数
                    {'b', "bright",     "k",  nil,       "Enable bright."               }      
                ,   {'d', "dim",        "k",  nil,       "Enable dim."                  }      
                ,   {'-', "blink",      "k",  nil,       "Enable blink."                }      
                ,   {'r', "reverse",    "k",  nil,       "Reverse color."               }      

                    -- 菜单显示时，空白一行
                ,   {}

                    -- 设置kv作为key-value型参数，并且设置默认值：black
                ,   {'c', "color",      "kv", "black",   "Set the output color."
                                                     ,   "    - red"   
                                                     ,   "    - blue"
                                                     ,   "    - yellow"
                                                     ,   "    - green"
                                                     ,   "    - magenta"
                                                     ,   "    - cyan" 
                                                     ,   "    - white"                  }

                    -- 设置`vs`作为values多值型参数，还有`v`单值类型
                    -- 一般放置在最后，用于获取可变参数列表
                ,   {}
                ,   {nil, "contents",   "vs", nil,       "The info contents."           }
                }
            } 
```

定义完这个任务后，执行`xmake --help`，就会多出一个任务项来：

```
Tasks:

    ...

    echo                    Echo the given info!
```

如果通过[set_category](#taskset_category)设置分类为`plugin`，那么这个任务就是一个插件了：

```
Plugins:

    ...

    echo                    Echo the given info!
```

想要手动运行这个任务，可以执行：

```bash
$ xmake echo hello xmake!
```

就行了，如果要看这个任务定义的菜单，只需要执行：`xmake echo [-h|--help]`，显示结果如下：

```bash
Usage: $xmake echo [options]

Echo the given info!

Options: 
    -v, --verbose                          Print lots of verbose information.
        --backtrace                        Print backtrace information for debugging.
        --profile                          Print performance data for debugging.
        --version                          Print the version number and exit.
    -h, --help                             Print this help message and exit.
                                           
    -F FILE, --file=FILE                   Read a given xmake.lua file.
    -P PROJECT, --project=PROJECT          Change to the given project directory.
                                           Search priority:
                                               1. The Given Command Argument
                                               2. The Envirnoment Variable: XMAKE_PROJECT_DIR
                                               3. The Current Directory
                                           
    -b, --bright                           Enable bright.
    -d, --dim                              Enable dim.
    --, --blink                            Enable blink.
    -r, --reverse                          Reverse color.
                                           
    -c COLOR, --color=COLOR                Set the output color. (default: black)
                                               - red
                                               - blue
                                               - yellow
                                               - green
                                               - magenta
                                               - cyan
                                               - white
                                           
    contents ...                           The info contents.
```

<p class="tip">
其中菜单最开头的部分选项，是xmake内置的常用选项，基本上每个任务都会用到，不需要自己额外定义，简化菜单定义。
</p>

下面，我们来实际运行下这个任务，例如我要显示红色的`hello xmake!`，只需要：

```bash
$ xmake echo -c red hello xmake!
```

也可以使用选项全名，并且加上高亮：

```bash
$ xmake echo --color=red --bright hello xmake!
```

最后面的可变参数列表，在`run`脚本中通过`option.get("contents")`获取，返回的是一个`table`类型的数组。

### task:set_category

#### 设置任务类别

仅仅用于菜单的分组显示，当然插件默认会用`plugin`，内置任务默认会用：`action`，但也仅仅只是个约定。

<p class="tip">
你可以使用任何自己定义的名字，相同名字会分组归类到一起显示，如果设置为`plugin`，就会显示到xmake的Plugins分组中去。
</p>

例如：

```lua
Plugins: 
    l, lua               Run the lua script.
    m, macro             Run the given macro.
       doxygen           Generate the doxygen document.
       project           Generate the project file.
       hello             Hello xmake!
       app2ipa           Generate .ipa file from the given .app
       echo              Echo the given info!
```

如果没有调用这个接口设置分类，默认使用`Tasks`分组显示，代表普通任务。

### task:on_run

#### 设置任务运行脚本

可以有两种设置方式，最简单的就是设置内嵌函数：

```lua
task("hello")

    on_run(function ()
        print("hello xmake!")
    end)
```

这种对于小任务很方便，也很简洁，但是对于大型任务就不太适用了，例如插件等，需要复杂的脚本支持。

这个时候就需要独立的模块文件来设置运行脚本，例如：

```lua
task("hello")
    on_run("main")
```

这里的`main`设置为脚本运行主入口模块，文件名为`main.lua`，放在定义`task`的`xmake.lua`的同目录下，当然你可以起其他文件名。

目录结构如下：

```
projectdir
    - xmake.lua
    - main.lua
```

`main.lua`里面内容如下：

```lua
function main(...)
    print("hello xmake!")
end
```

就是一个简单的带`main`主函数的脚本文件，你可以通过[import](/zh-cn/manual/builtin_modules?id=import)导入各种扩展模块，实现复杂功能，例如：

```lua
-- 导入参数选项模块
import("core.base.option")

-- 入口函数
function main(...)

    -- 获取参数内容
    print("color: %s", option.get("color"))
end
```

你也可以在当前目录下，创建多个自定义的模块文件，通过[import](/zh-cn/manual/builtin_modules?id=import)导入后使用，例如：

```
projectdir
    - xmake.lua
    - main.lua
    - module.lua
```

`module.lua`的内容如下：

```lua
-- 定义一个导出接口
function hello()
    print("hello xmake!")
end
```

<p class="tip">
私有接口，通过`_hello`带下滑线前缀命名，这样导入的模块就不会包含此接口，只在模块自身内部使用。
</p>

然后在`main.lua`进行调用：


```lua
import("module")

function main(...)
    module.hello()
end
```

更多模块介绍见：[内置模块](/zh-cn/manual/builtin_modules)和[扩展模块](/zh-cn/manual/extension_modules)

其中，`main(...)`中参数，是通过`task.run`指定的，例如：

```lua
task.run("hello", {color="red"}, arg1, arg2, arg3)
```

里面的`arg1, arg2`这些就是传入`hello`任务`main(...)`入口的参数列表，而`{color="red"}`用来指定任务菜单中的参数选项。

更加详细的`task.run`描述，见：[task.run](#task-run)

