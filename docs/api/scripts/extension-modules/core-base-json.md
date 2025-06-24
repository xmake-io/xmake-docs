
# core.base.json

Xmake provides a built-in json module, based on the implementation of lua_cjson, we can use it to quickly and directly interoperate between json and lua table.

We can use `import("core.base.json")` for direct import and use.

There are also some examples here: [Json Examples](https://github.com/xmake-io/xmake/blob/master/tests/modules/json/test.lua)

## json.decode

- Get the lua table directly from the string decoding json

```lua
import("core.base.json")
local luatable = json.decode('[1,"2", {"a":1, "b":true}]')
print(luatable)
```

```
{
    1.0,
    "2",
    {
      b = true,
      a = 1.0
    }
  }
```

::: tip NOTE
If there is null in it, you can use `json.null` to judge
:::

## json.encode

- Encode a lua table

```lua
local jsonstr = json.encode({1, "2", {a = 1}})
```

It should be noted that if you need to encode null, you need to use `json.null`, for example

```lua
local jsonstr = json.encode({json.null, 1, "2", false, true})
```

## json.loadfile

- Load the json file directly and parse it into a lua table

```lua
local luatable = json.loadfile("/tmp/xxx.json")
```

## json.savefile

- Save the lua table to the specified json file

```lua
json.savefile("/tmp/xxx.json", {1, {a = 1}})
```
