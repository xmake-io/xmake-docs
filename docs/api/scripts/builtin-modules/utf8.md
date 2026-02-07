
# utf8

The `utf8` module provides basic support for UTF-8 encoding. It is compatible with Lua 5.3+ utf8 library.

## utf8.len

- Returns the number of UTF-8 characters in the string

#### Function Prototype

::: tip API
```lua
utf8.len(s: <string>, i: <number>, j: <number>, lax: <boolean>)
```
:::

## utf8.char

- Receives zero or more integers, converts each one to its corresponding UTF-8 byte sequence

#### Function Prototype

::: tip API
```lua
utf8.char(...)
```
:::

## utf8.codepoint

- Returns the codepoints (as integers) from all characters in the string

#### Function Prototype

::: tip API
```lua
utf8.codepoint(s: <string>, i: <number>, j: <number>)
```
:::

## utf8.codes

- Returns an iterator (a function) that iterates over all characters in the string

#### Function Prototype

::: tip API
```lua
utf8.codes(s: <string>, lax: <boolean>)
```
:::

## utf8.offset

- Returns the position (in bytes) where the encoding of the n-th character of the string starts

#### Function Prototype

::: tip API
```lua
utf8.offset(s: <string>, n: <number>, i: <number>)
```
:::

## utf8.sub

- Returns the substring of s that starts at character i and continues until character j

#### Function Prototype

::: tip API
```lua
utf8.sub(s: <string>, i: <number>, j: <number>)
```
:::

## utf8.reverse

- Returns a string with the characters of s in reverse order

#### Function Prototype

::: tip API
```lua
utf8.reverse(s: <string>)
```
:::

## utf8.lastof

- Returns the position (in characters) of the last occurrence of pattern in the string s

#### Function Prototype

::: tip API
```lua
utf8.lastof(s: <string>, pattern: <string>, plain: <boolean>)
```
:::

## utf8.find

- Returns the start and end position (in characters) of the first occurrence of pattern in the string s

#### Function Prototype

::: tip API
```lua
utf8.find(s: <string>, pattern: <string>, init: <number>, plain: <boolean>)
```
:::

## utf8.width

- Returns the display width of the string s (usually for terminal alignment)

#### Function Prototype

::: tip API
```lua
utf8.width(s: <string>)
```
:::

## utf8.byte

- Returns the internal numerical codes of the characters s[i], s[i+1], ..., s[j]

#### Function Prototype

::: tip API
```lua
utf8.byte(s: <string>, i: <number>, j: <number>)
```
:::
