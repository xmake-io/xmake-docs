# os

系统操作模块，属于内置模块，无需使用[import](/zh/api/scripts/builtin-modules/import)导入，可直接脚本域调用其接口。

此模块也是lua的原生模块，xmake在其基础上进行了扩展，提供更多实用的接口。

::: tip 注意
os 模块里面只有部分readonly接口（例如：`os.getenv`, `os.arch`）是可以在描述域中使用，其他接口只能在脚本域中使用，例如：`os.cp`, `os.rm`等
:::

## os.cp

- 复制文件或目录

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

## os.mv

- 移动重命名文件或目录

跟[os.cp](#os-cp)的使用类似，同样支持多文件移动操作和模式匹配，例如：

```lua
-- 移动文件到临时目录
os.mv("$(builddir)/test1", "$(tmpdir)")

-- 文件移动不支持批量操作，也就是文件重命名
os.mv("$(builddir)/libtest.a", "$(builddir)/libdemo.a")
```

## os.rm

- 删除文件或目录树

支持递归删除目录，批量删除操作，以及模式匹配和内置变量，例如：

```lua
os.rm("$(builddir)/inc/**.h")
os.rm("$(builddir)/lib/")
```

## os.trycp

- 尝试复制文件或目录

跟[os.cp](#os-cp)类似，唯一的区别就是，此接口操作失败不会抛出异常中断xmake，而是通过返回值标示是否执行成功。

```lua
if os.trycp("file", "dest/file") then
end
```

## os.trymv

- 尝试移动文件或目录

跟[os.mv](#os-mv)类似，唯一的区别就是，此接口操作失败不会抛出异常中断xmake，而是通过返回值标示是否执行成功。

```lua
if os.trymv("file", "dest/file") then
end
```

## os.tryrm

- 尝试删除文件或目录

跟[os.rm](#os-rm)类似，唯一的区别就是，此接口操作失败不会抛出异常中断xmake，而是通过返回值标示是否执行成功。

```lua
if os.tryrm("file") then
end
```

## os.cd

- 进入指定目录

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

如果不是目录就无法删除。

## os.mkdir

- 创建目录

支持批量创建和内置变量，例如：

```lua
os.mkdir("$(tmpdir)/test", "$(builddir)/inc")
```

## os.isdir

- 判断是否为目录

如果目录不存在，则返回false

```lua
if os.isdir("src") then
    -- ...
end
```

## os.isfile

- 判断是否为文件

如果文件不存在，则返回false

```lua
if os.isfile("$(builddir)/libxxx.a") then
    -- ...
end
```

## os.exists

- 判断文件或目录是否存在

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

## os.dirs

- 遍历获取指定目录下的所有目录

支持[add_files](#targetadd_files)中的模式匹配，支持递归和非递归模式遍历，返回的结果是一个table数组，如果获取不到，返回空数组，例如：

```lua
-- 递归遍历获取所有子目录
for _, dir in ipairs(os.dirs("$(builddir)/inc/**")) do
    print(dir)
end
```

## os.files

- 遍历获取指定目录下的所有文件

支持[add_files](#targetadd_files)中的模式匹配，支持递归和非递归模式遍历，返回的结果是一个table数组，如果获取不到，返回空数组，例如：

```lua
-- 非递归遍历获取所有子文件
for _, filepath in ipairs(os.files("$(builddir)/inc/*.h")) do
    print(filepath)
end
```

## os.filedirs

- 遍历获取指定目录下的所有文件和目录

支持[add_files](#targetadd_files)中的模式匹配，支持递归和非递归模式遍历，返回的结果是一个table数组，如果获取不到，返回空数组，例如：

```lua
-- 递归遍历获取所有子文件和目录
for _, filedir in ipairs(os.filedirs("$(builddir)/**")) do
    print(filedir)
end
```

## os.run

- 安静运行原生shell命令

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

与[os.run](#os-run)接口类似，唯一的不同是，此接口执行shell程序时，是带回显输出的，一般调试的时候用的比较多

## os.execv

- 回显运行原生shell命令，带参数列表

跟[os.exec](#os-exec)类似，只是传递参数的方式是通过参数列表传递，而不是字符串命令，例如：

```lua
os.execv("echo", {"hello", "xmake!"})
```

另外，此接口还支持一个可选的参数，用于传递设置：重定向输出，执行环境变量设置，例如：

```lua
os.execv("echo", {"hello", "xmake!"}, {stdout = outfile, stderr = errfile, envs = {PATH = "xxx;xx", CFLAGS = "xx"}}
```

其中，stdout和stderr参数用于传递重定向输出和错误输出，可以直接传入文件路径，也可以传入io.open打开的文件对象。

v2.5.1 之后的版本，我们还支持设置 stdin 参数，来支持重定向输入文件。

::: tip 注意
stdout/stderr/stdin 可以同时支持：文件路径、文件对象、管道对象等三种类型值。
:::

另外，如果想在这次执行中临时设置和改写一些环境变量，可以传递envs参数，里面的环境变量设置会替换已有的设置，但是不影响外层的执行环境，只影响当前命令。

我们也可以通过`os.getenvs()`接口获取当前所有的环境变量，然后改写部分后传入envs参数。

## os.iorun

- 安静运行原生shell命令并获取输出内容

与[os.run](#os-run)接口类似，唯一的不同是，此接口执行shell程序后，会获取shell程序的执行结果，相当于重定向输出。

可同时获取`stdout`, `stderr`中的内容，例如：

```lua
local outdata, errdata = os.iorun("echo hello xmake!")
```

## os.iorunv

- 安静运行原生shell命令并获取输出内容，带参数列表

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

```lua
print(os.getenv("PATH"))
```

## os.setenv

- 设置系统环境变量

```lua
os.setenv("HOME", "/tmp/")
```

## os.tmpdir

- 获取临时目录

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

用于获取生成一个临时文件路径，仅仅是个路径，文件需要自己创建。

## os.curdir

- 获取当前目录路径

跟[$(curdir)](/zh/api/description/builtin-variables#var-curdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

用法参考：[os.tmpdir](#os-tmpdir)。

## os.filesize

- 获取文件大小

```lua
print(os.filesize("/tmp/a"))
```

## os.scriptdir

- 获取当前描述脚本的路径

跟[$(scriptdir)](/zh/api/description/builtin-variables#var-scriptdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

用法参考：[os.tmpdir](#os-tmpdir)。

## os.programdir

- 获取xmake安装主程序脚本目录

跟[$(programdir)](/zh/api/description/builtin-variables#var-programdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

## os.programfile

- 获取xmake可执行文件路径

## os.projectdir

- 获取工程主目录

跟[$(projectdir)](/zh/api/description/builtin-variables#var-projectdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

## os.arch

- 获取当前系统架构

也就是当前主机系统的默认架构，例如我在`linux x86_64`上执行xmake进行构建，那么返回值是：`x86_64`

## os.host

- 获取当前主机的操作系统

跟[$(host)](/zh/api/description/builtin-variables#var-host)结果一致，例如我在`linux x86_64`上执行xmake进行构建，那么返回值是：`linux`

## os.subhost

- 获取当前子系统，如：在Windows上的msys、cygwin

## os.subarch

- 获取子系统架构

## os.is_host

- 判断给定系统是否为当前系统

## os.is_arch

- 判断给定架构是否为当前架构

## os.is_subhost

- 判断给定子系统是否为当前子系统

## os.is_subarch

- 判断给定子系统架构是否为当前子系统架构

## os.ln

- 为一个文件或目录创建符号链接

```lua
-- 创建一个指向 "tmp.txt" 文件的符号链接 "tmp.txt.ln"
os.ln("xxx.txt", "xxx.txt.ln")
```

## os.readlink

- 读取符号链接内容

## os.raise

- 抛出一个异常并且中止当前脚本运行

```lua
-- 抛出一个带 "an error occurred" 信息的异常
os.raise("an error occurred")
```

::: tip 注意
推荐使用与 `os.raise` 等价的内置接口 `raise`，用法与 `os.raise` 一致
:::

## os.raiselevel

- 与 [os.raise](#os-raise) 类似但是可以指定异常等级

```lua
-- 抛出一个带 "an error occurred" 信息的异常
os.raiselevel(3, "an error occurred")
```

## os.features

- 获取系统特性

## os.getenvs

- 获取所有当前系统变量

```lua
local envs = os.getenvs()
-- home directory (on linux)
print(envs["HOME"])
```

## os.setenvs

- 使用给定系统变量替换当前所有系统变量，并返回旧系统变量

## os.addenvs

- 向当前系统变量添加新变量，并且返回所有旧系统变量

```lua
os.setenvs({EXAMPLE = "a/path"}) -- add a custom variable to see addenvs impact on it

local oldenvs = os.addenvs({EXAMPLE = "some/path/"})
print(os.getenvs()["EXAMPLE"]) --got some/path/;a/path
print(oldenvs["EXAMPLE"]) -- got a/path
```

## os.joinenvs

- 拼接系统变量，与 [os.addenvs](#os-addenvs) 类似，但是不会对当前环境变量产生影响，若第二个参数为 `nil`，则使用原有环境变量

```lua
-- os.joinenvs(envs, oldenvs)
--
-- @param envs      table 类型，新插入的环境变量
--
-- @param oldenvs   table 类型，被插入的环境变量，若为 nil, 则为原有环境变量
--
-- @return          table 类型，拼接后的环境变量
local envs0 = {CUSTOM = "a/path"}
local envs1 = {CUSTOM = "some/path/"}
print(os.joinenvs(envs0, envs1)) -- result is : { CUSTION = "a/path;some/path/" }
```

## os.setenvp

- 使用给定分隔符设置环境变量

## os.workingdir

- 获取工作目录

## os.isroot

- 判断xmake是否以管理员权限运行

## os.fscase

- 判断操作系统的文件系统是否大小写敏感

## os.term

- 获取当前终端 (windows-terminal, vscode, xterm, ...)

## os.shell

- 获取当前shell (pwsh, cmd, bash, zsh, ...)

## os.cpuinfo

- 获取当前CPU信息

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
