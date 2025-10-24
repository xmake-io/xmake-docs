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
