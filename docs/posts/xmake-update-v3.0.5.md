---
title: Xmake v3.0.5 release, Multi-row progress, XML module and Swift interop
tags: [xmake, swift, xml, async, progress, toolchain, cuda]
date: 2025-11-17
author: Ruki
outline: deep
---

**Download:** [GitHub Releases](https://github.com/xmake-io/xmake/releases/tag/v3.0.5) | [Source Repository](https://github.com/xmake-io/xmake)

## Introduction of new features

In the new version, we have introduced several major features that significantly enhance the development experience. The highlights include **multi-row progress output** with theme support for better build visibility, a comprehensive **XML module** for parsing and encoding XML data, **asynchronous OS APIs** for improved I/O performance, and **Swift interop support** for seamless integration between Swift and C++/Objective-C code. We have also made significant improvements to toolchain configuration, TTY handling, and various performance optimizations.

### Support multi-row refresh for progress output

We have improved the progress output to support multi-row refresh, providing a significantly better visual experience during long-running builds. Instead of updating a single progress line, the build output now displays multiple concurrent build tasks with their individual progress, making it easier to monitor parallel compilation.

The output now shows multiple progress lines for parallel builds with real-time status updates for each compilation task:

![progress](/assets/img/progress-multirow.png)

You can enable multi-row progress output in two ways:

1. **Via theme configuration**: Use the `soong` theme which includes multi-row progress by default:
   ```bash
   $ xmake g --theme=soong
   ```

2. **Via project policy**: Enable it directly in your `xmake.lua`:
   ```lua
   set_policy("build.progress_style", "multirow")
   ```

This provides better visibility into parallel build progress, makes it easier to identify slow compilation units, and improves the overall user experience for large projects with many source files or parallel builds with multiple compilation units.

For more details, see: [#6974](https://github.com/xmake-io/xmake/pull/6974)

### Add Swift interop support for C++ and Objective-C

We have added comprehensive Swift interop support, enabling seamless bidirectional interoperability between Swift and C++/Objective-C code in your projects. The `swift.interop` rule is automatically enabled when the `swift.interop` target value is set, making it easy to mix Swift and C++ code in the same project.

The Swift interop support includes:
- Bidirectional Swift-C++ interoperability
- Automatic header generation for C++ to call Swift functions
- Support for both Objective-C and C++ interop modes
- Swift static library archiver toolset for enhanced compilation workflows

**Target values:**

You can configure Swift interop using the following target values:

```lua
set_values("swift.modulename", "SwiftFibonacci")           -- Set the Swift module name
set_values("swift.interop", "cxx")                         -- Enable interop: "objc" or "cxx"
set_values("swift.interop.headername", "fibonacci-Swift.h") -- Define output header name
set_values("swift.interop.cxxmain", true)                  -- Force -parse-as-library to avoid duplicate main symbols
```

**Complete example: Swift-C++ interop**

Here's a complete example demonstrating Swift-C++ bidirectional interoperation:

**fibonacci.swift:**

```swift
// fibonacci.swift
public func fibonacciSwift(_ x: CInt) -> CInt {
  print("x [swift]: \(x)")
  if x <= 1 {
    return 1
  }
  return fibonacciSwift(x - 1) + fibonacciSwift(x - 2)
}
```

**main.cpp:**

```cpp
// main.cpp
#include <fibonacci-Swift.h>
#include <iostream>

int main(int argc, char ** argv) {
  std::cout << SwiftFibonacci::fibonacciSwift(5) << std::endl;
  return 0;
}
```

**xmake.lua:**

```lua
-- xmake.lua
target("cxx_interop")
    set_kind("binary")
    set_languages("cxx20")
    add_files("lib/**.swift", {public = true})
    add_files("src/**.cpp")
    set_values("swift.modulename", "SwiftFibonacci")
    set_values("swift.interop", "cxx")
    set_values("swift.interop.headername", "fibonacci-Swift.h")
    set_values("swift.interop.cxxmain", true)
```

**Build output:**

```bash
$ xmake
checking for platform ... macosx
checking for architecture ... x86_64
checking for Xcode directory ... /Applications/Xcode.app
[  3%]: <cxx_interop> generating.swift.header fibonacci-Swift.h
[ 38%]: cache compiling.release src/fibonacci.cpp
[ 56%]: compiling.release lib/fibonacci/fibonacci.swift
[ 76%]: linking.release cxx_interop
[100%]: build ok, spent 1.785s

$ xmake run
x [swift]: 5
x [swift]: 4
...
8
```

When `swift.interop` is set, xmake automatically generates the C++ header file that allows C++ code to call Swift functions. You can use `swift.modulename` to define the Swift module name, which becomes the namespace in C++. Choose between `"objc"` for Objective-C interop or `"cxx"` for C++ interop. When both Swift and C++ have main functions, use `swift.interop.cxxmain` to avoid duplicate main symbols.

This feature is particularly useful for:
- Migrating existing C++ projects to Swift incrementally
- Using high-performance C++ libraries in Swift applications
- Creating Swift wrappers for C++ APIs
- Building cross-platform applications that leverage both languages
- Calling Swift code from C++ applications seamlessly

For more details, see: [#6967](https://github.com/xmake-io/xmake/pull/6967)

### Add XML module with parsing and encoding support

We have introduced a new `core.base.xml` module that provides a tiny DOM-style XML toolkit working inside Xmake's sandbox. It focuses on predictable data structures, JSON-like usability, and optional streaming so you can parse large XML documents without building the entire tree.

The XML module features:
- DOM-style node structure using plain Lua tables
- Streaming parser for large files (`xml.scan`)
- XPath-like queries (`xml.find`)
- Convenient file I/O helpers (`xml.loadfile`, `xml.savefile`)
- Support for comments, CDATA, DOCTYPE, and unquoted attributes
- Pretty printing with customizable indentation

**Node Structure:**

XML nodes are plain Lua tables with the following structure:

```lua
{
    name     = "element-name" | nil,  -- only for element nodes
    kind     = "element" | "text" | "comment" | "cdata" | "doctype" | "document",
    attrs    = { key = value, ... } or nil,
    text     = string or nil,
    children = { child1, child2, ... } or nil,
    prolog   = { comment/doctype nodes before root } or nil
}
```

**Basic usage:**

```lua
import("core.base.xml")

-- Parse XML string
local doc = assert(xml.decode([[
<?xml version="1.0"?>
<root id="1">
  <item id="foo">hello</item>
</root>
]]))

-- Find and modify nodes
local item = assert(xml.find(doc, "//item[@id='foo']"))
item.attrs.lang = "en"             -- mutate attrs directly
item.children = {xml.text("world")} -- replace existing text node

-- Add comment
table.insert(doc.children, xml.comment("generated by xmake"))

-- Encode with pretty printing
local pretty = assert(xml.encode(doc, {pretty = true}))
assert(xml.savefile("out.xml", doc, {pretty = true}))
```

**File operations:**

```lua
import("core.base.xml")

-- Load from file
local plist = assert(xml.loadfile("Info.plist"))

-- Modify and save
local dict = assert(xml.find(plist, "plist/dict"))
-- ... modify nodes ...
assert(xml.savefile("Info.plist", plist, {pretty = true, indent = 2}))
```

**Streaming parser for large files:**

```lua
import("core.base.xml")

local found
xml.scan(plist_text, function(node)
    if node.name == "key" and xml.text_of(node) == "NSPrincipalClass" then
        found = node
        return false -- early terminate
    end
end)
```

`xml.scan` walks nodes as they are completed; returning `false` stops the scan immediately. This is ideal for large files when you only need a few entries.

**XPath-like queries:**

```lua
import("core.base.xml")

local doc = assert(xml.loadfile("config.xml"))

-- Find by path
local element = xml.find(doc, "/root/item")

-- Find by attribute
local item = xml.find(doc, "//item[@id='foo']")

-- Find by text content
local node = xml.find(doc, "//string[text()='value']")

-- Get text content
local text = xml.text_of(node)
```

**Node creation helpers:**

```lua
import("core.base.xml")

local textnode   = xml.text("hello")
local empty      = xml.empty("br", {class = "line"})
local comment    = xml.comment("generated by xmake")
local cdata_node = xml.cdata("if (value < 1) {...}")
local doctype    = xml.doctype('plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"')
```

**Options:**

| Option | Applies to | Description |
|--------|------------|-------------|
| `trim_text = true` | `xml.decode`, `xml.scan` | Strip leading/trailing spaces inside text nodes |
| `keep_whitespace_nodes = true` | `xml.decode`, `xml.scan` | Preserve whitespace-only text nodes |
| `pretty = true` / `indent` / `indentchar` | `xml.encode`, `xml.savefile` | Enable formatting and control indentation |

**Use cases:**
- Reading and modifying IDE project configurations (Info.plist, .vcxproj, etc.)
- Generating XML-based project files
- Processing build metadata and reports
- Parsing large XML files efficiently with streaming
- Converting between XML and Lua data structures

For more details, see: [#7025](https://github.com/xmake-io/xmake/pull/7025)

### Add JSON output format for target information

We have added JSON output format support for the `xmake show` command, making it easier to programmatically extract target information. This feature enables seamless integration with IDEs, build automation tools, and custom scripts that need to parse xmake project metadata.

The JSON output includes comprehensive target information:
- Target name, kind, and file paths
- Source files and header files
- Compiler flags and defines
- Link libraries and linker flags
- Include directories and dependencies
- Configuration options and rules

You can use `--json` for compact output or `--pretty-json` for formatted output:

```bash
$ xmake show -t target --json
{"targets":[{"name":"test","kind":"binary","files":["src/main.cpp"],"links":["pthread"],"defines":["DEBUG"]}]}

$ xmake show -t target --pretty-json
{
  "targets": [
    {
      "name": "test",
      "kind": "binary",
      "files": ["src/main.cpp"],
      "links": ["pthread"],
      "defines": ["DEBUG"],
      "includedirs": ["include"],
      "cxxflags": ["-std=c++17"],
      "deps": ["mylib"]
    }
  ]
}
```

You can extract target information for IDE integration or use it in scripts:

```bash
# Extract target information for IDE integration
xmake show -t target --pretty-json > project_info.json

# Use in scripts
TARGET_INFO=$(xmake show -t target --json)
TARGET_NAME=$(echo $TARGET_INFO | jq -r '.targets[0].name')
```

This is particularly useful for:
- IDE integration (VS Code, CLion, etc.)
- Automated build systems and CI/CD pipelines
- Custom project analysis tools
- Documentation generation

For more details, see: [#7024](https://github.com/xmake-io/xmake/pull/7024)

### Support specifying CUDA SDK version

We have added support for specifying the CUDA SDK version via the `cuda_sdkver` configuration option, giving you precise control over CUDA compilation. This is essential when working with multiple CUDA installations or when you need to target a specific CUDA version for compatibility.

You can specify the CUDA SDK version for a target:

```lua
target("cuda_app")
    set_kind("binary")
    add_files("src/*.cu")
    add_rules("cuda")
    set_values("cuda.sdkver", "12.0")  -- Specify CUDA SDK version
```

You can also combine it with compute capability settings for specific GPU architectures:

```lua
target("cuda_app")
    set_kind("binary")
    add_files("src/*.cu")
    add_rules("cuda")
    set_values("cuda.sdkver", "12.0")
    set_values("cuda.arch", "sm_75", "sm_80", "sm_86")
```

Different targets can use different CUDA versions:

```lua
-- Target using CUDA 11.8
target("cuda11_app")
    set_kind("binary")
    add_files("src/cuda11/*.cu")
    add_rules("cuda")
    set_values("cuda.sdkver", "11.8")

-- Target using CUDA 12.0
target("cuda12_app")
    set_kind("binary")
    add_files("src/cuda12/*.cu")
    add_rules("cuda")
    set_values("cuda.sdkver", "12.0")
```

This feature is particularly useful for:
- Projects requiring specific CUDA versions for compatibility
- Multi-version CUDA development environments
- Ensuring consistent CUDA compilation across different systems
- Targeting specific GPU architectures with appropriate CUDA features

For more details, see: [#6964](https://github.com/xmake-io/xmake/pull/6964)

### Add GCC 15 toolchain support

We have added support for the latest GCC 15 toolchain, ensuring compatibility with the newest compiler features and improvements.

```bash
$ xmake f --toolchain=gcc-15
```

For more details, see: [#6929](https://github.com/xmake-io/xmake/pull/6929)

### Add Solaris platform support

We have added support for the Solaris platform, including i386 and x86_64 architectures. This enables xmake to build on Solaris systems, further expanding cross-platform support. We have also added support for additional BSD systems, including NetBSD, OpenBSD, and DragonflyBSD.

```bash
$ xmake f -p solaris -a i386
$ xmake f -p solaris -a x86_64
```

For more details, see: [#7055](https://github.com/xmake-io/xmake/pull/7055) and [#7054](https://github.com/xmake-io/xmake/pull/7054)

### Add async support for os APIs

We have added asynchronous support for os APIs, allowing non-blocking file and process operations in xmake scripts. This enables concurrent I/O operations, significantly improving performance when dealing with multiple file operations or long-running processes.

**Supported APIs:**

The following APIs now support async operations:
- `os.rm` - Remove files
- `os.rmdir` - Remove directories
- `os.cp` - Copy files
- `os.files` - Find files
- `os.filedirs` - Find files and directories
- `os.dirs` - Find directories
- `os.match` - Match file patterns
- `lib.detect.find_file` - Find file
- `lib.detect.find_library` - Find library
- `lib.detect.find_path` - Find path
- `lib.detect.find_directory` - Find directory

**Async modes:**

There are two async modes available:

1. **`async = true`** (blocking): The operation can be scheduled with other coroutine tasks. You need to wait for the return value.
2. **`async = true, detach = true`** (non-blocking): The operation executes in a background thread, so you don't need to wait for the return value.

**Usage examples:**

```lua
import("lib.detect.find_file")

function main()
    -- Remove file in an idle background thread, we don't need to wait for it
    os.rm("/tmp/xxx.txt", {async = true, detach = true})

    -- Async wait and get return value
    local files = os.files("src/*.c", {async = true})

    -- Async wait and find file
    local file = find_file("*.txt", "/tmp/", {async = true})
end
```

This enables non-blocking I/O operations, significantly improves performance when reading multiple configuration files in parallel or processing large file lists concurrently. It's also useful for running external tools asynchronously, implementing parallel build steps, and improving plugin and rule performance.

For more details, see: [#6989](https://github.com/xmake-io/xmake/pull/6989) and [#6868](https://github.com/xmake-io/xmake/issues/6868)

## Improvements

### Improve toolchain configuration syntax

We have improved the toolchain configuration syntax to support inline configuration options, making toolchain setup more concise and declarative. The new syntax simplifies toolchain configuration with three main formats:

**Simplified toolchain config formats:**

1. **Only toolchain name**: `clang`, `gcc`
2. **Toolchain@package**: `clang@llvm-10`, `@muslcc`, `zig`
3. **Toolchain[configs]@package**: `mingw[clang]@llvm-mingw`, `msvc[vs=2025,..]`

**Fast toolchain config switching:**

You can now quickly switch toolchain configurations using inline syntax:

```lua
-- Equivalent to: set_toolchains("mingw", {clang = true})
set_toolchains("mingw[clang]")

-- Command line usage
-- xmake f --toolchain=mingw[clang]
```

**Examples:**

```lua
-- Simple toolchain
set_toolchains("clang")

-- Toolchain with package
set_toolchains("clang@llvm-10")
set_toolchains("@muslcc")
set_toolchains("zig")

-- Toolchain with configs and package
set_toolchains("mingw[clang]@llvm-mingw")
set_toolchains("msvc[vs=2025]")

-- Multiple configs
set_toolchains("mingw[clang]", {sdk = "/path/to/llvm-mingw"})
```

**Additional improvements:**

- Added clang support for llvm-mingw toolchain:
  ```bash
  xmake f --toolchain=mingw[clang] --sdk=/xxx/llvm-mingw
  ```
  ```lua
  set_toolchains("mingw[clang]@llvm-mingw")
  ```

- Added gcc support for old version NDK toolchain:
  ```bash
  xmake f -p android --toolchain=ndk[gcc] --ndk=/xxxx
  ```

This makes toolchain configuration more concise and readable, enables declarative toolchain setup, and makes it easier to manage multiple toolchain variants. It's particularly useful for quick toolchain switching, per-target toolchain configuration, CI/CD pipeline setup, and cross-compilation toolchain specification.

For more details, see: [#6924](https://github.com/xmake-io/xmake/pull/6924), [discussion #6903](https://github.com/xmake-io/xmake/discussions/6903), and [discussion #6879](https://github.com/xmake-io/xmake/discussions/6879)

### Improve file reading performance

We have significantly improved file reading performance, especially for large files and projects with many source files.

The improvements include better buffering strategies and optimized I/O operations.

For more details, see: [#6942](https://github.com/xmake-io/xmake/pull/6942)

### Add realtime output support for xmake test

We have added realtime output support for `xmake test`, allowing test output to be displayed in real-time as tests run, rather than buffering output until the test completes. This is particularly useful for long-running tests or tests that produce continuous output, as it provides immediate feedback on test progress.

To enable realtime output for a test, set `realtime_output = true` in the test configuration:

```lua
target("test")
    set_kind("binary")
    add_tests("stub_n", {realtime_output = true, files = "tests/stub_n*.cpp", defines = "STUB_N"})
```

When `realtime_output` is enabled, the test output will be streamed directly to the terminal as the test runs, making it easier to monitor test progress and debug issues in real-time.

For more details, see: [#6993](https://github.com/xmake-io/xmake/pull/6993)

### Improve TTY handling and output

We have improved TTY handling and output formatting in the `core.base.tty` module. The following new interfaces have been added:

- `tty.cursor_move_up(n)` / `tty.cursor_move_down(n)` - Move cursor vertically
- `tty.cursor_move_left(n)` / `tty.cursor_move_right(n)` - Move cursor horizontally
- `tty.cursor_move_to_col(n)` - Move cursor to specific column
- `tty.cursor_save()` / `tty.cursor_restore()` - Save and restore cursor position
- `tty.cursor_hide()` / `tty.cursor_show()` - Control cursor visibility
- `tty.cr()` - Move to start of line (carriage return)
- `tty.erase_line()` - Clear entire line
- `tty.erase_line_to_end()` - Erase from cursor to end of line
- `tty.has_vtansi()` - Check if terminal supports ANSI control codes

For more details, see: [#6970](https://github.com/xmake-io/xmake/pull/6970)

### Add Ghostty terminal detection support

We have added support for detecting the Ghostty terminal, ensuring proper output formatting and color support in this modern terminal emulator.

For more details, see: [#6987](https://github.com/xmake-io/xmake/pull/6987)

### Improve graph module performance

We have improved the performance of the graph module, which is used for dependency resolution and build graph generation.

The improvements result in faster project configuration and dependency analysis.

For more details, see: [#7027](https://github.com/xmake-io/xmake/pull/7027)

## Changelog

### New features

* [#6929](https://github.com/xmake-io/xmake/pull/6929): Add support for GCC 15 toolchain
* [#6967](https://github.com/xmake-io/xmake/pull/6967): Add Swift interop support for C++ and Objective-C
* [#6964](https://github.com/xmake-io/xmake/pull/6964): Support specifying CUDA SDK version via cuda_sdkver
* [#6963](https://github.com/xmake-io/xmake/pull/6963): Add libtool patch support for cross compilation
* [#6974](https://github.com/xmake-io/xmake/pull/6974): Support multi-row refresh for progress output
* [#7024](https://github.com/xmake-io/xmake/pull/7024): Add JSON output format for `xmake show -t target`
* [#7025](https://github.com/xmake-io/xmake/pull/7025): Add XML module with parsing and encoding support
* [#6989](https://github.com/xmake-io/xmake/pull/6989): Add async support for os APIs
* [#7055](https://github.com/xmake-io/xmake/pull/7055): Add Solaris platform support (i386, x86_64)
* [#7054](https://github.com/xmake-io/xmake/pull/7054): Add support for additional BSD systems (NetBSD, OpenBSD, DragonflyBSD)

### Changes

* [#6924](https://github.com/xmake-io/xmake/pull/6924): Improve toolchain configuration with add_toolchains("name[configs]") syntax
* [#6942](https://github.com/xmake-io/xmake/pull/6942): Improve file reading performance
* [#6970](https://github.com/xmake-io/xmake/pull/6970): Improve TTY handling and output
* [#6977](https://github.com/xmake-io/xmake/pull/6977): Refactor Xcode toolchain and integrate it into LLVM toolchain for Apple devices
* [#6987](https://github.com/xmake-io/xmake/pull/6987): Add Ghostty terminal detection support
* [#7003](https://github.com/xmake-io/xmake/pull/7003): Limit build environment retrieval in package configurations
* [#7004](https://github.com/xmake-io/xmake/pull/7004): Skip rebuilding packages and std modules when using -r flag
* [#7019](https://github.com/xmake-io/xmake/pull/7019): Improve xmake.sh/configure script and add Ninja generator support
* [#7022](https://github.com/xmake-io/xmake/pull/7022): Make zig-cc toolchain inherit from clang
* [#7027](https://github.com/xmake-io/xmake/pull/7027): Improve graph module performance
* [#7031](https://github.com/xmake-io/xmake/pull/7031): Improve require parsing
* [#7032](https://github.com/xmake-io/xmake/pull/7032): Improve symbol extraction
* [#7037](https://github.com/xmake-io/xmake/pull/7037): Improve xmake format
* [#7038](https://github.com/xmake-io/xmake/pull/7038): Improve clang-tidy output handling

### Bugs fixed

* [#6926](https://github.com/xmake-io/xmake/pull/6926): Fix loading Unicode main script path on Windows
* [#6931](https://github.com/xmake-io/xmake/pull/6931): Fix C++ modules: fallback to system-wide clang-scan-deps when toolchain version is not installed
* [#6937](https://github.com/xmake-io/xmake/pull/6937): Fix target jobs handling
* [#6954](https://github.com/xmake-io/xmake/pull/6954): Fix modules support for vsxmake/vs generators
* [#6955](https://github.com/xmake-io/xmake/pull/6955): Fix build number sorting in packages
* [#6956](https://github.com/xmake-io/xmake/pull/6956): Fix build failure when using zigcc linker that doesn't support depfile
* [#6959](https://github.com/xmake-io/xmake/pull/6959): Fix using zigcc with autotools for dynamic linking
* [#6983](https://github.com/xmake-io/xmake/pull/6983): Fix modules: strip sanitizer flags for module reuse
* [#6984](https://github.com/xmake-io/xmake/pull/6984): Fix libdir path in installed CMake import files
* [#6992](https://github.com/xmake-io/xmake/pull/6992): Fix modules: add all supported platforms for clang get_cpp_library_name
* [#6993](https://github.com/xmake-io/xmake/pull/6993): Fix xmake test modules
* [#6996](https://github.com/xmake-io/xmake/pull/6996): Fix Nimble find_package to use latest package list format
* [#6999](https://github.com/xmake-io/xmake/pull/6999): Fix rootdir handling
* [#7002](https://github.com/xmake-io/xmake/pull/7002): Fix asn1c: include generated output as system headers
* [#7012](https://github.com/xmake-io/xmake/pull/7012): Fix sparse checkout handling
* [#7013](https://github.com/xmake-io/xmake/pull/7013): Fix removing dependencies when packaging
* [#7016](https://github.com/xmake-io/xmake/pull/7016): Fix project default configuration in vsxmake
* [#7017](https://github.com/xmake-io/xmake/pull/7017): Fix lock_packages typo
* [#7018](https://github.com/xmake-io/xmake/pull/7018): Fix build order: only disable when dependency linking inheritance is disabled
* [#7035](https://github.com/xmake-io/xmake/pull/7035): Fix process redirection issues by updating tbox

