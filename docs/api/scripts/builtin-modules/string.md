
# string

The string module is a native module of lua. For details, see: [lua official manual](https://www.lua.org/manual/5.1/manual.html#5.4)

It has been extended in xmake to add some extension interfaces:

## string.startswith

- Determine if the beginning of the string matches

#### Function Prototype

::: tip API
```lua
string.startswith(str: <string>, prefix: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| str | String to check |
| prefix | Prefix string to match |

#### Usage

```lua
local s = "hello xmake"
if s:startswith("hello") then
    print("match")
end
```

See also [string.endswith](#string-endswith) for checking string endings.

## string.endswith

- Determine if the end of the string matches

#### Function Prototype

::: tip API
```lua
string.endswith(str: <string>, suffix: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| str | String to check |
| suffix | Suffix string to match |

#### Usage

```lua
local s = "hello xmake"
if s:endswith("xmake") then
    print("match")
end
```

## string.split

- Split string by separator

#### Function Prototype

::: tip API
```lua
string.split(str: <string>, separator: <string>, options: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| str | String to split |
| separator | Separator string |
| options | Split options table (optional) |

#### Usage

pattern match and ignore empty string

```lua
("1\n\n2\n3"):split('\n') => 1, 2, 3
("abc123123xyz123abc"):split('123') => abc, xyz, abc
("abc123123xyz123abc"):split('[123]+') => abc, xyz, abc
```

plain match and ignore empty string

```lua
("1\n\n2\n3"):split('\n', {plain = true}) => 1, 2, 3
("abc123123xyz123abc"):split('123', {plain = true}) => abc, xyz, abc
```

pattern match and contains empty string

```lua
("1\n\n2\n3"):split('\n', {strict = true}) => 1, , 2, 3
("abc123123xyz123abc"):split('123', {strict = true}) => abc, , xyz, abc
("abc123123xyz123abc"):split('[123]+', {strict = true}) => abc, xyz, abc
```

plain match and contains empty string

```lua
("1\n\n2\n3"):split('\n', {plain = true, strict = true}) => 1, , 2, 3
("abc123123xyz123abc"):split('123', {plain = true, strict = true}) => abc, , xyz, abc
```

limit split count

```lua
("1\n\n2\n3"):split('\n', {limit = 2}) => 1, 2\n3
("1.2.3.4.5"):split('%.', {limit = 3}) => 1, 2, 3.4.5
```

## string.trim

- Remove the left and right whitespace characters of the string

#### Function Prototype

::: tip API
```lua
string.trim(str: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| str | String to trim |

#### Usage

```lua
string.trim("    hello xmake!    ")
```

The result is: "hello xmake!"

To trim only the left side, use [string.ltrim](#string-ltrim); for the right side only, use [string.rtrim](#string-rtrim).

## string.ltrim

- Remove the whitespace character to the left of the string

#### Function Prototype

::: tip API
```lua
string.ltrim(str: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| str | String to trim |

#### Usage

```lua
string.ltrim("    hello xmake!    ")
```

The result is: "hello xmake!    "

## string.rtrim

- Remove the whitespace character to the right of the string

#### Function Prototype

::: tip API
```lua
string.rtrim(str: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| str | String to trim |

#### Usage

```lua
string.rtrim("    hello xmake!    ")
```

The result is: "    hello xmake!"

## string.lastof

- Find the position of the last occurrence of a substring

#### Function Prototype

::: tip API
```lua
string.lastof(str: <string>, pattern: <string>, plain?: <boolean>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| str | String to search |
| pattern | Pattern to match |
| plain | Optional. Whether to use plain text matching, default is false |

#### Usage

```lua
print(("src/test/file.lua"):lastof("/", true))  -- Output: 10
print(("abc.def.ghi"):lastof("%.", false))       -- Output: 8
```

## string.replace

- Replace text in a string

#### Function Prototype

::: tip API
```lua
string.replace(str: <string>, old: <string>, new: <string>, opt?: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| str | String to process |
| old | Old string to replace |
| new | New replacement string |
| opt | Optional. Options table, supports `{plain = true}` for plain text replacement |

#### Usage

By default, uses Lua pattern matching for replacement:

```lua
print(("hello world"):replace("world", "xmake"))
-- Output: hello xmake
```

Use plain text mode (avoids special characters being treated as patterns):

```lua
print(("hello (world)"):replace("(world)", "xmake", {plain = true}))
-- Output: hello xmake
```

To replace content directly in a file, use [io.replace](/api/scripts/builtin-modules/io#io-replace) or [io.gsub](/api/scripts/builtin-modules/io#io-gsub).

## string.serialize

- Serialize an object to a string

#### Function Prototype

::: tip API
```lua
string.serialize(object: <any>, opt?: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| object | Object to serialize |
| opt | Optional. Options table, supports `{strip = true, binary = false, indent = true}` |

#### Usage

```lua
local str = string.serialize({a = 1, b = "hello"})
print(str)
```

The reverse operation is [string.deserialize](#string-deserialize), which restores a serialized string back to an object. To serialize and save an object to a file, use [io.save](/api/scripts/builtin-modules/io#io-save).

## string.deserialize

- Deserialize a string to an object

#### Function Prototype

::: tip API
```lua
string.deserialize(str: <string>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| str | String to deserialize |

#### Usage

```lua
local obj = ("{a = 1, b = 'hello'}"):deserialize()
print(obj.a)  -- Output: 1
print(obj.b)  -- Output: hello
```

The reverse operation is [string.serialize](#string-serialize). To load serialized data from a file, use [io.load](/api/scripts/builtin-modules/io#io-load).

## string.ipattern

- Generate a case-insensitive matching pattern

#### Function Prototype

::: tip API
```lua
string.ipattern(pattern: <string>, brackets?: <boolean>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| pattern | Lua pattern string |
| brackets | Optional. Whether to also convert letters inside brackets `[]`, default is false |

#### Usage

```lua
print(string.ipattern("src/.*%.c"))
-- Output: [sS][rR][cC]/.*%.[cC]

print(("SRC/test.C"):match(string.ipattern("src/.*%.c")))
-- Output: SRC/test.C
```

## string.levenshtein

- Compute the Levenshtein (edit) distance between two strings

#### Function Prototype

::: tip API
```lua
string.levenshtein(str1: <string>, str2: <string>, opt?: <table>)
```
:::


#### Parameter Description

| Parameter | Description |
|-----------|-------------|
| str1 | First string |
| str2 | Second string |
| opt | Optional. Options table, supports `{sub = 1, ins = 1, del = 1}` for substitution/insertion/deletion costs |

#### Usage

```lua
print(("hello"):levenshtein("hallo"))  -- Output: 1
print(("kitten"):levenshtein("sitting"))  -- Output: 3
```
