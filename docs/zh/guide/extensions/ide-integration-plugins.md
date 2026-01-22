---
title: IDE 集成插件
---

# IDE 集成插件 {#ide-integration-plugins}

## VSCode 插件 {#vscode-plugin}

* [xmake-vscode](https://github.com/xmake-io/xmake-vscode)

<img src="https://raw.githubusercontent.com/xmake-io/xmake-vscode/master/res/problem.gif" width="650px" />

[VSCode](https://code.visualstudio.com/) 是常用的文本编辑器，xmake 提供了插件支持。

### 插件安装 {#plugin-installation}

由于 VSCode 本身只提供了文本编辑功能，我们需要安装插件以支持配置、编译、调试、语法提示等功能：

* XMake
* C/C++
* CodeLLDB

在完成插件的安装后，重启 VSCode 可以看到下方的状态栏：

![](/assets/img/guide/vscode_status_bar.png)

可以在状态栏设置平台、架构、编译模式、工具链等选项，随后点击 Build 开始构建。

### 调试支持 {#debugging-support}

xmake-vscode 插件提供了完整的断点调试支持，支持多种调试器类型：

#### 调试器类型
- **default**: 自动选择合适的调试器（macOS 默认使用 CodeLLDB，其他平台使用 GDB）
- **codelldb**: 使用 CodeLLDB 调试器（推荐用于 macOS）
- **lldb-dap**: 使用 LLVM 官方 LLDB DAP 调试器
- **gdb-dap**: 使用 GDB DAP 调试器（需要 C/C++ 插件支持）

#### 调试环境要求

**必需的 VSCode 插件：**
- **CodeLLDB**: 用于 macOS 和 Linux 调试（推荐安装 `vadimcn.vscode-lldb`）
- **C/C++**: 用于 GDB DAP 调试支持（安装 `ms-vscode.cpptools`）
- **LLDB DAP**: 用于官方 LLDB 调试（安装 `llvm-vs-code-extensions.lldb-dap`）

**系统调试器要求：**
- **macOS**: 需要安装 Xcode Command Line Tools（包含 `lldb` 命令）
- **Linux**: 需要安装 `gdb` 或 `lldb` 调试器
- **Windows**: 需要 Visual Studio Build Tools 或 MinGW-w64（包含 `gdb`）

**安装命令：**
```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt install gdb

# CentOS/RHEL
sudo yum install gdb

# Windows (使用 Chocolatey)
choco install gdb
```

#### 调试配置
xmake-vscode 插件会自动生成调试配置并传递给调试器，用户无需手动创建 `launch.json`。

如果需要覆盖内部调试配置，可以使用 `xmake.customDebugConfig` 设置：

```json
{
  "xmake.customDebugConfig": {
    "stopAtEntry": false,
    "args": ["--custom-arg"],
    "env": {
      "CUSTOM_ENV": "value"
    }
  }
}
```

### 配置选项 {#configuration-options}

插件支持丰富的配置选项，可在 VSCode 设置中配置：

#### 基础配置
```json
{
  "xmake.executable": "xmake",
  "xmake.logLevel": "normal",
  "xmake.buildLevel": "normal",
  "xmake.runMode": "runOnly"
}
```

#### 路径配置
```json
{
  "xmake.buildDirectory": "${workspaceRoot}/build",
  "xmake.installDirectory": "",
  "xmake.packageDirectory": "",
  "xmake.workingDirectory": "${workspaceRoot}",
  "xmake.compileCommandsDirectory": ".vscode"
}
```

#### 工具链配置
```json
{
  "xmake.androidNDKDirectory": "",
  "xmake.QtDirectory": "",
  "xmake.WDKDirectory": ""
}
```

#### IntelliSense 配置
```json
{
  "xmake.compileCommandsBackend": "clangd",
  "xmake.autoGenerateCompileCommands": "onFileChange",
  "xmake.compileCommandsDirectory": ".vscode",
  "xmake.enableSyntaxCheck": true
}
```

> **提示**: 关于这些配置选项的详细说明（如自动生成模式、生成路径等），请跳转到下面的 [配置 IntelliSense](#intellisense) 章节。

#### 调试配置
```json
{
  "xmake.debugConfigType": "default",
  "xmake.debuggingTargetsArguments": {
    "default": ["--debug"],
    "mytarget": ["--arg1", "--arg2"]
  },
  "xmake.runningTargetsArguments": {
    "default": []
  },
  "xmake.envBehaviour": "merge"
}
```

#### 状态栏配置
```json
{
  "xmake.status.showProject": false,
  "xmake.status.showXMake": true,
  "xmake.status.showPlatform": false,
  "xmake.status.showArch": false,
  "xmake.status.showMode": false,
  "xmake.status.showToolchain": false,
  "xmake.status.showTarget": false,
  "xmake.status.showBuild": true,
  "xmake.status.showRun": true,
  "xmake.status.showDebug": true
}
```

### 自定义选项 {#custom-options}

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

#### IntelliSense 配置

```json
{
  "xmake.compileCommandsBackend": "clangd",
  "xmake.autoGenerateCompileCommands": "onFileChange",
  "xmake.compileCommandsDirectory": ".vscode",
  "xmake.enableSyntaxCheck": true
}
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

## Intellij IDEA/CLion 插件 {#clion-plugin}

* [xmake-idea](https://github.com/xmake-io/xmake-idea)

<img src="https://raw.githubusercontent.com/xmake-io/xmake-idea/master/res/problem.gif" width="650px" />

**CLion 2025.3+ 版本新特性**: 支持 lldb/gdb-dap 调试，现在可以直接调试 Xmake 项目，不再需要通过生成 `CMakeLists.txt` 来变相支持调试。支持设置断点、单步调试和查看变量值。

调试配置界面：

<img src="/assets/img/posts/xmake/xmake-idea-dap-debug-conf.png" width="650px" />

运行时调试界面：

<img src="/assets/img/posts/xmake/xmake-idea-dap-debug-run.png" width="650px" />

此外，插件还增加了自动更新 `compile_commands.json` 的支持，以改进 C++ 代码的自动补全和高亮体验。

<img src="/assets/img/posts/xmake/xmake-idea-update-compd.png" width="650px" />

## Neovim 插件 {#neovim-plugin}

* [xmake.nvim](https://github.com/Mythos-404/xmake.nvim) (第三方开发, 感谢[@Mythos_404](https://github.com/Mythos-404))

该插件提供了易用的配置UI和自动生成*compile_commands.json*文件

<img src="https://raw.githubusercontent.com/Mythos-404/xmake.nvim/main/assets/XmakePreview.gif" width="650px" />

## Zed 编辑器插件 {#zed-plugin}

* [xmake-zed](https://github.com/xmake-io/xmake-zed)

[Zed](https://zed.dev/) 是一个高性能的多人协作代码编辑器，xmake 为其提供了插件支持。

### 插件安装

Zed 编辑器插件提供了与 xmake 的无缝集成，提供以下功能：

- 项目配置和构建管理
- 实时构建状态和错误报告
- 通过 compile_commands.json 生成支持 IntelliSense
- 快速访问常用 xmake 命令

> **注意**: 插件正在提交到 Zed 官方市场，等待审核中 ([PR #4565](https://github.com/zed-industries/extensions/pull/4565))。在此期间，您可以通过本地安装方式使用：

#### 本地安装

1. 克隆插件仓库：
   ```sh
   git clone https://github.com/xmake-io/xmake-zed.git
   ```

2. 在 Zed 中打开插件目录：
   - 打开 Zed 编辑器
   - 转到 `Zed > Extensions`
   - 点击 `Load Extension` 并选择克隆的 `xmake-zed` 目录

#### 市场安装（未来支持）

等待官方审核通过后，您可以直接在 Zed 中转到 `Zed > Extensions`，然后搜索 `xmake` 并安装官方插件。

### 使用方法 {#zed-usage}

安装后，插件将自动检测工作区中的 xmake 项目并提供以下功能：

- **完整的 LSP 支持**: 通过 xmake_ls 提供代码补全、诊断、悬停信息、代码操作、符号导航和格式化
- **语法高亮**: 支持 300+ XMake API 函数的语法高亮
- **项目模板**: 支持 25+ 项目模板，涵盖 15 种编程语言
- **自动安装**: 自动下载和安装 xmake_ls 语言服务器

> **提示**: 插件会自动下载和安装 xmake_ls 语言服务器，无需手动配置。

### 配置 {#zed-configuration}

插件支持以下主要配置选项：

```json
{
  "lsp": {
    "xmake-ls": {
      "settings": {
        "linuxVariant": "auto",
        "logLevel": "Info",
        "enableDiagnostics": true,
        "enableCompletion": true,
        "enableHover": true,
        "enableCodeActions": true,
        "xmakePath": ""
      }
    }
  }
}
```

主要配置项：
- **linuxVariant**: Linux 二进制变体（auto/musl/x64 等）
- **logLevel**: 日志级别（Error/Warning/Info/Debug/Trace）
- **enableDiagnostics/Completion/Hover/CodeActions**: 启用/禁用各项功能
- **xmakePath**: xmake 可执行文件路径

## Gradle插件（JNI）{#gradle-plugin}

* [xmake-gradle](https://github.com/xmake-io/xmake-gradle): 一个无缝整合 xmake 的 gradle 插件

### 通过插件 DSL 集成 {#gradle-dsl-integration}

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

### 最简单的配置示例 {#gradle-simple-example}

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

### 编译JNI并且生成APK {#gradle-build-apk}

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

### 强制重建JNI {#gradle-force-rebuild}

```sh
$ ./gradlew nativelib:xmakeRebuild
```

## Sublime 插件 {#sublime-plugin}

* [xmake-sublime](https://github.com/xmake-io/xmake-sublime)

<img src="https://raw.githubusercontent.com/xmake-io/xmake-sublime/master/res/problem.gif" width="650px" />

## Vim 插件 {#vim-plugin}

* [xmake.vim](https://github.com/luzhlon/xmake.vim) (第三方开发, 感谢[@luzhlon](https://github.com/luzhlon))
