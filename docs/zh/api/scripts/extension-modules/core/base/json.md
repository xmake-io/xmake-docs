
# core.base.json

xmake 提供了内置的 json 模块，基于 lua_cjson 实现，我们可以用它实现快速的在 json 和 lua table 直接相互操作。

我们可以通过 `import("core.base.json")` 直接导入使用。

这里也有一些例子：[Json Examples](https://github.com/xmake-io/xmake/blob/master/tests/modules/json/test.lua)

## json.decode

直接从字符串解码 json 获取 lua table.

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

::: tip 注意
如果里面有 null，可以用 `json.null` 来判断
:::

## json.encode

我们也可以直接对一个 lua table 进行编码。

```lua
local jsonstr = json.encode({1, "2", {a = 1}}
```

需要注意的是，如果需要编码 null，需要使用 `json.null`，例如

```lua
local jsonstr = json.encode({json.null, 1, "2", false, true})
```

## json.loadfile

直接加载 json 文件，并解析成 lua table。

```lua
local luatable = json.loadfile("/tmp/xxx.json")
```

## json.savefile

保存 lua table 到指定 json 文件。

```lua
json.savefile("/tmp/xxx.json", {1, {a = 1}})
```
