---
title: Xmake v3.0.9 Released, Lua 5.5 Runtime, Zig C Interop, Fil-C and Ascend C Toolchains
tags: [xmake, lua, zig, filc, ascendc, depgraph, aria2, clang-cl]
date: 2026-05-19
author: Ruki
outline: deep
---

In this release, we upgraded the built-in Lua runtime to 5.5, added a new `utils.replace` built-in rule, brought C interop to the Zig toolchain, and introduced two new toolchains: Fil-C (a memory-safe C/C++ implementation) and Huawei Ascend C (for NPU programming).

Additionally, we added a multi-threaded aria2 download backend, support for exporting target and package dependency graphs as JSON or DOT, `.csproj` generation for C# targets in vsxmake, and many other improvements around custom toolchains, the `clang-cl[llvm]` toolset, and package archive merging.

## New Features

### Lua 5.5 Runtime

The built-in Lua runtime has been upgraded from 5.4 to 5.5. Lua 5.5 introduces some syntactic and behavioral changes (for example, the for-in control variable is now treated as a const local, and a few legacy library APIs have been removed) that could break existing `xmake.lua` configurations written against older xmake versions. To preserve backward compatibility as much as possible, xmake ships this upgrade together with several patches that restore the familiar pre-5.5 semantics:

- a new `utils.replace` built-in rule (see below), used to patch the bundled `lparser.c` so that writing to the for-in control variable is still allowed under Lua 5.5;
- an updated sandbox `pairs` iterator so that reassigning the loop key inside the loop body keeps working safely;
- the `LUA_COMPAT_5_1` / `LUA_COMPAT_5_2` / `LUA_COMPAT_5_3` compatibility macros are enabled in the build, so legacy APIs remain available.

As a result, the following idiom — and existing user scripts using similar patterns — continue to work without modification:

```lua
for k, v in pairs(t) do
    k = k:gsub("_", "-")
    do_something(k, v)
end
```

If you do hit a Lua 5.5 compatibility issue in your own `xmake.lua` after upgrading, please file an issue — we'd like to keep the upgrade transparent to users.

### utils.replace Built-in Rule

A new built-in rule `utils.replace` allows applying in-memory text substitutions on a source file before it is fed to the compiler. It supports Lua-pattern replacement (default), plain-text replacement, and arbitrary Lua transform functions.

#### Lua-pattern replacement (default)

```lua
target("foo")
    set_kind("binary")
    add_files("src/foo.c", {rules = "utils.replace", replaces = {
        {"old_pattern", "new_text"},
    }})
```

#### Plain-text replacement

```lua
target("foo")
    set_kind("binary")
    add_files("src/foo.c", {rules = "utils.replace",
        replaces = {{"old text", "new text"}},
        replace_plain = true})
```

#### Function-based transform

```lua
target("foo")
    set_kind("binary")
    add_files("src/foo.c", {rules = "utils.replace", replaces = function (content)
        content = content:gsub("old", "new")
        return content
    end})
```

The rule writes the rewritten file under `target:autogenfile(sourcefile)` and uses dependency tracking, so the substitution is only re-run when the source file or the replace list actually changes. The original file's directory is also added to `includedirs`, so relative `#include` directives in the rewritten file still resolve.

### Zig Toolchain: C Interop

The Zig toolchain now supports full C interop. You can mix `.zig` and `.c` files in the same target, depend on C/C++ static libraries built by xmake, and consume C packages from `add_requires` directly from Zig via `@cImport` / `@cInclude`.

#### Depending on a C static library

```lua
add_rules("mode.debug", "mode.release")

target("mathlib")
    set_kind("static")
    add_files("src/native/*.c")
    add_includedirs("src/native", {public = true})

target("test")
    set_kind("binary")
    add_deps("mathlib")
    add_files("src/*.zig")
    add_includedirs("src/native")
```

Then in Zig:

```zig
const std = @import("std");
const c = @cImport({
    @cInclude("mathlib.h");
});

pub fn main() void {
    const sum = c.c_add(3, 4);
    const product = c.c_multiply(5, 6);
    std.debug.print("c_add(3,4)={d}\n", .{sum});
    std.debug.print("c_multiply(5,6)={d}\n", .{product});
}
```

#### Using C packages from Zig

```lua
add_rules("mode.debug", "mode.release")
add_requires("zlib", {system = false})

target("test")
    set_kind("binary")
    add_files("src/*.zig")
    add_packages("zlib")
```

```zig
const c = @cImport({
    @cInclude("zlib.h");
});

pub fn main() void {
    const version = c.zlibVersion();
    // ...
}
```

#### Mixed C/Zig sources

```lua
target("demo")
    set_kind("binary")
    add_files("src/*.c")
    add_files("src/*.zig")
    set_toolchains("@zig")
```

### Fil-C Toolchain

We added a new `filc` toolchain that wires up [Fil-C](https://fil-c.org/) — a memory-safe implementation of the C and C++ languages — through the `filcc` / `fil++` compiler drivers. It is currently supported on Linux x86_64 and works together with the `filc` package from xmake-repo.

```lua
add_rules("mode.debug", "mode.release")
add_requires("filc")

target("safety_test")
    set_kind("binary")
    set_toolchains("@filc")
    add_packages("filc")
    add_files("src/*.c")
```

Fil-C provides additional headers like `<stdfil.h>`, and the toolchain automatically wires up the `pizfix` runtime tree, including link directories and sysincludedirs. Memory-safety violations are caught at runtime with diagnostics like `filc safety error` and `filc panic`.

### Huawei Ascend C Toolchain

We added a new `ascendc` toolchain plus an `ascendc` language for Huawei NPU programming. It introduces two new source-file kinds:

- `.asc` — Ascend C kernel code, compiled with the `bisheng` driver
- `.aicpu` — AI-CPU code, compiled with the same driver but with AI-CPU specific flags

The toolchain auto-detects the CANN SDK via `ASCEND_HOME_PATH` / `ASCEND_TOOLKIT_HOME` and picks the host-arch subdirectory automatically. A new `add_ascnpuarchs(...)` target API maps to the underlying `--npu-arch=...` flag.

#### Mixed asc/aicpu binary

```lua
add_rules("mode.debug", "mode.release")

target("ascendc_mixed")
    set_kind("binary")
    add_files("src/main.asc", "src/helper.aicpu")
    add_ascnpuarchs("dav-2201")
```

#### Static and shared libraries

```lua
add_rules("mode.debug", "mode.release")

target("ascendc_static")
    set_kind("static")
    add_files("src/lib.asc")
    add_ascnpuarchs("dav-2201")

target("ascendc_shared")
    set_kind("shared")
    add_files("src/lib.asc")
    add_ascnpuarchs("dav-2201")

target("app")
    set_kind("binary")
    add_deps("ascendc_static", "ascendc_shared")
    add_files("src/main.asc")
    add_ascnpuarchs("dav-2201")
```

When a target contains `.asc` / `.aicpu` source files, xmake automatically loads the `ascendc` toolchain for that target — you don't need to pass `--toolchain=ascendc` explicitly. The SDK is auto-detected via `ASCEND_HOME_PATH` / `ASCEND_TOOLKIT_HOME`, and can also be overridden on the command line:

```bash
# SDK auto-detected from ASCEND_HOME_PATH — just build:
$ xmake

# Or point at a specific SDK
$ xmake f --sdk=/usr/local/Ascend/ascend-toolkit/latest
$ xmake
```

The `.asc` and `.aicpu` source kinds can be freely mixed with `.c`, `.cpp`, and `.S` files in the same target.

### Target Dependency Graph Export

`xmake show --info=depgraph` now supports structured output for the target dependency graph, in addition to the existing ASCII tree view. Two new flags have been added:

- `--format=plain|json|dot` — output format
- `--target=<name>` — restrict the graph to a single root target and its transitive dependencies

```bash
# ASCII tree (default)
$ xmake show --info=depgraph

# Scoped to a single target
$ xmake show --info=depgraph --target=app

# JSON output, suitable for tool integration
$ xmake show --info=depgraph --format=json

# Graphviz DOT output
$ xmake show --info=depgraph --format=dot
```

The JSON output has the following shape:

```json
{
  "root_targets": ["app"],
  "targets": [
    {"name": "core",     "deps": []},
    {"name": "ui",       "deps": ["core"]},
    {"name": "ext::net", "deps": ["core"]},
    {"name": "app",      "deps": ["core", "ui", "ext::net"]}
  ]
}
```

The DOT output renders as a directed graph:

```
digraph {
    "core"
    "ui" -> "core"
    "ext::net" -> "core"
    "app" -> "core"
    "app" -> "ui"
    "app" -> "ext::net"
}
```

### Package Dependency Graph Export

A symmetric feature has been added on the package side. `xrepo info --depgraph` (and `xmake require --depgraph`) prints the resolved dependency graph for one or more packages, with the same three output formats:

```bash
# ASCII tree (default)
$ xrepo info --depgraph libpng
$ xmake require --depgraph libpng

# JSON output
$ xrepo info --depgraph --format=json libpng

# Graphviz DOT output
$ xrepo info --depgraph --format=dot libpng

# With package configs
$ xrepo info --depgraph -k shared -m debug --configs="thread=true" boost
```

The JSON output shape is similar to the target depgraph:

```json
{
  "root_packages": ["libpng"],
  "packages": [
    {"name": "libpng", "version": "1.6.x", "deps": ["zlib"]},
    {"name": "zlib",   "version": "1.3.2", "deps": []}
  ]
}
```

### aria2 Download Backend

We added [aria2](https://aria2.github.io/) as a new download backend for package downloading. When `aria2c` is available on the system, xmake will use it automatically with multi-connection downloads enabled, falling back to `curl` / `wget` / PowerShell as before.

```bash
# macOS
$ brew install aria2

# Debian / Ubuntu
$ sudo apt install aria2

# Arch Linux
$ sudo pacman -S aria2
```

No `xmake.lua` change is needed — once aria2 is installed, subsequent `xmake require` / `xrepo install` calls will pick it up automatically. The aria2 backend honors xmake's existing proxy settings (`xmake g --proxy=...`).

### vsxmake: C# .csproj Generation

The vsxmake generator now detects C# targets and produces `.csproj` files instead of `.vcxproj`. The generated `.csproj` overrides MSBuild's `CoreCompile` step to delegate compilation back to xmake, so Visual Studio orchestrates the solution while xmake actually drives the build.

```bash
$ xmake project -k vsxmake
$ xmake project -k vsxmake -m "debug,release" -a "x64"
```

The user `xmake.lua` is unchanged from a regular C# project:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/Program.cs")
```

Target kind is mapped to the `OutputType` of the generated csproj: `binary` → `Exe`, `shared` / `static` → `Library`.

### Improved Custom Toolchain Definition

User-defined toolchains under `add_toolchaindirs(...)` are now more flexible:

1. **Auto-registered module directories.** Each toolchain subdirectory's `modules/` folder is automatically added as an `import()` module search path, so custom toolchains can bundle their tool modules side by side with the toolchain definition.

2. **String-based hook references.** `on_check`, `on_load`, and `on_check_main` now accept a string that refers to a sibling `.lua` file. For large toolchain definitions, this lets you split a toolchain across multiple files.

```lua
-- xmake/toolchains/mytoolchain/xmake.lua
toolchain("mytoolchain")
    set_kind("standalone")
    set_toolset("cc",  "mycc")
    set_toolset("cxx", "mycxx")
    on_check("check")    -- resolves to xmake/toolchains/mytoolchain/check.lua
    on_load("load")      -- resolves to xmake/toolchains/mytoolchain/load.lua
toolchain_end()
```

Typical directory layout:

```
xmake/toolchains/mytoolchain/
├── xmake.lua          -- toolchain("mytoolchain") definition
├── check.lua          -- function main(toolchain) ... end
├── load.lua           -- function main(toolchain) ... end
└── modules/           -- automatically added to import() search path
    └── helper.lua
```

This is exactly how the new `ascendc` toolchain is organized.

### clang-cl Toolchain: Switch to lld-link via the `llvm` Config

We improved the `clang-cl` toolchain with a new `llvm` config that switches the linker / archiver / assembler / resource compiler over to the corresponding LLVM tools — including `lld-link` for the linker. By default `clang-cl` still uses MSVC's `link.exe`, `ml64.exe`, `rc.exe`, etc.; passing `[llvm]` opts into the full LLVM toolset.

```lua
-- default: clang-cl with link.exe / ml64.exe / rc.exe
set_toolchains("clang-cl")

-- with [llvm]: switches ld/sh to lld-link, ar to llvm-ar,
-- as to llvm-ml(64).exe, mrc to llvm-rc.exe
set_toolchains("clang-cl[llvm]")
```

LTO under `clang-cl` also automatically switches the linker to `lld-link` (since `link.exe` doesn't support LLVM bitcode), so `set_policy("build.optimization.lto", true)` works out of the box without having to set the `llvm` config explicitly.

Alongside this we added a `find_lld_link` detection module and integrated `lld-link` with the `windows.subsystem` rule, the LTO rule, the Qt rule, and the clang-cl ASan thunks, so all of these features behave correctly under the `clang-cl[llvm]` toolset.

### build.merge_archive Now Includes Package Libraries

The `build.merge_archive` policy has been extended to also merge static libraries contributed by `add_packages(...)` into the parent static target. Previously only static-library deps from `add_deps(...)` were merged.

```lua
add_rules("mode.debug", "mode.release")
add_requires("libpng", {system = false})
add_requireconfs("libpng.*", {system = false, override = true})

target("foo")
    set_kind("static")
    add_files("src/png.c")
    add_packages("libpng")
    set_policy("build.merge_archive", true)

target("test")
    add_deps("foo")
    add_files("src/main.c")
```

After build, `libfoo.a` will contain `png.c.o` plus all object files from `libpng.a` and its transitive `zlib.a`, so `test` only needs to link `foo`.

### utils.checker Module

A small public utility module `utils.checker` has been added, letting user-side scripts query whether they are currently running under `xmake check <name>`. This is useful for rules and scripts that want to behave differently when invoked via `xmake check syntax`, `xmake check clang.tidy`, etc.

```lua
import("utils.checker")

if checker.is_running("syntax") then
    -- we are in `xmake check syntax`, skip codegen
end
```

## Changelog

### New features

* [#7430](https://github.com/xmake-io/xmake/pull/7430): Add C interop support for the Zig toolchain
* [#7443](https://github.com/xmake-io/xmake/pull/7443): Add `utils.replace` built-in rule
* [#7437](https://github.com/xmake-io/xmake/pull/7437): Upgrade built-in Lua runtime to 5.5
* [#7446](https://github.com/xmake-io/xmake/pull/7446): Add Fil-C toolchain support
* [#7489](https://github.com/xmake-io/xmake/pull/7489): vsxmake: generate `.csproj` for C# targets
* [#7491](https://github.com/xmake-io/xmake/pull/7491): Add `xrepo info --depgraph` to print the package dependency graph
* [#7490](https://github.com/xmake-io/xmake/pull/7490): Support exporting the target dependency graph as JSON or DOT
* [#7518](https://github.com/xmake-io/xmake/pull/7518): Add aria2 download backend with multi-threaded support
* [#7535](https://github.com/xmake-io/xmake/pull/7535): Add Huawei Ascend C toolchain support

### Changes

* [#7420](https://github.com/xmake-io/xmake/pull/7420): Improve zsh completions
* [#7423](https://github.com/xmake-io/xmake/pull/7423): Improve `has_flags` detection for cl / clang-cl
* [#7424](https://github.com/xmake-io/xmake/pull/7424): Improve code comments
* [#7439](https://github.com/xmake-io/xmake/pull/7439): Switch `icx` to `icx-cc` on Windows
* [#7434](https://github.com/xmake-io/xmake/pull/7434): Improve nix package config and source selection
* [#7440](https://github.com/xmake-io/xmake/pull/7440): Improve code comments
* [#7435](https://github.com/xmake-io/xmake/pull/7435): Improve C++ module error messages
* [#7461](https://github.com/xmake-io/xmake/pull/7461): Expose checker as a public API
* [#7463](https://github.com/xmake-io/xmake/pull/7463): Bump package versions in C++ modules tests
* [#7465](https://github.com/xmake-io/xmake/pull/7465): Bump C++ modules test versions again
* [#7467](https://github.com/xmake-io/xmake/pull/7467): Parse `XMAKE_ROOT` / `XMAKE_STATS` via `option.boolean`
* [#7478](https://github.com/xmake-io/xmake/pull/7478): Improve custom toolchain definition
* [#7485](https://github.com/xmake-io/xmake/pull/7485): Improve `pairs` behavior for Lua 5.5
* [#7505](https://github.com/xmake-io/xmake/pull/7505): Add NuGet package repository entry to README
* [#7524](https://github.com/xmake-io/xmake/pull/7524): Add `lld-link` configuration support
* [#7529](https://github.com/xmake-io/xmake/pull/7529): Move clang PCH support into its own module
* [#7542](https://github.com/xmake-io/xmake/pull/7542): Merge libs contributed by packages

### Bugs fixed

* [#7432](https://github.com/xmake-io/xmake/pull/7432): Fix `set_kind("test")` handling
* [#7433](https://github.com/xmake-io/xmake/pull/7433): Fix xpack AppImage package naming
* [#7445](https://github.com/xmake-io/xmake/pull/7445): Fix package local cache directory
* [#7455](https://github.com/xmake-io/xmake/pull/7455): Avoid duplicate bundle rpath insertion in `xcode.application`
* [#7451](https://github.com/xmake-io/xmake/pull/7451): Use the correct framework rpath for iOS apps in `xcode.application`
* [#7449](https://github.com/xmake-io/xmake/pull/7449): Avoid leaking private dep flags into rebuilt BMIs for C++ modules
* [#7470](https://github.com/xmake-io/xmake/pull/7470): Use `target_link_libraries` to link object libraries in generated CMakeLists
* [#7477](https://github.com/xmake-io/xmake/pull/7477): Fix clang when using `c++_static`
* [#7483](https://github.com/xmake-io/xmake/pull/7483): Fix syslink handling on MinGW
* [#7493](https://github.com/xmake-io/xmake/pull/7493): Fix Qt cross-compilation
* [#7495](https://github.com/xmake-io/xmake/pull/7495): Fix "cannot find known tool script for `ar.cmd`"
* [#7500](https://github.com/xmake-io/xmake/pull/7500): Fix Linux kernel module `insmod` failure on kernel 6.12+
* [#7502](https://github.com/xmake-io/xmake/pull/7502): Fix Rust build
* [#7501](https://github.com/xmake-io/xmake/pull/7501): Fix Linux kernel module intermediate filenames
* [#7503](https://github.com/xmake-io/xmake/pull/7503): Fix xpack deb / srpm packaging
* [#7512](https://github.com/xmake-io/xmake/pull/7512): Handle Windows cross-compile prefix and install path in the Meson backend
* [#7516](https://github.com/xmake-io/xmake/pull/7516): Restore missing `path.isdir` API
* [#7520](https://github.com/xmake-io/xmake/pull/7520): Fix cl exception when probing flags
* [#7523](https://github.com/xmake-io/xmake/pull/7523): Fix MSVC / Intel snippet detection when the temp path contains spaces
* [#7525](https://github.com/xmake-io/xmake/pull/7525): Fix Zig CC stdlib and LTO flags
* [#7527](https://github.com/xmake-io/xmake/pull/7527): Handle compiler / linker frontend variants more accurately when generating CMakeLists
* [#7533](https://github.com/xmake-io/xmake/pull/7533): Support paths like `mingw/current/bin` in `find_mingw`
* [#7538](https://github.com/xmake-io/xmake/pull/7538): Align ascendc flags with the Bisheng compiler user guide
* [#7540](https://github.com/xmake-io/xmake/pull/7540): `xmake show -l targets` now lists all targets regardless of `set_default`
* [#7541](https://github.com/xmake-io/xmake/pull/7541): Fix `find_qt` cache and dep config being overwritten during Qt cross-compilation
* [#7545](https://github.com/xmake-io/xmake/pull/7545): Expand builtin variables before calling `path.is_absolute` in `add_moduledirs`
