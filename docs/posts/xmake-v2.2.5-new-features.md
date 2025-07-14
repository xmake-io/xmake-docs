---
title: Introduction of xmake v2.2.5 new features
tags: [xmake, lua, C/C++, package, conan, homebrew, vcpkg]
date: 2019-04-01
author: Ruki
---

This version took more than four months to refactor and improve the package dependency management. 
The official repository added common packages such as mysql and ffmpeg, and added a lot of features.

* [Github](https://github.com/xmake-io/xmake)
* [Documents](https://xmake.io)

## Builtin package manager 

```lua
add_requires("libuv master", "ffmpeg", "zlib 1.20.*")`
```

xmake will find and install packages from the official package repository ([xmake-repo](https://github.com/xmake-io/xmake-repo)). 

## Support third-party package manager

xmake adds built-in support for third-party package managers, explicitly specifying packages in other package managers through package namespaces, 
and it currently supports `conan::`, `brew::` and `vcpkg::` packages.

#### Install packages from homebrew/linuxbrew

```lua
add_requires("brew::zlib", {alias = "zlib"}})
add_requires("brew::pcre2/libpcre2-8", {alias = "pcre2"}})

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("pcre2", "zlib")
```

#### Install packages from vcpkg

```lua
add_requires("vcpkg::zlib", "vcpkg::pcre2")

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("vcpkg::zlib", "vcpkg::pcre2")
```

#### Install packages from conan

The new version implements the conan generator to integrate the package information in the conan. 
It is also very convenient to use in xmake, and can pass all the configuration parameters of the conan package.

```lua
add_requires("conan::zlib/1.2.11@conan/stable", {alias = "zlib", debug = true})
add_requires("conan::OpenSSL/1.0.2n@conan/stable", {alias = "openssl", configs = {options = "OpenSSL:shared=True"}})

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("openssl", "zlib")
```

After executing xmake to compile:

```bash
ruki:test_package ruki$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.14
note: try installing these packages (pass -y to skip confirm)?
  -> conan::zlib/1.2.11@conan/stable  (debug)
  -> conan::OpenSSL/1.0.2n@conan/stable  
please input: y (y/n)

  => installing conan::zlib/1.2.11@conan/stable .. ok
  => installing conan::OpenSSL/1.0.2n@conan/stable .. ok

[  0%]: ccache compiling.release src/main.c
[100%]: linking.release test
```





## Built-in dependency package lookup support

The previous version provided `lib.detect.find_package` to look up the dependent library, but this needs to be imported before it can be used, and only one package can be found at a time, which is cumbersome:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load(function (target)
        import("lib.detect.find_package")
        target:add(find_package("openssl"))
        target:add(find_package("zlib"))
    end)
```

The new version of the `find_packages` interface, the `lib.detect.find_package` is further encapsulated to improve ease of use:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load(function (target)
        target:add(find_packages("openssl", "zlib"))
    end)
```

It also supports searching from a specified third-party package manager:

```lua
find_packages("conan::OpenSSL/1.0.2n@conan/stable", "brew::zlib")
```

## Install packages with parameter configuration

The new version has a large-scale refactoring and upgrade of the built-in package management, and has better support for the parameter configurable compilation and installation dependencies. 
We can define some compilation and installation configuration parameters in the package repository to customize the installation package.

For example, let's take the pcre2 package as an example:

```lua

package("pcre2")

    set_homepage("https://www.pcre.org/")
    set_description("A Perl Compatible Regular Expressions Library")

    set_urls("https://ftp.pcre.org/pub/pcre/pcre2-$(version).zip",
             "ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre2-$(version).zip")

    add_versions("10.23", "6301a525a8a7e63a5fac0c2fbfa0374d3eb133e511d886771e097e427707094a")
    add_versions("10.30", "3677ce17854fffa68fce6b66442858f48f0de1f537f18439e4bd2771f8b4c7fb")
    add_versions("10.31", "b4b40695a5347a770407d492c1749e35ba3970ca03fe83eb2c35d44343a5a444")

    add_configs("shared", {description = "Enable shared library.", default = false, type = "boolean"})
    add_configs("jit", {description = "Enable jit.", default = true, type = "boolean"})
    add_configs("bitwidth", {description = "Set the code unit width.", default = "8", values = {"8", "16", "32"}})
```

In the above, we define three conditional configuration parameters through `add_configs`, so that when the user uses the pcre2 library, you can customize whether you need to enable the jit version, bit width version, etc., for example:

```lua
add_requires("pcre2", {configs = {jit = true, bitwidth = 8}})
```

Moreover, the configuration parameters are strongly constrained. If the value passed is incorrect, an error will be reported to avoid passing invalid parameters. 
As with the bitwidth parameter configuration, it can only be restricted to `values = {"8", "16". "32"}` inside takes the value.

So, how do users know which configuration parameters are currently supported by our package? It's very simple. We can quickly view all the information of the pcre2 package by using the following command:

```bash
$ xmake require --info pcre2
```

The output is as follows:

```
The package info of project:
    require(pcre2): 
      -> description: A Perl Compatible Regular Expressions Library
      -> version: 10.31
      -> urls:
         -> https://ftp.pcre.org/pub/pcre/pcre2-10.31.zip
            -> b4b40695a5347a770407d492c1749e35ba3970ca03fe83eb2c35d44343a5a444
         -> ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre2-10.31.zip
            -> b4b40695a5347a770407d492c1749e35ba3970ca03fe83eb2c35d44343a5a444
      -> repo: local-repo /Users/ruki/projects/personal/xmake-repo/ 
      -> cachedir: /Users/ruki/.xmake/cache/packages/p/pcre2/10.31
      -> installdir: /Users/ruki/.xmake/packages/p/pcre2/10.31/23b52ca1c6c8634f5f935903c9e7ea0e
      -> fetchinfo: 10.31, system, optional
          -> linkdirs: /usr/local/Cellar/pcre2/10.32/lib
          -> defines: PCRE2_CODE_UNIT_WIDTH=8
          -> links: pcre2-8
          -> version: 10.32
          -> includedirs: /usr/local/Cellar/pcre2/10.32/include
      -> platforms: linux, macosx
      -> requires:
         -> plat: macosx
         -> arch: x86_64
         -> configs:
            -> vs_runtime: MT
            -> shared: false
            -> jit: true
            -> bitwidth: 8
            -> debug: false
      -> configs:
         -> shared: Enable shared library. (default: false)
         -> jit: Enable jit. (default: true)
         -> bitwidth: Set the code unit width. (default: 8)
            -> values: {"8","16","32"}
      -> configs (builtin):
         -> debug: Enable debug symbols. (default: false)
         -> cflags: Set the C compiler flags.
         -> cxflags: Set the C/C++ compiler flags.
         -> cxxflags: Set the C++ compiler flags.
         -> asflags: Set the assembler flags.
         -> vs_runtime: Set vs compiler runtime. (default: MT)
            -> values: {"MT","MD"}
```

Among them, the `configs:` part inside is the parameter description and value range that can be provided at present, and `configs (builtin):` is some built-in configuration parameters of xmake, and the user can also directly configure and use.

For example, the most commonly used debug mode package:

```lua
add_requires("pcre2", {configs = {debug = true}})
```

Since this is too common, xmake provides more convenient configuration support:

```lua
add_requires("pcre2", {debug = true})
```

In addition, the content of `requires:` is the configuration state of the current dependent package, which is convenient for the user to view which mode package is currently used.

## Preprocessing template configuration file

xmake provides three new interface APIs for adding pre-compiled configuration files before compiling instead of [set_config_header](/zh/manual#set-config-header).

- `add_configfiles`
- `set_configdir`
- `set_configvar`

Among them `add_configfiles` is equivalent to the `configure_file` interface in cmake, xmake refers to its api design, and has extended support on it to provide more flexibility.

This interface is more general than the previous `set_config_header`, not only for automatic generation and preprocessing of config.h, but also for various file types, while `set_config_header` is only used for processing header files and does not support templates. Variable substitution.

Let's start with a simple example:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_configdir("$(buildir)/config")
    add_configfiles("src/config.h.in")
```

The above settings will automatically configure the `config.h.in` header file template before compiling. 
After preprocessing, it will generate the output to the specified `build/config/config.h`.

One of the most important features of this interface is that it can be preprocessed and replaced with some of the template variables in the preprocessing, for example:

config.h.in

```
#define VAR1 "${VAR1}"
#define VAR2 "${VAR2}"
#define HELLO "${HELLO}"
```

```lua
set_configvar("VAR1", "1")

target("test")
    set_kind("binary")
    add_files("main.c")

    set_configvar("VAR2", 2)
    add_configfiles("config.h.in", {variables = {hello = "xmake"}})
    add_configfiles("*.man", {copyonly = true})
```

Set the template variable via the [set_configvar](/zh/manual#set-configvar) interface, wrapped in a variable set in `{variables = {xxx = ""}}` .

The preprocessed file `config.h` is:

```
#define VAR1 "1"
#define VAR2 "2"
#define HELLO "xmake"
```

The `{copyonly = true}` setting will force `*.man` to be treated as a normal file, copying files only during the preprocessing stage, and not replacing variables.

The default template variable matching mode is `${var}`, of course we can also set other matching modes, for example, to `@var@` matching rules:

```lua
target("test")
    add_configfiles("config.h.in", {pattern = "@(.-)@"})
```

We also have some built-in variables that can be replaced with default variables even if they are not set through this interface:

```
${VERSION} -> 1.6.3
${VERSION_MAJOR} -> 1
${VERSION_MINOR} -> 6
${VERSION_ALTER} -> 3
${VERSION_BUILD} -> set_version("1.6.3", {build = "%Y%m%d%H%M"}) -> 201902031421
${PLAT} and ${plat} -> MACOS and macosx
${ARCH} and ${arch} -> ARM and arm
${MODE} and ${mode} -> DEBUG/RELEASE and debug/release
${DEBUG} and ${debug} -> 1 or 0
${OS} and ${os} -> IOS or ios
```

For example:

config.h.in

```c
#define CONFIG_VERSION "${VERSION}"
#define CONFIG_VERSION_MAJOR ${VERSION_MAJOR}
#define CONFIG_VERSION_MINOR ${VERSION_MINOR}
#define CONFIG_VERSION_ALTER ${VERSION_ALTER}
#define CONFIG_VERSION_BUILD ${VERSION_BUILD}
```

config.h

```c
#define CONFIG_VERSION "1.6.3"
#define CONFIG_VERSION_MAJOR 1
#define CONFIG_VERSION_MINOR 6
#define CONFIG_VERSION_ALTER 3
#define CONFIG_VERSION_BUILD 201902031401
```

We can also perform some variable state control processing on the `#define` definition:

config.h.in 

```c
${define FOO_ENABLE}
```

```lua
set_configvar("FOO_ENABLE", 1) -- or pass true
set_configvar("FOO_STRING", "foo")
```

After setting the above variable, `${define xxx}` will be replaced with:

```c
#define FOO_ENABLE 1
#define FOO_STRING "foo"
```

Or (when set to 0 disable)

```c
/* #undef FOO_ENABLE */
/* #undef FOO_STRING */
```

This method is very useful for some automatic detection generation config.h, such as with the option to do automatic detection:

```lua
option("foo")
    set_default(true)
    set_description("Enable Foo")
    set_configvar("FOO_ENABLE", 1) -- or pass true to enable the FOO_ENABLE variable
    set_configvar("FOO_STRING", "foo")

target("test")
    add_configfiles("config.h.in")

    -- If the foo option is enabled -> Add FOO_ENABLE and FOO_STRING definitions
    add_options("foo") 
```

config.h.in

```c
${define FOO_ENABLE}
${define FOO_STRING}
```

config.h

```c
#define FOO_ENABLE 1
#define FOO_STRING "foo"
```

Regarding the option option detection, and the automatic generation of config.h, there are some helper functions, you can look at it: https://github.com/xmake-io/xmake/issues/342

In addition to `#define`, if you want to do state switching for other non-#define xxx`s, you can use the `${default xxx 0}` mode to set the default value, for example:

```
HAVE_SSE2 equ ${default VAR_HAVE_SSE2 0}
```

After `set_configvar("HAVE_SSE2", 1)` is enabled, it becomes `HAVE_SSE2 equ 1`. If no variable is set, the default value is used: `HAVE_SSE2 equ 0`

For a detailed description of this, see: [https://github.com/xmake-io/xmake/issues/320](https://github.com/xmake-io/xmake/issues/320)

## More convenient feature detection

We can use `add_configfiles` with option detection to detect whether some header files, interface functions, types, and compiler features exist. If they exist, they are automatically written to config.h, for example:

```lua
option("foo")
    set_default(true)
    set_description("Has pthread library")
    add_cincludes("pthread.h")
    add_cfuncs("pthread_create")
    add_links("pthread")
    set_configvar("HAS_PTHREAD", 1) 

target("test")
    add_configfiles("config.h.in")
    add_options("pthread") 
```

config.h.in

```c
${define HAS_PTHREAD}
```

config.h

```c
#define HAS_PTHREAD 1
```

In the above configuration, we check whether the interface in pthread.h and the link library exist by option. If the pthread library can be used normally, then `HAS_PTHREAD` is automatically defined in config.h, and related links are added to the test target.

The above option can support a variety of detection, but the configuration is a bit more complicated and cumbersome, in order to make xmake.lua more simple and intuitive, 
for some common detection, we improved [includes](/zh/manual#includes) interface to provide some built-in packaged auxiliary interface functions to quickly implement the above option detection and write config.h.

The above code can be simplified to:

```lua
includes("check_cfuncs.lua")
target("test")
    add_configfiles("config.h.in")
    configvar_check_cfuncs("HAS_PTHREAD", "pthread_create", {includes = "pthread.h", links = "pthread"})
```

In addition to `configvar_check_cfuncs`, we also have the `check_cfuncs` function. Only the test results are appended directly at compile time and are no longer written to the configfiles file.

Let us look at a comprehensive example:

```lua
includes("check_links.lua")
includes("check_ctypes.lua")
includes("check_cfuncs.lua")
includes("check_features.lua")
includes("check_csnippets.lua")
includes("check_cincludes.lua")

target("test")
    set_kind("binary")
    add_files("*.c")
    add_configfiles("config.h.in")

    configvar_check_ctypes("HAS_WCHAR", "wchar_t")
    configvar_check_cincludes("HAS_STRING_H", "string.h")
    configvar_check_cincludes("HAS_STRING_AND_STDIO_H", {"string.h", "stdio.h"})
    configvar_check_ctypes("HAS_WCHAR_AND_FLOAT", {"wchar_t", "float"})
    configvar_check_links("HAS_PTHREAD", {"pthread", "m", "dl"})
    configvar_check_csnippets("HAS_STATIC_ASSERT", "_Static_assert(1, \"\");")
    configvar_check_cfuncs("HAS_SETJMP", "setjmp", {includes = {"signal.h", "setjmp.h"}})
    configvar_check_features("HAS_CONSTEXPR", "cxx_constexpr")
    configvar_check_features("HAS_CONSEXPR_AND_STATIC_ASSERT", {"cxx_constexpr", "c_static_assert"}, {languages = "c++11"})
```

config.h.in

```c
${define HAS_STRING_H}
${define HAS_STRING_AND_STDIO_H}
${define HAS_WCHAR}
${define HAS_WCHAR_AND_FLOAT}
${define HAS_PTHREAD}
${define HAS_STATIC_ASSERT}
${define HAS_SETJMP}
${define HAS_CONSTEXPR}
${define HAS_CONSEXPR_AND_STATIC_ASSERT}
```

config.h

```c
/* #undef HAS_STRING_H */
#define HAS_STRING_AND_STDIO_H 1
/* #undef HAS_WCHAR */
/* #undef HAS_WCHAR_AND_FLOAT */
#define HAS_PTHREAD 1
#define HAS_STATIC_ASSERT 1
#define HAS_SETJMP 1
/* #undef HAS_CONSTEXPR */
#define HAS_CONSEXPR_AND_STATIC_ASSERT 1
```

As you can see, xmake also provides other helper functions for detecting: c/c++ types, c/c++ code snippets, c/c++ function interfaces, link libraries, header files, and even c/c++ compiler features. Support strength, etc.

For a more complete description of this, you can read: [https://github.com/xmake-io/xmake/issues/342](https://github.com/xmake-io/xmake/issues/342)

## Configuring a custom installation file

For the `xmake install/uninstall` command, xmake adds the `add_installfiles` interface to set up some installation files. Compared to `on_install`, this interface is more convenient and simple to use, and basically meets most installation requirements.

For example, we can specify to install various types of files to the installation directory:

```lua
target("test")
    add_installfiles("src/*.h")
    add_installfiles("doc/*.md")
```

By default on Linux and other systems, we will install to `/usr/local/*.h, /usr/local/*.md`, but we can also specify to install to a specific subdirectory:

```lua
target("test")
    add_installfiles("src/*.h", {prefixdir = "include"})
    add_installfiles("doc/*.md", {prefixdir = "share/doc"})
```

The above settings, we will install to `/usr/local/include/*.h, /usr/local/share/doc/*.md`

We can also install by subdirectory in the source file by `()`, for example:

```lua
target("test")
    add_installfiles("src/(tbox/*.h)", {prefixdir = "include"})
    add_installfiles("doc/(tbox/*.md)", {prefixdir = "share/doc"})
```

We extract the `tbox/*.h` subdirectory structure from the files in `src/tbox/*.h` and install it: `/usr/local/include/tbox/*.h, /usr/local /share/doc/tbox/*.md`

Of course, users can also use the [set_installdir](/zh/manual#set-installdir) interface.

For a detailed description of this interface, see: [#318](https://github.com/xmake-io/xmake/issues/318)

## Export CMakelists.txt file

The new version extends the `xmake project` project generation plugin and adds export support for the CMakelists.txt file. Users who are comfortable with xmake can quickly export CMakelists.txt to cmake.
And some tools that support cmake, such as CLion, are used as follows:

```bash
$ xmake project -k cmakelists
```

The corresponding CMakelists.txt file can be generated in the current project directory.

## More new feature improvements

Please see: [https://github.com/xmake-io/xmake/releases/tag/v2.2.5](https://github.com/xmake-io/xmake/releases/tag/v2.2.5)