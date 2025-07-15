---
title: Xmake v2.7.2 released, build third-party libraries more intelligently
tags: [xmake, lua, C/C++, trybuild, rule, cmake, autoconf]
date: 2022-10-09
author: Ruki
---

## Introduction of new features

### Building third party libraries more intelligently

In previous versions, Xmake provided a TryBuild mode that allowed you to use Xmake to try to build third-party projects maintained by autoconf/cmake/meson etc. directly without xmake.lua.

In effect, this means that Xmake detects the corresponding build system and invokes commands such as cmake to do so, but it will help the user to simplify the configuration operation, plus it will interface with xmake's cross-compilation toolchain configuration.

However, this mode has a certain failure rate, which can lead to build failure if, for example

1. the project code itself is flawed, resulting in a compilation error
2. the project code does not support the current platform
3. the build script is flawed
4. specific configuration parameters are missing
5. a missing dependency library that needs to be installed by the user
6. the compiler version is too low and does not support some of the code

The TryBuild mode usually handles these cases, but in this new version we have introduced a new mechanism to the TryBuild mode to improve the build logic by reusing build scripts from the [xmake-repo](https://github.com/xmake-io/xmake-repo) repository.

It roughly handles the process in the following way.

1. execute the xmake command in the third-party source repository directory
2. xmake gets the directory name and tries to resolve the project name and version
3. try to match an existing package from the xmake-repo repository
4. If the match is successful, build directly using the build logic in the package
5. if no match is made, fall back to the original TryBuild logic

What is the benefit of this, if the match is successful, we can solve all the problems mentioned above.

Even if the current project source code does not support a given platform, or if the source code and build script are flawed in some way, Xmake will automatically patch in a specific patch to fix it and bring in the required dependencies to ensure that it will definitely compile in one click.

Let's take a look at the libjpeg library as an example.

#### The first step is to download the corresponding source code package

```bash
$ wget https://jaist.dl.sourceforge.net/project/libjpeg-turbo/2.1.4/libjpeg-turbo-2.1.4.tar.gz
$ tar -xvf libjpeg-turbo-2.1.4.tar.gz
$ cd libjpeg-turbo-2.1.4
```

#### Enter the directory and execute the Xmake command

Xmake will prompt the user if it detects that it is the libjpeg library, and whether to build it as libjpeg 2.1.4.

```bash
ruki-2:libjpeg-turbo-2.1.4 ruki$ xmake
note: libjpeg-turbo 2.1.4 in xmake-repo found, try building it or you can run ``xmake f --trybuild=` to set buildsystem (pass -y or --confirm=y/n/d to skip confirm)?
please input: y (y/n)
```

We hit enter to confirm to continue the build.







```bash
checking for cmake ... /usr/local/bin/cmake
/usr/local/bin/cmake -DCMAKE_BUILD_TYPE=Release -DENABLE_SHARED=OFF -DENABLE_STATIC=ON -DCMAKE_POSITION_INDEPENDENT_CODE=ON -DCMAKE_ INSTALL_LIBDIR:PATH=lib -DCMAKE_INSTALL_PREFIX=/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2 -G "Unix Makefiles" -DCMAKE_POSITION_INDEPENDENT_CODE=ON /Users/ruki/Downloads/libjpeg-turbo-2.1.4
-- CMAKE_BUILD_TYPE = Release
-- VERSION = 2.1.4, BUILD = 20220923
-- 64-bit build (x86_64)
-- CMAKE_INSTALL_PREFIX = /Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2
-- CMAKE_INSTALL_BINDIR = bin (/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2/bin)
-- CMAKE_INSTALL_DATAROOTDIR = share (/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2/share)
-- CMAKE_INSTALL_DOCDIR = share/doc/libjpeg-turbo (/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2/ share/doc/libjpeg-turbo)
-- CMAKE_INSTALL_INCLUDEDIR = include (/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2/include)
-- CMAKE_INSTALL_LIBDIR = lib (/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2/lib)
-- CMAKE_INSTALL_MANDIR = share/man (/Users/ruki/.xmake/packages/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2/share/man)
-- Shared libraries disabled (ENABLE_SHARED = 0)
-- Static libraries enabled (ENABLE_STATIC = 1)
-- 12-bit JPEG support disabled (WITH_12BIT = 0)
-- Arithmetic decoding support enabled (WITH_ARITH_DEC = 1)
-- Arithmetic encoding support enabled (WITH_ARITH_ENC = 1)
-- TurboJPEG API library enabled (WITH_TURBOJPEG = 1)
-- TurboJPEG Java wrapper disabled (WITH_JAVA = 0)
-- In-memory source/destination managers enabled (WITH_MEM_SRCDST = 1)
-- Emulating libjpeg API/ABI v6.2 (WITH_JPEG7 = 0, WITH_JPEG8 = 0)
-- libjpeg API shared library version = 62.3.0
-- Compiler flags = -O3 -DNDEBUG
-- Linker flags =
-- INLINE = __inline__ __attribute__((always_inline)) (FORCE_INLINE = 1)
-- THREAD_LOCAL = __thread
-- CMAKE_EXECUTABLE_SUFFIX =
-- CMAKE_ASM_NASM_COMPILER = /usr/local/bin/nasm
-- CMAKE_ASM_NASM_OBJECT_FORMAT = macho64
-- CMAKE_ASM_NASM_FLAGS = -DMACHO -D__x86_64__ -DPIC
-- SIMD extensions: x86_64 (WITH_SIMD = 1)
-- FLOATTEST = sse
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/ruki/Downloads/libjpeg-turbo-2.1.4/build_646b7957
make -j10
[ 2%] Built target md5cmp
[ 19%] Built target wrjpgcom
[ 20%] Built target simd
[ 21%] Built target strtest
[ 22%] Built target rdjpgcom
[ 80%] Built target jpeg-static
[ 84%] Built target turbojpeg-static
[ 90%] Built target tjbench-static
[ 90%] Built target tjunittest-static
[ 91%] Built target jpegtran-static
[ 98%] Built target djpeg-static
[ 100%] Built target cjpeg-static
make install
[ 1%] Built target strtest
[ 3%] Built target wrjpgcom
[ 19%] Built target simd
[ 52%] Built target turbojpeg-static
[ 53%] Built target rdjpgcom
[ 82%] Built target jpeg-static
[ 85%] Built target jpegtran-static
[ 90%] Built target djpeg-static
[ 93%] Built target tjunittest-static
[ 97%] Built target cjpeg-static
[ 98%] Built target tjbench-static
[100%] Built target md5cmp
Install the project...
exporting libjpeg-turbo-2.1.4
  -> /Users/ruki/Downloads/libjpeg-turbo-2.1.4/build/artifacts/l/libjpeg-turbo/2.1.4/646b795702e34be89c5745333d052aa2
output to /Users/ruki/Downloads/libjpeg-turbo-2.1.4/build/artifacts
build ok!
```

As long as the match is detected, the build will usually complete with a near 100% success rate, and Xmake will output the build product to the current directory under `build/artifacts`.

#### Interfacing with cross-compilation toolchains

This smart build mode allows us to not only build native applications, but also to interface with the cross-compilation toolchain to support ios/android and any cross-compilation platform.

For example, to build on Android, we simply pass the `--trybuild=xrepo` argument and switch to Android, and Xmake will pass all the ndk toolchain information.

``bash
$ xmake f -p android --trybuild=xrepo --ndk=~/files/android-ndk-r20b -c
$ xmake
xmake f -c --require=n -v -p android -a armeabi-v7a -m release -k static --ndk=/Users/ruki/files/android-ndk-r20b
checking for Android SDK directory ... ~/Library/Android/sdk
checking for Build Tools Version of Android SDK ... 33.0.0
checking for NDK directory ... /Users/ruki/files/android-ndk-r20b
checking for SDK version of NDK ... ... 21
checking for clang++ ... /Users/ruki/files/android-ndk-r20b/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang++
checking for the shared library linker (sh) ... clang++
checking for clang++ ... /Users/ruki/files/android-ndk-r20b/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang++
checking for the linker (ld) ... clang++
...
exporting libjpeg-turbo-2.1.4
  -> /Users/ruki/Downloads/libjpeg-turbo-2.1.4/build/artifacts/l/libjpeg-turbo/2.1.4/79c2e21f436b4ab08a3c23a6cbae8c0e
output to /Users/ruki/Downloads/libjpeg-turbo-2.1.4/build/artifacts
build ok!
```

#### fallback to direct compilation

If we don't want to use the xmake-repo build scripts, we can fall back to cmake/autoconf and try to build them directly.

However, this may have a certain failure rate and may compile additional binary targets that are not needed. The build script in xmake-repo is optimised to streamline a lot of unnecessary build parameters, such as disabling the tests/examples build.

We just need to hit n to cancel the smart build mode based on package scripts, and Xmake will give a new prompt to let the user choose whether to continue with the cmake/autoconf build attempt.

```bash
$ xmake
note: libjpeg-turbo 2.1.4 in xmake-repo found, try building it or you can run ``xmake f --trybuild=` to set buildsystem (pass -y or --confirm=y/n/d to skip confirm)?
please input: y (y/n)
n
note: CMakeLists.txt found, try building it or you can run `xmake f --trybuild=` to set buildsystem (pass -y or --confirm=y/n/d to skip confirm)?
please input: y (y/n)
```

### Support for Windows Arm64

We have also improved our Windows build support with the addition of Windows Arm64 platform support, simply by switching to the arm64 architecture.

```bash
$ xmake f -a arm64
$ xmake
```

### Improved rule support for sequential execution of dependencies

Associated dependencies can be bound to a batch of rules, i.e. instead of having to add rules to target one by one using `add_rules()`, just apply a rule that will take effect for it and all its dependencies.

For example

```lua
rule("foo")
    add_deps("bar")

rule("bar")
   ...
```

We only need `add_rules("foo")` to apply both foo and bar rules.

However, by default there is no order of execution between dependencies, and scripts such as `on_build_file` for foo and bar are executed in parallel, in an undefined order.

To tightly control the order of execution, in newer versions we can configure `add_deps("bar", {order = true})` to tell xmake that we need to execute scripts at the same level according to the order of dependencies.

Example.

```lua
rule("foo")
    add_deps("bar", {order = true})
    on_build_file(function (target, sourcefile)
    end)

rule("bar")
    on_build_file(function (target, sourcefile)
    end)
```

bar's `on_build_file` will be executed first.

### Better dynamic configuration of targets and rules

The above way of controlling rule dependencies only works if both foo and bar rules are custom rules, which doesn't work if you want to insert your own rules to be executed before xmake's built-in rules.

In this case, we need to use a more flexible dynamic rule creation and injection approach to modify the built-in rules.

For example, if we want to execute the `on_build_file` script for a custom cppfront rule before the built-in `c++.build` rule, we can do this in the following way.

```lua
rule("cppfront")
    set_extensions(".cpp2")
    on_load(function (target)
        local rule = target:rule("c++.build"):clone()
        rule:add("deps", "cppfront", {order = true})
        target:rule_add(rule)
    end)
    on_build_file(function (target, sourcefile, opt)
        print("build cppfront file")
    end)

target("test")
    set_kind("binary")
    add_rules("cppfront")
    add_files("src/*.cpp")
    add_files("src/*.cpp2")
```

### Support for introducing custom rules from packages

Now, we can also add custom build rule scripts to the package management repository to enable dynamic distribution and installation following the package.

We need to put the custom rules into the `packages/x/xxx/rules` directory of the repository and it will follow the package as it is installed.

It does, of course, have some limitations.

- In package rules, we cannot add `on_load`, `after_load` scripts, but we can usually use `on_config` instead.

#### Adding package rules

We need to add the rules script to the rules fixed directory, for example: packages/z/zlib/rules/foo.lua

```lua
rule("foo")
    on_config(function (target)
        print("foo: on_config %s", target:name())
    end)
```

#### Applying package rules

The rules are used in a similar way as before, the only difference being that we need to specify which package's rules to access by prefixing them with `@packagename/`.

The exact format: ``add_rules("@packagename/rulename")`, for example: ``add_rules("@zlib/foo")`.

``lua
add_requires("zlib", {system = false})
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("zlib")
    add_rules("@zlib/foo")
```

#### Referencing rules by package alias

If a package alias exists, xmake will give preference to the package alias to get the rules.

``` lua
add_requires("zlib", {alias = "zlib2", system = false})
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("zlib2")
    add_rules("@zlib2/foo")
```

#### Adding package rule dependencies

We can use `add_deps("@bar")` to add additional rules relative to the current package directory.

However, we cannot add rule dependencies from other packages, they are completely isolated and we can only refer to rules from other packages imported by `add_requires` in the user project.

packages/z/zlib/rules/foo.lua

```lua
rule("foo")
    add_deps("@bar")
    on_config(function (target)
        print("foo: on_config %s", target:name())
    end)
```

packages/z/zlib/rules/bar.lua

```lua
rule("bar")
    on_config(function (target)
        print("bar: on_config %s", target:name())
    end)
```

### Stricter package dependency compatibility support

Two new package related policies have been added to enable stricter package dependency compatibility control.

This is to address the fact that some packages may have abi incompatibilities or break other packages that depend on them every time they are updated, and by default Xmake will not recompile and install them unless their versions and configurations are also updated.

There is a chance that the compilation compatibility will be broken and the link will fail.

#### package.librarydeps.strict_compatibility

is disabled by default, if enabled then strict compatibility is maintained between the current package and all its library dependencies, and any version update of a dependent package will force a recompile install of the current package.

This ensures that all packages are binary compatible and that no linking and runtime errors occur when linking with other installed packages due to changes to the interface of a dependent package.

```lua
package("foo")
    add_deps("bar", "zoo")
    set_policy("package.librarydeps.strict_compatibility", true)
```

For example, if there is an updated version of bar or zoo, then foo will also be recompiled and installed.

#### package.strict_compatibility

is disabled by default, if it is enabled then strict compatibility is maintained between the current package and all other packages that depend on it, and any version update of this package will force a recompile and install of the other parent packages.

This ensures that all packages are binary compatible and that no linking and runtime errors occur when linking with other installed packages due to changes in the interface of a dependent package.

```lua
package("foo")
    set_policy("package.strict_compatibility", true)

package("bar")
    add_deps("foo")

package("zoo")
    add_deps("foo")
```

For example, if there is an updated version of foo, then both bar and zoo will be forced to recompile and install.

#### package.install_always

This is useful for local integration of third-party source packages,
as the package will always be reinstalled each time `xmake f -c` is run to reconfigure it.

As the user may at any time need to modify the third party source code and recompile it for integration.

Previously it was only possible to trigger a recompile by changing the package version number each time,
but with this strategy it is possible to trigger a recompile each time.

```lua
add_rules("mode.debug", "mode.release")

package("foo")
    add_deps("cmake")
    set_sourcedir(path.join(os.scriptdir(), "foo"))
    set_policy("package.install_always", true)
    on_install(function (package)
        local configs = {}
        table.insert(configs, "-DCMAKE_BUILD_TYPE=" . (package:debug() and "Debug" or "Release"))
        table.insert(configs, "-DBUILD_SHARED_LIBS=" ... (package:config("shared") and "ON" or "OFF"))
        import("package.tools.cmake").install(package, configs)
    end)
    on_test(function (package)
        assert(package:has_cfuncs("add", {includes = "foo.h"}))
    end)
package_end()

add_requires("foo")

target("demo")
    set_kind("binary")
    add_files("src/main.c")
    add_packages("foo")
```

### Adding the clang-cl toolchain

Although we did support switching to the clang-cl compiler in previous versions, the switch was cumbersome and had to be set up one by one.

```bash
$ xmake f --cxx=clang-cl --cc=clang-cl -c
$ xmake
```

And you have to add the directory where clang-cl.exe is located to %PATH% to make it work.

Now that vs comes with the clang-cl toolchain, Xmake is fully capable of detecting it and using it automatically.

So, in this new version, we have added the clang-cl toolchain, and all it takes is `xmake f --toolchain=clang-cl` to quickly switch to the clang-cl toolchain without any PATH settings.

## Changelog

### New features

* [#2140](https://github.com/xmake-io/xmake/issues/2140): Support Windows Arm64
* [#2719](https://github.com/xmake-io/xmake/issues/2719): Add `package.librarydeps.strict_compatibility` to strict compatibility for package linkdeps
* [#2810](https://github.com/xmake-io/xmake/pull/2810): Support os.execv to run shell script file
* [#2817](https://github.com/xmake-io/xmake/pull/2817): Improve rule to support dependence order
* [#2824](https://github.com/xmake-io/xmake/pull/2824): Pass cross-file to meson.install and trybuild
* [#2856](https://github.com/xmake-io/xmake/pull/2856): Improve to debug package using the debug source directory
* [#2859](https://github.com/xmake-io/xmake/issues/2859): Improve trybuild to build 3rd source library using xmake-repo scripts
* [#2879](https://github.com/xmake-io/xmake/issues/2879): Support for dynamic creation and injection of rules and targets in script scope
* [#2374](https://github.com/xmake-io/xmake/issues/2374): Allow xmake package to embed rules and scripts
* Add clang-cl toolchain

### Changes

* [#2745](https://github.com/xmake-io/xmake/pull/2745): Improve os.cp to support symlink
* [#2773](https://github.com/xmake-io/xmake/pull/2773): Improve vcpkg packages to support freebsd
* [#2778](https://github.com/xmake-io/xmake/pull/2778): Improve Improve xrepo.env for target
* [#2783](https://github.com/xmake-io/xmake/issues/2783): Add digest algorithm option for wdk signtool
* [#2787](https://github.com/xmake-io/xmake/pull/2787): Improve json to support empty array
* [#2782](https://github.com/xmake-io/xmake/pull/2782): Improve to find matlab and runtime
* [#2793](https://github.com/xmake-io/xmake/issues/2793): Improve mconfdialog
* [#2804](https://github.com/xmake-io/xmake/issues/2804): Support macOS arm64/x86_64 cross-compilation for installing packages
* [#2809](https://github.com/xmake-io/xmake/issues/2809): Improve cl optimization option
* Improve trybuild for meson/cmake/autoconf
* [#2846](https://github.com/xmake-io/xmake/discussions/2846): Improve to generate config files
* [#2866](https://github.com/xmake-io/xmake/issues/2866): Better control over the order of execution of rules

### Bugs fixed

* [#2740](https://github.com/xmake-io/xmake/issues/2740): Fix build c++ modules stuck and slower for msvc
* [#2875](https://github.com/xmake-io/xmake/issues/2875): Fix build linux driver error
* [#2885](https://github.com/xmake-io/xmake/issues/2885): Fix pch not found with msvc/ccache
