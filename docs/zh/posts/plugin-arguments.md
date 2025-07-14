---
title: 插件开发之参数配置
tags: [xmake, 插件, 菜单选项]
date: 2016-06-09
author: Ruki
---


我们继续以之前讲解的hello插件为基础，现在为其增加参数配置选项，并且指定一个独立的脚本文件中进行开发，这样我们就可以写一些更复杂的插件

```lua
    -- 定义一个名叫hello的插件任务
    task("hello")

        -- 设置类型为插件
        set_category("plugin")

        -- 插件运行的入口，这里指定main，说明从当前插件目录的main.lua脚本中加载插件入口
        on_run("main")

        -- 设置插件的命令行选项，这里没有任何参数选项，仅仅显示插件描述
        set_menu({
                        -- usage
                        usage = "xmake hello [options]"

                        -- description
                    ,   description = "Hello xmake!"

                        -- 定义两个参数选项
                        -- xmake hello --output="xxx" 指定输出的内容
                        -- xmake hello -v 显示插件版本
                    ,   options = 
                        {
                            -- 第一个值设置简写：xmake hello -o xxx
                            -- 第二个值设置全称：xmake hello --output=xxx
                            -- 第三个值设置类型：kv是键值对，k是仅有key没有值(-v --version)，v是值类型没有key
                            -- 第四个值指定参数描述信息
                            {'o', "output",     "kv", nil,      "Set the output content."  }
                        ,   {'v', "version",    "k",  "1.0",    "Show the version."        }
                        }
                    }) 
```


这个插件的文件结构如下：

```
    hello
     - xmake.lua
     - main.lua
```

xmake.lua为插件的描述文件，指定一些描述信息，main.lua为插件运行入口，代码如下：

```lua
    -- 导入选项模块
    import("core.base.option")

    -- main.lua入口函数
    function main()
     
        -- 显示版本？
        if option.get("version") then
            print("version: %s", option.get("version"))
        else
            -- 显示内容
            print("hello %s!", option.get("output") or "xmake")
        end
    end
```

到此一个稍微高级些插件就完成了，我们只需要执行：

```bash
    xmake hello --version
    xmake hello -v
```

来显示版本，执行：

```bash
    xmake hello -o xxx
    xmake hello --output=xxx
```

来显示内容，或者执行：

```bash
    xmake hello -h
    xmake hello --help
```

来显示菜单，这个选项是内置的，不需要自定义

其中，我们用到了[import](https://xmake.io/zh/)这个api，这个api主要用于导入一些扩展的类库，实现一些高级的功能

并且还可以导入一些自定义的模块，例如我想在当前这个插件目录下新增一个模块 echo 用于回显信息，可以在hello目录下增加一个脚本文件：

```
    hello
     - xmake.lua
     - main.lua
     - echo.lua
```

echo.lua的内容如下：

```lua
    -- 增加一个显示信息的接口show
    function show(info)
        print(info)
    end
```

然后在main.lua里面导入这个模块就可以使用了：

```lua
    -- 导入选项模块
    import("core.project.option")

    -- 导入当前插件目录下echo模块
    import("echo")

    -- main.lua入口函数
    function main()
     
        -- 使用echo模块来显示
        if option.get("version") then
            echo.show("version: %s", option.get("version"))
        else
            -- 显示内容
            echo.show("hello %s!", option.get("output") or "xmake")
        end
    end
```

怎么样，简单吧import后，就可以直接使用这个模块的所有公有接口，像show就是被导出的公有接口

如果一些接口是私有的不想被导出怎么办呢，只需要加上 _ 前缀就行了，例如：

```lua
    -- 私有接口
    function _print(info)
        print(info)
        print(_g.info)
    end

    -- 公有接口
    function show(info)
        _print(info)
        _g.info = info
    end
```

注：其中_g是全局私有变量，用于模块内部全局私有数据的维护和传递