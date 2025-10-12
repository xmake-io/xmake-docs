
# hash

The hash module provides hash value calculation and UUID generation functions. It is a built-in module of xmake.

## hash.md5

- Calculate the MD5 hash value of a string or file

```lua
local hashval = hash.md5("hello")
local hashval = hash.md5("/path/to/file")
```

Calculates the MD5 hash value of the specified string or file and returns a hexadecimal format hash string. Supports both string and file path as input.

Commonly used for calculating file content checksums:

```lua
-- Read file content and calculate MD5
local content = io.readfile("file.txt")
local checksum = hash.md5(content)
print("MD5: " .. checksum)
```

## hash.sha1

- Calculate the SHA1 hash value of a string or file

```lua
local hashval = hash.sha1("hello")
local hashval = hash.sha1("/path/to/file")
```

Calculates the SHA1 hash value of the specified string or file and returns a hexadecimal format hash string.

## hash.sha256

- Calculate the SHA256 hash value of a string or file

```lua
local hashval = hash.sha256("hello")
local hashval = hash.sha256("/path/to/file")
```

Calculates the SHA256 hash value of the specified string or file and returns a hexadecimal format hash string.

SHA256 is more secure than MD5 and is commonly used for package integrity verification:

```lua
-- Verify downloaded package file
local packagefile = "package.tar.gz"
local checksum = hash.sha256(packagefile)
if checksum ~= expected_hash then
    raise("checksum mismatch!")
end
```

## hash.uuid

- Generate a UUID based on a name

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

- Calculate the 32-bit xxHash hash value of a string or file

```lua
local hashval = hash.xxhash32("hello")
local hashval = hash.xxhash32("/path/to/file")
```

Calculates hash value using the xxHash32 algorithm. xxHash is an extremely fast non-cryptographic hash algorithm suitable for hash tables, checksums, and other scenarios.

## hash.xxhash64

- Calculate the 64-bit xxHash hash value of a string or file

```lua
local hashval = hash.xxhash64("hello")
local hashval = hash.xxhash64("/path/to/file")
```

Calculates hash value using the xxHash64 algorithm. Fast and suitable for quick verification:

```lua
-- Generate fast hash key for compilation parameters
local key = hash.xxhash64(table.concat(params, "|"))
```

## hash.xxhash128

- Calculate the 128-bit xxHash hash value of a string or file

```lua
local hashval = hash.xxhash128("hello")
local hashval = hash.xxhash128("/path/to/file")
```

Calculates hash value using the xxHash128 algorithm, providing longer hash values to reduce collisions.

## hash.strhash32

- Generate a 32-bit hash value from a string

```lua
local hashval = hash.strhash32("hello")
```

Generates a 32-bit hash value from a string, returns format like: `91e8ecf1`

This interface uses xxhash32 internally, specifically designed for fast string hashing.

## hash.strhash64

- Generate a 64-bit hash value from a string

```lua
local hashval = hash.strhash64("hello")
```

Generates a 64-bit hash value from a string, returns format like: `91e8ecf191e8ecf1`

## hash.strhash128

- Generate a 128-bit hash value from a string

```lua
local hashval = hash.strhash128("hello")
```

Generates a 128-bit hash value from a string, returns format like: `91e8ecf1417f4edfa574e22d7d8d204a`

Suitable for generating compilation cache keys:

```lua
-- Generate key for compilation cache
local cache_key = hash.strhash128(compiler .. flags .. source)
```

## hash.rand32

- Generate a 32-bit random hash value

```lua
local randval = hash.rand32()
```

Generates a 32-bit random hash value.

::: warning WARNING
This interface is prone to hash collisions and is not recommended for scenarios requiring high uniqueness.
:::

## hash.rand64

- Generate a 64-bit random hash value

```lua
local randval = hash.rand64()
```

Generates a 64-bit random hash value.

## hash.rand128

- Generate a 128-bit random hash value

```lua
local randval = hash.rand128()
```

Generates a 128-bit random hash value.

