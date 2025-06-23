
参考 [luarocks-build-xmake](https://github.com/xmake-io/luarocks-build-xmake)
如果你的 lua 模块含有 C 代码，你可以使用 [LuaNativeObjects](https://github.com/Neopallium/LuaNativeObjects) 去从 lua 代码生成 C 代码。
参考[例子](https://github.com/Freed-Wu/rime.nvim/blob/main/xmake.lua)。

```lua
add_rules("mode.debug", "mode.release")

target("rime")
    add_rules("lua.module", "lua.native-objects")
    add_files("*.nobj.lua")
    add_cflags("-Wno-int-conversion")
```
