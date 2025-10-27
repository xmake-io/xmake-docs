# core.ui.event

此模块提供用于终端 UI 系统的事件类型和类。

::: tip 提示
使用此模块需要先导入：`import("core.ui.event")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`event` 模块提供了在终端 UI 中处理不同类型事件的统一方式，包括键盘事件、鼠标事件、命令事件、文本事件和空闲事件。

## 事件类型

该模块定义了以下事件类型：

| 事件类型 | 值 | 描述 |
|---------|-----|------|
| event.ev_keyboard | 1 | 键盘按键按下/释放事件 |
| event.ev_mouse | 2 | 鼠标按键/移动事件 |
| event.ev_command | 3 | 命令事件 |
| event.ev_text | 4 | 文本输入事件 |
| event.ev_idle | 5 | 空闲事件（无用户输入） |
| event.ev_max | 5 | 最大事件类型值 |

## 命令事件类型

该模块定义了以下命令事件类型：

| 命令类型 | 值 | 描述 |
|---------|-----|------|
| event.cm_quit | 1 | 退出应用程序 |
| event.cm_exit | 2 | 退出当前视图 |
| event.cm_enter | 3 | 进入/确认操作 |
| event.cm_max | 3 | 最大命令类型值 |

## event:is_key

- 检查事件是否是指定键的键盘事件

#### 函数原型

::: tip API
```lua
event:is_key(key_name: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| key_name | 必需。要检查的键名（例如："Enter"、"Esc"、"Tab"） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 如果事件是指定键的键盘事件返回 `true`，否则返回 `false` |

#### 用法说明

检查事件是否为特定的键盘事件：

```lua
import("core.ui.event")

function view:on_event(e)
    if e:is_key("Enter") then
        print("按下了 Enter 键")
        return true  -- 事件已处理
    elseif e:is_key("Esc") then
        self:quit()
        return true
    end
    return false
end
```

## event:is_command

- 检查事件是否是指定命令的命令事件

#### 函数原型

::: tip API
```lua
event:is_command(command: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| command | 必需。要检查的命令名称（例如："cm_quit"、"cm_enter"） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 如果事件是指定命令的命令事件返回 `true`，否则返回 `false` |

#### 用法说明

检查事件是否为特定的命令事件：

```lua
import("core.ui.event")

function view:on_event(e)
    if e:is_command("cm_quit") then
        self:quit()
        return true
    elseif e:is_command("cm_enter") then
        self:on_confirm()
        return true
    end
    return false
end
```

## event:dump

- 打印事件信息用于调试

#### 函数原型

::: tip API
```lua
event:dump()
```
:::

#### 参数说明

无参数

#### 返回值说明

无返回值

#### 用法说明

打印事件信息用于调试：

```lua
import("core.ui.event")

function view:on_event(e)
    e:dump()  -- 输出: event(key): Enter 10 .. 或 event(cmd): cm_quit ..
end
```

## Event 对象

### event.keyboard

- 创建键盘事件对象

#### 函数原型

::: tip API
```lua
event.keyboard(key_code: <number>, key_name: <string>, key_meta: <boolean>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| key_code | 必需。数字键码 |
| key_name | 必需。键名字符串（例如："Enter"、"Esc"、"Tab"） |
| key_meta | 必需。如果按下了 ALT 键则为 `true`，否则为 `false` |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| event | 返回一个 `type = event.ev_keyboard` 的键盘事件对象 |

#### 用法说明

创建键盘事件（通常由框架内部完成）：

```lua
import("core.ui.event")

-- 这通常由 UI 框架在按键时创建
-- 但您也可以手动创建一个：
local e = event.keyboard(10, "Enter", false)
```

### event.mouse

- 创建鼠标事件对象

#### 函数原型

::: tip API
```lua
event.mouse(btn_code: <number>, x: <number>, y: <number>, btn_name: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| btn_code | 必需。鼠标按钮事件码 |
| x | 必需。X 坐标 |
| y | 必需。Y 坐标 |
| btn_name | 必需。按钮名称字符串 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| event | 返回一个 `type = event.ev_mouse` 的鼠标事件对象 |

#### 用法说明

创建鼠标事件（通常由框架内部完成）：

```lua
import("core.ui.event")

-- 这通常由 UI 框架在使用鼠标时创建
-- 但您也可以手动创建一个：
local e = event.mouse(1, 10, 20, "btn_left")
```

### event.command

- 创建命令事件对象

#### 函数原型

::: tip API
```lua
event.command(command: <string>, extra?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| command | 必需。命令名称字符串 |
| extra | 可选。附加数据表格 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| event | 返回一个 `type = event.ev_command` 的命令事件对象 |

#### 用法说明

创建并发送命令事件：

```lua
import("core.ui.event")
import("core.ui.action")

-- 创建一个退出命令事件
local e = event.command("cm_quit")

-- 将事件发送给视图
view:on_event(e)
```

### event.idle

- 创建空闲事件对象

#### 函数原型

::: tip API
```lua
event.idle()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| event | 返回一个 `type = event.ev_idle` 的空闲事件对象 |

#### 用法说明

创建空闲事件（通常由框架内部完成）：

```lua
import("core.ui.event")

-- 这通常由 UI 框架在无用户输入时创建：
local e = event.idle()
```

以下是一个完整的事件处理示例：

```lua
import("core.ui.event")
import("core.ui.rect")
import("core.ui.label")
import("core.ui.window")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("black")
    
    -- 创建主体窗口
    local body = window:new("window.body", rect{1, 1, self:width() - 1, self:height() - 1}, "主窗口")
    self:insert(body)
    
    -- 创建标签显示事件信息
    local label = label:new('demo.label', rect{0, 0, 40, 5}, '这是一个测试')
    body:panel():insert(label)
    self._label = label
end

function demo:on_resize()
    self:body_window():bounds_set(rect{1, 1, self:width() - 1, self:height() - 1})
    application.on_resize(self)
end

-- 处理事件
function demo:on_event(e)
    if e.type < event.ev_max then
        -- 显示事件信息
        local event_info = string.format('type: %s; name: %s; code: %s; meta: %s',
            tostring(e.type),
            tostring(e.key_name or e.btn_name or 'none'),
            tostring(e.key_code or e.x or 0),
            tostring(e.key_meta or e.y or 0))
        self._label:text_set(event_info)
    end
    
    -- 处理特定按键
    if e:is_key("Esc") then
        self:quit()
        return true
    elseif e:is_key("Enter") then
        print("按下了 Enter 键！")
        return true
    end
    
    application.on_event(self, e)
end

function demo:body_window()
    return self:view("window.body")
end

function main(...)
    demo:run(...)
end
```

