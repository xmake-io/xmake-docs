# vformat

- Formatting strings, support for built-in variable escaping

This interface is followed by [format](/api/scripts/builtin-modules/format) interface is similar, but adds support for the acquisition and escaping of built-in variables.

```lua
local s = vformat("hello %s $(mode) $(arch) $(env PATH)", xmake)
```
