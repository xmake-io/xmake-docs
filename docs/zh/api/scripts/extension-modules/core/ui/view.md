# core.ui.view

此模块为终端 UI 系统提供基础视图组件。

::: tip 提示
使用此模块需要先导入：`import("core.ui.view")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`view` 模块是所有 UI 组件的基础类。它继承自 `object`，提供视图的基础功能，包括绘制、事件处理、状态管理、选项管理、属性管理等。

## view:new

- 创建新的视图实例

#### 函数原型

::: tip API
```lua
view:new(name: <string>, bounds: <rect>, ...)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。视图名称字符串 |
| bounds | 必需。视图边界矩形 |
| ... | 可变参数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| view | 返回视图实例 |

#### 用法说明

创建视图实例：

```lua
import("core.ui.view")
import("core.ui.rect")

local v = view:new("myview", rect{1, 1, 80, 25})
```

## view:name

- 获取视图名称

#### 函数原型

::: tip API
```lua
view:name()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回视图名称 |

#### 用法说明

获取视图名称：

```lua
local name = v:name()
print(name)  -- 输出: myview
```

## view:bounds

- 获取视图边界矩形

#### 函数原型

::: tip API
```lua
view:bounds()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| rect | 返回视图边界矩形 |

#### 用法说明

获取视图边界：

```lua
local bounds = v:bounds()
print(bounds:sx(), bounds:sy(), bounds:ex(), bounds:ey())
```

## view:bounds_set

- 设置视图边界矩形

#### 函数原型

::: tip API
```lua
view:bounds_set(bounds: <rect>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| bounds | 必需。新的边界矩形 |

#### 返回值说明

无返回值

#### 用法说明

设置视图边界：

```lua
v:bounds_set(rect{10, 5, 50, 20})
```

## view:width

- 获取视图宽度

#### 函数原型

::: tip API
```lua
view:width()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回视图宽度 |

#### 用法说明

获取视图宽度：

```lua
local w = v:width()
```

## view:height

- 获取视图高度

#### 函数原型

::: tip API
```lua
view:height()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回视图高度 |

#### 用法说明

获取视图高度：

```lua
local h = v:height()
```

## view:parent

- 获取父视图

#### 函数原型

::: tip API
```lua
view:parent()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| view | 返回父视图实例或 `nil` |

#### 用法说明

获取父视图：

```lua
local parent = v:parent()
```

## view:application

- 获取应用程序实例

#### 函数原型

::: tip API
```lua
view:application()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| application | 返回应用程序实例 |

#### 用法说明

获取应用程序实例：

```lua
local app = v:application()
app:quit()
```

## view:canvas

- 获取视图画布

#### 函数原型

::: tip API
```lua
view:canvas()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| canvas | 返回画布实例 |

#### 用法说明

获取画布进行绘制操作：

```lua
local canvas = v:canvas()
canvas:move(0, 0):putstr("Hello")
```

## view:state

- 获取视图状态

#### 函数原型

::: tip API
```lua
view:state(name: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。状态名称 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| any | 返回状态值 |

#### 用法说明

获取视图状态，常见状态包括：
- `visible`：是否可见
- `cursor_visible`：光标是否可见
- `selected`：是否被选中
- `focused`：是否获得焦点

```lua
local is_visible = v:state("visible")
```

## view:state_set

- 设置视图状态

#### 函数原型

::: tip API
```lua
view:state_set(name: <string>, enable: <boolean>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。状态名称 |
| enable | 必需。是否启用 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| view | 返回视图实例（用于链式调用） |

#### 用法说明

设置视图状态：

```lua
v:state_set("visible", true)
```

## view:option

- 获取视图选项

#### 函数原型

::: tip API
```lua
view:option(name: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。选项名称 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| any | 返回选项值 |

#### 用法说明

获取视图选项，常见选项包括：
- `selectable`：是否可选择
- `mouseable`：是否支持鼠标

```lua
local is_selectable = v:option("selectable")
```

## view:option_set

- 设置视图选项

#### 函数原型

::: tip API
```lua
view:option_set(name: <string>, enable: <boolean>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。选项名称 |
| enable | 必需。是否启用 |

#### 返回值说明

无返回值

#### 用法说明

设置视图选项：

```lua
v:option_set("selectable", true)
```

## view:attr

- 获取视图属性

#### 函数原型

::: tip API
```lua
view:attr(name: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。属性名称 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| any | 返回属性值 |

#### 用法说明

获取视图属性：

```lua
local bg = v:attr("background")
```

## view:attr_set

- 设置视图属性

#### 函数原型

::: tip API
```lua
view:attr_set(name: <string>, value: <any>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。属性名称 |
| value | 必需。属性值 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| view | 返回视图实例（用于链式调用） |

#### 用法说明

设置视图属性：

```lua
v:attr_set("background", "blue")
```

## view:background

- 获取背景颜色

#### 函数原型

::: tip API
```lua
view:background()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回背景颜色名称 |

#### 用法说明

获取背景颜色：

```lua
local bg = v:background()
```

## view:background_set

- 设置背景颜色

#### 函数原型

::: tip API
```lua
view:background_set(color: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| color | 必需。颜色名称 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| view | 返回视图实例（用于链式调用） |

#### 用法说明

设置背景颜色：

```lua
v:background_set("blue")
```

## view:action_set

- 设置动作处理器

#### 函数原型

::: tip API
```lua
view:action_set(name: <string>, on_action: <function>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。动作名称 |
| on_action | 必需。动作处理函数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| view | 返回视图实例（用于链式调用） |

#### 用法说明

设置动作处理器：

```lua
import("core.ui.action")

v:action_set(action.ac_on_clicked, function (view)
    print("视图被点击")
end)
```

## view:action_on

- 触发动作

#### 函数原型

::: tip API
```lua
view:action_on(name: <string>, ...)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。动作名称 |
| ... | 可变参数，传递给动作处理器 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| any | 返回动作处理器的返回值 |

#### 用法说明

触发动作：

```lua
import("core.ui.action")

v:action_on(action.ac_on_clicked)
```

## view:invalidate

- 使视图无效化（需要重绘）

#### 函数原型

::: tip API
```lua
view:invalidate(bounds?: <boolean>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| bounds | 可选。是否需要调整大小 |

#### 返回值说明

无返回值

#### 用法说明

使视图无效化以便重绘：

```lua
v:invalidate()        -- 标记需要重绘
v:invalidate(true)    -- 标记需要调整大小
```

## view:show

- 显示或隐藏视图

#### 函数原型

::: tip API
```lua
view:show(visible: <boolean>, opt?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| visible | 必需。是否显示 |
| opt | 可选。选项表格，支持：`{focused = true}` |

#### 返回值说明

无返回值

#### 用法说明

显示或隐藏视图：

```lua
v:show(true)                          -- 显示
v:show(false)                         -- 隐藏
v:show(true, {focused = true})        -- 显示并获得焦点
```

## view:cursor_move

- 移动光标位置

#### 函数原型

::: tip API
```lua
view:cursor_move(x: <number>, y: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| x | 必需。光标 X 坐标 |
| y | 必需。光标 Y 坐标 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| view | 返回视图实例（用于链式调用） |

#### 用法说明

移动光标位置：

```lua
v:cursor_move(10, 5)
```

## view:cursor_show

- 显示或隐藏光标

#### 函数原型

::: tip API
```lua
view:cursor_show(visible: <boolean>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| visible | 必需。是否显示光标 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| view | 返回视图实例（用于链式调用） |

#### 用法说明

显示或隐藏光标：

```lua
v:cursor_show(true)   -- 显示光标
v:cursor_show(false)  -- 隐藏光标
```

## view:on_draw

- 绘制视图

#### 函数原型

::: tip API
```lua
view:on_draw(transparent: <boolean>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| transparent | 可选。是否透明绘制 |

#### 返回值说明

无返回值

#### 用法说明

绘制视图时自动调用此方法。可以在子类中重写以实现自定义绘制：

```lua
function my_view:on_draw(transparent)
    -- 调用父类方法绘制背景
    view.on_draw(self, transparent)
    
    -- 自定义绘制内容
    local canvas = self:canvas()
    canvas:move(0, 0):putstr("My View")
end
```

## view:on_event

- 处理事件

#### 函数原型

::: tip API
```lua
view:on_event(e: <event>)
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

处理事件时自动调用此方法。可以在子类中重写以实现自定义事件处理：

```lua
function my_view:on_event(e)
    if e.type == event.ev_keyboard and e.key_name == "Enter" then
        -- 处理 Enter 键
        return true
    end
    return view.on_event(self, e)
end
```

以下是一个完整的自定义视图示例：

```lua
import("core.ui.view")
import("core.ui.window")
import("core.ui.rect")
import("core.ui.application")
import("core.ui.event")
import("core.ui.action")

-- 定义自定义视图
local myview = myview or view()

function myview:init(name, bounds)
    view.init(self, name, bounds)
    self:background_set("cyan")
    self:option_set("selectable", true)
end

function myview:on_draw(transparent)
    view.on_draw(self, transparent)
    
    local canvas = self:canvas()
    local textattr = curses.calc_attr({"yellow", "bold"})
    canvas:attr(textattr):move(0, 0):putstr("Custom View")
end

function myview:on_event(e)
    if e.type == event.ev_keyboard and e.key_name == "Enter" then
        print("自定义视图被激活")
        return true
    end
    return view.on_event(self, e)
end

-- 使用自定义视图
local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建窗口
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "自定义视图演示")
    
    -- 创建自定义视图
    local custom = myview:new("custom", rect{10, 5, 40, 10})
    
    -- 将视图添加到窗口面板
    local panel = win:panel()
    panel:insert(custom)
    panel:select(custom)
    
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

