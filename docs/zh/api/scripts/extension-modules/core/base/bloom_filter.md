# core.base.bloom_filter

此模块提供布隆过滤器实现，一种用于测试元素是否是集合成员的概率性数据结构。

::: tip 提示
使用此模块需要先导入：`import("core.base.bloom_filter")`
:::

布隆过滤器是一种空间高效的概率性数据结构，用于测试元素是否是集合的成员。可能出现误报匹配，但不会出现漏报。这使得它在高概率检查和最小内存使用方面非常有用。

## bloom_filter.new

- 创建新的布隆过滤器

#### 函数原型

::: tip API
```lua
bloom_filter.new(opt?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| opt | 可选。配置选项：<br>- `probability` - 误报概率（默认: 0.001）<br>- `hash_count` - 哈希函数数量（默认: 3）<br>- `item_maxn` - 最大元素数量（默认: 1000000） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| bloom_filter | 返回布隆过滤器实例 |
| nil, string | 失败时返回 nil 和错误消息 |

#### 用法说明

```lua
import("core.base.bloom_filter")

-- 使用默认设置创建新的布隆过滤器
local filter = bloom_filter.new()

-- 使用自定义设置创建
local filter = bloom_filter.new({
    probability = 0.001,
    hash_count = 3,
    item_maxn = 1000000
})
```

::: tip 提示
支持的误报概率值: 0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001
:::

## filter:set

- 向布隆过滤器添加元素

#### 函数原型

::: tip API
```lua
filter:set(item: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| item | 必需。要添加到过滤器中的字符串元素 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 元素添加成功返回 true，如果已经存在返回 false |

#### 用法说明

```lua
import("core.base.bloom_filter")

local filter = bloom_filter.new()

-- 向过滤器添加元素
if filter:set("hello") then
    print("元素添加成功")
end

-- 注意：可能出现误报
if filter:set("hello") then
    print("这不会打印 - 元素已存在")
else
    print("元素已存在（可能是误报）")
end
```

## filter:get

- 检查元素是否存在于布隆过滤器中

#### 函数原型

::: tip API
```lua
filter:get(item: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| item | 必需。要检查的字符串元素 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 元素存在返回 true，否则返回 false |

#### 用法说明

```lua
import("core.base.bloom_filter")

local filter = bloom_filter.new()

-- 添加一些元素
filter:set("hello")
filter:set("xmake")

-- 检查元素
if filter:get("hello") then
    print("hello 存在")
end

if filter:get("not exists") then
    print("这不会打印")
else
    print("元素未找到")
end
```

::: warning 注意
布隆过滤器可能出现误报（声称元素存在但实际上不存在），但绝不会出现漏报（声称元素不存在但实际上存在）。
:::

## filter:data

- 获取布隆过滤器数据作为 bytes 对象

#### 函数原型

::: tip API
```lua
filter:data()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| bytes | 返回过滤器的 bytes 对象数据 |
| nil, string | 失败时返回 nil 和错误消息 |

#### 用法说明

```lua
import("core.base.bloom_filter")

local filter = bloom_filter.new()
filter:set("hello")
filter:set("xmake")

-- 获取过滤器数据
local data = filter:data()

-- 保存或传输数据
print("过滤器大小:", data:size())
```

## filter:data_set

- 从 bytes 对象设置布隆过滤器数据

#### 函数原型

::: tip API
```lua
filter:data_set(data: <bytes>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| data | 必需。包含过滤器数据的 bytes 对象 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 数据设置成功返回 true |

#### 用法说明

```lua
import("core.base.bloom_filter")

-- 创建第一个过滤器并添加元素
local filter1 = bloom_filter.new()
filter1:set("hello")
filter1:set("xmake")

-- 从第一个过滤器获取数据
local data = filter1:data()

-- 创建第二个过滤器并加载数据
local filter2 = bloom_filter.new()
filter2:data_set(data)

-- 两个过滤器现在包含相同的元素
assert(filter2:get("hello") == true)
assert(filter2:get("xmake") == true)
```

## filter:clear

- 清除布隆过滤器中的所有元素

#### 函数原型

::: tip API
```lua
filter:clear()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 成功返回 true，失败返回 false |

#### 用法说明

```lua
import("core.base.bloom_filter")

local filter = bloom_filter.new()
filter:set("hello")
filter:set("xmake")

-- 清除所有元素
filter:clear()

-- 元素现在已移除
assert(filter:get("hello") == false)
assert(filter:get("xmake") == false)
```

## filter:cdata

- 获取内部 C 数据句柄

#### 函数原型

::: tip API
```lua
filter:cdata()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| userdata | 返回内部 C 数据句柄 |

#### 用法说明

```lua
import("core.base.bloom_filter")

local filter = bloom_filter.new()
local cdata = filter:cdata()
print("C 数据句柄:", cdata)
```

