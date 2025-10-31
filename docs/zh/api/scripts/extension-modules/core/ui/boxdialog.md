# core.ui.boxdialog

此模块为终端 UI 系统提供带内容框的对话框。

::: tip 提示
使用此模块需要先导入：`import("core.ui.boxdialog")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`boxdialog` 模块继承自 `textdialog`，提供带内容框的对话框。它包含一个可调整高度的文本区域和一个内容框（用于放置子视图），是 `choicedialog` 和 `mconfdialog` 等复杂对话框的基础。

## boxdialog:new

- 创建新的框对话框实例

#### 函数原型

::: tip API
```lua
boxdialog:new(name: <string>, bounds: <rect>, title: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。对话框名称字符串 |
| bounds | 必需。对话框边界矩形 |
| title | 必需。对话框标题字符串 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boxdialog | 返回框对话框实例 |

#### 用法说明

创建框对话框：

```lua
import("core.ui.boxdialog")
import("core.ui.rect")

local dialog = boxdialog:new("dialog", rect{1, 1, 80, 25}, "主对话框")
```

## boxdialog:box

- 获取内容框窗口

#### 函数原型

::: tip API
```lua
boxdialog:box()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| window | 返回内容框窗口实例 |

#### 用法说明

访问内容框以添加子视图：

```lua
local box = dialog:box()
local panel = box:panel()
-- 在 panel 中添加子视图
```

## boxdialog:on_resize

- 处理对话框大小调整

#### 函数原型

::: tip API
```lua
boxdialog:on_resize()
```
:::

#### 参数说明

无参数

#### 返回值说明

无返回值

#### 用法说明

当对话框大小改变时自动调用此方法。它会重新调整文本区域和内容框的布局。

以下是一个完整的框对话框示例：

```lua
import("core.ui.boxdialog")
import("core.ui.rect")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建框对话框
    local dialog = boxdialog:new("dialog.main", rect{1, 1, self:width() - 1, self:height() - 1}, "主对话框")
    
    -- 设置提示文本
    dialog:text():text_set("使用方向键导航或按快捷键空格键进行选择")
    
    -- 添加按钮
    dialog:button_add("ok", "< 确定 >", function (v) self:quit() end)
    dialog:button_add("cancel", "< 取消 >", "cm_quit")
    
    self:insert(dialog)
    self._dialog = dialog
end

function demo:on_resize()
    self._dialog:bounds_set(rect{1, 1, self:width() - 1, self:height() - 1})
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

