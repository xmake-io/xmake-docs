# async.runjobs

This module runs all jobs in a job graph concurrently, respecting dependencies.

## runjobs

Run all jobs in the job graph concurrently.

#### Function Prototype

```lua
runjobs(name: <string>, jobs: <jobgraph>, options: <table>)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Job name string |
| jobs | Job graph instance |
| options | Options table |

#### Usage

- `comax`: Maximum number of concurrent jobs.
- `timeout`: Timeout for each job (ms).
- `timer`: Timer callback for monitoring running jobs.

```lua
import("core.base.scheduler")
import("async.jobgraph")
import("async.runjobs")

function jobfunc(index, total, opt)
    print("%s: run job (%d/%d)", scheduler.co_running(), index, total)
    os.sleep(1000)
    print("%s: run job (%d/%d) end, progress: %s", scheduler.co_running(), index, total, opt.progress)
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
    timer = function (running_jobs_indices)
        print("timeout, running: %s", table.concat(running_jobs_indices, ","))
    end
})
```

See also: [async.jobgraph](/api/scripts/extension-modules/async/jobgraph) 