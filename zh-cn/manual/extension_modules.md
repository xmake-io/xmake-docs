
所有扩展模块的使用，都需要通过[import](#import)接口，进行导入后才能使用。

### core.base.option

一般用于获取xmake命令参数选项的值，常用于插件开发。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [option.get](#option-get)                       | 获取参数选项值                               | >= 2.0.1 |

#### option.get

- 获取参数选项值

在插件开发中用于获取参数选项值，例如：

```lua
-- 导入选项模块
import("core.base.option")

-- 插件入口函数
function main(...)
    print(option.get("info"))
end
```

上面的代码获取hello插件，执行：`xmake hello --info=xxxx` 命令时候传入的`--info=`选项的值，并显示：`xxxx`

对于非main入口的task任务或插件，可以这么使用：

```lua
task("hello")
    on_run(function ())
        import("core.base.option")
        print(option.get("info"))
    end)
```

### core.base.global

用于获取xmake全局的配置信息，也就是`xmake g|global --xxx=val` 传入的参数选项值。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [global.get](#global-get)                       | 获取指定配置值                               | >= 2.0.1 |
| [global.load](#global-load)                     | 加载配置                                     | >= 2.0.1 |
| [global.directory](#global-directory)           | 获取全局配置信息目录                         | >= 2.0.1 |
| [global.dump](#global-dump)                     | 打印输出所有全局配置信息                     | >= 2.0.1 |

<p class="tip">
2.1.5版本之前为`core.project.global`。
</p>

#### global.get

- 获取指定配置值

类似[config.get](#config-get)，唯一的区别就是这个是从全局配置中获取。

#### global.load

- 加载配置

类似[global.get](#global-get)，唯一的区别就是这个是从全局配置中加载。

#### global.directory

- 获取全局配置信息目录

默认为`~/.config`目录。

#### global.dump

- 打印输出所有全局配置信息

输出结果如下：

```lua
{
    clean = true
,   ccache = "ccache"
,   xcode_dir = "/Applications/Xcode.app"
}
```

### core.base.task

用于任务操作，一般用于在自定义脚本中、插件任务中，调用运行其他task任务。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [task.run](#task-run)                           | 运行指定任务                                 | >= 2.0.1 |

<p class="tip">
2.1.5版本之前为`core.project.task`。
</p>

#### task.run

- 运行指定任务

用于在自定义脚本、插件任务中运行[task](#task)定义的任务或插件，例如：

```lua
task("hello")
    on_run(function ()
        print("hello xmake!")
    end)

target("demo")
    on_clean(function(target)

        -- 导入task模块
        import("core.base.task")

        -- 运行这个hello task
        task.run("hello")
    end)
```

我们还可以在运行任务时，增加参数传递，例如：

```lua
task("hello")
    on_run(function (arg1, arg2)
        print("hello xmake: %s %s!", arg1, arg2)
    end)

target("demo")
    on_clean(function(target)

        -- 导入task
        import("core.base.task")

        -- {} 这个是给第一种选项传参使用，这里置空，这里在最后面传入了两个参数：arg1, arg2
        task.run("hello", {}, "arg1", "arg2")
    end)
```

对于`task.run`的第二个参数，用于传递命令行菜单中的选项，而不是直接传入`function (arg, ...)`函数入口中，例如：

```lua
-- 导入task
import("core.base.task")

-- 插件入口
function main(...)

    -- 运行内置的xmake配置任务，相当于：xmake f|config --plat=iphoneos --arch=armv7
    task.run("config", {plat="iphoneos", arch="armv7"})
emd
```

### core.tool.linker

链接器相关操作，常用于插件开发。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [linker.link](#linker-link)                     | 执行链接                                     | >= 2.0.1 |
| [linker.linkcmd](#linker-linkcmd)               | 获取链接命令行                               | >= 2.0.1 |
| [linker.linkargv](#linker-linkargv)             | 获取链接命令行列表                           | >= 2.1.5 |
| [linker.linkflags](#linker-linkflags)           | 获取链接选项                                 | >= 2.0.1 |
| [linker.has_flags](#linker-has_flags)           | 判断指定链接选项是否支持                     | >= 2.1.5 |

#### linker.link

- 执行链接

针对target，链接指定对象文件列表，生成对应的目标文件，例如：

```lua
linker.link("binary", "cc", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

其中[target](#target)，为工程目标，这里传入，主要用于获取target特定的链接选项，具体如果获取工程目标对象，见：[core.project.project](#core-project-project)

当然也可以不指定target，例如：

```lua
linker.link("binary", "cc", {"a.o", "b.o", "c.o"}, "/tmp/targetfile")
```

第一个参数指定链接类型，目前支持：binary, static, shared
第二个参数告诉链接器，应该作为那种源文件对象进行链接，这些对象源文件使用什么编译器编译的，例如：

| 第二个参数值 | 描述         |
| ------------ | ------------ |
| cc           | c编译器      |
| cxx          | c++编译器    |
| mm           | objc编译器   |
| mxx          | objc++编译器 |
| gc           | go编译器     |
| as           | 汇编器       |
| sc           | swift编译器  |
| rc           | rust编译器   |
| dc           | dlang编译器  |

指定不同的编译器类型，链接器会适配最合适的链接器来处理链接，并且如果几种支持混合编译的语言，那么可以同时传入多个编译器类型，指定链接器选择支持这些混合编译语言的链接器进行链接处理：

```lua
linker.link("binary", {"cc", "mxx", "sc"}, {"a.o", "b.o", "c.o"}, "/tmp/targetfile")
```

上述代码告诉链接器，a, b, c三个对象文件有可能分别是c, objc++, swift代码编译出来的，链接器会从当前系统和工具链中选择最合适的链接器去处理这个链接过程。

#### linker.linkcmd

- 获取链接命令行字符串

直接获取[linker.link](#linker-link)中执行的命令行字符串，相当于：

```lua
local cmdstr = linker.linkcmd("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

注：后面`{target = target}`扩展参数部分是可选的，如果传递了target对象，那么生成的链接命令，会加上这个target配置对应的链接选项。

并且还可以自己传递各种配置，例如：

```lua
local cmdstr = linker.linkcmd("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {config = {linkdirs = "/usr/lib"}})
```

#### linker.linkargv

- 获取链接命令行参数列表

跟[linker.linkcmd](#linker-linkcmd)稍微有点区别的是，此接口返回的是参数列表，table表示，更加方便操作：

```lua
local program, argv = linker.linkargv("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

其中返回的第一个值是主程序名，后面是参数列表，而`os.args(table.join(program, argv))`等价于`linker.linkcmd`。

我们也可以通过传入返回值给[os.runv](#os-runv)来直接运行它：`os.runv(linker.linkargv(..))`

#### linker.linkflags

- 获取链接选项

获取[linker.linkcmd](#linker-linkcmd)中的链接选项字符串部分，不带shellname和对象文件列表，并且是按数组返回，例如：

```lua
local flags = linker.linkflags("shared", "cc", {target = target})
for _, flag in ipairs(flags) do
    print(flag)
end
```

返回的是flags的列表数组。

#### linker.has_flags

- 判断指定链接选项是否支持

虽然通过[lib.detect.has_flags](detect-has_flags)也能判断，但是那个接口更加底层，需要指定链接器名称
而此接口只需要指定target的目标类型，源文件类型，它会自动切换选择当前支持的链接器。

```lua
if linker.has_flags(target:targetkind(), target:sourcekinds(), "-L/usr/lib -lpthread") then
    -- ok
end
```

### core.tool.compiler

编译器相关操作，常用于插件开发。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [compiler.compile](#compiler-compile)           | 执行编译                                     | >= 2.0.1 |
| [compiler.compcmd](#compiler-compcmd)           | 获取编译命令行                               | >= 2.0.1 |
| [compiler.compargv](#compiler-compargv)         | 获取编译命令行列表                           | >= 2.1.5 |
| [compiler.compflags](#compiler-compflags)       | 获取编译选项                                 | >= 2.0.1 |
| [compiler.has_flags](#compiler-has_flags)       | 判断指定编译选项是否支持                     | >= 2.1.5 |
| [compiler.features](#compiler-features)         | 获取所有编译器特性                           | >= 2.1.5 |
| [compiler.has_features](#compiler-has_features) | 判断指定编译特性是否支持                     | >= 2.1.5 |

#### compiler.compile

- 执行编译

针对target，链接指定对象文件列表，生成对应的目标文件，例如：

```lua
compiler.compile("xxx.c", "xxx.o", "xxx.h.d", {target = target})
```

其中[target](#target)，为工程目标，这里传入主要用于获取taeget的特定编译选项，具体如果获取工程目标对象，见：[core.project.project](#core-project-project)

而`xxx.h.d`文件用于存储为此源文件的头文件依赖文件列表，最后这两个参数都是可选的，编译的时候可以不传他们：

```lua
compiler.compile("xxx.c", "xxx.o")
```

来单纯编译一个源文件。

#### compiler.compcmd

- 获取编译命令行

直接获取[compiler.compile](#compiler-compile)中执行的命令行字符串，相当于：

```lua
local cmdstr = compiler.compcmd("xxx.c", "xxx.o", {target = target})
```

注：后面`{target = target}`扩展参数部分是可选的，如果传递了target对象，那么生成的编译命令，会加上这个target配置对应的链接选项。

并且还可以自己传递各种配置，例如：

```lua
local cmdstr = compiler.compcmd("xxx.c", "xxx.o", {config = {includedirs = "/usr/include", defines = "DEBUG"}})
```

通过target，我们可以导出指定目标的所有源文件编译命令：

```lua
import("core.project.project")

for _, target in pairs(project.targets()) do
    for sourcekind, sourcebatch in pairs(target:sourcebatches()) do
        for index, objectfile in ipairs(sourcebatch.objectfiles) do
            local cmdstr = compiler.compcmd(sourcebatch.sourcefiles[index], objectfile, {target = target})
        end
    end
end
```

#### compiler.compargv

- 获取编译命令行列表

跟[compiler.compargv](#compiler-compargv)稍微有点区别的是，此接口返回的是参数列表，table表示，更加方便操作：

```lua
local program, argv = compiler.compargv("xxx.c", "xxx.o")
```

#### compiler.compflags

- 获取编译选项

获取[compiler.compcmd](#compiler-compcmd)中的编译选项字符串部分，不带shellname和文件列表，例如：

```lua
local flags = compiler.compflags(sourcefile, {target = target})
for _, flag in ipairs(flags) do
    print(flag)
end
```

返回的是flags的列表数组。

#### compiler.has_flags

- 判断指定编译选项是否支持

虽然通过[lib.detect.has_flags](detect-has_flags)也能判断，但是那个接口更加底层，需要指定编译器名称。
而此接口只需要指定语言类型，它会自动切换选择当前支持的编译器。

```lua
-- 判断c语言编译器是否支持选项: -g
if compiler.has_flags("c", "-g") then
    -- ok
end

-- 判断c++语言编译器是否支持选项: -g
if compiler.has_flags("cxx", "-g") then
    -- ok
end
```

#### compiler.features

- 获取所有编译器特性

虽然通过[lib.detect.features](detect-features)也能获取，但是那个接口更加底层，需要指定编译器名称。
而此接口只需要指定语言类型，它会自动切换选择当前支持的编译器，然后获取当前的编译器特性列表。

```lua
-- 获取当前c语言编译器的所有特性
local features = compiler.features("c")

-- 获取当前c++语言编译器的所有特性，启用c++11标准，否则获取不到新标准的特性
local features = compiler.features("cxx", {config = {cxxflags = "-std=c++11"}})

-- 获取当前c++语言编译器的所有特性，传递工程target的所有配置信息
local features = compiler.features("cxx", {target = target, config = {defines = "..", includedirs = ".."}})
```

所有c编译器特性列表：

| 特性名                |
| --------------------- |
| c_static_assert       |
| c_restrict            |
| c_variadic_macros     |
| c_function_prototypes |

所有c++编译器特性列表：

| 特性名                               |
| ------------------------------------ |
| cxx_variable_templates               |
| cxx_relaxed_constexpr                |
| cxx_aggregate_default_initializers   |
| cxx_contextual_conversions           |
| cxx_attribute_deprecated             |
| cxx_decltype_auto                    |
| cxx_digit_separators                 |
| cxx_generic_lambdas                  |
| cxx_lambda_init_captures             |
| cxx_binary_literals                  |
| cxx_return_type_deduction            |
| cxx_decltype_incomplete_return_types |
| cxx_reference_qualified_functions    |
| cxx_alignof                          |
| cxx_attributes                       |
| cxx_inheriting_constructors          |
| cxx_thread_local                     |
| cxx_alias_templates                  |
| cxx_delegating_constructors          |
| cxx_extended_friend_declarations     |
| cxx_final                            |
| cxx_nonstatic_member_init            |
| cxx_override                         |
| cxx_user_literals                    |
| cxx_constexpr                        |
| cxx_defaulted_move_initializers      |
| cxx_enum_forward_declarations        |
| cxx_noexcept                         |
| cxx_nullptr                          |
| cxx_range_for                        |
| cxx_unrestricted_unions              |
| cxx_explicit_conversions             |
| cxx_lambdas                          |
| cxx_local_type_template_args         |
| cxx_raw_string_literals              |
| cxx_auto_type                        |
| cxx_defaulted_functions              |
| cxx_deleted_functions                |
| cxx_generalized_initializers         |
| cxx_inline_namespaces                |
| cxx_sizeof_member                    |
| cxx_strong_enums                     |
| cxx_trailing_return_types            |
| cxx_unicode_literals                 |
| cxx_uniform_initialization           |
| cxx_variadic_templates               |
| cxx_decltype                         |
| cxx_default_function_template_args   |
| cxx_long_long_type                   |
| cxx_right_angle_brackets             |
| cxx_rvalue_references                |
| cxx_static_assert                    |
| cxx_extern_templates                 |
| cxx_func_identifier                  |
| cxx_variadic_macros                  |
| cxx_template_template_parameters     |

#### compiler.has_features

- 判断指定的编译器特性是否支持

虽然通过[lib.detect.has_features](detect-has-features)也能获取，但是那个接口更加底层，需要指定编译器名称。
而此接口只需要指定需要检测的特姓名称列表，就能自动切换选择当前支持的编译器，然后判断指定特性在当前的编译器中是否支持。

```lua
if compiler.has_features("c_static_assert") then
    -- ok
end

if compiler.has_features({"c_static_assert", "cxx_constexpr"}, {languages = "cxx11"}) then
    -- ok
end

if compiler.has_features("cxx_constexpr", {target = target, defines = "..", includedirs = ".."}) then
    -- ok
end
```

具体特性名有哪些，可以参考：[compiler.features](#compiler-features)。

### core.project.config

用于获取工程编译时候的配置信息，也就是`xmake f|config --xxx=val` 传入的参数选项值。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [config.get](#config-get)                       | 获取指定配置值                               | >= 2.0.1 |
| [config.load](#config-load)                     | 加载配置                                     | >= 2.0.1 |
| [config.arch](#config-arch)                     | 获取当前工程的架构配置                       | >= 2.0.1 |
| [config.plat](#config-plat)                     | 获取当前工程的平台配置                       | >= 2.0.1 |
| [config.mode](#config-mode)                     | 获取当前工程的编译模式配置                   | >= 2.0.1 |
| [config.buildir](#config-buildir)               | 获取当前工程的输出目录配置                   | >= 2.0.1 |
| [config.directory](#config-directory)           | 获取当前工程的配置信息目录                   | >= 2.0.1 |
| [config.dump](#config-dump)                     | 打印输出当前工程的所有配置信息               | >= 2.0.1 |

#### config.get

- 获取指定配置值

用于获取`xmake f|config --xxx=val`的配置值，例如：

```lua
target("test")
    on_run(function (target)

        -- 导入配置模块
        import("core.project.config")

        -- 获取配置值
        print(config.get("xxx"))
    end)
```

#### config.load

- 加载配置

一般用于插件开发中，插件任务中不像工程的自定义脚本，环境需要自己初始化加载，默认工程配置是没有被加载的，如果要用[config.get](#config-get)接口获取工程配置，那么需要先：

```lua

-- 导入配置模块
import("core.project.config")

function main(...)

    -- 先加载工程配置
    config.load()
    
    -- 获取配置值
    print(config.get("xxx"))
end
```

#### config.arch

- 获取当前工程的架构配置

也就是获取`xmake f|config --arch=armv7`的平台配置，相当于`config.get("arch")`。

#### config.plat

- 获取当前工程的平台配置

也就是获取`xmake f|config --plat=iphoneos`的平台配置，相当于`config.get("plat")`。

#### config.mode

- 获取当前工程的编译模式配置

也就是获取`xmake f|config --mode=debug`的平台配置，相当于`config.get("mode")`。

#### config.buildir

- 获取当前工程的输出目录配置

也就是获取`xmake f|config -o /tmp/output`的平台配置，相当于`config.get("buildir")`。

#### config.directory

- 获取当前工程的配置信息目录

获取工程配置的存储目录，默认为：`projectdir/.config`

#### config.dump

- 打印输出当前工程的所有配置信息

输出结果例如：

```lua
{
    sh = "xcrun -sdk macosx clang++"
,   xcode_dir = "/Applications/Xcode.app"
,   ar = "xcrun -sdk macosx ar"
,   small = true
,   object = false
,   arch = "x86_64"
,   xcode_sdkver = "10.12"
,   ex = "xcrun -sdk macosx ar"
,   cc = "xcrun -sdk macosx clang"
,   rc = "rustc"
,   plat = "macosx"
,   micro = false
,   host = "macosx"
,   as = "xcrun -sdk macosx clang"
,   dc = "dmd"
,   gc = "go"
,   openssl = false
,   ccache = "ccache"
,   cxx = "xcrun -sdk macosx clang"
,   sc = "xcrun -sdk macosx swiftc"
,   mm = "xcrun -sdk macosx clang"
,   buildir = "build"
,   mxx = "xcrun -sdk macosx clang++"
,   ld = "xcrun -sdk macosx clang++"
,   mode = "release"
,   kind = "static"
}
```

### core.project.global

<p class="tip">
此模块自2.1.5版本后迁移至[core.base.global](#core-base-global)。
</p>

### core.project.task

<p class="tip">
此模块自2.1.5版本后迁移至[core.base.task](#core-base-task)。
</p>

### core.project.project

用于获取当前工程的一些描述信息，也就是在`xmake.lua`工程描述文件中定义的配置信息，例如：[target](#target)、[option](#option)等。

| 接口                                            | 描述                                         | 支持版本             |
| ----------------------------------------------- | -------------------------------------------- | -------------------- |
| [project.load](#project-load)                   | 加载工程配置                                 | >= 2.0.1 (2.1.5废弃) |
| [project.directory](#project-directory)         | 获取工程目录                                 | >= 2.0.1             |
| [project.target](#project-target)               | 获取指定工程目标对象                         | >= 2.0.1             |
| [project.targets](#project-targets)             | 获取工程目标对象列表                         | >= 2.0.1             |
| [project.option](#project-option)               | 获取指定的选项对象                           | >= 2.1.5             |
| [project.options](#project-options)             | 获取工程所有的选项对象                       | >= 2.1.5             |
| [project.name](#project-name)                   | 获取当前工程名                               | >= 2.0.1             |
| [project.version](#project-version)             | 获取当前工程版本号                           | >= 2.0.1             |

#### project.load

- 加载工程描述配置

仅在插件中使用，因为这个时候还没有加载工程配置信息，在工程目标的自定义脚本中，不需要执行此操作，就可以直接访问工程配置。

```lua
-- 导入工程模块
import("core.project.project")

-- 插件入口
function main(...)

    -- 加载工程描述配置
    project.load()

    -- 访问工程描述，例如获取指定工程目标
    local target = project.target("test")
end
```

<p class="tip">
2.1.5版本后，不在需要，工程加载会自动在合适时机延迟加载。
</p>

#### project.directory

- 获取工程目录

获取当前工程目录，也就是`xmake -P xxx`中指定的目录，否则为默认当前`xmake`命令执行目录。

<p class="tip">
2.1.5版本后，建议使用[os.projectdir](#os-projectdir)来获取。
</p>

#### project.target

- 获取指定工程目标对象

获取和访问指定工程目标配置，例如：

```lua
local target = project.target("test")
if target then

    -- 获取目标名
    print(target:name())

    -- 获取目标目录, 2.1.9版本之后才有
    print(target:targetdir())

    -- 获取目标文件名
    print(target:targetfile())

    -- 获取目标类型，也就是：binary, static, shared
    print(target:targetkind())

    -- 获取目标名
    print(target:name())

    -- 获取目标源文件
    local sourcefiles = target:sourcefiles()

    -- 获取目标安装头文件列表
    local srcheaders, dstheaders = target:headerfiles()

    -- 获取目标依赖
    print(target:get("deps"))
end
```

#### project.targets

- 获取工程目标对象列表

返回当前工程的所有编译目标，例如：

```lua
for targetname, target in pairs(project.targets())
    print(target:targetfile())
end
```

#### project.option

- 获取指定选项对象

获取和访问工程中指定的选项对象，例如：

```lua
local option = project.option("test")
if option:enabled() then
    option:enable(false)
end
```

#### project.options

- 获取工程所有选项对象

返回当前工程的所有编译目标，例如：

```lua
for optionname, option in pairs(project.options())
    print(option:enabled())
end
```

#### project.name

- 获取当前工程名

也就是获取[set_project](#set_project)的工程名配置。

```lua
print(project.name())
```

#### project.version

- 获取当前工程版本号

也就是获取[set_version](#set_version)的工程版本配置。

```lua
print(project.version())
```

### core.language.language

用于获取编译语言相关信息，一般用于代码文件的操作。

| 接口                                              | 描述                                         | 支持版本 |
| -----------------------------------------------   | -------------------------------------------- | -------- |
| [language.extensions](#language-extensions)       | 获取所有语言的代码后缀名列表                 | >= 2.1.1 |
| [language.targetkinds](#language-targetkinds)     | 获取所有语言的目标类型列表                   | >= 2.1.1 |
| [language.sourcekinds](#language-sourcekinds)     | 获取所有语言的源文件类型列表                 | >= 2.1.1 |
| [language.sourceflags](#language-sourceflags)     | 加载所有语言的源文件编译选项名列表           | >= 2.1.1 |
| [language.load](#language-load)                   | 加载指定语言                                 | >= 2.1.1 |
| [language.load_sk](#language-load_sk)             | 从源文件类型加载指定语言                     | >= 2.1.1 |
| [language.load_ex](#language-load_ex)             | 从源文件后缀名加载指定语言                   | >= 2.1.1 |
| [language.sourcekind_of](#language-sourcekind_of) | 获取指定源文件的源文件类型                   | >= 2.1.1 |

#### language.extensions

- 获取所有语言的代码后缀名列表

获取结果如下：

```lua
{
     [".c"]      = cc
,    [".cc"]     = cxx
,    [".cpp"]    = cxx
,    [".m"]      = mm
,    [".mm"]     = mxx
,    [".swift"]  = sc
,    [".go"]     = gc
}
```

#### language.targetkinds

- 获取所有语言的目标类型列表

获取结果如下：

```lua
{
     binary = {"ld", "gc-ld", "dc-ld"}
,    static = {"ar", "gc-ar", "dc-ar"}
,    shared = {"sh", "dc-sh"}
}
```

#### language.sourcekinds

- 获取所有语言的源文件类型列表

获取结果如下：

```lua
{
     cc  = ".c"
,    cxx = {".cc", ".cpp", ".cxx"}
,    mm  = ".m"
,    mxx = ".mm"
,    sc  = ".swift"
,    gc  = ".go"
,    rc  = ".rs"
,    dc  = ".d"
,    as  = {".s", ".S", ".asm"}
}
```

#### language.sourceflags

- 加载所有语言的源文件编译选项名列表

获取结果如下：

```lua
{
     cc  = {"cflags", "cxflags"}
,    cxx = {"cxxflags", "cxflags"}
,    ...
}
```

#### language.load

- 加载指定语言

从语言名称加载具体语言对象，例如：

```lua
local lang = language.load("c++")
if lang then
    print(lang:name())
end
```

#### language.load_sk

- 从源文件类型加载指定语言

从源文件类型：`cc, cxx, mm, mxx, sc, gc, as ..`加载具体语言对象，例如：

```lua
local lang = language.load_sk("cxx")
if lang then
    print(lang:name())
end
```

#### language.load_ex

- 从源文件后缀名加载指定语言

从源文件后缀名：`.cc, .c, .cpp, .mm, .swift, .go  ..`加载具体语言对象，例如：

```lua
local lang = language.load_sk(".cpp")
if lang then
    print(lang:name())
end
```

#### language.sourcekind_of

- 获取指定源文件的源文件类型

也就是从给定的一个源文件路径，获取它是属于那种源文件类型，例如：

```lua
print(language.sourcekind_of("/xxxx/test.cpp"))
```

显示结果为：`cxx`，也就是`c++`类型，具体对应列表见：[language.sourcekinds](#language-sourcekinds)

### core.platform.platform

平台信息相关操作

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [platform.get](#platform-get)                   | 获取指定平台相关配置信息                     | >= 2.0.1 |

#### platform.get

- 获取指定平台相关配置信息

获取平台配置`xmake.lua`中设置的信息，一般只有在写插件的时候会用到，例如：

```lua
-- 获取当前平台的所有支持架构
print(platform.get("archs"))

-- 获取指定iphoneos平台的目标文件格式信息
local formats = platform.get("formats", "iphoneos")
table.dump(formats)
```

具体有哪些可读的平台配置信息，可参考：[platform](#platform)

### core.platform.environment

环境相关操作，用于进入和离开指定环境变量对应的终端环境，一般用于`path`环境的进入和离开，尤其是一些需要特定环境的构建工具，例如：msvc的工具链。

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [environment.enter](#environment-enter)         | 进入指定环境                                 | >= 2.0.1 |
| [environment.leave](#environment-leave)         | 离开指定环境                                 | >= 2.0.1 |

目前支持的环境有：

| 接口                                            | 描述                                         | 支持版本 |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| toolchains                                      | 工具链执行环境                               | >= 2.0.1 |

#### environment.enter

- 进入指定环境

进入指定环境，例如msvc有自己的环境变量环境用于运行构建工具，例如：`cl.exe`, `link.exe`这些，这个时候想要在xmake里面运行他们，需要：

```lua
-- 进入工具链环境
environment.enter("toolchains")

-- 这个时候运行cl.exe才能正常运行，这个时候的path等环境变量都会进入msvc的环境模式
os.run("cl.exe ..")

-- 离开工具链环境
environment.leave("toolchains")
```

因此为了通用性，默认xmake编译事都会设置这个环境，在linux下基本上内部环境不需要特殊切换，目前仅对windows下msvc进行了处理。

#### environment.leave

- 离开指定环境

具体使用见：[environment.enter](#environment-enter)

### lib.detect

此模块提供了非常强大的探测功能，用于探测程序、编译器、语言特性、依赖包等。

<p class="tip">
此模块的接口分散在多个模块目录中，尽量通过导入单个接口来使用，这样效率更高，例如：`import("lib.detect.find_package")`，而不是通过`import("lib.detect")`导入所有来调用。
</p>

| 接口                                                | 描述                                         | 支持版本             |
| --------------------------------------------------- | -------------------------------------------- | -------------------- |
| [detect.find_file](#detect-find_file)               | 查找文件                                     | >= 2.1.5             |
| [detect.find_path](#detect-find_path)               | 查找文件路径                                 | >= 2.1.5             |
| [detect.find_library](#detect-find_library)         | 查找库文件                                   | >= 2.1.5             |
| [detect.find_program](#detect-find_program)         | 查找可执行程序                               | >= 2.1.5             |
| [detect.find_programver](#detect-find_programver)   | 查找可执行程序版本号                         | >= 2.1.5             |
| [detect.find_package](#detect-find_package)         | 查找包文件，包含库文件和搜索路径             | >= 2.1.5             |
| [detect.find_tool](#detect-find_tool)               | 查找工具                                     | >= 2.1.5             |
| [detect.find_toolname](#detect-find_toolname)       | 查找工具名                                   | >= 2.1.5             |
| [detect.find_cudadevices](#detect-find_cudadevices) | 查找本机的 CUDA 设备                         | >= 2.2.7             |
| [detect.features](#detect-features)                 | 获取指定工具的所有特性                       | >= 2.1.5             |
| [detect.has_features](#detect-has_features)         | 判断指定特性是否支持                         | >= 2.1.5             |
| [detect.has_flags](#detect-has_flags)               | 判断指定参数选项是否支持                     | >= 2.1.5             |
| [detect.has_cfuncs](#detect-has_cfuncs)             | 判断指定c函数是否存在                        | >= 2.1.5             |
| [detect.has_cxxfuncs](#detect-has_cxxfuncs)         | 判断指定c++函数是否存在                      | >= 2.1.5             |
| [detect.has_cincludes](#detect-has_cincludes)       | 判断指定c头文件是否存在                      | >= 2.1.5             |
| [detect.has_cxxincludess](#detect-has_cxxincludes)  | 判断指定c++头文件是否存在                    | >= 2.1.5             |
| [detect.has_ctypes](#detect-has_ctypes)             | 判断指定c类型是否存在                        | >= 2.1.5             |
| [detect.has_cxxtypes](#detect-has_cxxtypes)         | 判断指定c++类型是否存在                      | >= 2.1.5             |
| [detect.check_cxsnippets](#detect-check_cxsnippets) | 检测c/c++代码片段是否能够编译通过            | >= 2.1.5             |

#### detect.find_file

- 查找文件

这个接口提供了比[os.files](#os-files)更加强大的工程， 可以同时指定多个搜索目录，并且还能对每个目录指定附加的子目录，来模式匹配查找，相当于是[os.files](#os-files)的增强版。

例如：

```lua
import("lib.detect.find_file")

local file = find_file("ccache", { "/usr/bin", "/usr/local/bin"})
```

如果找到，返回的结果是：`/usr/bin/ccache`

它同时也支持模式匹配路径，进行递归查找，类似`os.files`：

```lua
local file = find_file("test.h", { "/usr/include", "/usr/local/include/**"})
```

不仅如此，里面的路径也支持内建变量，来从环境变量和注册表中获取路径进行查找：

```lua
local file = find_file("xxx.h", { "$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name)"})
```

如果路径规则比较复杂多变，还可以通过自定义脚本来动态生成路径传入：

```lua
local file = find_file("xxx.h", { "$(env PATH)", function () return val("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name"):match("\"(.-)\"") end})
```

大部分场合下，上面的使用已经满足各种需求了，如果还需要一些扩展功能，可以通过传入第三个参数，自定义一些可选配置，例如：

```lua
local file = find_file("test.h", { "/usr", "/usr/local"}, {suffixes = {"/include", "/lib"}})
```

通过指定suffixes子目录列表，可以扩展路径列表（第二个参数），使得实际的搜索目录扩展为：

```
/usr/include
/usr/lib
/usr/local/include
/usr/local/lib
```

并且不用改变路径列表，就能动态切换子目录来搜索文件。

<p class="tip">
我们也可以通过`xmake lua`插件来快速调用和测试此接口：`xmake lua lib.detect.find_file test.h /usr/local`
</p>

#### detect.find_path

- 查找路径

这个接口的用法跟[lib.detect.find_file](#detect-find_file)类似，唯一的区别是返回的结果不同。
此接口查找到传入的文件路径后，返回的是对应的搜索路径，而不是文件路径本身，一般用于查找文件对应的父目录位置。

```lua
import("lib.detect.find_path")

local p = find_path("include/test.h", { "/usr", "/usr/local"})
```

上述代码如果查找成功，则返回：`/usr/local`，如果`test.h`在`/usr/local/include/test.h`的话。

还有一个区别就是，这个接口传入不只是文件路径，还可以传入目录路径来查找：

```lua
local p = find_path("lib/xxx", { "$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name)"})
```

同样，此接口也支持模式匹配和后缀子目录：

```lua
local p = find_path("include/*.h", { "/usr", "/usr/local/**"}, {suffixes = "/subdir"})
```

#### detect.find_library

- 查找库文件

此接口用于指定的搜索目录中查找库文件（静态库，动态库），例如：

```lua
import("lib.detect.find_library")

local library = find_library("crypto", {"/usr/lib", "/usr/local/lib"})
```

在macosx上运行，返回的结果如下：

```lua
{
    filename = libcrypto.dylib
,   linkdir = /usr/lib
,   link = crypto
,   kind = shared
}
```

如果不指定是否需要静态库还是动态库，那么此接口会自动选择一个存在的库（有可能是静态库、也有可能是动态库）进行返回。

如果需要强制指定需要查找的库类型，可以指定kind参数为（`static/shared`）：

```lua
local library = find_library("crypto", {"/usr/lib", "/usr/local/lib"}, {kind = "static"})
```

此接口也支持suffixes后缀子目录搜索和模式匹配操作：

```lua
local library = find_library("cryp*", {"/usr", "/usr/local"}, {suffixes = "/lib"})
```

#### detect.find_program

- 查找可执行程序

这个接口比[lib.detect.find_tool](#detect-find_tool)较为原始底层，通过指定的参数目录来查找可执行程序。

```lua
import("lib.detect.find_program")

local program = find_program("ccache")
```

上述代码犹如没有传递搜索目录，所以它会尝试直接执行指定程序，如果运行ok，那么直接返回：`ccache`，表示查找成功。

指定搜索目录，修改尝试运行的检测命令参数（默认是：`ccache --version`）：

```lua
local program = find_program("ccache", {pathes = {"/usr/bin", "/usr/local/bin"}, check = "--help"}) 
```

上述代码会尝试运行：`/usr/bin/ccache --help`，如果运行成功，则返回：`/usr/bin/ccache`。

如果`--help`也没法满足需求，有些程序没有`--version/--help`参数，那么可以自定义运行脚本，来运行检测：

```lua
local program = find_program("ccache", {pathes = {"/usr/bin", "/usr/local/bin"}, check = function (program) os.run("%s -h", program) end})
```

同样，搜索路径列表支持内建变量和自定义脚本：

```lua
local program = find_program("ccache", {pathes = {"$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug;Debugger)"}})
local program = find_program("ccache", {pathes = {"$(env PATH)", function () return "/usr/local/bin" end}})
```

<p class="tip">
为了加速频发查找的效率，此接口是默认自带cache的，所以就算频繁查找相同的程序，也不会花太多时间。
如果要禁用cache，可以在工程目录执行`xmake f -c`清除本地cache。
</p>

我们也可以通过`xmake lua lib.detect.find_program ccache` 来快速测试。

#### detect.find_programver

- 查找可执行程序版本号


```lua
import("lib.detect.find_programver")

local programver = find_programver("ccache")
```

返回结果为：3.2.2

默认它会通过`ccache --version`尝试获取版本，如果不存在此参数，可以自己指定其他参数：

```lua
local version = find_programver("ccache", {command = "-v"})
```

甚至自定义版本获取脚本：

```lua
local version = find_programver("ccache", {command = function () return os.iorun("ccache --version") end})
```

对于版本号的提取规则，如果内置的匹配模式不满足要求，也可以自定义：

```lua
local version = find_programver("ccache", {command = "--version", parse = "(%d+%.?%d*%.?%d*.-)%s"})
local version = find_programver("ccache", {command = "--version", parse = function (output) return output:match("(%d+%.?%d*%.?%d*.-)%s") end})
```

<p class="tip">
为了加速频发查找的效率，此接口是默认自带cache的，如果要禁用cache，可以在工程目录执行`xmake f -c`清除本地cache。
</p>

我们也可以通过`xmake lua lib.detect.find_programver ccache` 来快速测试。

#### detect.find_package

- 查找包文件

此接口也是用于查找库文件，但是比[lib.detect.find_library](#detect-find_library)更加上层，也更为强大和简单易用，因为它是以包为力度进行查找。

那怎样算是一个完整的包，它包含：

1. 多个静态库或者动态库文件
2. 库的搜索目录
3. 头文件的搜索目录
4. 可选的编译链接选项，例如：`defines`等
5. 可选的版本号

例如我们查找一个openssl包：

```lua
import("lib.detect.find_package")

local package = find_package("openssl")
```

返回的结果如下：

```lua
{links = {"ssl", "crypto", "z"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}}
```

如果查找成功，则返回一个包含所有包信息的table，如果失败返回nil

这里的返回结果可以直接作为`target:add`, `option:add`的参数传入，用于动态增加`target/option`的配置：

```lua
option("zlib")
    set_showmenu(true)
    before_check(function (option)
        import("lib.detect.find_package")
        option:add(find_package("zlib"))
    end)
```

```lua
target("test")
    on_load(function (target)
        import("lib.detect.find_package")
        target:add(find_package("zlib"))
    end)
```

如果系统上装有`homebrew`, `pkg-config`等第三方工具，那么此接口会尝试使用它们去改进查找结果。

我们也可以通过指定版本号，来选择查找指定版本的包（如果这个包获取不到版本信息或者没有匹配版本的包，则返回nil）：

```lua
local package = find_package("openssl", {version = "1.0.1"})
```

默认情况下查找的包是根据如下规则匹配平台，架构和模式的：

1. 如果参数传入指定了`{plat = "iphoneos", arch = "arm64", mode = "release"}`，则优先匹配，例如：`find_package("openssl", {plat = "iphoneos"})`。
2. 如果是在当前工程环境，存在配置文件，则优先尝试从`config.get("plat")`, `config.get("arch")`和`config.get("mode")`获取平台架构进行匹配。
3. 最后从`os.host()`和`os.arch()`中进行匹配，也就是当前主机的平台架构环境。

如果系统的库目录以及`pkg-config`都不能满足需求，找不到包，那么可以自己手动设置搜索路径：

```lua
local package = find_package("openssl", {linkdirs = {"/usr/lib", "/usr/local/lib"}, includedirs = "/usr/local/include"})
```

也可以同时指定需要搜索的链接名，头文件名：

```lua
local package = find_package("openssl", {links = {"ssl", "crypto"}, includes = "ssl.h"}})
```

甚至可以指定xmake的`packagedir/*.pkg`包目录，用于查找对应的`openssl.pkg`包，一般用于查找内置在工程目录中的本地包。

例如，tbox工程内置了`pkg/openssl.pkg`本地包载项目中，我们可以通过下面的脚本，传入`{packagedirs = ""}`参数优先查找本地包，如果找不到再去找系统包。

```lua
target("test")
    on_load(function (target)
        import("lib.detect.find_package")
        target:add(find_package("openssl", {packagedirs = path.join(os.projectdir(), "pkg")}))
    end)
```

总结下，现在的查找顺序：

1. 如果指定`{packagedirs = ""}`参数，优先从这个参数指定的路径中查找本地包`*.pkg`
2. 如果在`xmake/modules`下面存在`detect.packages.find_xxx`脚本，那么尝试调用此脚本来改进查找结果
3. 如果系统存在vcpkg，优先从vcpkg的包管理系统中去获取包
4. 如果系统存在`pkg-config`，并且查找的是系统环境的库，则尝试使用`pkg-config`提供的路径和链接信息进行查找
5. 如果系统存在`homebrew`，并且查找的是系统环境的库，则尝试使用`brew --prefix xxx`提供的信息进行查找
6. 从参数中指定的pathes路径和一些已知的系统路径`/usr/lib`, `/usr/include`中进行查找

这里需要着重说下第二点，通过在`detect.packages.find_xxx`脚本来改进查找结果，很多时候自动的包探测是没法完全探测到包路径的，
尤其是针对windows平台，没有默认的库目录，也没有包管理app，很多库装的时候，都是自己所处放置在系统目录，或者添加注册表项。

因此查找起来没有统一的规则，这个时候，就可以自定义一个查找脚本，去改进`find_package`的查找机制，对指定包进行更精准的查找。

在xmake自带的`xmake/modules/detect/packages`目录下，已经有许多的内置包脚本，来对常用的包进行更好的查找支持。
当然这不可能满足所有用户的需求，如果用户需要的包还是找不到，那么可以自己定义一个查找脚本，例如：

查找一个名为`openssl`的包，可以编写一个`find_openssl.lua`的脚本放置在工程目录：

```
projectdir
 - xmake
   - modules
     - detect/package/find_openssl.lua
```

然后在工程的`xmake.lua`文件的开头指定下这个modules的目录：

```lua
add_moduledirs("$(projectdir)/xmake/modules")
```

这样xmake就能找到自定义的扩展模块了。

接下来我们看下`find_openssl.lua`的实现：

```lua
-- imports
import("lib.detect.find_path")
import("lib.detect.find_library")

-- find openssl 
--
-- @param opt   the package options. e.g. see the options of find_package()
--
-- @return      see the return value of find_package()
--
function main(opt)

    -- for windows platform
    --
    -- http://www.slproweb.com/products/Win32OpenSSL.html
    --
    if opt.plat == "windows" then

        -- init bits
        local bits = ifelse(opt.arch == "x64", "64", "32")

        -- init search pathes
        local pathes = {"$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\OpenSSL %(" .. bits .. "-bit%)_is1;Inno Setup: App Path)",
                        "$(env PROGRAMFILES)/OpenSSL",
                        "$(env PROGRAMFILES)/OpenSSL-Win" .. bits,
                        "C:/OpenSSL",
                        "C:/OpenSSL-Win" .. bits}

        -- find library
        local result = {links = {}, linkdirs = {}, includedirs = {}}
        for _, name in ipairs({"libssl", "libcrypto"}) do
            local linkinfo = find_library(name, pathes, {suffixes = "lib"})
            if linkinfo then
                table.insert(result.links, linkinfo.link)
                table.insert(result.linkdirs, linkinfo.linkdir)
            end
        end

        -- not found?
        if #result.links ~= 2 then
            return 
        end

        -- find include
        table.insert(result.includedirs, find_path("openssl/ssl.h", pathes, {suffixes = "include"}))

        -- ok
        return result
    end
end
```

里面对windows平台进行注册表读取，去查找指定的库文件，其底层其实也是调用的[find_library](#detect-find_library)等接口。

<p class="tip">
为了加速频发查找的效率，此接口是默认自带cache的，如果要禁用cache，可以在工程目录执行`xmake f -c`清除本地cache。
也可以通过指定force参数，来禁用cache，强制重新查找：`find_package("openssl", {force = true})`
</p>

我们也可以通过`xmake lua lib.detect.find_package openssl` 来快速测试。

2.2.5版本之后，新增了内置接口[find_packages](#find_packages)，可以同时查找多个包，并且不需要通过import导入即可直接使用。

并且此版本之后，支持显式的从指定第三方包管理器中查找包，例如：

```lua
find_package("brew::pcre2/libpcre2-8")
```

由于每个第三方包管理器的包名不完全一致，比如pcre2在homebrew中有三个库版本，我们可以通过上面的方式，指定查找对应libpcre2-8版本的库。

另外，对于vcpkg, conan也可以通过加上`vcpkg::`, `conan::`包命名空间来指定查找里面的库。

#### detect.find_tool

- 查找工具

此接口也是用于查找可执行程序，不过比[lib.detect.find_program](#detect-find_program)更加的高级，功能也更加强大，它对可执行程序进行了封装，提供了工具这个概念：

* toolname: 工具名，可执行程序的简称，用于标示某个工具，例如：`gcc`, `clang`等
* program: 可执行程序命令，例如：`xcrun -sdk macosx clang`

其对应关系如下：

| toolname  | program                             |
| --------- | ----------------------------------- |
| clang     | `xcrun -sdk macosx clang`           |
| gcc       | `/usr/toolchains/bin/arm-linux-gcc` |
| link      | `link.exe -lib`                     |

[lib.detect.find_program](#detect-find_program)只能通过传入的原始program命令或路径，去判断该程序是否存在。
而`find_tool`则可以通过更加一致的toolname去查找工具，并且返回对应的program完整命令路径，例如：

```lua
import("lib.detect.find_tool")

local tool = find_tool("clang")
```

返回的结果为：`{name = "clang", program = "clang"}`，这个时候还看不出区别，我们可以手动指定可执行的命令：

```lua
local tool = find_tool("clang", {program = "xcrun -sdk macosx clang"})
```

返回的结果为：`{name = "clang", program = "xcrun -sdk macosx clang"}`

而在macosx下，gcc就是clang，如果我们执行`gcc --version`可以看到就是clang的一个马甲，我们可以通过`find_tool`接口进行智能识别：

```lua
local tool = find_tool("gcc")
```

返回的结果为：`{name = "clang", program = "gcc"}`

通过这个结果就可以看的区别来了，工具名实际会被标示为clang，但是可执行的命令用的是gcc。

我们也可以指定`{version = true}`参数去获取工具的版本，并且指定一个自定义的搜索路径，也支持内建变量和自定义脚本哦： 

```lua
local tool = find_tool("clang", {version = true, {pathes = {"/usr/bin", "/usr/local/bin", "$(env PATH)", function () return "/usr/xxx/bin" end}})
```

返回的结果为：`{name = "clang", program = "/usr/bin/clang", version = "4.0"}`

这个接口是对`find_program`的上层封装，因此也支持自定义脚本检测：

```lua
local tool = find_tool("clang", {check = "--help"}) 
local tool = find_tool("clang", {check = function (tool) os.run("%s -h", tool) end})
```

最后总结下，`find_tool`的查找流程：

1. 优先通过`{program = "xxx"}`的参数来尝试运行和检测。
2. 如果在`xmake/modules/detect/tools`下存在`detect.tools.find_xxx`脚本，则调用此脚本进行更加精准的检测。
3. 尝试从`/usr/bin`，`/usr/local/bin`等系统目录进行检测。

我们也可以在工程`xmake.lua`中`add_moduledirs`指定的模块目录中，添加自定义查找脚本，来改进检测机制：

```
projectdir
  - xmake/modules
    - detect/tools/find_xxx.lua
```

例如我们自定义一个`find_7z.lua`的查找脚本：

```lua
import("lib.detect.find_program")
import("lib.detect.find_programver")

function main(opt)

    -- init options
    opt = opt or {}

    -- find program
    local program = find_program(opt.program or "7z", opt.pathes, opt.check or "--help")

    -- find program version
    local version = nil
    if program and opt and opt.version then
        version = find_programver(program, "--help", "(%d+%.?%d*)%s")
    end

    -- ok?
    return program, version
end
```

将它放置到工程的模块目录下后，执行：`xmake l lib.detect.find_tool 7z`就可以查找到了。

<p class="tip">
为了加速频发查找的效率，此接口是默认自带cache的，如果要禁用cache，可以在工程目录执行`xmake f -c`清除本地cache。
</p>

我们也可以通过`xmake lua lib.detect.find_tool clang` 来快速测试。

#### detect.find_toolname

- 查找工具名

通过program命令匹配对应的工具名，例如：

| program                   | toolname   |
| ------------------------- | ---------- |
| `xcrun -sdk macosx clang` | clang      |
| `/usr/bin/arm-linux-gcc`  | gcc        |
| `link.exe -lib`           | link       |
| `gcc-5`                   | gcc        |
| `arm-android-clang++`     | clangxx    |
| `pkg-config`              | pkg_config |

toolname相比program，更能唯一标示某个工具，也方便查找和加载对应的脚本`find_xxx.lua`。

#### detect.find_cudadevices

- 查找本机的 CUDA 设备

通过 CUDA Runtime API 枚举本机的 CUDA 设备，并查询其属性。

```lua
import("lib.detect.find_cudadevices")

local devices = find_cudadevices({ skip_compute_mode_prohibited = true })
local devices = find_cudadevices({ min_sm_arch = 35, order_by_flops = true })
```

返回的结果为：`{ { ['$id'] = 0, name = "GeForce GTX 960M", major = 5, minor = 0, ... }, ... }`

包含的属性依据当前 CUDA 版本会有所不同，可以参考 [CUDA 官方文档](https://docs.nvidia.com/cuda/cuda-runtime-api/structcudaDeviceProp.html#structcudaDeviceProp)及其历史版本。

#### detect.features

- 获取指定工具的所有特性

此接口跟[compiler.features](#compiler-features)类似，区别就是此接口更加的原始，传入的参数是实际的工具名toolname。

并且此接口不仅能够获取编译器的特性，任何工具的特性都可以获取，因此更加通用。

```lua
import("lib.detect.features")

local features = features("clang")
local features = features("clang", {flags = "-O0", program = "xcrun -sdk macosx clang"})
local features = features("clang", {flags = {"-g", "-O0", "-std=c++11"}})
```

通过传入flags，可以改变特性的获取结果，例如一些c++11的特性，默认情况下获取不到，通过启用`-std=c++11`后，就可以获取到了。

所有编译器的特性列表，可以见：[compiler.features](#compiler-features)。

#### detect.has_features

- 判断指定特性是否支持

此接口跟[compiler.has_features](#compiler-has_features)类似，但是更加原始，传入的参数是实际的工具名toolname。

并且此接口不仅能够判断编译器的特性，任何工具的特性都可以判断，因此更加通用。

```lua
import("lib.detect.has_features")

local features = has_features("clang", "cxx_constexpr")
local features = has_features("clang", {"cxx_constexpr", "c_static_assert"}, {flags = {"-g", "-O0"}, program = "xcrun -sdk macosx clang"})
local features = has_features("clang", {"cxx_constexpr", "c_static_assert"}, {flags = "-g"})
```

如果指定的特性列表存在，则返回实际支持的特性子列表，如果都不支持，则返回nil，我们也可以通过指定flags去改变特性的获取规则。

所有编译器的特性列表，可以见：[compiler.features](#compiler-features)。

#### detect.has_flags

- 判断指定参数选项是否支持

此接口跟[compiler.has_flags](#compiler-has_flags)类似，但是更加原始，传入的参数是实际的工具名toolname。

```lua
import("lib.detect.has_flags")

local ok = has_flags("clang", "-g")
local ok = has_flags("clang", {"-g", "-O0"}, {program = "xcrun -sdk macosx clang"})
local ok = has_flags("clang", "-g -O0", {toolkind = "cxx"})
```

如果检测通过，则返回true。

此接口的检测做了一些优化，除了cache机制外，大部分场合下，会去拉取工具的选项列表（`--help`）直接判断，如果选项列表里获取不到的话，才会通过尝试运行的方式来检测。

#### detect.has_cfuncs

- 判断指定c函数是否存在

此接口是[lib.detect.check_cxsnippets](#detect-check_cxsnippets)的简化版本，仅用于检测函数。

```lua
import("lib.detect.has_cfuncs")

local ok = has_cfuncs("setjmp")
local ok = has_cfuncs({"sigsetjmp((void*)0, 0)", "setjmp"}, {includes = "setjmp.h"})
```

对于函数的描述规则如下：

| 函数描述                                        | 说明          |
| ----------------------------------------------- | ------------- |
| `sigsetjmp`                                     | 纯函数名      |
| `sigsetjmp((void*)0, 0)`                        | 函数调用      |
| `sigsetjmp{int a = 0; sigsetjmp((void*)a, a);}` | 函数名 + {}块 |

在最后的可选参数中，除了可以指定`includes`外，还可以指定其他的一些参数用于控制编译检测的选项条件：

```lua
{ verbose = false, target = [target|option], includes = .., config = {linkdirs = .., links = .., defines = ..}}
```

其中verbose用于回显检测信息，target用于在检测前追加target中的配置信息, 而config用于自定义配置跟target相关的编译选项。

#### detect.has_cxxfuncs

- 判断指定c++函数是否存在

此接口跟[lib.detect.has_cfuncs](#detect-has_cfuncs)类似，请直接参考它的使用说明，唯一区别是这个接口用于检测c++函数。

#### detect.has_cincludes

- 判断指定c头文件是否存在

此接口是[lib.detect.check_cxsnippets](#detect-check_cxsnippets)的简化版本，仅用于检测头文件。

```lua
import("lib.detect.has_cincludes")

local ok = has_cincludes("stdio.h")
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {target = target})
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {config = {defines = "_GNU_SOURCE=1", languages = "cxx11"}})
```

#### detect.has_cxxincludes

- 判断指定c++头文件是否存在

此接口跟[lib.detect.has_cincludess](#detect-has_cincludes)类似，请直接参考它的使用说明，唯一区别是这个接口用于检测c++头文件。

#### detect.has_ctypes

- 判断指定c类型是否存在

此接口是[lib.detect.check_cxsnippets](#detect-check_cxsnippets)的简化版本，仅用于检测函数。

```lua
import("lib.detect.has_ctypes")

local ok = has_ctypes("wchar_t")
local ok = has_ctypes({"char", "wchar_t"}, {includes = "stdio.h"})
local ok = has_ctypes("wchar_t", {includes = {"stdio.h", "stdlib.h"}, config = {"defines = "_GNU_SOURCE=1", languages = "cxx11"}})
```

#### detect.has_cxxtypes

- 判断指定c++类型是否存在

此接口跟[lib.detect.has_ctypess](#detect-has_ctypes)类似，请直接参考它的使用说明，唯一区别是这个接口用于检测c++类型。

#### detect.check_cxsnippets

- 检测c/c++代码片段是否能够编译通过

通用的c/c++代码片段检测接口，通过传入多个代码片段列表，它会自动生成一个编译文件，然后常识对它进行编译，如果编译通过返回true。

对于一些复杂的编译器特性，连[compiler.has_features](#compiler-has_features)都无法检测到的时候，可以通过此接口通过尝试编译来检测它。

```lua
import("lib.detect.check_cxsnippets")

local ok = check_cxsnippets("void test() {}")
local ok = check_cxsnippets({"void test(){}", "#define TEST 1"}, {types = "wchar_t", includes = "stdio.h"})
```

此接口是[detect.has_cfuncs](#detect-has_cfuncs), [detect.has_cincludes](#detect-has_cincludes)和[detect.has_ctypes](detect-has_ctypes)等接口的通用版本，也更加底层。

因此我们可以用它来检测：types, functions, includes 还有 links，或者是组合起来一起检测。

第一个参数为代码片段列表，一般用于一些自定义特性的检测，如果为空，则可以仅仅检测可选参数中条件，例如：

```lua
local ok = check_cxsnippets({}, {types = {"wchar_t", "char*"}, includes = "stdio.h", funcs = {"sigsetjmp", "sigsetjmp((void*)0, 0)"}})
```

上面那个调用，会去同时检测types, includes和funcs是否都满足，如果通过返回true。

还有其他一些可选参数：

```lua
{ verbose = false, target = [target|option], sourcekind = "[cc|cxx]"}
```

其中verbose用于回显检测信息，target用于在检测前追加target中的配置信息, sourcekind 用于指定编译器等工具类型，例如传入`cxx`强制作为c++代码来检测。

### net.http

此模块提供http的各种操作支持，目前提供的接口如下：

| 接口                                                | 描述                                         | 支持版本             |
| --------------------------------------------------- | -------------------------------------------- | -------------------- |
| [http.download](#http-download)                     | 下载http文件                                 | >= 2.1.5             |

#### http.download

- 下载http文件

这个接口比较简单，就是单纯的下载文件。

```lua
import("net.http")

http.download("https://xmake.io", "/tmp/index.html")
```

### privilege.sudo

此接口用于通过`sudo`来运行命令，并且提供了平台一致性处理，对于一些需要root权限运行的脚本，可以使用此接口。

<p class="warning">
为了保证安全性，除非必须使用的场合，其他情况下尽量不要使用此接口。
</p>

| 接口                                                | 描述                                         | 支持版本             |
| --------------------------------------------------- | -------------------------------------------- | -------------------- |
| [sudo.has](#sudo-has)                               | 判断sudo是否支持                             | >= 2.1.5             |
| [sudo.run](#sudo-run)                               | 安静运行程序                                 | >= 2.1.5             |
| [sudo.runv](#sudo-runv)                             | 安静运行程序，带参数列表                     | >= 2.1.5             |
| [sudo.exec](#sudo-exec)                             | 回显运行程序                                 | >= 2.1.5             |
| [sudo.execv](#sudo-execv)                           | 回显运行程序，带参数列表                     | >= 2.1.5             |
| [sudo.iorun](#sudo-iorun)                           | 运行并获取程序输出内容                       | >= 2.1.5             |
| [sudo.iorunv](#sudo-iorunv)                         | 运行并获取程序输出内容，带参数列表           | >= 2.1.5             |

#### sudo.has

-  判断sudo是否支持

目前仅在`macosx/linux`下支持sudo，windows上的管理员权限运行暂时还不支持，因此建议使用前可以通过此接口判断支持情况后，针对性处理。

```lua
import("privilege.sudo")

if sudo.has() then
    sudo.run("rm /system/file")
end
```

#### sudo.run

- 安静运行原生shell命令

具体用法可参考：[os.run](#os-run)。

```lua
import("privilege.sudo")

sudo.run("rm /system/file")
```

#### sudo.runv

- 安静运行原生shell命令，带参数列表

具体用法可参考：[os.runv](#os-runv)。

#### sudo.exec

- 回显运行原生shell命令

具体用法可参考：[os.exec](#os-exec)。

#### sudo.execv

- 回显运行原生shell命令，带参数列表

具体用法可参考：[os.execv](#os-execv)。

#### sudo.iorun

- 安静运行原生shell命令并获取输出内容

具体用法可参考：[os.iorun](#os-iorun)。

#### sudo.iorunv

- 安静运行原生shell命令并获取输出内容，带参数列表

具体用法可参考：[os.iorunv](#os-iorunv)。

### devel.git

此接口提供了git各种命令的访问接口，相对于直接调用git命令，此模块提供了更加上层易用的封装接口，并且提供对git的自动检测和跨平台处理。

<p class="tip">
目前windows上，需要手动安装git包后，才能检测到，后续版本会提供自动集成git功能，用户将不用关心如何安装git，就可以直接使用。
</p>

| 接口                                                | 描述                                         | 支持版本             |
| --------------------------------------------------- | -------------------------------------------- | -------------------- |
| [git.clone](#git-clone)                             | clone代码库                                  | >= 2.1.5             |
| [git.pull](#git-pull)                               | 拉取代码库最新提交                           | >= 2.1.5             |
| [git.clean](#git-clean)                             | 清理代码库文件                               | >= 2.1.5             |
| [git.checkout](#git-checkout)                       | 签出指定分支版本                             | >= 2.1.5             |
| [git.refs](#git-refs)                               | 获取所有引用列表                             | >= 2.1.5             |
| [git.tags](#git-tags)                               | 获取所有标记列表                             | >= 2.1.5             |
| [git.branches](#git-branches)                       | 获取所有分支列表                             | >= 2.1.5             |

#### git.clone

- clone代码库

此接口对应`git clone`命令

```lua
import("devel.git")
 
git.clone("git@github.com:tboox/xmake.git")
git.clone("git@github.com:tboox/xmake.git", {depth = 1, branch = "master", outputdir = "/tmp/xmake"})
```

#### git.pull

- 拉取代码库最新提交

此接口对应`git pull`命令

```lua
import("devel.git")
 
git.pull()
git.pull({remote = "origin", tags = true, branch = "master", repodir = "/tmp/xmake"})
```

#### git.clean

- 清理代码库文件

此接口对应`git clean`命令

```lua
import("devel.git")
 
git.clean()
git.clean({repodir = "/tmp/xmake", force = true})
```

#### git.checkout

- 签出指定分支版本

此接口对应`git checkout`命令

```lua
import("devel.git")
 
git.checkout("master", {repodir = "/tmp/xmake"})
git.checkout("v1.0.1", {repodir = "/tmp/xmake"})
```

#### git.refs

- 获取所有引用列表 

此接口对应`git ls-remote --refs`命令

```lua
import("devel.git")
 
local refs = git.refs(url)
```

#### git.tags

- 获取所有标记列表 

此接口对应`git ls-remote --tags`命令

```lua
import("devel.git")
 
local tags = git.tags(url)
```

#### git.branches

- 获取所有分支列表 

此接口对应`git ls-remote --heads`命令

```lua
import("devel.git")
 
local branches = git.branches(url)
```

### utils.archive

此模块用于压缩和解压缩文件。

| 接口                                                | 描述                                         | 支持版本             |
| --------------------------------------------------- | -------------------------------------------- | -------------------- |
| [archive.extract](#archive-extract)                 | 解压文件                                     | >= 2.1.5             |

#### archive.extract

- 解压文件

支持大部分常用压缩文件的解压，它会自动检测系统提供了哪些解压工具，然后适配到最合适的解压器对指定压缩文件进行解压操作。

```lua
import("utils.archive")

archive.extract("/tmp/a.zip", "/tmp/outputdir")
archive.extract("/tmp/a.7z", "/tmp/outputdir")
archive.extract("/tmp/a.gzip", "/tmp/outputdir")
archive.extract("/tmp/a.tar.bz2", "/tmp/outputdir")
```
