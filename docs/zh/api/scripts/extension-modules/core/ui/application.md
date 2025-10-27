# core.ui.application

此模块提供终端 UI 系统的主应用程序容器。您可以继承 `application` 来实现自己的终端 UI 应用程序。

::: tip 提示
使用此模块需要先导入：`import("core.ui.application")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

application 模块使用继承模式。您创建自己的应用程序实例并自定义其行为：

```lua
import("core.ui.application")

local app = application()

function app:init()
    -- 您的初始化代码
end
```

## application:new

- 创建新的应用程序实例

#### 函数原型

::: tip API
```lua
local app = application()
```
:::

#### 参数说明

构造函数无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| application | 返回新的应用程序实例 |

#### 用法说明

创建一个可以自定义的应用程序实例：

```lua
import("core.ui.application")

local demo = application()
```

## application:init

- 初始化应用程序

#### 函数原型

::: tip API
```lua
application:init(name: <string>, argv?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。应用程序名称字符串 |
| argv | 可选。命令行参数表格 |

#### 返回值说明

无返回值

#### 用法说明

初始化您的自定义应用程序。这由 `run()` 自动调用：

```lua
function demo:init()
    application.init(self, "myapp")
    self:background_set("blue")
    
    -- 在这里添加您的 UI 组件
    self:insert(self:main_dialog())
end
```

## application:run

- 运行应用程序并启动事件循环

#### 函数原型

::: tip API
```lua
application:run(...)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| ... | 可选。额外参数 |

#### 返回值说明

无返回值

#### 用法说明

启动您的应用程序。这会初始化 UI、调用 `init()` 并启动事件循环：

```lua
local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    self:insert(self:main_dialog())
end

-- 启动应用程序
demo:run()
```

## application:background_set

- 设置应用程序背景颜色

#### 函数原型

::: tip API
```lua
application:background_set(color: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| color | 必需。颜色名称（例如："blue"、"red"） |

#### 返回值说明

无返回值

#### 用法说明

设置应用程序的背景颜色：

```lua
self:background_set("blue")
```

## application:insert

- 将视图插入应用程序

#### 函数原型

::: tip API
```lua
application:insert(view: <view>, opt?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| view | 必需。要插入的视图 |
| opt | 可选。选项表格，支持：`{centerx = true, centery = true}` |

#### 返回值说明

无返回值

#### 用法说明

向应用程序添加视图，可选择位置：

```lua
-- 添加对话框
self:insert(self:main_dialog())

-- 添加居中的对话框
self:insert(self:input_dialog(), {centerx = true, centery = true})
```

## application:on_resize

- 处理窗口大小调整事件

#### 函数原型

::: tip API
```lua
application:on_resize()
```
:::

#### 参数说明

无参数

#### 返回值说明

无返回值

#### 用法说明

重写此方法以处理调整大小事件并更新您的 UI 布局：

```lua
function demo:on_resize()
    self:main_dialog():bounds_set(rect{1, 1, self:width() - 1, self:height() - 1})
    self:center(self:input_dialog(), {centerx = true, centery = true})
    application.on_resize(self)
end
```

## application:menubar

- 获取应用程序的菜单栏

#### 函数原型

::: tip API
```lua
application:menubar()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| menubar | 返回菜单栏实例 |

#### 用法说明

访问菜单栏组件：

```lua
local menubar = app:menubar()
```

## application:desktop

- 获取应用程序的桌面区域

#### 函数原型

::: tip API
```lua
application:desktop()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| desktop | 返回桌面实例 |

#### 用法说明

访问桌面区域以放置视图：

```lua
local desktop = app:desktop()
```

## application:statusbar

- 获取应用程序的状态栏

#### 函数原型

::: tip API
```lua
application:statusbar()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| statusbar | 返回状态栏实例 |

#### 用法说明

访问状态栏组件，这里是一个完整的自定义应用示例：

```lua
import("core.ui.log")
import("core.ui.rect")
import("core.ui.label")
import("core.ui.event")
import("core.ui.window")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建主窗口
    local win = window:new("window.body", rect{1, 1, self:width() - 1, self:height() - 1}, "主窗口")
    self:insert(win)
    
    -- 创建状态栏
    local statusbar = self:statusbar()
    statusbar:text_set("就绪")
end

function demo:on_resize()
    self:desktop():bounds_set(rect{0, 0, self:width(), self:height()})
    application.on_resize(self)
end

function main(...)
    demo:run(...)
end
```

