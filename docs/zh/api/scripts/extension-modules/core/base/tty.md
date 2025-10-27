# core.base.tty

此模块提供终端控制和检测功能。

::: tip 提示
使用此模块需要先导入：`import("core.base.tty")`
:::

此模块提供终端控制序列、颜色支持检测和终端信息查询功能。支持 VT-ANSI 序列以实现高级终端操作。

## tty.erase_line_to_end

- 清除从当前光标位置到行尾的内容

#### 函数原型

::: tip API
```lua
tty.erase_line_to_end()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| tty | 返回 tty 模块以支持链式调用 |

#### 用法说明

```lua
import("core.base.tty")

tty.erase_line_to_end()
```

## tty.erase_line_to_start

- 清除从当前光标位置到行首的内容

#### 函数原型

::: tip API
```lua
tty.erase_line_to_start()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| tty | 返回 tty 模块以支持链式调用 |

#### 用法说明

```lua
import("core.base.tty")

tty.erase_line_to_start()
```

## tty.erase_line

- 清除整行

#### 函数原型

::: tip API
```lua
tty.erase_line()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| tty | 返回 tty 模块以支持链式调用 |

#### 用法说明

```lua
import("core.base.tty")

tty.erase_line()
```

## tty.erase_down

- 清除从当前行到屏幕底部

#### 函数原型

::: tip API
```lua
tty.erase_down()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| tty | 返回 tty 模块以支持链式调用 |

#### 用法说明

```lua
import("core.base.tty")

tty.erase_down()
```

## tty.erase_up

- 清除从当前行到屏幕顶部

#### 函数原型

::: tip API
```lua
tty.erase_up()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| tty | 返回 tty 模块以支持链式调用 |

#### 用法说明

```lua
import("core.base.tty")

tty.erase_up()
```

## tty.erase_screen

- 清除整个屏幕并将光标移到起始位置

#### 函数原型

::: tip API
```lua
tty.erase_screen()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| tty | 返回 tty 模块以支持链式调用 |

#### 用法说明

```lua
import("core.base.tty")

tty.erase_screen()
```

## tty.cursor_save

- 保存当前光标位置

#### 函数原型

::: tip API
```lua
tty.cursor_save()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| tty | 返回 tty 模块以支持链式调用 |

#### 用法说明

```lua
import("core.base.tty")

tty.cursor_save()
```

## tty.cursor_restore

- 恢复保存的光标位置

#### 函数原型

::: tip API
```lua
tty.cursor_restore()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| tty | 返回 tty 模块以支持链式调用 |

#### 用法说明

```lua
import("core.base.tty")

-- 保存光标位置
tty.cursor_save()

-- ... 执行其他操作 ...

-- 恢复光标位置
tty.cursor_restore()
```

## tty.cursor_and_attrs_save

- 保存当前光标位置和颜色属性

#### 函数原型

::: tip API
```lua
tty.cursor_and_attrs_save()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| tty | 返回 tty 模块以支持链式调用 |

#### 用法说明

```lua
import("core.base.tty")

tty.cursor_and_attrs_save()
```

## tty.cursor_and_attrs_restore

- 恢复保存的光标位置和颜色属性

#### 函数原型

::: tip API
```lua
tty.cursor_and_attrs_restore()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| tty | 返回 tty 模块以支持链式调用 |

#### 用法说明

```lua
import("core.base.tty")

-- 保存光标和属性
tty.cursor_and_attrs_save()

-- ... 改变颜色，执行其他操作 ...

-- 恢复光标位置和颜色
tty.cursor_and_attrs_restore()
```

## tty.cr

- 回车

#### 函数原型

::: tip API
```lua
tty.cr()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| tty | 返回 tty 模块以支持链式调用 |

#### 用法说明

```lua
import("core.base.tty")

tty.cr()
```

## tty.flush

- 刷新终端输出

#### 函数原型

::: tip API
```lua
tty.flush()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| tty | 返回 tty 模块以支持链式调用 |

#### 用法说明

```lua
import("core.base.tty")

tty.flush()
```

## tty.shell

- 获取 shell 名称

#### 函数原型

::: tip API
```lua
tty.shell()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回 shell 名称（例如："bash"、"zsh"、"pwsh"、"powershell"、"cmd"） |

#### 用法说明

```lua
import("core.base.tty")

local shell = tty.shell()
print("当前 shell:", shell)  -- 输出: "bash"、"zsh" 等
```

## tty.term

- 获取终端名称

#### 函数原型

::: tip API
```lua
tty.term()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回终端名称（例如："xterm"、"vscode"、"windows-terminal"、"mintty"） |

#### 用法说明

```lua
import("core.base.tty")

local term = tty.term()
print("终端:", term)  -- 输出: "xterm"、"vscode" 等
```

## tty.has_emoji

- 检查终端是否支持表情符号

#### 函数原型

::: tip API
```lua
tty.has_emoji()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 支持表情符号返回 true，否则返回 false |

#### 用法说明

```lua
import("core.base.tty")

if tty.has_emoji() then
    print("支持表情符号！")
else
    print("不支持表情符号")
end
```

## tty.has_vtansi

- 检查终端是否支持 VT-ANSI 序列

#### 函数原型

::: tip API
```lua
tty.has_vtansi()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 支持 VT-ANSI 返回 true，否则返回 false |

#### 用法说明

```lua
import("core.base.tty")

if tty.has_vtansi() then
    -- 使用高级终端功能
    tty.erase_screen()
end
```

## tty.has_color8

- 检查终端是否支持 8 色

#### 函数原型

::: tip API
```lua
tty.has_color8()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 支持 8 色返回 true，否则返回 false |

#### 用法说明

```lua
import("core.base.tty")

if tty.has_color8() then
    -- 使用 8 色转义序列
end
```

## tty.has_color256

- 检查终端是否支持 256 色

#### 函数原型

::: tip API
```lua
tty.has_color256()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 支持 256 色返回 true，否则返回 false |

#### 用法说明

```lua
import("core.base.tty")

if tty.has_color256() then
    -- 使用 256 色转义序列
end
```

## tty.has_color24

- 检查终端是否支持 24 位真彩色

#### 函数原型

::: tip API
```lua
tty.has_color24()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 支持 24 位颜色返回 true，否则返回 false |

#### 用法说明

```lua
import("core.base.tty")

if tty.has_color24() then
    -- 使用 24 位真彩色转义序列
end
```

## tty.term_mode

- 获取或设置终端模式

#### 函数原型

::: tip API
```lua
tty.term_mode(stdtype: <string>, newmode?: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| stdtype | 必需。标准流类型（"stdin"、"stdout"、"stderr"） |
| newmode | 可选。要设置的新终端模式 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回旧的终端模式 |

#### 用法说明

```lua
import("core.base.tty")

-- 获取当前模式
local oldmode = tty.term_mode("stdout")

-- 设置新模式
tty.term_mode("stdout", newmode)
```

