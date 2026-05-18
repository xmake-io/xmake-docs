# pairs

- Used to traverse the dictionary

#### Function Prototype

::: tip API
```lua
pairs(t: <table>, f: <function>, ...)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| t | Table to traverse |
| f | Function to process values (optional) |
| ... | Variable arguments for function (optional) |

#### Usage

This is lua's native built-in api. In xmake, it has been extended in its original behavior to simplify some of the daily lua traversal code.

First look at the default native notation:

```lua
local t = {a = "a", b = "b", c = "c", d = "d", e = "e", f = "f"}

for key, val in pairs(t) do
    print("%s: %s", key, val)
end
```

This is sufficient for normal traversal operations, but if we get the uppercase for each of the elements it traverses, we can write:

```lua
for key, val in pairs(t, function (v) return v:upper() end) do
     print("%s: %s", key, val)
end
```

Even pass in some parameters to the second `function`, for example:

```lua
for key, val in pairs(t, function (v, a, b) return v:upper() .. a .. b end, "a", "b") do
     print("%s: %s", key, val)
end
```

::: tip NOTE
Since v3.0.9, xmake's built-in Lua runtime has been upgraded to 5.5. To preserve the familiar semantics where the loop body can safely reassign the loop key, xmake's sandbox `pairs` keeps the iteration state in an internal closure, so the following idiom keeps working without changes:

```lua
for k, v in pairs(t) do
    k = k:gsub("_", "-")
    do_something(k, v)
end
```
:::
