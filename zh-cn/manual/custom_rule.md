
在2.2.1版本之后，xmake不仅原生内置支持多种语言文件的构建，而且还可以通过自定义构建规则，让用户自己来实现复杂的未知文件构建。

我们可以通过预先设置规则支持的文件后缀，来扩展其他文件的构建支持：

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

我们也可以指定某些零散的其他文件作为markdown规则来处理：

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

#### utils.symbols.export_all

v2.5.2 以上版本提供，我们可以用它自动导出所有的动态库符号，目前仅支持 windows dll 目标程序的符号导出，即使没有在代码中通过 `__declspec(dllexport)` 导出接口，
xmake 也会自动导出所有 c 接口符号（c++ 类库符号太多，暂时没有导出它）。

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

相关 issue [#1123](https://github.com/xmake-io/xmake/issues/1123)

#### utils.install.cmake_importfiles

v2.5.3 以上版本可以使用此规则在安装 target 目标库文件的时候，导出 .cmake 文件，用于其他 cmake 项目的库导入和查找。

#### utils.install.pkgconfig_importfiles

v2.5.3 以上版本可以使用此规则在安装 target 目标库文件的时候，导出 pkgconfig/.pc 文件，用于其他项目的库导入和查找。

### rule

#### 定义规则

```lua
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)
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
        target:add("defines", "-DTEST")
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
        batchcmds:set_depmtime(os.mtime(objectfile))
        batchcmds:set_depcache(target:dependfile(objectfile))
    end)
```

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

