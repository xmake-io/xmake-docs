---
title: Xmake v3.1.0 Released, Plugin Distribution via Repositories, Binary Asset Transform and alignof Detection
tags: [xmake, plugin, xrepo, bin2c, bin2obj, alignof, xpack, gcc]
date: 2026-08-08
author: Ruki
outline: deep
---

In this release, we reworked the `xmake plugin` manager. Plugins can now be installed from repositories such as xmake-repo just like packages, and also from git urls and local directories, with a unified listing of built-in, installed and available plugins.

Additionally, we added `check_alignof` / `configvar_check_alignof` type alignment detection, a `transform` config for the `utils.bin2c` / `utils.bin2obj` rules to preprocess embedded binary assets, a new `batchcmds:call` interface, unified `--format=json` output for `xmake show`, multiple target names for `build` / `clean` / `install` and friends, builtin-variable expansion in xpack install file lists, and gcc-16 toolchain support.

## New Features

### Reworked Plugin Manager and Repository Distribution

Distributing an xmake plugin used to mean asking users to copy the plugin directory into `~/.xmake/plugins/` by hand, or to clone the repository themselves. In this release we rewrote the `xmake plugin` command: installing, removing and listing plugins now all go through a single entry point, and the installation reuses xmake's package installation flow.

#### Installing plugins from repositories

Plugins are described as packages in a repository, using the same directory layout as packages, i.e. `<repodir>/plugins/<first-letter>/<name>/xmake.lua`:

```lua
-- plugins/h/hello/xmake.lua
package("hello")
    set_kind("plugin")
    set_description("say hello from hello")
    set_sourcedir(path.join(os.scriptdir(), "src"))
```

The `src` directory holds the plugin implementation itself, i.e. the familiar `xmake.lua` + `main.lua` pair:

```lua
-- plugins/h/hello/src/xmake.lua
task("hello")
    set_category("plugin")
    on_run("main")
    set_menu {usage = "xmake hello", description = "say hello"}
```

```lua
-- plugins/h/hello/src/main.lua
function main()
    print("hello xmake!")
end
```

For plugins whose sources live directly in the repository, `on_install` can be omitted — xmake copies the plugin directory into `~/.xmake/plugins/<name>` by default. And since a plugin is really just a package of the `plugin` kind, it also gets all the usual package capabilities: `add_urls`, `add_versions`, `add_deps`, custom `on_install` / `on_test`, and so on.

To install, just pass the plugin name and xmake will look it up across all configured repositories:

```bash
$ xmake plugin --install hello
```

Or specify explicitly which repository to install from:

```bash
$ xmake plugin --install xmake-repo@hello
```

#### Installing from git urls and local directories

Besides repositories, `--install` also accepts git urls, with a `github:` shortcut and an optional `#branch` suffix:

```bash
$ xmake plugin --install https://github.com/myrepo/hello-world
$ xmake plugin --install github:myrepo/hello-world
$ xmake plugin --install github:myrepo/hello-world#dev
```

And when developing a plugin locally, just pass its directory:

```bash
$ xmake plugin --install /tmp/my-plugin
```

#### Listing, removing and clearing

`xmake plugin --list` now groups built-in plugins, installed plugins, and plugins that are available in repositories but not installed yet, each with its description:

```bash
$ xmake plugin --list
the built-in plugins:
  project        Generate the project file.
  pack           Pack binary installation packages.
  ...
the installed plugins:
  hello          say hello from hello
available in configured repositories:
  world          say hello from world (run xmake plugin --install world to install)
```

Removing and clearing:

```bash
$ xmake plugin --remove hello
$ xmake plugin --clear
```

### alignof Type Alignment Detection

We added two new detection interfaces, `check_alignof` and `configvar_check_alignof`, to probe the alignment of a given type on the target platform. They work exactly like the existing `check_sizeof`.

```lua
includes("@builtin/check")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    check_alignof("LONG_ALIGN", "long")
    check_alignof("STRING_ALIGN", "std::string", {includes = "string"})
```

This defines macros such as `LONG_ALIGN=8`. To write the result into `config.h` instead, use `configvar_check_alignof`:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_configfiles("config.h.in")
    configvar_check_alignof("ALIGNOF_LONG", "long")
```

```c
// config.h.in
#define ALIGNOF_LONG ${ALIGNOF_LONG}
```

Internally the check snippet picks `alignof` / `_Alignof` / `__alignof` / `__alignof__` based on the compiler and language standard, so pre-C11 C code and MSVC work as well. The result is extracted from a marker string embedded in the compiled artifact rather than by running the program, so it also works when cross-compiling.

### Binary Asset Transform for bin2c / bin2obj

The `utils.bin2c` and `utils.bin2obj` rules gained a `transform` config, which lets you preprocess the content of a binary file before it is embedded into the program — to compress, encrypt or obfuscate it, for example.

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_rules("utils.bin2c")
    add_files("src/*.c")
    add_files("src/asset.bin", {transform = function (inputfile, outputfile, opt)
        local data = io.readfile(inputfile, {encoding = "binary"})
        io.writefile(outputfile, data:reverse(), {encoding = "binary"})
    end})
```

`transform` can also be the path of a lua script file, so that the transform step is preserved when exporting the project to vs/cmake and other generators:

```lua
target("test")
    set_kind("binary")
    add_rules("utils.bin2obj")
    add_files("src/*.c")
    add_files("src/asset.bin", {transform = path.join(os.projectdir(), "transform.lua")})
```

```lua
-- transform.lua
function main(inputfile, outputfile)
    local data = io.readfile(inputfile, {encoding = "binary"})
    io.writefile(outputfile, data:reverse(), {encoding = "binary"})
end
```

Besides the per-file config, `transform` can also be set at the rule level so that it applies to every binary file handled by that rule:

```lua
add_rules("utils.bin2c", {transform = path.join(os.projectdir(), "transform.lua")})
```

The transformed file is written under `target:autogenfile(...)` and tracked by the dependency system, so it is only regenerated when the source file or the transform script actually changes.

### batchcmds:call

Along with the transform support, we added a `batchcmds:call` interface that registers a plain lua function as a build command inside `on_buildcmd_file` and other batchcmds contexts, instead of spawning a subprocess through `os.execv`.

```lua
rule("myrule")
    on_buildcmd_file(function (target, batchcmds, sourcefile, opt)
        batchcmds:call(function (inputfile, outputfile, opt)
            io.writefile(outputfile, io.readfile(inputfile))
        end, {sourcefile, target:autogenfile(sourcefile)}, {name = "myrule/copy", target = target})
    end)
```

The given function is forked into the current sandbox before running, so `import()`, `os.*`, `io.*` and the other sandbox interfaces are available inside its body as usual. The first argument of `batchcmds:call` can also be the path of a lua script file, in which case it is equivalent to `batchcmds:lua(...)`.

Note that a raw lua function cannot be exported by the vs/cmake project generators — they skip it with a warning. So if your rule needs to support project generation, prefer the script file form.

### Unified Output Format for xmake show

The `--json` flag of `xmake show` only applied to some kinds of information. In this release the output format is unified behind `--format`, and `-l/--list` output now supports JSON too:

```bash
# plain text (default)
$ xmake show -l targets
$ xmake show -l targets --format=plain

# json output
$ xmake show -l targets --format=json
["app","core","ui"]
```

`--format` currently accepts `plain`, `json` and `dot`, where `dot` only applies to `--info=depgraph`:

```bash
$ xmake show --info=depgraph --format=json
$ xmake show --info=depgraph --format=dot
```

If an unsupported format is passed for list information, xmake now raises an error instead of silently falling back to plain text. The old `--json` flag still works but is deprecated in favor of `--format=json`.

### Multiple Target Names for Commands

The `build`, `clean`, `install`, `uninstall`, `package` and `format` commands now accept several target names at once, so there is no need to invoke them repeatedly:

```bash
$ xmake build target1 target2 target3
$ xmake clean target1 target2
$ xmake install target1 target2
$ xmake uninstall target1 target2
```

Duplicated names are deduplicated automatically, and unknown target names are all checked up front, with suggestions for the closest matching target names.

### Builtin Variables in xpack Install Files

`add_installfiles` and `add_sourcefiles` in `xpack` now expand builtin variables in their paths, so `$(projectdir)`, `$(builddir)` and xpack's own values such as `$(version)` can be used directly.

```lua
xpack("test")
    set_formats("zip")
    add_targets("demo")
    add_installfiles("$(projectdir)/assets/(**.png)", {prefixdir = "share"})
    add_sourcefiles("$(projectdir)/src/(**.c)")
```

Previously these paths were passed verbatim to the file matcher, so paths containing builtin variables could not be resolved. The expansion happens before the `(...)` root-directory marker is parsed, so the builtin-variable syntax and xmake's path grouping syntax coexist correctly.

### gcc-16 Toolchain

A new `gcc-16` toolchain was added, so you can switch to the gcc 16 compiler directly:

```bash
$ xmake f --toolchain=gcc-16
$ xmake
```

### Improved Static libc++ Runtime Links for clang

When using `set_runtimes("c++_static")` with clang, xmake used to pass `-static-libstdc++`. That flag only pulls in `libc++.a` and not `libc++abi.a`, leaving symbols such as `typeinfo` and `__cxa_*` undefined and breaking the link — a problem that became especially visible with C++ modules, which reference more of libc++.

In this release, xmake asks clang for the absolute paths of `libc++.a` and `libc++abi.a` via `-print-file-name` (including per-target runtime directories such as `lib/<target-triple>/`), then disables the driver's automatic C++ runtime with `-nostdlib++` and links both archives explicitly, wrapping them in `--start-group` / `--end-group` on non-Apple platforms to resolve their mutual references.

The C++ link order was adjusted accordingly: `target.runtimes` moved from the very front to after the user links and before the syslinks, so that the explicitly linked static runtime archives can resolve the symbols from the object files.

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    set_runtimes("c++_static")
    set_toolchains("clang")
```

If the two static archives cannot be located, or the compiler does not support `-nostdlib++`, xmake falls back to the previous `-static-libstdc++` behavior.

### SSL Fallback on Download Failures

If a package download fails because of SSL/TLS certificate verification (common on some corporate networks or with outdated system certificates), xmake now prints a warning and retries once with certificate verification disabled.

```bash
warning: download failed due to ssl certificate verification, retrying with ssl verification disabled ..
```

This fallback is only enabled for package files, resource files and patch files, because all of them are verified by their sha256 checksum afterwards, so it does not weaken security. To always disable certificate verification, `xmake g --insecure-ssl=y` is still available.

## Changelog

### New features

* [#7558](https://github.com/xmake-io/xmake/pull/7558): Add `check_alignof` / `alignof` detection support
* [#7587](https://github.com/xmake-io/xmake/pull/7587): Support `xmake show --format=json`
* [#7607](https://github.com/xmake-io/xmake/pull/7607): Support passing multiple target names to `build` / `clean` and other commands
* [#7634](https://github.com/xmake-io/xmake/pull/7634): Add filter support for xpack
* [#7654](https://github.com/xmake-io/xmake/pull/7654): Add `batchcmds:call` and lua-file transform support for `bin2obj` / `bin2c`
* [#7680](https://github.com/xmake-io/xmake/pull/7680): Rework `xmake plugin` to install plugins from repositories (`repo@name` or name), git urls (`github:user/repo[#branch]`) and local directories using the packages-style `plugins/<first-letter>/<name>` layout, and list built-in / installed / available plugins with their descriptions
* Add gcc-16 toolchain support

### Changes

* [#7562](https://github.com/xmake-io/xmake/pull/7562): Improve nuget version handling
* [#7564](https://github.com/xmake-io/xmake/pull/7564): Improve vcpkg dependency info in `find_package`
* [#7582](https://github.com/xmake-io/xmake/pull/7582): Support `set_encodings` and filter output for nvcc
* [#7609](https://github.com/xmake-io/xmake/pull/7609): Use `FormatMessageW` for Windows system error messages
* [#7614](https://github.com/xmake-io/xmake/pull/7614): Improve `cargo` package installation
* [#7619](https://github.com/xmake-io/xmake/pull/7619): Work around clangd drive-letter casing issue
* [#7620](https://github.com/xmake-io/xmake/pull/7620): Improve cl flag detection and output handling on vs2015
* [#7625](https://github.com/xmake-io/xmake/pull/7625): Improve verilator rules
* [#7629](https://github.com/xmake-io/xmake/pull/7629): vsxmake: support custom source types in the solution explorer and nonetype targets
* [#7630](https://github.com/xmake-io/xmake/pull/7630): Add `add_toolset` api checker
* [#7637](https://github.com/xmake-io/xmake/pull/7637): Improve readline / curses options for mingw
* [#7648](https://github.com/xmake-io/xmake/pull/7648): Improve error tips
* [#7655](https://github.com/xmake-io/xmake/pull/7655): Improve bin2obj object-flag detection and add ppc / mips support
* [#7657](https://github.com/xmake-io/xmake/pull/7657): Update NDK sdkver for riscv64
* [#7666](https://github.com/xmake-io/xmake/pull/7666): Improve vcpkg package discovery
* [#7672](https://github.com/xmake-io/xmake/pull/7672): Add fallback download support
* [#7688](https://github.com/xmake-io/xmake/pull/7688): Improve static libc++ runtime links for clang
* [#7689](https://github.com/xmake-io/xmake/pull/7689): Rewrite `xmake plugin --install` to install plugins from xmake-repo as `plugin` kind packages, reusing the package installation flow
* [#7693](https://github.com/xmake-io/xmake/pull/7693): Replace the deprecated tbox interfaces
* Improve elf rpath cleaning and package path handling
* Add xcodebuild detection
* Update the bundled tbox

### Bugs fixed

* [#7561](https://github.com/xmake-io/xmake/pull/7561): Fix `-flto=thin` regression for clang-cl
* [#7563](https://github.com/xmake-io/xmake/pull/7563): Fix crash in `contains` and improve PCH for C++ std modules
* [#7580](https://github.com/xmake-io/xmake/pull/7580): Fix the format plugin when the header path is already absolute
* [#7581](https://github.com/xmake-io/xmake/pull/7581): Fix missing paren in package loading
* [#7583](https://github.com/xmake-io/xmake/pull/7583): Fix splitting global flags for cmake packages
* [#7599](https://github.com/xmake-io/xmake/pull/7599): Fix gzip / tar detection on OpenBSD
* [#7600](https://github.com/xmake-io/xmake/pull/7600): Fix enabling the build cache memcache
* [#7601](https://github.com/xmake-io/xmake/pull/7601): Fix verilator to always define `TRACE`
* [#7602](https://github.com/xmake-io/xmake/pull/7602): Fix package load memcache
* [#7603](https://github.com/xmake-io/xmake/pull/7603): Fix `rmdir` via tbox update
* [#7604](https://github.com/xmake-io/xmake/pull/7604): Fix rpath cleaning for elf
* [#7608](https://github.com/xmake-io/xmake/pull/7608): Fix typos and format command menus
* [#7611](https://github.com/xmake-io/xmake/pull/7611): Fix cache environment variable handling ([#7576](https://github.com/xmake-io/xmake/issues/7576))
* [#7622](https://github.com/xmake-io/xmake/pull/7622): Fix default maintainer for deb packaging
* [#7627](https://github.com/xmake-io/xmake/pull/7627): Fix PATH handling in debuild
* [#7631](https://github.com/xmake-io/xmake/pull/7631): Fix PATH handling when installing deb packages
* [#7633](https://github.com/xmake-io/xmake/pull/7633): Fix pkg-config path for BSD in the Meson backend
* [#7640](https://github.com/xmake-io/xmake/pull/7640): Improve emcc detection with a fallback search
* [#7644](https://github.com/xmake-io/xmake/pull/7644): Fix stack buffer overflow for long paths in path translation
* [#7645](https://github.com/xmake-io/xmake/pull/7645): Fix removing read-only directories
* [#7659](https://github.com/xmake-io/xmake/pull/7659): Fix emcc detection for `.exe` / `.bat` on Windows
* [#7661](https://github.com/xmake-io/xmake/pull/7661): Revert static libc++ link for clang
* [#7668](https://github.com/xmake-io/xmake/pull/7668): Fix passing paths to cmake
* [#7671](https://github.com/xmake-io/xmake/pull/7671): Fix tbox bugs
* [#7674](https://github.com/xmake-io/xmake/pull/7674): Fix Mach host send-right leaks on macOS
* [#7676](https://github.com/xmake-io/xmake/pull/7676): Fix masm symbol flags for embed / edit levels
* [#7679](https://github.com/xmake-io/xmake/pull/7679): Fix `set_pcheader` for msvc in C mode
* [#7684](https://github.com/xmake-io/xmake/pull/7684): Fix wrong Lua stack index in `process.open`
* [#7685](https://github.com/xmake-io/xmake/pull/7685): Fix engine resource leaks
* [#7687](https://github.com/xmake-io/xmake/pull/7687): Fix the ninja generator to emit build edges for `win.sdk.resource` source batches ([#7682](https://github.com/xmake-io/xmake/issues/7682))
* [#7692](https://github.com/xmake-io/xmake/pull/7692): Fix dependency order for `build.c++.modules.tryreuse`
* Fix trybuild for scons
