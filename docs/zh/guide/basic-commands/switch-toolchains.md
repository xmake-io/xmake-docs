# 切换工具链 {#switch-toolchains}

我们可以通过传递 `--toolchain=[name]` 参数给 `xmake f/config` 命令，来实现全局的工具链切换。

:::tip 注意
这种方式是全局的，如果我们想要针对特定 target 进行工具链切换，我们需要在 xmake.lua 配置中，通过 [set_toolchains](/zh/api/description/project-target#set-toolchains) 接口来实现。
:::

如果我们想在 xmake.lua 工程配置文件中去切换它，可以到：[配置工具链](/zh/guide/project-configuration/toolchain-configuration) 进一步查看。

另外，Xmake 还内置提供了一些常用的工具链，可以直接切换使用，但前提是：用户自己已经在系统上安装了对应的工具链环境。

## MSVC

在 Windows 上，xmake 默认会自动检测并使用已安装的最新版本 Visual Studio MSVC 工具链，通常不需要手动指定工具链。

### 选择 Visual Studio 版本

如果安装了多个版本的 Visual Studio，可以通过 `--vs` 选项指定使用哪个版本（默认值为 `auto`，即使用已安装的最新版本）：

```sh
$ xmake f --vs=2022
$ xmake
```

可选的值为 VS 的年份编号，例如 `2015`、`2017`、`2019`、`2022`。

非常老的版本同样支持。例如 Visual C++ 6.0（VC6），可以直接传入它的版本号来选择：

```sh
$ xmake f --vs=6.0
$ xmake
```

### 选择工具集版本

Visual Studio 可以同时安装多个并存的 MSVC 工具集（例如 VS2015 的 v140、VS2017 的 v141、VS2019 的 v142、VS2022 的 v143）。类似于 CMake 的 `-T v140`，xmake 可以通过 `--vs_toolset` 选项，传入工具集对应的语义版本号，来指定使用哪个工具集进行构建：

```sh
$ xmake f --vs_toolset=14.0 # 使用 v140 工具集 (VS2015)
$ xmake
```

版本号会按照 `v<主版本><次版本第一位>` 的规则映射到平台工具集名称，例如：

| `--vs_toolset` | 平台工具集 | Visual Studio |
| -------------- | ---------- | ------------- |
| `14.0`         | v140       | VS2015        |
| `14.1`         | v141       | VS2017        |
| `14.2`         | v142       | VS2019        |
| `14.3`         | v143       | VS2022        |

在生成 Visual Studio 工程时，这些配置同样会生效，生成的工程会使用对应的平台工具集：

```sh
$ xmake f --vs_toolset=14.0
$ xmake project -k vsxmake2022
```

::: tip 注意
在 Windows 上使用 `clang-cl` 工具链时，`--vs_toolset` 选项同样会被正确处理，可参考 [Clang-cl](#clang-cl)。
:::

### 选择 Windows SDK 版本

如果安装了多个 Windows SDK，可以通过 `--vs_sdkver` 选项，传入完整的 SDK 版本号，来指定使用哪个 SDK 进行编译和链接：

```sh
$ xmake f --vs_sdkver=10.0.15063.0
$ xmake
```

它可以和上面的工具集选择组合使用，例如 `xmake f --vs_toolset=14.0 --vs_sdkver=10.0.15063.0`。

### 构建兼容 XP 的程序

如果想要生成一个仍然能在 Windows XP 上运行的程序，需要两个条件：使用 MSVC v140（或 v141）工具集搭配 Windows 7.1 SDK，以及一个面向 XP 的链接器子系统版本。

首先切换到 v140 工具集，然后在 `xmake.lua` 中配置 target：

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")

    -- 使用兼容 XP 的 Windows 7.1 SDK 构建
    add_defines("_USING_V140_SDK71_")

    -- 指定 XP 子系统版本
    if is_arch("x86") then
        add_ldflags("/subsystem:console,5.01") -- Windows XP (x86)
    else
        add_ldflags("/subsystem:console,5.02") -- Windows XP x64 / Server 2003
    end
```

子系统版本决定了可执行文件能加载运行的最低系统版本：`5.01` 对应 Windows XP（32 位），`5.02` 对应 64 位 XP / Server 2003 系列。如果是 GUI 程序，则把 `console` 换成 `windows`，例如 `/subsystem:windows,5.01`。

然后使用 v140 工具集构建：

```sh
$ xmake f --vs_toolset=14.0
$ xmake
```

如果生成 Visual Studio 工程，同样的配置也会生效：

```sh
$ xmake f --vs_toolset=14.0
$ xmake project -k vsxmake2022
```

::: tip 注意
xmake 自身正是用这种方式构建，从而保持在 Windows XP 上可以运行。其中子系统版本号的映射关系与 [winos.version](/zh/api/scripts/builtin-modules/winos#winos-version) 一致（`winxp = 5.1`，`ws03 = 5.2`）。
:::

### 在 Linux/macOS 上使用 MSVC 构建 (msvc-wine)

自 v2.9.7 起，xmake 支持在 Linux 和 macOS 上，通过 Wine 运行一套可移植的 MSVC 工具链（例如 [msvc-wine](https://github.com/mstorsjo/msvc-wine) 或 PortableBuildTools），来构建 Windows MSVC 目标程序。前提是系统上已安装 Wine，并且有一个可移植的 MSVC SDK 目录。

切换到 windows 平台并使用 msvc 工具链，通过 `--sdk` 指向可移植的 MSVC 安装目录：

```sh
$ xmake f -p windows -a x64 --sdk=/path/to/msvc-wine/sdk
$ xmake
```

上面介绍的 `--vs`、`--vs_toolset`、`--vs_sdkver` 选项在这里同样适用：

```sh
$ xmake f -p windows -a x64 --sdk=/path/to/msvc-wine/sdk --vs_toolset=14.16 --vs_sdkver=10.0.19041.0
$ xmake
```

当使用 `xmake run` 运行构建出来的程序时，xmake 会自动通过 Wine 来调用它，因此不需要我们手动执行 `wine`：

```sh
$ xmake run
```

## Gcc

如果 linux 上安装了 gcc 工具链，通常 xmake 都会优先检测使用，当然我们也可以手动切换到 gcc 来构建。

```sh
$ xmake f --toolchain=gcc -c
$ xmake
```

### 使用指定版本的 Gcc

如果用户额外安装了 gcc-11, gcc-10 等特定版本的 gcc 工具链，在本地的 gcc 程序命名可能是 `/usr/bin/gcc-11`。

一种办法是通过 `xmake f --cc=gcc-11 --cxx=gcc-11 --ld=g++-11` 挨个指定配置来切换，但非常繁琐。

所以，xmake 也提供了更加快捷的切换方式：

```sh
$ xmake f --toolchain=gcc-11 -c
$ xmake
```

只需要指定 `gcc-11` 对应的版本名，就可以快速切换整个 gcc 工具链。

## Clang

在 macOS 和 linux，通常 xmake 也会优先尝试去自动检测和使用它，当然我们也可以手动切换。

```sh
$ xmake f --toolchain=clang -c
$ xmake
```

在 windows 上，它会自动加载 msvc 环境。

另外，我们也支持 PortableBuildTools + clang 环境：

```sh
$ xmake f -c --sdk=C:/BuildTools --toolchain=clang
$ xmake -v
[ 50%]: cache compiling.release src\main.cpp
C:\Users\star\scoop\apps\llvm\current\bin\clang -c -Qunused-arguments -m64 --target=x86_64-windows-msvc -fexceptions -fcxx-exceptions -o build\.objs\test\windows\x64\release\src\main.cpp.obj src\main.cpp
[ 75%]: linking.release test.exe
C:\Users\star\scoop\apps\llvm\current\bin\clang++ -o build\windows\x64\release\test.exe build\.objs\test\windows\x64\release\src\main.cpp.obj -m64 --target=x86_64-windows-msvc
[100%]: build ok, spent 0.235s
```

## Clang-cl

如果只是单纯的切换使用 clang-cl.exe 编译器，剩下的链接操作还是用 msvc，那么我们不需要整个工具链切换，仅仅切换 c/c++ 编译器。

```sh
$ xmake f --cc=clang-cl --cxx=clang-cl -c
$ xmake
```

自 v2.7.2 起，也有专门的 clang-cl 工具链。使用 clang-cl 工具链相较于 msvc 工具链的优势在于，在 windows 上，`--vs_toolset` 选项会被正确处理。

## LLVM

除了独立 clang 编译器，如果用户安装了完整 llvm 工具链，我们也可以整个切换过去，包括 `llvm-ar` 等工具。

```sh
$ xmake f --toolchain=llvm --sdk=/xxxx/llvm
$ xmake
```

如果是手动下载的 llvm sdk，我们需要额外指定 llvm sdk 根目录，确保 xmake 能找到它，当然，如果用户已经安装到 PATH 目录下，`--sdk` 参数的设置也是可选的。

## Circle

v2.5.9 xmake 新增了 circle 编译器的支持，这是个新的 C++20 编译器，额外附带了一些有趣的编译期元编程特性，有兴趣的同学可以到官网查看：https://www.circle-lang.org/

```sh
$ xmake f --toolchain=circle
$ xmake
```

## Tinyc

[Tiny C 编译器](https://bellard.org/tcc/) 非常的轻量，在一些不想安装 msvc/llvm 等重量型编译器的情况下，使用它可能快速编译一些 c 代码。

```sh
$ xmake f --toolchain=tinycc
$ xmake
```

使用的时候，请先把 tinycc 编译器加入 PATH 环境。

我们也可以使用远程工具链自动下载集成它，真正做到全平台一键编译，无任何用户手动安装操作。

```lua
add_requires("tinycc")
target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("@tinycc")
```

## Armcc for Keil/MDK

v2.5.9 新增了对 Keil/MDK 下 armcc 的工具链支持，相关 issue 见：[#1753](https://github.com/xmake-io/xmake/issues/1753)

```sh
xmake f -p cross -a cortex-m3 --toolchain=armcc -c
xmake
```

这个工具链主要用于嵌入式交叉编译，所以指定了 `-p cross` 交叉编译平台，`-a cortex-m3` 指定使用的 cpu，这里复用了 `-a/--arch` 参数。

## Armclang for Keil/MDK

v2.5.9 新增了对 Keil/MDK 下 armclang 的工具链支持，相关 issue 见：[#1753](https://github.com/xmake-io/xmake/issues/1753)

```sh
xmake f -p cross -a cortex-m3 --toolchain=armclang -c
xmake
```

这个工具链主要用于嵌入式交叉编译，所以指定了 `-p cross` 交叉编译平台，`-a cortex-m3` 指定使用的 cpu，这里复用了 `-a/--arch` 参数。

## GNU-RM

另外一个嵌入式 arm 的交叉工具链，官网：https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm

```sh
$ xmake f --toolchain=gnu-rm -c
$ xmake
```

## SDCC

一个用于 Intel MCS51, STM8, Z80 等多种微控制器的 C 编译器套件。 [官网](https://sdcc.sourceforge.net/)

```sh
$ xmake f --toolchain=sdcc -a stm8
$ xmake
```

我们可以指定 `-a stm8` 切换 cpu 架构，目前支持的有：

- stm8
- mcs51
- z80
- z180
- r2k
- r3ka
- s08
- hc08

## Mingw

mingw 工具链很常用，并且全平台都提供，我们可以仅仅切换相关工具链：

```sh
$ xmake f --toolchain=mingw -c
$ xmake
```

但是这样，一些目标文件的后缀名并不完全匹配，因此建议整个切到 mingw 平台编译，还能支持依赖包下载。

```sh
$ xmake f -p mingw -c
$ xmake
```

如果 mingw 工具链安装在 linux、macOS 或 msys/mingw64 环境，通常都能自动检测到，如果检测到，也可以手动指定 mingw sdk 路径。

```sh
$ xmake f -p mingw --mingw=/xxx/mingw -c
$ xmake
```

注意，这里使用了 `--mingw` 而不是 `--sdk`。其实这两个都可以，但是使用 `--mingw` 单独的参数可以更好的保证其他交叉编译工具链不冲突。

## LLVM-Mingw

这其实是一个独立于 Mingw 的项目，用法和 Mingw 完全一致，但是它是基于 LLVM 的，并且提供了 arm/arm64 等其他更多架构的支持，而不仅仅是 i386/x86_64

```sh
$ xmake f -p mingw -a arm64 --mingw=/xxx/llvm-mingw -c
$ xmake
```

如果要使用 llvm-mingw 的 arm/arm64 架构，则需要额外指定 `-a arm64` 参数才行，另外 llvm-mingw 默认 xmake 不一定能够检测到，需要额外设置 sdk 路径。

## Zig

如果要构建 Zig 程序，我们默认执行 xmake 就能自动使用 zig 工具链，但前提是 zig 已经在 PATH 环境下。

```sh
$ xmake
```

当然，我们也可以手动设置它。

```sh
$ xmake f --toolchain=zig -c
$ xmake
```

也可以指定 zig 编译器的路径。

```sh
$ xmake f --toolchain=zig --zc=/xxxx/zig -c
$ xmake
```

### Zig CC

我们也可以使用 zig 提供的 `zig cc` 编译器去编译 C/C++ 代码。

```sh
$ xmake f --cc="zig cc" --cxx="zig cc" --ld="zig c++" -c
$ xmake
```

### 交叉编译

另外，我们也可以使用 zig 实现交叉编译。

```sh
$ xmake f -p cross --cross=riscv64-linux-musl --toolchain=zig
$ xmake
```

或者编译 arm64 架构：

```sh
$ xmake f --toolchain=zig -a arm64 -c
$ xmake
```

## Emcc (WASM)

如果要编译 wasm 程序，我们只需要切换到 wasm 平台，默认就会使用 emcc 工具链去编译。

```sh
$ xmake f -p wasm
$ xmake
```

## Wasi (WASM)

这是另外一个启用了 WASI 的 Wasm 工具链，我们需要手动切换使用。

```sh
$ xmake f -p wasm --toolchain=wasi
$ xmake
```

对于 WebAssembly 系统接口 (WASI) 开发，你可以使用 `--sdk` 参数配置 WASI SDK 路径。这允许你使用特定的 WASI SDK 版本进行 WebAssembly 交叉编译。

```sh
# 配置 WASI SDK 路径
$ xmake f -p wasm --toolchain=wasi --sdk=/home/lin/issue-wasi-ar/wasi-sdk-30.0-x86_64-linux
$ xmake
```

`--sdk` 参数接受你的 WASI SDK 安装路径，允许你根据项目需要使用不同的 SDK 版本。此配置支持：
- 使用特定的 WASI SDK 安装
- 交叉编译到支持 WASI 的 WebAssembly
- 与 WASI 系统调用集成，支持系统级操作

## Icc (Intel C/C++ Compiler)

我们也可以切换到 Intel 的 C/C++ 编译器去使用。

```sh
$ xmake f --toolchain=icc -c
$ xmake
```

## Ifort (Intel Fortain Compiler)

我们也可以切换到 Intel 的 Fortran 编译器去使用。

```sh
$ xmake f --toolchain=ifort -c
$ xmake
```

## gfortran

除了 Intel 的 Fortran 编译器，我们还有 gnu fortran 编译器可用。

```sh
$ xmake f --toolchain=gfortran -c
$ xmake
```

## fpc (Free Pascal)

对于 pascal 程序，xmake 默认就会使用 fpc 编译器来编译。

```sh
$ xmake
```

当然，我们也可以手动切换。

```sh
$ xmake f --toolchain=fpc -c
$ xmake
```

## Dlang

对于 dlang 程序，xmake 默认就会使用 dmd 编译器来编译。

```sh
$ xmake
```

当然，我们也可以手动切换。

```sh
$ xmake f --toolchain=dlang -c
$ xmake
```

需要注意的是，此处的 dlang 工具链其实内部包含了对 `dmd`, `ldc2` 和 `gdc` 的自动探测和切换。

## Cuda

对于 Cuda 程序，我们需要手动切换到 cuda 工具链。

```sh
$ xmake f --toolchain=cuda -c
$ xmake
```

我们也可以手动切换 nvcc 内部调用的 C/C++ 编译器。

```sh
$ xmake f --toolchain=cuda --cu-ccbin=clang -c
$ xmake
```

## 汇编器

关于独立的汇编器工具链，xmake 支持：yasm, nasm, fasm 三个，可以随意切换，如果没设置，默认使用 gcc/clang/msvc 自带的汇编器。

```sh
$ xmake f --toolchain=nasm -c
$ xmake
```

也可以单独指定汇编器路径

```sh
$ xmake f --toolchain=nasm --as=/xxx/nasm -c
$ xmake
```

## Go

golang 编译工具链，默认编译 go 程序会自动启用。

```sh
$ xmake
```

## Rust

rust 编译工具链，默认编译 rust 程序会自动启用。

```sh
$ xmake
```

目前 rust 工具链还可以支持 android 等交叉编译环境。

```sh
$ xmake f -p android --ndk=~/android-ndk-r20b -c
$ xmake
```

## NDK

Android 的 NDK 编译工具链，只要启用 android 平台，就会默认启用。

```sh
$ xmake f -p android --ndk=~/android-ndk-r20b -c
$ xmake
```

如果 `--ndk` 参数不指定，xmake 也会默认从 AndroidSDK/ndk-bundle 目录，以及 `$ANDROID_NDK_HOME`, `ANDROID_NDK_ROOT` 等环境变量中去探测它。

另外，我们也可以设置导全局的 `xmake g --ndk=` 配置中，避免每次重复设置。

