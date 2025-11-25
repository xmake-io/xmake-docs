# async.runjobs

Concurrent job execution with dependency support. Can run jobs from a function, jobpool, or jobgraph.

::: tip TIP
To use this module, you need to import it first: `import("async.runjobs")`
:::

## runjobs

Run jobs concurrently.

#### Function Prototype

::: tip API
```lua
runjobs(name: <string>, jobs: <function|jobpool|jobgraph>, options?: <table>)
```
:::

#### Parameters

| Parameter | Description |
|-----------|-------------|
| name | Job name for coroutine naming and grouping |
| jobs | Job function, jobpool, or jobgraph instance |
| options | Optional configuration table |

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `total` | number | auto | Total job count (required when jobs is a function) |
| `comax` | number | 4 | Max concurrent jobs |
| `timeout` | number | 500 | Timer callback timeout in ms (must be < 60000) |
| `on_timer` | function | nil | Timer callback: `function(running_jobs_indices)` |
| `waiting_indicator` | boolean\|table | nil | Enable waiting indicator |
| `progress` | boolean | nil | **Deprecated**: Use `waiting_indicator` instead |
| `progress_factor` | number | 1.0 | Progress calculation factor |
| `progress_refresh` | boolean | nil | Enable progress refresh for multirow progress (v3.0.5) |
| `on_exit` | function | nil | Exit callback: `function(abort_errors)` |
| `curdir` | string | nil | Working directory for job execution |
| `isolate` | boolean | nil | Isolate coroutine environments |
| `remote_only` | boolean | false | Run all jobs remotely only |
| `distcc` | object | nil | Distcc client for distributed builds |

#### Job Function

When `jobs` is a function, it's called for each job:

```lua
function(job_index: <number>, total: <number>, opt: <table>)
```

The `opt` table provides:
- `progress`: Progress object with `current()`, `total()`, and `percent()` methods

#### Examples

**Function with total count:**

```lua
import("async.runjobs")

runjobs("test", function (index, total, opt)
    print("job %d/%d, progress: %s", index, total, opt.progress)
    os.sleep(1000)
end, {
    total = 100,
    comax = 6,
    timeout = 1000,
    on_timer = function (indices)
        print("running: %s", table.concat(indices, ","))
    end
})
```

**Waiting indicator:**

```lua
import("async.runjobs")

-- Simple indicator
runjobs("test", function ()
    os.sleep(10000)
end, {
    waiting_indicator = true
})

-- Custom indicator
runjobs("test", function ()
    os.sleep(10000)
end, {
    waiting_indicator = {
        chars = {'/', '-', '\\', '|'}
    }
})
```

**Multirow progress refresh:**

```lua
import("async.runjobs")

runjobs("test", function ()
    os.sleep(10000)
end, {
    waiting_indicator = true,
    progress_refresh = true
})
```

**Using jobgraph:**

```lua
import("core.base.scheduler")
import("async.jobgraph")
import("async.runjobs")

function jobfunc(index, total, opt)
    print("%s: job (%d/%d)", scheduler.co_running(), index, total)
    os.sleep(1000)
end

local jobs = jobgraph.new()
jobs:add("job/root", jobfunc)
for i = 1, 3 do
    jobs:add("job/" .. i, jobfunc)
    for j = 1, 5 do
        jobs:add("job/" .. i .. "/" .. j, jobfunc)
        jobs:add_orders("job/" .. i .. "/" .. j, "job/" .. i, "job/root")
    end
end

runjobs("test", jobs, {
    comax = 4,
    timeout = 1000,
    on_timer = function (indices)
        print("running: %s", table.concat(indices, ","))
    end
})
```

**Using jobpool:**

```lua
import("async.jobpool")
import("async.runjobs")

local jobs = jobpool.new()
local root = jobs:addjob("job/root", function (index, total, opt)
    print(index, total, opt.progress)
end)
for i = 1, 3 do
    jobs:addjob("job/" .. i, function (index, total, opt)
        print(index, total, opt.progress)
    end, {rootjob = root})
end

runjobs("test", jobs, {
    comax = 6,
    timeout = 1000
})
```

**Distributed build:**

```lua
import("async.runjobs")

local distcc_client = distcc_build_client.singleton()
runjobs("test", jobs, {
    comax = 6,
    distcc = distcc_client
})
```

**Exit callback:**

```lua
import("async.runjobs")

runjobs("test", function (index, total, opt)
    -- job logic
end, {
    total = 100,
    on_exit = function (abort_errors)
        if abort_errors then
            print("aborted:", abort_errors)
        end
    end
})
```

**Working directory:**

```lua
import("async.runjobs")

runjobs("test", function (index, total, opt)
    print(os.getcwd())  -- prints /tmp/build
end, {
    total = 10,
    curdir = "/tmp/build"
})
```

See also: [async.jobgraph](/api/scripts/extension-modules/async/jobgraph)
