
# lib.detect

This module provides very powerful probing capabilities for probing programs, compilers, language features, dependencies, and more.

::: tip NOTE
The interface of this module is spread across multiple module directories, try to import it by importing a single interface, which is more efficient.
:::

## detect.find_file

- Find files

This interface provides a more powerful project than [os.files](/api/scripts/builtin-modules/os#os-files),
which can specify multiple search directories at the same time, and can also specify additional subdirectories for each directory to match the pattern lookup,
which is equivalent to an enhanced version of [os.files](/api/scripts/builtin-modules/os#os-files).

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

::: tip NOTE
We can also quickly call and test this interface with the `xmake lua` plugin: `xmake lua lib.detect.find_file test.h /usr/local`
:::

## detect.find_path

- Find the path

The usage of this interface is similar to [lib.detect.find_file](#detect-find_file), the only difference is that the returned results are different.
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

## detect.find_library

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

## detect.find_program

- Find executable programs

This interface is more primitive than [lib.detect.find_tool](#detect-find_tool), looking for executables through the specified parameter directory.

```lua
import("lib.detect.find_program")

local program = find_program("ccache")
```

The above code is like not passing the search directory, so it will try to execute the specified program directly. If it runs ok, it will return directly: `ccache`, indicating that the search is successful.

Specify the search directory and modify the test command parameters that are attempted to run (default: `ccache --version`):

```lua
localProgram = find_program("ccache", {paths = {"/usr/bin", "/usr/local/bin"}, check = "--help"})
```

The above code will try to run: `/usr/bin/ccache --help`, if it runs successfully, it returns: `/usr/bin/ccache`.

If `--help` can't satisfy the requirement, some programs don't have the `--version/--help` parameter, then you can customize the run script to run the test:

```lua
local program = find_program("ccache", {paths = {"/usr/bin", "/usr/local/bin"}, check = function (program) os.run("%s -h", program) end })
```

Similarly, the search path list supports built-in variables and custom scripts:

```lua
local program = find_program("ccache", {paths = {"$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug;Debugger)"}})
local program = find_program("ccache", {paths = {"$(env PATH)", function () return "/usr/local/bin" end}})
```

::: tip NOTE
In order to speed up the efficiency of frequent lookups, this interface comes with a default cache, so even if you frequently find the same program, it will not take too much time.
If you want to disable the cache, you can clear the local cache by executing `xmake f -c` in the project directory.
:::

We can also test quickly with `xmake lua lib.detect.find_program ccache`.

## detect.find_programver

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

::: tip NOTE
In order to speed up the efficiency of frequent lookups, this interface is self-contained by default. If you want to disable the cache, you can execute `xmake f -c` in the project directory to clear the local cache.
:::

We can also test quickly with `xmake lua lib.detect.find_programver ccache`.

## detect.find_package

- Find package files

After 2.6.x this interface is not recommended for direct use (internal use only), for library integration, please use `add_requires()` and `add_packages()` as much as possible.

## detect.find_tool

- Find tool

This interface is also used to find executable programs, but more
advanced than [lib.detect.find_program](#detect-find_program), the
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

[lib.detect.find_program](#detect-find_program) can only determine
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
local tool = find_tool("clang", {version = true, paths = {"/usr/bin", "/usr/local/bin", "$(env PATH)", function () return "/usr/xxx/bin" end}})
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

::: tip NOTE
In order to speed up the efficiency of frequent
lookups, this interface is self-contained by default. If you want to
disable the cache, you can execute `xmake f -c` in the project
directory to clear the local cache.
:::

We can also test quickly with `xmake lua lib.detect.find_tool clang`.

## detect.find_toolname

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

## detect.find_cudadevices

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

## detect.features

- Get all the features of the specified tool

This interface is similar to [compiler.features](/api/scripts/extension-modules/core/tool/compiler#compiler-features). The difference is that this interface is more primitive. The passed argument is the actual tool name toolname.

And this interface not only can get the characteristics of the compiler, the characteristics of any tool can be obtained, so it is more versatile.

```lua
import("lib.detect.features")

local features = features("clang")
local features = features("clang", {flags = "-O0", program = "xcrun -sdk macosx clang"})
local features = features("clang", {flags = {"-g", "-O0", "-std=c++11"}})
```

By passing in flags, you can change the result of the feature, for example, some features of C++11, which are not available by default. After enabling `-std=c++11`, you can get it.

A list of all compiler features can be found at [compiler.features](/api/scripts/extension-modules/core/tool/compiler#compiler-features).

## detect.has_features

- Determine if the specified feature is supported

This interface is similar to [compiler.has_features](/api/scripts/extension-modules/core/tool/compiler#compiler-has_features), but more primitive, the passed argument is the actual tool name toolname.

And this interface can not only judge the characteristics of the compiler, but the characteristics of any tool can be judged, so it is more versatile.

```lua
import("lib.detect.has_features")

local features = has_features("clang", "cxx_constexpr")
local features = has_features("clang", {"cxx_constexpr", "c_static_assert"}, {flags = {"-g", "-O0"}, program = "xcrun -sdk macosx clang"})
local features = has_features("clang", {"cxx_constexpr", "c_static_assert"}, {flags = "-g"})
```

If the specified feature list exists, the actual supported feature sublist is returned. If none is supported, nil is returned. We can also change the feature acquisition rule by specifying flags.

A list of all compiler features can be found at [compiler.features](/api/scripts/extension-modules/core/tool/compiler#compiler-features).

## detect.has_flags

- Determine if the specified parameter option is supported

This interface is similar to [compiler.has_flags](/api/scripts/extension-modules/core/tool/compiler#compiler-has_flags), but more primitive, the passed argument is the actual tool name toolname.

```lua
import("lib.detect.has_flags")

local ok = has_flags("clang", "-g")
local ok = has_flags("clang", {"-g", "-O0"}, {program = "xcrun -sdk macosx clang"})
local ok = has_flags("clang", "-g -O0", {toolkind = "cxx"})
```

Returns true if the test passed.

The detection of this interface has been optimized. Except for the cache mechanism, in most cases, the tool's option list (`--help`) will be directly judged. If the option list is not available, it will be tried. The way to run to detect.

## detect.has_cfuncs

- Determine if the specified c function exists

This interface is a simplified version of [lib.detect.check_cxsnippets](#detect-check_cxsnippets) and is only used to detect functions.

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

## detect.has_cxxfuncs

- Determine if the specified c++ function exists

This interface is similar to [lib.detect.has_cfuncs](#detect-has_cfuncs), please refer to its instructions for use. The only difference is that this interface is used to detect c++ functions.

## detect.has_cincludes

- Determine if the specified c header file exists

This interface is a simplified version of [lib.detect.check_cxsnippets](#detect-check_cxsnippets) and is only used to detect header files.

```lua
import("lib.detect.has_cincludes")

local ok = has_cincludes("stdio.h")
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {target = target})
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {configs = {defines = "_GNU_SOURCE=1", languages ​​= "cxx11"}})
```

## detect.has_cxxincludes

- Determine if the specified c++ header file exists

This interface is similar to [lib.detect.has_cincludess](#detect-has_cincludes), please refer to its instructions for use. The only difference is that this interface is used to detect c++ header files.

## detect.has_ctypes

- Determine if the specified c type exists

This interface is a simplified version of [lib.detect.check_cxsnippets](#detect-check_cxsnippets) and is only used to detect functions.

```lua
import("lib.detect.has_ctypes")

local ok = has_ctypes("wchar_t")
local ok = has_ctypes({"char", "wchar_t"}, {includes = "stdio.h"})
local ok = has_ctypes("wchar_t", {includes = {"stdio.h", "stdlib.h"}, configs = {"defines = "_GNU_SOURCE=1", languages = "cxx11"}})
```

## detect.has_cxxtypes

- Determine if the specified c++ type exists

This interface is similar to [lib.detect.has_ctypess](#detect-has_ctypes). Please refer to its instructions for use. The only difference is that this interface is used to detect c++ types.

## detect.check_cxsnippets

- Check if the c/c++ code snippet can be compiled

The generic c/c++ code snippet detection interface, by passing in a list of multiple code snippets, it will automatically generate a compiled file, and then common sense to compile it, if the compilation pass returns true.

For some complex compiler features, even if [compiler.has_features](#compilerhas_features) can't detect it, you can detect it by trying to compile through this interface.

```lua
import("lib.detect.check_cxsnippets")

local ok = check_cxsnippets("void test() {}")
local ok = check_cxsnippets({"void test(){}", "#define TEST 1"}, {types = "wchar_t", includes = "stdio.h"})
```

This interface is a generic version of interfaces such as [detect.has_cfuncs](#detect-has_cfuncs), [detect.has_cincludes](#detect-has_cincludes), and [detect.has_ctypes](detect-has_ctypes), and is also lower level.

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

The verbose is used to echo the detection information. The target is used to append the configuration information in the target before the detection.
The sourcekind is used to specify the tool type such as the compiler. For example, the incoming `cxx` is forced to be detected as c++ code.
