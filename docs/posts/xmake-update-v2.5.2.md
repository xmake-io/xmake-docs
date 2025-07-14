---
title: xmake v2.5.2 released, Support pull remote cross-toolchain and package integration
tags: [xmake, lua, C/C++, toolchains, xrepo, packages, cross-toolchains]
date: 2021-02-27
author: Ruki
---

tags: [xmake, lua, C/C++, toolchains, xrepo, packages, cross-toolchains], date: '2021-02-27',]
---

[xmake](https://github.com/xmake-io/xmake) is a lightweight cross-platform build tool based on Lua. It uses xmake.lua to maintain project builds. Compared with makefile/CMakeLists.txt, the configuration syntax is more Concise and intuitive, it is very friendly to novices, and you can get started quickly in a short time, allowing users to focus more on actual project development.

In version 2.5.2, we added a heavyweight new feature: `Pull remote cross-compilation toolchain automatically`.

Those who have done cross-compilation and have experience in C/C++ project migration should know that it is very troublesome to toss various cross-compilation toolchains
and transplant and compile projects. You need to download the corresponding toolchain yourself.

And it is easy to make mistakes in configuring the toolchain and the compilation environment to cause compilation failure.

Now, xmake can already support the automatic download of the toolchain required by the project, and then use the corresponding toolchain to directly compile the project.
The user does not need to care about how to configure the toolchain. In any case, just execute the `xmake` command to complete the compilation.

![](/assets/img/posts/xmake/muslcc.gif)

Even for the integration of C/C++ dependent packages, you can automatically switch to the corresponding toolchain to compile, install, and integrate.
Everything is fully automated and does not require users to worry about it.

In addition to the cross-compilation toolchain, we can also automatically pull toolchains, such as specific versions of llvm, llvm-mingw, zig
and other toolchains to participate in the compilation of C/C++/Zig projects.

Even cmake does not support the automatic pull of the toolchain. At most, it can only cooperate with third-party package management such as vcpkg/conan to integrate C/C++ dependent packages.
In addition, even for C/C++ dependent packages, xmake has its own native The built-in package management tool has no dependencies at all.

* [Github](https://github.com/xmake-io/xmake)
* [Document](https://xmake.io/)










## New feature introduction

### Automatically pull the remote cross-compilation toolchain

Starting from version 2.5.2, we can pull the specified toolchain to integrate the compilation project, and we also support switching the dependent package to the corresponding remote toolchain to participate in the compilation and integration.

For related example codes, see: [Toolchain/Packages Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/package)

Related issue [#1217](https://github.com/xmake-io/xmake/issues/1217)

Currently, we have included the following toolchain packages in the [xmake-repo](https://github.com/xmake-io/xmake-repo) repository, allowing xmake to pull and integrate remotely:

* llvm
* llvm-mingw
* gnu-rm
* muslcc
* zig

Although there are not many toolchain packages currently supported, but the overall architecture has been opened up, we only need to include more toolchains in the later stage, such as: gcc, tinyc, vs-buildtools and other toolchains.

Since the xmake package supports semantic versions, if the project relies on a specific version of the gcc/clang compiler, users should not bother to install it. xmake will automatically detect whether the gcc/clang version of the current system meets the requirements.

If the version is not satisfied, xmake will pull it remotely, automatically install and integrate a specific version of gcc/clang, and then compile the project.

#### Pull the specified version of llvm toolchain

We use clang in llvm-10 to compile the project.

```lua
add_requires("llvm 10.x", {alias = "llvm-10"})
target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("llvm@llvm-10")
```

Among them, the first half of `llvm@llvm-10` is the toolchain name, which is `toolchain("llvm")`, and the following name is the name of the toolchain package that needs to be associated, which is `package("llvm")` , But if an alias is set, the alias will be used first: `llvm-10`

In addition, we will add the gcc toolchain package to xmake-repo in the future, so that users can freely switch to gcc-10, gcc-11 and other specific versions of gcc compilers without the need for users to manually install them.

### Pull the cross-compilation toolchain

We can also pull the specified cross-compilation toolchain to compile the project.

```lua
add_requires("muslcc")
target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("@muslcc")
```

muslcc is a cross-compilation toolchain provided by https://musl.cc. By default, xmake will automatically integrate and compile the `x86_64-linux-musl-` target platform.

Of course, we can also use `xmake f -a arm64` to switch to the `aarch64-linux-musl-` target platform for cross-compilation.

#### Pull the toolchain and integrate the dependency packages

We can also use the specified muslcc cross-compilation toolchain to compile and integrate all dependent packages.

```lua
add_requires("muslcc")
add_requires("zlib", "libogg", {system = false})

set_toolchains("@muslcc")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "libogg")
```

At this time, the zlib, libogg and other dependent packages configured in the project will also switch to the muslcc toolchain, automatically download, compile and integrate them.

We can also use `set_plat/set_arch` to fix the platform, so that only one xmake command is needed to complete the integration of the entire cross-compilation environment and architecture switching.

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

For complete examples, see: [Examples (muslcc)](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/toolchain_muslcc/xmake.lua)

#### Pull Zig toolchain

xmake will first download a specific version of the zig toolchain, and then use this toolchain to compile the zig project. Of course, if the user has installed the zig toolchain by himself, xmake will also automatically detect whether the corresponding version is satisfied, and if it meets the requirements, it will use it directly , No need to download and install repeatedly.

```lua
add_rules("mode.debug", "mode.release")
add_requires("zig 0.7.x")

target("test")
    set_kind("binary")
    add_files("src/*.zig")
    set_toolchains("@zig")
```

### Support for zig cc compiler

`zig cc` is the built-in c/c++ compiler of zig, which can compile and link c/c++ code completely independently. It does not rely on gcc/clang/msvc at all, which is very powerful.

Therefore, we can use it to compile c/c++ projects. The key is that the zig toolchain is still very lightweight, only tens of M.

We only need to switch to the zig toolchain to complete the compilation:

```bash
$ xmake f --toolchain=zig
$ xmake
[25%]: compiling.release src/main.c
"zig cc" -c -arch x86_64 -fvisibility=hidden -O3 -DNDEBUG -o build/.objs/xmake_test/macosx/x86_64/release/src/main.c.o src/main.c
[50%]: linking.release test
"zig c++" -o build/macosx/x86_64/release/test build/.objs/xmake_test/macosx/x86_64/release/src/main.c.o -arch x86_64 -stdlib=libc++ -Wl,-x -lz
[100%]: build ok!
```

In addition, another powerful feature of `zig cc` is that it also supports cross-compilation of different architectures, which is so happy.

With xmake, we only need to switch the architecture to arm64 to achieve cross-compilation of arm64, for example:

```bash
$ xmake f -a arm64 --toolchain=zig
$ xmake
[25%]: compiling.release src/main.c
"zig cc" -c -target aarch64-macos-gnu -arch arm64 -fvisibility=hidden -O3 -DNDEBUG -o build/.objs/xmake_test/macosx/arm64/release/src/main.c.o src/main.c
checking for flags (-MMD -MF) ... ok
checking for flags (-fdiagnostics-color=always) ... ok
[50%]: linking.release xmake_test
"zig c++" -o build/macosx/arm64/release/xmake_test build/.objs/xmake_test/macosx/arm64/release/src/main.co -target aarch64-macos-gnu -arch arm64 -stdlib=libc++ -Wl, -x -lz
[100%]: build ok!
```

Even if you are on macOS, you can use `zig cc` to cross-compile windows/x64 target programs, which is equivalent to replacing what mingw does.

```bash
$ xmake f -p windows -a x64 --toolchain=zig
$ xmake
```

### Automatically export all symbols in windows/dll

There is such a function in cmake: `WINDOWS_EXPORT_ALL_SYMBOLS`, the statement in the installation cmake document:

[https://cmake.org/cmake/help/latest/prop_tgt/WINDOWS_EXPORT_ALL_SYMBOLS.html](https://cmake.org/cmake/help/latest/prop_tgt/WINDOWS_EXPORT_ALL_SYMBOLS.html)

> Enable this boolean property to automatically create a module definition (.def) file with all global symbols found
> in the input .obj files for a SHARED library (or executable with ENABLE_EXPORTS) on Windows.
> The module definition file will be passed to the linker causing all symbols to be exported from the .dll. For global data symbols,
> __declspec(dllimport) must still be used when compiling against the code in the .dll. All other function symbols will be automatically exported and imported by callers.
> This simplifies porting projects to Windows by reducing the need for explicit dllexport markup, even in C++ classes.

Now, xmake also provides a similar feature, which can quickly export symbols in windows/dll in full to simplify the process of symbol export in the process of porting to third-party projects. In addition, if there are too many symbols in the project, you can also use this to simplify the explicit export requirements in the code.

We only need to configure the `utils.symbols.export_all` rule on the corresponding generated dll target.

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

xmake will automatically scan all obj object files, then generate the def symbol export file, and pass it to link.exe for fast and full export.

### Convert mingw/.dll.a to msvc/.lib

This feature is also based on the CMAKE_GNUtoMS function, which can convert the dynamic library (xxx.dll & xxx.dll.a) generated by MinGW into a format (xxx.dll & xxx.lib) that can be recognized by Visual Studio to achieve mixed compilation.

This feature is particularly helpful for Fortran & C++ mixed projects, because VS does not provide the fortran compiler, you can only use MinGW's gfortran to compile the fortran part, and then link with the VS project.
Often such projects also have some other libraries provided in the vs format, so it is not possible to compile it purely with MinGW. You can only use this function of cmake to mix and compile.

Therefore, xmake also provides an auxiliary module interface to support it, and the usage is as follows:

```lua
import("utils.platform.gnu2mslib")

gnu2mslib("xxx.lib", "xxx.dll.a")
gnu2mslib("xxx.lib", "xxx.def")
gnu2mslib("xxx.lib", "xxx.dll.a", {dllname = "xxx.dll", arch = "x64"})
```

Support to generate xxx.lib from def, and also support to automatically export .def from xxx.dll.a, and then generate xxx.lib

For details, see: [issue #1181](https://github.com/xmake-io/xmake/issues/1181)

### Add batch commands to simplify custom rules

In order to simplify the configuration of user-defined rules, xmake newly provides custom script entries such as `on_buildcmd_file`, `on_buildcmd_files`, etc.
We can construct a batch command line task through the batchcmds object, and xmake executes these commands at one time when actually executing the build.

This is very useful for project generator plugins such as `xmake project`, because third-party project files generated by the generator do not support the execution of built-in scripts such as `on_build_files`.

But the final result of the `on_buildcmd_file` construction is a batch of original cmd command lines, which can be directly executed as custom commands for other project files.

In addition, compared to `on_build_file`, it also simplifies the implementation of compiling extension files, is more readable and easy to configure, and is more user-friendly.

```lua
rule("foo")
    set_extensions(".xxx")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile})
    end)
```

In addition to `batchcmds:vrunv`, we also support some other batch commands, such as:

```lua
batchcmds:show("hello %s", "xmake")
batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile}, {envs = {LD_LIBRARY_PATH="/xxx"}})
batchcmds:mkdir("/xxx") -- and cp, mv, rm, ln ..
batchcmds:compile(sourcefile_cx, objectfile, {configs = {includedirs = sourcefile_dir, languages = (sourcekind == "cxx" and "c++11")}})
batchcmds:link(objectfiles, targetfile, {configs = {linkdirs = ""}})
```

At the same time, we also simplify the configuration of dependency execution in it. The following is a complete example:

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

As we can see from the above configuration, the overall execution command list is very clear, and if we use `on_build_file` to implement it,
we can compare the configuration of the previous rule, and we can intuitively feel that the configuration of the new interface is indeed simplified a lot.

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

For a detailed description and background of this, see: [issue 1246](https://github.com/xmake-io/xmake/issues/1246)

### Dependent package configuration improvements

#### Use add_extsources to improve package name lookup

Regarding the definition of remote dependency packages, we have also added two configuration interfaces `add_extsources` and `on_fetch`, which can better configure xmake to search for system libraries during the process of installing C/C++ packages.

As for the specific background, we can give an example. For example, we added a package of `package("libusb")` to the [xmake-repo](https://github.com/xmake-io/xmake-repo) repository .

Then users can directly integrate and use it in the following ways:

```lua
add_requires("libusb")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libusb")
```

If libusb is not installed on the user's system, xmake will automatically download the libusb library source code, automatically compile, install and integrate, and there is no problem.

But if the user installs the libusb library to the system through `apt install libusb-1.0`, then xmake should automatically search for the libusb package installed by the user in the system environment first, and use it directly, avoiding additional download, compilation and installation.

But here comes the problem, xmake internally passes `find_package("libusb")` and fails to find it. Why is that? Because the package name of libusb installed via apt is `libusb-1.0`, not libusb.

We can only find it through `pkg-config --cflags libusb-1.0`, but the default find_package logic inside xmake doesn't know the existence of `libusb-1.0`, so it can't be found.

Therefore, in order to better adapt to the search of system libraries in different system environments, we can use `add_extsources("pkgconfig::libusb-1.0")` to let xmake improve the search logic, for example:

```lua
package("libusb")
    add_extsources("pkgconfig::libusb-1.0")
    on_install(function (package)
        -- ...
    end)
```

In addition, we can also use this method to improve the search for packages installed by other package managers such as homebrew/pacman, for example: `add_extsources("pacman::libusb-1.0")`.

#### Use on_fetch to improve find system libraries

If the system libraries installed under different systems only have different package names, it is enough to use `add_extsources` to improve the system library search, which is simple and convenient.

However, if some packages are installed in the system, the location is more complicated. To find them, some additional scripts may be needed. For example: access to the registry under windows to find packages, etc. At this time, we can use `on_fetch `Fully customized search system library logic.

Let's take libusb as an example. Instead of `add_extsources`, we can use the following method to achieve the same effect. Of course, we can do more things in it.

```lua
package("libusb")
    on_fetch("linux", function(package, opt)
        if opt.system then
            return find_package("pkgconfig::libusb-1.0")
        end
    end)
```

### Support manifest file on windows

In the new version, we also added support for windows `.manifest` files, just add it through `add_files`.

```lua
add_rules("mode.debug", "mode.release")
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_files("src/*.manifest")
```

### Improve xrepo command

Regarding the xrepo command, we have also improved it slightly. Now you can batch uninstall and delete the installed packages through the following command, and support pattern matching:

```bash
$ xrepo remove --all
$ xrepo remove --all zlib pcr*
```

### Support to export package configuration

We have also improved `add_packages` so that it also supports `{public = true}` to export package configuration to the parent target.


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
    add_files("src/main.cpp") -- here we can use the pcre2 library exported by the test target
```


it's private by default, but links/linkdirs will still be exported automatically

```lua
add_packages("pcre2")
```

it will export all, contains includedirs, defines

```lua
add_packages("pcre2", {public = true})
```

## Changelog

### New features

* [#955](https://github.com/xmake-io/xmake/issues/955#issuecomment-766481512): Support `zig cc` and `zig c++` as c/c++ compiler
* [#955](https://github.com/xmake-io/xmake/issues/955#issuecomment-768193083): Support zig cross-compilation
* [#1177](https://github.com/xmake-io/xmake/issues/1177): Improve to detect terminal and color codes
* [#1216](https://github.com/xmake-io/xmake/issues/1216): Pass custom configuration scripts to xrepo
* Add linuxos builtin module to get linux system information
* [#1217](https://github.com/xmake-io/xmake/issues/1217): Support to fetch remote toolchain package when building project
* [#1123](https://github.com/xmake-io/xmake/issues/1123): Add `rule("utils.symbols.export_all")` to export all symbols for windows/dll
* [#1181](https://github.com/xmake-io/xmake/issues/1181): Add `utils.platform.gnu2mslib(mslib, gnulib)` module api to convert mingw/xxx.dll.a to msvc xxx.lib
* [#1246](https://github.com/xmake-io/xmake/issues/1246): Improve rules and generators to support commands list
* [#1239](https://github.com/xmake-io/xmake/issues/1239): Add `add_extsources` to improve find external packages
* [#1241](https://github.com/xmake-io/xmake/issues/1241): Support add .manifest files for windows program
* Support to use `xrepo remove --all` to remove all packages
* [#1254](https://github.com/xmake-io/xmake/issues/1254): Support to export packages to parent target

### Change

* [#1226](https://github.com/xmake-io/xmake/issues/1226): Add missing qt include directories
* [#1183](https://github.com/xmake-io/xmake/issues/1183): Improve c++ lanuages to support Qt6
* [#1237](https://github.com/xmake-io/xmake/issues/1237): Add qt.ui files for vsxmake plugin
* Improve vs/vsxmake plugins to support precompiled header and intellisense
* [#1090](https://github.com/xmake-io/xmake/issues/1090): Simplify integration of custom code generators
* [#1065](https://github.com/xmake-io/xmake/issues/1065): Improve protobuf rule to support compile_commands generators
* [#1249](https://github.com/xmake-io/xmake/issues/1249): Improve vs/vsxmake generator to support startproject
* [#605](https://github.com/xmake-io/xmake/issues/605): Improve to link orders for add_deps/add_packages
* Remove deprecated `add_defines_h_if_ok` and `add_defines_h` apis for option

### Bugs fixed

* [#1219](https://github.com/xmake-io/xmake/issues/1219): Fix version check and update
* [#1235](https://github.com/xmake-io/xmake/issues/1235): Fix include directories with spaces