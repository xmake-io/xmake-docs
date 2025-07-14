---
title: Xmake Getting Started Tutorial 5, Introduction to Android platform compilation
tags: [xmake, lua, android, jni]
date: 2019-11-15
author: Ruki
---

xmake is a lightweight and modern c/c++ project building tool based on Lua. It's main features are: easy to use syntax, easy to use project maintenance, 
and a consistent build experience across platforms.

This article mainly explains in detail how to compile libraries and executable programs that can run under android through xmake.

* [Project Source](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io)

### Ready to work

First of all, we need to prepare the ndk toolchain necessary for compiling the android native library. 
If you haven’t, you can download and decompress it from the official websit: [Android NDK](https://developer.android.com/ndk)

If you want to get better backward compatibility, you can choose the r16 version, because this is the last version that supports armeabi. If there is no special requirement, you can download the latest version directly.

### NDK integration and compilation

#### Manually configure the NDK

We only need to pass the decompressed ndk directory path to xmake to complete the configuration, and we can compile directly, for example:

```bash
$ xmake f -p android --ndk=~/downloads/android-ndk-r19c
$ xmake
```

Among them, `-p android` is used to switch to the android platform, because if you do not specify a platform, the target program of the current host platform will be compiled by default.

Generally, if there is no special requirement, the above configuration can complete the compilation of the android native program. Currently, xmake has built-in support for the generation of three types of target files: binary, static, and shared, which correspond to executable programs and .a static libraries. .so dynamic library.






#### Global configuration of NDK paths

The `xmake f/config` command is only for the configuration of the current project. If you often need to set the ndk path again during cross-platform compilation and configuration switching, it is still a little tedious.

We can set it through the `xmake g/global` global configuration command to ensure it takes effect permanently.

```bash
$ xmake g --ndk=~/xxx/android-ndk-r19c
```

We can also ensure the permanent effect by setting the `ANDROID_NDK_HOME` global environment variable, which is similar to the effect of the above command configuration.

#### Automatic detection of NDK paths

Generally, even if the ndk path is not configured, xmake will still try to detect some common paths by default. For example, under macos, it will automatically detect whether the following paths exist:

```
~/Library/Android/sdk/ndk-bundle
```

This is the SDK directory automatically created by android studio after downloading the Mac, and the common place for the ndk.

Or try to probe from the environment variable `ANDROID_NDK_HOME`, if it exists.

If it can be detected, there is no need to configure it manually.

### C++ STL library configuration switch

First, let’s introduce the three stl library versions provided by ndk.

* stlport: the stl library built in early ndk, now basically obsolete
* gnustl: stl library mainly used before ndk r16b, but since r16b, it has also been removed by google
* llvm-c++: newer ndk built-in stl libraries after r16b

Therefore, when we compile the android library, we need to choose stl and choose the appropriate ndk version according to our needs. Xmake usually uses the llvm-c++ library by default if possible. If it finds that the current ndk version is older, it will try to degrade Go to gnustl.

Users can also manually modify the version of the stl library, for example:

```bash
$ xmake f -p android --ndk=xxxx --ndk_cxxstl=gnustl_shared
```

Specifically, for the configuration value of the ndk_cxxstl option, you can type help to view, `xmake f --help`, mainly:

* `llvmstl_static`
* `llvmstl_shared`
* `gnustl_static`
* `gnustl_shared`
* `stlport_static`
* `stlport_shared`

### API Version Settings

If during the compilation process, some libc library symbols are not found, it is usually possible that the api version is not set correctly, because some libc functions exist only in higher version apis.

At this time, we can solve it by trying to manually modify the api version:

```bash
$ xmake f -p android --ndk=xxx --ndk_sdkver=16
```

### Switch compilation architecture

At present xmake provides configuration of these architectures `armv7-a`,` arm64-v8a`, `armv5te`,` mips`, `mips64`,` i386`, `x86_64`. If arch is not specified, then armv7 will be used by default. Architecture.

Manually modify the arch as follows:

```bash
$ xmake f -p android --ndk=xxx -a arm64-v8a
```

### Android related configuration settings

If the project needs to configure some compilation settings unique to the android platform, such as adding specific macro switches, link libraries, etc., you can use `is_plat("android")` to determine the processing in xmake.lua.

```lua
target ("test")
    set_kind ("shared")
    add_files ("src/*. c")
    if is_plat ("android") then
        add_defines ("ANDROID")
        add_syslinks ("log")
    end
```

### FAQ

#### What should I do if I cannot find some libc/stl library header files?

You can try to modify the stl library version and api version to solve it. For example, ndk r16b recommends using the gnustl library, because this version of the llvmc++ library has just been integrated shortly, there are many problems, and it is easy to encounter various compilation problems during use.

```bash
$ xmake f -p android --ndk=xxxx --ndk_cxxstl=gnustl_shared --ndk_sdkver=16
```

#### The compiled executable does not run on the device?

Usually the api version is set too high, causing incompatibility issues, you can try to reduce the api version.