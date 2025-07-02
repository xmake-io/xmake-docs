---
outline: deep
---

# 交叉编译 {#cross-compilation}

通常，如果我们需要在当前pc环境编译生成其他设备上才能运行的目标文件时候，就需要通过对应的交叉编译工具链来编译生成它们，比如在win/macos上编译linux的程序，或者在linux上编译其他嵌入式设备的目标文件等。

通常的交叉编译工具链都是基于gcc/clang的，大都具有类似如下的结构：

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

每个工具链都有对应的include/lib目录，用于放置一些系统库和头文件，比如libc, stdc++等，而bin目录下放置的就是编译工具链一系列工具。例如：

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

其中`arm-linux-armeabi-`前缀就是cross，通过用来标示目标平台和架构，主要用于跟主机自身的gcc/clang进行区分。

里面的gcc/g++就是c/c++的编译器，通常也可以作为链接器使用，链接的时候内部会去调用ld来链接，并且自动追加一些c++库。
cpp是预处理器，as是汇编器，ar用于生成静态库，strip用于裁剪掉一些符号信息，使得目标程序会更小。nm用于查看导出符号列表。

## 自动探测和编译

如果我们的交叉编译工具链是上述结构，xmake会自动检测识别这个sdk的结构，提取里面的cross，以便于include/lib路径位置，用户通常不需要做额外的参数设置，只需要配置好sdk根目录就可以编译了，例如：

```sh
$ xmake f -p cross --sdk=/home/toolchains_sdkdir
$ xmake
```

其中，`-p cross`用于指定当前的平台是交叉编译平台，`--sdk=`用于指定交叉工具链的根目录。

注：我们也可以指定`-p linux`平台来配置交叉编译，效果是一样的，唯一的区别是额外标识了linux平台名，方便xmake.lua里面通过`is_plat("linux")`来判断平台。

此时，xmake会去自动检测gcc等编译器的前缀cross：`arm-linux-armeabi-`，并且编译的时候，也会自动加上`链接库`和`头文件`的搜索选项，比如：

```
-I/home/toolchains_sdkdir/include
-L/home/toolchains_sdkdir/lib
```

这些都是xmake自动处理的，不需要手动配置它们。

## 手动配置编译

如果上面的自动检测对某些工具链，还无法完全通过编译，就需要用户自己手动设置一些交叉编译相关的配置参数，来调整适应这些特殊的工具链了，下面我会逐一讲解如何配置。

## 设置工具链bin目录

对于不规则工具链目录结构，单纯地设置[--sdk](#sdk)选项还不够，可以继续通过这个选项设置工具链的bin目录位置。

例如：一些特殊的交叉工具链的，编译器bin目录，并不在  `/home/toolchains_sdkdir/bin`  这个位置，而是独立到了  `/usr/opt/bin`

这个时候，我们可以在设置了sdk参数的基础上追加bin目录的参数设置，来调整工具链的bin目录。

```sh
$ xmake f -p cross --sdk=/home/toolchains_sdkdir --bin=/usr/opt/bin
$ xmake
```

## 设置交叉工具链工具前缀

像aarch64-linux-android-，通常如果你配置了--sdk或者--bin，xmake会自动检测的，不需要自己手动设置。

但是对于一些极特殊的工具链，一个目录下同时有多个cross前缀的工具bin混在一起的情况，你需要手动设置这个配置，来区分到底需要选用哪一个bin。

例如，toolchains的bin目录下同时存在两个不同的编译器：

```
/opt/bin
  - armv7-linux-gcc
  - aarch64-linux-gcc
```

我们现在想要选用armv7的版本，那么我们可以追加`--cross=`配置编译工具前缀名，例如：

```sh
$ xmake f -p cross --sdk=/usr/toolsdk --bin=/opt/bin --cross=armv7-linux-
```

## 设置c/c++编译器

如果还要继续细分选择编译器，则继续追加相关编译器选项，比如：

```sh
$ xmake f -p cross --sdk=/user/toolsdk --cc=armv7-linux-clang --cxx=armv7-linux-clang++
```

注意：如果存在CC/CXX环境变量的话，会优先使用当前环境变量中指定的值。

如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么编译器工具检测就会失败。

这个时候我们可以通过：

```sh
xmake f --cxx=clang++@/home/xxx/c++mips.exe
```

设置c++mips.exe编译器作为类clang++的使用方式来编译。

也就是说，在指定编译器为`c++mips.exe`的同时，告诉xmake，它跟clang++用法和参数选项基本相同。

## 设置c/c++链接器

如果还要继续细分选择链接器，则继续追加相关链接器选项，比如：

```sh
$ xmake f -p cross --sdk=/user/toolsdk --ld=armv7-linux-clang++ --sh=armv7-linux-clang++ --ar=armv7-linux-ar
```

ld指定可执行程序链接器，sh指定共享库程序链接器，ar指定生成静态库的归档器。

注意：如果存在LD/SH/AR环境变量的话，会优先使用当前环境变量中指定的值。

## 设置头文件和库搜索目录

如果sdk里面还有额外的其他include/lib目录不在标准的结构中，导致交叉编译找不到库和头文件，那么我们可以通过`--includedirs`和`--linkdirs`来追加搜索路径，然后通过`--links`添加额外的链接库。

```sh
$ xmake f -p cross --sdk=/usr/toolsdk --includedirs=/usr/toolsdk/xxx/include --linkdirs=/usr/toolsdk/xxx/lib --links=pthread
```

注意：如果要指定多个搜索目录，可以通过`:`或者`;`来分割，也就是不同主机平台的路径分隔符，linux/macos下用`:`，win下用`;`。

## 设置编译和链接选项

我们也可以根据实际情况通过`--cflags`, `--cxxflags`，`--ldflags`，`--shflags`和`--arflags`额外配置一些编译和链接选项。

* cflags: 指定c编译参数
* cxxflags：指定c++编译参数
* cxflags: 指定c/c++编译参数
* asflags: 指定汇编器编译参数
* ldflags: 指定可执行程序链接参数
* shflags: 指定动态库程序链接参数
* arflags: 指定静态库的生成参数

例如：

```sh
$ xmake f -p cross --sdk=/usr/toolsdk --cflags="-DTEST -I/xxx/xxx" --ldflags="-lpthread"
```

## 自定义编译平台

如果某个交叉工具链编译后目标程序有对应的平台需要指定，并且需要在xmake.lua里面根据不同交叉编译平台，还需要配置一些额外的编译参数，那么上文的`-p cross`设置就不能满足需求了。

通过这种方式，xmake就可以很方便的扩展处理各种编译平台，用户可以自己扩展支持freebsd, netbsd, sunos等其他各种平台的交叉编译。

我摘录一段之前移植libuv写的交叉编译的配置，直观感受下：

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

然后，我们就可以切换这些平台来编译：

```sh
$ xmake f -p [dragonfly|freebsd|netbsd|openbsd|sunos] --sdk=/home/arm-xxx-gcc/
$ xmake
```

另外，内置的linux平台也是支持交叉编译的哦，如果不想配置其他平台名，统一作为linux平台来交叉编译，也是可以的。

```sh
$ xmake f -p linux --sdk=/usr/local/arm-xxx-gcc/
$ xmake
```

只要设置了`--sdk=`等参数，就会启用linux平台的交叉编译模式。

## 常用工具链配置

完整的工具链列表，请执行下面的命令查看：

```sh
$ xmake show -l toolchains
```

::: tip 注意
此特性需要v2.3.4以上版本才支持
:::

上文讲述的是通用的交叉编译工具链配置，如果一些特定的工具链需要额外传入`--ldflags/--includedirs`等场景就比较繁琐了,
因此xmake也内置了一些常用工具链，可以省去交叉编译工具链复杂的配置过程，只需要执行：

```sh
$ xmake f --toolchain=gnu-rm --sdk=/xxx/
$ xmake
```

就可以快速切换的指定的交叉编译工具链，如果这个工具链需要追加一些特定的flags设置，也会自动设置好，简化配置。

其中，gnu-rm就是内置的GNU Arm Embedded Toolchain。

比如，我们也可以快速从gcc工具链整体切换到clang或者llvm工具链，不再需要`xmake f --cc=clang --cxx=clang --ld=clang++`等挨个配置了。

```sh
$ xmake f --toolchain=clang
$ xmake
```

或者

```sh
$ xmake f --toolchain=llvm --sdk=/xxx/llvm
$ xmake
```

具体xmake支持哪些工具链，可以通过下面的命令查看：

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

### 自定义工具链

另外，我们也可以在xmake.lua中自定义toolchain，然后通过`xmake f --toolchain=myclang`指定切换，例如：

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

    -- ...
```

关于这块的详情介绍，可以到[自定义工具链](/zh/api/description/custom-toolchain)章节查看

更多详情见：[#780](https://github.com/xmake-io/xmake/issues/780)

### MingW 工具链

使用mingw工具链编译，其实也是交叉编译，但是由于这个比较常用，xmake专门增加了一个mingw的平台来快速处理使用mingw工具链的编译。

因此，xmake对mingw的工具链检测会更加完善，在macos下，基本上连sdk路径都不需要配置，也能直接检测到，只需要切到mingw平台编译即可。

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

这里我们追加了`-v`参数，看了下详细的编译命令和检测到的mingw工具链配置值，其中cross被自动检测为：`x86_64-w64-mingw32-`，bin目录也被自动检测到了，还有编译器和链接器也是。

尽管在linux/win上还没法自动检测到sdk路径，我们也可以手动指定sdk路径，需要注意的是，xmake为mingw专门提供了一个`--mingw=`参数用来指定mingw的工具链根目录，其效果跟`--sdk=`是一样的，但是它可以作为全局配置被设置。

```sh
$ xmake g --mingw=/home/mingwsdk
$ xmake f -p mingw
$ xmake
```

我们通过`xmake g/global`命令设置`--mingw`根目录到全局配置后，之后每次编译和切换编译平台，就不用额外指定mingw工具链路径了，方便使用。

另外，其他的工具链配置参数用法，跟上文描述的没什么区别，像`--cross`, `--bin=`等都可以根据实际的环境需要，自己控制是否需要额外追加配置来适配自己的mingw工具链。

xmake 还支持 llvm-mingw 工具链，可以切换到 arm/arm64 架构来编译。

```sh
$ xmake f --mingw=/xxx/llvm-mingw -a arm64
$ xmake
```

### LLVM 工具链

llvm工具链下载地址：https://releases.llvm.org/

```sh
$ xmake f -p cross --toolchain=llvm --sdk="C:\Program Files\LLVM"
$ xmake
```

### GNU-RM 工具链

工具链地址：https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads#

```sh
$ xmake f -p cross --toolchain=gnu-rm --sdk=/xxx/cc-arm-none-eabi-9-2019-q4-major
$ xmake
```

### TinyC 工具链

```sh
$ xmake f --toolchain=tinyc
$ xmake
```

::: tip 注意
Releases目录下，我们还提供了特殊的 xmake-tinyc-vX.X.X.win32.exe 安装包，内置tinyc工具链，无需依赖msvc，也可以编译c代码，开箱即用无依赖。
:::

### Emcc 工具链

通常只需要切换到 Wasm 平台，里面内置了 emcc 工具链，还会额外调整目标程序的扩展名为 `*.html` 以及输出 `*.wasm`。

```sh
$ xmake f -p wasm
$ xmake
```

不过我们也能够直接切换到 emcc 工具链，但是后缀名不会被修改。

```sh
$ xmake f --toolchain=emcc
$ xmake
```

### Intel C++ 编译工具链

```sh
$ xmake f --toolchain=icc
$ xmake
```

### Intel Fortran 编译工具链

```sh
$ xmake f --toolchain=ifort
$ xmake
```

## 通用交叉编译配置

| 参数名                       | 描述                             |
| ---------------------------- | -------------------------------- |
| [--sdk](#-sdk)               | 设置交叉工具链的sdk根目录        |
| [--bin](#-bin)               | 设置工具链bin目录                |
| [--cross](#-cross)           | 设置交叉工具链工具前缀           |
| [--as](#-as)                 | 设置`asm`汇编器                  |
| [--cc](#-cc)                 | 设置`c`编译器                    |
| [--cxx](#-cxx)               | 设置`c++`编译器                  |
| [--mm](#-mm)                 | 设置`objc`编译器                 |
| [--mxx](#-mxx)               | 设置`objc++`编译器               |
| [--sc](#-sc)                 | 设置`swift`编译器                |
| [--gc](#-gc)                 | 设置`golang`编译器               |
| [--dc](#-dc)                 | 设置`dlang`编译器                |
| [--rc](#-rc)                 | 设置`rust`编译器                 |
| [--cu](#-cu)                 | 设置`cuda`编译器                 |
| [--ld](#-ld)                 | 设置`c/c++/objc/asm`链接器       |
| [--sh](#-sh)                 | 设置`c/c++/objc/asm`共享库链接器 |
| [--ar](#-ar)                 | 设置`c/c++/objc/asm`静态库归档器 |
| [--scld](#-scld)             | 设置`swift`链接器                |
| [--scsh](#-scsh)             | 设置`swift`共享库链接器          |
| [--gcld](#-gcld)             | 设置`golang`链接器               |
| [--gcar](#-gcar)             | 设置`golang`静态库归档器         |
| [--dcld](#-dcld)             | 设置`dlang`链接器                |
| [--dcsh](#-dcsh)             | 设置`dlang`共享库链接器          |
| [--dcar](#-dcar)             | 设置`dlang`静态库归档器          |
| [--rcld](#-rcld)             | 设置`rust`链接器                 |
| [--rcsh](#-rcsh)             | 设置`rust`共享库链接器           |
| [--rcar](#-rcar)             | 设置`rust`静态库归档器           |
| [--cu-ccbin](#-cu-ccbin)     | 设置`cuda` host编译器            |
| [--culd](#-culd)             | 设置`cuda`链接器                 |
| [--asflags](#-asflags)       | 设置`asm`汇编编译选项            |
| [--cflags](#-cflags)         | 设置`c`编译选项                  |
| [--cxflags](#-cxflags)       | 设置`c/c++`编译选项              |
| [--cxxflags](#-cxxflags)     | 设置`c++`编译选项                |
| [--mflags](#-mflags)         | 设置`objc`编译选项               |
| [--mxflags](#-mxflags)       | 设置`objc/c++`编译选项           |
| [--mxxflags](#-mxxflags)     | 设置`objc++`编译选项             |
| [--scflags](#-scflags)       | 设置`swift`编译选项              |
| [--gcflags](#-gcflags)       | 设置`golang`编译选项             |
| [--dcflags](#-dcflags)       | 设置`dlang`编译选项              |
| [--rcflags](#-rcflags)       | 设置`rust`编译选项               |
| [--cuflags](#-cuflags)       | 设置`cuda`编译选项               |
| [--ldflags](#-ldflags)       | 设置链接选项                     |
| [--shflags](#-shflags)       | 设置共享库链接选项               |
| [--arflags](#-arflags)       | 设置静态库归档选项               |

::: tip 注意
如果你想要了解更多参数选项，请运行: `xmake f --help`。
:::

### --sdk

- 设置交叉工具链的sdk根目录

大部分情况下，都不需要配置很复杂的toolchains前缀，例如：`arm-linux-` 什么的

只要这个工具链的sdk目录满足如下结构（大部分的交叉工具链都是这个结构）：

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

那么，使用xmake进行交叉编译的时候，只需要进行如下配置和编译：

```sh
$ xmake f -p linux --sdk=/home/toolchains_sdkdir
$ xmake
```

这个时候，xmake会去自动探测，gcc等编译器的前缀名：`arm-linux-`，并且编译的时候，也会自动加上`链接库`和`头文件`的搜索选项，例如：

```
-I/home/toolchains_sdkdir/include -L/home/toolchains_sdkdir/lib
```

这些都是xmake自动处理的，不需要手动配置它们。

### --bin

- 设置工具链bin目录

对于不规则工具链目录结构，单纯地设置[--sdk](#-sdk)选项还不够，可以继续通过这个选项设置工具链的bin目录位置。

例如：一些特殊的交叉工具链的，编译器bin目录，并不在 `/home/toolchains_sdkdir/bin` 这个位置，而是独立到了 `/usr/opt/bin`

```sh
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --bin=/usr/opt/bin
$ xmake
```

::: tip 注意
v2.2.1版本之前，这个参数名是`--toolchains`，比较有歧义，因此新版本中，统一改成`--bin=`来设置bin目录。
:::

### --cross

- 设置交叉工具链工具前缀

像`aarch64-linux-android-`这种，通常如果你配置了[--sdk](#-sdk)或者[--bin](#-bin)的情况下，xmake会去自动检测的，不需要自己手动设置。

但是对于一些极特殊的工具链，一个目录下同时有多个cross前缀的工具bin混在一起的情况，你需要手动设置这个配置，来区分到底需要选用哪一个bin。

例如，toolchains的bin目录下同时存在两个不同的编译器：

```
/opt/bin
 - armv7-linux-gcc
 - aarch64-linux-gcc
```

我们现在想要选用armv7的版本，则配置如下：

```sh
$ xmake f -p linux --sdk=/usr/toolsdk --bin=/opt/bin --cross=armv7-linux-
```

### --as

- 设置`asm`汇编器

如果还要继续细分选择编译器，则继续追加相关编译器选项，例如：

```sh
$ xmake f -p linux --sdk=/user/toolsdk --as=armv7-linux-as
```

如果存在`AS`环境变量的话，会优先使用当前环境变量中指定的值。

::: tip 注意
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么编译器工具检测就会失败。
这个时候我们可以通过：`xmake f --as=gcc@/home/xxx/asmips.exe` 设置ccmips.exe编译器作为类gcc的使用方式来编译。
也就是说，在指定编译器为`asmips.exe`的同时，告诉xmake，它跟gcc用法和参数选项基本相同。
:::

### --cc

- 设置c编译器

如果还要继续细分选择编译器，则继续追加相关编译器选项，例如：

```sh
$ xmake f -p linux --sdk=/user/toolsdk --cc=armv7-linux-clang
```

如果存在`CC`环境变量的话，会优先使用当前环境变量中指定的值。

::: tip 注意
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么编译器工具检测就会失败。
这个时候我们可以通过：`xmake f --cc=gcc@/home/xxx/ccmips.exe` 设置ccmips.exe编译器作为类gcc的使用方式来编译。
也就是说，在指定编译器为`ccmips.exe`的同时，告诉xmake，它跟gcc用法和参数选项基本相同。
:::

### --cxx

- 设置`c++`编译器

如果还要继续细分选择编译器，则继续追加相关编译器选项，例如：

```sh
$ xmake f -p linux --sdk=/user/toolsdk --cxx=armv7-linux-clang++
```

如果存在`CXX`环境变量的话，会优先使用当前环境变量中指定的值。

::: tip 注意
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么编译器工具检测就会失败。
这个时候我们可以通过：`xmake f --cxx=clang++@/home/xxx/c++mips.exe` 设置c++mips.exe编译器作为类clang++的使用方式来编译。
也就是说，在指定编译器为`c++mips.exe`的同时，告诉xmake，它跟clang++用法和参数选项基本相同。
:::

### --ld

- 设置`c/c++/objc/asm`链接器

如果还要继续细分选择链接器，则继续追加相关编译器选项，例如：

```sh
$ xmake f -p linux --sdk=/user/toolsdk --ld=armv7-linux-clang++
```

如果存在`LD`环境变量的话，会优先使用当前环境变量中指定的值。

::: tip 注意
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么链接器工具检测就会失败。
这个时候我们可以通过：`xmake f --ld=g++@/home/xxx/c++mips.exe` 设置c++mips.exe链接器作为类g++的使用方式来编译。
也就是说，在指定链接器为`c++mips.exe`的同时，告诉xmake，它跟g++用法和参数选项基本相同。
:::

### --sh

- 设置`c/c++/objc/asm`共享库链接器

```sh
$ xmake f -p linux --sdk=/user/toolsdk --sh=armv7-linux-clang++
```

如果存在`SH`环境变量的话，会优先使用当前环境变量中指定的值。

::: tip 注意
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么链接器工具检测就会失败。
这个时候我们可以通过：`xmake f --sh=g++@/home/xxx/c++mips.exe` 设置c++mips.exe链接器作为类g++的使用方式来编译。
也就是说，在指定链接器为`c++mips.exe`的同时，告诉xmake，它跟g++用法和参数选项基本相同。
:::

### --ar

- 设置`c/c++/objc/asm`静态库归档器

```sh
$ xmake f -p linux --sdk=/user/toolsdk --ar=armv7-linux-ar
```

如果存在`AR`环境变量的话，会优先使用当前环境变量中指定的值。

::: tip 注意
如果指定的编译器名不是那些xmake内置可识别的名字（带有ar等字样），那么链接器工具检测就会失败。
这个时候我们可以通过：`xmake f --ar=ar@/home/xxx/armips.exe` 设置armips.exe链接器作为类ar的使用方式来编译。
也就是说，在指定链接器为`armips.exe`的同时，告诉xmake，它跟ar用法和参数选项基本相同。
:::
