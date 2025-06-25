
# table

Table belongs to the module provided by Lua native. For the native interface, you can refer to: [lua official document](https://www.lua.org/manual/5.1/manual.html#5.5)

It has been extended in xmake to add some extension interfaces:

## table.join

- Merge multiple tables and return

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

## table.join2

- Combine multiple tables into the first table

Similar to [table.join](#table-join), the only difference is that the result of the merge is placed in the first argument, for example:

```lua
local t = {0, 9}
table.join2(t, {1, 2, 3})
```

The result is: `t = {0, 9, 1, 2, 3}`

## table.unique

- Deduplicate the contents of the table

To de-table elements, generally used in array tables, for example:

```lua
local newtable = table.unique({1, 1, 2, 3, 4, 4, 5})
```

The result is: `{1, 2, 3, 4, 5}`

## table.slice

- Get the slice of the table

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

```lua
if table.contains(t, 1, 2, 3) then
     - ...
end
```

As long as the table contains any value from 1, 2, 3, it returns true

## table.orderkeys

- Get an ordered list of keys

The order of the key list returned by `table.keys(t)` is random. If you want to get an ordered key list, you can use this interface.
