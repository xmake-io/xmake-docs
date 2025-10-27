# core.base.bit

This module provides bitwise operations for Lua scripts in Xmake.

::: tip TIP
To use this module, you need to import it first: `import("core.base.bit")`
:::

## Overview

Although Lua 5.4+ natively supports bitwise operators, Xmake can be configured to use LuaJIT as the runtime. To ensure compatibility across different Lua versions, Xmake provides the `bit` module for more generic bitwise operations.

This module provides a common set of bitwise operations that work consistently regardless of whether you're using standard Lua or LuaJIT.

## bit.band

- Bitwise AND operation

#### Function Prototype

::: tip API
```lua
bit.band(a: <number>, b: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| a | Required. First number |
| b | Required. Second number |

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the bitwise AND result of a and b |

#### Usage

```lua
import("core.base.bit")

local result = bit.band(5, 3)  -- Returns 1
```

## bit.bor

- Bitwise OR operation

#### Function Prototype

::: tip API
```lua
bit.bor(a: <number>, b: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| a | Required. First number |
| b | Required. Second number |

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the bitwise OR result of a and b |

#### Usage

```lua
import("core.base.bit")

local result = bit.bor(5, 3)  -- Returns 7
```

## bit.bxor

- Bitwise XOR operation

#### Function Prototype

::: tip API
```lua
bit.bxor(a: <number>, b: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| a | Required. First number |
| b | Required. Second number |

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the bitwise XOR result of a and b |

#### Usage

```lua
import("core.base.bit")

local result = bit.bxor(5, 3)  -- Returns 6
```

## bit.bnot

- Bitwise NOT operation

#### Function Prototype

::: tip API
```lua
bit.bnot(a: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| a | Required. Number to negate |

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns the bitwise NOT result of a |

#### Usage

```lua
import("core.base.bit")

local result = bit.bnot(5)  -- Returns the bitwise NOT of 5
```

## bit.lshift

- Left shift operation

#### Function Prototype

::: tip API
```lua
bit.lshift(a: <number>, b: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| a | Required. Number to shift |
| b | Required. Number of bits to shift left |

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns a shifted left by b bits |

#### Usage

```lua
import("core.base.bit")

local result = bit.lshift(5, 2)  -- Returns 20 (5 << 2)
```

## bit.rshift

- Right shift operation

#### Function Prototype

::: tip API
```lua
bit.rshift(a: <number>, b: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| a | Required. Number to shift |
| b | Required. Number of bits to shift right |

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns a shifted right by b bits |

#### Usage

```lua
import("core.base.bit")

local result = bit.rshift(20, 2)  -- Returns 5 (20 >> 2)
```

## bit.tobit

- Convert to 32-bit integer

#### Function Prototype

::: tip API
```lua
bit.tobit(x: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| x | Required. Number to convert |

#### Return Value

| Type | Description |
|------|-------------|
| number | Returns x masked to 32-bit integer (0xffffffff) |

#### Usage

```lua
import("core.base.bit")

local result = bit.tobit(0x12345678)  -- Returns value masked to 32 bits
```

## bit.tohex

- Convert number to hexadecimal string

#### Function Prototype

::: tip API
```lua
bit.tohex(x: <number>, n?: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| x | Required. Number to convert |
| n | Optional. Number of hexadecimal digits (default: 8). Use negative for uppercase |

#### Return Value

| Type | Description |
|------|-------------|
| string | Returns hexadecimal string representation |

#### Usage

```lua
import("core.base.bit")

local hex = bit.tohex(255, 2)      -- Returns "ff"
local hex = bit.tohex(255, -2)     -- Returns "FF"
local hex = bit.tohex(255)         -- Returns "000000ff"
```

