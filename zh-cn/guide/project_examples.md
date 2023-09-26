

下面我们简单介绍一些常用的工程例子，更多更全的examples工程可以到[project examples](https://github.com/xmake-io/xmake/tree/master/tests/projects)中查看。

我们也可以通过：`xmake create`命令创建各种常用的空工程来快速开始，具体对于这个命令的介绍以及支持的工程模板，可以敲下面的命令查看：

```bash
xmake create --help
```

## 可执行程序

```lua
target("test")
    set_kind("binary")
    add_files("src/*c")
```

完整例子请执行下面的命令来创建：

```bash
xmake create -l c -t console test
```

## 静态库程序

```lua
target("library")
    set_kind("static")
    add_files("src/library/*.c")

target("test")
    set_kind("binary")
    add_files("src/*c")
    add_deps("library")
```

通过`add_deps`将一个静态库自动链接到test可执行程序。

完整例子请执行下面的命令来创建：

```bash
xmake create -l c -t static test
```

## 动态库程序

```lua
target("library")
    set_kind("shared")
    add_files("src/library/*.c")

target("test")
    set_kind("binary")
    add_files("src/*c")
    add_deps("library")
```

通过`add_deps`将一个动态库自动链接到test可执行程序。

完整例子请执行下面的命令来创建：

```bash
xmake create -l c -t shared test
```

## Wasm 程序

所有 c/c++ 程序，我们都可以编译成 Wasm，无需任何 xmake.lua 配置改动，只需要切换到 wasm 编译平台进行编译。

```bash
$ xmake f -p wasm
$ xmake
```

详细的 Wasm 编译配置见：[Wasm 配置](/zh-cn/guide/configuration?id=wasm)

另外，在编译带有 `--preload-file assets/xxx.md` 设置的文件时候，我们也可以通过配置，简化对它的设置。

```lua
target("test5")
    set_kind("binary")
    add_files("src/*.cpp")
    add_values("wasm.preloadfiles", "src/xxx.md")
    add_values("wasm.preloadfiles", "src/xxx2.md")
```

## Qt 程序

创建一个空工程：

v2.2.9以上版本：

```bash
$ xmake create -t qt.console test
$ xmake create -t qt.static test
$ xmake create -t qt.shared test
$ xmake create -t qt.quickapp test
$ xmake create -t qt.widgetapp test
```

更多工程模板见：`xmake create --help`

v2.2.8以前老版本：

```bash
$ xmake create -l c++ -t console_qt test
$ xmake create -l c++ -t static_qt test
$ xmake create -l c++ -t shared_qt test
$ xmake create -l c++ -t quickapp_qt test
```

默认会自动探测Qt环境，当然也可以指定Qt SDK环境目录：

```bash
$ xmake f --qt=~/Qt/Qt5.9.1
```

如果想要使用 windows 下 MingW 的 Qt 环境，可以切到mingw的平台配置，并且指定下mingw编译环境的sdk路径即可，例如：

```bash
$ xmake f -p mingw --sdk=C:\Qt\Qt5.10.1\Tools\mingw530_32
```

上述指定的 MingW SDK 用的是Qt下Tools目录自带的环境，当然如果有其他第三方 MingW 编译环境，也可以手动指定, 具体可以参考：[MingW 编译配置](/zh-cn/guide/configuration?id=mingw)。

更多详情可以参考：[#160](https://github.com/xmake-io/xmake/issues/160)

另外，当前xmake也支持Qt/Wasm，详情见：[Wasm 配置](/zh-cn/guide/configuration?id=wasm)

```bash
$ xmake f -p wasm
```

### 静态库程序

```lua
target("qt_static_library")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

### 动态库程序

```lua
target("qt_shared_library")
    add_rules("qt.shared")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

### 控制台程序

```lua
target("qt_console")
    add_rules("qt.console")
    add_files("src/*.cpp")
```

### Quick 应用程序

v2.2.9以上版本：

```lua
target("qt_quickapp")
    add_rules("qt.quickapp")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
```

!> 如果使用的自己编译的static版本QT SDK，那么需要切换到`add_rules("qt.quickapp_static")`静态规则才行，因为链接的库是不同的，需要做静态链接。

接下来，我们尝试编译下，通常，如果是使用Qt的安装包默认安装，也没有修改安装路径，那么大部分情况下都是可以自动检测到QT SDK的根路径，例如：

```bash
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

```bash
$ xmake run
```

效果如下：

![](/assets/img/guide/qt_quickapp.png)

### Quick Plugin 程序

完整例子见：[quickplugin example](https://github.com/xmake-io/xmake/tree/master/tests/projects/qt/quickplugin)

```lua
add_rules("mode.debug", "mode.release")

target("demo")
    add_rules("qt.qmlplugin")
    add_headerfiles("src/*.h")
    add_files("src/*.cpp")

    set_values("qt.qmlplugin.import_name", "My.Plugin")
```

### Widgets 应用程序

v2.2.9以上版本：

```lua
target("qt_widgetapp")
    add_rules("qt.widgetapp")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- 添加带有 Q_OBJECT 的meta头文件
```

!> 新版本提供了`qt.widgetapp`规则，内置了QtWidgets的内建规则，使用更加简单，下面老版本的`qt.application`还是支持的，向下兼容：

```lua
target("qt_widgetapp")
    add_rules("qt.application")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- 添加带有 Q_OBJECT 的meta头文件
    add_frameworks("QtWidgets")
```

!> 如果使用的自己编译的static版本QT SDK，那么需要切换到`add_rules("qt.widgetapp_static")`静态规则才行，因为链接的库是不同的，需要做静态链接。


运行效果如下：

![](/assets/img/guide/qt_widgetapp.png)

### Android 应用程序

2.2.6之后版本，可以直接切到android平台编译Quick/Widgets应用程序，生成apk包，并且可通过`xmake install`命令安装到设备。

```bash
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

```bash
$ xmake install
installing appdemo ...
installing build/android/release/appdemo.apk ..
Success
install ok!👌
```

### 目前支持的 Qt SDK

#### 来自 Qt 官方提供的 SDK 安装包

在 macos/windows 上通常能自动探测到，但是也可以手动指定 Qt SDK 路径。

```bash
$ xmake f --qt=[qt sdk path]
```

#### 来自 Ubuntu Apt 安装包

使用 apt 安装完 Qt SDK，xmake 也能够自动检测到。

```bash
$ sudo apt install -y qtcreator qtbase5-dev
$ xmake
```

#### 来自 msys2/pacman 的 Qt Mingw 安装包

xmake 也支持从 pacman 安装的 Qt Mingw SDK

```bash
$ pacman -S mingw-w64-x86_64-qt5 mingw-w64-x86_64-qt-creator
$ xmake
```

#### 来自 aqtinstall 脚本的 Qt SDK 包

[aqtinstall](https://github.com/miurahr/aqtinstall) 安装的 Qt SDK 是完全基于官方 SDK 结构的，所以 xmake 也完全支持。

但是，通常需要自己指定 SDK 路径。

```bash
$ xmake f --qt=[Qt SDK]
```

#### 来自 xmake-repo 仓库的 Qt 包

xmake 现在官方提供了 Qt5 SDK 的各种模块包，可以自动集成使用，无需任何手动安装。

只需要配置集成包就行了，xmake 会自动处理 Qt 的安装集成，并且自动编译项目。

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

除了 `qt5widgets` 包，仓库还提供了 `qt5gui`, `qt5network` 等包，可以使用。

配置完，只需要执行：

```bash
$ xmake
```

!> Qt6 的包还在开发中，暂时仅仅只支持 Qt5

#### 来自 vcpkg/conan 的 Qt 包

暂时还没时间支持，请尽量使用上面的方式集成 Qt SDK。

## WDK驱动程序

默认会自动探测wdk所在环境，当然也可以指定wdk sdk环境目录：

```bash
$ xmake f --wdk="G:\Program Files\Windows Kits\10" -c
$ xmake
```

更多详情可以参考：[#159](https://github.com/xmake-io/xmake/issues/159)

相关完整工程example见：[WDK examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/windows/driver)

### umdf驱动程序

```lua
target("echo")
    add_rules("wdk.driver", "wdk.env.umdf")
    add_files("driver/*.c")
    add_files("driver/*.inx")
    add_includedirs("exe")

target("app")
    add_rules("wdk.binary", "wdk.env.umdf")
    add_files("exe/*.cpp")
```

### kmdf驱动程序

```lua
target("nonpnp")
    add_rules("wdk.driver", "wdk.env.kmdf")
    add_values("wdk.tracewpp.flags", "-func:TraceEvents(LEVEL,FLAGS,MSG,...)", "-func:Hexdump((LEVEL,FLAGS,MSG,...))")
    add_files("driver/*.c", {rule = "wdk.tracewpp"})
    add_files("driver/*.rc")

target("app")
    add_rules("wdk.binary", "wdk.env.kmdf")
    add_files("exe/*.c")
    add_files("exe/*.inf")
```

### wdm驱动程序

```lua
target("kcs")
    add_rules("wdk.driver", "wdk.env.wdm")
    add_values("wdk.man.flags", "-prefix Kcs")
    add_values("wdk.man.resource", "kcsCounters.rc")
    add_values("wdk.man.header", "kcsCounters.h")
    add_values("wdk.man.counter_header", "kcsCounters_counters.h")
    add_files("*.c", "*.rc", "*.man")
```

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    add_values("wdk.tracewpp.flags", "-func:TracePrint((LEVEL,FLAGS,MSG,...))")
    add_files("*.c", {rule = "wdk.tracewpp"})
    add_files("*.rc", "*.inf")
    add_files("*.mof|msdsm.mof")
    add_files("msdsm.mof", {values = {wdk_mof_header = "msdsmwmi.h"}})
```

### 生成驱动包

可以通过以下命令生成.cab驱动包：

```bash
$ xmake [p|package]
$ xmake [p|package] -o outputdir
```

输出的目录结构如下：

```
  - drivers
    - sampledsm
       - debug/x86/sampledsm.cab
       - release/x64/sampledsm.cab
       - debug/x86/sampledsm.cab
       - release/x64/sampledsm.cab
```

### 驱动签名

默认编译禁用签名，可以通过`set_values("wdk.sign.mode", ...)`设置签名模式来启用签名。

#### 测试签名

测试签名一般本机调试时候用，可以使用xmake自带的test证书来进行签名，例如：

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
```

不过这种情况下，需要用户手动在管理员模式下，执行一遍：`$xmake l utils.wdk.testcert install`，来生成和注册test证书到本机环境。
这个只需要执行一次就行了，后续就可以正常编译和签名了。

当然也可以使用本机已有的有效证书去签名。

从sha1来选择合适的证书进行签名：

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
    set_values("wdk.sign.thumbprint", "032122545DCAA6167B1ADBE5F7FDF07AE2234AAA")
```

从store/company来选择合适的证书进行签名：

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
    set_values("wdk.sign.store", "PrivateCertStore")
    set_values("wdk.sign.company", "tboox.org(test)")
```

#### 正式签名

通过指定对应的正式签名证书文件进行签名：

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "release")
    set_values("wdk.sign.company", "xxxx")
    set_values("wdk.sign.certfile", path.join(os.projectdir(), "xxxx.cer"))
```

### 生成低版本驱动

如果想在wdk10环境编译生成win7, win8等低版本系统支持的驱动，可以通过设置`wdk.env.winver`来切换系统版本：

```lua
set_values("wdk.env.winver", "win10")
set_values("wdk.env.winver", "win10_rs3")
set_values("wdk.env.winver", "win81")
set_values("wdk.env.winver", "win8")
set_values("wdk.env.winver", "win7")
set_values("wdk.env.winver", "win7_sp1")
set_values("wdk.env.winver", "win7_sp2")
set_values("wdk.env.winver", "win7_sp3")
```

我们也可以手动指定编译的目标程序支持的windows版本：

```bash
$ xmake f --wdk_winver=[win10_rs3|win8|win7|win7_sp1]
$ xmake
```

## WinSDK程序

```lua
target("usbview")
    add_rules("win.sdk.application")

    add_files("*.c", "*.rc")
    add_files("xmlhelper.cpp", {rule = "win.sdk.dotnet"})
```

更多详情可以参考：[#173](https://github.com/xmake-io/xmake/issues/173)

## MFC程序

### MFC静态库

```lua
target("test")
    add_rules("win.sdk.mfc.static")
    add_files("src/*.c")
```

### MFC动态库

```lua
target("test")
    add_rules("win.sdk.mfc.shared")
    add_files("src/*.c")
```

### MFC应用程序（静态链接）

```lua
target("test")
    add_rules("win.sdk.mfc.static_app")
    add_files("src/*.c")
```

### MFC应用程序（动态链接）

```lua
target("test")
    add_rules("win.sdk.mfc.shared_app")
    add_files("src/*.c")
```

## iOS/MacOS程序

### App应用程序

用于生成*.app/*.ipa应用程序，同时支持iOS/MacOS。

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
```

!> 2.5.7 之后，可以支持直接添加 `*.metal` 文件，xmake 会自动生成 default.metallib 提供给应用程序加载使用。

#### 创建工程

我们也可以通过模板工程快速创建：

```bash
$ xmake create -t xcode.macapp -l objc test
$ xmake create -t xcode.iosapp -l objc test
```

#### 编译

```bash
$ xmake f -p [iphoneos|macosx]
$ xmake
[ 18%]: compiling.xcode.release src/Assets.xcassets
[ 27%]: processing.xcode.release src/Info.plist
[ 72%]: compiling.xcode.release src/Base.lproj/Main.storyboard
[ 81%]: compiling.xcode.release src/Base.lproj/LaunchScreen.storyboard
[ 45%]: cache compiling.release src/ViewController.m
[ 63%]: cache compiling.release src/AppDelegate.m
[ 54%]: cache compiling.release src/SceneDelegate.m
[ 36%]: cache compiling.release src/main.m
[ 90%]: linking.release test
[100%]: generating.xcode.release test.app
[100%]: build ok!
```

#### 配置签名

对于iOS程序，默认会检测系统先用可用签名来签名app，当然我们也可以手动指定其他签名证书：

```bash
$ xmake f -p iphoneos --xcode_codesign_identity='Apple Development: xxx@gmail.com (T3NA4MRVPU)' --xcode_mobile_provision='iOS Team Provisioning Profile: org.tboox.test --xcode_bundle_identifier=org.tboox.test'
$ xmake
```

如果每次这么配置签名觉得繁琐的话，可以设置到`xmake global`全局配置中，也可以在xmake.lua中对每个target单独设置：

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
    add_values("xcode.bundle_identifier", "org.tboox.test")
    add_values("xcode.codesign_identity", "Apple Development: xxx@gmail.com (T3NA4MRVPU)")
    add_values("xcode.mobile_provision", "iOS Team Provisioning Profile: org.tboox.test")
```

那如何知道我们需要的签名配置呢？一种就是在xcode里面查看，另外xmake也提供了一些辅助工具可以dump出当前可用的所有签名配置：

```bash
$ xmake l private.tools.codesign.dump
==================================== codesign identities ====================================
{
  "Apple Development: waruqi@gmail.com (T3NA4MRVPU)" = "AF73C231A0C35335B72761BD3759694739D34EB1"
}

===================================== mobile provisions =====================================
{
  "iOS Team Provisioning Profile: org.tboox.test" = "<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>AppIDName</key>
	<string>XC org tboox test5</string>
	<key>ApplicationIdentifierPrefix</key>
	<array>
	<string>43AAQM58X3</string>
...
```

我们也提供了其他辅助工具来对已有的ipa/app程序进行重签名，例如：

```bash
$ xmake l utils.ipa.resign test.ipa|test.app [codesign_identity] [mobile_provision] [bundle_identifier]
```

其中，后面的签名参数都是可选的，如果没设置，那么默认会探测使用一个有效的签名：

```bash
$ xmake l utils.ipa.resign test.ipa
$ xmake l utils.ipa.resign test.app "Apple Development: waruqi@gmail.com (T3NA4MRVPU)"
$ xmake l utils.ipa.resign test.ipa "Apple Development: waruqi@gmail.com (T3NA4MRVPU)" iOS Team Provisioning Profile: org.tboox.test" org.tboox.test
```

#### 运行应用程序

目前仅支持运行macos程序：

```bash
$ xmake run
```

效果如下：

![](/assets/img/guide/macapp.png)

#### 生成程序包

如果是iOS程序会生成ipa安装包，如果是macos会生成dmg包（dmg包生成暂时还在开发中）。

```bash
$ xmake package
output: build/iphoneos/release/arm64/test.ipa
package ok!
```

我们也提供了辅助工具，来对指定app程序进行打包：

```bash
$ xmake l utils.ipa.package test.app output.ipa [iconfile.png]
```

#### 安装

如果是iOS程序会安装ipa到设备，如果是macos会安装app到/Applications目录。

```bash
$ xmake install
```

我们也提供了辅助工具，来对指定ipa/app程序安装到设备：

```bash
$ xmake l utils.ipa.install test.app
$ xmake l utils.ipa.install test.ipa
```

#### 卸载

!> 目前仅支持macos程序卸载

```bash
$ xmake uninstall
```

### Framework库程序

```lua
target("test")
    add_rules("xcode.framework")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

我们也可以通过模板工程快速创建：

```bash
$ xmake create -t xcode.framework -l objc test
```

另外，xmake v2.3.9 以上版本，xmake 还提供了带有 framework 库使用的完整 iosapp/macapp 空工程模板，可以完整体验 framework 的编译，依赖使用以及集成到 app 应用程序中。

同时，如果我们开启了模拟器，xmake 可以支持直接 `xmake install` 和 `xmake run` 将 app 安装到模拟器并加载运行。

```bash
$ xmake create -t xcode.iosapp_with_framework -l objc testapp
$ cd testapp
$ xmake f -p iphoneos -a x86_64
$ xmake
$ xmake install
$ xmake run
```

### Bundle程序

```lua
target("test")
    add_rules("xcode.bundle")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

我们也可以通过模板工程快速创建：

```bash
$ xmake create -t xcode.bundle -l objc test
```

## Protobuf程序

### 使用c库

```lua
add_requires("protobuf-c")

target("console_c")
    set_kind("binary")
    add_packages("protobuf-c")
    add_rules("protobuf.c")
    add_files("src/*.c")
    add_files("src/*.proto")
```

我们还可以设置 `proto_public = true` 来导出 proto 的头文件搜索目录，开放给其他父 target 继承使用。

```lua
    add_packages("protobuf-c", {public = true})
    add_files("src/**.proto", {proto_public = true})
```

注：由于 protobuf 生成的头文件引用了 protobuf-c 包的头文件，因此，我们也需要将包的头文件标记为 `{public = true}` 对外导出它。

### 使用c++库

```lua
add_requires("protobuf-cpp")

target("console_c++")
    set_kind("binary")
    set_languages("c++11")
    add_packages("protobuf-cpp")
    add_rules("protobuf.cpp")
    add_files("src/*.cpp")
    add_files("src/*.proto")
```

我们还可以设置 `proto_public = true` 来导出 proto 的头文件搜索目录，开放给其他父 target 继承使用。

```lua
    add_packages("protobuf-cpp", {public = true})
    add_files("src/**.proto", {proto_public = true})
```

注：由于 protobuf 生成的头文件引用了 protobuf-cpp 包的头文件，因此，我们也需要将包的头文件标记为 `{public = true}` 对外导出它。

## Cuda程序

创建一个空工程：

```bash
$ xmake create -P test -l cuda
$ cd test
$ xmake
```

```lua
-- define target
target("cuda_console")
    set_kind("binary")
    add_files("src/*.cu")
    -- generate SASS code for SM architecture of current host
    add_cugencodes("native")
    -- generate PTX code for the virtual architecture to guarantee compatibility
    add_cugencodes("compute_30")
```

!> 从v2.2.7版本开始，默认构建会启用device-link。（参见 [Separate Compilation and Linking of CUDA C++ Device Code](https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/)）
如果要显式禁用device-link，可以通过 `set_policy("build.cuda.devlink", false)` 来设置。

!> cuda 源文件中的 device 函数需要被 device-link 且只 device-link 一次。在 `shared` 或 `binary` 的 target 上 xmake 会自动进行 device-link ，这时它们依赖的 `static` target 也会同时被 device-link ，因此默认情况下 `static` target 不会被 device-link。然而，如果最终的 `shared` 或 `binary` 的 target 不包含任何 cuda 源文件，则不会发生 device-link 阶段，导致出现 undefined reference 错误。这种情况下，需要手动为 `static` target 指定 `add_values("cuda.build.devlink", true)`.

默认会自动探测cuda环境，当然也可以指定Cuda SDK环境目录，或者指定cuda版本（此时将在默认安装目录进行查找）：

```bash
$ xmake f --cuda=/usr/local/cuda-9.1/
$ xmake f --cuda=9.1
$ xmake
```

更多详情可以参考：[#158](https://github.com/xmake-io/xmake/issues/158)

## Lex & Yacc程序

```lua
target("calc")
    set_kind("binary")
    add_rules("lex", "yacc")
    add_files("src/*.l", "src/*.y")
```

## OpenMP 程序

v2.6.1 以后，改进了 openmp 的配置，更加简化和统一，我们不再需要额外配置 rules，仅仅通过一个通用的 openmp 包就可以实现相同的效果。

```lua
add_requires("openmp")
target("loop")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("openmp")
```

v2.5.9 之前的版本

```lua
add_requires("libomp", {optional = true})
target("loop")
    set_kind("binary")
    add_files("src/*.cpp")
    add_rules("c++.openmp")
    add_packages("libomp")
```

如果是c代码，需要启用 `add_rules("c.openmp")`，如果是 c/c++ 混合编译，那么这两个规则都要设置。

## Fortran程序

v2.3.6之后版本开始支持gfortran编译器来编译fortran项目，我们可以通过下面的命令，快速创建一个基于fortran的空工程：

v2.3.8之后，xmake 还支持 Intel Fortran Compiler，只需要切换下工具链即可：`xmake f --toolchain=ifort`

```bash
$ xmake create -l fortran -t console test
```

它的xmake.lua内容如下：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.f90")
```

更多代码例子可以到这里查看：[Fortran Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/fortran)

## Go程序

xmake也支持go程序的构建，也提供了空工程的创建命令支持:

```bash
$ xmake create -l go -t console test
```

xmake.lua内容如下:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.go")
```

v2.3.6版本，xmake对其的构建支持做了一些改进，对go的交叉编译也进行了支持，例如我们可以在macOS和linux上编译windows程序：

```bash
$ xmake f -p windows -a x86
```

另外，新版本对go的第三方依赖包管理也进行了初步支持：

```lua
add_rules("mode.debug", "mode.release")

add_requires("go::github.com/sirupsen/logrus", {alias = "logrus"})
add_requires("go::golang.org/x/sys/internal/unsafeheader", {alias = "unsafeheader"})
if is_plat("windows") then
    add_requires("go::golang.org/x/sys/windows", {alias = "syshost"})
else
    add_requires("go::golang.org/x/sys/unix", {alias = "syshost"})
end

target("test")
    set_kind("binary")
    add_files("src/*.go")
    add_packages("logrus", "syshost", "unsafeheader")
```

不过还有一些不完善的地方，比如目前必须手动配置所有级联依赖包，会稍微繁琐些，后续有待改进。

更多例子见：[Go Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/go)

## Dlang程序

创建空工程：

```bash
$ xmake create -l dlang -t console test
```

xmake.lua内容：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.d")
```

v2.3.6版本开始，xmake增加了对dub包管理的支持，可以快速集成dlang的第三方依赖包：

```lua
add_rules("mode.debug", "mode.release")

add_requires("dub::log 0.4.3", {alias = "log"})
add_requires("dub::dateparser", {alias = "dateparser"})
add_requires("dub::emsi_containers", {alias = "emsi_containers"})
add_requires("dub::stdx-allocator", {alias = "stdx-allocator"})
add_requires("dub::mir-core", {alias = "mir-core"})

target("test")
    set_kind("binary")
    add_files("src/*.d")
    add_packages("log", "dateparser", "emsi_containers", "stdx-allocator", "mir-core")
```

不过还有一些不完善的地方，比如目前必须手动配置所有级联依赖包，会稍微繁琐些，后续有待改进。

更多例子见：[Dlang Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/dlang)

## Rust程序

创建空工程：

```bash
$ xmake create -l rust -t console test
```

xmake.lua内容：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/main.rs")
```

更多例子见：[Rust Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/rust)

### 添加 Cargo 包依赖

例子: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cargo_deps

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::base64 0.13.0")
add_requires("cargo::flate2 1.0.17", {configs = {features = "zlib"}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::base64", "cargo::flate2")
```

### 集成 Cargo.toml 的依赖包

上面直接使用 `add_requires("cargo::base64 0.13.0")` 的方式集成依赖，会有一个问题：

如果依赖很多，并且有几个依赖都共同依赖了相同的子依赖，那么会出现重定义问题，因此如果我们使用完整的 Cargo.toml 去管理依赖就不会存在这个问题。

例如：

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::test", {configs = {cargo_toml = path.join(os.projectdir(), "Cargo.toml")}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::test")
```

完整例子见：[cargo_deps_with_toml](https://github.com/xmake-io/xmake/blob/dev/tests/projects/rust/cargo_deps_with_toml/xmake.lua)

### 使用 cxxbridge 在 c++ 中调用 rust

例子: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cxx_call_rust_library

```lua
add_rules("mode.debug", "mode.release")

add_requires("cargo::cxx 1.0")

target("foo")
    set_kind("static")
    add_files("src/foo.rs")
    set_values("rust.cratetype", "staticlib")
    add_packages("cargo::cxx")

target("test")
    set_kind("binary")
    add_rules("rust.cxxbridge")
    add_deps("foo")
    add_files("src/main.cc")
    add_files("src/bridge.rsx")
```

foo.rs

```rust
#[cxx::bridge]
mod foo {
    extern "Rust" {
        fn add(a: i32, b: i32) -> i32;
    }
}

pub fn add(a: i32, b: i32) -> i32 {
    return a + b;
}
```

我们还需要在 c++ 项目中添加桥接文件 bridge.rsx

```rust
#[cxx::bridge]
mod foo {
    extern "Rust" {
        fn add(a: i32, b: i32) -> i32;
    }
}
```

main.cc

```c++
#include <stdio.h>
#include "bridge.rs.h"

int main(int argc, char** argv) {
    printf("add(1, 2) == %d\n", add(1, 2));
    return 0;
}
```

### 在 Rust 中调用 C++

例子: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/rust_call_cxx_library

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("static")
    add_files("src/foo.cc")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.rs")
```

main.rs

```rust
extern "C" {
	fn add(a: i32, b: i32) -> i32;
}

fn main() {
    unsafe {
	    println!("add(1, 2) = {}", add(1, 2));
    }
}
```

foo.cc

```c++
extern "C" int add(int a, int b) {
    return a + b;
}
```

## Swift程序

创建空工程：

```bash
$ xmake create -l swift -t console test
```

xmake.lua内容：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.swift")
```

更多例子见：[Swift Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/swift)

## Objc程序

创建空工程：

```bash
$ xmake create -l objc -t console test
```

xmake.lua内容：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.m")
```

更多例子见：[Objc Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/objc++)

## Zig程序

创建空工程：

```bash
$ xmake create -l zig -t console test
```

xmake.lua内容：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.zig")
```

更多例子见：[Zig Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/zig)

## Linux Bpf 程序

从 2.5.3 之后开始支持 bpf 程序构建，同时支持 linux 以及 android 平台，能够自动拉取 llvm 和 android ndk 工具链。

更多详情见：[#1274](https://github.com/xmake-io/xmake/issues/1274)

```lua
add_rules("mode.release", "mode.debug")
add_rules("platform.linux.bpf")

add_requires("linux-tools", {configs = {bpftool = true}})
add_requires("libbpf")
if is_plat("android") then
    add_requires("ndk >=22.x")
    set_toolchains("@ndk", {sdkver = "23"})
else
    add_requires("llvm >=10.x")
    set_toolchains("@llvm")
    add_requires("linux-headers")
end

target("minimal")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("linux-tools", "linux-headers", "libbpf")
    set_license("GPL-2.0")
```

## Vala 程序

2.5.7 之后开始支持构建 Vala 程序，我们需要应用 `add_rules("vala")` 规则，并且 glib 包是必须的。

相关 issues: [#1618](https://github.com/xmake-io/xmake/issues/1618)

`add_values("vala.packages")` 用于告诉 valac，项目需要哪些包，它会引入相关包的 vala api，但是包的依赖集成，还是需要通过 `add_requires("lua")` 下载集成。

### 控制台程序

```lua
add_rules("mode.release", "mode.debug")

add_requires("lua", "glib")

target("test")
    set_kind("binary")
    add_rules("vala")
    add_files("src/*.vala")
    add_packages("lua", "glib")
    add_values("vala.packages", "lua")
```

### 静态库程序

v2.5.8 之后，我们继续支持构建库程序，能够通过 `add_values("vala.header", "mymath.h")` 设置导出的接口头文件名，通过 `add_values("vala.vapi", "mymath-1.0.vapi")` 设置导出的 vapi 文件名。

```lua
add_rules("mode.release", "mode.debug")

add_requires("glib")

target("mymath")
    set_kind("static")
    add_rules("vala")
    add_files("src/mymath.vala")
    add_values("vala.header", "mymath.h")
    add_values("vala.vapi", "mymath-1.0.vapi")
    add_packages("glib")

target("test")
    set_kind("binary")
    add_deps("mymath")
    add_rules("vala")
    add_files("src/main.vala")
    add_packages("glib")
```

### 动态库程序

```lua
add_rules("mode.release", "mode.debug")

add_requires("glib")

target("mymath")
    set_kind("shared")
    add_rules("vala")
    add_files("src/mymath.vala")
    add_values("vala.header", "mymath.h")
    add_values("vala.vapi", "mymath-1.0.vapi")
    add_packages("glib")

target("test")
    set_kind("binary")
    add_deps("mymath")
    add_rules("vala")
    add_files("src/main.vala")
    add_packages("glib")
```

更多例子：[Vala examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/vala)

## Pascal 程序

2.5.8 之后，我们能够支持构建 Pascal 程序，相关 issues 见：[#388](https://github.com/xmake-io/xmake/issues/388)

### 控制台程序

```lua
add_rules("mode.debug", "mode.release")
target("test")
    set_kind("binary")
    add_files("src/*.pas")
```

### 动态库程序

```lua
add_rules("mode.debug", "mode.release")
target("foo")
    set_kind("shared")
    add_files("src/foo.pas")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.pas")
```

更多例子：[Pascal examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/pascal)

## Swig 模块

2.5.8 版本支持构建 Swig 模块，我们提供了 `swig.c` 和 `swig.cpp` 规则，分别对应支持生成 c/c++ 模块接口代码，配合 xmake 的包管理系统实现完全自动化的模块和依赖包整合。

相关 issues: [#1622](https://github.com/xmake-io/xmake/issues/1622)

### Lua/C 模块

```lua
add_rules("mode.release", "mode.debug")
add_requires("lua")

target("example")
    add_rules("swig.c", {moduletype = "lua"})
    add_files("src/example.i", {swigflags = "-no-old-metatable-bindings"})
    add_files("src/example.c")
    add_packages("lua")
```

### Python/C 模块

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.c", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.c")
    add_packages("python")
```

### Python/C++ 模块

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.cpp", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.cpp")
    add_packages("python")
```

## C++20 模块

### 快速开始

xmake 采用 `.mpp` 作为默认的模块扩展名，但是也同时支持 `.ixx`, `.cppm`, `.mxx` 等扩展名。

目前 xmake 已经完整支持 gcc11/clang/msvc 的 C++20 Modules 构建支持，并且能够自动分析模块间的依赖关系，实现最大化并行编译。

```lua
set_languages("c++20")
target("class")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

更多例子见：[C++ Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules)

### Cpp-Only 工程

v2.7.1 版本对 C++20 模块的实现进行了重构和升级，新增了对 Headerunits 的支持，我们可以在模块中引入 Stl 和 用户头文件模块。

相关的补丁见：[#2641](https://github.com/xmake-io/xmake/pull/2641)。

注：通常我们至少需要添加一个 `.mpp` 文件，才能开启 C++20 modules 编译，如果只有 cpp 文件，默认是不会开启模块编译的。

但是，如果我们仅仅只是想在 cpp 文件中使用模块的 Headerunits 特性，比如引入一些 stl Headerunits 在 cpp 中使用，
那么我们也可以通过设置 `set_policy("build.c++.modules", true)` 来强行开启 C++ Modules 编译，例如：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    set_languages("c++20")
    set_policy("build.c++.modules", true)
```

### 模块的分发和集成

#### 分发 C++ Modules 包

我们先使用 xmake.lua 维护模块的构建，并通过指定 `{install = true}`，来告诉 xmake 哪些模块文件需要安装对外分发。

```lua
add_rules("mode.release", "mode.debug")
set_languages("c++20")

target("foo")
    set_kind("static")
    add_files("*.cpp")
    add_files("*.mpp", { install = true })
```

然后，我们把它做成包，可以提交到 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库，当然也可以直接做成本地包，或者私有仓库包。

这里，为了方便测试验证，我们仅仅通过 `set_sourcedir` 将它做成本地包。

```lua
package("foo")
    set_sourcedir(path.join(os.scriptdir(), "src"))
    on_install(function(package)
        import("package.tools.xmake").install(package, {})
    end)
```

#### 集成 C++ Modules 包

然后，我们通过 `add_requires("foo")` 的包集成接口，对 C++ Modules 包进行快速集成使用。

由于 foo 的模块包，我们放在私有仓库中定义，所以我们通过 `add_repositories("my-repo my-repo")` 引入自己的包仓库。

如果，包已经提交到 xmake-repo 官方仓库，就不需要额外配置它。

```lua
add_rules("mode.release", "mode.debug")
set_languages("c++20")

add_repositories("my-repo my-repo")
add_requires("foo", "bar")

target("packages")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("foo", "bar")
    set_policy("build.c++.modules", true)
```

集成好包后，我们就可以执行 `xmake` 命令，一键下载、编译、集成 C++ Modules 包来使用。

```bash
$ xmake
checking for platform ... linux
checking for architecture ... x86_64
note: install or modify (m) these packages (pass -y to skip confirm)?
in my-repo:
  -> foo latest
  -> bar latest
please input: y (y/n/m)

  => install bar latest .. ok
  => install foo latest .. ok
[  0%]: generating.module.deps src/main.cpp
[  0%]: generating.module.deps /mnt/xmake/tests/projects/c++/modules/packages/build/.packages/b/bar/latest/4e0143c97b65425b855ad5fd03038b6a/modules/bar/bar.mpp
[  0%]: generating.module.deps /mnt/xmake/tests/projects/c++/modules/packages/build/.packages/f/foo/latest/4e0143c97b65425b855ad5fd03038b6a/modules/foo/foo.mpp
[ 14%]: compiling.module.release bar
[ 14%]: compiling.module.release foo
[ 57%]: compiling.release src/main.cpp
[ 71%]: linking.release packages
[100%]: build ok!
```

注：每个包安装后，会在包路径下，存储维护模块的 meta-info 文件，这是 `p2473r1.pdf` 中约定的一种格式规范，也许它不是最终的标准，但这并不影响我们现在去使用模块的分发。

```bash
$ cat ./build/.packages/f/foo/latest/4e0143c97b65425b855ad5fd03038b6a/modules/foo/foo.mpp.meta-info
{"_VENDOR_extension":{"xmake":{"name":"foo","file":"foo.mpp"}},"definitions":{},"include_paths":{}}
```

完整的例子工程见：[C++ Modules 包分发例子工程](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules/packages)

### 支持 C++23 Std Modules

[Arthapz](https://github.com/Arthapz) 也帮忙改进了对 C++23 Std Modules 的支持。

目前三个编译器对它的支持进展：

#### Msvc

最新 Visual Studio 17.5 preview 已经支持，并且非标准的 ifc std modules 将被废弃。

对于标准的 C++23 std modules，我们是这么引入的。

```c
import std;
```

而对于 ifc std modules，我们需要这么写：

```
import std.core;
```

它不是 C++23 标准，仅仅 msvc 提供，对其他编译器并不兼容，以后新版本 msvc 中也会逐步废弃。
因此新版本 Xmake 将仅仅 C++23 std modules，不再支持废弃的 ifc std modules。

#### Clang

目前最新的 clang 似乎也还没完全支持 C++23 std modules，当前还是 draft patch 状态，[#D135507](https://reviews.llvm.org/D135507)。

但是，Xmake 也对它进行了支持，如果大家想要尝鲜，可以自行合入这个 patch，然后使用 xmake 来测试。

另外，低版本的 clang 也有对非标准的 std modules 做了实验性支持。

我们还是可以在低版本 clang 中尝试性使用 xmake 来构建 std modules，尽管它可能还只是个玩具（会遇到很多问题）。

相关讨论见：[#3255](https://github.com/xmake-io/xmake/pull/3255)

#### Gcc

目前还不支持。

## 合并静态库

### 自动合并 target 库

2.5.8 之后，我们可以通过设置 `build.merge_archive` 策略，启用自动合并依赖的所有静态库，例如：

```lua
add_rules("mode.debug", "mode.release")

target("add")
    set_kind("static")
    add_files("src/add.c")
    add_files("src/subdir/add.c")

target("sub")
    set_kind("static")
    add_files("src/sub.c")
    add_files("src/subdir/sub.c")

target("mul")
    set_kind("static")
    add_deps("add", "sub")
    add_files("src/mul.c")
    set_policy("build.merge_archive", true)
```

mul 静态库自动合并了 add 和 sub 静态库，生成一个包含 add/sub 代码的完整 libmul.a 库。

这个合并相对比较稳定完善，支持 ar 和 msvc/lib.exe，也支持交叉编译工具链生成的静态库合并，也支持带有重名 obj 文件的静态库。

### 合并指定的静态库文件

如果自动合并不满足需求，我们也可以主动调用 `utils.archive.merge_archive` 模块在 `after_link` 阶段合并指定的静态库列表。

```lua
target("test")
    after_link(function (target)
        import("utils.archive.merge_staticlib")
        merge_staticlib(target, "libout.a", {"libfoo.a", "libbar.a"})
    end)
```

### 使用 add_files 合并静态库

其实，我们之前的版本已经支持通过 `add_files("*.a")` 来合并静态库。

```lua
target("test")
    set_kind("binary")
    add_files("*.a")
    add_files("*.c")
```

但是它有一些缺陷：如果使用 ar，可能会存在 .obj 对象文件同名冲突导致合并失败，因此推荐使用上文介绍的合并方式，更加的稳定可靠，也更加的简单。

相关 issues: [#1638](https://github.com/xmake-io/xmake/issues/1638)

## Nim 程序

v2.5.9 之后，我们新增了对 Nimlang 项目的支持，相关 issues 见：[#1756](https://github.com/xmake-io/xmake/issues/1756)

### 创建空工程

我们可以使用 `xmake create` 命令创建空工程。

```bash
xmake create -l nim -t console test
xmake create -l nim -t static test
xmake create -l nim -t shared test
```

### 控制台程序

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
```

```bash
$ xmake -v
[ 33%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache -o:b
uild/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

### 静态库程序

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("static")
    add_files("src/foo.nim")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.nim")
```

```bash
$ xmake -v
[ 33%]: linking.release libfoo.a
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/foo/macosx/x86_64/release/nimcache --app
:staticlib --noMain --passC:-DNimMain=NimMain_B6D5BD02 --passC:-DNimMainInner=NimMainInner_B6D5B
D02 --passC:-DNimMainModule=NimMainModule_B6D5BD02 --passC:-DPreMain=PreMain_B6D5BD02 --passC:-D
PreMainInner=PreMainInner_B6D5BD02 -o:build/macosx/x86_64/release/libfoo.a src/foo.nim
[ 66%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache --pa
ssL:-Lbuild/macosx/x86_64/release --passL:-lfoo -o:build/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

### 动态库程序

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("shared")
    add_files("src/foo.nim")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.nim")
```

```bash
$ xmake -rv
[ 33%]: linking.release libfoo.dylib
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/foo/macosx/x86_64/release/nimcache --app
:lib --noMain -o:build/macosx/x86_64/release/libfoo.dylib src/foo.nim
[ 66%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache --pa
ssL:-Lbuild/macosx/x86_64/release --passL:-lfoo -o:build/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

### C 代码混合编译

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    set_kind("static")
    add_files("src/*.c")

target("test")
    set_kind("binary")
    add_deps("foo")
    add_files("src/main.nim")
```

### Nimble 依赖包集成

完整例子见：[Nimble Package Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/nim/nimble_package)

```lua
add_rules("mode.debug", "mode.release")

add_requires("nimble::zip >0.3")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
    add_packages("nimble::zip")
```

main.nim

```nim
import zip/zlib

echo zlibVersion()
```

### Native 依赖包集成

完整例子见：[Native Package Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/nim/native_package)

```lua
add_rules("mode.debug", "mode.release")

add_requires("zlib")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
    add_packages("zlib")
```

main.nim

```nim
proc zlibVersion(): cstring {.cdecl, importc}

echo zlibVersion()
```

## Keil/MDK 嵌入式程序

相关例子工程：[Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/embed/mdk/hello)

xmake 会自动探测 Keil/MDK 安装的编译器，相关 issues [#1753](https://github.com/xmake-io/xmake/issues/1753)。

使用 armcc 编译

```bash
$ xmake f -p cross -a cortex-m3 --toolchain=armcc -c
$ xmake
```

使用 armclang 编译

```bash
$ xmake f -p cross -a cortex-m3 --toolchain=armclang -c
$ xmake
```

### 可执行程序

```lua
target("hello")
    add_deps("foo")
    add_rules("mdk.binary")
    add_files("src/*.c", "src/*.s")
    add_includedirs("src/lib/cmsis")
    set_runtimes("microlib")
```

需要注意的是，目前一些 mdk 程序都使用了 microlib 库运行时，它需要编译器加上 `__MICROLIB` 宏定义，链接器加上 `--library_type=microlib` 等各种配置。

我们可以通过 `set_runtimes("microlib")` 直接设置到 microlib 运行时库，可以自动设置上所有相关选项。

### 静态库程序

```lua
add_rules("mode.debug", "mode.release")

target("foo")
    add_rules("mdk.static")
    add_files("src/foo/*.c")
    set_runtimes("microlib")
```

## Keil/C51 嵌入式程序

### 可执行程序

```lua
target("hello")
    add_rules("c51.binary")
    set_toolchains("c51")
    add_files("src/main.c")
```

## Linux 内核驱动模块

v2.6.2 版本，xmake 完整支持了 Linux 内核驱动模块的构建，这也许首个也是唯一一个支持编译 Linux 内核驱动的第三方构建工具了。

### Hello world 模块

完整例子：[Linux Kernel Driver Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/linux/driver/hello)

它的配置非常简单，只需要配置上支持模块的 linux-headers 包，然后应用 `platform.linux.driver` 构建规则就行了。

```lua
add_requires("linux-headers", {configs = {driver_modules = true}})

target("hello")
    add_rules("platform.linux.driver")
    add_files("src/*.c")
    add_packages("linux-headers")
    set_license("GPL-2.0")
```

然后直接执行 xmake 命令，一键编译，生成内核驱动模块 hello.ko。

```bash
$ xmake
[ 20%]: cache compiling.release src/add.c
[ 20%]: cache compiling.release src/hello.c
[ 60%]: linking.release build/linux/x86_64/release/hello.ko
[100%]: build ok!
```

我们也可以看完整构建命令参数。

```bash
$ xmake -v
[ 20%]: cache compiling.release src/add.c
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno-80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect-branch-register -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"add\" -o build/.objs/hello/linux/x86_64/release/src/add.c.o src/add.c
[ 20%]: cache compiling.release src/hello.c
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno-80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect-branch-register -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"hello\" -o build/.objs/hello/linux/x86_64/release/src/hello.c.o src/hello.c
[ 60%]: linking.release build/linux/x86_64/release/hello.ko
/usr/bin/ld -m elf_x86_64 -r -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.o build/.objs/hello/linux/x86_64/release/src/add.c.o build/.objs/hello/linux/x86_64/release/src/hello.c.o
/usr/src/linux-headers-5.11.0-41-generic/scripts/mod/modpost -m -a -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/Module.symvers -e -N -T -
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno-80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect-branch-register -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod.o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod.c
/usr/bin/ld -m elf_x86_64 -r --build-id=sha1 -T /usr/src/linux-headers-5.11.0-41-generic/scripts/module.lds -o build/linux/x86_64/release/hello.ko build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod.o

```

通过 `add_requires("linux-headers", {configs = {driver_modules = true}})` 配置包，xmake 会自动优先从系统中查找对应的 linux-headers 包。

如果没找到，xmake 也会自动下载它，然后自动配置构建带有 driver modules 的内核源码后，使用它继续构建内核模块。

### 自定义 linux-headers 路径

自从 v2.6.2 版本发布，有很多用户反馈，大多数情况下，linux 内核驱动构建都是基于定制版的 linux kernel，因此需要能够自定义配置 linux-headers 路径，而不是走远程依赖包模式。

其实，我们通过自己重写 linux-headers 包，也是可以做到这一点的。

```lua
package("linux-headers")
    on_fetch(function (package, opt)
        return {includedirs = "/usr/src/linux-headers-5.0/include"}
    end)
package_end()

add_requires("linux-headers")

target("test")
    add_rules("platform.linux.driver")
    add_files("src/*.c")
    add_packages("linux-headers")
```

不过这样，也许还有点繁琐，因此在 v2.6.3 版本，我们支持更加方便的设置 linux-headers 路径。

```lua
target("hello")
    add_rules("platform.linux.driver")
    add_files("src/*.c")
    set_values("linux.driver.linux-headers", "/usr/src/linux-headers-5.11.0-41-generic")
```

我们也可以通过定义 option 选项，将 linux-headers 路径作为 `xmake f --linux-headers=/usr/src/linux-headers` 的方式传入。

```lua
option("linux-headers", {showmenu = true, description = "Set linux-headers path."})
target("hello")
    add_rules("platform.linux.driver")
    add_files("src/*.c")
    set_values("linux.driver.linux-headers", "$(linux-headers)")
```

更多详情见：[#1923](https://github.com/xmake-io/xmake/issues/1923)

### 交叉编译

我们也支持内核驱动模块的交叉编译，比如在 Linux x86_64 上使用交叉编译工具链来构建 Linux Arm/Arm64 的驱动模块。

我们只需要准备好自己的交叉编译工具链，通过 `--sdk=` 指定它的根目录，然后配置切换到 `-p cross` 平台， 最后指定需要构建的架构 arm/arm64 即可。

这里用到的交叉工具链，可以从这里下载: [Download toolchains](https://releases.linaro.org/components/toolchain/binaries/latest-7/aarch64-linux-gnu/)

更多，交叉编译配置文档，见：[配置交叉编译](/zh-cn/guide/configuration?id=common-cross-compilation-configuration)

!> 目前仅仅支持 arm/arm64 交叉编译架构，后续会支持更多的平台架构。

#### 构建 Arm 驱动模块

```bash
$ xmake f -p cross -a arm --sdk=/mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf -c
$ xmake -v
checking for arm-linux-gnueabihf-g++ ... /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-g++
checking for the linker (ld) ... arm-linux-gnueabihf-g++
checking for /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-g++ ... ok
checking for flags (-fPIC) ... ok
checking for /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc ... ok
checking for flags (-fPIC) ... ok
checking for flags (-O2) ... ok
checking for ccache ... /usr/bin/ccache
[ 20%]: cache compiling.release src/add.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc -c -O2 -std=gnu89 -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -D__LINUX_ARM_ARCH__=6 -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/../lib/gcc/arm-linux-gnueabihf/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -mbig-endian -mabi=aapcs-linux -mfpu=vfp -marm -march=armv6k -mtune=arm1136j-s -msoft-float -Uarm -DKBUILD_BASENAME=\"add\" -o build/.objs/hello/cross/arm/release/src/add.c.o src/add.c
[ 20%]: cache compiling.release src/hello.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc -c -O2 -std=gnu89 -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -D__LINUX_ARM_ARCH__=6 -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/../lib/gcc/arm-linux-gnueabihf/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -mbig-endian -mabi=aapcs-linux -mfpu=vfp -marm -march=armv6k -mtune=arm1136j-s -msoft-float -Uarm -DKBUILD_BASENAME=\"hello\" -o build/.objs/hello/cross/arm/release/src/hello.c.o src/hello.c
checking for flags (-MMD -MF) ... ok
checking for flags (-fdiagnostics-color=always) ... ok
[ 60%]: linking.release build/cross/arm/release/hello.ko
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-ld -EB -r -o build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.o build/.objs/hello/cross/arm/release/src/add.c.o build/.objs/hello/cross/arm/release/src/hello.c.o
/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/scripts/mod/modpost -m -a -o build/.objs/hello/cross/arm/release/build/cross/arm/release/Module.symvers -e -N -T -
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc -c -O2 -std=gnu89 -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -D__LINUX_ARM_ARCH__=6 -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/../lib/gcc/arm-linux-gnueabihf/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -mbig-endian -mabi=aapcs-linux -mfpu=vfp -marm -march=armv6k -mtune=arm1136j-s -msoft-float -Uarm -o build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.mod.o build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.mod.c
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-ld -EB --be8 -r --build-id=sha1 -T /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/scripts/module.lds -o build/cross/arm/release/hello.ko build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.o build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.mod.o
[100%]: build ok!

```

#### 构建 Arm64 驱动模块

```bash
$ xmake f -p cross -a arm64 --sdk=/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu -c
checking for aarch64-linux-gnu-g++ ... /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++
checking for the linker (ld) ... aarch64-linux-gnu-g++
checking for /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-g++ ... ok
checking for flags (-fPIC) ... ok
checking for /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc ... ok
checking for flags (-fPIC) ... ok
checking for flags (-O2) ... ok
checking for ccache ... /usr/bin/ccache
[ 20%]: cache compiling.release src/add.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc -c -O2 -std=gnu89 -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/../lib/gcc/aarch64-linux-gnu/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"add\" -o build/.objs/hello/cross/arm64/release/src/add.c.o src/add.c
[ 20%]: cache compiling.release src/hello.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc -c -O2 -std=gnu89 -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/../lib/gcc/aarch64-linux-gnu/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"hello\" -o build/.objs/hello/cross/arm64/release/src/hello.c.o src/hello.c
checking for flags (-MMD -MF) ... ok
checking for flags (-fdiagnostics-color=always) ... ok
[ 60%]: linking.release build/cross/arm64/release/hello.ko
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-ld -EL -maarch64elf -r -o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.o build/.objs/hello/cross/arm64/release/src/add.c.o build/.objs/hello/cross/arm64/release/src/hello.c.o
/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/scripts/mod/modpost -m -a -o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/Module.symvers -e -N -T -
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc -c -O2 -std=gnu89 -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/../lib/gcc/aarch64-linux-gnu/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.mod.o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.mod.c
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-ld -EL -maarch64elf -r --build-id=sha1 -T /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/scripts/module.lds -o build/cross/arm64/release/hello.ko build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.mod.o
[100%]: build ok!
```

## ASN.1 程序

ASN.1 程序，需要借助 [ASN.1 Compiler](https://github.com/vlm/asn1c) 去生成相关的 .c 文件参与项目编译。

而 Xmake 内置提供了 `add_rules("asn1c")` 规则去处理 `.c` 文件生成，`add_requires("asn1c")` 自动拉取集成 ASN.1 编译器工具。

下面是一个基础的配置例子：

```lua
add_rules("mode.debug", "mode.release")
add_requires("asn1c")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_files("src/*.asn1")
    add_rules("asn1c")
    add_packages("asn1c")
```

具体见 [完整例子工程](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/asn1c)。

## Verilog 仿真程序

### iVerilog 仿真器

通过 `add_requires("iverilog")` 配置，我们能够自动拉取 iverilog 工具链包，然后使用 `set_toolchains("@iverilog")` 自动绑定工具链来编译工程。

```lua
add_requires("iverilog")
target("hello")
    add_rules("iverilog.binary")
    set_toolchains("@iverilog")
    add_files("src/*.v")
```

#### 设置抽象配置

```lua
add_requires("iverilog")
target("hello")
    add_rules("iverilog.binary")
    set_toolchains("@iverilog")
    add_files("src/*.v")
    add_defines("TEST")
    add_includedirs("inc")
    set_languages("v1800-2009")
```

我们可以通过 `set_languages("v1800-2009")` 来设置切换 Verilog 的语言标准。

目前支持的一些取值和映射关系如下：

```lua
["v1364-1995"] = "-g1995"
["v1364-2001"] = "-g2001"
["v1364-2005"] = "-g2005"
["v1800-2005"] = "-g2005-sv"
["v1800-2009"] = "-g2009"
["v1800-2012"] = "-g2012"
```

#### 设置自定义 flags


```lua
add_requires("iverilog")
target("hello")
    add_rules("iverilog.binary")
    set_toolchains("@iverilog")
    add_files("src/*.v")
    add_values("iverilogs.flags", "-DTEST")
```

#### 构建工程

```bash
$ xmake
checking for iverilog ... iverilog
checking for vvp ... vvp
[ 50%]: linking.iverilog hello.vvp
[100%]: build ok!
```

#### 运行程序

```bash
$ xmake run
hello world!
LXT2 info: dumpfile hello.vcd opened for output.
src/main.v:6: $finish called at 0 (1s)
```

更多完整例子：[iVerilog Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/embed/iverilog)

### Verilator 仿真器

通过 `add_requires("verilator")` 配置，我们能够自动拉取 verilator 工具链包，然后使用 `set_toolchains("@verilator")` 自动绑定到工具链来编译工程。

```lua
add_requires("verilator")
target("hello")
    add_rules("verilator.binary")
    set_toolchains("@verilator")
    add_files("src/*.v")
    add_files("src/*.cpp")
```

verilator 工程，我们需要一个额外的 `sim_main.cpp` 文件参与编译，作为程序的入口代码。

```
#include "hello.h"
#include "verilated.h"

int main(int argc, char** argv) {
    VerilatedContext* contextp = new VerilatedContext;
    contextp->commandArgs(argc, argv);
    hello* top = new hello{contextp};
    while (!contextp->gotFinish()) { top->eval(); }
    delete top;
    delete contextp;
    return 0;
}
```

#### 设置抽象配置

```lua
add_requires("verilator")
target("hello")
    add_rules("verilator.binary")
    set_toolchains("@verilator")
    add_files("src/*.v")
    add_defines("TEST")
    add_includedirs("inc")
    set_languages("v1800-2009")
```

我们可以通过 `set_languages("v1800-2009")` 来设置切换 Verilog 的语言标准。

目前支持的一些取值和映射关系如下：

```lua
-- Verilog
["v1364-1995"] = "+1364-1995ext+v",
["v1364-2001"] = "+1364-2001ext+v",
["v1364-2005"] = "+1364-2005ext+v",
-- SystemVerilog
["v1800-2005"] = "+1800-2005ext+v",
["v1800-2009"] = "+1800-2009ext+v",
["v1800-2012"] = "+1800-2012ext+v",
["v1800-2017"] = "+1800-2017ext+v",
```

#### 设置自定义 flags

```lua
add_requires("verilator")
target("hello")
    add_rules("verilator.binary")
    set_toolchains("@verilator")
    add_files("src/*.v")
    add_files("src/*.cpp")
    add_values("verilator.flags", "--trace", "--timing")
```

#### 构建工程

```bash
$ xmake
[  0%]: compiling.verilog src/main.v
[ 15%]: cache compiling.release /Users/ruki/.xmake/packages/v/verilator/2023.1.10/cd2268409c1d44799288c7759b3cbd56/share/verilator/include/verilated.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__Slow.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h9053a130__0__Slow.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello.cpp
[ 15%]: cache compiling.release /Users/ruki/.xmake/packages/v/verilator/2023.1.10/cd2268409c1d44799288c7759b3cbd56/share/verilator/include/verilated_threads.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello__Syms.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h07139e86__0.cpp
[ 15%]: cache compiling.release src/sim_main.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h9053a130__0.cpp
[ 84%]: linking.release hello
[100%]: build ok!
```

#### 运行程序

```bash
$ xmake run
ruki-2:hello ruki$ xmake run
hello world!
- src/main.v:4: Verilog $finish
```

更多完整例子：[Verilator](https://github.com/xmake-io/xmake/tree/master/tests/projects/embed/verilator)

## Cppfront 程序

```bash
add_rules("mode.debug", "mode.release")

add_requires("cppfront")

target("test")
    add_rules("cppfront")
    set_kind("binary")
    add_files("src/*.cpp2")
    add_packages("cppfront")
```

