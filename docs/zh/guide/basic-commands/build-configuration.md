# 编译配置 {#build-configuration}

通过`xmake f|config`配置命令，设置构建前的相关配置信息，详细参数选项，请运行: `xmake f --help`。

::: tip 注意
你可以使用命令行缩写来简化输入，也可以使用全名，例如: <br>
`xmake f` 或者 `xmake config`.<br>
`xmake f -p linux` 或者 `xmake config --plat=linux`.
:::

## 切换平台 {#switch-platforms}

### 主机平台

```bash
$ xmake
```

::: tip 注意
Xmake 将会自动探测当前主机平台，默认自动生成对应的目标程序。
:::

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

::: tip 注意
如果手动设置了bin目录，没有通过检测，可以看下是否`--arch=`参数没有匹配对。
:::

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

```bash
$ xmake f -p wasm --toolchain=wasi
$ xmake
```

### HarmonyOS (鸿蒙)

2.9.1 版本新增了鸿蒙 OS 平台的 native 工具链编译支持：

```bash
$ xmake f -p harmony
```

xmake 会自动探测默认的 SDK 路径，当然我们也可以指定 Harmony SDK 路径。

```bash
$ xmake f -p Harmony --sdk=/Users/ruki/Library/Huawei/Sdk/openharmony/10/native
```


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

::: tip 注意
每个命令都有其简写，例如: `xmake g` 或者 `xmake global`.
:::

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

```bash
$ xmake f --export=/tmp/config.txt
$ xmake f -m debug --xxx=y --export=/tmp/config.txt
```

### 导入配置

```bash
$ xmake f --import=/tmp/config.txt
$ xmake f -m debug --xxx=y --import=/tmp/config.txt
```

### 导出配置（带菜单）

```bash
$ xmake f --menu --export=/tmp/config.txt
$ xmake f --menu -m debug --xxx=y --export=/tmp/config.txt
```


### 导入配置（带菜单）

```bash
$ xmake f --menu --import=/tmp/config.txt
$ xmake f --menu -m debug --xxx=y --import=/tmp/config.txt
```
