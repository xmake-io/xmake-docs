
# table

table 属于 lua 原生提供的模块，对于原生接口使用可以参考：[lua官方文档](https://www.lua.org/manual/5.1/manual.html#5.5)

Xmake 中对其进行了扩展，增加了一些扩展接口：

## table.join

- 合并多个table并返回

#### 函数原型

::: tip API
```lua
table.join(tables: <table>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tables | 要合并的表格 |
| ... | 可变参数，可以传递多个表格 |

#### 用法说明

可以将多个table里面的元素进行合并后，返回到一个新的table中，例如：

```lua
local newtable = table.join({1, 2, 3}, {4, 5, 6}, {7, 8, 9})
```

结果为：`{1, 2, 3, 4, 5, 6, 7, 8, 9}`

并且它也支持字典的合并：

```lua
local newtable = table.join({a = "a", b = "b"}, {c = "c"}, {d = "d"})
```

结果为：`{a = "a", b = "b", c = "c", d = "d"}`

## table.join2

- 合并多个table到第一个table

#### 函数原型

::: tip API
```lua
table.join2(target: <table>, tables: <table>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| target | 目标表格 |
| tables | 要合并的表格 |
| ... | 可变参数，可以传递多个表格 |

#### 用法说明

类似[table.join](#table-join)，唯一的区别是，合并的结果放置在第一个参数中，例如：

```lua
local t = {0, 9}
table.join2(t, {1, 2, 3})
```

结果为：`t = {0, 9, 1, 2, 3}`

## table.unique

- 对table中的内容进行去重

#### 函数原型

::: tip API
```lua
table.unique(tbl: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要去重的表格 |

#### 用法说明

去重table的元素，一般用于数组table，例如：

```lua
local newtable = table.unique({1, 1, 2, 3, 4, 4, 5})
```

结果为：`{1, 2, 3, 4, 5}`

## table.slice

- 获取table的切片

#### 函数原型

::: tip API
```lua
table.slice(tbl: <table>, start: <number>, stop: <number>, step: <number>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要切片的表格 |
| start | 开始索引 |
| stop | 结束索引（可选） |
| step | 步长（可选） |

#### 用法说明

用于提取数组table的部分元素，例如：

```lua
-- 提取第4个元素后面的所有元素，结果：{4, 5, 6, 7, 8, 9}
table.slice({1, 2, 3, 4, 5, 6, 7, 8, 9}, 4)

-- 提取第4-8个元素，结果：{4, 5, 6, 7, 8}
table.slice({1, 2, 3, 4, 5, 6, 7, 8, 9}, 4, 8)

-- 提取第4-8个元素，间隔步长为2，结果：{4, 6, 8}
table.slice({1, 2, 3, 4, 5, 6, 7, 8, 9}, 4, 8, 2)
```

## table.contains

- 判断 table 中包含指定的值

#### 函数原型

::: tip API
```lua
table.contains(tbl: <table>, values: <any>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要检查的表格 |
| values | 要检查的值 |
| ... | 可变参数，可以传递多个值 |

#### 用法说明

```lua
if table.contains(t, 1, 2, 3) then
    -- ...
end
```

只要 table 中包含 1, 2, 3 里面任意一个值，则返回 true。

## table.orderkeys

- 获取有序的 key 列表

#### 函数原型

::: tip API
```lua
table.orderkeys(tbl: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要获取键的表格 |

#### 用法说明

`table.keys(t)` 返回的 key 列表顺序是随机的，想要获取有序 key 列表，可以用这个接口。

## table.keys

- 获取 table 的所有 key

#### 函数原型

::: tip API
```lua
table.keys(tbl: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要获取键的表格 |

#### 用法说明

```lua
local keys = table.keys({a = 1, b = 2, c = 3})
-- 结果为：{"a", "b", "c"}（顺序不确定）
```

## table.values

- 获取 table 的所有 value

#### 函数原型

::: tip API
```lua
table.values(tbl: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要获取值的表格 |

#### 用法说明

```lua
local vals = table.values({a = 1, b = 2, c = 3})
-- 结果为：{1, 2, 3}（顺序不确定）
```

## table.orderpairs

- 有序遍历 table 的 key/value

#### 函数原型

::: tip API
```lua
table.orderpairs(tbl: <table>, callback?: <function>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要遍历的表格 |
| callback | 可选。自定义排序函数 |

#### 用法说明

```lua
for k, v in table.orderpairs({b = 2, a = 1, c = 3}) do
    print(k, v)
end
-- 输出：
-- a   1
-- b   2
-- c   3
```

## table.clone

- 克隆 table

#### 函数原型

::: tip API
```lua
table.clone(tbl: <table>, depth?: <number>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要克隆的表格 |
| depth | 可选。克隆深度，默认为 1（浅拷贝），设置为 -1 可进行深拷贝 |

#### 用法说明

```lua
-- 浅拷贝
local t = {a = 1, b = {2, 3}}
local t2 = table.clone(t)

-- 深拷贝
local t3 = table.clone(t, -1)
```

## table.wrap

- 将值包装成数组

#### 函数原型

::: tip API
```lua
table.wrap(value: <any>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| value | 要包装的值 |

#### 用法说明

如果值为 nil，返回空表；如果值不是 table，将其包装为单元素数组；如果值已经是 table，直接返回：

```lua
table.wrap(nil)       -- 结果为：{}
table.wrap("a")       -- 结果为：{"a"}
table.wrap({"a", "b"}) -- 结果为：{"a", "b"}
```

## table.unwrap

- 解包单元素数组

#### 函数原型

::: tip API
```lua
table.unwrap(array: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| array | 要解包的数组 |

#### 用法说明

如果数组只有一个元素，返回该元素；否则返回原数组：

```lua
table.unwrap({"a"})      -- 结果为："a"
table.unwrap({"a", "b"}) -- 结果为：{"a", "b"}
```

## table.reverse

- 反转数组

#### 函数原型

::: tip API
```lua
table.reverse(arr: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| arr | 要反转的数组 |

#### 用法说明

```lua
local t = table.reverse({1, 2, 3, 4})
-- 结果为：{4, 3, 2, 1}
```

## table.append

- 追加元素到数组末尾

#### 函数原型

::: tip API
```lua
table.append(array: <table>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| array | 目标数组 |
| ... | 要追加的元素 |

#### 用法说明

```lua
local t = {1, 2}
table.append(t, 3, 4, 5)
-- t = {1, 2, 3, 4, 5}
```

## table.swap

- 交换数组中两个元素的位置

#### 函数原型

::: tip API
```lua
table.swap(array: <table>, i: <number>, j: <number>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| array | 目标数组 |
| i | 第一个元素的索引 |
| j | 第二个元素的索引 |

#### 用法说明

```lua
local t = {1, 2, 3}
table.swap(t, 1, 3)
-- t = {3, 2, 1}
```

## table.empty

- 判断 table 是否为空

#### 函数原型

::: tip API
```lua
table.empty(tbl: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要检查的表格 |

#### 用法说明

```lua
print(table.empty({}))          -- 输出: true
print(table.empty({1}))         -- 输出: false
print(table.empty({a = 1}))     -- 输出: false
```

## table.is_array

- 判断 table 是否为数组

#### 函数原型

::: tip API
```lua
table.is_array(tbl: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要检查的表格 |

#### 用法说明

```lua
print(table.is_array({1, 2, 3}))     -- 输出: true
print(table.is_array({a = 1}))       -- 输出: false
```

## table.is_dictionary

- 判断 table 是否为字典

#### 函数原型

::: tip API
```lua
table.is_dictionary(tbl: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要检查的表格 |

#### 用法说明

```lua
print(table.is_dictionary({a = 1}))    -- 输出: true
print(table.is_dictionary({1, 2, 3}))  -- 输出: false
```

## table.find

- 查找 table 中指定值的索引或键

#### 函数原型

::: tip API
```lua
table.find(tbl: <table>, value: <any>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要搜索的表格 |
| value | 要查找的值 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table/nil | 返回包含所有匹配索引或键的数组，未找到时返回 nil |

#### 用法说明

```lua
local indices = table.find({1, 2, 3, 2, 1}, 2)
-- 结果为：{2, 4}
```

## table.find_if

- 根据条件查找 table 中匹配的索引或键

#### 函数原型

::: tip API
```lua
table.find_if(tbl: <table>, pred: <function>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要搜索的表格 |
| pred | 判断函数，接收 `(key, value)` 参数，返回 true 表示匹配 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table/nil | 返回包含所有匹配索引或键的数组，未找到时返回 nil |

#### 用法说明

```lua
local indices = table.find_if({1, 2, 3, 4, 5}, function (i, v)
    return v > 3
end)
-- 结果为：{4, 5}
```

## table.find_first

- 查找 table 中指定值的第一个索引

#### 函数原型

::: tip API
```lua
table.find_first(tbl: <table>, value: <any>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要搜索的数组 |
| value | 要查找的值 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number/nil | 返回第一个匹配的索引，未找到时返回 nil |

#### 用法说明

```lua
local index = table.find_first({1, 2, 3, 2, 1}, 2)
-- 结果为：2
```

## table.find_first_if

- 根据条件查找 table 中第一个匹配的索引

#### 函数原型

::: tip API
```lua
table.find_first_if(tbl: <table>, pred: <function>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要搜索的数组 |
| pred | 判断函数，接收 `(index, value)` 参数，返回 true 表示匹配 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number/nil | 返回第一个匹配的索引，未找到时返回 nil |

#### 用法说明

```lua
local index = table.find_first_if({1, 2, 3, 4, 5}, function (i, v)
    return v > 3
end)
-- 结果为：4
```

## table.remove_if

- 根据条件移除 table 中的元素

#### 函数原型

::: tip API
```lua
table.remove_if(tbl: <table>, pred: <function>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要操作的表格 |
| pred | 判断函数，接收 `(key, value)` 参数，返回 true 表示移除 |

#### 用法说明

```lua
local t = {1, 2, 3, 4, 5}
table.remove_if(t, function (i, v)
    return v % 2 == 0
end)
-- t = {1, 3, 5}
```

## table.shallow_join

- 浅合并多个对象到新 table（不展开子 table）

#### 函数原型

::: tip API
```lua
table.shallow_join(...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| ... | 要合并的对象 |

#### 用法说明

与 `table.join` 不同，`table.shallow_join` 不会展开 table 类型的参数，而是直接将其作为元素追加：

```lua
local t = table.shallow_join({1, 2}, {3, 4})
-- 结果为：{{1, 2}, {3, 4}}
```

## table.shallow_join2

- 浅合并多个对象到第一个 table（不展开子 table）

#### 函数原型

::: tip API
```lua
table.shallow_join2(target: <table>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| target | 目标表格 |
| ... | 要合并的对象 |

#### 用法说明

类似 `table.shallow_join`，但结果放置在第一个参数中：

```lua
local t = {}
table.shallow_join2(t, {1, 2}, {3, 4})
-- t = {{1, 2}, {3, 4}}
```

## table.reverse_unique

- 从后向前去重

#### 函数原型

::: tip API
```lua
table.reverse_unique(array: <table>, barrier?: <function>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| array | 要去重的数组 |
| barrier | 可选。屏障函数 |

#### 用法说明

与 `table.unique` 类似，但是从后向前遍历去重，保留最后一次出现的元素：

```lua
local t = table.reverse_unique({1, 2, 3, 2, 1})
-- 结果为：{3, 2, 1}
```

## table.to_array

- 将迭代器的数据收集为数组

#### 函数原型

::: tip API
```lua
table.to_array(iterator: <function>, state: <any>, var: <any>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| iterator | 迭代器函数 |
| state | 迭代器状态 |
| var | 迭代器变量 |

#### 用法说明

```lua
local lines = table.to_array(io.lines("file.txt"))
```

## table.inherit

- 继承接口并创建新实例

#### 函数原型

::: tip API
```lua
table.inherit(...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| ... | 要继承的类或表格 |

#### 用法说明

从一个或多个类继承所有函数接口，创建一个新的实例：

```lua
local base = {foo = function () print("foo") end}
local instance = table.inherit(base)
instance.foo()  -- 输出: foo
```

## table.wrap_lock

- 锁定 table 以防止被 unwrap

#### 函数原型

::: tip API
```lua
table.wrap_lock(value: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| value | 要锁定的表格 |

#### 用法说明

锁定后的 table 调用 `table.wrap` 和 `table.unwrap` 时会保持原样：

```lua
local t = {1}
table.wrap_lock(t)
print(table.unwrap(t))  -- 结果为：t（不会被解包为 1）
```

## table.wrap_unlock

- 解锁 table 以允许被 unwrap

#### 函数原型

::: tip API
```lua
table.wrap_unlock(value: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| value | 要解锁的表格 |

#### 用法说明

```lua
local t = {1}
table.wrap_lock(t)
table.wrap_unlock(t)
print(table.unwrap(t))  -- 结果为：1
```

## table.pack

- 将参数打包成 table

#### 函数原型

::: tip API
```lua
table.pack(...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| ... | 要打包的参数 |

#### 用法说明

Lua 5.2 `table.pack` 的兼容实现：

```lua
local t = table.pack(1, 2, 3)
-- t = {1, 2, 3, n = 3}
```

## table.unpack

- 解包 table 为多个返回值

#### 函数原型

::: tip API
```lua
table.unpack(tbl: <table>, i?: <number>, j?: <number>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| tbl | 要解包的表格 |
| i | 可选。起始索引，默认为 1 |
| j | 可选。结束索引，默认为 #tbl |

#### 用法说明

Lua 5.2 `table.unpack` 的兼容实现：

```lua
print(table.unpack({1, 2, 3}))  -- 输出: 1   2   3
```
