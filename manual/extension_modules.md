
All expansion modules need to be imported through the [import](/manual/builtin_modules?id=import) interface.

### core.base.option

Commonly used to get the value of the xmake command parameter option, often used for plugin development.

#### option.get

- Get parameter option values

Used to get parameter option values in plugin development, for example:

```lua
-- import option module
import("core.base.option")

-- plugin entry function
function main(...)
    print(option.get("info"))
end
```

The above code gets the hello plugin and executes: `xmake hello --info=xxxx` The value of the `--info=` option passed in the command, and shows: `xxxx`

For task tasks or plugins that are not a main entry, you can use this:

```lua
task("hello")
    on_run(function ())
        import("core.base.option")
        print(option.get("info"))
    end)
```

### core.base.global

Used to get the configuration information of xmake global, that is, the value of the parameter option passed in `xmake g|global --xxx=val`.

!> Prior to version 2.1.5, it was `core.project.global`.

#### global.get

- Get the specified configuration value

Similar to [config.get](#configget), the only difference is that this is obtained from the global configuration.

#### global.load

- Load configuration

Similar to [global.get](#globalget), the only difference is that this is loaded from the global configuration.

#### global.directory

- Get the global configuration information directory

The default is the `~/.config` directory.

#### global.dump

- Print out all global configuration information

The output is as follows:

```lua
{
    clean = true
,   ccache = "ccache"
,   xcode_dir = "/Applications/Xcode.app"
}
```

### core.base.task

Used for task operations, generally used to call other task tasks in custom scripts and plug-in tasks.

!> Prior to version 2.1.5, it was `core.project.task`.

#### task.run

- Run the specified task

Used to run tasks or plugins defined by [task](#task) in custom scripts, plugin tasks, for example:

```lua
task("hello")
    on_run(function ()
        print("hello xmake!")
    end)

target("demo")
    on_clean(function(target)

        -- Import task module
        import("core.base.task")

        -- Run this hello task
        task.run("hello")
    end)
```

We can also increase parameter passing when running a task, for example:

```lua
task("hello")
    on_run(function (arg1, arg2)
        print("hello xmake: %s %s!", arg1, arg2)
    end)

target("demo")
    on_clean(function(target)

        -- Import task
        import("core.base.task")

        -- {} This is used for the first option, which is set to null, where two arguments are passed in the last: arg1, arg2
        task.run("hello", {}, "arg1", "arg2")
    end)
```

The second argument to `task.run` is used to pass options from the command line menu instead of passing directly into the `function (arg, ...)` function entry, for example:

```lua
-- Import task
import("core.base.task")

-- Plugin entry
function main(...)

    -- Run the built-in xmake configuration task, equivalent to: xmake f|config --plat=iphoneos --arch=armv7
    task.run("config", {plat="iphoneos", arch="armv7"})
end
```

### core.base.json

xmake provides a built-in json module, based on the implementation of lua_cjson, we can use it to quickly and directly interoperate between json and lua table.

We can use `import("core.base.json")` to directly import and use.

There are also some examples here: [Jsom Examples](https://github.com/xmake-io/xmake/blob/master/tests/modules/json/test.lua)

#### json.decode

Obtain the lua table directly from the string decoding json.

```lua
import("core.base.json")
local luatable = json.decode('[1,"2", {"a":1, "b":true}]')
print(luatable)
```

```
{
    1.0,
    "2",
    {
      b = true,
      a = 1.0
    }
  }
```

!> If there is null in it, you can use `json.null` to judge

#### json.encode

We can also directly encode a lua table.

```lua
local jsonstr = json.encode({1, "2", {a = 1}}
```

It should be noted that if you need to encode null, you need to use `json.null`, for example

```lua
local jsonstr = json.encode({json.null, 1, "2", false, true})
```

#### json.loadfile

Load the json file directly and parse it into a lua table.

```lua
local luatable = json.loadfile("/tmp/xxx.json")
```

#### json.savefile

Save the lua table to the specified json file.

```lua
json.savefile("/tmp/xxx.json", {1, {a = 1}})
```

### core.tool.linker

Linker related operations, often used for plugin development.

#### linker.link

- Execute link

For the target, link the specified object file list to generate the corresponding target file, for example:

```lua
linker.link("binary", "cc", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

Where [target](#target) is the project target, here is passed in, mainly used to get the target-specific link options. For the project target object, see: [core.project.project](#core-project-project )

Of course, you can also not specify the target, for example:

```lua
linker.link("binary", "cc", {"a.o", "b.o", "c.o"}, "/tmp/targetfile")
```

The first parameter specifies the link type and currently supports: binary, static, shared
The second parameter tells the linker that it should be linked as the source file object, and what compiler source files are compiled with, for example:

| Second Parameter Value | Description |
| ------------ | ------------ |
| cc | c compiler |
| cxx | c++ compiler |
| mm | objc compiler |
| mxx | objc++ compiler |
| gc | go compiler |
| as | assembler |
| sc | swift compiler |
| rc | rust compiler |
| dc | dlang compiler |

Specifying different compiler types, the linker will adapt the most appropriate linker to handle the link, and if several languages ​​support mixed compilation, you can pass in multiple compiler types at the same time, specifying that the linker chooses to support these hybrid compilations. The linker of the language performs link processing:

```lua
linker.link("binary", {"cc", "mxx", "sc"}, {"a.o", "b.o", "c.o"}, "/tmp/targetfile")
```

The above code tells the linker that the three object files a, b, c may be c, objc++, compiled by swift code. The linker will select the most suitable linker from the current system and toolchain to handle the link process. .

#### linker.linkcmd

- Get link command line string

Get the command line string executed in [linker.link](#linkerlink) directly, which is equivalent to:

```lua
local cmdstr = linker.linkcmd("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

Note: The extension part of ``target = target}` is optional. If the target object is passed, the generated link command will add the link option corresponding to this target configuration.

And you can also pass various configurations yourself, for example:

```lua
local cmdstr = linker.linkcmd("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {configs = {linkdirs = "/usr/lib"}})
```

#### linker.linkargv

- Get a list of link command line arguments

A little different from [linker.linkcmd](#linkerlinkcmd) is that this interface returns a list of parameters, table representation, more convenient to operate:

```lua
local program, argv = linker.linkargv("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

The first value returned is the main program name, followed by the parameter list, and `os.args(table.join(program, argv))` is equivalent to `linker.linkcmd`.

We can also run it directly by passing the return value to [os.runv](#os-runv): `os.runv(linker.linkargv(..))`

#### linker.linkflags

- Get link options

Get the link option string part of [linker.linkcmd](#linkerlinkcmd) without shellname and object file list, and return by array, for example:

```lua
local flags = linker.linkflags("shared", "cc", {target = target})
for _, flag in ipairs(flags) do
    print(flag)
end
```

The returned array of flags is an array.

#### linker.has_flags

- Determine if the specified link option is supported

Although it can be judged by [lib.detect.has_flags](detect-has_flags), but the interface is more low-level, you need to specify the linker name.
This interface only needs to specify the target type of the target, the source file type, which will automatically switch to select the currently supported linker.

```lua
if linker.has_flags(target:targetkind(), target:sourcekinds(), "-L/usr/lib -lpthread") then
    -- ok
end
```

### core.tool.compiler

Compiler related operations, often used for plugin development.

#### compiler.compile

- Perform compilation

For the target, link the specified object file list to generate the corresponding target file, for example:

```lua
compiler.compile("xxx.c", "xxx.o", "xxx.h.d", {target = target})
```

Where [target](#target) is the project target, here is the specific compile option that is mainly used to get the target. If you get the project target object, see: [core.project.project](#core-project-project)

The `xxx.h.d` file is used to store the header file dependency file list for this source file. Finally, these two parameters are optional. You can not pass them when compiling:

```lua
compiler.compile("xxx.c", "xxx.o")
```

To simply compile a source file.

#### compiler.compcmd

- Get the compile command line

Get the command line string executed directly in [compiler.compile](#compilercompile), which is equivalent to:

```lua
local cmdstr = compiler.compcmd("xxx.c", "xxx.o", {target = target})
```

Note: The extension part of ``target = target}` is optional. If the target object is passed, the generated compile command will add the link option corresponding to this target configuration.

And you can also pass various configurations yourself, for example:

```lua
local cmdstr = compiler.compcmd("xxx.c", "xxx.o", {configs = {includedirs = "/usr/include", defines = "DEBUG"}})
```

With target, we can export all source file compilation commands for the specified target:

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

- Get compiled command line list

A little different from [compiler.compargv](#compilercompargv) is that this interface returns a list of parameters, table representation, more convenient to operate:

```lua
local program, argv = compiler.compargv("xxx.c", "xxx.o")
```

#### compiler.compflags

- Get compilation options

Get the compile option string part of [compiler.compcmd](#compilercompcmd) without shList of ellnames and files, for example:

```lua
local flags = compiler.compflags(sourcefile, {target = target})
for _, flag in ipairs(flags) do
    print(flag)
end
```

The returned array of flags is an array.

#### compiler.has_flags

- Determine if the specified compilation option is supported

Although it can be judged by [lib.detect.has_flags](detect-has_flags), but the interface is more low-level, you need to specify the compiler name.
This interface only needs to specify the language type, it will automatically switch to select the currently supported compiler.

```lua
-- Determine if the c language compiler supports the option: -g
if compiler.has_flags("c", "-g") then
    -- ok
end

-- Determine if the C++ language compiler supports the option: -g
if compiler.has_flags("cxx", "-g") then
    -- ok
end
```

#### compiler.features

- Get all compiler features

Although it can be obtained by [lib.detect.features](detect-features), but the interface is more low-level, you need to specify the compiler name.
This interface only needs to specify the language type, it will automatically switch to select the currently supported compiler, and then get the current list of compiler features.

```lua
-- Get all the features of the current c compiler
local features = compiler.features("c")

-- Get all the features of the current C++ language compiler, enable the C++11 standard, otherwise you will not get the new standard features.
local features = compiler.features("cxx", {cofnig = {cxxflags = "-std=c++11"}})

-- Get all the features of the current C++ language compiler, pass all configuration information of the project target
local features = compiler.features("cxx", {target = target, configs = {defines = "..", includedirs = ".."}})
```

A list of all c compiler features:

| Feature Name |
| --------------------- |
| c_static_assert |
| c_restrict |
| c_variadic_macros |
| c_function_prototypes |

A list of all C++ compiler features:

| Feature Name |
| ------------------------------------ |
| cxx_variable_templates |
| cxx_relaxed_constexpr |
| cxx_aggregate_default_initializers |
| cxx_contextual_conversions |
| cxx_attribute_deprecated |
| cxx_decltype_auto |
| cxx_digit_separators |
| cxx_generic_lambdas |
| cxx_lambda_init_captures |
| cxx_binary_literals |
| cxx_return_type_deduction |
| cxx_decltype_incomplete_return_types |
| cxx_reference_qualified_functions |
| cxx_alignof |
| cxx_attributes |
| cxx_inheriting_constructors |
| cxx_thread_local |
| cxx_alias_templates |
| cxx_delegating_constructors |
| cxx_extended_friend_declarations |
| cxx_final |
| cxx_nonstatic_member_init |
| cxx_override |
| cxx_user_literals |
| cxx_constexpr |
| cxx_defaulted_move_initializers |
| cxx_enum_forward_declarations |
| cxx_noexcept |
| cxx_nullptr |
| cxx_range_for |
| cxx_unrestricted_unions |
| cxx_explicit_conversions |
| cxx_lambdas |
| cxx_local_type_template_args |
| cxx_raw_string_literals |
| cxx_auto_type |
| cxx_defaulted_functions |
| cxx_deleted_functions |
| cxx_generalized_initializers |
| cxx_inline_namespaces |
| cxx_sizeof_member |
| cxx_strong_enums |
| cxx_trailing_return_types |
| cxx_unicode_literals |
| cxx_uniform_initialization |
| cxx_variadic_templates |
| cxx_decltype |
| cxx_default_function_template_args |
| cxx_long_long_type |
| cxx_right_angle_brackets |
| cxx_rvalue_references |
| cxx_static_assert |
| cxx_extern_templates |
| cxx_func_identifier |
| cxx_variadic_macros |
| cxx_template_template_parameters |

#### compiler.has_features

- Determine if the specified compiler feature is supported

Although it can be obtained by [lib.detect.has_features](detect-has-features), but the interface is more low-level, you need to specify the compiler name.
And this interface only needs to specify the special name list that needs to be detected, it can automatically switch to select the currently supported compiler, and then determine whether the specified feature is supported in the current compiler.

```lua
if compiler.has_features("c_static_assert") then
    -- ok
end

if compiler.has_features({"c_static_assert", "cxx_constexpr"}, {languages ​​= "cxx11"}) then
    -- ok
end

if compiler.has_features("cxx_constexpr", {target = target, defines = "..", includedirs = ".."}) then
    -- ok
end
```

For specific feature names, refer to [compiler.features](#compilerfeatures).

### core.project.config

Used to get the configuration information when the project is compiled, that is, the value of the parameter option passed in `xmake f|config --xxx=val`.

#### config.get

- Get the specified configuration value

Used to get the configuration value of `xmake f|config --xxx=val`, for example:

```lua
target("test")
    on_run(function (target)

        -- Import configuration module
        import("core.project.config")

        -- Get configuration values
        print(config.get("xxx"))
    end)
```

#### config.load

- Load configuration

Generally used in plug-in development, the plug-in task is not like the custom script of the project, the environment needs to be initialized and loaded by itself, the default project configuration is not loaded, if you want to use [config.get](#configget) interface to get the project Configuration, then you need to:

```lua

-- Import configuration module
import("core.project.config")

function main(...)

    -- Load project configuration first
    config.load()

    -- Get configuration values
    print(config.get("xxx"))
end
```

#### config.arch

- Get the schema configuration of the current project

That is to get the platform configuration of `xmake f|config --arch=armv7`, which is equivalent to `config.get("arch")`.

#### config.plat

- Get the platform configuration of the current project

That is to get the platform configuration of `xmake f|config --plat=iphoneos`, which is equivalent to `config.get("plat")`.

#### config.mode

- Get the compilation mode configuration of the current project

That is to get the platform configuration of `xmake f|config --mode=debug`, which is equivalent to `config.get("mode")`.

#### config.buildir

- Get the output directory configuration of the current project

That is to get the platform configuration of `xmake f|config -o /tmp/output`, which is equivalent to `config.get("buildir")`.

#### config.directory

- Get the configuration information directory of the current project

Get the storage directory of the project configuration, the default is: `projectdir/.config`

#### config.dump

- Print out all configuration information of the current project

The output is for example:

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

### core.project.project

Used to get some description information of the current project, that is, the configuration information defined in the `xmake.lua` project description file, for example: [target](#target), [option](#option), etc.

#### project.load

- Load project description configuration

It is only used in the plugin, because the project configuration information has not been loaded at this time. In the custom script of the project target, you do not need to perform this operation, you can directly access the project configuration.

```lua
-- Import engineering modules
import("core.project.project")

-- Plugin entry
function main(...)

    -- Load project description configuration
    project.load()

    -- access project descriptions, such as getting specified project goals
    local target = project.target("test")
end
```

!> After version 2.1.5, if not needed, the project load will automatically load at the appropriate time.

#### project.directory

- Get the project directory

Get the current project directory, which is the directory specified in `xmake -P xxx`, otherwise it is the default current `xmake` command execution directory.

!> After version 2.1.5, it is recommended to use [os.projectdir](#os-projectdir) to get it.

#### project.target

- Get the specified project target object

Get and access the specified project target configuration, for example:

```lua
local target = project.target("test")
if target then

    -- Get the target file name
    print(target:targetfile())

    -- Get the target type, which is: binary, static, shared
    print(target:targetkind())

    -- Get the target name
    print(target:name())

    -- Get the target source file
    local sourcefiles = target:sourcefiles()

    -- Get a list of target installation header files
    local srcheaders, dstheaders = target:headerfiles()

    -- Get target dependencies
    print(target:get("deps"))
end
```

#### project.targets

- Get a list of project target objects

Returns all compilation targets for the current project, for example:

```lua
for targetname, target in pairs(project.targets()) do
    print(target:targetfile())
end
```

#### project.option

- Get the specified option object

Get and access the option objects specified in the project, for example:

```lua
local option = project.option("test")
if option:enabled() then
    option:enable(false)
end
```

#### project.options

- Get all project option objects

Returns all compilation targets for the current project, for example:

```lua
for optionname, option in pairs(project.options())
    print(option:enabled())
end
```

#### project.name

- Get the current project name

That is, get the project name configuration of [set_project](#set_project).

```lua
print(project.name())
```

#### project.version

- Get the current project version number

That is, get [set_version](#set_version) project version configuration.

```lua
print(project.version())
```

### core.language.language

Used to obtain information about the compiled language, generally used for the operation of code files.

#### language.extensions

- Get a list of code suffixes for all languages

The results are as follows:

```lua
{
     [".c"] = cc
,    [".cc"] = cxx
,    [".cpp"] = cxx
,    [".m"] = mm
,    [".mm"] = mxx
,    [".swift"] = sc
,    [".go"] = gc
}
```

#### language.targetkinds

- Get a list of target types in all languages

The results are as follows:

```lua
{
     binary = {"ld", "gcld", "dcld"}
,    static = {"ar", "gcar", "dcar"}
,    shared = {"sh", "dcsh"}
}
```

#### language.sourcekinds

- Get a list of source file types in all languages

The results are as follows:

```lua
{
     cc = ".c"
,    cxx = {".cc", ".cpp", ".cxx"}
,    mm = ".m"
,    mxx = ".mm"
,    sc = ".swift"
,    gc = ".go"
,    rc = ".rs"
,    dc = ".d"
,    as = {".s", ".S", ".asm"}
}
```

#### language.sourceflags

- Load a list of source file compilation option names for all languages

The results are as follows:

```lua
{
     cc = {"cflags", "cxflags"}
,    cxx = {"cxxflags", "cxflags"}
,    ...
}
```

#### language.load

- Load the specified language

Load a specific language object from the language name, for example:

```lua
local lang = language.load("c++")
if lang then
    print(lang:name())
end
```

#### language.load_sk

- Load the specified language from the source file type

Load specific language objects from the source file type: `cc, cxx, mm, mxx, sc, gc, as ..`, for example:

```lua
local lang = language.load_sk("cxx")
if lang then
    print(lang:name())
end
```

#### language.load_ex

- Load the specified language from the source file suffix name

Load specific language objects from the source file extension: `.cc, .c, .cpp, .mm, .swift, .go ..`, for example:

```lua
local lang = language.load_ex(".cpp")
if lang then
    print(lang:name())
end
```

#### language.sourcekind_of

- Get the source file type of the specified source file

That is, from a given source file path, get the type of source file it belongs to, for example:

```lua
print(language.sourcekind_of("/xxxx/test.cpp"))
```

The result is: `cxx`, which is the `c++` type. For the corresponding list, see: [language.sourcekinds](#languagesourcekinds)

### lib.detect

This module provides very powerful probing capabilities for probing programs, compilers, language features, dependencies, and more.

!> The interface of this module is spread across multiple module directories, try to import it by importing a single interface, which is more efficient.

#### detect.find_file

- Find files

This interface provides a more powerful project than [os.files](#os-files), which can specify multiple search directories at the same time, and can also specify additional subdirectories for each directory to match the pattern lookup, which is equivalent to [ An enhanced version of os.files](#os-files).

E.g:

```lua
import("lib.detect.find_file")

local file = find_file("ccache", { "/usr/bin", "/usr/local/bin"})
```

If found, the result returned is: `/usr/bin/ccache`

It also supports pattern matching paths for recursive lookups, similar to `os.files`:

```lua
local file = find_file("test.h", { "/usr/include", "/usr/local/include/**"})
```

Not only that, but the path inside also supports built-in variables to get the path from the environment variables and the registry to find:

```lua
local file = find_file("xxx.h", { "$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name)"})
```

If the path rules are more complex, you can also dynamically generate path entries through a custom script:

```lua
local file = find_file("xxx.h", { "$(env PATH)", function () return val("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name"):match ("\"(.-)\"") end})
```

In most cases, the above use has met various needs. If you need some extended functions, you can customize some optional configurations by passing in the third parameter, for example:

```lua
local file = find_file("test.h", { "/usr", "/usr/local"}, {suffixes = {"/include", "/lib"}})
```

By specifying a list of suffixes subdirectories, you can extend the list of paths (the second parameter) so that the actual search directory is expanded to:

```
/usr/include
/usr/lib
/usr/local/include
/usr/local/lib
```

And without changing the path list, you can dynamically switch subdirectories to search for files.

!> We can also quickly call and test this interface with the `xmake lua` plugin: `xmake lua lib.detect.find_file test.h /usr/local`

#### detect.find_path

- Find the path

The usage of this interface is similar to [lib.detect.find_file](#detectfind_file), the only difference is that the returned results are different.
After the interface finds the incoming file path, it returns the corresponding search path, not the file path itself. It is generally used to find the parent directory location corresponding to the file.

```lua
import("lib.detect.find_path")

local p = find_path("include/test.h", { "/usr", "/usr/local"})
```

If the above code is successful, it returns: `/usr/local`, if `test.h` is in `/usr/local/include/test.h`.

Another difference is that this interface is passed in not only the file path, but also the directory path to find:

```lua
local p = find_path("lib/xxx", { "$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name)"})
```

Again, this interface also supports pattern matching and suffix subdirectories:

```lua
local p = find_path("include/*.h", { "/usr", "/usr/local/**"}, {suffixes = "/subdir"})
```

#### detect.find_library

- Find library files

This interface is used to find library files (static libraries, dynamic libraries) in the specified search directory, for example:

```lua
import("lib.detect.find_library")

local library = find_library("crypto", {"/usr/lib", "/usr/local/lib"})
```

Running on macosx, the results returned are as follows:

```lua
{
    filename = libcrypto.dylib
,   linkdir = /usr/lib
,   link = crypto
,   kind = shared
}
```

If you do not specify whether you need a static library or a dynamic library, then this interface will automatically select an existing library (either a static library or a dynamic library) to return.

If you need to force the library type you need to find, you can specify the kind parameter as (`static/shared`):

```lua
local library = find_library("crypto", {"/usr/lib", "/usr/local/lib"}, {kind = "static"})
```

This interface also supports suffixes suffix subdirectory search and pattern matching operations:

```lua
local library = find_library("cryp*", {"/usr", "/usr/local"}, {suffixes = "/lib"})
```

#### detect.find_program

- Find executable programs

This interface is more primitive than [lib.detect.find_tool](#detectfind_tool), looking for executables through the specified parameter directory.

```lua
import("lib.detect.find_program")

local program = find_program("ccache")
```

The above code is like not passing the search directory, so it will try to execute the specified program directly. If it runs ok, it will return directly: `ccache`, indicating that the search is successful.

Specify the search directory and modify the test command parameters that are attempted to run (default: `ccache --version`):

```lua
localProgram = find_program("ccache", {pathes = {"/usr/bin", "/usr/local/bin"}, check = "--help"})
```

The above code will try to run: `/usr/bin/ccache --help`, if it runs successfully, it returns: `/usr/bin/ccache`.

If `--help` can't satisfy the requirement, some programs don't have the `--version/--help` parameter, then you can customize the run script to run the test:

```lua
local program = find_program("ccache", {pathes = {"/usr/bin", "/usr/local/bin"}, check = function (program) os.run("%s -h", program) end })
```

Similarly, the search path list supports built-in variables and custom scripts:

```lua
local program = find_program("ccache", {pathes = {"$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug;Debugger)"}})
local program = find_program("ccache", {pathes = {"$(env PATH)", function () return "/usr/local/bin" end}})
```

!> In order to speed up the efficiency of frequent lookups, this interface comes with a default cache, so even if you frequently find the same program, it will not take too much time.
If you want to disable the cache, you can clear the local cache by executing `xmake f -c` in the project directory.

We can also test quickly with `xmake lua lib.detect.find_program ccache`.

#### detect.find_programver

- Find the executable version number


```lua
import("lib.detect.find_programver")

local programver = find_programver("ccache")
```

The return result is: 3.2.2

By default it will try to get the version via `ccache --version`. If this parameter doesn't exist, you can specify other parameters yourself:

```lua
local version = find_programver("ccache", {command = "-v"})
```

Even the custom version gets the script:

```lua
local version = find_programver("ccache", {command = function () return os.iorun("ccache --version") end})
```

For the extraction rule of the version number, if the built-in matching mode does not meet the requirements, you can also customize:

```lua
local version = find_programver("ccache", {command = "--version", parse = "(%d+%.?%d*%.?%d*.-)%s"})
local version = find_programver("ccache", {command = "--version", parse = function (output) return output:match("(%d+%.?%d*%.?%d*.-)%s ") end})
```

!> In order to speed up the efficiency of frequent lookups, this interface is self-contained by default. If you want to disable the cache, you can execute `xmake f -c` in the project directory to clear the local cache.

We can also test quickly with `xmake lua lib.detect.find_programver ccache`.

#### detect.find_package

- Find package files

After 2.6.x this interface is not recommended for direct use (internal use only), for library integration, please use `add_requires()` and `add_packages()` as much as possible.

#### detect.find_tool

- Find tool

This interface is also used to find executable programs, but more
advanced than [lib.detect.find_program](#detectfind_program), the
function is also more powerful, it encapsulates the executable
program, providing the concept of tools:

* toolname: tool name, short for executable program, used to mark a
* tool, for example: `gcc`, `clang`, etc.  program: executable program
* command, for example: `xcrun -sdk macosx clang`

The corresponding relationship is as follows:

| toolname | program |
| --------- | ----------------------------------- |
| clang | `xcrun -sdk macosx clang` |
| gcc | `/usr/toolchains/bin/arm-linux-gcc` |
| link | `link.exe -lib` |

[lib.detect.find_program](#detectfind_program) can only determine
whether the program exists by passing in the original program command
or path.  And `find_tool` can find the tool through a more consistent
toolname, and return the corresponding program complete command path,
for example:

```lua
import("lib.detect.find_tool")

local tool = find_tool("clang")
```

The result returned is: `{name = "clang", program = "clang"}`, at this
time there is no difference, we can manually specify the executable
command:

```lua
local tool = find_tool("clang", {program = "xcrun -sdk macosx clang"})
```

The result returned is: `{name = "clang", program = "xcrun -sdk macosx
clang"}`

In macosx, gcc is clang. If we execute `gcc --version`, we can see
that it is a vest of clang. We can intelligently identify it through
the `find_tool` interface:

```lua
local tool = find_tool("gcc")
```

The result returned is: `{name = "clang", program = "gcc"}`

The difference can be seen by this result. The tool name will actually
be marked as clang, but the executable command uses gcc.

We can also specify the `{version = true}` parameter to get the
version of the tool, and specify a custom search path. It also
supports built-in variables and custom scripts:

```lua
local tool = find_tool("clang", {version = true, {pathes = {"/usr/bin", "/usr/local/bin", "$(env PATH)", function () return "/usr/xxx/bin" end}})
```

The result returned is: `{name = "clang", program = "/usr/bin/clang",
version = "4.0"}`

This interface is a high-level wrapper around `find_program`, so it
also supports custom script detection:

```lua
local tool = find_tool("clang", {check = "--help"})
local tool = find_tool("clang", {check = function (tool) os.run("%s -h", tool) end})
```

Finally, the search process of `find_tool`:

1. First try to run and detect with the argument of `{program =
"xxx"}`.  2. If there is a `detect.tools.find_xxx` script in
`xmake/modules/detect/tools`, call this script for more accurate
detection.  3. Try to detect from the system directory such as
`/usr/bin`, `/usr/local/bin`.

We can also add a custom lookup script to the module directory
specified by `add_moduledirs` in the project `xmake.lua` to improve
the detection mechanism:

```
projectdir
- xmake/modules
- detect/tools/find_xxx.lua
```

For example, we customize a lookup script for `find_7z.lua`:

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

After placing it in the project's module directory, execute: `xmake l
lib.detect.find_tool 7z` to find it.

!> In order to speed up the efficiency of frequent
lookups, this interface is self-contained by default. If you want to
disable the cache, you can execute `xmake f -c` in the project
directory to clear the local cache.

We can also test quickly with `xmake lua lib.detect.find_tool clang`.

#### detect.find_toolname

- Find tool name

Match the corresponding tool name with the program command, for
example:

| program | toolname |
| ------------------------- | ---------- |
| `xcrun -sdk macosx clang` | clang |
| `/usr/bin/arm-linux-gcc` | gcc |
| `link.exe -lib` | link |
| `gcc-5` | gcc |
| `arm-android-clang++` | clangxx |
| `pkg-config` | pkg_config |

Compared with program, toolname can uniquely mark a tool, and it is also convenient to find and load the corresponding script `find_xxx.lua`.

#### detect.find_cudadevices

- Find CUDA devices of the host

Enumerate CUDA devices through the CUDA Runtime API and query theirs properties.

```lua
import("lib.detect.find_cudadevices")

local devices = find_cudadevices({ skip_compute_mode_prohibited = true })
local devices = find_cudadevices({ min_sm_arch = 35, order_by_flops = true })
```

The result returned is: `{ { ['$id'] = 0, name = "GeForce GTX 960M", major = 5, minor = 0, ... }, ... }`

The included properties will vary depending on the current CUDA version.
Please refer to [CUDA Toolkit Documentation](https://docs.nvidia.com/cuda/cuda-runtime-api/structcudaDeviceProp.html#structcudaDeviceProp) and its historical version for more information.

#### detect.features

- Get all the features of the specified tool

This interface is similar to [compiler.features](#compilerfeatures). The difference is that this interface is more primitive. The passed argument is the actual tool name toolname.

And this interface not only can get the characteristics of the compiler, the characteristics of any tool can be obtained, so it is more versatile.

```lua
import("lib.detect.features")

local features = features("clang")
local features = features("clang", {flags = "-O0", program = "xcrun -sdk macosx clang"})
local features = features("clang", {flags = {"-g", "-O0", "-std=c++11"}})
```

By passing in flags, you can change the result of the feature, for example, some features of C++11, which are not available by default. After enabling `-std=c++11`, you can get it.

A list of all compiler features can be found at [compiler.features](#compilerfeatures).

#### detect.has_features

- Determine if the specified feature is supported

This interface is similar to [compiler.has_features](#compilerhas_features), but more primitive, the passed argument is the actual tool name toolname.

And this interface can not only judge the characteristics of the compiler, but the characteristics of any tool can be judged, so it is more versatile.

```lua
import("lib.detect.has_features")

local features = has_features("clang", "cxx_constexpr")
local features = has_features("clang", {"cxx_constexpr", "c_static_assert"}, {flags = {"-g", "-O0"}, program = "xcrun -sdk macosx clang"})
local features = has_features("clang", {"cxx_constexpr", "c_static_assert"}, {flags = "-g"})
```

If the specified feature list exists, the actual supported feature sublist is returned. If none is supported, nil is returned. We can also change the feature acquisition rule by specifying flags.

A list of all compiler features can be found at [compiler.features](#compilerfeatures).

#### detect.has_flags

- Determine if the specified parameter option is supported

This interface is similar to [compiler.has_flags](#compilerhas_flags), but more primitive, the passed argument is the actual tool name toolname.

```lua
import("lib.detect.has_flags")

local ok = has_flags("clang", "-g")
local ok = has_flags("clang", {"-g", "-O0"}, {program = "xcrun -sdk macosx clang"})
local ok = has_flags("clang", "-g -O0", {toolkind = "cxx"})
```

Returns true if the test passed.

The detection of this interface has been optimized. Except for the cache mechanism, in most cases, the tool's option list (`--help`) will be directly judged. If the option list is not available, it will be tried. The way to run to detect.

#### detect.has_cfuncs

- Determine if the specified c function exists

This interface is a simplified version of [lib.detect.check_cxsnippets](#detectcheck_cxsnippets) and is only used to detect functions.

```lua
import("lib.detect.has_cfuncs")

local ok = has_cfuncs("setjmp")
local ok = has_cfuncs({"sigsetjmp((void*)0, 0)", "setjmp"}, {includes = "setjmp.h"})
```

The rules for describing functions are as follows:

| Function Description | Description |
| ----------------------------------------------- | ------------- |
| `sigsetjmp` | pure function name |
| `sigsetjmp((void*)0, 0)` | Function Call |
| `sigsetjmp{int a = 0; sigsetjmp((void*)a, a);}` | function name + {} block |

In the last optional parameter, in addition to specifying `includes`, you can also specify other parameters to control the option conditions for compile detection:

```lua
{ verbose = false, target = [target|option], includes = .., configs = {linkdirs = .., links = .., defines = ..}}
```

The verbose is used to echo the detection information, the target is used to append the configuration information in the target before the detection, and the config is used to customize the compilation options related to the target.

#### detect.has_cxxfuncs

- Determine if the specified c++ function exists

This interface is similar to [lib.detect.has_cfuncs](#detecthas_cfuncs), please refer to its instructions for use. The only difference is that this interface is used to detect c++ functions.

#### detect.has_cincludes

- Determine if the specified c header file exists

This interface is a simplified version of [lib.detect.check_cxsnippets](#detectcheck_cxsnippets) and is only used to detect header files.

```lua
import("lib.detect.has_cincludes")

local ok = has_cincludes("stdio.h")
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {target = target})
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {configs = {defines = "_GNU_SOURCE=1", languages ​​= "cxx11"}})
```

#### detect.has_cxxincludes

- Determine if the specified c++ header file exists

This interface is similar to [lib.detect.has_cincludess](#detecthas_cincludes), please refer to its instructions for use. The only difference is that this interface is used to detect c++ header files.

#### detect.has_ctypes

- Determine if the specified c type exists

This interface is a simplified version of [lib.detect.check_cxsnippets](#detectcheck_cxsnippets) and is only used to detect functions.

```lua
import("lib.detect.has_ctypes")

local ok = has_ctypes("wchar_t")
local ok = has_ctypes({"char", "wchar_t"}, {includes = "stdio.h"})
local ok = has_ctypes("wchar_t", {includes = {"stdio.h", "stdlib.h"}, configs = {"defines = "_GNU_SOURCE=1", languages ​​= "cxx11"}})
```

#### detect.has_cxxtypes

- Determine if the specified c++ type exists

This interface is similar to [lib.detect.has_ctypess](#detecthas_ctypes). Please refer to its instructions for use. The only difference is that this interface is used to detect c++ types.

#### detect.check_cxsnippets

- Check if the c/c++ code snippet can be compiled

The generic c/c++ code snippet detection interface, by passing in a list of multiple code snippets, it will automatically generate a compiled file, and then common sense to compile it, if the compilation pass returns true.

For some complex compiler features, even if [compiler.has_features](#compilerhas_features) can't detect it, you can detect it by trying to compile through this interface.

```lua
import("lib.detect.check_cxsnippets")

local ok = check_cxsnippets("void test() {}")
local ok = check_cxsnippets({"void test(){}", "#define TEST 1"}, {types = "wchar_t", includes = "stdio.h"})
```

This interface is a generic version of interfaces such as [detect.has_cfuncs](#detecthas_cfuncs), [detect.has_cincludes](#detecthas_cincludes), and [detect.has_ctypes](detect-has_ctypes), and is also lower level.

So we can use it to detect: types, functions, includes and links, or combine them together to detect.

The first parameter is a list of code fragments, which are generally used for the detection of some custom features. If it is empty, it can only detect the conditions in the optional parameters, for example:

```lua
local ok = check_cxsnippets({}, {types = {"wchar_t", "char*"}, includes = "stdio.h", funcs = {"sigsetjmp", "sigsetjmp((void*)0, 0)"} })
```

The above call will check if the types, includes and funcs are both satisfied, and return true if passed.

There are other optional parameters:

```lua
{ verbose = false, target = [target|option], sourcekind = "[cc|cxx]"}
```

The verbose is used to echo the detection information. The target is used to append the configuration information in the target before the detection. The sourcekind is used to specify the tool type such as the compiler. For example, the incoming `cxx` is forced to be detected as c++ code.

### net.http

This module provides various operational support for http. The currently available interfaces are as follows:

#### http.download

- Download http file

This interface is relatively simple, is simply download files.

```lua
import("net.http")

http.download("https://xmake.io", "/tmp/index.html")
```

### privilege.sudo

This interface is used to run commands via `sudo` and provides platform consistency handling, which can be used for scripts that require root privileges to run.

!> In order to ensure security, unless you must use it, try not to use this interface in other cases.

#### sudo.has

- Determine if sudo supports

At present, sudo is supported only under `macosx/linux`. The administrator privilege running on Windows is not supported yet. Therefore, it is recommended to use the interface to judge the support situation before use.

```lua
import("privilege.sudo")

if sudo.has() then
    sudo.run("rm /system/file")
end
```

#### sudo.run

- Quietly running native shell commands

For specific usage, please refer to: [os.run](#os-run).

```lua
import("privilege.sudo")

sudo.run("rm /system/file")
```

#### sudo.runv

- Quietly running native shell commands with parameter list

For specific usage, please refer to: [os.runv](#os-runv).

#### sudo.exec

- Echo running native shell commands

For specific usage, please refer to: [os.exec](#os-exec).

#### sudo.execv

- Echo running native shell commands with parameter list

For specific usage, please refer to: [os.execv](#os-execv).

#### sudo.iorun

- Quietly running native shell commands and getting output

For specific usage, please refer to: [os.iorun](#os-iorun).

#### sudo.iorunv

- Run the native shell command quietly and get the output with a list of parameters

For specific usage, please refer to: [os.iorunv](#os-iorunv).

### devel.git

This interface provides access to various commands of git. Compared to the direct call to git command, this module provides a more easy-to-use package interface and provides automatic detection and cross-platform processing for git.

!> Currently on Windows, you need to manually install the git package before you can detect it. The subsequent version will provide automatic integration of git function. Users will not need to care about how to install git, they can be used directly.

#### git.clone

- clone codebase

This interface corresponds to the `git clone` command.

```lua
import("devel.git")

git.clone("git@github.com:tboox/xmake.git")
git.clone("git@github.com:tboox/xmake.git", {depth = 1, branch = "master", outputdir = "/tmp/xmake"})
```

#### git.pull

- Pull the code base for the latest submission

This interface corresponds to the `git pull` command.

```lua
import("devel.git")

git.pull()
git.pull({remote = "origin", tags = true, branch = "master", repodir = "/tmp/xmake"})
```

#### git.clean

- Clean up the code base file

This interface corresponds to the `git clean` command.

```lua
import("devel.git")

git.clean()
git.clean({repodir = "/tmp/xmake", force = true})
```

#### git.checkout

- Check out the specified branch version

This interface corresponds to the `git checkout` command

```lua
import("devel.git")

git.checkout("master", {repodir = "/tmp/xmake"})
git.checkout("v1.0.1", {repodir = "/tmp/xmake"})
```

#### git.refs

- Get a list of all references

This interface corresponds to the `git ls-remote --refs` command

```lua
import("devel.git")

local refs = git.refs(url)
```

#### git.tags

- Get a list of all tags

This interface corresponds to the `git ls-remote --tags` command

```lua
import("devel.git")

local tags = git.tags(url)
```

#### git.branches

- Get a list of all branches

This interface corresponds to the `git ls-remote --heads` command

```lua
import("devel.git")

local branches = git.branches(url)
```

### utils.archive

This module is used to compress and decompress files. It supports decompression of most common compression formats. It will automatically detect which compression tools are provided by the system, and then will use the most appropriate compression tool for the operation.

#### archive.archive

- zip files

```lua
import("utils.archive")

archive.archive("/tmp/outputdir", "/tmp/a.zip")
archive.archive("/tmp/outputdir", "/tmp/a.7z")
archive.archive("/tmp/outputdir", "/tmp/a.gzip")
archive.archive("/tmp/outputdir", "/tmp/a.tar.bz2")
```

Some configuration options can also be added, such as recursive directories, compression quality, exclude files, etc.

```lua
import("utils.archive")

local options = {}
options.curdir = "/tmp"
options.recurse = true
options.compress = "fastest|faster|default|better|best"
options.excludes = {"*/dir/*", "dir/*"}
archive.archive("/tmp/outputdir", "/tmp/a.zip", options)
```

#### archive.extract

- unzip files

```lua
import("utils.archive")

archive.extract("/tmp/a.zip", "/tmp/outputdir")
archive.extract("/tmp/a.7z", "/tmp/outputdir")
archive.extract("/tmp/a.gzip", "/tmp/outputdir")
archive.extract("/tmp/a.tar.bz2", "/tmp/outputdir")
```

### utils.platform

This module is used for some platform-related auxiliary operation interfaces

#### utils.platform.gnu2mslib

- Convert mingw's libxxxdll.a to msvc's xxx.lib library

This feature is particularly helpful for Fortran & C++ mixed projects, because VS does not provide the fortran compiler. You can only use MinGW's gfortran to compile the fortran part, and then link with the VS project.
Often such projects also have some other libraries provided in the vs format, so pure MinGW compilation is not possible, you can only use this function to mix compilation.

And cmake also has a similar [GNUtoMS](https://cmake.org/cmake/help/latest/prop_tgt/GNUtoMS.html).

For related issues, see: [#1181](https://github.com/xmake-io/xmake/issues/1181)

```lua
import("utils.platform.gnu2mslib")

gnu2mslib("xxx.lib", "xxx.dll.a")
gnu2mslib("xxx.lib", "xxx.def")
gnu2mslib("xxx.lib", "xxx.dll.a", {dllname = "xxx.dll", arch = "x64"})
```

Support to generate xxx.lib from def, and also support to automatically export .def from xxx.dll.a, and then generate xxx.lib

If you don’t want to automatically generate def from dll.a, but want to borrow the def generated by gnu linker, then configure it yourself through add_shflags("-Wl,--output-def,xxx.def") to generate def, and then pass in def to this interface. .

`{dllname = xxx, arch = "xxx"}` These are optional, according to your needs.

You can also directly xmake l utils.platform.gnu2mslib xxx.lib xxx.dll.a quick test verification
