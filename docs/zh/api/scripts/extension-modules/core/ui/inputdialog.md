# core.ui.inputdialog

此模块提供用于终端 UI 系统中的文本输入对话框。

::: tip 提示
使用此模块需要先导入：`import("core.ui.inputdialog")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`inputdialog` 模块继承自 textdialog，提供用于用户输入的文本输入字段。它包含一个提示标签和一个文本编辑组件。

## inputdialog:new

- 创建新的输入对话框实例

#### 函数原型

::: tip API
```lua
inputdialog:new(name: <string>, bounds: <rect>, title: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。输入对话框名称字符串 |
| bounds | 必需。输入对话框边界矩形 |
| title | 必需。输入对话框标题字符串 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| inputdialog | 返回输入对话框实例 |

#### 用法说明

创建一个具有名称、边界和标题的输入对话框：

```lua
import("core.ui.inputdialog")
import("core.ui.rect")

local dialog = inputdialog:new("input", rect{10, 5, 50, 10}, "输入")
```

## inputdialog:textedit

- 获取文本编辑组件

#### 函数原型

::: tip API
```lua
inputdialog:textedit()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| textedit | 返回文本编辑实例 |

#### 用法说明

访问文本编辑组件以获取或设置输入值：

```lua
local textedit = dialog:textedit()
local input_value = textedit:text()
```

## inputdialog:text

- 获取提示标签

#### 函数原型

::: tip API
```lua
inputdialog:text()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| label | 返回提示标签实例 |

#### 用法说明

获取并自定义提示标签：

```lua
local label = dialog:text()
label:text_set("请输入您的姓名：")
label:textattr_set("red")
```

## inputdialog:button_add

- 向对话框添加按钮

#### 函数原型

::: tip API
```lua
inputdialog:button_add(name: <string>, text: <string>, command: <string|function>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。按钮名称字符串 |
| text | 必需。按钮显示文本 |
| command | 必需。要执行的命令字符串或函数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| button | 返回按钮实例 |

#### 用法说明

添加按钮以处理用户输入：

```lua
-- 是按钮 - 获取输入并处理
dialog:button_add("yes", "< 是 >", function (v)
    local input = dialog:textedit():text()
    print("用户输入:", input)
    dialog:quit()
end)

-- 否/取消按钮
dialog:button_add("no", "< 否 >", function (v)
    dialog:quit()
end)
```

## inputdialog:show

- 显示或隐藏对话框

#### 函数原型

::: tip API
```lua
inputdialog:show(visible: <boolean>, opt?: <table>)
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

显示或隐藏输入对话框：

```lua
dialog:show(true)  -- 显示对话框

-- 带焦点显示
dialog:show(true, {focused = true})
```

## inputdialog:background_set

- 设置对话框背景颜色

#### 函数原型

::: tip API
```lua
inputdialog:background_set(color: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| color | 必需。颜色名称（例如："blue"、"cyan"） |

#### 返回值说明

无返回值

#### 用法说明

设置对话框及其边框的背景颜色：

```lua
dialog:background_set("blue")
dialog:frame():background_set("cyan")
```

## inputdialog:quit

- 关闭输入对话框

#### 函数原型

::: tip API
```lua
inputdialog:quit()
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

以下是一个完整的输入对话框使用示例：

```lua
import("core.ui.inputdialog")
import("core.ui.rect")
import("core.ui.application")

local app = application()

function app:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建输入对话框
    local dialog = inputdialog:new("input", rect{0, 0, 50, 10})
    dialog:text():text_set("请输入您的姓名：")
    dialog:background_set(self:background())
    dialog:frame():background_set("cyan")
    
    -- 添加按钮
    dialog:button_add("yes", "< 是 >", function (v)
        local input = dialog:textedit():text()
        print("输入值:", input)
        dialog:quit()
    end)
    
    dialog:button_add("no", "< 否 >", function (v)
        dialog:quit()
    end)
    
    -- 显示对话框
    dialog:show(false)  -- 初始隐藏
    
    -- 插入到应用程序
    self:insert(dialog, {centerx = true, centery = true})
end

function app:on_resize()
    self:dialog_input():bounds_set(rect{0, 0, 50, 10})
    self:center(self:dialog_input(), {centerx = true, centery = true})
    application.on_resize(self)
end

app:run()
```

