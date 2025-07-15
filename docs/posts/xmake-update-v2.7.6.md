---
title: Xmake v2.7.6 Released, Add Verilog and C++ Module Distribution Support
date: 2023-01-22
author: Ruki
---

## Introduction of new features

### Support Verilog Program

#### iVerilog Simulator

Through `add_requires("iverilog")` configuration, we can automatically pull the iverilog toolchain package, and then use `set_toolchains("@iverilog")` to automatically bind the toolchain to compile the project.

```lua
add_requires("iverilog")
target("hello")
     add_rules("iverilog. binary")
     set_toolchains("@iverilog")
     add_files("src/*.v")
```

##### Set abstract configuration

```Lua
add_requires("iverilog")
target("hello")
     add_rules("iverilog. binary")
     set_toolchains("@iverilog")
     add_files("src/*.v")
     add_defines("TEST")
     add_includedirs("inc")
     set_languages("v1800-2009")
```

We can use `set_languages("v1800-2009")` to set the language standard for switching Verilog.

Currently supported values and mappings are as follows:

```lua
["v1364-1995"] = "-g1995"
["v1364-2001"] = "-g2001"
["v1364-2005"] = "-g2005"
["v1800-2005"] = "-g2005-sv"
["v1800-2009"] = "-g2009"
["v1800-2012"] = "-g2012"
```

##### Set custom flags


```lua
add_requires("iverilog")
target("hello")
     add_rules("iverilog. binary")
     set_toolchains("@iverilog")
     add_files("src/*.v")
     add_values("iverilogs.flags", "-DTEST")
```

##### Build the project

```console
$ xmake
check iverilog... iverilog
check vvp... vvp
[50%]: linking.iverilog hello.vvp
[100%]: build ok!
```

##### Run the program

```console
$ xmake run
hello world!
LXT2 INFO: dumpfile hello.vcd opened, ready for output.
src/main.v:6: $finish called at 0 (1s)
```

More complete examples: [iVerilog Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/embed/iverilog)







#### Verilator Simulator

Through `add_requires("verilator")` configuration, we can automatically pull the verilator toolchain package, and then use `set_toolchains("@verilator")` to automatically bind to the toolchain to compile the project.

```lua
add_requires("verilator")
target("Hello")
     add_rules("verilator. binary")
     set_toolchains("@verilator")
     add_files("src/*.v")
     add_files("src/*.cpp")
```

verilator project, we need an additional `sim_main.cpp` file to participate in the compilation, as the entry code of the program.

```c
#include "hello.h"
#include "verilated.h" (Simplified Chinese)

int main(int argc, char** argv) {
     VerilatedContext* contextp = new VerilatedContext;
     contextp->commandArgs(argc, argv);
     hello* top = new hello{contextp};
     while (!contextp->gotFinish()) { top->eval(); }
     remove top.
     Remove contextp.
     returns 0.
}
```

##### Set abstract configuration

```lua
add_requires("verilator")
target("Hello")
     add_rules("verilator. binary")
     set_toolchains("@verilator")
     add_files("src/*.v")
     add_defines("TEST")
     add_includedirs("inc")
     set_languages("v1800-2009")
```

We can use `set_languages("v1800-2009")` to set the language standard for switching Verilog.

Currently supported values and mappings are as follows.

```lua
--Verilog
["v1364-1995"] = "+1364-1995ext+v".
["v1364-2001"] = "+1364-2001ext+v".
["v1364-2005"] = "+1364-2005ext+v".
--system-Verilog
["v1800-2005"] = "+1800-2005ext+v".
["v1800-2009"] = "+1800-2009ext+v".
["v1800-2012"] = "+1800-2012ext+v",
["v1800-2017"] = "+1800-2017ext+v".
```

##### Set custom flags

```lua
add_requires("verilator")
target("Hello")
     add_rules("verilator. binary")
     set_toolchains("@verilator")
     add_files("src/*.v")
     add_files("src/*.cpp")
     add_values("verilator.flags", "--trace", "--timing")
```

##### Build the project

```console
$ xmake
[ 0%]: compiling.verilog src/main.v
[ 15%]: cache compiling.release /Users/ruki/.xmake/packages/v/verilator/2023.1.10/cd2268409c1d44799288c7759b3cbd56/share/verilator/include/verilated.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__Slow.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h9053a130__0__Slow.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello.cpp
[ 15%]: cache compiling.release /Users/ruki/.xmake/packages/v/verilator/2023.1.10/cd2268409c1d44799288c7759b3cbd56/share/verilator/include/verilated_threads.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello__Syms.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h07139e86__0.cpp
[15%]: cache compiling.release src/sim_main.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h9053a130__0.cpp
[84%]: linking. release hello
[100%]: build ok!
```

##### Run the program

```console
$ xmake run
ruki-2:hello ruki$ xmake run
hello world!
- src/main.v:4:Verilog $finish
```

A more complete example: [Verilator](https://github.com/xmake-io/xmake/tree/master/tests/projects/embed/verilator)

### Support for C++ Module distribution

Many thanks to [Arthapz](https://github.com/Arthapz) for continuing to help improve xmake's support for C++ Modules in this new release.

We can now distribute C++ Modules as packages for quick integration and reuse in other projects.

This is a prototype implementation based on the draft design for module distribution in [p2473r1](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2021/p2473r1.pdf).

#### Creating a C++ Modules package for distribution

We start by maintaining a build of the modules using xmake.lua and telling xmake which module files to install for external distribution by specifying ``{install = true}`''.

```lua
add_rules("mode.release", "mode.debug")
set_languages("c++20")

target("foo")
    set_kind("static")
    add_files("*.cpp")
    add_files("*.mpp", { install = true })
```

We then make it into a package that we can commit to the [xmake-repo](https://github.com/xmake-io/xmake-repo) repository, or of course directly into a local package, or a private repository package.

Here, for testing purposes, we just make it a local package via ``set_sourcedir``.

```lua
package("foo")
    set_sourcedir(path.join(os.scriptdir(), "src"))
    on_install(function(package)
        import("package.tools.xmake").install(package, {})
    end)
````

#### Integrating the C++ Modules package

We then quickly integrate the C++ Modules package for use via the package integration interface with `add_requires("foo")`.

Since the modules packages for foo are defined in a private repository, we introduce our own package repository via `add_repositories("my-repo my-repo")`.

If the package has already been committed to the official xmake-repo repository, there is no need to configure it additionally.

```lua
add_rules("mode.release", "mode.debug")
set_languages("c++20")

add_repositories("my-repo my-repo")
add_requires("foo", "bar")

target("packages")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("foo", "bar")
    set_policy("build.c++.modules", true)
```

Once the packages are integrated, we can run the ``xmake`'' command to download, compile and integrate the C++ Modules package for use with one click.

```bash
$ xmake
checking for platform ... linux
checking for architecture ... x86_64
note: install or modify (m) these packages (pass -y to skip confirm)?
in my-repo:
  -> foo latest
  -> bar latest
please input: y (y/n/m)

  => install bar latest ... ok
  => install foo latest ... ok
[ 0%]: generating.module.deps src/main.cpp
[ 0%]: generating.module.deps /mnt/xmake/tests/projects/c++/modules/packages/build/.packages/b/bar/latest/ 4e0143c97b65425b855ad5fd03038b6a/modules/bar/bar.mpp
[ 0%]: generating.module.deps /mnt/xmake/tests/projects/c++/modules/packages/build/.packages/f/foo/latest/ 4e0143c97b65425b855ad5fd03038b6a/modules/foo/foo.mpp
[ 14%]: compiling.module.release bar
[ 14%]: compiling.module.release foo
[ 57%]: compiling.release src/main.cpp
[ 71%]: linking.release packages
[ 100%]: build ok!
```''

Note: After each package is installed, a meta-info file for the maintenance module is stored in the package path, this is a format specification agreed in ``p2473r1.pdf``, it may not be the final standard, but this does not affect our ability to use the distribution of the module now.

```bash
$ cat . /build/.packages/f/f/foo/latest/4e0143c97b65425b855ad5fd03038b6a/modules/foo/foo.mpp.meta-info
{"_VENDOR_extension":{"xmake":{"name": "foo", "file": "foo.mpp"}}, "definitions":{}, "include_paths":{}}
```

The full example project is available at: [C++ Modules package distribution example project](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules/packages)

### Support for C++23 Std Modules

[Arthapz](https://github.com/Arthapz) has also helped to improve support for C++23 Std Modules.

It is currently supported by three compilers in progress.

#### Msvc

The latest Visual Studio 17.5 preview already supports it, and the non-standard ifc std modules will be deprecated.

For the standard C++23 std modules, this is how we introduced them.

```c
import std;
```

Whereas for ifc std modules, we need to write it like this.

```
import std.core;
```

This is not a C++23 standard, it is only provided by msvc, it is not compatible with other compilers and will be deprecated in new versions of msvc.
Therefore the new version of Xmake will only support C++23 std modules and not the deprecated ifc std modules.

#### Clang

It seems that the latest clang does not yet fully support C++23 std modules either, and is still in draft patch status, [#D135507](https://reviews.llvm.org/D135507).

However, Xmake does support it, so if you want to try it out, you can merge in the patch and test it with xmake.

There is also experimental support for non-standard std modules in lower versions of clang.

It is still possible to experiment with xmake to build std modules in lower versions of clang, even though it is probably still a toy (and will encounter many problems).

For a discussion see: [#3255](https://github.com/xmake-io/xmake/pull/3255)

#### Gcc

It is not currently supported.

### Xrepo auto-completion support

Previously, we only supported the incomplete xmake command. In this new version, we also support the incomplete `xrepo install` command, which
This will automatically search the [xmake-repo](https://github.com/xmake-io/xmake-repo) repository for packages to incomplete our install command.

Many thanks to @glcraft for this contribution.

```bash
$ xrepo install libp
libpaper libpfm libpng libpqxx libpthread-stubs
libpcap libplist libpq libpsl
```

## Changelog

### New features

* [#3228](https://github.com/xmake-io/xmake/pull/3228): Add support of importing modules from packages
* [#3257](https://github.com/xmake-io/xmake/issues/3257): Add support for iverilog and verilator
* Support for xp and vc6.0
* [#3214](https://github.com/xmake-io/xmake/pull/3214): Completion on xrepo install packages

### Changes

* [#3255](https://github.com/xmake-io/xmake/pull/3225): Improve clang libc++ module support
* Support for compiling xmake using mingw
* Improve compatibility issues with xmake running on win xp
* Add pure lua json implementation instead of lua-cjson if the external dependencies are enabled

### Bugs fixed

* [#3229](https://github.com/xmake-io/xmake/issues/3229): Fix find rc.exe for vs2015
* [#3271](https://github.com/xmake-io/xmake/issues/3271): Fix macro defines with spaces
* [#3273](https://github.com/xmake-io/xmake/issues/3273): Fix nim link error
* [#3286](https://github.com/xmake-io/xmake/issues/3286): Fix compile_commands for clangd
