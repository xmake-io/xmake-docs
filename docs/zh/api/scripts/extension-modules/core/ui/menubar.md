# core.ui.menubar

此模块为终端 UI 系统提供菜单栏组件。

::: tip 提示
使用此模块需要先导入：`import("core.ui.menubar")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`menubar` 模块继承自 `panel`，提供菜单栏显示。

## menubar:new

- 创建新的菜单栏实例

#### 函数原型

::: tip API
```lua
menubar:new(name: <string>, bounds: <rect>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。菜单栏名称字符串 |
| bounds | 必需。菜单栏边界矩形 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| menubar | 返回菜单栏实例 |

#### 用法说明

创建菜单栏：

```lua
import("core.ui.menubar")
import("core.ui.rect")

local menubar = menubar:new("menubar", rect{1, 1, 80, 1})
```

## menubar:title

- 获取标题标签

#### 函数原型

::: tip API
```lua
menubar:title()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| label | 返回标题标签实例 |

#### 用法说明

访问并自定义标题标签：

```lua
local title = menubar:title()
title:text_set("My Application")
title:textattr_set("red bold")
```

以下是一个完整的菜单栏使用示例：

```lua
import("core.ui.menubar")
import("core.ui.window")
import("core.ui.rect")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建菜单栏
    local menubar = menubar:new("menubar", rect{1, 1, self:width() - 1, 1})
    menubar:title():text_set("Xmake Demo Application")
    menubar:title():textattr_set("red bold")
    
    -- 创建主窗口
    local win = window:new("main", rect{1, 2, self:width() - 1, self:height() - 2}, "主窗口")
    
    -- 添加到应用程序
    self:insert(menubar)
    self:insert(win)
    
    self._menubar = menubar
    self._win = win
end

function demo:on_resize()
    self._menubar:bounds_set(rect{1, 1, self:width() - 1, 1})
    self._win:bounds_set(rect{1, 2, self:width() - 1, self:height() - 2})
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

