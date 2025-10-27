# core.base.libc

This module provides low-level C library operations for direct memory manipulation.

::: tip TIP
To use this module, you need to import it first: `import("core.base.libc")`
:::

This module wraps standard C library functions for memory allocation, copying, and manipulation. It provides consistent interfaces that work with both standard Lua and LuaJIT with FFI.

::: warning WARNING
These functions operate at a low level and should be used with caution. Improper use can lead to memory leaks, crashes, or security vulnerabilities.
:::

## libc.malloc

- Allocate memory

#### Function Prototype

::: tip API
```lua
libc.malloc(size: <number>, opt?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| size | Required. Size of memory to allocate in bytes |
| opt | Optional. Options table, supports:<br>- `gc` - If true, memory will be automatically garbage collected |

#### Return Value

| Type | Description |
|------|-------------|
| userdata | Returns a pointer to the allocated memory |

#### Usage

```lua
import("core.base.libc")

-- Allocate memory with garbage collection
local data = libc.malloc(1024, {gc = true})

-- Allocate memory without auto GC
local data = libc.malloc(1024)
```

## libc.free

- Free allocated memory

#### Function Prototype

::: tip API
```lua
libc.free(data: <userdata>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| data | Required. Pointer to memory to free |

#### Return Value

No return value

#### Usage

```lua
import("core.base.libc")

local data = libc.malloc(1024)
-- ... use data ...
libc.free(data)
```

## libc.memcpy

- Copy memory

#### Function Prototype

::: tip API
```lua
libc.memcpy(dst: <userdata>, src: <userdata>, size: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| dst | Required. Destination memory pointer |
| src | Required. Source memory pointer |
| size | Required. Number of bytes to copy |

#### Return Value

No return value

#### Usage

```lua
import("core.base.libc")

local src = libc.malloc(100)
local dst = libc.malloc(100)
libc.memcpy(dst, src, 100)
```

## libc.memmov

- Move memory (handles overlapping regions)

#### Function Prototype

::: tip API
```lua
libc.memmov(dst: <userdata>, src: <userdata>, size: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| dst | Required. Destination memory pointer |
| src | Required. Source memory pointer |
| size | Required. Number of bytes to move |

#### Return Value

No return value

#### Usage

```lua
import("core.base.libc")

local data = libc.malloc(100)
libc.memmov(data, src, 100)
```

## libc.memset

- Set memory to a specific value

#### Function Prototype

::: tip API
```lua
libc.memset(data: <userdata>, ch: <number>, size: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| data | Required. Memory pointer to fill |
| ch | Required. Byte value to set |
| size | Required. Number of bytes to set |

#### Return Value

No return value

#### Usage

```lua
import("core.base.libc")

local data = libc.malloc(1024)
libc.memset(data, 0, 1024)  -- Zero-initialize memory
```

## libc.strndup

- Duplicate a string with specified length

#### Function Prototype

::: tip API
```lua
libc.strndup(s: <string>, n: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| s | Required. Source string |
| n | Required. Maximum number of characters to duplicate |

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns the duplicated string |

#### Usage

```lua
import("core.base.libc")

local str = "hello world"
local dup = libc.strndup(str, 5)  -- Returns "hello"
```

## libc.byteof

- Get a byte at a specific offset

#### Function Prototype

::: tip API
```lua
libc.byteof(data: <userdata>, offset: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| data | Required. Memory pointer |
| offset | Required. Byte offset from start of memory |

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the byte value at the offset |

#### Usage

```lua
import("core.base.libc")

local data = libc.malloc(100)
local byte = libc.byteof(data, 10)
```

## libc.setbyte

- Set a byte at a specific offset

#### Function Prototype

::: tip API
```lua
libc.setbyte(data: <userdata>, offset: <number>, value: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| data | Required. Memory pointer |
| offset | Required. Byte offset from start of memory |
| value | Required. Byte value to set |

#### Return Value

No return value

#### Usage

```lua
import("core.base.libc")

local data = libc.malloc(100)
libc.setbyte(data, 10, 255)
```

## libc.dataptr

- Get data pointer

#### Function Prototype

::: tip API
```lua
libc.dataptr(data: <any>, opt?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| data | Required. Data to get pointer for |
| opt | Optional. Options table, supports:<br>- `ffi` - Use FFI if available (default: true)<br>- `gc` - Enable garbage collection |

#### Return Value

| Type | Description |
|------|-------------|
| userdata | Returns a pointer to the data |

#### Usage

```lua
import("core.base.libc")

local ptr = libc.dataptr(data, {ffi = true, gc = true})
```

## libc.ptraddr

- Get pointer address as a number

#### Function Prototype

::: tip API
```lua
libc.ptraddr(data: <userdata>, opt?: <table>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| data | Required. Pointer or data |
| opt | Optional. Options table, supports:<br>- `ffi` - Use FFI if available (default: true) |

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the pointer address as a number |

#### Usage

```lua
import("core.base.libc")

local data = libc.malloc(1024)
local addr = libc.ptraddr(data)
print("Pointer address:", addr)
```

