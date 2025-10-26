
# core.cache.localcache

This module provides local file-based cache functionality for persistent data storage during build operations.

::: tip TIP
To use this module, you need to import it first: `import("core.cache.localcache")`
:::

## localcache.set

- Set a cache value with single key

#### Function Prototype

::: tip API
```lua
localcache.set(cachename: <string>, key: <string>, value: <any>)
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
import("core.cache.localcache")

-- Store a value with single key
localcache.set("mycache", "key1", {1, 2, 3})
```

## localcache.get

- Get a cache value with single key

#### Function Prototype

::: tip API
```lua
localcache.get(cachename: <string>, key: <string>)
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
import("core.cache.localcache")

-- Get a value with single key
local value = localcache.get("mycache", "key1")
```

## localcache.set2

- Set a cache value with two-level keys

#### Function Prototype

::: tip API
```lua
localcache.set2(cachename: <string>, key1: <string>, key2: <string>, value: <any>)
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
import("core.cache.localcache")

-- Store a value with two-level keys
localcache.set2("mycache", "user", "name", "tboox")
```

## localcache.get2

- Get a cache value with two-level keys

#### Function Prototype

::: tip API
```lua
localcache.get2(cachename: <string>, key1: <string>, key2: <string>)
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
import("core.cache.localcache")

-- Get a value with two-level keys
local name = localcache.get2("mycache", "user", "name")
```

## localcache.clear

- Clear cache entries

#### Function Prototype

::: tip API
```lua
localcache.clear(cachename: <string>)
localcache.clear()
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
import("core.cache.localcache")

-- Clear a specific cache
localcache.clear("mycache")

-- Clear all caches
localcache.clear()
```

