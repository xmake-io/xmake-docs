---
title: xmake插件开发之类库使用
tags: [xmake, 插件, 类库]
date: 2016-07-07
author: Ruki
---

xmake通过import接口，可以在自定义脚本中导入各种内置类库和扩展类库模块，使得xmake的插件开发具有更多的灵活性，提供更丰富的功能。

我们先看下，目前xmake提供的一些类库：



```
    .
    ├── _g.lua
    ├── assert.lua
    ├── catch.lua
    ├── coroutine.lua
    ├── debug.lua
    ├── finally.lua
    ├── format.lua
    ├── ifelse.lua
    ├── import
    │   └── core
    │       ├── base
    │       │   └── option.lua
    │       ├── platform
    │       │   ├── environment.lua
    │       │   ├── menu.lua
    │       │   └── platform.lua
    │       ├── project
    │       │   ├── cache.lua
    │       │   ├── config.lua
    │       │   ├── global.lua
    │       │   ├── history.lua
    │       │   ├── menu.lua
    │       │   ├── package.lua
    │       │   ├── project.lua
    │       │   ├── target.lua
    │       │   ├── task.lua
    │       │   └── template.lua
    │       └── tool
    │           ├── compiler.lua
    │           ├── linker.lua
    │           └── tool.lua
    ├── import.lua
    ├── inherit.lua
    ├── insert.lua
    ├── io.lua
    ├── ipairs.lua
    ├── math.lua
    ├── os.lua
    ├── pairs.lua
    ├── path.lua
    ├── print.lua
    ├── printf.lua
    ├── raise.lua
    ├── string.lua
    ├── table.lua
    ├── tonumber.lua
    ├── tostring.lua
    ├── try.lua
    ├── utils.lua
    └── vformat.lua
```

在根目录下的模块和api都是属于内建的，不需要import也可以直接使用，属于常用api，提供了xmake最基础的特性。。

在子目录下的是扩展模块，需要import后才能使用，导入规则见[import](/cn/2016/06/09/api-import/)，例如：

```lua
    import("core.project.task")
```

需要注意的是：xmake对自定义的脚本采用了异常处理机制，大部分情况下，调用的api是不需要判断返回值状态是否成功，如果出错了，会立即中断，并且显示错误信息

这样语法上更加的精简可读，并且更安全，所有api的输入输出，内部都有检测，状态不对会立即自动报错。

当然如果我们想要自己获取这个异常的状态，做一些逻辑上的处理，可以通过try/catch来实现，使用起来也非常简单。

下面简单介绍下一些常用的内置模块api，这些模块不需要import就可以使用的哦。：）

#### os模块

```lua
    -- 运行shell命令，如果运行失败直接中断，并显示出错信息，我们不需要判断返回值
    os.run("echo hello xmake!")

    -- 复制文件
    os.cp("/tmp/src", "/tmp/dst")

    -- 删除文件或者目录
    os.rm("/tmp/dir")

    -- 移动文件
    os.mv("/tmp/old", "/tmp/new")

    -- 判断文件是否存在
    if os.isfile("/tmp/file") then
    end

    -- 判断目录是否存在
    if os.isdir("/tmp/dir") then
    end

    -- 匹配遍历文件，*为非递归匹配，**为递归匹配
    for _, file in ipairs(os.match("src/*.c")) do
        print(file)
    end

    -- 匹配遍历目录，*为非递归匹配，**为递归匹配
    for _, file in ipairs(os.match("src/*", true)) do
        print(file)
    end
```

#### 常用api


```lua
    -- 抛出异常，立即中断
    raise()

    -- 抛出异常，立即中断，并抛出异常错误信息
    raise("error info")

    -- 抛出异常，立即中断，并抛出异常错误代码
    raise(-1)

    -- 显示输出并换行，支持格式化输出，跟lua的print稍有不同
    print("hello %s", "xmake")

    -- 显示输出不换行
    printf("hello %s", "xmake")

    -- 格式化字符串
    s = format("hello %s", "xmake")
```

#### 异常捕获api

```lua
    try
    {
        -- try块，里面抛出异常
        function ()
            raise("error")
        end,

        catch
        {
            -- catch块，捕获异常
            function (errors)
                print(errors)
            end
        }
    }

    -- 获取try块的返回值，如果没有异常的话返回true
    local ok = try
    {
        -- try块，里面抛出异常
        function ()
            -- may be error
            return true
        end
    }

    try
    {
        -- try块，里面抛出异常
        function ()
            raise("error")
        end,

        catch
        {
            -- catch块，捕获异常
            function (errors)
                print(errors)
            end
        },

        finally
        { 
            -- finally 块
            function ()
            end
        }
    }
```

#### path模块

```lua
    -- 获取相对路径
    path.relative("/tmp/a")

    -- 获取绝对路径
    path.absolute("src")

    -- 获取目录
    path.directory("/tmp/a")

    -- 获取文件名 test.c
    path.filename("/tmp/test.c")

    -- 获取base名 test
    path.basename("/tmp/test.c")

    -- 获取扩展名
    path.extension("/tmp/test.c")

    -- 拼接路径 /tmp/test.c
    path.join("/tmp", "test.c")
```

#### io 模块

```lua
    -- 打开一个写文件
    file = io.open("/tmp/a", "w")

    -- 写文件数据
    file:write("hello")

    -- 写文件格式化行
    file:print("hello %s", "xmake")

    -- 写文件格式化不换行
    file:printf("hello %s", "xmake")

    -- 关闭文件
    file:close()

    -- 序列化写一个lua对象到文件
    io.save("/tmp/a", object)

    -- 反序列化读取一个文件对象
    object = io.load("/tmp/a")

    -- 读取文件数据，并显示
    io.cat("/tmp/a")

    -- 模式替换文件内容, 替换空格字符为 "space"
    io.gsub("/tmp/a", "%s", "space")
```

还有一些是lua的常用模块，这里就不多说了，例如：`string, table, debug, coroutine, pairs, ipairs, tostring, tonumber` 等等

