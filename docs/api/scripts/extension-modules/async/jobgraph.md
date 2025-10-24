# async.jobgraph

This module provides a job graph (DAG) for advanced asynchronous job scheduling and dependency management in xmake Lua scripts.

## jobgraph.new

- Create a new job graph instance.

#### Function Prototype

::: tip API
```lua
jobgraph.new()
```
:::


#### Parameter Description

No parameters required for this function.

#### Usage

```lua
import("async.jobgraph")
local jobs = jobgraph.new()
```

> All following examples assume `async.jobgraph` has been imported.

## jobgraph:add

- Add a job node to the job graph.

#### Function Prototype

::: tip API
```lua
jobgraph:add(name: <string>, jobfunc: <function>, options: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Job name string |
| jobfunc | Job function |
| options | Options table (optional) |

#### Usage

```lua
local jobs = jobgraph.new()
jobs:add("job/root", function() print("root job") end)
jobs:add("job/child", function() print("child job") end)
```

You can also assign a job to a group or multiple groups using the `groups` option:

```lua
local jobs = jobgraph.new()

-- Add a job to a single group
jobs:add("foo/buildfiles", function(index, total, opt)
    -- build logic
end, {groups = "foo/buildfiles"})

-- Add a job to multiple groups
jobs:add("xxx", function(index, total, opt)
    -- ...
end, {groups = {"group1", "group2"}})
```

::: tip NOTE
For batch group operations, it is generally more recommended and convenient to use `jobgraph:group`.

See: [jobgraph:group](#jobgraph-group)
:::

A typical use case in a rule:

```lua
rule("foo")
    on_build_files(function (target, jobgraph, sourcebatch, opt)
        local group_name = target:name() .. "/buildfiles"
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            local job_name = target:name() .. "/" .. sourcefile
            jobgraph:add(job_name, function(index, total, opt)
                -- TODO: build file
            end, {groups = group_name})
        end
        -- add job orders, other target jobs -> this build group
        jobgraph:add_orders(other_target:name() .. "/buildfiles", group_name)
    end, {jobgraph = true})
```

## jobgraph:add_orders

- Add dependency orders.

#### Function Prototype

::: tip API
```lua
jobgraph:add_orders(jobname: <string>, ...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| jobname | Job name string |
| ... | Variable arguments for dependency jobs |

#### Usage

```lua
local jobs = jobgraph.new()
jobs:add("job/root", function() print("root job") end)
jobs:add("job/child", function() print("child job") end)
jobs:add_orders("job/child", "job/root")
```

## jobgraph:group

- Group jobs for batch dependency management. You can use a callback to add jobs to a group.

#### Function Prototype

::: tip API
```lua
jobgraph:group(groupname: <string>, callback: <function>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| groupname | Group name string |
| callback | Callback function to add jobs to group |

#### Usage

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

-- sort job orders after adding all these jobs
jobs:add_orders("job", "group1", "group2")
```

See also: [async.runjobs](/api/scripts/extension-modules/async/runjobs) 
