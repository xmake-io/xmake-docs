
## 可执行程序

```lua
target("test")
    set_kind("binary")
    add_files("src/*c")
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

## Qt程序

创建一个空工程：

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

```lua
target("qt_quickapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/qml.qrc")
    add_frameworks("QtQuick")
```

### Widgets应用程序

```lua
target("qt_widgetapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- 添加带有 Q_OBJECT 的meta头文件
    add_frameworks("QtWidgets")
```

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
installing build/android/armv7-a/release/appdemo.apk ..
Success
install ok!👌
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

## WDK驱动程序

默认会自动探测wdk所在环境，当然也可以指定wdk sdk环境目录：

```console
$ xmake f --wdk="G:\Program Files\Windows Kits\10" -c 
$ xmake
```

更多详情可以参考：[#159](https://github.com/xmake-io/xmake/issues/159)

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

