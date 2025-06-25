
# path

路径操作模块，实现跨平台的路径操作，这是 xmake 的一个自定义的模块。

## path.join

- 拼接路径

将多个路径项进行追加拼接，由于`windows/unix`风格的路径差异，使用api来追加路径更加跨平台，例如：

```lua
print(path.join("$(tmpdir)", "dir1", "dir2", "file.txt"))
```

上述拼接在unix上相当于：`$(tmpdir)/dir1/dir2/file.txt`，而在windows上相当于：`$(tmpdir)\\dir1\\dir2\\file.txt`

如果觉得这样很繁琐，不够清晰简洁，可以使用：[path.translate](#path-translate)方式，格式化转换路径字符串到当前平台支持的格式。

## path.translate

- 转换路径到当前平台的路径风格

格式化转化指定路径字符串到当前平台支持的路径风格，同时支持`windows/unix`格式的路径字符串参数传入，甚至混合传入，例如：

```lua
print(path.translate("$(tmpdir)/dir/file.txt"))
print(path.translate("$(tmpdir)\\dir\\file.txt"))
print(path.translate("$(tmpdir)\\dir/dir2//file.txt"))
```

上面这三种不同格式的路径字符串，经过`translate`规范化后，就会变成当前平台支持的格式，并且会去掉冗余的路径分隔符。

## path.basename

- 获取路径最后不带后缀的文件名

```lua
print(path.basename("$(tmpdir)/dir/file.txt"))
```

显示结果为：`file`

## path.filename

- 获取路径最后带后缀的文件名

```lua
print(path.filename("$(tmpdir)/dir/file.txt"))
```

显示结果为：`file.txt`

## path.extension

- 获取路径的后缀名

```lua
print(path.extensione("$(tmpdir)/dir/file.txt"))
```

显示结果为：`.txt`

## path.directory

- 获取路径的目录名

```lua
print(path.directory("$(tmpdir)/dir/file.txt"))
```

显示结果为：`$(tmpdir)/dir`

## path.relative

- 转换成相对路径

```lua
print(path.relative("$(tmpdir)/dir/file.txt", "$(tmpdir)"))
```

显示结果为：`dir/file.txt`

第二个参数是指定相对的根目录，如果不指定，则默认相对当前目录：

```lua
os.cd("$(tmpdir)")
print(path.relative("$(tmpdir)/dir/file.txt"))
```

这样结果是一样的。

## path.absolute

- 转换成绝对路径

```lua
print(path.absolute("dir/file.txt", "$(tmpdir)"))
```

显示结果为：`$(tmpdir)/dir/file.txt`

第二个参数是指定相对的根目录，如果不指定，则默认相对当前目录：

```lua
os.cd("$(tmpdir)")
print(path.absolute("dir/file.txt"))
```

这样结果是一样的。

## path.is_absolute

- 判断是否为绝对路径

```lua
if path.is_absolute("/tmp/file.txt") then
    -- 如果是绝对路径
end
```

## path.splitenv

- 分割环境变量中的路径

```lua
local pathes = path.splitenv(vformat("$(env PATH)"))

-- for windows
local pathes = path.splitenv("C:\\Windows;C:\\Windows\\System32")
-- got { "C:\\Windows", "C:\\Windows\\System32" }

-- for *nix
local pathes = path.splitenv("/usr/bin:/usr/local/bin")
-- got { "/usr/bin", "/usr/local/bin" }
```

结果为一个包含了输入字符串中路径的数组。

