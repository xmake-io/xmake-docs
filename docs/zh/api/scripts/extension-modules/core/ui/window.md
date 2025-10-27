# core.ui.window

此模块提供带有边框、标题和面板支持的窗口。

::: tip 提示
使用此模块需要先导入：`import("core.ui.window")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`window` 模块继承自 `panel`，提供完整的窗口容器，包括：
- 边框和阴影支持
- 标题栏（居中）
- 用于子视图的内容面板
- Tab 键在可聚焦视图间导航

## window:new

- 创建新的窗口实例

#### 函数原型

::: tip API
```lua
window:new(name: <string>, bounds: <rect>, title?: <string>, shadow?: <boolean>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。窗口名称字符串 |
| bounds | 必需。窗口边界矩形 |
| title | 可选。窗口标题字符串（顶部居中显示） |
| shadow | 可选。显示阴影效果（`true` 或 `false`，默认 `false`） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| window | 返回窗口实例 |

#### 用法说明

创建带标题和阴影的窗口：

```lua
import("core.ui.window")
import("core.ui.rect")

local win = window:new("main", rect{10, 5, 60, 20}, "主窗口", true)
```

## window:frame

- 获取框架面板

#### 函数原型

::: tip API
```lua
window:frame()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| panel | 返回框架面板实例 |

#### 用法说明

访问框架面板以自定义其外观：

```lua
local frame = win:frame()
frame:background_set("cyan")
```

## window:panel

- 获取内容面板

#### 函数原型

::: tip API
```lua
window:panel()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| panel | 返回内容面板实例 |

#### 用法说明

访问内容面板以添加子视图：

```lua
local panel = win:panel()
panel:insert(label:new("label1", rect{1, 1, 20, 1}, "你好"))
```

## window:title

- 获取标题标签

#### 函数原型

::: tip API
```lua
window:title()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| label | 返回标题标签实例，如果未设置标题则为 `nil` |

#### 用法说明

访问并自定义标题标签：

```lua
local title = win:title()
if title then
    title:text_set("新标题")
    title:textattr_set("red bold")
end
```

## window:shadow

- 获取阴影视图

#### 函数原型

::: tip API
```lua
window:shadow()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| view | 返回阴影视图实例，如果未启用阴影则为 `nil` |

#### 用法说明

访问阴影视图：

```lua
local shadow = win:shadow()
if shadow then
    shadow:background_set("gray")
end
```

## window:border

- 获取边框组件

#### 函数原型

::: tip API
```lua
window:border()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| border | 返回边框实例 |

#### 用法说明

访问边框组件：

```lua
local border = win:border()
```

## window:on_event

- 处理 Tab 键导航的键盘事件

#### 函数原型

::: tip API
```lua
window:on_event(e: <event>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| e | 必需。事件对象 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 如果 Tab 键被处理返回 `true`，否则返回 `nil` |

#### 用法说明

窗口自动处理面板中可聚焦视图之间的 Tab 键导航：

```lua
-- Tab 键自动处理以导航焦点
```

## window:on_resize

- 处理窗口调整大小

#### 函数原型

::: tip API
```lua
window:on_resize()
```
:::

#### 参数说明

无参数

#### 返回值说明

无返回值

#### 用法说明

窗口调整大小时自动调用此方法。它会调整：
- 框架边界
- 阴影边界（如果启用）
- 边框边界
- 标题位置（居中）
- 面板边界（向内缩进 1 个单位）

以下是一个完整示例：

```lua
import("core.ui.window")
import("core.ui.label")
import("core.ui.rect")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建带标题和阴影的主窗口
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "主窗口", true)
    
    -- 向面板添加内容
    local panel = win:panel()
    panel:insert(label:new("label1", rect{2, 2, 30, 1}, "欢迎使用终端 UI！"))
    panel:insert(label:new("label2", rect{2, 4, 30, 1}, "这是一个窗口示例。"))
    panel:insert(label:new("label3", rect{2, 6, 30, 1}, "Tab 键在视图之间导航。"))
    
    self:insert(win)
    self._win = win
end

function demo:on_resize()
    self._win:bounds_set(rect{1, 1, self:width() - 1, self:height() - 1})
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

