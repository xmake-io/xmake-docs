# core.base.bloom_filter

This module provides a Bloom filter implementation, a probabilistic data structure used to test whether an element is a member of a set.

::: tip TIP
To use this module, you need to import it first: `import("core.base.bloom_filter")`
:::

A Bloom filter is a space-efficient probabilistic data structure that is used to test whether an element is a member of a set. False positive matches are possible, but false negatives are not. This makes it useful for checking membership with high probability and minimal memory usage.

## bloom_filter.new

- Create a new Bloom filter

#### Function Prototype

::: tip API
```lua
bloom_filter.new(opt?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| opt | Optional. Configuration options:<br>- `probability` - False positive probability (default: 0.001)<br>- `hash_count` - Number of hash functions (default: 3)<br>- `item_maxn` - Maximum number of items (default: 1000000) |

#### Return Value

| Type | Description |
|------|-------------|
| bloom_filter | Returns a bloom filter instance |
| nil, string | Returns nil and error message on failure |

#### Usage

```lua
import("core.base.bloom_filter")

-- Create a new bloom filter with default settings
local filter = bloom_filter.new()

-- Create with custom settings
local filter = bloom_filter.new({
    probability = 0.001,
    hash_count = 3,
    item_maxn = 1000000
})
```

::: tip TIP
Supported probability values: 0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001
:::

## filter:set

- Add an item to the Bloom filter

#### Function Prototype

::: tip API
```lua
filter:set(item: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| item | Required. String item to add to the filter |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if item was successfully added, false if it already exists |

#### Usage

```lua
import("core.base.bloom_filter")

local filter = bloom_filter.new()

-- Add items to the filter
if filter:set("hello") then
    print("Item added successfully")
end

-- Note: false positives are possible
if filter:set("hello") then
    print("This won't print - item already exists")
else
    print("Item already exists (may be false positive)")
end
```

## filter:get

- Check if an item exists in the Bloom filter

#### Function Prototype

::: tip API
```lua
filter:get(item: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| item | Required. String item to check |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if item exists, false otherwise |

#### Usage

```lua
import("core.base.bloom_filter")

local filter = bloom_filter.new()

-- Add some items
filter:set("hello")
filter:set("xmake")

-- Check for items
if filter:get("hello") then
    print("hello exists")
end

if filter:get("not exists") then
    print("This won't print")
else
    print("Item not found")
end
```

::: warning NOTE
Bloom filters can produce false positives (claiming an item exists when it doesn't), but never false negatives (claiming an item doesn't exist when it does).
:::

## filter:data

- Get the Bloom filter data as a bytes object

#### Function Prototype

::: tip API
```lua
filter:data()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| bytes | Returns the filter data as a bytes object |
| nil, string | Returns nil and error message on failure |

#### Usage

```lua
import("core.base.bloom_filter")

local filter = bloom_filter.new()
filter:set("hello")
filter:set("xmake")

-- Get the filter data
local data = filter:data()

-- Save or transfer the data
print("Filter size:", data:size())
```

## filter:data_set

- Set the Bloom filter data from a bytes object

#### Function Prototype

::: tip API
```lua
filter:data_set(data: <bytes>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| data | Required. Bytes object containing the filter data |

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true if data was set successfully |

#### Usage

```lua
import("core.base.bloom_filter")

-- Create first filter and add items
local filter1 = bloom_filter.new()
filter1:set("hello")
filter1:set("xmake")

-- Get data from first filter
local data = filter1:data()

-- Create second filter and load data
local filter2 = bloom_filter.new()
filter2:data_set(data)

-- Both filters now contain the same items
assert(filter2:get("hello") == true)
assert(filter2:get("xmake") == true)
```

## filter:clear

- Clear all items from the Bloom filter

#### Function Prototype

::: tip API
```lua
filter:clear()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| boolean | Returns true on success, false on failure |

#### Usage

```lua
import("core.base.bloom_filter")

local filter = bloom_filter.new()
filter:set("hello")
filter:set("xmake")

-- Clear all items
filter:clear()

-- Items are now removed
assert(filter:get("hello") == false)
assert(filter:get("xmake") == false)
```

## filter:cdata

- Get the internal C data handle

#### Function Prototype

::: tip API
```lua
filter:cdata()
```
:::

#### Parameter Description

No parameters

#### Return Value

| Type | Description |
|------|-------------|
| userdata | Returns the internal C data handle |

#### Usage

```lua
import("core.base.bloom_filter")

local filter = bloom_filter.new()
local cdata = filter:cdata()
print("C data handle:", cdata)
```

