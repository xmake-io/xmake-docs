# async.jobgraph

此模块为 xmake 的 Lua 脚本提供任务图（DAG），用于高级异步任务调度与依赖管理。

## jobgraph.new

创建新的任务图实例。

```lua
import("async.jobgraph")
local jobs = jobgraph.new()
```

> 下方所有示例均假定已 import("async.jobgraph")。

## jobgraph:add

- 向任务图添加一个任务节点。

```lua
local jobs = jobgraph.new()
jobs:add("job/root", function() print("root job") end)
jobs:add("job/child", function() print("child job") end)
```

如需将任务加入分组，可通过 `groups` 选项实现：

```lua
local jobs = jobgraph.new()

-- 添加到单个分组
jobs:add("foo/buildfiles", function(index, total, opt)
    -- 构建逻辑
end, {groups = "foo/buildfiles"})

-- 添加到多个分组
jobs:add("xxx", function(index, total, opt)
    -- ...
end, {groups = {"group1", "group2"}})
```

::: tip 提示
对于批量分组场景，更推荐使用 `jobgraph:group`，更为方便。

详见：[jobgraph:group](#jobgraph-group)
:::

典型用法（如 rule 中）：

```lua
rule("foo")
    on_build_files(function (target, jobgraph, sourcebatch, opt)
        local group_name = target:name() .. "/buildfiles"
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            local job_name = target:name() .. "/" .. sourcefile
            jobgraph:add(job_name, function(index, total, opt)
                -- TODO: 构建文件
            end, {groups = group_name})
        end
        -- 添加依赖关系，其他 target 的 job -> 当前 build group
        jobgraph:add_orders(other_target:name() .. "/buildfiles", group_name)
    end, {jobgraph = true})
```

## jobgraph:add_orders

- 添加依赖边（jobname 依赖 ...）。

```lua
local jobs = jobgraph.new()
jobs:add("job/root", function() print("root job") end)
jobs:add("job/child", function() print("child job") end)
jobs:add_orders("job/child", "job/root")
```

## jobgraph:group

- 分组批量管理任务依赖。可通过回调批量添加分组任务。

```lua
local jobs = jobgraph.new()

jobs:add("job", function(index, total, opt)
    -- ...
end)

jobs:group("group1", function()
    for i = 0, N do
        jobs:add("group1/job" .. i, function(index, total, opt)
            -- TODO
        end)
    end
end)

jobs:group("group2", function()
    for i = 0, N do
        jobs:add("group2/job" .. i, function(index, total, opt)
            -- TODO
        end)
    end
end)

-- 添加所有分组后统一排序依赖
jobs:add_orders("job", "group1", "group2")
```

相关链接：[async.runjobs](/zh/api/scripts/extension-modules/async/runjobs) 