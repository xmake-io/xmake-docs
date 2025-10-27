# core.base.bit

此模块为 Xmake 中的 Lua 脚本提供位运算操作。

::: tip 提示
使用此模块需要先导入：`import("core.base.bit")`
:::

## 概述

尽管 Lua 5.4+ 原生支持位运算操作符，但 xmake 还可以切换到 luajit 作为 runtime。为了兼容性，这边提供了 bit 模块，提供更通用的位运算操作。

此模块提供了一组通用的位运算操作，无论在标准 Lua 还是 LuaJIT 环境下都能保持一致的工作。

## bit.band

- 位与运算

#### 函数原型

::: tip API
```lua
bit.band(a: <number>, b: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| a | 必需。第一个数字 |
| b | 必需。第二个数字 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回 a 和 b 的位与结果 |

#### 用法说明

```lua
import("core.base.bit")

local result = bit.band(5, 3)  -- 返回 1
```

## bit.bor

- 位或运算

#### 函数原型

::: tip API
```lua
bit.bor(a: <number>, b: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| a | 必需。第一个数字 |
| b | 必需。第二个数字 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回 a 和 b 的位或结果 |

#### 用法说明

```lua
import("core.base.bit")

local result = bit.bor(5, 3)  -- 返回 7
```

## bit.bxor

- 位异或运算

#### 函数原型

::: tip API
```lua
bit.bxor(a: <number>, b: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| a | 必需。第一个数字 |
| b | 必需。第二个数字 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回 a 和 b 的位异或结果 |

#### 用法说明

```lua
import("core.base.bit")

local result = bit.bxor(5, 3)  -- 返回 6
```

## bit.bnot

- 位非运算

#### 函数原型

::: tip API
```lua
bit.bnot(a: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| a | 必需。要取反的数字 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回 a 的位非结果 |

#### 用法说明

```lua
import("core.base.bit")

local result = bit.bnot(5)  -- 返回 5 的位非结果
```

## bit.lshift

- 左移运算

#### 函数原型

::: tip API
```lua
bit.lshift(a: <number>, b: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| a | 必需。要移动的数字 |
| b | 必需。左移的位数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回 a 左移 b 位的结果 |

#### 用法说明

```lua
import("core.base.bit")

local result = bit.lshift(5, 2)  -- 返回 20 (5 << 2)
```

## bit.rshift

- 右移运算

#### 函数原型

::: tip API
```lua
bit.rshift(a: <number>, b: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| a | 必需。要移动的数字 |
| b | 必需。右移的位数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回 a 右移 b 位的结果 |

#### 用法说明

```lua
import("core.base.bit")

local result = bit.rshift(20, 2)  -- 返回 5 (20 >> 2)
```

## bit.tobit

- 转换为 32 位整数

#### 函数原型

::: tip API
```lua
bit.tobit(x: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| x | 必需。要转换的数字 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回 x 掩码为 32 位整数后的值 (0xffffffff) |

#### 用法说明

```lua
import("core.base.bit")

local result = bit.tobit(0x12345678)  -- 返回掩码为 32 位后的值
```

## bit.tohex

- 转换为十六进制字符串

#### 函数原型

::: tip API
```lua
bit.tohex(x: <number>, n?: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| x | 必需。要转换的数字 |
| n | 可选。十六进制位数（默认: 8）。使用负数表示大写 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回十六进制字符串表示 |

#### 用法说明

```lua
import("core.base.bit")

local hex = bit.tohex(255, 2)      -- 返回 "ff"
local hex = bit.tohex(255, -2)     -- 返回 "FF"
local hex = bit.tohex(255)         -- 返回 "000000ff"
```

