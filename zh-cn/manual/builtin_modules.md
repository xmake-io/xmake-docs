
在自定义脚本、插件脚本、任务脚本、平台扩展、模板扩展等脚本代码中使用，也就是在类似下面的代码块中，可以使用这些模块接口：

```lua
on_run(function (target)
    print("hello xmake!")
end)
```

!> 为了保证外层的描述域尽可能简洁、安全，一般不建议在这个域使用接口和模块操作api，因此大部分模块接口只能脚本域使用，来实现复杂功能。</br>
当然少部分只读的内置接口还是可以在描述域使用的，具体见下表：

在描述域使用接口调用的实例如下，一般仅用于条件控制：

```lua
-- 扫描当前xmake.lua目录下的所有子目录，以每个目录的名字定义一个task任务
for _, taskname in ipairs(os.dirs("*"), path.basename) do
    task(taskname)
        on_run(function ()
        end)
end
```

上面所说的脚本域、描述域主要是指：

```lua
-- 描述域
target("test")

    -- 描述域
    set_kind("static")
    add_files("src/*.c")

    on_run(function (target)
        -- 脚本域
    end)

-- 描述域
```

### import

#### 导入扩展摸块

import的主要用于导入xmake的扩展类库以及一些自定义的类库模块，一般用于：

* 自定义脚本([on_build](/zh-cn/manual/project_target?id=targeton_build), [on_run](/zh-cn/manual/project_target?id=targeton_run) ..)
* 插件开发
* 模板开发
* 平台扩展
* 自定义任务task

导入机制如下：

1. 优先从当前脚本目录下导入
2. 再从扩展类库中导入

导入的语法规则：

基于`.`的类库路径规则，例如：

```lua
import("core.base.option")
import("core.base.task")

function main()

    -- 获取参数选项
    print(option.get("version"))

    -- 运行任务和插件
    task.run("hello")
end
```

导入当前目录下的自定义模块：

目录结构：

```
plugin
  - xmake.lua
  - main.lua
  - modules
    - hello1.lua
    - hello2.lua
```

在main.lua中导入modules

```lua
import("modules.hello1")
import("modules.hello2")
```

导入后就可以直接使用里面的所有公有接口，私有接口用`_`前缀标示，表明不会被导出，不会被外部调用到。。

除了当前目录，我们还可以导入其他指定目录里面的类库，例如：

```lua
import("hello3", {rootdir = "/home/xxx/modules"})
```

为了防止命名冲突，导入后还可以指定的别名：

```lua
import("core.platform.platform", {alias = "p"})

function main()

    -- 这样我们就可以使用p来调用platform模块的plats接口，获取所有xmake支持的平台列表了
    utils.dump(p.plats())
end
```

import不仅可以导入类库，还支持导入的同时作为继承导入，实现模块间的继承关系

```lua
import("xxx.xxx", {inherit = true})
```

这样导入的不是这个模块的引用，而是导入的这个模块的所有公有接口本身，这样就会跟当前模块的接口进行合并，实现模块间的继承。

2.1.5版本新增两个新属性：`import("xxx.xxx", {try = true, anonymous = true})`

try为true，则导入的模块不存在的话，仅仅返回nil，并不会抛异常后中断xmake.
anonymous为true，则导入的模块不会引入当前作用域，仅仅在import接口返回导入的对象引用。

#### 自定义扩展模块

通过 import 我们除了可以导入 xmake 内置的很多扩展模块，还可以导入用户自己定义的扩展模块。

只需要将自己的模块放到工程目录下，按照上文介绍的导入方式进行导入即可。

那么，如果去定义模块呢？xmake 对模块的编写规范是有一套约定规则的，并没有沿用 lua 原生的 require 导入机制，并不需要在模块中使用 return 来全局返回它。

假如我们有一个模块文件 foo.lua，它的内容如下：

```lua
function _foo(a, b)
    return a + b
end

function add(a, b)
    _foo(a, b)
end

function main(a, b)
    add(a, b)
end
```

其中 main 为入口函数，可选，如果设置，模块 foo 可以直接被调用，例如：

```lua
import("foo")
foo(1, 2)
```

或者直接这样：

```lua
import("foo")(1, 2)
```


其他不带下划线的为 public 模块接口函数，例如 add。

```lua
import("foo")
foo.add(1, 2)
```

而里面带下划线前缀的 `_foo` 是私有函数，模块内部使用，不对外导出，所以在外面用户是不能够调用它的。

### inherit

#### 导入并继承基类模块

这个等价于[import](#import)接口的`inherit`模式，也就是：

```lua
import("xxx.xxx", {inherit = true})
```

用`inherit`接口的话，会更简洁些：

```lu
inherit("xxx.xxx")
```

使用实例，可以参看xmake的tools目录下的脚本：[clang.lua](#https://github.com/xmake-io/xmake/blob/master/xmake/tools/clang.lua)

这个就是clang工具模块继承了gcc的部分实现。

### try-catch-finally

#### 异常捕获

lua原生并没有提供try-catch的语法来捕获异常处理，但是提供了`pcall/xpcall`等接口，可在保护模式下执行lua函数。

因此，可以通过封装这两个接口，来实现try-catch块的捕获机制。

我们可以先来看下，封装后的try-catch使用方式：

```lua
try
{
    -- try 代码块
    function ()
        error("error message")
    end,

    -- catch 代码块
    catch
    {
        -- 发生异常后，被执行
        function (errors)
            print(errors)
        end
    }
}
```

上面的代码中，在try块内部认为引发了一个异常，并且抛出错误消息，在catch中进行了捕获，并且将错误消息进行输出显示。

而finally的处理，这个的作用是对于`try{}`代码块，不管是否执行成功，都会执行到finally块中

也就说，其实上面的实现，完整的支持语法是：`try-catch-finally`模式，其中catch和finally都是可选的，根据自己的实际需求提供

例如：

```lua
try
{
    -- try 代码块
    function ()
        error("error message")
    end,

    -- catch 代码块
    catch
    {
        -- 发生异常后，被执行
        function (errors)
            print(errors)
        end
    },

    -- finally 代码块
    finally
    {
        -- 最后都会执行到这里
        function (ok, errors)
            -- 如果try{}中存在异常，ok为true，errors为错误信息，否则为false，errors为try中的返回值
        end
    }
}

```

或者只有finally块：

```lua
try
{
    -- try 代码块
    function ()
        return "info"
    end,

    -- finally 代码块
    finally
    {
        -- 由于此try代码没发生异常，因此ok为true，errors为返回值: "info"
        function (ok, errors)
        end
    }
}
```

处理可以在finally中获取try里面的正常返回值，其实在仅有try的情况下，也是可以获取返回值的：

```lua
-- 如果没发生异常，result 为返回值："xxxx"，否则为nil
local result = try
{
    function ()
        return "xxxx"
    end
}
```

在xmake的自定义脚本、插件开发中，也是完全基于此异常捕获机制

这样使得扩展脚本的开发非常的精简可读，省去了繁琐的`if err ~= nil then`返回值判断，在发生错误时，xmake会直接抛出异常进行中断，然后高亮提示详细的错误信息。

例如：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")

    -- 在编译完ios程序后，对目标程序进行ldid签名
    after_build(function (target))
        os.run("ldid -S %s", target:targetfile())
    end
```

只需要一行`os.run`就行了，也不需要返回值判断是否运行成功，因为运行失败后，xmake会自动抛异常，中断程序并且提示错误

如果你想在运行失败后，不直接中断xmake，继续往下运行，可以自己加个try快就行了：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")

    after_build(function (target))
        try
        {
            function ()
                os.run("ldid -S %s", target:targetfile())
            end
        }
    end
```

如果还想捕获出错信息，可以再加个catch:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")

    after_build(function (target))
        try
        {
            function ()
                os.run("ldid -S %s", target:targetfile())
            end,
            catch
            {
                function (errors)
                    print(errors)
                end
            }
        }
    end
```

不过一般情况下，在xmake中写自定义脚本，是不需要手动加try-catch的，直接调用各种api，出错后让xmake默认的处理程序接管，直接中断就行了。。

### pairs

#### 用于遍历字典

这个是lua原生的内置api，在xmake中，在原有的行为上对其进行了一些扩展，来简化一些日常的lua遍历代码。

先看下默认的原生写法：

```lua
local t = {a = "a", b = "b", c = "c", d = "d", e = "e", f = "f"}

for key, val in pairs(t) do
    print("%s: %s", key, val)
end
```

这对于通常的遍历操作就足够了，但是如果我们相对其中每个遍历出来的元素，获取其大写，我们可以这么写：

```lua
for key, val in pairs(t, function (v) return v:upper() end) do
     print("%s: %s", key, val)
end
```

甚至传入一些参数到第二个`function`中，例如：

```lua
for key, val in pairs(t, function (v, a, b) return v:upper() .. a .. b end, "a", "b") do
     print("%s: %s", key, val)
end
```

### ipairs

#### 用于遍历数组

这个是lua原生的内置api，在xmake中，在原有的行为上对其进行了一些扩展，来简化一些日常的lua遍历代码。

先看下默认的原生写法：

```lua
for idx, val in ipairs({"a", "b", "c", "d", "e", "f"}) do
     print("%d %s", idx, val)
end
```

扩展写法类似[pairs](#pairs)接口，例如：

```lua
for idx, val in ipairs({"a", "b", "c", "d", "e", "f"}, function (v) return v:upper() end) do
     print("%d %s", idx, val)
end

for idx, val in ipairs({"a", "b", "c", "d", "e", "f"}, function (v, a, b) return v:upper() .. a .. b end, "a", "b") do
     print("%d %s", idx, val)
end
```

这样可以简化`for`块代码的逻辑，例如我要遍历指定目录，获取其中的文件名，但不包括路径，就可以通过这种扩展方式，简化写法：

```lua
for _, filename in ipairs(os.dirs("*"), path.filename) do
    -- ...
end
```

### print

#### 换行打印终端日志

此接口也是lua的原生接口，xmake在原有行为不变的基础上也进行了扩展，同时支持：格式化输出、多变量输出。

先看下原生支持的方式：

```lua
print("hello xmake!")
print("hello", "xmake!", 123)
```

并且同时还支持扩展的格式化写法：

```lua
print("hello %s!", "xmake")
print("hello xmake! %d", 123)
```

xmake会同时支持这两种写法，内部会去自动智能检测，选择输出行为。

### printf

#### 无换行打印终端日志

类似[print](#print)接口，唯一的区别就是不换行。

### cprint

#### 换行彩色打印终端日志

行为类似[print](#print)，区别就是此接口还支持彩色终端输出，并且支持`emoji`字符输出。

例如：

```lua
    cprint('${bright}hello xmake')
    cprint('${red}hello xmake')
    cprint('${bright green}hello ${clear}xmake')
    cprint('${blue onyellow underline}hello xmake${clear}')
    cprint('${red}hello ${magenta}xmake')
    cprint('${cyan}hello ${dim yellow}xmake')
```

显示结果如下：

![cprint_colors](https://tboox.org/static/img/xmake/cprint_colors.png)

跟颜色相关的描述，都放置在 `${  }` 里面，可以同时设置多个不同的属性，例如：

```
    ${bright red underline onyellow}
```

表示：高亮红色，背景黄色，并且带下滑线

所有这些描述，都会影响后面一整行字符，如果只想显示部分颜色的文字，可以在结束位置，插入`${clear}`清楚前面颜色描述

例如：

```
    ${red}hello ${clear}xmake
```

这样的话，仅仅hello是显示红色，其他还是正常默认黑色显示。

其他颜色属于，我这里就不一一介绍，直接贴上xmake代码里面的属性列表吧：

```lua
    colors.keys =
    {
        -- 属性
        reset       = 0 -- 重置属性
    ,   clear       = 0 -- 清楚属性
    ,   default     = 0 -- 默认属性
    ,   bright      = 1 -- 高亮
    ,   dim         = 2 -- 暗色
    ,   underline   = 4 -- 下划线
    ,   blink       = 5 -- 闪烁
    ,   reverse     = 7 -- 反转颜色
    ,   hidden      = 8 -- 隐藏文字

        -- 前景色
    ,   black       = 30
    ,   red         = 31
    ,   green       = 32
    ,   yellow      = 33
    ,   blue        = 34
    ,   magenta     = 35
    ,   cyan        = 36
    ,   white       = 37

        -- 背景色
    ,   onblack     = 40
    ,   onred       = 41
    ,   ongreen     = 42
    ,   onyellow    = 43
    ,   onblue      = 44
    ,   onmagenta   = 45
    ,   oncyan      = 46
    ,   onwhite     = 47
```

除了可以色彩高亮显示外，如果你的终端是在macosx下，lion以上的系统，xmake还可以支持emoji表情的显示哦，对于不支持系统，会
忽略显示，例如：

```lua
    cprint("hello xmake${beer}")
    cprint("hello${ok_hand} xmake")
```

上面两行代码，我打印了一个homebrew里面经典的啤酒符号，下面那行打印了一个ok的手势符号，是不是很炫哈。。

![cprint_emoji](https://tboox.org/static/img/xmake/cprint_emoji.png)

所有的emoji表情，以及xmake里面对应的key，都可以通过[emoji符号](http://www.emoji-cheat-sheet.com/)里面找到。。

2.1.7版本支持24位真彩色输出，如果终端支持的话：

```lua
import("core.base.colors")
if colors.truecolor() then
    cprint("${255;0;0}hello")
    cprint("${on;255;0;0}hello${clear} xmake")
    cprint("${bright 255;0;0 underline}hello")
    cprint("${bright on;255;0;0 0;255;0}hello${clear} xmake")
end
```

xmake对于truecolor的检测支持，是通过`$COLORTERM`环境变量来实现的，如果你的终端支持truecolor，可以手动设置此环境变量，来告诉xmake启用truecolor支持。

可以通过下面的命令来启用和测试：

```bash
$ export COLORTERM=truecolor
$ xmake --version
```

2.1.7版本可通过`COLORTERM=nocolor`来禁用色彩输出。

### cprintf

#### 无换行彩色打印终端日志

此接口类似[cprint](#cprint)，区别就是不换行输出。

### format

#### 格式化字符串

如果只是想格式化字符串，不进行输出，可以使用这个接口，此接口跟[string.format](#stringformat)接口等价，只是个接口名简化版。

```lua
local s = format("hello %s", xmake)
```

### vformat

#### 格式化字符串，支持内置变量转义

此接口跟[format](#format)接口类似，只是增加对内置变量的获取和转义支持。

```lua
local s = vformat("hello %s $(mode) $(arch) $(env PATH)", xmake)
```

### raise

#### 抛出异常中断程序

如果想在自定义脚本、插件任务中中断xmake运行，可以使用这个接口抛出异常，如果上层没有显示调用[try-catch](#try-catch-finally)捕获的话，xmake就会中断执行，并且显示出错信息。

```lua
if (errors) raise(errors)
```

如果在try块中抛出异常，就会在catch和finally中进行errors信息捕获，具体见：[try-catch](#try-catch-finally)

### os

系统操作模块，属于内置模块，无需使用[import](#import)导入，可直接脚本域调用其接口。

此模块也是lua的原生模块，xmake在其基础上进行了扩展，提供更多实用的接口。

!> os模块里面只有部分readonly接口（例如：`os.getenv`, `os.arch`）是可以在描述域中使用，其他接口只能在脚本域中使用，例如：`os.cp`, `os.rm`等

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [os.cp](#oscp)                                 | 复制文件或目录                               | >= 2.0.1 |
| [os.mv](#osmv)                                 | 移动重命名文件或目录                         | >= 2.0.1 |
| [os.rm](#osrm)                                 | 删除文件或目录树                             | >= 2.0.1 |
| [os.trycp](#ostrycp)                           | 尝试复制文件或目录                           | >= 2.1.6 |
| [os.trymv](#ostrymv)                           | 尝试移动重命名文件或目录                     | >= 2.1.6 |
| [os.tryrm](#ostryrm)                           | 尝试删除文件或目录树                         | >= 2.1.6 |
| [os.cd](#oscd)                                 | 进入指定目录                                 | >= 2.0.1 |
| [os.rmdir](#osrmdir)                           | 删除目录树                                   | >= 2.0.1 |
| [os.mkdir](#osmkdir)                           | 创建指定目录                                 | >= 2.0.1 |
| [os.isdir](#osisdir)                           | 判断目录是否存在                             | >= 2.0.1 |
| [os.isfile](#osisfile)                         | 判断文件是否存在                             | >= 2.0.1 |
| [os.exists](#osexists)                         | 判断文件或目录是否存在                       | >= 2.0.1 |
| [os.dirs](#osdirs)                             | 遍历获取指定目录下的所有目录                 | >= 2.0.1 |
| [os.files](#osfiles)                           | 遍历获取指定目录下的所有文件                 | >= 2.0.1 |
| [os.filedirs](#osfiledirs)                     | 遍历获取指定目录下的所有文件或目录           | >= 2.0.1 |
| [os.run](#osrun)                               | 安静运行程序                                 | >= 2.0.1 |
| [os.runv](#osrunv)                             | 安静运行程序，带参数列表                     | >= 2.1.5 |
| [os.exec](#osexec)                             | 回显运行程序                                 | >= 2.0.1 |
| [os.execv](#osexecv)                           | 回显运行程序，带参数列表                     | >= 2.1.5 |
| [os.iorun](#osiorun)                           | 运行并获取程序输出内容                       | >= 2.0.1 |
| [os.iorunv](#osiorunv)                         | 运行并获取程序输出内容，带参数列表           | >= 2.1.5 |
| [os.getenv](#osgetenv)                         | 获取环境变量                                 | >= 2.0.1 |
| [os.setenv](#ossetenv)                         | 设置环境变量                                 | >= 2.0.1 |
| [os.tmpdir](#ostmpdir)                         | 获取临时目录路径                             | >= 2.0.1 |
| [os.tmpfile](#ostmpfile)                       | 获取临时文件路径                             | >= 2.0.1 |
| [os.curdir](#oscurdir)                         | 获取当前目录路径                             | >= 2.0.1 |
| [os.filesize](#osfilesize)                     | 获取文件大小                                 | >= 2.1.9 |
| [os.scriptdir](#osscriptdir)                   | 获取脚本目录路径                             | >= 2.0.1 |
| [os.programdir](#osprogramdir)                 | 获取xmake安装主程序脚本目录                  | >= 2.1.5 |
| [os.programfile](#osprogramfile)               | 获取xmake可执行文件路径                      | >= 2.1.5 |
| [os.projectdir](#osprojectdir)                 | 获取工程主目录                               | >= 2.1.5 |
| [os.arch](#osarch)                             | 获取当前系统架构                             | >= 2.0.1 |
| [os.host](#oshost)                             | 获取当前主机系统                             | >= 2.0.1 |
| [os.subhost](#ossubhost) | 获取子系统 | >= 2.3.1 |
| [os.subarch](#ossubarch) | 获取子系统架构 | >= 2.3.1 |
| [os.is_host](#osis_host) | 判断给定系统是否正确 | >= 2.3.1 |
| [os.is_arch](#osis_arch) | 判断给定架构是否正确 | >= 2.3.1 |
| [os.is_subhost](#osis_subhost) | 判断给定子系统是否正确 | >= 2.3.1 |
| [os.is_subarch](#osis_subarch) | 判断子系统架构是否正确 | >= 2.3.1 |
| [os.ln](#osln) | 创建指向文件或文件夹的符号链接 | >= 2.2.2 |
| [os.readlink](#osreadlink) | 读取符号链接 | >= 2.2.2 |
| [os.raise](#osraise) | 抛出一个异常并中止脚本运行 | >= 2.2.8 |
| [os.raiselevel](#osraiselevel) | 抛出一个异常并中止脚本运行 | >= 2.2.8 |
| [os.features](#osfeatures) | 获取系统特性 | >= 2.3.1 |
| [os.getenvs](#osgetenvs) | 获取所有环境变量 | >= 2.2.6 |
| [os.setenvs](#ossetenvs) | 替换当前所有环境变量 | >= 2.2.6 |
| [os.addenvs](#osaddenvs) | 向当前环境变量中添加新值 | >= 2.5.6 |
| [os.joinenvs](#osjoinenvs) | 拼接环境变量 | >= 2.5.6 |
| [os.setenvp](#ossetenvp) | 使用给定分隔符设置环境变量 | >= 2.1.5 |
| [os.addenvp](#osaddenvp) | 使用给定分隔符向环境变量添加新值 | >= 2.1.5 |
| [os.workingdir](#osworkingdir) | 获取工作路径 | >= 2.1.9 |
| [os.isroot](#osisroot) | 判断当前xmake是否以管理员权限运行 | >= 2.1.9 |
| [os.fscase](#osfscase) | 判断当前系统的文件系统是否大小写敏感 | >= 2.1.9 |
| [os.term](#osterm) | 获取当前终端 | >= 2.7.3 |
| [os.shell](#osshell) | 获取当前shell | >= 2.7.3 |
| [os.cpuinfo](#oscpuinfo) | 获取CPU信息 | >= 2.1.5 |
| [os.meminfo](#osmeminfo) | 获取内存信息 | >= 2.1.5 |

#### os.cp

- 复制文件或目录

行为和shell中的`cp`命令类似，支持路径通配符匹配（使用的是lua模式匹配），支持多文件复制，以及内置变量支持。

例如：

```lua
os.cp("$(scriptdir)/*.h", "$(buildir)/inc")
os.cp("$(projectdir)/src/test/**.h", "$(buildir)/inc")
```

上面的代码将：当前`xmake.lua`目录下的所有头文件、工程源码test目录下的头文件全部复制到`$(buildir)`输出目录中。

其中`$(scriptdir)`, `$(projectdir)` 这些变量是xmake的内置变量，具体详情见：[内置变量](#内置变量)的相关文档。

而`*.h`和`**.h`中的匹配模式，跟[add_files](#targetadd_files)中的类似，前者是单级目录匹配，后者是递归多级目录匹配。

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

!> 尽量使用`os.cp`接口，而不是`os.run("cp ..")`，这样更能保证平台一致性，实现跨平台构建描述。

2.5.7 下，新增 `{symlink = true}` 参数，在复制文件时候保留符号链接。

```lua
os.cp("/xxx/foo", "/xxx/bar", {symlink = true})
```

#### os.mv

- 移动重命名文件或目录

跟[os.cp](#oscp)的使用类似，同样支持多文件移动操作和模式匹配，例如：

```lua
-- 移动文件到临时目录
os.mv("$(buildir)/test1", "$(tmpdir)")

-- 文件移动不支持批量操作，也就是文件重命名
os.mv("$(buildir)/libtest.a", "$(buildir)/libdemo.a")
```

#### os.rm

- 删除文件或目录树

支持递归删除目录，批量删除操作，以及模式匹配和内置变量，例如：

```lua
os.rm("$(buildir)/inc/**.h")
os.rm("$(buildir)/lib/")
```

#### os.trycp

- 尝试复制文件或目录

跟[os.cp](#oscp)类似，唯一的区别就是，此接口操作失败不会抛出异常中断xmake，而是通过返回值标示是否执行成功。

```lua
if os.trycp("file", "dest/file") then
end
```

#### os.trymv

- 尝试移动文件或目录

跟[os.mv](#osmv)类似，唯一的区别就是，此接口操作失败不会抛出异常中断xmake，而是通过返回值标示是否执行成功。

```lua
if os.trymv("file", "dest/file") then
end
```

#### os.tryrm

- 尝试删除文件或目录

跟[os.rm](#osrm)类似，唯一的区别就是，此接口操作失败不会抛出异常中断xmake，而是通过返回值标示是否执行成功。

```lua
if os.tryrm("file") then
end
```

#### os.cd

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

#### os.rmdir

- 仅删除目录

如果不是目录就无法删除。

#### os.mkdir

- 创建目录

支持批量创建和内置变量，例如：

```lua
os.mkdir("$(tmpdir)/test", "$(buildir)/inc")
```

#### os.isdir

- 判断是否为目录

如果目录不存在，则返回false

```lua
if os.isdir("src") then
    -- ...
end
```

#### os.isfile

- 判断是否为文件

如果文件不存在，则返回false

```lua
if os.isfile("$(buildir)/libxxx.a") then
    -- ...
end
```

#### os.exists

- 判断文件或目录是否存在

如果文件或目录不存在，则返回false

```lua
-- 判断目录存在
if os.exists("$(buildir)") then
    -- ...
end

-- 判断文件存在
if os.exists("$(buildir)/libxxx.a") then
    -- ...
end
```

#### os.dirs

- 遍历获取指定目录下的所有目录

支持[add_files](#targetadd_files)中的模式匹配，支持递归和非递归模式遍历，返回的结果是一个table数组，如果获取不到，返回空数组，例如：

```lua
-- 递归遍历获取所有子目录
for _, dir in ipairs(os.dirs("$(buildir)/inc/**")) do
    print(dir)
end
```

#### os.files

- 遍历获取指定目录下的所有文件

支持[add_files](#targetadd_files)中的模式匹配，支持递归和非递归模式遍历，返回的结果是一个table数组，如果获取不到，返回空数组，例如：

```lua
-- 非递归遍历获取所有子文件
for _, filepath in ipairs(os.files("$(buildir)/inc/*.h")) do
    print(filepath)
end
```

#### os.filedirs

- 遍历获取指定目录下的所有文件和目录

支持[add_files](#targetadd_files)中的模式匹配，支持递归和非递归模式遍历，返回的结果是一个table数组，如果获取不到，返回空数组，例如：

```lua
-- 递归遍历获取所有子文件和目录
for _, filedir in ipairs(os.filedirs("$(buildir)/**")) do
    print(filedir)
end
```

#### os.run

- 安静运行原生shell命令

用于执行第三方的shell命令，但不会回显输出，仅仅在出错后，高亮输出错误信息。

此接口支持参数格式化、内置变量，例如：

```lua
-- 格式化参数传入
os.run("echo hello %s!", "xmake")

-- 列举构建目录文件
os.run("ls -l $(buildir)")
```

!> 使用此接口执行shell命令，容易使构建跨平台性降低，对于`os.run("cp ..")`这种尽量使用`os.cp`代替。<br>
如果必须使用此接口运行shell程序，请自行使用[config.plat](#config-plat)接口判断平台支持。

#### os.runv

- 安静运行原生shell命令，带参数列表

跟[os.run](#osrun)类似，只是传递参数的方式是通过参数列表传递，而不是字符串命令，例如：

```lua
os.runv("echo", {"hello", "xmake!"})
```

另外，此接口也支持envs参数设置：

```lua
os.runv("echo", {"hello", "xmake!"}, {envs = {PATH = "xxx;xx", CFLAGS = "xx"}})
```

#### os.exec

- 回显运行原生shell命令

与[os.run](#osrun)接口类似，唯一的不同是，此接口执行shell程序时，是带回显输出的，一般调试的时候用的比较多

#### os.execv

- 回显运行原生shell命令，带参数列表

跟[os.exec](#osexec)类似，只是传递参数的方式是通过参数列表传递，而不是字符串命令，例如：

```lua
os.execv("echo", {"hello", "xmake!"})
```

另外，此接口还支持一个可选的参数，用于传递设置：重定向输出，执行环境变量设置，例如：

```lua
os.execv("echo", {"hello", "xmake!"}, {stdout = outfile, stderr = errfile, envs = {PATH = "xxx;xx", CFLAGS = "xx"}}
```

其中，stdout和stderr参数用于传递重定向输出和错误输出，可以直接传入文件路径，也可以传入io.open打开的文件对象。

v2.5.1 之后的版本，我们还支持设置 stdin 参数，来支持重定向输入文件。

!> stdout/stderr/stdin 可以同时支持：文件路径、文件对象、管道对象等三种类型值。

另外，如果想在这次执行中临时设置和改写一些环境变量，可以传递envs参数，里面的环境变量设置会替换已有的设置，但是不影响外层的执行环境，只影响当前命令。

我们也可以通过`os.getenvs()`接口获取当前所有的环境变量，然后改写部分后传入envs参数。

#### os.iorun

- 安静运行原生shell命令并获取输出内容

与[os.run](#osrun)接口类似，唯一的不同是，此接口执行shell程序后，会获取shell程序的执行结果，相当于重定向输出。

可同时获取`stdout`, `stderr`中的内容，例如：

```lua
local outdata, errdata = os.iorun("echo hello xmake!")
```

#### os.iorunv

- 安静运行原生shell命令并获取输出内容，带参数列表

跟[os.iorun](#osiorun)类似，只是传递参数的方式是通过参数列表传递，而不是字符串命令，例如：

```lua
local outdata, errdata = os.iorunv("echo", {"hello", "xmake!"})
```

另外，此接口也支持envs参数设置：

```lua
local outdata, errdata = os.iorunv("echo", {"hello", "xmake!"}, {envs = {PATH = "xxx;xx", CFLAGS = "xx"}}
```

#### os.getenv

- 获取系统环境变量

```lua
print(os.getenv("PATH"))
```

#### os.setenv

- 设置系统环境变量

```lua
os.setenv("HOME", "/tmp/")
```

#### os.tmpdir

- 获取临时目录

跟[$(tmpdir)](#var-tmpdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

```lua
print(path.join(os.tmpdir(), "file.txt"))
```

等价于：

```lua
print("$(tmpdir)/file.txt")
```

#### os.tmpfile

- 获取临时文件路径

用于获取生成一个临时文件路径，仅仅是个路径，文件需要自己创建。

#### os.curdir

- 获取当前目录路径

跟[$(curdir)](#var-curdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

用法参考：[os.tmpdir](#ostmpdir)。

#### os.filesize

- 获取文件大小

```lua
print(os.filesize("/tmp/a"))
```

#### os.scriptdir

- 获取当前描述脚本的路径

跟[$(scriptdir)](#var-scriptdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

用法参考：[os.tmpdir](#ostmpdir)。

#### os.programdir

- 获取xmake安装主程序脚本目录

跟[$(programdir)](#var-programdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

#### os.programfile

- 获取xmake可执行文件路径

#### os.projectdir

- 获取工程主目录

跟[$(projectdir)](#var-projectdir)结果一致，只不过是直接获取返回一个变量，可以用后续字符串维护。

#### os.arch

- 获取当前系统架构

也就是当前主机系统的默认架构，例如我在`linux x86_64`上执行xmake进行构建，那么返回值是：`x86_64`

#### os.host

- 获取当前主机的操作系统

跟[$(host)](#var-host)结果一致，例如我在`linux x86_64`上执行xmake进行构建，那么返回值是：`linux`

#### os.subhost

- 获取当前子系统，如：在Windows上的msys、cygwin

#### os.subarch

- 获取子系统架构

#### os.is_host

- 判断给定系统是否为当前系统

#### os.is_arch

- 判断给定架构是否为当前架构

#### os.is_subhost

- 判断给定子系统是否为当前子系统

#### os.is_subarch

- 判断给定子系统架构是否为当前子系统架构

#### os.ln

- 为一个文件或目录创建符号链接

```lua
-- 创建一个指向 "tmp.txt" 文件的符号链接 "tmp.txt.ln"
os.ln("xxx.txt", "xxx.txt.ln")
```

#### os.readlink

- 读取符号链接内容

#### os.raise

- 抛出一个异常并且中止当前脚本运行

```lua
-- 抛出一个带 "an error occurred" 信息的异常
os.raise("an error occurred")
```

#### os.raiselevel

- 与 [os.raise](#osraise) 类似但是可以指定异常等级

```lua
-- 抛出一个带 "an error occurred" 信息的异常
os.raise(3, "an error occurred")
```

#### os.features

- 获取系统特性

#### os.getenvs

- 获取所有当前系统变量

```lua
local envs = os.getenvs()
-- home directory (on linux)
print(envs["HOME"])
```

#### os.setenvs

- 使用给定系统变量替换当前所有系统变量，并返回旧系统变量

#### os.addenvs

- 向当前系统变量添加新变量，并且返回所有旧系统变量

```lua
os.setenvs({EXAMPLE = "a/path"}) -- add a custom variable to see addenvs impact on it

local oldenvs = os.addenvs({EXAMPLE = "some/path/"})
print(os.getenvs()["EXAMPLE"]) --got some/path/;a/path
print(oldenvs["EXAMPLE"]) -- got a/path
```

#### os.joinenvs

- 拼接系统变量，与 [os.addenvs](#osaddenvs) 类似，但是不会对当前环境变量产生影响，若第二个参数为 `nil`，则使用原有环境变量

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

#### os.setenvp

- 使用给定分隔符设置环境变量

#### os.workingdir

- 获取工作目录

% #### os.match
%
%- 使用模式串匹配文件或目录
%
%```lua
%-- @param pattern   匹配模式串
%--                  使用 "*" 匹配文件名或目录名的任意部分
%--                  使用 "**" 递归搜索子目录
%--
%-- @param mode      匹配模式
%--                  - 仅匹配文件        'f' 或 false 或 nil
%--                  - 仅匹配目录        'd' 或 true
%--                  - 匹配目录和文件    'a'
%-- @return          结果列表和数量
%
%local files, count = os.match("./about/*", false)
%print(files)
%-- In xmake-docs repo
%-- got { 
%--   "about\awesome.md",
%--   "about\changelog.md",
%--   "about\contact.md",
%--   "about\introduction.md",
%--   "about\sponsor.md",
%--   "about\technical_support.md",
%--   "about\who_is_using_xmake.md"
%-- }
%
%local dirs, count = os.match("./assets/*", true)
%print(dirs)
%-- In xmake-docs repo
%-- got {
%--   "assets\img",
%--   "assets\npm",
%--   "assets\scripts"
%-- }
%```

#### os.isroot

- 判断xmake是否以管理员权限运行

#### os.fscase

- 判断操作系统的文件系统是否大小写敏感

#### os.term

- 获取当前终端 (windows-terminal, vscode, xterm, ...)

#### os.shell

- 获取当前shell (pwsh, cmd, bash, zsh, ...)

#### os.cpuinfo

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

#### os.meminfo

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

### winos

windows 系统操作模块，属于内置模块，无需使用[import](#import)导入，可直接脚本域调用其接口。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [winos.version](#winosversion)                  | 获取 windows 系统版本                        | >= 2.3.1 |
| [winos.registry_keys](#winosregistry_keys)      | 获取注册表建列表                             | >= 2.5.1 |
| [winos.registry_values](#winosregistry_values)  | 获取注册表值名列表                           | >= 2.5.1 |
| [winos.registry_query](#winosregistry_query)    | 获取注册表建值                               | >= 2.3.1 |

#### winos.version

- 获取 windows 系统版本

返回的版本是 semver 语义版本对象

```lua
if winos.version():ge("win7") then
    -- ...
end

if winos.version():ge("6.1") then
    -- ...
end
```

并且，还可以支持对 windows 版本名的直接判断，映射规则如下：

```

nt4      = "4.0"
win2k    = "5.0"
winxp    = "5.1"
ws03     = "5.2"
win6     = "6.0"
vista    = "6.0"
ws08     = "6.0"
longhorn = "6.0"
win7     = "6.1"
win8     = "6.2"
winblue  = "6.3"
win81    = "6.3"
win10    = "10.0"
```

#### winos.registry_keys

- 获取注册表建列表

支持通过模式匹配的方式，遍历获取注册表键路径列表，`*` 为单级路径匹配，`**` 为递归路径匹配。

```lua
local keypaths = winos.registry_keys("HKEY_LOCAL_MACHINE\\SOFTWARE\\*\\Windows NT\\*\\CurrentVersion\\AeDebug")
for _, keypath in ipairs(keypaths) do
    print(winos.registry_query(keypath .. ";Debugger"))
end
```

#### winos.registry_values

- 获取注册表值名列表

支持通过模式匹配的方式，获取指定键路径的值名列表，`;` 之后的就是指定的键名模式匹配字符串。

```lua
local valuepaths = winos.registry_values("HKEY_LOCAL_MACHINE\\SOFTWARE\\xx\\AeDebug;Debug*")
for _, valuepath in ipairs(valuepaths) do
    print(winos.registry_query(valuepath))
end
```

#### winos.registry_query

- 获取注册表建值

获取指定注册表建路径下的值，如果没有指定值名，那么获取键路径默认值

```lua
local value, errors = winos.registry_query("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug")
local value, errors = winos.registry_query("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug;Debugger")
```

### macos

macOS 系统操作模块，属于内置模块，无需使用[import](#import)导入，可直接脚本域调用其接口。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [macos.version](#macosversion)                  | 获取 macOS 系统版本                          | >= 2.3.1 |

#### macos.version

- 获取 macOS 系统版本

返回的版本是 semver 语义版本对象

```lua
if macos.version():ge("10.0") then
    -- ...
end
```

### linuxos

linux 系统操作模块，属于内置模块，无需使用[import](#import)导入，可直接脚本域调用其接口。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [linuxos.name](#linuxosname)                    | 获取 linux 系统发行版名称                    | >= 2.5.2 |
| [linuxos.version](#linuxosversion)              | 获取 linux 系统版本                          | >= 2.5.2 |
| [linuxos.kernelver](#linuxoskernelver)          | 获取 linux 系统内核版本                      | >= 2.5.2 |

#### linuxos.name

- 获取 linux 系统发行版名称

我们也可以通过下面的命令，快速获取查看

```bash
xmake l linuxos.name
```

目前支持的一些名称有：

- ubuntu
- debian
- archlinux
- manjaro
- linuxmint
- centos
- fedora
- opensuse

#### linuxos.version

- 获取 linux 系统版本

返回的版本是 semver 语义版本对象

```lua
if linux.version():ge("10.0") then
    -- ...
end
```

#### linuxos.kernelver

- 获取 linux 系统内核版本

返回的也是语义版本对象，也可以执行 `xmake l linuxos.kernelver` 快速查看

### io

io操作模块，扩展了lua内置的io模块，提供更多易用的接口。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [io.open](#ioopen)                              | 打开文件用于读写                             | >= 2.0.1 |
| [io.load](#ioload)                              | 从指定路径文件反序列化加载所有table内容      | >= 2.0.1 |
| [io.save](#iosave)                              | 序列化保存所有table内容到指定路径文件        | >= 2.0.1 |
| [io.readfile](#io.readfile)                     | 从指定路径文件读取所有内容                   | >= 2.1.3 |
| [io.writefile](#io.writefile)                   | 写入所有内容到指定路径文件                   | >= 2.1.3 |
| [io.gsub](#iogsub)                              | 全文替换指定路径文件的内容                   | >= 2.0.1 |
| [io.tail](#iotail)                              | 读取和显示文件的尾部内容                     | >= 2.0.1 |
| [io.cat](#iocat)                                | 读取和显示文件的所有内容                     | >= 2.0.1 |
| [io.print](#ioprint)                            | 带换行格式化输出内容到文件                   | >= 2.0.1 |
| [io.printf](#ioprintf)                          | 无换行格式化输出内容到文件                   | >= 2.0.1 |
| [io.lines](#iolines)                            | 读取文件的所有行                            | >= 2.2.9 |
| [io.stdfile](#iostdfile)                        | 获取标准输入输出文件                        | >= 2.2.9 |
| [io.openlock](#ioopenlock)                      | 创建一把文件锁                             | >= 2.2.9 |
| [io.replace](#ioreplace)                        | 根据表达式替换文件内容                      | >= 2.3.8 |

#### io.open

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

或者可以使用[io.readfile](#io.readfile)更加快速地读取。

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

#### io.load

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

#### io.save

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

#### io.readfile

- 从指定路径文件读取所有内容

可在不打开文件的情况下，直接读取整个文件的内容，更加的方便，例如：

```lua
local data = io.readfile("xxx.txt")
```

#### io.writefile

- 写入所有内容到指定路径文件

可在不打开文件的情况下，直接写入整个文件的内容，更加的方便，例如：

```lua
io.writefile("xxx.txt", "all data")
```

#### io.gsub

- 全文替换指定路径文件的内容

类似[string.gsub](#stringgsub)接口，全文模式匹配替换内容，不过这里是直接操作文件，例如：

```lua
-- 移除文件所有的空白字符
io.gsub("xxx.txt", "%s+", "")
```

#### io.tail

- 读取和显示文件的尾部内容

读取文件尾部指定行数的数据，并显示，类似`cat xxx.txt | tail -n 10`命令，例如：

```lua
-- 显示文件最后10行内容
io.tail("xxx.txt", 10)
```

#### io.cat

- 读取和显示文件的所有内容

读取文件的所有内容并显示，类似`cat xxx.txt`命令，例如：

```lua
io.cat("xxx.txt")
```

#### io.print

- 带换行格式化输出内容到文件

直接格式化传参输出一行字符串到文件，并且带换行，例如：

```lua
io.print("xxx.txt", "hello %s!", "xmake")
```

#### io.printf

- 无换行格式化输出内容到文件

直接格式化传参输出一行字符串到文件，不带换行，例如：

```lua
io.printf("xxx.txt", "hello %s!\n", "xmake")
```

#### io.lines

- 读取文件的所有行

根据文件名返回该文件的所有行的内容

```lua
local lines = io.lines("xxx.txt")
for line in lines do
    print(line)
end
```

#### io.stdfile

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

#### io.openlock

- 创建一把文件锁

为给定的文件返回一个文件锁对象

```lua
local lock = io.openlock("xxx.txt")
lock:lock()
lock:unlock()
lock:close()
```

#### io.replace

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

### path

路径操作模块，实现跨平台的路径操作，这是xmake的一个自定义的模块。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [path.join](#pathjoin)                         | 拼接路径                                     | >= 2.0.1 |
| [path.translate](#pathtranslate)               | 转换路径到当前平台的路径风格                 | >= 2.0.1 |
| [path.basename](#pathbasename)                 | 获取路径最后不带后缀的文件名                 | >= 2.0.1 |
| [path.filename](#pathfilename)                 | 获取路径最后带后缀的文件名                   | >= 2.0.1 |
| [path.extension](#pathextension)               | 获取路径的后缀名                             | >= 2.0.1 |
| [path.directory](#pathdirectory)               | 获取路径的目录名                         | >= 2.0.1 |
| [path.relative](#pathrelative)                 | 转换成相对路径                               | >= 2.0.1 |
| [path.absolute](#pathabsolute)                 | 转换成绝对路径                               | >= 2.0.1 |
| [path.is_absolute](#pathis_absolute)           | 判断是否为绝对路径                           | >= 2.0.1 |
| [path.splitenv](#pathsplitenv)                 | 分割环境变量中的路径                         | >= 2.2.7 |

#### path.join

- 拼接路径

将多个路径项进行追加拼接，由于`windows/unix`风格的路径差异，使用api来追加路径更加跨平台，例如：

```lua
print(path.join("$(tmpdir)", "dir1", "dir2", "file.txt"))
```

上述拼接在unix上相当于：`$(tmpdir)/dir1/dir2/file.txt`，而在windows上相当于：`$(tmpdir)\\dir1\\dir2\\file.txt`

如果觉得这样很繁琐，不够清晰简洁，可以使用：[path.translate](path-translate)方式，格式化转换路径字符串到当前平台支持的格式。

#### path.translate

- 转换路径到当前平台的路径风格

格式化转化指定路径字符串到当前平台支持的路径风格，同时支持`windows/unix`格式的路径字符串参数传入，甚至混合传入，例如：

```lua
print(path.translate("$(tmpdir)/dir/file.txt"))
print(path.translate("$(tmpdir)\\dir\\file.txt"))
print(path.translate("$(tmpdir)\\dir/dir2//file.txt"))
```

上面这三种不同格式的路径字符串，经过`translate`规范化后，就会变成当前平台支持的格式，并且会去掉冗余的路径分隔符。

#### path.basename

- 获取路径最后不带后缀的文件名

```lua
print(path.basename("$(tmpdir)/dir/file.txt"))
```

显示结果为：`file`

#### path.filename

- 获取路径最后带后缀的文件名

```lua
print(path.filename("$(tmpdir)/dir/file.txt"))
```

显示结果为：`file.txt`

#### path.extension

- 获取路径的后缀名

```lua
print(path.extensione("$(tmpdir)/dir/file.txt"))
```

显示结果为：`.txt`

#### path.directory

- 获取路径的目录名

```lua
print(path.directory("$(tmpdir)/dir/file.txt"))
```

显示结果为：`$(tmpdir)/dir`

#### path.relative

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

#### path.absolute

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

#### path.is_absolute

- 判断是否为绝对路径

```lua
if path.is_absolute("/tmp/file.txt") then
    -- 如果是绝对路径
end
```

#### path.splitenv

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


### table

table属于lua原生提供的模块，对于原生接口使用可以参考：[lua官方文档](https://www.lua.org/manual/5.1/manual.html#5.5)

xmake中对其进行了扩展，增加了一些扩展接口：

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [table.join](#tablejoin)                       | 合并多个table并返回                          | >= 2.0.1 |
| [table.join2](#tablejoin2)                     | 合并多个table到第一个table                   | >= 2.0.1 |
| [table.unique](#tableunique)                   | 对table中的内容进行去重                      | >= 2.0.1 |
| [table.slice](#tableslice)                     | 获取table的切片                              | >= 2.0.1 |

#### table.join

- 合并多个table并返回

可以将多个table里面的元素进行合并后，返回到一个新的table中，例如：

```lua
local newtable = table.join({1, 2, 3}, {4, 5, 6}, {7, 8, 9})
```

结果为：`{1, 2, 3, 4, 5, 6, 7, 8, 9}`

并且它也支持字典的合并：

```lua
local newtable = table.join({a = "a", b = "b"}, {c = "c"}, {d = "d"})
```

结果为：`{a = "a", b = "b", c = "c", d = "d"}`

#### table.join2

- 合并多个table到第一个table

类似[table.join](#table.join)，唯一的区别是，合并的结果放置在第一个参数中，例如：

```lua
local t = {0, 9}
table.join2(t, {1, 2, 3})
```

结果为：`t = {0, 9, 1, 2, 3}`

#### table.unique

- 对table中的内容进行去重

去重table的元素，一般用于数组table，例如：

```lua
local newtable = table.unique({1, 1, 2, 3, 4, 4, 5})
```

结果为：`{1, 2, 3, 4, 5}`

#### table.slice

- 获取table的切片

用于提取数组table的部分元素，例如：

```lua
-- 提取第4个元素后面的所有元素，结果：{4, 5, 6, 7, 8, 9}
table.slice({1, 2, 3, 4, 5, 6, 7, 8, 9}, 4)

-- 提取第4-8个元素，结果：{4, 5, 6, 7, 8}
table.slice({1, 2, 3, 4, 5, 6, 7, 8, 9}, 4, 8)

-- 提取第4-8个元素，间隔步长为2，结果：{4, 6, 8}
table.slice({1, 2, 3, 4, 5, 6, 7, 8, 9}, 4, 8, 2)
```

#### table.contains

- 判断 table 中包含指定的值

```lua
if table.contains(t, 1, 2, 3) then
    -- ...
end
```

只要 table 中包含 1, 2, 3 里面任意一个值，则返回 true

#### table.orderkeys

- 获取有序的 key 列表

`table.keys(t)` 返回的 key 列表顺序是随机的，想要获取有序 key 列表，可以用这个接口。

### string

字符串模块为lua原生自带的模块，具体使用见：[lua官方手册](https://www.lua.org/manual/5.1/manual.html#5.4)

xmake中对其进行了扩展，增加了一些扩展接口：

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [string.startswith](#stringstartswith)         | 判断字符串开头是否匹配                       | >= 1.0.1 |
| [string.endswith](#stringendswith)             | 判断字符串结尾是否匹配                       | >= 1.0.1 |
| [string.split](#stringsplit)                   | 分割字符串                                   | >= 1.0.1 |
| [string.trim](#stringtrim)                     | 去掉字符串左右空白字符                       | >= 1.0.1 |
| [string.ltrim](#stringltrim)                   | 去掉字符串左边空白字符                       | >= 1.0.1 |
| [string.rtrim](#stringrtrim)                   | 去掉字符串右边空白字符                       | >= 1.0.1 |

#### string.startswith

- 判断字符串开头是否匹配

```lua
local s = "hello xmake"
if s:startswith("hello") then
    print("match")
end
```

#### string.endswith

- 判断字符串结尾是否匹配

```lua
local s = "hello xmake"
if s:endswith("xmake") then
    print("match")
end
```

#### string.split

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

#### string.trim

- 去掉字符串左右空白字符

```lua
string.trim("    hello xmake!    ")
```

结果为："hello xmake!"

#### string.ltrim

- 去掉字符串左边空白字符

```lua
string.ltrim("    hello xmake!    ")
```

结果为："hello xmake!    "

#### string.rtrim

- 去掉字符串右边空白字符

```lua
string.rtrim("    hello xmake!    ")
```

结果为："    hello xmake!"

### coroutine

协程模块是lua原生自带的模块，具使用见：[lua官方手册](https://www.lua.org/manual/5.1/manual.html#5.2)

