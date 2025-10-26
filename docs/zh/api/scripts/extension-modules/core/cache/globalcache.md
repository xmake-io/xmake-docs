# core.cache.globalcache

此模块提供全局文件缓存功能，用于在不同构建会话之间持久化数据存储。

::: tip 提示
使用此模块需要先导入：`import("core.cache.globalcache")`
:::

## globalcache.set

- 设置缓存值（单键）

#### 函数原型

::: tip API
```lua
globalcache.set(cachename: <string>, key: <string>, value: <any>)
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
import("core.cache.globalcache")

-- 使用单个键存储值
globalcache.set("mycache", "key1", {1, 2, 3})
```

## globalcache.get

- 获取缓存值（单键）

#### 函数原型

::: tip API
```lua
globalcache.get(cachename: <string>, key: <string>)
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
import("core.cache.globalcache")

-- 使用单个键获取值
local value = globalcache.get("mycache", "key1")
```

## globalcache.set2

- 设置缓存值（二级键）

#### 函数原型

::: tip API
```lua
globalcache.set2(cachename: <string>, key1: <string>, key2: <string>, value: <any>)
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
import("core.cache.globalcache")

-- 使用二级键存储值
globalcache.set2("mycache", "user", "name", "tboox")
```

## globalcache.get2

- 获取缓存值（二级键）

#### 函数原型

::: tip API
```lua
globalcache.get2(cachename: <string>, key1: <string>, key2: <string>)
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
import("core.cache.globalcache")

-- 使用二级键获取值
local name = globalcache.get2("mycache", "user", "name")
```

## globalcache.clear

- 清除缓存条目

#### 函数原型

::: tip API
```lua
globalcache.clear(cachename: <string>)
globalcache.clear()
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
import("core.cache.globalcache")

-- 清除指定缓存
globalcache.clear("mycache")

-- 清除所有缓存
globalcache.clear()
```
