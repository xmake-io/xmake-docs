
# heap

heap 模块提供了使用二叉堆实现的优先队列数据结构。这是 xmake 的扩展模块。

::: tip 提示
使用此模块需要先导入：`import("core.base.heap")`
:::

## heap.valueheap

- 创建值堆

#### 函数原型

::: tip API
```lua
heap.valueheap(options: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| options | 可选的配置表，包含比较函数等选项 |

#### 用法说明

使用 Lua 表创建一个新的值堆。默认情况下堆是最小堆，但可以使用比较函数进行自定义。

`options` 中的参数：
- `cmp` - 可选的比较函数。如果第一个参数的优先级高于第二个参数，应返回 true

```lua
-- 创建最小堆（默认）
local h = heap.valueheap()

-- 创建最大堆
local h = heap.valueheap{
    cmp = function(a, b)
        return a > b
    end
}

-- 创建自定义对象的优先队列
local h = heap.valueheap{
    cmp = function(a, b)
        return a.priority < b.priority
    end
}
```

使用现有值初始化：

```lua
-- 使用初始值创建堆
local h = heap.valueheap{1, 5, 3, 7, 2}
```

## heap:push

- 向堆中推入一个值

#### 函数原型

::: tip API
```lua
heap:push(value: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| value | 要推入堆中的值（不能为 nil） |

#### 用法说明

向堆中添加一个值并维护堆属性。该值将根据比较函数放置在正确的位置。

```lua
local h = heap.valueheap()
h:push(10)
h:push(5)
h:push(20)
h:push(3)

print(h:peek())  -- 输出: 3 (最小值)
```

推入自定义对象：

```lua
local h = heap.valueheap{
    cmp = function(a, b)
        return a.priority < b.priority
    end
}

h:push{priority = 20, data = 'low'}
h:push{priority = 10, data = 'high'}
h:push{priority = 15, data = 'medium'}

print(h:peek().data)  -- 输出: high (优先级 10)
```

::: tip 提示
值不能为 nil。
:::

## heap:pop

- 从堆中弹出一个值

#### 函数原型

::: tip API
```lua
heap:pop(index: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| index | 可选。要弹出的位置（从 1 开始）。默认为 1（堆顶） |

#### 用法说明

从堆中移除并返回一个值。如果未提供索引，则移除顶部元素（最高优先级）。移除后，堆属性将得到维护。

```lua
local h = heap.valueheap()
h:push(10)
h:push(5)
h:push(20)

local v1 = h:pop()  -- 返回 5 (最小)
local v2 = h:pop()  -- 返回 10
local v3 = h:pop()  -- 返回 20
```

使用自定义优先级弹出：

```lua
local h = heap.valueheap{
    cmp = function(a, b)
        return a.priority < b.priority
    end
}

h:push{priority = 20, data = 'bar'}
h:push{priority = 10, data = 'foo'}

local item = h:pop()
print(item.priority)  -- 输出: 10
print(item.data)      -- 输出: foo
```

## heap:peek

- 查看值而不移除它

#### 函数原型

::: tip API
```lua
heap:peek(index: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| index | 可选。要查看的位置（从 1 开始）。默认为 1（堆顶） |

#### 用法说明

从堆中返回一个值而不移除它。如果未提供索引，则返回顶部元素（最高优先级）。

```lua
local h = heap.valueheap()
h:push(10)
h:push(5)
h:push(20)

print(h:peek())  -- 输出: 5 (最小)
print(h:peek())  -- 输出: 5 (仍然存在)

local v = h:pop()
print(h:peek())  -- 输出: 10 (下一个最小)
```

检查下一个任务而不处理：

```lua
local h = heap.valueheap{
    cmp = function(a, b)
        return a.priority < b.priority
    end
}

h:push{priority = 10, task = 'urgent'}
h:push{priority = 20, task = 'normal'}

if h:peek().priority < 15 then
    print("处理紧急任务")
    local task = h:pop()
end
```

## heap:replace

- 替换给定索引处的值

#### 函数原型

::: tip API
```lua
heap:replace(index: <number>, value: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| index | 必需。要替换的位置（从 1 开始） |
| value | 必需。新值 |

#### 用法说明

将指定索引处的值替换为新值，并重新平衡堆以维护堆属性。

```lua
local h = heap.valueheap()
h:push(10)
h:push(5)
h:push(20)

-- 替换顶部元素
h:replace(1, 15)

print(h:pop())  -- 输出: 10
print(h:pop())  -- 输出: 15
print(h:pop())  -- 输出: 20
```

在优先队列中更新优先级：

```lua
local h = heap.valueheap{
    cmp = function(a, b)
        return a.priority < b.priority
    end
}

h:push{priority = 10, id = 1}
h:push{priority = 20, id = 2}
h:push{priority = 15, id = 3}

-- 更新索引 2 处元素的优先级
h:replace(2, {priority = 5, id = 2})

print(h:pop().id)  -- 输出: 2 (现在具有最高优先级)
```

::: tip 提示
当需要更新元素的优先级而不删除和重新添加它时，使用 `replace`，这样更高效。
:::

## heap.length

- 获取堆中的元素数量

#### 函数原型

::: tip API
```lua
heap.length()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回堆中当前的元素数量。这是一个函数，不是方法。

```lua
local h = heap.valueheap()
h:push(10)
h:push(5)
h:push(20)

print(h.length())  -- 输出: 3

h:pop()
print(h.length())  -- 输出: 2
```

检查堆是否为空：

```lua
local h = heap.valueheap()

if h.length() == 0 then
    print("堆为空")
end

h:push(10)

if h.length() > 0 then
    print("堆有", h.length(), "个元素")
end
```

处理所有元素：

```lua
local h = heap.valueheap()
h:push(10)
h:push(5)
h:push(20)

while h.length() > 0 do
    local v = h:pop()
    print(v)  -- 输出: 5, 10, 20
end
```

::: tip 提示
heap 模块实现了二叉堆（优先队列）数据结构。默认情况下，它是一个最小堆，其中最小的元素具有最高优先级。您可以自定义比较函数来创建最大堆或基于自定义优先级标准的堆。堆操作（push、pop、peek、replace）都具有 O(log n) 时间复杂度。
:::

::: warning 注意
- 推入的值不能为 nil
- 索引从 1 开始（Lua 约定）
- 在空堆上调用 `pop()` 会导致错误
- `length()` 是一个函数，不是属性，所以使用 `h.length()` 而不是 `h.length`
:::

