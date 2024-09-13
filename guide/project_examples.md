# Project examples

We briefly introduce some commonly used project examples. More and more complete examples projects can be viewed in [project examples](https://github.com/xmake-io/xmake/tree/master/tests/projects).

We can also use the `xmake create` command to create various commonly used empty projects to quickly start. For the introduction of this command and the supported project templates, you can type the following command to view:

```bash
xmake create --help
```

## Executable Program

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

For a complete example, execute the following command to create:

```bash
xmake create -l c -t console test
```

## Static Library Program

```lua
target("library")
    set_kind("static")
    add_files("src/library/*.c")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_deps("library")
```

We use `add_deps` to link a static library to test target.

For a complete example, execute the following command to create:

```bash
xmake create -l c -t static test
```

## Shared Library Program

```lua
target("library")
    set_kind("shared")
    add_files("src/library/*.c")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_deps("library")
```

We use `add_deps` to link a shared library to test target.

For a complete example, execute the following command to create:

```bash
xmake create -l c -t shared test
```

## Wasm programs

All c/c++ programs can be compiled to Wasm without any xmake.lua configuration changes, just switch to the wasm compilation platform and compile.

```bash
$ xmake f -p wasm
$ xmake
```

For detailed wasm compilation configuration see: [wasm configuration](/guide/configuration?id=wasm)

Alternatively, when compiling a file with the `-preload-file assets/xxx.md` setting, we can also simplify its setup by configuring

```lua
target("test5")
    set_kind("binary")
    add_files("src/*.cpp")
    add_values("wasm.preloadfiles", "src/xxx.md")
    add_values("wasm.preloadfiles", "src/xxx2.md")
```

## Qt Program

Create an empty project:

v2.2.9 or higher:

```bash
$ xmake create -t qt.console test
$ xmake create -t qt.static test
$ xmake create -t qt.shared test
$ xmake create -t qt.quickapp test
$ xmake create -t qt.widgetapp test
```

For more project templates see: `xmake create --help`

Older version of v2.2.8:

```bash
$ xmake create -l c++ -t console_qt test
$ xmake create -l c++ -t static_qt test
$ xmake create -l c++ -t shared_qt test
$ xmake create -l c++ -t quickapp_qt test
```

xmake will detect Qt SDK automatically and we can also set the SDK directory manually.

```bash
$ xmake f --qt=~/Qt/Qt5.9.1
```

The MingW SDK specified above uses the environment that comes with the Tools directory under Qt. Of course, if there are other third-party MingW compilation environments, they can also be specified manually. 
For details, please refer to: [MingW Configuration](/guide/configuration?id=mingw).

For more details, please refer to: [#160](https://github.com/xmake-io/xmake/issues/160)

In addition, currently xmake also supports Qt/Wasm. For details, see: [Wasm Configuration](/guide/configuration?id=wasm)

```bash
$ xmake f -p wasm
```

### Static Library

```lua
target("qt_static_library")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

### Shared Library

```lua
target("qt_shared_library")
    add_rules("qt.shared")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

### Console Program

```lua
target("qt_console")
    add_rules("qt.console")
    add_files("src/*.cpp")
```

### Quick Application

v2.2.9 or higher:

```lua
target("qt_quickapp")
    add_rules("qt.quickapp")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
```

!> If you are using your own compiled static version of the QT SDK, you need to switch to the `add_rules("qt.quickapp_static")` static rule,
because the linked libraries are different and need to be statically linked.

Next, we try to compile, usually, if you use the Qt installation package to install by default, and do not modify the installation path, then in most cases you can automatically detect the root path of the QT SDK, for example:

```bash
$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.15
checking for the Qt SDK directory ... /Users/ruki/Qt5.13.2/5.13.2/clang_64
checking for the Qt SDK version ... 5.13.2
[0%]: cache compiling.release src/main.cpp
[49%]: compiling.qt.qrc src/qml.qrc
[100%]: linking.release test
Build ok!
```

Then we continue to run it:

```bash
$ xmake run
```

The effect is as follows:

![](/assets/img/guide/qt_quickapp.png)

### Quick Plugin

For a full example see: [quickplugin example](https://github.com/xmake-io/xmake/tree/master/tests/projects/qt/quickplugin)

```lua
add_rules("mode.debug", "mode.release")

target("demo")
    add_rules("qt.qmlplugin")
    add_headerfiles("src/*.h")
    add_files("src/*.cpp")

    set_values("qt.qmlplugin.import_name", "My.Plugin")
```

### Widgets Application

v2.2.9 or higher:

```lua
target("qt_widgetapp")
    add_rules("qt.widgetapp")
    add_headerfiles("src/*.h")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    -- add files with Q_OBJECT meta (only for qt.moc)
    add_files("src/mainwindow.h")
```

!> The new version provides the `qt.widgetapp` rule, built-in QtWidgets built-in rules, the use of simpler, the following version of the `qt.application` is still supported, backward compatible:

```lua
target("qt_widgetapp")
    add_rules("qt.application")
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- add files with Q_OBJECT meta (only for qt.moc)
    add_frameworks("QtWidgets")
```

!> If you are using your own compiled static version of the QT SDK, you need to switch to the `add_rules("qt.widgetapp_static")` static rule,
because the linked libraries are different and need to be statically linked.

The effect is as follows:

![](/assets/img/guide/qt_widgetapp.png)

### Android Application

After the 2.2.6 version, you can directly switch to the android platform to compile the Quick/Widgets application, generate the apk package, and install it to the device via the `xmake install` command.

```bash
$ xmake create -t quickapp_qt -l c ++ appdemo
$ cd appdemo
$ xmake f -p android --ndk=~/Downloads/android-ndk-r19c/ --android_sdk=~/Library/Android/sdk/ -c
$ xmake
[0%]: compiling.qt.qrc src/qml.qrc
[ 50%]: cache compiling.release src/main.cpp
[100%]: linking.release libappdemo.so
[100%]: generating.qt.app appdemo.apk
```

Then install to the device:

```bash
$ xmake install
installing appdemo ...
installing build/android/release/appdemo.apk ..
success
install ok!👌
```

### Supported Qt SDKs

#### The official Qt SDK installation package

This is usually detected automatically on macos/windows, but it is possible to specify the Qt SDK path manually.

```bash
$ xmake f --qt=[qt sdk path]
```

#### The Ubuntu Apt package

After installing the Qt SDK using apt, xmake will also be able to detect it automatically.

```bash
$ sudo apt install -y qtcreator qtbase5-dev
$ xmake
```

#### Qt Mingw SDK from msys2/pacman

xmake also supports the Qt Mingw SDK installed from pacman

```bash
$ pacman -S mingw-w64-x86_64-qt5 mingw-w64-x86_64-qt-creator
$ xmake
```

#### Qt SDK package from aqtinstall script

The Qt SDK installed by [aqtinstall](https://github.com/miurahr/aqtinstall) is based entirely on the official SDK structure and is therefore fully supported by xmake.

However, it is usually necessary to specify the SDK path yourself.

```bash
$ xmake f --qt=[Qt SDK]
```

#### Qt packages from the xmake-repo repository

xmake now officially provides a variety of modules for the Qt5 SDK that can be integrated automatically without any manual installation.

Just configure the integration packages and xmake will automatically handle the Qt installation and integration and compile the project automatically.

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

In addition to the `qt5widgets` package, the repository also provides `qt5gui`, `qt5network` and other packages that can be used.

Once configured, simply execute:

```bash
$ xmake
```

!> The Qt6 package is still under development and only supports Qt5 for now

#### Qt packages from vcpkg/conan

There is no time to support it yet, so please try to integrate the Qt SDK in the same way as above.

## WDK Driver Program

xmake will detect WDK automatically and we can also set the WDK directory manually.

```bash
$ xmake f --wdk="G:\Program Files\Windows Kits\10" -c
$ xmake
```

If you want to known more information, you can see [#159](https://github.com/xmake-io/xmake/issues/159).

And see [WDK examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/windows/driver)

### UMDF Driver Program

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

### KMDF Driver Program

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

### WDM Driver Program

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

### Package Driver

We can run the following command to generate a .cab driver package.

```bash
$ xmake [p|package]
$ xmake [p|package] -o outputdir
```

The output files like:

```
  - drivers
    - sampledsm
       - debug/x86/sampledsm.cab
       - release/x64/sampledsm.cab
       - debug/x86/sampledsm.cab
       - release/x64/sampledsm.cab
```

### Driver Signing

The driver signing is disabled when we compile driver in default case,
but we can add `set_values("wdk.sign.mode")` to enable test/release sign.

#### TestSign

We can use test certificate of xmake to do testsign, but please run `$xmake l utils.wdk.testcert` install as admin to install a test certificate first (only once)!

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
```

Or we set a valid certificate thumbprint to do it in local machine.

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
    set_values("wdk.sign.thumbprint", "032122545DCAA6167B1ADBE5F7FDF07AE2234AAA")
```

We can also do testsign via setting store/company info.

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "test")
    set_values("wdk.sign.store", "PrivateCertStore")
    set_values("wdk.sign.company", "tboox.org(test)")
```

#### ReleaseSign

We can set a certificate file for release signing.

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "release")
    set_values("wdk.sign.company", "xxxx")
    set_values("wdk.sign.certfile", path.join(os.projectdir(), "xxxx.cer"))
```

### Support Low-version System

We can set `wdk.env.winver` to generate a driver package that is compatible with a low version system.

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

We can also set windows version for WDK driver program:

```bash
$ xmake f --wdk_winver=[win10_rs3|win8|win7|win7_sp1]
$ xmake
```

## WinSDK Application Program

```lua
target("usbview")
    add_rules("win.sdk.application")

    add_files("*.c", "*.rc")
    add_files("xmlhelper.cpp", {rule = "win.sdk.dotnet"})
```

If you want to known more information, you can see [#173](https://github.com/xmake-io/xmake/issues/173).

## MFC Application Program

### MFC Static Library

```lua
target("test")
    add_rules("win.sdk.mfc.static")
    add_files("src/*.c")
```

### MFC Shared Library

```lua
target("test")
    add_rules("win.sdk.mfc.shared")
    add_files("src/*.c")
```

### MFC Application (Static)

```lua
target("test")
    add_rules("win.sdk.mfc.static_app")
    add_files("src/*.c")
```

### MFC Application (Shared)

```lua
target("test")
    add_rules("win.sdk.mfc.shared_app")
    add_files("src/*.c")
```

## iOS/MacOS Program

### Application

Generate *.app/*.ipa application and supports iOS/MacOS.

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
```

!> After 2.5.7, you can directly add `*.metal` files, xmake will automatically generate default.metallib for the application to load and use.

#### Create Project

We can also quickly create project through template:

```bash
$ xmake create -t xcode.macapp -l objc test
$ xmake create -t xcode.iosapp -l objc test
```

#### Build Program

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

#### Codesign

For iOS programs, it will detect that the system first signs the app with available signatures. Of course, we can also manually specify other signature certificates:

```bash
$ xmake f -p iphoneos --xcode_codesign_identity='Apple Development: xxx@gmail.com (T3NA4MRVPU)' --xcode_mobile_provision='iOS Team Provisioning Profile: org.tboox.test --xcode_bundle_identifier=org.tboox.test'
$ xmake
```

If it is cumbersome to configure the signature every time, you can set it to the `xmake global` global configuration, or you can set it separately for each target in xmake.lua:

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
    add_values("xcode.bundle_identifier", "org.tboox.test")
    add_values("xcode.codesign_identity", "Apple Development: xxx@gmail.com (T3NA4MRVPU)")
    add_values("xcode.mobile_provision", "iOS Team Provisioning Profile: org.tboox.test")
```

How do we know the signature configuration we need? One is to view it in xcode. In addition, xmake also provides some auxiliary tools to dump all currently available signature configurations:

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
	<string>XC org tboox test</string>
	<key>ApplicationIdentifierPrefix</key>
	<array>
	<string>43AAQM58X3</string>
...
```

We also provide other auxiliary tools to re-sign existing ipa / app programs, for example:

```bash
$ xmake l utils.ipa.resign test.ipa | test.app [codesign_identity] [mobile_provision] [bundle_identifier]
```

Among them, the following signature parameters are optional, if not set, then a valid signature will be detected by default:

```bash
$ xmake l utils.ipa.resign test.ipa
$ xmake l utils.ipa.resign test.app "Apple Development: waruqi@gmail.com (T3NA4MRVPU)"
$ xmake l utils.ipa.resign test.ipa "Apple Development: waruqi@gmail.com (T3NA4MRVPU)" iOS Team Provisioning Profile: org.tboox.test" org.tboox.test
```

#### Run the application

Currently only supports running macos program:

`` `console
$ xmake run
`` `

The effect is as follows:

![](/assets/img/guide/macapp.png)

#### Package program

If it is an iOS program, it will generate an ipa installation package, if it is macOS, it will generate a dmg package (dmg package generation is still under development for the time being).

```bash
$ xmake package
output: build/iphoneos/release/arm64/test.ipa
package ok!
```

We also provide auxiliary tools to package the specified app program:

```bash
$ xmake l utils.ipa.package test.app output.ipa [iconfile.png]
```

#### Install

If it is an iOS program, it will install ipa to the device, if it is macos, it will install the app to the `/Applications` directory.

```bash
$ xmake install
```

We also provide auxiliary tools to install the specified ipa/app program to the device:

```bash
$ xmake l utils.ipa.install test.app
$ xmake l utils.ipa.install test.ipa
```

#### Uninstall

!> Currently only the macos program is supported

```bash
$ xmake uninstall
```

### Framework Program

```lua
target("test")
    add_rules("xcode.framework")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

We can also quickly create project through template:

```bash
$ xmake create -t xcode.framework -l objc test
```

In addition, xmake v2.3.9 and above, xmake also provides a complete iosapp/macapp empty project template with framework library usage, you can fully experience framework compilation, dependent use and integration into app applications.

At the same time, if we turn on the emulator, xmake can support directly `xmake install` and `xmake run` to install the app to the emulator and load and run it.

```bash
$ xmake create -t xcode.iosapp_with_framework -l objc testapp
$ cd testapp
$ xmake f -p iphoneos -a x86_64
$ xmake
$ xmake install
$ xmake run
```

### Bundle Program

```lua
target("test")
    add_rules("xcode.bundle")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

We can also quickly create project through template:

```bash
$ xmake create -t xcode.bundle -l objc test
```

## Protobuf Program

### Using c library

```lua
add_requires("protobuf-c")

target("console_c")
     set_kind("binary")
     add_packages("protobuf-c")
     add_rules("protobuf.c")
     add_files("src/*.c")
     add_files("src/*.proto")
```

We can also set ``proto_public = true`` to export the proto's header search directory and make it available for other parent targets to inherit from.

```lua
    add_packages("protobuf-c", {public = true})
    add_files("src/**.proto", {proto_public = true})
```

Note: Since the headers generated by protobuf reference the headers of the protobuf-c package, we also need to mark the package headers as `{public = true}` to export it.

### Using the C++ library

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

We can also set ``proto_public = true`` to export the proto's header search directory and make it available for other parent targets to inherit from.

```lua
    add_packages("protobuf-cpp", {public = true})
    add_files("src/**.proto", {proto_public = true})
```

Note: Since the headers generated by protobuf reference the headers of the protobuf-cpp package, we also need to mark the package headers as `{public = true}` to export it.

## Cuda Program

Create an empty project:

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

!> Starting with v2.2.7, the default build will enable device-link. (see [Separate Compilation and Linking of CUDA C++ Device Code](https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/))
If you want to disable device-link, you can set it with `set_policy("build.cuda.devlink", false)`.

!> Device functions in cuda source files should be device-linked once and only once. On targets with kind `binary` or `shared` xmake will automatically perform the device-link which takes the static libraries they depend into account, while for `static` targets by default will not be device-linked. However, if the final `binary` or `shared` target do not contain any cuda files, the device-link stage could be missing, resulting in an undefined reference error. In this case the static target should be set `add_values("cuda.build.devlink", true)` manually.

xmake will detect Cuda SDK automatically and we can also set the SDK directory (or SDK version for default installations) manually.

```bash
$ xmake f --cuda=/usr/local/cuda-9.1/
$ xmake f --cuda=9.1
$ xmake
```

If you want to known more information, you can see [#158](https://github.com/xmake-io/xmake/issues/158).

## Lex & Yacc Program

```lua
target("calc")
     set_kind("binary")
     add_rules("lex", "yacc")
     add_files("src/*.l", "src/*.y")
```

## OpenMP Program

After v2.6.1, the configuration of openmp has been improved, which is more simplified and unified. We no longer need to configure additional rules. The same effect can be achieved only through a common openmp package.

```lua
add_requires("openmp")
target("loop")
     set_kind("binary")
     add_files("src/*.cpp")
     add_packages("openmp")
```

Before v2.5.9

```lua
add_requires("libomp", {optional = true})
target("loop")
    set_kind("binary")
    add_files("src/*.cpp")
    add_rules("c++.openmp")
    add_packages("libomp")
```

If it is c code, you need to enable ʻadd_rules("c.openmp")`. If it is c/c++ mixed compilation, then these two rules must be set.

## Fortran Program

After v2.3.6, the gfortran compiler is supported to compile fortran projects. We can quickly create an empty project based on fortran by using the following command:

After v2.3.8, xmake also supports Intel Fortran Compiler, you only need to switch the toolchain: `xmake f --toolchain=ifort`

```bash
$ xmake create -l fortran -t console test
```

Its xmake.lua content is as follows:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.f90")
```

More code examples can be viewed here: [Fortran Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/fortran)

## Go Program

xmake also supports the construction of go programs, and also provides command support for creating empty projects:

```bash
$ xmake create -l go -t console test
```

The content of xmake.lua is as follows:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.go")
```

In v2.3.6 version, xmake has made some improvements to its build support, and also supports cross compilation of go. For example, we can compile windows programs on macOS and linux:

```bash
$ xmake f -p windows -a x86
```

In addition, the new version also initially supports the third-party dependency package management of go:

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

However, there are still some imperfections. For example, all cascading dependency packages must be manually configured at present, which will be a bit more cumbersome and needs to be improved in the future.

For more examples, see: [Go Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/go)

## Dlang Program

Create an empty project:

```bash
$ xmake create -l dlang -t console test
```

xmake.lua content:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.d")
```

Starting from the v2.3.6 version, xmake adds support for dub package management, which can quickly integrate third-party dependency packages of dlang:

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

However, there are still some imperfections. For example, all cascading dependency packages must be manually configured at present, which will be a bit more cumbersome and needs to be improved in the future.

For more examples, see: [Dlang Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/dlang)

## Rust Program

Create an empty project:

```bash
$ xmake create -l rust -t console test
```

xmake.lua content:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/main.rs")
```

For more examples, see: [Rust Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/rust)

### Add cargo package dependences

example: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cargo_deps

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::base64 0.13.0")
add_requires("cargo::flate2 1.0.17", {configs = {features = "zlib"}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::base64", "cargo::flate2")
```

### Integrating Cargo.toml dependency packages

Integrating dependencies directly using `add_requires("cargo::base64 0.13.0")` above has a problem.

If there are a lot of dependencies and several dependencies all depend on the same child dependencies, then there will be a redefinition problem, so if we use the full Cargo.toml to manage the dependencies we won't have this problem.

For example

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::test", {configs = {cargo_toml = path.join(os.projectdir(), "Cargo.toml")}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::test")
```

For a complete example see: [cargo_deps_with_toml](https://github.com/xmake-io/xmake/blob/dev/tests/projects/rust/cargo_deps_with_toml/xmake.lua)

### Use cxxbridge to call rust in c++

example: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cxx_call_rust_library

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

bridge interface file in c++, bridge.rsx

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

### Call c++ in rust

example: https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/rust_call_cxx_library

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

## Swift Program

Create an empty project:

```bash
$ xmake create -l swift -t console test
```

xmake.lua content:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.swift")
```

For more examples, see: [Swift Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/swift)

## Objc Program

Create an empty project:

```bash
$ xmake create -l objc -t console test
```

xmake.lua content:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.m")
```

For more examples, see: [Objc Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/objc++)

## Zig Program

Create an empty project:

```bash
$ xmake create -l zig -t console test
```

xmake.lua content:

```lua
add_rules("mode.debug", "mode.release")

target("test")
     set_kind("binary")
     add_files("src/*.zig")
```

For more examples, see: [Zig Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/zig)

## Linux Bpf Program

Since 2.5.3, it supports bpf program construction, supports both linux and android platforms, and can automatically pull llvm and android ndk toolchains.

For more details, please see: [#1274](https://github.com/xmake-io/xmake/issues/1274)

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

## Vala Program

After 2.5.7 to support the construction of Vala programs, we need to apply the `add_rules("vala")` rule, and the glib package is necessary.

related issues: [#1618](https://github.com/xmake-io/xmake/issues/1618)

`add_values("vala.packages")` is used to tell valac which packages the project needs, it will introduce the vala api of the relevant package, but the dependency integration of the package still needs to be downloaded and integrated through `add_requires("lua")`.

### Console program

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

### Static library program

After v2.5.8, we continue to support the construction of library programs. The exported interface header file name can be set through `add_values("vala.header", "mymath.h")`, and through `add_values("vala.vapi", "mymath -1.0.vapi")` Set the name of the exported vapi file.

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

### Dynamic library program

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

More examples: [Vala examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/vala)

## Pascal Program

After 2.5.8, we can support the construction of Pascal programs. For related issues, see: [#388](https://github.com/xmake-io/xmake/issues/388)

### Console Program

```lua
add_rules("mode.debug", "mode.release")
target("test")
     set_kind("binary")
     add_files("src/*.pas")
```

### Dynamic library program

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

More examples: [Pascal examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/pascal)

## Swig module

Version 2.5.8 supports the construction of Swig modules. We provide `swig.c` and `swig.cpp` rules, which respectively support the generation of c/c++ module interface code, and cooperate with xmake's package management system to realize fully automated modules and dependent packages. Integration.

Related issues: [#1622](https://github.com/xmake-io/xmake/issues/1622)

### Lua/C module

```lua
add_rules("mode.release", "mode.debug")
add_requires("lua")

target("example")
    add_rules("swig.c", {moduletype = "lua"})
    add_files("src/example.i", {swigflags = "-no-old-metatable-bindings"})
    add_files("src/example.c")
    add_packages("lua")
```

### Python/C module

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.c", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.c")
    add_packages("python")
```

### Python/C++ module

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.cpp", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.cpp")
    add_packages("python")
```

### Java/C module

[Example project](https://github.com/xmake-io/xmake/blob/dev/tests/projects/swig/java_c)

```lua
-- make sure you config to an enviroment with jni.h
-- for example: xmake f -c -p android

target("example")
    set_kind('shared')
    -- set moduletype to java
    add_rules("swig.c", {moduletype = "java"})
    -- test jar build
    -- add_rules("swig.c", {moduletype = "java" , buildjar = true})
    -- use swigflags to provider package name and output path of java files
    add_files("src/example.i", {swigflags = {
        "-package",
        "com.example",
        "-outdir",
        "build/java/com/example/"
    }})
    add_files("src/example.c")
    add_includedirs("src")
    before_build(function()
        -- ensure output path exists before running swig
        os.mkdir("build/java/com/example/")
    end)
```

We can also configure `buildjar = true` to build jar file.

```lua
add_rules("swig.c", {moduletype = "java", buildjar = true})
```

## C++20 Module

### Quick Start

xmake uses `.mpp` as the default module extension, but also supports `.ixx`, `.cppm`, `.mxx` and other extensions.

At present, xmake has fully supported the C++20 Modules construction support of gcc11/clang/msvc,
and can automatically analyze the dependencies between modules to maximize parallel compilation.

```lua
set_languages("c++20")
target("class")
    set_kind("binary")
    add_files("src/*.cpp", "src/*.mpp")
```

For more examples, see: [C++ Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules)

### Cpp-only project

The v2.7.1 release has refactored and upgraded the C++20 module implementation to include support for Headerunits,
which allows us to introduce Stl and user header modules into the module.

The relevant patch is available at: [#2641](https://github.com/xmake-io/xmake/pull/2641).

Note: Normally we need to add at least one `.mpp` file to enable C++20 modules compilation, if we only have a cpp file, module compilation will not be enabled by default.

However, if we just want to use the module's Headerunits feature in the cpp file, e.g. by introducing some stl Headerunits into the cpp, then we can also set `set_policy` to `.mpp`.
then we can also force C++ Modules compilation by setting `set_policy("build.c++.modules", true)`, for example:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    set_languages("c++20")
    set_policy("build.c++.modules", true)
```

### C++ Module distribution

Many thanks to [Arthapz](https://github.com/Arthapz) for continuing to help improve xmake's support for C++ Modules in this new release.

We can now distribute C++ Modules as packages for quick integration and reuse in other projects.

This is a prototype implementation based on the draft design for module distribution in [p2473r1](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2021/p2473r1.pdf).

#### Creating a C++ Modules package for distribution

We start by maintaining a build of the modules using xmake.lua and telling xmake which module files to install for external distribution by specifying ``{install = true}`''.

```lua
add_rules("mode.release", "mode.debug")
set_languages("c++20")

target("foo")
    set_kind("static")
    add_files("*.cpp")
    add_files("*.mpp", { install = true })
```

We then make it into a package that we can commit to the [xmake-repo](https://github.com/xmake-io/xmake-repo) repository, or of course directly into a local package, or a private repository package.

Here, for testing purposes, we just make it a local package via ``set_sourcedir``.

```lua
package("foo")
    set_sourcedir(path.join(os.scriptdir(), "src"))
    on_install(function(package)
        import("package.tools.xmake").install(package, {})
    end)
````

#### Integrating the C++ Modules package

We then quickly integrate the C++ Modules package for use via the package integration interface with `add_requires("foo")`.

Since the modules packages for foo are defined in a private repository, we introduce our own package repository via `add_repositories("my-repo my-repo")`.

If the package has already been committed to the official xmake-repo repository, there is no need to configure it additionally.

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

Once the packages are integrated, we can run the ``xmake`'' command to download, compile and integrate the C++ Modules package for use with one click.

```bash
$ xmake
checking for platform ... linux
checking for architecture ... x86_64
note: install or modify (m) these packages (pass -y to skip confirm)?
in my-repo:
  -> foo latest
  -> bar latest
please input: y (y/n/m)

  => install bar latest ... ok
  => install foo latest ... ok
[ 0%]: generating.module.deps src/main.cpp
[ 0%]: generating.module.deps /mnt/xmake/tests/projects/c++/modules/packages/build/.packages/b/bar/latest/ 4e0143c97b65425b855ad5fd03038b6a/modules/bar/bar.mpp
[ 0%]: generating.module.deps /mnt/xmake/tests/projects/c++/modules/packages/build/.packages/f/foo/latest/ 4e0143c97b65425b855ad5fd03038b6a/modules/foo/foo.mpp
[ 14%]: compiling.module.release bar
[ 14%]: compiling.module.release foo
[ 57%]: compiling.release src/main.cpp
[ 71%]: linking.release packages
[ 100%]: build ok!
```''

Note: After each package is installed, a meta-info file for the maintenance module is stored in the package path, this is a format specification agreed in ``p2473r1.pdf``, it may not be the final standard, but this does not affect our ability to use the distribution of the module now.

```bash
$ cat . /build/.packages/f/f/foo/latest/4e0143c97b65425b855ad5fd03038b6a/modules/foo/foo.mpp.meta-info
{"_VENDOR_extension":{"xmake":{"name": "foo", "file": "foo.mpp"}}, "definitions":{}, "include_paths":{}}
```

The full example project is available at: [C++ Modules package distribution example project](https://github.com/xmake-io/xmake/tree/master/tests/projects/c%2B%2B/modules/packages)

### Support for C++23 Std Modules

[Arthapz](https://github.com/Arthapz) has also helped to improve support for C++23 Std Modules.

It is currently supported by three compilers in progress.

#### Msvc

The latest Visual Studio 17.5 preview already supports it, and the non-standard ifc std modules will be deprecated.

For the standard C++23 std modules, this is how we introduced them.

```c
import std;
```

Whereas for ifc std modules, we need to write it like this.

```
import std.core;
```

This is not a C++23 standard, it is only provided by msvc, it is not compatible with other compilers and will be deprecated in new versions of msvc.
Therefore the new version of Xmake will only support C++23 std modules and not the deprecated ifc std modules.

#### Clang

It seems that the latest clang does not yet fully support C++23 std modules either, and is still in draft patch status, [#D135507](https://reviews.llvm.org/D135507).

However, Xmake does support it, so if you want to try it out, you can merge in the patch and test it with xmake.

There is also experimental support for non-standard std modules in lower versions of clang.

It is still possible to experiment with xmake to build std modules in lower versions of clang, even though it is probably still a toy (and will encounter many problems).

For a discussion see: [#3255](https://github.com/xmake-io/xmake/pull/3255)

#### Gcc

It is not currently supported.

## Merge static libraries

### Automatically merge target libraries

After 2.5.8, we can enable automatic merging of all dependent static libraries by setting the `build.merge_archive` strategy, for example:

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

The mul static library automatically merges the add and sub static libraries to generate a complete libmul.a library containing add/sub code.

This merge is relatively stable and complete, supports ar and msvc/lib.exe, also supports the merge of static libraries generated by the cross-compilation tool chain, and also supports static libraries with the same name obj file.

### Merge specified static library files

If the automatic merge does not meet the requirements, we can also actively call the `utils.archive.merge_archive` module to merge the specified static library list in the `after_link` stage.

```lua
target("test")
    after_link(function (target)
        import("utils.archive.merge_staticlib")
        merge_staticlib(target, "libout.a", {"libfoo.a", "libbar.a"})
    end)
```

### Use add_files to merge static libraries

In fact, our previous version already supports merging static libraries through `add_files("*.a")`.

```lua
target("test")
    set_kind("binary")
    add_files("*.a")
    add_files("*.c")
```

However, it has some drawbacks: if you use ar, there may be conflicts with the same name of the .obj object file and cause the merge to fail. Therefore, it is recommended to use the merge method described above, which is more stable, reliable, and simpler.

Related issues: [#1638](https://github.com/xmake-io/xmake/issues/1638)

## Nim Program

After v2.5.9, we have added support for the Nimlang project. For related issues, see: [#1756](https://github.com/xmake-io/xmake/issues/1756)

### Create an empty project

We can use the `xmake create` command to create an empty project.

```bash
xmake create -l nim -t console test
xmake create -l nim -t static test
xmake create -l nim -t shared test
```

### Console Program

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
```

```bash
$ xmake -v
[33%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache -o:b
uild/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

### Static library program

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
[33%]: linking.release libfoo.a
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/foo/macosx/x86_64/release/nimcache --app
:staticlib --noMain --passC:-DNimMain=NimMain_B6D5BD02 --passC:-DNimMainInner=NimMainInner_B6D5B
D02 --passC:-DNimMainModule=NimMainModule_B6D5BD02 --passC:-DPreMain=PreMain_B6D5BD02 --passC:-D
PreMainInner=PreMainInner_B6D5BD02 -o:build/macosx/x86_64/release/libfoo.a src/foo.nim
[66%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache --pa
ssL:-Lbuild/macosx/x86_64/release --passL:-lfoo -o:build/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

### Dynamic library program

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
[33%]: linking.release libfoo.dylib
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/foo/macosx/x86_64/release/nimcache --app
:lib --noMain -o:build/macosx/x86_64/release/libfoo.dylib src/foo.nim
[66%]: linking.release test
/usr/local/bin/nim c --opt:speed --nimcache:build/.gens/test/macosx/x86_64/release/nimcache --pa
ssL:-Lbuild/macosx/x86_64/release --passL:-lfoo -o:build/macosx/x86_64/release/test src/main.nim
[100%]: build ok!
```

### C code mixed compilation

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

### Nimble dependency package integration

For a complete example, see: [Nimble Package Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/nim/nimble_package)

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

### Native dependency package integration

For a complete example, see: [Native Package Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/nim/native_package)

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

## Keil/MDK Embedded Program

Related example project: [Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/embed/mdk/hello)

xmake will automatically detect the compiler installed by Keil/MDK, related issues [#1753](https://github.com/xmake-io/xmake/issues/1753).

Compile with armcc

```bash
$ xmake f -p cross -a cortex-m3 --toolchain=armcc -c
$ xmake
```

Compile with armclang

```bash
$ xmake f -p cross -a cortex-m3 --toolchain=armclang -c
$ xmake
```

### Executable program

```lua
target("hello")
     add_deps("foo")
     add_rules("mdk.console")
     add_files("src/*.c", "src/*.s")
     add_includedirs("src/lib/cmsis")
     set_runtimes("microlib")
```

It should be noted that when some mdk programs all use the microlib library to run, it requires the compiler to add the `__MICROLIB` macro definition, and the linker to add various configurations such as `--library_type=microlib`.

We can set directly to the microlib runtime library through `set_runtimes("microlib")`, and all relevant options can be set automatically.

### Static library program

```lua
add_rules("mode.debug", "mode.release")

target("foo")
     add_rules("mdk.static")
     add_files("src/foo/*.c")
     set_runtimes("microlib")
```

## Keil/C51 embedded programs

### Executable programs

```lua
target("hello")
    add_rules("c51.binary")
    set_toolchains("c51")
    add_files("src/main.c")
```

## Linux kernel driver module

In version v2.6.2, xmake fully supports the construction of Linux kernel driver modules. This may be the first and only third-party build tool that supports compiling Linux kernel drivers.

### Hello world module

Full example: [Linux Kernel Driver Modules](https://github.com/xmake-io/xmake/tree/master/tests/projects/linux/driver/hello)

Its configuration is very simple. You only need to configure the linux-headers package that supports the module, and then apply the `platform.linux.driver` build rule.

```lua
add_requires("linux-headers", {configs = {driver_modules = true}})

target("hello")
    add_rules("platform.linux.driver")
    add_files("src/*.c")
    add_packages("linux-headers")
    set_license("GPL-2.0")
```

Then directly execute the xmake command, compile with one key, and generate the kernel driver module hello.ko.

```bash
$ xmake
[20%]: cache compiling.release src/add.c
[20%]: cache compiling.release src/hello.c
[60%]: linking.release build/linux/x86_64/release/hello.ko
[100%]: build ok!
```

We can also look at the complete build command parameters.

```bash
$ xmake -v
[20%]: cache compiling.release src/add.c
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr /src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux -headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr /src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\ "hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno -80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect -branch-re gister -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops= 1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone- fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"add\ "-o build/.objs/hello/linux/x86_64/release/src/add.co src/add.c
[20%]: cache compiling.release src/hello.c
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr /src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux -headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr /src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\ "hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno-mmx -mno-sse2 -mno-3dnow -mno-avx -mno -80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red-zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect -branch-re gister -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -fcf-protection=none -falign-jumps=1 -falign-loops= 1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store-data-races -fno-reorder-blocks -fno-ipa-cp-clone- fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"hello\ "-o build/.objs/hello/linux/x86_64/release/src/hello.co src/hello.c
[60%]: linking.release build/linux/x86_64/release/hello.ko
/usr/bin/ld -m elf_x86_64 -r -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.o build/.objs/hello/linux/x86_64/ release/src/add.co build/.objs/hello/linux/x86_64/release/src/hello.co
/usr/src/linux-headers-5.11.0-41-generic/scripts/mod/modpost -m -a -o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/Module .symvers -e -N -T-
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /usr/bin/gcc -c -m64 -O2 -std=gnu89 -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include -I/usr /src/linux-headers-5.11.0-41-generic/arch/x86/include/generated -I/usr/src/linux-headers-5.11.0-41-generic/include -I/usr/src/linux -headers-5.11.0-41-generic/arch/x86/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/arch/x86/include/generated/uapi -I/usr /src/linux-headers-5.11.0-41-generic/include/uapi -I/usr/src/linux-headers-5.11.0-41-generic/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -DCONFIG_X86_X32_ABI -isystem /usr/lib/gcc/x86_64-linux-gnu/10/include -include /usr/src/linux-headers- 5.11.0-41-generic/include/linux/kconfig.h -include /usr/src/linux-headers-5.11.0-41-generic/include/linux/compiler_types.h -nostdinc -mno-sse -mno- mmx -mno-sse2 -mno-3dnow -mno-avx -mno-80387 -mno-fp-ret-in-387 -mpreferred-stack-boundary=3 -mskip-rax-setup -mtune=generic -mno-red- zone -mcmodel=kernel -mindirect-branch=thunk-extern -mindirect-branch-register -mrecord-mcount -fmacro-prefix-map=./= -fno-strict-aliasing -fno-common -fshort-wchar -fno- PIE -fcf-protection=none -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-allow-store- data-races -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict- overflow -fno-stack-check -fconserve-stack -o build/.o bjs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.mod.o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko. mod.c
/usr/bin/ld -m elf_x86_64 -r --build-id=sha1 -T /usr/src/linux-headers-5.11.0-41-generic/scripts/module.lds -o build/linux/x86_64/ release/hello.ko build/.objs/hello/linux/x86_64/release/build/linux/x86_64/release/hello.ko.o build/.objs/hello/linux/x86_64/release/build/linux/x86_64/ release/hello.ko.mod.o

```

Through the `add_requires("linux-headers", {configs = {driver_modules = true}})` configuration package, xmake will automatically find the corresponding linux-headers package from the system first.

If it is not found, xmake will also automatically download it, and then automatically configure and build the kernel source code with driver modules, and use it to continue building the kernel module.

### Custom linux-headers path

Since the release of v2.6.2, there have been many feedbacks from users. In most cases, the linux kernel driver is built based on a customized version of the linux kernel, so it is necessary to be able to customize the configuration of the linux-headers path instead of using the remote dependency package mode.

In fact, we can do this by rewriting the linux-headers package ourselves.

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

But this may be a bit cumbersome, so in v2.6.3, we support more convenient setting of the linux-headers path.

```lua
target("hello")
    add_rules("platform.linux.driver")
    add_files("src/*.c")
    set_values("linux.driver.linux-headers", "/usr/src/linux-headers-5.11.0-41-generic")
```

We can also pass in the linux-headers path as `xmake f --linux-headers=/usr/src/linux-headers` by defining option options.

```lua
option("linux-headers", {showmenu = true, description = "Set linux-headers path."})
target("hello")
    add_rules("platform.linux.driver")
    add_files("src/*.c")
    set_values("linux.driver.linux-headers", "$(linux-headers)")
```

For more details, please see: [#1923](https://github.com/xmake-io/xmake/issues/1923)

### Cross compilation

We also support cross-compilation of kernel driver modules, such as using cross-compilation tool chain on Linux x86_64 to build Linux Arm/Arm64 driver modules.

We only need to prepare our own cross-compilation tool chain, specify its root directory through `--sdk=`, then switch to the `-p cross` platform configuration, and finally specify the architecture arm/arm64 to be built.

The cross toolchain used here can be downloaded from here: [Download toolchains](https://releases.linaro.org/components/toolchain/binaries/latest-7/aarch64-linux-gnu/)

For more, cross-compilation configuration documents, see: [Configure cross-compilation](/guide/configuration?id=common-cross-compilation-configuration)

!> Currently only supports arm/arm64 cross-compilation architecture, and more platform architectures will be supported in the future.

#### Build Arm driver module

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
[20%]: cache compiling.release src/add.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc -c -O2 -std=gnu89 -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include /generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805 /arch/arm/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated/uapi -I/home/ruki/.xmake /packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/generated/uapi -D__KERNEL__ DMODULE -DKBUILD_MODNAME=\"hello\" -D__LINUX_ARM_ARCH__=6 -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf /bin/../lib/gcc/arm-linux-gnueabihf/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/kconfig .h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar- fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa- cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -mbig- endian -mabi=aapcs-linux -mfpu=vfp -marm -march=armv6k -mtune=arm1136j-s -msoft-float -Uarm -DKBUILD_BASENAME=\"add\" -o build/.objs/hello/cross/arm/ release/src/add.co src/add.c
[20%]: cache compiling.release src/hello.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc -c -O2 -std=gnu89 -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/ 7695a30b7add4d3aa4685cbac6815805/arch/arm/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated/uapi -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -D__LINUX_ARM_ARCH__=6 -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/../lib/gcc/arm-linux-gnueabihf/ 7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/kconfig.h -include /home/ruki/.xmake/packages/l/ linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/compiler_types.h -nostdinc -fno-strict-alia sing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks- fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno- stack-check -fconserve-stack -mbig-endian -mabi=aapcs-linux -mfpu=vfp -marm -march=armv6k -mtune=arm1136j-s -msoft-float -Uarm -DKBUILD_BASENAME=\"hello\" -o build /.objs/hello/cross/arm/release/src/hello.co src/hello.c
checking for flags (-MMD -MF) ... ok
checking for flags (-fdiagnostics-color=always) ... ok
[60%]: linking.release build/cross/arm/release/hello.ko
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-ld -EB -r -o build/.objs/hello/cross/arm/release/build/cross /arm/release/hello.ko.o build/.objs/hello/cross/arm/release/src/add.co build/.objs/hello/cross/arm/release/src/hello.co
/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/scripts/mod/modpost -m -a -o build/.objs/hello/cross/arm/release/build/cross/ arm/release/Module.symvers -e -N -T-
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-gcc -c -O2 -std=gnu89 -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include /generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805 /arch/arm/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/arch/arm/include/generated/uapi -I/home/ruki/.xmake /packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/generated/uapi -D__KERNEL__ DMODULE -DKBUILD_MODNAME=\"hello\" -D__LINUX_ARM_ARCH__=6 -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf /bin/../lib/gcc/arm-linux-gnueabihf/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/kconfig .h -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar- fno-PIE -falign-jumps=1 -falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa- cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -mbig- endian -mabi=aapcs-linux -mfpu=vfp -marm -march=armv6k -mtune=arm1136j-s -msoft-float -Uarm -o build/.objs/hello/cross/arm/release/build/cross/arm/ release/hello.ko.mod.o build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.mod.c
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_arm-linux-gnueabihf/bin/arm-linux-gnueabihf-ld -EB --be8 -r --build-id=sha1 -T /home/ruki/. xmake/packages/l/linux-headers/5.10.46/7695a30b7add4d3aa4685cbac6815805/scripts/module.lds -o build/cross/arm/release/hello.ko build/.objs/hello/cross/arm/release/build/cross /arm/release/hello.ko.o build/.objs/hello/cross/arm/release/build/cross/arm/release/hello.ko.mod.o
[100%]: build ok!

```

#### Build Arm64 driver module

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
[20%]: cache compiling.release src/add.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc -c -O2 -std=gnu89 -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include /generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de /arch/arm64/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated/uapi -I/home/ruki/.xmake /packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/generated/uapi -D__KERNEL__- DMODULE -DKBUILD_MODNAME=\"hello\" -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/../lib/gcc/aarch 64-linux-gnu/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/kconfig.h -include /home/ruki/. xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1- falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining- fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"add\" -o build/. objs/hello/cross/arm64/release/src/add.co src/add.c
[20%]: cache compiling.release src/hello.c
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc -c -O2 -std=gnu89 -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include /generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de /arch/arm64/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated/uapi -I/home/ruki/.xmake /packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/generated/uapi -D__KERNEL__- DMODULE -DKBUILD_MODNAME=\"hello\" -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/../lib/gcc/aarch 64-linux-gnu/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/kconfig.h -include /home/ruki/. xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1- falign-loops=1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno-ipa-cp-clone -fno-partial-inlining- fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack -DKBUILD_BASENAME=\"hello\" -o build/. objs/hello/cross/arm64/release/src/hello.co src/hello.c
checking for flags (-MMD -MF) ... ok
checking for flags (-fdiagnostics-color=always) ... ok
[60%]: linking.release build/cross/arm64/release/hello.ko
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-ld -EL -maarch64elf -r -o build/.objs/hello/cross/arm64/release/build /cross/arm64/release/hello.ko.o build/.objs/hello/cross/arm64/release/src/add.co build/.objs/hello/cross/arm64/release/src/hello.co
/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/scripts/mod/modpost -m -a -o build/.objs/hello/cross/arm64/release/build/cross/ arm64/release/Module.symvers -e -N -T-
WARNING: modpost: Symbol info of vmlinux is missing. Unresolved symbol check will be entirely skipped.
/usr/bin/ccache /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-gcc -c -O2 -std=gnu89 -I/home/ruki/. xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include /generated -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/arch/arm64/include/generated/uapi -I /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/uapi -I/home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include /generated/uapi -D__KERNEL__ -DMODULE -DKBUILD_MODNAME=\"hello\" -isystem /mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/../lib/gcc/aarch64-linux- gnu/7.5.0/include -include /home/ruki/.xmake/packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/kconfig.h -include /home/ruki/.xmake/packages/ l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/include/linux/compiler_types.h -nostdinc -fno-strict-aliasing -fno-common -fshort-wchar -fno-PIE -falign-jumps=1 -falign-loops= 1 -fno-asynchronous-unwind-tables -fno-jump-tables -fno-delete-null-pointer-checks -fno-reorder-blocks -fno- ipa-cp-clone -fno-partial-inlining -fstack-protector-strong -fno-inline-functions-called-once -falign-functions=32 -fno-strict-overflow -fno-stack-check -fconserve-stack- o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.mod.o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/ hello.ko.mod.c
/mnt/gcc-linaro-7.5.0-2019.12-x86_64_aarch64-linux-gnu/bin/aarch64-linux-gnu-ld -EL -maarch64elf -r --build-id=sha1 -T /home/ruki/.xmake /packages/l/linux-headers/5.10.46/8f80101835834bc2866f3a827836b5de/scripts/module.lds -o build/cross/arm64/release/hello.ko build/.objs/hello/cross/arm64/release/build/cross/ arm64/release/hello.ko.o build/.objs/hello/cross/arm64/release/build/cross/arm64/release/hello.ko.mod.o
[100%]: build ok!
```

## ASN.1 program

ASN.1 programs need to use [ASN.1 Compiler](https://github.com/vlm/asn1c) to generate relevant .c files to participate in project compilation.

While Xmake provides built-in `add_rules("asn1c")` rules to process `.c` file generation, `add_requires("asn1c")` automatically pulls and integrates ASN.1 compiler tools.

Here is a basic configuration example:

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

For details, see [Example Project](https://github.com/xmake-io/xmake/tree/master/tests/projects/c/asn1c).

## Verilog Program

### iVerilog Simulator

Through `add_requires("iverilog")` configuration, we can automatically pull the iverilog toolchain package, and then use `set_toolchains("@iverilog")` to automatically bind the toolchain to compile the project.

```lua
add_requires("iverilog")
target("hello")
     add_rules("iverilog.binary")
     set_toolchains("@iverilog")
     add_files("src/*.v")
```

#### Set abstract configuration

```Lua
add_requires("iverilog")
target("hello")
     add_rules("iverilog.binary")
     set_toolchains("@iverilog")
     add_files("src/*.v")
     add_defines("TEST")
     add_includedirs("inc")
     set_languages("v1800-2009")
```

We can use `set_languages("v1800-2009")` to set the language standard for switching Verilog.

Currently supported values and mappings are as follows:

```lua
["v1364-1995"] = "-g1995"
["v1364-2001"] = "-g2001"
["v1364-2005"] = "-g2005"
["v1800-2005"] = "-g2005-sv"
["v1800-2009"] = "-g2009"
["v1800-2012"] = "-g2012"
```

#### Set custom flags


```lua
add_requires("iverilog")
target("hello")
     add_rules("iverilog.binary")
     set_toolchains("@iverilog")
     add_files("src/*.v")
     add_values("iverilogs.flags", "-DTEST")
```

#### Build the project

```bash
$ xmake
check iverilog... iverilog
check vvp... vvp
[50%]: linking.iverilog hello.vvp
[100%]: build ok!
```

#### Run the program

```bash
$ xmake run
hello world!
LXT2 INFO: dumpfile hello.vcd opened, ready for output.
src/main.v:6: $finish called at 0 (1s)
```

More complete examples: [iVerilog Examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/embed/iverilog)

### Verilator Simulator

Through `add_requires("verilator")` configuration, we can automatically pull the verilator toolchain package, and then use `set_toolchains("@verilator")` to automatically bind to the toolchain to compile the project.

```lua
add_requires("verilator")
target("Hello")
     add_rules("verilator.binary")
     set_toolchains("@verilator")
     add_files("src/*.v")
     add_files("src/*.cpp")
```

verilator project, we need an additional `sim_main.cpp` file to participate in the compilation, as the entry code of the program.

```c
#include "hello.h"
#include "verilated.h" (Simplified Chinese)

int main(int argc, char** argv) {
     VerilatedContext* contextp = new VerilatedContext;
     contextp->commandArgs(argc, argv);
     hello* top = new hello{contextp};
     while (!contextp->gotFinish()) { top->eval(); }
     remove top.
     Remove contextp.
     returns 0.
}
```

#### Set abstract configuration

```lua
add_requires("verilator")
target("Hello")
     add_rules("verilator.binary")
     set_toolchains("@verilator")
     add_files("src/*.v")
     add_defines("TEST")
     add_includedirs("inc")
     set_languages("v1800-2009")
```

We can use `set_languages("v1800-2009")` to set the language standard for switching Verilog.

Currently supported values and mappings are as follows.

```lua
--Verilog
["v1364-1995"] = "+1364-1995ext+v".
["v1364-2001"] = "+1364-2001ext+v".
["v1364-2005"] = "+1364-2005ext+v".
--system-Verilog
["v1800-2005"] = "+1800-2005ext+v".
["v1800-2009"] = "+1800-2009ext+v".
["v1800-2012"] = "+1800-2012ext+v",
["v1800-2017"] = "+1800-2017ext+v".
```

#### Set custom flags

```lua
add_requires("verilator")
target("Hello")
     add_rules("verilator.binary")
     set_toolchains("@verilator")
     add_files("src/*.v")
     add_files("src/*.cpp")
     add_values("verilator.flags", "--trace", "--timing")
```

#### Build the project

```bash
$ xmake
[ 0%]: compiling.verilog src/main.v
[ 15%]: cache compiling.release /Users/ruki/.xmake/packages/v/verilator/2023.1.10/cd2268409c1d44799288c7759b3cbd56/share/verilator/include/verilated.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__Slow.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h9053a130__0__Slow.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello.cpp
[ 15%]: cache compiling.release /Users/ruki/.xmake/packages/v/verilator/2023.1.10/cd2268409c1d44799288c7759b3cbd56/share/verilator/include/verilated_threads.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello__Syms.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h07139e86__0.cpp
[15%]: cache compiling.release src/sim_main.cpp
[ 15%]: cache compiling.release build/.gens/hello/macosx/x86_64/release/rules/verilator/hello___024root__DepSet_h9053a130__0.cpp
[84%]: linking. release hello
[100%]: build ok!
```

#### Run the program

```bash
$ xmake run
ruki-2:hello ruki$ xmake run
hello world!
- src/main.v:4:Verilog $finish
```

A more complete example: [Verilator](https://github.com/xmake-io/xmake/tree/master/tests/projects/embed/verilator)

#### Compile static library

We also provide `verilator.static` rules to compile and generate verilator static libraries.

```lua
add_requires("verilator")
target("hello")
     add_rules("verilator.static")
     set_toolchains("@verilator")
     add_files("src/*.v")

target("test")
     add_deps("hello")
     add_files("src/*.cpp")
```

## Cppfront Program

```lua
add_rules("mode.debug", "mode.release")

add_requires("cppfront")

target("test")
    add_rules("cppfront")
    set_kind("binary")
    add_files("src/*.cpp2")
    add_packages("cppfront")
```

## Cosmocc Program

```lua
add_rules("mode.debug", "mode.release")

add_requires("cosmocc")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("@cosmocc")
```
