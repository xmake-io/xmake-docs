---
title: Compile project
tags: [xmake, compile, configure]
date: 2016-06-26
author: Ruki
---

Typically, you only need to execute the following command for compiling project.

```bash
    xmake
```

xmake will probe your host environment and target platform automaticly. 

The default mode is release and xmake will compile all targets.

You can compile only one given target which name is 'test' for executing the following command.

```bash
    xmake test
```

If you want to complie the debug program, you need configure it for switching to the debug mode and compile it.

```bash
    xmake config --mode=debug
    xmake
```

We provide shorthand for each command, for example:

```bash
    xmake f -m debug
    xmake
```

Please run `xmake --help` to get more info about it.



We need to describe them for the debug and release compile mode in xmake.lua file, for example:

```bash
    -- the debug mode
    if is_mode("debug") then
        
        -- enable the debug symbols
        set_symbols("debug")

        -- disable optimization
        set_optimize("none")

        -- add defines for debug
        add_defines("__tb_debug__")
    end

    -- the release or profile modes
    if is_mode("release", "profile") then

        -- the release mode
        if is_mode("release") then
            
            -- set the symbols visibility: hidden
            set_symbols("hidden")

            -- strip all symbols
            set_strip("all")

            -- fomit the frame pointer
            add_cxflags("-fomit-frame-pointer")
            add_mxflags("-fomit-frame-pointer")

        -- the profile mode
        else
        
            -- enable the debug symbols
            set_symbols("debug")

        end

        -- for pc
        if is_arch("i386", "x86_64") then
     
            -- enable fastest optimization
            set_optimize("fastest")

        -- for embed
        else
            -- enable smallest optimization
            set_optimize("smallest")
        end

        -- attempt to add vector extensions 
        add_vectorexts("sse2", "sse3", "ssse3", "mmx")
    end
```

We can rebuild all targets：

```bash
       xmake -r
    or xmake --rebuild
```

And we can compile target with a gived architecture:

```bash
       xmake f -a armv7
    or xmake config --arch=armv7

       xmake
```

If you want to compile target for the iphoneos platform in macosx host, you can do it:

```bash
       xmake f -p iphoneos
    or xmake f --plat=iphoneos

       xmake
```

We need configure the NDK directory path for android platform.

```bash
       xmake f -p android --ndk=xxxx
       xmake
```

Or we can configure the NDK path as global.

```bash
       xmake g --ndk=xxxx
    or xmake global --ndk=xxx

       xmake f -p android
       xmake
```

Please run `xmake f --help` to get more info about architecture and platform.

We also can compile target using other cross-toolchains for the linux and android platfrom.

```bash
       xmake f -p android -a armv7-a --cross=arm-linux-androideabi- --toolchains=/xxxx/bin
    or xmake f -p linux --cross=arm-linux-androideabi- --toolchains=/toolsdk/bin --ldflags="-arch armv7 -L/use/lib -lm -lc -lz" --cxflags="-I/usr/include"
    or xmake f -p mingw --sdk=/mingwsdk
    or xmake f -p linux --sdk=/toolsdk

       xmake 
```

Uses `--clean` argument for cleaning up all cached configuration

```bash
       xmake f -c
    or xmake f --clean
       xmake
```

Or cleans target files

```bash
    # clean targets only
    xmake -c
    or xmake --clean

    # clean all targets and temporary files 
    or xmake --clean --all
```

Please run `xmake f --help` for getting more configuration info

```bash
    Usage: xmake config|f [options] [target]

    Configure the project.

    Options: 
        -c, --clean                            Clean the cached configure and configure all again.
                                               
        -p PLAT, --plat=PLAT                   Compile for the given platform. (default: macosx)
                                                   - android
                                                   - iphoneos
                                                   - linux
                                                   - macosx
                                                   - mingw
                                                   - watchos
                                                   - windows
        -a ARCH, --arch=ARCH                   Compile for the given architecture. (default: auto)
                                                   - android: armv5te armv6 armv7-a armv8-a arm64-v8a
                                                   - iphoneos: armv7 armv7s arm64 i386 x86_64
                                                   - linux: i386 x86_64
                                                   - macosx: i386 x86_64
                                                   - mingw: i386 x86_64
                                                   - watchos: armv7 armv7s arm64 i386 x86_64
                                                   - windows: x86 x64 amd64 x86_amd64
        -m MODE, --mode=MODE                   Compile for the given mode. (default: release)
                                                   - debug
                                                   - release
                                                   - profile
        -k KIND, --kind=KIND                   Compile for the given target kind. (default: static)
                                                   - static
                                                   - shared
                                                   - binary
            --host=HOST                        The current host environment. (default: macosx)
                                               
            --make=MAKE                        Set the make path. (default: auto)
            --ccache=CCACHE                    Enable or disable the c/c++ compiler cache. (default: auto)
                                               
            --cross=CROSS                      The cross toolchains prefix
                                               .e.g
                                                   - i386-mingw32-
                                                   - arm-linux-androideabi-
            --toolchains=TOOLCHAINS            The cross toolchains directory
                                               
            --cc=CC                            The C Compiler
            --cxx=CXX                          The C++ Compiler
            --cflags=CFLAGS                    The C Compiler Flags
            --cxflags=CXFLAGS                  The C/C++ compiler Flags
            --cxxflags=CXXFLAGS                The C++ Compiler Flags
                                               
            --as=AS                            The Assembler
            --asflags=ASFLAGS                  The Assembler Flags
                                               
            --sc=SC                            The Swift Compiler
            --scflags=SCFLAGS                  The Swift Compiler Flags
                                               
            --ld=LD                            The Linker
            --ldflags=LDFLAGS                  The Binary Linker Flags
                                               
            --ar=AR                            The Static Library Linker
            --arflags=ARFLAGS                  The Static Library Linker Flags
                                               
            --sh=SH                            The Shared Library Linker
            --shflags=SHFLAGS                  The Shared Library Linker Flags
                                               
            --ndk=NDK                          The NDK Directory
            --ndk_sdkver=NDK_SDKVER            The SDK Version for NDK (default: auto)
                                               
            --mm=MM                            The Objc Compiler
            --mxx=MXX                          The Objc++ Compiler
            --mflags=MFLAGS                    The Objc Compiler Flags
            --mxflags=MXFLAGS                  The Objc/c++ Compiler Flags
            --mxxflags=MXXFLAGS                The Objc++ Compiler Flags
                                               
            --xcode_dir=XCODE_DIR              The Xcode Application Directory (default: auto)
            --xcode_sdkver=XCODE_SDKVER        The SDK Version for Xcode (default: auto)
            --target_minver=TARGET_MINVER      The Target Minimal Version (default: auto)
                                               
            --mobileprovision=MOBILEPROVISION  The Provisioning Profile File (default: auto)
            --codesign=CODESIGN                The Code Signing Indentity (default: auto)
            --entitlements=ENTITLEMENTS        The Code Signing Entitlements (default: auto)
                                               
            --vs=VS                            The Microsoft Visual Studio (default: auto)
                                               
        -f FILE, --file=FILE                   Read a given xmake.lua file. (default: xmake.lua)
        -P PROJECT, --project=PROJECT          Change to the given project directory.
                                               Search priority:
                                                   1. The Given Command Argument
                                                   2. The Envirnoment Variable: XMAKE_PROJECT_DIR
                                                   3. The Current Directory
        -o BUILDIR, --buildir=BUILDIR          Set the build directory. (default: build)
                                               
        -v, --verbose                          Print lots of verbose information.
            --version                          Print the version number and exit.
        -h, --help                             Print this help message and exit.
                                               
        target                                 Configure for the given target. (default: all)
```