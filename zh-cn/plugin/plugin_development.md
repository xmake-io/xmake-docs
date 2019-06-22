
## 简介

XMake完全支持插件模式，我们可以很方便的扩展实现自己的插件，并且xmake也提供了一些内建的使用插件。

我们可以执行下 `xmake -h` 看下当前支持的插件：

```
Plugins: 
    l, lua                                 Run the lua script.
    m, macro                               Run the given macro.
       doxygen                             Generate the doxygen document.
       hello                               Hello xmake!
       project                             Create the project file.
```

* lua: 运行lua脚本的插件
* macro: 这个很实用，宏脚本插件，可以手动录制多条xmake命令并且回放，也可以通过脚本实现一些复杂的宏脚本，这个我们后续会更加详细的介绍
* doxygen：一键生成doxygen文档的插件
* hello: 插件demo，仅仅显示一句话：'hello xmake!'
* project： 生成工程文件的插件，目前仅支持(makefile)，后续还会支持(vs,xcode等工程)的生成

## 快速开始

接下来我们介绍下本文的重点，一个简单的hello xmake插件的开发，代码如下：

```lua
-- 定义一个名叫hello的插件任务
task("hello")

    -- 设置类型为插件
    set_category("plugin")

    -- 插件运行的入口
    on_run(function ()

        -- 显示hello xmake!
        print("hello xmake!")

    end)

    -- 设置插件的命令行选项，这里没有任何参数选项，仅仅显示插件描述
    set_menu {
                -- usage
                usage = "xmake hello [options]"

                -- description
            ,   description = "Hello xmake!"

                -- options
            ,   options = {}
            } 
```

这个插件的文件结构如下：

```
hello
 - xmake.lua

``` 

现在一个最简单的插件写完了，那怎么让它被xmake检测到呢，有三种方式：

1. 把 hello 这个文件夹放置在 xmake的插件安装目录 `xmake/plugins`，这个里面都是些内建的插件
2. 把 hello 文件夹放置在 `~/.xmake/plugins` 用户全局目录，这样对当前xmake 全局生效
3. 把 hello 文件夹放置在任意地方，通过在工程描述文件xmake.lua中调用`add_plugindirs("./hello")` 添加当前的工程的插件搜索目录，这样只对当前工程生效

## 运行插件

接下来，我们尝试运行下这个插件：

```console
xmake hello
```

显示结果：

```
hello xmake!
```

最后我们还可以在target自定义的脚本中运行这个插件：

```lua
target("demo")
    
    -- 构建之后运行插件
    after_build(function (target)
  
        -- 导入task模块
        import("core.project.task")

        -- 运行插件任务
        task.run("hello")
    end)
```

