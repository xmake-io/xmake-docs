
# lz4

The lz4 module provides compression and decompression functions based on the LZ4 algorithm. It is an extension module of xmake.

LZ4 is an extremely fast lossless compression algorithm, focusing on compression and decompression speed.

::: tip TIP
To use this module, you need to import it first: `import("core.compress.lz4")`
:::

## lz4.compress

- Compress data (frame format)

```lua
import("core.compress.lz4")

local compressed = lz4.compress("hello world")
local compressed = lz4.compress(bytes_data)
```

Compresses data using the LZ4 frame format. Supports string or bytes object as input and returns a compressed bytes object.

The frame format contains complete metadata and is self-contained, recommended for general scenarios. Compared to block format, it includes additional header information and checksums, requiring no extra information for decompression:

```lua
import("core.compress.lz4")

-- Compress text data
local data = "hello world"
local compressed = lz4.compress(data)
print("Original size:", #data)
print("Compressed size:", compressed:size())
```

## lz4.decompress

- Decompress data (frame format)

```lua
import("core.compress.lz4")

local decompressed = lz4.decompress(compressed_data)
```

Decompresses data compressed using the LZ4 frame format and returns a decompressed bytes object.

Complete compression and decompression example:

```lua
import("core.compress.lz4")

local original = "hello world"
local compressed = lz4.compress(original)
local decompressed = lz4.decompress(compressed)
assert(decompressed:str() == original)
```

## lz4.block_compress

- Compress data (block format)

```lua
import("core.compress.lz4")

local compressed = lz4.block_compress("hello world")
local compressed = lz4.block_compress(bytes_data)
```

Compresses data using the LZ4 block format. The block format is more lightweight, does not include frame header information, resulting in smaller compressed data, but requires managing and recording the original data size information yourself.

Suitable for scenarios with higher compression ratio requirements where you can manage metadata yourself.

## lz4.block_decompress

- Decompress data (block format)

```lua
import("core.compress.lz4")

local decompressed = lz4.block_decompress(compressed_data, realsize)
```

Decompresses data compressed using the LZ4 block format. The original data size `realsize` must be provided.

Block format compression and decompression example:

```lua
import("core.compress.lz4")

local original = "hello world"
local original_size = #original

-- Compress
local compressed = lz4.block_compress(original)

-- Decompress with original size
local decompressed = lz4.block_decompress(compressed, original_size)
assert(decompressed:str() == original)
```

## lz4.compress_file

- Compress a file

```lua
import("core.compress.lz4")

lz4.compress_file("input.txt", "output.lz4")
```

Directly compresses a file using the LZ4 frame format. Compared to reading the entire file content and then compressing, this interface is more suitable for handling large files with lower memory usage:

```lua
import("core.compress.lz4")

-- Compress build output
local srcfile = "build/output.log"
local dstfile = "build/output.log.lz4"
lz4.compress_file(srcfile, dstfile)
print("File compressed:", dstfile)
```

## lz4.decompress_file

- Decompress a file

```lua
import("core.compress.lz4")

lz4.decompress_file("input.lz4", "output.txt")
```

Directly decompresses a file and restores the original file content:

```lua
import("core.compress.lz4")

-- Decompress log file
local srcfile = "build/output.log.lz4"
local dstfile = "build/output.log"
lz4.decompress_file(srcfile, dstfile)

-- Read decompressed content
local content = io.readfile(dstfile)
print(content)
```

## lz4.compress_stream

- Open a compression stream

```lua
import("core.compress.lz4")

local stream = lz4.compress_stream()
```

Creates a compression stream object for streaming data compression. The compression stream supports the following methods:

- `stream:write(data, opt)` - Write data for compression
- `stream:read(buffer, size, opt)` - Read compressed data

Streaming compression is suitable for the following scenarios:
- Handling large files, compressing while reading, without loading all content at once
- Real-time data compression, such as network streams
- Scenarios requiring controlled memory usage

Example:

```lua
import("core.compress.lz4")

local stream = lz4.compress_stream()
local buffer = bytes(8192)

-- Write data
stream:write("hello ")
stream:write("world", {beof = true})  -- Mark end on last write

-- Read compression result
local count, data = stream:read(buffer, 8192)
if count > 0 then
    print("Compressed " .. count .. " bytes")
end
```

## lz4.decompress_stream

- Open a decompression stream

```lua
import("core.compress.lz4")

local stream = lz4.decompress_stream()
```

Creates a decompression stream object for streaming data decompression. The decompression stream supports the following methods:

- `stream:write(data, opt)` - Write compressed data
- `stream:read(buffer, size, opt)` - Read decompressed data

Streaming decompression example:

```lua
import("core.compress.lz4")

local stream = lz4.decompress_stream()
local buffer = bytes(8192)

-- Write compressed data
stream:write(compressed_data, {beof = true})

-- Read decompression result
local count, data = stream:read(buffer, 8192)
if count > 0 then
    print("Decompressed:", data:str())
end
```
