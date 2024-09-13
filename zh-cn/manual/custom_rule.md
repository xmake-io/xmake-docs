2.2.1发布后，xmake不仅原生支持多语言文件的构建，还允许用户通过自定义构建规则实现复杂的未知文件构建。

自定义构建规则可以使用 `set_extensions` 将一组文件扩展名关联到它们。

一旦这些扩展与规则相关联，稍后对 `add_files` 的调用将自动使用此自定义规则。

这是一个示例规则，它将使用 Pandoc 将添加到构建目标的 Markdown 文件转换为 HTML 文件：

```lua
-- Define a build rule for a markdown file
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        import("core.project.depend")
        import("utils.progress") -- it only for v2.5.9, we need use print to show progress below v2.5.8

        -- make sure build directory exists
        os.mkdir(target:targetdir())

        -- replace .md with .html
        local targetfile = path.join(target:targetdir(), path.basename(sourcefile) .. ".html")

        -- only rebuild the file if its changed since last run
        depend.on_changed(function ()
            -- call pandoc to make a standalone html file from a markdown file
            os.vrunv('pandoc', {"-s", "-f", "markdown", "-t", "html", "-o", targetfile, sourcefile})
            progress.show(opt.progress, "${color.build.object}markdown %s", sourcefile)
        end, {files = sourcefile})
    end)

target("test")
    set_kind("object")

    -- make the test target support the construction rules of the markdown file
    add_rules("markdown")

    -- adding a markdown file to build
    add_files("src/*.md")
    add_files("src/*.markdown")
```

还有一种以 `on_build_files` 形式代替 `on_build_file` 的方法，它允许您在一个函数调用中处理整个文件集。

第二种称为 `on_buildcmd_file` 和 `on_buildcmd_files` 的形式是声明性的；它不是运行任意 Lua 来构建目标，而是运行 Lua 来了解这些目标是如何构建的。

`buildcmd` 的优点是可以将这些规则导出到根本不需要 xmake 即可运行的 makefile。

我们可以使用 buildcmd 进一步简化它，如下所示：


```lua
-- Define a build rule for a markdown file
rule("markdown")
    set_extensions(".md", ".markdown")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)

        -- make sure build directory exists
        batchcmds:mkdir(target:targetdir())

        -- replace .md with .html
        local targetfile = path.join(target:targetdir(), path.basename(sourcefile) .. ".html")

        -- call pandoc to make a standalone html file from a markdown file
        batchcmds:vrunv('pandoc', {"-s", "-f", "markdown", "-t", "html", "-o", targetfile, sourcefile})
        batchcmds:show_progress(opt.progress, "${color.build.object}markdown %s", sourcefile)

        -- only rebuild the file if its changed since last run
        batchcmds:add_depfiles(sourcefile)
    end)

target("test")
    set_kind("object")

    -- make the test target support the construction rules of the markdown file
    add_rules("markdown")

    -- adding a markdown file to build
    add_files("src/*.md")
    add_files("src/*.markdown")
```

无论文件扩展名如何，文件都可以分配给特定规则。您可以通过在添加文件时设置 `rule` 自定义属性来完成此操作，如下例所示：

```lua
target("test")
    -- ...
    add_files("src/test/*.md.in", {rule = "markdown"})
```

一个target可以叠加应用多个rules去更加定制化实现自己的构建行为，甚至支持不同的构建环境。

!> 通过`add_files("*.md", {rule = "markdown"})`方式指定的规则，优先级高于`add_rules("markdown")`设置的规则。

### 内建规则

自从2.2.1版本后，xmake提供了一些内置规则去简化日常xmake.lua描述，以及一些常用构建环境的支持。

我们可以通过运行以下命令，查看完整的内置规则列表：

```bash
$ xmake show -l rules
```

#### mode.debug

为当前工程xmake.lua添加debug编译模式的配置规则，例如：

```lua
add_rules("mode.debug")
```

相当于：

```lua
if is_mode("debug") then
    set_symbols("debug")
    set_optimize("none")
end
```

我们可以通过：`xmake f -m debug`来切换到此编译模式。

#### mode.release

为当前工程xmake.lua添加release编译模式的配置规则，例如：

```lua
add_rules("mode.release")
```

!> 此模式默认不会带调试符号。

相当于：

```lua
if is_mode("release") then
    set_symbols("hidden")
    set_optimize("fastest")
    set_strip("all")
end
```

我们可以通过：`xmake f -m release`来切换到此编译模式。

#### mode.releasedbg

为当前工程xmake.lua添加releasedbg编译模式的配置规则，例如：

```lua
add_rules("mode.releasedbg")
```

!> 与release模式相比，此模式还会额外开启调试符号，这通常是非常有用的。

相当于：

```lua
if is_mode("releasedbg") then
    set_symbols("debug")
    set_optimize("fastest")
    set_strip("all")
end
```

我们可以通过：`xmake f -m releasedbg`来切换到此编译模式。

#### mode.minsizerel

为当前工程xmake.lua添加minsizerel编译模式的配置规则，例如：

```lua
add_rules("mode.minsizerel")
```

!> 与release模式相比，此模式更加倾向于最小代码编译优化，而不是速度优先。

相当于：

```lua
if is_mode("minsizerel") then
    set_symbols("hidden")
    set_optimize("smallest")
    set_strip("all")
end
```

我们可以通过：`xmake f -m minsizerel`来切换到此编译模式。

#### mode.check

为当前工程xmake.lua添加check编译模式的配置规则，一般用于内存检测，例如：

```lua
add_rules("mode.check")
```

相当于：

```lua
if is_mode("check") then
    set_symbols("debug")
    set_optimize("none")
    add_cxflags("-fsanitize=address", "-ftrapv")
    add_mxflags("-fsanitize=address", "-ftrapv")
    add_ldflags("-fsanitize=address")
end
```

我们可以通过：`xmake f -m check`来切换到此编译模式。

#### mode.profile

为当前工程xmake.lua添加profile编译模式的配置规则，一般用于性能分析，例如：

```lua
add_rules("mode.profile")
```

相当于：

```lua
if is_mode("profile") then
    set_symbols("debug")
    add_cxflags("-pg")
    add_ldflags("-pg")
end
```

我们可以通过：`xmake f -m profile`来切换到此编译模式。

#### mode.coverage

为当前工程xmake.lua添加coverage编译模式的配置规则，一般用于覆盖分析，例如：

```lua
add_rules("mode.coverage")
```

相当于：

```lua
if is_mode("coverage") then
    add_cxflags("--coverage")
    add_mxflags("--coverage")
    add_ldflags("--coverage")
end
```

我们可以通过：`xmake f -m coverage`来切换到此编译模式。

#### mode.valgrind

此模式提供valgrind内存分析检测支持。

```lua
add_rules("mode.valgrind")
```

我们可以通过：`xmake f -m valgrind`来切换到此编译模式。

#### mode.asan

此模式提供AddressSanitizer内存分析检测支持。

```lua
add_rules("mode.asan")
```

我们可以通过：`xmake f -m asan`来切换到此编译模式。

#### mode.tsan

此模式提供ThreadSanitizer内存分析检测支持。

```lua
add_rules("mode.tsan")
```

我们可以通过：`xmake f -m tsan`来切换到此编译模式。

#### mode.lsan

此模式提供LeakSanitizer内存分析检测支持。

```lua
add_rules("mode.lsan")
```

我们可以通过：`xmake f -m lsan`来切换到此编译模式。

#### mode.ubsan

此模式提供UndefinedBehaviorSanitizer内存分析检测支持。

```lua
add_rules("mode.ubsan")
```

我们可以通过：`xmake f -m ubsan`来切换到此编译模式。

#### qt.static

用于编译生成Qt环境的静态库程序：

```lua
target("test")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

#### qt.shared

用于编译生成Qt环境的动态库程序：

```lua
target("test")
    add_rules("qt.shared")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

#### qt.console

用于编译生成Qt环境的控制台程序：

```lua
target("test")
    add_rules("qt.console")
    add_files("src/*.cpp")
```

#### qt.quickapp

用于编译生成Qt环境的Quick(qml) ui应用程序。


```lua
target("test")
    add_rules("qt.quickapp")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
```

#### qt.quickapp_static

用于编译生成Qt环境的Quick(qml) ui应用程序（静态链接版本）。

!> 需要切换到静态库版本Qt SDK


```lua
target("test")
    add_rules("qt.quickapp_static")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
```

#### qt.widgetapp

用于编译Qt Widgets(ui/moc)应用程序

```lua
target("test")
    add_rules("qt.widgetapp")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- 添加带有 Q_OBJECT 的meta头文件
```

#### qt.widgetapp_static

用于编译Qt Widgets(ui/moc)应用程序（静态库版本）

!> 需要切换到静态库版本Qt SDK

```lua
target("test")
    add_rules("qt.widgetapp_static")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- 添加带有 Q_OBJECT 的meta头文件
```

更多Qt相关描述见：[#160](https://github.com/xmake-io/xmake/issues/160)

#### xcode.bundle

用于编译生成ios/macos bundle程序

```lua
target("test")
    add_rules("xcode.bundle")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

#### xcode.framework

用于编译生成ios/macos framework程序

```lua
target("test")
    add_rules("xcode.framework")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

#### xcode.application

用于编译生成ios/macos应用程序

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
```

#### wdk.env.kmdf

应用WDK下kmdf的编译环境设置，需要配合：`wdk.[driver|binary|static|shared]`等规则来使用。

#### wdk.env.umdf

应用WDK下umdf的编译环境设置，需要配合：`wdk.[driver|binary|static|shared]`等规则来使用。

#### wdk.env.wdm

应用WDK下wdm的编译环境设置，需要配合：`wdk.[driver|binary|static|shared]`等规则来使用。

#### wdk.driver

编译生成windows下基于WDK环境的驱动程序，目前仅支持WDK10环境。

注：需要配合：`wdk.env.[umdf|kmdf|wdm]`等环境规则使用。

```lua
-- add target
target("echo")

    -- add rules
    add_rules("wdk.driver", "wdk.env.kmdf")

    -- add files
    add_files("driver/*.c")
    add_files("driver/*.inx")

    -- add includedirs
    add_includedirs("exe")
```

#### wdk.binary

编译生成windows下基于WDK环境的可执行程序，目前仅支持WDK10环境。

注：需要配合：`wdk.env.[umdf|kmdf|wdm]`等环境规则使用。

```lua
-- add target
target("app")

    -- add rules
    add_rules("wdk.binary", "wdk.env.umdf")

    -- add files
    add_files("exe/*.cpp")
```

#### wdk.static

编译生成windows下基于WDK环境的静态库程序，目前仅支持WDK10环境。

注：需要配合：`wdk.env.[umdf|kmdf|wdm]`等环境规则使用。

```lua
target("nonpnp")

    -- add rules
    add_rules("wdk.static", "wdk.env.kmdf")

    -- add flags for rule: wdk.tracewpp
    add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")

    -- add files
    add_files("driver/*.c", {rule = "wdk.tracewpp"})
```

#### wdk.shared

编译生成windows下基于WDK环境的动态库程序，目前仅支持WDK10环境。

注：需要配合：`wdk.env.[umdf|kmdf|wdm]`等环境规则使用。

```lua
target("nonpnp")

    -- add rules
    add_rules("wdk.shared", "wdk.env.wdm")

    -- add flags for rule: wdk.tracewpp
    add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")

    -- add files
    add_files("driver/*.c", {rule = "wdk.tracewpp"})
```

#### wdk.tracewpp

用于启用tracewpp预处理源文件：

```lua
target("nonpnp")

    -- add rules
    add_rules("wdk.driver", "wdk.env.kmdf")

    -- add flags for rule: wdk.tracewpp
    add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")

    -- add files
    add_files("driver/*.c", {rule = "wdk.tracewpp"})
    add_files("driver/*.rc")
```

更多WDK规则描述见：[#159](https://github.com/xmake-io/xmake/issues/159)

#### win.sdk.application

编译生成winsdk应用程序。

```lua
-- add rules
add_rules("mode.debug", "mode.release")

-- define target
target("usbview")

    -- windows application
    add_rules("win.sdk.application")

    -- add files
    add_files("*.c", "*.rc")
    add_files("xmlhelper.cpp", {rule = "win.sdk.dotnet"})
```

#### wdk.sdk.dotnet

用于指定某些c++源文件作为c++.net来编译。

```lua
add_files("xmlhelper.cpp", {rule = "win.sdk.dotnet"})
```

#### plugin.vsxmake.autoupdate

我们可以使用此规则，在通过 `xmake project -k vsxmake` 生成的 vs 工程中，自动更新 vs 工程文件（当每次构建完成）。

```lua
add_rules("plugin.vsxmake.autoupdate")
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

#### plugin.compile_commands.autoupdate

我们也可以使用这个规则来自动更新生成 compile_commandss.json

```lua
add_rules("plugin.compile_commands.autoupdate", {outputdir = ".vscode"})
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

#### utils.symbols.export_all

v2.5.2 以上版本提供，我们可以用它自动导出所有的动态库符号，目前仅支持 windows dll 目标程序的符号导出，即使没有在代码中通过 `__declspec(dllexport)` 导出接口，
xmake 也会自动导出所有 c/c++ 接口符号。

```lua
add_rules("mode.release", "mode.debug")

target("foo")
    set_kind("shared")
    add_files("src/foo.c")
    add_rules("utils.symbols.export_all")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.c")
```

c++
```lua
add_rules("utils.symbols.export_all", {export_classes = true})
```

相关 issue [#1123](https://github.com/xmake-io/xmake/issues/1123)

2.9.5 之后的版本还支持自定义过滤器，去针对性过滤需要导出的符号名和源文件名：

```lua
target("bar")
    set_kind("shared")
    add_files("src/bar.cpp")
    add_rules("utils.symbols.export_all", {export_filter = function (symbol, opt)
        local filepath = opt.sourcefile or opt.objectfile
        if filepath and filepath:find("bar.cpp", 1, true) and symbol:find("add", 1, true) then
            print("export: %s at %s", symbol, filepath)
            return true
        end
    end})
```

#### utils.symbols.export_list

我们可以在 xmake.lua 里面直接定义导出的符号列表，例如：

```lua
target("foo")
    set_kind("shared")
    add_files("src/foo.c")
    add_rules("utils.symbols.export_list", {symbols = {
        "add",
        "sub"}})
```

或者，在 `*.export.txt` 文件中添加导出的符号列表。

```lua
target("foo2")
    set_kind("shared")
    add_files("src/foo.c")
    add_files("src/foo.export.txt")
    add_rules("utils.symbols.export_list")
```

完整的工程例子见：[导出符号例子](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c/shared_library_export_list)

#### utils.install.cmake_importfiles

v2.5.3 以上版本可以使用此规则在安装 target 目标库文件的时候，导出 .cmake 文件，用于其他 cmake 项目的库导入和查找。

#### utils.install.pkgconfig_importfiles

v2.5.3 以上版本可以使用此规则在安装 target 目标库文件的时候，导出 pkgconfig/.pc 文件，用于其他项目的库导入和查找。

#### utils.bin2c

v2.5.7 以上版本可以使用此规则，在项目中引入一些二进制文件，并见他们作为 c/c++ 头文件的方式提供开发者使用，获取这些文件的数据。

比如，我们可以在项目中，内嵌一些 png/jpg 资源文件到代码中。

```lua
target("console")
    set_kind("binary")
    add_rules("utils.bin2c", {extensions = {".png", ".jpg"}})
    add_files("src/*.c")
    add_files("res/*.png", "res/*.jpg")
```

!> extensions 的设置是可选的，默认后缀名是 .bin

然后，我们就可以通过 `#include "filename.png.h"` 的方式引入进来使用，xmake 会自动帮你生成对应的头文件，并且添加对应的搜索目录。

```c
static unsigned char g_png_data[] = {
    #include "image.png.h"
};

int main(int argc, char** argv)
{
    printf("image.png: %s, size: %d\n", g_png_data, sizeof(g_png_data));
    return 0;
}
```

生成头文件内容类似：

```console
cat build/.gens/test/macosx/x86_64/release/rules/c++/bin2c/image.png.h
  0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x78, 0x6D, 0x61, 0x6B, 0x65, 0x21, 0x0A, 0x00
```

#### utils.glsl2spv

v2.6.1 以上版本可以使用此规则，在项目中引入 `*.vert/*.frag` 等 glsl shader 文件，然后实现自动编译生成 `*.spv` 文件。

另外，我们还支持以 C/C++ 头文件的方式，二进制内嵌 spv 文件数据，方便程序使用。

##### 编译生成 spv 文件

xmake 会自动调用 glslangValidator 或者 glslc 去编译 shaders 生成 .spv 文件，然后输出到指定的 `{outputdir = "build"}` 目录下。

```lua
add_rules("mode.debug", "mode.release")

add_requires("glslang", {configs = {binaryonly = true}})

target("test")
    set_kind("binary")
    add_rules("utils.glsl2spv", {outputdir = "build"})
    add_files("src/*.c")
    add_files("src/*.vert", "src/*.frag")
    add_packages("glslang")
```

注，这里的 `add_packages("glslang")` 主要用于引入和绑定 glslang 包中的 glslangValidator，确保 xmake 总归能够使用它。

当然，如果用户自己系统上已经安装了它，也可以不用额外绑定这个包，不过我还是建议添加一下。

##### 编译生成 c/c++ 头文件

我们也可以内部借助 bin2c 模块，将编译后的 spv 文件生成对应的二进制头文件，方便用户代码中直接引入，我们只需要启用 `{bin2c = true}`。:w

```lua
add_rules("mode.debug", "mode.release")

add_requires("glslang", {configs = {binaryonly = true}})

target("test")
    set_kind("binary")
    add_rules("utils.glsl2spv", {bin2c = true})
    add_files("src/*.c")
    add_files("src/*.vert", "src/*.frag")
    add_packages("glslang")
```

然后我们可以在代码这么引入：

```c
static unsigned char g_test_vert_spv_data[] = {
    #include "test.vert.spv.h"
};

static unsigned char g_test_frag_spv_data[] = {
    #include "test.frag.spv.h"
};
```

跟 bin2c 规则的使用方式类似，完整例子见：[glsl2spv example](https://github.com/xmake-io/xmake/tree/master/tests/projects/other/glsl2spv)

#### utils.hlsl2spv

除了 `utils.glsl2spv` 规则，我们现在还支持 `utils.hlsl2spv` 规则。

```bash
add_rules("mode.debug", "mode.release")

add_requires("glslang", {configs = {binaryonly = true}})

target("test")
    set_kind("binary")
    add_rules("utils.hlsl2spv", {bin2c = true})
    add_files("src/*.c")
    add_files("src/*.hlsl", "src/*.hlsl")
    add_packages("directxshadercompiler")
```

#### python.library

我们可以用这个规则，配合 pybind11 生成 python 库模块，它会调整 python 库的模块名。

```lua
add_rules("mode.release", "mode.debug")
add_requires("pybind11")

target("example")
    add_rules("python.library")
    add_files("src/*.cpp")
    add_packages("pybind11")
    set_languages("c++11")
```

带有 soabi：

```lua
add_rules("mode.release", "mode.debug")
add_requires("pybind11")

target("example")
    add_rules("python.library", {soabi = true})
    add_files("src/*.cpp")
    add_packages("pybind11")
    set_languages("c++11")
```

#### utils.ipsc

ipsc 编译器规则支持，使用方式如下：

```lua
target("test")
    set_kind("binary")
    add_rules("utils.ispc", {header_extension = "_ispc.h"})
    set_values("ispc.flags", "--target=host")
    add_files("src/*.ispc")
    add_files("src/*.cpp")
```

### rule

#### 定义规则

```lua
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)
```

### rule:add_deps

#### 添加规则依赖

关联依赖可以绑定一批规则，也就是不必对 target 挨个去使用 `add_rules()` 添加规则，只需要应用一个规则，就能生效它和它的所有依赖规则。

例如：

```lua
rule("foo")
    add_deps("bar")

rule("bar")
   ...
```

我们只需要 `add_rules("foo")`，就能同时应用 foo 和 bar 两个规则。

但是，默认情况下，依赖之间是不存在执行的先后顺序的，foo 和 bar 的 `on_build_file` 等脚本是并行执行的，顺序未定义。

如果要严格控制执行顺序，可以配置 `add_deps("bar", {order = true})`，告诉 xmake，我们需要根据依赖顺序来执行同级别的脚本。

例如：

```lua
rule("foo")
    add_deps("bar", {order = true})
    on_build_file(function (target, sourcefile)
    end)

rule("bar")
    on_build_file(function (target, sourcefile)
    end)
```

bar 的 `on_build_file` 将会被先执行。

!> 控制依赖顺序，我们需要 xmake 2.7.2 以上版本才支持。

不过，这种控制依赖的方式，只适合 foo 和 bar 两个规则都是自定义规则，如果想要将自己的规则插入到 xmake 的内置规则之前执行，这就不适用了。

这个时候，我们需要使用更加灵活的动态规则创建和注入的方式，去修改内置规则。

例如，我们想在内置的 `c++.build` 规则之前，执行自定义 cppfront 规则的 `on_build_file` 脚本，我们可以通过下面的方式来实现。

```lua
rule("cppfront")
    set_extensions(".cpp2")
    on_load(function (target)
        local rule = target:rule("c++.build"):clone()
        rule:add("deps", "cppfront", {order = true})
        target:rule_add(rule)
    end)
    on_build_file(function (target, sourcefile, opt)
        print("build cppfront file")
    end)

target("test")
    set_kind("binary")
    add_rules("cppfront")
    add_files("src/*.cpp")
    add_files("src/*.cpp2")
```

### rule:add_imports

#### 为所有自定义脚本预先导入扩展模块

使用方式和说明请见：[target:add_imports](#targetadd_imports)，用法相同。

### rule:set_extensions

#### 设置规则支持的文件扩展类型

通过设置支持的扩展文件类型，将规则应用于带这些后缀的文件上，例如：

```lua
-- 定义一个markdown文件的构建规则
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
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

### rule:on_load

#### 自定义加载脚本

用于实现自定规则的加载脚本，当加载target的时候，会被执行，可在里面自定义设置一些target配置，例如：

```lua
rule("test")
    on_load(function (target)
        target:add("defines", "TEST")
    end)
```

### rule:on_link

#### 自定义链接脚本

用于实现自定规则的链接脚本，会覆盖被应用的target的默认链接行为，例如：

```lua
rule("test")
    on_link(function (target)
    end)
```

### rule:on_config

#### 自定义配置脚本

在 `xmake config` 执行完成后，Build 之前会执行此脚本，通常用于编译前的配置工作。它与 on_load 不同的是，on_load 只要 target 被加载就会执行，执行时机更早。

如果一些配置，无法在 on_load 中过早配置，那么都可以在 on_config 中去配置它。

另外，它的执行时机比 before_build 还要早，大概的执行流程如下：

```
on_load -> after_load -> on_config -> before_build -> on_build -> after_build
```

### rule:on_build

#### 自定义编译脚本

用于实现自定规则的构建脚本，会覆盖被应用的target的默认构建行为，例如：

```lua
rule("markdown")
    on_build(function (target)
    end)
```

### rule:on_clean

#### 自定义清理脚本

用于实现自定规则的清理脚本会，覆盖被应用的target的默认清理行为，例如：

```lua
rule("markdown")
    on_clean(function (target)
        -- remove sourcefile.html
    end)
```

### rule:on_package

#### 自定义打包脚本

用于实现自定规则的打包脚本，覆盖被应用的target的默认打包行为, 例如：

```lua
rule("markdown")
    on_package(function (target)
        -- package sourcefile.html
    end)
```

### rule:on_install

#### 自定义安装脚本

用于实现自定规则的安装脚本，覆盖被应用的target的默认安装行为, 例如：

```lua
rule("markdown")
    on_install(function (target)
    end)
```

### rule:on_uninstall

#### 自定义卸载脚本

用于实现自定规则的卸载脚本，覆盖被应用的target的默认卸载行为, 例如：

```lua
rule("markdown")
    on_uninstall(function (target)
    end)
```

### rule:on_build_file

#### 自定义编译脚本，一次处理一个源文件

```lua
rule("markdown")
    on_build_file(function (target, sourcefile, opt)
        print("%%%d: %s", opt.progress, sourcefile)
    end)
```

其中第三个参数opt是可选参数，用于获取一些编译过程中的信息状态，例如：opt.progress 为当期的编译进度。

### rule:on_buildcmd_file

#### 自定义批处理编译脚本，一次处理一个源文件

这是 2.5.2 版本新加的接口，里面的脚本不会直接构建源文件，但是会通过 batchcmds 对象，构造一个批处理命令行任务，
xmake 在实际执行构建的时候，一次性执行这些命令。

这对于 `xmake project` 此类工程生成器插件非常有用，因为生成器生成的第三方工程文件并不支持 `on_build_files` 此类内置脚本的执行支持。

但是 `on_buildcmd_files` 构造的最终结果，就是一批原始的 cmd 命令行，可以直接给其他工程文件作为 custom commands 来执行。

另外，相比 `on_build_files`，它也简化对扩展文件的编译实现，更加的可读易配置，对用户也更加友好。

```lua
rule("foo")
    set_extensions(".xxx")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile})
        batchcmds:add_depfiles("/xxxxx/dependfile.h",  ...)
        -- batchcmds:add_depvalues(...)
        -- batchcmds:set_depmtime(os.mtime(...))
        -- batchcmds:set_depcache("xxxx.d")
    end)
```

除了 `batchcmds:vrunv`，我们还支持一些其他的批处理命令，例如：

```lua
batchcmds:show("hello %s", "xmake")
batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile}, {envs = {LD_LIBRARY_PATH="/xxx"}})
batchcmds:mkdir("/xxx") -- and cp, mv, rm, ln ..
batchcmds:compile(sourcefile_cx, objectfile, {configs = {includedirs = sourcefile_dir, languages = (sourcekind == "cxx" and "c++11")}})
batchcmds:link(objectfiles, targetfile, {configs = {linkdirs = ""}})
```

同时，我们在里面也简化对依赖执行的配置，下面是一个完整例子：

```lua
rule("lex")
    set_extensions(".l", ".ll")
    on_buildcmd_file(function (target, batchcmds, sourcefile_lex, opt)

        -- imports
        import("lib.detect.find_tool")

        -- get lex
        local lex = assert(find_tool("flex") or find_tool("lex"), "lex not found!")

        -- get c/c++ source file for lex
        local extension = path.extension(sourcefile_lex)
        local sourcefile_cx = path.join(target:autogendir(), "rules", "lex_yacc", path.basename(sourcefile_lex) .. (extension == ".ll" and ".cpp" or ".c"))

        -- add objectfile
        local objectfile = target:objectfile(sourcefile_cx)
        table.insert(target:objectfiles(), objectfile)

        -- add commands
        batchcmds:show_progress(opt.progress, "${color.build.object}compiling.lex %s", sourcefile_lex)
        batchcmds:mkdir(path.directory(sourcefile_cx))
        batchcmds:vrunv(lex.program, {"-o", sourcefile_cx, sourcefile_lex})
        batchcmds:compile(sourcefile_cx, objectfile)

        -- add deps
        batchcmds:add_depfiles(sourcefile_lex)
        local dependfile = target:dependfile(objectfile)
        batchcmds:set_depmtime(os.mtime(dependfile))
        batchcmds:set_depcache(dependfile)
    end)
```

`add_depfiles` 设置这个目标文件依赖的源文件。`set_depmtime` 设置目标文件的修改时间，如果有任意源文件的修改时间大于它，则认为需要重新生成这个目标文件。这里使用 dependfile 而不是 objectfile 的原因见 [issues 748](https://github.com/xmake-io/xmake/issues/748)。`set_depcache` 设置存储依赖信息的文件。

关于这个的详细说明和背景，见：[issue 1246](https://github.com/xmake-io/xmake/issues/1246)

### rule:on_build_files

#### 自定义编译脚本，一次处理多个源文件

大部分的自定义构建规则，每次都是处理单独一个文件，输出一个目标文件，例如：a.c => a.o

但是，有些情况下，我们需要同时输入多个源文件一起构建生成一个目标文件，例如：a.c b.c d.c => x.o

对于这种情况，我们可以通过自定义这个脚本来实现：

```lua
rule("markdown")
    on_build_files(function (target, sourcebatch, opt)
        -- build some source files
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            -- ...
        end
    end)
```

### rule:on_buildcmd_files

#### 自定义批处理编译脚本，一次处理多个源文件

关于这个的详细说明，见：[rule:on_buildcmd_file](#ruleon_buildcmd_file)

```lua
rule("foo")
    set_extensions(".xxx")
    on_buildcmd_files(function (target, batchcmds, sourcebatch, opt)
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile})
        end
    end)
```

### rule:before_link

#### 自定义链接前脚本

用于实现自定义target链接前的执行脚本，例如：

```lua
rule("test")
    before_link(function (target)
    end)
```

### rule:before_build

#### 自定义编译前脚本

用于实现自定义target构建前的执行脚本，例如：

```lua
rule("markdown")
    before_build(function (target)
    end)
```

### rule:before_clean

#### 自定义清理前脚本

用于实现自定义target清理前的执行脚本，例如：

```lua
rule("markdown")
    before_clean(function (target)
    end)
```

### rule:before_package

#### 自定义打包前脚本

用于实现自定义target打包前的执行脚本, 例如：

```lua
rule("markdown")
    before_package(function (target)
    end)
```

### rule:before_install

#### 自定义安装前脚本

用于实现自定义target安装前的执行脚本，例如：

```lua
rule("markdown")
    before_install(function (target)
    end)
```

### rule:before_uninstall

#### 自定义卸载前脚本

用于实现自定义target卸载前的执行脚本，例如：

```lua
rule("markdown")
    before_uninstall(function (target)
    end)
```

### rule:before_build_file

#### 自定义编译前脚本，一次处理一个源文件

跟[rule:on_build_file](#ruleon_build_file)用法类似，不过这个接口被调用的时机是在编译某个源文件之前，
一般用于对某些源文件进行编译前的预处理。

### rule:before_buildcmd_file

#### 自定义编译前批处理脚本，一次处理一个源文件

跟[rule:on_buildcmd_file](#ruleon_buildcmd_file)用法类似，不过这个接口被调用的时机是在编译某个源文件之前，
一般用于对某些源文件进行编译前的预处理。

### rule:before_build_files

#### 自定义编译前脚本，一次处理多个源文件

跟[rule:on_build_files](#ruleon_build_files)用法类似，不过这个接口被调用的时机是在编译某些源文件之前，
一般用于对某些源文件进行编译前的预处理。

### rule:before_buildcmd_files

#### 自定义编译前批处理脚本，一次处理多个源文件

跟[rule:on_buildcmd_files](#ruleon_buildcmd_files)用法类似，不过这个接口被调用的时机是在编译某些源文件之前，
一般用于对某些源文件进行编译前的预处理。

### rule:after_link

#### 自定义链接后脚本

用于实现自定义target链接后的执行脚本，用法跟[rule:before_link](#rulebefore_link)类似。

### rule:after_build

#### 自定义编译后脚本

用于实现自定义target构建后的执行脚本，用法跟[rule:before_build](#rulebefore_build)类似。

### rule:after_clean

#### 自定义清理后脚本

用于实现自定义target清理后的执行脚本，用法跟[rule:before_clean](#rulebefore_clean)类似。

### rule:after_package

#### 自定义打包后脚本

用于实现自定义target打包后的执行脚本, 用法跟[rule:before_package](#rulebefore_package)类似。

### rule:after_install

#### 自定义安装后脚本

用于实现自定义target安装后的执行脚本，用法跟[rule:before_install](#rulebefore_install)类似。

### rule:after_uninstall

#### 自定义卸载后脚本

用于实现自定义target卸载后的执行脚本，用法跟[rule:before_uninstall](#rulebefore_uninstall)类似。

### rule:after_build_file

#### 自定义编译后脚本，一次处理一个源文件

跟[rule:on_build_file](#ruleon_build_file)用法类似，不过这个接口被调用的时机是在编译某个源文件之后，
一般用于对某些编译后对象文件进行后期处理。

### rule:after_buildcmd_file

#### 自定义编译后批处理脚本，一次处理一个源文件

跟[rule:on_buildcmd_file](#ruleon_buildcmd_file)用法类似，不过这个接口被调用的时机是在编译某个源文件之后，
一般用于对某些编译后对象文件进行后期处理。

### rule:after_build_files

#### 自定义编译后脚本，一次处理多个源文件

跟[rule:on_build_files](#ruleon_build_files)用法类似，不过这个接口被调用的时机是在编译某些源文件之后，
一般用于对某些编译后对象文件进行后期处理。

### rule:after_buildcmd_files

#### 自定义编译后批处理脚本，一次处理多个源文件

跟[rule:on_buildcmd_files](#ruleon_buildcmd_files)用法类似，不过这个接口被调用的时机是在编译某些源文件之后，
一般用于对某些编译后对象文件进行后期处理。

### rule_end

#### 结束定义规则

这个是可选的，如果想要手动结束rule的定义，可以调用它：

```lua
rule("test")
    -- ..
rule_end()
```

