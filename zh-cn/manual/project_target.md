
定义和设置子工程模块，每个`target`对应一个子工程，最后会生成一个目标程序，有可能是可执行程序，也有可能是库模块。

!> target的接口，都是可以放置在target外面的全局作用域中的，如果在全局中设置，那么会影响所有子工程target。

例如：

```lua
-- 会同时影响test和test2目标
add_defines("DEBUG")

target("test")
    add_files("*.c")

target("test2")
    add_files("*.c")
```

!> `target`域是可以重复进入来实现分离设置的。

### target

#### 定义工程目标

定义一个新的控制台工程目标，工程名为`test`，最后生成的目标名也是`test`。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

可以重复调用这个api，进入target域修改设置

```lua
-- 定义目标demo，并进入demo设置模式
target("demo")
    set_kind("binary")
    add_files("src/demo.c")

-- 定义和设置其他目标
target("other")
    ...

-- 重新进入demo目标域，添加test.c文件
target("demo")
    add_files("src/test.c")
```

<p class="tip">
所有根域的设置，会全局影响所有target目标，但是不会影响option的定义。
</p>

```lua
-- 在根域对所有target添加-DDEBUG的宏定义，影响所有target（demo和test都会加上此宏定义）
add_defines("DEBUG")

target("demo")
    set_kind("binary")
    add_files("src/demo.c")

target("test")
    set_kind("binary")
    add_files("src/test.c")
```

### target_end

#### 结束定义工程目标

这是一个可选的api，如果不调用，那么`target("xxx")`之后的所有设置都是针对这个target进行的，除非进入其他`target`, `option`, `task`域。

如果想设置完当前`target`后，显示离开`target`域，进入根域设置，那么可以通过这个api才操作，例如：

```lua
target("test")
    set_kind("static")
    add_files("src/*.c")
target_end()

-- 此处已在根域
-- ...
```

如果不调用这个api的话:

```lua
target("test")
    set_kind("static")
    add_files("src/*.c")

-- 此处还在上面target域中，之后的设置还是针对test进行的设置
-- ...

-- 这个时候才离开test，进入另外一个target域中
target("test2")
    ...
```

### target:set_kind

#### 设置目标编译类型

设置目标类型，目前支持的类型有：

| 值     | 描述       |
| ------ | -----------|
| phony | 假的目标程序 |
| binary | 二进制程序 |
| static | 静态库程序 |
| shared | 动态库程序 |
| object | 仅仅编译对象集合 |
| headeronly | 仅仅头文件集合 |

##### binary

- 可执行文件类型

```lua
target("demo")
    set_kind("binary")
    add_files("src/*.c")
```

!> 2.5.5 开始，如果没有设置 set_kind 接口，默认就是 binary 类型。

所以我们简化为：


```lua
target("demo")
    add_files("src/*.c")
```

甚至:


```lua
target("demo", {files = "src/*.c"})
```

##### static

- 静态库目标类型

```lua
target("demo")
    set_kind("static")
    add_files("src/*.c")
```

##### shared

- 动态库目标类型

```lua
target("demo")
    set_kind("shared")
    add_files("src/*.c")
```

##### object

- 纯对象文件列表类型

通常用于两个目标程序间，部分对象文件共享，仅仅编译一次。也可以用于分离对象文件列表，配置不同的编译参数。

##### phony

- 空目标类型

它是一个特殊的目标程序类型，它不生成任何实际的程序文件，仅仅用于组合其他目标程序的依赖关系。

```lua
target("test1")
    set_kind("binary")
    add_files("src/*.c")

target("test2")
    set_kind("binary")
    add_files("src/*.c")

target("demo")
    set_kind("phony")
    add_deps("test1", "test2")
```

比如上述配置，我们就可以在执行 `xmake build demo` 编译的时候，同时编译相关的两个依赖程序：test1和test2。

##### headeronly

- 纯头文件目标类型

2.5.9 之后，我们新增了 `headeronly` 目标类型，这个类型的目标程序，我们不会实际编译它们，因为它没有源文件需要被编译。

但是它包含了头文件列表，这通常用于 headeronly 库项目的安装，IDE 工程的文件列表生成，以及安装阶段的 cmake/pkgconfig 导入文件的生成。

例如：

```lua
add_rules("mode.release", "mode.debug")

target("foo")
    set_kind("headeronly")
    add_headerfiles("src/foo.h")
    add_rules("utils.install.cmake_importfiles")
    add_rules("utils.install.pkgconfig_importfiles")
```

更多详情见：[#1747](https://github.com/xmake-io/xmake/issues/1747)

### target:set_strip

#### 设置是否strip信息

设置当前目标的strip模式，目前支持一下模式：

| 值     | 描述                                      |
| ------ | ----------------------------------------- |
| debug  | 链接的时候，strip掉调试符号               |
| all    | 链接的时候，strip掉所有符号，包括调试符号 |

这个api一般在release模式下使用，可以生成更小的二进制程序。。

```lua
target("xxxx")
    set_strip("all")
```

<p class="tip">
这个api不一定非得在target之后使用，如果没有target指定，那么将会设置到全局模式。。
</p>

### target:set_enabled

#### 设置是否启用或禁用目标

如果设置`set_enabled(false)`，则会直接禁用对应的target，包括target的加载和信息获取，而[set_default](#targetset_default)仅仅只是设置默认不去编译，但是target还是能获取到相关信息的，默认也会被加载。

### target:set_default

#### 设置是否为默认构建安装目标

这个接口用于设置给定工程目标是否作为默认构建，如果没有调用此接口进行设置，那么这个目标就是默认被构建的，例如：

```lua
target("test1")
    set_default(false)

target("test2")
    set_default(true)

target("test3")
    ...
```

上述代码的三个目标，在执行`xmake`, `xmake install`, `xmake package`, `xmake run`等命令的时候，如果不指定目标名，那么：

| 目标名 | 行为                             |
| ------ | -------------------------------- |
| test1  | 不会被默认构建、安装、打包和运行 |
| test2  | 默认构建、安装、打包和运行       |
| test3  | 默认构建、安装、打包和运行       |

通过上面的例子，可以看到默认目标可以设置多个，运行的时候也会依次运行。

<p class="tip">
    需要注意的是，`xmake uninstall`和`xmake clean`命令不受此接口设置影响，因为用户大部分情况下都是喜欢清除和卸载所有。
</p>

如果不想使用默认的目标，那么可以手动指定需要构建安装的目标：

```bash
$ xmake build targetname
$ xmake install targetname
```

如果要强制构建安装所有目标，可以传入`[-a|--all]`参数：

```bash
$ xmake build [-a|--all]
$ xmake install [-a|--all]
```

### target:set_options

#### 设置关联选项

添加选项依赖，如果通过[option](#option)接口自定义了一些选项，那么只有在指定`target`目标域下，添加此选项，才能进行关联生效。

```lua
-- 定义一个hello选项
option("hello")
    set_default(false)
    set_showmenu(true)
    add_defines("HELLO_ENABLE")

target("test")
    -- 如果hello选项被启用了，这个时候就会将-DHELLO_ENABLE宏应用到test目标上去
    set_options("hello")
```

<p class="warn">
只有调用`set_options`进行关联生效后，[option](#option) 中定义的一些设置才会影响到此`target`目标，例如：宏定义、链接库、编译选项等等
</p>

### target:set_symbols

#### 设置符号信息

设置目标的符号模式，如果当前没有定义target，那么将会设置到全局状态中，影响所有后续的目标。

目前主要支持一下几个级别：

| 值           | 描述                            | gcc/clang           | msvc           |
| ------       | ----------------------          | -----               | ----           |
| debug        | 添加调试符号                    | -g                  | /Zi /Pdxxx.pdb |
| debug, edit  | 仅 msvc 生效，配合debug级别使用 | 忽略                | /ZI /Pdxxx.pdb |
| debug, embed | 仅 msvc 生效，配合debug级别使用 | 忽略                | /Z7            |
| hidden       | 设置符号不可见                  | -fvisibility=hidden | 忽略           |

这两个值也可以同时被设置，例如：

```lua
-- 添加调试符号, 设置符号不可见
set_symbols("debug", "hidden")
```

如果没有调用这个api，默认是禁用调试符号的。。

!> 在v2.3.3以上版本，通过跟`set_strip("all")`配合同时设置，可以自动生成独立的调试符号，例如对于ios程序，就是.dSYM文件，对于android等其他程序，就是.sym符号文件。

如果target同时设置了下面两个设置，就会启用符号文件生成

```lua
target("test")
    set_symbols("debug")
    set_strip("all")
```

对于内置的release模式，默认不启用符号生成，仅仅只是strip targetfile，如果要启用，只需要再额外开启debug符号就行，因为mode.release内部默认已经启用了strip了。

```lua
add_rules("mode.release")
target("test")
    set_symbols("debug")
```

ios程序会生成.dSYM文件，然后同时Strip自身符号

```console
[ 62%]: linking.release libtest.dylib
[ 62%]: generating.release test.dSYM
```

android程序会生成.sym文件（其实就是带符号的so/binary程序），然后同时Strip自身符号

```console
[ 62%]: linking.release libtest.so
[ 62%]: generating.release test.sym
```

v2.3.9 以上版本，新增了 `edit` 和 `embed` 两个额外的附属级别，需要组合 `debug` 级别一起使用，仅用于进一步细分 msvc 编译器的调试符号格式，例如：

```lua
set_symbols("debug", "edit")
```

会从默认的 `-Zi -Pdxxx.pdb` 切换到 `-ZI -Pdxxx.pdb` 编译选项，开启 `Edit and Continue` 调试符号格式信息，当然这并不会影响 gcc/clang 的处理，所以也是完全兼容的。

### target:set_basename

#### 设置目标文件名

默认情况下，生成的目标文件名基于`target("name")`中配置的值，例如：

```lua
-- 目标文件名为：libxxx.a
target("xxx")
    set_kind("static")

-- 目标文件名为：libxxx2.so
target("xxx2")
    set_kind("shared")
```

默认的命名方式，基本上可以满足大部分情况下的需求，但是如果有时候想要更加定制化目标文件名

例如，按编译模式和架构区分目标名，这个时候可以使用这个接口，来设置：

```lua
target("xxx")
    set_kind("static")
    set_basename("xxx_$(mode)_$(arch)")
```

如果这个时候，编译配置为：`xmake f -m debug -a armv7`，那么生成的文件名为：`libxxx_debug_armv7.a`

如果还想进一步定制目标文件的目录名，可参考：[set_targetdir](#targetset_targetdir)。

或者通过编写自定义脚本，实现更高级的逻辑，具体见：[after_build](#targetafter_build)和[os.mv](/zh-cn/manual/builtin_modules?id=osmv)。

### target:set_filename

#### 设置目标文件全名

它跟[set_basename](#targetset_basename)的区别在于，[set_basename](#targetset_basename)设置名字不带后缀跟前缀，例如：`libtest.a`，basename如果改成test2后就变成了`libtest2.a`。

而filename的修改，是修改整个目标文件名，包括前后缀，例如可以直接把`libtest.a`改成`test.dll`，这个对于[set_basename](#targetset_basename)是做不到的。

### target:set_prefixname

#### 设置目标文件的前置名

2.5.5 之后版本才支持，可以修改设置目标文件的前置名，例如将默认的：`libtest.so` 改成 `test.so`

```lua
target("test")
    set_prefixname("")
```

### target:set_suffixname

#### 设置目标文件的后置名

2.5.5 之后版本才支持，可以修改设置目标文件的后置名，例如将默认的：`libtest.so` 改成 `libtest-d.so`

```lua
target("test")
    set_suffixname("-d")
```

### target:set_extension

#### 设置目标文件的扩展名

2.5.5 之后版本才支持，可以修改设置目标文件的扩展名，例如将默认的：`libtest.so` 改成 `test.dll`

```lua
target("test")
    set_prefixname("")
    set_extension(".dll")
```

### target:set_warnings

#### 设置警告级别

设置当前目标的编译的警告级别，一般支持一下几个级别：

| 值         | 描述                    | gcc/clang                             | msvc                          |
| -----      | ----------------------  | ----------                            | ----------------------------- |
| none       | 禁用所有警告            | -w                                    | -W0                           |
| less       | 启用较少的警告          | -W1                                   | -W1                           |
| more       | 启用较多的警告          | -W3                                   | -W3                           |
| all        | 启用所有警告            | -Wall                                 | -W3                           |
| allextra   | 启用所有警告+额外的警告 | -Wall -Wextra                         | -W4                           |
| everything | 启用全部支持的警告      | -Wall -Wextra -Weffc++ / -Weverything | -Wall                         |
| error      | 将所有警告作为编译错误  | -Werror                               | -WX                           |

这个api的参数是可以混合添加的，例如：

```lua
-- 启用所有警告，并且作为编译错误处理
set_warnings("all", "error")
```

如果当前没有目标，调用这个api将会设置到全局模式。。

### target:set_optimize

#### 设置优化级别

设置目标的编译优化等级，如果当前没有设置目标，那么将会设置到全局状态中，影响所有后续的目标。

目前主要支持一下几个级别：

| 值         | 描述                   | gcc/clang  | msvc         |
| ---------- | ---------------------- | ---------- | ------------ |
| none       | 禁用优化               | -O0        | -Od          |
| fast       | 快速优化               | -O1        | default      |
| faster     | 更快的优化             | -O2        | -O2          |
| fastest    | 最快运行速度的优化     | -O3        | -Ox -fp:fast |
| smallest   | 最小化代码优化         | -Os        | -O1 -GL      |
| aggressive | 过度优化               | -Ofast     | -Ox -fp:fast |

例如：

```lua
-- 最快运行速度的优化
set_optimize("fastest")
```

### target:set_languages

#### 设置代码语言标准

设置目标代码编译的语言标准，如果当前没有目标存在，将会设置到全局模式中。。。

支持的语言标准目前主要有以下几个：

| 值         | 描述                   |
| ---------- | ---------------------- |
| ansi       | c语言标准: ansi        |
| c89        | c语言标准: c89         |
| gnu89      | c语言标准: gnu89       |
| c99        | c语言标准: c99         |
| gnu99      | c语言标准: gnu99       |
| c11        | c语言标准: c11         |
| c17        | c语言标准: c17         |
| clatest    | c语言标准: clatest     |

| 值          | 描述                       |
| ----------  | ----------------------     |
| cxx98       | c++语言标准: `c++98`       |
| gnuxx98     | c++语言标准: `gnu++98`     |
| cxx11       | c++语言标准: `c++11`       |
| gnuxx11     | c++语言标准: `gnu++11`     |
| cxx14       | c++语言标准: `c++14`       |
| gnuxx14     | c++语言标准: `gnu++14`     |
| cxx1z       | c++语言标准: `c++1z`       |
| gnuxx1z     | c++语言标准: `gnu++1z`     |
| cxx17       | c++语言标准: `c++17`       |
| gnuxx17     | c++语言标准: `gnu++17`     |
| cxx20       | c++语言标准: `c++20`       |
| gnuxx20     | c++语言标准: `gnu++20`     |
| cxxlatest   | c++语言标准: `c++latest`   |
| gnuxxlatest | c++语言标准: `gnu++latest` |

c标准和c++标准可同时进行设置，例如：

```lua
-- 设置c代码标准：c99， c++代码标准：c++11
set_languages("c99", "cxx11")
```

并不是设置了指定的标准，编译器就一定会按这个标准来编译，毕竟每个编译器支持的力度不一样，但是xmake会尽最大可能的去适配当前编译工具的支持标准。

msvc 的编译器并不支持按 c99 的标准来编译c代码，只能支持到c89，但是xmake为了尽可能的支持它，所以在设置c99的标准后，xmake会强制按c++代码模式去编译c代码，从一定程度上解决了windows下编译c99的c代码问题。。
用户不需要去额外做任何修改。

不过最新的 msvc 编译已经支持上了 c11/c17 标准，xmake 也就不会再做额外的特殊处理。

### target:set_fpmodels

#### 设置float-point编译模式

此接口用于设置浮点的编译模式，对数学计算相关优化的编译抽象设置，提供：fast, strict, except, precise 等几种常用的级别，有些可同时设置，有些是有冲突的，最后设置的生效。

关于这些级别的说明，可以参考下微软的文档：[Specify floating-point behavior](https://docs.microsoft.com/en-us/cpp/build/reference/fp-specify-floating-point-behavior?view=vs-2019)

当然，对应gcc/icc等其他编译器，xmake 会映射到不同的编译flags。

```lua
set_fpmodels("fast")
set_fpmodels("strict")
set_fpmodels("fast", "except")
set_fpmodels("precise") -- default
```

关于这块详情见：[https://github.com/xmake-io/xmake/issues/981](https://github.com/xmake-io/xmake/issues/981)

### target:set_targetdir

#### 设置生成目标文件目录

设置目标程序文件的输出目录，一般情况下，不需要设置，默认会输出在build目录下

而build的目录可以在工程配置的时候，手动修改：

```bash
xmake f -o /tmp/build
```

修改成`/tmp/build`后，目标文件默认输出到`/tmp/build`下面。

而如果用这个接口去设置，就不需要每次敲命令修改了，例如：

```lua
target("test")
    set_targetdir("/tmp/build")
```

<p class="tip">
如果显示设置了`set_targetdir`， 那么优先选择`set_targetdir`指定的目录为目标文件的输出目录。
</p>

### target:set_objectdir

#### 设置对象文件生成目录

设置目标target的对象文件(`*.o/obj`)的输出目录，例如:

```lua
target("test")
    set_objectdir("$(buildir)/.objs")
```

### target:set_dependir

#### 设置依赖文件生成目录

设置目标target的编译依赖文件(`.deps`)的输出目录，例如:

```lua
target("test")
    set_dependir("$(buildir)/.deps")
```

### target:add_imports

#### 为自定义脚本预先导入扩展模块

通常，我们在[on_build](#targeton_build)等自定义脚本内部，可以通过`import("core.base.task")`的方式导入扩展模块，
但是对于自定义脚本比较多的情况下，每个自定义脚本都重复导入一遍，非常的繁琐，那么可以通过这个接口，实现预先导入，例如：

```lua
target("test")
    on_load(function (target)
        import("core.base.task")
        import("core.project.project")

        task.run("xxxx")
    end)
    on_build(function (target)
        import("core.base.task")
        import("core.project.project")

        task.run("xxxx")
    end)
    on_install(function (target)
        import("core.base.task")
        import("core.project.project")

        task.run("xxxx")
    end)
```

通过此接口可以简化为：

```lua
target("test")
    add_imports("core.base.task", "core.project.project")
    on_load(function (target)
        task.run("xxxx")
    end)
    on_build(function (target)
        task.run("xxxx")
    end)
    on_install(function (target)
        task.run("xxxx")
    end)
```

### target:add_rules

#### 添加规则到目标

我们可以通过预先设置规则支持的文件后缀，来扩展其他文件的构建支持：

```lua
-- 定义一个markdown文件的构建规则
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build(function (target, sourcefile)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)

target("test")
    set_kind("binary")

    -- 使test目标支持markdown文件的构建规则
    add_rules("markdown")

    -- 添加markdown文件的构建
    add_files("src/*.md")
    add_files("src/*.markdown")
```

我们也可以指定应用局部文件到规则，具体使用见：[add_files](#targetadd_files)。

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

可以在`on_load`里面，通过`target:set`, `target:add` 来动态添加各种target属性。

### target:on_config

#### 自定义配置脚本

在 `xmake config` 执行完成后，Build 之前会执行此脚本，通常用于编译前的配置工作。它与 on_load 不同的是，on_load 只要 target 被加载就会执行，执行时机更早。

如果一些配置，无法在 on_load 中过早配置，那么都可以在 on_config 中去配置它。

另外，它的执行时机比 before_build 还要早，大概的执行流程如下：

```
on_load -> after_load -> on_config -> before_build -> on_build -> after_build
```

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

<p class="tip">
一旦对这个target目标设置了自己的build过程，那么xmake默认的构建过程将不再被执行。
</p>


### target:on_build_file

#### 自定义编译脚本, 实现单文件构建

通过此接口，可以用来hook指定target内置的构建过程，替换每个源文件编译过程：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_build_file(function (target, sourcefile, opt)
        opt.origin(target, sourcefile, opt)
    end)
```

上面代码中的`opt.origin`存有内置的构建脚本，如果hook后还是想调用内置的构建脚本去编译源文件，那么直接继续调用`opt.origin`就行了。

如果不想重写内置的编译脚本，仅仅只是在编译前后添加一些自己的处理，其实用：[target.before_build_file](#targetbefore_build_file)和[target.after_build_file](#targetafter_build_file)会更加方便，不需要调用`opt.origin`。

### target:on_build_files

#### 自定义编译脚本, 实现多文件构建

通过此接口，可以用来hook指定target内置的构建过程，替换一批同类型源文件编译过程：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_build_files(function (target, sourcebatch, opt)
        opt.origin(target, sourcebatch, opt)
    end)
```

设置此接口后，对应源文件列表中文件，就不会出现在自定义的[target.on_build_file](#targeton_build_file)了，因为这个是包含关系。

其中sourcebatch描述了这批同类型源文件：

* `sourcebatch.sourcekind`: 获取这批源文件的类型，比如：cc, as, ..
* `sourcebatch.sourcefiles()`: 获取源文件列表
* `sourcebatch.objectfiles()`: 获取对象文件列表
* `sourcebatch.dependfiles()`: 获取对应依赖文件列表，存有源文件中编译依赖信息，例如：xxx.d

上面代码中的`opt.origin`存有内置的构建脚本，如果hook后还是想调用内置的构建脚本去编译源文件，那么直接继续调用`opt.origin`就行了。

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

一些target接口描述如下：

| target接口                          | 描述                                                             |
| ----------------------------------- | ---------------------------------------------------------------- |
| target:name()                       | 获取目标名                                                       |
| target:targetfile()                 | 获取目标文件路径                                                 |
| target:get("kind")                  | 获取目标的构建类型                                               |
| target:get("defines")               | 获取目标的宏定义                                                 |
| target:get("xxx")                   | 其他通过 `set_/add_`接口设置的target信息，都可以通过此接口来获取 |
| target:add("links", "pthread")      | 添加目标设置                                                     |
| target:set("links", "pthread", "z") | 覆写目标设置                                                     |
| target:deps()                       | 获取目标的所有依赖目标                                           |
| target:dep("depname")               | 获取指定的依赖目标                                               |
| target:sourcebatches()              | 获取目标的所有源文件列表                                         |

### target:on_package

#### 自定义打包脚本

覆盖target目标的`xmake [p|package}`的打包操作，实现自定义打包过程，如果你想对指定target打包成自己想要的格式，可以通过这个接口自定义它。

这个接口还是挺实用的，例如，编译完jni后，将生成的so，打包进apk包中。

```lua
-- 定义一个android app的测试demo
target("demo")

    -- 生成动态库：libdemo.so
    set_kind("shared")

    -- 设置对象的输出目录，可选
    set_objectdir("$(buildir)/.objs")

    -- 每次编译完的libdemo.so的生成目录，设置为app/libs/armeabi
    set_targetdir("libs/armeabi")

    -- 添加jni的代码文件
    add_files("jni/*.c")

    -- 设置自定义打包脚本，在使用xmake编译完libdemo.so后，执行xmake p进行打包
    -- 会自动使用ant将app编译成apk文件
    --
    on_package(function (target)

        -- 使用ant编译app成apk文件，输出信息重定向到日志文件
        os.run("ant debug")
    end)
```

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

### target:before_link

#### 在链接之前执行一些自定义脚本

这个是在v2.2.7之后新加的接口，用于在链接之前增加一些自定义的操作。

```lua
target("test")
    before_link(function (target)
        print("")
    end)
```

### target:before_build

#### 在构建之前执行一些自定义脚本

并不会覆盖默认的构建操作，只是在构建之前增加一些自定义的操作。

```lua
target("test")
    before_build(function (target)
        print("")
    end)
```

### target:before_build_file

#### 自定义编译前的脚本, 实现单文件构建

通过此接口，可以用来hook指定target内置的构建过程，在每个源文件编译过程之前执行一些自定义脚本：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    before_build_file(function (target, sourcefile, opt)
    end)
```

### target:before_build_files

#### 自定义编译前的脚本, 实现多文件构建

通过此接口，可以用来hook指定target内置的构建过程，在一批同类型源文件编译过程之前执行一些自定义脚本：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    before_build_files(function (target, sourcebatch, opt)
    end)
```

### target:before_clean

#### 在清理之前执行一些自定义脚本

并不会覆盖默认的清理操作，只是在清理之前增加一些自定义的操作。

```lua
target("test")
    before_clean(function (target)
        print("")
    end)
```

### target:before_package

#### 在打包之前执行一些自定义脚本

并不会覆盖默认的打包操作，只是在打包之前增加一些自定义的操作。

```lua
target("test")
    before_package(function (target)
        print("")
    end)
```

### target:before_install

#### 在安装之前执行一些自定义脚本

并不会覆盖默认的安装操作，只是在安装之前增加一些自定义的操作。

```lua
target("test")
    before_install(function (target)
        print("")
    end)
```

### target:before_uninstall

#### 在卸载之前执行一些自定义脚本

并不会覆盖默认的卸载操作，只是在卸载之前增加一些自定义的操作。

```lua
target("test")
    before_uninstall(function (target)
        print("")
    end)
```

### target:before_run

#### 在运行之前执行一些自定义脚本

并不会覆盖默认的运行操作，只是在运行之前增加一些自定义的操作。

```lua
target("test")
    before_run(function (target)
        print("")
    end)
```

### target:after_link

#### 在链接之后执行一些自定义脚本

这个是在v2.2.7之后新加的接口，用于在链接之后增加一些自定义的操作。

```lua
target("test")
    after_link(function (target)
        print("")
    end)
```

### target:after_build

#### 在构建之后执行一些自定义脚本

并不会覆盖默认的构建操作，只是在构建之后增加一些自定义的操作。

例如，对于ios的越狱开发，构建完程序后，需要用`ldid`进行签名操作

```lua
target("test")
    after_build(function (target)
        os.run("ldid -S %s", target:targetfile())
    end)
```

### target:after_build_file

#### 自定义编译前的脚本, 实现单文件构建

通过此接口，可以用来hook指定target内置的构建过程，在每个源文件编译过程之后执行一些自定义脚本：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    after_build_file(function (target, sourcefile, opt)
    end)
```

### target:after_build_files

#### 自定义编译前的脚本, 实现多文件构建

通过此接口，可以用来hook指定target内置的构建过程，在一批同类型源文件编译过程之后执行一些自定义脚本：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    after_build_files(function (target, sourcebatch, opt)
    end)
```

### target:after_clean

#### 在清理之后执行一些自定义脚本

并不会覆盖默认的清理操作，只是在清理之后增加一些自定义的操作。

一般可用于清理编译某target自动生成的一些额外的临时文件，这些文件xmake默认的清理规则可能没有清理到，例如：

```lua
target("test")
    after_clean(function (target)
        os.rm("$(buildir)/otherfiles")
    end)
```

### target:after_package

#### 在打包之后执行一些自定义脚本

并不会覆盖默认的打包操作，只是在打包之后增加一些自定义的操作。

```lua
target("test")
    after_package(function (target)
        print("")
    end)
```

### target:after_install

#### 在安装之后执行一些自定义脚本

并不会覆盖默认的安装操作，只是在安装之后增加一些自定义的操作。

```lua
target("test")
    after_install(function (target)
        print("")
    end)
```
### target:after_uninstall

#### 在卸载之后执行一些自定义脚本

并不会覆盖默认的卸载操作，只是在卸载之后增加一些自定义的操作。

```lua
target("test")
    after_uninstall(function (target)
        print("")
    end)
```

### target:after_run

#### 在运行之后执行一些自定义脚本

并不会覆盖默认的运行操作，只是在运行之后增加一些自定义的操作。

```lua
target("test")
    after_run(function (target)
        print("")
    end)
```

### target:set_pcheader

#### 设置c预编译头文件

xmake支持通过预编译头文件去加速c程序编译，目前支持的编译器有：gcc, clang和msvc。

使用方式如下：

```lua
target("test")
    set_pcheader("header.h")
```

### target:set_pcxxheader

#### 设置c++预编译头文件

xmake支持通过预编译头文件去加速c++程序编译，目前支持的编译器有：gcc, clang和msvc。

使用方式如下：

```lua
target("test")
    set_pcxxheader("header.h")
```

### target:add_deps

#### 添加子工程目标依赖

添加当前目标的依赖目标，编译的时候，会去优先编译依赖的目标，然后再编译当前目标。。。

```lua
target("test1")
    set_kind("static")
    set_files("*.c")

target("test2")
    set_kind("static")
    set_files("*.c")

target("demo")
    add_deps("test1", "test2")
```

上面的例子，在编译目标demo的时候，需要先编译test1, test2目标，因为demo会去用到他们

<p class="tip">
target会自动继承依赖目标中的配置和属性，不需要额外调用`add_links`, `add_linkdirs`和`add_rpathdirs`等接口去关联依赖目标了。
</p>

并且继承关系是支持级联的，例如：

```lua
target("library1")
    set_kind("static")
    add_files("*.c")
    add_includedirs("inc") -- 默认私有头文件目录不会被继承
    add_includedirs("inc1", {public = true}) -- 此处的头文件相关目录也会被继承

target("library2")
    set_kind("static")
    add_deps("library1")
    add_files("*.c")

target("test")
    set_kind("binary")
    add_deps("library2")
```

如果我们不想继承依赖target的任何配置，如何操作呢？

```lua
add_deps("dep1", "dep2", {inherit = false})
```

通过显式设置inherit配置，来告诉xmake，这两个依赖的配置是否需要被继承，如果不设置，默认就是启用继承的。

2.2.5版本之后，可通过 `add_includedirs("inc1", {public = true})`, 设置public为true, 将includedirs的设置公开给其他依赖的子target继承。

目前对于target的编译链接flags相关接口设置，都是支持继承属性的，可以人为控制是否需要导出给其他target来依赖继承，目前支持的属性有：

| 属性      | 描述                                                             |
| ----      | ----                                                             |
| private   | 默认设置，作为当前target的私有配置，不会被依赖的其他target所继承 |
| public    | 公有配置，当前target，依赖的子target都会被设置                   |
| interface | 接口设置，仅被依赖的子target所继承设置，当前target不参与         |

对于这块的详细说明，可以看下：https://github.com/xmake-io/xmake/issues/368

### target:add_links

#### 添加链接库名

为当前目标添加链接库，一般这个要与[add_linkdirs](#targetadd_linkdirs)配对使用。

```lua
target("demo")

    -- 添加对libtest.a的链接，相当于 -ltest
    add_links("test")

    -- 添加链接搜索目录
    add_linkdirs("$(buildir)/lib")
```

### target:add_syslinks

#### 添加系统链接库名

这个接口使用上跟[add_links](#targetadd_links)类似，唯一的区别就是，通过这个接口添加的链接库顺序在所有`add_links`之后。

因此主要用于添加系统库依赖，因为系统库的链接顺序是非常靠后的，例如：

```lua
add_syslinks("pthread", "m", "dl")
target("demo")
    add_links("a", "b")
    add_linkdirs("$(buildir)/lib")
```

上面的配置，即使`add_syslinks`被优先提前设置了，但最后的链接顺序依然是：`-la -lb -lpthread -lm -ldl`

### target:add_files

#### 添加源代码文件

用于添加目标工程的源文件，甚至库文件，目前支持的一些文件类型：

| 支持的源文件类型   | 描述                                    |
| ------------------ | ----------------------------------      |
| .c/.cpp/.cc/.cxx   | c++文件                                 |
| .s/.S/.asm         | 汇编文件                                |
| .m/.mm             | objc文件                                |
| .swift             | swift文件                               |
| .go                | golang文件                              |
| .o/.obj            | 对象文件                                |
| .a/.lib            | 静态库文件，会自动合并库到目标程序      |
| .rc                | msvc的资源文件                          |
| .manifest          | windows manifest 文件                   |
| .def               | windows dll 导出文件                    |
| .ld/.lds           | linker scripts 文件，通常用于 gcc/clang |
| .map/.ver          | version script 文件，通常用于 gcc/clang |

其中通配符`*`表示匹配当前目录下文件，而`**`则匹配多级目录下的文件。

例如：

```lua
add_files("src/test_*.c")
add_files("src/xxx/**.cpp")
add_files("src/asm/*.S", "src/objc/**/hello.m")
```

`add_files`的使用其实是相当灵活方便的，其匹配模式借鉴了premake的风格，但是又对其进行了改善和增强。

使得不仅可以匹配文件，还有可以在添加文件同时，过滤排除指定模式的一批文件。

例如：

```lua
-- 递归添加src下的所有c文件，但是不包括src/impl/下的所有c文件
add_files("src/**.c|impl/*.c")

-- 添加src下的所有cpp文件，但是不包括src/test.cpp、src/hello.cpp以及src下所有带xx_前缀的cpp文件
add_files("src/*.cpp|test.cpp|hello.cpp|xx_*.cpp")
```

其中分隔符`|`之后的都是需要排除的文件，这些文件也同样支持匹配模式，并且可以同时添加多个过滤模式，只要中间用`|`分割就行了。。

添加文件的时候支持过滤一些文件的一个好处就是，可以为后续根据不同开关逻辑添加文件提供基础。

<p class="tip">
为了使得描述上更加的精简，`|`之后的过滤描述都是基于起一个模式：`src/*.cpp` 中`*`之前的目录为基础的。
所以上面的例子后面过滤的都是在src下的文件，这个是要注意的。
</p>

2.1.6版本之后，对`add_files`进行了改进，支持基于files更细粒度的编译选项控制，例如：

```lua
target("test")
    add_defines("TEST1")
    add_files("src/*.c")
    add_files("test/*.c", "test2/test2.c", {defines = "TEST2", languages = "c99", includedirs = ".", cflags = "-O0"})
```

可以在`add_files`的最后一个参数，传入一个配置table，去控制指定files的编译选项，里面的配置参数跟target的一致，并且这些文件还会继承target的通用配置`-DTEST1`。

2.1.9版本之后，支持添加未知的代码文件，通过设置rule自定义规则，实现这些文件的自定义构建，例如：

```lua
target("test")
    -- ...
    add_files("src/test/*.md", {rule = "markdown"})
```

关于自定义构建规则的使用说明，详细见：[构建规则](#构建规则)。

并且在2.1.9版本之后，可以通过force参数来强制禁用cxflags,cflags等编译选项的自动检测，直接传入编译器，哪怕编译器有可能不支持，也会设置：

```lua
add_files("src/*.c", {force = {cxflags = "-DTEST", mflags = "-framework xxx"}})
```

### target:remove_files

#### 从前面的源代码文件列表中删除指定文件

通过此接口，可以从前面[add_files](targetadd_files)接口添加的文件列表中，删除指定的文件，例如：

```lua
target("test")
    add_files("src/*.c")
    remove_files("src/test.c")
```

上面的例子，可以从`src`目录下添加除`test.c`以外的所有文件，当然这个也可以通过`add_files("src/*.c|test.c")`来达到相同的目的，但是这种方式更加灵活。

例如，我们可以条件判断来控制删除哪些文件，并且此接口也支持[add_files](targetadd_files)的匹配模式，过滤模式，进行批量移除。

```lua
target("test")
    add_files("src/**.c")
    remove_files("src/test*.c")
    remove_files("src/subdir/*.c|xxx.c")
    if is_plat("iphoneos") then
        add_files("xxx.m")
    end
```

通过上面的例子，我们可以看出`add_files`和`remove_files`是根据调用顺序，进行顺序添加和删除的，并且通过`remove_files("src/subdir/*.c|xxx.c")`删除一批文件，
并且排除`src/subdir/xxx.c`（就是说，不删除这个文件）。

注： 这个接口 v2.6.3 版本才提供，之前的版本是 del_files，已经废弃。

如果向下要兼容以前的版本，可以通过下面的配置解决。

```lua
remove_files = remove_files or del_files
```

### target:remove_headerfiles

#### 从前面的头文件列表中删除指定文件

主要用于从 `add_headerfiles` 设置的头文件列表中删除文件，用法与 `remove_files` 类似。

这个接口，v2.6.3 版本才提供。

### target:add_linkdirs

#### 添加链接库搜索目录

设置链接库的搜索目录，这个接口的使用方式如下：

```lua
target("test")
    add_linkdirs("$(buildir)/lib")
```

此接口相当于gcc的`-Lxxx`链接选项。

一般他是与[add_links](#targetadd_links)配合使用的，当然也可以直接通过[add_ldflags](#targetadd_ldflags)或者[add_shflags](#targetadd_shflags)接口来添加，也是可以的。

<p class="tip">
如果不想在工程中写死，可以通过：`xmake f --linkdirs=xxx`或者`xmake f --ldflags="-L/xxx"`的方式来设置，当然这种手动设置的目录搜索优先级更高。
</p>

### target:add_rpathdirs

#### 添加程序运行时动态库的加载搜索目录

通过[add_linkdirs](#targetadd_linkdirs)设置动态库的链接搜索目录后，程序被正常链接，但是在linux平台想要正常运行编译后的程序，会报加载动态库失败。

因为没找到动态库的加载目录，想要正常运行依赖动态库的程序，需要设置`LD_LIBRARY_PATH`环境变量，指定需要加载的动态库目录。

但是这种方式是全局的，影响太广，更好的方式是通过`-rpath=xxx`的链接器选项，在链接程序的时候设置好需要加载的动态库搜索路径，而xmake对其进行了封装，通过`add_rpathdirs`更好的处理跨平台问题。

具体使用如下：

```lua
target("test")
    set_kind("binary")
    add_linkdirs("$(buildir)/lib")
    add_rpathdirs("$(buildir)/lib")
```

只需要在链接的时候，在设置下rpath目录就好了，虽然也可以通过`add_ldflags("-Wl,-rpath=xxx")`达到相同的目的，但是这个接口更加通用。

内部会对不同平台进行处理，像在macOS下，是不需要`-rpath`设置的，也是可以正常加载运行程序，因此针对这个平台，xmake内部会直接忽略器设置，避免链接报错。

而在为dlang程序进行动态库链接时，xmake会自动处理成`-L-rpath=xxx`来传入dlang的链接器，这样就避免了直接使用`add_ldflags`需要自己判断和处理不同平台和编译器问题。

2.1.7版本对这个接口进行了改进，支持：`@loader_path`, `@executable_path` 和 `$ORIGIN`的内置变量，来指定程序的加载目录，它们的效果基本上是一样的，主要是为了同时兼容macho, elf。

例如：

```lua
target("test")
    set_kind("binary")
    add_linkdirs("$(buildir)/lib")
    add_rpathdirs("@loader_path/lib")
```

指定test程序加载当前执行目录下`lib/*.[so|dylib]`的动态库文件，这将有助于提升程序的可移植性，不用写死绝对路径和相对路径，导致程序和目录切换引起程序加载动态库失败。

<p class="tip">
需要注意的是，在macos下，要想add_rpathdirs设置生效，需要对dylib做一些预处理，添加`@rpath/xxx`路径设置：
`$install_name_tool -add_rpath @rpath/libxxx.dylib xxx/libxxx.dylib`
我们也可以通过`otool -L libxxx.dylib`查看是否存在带@rpath的路径
</p>

### target:add_includedirs

#### 添加头文件搜索目录

设置头文件的搜索目录，这个接口的使用方式如下：

```lua
target("test")
    add_includedirs("$(buildir)/include")
```

当然也可以直接通过[add_cxflags](#targetadd_cxflags)或者[add_mxflags](#targetadd_mxflags)等接口来设置，也是可以的。

2.2.5之后，可通过额外的`{public|interface = true}`属性设置，将includedirs导出给依赖的子target，例如：

```lua
target("test")
    set_kind("static")
    add_includedirs("src/include") -- 仅对当前target生效
    add_includedirs("$(buildir)/include", {public = true})，当前target和子target都会被设置

target("demo")
    set_kind("binary")
    add_deps("test")
```

更多关于这块的说明，见：[add_deps](#targetadd_deps)

!> 如果不想在工程中写死，可以通过：`xmake f --includedirs=xxx`或者`xmake f --cxflags="-I/xxx"`的方式来设置，当然这种手动设置的目录搜索优先级更高。

!> 头文件默认不支持模式匹配，也不推荐这么做， 容易引入一些不需要的子目录，导致各种头文件引用冲突干扰，出了问题更难查。
如果用户非要这么做，可以通过 `add_includedirs(os.dirs(path.join(os.scriptdir(), "xxx/**")))` 来实现。

### target:add_sysincludedirs

#### 添加系统头文件搜索目录

`add_includedirs` 通常用于添加工程头文件搜索目录，而一些系统库头文件的引入，有可能会触发一些内部的警告信息，但是这些警告对于用户来讲也许是无法避免，也修复不了的。

那么，每次显示这些警告反而会干扰用户，因此，gcc/clang 提供了 `-isystem` 专门用来设置系统头文件搜索路径，通过此接口设置的头文件，会压制一些警告信息来避免干扰用户。

msvc 也通提供了 `/external:I` 编译选项来设置它，但是需要高版本 msvc 才支持。

因此，xmake 提供了 `add_sysincludedirs` 来抽象适配设置系统库头文件搜索路径，如果当前编译器不支持，会自动切换回 `-I` 编译选项。


```lua
target("test")
    add_sysincludedirs("/usr/include")
```

生成的编译选项如下：

```console
-isystem /usr/include
```

如果是 msvc 编译器，则会是：

```console
/experimental:external /external:W0 /external:I /usr/include
```

!> 另外，使用 `add_requires()` 引入的依赖包，默认也会使用 `-isystem` 作为外部系统头文件。

### target:add_defines

#### 添加宏定义

```lua
add_defines("DEBUG", "TEST=0", "TEST2=\"hello\"")
```

相当于设置了编译选项：

```
-DDEBUG -DTEST=0 -DTEST2=\"hello\"
```

### target:add_undefines

#### 取消宏定义

```lua
add_undefines("DEBUG")
```

相当于设置了编译选项：`-UDEBUG`

在代码中相当于：`#undef DEBUG`

### target:add_cflags

#### 添加c编译选项

仅对c代码添加编译选项

```lua
add_cflags("-g", "-O2", "-DDEBUG")
```

<p class="warn">
所有选项值都基于gcc的定义为标准，如果其他编译器不兼容（例如：vc），xmake会自动内部将其转换成对应编译器支持的选项值。
用户无需操心其兼容性，如果其他编译器没有对应的匹配值，那么xmake会自动忽略器设置。
</p>


在2.1.9版本之后，可以通过force参数来强制禁用flags的自动检测，直接传入编译器，哪怕编译器有可能不支持，也会设置：

```lua
add_cflags("-g", "-O2", {force = true})
```

### target:add_cxflags

#### 添加c/c++编译选项

同时对c/c++代码添加编译选项

### target:add_cxxflags

#### 添加c++编译选项

仅对c++代码添加编译选项

### target:add_mflags

#### 添加objc编译选项

仅对objc代码添加编译选项

```lua
add_mflags("-g", "-O2", "-DDEBUG")
```

在2.1.9版本之后，可以通过force参数来强制禁用flags的自动检测，直接传入编译器，哪怕编译器有可能不支持，也会设置：

```lua
add_mflags("-g", "-O2", {force = true})
```

### target:add_mxflags

#### 添加objc/objc++编译选项

同时对objc/objc++代码添加编译选项

```lua
add_mxflags("-framework CoreFoundation")
```

### target:add_mxxflags

#### 添加objc++编译选项

仅对objc++代码添加编译选项

```lua
add_mxxflags("-framework CoreFoundation")
```

### target:add_scflags

#### 添加swift编译选项

对swift代码添加编译选项

```lua
add_scflags("xxx")
```

### target:add_asflags

#### 添加汇编编译选项

对汇编代码添加编译选项

```lua
add_asflags("xxx")
```

### target:add_gcflags

#### 添加go编译选项

对golang代码添加编译选项

```lua
add_gcflags("xxx")
```

### target:add_dcflags

#### 添加dlang编译选项

对dlang代码添加编译选项

```lua
add_dcflags("xxx")
```

### target:add_rcflags

#### 添加rust编译选项

对rust代码添加编译选项

```lua
add_rcflags("xxx")
```

### target:add_fcflags

#### 添加fortran编译选项

对fortran代码添加编译选项

```lua
add_fcflags("xxx")
```

### target:add_zcflags

#### 添加zig编译选项

对zig代码添加编译选项

```lua
add_zcflags("xxx")
```

### target:add_cuflags

#### 添加cuda编译选项

对cuda代码添加编译选项

```lua
add_cuflags("-gencode arch=compute_30,code=sm_30")
```

### target:add_culdflags

#### 添加cuda设备链接选项

v2.2.7之后，cuda默认构建会使用device-link，这个阶段如果要设置一些链接flags，则可以通过这个接口来设置。
而最终的程序链接，会使用ldflags，不会调用nvcc，直接通过gcc/clang等c/c++链接器来链接。

关于device-link的说明，可以参考：https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/

```lua
add_culdflags("-gencode arch=compute_30,code=sm_30")
```

### target:add_cugencodes

#### 添加cuda设备的gencode设置

`add_cugencodes()`接口其实就是对`add_cuflags("-gencode arch=compute_xx,code=compute_xx")`编译flags设置的简化封装，其内部参数值对应的实际flags映射关系如下：

```lua
- compute_xx                   --> `-gencode arch=compute_xx,code=compute_xx`
- sm_xx                        --> `-gencode arch=compute_xx,code=sm_xx`
- sm_xx,sm_yy                  --> `-gencode arch=compute_xx,code=[sm_xx,sm_yy]`
- compute_xx,sm_yy             --> `-gencode arch=compute_xx,code=sm_yy`
- compute_xx,sm_yy,sm_zz       --> `-gencode arch=compute_xx,code=[sm_yy,sm_zz]`
- native                       --> match the fastest cuda device on current host,
                                   eg. for a Tesla P100, `-gencode arch=compute_60,code=sm_60` will be added,
                                   if no available device is found, no `-gencode` flags will be added
```

例如：

```lua
add_cugencodes("sm_30")
```

就等价为

```lua
add_cuflags("-gencode arch=compute_30,code=sm_30")
add_culdflags("-gencode arch=compute_30,code=sm_30")
```

是不是上面的更加精简些，这其实就是个用于简化设置的辅助接口。

而如果我们设置了native值，那么xmake会自动探测当前主机的cuda设备，然后快速匹配到它对应的gencode设置，自动追加到整个构建过程中。

例如，如果我们主机目前的GPU是Tesla P100，并且能够被xmake自动检测到，那么下面的设置：

```lua
add_cugencodes("native")
```

等价于：


```lua
add_cugencodes("sm_60")
```

### target:add_ldflags

#### 添加链接选项

添加静态链接选项

```lua
add_ldflags("-L/xxx", "-lxxx")
```

### target:add_arflags

#### 添加静态库归档选项

影响对静态库的生成

```lua
add_arflags("xxx")
```
### target:add_shflags

#### 添加动态库链接选项

影响对动态库的生成

```lua
add_shflags("xxx")
```

### target:add_options

#### 添加关联选项

这个接口跟[set_options](#targetset_options)类似，唯一的区别就是，此处是追加选项，而[set_options](#targetset_options)每次设置会覆盖先前的设置。

### target:add_packages

#### 添加包依赖

在target作用域中，添加集成包依赖，例如：

```lua
target("test")
    add_packages("zlib", "polarssl", "pcre", "mysql")
```

这样，在编译test目标时，如果这个包存在的，将会自动追加包里面的宏定义、头文件搜索路径、链接库目录，也会自动链接包中所有库。

用户不再需要自己单独调用[add_links](#targetadd_links)，[add_includedirs](#targetadd_includedirs), [add_ldflags](#targetadd_ldflags)等接口，来配置依赖库链接了。

对于如何设置包搜索目录，可参考：[add_packagedirs](/zh-cn/manual/global_interfaces?id=add_packagedirs) 接口

而在v2.2.2版本之后，此接口也同时支持远程依赖包管理中[add_requires](/zh-cn/manual/global_interfaces?id=add_requires)定义的包。

```lua
add_requires("zlib", "polarssl")
target("test")
    add_packages("zlib", "polarssl")
```

v2.2.3之后，还支持覆写内置的links，控制实际链接的库：


```lua
-- 默认会有 ncurses, panel, form等links
add_requires("ncurses")

target("test")

    -- 显示指定，只使用ncurses一个链接库
    add_packages("ncurses", {links = "ncurses"})
```

或者干脆禁用links，只使用头文件：

```lua
add_requires("lua")
target("test")
    add_packages("lua", {links = {}})
```

### target:add_languages

#### 添加语言标准

与[set_languages](#targetset_languages)类似，唯一区别是这个接口不会覆盖掉之前的设置，而是追加设置。

### target:add_vectorexts

#### 添加向量扩展指令

添加扩展指令优化选项，目前支持以下几种扩展指令集：

```lua
add_vectorexts("mmx")
add_vectorexts("neon")
add_vectorexts("avx", "avx2")
add_vectorexts("sse", "sse2", "sse3", "ssse3")
```

<p class="tip">
如果当前设置的指令集编译器不支持，xmake会自动忽略掉，所以不需要用户手动去判断维护，只需要将你需要的指令集全部设置上就行了。
</p>

### target:add_frameworks

#### 添加链接框架

目前主要用于`ios`和`macosx`平台的`objc`和`swift`程序，例如：

```lua
target("test")
    add_frameworks("Foundation", "CoreFoundation")
```

当然也可以使用[add_mxflags](#targetadd_mxflags)和[add_ldflags](#targetadd_ldflags)来设置，不过比较繁琐，不建议这样设置。

```lua
target("test")
    add_mxflags("-framework Foundation", "-framework CoreFoundation")
    add_ldflags("-framework Foundation", "-framework CoreFoundation")
```

如果不是这两个平台，这些设置将会被忽略。

### target:add_frameworkdirs

#### 添加链接框架搜索目录

对于一些第三方framework，那么仅仅通过[add_frameworks](#targetadd_frameworks)是没法找到的，还需要通过这个接口来添加搜索目录。

```lua
target("test")
    add_frameworks("MyFramework")
    add_frameworkdirs("/tmp/frameworkdir", "/tmp/frameworkdir2")
```

### target:set_toolset

#### 设置工具集

针对特定target单独设置切换某个编译器，链接器，不过我们更推荐使用[set_toolchains](#targetset_toolchains)对某个target进行整体工具链的切换。

与set_toolchains相比，此接口只切换工具链某个特定的编译器或者链接器。

!> 2.3.4以上版本才支持此接口，2.3.4之前的set_toolchain/set_tool接口会逐步弃用，采用此新接口，用法相同。

对于`add_files("*.c")`添加的源码文件，默认都是会调用系统最匹配的编译工具去编译，或者通过`xmake f --cc=clang`命令手动去修改，不过这些都是全局影响所有target目标的。

如果有些特殊需求，需要对当前工程下某个特定的target目标单独指定不同的编译器、链接器或者特定版本的编译器，这个时候此接口就可以排上用途了，例如：

```lua
target("test1")
    add_files("*.c")

target("test2")
    add_files("*.c")
    set_toolset("cc", "$(projectdir)/tools/bin/clang-5.0")
```

上述描述仅对test2目标的编译器进行特殊设置，使用特定的clang-5.0编译器来编译test2，而test1还是使用默认设置。

<p class="tip">
每次设置都会覆盖当前target目标下之前的那次设置，不同target之间不会被覆盖，互相独立，如果在根域设置，会影响所有子target。
</p>

前一个参数是key，用于指定工具类型，目前支持的有（编译器、链接器、归档器）：

| 工具类型     | 描述                                 |
| ------------ | ------------------------------------ |
| cc           | c编译器                              |
| cxx          | c++编译器                            |
| mm           | objc编译器                           |
| mxx          | objc++编译器                         |
| gc           | go编译器                             |
| as           | 汇编器                               |
| sc           | swift编译器                          |
| rc           | rust编译器                           |
| dc           | dlang编译器                          |
| fc           | fortran编译器                        |
| sc           | swift编译器                          |
| rust         | rust编译器                           |
| strip        | strip程序                            |
| ld           | c/c++/asm/objc等通用可执行程序链接器 |
| sh           | c/c++/asm/objc等通用动态库链接器     |
| ar           | c/c++/asm/objc等通用静态库归档器     |
| dcld         | dlang可执行链接器, rcld/gcld等类似   |
| dcsh         | dlang动态库链接器, rcsh/gcsh等类似   |

对于一些编译器文件名不规则，导致xmake无法正常识别处理为已知的编译器名的情况下，我们也可以加一个工具名提示，例如：

```lua
set_toolset("cc", "gcc@$(projectdir)/tools/bin/mipscc.exe")
```

上述描述设置mipscc.exe作为c编译器，并且提示xmake作为gcc的传参处理方式进行编译。

### target:set_toolchains

#### 设置工具链

这对某个特定的target单独切换设置不同的工具链，和set_toolset不同的是，此接口是对完整工具链的整体切换，比如cc/ld/sh等一系列工具集。

这也是推荐做法，因为像gcc/clang等大部分编译工具链，编译器和链接器都是配套使用的，要切就得整体切，单独零散的切换设置会很繁琐。

比如我们切换test目标到clang+yasm两个工具链：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("clang", "yasm")
```

只需要指定工具链名字即可，具体xmake支持哪些工具链，可以通过下面的命令查看：

```bash
$ xmake show -l toolchains
xcode         Xcode IDE
vs            VisualStudio IDE
yasm          The Yasm Modular Assembler
clang         A C language family frontend for LLVM
go            Go Programming Language Compiler
dlang         D Programming Language Compiler
sdcc          Small Device C Compiler
cuda          CUDA Toolkit
ndk           Android NDK
rust          Rust Programming Language Compiler
llvm          A collection of modular and reusable compiler and toolchain technologies
cross         Common cross compilation toolchain
nasm          NASM Assembler
gcc           GNU Compiler Collection
mingw         Minimalist GNU for Windows
gnu-rm        GNU Arm Embedded Toolchain
envs          Environment variables toolchain
fasm          Flat Assembler
```

当然，我们也可以通过命令行全局切换到其他工具链：

```bash
$ xmake f --toolchain=clang
$ xmake
```

另外，我们也可以在xmake.lua中自定义toolchain，然后通过`set_toolchains`指定进去，例如：

```lua
toolchain("myclang")
    set_kind("standalone")
    set_toolset("cc", "clang")
    set_toolset("cxx", "clang", "clang++")
    set_toolset("ld", "clang++", "clang")
    set_toolset("sh", "clang++", "clang")
    set_toolset("ar", "ar")
    set_toolset("ex", "ar")
    set_toolset("strip", "strip")
    set_toolset("mm", "clang")
    set_toolset("mxx", "clang", "clang++")
    set_toolset("as", "clang")

    -- ...
```

关于这块的详情介绍，可以到[自定义工具链](/zh-cn/manual/custom_toolchain)章节查看

更多详情见：[#780](https://github.com/xmake-io/xmake/issues/780)

2.3.5版本开始，新增对toolchains平台和架构的单独设置和切换，比如：

```lua
target("test")
    set_toolchains("xcode", {plat = os.host(), arch = os.arch()})
```

如果当前是在交叉编译模式，那么这个test还是会强制切到xcode的本地编译工具链和对应的pc平台上去，这对于想要同时支持部分target使用主机工具链，部分target使用交叉编译工具链时候，非常有用。

但是，这还不是特别方便，尤其是跨平台编译时候，不同平台的pc工具链都是不同的，有msvc, xcode, clang等，还需要判断平台来指定。

因此，我们可以直接使用[set_plat](#targetset_plat)和[set_arch](#targetset_arch)接口，直接设置特定target到主机平台，就可以内部自动选择host工具链了，例如：

```lua
target("test")
    set_plat(os.host())
    set_arch(os.arch())
```

这块的应用场景和example可以看下：https://github.com/xmake-io/xmake-repo/blob/dev/packages/l/luajit/port/xmake.lua

luajit里面就需要同时编译host平台的minilua/buildvm来生成jit相关代码，然后开始针对性编译luajit自身到不同的交叉工具链。

关于这块详情，可以参考：https://github.com/xmake-io/xmake/pull/857

v2.5.1 对 set_toolchains 做了进一步的改进，更好地对特定 target 支持独立工具链切换，比如不同 target 支持切换到不同的 vs 版本，例如：

```lua
target("test")
    set_toolchains("msvc", {vs = "2015"})
```

默认 xmake 会使用全局 vs 工具链，比如当前检测到 vs2019，但是用户同时还安装了 vs2015，那么可以通过上面的配置将 test 目标切换到 vs2015 来编译。

甚至还可以配合 `set_arch` 来指定特定的架构到 x86，而不是默认的 x64。

```lua
target("test")
    set_arch("x86")
    set_toolchains("msvc", {vs = "2015"})
```

上面的效果跟 `set_toolchains("msvc", {vs = "2015", arch = "x86"})` 类似，不过 `set_arch` 是针对 target 粒度的，而 `set_toolchains` 里面的 arch 设置仅仅针对特定工具链粒度。

通常，我们更推荐使用 `set_arch` 来对整个target实现架构切换。

### target:set_plat

#### 设置指定目标的编译平台

通常配合[set_arch](#target_setarch)使用，将指定target的编译平台切换到指定平台，xmake会自动根据切换的平台，选择合适的工具链。

一般用于需要同时编译host平台目标、交叉编译目标的场景，更多详情见：[set_toolchains](#target_settoolchains)

例如：

```console
$ xmake f -p android --ndk=/xxx
```

即使正在使用android ndk编译android平台目标，但是其依赖的host目标，还是会切换到主机平台，使用xcode, msvc等host工具链来编译。

```lua
target("host")
    set_kind("binary")
    set_plat(os.host())
    set_arch(os.arch())
    add_files("src/host/*.c")

target("test")
    set_kind("binary")
    add_deps("host")
    add_files("src/test/*.c")
```

### target:set_arch

#### 设置指定目标的编译架构

详情见：[set_plat](#targetset_plat)

### target:set_values

#### 设置一些扩展配置值

给target设置一些扩展的配置值，这些配置没有像`set_ldflags`这种内置的api可用，通过第一个参数传入一个配置名，来扩展配置。
一般用于传入配置参数给自定义rule中的脚本使用，例如：

```lua
rule("markdown")
    on_build_file(function (target, sourcefile, opt)
        -- compile .markdown with flags
        local flags = target:values("markdown.flags")
        if flags then
            -- ..
        end
    end)

target("test")
    add_files("src/*.md", {rule = "markdown"})
    set_values("markdown.flags", "xxx", "xxx")
```

上述代码例子中，可以看出，在target应用markdown规则的时候，通过set_values去设置一些flags值，提供给markdown规则去处理。
在规则脚本中可以通过`target:values("markdown.flags")`获取到target中设置的扩展flags值。

<p class="tip">
具体扩展配置名，根据不同的rule，会有所不同，目前有哪些，可以参考相关规则的描述：[内建规则](#内建规则)
</p>

下面是一些 xmake 目前支持的一些内置的扩展配置项列表。

| 扩展配置名              | 配置描述                              |
| ---                     | ---                                   |
| fortran.moduledir       | 设置 fortran 模块的输出目录           |
| ndk.arm_mode            | 设置 ndk 的 arm 编译模式（arm/thumb） |
| objc.build.arc          | 设置启用或禁用 objc 的 arc            |
| objc++.build.arc        | 设置启用或禁用 objc++ 的 arc          |
| xcode.bundle_identifier | 设置 xcode 工具链的 Bundle Identifier |
| xcode.mobile_provision  | 设置 xcode 工具链的证书信息           |
| xcode.codesign_identity | 设置 xcode 工具链的代码签名标识       |
| cuda.build.devlink      | 设置启用或禁用 cuda 的设备链接        |
| wdk.env.winver          | 设置 wdk 的 win 支持版本              |
| wdk.umdf.sdkver         | 设置 wdk 的 umdf sdk 版本             |
| wdk.kmdf.sdkver         | 设置 wdk 的 kmdf sdk 版本             |
| wdk.sign.mode           | 设置 wdk 的代码签名模式               |
| wdk.sign.store          | 设置 wdk 的代码签名 store             |
| wdk.sign.certfile       | 设置 wdk 的代码签名证书文件           |
| wdk.sign.thumbprint     | 设置 wdk 的代码签名指纹               |

### target:add_values

#### 添加一些扩展配置值

用法跟[target:set_values](#targetset_values)类似，区别就是这个接口是追加设置，而不会每次覆盖设置。

### target:set_rundir

#### 设置运行目录

此接口用于设置默认运行target程序的当前运行目录，如果不设置，默认情况下，target是在可执行文件所在目录加载运行。

如果用户想要修改加载目录，一种是通过`on_run()`的方式自定义运行逻辑，里面去做切换，但仅仅为了切个目录就这么做，太过繁琐。

因此可以通过这个接口快速的对默认执行的目录环境做设置切换。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_rundir("$(projectdir)/xxx")
```

### target:add_runenvs

#### 添加运行环境变量

此接口用于添加设置默认运行target程序的环境变量，跟[set_runenv](#targetset_runenv)不同的是，此接口是对已有系统env中的值进行追加，并不会覆盖。

所以，对于PATH这种，通过此接口追加值是非常方便的，而且此接口支持多值设置，所以通常就是用来设置带有path sep的多值env。。

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_runenvs("PATH", "/tmp/bin", "xxx/bin")
    add_runenvs("LD_LIBRARY_PATH", "/tmp/lib", "xxx/lib")
```

### target:set_runenv

#### 设置运行环境变量

此接口跟[add_runenvs](#targetadd_runenvs)不同的是，`set_runenv`是对某个环境变量的覆盖设置，会覆盖原有系统环境的env值，并且此接口是单数设置，不能传递多参。

所以，如果要覆盖设置PATH这中多路径的env，需要自己去拼接：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_runenv("PATH", path.joinenv("/tmp/bin", "xxx/bin"))
    set_runenv("NAME", "value")
```

### target:set_installdir

#### 设置安装目录

2.2.5版本新增接口，用于针对每个target设置不同的默认安装目录，一般用于`xmake install/uninstall`命令。

默认情况下执行`xmake install`会安装到系统`/usr/local`目录，我们除了可以通过`xmake install -o /usr/local`指定其他安装目录外，
还可以在xmake.lua中针对target设置不同的安装目录来替代默认目录。

除了上述两种方式，我们也可以通过`INSTALLDIR`和`DESTDIR`环境变量设置默认的安装目录。

### target:add_installfiles

#### 添加安装文件

2.2.5版本新增接口，用于针对每个target设置对应需要安装的文件，一般用于`xmake install/uninstall`命令。

比如我们可以指定安装各种类型的文件到安装目录：

```lua
target("test")
    add_installfiles("src/*.h")
    add_installfiles("doc/*.md")
```

默认在linux等系统上，我们会安装到`/usr/local/*.h, /usr/local/*.md`，不过我们也可以指定安装到特定子目录：

```lua
target("test")
    add_installfiles("src/*.h", {prefixdir = "include"})
    add_installfiles("doc/*.md", {prefixdir = "share/doc"})
```

上面的设置，我们会安装到`/usr/local/include/*.h, /usr/local/share/doc/*.md`

注：默认安装不会保留目录结构，会完全展开，当然我们也可以通过`()`去提取源文件中的子目录结构来安装，例如：

```lua
target("test")
    add_installfiles("src/(tbox/*.h)", {prefixdir = "include"})
    add_installfiles("doc/(tbox/*.md)", {prefixdir = "share/doc"})
```

我们把`src/tbox/*.h`中的文件，提取`tbox/*.h`子目录结构后，在进行安装：`/usr/local/include/tbox/*.h, /usr/local/share/doc/tbox/*.md`

当然，用户也可以通过[set_installdir](#targetset_installdir)接口，来配合使用。

关于此接口的详细说明，见：https://github.com/xmake-io/xmake/issues/318

### target:add_headerfiles

#### 添加安装头文件

2.2.5版本新增接口，用于针对每个target设置对应需要安装的头文件，一般用于`xmake install/uninstall`命令。

此接口使用方式跟[add_installfiles](#targetadd_installfiles)接口几乎完全一样，都可以用来添加安装文件，不过此接口仅用于安装头文件。
因此，使用上比`add_installfiles`简化了不少，默认不设置prefixdir，也会自动将头文件安装到对应的`include`子目录中。

并且此接口对于`xmake project -k vs201x`等插件生成的IDE文件，也会添加对应的头文件进去。

我注：默认安装不会保留目录结构，会完全展开，当然们也可以通过`()`去提取源文件中的子目录结构来安装，例如：

```lua
target("test")
    add_headerfiles("src/(tbox/*.h)", {prefixdir = "include"})
```

### target:set_configdir

#### 设置模板配置文件的输出目录

2.2.5版本新增接口，主要用于[add_configfiles](#targetadd_configfiles)接口设置的模板配置文件的输出目录。

### target:set_configvar

#### 设置模板配置变量

2.2.5版本新增接口，用于在编译前，添加一些需要预处理的模板配置变量，一般用于[add_configfiles](#targetadd_configfiles)接口。

```lua
target("test")
    set_kind("binary")
    add_files("main.c")
    set_configvar("HAS_FOO", 1)
    set_configvar("HAS_BAR", "bar")
    set_configvar("HAS_ZOO", "zoo", {quote = false})
    add_configfiles("config.h.in")
```

config.h.in

```c
${define HAS_FOO}
${define HAS_BAR}
${define HAS_ZOO}
```

生成的 config.h 内容如下：

```c
#define HAS_FOO 1
#define HAS_BAR "bar"
#define HAS_ZOO zoo
```

set_configvar 可以设置 number，string 和 boolean 类型值，如果是 string 值，默认生成的宏定义带有引号，如果要去掉引号，可以设置 `{quote = false}`。

相关 issues 见：[#1694](https://github.com/xmake-io/xmake/issues/1694)

对于，宏定义里面有路径，需要转义处理路径分隔符的，我们也可以配置开启路径字符转义。

```lua
set_configvar("TEST", "C:\\hello", {escape = true})
```

它会自动转义成 `#define TEST "C:\\hello"` ，如果没开启转义，则会变成：`#define TEST "C:\hello"`

相关 issues 见：[#1872](https://github.com/xmake-io/xmake/issues/1872)

### target:add_configfiles

#### 添加模板配置文件

2.2.5版本新增接口，用于在编译前，添加一些需要预处理的配置文件。

先来一个简单的例子：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_configdir("$(buildir)/config")
    add_configfiles("src/config.h.in")
```

上面的设置，会在编译前，自动的将`config.h.in`这个头文件配置模板，经过预处理后，生成输出到指定的`build/config/config.h`。

如果`set_configdir`不设置，那么默认输出到`build`目录下。

其中`.in`后缀会被自动识别处理掉，如果想要输出存储为其他文件名，可以通过：

```lua
add_configfiles("src/config.h", {filename = "myconfig.h"})
```

的方式，来重命名输出，同样，这个接口跟[add_installfiles](#targetadd_configfiles)类似，也是支持prefixdir和子目录提取设置：

```lua
add_configfiles("src/*.h.in", {prefixdir = "subdir"})
add_configfiles("src/(tbox/config.h)")
```

##### 变量替换

这个接口的一个最重要的特性就是，可以在预处理的时候，对里面的一些模板变量进行预处理替换，例如：

config.h.in

```
#define VAR1 "${VAR1}"
#define VAR2 "${VAR2}"
#define HELLO "${HELLO}"
```

```lua
set_configvar("VAR1", "1")

target("test")
    set_kind("binary")
    add_files("main.c")

    set_configvar("VAR2", 2)
    add_configfiles("config.h.in", {variables = {hello = "xmake"}})
    add_configfiles("*.man", {onlycopy = true})
```

通过[set_configvar](#targetset_configvar)接口设置模板变量，裹着通过`{variables = {xxx = ""}}`中设置的变量进行替换处理。

预处理后的文件`config.h`内容为：

```
#define VAR1 "1"
#define VAR2 "2"
#define HELLO "xmake"
```

而`{onlycopy = true}`设置，会强制将`*.man`作为普通文件处理，仅在预处理阶段copy文件，不进行变量替换。

默认的模板变量匹配模式为`${var}`，当然我们也可以设置其他的匹配模式，例如，改为`@var@`匹配规则：

```lua
target("test")
    add_configfiles("config.h.in", {pattern = "@(.-)@"})
```

##### 内置变量

我们也有提供了一些内置的变量，即使不通过此接口设置，也是可以进行默认变量替换的：

```
${VERSION} -> 1.6.3
${VERSION_MAJOR} -> 1
${VERSION_MINOR} -> 6
${VERSION_ALTER} -> 3
${VERSION_BUILD} -> set_version("1.6.3", {build = "%Y%m%d%H%M"}) -> 201902031421
${PLAT} and ${plat} -> MACOS and macosx
${ARCH} and ${arch} -> ARM and arm
${MODE} and ${mode} -> DEBUG/RELEASE and debug/release
${DEBUG} and ${debug} -> 1 or 0
${OS} and ${os} -> IOS or ios
```

例如：

config.h.in

```c
#define CONFIG_VERSION "${VERSION}"
#define CONFIG_VERSION_MAJOR ${VERSION_MAJOR}
#define CONFIG_VERSION_MINOR ${VERSION_MINOR}
#define CONFIG_VERSION_ALTER ${VERSION_ALTER}
#define CONFIG_VERSION_BUILD ${VERSION_BUILD}
```

config.h

```c
#define CONFIG_VERSION "1.6.3"
#define CONFIG_VERSION_MAJOR 1
#define CONFIG_VERSION_MINOR 6
#define CONFIG_VERSION_ALTER 3
#define CONFIG_VERSION_BUILD 201902031401
```

v2.5.3 后新增 git 相关内置变量：

```c
#define GIT_COMMIT      "${GIT_COMMIT}"
#define GIT_COMMIT_LONG "${GIT_COMMIT_LONG}"
#define GIT_COMMIT_DATE "${GIT_COMMIT_DATE}"
#define GIT_BRANCH      "${GIT_BRANCH}"
#define GIT_TAG         "${GIT_TAG}"
#define GIT_TAG_LONG    "${GIT_TAG_LONG}"
#define GIT_CUSTOM      "${GIT_TAG}-${GIT_COMMIT}"
```

```c
#define GIT_COMMIT      "8c42b2c2"
#define GIT_COMMIT_LONG "8c42b2c251793861eb85ffdf7e7c2307b129c7ae"
#define GIT_COMMIT_DATE "20210121225744"
#define GIT_BRANCH      "dev"
#define GIT_TAG         "v1.6.6"
#define GIT_TAG_LONG    "v1.6.6-0-g8c42b2c2"
#define GIT_CUSTOM      "v1.6.6-8c42b2c2"
```

##### 宏定义

我们还可以对`#define`定义进行一些变量状态控制处理：

config.h.in

```c
${define FOO_ENABLE}
```

```lua
set_configvar("FOO_ENABLE", 1) -- or pass true
set_configvar("FOO_STRING", "foo")
```

通过上面的变量设置后，`${define xxx}`就会替换成：

```c
#define FOO_ENABLE 1
#define FOO_STRING "foo"
```

或者（设置为0禁用的时候）

```c
/* #undef FOO_ENABLE */
/* #undef FOO_STRING */
```

这种方式，对于一些自动检测生成config.h非常有用，比如配合option来做自动检测：

```lua
option("foo")
    set_default(true)
    set_description("Enable Foo")
    set_configvar("FOO_ENABLE", 1) -- 或者传递true，启用FOO_ENABLE变量
    set_configvar("FOO_STRING", "foo")

target("test")
    add_configfiles("config.h.in")

    -- 如果启用foo选项 -> 添加 FOO_ENABLE 和 FOO_STRING 定义
    add_options("foo")
```

config.h.in

```c
${define FOO_ENABLE}
${define FOO_STRING}
```

config.h

```c
#define FOO_ENABLE 1
#define FOO_STRING "foo"
```

关于option选项检测，以及config.h的自动生成，有一些辅助函数，可以看下：https://github.com/xmake-io/xmake/issues/342

除了`#define`，如果想要对其他非`#define xxx`也做状态切换处理，可以使用 `${default xxx 0}` 模式，设置默认值，例如：

```
HAVE_SSE2 equ ${default VAR_HAVE_SSE2 0}
```

通过`set_configvar("HAVE_SSE2", 1)`启用变量后，变为`HAVE_SSE2 equ 1`，如果没有设置变量，则使用默认值：`HAVE_SSE2 equ 0`

关于这个的详细说明，见：https://github.com/xmake-io/xmake/issues/320

### target:set_policy

#### 设置构建行为策略

xmake有很多的默认行为，比如：自动检测和映射flags、跨target并行构建等，虽然提供了一定的智能化处理，但重口难调，不一定满足所有的用户的使用习惯和需求。

因此，从v2.3.4开始，xmake提供默认构建策略的修改设置，开放给用户一定程度上的可配置性。

使用方式如下：

```lua
set_policy("check.auto_ignore_flags", false)
```

只需要在项目根域设置这个配置，就可以禁用flags的自动检测和忽略机制，另外`set_policy`也可以针对某个特定的target局部生效。

```lua
target("test")
    set_policy("check.auto_ignore_flags", false)
```

!> 另外，如果设置的策略名是无效的，xmake也会有警告提示。

目前支持的一些策略配置如下：

| 策略配置名                                                           | 描述                                 | 默认值   | 支持版本 |
| -----------------------------------                                  | ------------------------------------ | -------- | -------- |
| [check.auto_ignore_flags](#checkauto_ignore_flags)                   | 自动检测和忽略flags                  | true     | >= 2.3.4 |
| [check.auto_map_flags](#checkauto_map_flags)                         | 自动映射flags                        | true     | >= 2.3.4 |
| [build.across_targets_in_parallel](#buildacross_targets_in_parallel) | 跨target间并行构建                   | true     | >= 2.3.4 |

如果要获取当前xmake支持的所有策略配置列表和描述，可以执行下面的命令：

```bash
$ xmake l core.project.policy.policies
{
  "check.auto_map_flags" = {
    type = "boolean",
    description = "Enable map gcc flags to the current compiler and linker automatically.",
    default = true
  },
  "build.across_targets_in_parallel" = {
    type = "boolean",
    description = "Enable compile the source files for each target in parallel.",
    default = true
  },
  "check.auto_ignore_flags" = {
    type = "boolean",
    description = "Enable check and ignore unsupported flags automatically.",
    default = true
  }
}
```

##### check.auto_ignore_flags

xmake默认会对所有`add_cxflags`, `add_ldflags`接口设置的原始flags进行自动检测，如果检测当前编译器和链接器不支持它们，就会自动忽略。

这通常是很有用的，像一些可选的编译flags，即使不支持也能正常编译，但是强行设置上去，其他用户在编译的时候，有可能会因为编译器的支持力度不同，出现一定程度的编译失败。

但，由于自动检测并不保证100%可靠，有时候会有一定程度的误判，所以某些用户并不喜欢这个设定（尤其是针对交叉编译工具链，更容易出现失败）。

目前，v2.3.4版本如果检测失败，会有警告提示避免用户莫名躺坑，例如：

```bash
warning: add_ldflags("-static") is ignored, please pass `{force = true}` or call `set_policy("check.auto_ignore_flags", false)` if you want to set it.
```

根据提示，我们可以自己分析判断，是否需要强制设置这个flags，一种就是通过：

```lua
add_ldflags("-static", {force = true})
```

来显示的强制设置上它，跳过自动检测，这对于偶尔的flags失败，是很有效快捷的处理方式，但是对于交叉编译时候，一堆的flags设置检测不过的情况下，每个都设置force太过于繁琐。

这个时候，我们就可以通过`set_policy`来对某个target或者整个project直接禁用默认的自动检测行为：

```lua
set_policy("check.auto_ignore_flags", false)
target("test")
    add_ldflags("-static")
```

然后我们就可以随意设置各种原始flags，xmake不会去自动检测和忽略他们了。

##### check.auto_map_flags

这是xmake的另外一个对flags的智能分析处理，通常像`add_links`, `add_defines`这种xmake内置的api去设置的配置，是具有跨平台特性的，不同编译器平台会自动处理成对应的原始flags。

但是，有些情况，用户还是需要自己通过add_cxflags, add_ldflags设置原始的编译链接flags，这些flags并不能很好的跨编译器

就拿`-O0`的编译优化flags来说，虽然有`set_optimize`来实现跨编译器配置，但如果用户直接设置`add_cxflags("-O0")`呢？gcc/clang下可以正常处理，但是msvc下就不支持了

也许我们能通过`if is_plat() then`来分平台处理，但很繁琐，因此xmake内置了flags的自动映射功能。

基于gcc flags的普及性，xmake采用gcc的flags命名规范，对其根据不同的编译实现自动映射，例如：

```lua
add_cxflags("-O0")
```

这一行设置，在gcc/clang下还是`-O0`，但如果当前是msvc编译器，那边会自动映射为msvc对应`-Od`编译选项来禁用优化。

整个过程，用户是完全无感知的，直接执行xmake就可以跨编译器完成编译。

!> 当然，目前的自动映射实现还不是很成熟，没有100%覆盖所有gcc的flags，所以还是有不少flags是没去映射的。

也有部分用户并不喜欢这种自动映射行为，那么我们可以通过下面的设置完全禁用这个默认的行为：

```bash
set_policy("check.auto_map_flags", false)
```

##### build.across_targets_in_parallel

这个策略也是默认开启的，主要用于跨target间执行并行构建，v2.3.3之前的版本，并行构建只能针对单个target内部的所有源文件，
跨target的编译，必须要要等先前的target完全link成功，才能执行下一个target的编译，这在一定程度上会影响编译速度。

然而每个target的源文件是可以完全并行化处理的，最终在一起执行link过程，v2.3.3之后的版本通过这个优化，构建速度提升了30%。

当然，如果有些特殊的target里面的构建源文件要依赖先前的target（尤其是一些自定义rules的情况，虽然很少遇到），我们也可以通过下面的设置禁用这个优化行为：

```bash
set_policy("build.across_targets_in_parallel", false)
```

### target:set_runtimes

#### 设置编译目标依赖的运行时库

这是 v2.5.1 开始新增的接口，用于抽象化设置编译目标依赖的运行时库，目前仅仅支持对 msvc 运行时库的抽象，但后续也许会扩展对其他编译器运行时库的映射。

目前支持的一些配置值说明如下：


| 值     | 描述                                      |
| ------ | ----------------------------------------- |
| MT     | msvc 运行时库：多线程静态库               |
| MTd    | msvc 运行时库：多线程静态库（调试）       |
| MD     | msvc 运行时库：多线程动态库               |
| MDd    | msvc 运行时库：多线程动态库（调试）       |

关于 vs 运行时，可以参考：[msvc 运行时说明](https://docs.microsoft.com/en-us/cpp/build/reference/md-mt-ld-use-run-time-library?view=msvc-160)

而这个接口传入 MT/MTd 参数配置，xmake 会自动配置上 `/MT /nodefaultlib:msvcrt.lib` 参数。

我们可以针对不同的 target 设置不同的运行时。

另外，如果我们将 `set_runtimes` 设置在全局根域，那么所有的 `add_requires("xx")` 包定义也会全局同步切换到对应的 vs runtime 配置

```lua
set_runtimes("MD")
add_requires("libcurl", "fmt")
target("test")
   set_kind("binary")
   add_files("src/*.c")
```

当然，我们也可以通过 `add_requires("xx", {configs = {vs_runtime = "MD"}})` 对特定包修改 vs 运行时库。

我们也可以通过 `xmake f --vs_runtime=MD` 通过参数配置来全局切换它。

与此 api 相关的 issue：[#1071](https://github.com/xmake-io/xmake/issues/1071#issuecomment-750817681)

### target:set_group

#### 设置目标分组

##### 用于工程文件分组展示

此接口可用于 vs/vsxmake 工程生成，对 vs 工程内部子工程目录树按指定结构分组展示，不过后续也可能对其他模块增加分组支持。

比如对于下面的分组配置：

```lua
add_rules("mode.debug", "mode.release")

target("test1")
    set_kind("binary")
    add_files("src/*.cpp")
    set_group("group1")

target("test2")
    set_kind("binary")
    add_files("src/*.cpp")
    set_group("group1")

target("test3")
    set_kind("binary")
    add_files("src/*.cpp")
    set_group("group1/group2")

target("test4")
    set_kind("binary")
    add_files("src/*.cpp")
    set_group("group3/group4")

target("test5")
    set_kind("binary")
    add_files("src/*.cpp")

target("test6")
    set_kind("binary")
    add_files("src/*.cpp")
```

生成的 vs 工程目录结构效果如下：

![](assets/img/manual/set_group.png)

其中 `set_group("group1/group2")` 可以将 target 设置到二级分组中去。

更多详情见：[#1026](https://github.com/xmake-io/xmake/issues/1026)

##### 编译指定一批目标程序

我们可以使用 `set_group()` 将给定的目标标记为 `test/benchmark/...` 并使用 `set_default(false)` 禁用来默认构建它。

然后，通过 `xmake -g xxx` 命令就能指定构建一批目标程序了。

比如，我们可以使用此功能来构建所有测试。

```lua
target("test1")
    set_kind("binary")
    set_default(false)
    set_group("test")
    add_files("src/*.cpp")

target("test2")
    set_kind("binary")
    set_default(false)
    set_group("test")
    add_files("src/*.cpp")
```

```console
$ xmake -g test
$ xmake --group=test
```

##### 运行指定一批目标程序

我们也可以通过设置分组，来指定运行所有带有 `test` 分组的测试程序。

```console
$ xmake run -g test
$ xmake run --group=test
```

另外，我们还可以支持分组的模式匹配：

```
$ xmake build -g test_*
$ xmake run -g test/foo_*
$ xmake build -g bench*
$ xmake run -g bench*
```

更多信息见：[#1913](https://github.com/xmake-io/xmake/issues/1913)

### target:add_filegroups

#### 添加源文件分组

这个接口目前主要用于对 vs/vsxmake/cmakelists generator 生成的工程文件进行源文件分组展示。

如果不设置分组展示，Xmake 也会默认按照树状模式展示，但是有些极端情况下，目录层级显示不是很好，例如：

```lua
target("test")
    set_kind("binary")
    add_files("../../../../src/**.cpp")
```

![](https://xmake.io/assets/img/manual/filegroup1.png)

目前主要支持两种展示模式：

- plain: 平坦模式
- tree: 树形展示，这也是默认模式

另外，它也支持对 `add_headerfiles` 添加的文件进行分组。

##### 设置分组并指定根目录

```lua
target("test")
    set_kind("binary")
    add_files("../../../../src/**.cpp")
    add_filegroups("group1/group2", {rootdir = "../../../../"})
```

![](https://xmake.io/assets/img/manual/filegroup2.png)


##### 设置分组并指定文件匹配模式

```lua
target("test")
    set_kind("binary")
    add_files("../../../../src/**.cpp")
    add_filegroups("group1/group2", {rootdir = "../../../../", files = {"src/**.cpp"}})
```

##### 作为平坦模式展示

这种模式下，所有源文件忽略嵌套的目录层级，在分组下同一层级展示。

```lua
target("test")
    set_kind("binary")
    add_files("../../../../src/**.cpp")
    add_filegroups("group1/group2", {rootdir = "../../../../", mode = "plain"})
```

![](https://xmake.io/assets/img/manual/filegroup3.png)

