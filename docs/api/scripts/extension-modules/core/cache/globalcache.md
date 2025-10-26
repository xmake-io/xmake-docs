# core.cache.globalcache

This module provides global file-based cache functionality for persistent data storage across different build sessions.

::: tip TIP
To use this module, you need to import it first: `import("core.cache.globalcache")`
:::

## globalcache.set

- Set a cache value with single key

#### Function Prototype

::: tip API
```lua
globalcache.set(cachename: <string>, key: <string>, value: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| cachename | Required. Cache name string |
| key | Required. Cache key string |
| value | Required. Cache value (can be any Lua value) |

#### Return Value

No return value

#### Usage

```lua
import("core.cache.globalcache")

-- Store a value with single key
globalcache.set("mycache", "key1", {1, 2, 3})
```

## globalcache.get

- Get a cache value with single key

#### Function Prototype

::: tip API
```lua
globalcache.get(cachename: <string>, key: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| cachename | Required. Cache name string |
| key | Required. Cache key string |

#### Return Value

| Type | Description |
|------|-------------|
| any | Returns the cached value if found, nil otherwise |

#### Usage

```lua
import("core.cache.globalcache")

-- Get a value with single key
local value = globalcache.get("mycache", "key1")
```

## globalcache.set2

- Set a cache value with two-level keys

#### Function Prototype

::: tip API
```lua
globalcache.set2(cachename: <string>, key1: <string>, key2: <string>, value: <any>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| cachename | Required. Cache name string |
| key1 | Required. First-level cache key string |
| key2 | Required. Second-level cache key string |
| value | Required. Cache value (can be any Lua value) |

#### Return Value

No return value

#### Usage

```lua
import("core.cache.globalcache")

-- Store a value with two-level keys
globalcache.set2("mycache", "user", "name", "tboox")
```

## globalcache.get2

- Get a cache value with two-level keys

#### Function Prototype

::: tip API
```lua
globalcache.get2(cachename: <string>, key1: <string>, key2: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| cachename | Required. Cache name string |
| key1 | Required. First-level cache key string |
| key2 | Required. Second-level cache key string |

#### Return Value

| Type | Description |
|------|-------------|
| any | Returns the cached value if found, nil otherwise |

#### Usage

```lua
import("core.cache.globalcache")

-- Get a value with two-level keys
local name = globalcache.get2("mycache", "user", "name")
```

## globalcache.clear

- Clear cache entries

#### Function Prototype

::: tip API
```lua
globalcache.clear(cachename: <string>)
globalcache.clear()
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| cachename | Optional. Cache name string. If omitted, clears all caches |

#### Return Value

No return value

#### Usage

```lua
import("core.cache.globalcache")

-- Clear a specific cache
globalcache.clear("mycache")

-- Clear all caches
globalcache.clear()
```
