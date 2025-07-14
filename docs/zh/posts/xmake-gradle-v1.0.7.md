---
title: xmake-gradle v1.0.7 发布, 集成xmake快速构建Android JNI程序
tags: [xmake, lua, C/C++, android, jni]
date: 2020-04-17
author: Ruki
---

[xmake-gradle](https://github.com/xmake-io/xmake-gradle)是一个无缝整合 xmake 的 gradle 插件。

目前在 gradle 中做 android jni 相关集成开发，有两种方式，通过 ndkBuild 或者 CMake 来支持，gradle 也内置了这两工具的集成

但是维护 Android.mk 还是非常繁琐的，尤其是对于大型项目会比较痛苦，而 cmake 的 dsl 语法不够简洁直观，我个人也不是很喜欢，因此我先前整了 xmake 来实现跨平台开发，优势就是: 简单，快速，对新手友好，另外功能也很强大，具体有那些功能，大家可以到 xmake 项目主页看下相关介绍。

而之前想要用 xmake 编译 android so 库，只能通过命令行的方式比如:

```bash
xmake f -p android --ndk=xxxx
xmake
```

虽然已经很简单了，但是如果要跟 android apk/aar 一起打包集成，还是需要很多额外的工作，为了提高开发者的效率，我最近新整了这个 grafle 插件，来无缝集成到 gradle 的整个构建体系中去。

这样，用户就可以在 android studio 方便的用 xmake 来编译 jni 库，以及自动集成了。

另外，相关 gradle 配置基本跟 cmake 和 ndkbuild 的保持一致，大部分都是兼容的，切换成本也会降低很多。

欢迎大家来试试哦，新鲜出炉的插件，如果你想要了解更多，请参考：中

* [项目源码](https://github.com/xmake-io/xmake-gradle)
* [官方文档](/zh/guide/extensions/builtin-plugins#gradle)

## 准备工作

我们需要先安装好对应的xmake命令行工具，关于安装说明见：[xmake](https://github.com/xmake-io/xmake)。

## 应用插件

### 通过插件DSL集成

```
plugins {
  id 'org.tboox.gradle-xmake-plugin' version '1.0.7'
}
```

### 被废弃的插件集成方式

```
buildscript {
  repositories {
    maven {
      url "https://plugins.gradle.org/m2/"
    }
  }
  dependencies {
    classpath 'org.tboox:gradle-xmake-plugin:1.0.7'
  }
  repositories {
    mavenCentral()
  }
}

apply plugin: "org.tboox.gradle-xmake-plugin"
```

## 配置

### 最简单的配置示例

如果我们添加`xmake.lua`文件到`projectdir/jni/xmake.lua`，那么我们只需要在build.gradle中启用生效了xmake指定下对应的JNI工程路径即可。

#### build.gradle

```
android {
    externalNativeBuild {
        xmake {
            path "jni/xmake.lua"
        }
    }
}
```







#### JNI

JNI工程结构

```
projectdir
  - src
    - main
      - java
  - jni
    - xmake.lua
    - *.cpp
```

xmake.lua:

```lua
add_rules("mode.debug", "mode.release")
target("nativelib")
    set_kind("shared")
    add_files("nativelib.cc")
```

### 更多Gradle配置说明

```
android {
    defaultConfig {
        externalNativeBuild {
            xmake {
                // 追加设置全局c编译flags
                cFlags "-DTEST"

                // 追加设置全局c++编译flags
                cppFlags "-DTEST", "-DTEST2"

                // 设置切换编译模式，与`xmake f -m debug`的配置对应，具体模式值根据自己的xmake.lua设置而定
                buildMode "debug"

                // 设置需要编译的abi列表，支持：armeabi, armeabi-v7a, arm64-v8a, x86, x86_64
                // 如果没有设置的话，我们也支持从defaultConfig.ndk.abiFilters中获取abiFilters
                abiFilters "armeabi-v7a", "arm64-v8a"
            }
        }
    }

    externalNativeBuild {
        xmake {
            // 设置jni工程中xmake.lua根文件路径，这是必须的，不设置就不会启用jni编译
            path "jni/xmake.lua"

            // 启用详细输出，会显示完整编译命令行参数，其他值：verbose, warning, normal
            logLevel "verbose"

            // 指定c++ stl库，默认不指定会使用c++_static，其他值：c++_static/c++_shared, gnustl_static/gnustl_shared, stlport_static/stlport_shared
            stl "c++_shared"

            // 设置xmake可执行程序路径（通常不用设置）
            // program /usr/local/bin/xmake

            // 禁用stdc++库，默认是启用的
            // stdcxx false

            // 设置其他指定的ndk目录路径 （这是可选的，默认xmake会自动从$ANDROID_NDK_HOME或者`~/Library/Android/sdk/ndk-bundle`中检测）
            // 当然如果用户通过`xmake g --ndk=xxx`配置了全局设置，也会自动从这个里面检测
            // ndk "/Users/ruki/files/android-ndk-r20b/"

            // 设置ndk中sdk版本
            // sdkver 21
        }
    }
}
```

## 编译JNI

### 编译JNI并且生成APK

当`gradle-xmake-plugin`插件被应用生效后，`xmakeBuild`任务会自动注入到现有的`assemble`任务中去，自动执行jni库编译和集成。

```console
$ ./gradlew app:assembleDebug
> Task :nativelib:xmakeConfigureForArm64
> Task :nativelib:xmakeBuildForArm64
>> xmake build
[ 50%]: ccache compiling.debug nativelib.cc
[ 75%]: linking.debug libnativelib.so
[100%]: build ok!
>> install artifacts to /Users/ruki/projects/personal/xmake-gradle/nativelib/libs/arm64-v8a
> Task :nativelib:xmakeConfigureForArmv7
> Task :nativelib:xmakeBuildForArmv7
>> xmake build
[ 50%]: ccache compiling.debug nativelib.cc
[ 75%]: linking.debug libnativelib.so
[100%]: build ok!
>> install artifacts to /Users/ruki/projects/personal/xmake-gradle/nativelib/libs/armeabi-v7a
> Task :nativelib:preBuild
> Task :nativelib:assemble
> Task :app:assembleDebug
```

### 强制重建JNI

```console
$ ./gradlew nativelib:xmakeRebuild
```
