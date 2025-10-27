# core.ui.label

此模块提供用于在终端 UI 中显示文本的标签视图。

::: tip 提示
使用此模块需要先导入：`import("core.ui.label")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`label` 模块继承自 `view`，提供简单的文本显示组件，包含：
- 文本内容管理
- 文本属性（颜色、粗体等）支持
- 基于宽度的自动文本换行
- UTF-8 字符宽度计算

## label:new

- 创建新的标签实例

#### 函数原型

::: tip API
```lua
label:new(name: <string>, bounds: <rect>, text: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。标签名称字符串 |
| bounds | 必需。标签边界矩形 |
| text | 必需。要显示的文本内容 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| label | 返回标签实例 |

#### 用法说明

创建带文本的标签：

```lua
import("core.ui.label")
import("core.ui.rect")

local lbl = label:new("hello", rect{1, 1, 20, 1}, "你好，世界！")
```

## label:text

- 获取当前文本内容

#### 函数原型

::: tip API
```lua
label:text()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回文本内容 |

#### 用法说明

获取标签的文本内容：

```lua
local text = lbl:text()
print(text)  -- 输出: 你好，世界！
```

## label:text_set

- 设置文本内容

#### 函数原型

::: tip API
```lua
label:text_set(text: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| text | 必需。要显示的文本内容 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| label | 返回标签实例（用于链式调用） |

#### 用法说明

设置或更新文本内容：

```lua
lbl:text_set("新文本")
lbl:text_set("第一行\n第二行")  -- 多行文本
```

## label:textattr

- 获取文本属性字符串

#### 函数原型

::: tip API
```lua
label:textattr()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回文本属性字符串（例如："red bold"） |

#### 用法说明

获取当前文本属性：

```lua
local attr = lbl:textattr()
print(attr)  -- 输出: black
```

## label:textattr_set

- 设置文本属性（颜色、样式）

#### 函数原型

::: tip API
```lua
label:textattr_set(attr: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| attr | 必需。文本属性字符串（例如："red bold"、"yellow onblue"） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| label | 返回标签实例（用于链式调用） |

#### 用法说明

设置文本颜色和样式：

```lua
lbl:textattr_set("red")                    -- 红色文本
lbl:textattr_set("yellow bold")           -- 黄色粗体文本
lbl:textattr_set("cyan onblue")           -- 蓝色背景上的青色文本
lbl:textattr_set("green bold onblack")    -- 黑色背景上的绿色粗体文本
```

## label:textattr_val

- 获取编译后的文本属性值

#### 函数原型

::: tip API
```lua
label:textattr_val()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回数字属性值（用于 curses） |

#### 用法说明

这通常由绘制系统内部使用。返回的值将文本属性与视图的背景颜色组合在一起。

## label:splitext

- 根据宽度将文本拆分为行

#### 函数原型

::: tip API
```lua
label:splitext(text: <string>, width?: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| text | 必需。要拆分的文本 |
| width | 可选。最大行宽（默认为标签宽度） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回文本行数组 |

#### 用法说明

将文本拆分为多行：

```lua
local lines = lbl:splitext("这是一个需要换行的长文本", 10)
-- 返回: {"这是一个需要", "换行的长文本"}
```

## label:on_draw

- 绘制标签视图

#### 函数原型

::: tip API
```lua
label:on_draw(transparent: <boolean>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| transparent | 可选。使用透明度绘制 |

#### 返回值说明

无返回值

#### 用法说明

当需要绘制标签时，这由 UI 框架自动调用。以下是一个完整示例：

```lua
import("core.ui.label")
import("core.ui.rect")
import("core.ui.application")
import("core.ui.window")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建窗口
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "标签演示")
    
    -- 创建不同样式的标签
    local lbl1 = label:new("lbl1", rect{2, 2, 30, 1}, "你好，世界！")
    lbl1:textattr_set("green")
    
    local lbl2 = label:new("lbl2", rect{2, 4, 30, 1}, "这是粗体文本！")
    lbl2:textattr_set("yellow bold")
    
    local lbl3 = label:new("lbl3", rect{2, 6, 30, 1}, "彩色背景！")
    lbl3:textattr_set("cyan onblack")
    
    local lbl4 = label:new("lbl4", rect{2, 8, 30, 3}, "多行文本\n第二行\n第三行")
    lbl4:textattr_set("red")
    
    -- 将标签添加到窗口面板
    local panel = win:panel()
    panel:insert(lbl1)
    panel:insert(lbl2)
    panel:insert(lbl3)
    panel:insert(lbl4)
    
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

