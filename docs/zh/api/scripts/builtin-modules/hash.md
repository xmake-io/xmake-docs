
# hash

hash 模块提供了哈希值计算和 UUID 生成功能，这是 xmake 的一个内置模块。

## hash.md5

- 计算文件或二进制数据的 MD5 哈希值

#### 函数原型

::: tip API
```lua
hash.md5(input: <string|bytes>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| input | 文件路径（string）或二进制数据（bytes） |

::: warning 重要提示
- **string 参数只能作为文件路径传入**：如果传入的字符串是文件路径，函数会计算该文件的哈希值
- **二进制数据必须使用 bytes 参数**：要计算二进制数据的哈希值，必须使用 `bytes()` 函数包装数据
- **字符串数据的哈希计算**：如果要计算字符串数据的哈希值，请使用 `hash.strhash32`、`hash.strhash64` 或 `hash.strhash128` 接口
- **常见错误**：如果文件不存在，函数会错误地将文件路径作为字符串数据来计算哈希值，且不会报错，导致结果不正确
:::

#### 用法说明

计算指定文件或二进制数据的 MD5 哈希值，返回十六进制格式的哈希字符串。

**计算文件哈希值：**

```lua
-- 计算文件的 MD5 哈希值
local checksum = hash.md5("/path/to/file.txt")
print("MD5: " .. checksum)
```

**计算二进制数据哈希值：**

```lua
import("core.base.bytes")

-- 计算二进制数据的 MD5 哈希值
local data = bytes("hello")
local checksum = hash.md5(data)
print("MD5: " .. checksum)
```

**错误用法（不要这样做）：**

```lua
-- ❌ 错误：如果 "hello" 不是文件路径，会错误地计算文件路径字符串的哈希值
local checksum = hash.md5("hello")

-- ✅ 正确：使用 strhash 接口计算字符串哈希值
local checksum = hash.strhash32("hello")
-- 或者使用 bytes 包装
local checksum = hash.md5(bytes("hello"))
```

## hash.sha1

- 计算文件或二进制数据的 SHA1 哈希值

#### 函数原型

::: tip API
```lua
hash.sha1(input: <string|bytes>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| input | 文件路径（string）或二进制数据（bytes） |

::: warning 重要提示
- **string 参数只能作为文件路径传入**：如果传入的字符串是文件路径，函数会计算该文件的哈希值
- **二进制数据必须使用 bytes 参数**：要计算二进制数据的哈希值，必须使用 `bytes()` 函数包装数据
- **字符串数据的哈希计算**：如果要计算字符串数据的哈希值，请使用 `hash.strhash32`、`hash.strhash64` 或 `hash.strhash128` 接口
:::

#### 用法说明

计算指定文件或二进制数据的 SHA1 哈希值，返回十六进制格式的哈希字符串。

**计算文件哈希值：**

```lua
-- 计算文件的 SHA1 哈希值
local checksum = hash.sha1("/path/to/file.txt")
```

**计算二进制数据哈希值：**

```lua
import("core.base.bytes")

-- 计算二进制数据的 SHA1 哈希值
local checksum = hash.sha1(bytes("hello"))
```

## hash.sha256

- 计算文件或二进制数据的 SHA256 哈希值

#### 函数原型

::: tip API
```lua
hash.sha256(input: <string|bytes>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| input | 文件路径（string）或二进制数据（bytes） |

::: warning 重要提示
- **string 参数只能作为文件路径传入**：如果传入的字符串是文件路径，函数会计算该文件的哈希值
- **二进制数据必须使用 bytes 参数**：要计算二进制数据的哈希值，必须使用 `bytes()` 函数包装数据
- **字符串数据的哈希计算**：如果要计算字符串数据的哈希值，请使用 `hash.strhash32`、`hash.strhash64` 或 `hash.strhash128` 接口
:::

#### 用法说明

计算指定文件或二进制数据的 SHA256 哈希值，返回十六进制格式的哈希字符串。

SHA256 比 MD5 更安全，常用于包的完整性校验：

**计算文件哈希值：**

```lua
-- 校验下载的包文件
local packagefile = "package.tar.gz"
local checksum = hash.sha256(packagefile)
if checksum ~= expected_hash then
    raise("checksum mismatch!")
end
```

**计算二进制数据哈希值：**

```lua
import("core.base.bytes")

-- 计算二进制数据的 SHA256 哈希值
local checksum = hash.sha256(bytes("hello"))
```

## hash.uuid

- 根据名称生成 UUID

#### 函数原型

::: tip API
```lua
hash.uuid(name: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 名称字符串 |

#### 用法说明

根据给定的名称字符串生成一个确定性的 UUID，相同的名称总是生成相同的 UUID。

内部调用 `hash.uuid4(str)`，格式为：`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`

适合为特定配置生成固定的唯一标识符：

```lua
-- 为不同的编译配置生成确定性 ID
local config_id = hash.uuid("debug-x64-windows")
```

## hash.xxhash32

- 计算文件或二进制数据的 32 位 xxHash 哈希值

#### 函数原型

::: tip API
```lua
hash.xxhash32(input: <string|bytes>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| input | 文件路径（string）或二进制数据（bytes） |

::: warning 重要提示
- **string 参数只能作为文件路径传入**：如果传入的字符串是文件路径，函数会计算该文件的哈希值
- **二进制数据必须使用 bytes 参数**：要计算二进制数据的哈希值，必须使用 `bytes()` 函数包装数据
- **字符串数据的哈希计算**：如果要计算字符串数据的哈希值，请使用 `hash.strhash32` 接口
:::

#### 用法说明

使用 xxHash32 算法计算文件或二进制数据的哈希值，xxHash 是一个极快的非加密哈希算法，适合用于哈希表、校验和等场景。

**计算文件哈希值：**

```lua
-- 计算文件的 xxHash32 哈希值
local checksum = hash.xxhash32("/path/to/file.txt")
```

**计算二进制数据哈希值：**

```lua
import("core.base.bytes")

-- 计算二进制数据的 xxHash32 哈希值
local checksum = hash.xxhash32(bytes("hello"))
```

## hash.xxhash64

- 计算文件或二进制数据的 64 位 xxHash 哈希值

#### 函数原型

::: tip API
```lua
hash.xxhash64(input: <string|bytes>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| input | 文件路径（string）或二进制数据（bytes） |

::: warning 重要提示
- **string 参数只能作为文件路径传入**：如果传入的字符串是文件路径，函数会计算该文件的哈希值
- **二进制数据必须使用 bytes 参数**：要计算二进制数据的哈希值，必须使用 `bytes()` 函数包装数据
- **字符串数据的哈希计算**：如果要计算字符串数据的哈希值，请使用 `hash.strhash64` 接口
:::

#### 用法说明

使用 xxHash64 算法计算文件或二进制数据的哈希值，速度快，适合快速校验。

**计算文件哈希值：**

```lua
-- 计算文件的 xxHash64 哈希值
local checksum = hash.xxhash64("/path/to/file.txt")
```

**计算二进制数据哈希值：**

```lua
import("core.base.bytes")

-- 计算二进制数据的 xxHash64 哈希值
local checksum = hash.xxhash64(bytes("hello"))
```

**错误用法（不要这样做）：**

```lua
-- ❌ 错误：不要直接传入字符串数据
local key = hash.xxhash64(table.concat(params, "|"))

-- ✅ 正确：使用 strhash64 接口计算字符串哈希值
local key = hash.strhash64(table.concat(params, "|"))
-- 或者使用 bytes 包装
local key = hash.xxhash64(bytes(table.concat(params, "|")))
```

## hash.xxhash128

- 计算文件或二进制数据的 128 位 xxHash 哈希值

#### 函数原型

::: tip API
```lua
hash.xxhash128(input: <string|bytes>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| input | 文件路径（string）或二进制数据（bytes） |

::: warning 重要提示
- **string 参数只能作为文件路径传入**：如果传入的字符串是文件路径，函数会计算该文件的哈希值
- **二进制数据必须使用 bytes 参数**：要计算二进制数据的哈希值，必须使用 `bytes()` 函数包装数据
- **字符串数据的哈希计算**：如果要计算字符串数据的哈希值，请使用 `hash.strhash128` 接口
:::

#### 用法说明

使用 xxHash128 算法计算文件或二进制数据的哈希值，提供更长的哈希值以减少冲突。

**计算文件哈希值：**

```lua
-- 计算文件的 xxHash128 哈希值
local checksum = hash.xxhash128("/path/to/file.txt")
```

**计算二进制数据哈希值：**

```lua
import("core.base.bytes")

-- 计算二进制数据的 xxHash128 哈希值
local checksum = hash.xxhash128(bytes("hello"))
```

## hash.strhash32

- 从字符串生成 32 位哈希值

#### 函数原型

::: tip API
```lua
hash.strhash32(input: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| input | 字符串 |

#### 用法说明

从字符串生成 32 位哈希值，返回格式如：`91e8ecf1`

这个接口内部使用 xxhash32，专门用于字符串快速哈希。

## hash.strhash64

- 从字符串生成 64 位哈希值

#### 函数原型

::: tip API
```lua
hash.strhash64(input: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| input | 字符串 |

#### 用法说明

从字符串生成 64 位哈希值，返回格式如：`91e8ecf191e8ecf1`

## hash.strhash128

- 从字符串生成 128 位哈希值

#### 函数原型

::: tip API
```lua
hash.strhash128(input: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| input | 字符串 |

#### 用法说明

从字符串生成 128 位哈希值，返回格式如：`91e8ecf1417f4edfa574e22d7d8d204a`

适合用于生成编译缓存键：

```lua
-- 为编译缓存生成键
local cache_key = hash.strhash128(compiler .. flags .. source)
```

## hash.rand32

- 生成 32 位随机哈希值

#### 函数原型

::: tip API
```lua
hash.rand32()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

生成一个 32 位的随机哈希值。

::: warning 注意
此接口容易触发哈希冲突，不建议用于需要高唯一性的场景。
:::

## hash.rand64

- 生成 64 位随机哈希值

#### 函数原型

::: tip API
```lua
hash.rand64()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

生成一个 64 位的随机哈希值。

## hash.rand128

- 生成 128 位随机哈希值

#### 函数原型

::: tip API
```lua
hash.rand128()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

生成一个 128 位的随机哈希值。

