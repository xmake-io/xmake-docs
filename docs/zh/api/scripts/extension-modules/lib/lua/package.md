
# lib.lua.package

此模块提供访问原生 Lua 包接口，用于加载动态库和 Lua 模块。

::: tip 提示
使用此模块需要先导入：`import("lib.lua.package")`
:::

出于安全考虑，xmake 默认限制访问原生 Lua 模块和接口。此模块按需提供对 Lua 所提供 API 的访问。

## package.loadlib

- 从动态库加载 Lua 模块

#### 函数原型

::: tip API
```lua
package.loadlib(libfile: <string>, symbol: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| libfile | 必需。动态库文件路径（例如：foo.dll, libfoo.so, libfoo.dylib） |
| symbol | 必需。导出符号名称（例如：luaopen_xxx） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| function | 返回一个初始化模块的函数 |

#### 用法说明

此功能通常用于高性能场景，需要从原生动态库加载 Lua 模块。

```lua
import("lib.lua.package")

-- 从动态库加载模块
local script = package.loadlib("/xxx/libfoo.so", "luaopen_mymodule")

-- 初始化并使用模块
local mymodule = script()
mymodule.hello()
```


