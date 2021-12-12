

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

## Qt程序

创建一个空工程：

v2.2.9以上版本：

```console
$ xmake create -t qt.console test
$ xmake create -t qt.static test
$ xmake create -t qt.shared test
$ xmake create -t qt.quickapp test
$ xmake create -t qt.widgetapp test
```

更多工程模板见：`xmake create --help`

v2.2.8以前老版本：

```console
$ xmake create -l c++ -t console_qt test
$ xmake create -l c++ -t static_qt test
$ xmake create -l c++ -t shared_qt test
$ xmake create -l c++ -t quickapp_qt test
```

默认会自动探测Qt环境，当然也可以指定Qt SDK环境目录：

```console
$ xmake f --qt=~/Qt/Qt5.9.1
```

如果想要使用 windows 下 MingW 的 Qt 环境，可以切到mingw的平台配置，并且指定下mingw编译环境的sdk路径即可，例如：

```console
$ xmake f -p mingw --sdk=C:\Qt\Qt5.10.1\Tools\mingw530_32
```

上述指定的 MingW SDK 用的是Qt下Tools目录自带的环境，当然如果有其他第三方 MingW 编译环境，也可以手动指定, 具体可以参考：[MingW 编译配置](/zh-cn/guide/configuration?id=mingw)。

更多详情可以参考：[#160](https://github.com/xmake-io/xmake/issues/160)

另外，当前xmake也支持Qt/Wasm，详情见：[Wasm 配置](/zh-cn/guide/configuration?id=wasm)

```console
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

### Quick应用程序

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
[  0%]: ccache compiling.release src/main.cpp
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

### Widgets应用程序

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

### Android应用程序

2.2.6之后版本，可以直接切到android平台编译Quick/Widgets应用程序，生成apk包，并且可通过`xmake install`命令安装到设备。

```console
$ xmake create -t quickapp_qt -l c++ appdemo
$ cd appdemo
$ xmake f -p android --ndk=~/Downloads/android-ndk-r19c/ --android_sdk=~/Library/Android/sdk/ -c
$ xmake
[  0%]: compiling.qt.qrc src/qml.qrc
[ 50%]: ccache compiling.release src/main.cpp
[100%]: linking.release libappdemo.so
[100%]: generating.qt.app appdemo.apk
```

然后安装到设备：

```console
$ xmake install
installing appdemo ...
installing build/android/release/appdemo.apk ..
Success
install ok!👌
```

## WDK驱动程序

默认会自动探测wdk所在环境，当然也可以指定wdk sdk环境目录：

```console
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

```console
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

```console
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

```console
$ xmake create -t xcode.macapp -l objc test
$ xmake create -t xcode.iosapp -l objc test
```

#### 编译

```console
$ xmake f -p [iphoneos|macosx]
$ xmake
[ 18%]: compiling.xcode.release src/Assets.xcassets
[ 27%]: processing.xcode.release src/Info.plist
[ 72%]: compiling.xcode.release src/Base.lproj/Main.storyboard
[ 81%]: compiling.xcode.release src/Base.lproj/LaunchScreen.storyboard
[ 45%]: ccache compiling.release src/ViewController.m
[ 63%]: ccache compiling.release src/AppDelegate.m
[ 54%]: ccache compiling.release src/SceneDelegate.m
[ 36%]: ccache compiling.release src/main.m
[ 90%]: linking.release test
[100%]: generating.xcode.release test.app
[100%]: build ok!
```

#### 配置签名

对于iOS程序，默认会检测系统先用可用签名来签名app，当然我们也可以手动指定其他签名证书：

```console
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

```console
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

```console
$ xmake l utils.ipa.resign test.ipa|test.app [codesign_identity] [mobile_provision] [bundle_identifier]
```

其中，后面的签名参数都是可选的，如果没设置，那么默认会探测使用一个有效的签名：

```console
$ xmake l utils.ipa.resign test.ipa
$ xmake l utils.ipa.resign test.app "Apple Development: waruqi@gmail.com (T3NA4MRVPU)"
$ xmake l utils.ipa.resign test.ipa "Apple Development: waruqi@gmail.com (T3NA4MRVPU)" iOS Team Provisioning Profile: org.tboox.test" org.tboox.test
```

#### 运行应用程序

目前仅支持运行macos程序：

```console
$ xmake run
```

效果如下：

![](/assets/img/guide/macapp.png)

#### 生成程序包

如果是iOS程序会生成ipa安装包，如果是macos会生成dmg包（dmg包生成暂时还在开发中）。

```console
$ xmake package
output: build/iphoneos/release/arm64/test.ipa
package ok!
```

我们也提供了辅助工具，来对指定app程序进行打包：

```console
$ xmake l utils.ipa.package test.app output.ipa [iconfile.png]
```

#### 安装

如果是iOS程序会安装ipa到设备，如果是macos会安装app到/Applications目录。

```console
$ xmake install
```

我们也提供了辅助工具，来对指定ipa/app程序安装到设备：

```console
$ xmake l utils.ipa.install test.app
$ xmake l utils.ipa.install test.ipa
```

#### 卸载

!> 目前仅支持macos程序卸载

```console
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

```console
$ xmake create -t xcode.framework -l objc test
```

另外，xmake v2.3.9 以上版本，xmake 还提供了带有 framework 库使用的完整 iosapp/macapp 空工程模板，可以完整体验 framework 的编译，依赖使用以及集成到 app 应用程序中。

同时，如果我们开启了模拟器，xmake 可以支持直接 `xmake install` 和 `xmake run` 将 app 安装到模拟器并加载运行。

```console
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

```console
$ xmake create -t xcode.bundle -l objc test
```

## Protobuf程序

### 使用c库

```lua
add_requires("protobuf-c")

target("console_c")
    set_kind("binary")
    add_packages("protobuf-c")

    add_files("src/*.c")
    add_files("src/*.proto", {rules = "protobuf.c"})
```

2.5.5 版本，我们还可以设置 `proto_public = true` 来导出 proto 的头文件搜索目录，开放给其他父 target 继承使用。

```lua
    add_files("src/**.proto", {rules = "protobuf.c", proto_public = true})
```

### 使用c++库

```lua
add_requires("protobuf-cpp")

target("console_c++")
    set_kind("binary")
    set_languages("c++11")

    add_packages("protobuf-cpp")

    add_files("src/*.cpp")
    add_files("src/*.proto", {rules = "protobuf.cpp"})
```

## Cuda程序

创建一个空工程：

```console
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
如果要显示禁用device-link，可以通过`add_values("cuda.devlink", false)` 来设置。

默认会自动探测cuda环境，当然也可以指定Cuda SDK环境目录：

```console
$ xmake f --cuda=/usr/local/cuda-9.1/
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

```console
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

```console
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

```console
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

```console
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

```console
$ xmake create -l rust -t console test
```

xmake.lua内容：

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.rs")
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

```console
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

```console
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

```console
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

### C++20 模块

xmake 采用 `.mpp` 作为默认的模块扩展名，但是也同时支持 `.ixx`, `.cppm`, `.mxx` 等扩展名。

目前 xmake 已经完整支持 gcc11/clang/msvc 的 C++20 Modules 构建支持，并且能够自动分析模块间的依赖关系，实现最大化并行编译。

```lua
set_languages("c++20")
target("class")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

更多例子见：[C++ Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules)

### 合并静态库

#### 自动合并 target 库

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

#### 合并指定的静态库文件

如果自动合并不满足需求，我们也可以主动调用 `utils.archive.merge_archive` 模块在 `after_link` 阶段合并指定的静态库列表。

```lua
target("test")
    after_link(function (target)
        import("utils.archive.merge_staticlib")
        merge_staticlib(target, "libout.a", {"libfoo.a", "libbar.a"})
    end)
```

#### 使用 add_files 合并静态库

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

```console
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

```console
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

```console
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

```console
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

相关例子工程：[Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/mdk/hello)

xmake 会自动探测 Keil/MDK 安装的编译器，相关 issues [#1753](https://github.com/xmake-io/xmake/issues/1753)。

使用 armcc 编译

```console
$ xmake f -p cross -a cortex-m3 --toolchain=armcc -c
$ xmake
```

使用 armclang 编译

```console
$ xmake f -p cross -a cortex-m3 --toolchain=armclang -c
$ xmake
```

### 控制台程序

```lua
target("hello")
    add_deps("foo")
    add_rules("mdk.console")
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
