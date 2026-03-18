
# table

Table belongs to the module provided by Lua native. For the native interface, you can refer to: [lua official document](https://www.lua.org/manual/5.1/manual.html#5.5)

It has been extended in xmake to add some extension interfaces:

## table.join

- Merge multiple tables and return

#### Function Prototype

::: tip API
```lua
table.join(tables: <table>, ...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tables | Table to merge |
| ... | Variable arguments, can pass multiple tables |

#### Usage

You can merge the elements in multiple tables and return to a new table, for example:

```lua
local newtable = table.join({1, 2, 3}, {4, 5, 6}, {7, 8, 9})
```

The result is: `{1, 2, 3, 4, 5, 6, 7, 8, 9}`

And it also supports the merging of dictionaries:

```lua
local newtable = table.join({a = "a", b = "b"}, {c = "c"}, {d = "d"})
```

The result is: `{a = "a", b = "b", c = "c", d = "d"}`

If you don't want to expand table arguments but append them as elements directly, use [table.shallow_join](#table-shallow_join). To merge results into an existing table, use [table.join2](#table-join2).

## table.join2

- Combine multiple tables into the first table

#### Function Prototype

::: tip API
```lua
table.join2(target: <table>, tables: <table>, ...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| target | Target table to merge into |
| tables | Table to merge |
| ... | Variable arguments, can pass multiple tables |

#### Usage

Similar to [table.join](#table-join), the only difference is that the result of the merge is placed in the first argument, for example:

```lua
local t = {0, 9}
table.join2(t, {1, 2, 3})
```

The result is: `t = {0, 9, 1, 2, 3}`

## table.unique

- Deduplicate the contents of the table

#### Function Prototype

::: tip API
```lua
table.unique(tbl: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to deduplicate |

#### Usage

To de-table elements, generally used in array tables, for example:

```lua
local newtable = table.unique({1, 1, 2, 3, 4, 4, 5})
```

The result is: `{1, 2, 3, 4, 5}`

To keep the last occurrence of each element (deduplicate from the end), use [table.reverse_unique](#table-reverse_unique).

## table.slice

- Get the slice of the table

#### Function Prototype

::: tip API
```lua
table.slice(tbl: <table>, start: <number>, stop: <number>, step: <number>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to slice |
| start | Start index |
| stop | Stop index (optional) |
| step | Step size (optional) |

#### Usage

Used to extract some elements of an array table, for example:

```lua
-- Extract all elements after the 4th element, resulting in: {4, 5, 6, 7, 8, 9}
table.slice({1, 2, 3, 4, 5, 6, 7, 8, 9}, 4)

-- Extract the 4th-8th element and the result: {4, 5, 6, 7, 8}
table.slice({1, 2, 3, 4, 5, 6, 7, 8, 9}, 4, 8)

-- Extract the 4th-8th element with an interval of 2, resulting in: {4, 6, 8}
table.slice({1, 2, 3, 4, 5, 6, 7, 8, 9}, 4, 8, 2)
```

## table.contains

- Determine that the table contains the specified value

#### Function Prototype

::: tip API
```lua
table.contains(tbl: <table>, values: <any>, ...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to check |
| values | Values to check for |
| ... | Variable arguments, can pass multiple values |

#### Usage

```lua
if table.contains(t, 1, 2, 3) then
     - ...
end
```

As long as the table contains any value from 1, 2, 3, it returns true

To get the specific indices or keys of matching values, use [table.find](#table-find) or [table.find_first](#table-find_first).

## table.orderkeys

- Get an ordered list of keys

#### Function Prototype

::: tip API
```lua
table.orderkeys(tbl: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to get keys from |

#### Usage

The order of the key list returned by `table.keys(t)` is random. If you want to get an ordered key list, you can use this interface.

To iterate key/value pairs in sorted order, use [table.orderpairs](#table-orderpairs).

## table.keys

- Get all keys of a table

#### Function Prototype

::: tip API
```lua
table.keys(tbl: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to get keys from |

#### Usage

```lua
local keys = table.keys({a = 1, b = 2, c = 3})
-- Result: {"a", "b", "c"} (order is not guaranteed)
```

For an ordered key list, use [table.orderkeys](#table-orderkeys). To get all values, use [table.values](#table-values).

## table.values

- Get all values of a table

#### Function Prototype

::: tip API
```lua
table.values(tbl: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to get values from |

#### Usage

```lua
local vals = table.values({a = 1, b = 2, c = 3})
-- Result: {1, 2, 3} (order is not guaranteed)
```

## table.orderpairs

- Iterate key/value pairs in sorted key order

#### Function Prototype

::: tip API
```lua
table.orderpairs(tbl: <table>, callback?: <function>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to iterate |
| callback | Optional. Custom sort function |

#### Usage

```lua
for k, v in table.orderpairs({b = 2, a = 1, c = 3}) do
    print(k, v)
end
-- Output:
-- a   1
-- b   2
-- c   3
```

## table.clone

- Clone a table

#### Function Prototype

::: tip API
```lua
table.clone(tbl: <table>, depth?: <number>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to clone |
| depth | Optional. Clone depth, default is 1 (shallow copy), set to -1 for deep copy |

#### Usage

```lua
-- shallow copy
local t = {a = 1, b = {2, 3}}
local t2 = table.clone(t)

-- deep copy
local t3 = table.clone(t, -1)
```

## table.wrap

- Wrap a value into an array

#### Function Prototype

::: tip API
```lua
table.wrap(value: <any>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| value | Value to wrap |

#### Usage

If the value is nil, returns an empty table; if the value is not a table, wraps it into a single-element array; if the value is already a table, returns it directly:

```lua
table.wrap(nil)       -- Result: {}
table.wrap("a")       -- Result: {"a"}
table.wrap({"a", "b"}) -- Result: {"a", "b"}
```

The reverse operation is [table.unwrap](#table-unwrap), which unwraps single-element arrays. To lock a table to prevent unwrapping, use [table.wrap_lock](#table-wrap_lock).

## table.unwrap

- Unwrap a single-element array

#### Function Prototype

::: tip API
```lua
table.unwrap(array: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| array | Array to unwrap |

#### Usage

If the array has only one element, returns that element; otherwise returns the original array:

```lua
table.unwrap({"a"})      -- Result: "a"
table.unwrap({"a", "b"}) -- Result: {"a", "b"}
```

## table.reverse

- Reverse an array

#### Function Prototype

::: tip API
```lua
table.reverse(arr: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| arr | Array to reverse |

#### Usage

```lua
local t = table.reverse({1, 2, 3, 4})
-- Result: {4, 3, 2, 1}
```

## table.append

- Append elements to the end of an array

#### Function Prototype

::: tip API
```lua
table.append(array: <table>, ...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| array | Target array |
| ... | Elements to append |

#### Usage

```lua
local t = {1, 2}
table.append(t, 3, 4, 5)
-- t = {1, 2, 3, 4, 5}
```

## table.swap

- Swap two elements in an array

#### Function Prototype

::: tip API
```lua
table.swap(array: <table>, i: <number>, j: <number>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| array | Target array |
| i | Index of the first element |
| j | Index of the second element |

#### Usage

```lua
local t = {1, 2, 3}
table.swap(t, 1, 3)
-- t = {3, 2, 1}
```

## table.empty

- Check if a table is empty

#### Function Prototype

::: tip API
```lua
table.empty(tbl: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to check |

#### Usage

```lua
print(table.empty({}))          -- Output: true
print(table.empty({1}))         -- Output: false
print(table.empty({a = 1}))     -- Output: false
```

## table.is_array

- Check if a table is an array

#### Function Prototype

::: tip API
```lua
table.is_array(tbl: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to check |

#### Usage

```lua
print(table.is_array({1, 2, 3}))     -- Output: true
print(table.is_array({a = 1}))       -- Output: false
```

## table.is_dictionary

- Check if a table is a dictionary

#### Function Prototype

::: tip API
```lua
table.is_dictionary(tbl: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to check |

#### Usage

```lua
print(table.is_dictionary({a = 1}))    -- Output: true
print(table.is_dictionary({1, 2, 3}))  -- Output: false
```

## table.find

- Find indices or keys for a given value

#### Function Prototype

::: tip API
```lua
table.find(tbl: <table>, value: <any>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to search |
| value | Value to find |

#### Return Value

| Type | Description |
|------|-------------|
| table/nil | Returns an array of matching indices or keys, nil if not found |

#### Usage

```lua
local indices = table.find({1, 2, 3, 2, 1}, 2)
-- Result: {2, 4}
```

To find by condition, use [table.find_if](#table-find_if). To find only the first match, use [table.find_first](#table-find_first). To simply check if a value exists, use [table.contains](#table-contains).

## table.find_if

- Find indices or keys matching a predicate

#### Function Prototype

::: tip API
```lua
table.find_if(tbl: <table>, pred: <function>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to search |
| pred | Predicate function, receives `(key, value)`, returns true for matches |

#### Return Value

| Type | Description |
|------|-------------|
| table/nil | Returns an array of matching indices or keys, nil if not found |

#### Usage

```lua
local indices = table.find_if({1, 2, 3, 4, 5}, function (i, v)
    return v > 3
end)
-- Result: {4, 5}
```

## table.find_first

- Find the first index of a given value

#### Function Prototype

::: tip API
```lua
table.find_first(tbl: <table>, value: <any>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Array to search |
| value | Value to find |

#### Return Value

| Type | Description |
|------|-------------|
| number/nil | Returns the first matching index, nil if not found |

#### Usage

```lua
local index = table.find_first({1, 2, 3, 2, 1}, 2)
-- Result: 2
```

## table.find_first_if

- Find the first index matching a predicate

#### Function Prototype

::: tip API
```lua
table.find_first_if(tbl: <table>, pred: <function>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Array to search |
| pred | Predicate function, receives `(index, value)`, returns true for matches |

#### Return Value

| Type | Description |
|------|-------------|
| number/nil | Returns the first matching index, nil if not found |

#### Usage

```lua
local index = table.find_first_if({1, 2, 3, 4, 5}, function (i, v)
    return v > 3
end)
-- Result: 4
```

## table.remove_if

- Remove elements matching a predicate

#### Function Prototype

::: tip API
```lua
table.remove_if(tbl: <table>, pred: <function>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to modify |
| pred | Predicate function, receives `(key, value)`, returns true to remove |

#### Usage

```lua
local t = {1, 2, 3, 4, 5}
table.remove_if(t, function (i, v)
    return v % 2 == 0
end)
-- t = {1, 3, 5}
```

To find without removing, use [table.find_if](#table-find_if).

## table.shallow_join

- Shallow join objects into a new table (without expanding sub-tables)

#### Function Prototype

::: tip API
```lua
table.shallow_join(...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| ... | Objects to join |

#### Usage

Unlike `table.join`, `table.shallow_join` does not expand table arguments, but appends them as elements directly:

```lua
local t = table.shallow_join({1, 2}, {3, 4})
-- Result: {{1, 2}, {3, 4}}
```

## table.shallow_join2

- Shallow join objects into the first table (without expanding sub-tables)

#### Function Prototype

::: tip API
```lua
table.shallow_join2(target: <table>, ...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| target | Target table |
| ... | Objects to join |

#### Usage

Similar to `table.shallow_join`, but the result is placed in the first argument:

```lua
local t = {}
table.shallow_join2(t, {1, 2}, {3, 4})
-- t = {{1, 2}, {3, 4}}
```

## table.reverse_unique

- Reverse deduplicate an array

#### Function Prototype

::: tip API
```lua
table.reverse_unique(array: <table>, barrier?: <function>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| array | Array to deduplicate |
| barrier | Optional. Barrier function |

#### Usage

Similar to `table.unique`, but iterates from the end, keeping the last occurrence of each element:

```lua
local t = table.reverse_unique({1, 2, 3, 2, 1})
-- Result: {3, 2, 1}
```

## table.to_array

- Collect data from an iterator into an array

#### Function Prototype

::: tip API
```lua
table.to_array(iterator: <function>, state: <any>, var: <any>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| iterator | Iterator function |
| state | Iterator state |
| var | Iterator variable |

#### Usage

```lua
local lines = table.to_array(io.lines("file.txt"))
```

Often used with [io.lines](/api/scripts/builtin-modules/io#io-lines) to convert a file line iterator into an array.

## table.inherit

- Inherit interfaces and create a new instance

#### Function Prototype

::: tip API
```lua
table.inherit(...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| ... | Classes or tables to inherit from |

#### Usage

Inherit all function interfaces from one or more classes and create a new instance:

```lua
local base = {foo = function () print("foo") end}
local instance = table.inherit(base)
instance.foo()  -- Output: foo
```

## table.wrap_lock

- Lock a table to prevent unwrapping

#### Function Prototype

::: tip API
```lua
table.wrap_lock(value: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| value | Table to lock |

#### Usage

A locked table will be kept as-is when calling `table.wrap` and `table.unwrap`:

```lua
local t = {1}
table.wrap_lock(t)
print(table.unwrap(t))  -- Result: t (will not be unwrapped to 1)
```

## table.wrap_unlock

- Unlock a table to allow unwrapping

#### Function Prototype

::: tip API
```lua
table.wrap_unlock(value: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| value | Table to unlock |

#### Usage

```lua
local t = {1}
table.wrap_lock(t)
table.wrap_unlock(t)
print(table.unwrap(t))  -- Result: 1
```

## table.pack

- Pack arguments into a table

#### Function Prototype

::: tip API
```lua
table.pack(...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| ... | Arguments to pack |

#### Usage

Polyfill of Lua 5.2 `table.pack`:

```lua
local t = table.pack(1, 2, 3)
-- t = {1, 2, 3, n = 3}
```

The reverse operation is [table.unpack](#table-unpack).

## table.unpack

- Unpack a table into multiple return values

#### Function Prototype

::: tip API
```lua
table.unpack(tbl: <table>, i?: <number>, j?: <number>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| tbl | Table to unpack |
| i | Optional. Start index, default is 1 |
| j | Optional. End index, default is #tbl |

#### Usage

Polyfill of Lua 5.2 `table.unpack`:

```lua
print(table.unpack({1, 2, 3}))  -- Output: 1   2   3
```
