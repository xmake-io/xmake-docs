# core.ui.dialog

此模块为终端 UI 系统提供基础对话框类。

::: tip 提示
使用此模块需要先导入：`import("core.ui.dialog")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`dialog` 模块是所有对话框组件的基础类。它继承自窗口类，并提供按钮管理功能，用于创建交互式对话框。

## dialog:new

- 创建新的对话框实例

#### 函数原型

::: tip API
```lua
dialog:new(name: <string>, bounds: <rect>, title: <string>)
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
| dialog | 返回对话框实例 |

#### 用法说明

创建一个具有名称、边界和标题的对话框：

```lua
import("core.ui.dialog")
import("core.ui.rect")

local dialog = dialog:new("mydialog", rect{1, 1, 50, 20}, "我的对话框")
```

## dialog:buttons

- 获取按钮面板

#### 函数原型

::: tip API
```lua
dialog:buttons()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| panel | 返回按钮面板 |

#### 用法说明

访问按钮面板以管理对话框按钮：

```lua
local buttons = dialog:buttons()
```

## dialog:button

- 根据名称获取特定按钮

#### 函数原型

::: tip API
```lua
dialog:button(name: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。按钮名称字符串 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| button | 返回按钮实例，未找到则返回 nil |

#### 用法说明

从对话框获取特定按钮：

```lua
local quit_btn = dialog:button("quit")
```

## dialog:button_add

- 向对话框添加按钮

#### 函数原型

::: tip API
```lua
dialog:button_add(name: <string>, text: <string>, command: <string|function>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。按钮名称字符串 |
| text | 必需。按钮显示文本 |
| command | 必需。单击时执行的命令字符串或函数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| button | 返回创建的按钮实例 |

#### 用法说明

向对话框添加按钮：

```lua
-- 添加带字符串命令的按钮
dialog:button_add("quit", "< 退出 >", "cm_quit")

-- 添加带函数回调的按钮
dialog:button_add("save", "< 保存 >", function (v) 
    print("保存被点击")
    dialog:show(false)
end)
```

## dialog:button_select

- 通过名称选择按钮

#### 函数原型

::: tip API
```lua
dialog:button_select(name: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。要选择的按钮名称 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| dialog | 返回对话框实例 |

#### 用法说明

以编程方式选择按钮：

```lua
dialog:button_select("quit")
```

## dialog:show

- 显示或隐藏对话框

#### 函数原型

::: tip API
```lua
dialog:show(visible: <boolean>, opt?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| visible | 必需。显示或隐藏对话框 |
| opt | 可选。选项表格，支持：`{focused = true}` |

#### 返回值说明

无返回值

#### 用法说明

显示或隐藏对话框：

```lua
dialog:show(true)  -- 显示对话框
dialog:show(false)  -- 隐藏对话框

-- 带焦点显示
dialog:show(true, {focused = true})
```

## dialog:quit

- 关闭对话框

#### 函数原型

::: tip API
```lua
dialog:quit()
```
:::

#### 参数说明

无参数

#### 返回值说明

无返回值

#### 用法说明

关闭并从其父容器中移除对话框：

```lua
dialog:quit()
```

## dialog:on_event

- 处理对话框事件

#### 函数原型

::: tip API
```lua
dialog:on_event(e: <event>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| e | 必需。事件对象 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 事件被处理返回 true，否则返回 false |

#### 用法说明

对话框自动处理 Esc 键关闭。重写此方法以进行自定义事件处理：

```lua
function my_dialog:on_event(e)
    if e.type == event.ev_keyboard and e.key_name == "Enter" then
        self:quit()
        return true
    end
    return dialog.on_event(self, e)
end
```

## dialog:background_set

- 设置对话框背景颜色

#### 函数原型

::: tip API
```lua
dialog:background_set(color: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| color | 必需。颜色名称（例如："blue"、"red"） |

#### 返回值说明

无返回值

#### 用法说明

设置背景颜色，这里是一个完整的使用示例：

```lua
import("core.ui.log")
import("core.ui.rect")
import("core.ui.label")
import("core.ui.event")
import("core.ui.boxdialog")
import("core.ui.textdialog")
import("core.ui.inputdialog")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建主对话框
    local dialog_main = boxdialog:new("dialog.main", rect{1, 1, self:width() - 1, self:height() - 1}, "主对话框")
    dialog_main:text():text_set("示例对话框内容")
    dialog_main:button_add("ok", "< 确定 >", function (v) self:quit() end)
    dialog_main:button_add("cancel", "< 取消 >", "cm_quit")
    self:insert(dialog_main)
end

function demo:on_resize()
    self:dialog_main():bounds_set(rect{1, 1, self:width() - 1, self:height() - 1})
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

