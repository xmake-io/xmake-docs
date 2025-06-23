
Refer [example](https://github.com/tonyfettes/coc-rime/blob/master/xmake.lua).

```lua
add_rules("mode.debug", "mode.release")

add_requires("node-addon-api")

target("rime")
    set_languages("cxx17")
    add_rules("nodejs.module")
    add_packages("node-addon-api")
    add_files("*.cc")
```
