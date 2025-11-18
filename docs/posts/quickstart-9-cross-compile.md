---
title: Xmake Getting Started Tutorial 9, Cross Compilation Explained
tags: [xmake, lua, cross compilation]
date: 2019-12-05
author: Ruki
outline: deep
---

xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance, 
and a consistent build experience across platforms.

In addition to built-in build support for win, linux, macOS platforms, and android, ios and other mobile platforms, xmake also supports cross-compilation support for various other toolchains. In this article, we will explain in detail how to use xmake for cross-compilation.

* [Project Source](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io)

### Introduction to Cross-Compilation Toolchains

Usually, if we need to compile target files that can only run on other devices in the current PC environment, we need to compile and generate them through the corresponding cross-compilation toolchain. For example, compiling Linux programs on win/macos, or compiling target files for other embedded devices on Linux, etc.

Usually, cross-compilation toolchains are based on gcc/clang and mostly have a structure similar to the following:

```
/home/toolchains_sdkdir
   - bin
       - arm-linux-armeabi-gcc
       - arm-linux-armeabi-ld
       - ...
   - lib
       - libxxx.a
   - include
       - xxx.h
```

Each toolchain has corresponding include/lib directories for placing some system libraries and header files, such as libc, stdc++, etc. The bin directory contains a series of compilation toolchain tools. For example:

```
arm-linux-armeabi-ar
arm-linux-armeabi-as
arm-linux-armeabi-c++
arm-linux-armeabi-cpp
arm-linux-armeabi-g++
arm-linux-armeabi-gcc
arm-linux-armeabi-ld
arm-linux-armeabi-nm
arm-linux-armeabi-strip
```

The `arm-linux-armeabi-` prefix is the cross, which is used to identify the target platform and architecture, mainly to distinguish it from the host's own gcc/clang.

The gcc/g++ inside are c/c++ compilers, which can usually also be used as linkers. When linking, they will internally call ld to link and automatically append some c++ libraries.
cpp is the preprocessor, as is the assembler, ar is used to generate static libraries, strip is used to remove some symbol information, making the target program smaller. nm is used to view the export symbol list.

### Automatic Detection and Compilation

If our cross-compilation toolchain has the structure described above, xmake will automatically detect and identify the SDK structure, extract the cross inside, and the include/lib path locations. Users usually don't need to do additional parameter settings, just configure the SDK root directory to compile, for example:

```bash
$ xmake f -p cross --sdk=/home/toolchains_sdkdir
$ xmake
```

Among them, `-p cross` is used to specify that the current platform is a cross-compilation platform, and `--sdk=` is used to specify the root directory of the cross toolchain.

Note: We can also specify the `-p linux` platform to configure cross-compilation. The effect is the same. The only difference is that it additionally identifies the Linux platform name, which is convenient for judging the platform through `is_plat("linux")` in xmake.lua.

At this time, xmake will automatically detect the prefix name cross of gcc and other compilers: `arm-linux-armeabi-`, and during compilation, it will also automatically add search options for `link libraries` and `header files`, for example:

```
-I/home/toolchains_sdkdir/include 
-L/home/toolchains_sdkdir/lib
```

These are all handled automatically by xmake and do not need to be configured manually.

### Manual Compilation Configuration

If the automatic detection above cannot fully compile for certain toolchains, users need to manually set some cross-compilation-related configuration parameters to adjust and adapt to these special toolchains. Below I will explain how to configure them one by one.

#### Setting the Toolchain bin Directory

For irregular toolchain directory structures, if the simple `[--sdk](https://xmake.io)` option setting cannot fully detect and pass, you can continue to add the toolchain bin directory location through this option.

For example: For some special cross toolchains, the compiler bin directory is not in the `/home/toolchains_sdkdir/bin` location, but is independently located at `/usr/opt/bin`

At this time, we can add the bin directory parameter setting on the basis of setting the sdk parameter to adjust the toolchain bin directory.

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --bin=/usr/opt/bin
$ xmake
```

#### Setting the Cross Toolchain Tool Prefix

For prefixes like `aarch64-linux-android-`, usually if you configure `--sdk` or `--bin`, xmake will automatically detect it, and you don't need to set it manually.

However, for some extremely special toolchains where multiple cross-prefixed tool bins are mixed together in one directory, you need to manually set this configuration to distinguish which bin to use.

For example, two different compilers exist simultaneously in the toolchains bin directory:

```
/opt/bin
  - armv7-linux-gcc 
  - aarch64-linux-gcc
```

If we now want to use the armv7 version, we can add the `--cross=` configuration to set the compilation tool prefix name, for example:

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --bin=/opt/bin --cross=armv7-linux-
```

#### Setting c/c++ Compilers

If you want to further subdivide the compiler selection, continue to add related compiler options, for example:

```bash
$ xmake f -p linux --sdk=/user/toolsdk --cc=armv7-linux-clang --cxx=armv7-linux-clang++
```

Of course, we can also specify the full path of the compiler.

`--cc` is used to specify the c compiler name, and `--cxx` is used to specify the c++ compiler name.

Note: If CC/CXX environment variables exist, the values specified in the current environment variables will be used first.

If the specified compiler name is not one of those that xmake can recognize internally (with gcc, clang, etc.), the compiler tool detection will fail.

At this time, we can use:

```bash
xmake f --cxx=clang++@/home/xxx/c++mips.exe
```

Set the c++mips.exe compiler to compile in a clang++-like manner.

That is to say, while specifying the compiler as `c++mips.exe`, tell xmake that it is basically the same as clang++ in terms of usage and parameter options.

#### Setting c/c++ Linkers

If you want to further subdivide the linker selection, continue to add related linker options, for example:

```bash
$ xmake f -p linux --sdk=/user/toolsdk --ld=armv7-linux-clang++ --sh=armv7-linux-clang++ --ar=armv7-linux-ar
```

ld specifies the executable program linker, sh specifies the shared library program linker, and ar specifies the archiver for generating static libraries.

Note: If LD/SH/AR environment variables exist, the values specified in the current environment variables will be used first.

#### Setting Header File and Library Search Directories

If there are additional other include/lib directories in the SDK that are not in the standard structure, causing cross-compilation to not find libraries and header files, we can add search paths through `--includedirs` and `--linkdirs`, and then add additional link libraries through `--links`.

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --includedirs=/usr/toolsdk/xxx/include --linkdirs=/usr/toolsdk/xxx/lib --links=pthread
```

Note: If you want to specify multiple search directories, you can separate them with `:` or `;`, which are the path separators for different host platforms. Use `:` on linux/macos and `;` on win.

#### Setting Compilation and Link Options

We can also configure some compilation and link options through `--cflags`, `--cxxflags`, `--ldflags`, `--shflags`, and `--arflags` according to the actual situation.

* cflags: Specify c compilation parameters
* cxxflags: Specify c++ compilation parameters
* cxflags: Specify c/c++ compilation parameters
* asflags: Specify assembler compilation parameters
* ldflags: Specify executable program link parameters
* shflags: Specify dynamic library program link parameters
* arflags: Specify static library generation parameters

For example:

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --cflags="-DTEST -I/xxx/xxx" --ldflags="-lpthread"
```

### MinGW Toolchain

Using the MinGW toolchain for compilation is actually cross-compilation, but because this is commonly used, xmake has specifically added a MinGW platform to quickly handle compilation using the MinGW toolchain.

Therefore, xmake's toolchain detection for MinGW will be more complete. On macOS, basically even the SDK path doesn't need to be configured, and it can be directly detected. Just switch to the MinGW platform for compilation:

```bash
$ xmake f -p mingw
$ xmake -v
configure
{
    ld = /usr/local/opt/mingw-w64/bin/x86_64-w64-mingw32-g++
    ndk_stdcxx = true
    plat = mingw
    mingw = /usr/local/opt/mingw-w64
    buildir = build
    arch = x86_64
    xcode = /Applications/Xcode.app
    mode = release
    cxx = /usr/local/opt/mingw-w64/bin/x86_64-w64-mingw32-gcc
    cross = x86_64-w64-mingw32-
    theme = default
    kind = static
    ccache = true
    host = macosx
    clean = true
    bin = /usr/local/opt/mingw-w64/bin
}
[  0%]: ccache compiling.release src/main.cpp
/usr/local/bin/ccache /usr/local/opt/mingw-w64/bin/x86_64-w64-mingw32-gcc -c -fvisibility=hidden -O3 -m64 -o build/.objs/test/mingw/x86_64/release/src/main.cpp.obj src/main.cpp
[100%]: linking.release test.exe
/usr/local/opt/mingw-w64/bin/x86_64-w64-mingw32-g++ -o build/mingw/x86_64/release/test.exe build/.objs/test/mingw/x86_64/release/src/main.cpp.obj -s -fvisibility=hidden -m64
build ok!
```

Here we added the `-v` parameter to see the detailed compilation commands and the detected MinGW toolchain configuration values. Among them, cross was automatically detected as: `x86_64-w64-mingw32-`, the bin directory was also automatically detected, as well as the compiler and linker.

Although the SDK path cannot be automatically detected on linux/win yet, we can also manually specify the SDK path. It should be noted that xmake specifically provides a `--mingw=` parameter for MinGW to specify the MinGW toolchain root directory. Its effect is the same as `--sdk=`, but it can be set as a global configuration.

```bash
$ xmake g --mingw=/home/mingwsdk
$ xmake f -p mingw
$ xmake
```

After we set the `--mingw` root directory to the global configuration through the `xmake g/global` command, we don't need to additionally specify the MinGW toolchain path every time we compile and switch compilation platforms, which is convenient to use.

In addition, the usage of other toolchain configuration parameters is no different from what was described above. Parameters like `--cross`, `--bin=` can all be controlled according to actual environmental needs to see if additional configuration is needed to adapt to your own MinGW toolchain.

### Project Description Settings

#### set_toolchain

If you find it cumbersome to configure through the command line every time, some configurations can be pre-configured in xmake.lua to simplify command configuration. For example, compiler specification can be set separately for each target through `set_toolchain`.

```lua
target("test")
    set_kind("binary")
    set_toolchain("cxx", "clang")
    set_toolchain("ld", "clang++")
```

Force the test target's compiler and linker to use the clang compiler, or specify the compiler name or path in the cross-compilation toolchain.

#### set_config

We can also set the default values of each configuration parameter in the `xmake f/config` command through `set_config`. This is a global API that will take effect for each target.

```lua
set_config("cflags", "-DTEST")
set_config("sdk", "/home/xxx/tooksdk")
set_config("cc", "gcc")
set_config("ld", "g++")
```

However, we can still modify the default configuration in xmake.lua through `xmake f --name=value`.

### Custom Compilation Platforms

If a cross toolchain compiles a target program that has a corresponding platform that needs to be specified, and you need to configure some additional compilation parameters in xmake.lua based on different cross-compilation platforms, then the `-p cross` setting above cannot meet the requirements.

Actually, the `-p/--plat=` parameter can also be set to other custom values. You just need to maintain a corresponding relationship with `is_plat`. All non-built-in platform names will default to cross-compilation mode, for example:

```bash
$ xmake f -p myplat --sdk=/usr/local/arm-xxx-gcc/
$ xmake
```

We passed in the custom platform name myplat as the compilation platform of the current cross toolchain, and then in xmake.lua we configure the corresponding settings for this platform:

```lua
if is_plat("myplat") then
    add_defines("TEST")
end
```

Through this method, xmake can easily extend to handle various compilation platforms. Users can extend support for freebsd, netbsd, sunos and other various platforms' cross-compilation themselves.

I excerpted a cross-compilation configuration written when porting libuv before to give you an intuitive feel:

```lua
-- for gragonfly/freebsd/netbsd/openbsd platform
if is_plat("gragonfly", "freebsd", "netbsd", "openbsd") then
    add_files("src/unix/bsd-ifaddrs.c")
    add_files("src/unix/freebsd.c")
    add_files("src/unix/kqueue.c")
    add_files("src/unix/posix-hrtime.c")
    add_headerfiles("(include/uv-bsd.h)")
end 

-- for sunos platform
if is_plat("sunos") then
     add_files("src/unix/no-proctitle.c")
    add_files("src/unix/sunos.c")
    add_defines("__EXTENSIONS_", "_XOPEN_SOURCE=600")
    add_headerfiles("(include/uv-sunos.h)")
end
```

Then, we can switch these platforms to compile:

```bash
$ xmake f -p [gragonfly|freebsd|netbsd|openbsd|sunos] --sdk=/home/arm-xxx-gcc/
$ xmake
```

In addition, the built-in Linux platform also supports cross-compilation. If you don't want to configure other platform names, you can also cross-compile uniformly as a Linux platform.

```bash
$ xmake f -p linux --sdk=/usr/local/arm-xxx-gcc/
$ xmake
```

As long as parameters like `--sdk=` are set, the Linux platform's cross-compilation mode will be enabled.

