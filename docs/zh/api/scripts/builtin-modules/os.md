# os

系统操作模块，属于内置模块，无需使用[import](/zh/api/scripts/builtin-modules/import)导入，可直接脚本域调用其接口。

此模块也是lua的原生模块，xmake在其基础上进行了扩展，提供更多实用的接口。

::: tip 注意
os 模块里面只有部分readonly接口（例如：`os.getenv`, `os.arch`）是可以在描述域中使用，其他接口只能在脚本域中使用，例如：`os.cp`, `os.rm`等
:::

## os.cp

- 复制文件或目录

#### 函数原型

::: tip API
```lua
os.cp(source: <string>, destination: <string>, options: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| source | 源路径或模式 |
| destination | 目标路径 |
| options | 选项表（可选） |

#### 用法说明

行为和shell中的`cp`命令类似，支持路径通配符匹配（使用的是lua模式匹配），支持多文件复制，以及内置变量支持。

例如：

```lua
os.cp("$(scriptdir)/*.h", "$(builddir)/inc")
os.cp("$(projectdir)/src/test/**.h", "$(builddir)/inc")
```

上面的代码将：当前`xmake.lua`目录下的所有头文件、工程源码test目录下的头文件全部复制到`$(builddir)`输出目录中。

其中`$(scriptdir)`, `$(projectdir)` 这些变量是xmake的内置变量，具体详情见：[内置变量](/zh/api/description/builtin-variables)的相关文档。

而`*.h`和`**.h`中的匹配模式，跟[add_files](/zh/api/description/project-target#add-files)中的类似，前者是单级目录匹配，后者是递归多级目录匹配。

此接口同时支持目录的`递归复制`，例如：

```lua
-- 递归复制当前目录到临时目录
os.cp("$(curdir)/test/", "$(tmpdir)/test")
```

上面的复制，会把所有文件全部展开复制到指定目录，丢失源目录层级，如果要按保持原有的目录结构复制，可以设置rootdir参数：

```lua
os.cp("src/**.h", "/tmp/", {rootdir = "src"})
```

上面的脚本可以按`src`根目录，将src下的所有子文件保持目录结构复制过去。

::: tip 注意
尽量使用`os.cp`接口，而不是`os.run("cp ..")`，这样更能保证平台一致性，实现跨平台构建描述。
:::

2.5.7 下，新增 `{symlink = true}` 参数，在复制文件时候保留符号链接。

```lua
os.cp("/xxx/foo", "/xxx/bar", {symlink = true})
```

v3.0.4 以上版本，新增 `{copy_if_different = true}` 参数，仅在源文件和目标文件内容不同时才执行复制操作。如果文件内容相同，则不会重新复制，这样可以保持目标文件的 mtime 等元数据不变，避免不必要的增量构建。

```lua
os.cp("$(scriptdir)/config.h", "$(builddir)/inc/config.h", {copy_if_different = true})
```

从 v3.0.5 开始，支持异步操作：

```lua
-- 异步复制文件（阻塞等待）
os.cp("src/*.h", "dest/", {async = true})

-- 异步复制文件（非阻塞，后台执行）
os.cp("src/*.h", "dest/", {async = true, detach = true})
```

## os.mv

- 移动重命名文件或目录

#### 函数原型

::: tip API
```lua
os.mv(source: <string>, destination: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| source | 源路径或模式 |
| destination | 目标路径 |

#### 用法说明

跟[os.cp](#os-cp)的使用类似，同样支持多文件移动操作和模式匹配，例如：

```lua
-- 移动文件到临时目录
os.mv("$(builddir)/test1", "$(tmpdir)")

-- 文件移动不支持批量操作，也就是文件重命名
os.mv("$(builddir)/libtest.a", "$(builddir)/libdemo.a")
```

## os.rm

- 删除文件或目录树

#### 函数原型

::: tip API
```lua
os.rm(path: <string>, options?: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 文件或目录路径 |
| options | 选项表（可选），支持 `async` 和 `detach` 参数 |

#### 用法说明

支持递归删除目录，批量删除操作，以及模式匹配和内置变量，例如：

```lua
os.rm("$(builddir)/inc/**.h")
os.rm("$(builddir)/lib/")
```

从 v3.0.5 开始，支持异步操作：

```lua
-- 异步删除文件（阻塞等待）
os.rm("/tmp/xxx.txt", {async = true})

-- 异步删除文件（非阻塞，后台执行）
os.rm("/tmp/xxx.txt", {async = true, detach = true})
```

## os.trycp

- 尝试复制文件或目录

#### 函数原型

::: tip API
```lua
os.trycp(source: <string>, destination: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| source | 源路径或模式 |
| destination | 目标路径 |

#### 用法说明

跟[os.cp](#os-cp)类似，唯一的区别就是，此接口操作失败不会抛出异常中断xmake，而是通过返回值标示是否执行成功。

```lua
if os.trycp("file", "dest/file") then
end
```

## os.trymv

- 尝试移动文件或目录

#### 函数原型

::: tip API
```lua
os.trymv(source: <string>, destination: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| source | 源路径或模式 |
| destination | 目标路径 |

#### 用法说明

跟[os.mv](#os-mv)类似，唯一的区别就是，此接口操作失败不会抛出异常中断xmake，而是通过返回值标示是否执行成功。

```lua
if os.trymv("file", "dest/file") then
end
```

## os.tryrm

- 尝试删除文件或目录

#### 函数原型

::: tip API
```lua
os.tryrm(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 文件或目录路径 |

#### 用法说明

跟[os.rm](#os-rm)类似，唯一的区别就是，此接口操作失败不会抛出异常中断xmake，而是通过返回值标示是否执行成功。

```lua
if os.tryrm("file") then
end
```

## os.cd

- 进入指定目录

#### 函数原型

::: tip API
```lua
os.cd(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 目录路径 |

#### 用法说明

这个操作用于目录切换，同样也支持内置变量，但是不支持模式匹配和多目录处理，例如：

```lua
-- 进入临时目录
os.cd("$(tmpdir)")
```

如果要离开进入之前的目录，有多种方式：

```lua
-- 进入上级目录
os.cd("..")

-- 进入先前的目录，相当于：cd -
os.cd("-")

-- 进入目录前保存之前的目录，用于之后跨级直接切回
local oldir = os.cd("./src")
...
os.cd(oldir)
```

## os.rmdir

- 仅删除目录

#### 函数原型

::: tip API
```lua
os.rmdir(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 目录路径 |

#### 用法说明

如果不是目录就无法删除。

## os.mkdir

- 创建目录

#### 函数原型

::: tip API
```lua
os.mkdir(path: <string>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 目录路径 |
| ... | 可变参数，可传递多个目录路径 |

#### 用法说明

支持批量创建和内置变量，例如：

```lua
os.mkdir("$(tmpdir)/test", "$(builddir)/inc")
```

支持递归创建多级目录，如果父目录不存在会自动创建。

## os.touch

- 创建空文件或更新文件时间戳

#### 函数原型

::: tip API
```lua
os.touch(path: <string>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 文件路径 |
| ... | 可变参数，可传递多个文件路径 |

#### 用法说明

如果文件不存在，则创建一个空文件。如果文件已存在，则更新文件的修改时间为当前时间。

支持批量创建：

```lua
os.touch("file1.txt", "file2.txt", "file3.txt")
```

## os.isdir

- 判断是否为目录

#### 函数原型

::: tip API
```lua
os.isdir(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 目录路径 |

#### 用法说明

如果目录不存在，则返回false

```lua
if os.isdir("src") then
    -- ...
end
```

## os.isfile

- 判断是否为文件

#### 函数原型

::: tip API
```lua
os.isfile(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 文件路径 |

#### 用法说明

如果文件不存在，则返回false

```lua
if os.isfile("$(builddir)/libxxx.a") then
    -- ...
end
```

## os.exists

- 判断文件或目录是否存在

#### 函数原型

::: tip API
```lua
os.exists(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 文件或目录路径 |

#### 用法说明

如果文件或目录不存在，则返回false

```lua
-- 判断目录存在
if os.exists("$(builddir)") then
    -- ...
end

-- 判断文件存在
if os.exists("$(builddir)/libxxx.a") then
    -- ...
end
```

## os.islink

- 判断是否为符号链接

#### 函数原型

::: tip API
```lua
os.islink(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 符号链接路径 |

#### 用法说明

判断指定路径是否为符号链接，如果不是符号链接或不存在则返回 false。

```lua
if os.islink("path/to/symlink") then
    -- 是符号链接
    local target = os.readlink("path/to/symlink")
    print("链接目标:", target)
end
```

配合 [os.ln](#os-ln) 使用：

```lua
os.ln("source.txt", "link.txt")
assert(os.islink("link.txt"))
```

## os.dirs

- 遍历获取指定目录下的所有目录

#### 函数原型

::: tip API
```lua
os.dirs(pattern: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| pattern | 文件模式 |

#### 用法说明

支持[add_files](#targetadd_files)中的模式匹配，支持递归和非递归模式遍历，返回的结果是一个table数组，如果获取不到，返回空数组，例如：

```lua
-- 递归遍历获取所有子目录
for _, dir in ipairs(os.dirs("$(builddir)/inc/**")) do
    print(dir)
end
```

## os.files

- 遍历获取指定目录下的所有文件

#### 函数原型

::: tip API
```lua
os.files(pattern: <string>, options?: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| pattern | 文件模式 |
| options | 选项表（可选），支持 `async` 参数 |

#### 用法说明

支持[add_files](#targetadd_files)中的模式匹配，支持递归和非递归模式遍历，返回的结果是一个table数组，如果获取不到，返回空数组，例如：

```lua
-- 非递归遍历获取所有子文件
for _, filepath in ipairs(os.files("$(builddir)/inc/*.h")) do
    print(filepath)
end
```

从 v3.0.5 开始，支持异步操作：

```lua
-- 异步查找文件（阻塞等待返回值）
local files = os.files("src/*.c", {async = true})
```

## os.filedirs

- 遍历获取指定目录下的所有文件和目录

#### 函数原型

::: tip API
```lua
os.filedirs(pattern: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| pattern | 文件模式 |

#### 用法说明

支持[add_files](#targetadd_files)中的模式匹配，支持递归和非递归模式遍历，返回的结果是一个table数组，如果获取不到，返回空数组，例如：

```lua
-- 递归遍历获取所有子文件和目录
for _, filedir in ipairs(os.filedirs("$(builddir)/**")) do
    print(filedir)
end
```

## os.exit

- 退出程序

#### 函数原型

::: tip API
```lua
os.exit(code: <number>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| code | 退出码（可选） |

#### 用法说明

退出当前程序，并返回指定的退出码。如果不指定退出码，默认为 0（成功）。

```lua
-- 正常退出
os.exit(0)

-- 异常退出
if error_occurred then
    os.exit(1)
end
```

## os.isexec

- 判断文件是否可执行

#### 函数原型

::: tip API
```lua
os.isexec(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 文件路径 |

#### 用法说明

判断指定文件是否具有可执行权限。在 Unix 系统上检查文件的执行权限位，在 Windows 上检查文件扩展名。

用于动态检测可执行文件：

```lua
local program = "/usr/bin/gcc"
if os.isexec(program) then
    print("程序可执行")
    os.execv(program, {"--version"})
else
    print("程序不可执行或不存在")
end
```

## os.run

- 安静运行原生shell命令

#### 函数原型

::: tip API
```lua
os.run(command: <string>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| command | 命令字符串 |
| ... | 命令的可变参数 |

#### 用法说明

用于执行第三方的shell命令，但不会回显输出，仅仅在出错后，高亮输出错误信息。

此接口支持参数格式化、内置变量，例如：

```lua
-- 格式化参数传入
os.run("echo hello %s!", "xmake")

-- 列举构建目录文件
os.run("ls -l $(builddir)")
```

::: tip 注意
使用此接口执行shell命令，容易使构建跨平台性降低，对于`os.run("cp ..")`这种尽量使用`os.cp`代替
如果必须使用此接口运行shell程序，请自行使用[config.plat](#config-plat)接口判断平台支持。
:::

## os.runv

- 安静运行原生shell命令，带参数列表

#### 函数原型

::: tip API
```lua
os.runv(program: <string>, args: <table>, options: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| program | 程序名 |
| args | 参数表 |
| options | 选项表（可选） |

#### 用法说明

跟[os.run](#os-run)类似，只是传递参数的方式是通过参数列表传递，而不是字符串命令，例如：

```lua
os.runv("echo", {"hello", "xmake!"})
```

另外，此接口也支持envs参数设置：

```lua
os.runv("echo", {"hello", "xmake!"}, {envs = {PATH = "xxx;xx", CFLAGS = "xx"}})
```

## os.exec

- 回显运行原生shell命令

#### 函数原型

::: tip API
```lua
os.exec(command: <string>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| command | 命令字符串 |
| ... | 命令的可变参数 |

#### 用法说明

与[os.run](#os-run)接口类似，唯一的不同是，此接口执行shell程序时，是带回显输出的，一般调试的时候用的比较多

## os.execv

- 回显运行原生shell命令，带参数列表

#### 函数原型

::: tip API
```lua
os.execv(program: <string>, args: <table>, options: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| program | 程序名 |
| args | 参数表 |
| options | 选项表（可选） |

#### 用法说明

跟[os.exec](#os-exec)类似，只是传递参数的方式是通过参数列表传递，而不是字符串命令，例如：

```lua
os.execv("echo", {"hello", "xmake!"})
```

另外，此接口还支持一个可选的参数，用于传递设置：重定向输出，执行环境变量设置，例如：

```lua
os.execv("echo", {"hello", "xmake!"}, {stdout = outfile, stderr = errfile, envs = {PATH = "xxx;xx", CFLAGS = "xx"}}
```

其中，stdout 和 stderr 参数用于传递重定向输出和错误输出，可以直接传入文件路径，也可以传入 io.open 打开的文件对象。

v2.5.1 之后的版本，我们还支持设置 stdin 参数，来支持重定向输入文件。

::: tip 注意
stdout/stderr/stdin 可以同时支持：文件路径、文件对象、管道对象等三种类型值。
:::

### 重定向到文件

```lua
-- 重定向输出到文件
os.execv("echo", {"hello"}, {stdout = "output.txt"})

-- 使用文件对象
local outfile = io.open("output.txt", "w")
os.execv("echo", {"hello"}, {stdout = outfile})
outfile:close()
```

### 重定向到管道

配合 pipe 模块，可以捕获子进程的输出进行处理：

```lua
import("core.base.pipe")
import("core.base.bytes")

-- 创建管道
local rpipe, wpipe = pipe.openpair()

-- 将子进程 stdout 重定向到管道
os.execv("ls", {"-l"}, {stdout = wpipe})

-- 关闭写端，读取输出
wpipe:close()
local buff = bytes(8192)
local read, data = rpipe:read(buff, 8192)
if read > 0 then
    print("命令输出:", data:str())
end
rpipe:close()
```

同时重定向 stdout 和 stderr：

```lua
import("core.base.pipe")
import("core.base.bytes")

local rpipe_out, wpipe_out = pipe.openpair()
local rpipe_err, wpipe_err = pipe.openpair()

-- 分别重定向标准输出和错误输出
os.execv("make", {}, {stdout = wpipe_out, stderr = wpipe_err})

wpipe_out:close()
wpipe_err:close()

-- 读取标准输出
local buff = bytes(8192)
local read, output = rpipe_out:read(buff, 8192)
print("标准输出:", output and output:str() or "")

-- 读取错误输出  
local read, errors = rpipe_err:read(buff, 8192)
print("错误输出:", errors and errors:str() or "")

rpipe_out:close()
rpipe_err:close()
```

另外，如果想在这次执行中临时设置和改写一些环境变量，可以传递envs参数，里面的环境变量设置会替换已有的设置，但是不影响外层的执行环境，只影响当前命令。

我们也可以通过`os.getenvs()`接口获取当前所有的环境变量，然后改写部分后传入envs参数。

## os.iorun

- 安静运行原生shell命令并获取输出内容

#### 函数原型

::: tip API
```lua
os.iorun(command: <string>, options: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| command | 命令字符串 |
| options | 选项表（可选） |

#### 用法说明

与[os.run](#os-run)接口类似，唯一的不同是，此接口执行shell程序后，会获取shell程序的执行结果，相当于重定向输出。

可同时获取`stdout`, `stderr`中的内容，例如：

```lua
local outdata, errdata = os.iorun("echo hello xmake!")
```

## os.iorunv

- 安静运行原生shell命令并获取输出内容，带参数列表

#### 函数原型

::: tip API
```lua
os.iorunv(program: <string>, args: <table>, options: <table>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| program | 程序名称 |
| args | 参数列表 |
| options | 选项表（可选） |

#### 用法说明

跟[os.iorun](#os-iorun)类似，只是传递参数的方式是通过参数列表传递，而不是字符串命令，例如：

```lua
local outdata, errdata = os.iorunv("echo", {"hello", "xmake!"})
```

另外，此接口也支持envs参数设置：

```lua
local outdata, errdata = os.iorunv("echo", {"hello", "xmake!"}, {envs = {PATH = "xxx;xx", CFLAGS = "xx"}}
```

## os.getenv

- 获取系统环境变量

#### 函数原型

::: tip API
```lua
os.getenv(name: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 环境变量名 |

#### 用法说明

获取指定环境变量的值。如果环境变量不存在，返回 nil。

```lua
local path = os.getenv("PATH")
if path then
    print("PATH:", path)
end

-- 获取带默认值的环境变量
local home = os.getenv("HOME") or "/tmp"
```

## os.setenv

- 设置系统环境变量

#### 函数原型

::: tip API
```lua
os.setenv(name: <string>, value: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 环境变量名 |
| value | 环境变量值 |

#### 用法说明

设置指定环境变量的值。设置后会影响当前进程及其子进程的环境变量。

```lua
-- 设置环境变量
os.setenv("MY_VAR", "my_value")
print(os.getenv("MY_VAR"))  -- 输出: my_value

-- 设置 PATH
os.setenv("PATH", "/new/path:" .. os.getenv("PATH"))
```

## os.tmpdir

- 获取临时目录

#### 函数原型

::: tip API
```lua
os.tmpdir()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

跟[$(tmpdir)](/zh/api/description/builtin-variables#var-tmpdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

```lua
print(path.join(os.tmpdir(), "file.txt"))
```

等价于：

```lua
print("$(tmpdir)/file.txt")
```

## os.tmpfile

- 获取临时文件路径

#### 函数原型

::: tip API
```lua
os.tmpfile()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

生成一个唯一的临时文件路径，返回的仅是路径字符串，文件本身不会自动创建，需要自己创建。

每次调用都会生成不同的临时文件路径，适合用于创建临时文件：

```lua
-- 生成临时文件路径
local tmpfile = os.tmpfile()
print("临时文件:", tmpfile)  -- 例如: /tmp/xmake_XXXXXX

-- 创建并使用临时文件
io.writefile(tmpfile, "temporary data")
-- 使用完后删除
os.rm(tmpfile)
```

## os.curdir

- 获取当前目录路径

#### 函数原型

::: tip API
```lua
os.curdir()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

跟[$(curdir)](/zh/api/description/builtin-variables#var-curdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

用法参考：[os.tmpdir](#os-tmpdir)。

## os.filesize

- 获取文件大小

#### 函数原型

::: tip API
```lua
os.filesize(filepath: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| filepath | 文件路径 |

#### 用法说明

返回文件的大小（字节数）。如果文件不存在或无法访问，返回 0。

实用示例：

```lua
local size = os.filesize("build/output.bin")
if size > 0 then
    print(string.format("文件大小: %.2f KB", size / 1024))
end

-- 检查文件是否为空
if os.filesize("config.txt") == 0 then
    print("配置文件为空")
end
```

## os.scriptdir

- 获取当前描述脚本的路径

#### 函数原型

::: tip API
```lua
os.scriptdir()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

跟[$(scriptdir)](/zh/api/description/builtin-variables#var-scriptdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

用法参考：[os.tmpdir](#os-tmpdir)。

## os.programdir

- 获取xmake安装主程序脚本目录

#### 函数原型

::: tip API
```lua
os.programdir()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

跟[$(programdir)](/zh/api/description/builtin-variables#var-programdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

## os.programfile

- 获取xmake可执行文件路径

#### 函数原型

::: tip API
```lua
os.programfile()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

返回 xmake 可执行文件的完整路径。

```lua
print("xmake 路径:", os.programfile())
-- 例如: /usr/local/bin/xmake
```

## os.projectdir

- 获取工程主目录

#### 函数原型

::: tip API
```lua
os.projectdir()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

跟[$(projectdir)](/zh/api/description/builtin-variables#var-projectdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

## os.arch

- 获取当前系统架构

#### 函数原型

::: tip API
```lua
os.arch()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

返回当前主机系统的默认架构。例如在 `linux x86_64` 上执行 xmake 进行构建，返回值是：`x86_64`

常见架构值：`x86_64`、`i386`、`arm64`、`armv7`、`mips` 等。

```lua
print("当前架构:", os.arch())

-- 根据架构执行不同的操作
if os.arch() == "x86_64" then
    add_defines("ARCH_X64")
end
```

## os.host

- 获取当前主机的操作系统

#### 函数原型

::: tip API
```lua
os.host()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

跟 [$(host)](/zh/api/description/builtin-variables#var-host) 结果一致。例如在 `linux x86_64` 上执行 xmake 进行构建，返回值是：`linux`

常见系统值：`linux`、`macosx`、`windows`、`bsd` 等。

```lua
print("当前系统:", os.host())

-- 根据系统执行不同的操作
if os.host() == "windows" then
    add_defines("WINDOWS")
elseif os.host() == "linux" then
    add_defines("LINUX")
end
```

## os.subhost

- 获取当前子系统

#### 函数原型

::: tip API
```lua
os.subhost()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

获取当前子系统环境，如：在 Windows 上的 msys、cygwin 等。

如果不在子系统环境中运行，返回值与 [os.host()](#os-host) 相同。

```lua
-- 在 MSYS2 环境中
print(os.subhost())  -- 返回: msys

-- 检测是否在子系统环境中
if os.subhost() ~= os.host() then
    print("在子系统环境中运行")
end
```

## os.subarch

- 获取子系统架构

#### 函数原型

::: tip API
```lua
os.subarch()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

获取子系统的架构。如果不在子系统环境中运行，返回值与 [os.arch()](#os-arch) 相同。

## os.is_host

- 判断给定系统是否为当前系统

#### 函数原型

::: tip API
```lua
os.is_host(host: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| host | 系统名称 |

#### 用法说明

```lua
if os.is_host("linux") then
    -- 在 Linux 系统上
end

if os.is_host("macosx", "linux") then
    -- 在 macOS 或 Linux 系统上
end
```

支持同时判断多个系统，只要匹配其中一个就返回 true。

::: tip 提示
推荐使用更简洁的内置接口 `is_host()`，无需 `os.` 前缀，用法一致：

```lua
if is_host("linux") then
    -- 在 Linux 系统上
end
```
:::

## os.is_arch

- 判断给定架构是否为当前架构

#### 函数原型

::: tip API
```lua
os.is_arch(arch: <string>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| arch | 架构名称 |
| ... | 可变参数，可以传递多个架构 |

#### 用法说明

```lua
if os.is_arch("x86_64") then
    -- 在 x86_64 架构上
end

if os.is_arch("x86_64", "arm64") then
    -- 在 x86_64 或 arm64 架构上
end
```

支持同时判断多个架构。

## os.is_subhost

- 判断给定子系统是否为当前子系统

#### 函数原型

::: tip API
```lua
os.is_subhost(subhost: <string>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| subhost | 子系统名称 |
| ... | 可变参数，可以传递多个子系统 |

#### 用法说明

```lua
if os.is_subhost("msys") then
    -- 在 MSYS 子系统中
end
```

用于检测是否运行在特定的子系统环境中，如 msys、cygwin 等。

::: tip 提示
推荐使用更简洁的内置接口 `is_subhost()`，用法一致。
:::

## os.is_subarch

- 判断给定子系统架构是否为当前子系统架构

#### 函数原型

::: tip API
```lua
os.is_subarch(subarch: <string>, ...)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| subarch | 子系统架构名称 |
| ... | 可变参数，可以传递多个子系统架构 |

#### 用法说明

```lua
if os.is_subarch("x86_64") then
    -- 子系统架构是 x86_64
end
```

## os.ln

- 为一个文件或目录创建符号链接

#### 函数原型

::: tip API
```lua
os.ln(source: <string>, target: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| source | 源文件或目录路径 |
| target | 目标符号链接路径 |

#### 用法说明

```lua
-- 创建一个指向 "tmp.txt" 文件的符号链接 "tmp.txt.ln"
os.ln("xxx.txt", "xxx.txt.ln")
```

## os.readlink

- 读取符号链接内容

#### 函数原型

::: tip API
```lua
os.readlink(path: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| path | 符号链接路径 |

#### 用法说明

```lua
local target = os.readlink("path/to/symlink")
```

读取符号链接指向的目标路径。如果指定的路径不是符号链接，则返回 nil。

配合 [os.ln](#os-ln) 和 [os.islink](#os-islink) 使用：

```lua
os.ln("source.txt", "link.txt")
if os.islink("link.txt") then
    local target = os.readlink("link.txt")
    print("链接指向:", target)  -- 输出: source.txt
end
```

## os.raise

- 抛出一个异常并且中止当前脚本运行

#### 函数原型

::: tip API
```lua
os.raise(message: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| message | 错误信息字符串 |

#### 用法说明

```lua
-- 抛出一个带 "an error occurred" 信息的异常
os.raise("an error occurred")
```

::: tip 注意
推荐使用与 `os.raise` 等价的内置接口 `raise`，用法与 `os.raise` 一致
:::

## os.raiselevel

- 与 [os.raise](#os-raise) 类似但是可以指定异常等级

#### 函数原型

::: tip API
```lua
os.raiselevel(level: <number>, message: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| level | 异常等级 |
| message | 异常信息 |

#### 用法说明

```lua
-- 抛出一个带 "an error occurred" 信息的异常
os.raiselevel(3, "an error occurred")
```

## os.features

- 获取系统特性

#### 函数原型

::: tip API
```lua
os.features()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

获取当前操作系统支持的特性列表。返回一个 table，包含系统支持的各种特性。

## os.getenvs

- 获取所有当前系统变量

#### 函数原型

::: tip API
```lua
os.getenvs()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

```lua
local envs = os.getenvs()
-- home directory (on linux)
print(envs["HOME"])
```

## os.setenvs

- 使用给定系统变量替换当前所有系统变量，并返回旧系统变量

#### 函数原型

::: tip API
```lua
os.setenvs(envs: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| envs | 环境变量表 |

#### 用法说明

## os.addenvs

- 向当前系统变量添加新变量，并且返回所有旧系统变量

#### 函数原型

::: tip API
```lua
os.addenvs(envs: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| envs | 要添加的环境变量表 |

#### 用法说明

```lua
os.setenvs({EXAMPLE = "a/path"}) -- add a custom variable to see addenvs impact on it

local oldenvs = os.addenvs({EXAMPLE = "some/path/"})
print(os.getenvs()["EXAMPLE"]) --got some/path/;a/path
print(oldenvs["EXAMPLE"]) -- got a/path
```

## os.joinenvs

- 拼接系统变量，与 [os.addenvs](#os-addenvs) 类似，但是不会对当前环境变量产生影响，若第二个参数为 `nil`，则使用原有环境变量

#### 函数原型

::: tip API
```lua
os.joinenvs(envs1: <table>, envs2: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| envs1 | 第一个环境变量表 |
| envs2 | 第二个环境变量表 |

#### 用法说明

```lua
local envs0 = {CUSTOM = "a/path"}
local envs1 = {CUSTOM = "some/path/"}
print(os.joinenvs(envs0, envs1)) -- result is : { CUSTION = "a/path;some/path/" }
```

## os.addenv

- 向指定环境变量添加值

#### 函数原型

::: tip API
```lua
os.addenv(name: <string>, value: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 环境变量名 |
| value | 要添加的值 |

#### 用法说明

向指定的环境变量追加新值，使用系统默认的分隔符（Unix 上是 `:`，Windows 上是 `;`）。

```lua
-- 向 PATH 添加新路径
os.addenv("PATH", "/usr/local/bin")

-- 验证
print(os.getenv("PATH"))  -- 新路径会被追加到现有 PATH 中
```

## os.setenvp

- 使用给定分隔符设置环境变量

#### 函数原型

::: tip API
```lua
os.setenvp(name: <string>, value: <string>, separator: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 环境变量名 |
| value | 环境变量值 |
| separator | 分隔符字符串 |

#### 用法说明

设置环境变量，使用指定的分隔符。与 [os.setenv](#os-setenv) 类似，但可以自定义分隔符。

## os.addenvp

- 使用给定分隔符向环境变量添加值

#### 函数原型

::: tip API
```lua
os.addenvp(name: <string>, value: <string>, separator: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| name | 环境变量名 |
| value | 要添加的值 |
| separator | 分隔符字符串 |

#### 用法说明

向环境变量追加值，使用指定的分隔符。与 [os.addenv](#os-addenv) 类似，但可以自定义分隔符。

## os.workingdir

- 获取工作目录

#### 函数原型

::: tip API
```lua
os.workingdir()
```
:::

#### 参数说明

此函数不需要参数。

#### 用法说明

获取当前工作目录的绝对路径。与 `os.curdir()` 类似，但返回的是工作目录而不是当前脚本执行目录。

```lua
print("工作目录:", os.workingdir())
```

## os.isroot

- 判断xmake是否以管理员权限运行

#### 函数原型

::: tip API
```lua
os.isroot()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

在 Unix 系统上检查是否以 root 用户运行，在 Windows 上检查是否以管理员权限运行。

某些操作需要管理员权限时很有用：

```lua
if not os.isroot() then
    raise("此操作需要管理员权限，请使用 sudo 或以管理员身份运行")
end
```

## os.fscase

- 判断操作系统的文件系统是否大小写敏感

#### 函数原型

::: tip API
```lua
os.fscase()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

返回 true 表示文件系统区分大小写（如 Linux），false 表示不区分（如 Windows、macOS 默认）。

用于处理跨平台的文件名兼容性：

```lua
if not os.fscase() then
    -- 在不区分大小写的系统上，避免使用仅大小写不同的文件名
    print("警告: 文件系统不区分大小写")
end
```

## os.term

- 获取当前终端 (windows-terminal, vscode, xterm, ...)

#### 函数原型

::: tip API
```lua
os.term()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

## os.shell

- 获取当前shell

#### 函数原型

::: tip API
```lua
os.shell()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

获取当前使用的 shell 程序名称，支持多种 shell 类型如 pwsh, cmd, bash, zsh 等。

## os.cpuinfo

- 获取当前CPU信息

#### 函数原型

::: tip API
```lua
os.cpuinfo(key: <string>)
```
:::

#### 参数说明

| 参数 | 描述 |
|------|------|
| key | CPU信息键名（可选） |

#### 用法说明

```lua
print(os.cpuinfo())
-- probably got {
--   march = "Alder Lake",
--   model = 154,
--   ncpu = 20,
--   model_name = "12th Gen Intel(R) Core(TM) i9-12900H",
--   usagerate = 0.041839182376862,
--   vendor = "GenuineIntel",
--   family = 6
-- }
print(os.cpuinfo("march")) -- probably got "Alder Lake"
```

## os.meminfo

- 获取内存信息

#### 函数原型

::: tip API
```lua
os.meminfo(key: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| key | 内存信息键名（可选） |

#### 用法说明

```lua
print(os.meminfo())
-- probably got {
--   pagesize = 4096,
--   usagerate = 0.60694103194103,
--   availsize = 12798,
--   totalsize = 32560
-- }
print(os.meminfo("pagesize")) -- probably got 4096
```

## os.default_njob

- 获取默认编译任务数

#### 函数原型

::: tip API
```lua
os.default_njob()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

返回默认的并行编译任务数，通常等于 CPU 核心数。

```lua
local njob = os.default_njob()
print("默认并行任务数:", njob)
```

## os.argv

- 将命令行字符串解析为参数列表

#### 函数原型

::: tip API
```lua
os.argv(command: <string>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| command | 命令行字符串 |

#### 用法说明

将命令行字符串解析为参数数组，支持引号、转义字符等复杂格式。

解析规则：
- 支持双引号和单引号包裹参数
- 支持转义字符（`\`）
- 自动处理空格分隔
- 处理特殊字符如括号、反斜杠等

示例：

```lua
-- 简单参数
os.argv("aa bb cc")  -- 返回: {"aa", "bb", "cc"}

-- 带引号的参数
os.argv('"aa bb cc" dd')  -- 返回: {"aa bb cc", "dd"}

-- 带等号的参数
os.argv("--bb=bbb -c")  -- 返回: {"--bb=bbb", "-c"}

-- 转义引号
os.argv('-DTEST=\\"hello\\"')  -- 返回: {'-DTEST="hello"'}

-- 复杂参数
os.argv('-DTEST="hello world"')  -- 返回: {'-DTEST=hello world'}
```

支持 `splitonly` 选项仅分割不处理引号：

```lua
os.argv('-DTEST="hello world"', {splitonly = true})  -- 返回: {'-DTEST="hello world"'}
```

## os.args

- 将参数列表转换为命令行字符串

#### 函数原型

::: tip API
```lua
os.args(args: <table>, options: <table>)
```
:::


#### 参数说明

| 参数 | 描述 |
|------|------|
| args | 参数数组 |
| options | 选项表（可选） |

#### 用法说明

将参数数组转换为命令行字符串，是 [os.argv](#os-argv) 的逆操作。

自动处理特殊字符：
- 含有空格的参数会自动加引号
- 自动转义特殊字符
- 处理路径中的反斜杠

示例：

```lua
-- 简单参数
os.args({"aa", "bb", "cc"})  -- 返回: "aa bb cc"

-- 含空格的参数
os.args({"aa bb cc", "dd"})  -- 返回: '"aa bb cc" dd'

-- 带引号的参数
os.args({'-DTEST="hello"'})  -- 返回: '-DTEST=\\"hello\\"'

-- 路径参数
os.args({"aa\\bb/cc dd", "ee"})  -- 返回: '"aa\\\\bb/cc dd" ee'
```

支持 `escape` 选项启用额外的转义：

```lua
os.args({"aa\\bb/cc", "dd"}, {escape = true})  -- 返回: "aa\\\\bb/cc dd"
```

配合 `os.argv` 进行往返转换：

```lua
local cmdline = "gcc -o test test.c"
local args = os.argv(cmdline)
local cmdline2 = os.args(args)
-- cmdline2 应该与 cmdline 等价
```

## os.mclock

- 获取单调时钟时间（毫秒）

#### 函数原型

::: tip API
```lua
os.mclock()
```
:::


#### 参数说明

此函数不需要参数。

#### 用法说明

返回单调递增的时间戳（毫秒），适合用于测量时间间隔。

与 `os.clock()` 不同，`os.mclock()` 返回的是单调时钟，不受系统时间调整的影响，更适合用于性能测量：

```lua
local function benchmark(func)
    local start = os.mclock()
    func()
    local elapsed = os.mclock() - start
    print(string.format("执行耗时: %.2f ms", elapsed))
end

benchmark(function()
    os.sleep(100)
end)
```
