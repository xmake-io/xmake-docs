# core.base.cpu

此模块提供 CPU 信息查询和检测功能。

::: tip 提示
使用此模块需要先导入：`import("core.base.cpu")`
:::

此模块允许您查询 CPU 厂商、型号、架构、特性以及性能指标，支持跨平台（macOS、Linux、Windows、BSD）。

## cpu.vendor

- 获取 CPU 厂商 ID

#### 函数原型

::: tip API
```lua
cpu.vendor()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回 CPU 厂商 ID（例如："GenuineIntel"、"AuthenticAMD"） |

#### 用法说明

```lua
import("core.base.cpu")

local vendor = cpu.vendor()
print("CPU 厂商:", vendor)  -- 输出: "GenuineIntel" 或 "AuthenticAMD"
```

## cpu.model

- 获取 CPU 型号编号

#### 函数原型

::: tip API
```lua
cpu.model()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回 CPU 型号编号 |

#### 用法说明

```lua
import("core.base.cpu")

local model = cpu.model()
print("CPU 型号:", model)
```

## cpu.family

- 获取 CPU 系列

#### 函数原型

::: tip API
```lua
cpu.family()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回 CPU 系列编号 |

#### 用法说明

```lua
import("core.base.cpu")

local family = cpu.family()
print("CPU 系列:", family)
```

## cpu.model_name

- 获取 CPU 型号名称

#### 函数原型

::: tip API
```lua
cpu.model_name()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回 CPU 完整型号名称（例如："Intel(R) Core(TM) i7-8750H CPU @ 2.20GHz"） |

#### 用法说明

```lua
import("core.base.cpu")

local name = cpu.model_name()
print("CPU 名称:", name)
```

## cpu.features

- 获取 CPU 特性

#### 函数原型

::: tip API
```lua
cpu.features()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回包含所有 CPU 特性/标志的字符串，用空格分隔 |

#### 用法说明

```lua
import("core.base.cpu")

local features = cpu.features()
print("CPU 特性:", features)
```

## cpu.has_feature

- 检查 CPU 是否具有特定特性

#### 函数原型

::: tip API
```lua
cpu.has_feature(name: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 必需。要检查的特性名称（例如："sse"、"avx"、"avx2"） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | CPU 支持该特性返回 true，否则返回 false |

#### 用法说明

```lua
import("core.base.cpu")

if cpu.has_feature("avx2") then
    print("支持 AVX2")
end

if cpu.has_feature("sse") then
    print("支持 SSE")
end
```

## cpu.march

- 获取 CPU 微架构

#### 函数原型

::: tip API
```lua
cpu.march()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回 CPU 微架构名称（例如："Skylake"、"Zen 2"、"Alder Lake"） |

#### 用法说明

```lua
import("core.base.cpu")

local march = cpu.march()
print("CPU 架构:", march)  -- 输出: "Skylake"、"Zen 2" 等
```

## cpu.number

- 获取 CPU 核心数

#### 函数原型

::: tip API
```lua
cpu.number()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回 CPU 核心数量 |

#### 用法说明

```lua
import("core.base.cpu")

local cores = cpu.number()
print("CPU 核心数:", cores)
```

## cpu.usagerate

- 获取 CPU 使用率

#### 函数原型

::: tip API
```lua
cpu.usagerate()
```
:::

#### 参数说明

无参数

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回 CPU 使用率，十进制数（0.0 到 1.0，其中 1.0 = 100%） |

#### 用法说明

```lua
import("core.base.cpu")

local usage = cpu.usagerate()
print("CPU 使用率:", math.floor(usage * 100) .. "%")
```

## cpu.info

- 获取所有 CPU 信息

#### 函数原型

::: tip API
```lua
cpu.info(name?: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 可选。要获取的特定字段名称 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| table | 如果未提供 name，返回包含所有 CPU 信息的表格 |
| any | 如果提供了 name，返回特定字段的值 |

#### 用法说明

```lua
import("core.base.cpu")

-- 获取所有 CPU 信息
local info = cpu.info()
print("厂商:", info.vendor)
print("型号:", info.model)
print("系列:", info.family)
print("架构:", info.march)
print("核心数:", info.ncpu)
print("特性:", info.features)
print("使用率:", info.usagerate)
print("型号名称:", info.model_name)

-- 获取特定字段
local vendor = cpu.info("vendor")
local cores = cpu.info("ncpu")
```

