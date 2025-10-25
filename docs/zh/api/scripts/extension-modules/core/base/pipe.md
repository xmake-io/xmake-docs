
# pipe

pipe 模块提供了管道通信功能，支持匿名管道和命名管道，可用于进程间通信。这是 xmake 的扩展模块。

::: tip 提示
使用此模块需要先导入：`import("core.base.pipe")`
:::

## pipe.openpair

- 创建匿名管道对

#### 函数原型

::: tip API
```lua
pipe.openpair(mode: <string>, buffsize: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| mode | 可选。管道模式，默认为 "AA" |
| buffsize | 可选。缓冲区大小，默认为 0（系统默认） |

#### 用法说明

创建一对匿名管道，返回读端和写端两个管道对象。

匿名管道主要用于有亲缘关系的进程间通信（如父子进程），常见场景是重定向子进程的输入输出。

管道模式说明：
- `"BB"`：读写都是阻塞模式
- `"BA"`：读阻塞，写非阻塞
- `"AB"`：读非阻塞，写阻塞
- `"AA"`：读写都是非阻塞模式（默认）

基本使用示例：

```lua
import("core.base.pipe")
import("core.base.bytes")

-- 创建管道对
local rpipe, wpipe = pipe.openpair()
local buff = bytes(8192)

-- 写入数据
wpipe:write("hello xmake!", {block = true})

-- 读取数据
local read, data = rpipe:read(buff, 13)
if read > 0 and data then
    print(data:str())  -- 输出: hello xmake!
end

rpipe:close()
wpipe:close()
```

配合 `os.execv` 重定向子进程输出：

```lua
import("core.base.pipe")
import("core.base.bytes")

-- 创建管道对
local rpipe, wpipe = pipe.openpair()

-- 将子进程的 stdout 重定向到管道写端
os.execv("echo", {"hello from subprocess"}, {stdout = wpipe})

-- 关闭写端，读取子进程输出
wpipe:close()
local buff = bytes(8192)
local read, data = rpipe:read(buff, 8192)
if read > 0 then
    print("子进程输出:", data:str())
end
rpipe:close()
```

## pipe.open

- 打开命名管道

#### 函数原型

::: tip API
```lua
pipe.open(name: <string>, mode: <string>, buffsize: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 管道名称 |
| mode | 打开模式 |
| buffsize | 可选。缓冲区大小，默认为 0 |

#### 用法说明

打开或创建命名管道。

命名管道可以在完全独立的进程间通信，无需亲缘关系。类似于本地 socket，但更轻量。适合需要在不同应用程序间传递数据的场景。

打开模式说明：
- `"r"` 或 `"rA"`：只读，非阻塞（客户端）
- `"w"` 或 `"wA"`：只写，非阻塞（服务端）
- `"rB"`：只读，阻塞
- `"wB"`：只写，阻塞

### 服务端示例

```lua
import("core.base.pipe")

-- 打开命名管道（服务端）
local pipefile = pipe.open("test", 'w')

local count = 0
while count < 10000 do
    local write = pipefile:write("hello world..", {block = true})
    if write <= 0 then
        break
    end
    count = count + 1
end
print("写入成功, count:", count)
pipefile:close()
```

### 客户端示例

```lua
import("core.base.pipe")
import("core.base.bytes")

-- 打开命名管道（客户端）
local pipefile = pipe.open("test", 'r')
local buff = bytes(8192)

-- 连接到服务端
if pipefile:connect() > 0 then
    print("已连接")
    local count = 0
    while count < 10000 do
        local read, data = pipefile:read(buff, 13, {block = true})
        if read > 0 then
            count = count + 1
        else
            break
        end
    end
    print("读取成功, count:", count)
end
pipefile:close()
```

## pipe:read

- 从管道读取数据

#### 函数原型

::: tip API
```lua
pipe:read(buff: <bytes>, size: <number>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| buff | bytes 缓冲区对象，用于存储读取的数据 |
| size | 要读取的字节数 |
| opt | 可选。选项参数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| read | 实际读取的字节数 |
| data | 读取的数据（bytes 对象） |

#### 用法说明

从管道读取数据到指定的缓冲区。

选项参数说明：
- `block`：是否阻塞读取，默认 false
- `start`：缓冲区起始位置，默认 1
- `timeout`：超时时间（毫秒），默认 -1（无限等待）

非阻塞模式（默认）会立即返回，可能返回 0 表示暂无数据。阻塞模式会等待直到读取到指定大小的数据或发生错误：

```lua
import("core.base.bytes")

local buff = bytes(8192)
-- 阻塞读取 100 字节，超时 5 秒
local read, data = rpipe:read(buff, 100, {block = true, timeout = 5000})
if read > 0 then
    print("读取:", data:str())
end
```

## pipe:write

- 向管道写入数据

#### 函数原型

::: tip API
```lua
pipe:write(data: <string|bytes>, opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| data | 要写入的数据，可以是字符串或 bytes 对象 |
| opt | 可选。选项参数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| write | 实际写入的字节数 |

#### 用法说明

向管道写入数据。

选项参数说明：
- `block`：是否阻塞写入，默认 false
- `start`：数据起始位置，默认 1
- `last`：数据结束位置，默认为数据大小
- `timeout`：超时时间（毫秒），默认 -1

非阻塞模式（默认）可能只写入部分数据。阻塞模式会等待直到所有数据都写入成功：

```lua
-- 阻塞写入数据
local write = wpipe:write("hello world", {block = true})
if write > 0 then
    print("写入了", write, "字节")
end
```

## pipe:connect

- 连接命名管道（服务端）

#### 函数原型

::: tip API
```lua
pipe:connect(opt: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| opt | 可选。选项参数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 成功返回正数 |

#### 用法说明

连接命名管道，仅用于命名管道的服务端。在服务端创建命名管道后，需要调用此方法等待客户端连接。

选项参数说明：
- `timeout`：超时时间（毫秒），默认 -1

```lua
import("core.base.pipe")

local pipefile = pipe.open("test", 'r')
if pipefile:connect() > 0 then
    print("客户端已连接")
    -- 可以开始读写数据
end
```

## pipe:wait

- 等待管道事件

#### 函数原型

::: tip API
```lua
pipe:wait(events: <number>, timeout: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| events | 要等待的事件，支持事件常量 |
| timeout | 超时时间（毫秒），-1 表示无限等待 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回实际发生的事件常量值 |

#### 用法说明

等待指定的管道事件发生。在非阻塞模式下，可以使用此方法实现事件驱动的 I/O。

参数：
- `events`：要等待的事件，支持以下事件常量：
  - `pipe.EV_READ` (1)：可读事件，表示管道有数据可读
  - `pipe.EV_WRITE` (2)：可写事件，表示管道可以写入数据
  - `pipe.EV_CONN` (2)：连接事件，用于命名管道等待客户端连接
- `timeout`：超时时间（毫秒），-1 表示无限等待

在非阻塞模式下，可以使用 wait 实现高效的事件循环：

```lua
-- 等待管道可读，超时 1 秒
local events = rpipe:wait(pipe.EV_READ, 1000)
if events == pipe.EV_READ then
    -- 管道可读，可以读取数据
    local read, data = rpipe:read(buff, 100)
end

-- 等待管道可写
local events = wpipe:wait(pipe.EV_WRITE, 1000)
if events == pipe.EV_WRITE then
    -- 管道可写，可以写入数据
    wpipe:write("data")
end
```

## pipe:close

- 关闭管道

#### 函数原型

::: tip API
```lua
pipe:close()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

关闭管道并释放资源。使用完管道后应该及时关闭。

## pipe:name

- 获取管道名称

#### 函数原型

::: tip API
```lua
pipe:name()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

获取命名管道的名称。对于匿名管道，返回 nil。

::: tip 提示
管道是单向的，一端只能读，另一端只能写。需要双向通信时，需要创建两个管道。
:::

::: warning 注意
使用完管道后记得调用 `close()` 释放资源。读取数据时需要预先使用 `bytes()` 创建缓冲区。
:::

