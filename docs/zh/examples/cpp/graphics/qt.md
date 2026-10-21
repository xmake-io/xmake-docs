---
title: "Xmake 构建 Qt 工程：Widgets、Quick 与库示例"
description: "使用 Xmake 创建与配置 Qt 应用和库，了解 Qt SDK 探测、工程模板，并查看 Widgets、Quick 和静态库等完整源码示例。"
---

# 用 Xmake 构建 Qt 工程

创建一个空工程：

```sh
$ xmake create -t qt.console test
$ xmake create -t qt.static test
$ xmake create -t qt.shared test
$ xmake create -t qt.quickapp test
$ xmake create -t qt.widgetapp test
```

更多工程模板见：`xmake create --help`

默认会自动探测Qt环境，当然也可以指定Qt SDK环境目录：

```sh
$ xmake f --qt=~/Qt/Qt5.9.1
```

如果想要使用 windows 下 MingW 的 Qt 环境，可以切到mingw的平台配置，并且指定下mingw编译环境的sdk路径即可，例如：

```sh
$ xmake f -p mingw --sdk=C:\Qt\Qt5.10.1\Tools\mingw530_32
```

上述指定的 MingW SDK 用的是Qt下Tools目录自带的环境，当然如果有其他第三方 MingW 编译环境，也可以手动指定,
具体可以参考：[MingW 编译配置](/zh/guide/basic-commands/build-configuration#mingw)。

更多详情可以参考：[#160](https://github.com/xmake-io/xmake/issues/160)

另外，当前xmake也支持Qt/Wasm，详情见：[Wasm 配置](/zh/guide/basic-commands/build-configuration#wasm-webassembly)

```sh
$ xmake f -p wasm
```

## 静态库程序 {#static-library}

<FileExplorer rootFilesDir="examples/cpp/graphics/qt/static_library" />

## 动态库程序 {#shared-library}

<FileExplorer rootFilesDir="examples/cpp/graphics/qt/shared_library" />

## 控制台程序 {#console}

<FileExplorer rootFilesDir="examples/cpp/graphics/qt/console" />

## Quick 应用程序 {#quickapp}

<FileExplorer rootFilesDir="examples/cpp/graphics/qt/quickapp" />

::: tip 注意
如果使用的自己编译的static版本QT SDK，那么需要切换到`add_rules("qt.quickapp_static")`静态规则才行，因为链接的库是不同的，需要做静态链接。
:::

接下来，我们尝试编译下，通常，如果是使用Qt的安装包默认安装，也没有修改安装路径，那么大部分情况下都是可以自动检测到QT SDK的根路径，例如：

```sh
$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.15
checking for the Qt SDK directory ... /Users/ruki/Qt5.13.2/5.13.2/clang_64
checking for the Qt SDK version ... 5.13.2
[  0%]: cache compiling.release src/main.cpp
[ 49%]: compiling.qt.qrc src/qml.qrc
[100%]: linking.release test
build ok!
```

然后我们继续运行下它：

```sh
$ xmake run
```

效果如下：

![](/assets/img/guide/qt_quickapp.png)

## Quick Plugin 程序 {#quick-plugin}

<FileExplorer rootFilesDir="examples/cpp/graphics/qt/quickplugin" />

## Widgets 应用程序 {#widgetapp}

<FileExplorer rootFilesDir="examples/cpp/graphics/qt/widgetapp" />

::: tip 注意
如果使用的自己编译的static版本QT SDK，那么需要切换到`add_rules("qt.widgetapp_static")`静态规则才行，因为链接的库是不同的，需要做静态链接。
:::

运行效果如下：

![](/assets/img/guide/qt_widgetapp.png)


## Android 应用程序 {#android-app}

2.2.6 之后版本，可以直接切到android平台编译Quick/Widgets应用程序，生成apk包，并且可通过`xmake install`命令安装到设备。

```sh
$ xmake create -t quickapp_qt -l c++ appdemo
$ cd appdemo
$ xmake f -p android --ndk=~/Downloads/android-ndk-r19c/ --android_sdk=~/Library/Android/sdk/ -c
$ xmake
[  0%]: compiling.qt.qrc src/qml.qrc
[ 50%]: cache compiling.release src/main.cpp
[100%]: linking.release libappdemo.so
[100%]: generating.qt.app appdemo.apk
```

然后安装到设备：

```sh
$ xmake install
installing appdemo ...
installing build/android/release/appdemo.apk ..
Success
install ok!👌
```

## 目前支持的 Qt SDK {#supported-qtsdks}

### 来自 Qt 官方提供的 SDK 安装包

在 macos/windows 上通常能自动探测到，但是也可以手动指定 Qt SDK 路径。

```sh
$ xmake f --qt=[qt sdk path]
```

### 来自 Ubuntu Apt 安装包

使用 apt 安装完 Qt SDK，xmake 也能够自动检测到。

```sh
$ sudo apt install -y qtcreator qtbase5-dev
$ xmake
```

### 来自 msys2/pacman 的 Qt Mingw 安装包

xmake 也支持从 pacman 安装的 Qt Mingw SDK

```sh
$ pacman -S mingw-w64-x86_64-qt5 mingw-w64-x86_64-qt-creator
$ xmake
```

### 来自 aqtinstall 脚本的 Qt SDK 包

[aqtinstall](https://github.com/miurahr/aqtinstall) 安装的 Qt SDK 是完全基于官方 SDK 结构的，所以 xmake 也完全支持。

但是，通常需要自己指定 SDK 路径。

```sh
$ xmake f --qt=[Qt SDK]
```

### 跨平台 Qt 交叉编译

对于跨平台 Qt 开发，xmake 支持为主机工具和目标平台使用单独的 SDK。这在为不同于开发机器的平台构建 Qt 应用程序时特别有用。

`--qt_host` 选项允许您指定与构建机器兼容的 Qt 工具的位置，而 `--qt` 指向目标平台的 SDK：

```sh
$ xmake f --qt=[target Qt sdk] --qt_host=[host Qt sdk]
```

::: tip 注意
- 确保主机和目标 Qt 版本匹配，否则可能会导致构建问题。
- 本机部署工具（如 `windeployqt` 和 `macdeployqt`）必须在各自的平台上运行，因此跨平台任务（如 `xmake install`）可能会失败。
:::

### 来自 xmake-repo 仓库的 Qt 包

xmake 现在官方提供了 Qt5 和 Qt6 SDK 的各种模块包，可以自动集成使用，无需任何手动安装。

只需要配置集成包就行了，xmake 会自动处理 Qt 的安装集成，并且自动编译项目。

#### Qt5 示例

```lua
add_rules("mode.debug", "mode.release")

add_requires("qt5widgets")

target("test")
    add_rules("qt.widgetapp")
    add_packages("qt5widgets")

    add_headerfiles("src/*.h")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    -- add files with Q_OBJECT meta (only for qt.moc)
    add_files("src/mainwindow.h")
```

#### Qt6 示例

```lua
add_rules("mode.debug", "mode.release")

add_requires("qt6widgets")

target("test")
    add_rules("qt.widgetapp")
    add_packages("qt6widgets")

    add_headerfiles("src/*.h")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    -- add files with Q_OBJECT meta (only for qt.moc)
    add_files("src/mainwindow.h")
```

除了 `qt6widgets` 包，仓库还提供了 `qt6gui`, `qt6network` 等 Qt6 包，可以使用。

配置完，只需要执行：

```sh
$ xmake
```

::: tip 注意
Qt6 的包现已支持，可同时使用 Qt5 和 Qt6 包。
:::

### 来自 vcpkg/conan 的 Qt 包

暂时还没时间支持，请尽量使用上面的方式集成 Qt SDK。
