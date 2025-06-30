---
outline: deep
---

# Build Configuration

Set compilation configuration before building project with command `xmake f|config`. If you want to known more options, please run: `xmake f --help`。

::: tip NOTE
You can use short or long command option, for example: <br>
`xmake f` or `xmake config`.<br>
`xmake f -p linux` or `xmake config --plat=linux`.
:::

## Switch Platforms

### Current Host

:::tip NOTE
Xmake will detect the current host platform automatically and build project.
:::

```sh
$ xmake
```

### Linux

```sh
$ xmake f -p linux [-a i386|x86_64]
$ xmake
```

### Android

```sh
$ xmake f -p android --ndk=~/files/android-ndk-r10e/ [-a armeabi-v7a|arm64-v8a]
$ xmake
```

If you want to set the other android toolchains, you can use [--bin](#-bin) option.

For example:

```sh
$ xmake f -p android --ndk=~/files/android-ndk-r10e/ -a arm64-v8a --bin=~/files/android-ndk-r10e/toolchains/aarch64-linux-android-4.9/prebuilt/darwin-x86_64/bin
```

The [--bin](#-bin) option is used to set `bin` directory of toolchains.

::: tip NOTE
Please attempt to set `--arch=` option if it had failed to check compiler.
:::

### iPhoneOS

```sh
$ xmake f -p iphoneos [-a armv7|armv7s|arm64|i386|x86_64]
$ xmake
```

Since the emulator on the m1 device also supports the arm64 architecture, it is no longer possible to distinguish the emulator from the arch alone.
Therefore, in version 2.6.5, we have added a new parameter to distinguish between emulator targets and emulator targets.

```sh
$ xmake f -p iphoneos --appledev=simulator
$ xmake f -p watchos --appledev=simulator
$ xmake f -p appletvos --appledev=simulator
```

### Mac Catalyst

We can also specify to build Mac Catalyst programs.

```sh
$ xmake f --appledev=catalyst
```

### Windows

```sh
$ xmake f -p windows [-a x86|x64]
$ xmake
```

### MinGW

In addition to supporting Msys2/MingW, MingW for macOS/linux, xmake also supports the llvm-mingw tool chain, which can switch the arm/arm64 architecture to compile.

```sh
$ xmake f -p mingw --sdk=/usr/local/i386-mingw32-4.3.0/ [-a i386|x86_64|arm|arm64]
$ xmake
```

### WASM (WebAssembly)

This platform is used to compile WebAssembly programs (emcc toolchain is used internally). Before switching this platform, we need to enter the Emscripten toolchain environment to ensure that emcc and other compilers are available.

```sh
$ xmake f -p wasm
$ xmake
```

Xmake also supports Qt for wasm compilation, you only need:

```sh
$ xmake f -p wasm [--qt=~/Qt]
$ xmake
```

The `--qt` parameter setting is optional, usually xmake can detect the sdk path of qt.


One thing to note is that there is a correspondence between the versions of Emscripten and Qt SDK. If the version does not match, there may be compatibility issues between Qt/Wasm.

Regarding the version correspondence, you can see: [https://wiki.qt.io/Qt_for_WebAssembly](https://wiki.qt.io/Qt_for_WebAssembly)

For more details, please see: [https://github.com/xmake-io/xmake/issues/956](https://github.com/xmake-io/xmake/issues/956)

In addition to emscripten, there is a common wasi-sdk toolchain for building wasi-based programs, and we just need to switch between toolchains.

```sh
$ xmake f -p wasm --toolchain=wasi
$ xmake
```

### Apple WatchOS

```sh
$ xmake f -p watchos [-a i386|armv7k]
$ xmake
```

### HarmonyOS

Version 2.9.1 adds native toolchain compilation support for the Hongmeng OS platform:

```sh
$ xmake f -p harmony
```

xmake will automatically detect the default SDK path, but you can also specify the Harmony SDK path.

```sh
$ xmake f -p Harmony --sdk=/Users/ruki/Library/Huawei/Sdk/openharmony/10/native
```

## Global Configuration

You can save to the global configuration for simplfying operation.

For example:

```sh
$ xmake g --ndk=~/files/android-ndk-r10e/
```

Now, we config and build project for android again.

```sh
$ xmake f -p android
$ xmake
```

::: tip NOTE
You can use short or long command option, for example: `xmake g` or `xmake global`.
:::

## Clean Configuration

We can clean all cached configuration and re-configure project.

```sh
$ xmake f -c
$ xmake
```

or

```sh
$ xmake f -p iphoneos -c
$ xmake
```

## Import and export configuration

After 2.5.5, we can also import and export the configured configuration set to facilitate rapid configuration migration.

### Export configuration

```sh
$ xmake f --export=/tmp/config.txt
$ xmake f -m debug --xxx=y --export=/tmp/config.txt
```

### Import configuration

```sh
$ xmake f --import=/tmp/config.txt
$ xmake f -m debug --xxx=y --import=/tmp/config.txt
```

### Export configuration (with menu)

```sh
$ xmake f --menu --export=/tmp/config.txt
$ xmake f --menu -m debug --xxx=y --export=/tmp/config.txt
```


### Import configuration (with menu)

```sh
$ xmake f --menu --import=/tmp/config.txt
$ xmake f --menu -m debug --xxx=y --import=/tmp/config.txt
```
