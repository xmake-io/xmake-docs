# Conditions

Conditions are generally used to handle some special compilation platforms.

## is_os

### Is the current compilation target system

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

## is_arch

### Is the current compilation architecture

You can use this api to check the configuration command: `xmake f -a armv7`

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

And you can also use the lua regular expression: `.*` to check all matched architectures.

```lua
-- if the current architecture is arm which contains armv7, arm64, armv7s and armv7-a ...
if is_arch("arm.*") then
    -- ...
end
```

## is_plat

### Is the current compilation platform

You can use this api to check the configuration command: `xmake f -p iphoneos`

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

Available platforms:

| Platform  |
|-----------|
| android   |
| appletvos |
| applexros |
| bsd       |
| cross     |
| cygwin    |
| haiku     |
| iphoneos  |
| linux     |
| macosx    |
| mingw     |
| msys      |
| wasm      |
| watchos   |
| windows   |


## is_host

### Is the current compilation host system

Some compilation platforms can be built on multiple different operating systems, for example: android ndk (on linux, macOS and windows).

So, we can use this api to determine the current host operating system.

```lua
if is_host("windows") then
    add_includedirs("C:\\includes")
else
    add_includedirs("/usr/includess")
end
```

Support hosts:

* windows
* linux
* macosx

We can also get it from [$(host)](/api/description/builtin-variables/#var-host) or [os.host](/api/scripts/builtin-modules/os#os-host).

## is_subhost

### Determine the subsystem environment of the current host

At present, it is mainly used for detection of cygwin, msys2 and other subsystem environments on windows systems. If you run xmake in the msys2 shell environment, then `is_subhost("windows")` will return false, and `is_host("windows")` It will still return true.

Currently supported subsystems:

* msys
* cygwin

Configuration example:

```lua
if is_subhost("msys", "cygwin") then
    - Currently in the shell environment of msys2/cygwin
end
```

We can also quickly check the current subsystem platform by executing `xmake l os.subhost`.

::: tip NOTE
It may also support other subsystem environments under linux and macos systems later, if they exist.
:::

## is_subarch

### Determine the architecture of the current host subsystem environment

At present, it is mainly used for the detection of the architecture under the subsystem environment such as cygwin and msys2 on the windows system. The msvc tool chain is usually used on the windows compilation platform, and the architecture is x64, x86.
In the msys/cygwin subsystem environment, the compiler architecture defaults to x86_64/i386, which is different.

We can also quickly view the current subsystem architecture by executing `xmake l os.subarch`.

## is_cross

### Determines whether the current platform is cross-compiled or not.

This interface returns true if the current target architecture and platform, which is not the current host platform, is cross-compiled.

## is_mode

### Is the current compilation mode

You can use this api to check the configuration command: `xmake f -m debug`

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

## is_kind

### Is the current target kind

You can use this api to check the configuration command: `xmake f -k [static|shared]`

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

## is_config

### Is the given config values?

This interface is introduced from version 2.2.2 to determine whether the specified configuration is a given value.

For example:

```console
$ xmake f --test=hello1
```

```lua
option("test")
    set_showmenu(true)
    set_description("The test config option")
option_end()

if is_config("test", "hello1", "hello2") then
    add_defines("HELLO")
end
```

Can be used for conditional package requirements, eg. ：

```lua
-- Add lua or luajit package requirements, depending on the lua_flavor option value
option("lua_flavor")
    set_showmenu(true)
    set_values("luajit", "lua")
option_end()
if is_config("lua_flavor", "luajit") then
    add_requires("luajit")
elseif is_config("lua_flavor", "lua") then
    add_requires("lua")
end
```

Not only that, we can also set pattern matching rules to determine values, such as:

```lua
if is_config("test", "hello.*") then
    add_defines("HELLO")
end
```

::: tip NOTE
This interface is not only able to determine the custom options defined through the [option](/api/description/configuration-option#option),
but also to determine the built-in global and local configuration.
:::

## has_config

### Is the given configs enabled?

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

::: tip NOTE
This interface can determine not only the built-in global and local configs,
but also the custom options defined through the [option](/api/description/configuration-option#option).
:::

## has_package

### Is the given dependent package enabled?

This interface is introduced from version 2.2.3 to detect whether a dependent package exists or is enabled.

It is usually used to [add_requires](/api/description/global-interfaces#add-requires).

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

::: tip NOTE
The difference between this interface and [has_config](#has_config) is that [has_config](#has_config) is used for [option](/api/description/configuration-option#option) whereas this is used for [add_requires](/api/description/global-interfaces#add-requires).
:::
