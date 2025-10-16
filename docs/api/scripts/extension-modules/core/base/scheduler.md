# scheduler

The scheduler module provides coroutine scheduling functionality for managing coroutine creation, execution, synchronization, and communication. This is an extension module of xmake.

::: tip NOTE
To use this module, you need to import it first: `import("core.base.scheduler")`
:::

## scheduler.co_start

- Start a new coroutine task

```lua
import("core.base.scheduler")

local co = scheduler.co_start(function()
    print("Hello from coroutine!")
end)
```

Start a new coroutine and execute the specified task function. The coroutine will start executing immediately unless the scheduler is not yet started.

Parameters:
- `cotask` - Required. The coroutine task function to execute
- `...` - Optional. Arguments to pass to the task function

Return value:
- Returns coroutine object on success, nil and error message on failure

```lua
-- Start coroutine with arguments
local co = scheduler.co_start(function(name, id)
    print("Task", name, "with id", id, "started")
end, "worker", 123)

-- Coroutine group example
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

- Start a named coroutine task

```lua
import("core.base.scheduler")

local co = scheduler.co_start_named("worker", function()
    print("Named coroutine started")
end)
```

Start a coroutine task with a specified name for easier debugging and monitoring.

Parameters:
- `coname` - Required. Coroutine name
- `cotask` - Required. The coroutine task function to execute
- `...` - Optional. Arguments to pass to the task function

```lua
-- Start multiple named coroutines
for i = 1, 5 do
    scheduler.co_start_named("worker-" .. i, function()
        print("Worker", i, "started")
        scheduler.co_sleep(1000)
        print("Worker", i, "finished")
    end)
end
```

## scheduler.co_start_withopt

- Start a coroutine task with options

```lua
import("core.base.scheduler")

local co = scheduler.co_start_withopt({
    name = "isolated-worker",
    isolate = true
}, function()
    print("Isolated coroutine started")
end)
```

Start a coroutine task with specific options.

Parameters:
- `opt` - Required. Coroutine options table
- `cotask` - Required. The coroutine task function to execute
- `...` - Optional. Arguments to pass to the task function

`opt` options:
- `name` - Coroutine name
- `isolate` - Whether to isolate coroutine environment (default false)

```lua
-- Start coroutine with isolated environment
local co = scheduler.co_start_withopt({
    name = "isolated-task",
    isolate = true
}, function()
    -- This coroutine has independent environment variables
    os.setenv("CUSTOM_VAR", "isolated_value")
    print("Isolated task running")
end)
```

## scheduler.co_suspend

- Suspend the current coroutine

```lua
import("core.base.scheduler")

function task()
    print("Task started")
    scheduler.co_suspend()  -- Suspend coroutine
    print("Task resumed")
end
```

Suspend the currently executing coroutine and yield execution to other coroutines.

Return value:
- Returns arguments passed to `co_resume`

```lua
local co = scheduler.co_start(function()
    print("Step 1")
    scheduler.co_suspend()
    print("Step 2")
end)

-- Coroutine will suspend at co_suspend()
-- Can be resumed with co_resume
```

## scheduler.co_resume

- Resume a suspended coroutine

```lua
import("core.base.scheduler")

local co = scheduler.co_start(function()
    local value = scheduler.co_suspend()
    print("Resumed with value:", value)
end)

-- Resume coroutine and pass arguments
scheduler.co_resume(co, "hello")
```

Resume the specified suspended coroutine and optionally pass arguments to it.

Parameters:
- `co` - Required. The coroutine object to resume
- `...` - Optional. Arguments to pass to the coroutine

```lua
-- Coroutine communication example
local co = scheduler.co_start(function()
    local data = scheduler.co_suspend()
    print("Received data:", data)
    local result = "processed: " .. data
    scheduler.co_suspend(result)
end)

-- Send data and get result
scheduler.co_resume(co, "input data")
local result = scheduler.co_resume(co)
print("Got result:", result)
```

## scheduler.co_yield

- Yield execution of the current coroutine

```lua
import("core.base.scheduler")

function task()
    for i = 1, 5 do
        print("Task step", i)
        scheduler.co_yield()  -- Yield execution
    end
end
```

Yield execution of the current coroutine to allow other coroutines to run. This is a key function for cooperative multitasking.

```lua
-- Cooperative task example
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

- Sleep the coroutine for specified time

```lua
import("core.base.scheduler")

function delayed_task()
    print("Task started")
    scheduler.co_sleep(1000)  -- Sleep for 1 second
    print("Task resumed after sleep")
end
```

Make the current coroutine sleep for the specified number of milliseconds, during which other coroutines can continue executing.

Parameters:
- `ms` - Required. Sleep time in milliseconds, 0 means no sleep

```lua
-- Timed task example
for i = 1, 5 do
    scheduler.co_start(function(id)
        print("Task", id, "starting")
        scheduler.co_sleep(id * 500)  -- Incremental delay
        print("Task", id, "finished")
    end, i)
end
```

## scheduler.co_lock

- Lock the specified lock

```lua
import("core.base.scheduler")

function critical_section()
    scheduler.co_lock("shared_resource")
    print("Entering critical section")
    -- Critical section code
    scheduler.co_unlock("shared_resource")
    print("Leaving critical section")
end
```

Acquire the lock with the specified name. If the lock is already held by another coroutine, the current coroutine will wait until the lock becomes available.

Parameters:
- `lockname` - Required. The name of the lock

```lua
-- Mutex lock example
local shared_counter = 0

for i = 1, 10 do
    scheduler.co_start(function(id)
        scheduler.co_lock("counter")
        local old_value = shared_counter
        scheduler.co_sleep(100)  -- Simulate work
        shared_counter = old_value + 1
        print("Task", id, "incremented counter to", shared_counter)
        scheduler.co_unlock("counter")
    end, i)
end
```

## scheduler.co_unlock

- Release the specified lock

```lua
import("core.base.scheduler")

function critical_section()
    scheduler.co_lock("my_lock")
    -- Critical section code
    scheduler.co_unlock("my_lock")
end
```

Release the lock with the specified name, allowing other waiting coroutines to acquire the lock.

Parameters:
- `lockname` - Required. The name of the lock to release

## scheduler.co_group_begin

- Begin a coroutine group

```lua
import("core.base.scheduler")

scheduler.co_group_begin("workers", function(group)
    -- All coroutines started in this scope will join the group
    for i = 1, 5 do
        scheduler.co_start(function()
            print("Worker", i, "started")
        end)
    end
end)
```

Begin a new coroutine group. All coroutines started within the specified function will join this group.

Parameters:
- `name` - Required. The coroutine group name
- `scopefunc` - Required. The scope function

```lua
-- Batch job processing example
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

- Wait for coroutine group completion

```lua
import("core.base.scheduler")

scheduler.co_group_begin("test", function()
    for i = 1, 10 do
        scheduler.co_start(function()
            print("Task", i, "completed")
        end)
    end
end)

-- Wait for all coroutines to complete
scheduler.co_group_wait("test")
print("All tasks completed")
```

Wait for all coroutines in the specified group to complete execution.

Parameters:
- `name` - Required. The coroutine group name
- `opt` - Optional. Wait options

`opt` options:
- `limit` - Maximum number of coroutines to wait for completion (default wait for all coroutines)

```lua
-- Limited wait example
scheduler.co_group_begin("limited", function()
    for i = 1, 10 do
        scheduler.co_start(function(id)
            print("Task", id, "running")
            scheduler.co_sleep(id * 100)
            print("Task", id, "finished")
        end, i)
    end
end)

-- Only wait for first 3 coroutines to complete
scheduler.co_group_wait("limited", {limit = 3})
print("First 3 tasks completed")
```

## scheduler.co_running

- Get the currently running coroutine

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

Get the currently running coroutine object.

Return value:
- Current coroutine object, or nil if no coroutine is running

```lua
-- Coroutine info example
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

- Get the total number of coroutines

```lua
import("core.base.scheduler")

print("Total coroutines:", scheduler.co_count())
```

Get the total number of active coroutines in the current scheduler.

Return value:
- Number of coroutines

```lua
-- Coroutine counting example
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

- Create a coroutine semaphore

```lua
import("core.base.scheduler")

local semaphore = scheduler.co_semaphore("test", 2)  -- Initial value is 2
```

Create a new coroutine semaphore for synchronization and resource control between coroutines.

Parameters:
- `name` - Required. Semaphore name
- `value` - Optional. Initial semaphore value (default 0)

Return value:
- Semaphore object

```lua
-- Semaphore example
local semaphore = scheduler.co_semaphore("resource", 3)  -- Allow up to 3 coroutines simultaneously

for i = 1, 10 do
    scheduler.co_start(function(id)
        print("Task", id, "waiting for resource")
        local value = semaphore:wait(-1)  -- Wait indefinitely
        print("Task", id, "got resource, value:", value)
        scheduler.co_sleep(1000)  -- Simulate work
        semaphore:post(1)  -- Release resource
        print("Task", id, "released resource")
    end, i)
end
```

## co_semaphore:wait

- Wait for semaphore

```lua
import("core.base.scheduler")

local semaphore = scheduler.co_semaphore("test", 1)
local value = semaphore:wait(5000)  -- Wait for 5 seconds
```

Wait for the semaphore. If the semaphore value is greater than 0, return immediately; otherwise, suspend the current coroutine until the semaphore becomes available.

Parameters:
- `timeout` - Optional. Timeout in milliseconds, -1 means wait indefinitely, 0 means don't wait

Return value:
- Returns semaphore value on success, 0 on timeout, -1 on error

```lua
-- Semaphore wait example
local semaphore = scheduler.co_semaphore("worker", 0)

-- Producer coroutine
scheduler.co_start(function()
    for i = 1, 5 do
        scheduler.co_sleep(1000)
        semaphore:post(1)
        print("Posted signal", i)
    end
end)

-- Consumer coroutine
scheduler.co_start(function()
    for i = 1, 5 do
        local value = semaphore:wait(-1)
        print("Got signal", i, "value:", value)
    end
end)
```

## co_semaphore:post

- Release semaphore

```lua
import("core.base.scheduler")

local semaphore = scheduler.co_semaphore("test", 0)
local new_value = semaphore:post(2)  -- Increase by 2
```

Release the semaphore by increasing its value and wake up waiting coroutines.

Parameters:
- `value` - Required. The value to increase by

Return value:
- The new semaphore value after release

```lua
-- Semaphore post example
local semaphore = scheduler.co_semaphore("batch", 0)

-- Batch processing example
scheduler.co_start(function()
    scheduler.co_sleep(2000)
    print("Batch processing started")
    semaphore:post(5)  -- Release 5 signals at once
end)

for i = 1, 5 do
    scheduler.co_start(function(id)
        local value = semaphore:wait(-1)
        print("Worker", id, "got batch signal, value:", value)
    end, i)
end
```

## co_semaphore:name

- Get semaphore name

```lua
import("core.base.scheduler")

local semaphore = scheduler.co_semaphore("my_semaphore", 1)
print("Semaphore name:", semaphore:name())
```

Get the semaphore name.

Return value:
- Semaphore name string
