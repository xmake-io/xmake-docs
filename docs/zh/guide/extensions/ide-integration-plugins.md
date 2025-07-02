# IDE 集成插件 {#ide-integration-plugins}

## VSCode 插件 {#vscode-plugin}

* [xmake-vscode](https://github.com/xmake-io/xmake-vscode)

<img src="https://raw.githubusercontent.com/xmake-io/xmake-vscode/master/res/problem.gif" width="650px" />

[VSCode](https://code.visualstudio.com/) 是常用的文本编辑器，xmake 提供了插件支持。

### 插件安装

由于 VSCode 本身只提供了文本编辑功能，我们需要安装插件以支持配置、编译、调试、语法提示等功能：

* XMake
* C/C++
* CodeLLDB

在完成插件的安装后，重启 VSCode 可以看到下方的状态栏：

![](/assets/img/guide/vscode_status_bar.png)

可以在状态栏设置平台、架构、编译模式、工具链等选项，随后点击 Build 开始构建。

### 自定义选项

如果这些选项不够，可以创建 .vscode/settings.json 并编写 xmake 需要的设置，如：

```
{
...
  "xmake.additionalConfigArguments": [
    "--my_option=true"
  ],
...
}
```

其他 xmake 的选项也同样可以在 settings.json 中完成设置。修改后可通过 >XMake: Configure 命令刷新配置。

### 配置 IntelliSense {#intellisense}

为了更好的 C++ 语法提示体验，xmake 提供了对 [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)（简称 LSP）的支持。

在 VSCode 中，我们可以通过使用 vscode-cpptools 或 clangd 来提供 intellisense 支持。

另外，为了支持 intellisense，xmake 提供了 compile_commands.json 的生成支持。

#### 生成 compile_commands

##### 自动触发生成

通常在修改 xmake.lua 后点击保存，xmake-vscode 插件就会触发自动生成 compile_commands.json，默认存储在 .vscode 目录下。

这也是推荐方式，通常装完 xmake-vscode 插件，打开带有 xmake.lua 的工程后，只需要编辑 xmake.lua 保存即可触发，不需要任何其他额外操作。

##### 手动触发生成

当然，如果没看到文件被生成，我们也可以在 VSCode 中，使用 `>XMake: UpdateIntellisense` 命令手动触发生成 .vscode/compile_commands.json。

##### 配置 xmake.lua 自动生成

或者，我们也可以使用这个规则来自自动更新生成 compile_commands.json

```lua
add_rules("plugin.compile_commands.autoupdate", {outputdir = ".vscode"})
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

这会使得在每次 build 后，自动更新此文件。

##### 手动执行命令生成

如果上述方式都无效，我们也可以执行命令来生成。

```sh
$ xmake project -k compile_commands .vscode
```

#### vscode-cpptools

如果我们使用 vscode-cpptools 插件来提供 intellisense 支持，需要先去 VSCode 插件市场，搜索 C++，默认第一个插件就是，安装即可。

安装后，这个插件提供了 intellisense 和调试支持。

然后，我们需要配置下 c_cpp_properties.json 文件，关联上我们生成的 `.vscode/compile_commands.json`。

```
{
  "env": {
    "myDefaultIncludePath": ["${workspaceFolder}", "${workspaceFolder}/include"],
    "myCompilerPath": "/usr/local/bin/gcc-7"
  },
  "configurations": [
    {
      "name": "Mac",
      "intelliSenseMode": "clang-x64",
      "includePath": ["${myDefaultIncludePath}", "/another/path"],
      "macFrameworkPath": ["/System/Library/Frameworks"],
      "defines": ["FOO", "BAR=100"],
      "forcedInclude": ["${workspaceFolder}/include/config.h"],
      "compilerPath": "/usr/bin/clang",
      "cStandard": "c11",
      "cppStandard": "c++17",
      "compileCommands": "/path/to/compile_commands.json",
      "browse": {
        "path": ["${workspaceFolder}"],
        "limitSymbolsToIncludedHeaders": true,
        "databaseFilename": ""
      }
    }
  ],
  "version": 4
}
```

也就是上面的 `"compileCommands": "/path/to/compile_commands.json"` 配置项。

关于如果打开这个配置文件，以及更多的配置说明，见：

- https://code.visualstudio.com/docs/cpp/configure-intellisense-crosscompilation
- https://code.visualstudio.com/docs/cpp/c-cpp-properties-schema-reference

当然，理论上可以做到 xmake-vscode 插件自动关联设置这个文件，但考虑到用户不一定使用 cpptools，也有可能会使用 clangd。

因此，默认自动配置并不是很好，而且作者暂时也没有时间和精力去改进它。

#### clangd

与此同时，我们可以选择安装支持 LSP 的语法提示插件，如 LLVM 推出的 [clangd](https://clangd.llvm.org/)，其功能稳定且提示流畅，
并通过 LSP 标准完成对不同编译工具链的支持。

使用 clangd 时，可能与上述的 C/C++ 插件的提示功能有冲突，可以在 .vscode/settings.json 中添加设置将 C/C++ 的语法提示功能关闭：

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

同时由于 XMake 生成的 compile_commands.json 在 .vscode 目录，还需要设置 clangd 参数使其在正确位置寻找：

```
{
  "clangd.arguments": [
    "--compile-commands-dir=.vscode",
...
  ]
...
}
```

如果配置后，还是没生效，可以尝试重启 VSCode 和 clangd 进程，再验证。

## Sublime 插件 {#sublime-plugin}

* [xmake-sublime](https://github.com/xmake-io/xmake-sublime)

<img src="https://raw.githubusercontent.com/xmake-io/xmake-sublime/master/res/problem.gif" width="650px" />

## Intellij IDEA/CLion 插件 {#clion-plugin}

* [xmake-idea](https://github.com/xmake-io/xmake-idea)

<img src="https://raw.githubusercontent.com/xmake-io/xmake-idea/master/res/problem.gif" width="650px" />

## Vim 插件 {#vim-plugin}

* [xmake.vim](https://github.com/luzhlon/xmake.vim) (第三方开发, 感谢[@luzhlon](https://github.com/luzhlon))

## Neovim 插件 {#neovim-plugin}

* [xmake.nvim](https://github.com/Mythos-404/xmake.nvim) (第三方开发, 感谢[@Mythos_404](https://github.com/Mythos-404))

该插件提供了易用的配置UI和自动生成*compile_commands.json*文件

<img src="https://raw.githubusercontent.com/Mythos-404/xmake.nvim/main/assets/XmakePreview.gif" width="650px" />

## Gradle插件（JNI）{#gradle-plugin}

* [xmake-gradle](https://github.com/xmake-io/xmake-gradle): 一个无缝整合 xmake 的 gradle 插件

### 通过插件 DSL 集成

```
plugins {
  id 'org.tboox.gradle-xmake-plugin' version '1.2.3'
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
    classpath 'org.tboox:gradle-xmake-plugin:1.2.3'
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

```sh
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

```sh
$ ./gradlew nativelib:xmakeRebuild
```
