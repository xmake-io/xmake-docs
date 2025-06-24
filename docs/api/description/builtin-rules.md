
# Builtin rules

sinceAfter the 2.2.1 release, xmake provides some built-in rules to simplify the daily xmake.lua description and support for some common build environments.

We can view the complete list of built-in rules by running the following command:

```bash
$ xmake show -l rules
```

## mode.debug

Add the configuration rules for the debug compilation mode for the current project xmake.lua, for example:

```lua
add_rules("mode.debug")
```

Equivalent to:

```lua
if is_mode("debug") then
    set_symbols("debug")
    set_optimize("none")
end
```

We can switch to this compilation mode by `xmake f -m debug`.

## mode.release

Add the configuration rules for the release compilation mode for the current project xmake.lua, for example:

```lua
add_rules("mode.release")
```

Equivalent to:

```lua
if is_mode("release") then
    set_symbols("hidden")
    set_optimize("fastest")
    set_strip("all")
end
```

We can switch to this compilation mode by `xmake f -m release`.

## mode.releasedbg

Add the configuration rules for the releasedbg compilation mode for the current project xmake.lua, for example:

```lua
add_rules("mode.releasedbg")
```

::: tip NOTE
Compared with the release mode, this mode will also enable additional debugging symbols, which is usually very useful.
:::

Equivalent to:

```lua
if is_mode("releasedbg") then
    set_symbols("debug")
    set_optimize("fastest")
    set_strip("all")
end
```

We can switch to this compilation mode by `xmake f -m releasedbg`.

## mode.minsizerel

Add the configuration rules for the minsizerel compilation mode for the current project xmake.lua, for example:

```lua
add_rules("mode.minsizerel")
```

::: tip NOTE
Compared with the release mode, this mode is more inclined to the minimum code compilation optimization, rather than speed priority.
:::

相当于：

```lua
if is_mode("minsizerel") then
    set_symbols("hidden")
    set_optimize("smallest")
    set_strip("all")
end
```

We can switch to this compilation mode by `xmake f -m minsizerel`.

## mode.check

Add the check compilation mode configuration rules for the current project xmake.lua, generally used for memory detection, for example:

```lua
add_rules("mode.check")
```

Equivalent to:

```lua
if is_mode("check") then
    set_symbols("debug")
    set_optimize("none")
    add_cxflags("-fsanitize=address", "-ftrapv")
    add_mxflags("-fsanitize=address", "-ftrapv")
    add_ldflags("-fsanitize=address")
end
```

We can switch to this compilation mode by `xmake f -m check`.

## mode.profile

Add configuration rules for the profile compilation mode for the current project xmake.lua, which is generally used for performance analysis, for example:

```lua
add_rules("mode.profile")
```

Equivalent to:

```lua
if is_mode("profile") then
    set_symbols("debug")
    add_cxflags("-pg")
    add_ldflags("-pg")
end
```

We can switch to this compilation mode by `xmake f -m profile`.

## mode.coverage

Add the configuration rules for the coverage compilation mode for the current project xmake.lua, which is generally used for coverage analysis, for example:

```lua
add_rules("mode.coverage")
```

Equivalent to:

```lua
if is_mode("coverage") then
    add_cxflags("--coverage")
    add_mxflags("--coverage")
    add_ldflags("--coverage")
end
```

We can switch to this compilation mode by `xmake f -m coverage`.

## mode.valgrind

This mode provides valgrind memory analysis and detection support.

```lua
add_rules("mode.valgrind")
```

We can switch to this compilation mode by: `xmake f -m valgrind`.

## mode.asan

This mode provides AddressSanitizer memory analysis and detection support.

```lua
add_rules("mode.asan")
```

We can switch to this compilation mode by: `xmake f -m asan`.

## mode.tsan

This mode provides ThreadSanitizer memory analysis and detection support.

```lua
add_rules("mode.tsan")
```

We can switch to this compilation mode by: `xmake f -m tsan`.

## mode.lsan

This mode provides LeakSanitizer memory analysis and detection support.

```lua
add_rules("mode.lsan")
```

We can switch to this compilation mode by: `xmake f -m lsan`.

## mode.ubsan

This mode provides UndefinedBehaviorSanitizer memory analysis and detection support.

```lua
add_rules("mode.ubsan")
```

We can switch to this compilation mode by: `xmake f -m ubsan`.

## qt.static

A static library program used to compile and generate Qt environments:

```lua
target("test")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

## qt.shared

Dynamic library program for compiling and generating Qt environment:

```lua
target("test")
    add_rules("qt.shared")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

## qt.console

A console program for compiling and generating a Qt environment:

```lua
target("test")
    add_rules("qt.console")
    add_files("src/*.cpp")
```

## qt.quickapp

Quick(qml) ui application for compiling and generating Qt environment.


```lua
target("test")
    add_rules("qt.quickapp")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
```

## qt.quickapp_static

Quick(qml) ui application (statically linked version) for compiling and generating Qt environment.

::: tip NOTE
Need to switch to static library version Qt SDK
:::

```lua
target("test")
    add_rules("qt.quickapp_static")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
```

## qt.widgetapp

Used to compile Qt Widgets (ui/moc) applications

```lua
target("test")
    add_rules("qt.widgetapp")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h") -- add meta header files with Q_OBJECT
```

## qt.widgetapp_static

Used to compile Qt Widgets (ui/moc) applications (static library version)

::: tip NOTE
Need to switch to static library version Qt SDK
:::
```lua
target("test")
    add_rules("qt.widgetapp_static")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h") -- add meta header files with Q_OBJECT
```

For more descriptions of Qt, see: [#160](https://github.com/xmake-io/xmake/issues/160)

## xcode.bundle

Used to compile and generate ios/macos bundle program

```lua
target("test")
     add_rules("xcode.bundle")
     add_files("src/*.m")
     add_files("src/Info.plist")
```

## xcode.framework

Used to compile and generate ios/macos framework program

```lua
target("test")
     add_rules("xcode.framework")
     add_files("src/*.m")
     add_files("src/Info.plist")
```

## xcode.application

Used to compile and generate ios/macos applications

```lua
target("test")
     add_rules("xcode.application")
     add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
     add_files("src/Info.plist")
```

## wdk.env.kmdf

Application of the compilation environment setting of kmdf under WDK, need to cooperate with: `wdk.[driver|binary|static|shared]` and other rules to use.

## wdk.env.umdf

Application of the umdf compiler environment settings under WDK, you need to cooperate with: `wdk.[driver|binary|static|shared]` and other rules to use.

## wdk.env.wdm

Application wdm compiler environment settings under WDK, need to cooperate with: `wdk.[driver|binary|static|shared]` and other rules to use.

## wdk.driver

Compile and generate drivers based on the WDK environment under Windows. Currently, only the WDK10 environment is supported.

Note: need to cooperate: `wdk.env.[umdf|kmdf|wdm]`Environmental rules are used.

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

## wdk.binary

Compile and generate executable programs based on WDK environment under Windows. Currently, only WDK10 environment is supported.

Note: It is necessary to cooperate with: environment rules such as `wdk.env.[umdf|kmdf|wdm]`.

```lua
-- add target
target("app")

    -- add rules
    add_rules("wdk.binary", "wdk.env.umdf")

    -- add files
    add_files("exe/*.cpp")
```

## wdk.static

Compile and generate static library programs based on WDK environment under Windows. Currently, only WDK10 environment is supported.

Note: It is necessary to cooperate with: environment rules such as `wdk.env.[umdf|kmdf|wdm]`.

```lua
target("nonpnp")

    -- add rules
    add_rules("wdk.static", "wdk.env.kmdf")

    -- add flags for rule: wdk.tracewpp
    add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")

    -- add files
    add_files("driver/*.c", {rule = "wdk.tracewpp"})
```

## wdk.shared

Compile and generate dynamic library programs based on WDK environment under Windows. Currently, only WDK10 environment is supported.

Note: It is necessary to cooperate with: environment rules such as `wdk.env.[umdf|kmdf|wdm]`.

```lua
target("nonpnp")

    -- add rules
    add_rules("wdk.shared", "wdk.env.wdm")

    -- add flags for rule: wdk.tracewpp
    add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")

    -- add files
    add_files("driver/*.c", {rule = "wdk.tracewpp"})
```

## wdk.tracewpp

Used to enable tracewpp to preprocess source files:

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

For more information on WDK rules, see: [#159](https://github.com/xmake-io/xmake/issues/159)

## win.sdk.application

Compile and generate the winsdk application.

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

## wdk.sdk.dotnet

Used to specify certain c++ source files to be compiled as c++.net.

```lua
add_files("xmlhelper.cpp", {rule = "win.sdk.dotnet"})
```

For more information on WDK rules, see: [#159](https://github.com/xmake-io/xmake/issues/159)

## plugin.vsxmake.autoupdate

We can use this rule to automatically update the VS project file (when each build is completed) in the VS project generated by `xmake project -k vsxmake`.

```lua
add_rules("plugin.vsxmake.autoupdate")
target("test")
     set_kind("binary")
     add_files("src/*.c")
```

## plugin.compile_commands.autoupdate

We can also use this rule to automatically update the generated compile_commandss.json

```lua
add_rules("plugin.compile_commands.autoupdate", {outputdir = ".vscode"})
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

## utils.symbols.export_all

Provided in v2.5.2 and above, we can use it to automatically export all dynamic library symbols. Currently, only the symbol export of windows dll target programs is supported, even if there is no export interface through `__declspec(dllexport)` in the code.
xmake will also automatically export all c/c++ interface symbols.

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

Versions from 2.9.5 onwards also support custom filters to filter the symbol names and source file names that need to be exported:

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


Related issue [#1123](https://github.com/xmake-io/xmake/issues/1123)

## utils.symbols.export_list

We can define the list of exported symbols directly in xmake.lua, for example:

```lua
target("foo")
     set_kind("shared")
     add_files("src/foo.c")
     add_rules("utils.symbols.export_list", {symbols = {
         "add",
         "sub"}})
```

Alternatively, add a list of exported symbols in the `*.export.txt` file.

```lua
target("foo2")
     set_kind("shared")
     add_files("src/foo.c")
     add_files("src/foo.export.txt")
     add_rules("utils.symbols.export_list")
```

For a complete project example, see: [Export Symbol Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c/shared_library_export_list)

## utils.install.cmake_importfiles

We can use this rule to export the .cmake file when installing the target library file for the library import and search of other cmake projects.

## utils.install.pkgconfig_importfiles

We can use this rule to export the pkgconfig/.pc file when installing the target target library file for library import and search for other projects.

## utils.bin2c

This rule can be used in versions above v2.5.7 to introduce some binary files into the project, and see them as c/c++ header files for developers to use to obtain the data of these files.

For example, we can embed some png/jpg resource files into the code in the project.

```lua
target("console")
    set_kind("binary")
    add_rules("utils.bin2c", {extensions = {".png", ".jpg"}})
    add_files("src/*.c")
    add_files("res/*.png", "res/*.jpg")
```

::: tip NOTE
The setting of extensions is optional, the default extension is .bin
:::

Then, we can import and use it through `#include "filename.png.h"`, xmake will automatically generate the corresponding header file for you, and add the corresponding search directory.

```c
static unsigned char g_png_data[] = {
    #include "image.png.h"
};

int main(int argc, char** argv) {
    printf("image.png: %s, size: %d\n", g_png_data, sizeof(g_png_data));
    return 0;
}
```

The content of the generated header file is similar:

```console
cat build/.gens/test/macosx/x86_64/release/rules/c++/bin2c/image.png.h
  0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x78, 0x6D, 0x61, 0x6B, 0x65, 0x21, 0x0A, 0x00
```

## utils.glsl2spv

This rule can be used in v2.6.1 and above. Import glsl shader files such as `*.vert/*.frag` into the project, and then realize automatic compilation to generate `*.spv` files.

In addition, we also support binary embedding spv file data in the form of C/C++ header file, which is convenient for program use.

### Compile and generate spv file

xmake will automatically call glslangValidator or glslc to compile shaders to generate .spv files, and then output them to the specified `{outputdir = "build"}` directory.

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

Note that the `add_packages("glslang")` here is mainly used to import and bind the glslangValidator in the glslang package to ensure that xmake can always use it.

Of course, if you have already installed it on your own system, you don’t need to bind this package additionally, but I still recommend adding it.

### Compile and generate c/c++ header files

We can also use the bin2c module internally to generate the corresponding binary header file from the compiled spv file, which is convenient for direct import in user code. We only need to enable `{bin2c = true}`. :w

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

Then we can introduce in the code like this:

```c
static unsigned char g_test_vert_spv_data[] = {
    #include "test.vert.spv.h"
};

static unsigned char g_test_frag_spv_data[] = {
    #include "test.frag.spv.h"
};
```

Similar to the usage of bin2c rules, see the complete example: [glsl2spv example](https://github.com/xmake-io/xmake/tree/master/tests/projects/other/glsl2spv)

## utils.hlsl2spv

In addition to the `utils.glsl2spv` rule, we now support the `utils.hlsl2spv` rule.

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

## python.library

We can use this rule to generate python library modules with pybind11, which will adjust the module name of the python library.

```lua
add_rules("mode.release", "mode.debug")
add_requires("pybind11")

target("example")
     add_rules("python.library")
     add_files("src/*.cpp")
     add_packages("pybind11")
     set_languages("c++11")
```

with soabi:

```lua
add_rules("mode.release", "mode.debug")
add_requires("pybind11")

target("example")
     add_rules("python.library", {soabi = true})
     add_files("src/*.cpp")
     add_packages("pybind11")
     set_languages("c++11")
```

## nodejs.module

Build nodejs module.

```lua
add_requires("node-addon-api")

target("foo")
    set_languages("cxx17")
    add_rules("nodejs.module")
    add_packages("node-addon-api")
    add_files("*.cc")
end
```

## utils.ipsc

The ipsc compiler rules are supported and are used as follows.

```lua
target("test")
    set_kind("binary")
    add_rules("utils.ispc", {header_extension = "_ispc.h"})
    set_values("ispc.flags", "--target=host")
    add_files("src/*.ispc")
    add_files("src/*.cpp")
```
