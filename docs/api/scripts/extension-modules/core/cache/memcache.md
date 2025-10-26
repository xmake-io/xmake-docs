
# core.cache.memcache

This module provides in-memory cache functionality for temporary data storage during build operations.

::: tip TIP
To use this module, you need to import it first: `import("core.cache.memcache")`
:::

## memcache.set

- Set a cache value with single key

#### Function Prototype

::: tip API
```lua
memcache.set(cachename: <string>, key: <string>, value: <any>)
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
import("core.cache.memcache")

-- Store a value with single key
memcache.set("mycache", "key1", {1, 2, 3})
```

## memcache.get

- Get a cache value with single key

#### Function Prototype

::: tip API
```lua
memcache.get(cachename: <string>, key: <string>)
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
import("core.cache.memcache")

-- Get a value with single key
local value = memcache.get("mycache", "key1")
```

## memcache.set2

- Set a cache value with two-level keys

#### Function Prototype

::: tip API
```lua
memcache.set2(cachename: <string>, key1: <string>, key2: <string>, value: <any>)
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
import("core.cache.memcache")

-- Store a value with two-level keys
memcache.set2("mycache", "user", "name", "tboox")
```

## memcache.get2

- Get a cache value with two-level keys

#### Function Prototype

::: tip API
```lua
memcache.get2(cachename: <string>, key1: <string>, key2: <string>)
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
import("core.cache.memcache")

-- Get a value with two-level keys
local name = memcache.get2("mycache", "user", "name")
```

## memcache.clear

- Clear cache entries

#### Function Prototype

::: tip API
```lua
memcache.clear(cachename: <string>)
memcache.clear()
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
import("core.cache.memcache")

-- Clear a specific cache
memcache.clear("mycache")

-- Clear all caches
memcache.clear()
```

