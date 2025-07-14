---
title: xmake v2.2.1 released, Support Qt, WDK and Cuda Compilation Environments
tags: [xmake, lua, update: Qt, WDK, Cuda]
date: 2018-06-17
author: Ruki
---

title: xmake v2.2.1 released, Support Qt, WDK and Cuda Compilation Environments
tags: [xmake, lua, update: Qt, WDK, Cuda]
date: 2018-06-17
author: Ruki

---
To make [xmake](https://github.com/xmake-io/xmake) more convenient and flexible to support other compilation environments, I spent four months to upgrade [custom rule rules](https://xmake.io/#/manual#custom-rule).

Users can now implement various compilation rules by customizing the rules, and xmake also has built-in common compilation rules that can be applied directly to the current project to support QT, WDK driver and Cuda compilation environments.

* [Github Repo](https://github.com/xmake-io/xmake)
* [Online documents](https://xmake.io)

Relative articles：

* [XMake: Support for the Qt SDK environment](http://tboox.org/2018/05/30/support-qt/)

### New features

* [#158](https://github.com/xmake-io/xmake/issues/158): Support CUDA Toolkit and Compiler
* Add `set_tools` and `add_tools` apis to change the toolchains for special target
* Add builtin rules: `mode.debug`, `mode.release`, `mode.profile` and `mode.check`
* Add `is_mode`, `is_arch` and `is_plat` builtin apis in the custom scripts
* Add color256 codes
* [#160](https://github.com/xmake-io/xmake/issues/160): Support Qt compilation environment and add `qt.console`, `qt.application` rules
* Add some Qt project templates
* [#169](https://github.com/xmake-io/xmake/issues/169): Support yasm for linux, macosx and windows
* [#159](https://github.com/xmake-io/xmake/issues/159): Support WDK driver compilation environment 

### Changes

* Add FAQ to the auto-generated xmake.lua
* Support android NDK >= r14
* Improve warning flags for swiftc
* [#167](https://github.com/xmake-io/xmake/issues/167): Improve custom rules
* Improve `os.files` and `os.dirs` api
* [#171](https://github.com/xmake-io/xmake/issues/171): Improve build dependence for qt rule
* Implement `make clean` for generating makefile plugin

### Bugs fixed

* Fix force to add flags bug
* [#157](https://github.com/xmake-io/xmake/issues/157): Fix generate pdb file error if it's output directory does not exists
* Fix strip all symbols bug for macho target file
* [#168](https://github.com/xmake-io/xmake/issues/168): Fix generate vs201x project bug with x86/x64 architectures






### Introduction to New features

#### Qt Program

Create an empty project:

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

If you want to known more information, you can see [#160](https://github.com/xmake-io/xmake/issues/160).

##### Static Library

```lua
target("qt_static_library")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

##### Shared Library

```lua
target("qt_shared_library")
    add_rules("qt.shared")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

##### Console Program

```lua
target("qt_console")
    add_rules("qt.console")
    add_files("src/*.cpp")
```

##### Quick Application

```lua
target("qt_quickapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/qml.qrc")
    add_frameworks("QtQuick")
```

##### Widgets Application

```lua
target("qt_widgetapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- add files with Q_OBJECT meta (only for qt.moc)
    add_frameworks("QtWidgets")
```

#### Cuda Program

Create an empty project:

```console
$ xmake create -P test -l cuda
$ cd test
$ xmake
```

```lua
target("cuda_console")
    set_kind("binary")
    add_files("src/*.cu")

    -- generate SASS code for each SM architecture
    for _, sm in ipairs({"30", "35", "37", "50", "52", "60", "61", "70"}) do
        add_cuflags("-gencode arch=compute_" .. sm .. ",code=sm_" .. sm)
        add_ldflags("-gencode arch=compute_" .. sm .. ",code=sm_" .. sm)
    end

    -- generate PTX code from the highest SM architecture to guarantee forward-compatibility
    sm = "70"
    add_cuflags("-gencode arch=compute_" .. sm .. ",code=compute_" .. sm)
    add_ldflags("-gencode arch=compute_" .. sm .. ",code=compute_" .. sm)
```

xmake will detect Cuda SDK automatically and we can also set the SDK directory manually.

```console
$ xmake f --cuda=/usr/local/cuda-9.1/ 
$ xmake
```

If you want to known more information, you can see [#158](https://github.com/xmake-io/xmake/issues/158).

#### WDK Driver Program

xmake will detect WDK automatically and we can also set the WDK directory manually.

```console
$ xmake f --wdk="G:\Program Files\Windows Kits\10" -c
$ xmake
```

If you want to known more information, you can see [#159](https://github.com/xmake-io/xmake/issues/159).

##### UMDF Driver Program

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

##### KMDF Driver Program

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

##### WDM Driver Program

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

##### Package Driver 

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

##### Driver Signing

The driver signing is disabled when we compile driver in default case, 
but we can add `set_values("wdk.sign.mode")` to enable test/release sign.

###### TestSign

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

###### ReleaseSign

We can set a certificate file for release signing.

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "release")
    set_values("wdk.sign.company", "xxxx")
    set_values("wdk.sign.certfile", path.join(os.projectdir(), "xxxx.cer"))
```

##### Support Low-version System

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

#### WinSDK Application Program

```lua
target("usbview")
    add_rules("win.sdk.application")

    add_files("*.c", "*.rc")
    add_files("xmlhelper.cpp", {rule = "win.sdk.dotnet"})
```

If you want to known more information, you can see [#173](https://github.com/xmake-io/xmake/issues/173).