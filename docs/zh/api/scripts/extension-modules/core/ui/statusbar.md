# core.ui.statusbar

此模块为终端 UI 系统提供状态栏组件。

::: tip 提示
使用此模块需要先导入：`import("core.ui.statusbar")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`statusbar` 模块继承自 `panel`，提供状态栏显示功能。

## statusbar:new

- 创建新的状态栏实例

#### 函数原型

::: tip API
```lua
statusbar:new(name: <string>, bounds: <rect>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。状态栏名称字符串 |
| bounds | 必需。状态栏边界矩形 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| statusbar | 返回状态栏实例 |

#### 用法说明

创建状态栏：

```lua
import("core.ui.statusbar")
import("core.ui.rect")

local statusbar = statusbar:new("status", rect{1, 25, 80, 1})
```

## statusbar:info

- 获取信息标签

#### 函数原型

::: tip API
```lua
statusbar:info()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| label | 返回信息标签实例 |

#### 用法说明

访问并自定义信息标签：

```lua
local info = statusbar:info()
info:text_set("就绪")
info:textattr_set("blue bold")
```

以下是一个完整的状态栏使用示例：

```lua
import("core.ui.statusbar")
import("core.ui.window")
import("core.ui.rect")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建状态栏
    local statusbar = statusbar:new("status", rect{1, self:height() - 1, self:width() - 1, 1})
    statusbar:info():text_set("就绪")
    statusbar:info():textattr_set("blue bold")
    
    -- 创建主窗口
    local win = window:new("main", rect{1, 2, self:width() - 1, self:height() - 3}, "主窗口")
    
    -- 添加到应用程序
    self:insert(win)
    self:insert(statusbar)
    
    self._statusbar = statusbar
    self._win = win
end

function demo:on_resize()
    self._win:bounds_set(rect{1, 2, self:width() - 1, self:height() - 3})
    self._statusbar:bounds_set(rect{1, self:height() - 1, self:width() - 1, 1})
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

