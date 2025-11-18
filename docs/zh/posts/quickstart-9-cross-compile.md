---
title: xmake从入门到精通9：交叉编译详解
tags: [xmake, lua, 交叉编译]
date: 2019-12-05
author: Ruki
outline: deep
---

xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。

除了win, linux, macOS平台，以及android, ios等移动端平台的内建构建支持，xmake也支持对各种其他工具链的交叉编译支持，本文我们将会详细介绍下如何使用xmake进行交叉编译。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

### 交叉编译工具链简介

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

#### 设置工具链bin目录

对于不规则工具链目录结构，靠单纯地[--sdk](https://xmake.io/zh/)选项设置，没法完全检测通过的情况下，可以通过这个选项继续附加设置工具链的bin目录位置。

例如：一些特殊的交叉工具链的，编译器bin目录，并不在  `/home/toolchains_sdkdir/bin`  这个位置，而是独立到了  `/usr/opt/bin`

这个时候，我们可以在设置了sdk参数的基础上追加bin目录的参数设置，来调整工具链的bin目录。

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --bin=/usr/opt/bin
$ xmake
```

#### 设置交叉工具链工具前缀

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

#### 设置c/c++编译器

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

#### 设置c/c++连接器

如果还要继续细分选择链接器，则继续追加相关链接器选项，例如：

```bash
$ xmake f -p linux --sdk=/user/toolsdk --ld=armv7-linux-clang++ --sh=armv7-linux-clang++ --ar=armv7-linux-ar
```

ld指定可执行程序链接器，sh指定共享库程序链接器，ar指定生成静态库的归档器。

注：如果存在LD/SH/AR环境变量的话，会优先使用当前环境变量中指定的值。

#### 设置头文件和库搜索目录

如果sdk里面还有额外的其他include/lib目录不在标准的结构中，导致交叉编译找不到库和头文件，那么我们可以通过`--includedirs`和`--linkdirs`来追加搜索路径，然后通过`--links`添加额外的链接库。

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --includedirs=/usr/toolsdk/xxx/include --linkdirs=/usr/toolsdk/xxx/lib --links=pthread
```

注：如果要指定多个搜索目录，可以通过`:`或者`;`来分割，也就是不同主机平台的路径分隔符，linux/macos下用`:`，win下用`;`。

#### 设置编译和链接选项

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

### mingw工具链

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
[  0%]: ccache compiling.release src/main.cpp
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

### 项目描述设置

#### set_toolchain

如果觉得每次通过命令行配置比较繁琐，有些配置可以通过在xmake.lua预先配置好，来简化命令配置，比如编译器的指定，就可以通过`set_toolchain`来对每个target单独设置。

```lua
target("test")
    set_kind("binary")
    set_toolchain("cxx", "clang")
    set_toolchain("ld", "clang++")
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