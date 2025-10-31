# core.ui.action

此模块定义了 UI 系统的事件动作枚举常量。

::: tip 提示
使用此模块需要先导入：`import("core.ui.action")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`action` 模块提供了 UI 事件回调动作的类型常量，用于设置和处理各种 UI 事件。

## 预定义动作类型

`action` 模块定义了以下预定义动作类型：

| 动作 | 说明 |
|------|------|
| `action.ac_on_text_changed` | 文本内容改变时触发 |
| `action.ac_on_selected` | 项被选中时触发 |
| `action.ac_on_clicked` | 点击时触发 |
| `action.ac_on_resized` | 大小调整时触发 |
| `action.ac_on_scrolled` | 滚动时触发 |
| `action.ac_on_enter` | 确认进入时触发 |
| `action.ac_on_load` | 加载时触发 |
| `action.ac_on_save` | 保存时触发 |
| `action.ac_on_exit` | 退出时触发 |

## 用法说明

这些动作常量用于设置事件回调处理器：

```lua
import("core.ui.action")
import("core.ui.button")

-- 创建按钮
local btn = button:new("ok", rect{10, 5, 20, 1}, "确定")

-- 设置点击事件
btn:action_set(action.ac_on_enter, function (v)
    print("按钮被点击！")
end)
```

## action:register

- 注册自定义动作类型

#### 函数原型

::: tip API
```lua
action:register(tag: <string>, ...)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| tag | 必需。标记名称，用于累加计数 |
| ... | 可变参数。动作常量名称 |

#### 返回值说明

无返回值

#### 用法说明

注册自定义动作类型：

```lua
import("core.ui.action")

-- 注册自定义动作
action:register("ac_max",
    "ac_on_custom1",
    "ac_on_custom2",
    "ac_on_custom3"
)

-- 现在可以使用这些自定义动作
some_view:action_set(action.ac_on_custom1, function (v)
    print("自定义动作 1 被触发")
end)
```

以下是一个完整的使用示例：

```lua
import("core.ui.action")
import("core.ui.button")
import("core.ui.rect")
import("core.ui.application")
import("core.ui.window")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建窗口
    local win = window:new("main", rect{1, 1, self:width() - 1, self:height() - 1}, "Action 演示")
    
    -- 创建按钮并设置不同的事件
    local btn1 = button:new("btn1", rect{5, 5, 20, 1}, "< 按钮1 >")
    local btn2 = button:new("btn2", rect{30, 5, 20, 1}, "< 按钮2 >")
    
    -- 设置不同的事件处理器
    btn1:action_set(action.ac_on_enter, function (v)
        print("按钮 1 被确认点击")
    end)
    
    btn2:action_set(action.ac_on_enter, function (v)
        print("按钮 2 被确认点击")
    end)
    
    -- 将按钮添加到窗口面板
    local panel = win:panel()
    panel:insert(btn1)
    panel:insert(btn2)
    
    -- 选择第一个按钮
    panel:select(btn1)
    
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

