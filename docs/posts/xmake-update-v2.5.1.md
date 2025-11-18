---
title: xmake v2.5.1 released, Support for Apple Silicon and more powerful C/C++ package management
tags: [xmake, lua, C/C++, toolchains, xrepo, packages, vcpkg, conan, Apple, Silicon]
date: 2021-01-16
author: Ruki
outline: deep
---
### Add add_requireconfs to improve package configuration

Despite the previous version, we can define and configure dependent packages by `add_requires("libpng", {configs = {shared = true}})`.

However, if the user project has a huge project and many dependent packages, and each package requires different compilation configuration parameters, the configuration will still be very cumbersome and has limitations, such as the inability to rewrite the internal sub-dependent package configuration.

Therefore, we have added `add_requireconfs` to configure the configuration of each package and its sub-dependencies more flexibly and conveniently. Below we focus on several usages:

##### Set the configuration of the specified package

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

The above usage, we still don't see any practical use, but if we rely on more we can see the effect, such as the following:

```lua
add_requires("zlib", {configs = {shared = true}})
add_requires("pcre", {configs = {shared = true}})
add_requires("libpng", {configs = {shared = true}})
add_requires("libwebp", {configs = {shared = true}})
add_requires("libcurl", {configs = {shared = false}})
```

Is it very cumbersome, if we use `add_requireconfs` to set the default configuration, it can be greatly simplified to the following configuration:


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

:::NOTE
By default, for the same configuration, xmake will give priority to the configuration in add_requires instead of add_requireconfs.
:::

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

### Graphical configuration supports mouse and scroll operations

We upgraded the tui component library used by xmake: [LTUI](https://github.com/tboox/ltui), added support for the mouse, and scrolling support for some components, we can go to the graphical configuration, More flexible and convenient configuration of compilation options.

<img src="https://tboox.org/static/img/ltui/choicebox_scrollbar.png" width="650px" />

### stdin redirect support

In the previous version, the process execution interface such as os.execv/os.runv provided by xmake only supports stdout/stderr output redirection, but does not support stdin input redirection, so in this version, we also do it Supported.

The usage is as follows:

```lua
os.execv("foo", {"arg1", "arg2"}, {stdin = "/tmp/a"})
```

When we execute the process, we can use the /tmp/a file as the redirected input. Of course, we can also pass `{stdout = "/tmp/out"}` as the redirected output.

### vs project grouping support

We have added a new interface `set_group` to support grouping of each target. This interface is currently only used for vs/vsxmake project generation. The subproject directory tree within the vs project is displayed in groups according to the specified structure, but it may also be Other modules increase grouping support.

For example, for the following grouping configuration:

```lua
add_rules("mode.debug", "mode.release")

target("test1")
    set_kind("binary")
    add_files("src/*.cpp")
    set_group("group1")

target("test2")
    set_kind("binary")
    add_files("src/*.cpp")
    set_group("group1")

target("test3")
    set_kind("binary")
    add_files("src/*.cpp")
    set_group("group1/group2")

target("test4")
    set_kind("binary")
    add_files("src/*.cpp")
    set_group("group3/group4")

target("test5")
    set_kind("binary")
    add_files("src/*.cpp")

target("test6")
    set_kind("binary")
    add_files("src/*.cpp")
```

The effect of the generated VS project directory structure is as follows:

![](/assets/img/manual/set_group.png)

Among them, `set_group("group1/group2")` can set the target to the secondary group.

### Automatically update vs project

If you feel that it is cumbersome to generate and update the VS project through the `xmake project -k vsxmake` command every time, we can now configure the `plugin.vsxmake.autoupdate` rule in xmake.lua to achieve automatic update.

Users can automatically update the VS project if there are changes to the file list or xmake.lua after each execution of the build in the VS project.

```lua
add_rules("plugin.vsxmake.autoupdate")

target("test")
    set_kind("binary")
    add_files("src/*.c")
```

### Improve vs/vsxmake project plugin

In addition to the group support and automatic updates mentioned above, in this version, we also fixed a lot of VS project-related issues, such as: intellisense prompt improvement, path truncation problem repair, full support for remote dependency packages

### Improve windows registry support

xmake improves the internal winos module and adds some interfaces to access the registry more conveniently and obtain the registry configuration on windows.

#### winos.registry_keys

- Get the list of registry builds

Support through pattern matching, traverse to obtain the registry key path list, `*` is single-level path matching, `**` is recursive path matching.

```lua
local keypaths = winos.registry_keys("HKEY_LOCAL_MACHINE\\SOFTWARE\\*\\Windows NT\\*\\CurrentVersion\\AeDebug")
for _, keypath in ipairs(keypaths) do
    print(winos.registry_query(keypath .. ";Debugger"))
end
```

#### winos.registry_values

- Get a list of registry value names

Support to obtain the value name list of the specified key path through pattern matching, and the string after the `;` is the specified key name pattern matching string.

```lua
local valuepaths = winos.registry_values("HKEY_LOCAL_MACHINE\\SOFTWARE\\xx\\AeDebug;Debug*")
for _, valuepath in ipairs(valuepaths) do
    print(winos.registry_query(valuepath))
end
```

#### winos.registry_query

- Get the registry value

Get the value under the specified registry path, if the value name is not specified, then get the default value of the key path

```lua
local value, errors = winos.registry_query("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug")
local value, errors = winos.registry_query("HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\AeDebug;Debugger")
```

### Support for building Zig project

In the last version, xmake has experimentally supported zig, but there were also many pitfalls during the period, especially when building on windows/macos encountered many problems.

Then in the latest zig 0.7.1, most of the problems I encountered have been fixed, and now xmake can already support zig project compilation.

We can quickly create a Zig empty project with the following command:

```bash
$ xmake create -l zig console
```

The content of xmake.lua is as follows:

```lua
add_rules("mode.debug", "mode.release")

target("console")
    set_kind("binary")
    add_files("src/*.zig")
```

As you can see, the configuration method is actually no different from C/C++. Because Zig and C have good binary compatibility, we can also use `add_requires` to add remote dependency support for C/C++ packages to the zig project.

Then execute xmake to complete the compilation.

```bash
$ xmake
```

Then continue to run the run command, you can directly execute the zig program and output the running result.

```bash
$ xmake run
Hello world!
```

We can also easily implement the mixed compilation support of C and Zig, just add the corresponding C code file.

```lua
add_rules("mode.debug", "mode.release")

target("console")
    set_kind("binary")
    add_files("src/*.zig", "src/*.c")
```

For complete code examples, see: [Zig with C](https://github.com/xmake-io/xmake/blob/dev/tests/projects/zig/console_c_call_zig/xmake.lua)

### Luarocks plugin

[luarocks](https://luarocks.org/) is a package management tool of lua, which provides the installation and integration of various lua modules, but it uses a built-in construction mechanism to build lua c modules.

For example, in its rockspec file, the builtin build type is used to describe the construction of common lua c modules:

```lua
build = {
    type = "builtin",
    modules = {
        ["module.hello"] = {
            sources = "src/test.c"
        }
    },
    copy_directories = {}
}
```

This is not a problem for small modules, but if the c code structure of the module is more complicated, its built-in construction rules still have many limitations and are not flexible. In addition, switching msvc / mingw tool chain and parameter configuration etc. Neither is flexible enough.

Therefore, xmake provides [luarocks=build-xmake](https://github.com/xmake-io/luarocks-build-xmake) plugin to use xmake to replace the built-in build system of luarocks. The replacement method is also very simple. You only need to buildin Change the build type to xmake and add the luarocks-build-xmake dependency.

```lua
dependencies = {
    "lua >= 5.1",
    "luarocks-build-xmake"
}
build = {
    type = "xmake",
    modules = {
        ["module.hello"] = {
            sources = "src/test.c"
        }
    },
    copy_directories = {}
}
```

But this is still very cumbersome. It is still necessary to describe the rules based on the source file list in the modules in the rockspec file, and then luarocks-build-xmake will automatically generate xmake.lua according to the configuration to complete the build.

But since xmake is used, your own lua module can be maintained with xmake.lua, so the build configuration is more flexible, so we only need the following.

```lua
dependencies = {
    "lua >= 5.1",
    "luarocks-build-xmake"
}
build = {
    type = "xmake",
    copy_directories = {}
}
```

You only need to set the current switch to xmake compilation, and use the xmake.lua rules file built into the lua module project.

### Support for deploying Qt programs on windows

Thank you very much for the contribution of @SirLynix, xmake can already support the deployment and installation of Qt applications on windows.

We only need to maintain a Qt program normally, for example:

```lua
add_rules("mode.debug", "mode.release")

target("demo")
     add_rules("qt.quickapp")
     add_headerfiles("src/*.h")
     add_files("src/*.cpp")
     add_files("src/qml.qrc")
```

Then, we only need to execute the following compile and install commands, and xmake will automatically call the windeployqt.exe program to install and deploy our Qt application.

```bash
$ xmake
$ xmake install -o d:\installdir
```

Related patches: [#1145](https://github.com/xmake-io/xmake/pull/1145)

In addition, in the previous version, xmake has also supported the deployment and packaging of Qt programs for macOS and android versions. Each time only normal compilation commands are required, the QT .app/.apk installation package can be generated.

```bash
$ xmake f -p android --ndk=/xxx/android-ndk-r20b --sdk=/xxx
$ xmake
```

### Some bug fixes

We have also fixed many problems reported by users. Here we introduce some more important bug fixes, such as:

We fixed the problem of empty double quotes in `add_defines("TEST=\"hello world\"")`, which caused errors in previous compilation.

In addition, we improved the search and support of the vstudio environment, and solved the problem of compilation failure caused by Chinese in the user's home directory and environment variables.


We have also improved the llvm toolchain to solve the problem of the lack of isysroot configuration when using the llvm tool chain under macOS if xcode is not installed, and the occasional failure of the header file dependency compilation under msvc.

## Changelog

### New features

* [#1035](https://github.com/xmake-io/xmake/issues/1035): The graphics configuration menu fully supports mouse events, and support scroll bar
* [#1098](https://github.com/xmake-io/xmake/issues/1098): Support stdin for os.execv
* [#1079](https://github.com/xmake-io/xmake/issues/1079): Add autoupdate plugin rule for vsxmake, `add_rules("plugin.vsxmake.autoupdate")`
* Add `xmake f --vs_runtime=MT` and `set_runtimes("MT")` to set vs runtime for targets and packages
* [#1032](https://github.com/xmake-io/xmake/issues/1032): Support to enum registry keys and values
* [#1026](https://github.com/xmake-io/xmake/issues/1026): Support group for vs/vsxmake project
* [#1178](https://github.com/xmake-io/xmake/issues/1178): Add `add_requireconfs()` api to rewrite configs of depend packages
* [#1043](https://github.com/xmake-io/xmake/issues/1043): Add `luarocks.module` rule for luarocks-build-xmake
* [#1190](https://github.com/xmake-io/xmake/issues/1190): Support for Apple Silicon (macOS ARM)
* [#1145](https://github.com/xmake-io/xmake/pull/1145): Support Qt deploy for Windows, thanks @SirLynix

### Change

* [#1072](https://github.com/xmake-io/xmake/issues/1072): Fix and improve to parse cl deps
* Support utf8 for ui modules and `xmake f --menu`
* Improve to support zig on macOS
* [#1135](https://github.com/xmake-io/xmake/issues/1135): Improve multi-toolchain and multi-platforms for targets
* [#1153](https://github.com/xmake-io/xmake/issues/1153): Improve llvm toolchain to support sysroot on macOS
* [#1071](https://github.com/xmake-io/xmake/issues/1071): Improve to generate vs/vsxmake project to support for remote packages
* Improve vs/vsxmake project plugin to support global `set_arch()` setting
* [#1164](https://github.com/xmake-io/xmake/issues/1164): Improve to launch console programs for vsxmake project
* [#1179](https://github.com/xmake-io/xmake/issues/1179): Improve llvm toolchain and add isysroot

### Bugs fixed

* [#1091](https://github.com/xmake-io/xmake/issues/1091): Fix incorrect ordering of inherited library dependencies
* [#1105](https://github.com/xmake-io/xmake/issues/1105): Fix c++ language intellisense for vsxmake
* [#1132](https://github.com/xmake-io/xmake/issues/1132): Fix TrimEnd bug for vsxmake
* [#1142](https://github.com/xmake-io/xmake/issues/1142): Fix git not found when installing packages
* Fix macos.version bug for macOS Big Sur
* [#1084](https://github.com/xmake-io/xmake/issues/1084): Fix `add_defines()` bug (contain spaces)
* [#1195](https://github.com/xmake-io/xmake/pull/1195): Fix unicode problem for vs and improve find_vstudio/os.exec
