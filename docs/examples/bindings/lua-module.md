
Refer [luarocks-build-xmake](https://github.com/xmake-io/luarocks-build-xmake)

If your lua module contains C code, you can use [LuaNativeObjects](https://github.com/Neopallium/LuaNativeObjects) to generate C code from lua code.
Refer [example](https://github.com/Freed-Wu/rime.nvim/blob/main/xmake.lua).

```lua
add_rules("mode.debug", "mode.release")

target("rime")
    add_rules("lua.module", "lua.native-objects")
    add_files("*.nobj.lua")
    add_cflags("-Wno-int-conversion")
```
