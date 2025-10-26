
# bytes

The bytes module provides binary data buffer operations for handling raw byte data. This is an extension module of xmake.

::: tip TIP
To use this module, you need to import it first: `import("core.base.bytes")`
:::

## bytes

- Create a byte buffer

#### Function Prototype

::: tip API
```lua
bytes(size: <number>, initval: <number|string>)
bytes(str: <string>)
bytes(buffer: <bytes>, offset: <number>, size: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| size | Required. Buffer size in bytes |
| initval | Optional. Initial value for buffer (number or character) |
| str | Required. String to convert to bytes object |
| buffer | Required. Source bytes buffer for slice |
| offset | Required. Offset position in source buffer |
| size | Required. Size of the slice |

#### Return Value

| Type | Description |
|------|-------------|
| bytes | Returns a bytes buffer object |

#### Usage

The bytes constructor supports multiple creation methods, providing flexible buffer creation and management.

##### Create a buffer of specified size

```lua
-- Create a 1024-byte buffer
local buff = bytes(1024)
print("Buffer size:", buff:size())  -- Output: 1024

-- Create buffer and initialize with specified value
local buff = bytes(100, 0)   -- Initialize to 0
local buff = bytes(100, 255) -- Initialize to 255
local buff = bytes(100, 'A') -- Initialize to character 'A'
```

##### Create from string

Create a bytes object from a string, commonly used to convert strings to binary data:

```lua
local buff = bytes("hello world")
print(buff:size())  -- Output: 11
print(buff:str())   -- Output: hello world
```

::: warning WARNING
bytes objects created from strings are read-only and cannot be modified.
:::

##### Create a slice

Create a slice from an existing bytes object, sharing underlying memory without copying data:

```lua
local original = bytes("123456789")
local slice = bytes(original, 3, 5)  -- Slice bytes 3-5
print(slice:str())  -- Output: 345
```

##### Concatenate multiple buffers

```lua
-- Concatenate using parameter list
local buff = bytes(bytes("123"), bytes("456"), bytes("789"))
print(buff:str())  -- Output: 123456789

-- Concatenate using array
local buff = bytes({bytes("123"), bytes("456"), bytes("789")})
print(buff:str())  -- Output: 123456789
```

##### Create empty buffer

```lua
local buff = bytes()   -- Empty buffer
local buff = bytes({}) -- Empty buffer
```

##### Index operations

bytes objects support accessing and modifying individual bytes through indexing (indices start from 1):

```lua
local buff = bytes(9)
buff:copy("123456789")

-- Read byte
local byte_value = buff[1]
print(byte_value)  -- Output: 49 (ASCII code for '1')

-- Modify byte
buff[1] = string.byte('2')
print(buff:str())  -- Output: 223456789
```

Access slices through range indexing:

```lua
local buff = bytes("123456789")
local slice = buff[{1, 4}]
print(slice:str())  -- Output: 1234

-- Range assignment
local buff = bytes(9)
buff[{1, 9}] = bytes("123456789")
print(buff:str())  -- Output: 123456789
```

##### Concatenation operation

Use the `..` operator to concatenate two bytes objects, creating a new buffer:

```lua
local buff1 = bytes("123")
local buff2 = bytes("456")
local buff3 = buff1 .. buff2
print(buff3:str())  -- Output: 123456
```

## bytes:size

- Get buffer size

#### Function Prototype

::: tip API
```lua
bytes:size()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns the number of bytes in the buffer.

```lua
local buff = bytes(1024)
print(buff:size())  -- Output: 1024
```

## bytes:str

- Convert to string

#### Function Prototype

::: tip API
```lua
bytes:str(start: <number>, last: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| start | Start position (optional, default 1) |
| last | End position (optional, default buffer size) |

#### Usage

Converts a bytes object to a string, optionally specifying the conversion range.

Parameters:
- `start` (optional): Start position, default 1
- `last` (optional): End position, default is buffer size

Commonly used to convert data read from network or files to strings:

```lua
import("core.base.bytes")

local buff = bytes("hello world")
print(buff:str())        -- Output: hello world
print(buff:str(1, 5))    -- Output: hello
print(buff:str(7))       -- Output: world
```

## bytes:slice

- Create a slice

#### Function Prototype

::: tip API
```lua
bytes:slice(start: <number>, last: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| start | Start position |
| last | End position |

#### Usage

Creates a slice of the buffer, returns a new bytes object that shares the underlying memory (no data copying).

Parameters:
- `start`: Start position
- `last`: End position

Slicing is an efficient data access method that avoids data copying:

```lua
local buff = bytes("123456789")
local slice = buff:slice(3, 5)
print(slice:str())  -- Output: 345
print(slice:size()) -- Output: 3
```

## bytes:clone

- Clone the buffer

#### Function Prototype

::: tip API
```lua
bytes:clone()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Creates a complete copy of the buffer, allocating new memory and copying all data.

Unlike slice, clone copies data, so they don't affect each other:

```lua
local original = bytes("hello")
local cloned = original:clone()
print(cloned:str())  -- Output: hello

-- Modifying cloned buffer doesn't affect original
cloned[1] = string.byte('H')
print(cloned:str())    -- Output: Hello
print(original:str())  -- Output: hello (unchanged)
```

## bytes:copy

- Copy data to buffer

#### Function Prototype

::: tip API
```lua
bytes:copy(src: <string|bytes>, start: <number>, last: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| src | Source data, can be string or bytes object |
| start | Source data start position (optional, default 1) |
| last | Source data end position (optional, default source data size) |

#### Usage

Copies data from source to the beginning of the buffer.

Parameters:
- `src`: Source data, can be string or bytes object
- `start` (optional): Source data start position, default 1
- `last` (optional): Source data end position, default is source data size

```lua
local buff = bytes(9)
buff:copy("123456789")
print(buff:str())  -- Output: 123456789

-- Copy only partial data
local buff = bytes(5)
buff:copy("123456789", 5, 9)
print(buff:str())  -- Output: 56789
```

## bytes:copy2

- Copy data to specified position

#### Function Prototype

::: tip API
```lua
bytes:copy2(pos: <number>, src: <string|bytes>, start: <number>, last: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| pos | Target position |
| src | Source data, can be string or bytes object |
| start | Source data start position (optional) |
| last | Source data end position (optional) |

#### Usage

Copies data from source to the specified position in the buffer.

Parameters:
- `pos`: Target position
- `src`: Source data, can be string or bytes object
- `start` (optional): Source data start position
- `last` (optional): Source data end position

Used to concatenate multiple segments of data in a buffer:

```lua
local buff = bytes(18)
buff:copy("123456789")       -- Copy to beginning
buff:copy2(10, "123456789")  -- Copy to position 10
print(buff:str())  -- Output: 123456789123456789
```

## bytes:move

- Move data to buffer beginning

#### Function Prototype

::: tip API
```lua
bytes:move(start: <number>, last: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| start | Source data start position |
| last | Source data end position (optional) |

#### Usage

Moves the specified range of data within the buffer to the beginning, supporting memory overlap-safe movement.

Parameters:
- `start`: Source data start position
- `last` (optional): Source data end position

```lua
local buff = bytes(9):copy("123456789")
buff:move(5, 9)
print(buff:str())  -- Output: 567896789 (5-9 moved to beginning)
```

## bytes:move2

- Move data to specified position

#### Function Prototype

::: tip API
```lua
bytes:move2(pos: <number>, start: <number>, last: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| pos | Target position |
| start | Source data start position |
| last | Source data end position (optional) |

#### Usage

Moves the specified range of data within the buffer to the specified position.

Parameters:
- `pos`: Target position
- `start`: Source data start position
- `last` (optional): Source data end position

```lua
local buff = bytes(9):copy("123456789")
buff:move2(2, 5, 9)
print(buff:str())  -- Output: 156789789
```

## bytes:u8

- Read unsigned 8-bit integer

#### Function Prototype

::: tip API
```lua
bytes:u8(offset: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| offset | Byte offset position |

#### Usage

Reads a byte from the specified offset as an unsigned 8-bit integer (0-255).

## bytes:u8_set

- Write unsigned 8-bit integer

#### Function Prototype

::: tip API
```lua
bytes:u8_set(offset: <number>, value: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| offset | Byte offset position |
| value | Value to write (0-255) |

#### Usage

Writes an unsigned 8-bit integer to the specified offset.

Writes an unsigned 8-bit integer value to the specified offset.

```lua
local buff = bytes(10)
buff:u8_set(1, 255)
local value = buff:u8(1)
print(value)  -- Output: 255
```

## bytes:s8

- Read signed 8-bit integer

#### Function Prototype

::: tip API
```lua
bytes:s8(offset: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| offset | Byte offset position |

#### Usage

Reads a byte from the specified offset as a signed 8-bit integer (-128 to 127).

## bytes:u16le

- Read unsigned 16-bit integer (little-endian)

#### Function Prototype

::: tip API
```lua
bytes:u16le(offset: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| offset | Byte offset position |

#### Usage

参数Reads 2 bytes from the specified offset as an unsigned 16-bit integer (little-endian byte order).

## bytes:u16le_set

- Write unsigned 16-bit integer (little-endian)

#### Function Prototype

::: tip API
```lua
bytes:u16le_set(offset: <number>, value: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| offset | Byte offset position |
| value | Value to write (0-65535) |

#### Usage

Writes an unsigned 16-bit integer to the specified offset (little-endian byte order).

```lua
local buff = bytes(10)
buff:u16le_set(5, 12346)
local value = buff:u16le(5)
print(value)  -- Output: 12346
```

## bytes:u16be

- Read unsigned 16-bit integer (big-endian)

#### Function Prototype

::: tip API
```lua
bytes:u16be(offset: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| offset | Byte offset position |

#### Usage

Reads 2 bytes from the specified offset as an unsigned 16-bit integer (big-endian byte order).

## bytes:u16be_set

- Write unsigned 16-bit integer (big-endian)

#### Function Prototype

::: tip API
```lua
bytes:u16be_set(offset: <number>, value: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| offset | Byte offset position |
| value | Value to write (0-65535) |

#### Usage

Writes an unsigned 16-bit integer to the specified offset (big-endian byte order).

## bytes:u32le

- Read unsigned 32-bit integer (little-endian)

#### Function Prototype

::: tip API
```lua
bytes:u32le(offset: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| offset | Byte offset position |

#### Usage

Reads 4 bytes from the specified offset as an unsigned 32-bit integer (little-endian byte order).

## bytes:u32le_set

- Write unsigned 32-bit integer (little-endian)

#### Function Prototype

::: tip API
```lua
bytes:u32le_set(offset: <number>, value: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| offset | Byte offset position |
| value | Value to write (0-4294967295) |

#### Usage

Writes an unsigned 32-bit integer to the specified offset (little-endian byte order).

Used for handling binary protocols and data formats:

```lua
local buff = bytes(20)

-- Write protocol header (little-endian format)
buff:u16le_set(1, 0x1234)  -- Magic number
buff:u32le_set(3, 100)      -- Data length

-- Read protocol header
local magic = buff:u16le(1)
local length = buff:u32le(3)
print(string.format("Magic: 0x%04X, Length: %d", magic, length))
```

## bytes:u32be

- Read unsigned 32-bit integer (big-endian)

#### Function Prototype

::: tip API
```lua
bytes:u32be(offset: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| offset | Byte offset position |

#### Usage

Reads 4 bytes from the specified offset as an unsigned 32-bit integer (big-endian byte order).

## bytes:u32be_set

- Write unsigned 32-bit integer (big-endian)

#### Function Prototype

::: tip API
```lua
bytes:u32be_set(offset: <number>, value: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| offset | Byte offset position |
| value | Value to write (0-4294967295) |

#### Usage

Writes an unsigned 32-bit integer to the specified offset (big-endian byte order).

## bytes:dump

- Display buffer contents in hexadecimal format

#### Function Prototype

::: tip API
```lua
bytes:dump(start: <number>, last: <number>)
```
:::

#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| start | Start position (optional, default 1) |
| last | End position (optional, default buffer size) |

#### Usage

Displays buffer contents in hexadecimal and ASCII format, similar to the hexdump tool.

Parameters:
- `start` (optional): Start position
- `last` (optional): End position

Used for debugging binary data, visually displaying memory contents:

```lua
local buff = bytes("hello world, this is a test")
buff:dump()
-- Output similar to:
-- 00000000  68 65 6C 6C 6F 20 77 6F  72 6C 64 2C 20 74 68 69  hello world, thi
-- 00000010  73 20 69 73 20 61 20 74  65 73 74                 s is a test
```

## bytes:readonly

- Check if buffer is read-only

#### Function Prototype

::: tip API
```lua
bytes:readonly()
```
:::

#### Parameter Description

No parameters required for this function.

#### Usage

Returns true if the buffer is read-only and cannot be modified. bytes objects created from strings are read-only.

```lua
local buff1 = bytes("hello")
print(buff1:readonly())  -- Output: true (cannot modify)

local buff2 = bytes(10)
print(buff2:readonly())  -- Output: false (can modify)

-- Attempting to modify read-only buffer will raise error
local buff = bytes("test")
-- buff[1] = 65  -- Error! Read-only buffer cannot be modified
```

::: tip TIP
bytes objects can be seamlessly used across socket, pipe, lz4, and other modules. Pre-creating large buffers and reusing them can reduce memory allocation overhead.
:::

::: warning WARNING
- Indices start from 1 (following Lua convention)
- bytes objects created from strings are read-only
- Slices share memory with the original bytes object
- Pay attention to byte order (big-endian/little-endian) when using integer read/write interfaces
:::

