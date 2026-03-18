
# path

路径操作模块，实现跨平台的路径操作，这是 xmake 的一个自定义的模块。

## path.new

- 创建新的路径实例

#### 函数原型

::: tip API
```lua
path.new(p: <string>, transform?: <function>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| p | 必需。路径字符串 |
| transform | 可选。路径转换函数 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| path | 返回路径实例 |

#### 用法说明

创建一个路径实例：

```lua
local p = path.new("/tmp/file.txt")
print(p:filename())  -- 输出: file.txt
```

使用转换函数：

```lua
local p = path.new("/tmp/a", function (raw_path)
    return "--key=" .. raw_path
end)
print(p:str())      -- 输出: --key=/tmp/a
print(p:rawstr())   -- 输出: /tmp/a
```

也可以直接调用构造函数：

```lua
local p = path("/tmp/file.txt")  -- 自动创建实例
print(p:filename())
```

可通过 [path.instance_of](#path-instance_of) 判断一个对象是否为路径实例。

## path.normalize

- 规范化路径

#### 函数原型

::: tip API
```lua
path.normalize(p: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| p | 必需。路径字符串 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| string | 返回规范化后的路径字符串 |

#### 用法说明

规范化路径（简化 `.` 和 `..`）：

```lua
print(path.normalize("/tmp/./../file.txt"))  -- 输出: /file.txt
print(path.normalize("c:\\tmp\\..\\.."))     -- 在 Windows 上输出: c:\\..
```

如果只需要转换路径分隔符而不需要简化 `.` 和 `..`，可以使用 [path.translate](#path-translate)。

## path.join

- 拼接路径

#### 函数原型

::: tip API
```lua
path.join(paths: <string|array>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| paths | 路径字符串或数组 |
| ... | 可变参数，可传递多个路径字符串 |

#### 用法说明

将多个路径项进行追加拼接，由于`windows/unix`风格的路径差异，使用api来追加路径更加跨平台，例如：

```lua
print(path.join("$(tmpdir)", "dir1", "dir2", "file.txt"))
```

上述拼接在unix上相当于：`$(tmpdir)/dir1/dir2/file.txt`，而在windows上相当于：`$(tmpdir)\\dir1\\dir2\\file.txt`

如果觉得这样很繁琐，不够清晰简洁，可以使用：[path.translate](#path-translate)方式，格式化转换路径字符串到当前平台支持的格式。

## path.translate

- 转换路径到当前平台的路径风格

#### 函数原型

::: tip API
```lua
path.translate(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 要转换的路径字符串 |

#### 用法说明

格式化转化指定路径字符串到当前平台支持的路径风格，同时支持`windows/unix`格式的路径字符串参数传入，甚至混合传入，例如：

```lua
print(path.translate("$(tmpdir)/dir/file.txt"))
print(path.translate("$(tmpdir)\\dir\\file.txt"))
print(path.translate("$(tmpdir)\\dir/dir2//file.txt"))
```

上面这三种不同格式的路径字符串，经过`translate`规范化后，就会变成当前平台支持的格式，并且会去掉冗余的路径分隔符。

如果还需要进一步简化 `.` 和 `..`，可以使用 [path.normalize](#path-normalize)。

## path.basename

- 获取路径最后不带后缀的文件名

#### 函数原型

::: tip API
```lua
path.basename(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 路径字符串 |

#### 用法说明

```lua
print(path.basename("$(tmpdir)/dir/file.txt"))
```

显示结果为：`file`

如需获取带后缀的文件名，请使用 [path.filename](#path-filename)；获取后缀名请使用 [path.extension](#path-extension)；获取目录部分请使用 [path.directory](#path-directory)。

## path.filename

- 获取路径最后带后缀的文件名

#### 函数原型

::: tip API
```lua
path.filename(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 路径字符串 |

#### 用法说明

```lua
print(path.filename("$(tmpdir)/dir/file.txt"))
```

显示结果为：`file.txt`

## path.extension

- 获取路径的后缀名

#### 函数原型

::: tip API
```lua
path.extension(path: <string>, level?: <number>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 路径字符串 |
| level | 可选。后缀层级，默认为 1 |

#### 用法说明

```lua
print(path.extension("$(tmpdir)/dir/file.txt"))
```

显示结果为：`.txt`

通过指定 `level` 参数可以获取多级后缀名，例如：

```lua
print(path.extension("/tmp/file.tar.gz", 2))
```

显示结果为：`.tar.gz`

## path.directory

- 获取路径的目录名

#### 函数原型

::: tip API
```lua
path.directory(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 路径字符串 |

#### 用法说明

```lua
print(path.directory("$(tmpdir)/dir/file.txt"))
```

显示结果为：`$(tmpdir)/dir`

## path.relative

- 转换成相对路径

#### 函数原型

::: tip API
```lua
path.relative(path: <string>, rootdir: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 要转换的路径字符串 |
| rootdir | 相对转换的根目录 |

#### 用法说明

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

与之相反的操作是 [path.absolute](#path-absolute)，可以将相对路径转换为绝对路径。可使用 [path.is_absolute](#path-is_absolute) 判断路径是否为绝对路径。

## path.absolute

- 转换成绝对路径

#### 函数原型

::: tip API
```lua
path.absolute(path: <string>, rootdir: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 要转换的路径字符串 |
| rootdir | 绝对转换的根目录 |

#### 用法说明

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

与之相反的操作是 [path.relative](#path-relative)，可以将绝对路径转换为相对路径。

## path.is_absolute

- 判断是否为绝对路径

#### 函数原型

::: tip API
```lua
path.is_absolute(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 要检查的路径字符串 |

#### 用法说明

```lua
if path.is_absolute("/tmp/file.txt") then
    -- 如果是绝对路径
end
```

## path.splitenv

- 分割环境变量中的路径

#### 函数原型

::: tip API
```lua
path.splitenv(envpath: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| envpath | 环境变量路径字符串 |

#### 用法说明

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

与之相反的操作是 [path.joinenv](#path-joinenv)，可以将路径数组拼接为环境变量字符串。可通过 [os.getenv](/zh/api/scripts/builtin-modules/os#os-getenv) 获取环境变量值。

## path.joinenv

- 拼接环境变量路径

#### 函数原型

::: tip API
```lua
path.joinenv(paths: <array>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| paths | 路径字符串数组 |

#### 用法说明

```lua
-- 在 Unix 上
print(path.joinenv({"/usr/bin", "/usr/local/bin"}))
-- 结果为：/usr/bin:/usr/local/bin

-- 在 Windows 上
print(path.joinenv({"C:\\Windows", "C:\\Windows\\System32"}))
-- 结果为：C:\Windows;C:\Windows\System32
```

与之相反的操作是 [path.splitenv](#path-splitenv)，可以将环境变量字符串分割为路径数组。当前平台的环境变量分隔符可通过 [path.envsep](#path-envsep) 获取。

## path.split

- 按路径分隔符分割路径

#### 函数原型

::: tip API
```lua
path.split(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 要分割的路径字符串 |

#### 用法说明

```lua
local items = path.split("/tmp/dir/file.txt")
-- 结果为：{ "tmp", "dir", "file.txt" }
```

与之相反的操作是 [path.join](#path-join)，可以将多个路径拼接为一个路径。

## path.sep

- 获取当前平台的路径分隔符

#### 函数原型

::: tip API
```lua
path.sep()
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| 无 | 无参数 |

#### 用法说明

```lua
print(path.sep())
```

在 Unix 上显示结果为：`/`，在 Windows 上显示结果为：`\`

## path.envsep

- 获取当前平台的环境变量路径分隔符

#### 函数原型

::: tip API
```lua
path.envsep()
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| 无 | 无参数 |

#### 用法说明

```lua
print(path.envsep())
```

在 Unix 上显示结果为：`:`，在 Windows 上显示结果为：`;`

## path.islastsep

- 判断路径最后一个字符是否为路径分隔符

#### 函数原型

::: tip API
```lua
path.islastsep(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 要检查的路径字符串 |

#### 用法说明

```lua
if path.islastsep("/tmp/dir/") then
    -- 最后一个字符是路径分隔符
end
```

## path.unix

- 转换路径为 Unix 风格

#### 函数原型

::: tip API
```lua
path.unix(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 路径字符串 |

#### 用法说明

将路径中的分隔符统一替换为 `/`，通常用于 Windows 平台上需要 Unix 风格路径的场景，例如：

```lua
print(path.unix("C:\\Windows\\System32"))
-- 结果为：C:/Windows/System32
```

如果需要转换为 Cygwin 风格（含盘符转换），请使用 [path.cygwin](#path-cygwin)。如需转换为当前平台原生风格，请使用 [path.translate](#path-translate)。

## path.cygwin

- 转换路径为 Cygwin 风格

#### 函数原型

::: tip API
```lua
path.cygwin(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 路径字符串 |

#### 用法说明

将 Windows 路径转换为 Cygwin 风格路径，会将盘符 `C:\` 转换为 `/c/`，并将 `\` 替换为 `/`：

```lua
print(path.cygwin("C:\\Windows\\System32"))
-- 结果为：/c/Windows/System32
```

## path.pattern

- 转换路径模式为 Lua 匹配模式

#### 函数原型

::: tip API
```lua
path.pattern(pattern: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| pattern | 路径模式字符串 |

#### 用法说明

将路径中的通配符 `*` 和 `**` 转换为 Lua 匹配模式，`*` 匹配单层目录内的文件名，`**` 匹配任意层级路径：

```lua
print(path.pattern("src/*.lua"))
-- 结果类似：src/[^/]*%.lua

print(path.pattern("src/**.lua"))
-- 结果类似：src/.*%.lua
```

## path.instance_of

- 判断是否为路径实例

#### 函数原型

::: tip API
```lua
path.instance_of(p: <any>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| p | 要检查的对象 |

#### 返回值说明

| 类型 | 描述 |
|------|------|
| boolean | 如果是路径实例返回 true，否则返回 false |

#### 用法说明

```lua
local p = path.new("/tmp/file.txt")
print(path.instance_of(p))      -- 输出: true
print(path.instance_of("/tmp")) -- 输出: false
```

路径实例通过 [path.new](#path-new) 创建。

