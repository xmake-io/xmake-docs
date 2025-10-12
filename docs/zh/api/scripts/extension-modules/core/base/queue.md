
# queue

queue 模块提供了先进先出（FIFO）队列数据结构，支持高效的入队和出队操作。这是 xmake 的扩展模块。

::: tip 提示
使用此模块需要先导入：`import("core.base.queue")`
:::

## queue.new

- 创建空的队列

```lua
import("core.base.queue")

local q = queue.new()
```

创建一个新的空队列对象。

```lua
local q = queue.new()
print(q:size())   -- 输出: 0
print(q:empty())  -- 输出: true
```

## queue:push

- 入队（在队尾添加元素）

```lua
queue:push(item)
```

将元素添加到队列的尾部。这是队列的基本操作。

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)

print(q:size())   -- 输出: 3
print(q:first())  -- 输出: 1 (队首元素)
print(q:last())   -- 输出: 3 (队尾元素)
```

队列支持存储各种类型的值：

```lua
local q = queue.new()
q:push("hello")
q:push(123)
q:push({key = "value"})
q:push(true)
```

## queue:pop

- 出队（从队首移除并返回元素）

```lua
local item = queue:pop()
```

从队列的头部移除并返回一个元素。如果队列为空，返回 nil。这是队列的基本操作。

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)

local first = q:pop()
print(first)      -- 输出: 1
print(q:first())  -- 输出: 2 (新的队首元素)
print(q:size())   -- 输出: 2
```

处理队列直到为空：

```lua
local q = queue.new()
q:push(10)
q:push(20)
q:push(30)

while not q:empty() do
    local item = q:pop()
    print(item)  -- 输出: 10, 20, 30
end
```

## queue:first

- 查看队首元素

```lua
local item = queue:first()
```

返回队列的第一个元素（队首），不移除。如果队列为空，返回 nil。

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)

print(q:first())  -- 输出: 1
print(q:size())   -- 输出: 3 (元素未被移除)
```

用于查看下一个要处理的元素：

```lua
local q = queue.new()
q:push("task1")
q:push("task2")

-- 查看但不处理
if q:first() == "task1" then
    print("下一个任务是 task1")
end
```

## queue:last

- 查看队尾元素

```lua
local item = queue:last()
```

返回队列的最后一个元素（队尾），不移除。如果队列为空，返回 nil。

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)

print(q:last())   -- 输出: 3
print(q:size())   -- 输出: 3 (元素未被移除)
```

## queue:size

- 获取队列大小

```lua
local count = queue:size()
```

返回队列中元素的个数。

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)

print(q:size())  -- 输出: 3

q:pop()
print(q:size())  -- 输出: 2
```

## queue:empty

- 判断队列是否为空

```lua
local is_empty = queue:empty()
```

返回 true 表示队列为空（不包含任何元素）。

```lua
local q = queue.new()
print(q:empty())  -- 输出: true

q:push(1)
print(q:empty())  -- 输出: false
```

用于循环处理队列：

```lua
local q = queue.new()
q:push("item1")
q:push("item2")
q:push("item3")

while not q:empty() do
    local item = q:pop()
    print("处理:", item)
end
```

## queue:clear

- 清空队列

```lua
queue:clear()
```

删除队列中的所有元素，重置为空队列。

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)

print(q:size())  -- 输出: 3

q:clear()
print(q:size())  -- 输出: 0
print(q:empty()) -- 输出: true
```

## queue:clone

- 克隆队列

```lua
local new_queue = queue:clone()
```

创建队列的完整副本，新队列与原队列独立。

用于保存队列快照：

```lua
local q1 = queue.new()
q1:push(1)
q1:push(2)
q1:push(3)

local q2 = q1:clone()

-- 修改副本不影响原队列
q2:pop()
print(q1:size())  -- 输出: 3 (原队列不变)
print(q2:size())  -- 输出: 2 (副本已修改)
```

## queue:items

- 正向遍历队列

```lua
for item in queue:items() do
    -- 处理 item
end
```

返回一个迭代器函数，用于从队首到队尾遍历队列中的所有元素。

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)
q:push(4)
q:push(5)

for item in q:items() do
    print(item)  -- 输出: 1, 2, 3, 4, 5
end
```

验证队列顺序：

```lua
local q = queue.new()
q:push(10)
q:push(20)
q:push(30)

local idx = 1
local expected = {10, 20, 30}
for item in q:items() do
    assert(item == expected[idx])
    idx = idx + 1
end
```

::: tip 提示
遍历不会修改队列内容，遍历后元素仍然在队列中。
:::

## queue:ritems

- 反向遍历队列

```lua
for item in queue:ritems() do
    -- 处理 item
end
```

返回一个迭代器函数，用于从队尾到队首遍历队列中的所有元素。

```lua
local q = queue.new()
q:push(1)
q:push(2)
q:push(3)
q:push(4)
q:push(5)

for item in q:ritems() do
    print(item)  -- 输出: 5, 4, 3, 2, 1
end
```

::: tip 提示
queue 模块实现了标准的 FIFO（先进先出）队列，适用于任务调度、消息队列、广度优先搜索等场景。队列的入队（push）和出队（pop）操作都是 O(1) 时间复杂度。
:::

::: warning 注意
- 队列是 FIFO 结构，先入队的元素先出队
- `pop()` 操作会移除元素，`first()` 只是查看不移除
- 从空队列 `pop()` 会返回 nil
- 遍历（`items()`、`ritems()`）不会修改队列内容
:::

