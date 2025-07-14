---
title: xmake从入门到精通12：通过自定义脚本实现更灵活地配置
tags: [xmake, lua, 子工程, 子模块, 自定义脚本]
date: 2020-07-18
author: Ruki
---

xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。

本文主要详细讲解下，如何通过添加自定义的脚本，在脚本域实现更加复杂灵活的定制。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

### 配置分离

xmake.lua采用二八原则实现了描述域、脚本域两层分离式配置。

什么是二八原则呢，简单来说，大部分项目的配置，80%的情况下，都是些基础的常规配置，比如：`add_cxflags`, `add_links`等，
只有剩下不到20%的地方才需要额外做些复杂来满足一些特殊的配置需求。

而这剩余的20%的配置通常比较复杂，如果直接充斥在整个xmake.lua里面，会把整个项目的配置整个很混乱，非常不可读。

因此，xmake通过描述域、脚本域两种不同的配置方式，来隔离80%的简单配置以及20%的复杂配置，使得整个xmake.lua看起来非常的清晰直观，可读性和可维护性都达到最佳。

### 描述域

对于刚入门的新手用户，或者仅仅是维护一些简单的小项目，通过完全在描述配置就已经完全满足需求了，那什么是描述域呢？它长这样：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("DEBUG")
    add_syslinks("pthread")
```

一眼望去，其实就是个 `set_xxx`/`add_xxx`的配置集，对于新手，完全可以不把它当做lua脚本，仅仅作为普通的，但有一些基础规则的配置文件就行了。

这是不是看着更像配置文件了？其实描述域就是配置文件，类似像json等key/values的配置而已，所以即使完全不会lua的新手，也是能很快上手的。

而且，对于通常的项目，仅通过`set_xxx/add_xxx`去配置各种项目设置，已经完全满足需求了。

这也就是开头说的：80%的情况下，可以用最简单的配置规则去简化项目的配置，提高可读性和可维护性，这样对用户和开发者都会非常的友好，也更加直观。

如果我们要针对不同平台，架构做一些条件判断怎么办？没关系，描述域除了基础配置，也是支持条件判断，以及for循环的：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("DEBUG")
    if is_plat("linux", "macosx") then
        add_links("pthread", "m", "dl")
    end
```

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_defines("DEBUG")
    for _, name in ipairs({"pthread", "m", "dl"}) do
        add_links(name)
    end
```

这是不是看着有点像lua了？虽说，平常可以把它当做普通配置问题，但是xmake毕竟基于lua，所以描述域还是支持lua的基础语言特性的。

!> 不过需要注意的是，描述域虽然支持lua的脚本语法，但在描述域尽量不要写太复杂的lua脚本，比如一些耗时的函数调用和for循环

并且在描述域，主要目的是为了设置配置项，因此xmake并没有完全开放所有的模块接口，很多接口在描述域是被禁止调用的，
即使开放出来的一些可调用接口，也是完全只读的，不耗时的安全接口，比如：`os.getenv()`等读取一些常规的系统信息，用于配置逻辑的控制。

!> 另外需要注意一点，xmake.lua是会被多次解析的，用于在不同阶段解析不同的配置域：比如：`option()`, `target()`等域。

因此，不要想着在xmake.lua的描述域，写复杂的lua脚本，也不要在描述域调用print去显示信息，因为会被执行多遍，记住：会被执行多遍！！！

### 脚本域

限制描述域写复杂的lua，各种lua模块和接口都用不了？怎么办？这个时候就是脚本域出场的时候了。

如果用户已经完全熟悉了xmake的描述域配置，并且感觉有些满足不了项目上的一些特殊配置维护了，那么我们可以在脚本域做更加复杂的配置逻辑：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load(function (target)
        if is_plat("linux", "macosx") then
            target:add("links", "pthread", "m", "dl")
        end
    end)
    after_build(function (target)
        import("core.project.config")
        local targetfile = target:targetfile()
        os.cp(targetfile, path.join(config.buildir(), path.filename(targetfile)))
        print("build %s", targetfile)
    end)
```

只要是类似：`on_xxx`, `after_xxx`, `before_xxx`等字样的function body内部的脚本，都属于脚本域。

在脚本域中，用户可以干任何事，xmake提供了import接口可以导入xmake内置的各种lua模块，也可以导入用户提供的lua脚本。











我们可以在脚本域实现你想实现的任意功能，甚至写个独立项目出来都是可以的。

对于一些脚本片段，不是很臃肿的话，像上面这么内置写写就足够了，如果需要实现更加复杂的脚本，不想充斥在一个xmake.lua里面，可以把脚本分离到独立的lua文件中去维护。

例如：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load("modules.test.load")
    on_install("modules.test.install")
```

我们可以吧自定义的脚本放置到xmake.lua对应目录下，`modules/test/load.lua`和`modules/test/install.lua`中独立维护。

单独的lua脚本文件以main作为主入口，例如：

```lua
-- 我们也可以在此处导入一些内置模块或者自己的扩展模块来使用
import("core.project.config")
import("mymodule")

function main(target)
    if is_plat("linux", "macosx") then
        target:add("links", "pthread", "m", "dl")
    end
end
```

这些独立的lua脚本里面，我们还可以通过[import](https://xmake.io/zh/)导入各种内置模块和自定义模块进来使用，就跟平常写lua, java没啥区别。

而对于脚本的域的不同阶段，`on_load`主要用于target加载时候，做一些动态化的配置，这里不像描述域，只会执行一遍哦!!!

其他阶段，还有很多，比如：`on/after/before`_`build/install/package/run`等，我们下面会详细描述。

### import

#### 导入扩展摸块

在讲解各个脚本域之前，我们先来简单介绍下xmake的模块导入和使用方式，xmake采用import来引入其他的扩展模块，以及用户自己定义的模块，它可以在下面一些地方使用：

* 自定义脚本([on_build](https://xmake.io/zh/), [on_run](https://xmake.io/zh/) ..)
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
    print(p.plats())
end
```

2.1.5版本新增两个新属性：`import("xxx.xxx", {try = true, anonymous = true})`

try为true，则导入的模块不存在的话，仅仅返回nil，并不会抛异常后中断xmake.
anonymous为true，则导入的模块不会引入当前作用域，仅仅在import接口返回导入的对象引用。

### 测试扩展模块

一种方式我们可以在on_load等脚本中，直接调用print去打印模块的调用结果信息，来测试和验证。

不过xmake还提供了`xmake lua`插件可以更加灵活方便的测试脚本。


#### 运行指定的脚本文件

比如，我们可以直接指定lua脚本来加载运行，这对于想要快速测试一些接口模块，验证自己的某些思路，都是一个不错的方式。

我们先写个简单的lua脚本：

```lua
function main()
    print("hello xmake!")
end
```

然后直接运行它就行了：

```console
$ xmake lua /tmp/test.lua
```

#### 直接调用扩展模块

所有内置模块和扩展模块的接口，我们都可以通过`xmake lua`直接调用，例如：

```console
$ xmake lua lib.detect.find_tool gcc
```

上面的命令，我们直接调用了`import("lib.detect.find_tool")`模块接口来快速执行。

#### 运行交互命令 (REPL)

有时候在交互模式下，运行命令更加的方便测试和验证一些模块和api，也更加的灵活，不需要再去额外写一个脚本文件来加载。

我们先看下，如何进入交互模式：

```console
# 不带任何参数执行，就可以进入
$ xmake lua
>

# 进行表达式计算
> 1 + 2
3

# 赋值和打印变量值
> a = 1
> a
1

# 多行输入和执行
> for _, v in pairs({1, 2, 3}) do
>> print(v)
>> end
1
2
3
```

我们也能够通过 `import` 来导入扩展模块：

```console
> task = import("core.project.task")
> task.run("hello")
hello xmake!
```

如果要中途取消多行输入，只需要输入字符：`q` 就行了

```console
> for _, v in ipairs({1, 2}) do
>> print(v)
>> q             <--  取消多行输入，清空先前的输入数据
> 1 + 2
3
```

### target:on_load

#### 自定义目标加载脚本

在target初始化加载的时候，将会执行此脚本，在里面可以做一些动态的目标配置，实现更灵活的目标描述定义，例如：

```lua
target("test")
    on_load(function (target)
        target:add("defines", "DEBUG", "TEST=\"hello\"")
        target:add("linkdirs", "/usr/lib", "/usr/local/lib")
        target:add({includedirs = "/usr/include", "links" = "pthread"})
    end)
```

可以在`on_load`里面，通过`target:set`, `target:add` 来动态添加各种target属性，所有描述域的`set_`, `add_`配置都可以通过这种方式动态配置。

另外，我们可以调用target的一些接口，获取和设置一些基础信息，比如：

| target接口                          | 描述                                                             |
| ----------------------------------- | ---------------------------------------------------------------- |
| target:name()                       | 获取目标名                                                       |
| target:targetfile()                 | 获取目标文件路径                                                 |
| target:targetkind()                 | 获取目标的构建类型                                               |
| target:get("defines")               | 获取目标的宏定义                                                 |
| target:get("xxx")                   | 其他通过 `set_/add_`接口设置的target信息，都可以通过此接口来获取 |
| target:add("links", "pthread")      | 添加目标设置                                                     |
| target:set("links", "pthread", "z") | 覆写目标设置                                                     |
| target:deps()                       | 获取目标的所有依赖目标                                           |
| target:dep("depname")               | 获取指定的依赖目标                                               |
| target:opts()                       | 获取目标的所有关联选项                                           |
| target:opt("optname")               | 获取指定的关联选项                                               |
| target:pkgs()                       | 获取目标的所有关联依赖包                                         |
| target:pkg("pkgname")               | 获取指定的关联依赖包                                             |
| target:sourcebatches()              | 获取目标的所有源文件列表                                         |

### target:on_link

#### 自定义链接脚本

这个是在v2.2.7之后新加的接口，用于定制化处理target的链接过程。

```lua
target("test")
    on_link(function (target) 
        print("link it")
    end)
```

### target:on_build

#### 自定义编译脚本

覆盖target目标默认的构建行为，实现自定义的编译过程，一般情况下，并不需要这么做，除非确实需要做一些xmake默认没有提供的编译操作。

你可以通过下面的方式覆盖它，来自定义编译操作：

```lua
target("test")

    -- 设置自定义编译脚本
    on_build(function (target) 
        print("build it")
    end)
```

注：2.1.5版本之后，所有target的自定义脚本都可以针对不同平台和架构，分别处理，例如：

```lua
target("test")
    on_build("iphoneos|arm*", function (target)
        print("build for iphoneos and arm")
    end)
```

其中如果第一个参数为字符串，那么就是指定这个脚本需要在哪个`平台|架构`下，才会被执行，并且支持模式匹配，例如`arm*`匹配所有arm架构。

当然也可以只设置平台，不设置架构，这样就是匹配指定平台下，执行脚本：

```lua
target("test")
    on_build("windows", function (target)
        print("build for windows")
    end)
```

注：一旦对这个target目标设置了自己的build过程，那么xmake默认的构建过程将不再被执行。

### target:on_build_file

#### 自定义编译脚本, 实现单文件构建

通过此接口，可以用来hook指定target内置的构建过程，自己重新实现每个源文件编译过程：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_build_file(function (target, sourcefile, opt)
    end)
```

### target:on_build_files

#### 自定义编译脚本, 实现多文件构建

通过此接口，可以用来hook指定target内置的构建过程，替换一批同类型源文件编译过程：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_build_files(function (target, sourcebatch, opt)
    end)
```

设置此接口后，对应源文件列表中文件，就不会出现在自定义的target.on_build_file了，因为这个是包含关系。

其中sourcebatch描述了这批同类型源文件：

* `sourcebatch.sourcekind`: 获取这批源文件的类型，比如：cc, as, ..
* `sourcebatch.sourcefiles()`: 获取源文件列表
* `sourcebatch.objectfiles()`: 获取对象文件列表
* `sourcebatch.dependfiles()`: 获取对应依赖文件列表，存有源文件中编译依赖信息，例如：xxx.d

### target:on_clean

#### 自定义清理脚本

覆盖target目标的`xmake [c|clean}`的清理操作，实现自定义清理过程。

```lua
target("test")

    -- 设置自定义清理脚本
    on_clean(function (target) 

        -- 仅删掉目标文件
        os.rm(target:targetfile())
    end)
```

### target:on_package

#### 自定义打包脚本

覆盖target目标的`xmake [p|package}`的打包操作，实现自定义打包过程，如果你想对指定target打包成自己想要的格式，可以通过这个接口自定义它。

```lua
target("demo")
    set_kind("shared")
    add_files("jni/*.c")
    on_package(function (target) 
        os.exec("./gradlew app:assembleDebug") 
    end)
```

当然这个例子有点老了，这里只是举例说明下用法而已，现在xmake提供了专门的[xmake-gradle](https://github.com/xmake-io/xmake-gradle)插件，来与gradle更好的集成。

### target:on_install

#### 自定义安装脚本

覆盖target目标的`xmake [i|install}`的安装操作，实现自定义安装过程。

例如，将生成的apk包，进行安装。

```lua
target("test")

    -- 设置自定义安装脚本，自动安装apk文件
    on_install(function (target) 

        -- 使用adb安装打包生成的apk文件
        os.run("adb install -r ./bin/Demo-debug.apk")
    end)
```

### target:on_uninstall

#### 自定义卸载脚本

覆盖target目标的`xmake [u|uninstall}`的卸载操作，实现自定义卸载过程。

```lua
target("test")
    on_uninstall(function (target) 
        ...
    end)
```

### target:on_run

#### 自定义运行脚本

覆盖target目标的`xmake [r|run}`的运行操作，实现自定义运行过程。

例如，运行安装好的apk程序：

```lua
target("test")

    -- 设置自定义运行脚本，自动运行安装好的app程序，并且自动获取设备输出信息
    on_run(function (target) 
        os.run("adb shell am start -n com.demo/com.demo.DemoTest")
        os.run("adb logcat")
    end)
```

### before_xxx和after_xxx

需要注意的是，target:on_xxx的所有接口都覆盖内部默认实现，通常我们并不需要完全复写，只是额外挂接自己的一些逻辑，那么可以使用`target:before_xxx`和`target:after_xxx`系列脚本就行了。

所有的on_xxx都有对应的before_和after_xx版本，参数也完全一致，例如：

```lua
target("test")
    before_build(function (target)
        print("")
    end)
```

### 内置模块

在自定义脚本中，除了使用import接口导入各种扩展模块使用，xmake还提供了很多基础的内置模块，比如：os，io等基础操作，实现更加跨平台的处理系统接口。

#### os.cp

os.cp的行为和shell中的`cp`命令类似，不过更加强大，不仅支持模式匹配（使用的是lua模式匹配），而且还确保目的路径递归目录创建、以及支持xmake的内置变量。

例如：

```lua
os.cp("$(scriptdir)/*.h", "$(buildir)/inc")
os.cp("$(projectdir)/src/test/**.h", "$(buildir)/inc")
```

上面的代码将：当前`xmake.lua`目录下的所有头文件、工程源码test目录下的头文件全部复制到`$(buildir)`输出目录中。

其中`$(scriptdir)`, `$(projectdir)` 这些变量是xmake的内置变量，具体详情见：[内置变量](https://xmake.io/mirror/zh-cn/manual/builtin_variables.html)的相关文档。

而`*.h`和`**.h`中的匹配模式，跟[add_files](https://xmake.io/zh/)中的类似，前者是单级目录匹配，后者是递归多级目录匹配。


上面的复制，会把所有文件全部展开复制到指定目录，丢失源目录层级，如果要按保持原有的目录结构复制，可以设置rootdir参数：

```lua
os.cp("src/**.h", "/tmp/", {rootdir = "src"})
```

上面的脚本可以按`src`根目录，将src下的所有子文件保持目录结构复制过去。

注：尽量使用`os.cp`接口，而不是`os.run("cp ..")`，这样更能保证平台一致性，实现跨平台构建描述。

#### os.run

此接口会安静运行原生shell命令，用于执行第三方的shell命令，但不会回显输出，仅仅在出错后，高亮输出错误信息。

此接口支持参数格式化、内置变量，例如：

```lua
-- 格式化参数传入
os.run("echo hello %s!", "xmake")

-- 列举构建目录文件
os.run("ls -l $(buildir)")
```

#### os.execv

此接口相比os.run，在执行过程中还会回显输出，并且参数是通过列表方式传入，更加的灵活。

```lua
os.execv("echo", {"hello", "xmake!"})
```

另外，此接口还支持一个可选的参数，用于传递设置：重定向输出，执行环境变量设置，例如：

```lua
os.execv("echo", {"hello", "xmake!"}, {stdout = outfile, stderr = errfile, envs = {PATH = "xxx;xx", CFLAGS = "xx", curdir = "/tmp"}}
```

其中，stdout和stderr参数用于传递重定向输出和错误输出，可以直接传入文件路径，也可以传入io.open打开的文件对象。

另外，如果想在这次执行中临时设置和改写一些环境变量，可以传递envs参数，里面的环境变量设置会替换已有的设置，但是不影响外层的执行环境，只影响当前命令。

我们也可以通过`os.getenvs()`接口获取当前所有的环境变量，然后改写部分后传入envs参数。

另外，还能通过curdir参数设置，在执行过程中修改子进程的工作目录。

其相关类似接口还有，os.runv, os.exec, os.execv, os.iorun, os.iorunv等等，比如os.iorun可以获取运行的输出内容。

这块的具体详情和差异，还有更多os接口，都可以到：[os接口文档](https://xmake.io/zh/) 查看。

#### io.readfile

此接口，从指定路径文件读取所有内容，我们可在不打开文件的情况下，直接读取整个文件的内容，更加的方便，例如：

```lua
local data = io.readfile("xxx.txt")
```

#### io.writefile

此接口写入所有内容到指定路径文件，我们可在不打开文件的情况下，直接写入整个文件的内容，更加的方便，例如：

```lua
io.writefile("xxx.txt", "all data")
```

#### path.join

此接口实现跨平台地路径拼接操作，将多个路径项进行追加拼接，由于`windows/unix`风格的路径差异，使用api来追加路径更加跨平台，例如：

```lua
print(path.join("$(tmpdir)", "dir1", "dir2", "file.txt"))
```

上述拼接在unix上相当于：`$(tmpdir)/dir1/dir2/file.txt`，而在windows上相当于：`$(tmpdir)\\dir1\\dir2\\file.txt`

更多内置模块详情见：[内置模块文档](https://xmake.io/zh/)