# core.ui.choicebox

此模块为终端 UI 系统提供单选列表框组件。

::: tip 提示
使用此模块需要先导入：`import("core.ui.choicebox")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`choicebox` 模块继承自 `panel`，提供单选列表框功能，包含：
- 单选模式支持（使用 `(X)` 标记选中项，`( )` 标记未选中项）
- 键盘导航（Up/Down、PageUp/PageDown）
- 滚动支持（当选项数量超过显示区域时）
- 自动调整大小
- 事件回调（on_load、on_scrolled、on_selected）

## choicebox:new

- 创建新的单选列表框实例

#### 函数原型

::: tip API
```lua
choicebox:new(name: <string>, bounds: <rect>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。列表框名称字符串 |
| bounds | 必需。列表框边界矩形 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| choicebox | 返回单选列表框实例 |

#### 用法说明

创建单选列表框：

```lua
import("core.ui.choicebox")
import("core.ui.rect")

local choicebox = choicebox:new("my_choice", rect{10, 5, 30, 10})
```

## choicebox:load

- 加载选项值到列表框中

#### 函数原型

::: tip API
```lua
choicebox:load(values: <table>, selected?: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| values | 必需。选项值数组 |
| selected | 可选。默认选中项的索引（从 1 开始），默认为 1 |

#### 返回值说明

无返回值

#### 用法说明

加载选项并设置默认选中项：

```lua
local values = {"选项1", "选项2", "选项3", "选项4"}
choicebox:load(values, 2)  -- 默认选中第二项
```

加载完成后会触发 `action.ac_on_load` 事件。

## choicebox:scrollable

- 检查列表框是否可滚动

#### 函数原型

::: tip API
```lua
choicebox:scrollable()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 当选项数量超过显示高度时返回 `true`，否则返回 `false` |

#### 用法说明

检查是否需要滚动：

```lua
if choicebox:scrollable() then
    print("选项数量较多，可以滚动查看")
end
```

## choicebox:scroll

- 滚动列表框内容

#### 函数原型

::: tip API
```lua
choicebox:scroll(count: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| count | 必需。滚动行数，正数向下滚动，负数向上滚动 |

#### 返回值说明

无返回值

#### 用法说明

滚动列表框内容：

```lua
choicebox:scroll(1)   -- 向下滚动一行
choicebox:scroll(-1)  -- 向上滚动一行
choicebox:scroll(choicebox:height())  -- 向下滚动一页
```

滚动时会触发 `action.ac_on_scrolled` 事件，传递当前滚动位置比例（0.0-1.0）。

## choicebox:on_event

- 处理键盘事件

#### 函数原型

::: tip API
```lua
choicebox:on_event(e: <event>)
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

列表框自动处理以下键盘事件：
- `Up`：向上导航，到达顶部时自动向上滚动一页
- `Down`：向下导航，到达底部时自动向下滚动一页
- `PageUp`：向上滚动一页
- `PageDown`：向下滚动一页
- `Enter` 或 `Space`：选中当前项

选中项时会触发 `action.ac_on_selected` 事件，传递选中项的索引和值。

重写此方法以添加自定义事件处理：

```lua
function my_choicebox:on_event(e)
    if e.type == event.ev_keyboard and e.key_name == "Tab" then
        -- 自定义处理 Tab 键
        return true
    end
    return choicebox.on_event(self, e)
end
```

## choicebox:on_resize

- 处理列表框大小调整

#### 函数原型

::: tip API
```lua
choicebox:on_resize()
```
:::

#### 参数说明

无参数

#### 返回值说明

无返回值

#### 用法说明

当列表框大小改变时自动调用此方法。它会重新布局选项项，只显示当前可见范围内的项。

以下是一个完整的使用示例：

```lua
import("core.ui.choicebox")
import("core.ui.rect")
import("core.ui.window")
import("core.ui.application")
import("core.ui.action")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建窗口
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "单选列表框演示")
    
    -- 创建单选列表框
    local choice = choicebox:new("choices", rect{5, 5, 40, 15})
    
    -- 加载选项值
    local options = {"gcc", "clang", "msvc", "mingw", "icc"}
    choice:load(options, 1)  -- 默认选中第一项
    
    -- 设置选中事件处理
    choice:action_set(action.ac_on_selected, function (v, index, value)
        print("已选择:", value, "(索引:", index, ")")
    end)
    
    -- 设置滚动事件处理
    choice:action_set(action.ac_on_scrolled, function (v, ratio)
        print("滚动位置:", string.format("%.2f%%", ratio * 100))
    end)
    
    -- 将列表框添加到窗口面板
    local panel = win:panel()
    panel:insert(choice)
    
    -- 选择列表框
    panel:select(choice)
    
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

