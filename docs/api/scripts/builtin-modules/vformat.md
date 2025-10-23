# vformat

- Formatting strings, support for built-in variable escaping

#### Function Prototype

```lua
vformat(formatstring: <string>, ...)
```

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| formatstring | Format string |
| ... | Variable arguments for formatting |

#### Usage

This interface is followed by [format](/api/scripts/builtin-modules/format) interface is similar, but adds support for the acquisition and escaping of built-in variables.

```lua
local s = vformat("hello %s $(mode) $(arch) $(env PATH)", xmake)
```
