
# try-catch-finally

- 异常捕获

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

而finally的处理，这个的作用是对于`try{}`代码块，不管是否执行成功，都会执行到finally块中

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

在xmake的自定义脚本、插件开发中，也是完全基于此异常捕获机制

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
