
# string

字符串模块为lua原生自带的模块，具体使用见：[lua官方手册](https://www.lua.org/manual/5.1/manual.html#5.4)

Xmake 中对其进行了扩展，增加了一些扩展接口：

## string.startswith

- 判断字符串开头是否匹配

#### 函数原型

::: tip API
```lua
string.startswith(str: <string>, prefix: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| str | 要检查的字符串 |
| prefix | 要匹配的前缀字符串 |

#### 用法说明

```lua
local s = "hello xmake"
if s:startswith("hello") then
    print("match")
end
```

另请参阅 [string.endswith](#string-endswith) 用于判断字符串结尾。

## string.endswith

- 判断字符串结尾是否匹配

#### 函数原型

::: tip API
```lua
string.endswith(str: <string>, suffix: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| str | 要检查的字符串 |
| suffix | 要匹配的后缀字符串 |

#### 用法说明

```lua
local s = "hello xmake"
if s:endswith("xmake") then
    print("match")
end
```

## string.split

- 分割字符串

#### 函数原型

::: tip API
```lua
string.split(str: <string>, separator: <string>, options: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| str | 要分割的字符串 |
| separator | 分隔符字符串 |
| options | 分割选项表（可选） |

#### 用法说明

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

#### 函数原型

::: tip API
```lua
string.trim(str: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| str | 要处理的字符串 |

#### 用法说明

```lua
string.trim("    hello xmake!    ")
```

结果为："hello xmake!"

如只需去掉左边空白，请使用 [string.ltrim](#string-ltrim)；只去掉右边空白，请使用 [string.rtrim](#string-rtrim)。

## string.ltrim

- 去掉字符串左边空白字符

#### 函数原型

::: tip API
```lua
string.ltrim(str: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| str | 要处理的字符串 |

#### 用法说明

```lua
string.ltrim("    hello xmake!    ")
```

结果为："hello xmake!    "

## string.rtrim

- 去掉字符串右边空白字符

#### 函数原型

::: tip API
```lua
string.rtrim(str: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| str | 要处理的字符串 |

#### 用法说明

```lua
string.rtrim("    hello xmake!    ")
```

结果为："    hello xmake!"

## string.lastof

- 查找子串最后一次出现的位置

#### 函数原型

::: tip API
```lua
string.lastof(str: <string>, pattern: <string>, plain?: <boolean>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| str | 要搜索的字符串 |
| pattern | 要匹配的模式串 |
| plain | 可选。是否使用纯文本匹配，默认为 false |

#### 用法说明

```lua
print(("src/test/file.lua"):lastof("/", true))  -- 输出: 10
print(("abc.def.ghi"):lastof("%.", false))       -- 输出: 8
```

## string.replace

- 替换字符串

#### 函数原型

::: tip API
```lua
string.replace(str: <string>, old: <string>, new: <string>, opt?: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| str | 要处理的字符串 |
| old | 要替换的旧字符串 |
| new | 替换后的新字符串 |
| opt | 可选。选项表，支持 `{plain = true}` 进行纯文本替换 |

#### 用法说明

默认使用 Lua 模式匹配替换：

```lua
print(("hello world"):replace("world", "xmake"))
-- 输出: hello xmake
```

使用纯文本模式替换（避免特殊字符被当作模式）：

```lua
print(("hello (world)"):replace("(world)", "xmake", {plain = true}))
-- 输出: hello xmake
```

如需直接对文件内容进行替换操作，请使用 [io.replace](/zh/api/scripts/builtin-modules/io#io-replace) 或 [io.gsub](/zh/api/scripts/builtin-modules/io#io-gsub)。

## string.serialize

- 序列化对象为字符串

#### 函数原型

::: tip API
```lua
string.serialize(object: <any>, opt?: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| object | 要序列化的对象 |
| opt | 可选。选项表，支持 `{strip = true, binary = false, indent = true}` |

#### 用法说明

```lua
local str = string.serialize({a = 1, b = "hello"})
print(str)
```

与之相反的操作是 [string.deserialize](#string-deserialize)，可以将序列化后的字符串还原为对象。如需将对象序列化后保存到文件，可以使用 [io.save](/zh/api/scripts/builtin-modules/io#io-save)。

## string.deserialize

- 反序列化字符串为对象

#### 函数原型

::: tip API
```lua
string.deserialize(str: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| str | 要反序列化的字符串 |

#### 用法说明

```lua
local obj = ("{a = 1, b = 'hello'}"):deserialize()
print(obj.a)  -- 输出: 1
print(obj.b)  -- 输出: hello
```

与之相反的操作是 [string.serialize](#string-serialize)。如需从文件加载序列化数据，可以使用 [io.load](/zh/api/scripts/builtin-modules/io#io-load)。

## string.ipattern

- 生成大小写不敏感的匹配模式

#### 函数原型

::: tip API
```lua
string.ipattern(pattern: <string>, brackets?: <boolean>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| pattern | Lua 匹配模式字符串 |
| brackets | 可选。是否对方括号 `[]` 内的字母也进行大小写转换，默认为 false |

#### 用法说明

```lua
print(string.ipattern("src/.*%.c"))
-- 输出: [sS][rR][cC]/.*%.[cC]

print(("SRC/test.C"):match(string.ipattern("src/.*%.c")))
-- 输出: SRC/test.C
```

## string.levenshtein

- 计算两个字符串的编辑距离

#### 函数原型

::: tip API
```lua
string.levenshtein(str1: <string>, str2: <string>, opt?: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| str1 | 第一个字符串 |
| str2 | 第二个字符串 |
| opt | 可选。选项表，支持 `{sub = 1, ins = 1, del = 1}` 分别设置替换/插入/删除的代价 |

#### 用法说明

```lua
print(("hello"):levenshtein("hallo"))  -- 输出: 1
print(("kitten"):levenshtein("sitting"))  -- 输出: 3
```
