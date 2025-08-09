# Configure Targets {#configure-targets}

After creating an empty project, we will get the following basic configuration file.

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
```

Among them, `mode.release` is the default compilation mode rule, which will automatically add some common optimization compilation options for the target build, such as: `-O2`, and so on.

We can also switch to `mode.debug` debugging mode through `xmake f -m debug`, which will automatically configure some debugging options, such as: `-g`, and so on.

Of course, we can also configure them completely by ourselves without using the mode rules.

```lua [xmake.lua]
target("test")
set_kind("binary")
add_files("src/*.cpp")
```

## Configure macro definition {#configure-defines}

We can add a macro definition option to the target program through [add_defines](/api/description/project-target#add-defines), for example:

```lua [xmake.lua]
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_defines("DEBUG")
```

In the test target scope, we configure a macro definition compilation option `-DDEBUG` for it, which will only take effect on the test target.

We can also use the `xmake -v` command to quickly verify whether the added configuration is effective.

```sh
[ 23%]: cache compiling.release src/main.cpp
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/clang -c -Q
unused-arguments -target x86_64-apple-macos15.2 -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX15.2.sdk -fvisibility=hidden -fvisibility-inline
s-hidden -O3 -DNDEBUG -o build/.objs/test/macosx/x86_64/release/src/main.cpp.o src/main.cpp
```

As you can see, `-DDEBUG` has been added to the clang compilation command.

## Configure multiple targets at the same time {#configure-multi-targets}

If you want multiple compilation targets to take effect at the same time, we can move them to the global root scope.

```lua [xmake.lua]
add_defines("DEBUG")

target("foo")
    set_kind("binary")
    add_files("src/*.cpp")

target("bar")
    set_kind("binary")
    add_files("src/*.cpp")
```

At this time, both foo and bar target programs will have the `-DDEBUG` compilation option.

The configuration of the root scope will affect the current xmake.lua configuration file and the target programs in all sub-xmake.lua files (that is, the sub-directory configuration introduced by includes).

```lua [xmake.lua]
add_defines("DEBUG")

target("foo")
    set_kind("binary")
    add_files("src/*.cpp")

includes("bar")
```

```lua [bar/xmake.lua]
target("bar")
    set_kind("binary")
    add_files("src/*.cpp")
```

If the bar target is in the `bar/xmake.lua` sub-configuration file, it will also be effective.

::: tip NOTE
However, the root scope configuration in the sub-file cannot affect the target in the same level or parent configuration file.
:::

```lua [xmake.lua]
target("foo")
    set_kind("binary")
    add_files("src/*.cpp")

includes("bar")
```

```lua [bar/xmake.lua]
add_defines("DEBUG")

target("bar")
    set_kind("binary")
    add_files("src/*.cpp")

target("zoo")
    set_kind("binary")
    add_files("src/*.cpp")
```

Here, although `add_defines` is configured in the root scope, it only affects the bar and zoo targets, and cannot affect the foo target.

In other words, the scope of influence of the root scope is in a tree structure, and it takes effect layer by layer.

## Configure optimization options {#configure-optimization}

`mode.release` will automatically introduce some optimization options, and we can also configure them ourselves through the [set_optimize](/api/description/project-target#set-optimize) interface.

For example:

```lua
set_optimize("faster")
```

It will configure the `-O2` compilation option for the target.

::: tip NOTE
Different compilers have different optimization options, and xmake will automatically map to the most appropriate compilation option.

:::

For more details, please refer to the document: [set_optimize](/api/description/project-target#set-optimize).

## Configure header file search directory {#configure-includedirs}

```lua
add_includedirs("/tmp")
```

It will add the `-I/tmp` compilation option to the compiler's command line.

For more details, please refer to the document: [add_includedirs](/api/description/project-target#add-includedirs).

## Configure link library search directory {#configure-linkdirs}

```lua
add_linkdirs("/tmp")
```

It will add the `-L/tmp` link option to the linker command line.

For more details, please refer to the document: [add_linkdirs](/api/description/project-target#add-linkdirs).

## Configure link library {#configure-links}

```lua
add_links("foo")
```

It will add the `-lfoo` link option to the linker command line, which usually needs to be used with [add_linkdirs](/api/description/project-target#add-linkdirs).

```lua
add_links("foo")
add_linkdirs("/tmp")
```

For more details, please refer to the document: [add_links](/api/description/project-target#add-links).

## Configure system link library {#configure-syslinks}

`add_links` is usually used to link user-generated libraries, while `add_syslinks` can add system libraries without the need for an additional `add_linkdirs`.

And its link order is relatively late (after user libraries).

```lua
add_links("foo")
add_syslinks("pthread", "dl")
```

If links and syslinks are configured at the same time, the link order is as follows:

```sh
-lfoo -lpthread -ldl
```

## Configure original compilation options {#configure-flags}

The `add_defines` and other interfaces mentioned above are all abstract APIs. Since most compilers support them, Xmake abstracts them to make them more convenient for users to use and provide better cross-platform and cross-compiler support.

However, we can also add specific compilation options for C++ code through the `add_cxxflags` interface, such as:

```lua
add_cxflags("-DDEBUG")
```

It is equivalent to `add_defines("DEBUG")`, but `add_defines` is more general and applicable to all compilers, while `add_cxxflags("-DDEBUG")` may only be applicable to a few compilers, because not all compilers define macros through `-D`.

In addition, we can also add compilation options for C code through the `add_cflags` interface, and `add_cxflags` to add compilation options for C/C++ code at the same time.

For more details, please refer to the documentation:

- [add_cflags](/api/description/project-target#add-cflags)
- [add_cxflags](/api/description/project-target#add-cxflags)
- [add_cxxflags](/api/description/project-target#add-cxxflags)

## Target Type Configuration {#configure-target-types}

### Setting Target Types

You can set different target types through `set_kind()`:

```lua
target("app")
    set_kind("binary")      -- executable program
    add_files("src/*.cpp")

target("lib")
    set_kind("static")      -- static library
    add_files("src/*.cpp")

target("dll")
    set_kind("shared")      -- dynamic library
    add_files("src/*.cpp")

target("obj")
    set_kind("object")      -- object file collection
    add_files("src/*.cpp")

target("header")
    set_kind("headeronly")  -- header-only library
    add_headerfiles("include/*.h")
```

### Target Type Description

| Type | Description | Output Files |
|------|-------------|--------------|
| binary | Executable program | app.exe, app |
| static | Static library | libapp.a, app.lib |
| shared | Dynamic library | libapp.so, app.dll |
| object | Object file collection | *.o, *.obj |
| headeronly | Header-only library | No compilation output |
| phony | Virtual target | No output, only for dependency management |

### Virtual Targets (phony)

Virtual targets don't generate actual files, they're only used for managing dependencies:

```lua
target("test1")
    set_kind("binary")
    add_files("src/test1.cpp")

target("test2")
    set_kind("binary")
    add_files("src/test2.cpp")

target("all-tests")
    set_kind("phony")
    add_deps("test1", "test2")
```

Executing `xmake build all-tests` will build both test1 and test2.

## Configure target dependency {#configure-targetdeps}

We can configure the dependency between two target programs through the [add_deps](/api/description/project-target#add-deps) interface.

This is usually used in scenarios where an executable program depends on a static library (or dynamic library), for example:

```lua
target("foo")
    set_kind("static")
    add_files("src/foo.cpp")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.cpp")
```

Since the dependency between test and foo library programs is configured through `add_deps`, when we compile test, the foo dependency library will be automatically compiled and automatically linked to it, without the need for additional `add_links` and `add_linkdirs` configurations.

For more information about dependency configuration, please refer to the document: [add_deps](/api/description/project-target#add-deps).

## Target File Configuration {#configure-target-files}

### Adding Source Files

```lua
target("app")
    add_files("src/*.cpp")           -- add all cpp files
    add_files("src/*.c")             -- add all c files
    add_files("src/*.asm")           -- add assembly files
    add_files("src/*.m")             -- add Objective-C files
    add_files("src/*.mm")            -- add Objective-C++ files
```

### Excluding Specific Files

```lua
target("app")
    add_files("src/*.cpp|test.cpp")  -- exclude src/test.cpp file
```

### Adding Header Files

```lua
target("header-lib")
    set_kind("headeronly")
    add_headerfiles("include/*.h")           -- add header files
    add_headerfiles("include/*.hpp")         -- add C++ header files
    add_headerfiles("include/*.h", {install = false})  -- non-installable header files
```

### Adding Install Files

```lua
target("app")
    add_installfiles("assets/*.png", {prefixdir = "share/app"})  -- install resource files
    add_installfiles("config/*.conf", {prefixdir = "etc"})       -- install config files
```

## Target Property Configuration {#configure-target-properties}

### Setting Target Filename

```lua
target("app")
    set_basename("myapp")  -- generated filename will be myapp.exe
```

### Setting Target Directory

```lua
target("app")
    set_targetdir("bin")   -- output to bin directory
```

### Setting Install Directory

```lua
target("app")
    set_installdir("bin")  -- install to bin directory
```

### Setting Version Information

```lua
target("app")
    set_version("1.0.0")   -- set version number
```

## Target Visibility Configuration {#configure-target-visibility}

### Setting Symbol Visibility

```lua
target("lib")
    set_kind("shared")
    set_symbols("hidden")  -- hide symbols, reduce export table size
```

### Setting Visibility Level

```lua
target("lib")
    set_kind("shared")
    set_visibility("hidden")  -- set default visibility to hidden
```

## Target Optimization Configuration {#configure-target-optimization}

### Setting Optimization Level

```lua
target("app")
    set_optimize("fast")        -- fast optimization
    set_optimize("faster")      -- faster optimization
    set_optimize("fastest")     -- fastest optimization
    set_optimize("smallest")    -- size optimization
    set_optimize("none")        -- no optimization
```

### Setting Debug Information

```lua
target("app")
    set_symbols("debug")     -- add debug symbols
    set_strip("debug")       -- strip debug symbols during linking
    set_strip("all")         -- strip all symbols during linking
```

## Target Language Configuration {#configure-target-languages}

### Setting Language Standards

```lua
target("app")
    set_languages("c++17")   -- set C++ standard
    set_languages("c11")     -- set C standard
```

### Setting Language Features

```lua
target("app")
    set_languages("c++17", "c11")  -- support both C++17 and C11
```

## Target Platform Configuration {#configure-target-platforms}

### Setting Target Platform

```lua
target("app")
    set_plat("android")      -- set to Android platform
    set_arch("arm64-v8a")    -- set to ARM64 architecture
```

### Conditional Configuration

```lua
target("app")
    if is_plat("windows") then
        add_defines("WIN32")
        add_links("user32")
    elseif is_plat("linux") then
        add_defines("LINUX")
        add_links("pthread")
    end
```

## Target Option Configuration {#configure-target-options}

### Associating Options

```lua
option("enable_gui")
    set_default(false)
    set_description("Enable GUI support")

target("app")
    set_options("enable_gui")  -- associate option
```

### Conditional Options

```lua
target("app")
    if has_config("enable_gui") then
        add_defines("GUI_ENABLED")
        add_links("gtk+-3.0")
    end
```

## Target Rule Configuration {#configure-target-rules}

### Adding Build Rules

```lua
target("app")
    add_rules("mode.debug", "mode.release")  -- add debug and release modes
    add_rules("qt.widgetapp")                -- add Qt application rule
    add_rules("wdk.driver")                  -- add WDK driver rule
```

### Custom Rules

```lua
rule("myrule")
    set_extensions(".my")
    on_build_file(function (target, sourcefile, opt)
        -- custom build logic
    end)

target("app")
    add_rules("myrule")  -- apply custom rule
```

## Target Runtime Configuration {#configure-target-runtime}

### Setting Runtime Library

```lua
target("app")
    set_runtimes("MT")      -- static runtime (MSVC)
    set_runtimes("MD")      -- dynamic runtime (MSVC)
```

### Setting Runtime Path

```lua
target("app")
    set_runtimes("MD")
    add_rpathdirs("$ORIGIN")  -- set relative path lookup
```

## Target Toolchain Configuration {#configure-target-toolchain}

### Setting Toolchain

```lua
target("app")
    set_toolset("clang")    -- use Clang toolchain
    set_toolset("gcc")      -- use GCC toolchain
    set_toolset("msvc")     -- use MSVC toolchain
```

### Setting Compiler

```lua
target("app")
    set_toolset("cc", "clang")   -- set C compiler
    set_toolset("cxx", "clang++") -- set C++ compiler
```

## Target Group Configuration {#configure-target-groups}

### Setting Target Groups

```lua
target("app")
    set_group("apps")       -- set group to apps

target("lib")
    set_group("libs")       -- set group to libs

target("test")
    set_group("tests")      -- set group to tests
```

## Target Default Configuration {#configure-target-defaults}

### Setting Default Targets

```lua
target("app")
    set_default(true)       -- set as default build target

target("test")
    set_default(false)      -- not set as default build target
```

### Enabling/Disabling Targets

```lua
target("app")
    set_enabled(true)       -- enable target

target("old")
    set_enabled(false)      -- disable target
```

## More Information {#more-information}

- Complete API documentation: [Project Target API](/api/description/project-target)
- Target instance interfaces: [Target Instance API](/api/scripts/target-instance)
- Built-in rules reference: [Built-in Rules](/api/description/builtin-rules)

