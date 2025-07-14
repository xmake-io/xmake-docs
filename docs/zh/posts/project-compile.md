---
title: 使用xmake编译工程
tags: [xmake, 编译, 跨平台]
date: 2016-02-04
author: Ruki
---

如果你只想编译当前主机环境的平台，例如在windows上编译windows版本，在macosx上编译macosx版本，那么你只需要敲以下命令即可：

```bash
    xmake
```

因为xmake默认会去检测当前的环境，默认编译当前主机的平台版本，不需要做额外的配置，并且默认编译的是release版本。

如果工程里面有多个目标，那么上面的命令，会去编译所有目标，如果只想编译指定一个目标，例如：test，那么只需执行：

```bash
    xmake test
```

如果你想编译debug版本，那么需要做些简单的配置：

```bash
    xmake config --mode=debug
    xmake
```

xmake针对每个命令和参数，都提供了简写版本：

```bash
    xmake f -m debug
    xmake
```

注：为了提高灵活性，release版本和debug版本的编译选项设置，需要自己在工程描述文件中描述，如果没有设置的话，release和debug版本生成的程序是一样的。



如果你想强制重新构建所有，可以执行：

```bash
    xmake -r
    xmake --rebuild
```

如果要指定编译具体某个架构，可以这么进行编译：

```bash
    xmake f -a armv7
    xmake
```

一般情况下，如果没有指定架构，默认会去使用指定平台的默认架构，例如：macosx下默认是x86_64，iphoneos下士armv7

如果想要指定编译其他平台，例如在macosx上编译iphoneos的版本，那么：

```bash
    xmake f -p iphoneos
    xmake
```

编译android版本：

```bash
    xmake f -p android --ndk=xxxx
    xmake
```

虽然配置完后，每次编译不需要重新配置，但是如果切换编译目标平台到ios、linux，那么之前ndk的设置就被清除了，下次得重新配置。

如果想要更加方便的不同平台间来回切换编译，可以将ndk设置到全局配置中，例如：

```bash
    -- 将ndk设置到全局配置中
    xmake g --ndk=xxx

    -- 切换到android编译平台，不需要每次都设置ndk了
    xmake f -p android
    xmake -r

    -- 切换到ios编译平台
    xmake f -p iphoneos
    xmake -r
```

编译windows版本，很简单，只要你机子装了vs，xmake会去自动检测，不需要做额外的配置，只需要打开cmd，进入你的工程目录，
然后执行xmake就行了。

使用其他交叉工具链进行编译：

```bash
    xmake f -p android -a armv7-a --cross=arm-linux-androideabi- --toolchains=/xxxx/bin
    xmake
```

默认在编译配置的时候，会去缓存上一次的配置，这样每次配置只需要修改部分参数就行了，不需要每次全部重新配置

如果你想重新配置所有，清楚原有的缓存，可以加上--clean参数：

```bash
    xmake f -c
    xmake f --clean
    xmake
```

xmake在配置的时候，会去检测工程依赖的一些接口和链接库，如果你想要看具体详细的配置检测信息，可以加上--verbose参数，回显配置信息

```bash
    xmake f -c -v
    xmake f --clean --verbose
    xmake
```

xmake还支持在编译的时候，手动设置一些编译选项和工具，你可以执行`xmake f --help`看下：

```bash
    Usage: xmake config|f [options] [target]

    Configure the project.

    Options: 
        -c, --clean                            Clean the cached configure and configure all again.
                                               
        -p PLAT, --plat=PLAT                   Compile for the given platform. (default: macosx)
                                                   - android
                                                   - iphoneos
                                                   - iphonesimulator
                                                   - linux
                                                   - macosx
                                                   - mingw
                                                   - watchos
                                                   - watchsimulator
                                                   - windows
        -a ARCH, --arch=ARCH                   Compile for the given architecture. (default: auto)
                                                   - android: armv5te armv6 armv7-a armv8-a arm64-v8a
                                                   - iphoneos: armv7 armv7s arm64
                                                   - iphonesimulator: i386 x86_64
                                                   - linux: i386 x86_64
                                                   - macosx: i386 x86_64
                                                   - mingw: i386 x86_64
                                                   - watchos: armv7 armv7s arm64
                                                   - watchsimulator: i386 x86_64
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