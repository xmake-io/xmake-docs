# async.runjobs

并发执行任务，自动处理依赖关系。支持从函数、jobpool 或 jobgraph 运行任务。

::: tip 提示
使用此模块需要先导入：`import("async.runjobs")`
:::

## runjobs

并发执行任务。

#### 函数原型

::: tip API
```lua
runjobs(name: <string>, jobs: <function|jobpool|jobgraph>, options?: <table>)
```
:::

#### 参数

| 参数 | 描述 |
|------|------|
| name | 任务名称，用于协程命名和分组 |
| jobs | 任务函数、jobpool 或 jobgraph 实例 |
| options | 可选的配置表 |

#### 选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `total` | number | 自动 | 总任务数（jobs 是函数时必需） |
| `comax` | number | 4 | 最大并发数 |
| `timeout` | number | 500 | 定时器回调超时（毫秒，需 < 60000） |
| `on_timer` | function | nil | 定时器回调：`function(running_jobs_indices)` |
| `waiting_indicator` | boolean\|table | nil | 启用等待指示器，参见 [utils.waiting_indicator](/zh/api/scripts/extension-modules/utils/waiting-indicator) |
| `progress` | boolean | nil | **已废弃**：使用 `waiting_indicator` 代替 |
| `progress_factor` | number | 1.0 | 进度计算因子 |
| `progress_refresh` | boolean | nil | 启用多行进度刷新（v3.0.5） |
| `on_exit` | function | nil | 退出回调：`function(abort_errors)` |
| `curdir` | string | nil | 任务执行的工作目录 |
| `isolate` | boolean | nil | 隔离协程环境 |
| `remote_only` | boolean | false | 仅在远程运行 |
| `distcc` | object | nil | distcc 客户端，用于分布式构建 |

#### 任务函数

当 `jobs` 是函数时，每个任务会调用该函数：

```lua
function(job_index: <number>, total: <number>, opt: <table>)
```

`opt` 表包含：
- `progress`: 进度对象，提供 `current()`、`total()` 和 `percent()` 方法

#### 示例

**函数方式：**

```lua
import("async.runjobs")

runjobs("test", function (index, total, opt)
    print("任务 %d/%d, 进度: %s", index, total, opt.progress)
    os.sleep(1000)
end, {
    total = 100,
    comax = 6,
    timeout = 1000,
    on_timer = function (indices)
        print("运行中: %s", table.concat(indices, ","))
    end
})
```

**等待指示器：**

```lua
import("async.runjobs")

-- 简单指示器
runjobs("test", function ()
    os.sleep(10000)
end, {
    waiting_indicator = true
})

-- 自定义指示器
runjobs("test", function ()
    os.sleep(10000)
end, {
    waiting_indicator = {
        chars = {'/', '-', '\\', '|'}
    }
})
```

**多行进度刷新：**

```lua
import("async.runjobs")

runjobs("test", function ()
    os.sleep(10000)
end, {
    waiting_indicator = true,
    progress_refresh = true
})
```

**使用 jobgraph：**

```lua
import("core.base.scheduler")
import("async.jobgraph")
import("async.runjobs")

function jobfunc(index, total, opt)
    print("%s: 任务 (%d/%d)", scheduler.co_running(), index, total)
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
        print("运行中: %s", table.concat(indices, ","))
    end
})
```

**使用 jobpool：**

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

**分布式构建：**

```lua
import("async.runjobs")

local distcc_client = distcc_build_client.singleton()
runjobs("test", jobs, {
    comax = 6,
    distcc = distcc_client
})
```

**退出回调：**

```lua
import("async.runjobs")

runjobs("test", function (index, total, opt)
    -- 任务逻辑
end, {
    total = 100,
    on_exit = function (abort_errors)
        if abort_errors then
            print("中止:", abort_errors)
        end
    end
})
```

**设置工作目录：**

```lua
import("async.runjobs")

runjobs("test", function (index, total, opt)
    print(os.getcwd())  -- 输出 /tmp/build
end, {
    total = 10,
    curdir = "/tmp/build"
})
```

相关链接：[async.jobgraph](/zh/api/scripts/extension-modules/async/jobgraph), [async.jobpool](/zh/api/scripts/extension-modules/async/jobpool)
