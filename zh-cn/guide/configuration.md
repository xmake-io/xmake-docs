
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

<p class="tip">
    xmake将会自动探测当前主机平台，默认自动生成对应的目标程序。
</p>

### Linux

```bash
$ xmake f -p linux [-a i386|x86_64]
$ xmake
```

### Android

```bash
$ xmake f -p android --ndk=~/files/android-ndk-r10e/ [-a armv5te|armv6|armv7-a|armv8-a|arm64-v8a]
$ xmake
```

如果要手动指定ndk中具体某个工具链，而不是使用默认检测的配置，可以通过[--bin](#-bin)来设置，例如：

```bash
$ xmake f -p android --ndk=~/files/android-ndk-r10e/ -a arm64-v8a --bin=~/files/android-ndk-r10e/toolchains/aarch64-linux-android-4.9/prebuilt/darwin-x86_64/bin
```

[--bin](#-bin)主要用于设置选择编译工具的具体bin目录，这个的使用跟[交叉编译](#交叉编译)中的[--bin](#-bin)的行为是一致的。

<p class="tip">
如果手动设置了bin目录，没有通过检测，可以看下是否`--arch=`参数没有匹配对。
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

### 交叉编译

linux平台的交叉编译：

```bash
$ xmake f -p linux --sdk=/usr/local/arm-linux-gcc/ [--bin=/sdk/bin] [--cross=arm-linux-]
$ xmake
``` 

其他平台的交叉编译：

```bash
$ xmake f -p cross --sdk=/usr/local/arm-xxx-gcc/ [--bin=/sdk/bin] [--cross=arm-linux-]
$ xmake
``` 

如果不关心实际的平台名，只想交叉编译，可以直接用上面的命令，如果需要通过`is_plat("myplat")`判断自己的平台逻辑，则：

```bash
$ xmake f -p myplat --sdk=/usr/local/arm-xxx-gcc/ [--bin=/sdk/bin] [--cross=arm-linux-]
$ xmake
``` 

其中：

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
| [--sc-ld](#-sc-ld)           | 设置`swift`链接器                |
| [--sc-sh](#-sc-sh)           | 设置`swift`共享库链接器          |
| [--gc-ld](#-gc-ld)           | 设置`golang`链接器               |
| [--gc-ar](#-gc-ar)           | 设置`golang`静态库归档器         |
| [--dc-ld](#-dc-ld)           | 设置`dlang`链接器                |
| [--dc-sh](#-dc-sh)           | 设置`dlang`共享库链接器          |
| [--dc-ar](#-dc-ar)           | 设置`dlang`静态库归档器          |
| [--rc-ld](#-rc-ld)           | 设置`rust`链接器                 |
| [--rc-sh](#-rc-sh)           | 设置`rust`共享库链接器           |
| [--rc-ar](#-rc-ar)           | 设置`rust`静态库归档器           |
| [--cu-cxx](#-cu-cxx)         | 设置`cuda` host编译器            |
| [--cu-ld](#-cu-ld)           | 设置`cuda`链接器                 |
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

<p class="tips">
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

<p class="tips">
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

<p class="tips">
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

<p class="tips">
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

<p class="tips">
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

<p class="tips">
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

<p class="tips">
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

