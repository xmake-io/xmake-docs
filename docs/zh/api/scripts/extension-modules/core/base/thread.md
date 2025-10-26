# core.base.thread

提供原生线程支持，用于并发编程，包括线程创建、同步原语和线程间通信。

## thread.start

- 启动线程

#### 函数原型

::: tip API
```lua
thread.start(callback: <function>, ...)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| callback | 必需。在线程中执行的回调函数 |
| ... | 可选。传递给回调函数的额外参数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| thread | 返回一个线程对象，可用于等待线程完成 |

#### 用法说明

创建并启动一个线程执行回调函数。

::: tip 注意
每个线程都是单独的 Lua VM 实例，它们的 Lua 变量状态是完全隔离的，不能直接共享。参数传入是单向的，内部通过序列化方式传入，因此只支持 `string`、`table`、`number` 等支持序列化的参数。
:::

## thread.start_named

- 启动命名线程

#### 函数原型

::: tip API
```lua
thread.start_named(name: <string>, callback: <function>, ...)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。线程名称 |
| callback | 必需。在线程中执行的回调函数 |
| ... | 可选。传递给回调函数的额外参数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| thread | 返回一个线程对象，可用于等待线程完成 |

#### 用法说明

创建并启动一个具有指定名称和回调函数的新线程。

::: tip 注意
参数传入是单向的，内部通过序列化方式传入，因此只支持 `string`、`table`、`number` 等支持序列化的参数。
:::

示例：

```lua
import("core.base.thread")

function callback(id)
    import("core.base.thread")
    print("%s: %d starting ..", thread.running(), id)
    for i = 1, 10 do
        print("%s: %d", thread.running(), i)
        os.sleep(1000)
    end
    print("%s: %d end", thread.running(), id)
end

function main()
    local t0 = thread.start_named("thread_0", callback, 0)
    local t1 = thread.start_named("thread_1", callback, 1)
    t0:wait(-1)
    t1:wait(-1)
end
```

## thread.running

- 获取当前线程名称

#### 函数原型

::: tip API
```lua
thread.running()
```
:::

#### 参数说明

无参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回当前线程的名称字符串 |

#### 用法说明

返回当前运行线程的名称。

## thread.mutex

- 创建互斥锁对象

#### 函数原型

::: tip API
```lua
thread.mutex()
```
:::

#### 参数说明

无参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| mutex | 返回一个互斥锁对象，具有以下方法：mutex:lock() 锁定互斥锁，mutex:unlock() 解锁互斥锁 |

#### 用法说明

创建一个新的互斥锁用于线程同步。

::: tip 注意
互斥锁可以跨线程访问，用于线程间同步。
:::

示例：

```lua
import("core.base.thread")

function callback(mutex)
    import("core.base.thread")
    print("%s: starting ..", thread.running())
    for i = 1, 10 do
        mutex:lock()
        print("%s: %d", thread.running(), i)
        mutex:unlock()
        os.sleep(1000)
    end
    print("%s: end", thread.running())
end

function main()
    local mutex = thread.mutex()
    local t0 = thread.start_named("thread_0", callback, mutex)
    local t1 = thread.start_named("thread_1", callback, mutex)
    t0:wait(-1)
    t1:wait(-1)
end
```

## thread.event

- 创建事件对象

#### 函数原型

::: tip API
```lua
thread.event()
```
:::

#### 参数说明

无参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| event | 返回一个事件对象，具有以下方法：event:wait(timeout) 等待事件信号，event:post() 发送事件信号 |

#### 用法说明

创建一个新的事件用于线程信号和同步。

::: tip 注意
事件对象可以跨线程访问，用于线程间信号通信。
:::

示例：

```lua
import("core.base.thread")

function callback(event)
    import("core.base.thread")
    print("%s: starting ..", thread.running())
    while true do
        print("%s: waiting ..", thread.running())
        if event:wait(-1) > 0 then
            print("%s: triggered", thread.running())
        end
    end
end

function main()
    local event = thread.event()
    local t = thread.start_named("keyboard", callback, event)
    while true do
        local ch = io.read()
        if ch then
            event:post()
        end
    end
    t:wait(-1)
end
```

## thread.semaphore

- 创建信号量对象

#### 函数原型

::: tip API
```lua
thread.semaphore(name: <string>, initial_count: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。信号量名称 |
| initial_count | 必需。初始计数值 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| semaphore | 返回一个信号量对象，具有以下方法：semaphore:wait(timeout) 等待信号量（减少计数），semaphore:post(count) 发送信号量（增加计数） |

#### 用法说明

创建一个新的信号量用于线程同步和资源计数。

::: tip 注意
信号量可以跨线程访问，用于线程间资源计数和同步。
:::

示例：

```lua
import("core.base.thread")

function callback(semaphore)
    import("core.base.thread")
    print("%s: starting ..", thread.running())
    while true do
        print("%s: waiting ..", thread.running())
        if semaphore:wait(-1) > 0 then
            print("%s: triggered", thread.running())
        end
    end
end

function main()
    local semaphore = thread.semaphore("", 1)
    local t = thread.start_named("keyboard", callback, semaphore)
    while true do
        local ch = io.read()
        if ch then
            semaphore:post(2)
        end
    end
    t:wait(-1)
end
```

## thread.queue

- 创建线程安全队列对象

#### 函数原型

::: tip API
```lua
thread.queue()
```
:::

#### 参数说明

无参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| queue | 返回一个队列对象，具有以下方法：queue:push(value) 向队列推送值，queue:pop() 从队列弹出值，queue:empty() 检查队列是否为空 |

#### 用法说明

创建一个新的线程安全队列用于线程间数据通信。

::: tip 注意
队列是线程间数据通信的主要方式，支持跨线程访问。
:::

示例：

```lua
import("core.base.thread")

function callback(event, queue)
    print("starting ..")
    while true do
        print("waiting ..")
        if event:wait(-1) > 0 then
            while not queue:empty() do
                print("  -> %s", queue:pop())
            end
        end
    end
end

function main()
    local event = thread.event()
    local queue = thread.queue()
    local t = thread.start_named("", callback, event, queue)
    while true do
        local ch = io.read()
        if ch then
            queue:push(ch)
            event:post()
        end
    end
    t:wait(-1)
end
```

## thread.sharedata

- 创建共享数据对象

#### 函数原型

::: tip API
```lua
thread.sharedata()
```
:::

#### 参数说明

无参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| sharedata | 返回一个共享数据对象，具有以下方法：sharedata:set(value) 设置共享数据值，sharedata:get() 获取共享数据值 |

#### 用法说明

创建一个新的共享数据对象用于线程间数据共享。

::: tip 注意
共享数据对象是线程间数据共享的主要方式，支持跨线程访问。
:::

示例：

```lua
import("core.base.thread")

function callback(event, sharedata)
    print("starting ..")
    while true do
        print("waiting ..")
        if event:wait(-1) > 0 then
            print("  -> %s", sharedata:get())
        end
    end
end

function main()
    local event = thread.event()
    local sharedata = thread.sharedata()
    local t = thread.start_named("", callback, event, sharedata)
    while true do
        local ch = io.read()
        if ch then
            sharedata:set(ch)
            event:post()
        end
    end
    t:wait(-1)
end
```

## thread:wait

- 等待线程完成（线程实例方法）

#### 函数原型

::: tip API
```lua
thread:wait(timeout: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| timeout | 必需。超时时间（毫秒），-1表示无限等待 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回表示等待结果的状态码 |

#### 用法说明

等待线程完成执行。此方法支持与协程混合调度，可以在协程中等待线程完成。

示例（线程与协程混合调度）：

```lua
import("core.base.thread")
import("core.base.scheduler")

function thread_loop()
    import("core.base.thread")
    print("%s: starting ..", thread.running())
    for i = 1, 10 do
        print("%s: %d", thread.running(), i)
        os.sleep(1000)
    end
    print("%s: end", thread.running())
end

function coroutine_loop()
    print("%s: starting ..", scheduler.co_running())
    for i = 1, 10 do
        print("%s: %d", scheduler.co_running(), i)
        os.sleep(1000)
    end
    print("%s: end", scheduler.co_running())
end

function main()
    scheduler.co_start_named("coroutine", coroutine_loop)
    local t = thread.start_named("thread", thread_loop)
    t:wait(-1)  -- 在协程中等待线程完成
end
```
