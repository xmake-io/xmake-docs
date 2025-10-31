# core.ui.textdialog

此模块为终端 UI 系统提供带文本区域的对话框。

::: tip 提示
使用此模块需要先导入：`import("core.ui.textdialog")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`textdialog` 模块继承自 `dialog`，提供带文本区域的对话框。它包含一个文本区域（textarea）和可选的滚动条支持，是 `inputdialog` 和 `boxdialog` 等对话框的基础。

## textdialog:new

- 创建新的文本对话框实例

#### 函数原型

::: tip API
```lua
textdialog:new(name: <string>, bounds: <rect>, title?: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。对话框名称字符串 |
| bounds | 必需。对话框边界矩形 |
| title | 可选。对话框标题字符串 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| textdialog | 返回文本对话框实例 |

#### 用法说明

创建文本对话框：

```lua
import("core.ui.textdialog")
import("core.ui.rect")

local dialog = textdialog:new("text", rect{10, 5, 50, 20}, "文本对话框")
```

## textdialog:text

- 获取文本区域组件

#### 函数原型

::: tip API
```lua
textdialog:text()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| textarea | 返回文本区域实例 |

#### 用法说明

访问文本区域以设置或获取文本内容：

```lua
local textarea = dialog:text()
textarea:text_set("这是文本内容")
```

## textdialog:scrollbar

- 获取滚动条组件

#### 函数原型

::: tip API
```lua
textdialog:scrollbar()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| scrollbar | 返回滚动条实例 |

#### 用法说明

访问滚动条组件：

```lua
local scrollbar = dialog:scrollbar()
scrollbar:show(true)
```

## textdialog:option_set

- 设置对话框选项

#### 函数原型

::: tip API
```lua
textdialog:option_set(name: <string>, value: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。选项名称，支持：`"scrollable"` |
| value | 必需。选项值 |

#### 返回值说明

无返回值

#### 用法说明

启用或禁用滚动条：

```lua
-- 启用滚动条
dialog:option_set("scrollable", true)

-- 禁用滚动条
dialog:option_set("scrollable", false)
```

## textdialog:on_event

- 处理对话框事件

#### 函数原型

::: tip API
```lua
textdialog:on_event(e: <event>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| e | 必需。事件对象 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 如果事件已处理返回 `true`，否则返回 `false` |

#### 用法说明

对话框会自动将键盘事件传递给文本区域以支持滚动。

以下是一个完整的文本对话框示例：

```lua
import("core.ui.textdialog")
import("core.ui.rect")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建文本对话框
    local dialog = textdialog:new("text", rect{10, 5, 60, 20}, "文本对话框")
    
    -- 设置文本内容
    dialog:text():text_set("这是一个文本对话框示例。\n您可以显示多行文本内容。\n当文本内容超出显示区域时，可以启用滚动功能。")
    
    -- 启用滚动条
    dialog:option_set("scrollable", true)
    
    -- 添加按钮
    dialog:button_add("ok", "< 确定 >", function (v) self:quit() end)
    
    self:insert(dialog)
    self._dialog = dialog
end

function demo:on_resize()
    if self._dialog then
        self._dialog:bounds_set(rect{10, 5, self:width() - 20, self:height() - 10})
    end
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

