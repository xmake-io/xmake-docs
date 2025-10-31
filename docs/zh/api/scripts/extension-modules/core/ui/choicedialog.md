# core.ui.choicedialog

此模块为终端 UI 系统提供单选选项对话框。

::: tip 提示
使用此模块需要先导入：`import("core.ui.choicedialog")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`choicedialog` 模块继承自 `boxdialog`，提供单选选项对话框。它包含一个 `choicebox` 用于显示可选项和一个滚动条用于长列表。

## choicedialog:new

- 创建新的选择对话框实例

#### 函数原型

::: tip API
```lua
choicedialog:new(name: <string>, bounds: <rect>, title: <string>)
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
| choicedialog | 返回选择对话框实例 |

#### 用法说明

创建选择对话框：

```lua
import("core.ui.choicedialog")
import("core.ui.rect")

local dialog = choicedialog:new("choice", rect{10, 5, 50, 20}, "选择选项")
```

## choicedialog:choicebox

- 获取选项列表框

#### 函数原型

::: tip API
```lua
choicedialog:choicebox()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| choicebox | 返回选项列表框实例 |

#### 用法说明

访问选项列表框以加载选项：

```lua
local choicebox = dialog:choicebox()
choicebox:load({"选项1", "选项2", "选项3"}, 1)
```

## choicedialog:scrollbar_box

- 获取滚动条组件

#### 函数原型

::: tip API
```lua
choicedialog:scrollbar_box()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| scrollbar | 返回滚动条实例 |

#### 用法说明

访问滚动条组件进行自定义：

```lua
local scrollbar = dialog:scrollbar_box()
scrollbar:show(true)
```

## choicedialog:on_event

- 处理对话框事件

#### 函数原型

::: tip API
```lua
choicedialog:on_event(e: <event>)
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

对话框自动处理以下事件：
- `Up/Down`：导航选项
- `Space`：确认选择

以下是一个完整的选择对话框示例：

```lua
import("core.ui.choicedialog")
import("core.ui.rect")
import("core.ui.event")
import("core.ui.application")
import("core.ui.action")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建选择对话框
    local dialog = choicedialog:new("choice", rect{1, 1, self:width() - 1, self:height() - 1}, "选择编译器")
    
    -- 加载选项
    local options = {"gcc", "clang", "msvc"}
    dialog:choicebox():load(options, 1)
    
    -- 设置选中事件
    dialog:choicebox():action_set(action.ac_on_selected, function (v, index, value)
        print("已选择:", value, "(索引:", index, ")")
    end)
    
    -- 处理选择按钮
    dialog:button("select"):action_set(action.ac_on_enter, function (v, e)
        local current = dialog:choicebox():current()
        if current then
            local value = current:extra("value")
            local index = current:extra("index")
            print("最终选择:", value, "(索引:", index, ")")
        end
        self:quit()
    end)
    
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

