---
title: Xmake v3.0.6 Released, Android Native Apps, Flang, AppImage/dmg Support 
tags: [xmake, android, flang, cuda, qt, packaging, msvc, binutils]
date: 2025-12-17
author: Ruki
outline: deep
---

## Introduction of new features

### Android Native App Build Support

The new version further improves the build support for Android native applications. We can now configure more parameters in the `android.native_app` rule, including `android_sdk_version`, `android_manifest`, `android_res`, `keystore`, etc.

In addition, for scenarios that require custom entry and event loops (such as game engine integration), we support disabling the default `android_native_app_glue` library by setting `native_app_glue = false`.

```lua
add_rules("mode.debug", "mode.release")

add_requires("raylib 5.5.0")

target("raydemo_custom_glue")
    set_kind("binary")
    set_languages("c++17")
    add_files("src/main.cpp", "src/android_native_app_glue.c")
    add_syslinks("log")
    add_packages("raylib")
    add_rules("android.native_app", {
        android_sdk_version = "35",
        android_manifest = "android/AndroidManifest.xml",
        android_res = "android/res",
        keystore = "android/debug.jks",
        keystore_pass = "123456",
        package_name = "com.raylib.custom_glue",
        native_app_glue = false, -- Disable default glue
        logcat_filters = {"raydemo_custom_glue", "raylib"}
    })
```

### bin2obj Rule

The newly added `utils.bin2obj` rule significantly improves build speed compared to `utils.bin2c` by directly generating object files (COFF, ELF, Mach-O) for linking, skipping the C code generation and compilation steps.

**Performance Comparison (120MB file):**
- **bin2obj**: ~1.8s
- **bin2c**: ~354s

It supports multiple architectures (x86, ARM, RISC-V, etc.) and formats (COFF for Windows, ELF for Linux/Android, Mach-O for macOS/iOS).

**Basic Usage**

```lua
target("myapp")
    set_kind("binary")
    add_rules("utils.bin2obj", {extensions = {".bin", ".ico"}})
    add_files("src/*.c")
    -- Embed data.bin, ensure zero termination
    add_files("assets/data.bin", {zeroend = true})
```

**Accessing Data in C/C++**

The symbol names are automatically generated based on the filename (e.g., `_binary_<filename>_start` and `_binary_<filename>_end`).

```c
#include <stdio.h>
#include <stdint.h>

extern const uint8_t _binary_data_bin_start[];
extern const uint8_t _binary_data_bin_end[];

int main() {
    // Calculate size
    const uint32_t size = (uint32_t)(_binary_data_bin_end - _binary_data_bin_start);
    
    // Access the data
    printf("Data size: %u bytes\n", size);
    for (uint32_t i = 0; i < size; i++) {
        printf("%02x ", _binary_data_bin_start[i]);
    }
    return 0;
}
```

In addition, the `glsl2spv` and `hlsl2spv` rules also add support for `bin2obj`, which can directly embed compiled SPIR-V files as object files.

```lua
target("test")
    set_kind("binary")
    add_rules("utils.glsl2spv", {bin2obj = true})
    add_files("src/*.c")
    add_files("src/*.vert", "src/*.frag")
```

### Flang Toolchain Support

Xmake now supports the LLVM Flang compiler, making it more convenient to build Fortran projects. Usually, Xmake will automatically detect and use the available Flang compiler in the system.

You can also manually specify using the Flang toolchain:

```bash
$ xmake f --toolchain=flang
$ xmake
```

Or configure it in `xmake.lua`:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.f90") 
```

### Qt Pack and AppImage/dmg Packaging

The XPack packaging module now supports generating Qt deployment packages, as well as AppImage (Linux) and dmg (macOS) formats. This makes distributing cross-platform GUI applications much simpler.

For example, configuring the packaging of a Qt Widget application:

```lua
includes("@builtin/xpack")

target("qtapp")
    add_rules("qt.widgetapp")
    add_files("src/*.cpp") 
    -- ... other configurations

xpack("qtapp")
    set_formats("nsis", "dmg", "appimage", "zip")
    set_title("Qt Widget App")
    add_targets("qtapp")
    
    -- Set icon file based on format
    on_load(function (package)
        local scriptdir = os.scriptdir()
        if package:format() == "appimage" then
            package:set("iconfile", path.join(scriptdir, "src/assets/xmake.png"))
        else
            package:set("iconfile", path.join(scriptdir, "src/assets/xmake.ico"))
        end
    end)
```

Execute the packaging command:

```bash
$ xmake pack
```

### Quick Syntax Check

Added the `xmake check syntax` command for quickly checking syntax errors in project source code.

This is typically used in CI pipelines to rapidly verify code syntax without performing a full compilation and linking process, making it extremely fast.

Internally, xmake passes syntax checking flags like `-fsyntax-only` (GCC/Clang) or `/Zs` (MSVC) to the compiler.

This causes the compiler to perform only syntax analysis, skipping object file generation and linking, thereby significantly speeding up the check.

```bash
$ xmake check syntax
```

If there are syntax errors, it will report the specific file and line number.

### MSVC C++ Dynamic Debugging

We have added support for C++ dynamic debugging in MSVC (requires MSVC toolset 14.44+, x64 only).

It is incompatible with LTCG/PGO/OPT-ICF.

```lua
set_policy("build.c++.dynamic_debugging", true)
```

### Binary Utilities

We added the `core.base.binutils` module and the `utils.binary` extension module for processing binary files.

They provide functions such as `bin2c`, `bin2obj`, `readsyms`, `deplibs`, and `extractlib`, which can be used to generate code from binary files, read symbols, obtain dependent libraries, and extract static libraries.

```lua
import("utils.binary.deplibs")
import("utils.binary.readsyms")
import("utils.binary.extractlib")

-- Get dependent libraries
local deps = deplibs("/path/to/bin")

-- Read symbols
local syms = readsyms("/path/to/obj")

-- Extract static library
extractlib("/path/to/lib.a", "/path/to/outputdir")
```

In addition, we have improved dependent library resolution, support for extracting objects used in static library merging, and symbol dumping.

### Xmake Plugin for CLion

We have recently made significant improvements to the [xmake-idea](https://github.com/xmake-io/xmake-idea) plugin for CLion.

Most notably, we added support for lldb/gdb-dap debugging. You no longer need to generate `CMakeLists.txt` to support debugging; you can now debug Xmake projects directly.

<img src="/assets/img/posts/xmake/xmake-idea-dap-debug-conf.png" width="650px" />

<img src="/assets/img/posts/xmake/xmake-idea-dap-debug-run.png" width="650px" />

In addition, we fixed some bugs in the Run Configuration panel and resolved the issue where files were not automatically saved before running.

We also added support for automatically updating `compile_commands.json` to improve C++ Intellisense.

<img src="/assets/img/posts/xmake/xmake-idea-update-compd.png" width="650px" />

---

## Changelog

### New features

* [#7141](https://github.com/xmake-io/xmake/pull/7141): Support disabling native app glue for Android
* [#7139](https://github.com/xmake-io/xmake/pull/7139): Add Android native app build support
* [#7127](https://github.com/xmake-io/xmake/pull/7127): Add deplibs support in binutils
* [#7120](https://github.com/xmake-io/xmake/pull/7120): Add extractlib support in binutils
* [#7106](https://github.com/xmake-io/xmake/pull/7106): Add `/std:c++23preview` support for MSVC
* [#7105](https://github.com/xmake-io/xmake/pull/7105): Add `bin2obj` support for glsl/hlsl2spv
* [#7103](https://github.com/xmake-io/xmake/pull/7103): Add `bin2obj` rule (faster than `bin2c`)
* [#7096](https://github.com/xmake-io/xmake/pull/7096): Add Flang toolchain support
* [#7094](https://github.com/xmake-io/xmake/pull/7094): Add `xmake check syntax` support
* [#7091](https://github.com/xmake-io/xmake/pull/7091): Add dynamic debugging support for MSVC
* [#7083](https://github.com/xmake-io/xmake/pull/7083): Add support for CUDA 11~13
* [#7071](https://github.com/xmake-io/xmake/pull/7071): Add Qt pack support
* [#7064](https://github.com/xmake-io/xmake/pull/7064): Add AppImage xpack format for Linux application packaging
* [#7062](https://github.com/xmake-io/xmake/pull/7062): Add dmg xpack format for macOS application packaging

### Changes

* [#7149](https://github.com/xmake-io/xmake/pull/7149): Improve binutils to optimize rpath parsing
* [#7148](https://github.com/xmake-io/xmake/pull/7148): Update Zig examples
* [#7145](https://github.com/xmake-io/xmake/pull/7145): Improve Clang/LLVM runtime support
* [#7136](https://github.com/xmake-io/xmake/pull/7136): Improve clang-cl depfiles generation
* [#7135](https://github.com/xmake-io/xmake/pull/7135): Improve `xrepo env` to add session ID
* [#7155](https://github.com/xmake-io/xmake/pull/7155): Refactor Windows ASan for clang-cl (runtime linking, linker flags, PATH/CMAKE_LINKER_TYPE setup, toolchain streamlining)
* [#7109](https://github.com/xmake-io/xmake/pull/7109): Improve binutils to read symbols from binary file
* [#7102](https://github.com/xmake-io/xmake/pull/7102): Improve bin2c rule
* [#7098](https://github.com/xmake-io/xmake/pull/7098): Refactor and improve Golang support
* [#7095](https://github.com/xmake-io/xmake/pull/7095): Mark target/package/toolchain:memcache as public
* [#7093](https://github.com/xmake-io/xmake/pull/7093): Improve mirror repo URL
* [#7088](https://github.com/xmake-io/xmake/pull/7088): Improve C++/ObjC rules
* [#7087](https://github.com/xmake-io/xmake/pull/7087): Add type constraint for policy `package.download.http_headers`
* [#7069](https://github.com/xmake-io/xmake/pull/7069): Save Qt rules for LLVM toolchain
* [#7061](https://github.com/xmake-io/xmake/pull/7061): Update CI configuration
* [#7039](https://github.com/xmake-io/xmake/pull/7039): Update macOS CI

### Bugs fixed

* [#7132](https://github.com/xmake-io/xmake/pull/7132): Fix clang-cl toolchain with ASan
* [#7125](https://github.com/xmake-io/xmake/pull/7125): Fix cosmocc CI
* [#7124](https://github.com/xmake-io/xmake/pull/7124): Fix default MSVC runtime for Clang toolchain
* [#7112](https://github.com/xmake-io/xmake/pull/7112): Fix change directory on Windows
* [#7104](https://github.com/xmake-io/xmake/pull/7104): Fix prepare for project generators
* [#7092](https://github.com/xmake-io/xmake/pull/7092): Fix Solaris build
* [#7086](https://github.com/xmake-io/xmake/pull/7086): Fix targetdir in Qt QML rule
* [#7085](https://github.com/xmake-io/xmake/pull/7085): Fix CMake flags for Clang toolchain
* [#7084](https://github.com/xmake-io/xmake/pull/7084): Fix pacman find_package
* [#7082](https://github.com/xmake-io/xmake/pull/7082): Fix checking Clang CUDA flags
* [#7081](https://github.com/xmake-io/xmake/pull/7081): Fix `get_headerunit_key`
* [#7074](https://github.com/xmake-io/xmake/pull/7074): Fix libc++ cannot find std module
* [#7067](https://github.com/xmake-io/xmake/pull/7067): Fix get_stdmodules with cross toolchain
