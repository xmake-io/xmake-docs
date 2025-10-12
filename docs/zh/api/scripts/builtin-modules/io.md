
# io

io 操作模块，扩展了 lua 内置的 io 模块，提供更多易用的接口。

## io.open

- 打开文件用于读写

这个是属于lua的原生接口，xmake 在此基础上进行了扩展。详细使用可以参看lua的官方文档：[The Complete I/O Model](https://www.lua.org/pil/21.2.html)

支持的打开模式：`"r"`（只读）、`"w"`（写入）、`"a"`（追加）、`"r+"`（读写）等。

还支持指定编码格式，例如：

```lua
-- 以 UTF-8 编码打开文件
local file = io.open("xxx.txt", "r", {encoding = "utf8"})
-- 以 UTF-16LE 编码打开文件
local file = io.open("xxx.txt", "r", {encoding = "utf16le"})
-- 以二进制模式打开
local file = io.open("xxx.txt", "r", {encoding = "binary"})
```

支持的编码格式：`"utf8"`（默认）、`"utf16"`、`"utf16le"`、`"utf16be"`、`"binary"`

如果要读取文件所有内容，可以这么写：

```lua
local file = io.open("$(tmpdir)/file.txt", "r")
if file then
    local data = file:read("*all")
    file:close()
end
```

或者可以使用[io.readfile](#io-readfile)更加快速地读取。

文件对象还支持以下扩展方法：

```lua
local file = io.open("xxx.txt", "r")
-- 获取文件大小
local size = file:size()
-- 获取文件绝对路径
local path = file:path()
-- 读取一行（保留换行符）
local line = file:read("L")
-- 逐行迭代
for line in file:lines() do
    print(line)
end
file:close()
```

如果要写文件，可以这么操作：

```lua
-- 打开文件：w 为写模式, a 为追加写模式
local file = io.open("xxx.txt", "w")
if file then

    -- 用原生的lua接口写入数据到文件，不支持格式化，无换行，不支持内置变量
    file:write("hello xmake\n")

    -- 用xmake扩展的接口写入数据到文件，支持格式化，无换行，不支持内置变量
    file:writef("hello %s\n", "xmake")

    -- 使用xmake扩展的格式化传参写入一行，带换行符，并且支持内置变量
    file:print("hello %s and $(buildir)", "xmake")

    -- 使用xmake扩展的格式化传参写入一行，无换行符，并且支持内置变量
    file:printf("hello %s and $(buildir) \n", "xmake")

    -- 关闭文件
    file:close()
end
```

## io.load

-  从指定路径文件反序列化加载所有table内容

可以从文件中加载序列化好的table内容，一般与[io.save](#iosave)配合使用，例如：

```lua
-- 加载序列化文件的内容到table
local data = io.load("xxx.txt")
if data then

    -- 在终端中dump打印整个table中内容，格式化输出
    utils.dump(data)
end
```

## io.save

- 序列化保存所有table内容到指定路径文件

可以序列化存储table内容到指定文件，一般与[io.load](#ioload)配合使用，例如：

```lua
io.save("xxx.txt", {a = "a", b = "b", c = "c"})
```

存储结果为：

```
{
    ["b"] = "b"
,   ["a"] = "a"
,   ["c"] = "c"
}
```

## io.readfile

- 从指定路径文件读取所有内容

可在不打开文件的情况下，直接读取整个文件的内容，更加的方便，例如：

```lua
local data = io.readfile("xxx.txt")
```

支持选项参数来控制读取行为：

```lua
-- 以二进制模式读取（不进行换行符转换）
local data = io.readfile("xxx.txt", {encoding = "binary"})

-- 读取 UTF-16LE 编码的文件
local data = io.readfile("xxx.txt", {encoding = "utf16le"})

-- 处理行继续符（如 \ 结尾的行会与下一行合并）
local data = io.readfile("xxx.txt", {continuation = "\\"})
```

选项参数说明：
- `encoding`：文件编码格式，支持 `"utf8"`（默认）、`"utf16"`、`"utf16le"`、`"utf16be"`、`"binary"`
- `continuation`：行继续字符，指定后会将以该字符结尾的行与下一行合并（去除换行符）

xmake 会自动检测并处理不同的换行符格式（LF、CRLF），并自动检测 UTF-8 BOM。

## io.writefile

- 写入所有内容到指定路径文件

可在不打开文件的情况下，直接写入整个文件的内容，更加的方便，例如：

```lua
io.writefile("xxx.txt", "all data")
```

## io.gsub

- 全文替换指定路径文件的内容

类似[string.gsub](#stringgsub)接口，全文模式匹配替换内容，不过这里是直接操作文件，例如：

```lua
-- 移除文件所有的空白字符
io.gsub("xxx.txt", "%s+", "")
```

## io.tail

- 读取和显示文件的尾部内容

读取文件尾部指定行数的数据，并显示，类似`cat xxx.txt | tail -n 10`命令，例如：

```lua
-- 显示文件最后10行内容
io.tail("xxx.txt", 10)
```

## io.cat

- 读取和显示文件的所有内容

读取文件的所有内容并显示，类似`cat xxx.txt`命令，例如：

```lua
io.cat("xxx.txt")
```

## io.print

- 带换行格式化输出内容到文件

直接格式化传参输出一行字符串到文件，并且带换行，例如：

```lua
io.print("xxx.txt", "hello %s!", "xmake")
```

## io.printf

- 无换行格式化输出内容到文件

直接格式化传参输出一行字符串到文件，不带换行，例如：

```lua
io.printf("xxx.txt", "hello %s!\n", "xmake")
```

## io.lines

- 读取文件的所有行

根据文件名返回该文件的所有行的内容，返回一个迭代器函数。

```lua
for line in io.lines("xxx.txt") do
    print(line)
end
```

也可以转换为数组：

```lua
local lines = table.to_array(io.lines("xxx.txt"))
```

支持与 [io.readfile](#io-readfile) 相同的选项参数：

```lua
-- 以二进制模式读取每一行（保留 CRLF）
for line in io.lines("xxx.txt", {encoding = "binary"}) do
    print(line)
end

-- 处理行继续符
for line in io.lines("xxx.txt", {continuation = "\\"}) do
    print(line)  -- 以 \ 结尾的行会与下一行合并
end
```

默认情况下，每行会去除换行符。如果需要保留换行符，使用 `file:read("L")` 方式。

## io.stdfile

- 获取标准输入输出文件

根据文件名返回标准输入输出文件

```lua
-- 标准输入
io.stdin
-- 标准输出
io.stdout
-- 标准错误
io.stderr
```

## io.openlock

- 创建一把文件锁

为给定的文件返回一个文件锁对象

```lua
local lock = io.openlock("xxx.txt")
lock:lock()
lock:unlock()
lock:close()
```

## io.replace

- 根据表达式替换文件内容

根据表达式和参数对文件进行全文替换

```lua
io.replace(filepath, pattern, replace, opt)
io.replace("xxx.txt", "test", "xmake", { plain = true, encoding = "UTF-8" })
io.replace("xxx.txt", "%d[^\n]*", "xmake")
```

关于参数 `opt` 成员的解释：

> .plain: 若为 true，使用pattern进行简单匹配；为 false，则进行模式匹配；
>
> .encoding: 指定文件编码格式
