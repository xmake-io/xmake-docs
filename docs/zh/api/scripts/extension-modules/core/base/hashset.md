
# hashset

hashset 模块提供了哈希集合（无重复元素的集合）数据结构，用于高效地存储和查询唯一值。这是 xmake 的扩展模块。

::: tip 提示
使用此模块需要先导入：`import("core.base.hashset")`
:::

## hashset.new

- 创建空的哈希集合

#### 函数原型

::: tip API
```lua
hashset.new()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

创建一个空的哈希集合对象。

```lua
local set = hashset.new()
print(set:size())   -- 输出: 0
print(set:empty())  -- 输出: true
```

## hashset.of

- 从参数列表创建哈希集合

#### 函数原型

::: tip API
```lua
hashset.of(...)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| ... | 可变参数，要添加到集合中的元素 |

#### 用法说明

从参数列表创建哈希集合，自动去除重复元素。

这是创建并初始化集合的便捷方式：

```lua
local set = hashset.of(1, 2, 3, 5, 5, 7, 1, 9, 4, 6, 8, 0)
print(set:size())  -- 输出: 10 (重复的 1 和 5 被去除)

-- 验证元素
assert(set:has(1))
assert(set:has(5))
assert(not set:has(10))
```

## hashset.from

- 从数组创建哈希集合

#### 函数原型

::: tip API
```lua
hashset.from(array: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| array | 要转换为集合的数组 |

#### 用法说明

从数组创建哈希集合，自动去除重复元素。

用于将数组去重：

```lua
local array = {1, 2, 3, 2, 4, 3, 5}
local set = hashset.from(array)
print(set:size())  -- 输出: 5

-- 转回数组（已去重）
local unique_array = set:to_array()
```

## hashset:insert

- 插入元素

#### 函数原型

::: tip API
```lua
hashset:insert(value: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| value | 要插入的元素值 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| true | 元素不存在，插入成功 |
| false | 元素已存在，未插入 |

#### 用法说明

向哈希集合插入一个元素。如果元素已存在，则不插入。

```lua
local set = hashset.new()

local result = set:insert(1)
print(result)  -- 输出: true (插入成功)

local result = set:insert(1)
print(result)  -- 输出: false (元素已存在)

print(set:size())  -- 输出: 1
```

支持插入各种类型的值，包括字符串、数字、table、nil 等：

```lua
local set = hashset.new()
set:insert("hello")
set:insert(123)
set:insert({key = "value"})
set:insert(nil)  -- 也可以插入 nil 值
```

## hashset:remove

- 删除元素

#### 函数原型

::: tip API
```lua
hashset:remove(value: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| value | 要删除的元素值 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| true | 元素存在，删除成功 |
| false | 元素不存在，未删除 |

#### 用法说明

从哈希集合中删除一个元素。

```lua
local set = hashset.of(1, 2, 3)

local result = set:remove(2)
print(result)  -- 输出: true (删除成功)
print(set:size())  -- 输出: 2

local result = set:remove(10)
print(result)  -- 输出: false (元素不存在)
```

## hashset:has

- 检查元素是否存在

#### 函数原型

::: tip API
```lua
hashset:has(value: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| value | 要检查的元素值 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| true | 元素存在 |
| false | 元素不存在 |

#### 用法说明

检查指定元素是否在哈希集合中。

用于快速查找元素（O(1) 时间复杂度）：

```lua
local set = hashset.of(1, 2, 3, 4, 5)

if set:has(3) then
    print("集合包含 3")
end

if not set:has(10) then
    print("集合不包含 10")
end
```

## hashset:size

- 获取集合大小

#### 函数原型

::: tip API
```lua
hashset:size()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回哈希集合中元素的个数。

```lua
local set = hashset.of(1, 2, 3, 4, 5)
print(set:size())  -- 输出: 5

set:insert(6)
print(set:size())  -- 输出: 6

set:remove(1)
print(set:size())  -- 输出: 5
```

## hashset:empty

- 判断集合是否为空

#### 函数原型

::: tip API
```lua
hashset:empty()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回 true 表示集合为空（不包含任何元素）。

```lua
local set = hashset.new()
print(set:empty())  -- 输出: true

set:insert(1)
print(set:empty())  -- 输出: false
```

## hashset:clear

- 清空集合

#### 函数原型

::: tip API
```lua
hashset:clear()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

删除集合中的所有元素，重置为空集合。

```lua
local set = hashset.of(1, 2, 3, 4, 5)
print(set:size())  -- 输出: 5

set:clear()
print(set:size())  -- 输出: 0
print(set:empty()) -- 输出: true
```

## hashset:clone

- 克隆集合

#### 函数原型

::: tip API
```lua
hashset:clone()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

创建哈希集合的完整副本，新集合与原集合独立。

用于保存集合的快照或创建副本：

```lua
local set1 = hashset.of(1, 2, 3)
local set2 = set1:clone()

-- 修改副本不影响原集合
set2:insert(4)
print(set1:size())  -- 输出: 3
print(set2:size())  -- 输出: 4

-- 比较集合是否相等
set2:remove(4)
assert(set1 == set2)  -- 相等
```

## hashset:to_array

- 转换为数组

#### 函数原型

::: tip API
```lua
hashset:to_array()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

将哈希集合转换为数组，返回包含所有元素的 table。nil 值会被忽略。

常用于数组去重：

```lua
local array = {1, 2, 3, 2, 4, 3, 5, 1}
local set = hashset.from(array)
local unique_array = set:to_array()
-- unique_array 包含: {1, 2, 3, 4, 5} (顺序可能不同)

print("原数组大小:", #array)         -- 8
print("去重后大小:", #unique_array)   -- 5
```

## hashset:items

- 遍历集合元素

#### 函数原型

::: tip API
```lua
hashset:items()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回一个迭代器函数，用于遍历集合中的所有元素（无序）。

```lua
local set = hashset.of("apple", "banana", "orange")

for item in set:items() do
    print(item)
end
-- 输出顺序不确定：可能是 apple, orange, banana
```

用于检查集合中的所有元素：

```lua
local set = hashset.of(1, 2, 3, 4, 5)

-- 检查所有元素
for item in set:items() do
    assert(set:has(item))
end

-- 计算总和
local sum = 0
for item in set:items() do
    sum = sum + item
end
print("总和:", sum)  -- 输出: 15
```

## hashset:orderitems

- 按序遍历集合元素

#### 函数原型

::: tip API
```lua
hashset:orderitems()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

返回一个迭代器函数，用于按升序遍历集合中的所有元素。

适合需要有序输出的场景：

```lua
local set = hashset.of(5, 2, 8, 1, 9, 3)

print("无序遍历:")
for item in set:items() do
    print(item)  -- 顺序不确定
end

print("有序遍历:")
for item in set:orderitems() do
    print(item)  -- 输出: 1, 2, 3, 5, 8, 9
end
```

验证顺序性：

```lua
local set = hashset.of(9, 1, 5, 3, 7, 2, 8, 4, 6, 0)

local prev = -1
for item in set:orderitems() do
    assert(item > prev)  -- 每个元素都大于前一个
    prev = item
end
```

hashset 还支持通过 `==` 运算符比较两个集合是否相等（包含相同的元素）：

```lua
local set1 = hashset.of(1, 2, 3)
local set2 = hashset.of(3, 2, 1)
local set3 = hashset.of(1, 2, 4)

assert(set1 == set2)        -- true (元素相同，顺序无关)
assert(not (set1 == set3))  -- false (元素不同)
```

::: tip 提示
hashset 提供了 O(1) 时间复杂度的插入、删除和查找操作，比使用数组进行线性查找效率高得多。适合需要频繁检查元素存在性或去重的场景。
:::

::: warning 注意
- hashset 中的元素是无序的，使用 `items()` 遍历时顺序不确定
- 如需有序遍历，使用 `orderitems()`
- hashset 会自动去除重复元素
- nil 值可以被存储在 hashset 中
:::

