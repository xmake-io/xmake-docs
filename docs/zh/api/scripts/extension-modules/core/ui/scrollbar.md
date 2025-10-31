# core.ui.scrollbar

此模块提供用于终端 UI 系统的滚动条组件。

::: tip 提示
使用此模块需要先导入：`import("core.ui.scrollbar")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`scrollbar` 模块继承自 `view`，提供水平和垂直滚动条功能。

## scrollbar:new

- 创建新的滚动条实例

#### 函数原型

::: tip API
```lua
scrollbar:new(name: <string>, bounds: <rect>, vertical?: <boolean>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。滚动条名称字符串 |
| bounds | 必需。滚动条边界矩形 |
| vertical | 可选。是否为垂直滚动条，默认为 `true` |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| scrollbar | 返回滚动条实例 |

#### 用法说明

创建垂直和水平滚动条：

```lua
import("core.ui.scrollbar")
import("core.ui.rect")

local vscrollbar = scrollbar:new("vbar", rect{50, 1, 1, 20}, true)  -- 垂直滚动条
local hscrollbar = scrollbar:new("hbar", rect{1, 20, 50, 1}, false) -- 水平滚动条
```

## scrollbar:progress

- 获取当前滚动进度

#### 函数原型

::: tip API
```lua
scrollbar:progress()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回进度值，范围为 0.0 到 1.0 |

#### 用法说明

获取当前滚动进度：

```lua
local progress = scrollbar:progress()
print("滚动进度:", progress)
```

## scrollbar:progress_set

- 设置滚动进度

#### 函数原型

::: tip API
```lua
scrollbar:progress_set(progress: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| progress | 必需。进度值，范围为 0.0 到 1.0 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| scrollbar | 返回滚动条实例（用于链式调用） |

#### 用法说明

设置滚动进度：

```lua
scrollbar:progress_set(0.5)  -- 设置到中间位置
scrollbar:progress_set(0)    -- 设置到顶部
scrollbar:progress_set(1)    -- 设置到底部
```

## scrollbar:stepwidth

- 获取步进宽度

#### 函数原型

::: tip API
```lua
scrollbar:stepwidth()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回步进宽度，范围为 0.0 到 1.0 |

#### 用法说明

获取步进宽度：

```lua
local stepwidth = scrollbar:stepwidth()
```

## scrollbar:stepwidth_set

- 设置步进宽度

#### 函数原型

::: tip API
```lua
scrollbar:stepwidth_set(stepwidth: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| stepwidth | 必需。步进宽度，范围为 0.0 到 1.0 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| scrollbar | 返回滚动条实例（用于链式调用） |

#### 用法说明

设置步进宽度：

```lua
scrollbar:stepwidth_set(0.1)  -- 每次滚动 10%
```

## scrollbar:vertical

- 检查是否为垂直滚动条

#### 函数原型

::: tip API
```lua
scrollbar:vertical()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 如果是垂直滚动条返回 `true`，否则返回 `false` |

#### 用法说明

检查滚动条方向：

```lua
if scrollbar:vertical() then
    print("这是垂直滚动条")
else
    print("这是水平滚动条")
end
```

## scrollbar:vertical_set

- 设置滚动条方向

#### 函数原型

::: tip API
```lua
scrollbar:vertical_set(vertical: <boolean>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| vertical | 必需。设置方向，`true` 为垂直，`false` 为水平 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| scrollbar | 返回滚动条实例（用于链式调用） |

#### 用法说明

设置滚动条方向：

```lua
scrollbar:vertical_set(true)   -- 设置为垂直
scrollbar:vertical_set(false)  -- 设置为水平
```

## scrollbar:char

- 获取滚动条字符

#### 函数原型

::: tip API
```lua
scrollbar:char()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回滚动条显示的字符 |

#### 用法说明

获取滚动条字符：

```lua
local char = scrollbar:char()
```

## scrollbar:char_set

- 设置滚动条字符

#### 函数原型

::: tip API
```lua
scrollbar:char_set(char: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| char | 必需。滚动条显示的字符 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| scrollbar | 返回滚动条实例（用于链式调用） |

#### 用法说明

设置滚动条字符：

```lua
scrollbar:char_set('#')      -- 使用 # 字符
scrollbar:char_set('\u2588') -- 使用方块字符
```

## scrollbar:charattr

- 获取滚动条字符属性

#### 函数原型

::: tip API
```lua
scrollbar:charattr()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回字符属性字符串 |

#### 用法说明

获取字符属性：

```lua
local attr = scrollbar:charattr()
```

## scrollbar:charattr_set

- 设置滚动条字符属性

#### 函数原型

::: tip API
```lua
scrollbar:charattr_set(attr: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| attr | 必需。字符属性字符串 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| scrollbar | 返回滚动条实例（用于链式调用） |

#### 用法说明

设置字符属性：

```lua
scrollbar:charattr_set("yellow onblue bold")  -- 黄色粗体，蓝色背景
```

## scrollbar:scroll

- 滚动滚动条

#### 函数原型

::: tip API
```lua
scrollbar:scroll(steps?: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| steps | 可选。步数，正数向下/向右，负数向上/向左，默认为 1 |

#### 返回值说明

无返回值

#### 用法说明

滚动滚动条：

```lua
scrollbar:scroll(1)   -- 向下/向右滚动一步
scrollbar:scroll(-1)  -- 向上/向左滚动一步
scrollbar:scroll(5)   -- 滚动 5 步
```

## scrollbar:on_event

- 处理键盘事件

#### 函数原型

::: tip API
```lua
scrollbar:on_event(e: <event>)
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

滚动条自动处理以下键盘事件：
- 垂直滚动条：`Up`（向上）、`Down`（向下）
- 水平滚动条：`Left`（向左）、`Right`（向右）

以下是一个完整的滚动条使用示例：

```lua
import("core.ui.scrollbar")
import("core.ui.rect")
import("core.ui.label")
import("core.ui.window")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建窗口
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "滚动条演示")
    
    -- 创建滚动条
    local scrollbar = scrollbar:new("scroll", rect{self:width() - 2, 1, 1, self:height() - 2}, true)
    scrollbar:char_set('#')
    scrollbar:charattr_set("yellow on blue")
    scrollbar:stepwidth_set(0.1)
    
    -- 创建标签显示当前进度
    local label = label:new("progress", rect{1, 1, 30, 1}, "进度: 0%")
    
    -- 设置滚动事件
    scrollbar:action_set(action.ac_on_scrolled, function (v, progress)
        local text = string.format("进度: %.1f%%", progress * 100)
        label:text_set(text)
    end)
    
    -- 将组件添加到窗口面板
    local panel = win:panel()
    panel:insert(label)
    panel:insert(scrollbar)
    
    self:insert(win)
    self._win = win
    self._scrollbar = scrollbar
end

function demo:on_resize()
    self._win:bounds_set(rect{1, 1, self:width() - 1, self:height() - 1})
    self._scrollbar:bounds_set(rect{self:width() - 2, 1, 1, self:height() - 2})
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

