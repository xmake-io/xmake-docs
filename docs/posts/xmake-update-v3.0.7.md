---
title: Xmake v3.0.7 Preview, Package Schemes, Wasm in Browser and UTF-8 Module
tags: [xmake, verilator, alpine, nix, qt, nim, zig, wasm, utf8]
date: 2026-02-07
author: Ruki
outline: deep
---

In this release, we have added support for Package Schemes, providing more flexible package installation and fallback mechanisms. We also improved Nix package manager support, optimized Verilator builds, and added support for Qt SDK dynamic mkspec selection.

Additionally, we now support running Wasm programs in the browser, reading scripts from standard input (stdin), and introduced several new modules and functions, such as `cli.iconv`, `utf8`, and `os.access`.

## New Features

### Package Schemes

The `scheme` feature is mainly used to provide multiple installation schemes, where each scheme may use different urls, versions, and install logic. Whenever one scheme fails to install, Xmake will automatically try the next installation scheme, thereby improving the installation success rate. This is especially useful when both binary packages and source code installation options exist.

#### API

##### `add_schemes`

Defines the list of available schemes for the package. The order matters: the first scheme is the default if none is explicitly selected.

```lua
package("mypkg")
    add_schemes("binary", "source")
```

##### `package:scheme(name)`

Retrieves the scheme instance by name. This is used to configure scheme-specific settings (URLs, versions, hashes, etc.), typically inside `on_source` or `on_load`.

```lua
on_source(function (package)
    -- Configure the 'binary' scheme
    local binary = package:scheme("binary")
    binary:add("urls", "https://example.com/mypkg-v$(version)-bin.zip")
    binary:add("versions", "1.0.0", "<sha256_of_binary>")

    -- Configure the 'source' scheme
    local source = package:scheme("source")
    source:add("urls", "https://example.com/mypkg-v$(version)-src.tar.gz")
    source:add("versions", "1.0.0", "<sha256_of_source>")
end)
```

##### `package:current_scheme()`

Retrieves the currently selected scheme. This is useful in `on_install` to determine which build logic to execute.

```lua
on_install(function (package)
    local scheme = package:current_scheme()
    if scheme and scheme:name() == "binary" then
        -- Install logic for precompiled binary
        os.cp("*", package:installdir("bin"))
    else
        -- Build logic for source
        import("package.tools.cmake").install(package)
    end
end)
```

##### Scheme Object Methods

The scheme object returned by `package:scheme("name")` supports the following methods:

-   `scheme:add(name, ...)`: Append values to a configuration (e.g., `urls`, `versions`, `patches`, `resources`).
-   `scheme:set(name, ...)`: Set values for a configuration.
-   `scheme:name()`: Get the name of the scheme.
-   `scheme:urls()`: Get the list of URLs for this scheme.
-   `scheme:version()`: Get the version object.
-   `scheme:version_str()`: Get the version string.
-   `scheme:sourcehash(url_alias)`: Get the SHA256 hash for the current version/URL.
-   `scheme:revision(url_alias)`: Get the git revision/commit.
-   `scheme:patches()`: Get patches for the current version.
-   `scheme:resources()`: Get resources for the current version.

#### Usage

##### Defining a Package with Schemes

In this example, the `binary` scheme is prioritized. If a matching binary package does not exist or fails to run after installation, it falls back to the `source` scheme.

```lua
package("ninja")
    set_homepage("https://ninja-build.org/")
    set_description("Small build system for use with gyp or CMake.")

    -- Define available schemes
    add_schemes("binary", "source")

    on_source(function (package)
        -- Configuration for 'binary' scheme
        local binary = package:scheme("binary")
        if is_host("macosx") then
            binary:add("urls", "https://github.com/ninja-build/ninja/releases/download/v$(version)/ninja-mac.zip")
            binary:add("versions", "1.13.1", "da7797794153629aca5570ef7c813342d0be214ba84632af886856e8f0063dd9")
        elseif is_host("linux") then
            binary:add("urls", "https://github.com/ninja-build/ninja/releases/download/v$(version)/ninja-linux.zip")
            binary:add("versions", "1.13.1", "0830252db77884957a1a4b87b05a1e2d9b5f658b8367f82999a941884cbe0238")
        elseif is_host("windows") then
            binary:add("urls", "https://github.com/ninja-build/ninja/releases/download/v$(version)/ninja-win.zip")
            binary:add("versions", "1.13.1", "26a40fa8595694dec2fad4911e62d29e10525d2133c9a4230b66397774ae25bf")
        end

        -- Configuration for 'source' scheme
        local source = package:scheme("source")
        source:add("urls", "https://github.com/ninja-build/ninja/archive/refs/tags/v$(version).tar.gz")
        source:add("versions", "1.13.1",  "f0055ad0369bf2e372955ba55128d000cfcc21777057806015b45e4accbebf23")
    end)

    on_install("@linux", "@windows", "@msys", "@cygwin", "@macosx", function (package)
        local scheme = package:current_scheme()
        if scheme and scheme:name() == "binary" then
            -- Install binary directly
            os.cp(is_host("windows") and "ninja.exe" or "ninja", package:installdir("bin"))
        else
            -- Build from source
            import("package.tools.xmake").install(package)
        end
    end)
```

##### Scheme Selection and Fallback

Xmake automatically manages scheme selection based on the order defined in `add_schemes`.

1.  **Default Scheme**: The first scheme listed in `add_schemes` is the default scheme. Xmake will attempt to install the package using this scheme first.
2.  **Fallback**: If the installation using the current scheme fails, Xmake will automatically fallback to the next scheme in the list and retry the installation.

For example, with `add_schemes("binary", "source")`:
1.  Xmake tries to install the "binary" scheme (download precompiled binary).
2.  If the binary download or installation fails, it automatically switches to the "source" scheme (build from source).

This provides a robust installation process where users get fast binary installations when available, with a reliable source build fallback.

```console
note: install or modify (m) these packages (pass -y to skip confirm)?
  -> ninja 1.13.1 [host]
please input: y (y/n/m)

  => download https://github.com/ninja-build/ninja/releases/download/v1.13.1/ninja-win.zip .. ok
  => install ninja 1.13.1 (binary) .. failed
  => download https://github.com/ninja-build/ninja/archive/refs/tags/v1.13.1.tar.gz .. ok
  => install ninja 1.13.1 (source) .. ok
```

##### Custom Install Script per Scheme

Instead of checking `package:current_scheme()` inside a global `on_install`, you can define a specific installation script for each scheme using `scheme:set("install", ...)`. This keeps the logic encapsulated.

```lua
on_source(function (package)
    local binary = package:scheme("binary")
    binary:set("install", function (package)
        -- Custom install logic for binary scheme
        os.cp(is_host("windows") and "ninja.exe" or "ninja", package:installdir("bin"))
    end)
end)
```

##### Precompiled Artifacts

The internal logic for downloading and installing precompiled artifacts has also been refactored to use the scheme mechanism.

When Xmake detects available precompiled artifacts (e.g. from the official repository), it internally creates a scheme for them and prioritizes it.

### New Modules and Functions

We introduced several new modules and functions to enhance script capabilities:

#### cli.iconv

A new module for character encoding conversion. It supports converting files between various encodings like UTF-8, GBK, UTF-16, etc.

```lua
import("cli.iconv")

-- Convert a file from GBK to UTF-8
iconv.convert("src.txt", "dst.txt", {from = "gbk", to = "utf8"})
```

You can also use it from the command line:

```bash
$ xmake l cli.iconv --from=gbk --to=utf8 src.txt dst.txt
```

#### os.access

A new function `os.access` has been added to check file access permissions, similar to the C `access` function.

```lua
if os.access("file.txt", "w") then
    print("file is writable")
end
```

#### utf8

A new `utf8` module has been added to handle various operations on UTF-8 strings, providing a more convenient interface for encoding processing.
This module is a builtin module, so you can use it directly in both description scope and script scope without `import`.

It provides interfaces compatible with the Lua 5.3+ `utf8` module, including:

- `utf8.len(s [, i [, j [, lax]]])`
- `utf8.char(...)`
- `utf8.codepoint(s [, i [, j]])`
- `utf8.offset(s, n [, i])`
- `utf8.codes(s [, lax])`
- `utf8.sub(s, i [, j])`
- `utf8.reverse(s)`
- `utf8.lastof(s, pattern [, plain])`
- `utf8.find(s, pattern [, init [, plain]])`
- `utf8.width(s)`
- `utf8.byte(s [, i [, j]])`

Example usage:

```lua
local s = "你好 xmake"
print(utf8.len(s)) -- 8
print(utf8.sub(s, 1, 2)) -- 你好
```

### Run Wasm in Browser

`xmake run` now supports running WebAssembly (Wasm) targets directly in the browser. This is particularly useful for Emscripten-based projects.

If `emrun` is available, Xmake uses it. Otherwise, it falls back to a simple Python HTTP server to serve the directory.

You can run your Wasm application simply by executing:

```bash
$ xmake run
```

Then, follow the output instructions to access http://localhost:8000 in your browser to run the Wasm program.

### Run Xmake Lua from Stdin

The `xmake lua` command now supports reading and running scripts from standard input (stdin), allowing you to pipe script content to xmake.

```bash
$ echo 'print("hello xmake")' | xmake lua --stdin
hello xmake
```

Or:

```bash
$ cat script.lua | xmake lua --stdin
```

### Test Output Matching

The `add_tests` configuration now supports matching test output against file content using `pass_output_files` and `fail_output_files`. This is useful for scenarios with complex test output.

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_tests("test1", {
        runargs = {"arg1"},
        pass_output_files = "test1.out"
    })
```

The content of `test1.out` serves as the expected standard output. If the actual output matches the file content, the test passes.

### Custom Install/Uninstall Directories

The `xmake install/uninstall` commands now support `--bindir`, `--libdir`, and `--includedir` arguments, allowing users to customize the installation directories for binaries, libraries, and headers.

We support both absolute paths and paths relative to the prefix directory, for example: `--libdir=lib64`.

This is particularly useful for packaging systems (like Homebrew, ArchLinux PKGBUILD) where specific files need to be installed into system-defined directories.

```bash
$ xmake install --bindir=/usr/bin --libdir=/usr/lib64 --includedir=/usr/include
```

### Improved Windows Run Error Output

We have improved the error message when a DLL is missing during Windows program execution. It now automatically displays the missing DLL name and shows an error dialog.

You can also explicitly enable/disable the error dialog using the `run.windows_error_dialog` policy.

```lua
set_policy("run.windows_error_dialog", true)
```

Example error message:

```bash
PS > xmake r
[ 42%]: linking.release foo.dll 
error: execv(build\windows\x64\release\test_foo_dll_presence.exe ) failed(-1073741515), system error 0xC0000135 (STATUS_DLL_NOT_FOUND). 
The application failed to start because the following DLLs were not found: 
  - foo.dll 
Please check your PATH environment variable or copy the missing DLLs to the executable directory.
```


### os.isexec and os.shell Improvements

We have improved the internal implementation of `os.isexec` and `os.shell` to provide more accurate detection.

For `os.isexec`, on Windows, it now more accurately determines if a file is executable based on file extensions (`PATHEXT`) and file headers (PE, Shebang, etc.).

For `os.shell`, we improved the detection mechanism, for example, by checking the parent process to get a more accurate Shell environment.

### Reading /proc Files with io.readfile

The `io.readfile` interface now supports reading special files in the `/proc` directory on Linux. These files often report a size of 0, and previous versions failed to read their content correctly.

### Long Path Support for os.mv/os.rm

We have improved interfaces like `os.cp`, `os.mv`, `os.rm`, and `os.dirs` to fix issues where operations could fail on Windows when dealing with long path directories.

### Nix Package Manager Improvements

In this version, we have significantly improved the integration with the Nix package manager. We added support for Semantic Versioning and improved the version selection mechanism.

Previously, Xmake's Nix integration lacked robust version control capabilities. With this update, we leverage the `core.base.semver` module to handle version comparisons more accurately.

We also introduced a caching mechanism to speed up package lookups. Xmake now utilizes both global and memory caches to store package derivation information.

This ensures that repeated lookups for the same Nix store path are instantaneous, significantly improving configuration speed for projects with many Nix dependencies.

### Qt SDK Dynamic Mkspec Selection

For the Qt SDK, we have improved the mkspec selection mechanism. Xmake can now automatically and dynamically select the most appropriate mkspec configuration based on the current build platform and Qt SDK version, without requiring manual specification by the user. This greatly simplifies the configuration of cross-platform Qt projects.

### Nim Support Improvements

We have also improved support for the Nim language. Dependency file generation for Nim source files has been added, making incremental builds for Nim projects more accurate.

Additionally, we enhanced Nim support for shared libraries and RPATH handling, improving the cross-platform build experience.

## Changelog

### New features

* [#7178](https://github.com/xmake-io/xmake/pull/7178): Switch Verilator build file parsing from cmake to json format
* [#7186](https://github.com/xmake-io/xmake/pull/7186): Add alpine ci
* [#7187](https://github.com/xmake-io/xmake/pull/7187): Add suffix support for CUDA architecture
* [#7190](https://github.com/xmake-io/xmake/pull/7190): Nix Package Manager: Add Semantic Versioning and Improve Version Selection
* [#7189](https://github.com/xmake-io/xmake/pull/7189): Add package schemes
* [#7208](https://github.com/xmake-io/xmake/pull/7208): Support dynamic mkspec selection for Qt SDK
* [#7219](https://github.com/xmake-io/xmake/pull/7219): Add cli.iconv module
* [#7235](https://github.com/xmake-io/xmake/pull/7235): Add string case conversion functions: lower and upper
* [#7246](https://github.com/xmake-io/xmake/pull/7246): Add utf8 module
* [#7268](https://github.com/xmake-io/xmake/pull/7268): Add dependency file generation for Nim source files
* [#7269](https://github.com/xmake-io/xmake/pull/7269): Add target architecture validation for cross-compilation in zig toolchain
* [#7274](https://github.com/xmake-io/xmake/pull/7274): Add os.access function for file access checking
* [#7284](https://github.com/xmake-io/xmake/pull/7284): Add `--stdin`
* [#7293](https://github.com/xmake-io/xmake/pull/7293): Add support for running wasm target in browser
* [#7300](https://github.com/xmake-io/xmake/pull/7300): Add libdir,includedir,bindir support for install/uninstall
* [#7295](https://github.com/xmake-io/xmake/pull/7295): Support test output files

### Changes

* [#7203](https://github.com/xmake-io/xmake/pull/7203): Improve mingw toolchain
* [#7206](https://github.com/xmake-io/xmake/pull/7206): WDK: Add shared directory to KMDF include path
* [#7214](https://github.com/xmake-io/xmake/pull/7214): Improve warnings output
* [#7216](https://github.com/xmake-io/xmake/pull/7216): Improve requirelock
* [#7223](https://github.com/xmake-io/xmake/pull/7223): Improve NuGet library file matching with score-based selection
* [#7226](https://github.com/xmake-io/xmake/pull/7226): Improve to find clang-tidy
* [#7232](https://github.com/xmake-io/xmake/pull/7232): Improve linker.link_scripts
* [#7237](https://github.com/xmake-io/xmake/pull/7237): Update tbox to support case
* [#7240](https://github.com/xmake-io/xmake/pull/7240): Improve verilator flags
* [#7258](https://github.com/xmake-io/xmake/pull/7258): Improve qt xpack
* [#7262](https://github.com/xmake-io/xmake/pull/7262): Improve pch concurrently to other targets
* [#7260](https://github.com/xmake-io/xmake/pull/7260): Improve fpc
* [#7270](https://github.com/xmake-io/xmake/pull/7270): Improve to select scheme version
* [#7272](https://github.com/xmake-io/xmake/pull/7272): Enhance Nim support for shared libraries and rpath handling
* [#7273](https://github.com/xmake-io/xmake/pull/7273): Improve io.read and io.readfile
* [#7267](https://github.com/xmake-io/xmake/pull/7267): Enhance shell detection for Linux by checking parent process
* [#7278](https://github.com/xmake-io/xmake/pull/7278): Improve os.isexec
* [#7283](https://github.com/xmake-io/xmake/pull/7283): Enhance compile_commands support and add test cases
* [#7285](https://github.com/xmake-io/xmake/pull/7285): Improve Windows shell detection for cmd/powershell
* [#7286](https://github.com/xmake-io/xmake/pull/7286): Check long env values when detecting vs
* [#7280](https://github.com/xmake-io/xmake/pull/7280): Add target flags only for cross-compilation
* [#7290](https://github.com/xmake-io/xmake/pull/7290): Improve vcvars
* [#7302](https://github.com/xmake-io/xmake/pull/7302): Improve run process errors
* [#7298](https://github.com/xmake-io/xmake/pull/7298): Add initial implementation for Windows DLL foo/main example

### Bugs fixed

* [#7210](https://github.com/xmake-io/xmake/pull/7210): Fix package version
* [#7213](https://github.com/xmake-io/xmake/pull/7213): Fix installdir of imporfiles
* [#7231](https://github.com/xmake-io/xmake/pull/7231): Fix get flag in module support
* [#7245](https://github.com/xmake-io/xmake/pull/7245): Fix to select scheme version
* [#7259](https://github.com/xmake-io/xmake/pull/7259): Fix export c++ function symbols
* [#7266](https://github.com/xmake-io/xmake/pull/7266): Fix pch header extension
* [#7282](https://github.com/xmake-io/xmake/pull/7282): find_cuda: revert breaking change
* [#7294](https://github.com/xmake-io/xmake/pull/7294): Fix package toolchain
* [#7296](https://github.com/xmake-io/xmake/pull/7296): Fix find emsdk
* [#7202](https://github.com/xmake-io/xmake/pull/7202): Fix getfenv
