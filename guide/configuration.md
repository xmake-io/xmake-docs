
Set compilation configuration before building project with command `xmake f|config`.

And if you want to known more options, please run: `xmake f --help`。

<p class="tip">
    You can use short or long command option, for example: <br>
    `xmake f` or `xmake config`.<br>
    `xmake f -p linux` or `xmake config --plat=linux`.
</p>

## Target Platforms

### Current Host

```bash
$ xmake
```

<p class="tip">
    XMake will detect the current host platform automatically and build project.
</p>

### Linux

```bash
$ xmake f -p linux [-a i386|x86_64]
$ xmake
```

### Android

```bash
$ xmake f -p android --ndk=~/files/android-ndk-r10e/ [-a armeabi-v7a|arm64-v8a]
$ xmake
```

If you want to set the other android toolchains, you can use [--bin](#-bin) option.

For example:

```bash
$ xmake f -p android --ndk=~/files/android-ndk-r10e/ -a arm64-v8a --bin=~/files/android-ndk-r10e/toolchains/aarch64-linux-android-4.9/prebuilt/darwin-x86_64/bin
```

The [--bin](#-bin) option is used to set `bin` directory of toolchains.

!> Please attempt to set `--arch=` option if it had failed to check compiler.

### iPhoneOS

```bash
$ xmake f -p iphoneos [-a armv7|armv7s|arm64|i386|x86_64]
$ xmake
```

### Windows

```bash
$ xmake f -p windows [-a x86|x64]
$ xmake
```

### Mingw

In addition to supporting Msys2/MingW, MingW for macOS/linux, xmake also supports the llvm-mingw tool chain, which can switch the arm/arm64 architecture to compile.

```bash
$ xmake f -p mingw --sdk=/usr/local/i386-mingw32-4.3.0/ [-a i386|x86_64|arm|arm64]
$ xmake
```

### Wasm (WebAssembly)

This platform is used to compile WebAssembly programs (emcc toolchain is used internally). Before switching this platform, we need to enter the Emscripten toolchain environment to ensure that emcc and other compilers are available.

```bash
$ xmake f -p wasm
$ xmake
```

xmake also supports Qt for wasm compilation, you only need:

```bash
$ xmake f -p wasm [--qt=~/Qt]
$ xmake
```

The `--qt` parameter setting is optional, usually xmake can detect the sdk path of qt.


One thing to note is that there is a correspondence between the versions of Emscripten and Qt SDK. If the version does not match, there may be compatibility issues between Qt/Wasm.

Regarding the version correspondence, you can see: [https://wiki.qt.io/Qt_for_WebAssembly](https://wiki.qt.io/Qt_for_WebAssembly)

For more details, please see: [https://github.com/xmake-io/xmake/issues/956](https://github.com/xmake-io/xmake/issues/956)

### Apple WatchOS

```bash
$ xmake f -p watchos [-a i386|armv7k]
$ xmake
```

## Cross Compilation

Generally, if we need to compile and generate object files that can be run on other devices in the current pc environment, we need to compile and generate them through the corresponding cross-compilation tool chain, such as compiling linux programs on win/macos, or Compile object files of other embedded devices, etc.

The usual cross-compilation tool chain is based on gcc/clang, and most of them have a structure similar to the following:

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

Each toolchain has a corresponding include/lib directory, which is used to place some system libraries and header files, such as libc, stdc++, etc., and a series of tools for compiling the tool chain are placed under the bin directory. E.g:

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

The `arm-linux-armeabi-` prefix is cross, which is used to mark the target platform and architecture, and is mainly used to distinguish it from the host's own gcc/clang.

The gcc/g++ inside is the c/c++ compiler, which can also be used as a linker. When linking, it will internally call ld to link, and automatically add some c++ libraries.
Cpp is a preprocessor, as is an assembler, ar is used to generate a static library, and strip is used to crop out some symbol information, making the target program smaller. nm is used to view the list of exported symbols.

### Automatic detection and compilation

If our cross-compilation tool chain is the above structure, xmake will automatically detect and identify the structure of the SDK, extract the cross and include/lib path location, users usually do not need to do additional parameter settings, just configure the SDK The root directory can be compiled, for example:

```bash
$ xmake f -p cross --sdk=/home/toolchains_sdkdir
$ xmake
```

Among them, `-p cross` is used to specify that the current platform is a cross-compilation platform, and `--sdk=` is used to specify the root directory of the cross toolchain.

Note: We can also specify the `-p linux` platform to configure cross compilation, the effect is the same, the only difference is that the name of the linux platform is additionally identified, which is convenient for xmake.lua to determine the platform by` is_plat ("linux") ` .

At this time, xmake will automatically detect the prefix name cross of gcc and other compilers: `arm-linux-armeabi-`, and when compiling, it will also automatically add search options for` link library` and `header files` :

```
-I/home/toolchains_sdkdir/include
-L/home/toolchains_sdkdir/lib
```

These are handled automatically by xmake, there is no need to configure them manually.

### Manually configure and compile

If the above automatic detection fails to completely compile for some tool chains, you need to manually set some configuration parameters related to cross compilation to adjust to these special tool chains. I will explain how to configure them one by one.

### Set toolchain bin directory

For the irregular tool chain directory structure, by simply setting the [--sdk](https://xmake.io/#/zh-cn/guide/configuration?id=-sdk) option, it is impossible to completely detect the passing situation Next, you can continue to set the location of the bin directory of the toolchain through this option.

For example: for some special cross toolchains, the compiler bin directory is not in the `/home/toolchains_sdkdir/bin` position, but is instead in `/usr/opt/bin`

At this time, we can add the parameter setting of the bin directory on the basis of setting the sdk parameter to adjust the bin directory of the tool chain.

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --bin=/usr/opt/bin
$ xmake
```

### Set tool prefix for cross toolchain

Like aarch64-linux-android-, usually if you configure --sdk or --bin, xmake will automatically detect it, you don't need to set it manually.

But for some very special tool chains, if there are multiple cross prefix tool bins in a directory at the same time, you need to manually set this configuration to distinguish which bin you need to choose.

For example, there are two different compilers in the bin directory of toolchains:

```
/opt/bin
  - armv7-linux-gcc
  - aarch64-linux-gcc
```

We now want to choose the armv7 version, then we can append `--cross=` to configure the compiler tool prefix name, for example:

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --bin=/opt/bin --cross=armv7-linux-
```

### Set the c/c++ compiler

If you want to continue to subdivide and select compilers, continue to add relevant compiler options, for example:

```bash
$ xmake f -p linux --sdk=/user/toolsdk --cc=armv7-linux-clang --cxx=armv7-linux-clang++
```

Of course, we can also specify the full path of the compiler.

`--cc` is used to specify the name of the c compiler, and `--cxx` is used to specify the name of the c++ compiler.

Note: If the cc/cxx environment variable exists, the value specified in the current environment variable will be used first.

If the specified compiler name is not a name recognized by xmake (with gcc, clang, etc.), then the compiler tool detection will fail.

At this time we can pass:

```bash
xmake f --cxx=clang++@/home/xxx/c++mips.exe
```

Set the c ++ mips.exe compiler as the clang ++-like way to compile.
 
That is to say, while specifying the compiler as `c++mips.exe`, tell xmake that it is basically the same as clang ++ usage and parameter options.

### Set the c/c++ linker

If you want to continue to subdivide and select the linker, continue to add related linker options, for example:

```bash
$ xmake f -p linux --sdk=/user/toolsdk --ld=armv7-linux-clang++ --sh=armv7-linux-clang++ --ar=armv7-linux-ar
```

ld specifies the executable program linker, sh specifies the shared library program linker, and ar specifies the archiver that generates the static library.

Note: If there are ld/sh/ar environment variables, the value specified in the current environment variable will be used first.

### Set header file and library search directory

If there are additional other include/lib directories in the SDK that are not in the standard structure, resulting in cross compilation can not find the library and header files, then we can append the search path through `--includedirs` and` --linkdirs`, and then Add additional link libraries via `--links`.

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --includedirs=/usr/toolsdk/xxx/include --linkdirs=/usr/toolsdk/xxx/lib --links=pthread
```

Note: If you want to specify multiple search directories, you can use `:` or `;` to separate, which is the path separator of different host platforms, use `:` under linux / macos, and `;` under win.

### Set compile and link options

We can also configure some additional compilation and linking options through `--cflags`,` --cxxflags`, `--ldflags`, `--shflags` and `--arflags` according to the actual situation.

* cflags: specify c compilation parameters
* cxxflags: specify c ++ compilation parameters
* cxflags: specify c / c ++ compilation parameters
* asflags: specify assembler compilation parameters
* ldflags: specify executable program link parameters
* shflags: specify dynamic library program link parameters
* arflags: specify the generation parameters of the static library

e.g:

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --cflags="-DTEST -I/xxx/xxx" --ldflags="-lpthread"
```

### Project description settings

#### set_toolchains

This sets up different tool chains for a specific target individually. Unlike set_toolset, this interface is an overall switch for a complete tool chain, such as cc/ld/sh and a series of tool sets.

This is also a recommended practice, because most compiler tool chains like gcc/clang, the compiler and the linker are used together. To cut it, you have to cut it as a whole. Separate and scattered switch settings will be cumbersome.

For example, we switch the test target to two tool chains of clang+yasm:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("clang", "yasm")
```

#### set_toolset

If you feel that it is more complicated to configure through the command line each time, some configurations can be pre-configured in xmake.lua to simplify the command configuration. For example, the specification of the compiler can be set individually for each target through set_toolset.

```lua
target("test")
    set_kind("binary")
    set_toolset("cxx", "clang")
    set_toolset("ld", "clang++")
```

Force the compiler and linker of the test target to use the clang compiler, or specify the compiler name or path in the cross-compilation tool chain.

#### set_config

We can also set the default value of each configuration parameter in the `xmake f/config` command through `set_config`. This is a global api and will take effect for each target.

```lua
set_config("cflags", "-DTEST")
set_config("sdk", "/home/xxx/tooksdk")
set_config("cc", "gcc")
set_config("ld", "g++")
```

However, we can still use xmake f --name = value` to modify the default configuration in xmake.lua.

### Custom build platform

If the target program has a corresponding platform to be specified after a cross tool chain is compiled, and it needs to be configured in xmake.lua according to different cross compilation platforms, and some additional compilation parameters need to be configured, then the `-p cross` setting above Can not meet the demand.

In fact, the `-p/-plat=` parameter can also be set to other custom values. You only need to maintain the corresponding relationship with `is_plat`. All non-built-in platform names will default to cross-compilation mode, for example:

```bash
$ xmake f -p myplat --sdk=/usr/local/arm-xxx-gcc/
$ xmake
```

We passed in the myplat custom platform name as the current cross-toolchain compilation platform, and then we set the corresponding settings for this platform in xmake.lua:

```lua
if is_plat("myplat") then
    add_defines("TEST")
end
```

In this way, xmake can be easily extended to deal with various compilation platforms, users can extend their own support for freebsd, netbsd, sunos and other cross-compiling platforms.

I excerpted a cross-compilation configuration written before porting libuv, and intuitively feel:

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

In addition, the built-in Linux platform also supports cross-compilation. If you do n’t want to configure other platform names, you can cross-compile as the linux platform.

```bash
$ xmake f -p linux --sdk=/usr/local/arm-xxx-gcc/
$ xmake
```

As long as the `--sdk=` and other parameters are set, the cross-compilation mode of the Linux platform will be enabled.

### Toolchain configuration

For a complete list of tool chains, please execute the following command to view:

```bash
$ xmake show -l toolchains
```

!> This feature requires v2.3.4 or later to support

The above describes the general cross-compilation toolchain configuration. If some specific toolchains need to be imported into additional scenarios such as `--ldflags/--includedirs`, it is more cumbersome
Therefore, xmake also has some common tool chains built-in, which can save the complicated configuration process of cross-compilation tool chain, and only need to execute:

```bash
$ xmake f --toolchain=gnu-rm --sdk=/xxx/
$ xmake
```

You can quickly switch the designated cross-compilation tool chain. If this tool chain needs to add some specific flags settings, it will be automatically set up to simplify configuration.

Among them, gnu-rm is the built-in GNU Arm Embedded Toolchain.

For example, we can also quickly switch from the entire gcc tool chain to the clang or llvm tool chain, no longer need to make `xmake f --cc=clang --cxx=clang --ld=clang++` one by one.

```bash
$ xmake f --toolchain=clang
$ xmake
```

or

```bash
$ xmake f --toolchain=llvm --sdk=/xxx/llvm
$ xmake
```

The specific tool chains supported by xmake can be viewed with the following command:

```bash
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

#### Custom toolchain

In addition, we can also customize the toolchain in xmake.lua, and then specify the switch through `xmake f --toolchain=myclang`, for example:

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

For details about this piece, you can go to the [Custom Toolchain](/manual/custom_toolchain).

For more details, please see: [#780](https://github.com/xmake-io/xmake/issues/780)

#### MingW Toolchain

Compiling with the mingw toolchain is actually cross-compilation, but because this is more commonly used, xmake specifically adds a mingw platform to quickly handle compilation using the mingw toolchain.

Therefore, xmake's toolchain detection for mingw will be more perfect. Under macos, basically even the sdk path does not need to be configured, and can be directly detected, only need to switch to the mingw platform to compile.

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

Here we have added the `-v` parameter and looked at the detailed compile commands and detected mingw toolchain configuration values, where cross is automatically detected as:` x86_64-w64-mingw32-`, and the bin directory is also automatically detected , As well as compilers and linkers.

Although it is not possible to automatically detect the sdk path on linux/win, we can also manually specify the sdk path. It should be noted that xmake specifically provides a `--mingw =` parameter for mingw to specify the tool chain root of mingw The directory has the same effect as `--sdk =`, but it can be set as a global configuration.

```bash
$ xmake g --mingw=/home/mingwsdk
$ xmake f -p mingw
$ xmake
```

After setting the `--mingw` root directory to the global configuration through the` xmake g/global` command, after each compilation and switching of the compilation platform, there is no need to specify an additional mingw toolchain path, which is convenient for use.

In addition, the usage of other tool chain configuration parameters is the same as that described above. For example, `--cross`,` --bin=`, etc. can be adjusted according to the actual needs of the environment. Own mingw tool chain.

xmake also supports the llvm-mingw tool chain, which can be switched to arm/arm64 architecture to compile.

```bash
$ xmake f --mingw=/xxx/llvm-mingw -a arm64
$ xmake
```

#### LLVM Toolchain

The tool chain of llvm is relatively standard, only need to set the sdk configuration path to use:

```bash
$ xmake f -p cross --toolchain=llvm --sdk="C:\Program Files\LLVM"
$ xmake
```

#### GNU-RM Toolchain

toolchain downlaod url: https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads#

```bash
$ xmake f -p cross --toolchain=gnu-rm --sdk=/xxx/cc-arm-none-eabi-9-2019-q4-major
$ xmake
```

#### TinyC Toolchain

```bash
$ xmake f --toolchain=tinyc
$ xmake
```

!> In the Releases directory, we also provide a special xmake-tinyc-vX.X.X.win32.exe installation package, built-in tinyc tool chain, without relying on msvc, you can also compile c code, out of the box use without dependencies.

#### Emcc tool chain

Usually only need to switch to the Wasm platform, which has built-in emcc toolchain, and additionally adjusts the extension of the target program to `*.html` and output `*.wasm`.

```bash
$ xmake f -p wasm
$ xmake
```

However, we can also switch directly to the emcc toolchain, but the suffix name will not be modified.

```bash
$ xmake f --toolchain=emcc
$ xmake
```

#### Intel C++ Compiler Tool Chain

```bash
$ xmake f --toolchain=icc
$ xmake
```

#### Intel Fortran Compilation Tool Chain

```bash
$ xmake f --toolchain=ifort
$ xmake
```

### Common Cross-compilation configuration

| Configuration Option         | Description                                  |
| ---------------------------- | -------------------------------------------- |
| [--sdk](#-sdk)               | Set the sdk root directory of toolchains     |
| [--bin](#-bin)               | Set the `bin` directory of toolchains        |
| [--cross](#-cross)           | Set the prefix of compilation tools          |
| [--as](#-as)                 | Set `asm` assembler                          |
| [--cc](#-cc)                 | Set `c` compiler                             |
| [--cxx](#-cxx)               | Set `c++` compiler                           |
| [--mm](#-mm)                 | Set `objc` compiler                          |
| [--mxx](#-mxx)               | Set `objc++` compiler                        |
| [--sc](#-sc)                 | Set `swift` compiler                         |
| [--gc](#-gc)                 | Set `golang` compiler                        |
| [--dc](#-dc)                 | Set `dlang` compiler                         |
| [--rc](#-rc)                 | Set `rust` compiler                          |
| [--cu](#-cu)                 | Set `cuda` compiler                          |
| [--ld](#-ld)                 | Set `c/c++/objc/asm` linker                  |
| [--sh](#-sh)                 | Set `c/c++/objc/asm` shared library linker   |
| [--ar](#-ar)                 | Set `c/c++/objc/asm` static library archiver |
| [--scld](#-scld)             | Set `swift` linker                           |
| [--scsh](#-scsh)             | Set `swift` shared library linker            |
| [--gcld](#-gcld)             | Set `golang` linker                          |
| [--gcar](#-gcar)             | Set `golang` static library archiver         |
| [--dcld](#-dcld)             | Set `dlang` linker                           |
| [--dcsh](#-dcsh)             | Set `dlang` shared library linker            |
| [--dcar](#-dcar)             | Set `dlang` static library archiver          |
| [--rcld](#-rcld)             | Set `rust` linker                            |
| [--rcsh](#-rcsh)             | Set `rust` shared library linker             |
| [--rcar](#-rcar)             | Set `rust` static library archiver           |
| [--cu-ccbin](#-cu-ccbin)     | Set `cuda` host compiler                     |
| [--culd](#-culd)             | Set `cuda` linker                            |
| [--asflags](#-asflags)       | Set `asm` assembler option                   |
| [--cflags](#-cflags)         | Set `c` compiler option                      |
| [--cxflags](#-cxflags)       | Set `c/c++` compiler option                  |
| [--cxxflags](#-cxxflags)     | Set `c++` compiler option                    |
| [--mflags](#-mflags)         | Set `objc` compiler option                   |
| [--mxflags](#-mxflags)       | Set `objc/c++` compiler option               |
| [--mxxflags](#-mxxflags)     | Set `objc++` compiler option                 |
| [--scflags](#-scflags)       | Set `swift` compiler option                  |
| [--gcflags](#-gcflags)       | Set `golang` compiler option                 |
| [--dcflags](#-dcflags)       | Set `dlang` compiler option                  |
| [--rcflags](#-rcflags)       | Set `rust` compiler option                   |
| [--cuflags](#-cuflags)       | Set `cuda` compiler option                   |
| [--ldflags](#-ldflags)       | Set  linker option                           |
| [--shflags](#-shflags)       | Set  shared library linker option            |
| [--arflags](#-arflags)       | Set  static library archiver option          |

<p class="tip">
if you want to known more options, please run: `xmake f --help`。
</p>

#### --sdk

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

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir
$ xmake
```

xmake will detect the prefix: arm-linux- and add the include and library search directory automatically.

```
-I/home/toolchains_sdkdir/include -L/home/toolchains_sdkdir/lib
```

#### --bin

- Set the `bin` directory of toolchains

We need set it manually if the toolchains /bin directory is in other places, for example:

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --bin=/usr/opt/bin
$ xmake
```

<p class="tip">
Before v2.2.1 version, this parameter name is `--toolchains`, exists more ambiguous, so we changed to `--bin=` to set the bin directory.
</p>

#### --cross

- Set the prefix of compilation tools

For example, under the same toolchains directory at the same time, there are two different compilers:

```
/opt/bin
 - armv7-linux-gcc
 - aarch64-linux-gcc
```

If we want to use the `armv7-linux-gcc` compiler, we can run the following command:

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --bin=/opt/bin --cross=armv7-linux-
```

#### --as

- Set `asm` assembler

```bash
$ xmake f -p linux --sdk=/user/toolsdk --as=armv7-linux-as
```

If the 'AS' environment variable exists, it will use the values specified in the current environment variables.

<p class="tip">
We can set a unknown compiler as like-gcc/clang compiler, .e.g `xmake f --as=gcc@/home/xxx/asmips.exe`
</p>

#### --cc

- Set c compiler

```bash
$ xmake f -p linux --sdk=/user/toolsdk --cc=armv7-linux-clang
```

If the 'CC' environment variable exists, it will use the values specified in the current environment variables.

<p class="tip">
We can set a unknown compiler as like-gcc/clang compiler, .e.g `xmake f --cc=gcc@/home/xxx/ccmips.exe`
</p>

#### --cxx

- Set `c++` compiler

```bash
$ xmake f -p linux --sdk=/user/toolsdk --cxx=armv7-linux-clang++
```

If the 'CXX' environment variable exists, it will use the values specified in the current environment variables.

<p class="tip">
We can set a unknown compiler as like-gcc/clang compiler, .e.g `xmake f --cxx=g++@/home/xxx/c++mips.exe`
</p>

#### --ld

- Set `c/c++/objc/asm` linker

```bash
$ xmake f -p linux --sdk=/user/toolsdk --ld=armv7-linux-clang++
```

If the 'LD' environment variable exists, it will use the values specified in the current environment variables.

<p class="tip">
We can set a unknown compiler as like-gcc/clang linker, .e.g `xmake f --ld=g++@/home/xxx/c++mips.exe`
</p>

#### --sh

- Set `c/c++/objc/asm` shared library linker

```bash
$ xmake f -p linux --sdk=/user/toolsdk --sh=armv7-linux-clang++
```

If the 'SH' environment variable exists, it will use the values specified in the current environment variables.

<p class="tip">
We can set a unknown compiler as like-gcc/clang linker, .e.g `xmake f --sh=g++@/home/xxx/c++mips.exe`
</p>

#### --ar

- Set `c/c++/objc/asm` static library archiver

```bash
$ xmake f -p linux --sdk=/user/toolsdk --ar=armv7-linux-ar
```

If the 'AR' environment variable exists, it will use the values specified in the current environment variables.

<p class="tip">
We can set a unknown compiler as like-ar archiver, .e.g `xmake f --ar=ar@/home/xxx/armips.exe`
</p>

## Global Configuration

You can save to the global configuration for simplfying operation.

For example:

```bash
$ xmake g --ndk=~/files/android-ndk-r10e/
```

Now, we config and build project for android again.

```bash
$ xmake f -p android
$ xmake
```

<p class="tip">
    You can use short or long command option, for example: `xmake g` or `xmake global`.<br>
</p>

## Clean Configuration

We can clean all cached configuration and re-configure project.

```bash
$ xmake f -c
$ xmake
```

or

```bash
$ xmake f -p iphoneos -c
$ xmake
```

## Import and export configuration

After 2.5.5, we can also import and export the configured configuration set to facilitate rapid configuration migration.

### Export configuration

```console
$ xmake f --export=/tmp/config.txt
$ xmake f -m debug --xxx=y --export=/tmp/config.txt
```

### Import configuration

```console
$ xmake f --import=/tmp/config.txt
$ xmake f -m debug --xxx=y --import=/tmp/config.txt
```

### Export configuration (with menu)

```console
$ xmake f --menu --export=/tmp/config.txt
$ xmake f --menu -m debug --xxx=y --export=/tmp/config.txt
```


### Import configuration (with menu)

```console
$ xmake f --menu --import=/tmp/config.txt
$ xmake f --menu -m debug --xxx=y --import=/tmp/config.txt
```

## Environment variables

We can execute the following command to get all the environment variables used by xmake and the currently set values.

```console
$ xmake show -l envs
XMAKE_RAMDIR Set the ramdisk directory.
                        <empty>
XMAKE_GLOBALDIR Set the global config directory of xmake.
                        /Users/ruki/.xmake
XMAKE_ROOT Allow xmake to run under root.
                        <empty>
XMAKE_COLORTERM Set the color terminal environment.
                        <empty>
XMAKE_PKG_INSTALLDIR Set the install directory of packages.
                        <empty>
XMAKE_TMPDIR Set the temporary directory.
                        /var/folders/vn/ppcrrcm911v8b4510klg9xw80000gn/T/.xmake501/211104
XMAKE_PKG_CACHEDIR Set the cache directory of packages.
                        <empty>
XMAKE_PROGRAM_DIR Set the program scripts directory of xmake.
                        /Users/ruki/.local/share/xmake
XMAKE_PROFILE Start profiler, e.g. perf, trace.
                        <empty>
XMAKE_RCFILES Set the runtime configuration files.

XMAKE_CONFIGDIR Set the local config directory of project.
                        /Users/ruki/projects/personal/xmake-docs/.xmake/macosx/x86_64
XMAKE_LOGFILE Set the log output file path.
                        <empty>
```

### XMAKE_RAMDIR

- Set the ramdisk directory path

The ramdisk directory is the directory location of the memory file system. Usually the `os.tmpdir()` interface will use the temporary files used by xmake. If the user sets the ramdisk path, it will be stored in this first to improve the overall compilation speed.

### XMAKE_TMPDIR

- Set the user's temporary directory

By default, xmake will use `/tmp/.xmake` and `%TEMP%/.xmake`. Of course, users can modify the default path through this variable.

### XMAKE_CONFIGDIR

- Set local project configuration directory

The local compilation configuration of each project will be stored in the `.xmake` path in the root directory of the current project by default, and then differentiated according to different platforms and architectures, for example:

```console
.xmake/macosx/x86_64
```

If we don't want to store it in the root directory of the project, we can also set it to other paths ourselves, such as the build directory and so on.

### XMAKE_GLOBALDIR

- Set the root directory of the global configuration file

That is, the storage directory of the global configuration of `xmake g/global`, as well as other global files such as installation packages, caches, etc., will be stored in this directory by default.

The default path is: `~/.xmake`.

### XMAKE_ROOT

-Allow users to run in root mode

Usually xmake is forbidden to run under root by default, which is very insecure. But if the user has to run under root, he can also set this variable to force it on.

```console
export XMAKE_ROOT=y
```

### XMAKE_COLORTERM

- Set the color output of Terminal

Currently, these values ​​can be set:

| Value | Description |
| --- | --- |
| nocolor | Disable color output |
| color8 | 8-color output support |
| color256 | 256 color output support |
| truecolor | True color output support |

Generally, users don't need to set them, xmake will automatically detect the color range supported by the user terminal. If the user doesn't want to output colors, they can set nocolor to disable them globally.

Or use `xmake g --theme=plain` to disable it globally.

### XMAKE_PKG_INSTALLDIR

- Set the installation root directory of the dependent package

The default global directory for xmake's remote package installation is `~/.xmake/packages`, but users can also set this variable to modify it individually.

We can also use `xmake g --pkg_installdir=/xxx` to set it, the effect is the same.

### XMAKE_PKG_CACHEDIR

- Set the cache directory of dependent packages

The default path is in the `~/.xmake/cache` directory, which stores various cache files during the package installation process, which takes up more storage space, and the user can also set it separately.

Of course, xmake will automatically clean up all cache files of the previous month every month.

### XMAKE_PROGRAM_DIR

- Set the script directory of xmake

All lua scripts of xmake are installed with the installer. By default, they are in the installation directory. However, if you want to switch to the script directory you downloaded to facilitate local modification and debugging, you can set the this variable.

If you want to view the script directory currently used by xmake, you can execute:

```console
$ xmake l os.programdir
/Users/ruki/.local/share/xmake
```

### XMAKE_PROFILE

-Turn on performance analysis

This is only open to the developers of xmake, and is used to analyze the time-consuming situation of xmake running and track the calling process.

It has two modes, a performance analysis mode, which displays the time-consuming order of each function.

```console
$ XMAKE_PROFILE=perf xmake
[25%]: ccache compiling.release src/main.cpp
[50%]: linking.release test
[100%]: build ok!
 0.238, 97.93%, 1, runloop: @programdir/core/base/scheduler.lua: 805
 0.180, 74.04%, 25, _resume: [C]: -1
 0.015, 6.34%, 50, _co_groups_resume: @programdir/core/base/scheduler.lua: 299
 0.011, 4.37%, 48, wait: @programdir/core/base/poller.lua: 111
 0.004, 1.70%, 62, status: @programdir/core/base/scheduler.lua: 71
 0.004, 1.53%, 38, is_dead: @programdir/core/base/scheduler.lua: 76
 0.003, 1.44%, 50, next: @programdir/core/base/timer.lua: 74
 0.003, 1.33%, 48, delay: @programdir/core/base/timer.lua: 60
 0.002, 1.02%, 24, is_suspended: @programdir/core/base/scheduler.lua: 86
```

The other is to track the running process of xmake:

```console
$ XMAKE_PROFILE=trace xmake
func: @programdir/core/base/scheduler.lua: 457
is_suspended: @programdir/core/base/scheduler.lua: 86
status: @programdir/core/base/scheduler.lua: 71
thread: @programdir/core/base/scheduler.lua: 66
thread: @programdir/core/base/scheduler.lua: 66
length: @programdir/core/base/heap.lua: 120
```

### XMAKE_RCFILES

- Set up a global configuration file

We can set up some xmakerc.lua global configuration files, and introduce them globally when users compile the project, such as global introduction of some user-defined help scripts, tool chains and so on.

```console
$ export XMAKE_RCFILES=xmakerc.lua
$ xmake
```

If not set, the default path is: `~/.xmake/xmakerc.lua`.

### XMAKE_LOGFILE

- Set the log file path

By default, xmake will echo the output to the terminal. We can turn on the automatic log storage to the specified file by setting this path, but it will not affect the normal echo output of the terminal.

### XMAKE_MAIN_REPO

- Set the official package master warehouse address

xmake has built-in three main warehouse addresses by default, they are exactly the same, xmake will choose the best address to use according to the current network status.

```
https://github.com/xmake-io/xmake-repo.git
https://gitlab.com/tboox/xmake-repo.git
https://gitee.com/tboox/xmake-repo.git
```

However, if xmake chooses the wrong one, it may cause the warehouse download to fail. Through this environment variable, we can set and use the specified warehouse address by ourselves instead of automatically selecting it.

```console
$ export XMAKE_MAIN_REPO = https://github.com/xmake-io/xmake-repo.git
```

### XMAKE_BINARY_REPO

- Set the official package pre-compiled warehouse address

Similar to `XMAKE_MAIN_REPO`, the only difference is that this is used to switch the address of the pre-compiled warehouse.

```console
$ export XMAKE_MAIN_REPO = https://github.com/xmake-mirror/build-artifacts.git
```

### XMAKE_STATS

-Enable or disable user statistics

Since xmake is still in the early stages of development, we need to know the approximate user growth in order to provide us with the motivation to continue to update xmake.

Therefore, xmake defaults to the first project build every day, and it will automatically git clone an empty warehouse in the background process: https://github.com/xmake-io/xmake-stats

Then borrow the Traffic statistics chart provided by github itself to get the approximate number of users.

For each project, we will only count once a day, and will not disclose any user privacy, because there is only one additional git clone operation. In addition, we cloned an empty warehouse, which will not consume much user traffic.

Of course, not every user wants to do this, user has right to disable this behavior, we only need to set:

```console
export XMAKE_STATS=n
```

It can be completely disabled, and we will also automatically disable this behavior on ci.

When will it be removed?

This behavior will not exist forever. When xmake has enough users, or there are other better statistical methods, we will consider removing the relevant statistical code.

Of course, if a lot of user feedback is unwilling to accept it, we will also consider removing it.

For related issues about this, see: [#1795](https://github.com/xmake-io/xmake/issues/1795)
