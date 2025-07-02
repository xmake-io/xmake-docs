---
outline: deep
---

# Cross Compilation

Generally, if we need to compile and generate object files that can be run on other devices in the current PC environment, we need to compile and generate them through the corresponding cross-compilation toolchain, such as compiling Linux programs on Windows/macOS, or compiling object files for other embedded devices, etc.

The usual cross-compilation toolchain is based on GCC/Clang, and most of them have a structure similar to the following:

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

Each toolchain has a corresponding include/lib directory, which is used to place some system libraries and header files, such as libc, stdc++, etc., and a series of tools for compiling are placed under the bin directory. For example:

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

The `arm-linux-armeabi-` prefix is the cross prefix, which is used to mark the target platform and architecture, and is mainly used to distinguish it from the host's own GCC/Clang.

The gcc/g++ inside is the C/C++ compiler, which can also be used as a linker. When linking, it will internally call ld to link, and automatically add some C++ libraries.
cpp is a preprocessor, as is is an assembler, ar is used to generate a static library, and strip is used to remove some symbol information, making the target program smaller. nm is used to view the list of exported symbols.

## Automatic detection and compilation

If our cross-compilation toolchain has the above structure, Xmake will automatically detect and identify the structure of the SDK, extract the cross prefix and include/lib path location. Users usually do not need to do additional parameter settings, just configure the SDK root directory to compile, for example:

```sh
$ xmake f -p cross --sdk=/home/toolchains_sdkdir
$ xmake
```

Here, `-p cross` is used to specify that the current platform is a cross-compilation platform, and `--sdk=` is used to specify the root directory of the cross toolchain.

Note: We can also specify the `-p linux` platform to configure cross compilation. The effect is the same, the only difference is that the name of the linux platform is additionally identified, which is convenient for `xmake.lua` to determine the platform by `is_plat("linux")`.

At this time, Xmake will automatically detect the cross prefix of gcc and other compilers: `arm-linux-armeabi-`, and when compiling, it will also automatically add search options for `link library` and `header files`:

```
-I/home/toolchains_sdkdir/include
-L/home/toolchains_sdkdir/lib
```

These are handled automatically by Xmake; there is no need to configure them manually.

## Manually configure and compile

If the above automatic detection fails for some toolchains, you need to manually set some configuration parameters related to cross compilation to adapt to these special toolchains. I will explain how to configure them one by one.

## Set toolchain bin directory

For irregular toolchain directory structures, simply setting the [--sdk](#sdk) option may not be enough. You can continue to set the location of the bin directory of the toolchain through this option.

For example, for some special cross toolchains, the compiler bin directory is not in the `/home/toolchains_sdkdir/bin` position, but is instead in `/usr/opt/bin`

At this time, we can add the parameter setting of the bin directory on the basis of setting the sdk parameter to adjust the bin directory of the toolchain.

```sh
$ xmake f -p cross --sdk=/home/toolchains_sdkdir --bin=/usr/opt/bin
$ xmake
```

## Set tool prefix for cross toolchain

Like aarch64-linux-android-, usually if you configure --sdk or --bin, Xmake will automatically detect it, and you don't need to set it manually.

But for some very special toolchains, if there are multiple cross prefix tool bins in a directory at the same time, you need to manually set this configuration to distinguish which bin you need to choose.

For example, there are two different compilers in the bin directory of toolchains:

```
/opt/bin
  - armv7-linux-gcc
  - aarch64-linux-gcc
```

If we now want to choose the armv7 version, then we can append `--cross=` to configure the compiler tool prefix name, for example:

```sh
$ xmake f -p cross --sdk=/usr/toolsdk --bin=/opt/bin --cross=armv7-linux-
```

## Set the c/c++ compiler

If you want to further specify compilers, continue to add relevant compiler options, for example:

```sh
$ xmake f -p cross --sdk=/user/toolsdk --cc=armv7-linux-clang --cxx=armv7-linux-clang++
```

Of course, we can also specify the full path of the compiler.

Note: If the CC/CXX environment variable exists, the value specified in the current environment variable will be used first.

If the specified compiler name is not a name recognized by Xmake (such as gcc, clang, etc.), then the compiler tool detection will fail.

At this time we can use:

```sh
xmake f --cxx=clang++@/home/xxx/c++mips.exe
```

Set the c++ mips.exe compiler as the clang++ in usage and parameter options.

## Set the c/c++ linker

If you want to further specify the linker, continue to add related linker options, for example:

```sh
$ xmake f -p cross --sdk=/user/toolsdk --ld=armv7-linux-clang++ --sh=armv7-linux-clang++ --ar=armv7-linux-ar
```

ld specifies the executable program linker, sh specifies the shared library program linker, and ar specifies the archiver that generates the static library.

Note: If there are LD/SH/AR environment variables, the value specified in the current environment variable will be used first.

## Set header file and library search directory

If there are additional include/lib directories in the SDK that are not in the standard structure, resulting in cross compilation not finding the library and header files, then we can append the search path through `--includedirs` and `--linkdirs`, and then add additional link libraries via `--links`.

```sh
$ xmake f -p cross --sdk=/usr/toolsdk --includedirs=/usr/toolsdk/xxx/include --linkdirs=/usr/toolsdk/xxx/lib --links=pthread
```

Note: If you want to specify multiple search directories, you can use `:` or `;` to separate them, which is the path separator of different host platforms. Use `:` under Linux/macOS, and `;` under Windows.

## Set compile and link options

We can also configure some additional compilation and linking options through `--cflags`, `--cxxflags`, `--ldflags`, `--shflags` and `--arflags` according to the actual situation.

* cflags: specify c compilation parameters
* cxxflags: specify c++ compilation parameters
* cxflags: specify c/c++ compilation parameters
* asflags: specify assembler compilation parameters
* ldflags: specify executable program link parameters
* shflags: specify dynamic library program link parameters
* arflags: specify the generation parameters of the static library

e.g:

```sh
$ xmake f -p cross --sdk=/usr/toolsdk --cflags="-DTEST -I/xxx/xxx" --ldflags="-lpthread"
```

## Custom build platform

If the target program has a corresponding platform to be specified after a cross toolchain is compiled, and it needs to be configured in `xmake.lua` according to different cross compilation platforms, and some additional compilation parameters need to be configured, then the `-p cross` setting above cannot meet the demand.

In fact, the `-p/-plat=` parameter can also be set to other custom values. You only need to maintain the corresponding relationship with `is_plat`. All non-built-in platform names will default to cross-compilation mode, for example:

```sh
$ xmake f -p myplat --sdk=/usr/local/arm-xxx-gcc/
$ xmake
```

We passed in the myplat custom platform name as the current cross-toolchain compilation platform, and then we set the corresponding settings for this platform in `xmake.lua`:

```lua
if is_plat("myplat") then
    add_defines("TEST")
end
```

In this way, Xmake can be easily extended to deal with various compilation platforms. Users can extend their own support for FreeBSD, NetBSD, SunOS and other cross-compiling platforms.

Here is a cross-compilation configuration excerpted from porting libuv, for reference:

```lua
-- for dragonfly/freebsd/netbsd/openbsd platform
if is_plat("dragonfly", "freebsd", "netbsd", "openbsd") then
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

```sh
$ xmake f -p [dragonfly|freebsd|netbsd|openbsd|sunos] --sdk=/home/arm-xxx-gcc/
$ xmake
```

In addition, the built-in Linux platform also supports cross-compilation. If you do n't want to configure other platform names, you can cross-compile as the linux platform.

```sh
$ xmake f -p linux --sdk=/usr/local/arm-xxx-gcc/
$ xmake
```

As long as the `--sdk=` and other parameters are set, the cross-compilation mode of the Linux platform will be enabled.

## Toolchain configuration

For a complete list of tool chains, please execute the following command to view:

```sh
$ xmake show -l toolchains
```

::: tip NOTE
This feature requires v2.3.4 or later to support
:::

The above describes the general cross-compilation toolchain configuration. If some specific toolchains need to be imported into additional scenarios such as `--ldflags/--includedirs`, it is more cumbersome
Therefore, xmake also has some common tool chains built-in, which can save the complicated configuration process of cross-compilation tool chain, and only need to execute:

```sh
$ xmake f --toolchain=gnu-rm --sdk=/xxx/
$ xmake
```

You can quickly switch the designated cross-compilation tool chain. If this tool chain needs to add some specific flags settings, it will be automatically set up to simplify configuration.

Among them, gnu-rm is the built-in GNU Arm Embedded Toolchain.

For example, we can also quickly switch from the entire gcc tool chain to the clang or llvm tool chain, no longer need to make `xmake f --cc=clang --cxx=clang --ld=clang++` one by one.

```sh
$ xmake f --toolchain=clang
$ xmake
```

or

```sh
$ xmake f --toolchain=llvm --sdk=/xxx/llvm
$ xmake
```

The specific tool chains supported by Xmake can be viewed with the following command:

```sh
$ xmake show -l toolchains
xcode         Xcode IDE
vs            VisualStudio IDE
yasm          The Yasm Modular Assembler
clang         A C language family frontend for LLVM
go            Go Programming Language Compiler
dlang         D Programming Language Compiler
sdcc          Small Device C Compiler
cuda          CUDA Toolkit
ndk           Android NDK
rust          Rust Programming Language Compiler
llvm          A collection of modular and reusable compiler and toolchain technologies
cross         Common cross compilation toolchain
nasm          NASM Assembler
gcc           GNU Compiler Collection
mingw         Minimalist GNU for Windows
gnu-rm        GNU Arm Embedded Toolchain
envs          Environment variables toolchain
fasm          Flat Assembler
```

### Custom toolchain

In addition, we can also customize the toolchain in `xmake.lua`, and then specify the switch through `xmake f --toolchain=myclang`, for example:

```lua
toolchain("myclang")
    set_kind("standalone")
    set_toolset("cc", "clang")
    set_toolset("cxx", "clang", "clang++")
    set_toolset("ld", "clang++", "clang")
    set_toolset("sh", "clang++", "clang")
    set_toolset("ar", "ar")
    set_toolset("ex", "ar")
    set_toolset("strip", "strip")
    set_toolset("mm", "clang")
    set_toolset("mxx", "clang", "clang++")
    set_toolset("as", "clang")

    - ...
```

For details about this piece, you can go to the [Custom Toolchain](/api/description/custom-toolchain).

For more details, please see: [#780](https://github.com/xmake-io/xmake/issues/780)

### MingW Toolchain

Compiling with the mingw toolchain is actually cross-compilation, but because this is more commonly used, Xmake specifically adds a mingw platform to quickly handle compilation using the mingw toolchain.

Therefore, Xmake's toolchain detection for mingw will be more perfect. Under macos, basically even the sdk path does not need to be configured, and can be directly detected, only need to switch to the mingw platform to compile.

```sh
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
[  0%]: cache compiling.release src/main.cpp
/usr/local/bin/ccache /usr/local/opt/mingw-w64/bin/x86_64-w64-mingw32-gcc -c -fvisibility=hidden -O3 -m64 -o build/.objs/test/mingw/x86_64/release/src/main.cpp.obj src/main.cpp
[100%]: linking.release test.exe
/usr/local/opt/mingw-w64/bin/x86_64-w64-mingw32-g++ -o build/mingw/x86_64/release/test.exe build/.objs/test/mingw/x86_64/release/src/main.cpp.obj -s -fvisibility=hidden -m64
build ok!
```

Here we have added the `-v` parameter and looked at the detailed compile commands and detected mingw toolchain configuration values, where cross is automatically detected as:` x86_64-w64-mingw32-`, and the bin directory is also automatically detected , As well as compilers and linkers.

Although it is not possible to automatically detect the sdk path on linux/win, we can also manually specify the sdk path. It should be noted that xmake specifically provides a `--mingw =` parameter for mingw to specify the tool chain root of mingw The directory has the same effect as `--sdk =`, but it can be set as a global configuration.

```sh
$ xmake g --mingw=/home/mingwsdk
$ xmake f -p mingw
$ xmake
```

After setting the `--mingw` root directory to the global configuration through the` xmake g/global` command, after each compilation and switching of the compilation platform, there is no need to specify an additional mingw toolchain path, which is convenient for use.

In addition, the usage of other tool chain configuration parameters is the same as that described above. For example, `--cross`,` --bin=`, etc. can be adjusted according to the actual needs of the environment. Own mingw tool chain.

xmake also supports the llvm-mingw tool chain, which can be switched to arm/arm64 architecture to compile.

```sh
$ xmake f --mingw=/xxx/llvm-mingw -a arm64
$ xmake
```

### LLVM Toolchain

The tool chain of llvm is relatively standard, only need to set the sdk configuration path to use:

```sh
$ xmake f -p cross --toolchain=llvm --sdk="C:\Program Files\LLVM"
$ xmake
```

### GNU-RM Toolchain

toolchain downlaod url: https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads#

```sh
$ xmake f -p cross --toolchain=gnu-rm --sdk=/xxx/cc-arm-none-eabi-9-2019-q4-major
$ xmake
```

### TinyC Toolchain

```sh
$ xmake f --toolchain=tinyc
$ xmake
```

::: tip NOTE
In the Releases directory, we also provide a special xmake-tinyc-vX.X.X.win32.exe installation package, built-in tinyc tool chain, without relying on msvc, you can also compile c code, out of the box use without dependencies.
:::

### Emcc tool chain

Usually only need to switch to the Wasm platform, which has built-in emcc toolchain, and additionally adjusts the extension of the target program to `*.html` and output `*.wasm`.

```sh
$ xmake f -p wasm
$ xmake
```

However, we can also switch directly to the emcc toolchain, but the suffix name will not be modified.

```sh
$ xmake f --toolchain=emcc
$ xmake
```

### Intel C++ Compiler Tool Chain

```sh
$ xmake f --toolchain=icc
$ xmake
```

### Intel Fortran Compilation Tool Chain

```sh
$ xmake f --toolchain=ifort
$ xmake
```

## Common Cross-compilation configuration

if you want to known more options, please run: `xmake f --help`。

### --sdk

- Set the sdk root directory of toolchains

xmake provides a convenient and flexible cross-compiling support.
In most cases, we need not to configure complex toolchains prefix, for example: `arm-linux-`

As long as this toolchains meet the following directory structure:

```
/home/toolchains_sdkdir
   - bin
       - arm-linux-gcc
       - arm-linux-ld
       - ...
   - lib
       - libxxx.a
   - include
       - xxx.h
```

Then，we can only configure the sdk directory and build it.

```sh
$ xmake f -p linux --sdk=/home/toolchains_sdkdir
$ xmake
```

Xmake will detect the prefix: arm-linux- and add the include and library search directory automatically.

```
-I/home/toolchains_sdkdir/include -L/home/toolchains_sdkdir/lib
```

These are handled automatically by Xmake; there is no need to configure them manually.

### --bin

- Set the `bin` directory of toolchains

We need set it manually if the toolchains /bin directory is in other places, for example:

```sh
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --bin=/usr/opt/bin
$ xmake
```

::: tip NOTE
Before v2.2.1 version, this parameter name is `--toolchains`, exists more ambiguous, so we changed to `--bin=` to set the bin directory.
:::

### --cross

- Set the prefix of compilation tools

For example, under the same toolchains directory at the same time, there are two different compilers:

```
/opt/bin
 - armv7-linux-gcc
 - aarch64-linux-gcc
```

If we want to use the `armv7-linux-gcc` compiler, we can run the following command:

```sh
$ xmake f -p linux --sdk=/usr/toolsdk --bin=/opt/bin --cross=armv7-linux-
```

### --as

- Set `asm` assembler

```sh
$ xmake f -p linux --sdk=/user/toolsdk --as=armv7-linux-as
```

If the 'AS' environment variable exists, it will use the values specified in the current environment variables.

::: tip NOTE
We can set a unknown compiler as like-gcc/clang compiler, .e.g `xmake f --as=gcc@/home/xxx/asmips.exe`
:::

### --cc

- Set c compiler

```sh
$ xmake f -p linux --sdk=/user/toolsdk --cc=armv7-linux-clang
```

If the 'CC' environment variable exists, it will use the values specified in the current environment variables.

::: tip NOTE
We can set a unknown compiler as like-gcc/clang compiler, .e.g `xmake f --cc=gcc@/home/xxx/ccmips.exe`
:::

### --cxx

- Set `c++` compiler

```sh
$ xmake f -p linux --sdk=/user/toolsdk --cxx=armv7-linux-clang++
```

If the 'CXX' environment variable exists, it will use the values specified in the current environment variables.

::: tip NOTE
We can set a unknown compiler as like-gcc/clang compiler, .e.g `xmake f --cxx=g++@/home/xxx/c++mips.exe`
:::

### --ld

- Set `c/c++/objc/asm` linker

```sh
$ xmake f -p linux --sdk=/user/toolsdk --ld=armv7-linux-clang++
```

If the 'LD' environment variable exists, it will use the values specified in the current environment variables.

::: tip NOTE
We can set a unknown compiler as like-gcc/clang linker, .e.g `xmake f --ld=g++@/home/xxx/c++mips.exe`
:::

### --sh

- Set `c/c++/objc/asm` shared library linker

```sh
$ xmake f -p linux --sdk=/user/toolsdk --sh=armv7-linux-clang++
```

If the 'SH' environment variable exists, it will use the values specified in the current environment variables.

::: tip NOTE
We can set a unknown compiler as like-gcc/clang linker, .e.g `xmake f --sh=g++@/home/xxx/c++mips.exe`
:::

### --ar

- Set `c/c++/objc/asm` static library archiver

```sh
$ xmake f -p linux --sdk=/user/toolsdk --ar=armv7-linux-ar
```

If the 'AR' environment variable exists, it will use the values specified in the current environment variables.

::: tip NOTE
We can set a unknown compiler as like-ar archiver, .e.g `xmake f --ar=ar@/home/xxx/armips.exe`
:::

