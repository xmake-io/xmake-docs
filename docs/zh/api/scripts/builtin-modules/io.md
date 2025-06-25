
# io

io 操作模块，扩展了 lua 内置的 io 模块，提供更多易用的接口。

## io.open

- 打开文件用于读写

这个是属于lua的原生接口，详细使用可以参看lua的官方文档：[The Complete I/O Model](https://www.lua.org/pil/21.2.html)

如果要读取文件所有内容，可以这么写：

```lua
local file = io.open("$(tmpdir)/file.txt", "r")
if file then
    local data = file:read("*all")
    file:close()
end
```

或者可以使用[io.readfile](#io-readfile)更加快速地读取。

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

根据文件名返回该文件的所有行的内容

```lua
local lines = io.lines("xxx.txt")
for line in lines do
    print(line)
end
```

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
