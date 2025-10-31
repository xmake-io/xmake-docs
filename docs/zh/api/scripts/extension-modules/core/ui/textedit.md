# core.ui.textedit

此模块提供用于终端 UI 系统中的文本编辑器组件。

::: tip 提示
使用此模块需要先导入：`import("core.ui.textedit")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`textedit` 模块继承自 `textarea`，提供可编辑文本的文本编辑器。支持多行编辑、光标显示和键盘输入。

## textedit:new

- 创建新的文本编辑器实例

#### 函数原型

::: tip API
```lua
textedit:new(name: <string>, bounds: <rect>, text?: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。文本编辑器名称字符串 |
| bounds | 必需。文本编辑器边界矩形 |
| text | 可选。初始文本内容 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| textedit | 返回文本编辑器实例 |

#### 用法说明

创建文本编辑器：

```lua
import("core.ui.textedit")
import("core.ui.rect")

local textedit = textedit:new("editor", rect{10, 5, 50, 10}, "初始文本")
```

## textedit:text_set

- 设置文本内容

#### 函数原型

::: tip API
```lua
textedit:text_set(text: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| text | 必需。要设置的文本内容 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| textedit | 返回文本编辑器实例（用于链式调用） |

#### 用法说明

设置或更新文本内容：

```lua
textedit:text_set("新文本内容")
```

设置文本后会自动滚动到底部并显示光标。

## textedit:on_event

- 处理键盘事件

#### 函数原型

::: tip API
```lua
textedit:on_event(e: <event>)
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

文本编辑器自动处理以下键盘事件：
- 普通字符：输入字符
- `Enter`：插入换行符（当启用了多行模式时）
- `Backspace`：删除光标前一个字符（支持 UTF-8 字符）
- `Ctrl+V`：粘贴剪贴板内容
- `Up/Down`：滚动文本

以下是一个完整的文本编辑器使用示例：

```lua
import("core.ui.textedit")
import("core.ui.window")
import("core.ui.rect")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建窗口
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "文本编辑器演示")
    
    -- 创建文本编辑器
    local editor = textedit:new("editor", rect{2, 2, 50, 15}, "在这里输入文本...")
    
    -- 设置文本属性
    editor:textattr_set("white on blue")
    
    -- 将文本编辑器添加到窗口面板
    local panel = win:panel()
    panel:insert(editor)
    
    -- 选择文本编辑器
    panel:select(editor)
    
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

