
# list

list 模块提供了双向链表数据结构，支持高效的头尾插入删除操作。这是 xmake 的扩展模块。

::: tip 提示
使用此模块需要先导入：`import("core.base.list")`
:::

## list.new

- 创建空的链表

#### 函数原型

::: tip API
```lua
list.new()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

创建一个新的空双向链表对象。

```lua
local l = list.new()
print(l:size())   -- 输出: 0
print(l:empty())  -- 输出: true
```

## list:push

- 在链表尾部添加元素

#### 函数原型

::: tip API
```lua
list:push(item: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| item | 要添加的元素 |

#### 用法说明

在链表的尾部添加一个元素。等同于 `list:insert_last(item)`。

这是最常用的添加元素方式：

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

print(l:size())        -- 输出: 3
print(l:first().value) -- 输出: 1
print(l:last().value)  -- 输出: 3
```

::: tip 提示
链表存储的是对元素的引用，而不是副本。可以存储任意类型的值（数字、字符串、table 等）。
:::

## list:pop

- 从链表尾部移除元素

#### 函数原型

::: tip API
```lua
list:pop()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

从链表的尾部移除一个元素。等同于 `list:remove_last()`。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

l:pop()
print(l:last().value)  -- 输出: 2
```

## list:unshift

- 在链表头部添加元素

#### 函数原型

::: tip API
```lua
list:unshift(item: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| item | 要添加的元素 |

#### 用法说明

在链表的头部添加一个元素。等同于 `list:insert_first(item)`。

```lua
local l = list.new()
l:push({value = 2})
l:push({value = 3})
l:unshift({value = 1})

for item in l:items() do
    print(item.value)  -- 输出: 1, 2, 3
end
```

## list:shift

- 从链表头部移除元素

#### 函数原型

::: tip API
```lua
list:shift()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

从链表的头部移除一个元素。等同于 `list:remove_first()`。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

l:shift()
print(l:first().value)  -- 输出: 2
```

## list:insert

- 插入元素

#### 函数原型

::: tip API
```lua
list:insert(item: <any>, after: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| item | 要插入的元素 |
| after | 可选，在此元素后插入，如果为 nil 则在尾部插入 |

#### 用法说明

在指定元素后面插入新元素。如果不提供 `after` 参数，则在链表尾部插入。

```lua
local l = list.new()
local v3 = {value = 3}
l:insert({value = 1})
l:insert({value = 2})
l:insert(v3)
l:insert({value = 5})
l:insert({value = 4}, v3)  -- 在 v3 后插入 {value = 4}

local idx = 1
for item in l:items() do
    print(item.value)  -- 输出: 1, 2, 3, 4, 5
    idx = idx + 1
end
```

## list:insert_first

- 在链表头部插入元素

#### 函数原型

::: tip API
```lua
list:insert_first(item: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| item | 要插入的元素 |

#### 用法说明

在链表的头部插入一个元素。

用于需要在头部插入的场景：

```lua
local l = list.new()
l:push({value = 2})
l:push({value = 3})
l:insert_first({value = 1})

print(l:first().value)  -- 输出: 1
```

## list:insert_last

- 在链表尾部插入元素

#### 函数原型

::: tip API
```lua
list:insert_last(item: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| item | 要插入的元素 |

#### 用法说明

在链表的尾部插入一个元素。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:insert_last({value = 3})

print(l:last().value)  -- 输出: 3
```

## list:remove

- 删除指定元素

#### 函数原型

::: tip API
```lua
list:remove(item: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| item | 要删除的元素 |

#### 用法说明

从链表中删除指定的元素，返回被删除的元素。

```lua
local l = list.new()
local v3 = {value = 3}
l:push({value = 1})
l:push({value = 2})
l:push(v3)
l:push({value = 4})
l:push({value = 5})

l:remove(v3)
print(l:size())  -- 输出: 4
```

在遍历时删除元素的安全方式：

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

-- 遍历并删除所有元素
local item = l:first()
while item ~= nil do
    local next = l:next(item)
    l:remove(item)
    item = next
end
print(l:empty())  -- 输出: true
```

## list:remove_first

- 删除链表头部元素

#### 函数原型

::: tip API
```lua
list:remove_first()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

从链表头部删除一个元素，返回被删除的元素。如果链表为空，返回 nil。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

l:remove_first()
print(l:first().value)  -- 输出: 2
```

## list:remove_last

- 删除链表尾部元素

#### 函数原型

::: tip API
```lua
list:remove_last()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

从链表尾部删除一个元素，返回被删除的元素。如果链表为空，返回 nil。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

l:remove_last()
print(l:last().value)  -- 输出: 2
```

## list:first

- 获取链表首元素

#### 函数原型

::: tip API
```lua
list:first()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回链表的第一个元素，不删除。如果链表为空，返回 nil。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

print(l:first().value)  -- 输出: 1
```

## list:last

- 获取链表尾元素

#### 函数原型

::: tip API
```lua
list:last()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回链表的最后一个元素，不删除。如果链表为空，返回 nil。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

print(l:last().value)  -- 输出: 3
```

## list:next

- 获取下一个元素

#### 函数原型

::: tip API
```lua
list:next(current: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| current | 当前元素，如果为 nil 则返回第一个元素 |

#### 用法说明

获取指定元素的下一个元素。如果 `current` 为 nil，返回第一个元素。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

local first = l:first()
local second = l:next(first)
print(second.value)  -- 输出: 2
```

用于手动遍历链表：

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

local item = l:next(nil)  -- 获取第一个元素
while item do
    print(item.value)
    item = l:next(item)
end
```

## list:prev

- 获取上一个元素

#### 函数原型

::: tip API
```lua
list:prev(current: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| current | 当前元素，如果为 nil 则返回最后一个元素 |

#### 用法说明

获取指定元素的上一个元素。如果 `current` 为 nil，返回最后一个元素。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

local last = l:last()
local second = l:prev(last)
print(second.value)  -- 输出: 2
```

用于反向遍历：

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

local item = l:prev(nil)  -- 获取最后一个元素
while item do
    print(item.value)  -- 输出: 3, 2, 1
    item = l:prev(item)
end
```

## list:size

- 获取链表大小

#### 函数原型

::: tip API
```lua
list:size()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回链表中元素的个数。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

print(l:size())  -- 输出: 3
```

## list:empty

- 判断链表是否为空

#### 函数原型

::: tip API
```lua
list:empty()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回 true 表示链表为空（不包含任何元素）。

```lua
local l = list.new()
print(l:empty())  -- 输出: true

l:push({value = 1})
print(l:empty())  -- 输出: false
```

## list:clear

- 清空链表

#### 函数原型

::: tip API
```lua
list:clear()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

删除链表中的所有元素，重置为空链表。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

l:clear()
print(l:empty())  -- 输出: true
print(l:size())   -- 输出: 0
```

## list:items

- 正向遍历链表

#### 函数原型

::: tip API
```lua
list:items()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回一个迭代器函数，用于从头到尾遍历链表中的所有元素。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

for item in l:items() do
    print(item.value)  -- 输出: 1, 2, 3
end
```

验证顺序：

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})
l:push({value = 4})
l:push({value = 5})

local idx = 1
for item in l:items() do
    assert(item.value == idx)
    idx = idx + 1
end
```

## list:ritems

- 反向遍历链表

#### 函数原型

::: tip API
```lua
list:ritems()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回一个迭代器函数，用于从尾到头遍历链表中的所有元素。

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})

for item in l:ritems() do
    print(item.value)  -- 输出: 3, 2, 1
end
```

反向遍历并删除：

```lua
local l = list.new()
l:push({value = 1})
l:push({value = 2})
l:push({value = 3})
l:push({value = 4})
l:push({value = 5})

local item = l:last()
while item ~= nil do
    local prev = l:prev(item)
    l:remove(item)
    item = prev
end
print(l:empty())  -- 输出: true
```

::: tip 提示
list 模块实现的是双向链表，提供 O(1) 时间复杂度的头尾插入删除操作。适合需要频繁在两端操作的场景，如队列、栈、LRU 缓存等。
:::

::: warning 注意
- 链表存储的是对元素的引用，修改元素会影响链表中的内容
- 遍历时删除元素需要注意先获取下一个/上一个元素的引用
- 插入或删除操作的时间复杂度为 O(1)（如果已有元素引用）
:::

