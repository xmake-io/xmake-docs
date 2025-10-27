# core.ui.mconfdialog

此模块为终端 UI 系统提供基于菜单的配置对话框。

::: tip 提示
使用此模块需要先导入：`import("core.ui.mconfdialog")`
:::

::: tip 注意
UI 模块主要用于 xmake 内部的 `xmake f --menu` 菜单可视化配置。它提供基础的 UI 组件，当然，用户也可以用来实现一些自己的终端 UI。
:::

`mconfdialog` 模块继承自 `boxdialog`，提供完整的基于菜单的配置界面。它允许用户通过分层菜单配置设置，支持 boolean、number、string、choice 和 menu 配置类型。它还包含帮助对话框、搜索功能和滚动条支持等特性。

## mconfdialog:new

- 创建新的菜单配置对话框实例

#### 函数原型

::: tip API
```lua
mconfdialog:new(name: <string>, bounds: <rect>, title: <string>)
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
| mconfdialog | 返回菜单配置对话框实例 |

#### 用法说明

创建菜单配置对话框：

```lua
import("core.ui.mconfdialog")
import("core.ui.rect")

local dialog = mconfdialog:new("config", rect{1, 1, 80, 25}, "配置")
```

## mconfdialog:load

- 将配置项加载到对话框中

#### 函数原型

::: tip API
```lua
mconfdialog:load(configs: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| configs | 必需。配置项数组（使用 `menuconf.*` 函数创建） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 成功时返回 `true` |

#### 用法说明

将配置加载到对话框：

```lua
local configs = {
    menuconf.boolean{description = "启用调试"},
    menuconf.string{value = "x86_64", description = "目标架构"},
    menuconf.number{value = 10, default = 10, description = "线程数"},
    menuconf.choice{
        value = 2,
        values = {"gcc", "clang", "msvc"},
        description = "编译器"
    }
}

dialog:load(configs)
```

## mconfdialog:configs

- 获取所有已加载的配置

#### 函数原型

::: tip API
```lua
mconfdialog:configs()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 返回配置项数组 |

#### 用法说明

访问已加载的配置：

```lua
local configs = dialog:configs()
for _, config in ipairs(configs) do
    print("配置:", config:prompt())
    print("值:", config.value)
end
```

## mconfdialog:menuconf

- 获取菜单配置组件

#### 函数原型

::: tip API
```lua
mconfdialog:menuconf()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| menuconf | 返回菜单配置实例 |

#### 用法说明

访问底层 menuconf 组件：

```lua
local menu = dialog:menuconf()
```

## mconfdialog:show_help

- 显示当前配置项的帮助对话框

#### 函数原型

::: tip API
```lua
mconfdialog:show_help()
```
:::

#### 参数说明

无参数

#### 返回值说明

无返回值

#### 用法说明

显示当前选中配置项的帮助信息：

```lua
-- 这通常通过按 '?' 键触发
dialog:show_help()
```

## mconfdialog:show_search

- 显示搜索对话框以搜索配置

#### 函数原型

::: tip API
```lua
mconfdialog:show_search()
```
:::

#### 参数说明

无参数

#### 返回值说明

无返回值

#### 用法说明

显示搜索对话框以查找配置项：

```lua
-- 这通常通过按 '/' 键触发
dialog:show_search()
```

## mconfdialog:show_exit

- 显示退出确认对话框

#### 函数原型

::: tip API
```lua
mconfdialog:show_exit(message: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| message | 必需。要显示的确认消息 |

#### 返回值说明

无返回值

#### 用法说明

显示退出确认对话框：

```lua
dialog:show_exit("您是否希望保存新的配置？")
```

## mconfdialog:on_event

- 处理键盘事件

#### 函数原型

::: tip API
```lua
mconfdialog:on_event(e: <event>)
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

处理配置导航的键盘事件：

```lua
function dialog:on_event(e)
    if e.type == event.ev_keyboard then
        if e.key_name == "?" then
            self:show_help()
            return true
        elseif e.key_name == "/" then
            self:show_search()
            return true
        end
    end
    return mconfdialog.on_event(self, e)
end
```

支持以下按键：
- `Up/Down`：导航菜单项
- `Space`：切换布尔值
- `Y`：启用布尔值
- `N`：禁用布尔值
- `Esc/Back`：返回
- `?`：显示帮助
- `/`：搜索

以下是一个完整的菜单配置对话框示例：

```lua
import("core.ui.mconfdialog")
import("core.ui.menuconf")
import("core.ui.rect")
import("core.ui.action")
import("core.ui.application")

local demo = application()

function demo:init()
    application.init(self, "demo")
    self:background_set("blue")
    
    -- 创建配置项
    local configs_sub = {}
    table.insert(configs_sub, menuconf.boolean{description = "启用调试"})
    table.insert(configs_sub, menuconf.string{value = "x86_64", description = "架构"})
    table.insert(configs_sub, menuconf.number{value = 4, default = 4, description = "线程数"})
    
    local configs = {}
    table.insert(configs, menuconf.boolean{description = "启用优化"})
    table.insert(configs, menuconf.string{value = "Release", description = "构建模式"})
    table.insert(configs, menuconf.choice{
        value = 2,
        values = {"Debug", "Release", "MinSizeRel", "RelWithDebInfo"},
        description = "配置"
    })
    table.insert(configs, menuconf.menu{description = "高级选项", configs = configs_sub})
    
    -- 创建菜单配置对话框
    local dialog = mconfdialog:new("config", rect{1, 1, self:width() - 1, self:height() - 1}, "构建配置")
    dialog:load(configs)
    
    -- 处理退出
    dialog:action_set(action.ac_on_exit, function (v) self:quit() end)
    
    -- 处理保存
    dialog:action_set(action.ac_on_save, function (v)
        -- 处理保存的配置
        local configs = dialog:configs()
        for _, config in ipairs(configs) do
            print("已保存:", config:prompt(), "=", config.value)
        end
        dialog:quit()
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

