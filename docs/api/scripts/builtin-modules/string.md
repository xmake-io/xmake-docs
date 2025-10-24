
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
