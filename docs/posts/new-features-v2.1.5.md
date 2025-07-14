---
title: Some new features of xmake v2.1.5
tags: [xmake, lua, cmake, detect, compiler, features]
date: 2017-07-29
author: Ruki
---

#### find_package

This interface refers to the design of CMake for the `find_*` interfaces, which finds and adds package dependencies in the project target.

```lua
target("test")
    set_kind("binary")
    add_files("*.c")
    on_load(function (target)
        import("lib.detect.find_package")
        target:add(find_package("zlib"))
    end)
```

#### Package Dependency Management 2.0

Now through `find_package` and `option`, we can achieve better package management.

```lua
option("zlib")
    set_showmenu(true)
    before_check(function (option)
        import("lib.detect.find_package")
        option:add(find_package("zlib"))
    end)

target("test")
    add_options("zlib")
```

If you want to manually disable this zlib package and automatic detection and linking, you only need:

```bash
$ xmake f --zlib=n 
$ xmake
```

Note: We will implement package management 3.0 in the 2.2.1 version, if you want to known more info, please see：[Remote package management](https://github.com/xmake-io/xmake/issues/69)。

For example:

```lua
add_requires("mbedtls master optional")
add_requires("pcre2 >=1.2.0", "zlib >= 1.2.11")
add_requires("git@github.com:glennrp/libpng.git@libpng >=1.6.28")
target("test")
    add_packages("pcre2", "zlib", "libpng", "mbedtls")
```

We are currently working to develop ...






#### Custom Extensions for Modules

We can specify the extended modules directory in the project file (`xmake.lua`):

```lua
add_moduledirs("$(projectdir)/xmake/modules")
```

And add custom `detect.package.find_openssl` module to this directory.

```
projectdir
 - xmake
   - modules
     - detect/package/find_openssl.lua
```

Now we can get more package info about openssl by `lib.detect.find_package("openssl")`.

The search order of `find_package`:

1. Find the local package "openssl.pkg" from the argument `{packagedirs = "./pkg"}`
2. Call `detect.packages.find_openssl` to find it from the custom module directory `xmake/modules`in the project.
3. If `pkg-config` exists in the current system, we can use it to get more info and find it.
4. If `homebrew` exists in the current system, we can use `brew --prefix openssl` to get more info and find it.
5. Find it from the some system library directories, .e.g `/usr/lib`, `/usr/include`

#### Fast compiler feature detection support

This is also a reference to the design of CMake, details see: [issues#83](https://github.com/xmake-io/xmake/issues/83)。

```lua
target("test")
    on_load(function (target)
        import("core.tool.compiler")
        if compiler.has_features("cxx_constexpr") then
            target:add("defines", "HAS_CXX_CONSTEXPR=1")
        end
    end)
```

We can also add some parameters to control the compilation option for detection.

```lua
if compiler.has_features({"c_static_assert", "cxx_constexpr"}, {languages = "cxx11"}) then
    -- ok
end
```

Even we can pass the target and inherit all of it's compiled configuration.

```lua
if compiler.has_features("cxx_constexpr", {target = target, defines = "..", includedirs = ".."}) then
    -- ok
end
```

#### Detect specified c/c++ headers 

```lua
import("lib.detect.has_cincludes")

local ok = has_cincludes("stdio.h")
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {target = target})
```

The interface of c++ is `has_cxxincludes`:

```lua
import("lib.detect.has_cxxincludes")

local ok = has_cxxincludes({"stdio.h", "stdlib.h"}, {defines = "_GNU_SOURCE=1", languages = "cxx11"})
```

#### Detect specified c/c++ functions

```lua
import("lib.detect.has_cfuncs")

local ok = has_cfuncs("setjmp")
local ok = has_cfuncs({"sigsetjmp((void*)0, 0)", "setjmp"}, {includes = "setjmp.h"})
```

The interface of c++ is `has_cxxfuncs`.

#### Detect specified c/c++ types

```lua
import("lib.detect.has_ctypes")

local ok = has_ctypes("wchar_t")
local ok = has_ctypes({"char", "wchar_t"}, {includes = "stdio.h"})
local ok = has_ctypes("wchar_t", {includes = {"stdio.h", "stdlib.h"}, "defines = "_GNU_SOURCE=1", languages = "cxx11"})
```

The interface of c++ is `has_cxxtypes`.

#### Check specified c/c++ snippets

```lua
import("lib.detect.check_cxsnippets")

local ok = check_cxsnippets("void test() {}")
local ok = check_cxsnippets({"void test(){}", "#define TEST 1"}, {types = "wchar_t", includes = "stdio.h"})
```

And we can pass some detection condition (types, functions, includes, and links).

```lua
local ok = check_cxsnippets("void test() {}", {types = {"wchar_t", "char*"}, includes = "stdio.h", funcs = {"sigsetjmp", "sigsetjmp((void*)0, 0)"}})
```

#### Quick Test Module interface

The `xmake lua` plugin has supported REPL (READ-EVAL-PRINT) to test modules in 2.1.4 version:

```bash
$ xmake lua
> 1 + 2
3

> a = 1
> a
1

> for _, v in pairs({1, 2, 3}) do
>> print(v)
>> end
1
2
3
```

we can now test the module interface more quickly through a line of commands:

```bash
$ xmake lua lib.detect.find_package openssl
```

The results: `{links = {"ssl", "crypto", "z"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}}`

#### Precompiled header File Support

We can add a precompiled header file to speed up the c/c++ program compile, currently supported compilers are: gcc, clang and msvc.

Set c precompiled header:

```lua
target("test")
    set_pcheader("header.h")
```

Set c++ precompiled header:

```lua
target("test")
    set_pcxxheader("header.h")
```

#### Generate compiler_commands.json

```console
$ xmake project -k compile_commands
```

The output content like:

```
[
  { "directory": "/home/user/llvm/build",
    "command": "/usr/bin/clang++ -Irelative -DSOMEDEF=\"With spaces, quotes and \\-es.\" -c -o file.o file.cc",
    "file": "file.cc" },
  ...
]

```

About the format and description of `compile_commands.json`, you can see [JSONCompilationDatabase](#https://clang.llvm.org/docs/JSONCompilationDatabase.html)

#### Custom option script

Add some configuration conditions dynamically before option detection:

```lua
option("zlib")
    before_check(function (option)
        import("lib.detect.find_package")
        option:add(find_package("zlib"))
    end)
```

Control the detection results of the options by the `on_check` script:

```lua
option("test")
    add_deps("small")
    set_default(true)
    on_check(function (option)
        if option:dep("small"):enabled() then
            option:enable(false)
        end
    end)
```

We can also disable the option after checking option:

```lua
option("test")
    add_deps("small")
    add_links("pthread")
    after_check(function (option)
        option:enable(false)
    end)
```

#### Custom Target Load Script

We can add and modify target configuration dynamically by `target:add`, `target:set` in the `on_load` script.

```lua
target("test")
    on_load(function (target)
        target:add("defines", "DEBUG", "TEST=\"hello\"")
        target:add("linkdirs", "/usr/lib", "/usr/local/lib")
        target:add({includedirs = "/usr/include", "links" = "pthread"})
    end)
```

#### Differentiate platform and architecture for custom script 

For iphoneos platform and arm architecture:

```lua
target("test")
    on_build("iphoneos|arm*", function (target) 
        -- TODO
    end)
```

For macosx platform and all architecture:

```lua
target("test")
    after_build("macosx", function (target) 
        -- TODO
    end)
```

For all platform and architecture:

```lua
target("test")
    on_package(function (target) 
        -- TODO
    end)
```

并不能对不同架构、平台分别处理。

#### Get builtin variable

```lua
print(val("host"))
print(val("env PATH"))
local s = val("shell echo hello")
```

#### Add includes and links from target deps automatically

We can add `includedirs`, `links`, `linkdirs` and `rpathdirs` to target automatically if it's target deps is `static`/`shared` library. 

Before:

```lua
target("library1")
    set_kind("static")
    add_files("*.c")
    add_headers("inc1/*.h")

target("library2")
    set_kind("static")
    add_deps("library1")
    add_files("*.c")
    add_headers("inc2/*.h")
    add_includes("$(buildir)/inc1")

target("test")
    set_kind("binary")
    add_deps("library2")
    add_includes("$(buildirs)/inc2")
    add_links("library2", "library1")
    add_linkdirs("$(buildir)")
```

Now:

```lua
target("library1")
    set_kind("static")
    add_files("*.c")
    add_headers("inc1/*.h")

target("library2")
    set_kind("static")
    add_deps("library1")
    add_files("*.c")
    add_headers("inc2/*.h")

target("test")
    set_kind("binary")
    add_deps("library2")
```

#### Detect tool

```lua
import("lib.detect.find_tool")

local tool = find_tool("clang")
local tool = find_tool("clang", {check = "--help"}) 
local tool = find_tool("clang", {check = function (tool) os.run("%s -h", tool) end})
local tool = find_tool("clang", {version = true, {pathes = {"/usr/bin", "/usr/local/bin", "$(env PATH)", function () return "/usr/xxx/bin" end}})
```

#### More Secure Root Permissions compilation

You can see: [pull#113](https://github.com/xmake-io/xmake/pull/113)

#### More expansion Modules

You can see: [modules](https://github.com/xmake-io/xmake/tree/master/xmake/modules)