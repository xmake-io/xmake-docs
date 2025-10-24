# ipairs

- for traversing arrays

#### Function Prototype

::: tip API
```lua
ipairs(t: <table>, f: <function>, ...)
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
for idx, val in ipairs({"a", "b", "c", "d", "e", "f"}) do
     print("%d %s", idx, val)
end
```

The extension is written like the [pairs](/api/scripts/builtin-modules/pairs) interface, for example:

```lua
for idx, val in ipairs({"a", "b", "c", "d", "e", "f"}, function (v) return v:upper() end) do
     print("%d %s", idx, val)
end

for idx, val in ipairs({"a", "b", "c", "d", "e", "f"}, function (v, a, b) return v:upper() .. a .. b end, "a", "b") do
     print("%d %s", idx, val)
end
```

This simplifies the logic of the `for` block code. For example, if I want to traverse the specified directory and get the file name, but not including the path, I can simplify the writing by this extension:

```lua
for _, filename in ipairs(os.dirs("*"), path.filename) do
    -- ...
end
```
