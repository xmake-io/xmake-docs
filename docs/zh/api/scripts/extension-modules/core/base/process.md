
# process

process 模块提供了子进程管理功能，用于创建、控制和与外部进程通信。这是 `os.exec` 和 `os.execv` 函数的底层模块。这是 xmake 的扩展模块。

::: tip 提示
使用此模块需要先导入：`import("core.base.process")`
:::

## process.open

- 使用命令字符串打开子进程

#### 函数原型

::: tip API
```lua
process.open(command: <string>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| command | 必需。要执行的命令字符串 |
| opt | 可选。进程选项表 |

#### 用法说明

通过执行命令字符串创建新的子进程。返回一个子进程对象，可用于控制和与进程通信。

`opt` 中的选项：
- `stdin` - 输入源（文件路径、文件对象或管道对象）
- `stdout` - 输出目标（文件路径、文件对象或管道对象）
- `stderr` - 错误输出目标（文件路径、文件对象或管道对象）
- `envs` - 环境变量数组（例如：`{"PATH=xxx", "XXX=yyy"}`）

```lua
-- 基本进程执行
local proc = process.open("echo hello world")
local ok, status = proc:wait()
proc:close()

-- 带文件重定向的进程
local stdout = os.tmpfile()
local stderr = os.tmpfile()
local proc = process.open("xmake lua print 'hello'", {
    stdout = stdout,
    stderr = stderr
})
proc:wait()
proc:close()

-- 从文件读取输出
local output = io.readfile(stdout):trim()
print(output)  -- 输出: hello
```

带环境变量的进程：

```lua
local proc = process.open("echo $MY_VAR", {
    envs = {"MY_VAR=hello from xmake"}
})
proc:wait()
proc:close()
```

## process.openv

- 使用程序和参数列表打开子进程

#### 函数原型

::: tip API
```lua
process.openv(program: <string>, argv: <table>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| program | 必需。要执行的程序 |
| argv | 必需。传递给程序的参数数组 |
| opt | 可选。进程选项表（与 `process.open` 相同） |

#### 用法说明

通过执行程序和参数列表创建新的子进程。这比 `process.open` 更安全，因为它避免了 shell 解释问题。

```lua
-- 使用参数执行程序
local proc = process.openv("xmake", {"lua", "print", "hello world"})
local ok, status = proc:wait()
proc:close()

-- 带文件重定向执行
local stdout = os.tmpfile()
local proc = process.openv("xmake", {"lua", "print", "xmake"}, {
    stdout = stdout,
    stderr = stderr
})
proc:wait()
proc:close()

-- 读取输出
local output = io.readfile(stdout):trim()
print(output)  -- 输出: xmake
```

带环境变量执行：

```lua
local proc = process.openv("env", {"MY_VAR=test"}, {
    envs = {"MY_VAR=hello from xmake"}
})
proc:wait()
proc:close()
```

## process:wait

- 等待子进程完成

#### 函数原型

::: tip API
```lua
process:wait(timeout: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| timeout | 可选。超时时间（毫秒）。使用 -1 表示无限等待，0 表示非阻塞 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| ok | 退出代码（0 表示成功，负数表示错误） |
| status | 进程状态或错误消息 |

#### 用法说明

等待子进程完成并返回退出状态。可以带或不带超时使用。

```lua
local proc = process.open("echo hello")
local ok, status = proc:wait()
print("退出代码:", ok)  -- 输出: 0 (成功)
print("状态:", status)  -- 输出: nil 或错误消息
proc:close()
```

带超时等待：

```lua
local proc = process.open("sleep 10")
local ok, status = proc:wait(1000)  -- 最多等待 1 秒
if ok < 0 then
    print("进程超时或失败:", status)
end
proc:close()
```

非阻塞等待：

```lua
local proc = process.open("echo hello")
local ok, status = proc:wait(0)  -- 非阻塞
if ok < 0 then
    print("进程尚未就绪")
else
    print("进程完成，代码:", ok)
end
proc:close()
```

## process:kill

- 终止子进程

#### 函数原型

::: tip API
```lua
process:kill()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

立即终止子进程。成功返回 true，失败返回 false 和错误消息。

```lua
local proc = process.open("sleep 60")
-- ... 做一些事情 ...

-- 终止进程
local success, error = proc:kill()
if success then
    print("进程终止成功")
else
    print("终止进程失败:", error)
end
proc:close()
```

终止长时间运行的进程：

```lua
local proc = process.open("xmake l os.sleep 60000")
print("进程已启动:", proc)

-- 2 秒后终止
os.sleep(2000)
local success = proc:kill()
print("终止结果:", success)
proc:close()
```

## process:close

- 关闭子进程

#### 函数原型

::: tip API
```lua
process:close()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

关闭子进程并释放相关资源。完成进程操作后应调用此方法。

```lua
local proc = process.open("echo hello")
proc:wait()
local success = proc:close()
print("关闭结果:", success)
```

始终关闭进程：

```lua
local proc = process.open("some command")
local ok, status = proc:wait()
-- 即使进程失败也要关闭
proc:close()
```

## process:name

- 获取进程名称

#### 函数原型

::: tip API
```lua
process:name()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回进程的名称（不带路径的文件名）。

```lua
local proc = process.open("xmake lua print 'hello'")
print("进程名称:", proc:name())  -- 输出: xmake
proc:close()
```

## process:program

- 获取进程程序路径

#### 函数原型

::: tip API
```lua
process:program()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回用于启动进程的完整程序路径。

```lua
local proc = process.openv("xmake", {"lua", "print", "hello"})
print("程序:", proc:program())  -- 输出: xmake
proc:close()
```

## process:cdata

- 获取进程 cdata

#### 函数原型

::: tip API
```lua
process:cdata()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回进程的底层 cdata 对象。由调度器和其他低级操作内部使用。

```lua
local proc = process.open("echo hello")
local cdata = proc:cdata()
print("CData 类型:", type(cdata))
proc:close()
```

## process:otype

- 获取对象类型

#### 函数原型

::: tip API
```lua
process:otype()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回对象类型标识符。对于子进程对象，返回 3（poller.OT_PROC）。

```lua
local proc = process.open("echo hello")
print("对象类型:", proc:otype())  -- 输出: 3
proc:close()
```

::: tip 提示
process 模块是 `os.exec` 和 `os.execv` 函数的底层实现。它提供了更多的控制和灵活性用于进程管理，包括超时处理、管道集成和调度器支持。使用 `process.open` 进行简单的命令执行，使用 `process.openv` 进行更安全的参数处理。
:::
