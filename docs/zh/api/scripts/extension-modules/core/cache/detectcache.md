# core.cache.detectcache

此模块提供检测结果缓存功能，用于缓存编译器/链接器检测结果。

::: tip 提示
使用此模块需要先导入：`import("core.cache.detectcache")`
:::

## detectcache.set

- 设置缓存值（单键）

#### 函数原型

::: tip API
```lua
detectcache.set(cachename: <string>, key: <string>, value: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| cachename | 必需。缓存名称字符串 |
| key | 必需。缓存键字符串 |
| value | 必需。缓存值（可以是任意 Lua 值） |

#### 返回值说明

无返回值

#### 用法说明

```lua
import("core.cache.detectcache")

-- 使用单个键存储值
detectcache.set("mycache", "key1", {1, 2, 3})
```

## detectcache.get

- 获取缓存值（单键）

#### 函数原型

::: tip API
```lua
detectcache.get(cachename: <string>, key: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| cachename | 必需。缓存名称字符串 |
| key | 必需。缓存键字符串 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| any | 找到返回缓存值，未找到返回 nil |

#### 用法说明

```lua
import("core.cache.detectcache")

-- 使用单个键获取值
local value = detectcache.get("mycache", "key1")
```

## detectcache.set2

- 设置缓存值（二级键）

#### 函数原型

::: tip API
```lua
detectcache.set2(cachename: <string>, key1: <string>, key2: <string>, value: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| cachename | 必需。缓存名称字符串 |
| key1 | 必需。一级缓存键字符串 |
| key2 | 必需。二级缓存键字符串 |
| value | 必需。缓存值（可以是任意 Lua 值） |

#### 返回值说明

无返回值

#### 用法说明

```lua
import("core.cache.detectcache")

-- 使用二级键存储值
detectcache.set2("mycache", "user", "name", "tboox")
```

## detectcache.get2

- 获取缓存值（二级键）

#### 函数原型

::: tip API
```lua
detectcache.get2(cachename: <string>, key1: <string>, key2: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| cachename | 必需。缓存名称字符串 |
| key1 | 必需。一级缓存键字符串 |
| key2 | 必需。二级缓存键字符串 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| any | 找到返回缓存值，未找到返回 nil |

#### 用法说明

```lua
import("core.cache.detectcache")

-- 使用二级键获取值
local name = detectcache.get2("mycache", "user", "name")
```

## detectcache.clear

- 清除缓存条目

#### 函数原型

::: tip API
```lua
detectcache.clear(cachename?: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| cachename | 可选。缓存名称字符串。如果省略，清除所有缓存 |

#### 返回值说明

无返回值

#### 用法说明

```lua
import("core.cache.detectcache")

-- 清除指定缓存
detectcache.clear("mycache")

-- 清除所有缓存
detectcache.clear()
```
