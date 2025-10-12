
# bytes

bytes 模块提供了二进制数据缓冲区的操作功能，用于处理原始字节数据。这是 xmake 的扩展模块。

::: tip 提示
使用此模块需要先导入：`import("core.base.bytes")`
:::

## bytes

- 创建字节缓冲区

```lua
import("core.base.bytes")

local buff = bytes(size)
```

bytes 构造函数支持多种创建方式，提供灵活的缓冲区创建和管理。

### 创建指定大小的缓冲区

```lua
-- 创建 1024 字节的缓冲区
local buff = bytes(1024)
print("缓冲区大小:", buff:size())  -- 输出: 1024

-- 创建缓冲区并初始化为指定值
local buff = bytes(100, 0)  -- 初始化为 0
local buff = bytes(100, 255)  -- 初始化为 255
local buff = bytes(100, 'A')  -- 初始化为字符 'A'
```

### 从字符串创建

从字符串创建 bytes 对象，常用于将字符串转换为二进制数据处理：

```lua
local buff = bytes("hello world")
print(buff:size())  -- 输出: 11
print(buff:str())   -- 输出: hello world
```

::: warning 注意
从字符串创建的 bytes 对象是只读的，不能修改。
:::

### 创建切片

从现有 bytes 对象创建切片，共享底层内存，不复制数据：

```lua
local original = bytes("123456789")
local slice = bytes(original, 3, 5)  -- 切片字节 3-5
print(slice:str())  -- 输出: 345
```

### 连接多个缓冲区

```lua
-- 使用参数列表连接
local buff = bytes(bytes("123"), bytes("456"), bytes("789"))
print(buff:str())  -- 输出: 123456789

-- 使用数组连接
local buff = bytes({bytes("123"), bytes("456"), bytes("789")})
print(buff:str())  -- 输出: 123456789
```

### 创建空缓冲区

```lua
local buff = bytes()  -- 空缓冲区
local buff = bytes({})  -- 空缓冲区
```

### 索引操作

bytes 对象支持通过索引访问和修改单个字节（下标从 1 开始）：

```lua
local buff = bytes(9)
buff:copy("123456789")

-- 读取字节
local byte_value = buff[1]
print(byte_value)  -- 输出: 49 (字符 '1' 的 ASCII 码)

-- 修改字节
buff[1] = string.byte('2')
print(buff:str())  -- 输出: 223456789
```

通过范围索引访问切片：

```lua
local buff = bytes("123456789")
local slice = buff[{1, 4}]
print(slice:str())  -- 输出: 1234

-- 范围赋值
local buff = bytes(9)
buff[{1, 9}] = bytes("123456789")
print(buff:str())  -- 输出: 123456789
```

### 连接操作

使用 `..` 操作符连接两个 bytes 对象，创建新的缓冲区：

```lua
local buff1 = bytes("123")
local buff2 = bytes("456")
local buff3 = buff1 .. buff2
print(buff3:str())  -- 输出: 123456
```

## buff:size

- 获取缓冲区大小

```lua
local size = buff:size()
```

返回缓冲区的字节数。

```lua
local buff = bytes(1024)
print(buff:size())  -- 输出: 1024
```

## buff:str

- 转换为字符串

```lua
local str = buff:str()
local str = buff:str(start, last)
```

将 bytes 对象转换为字符串，可选择指定转换的范围。

参数：
- `start`（可选）：起始位置，默认 1
- `last`（可选）：结束位置，默认为缓冲区大小

常用于从网络或文件读取数据后转换为字符串：

```lua
import("core.base.bytes")

local buff = bytes("hello world")
print(buff:str())        -- 输出: hello world
print(buff:str(1, 5))    -- 输出: hello
print(buff:str(7))       -- 输出: world
```

## buff:slice

- 创建切片

```lua
local slice = buff:slice(start, last)
```

创建缓冲区的切片，返回新的 bytes 对象，共享底层内存（不复制数据）。

参数：
- `start`：起始位置
- `last`：结束位置

切片是一种高效的数据访问方式，避免数据复制：

```lua
local buff = bytes("123456789")
local slice = buff:slice(3, 5)
print(slice:str())  -- 输出: 345
print(slice:size()) -- 输出: 3
```

## buff:clone

- 克隆缓冲区

```lua
local new_buff = buff:clone()
```

创建缓冲区的完整副本，分配新的内存并复制所有数据。

与 slice 不同，clone 会复制数据，两者互不影响：

```lua
local original = bytes("hello")
local cloned = original:clone()
print(cloned:str())  -- 输出: hello

-- 修改克隆的缓冲区不影响原缓冲区
cloned[1] = string.byte('H')
print(cloned:str())    -- 输出: Hello
print(original:str())  -- 输出: hello (未改变)
```

## buff:copy

- 复制数据到缓冲区

```lua
buff:copy(src, start, last)
```

从源数据复制到缓冲区的开头。

参数：
- `src`：源数据，可以是字符串或 bytes 对象
- `start`（可选）：源数据起始位置，默认 1
- `last`（可选）：源数据结束位置，默认为源数据大小

```lua
local buff = bytes(9)
buff:copy("123456789")
print(buff:str())  -- 输出: 123456789

-- 只复制部分数据
local buff = bytes(5)
buff:copy("123456789", 5, 9)
print(buff:str())  -- 输出: 56789
```

## buff:copy2

- 复制数据到指定位置

```lua
buff:copy2(pos, src, start, last)
```

从源数据复制到缓冲区的指定位置。

参数：
- `pos`：目标位置
- `src`：源数据，可以是字符串或 bytes 对象
- `start`（可选）：源数据起始位置
- `last`（可选）：源数据结束位置

用于在缓冲区中拼接多段数据：

```lua
local buff = bytes(18)
buff:copy("123456789")       -- 复制到开头
buff:copy2(10, "123456789")  -- 复制到位置 10
print(buff:str())  -- 输出: 123456789123456789
```

## buff:move

- 移动数据到缓冲区开头

```lua
buff:move(start, last)
```

将缓冲区内指定范围的数据移动到开头，支持内存重叠安全移动。

参数：
- `start`：源数据起始位置
- `last`（可选）：源数据结束位置

```lua
local buff = bytes(9):copy("123456789")
buff:move(5, 9)
print(buff:str())  -- 输出: 567896789 (5-9 移动到开头)
```

## buff:move2

- 移动数据到指定位置

```lua
buff:move2(pos, start, last)
```

将缓冲区内指定范围的数据移动到指定位置。

参数：
- `pos`：目标位置
- `start`：源数据起始位置
- `last`（可选）：源数据结束位置

```lua
local buff = bytes(9):copy("123456789")
buff:move2(2, 5, 9)
print(buff:str())  -- 输出: 156789789
```

## buff:u8

- 读取无符号 8 位整数

```lua
local value = buff:u8(offset)
```

从指定偏移位置读取一个字节作为无符号 8 位整数（0-255）。

## buff:u8_set

- 写入无符号 8 位整数

```lua
buff:u8_set(offset, value)
```

向指定偏移位置写入一个字节的无符号 8 位整数值。

```lua
local buff = bytes(10)
buff:u8_set(1, 255)
local value = buff:u8(1)
print(value)  -- 输出: 255
```

## buff:s8

- 读取有符号 8 位整数

```lua
local value = buff:s8(offset)
```

从指定偏移位置读取一个字节作为有符号 8 位整数（-128 到 127）。

## buff:u16le

- 读取无符号 16 位整数（小端）

```lua
local value = buff:u16le(offset)
```

从指定偏移位置读取 2 字节的无符号 16 位整数（小端字节序）。

## buff:u16le_set

- 写入无符号 16 位整数（小端）

```lua
buff:u16le_set(offset, value)
```

向指定偏移位置写入 2 字节的无符号 16 位整数（小端字节序）。

```lua
local buff = bytes(10)
buff:u16le_set(5, 12346)
local value = buff:u16le(5)
print(value)  -- 输出: 12346
```

## buff:u16be

- 读取无符号 16 位整数（大端）

```lua
local value = buff:u16be(offset)
```

从指定偏移位置读取 2 字节的无符号 16 位整数（大端字节序）。

## buff:u16be_set

- 写入无符号 16 位整数（大端）

```lua
buff:u16be_set(offset, value)
```

向指定偏移位置写入 2 字节的无符号 16 位整数（大端字节序）。

## buff:u32le

- 读取无符号 32 位整数（小端）

```lua
local value = buff:u32le(offset)
```

从指定偏移位置读取 4 字节的无符号 32 位整数（小端字节序）。

## buff:u32le_set

- 写入无符号 32 位整数（小端）

```lua
buff:u32le_set(offset, value)
```

向指定偏移位置写入 4 字节的无符号 32 位整数（小端字节序）。

用于处理二进制协议和数据格式：

```lua
local buff = bytes(20)

-- 写入协议头（小端格式）
buff:u16le_set(1, 0x1234)  -- 魔数
buff:u32le_set(3, 100)      -- 数据长度

-- 读取协议头
local magic = buff:u16le(1)
local length = buff:u32le(3)
print(string.format("魔数: 0x%04X, 长度: %d", magic, length))
```

## buff:u32be

- 读取无符号 32 位整数（大端）

```lua
local value = buff:u32be(offset)
```

从指定偏移位置读取 4 字节的无符号 32 位整数（大端字节序）。

## buff:u32be_set

- 写入无符号 32 位整数（大端）

```lua
buff:u32be_set(offset, value)
```

向指定偏移位置写入 4 字节的无符号 32 位整数（大端字节序）。

## buff:dump

- 以十六进制格式显示缓冲区内容

```lua
buff:dump()
buff:dump(start, last)
```

以十六进制和 ASCII 格式显示缓冲区内容，类似于 hexdump 工具。

参数：
- `start`（可选）：起始位置
- `last`（可选）：结束位置

用于调试二进制数据，直观显示内存内容：

```lua
local buff = bytes("hello world, this is a test")
buff:dump()
-- 输出类似：
-- 00000000  68 65 6C 6C 6F 20 77 6F  72 6C 64 2C 20 74 68 69  hello world, thi
-- 00000010  73 20 69 73 20 61 20 74  65 73 74                 s is a test
```

## buff:readonly

- 判断缓冲区是否只读

```lua
local is_readonly = buff:readonly()
```

返回 true 表示缓冲区只读，不能修改。从字符串创建的 bytes 对象是只读的。

```lua
local buff1 = bytes("hello")
print(buff1:readonly())  -- 输出: true (不能修改)

local buff2 = bytes(10)
print(buff2:readonly())  -- 输出: false (可以修改)

-- 尝试修改只读缓冲区会报错
local buff = bytes("test")
-- buff[1] = 65  -- 错误! 只读缓冲区不能修改
```

::: tip 提示
bytes 对象可以在 socket、pipe、lz4 等模块间无缝传递使用。预先创建大缓冲区并复用可以减少内存分配开销。
:::

::: warning 注意
- 索引从 1 开始（遵循 Lua 惯例）
- 从字符串创建的 bytes 对象是只读的
- 切片和原始 bytes 对象共享内存
- 使用整数读写接口时注意字节序（大端/小端）
:::

