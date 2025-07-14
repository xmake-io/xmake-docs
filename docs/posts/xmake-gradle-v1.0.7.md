---
title: xmake-gradle v1.0.7 released, Integrate xmake to quickly build Android JNI program
tags: [xmake, lua, C/C++, android, jni]
date: 2020-04-17
author: Ruki
---

[xmake-gradle](https://github.com/xmake-io/xmake-gradle) is a gradle plugin that integrates xmake seamlessly. 

At present, there are two ways to do integrated development of android jni in gradle. It is supported by ndkBuild or CMake. Gradle also has built-in integration of these two tools.

However, maintaining Android.mk is still very tedious, especially for large projects, and the dsl syntax of cmake is not simple and intuitive, and I personally don't like it very much. Therefore, I have used xmake to implement cross-platform development. It's simple, fast, friendly to novices, and it's also very powerful. You can go to the xmake project homepage to see the introduction.

In the past, if you want to use xmake to compile the android so library, you can only use the command line, such as:

```bash
xmake f -p android --ndk=xxxx
xmake
```

Although it is very simple, but if you want to package and integrate with android apk/aar, still need a lot of extra work. In order to improve the efficiency of developers, I recently reorganized this gradle plugin to seamlessly integrate into the entire gradle build System.

In this way, users can easily use xmake to compile the jni library in android studio, and automatic integration.

In addition, the relevant gradle configuration is basically the same as cmake and ndkbuild, most of them are compatible, and the switching cost will also be reduced a lot.

Everyone is welcome to try it, the newly released plugin, if you want to know more, please refer to:

* [项目源码](https://github.com/xmake-io/xmake-gradle)
* [官方文档](/zh/guide/extensions/builtin-plugins#gradle)

## Prerequisites

XMake installed on the system. Available [here](https://github.com/xmake-io/xmake).

## Apply the plugin

### plugins DSL

```
plugins {
  id 'org.tboox.gradle-xmake-plugin' version '1.0.7'
}
```

### Legacy plugin application

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

## Configuation

### Simplest Example

We add `xmake.lua` to `projectdir/jni/xmake.lua` and enable xmake in build.gradle.

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

The JNI project structure:

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

### More Gradle Configuations

```
android {
    defaultConfig {
        externalNativeBuild {
            xmake {
                // append the global cflags (optional)
                cFlags "-DTEST"

                // append the global cppflags (optional)
                cppFlags "-DTEST", "-DTEST2"

                // switch the build mode to `debug` for `xmake f -m debug` (optional)
                buildMode "debug"

                // set abi filters (optional), e.g. armeabi, armeabi-v7a, arm64-v8a, x86, x86_64
                // we can also get abiFilters from defaultConfig.ndk.abiFilters
                abiFilters "armeabi-v7a", "arm64-v8a"
            }
        }
    }

    externalNativeBuild {
        xmake {
            // enable xmake and set xmake.lua project file path
            path "jni/xmake.lua"

            // enable verbose output (optional), e.g. verbose, warning, normal
            logLevel "verbose"

            // set c++stl (optional), e.g. c++_static/c++_shared, gnustl_static/gnustl_shared, stlport_static/stlport_shared
            stl "c++_shared"

            // set the given xmake program path (optional)
            // program /usr/local/bin/xmake

            // disable stdc++ library (optional)
            // stdcxx false

            // set the given ndk directory path (optional)
            // ndk "/Users/ruki/files/android-ndk-r20b/"

            // set sdk version of ndk (optional)
            // sdkver 21
        }
    }
}
```

## Build

### Build JNI and generate apk

The `xmakeBuild` will be injected to `assemble` task automatically if the gradle-xmake-plugin has been applied.

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

### Force to rebuild JNI

```console
$ ./gradlew nativelib:xmakeRebuild
```
