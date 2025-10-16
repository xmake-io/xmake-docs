# scheduler

scheduler 模块提供了协程调度功能，用于管理协程的创建、执行、同步和通信。这是 xmake 的扩展模块。

::: tip 提示
使用此模块需要先导入：`import("core.base.scheduler")`
:::

## scheduler.co_start

- 启动新的协程任务

```lua
import("core.base.scheduler")

local co = scheduler.co_start(function()
    print("Hello from coroutine!")
end)
```

启动一个新的协程并执行指定的任务函数。协程会立即开始执行，除非调度器尚未启动。

参数：
- `cotask` - 必需。要执行的协程任务函数
- `...` - 可选。传递给任务函数的参数

返回值：
- 成功时返回协程对象，失败时返回 nil 和错误信息

```lua
-- 启动带参数的协程
local co = scheduler.co_start(function(name, id)
    print("Task", name, "with id", id, "started")
end, "worker", 123)

-- 协程组示例
local count = 0
scheduler.co_group_begin("test", function()
    for i = 1, 100 do
        scheduler.co_start(function()
            count = count + 1
        end)
    end
end)
scheduler.co_group_wait("test")
print("Completed", count, "tasks")
```

## scheduler.co_start_named

- 启动指定名称的协程任务

```lua
import("core.base.scheduler")

local co = scheduler.co_start_named("worker", function()
    print("Named coroutine started")
end)
```

启动一个带有指定名称的协程任务，便于调试和监控。

参数：
- `coname` - 必需。协程名称
- `cotask` - 必需。要执行的协程任务函数
- `...` - 可选。传递给任务函数的参数

```lua
-- 启动多个命名协程
for i = 1, 5 do
    scheduler.co_start_named("worker-" .. i, function()
        print("Worker", i, "started")
        scheduler.co_sleep(1000)
        print("Worker", i, "finished")
    end)
end
```

## scheduler.co_start_withopt

- 使用选项启动协程任务

```lua
import("core.base.scheduler")

local co = scheduler.co_start_withopt({
    name = "isolated-worker",
    isolate = true
}, function()
    print("Isolated coroutine started")
end)
```

启动一个带有特定选项的协程任务。

参数：
- `opt` - 必需。协程选项表
- `cotask` - 必需。要执行的协程任务函数
- `...` - 可选。传递给任务函数的参数

`opt` 选项：
- `name` - 协程名称
- `isolate` - 是否隔离协程环境（默认 false）

```lua
-- 启动隔离环境的协程
local co = scheduler.co_start_withopt({
    name = "isolated-task",
    isolate = true
}, function()
    -- 这个协程有独立的环境变量
    os.setenv("CUSTOM_VAR", "isolated_value")
    print("Isolated task running")
end)
```

## scheduler.co_suspend

- 挂起当前协程

```lua
import("core.base.scheduler")

function task()
    print("Task started")
    scheduler.co_suspend()  -- 挂起协程
    print("Task resumed")
end
```

挂起当前正在执行的协程，让出执行权给其他协程。

返回值：
- 返回传递给 `co_resume` 的参数

```lua
local co = scheduler.co_start(function()
    print("Step 1")
    scheduler.co_suspend()
    print("Step 2")
end)

-- 协程会在 co_suspend() 处挂起
-- 可以通过 co_resume 恢复执行
```

## scheduler.co_resume

- 恢复挂起的协程

```lua
import("core.base.scheduler")

local co = scheduler.co_start(function()
    local value = scheduler.co_suspend()
    print("Resumed with value:", value)
end)

-- 恢复协程并传递参数
scheduler.co_resume(co, "hello")
```

恢复指定的挂起协程，可以传递参数给协程。

参数：
- `co` - 必需。要恢复的协程对象
- `...` - 可选。传递给协程的参数

```lua
-- 协程间通信示例
local co = scheduler.co_start(function()
    local data = scheduler.co_suspend()
    print("Received data:", data)
    local result = "processed: " .. data
    scheduler.co_suspend(result)
end)

-- 发送数据并获取结果
scheduler.co_resume(co, "input data")
local result = scheduler.co_resume(co)
print("Got result:", result)
```

## scheduler.co_yield

- 让出当前协程的执行权

```lua
import("core.base.scheduler")

function task()
    for i = 1, 5 do
        print("Task step", i)
        scheduler.co_yield()  -- 让出执行权
    end
end
```

让出当前协程的执行权，允许其他协程运行。这是一个协作式多任务的关键函数。

```lua
-- 协作式任务示例
scheduler.co_group_begin("cooperative", function()
    for i = 1, 3 do
        scheduler.co_start(function(id)
            for j = 1, 3 do
                print("Task", id, "step", j)
                scheduler.co_yield()
            end
        end, i)
    end
end)
scheduler.co_group_wait("cooperative")
```

## scheduler.co_sleep

- 协程睡眠指定时间

```lua
import("core.base.scheduler")

function delayed_task()
    print("Task started")
    scheduler.co_sleep(1000)  -- 睡眠 1 秒
    print("Task resumed after sleep")
end
```

让当前协程睡眠指定的毫秒数，期间其他协程可以继续执行。

参数：
- `ms` - 必需。睡眠时间（毫秒），0 表示不睡眠

```lua
-- 定时任务示例
for i = 1, 5 do
    scheduler.co_start(function(id)
        print("Task", id, "starting")
        scheduler.co_sleep(id * 500)  -- 递增延迟
        print("Task", id, "finished")
    end, i)
end
```

## scheduler.co_lock

- 锁定指定的锁

```lua
import("core.base.scheduler")

function critical_section()
    scheduler.co_lock("shared_resource")
    print("Entering critical section")
    -- 临界区代码
    scheduler.co_unlock("shared_resource")
    print("Leaving critical section")
end
```

获取指定名称的锁，如果锁已被其他协程持有，当前协程会等待直到锁可用。

参数：
- `lockname` - 必需。锁的名称

```lua
-- 互斥锁示例
local shared_counter = 0

for i = 1, 10 do
    scheduler.co_start(function(id)
        scheduler.co_lock("counter")
        local old_value = shared_counter
        scheduler.co_sleep(100)  -- 模拟工作
        shared_counter = old_value + 1
        print("Task", id, "incremented counter to", shared_counter)
        scheduler.co_unlock("counter")
    end, i)
end
```

## scheduler.co_unlock

- 释放指定的锁

```lua
import("core.base.scheduler")

function critical_section()
    scheduler.co_lock("my_lock")
    -- 临界区代码
    scheduler.co_unlock("my_lock")
end
```

释放指定名称的锁，允许其他等待的协程获取锁。

参数：
- `lockname` - 必需。要释放的锁名称

## scheduler.co_group_begin

- 开始协程组

```lua
import("core.base.scheduler")

scheduler.co_group_begin("workers", function(group)
    -- 在这个作用域内启动的协程会加入该组
    for i = 1, 5 do
        scheduler.co_start(function()
            print("Worker", i, "started")
        end)
    end
end)
```

开始一个新的协程组，在指定函数内启动的所有协程都会加入该组。

参数：
- `name` - 必需。协程组名称
- `scopefunc` - 必需. 作用域函数

```lua
-- 批量任务处理示例
scheduler.co_group_begin("batch_jobs", function()
    local jobs = {"job1", "job2", "job3", "job4", "job5"}
    for i, job in ipairs(jobs) do
        scheduler.co_start(function(job_name)
            print("Processing", job_name)
            scheduler.co_sleep(math.random(100, 500))
            print("Completed", job_name)
        end, job)
    end
end)
```

## scheduler.co_group_wait

- 等待协程组完成

```lua
import("core.base.scheduler")

scheduler.co_group_begin("test", function()
    for i = 1, 10 do
        scheduler.co_start(function()
            print("Task", i, "completed")
        end)
    end
end)

-- 等待所有协程完成
scheduler.co_group_wait("test")
print("All tasks completed")
```

等待指定协程组中的所有协程完成执行。

参数：
- `name` - 必需。协程组名称
- `opt` - 可选。等待选项

`opt` 选项：
- `limit` - 等待完成的最大协程数量（默认等待所有协程）

```lua
-- 限制等待数量的示例
scheduler.co_group_begin("limited", function()
    for i = 1, 10 do
        scheduler.co_start(function(id)
            print("Task", id, "running")
            scheduler.co_sleep(id * 100)
            print("Task", id, "finished")
        end, i)
    end
end)

-- 只等待前 3 个协程完成
scheduler.co_group_wait("limited", {limit = 3})
print("First 3 tasks completed")
```

## scheduler.co_running

- 获取当前运行的协程

```lua
import("core.base.scheduler")

function task()
    local co = scheduler.co_running()
    if co then
        print("Current coroutine name:", co:name())
        print("Current coroutine status:", co:status())
    end
end
```

获取当前正在运行的协程对象。

返回值：
- 当前协程对象，如果没有运行中的协程则返回 nil

```lua
-- 协程信息获取示例
scheduler.co_start_named("info_task", function()
    local co = scheduler.co_running()
    print("Coroutine name:", co:name())
    print("Coroutine status:", co:status())
    print("Is dead:", co:is_dead())
    print("Is running:", co:is_running())
    print("Is suspended:", co:is_suspended())
end)
```

## scheduler.co_count

- 获取协程总数

```lua
import("core.base.scheduler")

print("Total coroutines:", scheduler.co_count())
```

获取当前调度器中活跃协程的总数。

返回值：
- 协程数量

```lua
-- 协程计数示例
print("Initial count:", scheduler.co_count())

for i = 1, 5 do
    scheduler.co_start(function()
        print("Task", i, "started, count:", scheduler.co_count())
        scheduler.co_sleep(1000)
        print("Task", i, "finished, count:", scheduler.co_count())
    end)
end

print("After starting tasks:", scheduler.co_count())
```

## scheduler.co_semaphore

- 创建协程信号量

```lua
import("core.base.scheduler")

local semaphore = scheduler.co_semaphore("test", 2)  -- 初始值为 2
```

创建一个新的协程信号量，用于协程间的同步和资源控制。

参数：
- `name` - 必需。信号量名称
- `value` - 可选。信号量初始值（默认为 0）

返回值：
- 信号量对象

```lua
-- 信号量示例
local semaphore = scheduler.co_semaphore("resource", 3)  -- 最多允许 3 个协程同时访问

for i = 1, 10 do
    scheduler.co_start(function(id)
        print("Task", id, "waiting for resource")
        local value = semaphore:wait(-1)  -- 无限等待
        print("Task", id, "got resource, value:", value)
        scheduler.co_sleep(1000)  -- 模拟工作
        semaphore:post(1)  -- 释放资源
        print("Task", id, "released resource")
    end, i)
end
```

## co_semaphore:wait

- 等待信号量

```lua
import("core.base.scheduler")

local semaphore = scheduler.co_semaphore("test", 1)
local value = semaphore:wait(5000)  -- 等待 5 秒
```

等待信号量，如果信号量值大于 0 则立即返回，否则挂起当前协程直到信号量可用。

参数：
- `timeout` - 可选。超时时间（毫秒），-1 表示无限等待，0 表示不等待

返回值：
- 成功时返回信号量值，超时时返回 0，错误时返回 -1

```lua
-- 信号量等待示例
local semaphore = scheduler.co_semaphore("worker", 0)

-- 生产者协程
scheduler.co_start(function()
    for i = 1, 5 do
        scheduler.co_sleep(1000)
        semaphore:post(1)
        print("Posted signal", i)
    end
end)

-- 消费者协程
scheduler.co_start(function()
    for i = 1, 5 do
        local value = semaphore:wait(-1)
        print("Got signal", i, "value:", value)
    end
end)
```

## co_semaphore:post

- 释放信号量

```lua
import("core.base.scheduler")

local semaphore = scheduler.co_semaphore("test", 0)
local new_value = semaphore:post(2)  -- 增加 2
```

释放信号量，增加信号量的值并唤醒等待的协程。

参数：
- `value` - 必需。要增加的值

返回值：
- 释放后的信号量新值

```lua
-- 信号量发布示例
local semaphore = scheduler.co_semaphore("batch", 0)

-- 批量处理示例
scheduler.co_start(function()
    scheduler.co_sleep(2000)
    print("Batch processing started")
    semaphore:post(5)  -- 一次性释放 5 个信号
end)

for i = 1, 5 do
    scheduler.co_start(function(id)
        local value = semaphore:wait(-1)
        print("Worker", id, "got batch signal, value:", value)
    end, i)
end
```

## co_semaphore:name

- 获取信号量名称

```lua
import("core.base.scheduler")

local semaphore = scheduler.co_semaphore("my_semaphore", 1)
print("Semaphore name:", semaphore:name())
```

获取信号量的名称。

返回值：
- 信号量名称字符串
