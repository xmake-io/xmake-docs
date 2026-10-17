---
title: Xmake v3.1.2 Released, Incremental Build Improvements and Inno Setup Packaging
tags: [xmake, cpp, modules, pch, xpack, addon]
date: 2026-10-17
author: Ruki
outline: deep
---

Xmake v3.1.2 improves incremental builds for static libraries, C++ modules, and precompiled
headers. It also adds Inno Setup packaging, output-on-failure for tests, selectable HTTP
downloaders, and custom pkg-config search directories.

Addons introduced in v3.1.1 receive fixes for local repositories and installed-version
selection, together with eight runnable distribution examples. This release also prevents
repository updates from resetting a user's project after a failed clone.

## Incremental builds

### Re-archive only the static libraries that changed

For a chain such as `a -> b -> c -> app`, changing an implementation file in `a` should
recompile that file, re-archive `a`, and relink `app`. Ordinary `b` and `c` archives contain
only their own objects, so changing `a` does not require recreating them.

v3.1.2 removes those unnecessary archive dependencies. Targets using
`set_policy("build.merge_archive", true)` retain the dependency: their outputs contain
dependency objects and must be recreated before merging to avoid stale archive members.
See [#7798](https://github.com/xmake-io/xmake/pull/7798).

### Clang reduced BMI

Clang's reduced-BMI pipeline is now available through an opt-in policy:

```lua
set_policy("build.c++.modules.two_phases", true)
set_policy("build.c++.modules.clang.precompile_reduced_bmi", true)
```

Xmake checks support for `--precompile-reduced-bmi`. The reduced BMI supplies module
information to consumers; object generation compiles the original module source.
The existing pipeline remains in use if the compiler does not support this mode.
This is distinct from compiling a full PCM into an object, where Xmake now omits unused
header-search configurations.

Module caches are also separated by build mode, and Clang's scanner and compilation
database generation handle MSVC environments more consistently.
See [#7742](https://github.com/xmake-io/xmake/pull/7742),
[#7849](https://github.com/xmake-io/xmake/pull/7849), and the
[policy reference](/api/description/builtin-policies).

### PCH correctness on Windows

Changes to headers included through clang-cl PCH wrappers now invalidate the PCH correctly.
For MSVC, Xmake bypasses the compiler cache when creating PCH artifacts, including
`.pch.obj` outputs. These changes improve dependency tracking and cache correctness.
See [#7815](https://github.com/xmake-io/xmake/pull/7815) and
[#7819](https://github.com/xmake-io/xmake/pull/7819).

## Inno Setup installers

Xpack can generate Inno Setup installers on Windows:

```lua
includes("@builtin/xpack")

target("demo")
    set_kind("binary")
    add_files("src/main.c")

xpack("demo")
    set_formats("inno")
    set_version("1.0.0")
    add_targets("demo")
    set_displayicon("bin/demo.exe")
```

```sh
xmake pack -f inno
```

`set_displayicon` configures the icon shown in Add/Remove Programs for both Inno Setup and
NSIS. It replaces the deprecated `set_nsis_displayicon`, which remains compatible.
See [#7854](https://github.com/xmake-io/xmake/pull/7854) and the
[xpack reference](/api/description/xpack-interfaces#set-displayicon).

## Test output when it matters

```sh
xmake test --output-on-failure
```

Keep the normal test report while showing stdout/stderr only for failures and unexpected
passes. Successful tests remain quiet; `-v` still shows output for every test.
See [#7791](https://github.com/xmake-io/xmake/pull/7791).

## Download and package configuration

### Choose the HTTP downloader

```sh
xmake g --downloader=curl
```

You can also set `XMAKE_DOWNLOADER=curl`, or select a backend for an individual call:

```lua
import("net.http")
http.download("https://xmake.io", "index.html", {downloader = "curl"})
```

Supported backends are `aria2`, `curl`, `wget`, `powershell`, and `pwsh`. Call options take
precedence over command-line options, global configuration, and the environment variable.
An explicit selection fails if the tool is unavailable; it does not silently switch backends.
Aria2 also gets more conservative connection settings and DNS handling.
See [#7758](https://github.com/xmake-io/xmake/pull/7758).

### Custom pkg-config directories

```lua
add_requires("pkgconfig::ncurses", {configs = {
    configdirs = {"/opt/ncurses/lib/pkgconfig", "/opt/ncurses/share/pkgconfig"}
}})
```

`configdirs` supplies the `.pc` search paths for this package without requiring a global
`PKG_CONFIG_PATH` change. It accepts a single directory or a list.
See [#7792](https://github.com/xmake-io/xmake/pull/7792).

### Version metadata in generated files

For `set_version("1.2.3-rc.1+build.7")`, configuration templates can read
`${VERSION_PRERELEASE}` as `rc.1` and `${VERSION_BUILD}` as `build.7`.
An explicit `{build = ...}` setting still takes precedence. Quote these variables when
using them as C strings. See [#7799](https://github.com/xmake-io/xmake/pull/7799).

## Addon fixes and examples

Projects using a relative local repository retain its path base during addon installation
and upgrades. Requiring an already installed version now activates that version before
locking and loading it, rather than using whichever version happened to be installed last.
Addons installed directly from a directory are also recognized without an unnecessary
repository lookup.

The [Addon Examples](/examples/configuration/addons) provide eight independent projects
covering includes, description APIs/functions, rules, modules, plugins, templates, and
toolchains. Each carries its addon and local recipe. Description-domain examples use an
API-availability guard during the first project scan so automatic installation can finish.
See [#7809](https://github.com/xmake-io/xmake/pull/7809),
[#7821](https://github.com/xmake-io/xmake/pull/7821), and
[#7860](https://github.com/xmake-io/xmake/pull/7860).

## Repository update safety

A failed or interrupted clone can leave a directory without valid Git metadata. Previously,
Git commands launched there could discover a parent project repository instead. Repository
updates now explicitly bind modifying commands to the intended repository and recover
incomplete remote caches. Local repository source directories are kept separate from that
cache cleanup. See [#7820](https://github.com/xmake-io/xmake/pull/7820).

## Other updates

This release adds C++23 mapping for nvcc and raddbg support on Linux, updates MATLAB version
detection through R2026b, and fixes Make toolchain propagation, Conan quoted flags, and
Homebrew `latest` lookup. Core utility fixes cover JSON Unicode escapes, deep table cloning,
graphs, heaps, lists, hashsets, and weighted Levenshtein distances.

## Changelog

### New features

* [#7742](https://github.com/xmake-io/xmake/pull/7742): Support Clang reduced-BMI compilation
* [#7791](https://github.com/xmake-io/xmake/pull/7791): Add `xmake test --output-on-failure`
* [#7854](https://github.com/xmake-io/xmake/pull/7854): Add Inno Setup packaging and `set_displayicon` support
* [#7758](https://github.com/xmake-io/xmake/pull/7758): Support custom downloaders and improve aria2 reliability
* [#7792](https://github.com/xmake-io/xmake/pull/7792): Support `configs.configdirs` for `pkgconfig::` packages
* [#7799](https://github.com/xmake-io/xmake/pull/7799): Support `VERSION_PRERELEASE` and semver `VERSION_BUILD` in config files
* [#7808](https://github.com/xmake-io/xmake/pull/7808): Support C++23 with nvcc
* [#7766](https://github.com/xmake-io/xmake/pull/7766): Add raddbg support on Linux
* [#7743](https://github.com/xmake-io/xmake/pull/7743): Expose more native Lua functions through `lib.lua.*`
* [#7752](https://github.com/xmake-io/xmake/pull/7752): Support Unicode escapes in the pure Lua JSON decoder

### Changes

* [#7852](https://github.com/xmake-io/xmake/pull/7852): Suppress unused-argument warnings for clang-cl
* [#7855](https://github.com/xmake-io/xmake/pull/7855): Update MATLAB version detection through R2026b
* [#7767](https://github.com/xmake-io/xmake/pull/7767): Warn when cached project settings shadow a local project
* [#7780](https://github.com/xmake-io/xmake/pull/7780): Remove built-in Gitee and GitCode mirrors
* [#7860](https://github.com/xmake-io/xmake/pull/7860): Add standalone addon distribution examples
* [#7800](https://github.com/xmake-io/xmake/pull/7800): Improve `isnan` invalid-input tests
* Update the bundled tbox
* Update Ubuntu PPA targets and NetBSD CI dependencies
* Update PowerShell installer and RPM version metadata
* Add repository development conventions in `AGENTS.md`

### Bugs fixed

* [#7750](https://github.com/xmake-io/xmake/pull/7750): Fix Clang modules and compilation databases with MSVC environments
* [#7770](https://github.com/xmake-io/xmake/pull/7770): Preserve MSVC system includes in clangd compilation databases
* [#7849](https://github.com/xmake-io/xmake/pull/7849): Remove unused include flags when compiling Clang PCMs to objects
* [#7788](https://github.com/xmake-io/xmake/pull/7788): Fix C++ module caches across build modes and project generation
* [#7815](https://github.com/xmake-io/xmake/pull/7815): Fix clang-cl PCH dependency tracking
* [#7819](https://github.com/xmake-io/xmake/pull/7819): Disable compiler caching for MSVC PCH creation
* [#7798](https://github.com/xmake-io/xmake/pull/7798): Avoid unnecessary static re-archiving and stale merged archive members
* [#7820](https://github.com/xmake-io/xmake/pull/7820): Prevent repository updates from resetting user projects and recover interrupted clones
* [#7776](https://github.com/xmake-io/xmake/pull/7776): Fix recognition of locally installed addons
* [#7809](https://github.com/xmake-io/xmake/pull/7809): Fix local-repository paths when installing and upgrading addons
* [#7821](https://github.com/xmake-io/xmake/pull/7821): Activate the required version of installed addons
* [#7761](https://github.com/xmake-io/xmake/pull/7761): Preserve usable MSVC environments when toolset detection fails
* [#7813](https://github.com/xmake-io/xmake/pull/7813): Fix Ascend C toolchain detection and unchecked SDK loading
* [#7853](https://github.com/xmake-io/xmake/pull/7853): Fix `gxx`/`gcc` tool and flag matching
* [#7763](https://github.com/xmake-io/xmake/pull/7763): Enable C++ exceptions by default for clang-cl packages
* [#7779](https://github.com/xmake-io/xmake/pull/7779): Include compiler runtime paths during Windows and MinGW package installation
* [#7782](https://github.com/xmake-io/xmake/pull/7782): Fix MIDL detection when cross-compiling to ARM64
* [#7772](https://github.com/xmake-io/xmake/pull/7772): Fix Qt debug library names on HarmonyOS
* [#7789](https://github.com/xmake-io/xmake/pull/7789): Fix Homebrew package discovery for `latest` versions
* [#7760](https://github.com/xmake-io/xmake/pull/7760): Fix quoted flags and Windows paths in the Conan generator
* [#7857](https://github.com/xmake-io/xmake/pull/7857): Pass selected toolchains to Make-based package builds
* [#7803](https://github.com/xmake-io/xmake/pull/7803): Fix incorrect `vs_runtime` deprecation warnings
* [#7749](https://github.com/xmake-io/xmake/pull/7749): Rebuild Verilator outputs when tools or flags change
* [#7757](https://github.com/xmake-io/xmake/pull/7757): Fix version comparison and validation in `set_xmakever`
* [#7765](https://github.com/xmake-io/xmake/pull/7765): Detect numeric and boolean dependency changes
* [#7816](https://github.com/xmake-io/xmake/pull/7816): Fix escaped dollar signs in GCC dependency files
* [#7753](https://github.com/xmake-io/xmake/pull/7753): Fix square-bracket escaping in `path.pattern`
* [#7801](https://github.com/xmake-io/xmake/pull/7801): Fix hashset equality with nil members
* [#7810](https://github.com/xmake-io/xmake/pull/7810): Fix heap ordering after non-root removal
* [#7811](https://github.com/xmake-io/xmake/pull/7811): Return removed values from list `pop` and `shift`
* [#7812](https://github.com/xmake-io/xmake/pull/7812): Preserve isolated vertices in graph cloning and reversal
* [#7825](https://github.com/xmake-io/xmake/pull/7825): Fix weighted Levenshtein distances for empty strings
* [#7827](https://github.com/xmake-io/xmake/pull/7827): Fix recursive deep cloning with `table.clone(value, -1)`
