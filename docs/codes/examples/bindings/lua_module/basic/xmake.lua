add_rules("mode.debug", "mode.release")

target("rime")
    add_rules("lua.module", "lua.native-objects")
    add_files("src/*.nobj.lua")
    add_cflags("-Wno-int-conversion")
