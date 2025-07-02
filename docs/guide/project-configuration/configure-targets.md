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

## Others

For a more complete description of the target configuration API, please refer to the documentation: [Project Target API Manual](/api/description/project-target).
