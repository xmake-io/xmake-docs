
# hash

The hash module provides hash value calculation and UUID generation functions. It is a built-in module of xmake.

## hash.md5

- Calculate the MD5 hash value of a file or binary data

#### Function Prototype

::: tip API
```lua
hash.md5(input: <string|bytes>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| input | File path (string) or binary data (bytes) |

::: warning Important Notes
- **String parameter is only for file paths**: If a string is passed, the function will calculate the hash value of that file
- **Binary data must use bytes parameter**: To calculate the hash value of binary data, you must wrap the data with the `bytes()` function
- **Common mistake**: If the file doesn't exist, the function will incorrectly treat the file path as string data to calculate the hash value, and it won't report an error, resulting in incorrect results
:::

#### Usage

Calculates the MD5 hash value of the specified file or binary data and returns a hexadecimal format hash string.

**Calculate file hash value:**

```lua
-- Calculate MD5 hash value of a file
local checksum = hash.md5("/path/to/file.txt")
print("MD5: " .. checksum)
```

**Calculate binary data hash value:**

```lua
import("core.base.bytes")

-- Calculate MD5 hash value of binary data
local data = bytes("hello")
local checksum = hash.md5(data)
print("MD5: " .. checksum)
```

**Incorrect usage (don't do this):**

```lua
-- ❌ Wrong: If "hello" is not a file path, it will incorrectly calculate the hash of the file path string
local checksum = hash.md5("hello")

-- ✅ Correct: Use bytes wrapper for binary data
local checksum = hash.md5(bytes("hello"))
```

## hash.sha1

- Calculate the SHA1 hash value of a file or binary data

#### Function Prototype

::: tip API
```lua
hash.sha1(input: <string|bytes>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| input | File path (string) or binary data (bytes) |

::: warning Important Notes
- **String parameter is only for file paths**: If a string is passed, the function will calculate the hash value of that file
- **Binary data must use bytes parameter**: To calculate the hash value of binary data, you must wrap the data with the `bytes()` function
:::

#### Usage

Calculates the SHA1 hash value of the specified file or binary data and returns a hexadecimal format hash string.

**Calculate file hash value:**

```lua
-- Calculate SHA1 hash value of a file
local checksum = hash.sha1("/path/to/file.txt")
```

**Calculate binary data hash value:**

```lua
import("core.base.bytes")

-- Calculate SHA1 hash value of binary data
local checksum = hash.sha1(bytes("hello"))
```

## hash.sha256

- Calculate the SHA256 hash value of a file or binary data

#### Function Prototype

::: tip API
```lua
hash.sha256(input: <string|bytes>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| input | File path (string) or binary data (bytes) |

::: warning Important Notes
- **String parameter is only for file paths**: If a string is passed, the function will calculate the hash value of that file
- **Binary data must use bytes parameter**: To calculate the hash value of binary data, you must wrap the data with the `bytes()` function
:::

#### Usage

Calculates the SHA256 hash value of the specified file or binary data and returns a hexadecimal format hash string.

SHA256 is more secure than MD5 and is commonly used for package integrity verification:

**Calculate file hash value:**

```lua
-- Verify downloaded package file
local packagefile = "package.tar.gz"
local checksum = hash.sha256(packagefile)
if checksum ~= expected_hash then
    raise("checksum mismatch!")
end
```

**Calculate binary data hash value:**

```lua
import("core.base.bytes")

-- Calculate SHA256 hash value of binary data
local checksum = hash.sha256(bytes("hello"))
```

## hash.uuid

- Generate a UUID based on a name

#### Function Prototype

::: tip API
```lua
hash.uuid(name: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| name | Name string for UUID generation |

#### Usage

```lua
local id = hash.uuid("name")
```

Generates a deterministic UUID based on the given name string. The same name always generates the same UUID.

Internally calls `hash.uuid4(str)`, format: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`

Suitable for generating fixed unique identifiers for specific configurations:

```lua
-- Generate deterministic IDs for different build configurations
local config_id = hash.uuid("debug-x64-windows")
```

## hash.xxhash32

- Calculate the 32-bit xxHash hash value of a file or binary data

#### Function Prototype

::: tip API
```lua
hash.xxhash32(input: <string|bytes>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| input | File path (string) or binary data (bytes) |

::: warning Important Notes
- **String parameter is only for file paths**: If a string is passed, the function will calculate the hash value of that file
- **Binary data must use bytes parameter**: To calculate the hash value of binary data, you must wrap the data with the `bytes()` function
:::

#### Usage

Calculates hash value using the xxHash32 algorithm. xxHash is an extremely fast non-cryptographic hash algorithm suitable for hash tables, checksums, and other scenarios.

**Calculate file hash value:**

```lua
-- Calculate xxHash32 hash value of a file
local checksum = hash.xxhash32("/path/to/file.txt")
```

**Calculate binary data hash value:**

```lua
import("core.base.bytes")

-- Calculate xxHash32 hash value of binary data
local checksum = hash.xxhash32(bytes("hello"))
```

## hash.xxhash64

- Calculate the 64-bit xxHash hash value of a file or binary data

#### Function Prototype

::: tip API
```lua
hash.xxhash64(input: <string|bytes>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| input | File path (string) or binary data (bytes) |

::: warning Important Notes
- **String parameter is only for file paths**: If a string is passed, the function will calculate the hash value of that file
- **Binary data must use bytes parameter**: To calculate the hash value of binary data, you must wrap the data with the `bytes()` function
:::

#### Usage

Calculates hash value using the xxHash64 algorithm. Fast and suitable for quick verification.

**Calculate file hash value:**

```lua
-- Calculate xxHash64 hash value of a file
local checksum = hash.xxhash64("/path/to/file.txt")
```

**Calculate binary data hash value:**

```lua
import("core.base.bytes")

-- Calculate xxHash64 hash value of binary data
local checksum = hash.xxhash64(bytes("hello"))
```

**Incorrect usage (don't do this):**

```lua
-- ❌ Wrong: Don't pass string data directly
local key = hash.xxhash64(table.concat(params, "|"))

-- ✅ Correct: Use bytes wrapper for binary data
local key = hash.xxhash64(bytes(table.concat(params, "|")))
```

## hash.xxhash128

- Calculate the 128-bit xxHash hash value of a file or binary data

#### Function Prototype

::: tip API
```lua
hash.xxhash128(input: <string|bytes>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| input | File path (string) or binary data (bytes) |

::: warning Important Notes
- **String parameter is only for file paths**: If a string is passed, the function will calculate the hash value of that file
- **Binary data must use bytes parameter**: To calculate the hash value of binary data, you must wrap the data with the `bytes()` function
:::

#### Usage

Calculates hash value using the xxHash128 algorithm, providing longer hash values to reduce collisions.

**Calculate file hash value:**

```lua
-- Calculate xxHash128 hash value of a file
local checksum = hash.xxhash128("/path/to/file.txt")
```

**Calculate binary data hash value:**

```lua
import("core.base.bytes")

-- Calculate xxHash128 hash value of binary data
local checksum = hash.xxhash128(bytes("hello"))
```

## hash.strhash32

- Generate a 32-bit hash value from a string

#### Function Prototype

::: tip API
```lua
hash.strhash32(input: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| input | String |

#### Usage

Generates a 32-bit hash value from a string, returns format like: `91e8ecf1`

This interface uses xxhash32 internally, specifically designed for fast string hashing.

## hash.strhash64

- Generate a 64-bit hash value from a string

#### Function Prototype

::: tip API
```lua
hash.strhash64(input: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| input | String |

#### Usage

Generates a 64-bit hash value from a string, returns format like: `91e8ecf191e8ecf1`

## hash.strhash128

- Generate a 128-bit hash value from a string

#### Function Prototype

::: tip API
```lua
hash.strhash128(input: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| input | String |

#### Usage

Generates a 128-bit hash value from a string, returns format like: `91e8ecf1417f4edfa574e22d7d8d204a`

Suitable for generating compilation cache keys:

```lua
-- Generate key for compilation cache
local cache_key = hash.strhash128(compiler .. flags .. source)
```

## hash.rand32

- Generate a 32-bit random hash value

#### Function Prototype

::: tip API
```lua
hash.rand32()
```
:::


#### Parameter Description

No parameters required for this function.

#### Usage

Generates a 32-bit random hash value.

::: warning WARNING
This interface is prone to hash collisions and is not recommended for scenarios requiring high uniqueness.
:::

## hash.rand64

- Generate a 64-bit random hash value

#### Function Prototype

::: tip API
```lua
hash.rand64()
```
:::


#### Parameter Description

No parameters required for this function.

#### Usage

Generates a 64-bit random hash value.

## hash.rand128

- Generate a 128-bit random hash value

#### Function Prototype

::: tip API
```lua
hash.rand128()
```
:::


#### Parameter Description

No parameters required for this function.

#### Usage

Generates a 128-bit random hash value.

