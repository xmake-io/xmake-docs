
# vformat

- 格式化字符串，支持内置变量转义

此接口跟[format](/api/scripts/builtin-modules/format)接口类似，只是增加对内置变量的获取和转义支持。

```lua
local s = vformat("hello %s $(mode) $(arch) $(env PATH)", xmake)
```
