# core.cache.global_detectcache

This module provides global detection result cache functionality for caching compiler/linker detection results across different build sessions.

::: tip TIP
To use this module, you need to import it first: `import("core.cache.global_detectcache")`
:::

## global_detectcache.set

- Set a cache value with single key

#### Function Prototype

::: tip API
```lua
global_detectcache.set(cachename: <string>, key: <string>, value: <any>)
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
import("core.cache.global_detectcache")

-- Store a value with single key
global_detectcache.set("mycache", "key1", {1, 2, 3})
```

## global_detectcache.get

- Get a cache value with single key

#### Function Prototype

::: tip API
```lua
global_detectcache.get(cachename: <string>, key: <string>)
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
import("core.cache.global_detectcache")

-- Get a value with single key
local value = global_detectcache.get("mycache", "key1")
```

## global_detectcache.set2

- Set a cache value with two-level keys

#### Function Prototype

::: tip API
```lua
global_detectcache.set2(cachename: <string>, key1: <string>, key2: <string>, value: <any>)
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
import("core.cache.global_detectcache")

-- Store a value with two-level keys
global_detectcache.set2("mycache", "user", "name", "tboox")
```

## global_detectcache.get2

- Get a cache value with two-level keys

#### Function Prototype

::: tip API
```lua
global_detectcache.get2(cachename: <string>, key1: <string>, key2: <string>)
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
import("core.cache.global_detectcache")

-- Get a value with two-level keys
local name = global_detectcache.get2("mycache", "user", "name")
```

## global_detectcache.clear

- Clear cache entries

#### Function Prototype

::: tip API
```lua
global_detectcache.clear(cachename?: <string>)
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
import("core.cache.global_detectcache")

-- Clear a specific cache
global_detectcache.clear("mycache")

-- Clear all caches
global_detectcache.clear()
```
