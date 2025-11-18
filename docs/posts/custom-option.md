---
title: "Advanced Feature: Custom Options"
tags: [xmake, custom options]
date: 2016-08-07
author: Ruki
outline: deep
---

xmake can also support some custom option switches, making projects support optional compilation and facilitating modular project management.

## Adding Custom Build Switches

Let's take a practical example:

We want to add a new switch option called `hello` to our project. If this switch is enabled, it will add some specific source files to the target, but this switch is disabled by default and needs to be linked and used by configuring `xmake f --hello=true`.

And when using it, we need to define some special macro definitions: `-DHELLO_TEST -DHELLO_ENABLE`.

Then we start modifying `xmake.lua`. The process is not complicated:

1. Define a switch option named `hello` at the top of `xmake.lua` through the `option` interface:

```lua

-- Define a switch option named hello, this interface is at the same level as add_target, don't use it inside add_target (it's okay to use it, but it doesn't look good)
option("hello")

    -- Disable this switch by default, need to manually run xmake f --hello=true to enable it, of course you can also enable it by default
    set_default(false)

    -- Define some macro switches, these will only be defined when hello is enabled
    add_defines_if_ok("HELLO_ENABLE", "HELLO_TEST")
```

2. Bind the defined `hello` switch option to your target project:

```lua

-- Add a test target
target("test")
    
    -- Generate executable program
    set_kind("binary")

    -- Bind hello switch option
    add_options("hello")

    -- Add some source files that are only needed for hello
    if options("hello") then
        add_files("hello/*.c")
    end
```

That's it, just two steps. Next is compilation:

```bash

# Direct compilation, hello is disabled by default, so hello-related code is not compiled in
$ xmake 

# Next we enable it and recompile. At this time, hello/*.c code is also compiled in, and -DHELLO_TEST -DHELLO_ENABLE are also added to compilation options
$ xmake f --hello=true
$ xmake -r
```

Very convenient, right? Just two steps. Next, let's polish it a bit:

```lua

option("hello")

    -- Disable this switch by default, need to manually run xmake f --hello=true to enable it, of course you can also enable it by default
    set_default(false)

    -- Define some macro switches, these will only be defined when hello is enabled
    add_defines_if_ok("HELLO_ENABLE", "HELLO_TEST")

    -- Enable display menu, so when you run xmake f --help, your newly added switch will be displayed
    set_showmenu(true)

    -- Categorize the switch in the menu, so the layout will look better when displayed, this is not required
    set_category("module_xxx")

    -- In the menu, provide a detailed description of this switch
    set_description("Enable or disable the hello module")

```

At this time, when you type:

```bash
$ xmake f --help
```

The following menu information will be displayed:

```
Omitted here...

--hello=HELLO       Enable or disable the hello module (default: false)

Omitted here...
```

This way, it's clearer for others to see.

## Auto-detection Mechanism

Next, let's make it slightly more complex. When this `hello` is enabled, automatically link the `libhello.a` library, and automatically detect `libhello.a`. If it doesn't exist, disable the `hello` switch.

Modify as follows:

```lua

option("hello")

    -- Disable this switch by default, need to manually run xmake f --hello=true to enable it, of course you can also enable it by default
    set_default(false)

    -- Define some macro switches, these will only be defined when hello is enabled
    add_defines_if_ok("HELLO_ENABLE", "HELLO_TEST")

    -- Enable display menu, so when you run xmake f --help, your newly added switch will be displayed
    set_showmenu(true)

    -- In the menu, provide a detailed description of this switch
    set_description("Enable or disable the hello module")

    -- Add link library libhello.a, this will be automatically detected during xmake f, if the link detection fails, this switch will be disabled
    -- If ok, -lhello will be automatically added during compilation
    add_links("hello")

    -- Add link library detection search directory, if the path is wrong, detection will fail to link, if ok, -L./libs will be automatically added during compilation
    add_linkdirs("libs")

```

After modification, if this `hello` switch is manually enabled or automatically detected successfully, `-L./libs -lhello` link options will be automatically added during compilation and linking.

## Adding Other Detection Rules

For auto-detection, in addition to detecting link libraries, you can also add some other detection rules:

* Detect whether header files can be included normally
* Detect whether type definitions exist
* Detect whether interface APIs exist
* Detect whether link libraries can be linked normally

For example:

```lua

option("hello")

    -- Disable this switch by default, need to manually run xmake f --hello=true to enable it, of course you can also enable it by default
    set_default(false)

    -- Define some macro switches, these will only be defined when hello is enabled
    add_defines_if_ok("HELLO_ENABLE", "HELLO_TEST")

    -- Enable display menu, so when you run xmake f --help, your newly added switch will be displayed
    set_showmenu(true)

    -- In the menu, provide a detailed description of this switch
    set_description("Enable or disable the hello module")

    -- Add link library libhello.a, this will be automatically detected during xmake f, if the link detection fails, this switch will be disabled
    -- If ok, -lhello will be automatically added during compilation
    add_links("hello")

    -- Add link library detection search directory, if the path is wrong, detection will fail to link, if ok, -L./libs will be automatically added during compilation
    add_linkdirs("libs")

    -- Detect in c code: include "hello/hello.h", whether it succeeds, only enable hello if ok
    -- For c++ code detection, please use: add_cxxincludes
    add_cincludes("hello/hello.h")

    -- Add header file detection path, if ok, compilation options will be automatically added: -Iinc/xxx -I./inc
    add_includedirs("inc/$(plat)", "inc")

    -- Detect support for c code type wchar_t, if this type doesn't exist, detection fails
    -- Detection will depend on the header files provided in add_cincludes. If the given header file defines this type, detection will pass
    -- For c++ code detection, please use: add_cxxtypes
    add_ctypes("wchar_t")

    -- Detect whether interface API exists in c code: hello_test()
    -- Detection will depend on the header files provided in add_cincludes. If the given header file defines this type, detection will pass
    -- For c++ code detection, please use: add_cxxfuncs
    add_cfuncs("hello_test")

```

Note that all detections are in AND relationship. All must pass before the `hello` switch is automatically enabled.

## Other APIs That Can Be Automatically Added

And after detection passes or is manually enabled, some special compilation options and macro definitions can be automatically added. These interfaces are as follows:

* `add_cflags`: After the option switch is enabled, automatically add c compilation options
* `add_cxflags`: After the option switch is enabled, automatically add c/c++ compilation options
* `add_cxxflags`: After the option switch is enabled, automatically add c++ compilation options
* `add_ldflags`: After the option switch is enabled, automatically add link options
* `add_vectorexts`: After the option switch is enabled, automatically add instruction extension options, for example: mmx, sse ...

## Auto-generate config.h Configuration File

`option` can not only automatically add compilation options during compilation, but also automatically generate various macro switches to the `config.h` file after being enabled, making it convenient for us to control compilation logic in code.

For specific usage instructions, see: [Adding Dependencies and Auto-detection Mechanism](https://xmake.io/)

