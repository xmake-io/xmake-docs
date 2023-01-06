
After the 2.2.1 release, xmake not only natively supports the construction of multi-language files, but also allows users to implement complex unknown file builds by custom building rules.

Custom build rules can have a set of file extensions associated to them using `set_extensions`.
Once these extensions are associated to the rule a later call to `add_files` will automatically use this custom rule.
Here is an example rule that will use Pandoc to convert markdown files added to a build target in to HTML files:

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

Note that in xmake a rule is responsible for checking when targets are out of date and informing the user of ongoing progress.

There is also an alternative to `on_build_file` in the form of `on_build_files` which allows you to process the entire set of files in one function call.

A second form called `on_buildcmd_file` and `on_buildcmd_files` is instead declarative; rather than running arbitrary Lua to build a target it runs Lua to learn how those targets are built.
The advantage to `buildcmd` is that those rules can be exported to makefiles which do not require xmake at all in order to run.

We can use buildcmd to simplify it further, like this:

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

Files can be assigned to a specific rule regardless of their file extension. You do this by setting the `rule` custom property when adding the file like in the following example:

```lua
target("test")
    add_files("src/test/*.md.in", {rule = "markdown"})
```

A target can be superimposed to apply multiple rules to more customize its own build behavior, and even support different build environments.

!> Rules specified by `add_files("*.md", {rule = "markdown"})`, with a higher priority than the rule set by `add_rules("markdown")`.

### Built-in rules

sinceAfter the 2.2.1 release, xmake provides some built-in rules to simplify the daily xmake.lua description and support for some common build environments.

We can view the complete list of built-in rules by running the following command:

```bash
$ xmake show -l rules
```

#### mode.debug

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

#### mode.release

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

#### mode.releasedbg

Add the configuration rules for the releasedbg compilation mode for the current project xmake.lua, for example:

```lua
add_rules("mode.releasedbg")
```

!> Compared with the release mode, this mode will also enable additional debugging symbols, which is usually very useful.

Equivalent to:

```lua
if is_mode("releasedbg") then
    set_symbols("debug")
    set_optimize("fastest")
    set_strip("all")
end
```

We can switch to this compilation mode by `xmake f -m releasedbg`.

#### mode.minsizerel

Add the configuration rules for the minsizerel compilation mode for the current project xmake.lua, for example:

```lua
add_rules("mode.minsizerel")
```

!> Compared with the release mode, this mode is more inclined to the minimum code compilation optimization, rather than speed priority.

相当于：

```lua
if is_mode("minsizerel") then
    set_symbols("hidden")
    set_optimize("smallest")
    set_strip("all")
end
```

We can switch to this compilation mode by `xmake f -m minsizerel`.

#### mode.check

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

#### mode.profile

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

#### mode.coverage

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

#### mode.valgrind

This mode provides valgrind memory analysis and detection support.

```lua
add_rules("mode.valgrind")
```

We can switch to this compilation mode by: `xmake f -m valgrind`.

#### mode.asan

This mode provides AddressSanitizer memory analysis and detection support.

```lua
add_rules("mode.asan")
```

We can switch to this compilation mode by: `xmake f -m asan`.

#### mode.tsan

This mode provides ThreadSanitizer memory analysis and detection support.

```lua
add_rules("mode.tsan")
```

We can switch to this compilation mode by: `xmake f -m tsan`.

#### mode.lsan

This mode provides LeakSanitizer memory analysis and detection support.

```lua
add_rules("mode.lsan")
```

We can switch to this compilation mode by: `xmake f -m lsan`.

#### mode.ubsan

This mode provides UndefinedBehaviorSanitizer memory analysis and detection support.

```lua
add_rules("mode.ubsan")
```

We can switch to this compilation mode by: `xmake f -m ubsan`.

#### qt.static

A static library program used to compile and generate Qt environments:

```lua
target("test")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

#### qt.shared

Dynamic library program for compiling and generating Qt environment:

```lua
target("test")
    add_rules("qt.shared")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

#### qt.console

A console program for compiling and generating a Qt environment:

```lua
target("test")
    add_rules("qt.console")
    add_files("src/*.cpp")
```

#### qt.quickapp

Quick(qml) ui application for compiling and generating Qt environment.


```lua
target("test")
    add_rules("qt.quickapp")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
```

#### qt.quickapp_static

Quick(qml) ui application (statically linked version) for compiling and generating Qt environment.

!> Need to switch to static library version Qt SDK


```lua
target("test")
    add_rules("qt.quickapp_static")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
```

#### qt.widgetapp

Used to compile Qt Widgets (ui/moc) applications

```lua
target("test")
    add_rules("qt.widgetapp")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h") -- add meta header files with Q_OBJECT
```

#### qt.widgetapp_static

Used to compile Qt Widgets (ui/moc) applications (static library version)

!> Need to switch to static library version Qt SDK

```lua
target("test")
    add_rules("qt.widgetapp_static")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h") -- add meta header files with Q_OBJECT
```

For more descriptions of Qt, see: [#160](https://github.com/xmake-io/xmake/issues/160)

#### xcode.bundle

Used to compile and generate ios/macos bundle program

```lua
target("test")
     add_rules("xcode.bundle")
     add_files("src/*.m")
     add_files("src/Info.plist")
```

#### xcode.framework

Used to compile and generate ios/macos framework program

```lua
target("test")
     add_rules("xcode.framework")
     add_files("src/*.m")
     add_files("src/Info.plist")
```

#### xcode.application

Used to compile and generate ios/macos applications

```lua
target("test")
     add_rules("xcode.application")
     add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
     add_files("src/Info.plist")
```

#### wdk.env.kmdf

Application of the compilation environment setting of kmdf under WDK, need to cooperate with: `wdk.[driver|binary|static|shared]` and other rules to use.

#### wdk.env.umdf

Application of the umdf compiler environment settings under WDK, you need to cooperate with: `wdk.[driver|binary|static|shared]` and other rules to use.

#### wdk.env.wdm

Application wdm compiler environment settings under WDK, need to cooperate with: `wdk.[driver|binary|static|shared]` and other rules to use.

#### wdk.driver

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

#### wdk.binary

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

#### wdk.static

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

#### wdk.shared

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

#### wdk.tracewpp

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

#### win.sdk.application

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

#### wdk.sdk.dotnet

Used to specify certain c++ source files to be compiled as c++.net.

```lua
add_files("xmlhelper.cpp", {rule = "win.sdk.dotnet"})
```

For more information on WDK rules, see: [#159](https://github.com/xmake-io/xmake/issues/159)

#### plugin.vsxmake.autoupdate

We can use this rule to automatically update the VS project file (when each build is completed) in the VS project generated by `xmake project -k vsxmake`.

```lua
add_rules("plugin.vsxmake.autoupdate")
target("test")
     set_kind("binary")
     add_files("src/*.c")
```

#### utils.symbols.export_all

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

Related issue [#1123](https://github.com/xmake-io/xmake/issues/1123)

#### utils.symbols.export_list

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

#### utils.install.cmake_importfiles

We can use this rule to export the .cmake file when installing the target library file for the library import and search of other cmake projects.

#### utils.install.pkgconfig_importfiles

We can use this rule to export the pkgconfig/.pc file when installing the target target library file for library import and search for other projects.

#### utils.bin2c

This rule can be used in versions above v2.5.7 to introduce some binary files into the project, and see them as c/c++ header files for developers to use to obtain the data of these files.

For example, we can embed some png/jpg resource files into the code in the project.

```lua
target("console")
    set_kind("binary")
    add_rules("utils.bin2c", {extensions = {".png", ".jpg"}})
    add_files("src/*.c")
    add_files("res/*.png", "res/*.jpg")
```

!> The setting of extensions is optional, the default extension is .bin

Then, we can import and use it through `#include "filename.png.h"`, xmake will automatically generate the corresponding header file for you, and add the corresponding search directory.

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

The content of the generated header file is similar:

```console
cat build/.gens/test/macosx/x86_64/release/rules/c++/bin2c/image.png.h
  0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x78, 0x6D, 0x61, 0x6B, 0x65, 0x21, 0x0A, 0x00
```

#### utils.glsl2spv

This rule can be used in v2.6.1 and above. Import glsl shader files such as `*.vert/*.frag` into the project, and then realize automatic compilation to generate `*.spv` files.

In addition, we also support binary embedding spv file data in the form of C/C++ header file, which is convenient for program use.

##### Compile and generate spv file

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

##### Compile and generate c/c++ header files

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

#### python.library

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

#### utils.ipsc

The ipsc compiler rules are supported and are used as follows.

```lua
target("test")
    set_kind("binary")
    add_rules("utils.ispc", {header_extension = "_ispc.h"})
    set_values("ispc.flags", "--target=host")
    add_files("src/*.ispc")
    add_files("src/*.cpp")
```

### rule

#### Defining rules

```lua
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)
```

### rule:add_deps

#### Adding rule dependencies

Associated dependencies can bind a batch of rules, i.e. instead of adding rules one by one to a target using `add_rules()`, just apply a rule that will take effect for it and all its dependencies.

For example

```lua
rule("foo")
    add_deps("bar")

rule("bar")
   ...
```

We only need `add_rules("foo")` to apply both foo and bar rules.

However, by default there is no order of execution between dependencies, and scripts such as `on_build_file` for foo and bar are executed in parallel, in an undefined order.

To strictly control the order of execution, you can configure `add_deps("bar", {order = true})` to tell xmake that we need to execute scripts at the same level according to the order of dependencies.

Example.

```lua
rule("foo")
    add_deps("bar", {order = true})
    on_build_file(function (target, sourcefile)
    end)

rule("bar")
    on_build_file(function (target, sourcefile)
    end)
```

bar's `on_build_file` will be executed first.

!> To control the order of dependencies, we need xmake 2.7.2 or above to support this.

However, this way of controlling dependencies only works if both foo and bar rules are custom rules, and this does not work if you want to insert your own rules to be executed before xmake's built-in rules.

In this case, we need to use a more flexible dynamic rule creation and injection approach to modify the built-in rules.

For example, if we want to execute the `on_build_file` script for a custom cppfront rule before the built-in `c++.build` rule, we can do this in the following way.

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

#### Add imported modules for all custom scripts

For usage and description, please see: [target:add_imports](#targetadd_imports), the usage is the same.

### rule:set_extensions

#### Setting the file extension type supported by the rule

Apply rules to files with these suffixes by setting the supported extension file types, for example:

```lua
-- Define a build rule for a markdown file
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)

target("test")
    set_kind("binary")

    -- Make the test target support the construction rules of the markdown file
    add_rules("markdown")

    -- Adding a markdown file to build
    add_files("src/*.md")
    add_files("src/*.markdown")
```

### rule:on_load

#### Custom load script

The load script used to implement the custom rules will be executed when the target is loaded. You can customize some target configurations in it, for example:

```lua
rule("test")
    on_load(function (target)
        target:add("defines", "-DTEST")
    end)
```

### rule:on_config

#### custom configuration script

After `xmake config` is executed, this script is executed before Build, which is usually used for configuration work before compilation. It differs from on_load in that on_load is executed as soon as the target is loaded, and the execution timing is earlier.

If some configuration cannot be configured prematurely in on_load, it can be configured in on_config.

In addition, its execution time is earlier than before_build, and the approximate execution flow is as follows:

```
on_load -> after_load -> on_config -> before_build -> on_build -> after_build
```

### rule:on_link

#### Custom link script

The link script used to implement the custom rules overrides the default link behavior of the applied target, for example:

```lua
rule("test")
    on_link(function (target)
    end)
```

### rule:on_build

#### Custom compilation script

The build script used to implement the custom rules overrides the default build behavior of the target being applied, for example:

```lua
rule("markdown")
    on_build(function (target)
    end)
```

### rule:on_clean

#### Custom cleanup script

The cleanup script used to implement the custom rules will override the default cleanup behavior of the applied target, for example:

```lua
rule("markdown")
    on_clean(function (target)
        -- remove sourcefile.html
    end)
```

### rule:on_package

#### Custom packaging script

A packaging script for implementing custom rules that overrides the default packaging behavior of the target being applied, for example:

```lua
rule("markdown")
    on_package(function (target)
        -- package sourcefile.html
    end)
```

### rule:on_install

#### Custom installation script

An installation script for implementing custom rules that overrides the default installation behavior of the target being applied, for example:

```lua
rule("markdown")
    on_install(function (target)
    end)
```

### rule:on_uninstall

#### Custom Uninstall Script

An uninstall script for implementing custom rules that overrides the default uninstall behavior of the target being applied, for example:

```lua
rule("markdown")
    on_uninstall(function (target)
    end)
```

### rule:on_build_file

#### Customizing the build script to process one source file at a time

```lua
rule("markdown")
    on_build_file(function (target, sourcefile, opt)
        print("%%%d: %s", opt.progress, sourcefile)
    end)
```

The third parameter opt is an optional parameter, which is used to obtain some information state during the compilation process. For example, opt.progress is the compilation progress of the current period.

### rule:on_buildcmd_file

#### Custom batch compile script, process one source file at a time

This is a new interface added in version 2.5.2. The script inside will not directly construct the source file, but will construct a batch command line task through the batchcmds object.
When xmake actually executes the build, it executes these commands once.

This is very useful for project generator plugins such as `xmake project`, because third-party project files generated by the generator do not support the execution of built-in scripts such as `on_build_files`.

But the final result of `on_buildcmd_files` construction is a batch of original cmd command lines, which can be directly executed as custom commands for other project files.

In addition, compared to `on_build_files`, it also simplifies the implementation of compiling extension files, is more readable and easy to configure, and is more user-friendly.

```lua
rule("foo")
    set_extensions(".xxx")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile})
        batchcmds:add_depfiles("/xxxxx/dependfile.h", ...)
        -- batchcmds:add_depvalues(...)
        -- batchcmds:set_depmtime(os.mtime(...))
        -- batchcmds:set_depcache("xxxx.d")
    end)
```

In addition to `batchcmds:vrunv`, we also support some other batch commands, such as:

```lua
batchcmds:show("hello %s", "xmake")
batchcmds:vrunv("gcc", {"-o", objectfile, "-c", sourcefile}, {envs = {LD_LIBRARY_PATH="/xxx"}})
batchcmds:mkdir("/xxx") - and cp, mv, rm, ln ..
batchcmds:compile(sourcefile_cx, objectfile, {configs = {includedirs = sourcefile_dir, languages ​​= (sourcekind == "cxx" and "c++11")}})
batchcmds:link(objectfiles, targetfile, {configs = {linkdirs = ""}})
```

At the same time, we also simplify the configuration of dependency execution in it. The following is a complete example:

```lua
rule("lex")
    set_extensions(".l", ".ll")
    on_buildcmd_file(function (target, batchcmds, sourcefile_lex, opt)

        - imports
        import("lib.detect.find_tool")

        - get lex
        local lex = assert(find_tool("flex") or find_tool("lex"), "lex not found!")

        - get c/c++ source file for lex
        local extension = path.extension(sourcefile_lex)
        local sourcefile_cx = path.join(target:autogendir(), "rules", "lex_yacc", path.basename(sourcefile_lex) .. (extension == ".ll" and ".cpp" or ".c"))

        - add objectfile
        local objectfile = target:objectfile(sourcefile_cx)
        table.insert(target:objectfiles(), objectfile)

        - add commands
        batchcmds:show_progress(opt.progress, "${color.build.object}compiling.lex %s", sourcefile_lex)
        batchcmds:mkdir(path.directory(sourcefile_cx))
        batchcmds:vrunv(lex.program, {"-o", sourcefile_cx, sourcefile_lex})
        batchcmds:compile(sourcefile_cx, objectfile)

        - add deps
        batchcmds:add_depfiles(sourcefile_lex)
        batchcmds:set_depmtime(os.mtime(objectfile))
        batchcmds:set_depcache(target:dependfile(objectfile))
    end)
```

For a detailed description and background of this, see: [issue 1246](https://github.com/xmake-io/xmake/issues/1246)

### rule:on_build_files

#### Customizing the build script to process multiple source files at once

Most of the custom build rules, each time processing a single file, output a target file, for example: a.c => a.o

However, in some cases, we need to enter multiple source files together to build an object file, for example: a.c b.c d.c => x.o

For this situation, we can achieve this by customizing this script:

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

#### Customize batch compiling script, process multiple source files at once

For a detailed description of this, see: [rule:on_buildcmd_file](#ruleon_buildcmd_file)

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

#### Custom pre-link script

Execution scripts used to implement custom target links, for example:

```lua
rule("test")
    before_link(function (target)
    end)
```

### rule:before_build

#### Custom pre-compilation script

Used to implement the execution script before the custom target is built, for example:

```lua
rule("markdown")
    before_build(function (target)
    end)
```

### rule:before_clean

#### Custom pre-cleanup script

Used to implement the execution script before the custom target cleanup, for example:

```lua
rule("markdown")
    before_clean(function (target)
    end)
```

### rule:before_package

#### Custom the pre-package script

Used to implement the execution script before the custom target is packaged, for example:

```lua
rule("markdown")
    before_package(function (target)
    end)
```

### rule:before_install

#### Custom pre-installation script

Used to implement the execution script before the custom target installation, for example:

```lua
rule("markdown")
    before_install(function (target)
    end)
```

### rule:before_uninstall

#### Custom pre-uninstall script

Used to implement the execution script before the custom target is uninstalled, for example:

```lua
rule("markdown")
    before_uninstall(function (target)
    end)
```

### rule:before_build_file

#### Custom pre-compilation script to process one source file at a time

Similar to [rule:on_build_file](#ruleon_build_file), but the timing of this interface is called before compiling a source file.
Generally used to preprocess some source files before compiling.

### rule:before_buildcmd_file

#### Customize the pre-compilation batch script, process one source file at a time

Similar to the usage of [rule:on_buildcmd_file](#ruleon_buildcmd_file), but the time when this interface is called is before compiling a certain source file.
It is generally used to pre-process certain source files before compilation.

### rule:before_build_files

#### Customize pre-compilation scripts to process multiple source files at once

Similar to the usage of [rule:on_build_files](#ruleon_build_files), but the time when this interface is called is before compiling some source files,
It is generally used to pre-process certain source files before compilation.

### rule:before_buildcmd_files

#### Customize the pre-compilation batch script to process multiple source files at once

Similar to the usage of [rule:on_buildcmd_files](#ruleon_buildcmd_files), but the time when this interface is called is before compiling some source files,
It is generally used to pre-process certain source files before compilation.

### rule:after_link

#### Custom post-linking script

The execution script used to implement the custom target link is similar to [rule:after_link](#ruleafter_link).

### rule:after_build

#### Custom post-compilation script

The execution script used to implement the custom target build is similar to [rule:before_build](#rulebefore_build).

### rule:after_clean

#### Custom post-cleaning script

The execution script used to implement the custom target cleanup is similar to [rule:before_clean](#rulebefore_clean).

### rule:after_package

#### Custom post-packaging script

The execution script used to implement the custom target package is similar to [rule:before_package](#rulebefore_package).

### rule:after_install

#### Custom post-installation script

The execution script used to implement the custom target installation is similar to [rule:before_install](#rulebefore_install).

### rule:after_uninstall

#### Custom post-uninstallation Script

The execution script used to implement the custom target uninstallation is similar to [rule:before_uninstall](#rulebefore_uninstall).

### rule:after_build_file

#### Custom post-compilation scripts to process one source file at a time

Similar to [rule:on_build_file](#ruleon_build_file), but the timing of this interface is called after compiling a source file.
Generally used to post-process some compiled object files.

### rule:after_buildcmd_file

#### Customize the compiled batch script, process one source file at a time

Similar to the usage of [rule:on_buildcmd_file](#ruleon_buildcmd_file), but the time when this interface is called is after compiling a certain source file,
Generally used for post-processing some compiled object files.

### rule:after_build_files

#### Customize the compiled script to process multiple source files at once

The usage is similar to [rule:on_build_files](#ruleon_build_files), but the time when this interface is called is after some source files are compiled,
Generally used for post-processing some compiled object files.

### rule:after_buildcmd_files

#### Customize the compiled batch script to process multiple source files at once

The usage is similar to [rule:on_buildcmd_files](#ruleon_buildcmd_files), but the time when this interface is called is after compiling some source files,
Generally used for post-processing some compiled object files.

### rule_end

#### End definition rules

This is optional. If you want to manually end the rule definition, you can call it:

```lua
rule("test")
    -- ..
rule_end()
```

