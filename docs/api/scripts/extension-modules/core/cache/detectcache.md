# core.cache.detectcache

This module provides detection result cache functionality for caching compiler/linker detection results.

::: tip TIP
To use this module, you need to import it first: `import("core.cache.detectcache")`
:::

## detectcache.set

- Set a cache value with single key

#### Function Prototype

::: tip API
```lua
detectcache.set(cachename: <string>, key: <string>, value: <any>)
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
import("core.cache.detectcache")

-- Store a value with single key
detectcache.set("mycache", "key1", {1, 2, 3})
```

## detectcache.get

- Get a cache value with single key

#### Function Prototype

::: tip API
```lua
detectcache.get(cachename: <string>, key: <string>)
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
import("core.cache.detectcache")

-- Get a value with single key
local value = detectcache.get("mycache", "key1")
```

## detectcache.set2

- Set a cache value with two-level keys

#### Function Prototype

::: tip API
```lua
detectcache.set2(cachename: <string>, key1: <string>, key2: <string>, value: <any>)
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
import("core.cache.detectcache")

-- Store a value with two-level keys
detectcache.set2("mycache", "user", "name", "tboox")
```

## detectcache.get2

- Get a cache value with two-level keys

#### Function Prototype

::: tip API
```lua
detectcache.get2(cachename: <string>, key1: <string>, key2: <string>)
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
import("core.cache.detectcache")

-- Get a value with two-level keys
local name = detectcache.get2("mycache", "user", "name")
```

## detectcache.clear

- Clear cache entries

#### Function Prototype

::: tip API
```lua
detectcache.clear(cachename: <string>)
detectcache.clear()
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
import("core.cache.detectcache")

-- Clear a specific cache
detectcache.clear("mycache")

-- Clear all caches
detectcache.clear()
```
