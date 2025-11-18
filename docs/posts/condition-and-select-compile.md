---
title: Selective Compilation in xmake Project Description
tags: [xmake, compilation, project description, xmake.lua, conditional judgment]
date: 2016-07-23
author: Ruki
outline: deep
---

xmake provides some built-in conditional judgment APIs for obtaining relevant information about project status during selective compilation to adjust compilation logic.

For example: `is_os`, `is_plat`, `is_arch`, `is_kind`, `is_mode`, `is_option`

### `is_mode`

Let's first talk about how to use the most commonly used `is_mode`. This API is mainly used to judge the current compilation mode. For example, when configuring compilation normally, you will execute:

```bash
$ xmake f -m debug
$ xmake
```

To compile the `debug` version, then the mode is `debug`. For the `release` version, it's `release`:

```bash
$ xmake f -m release
$ xmake
```

But if it's just configured like this, xmake still doesn't know how to compile for debug or how to compile the release version, because these mode values are not built-in.

We can set them arbitrarily, for example: profile, checking, etc., to compile performance mode, detection mode. These depend on the actual needs of our project.

Generally, only `debug` and `release` are needed. How to distinguish them? This needs to be configured in `xmake.lua`. Generally, you can refer to the following configuration:

```lua
-- If current compilation mode is debug
if is_mode("debug") then

    -- Add DEBUG compilation macro
    add_defines("DEBUG")

    -- Enable debug symbols
    set_symbols("debug")

    -- Disable optimization
    set_optimize("none")

-- If it's release mode
elseif is_mode("release") then

    -- Hide symbols
    set_symbols("hidden")

    -- Strip all symbols
    set_strip("all")

    -- Enable optimization to: fastest speed mode
    set_optimize("fastest")

    -- Ignore frame pointer
    add_cxflags("-fomit-frame-pointer")
    add_mxflags("-fomit-frame-pointer")
end
```

By judging whether compiling the debug version, enable and disable debug symbol information, and judge whether to disable and enable optimization.

Of course, if our project also sets other modes, such as performance analysis mode: profile, then we can also use this to judge whether to add some analysis compilation options.

### `is_plat`

Next, let's talk about compilation platform judgment. This is also very practical. Although our tool is for cross-platform development, usually the configuration is definitely universal.

But after all, there are thousands of projects with different needs. There will always be some projects that need to do special compilation processing for different platforms.

At this time, we need this API, for example:

```lua
-- If current platform is android
if is_plat("android") then
    add_files("src/xxx/*.c")
end

-- If current platform is macosx or iphoneos
if is_plat("macosx", "iphoneos") then
    add_mxflags("-framework Foundation")
    add_ldflags("-framework Foundation")
end
```

Here, for the android platform, some special code compilation is added. For macosx and iphoneos platforms, Foundation framework linking is added.

There's also a practical little trick here. The `is_xxx` series of interfaces can all pass multiple parameters at the same time, and the logic is an OR relationship.

We can write it like above:

```lua
if is_plat("macosx", "iphoneos", "android", "linux") then
end
```

Otherwise, if using lua's native syntax, although it can also work, it will be very bloated, for example:

```lua
if is_plat("macosx") or is_plat("iphoneos") or is_plat("android") or is_plat("linux") then
end
```

In addition to the `is_xxx` series, APIs with plural suffixes like `s` such as `add_xxxs` can all pass multiple parameters, for example `add_files`:

```lua
add_files("src/*.c", "test.c", "hello.cpp")
```

And so on, I won't introduce them one by one here.

### `is_arch`

This is similar to `is_plat`, but it's used to judge the current compilation target architecture, which is:

```bash
xmake f --arch=x86_64
```

Then, we judge in the project description:

```lua
-- If current architecture is x86_64 or i386
if is_arch("x86_64", "i386") then
    add_files("src/xxx/*.c")
end

-- If current platform is armv7, arm64, armv7s, armv7-a
if is_arch("armv7", "arm64", "armv7s", "armv7-a") then
    -- ...
end
```

If judging all arm architectures one by one like above, it might be very tedious. After all, each platform has many architecture types. xmake provides wildcard matching patterns similar to `add_files` to make judgments more concisely:

```lua
-- If current platform is arm platform
if is_arch("arm*") then
    -- ...
end
```

Using `*` can match all.

### `is_os`

This is simple, used to judge the current compilation target, for example:

```lua
-- If current operating system is ios
if is_os("ios") then
    add_files("src/xxx/*.m")
end
```

Currently supported operating systems are: windows, linux, android, macosx, ios

### `is_kind`

Used to judge whether currently compiling a dynamic library or static library.

Generally used in the following scenarios:

```lua

target("test")
    -- Set target's kind through configuration
    set_kind("$(kind)")
    add_files("src/*c")
    
    -- If currently compiling a static library, then add specified files
    if is_kind("static") then
        add_files("src/xxx.c")
    end

```

When configuring compilation, you can manually switch compilation types:

```lua

-- Compile static library
xmake f -k static
xmake

-- Compile dynamic library
xmake f -k shared
xmake
```

### `is_option`

If an auto-detection option or manually set option is enabled, you can judge through the `is_option` interface, for example:

```lua

-- If manually enabled xmake f --demo=y option
if is_option("demo") then
   
    -- Compile code in demo directory
    add_subdirs("src/demo")
end
```

