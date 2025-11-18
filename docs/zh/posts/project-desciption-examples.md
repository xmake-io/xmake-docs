---
title: 使用xmake优雅地描述工程
tags: [xmake, lua, 工程描述]
date: 2017-04-05
author: Ruki
outline: deep
---

### 描述语法

xmake的描述语法基于lua实现，因此描述语法继承了lua的灵活性和简洁性，并且通过28原则，将描述作用域（简单描述）、脚本作用域（复杂描述）进行分离，使得工程更加的简洁直观，可读性非常好。

因为80%的工程，并不需要很复杂的脚本控制逻辑，只需要简单的几行配置描述，就可满足构建需求，基于这个假设，xmake分离作用域，使得80%的`xmake.lua`文件，只需要这样描述：

```lua
target("demo")
    set_kind("binary")
    add_files("src/*.c")
```

而仅有的20%的工程，才需要这样描述：

```lua
target("demo")
    set_kind("shared")
    set_objectdir("$(buildir)/.objs")
    set_targetdir("libs/armeabi")
    add_files("jni/*.c")

    on_package(function (target) 
        os.run("ant debug") 
    end)

    on_install(function (target) 
        os.run("adb install -r ./bin/Demo-debug.apk")
    end)

    on_run(function (target) 
        os.run("adb shell am start -n com.demo/com.demo.DemoTest")
        os.run("adb logcat")
    end)
```

上面的`function () end`部分属于自定义脚本域，一般情况下是不需要设置的，只有在需要复杂的工程描述、高度定制化需求的情况下，才需要自定义他们，在这个作用域可以使用各种xmake提供的扩展模块，关于这个的更多介绍，见：[xmake 描述语法和作用域详解](https://xmake.io/zh/)。

而上面的代码，也是一个自定义混合构建jni和java代码的android工程，可以直接通过`xmake run`命令，实现一键自动构建、安装、运行apk程序。

下面介绍一些比较常用的xmake描述实例：









### 构建一个可执行程序

```lua
target("demo")
    set_kind("binary")
    add_files("src/*.c")
```

这是一个最简单经典的实例，一般情况下，这种情况，你不需要自己写任何`xmake.lua`文件，在当前代码目录下，直接执行`xmake`命令，就可以完成构建，并且会自动帮你生成一个`xmake.lua`。

关于自动生成的详细信息，见：[xmake智能代码扫描编译模式，无需手写任何make文件](https://xmake.io/zh/)。

### 构建一个可配置切换的库程序

```lua
target("demo")
    set_kind("$(kind)")
    add_files("src/*.c")
```

可通过配置，切换是否编译动态库还是静态库：

```bash
$ xmake f --kind=static; xmake
$ xmake f --kind=shared; xmake
```

### 增加debug和release编译模式支持

也许默认的几行描述配置，已经不能满足你的需求，你需要可以通过切换编译模式，构建debug和release版本的程序，那么只需要：

```lua
if is_mode("debug") then
    set_symbols("debug")
    set_optimize("none")
end

if is_mode("release") then
    set_symbols("hidden")
    set_optimize("fastest")
    set_strip("all")
end

target("demo")
    set_kind("binary")
    add_files("src/*.c") 
```

你只需要通过配置来切换构建模式：

```bash
$ xmake f -m debug; xmake
$ xmake f -m release; xmake
```

`[-m|--mode]`属于内置选项，不需要自己定义`option`，就可使用，并且模式的值是用户自己定义和维护的，你可以在`is_mode("xxx")`判断各种模式状态。

### 通过自定义脚本签名ios程序

ios的可执行程序，在设备上运行，需要在构建完成后进行签名，这个时候就可以使用自定义脚本来实现：

```lua
target("demo")
    set_kind("binary")
    add_files("src/*.m") 
    after_build(function (target))
        os.run("ldid -S %s", target:targetfile())
    end
```

这里只是用ldid程序做了个假签名，只能在越狱设备上用哦，仅仅作为例子参考哈。

### 内置变量和外置变量

xmake提供了`$(varname)`的语法，来支持内置变量的获取，例如：

```lua
add_cxflags("-I$(buildir)")
```

它将会在在实际编译的时候，将内置的`buildir`变量转换为实际的构建输出目录：`-I./build`

一般内置变量可用于在传参时快速获取和拼接变量字符串，例如：

```lua
target("test")
    add_files("$(projectdir)/src/*.c")
    add_includedirs("$(buildir)/inc")
```

也可以在自定义脚本的模块接口中使用，例如：

```lua
target("test")
    on_run(function (target)
        os.cp("$(scriptdir)/xxx.h", "$(buildir)/inc")
    end)
```

当然这种变量模式，也是可以扩展的，默认通过`xmake f --var=val`命令，配置的参数都是可以直接获取，例如：

```lua
target("test")
    add_defines("-DTEST=$(var)")
```

既然支持直接从配置选项中获取，那么当然也就能很方便的扩展自定义的选项，来获取自定义的变量了，具体如何自定义选项见：[option](https://xmake.io/zh/)

### 修改目标文件名

我们可以通过内建变量，将生成的目标文件按不同架构和平台进行分离，例如：

```lua
target("demo")
    set_kind("binary")
    set_basename("demo_$(arch)")
    set_targetdir("$(buildir)/$(plat)")
```

之前的默认设置，目标文件会生成为`build\demo`，而通过上述代码的设置，目标文件在不同配置构建下，路径和文件名也不尽相同，执行：

```bash
$ xmake f -p iphoneos -a arm64; xmake
```

则目标文件为：`build/iphoneos/demo_arm64`。

### 添加子目录工程模块

如果你有多个target子模块，那么可以在一个`xmake.lua`中进行定义，例如：

```lua
target("demo")
    set_kind("binary")
    add_files("src/demo.c")

target("test")
    set_kind("binary")
    add_files("src/test.c")
```

但是，如果子模块非常多，那么放置在一个xmake文件，就显得有些臃肿了，可以放置到独立模块的子目录去：

```lua
target("demo")
    set_kind("binary")
    add_files("src/demo.c")

add_subdirs("src/test")
```

通过上述代码，关联一个子工程目录，在里面加上`test`的工程目标就行了。

### 安装头文件

```
target("tbox")
    set_kind("static")
    add_files("src/*.c")

    add_headers("../(tbox/**.h)|**/impl/**.h")
    set_headerdir("$(buildir)/inc")
```

安装好的头文件位置和目录结构为：`build/inc/tbox/*.h`。

其中`../(tbox/**.h)`带括号的部分，为实际要安装的根路径，`|**/impl/**.h`部分用于排除不需要安装的文件。

其通配符匹配规则、排除规则可参考[add_files](https://xmake.io/zh/)。                                                                 

### 多目标依赖构建

多个target工程目标，默认构建顺序是未定义的，一般按顺序的方式进行，如果你需要调整构建顺序，可以通过添加依赖顺序来实现：

```lua
target("test1")
    set_kind("static")
    set_files("*.c")

target("test2")
    set_kind("static")
    set_files("*.c")

target("demo")
    add_deps("test1", "test2")
    add_links("test1", "test2")
```

上面的例子，在编译目标demo的时候，需要先编译test1, test2目标，因为demo会去用到它们。

### 合并静态库

xmake的[add_files](https://xmake.io/zh/)接口功能是非常强大的，不仅可以支持多种语言文件的混合添加构建，还可以直接添加静态库，进行自动合并库到当前的工程目标中去。

我们可以这么写：

```lua
target("demo")
    set_kind("static")
    add_files("src/*.c", "libxxx.a", "lib*.a", "xxx.lib")
```

直接在编译静态库的时候，合并多个已有的静态库，注意不是链接哦，这跟[add_links](https://xmake.io/zh/)是有区别的。

并且你也可以直接追加对象文件：

```lua
target("demo")
    set_kind("binary")
    add_files("src/*.c", "objs/*.o")
```

### 添加自定义配置选项

我们可以自己定义一个配置选项，例如用于启用test：

```lua
option("test")
    set_default(false)
    set_showmenu(true)
    add_defines("-DTEST")
```

然后关联到指定的target中去：

```lua
target("demo")
    add_options("test")
```

这样，一个选项就算定义好了，如果这个选项被启用，那么编译这个target的时候，就会自动加上`-DTEST`的宏定义。

上面的设置，默认是禁用`test`选项的，接下来我们通过配置去启用这个选项：

```bash
$ xmake f --test=y
$ xmake
```

xmake的选项支持是非常强大的，除了上述基础用法外，还可以配置各种检测条件，实现自动检测，具体详情可参考：[option](https://xmake.io/zh/)和[依赖包的添加和自动检测机制](https://xmake.io/zh/)。

### 添加第三方依赖包

在target作用域中，添加集成第三方包依赖，例如：

```lua
target("test")
    set_kind("binary")
    add_packages("zlib", "polarssl", "pcre", "mysql")
```

这样，在编译test目标时，如果这个包存在的，将会自动追加包里面的宏定义、头文件搜索路径、链接库目录，也会自动链接包中所有库。

用户不再需要自己单独调用`add_links`，`add_includedirs`, `add_ldflags`等接口，来配置依赖库链接了。

对于如何设置包搜索目录，可参考[add_packagedirs](https://xmake.io/zh/)接口，依赖包详情请参考：[依赖包的添加和自动检测机制](https://xmake.io/zh/)。

### 生成配置头文件

如果你想在xmake配置项目成功后，或者自动检测某个选项通过后，把检测的结果写入配置头文件，那么需要调用这个接口来启用自动生成`config.h`文件。

使用方式例如：

```lua
target("test")
    set_config_h("$(buildir)/config.h")
    set_config_h_prefix("TB_CONFIG")
```

当这个target中通过下面的这些接口，对这个target添加了相关的选项依赖、包依赖、接口依赖后，如果某依赖被启用，那么对应的一些宏定义配置，会自动写入被设置的`config.h`文件中去。

* [add_options](https://xmake.io/zh/)
* [add_packages](https://xmake.io/zh/)
* [add_cfuncs](https://xmake.io/zh/)
* [add_cxxfuncs](https://xmake.io/zh/)

这些接口，其实底层都用到了option选项中的一些检测设置，例如：

```lua
option("wchar")

    -- 添加对wchar_t类型的检测
    add_ctypes("wchar_t")

    -- 如果检测通过，自动生成TB_CONFIG_TYPE_HAVE_WCHAR的宏开关到config.h
    add_defines_h_if_ok("$(prefix)_TYPE_HAVE_WCHAR")

target("test")

    -- 启用头文件自动生成
    set_config_h("$(buildir)/config.h")
    set_config_h_prefix("TB_CONFIG")

    -- 添加对wchar选项的依赖关联，只有加上这个关联，wchar选项的检测结果才会写入指定的config.h中去
    add_options("wchar")
```

### 检测库头文件和接口

我们可以在刚刚生成的`config.h`中增加一些库接口检测，例如：

```lua
target("demo")

    -- 设置和启用config.h
    set_config_h("$(buildir)/config.h")
    set_config_h_prefix("TEST")

    -- 仅通过参数一设置模块名前缀
    add_cfunc("libc",       nil,        nil,        {"sys/select.h"},   "select")

    -- 通过参数三，设置同时检测链接库：libpthread.a
    add_cfunc("pthread",    nil,        "pthread",  "pthread.h",        "pthread_create")

    -- 通过参数二设置接口别名
    add_cfunc(nil,          "PTHREAD",  nil,        "pthread.h",        "pthread_create")
```

生成的`config.h`结果如下：

```c
#ifndef TEST_H
#define TEST_H

// 宏命名规则：$(prefix)前缀 _ 模块名（如果非nil）_ HAVE _ 接口名或者别名 （大写）
#define TEST_LIBC_HAVE_SELECT 1
#define TEST_PTHREAD_HAVE_PTHREAD_CREATE 1
#define TEST_HAVE_PTHREAD 1

#endif
```

这样我们在代码里面就可以根据接口的支持力度来控制代码编译了。

### 自定义插件任务

task域用于描述一个自定义的任务实现，与[target](https://xmake.io/zh/)和[option](https://xmake.io/zh/)同级。

例如，这里定义一个最简单的任务：

```lua
task("hello")

    -- 设置运行脚本
    on_run(function ()
        print("hello xmake!")
    end)
```

这个任务只需要打印`hello xmake!`，那如何来运行呢？

由于这里没有使用[set_menu](https://xmake.io/zh/)设置菜单，因此这个任务只能在`xmake.lua`的自定义脚本或者其他任务内部调用，例如：

```lua
target("test")

    after_build(function (target)

        -- 导入task模块
        import("core.project.task")

        -- 运行hello任务
        task.run("hello")
    end)
```

此处在构建完test目标后运行hello任务，当然我们还可以传递参数哦:

```lua
task("hello")
    on_run(function (arg1, arg2, arg3)
        print("hello xmake!", arg1, arg2, arg3)
    end)

target("test")
    after_build(function (target)
        import("core.project.task")
        task.run("hello", {}, "arg1", "arg2", "arg3")
    end)
```

上述`task.run`的`{}`这个是用于传递插件菜单中的参数，这里没有通过[set_menu](https://xmake.io/zh/)设置菜单，此处传空。

xmake的插件支持也是功能很强大的，并且提供了很多内置的使用插件，具体请参考：[xmake插件手册](https://xmake.io/zh/)和[task手册](https://xmake.io/zh/)

或者可以参考xmake自带的一些[插件demo](https://github.com/xmake-io/xmake/blob/master/xmake/plugins/echo/xmake.lua)。

### 另外一种语法风格

xmake除了支持最常使用的`set-add`描述风格外，还支持另外一种语法风格：`key-val`，例如：

```lua
target
{
    name = "test",
    defines = "DEBUG",
    files = {"src/*.c", "test/*.cpp"}
}
```

这个等价于：

```lua
target("test")
    set_kind("static")
    add_defines("DEBUG")
    add_files("src/*.c", "test/*.cpp")
```

用户可以根据自己的喜好来选择合适的风格描述，但是这边的建议是：

```
* 针对简单的工程，不需要太过复杂的条件编译，可以使用key-val方式，更加精简，可读性好
* 针对复杂工程，需要更高的可控性，和灵活性的话，建议使用set-add方式
* 尽量不要两种风格混着写，虽然是支持的，但是这样对整个工程描述会感觉很乱，因此尽量统一风格作为自己的描述规范
```

另外，不仅对target，像option, task, template都是支持两种方式设置的，例如：

```lua
-- set-add风格
option("demo")
    set_default(true)
    set_showmenu(true)
    set_category("option")
    set_description("Enable or disable the demo module", "    =y|n")
```

```lua
-- key-val风格
option
{
    name = "demo",
    default = true,
    showmenu = true,
    category = "option",
    desciption = {"Enable or disable the demo module", "    =y|n"}
}
```

自定义的任务或者插件可以这么写：

```lua
-- set-add风格
task("hello")
    on_run(function ()
        print("hello xmake!")

    end)
    set_menu {
        usage = "xmake hello [options]",
        description = "Hello xmake!",
        options = {}
    }
```

```lua
-- key-val风格
task
{
    name = "hello",
    run = (function ()
        print("hello xmake!")
    end),
    menu = {
                usage = "xmake hello [options]",
                description = "Hello xmake!",
                options = {}
            }
}
```

### 结语

更多描述说明，可直接阅读[xmake的官方手册](https://xmake.io/zh/)，上面提供了完整的api文档和使用描述。