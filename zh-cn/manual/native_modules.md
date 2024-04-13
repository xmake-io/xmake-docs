
在自定义脚本、插件脚本、任务脚本、平台扩展、模板扩展等脚本代码中使用，也就是在类似下面的代码块中，可以使用原生模块完成复杂的构建逻辑。

### 原生模块

使用原生模块时，xmake会进行两段编译，先编译原生模块，后将模块导入lua作为库或二进制。

#### 导入库模块

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
    // 收集add和sub
    static const luaL_Reg funcs[] = {
        {"add", c_add},
        {"sub", c_sub},
        {NULL, NULL}
    };
    lua_newtable(lua);
    // 传递函数列表
    luaL_setfuncs(lua, funcs, 0);
    return 1;
}
```

./modules/foo/xmake.lua

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    -- 指定目标为库lua模块
    add_rules("module.shared")
    add_files("foo.c")
```

#### 导入二进制模块

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
    -- 指定目标为二进制lua模块
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
-- 添加./modules目录内原生模块
add_moduledirs("modules")

target("test")
set_kind("phony")
on_load(function(target)
    local foo = import("foo", {
        -- 是否每次构建时会尝试构建模块
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