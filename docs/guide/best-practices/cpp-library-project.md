---
title: "Build a C++ Static Library and Executable with Xmake"
description: "A complete Xmake tutorial: create a C++ static library, link an executable with add_deps, share headers, and build and run in debug or release mode."
---

# Build a C++ Static Library and Executable with Xmake

This example separates reusable C++ code into a static library and links it to an executable. It demonstrates `add_deps`, public include directories, and debug/release builds without requiring third-party packages.

Install [Xmake and a C++ compiler](/guide/quick-start#installation) first. Use MSVC on Windows, Clang on macOS, or GCC/Clang on Linux. The configuration and commands are shared across platforms; build separately for each target platform and architecture.

## Create the files

Create a directory with this structure:

```text
hello-library/
├── xmake.lua
├── include/
│   └── calculator.h
└── src/
    ├── calculator.cpp
    └── main.cpp
```

`include/calculator.h`:

```cpp
#pragma once
int add(int a, int b);
```

`src/calculator.cpp`:

```cpp
#include "calculator.h"

int add(int a, int b) {
    return a + b;
}
```

`src/main.cpp`:

```cpp
#include "calculator.h"
#include <iostream>

int main() {
    std::cout << "2 + 3 = " << add(2, 3) << '\n';
    return 0;
}
```

## Configure the library and executable

Create `xmake.lua` in the project root:

```lua
set_project("hello-library")
set_languages("c++17")
add_rules("mode.debug", "mode.release")

target("calculator")
    set_kind("static")
    add_files("src/calculator.cpp")
    add_includedirs("include", {public = true})

target("hello")
    set_kind("binary")
    add_files("src/main.cpp")
    add_deps("calculator")
```

- `set_kind("static")` builds the reusable code as a static library.
- `add_deps("calculator")` builds the library before `hello` and links it into the executable.
- `{public = true}` makes the library's include directory available to dependent targets. You do not need to duplicate the include path in `hello`.

For an external package instead of a library defined in this project, use [add_requires and add_packages](/guide/project-configuration/add-packages).

## Build and run

Run these commands from `hello-library`:

```sh
xmake f -m debug
xmake
xmake run hello
```

Expected output:

```text
2 + 3 = 5
```

Switch to an optimized build with the same project configuration:

```sh
xmake f -m release
xmake
xmake run hello
```

`xmake run` locates the executable for the current configuration, so you do not need to hard-code a platform-specific output path. See [build configuration](/guide/basic-commands/build-configuration) for toolchain and architecture options.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| No C++ compiler found | Install a compiler and check [toolchain selection](/guide/basic-commands/switch-toolchains). Installing Xmake alone does not install every platform SDK. |
| `calculator.h` not found | Check the directory structure and the public include directory on the `calculator` target. |
| Undefined reference or unresolved external symbol for `add` | Make sure `calculator.cpp` is in the library target and `hello` declares `add_deps("calculator")`. |
| Multiple definitions of `main` | Keep `main.cpp` in the executable target only; avoid adding all source files to both targets. |

Use `xmake -vD` to inspect compiler and linker commands when a build fails.

## Next steps

- [C++ project examples](/examples/cpp/basic): explore more library and executable layouts.
- [Official packages](/guide/package-management/using-official-packages): add external C/C++ dependencies.
- [Cross-compilation](/guide/basic-commands/cross-compilation): configure another target platform and toolchain.
- [Build performance](/guide/best-practices/performance): explore caching and parallel compilation.
