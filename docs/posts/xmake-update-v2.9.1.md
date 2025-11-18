---
title: Xmake v2.9.1 released, Add native lua modules support
tags: [xmake, lua, C/C++, package, cosmocc]
date: 2024-04-22
author: Ruki
outline: deep
---

## Introduction of new features

In the new version, we have added native tool chain support for Hongmeng system and implemented a new native Lua module import support. In addition, we have also made a lot of optimizations to the build speed, and the effect is very obvious.

### Add Hongmeng SDK tool chain support

We have added native toolchain compilation support for the Hongmeng OS platform:

```bash
$ xmake f -p harmony
```

xmake will also automatically detect the default SDK path. Of course, we can also specify the Harmony SDK path.

```bash
$ xmake f -p Harmony --sdk=/Users/ruki/Library/Huawei/Sdk/...
```

### Add native module support

We know that in xmake, you can import some lua modules through the import interface for use in the script domain. However, if the operation of some modules is time-consuming, then lua implementation is not an ideal choice.
Therefore, in the new version, we have added support for the native lua module, which can be implemented through native to achieve speed-up optimization. Moreover, importing and using the module is as simple as the lua module.

When using native modules, xmake will perform two stages of compilation. First, it will automatically compile the native module, and then import the module into lua as a library or binary. For users, they only need to call import to import.

#### Define dynamic library module

The advantage of the dynamic library module is that it not only achieves performance acceleration through native, but also avoids the creation of additional sub-processes for each call, making it more lightweight and further improving the speed.

We can first define a dynamic library module, which fully supports all C APIs of Lua, so we can also directly introduce some third-party open source Lua native modules for use.

Here we also have a complete example of importing the lua-cjson module for reference: [native_module_cjson](https://github.com/xmake-io/xmake/tree/master/tests/projects/other/native_module_cjson)

First, we first implement the shared native code, so the interface is exported through the lua API.

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

./modules/foo/xmake.lua

```lua
add_rules("mode.debug", "mode.release")

target("foo")
     -- Specify the target as the library lua module
     add_rules("module.shared")
     add_files("foo.c")
```






#### Define binary module

In addition to the dynamic library module, we also provide the import of another binary module. It is actually an executable file. Every time the module interface is called, a child process will be called.

So what are the benefits of it? Although it is not as efficient as the dynamic library module, its module implementation is simpler. There is no need to call the lua API. It only needs to process the parameter data and output the return value through stdout.

In addition, compared to binary distribution, it is distributed through source code, so it also solves the cross-platform problem.

Whether to use a dynamic library module or a binary module depends on your needs. If you want a simple implementation, you can consider a binary module. If you want to be efficient, use a dynamic library module.

In addition, if you need to speed up through parallel execution, you can also use binary modules.

./modules/bar/bar.cpp

```c++
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

./modules/bar/xmake.lua

```lua
add_rules("mode.debug", "mode.release")

target("add")
     -- Specify the target as a binary lua module
     add_rules("module.binary")
     add_files("bar.cpp")
```

#### Import native module

For module import, we only need to call import, which is exactly the same as importing lua modules.

./xmake.lua

```lua
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

#### Use as codegen

Through the new native module feature, we can also use it to implement auto-codegen, and then continue to execute the subsequent compilation process based on the automatically generated code.

There is also a complete example here for reference: [autogen_shared_module](https://github.com/xmake-io/xmake/tree/master/tests/projects/other/autogen_shared_module).

### Add signal module

In the new version, we have also added a new signal registration interface. We can register signal processing functions such as SIGINT at the Lua layer to customize the response logic.

#### signal.register

This interface is used to register signal processors. Currently, it only supports the processing of SIGINT signals. It also supports mainstream platforms such as windows.

```lua
import("core.base.signal")

function main()
     signal.register(signal.SIGINT, function (signo)
         print("signal.SIGINT(%d)", signo)
     end)
     io.read()
end
```

This is useful when some sub-processes internally shield SIGINT, causing them to freeze and not exit. Even if the user presses `Ctrl+C` to exit the xmake process, it does not exit.
We can force it out in this way.

```lua
import("core.base.process")
import("core.base.signal")

function main()
     local proc
     signal.register(signal.SIGINT, function (signo)
         print("sigint")
         if proc then
             proc:kill()
         end
     end)
     proc = process.open("./trap.sh")
     if proc then
         proc:wait()
         proc:close()
     end
end
```

For the background of this issue, please refer to: [#4889](https://github.com/xmake-io/xmake/issues/4889)

#### signal.ignore

We can also ignore the processing of blocking a certain signal through the `signal.ignore` interface.

```lua
signal.ignore(signal.SIGINT)
```

#### signal.reset

We can also clear the processing function of a certain signal and fall back to the default processing logic.

```lua
signal.reset(signal.SIGINT)
```

### Add support for cppfront/h2

We've also improved support for the latest version of cppfront. The new version of cppfront added new .h2 header files, so we also added support for it.

Thanks for the contribution from @shaoxie1986

```lua
add_rules("mode.debug", "mode.release")

add_requires("cppfront")

target("test")
     add_rules("cppfront")
     set_kind("binary")
     add_files("src/*.cpp2")
     add_files("src/*.h2")
     add_packages("cppfront")
```

### Improve build speed

In the new version, we have also fixed an issue related to parallel builds. After restructuring the scheduler, the build speed has been significantly improved. Especially in incremental compilation scenarios where cpp file compilation takes very slow time, the effect is more obvious.

For relevant background, see: [#4928](https://github.com/xmake-io/xmake/issues/4928).

## Changelog

### New features

* [#4874](https://github.com/xmake-io/xmake/pull/4874): Add Harmony SDK support
* [#4889](https://github.com/xmake-io/xmake/issues/4889): Add signal module to register signal handler in lua
* [#4925](https://github.com/xmake-io/xmake/issues/4925): Add native modules support
* [#4938](https://github.com/xmake-io/xmake/issues/4938): Support for cppfront/h2

### Changes

* Improve packages to support for clang-cl
* [#4893](https://github.com/xmake-io/xmake/issues/4893): Improve rc includes deps
* [#4928](https://github.com/xmake-io/xmake/issues/4928): Improve to build and link speed
* [#4931](https://github.com/xmake-io/xmake/pull/4931): Update pdcurses
* [#4973](https://github.com/xmake-io/xmake/issues/4973): Improve to select script

### Bugs fixed

* [#4882](https://github.com/xmake-io/xmake/issues/4882): Fix install deps with --group
* [#4877](https://github.com/xmake-io/xmake/issues/4877): Fix compile error for xpack with unity build
* [#4887](https://github.com/xmake-io/xmake/issues/4887): Fix object deps
