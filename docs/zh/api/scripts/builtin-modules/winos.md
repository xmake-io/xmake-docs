
# winos

Windows 系统操作模块，属于内置模块，无需使用[import](/zh/api/scripts/builtin-modules/import)导入，可直接脚本域调用其接口。

## winos.version

- 获取 windows 系统版本

#### 函数原型

::: tip API
```lua
winos.version()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

返回的版本是 semver 语义版本对象

```lua
if winos.version():ge("win7") then
    -- ...
end

if winos.version():ge("6.1") then
    -- ...
end
```

并且，还可以支持对 windows 版本名的直接判断，映射规则如下：

```

nt4      = "4.0"
win2k    = "5.0"
winxp    = "5.1"
ws03     = "5.2"
win6     = "6.0"
vista    = "6.0"
ws08     = "6.0"
longhorn = "6.0"
win7     = "6.1"
win8     = "6.2"
winblue  = "6.3"
win81    = "6.3"
win10    = "10.0"
```

## winos.processes

- 获取当前系统进程列表

#### 函数原型

::: tip API
```lua
winos.processes()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值

返回一个数组，每个元素是一个进程信息表：

| 字段 | 描述 |
|------|------|
| name | 进程可执行文件名 |
| pid | 进程 id |
| parent_pid | 父进程 id |

非 Windows 平台返回 nil。

#### 用法说明

```lua
local processes = winos.processes()
if processes then
    for _, p in ipairs(processes) do
        print(p.pid, p.parent_pid, p.name)
    end
end
```

## winos.set_error_mode

- 设置 Windows 进程错误模式

#### 函数原型

::: tip API
```lua
winos.set_error_mode(mode: <integer>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| mode | 进程错误模式值（对应 Windows API `SetErrorMode`） |

#### 返回值

返回之前的错误模式值。

#### 用法说明

禁用系统错误弹窗（例如：关键错误、GP fault、打开文件失败对话框等）：

```lua
local SEM_FAILCRITICALERRORS     = 0x0001
local SEM_NOGPFAULTERRORBOX      = 0x0002
local SEM_NOOPENFILEERRORBOX     = 0x8000

local oldmode = winos.set_error_mode(SEM_FAILCRITICALERRORS | SEM_NOGPFAULTERRORBOX | SEM_NOOPENFILEERRORBOX)
```

## winos.registry_keys

- 获取注册表建列表

#### 函数原型

::: tip API
```lua
winos.registry_keys(pattern: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| pattern | 用于匹配注册表键的模式字符串 |

#### 用法说明

支持通过模式匹配的方式，遍历获取注册表键路径列表，`*` 为单级路径匹配，`**` 为递归路径匹配。

```lua
local keypaths = winos.registry_keys("HKEY_LOCAL_MACHINE\\SOFTWARE\\*\\Windows NT\\*\\CurrentVersion\\AeDebug")
for _, keypath in ipairs(keypaths) do
    print(winos.registry_query(keypath .. ";Debugger"))
end
```

## winos.registry_values

- 获取注册表值名列表

#### 函数原型

::: tip API
```lua
winos.registry_values(pattern: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| pattern | 用于匹配注册表值的模式字符串 |

#### 用法说明

支持通过模式匹配的方式，获取指定键路径的值名列表，`;` 之后的就是指定的键名模式匹配字符串。

```lua
local valuepaths = winos.registry_values("HKEY_LOCAL_MACHINE\\SOFTWARE\\xx\\AeDebug;Debug*")
for _, valuepath in ipairs(valuepaths) do
    print(winos.registry_query(valuepath))
end
```

## winos.registry_query

- 获取注册表建值

#### 函数原型

::: tip API
```lua
winos.registry_query(keypath: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| keypath | 注册表键路径 |

#### 用法说明

获取指定注册表建路径下的值，如果没有指定值名，那么获取键路径默认值

```lua
local value, errors = winos.registry_query("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug")
local value, errors = winos.registry_query("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug;Debugger")
```
