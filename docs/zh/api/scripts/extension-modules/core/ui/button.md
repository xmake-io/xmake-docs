# core.ui.button

此模块提供用于终端 UI 的可点击按钮组件。

::: tip 提示
使用此模块需要先导入：`import("core.ui.button")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`button` 模块继承自 `label`，提供可点击的按钮，包含：
- 可选择和可聚焦支持
- 鼠标点击处理
- Enter 键激活
- 视觉反馈（选中和聚焦时反转显示）

## button:new

- 创建新的按钮实例

#### 函数原型

::: tip API
```lua
button:new(name: <string>, bounds: <rect>, text: <string>, on_action?: <function>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。按钮名称字符串 |
| bounds | 必需。按钮边界矩形 |
| text | 必需。要显示的按钮文本 |
| on_action | 可选。激活按钮时要调用的函数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| button | 返回按钮实例 |

#### 用法说明

创建带操作处理器的按钮：

```lua
import("core.ui.button")
import("core.ui.rect")

local btn = button:new("ok", rect{10, 5, 20, 1}, "确定", function (v)
    print("按钮已点击！")
    v:parent():quit()
end)
```

## button:text

- 获取按钮文本

#### 函数原型

::: tip API
```lua
button:text()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回按钮文本 |

#### 用法说明

获取按钮文本：

```lua
local text = btn:text()
print(text)  -- 输出: 确定
```

## button:text_set

- 设置按钮文本

#### 函数原型

::: tip API
```lua
button:text_set(text: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| text | 必需。要显示的按钮文本 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| button | 返回按钮实例（用于链式调用） |

#### 用法说明

设置或更新按钮文本：

```lua
btn:text_set("取消")
btn:text_set("< 确定 >")  -- 可使用括号进行视觉样式化
```

## button:textattr

- 获取文本属性

#### 函数原型

::: tip API
```lua
button:textattr()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回文本属性字符串 |

#### 用法说明

获取当前文本属性：

```lua
local attr = btn:textattr()
```

## button:textattr_set

- 设置文本属性（颜色、样式）

#### 函数原型

::: tip API
```lua
button:textattr_set(attr: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| attr | 必需。文本属性字符串（例如："red bold"） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| button | 返回按钮实例（用于链式调用） |

#### 用法说明

设置按钮文本颜色和样式：

```lua
btn:textattr_set("green")           -- 绿色文本
btn:textattr_set("yellow bold")     -- 黄色粗体文本
btn:textattr_set("cyan onblack")    -- 黑色背景上的青色文本
```

## button:action_set

- 设置按钮操作处理器

#### 函数原型

::: tip API
```lua
button:action_set(action_type: <string>, handler: <function>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| action_type | 必需。操作类型（例如：`action.ac_on_enter`） |
| handler | 必需。触发操作时要调用的函数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| button | 返回按钮实例（用于链式调用） |

#### 用法说明

设置自定义操作处理器：

```lua
import("core.ui.action")

btn:action_set(action.ac_on_enter, function (v)
    print("按钮已激活！")
end)
```

## button:on_event

- 处理键盘事件

#### 函数原型

::: tip API
```lua
button:on_event(e: <event>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| e | 必需。事件对象 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 如果 Enter 键被处理返回 `true`，否则返回 `nil` |

#### 用法说明

当按钮接收键盘事件时自动调用此方法。当选中按钮并按下 Enter 时，会触发按钮的操作。

## button:on_draw

- 绘制按钮视图

#### 函数原型

::: tip API
```lua
button:on_draw(transparent: <boolean>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| transparent | 可选。使用透明度绘制 |

#### 返回值说明

无返回值

#### 用法说明

当需要绘制按钮时自动调用此方法。按钮在选中和聚焦时以反转显示（反色）显示。以下是一个完整示例：

```lua
import("core.ui.button")
import("core.ui.rect")
import("core.ui.application")
import("core.ui.window")
import("core.ui.action")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建窗口
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "按钮演示")
    
    -- 创建按钮
    local ok_btn = button:new("ok", rect{5, 5, 15, 1}, "< 确定 >", function (v)
        print("确定按钮已点击！")
    end)
    
    local cancel_btn = button:new("cancel", rect{25, 5, 20, 1}, "< 取消 >", function (v)
        print("取消按钮已点击！")
        self:quit()
    end)
    
    local apply_btn = button:new("apply", rect{50, 5, 18, 1}, "< 应用 >", function (v)
        print("应用按钮已点击！")
    end)
    
    -- 设置不同的文本属性
    ok_btn:textattr_set("green")
    cancel_btn:textattr_set("red")
    apply_btn:textattr_set("cyan")
    
    -- 将按钮添加到窗口面板
    local panel = win:panel()
    panel:insert(ok_btn)
    panel:insert(cancel_btn)
    panel:insert(apply_btn)
    
    -- 选择第一个按钮
    panel:select(ok_btn)
    
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

