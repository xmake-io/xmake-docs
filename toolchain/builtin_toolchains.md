!> Due to the author's limited personal energy, all the tool chains supported by xmake are not listed in this document, which will be gradually added later, and everyone is welcome to propose pr improvements or provide sponsored support document updates.

### Gcc

If the gcc toolchain is installed on linux, xmake will usually be detected and used first. Of course, we can also manually switch to gcc to build.

```console
$ xmake f --toolchain=gcc -c
$ xmake
```

#### Use the specified version of Gcc

If the user additionally installs a specific version of the gcc tool chain such as gcc-11, gcc-10, the local gcc program may be named `/usr/bin/gcc-11`.

One way is to switch by specifying the configuration one by one through `xmake f --cc=gcc-11 --cxx=gcc-11 --ld=g++-11`, but it is very cumbersome.

Therefore, xmake also provides a faster switching method:

```console
$ xmake f --toolchain=gcc-11 -c
$ xmake
```

You only need to specify the version name corresponding to `gcc-11` to quickly switch the entire gcc tool chain.

### Clang

In macOS and linux, usually xmake will try to automatically detect and use it first. Of course, we can also switch manually.

```console
$ xmake f --toolchain=clang -c
$ xmake
```

On Windows, it will automatically load the msvc environment.

In addition, we also support PortableBuildTools + clang environment:

```console
$ xmake f -c --sdk=C:/BuildTools --toolchain=clang
$ xmake -v
[50%]: cache compiling.release src\main.cpp C:\Users\star\scoop\apps\llvm\current\bin\clang -c -Qunused-arguments -m64 --target=x86_64-windows-msvc -fexceptions -fcxx-exceptions -o build\.objs\test\windows\x64\release\src\main.cpp.obj src\main.cpp
[75%]: linking.release test.exe C:\Users\star\scoop\apps\llvm\current\bin\clang++ -o build\windows\x64\release\test.exe build\.objs\test\windows\x64\release\src\main.cpp.obj -m64 --target=x86_64-windows-msvc
[100%]: build ok, spent 0.235s
```

### Clang-cl

If you simply switch to the clang-cl.exe compiler, and use msvc for the rest of the link operation, then we don't need to switch the entire tool chain, just cut the c/c++ compiler.

```console
$ xmake f --cc=clang-cl --cxx=clang-cl -c
$ xmake
```

Since xmake v2.7.2, there's also a dedicated clang-cl toolchain. The advantage of using the clang-cl toolchain over the msvc one is that on windows, the
`--vs_toolset` option will be handled correctly.
You can use it by running:

```console
$ xmake f --toolchain=clang-cl
$ xmake
```

### LLVM

In addition to the independent clang compiler, if the user installs a complete llvm tool chain, we can also switch to it, including tools such as `llvm-ar`.

```console
$ xmake f --toolchain=llvm --sdk=/xxxx/llvm
$ xmake
```

If it is a manually downloaded llvm sdk, we need to specify the llvm sdk root directory to ensure that xmake can find it. Of course, if the user has installed it in the PATH directory, the setting of the `--sdk` parameter is also optional.

### Cirle

v2.5.9 xmake adds support for the circle compiler. This is a new C++20 compiler with some interesting compile-time meta-programming features. Those who are interested can check it out on the official website: https://www.circle-lang.org/

```console
$ xmake f --toolchain=circle
$ xmake
```

### Tinyc

[Tiny C Compiler](https://bellard.org/tcc/) is very lightweight. In some cases where you don’t want to install heavy-weight compilers such as msvc/llvm, you may use it to quickly compile some c code.

```console
$ xmake f --toolchain=tinycc
$ xmake
```

When using it, please add the tinycc compiler to the PATH environment.

We can also use the remote tool chain to automatically download and integrate it, and truly achieve one-click compilation on all platforms without any manual installation operations by users.

```lua
add_requires("tinycc")
target("test")
    set_kind("binary")
    add_files("src/*.c)
    set_toolchains("@tinycc")
```

### Armcc for Keil/MDK

v2.5.9 added toolchain support for armcc under Keil/MDK, see related issue: [#1753](https://github.com/xmake-io/xmake/issues/1753)

```console
xmake f -p cross -a cortex-m3 --toolchain=armcc -c
xmake
```

This toolchain is mainly used for embedded cross-compilation, so the `-p cross` cross-compilation platform is specified, and the cpu used by `-a cortex-m3` is specified, and the `-a/--arch` parameter is reused here.

### Armclang for Keil/MDK

v2.5.9 adds toolchain support for armclang under Keil/MDK. For related issues, see: [#1753](https://github.com/xmake-io/xmake/issues/1753)

```console
xmake f -p cross -a cortex-m3 --toolchain=armclang -c
xmake
```

This toolchain is mainly used for embedded cross-compilation, so the `-p cross` cross-compilation platform is specified, and the cpu used by `-a cortex-m3` is specified, and the `-a/--arch` parameter is reused here.

### GNU-RM

Another cross toolchain for embedded arm, official website: https://developer.arm.com/tools-and-software/open-source-software/developer-tools/gnu-toolchain/gnu-rm

```console
$ xmake f --toolchain=gnu-rm -c
$ xmake
```

### SDCC

It is also an embedded arm compilation tool chain.

```console
$ xmake f --toolchain=sdcc -a stm8
$ xmake
```

We can specify `-a stm8` to switch the cpu architecture, currently supported are:

-stm8
-mcs51
-z80
-z180
-r2k
-r3ka
-s08
-hc08

### Mingw

The mingw toolchain is very commonly used and is available on all platforms. We can just switch the relevant toolchain:

```console
$ xmake f --toolchain=mingw -c
$ xmake
```

However, in this way, the suffixes of some target files do not match exactly, so it is recommended to switch to the mingw platform for compilation and to support the download of dependent packages.

```console
$ xmake f -p mingw -c
$ xmake
```

xmake will automatically detect the location of the mingw toolchain by default, macOS and msys/mingw64 environments can usually be automatically detected, if detected, you can also manually specify the mingw sdk path.

```console
$ xmake f -p mingw --mingw=/xxx/mingw -c
$ xmake
```

Note that `--mingw` is used here instead of `--sdk`. In fact, both are ok, but the use of `--mingw` as a single parameter can better ensure that other cross-compilation toolchains do not conflict.

### LLVM-Mingw

This is actually a project independent of Mingw, the usage is completely the same as Mingw, but it is based on LLVM, and provides arm/arm64 and other more architecture support, not just i386/x86_64

```console
$ xmake f -p mingw -a arm64 --mingw=/xxx/llvm-mingw -c
$ xmake
```

If you want to use the arm/arm64 architecture of llvm-mingw, you need to specify the additional `-a arm64` parameter. In addition, the default xmake of llvm-mingw may not be able to detect it, and you need to set the sdk path additionally.

### Zig

If you want to build a Zig program, we can automatically use the zig tool chain by executing xmake by default, but the premise is that zig is already in the PATH environment.

```console
$ xmake
```

Of course, we can also set it manually.

```console
$ xmake f --toolchain=zig -c
$ xmake
```

You can also specify the path of the zig compiler.

```console
$ xmake f --toolchain=zig --zc=/xxxx/zig -c
$ xmake
```

#### Zig CC

We can also use the `zig cc` compiler provided by zig to compile C/C++ code.

```console
$ xmake f --cc="zig cc" --cxx="zig cc" --ld="zig c++" -c
$ xmake
```

#### Cross compilation

In addition, we can also use zig to achieve cross-compilation.

```console
$ xmake f -p cross --cross=riscv64-linux-musl --toolchain=zig
$ xmake
```

Or compile the arm64 architecture:

```console
$ xmake f --toolchain=zig -a arm64 -c
$ xmake
```

### Emcc (WASM)

If you want to compile the wasm program, we only need to switch to the wasm platform, and the emcc tool chain will be used to compile by default.

```console
$ xmake f -p wasm
$ xmake
```

### Wasi (WASM)

This is another Wasm toolchain with WASI enabled, and we need to switch it manually.

```console
$ xmake f -p wasm --toolchain=wasi
$ xmake
```

### Icc (Intel C/C++ Compiler)

We can also switch to Intel's C/C++ compiler to use.

```console
$ xmake f --toolchain=icc -c
$ xmake
```

### Ifort (Intel Fortain Compiler)

We can also switch to Intel's Fortran compiler to use.

```console
$ xmake f --toolchain=ifort -c
$ xmake
```

### gfortran

In addition to Intel's Fortran compiler, we also have the gnu fortran compiler available.

```console
$ xmake f --toolchain=gfortran -c
$ xmake
```

### fpc (Free Pascal)

For pascal programs, xmake will use the fpc compiler to compile by default.

```console
$ xmake
```

Of course, we can also switch manually.

```console
$ xmake f --toolchain=fpc -c
$ xmake
```

### Dlang

For dlang programs, xmake will use the dmd compiler to compile by default.

```console
$ xmake
```

Of course, we can also switch manually.

```console
$ xmake f --toolchain=dlang -c
$ xmake
```

It should be noted that the dlang toolchain here actually includes automatic detection and switching of `dmd`, `ldc2` and `gdc`.

### Cuda

For Cuda programs, we need to manually switch to the cuda tool chain.

```console
$ xmake f --toolchain=cuda -c
$ xmake
```

We can also manually switch the C/C++ compiler called internally by nvcc.

```console
$ xmake f --toolchain=cuda --cu-ccbin=clang -c
$ xmake
```

### Assembler

Regarding the independent assembler tool chain, xmake supports three: yasm, nasm, and fasm, which can be switched at will. If not set, the assembler that comes with gcc/clang/msvc will be used by default.

```console
$ xmake f --toolchain=nasm -c
$ xmake
```

You can also specify the assembler path separately

```console
$ xmake f --toolchain=nasm --as=/xxx/nasm -c
$ xmake
```

### Go

The golang compiler tool chain is automatically enabled when compiling go programs by default.

```console
$ xmake
```

### Rust

The rust compiler tool chain is automatically enabled when the rust program is compiled by default.

```console
$ xmake
```

At present, the rust toolchain can also support cross-compilation environments such as android.

```console
$ xmake f -p android --ndk=~/android-ndk-r20b -c
$ xmake
```

### NDK

Android's NDK compilation tool chain, as long as the android platform is enabled, it will be enabled by default.

```console
$ xmake f -p android --ndk=~/android-ndk-r20b -c
$ xmake
```

If the `--ndk` parameter is not specified, xmake will also detect it from the AndroidSDK/ndk-bundle directory and environment variables such as `$ANDROID_NDK_HOME`, `ANDROID_NDK_ROOT`, etc. by default.

In addition, we can also set the global `xmake g --ndk=` configuration to avoid repeated settings each time.
