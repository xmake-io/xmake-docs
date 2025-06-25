
# string

The string module is a native module of lua. For details, see: [lua official manual](https://www.lua.org/manual/5.1/manual.html#5.4)

It has been extended in xmake to add some extension interfaces:

## string.startswith

- Determine if the beginning of the string matches

```lua
local s = "hello xmake"
if s:startswith("hello") then
    print("match")
end
```

## string.endswith

- Determine if the end of the string matches

```lua
local s = "hello xmake"
if s:endswith("xmake") then
    print("match")
end
```

## string.split

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

```lua
string.trim("    hello xmake!    ")
```

The result is: "hello xmake!"

## string.ltrim

- Remove the whitespace character to the left of the string

```lua
string.ltrim("    hello xmake!    ")
```

The result is: "hello xmake!    "

## string.rtrim

- Remove the whitespace character to the right of the string

```lua
string.rtrim("    hello xmake!    ")
```

The result is: "    hello xmake!"
