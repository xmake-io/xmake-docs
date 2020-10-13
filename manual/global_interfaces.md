
The global interface affects the whole project description scope and all sub-project files.

| Interfaces                            | Description                           | Version  |
| ------------------------------------- | ------------------------------------- | -------- |
| [includes](#includes)                 | Add sub-project files and directories | >= 2.1.5 |
| [set_modes](#set_modes)               | Set project compilation modes         | >= 2.1.2 |
| [set_project](#set_project)           | Set project name                      | >= 2.0.1 |
| [set_version](#set_version)           | Set project version                   | >= 2.0.1 |
| [set_xmakever](#set_xmakever)         | Set minimal xmake version             | >= 2.1.1 |
| [add_moduledirs](#add_moduledirs)     | Add module directories                | >= 2.1.5 |
| [add_plugindirs](#add_plugindirs)     | Add plugin directories                | >= 2.0.1 |
| [add_packagedirs](#add_packagedirs)   | Add package directories               | >= 2.0.1 |
| [get_config](#get_config)             | Get the configuration value           | >= 2.2.2 |
| [set_config](#set_config)             | Set the default configuration value   | >= 2.2.2 |
| [add_requires](#add_requires)         | Add required package dependencies     | >= 2.2.2 |
| [add_repositories](#add_repositories) | Add 3rd package repositories          | >= 2.2.2 |

### includes

#### Add sub-project files and directories

We can use this interfaces to add sub-project files (xmake.lua) or directories with xmake.lua.

```
projectdir
  - subdirs
    - xmake.lua
  - src
```

Add sub-project directories.

```lua
includes("subdirs")

target("test")
    set_kind("binary")
    add_files("src/*.c")
```

Or add sub-project files.

```lua
includes("subdirs/xmake.lua")

target("test")
    set_kind("binary")
    add_files("src/*.c")
```

We can also recursively add multiple project sub-directory files through pattern matching.

```lua
includes("**/xmake.lua")

target("test")
    set_kind("binary")
    add_files("src/*.c")
```

In addition, in 2.2.5 and later, this interface provides some built-in helper functions, which can be used directly after the include, specifically which built-in functions can be seen at: https://github.com/xmake-io/xmake/tree/master/xmake/includes

For a more complete description of this, see: [https://github.com/xmake-io/xmake/issues/342](https://github.com/xmake-io/xmake/issues/342 )

Examples:

Check links, ctype, includes and features and write macro definitions to the config.h file.

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

### set_modes

#### Set project compilation modes

This is an optional api, just to make it easy for plugins to get mode configuration information.

```lua
set_modes("debug", "release")
```

If you set this configuration, you need not set them manually when generating vs201x project.

```bash
$ xmake project -k vs2017
```

Otherwise, you need to run:

```bash
$ xmake project -k vs2017 -m "debug,release"
```

<p class="tip">
If you do not set this configuration, [is_mode](#is_mode) can also be used normally.
</p>

### set_project

#### Set project name

Set the whole project name, we can set it at the beginning of `xmake.lua`.

```lua
-- set project name
set_project("tbox")

-- set project version
set_version("1.5.1")
```

### set_version

#### Set project version

Set the whole project version, we can set it at the beginning of `xmake.lua`.

```lua
set_version("1.5.1")
```

We can set build version in v2.1.7 version:

```lua
set_version("1.5.1", {build = "%Y%m%d%H%M"})
```

We can also add version to the config header files, @see [add_configfiles](/manual/project_target?id=add-template-configuration-files)

### set_xmakever

#### Set minimal xmake version

If the current xmake version less than the required version, it will prompt an error.

```lua
-- the current xmake version must be larger than 2.1.0
set_xmakever("2.1.0")
```

### add_moduledirs

#### Add module directories

The builtin modules are placed in the 'xmake/modules' directory, but for user-defined modules for a specific project, you can configure additional module directories in the 'xmake.lua` file.

```lua
add_moduledirs("$(projectdir)/modules")
```
xmake will load the given module in the given directory when calling `import`.

### add_plugindirs

#### Add plugin directories

The builtin plugins are placed in the 'xmake/plugins' directory, but for user-defined plugins for a specific project, you can configure additional plugin directories in the 'xmake.lua` file.

```lua
add_plugindirs("$(projectdir)/plugins")
```
xmake will load all plugins in the given directory.

### add_packagedirs

#### Add package directories

By setting up a dependency package directory, you can easily integrate some third-party dependent libraries.
Taking the tbox project as an example, its package directory is as follows:


```
tbox.pkg
- base.pkg
- zlib.pkg
- polarssl.pkg
- openssl.pkg
- mysql.pkg
- pcre.pkg
- ...
```

If you want the current project to load these packages, first specify the package directory path, for example:

```lua
add_packagedirs("pkg")
```

Then, please add these packages to the given target by [add_packages](#add_packages):

```lua
target("tbox")
    add_packages("zlib", "polarssl", "pcre", "mysql")
```

xmake will check these packages automatically and link with them if they exist, and we can disable them manually.

```bash
$ xmake f --openssl=n
```

### get_config

#### Get the configuration value

This interface is introduced from version 2.2.2 to get the configuration value from the given name.

```lua
if get_config("myconfig") == "xxx" then
    add_defines("HELLO")
end
```

### set_config

#### Set the default configuration value

This interface is introduced from version 2.2.2 to set the default configuration value in xmake.lua.

Many previous configurations, including the build toolchain, build directory, etc.
We can only be configured by `$xmake f --name=value`. If we want to write a default value in xmake.lua, we can use the following method:

```lua
set_config("name", "value")
set_config("buildir", "other/buildir")
set_config("cc", "gcc")
set_config("ld", "g++")
```

However, we can still modify the default configuration in xmake.lua by `$xmake f --name=value`.

### add_requires

#### Add package dependencies

Xmake's dependency package management fully supports semantic version selection, for example: "~1.6.1". For a detailed description of semantic versioning, see: [https://semver.org/](https://semver.org/)

Some examples:

```lua
add_requires("tbox 1.6.*", "pcre 1.3.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

The semantic version parser currently used by xmake is the [sv](https://github.com/uael/sv) library contributed by [uael](https://github.com/uael), which also has a description of the version. For detailed instructions, please refer to the following: [Version Description](https://github.com/uael/sv#versions)

Of course, if we have no special requirements for the version of the dependency package, we can omit the version:

```lua
add_requires("tbox", "libpng", "zlib")
```

This will use the latest known version of the package, or the source code compiled from the master branch. If the current package has a git repository address we can also specify a specific branch version:

```lua
add_requires("tbox master")
add_requires("tbox dev")
```

If the specified dependency package is not supported by the current platform, or if the compilation and installation fails, then xmake will exit with an error, which is reasonable for some projects that must rely on certain packages to work.
However, if some packages are optional dependencies, they can be set to optional packages even if they are not compiled properly.

```lua
add_requires("tbox", {optional = true})
```

With the default settings, xmake will first check to see if the system library exists (if no version is required). If the user does not want to use the system library and the library is provided by a third-party package manager, then you can set:

```lua
add_requires("tbox", {system = false})
```

If we want to debug the dependencies at the same time, we can set them to use the debug version of the package (provided that this package supports debug compilation):

```lua
add_requires("tbox", {debug = true})
```

If the current package does not support debug compilation, you can submit the modified compilation rules in the repository to support the debug, for example:

```lua
package("openssl")
    on_install("linux", "macosx", function (package)
        os.vrun("./config %s --prefix=\"%s\"", package:debug() and "--debug" or "", package:installdir())
        os.vrun("make -j4")
        os.vrun("make install")
    end)
```

Some packages have various compile options at compile time, and we can pass them in. Of course, the package itself supports:

```lua
add_requires("tbox", {config = {small=true}})
```

Pass `--small=true` to the tbox package so that compiling the installed tbox package is enabled.
After v2.2.3, you can control whether you need to add a dependency package in your own definition configuration option parameter by [option](#option) and [has_config](#has_config):

```lua
option("luajit")
    set_default(false)
    set_showmenu(true)
    set_category("option")
    set_description("Enable the luajit runtime engine.")
option_end()

if has_config("luajit") then
    add_requires("luajit")
else
    add_requires("lua")
end
```

We can switch dependencies by `$xmake f --luajit=y`.

And we also added the group parameter to group the dependencies, all the dependencies under the same group, only one can be enabled, the order of the dependencies is the same as the order in which they were added by `add_requires`:

```lua
add_requires("openssl", {group = "ssl", optional = true})
add_requires("mbedtls", {group = "ssl", optional = true})

target("test")
    add_packages("openssl", "mbedtls")
```

After version 2.2.5, xmake supports third-party package managers, such as: conan, brew, vcpkg, etc.

Add a homebrew dependency package:

```lua
add_requires("brew::zlib", {alias = "zlib"}})
add_requires("brew::pcre2/libpcre2-8", {alias = "pcre2"}})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("pcre2", "zlib")
```

Add a dependency package for vcpkg:

```lua
add_requires("vcpkg::zlib", "vcpkg::pcre2")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("vcpkg::zlib", "vcpkg::pcre2")
```

Add a conan dependency package:

```lua
add_requires("CONAN::zlib/1.2.11@conan/stable", {alias = "zlib", debug = true})
add_requires("CONAN::OpenSSL/1.0.2n@conan/stable", {alias = "openssl",
    configs = {options = "OpenSSL:shared=True"}})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("openssl", "zlib")
```

After executing xmake to compile:

```console
ruki:test_package ruki$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.14
note: try installing these packages (pass -y to skip confirm)?
  -> CONAN::zlib/1.2.11@conan/stable  (debug)
  -> CONAN::OpenSSL/1.0.2n@conan/stable
please input: y (y/n)

  => installing CONAN::zlib/1.2.11@conan/stable .. ok
  => installing CONAN::OpenSSL/1.0.2n@conan/stable .. ok

[  0%]: ccache compiling.release src/main.c
[100%]: linking.release test
```

We can see https://github.com/xmake-io/xmake/issues/339 to know more details.

Add a clib dependency package:

Clib is a source-based dependency package manager. The dependent package is downloaded directly to the corresponding library source code, integrated into the project to compile, rather than binary library dependencies.

It is also very convenient to integrate in xmake. The only thing to note is that you need to add the source code of the corresponding library to xmake.lua, for example:

```lua
add_requires("clib::clibs/bytes@0.0.4", {alias = "bytes"})

target("xmake-test")
    set_kind("binary")
    add_files("clib/bytes/*.c")
    add_files("src/*.c")
    add_packages("bytes")
```

### add_repositories

#### Add 3rd package repositories

If the required package is not in the official repository [xmake-repo](https://github.com/xmake-io/xmake-repo), we can submit the contribution code to the repository for support.
But if some packages are only for personal or private projects, we can create a private repository repo. The repository organization structure can be found at: [xmake-repo](https://github.com/xmake-io/xmake-repo)

For example, now we have a private repository repo:`git@github.com:myrepo/xmake-repo.git`

We can add through this interface:

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git")
```

If we just want to add one or two private packages, this time to build a git repository is too big, we can directly put the package repository into the project, for example:

```
projectdir
  - myrepo
    - packages
      - t/tbox/xmake.lua
      - z/zlib/xmake.lua
  - src
    - main.c
  - xmake.lua
```

The above myrepo directory is your own private package repository, built into your own project, and then add this repository location in xmake.lua:

```lua
add_repositories("my-repo myrepo")
```

This can be referred to [benchbox](https://github.com/tboox/benchbox) project, which has a built-in private repository.
