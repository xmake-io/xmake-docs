

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

如果想要使用windows下mingw的Qt环境，可以切到mingw的平台配置，并且指定下mingw编译环境的sdk路径即可，例如：

```console
$ xmake f -p mingw --sdk=C:\Qt\Qt5.10.1\Tools\mingw530_32 
```

上述指定的mingw sdk用的是Qt下Tools目录自带的环境，当然如果有其他第三方mingw编译环境，也可以手动指定, 具体可以参考：[mingw编译配置](#mingw)。

更多详情可以参考：[#160](https://github.com/xmake-io/xmake/issues/160)

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

!> 新版本提供了`qt.quickapp`规则，内置了QtQuick的内建规则，使用更加简单，下面老版本的`qt.application`还是支持的，向下兼容：

```lua
target("qt_quickapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/qml.qrc")
    add_frameworks("QtQuick")
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

相关完整工程example见：[WDK examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/wdk)

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

<p class="tip">
从v2.2.7版本开始，默认构建会启用device-link。（参见 [Separate Compilation and Linking of CUDA C++ Device Code](https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/)）
如果要显示禁用device-link，可以通过`add_values("cuda.devlink", false)` 来设置。
</p>

默认会自动探测cuda环境，当然也可以指定Cuda SDK环境目录：

```console
$ xmake f --cuda=/usr/local/cuda-9.1/ 
$ xmake
```

更多详情可以参考：[#158](https://github.com/xmake-io/xmake/issues/158)

## Lex&Yacc程序

```lua
target("calc")
    set_kind("binary")
    add_rules("lex", "yacc")
    add_files("src/*.l", "src/*.y")
```

## Fortran程序

v2.3.6之后版本开始支持gfortran编译器来编译fortran项目，我们可以通过下面的命令，快速创建一个基于fortran的空工程：

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
