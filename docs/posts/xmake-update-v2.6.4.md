---
title: Xmake v2.6.4 released, Improve a lot of package management features
tags: [xmake, lua, C/C++, Vcpkg]
date: 2022-03-07
author: Ruki
---
## Introduction of new features

### More flexible package extensions

Now, we can inherit all the configuration of an existing package through the `set_base` interface, and then rewrite part of the configuration on this basis.

This is usually in the user's own project, it is more useful to modify the built-in package of the official repository of [xmake-repo](https://github.com/xmake-io/xmake-repo), such as: repairing and changing urls, modifying the version list, Install logic and more.

For example, modify the url of the built-in zlib package to switch to your own zlib source address.

```lua
package("myzlib")
    set_base("zlib")
    set_urls("https://github.com/madler/zlib.git")
package_end()

add_requires("myzlib", {system = false, alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

We can also use it to simply add an alias package.

```lua
package("onetbb")
    set_base("tbb")
```

We can install the tbb package through `add_requires("onetbb")` integration, but the package name is different.

### Package management supports toolchain switching

Previously, we limited the toolchains that can only be installed under the cross platform to switch packages. In the new version, we can support the switchover of toolchains under more platforms.

E.g:

```bash
$ xrepo install --toolchains=clang zlib
```

We can quickly switch to the clang toolchain to compile and install the zlib library on platforms such as linux.

We can also switch them in the xmake.lua configuration file.

```lua
add_requires("zlib", {configs = {toolchains = "gcc-11"}})
```

The zlib packages installed by different tool chains will be stored in different directories without interfering with each other, and there will be no link compatibility problems caused by compiler differences.






### Built-in package virtual environment

The Xrepo command has already well supported package virtual environment management, `xrepo env shell`, but for complex package environments, users still need to configure an xmake.lua file to manage their own package environment.

For example, we need a common development environment shell with common development toolchains such as cmake, python and vs/autoconf by default, and we need to create a configuration file devel.lua by ourselves.

```lua
add_requires("cmake")
add_requires("python")
if is_host("linux", "bsd", "macosx") then
    add_requires("pkg-config", "autoconf", "automake", "libtool")
elseif is_host("windows") then
    set_toolchains("msvc")
end
```

Then, execute the following command to import into the global configuration.

```bash
$ xrepo env --add devel.lua
```

In this way, we can load the shell and bind this environment with the following command:

```bash
$ xrepo env -b devel shell
> cmake --version
cmake version 3.19.3
```

In the new version, we have built in some commonly used environments, which can be viewed through `xrepo env -l`:

```bash
$ xrepo env -l
  - msvc
  - llvm-mingw
  - llvm
  - mingw-w64
  -devel
  - python3
  - depot_tools
  - python2
```

Among them, devel is also in it, so we only need to execute `xrepo env -b devel shell` to bring up a devel development environment without configuring them yourself.

Such as python, msvc, etc. are also some of the more commonly used environments, which can be used directly.

Of course, we also support temporarily creating an xmake.lua locally to configure the loading package environment instead of placing it in the global configuration.

### Custom installation package download

We can customize the download logic of the package through the new `on_download` interface, which is usually not used, and it is enough to use Xmake's built-in download.

If the user builds a private repository and has a more complex authentication mechanism and special processing logic for the download of the package, the internal download logic can be rewritten to achieve this.

```lua
on_download(function (package, opt)
    -- download packages:urls() to opt.sourcedir
end)
```

In the opt parameter, you can get the destination source directory `opt.sourcedir` of the downloaded package. We only need to get the package address from `package:urls()` and download it.

Then, add some custom processing logic as needed. In addition, you can add download cache processing and so on.

### ASN.1 Program Build Support

ASN.1 programs need to use [ASN.1 Compiler](https://github.com/vlm/asn1c) to generate relevant .c files to participate in project compilation.

While Xmake provides built-in `add_rules("asn1c")` rules to process `.c` file generation, `add_requires("asn1c")` automatically pulls and integrates ASN.1 compiler tools.

Here is a basic configuration example:

```lua
add_rules("mode.debug", "mode.release")
add_requires("asn1c")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_files("src/*.asn1")
    add_rules("asn1c")
    add_packages("asn1c")
```

For details, see [Complete Example Project](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/asn1c).

### Support for building Swift programs on all platforms

Previously, Xmake only supported the construction of Swift programs under macOS with the help of the Xcode toolchain. In the new version, we have also made improvements to allow the swift toolchain to be used independently, and to support the construction of swift programs on linux/windows. The usage is the same as before.

### Supports export of specified symbol list

In previous versions, we provided `utils.symbols.export_all` for automatic full symbol export of dll libraries for windows.

Although this is very convenient, it can only support windows programs, and the full export does not control the size of the generated dll, and there may be many internal symbols that are not needed at all to be exported.

However, the `utils.symbols.export_list` rule provided by our new version can directly define the list of exported symbols in xmake.lua, for example:

```lua
target("foo")
    set_kind("shared")
    add_files("src/foo.c")
    add_rules("utils.symbols.export_list", {symbols = {
        "add",
        "sub"}})
```

Alternatively, add a list of exported symbols in the `*.export.txt` file.

```lua
target("foo2")
    set_kind("shared")
    add_files("src/foo.c")
    add_files("src/foo.export.txt")
    add_rules("utils.symbols.export_list")
```

For a complete project example, see: [Export Symbol Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/c/shared_library_export_list)

By specifying symbol export, we can make the generated dynamic library as small as possible, and do not export irrelevant internal symbols at all. In addition, this rule supports linux, macOS and windows, which is more general.

Internally it automatically uses .def, version scripts and `--exported_symbols_list` to handle symbol exports.

### Built-in support for linker scripts

In the new version, we also have built-in support for linker scripts and version scripts files, we can use `add_files` to add them directly without configuring `add_ldflags("-Txxx.lds")`.


Currently `.ld` and `.lds` are supported as linker scripts configuration files to add:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    add_deps("foo")
    set_kind("binary")
    add_files("src/main.c")
    add_files("src/main.lds")
```

We also support `.ver`, `.map` suffix files to be added as version script.

```lua
target("foo")
    set_kind("shared")
    add_files("src/foo.c")
    add_files("src/foo.map")
```

The content of the foo.map file is as follows:

```
{
    global:
        foo;

    local:
        *;
};
```

## Changelog

### New features

* [#2011](https://github.com/xmake-io/xmake/issues/2011): Support to inherit base package
* Support to build and run xmake on sparc, alpha, powerpc, s390x and sh4
* Add on_download for package()
* [#2021](https://github.com/xmake-io/xmake/issues/2021): Support Swift for linux and windows
* [#2024](https://github.com/xmake-io/xmake/issues/2024): Add asn1c support
* [#2031](https://github.com/xmake-io/xmake/issues/2031): Support linker scripts and version scripts for add_files
* [#2033](https://github.com/xmake-io/xmake/issues/2033): Catch ctrl-c to get current backtrace for debugging stuck
* [#2059](https://github.com/xmake-io/xmake/pull/2059): Add `xmake update --integrate` to integrate for shell
* [#2070](https://github.com/xmake-io/xmake/issues/2070): Add built-in xrepo environments
* [#2117](https://github.com/xmake-io/xmake/pull/2117): Support to pass toolchains to package for other platforms
* [#2121](https://github.com/xmake-io/xmake/issues/2121): Support to export the given symbols list

### Changes

* [#2036](https://github.com/xmake-io/xmake/issues/2036): Improve xrepo to install packages from configuration file, e.g. `xrepo install xxx.lua`
* [#2039](https://github.com/xmake-io/xmake/issues/2039): Improve filter directory for vs generator
* [#2025](https://github.com/xmake-io/xmake/issues/2025): Support phony and headeronly target for vs generator
* Improve to find vstudio and codesign speed
* [#2077](https://github.com/xmake-io/xmake/issues/2077): Improve vs project generator to support cuda

### Bugs fixed

* [#2005](https://github.com/xmake-io/xmake/issues/2005): Fix path.extension
* [#2008](https://github.com/xmake-io/xmake/issues/2008): Fix windows manifest
* [#2016](https://github.com/xmake-io/xmake/issues/2016): Fix object filename confict for vs project generator
