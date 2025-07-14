---
title: xmake v2.5.2 发布, 支持自动拉取交叉工具链和依赖包集成
tags: [xmake, lua, C/C++, toolchains, xrepo, packages, cross-toolchains]
date: 2021-02-27
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具，使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

在 2.5.2 版本中，我们增加了一个重量级的新特性：`自动拉取远程交叉编译工具链`。

这是用来干什么的呢，做过交叉编译以及有 C/C++ 项目移植经验的同学应该知道，折腾各种交叉编译工具链，移植编译项目是非常麻烦的一件事，需要自己下载对应工具链，并且配置工具链和编译环境很容易出错导致编译失败。

现在，xmake 已经可以支持自动下载项目所需的工具链，然后使用对应工具链直接编译项目，用户不需要关心如何配置工具链，任何情况下只需要执行 `xmake` 命令即可完成编译。

![](/assets/img/posts/xmake/muslcc.gif)

甚至对于 C/C++ 依赖包的集成，也可以自动切换到对应工具链编译安装集成，一切完全自动化，完全不需要用户操心。

除了交叉编译工具链，我们也可以自动拉取工具链，比如特定版本的 llvm，llvm-mingw, zig 等各种工具链来参与编译 C/C++/Zig 项目的编译。

即使是 cmake 也还不支持工具链的自动拉取，顶多只能配合 vcpkg/conan 等第三方包管理对 C/C++ 依赖包进行集成，另外，即使对于 C/C++依赖包，xmake 也有自己原生内置的包管理工具，完全无任何依赖。






* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](/zh/about/course)









## 新特性介绍

### 自动拉取远程交叉编译工具链

从 2.5.2 版本开始，我们可以拉取指定的工具链来集成编译项目，我们也支持将依赖包切换到对应的远程工具链参与编译后集成进来。

相关例子代码见：[Toolchain/Packages Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/package)

相关的 issue [#1217](https://github.com/xmake-io/xmake/issues/1217)

当前，我们已经在 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库收录了以下工具链包，可以让 xmake 远程拉取集成：

* llvm
* llvm-mingw
* gnu-rm
* muslcc
* zig

虽然现在支持的工具链包不多，当但是整体架构已经打通，后期我们只需要收录更多的工具链进来就行，比如：gcc, tinyc, vs-buildtools 等工具链。

由于 xmake 的包支持语义版本，因此如果项目依赖特定版本的 gcc/clang 编译器，就不要用户去折腾安装了，xmake 会自动检测当前系统的 gcc/clang 版本是否满足需求。

如果版本不满足，那么 xmake 就会走远程拉取，自动帮用户安装集成特定版本的 gcc/clang，然后再去编译项目。

#### 拉取指定版本的 llvm 工具链

我们使用 llvm-10 中的 clang 来编译项目。

```lua
add_requires("llvm 10.x", {alias = "llvm-10"})
target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("llvm@llvm-10")
```

其中，`llvm@llvm-10` 的前半部分为工具链名，也就是 `toolchain("llvm")`，后面的名字是需要被关联工具链包名，也就是 `package("llvm")`，不过如果设置了别名，那么会优先使用别名：`llvm-10`

另外，我们后续还会增加 gcc 工具链包到 xmake-repo，使得用户可以自由切换 gcc-10, gcc-11 等特定版本的 gcc 编译器，而无需用户去手动安装。

### 拉取交叉编译工具链

我们也可以拉取指定的交叉编译工具链来编译项目。

```lua
add_requires("muslcc")
target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("@muslcc")
```

muslcc 是 https://musl.cc 提供的一款交叉编译工具链，默认 xmake 会自动集成编译 `x86_64-linux-musl-` 目标平台。

当然，我们也可以通过 `xmake f -a arm64` 切换到 `aarch64-linux-musl-` 目标平台来进行交叉编译。

#### 拉取工具链并且集成对应工具链编译的依赖包

我们也可以使用指定的muslcc交叉编译工具链去编译和集成所有的依赖包。

```lua
add_requires("muslcc")
add_requires("zlib", "libogg", {system = false})

set_toolchains("@muslcc")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "libogg")
```

这个时候，工程里面配置的 zlib, libogg 等依赖包，也会切换使用 muslcc 工具链，自动下载编译然后集成进来。

我们也可以通过 `set_plat/set_arch` 固定平台，这样只需要一个 xmake 命令，就可以完成整个交叉编译环境的集成以及架构切换。

```lua
add_requires("muslcc")
add_requires("zlib", "libogg", {system = false})

set_plat("cross")
set_arch("arm64")
set_toolchains("@muslcc")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "libogg")
```

完整例子见：[Examples (muslcc)](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/toolchain_muslcc/xmake.lua)

#### 拉取集成 Zig 工具链

xmake 会先下载特定版本的 zig 工具链，然后使用此工具链编译 zig 项目，当然用户如果已经自行安装了 zig 工具链，xmake 也会自动检测对应版本是否满足，如果满足需求，那么会直接使用它，无需重复下载安装。

```lua
add_rules("mode.debug", "mode.release")
add_requires("zig 0.7.x")

target("test")
    set_kind("binary")
    add_files("src/*.zig")
    set_toolchains("@zig")
```

### 增加对 zig cc 编译器支持

`zig cc` 是 zig 内置的 c/c++ 编译器，可以完全独立进行 c/c++ 代码的编译和链接，完全不依赖 gcc/clang/msvc，非常给力。

因此，我们完全可以使用它来编译 c/c++ 项目，关键是 zig 的工具链还非常轻量，仅仅几十M 。

我们只需要切换到 zig 工具链即可完成编译：

```bash
$ xmake f --toolchain=zig
$ xmake
[ 25%]: compiling.release src/main.c
"zig cc" -c -arch x86_64 -fvisibility=hidden -O3 -DNDEBUG -o build/.objs/xmake_test/macosx/x86_64/release/src/main.c.o src/main.c
[ 50%]: linking.release test
"zig c++" -o build/macosx/x86_64/release/test build/.objs/xmake_test/macosx/x86_64/release/src/main.c.o -arch x86_64 -stdlib=libc++ -Wl,-x -lz
[100%]: build ok!
```

另外，`zig cc` 的另外一个强大之处在于，它还支持不同架构的交叉编译，太 happy 了。

通过 xmake，我们也只需再额外切换下架构到 arm64，即可实现对 arm64 的交叉编译，例如：

```bash
$ xmake f -a arm64 --toolchain=zig
$ xmake
[ 25%]: compiling.release src/main.c
"zig cc" -c -target aarch64-macos-gnu -arch arm64 -fvisibility=hidden -O3 -DNDEBUG -o build/.objs/xmake_test/macosx/arm64/release/src/main.c.o src/main.c
checking for flags (-MMD -MF) ... ok
checking for flags (-fdiagnostics-color=always) ... ok
[ 50%]: linking.release xmake_test
"zig c++" -o build/macosx/arm64/release/xmake_test build/.objs/xmake_test/macosx/arm64/release/src/main.c.o -target aarch64-macos-gnu -arch arm64 -stdlib=libc++ -Wl,-x -lz
[100%]: build ok!
```

即使你是在在 macOS，也可以用 `zig cc` 去交叉编译 windows/x64 目标程序，相当于替代了 mingw 干的事情。

```bash
$ xmake f -p windows -a x64 --toolchain=zig
$ xmake
```

### 自动导出所有 windows/dll 中的符号

cmake 中有这样一个功能：`WINDOWS_EXPORT_ALL_SYMBOLS`，安装 cmake 文档中的说法：

[https://cmake.org/cmake/help/latest/prop_tgt/WINDOWS_EXPORT_ALL_SYMBOLS.html](https://cmake.org/cmake/help/latest/prop_tgt/WINDOWS_EXPORT_ALL_SYMBOLS.html)

> Enable this boolean property to automatically create a module definition (.def) file with all global symbols found
> in the input .obj files for a SHARED library (or executable with ENABLE_EXPORTS) on Windows.
> The module definition file will be passed to the linker causing all symbols to be exported from the .dll. For global data symbols,
> __declspec(dllimport) must still be used when compiling against the code in the .dll. All other function symbols will be automatically exported and imported by callers.
> This simplifies porting projects to Windows by reducing the need for explicit dllexport markup, even in C++ classes.

大体意思就是：

> 启用此布尔属性，可以自动创建一个模块定义(.def)文件，其中包含在Windows上的共享库(或使用ENABLE_EXPORTS的可执行文件)的输入.obj文件中找到的所有全局符号。
> 模块定义文件将被传递给链接器，使所有符号从.dll中导出。对于全局数据符号，当对.dll中的代码进行编译时，仍然必须使用__declspec(dllimport)。
> 所有其它的函数符号将被调用者自动导出和导入。这就简化了将项目移植到 Windows 的过程，减少了对显式 dllexport 标记的需求，甚至在 C++ 类中也是如此。

现在，xmake 中也提供了类似的特性，可以快速全量导出 windows/dll 中的符号，来简化对第三方项目移植过程中，对符号导出的处理。另外，如果项目中的符号太多，也可以用此来简化代码中的显式导出需求。

我们只需在对应生成的 dll 目标上，配置 `utils.symbols.export_all` 规则即可。

```lua
target("foo")
    set_kind("shared")
    add_files("src/foo.c")
    add_rules("utils.symbols.export_all")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.c")
```

xmake 会自动扫描所有的 obj 对象文件，然后生成 def 符号导出文件，传入 link.exe 实现快速全量导出。

### 转换 mingw/.dll.a 到 msvc/.lib

这个特性也是参考自 CMAKE_GNUtoMS 功能，可以把MinGW生成的动态库（xxx.dll & xxx.dll.a）转换成Visual Studio可以识别的格式（xxx.dll & xxx.lib），从而实现混合编译。

这个功能对Fortran & C++混合项目特别有帮助，因为VS不提供fortran编译器，只能用MinGW的gfortran来编译fortran部分，然后和VS的项目链接。
往往这样的项目同时有一些其他的库以vs格式提供，因此纯用MinGW编译也不行，只能使用cmake的这个功能来混合编译。

因此，xmake 也提供了一个辅助模块接口去支持它，使用方式如下：

```lua
import("utils.platform.gnu2mslib")

gnu2mslib("xxx.lib", "xxx.dll.a")
gnu2mslib("xxx.lib", "xxx.def")
gnu2mslib("xxx.lib", "xxx.dll.a", {dllname = "xxx.dll", arch = "x64"})
```

支持从 def 生成 xxx.lib ，也支持从 xxx.dll.a 自动导出 .def ，然后再生成 xxx.lib

具体细节见：[issue #1181](https://github.com/xmake-io/xmake/issues/1181)

### 实现批处理命令来简化自定义规则

为了简化用户自定义 rule 的配置，xmake 新提供了 `on_buildcmd_file`, `on_buildcmd_files` 等自定义脚本入口，
我们可以通过 batchcmds 对象，构造一个批处理命令行任务，xmake 在实际执行构建的时候，一次性执行这些命令。

这对于 `xmake project` 此类工程生成器插件非常有用，因为生成器生成的第三方工程文件并不支持 `on_build_files` 此类内置脚本的执行支持。

但是 `on_buildcmd_file` 构造的最终结果，就是一批原始的 cmd 命令行，可以直接给其他工程文件作为 custom commands 来执行。

另外，相比 `on_build_file`，它也简化对扩展文件的编译实现，更加的可读易配置，对用户也更加友好。

```lua
rule("foo")
    set_extensions(".xxx")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile})
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

我们从上面的配置可以看到，整体执行命令列表非常清晰，而如果我们用 `on_build_file` 来实现，可以对比下之前这个规则的配置，就能直观感受到新接口的配置方式确实简化了不少：

```lua
rule("lex")

    -- set extension
    set_extensions(".l", ".ll")

    -- load lex/flex
    before_load(function (target)
        import("core.project.config")
        import("lib.detect.find_tool")
        local lex = config.get("__lex")
        if not lex then
            lex = find_tool("flex") or find_tool("lex")
            if lex and lex.program then
                config.set("__lex", lex.program)
                cprint("checking for Lex ... ${color.success}%s", lex.program)
            else
                cprint("checking for Lex ... ${color.nothing}${text.nothing}")
                raise("lex/flex not found!")
            end
        end
    end)

    -- build lex file
    on_build_file(function (target, sourcefile_lex, opt)

        -- imports
        import("core.base.option")
        import("core.theme.theme")
        import("core.project.config")
        import("core.project.depend")
        import("core.tool.compiler")
        import("private.utils.progress")

        -- get lex
        local lex = assert(config.get("__lex"), "lex not found!")

        -- get extension: .l/.ll
        local extension = path.extension(sourcefile_lex)

        -- get c/c++ source file for lex
        local sourcefile_cx = path.join(target:autogendir(), "rules", "lex_yacc", path.basename(sourcefile_lex) .. (extension == ".ll" and ".cpp" or ".c"))
        local sourcefile_dir = path.directory(sourcefile_cx)

        -- get object file
        local objectfile = target:objectfile(sourcefile_cx)

        -- load compiler
        local compinst = compiler.load((extension == ".ll" and "cxx" or "cc"), {target = target})

        -- get compile flags
        local compflags = compinst:compflags({target = target, sourcefile = sourcefile_cx})

        -- add objectfile
        table.insert(target:objectfiles(), objectfile)

        -- load dependent info
        local dependfile = target:dependfile(objectfile)
        local dependinfo = option.get("rebuild") and {} or (depend.load(dependfile) or {})

        -- need build this object?
        local depvalues = {compinst:program(), compflags}
        if not depend.is_changed(dependinfo, {lastmtime = os.mtime(objectfile), values = depvalues}) then
            return
        end

        -- trace progress info
        progress.show(opt.progress, "${color.build.object}compiling.lex %s", sourcefile_lex)

        -- ensure the source file directory
        if not os.isdir(sourcefile_dir) then
            os.mkdir(sourcefile_dir)
        end

        -- compile lex
        os.vrunv(lex, {"-o", sourcefile_cx, sourcefile_lex})

        -- trace
        if option.get("verbose") then
            print(compinst:compcmd(sourcefile_cx, objectfile, {compflags = compflags}))
        end

        -- compile c/c++ source file for lex
        dependinfo.files = {}
        assert(compinst:compile(sourcefile_cx, objectfile, {dependinfo = dependinfo, compflags = compflags}))

        -- update files and values to the dependent file
        dependinfo.values = depvalues
        table.insert(dependinfo.files, sourcefile_lex)
        depend.save(dependinfo, dependfile)
    end)
```

关于这个的详细说明和背景，见：[issue 1246](https://github.com/xmake-io/xmake/issues/1246)

### 依赖包配置改进

#### 使用 add_extsources 改进包名查找

关于远程依赖包定义这块，我们也新增了 `add_extsources` 和 `on_fetch` 两个配置接口，可以更好的配置 xmake 在安装 C/C++ 包的过程中，对系统库的查找过程。

至于具体背景，我们可以举个例子，比如我们在 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库新增了一个 `package("libusb")` 的包。

那么用户就可以通过下面的方式，直接集成使用它：

```lua
add_requires("libusb")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libusb")
```

如果用户系统上确实没有安装 libusb，那么 xmake 会自动下载 libusb 库源码，自动编译安装集成，没啥问题。

但如果用户通过 `apt install libusb-1.0` 安装了 libusb 库到系统，那么按理 xmake 应该会自动优先查找用户安装到系统环境的 libusb 包，直接使用，避免额外的下载编译安装。

但是问题来了，xmake 内部通过 `find_package("libusb")` 并没有找打它，这是为什么呢？因为通过 apt 安装的 libusb 包名是 `libusb-1.0`, 而不是 libusb。

我们只能通过 `pkg-config --cflags libusb-1.0` 才能找到它，但是 xmake 内部的默认 find_package 逻辑并不知道 `libusb-1.0` 的存在，所以找不到。

因此为了更好地适配不同系统环境下，系统库的查找，我们可以通过 `add_extsources("pkgconfig::libusb-1.0")` 去让 xmake 改进查找逻辑，例如：

```lua
package("libusb")
    add_extsources("pkgconfig::libusb-1.0")
    on_install(function (package)
        -- ...
    end)
```

另外，我们也可以通过这个方式，改进查找 homebrew/pacman 等其他包管理器安装的包，例如：`add_extsources("pacman::libusb-1.0")`。

#### 使用 on_fetch 完全定制系统库查找

如果不同系统下安装的系统库，仅仅只是包名不同，那么使用 `add_extsources` 改进系统库查找已经足够，简单方便。

但是如果有些安装到系统的包，位置更加复杂，想要找到它们，也许需要一些额外的脚本才能实现，例如：windows 下注册表的访问去查找包等等，这个时候，我们就可以通过 `on_fetch` 完全定制化查找系统库逻辑。

还是以 libusb 为例，我们不用 `add_extsources`，可以使用下面的方式，实现相同的效果，当然，我们可以在里面做更多的事情。

```
package("libusb")
    on_fetch("linux", function(package, opt)
        if opt.system then
            return find_package("pkgconfig::libusb-1.0")
        end
    end)
```

### manifest 文件支持

在新版本中，我们还新增了对 windows `.manifest` 文件的支持，只需要通过 `add_files` 添加进来即可。

```lua
add_rules("mode.debug", "mode.release")
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_files("src/*.manifest")
```

### xrepo 命令改进

关于 xrepo 命令，我们也稍微改进了下，现在可以通过下面的命令，批量卸载删除已经安装的包，支持模式匹配：

```bash
$ xrepo remove --all
$ xrepo remove --all zlib pcr*
```

### 包的依赖导出支持

我们也改进了 `add_packages`，使其也支持 `{public = true}` 来导出包配置给父 target。


```lua
add_rules("mode.debug", "mode.release")
add_requires("pcre2")

target("test")
    set_kind("shared")
    add_packages("pcre2", {public = true})
    add_files("src/test.cpp")

target("demo")
    add_deps("test")
    set_kind("binary")
    add_files("src/main.cpp")  -- 我们可以在这里使用被 test 目标导出 pcre2 库
```

至于具体导出哪些配置呢？

```lua
-- 默认私有，但是 links/linkdirs 还是会自动导出
add_packages("pcre2")

-- 全部导出。包括 includedirs, defines
add_packages("pcre2", {public = true})
```

## 更新内容

### 新特性

* [#955](https://github.com/xmake-io/xmake/issues/955#issuecomment-766481512): 支持 `zig cc` 和 `zig c++` 作为 c/c++ 编译器
* [#955](https://github.com/xmake-io/xmake/issues/955#issuecomment-768193083): 支持使用 zig 进行交叉编译
* [#1177](https://github.com/xmake-io/xmake/issues/1177): 改进终端和 color codes 探测
* [#1216](https://github.com/xmake-io/xmake/issues/1216): 传递自定义 includes 脚本给 xrepo
* 添加 linuxos 内置模块获取 linux 系统信息
* [#1217](https://github.com/xmake-io/xmake/issues/1217): 支持当编译项目时自动拉取工具链
* [#1123](https://github.com/xmake-io/xmake/issues/1123): 添加 `rule("utils.symbols.export_all")` 自动导出所有 windows/dll 中的符号
* [#1181](https://github.com/xmake-io/xmake/issues/1181): 添加 `utils.platform.gnu2mslib(mslib, gnulib)` 模块接口去转换 mingw/xxx.dll.a 到 msvc xxx.lib
* [#1246](https://github.com/xmake-io/xmake/issues/1246): 改进规则支持新的批处理命令去简化自定义规则实现
* [#1239](https://github.com/xmake-io/xmake/issues/1239): 添加 `add_extsources` 去改进外部包的查找
* [#1241](https://github.com/xmake-io/xmake/issues/1241): 支持为 windows 程序添加 .manifest 文件参与链接
* 支持使用 `xrepo remove --all` 命令去移除所有的包，并且支持模式匹配
* [#1254](https://github.com/xmake-io/xmake/issues/1254): 支持导出包配置给父 target，实现包配置的依赖继承

### 改进

* [#1226](https://github.com/xmake-io/xmake/issues/1226): 添加缺失的 Qt 头文件搜索路径
* [#1183](https://github.com/xmake-io/xmake/issues/1183): 改进 C++ 语言标准，以便支持 Qt6
* [#1237](https://github.com/xmake-io/xmake/issues/1237): 为 vsxmake 插件添加 qt.ui 文件
* 改进 vs/vsxmake 插件去支持预编译头文件和智能提示
* [#1090](https://github.com/xmake-io/xmake/issues/1090): 简化自定义规则
* [#1065](https://github.com/xmake-io/xmake/issues/1065): 改进 protobuf 规则，支持 compile_commands 生成器
* [#1249](https://github.com/xmake-io/xmake/issues/1249): 改进 vs/vsxmake 生成器去支持启动工程设置
* [#605](https://github.com/xmake-io/xmake/issues/605): 改进 add_deps 和 add_packages 直接的导出 links 顺序
* 移除废弃的 `add_defines_h_if_ok` and `add_defines_h` 接口

### Bugs 修复

* [#1219](https://github.com/xmake-io/xmake/issues/1219): 修复版本检测和更新
* [#1235](https://github.com/xmake-io/xmake/issues/1235): 修复 includes 搜索路径中带有空格编译不过问题