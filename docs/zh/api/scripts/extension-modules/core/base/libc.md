# core.base.libc

此模块提供低级 C 库操作，用于直接内存操作。

::: tip 提示
使用此模块需要先导入：`import("core.base.libc")`
:::

此模块封装了标准 C 库的内存分配、复制和操作函数。它提供了一致的接口，适用于标准 Lua 和使用 FFI 的 LuaJIT。

::: warning 注意
这些函数在底层操作，应谨慎使用。使用不当可能导致内存泄漏、崩溃或安全隐患。
:::

## libc.malloc

- 分配内存

#### 函数原型

::: tip API
```lua
libc.malloc(size: <number>, opt?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| size | 必需。要分配的内存大小（字节） |
| opt | 可选。选项表格，支持：<br>- `gc` - 如果为 true，内存将自动垃圾回收 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| userdata | 返回指向分配内存的指针 |

#### 用法说明

```lua
import("core.base.libc")

-- 分配内存并启用垃圾回收
local data = libc.malloc(1024, {gc = true})

-- 分配内存但不自动回收
local data = libc.malloc(1024)
```

## libc.free

- 释放已分配的内存

#### 函数原型

::: tip API
```lua
libc.free(data: <userdata>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| data | 必需。要释放的内存指针 |

#### 返回值说明

无返回值

#### 用法说明

```lua
import("core.base.libc")

local data = libc.malloc(1024)
-- ... 使用 data ...
libc.free(data)
```

## libc.memcpy

- 复制内存

#### 函数原型

::: tip API
```lua
libc.memcpy(dst: <userdata>, src: <userdata>, size: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| dst | 必需。目标内存指针 |
| src | 必需。源内存指针 |
| size | 必需。要复制的字节数 |

#### 返回值说明

无返回值

#### 用法说明

```lua
import("core.base.libc")

local src = libc.malloc(100)
local dst = libc.malloc(100)
libc.memcpy(dst, src, 100)
```

## libc.memmov

- 移动内存（处理重叠区域）

#### 函数原型

::: tip API
```lua
libc.memmov(dst: <userdata>, src: <userdata>, size: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| dst | 必需。目标内存指针 |
| src | 必需。源内存指针 |
| size | 必需。要移动的字节数 |

#### 返回值说明

无返回值

#### 用法说明

```lua
import("core.base.libc")

local data = libc.malloc(100)
libc.memmov(data, src, 100)
```

## libc.memset

- 将内存设置为特定值

#### 函数原型

::: tip API
```lua
libc.memset(data: <userdata>, ch: <number>, size: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| data | 必需。要填充的内存指针 |
| ch | 必需。要设置的字节值 |
| size | 必需。要设置的字节数 |

#### 返回值说明

无返回值

#### 用法说明

```lua
import("core.base.libc")

local data = libc.malloc(1024)
libc.memset(data, 0, 1024)  -- 零初始化内存
```

## libc.strndup

- 复制字符串（指定长度）

#### 函数原型

::: tip API
```lua
libc.strndup(s: <string>, n: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| s | 必需。源字符串 |
| n | 必需。要复制的最大字符数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回复制的字符串 |

#### 用法说明

```lua
import("core.base.libc")

local str = "hello world"
local dup = libc.strndup(str, 5)  -- 返回 "hello"
```

## libc.byteof

- 获取特定偏移处的字节

#### 函数原型

::: tip API
```lua
libc.byteof(data: <userdata>, offset: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| data | 必需。内存指针 |
| offset | 必需。距内存起始位置的字节偏移 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回偏移处的字节值 |

#### 用法说明

```lua
import("core.base.libc")

local data = libc.malloc(100)
local byte = libc.byteof(data, 10)
```

## libc.setbyte

- 在特定偏移处设置字节

#### 函数原型

::: tip API
```lua
libc.setbyte(data: <userdata>, offset: <number>, value: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| data | 必需。内存指针 |
| offset | 必需。距内存起始位置的字节偏移 |
| value | 必需。要设置的字节值 |

#### 返回值说明

无返回值

#### 用法说明

```lua
import("core.base.libc")

local data = libc.malloc(100)
libc.setbyte(data, 10, 255)
```

## libc.dataptr

- 获取数据指针

#### 函数原型

::: tip API
```lua
libc.dataptr(data: <any>, opt?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| data | 必需。要获取指针的数据 |
| opt | 可选。选项表格，支持：<br>- `ffi` - 如果可用则使用 FFI（默认: true）<br>- `gc` - 启用垃圾回收 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| userdata | 返回指向数据的指针 |

#### 用法说明

```lua
import("core.base.libc")

local ptr = libc.dataptr(data, {ffi = true, gc = true})
```

## libc.ptraddr

- 获取指针地址（作为数字）

#### 函数原型

::: tip API
```lua
libc.ptraddr(data: <userdata>, opt?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| data | 必需。指针或数据 |
| opt | 可选。选项表格，支持：<br>- `ffi` - 如果可用则使用 FFI（默认: true） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| number | 返回指针地址（作为数字） |

#### 用法说明

```lua
import("core.base.libc")

local data = libc.malloc(1024)
local addr = libc.ptraddr(data)
print("指针地址:", addr)
```

