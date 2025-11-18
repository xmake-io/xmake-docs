---
title: Xmake Getting Started Tutorial 8, Switching Build Modes
tags: [xmake, lua, build mode]
date: 2019-12-05
author: Ruki
outline: deep
---

xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance, 
and a consistent build experience across platforms.

In this article, we will explain in detail how to switch common build modes such as debug/release during the project build process, and how to customize other build modes.

* [Project Source](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io)

### Debug and Release Modes

Usually, if we create a project through the `xmake create` command, a build rule configuration line will be automatically added in xmake.lua, as follows:

```lua
add_rules("mode.release", "mode.debug")
target("hello")
    set_kind("binary")
    add_files("src/*.c")
```

Through the `add_rules` interface, we have added two commonly used built-in rules, release and debug, by default. They will attach some compilation flags related to the corresponding mode during compilation to enable optimization for release or debugging compilation.

If we just execute the `xmake` command without additional configuration, it will default to release compilation, which is equivalent to:

```bash
$ xmake f -m release
$ xmake
[  0%]: ccache compiling.release src/main.cpp
[100%]: linking.release test
build ok!
```

If we want to switch to debug compilation mode, we just need to:

```bash
$ xmake f -m debug
$ xmake
[  0%]: ccache compiling.debug src/main.cpp
[100%]: linking.debug test
build ok!
```

The `-m/--mode=` parameter above is used to set the compilation mode, which will be associated with the `mode.release` and `mode.debug` rules.

So, how are they associated? Let's first look at the internal implementation of these two rules:

```lua
rule("mode.debug")
    after_load(function (target)
        if is_mode("debug") then
            if not target:get("symbols") then
                target:set("symbols", "debug")
            end
            if not target:get("optimize") then
                target:set("optimize", "none")
            end
        end
    end)

rule("mode.release")
    after_load(function (target)
        if is_mode("release") then
            if not target:get("symbols") and target:targetkind() ~= "shared" then
                target:set("symbols", "hidden")
            end
            if not target:get("optimize") then
                if is_plat("android", "iphoneos") then
                    target:set("optimize", "smallest")
                else
                    target:set("optimize", "fastest")
                end
            end
            if not target:get("strip") then
                target:set("strip", "all")
            end
        end
    end)
```

As you can see, during the target loading phase, xmake will judge the user's parameter configuration for `xmake f --mode=xxx`. If it obtains debug mode through the `is_mode()` interface, it will disable related optimizations and enable symbol output.
If it's release mode, it will enable compilation optimization and strip all debugging symbols.

### Customized Mode Configuration

Of course, the compilation configurations set by these two built-in rules by default can only meet the常规需求 of most scenarios. If users want to customize some personal compilation configurations in different compilation modes, they need to make judgments in xmake.lua themselves.

For example, if we want to enable debugging symbols in release mode as well, we just need to:

```lua
if is_mode("release") then
    set_symbols("debug")
end
```

Or add some additional compilation flags:

```lua
if is_mode("release") then
    add_cflags("-fomit-frame-pointer")
end
```

Note: If the user's own configuration conflicts with the built-in configuration of `mode.release`, the user's settings will take priority.

Of course, we can also completely avoid adding default configuration rules through `add_rules("mode.debug", "mode.release")`, letting users completely control the mode configuration themselves:

```lua
-- If the current compilation mode is debug
if is_mode("debug") then

    -- Add DEBUG compilation macro
    add_defines("DEBUG")

    -- Enable debugging symbols
    set_symbols("debug")

    -- Disable optimization
    set_optimize("none")
end

-- If it's release or profile mode
if is_mode("release", "profile") then

    -- If it's release mode
    if is_mode("release") then

        -- Hide symbols
        set_symbols("hidden")

        -- Strip all symbols
        set_strip("all")

        -- Omit frame pointer
        add_cxflags("-fomit-frame-pointer")
        add_mxflags("-fomit-frame-pointer")

    -- If it's profile mode
    else
        -- Enable debugging symbols
        set_symbols("debug")
    end

    -- Add extended instruction sets
    add_vectorexts("sse2", "sse3", "ssse3", "mmx")
end
```

### Other Built-in Mode Rules

Through the example above, we see that in addition to debug/release modes, there's also a profile mode configuration judgment. Actually, xmake also provides corresponding built-in modes. Let's see what else there is:

#### mode.debug

Add debug compilation mode configuration rules to the current project's xmake.lua, for example:

```lua
add_rules("mode.debug")
```

Equivalent to:

```lua
if is_mode("debug") then
    set_symbols("debug")
    set_optimize("none")
end
```

We can switch to this compilation mode by: `xmake f -m debug`.

#### mode.release

Add release compilation mode configuration rules to the current project's xmake.lua, for example:

```lua
add_rules("mode.release")
```

Equivalent to:

```lua
if is_mode("release") then
    set_symbols("hidden")
    set_optimize("fastest")
    set_strip("all")
end
```

We can switch to this compilation mode by: `xmake f -m release`.

#### mode.check

Add check compilation mode configuration rules to the current project's xmake.lua, generally used for memory detection, for example:

```lua
add_rules("mode.check")
```

Equivalent to:

```lua
if is_mode("check") then
    set_symbols("debug")
    set_optimize("none")
    add_cxflags("-fsanitize=address", "-ftrapv")
    add_mxflags("-fsanitize=address", "-ftrapv")
    add_ldflags("-fsanitize=address")
end
```

We can switch to this compilation mode by: `xmake f -m check`.

#### mode.profile

Add profile compilation mode configuration rules to the current project's xmake.lua, generally used for performance analysis, for example:

```lua
add_rules("mode.profile")
```

Equivalent to:

```lua
if is_mode("profile") then
    set_symbols("debug")
    add_cxflags("-pg")
    add_ldflags("-pg")
end
```

We can switch to this compilation mode by: `xmake f -m profile`.

#### mode.coverage

Add coverage compilation mode configuration rules to the current project's xmake.lua, generally used for coverage analysis, for example:

```lua
add_rules("mode.coverage")
```

Equivalent to:

```lua
if is_mode("coverage") then
    add_cxflags("--coverage")
    add_mxflags("--coverage")
    add_ldflags("--coverage")
end
```

We can switch to this compilation mode by: `xmake f -m coverage`.

Note: The generated gcno files are generally in the directory corresponding to the obj, so you need to find them from the build directory.

### Extending Your Own Build Modes

xmake's mode configuration doesn't have fixed values. Users can pass and configure them arbitrarily, as long as the mode value passed in `xmake f -m/--mode=xxx` can correspond to `is_mode("xxx")` in xmake.lua.

For example, if we set our own unique compilation mode `my_mode`, we can directly configure and switch it on the command line:

```bash
$ xmake f -m my_mode
$ xmake
[  0%]: ccache compiling.my_mode src/main.cpp
[100%]: linking.my_mode test
build ok!
```

Then make the corresponding value judgment in xmake.lua:

```lua
if is_mode("my_mode") then
    add_defines("ENABLE_MY_MODE")
end
```

### Using Mode Variables

We can also directly pass mode variables `$(mode)` in configuration values, for example, to select different libraries to link based on different modes:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_links("xxx_$(mode)")
```

With the above configuration, if compiled in debug mode, it will select to link: the `libxxx_debug.a` library, while in release mode it will link `libxxx_release.a`. Of course, we can also set it in the library search path and select the corresponding library based on the directory.

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_linkdirs("lib/$(mode)")
    add_links("xxx")
```

In addition, we can directly obtain the passed mode configuration value through `get_config("mode")`, and these methods of obtaining are also effective in custom scripts, for example:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    on_load(function (target)
        if is_mode("release") then
            print(get_config("mode"), "$(mode)")
        end
    end)
```

