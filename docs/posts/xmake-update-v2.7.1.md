---
title: Xmake v2.7.1 Released, Better C++ Modules Support
tags: [xmake, lua, C/C++, remote, ccache, C++20, Modules, headerunits, fs-watcher]
date: 2022-08-25
author: Ruki
---

[Xmake](https://github.com/xmake-io/xmake) is a lightweight cross-platform build utility based on Lua.

It is very lightweight and has no dependencies because it has a built-in Lua runtime.

It uses xmake.lua to maintain project builds and its configuration syntax is very simple and readable.

We can use it to build project directly like Make/Ninja, or generate project files like CMake/Meson, and it also has a built-in package management system to help users solve the integrated use of C/C++ dependent libraries.

```
Xmake = Build backend + Project Generator + Package Manager + [Remote|Distributed] Build + Cache
```

Although not very precise, we can still understand Xmake in the following way:

```
Xmake ~= Make/Ninja + CMake/Meson + Vcpkg/Conan + distcc + ccache/sccache
```

* [Github](https://github.com/xmake-io/xmake)
* [Document](https://xmake.io/)

## Introduction of new features

In this release, we have refactored and improved the C++20 Modules implementation, improved the dependency graph parsing of module files, added support for STL and User HeaderUnits, and made the CMakelists/compile_commands generator support C++ Modules.

In addition, we've added an `xmake watch` plugin that can monitor current project file updates in real time, automatically trigger incremental builds, or run some custom commands.

<img src="/assets/img/posts/xmake/xmake-watch.gif">




### C++ Modules Improvements

Xmake has long supported C++ Modules build support, and can automatically analyze dependencies between modules to maximize parallel compilation.
In addition, Xmake uses `.mpp` as the default module extension, but also supports `.ixxx`, `.cppm`, `.mxx` and so on.

For example

```lua
set_languages("c++20")
target("class")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

For more examples see: [C++ Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules)

However, the previous implementation has many shortcomings.

1. no support for HeaderUnits, so you can't use modules like stl
2. the module dependency graph parsing is done by scanning the source code itself, and does not support the dependency scanning provided by the compiler, so it is not fully reliable
3. do not support CMakelists generation
4. compile_commands.json generation is not supported

In the new version, we have refactored and upgraded the implementation of C++20 module, and we support all the points mentioned above, and added support for Headerunits, so we can introduce STL and user header modules in the module.

Also, since higher versions of msvc and gcc have built-in scan analysis of module dependency graphs, Xmake prioritizes module dependency graph analysis with the compiler, and if the compiler does not support it (clang), then Xmake will degrade to its own source code scan implementation.

A related patch is available at [#2641](https://github.com/xmake-io/xmake/pull/2641), with many thanks to [@Arthapz](https://github.com/Arthapz) for their contribution.

Here is an example of a module that uses STL HeaderUnits, e.g.

```bash
stl_headerunit$ xmake
[ 0%]: generating.cxx.module.deps src/main.cpp
[ 0%]: generating.cxx.module.deps src/hello.mpp
[ 20%]: generating.cxx.headerunit.bmi iostream
[ 60%]: generating.cxx.module.bmi hello
[ 70%]: cache compiling.release src/main.cpp
[ 80%]: linking.release stl_headerunit
[100%]: build ok!
```

For the first compilation, we scan the module code for dependencies and then precompile stl libraries like iostream as headerunit.

Any subsequent recompilation will directly reuse them for compilation acceleration.

Note: Usually we need to add at least one `.mpp` file to enable C++20 modules compilation, if there is only a cpp file, module compilation will not be enabled by default.

However, if we just want to use the module's Headerunits feature in the cpp file, for example, by introducing some STL Headerunits in the cpp, then we can also set the `.mpp` to `.mpp`.
then we can also force C++ Modules compilation by setting `set_policy("build.c++.modules", true)`, e.g.

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    set_languages("c++20")
    set_policy("build.c++.modules", true)
```


### Project file monitoring and auto-build

In this release, we have added the `xmake watch` plugin command to automatically monitor project files for updates and then trigger automatic builds or run some custom commands.

This is often used for personal development to enable fast real-time incremental builds without the need to manually execute the build command each time, improving development efficiency.

#### Auto-build after project update

The default behavior is to monitor the entire project root, and any file changes will trigger an incremental build of the project.

```bash
$ xmake watch
watching /private/tmp/test/src/** .
watching /private/tmp/test/* ...
/private/tmp/test/src/main.cpp modified
[ 25%]: ccache compiling.release src/main.cpp
[ 50%]: linking.release test
[ 100%]: build ok!
```

#### Monitoring a specific directory

We can also monitor specific code directories to narrow down the scope of monitoring and improve performance.

```bash
$ xmake watch -d src
$ xmake watch -d "src;tests/*"
```

The above command will recursively watch all subdirectories. If you want to only watch the files in the current directory without recursive monitoring, you can use the following command.

```bash
$ xmake watch -p src
$ xmake watch -p "src;tests/*"
```

#### Watch and run the specified command

If you want to run the build automatically even after the automatic build, we can use a custom command set.

```bash
$ xmake watch -c "xmake; xmake run"
```

The above command list is passed as a string, which is not flexible enough for complex command arguments that require escaping to be more cumbersome, so we can use the following for arbitrary commands.

```bash
$ xmake watch -- echo hello xmake!
$ xmake watch -- xmake run --help
```

#### Watching and running the target program

Although we can automate the running of the target program with custom commands, we also provide more convenient arguments to achieve this behavior.

```bash
$ xmake watch -r
$ xmake watch --run
[100%]: build ok!
hello world!
```

<img src="/assets/img/posts/xmake/xmake-watch.gif">

#### Watching and running lua scripts

We can also watch for file updates and run the specified lua script for more flexible and complex command customization.

```bash
$ xmake watch -s /tmp/test.lua
```

We can also get a list of all updated file paths and events in the script again.

```lua
function main(events)
    -- TODO handle events
end
```

### Mac Catalyst Support

MAc Catalyst is Apple's new solution for bringing iPad apps to the Mac. Mac apps built with Mac Catalyst share code with your iPad apps, and you can add more features to your Mac separately.

With this new version, we've added support for building Mac Catalyst targets, and on macOS platforms, we just need to add the `-appledev=catalyst` configuration option to support compiling existing iOS code and getting it up and running on macOS without making any changes.

```bash
$ xmake f --appledev=catalyst
$ xmake
```

We can experience the Mac in the test project [iosapp_with_framework](https://github.com/xmake-io/xmake/tree/master/tests/projects/objc/iosapp_with_framework) Catalyst program compile and run.

```bash
$ xmake
[ 36%]: processing.xcode.release src/framework/Info.plist
[ 40%]: cache compiling.release src/framework/test.m
[ 44%]: linking.release test
[ 48%]: generating.xcode.release test.framework
[ 56%]: compiling.xcode.release src/app/Assets.xcassets
[ 56%]: processing.xcode.release src/app/Info.plist
[ 60%]: cache compiling.release src/app/ViewController.m
[ 60%]: cache compiling.release src/app/SceneDelegate.m
[ 60%]: cache compiling.release src/app/main.m
[ 60%]: cache compiling.release src/app/AppDelegate.m
[ 60%]: compiling.xcode.release src/app/Base.lproj/LaunchScreen.storyboard
[ 60%]: compiling.xcode.release src/app/Base.lproj/Main.storyboard
[ 88%]: linking.release demo
[ 92%]: generating.xcode.release demo.app
[100%]: build ok!
$ xmake run
2022-08-26 15:11:03.581 demo[86248:9087199] add(1, 2): 3
2022-08-26 15:11:03.581 demo[86248:9087199] hello xmake!
```

<img src="/assets/img/posts/xmake/mac-catalyst.png">

### Improving remote builds

#### Pulling remote build files

For remote builds, we have added a new pull remote file command, which can usually be used to download remote target build files, library files locally after the remote build is complete.

```bash
$ xmake service --pull 'build/**' outputdir
```

We can match the files to be downloaded with the `-pull 'build/**'` pattern, either build files or other files.

Note: Files are segregated by project, only files under the current project can be specified for download, and will not let users download files from other directories on the server to avoid some security risks.

#### Real-time echo output

In the previous version, when using remote compilation, the client could not output the compilation information of the server in real time, because the cache existed, the compilation progress information seen locally was refreshed piece by piece, which was not a good experience.

Therefore, we added line buffer refresh support to improve the real-time output display and make the user experience closer to the local compilation when compiling remotely.

### Improve distributed compile scheduling algorithm

We have also further improved the server node scheduling for xmake's distributed compilation by adding weight to cpu load and memory resources, rather than just assigning tasks by the number of cpu cores.

Thus, if some nodes are overloaded, we will prioritize the compilation tasks to the nodes that are quite free and take advantage of all compilation resources.

### More flexible cmake package lookup

#### Specify links

For cmake packages, we have added the ``link_libraries`` configuration option to allow users to customize the configuration of package dependencies and even support for target links when searching for packages to use with cmake.

```lua
add_requires("cmake::xxx", {configs = {link_libraries = {"abc::lib1", "abc::lib2"}}})
```

xmake automatically appends the following configuration when looking for cmake packages, improving the extraction of links libraries.

```cmake
target_link_libraries(test PRIVATE ABC::lib1 ABC::lib2)
```

#### Specify the search mode

In addition, we add the following search mode configuration.

```lua
add_requires("cmake::xxx", {configs = {search_mode = "config"}})
add_requires("cmake::xxx", {configs = {search_mode = "module"}})
add_requires("cmake::xxx") -- both
```

Specify config search mode, for example, to tell cmake to look for packages from `XXXConfig.cmake`.

xmake will automatically append the following configuration internally when it looks for cmake packages.

```cmake
find_package(ABC CONFIG REQUIRED)
```

### armcc/armclang/rc incremental compilation support

In the new version, we also perform header dependency analysis for keil's armcc/armclang compiler to support incremental compilation.

In addition, msvc's rc.exe resource compiler itself cannot provide header dependency analysis, but cl.exe's preprocessor can handle resource files.
Therefore, we can use `cl.exe /E test.rc` to preprocess resource files and extract dependency information from them to achieve incremental compilation support for resource files.

So far, it works pretty well, and we also have support for internal ICON/BITMAP resource reference dependencies.

### Other issue fixes

We've also made a number of fixes to the build cache, which will be more stable than the previous version. We have also streamlined the generation of CMakelists.

More detailed improvements can be found in the following changelog.

## Changelog

### New features

* [#2555](https://github.com/xmake-io/xmake/issues/2555): Add fwatcher module and `xmake watch` plugin command
* Add `xmake service --pull 'build/**' outputdir` to pull the given files in remote server
* [#2641](https://github.com/xmake-io/xmake/pull/2641): Improve C++20 modules, support headerunits and project generators
* [#2679](https://github.com/xmake-io/xmake/issues/2679): Support Mac Catalyst

### Changes

* [#2576](https://github.com/xmake-io/xmake/issues/2576): More flexible package fetching from cmake
* [#2577](https://github.com/xmake-io/xmake/issues/2577): Improve add_headerfiles(), add `{install = false}` support
* [#2603](https://github.com/xmake-io/xmake/issues/2603): Disable `-fdirectives-only` for ccache by default
* [#2580](https://github.com/xmake-io/xmake/issues/2580): Set stdout to line buffering
* [#2571](https://github.com/xmake-io/xmake/issues/2571): Improve task scheduling for parallel and distributed compilation based on memory/cpu usage
* [#2410](https://github.com/xmake-io/xmake/issues/2410): Improve cmakelists generator
* [#2690](https://github.com/xmake-io/xmake/issues/2690): Improve to pass toolchains to packages
* [#2686](https://github.com/xmake-io/xmake/issues/2686): Support for incremental compilation and parse header file deps for keil/armcc/armclang
* [#2562](https://github.com/xmake-io/xmake/issues/2562): Improve include deps for rc.exe
* Improve the default parallel building jobs number

### Bugs fixed

* [#2614](https://github.com/xmake-io/xmake/issues/2614): Fix building submodules2 tests for msvc
* [#2620](https://github.com/xmake-io/xmake/issues/2620): Fix build cache for incremental compilation
* [#2177](https://github.com/xmake-io/xmake/issues/2177): Fix python.library segmentation fault for macosx
* [#2708](https://github.com/xmake-io/xmake/issues/2708): Fix link error for mode.coverage rule
* Fix rpath for macos/iphoneos frameworks and application