

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

## Share Library Program

```lua
target("library")
    set_kind("shared")
    add_files("src/library/*.c")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_deps("library")
```

We use `add_deps` to link a share library to test target.

For a complete example, execute the following command to create:

```bash
xmake create -l c -t shared test
```

## Qt Program

Create an empty project:

v2.2.9 or higher:

```console
$ xmake create -t qt.console test
$ xmake create -t qt.static test
$ xmake create -t qt.shared test
$ xmake create -t qt.quickapp test
$ xmake create -t qt.widgetapp test
```

For more project templates see: `xmake create --help`

Older version of v2.2.8:

```console
$ xmake create -l c++ -t console_qt test
$ xmake create -l c++ -t static_qt test
$ xmake create -l c++ -t shared_qt test
$ xmake create -l c++ -t quickapp_qt test
```

xmake will detect Qt SDK automatically and we can also set the SDK directory manually.

```console
$ xmake f --qt=~/Qt/Qt5.9.1
```

The MingW SDK specified above uses the environment that comes with the Tools directory under Qt. Of course, if there are other third-party MingW compilation environments, they can also be specified manually. 
For details, please refer to: [MingW Configuration](/guide/configuration?id=mingw).

For more details, please refer to: [#160](https://github.com/xmake-io/xmake/issues/160)

In addition, currently xmake also supports Qt/Wasm. For details, see: [Wasm Configuration](/guide/configuration?id=wasm)

```console
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
[0%]: ccache compiling.release src/main.cpp
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

```console
$ xmake create -t quickapp_qt -l c ++ appdemo
$ cd appdemo
$ xmake f -p android --ndk=~/Downloads/android-ndk-r19c/ --android_sdk=~/Library/Android/sdk/ -c
$ xmake
[0%]: compiling.qt.qrc src/qml.qrc
[ 50%]: ccache compiling.release src/main.cpp
[100%]: linking.release libappdemo.so
[100%]: generating.qt.app appdemo.apk
```

Then install to the device:

```console
$ xmake install
installing appdemo ...
installing build/android/release/appdemo.apk ..
success
install ok!👌
```

## WDK Driver Program

xmake will detect WDK automatically and we can also set the WDK directory manually.

```console
$ xmake f --wdk="G:\Program Files\Windows Kits\10" -c
$ xmake
```

If you want to known more information, you can see [#159](https://github.com/xmake-io/xmake/issues/159).

And see [WDK examples](https://github.com/xmake-io/xmake/tree/master/tests/projects/wdk)

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

```console
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

```console
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

```console
$ xmake create -t xcode.macapp -l objc test
$ xmake create -t xcode.iosapp -l objc test
```

#### Build Program

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

#### Codesign

For iOS programs, it will detect that the system first signs the app with available signatures. Of course, we can also manually specify other signature certificates:

```console
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
	<string>XC org tboox test</string>
	<key>ApplicationIdentifierPrefix</key>
	<array>
	<string>43AAQM58X3</string>
...
```

We also provide other auxiliary tools to re-sign existing ipa / app programs, for example:

```console
$ xmake l utils.ipa.resign test.ipa | test.app [codesign_identity] [mobile_provision] [bundle_identifier]
```

Among them, the following signature parameters are optional, if not set, then a valid signature will be detected by default:

```console
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

```console
$ xmake package
output: build/iphoneos/release/arm64/test.ipa
package ok!
```

We also provide auxiliary tools to package the specified app program:

```console
$ xmake l utils.ipa.package test.app output.ipa [iconfile.png]
```

#### Install

If it is an iOS program, it will install ipa to the device, if it is macos, it will install the app to the `/Applications` directory.

```console
$ xmake install
```

We also provide auxiliary tools to install the specified ipa/app program to the device:

```console
$ xmake l utils.ipa.install test.app
$ xmake l utils.ipa.install test.ipa
```

#### Uninstall

!> Currently only the macos program is supported

```console
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

```console
$ xmake create -t xcode.framework -l objc test
```

In addition, xmake v2.3.9 and above, xmake also provides a complete iosapp/macapp empty project template with framework library usage, you can fully experience framework compilation, dependent use and integration into app applications.

At the same time, if we turn on the emulator, xmake can support directly `xmake install` and `xmake run` to install the app to the emulator and load and run it.

```console
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

```console
$ xmake create -t xcode.bundle -l objc test
```

## Protobuf program

### Using c library

```lua
add_requires("protobuf-c")

target("console_c")
     set_kind("binary")
     add_packages("protobuf-c")

     add_files("src/*.c")
     add_files("src/*.proto", {rules = "protobuf.c"})
```

In version 2.5.5, we can also set `proto_public = true` to export the proto header file search directory and open it to other parent targets for inheritance.

```lua
     add_files("src/**.proto", {rules = "protobuf.c", proto_public = true})
```

### Using the C++ library

```lua
add_requires("protobuf-cpp")

target("console_c++")
     set_kind("binary")
     set_languages("c++11")

     add_packages("protobuf-cpp")

     add_files("src/*.cpp")
     add_files("src/*.proto", {rules = "protobuf.cpp"})
```

## Cuda Program

Create an empty project:

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

!> Starting with v2.2.7, the default build will enable device-link. (see [Separate Compilation and Linking of CUDA C++ Device Code](https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/))
If you want to disable device-link, you can set it with `add_values("cuda.devlink", false)`.

xmake will detect Cuda SDK automatically and we can also set the SDK directory manually.

```console
$ xmake f --cuda=/usr/local/cuda-9.1/
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

```console
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

```console
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

```console
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

```console
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

```console
$ xmake create -l rust -t console test
```

xmake.lua content:

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/*.rs")
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

```console
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

```console
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

```console
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

## Linux Bpf program

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

## Vala program

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

## Pascal program

After 2.5.8, we can support the construction of Pascal programs. For related issues, see: [#388](https://github.com/xmake-io/xmake/issues/388)

### Console program

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

## Swig Module

Version 2.5.8 supports the construction of Swig modules. We provide `swig.c` and `swig.cpp` rules, which respectively support the generation of c/c++ module interface code, and cooperate with xmake's package management system to realize fully automated modules and dependent packages. Integration.

Related issues: [#1622](https://github.com/xmake-io/xmake/issues/1622)

### Lua/C Module

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

### Python/C++ Module

```lua
add_rules("mode.release", "mode.debug")
add_requires("python 3.x")

target("example")
    add_rules("swig.cpp", {moduletype = "python"})
    add_files("src/example.i", {scriptdir = "share"})
    add_files("src/example.cpp")
    add_packages("python")
```

### C++20 Module

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

### Merge static libraries

#### Automatically merge target libraries

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

#### Merge specified static library files

If the automatic merge does not meet the requirements, we can also actively call the `utils.archive.merge_archive` module to merge the specified static library list in the `after_link` stage.

```lua
target("test")
    after_link(function (target)
        import("utils.archive.merge_staticlib")
        merge_staticlib(target, "libout.a", {"libfoo.a", "libbar.a"})
    end)
```

#### Use add_files to merge static libraries

In fact, our previous version already supports merging static libraries through `add_files("*.a")`.

```lua
target("test")
    set_kind("binary")
    add_files("*.a")
    add_files("*.c")
```

However, it has some drawbacks: if you use ar, there may be conflicts with the same name of the .obj object file and cause the merge to fail. Therefore, it is recommended to use the merge method described above, which is more stable, reliable, and simpler.

Related issues: [#1638](https://github.com/xmake-io/xmake/issues/1638)

## Nim program

After v2.5.9, we have added support for the Nimlang project. For related issues, see: [#1756](https://github.com/xmake-io/xmake/issues/1756)

### Create an empty project

We can use the `xmake create` command to create an empty project.

```console
xmake create -l nim -t console test
xmake create -l nim -t static test
xmake create -l nim -t shared test
```

### Console program

```lua
add_rules("mode.debug", "mode.release")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
```

```console
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

```console
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

```console
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

Related example project: [Example](https://github.com/xmake-io/xmake/tree/dev/tests/projects/mdk/hello)

xmake will automatically detect the compiler installed by Keil/MDK, related issues [#1753](https://github.com/xmake-io/xmake/issues/1753).

Compile with armcc

```console
$ xmake f -p cross -a cortex-m3 --toolchain=armcc -c
$ xmake
```

Compile with armclang

```console
$ xmake f -p cross -a cortex-m3 --toolchain=armclang -c
$ xmake
```

### Console program

```lua
target("hello")
     add_deps("foo")
     add_rules("mdk.console")
     add_files("src/*.c", "src/*.s")
     add_defines("__EVAL", "__MICROLIB")
     add_includedirs("src/lib/cmsis")
```

### Static library program

```lua
add_rules("mode.debug", "mode.release")

target("foo")
     add_rules("mdk.static")
     add_files("src/foo/*.c")
```
