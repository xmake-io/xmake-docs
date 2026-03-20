---
title: Xmake v3.0.8 Preview, C# Language Support, Custom Templates and WASI Running
tags: [xmake, csharp, dotnet, pinvoke, wasi, nnd, templates]
date: 2026-03-20
author: Ruki
outline: deep
---

In this release, we have added C# language and dotnet toolchain support, along with C# and C/C++ interop support via P/Invoke. We also introduced custom project templates with `xmake create --list` for listing templates and remote template distribution.

Additionally, we added the `build.release.strip` policy, `winos.file_signature` function, WASI target running support, nnd debugger support, and the tarxz pack format.

## New Features

### C# Language and Dotnet Toolchain Support

We have added full C# language support with dotnet toolchain integration, allowing you to build C# projects directly with xmake, including console apps, shared libraries, multi-library dependencies, and NuGet package integration.

#### Basic Console Application

```lua
add_rules("mode.debug", "mode.release")

target("hello")
    set_kind("binary")
    add_files("src/Program.cs")
```

#### C# Shared Libraries and Dependencies

Build C# shared libraries with dependencies between multiple targets:

```lua
target("mylib")
    set_kind("shared")
    add_files("src/lib/*.cs")

target("app")
    set_kind("binary")
    add_deps("mylib")
    add_files("src/app/*.cs")
```

Cascading multi-library dependencies are also supported:

```lua
target("libalpha")
    set_kind("shared")
    add_files("src/libalpha/*.cs")

target("libbeta")
    set_kind("shared")
    add_deps("libalpha")
    add_files("src/libbeta/*.cs")

target("sample")
    set_kind("binary")
    add_deps("libbeta")
    add_files("src/sample/*.cs")
```

#### NuGet Package Integration

Use NuGet packages directly via `add_requires`:

```lua
add_requires("nuget::Humanizer.Core 2.14.1")

target("app")
    set_kind("binary")
    add_files("src/Program.cs")
    add_packages("nuget::Humanizer.Core")
```

#### ASP.NET Core Web Project

Build ASP.NET Core web projects by setting the SDK type via `csharp.sdk`:

```lua
target("webapp")
    set_kind("binary")
    add_values("csharp.sdk", "Microsoft.NET.Sdk.Web")
    add_files("src/Program.cs")
```

#### Rich Configuration Options

The C# rule supports a wide range of .NET project properties via `set_values()`:

```lua
target("app")
    set_kind("binary")
    add_files("src/*.cs")
    set_values("csharp.target_framework", "net8.0")
    set_values("csharp.lang_version", "12")
    set_values("csharp.nullable", "enable")
    set_values("csharp.allow_unsafe_blocks", true)
    set_values("csharp.publish_single_file", true)
    set_values("csharp.publish_trimmed", true)
```

### C# and C/C++ Interop (P/Invoke)

We now support C# calling C/C++ native libraries via P/Invoke for cross-language interoperability. Xmake automatically handles native shared library search paths, so you don't need to manually configure `LD_LIBRARY_PATH` or similar environment variables.

#### xmake.lua Configuration

```lua
add_rules("mode.debug", "mode.release")

-- Build C native library
target("mathlib")
    set_kind("shared")
    add_files("src/native/*.c")

-- C# app depending on the native library
target("app")
    set_kind("binary")
    add_deps("mathlib")
    add_files("src/app/*.cs")
```

#### C Native Library (mathlib.c)

```c
#ifdef _WIN32
#define EXPORT __declspec(dllexport)
#else
#define EXPORT __attribute__((visibility("default")))
#endif

EXPORT int add(int a, int b) {
    return a + b;
}

EXPORT int multiply(int a, int b) {
    return a * b;
}
```

#### C# Calling Code (Program.cs)

```csharp
using System.Runtime.InteropServices;

int sum = NativeMethods.add(3, 4);
int product = NativeMethods.multiply(5, 6);
Console.WriteLine($"add(3,4)={sum}");
Console.WriteLine($"multiply(5,6)={product}");

internal static class NativeMethods {
    private const string NativeLib = "mathlib";

    [DllImport(NativeLib)]
    internal static extern int add(int a, int b);

    [DllImport(NativeLib)]
    internal static extern int multiply(int a, int b);
}
```

### Custom Templates

We added custom template support. Templates are searched in priority order from the following locations:

1. **Repository templates** - `<global-repo>/templates` directory
2. **Global templates** - `<globaldir>/templates` directory

Templates are organized as `<rootdir>/<language>/<template_id>/xmake.lua`, and template files can use variables like `${TARGET_NAME}` that are automatically replaced during project creation.

```bash
# List all available templates (repo, global, and built-in)
$ xmake create --list

# Filter templates by language
$ xmake create --list -l c++

# Create a project using a specific template
$ xmake create -t mytemplate hello
```

Templates also support remote distribution via repositories. Users can upload custom templates to a repository, and others can use them by adding that repository.

### build.release.strip Policy

A new `build.release.strip` policy (enabled by default) has been added to automatically strip debug symbols from binaries in `mode.release` and `mode.releasedbg` modes, reducing the final artifact size.

```lua
-- Enabled by default, set to false to disable
set_policy("build.release.strip", false)
```

When this policy is enabled and the target has not explicitly set `set_strip()`, it will automatically apply `set_strip("all")`.

### WASI Target Running Support

We added support for running WASI targets. After compiling with the WASI SDK toolchain, you can use `xmake run` to run WASI programs directly:

```bash
$ xmake f --toolchain=wasi --sdk=/path/to/wasi-sdk
$ xmake
$ xmake run
```

### nnd Debugger Support

We added support for the [nnd](https://github.com/nicbarker/nnd) debugger, a lightweight Linux debugger. You can use it as follows:

```bash
$ xmake f --debugger=nnd
$ xmake run -d hello
```

### tarxz Pack Format

We added `tarxz` and `srctarxz` pack formats, allowing you to package programs as `.tar.xz` files via xpack for better compression ratios:

```lua
xpack("mypkg")
    set_formats("tarxz")
    -- ...
```

### winos.file_signature Function

A new `winos.file_signature` function has been added to retrieve digital signature information for files on Windows. It returns a table with signature status:

```lua
local info = winos.file_signature("C:\\Windows\\System32\\notepad.exe")
if info then
    print(info.is_signed)    -- Is the file digitally signed?
    print(info.is_trusted)   -- Is the signature valid and trusted?
    print(info.signer_name)  -- Signer name, e.g. "Microsoft Corporation"
end
```

## Changelog

### New features

* [#7398](https://github.com/xmake-io/xmake/pull/7398): Add C# language and dotnet toolchain support
* [#7410](https://github.com/xmake-io/xmake/pull/7410): Add C# and C/C++ interop support via P/Invoke
* [#7360](https://github.com/xmake-io/xmake/pull/7360): Support custom templates
* [#7367](https://github.com/xmake-io/xmake/pull/7367): Add `xmake create --list` and remote template distribution
* [#7313](https://github.com/xmake-io/xmake/pull/7313): Add `build.release.strip` policy
* [#7333](https://github.com/xmake-io/xmake/pull/7333): Add `winos.file_signature` function
* [#7336](https://github.com/xmake-io/xmake/pull/7336): Add support for running wasi target
* [#7346](https://github.com/xmake-io/xmake/pull/7346): Add nnd debugger support
* [#7366](https://github.com/xmake-io/xmake/pull/7366): Add tarxz pack format

### Changes

* [#7309](https://github.com/xmake-io/xmake/pull/7309): Keep package source
* [#7310](https://github.com/xmake-io/xmake/pull/7310): Improve check tips
* [#7311](https://github.com/xmake-io/xmake/pull/7311): Improve Xcode toolchain
* [#7312](https://github.com/xmake-io/xmake/pull/7312): Improve binutils to support wasm
* [#7320](https://github.com/xmake-io/xmake/pull/7320): Add haiku ci
* [#7329](https://github.com/xmake-io/xmake/pull/7329): Improve qt deploy for macapp
* [#7349](https://github.com/xmake-io/xmake/pull/7349): Strip embed-dir on clang/gcc for C++ modules
* [#7368](https://github.com/xmake-io/xmake/pull/7368): Move templates to repository
* [#7383](https://github.com/xmake-io/xmake/pull/7383): Split zig toolchain to zig/zigcc
* [#7384](https://github.com/xmake-io/xmake/pull/7384): Improve find_hdk
* [#7387](https://github.com/xmake-io/xmake/pull/7387): Show target name in progress
* [#7391](https://github.com/xmake-io/xmake/pull/7391): Improve to find package with vcpkg features
* [#7392](https://github.com/xmake-io/xmake/pull/7392): Fix zig for shared libraries
* [#7396](https://github.com/xmake-io/xmake/pull/7396): Improve vcpkg
* [#7399](https://github.com/xmake-io/xmake/pull/7399): Extend formatting to C++ modules
* [#7409](https://github.com/xmake-io/xmake/pull/7409): Improve ldc on windows

### Bugs fixed

* [#7299](https://github.com/xmake-io/xmake/pull/7299): Fix dependency handling for vcpkg
* [#7316](https://github.com/xmake-io/xmake/pull/7316): Fix components typo
* [#7318](https://github.com/xmake-io/xmake/pull/7318): Update tbox to fix tolower/toupper
* [#7339](https://github.com/xmake-io/xmake/pull/7339): Update tbox to fix start process on win7
* [#7344](https://github.com/xmake-io/xmake/pull/7344): Fix swig jar package module
* [#7345](https://github.com/xmake-io/xmake/pull/7345): Fix check clang info
* [#7341](https://github.com/xmake-io/xmake/pull/7341): Fix WASM QT 6.9
* [#7356](https://github.com/xmake-io/xmake/pull/7356): Fix issue #7354
* [#7371](https://github.com/xmake-io/xmake/pull/7371): Fix test verbose output
* [#7386](https://github.com/xmake-io/xmake/pull/7386): Fix install script incompatibility with coreutils 9.10
* [#7393](https://github.com/xmake-io/xmake/pull/7393): Fix build target validation
