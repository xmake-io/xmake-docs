
# utf8

`utf8` 模块提供对 UTF-8 编码的基本支持。它与 Lua 5.3+ 的 utf8 库兼容。

## utf8.len

- 返回字符串中的 UTF-8 字符数

#### 函数原型

::: tip API
```lua
utf8.len(s: <string>, i: <number>, j: <number>, lax: <boolean>)
```
:::

## utf8.char

- 接收零个或多个整数，将每个整数转换为其对应的 UTF-8 字节序列

#### 函数原型

::: tip API
```lua
utf8.char(...)
```
:::

## utf8.codepoint

- 返回字符串中所有字符的代码点（作为整数）

#### 函数原型

::: tip API
```lua
utf8.codepoint(s: <string>, i: <number>, j: <number>)
```
:::

## utf8.codes

- 返回一个迭代器（函数），用于遍历字符串中的所有字符

#### 函数原型

::: tip API
```lua
utf8.codes(s: <string>, lax: <boolean>)
```
:::

## utf8.offset

- 返回字符串中第 n 个字符的编码开始的位置（以字节为单位）

#### 函数原型

::: tip API
```lua
utf8.offset(s: <string>, n: <number>, i: <number>)
```
:::

## utf8.sub

- 返回字符串 s 的子串，该子串从第 i 个字符开始，到第 j 个字符结束

#### 函数原型

::: tip API
```lua
utf8.sub(s: <string>, i: <number>, j: <number>)
```
:::

## utf8.reverse

- 返回字符串 s 的逆序字符串

#### 函数原型

::: tip API
```lua
utf8.reverse(s: <string>)
```
:::

## utf8.lastof

- 返回字符串 s 中最后一次出现 pattern 的位置（以字符为单位）

#### 函数原型

::: tip API
```lua
utf8.lastof(s: <string>, pattern: <string>, plain: <boolean>)
```
:::

## utf8.find

- 返回字符串 s 中 pattern 第一次出现的起始位置和结束位置（以字符为单位）

#### 函数原型

::: tip API
```lua
utf8.find(s: <string>, pattern: <string>, init: <number>, plain: <boolean>)
```
:::

## utf8.width

- 返回字符串 s 的显示宽度（通常用于终端对齐）

#### 函数原型

::: tip API
```lua
utf8.width(s: <string>)
```
:::

## utf8.byte

- 返回字符串 s 中第 i 到 j 个字符的内部数字编码

#### 函数原型

::: tip API
```lua
utf8.byte(s: <string>, i: <number>, j: <number>)
```
:::
