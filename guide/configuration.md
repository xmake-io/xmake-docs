
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
    
<p class="tip">
Please attempt to set `--arch=` option if it had failed to check compiler.
</p>

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

```bash
$ xmake f -p mingw --sdk=/usr/local/i386-mingw32-4.3.0/ [-a i386|x86_64]
$ xmake
``` 

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

### MingW Toolchain

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

### LLVM Toolchain

The tool chain of llvm is relatively standard, only need to set the sdk configuration path to use:

```bash
$ xmake f -p cross --sdk="C:\Program Files\LLVM"
$ xmake
```

### Project description settings

#### set_toolchain

If you feel that it is more complicated to configure through the command line each time, some configurations can be pre-configured in xmake.lua to simplify the command configuration. For example, the specification of the compiler can be set individually for each target through set_toolchain.

```lua
target("test")
    set_kind("binary")
    set_toolchain("cxx", "clang")
    set_toolchain("ld", "clang++")
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

### Cross Compilation Arguments

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
| [--sc-ld](#-sc-ld)           | Set `swift` linker                           |
| [--sc-sh](#-sc-sh)           | Set `swift` shared library linker            |
| [--gc-ld](#-gc-ld)           | Set `golang` linker                          |
| [--gc-ar](#-gc-ar)           | Set `golang` static library archiver         |
| [--dc-ld](#-dc-ld)           | Set `dlang` linker                           |
| [--dc-sh](#-dc-sh)           | Set `dlang` shared library linker            |
| [--dc-ar](#-dc-ar)           | Set `dlang` static library archiver          |
| [--rc-ld](#-rc-ld)           | Set `rust` linker                            |
| [--rc-sh](#-rc-sh)           | Set `rust` shared library linker             |
| [--rc-ar](#-rc-ar)           | Set `rust` static library archiver           |
| [--cu-cxx](#-cu-cxx)         | Set `cuda` host compiler                     |
| [--cu-ld](#-cu-ld)           | Set `cuda` linker                            |
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

