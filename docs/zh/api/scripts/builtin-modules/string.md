
# string

字符串模块为lua原生自带的模块，具体使用见：[lua官方手册](https://www.lua.org/manual/5.1/manual.html#5.4)

Xmake 中对其进行了扩展，增加了一些扩展接口：

## string.startswith

- 判断字符串开头是否匹配

```lua
local s = "hello xmake"
if s:startswith("hello") then
    print("match")
end
```

## string.endswith

- 判断字符串结尾是否匹配

```lua
local s = "hello xmake"
if s:endswith("xmake") then
    print("match")
end
```

## string.split

- 分割字符串

v2.2.7版本对这个接口做了改进，以下是对2.2.7之后版本的使用说明。

按模式匹配分割字符串，忽略空串，例如：

```lua
("1\n\n2\n3"):split('\n') => 1, 2, 3
("abc123123xyz123abc"):split('123') => abc, xyz, abc
("abc123123xyz123abc"):split('[123]+') => abc, xyz, abc
```

按纯文本匹配分割字符串，忽略空串（省去了模式匹配，会提升稍许性能），例如：

```lua
("1\n\n2\n3"):split('\n', {plain = true}) => 1, 2, 3
("abc123123xyz123abc"):split('123', {plain = true}) => abc, xyz, abc
```

按模式匹配分割字符串，严格匹配，不忽略空串，例如：

```lua
("1\n\n2\n3"):split('\n', {strict = true}) => 1, , 2, 3
("abc123123xyz123abc"):split('123', {strict = true}) => abc, , xyz, abc
("abc123123xyz123abc"):split('[123]+', {strict = true}) => abc, xyz, abc
```

按纯文本匹配分割字符串，严格匹配，不忽略空串（省去了模式匹配，会提升稍许性能），例如：

```lua
("1\n\n2\n3"):split('\n', {plain = true, strict = true}) => 1, , 2, 3
("abc123123xyz123abc"):split('123', {plain = true, strict = true}) => abc, , xyz, abc
```

限制分割块数

```lua
("1\n\n2\n3"):split('\n', {limit = 2}) => 1, 2\n3
("1.2.3.4.5"):split('%.', {limit = 3}) => 1, 2, 3.4.5
```

## string.trim

- 去掉字符串左右空白字符

```lua
string.trim("    hello xmake!    ")
```

结果为："hello xmake!"

## string.ltrim

- 去掉字符串左边空白字符

```lua
string.ltrim("    hello xmake!    ")
```

结果为："hello xmake!    "

## string.rtrim

- 去掉字符串右边空白字符

```lua
string.rtrim("    hello xmake!    ")
```

结果为："    hello xmake!"
