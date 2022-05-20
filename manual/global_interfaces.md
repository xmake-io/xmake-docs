
The global interface affects the whole project description scope and all sub-project files.

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

#### Add the required dependency packages

The dependency package management of xmake fully supports semantic version selection, for example: "~1.6.1". For a detailed description of the semantic version, please see: [https://semver.org/](https://semver.org/)

##### Semantic version

```lua
add_requires("tbox 1.6.*", "pcre 8.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

At present, the semantic version parser used by xmake is the [sv](https://github.com/uael/sv) library contributed by [uael](https://github.com/uael), which also contains the version description writing method For detailed instructions, please refer to the following: [Version Description](https://github.com/uael/sv#versions)

##### Install latest version

Of course, if we have no special requirements for the version of the current dependency package, we can write it directly like this:

```lua
add_requires("tbox", "libpng", "zlib")
```

By default, if the version number is not set, xmake will select the latest version of the package, which is equivalent to `add_requires("zlib latest")`

##### Branch selection

This will use the latest known version of the package, or a package compiled from the source code of the master branch. If the current package has a git repo address, we can also specify a specific branch version:

```lua
add_requires("tbox master")
add_requires("tbox dev")
```

If the specified dependent package is not supported by the current platform, or the compilation and installation fails, then xmake will compile an error. This is reasonable for some projects that must rely on certain packages to work.
But if some packages are optional dependencies and can be compiled and used normally even if not, they can be set as optional packages:

##### Git commit selection

With version 2.6.5, we can select a version by specifying git commit directly for packages maintained by git.

```lua
add_requires("tbox e807230557aac69e4d583c75626e3a7ebdb922f8")
```

##### Optional package

```lua
add_requires("zlib", {optional = true})
```

##### Disable system package

With the default setting, xmake will first check whether the system library exists (if the version requirement is not set). If the user does not want to use the system library and the library provided by the third-party package management at all, then you can set:

```lua
add_requires("zlib", {system = false})
```

##### Disable package verification

The default package installation will automatically check the integrity of the downloaded package to avoid tampering, but if you install some unknown new version of the package, it will not work.

Users can install them temporarily via `{verify = false}` to forcibly disable the package integrity check (but this is generally not recommended).

```lua
add_requires("zlib", {verify = false})
```

##### Use the debug package

If we want to debug the dependent packages at the same time, we can set to use the debug version of the package (of course, the premise is that this package supports debug compilation):

```lua
add_requires("zlib", {debug = true})
```

If the current package does not support debug compilation, you can submit a modification to the compilation rules in the warehouse to support debugging, for example:

```lua
package("openssl")
    on_install("linux", "macosx", function (package)
        os.vrun("./config %s --prefix=\"%s\"", package:debug() and "--debug" or "", package:installdir())
        os.vrun("make -j4")
        os.vrun("make install")
    end)
```

##### Use as a private package

If this package is only used for package definition, and we don’t want to export links/linkdirs information by default, it can be provided as a private package.

This is usually useful when making packages.

```lua
package("test")
    add_deps("zlib", {private = true})
    on_install(function (package)
        local zlib = package:dep("zlib"):fetch()
        - TODO
    end)
```

If you define a test package and privately rely on a zlib package, wait for the zlib installation to complete, get the package file information inside for further processing and installation, but the zlib package itself will not export links/linkdirs.

Although `add_requires` also supports this option, it does not export links/linkdirs, so it is usually not used in this way. It is only useful for making packages.

##### Use dynamic libraries

The default package installs a static library. If you want to enable a dynamic library, you can configure it as follows:

```lua
add_requires("zlib", {configs = {shared = true}})
```

!> Of course, the premise is that in the definition of this package, there is a judgment and processing of `package:config("shared")`. In the official xmake-repo repository, it is usually strictly differentiated and supported.

##### Disable pic support

The linux packages installed by default are compiled with pic enabled, which is very useful for relying on static libraries in dynamic libraries, but if you want to disable pic, it is also possible.

```lua
add_requires("zlib", {configs = {pic = false}})
```

##### Set vs runtime

The windows package installed by default is compiled with msvc/MT, if you want to switch to MD, you can configure it as follows:

```lua
add_requires("zlib", {configs = {vs_runtime = "MD"}})
```

In addition, it supports four options: MT, MTd, MD, and MDd.

If there are many dependent packages, it is very troublesome to switch each configuration again. We can also switch through the `set_runtimes` global setting to take effect for all dependent packages.

```lua
set_runtimes("MD")
add_requires("zlib", "pcre2", "mbedtls")
```

##### Specific configuration package

Some packages have various compilation options during compilation, and we can also pass them in:

```lua
add_requires("boost", {configs = {context = true, coroutine = true}})
```

For example, the boost package installed above has enabled some of its internal sub-module features (packages with coroutine module support).

Of course, which configurations are specifically supported are different for each package. You can use the `xmake require --info boost` command to view the list of the configs section inside.

Because, in each package definition, there will be its own configuration options, and you can use `package:config("coroutine")` to determine whether to enable them during installation.

##### Install third-party manager package

Currently, the following packages in the third-party package manager are supported.

* Conan (conan::openssl/1.1.1g)
* Conda (conda::libpng 1.3.67)
* Vcpkg (vcpkg:ffmpeg)
* Homebrew/Linuxbrew (brew::pcre2/libpcre2-8)
* Pacman on archlinux/msys2 (pacman::libcurl)
* Apt on ubuntu/debian (apt::zlib1g-dev)
* Clib (clib::clibs/bytes@0.0.4)
* Dub (dub::log 0.4.3)
* Portage on Gentoo/Linux (portage::libhandy)


For example, add conan's dependency package:

```lua
add_requires("conan::zlib/1.2.11", {alias = "zlib", debug = true})
add_requires("conan::openssl/1.1.1g", {alias = "openssl",
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
  -> conan::zlib/1.2.11 (debug)
  -> conan::openssl/1.1.1g
please input: y (y/n)

  => installing conan::zlib/1.2.11 .. ok
  => installing conan::openssl/1.1.1g .. ok

[0%]: ccache compiling.release src/main.c
[100%]: linking.release test
```

For a complete introduction to this and the installation and use of all third-party packages,
you can refer to the document: [Third-party dependency package installation](https://xmake.io/#/package/remote_package?id=install-third-party-packages)

### add_requireconfs

#### Set the configuration of the specified dependent package

This is a newly added interface after v2.5.1. We can use it to expand and rewrite the configuration of the package defined by `add_requires()` and its dependent packages. It has the following uses.

##### Expand the configuration of the specified package

This is the basic usage. For example, we have declared a package through `add_requires("zlib")`, and want to expand the configuration of this zlib later and change it to dynamic library compilation. You can configure it in the following way.

```lua
add_requires("zlib")
add_requireconfs("zlib", {configs = {shared = true}})
```

It is equivalent to

```lua
add_requires("zlib", {configs = {shared = true}})
```

##### Set general default configuration

The above usage, we still don't see any practical use, we can look at the following example first:

```lua
add_requireconfs("*", {configs = {shared = true}})
add_requires("zlib")
add_requires("pcre")
add_requires("libpng")
add_requires("libwebp")
add_requires("libcurl", {configs = {shared = false}})
```

For the above configuration, we use pattern matching through `add_requireconfs("*", {configs = {shared = true}})` to set all dependent packages to compile and install dynamic libraries by default.

However, we used `add_requires("libcurl", {configs = {shared = false}})` to configure libcurl to compile and install static libraries.

The final configuration result is: zlib/pcre/libpng/libwebp is a shared library, and libcurl is a static library.

Through pattern matching, we can put some common configurations of each package into the unified `add_requireconfs` to pre-configure, which greatly simplifies the definition of each `add_requires`.

!> By default, for the same configuration, xmake will give priority to the configuration in add_requires instead of add_requireconfs.

If the version is set in `add_requires("zlib 1.2.11")`, the configuration of add_requires will be used first, and the version configuration in add_requireconfs will be completely ignored. Of course, we can also completely override the version specified in `add_requires` through override .

```lua
add_requires("zlib 1.2.11")
add_requireconfs("zlib", {override = true, version = "1.2.10"})
```

##### Rewrite package dependency configuration

In fact, the biggest use of `add_requireconfs` is to allow users to rewrite the configuration of specific dependent packages of the installation package.

What does it mean? For example, our project integrates the package libpng and uses a dynamic library version, but the zlib library that libpng depends on is actually a static library version.

```lua
add_requires("libpng", {configs = {shared = true}})
```

So if we want to change the zlib package that libpng depends on to be compiled as a dynamic library, how should we configure it? This requires `add_requireconfs`.


```lua
add_requires("libpng", {configs = {shared = true}})
add_requireconfs("libpng.zlib", {configs = {shared = true}})
```

Through the writing method of `libpng.zlib` dependency path, specify an internal dependency and rewrite the internal dependency configuration.

If the dependency path is deep, such as the dependency chain of `foo -> bar -> xyz`, we can write: `foo.bar.xyz`

We can also rewrite the internal zlib library version that libpng depends on:


```lua
add_requires("libpng")
add_requireconfs("libpng.zlib", {version = "1.2.10"})
```

##### Pattern matching for cascading dependencies

If a package has a lot of dependencies, and the dependency level is also very deep, what to do, for example, the package libwebp, its dependencies are:

```
libwebp
  - libpng
    - zlib
    - cmake
  - libjpeg
  - libtiff
    - zlib
  - giflib
  - cmake
```

If I want to rewrite all the dependent libraries in libwebp to add specific configuration, then the configuration one by one will be very cumbersome. At this time, the recursive dependency pattern matching of `add_requireconfs()` is needed to support.

```lua
add_requires("libwebp")
add_requireconfs("libwebp.**|cmake", {configs = {cxflags = "-DTEST"}})
```

In the above configuration, we added `-DTEST` to compile all the library dependencies in libwebp, but the cmake dependency is a build tool dependency, and we can exclude it by way of `|xxx`.

The pattern matching here is very similar to `add_files()`.

We are giving a few examples. For example, this time we only rewrite the single-level dependency configuration under libwebp to enable the debugging library:

```lua
add_requires("libwebp")
add_requireconfs("libwebp.*|cmake", {debug = true})
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

Note: myrepo is the relative path of the directory where the xmake command is executed. It will not be automatically converted according to the directory where the configuration file is located. If you want to set the path relative to the current xmake.lua file, you can specify it through the rootdir parameter.

```lua
add_repositories("my-repo myrepo", {rootdir = os.scriptdir()})
```

However, this parameter setting is only supported by v2.5.7 and above.

### set_defaultplat

#### Set the default compilation platform

Only supported by v2.5.6 and above, it is used to set the default compilation platform of the project. If it is not set, the default platform follows the current system platform, which is os.host().

For example, the default compilation platform on macOS is macosx, if the current project is an ios project, you can set the default compilation platform to iphoneos.

```lua
set_defaultplat("iphoneos")
```

It is equivalent to `xmake f -p iphoneos`.

### set_defaultarchs

#### Set the default compilation architecture

Only supported by v2.5.6 and above, it is used to set the default compilation architecture of the project. If it is not set, the default platform follows the current system architecture, which is os.arch().

```lua
set_defaultplat("iphoneos")
set_defaultarchs("arm64")
```

It is equivalent to `xmake f -p iphoneos -a arm64`.

We can also set the default architecture under multiple platforms.

```lua
set_defaultarchs("iphoneos|arm64", "windows|x64")
```

The arm64 architecture is compiled by default on iphoneos, and the x64 architecture is compiled by default on windows.

### set_defaultmode

#### Set the default compilation mode

Only supported by v2.5.6 and above, it is used to set the default compilation mode of the project. If it is not set, the default is to compile in release mode.

```lua
set_defaultmode("releasedbg")
```

It is equivalent to `xmake f -m releasedbg`.

### set_allowedplats

#### Set the list of platforms allowed to compile

It is only supported by v2.5.6 and above. It is used to set the list of compilation platforms supported by the project. If the user specifies other platforms, an error will be prompted. This is usually used to restrict the user from specifying the wrong invalid platform.

If it is not set, then there are no platform restrictions.

```lua
set_allowedplats("windows", "mingw")
```

Set the current project to only support windows and mingw platforms.

### set_allowedarchs

#### Set the platform architecture that allows compilation

Only supported by v2.5.6 and above. It is used to set the list of compiled architectures supported by the project. If the user specifies other architectures, an error will be prompted. This is usually used to restrict users from specifying incorrect invalid architectures.

If it is not set, then there are no architectural restrictions.

```lua
set_allowedarchs("x64", "x86")
```

The current project only supports x64/x86 platforms.

We can also specify the list of architectures allowed under multiple platforms at the same time.

```lua
set_allowedarchs("windows|x64", "iphoneos|arm64")
```

Set the current project to only support x64 architecture on windows, and only support arm64 architecture on iphoneos.

### set_allowedmodes

#### Set the list of allowed compilation modes

It is only supported by v2.5.6 and above. It is used to set the list of compilation modes supported by the project. If the user specifies other modes, an error will be prompted. This is usually used to restrict the user from specifying incorrect invalid modes.

If it is not set, then there is no mode restriction.

```lua
set_allowedmodes("release", "releasedbg")
```

Set the current project to only support the two compilation modes release/releasedbg.
