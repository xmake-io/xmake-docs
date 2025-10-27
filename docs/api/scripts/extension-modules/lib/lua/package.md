
# lib.lua.package

This module provides access to native Lua package interfaces for loading dynamic libraries and Lua modules.

::: tip TIP
To use this module, you need to import it first: `import("lib.lua.package")`
:::

Xmake restricts access to native Lua modules and interfaces by default for safety reasons. This module provides access to some of the APIs provided by Lua when needed.

## package.loadlib

- Load Lua module from dynamic library

#### Function Prototype

::: tip API
```lua
package.loadlib(libfile: <string>, symbol: <string>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| libfile | Required. The dynamic library file path (e.g., foo.dll, libfoo.so, libfoo.dylib) |
| symbol | Required. The export symbol name (e.g., luaopen_xxx) |

#### Return Value

| Type | Description |
|------|-------------|
| function | Returns a function to initialize the module |

#### Usage

This is typically used in high-performance scenarios where you need to load Lua modules from native dynamic libraries.

```lua
import("lib.lua.package")

-- Load the module from dynamic library
local script = package.loadlib("/xxx/libfoo.so", "luaopen_mymodule")

-- Initialize and use the module
local mymodule = script()
mymodule.hello()
```


