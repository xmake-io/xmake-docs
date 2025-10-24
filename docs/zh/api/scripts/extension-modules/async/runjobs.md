# async.runjobs

此模块用于并发执行任务图中的所有任务，自动处理依赖关系。

## runjobs

并发执行任务图中的所有任务。

#### 函数原型

```lua
runjobs(name: <string>, jobs: <jobgraph>, options: <table>)
```

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 任务名称字符串 |
| jobs | 任务图实例 |
| options | 选项表 |

#### 用法说明

- `comax`: 最大并发任务数
- `timeout`: 单个任务超时时间（毫秒）
- `timer`: 定时回调，可用于监控当前运行中的任务

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

相关链接：[async.jobgraph](/zh/api/scripts/extension-modules/async/jobgraph) 