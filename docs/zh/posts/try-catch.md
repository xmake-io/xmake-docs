---
title: 使用lua实现try-catch异常捕获
tags: [xmake, lua, try-catch, 异常捕获]
date: 2016-12-14
author: Ruki
outline: deep
---

lua原生并没有提供try-catch的语法来捕获异常处理，但是提供了`pcall/xpcall`等接口，可在保护模式下执行lua函数。

因此，可以通过封装这两个接口，来实现try-catch块的捕获机制。

我们可以先来看下，封装后的try-catch使用方式：

```lua
try
{
    -- try 代码块
    function ()
        error("error message")
    end,

    -- catch 代码块
    catch 
    {
        -- 发生异常后，被执行
        function (errors)
            print(errors)
        end
    }
}
```

上面的代码中，在try块内部认为引发了一个异常，并且抛出错误消息，在catch中进行了捕获，并且将错误消息进行输出显示。





这里除了对`pcall/xpcall`进行了封装，用来捕获异常信息，还利用了lua的函数调用语法特性，在只有一个参数传递的情况下，lua可以直接传递一个table类型，并且省略`()`

其实try后面的整个`{...}` 都是一个table而已，作为参数传递给了try函数，其具体实现如下：

```lua
function try(block)

    -- get the try function
    local try = block[1]
    assert(try)

    -- get catch and finally functions
    local funcs = block[2]
    if funcs and block[3] then
        table.join2(funcs, block[2])
    end

    -- try to call it
    local ok, errors = pcall(try)
    if not ok then

        -- run the catch function
        if funcs and funcs.catch then
            funcs.catch(errors)
        end
    end

    -- run the finally function
    if funcs and funcs.finally then
        funcs.finally(ok, errors)
    end

    -- ok?
    if ok then
        return errors
    end
end
```

可以看到这里用了`pcall`来实际调用try块里面的函数，这样就算函数内部出现异常，也不会中断程序，`pcall`会返回false表示运行失败

并且返回实际的出错信息，如果想要自定义格式化错误信息，可以通过调用xpcall来替换pcall，这个接口与pcall相比，多了个错误处理函数：

```lua
local ok, errors = xpcall(try, debug.traceback)
```

你可以直接传入`debug.traceback`，使用默认的traceback处理接口，也可以自定义一个处理函数：

```lua
-- traceback
function my_traceback(errors)

    -- make results
    local level = 2    
    while true do    

        -- get debug info
        local info = debug.getinfo(level, "Sln")

        -- end?
        if not info or (info.name and info.name == "xpcall") then
            break
        end

        -- function?
        if info.what == "C" then
            results = results .. string.format("    [C]: in function '%s'\n", info.name)
        elseif info.name then 
            results = results .. string.format("    [%s:%d]: in function '%s'\n", info.short_src, info.currentline, info.name)    
        elseif info.what == "main" then
            results = results .. string.format("    [%s:%d]: in main chunk\n", info.short_src, info.currentline)    
            break
        else
            results = results .. string.format("    [%s:%d]:\n", info.short_src, info.currentline)    
        end

        -- next
        level = level + 1    
    end    

    -- ok?
    return results
end

-- 调用自定义traceback函数
local ok, errors = xpcall(try, my_traceback)
```

回到try-catch上来，通过上面的实现，会发现里面其实还有个finally的处理，这个的作用是对于`try{}`代码块，不管是否执行成功，都会执行到finally块中

也就说，其实上面的实现，完整的支持语法是：`try-catch-finally`模式，其中catch和finally都是可选的，根据自己的实际需求提供

例如：

```lua
try
{
    -- try 代码块
    function ()
        error("error message")
    end,

    -- catch 代码块
    catch 
    {
        -- 发生异常后，被执行
        function (errors)
            print(errors)
        end
    },

    -- finally 代码块
    finally 
    {
        -- 最后都会执行到这里
        function (ok, errors)
            -- 如果try{}中存在异常，ok为true，errors为错误信息，否则为false，errors为try中的返回值
        end
    }
}

```

或者只有finally块：

```lua
try
{
    -- try 代码块
    function ()
        return "info"
    end,

    -- finally 代码块
    finally 
    {
        -- 由于此try代码没发生异常，因此ok为true，errors为返回值: "info"
        function (ok, errors)
        end
    }
}
```

处理可以在finally中获取try里面的正常返回值，其实在仅有try的情况下，也是可以获取返回值的：

```lua
-- 如果没发生异常，result 为返回值："xxxx"，否则为nil
local result = try
{
    function ()
        return "xxxx"
    end
}
```

可以看到，这个基于pcall的`try-catch-finally`异常捕获封装，使用上还是非常灵活的，而且其实现相当的简单

这也充分说明了lua是一门已非常强大灵活，又非常精简的语言。

在[xmake](http://www.xmake.io/cn)的自定义脚本、插件开发中，也是完全基于此异常捕获机制

这样使得扩展脚本的开发非常的精简可读，省去了繁琐的`if err ~= nil then`返回值判断，在发生错误时，xmake会直接抛出异常进行中断，然后高亮提示详细的错误信息。

例如：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")

    -- 在编译完ios程序后，对目标程序进行ldid签名
    after_build(function (target))
        os.run("ldid -S %s", target:targetfile())
    end
```

只需要一行`os.run`就行了，也不需要返回值判断是否运行成功，因为运行失败后，xmake会自动抛异常，中断程序并且提示错误

如果你想在运行失败后，不直接中断xmake，继续往下运行，可以自己加个try快就行了：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")

    after_build(function (target))
        try
        {
            function ()
                os.run("ldid -S %s", target:targetfile())
            end
        }
    end
```

如果还想捕获出错信息，可以再加个catch:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")

    after_build(function (target))
        try
        {
            function ()
                os.run("ldid -S %s", target:targetfile())
            end,
            catch 
            {
                function (errors)
                    print(errors)
                end
            }
        }
    end
```

不过一般情况下，在xmake中写自定义脚本，是不需要手动加try-catch的，直接调用各种api，出错后让xmake默认的处理程序接管，直接中断就行了。。

最后附上`try-catch-finally`实现的相关完整源码：

* [try](https://github.com/waruqi/xmake/blob/master/xmake/core/sandbox/modules/try.lua)
* [catch](https://github.com/waruqi/xmake/blob/master/xmake/core/sandbox/modules/catch.lua)
* [finally](https://github.com/waruqi/xmake/blob/master/xmake/core/sandbox/modules/finally.lua)