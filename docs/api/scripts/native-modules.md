
We know that in xmake, you can import some lua modules through the import interface for use in the script domain. However, if the operation of some modules is time-consuming, then lua implementation is not an ideal choice.
Therefore, in the new version, we have added support for the native lua module, which can be implemented through native to achieve speed-up optimization. Moreover, importing and using the module is as simple as the lua module.

When using native modules, xmake will perform two stages of compilation. First, it will automatically compile the native module, and then import the module into lua as a library or binary. For users, they only need to call import to import.

## Define dynamic library module

The advantage of the dynamic library module is that it not only achieves performance acceleration through native, but also avoids the creation of additional sub-processes for each call, making it more lightweight and further improving the speed.

We can first define a dynamic library module, which fully supports all C APIs of Lua, so we can also directly introduce some third-party open source Lua native modules for use.

Here we also have a complete example of importing the lua-cjson module for reference: [native_module_cjson](https://github.com/xmake-io/xmake/tree/master/tests/projects/other/native_module_cjson)

First, we first implement the shared native code, so the interface is exported through the lua API.

```js [.vitepress/config.js]
export default {
  // site-level options
  title: 'VitePress',
  description: 'Just playing around.',

  themeConfig: {
    // theme-level options
  }
}
```


```c++ [./modules/foo/foo.c]
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
     //Collect add and sub
     static const luaL_Reg funcs[] = {
         {"add", c_add},
         {"sub", c_sub},
         {NULL, NULL}
     };
     lua_newtable(lua);
     // pass function list
     luaL_setfuncs(lua, funcs, 0);
     return 1;
}
```

Notice here that we have included an interface header file of `xmi.h`. In fact, we can also directly introduce `lua.h` and `luaconf.h`. The effect is the same, but it will provide better cross-platform performance. , it will automatically handle the differences between lua/luajit and versions internally.

Then, we configure `add_rules("modules.shared")` to compile as a shared native module without introducing any other dependencies.

Even Lua dependencies do not need to be introduced, because the xmake main program has exported all Lua interfaces and can be used directly, so the entire module is very lightweight.


```lua [./modules/foo/xmake.lua]
add_rules("mode.debug", "mode.release")

target("foo")
     -- Specify the target as the library lua module
     add_rules("module.shared")
     add_files("foo.c")
```

## Define binary module

In addition to the dynamic library module, we also provide the import of another binary module. It is actually an executable file. Every time the module interface is called, a child process will be called.

So what are the benefits of it? Although it is not as efficient as the dynamic library module, its module implementation is simpler. There is no need to call the lua API. It only needs to process the parameter data and output the return value through stdout.

In addition, compared to binary distribution, it is distributed through source code, so it also solves the cross-platform problem.

Whether to use a dynamic library module or a binary module depends on your needs. If you want a simple implementation, you can consider a binary module. If you want to be efficient, use a dynamic library module.

In addition, if you need to speed up through parallel execution, you can also use binary modules.

```c++ [./modules/bar/bar.cpp]
#include <stdio.h>
#include <stdlib.h>
#include <cstdlib>

int main(int argc, char** argv) {
     int a = atoi(argv[1]);
     int b = atoi(argv[2]);
     printf("%d", a + b);
     return 0;
}
```

```lua [./modules/bar/xmake.lua]
add_rules("mode.debug", "mode.release")

target("add")
     -- Specify the target as a binary lua module
     add_rules("module.binary")
     add_files("bar.cpp")
```

## Import native module

For module import, we only need to call import, which is exactly the same as importing lua modules.

```lua [./xmake.lua]
add_rules("mode.debug", "mode.release")
--Add native modules in the ./modules directory
add_moduledirs("modules")

target("test")
     set_kind("phony")
     on_load(function(target)
         import("foo", {always_build = true})
         import("bar")
         print("foo: 1 + 1 = %s", foo.add(1, 1))
         print("foo: 1 - 1 = %s", foo.sub(1, 1))
         print("bar: 1 + 1 = %s", bar.add(1, 1))
     end)
```

Since the construction of the plug-in module is completely independent from the main project, the native module will only be built once. If you want to trigger incremental plug-in compilation, you need to configure `always_build = true`, so that xmake will detect it every time Check whether the plug-in code has been changed. If so, the plug-in will be automatically incrementally built.

The first execution effect is as follows:

```bash
ruki-2:native_module ruki$ xmake
[50%]: cache compiling.release src/foo.c
[50%]: cache compiling.release src/bar.c
[75%]: linking.release libmodule_foo.dylib
[75%]: linking.release module_bar
[100%]: build ok, spent 1.296s
foo: 1 + 1 = 2
foo: 1 - 1 = 0
bar: 1 + 1 = 2
[100%]: build ok, spent 0.447s
```

When executed for the second time, the plug-in will not be built and the module can be used directly:

```bash
ruki-2:native_module ruki$ xmake
foo: 1 + 1 = 2
foo: 1 - 1 = 0
bar: 1 + 1 = 2
[100%]: build ok, spent 0.447s
```

## Use as codegen

Through the new native module feature, we can also use it to implement auto-codegen, and then continue to execute the subsequent compilation process based on the automatically generated code.

There is also a complete example here for reference: [autogen_shared_module](https://github.com/xmake-io/xmake/tree/master/tests/projects/other/autogen/autogen_shared_module).
