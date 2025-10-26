
# lz4

lz4 模块提供了基于 LZ4 算法的压缩和解压功能，属于 xmake 的扩展模块。

LZ4 是一个非常快速的无损压缩算法，专注于压缩和解压速度。

::: tip 提示
使用此模块需要先导入：`import("core.compress.lz4")`
:::

## lz4.compress

- 压缩数据（帧格式）

#### 函数原型

::: tip API
```lua
lz4.compress(data: <string|bytes>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| data | 必需。要压缩的数据，可以是字符串或 bytes 对象 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| bytes | 压缩后的数据（bytes 对象） |

#### 用法说明

使用 LZ4 帧格式压缩数据，支持字符串或 bytes 对象作为输入，返回压缩后的 bytes 对象。

帧格式包含完整的元数据，自包含，推荐用于一般场景。相比块格式，它包含额外的头信息和校验和，解压时不需要额外信息：

```lua
import("core.compress.lz4")

-- 压缩字符串
local compressed = lz4.compress("hello world")
print("原始大小: 11")
print("压缩后大小:", compressed:size())

-- 也可以压缩 bytes 对象
local bytes_data = bytes("hello world")
local compressed = lz4.compress(bytes_data)
```

## lz4.decompress

- 解压数据（帧格式）

#### 函数原型

::: tip API
```lua
lz4.decompress(compressed: <bytes>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| compressed | 必需。使用 LZ4 帧格式压缩的数据（bytes 对象） |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| bytes | 解压后的数据（bytes 对象） |

#### 用法说明

解压使用 LZ4 帧格式压缩的数据，返回解压后的 bytes 对象。

完整的压缩解压示例：

```lua
import("core.compress.lz4")

local original = "hello world"
local compressed = lz4.compress(original)
local decompressed = lz4.decompress(compressed)
assert(decompressed:str() == original)
```

## lz4.block_compress

- 压缩数据（块格式）

#### 函数原型

::: tip API
```lua
lz4.block_compress(data: <string|bytes>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| data | 必需。要压缩的数据，可以是字符串或 bytes 对象 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| bytes | 压缩后的数据（bytes 对象） |

#### 用法说明

使用 LZ4 块格式压缩数据。块格式更轻量，不包含帧头信息，压缩后的数据更小，但需要自行管理和记录原始数据大小信息。

适合对压缩率要求较高，且可以自行管理元数据的场景。

```lua
import("core.compress.lz4")

-- 压缩字符串
local compressed = lz4.block_compress("hello world")

-- 或压缩 bytes 对象
local bytes_data = bytes("hello world")
local compressed = lz4.block_compress(bytes_data)
```

## lz4.block_decompress

- 解压数据（块格式）

#### 函数原型

::: tip API
```lua
lz4.block_decompress(compressed: <bytes>, realsize: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| compressed | 必需。使用 LZ4 块格式压缩的数据（bytes 对象） |
| realsize | 必需。原始数据的大小 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| bytes | 解压后的数据（bytes 对象） |

#### 用法说明

解压使用 LZ4 块格式压缩的数据，必须提供原始数据的大小 `realsize`。

块格式的压缩解压示例：

```lua
import("core.compress.lz4")

local original = "hello world"
local original_size = #original

-- 压缩
local compressed = lz4.block_compress(original)

-- 解压时需要提供原始大小
local decompressed = lz4.block_decompress(compressed, original_size)
assert(decompressed:str() == original)
```

## lz4.compress_file

- 压缩文件

#### 函数原型

::: tip API
```lua
lz4.compress_file(srcfile: <string>, dstfile: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| srcfile | 必需。要压缩的源文件路径 |
| dstfile | 必需。压缩后的目标文件路径 |

#### 返回值说明

此函数无返回值。

#### 用法说明

直接压缩文件，使用 LZ4 帧格式。相比一次性读取整个文件内容再压缩，这个接口更适合处理大文件，内存占用更低：

```lua
import("core.compress.lz4")

lz4.compress_file("input.txt", "output.lz4")

-- 压缩构建输出
local srcfile = "build/output.log"
local dstfile = "build/output.log.lz4"
lz4.compress_file(srcfile, dstfile)
print("文件已压缩:", dstfile)
```

## lz4.decompress_file

- 解压文件

#### 函数原型

::: tip API
```lua
lz4.decompress_file(srcfile: <string>, dstfile: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| srcfile | 必需。要解压的源文件路径 |
| dstfile | 必需。解压后的目标文件路径 |

#### 返回值说明

此函数无返回值。

#### 用法说明

直接解压文件，恢复原始文件内容：

```lua
import("core.compress.lz4")

lz4.decompress_file("input.lz4", "output.txt")

-- 解压日志文件
local srcfile = "build/output.log.lz4"
local dstfile = "build/output.log"
lz4.decompress_file(srcfile, dstfile)

-- 读取解压后的内容
local content = io.readfile(dstfile)
print(content)
```

## lz4.compress_stream

- 打开压缩流

#### 函数原型

::: tip API
```lua
lz4.compress_stream()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| stream | 压缩流对象，支持以下方法：<br>- `stream:write(data, opt)` - 写入数据进行压缩<br>- `stream:read(buffer, size, opt)` - 读取压缩后的数据 |

#### 用法说明

创建一个压缩流对象，用于流式压缩数据。

流式压缩适合以下场景：
- 处理大文件，边读边压缩，不需要一次性加载全部内容
- 实时数据压缩，如网络流
- 需要控制内存占用的场景

示例：

```lua
import("core.compress.lz4")

local stream = lz4.compress_stream()
local buffer = bytes(8192)

-- 写入数据
stream:write("hello ")
stream:write("world", {beof = true})  -- 最后一次写入标记结束

-- 读取压缩结果
local count, data = stream:read(buffer, 8192)
if count > 0 then
    print("压缩了 " .. count .. " 字节")
end
```

## lz4.decompress_stream

- 打开解压流

#### 函数原型

::: tip API
```lua
lz4.decompress_stream()
```
:::

#### 参数说明

此函数不需要参数。

#### 返回值说明

| 类型 | 描述 |
|------|------|
| stream | 解压流对象，支持以下方法：<br>- `stream:write(data, opt)` - 写入压缩数据<br>- `stream:read(buffer, size, opt)` - 读取解压后的数据 |

#### 用法说明

创建一个解压流对象，用于流式解压数据。

流式解压示例：

```lua
import("core.compress.lz4")

local stream = lz4.decompress_stream()
local buffer = bytes(8192)

-- 写入压缩数据
stream:write(compressed_data, {beof = true})

-- 读取解压结果
local count, data = stream:read(buffer, 8192)
if count > 0 then
    print("解压后:", data:str())
end
```
