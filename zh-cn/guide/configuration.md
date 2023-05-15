
通过`xmake f|config`配置命令，设置构建前的相关配置信息，详细参数选项，请运行: `xmake f --help`。

<p class="tip">
    你可以使用命令行缩写来简化输入，也可以使用全名，例如: <br>
    `xmake f` 或者 `xmake config`.<br>
    `xmake f -p linux` 或者 `xmake config --plat=linux`.
</p>

## 目标平台

### 主机平台

```bash
$ xmake
```

!> xmake将会自动探测当前主机平台，默认自动生成对应的目标程序。

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

如果要手动指定ndk中具体某个工具链，而不是使用默认检测的配置，可以通过[--bin](#-bin)来设置，例如：

```bash
$ xmake f -p android --ndk=~/files/android-ndk-r10e/ -a arm64-v8a --bin=~/files/android-ndk-r10e/toolchains/aarch64-linux-android-4.9/prebuilt/darwin-x86_64/bin
```

[--bin](#-bin)主要用于设置选择编译工具的具体bin目录，这个的使用跟[交叉编译](#交叉编译)中的[--bin](#-bin)的行为是一致的。

!> 如果手动设置了bin目录，没有通过检测，可以看下是否`--arch=`参数没有匹配对。

### iPhoneOS

```bash
$ xmake f -p iphoneos [-a armv7|armv7s|arm64|i386|x86_64]
$ xmake
```

由于 m1 设备上模拟器也支持 arm64 架构，因此之前单纯从 arch 去区分是否为模拟器，已无法满足需求。
因此，2.6.5 版本，我们新增了一个参数配置去区分是否为模拟器目标。

```bash
$ xmake f -p iphoneos --appledev=simulator
$ xmake f -p watchos --appledev=simulator
$ xmake f -p appletvos --appledev=simulator
```

### Mac Catalyst

我们也可以指定构建 Mac Catalyst 程序。

```bash
$ xmake f --appledev=catalyst
```

### Windows

```bash
$ xmake f -p windows [-a x86|x64]
$ xmake
```

### Mingw

xmake 除了支持 Msys2/MingW, MingW for macOS/linux 之外，还支持 llvm-mingw 工具链，可以切换 arm/arm64 架构来编译。

```bash
$ xmake f -p mingw --sdk=/usr/local/i386-mingw32-4.3.0/ [-a i386|x86_64|arm|arm64]
$ xmake
```

### Apple WatchOS

```bash
$ xmake f -p watchos [-a i386|armv7k]
$ xmake
```

### Wasm (WebAssembly)

此平台用于编译 WebAssembly 程序（内部会使用emcc工具链），在切换此平台之前，我们需要先进入 Emscripten 工具链环境，确保 emcc 等编译器可用。

```bash
$ xmake f -p wasm
$ xmake
```

xmake 也支持 Qt for wasm 编译，只需要：

```bash
$ xmake f -p wasm [--qt=~/Qt]
$ xmake
```

其中 `--qt` 参数设置是可选的，通常xmake都能检测到qt的sdk路径。


需要注意的一点是，Emscripten 和 Qt SDK 的版本是有对应关系的，不匹配的版本，可能会有Qt/Wasm之间的兼容问题。

关于版本对应关系，可以看下：[https://wiki.qt.io/Qt_for_WebAssembly](https://wiki.qt.io/Qt_for_WebAssembly)

更多详情见：[https://github.com/xmake-io/xmake/issues/956](https://github.com/xmake-io/xmake/issues/956)

除了 emscripten 以外，还有一个常用的wasm工具链 wasi-sdk，用于构建基于wasi的程序，我们仅仅只需要切换工具链即可。

```console
$ xmake f -p wasm --toolchain=wasi
$ xmake
```

## 交叉编译配置

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

每个工具链都有对应的include/lib目录，用于放置一些系统库和头文件，例如libc, stdc++等，而bin目录下放置的就是编译工具链一系列工具。例如：

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
cpp是预处理器，as是汇编器，ar用于生成静态库，strip用于裁剪掉一些符号信息，使得目标程序会更加的小。nm用于查看导出符号列表。

### 自动探测和编译

如果我们的交叉编译工具链是上文的结构，xmake会自动检测识别这个sdk的结构，提取里面的cross，以及include/lib路径位置，用户通常不需要做额外的参数设置，只需要配置好sdk根目录就可以编译了，例如：

```bash
$ xmake f -p cross --sdk=/home/toolchains_sdkdir
$ xmake
```

其中，`-p cross`用于指定当前的平台是交叉编译平台，`--sdk=`用于指定交叉工具链的根目录。

注：我们也可以指定`-p linux`平台来配置交叉编译，效果是一样的，唯一的区别是额外标识了linux平台名，方便xmake.lua里面通过`is_plat("linux")`来判断平台。

这个时候，xmake会去自动探测gcc等编译器的前缀名cross：`arm-linux-armeabi-`，并且编译的时候，也会自动加上`链接库`和`头文件`的搜索选项，例如：

```
-I/home/toolchains_sdkdir/include
-L/home/toolchains_sdkdir/lib
```

这些都是xmake自动处理的，不需要手动配置他们。

### 手动配置编译

如果上面的自动检测对某些工具链，还无法完全通过编译，就需要用户自己手动设置一些交叉编译相关的配置参数，来调整适应这些特殊的工具链了，下面我会逐一讲解如何配置。

### 设置工具链bin目录

对于不规则工具链目录结构，靠单纯地[--sdk](https://xmake.io/#/zh-cn/guide/configuration?id=-sdk)选项设置，没法完全检测通过的情况下，可以通过这个选项继续附加设置工具链的bin目录位置。

例如：一些特殊的交叉工具链的，编译器bin目录，并不在  `/home/toolchains_sdkdir/bin`  这个位置，而是独立到了  `/usr/opt/bin`

这个时候，我们可以在设置了sdk参数的基础上追加bin目录的参数设置，来调整工具链的bin目录。

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --bin=/usr/opt/bin
$ xmake
```

### 设置交叉工具链工具前缀

像aarch64-linux-android-这种，通常如果你配置了--sdk或者--bin的情况下，xmake会去自动检测的，不需要自己手动设置。

但是对于一些极特殊的工具链，一个目录下同时有多个cross前缀的工具bin混在一起的情况，你需要手动设置这个配置，来区分到底需要选用哪个bin。

例如，toolchains的bin目录下同时存在两个不同的编译器：

```
/opt/bin
  - armv7-linux-gcc
  - aarch64-linux-gcc
```

我们现在想要选用armv7的版本，那么我们可以追加`--cross=`配置编译工具前缀名，例如：

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --bin=/opt/bin --cross=armv7-linux-
```

### 设置c/c++编译器

如果还要继续细分选择编译器，则继续追加相关编译器选项，例如：

```bash
$ xmake f -p linux --sdk=/user/toolsdk --cc=armv7-linux-clang --cxx=armv7-linux-clang++
```

当然，我们也可以指定编译器全路径。

`--cc`用于指定c编译器名，`--cxx`用于指定c++编译器名。

注：如果存在CC/CXX环境变量的话，会优先使用当前环境变量中指定的值。

如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么编译器工具检测就会失败。

这个时候我们可以通过：

```bash
xmake f --cxx=clang++@/home/xxx/c++mips.exe
```

设置c++mips.exe编译器作为类clang++的使用方式来编译。

也就是说，在指定编译器为`c++mips.exe`的同时，告诉xmake，它跟clang++用法和参数选项基本相同。

### 设置c/c++链接器

如果还要继续细分选择链接器，则继续追加相关链接器选项，例如：

```bash
$ xmake f -p linux --sdk=/user/toolsdk --ld=armv7-linux-clang++ --sh=armv7-linux-clang++ --ar=armv7-linux-ar
```

ld指定可执行程序链接器，sh指定共享库程序链接器，ar指定生成静态库的归档器。

注：如果存在LD/SH/AR环境变量的话，会优先使用当前环境变量中指定的值。

### 设置头文件和库搜索目录

如果sdk里面还有额外的其他include/lib目录不在标准的结构中，导致交叉编译找不到库和头文件，那么我们可以通过`--includedirs`和`--linkdirs`来追加搜索路径，然后通过`--links`添加额外的链接库。

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --includedirs=/usr/toolsdk/xxx/include --linkdirs=/usr/toolsdk/xxx/lib --links=pthread
```

注：如果要指定多个搜索目录，可以通过`:`或者`;`来分割，也就是不同主机平台的路径分隔符，linux/macos下用`:`，win下用`;`。

### 设置编译和链接选项

我们也可以根据实际情况通过`--cflags`, `--cxxflags`，`--ldflags`，`--shflags`和`--arflags`额外配置一些编译和链接选项。

* cflags: 指定c编译参数
* cxxflags：指定c++编译参数
* cxflags: 指定c/c++编译参数
* asflags: 指定汇编器编译参数
* ldflags: 指定可执行程序链接参数
* shflags: 指定动态库程序链接参数
* arflags: 指定静态库的生成参数

例如：

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --cflags="-DTEST -I/xxx/xxx" --ldflags="-lpthread"
```

### 项目描述设置

#### set_toolchains

这对某个特定的target单独切换设置不同的工具链，和set_toolset不同的是，此接口是对完整工具链的整体切换，比如cc/ld/sh等一系列工具集。

这也是推荐做法，因为像gcc/clang等大部分编译工具链，编译器和链接器都是配套使用的，要切就得整体切，单独零散的切换设置会很繁琐。

比如我们切换test目标到clang+yasm两个工具链：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("clang", "yasm")
```

#### set_toolset

如果觉得每次通过命令行配置比较繁琐，有些配置可以通过在xmake.lua预先配置好，来简化命令配置，比如编译器的指定，就可以通过`set_toolset`来对每个target单独设置。

```lua
target("test")
    set_kind("binary")
    set_toolset("cxx", "clang")
    set_toolset("ld", "clang++")
```

强制test目标的编译器和链接器使用clang编译器，或者指定交叉编译工具链中的编译器名或者路径。

#### set_config

我们也可以通过`set_config`来设置在`xmake f/config`命令中的每个配置参数的默认值，这是个全局api，对每个target都会生效。

```lua
set_config("cflags", "-DTEST")
set_config("sdk", "/home/xxx/tooksdk")
set_config("cc", "gcc")
set_config("ld", "g++")
```

不过，我们还是可以通过`xmake f --name=value`的方式，去修改xmake.lua中的默认配置。

### 自定义编译平台

如果某个交叉工具链编译后目标程序有对应的平台需要指定，并且需要在xmake.lua里面根据不同的交叉编译平台，还需要配置一些额外的编译参数，那么上文的`-p cross`设置就不能满足需求了。

其实，`-p/--plat=`参数也可以设置为其他自定义的值，只需要跟`is_plat`保持对应关系就可以，所有非内置平台名，都会默认采用交叉编译模式，例如：

```bash
$ xmake f -p myplat --sdk=/usr/local/arm-xxx-gcc/
$ xmake
```

我们传入了myplat自定义平台名，作为当前交叉工具链的编译平台，然后xmake.lua里面我们对这个平台，配置下对应的设置：

```lua
if is_plat("myplat") then
    add_defines("TEST")
end
```

通过这种方式，xmake就可以很方便的扩展处理各种编译平台，用户可以自己扩展支持freebsd, netbsd, sunos等其他各种平台的交叉编译。

我摘录一段之前移植libuv写的交叉编译的配置，直观感受下：

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

然后，我们就可以切换这些平台来编译：

```bash
$ xmake f -p [gragonfly|freebsd|netbsd|openbsd|sunos] --sdk=/home/arm-xxx-gcc/
$ xmake
```

另外，内置的linux平台也是支持交叉编译的哦，如果不想配置其他平台名，统一作为linux平台来交叉编译，也是可以的。

```bash
$ xmake f -p linux --sdk=/usr/local/arm-xxx-gcc/
$ xmake
```

只要设置了`--sdk=`等参数，就会启用linux平台的交叉编译模式。

### 常用工具链配置

完整的工具链列表，请执行下面的命令查看：

```bash
$ xmake show -l toolchains
```

!> 此特性需要v2.3.4以上版本才支持

上文讲述的是通用的交叉编译工具链配置，如果一些特定的工具链需要额外传入`--ldflags/--includedirs`等场景就比较繁琐了,
因此xmake也内置了一些常用工具链，可以省去交叉编译工具链复杂的配置过程，只需要执行：

```bash
$ xmake f --toolchain=gnu-rm --sdk=/xxx/
$ xmake
```

就可以快速切换的指定的交叉编译工具链，如果这个工具链需要追加一些特定的flags设置，也会自动设置好，简化配置。

其中，gnu-rm就是内置的GNU Arm Embedded Toolchain。

比如，我们也可以快速从gcc工具链整体切换到clang或者llvm工具链，不再需要`xmake f --cc=clang --cxx=clang --ld=clang++`等挨个配置了。

```bash
$ xmake f --toolchain=clang
$ xmake
```

或者

```bash
$ xmake f --toolchain=llvm --sdk=/xxx/llvm
$ xmake
```

具体xmake支持哪些工具链，可以通过下面的命令查看：

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

#### 自定义工具链

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

关于这块的详情介绍，可以到[自定义工具链](/zh-cn/manual/custom_toolchain)章节查看

更多详情见：[#780](https://github.com/xmake-io/xmake/issues/780)

#### MingW 工具链

使用mingw工具链编译，其实也是交叉编译，但是由于这个比较常用，xmake专门增加了一个mingw的平台来快速处理使用mingw工具链的编译。

因此，xmake对mingw的工具链检测会更加完善，在macos下，基本上连sdk路径都不需要配置，也能直接检测到，只需要切到mingw平台编译即可。

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
[  0%]: cache compiling.release src/main.cpp
/usr/local/bin/ccache /usr/local/opt/mingw-w64/bin/x86_64-w64-mingw32-gcc -c -fvisibility=hidden -O3 -m64 -o build/.objs/test/mingw/x86_64/release/src/main.cpp.obj src/main.cpp
[100%]: linking.release test.exe
/usr/local/opt/mingw-w64/bin/x86_64-w64-mingw32-g++ -o build/mingw/x86_64/release/test.exe build/.objs/test/mingw/x86_64/release/src/main.cpp.obj -s -fvisibility=hidden -m64
build ok!
```

这里我们追加了`-v`参数，看了下详细的编译命令和检测到的mingw工具链配置值，其中cross被自动检测为：`x86_64-w64-mingw32-`，bin目录也被自动检测到了，还有编译器和链接器也是。

尽管在linux/win上还没法自动检测到sdk路径，我们也可以手动指定sdk路径，需要注意的是，xmake为mingw专门提供了一个`--mingw=`参数用来指定mingw的工具链根目录，其效果跟`--sdk=`是一样的，但是它可以作为全局配置被设置。

```bash
$ xmake g --mingw=/home/mingwsdk
$ xmake f -p mingw
$ xmake
```

我们通过`xmake g/global`命令设置`--mingw`根目录到全局配置后，之后每次编译和切换编译平台，就不用额外指定mingw工具链路径了，方便使用。

另外，其他的工具链配置参数用法，跟上文描述的没什么区别，像`--cross`, `--bin=`等都可以根据实际的环境需要，自己控制是否需要额外追加配置来适配自己的mingw工具链。

xmake 还支持 llvm-mingw 工具链，可以切换到 arm/arm64 架构来编译。

```bash
$ xmake f --mingw=/xxx/llvm-mingw -a arm64
$ xmake
```

#### LLVM 工具链

llvm工具链下载地址：https://releases.llvm.org/

```bash
$ xmake f -p cross --toolchain=llvm --sdk="C:\Program Files\LLVM"
$ xmake
```

#### GNU-RM 工具链

工具链地址：https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm/downloads#

```bash
$ xmake f -p cross --toolchain=gnu-rm --sdk=/xxx/cc-arm-none-eabi-9-2019-q4-major
$ xmake
```

#### TinyC 工具链

```bash
$ xmake f --toolchain=tinyc
$ xmake
```

!> Releases目录下，我们还提供了特殊的 xmake-tinyc-vX.X.X.win32.exe 安装包，内置tinyc工具链，无需依赖msvc，也可以编译c代码，开箱即用无依赖。

#### Emcc 工具链

通常只需要切换到 Wasm 平台，里面内置了 emcc 工具链，还会额外调整目标程序的扩展名为 `*.html` 以及输出 `*.wasm`。

```bash
$ xmake f -p wasm
$ xmake
```

不过我们也能够直接切换到 emcc 工具链，但是后缀名不会被修改。

```bash
$ xmake f --toolchain=emcc
$ xmake
```

#### Intel C++ 编译工具链

```bash
$ xmake f --toolchain=icc
$ xmake
```

#### Intel Fortran 编译工具链

```bash
$ xmake f --toolchain=ifort
$ xmake
```

### 通用交叉编译配置

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

<p class="tip">
如果你想要了解更多参数选项，请运行: `xmake f --help`。
</p>

#### --sdk

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

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir
$ xmake
```

这个时候，xmake会去自动探测，gcc等编译器的前缀名：`arm-linux-`，并且编译的时候，也会自动加上`链接库`和`头文件`的搜索选项，例如：

```
-I/home/toolchains_sdkdir/include -L/home/toolchains_sdkdir/lib
```

这些都是xmake自动处理的，不需要手动配置他们。。

#### --bin

- 设置工具链bin目录

对于不规则工具链目录结构，靠单纯地[--sdk](#-sdk)选项设置，没法完全检测通过的情况下，可以通过这个选项继续附加设置工具链的bin目录位置。

例如：一些特殊的交叉工具链的，编译器bin目录，并不在 `/home/toolchains_sdkdir/bin` 这个位置，而是独立到了 `/usr/opt/bin`

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --bin=/usr/opt/bin
$ xmake
```

<p class="tip">
v2.2.1版本之前，这个参数名是`--toolchains`，比较有歧义，因此新版本中，统一改成`--bin=`来设置bin目录。
</p>

#### --cross

- 设置交叉工具链工具前缀

像`aarch64-linux-android-`这种，通常如果你配置了[--sdk](#-sdk)或者[--bin](#-bin)的情况下，xmake会去自动检测的，不需要自己手动设置。

但是对于一些极特殊的工具链，一个目录下同时有多个cross前缀的工具bin混在一起的情况，你需要手动设置这个配置，来区分到底需要选用哪个bin。

例如，toolchains的bin目录下同时存在两个不同的编译器：

```
/opt/bin
 - armv7-linux-gcc
 - aarch64-linux-gcc
```

我们现在想要选用armv7的版本，则配置如下：

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --bin=/opt/bin --cross=armv7-linux-
```

#### --as

- 设置`asm`汇编器

如果还要继续细分选择编译器，则继续追加相关编译器选项，例如：

```bash
$ xmake f -p linux --sdk=/user/toolsdk --as=armv7-linux-as
```

如果存在`AS`环境变量的话，会优先使用当前环境变量中指定的值。

<p class="tip">
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么编译器工具检测就会失败。
这个时候我们可以通过：`xmake f --as=gcc@/home/xxx/asmips.exe` 设置ccmips.exe编译器作为类gcc的使用方式来编译。
也就是说，在指定编译器为`asmips.exe`的同时，告诉xmake，它跟gcc用法和参数选项基本相同。
</p>

#### --cc

- 设置c编译器

如果还要继续细分选择编译器，则继续追加相关编译器选项，例如：

```bash
$ xmake f -p linux --sdk=/user/toolsdk --cc=armv7-linux-clang
```

如果存在`CC`环境变量的话，会优先使用当前环境变量中指定的值。

<p class="tip">
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么编译器工具检测就会失败。
这个时候我们可以通过：`xmake f --cc=gcc@/home/xxx/ccmips.exe` 设置ccmips.exe编译器作为类gcc的使用方式来编译。
也就是说，在指定编译器为`ccmips.exe`的同时，告诉xmake，它跟gcc用法和参数选项基本相同。
</p>

#### --cxx

- 设置`c++`编译器

如果还要继续细分选择编译器，则继续追加相关编译器选项，例如：

```bash
$ xmake f -p linux --sdk=/user/toolsdk --cxx=armv7-linux-clang++
```

如果存在`CXX`环境变量的话，会优先使用当前环境变量中指定的值。

<p class="tip">
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么编译器工具检测就会失败。
这个时候我们可以通过：`xmake f --cxx=clang++@/home/xxx/c++mips.exe` 设置c++mips.exe编译器作为类clang++的使用方式来编译。
也就是说，在指定编译器为`c++mips.exe`的同时，告诉xmake，它跟clang++用法和参数选项基本相同。
</p>

#### --ld

- 设置`c/c++/objc/asm`链接器

如果还要继续细分选择链接器，则继续追加相关编译器选项，例如：

```bash
$ xmake f -p linux --sdk=/user/toolsdk --ld=armv7-linux-clang++
```

如果存在`LD`环境变量的话，会优先使用当前环境变量中指定的值。

<p class="tip">
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么链接器工具检测就会失败。
这个时候我们可以通过：`xmake f --ld=g++@/home/xxx/c++mips.exe` 设置c++mips.exe链接器作为类g++的使用方式来编译。
也就是说，在指定链接器为`c++mips.exe`的同时，告诉xmake，它跟g++用法和参数选项基本相同。
</p>

#### --sh

- 设置`c/c++/objc/asm`共享库链接器

```bash
$ xmake f -p linux --sdk=/user/toolsdk --sh=armv7-linux-clang++
```

如果存在`SH`环境变量的话，会优先使用当前环境变量中指定的值。

<p class="tip">
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么链接器工具检测就会失败。
这个时候我们可以通过：`xmake f --sh=g++@/home/xxx/c++mips.exe` 设置c++mips.exe链接器作为类g++的使用方式来编译。
也就是说，在指定链接器为`c++mips.exe`的同时，告诉xmake，它跟g++用法和参数选项基本相同。
</p>

#### --ar

- 设置`c/c++/objc/asm`静态库归档器

```bash
$ xmake f -p linux --sdk=/user/toolsdk --ar=armv7-linux-ar
```

如果存在`AR`环境变量的话，会优先使用当前环境变量中指定的值。

<p class="tip">
如果指定的编译器名不是那些xmake内置可识别的名字（带有ar等字样），那么链接器工具检测就会失败。
这个时候我们可以通过：`xmake f --ar=ar@/home/xxx/armips.exe` 设置armips.exe链接器作为类ar的使用方式来编译。
也就是说，在指定链接器为`armips.exe`的同时，告诉xmake，它跟ar用法和参数选项基本相同。
</p>

## 全局配置

我们也可以将一些常用配置保存到全局配置中，来简化频繁地输入：

例如:

```bash
$ xmake g --ndk=~/files/android-ndk-r10e/
```

现在，我们重新配置和编译`android`程序：

```bash
$ xmake f -p android
$ xmake
```

以后，就不需要每次重复配置`--ndk=`参数了。

<p class="tip">
    每个命令都有其简写，例如: `xmake g` 或者 `xmake global`.<br>
</p>

## 清除配置

有时候，配置出了问题编译不过，或者需要重新检测各种依赖库和接口，可以加上`-c`参数，清除缓存的配置，强制重新检测和配置

```bash
$ xmake f -c
$ xmake
```

或者：

```bash
$ xmake f -p iphoneos -c
$ xmake
```

## 导入导出配置

2.5.5 之后，我们还可以导入导出已经配置好的配置集，方便配置的快速迁移。

### 导出配置

```console
$ xmake f --export=/tmp/config.txt
$ xmake f -m debug --xxx=y --export=/tmp/config.txt
```

### 导入配置

```console
$ xmake f --import=/tmp/config.txt
$ xmake f -m debug --xxx=y --import=/tmp/config.txt
```

### 导出配置（带菜单）

```console
$ xmake f --menu --export=/tmp/config.txt
$ xmake f --menu -m debug --xxx=y --export=/tmp/config.txt
```


### 导入配置（带菜单）

```console
$ xmake f --menu --import=/tmp/config.txt
$ xmake f --menu -m debug --xxx=y --import=/tmp/config.txt
```

## 环境变量

我们可以执行下面的命令，获取所有 xmake 用到的环境变量，以及当前被设置的值。

```console
$ xmake show -l envs
XMAKE_RAMDIR            Set the ramdisk directory.
                        <empty>
XMAKE_GLOBALDIR         Set the global config directory of xmake.
                        /Users/ruki/.xmake
XMAKE_ROOT              Allow xmake to run under root.
                        <empty>
XMAKE_COLORTERM         Set the color terminal environment.
                        <empty>
XMAKE_PKG_INSTALLDIR    Set the install directory of packages.
                        <empty>
XMAKE_TMPDIR            Set the temporary directory.
                        /var/folders/vn/ppcrrcm911v8b4510klg9xw80000gn/T/.xmake501/211104
XMAKE_PKG_CACHEDIR      Set the cache directory of packages.
                        <empty>
XMAKE_PROGRAM_DIR       Set the program scripts directory of xmake.
                        /Users/ruki/.local/share/xmake
XMAKE_PROFILE           Start profiler, e.g. perf, trace.
                        <empty>
XMAKE_RCFILES           Set the runtime configuration files.

XMAKE_CONFIGDIR         Set the local config directory of project.
                        /Users/ruki/projects/personal/xmake-docs/.xmake/macosx/x86_64
XMAKE_LOGFILE           Set the log output file path.
                        <empty>
```

### XMAKE_RAMDIR

- 设置 ramdisk 目录路径

ramdisk 目录是内存文件系统的目录位置，通常 `os.tmpdir()` 接口会用到，xmake 内部使用的临时文件，如果用户设置 ramdisk 路径，则会优先存储在这个上面，提升整体编译速度。

### XMAKE_TMPDIR

- 设置用户的临时目录

默认 xmake 会使用 `/tmp/.xmake` 和 `%TEMP%/.xmake`，当然用户可以通过这个变量去修改默认路径。

### XMAKE_CONFIGDIR

- 设置本地工程配置目录

每个项目的本地编译配置，默认会存储在当前项目根目录的 `.xmake` 路径下，然后根据不同的平台，架构区分，例如：

```console
.xmake/macosx/x86_64
```

我们如果不想存储在项目根目录，也可以自己设置到其他路径，比如 build 目录下等等。

### XMAKE_GLOBALDIR

- 设置全局配置文件根目录

也就是 `xmake g/global` 全局配置的存储目录，还有安装包，缓存等其他全局文件，默认都会存储在这个目录下。

默认路径为：`~/.xmake`。

### XMAKE_ROOT

- 允许用户在 root 模式下运行

通常 xmake 是默认禁止在 root 下运行，这非常不安全。但是如果用户非要在 root 下运行，也可以设置这个变量，强制开启。

```console
export XMAKE_ROOT=y
```

### XMAKE_COLORTERM

- 设置 Terminal 的色彩输出

目前可以设置这几个值：

| 值        | 描述           |
| ---       | ---            |
| nocolor   | 禁用彩色输出   |
| color8    | 8 色输出支持   |
| color256  | 256 色输出支持 |
| truecolor | 真彩色输出支持 |

通常，用户不需要设置它们，xmake 会自动探测用户终端支持的色彩范围，如果用户不想输出色彩，可以设置 nocolor 来全局禁用。

或者用 `xmake g --theme=plain` 也可以全局禁用。

### XMAKE_PKG_INSTALLDIR

- 设置依赖包的安装根目录

xmake 的远程包安装的全局目录默认是 `~/.xmake/packages`，但是用户也可以设置这个变量，去单独修改它。

我们也可以使用 `xmake g --pkg_installdir=/xxx` 去设置它，效果是一样的。

### XMAKE_PKG_CACHEDIR

- 设置依赖包的缓存目录

默认路径在 `~/.xmake/cache` 目录，存储包安装过程中的各种缓存文件，比较占存储空间，用户也可以单独设置它。

当然，xmake 在每个月都会自动清理上个月的所有缓存文件。

### XMAKE_PROGRAM_DIR

- 设置 xmake 的脚本目录

xmake 的所有 lua 脚本随安装程序一起安装，默认都在安装目录下，但是如果想要切到自己下载的脚本目录下，方便本地修改调试，可以设置此变量。

如果要查看当前 xmake 在使用的脚本目录，可以执行：

```console
$ xmake l os.programdir
/Users/ruki/.local/share/xmake
```

### XMAKE_PROFILE

- 开启性能分析

这仅仅对 xmake 的开发者开放，用于分析 xmake 运行过程中的耗时情况，追踪调用过程。

它有两种模式，一种性能分析模式，将每个函数的耗时排序显示出来。

```console
$ XMAKE_PROFILE=perf xmake
[ 25%]: cache compiling.release src/main.cpp
[ 50%]: linking.release test
[100%]: build ok!
 0.238,  97.93%,       1, runloop                       : @programdir/core/base/scheduler.lua: 805
 0.180,  74.04%,      25, _resume                       : [C]: -1
 0.015,   6.34%,      50, _co_groups_resume             : @programdir/core/base/scheduler.lua: 299
 0.011,   4.37%,      48, wait                          : @programdir/core/base/poller.lua: 111
 0.004,   1.70%,      62, status                        : @programdir/core/base/scheduler.lua: 71
 0.004,   1.53%,      38, is_dead                       : @programdir/core/base/scheduler.lua: 76
 0.003,   1.44%,      50, next                          : @programdir/core/base/timer.lua: 74
 0.003,   1.33%,      48, delay                         : @programdir/core/base/timer.lua: 60
 0.002,   1.02%,      24, is_suspended                  : @programdir/core/base/scheduler.lua: 86
```

另外一种是追踪 xmake 的运行过程：

```console
$ XMAKE_PROFILE=trace xmake
func                          : @programdir/core/base/scheduler.lua: 457
is_suspended                  : @programdir/core/base/scheduler.lua: 86
status                        : @programdir/core/base/scheduler.lua: 71
thread                        : @programdir/core/base/scheduler.lua: 66
thread                        : @programdir/core/base/scheduler.lua: 66
length                        : @programdir/core/base/heap.lua: 120
```

### XMAKE_RCFILES

- 设置全局配置文件

我们可以设置一些 xmakerc.lua 全局配置文件，在用户编译项目的时候，全局引入它们，比如全局引入一些用户自定义的帮助脚本，工具链什么的。

```console
$ export XMAKE_RCFILES=xmakerc.lua
$ xmake
```

如果不设置，默认路径为：`~/.xmake/xmakerc.lua`。

### XMAKE_LOGFILE

- 设置日志文件路径

默认 xmake 会回显输出到终端，我们在可以通过设置这个路径，开启日志自动存储到指定文件，但它不会影响终端的正常回显输出。

### XMAKE_MAIN_REPO

- 设置官方包主仓库地址

xmake 默认内置了三个主仓库地址，它们是完全相同的，xmake 会根据当前网络状态选择最优的地址来使用。

```
https://github.com/xmake-io/xmake-repo.git
https://gitlab.com/tboox/xmake-repo.git
https://gitee.com/tboox/xmake-repo.git
```

但如果 xmake 选择错误，可能会导致仓库下载失败，而通过这个环境变量，我们可以自己设置固定使用指定的仓库地址，不再进行自动选择。

```console
$ export XMAKE_MAIN_REPO = https://github.com/xmake-io/xmake-repo.git
```

### XMAKE_BINARY_REPO

- 设置官方包预编译仓库地址

类似 `XMAKE_MAIN_REPO`，唯一的区别是，这个用于切换预编译仓库的地址。

```console
$ export XMAKE_BINARY_REPO = https://github.com/xmake-mirror/build-artifacts.git
```

### XMAKE_THEME

- 设置主题

通常我们可以通过 `xmake g --theme=plain` 来设置颜色主题，但是它是全局的，如果想单独对当前终端会话设置，我们就可以使用这个环境变量来设置。

```console
$ export XMAKE_THEME=plain
```

### XMAKE_STATS

- 开启或禁用用户量统计

由于目前 xmake 还在发展初期，我们需要知道大概的用户量增长情况，以便于提供我们持续更新 xmake 的动力。

因此 xmake 默认每天的第一次项目构建，会在后台进程自动 git clone 一个空仓库：https://github.com/xmake-io/xmake-stats

然后借用 github 自身提供的 Traffic 统计图表来获取大概的用户量。

对于每个项目，每天只会统计一次，并且不会泄露任何用户隐私，因为仅仅只是多了一次额外的 git clone 操作，另外我们 clone 的是一个空仓库，不会耗费用户多少流量。

当然，并不是每个用户都希望这么做，用户完全有权利去禁用这个行为，我们只需要设置：

```console
export XMAKE_STATS=n
```

就可以完全禁用它，另外我们也会在 ci 上自动禁用这个行为。

什么时候移除它？

这个行为并不会永久存在，等到 xmake 有了足够多的用户量，或者有了其他更好的统计方式，我们会考虑移除相关统计代码。

当然，如果有非常多的用户反馈不愿意接受它，我们也会考虑移除它。

关于这个的相关 issues 见：[#1795](https://github.com/xmake-io/xmake/issues/1795)
