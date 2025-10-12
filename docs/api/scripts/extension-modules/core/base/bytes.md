
# bytes

The bytes module provides binary data buffer operations for handling raw byte data. This is an extension module of xmake.

::: tip TIP
To use this module, you need to import it first: `import("core.base.bytes")`
:::

## bytes

- Create a byte buffer

```lua
import("core.base.bytes")

local buff = bytes(size)
```

The bytes constructor supports multiple creation methods, providing flexible buffer creation and management.

### Create a buffer of specified size

```lua
-- Create a 1024-byte buffer
local buff = bytes(1024)
print("Buffer size:", buff:size())  -- Output: 1024

-- Create buffer and initialize with specified value
local buff = bytes(100, 0)   -- Initialize to 0
local buff = bytes(100, 255) -- Initialize to 255
local buff = bytes(100, 'A') -- Initialize to character 'A'
```

### Create from string

Create a bytes object from a string, commonly used to convert strings to binary data:

```lua
local buff = bytes("hello world")
print(buff:size())  -- Output: 11
print(buff:str())   -- Output: hello world
```

::: warning WARNING
bytes objects created from strings are read-only and cannot be modified.
:::

### Create a slice

Create a slice from an existing bytes object, sharing underlying memory without copying data:

```lua
local original = bytes("123456789")
local slice = bytes(original, 3, 5)  -- Slice bytes 3-5
print(slice:str())  -- Output: 345
```

### Concatenate multiple buffers

```lua
-- Concatenate using parameter list
local buff = bytes(bytes("123"), bytes("456"), bytes("789"))
print(buff:str())  -- Output: 123456789

-- Concatenate using array
local buff = bytes({bytes("123"), bytes("456"), bytes("789")})
print(buff:str())  -- Output: 123456789
```

### Create empty buffer

```lua
local buff = bytes()   -- Empty buffer
local buff = bytes({}) -- Empty buffer
```

### Index operations

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

### Concatenation operation

Use the `..` operator to concatenate two bytes objects, creating a new buffer:

```lua
local buff1 = bytes("123")
local buff2 = bytes("456")
local buff3 = buff1 .. buff2
print(buff3:str())  -- Output: 123456
```

## buff:size

- Get buffer size

```lua
local size = buff:size()
```

Returns the number of bytes in the buffer.

```lua
local buff = bytes(1024)
print(buff:size())  -- Output: 1024
```

## buff:str

- Convert to string

```lua
local str = buff:str()
local str = buff:str(start, last)
```

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

## buff:slice

- Create a slice

```lua
local slice = buff:slice(start, last)
```

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

## buff:clone

- Clone the buffer

```lua
local new_buff = buff:clone()
```

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

## buff:copy

- Copy data to buffer

```lua
buff:copy(src, start, last)
```

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

## buff:copy2

- Copy data to specified position

```lua
buff:copy2(pos, src, start, last)
```

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

## buff:move

- Move data to buffer beginning

```lua
buff:move(start, last)
```

Moves the specified range of data within the buffer to the beginning, supporting memory overlap-safe movement.

Parameters:
- `start`: Source data start position
- `last` (optional): Source data end position

```lua
local buff = bytes(9):copy("123456789")
buff:move(5, 9)
print(buff:str())  -- Output: 567896789 (5-9 moved to beginning)
```

## buff:move2

- Move data to specified position

```lua
buff:move2(pos, start, last)
```

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

## buff:u8

- Read unsigned 8-bit integer

```lua
local value = buff:u8(offset)
```

Reads a byte from the specified offset as an unsigned 8-bit integer (0-255).

## buff:u8_set

- Write unsigned 8-bit integer

```lua
buff:u8_set(offset, value)
```

Writes an unsigned 8-bit integer value to the specified offset.

```lua
local buff = bytes(10)
buff:u8_set(1, 255)
local value = buff:u8(1)
print(value)  -- Output: 255
```

## buff:s8

- Read signed 8-bit integer

```lua
local value = buff:s8(offset)
```

Reads a byte from the specified offset as a signed 8-bit integer (-128 to 127).

## buff:u16le

- Read unsigned 16-bit integer (little-endian)

```lua
local value = buff:u16le(offset)
```

Reads 2 bytes from the specified offset as an unsigned 16-bit integer (little-endian byte order).

## buff:u16le_set

- Write unsigned 16-bit integer (little-endian)

```lua
buff:u16le_set(offset, value)
```

Writes an unsigned 16-bit integer to the specified offset (little-endian byte order).

```lua
local buff = bytes(10)
buff:u16le_set(5, 12346)
local value = buff:u16le(5)
print(value)  -- Output: 12346
```

## buff:u16be

- Read unsigned 16-bit integer (big-endian)

```lua
local value = buff:u16be(offset)
```

Reads 2 bytes from the specified offset as an unsigned 16-bit integer (big-endian byte order).

## buff:u16be_set

- Write unsigned 16-bit integer (big-endian)

```lua
buff:u16be_set(offset, value)
```

Writes an unsigned 16-bit integer to the specified offset (big-endian byte order).

## buff:u32le

- Read unsigned 32-bit integer (little-endian)

```lua
local value = buff:u32le(offset)
```

Reads 4 bytes from the specified offset as an unsigned 32-bit integer (little-endian byte order).

## buff:u32le_set

- Write unsigned 32-bit integer (little-endian)

```lua
buff:u32le_set(offset, value)
```

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

## buff:u32be

- Read unsigned 32-bit integer (big-endian)

```lua
local value = buff:u32be(offset)
```

Reads 4 bytes from the specified offset as an unsigned 32-bit integer (big-endian byte order).

## buff:u32be_set

- Write unsigned 32-bit integer (big-endian)

```lua
buff:u32be_set(offset, value)
```

Writes an unsigned 32-bit integer to the specified offset (big-endian byte order).

## buff:dump

- Display buffer contents in hexadecimal format

```lua
buff:dump()
buff:dump(start, last)
```

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

## buff:readonly

- Check if buffer is read-only

```lua
local is_readonly = buff:readonly()
```

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

