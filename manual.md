---
search: en
---

## Specification

#### Naming conventions

The interface is named according to some of the predefined specifications, which is more convenient to understand and easy to use.

It's according to the following rules:

| Interfaces            | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| `is_`/`has_` + xxx    | Condition interfaces                                              |
| `set_` + xxx          | Set and override the previous settings                            |
| `add_` + xxx          | Set and append settings                                           |
| `s` + xxx             | Support multi-parameters, .e.g：`add_files("*.c", "test.cpp")`    |
| `on_` + xxx           | Set and override builtin script                                   |
| `before_` + xxx       | Set and run this script before running builtin-script             |
| `after_` + xxx        | Set and run this script after running builtin-script              |
| `scope("name")`       | Define a description scope, .e.g `target("xxx")`, `option("xxx")` |
| scope/settings        | Indentation with spaces                                           |

## Documentation

#### Conditions

Conditions are generally used to handle some special compilation platforms.

| Interfaces                  | Description                               | Support version             |
| -------------------------   | ----------------------------------------  | --------------------------- |
| [is_os](#is_os)             | Is the current compilation target system? | >= 2.0.1                    |
| [is_arch](#is_arch)         | Is the current compilation architecture?  | >= 2.0.1                    |
| [is_plat](#is_plat)         | Is the current compilation platform?      | >= 2.0.1                    |
| [is_host](#is_host)         | Is the current compilation host system?   | >= 2.1.4                    |
| [is_mode](#is_mode)         | Is the current compilation mode?          | >= 2.0.1                    |
| [is_kind](#is_kind)         | Is the current target kind?               | >= 2.0.1                    |
| [is_option](#is_option)     | Is the given options enabled?             | >= 2.0.1 < 2.2.2 deprecated |
| [is_config](#is_config)     | Is the given config values?               | >= 2.2.2                    |
| [has_config](#has_config)   | Is the given configs enabled?             | >= 2.2.2                    |
| [has_package](#has_package) | Is the given dependent package enabled?   | >= 2.2.3                    |

##### is_os

###### Is the current compilation target system

```lua
if is_os("ios") then
    add_files("src/xxx/*.m")
end
```

Support operation systems:

* windows
* linux
* android
* macosx
* ios

##### is_arch

###### Is the current compilation architecture

You can this api to check the configuration command: `xmake f -a armv7`

```lua
-- if the current architecture is x86_64 or i386
if is_arch("x86_64", "i386") then
    add_files("src/xxx/*.c")
end

-- if the current architecture is armv7 or arm64 or armv7s or armv7-a
if is_arch("armv7", "arm64", "armv7s", "armv7-a") then
    -- ...
end
```

And you can also use the wildchard: `*` to check all matched architectures.

```lua
-- if the current architecture is arm which contains armv7, arm64, armv7s and armv7-a ...
if is_arch("arm*") then
    -- ...
end
```

##### is_plat

###### Is the current compilation platform

You can this api to check the configuration command: `xmake f -p iphoneos`

```lua
-- if the current platform is android
if is_plat("android") then
    add_files("src/xxx/*.c")
end

-- if the current platform is macosx or iphoneos
if is_plat("macosx", "iphoneos") then
    add_frameworks("Foundation")
end
```

Support platforms:

* windows
* linux
* macosx
* android
* iphoneos
* watchos

##### is_host

###### Is the current compilation host system

Some compilation platforms can be built on multiple different operating systems, for example: android ndk (on linux, macOS and windows).

So, we can use this api to determine the current host operating system.

```lua
if is_host("windows") then
    add_includes("C:\\includes")
else
    add_includes("/usr/includess")
end
```

Support hosts:

* windows
* linux
* macosx

We can also get it from [$(host)](#var-host) or [os.host](#os-host).

##### is_mode

###### Is the current compilation mode

You can this api to check the configuration command: `xmake f -m debug`

The compilation mode is not builtin mode for xmake, so you can set the mode value by yourself.

We often use these configuration values: `debug`, `release`, `profile`, etc.

```lua
-- if the current compilation mode is debug?
if is_mode("debug") then

    -- add macro: DEBUG
    add_defines("DEBUG")

    -- enable debug symbols
    set_symbols("debug")

    -- disable optimization
    set_optimize("none")

end

-- if the current compilation mode is release or profile?
if is_mode("release", "profile") then

    if is_mode("release") then

        -- mark symbols visibility as hidden
        set_symbols("hidden")

        -- strip all symbols
        set_strip("all")

        -- fomit frame pointer
        add_cxflags("-fomit-frame-pointer")
        add_mxflags("-fomit-frame-pointer")

    else

        -- enable debug symbols
        set_symbols("debug")

    end

    -- add vectorexts
    add_vectorexts("sse2", "sse3", "ssse3", "mmx")
end
```

##### is_kind

###### Is the current target kind

You can this api to check the configuration command: `xmake f -k [static|shared]`

```lua
target("test")

    -- set target kind from the configuration command
    set_kind("$(kind)")
    add_files("src/*c")

    -- compile target for static?
    if is_kind("static") then
        add_files("src/xxx.c")
    end
```

You can switch the target kind by configuration command.

```bash
# compile as static library
$ xmake f -k static
$ xmake
```

```bash
# compile as shared library
$ xmake f -k shared
$ xmake
```

##### is_option

###### Is the given options enabled

<p class="tips">
This interface has been deprecated after v2.2.2, please use [has_config](#has_config) instead.
</p>

You can use this api to check the custom option configuration command：`xmake f --xxxx=y`

For example, we want to enable the custom option: `xmake f --demo=y` and check it from `xmake.lua`.

```lua
if is_option("demo") then
    add_subdirs("src/demo")
end
```

##### is_config

###### Is the given config values?

This interface is introduced from version 2.2.2 to determine whether the specified configuration is a given value.

For example:

```console
$ xmake f --test=hello1
```

```lua
option("test")
    set_showmenu("true")
    set_description("The test config option")
option_end()

if is_config("test", "hello1", "hello2") then
    add_defines("HELLO")
end
```

Not only that, we can also set pattern matching rules to determine values, such as:

```lua
if is_config("test", "hello.*") then
    add_defines("HELLO")
end
```

<p class="tips">
This interface is not only able to determine the custom options defined through the [option](#option),
but also to determine the built-in global and local configuration.
</p>

##### has_config

###### Is the given configs enabled?

This interface is introduced from version 2.2.2 to detect whether a custom or built-in option/configuration exists or is enabled.

For example, the following configuration will be true:

```console
# enable the given config or option (if be boolean type)
$ xmake f --test1=y
$ xmake f --test1=yes
$ xmake f --test1=true

# set the config value
$ xmake f --test2=value
```

```lua
if has_config("test1", "test2") then
    add_defines("TEST")
end
```

And the following configuration will be false:

```console
# disable config/option（if be boolean type）
$ xmake f --test1=n
$ xmake f --test1=no
$ xmake f --test1=false
```

<p class="tips">
This interface can determine not only the built-in global and local configs,
but also the custom options defined through the [option](#option).
</p>

##### has_package

###### Is the given dependent package enabled?

This interface is introduced from version 2.2.3 to detect whether a dependent package exists or is enabled.

It is usually used to [add_requires](#add_requires).

```lua
add_requires("tbox", {optional = true})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox")

    if has_package("tbox") then
        add_defines("HAVE_TBOX")
    end
```

If the remote dependencies are added via the optional add-on package added by `add_requires`, or the current platform does not support the actual installation, then `has_package` will return false.
Indicates that it does not exist, and then does some special processing for other flags definitions and even source file compilation controls.

<p class="tips">
The difference between this interface and [has_config](#has_config) is that [has_config](#has_config) is used for [option](#option) whereas this is used for [add_requires](#add_requires).
</p>

#### Global Interfaces

The global interface affects the whole project description scope and all sub-project files.

| Interfaces                            | Description                           | Version  |
| ------------------------------------- | ------------------------------------- | -------- |
| [includes](#includes)                 | Add sub-project files and directories | >= 2.1.5 |
| [set_modes](#set_modes)               | Set project compilation modes         | >= 2.1.2 |
| [set_project](#set_project)           | Set project name                      | >= 2.0.1 |
| [set_version](#set_version)           | Set project version                   | >= 2.0.1 |
| [set_xmakever](#set_xmakever)         | Set minimal xmake version             | >= 2.1.1 |
| [add_subdirs](#add_subdirs)           | Add sub-project directories           | >= 1.0.1 |
| [add_subfiles](#add_subfiles)         | Add sub-project files                 | >= 1.0.1 |
| [add_moduledirs](#add_moduledirs)     | Add module directories                | >= 2.1.5 |
| [add_plugindirs](#add_plugindirs)     | Add plugin directories                | >= 2.0.1 |
| [add_packagedirs](#add_packagedirs)   | Add package directories               | >= 2.0.1 |
| [get_config](#get_config)             | Get the configuration value           | >= 2.2.2 |
| [set_config](#set_config)             | Set the default configuration value   | >= 2.2.2 |
| [add_requires](#add_requires)         | Add required package dependencies     | >= 2.2.2 |
| [add_repositories](#add_repositories) | Add 3rd package repositories          | >= 2.2.2 |

##### includes

###### Add sub-project files and directories

It is used to replace [add_subdirs](#add_subdirs) and [add_subfiles](#add_subfiles).

In addition, in 2.2.5 and later, this interface provides some built-in helper functions, which can be used directly after the include, specifically which built-in functions can be seen at: https://github.com/xmake-io/xmake/tree/master/xmake/includes

For a more complete description of this, see: [https://github.com/xmake-io/xmake/issues/342](https://github.com/xmake-io/xmake/issues/342 )

##### set_modes

###### Set project compilation modes

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

##### set_project

###### Set project name

Set the whole project name, we can set it at the beginning of `xmake.lua`.

```lua
-- set project name
set_project("tbox")

-- set project version
set_version("1.5.1")
```

##### set_version

###### Set project version

Set the whole project version, we can set it at the beginning of `xmake.lua`.

```lua
set_version("1.5.1")
```

It will add project version info to this file automatically if we call [set_config_header](#targetset_config_header) to set `config.h`.`

For example:

```c
// version
#define TB_CONFIG_VERSION "1.5.1"
#define TB_CONFIG_VERSION_MAJOR 1
#define TB_CONFIG_VERSION_MINOR 5
#define TB_CONFIG_VERSION_ALTER 1
#define TB_CONFIG_VERSION_BUILD 201510220917
```

We can set build version in v2.1.7 version:

```lua
set_version("1.5.1", {build = "%Y%m%d%H%M"})
```

##### set_xmakever

###### Set minimal xmake version

If the current xmake version less than the required version, it will prompt an error.

```lua
-- the current xmake version must be larger than 2.1.0
set_xmakever("2.1.0")
```

##### add_subdirs

###### Add sub-project directories

This interface will add sub-project directories to the current `xmake.lua`, it will load the `xmake.lua` file of the sub-directories.

For example, assume we have the following project directory tree:

```
./tbox
├── src
│   ├── demo
│   │   └── xmake.lua
│   └── tbox
│       └── xmake.lua
└── xmake.lua
````

We can add sub-project `tbox` and `demo` directories to the root `xmake.lua`.

```lua
add_subdirs("src/tbox")
if is_option("demo") then
    add_subdirs("src/demo")
end
```

By default, xmake will compile all targets. If you only want to compile a specific target, you can do:

```bash
# only build `tbox` target
$ xmake build tbox
```

##### add_subfiles

###### Add sub-project files

`add_subfiles` is similar to [add_subdirs](#add_subdirs).

The only difference is that this interface specifies the path to the 'xmake.lua' file directly, rather than a directory.

for example:

```lua
add_subfiles("src/tbox/xmake.lua")
```

##### add_moduledirs

###### Add module directories

The builtin modules are placed in the 'xmake/modules' directory, but for user-defined modules for a specific project, you can configure additional module directories in the 'xmake.lua` file.

```lua
add_moduledirs("$(projectdir)/modules")
```
xmake will load the given module in the given directory when calling `import`.

##### add_plugindirs

###### Add plugin directories

The builtin plugins are placed in the 'xmake/plugins' directory, but for user-defined plugins for a specific project, you can configure additional plugin directories in the 'xmake.lua` file.

```lua
add_plugindirs("$(projectdir)/plugins")
```
xmake will load all plugins in the given directory.

##### add_packagedirs

###### Add package directories

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

##### get_config

###### Get the configuration value

This interface is introduced from version 2.2.2 to get the configuration value from the given name.

```lua
if get_config("myconfig") == "xxx" then
    add_defines("HELLO")
end
```

##### set_config

###### Set the default configuration value

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

##### add_requires

###### Add package dependencies

Xmake's dependency package management fully supports semantic version selection, for example: "~1.6.1". For a detailed description of semantic versioning, see: [http://semver.org/] (http://semver.org/)

Some examples:

```lua
add_requires("tbox 1.6.*", "pcre 1.3.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

The semantic version parser currently used by xmake is the [sv](https://github.com/uael/sv) library contributed by [uael](https://github.com/uael), which also has a description of the version. For detailed instructions, please refer to the following: [Version Description] (https://github.com/uael/sv#versions)

Of course, if we have no special requirements for the version of the dependency package, we can omit the version:

```lua
add_requires("tbox", "libpng", "zlib")
```

This will use the latest known version of the package, or the source code compiled from the master branch. If the current package has a git repo address we can also specify a specific branch version:

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

##### add_repositories

###### Add 3rd package repositories

If the required package is not in the official repository [xmake-repo](https://github.com/xmake-io/xmake-repo), we can submit the contribution code to the repository for support.
But if some packages are only for personal or private projects, we can create a private repository repo. The repository organization structure can be found at: [xmake-repo](https://github.com/xmake-io/xmake-repo)

For example, now we have a private repository repo:`git@github.com:myrepo/xmake-repo.git`

We can add through this interface:

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git")
```

If we just want to add one or two private packages, this time to build a git repo is too big, we can directly put the package repository into the project, for example:

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

#### Project Target

We can use `target("test")` to define a project target named "test", each target generates an executable program, a static library, or a dynamic library.

<p class="tip">
All interfaces of target can be set in the global scope, which affects all sub-targets.
</p>

For example:

```lua
-- affects both test and test2 targets
add_defines("DEBUG")

target("test")
    add_files("*.c")

target("test2")
    add_files("*.c")
```

<p class="tip">
`target()' interface can be repeatedly invoked in different places to set the same target.
</p>

| Interfaces                                      | Description                                            | Support version             |
| ---------------------------------------------   | ------------------------------------------------------ | --------------------------- |
| [target](#target)                               | Define a project target                                | >= 1.0.1                    |
| [target_end](#target_end)                       | End target definition                                  | >= 2.1.1                    |
| [set_kind](#targetset_kind)                     | Set target kind                                        | >= 1.0.1                    |
| [set_strip](#targetset_strip)                   | Strip target symbols                                   | >= 1.0.1                    |
| [set_enabled](#targetset_enabled)               | Enable or disable target                               | >= 2.2.2                    |
| [set_default](#targetset_default)               | Mark as default target                                 | >= 2.1.3                    |
| [set_options](#targetset_options)               | Set configuartion options                              | >= 1.0.1                    |
| [set_symbols](#targetset_symbols)               | Set symbol info                                        | >= 1.0.1                    |
| [set_basename](#targetset_basename)             | Set the base name of target file                       | >= 2.1.2                    |
| [set_filename](#targetset_filename)             | Set the full name of target file                       | >= 2.1.2                    |
| [set_warnings](#targetset_warnings)             | Set compilation warning level                          | >= 1.0.1                    |
| [set_optimize](#targetset_optimize)             | Set compilation optimization level                     | >= 1.0.1                    |
| [set_languages](#targetset_languages)           | Set source code language standards                     | >= 1.0.1                    |
| [set_headerdir](#targetset_headerdir)           | Set output directories for header files                | >= 1.0.1 < 2.2.5 deprecated |
| [set_targetdir](#targetset_targetdir)           | Set output directories for target file                 | >= 1.0.1                    |
| [set_objectdir](#targetset_objectdir)           | Set output directories for object files                | >= 1.0.1                    |
| [set_dependir](#targetset_dependir)             | Set output directories for dependent files             | >= 2.2.2                    |
| [add_imports](#targetadd_imports)               | Add imported modules for the custom script             | >= 2.1.7                    |
| [add_rules](#targetadd_rules)                   | Add custom compilation rule to target                  | >= 2.1.9                    |
| [on_load](#targeton_load)                       | Run custom load target configuartion script            | >= 2.1.5                    |
| [on_build](#targeton_build)                     | Run custom build target script                         | >= 2.0.1                    |
| [on_build_file](#targeton_build_file)           | Run custom build single file script                    | >= 2.2.3                    |
| [on_build_files](#targeton_build_files)         | Run custom build files script                          | >= 2.2.3                    |
| [on_clean](#targeton_clean)                     | Run custom clean files script                          | >= 2.0.1                    |
| [on_package](#targeton_package)                 | Run custom package target script                       | >= 2.0.1                    |
| [on_install](#targeton_install)                 | Run custom install target file script                  | >= 2.0.1                    |
| [on_uninstall](#targeton_uninstall)             | Run custom uninstall target file script                | >= 2.0.1                    |
| [on_run](#targeton_run)                         | Run custom run target script                           | >= 2.0.1                    |
| [before_build](#targetbefore_build)             | Run custom script before building target               | >= 2.0.1                    |
| [before_build_file](#targetbefore_build_file)   | Run custom script before building single file          | >= 2.2.3                    |
| [before_build_files](#targetbefore_build_files) | Run custom script before building files                | >= 2.2.3                    |
| [before_clean](#targetbefore_clean)             | Run custom script before cleaning target               | >= 2.0.1                    |
| [before_package](#targetbefore_package)         | Run custom script before packaging target              | >= 2.0.1                    |
| [before_install](#targetbefore_install)         | Run custom script before installing target             | >= 2.0.1                    |
| [before_uninstall](#targetbefore_uninstall)     | Run custom script before uninstalling target           | >= 2.0.1                    |
| [before_run](#targetbefore_run)                 | Run custom script before running target                | >= 2.0.1                    |
| [after_build](#targetafter_build)               | Run custom script after building target                | >= 2.0.1                    |
| [after_build_file](#targetafter_build_file)     | Run custom script after building single file           | >= 2.2.3                    |
| [after_build_files](#targetafter_build_files)   | Run custom script after building files                 | >= 2.2.3                    |
| [after_clean](#targetafter_clean)               | Run custom script after cleaning target                | >= 2.0.1                    |
| [after_package](#targetafter_package)           | Run custom script after packaging target               | >= 2.0.1                    |
| [after_install](#targetafter_install)           | Run custom script after installing target              | >= 2.0.1                    |
| [after_uninstall](#targetafter_uninstall)       | Run custom script after uninstalling target            | >= 2.0.1                    |
| [after_run](#targetafter_run)                   | Run custom script after running target                 | >= 2.0.1                    |
| [set_config_h](#targetset_config_h)             | Set auto-generated config header file                  | >= 1.0.1 < 2.1.5 deprecated |
| [set_config_h_prefix](#targetset_config_h)      | Set macro prefix in auto-generated config header       | >= 1.0.1 < 2.1.5 deprecated |
| [set_config_header](#targetset_config_header)   | Set auto-generated config header file                  | >= 2.1.5 < 2.2.5 deprecated |
| [set_pcheader](#targetset_pcheader)             | Set pre-compiled c header file                         | >= 2.1.5                    |
| [set_pcxxheader](#targetset_pcxxheader)         | Set pre-compiled c++ header file                       | >= 2.1.5                    |
| [add_deps](#targetadd_deps)                     | Add target dependencies                                | >= 1.0.1                    |
| [add_links](#targetadd_links)                   | Add link libraries                                     | >= 1.0.1                    |
| [add_syslinks](#targetadd_syslinks)             | Add system link libraries                              | >= 2.2.3                    |
| [add_files](#targetadd_files)                   | Add source files                                       | >= 1.0.1                    |
| [del_files](#targetdel_files)                   | Remove source files                                    | >= 2.1.9                    |
| [add_headers](#targetadd_headers)               | Add installed header files                             | >= 1.0.1 < 2.2.5 deprecated |
| [add_linkdirs](#targetadd_linkdirs)             | Add link search directories                            | >= 1.0.1                    |
| [add_rpathdirs](#targetadd_rpathdirs)           | Add load search directories for dynamic library        | >= 2.1.3                    |
| [add_includedirs](#targetadd_includedirs)       | Add include search directories                         | >= 1.0.1                    |
| [add_defines](#targetadd_defines)               | Add macro definition                                   | >= 1.0.1                    |
| [add_undefines](#targetadd_undefines)           | Add macro undefinition                                 | >= 1.0.1                    |
| [add_defines_h](#targetadd_defines_h)           | Add macro definition to auto-generated config header   | >= 1.0.1 < 2.1.5 deprecated |
| [add_undefines_h](#targetadd_undefines_h)       | Add macro undefinition to auto-generated config header | >= 1.0.1 < 2.1.5 deprecated |
| [add_cflags](#targetadd_cflags)                 | Add c compilation flags                                | >= 1.0.1                    |
| [add_cxflags](#targetadd_cxflags)               | Add c/c++ compilation flags                            | >= 1.0.1                    |
| [add_cxxflags](#targetadd_cxxflags)             | Add c++ compilation flags                              | >= 1.0.1                    |
| [add_mflags](#targetadd_mflags)                 | Add objc compilation flags                             | >= 1.0.1                    |
| [add_mxflags](#targetadd_mxflags)               | Add objc/objc++ compilation flags                      | >= 1.0.1                    |
| [add_mxxflags](#targetadd_mxxflags)             | Add objc++ compilation flags                           | >= 1.0.1                    |
| [add_scflags](#targetadd_scflags)               | Add swift compilation flags                            | >= 2.0.1                    |
| [add_asflags](#targetadd_asflags)               | Add asm compilation flags                              | >= 2.0.1                    |
| [add_gcflags](#targetadd_gcflags)               | Add go compilation flags                               | >= 2.1.1                    |
| [add_dcflags](#targetadd_dcflags)               | Add dlang compilation flags                            | >= 2.1.1                    |
| [add_rcflags](#targetadd_rcflags)               | Add rust compilation flags                             | >= 2.1.1                    |
| [add_cuflags](#targetadd_cuflags)               | Add cuda compilation flags                             | >= 2.1.1                    |
| [add_ldflags](#targetadd_ldflags)               | Add static library link flags                          | >= 1.0.1                    |
| [add_arflags](#targetadd_arflags)               | Add archive library flags                              | >= 1.0.1                    |
| [add_shflags](#targetadd_shflags)               | Add dynamic library link flags                         | >= 1.0.1                    |
| [add_cfunc](#targetadd_cfunc)                   | Add single c function for checking                     | >= 2.0.1                    |
| [add_cxxfunc](#targetadd_cxxfunc)               | Add single c++ function for checking                   | >= 2.0.1                    |
| [add_cfuncs](#targetadd_cfuncs)                 | Add c functions for checking                           | >= 2.0.1                    |
| [add_cxxfuncs](#targetadd_cxxfuncs)             | Add c++ functions for checking                         | >= 2.0.1                    |
| [add_packages](#targetadd_packages)             | Add package dependencies                               | >= 2.0.1                    |
| [add_options](#targetadd_options)               | Add options dependencies                               | >= 2.0.1                    |
| [add_languages](#targetadd_languages)           | Add language standards                                 | >= 1.0.1                    |
| [add_vectorexts](#targetadd_vectorexts)         | Add vector extensions                                  | >= 1.0.1                    |
| [add_frameworks](#targetadd_frameworks)         | Add frameworks                                         | >= 2.1.1                    |
| [add_frameworkdirs](#targetadd_frameworkdirs)   | Add framework search directories                       | >= 2.1.5                    |
| [set_tools](#targetset_tools)                   | Set toolchains                                         | >= 2.2.1                    |
| [add_tools](#targetadd_tools)                   | Add toolchains                                         | >= 2.2.1                    |
| [set_values](#targetset_values)                 | Set custom configuartion values                        | >= 2.2.1                    |
| [add_values](#targetadd_values)                 | Add custom configuartion values                        | >= 2.2.1                    |
| [set_installdir](#targetset_installdir)         | Set the installation directory                         | >= 2.2.5                    |
| [add_installfiles](#targetadd_installfiles)     | add installation files                                 | >= 2.2.5                    |
| [add_headerfiles](#targetadd_headerfiles)       | Add header files                                       | >= 2.2.5                    |
| [set_configdir](#targetset_configdir)           | Set the output directory of configuartion files        | >= 2.2.5                    |
| [set_configvar](#targetset_configvar)           | Set template configuartion variable                    | >= 2.2.5                    |
| [add_configfiles](#targetadd_configfiles)       | Add template configuartion files                       | >= 2.2.5                    |

##### target

###### Define a project target

Defines a console target named `test` in project and the default target filename is `test`.

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

And we can call `target("demo")` repeatly to enter the target scope for modifying it's configuartion.

```lua
-- defines target: demo and enter it's scope to set configuartion
target("demo")
    set_kind("binary")
    add_files("src/demo.c")

-- defines and set `other` target
target("other")
    ...

-- re-enter demo target scope and add file `test.c` to `demo`
target("demo")
    add_files("src/test.c")
```

<p class="tip">
All configuartion in root scope affects all targets, but does not affect the configuartion of `option()`.
</p>

For example:

```lua
add_defines("DEBUG")

target("demo")                   -- add -DDEBUG
    set_kind("binary")
    add_files("src/demo.c")

target("test")                   -- add -DDEBUG
    set_kind("binary")
    add_files("src/test.c")
```

##### target_end

###### End target definition

This is an optional api. If not called, then all settings after
`target("xxx")` are made for that target, unless you enter other
`target`, `option` or `task` scope. If you want to leave the current
`target` and enter the root scope setting, then you can use this api. For example:

```lua
target("test")
    set_kind("static")
    add_files("src/*.c")
target_end()

-- Here we are in the root scope
-- ...
```

If you don't call this api:

```lua
target("test")
    set_kind("static")
    add_files("src/*.c")

-- Here we are in the target scope above, the subsequent settings are still
set for test
-- ...

-- Enter another target scope
target("test2")
    ...
```

##### target:set_kind

###### Set target kind

Set the target type. Currently supported types are:

| Value | Description |
| ------ | -----------|
| binary | Binary Program |
| static | Static library program |
| shared | dynamic library program |

```lua
target("demo")
    set_kind("binary")
```

##### target:set_strip

###### Strip target symbols

Set the current target strip mode, currently supports the mode:

| Value | Description |
| ------ | ----------------------------------------- |
| debug | When you link, strip off debugging symbols |
| all | When you link, strip all symbols, including debugging symbols |

This api is generally used in release mode and can generate smaller binary programs.

```lua
target("xxxx")
    set_strip("all")
```

<p class="tip">
This api does not have to be used after the target. If no target is specified, it will be set to global mode. .
</p>

##### target:set_enabled

###### Enable or disable target

If `set_enabled(false)` is set, the corresponding target will be directly disabled, including target loading and information acquisition, while [set_default](#targetset_default) is just set to not compile by default, but the target can still get related information. , the default will also be loaded.

##### target:set_default

###### Mark as default target

This interface is used to set whether the given project target is the default build. If this interface is not called for setting, then this target is built by default, for example:

```lua
target("test1")
    set_default(false)

target("test2")
    set_default(true)

target("test3")
    ...
```

The three goals of the above code, when executing the `xmake`, `xmake install`, `xmake package`, `xmake run` and other commands, if you do not specify the target name, then:

| Target Name | Behavior |
| ------ | -------------------------------- |
| test1 | will not be built, installed, packaged, and run by default |
| test2 | Default build, install, package, and run |
| test3 | Default build, install, package, and run |

Through the above example, you can see that the default target can be set more than one, and it will run in turn when running.

<p class="tip">
    Note that the `xmake uninstall` and `xmake clean` commands are not affected by this interface setting, as most users prefer to clean and unload all of them.
</p>

If you don't want to use the default target, you can manually specify which targets you need to build the installation:

```bash
$ xmake build targetname
$ xmake install targetname
```

If you want to force the build to install all targets, you can pass in the `[-a|--all]` parameter:

```bash
$ xmake build [-a|--all]
$ xmake install [-a|--all]
```

##### target:set_options

###### Set configuartion options

Add option dependencies. If you have customized some options through the [option](#option) interface, you can add associations only if you specify this option under the target target field.

```lua
-- Define a hello option
option("hello")
    set_default(false)
    set_showmenu(true)
    add_defines("HELLO_ENABLE")

target("test")
    -- If the hello option is enabled, this time the -DHELLO_ENABLE macro will be applied to the test target.
    set_options("hello")
```

<p class="warning">
Some settings defined in [option](#option) will affect this `target` target only after calling `set_options` for the association to take effect, such as macro definitions, link libraries, compile options, etc.
</p>

##### target:set_symbols

###### Set symbol info

Set the symbol mode of the target. If no target is currently defined, it will be set to the global state, affecting all subsequent targets.

At present, we mainly support several levels:

| Value | Description |
| ------ | ---------------------- |
| debug | Add debug symbols |
| hidden | set symbol not visible |

These two values ​​can also be set at the same time, for example:

```lua
-- Add debug symbols, set symbols are not visible
set_symbols("debug", "hidden")
```

If this api is not called, the debug symbol is disabled by default. .

##### target:set_basename

###### Set the base name of target file

By default, the generated target file name is based on the value configured in `target("name")`, for example:

```lua
-- The target file name is: libxxx.a
target("xxx")
    set_kind("static")

-- The target file name is: libxxx2.so
target("xxx2")
    set_kind("shared")
```

The default naming method basically meets the needs of most situations, but if you want to customize the target file name sometimes

For example, to distinguish the target name by compile mode and architecture, this time you can use this interface to set:

```lua
target("xxx")
    set_kind("static")
    set_basename("xxx_$(mode)_$(arch)")
```

if this time, the build configuration is: `xmake f -m debug -a armv7`, then the generated file name is: `libxxx_debug_armv7.a`

If you want to further customize the directory name of the target file, refer to: [set_targetdir](#targetset_targetdir).

Or implement more advanced logic by writing custom scripts, see: [after_build](#targetafter_build) and [os.mv](#os-mv).

##### target:set_filename

###### Set the full name of target file

The difference between it and [set_basename](#targetset_basename) is that [set_basename](#targetset_basename) sets the name without a suffix and a prefix, for example: `libtest.a`, if the basename is changed to test2, it becomes `libtest2.a `.

The modification of filename is to modify the entire target file name, including the prefix and suffix. For example, you can directly change `libtest.a` to `test.dll`, which is not available for [set_basename](#targetset_basename).

##### target:set_warnings

###### Set compilation warning level

Set the warning level of the compilation of the current target, generally supporting several levels:

| Value | Description | gcc/clang | msvc |
| ----- | ---------------------- | ---------- | ----------------------------- |
| none | disable all warnings | -w | -W0 |
| less | Enable fewer warnings | -W1 | -W1 |
| more | Enable more warnings | -W3 | -W3 |
| all | Enable all warnings | -Wall | -W3 (-Wall too more warnings) |
| error | Use all warnings as compilation errors | -Werror | -WX |

The parameters of this api can be added in combination, for example:

```lua
-- Enable all warnings and handle them as compilation errors
set_warnings("all", "error")
```

If there is no target currently, calling this api will set it to global mode. .

##### target:set_optimize

###### Set competition optimization level

Set the compile optimization level of the target. If no target is currently set, it will be set to the global state, affecting all subsequent targets.

At present, we mainly support several levels:

| Value | Description | gcc/clang | msvc |
| ---------- | ---------------------- | ---------- | ------------ |
| none | disable optimization | -O0 | -Od |
| fast | quick optimization | -O1 | default |
| faster | faster optimization | -O2 | -Ox |
| fastest | Optimization of the fastest running speed | -O3 | -Ox -fp:fast |
| smallest | Minimize code optimization | -Os | -O1 |
| aggressive | over-optimization | -Ofast | -Ox -fp:fast |

E.g:

```lua
-- Optimization of the fastest running speed
set_optimize("fastest")
```

##### target:set_languages

###### Set source code language standards

Set the language standard for target code compilation. If no target exists, it will be set to global mode. . .

The supported language standards currently have the following main ones:

| Value | Description |
| ---------- | ---------------------- |
| ansi | c language standard: ansi |
| c89 | c language standard: c89 |
| gnu89 | c language standard: gnu89 |
| c99 | c language standard: c99 |
| gnu99 | c language standard: gnu99 |
| cxx98 | c++ language standard: `c++98` |
| gnuxx98 | c++ language standard: `gnu++98` |
| cxx11 | c++ language standard: `c++11` |
| gnuxx11 | c++ language standard: `gnu++11` |
| cxx14 | c++ language standard: `c++14` |
| gnuxx14 | c++ language standard: `gnu++14` |
| cxx1z | c++ language standard: `c++1z` |
| gnuxx1z | c++ language standard: `gnu++1z` |
| cxx17 | c++ language standard: `c++17` |
| gnuxx17 | c++ language standard: `gnu++17` |

The c standard and the c++ standard can be set at the same time, for example:

```lua
-- Set c code standard: c99, c++ code standard: c++11
set_languages("c99", "cxx11")
```

<p class="warning">
Instead of setting the specified standard, the compiler will compile according to this standard. After all, each compiler supports different strengths, but xmake will try to adapt the support standard of the current compiler tool to the greatest extent possible. . .
<br><br>
E.g:
<br>
Windows vs compiler does not support compiling c code according to c99 standard, can only support c89, but xmake in order to support it as much as possible, so after setting c99 standard, xmake will force to compile according to c++ code mode c code, to some extent solved the c code problem of compiling c99 under windows. .
Users do not need to make any additional modifications. .
</p>

##### target:set_headerdir

###### Set output directories for header files

<p class="warning">
Note that this interface has been deprecated after version 2.2.5, please use [add_headerfiles](#targetadd_headerfiles) instead.
</p>

Set the output directory of the header file, and output it to the build directory by default.

```lua
target("test")
    set_headerdir("$(buildir)/include")
```

For the header files that need to be installed, refer to the [add_headers](#targetadd_headers) interface.

##### target:set_targetdir

###### Set output directories for target files

Set the output directory of the target program file. Under normal circumstances, you do not need to set it. The default output will be in the build directory.

The build directory can be manually modified during project configuration:

```bash
Xmake f -o /tmp/build
```

After modifying to `/tmp/build`, the target file is output to `/tmp/build` by default.

And if you use this interface to set, you don't need to change the command every time, for example:

```lua
target("test")
    set_targetdir("/tmp/build")
```

<p class="tip">
If the display sets `set_targetdir`, then the directory specified by `set_targetdir` is preferred as the output directory of the target file.
</p>

##### target:set_objectdir

###### Set output directories for object files

Set the output directory of the object file (`*.o/obj`) of the target target, for example:

```lua
target("test")
    set_objectdir("$(buildir)/.objs")
```

##### target:set_dependir

###### Set output directories for dependent files

Set the output directory of the compile dependency file (`.deps`) of the target target, for example:

```lua
target("test")
    set_dependir("$(buildir)/.deps")
```

##### target:add_imports

###### Add imports modules for the custom script

Usually, we can import extension modules via `import("core.base.task")` inside a custom script such as [on_build](#targeton_build).
However, in the case of a large number of custom scripts, each custom script is repeatedly imported again, which is very cumbersome. Then you can implement pre-import through this interface, for example:

```lua
target("test")
    on_load(function (target)
        import("core.base.task")
        import("core.project.project")

        task.run("xxxx")
    end)
    on_build(function (target)
        import("core.base.task")
        import("core.project.project")

        task.run("xxxx")
    end)
    on_install(function (target)
        import("core.base.task")
        import("core.project.project")

        task.run("xxxx")
    end)
```

This interface can be simplified to:

```lua
target("test")
    add_imports("core.base.task", "core.project.project")
    on_load(function (target)
        task.run("xxxx")
    end)
    on_build(function (target)
        task.run("xxxx")
    end)
    on_install(function (target)
        task.run("xxxx")
    end)
```

##### target:add_rules

###### Add custom compilation rule to target

We can extend the build support for other files by pre-setting the file suffixes supported by the rules:

```lua
-- Define a build rule for a markdown file
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build(function (target, sourcefile)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)

target("test")
    set_kind("binary")

    -- Make the test target support the construction rules of the markdown file
    add_rules("markdown")

    -- Adding a markdown file to build
    add_files("src/*.md")
    add_files("src/*.markdown")
```

We can also specify the application of local files to the rules, see: [add_files] (#targetadd_files).

##### target:on_load

###### Run custom load target configuartion script

This script will be executed when the target is initialized and loaded, and some dynamic target configurations can be made to achieve more flexible target description definitions, for example:

```lua
target("test")
    on_load(function (target)
        target:add("defines", "DEBUG", "TEST=\"hello\"")
        target:add("linkdirs", "/usr/lib", "/usr/local/lib")
        target:add({includedirs = "/usr/include", "links" = "pthread"})
    end)
```

You can dynamically add various target attributes in `on_load` via `target:set`, `target:add`.

##### target:on_build

###### Run custom build target script

Override the target build behavior of the target target, implement a custom compilation process, in general, do not need to do this, unless you really need to do some compiler operations that xmake does not provide by default.

You can override it by following the steps below to customize the compilation:

```lua
target("test")

    -- Set up custom build scripts
    on_build(function (target)
        print("build it")
    end)
```

Note: After version 2.1.5, all target custom scripts can be processed separately for different platforms and architectures, for example:

```lua
target("test")
    on_build("iphoneos|arm*", function (target)
        print("build for iphoneos and arm")
    end)
```

If the first parameter is a string, then it is specified in which platform_architecture the script needs to be executed, and mode matching is supported, for example, `arm*` matches all arm architectures.

Of course, you can also set the platform only, do not set the architecture, this is to match the specified platform, execute the script:

```lua
target("test")
    on_build("windows", function (target)
        print("build for windows")
    end)
```

<p class="tip">
Once the build process is set for this target target, the default build process for xmake will no longer be executed.
</p>

##### target:on_build_file

###### Run custom build single file script

Through this interface, you can use hook to specify the built-in build process of the target, replacing each source file compilation process:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_build_file(function (target, sourcefile, opt)
        opt.origin(target, sourcefile, opt)
    end)
```

The `opt.origin` in the above code has a built-in build script. If you want to call the built-in build script to compile the source file after hooking, just continue to call `opt.origin`.

If you don't want to rewrite the built-in build script, just add some of your own processing before and after compiling. Its utility: [target.before_build_file](#targetbefore_build_file) and [target.after_build_file](#targetafter_build_file) will be more convenient and you don't need to call it. Opt.origin`.

##### target:on_build_files

###### Run custom build files script

Through this interface, you can use hook to specify the built-in build process of the target, and replace a batch of the same type of source file compilation process:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_build_files(function (target, sourcebatch, opt)
        opt.origin(target, sourcebatch, opt)
    end)
```

After setting this interface, the corresponding file in the source file list will not appear in the custom [target.on_build_file](#targeton_build_file), because this is an inclusion relationship.

Where sourcebatch describes the same source files of the same type:

* `sourcebatch.sourcekind`: Get the type of this batch of source files, for example: cc, as, ..
* `sourcebatch.sourcefiles()`: get the list of source files
* `sourcebatch.objectfiles()`: get the list of object files
* `sourcebatch.dependfiles()`: Get the list of corresponding dependent files, compile dependency information in the stored source file, for example: xxx.d

The `opt.origin` in the above code has a built-in build script. If you want to call the built-in build script to compile the source file after hooking, just continue to call `opt.origin`.

##### target:on_clean

###### Run custom clean files script

Override the cleanup operation of the target target's `xmake [c|clean}` to implement a custom cleanup process.

```lua
target("test")

    -- Set up a custom cleanup script
    on_clean(function (target)

        -- Delete only target files
        os.rm(target:targetfile())
    end)
```

Some target interfaces are described as follows:

| target interface                    | description                                  |
| ----------------------------------- | -------------------------------------------- |
| target:name()                       | Get the target name                          |
| target:targetfile()                 | Get the target file path                     |
| target:get("kind")                  | Get the build type of the target             |
| target:get("defines")               | Get the macro definition of the target       |
| target:get("xxx")                   | Other target information set by the `set_/add_` interface can be obtained through this interface |
| target:add("links", "pthread")      | Add target settings                          |
| target:set("links", "pthread", "z") | Override target settings                     |
| target:deps()                       | Get all dependent targets of the target      |
| target:dep("depname")               | Get the specified dependency target          |
| target:sourcebatches()              | Get a list of all source files for the target |

##### target:on_package

###### Run custom package target script

Override the target object's `xmake [p|package}` package operation to implement the custom packaging process. If you want to package the specified target into the format you want, you can customize it through this interface.

This interface is quite practical. For example, after compiling jni, the generated so is packaged into the apk package.

```lua
-- Define a test demo for an android app
target("demo")

    -- Generate dynamic libraries: libdemo.so
    set_kind("shared")

    -- Set the output directory of the object, optional
    set_objectdir("$(buildir)/.objs")

    -- Every time you compile the build directory of libdemo.so, set it to app/libs/armeabi
    set_targetdir("libs/armeabi")

    -- Add jni code files
    add_files("jni/*.c")

    -- Set up a custom package script. After compiling libdemo.so with xmake, execute xmake p to package
    -- will automatically compile the app into an apk file using ant
    --
    on_package(function (target)

        -- Use ant to compile the app into an apk file, and redirect the output to a log file.
        os.run("ant debug")
    end)
```

##### target:on_install

###### Run custom install target file script

Override the installation of `xmake [i|install}` of the target target to implement a custom installation process.

For example, the generated apk package will be installed.

```lua
target("test")

    -- Set up a custom installation script to automatically install apk files
    on_install(function (target)

        -- Use adb to install packaged apk files
        os.run("adb install -r ./bin/Demo-debug.apk")
    end)
```

##### target:on_uninstall

###### Run custom uninstall target file script

Override the uninstallation of `xmake [u|uninstall}` of the target target to implement a custom uninstall process.

```lua
target("test")
    on_uninstall(function (target)
        ...
    end)
```

##### target:on_run

###### Run custom run target script

Override the running operation of the target target's `xmake [r|run}` to implement a custom running process.

For example, run the installed apk program:

```lua
target("test")

    -- Set custom run scripts, automatically run the installed app, and automatically get device output information
    on_run(function (target)

        os.run("adb shell am start -n com.demo/com.demo.DemoTest")
        os.run("adb logcat")
    end)
```

##### target:before_build

###### Run custom script before building target

It does not override the default build operation, just add some custom actions before building.

```lua
target("test")
    before_build(function (target)
        print("")
    end)
```

##### target:before_build_file

###### Run custom script before building single file

Through this interface, you can use hook to specify the built-in build process of the target, and execute some custom scripts before each source file compilation process:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    before_build_file(function (target, sourcefile, opt)
    end)
```

##### target:before_build_files

###### Run custom script before building files

Through this interface, you can use hook to specify the built-in build process of the target, and execute some custom scripts before a batch of source files of the same type:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    before_build_files(function (target, sourcebatch, opt)
    end)
```


##### target:before_clean

###### Run custom script before cleaning target

It does not override the default cleanup operation, just add some custom actions before cleaning.

```lua
target("test")
    before_clean(function (target)
        print("")
    end)
```

##### target:before_package

###### Run custom script before packaging target

It does not override the default packaging operation, just add some custom operations before packaging.

```lua
target("test")
    before_package(function (target)
        print("")
    end)
```

##### target:before_install

###### Run custom script before installing target

It does not override the default installation operation, just add some custom actions before installation.

```lua
target("test")
    before_install(function (target)
        print("")
    end)
```

##### target:before_uninstall

###### Run custom script before uninstalling target

It does not override the default uninstall operation, just add some custom actions before uninstalling.

```lua
target("test")
    before_uninstall(function (target)
        print("")
    end)
```

##### target:before_run

###### Run custom script before running target

It does not override the default run operation, just add some custom actions before running.

```lua
target("test")
    before_run(function (target)
        print("")
    end)
```

##### target:after_build

###### Run custom script after building target

It does not override the default build operation, just add some custom actions after the build.

For example, for jailbreak development of ios, after the program is built, you need to use `ldid` for signature operation.

```lua
target("test")
    after_build(function (target)
        os.run("ldid -S %s", target:targetfile())
    end)
```

##### target:after_build_file

###### Run custom script after building single file

Through this interface, you can use hook to specify the built-in build process of the target, and execute some custom scripts after each source file compilation process:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    after_build_file(function (target, sourcefile, opt)
    end)
```

##### target:after_build_files

###### Run custom script after building files

Through this interface, you can use hook to specify the built-in build process of the target, and execute some custom scripts after a batch of source files of the same type:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    after_build_files(function (target, sourcebatch, opt)
    end)
```

##### target:after_clean

###### Run custom script after cleaning target

It does not override the default cleanup operation, just add some custom actions after cleanup.

Generally used to clean up some extra temporary files automatically generated by a target. The default cleanup rules of these files may not be cleaned up.
To, for example:

```lua
target("test")
    after_clean(function (target)
        os.rm("$(buildir)/otherfiles")
    end)
```

##### target:after_package

###### Run custom script after packaging target

It does not override the default packaging operation, just add some custom operations after packaging.

```lua
target("test")
    after_package(function (target)
        print("")
    end)
```

##### target:after_install

###### Run custom script after installing target

It does not override the default installation operation, just add some custom actions after installation.

```lua
target("test")
    after_install(function (target)
        print("")
    end)
```
##### target:after_uninstall

###### Run custom script after uninstalling target

It does not override the default uninstall operation, just add some custom actions after uninstalling.

```lua
target("test")
    after_uninstall(function (target)
        print("")
    end)
```

##### target:after_run

###### Run custom script after running target

It does not override the default run operation, just add some custom actions after the run.

```lua
target("test")
    after_run(function (target)
        print("")
    end)
```


##### target:set_config_h

###### Set auto-generated config header file

<p class="warning">
After the 2.2.5 version, this interface has been deprecated, please use [add_configfiles](#targetadd_configfiles).
After the 2.1.5 version, this interface has been deprecated, please use [set_config_header](#targetset_config_header).
</p>

If you want to write the result of the test to the configuration header after the xmake configuration project succeeds, or automatically detect an option, you need to call this interface to enable automatic generation of the `config.h` file.

How to use, for example:

```lua
target("test")

    -- Enable and set the path to the config.h file that needs to be automatically generated
    set_config_h("$(buildir)/config.h")

    -- Set the name prefix of the macro switch generated by automatic detection
    set_config_h_prefix("TB_CONFIG")
```

When the target passes the following interfaces, the related option dependencies, package dependencies, and interface dependencies are added to the target. If a dependency is enabled, the corresponding macro definition configuration will be automatically written to the set `config. Go to the .h` file.

* [add_options](#targetadd_options)
* [add_packages](#targetadd_packages)
* [add_cfuncs](#targetadd_cfuncs)
* [add_cxxfuncs](#targetadd_cxxfuncs)

These interfaces, in fact, use some of the detection settings in the [option] (#option) option, for example:

```lua
option("wchar")

    -- Add detection of wchar_t type
    add_ctypes("wchar_t")

    -- If the test passes, automatically generate a macro switch of TB_CONFIG_TYPE_HAVE_WCHAR to config.h
    add_defines_h("$(prefix)_TYPE_HAVE_WCHAR")

target("test")

    -- Enable automatic generation of header files
    set_config_h("$(buildir)/config.h")
    set_config_h_prefix("TB_CONFIG")

    -- Add dependency on the wchar option. Only with this association, the detection result of the wchar option will be written to the specified config.h.
    add_options("wchar")
```

##### target:set_config_h_prefix

###### Set macro prefix in auto-generated config header

<p class="warning">
After the 2.2.5 version, this interface has been deprecated, please use [add_configfiles](#targetadd_configfiles).
After the 2.1.5 version, this interface has been deprecated, please use [set_config_header](#targetset_config_header).
</p>

For details, see: [set_config_h](#targetset_config_h)

If set:

```lua
target("test")
    set_config_h_prefix("TB_CONFIG")
```

Then, the $(prefix) of `add_defines_h("$(prefix)_TYPE_HAVE_WCHAR")` in the option is automatically replaced with the new prefix value.


##### target:set_config_header

###### Set macro prefix in auto-generated config header and prefix

<p class="warning">
After the 2.2.5 version, this interface has been deprecated, please use [add_configfiles](#targetadd_configfiles).
After the 2.1.5 version, this interface has been deprecated, please use [set_config_header](#targetset_config_header).
</p>

This interface is an upgraded version of [set_config_h](#targetset_config_h) and [set_config_h_prefix](#targetset_config_h_prefix), supported after 2.1.5.

If you want to write the result of the test to the configuration header after the xmake configuration project succeeds, or automatically detect an option, you need to call this interface to enable automatic generation of the `config.h` file.

How to use, for example:

```lua
target("test")
    set_config_header("$(buildir)/config.h", {prefix = "TB_CONFIG"})
```

The above code, enable and set the path to the config.h file that needs to be automatically generated, and set the name prefix of the macro switch generated by the automatic detection: `TB_CONFIG`, of course, the setting of this prefix is ​​optional.

```lua
target("test")
    set_config_header("$(buildir)/config.h")
```

If you do not set a prefix, it will automatically generate a unique string based on the target name.

After version 2.1.8, the version number is set separately for each local configuration file, which takes precedence over the global [set_version](#set_version), for example:

```lua
    set_config_header("$(buildir)/config.h", {prefix = "TB_CONFIG", version = "2.1.8", build = "%Y%m%d%H%M"})
```

###### Generate configuration with built-in detection rules

When the target passes the following interfaces, the related option dependencies, package dependencies, and interface dependencies are added to the target. If a dependency is enabled, the corresponding macro definition configuration will be automatically written to the set `config. Go to the .h` file.

* [add_options](#targetadd_options)
* [add_packages](#targetadd_packages)
* [add_cfunc](#targetadd_cfunc)
* [add_cfuncs](#targetadd_cfuncs)
* [add_cxxfuncs](#targetadd_cxxfuncs)

###### Customize detection and generate configuration header files

These interfaces, in fact, use some of the detection settings in the [option] (#option) option, for example:

```lua
option("wchar")

    -- Add detection of wchar_t type
    add_ctypes("wchar_t")

    -- If the test passes, automatically generate a macro switch of TB_CONFIG_TYPE_HAVE_WCHAR to config.h
    add_defines_h("$(prefix)_TYPE_HAVE_WCHAR")

target("test")

    -- Enable automatic generation of header files
    set_config_header("$(buildir)/config.h", {prefix = "TB_CONFIG"})

    -- Add dependency on the wchar option. Only with this association, the detection result of the wchar option will be written to the specified config.h.
    add_options("wchar")
```

Even we can define a function in `xmake.lua`, package the option, provide more customized detection and process of generating config.h.

For example: there is a requirement here, we want to batch check some header files, if there is a macro switch such as `HAVE_LIMITS_H` in config.h, we can write

```lua
function add_checking_to_config(...)

    -- Batch definition of option detection rules, only include include files
    local options = {}
    for _, header in ipairs({...}) do
        local define = header:upper():gsub("[%./]", "_")
        option(define)
            add_cincludes(header)
            add_defines_h("HAVE_" .. define) -- Generate a macro switch like HAVE_LIMITS_H ​​to config.h
        option_end()
        table.insert(options, define)
    end

    -- Define a built-in __config empty target, only for association settings automatedconfig.h, and corresponding options detection rules
    -- Because set_config_header is globally set, it will affect all targets, and each target will detect the generation of a macro switch.
    target("__config")
        set_kind("phony")
        set_cOnfig_header("includes/automatedconfig.h")
        add_options(options)
    target_end()
end

-- Add some header file detection
add_checking_to_config("arpa/inet.h", "limits.h", "fcntl.h", "xxxx.h")
```

##### target:set_pcheader

###### Set pre-compiled c header file

Xmake supports accelerating c program compilation by precompiling header files. Currently supported compilers are: gcc, clang, and msvc.

The usage is as follows:

```lua
target("test")
    set_pcheader("header.h")
```

##### target:set_pcxxheader

###### Set pre-compiled c++ header file

Xmake supports precompiled header files to speed up C++ program compilation. Currently supported compilers are: gcc, clang, and msvc.

The usage is as follows:

```lua
target("test")
    set_pcxxheader("header.h")
```

##### target:add_deps

###### Add target dependencies



Add the dependency target of the current target. When compiling, it will first compile the target of the dependency and then compile the current target. . .

```lua
target("test1")
    set_kind("static")
    set_files("*.c")

target("test2")
    set_kind("static")
    set_files("*.c")

target("demo")
    add_deps("test1", "test2")
```

In the above example, when compiling the target demo, you need to compile the test1 and test2 targets first, because the demo will use them.

<p class="tip">
The target will automatically inherit the configuration and properties in the dependent target. You don't need to call the interfaces `add_links`, `add_linkdirs` and `add_rpathdirs` to associate the dependent targets.
</p>

And the inheritance relationship is to support cascading, for example:

```lua
target("library1")
    set_kind("static")
    add_files("*.c")
    add_includedirs("inc") -- The default private header file directory will not be inherited
    add_includedirs("inc1", {public = true}) -- The header file related directory here will also be inherited

target("library2")
    set_kind("static")
    add_deps("library1")
    add_files("*.c")

target("test")
    set_kind("binary")
    add_deps("library2")
```

If we don't want to inherit any configuration that depends on the target, what should we do?

```lua
add_deps("dep1", "dep2", {inherit = false})
```

By explicitly setting the inherit configuration, tell xmake whether the two dependent configurations need to be inherited. If not set, the default is to enable inheritance.

After version 2.2.5, you can set public to true by `add_includedirs("inc1", {public = true})`, and expose the settings of includers to other dependent child targets.

At present, for the target compilation link flags related interface settings, support for inheritance properties, you can artificially control whether you need to export to other targets to rely on inheritance, the currently supported properties are:

| Attribute | Description |
| ---- | ---- |
| private | The default setting, as the private configuration of the current target, will not be inherited by other targets that depend on |
Public | public configuration, current target, dependent child targets will be set |
Interface | interface settings, only inherited by the dependent child target, the current target does not participate |

For a detailed description of this, you can look at it: https://github.com/xmake-io/xmake/issues/368

##### target:add_links

###### Add link libraries

Add a link library for the current target, which is usually paired with [add_linkdirs](#targetadd_linkdirs).

```lua
target("demo")

    -- Add a link to libtest.a, equivalent to -ltest
    add_links("test")

    -- Add link search directory
    add_linkdirs("$(buildir)/lib")
```

##### target:add_syslinks

###### Add system link libraries

This interface is similar to [add_links](#targetadd_links). The only difference is that the link library added through this interface is in the order of all `add_links`.

Therefore, it is mainly used to add system library dependencies, because the link order of the system libraries is very backward, for example:

```lua
add_syslinks("pthread", "m", "dl")
target("demo")
    add_links("a", "b")
    add_linkdirs("$(buildir)/lib")
```

The above configuration, even if `add_syslinks` is set in advance, the final link order is still: `-la -lb -lpthread -lm -ldl`

##### target:add_files

###### Add source files

Source files used to add target projects, even library files, some file types currently supported:

| Supported source file types | Description |
| ------------------ | ---------------------------------- |
| .c/.cpp/.cc/.cxx | c++ file |
| .s/.S/.asm | Assembly files |
| .m/.mm | objc file |
| .swift | swift file |
| .go | golang file |
| .o/.obj | Object File |
| .a/.lib | Static library files, will automatically merge the library to the target program |
| .rc | msvc resource file |

The wildcard `*` indicates that the file in the current directory is matched, and `**` matches the file in the multi-level directory.

E.g:

```lua
add_files("src/test_*.c")
add_files("src/xxx/**.cpp")
add_files("src/asm/*.S", "src/objc/**/hello.m")
```

The use of `add_files` is actually quite flexible and convenient. Its matching mode draws on the style of premake, but it has been improved and enhanced.

This makes it possible to not only match files, but also to filter out a batch of files in the specified mode while adding files.

E.g:

```lua
-- Recursively add all c files under src, but not all c files under src/impl/
add_files("src/**.c|impl/*.c")

-- Add all cpp files under src, but not including src/test.cpp, src/hello.cpp, and all cpp files with xx_ prefix under src
add_files("src/*.cpp|test.cpp|hello.cpp|xx_*.cpp")
```

The separators after the ``` are all files that need to be excluded. These files also support the matching mode, and you can add multiple filtering modes at the same time, as long as the middle is separated by `|`. .

One of the benefits of supporting the filtering of some files when adding files is that they provide the basis for subsequent file additions based on different switching logic.

<p class="tip">
In order to make the description more streamlined, the filter descriptions after `|` are based on a schema: the directory before `*` in `src/*.cpp`.
So the above example is filtered after the file under src, this is to pay attention to.
</p>

After version 2.1.6, `add_files` has been improved to support more fine-grained compilation option controls based on files, such as:

```lua
target("test")
    add_defines("TEST1")
    add_files("src/*.c")
    add_files("test/*.c", "test2/test2.c", {defines = "TEST2", languages ​​= "c99", includedirs = ".", cflags = "-O0"})
```

You can pass a configuration table in the last parameter of `add_files` to control the compilation options of the specified files. The configuration parameters are consistent with the target, and these files will also inherit the target's common configuration `-DTEST1`.

After version 2.1.9, support for adding unknown code files, by setting rule custom rules, to achieve custom build of these files, for example:

```lua
target("test")
    -- ...
    add_files("src/test/*.md", {rule = "markdown"})
```

For instructions on using custom build rules, see: [Building Rules] (#Building Rules).

And after the 2.1.9 version, you can use the force parameter to force the automatic detection of cxflags, cflags and other compile options, directly into the compiler, even if the compiler may not support, it will also be set:

```lua
add_files("src/*.c", {force = {cxflags = "-DTEST", mflags = "-framework xxx"}})
```

##### target:del_files

###### Remove source files

Through this interface, you can delete the specified file from the list of files added by the [add_files] (targetadd_files) interface, for example:

```lua
target("test")
    add_files("src/*.c")
    del_files("src/test.c")
```

In the above example, you can add all files except `test.c` from the `src` directory. Of course, this can also be done by `add_files("src/*.c|test.c").To achieve the same purpose, but this way is more flexible.

For example, we can conditionally determine which files to delete, and this interface also supports the matching mode of [add_files] (targetadd_files), filtering mode, and bulk removal.

```lua
target("test")
    add_files("src/**.c")
    del_files("src/test*.c")
    del_files("src/subdir/*.c|xxx.c")
    if is_plat("iphoneos") then
        add_files("xxx.m")
    end
```

Through the above example, we can see that `add_files` and `del_files` are added and deleted sequentially according to the calling sequence, and deleted by `del_files("src/subdir/*.c|xxx.c")` Batch file,
And exclude `src/subdir/xxx.c` (that is, don't delete this file).

##### target:add_headers

###### Add installed header files

<p class="warning">
Note that this interface has been deprecated after version 2.2.5, please use [add_headerfiles](#targetadd_headerfiles) instead.
</p>

Install the specified header file into the build directory. If [set_headerdir](#targetset_headerdir) is set, it will be output to the specified directory.

The syntax of the installation rules is similar to [add_files](#targetadd_files), for example:

```lua
    -- Install all the header files in the tbox directory (ignore the files in the impl directory), and press () to specify the part as a relative path to install
    add_headers("../(tbox/**.h)|**/impl/**.h")
```

##### target:add_linkdirs

###### Add link search directories

Set the search directory of the link library. This interface is used as follows:

```lua
target("test")
    add_linkdirs("$(buildir)/lib")
```

This interface is equivalent to gcc's `-Lxxx` link option.

Generally, it is used together with [add_links](#targetadd_links). Of course, it can also be added directly through the [add_ldflags](#targetadd_ldflags) or [add_shflags](#targetadd_shflags) interface. It is also possible.

<p class="tip">
If you don't want to write to death in the project, you can set it by: `xmake f --linkdirs=xxx` or `xmake f --ldflags="-L/xxx"`, of course, this manually set directory search priority. higher.
</p>

##### target:add_rpathdirs

###### Add load search directories for dynamic libraries

After [add_linkdirs](#targetadd_linkdirs) sets the link search directory of the dynamic library, the program is normally linked, but in the Linux platform, if you want to run the compiled program normally, it will report that the dynamic library fails to be loaded.

Because the dynamic library's load directory is not found, if you want to run the program that depends on the dynamic library, you need to set the `LD_LIBRARY_PATH` environment variable to specify the dynamic library directory to be loaded.

However, this method is global, and the impact is too wide. The better way is to set the dynamic library search path to be loaded when the linker is set by the linker option of `-rpath=xxx`, and xmake does it. Encapsulation, better handling cross-platform issues with `add_rpathdirs`.

The specific use is as follows:

```lua
target("test")
    set_kind("binary")
    add_linkdirs("$(buildir)/lib")
    add_rpathdirs("$(buildir)/lib")
```

Just need to set the rpath directory when linking, although the same purpose can be achieved by `add_ldflags("-Wl,-rpath=xxx")`, but this interface is more general.

Internally, different platforms will be processed. For example, under macOS, the `-rpath` setting is not required, and the running program can be loaded normally. Therefore, for this platform, xmake internally ignores the setting directly to avoid link error.

When doing dynamic library linking for dlang programs, xmake will automatically process it into `-L-rpath=xxx` to pass in the linker of dlang, thus avoiding the need to directly use `add_ldflags` to determine and handle different platforms and compile. Problem.

The 2.1.7 version has improved this interface, supporting: `@loader_path`, `@executable_path` and `$ORIGIN` built-in variables to specify the program's load directory. Their effects are basically the same, mainly for Also compatible with macho, elf.

E.g:

```lua
target("test")
    set_kind("binary")
    add_linkdirs("$(buildir)/lib")
    add_rpathdirs("@loader_path/lib")
```

Specify the test program to load the dynamic library file of `lib/*.[so|dylib]` in the current execution directory, which will help to improve the portability of the program without writing dead absolute paths and relative paths, resulting in program and directory switching. Causes the program to load the dynamic library failed.

<p class="tip">
It should be noted that under macos, if the add_rpathdirs setting is in effect, you need to do some preprocessing on dylib and add the `@rpath/xxx` path setting:
`$install_name_tool -add_rpath @rpath/libxxx.dylib xxx/libxxx.dylib`
We can also check if there is a path with @rpath via `otool -L libxxx.dylib`
</p>

##### target:add_includedirs

###### Add include search directories

Set the search directory for the header file. This interface is used as follows:

```lua
target("test")
    add_includedirs("$(buildir)/include")
```

Of course, it can also be set directly through interfaces such as [add_cxflags] (#targetadd_cxflags) or [add_mxflags] (#targetadd_mxflags), which is also possible.

After 2.2.5, includedirs can be exported to dependent child targets via the extra `{public|interface = true}` property setting, for example:

```lua
target("test")
    set_kind("static")
    add_includedirs("src/include") -- only for the current target
    add_includedirs("$(buildir)/include", {public = true}), the current target and child targets will be set

target("demo")
    set_kind("binary")
    add_deps("test")
```

For more on this block, see: [add_deps](#targetadd_deps)

<p class="tip">
If you don't want to write to death in the project, you can set it by: `xmake f --includedirs=xxx` or `xmake f --cxflags="-I/xxx"`, of course, this manually set directory search priority. higher.
</p>

##### target:add_defines

###### Add macro definition

```lua
add_defines("DEBUG", "TEST=0", "TEST2=\"hello\"")
```

Equivalent to setting the compile option:

```
-DDEBUG -DTEST=0 -DTEST2=\"hello\"
```

##### target:add_undefines

###### Add macro undefinition

```lua
add_undefines("DEBUG")
```

Equivalent to setting the compile option: `-UDEBUG`

In the code is equivalent to: `#undef DEBUG`

##### target:add_defines_h

###### Add macro definition to auto-generated config header

<p class="warning">
After the 2.2.5 version, this interface has been deprecated, please use [add_configfiles](#targetadd_configfiles).
</p>

Add macro definitions to the `config.h` configuration file, `config.h` settings, refer to the [set_config_h](#targetset_config_h) interface.

##### target:add_undefines_h

###### Add macro undefinition to auto-generated config header

<p class="warning">
After the 2.2.5 version, this interface has been deprecated, please use [add_configfiles](#targetadd_configfiles).
</p>

Disable the macro definition by `undef` in the `config.h` configuration file. For the setting of `config.h`, refer to the [set_config_h](#targetset_config_h) interface.

##### target:add_cflags

###### Add c compilation flags

Add compilation options only for c code

```lua
add_cflags("-g", "-O2", "-DDEBUG")
```

<p class="warning">
All option values ​​are based on the definition of gcc as standard. If other compilers are not compatible (for example: vc), xmake will automatically convert it internally to the corresponding option values ​​supported by the compiler.
Users don't have to worry about compatibility. If other compilers don't have matching values, xmake will automatically ignore the settings.
</p>

After version 2.1.9, the force parameter can be used to force the automatic detection of flags to be disabled and passed directly to the compiler. Even if the compiler may not support it, it will be set:

```lua
add_cflags("-g", "-O2", {force = true})
```

##### target:add_cxflags

###### Add c/c++ compilation flags

Add compilation options to c/c++ code at the same time

##### target:add_cxxflags

###### Add c++ compilation flags

Add compilation options only to c++ code

##### target:add_mflags

###### Add objc compilation flags

Add compilation options only to objc code

```lua
add_mflags("-g", "-O2", "-DDEBUG")
```

After version 2.1.9, the force parameter can be used to force the automatic detection of flags to be disabled and passed directly to the compiler. Even if the compiler may not support it, it will be set:

```lua
add_mflags("-g", "-O2", {force = true})
```

##### target:add_mxflags

###### Add objc/objc++ compilation flags

Also add compile options to objc/objc++ code

```lua
add_mxflAgs("-framework CoreFoundation")
```

##### target:add_mxxflags

###### Add objc++ compilation flags

Add compilation options only to objc++ code

```lua
add_mxxflags("-framework CoreFoundation")
```

##### target:add_scflags

###### Add swift compilation flags

Add compilation options to swift code

```lua
add_scflags("xxx")
```

##### target:add_asflags

###### Add asm compilation flags

Add compilation options to assembly code

```lua
add_asflags("xxx")
```

##### target:add_gcflags

###### Add go compilation flags

Add compile options to golang code

```lua
add_gcflags("xxx")
```

##### target:add_dcflags

###### Add dlang compilation flags

Add compilation options to dlang code

```lua
add_dcflags("xxx")
```

##### target:add_rcflags

###### Add MASTER compilation flags

Add compilation options to the rust code

```lua
add_rcflags("xxx")
```

##### target:add_cuflags

###### Add cuda compilation flags

Add compilation options to cuda code

```lua
add_cuflags("-gencode arch=compute_30,code=sm_30")
```

##### target:add_ldflags

###### Add static library link flags

Add static link option

```lua
add_ldflags("-L/xxx", "-lxxx")
```

##### target:add_arflags

###### Add archive library flags

Affect the generation of static libraries

```lua
add_arflags("xxx")
```
##### target:add_shflags

###### Add dynamic library link flags

Affect the generation of dynamic libraries

```lua
add_shflags("xxx")
```

##### target:add_cfunc

###### Add single c function for checking

Similar to [add_cfuncs](#targetadd_cfuncs), only a single function interface is set and only valid for the `target` domain. This interface does not exist in `option`.

The purpose of this interface is primarily to create a more highly customized macro switch in `config.h`, for example:

```lua
target("demo")

    -- Set and enable config.h
    set_config_header("$(buildir)/config.h", {prefix = "TEST"})

    -- Set module name prefix only by parameter one
    add_cfunc("libc", nil, nil, {"sys/select.h"}, "select")

    -- Set the simultaneous detection of the link library via parameter three: libpthread.a
    add_cfunc("pthread", nil, "pthread", "pthread.h", "pthread_create")

    -- Set interface alias by parameter two
    add_cfunc(nil, "PTHREAD", nil, "pthread.h", "pthread_create")
```

The resulting results are as follows:

```c
#ifndef TEST_H
#define TEST_H

// Macro naming convention: $(prefix) prefix _ module name (if non-nil) _ HAVE _ interface name or alias (uppercase)
#define TEST_LIBC_HAVE_SELECT 1
#define TEST_PTHREAD_HAVE_PTHREAD_CREATE 1
#define TEST_HAVE_PTHREAD 1

#endif
```

For more flexible function detection, you can do this in a custom script with [lib.detect.has_cfuncs](#detect-has_cfuncs).

##### target:add_cxxfunc

###### Add single c++ function for checking

Similar to [add_cfunc](#targetadd_cfunc), only the function interface detected is a c++ function.

##### target:add_cfuncs

###### Add c functions for checking

<p class="warning">
This interface is the interface shared by `target` and `option`, but the interface behavior is slightly different.
</p>

| Interface Field | Description | Examples |
| ------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| target | header files, link libraries, and function interfaces are also specified | `add_cfuncs("libc", nil, {"signal.h", "setjmp.h"}, "signal", "setjmp", "sigsetjmp{sigjmp_buf buf ; sigsetjmp(buf, 0);}", "kill")` |
Option | only specifies the function interface, the header file depends on [add_cincludes] (#targetadd_cincludes) and other independent interfaces | `add_cincludes("setjmp.h")` `add_cfuncs("sigsetjmp")` |

For `option`, this interface is very simple to use, similar to [add_cincludes](#targetadd_cincludes), for example:

```lua
option("setjmp")
    set_default(false)
    add_cincludes("setjmp.h")
    add_cfuncs("sigsetjmp", "setjmp")
    add_defines("HAVE_SETJMP")

target("test")
    add_options("setjmp")
```

This option detects if there are some interfaces of `setjmp`. If the test passes, then the `test` target program will add the macro definition of `HAVE_SETJMP`.

<p class="warning">
Note that using this interface to detect dependencies in `option` requires adding a separate [add_cincludes](#targetadd_cincludes) header file search path and specifying [add_links](#targetadd_links) link library (optional). Otherwise the specified function is not detected.
<br><br>
And some header file interfaces are defined by macro switches, so it is best to pass the dependent macro switch with [add_defines](#targetadd_defines) when detecting.
</p>

For `target`, this interface can be set at the same time: dependent header files, dependent link modules, dependent function interfaces, to ensure the integrity of the detection environment, for example:

```lua
target("test")

    -- Add libc library interface related detection
    -- First parameter: module name for the final macro definition prefix generation
    -- The second parameter: the link library
    -- The third parameter: header file
    -- after the list of function interfaces
    add_cfuncs("libc", nil, {"signal.h", "setjmp.h"}, "signal", "setjmp", "sigsetjmp{sigjmp_buf buf; sigsetjmp(buf, 0);}", "kill")

    -- Add the pthread library interface related detection, and specify whether you need to detect the existence of the `libpthread.a` link library.
    add_cfuncs("posix", "pthread", "pthread.h", "pthread_mutex_init",
                                                                        "pthread_create",
                                                                        "pthread_setspecific",
                                                                        "pthread_getspecific",
                                                                        "pthread_key_create",
                                                                        "pthread_key_delete")
```

Set the `test` target, rely on these interfaces, pre-detect them when building, and automatically generate header files if set via the [set_config_h](#targetset_config_h) interface: `config.h`

Then, the test result will be automatically added to the corresponding `config.h`, which is also the function that `option` does not have, for example:

```c
#define TB_CONFIG_LIBC_HAVE_SIGNAL 1
#define TB_CONFIG_LIBC_HAVE_SETJMP 1
#define TB_CONFIG_LIBC_HAVE_SIGSETJMP 1
#define TB_CONFIG_LIBC_HAVE_KILL 1

#define TB_CONFIG_POSIX_HAVE_PTHREAD_MUTEX_INIT 1
#define TB_CONFIG_POSIX_HAVE_PTHREAD_CREATE 1
#define TB_CONFIG_POSIX_HAVE_PTHREAD_SETSPECIFIC 1
#define TB_CONFIG_POSIX_HAVE_PTHREAD_GETSPECIFIC 1
#define TB_CONFIG_POSIX_HAVE_PTHREAD_KEY_CREATE 1
#define TB_CONFIG_POSIX_HAVE_PTHREAD_KEY_DELETE 1
```

Because, in different header files, functions are defined in different ways, such as macro functions, static inline functions, extern functions, and so on.

To fully test the success, the grammar requires a certain degree of flexibility. Here are some grammar rules:

| Detection Syntax | Examples |
| ------------- | ----------------------------------------------- |
| pure function name | `sigsetjmp` |
| Single line call | `sigsetjmp((void*)0, 0)` |
| Function Block Call | `sigsetjmp{sigsetjmp((void*)0, 0);}` |
| Function Block + Variable | `sigsetjmp{int a = 0; sigsetjmp((void*)a, a);}` |

##### target:add_cxxfuncs

###### Add c++ functions for checking

Similar to [add_cfuncs](#targetadd_cfuncs), only the function interface detected is a c++ function.

##### target:add_options

###### Add option dependencies

This interface is similar to [set_options](#targetset_options), the only difference is that this is an append option, and [set_options](#targetset_options) overrides the previous settings each time.

##### target:add_packages

###### Add package dependencies

In the target scope, add integration package dependencies, for example:

```lua
target("test")
    add_packages("zlib", "polarssl", "pcre", "mysql")
```

In this way, when compiling the test target, if the package exists, the macro definition, the header file search path, and the link library directory in the package will be automatically appended, and all the libraries in the package will be automatically linked.

Users no longer need to call the [add_links](#targetadd_links), [add_includedirs](#targetadd_includedirs), [add_ldflags](#targetadd_ldflags) interfaces to configure the dependent library links.

For how to set up the package search directory, please refer to: [add_packagedirs] (#targetadd_packagedirs) interface

After v2.2.2, this interface also supports packages defined by [add_requires](#add_requires) in remote dependency management.

```lua
add_requires("zlib", "polarssl")
target("test")
    add_packages("zlib", "polarssl")
```

After v2.2.3, it also supports overwriting built-in links to control the actual linked libraries:


```lua
-- By default, there will be links to ncurses, panel, form, etc.
add_requires("ncurses")

target("test")

    -- Display specified, only use ncurses a link library
    add_packages("ncurses", {links = "ncurses"})
```

Or simply disable links and only use header files:

```lua
add_requires("lua")
target("test")
    add_packages("lua", {links = {}})
```

##### target:add_languages

###### Add language standards

Similar to [set_languages](#targetset_languages), the only difference is that this interface will not overwrite the previous settings, but append settings.

##### target:add_vectorexts

###### Add vector extensions

Add extended instruction optimization options, currently supports the following extended instruction sets:

```lua
add_vectorexts("mmx")
add_vectorexts("neon")
add_vectorexts("avx", "avx2")
add_vectorexts("sse", "sse2", "sse3", "ssse3")
```

<p class="tip">
If the currently set instruction set compiler does not support it, xmake will automatically ignore it, so you don't need the user to manually determine the maintenance. Just set all the instruction sets you need.
</p>

##### target:add_frameworks

###### Add frameworks

Currently used for the `objc` and `swift` programs of the `ios` and `macosx` platforms, for example:

```lua
target("test")
    add_frameworks("Foundation", "CoreFoundation")
```

Of course, you can also use [add_mxflags](#targetadd_mxflags) and [add_ldflags](#targetadd_ldflags) to set them up, but it is cumbersome and is not recommended.

```lua
target("test")
    add_mxflags("-framework Foundation", "-framework CoreFoundation")
    add_ldflags("-framework Foundation", "-framework CoreFoundation")
```

If it is not for both platforms, these settings will be ignored.

##### target:add_frameworkdirs

###### Add framework search directories

For some third-party frameworks, it is impossible to find them only through [add_frameworks](#targetadd_frameworks). You also need to add a search directory through this interface.

```lua
target("test")
    add_frameworks("MyFramework")
    add_frameworkdirs("/tmp/frameworkdir", "/tmp/frameworkdir2")
```

##### target:set_tools

###### Set toolchains

For the source files added by `add_files("*.c")`, the default is to call the system's best matching compiler to compile, or manually modify it by `xmake f --cc=clang` command, but these are Globally affects all target targets.

If there are some special requirements, you need to specify a different compiler, linker or specific version of the compiler for a specific target target under the current project. At this time, the interface can be used for purposes. For example:

```lua
target("test1")
    add_files("*.c")

target("test2")
    add_files("*.c")
    set_tools("cc", "$(projectdir)/tools/bin/clang-5.0")
```

The above description only makes special settings for the compiler of the test2 target, compiling test2 with a specific clang-5.0 compiler, and test1 still uses the default settings.

For setting multiple compiler types at the same time, you can write:

```lua
set_tools {
    cc = path.join(os.projectdir(), "tools/bin/clang-5.0"),
    mm = path.join(os.projectdir(), "tools/bin/clang-5.0"),
}
```

<p class="tip">
Each setting will override the previous setting under the current target target. Different targets will not be overwritten and independent of each other. If set in the root domain, all child targets will be affected.
</p>

Or you can use [add_tools](#targetadd_tools) to set:

```lua
add_tools("cc", "$(projectdir)/tools/bin/clang-5.0")
add_tools("mm", "$(projectdir)/tools/bin/clang-5.0")
```

The previous parameter is key, which is used to specify the tool type. Currently supported (compiler, linker, archiver):

| Tool Type | Description |
| ------------ | ------------------------------------ |
| cc | c compiler |
| cxx | c++ compiler |
| mm | objc compiler |
| mxx | objc++ compiler |
| gc | go compiler |
| as | assembler |
| sc | swift compiler |
| rc | rust compiler |
| dc | dlang compiler |
| ld | Common executable program linker such as c/c++/asm/objc |
| sh | c/c++/asm/objc and other universal dynamic library linker |
| ar | general static library archiver such as c/c++/asm/objc |
| dc-ld | dlang executable linker, rc-ld/gc-ld, etc. |
Dc-sh | dlang dynamic library linker, rc-sh/gc-sh, etc. |

For some compiler file names that are irregular, causing xmake to fail to recognize the known compiler name, we can also add a tool name prompt, for example:

```lua
add_tools("cc", "gcc@$(projectdir)/tools/bin/Mipscc.exe")
```

The above description sets mipscc.exe as the c compiler, and prompts xmake to compile as a pass-through processing method for gcc.

##### target:add_tools

###### Add toolchains

Similar to [set_tools](#targetset_tools), the difference is that this interface can be called multiple times to add multiple tools, and [set_tools](#targetset_tools) will overwrite the previous settings each time.

##### target:set_values

###### Set custom configuration values

Set some extended configuration values ​​for the target. These configurations do not have a built-in api like `set_ldflags`. You can extend the configuration by passing in a configuration name with the first argument.
Generally used to pass configuration parameters to scripts in custom rules, for example:

```lua
rule("markdown")
    on_build_file(function (target, sourcefile)
        -- compile .markdown with flags
        local flags = target:values("markdown.flags")
        if flags then
            -- ..
        end
    end)

target("test")
    add_files("src/*.md", {rule = "markdown"})
    set_values("markdown.flags", "xxx", "xxx")
```

In the above code example, it can be seen that when the target applies the markdown rule, some flag values ​​are set by set_values ​​and provided to the markdown rule for processing.
In the rule script, you can get the extended flag value set in the target by `target:values("markdown.flags")`.

<p class="tip">
The specific extension configuration name will be different according to different rules. Currently, you can refer to the description of related rules: [built-in rules] (#built-in rules)
</p>

##### target:add_values

###### Add custom configuration values

Usage is similar to [target:set_values](#targetset_tools), the difference is that this interface is an additional setting, and will not override the settings each time.

##### target:set_installdir

###### Set the installation directory

By default, `xmake install` will be installed to the system `/usr/local` directory. We can specify other installation directories except `xmake install -o /usr/local`.
You can also set a different installation directory for the target in xmake.lua instead of the default directory.

##### target:set_configdir

###### Set the output directory of configuration files

Version 2.2.5 adds a new interface, mainly used for the output directory of the template configuration file set by the [add_configfiles] (#targetadd_configfiles) interface.

##### target:set_configvar

###### Set template configuration variable

2.2.5 version of the new interface, used to add some template configuration variables that need to be pre-compiled before compilation, generally used for [add_configfiles] (#targetadd_configfiles) interface.

##### target:add_configfiles

###### Add template configuration files

2.2.5 version of the new interface, used to add some configuration files that need to be pre-processed before compiling, used to replace the old interface such as [set_config_header] (#targetset_config_header).

Because this interface is more versatile, it is not only used to handle the automatic generation and preprocessing of config.h, but also to handle various file types, while `set_config_header` is only used to process header files and does not support template variable substitution.

Let's start with a simple example:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_configdir("$(buildir)/config")
    add_configfiles("src/config.h.in")
```

The above settings will automatically configure the `config.h.in` header file template before compiling. After preprocessing, it will generate the output to the specified `build/config/config.h`.

If `set_configdir` is not set, the default output is in the `build` directory.

The `.in` suffix will be automatically recognized and processed. If you want to store the output as a different file name, you can pass:

```lua
add_configfiles("src/config.h", {filename = "myconfig.h"})
```

The way to rename the output, again, this interface is similar to [add_installfiles](#targetadd_configfiles), which also supports prefixdir and subdirectory extraction settings:

```lua
add_configfiles("src/*.h.in", {prefixdir = "subdir"})
add_configfiles("src/(tbox/config.h)")
```

One of the most important features of this interface is that it can be preprocessed and replaced with some of the template variables in the preprocessing, for example:

Config.h.in

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

The template variable is set via the [set_configvar](#targetset_configvar) interface, and the substitution is handled by the variable set in `{variables = {xxx = ""}}`.

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

E.g:

Config.h.in

```c
#define CONFIG_VERSION "${VERSION}"
#define CONFIG_VERSION_MAJOR ${VERSION_MAJOR}
#define CONFIG_VERSION_MINOR ${VERSION_MINOR}
#define CONFIG_VERSION_ALTER ${VERSION_ALTER}
#define CONFIG_VERSION_BUILD ${VERSION_BUILD}
```

Config.h

```c
#define CONFIG_VERSION "1.6.3"
#define CONFIG_VERSION_MAJOR 1
#define CONFIG_VERSION_MINOR 6
#define CONFIG_VERSION_ALTER 3
#define CONFIG_VERSION_BUILD 201902031401
```

We can also perform some variable state control processing on the `#define` definition:

Config.h.in

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

    -- If the foo option is enabled -> Tianjian FOO_ENABLE and FOO_STRING definitions
    add_options("foo")
```

Config.h.in

```c
${define FOO_ENABLE}
${define FOO_STRING}
```

Config.h

```c
#define FOO_ENABLE 1
#define FOO_STRING "foo"
```

Regarding the option option detection, and the automatic generation of config.h, there are some helper functions, you can look at it: https://github.com/xmake-io/xmake/issues/342

In addition to `#define`, if you want to other non-##defIne xxx` also performs state switching processing. You can use the `${default xxx 0}` mode to set default values, for example:

```
HAVE_SSE2 equ ${default VAR_HAVE_SSE2 0}
```

After `set_configvar("HAVE_SSE2", 1)` is enabled, it becomes `HAVE_SSE2 equ 1`. If no variable is set, the default value is used: `HAVE_SSE2 equ 0`

For a detailed description of this, see: https://github.com/xmake-io/xmake/issues/320


#### Configuration Option

Define and set option switches. Each `option` corresponds to an option that can be used to customize the build configuration options and switch settings.

<p class="tip">
All domain interfaces except `target`, such as `option`, `task`, etc., cannot be placed in the outer global scope by default (unless some interfaces are shared with the target).
If you want to set the value to affect all options such as `option`, `task`, you can set it by anonymous global domain.
</p>

E.g:

```lua
-- Enter the anonymous global domain of the option, the settings inside will affect the test and test2 options.
option()
    add_defines("DEBUG")

option("test")
    -- ...
    -- Try to keep indented, because all settings after this are for the test option.

option("test2")
    -- ...
```

<p class="tip">
The `option` field can be repeatedly entered to implement separate settings. If you want to display the scope settings away from the current option, you can manually call the [option_end](#option_end) interface.
</p>


| Interface | Description | Supported Versions |
| ----------------------------------------------------- | -------------------------------------------- | -------- |
| [option](#option) | Define Options | >= 2.0.1 |
| [option_end](#option_end) | End Definition Options | >= 2.1.1 |
| [add_deps](#optionadd_deps) | Add Options Dependencies | >= 2.1.5 |
| [before_check](#optionbefore_check) | Execute this script before option detection | >= 2.1.5 |
| [on_check](#optionon_check) | Custom Option Detection Script | >= 2.1.5 |
| [after_check](#optionafter_check) | Execute this script after option detection | >= 2.1.5 |
| [set_values](#optionset_values) | Setting the list of option values ​​| >= 2.1.9 |
| [set_default](#optionset_default) | Set Defaults | >= 2.0.1 |
| [set_showmenu](#optionset_showmenu) | Set whether to enable menu display | >= 1.0.1 |
| [set_category](#optionset_category) | Set option categories, only for menu display | >= 1.0.1 |
| [set_description](#optionset_description) | Settings Menu Display Description | >= 1.0.1 |
| [add_links](#optionadd_links) | Add Linked Library Detection | >= 1.0.1 |
| [add_linkdirs](#optionadd_linkdirs) | Add a search directory for link library detection | >= 1.0.1 |
| [add_rpathdirs](#optionadd_rpathdirs) | Add runtime dynamic link library search directory | >= 2.1.3 |
| [add_cincludes](#optionadd_cincludes) | Add c header file detection | >= 1.0.1 |
| [add_cxxincludes](#optionadd_cxxincludes) | Add c++ header file detection | >= 1.0.1 |
| [add_ctypes](#optionadd_ctypes) | Add c type detection | >= 1.0.1 |
| [add_cxxtypes](#optionadd_cxxtypes) | Add c++ type detection | >= 1.0.1 |
| [add_csnippet](#optionadd_csnippet) | Add c-code snippets detection | >= 2.1.5 |
| [add_cxxsnippet](#optionadd_cxxsnippet) | Add c++ code snippet detection | >= 2.1.5 |
| [set_warnings](#targetset_warnings) | Setting the warning level | >= 1.0.1 |
| [set_optimize](#targetset_optimize) | Setting the optimization level | >= 1.0.1 |
| [set_languages](#targetset_languages) | Setting the Code Language Standard | >= 1.0.1 |
| [add_includedirs](#targetadd_includedirs) | Add Header Search Directory | >= 1.0.1 |
| [add_defines](#targetadd_defines) | Add Macro Definition | >= 1.0.1 |
| [add_undefines](#targetadd_undefines) | Cancel Macro Definition | >= 1.0.1 |
| [add_defines_h](#targetadd_defines_h) | Add macro definitions to header files | >= 1.0.1 |
| [add_undefines_h](#targetadd_undefines_h) | Cancel macro definition to header file | >= 1.0.1 |
| [add_cflags](#targetadd_cflags) | Add c Compile Options | >= 1.0.1 |
| [add_cxflags](#targetadd_cxflags) | Add c/c++ Compile Options | >= 1.0.1 |
| [add_cxxflags](#targetadd_cxxflags) | Add c++ Compile Options | >= 1.0.1 |
| [add_mflags](#targetadd_mflags) | Add objc compile options | >= 2.0.1 |
| [add_mxflags](#targetadd_mxflags) | Add objc/objc++ Compile Options | >= 2.0.1 |
| [add_mxxflags](#targetadd_mxxflags) | Add objc++ Compile Options | >= 2.0.1 |
| [add_scflags](#targetadd_scflags) | Add swift compile options | >= 2.1.1 |
| [add_asflags](#targetadd_asflags) | Add assembly compile options | >= 2.1.1 |
| [add_gcflags](#targetadd_gcflags) | Add go compile options | >= 2.1.1 |
|[add_dcflags](#targetadd_dcflags) | Add dlang compile options | >= 2.1.1 |
| [add_rcflags](#targetadd_rcflags) | Add rust compile option | >= 2.1.1 |
| [add_cuflags](#targetadd_cuflags) | Add cuda compile options | >= 2.2.1 |
| [add_ldflags](#targetadd_ldflags) | Add Link Options | >= 2.1.1 |
| [add_arflags](#targetadd_arflags) | Add Static Library Archive Options | >= 2.1.1 |
| [add_shflags](#targetadd_shflags) | Add Dynamic Library Link Options | >= 2.0.1 |
| [add_cfuncs](#targetadd_cfuncs) | Add c library function detection | >= 1.0.1 |
| [add_cxxfuncs](#targetadd_cxxfuncs) | Add C++ Library Function Interface | >= 1.0.1 |
| [add_languages](#targetadd_languages) | Add Language Standards | >= 2.0.1 |
| [add_vectorexts](#targetadd_vectorexts) | Add Vector Extension Instructions | >= 2.0.1 |
| [add_frameworks](#targetadd_frameworks) | Add Linked Framework | >= 2.1.1 |
| [add_frameworkdirs](#targetadd_frameworkdirs) | Add Linked Framework | >= 2.1.5 |

| Obsolete Interface | Description | Supported Version |
| ----------------------------------------------------- | -------------------------------------------- | ---------------- |
| [add_bindings](#optionadd_bindings) | Add Forward Association Options, Sync Enable and Disable | >= 2.0.1 < 2.1.5 |
| [add_rbindings](#optionadd_rbindings) | Add reverse association option, sync enable and disable | >= 2.0.1 < 2.1.5 |
| [add_defines_if_ok](#optionadd_defines_if_ok) | Add macro definitions if the detection option passes | >= 1.0.1 < 2.1.5 |
| [add_defines_h_if_ok](#optionadd_defines_h_if_ok) | Add macro definitions to the configuration header if the detection option passes | >= 1.0.1 < 2.1.5 |
| [add_undefines_if_ok](#optionadd_undefines_if_ok) | Cancel macro definition if detection option passes | >= 1.0.1 < 2.1.5 |
| [add_undefines_h_if_ok](#optionadd_undefines_h_if_ok) | If the detection option passes, cancel the macro definition in the configuration header file | >= 1.0.1 < 2.1.5 |

##### option

###### Defining options

Define and set option switches for custom compilation configuration options, switch settings.

For example, define an option to enable test:

```lua
option("test")
    set_default(false)
    set_showmenu(true)
    add_defines("TEST")
```

Then associate it with the specified target:

```lua
target("demo")
    add_options("test")
```

Thus, if an option is defined, if this option is enabled, the macro definition of `-DTEST` will be automatically added when compiling the target.

```lua
# Manually enable this option
$ xmake f --test=y
$ xmake
```

##### option_end

###### End definition option

This is an optional api that shows the departure option scope, similar to [target_end](#target_end).

##### option:add_deps

###### Adding options depends

By setting the dependency, you can adjust the detection order of the options, which is generally used when the detection script is called by [on_check](#optionon_check).

```lua
option("small")
    set_default(true)
    on_check(function (option)
        -- ...
    end)

option("test")
    add_deps("small")
    set_default(true)
    on_check(function (option)
        if option:dep("small"):enabled() then
            option:enable(false)
        end
    end)
```

After the detection of the dependent small option is completed, the state of the option of the test is controlled by judging the state of the small option.

##### option:before_check

Execute this script before option detection

For example: before testing, find the package by [find_package](#detect-find_package), and add information such as `links`, `includedirs` and `linkdirs` to the option.
Then start the option detection, and then automatically link to the target after passing.

```lua
option("zlib")
    before_check(function (option)
        import("lib.detect.find_package")
        option:add(find_package("zlib"))
    end)
```

##### option:on_check

###### Custom Option Detection Script

This script overrides the built-in option detection logic.

```lua
option("test")
    add_deps("small")
    set_default(true)
    on_check(function (option)
        if option:dep("small"):enabled() then
            option:enable(false)
        end
    end)
```

If the option that test depends on passes, disable the test option.

##### option:after_check

Execute this script after option detection

After the option detection is complete, execute this script for some post-processing, or you can re-disable the option at this time:

```lua
option("test")
    add_deps("small")
    add_links("pthread")
    after_check(function (option)
        option:enable(false)
    end)
```

##### option:set_values

###### Setting the list of option values

For the graphical menu configuration of `xmake f --menu` only, a list of option values ​​is provided for quick selection by the user, for example:

```lua
option("test")
    set_default("b")
    set_showmenu(true)
    set_values("a", "b", "c")
```

The effect chart is as follows:

<img src="/assets/img/manual/option_set_values.png" width="60%" />

##### option:set_default

###### Setting options defaults

When the option value is not modified by the command `xmake f --option=[y|n}`, the option itself has a default value, which can be set through this interface:

```lua
option("test")
    -- This option is disabled by default
    set_default(false)
```

The value of the option supports not only the boolean type but also the string type, for example:

```lua
option("test")
    set_default("value")
```

| Value Type | Description                                                     | Configuration                                   |
| ------     | --------------------------------------                          | ----------------------------------------------- |
| boolean    | Typically used as a parameter switch, value range: `true/false` | `xmake f --optionname=[y/n/yes/no/true/false]`  |
| string     | can be any string, generally used for pattern judgment          | `xmake f --optionname=value`                    |

If it is an option of the `boolean` value, it can be judged by [is_option](#is_option), and the option is enabled.

If it is an option of type `string`, it can be used directly in built-in variables, for example:

```lua
-- Define a path configuration option, using the temporary directory by default
option("rootdir")
    set_default("$(tmpdir)")Set_showmenu(true)

target("test")
    -- Add source files in the specified options directory
    add_files("$(rootdir)/*.c")
```

Among them, `$(rootdir)` is a custom option built-in variable, which can be dynamically modified by manual configuration:

```bash
$ xmake f --rootdir=~/projectdir/src
$ xmake
```

Specify a different source directory path for this `rootdir` option and compile it.

Detection behavior of the option:

| default value | detection behavior |
| ----------    | --------------------------------------------------------------------------------------------- |
| No setting    | Priority manual configuration modification, disabled by default, otherwise automatic detection, can automatically switch boolean and string type according to the type of value manually passed in |
| false         | switch option, not automatic detection, disabled by default, can be manually configured to modify |
| true          | switch option, not automatic detection, enabled by default, can be manually configured to modify |
| string type   | no switch state, no automatic detection, can be manually configured and modified, generally used for configuration variable transfer |

##### option:set_showmenu

###### Set whether to enable menu display

If set to `true`, then this option will appear in `xmake f --help`, which can also be configured via `xmake f --optionname=xxx`, otherwise it can only be used inside `xmake.lua` , the modification cannot be configured manually.

```lua
option("test")
    set_showmenu(true)
```

After setting the menu to enable, execute `xmake f --help` to see that there is one more item in the help menu:

```
Options:
    ...

    --test=TEST
```

##### option:set_category

###### Setting option categories, only for menu display

This is an optional configuration, only used in the help menu, the classification display options, the same category of options, will be displayed in the same group, so the menu looks more beautiful.

E.g:

```lua
option("test1")
    set_showmenu(true)
    set_category("test")

option("test2")
    set_showmenu(true)
    set_category("test")

option("demo1")
    set_showmenu(true)
    set_category("demo")

option("demo2")
    set_showmenu(true)
    set_category("demo")
```

The four options here are grouped into two groups: `test` and `demo`, and the layout shown is similar to this:

```bash
Options:
    ...

    --test1=TEST1
    --test2=TEST2

    --demo1=DEMO1
    --demo2=DEMO2
```

This interface is just to adjust the display layout, more beautiful, no other use.

In version 2.1.9, the hierarchical path name `set_category("root/submenu/submenu2")` can be set via category to configure the graphical menu interface of `xmake f --menu`, for example:

```lua
-- 'boolean' option
option("test1")
    set_default(true)
    set_showmenu(true)
    set_category("root menu/test1")

-- 'choice' option with values: "a", "b", "c"
option("test2")
    set_default("a")
    set_values("a", "b", "c")
    set_showmenu(true)
    set_category("root menu/test2")

-- 'string' option
option("test3")
    set_default("xx")
    set_showmenu(true)
    set_category("root menu/test3/test3")

-- 'number' option
option("test4")
    set_default(6)
    set_showmenu(true)
    set_category("root menu/test4")
```

The menu interface path structure finally displayed in the above configuration:

- root menu
  - test1
  - test2
  - test3
    - test3
  - test4

The effect chart is as follows:

<img src="/assets/img/manual/option_set_category.gif" width="60%" />

##### option:set_description

###### Setting menu display description

When the option menu is displayed, the description on the right is used to help the user know more clearly about the purpose of this option, for example:

```lua
option("test")
    set_default(false)
    set_showmenu(true)
    set_description("Enable or disable test")
```

The generated menu contents are as follows:

```
Options:
    ...

    --test=TEST Enable or disable test (default: false)
```

This interface also supports multi-line display and outputs more detailed description information, such as:

```lua
option("mode")
    set_default("debug")
    set_showmenu(true)
    set_description("Set build mode",
                    " - debug",
                    " - release",
                    "-profile")
```

The generated menu contents are as follows:

```
Options:
    ...

    --mode=MODE Set build mode (default: debug)
                                          - debug
                                          - release
                                          - profile
```

When you see this menu, the user can clearly know the specific use of the defined `mode` option and how to use it:

```bash
$ xmake f --mode=release
```

##### option:add_bindings

###### Add forward association option, sync enable and disable

<p class="tip">
After the 2.1.5 version has been deprecated, please use [add_deps](#optionadd_deps), [on_check](#optionon_check), [after_check](#optionafter_check) and other interfaces instead.
</p>

Bind association options, for example I want to configure a `smallest` parameter on the command line: `xmake f --smallest=y`

At this time, it is necessary to disable multiple other option switches at the same time to prohibit compiling multiple modules. This is the requirement, which is equivalent to the linkage between one option and other options.

This interface is used to set some association options that need to be forward bound, for example:

```lua
-- Define option switches: --smallest=y|n
option("smallest")

    -- Add forward binding. If smallest is enabled, all of the following option switches will also be enabled synchronously.
    add_bindings("nozip", "noxml", "nojson")
```

##### option:add_rbindings

###### Add reverse association option, sync enable and disable

<p class="tip">
After the 2.1.5 version has been deprecated, please use [add_deps](#optionadd_deps), [on_check](#optionon_check), [after_check](#optionafter_check) and other interfaces instead.
</p>

Reverse binding association options, the switch state of the associated option is reversed.

```lua
-- Define option switches: --smallest=y|n
option("smallest")

    -- Add reverse binding, if smallest is enabled, all modules below are disabled
    add_rbindings("xml", "zip", "asio", "regex", "object", "thread", "network", "charset", "database")
    add_rbindings("zlib", "mysql", "sqlite3", "openssl", "polarssl", "pcre2", "pcre", "base")
```

<p class="warning">
It should be noted that the command line configuration is sequential. You can disable all modules by enabling smallest and then add other options to enable them one by one.
</p>

E.g:

```bash
-- disable all modules and then only enable xml and zip modules
$ xmake f --smallest=y --xml=y --zip=y
```

##### option:add_links

###### Add Link Library Detection

If the specified link library is passed, this option will be enabled and the associated target will automatically be added to this link, for example:

```lua
option("pthread")
    set_default(false)
    add_links("pthread")
    add_linkdirs("/usr/local/lib")

target("test")
    add_options("pthread")
```

If the test passes, the `test` target will be automatically added when it is compiled: `-L/usr/local/lib -lpthread` compile option


##### option:add_linkdirs

###### Adding the search directory needed for link library detection

This is optional. Generally, the system library does not need to add this, and it can also pass the test. If it is not found, you can add the search directory yourself to improve the detection pass rate. For details, see: [add_links](#optionadd_links)

##### optiOn:add_rpathdirs

###### Adding a load search directory for a dynamic library at runtime

After the option passes the detection, it will be automatically added to the corresponding target. For details, see: [target.add_rpathdirs](#targetadd_rpathdirs).

##### option:add_cincludes

###### Add c header file detection

This option will be enabled if the c header file is passed, for example:

```lua
option("pthread")
    set_default(false)
    add_cincludes("pthread.h")
    add_defines("ENABLE_PTHREAD")

target("test")
    add_options("pthread")
```

This option checks if there is a `pthread.h` header file. If the test passes, then the `test` target program will add the macro definition of `ENABLE_PTHREAD`.

If you want more flexible detection, you can do this in [option.on_check](#optionon_check) via [lib.detect.has_cincludes](#detect-has_cincludes).

##### option:add_cxxincludes

###### Add c++ header file detection

Similar to [add_cincludes](#optionadd_cincludes), except that the detected header file type is a c++ header file.

##### option:add_ctypes

###### Add c type detection

This option will be enabled if the c type is passed, for example:

```lua
option("wchar")
    set_default(false)
    add_cincludes("wchar_t")
    add_defines("HAVE_WCHAR")

target("test")
    add_options("wchar")
```

This option checks if there is a type of `wchar_t`. If the test passes, then the `test` target program will add the macro definition of `HAVE_WCHAR`.

If you want more flexible detection, you can do this in [option.on_check](#optionon_check) via [lib.detect.has_ctypes](#detect-has_ctypes).

##### option:add_cxxtypes

###### Adding c++ type detection

Similar to [add_ctypes](#optionadd_ctypes), except that the type detected is a c++ type.

##### option:add_csnippet

###### Add c code fragment detection

If the existing [add_ctypes](#optionadd_ctypes), [add_cfuncs](#optionadd_cfuncs), etc. cannot meet the current detection requirements,
You can use this interface to implement more custom detection of some compiler feature detection, see: [add_cxxsnippet](#optionadd_cxxsnippet).

##### option:add_cxxsnippet

###### Adding c++ code snippet detection

This interface can be used to implement more custom detection of some compiler feature detection, especially the detection support of various features of C++, such as:

```lua
option("constexpr")
    add_cxxsnippet("constexpr", "constexpr int f(int x) { int sum=0; for (int i=0; i<=x; ++i) sum += i; return sum; } constexpr int x = f (5); static_assert(x == 15);")
```

The first parameter sets the name of the code snippet as a label, and is displayed when the output information is detected.

The above code implements the detection of the constexpr feature of C++. If the test passes, the constexpr option is enabled. Of course, this is just an example.

For the detection of compiler features, there is a more convenient and efficient detection module, providing more powerful detection support, see: [compiler.has_features] (#compiler-has_features) and [detect.check_cxsnippets] (#detect-check_cxsnippets)

If you want more flexible detection, you can do this in [option.on_check](#optionon_check) via [lib.detect.check_cxsnippets](#detect-check_cxsnippets).

##### option:add_defines_if_ok

###### Add macro definition if the detection option is passed

<p class="tip">
After the 2.1.5 version has been deprecated, please use the [add_defines] (#targetadd_defines) interface instead.
</p>

The detection options will not be set until they are passed. See the example in [add_cincludes](#optionadd_cincludes) for details.

##### option:add_defines_h_if_ok

###### If the detection option is passed, add the macro definition to the configuration header file.

<p class="tip">
After the 2.1.5 version has been deprecated, please use the [add_defines_h] (#targetadd_defines_h) interface instead.
</p>

Similar to [add_defines_if_ok](#optionadd_defines_if_ok), the macro definitions are automatically added to the `config.h` header file after the test is passed.

E.g:

```lua
option("pthread")
    set_default(false)
    add_cincludes("pthread.h")
    add_defines_h_if_ok("ENABLE_PTHREAD")

target("test")
    add_options("pthread")
```

After passing, it will be added to `config.h`:

```c
#define ENABLE_PTHREAD 1
```

How to set the specific `config.h`, see: [set_config_h](#targetset_config_h)

##### option:add_undefines_if_ok

###### If the detection option is passed, cancel the macro definition

<p class="tip">
After the 2.1.5 version has been deprecated, please use the [add_undefines](#targetadd_undefines) interface instead.
</p>

Similar to [add_defines_if_ok](#optionadd_defines_if_ok), except that the macro definition is canceled after the pass is detected.

##### option:add_undefines_h_if_ok

###### If the detection option is passed, the macro definition is canceled in the configuration header file.

<p class="tip">
Deprecated after version 2.1.5, please use [add_undefines_h](#targetadd_undefines_h) interface instead.
</p>

Similar to [add_defines_h_if_ok](#optionadd_defines_h_if_ok), the macro definition will be canceled in `config.h` after the test is passed.

```c
#undef DEFINED_MACRO
```

How to set the specific `config.h`, see: [set_config_h](#targetset_config_h)

#### Plugin and Task

Xmake can implement custom tasks or plugins. The core of both is the `task` task. The two are actually the same. The xmake plugins are implemented with `task`.

In essence, they are tasks, except that the [set_category](#taskset_category) classification is different.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [task](#task) | Define plugins or tasks | >= 2.0.1 |
| [task_end](#task_end) | End defining plugins or tasks | >= 2.1.1 |
| [set_menu](#taskset_menu) | Set Task Menu | >= 2.0.1 |
| [set_category](#taskset_category) | Set Task Category | >= 2.0.1 |
| [on_run](#taskon_run) | Set Task Run Script | >= 2.0.1 |

##### task

###### Defining plugins or tasks

The `task` field is used to describe a custom task implementation, in the same level as [target](#target) and [option](#option).

For example, here is a simple task defined:

```lua
task("hello")

    -- Set the run script
    on_run(function ()
        print("hello xmake!")
    end)
```

This task only needs to print `hello xmake!`, how do you run it?

Since the [set_menu](#taskset_menu) setting menu is not used here, this task can only be called inside the custom script of `xmake.lua` or other tasks, for example:

```lua
target("test")

    after_build(function (target)

        -- Import task module
        import("core.project.task")

        -- Run the hello task
        task.run("hello")
    end)
```

Run the `hello` task after building the `test` target.

##### task_end

###### End defining plugins or tasks

This is an optional api that shows the departure option scope, similar to [target_end](#target_end).

##### task:set_menu

###### Setting the task menu

By setting a menu, this task can be opened to the user to manually call through the command line. The menu settings are as follows:

```lua
task("echo")

    -- Set the run script
    on_run(function ()

        -- Import parameter option module
        import("core.base.option")

        -- Initialize color mode
        local modes = ""
        for _, mode in ipairs({"bright", "dim", "blink", "reverse"}) do
            if option.get(mode) then
                modes = modes .. " " .. mode
            end
        end

        -- Get parameter content and display information
        cprint("${%s%s}%s", option.get("color"), modes, table.concat(option.get("contents") or {}, " "))
    end)

    -- Set the command line options for the plugin. There are no parameter options here, just the plugin description.
    set_menu {
                -- Settings menu usage
                usage = "xmake echo [options]"

                -- Setup menu description
            , description = "Echo the given info!"

                -- Set menu options, if there are no options, you can set it to {}
            , options =
                {
                    -- Set k mode as key-only bool parameter
                    {'b', "bright", "k", nil, "Enable bright." }
                , {'d', "dim", "k", nil, "Enable dim." }
                , {'-', "blink", "k", nil, "Enable blink." }
                , {'r', "reverse", "k", nil, "Reverse color." }

                    -- When the menu is displayed, a blank line
                , {}

                    -- Set kv as the key-value parameter and set the default value: black
                , {'c', "color", "kv", "black", "Set the output color."
                                                     , " - red"
                                                     , " - blue"
                                                     , " - yellow"
                                                     , " - green"
                                                     , " - magenta"
                                                     , " - cyan"
                                                     , " - white" }

                    -- Set `vs` as a value multivalued parameter and a `v` single value type
                    -- generally placed last, used to get a list of variable parameters
                , {}
                , {nil, "contents", "vs", nil, "The info contents." }
                }
            }
```

After defining this task, execute `xmake --help` and you will have one more task item:

```
Tasks:

    ...

    Echo Echo the given info!
```

If the classification is `plugin` by [set_category](#taskset_category), then this task is a plugin:

```
Plugins:

    ...

    Echo Echo the given info!
```

To run this task manually, you can execute:

```bash
$ xmake echo hello xmake!
```

Just fine, if you want to see the menu defined by this task, you only need to execute: `xmake echo [-h|--help]`, the result is as follows:

```bash
Usage: $xmake echo [options]

Echo the given info!

Options:
    -v, --verbose Print lots of verbose information.
        --backtrace Print backtrace information for debugging.
        --profile Print performance data for debugging.
        --version Print the version number and exit.
    -h, --help Print this help message and exit.

    -F FILE, --file=FILE Read a given xmake.lua file.
    -P PROJECT, --project=PROJECT Change to the given project directory.
                                           Search priority:
                                               1. The Given Command Argument
                                               2. The Envirnoment Variable: XMAKE_PROJECT_DIR
                                               3. The Current Directory

    -b, --bright Enable bright.
    -d, --dim Enable dim.
    --, --blink Enable blink.
    -r, --reverse Reverse color.

    -c COLOR, --color=COLOR Set the output color. (default: black)
                                               - red
                                               - blue
                                               - yellow
                                               - green
                                               - magenta
                                               - cyan
                                               - white

    Contents ... The info contents.
```

<p class="tip">
The most part of the menu is the common options built into xmake. Basically, each task will be used. You don't need to define it yourself to simplify the menu definition.
</p>

Below, let's actually run this task, for example, I want to display the red `hello xmake!`, only need to:

```bash
$ xmake echo -c red hello xmake!
```

You can also use the full name of the option and highlight it:

```bash
$ xmake echo --color=red --bright hello xmake!
```

The last variable argument list is retrieved by `option.get("contents")` in the `run` script, which returns an array of type `table`.

##### task:set_category

###### Setting task categories

It is only used for grouping of menus. Of course, the plugin will use `plugin` by default. The built-in task will use `action` by default, but it is just a convention.

<p class="tips">
You can use any name you define yourself. The same name will be grouped and displayed together. If it is set to `plugin`, it will be displayed in the Plugins group of xmake.
</p>

E.g:

```lua
plugins:
    l, lua Run the lua script.
    m, macro Run the given macro.
       doxygen Generate the doxygen document.
       project Generate the project file.
       hello Hello xmake!
       app2ipa Generate .ipa file from theGiven .app
       echo Echo the given info!
```

If you do not call this interface to set the classification, the default is to use the `Tasks` group display, which represents the normal task.

##### task:on_run

###### Setting up a task to run a script

There are two ways to set it up. The easiest way is to set the inline function:

```lua
task("hello")

    on_run(function ()
        print("hello xmake!")
    end)
```

This is convenient and small for small tasks, but it is not suitable for large tasks, such as plugins, which require complex scripting support.

This time you need a separate module file to set up the run script, for example:

```lua
task("hello")
    on_run("main")
```

Here the `main` is set to run the main entry module for the script. The file name is `main.lua`, placed in the same directory as `xmake.lua` that defines `task`. Of course, you can use other file names.

The directory structure is as follows:

```
Projectdir
    - xmake.lua
    - main.lua
```

The contents of `main.lua` are as follows:

```lua
function main(...)
    print("hello xmake!")
end
```

It's a simple script file with the main function of `main`. You can import various extension modules via [import](#import) to implement complex functions, such as:

```lua
-- Import parameter option module
import("core.base.option")

-- Entrance function
function main(...)

    -- Get the parameter content
    print("color: %s", option.get("color"))
end
```

You can also create multiple custom module files in the current directory and use them after importing via [import](#import), for example:

```
Projectdir
    - xmake.lua
    - main.lua
    - module.lua
```

The contents of `module.lua` are as follows:

```lua
-- Define an export interface
function hello()
    print("hello xmake!")
end
```

<p class="tip">
The private interface is named by the `_hello` with a descending line prefix, so that the imported module will not contain this interface and will only be used inside the module itself.
</p>

Then make a call in `main.lua`:


```lua
import("module")

function main(...)
    module.hello()
end
```

For more modules, see: [Built-in Module] (#Built-in Module) and [Extension Module] (Extension Module)

Among them, the parameter in `main(...)` is specified by `task.run`, for example:

```lua
task.run("hello", {color="red"}, arg1, arg2, arg3)
```

Inside the `arg1, arg2` these are the arguments to the `hello` task `main(...)` entry, and `{color="red"}` to specify the parameter options in the task menu.

For a more detailed description of `task.run`, see: [task.run](#task-run)

#### Custom Rule

After the 2.2.1 release, xmake not only natively supports the construction of multi-language files, but also allows users to implement complex unknown file builds by custom building rules.

We can extend the build support for other files by pre-setting the file suffixes supported by the rules:

```lua
-- Define a build rule for a markdown file
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)

target("test")
    set_kind("binary")

    -- Make the test target support the construction rules of the markdown file
    add_rules("markdown")

    -- Adding a markdown file to build
    add_files("src/*.md")
    add_files("src/*.markdown")
```

We can also specify some other scattered files to be processed as markdown rules:

```lua
target("test")
    -- ...
    add_files("src/test/*.md.in", {rule = "markdown"})
```

A target can be superimposed to apply multiple rules to more customize its own build behavior, and even support different build environments.

<p class="tips">
Rules specified by `add_files("*.md", {rule = "markdown"})`, with a higher priority than the rule set by `add_rules("markdown")`.
</p>

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [rule](#rule) | Defining Rules | >= 2.1.9 |
| [add_imports](#ruleadd_imports) | Pre-importing extension modules for all custom scripts | >= 2.1.9 |
| [set_extensions](#ruleset_extensions) | Setting the file extension type supported by the rule | >= 2.1.9 |
| [on_build](#ruleon_build) | Custom Compilation Script | >= 2.1.9 |
| [on_clean](#ruleon_clean) | Custom Cleanup Script | >= 2.1.9 |
| [on_package](#ruleon_package) | Custom Package Script | >= 2.1.9 |
| [on_install](#ruleon_install) | Custom Installation Script | >= 2.1.9 |
| [on_uninstall](#ruleon_uninstall) | Custom Uninstall Script | >= 2.1.9 |
| [on_build_file](#ruleon_build_file) | Customize the build script to implement single file build | >= 2.2.1 |
| [on_build_files](#ruleon_build_files) | Custom Compilation Scripts for Multi-File Construction | >= 2.2.1 |
| [before_build](#rulebefore_build) | Custom pre-compilation script | >= 2.2.1 |
| [before_clean](#rulebefore_clean) | Customizing the script before cleanup | >= 2.2.1 |
| [before_package](#rulebefore_package) | Customizing the script before packaging | >= 2.2.1 |
| [before_install](#rulebefore_install) | Custom Pre-Installation Scripts | >= 2.2.1 |
| [before_uninstall](#rulebefore_uninstall) | Customizing the script before uninstalling | >= 2.2.1 |
[before_build_file](#rulebefore_build_file) | Customize pre-compilation scripts to implement single file builds | >= 2.2.1 |
[before_build_files](#rulebefore_build_files) | Customizing pre-compilation scripts for multi-file build | >= 2.2.1 |
| [after_build](#ruleafter_build) | Custom Compiled Scripts | >= 2.2.1 |
| [after_clean](#ruleafter_clean) | Custom Cleanup Script | >= 2.2.1 |
| [after_package](#ruleafter_package) | Custom packaged scripts | >= 2.2.1 |
| [after_install](#ruleafter_install) | Custom Installed Scripts | >= 2.2.1 |
| [after_uninstall](#ruleafter_uninstall) | Custom Uninstalled Scripts | >= 2.2.1 |
| [after_build_file](#ruleafter_build_file) | Customize the compiled script to implement single file build | >= 2.2.1 |
| [after_build_files](#ruleafter_build_files) | Custom Compiled Scripts for Multi-File Construction | >= 2.2.1 |
| [rule_end](#rule_end) | End Definition Rule | >= 2.1.9 |

##### Built-in rules

sinceAfter the 2.2.1 release, xmake provides some built-in rules to simplify the daily xmake.lua description and support for some common build environments.

| Rules | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [mode.debug](#mode-debug) | Debug Mode Compilation Rules | >= 2.2.1 |
| [mode.release](#mode-release) | Release Mode Compilation Rules | >= 2.2.1 |
| [mode.check](#mode-check) | Detection Mode Compilation Rules | >= 2.2.1 |
| [mode.profile](#mode-profile) | Performance Analysis Mode Compilation Rules | >= 2.2.1 |
| [mode.coverage](#mode-coverage) | Coverage Analysis Compilation Mode Rules | >= 2.2.1 |
| [qt.static](#qt-static) | Qt Static Library Compilation Rules | >= 2.2.1 |
| [qt.shared](#qt-shared) | Qt Dynamic Library Compilation Rules | >= 2.2.1 |
| [qt.console](#qt-console) | Qt Console Compilation Rules | >= 2.2.1 |
| [qt.application](#qt-application) | Qt Application Compilation Rules | >= 2.2.1 |
| [wdk.umdf.driver](#wdk-umdf-driver) | WDK Environment umdf Driver Compilation Rules | >= 2.2.1 |
[wdk.umdf.binary](#wdk-umdf-binary) | WDK Environment umdf Driver Application Compilation Rules | >= 2.2.1 |
| [wdk.kmdf.driver](#wdk-kmdf-driver) | WDK Environment kmdf Driver Compilation Rules | >= 2.2.1 |
[wdk.kmdf.binary](#wdk-kmdf-binary) | WDK Environment kmdf Driver Application Compilation Rules | >= 2.2.1 |
| [wdk.wdm.driver](#wdk-wdm-driver) | WDK Environment wdm Driver Compilation Rules | >= 2.2.1 |
[wdk.wdm.binary](#wdk-wdm-binary) | WDK Environment wdm Driver Application Compilation Rules | >= 2.2.1 |

###### mode.debug

Add the configuration rules for the debug compilation mode for the current project xmake.lua, for example:

```lua
add_rules("mode.debug")
```

Equivalent to:

```lua
-- the debug mode
if is_mode("debug") then

    -- enable the debug symbols
    set_symbols("debug")

    -- disable optimization
    set_optimize("none")
end
```

We can switch to this compilation mode by ``xmake f -m debug`.

###### mode.release

Add the configuration rules for the release compilation mode for the current project xmake.lua, for example:

```lua
add_rules("mode.release")
```

Equivalent to:

```lua
-- the release mode
if is_mode("release") then

    -- set the symbols visibility: hidden
    set_symbols("hidden")

    -- enable2017 optimization
    set_optimize("fastest")

    -- strip all symbols
    set_strip("all")
end
```

We can switch to this compilation mode by ``xmake f -m release`.

###### mode.check

Add the check compilation mode configuration rules for the current project xmake.lua, generally used for memory detection, for example:

```lua
add_rules("mode.check")
```

Equivalent to:

```lua
-- the check mode
if is_mode("check") then

    -- enable the debug symbols
    set_symbols("debug")

    -- disable optimization
    set_optimize("none")

    -- attempt to enable some checkers for pc
    add_cxflags("-fsanitize=address", "-ftrapv")
    add_mxflags("-fsanitize=address", "-ftrapv")
    add_ldflags("-fsanitize=address")
end
```

We can switch to this compilation mode by ``xmake f -m check`.

###### mode.profile

Add configuration rules for the profile compilation mode for the current project xmake.lua, which is generally used for performance analysis, for example:

```lua
add_rules("mode.profile")
```

Equivalent to:

```lua
-- the profile mode
if is_mode("profile") then

    -- enable the debug symbols
    set_symbols("debug")

    -- enable gprof
    add_cxflags("-pg")
    add_ldflags("-pg")
end
```

We can switch to this compilation mode by ``xmake f -m profile`.

###### mode.coverage

Add the configuration rules for the coverage compilation mode for the current project xmake.lua, which is generally used for coverage analysis, for example:

```lua
add_rules("mode.coverage")
```

Equivalent to:

```lua
-- the coverage mode
if is_mode("coverage") then
    add_cxflags("--coverage")
    add_mxflags("--coverage")
    add_ldflags("--coverage")
end
```

We can switch to this compilation mode by ``xmake f -m coverage`.

###### qt.static

A static library program used to compile and generate Qt environments:

```lua
target("qt_static_library")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

###### qt.shared

Dynamic library program for compiling and generating Qt environment:

```lua
target("qt_shared_library")
    add_rules("qt.shared")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

###### qt.console

A console program for compiling and generating a Qt environment:

```lua
target("qt_console")
    add_rules("qt.console")
    add_files("src/*.cpp")
```

###### qt.application

Used to compile ui applications that generate Qt environments.

Quick(qml) application:

```lua
target("qt_quickapp")
    add_rules("qt.application")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
    add_frameworks("QtQuick")
```

Qt Widgets (ui/moc) application:

```lua
-- add target
target("qt_widgetapp")
    add_rules("qt.application")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h") -- Add a meta header file with Q_OBJECT
    add_frameworks("QtWidgets")
```

For more descriptions of Qt, see: [#160](https://github.com/xmake-io/xmake/issues/160)



###### wdk.env.kmdf

Application of the compilation environment setting of kmdf under WDK, need to cooperate with: `wdk.[driver|binary|static|shared]` and other rules to use.

###### wdk.env.umdf

Application of the umdf compiler environment settings under WDK, you need to cooperate with: `wdk.[driver|binary|static|shared]` and other rules to use.

###### wdk.env.wdm

Application wdm compiler environment settings under WDK, need to cooperate with: `wdk.[driver|binary|static|shared]` and other rules to use.

###### wdk.driver

Compile and generate drivers based on the WDK environment under Windows. Currently, only the WDK10 environment is supported.

Note: need to cooperate: `wdk.env.[umdf|kmdf|wdm]`Environmental rules are used.

```lua
-- add target
target("echo")

    -- add rules
    add_rules("wdk.driver", "wdk.env.kmdf")

    -- add files
    add_files("driver/*.c")
    add_files("driver/*.inx")

    -- add includedirs
    add_includedirs("exe")
```

###### wdk.binary

Compile and generate executable programs based on WDK environment under Windows. Currently, only WDK10 environment is supported.

Note: It is necessary to cooperate with: environment rules such as `wdk.env.[umdf|kmdf|wdm]`.

```lua
-- add target
target("app")

    -- add rules
    add_rules("wdk.binary", "wdk.env.umdf")

    -- add files
    add_files("exe/*.cpp")
```

###### wdk.static

Compile and generate static library programs based on WDK environment under Windows. Currently, only WDK10 environment is supported.

Note: It is necessary to cooperate with: environment rules such as `wdk.env.[umdf|kmdf|wdm]`.

```lua
target("nonpnp")

    -- add rules
    add_rules("wdk.static", "wdk.env.kmdf")

    -- add flags for rule: wdk.tracewpp
    add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")

    -- add files
    add_files("driver/*.c", {rule = "wdk.tracewpp"})
```

###### wdk.shared

Compile and generate dynamic library programs based on WDK environment under Windows. Currently, only WDK10 environment is supported.

Note: It is necessary to cooperate with: environment rules such as `wdk.env.[umdf|kmdf|wdm]`.

```lua
target("nonpnp")

    -- add rules
    add_rules("wdk.shared", "wdk.env.wdm")

    -- add flags for rule: wdk.tracewpp
    add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")

    -- add files
    add_files("driver/*.c", {rule = "wdk.tracewpp"})
```

###### wdk.tracewpp

Used to enable tracewpp to preprocess source files:

```lua
target("nonpnp")

    -- add rules
    add_rules("wdk.driver", "wdk.env.kmdf")

    -- add flags for rule: wdk.tracewpp
    add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")

    -- add files
    add_files("driver/*.c", {rule = "wdk.tracewpp"})
    add_files("driver/*.rc")
```

For more information on WDK rules, see: [#159] (https://github.com/xmake-io/xmake/issues/159)

###### win.sdk.application

Compile and generate the winsdk application.

```lua
-- add rules
add_rules("mode.debug", "mode.release")

-- define target
target("usbview")

    -- windows application
    add_rules("win.sdk.application")

    -- add files
    add_files("*.c", "*.rc")
    add_files("xmlhelper.cpp", {rule = "win.sdk.dotnet"})
```

###### wdk.sdk.dotnet

Used to specify certain c++ source files to be compiled as c++.net.

```lua
add_files("xmlhelper.cpp", {rule = "win.sdk.dotnet"})
```

For more information on WDK rules, see: [#159] (https://github.com/xmake-io/xmake/issues/159)

##### rule

###### Defining rules

```lua
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)
```

##### rule:add_imports

###### Pre-importing extension modules for all custom scripts

For usage and description, please see: [target:add_imports](#targetadd_imports), the usage is the same.

##### rule:set_extensions

###### Setting the file extension type supported by the rule

Apply rules to files with these suffixes by setting the supported extension file types, for example:

```lua
-- Define a build rule for a markdown file
rule("markdown")
    set_extensions(".md", ".markdown")
    on_build_file(function (target, sourcefile, opt)
        os.cp(sourcefile, path.join(target:targetdir(), path.basename(sourcefile) .. ".html"))
    end)

target("test")
    set_kind("binary")

    -- Make the test target support the construction rules of the markdown file
    add_rules("markdown")

    -- Adding a markdown file to build
    add_files("src/*.md")
    add_files("src/*.markdown")
```

##### rule:on_build

###### Custom compilation script

The build script used to implement the custom rules overrides the default build behavior of the target being applied, for example:

```lua
rule("markdown")
    on_build(function (target)
    end)
```

##### rule:on_clean

###### Custom cleanup script

The cleanup script used to implement the custom rules will override the default cleanup behavior of the applied target, for example:

```lua
rule("markdown")
    on_clean(function (target)
        -- remove sourcefile.html
    end)
```

##### rule:on_package

###### Custom packaging script

A packaging script for implementing custom rules that overrides the default packaging behavior of the target being applied, for example:

```lua
rule("markdown")
    on_package(function (target)
        -- package sourcefile.html
    end)
```

##### rule:on_install

###### Custom installation script

An installation script for implementing custom rules that overrides the default installation behavior of the target being applied, for example:

```lua
rule("markdown")
    on_install(function (target)
    end)
```

##### rule:on_uninstall

###### Custom Uninstall Script

An uninstall script for implementing custom rules that overrides the default uninstall behavior of the target being applied, for example:

```lua
rule("markdown")
    on_uninstall(function (target)
    end)
```

##### rule:on_build_file

###### Customizing the build script to process one source file at a time

```lua
rule("markdown")
    on_build_file(function (target, sourcefile, opt)
        print("%%%d: %s", opt.progress, sourcefile)
    end)
```

The third parameter opt is an optional parameter, which is used to obtain some information state during the compilation process. For example, opt.progress is the compilation progress of the current period.

##### rule:on_build_files

###### Customizing the build script to process multiple source files at once

Most of the custom build rules, each time processing a single file, output a target file, for example: a.c => a.o

However, in some cases, we need to enter multiple source files together to build an object file, for example: a.c b.c d.c => x.o

For this situation, we can achieve this by customizing this script:

```lua
rule("markdown")
    on_build_files(function (target, sourcebatch, opt)
        -- build some source files
        for _, sourcefile in ipairs(sourcebatch.sourcefiles) do
            -- ...
        end
    end)
```

##### rule:before_build

###### Custom pre-compilation script

Used to implement the execution script before the custom target is built, for example:

```lua
rule("markdown")
    before_build(function (target)
    end)
```

##### rule:before_clean

###### Custom pre-cleanup script

Used to implement the execution script before the custom target cleanup, for example:

```lua
rule("markdown")
    before_clean(function (target)
    end)
```

##### rule:before_package

###### Customizing the pre-package script

Used to implement the execution script before the custom target is packaged, for example:

```lua
rule("markdown")
    before_package(function (target)
    end)
```

##### rule:before_install

###### Custom pre-installation script

Used to implement the execution script before the custom target installation, for example:

```lua
rule("markdown")
    before_install(function (target)
    end)
```

##### rule:before_uninstall

###### Custom pre-uninstall script

Used to implement the execution script before the custom target is uninstalled, for example:

```lua
rule("markdown")
    before_uninstall(function (target)
    end)
```

##### rule:before_build_file

###### Custom pre-compilation script to process one source file at a time

Similar to [rule:on_build_file](#ruleon_build_file), but the timing of this interface is called before compiling a source file.
Generally used to preprocess some source files before compiling.

##### rule:before_build_files

###### Custom pre-compilation script to process multiple source files at once

Similar to [rule:on_build_files](#ruleon_build_files), but the timing of this interface is called before compiling some source files.
Generally used to preprocess some source files before compiling.

##### rule:after_build

###### Custom pre-compilation script

The execution script used to implement the custom target build is similar to [rule:before_build](#rulebefore_build).

##### rule:after_clean

###### Custom Cleanup Script

The execution script used to implement the custom target cleanup is similar to [rule:before_clean](#rulebefore_clean).

##### rule:after_package

###### Custom packaged script

The execution script used to implement the custom target package is similar to [rule:before_package](#rulebefore_package).

##### rule:after_install

###### Custom Post-Installation Script

The execution script used to implement the custom target installation is similar to [rule:before_install](#rulebefore_install).

##### rule:after_uninstall

###### Custom Uninstallation Script

The execution script used to implement the custom target uninstallation is similar to [rule:before_uninstall](#rulebefore_uninstall).

##### rule:after_build_file

###### Customizing post-compilation scripts to process one source file at a time

Similar to [rule:on_build_file](#ruleon_build_file), but the timing of this interface is called after compiling a source file.
Generally used to post-process some compiled object files.

##### rule:after_build_files

###### Customizing post-compilation scripts to process multiple source files at once

Similar to [rule:on_build_files](#ruleon_build_files), but the timing of this interface is called after compiling some source files.
Generally used to post-process some compiled object files.

##### rule_end

###### End definition rules

This is optional. If you want to manually end the rule definition, you can call it:

```lua
rule("test")
    -- ..
rule_end()
```

#### Remote package dependencies

The repository depends on the package definition description, the `package()` related interface definition, etc. There will be time to elaborate, so stay tuned. .

Please refer to the existing package description in the official repository: [xmake-repo] (https://github.com/xmake-io/xmake-repo)

Here is a more representative example for reference:

```lua
package("libxml2")

    set_homepage("http://xmlsoft.org/")
    set_description("The XML C parser and toolkit of Gnome.")

    set_urls("https://github.com/GNOME/libxml2/archive/$(version).zip", {excludes = {"*/result/*", "*/test/*"}})

    add_versions("v2.9.8", "c87793e45e66a7aa19200f861873f75195065de786a21c1b469bdb7bfc1230fb")
    add_versions("v2.9.7", "31dd4c0e10fa625b47e27fd6a5295d246c883f214da947b9a4a9e13733905ed9")

    if is_plat("macosx", "linux") then
        add_deps("autoconf", "automake", "libtool", "pkg-config")
    end

    on_load(function (package)
        package:addvar("includedirs", "include/libxml2")
        package:addvar("links", "xml2")
    end)

    if is_plat("windows") and winos.version():gt("winxp") then
        on_install("windows", function (package)
            os.cd("win32")
            os.vrun("cscript configure.js iso8859x=yes iconv=no compiler=msvc cruntime=/MT debug=%s prefix=\"%s\"", package:debug() and "yes" or "no", Package:installdir())
            os.vrun("nmake /f Makefile.msvc")
            os.vrun("nmake /f Makefile.msvc install")
        end)
    end

    on_install("macosx", "linux", function (package)
        import("package.tools.autoconf").install(package, {"--disable-dependency-tracking", "--without-python", "--without-lzma"})
    end)
```

#### Builtin Variables

Xmake provides the syntax of `$(varname)` to support the acquisition of built-in variables, for example:

```lua
add_cxflags("-I$(buildir)")
```

It will convert the built-in `buildir` variable to the actual build output directory when compiling: `-I./build`

General built-in variables can be used to quickly get and splicing variable strings when passing arguments, for example:

```lua
target("test")

    -- Add source files in the project source directory
    add_files("$(projectdir)/src/*.c")

    -- Add a header file search path under the build directory
    add_includedirs("$(buildir)/inc")
```

It can also be used in the module interface of a custom script, for example:

```lua
target("test")
    on_run(function (target)
        -- Copy the header file in the current script directory to the output directory
        os.cp("$(scriptdir)/xxx.h", "$(buildir)/inc")
    end)
```

All built-in variables can also be retrieved via the [val](#val) interface.

This way of using built-in variables makes the description writing more concise and easy to read. Here are some of the variables built into xmake that can be obtained directly:

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [$(os)](#var-os) | Get the operating system of the current build platform | >= 2.0.1 |
| [$(host)](#var-host) | Get native operating system | >= 2.0.1 |
| [$(tmpdir)](#var-tmpdir) | Get Temporary Directory | >= 2.0.1 |
| [$(curdir)](#var-curdir) | Get current directory | >= 2.0.1 |
| [$(buildir)](#var-buildir) | Get the build output directory | >= 2.0.1 |
| [$(scriptdir)](#var-scriptdir) | Get Project Description Script Directory | >= 2.1.1 |
| [$(globaldir)](#var-globaldir) | Get Global Configuration Directory | >= 2.0.1 |
| [$(configdir)](#var-configdir) | Get Local Project Configuration Directory | >= 2.0.1 |
| [$(programdir)](#var-programdir) | xmake installation script directory | >= 2.1.5 |
| [$(projectdir)](#var-projectdir) | Get the project root directory | >= 2.0.1 |
| [$(shell)](#var-sheLl) | Execute external shell command | >= 2.0.1 |
| [$(env)](#var-env) | Get external environment variables | >= 2.1.5 |
| [$(reg)](#var-reg) | Get the value of the windows registry configuration item | >= 2.1.5 |

Of course, this variable mode can also be extended. By default, the `xmake f --var=val` command can be used to directly obtain the parameters. For example:

```lua
target("test")
    add_defines("-DTEST=$(var)")
```

<p class="tip">
All the parameter values ​​of the `xmake f --xxx=...` configuration can be obtained through built-in variables, for example: `xmake f --arch=x86` corresponds to `$(arch)`, others have ` $(plat)`, `$(mode)` and so on.
What are the specific parameters, you can check it out by `xmake f -h`.
</p>

Since the support is directly obtained from the configuration options, it is of course convenient to extend the custom options to get the custom variables. For details on how to customize the options, see: [option](#option)

##### var.$(os)

###### Get the operating system of the current build platform

If iphoneos is currently compiled, then this value is: `ios`, and so on.

##### var.$(host)

###### Get the native operating system

Refers to the host system of the current native environment, if you compile on macOS, then the system is: `macosx`

##### var.$(tmpdir)

###### Getting a temporary directory

Generally used to temporarily store some non-permanent files.

##### var.$(curdir)

###### Get the current directory

The default is the project root directory when the `xmake` command is executed. Of course, if the directory is changed by [os.cd](#os-cd), this value will also change.

##### var.$(buildir)

###### Get the current build output directory

The default is usually the `./build` directory in the current project root directory. You can also modify the default output directory by executing the `xmake f -o /tmp/build` command.

##### var.$(scriptdir)

###### Get the directory of the current project description script

That is, the directory path corresponding to `xmake.lua`.

##### var.$(globaldir)

###### Global Configuration Directory

Xmake's `xmake g|global` global configuration command, directory path for data storage, where you can place some of your own plugins and platform scripts.

The default is: `~/.config`

##### var.$(configdir)

###### Current project configuration directory

The current project configuration storage directory, which is the storage directory of the `xmake f|config` configuration command, defaults to: `projectdir/.config`

##### var.$(programdir)

###### xmake installation script directory

That is, the directory where the `XMAKE_PROGRAM_DIR` environment variable is located. We can also modify the xmake load script by setting this environment amount to implement version switching.

##### var.$(projectdir)

###### Project root directory

That is, the directory path specified in the `xmake -P xxx` command, the default is not specified is the current directory when the `xmake` command is executed, which is generally used to locate the project file.

##### var.$(shell)

###### Executing external shell commands

In addition to the built-in variable handling, xmake also supports the native shell to handle some of the features that xmake does not support.

For example, there is a need now, I want to use the `pkg-config` to get the actual third-party link library name when compiling the Linux program, you can do this:

```lua
target("test")
    set_kind("binary")
    if is_plat("linux") then
        add_ldflags("$(shell pkg-config --libs sqlite3)")
    end
```

Of course, xmake has its own automated third library detection mechanism, which generally does not need such trouble, and lua's own scripting is very good. .

But this example shows that xmake can be used with some third-party tools through the native shell. .

##### var.$(env)

###### Get external environment variables

For example, you can get the path in the environment variable:

```lua
target("test")
    add_includedirs("$(env PROGRAMFILES)/OpenSSL/inc")
```

##### var.$(reg)

###### Get the value of the windows registry configuration item

Get the value of an item in the registry by `regpath; name`:

```lua
print("$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name)")
```

#### Builtin Modules

Used in script code such as custom scripts, plug-in scripts, task scripts, platform extensions, template extensions, etc., that is, in code blocks like the following, you can use these module interfaces:

```lua
on_run(function (target)
    print("hello xmake!")
end)
```

<p class="warning">
In order to ensure that the description field of the outer layer is as simple and secure as possible, it is generally not recommended to use the interface and module operation api in this domain. Therefore, most module interfaces can only be used in the script domain to implement complex functions. </br>
Of course, a small number of read-only built-in interfaces can still be used in the description field, as shown in the following table:
</p>

| Interface | Description | Available Domains | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------------------------- | -------- |
| [val](#val) | Get the value of the built-in variable | Script Field | >= 2.1.5 |
| [import](#import) | Importing Extension Blocks | Script Fields | >= 2.0.1 |
| [inherit](#inherit) | Import and inherit base class modules | Script Domain | >= 2.0.1 |
| [ifelse](#ifelse) | Similar ternary conditional judgment | Description field, script field | >= 2.0.1 |
| [try-catch-finally](#try-catch-finally) | Exception Capture | Script Field | >= 2.0.1 |
| [pairs](#pairs) | Used to Traverse the Dictionary | Description Field, Script Field | >= 2.0.1 |
| [ipairs](#ipairs) | Used to traverse arrays | Description fields, script fields | >= 2.0.1 |
[print](#print) | Wrap Print Terminal Log | Description Field, Script Field | >= 2.0.1 |
| [printf](#printf) | No Line Printing Terminal Log | Script Field | >= 2.0.1 |
[cprint](#cprint) | Wrap Color Print Terminal Log | Script Field | >= 2.0.1 |
| [cprintf](#cprintf) | No Line Color Print Terminal Log | Script Field | >= 2.0.1 |
| [format](#format) | Format String | Description Field, Script Field | >= 2.0.1 |
| [vformat](#vformat) | Format string, support for built-in variable escaping | Script Domain | >= 2.0.1 |
| [raise](#raise) | Throwing an abort program | Script Field | >= 2.0.1 |
| [os](#os) | System Operation Module | Partial Read-Only Operation Description Field, Script Field | >= 2.0.1 |
| [io](#io) | File Manipulation Module | Script Field | >= 2.0.1 |
| [path](#path) | Path Manipulation Module | Description Field, Script Field |= 2.0.1 |
| [table](#table) | Array and Dictionary Operations Module | Description Field, Script Field | >= 2.0.1 |
| [string](#string) | String Manipulation Module | Description Field, Script Field | >= 2.0.1 |
| [process](#process) | Process Operation Module | Script Field | >= 2.0.1 |
| [coroutine](#coroutine) | Coroutine Operation Module | Script Field | >= 2.0.1 |
| [find_packages](#find_packages) | Find Dependency Packages | Script Fields | >= 2.2.5 |

An example of using an interface call in a description field is as follows, generally only for conditional control:

```lua
-- Scan all subdirectories under the current xmake.lua directory, defining a task task with the name of each directory
for _, taskname in ipairs(os.dirs("*"), path.basename) do
    task(taskname)
        on_run(function ()
        end)
end
```

The script field and description field mentioned above mainly refer to:

```lua
-- Description field
target("test")

    -- Description field
    set_kind("static")
    add_files("src/*.c")

    on_run(function (target)
        -- Script domain
    end)

-- Description field
```

##### val

###### Get the value of the built-in variable

[Built-in variables] (#built-in variables) can be obtained directly through this interface, without the need to add a `$()` package, which is much simpler to use, for example:

```lua
print(val("host"))
print(val("env PATH"))
local s = val("shell echo hello")
```

Using [vformat](#vformat) is cumbersome:

```lua
local s = vformat("$(shell echo hello)")
```

However, `vformat` supports string parameter formatting, which is more powerful, so the application scenario is different.

##### import

###### Importing extension blocks

Import is mainly used to import xmake's extension class library and some custom class library modules, generally used to:

* Custom script ([on_build](#targeton_build), [on_run](#targeton_run) ..)
* Plugin development
* Template development
* Platform extension
* Custom task task

The import mechanism is as follows:

1. Import from the current script directory first
2. Import from the extended class library

Imported grammar rules:

Class library path rules based on `.`, for example:

Import core core extension module

```lua
import("core.base.option")
import("core.project")
import("core.base.task") -- 2.1.5 Previously core.project.task
import("core")

function main()

    -- Get parameter options
    print(option.get("version"))

    -- Run tasks and plugins
    task.run("hello")
    project.task.run("hello")
    core.base.task.run("hello")
end
```

Import the custom module in the current directory:

Directory Structure:

```
Plugin
  - xmake.lua
  - main.lua
  - modules
    - hello1.lua
    - hello2.lua
```

Import modules in main.lua

```lua
import("modules.hello1")
import("modules.hello2")
```

After importing, you can directly use all the public interfaces inside. The private interface is marked with the `_` prefix, indicating that it will not be exported and will not be called externally. .

In addition to the current directory, we can also import libraries in other specified directories, for example:

```lua
import("hello3", {rootdir = "/home/xxx/modules"})
```

To prevent naming conflicts, you can also specify an alias after import:

```lua
import("core.platform.platform", {alias = "p"})

function main()

    -- So we can use p to call the plats interface of the platform module to get a list of all the platforms supported by xmake.
    table.dump(p.plats())
end
```

Import can not only import the class library, but also import and import as inheritance, realize the inheritance relationship between modules.

```lua
import("xxx.xxx", {inherit = true})
```

This is not a reference to the module, but all the public interfaces of the module imported, so that it will be merged with the interface of the current module to achieve inheritance between modules.

Version 2.1.5 adds two new properties: `import("xxx.xxx", {try = true, anonymous = true}).

If the try is true, the imported module does not exist, only return nil, and will not interrupt xmake after throwing an exception.
If anonymous is true, the imported module will not introduce the current scope, only the imported object reference will be returned in the import interface.

##### inherit

###### Import and inherit base class modules

This is equivalent to the `inherit` mode of the [import](#import) interface, which is:

```lua
import("xxx.xxx", {inherit = true})
```

With the `inherit` interface, it will be more concise:

```lu
Inherit("xxx.xxx")
```

For an example, see the script in the xmake tools directory: [clang.lua](#https://github.com/xmake-io/xmake/blob/master/xmake/tools/clang.lua)

This is part of the clang tool module that inherits gcc.

##### ifelse

###### Similar to the ternary condition judgment

Since lua does not have a built-in ternary operator, a more concise conditional choice is achieved by encapsulating the `ifelse` interface:

```lua
local ok = ifelse(a == 0, "ok", "no")
```

##### try-catch-finally

###### Exception capture

Lua native does not provide try-catch syntax to catch exception handling, but provides interfaces such as `pcall/xpcall` to execute lua functions in protected mode.

Therefore, the capture mechanism of the try-catch block can be implemented by encapsulating these two interfaces.

We can look at the packaged try-catch usage first:

```lua
try
{
    -- try code block
    function ()
        error("error message")
    end,

    -- catch code block
    catch
    {
        -- After an exception occurs, it is executed
        function (errors)
            print(errors)
        end
    }
}
```

In the above code, an exception is thrown inside the try block, and an error message is thrown, caught in the catch, and the error message is output.

And finally processing, this role is for the `try{}` code block, regardless of whether the execution is successful, will be executed into the finally block

In other words, in fact, the above implementation, the complete support syntax is: `try-catch-finally` mode, where catch and finally are optional, according to their actual needs.

E.g:

```lua
try
{
    -- try code block
    function ()
        error("error message")
    end,

    -- catch code block
    catch
    {
        -- After an exception occurs, it is executed
        function (errors)
            print(errors)
        end
    },

    -- finally block
    finally
    {
        -- Finally will be executed here
        function (ok, errors)
            -- If there is an exception in try{}, ok is true, errors is the error message, otherwise it is false, and error is the return value in try
        end
    }
}

```

Or only the finally block:

```lua
try
{
    -- try code block
    function ()
        return "info"
    end,

    -- finally block
    finally
    {
        -- Since there is no exception in this try code, ok is true and errors is the return value: "info"
        function (ok, errors)
        end
    }
}
```

Processing can get the normal return value in try in finally, in fact, in the case of only try, you can also get the return value:

```lua
-- If no exception occurs, result is the return value: "xxxx", otherwise nil
local result = try
{
    function ()
        return "xxxx"
    end
}
```

In xmake's custom scripting and plugin development, it is also based entirely on this exception catching mechanism.

This makes the development of the extended script very succinct and readable, eliminating the cumbersome `if err ~= nil then` return value judgment. When an error occurs, xmake will directly throw an exception to interrupt, and then highlight the detailed error. information.

E.g:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")

    -- After the ios program is compiled, the target program is ldid signed
    after_build(function (target))
        os.run("ldid -S %s", target:targetfile())
    end
```

Only one line `os.run` is needed, and there is no need to return a value to determine whether it runs successfully. After the operation fails, xmake will automatically throw an exception, interrupt the program and prompt the error.

If you want to run xmake without running interrupts directly after running, you can do it yourself.Add a try and you will be fine:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")

    after_build(function (target))
        try
        {
            function ()
                os.run("ldid -S %s", target:targetfile())
            end
        }
    end
```

If you want to capture the error message, you can add a catch:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")

    after_build(function (target))
        try
        {
            function ()
                os.run("ldid -S %s", target:targetfile())
            end,
            catch
            {
                function (errors)
                    print(errors)
                end
            }
        }
    end
```

However, in general, write custom scripts in xmake, do not need to manually add try-catch, directly call a variety of api, after the error, let xmake default handler to take over, directly interrupted. .

##### pairs

###### Used to traverse the dictionary

This is lua's native built-in api. In xmake, it has been extended in its original behavior to simplify some of the daily lua traversal code.

First look at the default native notation:

```lua
local t = {a = "a", b = "b", c = "c", d = "d", e = "e", f = "f"}

for key, val in pairs(t) do
    print("%s: %s", key, val)
end
```

This is sufficient for normal traversal operations, but if we get the uppercase for each of the elements it traverses, we can write:

```lua
for key, val in pairs(t, function (v) return v:upper() end) do
     print("%s: %s", key, val)
end
```

Even pass in some parameters to the second `function`, for example:

```lua
for key, val in pairs(t, function (v, a, b) return v:upper() .. a .. b end, "a", "b") do
     print("%s: %s", key, val)
end
```

##### ipairs

###### for traversing arrays

This is lua's native built-in api. In xmake, it has been extended in its original behavior to simplify some of the daily lua traversal code.

First look at the default native notation:

```lua
for idx, val in ipairs({"a", "b", "c", "d", "e", "f"}) do
     print("%d %s", idx, val)
end
```

The extension is written like the [pairs](#pairs) interface, for example:

```lua
for idx, val in ipairs({"a", "b", "c", "d", "e", "f"}, function (v) return v:upper() end) do
     print("%d %s", idx, val)
end

for idx, val in ipairs({"a", "b", "c", "d", "e", "f"}, function (v, a, b) return v:upper() .. a .. b end, "a", "b") do
     print("%d %s", idx, val)
end
```

This simplifies the logic of the `for` block code. For example, if I want to traverse the specified directory and get the file name, but not including the path, I can simplify the writing by this extension:

```lua
for _, filename in ipairs(os.dirs("*"), path.filename) do
    -- ...
end
```

##### print

###### Wrapping print terminal log

This interface is also the native interface of lua. xmake is also extended based on the original behavior, and supports: formatted output, multivariable output.

First look at the way native support:

```lua
print("hello xmake!")
print("hello", "xmake!", 123)
```

And also supports extended formatting:

```lua
print("hello %s!", "xmake")
print("hello xmake! %d", 123)
```

Xmake will support both types of writing at the same time, and the internal will automatically detect and select the output behavior.

##### printf

###### No line printing terminal log

Like the [print](#print) interface, the only difference is that it doesn't wrap.

##### cprint

###### Wrap color print terminal log

The behavior is similar to [print](#print), the difference is that this interface also supports color terminal output, and supports `emoji` character output.

E.g:

```lua
    cprint('${bright}hello xmake')
    cprint('${red}hello xmake')
    cprint('${bright green}hello ${clear}xmake')
    cprint('${blue onyellow underline}hello xmake${clear}')
    cprint('${red}hello ${magenta}xmake')
    cprint('${cyan}hello ${dim yellow}xmake')
```

The results are as follows:

![cprint_colors](http://tboox.org/static/img/xmake/cprint_colors.png)

The color-related descriptions are placed in `${ }`, and you can set several different properties at the same time, for example:

```
    ${bright red underline onyellow}
```

Indicates: highlighted red, background yellow, and with a down line

All of these descriptions will affect the entire entire line of characters. If you only want to display partial color text, you can insert `${clear}` at the end position to clear the previous color description.

E.g:

```
    ${red}hello ${clear}xmake
```

In this case, only hello is displayed in red, and the others are still normal black display.

Other colors belong to, I will not introduce them here, directly paste the list of attributes in the xmake code:

```lua
    colors.keys =
    {
        -- Attributes
        reset = 0 -- reset attribute
    , clear = 0 -- clear attribute
    , default = 0 -- default property
    , bright = 1 -- highlight
    , dim = 2 -- dark
    , underline = 4 -- underline
    , blink = 5 -- flashing
    , reverse = 7 -- reverse color
    , hidden = 8 -- hidden text

        -- Foreground
    , black = 30
    , red = 31
    , green = 32
    , yellow = 33
    , blue = 34
    , magenta = 35
    , cyan = 36
    , white = 37

        -- Background color
    , onblack = 40
    , onred = 41
    , ongreen = 42
    , onyellow = 43
    , onblue = 44
    , onmagenta = 45
    , oncyan = 46
    , onwhite = 47
```

In addition to color highlighting, if your terminal is under macosx, lion above the system, xmake can also support the display of emoji expressions, for systems that do not support
Ignore the display, for example:

```lua
    cprint("hello xmake${beer}")
    cprint("hello${ok_hand} xmake")
```

The above two lines of code, I printed a classic beer symbol in the homebrew, the following line printed an ok gesture symbol, is not very dazzling. .

![cprint_emoji](http://tboox.org/static/img/xmake/cprint_emoji.png)

All emoji emoticons, as well as the corresponding keys in xmake, can be found in [emoji] (http://www.emoji-cheat-sheet.com/). .

Version 2.1.7 supports 24-bit true color output, if the terminal supports it:

```lua
import("core.base.colors")
if colors.truecolor() then
    cprint("${255;0;0}hello")
    cprint("${on;255;0;0}hello${clear} xmake")
    cprint("${bright 255;0;0 underline}hello")
    cprint("${bright on;255;0;0 0;255;0}hello${clear} xmake")
end
```

Xmake's detection support for truecolor is implemented by the `$COLORTERM` environment variable. If your terminal supports truecolor, you can manually set this environment variable to tell xmake to enable truecolor support.

It can be enabled and tested with the following command:

```bash
$ export COLORTERM=truecolor
$ xmake --version
```

The 2.1.7 version can disable color output with `COLORTERM=nocolor`.

##### cprintf

###### No line feed color print terminal log

This interface is similar to [cprint](#cprint), the difference is that it does not wrap the output.

##### format

###### Formatting a string

If you just want to format the string and don't output it, you can use this interface. This interface is equivalent to the [string.format](#string-format) interface, just a simplified version of the interface name.

```lua
local s = format("hello %s", xmake)
```

##### vformat

###### Formatting strings, support for built-in variable escaping

This interface is followed by [format](The #format) interface is similar, but adds support for the acquisition and escaping of built-in variables.

```lua
local s = vformat("hello %s $(mode) $(arch) $(env PATH)", xmake)
```

##### raise

###### Throwing an abort program

If you want to interrupt xmake running in custom scripts and plug-in tasks, you can use this interface to throw an exception. If the upper layer does not show the call to [try-catch](#try-catch-finally), xmake will be executed. An error message is displayed.

```lua
if (errors) raise(errors)
```

If an exception is thrown in the try block, the error information is captured in catch and finally. See: [try-catch](#try-catch-finally)

##### find_packages

###### Finding dependencies

This interface is a wrapper around the [lib.detect.find_package](#detect-find_package) interface and provides lookup support for multiple dependencies, for example:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load(function (target)
        target:add(find_packages("openssl", "zlib"))
    end)
```

##### os

The system operation module belongs to the built-in module. It can be called directly by the script field without using [import](#import) import.

This module is also a native module of lua, and xmake has been extended to provide more practical interfaces.

<p class="tips">
Only some readonly interfaces (for example: `os.getenv`, `os.arch`) in the os module can be used in the description field. Other interfaces can only be used in the script domain, for example: `os.cp`, `os .rm`etc.
</p>

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [os.cp](#os-cp) | Copy files or directories | >= 2.0.1 |
| [os.mv](#os-mv) | Move Renamed File or Directory | >= 2.0.1 |
| [os.rm](#os-rm) | Delete files or directory tree | >= 2.0.1 |
| [os.trycp](#os-trycp) | Try copying files or directories | >= 2.1.6 |
| [os.trymv](#os-trymv) | Try moving the renamed file or directory | >= 2.1.6 |
| [os.tryrm](#os-tryrm) | Try deleting a file or directory tree | >= 2.1.6 |
| [os.cd](#os-cd) | Go to the specified directory | >= 2.0.1 |
| [os.rmdir](#os-rmdir) | Delete Directory Tree | >= 2.0.1 |
| [os.mkdir](#os-mkdir) | Create the specified directory | >= 2.0.1 |
| [os.isdir](#os-isdir) | Determine if the directory exists | >= 2.0.1 |
| [os.isfile](#os-isfile) | Determine if the file exists | >= 2.0.1 |
| [os.exists](#os-exists) | Determine if a file or directory exists | >= 2.0.1 |
| [os.dirs](#os-dirs) | Traversing to get all directories under the specified directory | >= 2.0.1 |
| [os.files](#os-files) | Traversing to get all the files in the specified directory | >= 2.0.1 |
| [os.filedirs](#os-filedirs) | Traversing to get all files or directories under the specified directory | >= 2.0.1 |
| [os.run](#os-run) | Quiet running program | >= 2.0.1 |
| [os.runv](#os-runv) | Quiet running program with parameter list | >= 2.1.5 |
| [os.exec](#os-exec) | Evoke Run Program | >= 2.0.1 |
| [os.execv](#os-execv) | Echo running program with parameter list | >= 2.1.5 |
| [os.iorun](#os-iorun) | Run and get the program output | >= 2.0.1 |
| [os.iorunv](#os-iorunv) | Run and get the program output with parameter list | >= 2.1.5 |
| [os.getenv](#os-getenv) | Get Environment Variables | >= 2.0.1 |
| [os.setenv](#os-setenv) | Setting environment variables | >= 2.0.1 |
| [os.tmpdir](#os-tmpdir) | Get Temp directory path | >= 2.0.1 |
| [os.tmpfile](#os-tmpfile) | Get Temporary File Path | >= 2.0.1 |
| [os.curdir](#os-curdir) | Get current directory path | >= 2.0.1 |
| [os.filesize](#os-filesize) | Get File Size | >= 2.1.9 |
| [os.scriptdir](#os-scriptdir) | Get script directory path | >= 2.0.1 |
| [os.programdir](#os-programdir) | Get xmake install main program script directory | >= 2.1.5 |
| [os.projectdir](#os-projectdir) | Get Project Home | |= 2.1.5 |
| [os.arch](#os-arch) | Get Current System Architecture | >= 2.0.1 |
| [os.host](#os-host) | Get Current Host System | >= 2.0.1 |

###### os.cp

- Copy files or directories

The behavior is similar to the `cp` command in the shell, supporting path wildcard matching (using lua pattern matching), support for multi-file copying, and built-in variable support.

E.g:

```lua
os.cp("$(scriptdir)/*.h", "$(projectdir)/src/test/**.h", "$(buildir)/inc")
```

The above code will: all the header files in the current `xmake.lua` directory, the header files in the project source test directory are all copied to the `$(buildir)` output directory.

Among them `$(scriptdir)`, `$(projectdir)` These variables are built-in variables of xmake. For details, see the related documentation of [built-in variables] (#built-in variables).

The matching patterns in `*.h` and `**.h` are similar to those in [add_files](#targetadd_files), the former is a single-level directory matching, and the latter is a recursive multi-level directory matching.

This interface also supports `recursive replication' of directories, for example:

```lua
-- Recursively copy the current directory to a temporary directory
os.cp("$(curdir)/test/", "$(tmpdir)/test")
```

<p class="tip">
Try to use the `os.cp` interface instead of `os.run("cp ..")`, which will ensure platform consistency and cross-platform build description.
</p>

###### os.mv

- Move to rename a file or directory

Similar to the use of [os.cp](#os-cp), it also supports multi-file move operations and pattern matching, for example:

```lua
-- Move multiple files to a temporary directory
os.mv("$(buildir)/test1","$(buildir)/test2", "$(tmpdir)")

-- File movement does not support bulk operations, which is file renaming
os.mv("$(buildir)/libtest.a", "$(buildir)/libdemo.a")
```

###### os.rm

- Delete files or directory trees

Support for recursive deletion of directories, bulk delete operations, and pattern matching and built-in variables, such as:

```lua
os.rm("$(buildir)/inc/**.h", "$(buildir)/lib/")
```

###### os.trycp

- Try copying files or directories

Similar to [os.cp](#os-cp), the only difference is that this interface operation will not throw an exception interrupt xmake, but the return value indicates whether the execution is successful.

```lua
if os.trycp("file", "dest/file") then
end
```

###### os.trymv

- Try moving a file or directory

Similar to [os.mv](#os-mv), the only difference is that this interface operation will not throw an exception interrupt xmake, but the return value indicates whether the execution is successful.

```lua
if os.trymv("file", "dest/file") then
end
```

###### os.tryrm

- Try deleting files or directories

Similar to [os.rm](#os-rm), the only difference is that this interface operation will not throw an exception interrupt xmake, but the return value indicates whether the execution is successful.

```lua
if os.tryrm("file") then
end
```

###### os.cd

- Enter the specified directory

This operation is used for directory switching and also supports built-in variables, but does not support pattern matching and multi-directory processing, for example:

```lua
-- Enter the temporary directory
os.cd("$(tmpdir)")
```

If you want to leave the previous directory, there are several ways:

```lua
-- Enter the parent directory
os.cd("..")

-- Enter the previous directory, equivalent to: cd -
os.cd("-")

-- Save the previous directory before entering the directory, then use it to cut back directly after the level
local oldir = os.cd("./src")
...
os.cd(oldir)
```

###### os.rmdir

- delete only the directory

If it is not a directory, it cannot be deleted.

###### os.mkdir

- Create a directory

Support for batch creation and built-in variables, such as:

```lua
os.mkdir("$(tmpdir)/test", "$(buildir)/inc")
```

###### os.isdir

- Determine if it is a directory

Return false if the directory does not exist

```lua
if os.isdir("src") then
    -- ...
end
```

###### os.isfile

- Determine if it is a file

Return false if the file does not exist

```lua
if os.isfile("$(buildir)/libxxx.a") then
    -- ...
end
```

###### os.exists

- Determine if a file or directory exists

Return false if the file or directory does not exist

```lua
-- Judging the existence of the directory
if os.exists("$(buildir)") then
    -- ...
end

-- Judging the existence of the file
if os.exists("$(buildir)/libxxx.a") then
    -- ...
end
```

###### os.dirs

- Traverse to get all the directories under the specified directory

Supports pattern matching in [add_files](#targetadd_files), supports recursive and non-recursive mode traversal, and returns a table array. If not, returns an empty array, for example:

```lua
-- Recursive traversal to get all subdirectories
for _, dir in ipairs(os.dirs("$(buildir)/inc/**")) do
    print(dir)
end
```

###### os.files

- Traverse to get all the files in the specified directory

Supports pattern matching in [add_files](#targetadd_files), supports recursive and non-recursive mode traversal, and returns a table array. If not, returns an empty array, for example:

```lua
-- Non-recursive traversal to get all child files
for _, filepath in ipairs(os.files("$(buildir)/inc/*.h")) do
    print(filepath)
end
```

###### os.filedirs

- Traverse to get all files and directories under the specified directory

Supports pattern matching in [add_files](#targetadd_files), supports recursive and non-recursive mode traversal, and returns a table array. If not, returns an empty array, for example:

```lua
-- Recursive traversal to get all child files and directories
for _, filedir in ipairs(os.filedirs("$(buildir)/**")) do
    print(filedir)
end
```

###### os.run

- Quietly running native shell commands

Used to execute third-party shell commands, but will not echo the output, only after the error, highlight the error message.

This interface supports parameter formatting and built-in variables such as:

```lua
-- Formatted parameters passed in
os.run("echo hello %s!", "xmake")

-- List build directory files
os.run("ls -l $(buildir)")
```

<p class="warning">
Using this interface to execute shell commands can easily reduce the cross-platform build. For `os.run("cp ..")`, try to use `os.cp` instead. <br>
If you must use this interface to run the shell program, please use the [config.plat] (#config-plat) interface to determine the platform support.
</p>

For more advanced process operations and control, see the [process](#process) module interface.

###### os.runv

- Quietly running native shell commands with parameter list

Similar to [os.run](#os-run), just the way to pass parameters is passed through the parameter list, not the string command, for example:

```lua
os.runv("echo", {"hello", "xmake!"})
```

###### os.exec

- Echo running native shell commands

Similar to the [os.run](#os-run) interface, the only difference is that when this interface executes the shell program, it has the output output, which is used in general debugging.

###### os.execv

- Echo running native shell commands with parameter list

Similar to [os.execv](#os-execv), just the way to pass parameters is passed through the parameter list, not the string command, for example:

```lua
os.execv("echo", {"hello", "xmake!"})
```

###### os.iorun

- Quietly running native shell commands and getting output

Similar to the [os.run](#os-run) interface, the only difference is that after executing the shell program, this interface will get the execution result of the shell program, which is equivalent to redirecting the output.

You can get the contents of `stdout`, `stderr` at the same time, for example:

```lua
local outdata, errdata = os.iorun("echo hello xmake!")
```

###### os.iorunv

- Run the native shell command quietly and get the output with a list of parameters

Similar to [os.iorunv](#os-iorunv), just the way to pass arguments is passed through the argument list, not the string command, for example:

```lua
local result, errors = os.iorunv("echo", {"hello", "xmake!"})
```

###### os.getenv

- Get system environment variables

```lua
print(os.getenv("PATH"))
```

###### os.setenv

- Set system environment variables

```lua
os.setenv("HOME", "/tmp/")
```

###### os.tmpdir

- Get temporary directory

Consistent with the result of [$(tmpdir)](#var-tmpdir), it is just a direct return to return a variable that can be maintained with subsequent strings.

```lua
print(path.join(os.tmpdir(), "file.txt"))
```

Equivalent to:

```lua
print("$(tmpdir)/file.txt"))
```

###### os.tmpfile

- Get temporary file path

Used to get a temporary file path, just a path, the file needs to be created by itself.

###### os.curdir

- Get the current directory path

Consistent with the result of [$(curdir)](#var-curdir), it is just a direct return to return a variable that can be maintained with subsequent strings.

Usage reference: [os.tmpdir] (#os-tmpdir).

###### os.filesize

- Get file size

```lua
print(os.filesize("/tmp/a"))
```

###### os.scriptdir

- Get the path of the current description script

Consistent with the result of [$(scriptdir)](#var-scriptdir), it is just a direct return to return a variable that can be maintained with subsequent strings.

Usage reference: [os.tmpdir] (#os-tmpdir).

###### os.programdir

- Get the xmake installation main program script directory

Consistent with the result of [$(programdir)](#var-programdir), it is just a direct get returned to a variable, which can be maintained with subsequent strings.

###### os.projectdir

- Get the project home directory

Consistent with the result of [$(projectdir)](#var-projectdir), it is just a direct return to return a variable that can be maintained with subsequent strings.

###### os.arch

- Get current system architecture

That is the default architecture of the current host system, for example, I execute xmake on `linux x86_64` to build, then the return value is: `x86_64`

###### os.host

- Get the operating system of the current host

Consistent with the result of [$(host)](#var-host), for example, if I execute xmake on `linux x86_64` to build, the return value is: `linux`

##### io

The io operation module extends lua's built-in io module to provide more easy-to-use interfaces.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [io.open](#io-open) | Open file for reading and writing | >= 2.0.1 |
| [io.load](#io-load) | De-serialize all table contents from the specified path file | >= 2.0.1 |
| [io.save](#io-save) | Serialize all table contents to the specified path file | >= 2.0.1 |
| [io.readfile](#io.readfile) | Read everything from the specified path file | >= 2.1.3 |
| [io.writefile](#io.writefile) | Write everything to the specified path file | >= 2.1.3 |
| [io.gsub](#io-gsub) | Full text replaces the contents of the specified path file | >= 2.0.1 |
| [io.tail](#io-tail) | Read and display the tail of the file | >= 2.0.1 |
| [io.cat](#io-cat) | Read and display all contents of a file | >= 2.0.1 |
| [io.print](#io-print) | Formatting output with a line feed to a file | >= 2.0.1 |
| [io.printf](#io-printf) | No line formatted output to file | >= 2.0.1 |

###### io.open

- Open file for reading and writing

This is a native interface for lua. For detailed usage, see Lua's official documentation: [The Complete I/O Model] (https://www.lua.org/pil/21.2.html)

If you want to read all the contents of the file, you can write:

```lua
local file = io.open("$(tmpdir)/file.txt", "r")
if file then
    local data = file:read("*all")
    file:close()
end
```

Or you can read it more quickly using [io.readfile](#io.readfile).

If you want to write a file, you can do this:

```lua
-- Open file: w is write mode, a is append write mode
local file = io.open("xxx.txt", "w")
if file then

    -- Write data to file with native lua interface, does not support formatting, no line breaks, does not support built-in variables
    file:write("hello xmake\n")

    -- Write data to file with xmake extended interface, support formatting, no line breaks, no built-in variables
    file:writef("hello %s\n", "xmake")

    -- Use xmake extended formatted parameters to write to one line, with line breaks, and support for built-in variables
    file:print("hello %s and $(buildir)", "xmake")

    -- Write a line using the xmake extended formatted arguments, no line breaks, and support for built-in variables
    file:printf("hello %s and $(buildir) \n", "xmake")

    -- Close the file
    file:close()
end
```

###### io.load

- Load all table contents from the specified path file deserialization

You can load serialized table contents from a file, generally used with [io.save](#io-save), for example:

```lua
-- Load the contents of the serialized file to the table
local data = io.load("xxx.txt")
if data then

    -- Dump prints the contents of the entire table in the terminal, formatting the output
    table.dump(data)
end
```

###### io.save

- Serialize all table contents to the specified path file

You can serialize the contents of the table to the specified file, generally used in conjunction with [io.load](#io-load), for example:

```lua
io.save("xxx.txt", {a = "a", b = "b", c = "c"})
```

The result of the storage is:

```
{
    ["b"] = "b"
,   ["a"] = "a"
,   ["c"] = "c"
}
```

###### io.readfile

- Read everything from the specified path file

It is more convenient to directly read the contents of the entire file without opening the file, for example:

```lua
local data = io.readfile("xxx.txt")
```

###### io.writefile

- Write all content to the specified path file

It is more convenient to directly write the contents of the entire file without opening the file, for example:

```lua
io.writefile("xxx.txt", "all data")
```

###### io.gsub

- Full text replaces the contents of the specified path file

Similar to the [string.gsub](#string-gsub) interface, the full-text pattern matches the replacement content, but here is the direct operation file, for example:

```lua
-- Remove all whitespace characters from the file
io.gsub("xxx.txt", "%s+", "")
```

###### io.tail

- Read and display the tail content of the file

Reads the data of the specified number of lines at the end of the file and displays a command like `cat xxx.txt | tail -n 10`, for example:

```lua
-- Display the last 10 lines of the file
io.tail("xxx.txt", 10)
```

###### io.cat

- read and display all contents of the file

Read all the contents of the file and display it, similar to the `cat xxx.txt` command, for example:

```lua
io.cat("xxx.txt")
```

###### io.print

- Formatted output content to file with newline

Directly format the passed parameter to output a line of string to the file with a line break, for example:

```lua
io.print("xxx.txt", "hello %s!", "xmake")
```

###### io.printf

- Formatted output to file without line breaks

Directly format the passed parameter to output a line of string to the file without a line break, for example:

```lua
io.printf("xxx.txt", "hello %s!\n", "xmake")
```

##### path

The path operation module implements cross-platform path operations, which is a custom module of xmake.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [path.join](#path-join) | Stitching Path | >= 2.0.1 |
| [path.translate](#path-translate) | Convert path to the path style of the current platform | >= 2.0.1 |
| [path.basename](#path-basename) | Get the file name with no suffix at the end | >= 2.0.1 |
| [path.filename](#path-filename) | Get the file name with the last suffix of the path | >= 2.0.1 |
| [path.extension](#path-extension) | Get the suffix of the path | >= 2.0.1 |
| [path.directory](#path-directory) | Get the last directory name of the path | >= 2.0.1 |
| [path.relative](#path-relative) | Convert to relative path | >= 2.0.1 |
| [path.absolute](#path-absolute) | Convert to Absolute Path | >= 2.0.1 |
| [path.is_absolute](#path-is_absolute) | Determine if it is an absolute path | >= 2.0.1 |

###### path.join

- Stitching path

Adding multiple path items by splicing. Due to the path difference of `windows/unix` style, using api to append paths is more cross-platform, for example:

```lua
print(path.join("$(tmpdir)", "dir1", "dir2", "file.txt"))
```

The above splicing on Unix is ​​equivalent to: `$(tmpdir)/dir1/dir2/file.txt`, and on Windows is equivalent to: `$(tmpdir)\\dir1\\dir2\\file.txt`

If you find this cumbersome and not clear enough, you can use: [path.translate](path-translate) to format the conversion path string to the format supported by the current platform.

###### path.translate

- Convert path to the path style of the current platform

Formatting converts the specified path string to the path style supported by the current platform, and supports the path string parameter of the `windows/unix` format to be passed in, even mixed, such as:

```lua
print(path.translate("$(tmpdir)/dir/file.txt"))
print(path.translate("$(tmpdir)\\dir\\file.txt"))
print(path.translate("$(tmpdir)\\dir/dir2//file.txt"))
```

The path strings of the above three different formats, after being standardized by `translate`, will become the format supported by the current platform, and the redundant path separator will be removed.

###### path.basename

- Get the file name with no suffix at the end of the path

```lua
print(path.basename("$(tmpdir)/dir/file.txt"))
```

The result is: `file`

###### path.filename

- Get the file name with the last suffix of the path

```lua
print(path.filename("$(tmpdir)/dir/file.txt"))
```

The result is: `file.txt`

###### path.extension

- Get the suffix of the path

```lua
print(path.extensione("$(tmpdir)/dir/file.txt"))
```

The result is: `.txt`

###### path.directory

- Get the last directory name of the path```lua
Print(path.directory("$(tmpdir)/dir/file.txt"))
```

The result is: `dir`

###### path.relative

- Convert to relative path

```lua
print(path.relative("$(tmpdir)/dir/file.txt", "$(tmpdir)"))
```

The result is: `dir/file.txt`

The second parameter is to specify the relative root directory. If not specified, the default is relative to the current directory:

```lua
os.cd("$(tmpdir)")
print(path.relative("$(tmpdir)/dir/file.txt"))
```

The result is the same.

###### path.absolute

- Convert to absolute path

```lua
print(path.absolute("dir/file.txt", "$(tmpdir)"))
```

The result is: `$(tmpdir)/dir/file.txt`

The second parameter is to specify the relative root directory. If not specified, the default is relative to the current directory:

```lua
os.cd("$(tmpdir)")
print(path.absolute("dir/file.txt"))
```

The result is the same.

###### path.is_absolute

- Determine if it is an absolute path

```lua
if path.is_absolute("/tmp/file.txt") then
    -- if it is an absolute path
end
```

##### table

Table belongs to the module provided by Lua native. For the native interface, you can refer to: [lua official document] (http://www.lua.org/manual/5.1/manual.html#5.5)

It has been extended in xmake to add some extension interfaces:

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [table.join](#table-join) | Merge multiple tables and return | >= 2.0.1 |
| [table.join2](#table-join2) | Merge multiple tables into the first table | >= 2.0.1 |
| [table.dump](#table-dump) | Output all contents of table | >= 2.0.1 |
| [table.unique](#table-unique) | Deduplicate the contents of the table | >= 2.0.1 |
| [table.slice](#table-slice) | Get the slice of the table | >= 2.0.1 |

###### table.join

- Merge multiple tables and return

You can merge the elements in multiple tables and return to a new table, for example:

```lua
local newtable = table.join({1, 2, 3}, {4, 5, 6}, {7, 8, 9})
```

The result is: `{1, 2, 3, 4, 5, 6, 7, 8, 9}`

And it also supports the merging of dictionaries:

```lua
local newtable = table.join({a = "a", b = "b"}, {c = "c"}, {d = "d"})
```

The result is: `{a = "a", b = "b", c = "c", d = "d"}`

###### table.join2

- Combine multiple tables into the first table

Similar to [table.join](#table.join), the only difference is that the result of the merge is placed in the first argument, for example:

```lua
local t = {0, 9}
table.join2(t, {1, 2, 3})
```

The result is: `t = {0, 9, 1, 2, 3}`

###### table.dump

- Output all contents of the table

Recursively format all the contents of the printed table, generally used for debugging, for example:

```lua
table.dump({1, 2, 3})
```

The result is: `{1, 2, 3}`

###### table.unique

- Deduplicate the contents of the table

To de-table elements, generally used in array tables, for example:

```lua
local newtable = table.unique({1, 1, 2, 3, 4, 4, 5})
```

The result is: `{1, 2, 3, 4, 5}`

###### table.slice

- Get the slice of the table

Used to extract some elements of an array table, for example:

```lua
-- Extract all elements after the 4th element, resulting in: {4, 5, 6, 7, 8, 9}
table.slice({1, 2, 3, 4, 5, 6, 7, 8, 9}, 4)

-- Extract the 4th-8th element and the result: {4, 5, 6, 7, 8}
table.slice({1, 2, 3, 4, 5, 6, 7, 8, 9}, 4, 8)

-- Extract the 4th-8th element with an interval of 2, resulting in: {4, 6, 8}
table.slice({1, 2, 3, 4, 5, 6, 7, 8, 9}, 4, 8, 2)
```

##### string

The string module is a native module of lua. For details, see: [lua official manual] (http://www.lua.org/manual/5.1/manual.html#5.4)

It has been extended in xmake to add some extension interfaces:

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [string.startswith](#string-startswith) | Determine if the beginning of the string matches | >= 1.0.1 |
| [string.endswith](#string-endswith) | Determine if the end of the string matches | >= 1.0.1 |
| [string.split](#string-split) | Split String | >= 1.0.1 |
| [string.trim](#string-trim) | Remove the left and right whitespace characters | >= 1.0.1 |
| [string.ltrim](#string-ltrim) | Remove the whitespace character to the left of the string | >= 1.0.1 |
| [string.rtrim](#string-rtrim) | Remove the whitespace character to the right of the string | >= 1.0.1 |

###### string.startswith

- Determine if the beginning of the string matches

```lua
local s = "hello xmake"
if s:startswith("hello") then
    print("match")
end
```

###### string.endswith

- Determine if the end of the string matches

```lua
local s = "hello xmake"
if s:endswith("xmake") then
    print("match")
end
```

###### string.split

- Split string

The string is separated by the specified separator. The separator can be: character, string, pattern matching string, for example:

```lua
local s = "hello xmake!"
s:split("%s+")
```

Split according to consecutive whitespace characters, the result is: `hello`, `xmake!`

```lua
local s = "hello,xmake:123"
s:split("[,:]")
```

The above code is split according to the `, ` or `:` characters. The result is: `hello`, `xmake`, `123`

###### string.trim

- Remove the left and right whitespace characters of the string

```lua
string.trim("    hello xmake!    ")
```

The result is: "hello xmake!"

###### string.ltrim

- Remove the whitespace character to the left of the string

```lua
string.ltrim("    hello xmake!    ")
```

The result is: "hello xmake!    "

###### string.rtrim

- Remove the whitespace character to the right of the string

```lua
string.rtrim("    hello xmake!    ")
```

The result is: "    hello xmake!"

##### process

This is the xmake extension's process control module for more flexible control of the process, compared to: [os.run] (#os-run) series is more flexible and lower level.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [process.open](#process-open) | Open Process | >= 2.0.1 |
| [process.wait](#process-wait) | Waiting for the process to end | >= 2.0.1 |
| [process.close](#process-close) | Close Process Object | >=2.0.1 |
| [process.waitlist](#process-waitlist) | Waiting for multiple processes at the same time | >= 2.0.1 |

###### process.open

- Open the process

Run a specified program through path creation and return the corresponding process object:

```lua
-- Open the process, the last two parameters specify the stdout to be captured, the stderr file path
local proc = process.open("echo hello xmake!", outfile, errfile)
if proc then

    -- Waiting for the process to complete
    --
    -- Parameter 2 is waiting for timeout, -1 is permanent waiting, 0 is trying to get process status
    -- Return value waitok is wait state: 1 is waiting for the process to end normally, 0 is the process is still running, -1 bit is waiting to fail
    -- The return value status is the status code returned by the process after waiting for the process to end.
    local waitok, status = process.wait(proc, -1)

    -- release process object
    process.close(proc)
end
```

###### process.wait

- Waiting for the process to end

For specific use, see: [process.open](#process-open)

###### process.close

- close the process object

For specific use, see: [process.open](#process-open)

###### process.waitlist

- Waiting for multiple processes at the same time

```lua
-- The second parameter is waiting for a timeout, returning a list of process states
for _, procinfo in ipairs(process.waitlist(procs, -1)) do

    -- For each process: process object, process pid, process end status code
    local proc   = procinfo[1]
    local procid = procinfo[2]
    local status = procinfo[3]

end
```

##### coroutine

The coroutine module is a native module of lua. For use, see: [lua official manual] (http://www.lua.org/manual/5.1/manual.html#5.2)

#### Extension Modules

All expansion modules need to be imported through the [import](#import) interface.

##### core.base.option

Commonly used to get the value of the xmake command parameter option, often used for plugin development.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [option.get](#option-get) | Get Parameter Option Value | >= 2.0.1 |

###### option.get

- Get parameter option values

Used to get parameter option values ​​in plugin development, for example:

```lua
-- Import option module
import("core.base.option")

-- Plugin entry function
function main(...)
    print(option.get("info"))
end
```

The above code gets the hello plugin and executes: `xmake hello --info=xxxx` The value of the `--info=` option passed in the command, and shows: `xxxx`

For task tasks or plugins that are not a main entry, you can use this:

```lua
task("hello")
    on_run(function ())
        import("core.base.option")
        print(option.get("info"))
    end)
```

##### core.base.global

Used to get the configuration information of xmake global, that is, the value of the parameter option passed in `xmake g|global --xxx=val`.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [global.get](#global-get) | Get the specified configuration value | >= 2.0.1 |
| [global.load](#global-load) | Load Configuration | >= 2.0.1 |
| [global.directory](#global-directory) | Get Global Configuration Information Directory | >= 2.0.1 |
| [global.dump](#global-dump) | Print out all global configuration information | >= 2.0.1 |

<p class="tip">
Prior to version 2.1.5, it was `core.project.global`.
</p>

###### global.get

- Get the specified configuration value

Similar to [config.get](#config-get), the only difference is that this is obtained from the global configuration.

###### global.load

- Load configuration

Similar to [global.get](#global-get), the only difference is that this is loaded from the global configuration.

###### global.directory

- Get the global configuration information directory

The default is the `~/.config` directory.

###### global.dump

- Print out all global configuration information

The output is as follows:

```lua
{
    clean = true
,   ccache = "ccache"
,   xcode_dir = "/Applications/Xcode.app"
}
```

##### core.base.task

Used for task operations, generally used to call other task tasks in custom scripts and plug-in tasks.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [task.run](#task-run) | Run the specified task | >= 2.0.1 |

<p class="tip">
Prior to version 2.1.5, it was `core.project.task`.
</p>

###### task.run

- Run the specified task

Used to run tasks or plugins defined by [task](#task) in custom scripts, plugin tasks, for example:

```lua
task("hello")
    on_run(function ()
        print("hello xmake!")
    end)

target("demo")
    on_clean(function(target)

        -- Import task module
        import("core.base.task")

        -- Run this hello task
        task.run("hello")
    end)
```

We can also increase parameter passing when running a task, for example:

```lua
task("hello")
    on_run(function (arg1, arg2)
        print("hello xmake: %s %s!", arg1, arg2)
    end)

target("demo")
    on_clean(function(target)

        -- Import task
        import("core.base.task")

        -- {} This is used for the first option, which is set to null, where two arguments are passed in the last: arg1, arg2
        task.run("hello", {}, "arg1", "arg2")
    end)
```

The second argument to `task.run` is used to pass options from the command line menu instead of passing directly into the `function (arg, ...)` function entry, for example:

```lua
-- Import task
import("core.base.task")

-- Plugin entry
function main(...)

    -- Run the built-in xmake configuration task, equivalent to: xmake f|config --plat=iphoneos --arch=armv7
    task.run("config", {plat="iphoneos", arch="armv7"})
emd
```

##### core.tool.linker

Linker related operations, often used for plugin development.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [linker.link](#linker-link) | Execute Link | >= 2.0.1 |
| [linker.linkcmd](#linker-linkcmd) | Get Link Command Line | >= 2.0.1 |
| [linker.linkargv](#linker-linkargv) | Get Link Command Line List | >= 2.1.5 |
| [linker.linkflags](#linker-linkflags) | Get LinksOptions | >= 2.0.1 |
| [linker.has_flags](#linker-has_flags) | Determine if the specified link option is supported | >= 2.1.5 |

###### linker.link

- Execute link

For the target, link the specified object file list to generate the corresponding target file, for example:

```lua
linker.link("binary", "cc", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

Where [target](#target) is the project target, here is passed in, mainly used to get the target-specific link options. For the project target object, see: [core.project.project](#core-project-project )

Of course, you can also not specify the target, for example:

```lua
linker.link("binary", "cc", {"a.o", "b.o", "c.o"}, "/tmp/targetfile")
```

The first parameter specifies the link type and currently supports: binary, static, shared
The second parameter tells the linker that it should be linked as the source file object, and what compiler source files are compiled with, for example:

| Second Parameter Value | Description |
| ------------ | ------------ |
| cc | c compiler |
| cxx | c++ compiler |
| mm | objc compiler |
| mxx | objc++ compiler |
| gc | go compiler |
| as | assembler |
| sc | swift compiler |
| rc | rust compiler |
| dc | dlang compiler |

Specifying different compiler types, the linker will adapt the most appropriate linker to handle the link, and if several languages ​​support mixed compilation, you can pass in multiple compiler types at the same time, specifying that the linker chooses to support these hybrid compilations. The linker of the language performs link processing:

```lua
linker.link("binary", {"cc", "mxx", "sc"}, {"a.o", "b.o", "c.o"}, "/tmp/targetfile")
```

The above code tells the linker that the three object files a, b, c may be c, objc++, compiled by swift code. The linker will select the most suitable linker from the current system and toolchain to handle the link process. .

###### linker.linkcmd

- Get link command line string

Get the command line string executed in [linker.link](#linker-link) directly, which is equivalent to:

```lua
local cmdstr = linker.linkcmd("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

Note: The extension part of ``target = target}` is optional. If the target object is passed, the generated link command will add the link option corresponding to this target configuration.

And you can also pass various configurations yourself, for example:

```lua
local cmdstr = linker.linkcmd("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {config = {linkdirs = "/usr/lib"}})
```

###### linker.linkargv

- Get a list of link command line arguments

A little different from [linker.linkcmd](#linker-linkcmd) is that this interface returns a list of parameters, table representation, more convenient to operate:

```lua
local program, argv = linker.linkargv("static", "cxx", {"a.o", "b.o", "c.o"}, target:targetfile(), {target = target})
```

The first value returned is the main program name, followed by the parameter list, and `os.args(table.join(program, argv))` is equivalent to `linker.linkcmd`.

We can also run it directly by passing the return value to [os.runv](#os-runv): `os.runv(linker.linkargv(..))`

###### linker.linkflags

- Get link options

Get the link option string part of [linker.linkcmd](#linker-linkcmd) without shellname and object file list, and return by array, for example:

```lua
local flags = linker.linkflags("shared", "cc", {target = target})
for _, flag in ipairs(flags) do
    print(flag)
end
```

The returned array of flags is an array.

###### linker.has_flags

- Determine if the specified link option is supported

Although it can be judged by [lib.detect.has_flags](detect-has_flags), but the interface is more low-level, you need to specify the linker name.
This interface only needs to specify the target type of the target, the source file type, which will automatically switch to select the currently supported linker.

```lua
if linker.has_flags(target:targetkind(), target:sourcekinds(), "-L/usr/lib -lpthread") then
    -- ok
end
```

##### core.tool.compiler

Compiler related operations, often used for plugin development.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [compiler.compile](#compiler-compile) | Execute Compilation | >= 2.0.1 |
| [compiler.compcmd](#compiler-compcmd) | Get Compiler Command Line | >= 2.0.1 |
| [compiler.compargv](#compiler-compargv) | Get Compiled Command Line List | >= 2.1.5 |
| [compiler.compflags](#compiler-compflags) | Get Compilation Options | >= 2.0.1 |
| [compiler.has_flags](#compiler-has_flags) | Determine if the specified compilation option is supported | >= 2.1.5 |
| [compiler.features](#compiler-features) | Get all compiler features | >= 2.1.5 |
| [compiler.has_features](#compiler-has_features) | Determine if the specified compilation feature is supported | >= 2.1.5 |

###### compiler.compile

- Perform compilation

For the target, link the specified object file list to generate the corresponding target file, for example:

```lua
compiler.compile("xxx.c", "xxx.o", "xxx.h.d", {target = target})
```

Where [target](#target) is the project target, here is the specific compile option that is mainly used to get the taeget. If you get the project target object, see: [core.project.project](#core-project-project)

The `xxx.h.d` file is used to store the header file dependency file list for this source file. Finally, these two parameters are optional. You can not pass them when compiling:

```lua
compiler.compile("xxx.c", "xxx.o")
```

To simply compile a source file.

###### compiler.compcmd

- Get the compile command line

Get the command line string executed directly in [compiler.compile](#compiler-compile), which is equivalent to:

```lua
local cmdstr = compiler.compcmd("xxx.c", "xxx.o", {target = target})
```

Note: The extension part of ``target = target}` is optional. If the target object is passed, the generated compile command will add the link option corresponding to this target configuration.

And you can also pass various configurations yourself, for example:

```lua
local cmdstr = compiler.compcmd("xxx.c", "xxx.o", {config = {includedirs = "/usr/include", defines = "DEBUG"}})
```

With target, we can export all source file compilation commands for the specified target:

```lua
import("core.project.project")

for _, target in pairs(project.targets()) do
    for sourcekind, sourcebatch in pairs(target:sourcebatches()) do
        for index, objectfile in ipairs(sourcebatch.objectfiles) do
            local cmdstr = compiler.compcmd(sourcebatch.sourcefiles[index], objectfile, {target = target})
        end
    end
end
```

###### compiler.compargv

- Get compiled command line list

A little different from [compiler.compargv] (#compiler-compargv) is that this interface returns a list of parameters, table representation, more convenient to operate:

```lua
local program, argv = compiler.compargv("xxx.c", "xxx.o")
```

###### compiler.compflags

- Get compilation options

Get the compile option string part of [compiler.compcmd](#compiler-compcmd) without shList of ellnames and files, for example:

```lua
local flags = compiler.compflags(sourcefile, {target = target})
for _, flag in ipairs(flags) do
    print(flag)
end
```

The returned array of flags is an array.

###### compiler.has_flags

- Determine if the specified compilation option is supported

Although it can be judged by [lib.detect.has_flags](detect-has_flags), but the interface is more low-level, you need to specify the compiler name.
This interface only needs to specify the language type, it will automatically switch to select the currently supported compiler.

```lua
-- Determine if the c language compiler supports the option: -g
if compiler.has_flags("c", "-g") then
    -- ok
end

-- Determine if the C++ language compiler supports the option: -g
if compiler.has_flags("cxx", "-g") then
    -- ok
end
```

###### compiler.features

- Get all compiler features

Although it can be obtained by [lib.detect.features](detect-features), but the interface is more low-level, you need to specify the compiler name.
This interface only needs to specify the language type, it will automatically switch to select the currently supported compiler, and then get the current list of compiler features.

```lua
-- Get all the features of the current c compiler
local features = compiler.features("c")

-- Get all the features of the current C++ language compiler, enable the C++11 standard, otherwise you will not get the new standard features.
local features = compiler.features("cxx", {cofnig = {cxxflags = "-std=c++11"}})

-- Get all the features of the current C++ language compiler, pass all configuration information of the project target
local features = compiler.features("cxx", {target = target, config = {defines = "..", includedirs = ".."}})
```

A list of all c compiler features:

| Feature Name |
| --------------------- |
| c_static_assert |
| c_restrict |
| c_variadic_macros |
| c_function_prototypes |

A list of all C++ compiler features:

| Feature Name |
| ------------------------------------ |
| cxx_variable_templates |
| cxx_relaxed_constexpr |
| cxx_aggregate_default_initializers |
| cxx_contextual_conversions |
| cxx_attribute_deprecated |
| cxx_decltype_auto |
| cxx_digit_separators |
| cxx_generic_lambdas |
| cxx_lambda_init_captures |
| cxx_binary_literals |
| cxx_return_type_deduction |
| cxx_decltype_incomplete_return_types |
| cxx_reference_qualified_functions |
| cxx_alignof |
| cxx_attributes |
| cxx_inheriting_constructors |
| cxx_thread_local |
| cxx_alias_templates |
| cxx_delegating_constructors |
| cxx_extended_friend_declarations |
| cxx_final |
| cxx_nonstatic_member_init |
| cxx_override |
| cxx_user_literals |
| cxx_constexpr |
| cxx_defaulted_move_initializers |
| cxx_enum_forward_declarations |
| cxx_noexcept |
| cxx_nullptr |
| cxx_range_for |
| cxx_unrestricted_unions |
| cxx_explicit_conversions |
| cxx_lambdas |
| cxx_local_type_template_args |
| cxx_raw_string_literals |
| cxx_auto_type |
| cxx_defaulted_functions |
| cxx_deleted_functions |
| cxx_generalized_initializers |
| cxx_inline_namespaces |
| cxx_sizeof_member |
| cxx_strong_enums |
| cxx_trailing_return_types |
| cxx_unicode_literals |
| cxx_uniform_initialization |
| cxx_variadic_templates |
| cxx_decltype |
| cxx_default_function_template_args |
| cxx_long_long_type |
| cxx_right_angle_brackets |
| cxx_rvalue_references |
| cxx_static_assert |
| cxx_extern_templates |
| cxx_func_identifier |
| cxx_variadic_macros |
| cxx_template_template_parameters |

###### compiler.has_features

- Determine if the specified compiler feature is supported

Although it can be obtained by [lib.detect.has_features](detect-has-features), but the interface is more low-level, you need to specify the compiler name.
And this interface only needs to specify the special name list that needs to be detected, it can automatically switch to select the currently supported compiler, and then determine whether the specified feature is supported in the current compiler.

```lua
if compiler.has_features("c_static_assert") then
    -- ok
end

if compiler.has_features({"c_static_assert", "cxx_constexpr"}, {languages ​​= "cxx11"}) then
    -- ok
end

if compiler.has_features("cxx_constexpr", {target = target, defines = "..", includedirs = ".."}) then
    -- ok
end
```

For specific feature names, refer to [compiler.features](#compiler-features).

##### core.project.config

Used to get the configuration information when the project is compiled, that is, the value of the parameter option passed in `xmake f|config --xxx=val`.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [config.get](#config-get) | Get the specified configuration value | >= 2.0.1 |
| [config.load](#config-load) | Load Configuration | >= 2.0.1 |
| [config.arch](#config-arch) | Get the schema configuration of the current project | >= 2.0.1 |
| [config.plat](#config-plat) | Get the platform configuration of the current project | >= 2.0.1 |
| [config.mode](#config-mode) | Get the compilation mode configuration of the current project | >= 2.0.1 |
| [config.buildir](#config-buildir) | Get the output directory configuration of the current project | >= 2.0.1 |
| [config.directory](#config-dIrectory) | Get the configuration information directory of the current project | >= 2.0.1 |
| [config.dump](#config-dump) | Print out all configuration information for the current project | >= 2.0.1 |

###### config.get

- Get the specified configuration value

Used to get the configuration value of `xmake f|config --xxx=val`, for example:

```lua
target("test")
    on_run(function (target)

        -- Import configuration module
        import("core.project.config")

        -- Get configuration values
        print(config.get("xxx"))
    end)
```

###### config.load

- Load configuration

Generally used in plug-in development, the plug-in task is not like the custom script of the project, the environment needs to be initialized and loaded by itself, the default project configuration is not loaded, if you want to use [config.get](#config-get) interface to get the project Configuration, then you need to:

```lua

-- Import configuration module
import("core.project.config")

function main(...)

    -- Load project configuration first
    config.load()

    -- Get configuration values
    print(config.get("xxx"))
end
```

###### config.arch

- Get the schema configuration of the current project

That is to get the platform configuration of `xmake f|config --arch=armv7`, which is equivalent to `config.get("arch")`.

###### config.plat

- Get the platform configuration of the current project

That is to get the platform configuration of `xmake f|config --plat=iphoneos`, which is equivalent to `config.get("plat")`.

###### config.mode

- Get the compilation mode configuration of the current project

That is to get the platform configuration of `xmake f|config --mode=debug`, which is equivalent to `config.get("mode")`.

###### config.buildir

- Get the output directory configuration of the current project

That is to get the platform configuration of `xmake f|config -o /tmp/output`, which is equivalent to `config.get("buildir")`.

###### config.directory

- Get the configuration information directory of the current project

Get the storage directory of the project configuration, the default is: `projectdir/.config`

###### config.dump

- Print out all configuration information of the current project

The output is for example:

```lua
{
    sh = "xcrun -sdk macosx clang++"
,   xcode_dir = "/Applications/Xcode.app"
,   ar = "xcrun -sdk macosx ar"
,   small = true
,   object = false
,   arch = "x86_64"
,   xcode_sdkver = "10.12"
,   ex = "xcrun -sdk macosx ar"
,   cc = "xcrun -sdk macosx clang"
,   rc = "rustc"
,   plat = "macosx"
,   micro = false
,   host = "macosx"
,   as = "xcrun -sdk macosx clang"
,   dc = "dmd"
,   gc = "go"
,   openssl = false
,   ccache = "ccache"
,   cxx = "xcrun -sdk macosx clang"
,   sc = "xcrun -sdk macosx swiftc"
,   mm = "xcrun -sdk macosx clang"
,   buildir = "build"
,   mxx = "xcrun -sdk macosx clang++"
,   ld = "xcrun -sdk macosx clang++"
,   mode = "release"
,   kind = "static"
}
```

##### core.project.global

<p class="tip">
This module was migrated to [core.base.global](#core-base-global) since version 2.1.5.
</p>

##### core.project.task

<p class="tip">
This module has been migrated to [core.base.task](#core-base-task) since version 2.1.5.
</p>

##### core.project.project

Used to get some description information of the current project, that is, the configuration information defined in the `xmake.lua` project description file, for example: [target](#target), [option](#option), etc.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------------------- |
| [project.load](#project-load) | Load Project Configuration | >= 2.0.1 (2.1.5 Obsolete) |
| [project.directory](#project-directory) | Get Project Directory | >= 2.0.1 |
| [project.target](#project-target) | Get the specified project target object | >= 2.0.1 |
| [project.targets](#project-targets) | Get the list of project target objects | >= 2.0.1 |
| [project.option](#project-option) | Get the specified option object | >= 2.1.5 |
| [project.options](#project-options) | Get all option objects for the project | >= 2.1.5 |
| [project.name](#project-name) | Get current project name | >= 2.0.1 |
| [project.version](#project-version) | Get current project version number | >= 2.0.1 |

###### project.load

- Load project description configuration

It is only used in the plugin, because the project configuration information has not been loaded at this time. In the custom script of the project target, you do not need to perform this operation, you can directly access the project configuration.

```lua
-- Import engineering modules
import("core.project.project")

-- Plugin entry
function main(...)

    -- Load project description configuration
    project.load()

    -- access project descriptions, such as getting specified project goals
    local target = project.target("test")
end
```

<p class="tip">
After version 2.1.5, if not needed, the project load will automatically load at the appropriate time.
</p>

###### project.directory

- Get the project directory

Get the current project directory, which is the directory specified in `xmake -P xxx`, otherwise it is the default current `xmake` command execution directory.

<p class="tip">
After version 2.1.5, it is recommended to use [os.projectdir](#os-projectdir) to get it.
</p>

###### project.target

- Get the specified project target object

Get and access the specified project target configuration, for example:

```lua
local target = project.target("test")
if target then

    -- Get the target file name
    print(target:targetfile())

    -- Get the target type, which is: binary, static, shared
    print(target:targetkind())

    -- Get the target name
    print(target:name())

    -- Get the target source file
    local sourcefiles = target:sourcefiles()

    -- Get a list of target installation header files
    local srcheaders, dstheaders = target:headerfiles()

    -- Get target dependencies
    print(target:get("deps"))
end
```

###### project.targets

- Get a list of project target objects

Returns all compilation targets for the current project, for example:

```lua
for targetname, target in pairs(project.targets())
    print(target:targetfile())
end
```

###### project.option

- Get the specified option object

Get and access the option objects specified in the project, for example:

```lua
local option = project.option("test")
if option:enabled() then
    option:enable(false)
end
```

###### project.options

- Get all project option objects

Returns all compilation targets for the current project, for example:

```lua
for optionname, option in pairs(project.options())
    print(option:enabled())
end
```

###### project.name

- Get the current project name

That is, get the project name configuration of [set_project](#set_project).

```lua
print(project.name())
```

###### project.version

- Get the current project version number

That is, get [set_version](#set_version) project version configuration.

```lua
print(project.version())
```

##### core.language.language

Used to obtain information about the compiled language, generally used for the operation of code files.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [language.extensions](#language-extensions) | Get a list of code suffixes for all languages ​​| >= 2.1.1 |
| [language.targetkinds](#language-targetkinds) | Get a list of target types for all languages ​​| >= 2.1.1 |
| [language.sourcekinds](#language-sourcekinds) | Get a list of source file types for all languages ​​| >= 2.1.1 |
| [language.sourceflags](#language-sourceflags) | Load source file compilation option name list for all languages ​​| >= 2.1.1 |
| [language.load](#language-load) | Load the specified language | >= 2.1.1 |
| [language.load_sk](#language-load_sk) | Load the specified language from the source file type | >= 2.1.1 |
| [language.load_ex](#language-load_ex) | Load the specified language from the source file suffix | >= 2.1.1 |
| [language.sourcekind_of](#language-sourcekind_of) | Get the source file type of the specified source file | >= 2.1.1 |

###### language.extensions

- Get a list of code suffixes for all languages

The results are as follows:

```lua
{
     [".c"] = cc
,    [".cc"] = cxx
,    [".cpp"] = cxx
,    [".m"] = mm
,    [".mm"] = mxx
,    [".swift"] = sc
,    [".go"] = gc
}
```

###### language.targetkinds

- Get a list of target types in all languages

The results are as follows:

```lua
{
     binary = {"ld", "gc-ld", "dc-ld"}
,    static = {"ar", "gc-ar", "dc-ar"}
,    shared = {"sh", "dc-sh"}
}
```

###### language.sourcekinds

- Get a list of source file types in all languages

The results are as follows:

```lua
{
     cc = ".c"
,    cxx = {".cc", ".cpp", ".cxx"}
,    mm = ".m"
,    mxx = ".mm"
,    sc = ".swift"
,    gc = ".go"
,    rc = ".rs"
,    dc = ".d"
,    as = {".s", ".S", ".asm"}
}
```

###### language.sourceflags

- Load a list of source file compilation option names for all languages

The results are as follows:

```lua
{
     cc = {"cflags", "cxflags"}
,    cxx = {"cxxflags", "cxflags"}
,    ...
}
```

###### language.load

- Load the specified language

Load a specific language object from the language name, for example:

```lua
local lang = language.load("c++")
if lang then
    print(lang:name())
end
```

###### language.load_sk

- Load the specified language from the source file type

Load specific language objects from the source file type: `cc, cxx, mm, mxx, sc, gc, as ..`, for example:

```lua
local lang = language.load_sk("cxx")
if lang then
    print(lang:name())
end
```

###### language.load_ex

- Load the specified language from the source file suffix name

Load specific language objects from the source file extension: `.cc, .c, .cpp, .mm, .swift, .go ..`, for example:

```lua
local lang = language.load_sk(".cpp")
if lang then
    print(lang:name())
end
```

###### language.sourcekind_of

- Get the source file type of the specified source file

That is, from a given source file path, get the type of source file it belongs to, for example:

```lua
print(language.sourcekind_of("/xxxx/test.cpp"))
```

The result is: `cxx`, which is the `c++` type. For the corresponding list, see: [language.sourcekinds](#language-sourcekinds)

##### core.platform.platform

Platform information related operations

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [platform.get](#platform-get) | Get configuration information about the specified platform | >= 2.0.1 |

###### platform.get

- Get configuration information about the specified platform

Get the information set in the platform configuration `xmake.lua`, which is generally only used when writing plugins, for example:

```lua
-- Get all support architectures for the current platform
print(platform.get("archs"))

-- Get the target file format information of the specified iphoneos platform
local formats = platform.get("formats", "iphoneos")
table.dump(formats)
```

For specific readable platform configuration information, please refer to: [platform](#platform)

##### core.platform.environment

Environment-related operations, used to enter and leave the terminal environment corresponding to the specified environment variables, generally used for the entry and departure of the `path` environment, especially some build tools that require a specific environment, such as: msvc toolchain.

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| [environment.enter](#environment-enter) | Enter the specified environment | >= 2.0.1 |
| [environment.leave](#environment-leave) | Leave the specified environment | >= 2.0.1 |

The currently supported environments are:

| Interface | Description | Supported Versions |
| ----------------------------------------------- | -------------------------------------------- | -------- |
| toolchains | Toolchain Execution Environment | >= 2.0.1 |

###### environment.enter

- Enter the specified environment

Enter the specified environment, for example, msvc has its own environment variable environment for running build tools, such as: `cl.exe`, `link.exe`, these time you want to run them in xmake, you need:

```lua
-- Enter the toolchain environment
environment.enter("toolchains")

-- At this time, run cl.exe to run normally. At this time, environment variables such as path will enter the environment mode of msvc.
os.run("cl.exe ..")

-- leaving the toolchain environment
environment.leave("toolchains")
```

Therefore, for the sake of versatility, the default xmake compiler will set this environment. Under Linux, basically the internal environment does not need special switching. At present, only msvc under Windows is processed.

###### environment.leave

- leaving the designated environment

For specific use, see: [environment.enter](#environment-enter)

##### lib.detect

This module provides very powerful probing capabilities for probing programs, compilers, language features, dependencies, and more.

<p class="tip">
The interface of this module is spread across multiple module directories, try to import it by importing a single interface, which is more efficient, for example: `import("lib.detect.find_package")` instead of `import("lib.detect ") `Import all to call.
</p>

| Interface | Description | Supported Versions |
| --------------------------------------------------- | -------------------------------------------- | -------------------- |
| [detect.find_file](#detect-find_file) | Find Files | >= 2.1.5 |
| [detect.find_path](#detect-find_path) | Find File Path | >= 2.1.5 |
| [detect.find_library](#detect-find_library) | Find Library Files | >= 2.1.5 |
| [detect.find_program](#detect-find_program) | Find executables | >= 2.1.5 |
| [detect.find_programver](#detect-find_programver) | Find executable version number | >= 2.1.5 |
| [detect.find_package](#detect-find_package) | Find package files, including library files and search paths | >= 2.1.5 |
| [detect.find_tool](#detect-find_tool) | Find Tool | >= 2.1.5 |
| [detect.find_toolname](#detect-find_toolname) | Find Tool Name | >= 2.1.5 |
| [detect.features](#detect-features) | Get all the features of the specified tool | >= 2.1.5 |
| [detect.has_features](#detect-has_features) | Determine if the specified feature is supported | >= 2.1.5 |
| [detect.has_flags](#detect-has_flags) | Determine if the specified parameter options are supported | >= 2.1.5 |
| [detect.has_cfuncs](#detect-has_cfuncs) | Determine if the specified c function exists | >= 2.1.5 |
| [detect.has_cxxfuncs](#detect-has_cxxfuncs) | Determine if the specified c++ function exists | >= 2.1.5 |
| [detect.has_cincludes](#detect-has_cincludes) | Determine if the specified c header file exists | >= 2.1.5 |
| [detect.has_cxxincludess](#detect-has_cxxincludes) | Determine if the specified c++ header file exists | >= 2.1.5 |
| [detect.has_ctypes](#detect-has_ctypes) | Determine if the specified c type exists | >= 2.1.5 |
| [detect.has_cxxtypes](#detect-has_cxxtypes) | Determine if the specified c++ type exists | >= 2.1.5 |
| [detect.check_cxsnippets](#detect-check_cxsnippets) | Check if c/c++ code snippets can be compiled by | >= 2.1.5 |

###### detect.find_file

- Find files

This interface provides a more powerful project than [os.files](#os-files), which can specify multiple search directories at the same time, and can also specify additional subdirectories for each directory to match the pattern lookup, which is equivalent to [ An enhanced version of os.files](#os-files).

E.g:

```lua
import("lib.detect.find_file")

local file = find_file("ccache", { "/usr/bin", "/usr/local/bin"})
```

If found, the result returned is: `/usr/bin/ccache`

It also supports pattern matching paths for recursive lookups, similar to `os.files`:

```lua
local file = find_file("test.h", { "/usr/include", "/usr/local/include/**"})
```

Not only that, but the path inside also supports built-in variables to get the path from the environment variables and the registry to find:

```lua
local file = find_file("xxx.h", { "$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name)"})
```

If the path rules are more complex, you can also dynamically generate path entries through a custom script:

```lua
local file = find_file("xxx.h", { "$(env PATH)", function () return val("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name"):match ("\"(.-)\"") end})
```

In most cases, the above use has met various needs. If you need some extended functions, you can customize some optional configurations by passing in the third parameter, for example:

```lua
local file = find_file("test.h", { "/usr", "/usr/local"}, {suffixes = {"/include", "/lib"}})
```

By specifying a list of suffixes subdirectories, you can extend the list of paths (the second parameter) so that the actual search directory is expanded to:

```
/usr/include
/usr/lib
/usr/local/include
/usr/local/lib
```

And without changing the path list, you can dynamically switch subdirectories to search for files.

<p class="tip">
We can also quickly call and test this interface with the `xmake lua` plugin: `xmake lua lib.detect.find_file test.h /usr/local`
</p>

###### detect.find_path

- Find the path

The usage of this interface is similar to [lib.detect.find_file](#detect-find_file), the only difference is that the returned results are different.
After the interface finds the incoming file path, it returns the corresponding search path, not the file path itself. It is generally used to find the parent directory location corresponding to the file.

```lua
import("lib.detect.find_path")

local p = find_path("include/test.h", { "/usr", "/usr/local"})
```

If the above code is successful, it returns: `/usr/local`, if `test.h` is in `/usr/local/include/test.h`.

Another difference is that this interface is passed in not only the file path, but also the directory path to find:

```lua
local p = find_path("lib/xxx", { "$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\XXXX;Name)"})
```

Again, this interface also supports pattern matching and suffix subdirectories:

```lua
local p = find_path("include/*.h", { "/usr", "/usr/local/**"}, {suffixes = "/subdir"})
```

###### detect.find_library

- Find library files

This interface is used to find library files (static libraries, dynamic libraries) in the specified search directory, for example:

```lua
import("lib.detect.find_library")

local library = find_library("crypto", {"/usr/lib", "/usr/local/lib"})
```

Running on macosx, the results returned are as follows:

```lua
{
    filename = libcrypto.dylib
,   linkdir = /usr/lib
,   link = crypto
,   kind = shared
}
```

If you do not specify whether you need a static library or a dynamic library, then this interface will automatically select an existing library (either a static library or a dynamic library) to return.

If you need to force the library type you need to find, you can specify the kind parameter as (`static/shared`):

```lua
local library = find_library("crypto", {"/usr/lib", "/usr/local/lib"}, {kind = "static"})
```

This interface also supports suffixes suffix subdirectory search and pattern matching operations:

```lua
local library = find_library("cryp*", {"/usr", "/usr/local"}, {suffixes = "/lib"})
```

###### detect.find_program

- Find executable programs

This interface is more primitive than [lib.detect.find_tool](#detect-find_tool), looking for executables through the specified parameter directory.

```lua
import("lib.detect.find_program")

local program = find_program("ccache")
```

The above code is like not passing the search directory, so it will try to execute the specified program directly. If it runs ok, it will return directly: `ccache`, indicating that the search is successful.

Specify the search directory and modify the test command parameters that are attempted to run (default: `ccache --version`):

```lua
localProgram = find_program("ccache", {pathes = {"/usr/bin", "/usr/local/bin"}, check = "--help"})
```

The above code will try to run: `/usr/bin/ccache --help`, if it runs successfully, it returns: `/usr/bin/ccache`.

If `--help` can't satisfy the requirement, some programs don't have the `--version/--help` parameter, then you can customize the run script to run the test:

```lua
local program = find_program("ccache", {pathes = {"/usr/bin", "/usr/local/bin"}, check = function (program) os.run("%s -h", program) end })
```

Similarly, the search path list supports built-in variables and custom scripts:

```lua
local program = find_program("ccache", {pathes = {"$(env PATH)", "$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug;Debugger)"}})
local program = find_program("ccache", {pathes = {"$(env PATH)", function () return "/usr/local/bin" end}})
```

<p class="tip">
In order to speed up the efficiency of frequent lookups, this interface comes with a default cache, so even if you frequently find the same program, it will not take too much time.
If you want to disable the cache, you can clear the local cache by executing `xmake f -c` in the project directory.
</p>

We can also test quickly with `xmake lua lib.detect.find_program ccache`.

###### detect.find_programver

- Find the executable version number


```lua
import("lib.detect.find_programver")

local programver = find_programver("ccache")
```

The return result is: 3.2.2

By default it will try to get the version via `ccache --version`. If this parameter doesn't exist, you can specify other parameters yourself:

```lua
local version = find_programver("ccache", {command = "-v"})
```

Even the custom version gets the script:

```lua
local version = find_programver("ccache", {command = function () return os.iorun("ccache --version") end})
```

For the extraction rule of the version number, if the built-in matching mode does not meet the requirements, you can also customize:

```lua
local version = find_programver("ccache", {command = "--version", parse = "(%d+%.?%d*%.?%d*.-)%s"})
local version = find_programver("ccache", {command = "--version", parse = function (output) return output:match("(%d+%.?%d*%.?%d*.-)%s ") end})
```

<p class="tip">
In order to speed up the efficiency of frequent lookups, this interface is self-contained by default. If you want to disable the cache, you can execute `xmake f -c` in the project directory to clear the local cache.
</p>

We can also test quickly with `xmake lua lib.detect.find_programver ccache`.

###### detect.find_package

- Find package files

This interface is also used to find library files, but it is higher than [lib.detect.find_library](#detect-find_library), and it is more powerful and easy to use, because it is based on the strength of the package.

So what is a complete package, it contains:

1. Multiple static libraries or dynamic library files
2. Library search directory
3. Search directory for header files
4. Optional compile link options, such as `defines`
5. Optional version number

For example, we look for an openssl package:

```lua
import("lib.detect.find_package")

local package = find_package("openssl")
```

The returned results are as follows:

```lua
{links = {"ssl", "crypto", "z"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}}
```

If the search is successful, return a table containing all the package information, if it fails, return nil

The return result here can be directly passed as the parameter of `target:add`, `option:add`, which is used to dynamically increase the configuration of `target/option`:

```lua
option("zlib")
    set_showmenu(true)
    before_check(function (option)
        import("lib.detect.find_package")
        option:add(find_package("zlib"))
    end)
```

```lua
target("test")
    on_load(function (target)
        import("lib.detect.find_package")
        target:add(find_package("zlib"))
    end)
```

If third-party tools such as `homebrew`, `pkg-config` are installed on the system, then this interface will try to use them to improve the search results.

We can also choose to find the package of the specified version by specifying the version number (if the package does not get the version information or there is no matching version of the package, then return nil):

```lua
local package = find_package("openssl", {version = "1.0.1"})
```

The packages that are looked up by default are matched to the platform, architecture, and mode according to the following rules:

1. If the parameter passed in specifies `{plat = "iphoneos", arch = "arm64", mode = "release"}`, then match first, for example: `find_package("openssl", {plat = "iphoneos"} )`.
2. If there is a configuration file in the current project environment, try to get it from `config.get("plat")`, `config.get("arch")` and `config.get("mode")` The platform architecture is matched.
3. Finally, the matching is done from `os.host()` and `os.arch()`, which is the platform architecture environment of the current host.

If the system's library directory and `pkg-config` are not enough to meet the requirements and the package cannot be found, you can manually set the search path yourself:

```lua
local package = find_package("openssl", {linkdirs = {"/usr/lib", "/usr/local/lib"}, includedirs = "/usr/local/include"})
```

You can also specify the link name you want to search at the same time, the header file name:

```lua
local package = find_package("openssl", {links = {"ssl", "crypto"}, includes = "ssl.h"}})
```

You can even specify xmake's `packagedir/*.pkg` package directory to find the corresponding `openssl.pkg` package, which is typically used to find local packages built into the project directory.

For example, the tbox project has a built-in `pkg/openssl.pkg` local package project. We can use the following script to pass in the `{packagedirs = ""}` parameter to find the local package first. If it can't find it, go to the system. package.

```lua
target("test")
    on_load(function (target)
        import("lib.detect.find_package")
        target:add(find_package("openssl", {packagedirs = path.join(os.projectdir(), "pkg")}))
    end)
```

To summarize, the current search order:

1. If you specify the `{packagedirs = ""}` parameter, look for the local package `*.pkg` from the path specified by this parameter.
2. If there is a `detect.packages.find_xxx` script under `xmake/modules`, try calling this script to improve the lookup results.
3. If vcpkg exists in the system, obtain the package from the vcpkg package management system.
4. If the system has `pkg-config` and you are looking for a library for the system environment, try to find it using the path and link information provided by `pkg-config`
5. If the system has `homebrew` and you are looking for a library for the system environment, try to find it using the information provided by `brew --prefix xxx`
6. Find from the pathes path specified in the parameter and some known system paths `/usr/lib`, `/usr/include`

Here we need to focus on the second point, through the `detect.packages.find_xxx` script to improve the search results, many times automatic packet detection is unable to fully detect the package path,
Especially for the windows platform, there is no default library directory, and there is no package management app. When many libraries are installed, they are placed in the system directory, or add a registry key.

Therefore, there is no uniform rule for finding it. At this time, you can customize a search script to improve the lookup mechanism of `find_package` and perform more accurate search for the specified package.

In the xmake/modules/detect/packages` directory that comes with xmake, there are already many built-in package scripts for better lookup support for commonly used packages.
Of course, this is not enough for all users. If the package that the user needs is still not found, then you can define a search script yourself, for example:

To find a package named `openssl`, you can write a script for `find_openssl.lua` placed in the project directory:

```
Projectdir
 - xmake
   - modules
     - detect/package/find_openssl.lua
```

Then specify the directory for this module at the beginning of the project's `xmake.lua` file:

```lua
add_moduledirs("$(projectdir)/xmake/modules")
```

This way xmake will be able to find custom extensions.

Next we look at the implementation of `find_openssl.lua`:

```lua
-- imports
import("lib.detect.find_path")
import("lib.detect.find_library")

-- find openssl
--
-- @param opt the package options. e.g. see the options of find_package()
--
-- @return see the return value of find_package()
--
function main(opt)

    -- for windows platform
    --
    -- http://www.slproweb.com/products/Win32OpenSSL.html
    --
    if opt.plat == "windows" then

        -- init bits
        local bits = ifelse(opt.arch == "x64", "64", "32")

        -- init search pathes
        local pathes = {"$(reg HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\OpenSSL %(" .. bits .. "-bit%)_is1;Inno Setup: App Path)",
                        "$(env PROGRAMFILES)/OpenSSL",
                        "$(env PROGRAMFILES)/OpenSSL-Win" .. bits,
                        "C:/OpenSSL",
                        "C:/OpenSSL-Win" .. bits}

        -- find library
        local result = {links = {}, linkdirs = {}, includedirs = {}}
        for _, name in ipairs({"libssl", "libcrypto"}) do
            local linkinfo = find_library(name, pathes, {suffixes = "lib"})
            if linkinfo then
                table.insert(result.links, linkinfo.link)
                table.insert(result.linkdirs, linkinfo.linkdir)
            end
        end

        -- not found?
        if #result.links ~= 2 then
            return
        end

        -- find include
        table.insert(result.includedirs, find_path("openssl/ssl.h", pathes, {suffixes = "include"}))

        -- ok
        return result
        end
    end
```

Inside the windows platform to read the registry, to find the
specified library file, the bottom layer is actually called
[find_library] (#detect-find_library) and other interfaces.

<p class="tip"> In order to speed up the efficiency of frequent
lookups, this interface is self-contained by default. If you want to
disable the cache, you can execute `xmake f -c` in the project
directory to clear the local cache.  You can also disable the cache by
specifying the force parameter, forcing a re-find:
`find_package("openssl", {force = true})` </p>

We can also test quickly with `xmake lua lib.detect.find_package
openssl`.

After the 2.2.5 version, the built-in interface [find_packages]
(#find_packages) has been added, which can find multiple packages at
the same time, and can be used directly without importing by import.

And after this release, support for explicitly looking for packages
from a specified third-party package manager, for example:

```lua find_package("brew::pcre2/libpcre2-8") ```

Since the package name of each third-party package manager is not
completely consistent, for example, pcre2 has three library versions
in homebrew, we can specify the library corresponding to libpcre2-8
version by the above method.

In addition, for vcpkg, conan can also specify the library inside by
adding the `vcpkg::`, `conan::` package namespace.

###### detect.find_tool

- Find tool

This interface is also used to find executable programs, but more
advanced than [lib.detect.find_program] (#detect-find_program), the
function is also more powerful, it encapsulates the executable
program, providing the concept of tools:

* toolname: tool name, short for executable program, used to mark a
* tool, for example: `gcc`, `clang`, etc.  program: executable program
* command, for example: `xcrun -sdk macosx clang`

The corresponding relationship is as follows:

| toolname | program |
| --------- | ----------------------------------- |
| clang | `xcrun -sdk macosx clang` |
| gcc | `/usr/toolchains/bin/arm-linux-gcc` |
| link | `link.exe -lib` |

[lib.detect.find_program](#detect-find_program) can only determine
whether the program exists by passing in the original program command
or path.  And `find_tool` can find the tool through a more consistent
toolname, and return the corresponding program complete command path,
for example:

```lua
import("lib.detect.find_tool")

local tool = find_tool("clang")
```

The result returned is: `{name = "clang", program = "clang"}`, at this
time there is no difference, we can manually specify the executable
command:

```lua
local tool = find_tool("clang", {program = "xcrun -sdk macosx clang"})
```

The result returned is: `{name = "clang", program = "xcrun -sdk macosx
clang"}`

In macosx, gcc is clang. If we execute `gcc --version`, we can see
that it is a vest of clang. We can intelligently identify it through
the `find_tool` interface:

```lua
local tool = find_tool("gcc")
```

The result returned is: `{name = "clang", program = "gcc"}`

The difference can be seen by this result. The tool name will actually
be marked as clang, but the executable command uses gcc.

We can also specify the `{version = true}` parameter to get the
version of the tool, and specify a custom search path. It also
supports built-in variables and custom scripts:

```lua
local tool = find_tool("clang", {version = true, {pathes = {"/usr/bin", "/usr/local/bin", "$(env PATH)", function () return "/usr/xxx/bin" end}})
```

The result returned is: `{name = "clang", program = "/usr/bin/clang",
version = "4.0"}`

This interface is a high-level wrapper around `find_program`, so it
also supports custom script detection:

```lua
local tool = find_tool("clang", {check = "--help"})
local tool = find_tool("clang", {check = function (tool) os.run("%s -h", tool) end})
```

Finally, the search process of `find_tool`:

1. First try to run and detect with the argument of `{program =
"xxx"}`.  2. If there is a `detect.tools.find_xxx` script in
`xmake/modules/detect/tools`, call this script for more accurate
detection.  3. Try to detect from the system directory such as
`/usr/bin`, `/usr/local/bin`.

We can also add a custom lookup script to the module directory
specified by `add_moduledirs` in the project `xmake.lua` to improve
the detection mechanism:

```
projectdir
- xmake/modules
- detect/tools/find_xxx.lua
```

For example, we customize a lookup script for `find_7z.lua`:

```lua
import("lib.detect.find_program")
import("lib.detect.find_programver")

function main(opt)

    -- init options
    opt = opt or {}

    -- find program
    local program = find_program(opt.program or "7z", opt.pathes, opt.check or "--help")

    -- find program version
    local version = nil
    if program and opt and opt.version then
        version = find_programver(program, "--help", "(%d+%.?%d*)%s")
    end

    -- ok?
    return program, version
end
```

After placing it in the project's module directory, execute: `xmake l
lib.detect.find_tool 7z` to find it.

<p class="tip"> In order to speed up the efficiency of frequent
lookups, this interface is self-contained by default. If you want to
disable the cache, you can execute `xmake f -c` in the project
directory to clear the local cache.  </p>

We can also test quickly with `xmake lua lib.detect.find_tool clang`.

###### detect.find_toolname

- Find tool name

Match the corresponding tool name with the program command, for
example:

| program | toolname |
| ------------------------- | ---------- |
| `xcrun -sdk macosx clang` | clang |
| `/usr/bin/arm-linux-gcc` | gcc |
| `link.exe -lib` | link |
| `gcc-5` | gcc |
| `arm-android-clang++` | clangxx |
| `pkg-config` | pkg_config |

Compared with program, toolname can uniquely mark a tool, and it is also convenient to find and load the corresponding script `find_xxx.lua`.

###### detect.features

- Get all the features of the specified tool

This interface is similar to [compiler.features](#compiler-features). The difference is that this interface is more primitive. The passed argument is the actual tool name toolname.

And this interface not only can get the characteristics of the compiler, the characteristics of any tool can be obtained, so it is more versatile.

```lua
import("lib.detect.features")

local features = features("clang")
local features = features("clang", {flags = "-O0", program = "xcrun -sdk macosx clang"})
local features = features("clang", {flags = {"-g", "-O0", "-std=c++11"}})
```

By passing in flags, you can change the result of the feature, for example, some features of C++11, which are not available by default. After enabling `-std=c++11`, you can get it.

A list of all compiler features can be found at [compiler.features](#compiler-features).

###### detect.has_features

- Determine if the specified feature is supported

This interface is similar to [compiler.has_features](#compiler-has_features), but more primitive, the passed argument is the actual tool name toolname.

And this interface can not only judge the characteristics of the compiler, but the characteristics of any tool can be judged, so it is more versatile.

```lua
import("lib.detect.has_features")

local features = has_features("clang", "cxx_constexpr")
local features = has_features("clang", {"cxx_constexpr", "c_static_assert"}, {flags = {"-g", "-O0"}, program = "xcrun -sdk macosx clang"})
local features = has_features("clang", {"cxx_constexpr", "c_static_assert"}, {flags = "-g"})
```

If the specified feature list exists, the actual supported feature sublist is returned. If none is supported, nil is returned. We can also change the feature acquisition rule by specifying flags.

A list of all compiler features can be found at [compiler.features](#compiler-features).

###### detect.has_flags

- Determine if the specified parameter option is supported

This interface is similar to [compiler.has_flags](#compiler-has_flags), but more primitive, the passed argument is the actual tool name toolname.

```lua
import("lib.detect.has_flags")

local ok = has_flags("clang", "-g")
local ok = has_flags("clang", {"-g", "-O0"}, {program = "xcrun -sdk macosx clang"})
local ok = has_flags("clang", "-g -O0", {toolkind = "cxx"})
```

Returns true if the test passed.

The detection of this interface has been optimized. Except for the cache mechanism, in most cases, the tool's option list (`--help`) will be directly judged. If the option list is not available, it will be tried. The way to run to detect.

###### detect.has_cfuncs

- Determine if the specified c function exists

This interface is a simplified version of [lib.detect.check_cxsnippets](#detect-check_cxsnippets) and is only used to detect functions.

```lua
import("lib.detect.has_cfuncs")

local ok = has_cfuncs("setjmp")
local ok = has_cfuncs({"sigsetjmp((void*)0, 0)", "setjmp"}, {includes = "setjmp.h"})
```

The rules for describing functions are as follows:

| Function Description | Description |
| ----------------------------------------------- | ------------- |
| `sigsetjmp` | pure function name |
| `sigsetjmp((void*)0, 0)` | Function Call |
| `sigsetjmp{int a = 0; sigsetjmp((void*)a, a);}` | function name + {} block |

In the last optional parameter, in addition to specifying `includes`, you can also specify other parameters to control the option conditions for compile detection:

```lua
{ verbose = false, target = [target|option], includes = .., config = {linkdirs = .., links = .., defines = ..}}
```

The verbose is used to echo the detection information, the target is used to append the configuration information in the target before the detection, and the config is used to customize the compilation options related to the target.

###### detect.has_cxxfuncs

- Determine if the specified c++ function exists

This interface is similar to [lib.detect.has_cfuncs](#detect-has_cfuncs), please refer to its instructions for use. The only difference is that this interface is used to detect c++ functions.

###### detect.has_cincludes

- Determine if the specified c header file exists

This interface is a simplified version of [lib.detect.check_cxsnippets](#detect-check_cxsnippets) and is only used to detect header files.

```lua
import("lib.detect.has_cincludes")

local ok = has_cincludes("stdio.h")
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {target = target})
local ok = has_cincludes({"stdio.h", "stdlib.h"}, {config = {defines = "_GNU_SOURCE=1", languages ​​= "cxx11"}})
```

###### detect.has_cxxincludes

- Determine if the specified c++ header file exists

This interface is similar to [lib.detect.has_cincludess](#detect-has_cincludes), please refer to its instructions for use. The only difference is that this interface is used to detect c++ header files.

###### detect.has_ctypes

- Determine if the specified c type exists

This interface is a simplified version of [lib.detect.check_cxsnippets](#detect-check_cxsnippets) and is only used to detect functions.

```lua
import("lib.detect.has_ctypes")

local ok = has_ctypes("wchar_t")
local ok = has_ctypes({"char", "wchar_t"}, {includes = "stdio.h"})
local ok = has_ctypes("wchar_t", {includes = {"stdio.h", "stdlib.h"}, config = {"defines = "_GNU_SOURCE=1", languages ​​= "cxx11"}})
```

###### detect.has_cxxtypes

- Determine if the specified c++ type exists

This interface is similar to [lib.detect.has_ctypess](#detect-has_ctypes). Please refer to its instructions for use. The only difference is that this interface is used to detect c++ types.

###### detect.check_cxsnippets

- Check if the c/c++ code snippet can be compiled

The generic c/c++ code snippet detection interface, by passing in a list of multiple code snippets, it will automatically generate a compiled file, and then common sense to compile it, if the compilation pass returns true.

For some complex compiler features, even if [compiler.has_features](#compiler-has_features) can't detect it, you can detect it by trying to compile through this interface.

```lua
import("lib.detect.check_cxsnippets")

local ok = check_cxsnippets("void test() {}")
local ok = check_cxsnippets({"void test(){}", "#define TEST 1"}, {types = "wchar_t", includes = "stdio.h"})
```

This interface is a generic version of interfaces such as [detect.has_cfuncs](#detect-has_cfuncs), [detect.has_cincludes](#detect-has_cincludes), and [detect.has_ctypes](detect-has_ctypes), and is also lower level.

So we can use it to detect: types, functions, includes and links, or combine them together to detect.

The first parameter is a list of code fragments, which are generally used for the detection of some custom features. If it is empty, it can only detect the conditions in the optional parameters, for example:

```lua
local ok = check_cxsnippets({}, {types = {"wchar_t", "char*"}, includes = "stdio.h", funcs = {"sigsetjmp", "sigsetjmp((void*)0, 0)"} })
```

The above call will check if the types, includes and funcs are both satisfied, and return true if passed.

There are other optional parameters:

```lua
{ verbose = false, target = [target|option], sourcekind = "[cc|cxx]"}
```

The verbose is used to echo the detection information. The target is used to append the configuration information in the target before the detection. The sourcekind is used to specify the tool type such as the compiler. For example, the incoming `cxx` is forced to be detected as c++ code.

##### net.http

This module provides various operational support for http. The currently available interfaces are as follows:

| Interface | Description | Supported version|
| --------------------------------------------------- | -------------------------------------------- | -------------------- |
[http.download](#http-download) | Download http file | >= 2.1.5 |

###### http.download

- Download http file

This interface is relatively simple, is simply download files.

```lua
import("net.http")

http.download("http://xmake.io", "/tmp/index.html")
```

##### privilege.sudo

This interface is used to run commands via `sudo` and provides platform consistency handling, which can be used for scripts that require root privileges to run.

<p class="warning">
In order to ensure security, unless you must use it, try not to use this interface in other cases.
</p>

| Interface | Description | Supported Versions |
| --------------------------------------------------- | -------------------------------------------- | -------------------- |
| [sudo.has](#sudo-has) | Determine if sudo supports | >= 2.1.5 |
| [sudo.run](#sudo-run) | Quiet running program | >= 2.1.5 |
| [sudo.runv](#sudo-runv) | Quiet running program with parameter list | >= 2.1.5 |
| [sudo.exec](#sudo-exec) | Evoke Run Program | >= 2.1.5 |
| [sudo.execv](#sudo-execv) | Echo running program with parameter list | >= 2.1.5 |
| [sudo.iorun](#sudo-iorun) | Run and get the program output | >= 2.1.5 |
| [sudo.iorunv](#sudo-iorunv) | Run and get the program output with parameter list | >= 2.1.5 |

###### sudo.has

- Determine if sudo supports

At present, sudo is supported only under `macosx/linux`. The administrator privilege running on Windows is not supported yet. Therefore, it is recommended to use the interface to judge the support situation before use.

```lua
import("privilege.sudo")

if sudo.has() then
    sudo.run("rm /system/file")
end
```

###### sudo.run

- Quietly running native shell commands

For specific usage, please refer to: [os.run](#os-run).

```lua
import("privilege.sudo")

sudo.run("rm /system/file")
```

###### sudo.runv

- Quietly running native shell commands with parameter list

For specific usage, please refer to: [os.runv](#os-runv).

###### sudo.exec

- Echo running native shell commands

For specific usage, please refer to: [os.exec](#os-exec).

###### sudo.execv

- Echo running native shell commands with parameter list

For specific usage, please refer to: [os.execv](#os-execv).

###### sudo.iorun

- Quietly running native shell commands and getting output

For specific usage, please refer to: [os.iorun](#os-iorun).

###### sudo.iorunv

- Run the native shell command quietly and get the output with a list of parameters

For specific usage, please refer to: [os.iorunv](#os-iorunv).

##### devel.git

This interface provides access to various commands of git. Compared to the direct call to git command, this module provides a more easy-to-use package interface and provides automatic detection and cross-platform processing for git.

<p class="tip">
Currently on Windows, you need to manually install the git package before you can detect it. The subsequent version will provide automatic integration of git function. Users will not need to care about how to install git, they can be used directly.
</p>

| Interface | Description | Supported Versions |
| --------------------------------------------------- | -------------------------------------------- | -------------------- |
| [git.clone](#git-clone) | clone codebase | >= 2.1.5 |
| [git.pull](#git-pull) | Pull the codebase latest commit | >= 2.1.5 |
| [git.clean](#git-clean) | Clean up the codebase file | >= 2.1.5 |
| [git.checkout](#git-checkout) | Check out the specified branch version | >= 2.1.5 |
| [git.refs](#git-refs) | Get a list of all references | >= 2.1.5 |
| [git.tags](#git-tags) | Get all tag lists | >= 2.1.5 |
| [git.branches](#git-branches) | Get a list of all branches | >= 2.1.5 |

###### git.clone

- clone codebase

This interface corresponds to the `git clone` command.

```lua
import("devel.git")

git.clone("git@github.com:tboox/xmake.git")
git.clone("git@github.com:tboox/xmake.git", {depth = 1, branch = "master", outputdir = "/tmp/xmake"})
```

###### git.pull

- Pull the code base for the latest submission

This interface corresponds to the `git pull` command.

```lua
import("devel.git")

git.pull()
git.pull({remote = "origin", tags = true, branch = "master", repodir = "/tmp/xmake"})
```

###### git.clean

- Clean up the code base file

This interface corresponds to the `git clean` command.

```lua
import("devel.git")

git.clean()
git.clean({repodir = "/tmp/xmake", force = true})
```

###### git.checkout

- Check out the specified branch version

This interface corresponds to the `git checkout` command

```lua
import("devel.git")

git.checkout("master", {repodir = "/tmp/xmake"})
git.checkout("v1.0.1", {repodir = "/tmp/xmake"})
```

###### git.refs

- Get a list of all references

This interface corresponds to the `git ls-remote --refs` command

```lua
import("devel.git")

local refs = git.refs(url)
```

###### git.tags

- Get a list of all tags

This interface corresponds to the `git ls-remote --tags` command

```lua
import("devel.git")

local tags = git.tags(url)
```

###### git.branches

- Get a list of all branches

This interface corresponds to the `git ls-remote --heads` command

```lua
import("devel.git")

local branches = git.branches(url)
```

##### utils.archive

This module is used to compress and decompress files.

| Interface | Description | Supported Versions |
| --------------------------------------------------- | -------------------------------------------- | -------------------- |
| [archive.extract](#archive-extract)| Extract files | >= 2.1.5 |

###### archive.extract

- unzip files

Supports the decompression of most commonly used compressed files. It automatically detects which decompression tools are provided by the system, and then adapts them to the most suitable decompressor to decompress the specified compressed files.

```lua
import("utils.archive")

archive.extract("/tmp/a.zip", "/tmp/outputdir")
archive.extract("/tmp/a.7z", "/tmp/outputdir")
archive.extract("/tmp/a.gzip", "/tmp/outputdir")
archive.extract("/tmp/a.tar.bz2", "/tmp/outputdir")
```
