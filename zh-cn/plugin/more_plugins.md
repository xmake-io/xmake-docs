
## VSCode 插件

* [xmake-vscode](https://github.com/xmake-io/xmake-vscode)

<img src="https://raw.githubusercontent.com/xmake-io/xmake-vscode/master/res/problem.gif" width="650px" />

[VSCode](https://code.visualstudio.com/)是常用的文本编辑器，xmake提供了插件支持。

### 插件安装

由于VSCode本身只提供了文本编辑的功能，我们需要安装插件以支持配置，编译，调试，语法提示等功能:

* XMake
* C/C++
* CodeLLDB

在完成插件的安装后，重启VSCode可以看到下方的状态栏:

![](/assets/img/guide/vscode_status_bar.png)

可以在状态栏设置平台，架构，编译模式，工具链等选项，随后点击Build开始构建。

### 自定义选项

如果这些选项不够，可以创建.vscode/settings.json并编写xmake需要的设置，如

```
{
...
  "xmake.additionalConfigArguments": [
    "--my_option=true"
  ],
...
}
```

其他xmake的选项也同样可以在settings.json中完成设置。修改后可通过 >XMake: Configure 命令刷新配置。

### 使用LSP提高开发体验

为了更好的C++语法提示体验，xmake提供了对[Language Server Protocol](https://microsoft.github.io/language-server-protocol/)（简称LSP）的支持，在vscode中，可以使用 `>XMake: UpdateIntellisense` 命令生成.vscode/compile_commands.json（通常在修改xmake.lua时该文件会自动生成）。与此同时，我们可以选择安装支持LSP的语法提示插件，如LLVM推出的[clangd](https://clangd.llvm.org/)，其功能稳定且提示流畅，并通过LSP标准完成对不同编译工具链的支持。

使用clangd时，可能与上述的C/C++插件的提示功能有冲突，可以在.vscode/settings.json中添加设置将C/C++的语法提示功能关闭:

```
{
  "C_Cpp.codeAnalysis.runAutomatically": false,
  "C_Cpp.intelliSenseEngine": "Disabled",
  "C_Cpp.formatting": "Disabled",
  "C_Cpp.autoAddFileAssociations": false,
  "C_Cpp.autocompleteAddParentheses": false,
  "C_Cpp.autocomplete": "Disabled",
  "C_Cpp.errorSquiggles": "Disabled",
...
}
```

同时由于XMake生成的compile_commands.json在.vscode目录，还需要设置clangd传参使其在正确位置寻找:

```
{
  "clangd.arguments": [
    "--compile-commands-dir=.vscode",
...
  ]
...
}
```

## Sublime 插件

* [xmake-sublime](https://github.com/xmake-io/xmake-sublime)

<img src="https://raw.githubusercontent.com/xmake-io/xmake-sublime/master/res/problem.gif" width="650px" />

## Intellij IDEA/CLion 插件

* [xmake-idea](https://github.com/xmake-io/xmake-idea)

<img src="https://raw.githubusercontent.com/xmake-io/xmake-idea/master/res/problem.gif" width="650px" />

## Vim 插件

* [xmake.vim](https://github.com/luzhlon/xmake.vim) (third-party, thanks [@luzhlon](https://github.com/luzhlon))

## Gradle插件（JNI）

* [xmake-gradle](https://github.com/xmake-io/xmake-gradle): 一个无缝整合xmake的gradle插件

### 通过插件DSL集成

```
plugins {
  id 'org.tboox.gradle-xmake-plugin' version '1.0.9'
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
    classpath 'org.tboox:gradle-xmake-plugin:1.0.9'
  }
  repositories {
    mavenCentral()
  }
}

apply plugin: "org.tboox.gradle-xmake-plugin"
```

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

### 编译JNI并且生成APK

当`gradle-xmake-plugin`插件被应用生效后，`xmakeBuild`任务会自动注入到现有的`assemble`任务中去，自动执行jni库编译和集成。

```console
$ ./gradlew app:assembleDebug
> Task :nativelib:xmakeConfigureForArm64
> Task :nativelib:xmakeBuildForArm64
>> xmake build
[ 50%]: cache compiling.debug nativelib.cc
[ 75%]: linking.debug libnativelib.so
[100%]: build ok!
>> install artifacts to /Users/ruki/projects/personal/xmake-gradle/nativelib/libs/arm64-v8a
> Task :nativelib:xmakeConfigureForArmv7
> Task :nativelib:xmakeBuildForArmv7
>> xmake build
[ 50%]: cache compiling.debug nativelib.cc
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
