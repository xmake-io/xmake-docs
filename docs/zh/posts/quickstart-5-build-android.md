---
title: xmake从入门到精通5：Android平台编译详解
tags: [xmake, lua, android, jni]
date: 2019-11-15
author: Ruki
---

xmake是一个基于Lua的轻量级现代化c/c++的项目构建工具，主要特点是：语法简单易上手，提供更加可读的项目维护，实现跨平台行为一致的构建体验。

本文主要详细讲解如何通过xmake编译可在android下运行的库和可执行程序。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

### 准备工作

首先，我们需要先准备好编译android native库必须的ndk工具链，如果还没有可以从官网下载解压即可：[Android NDK](https://developer.android.com/ndk/)

如果是为了获取更好的向下兼容性，可以选择r16版本，因为这个是最后一个支持armeabi的版本，如果没什么特别需求，可以直接下载最新版。

### NDK集成和编译

#### 手动配置NDK

我们只需要将解压后ndk目录路径传递给xmake完成配置，可以直接编译了，例如：

```bash
$ xmake f -p android --ndk=~/downloads/android-ndk-r19c
$ xmake
```

其中，`-p android`用于切换到android平台，因为如果不指定平台，默认会编译当前主机平台的target程序。

通常，如果没特殊需求，上面的配置就可以完成android native程序的编译，目前xmake内置支持：binary, static, shared这三种基础target类型文件的生成，分别对应可执行程序，.a静态库，.so动态库。





#### NDK路径的全局配置

`xmake f/config`命令仅仅是针对当前项目的配置，如果经常跨平台编译和配置切换都要重新设置一遍ndk路径，那么还是稍显繁琐。

我们可以通过`xmake g/global`全局配置命令来设置它，确保永久生效。

```bash
$ xmake g --ndk=~/xxx/android-ndk-r19c
```

我们也可以通过设置`ANDROID_NDK_HOME`全局环境变量来确保永久生效，这跟上述命令配置的效果是差不多的。

#### NDK路径的自动探测

通常情况下即使没有配置ndk路径，xmake还是会尝试默认检测一些常用路径，比如在macos下会自动探测是否存在以下路径：

```
~/Library/Android/sdk/ndk-bundle
```

这是mac下装完android studio自动创建的sdk目录，以及ndk的常用放置路径。

或者尝试从ANDROID_NDK_HOME这种环境变量中探测，如果存在的话。

如果能探测到，也就没必要再额外手动配置了。

### C++ STL库配置切换

首先，我们先来介绍下，ndk提供的三种stl库版本

* stlport：早期ndk内置的stl库，现在基本已废弃
* gnustl：ndk r16b之前主要使用的stl库，但是自从r16b之后，也已经被google去掉了
* llvm-c++：r16b之后较新的ndk内置的stl库

因此，我们在编译android库的时候，需要根据自己的需求，选用stl，以及选用合适的ndk版本，而xmake通常会尽可能默认使用llvm-c++库，如果发现当前ndk版本比较老，会尝试退化到gnustl上去。

用户也可以手动修改stl库的版本，例如：

```bash
$ xmake f -p android --ndk=xxxx --ndk_cxxstl=gnustl_shared
```

具体，关于ndk_cxxstl选项的配置值，可以敲help查看，`xmake f --help`，主要就是：

* `llvmstl_static`
* `llvmstl_shared`
* `gnustl_static`
* `gnustl_shared`
* `stlport_static`
* `stlport_shared`

### API版本设置

如果在编译过程中，报出一些libc库符号找不到，通常有可能是api版本没设置对，因为有些libc函数，只有在高版本api下才存在。

这个时候，我们可以通过尝试手动修改api版本来解决：

```bash
$ xmake f -p android --ndk=xxx --ndk_sdkver=16
```

### arch的编译切换

目前xmake提供 `armv7-a`, `arm64-v8a`, `armv5te`, `mips`, `mips64`, `i386`,`x86_64`这些架构的配置编译，如果没有指定arch，那么默认会使用armv7架构。

手动修改arch方式如下：

```bash
$ xmake f -p android --ndk=xxx -a arm64-v8a
```

### Android相关配置设置

如果项目中需要配置一些只有android平台才有的编译设置，比如添加特定宏开关，链接库等，可以在xmake.lua中，通过`is_plat("android")`来判断处理。

```lua
target("test")
    set_kind("shared")
    add_files("src/*.c")
    if is_plat("android") then
        add_defines("ANDROID")
        add_syslinks("log")
    end
```

### FAQ

#### 遇到一些libc/stl库头文件找不到怎么办？

可以尝试修改stl库版本，和api版本来解决，比如ndk r16b 推荐使用gnustl库，因为这个版本的llvmc++库刚集成进去不久，问题比较多，使用过程中容易遇到各种编译问题。

```bash
$ xmake f -p android --ndk=xxxx --ndk_cxxstl=gnustl_shared --ndk_sdkver=16
```

#### 编译生成的可执行程序在设备上运行不起来？

通常是api版本设置太高，导致的不兼容问题，可以尝试调低api版本。