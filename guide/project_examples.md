We briefly introduce some commonly used project examples. More and more complete examples projects can be viewed in [project examples](https://github.com/xmake-io/xmake/tree/master/tests/projects).

We can also use the `xmake create` command to create various commonly used empty projects to quickly start. For the introduction of this command and the supported project templates, you can type the following command to view:

```bash
xmake create --help
```

## Executable Program

```lua
target("test")
    set_kind("binary")\b
    add_files("src/*c")
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
    add_files("src/*c")
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
    add_files("src/*c")
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

If you want to use the MinGW Qt environment on windows, you can set the MinGW platform configuration and specify the SDK path for the MinGW compilation environment, for example:

```console
$ xmake f -p mingw --sdk=C:\Qt\Qt5.10.1\Tools\mingw530_32 
```

If you want to known more information, you can see [#160](https://github.com/xmake-io/xmake/issues/160).

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

!> The new version provides the `qt.quickapp` rule, built-in QtQuick built-in rules, the use of simpler, the following version of the `qt.application` is still supported, backward compatible:

```lua
target("qt_quickapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/qml.qrc")
    add_frameworks("QtQuick")
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
    add_files("src/*.cpp")
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- add files with Q_OBJECT meta (only for qt.moc)
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
installing build/android/armv7-a/release/appdemo.apk ..
success
install ok!👌
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

<p class="tip">
Starting with v2.2.7, the default build will enable device-link. (see [Separate Compilation and Linking of CUDA C++ Device Code](https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/))
If you want to disable device-link, you can set it with `add_values("cuda.devlink", false)`.
</p>

xmake will detect Cuda SDK automatically and we can also set the SDK directory manually.

```console
$ xmake f --cuda=/usr/local/cuda-9.1/ 
$ xmake
```

If you want to known more information, you can see [#158](https://github.com/xmake-io/xmake/issues/158).

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

## Protobuf program

### Using c library

```lua
add_requires("protobuf-c")

target("console_c")
     set_kind("binary")
     add_packages("protobuf-c")

     add_files("src/*.c")
     add_files("src/*.proto", {rules = "protobuf-c"})
```

### Using the C++ library

```lua
add_requires("protobuf-cpp")

target("console_c++")
     set_kind("binary")
     set_languages("c++11")

     add_packages("protobuf-cpp")

     add_files("src/*.cpp")
     add_files("src/*.proto", {rules = "protobuf-cpp"})
```

## Lex&Yacc Program

```lua
target("calc")
     set_kind("binary")
     add_rules("lex", "yacc")
     add_files("src/*.l", "src/*.y")
```
