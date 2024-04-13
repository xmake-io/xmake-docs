
Native modules can be used in the build workflow.

### Native module

xmake will do dual-stage build if any native-module added. Native-modules can be imported in script-scope after first stage's build.

#### Import shared module

./modules/foo/foo.c

```c++
#include <xmi.h>

static int c_add(lua_State* lua) {
    int a = lua_tointeger(lua, 1);
    int b = lua_tointeger(lua, 2);
    lua_pushinteger(lua, a + b);
    return 1;
}

static int c_sub(lua_State* lua) {
    int a = lua_tointeger(lua, 1);
    int b = lua_tointeger(lua, 2);
    lua_pushinteger(lua, a - b);
    return 1;
}

int luaopen(foo, lua_State* lua) {
    // Collect 'add' and 'sub'
    static const luaL_Reg funcs[] = {
        {"add", c_add},
        {"sub", c_sub},
        {NULL, NULL}
    };
    lua_newtable(lua);
    // send function table to lua runtime
    luaL_setfuncs(lua, funcs, 0);
    return 1;
}
```

./modules/foo/xmake.lua

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    -- set this target as a 'shared' lua module
    add_rules("module.shared")
    add_files("foo.c")
```

#### Import binary module

./modules/bar/bar.cpp

```c++
#include <stdio.h>
#include <stdlib.h>
#include <cstdlib>

int main(int argc, char** argv) {
    int a = atoi(argv[1]);
    int b = atoi(argv[2]);
    printf("%d", 
#ifdef ADD
        a + b
#else
        a - b
#endif
    );
    return 0;
}
```

./modules/bar/xmake.lua

```lua
add_rules("mode.debug", "mode.release")

target("add")
    -- set this target as a 'binary' lua module
    add_rules("module.binary")
    add_files("bar.cpp")
    add_defines("ADD")

target("sub")
    add_rules("module.binary")
    add_files("bar.cpp")
```

./xmake.lua

```lua
add_rules("mode.debug", "mode.release")
-- include all targets in ./modules as native modules
add_moduledirs("modules")

target("test")
set_kind("phony")
on_load(function(target)
    local foo = import("foo", {
        -- Build this module everytime?
        always_build = true
    })
    local bar = import("bar", {
        always_build = true
    })
    print("foo: 1 + 1 = %s", foo.add(1, 1))
    print("foo: 1 - 1 = %s", foo.sub(1, 1))
    print("bar: 1 + 1 = %s", bar.add(1, 1))
    print("bar: 1 - 1 = %s", bar.sub(1, 1))
end)

```