# signal

2.9.1 新增了信号注册接口，我们可以在 lua 层，注册 SIGINT 等信号处理函数，来定制化响应逻辑。

## signal.register

- 注册信号处理器

#### 函数原型

```lua
signal.register(signo: <number>, handler: <function>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| signo | 信号编号（例如：signal.SIGINT） |
| handler | 信号处理函数 |

#### 用法说明

目前仅仅支持 SIGINT 信号的处理，同时它也是支持 windows 等主流平台的。

```lua
import("core.base.signal")

function main()
    signal.register(signal.SIGINT, function (signo)
        print("signal.SIGINT(%d)", signo)
    end)
    io.read()
end
```

这对于当一些子进程内部屏蔽了 SIGINT，导致卡死不退出，即使用户按了 `Ctrl+C` 退出了 xmake 进程，它也没有退出时候，
我们就可以通过这种方式去强制退掉它。

```lua
import("core.base.process")
import("core.base.signal")

function main()
    local proc
    signal.register(signal.SIGINT, function (signo)
        print("sigint")
        if proc then
            proc:kill()
        end
    end)
    proc = process.open("./trap.sh")
    if proc then
        proc:wait()
        proc:close()
    end
end
```

关于这个问题的背景，可以参考：[#4889](https://github.com/xmake-io/xmake/issues/4889)

## signal.ignore

- 忽略某个信号

#### 函数原型

```lua
signal.ignore(signo: <number>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| signo | 信号编号（例如：signal.SIGINT） |

#### 用法说明

我们也可以通过 `signal.ignore` 这个接口，去忽略屏蔽某个信号的处理。

```lua
signal.ignore(signal.SIGINT)
```

## signal.reset

- 重置某个信号

#### 函数原型

```lua
signal.reset(signo: <number>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| signo | 信号编号（例如：signal.SIGINT） |

#### 用法说明

我们也可以清除某个信号的处理函数，回退到默认的处理逻辑。

```lua
signal.reset(signal.SIGINT)
```
