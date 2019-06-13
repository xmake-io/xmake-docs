---
search: en
---

<p>
<div align="center">
  <a href="https://xmake.io">
    <img width="200" heigth="200" src="https://tboox.org/static/img/xmake/logo256c.png">
  </a>  

  <h1>xmake</h1>

  <div>
    <a href="https://travis-ci.org/xmake-io/xmake">
      <img src="https://img.shields.io/travis/xmake-io/xmake/master.svg?style=flat-square" alt="travis-ci" />
    </a>
    <a href="https://ci.appveyor.com/project/waruqi/xmake/branch/master">
      <img src="https://img.shields.io/appveyor/ci/waruqi/xmake/master.svg?style=flat-square" alt="appveyor-ci" />
    </a>
    <a href="https://aur.archlinux.org/packages/xmake">
      <img src="https://img.shields.io/aur/votes/xmake.svg?style=flat-square" alt="AUR votes" />
    </a>
    <a href="https://github.com/xmake-io/xmake/releases">
      <img src="https://img.shields.io/github/release/xmake-io/xmake.svg?style=flat-square" alt="Github All Releases" />
    </a>
  </div>
  <div>
    <a href="https://github.com/xmake-io/xmake/blob/master/LICENSE.md">
      <img src="https://img.shields.io/github/license/xmake-io/xmake.svg?colorB=f48041&style=flat-square" alt="license" />
    </a>
    <a href="https://www.reddit.com/r/tboox/">
      <img src="https://img.shields.io/badge/chat-on%20reddit-ff3f34.svg?style=flat-square" alt="Reddit" />
    </a>
    <a href="https://gitter.im/tboox/tboox?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge">
      <img src="https://img.shields.io/gitter/room/tboox/tboox.svg?style=flat-square&colorB=96c312" alt="Gitter" />
    </a>
    <a href="https://t.me/tbooxorg">
      <img src="https://img.shields.io/badge/chat-on%20telegram-blue.svg?style=flat-square" alt="Telegram" />
    </a>
    <a href="https://jq.qq.com/?_wv=1027&k=5hpwWFv">
      <img src="https://img.shields.io/badge/chat-on%20QQ-ff69b4.svg?style=flat-square" alt="QQ" />
    </a>
    <a href="https://xmake.io/pages/donation.html#donate">
      <img src="https://img.shields.io/badge/donate-us-orange.svg?style=flat-square" alt="Donate" />
    </a>
  </div>

  <p>A cross-platform build utility based on Lua</p>
</div>
</p>

## Introduction 

xmake is a cross-platform build utility based on lua. 

The project focuses on making development and building easier and provides many features (.e.g package, install, plugin, macro, action, option, task ...), 
so that any developer can quickly pick it up and enjoy the productivity boost when developing and building project.

## Installation

#### Master

##### via curl

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh)
```

##### via wget

```bash
bash <(wget https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh -O -)
```

##### via powershell

```bash
Invoke-Expression (Invoke-Webrequest 'https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.ps1' -UseBasicParsing).Content
```

#### Windows

##### via installer

1. Download xmake windows installer from [Releases](https://github.com/xmake-io/xmake/releases)
2. Run xmake-[version].exe

##### via scoop

```bash
scoop install xmake
```

#### MacOS

```bash
$ brew install xmake
```

#### Linux

On Archlinux:

```bash
$ yaourt xmake
```

On Ubuntu:

```bash
$ sudo add-apt-repository ppa:tboox/xmake
$ sudo apt update
$ sudo apt install xmake
```

Or add xmake package source manually:

```
deb http://ppa.launchpad.net/tboox/xmake/ubuntu yakkety main 
deb-src http://ppa.launchpad.net/tboox/xmake/ubuntu yakkety main 
```

Then we run:

```bash
$ sudo apt update
$ sudo apt install xmake
```

Or download deb package to install it:

1. Download xmake `.deb` install package from [Releases](https://github.com/xmake-io/xmake/releases) 
2. Run `dpkg -i xmake-xxxx.deb`

#### Compilation

Compile and install:

```bash
$ git clone https://github.com/xmake-io/xmake.git
$ cd ./xmake
$ ./scripts/get.sh __local__
```

Only install and update lua scripts:

```bash
$ ./scripts/get.sh __local__ __install_only__
```

Uninstall:

```bash
$ ./scripts/get.sh __uninstall__
```

Or compile and install via make:

```bash
$ make build; sudo make install
```

Install to other given directory:

```bash
$ sudo make install prefix=/usr/local
```

Uninstall:

```bash
$ sudo make uninstall
```

#### Update

We can run `xmake update` to update xmake version after v2.2.3 and we can also update to the given version:

```bash
$ xmake update 2.2.4
```

We can also specify an update to the master/dev branch version:

```bash
$ xmake update master
$ xmake update dev
```

Finally, if we want to uninstall xmake, it is also supported: `xmake update --uninstall`.

## Quick Start

[![asciicast](https://asciinema.org/a/133693.png)](https://asciinema.org/a/133693)

#### Create Project

```bash
$ xmake create -l c -P ./hello
```

And xmake will generate some files for c language project:

```
hello
├── src
│   └── main.c
└── xmake.lua
```

It is a simple console program only for printing `hello xmake!`

The content of `xmake.lua` is very simple:

```lua
target("hello")
    set_kind("binary")
    add_files("src/*.c") 
```

Support languages:

* c/c++
* objc/c++
* cuda
* asm
* swift
* dlang
* golang
* rust

<p class="tip">
    If you want to known more options, please run: `xmake create --help`
</p>

#### Build Project

```bash
$ xmake
```

#### Run Program

```bash
$ xmake run hello
```

#### Debug Program

```bash
$ xmake run -d hello 
```

It will start the debugger (.e.g lldb, gdb, windbg, vsjitdebugger, ollydbg ..) to load our program.

```bash
[lldb]$target create "build/hello"
Current executable set to 'build/hello' (x86_64).
[lldb]$b main
Breakpoint 1: where = hello`main, address = 0x0000000100000f50
[lldb]$r
Process 7509 launched: '/private/tmp/hello/build/hello' (x86_64)
Process 7509 stopped
* thread #1: tid = 0x435a2, 0x0000000100000f50 hello`main, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x0000000100000f50 hello`main
hello`main:
->  0x100000f50 <+0>:  pushq  %rbp
    0x100000f51 <+1>:  movq   %rsp, %rbp
    0x100000f54 <+4>:  leaq   0x2b(%rip), %rdi          ; "hello world!"
    0x100000f5b <+11>: callq  0x100000f64               ; symbol stub for: puts
[lldb]$
```

<p class="tip">
    You can also use short command option, for exmaple: `xmake r` or `xmake run`
</p>

## Project Examples

#### Executable Program

```lua
target("test")
    set_kind("binary")
    add_files("src/*c")
```

#### Static Library Program

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

#### Share Library Program

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

If you want to use the MinGW Qt environment on windows, you can set the MinGW platform configuration and specify the SDK path for the MinGW compilation environment, for example:

```console
$ xmake f -p mingw --sdk=C:\Qt\Qt5.10.1\Tools\mingw530_32 
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

##### Android Application

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

#### Cuda Program

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
Starting with v2.2.7, the default build will enable device-link, @see https://devblogs.nvidia.com/separate-compilation-linking-cuda-device-code/
If you want to disable device-link, you can set it with `add_values("cuda.devlink", false)`.
</p>

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

## Configuration

Set compilation configuration before building project with command `xmake f|config`.

And if you want to known more options, please run: `xmake f --help`。

<p class="tip">
    You can use short or long command option, for exmaple: <br>
    `xmake f` or `xmake config`.<br>
    `xmake f -p linux` or `xmake config --plat=linux`.
</p>

#### Target Platforms

##### Current Host

```bash
$ xmake
```

<p class="tip">
    XMake will detect the current host platform automatically and build project.
</p>

##### Linux

```bash
$ xmake f -p linux [-a i386|x86_64]
$ xmake
```

##### Android

```bash
$ xmake f -p android --ndk=~/files/android-ndk-r10e/ [-a armv5te|armv6|armv7-a|armv8-a|arm64-v8a]
$ xmake
```

If you want to set the other android toolchains, you can use [--bin](#-bin) option.

For example:

```bash
$ xmake f -p android --ndk=~/files/android-ndk-r10e/ -a arm64-v8a --bin=~/files/android-ndk-r10e/toolchains/aarch64-linux-android-4.9/prebuilt/darwin-x86_64/bin
```

The [--bin](#-bin) option is used to set `bin` directory of toolchains.
    
<p class="tip">
Please attempt to set `--arch=` option if it had failed to check compiler.
</p>

##### iPhoneOS

```bash
$ xmake f -p iphoneos [-a armv7|armv7s|arm64|i386|x86_64]
$ xmake
```

##### Windows

```bash
$ xmake f -p windows [-a x86|x64]
$ xmake
```

##### Mingw

```bash
$ xmake f -p mingw --sdk=/usr/local/i386-mingw32-4.3.0/ [-a i386|x86_64]
$ xmake
``` 

##### Apple WatchOS

```bash
$ xmake f -p watchos [-a i386|armv7k]
$ xmake
```

##### Cross Compilation

For linux platform:

```bash
$ xmake f -p linux --sdk=/usr/local/arm-linux-gcc/ [--bin=/sdk/bin] [--cross=arm-linux-]
$ xmake
``` 

Fro other cross platform:

```bash
$ xmake f -p cross --sdk=/usr/local/arm-xxx-gcc/ [--bin=/sdk/bin] [--cross=arm-linux-]
$ xmake
``` 

For custem cross platform (`is_plat("myplat")`):

```bash
$ xmake f -p myplat --sdk=/usr/local/arm-xxx-gcc/ [--bin=/sdk/bin] [--cross=arm-linux-]
$ xmake
``` 

| Configuration Option         | Description                                  |
| ---------------------------- | -------------------------------------------- |
| [--sdk](#-sdk)               | Set the sdk root directory of toolchains     |
| [--bin](#-bin)               | Set the `bin` directory of toolchains        |
| [--cross](#-cross)           | Set the prefix of compilation tools          |
| [--as](#-as)                 | Set `asm` assembler                          |
| [--cc](#-cc)                 | Set `c` compiler                             |
| [--cxx](#-cxx)               | Set `c++` compiler                           |
| [--mm](#-mm)                 | Set `objc` compiler                          |
| [--mxx](#-mxx)               | Set `objc++` compiler                        |
| [--sc](#-sc)                 | Set `swift` compiler                         |
| [--gc](#-gc)                 | Set `golang` compiler                        |
| [--dc](#-dc)                 | Set `dlang` compiler                         |
| [--rc](#-rc)                 | Set `rust` compiler                          |
| [--cu](#-cu)                 | Set `cuda` compiler                          |
| [--ld](#-ld)                 | Set `c/c++/objc/asm` linker                  |
| [--sh](#-sh)                 | Set `c/c++/objc/asm` shared library linker   |
| [--ar](#-ar)                 | Set `c/c++/objc/asm` static library archiver |
| [--sc-ld](#-sc-ld)           | Set `swift` linker                           |
| [--sc-sh](#-sc-sh)           | Set `swift` shared library linker            |
| [--gc-ld](#-gc-ld)           | Set `golang` linker                          |
| [--gc-ar](#-gc-ar)           | Set `golang` static library archiver         |
| [--dc-ld](#-dc-ld)           | Set `dlang` linker                           |
| [--dc-sh](#-dc-sh)           | Set `dlang` shared library linker            |
| [--dc-ar](#-dc-ar)           | Set `dlang` static library archiver          |
| [--rc-ld](#-rc-ld)           | Set `rust` linker                            |
| [--rc-sh](#-rc-sh)           | Set `rust` shared library linker             |
| [--rc-ar](#-rc-ar)           | Set `rust` static library archiver           |
| [--cu-cxx](#-cu-cxx)         | Set `cuda` host compiler                     |
| [--cu-ld](#-cu-ld)           | Set `cuda` linker                            |
| [--cu-sh](#-cu-sh)           | Set `cuda` shared library linker             |
| [--cu-ar](#-cu-ar)           | Set `cuda` static library archiver           |
| [--asflags](#-asflags)       | Set `asm` assembler option                   |
| [--cflags](#-cflags)         | Set `c` compiler option                      |
| [--cxflags](#-cxflags)       | Set `c/c++` compiler option                  |
| [--cxxflags](#-cxxflags)     | Set `c++` compiler option                    |
| [--mflags](#-mflags)         | Set `objc` compiler option                   |
| [--mxflags](#-mxflags)       | Set `objc/c++` compiler option               |
| [--mxxflags](#-mxxflags)     | Set `objc++` compiler option                 |
| [--scflags](#-scflags)       | Set `swift` compiler option                  |
| [--gcflags](#-gcflags)       | Set `golang` compiler option                 |
| [--dcflags](#-dcflags)       | Set `dlang` compiler option                  |
| [--rcflags](#-rcflags)       | Set `rust` compiler option                   |
| [--cuflags](#-cuflags)       | Set `cuda` compiler option                   |
| [--ldflags](#-ldflags)       | Set  linker option                           |
| [--shflags](#-shflags)       | Set  shared library linker option            |
| [--arflags](#-arflags)       | Set  static library archiver option          |

<p class="tip">
if you want to known more options, please run: `xmake f --help`。
</p>

###### --sdk

- Set the sdk root directory of toolchains

xmake provides a convenient and flexible cross-compiling support.
In most cases, we need not to configure complex toolchains prefix, for example: `arm-linux-`

As long as this toolchains meet the following directory structure:

```
/home/toolchains_sdkdir
   - bin
       - arm-linux-gcc
       - arm-linux-ld
       - ...
   - lib
       - libxxx.a
   - include
       - xxx.h
```

Then，we can only configure the sdk directory and build it.

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir
$ xmake
```

xmake will detect the prefix: arm-linux- and add the include and library search directory automatically.

```
-I/home/toolchains_sdkdir/include -L/home/toolchains_sdkdir/lib
```

###### --bin

- Set the `bin` directory of toolchains

We need set it manually if the toolchains /bin directory is in other places, for example:

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --bin=/usr/opt/bin
$ xmake
```

<p class="tips">
Before v2.2.1 version, this parameter name is `--toolchains`, exists more ambiguous, so we changed to `--bin=` to set the bin directory.
</p>

###### --cross

- Set the prefix of compilation tools

For example, under the same toolchains directory at the same time, there are two different compilers:

```
/opt/bin
 - armv7-linux-gcc
 - aarch64-linux-gcc
```

If we want to use the `armv7-linux-gcc` compiler, we can run the following command:

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --bin=/opt/bin --cross=armv7-linux-
```

###### --as

- Set `asm` assembler

```bash
$ xmake f -p linux --sdk=/user/toolsdk --as=armv7-linux-as
```

If the 'AS' environment variable exists, it will use the values specified in the current environment variables.

<p class="tips">
We can set a unknown compiler as like-gcc/clang compiler, .e.g `xmake f --as=gcc@/home/xxx/asmips.exe` 
</p>

###### --cc

- Set c compiler

```bash
$ xmake f -p linux --sdk=/user/toolsdk --cc=armv7-linux-clang
```

If the 'CC' environment variable exists, it will use the values specified in the current environment variables.

<p class="tips">
We can set a unknown compiler as like-gcc/clang compiler, .e.g `xmake f --cc=gcc@/home/xxx/ccmips.exe` 
</p>

###### --cxx

- Set `c++` compiler

```bash
$ xmake f -p linux --sdk=/user/toolsdk --cxx=armv7-linux-clang++
```

If the 'CXX' environment variable exists, it will use the values specified in the current environment variables.

<p class="tips">
We can set a unknown compiler as like-gcc/clang compiler, .e.g `xmake f --cxx=g++@/home/xxx/c++mips.exe` 
</p>

###### --ld

- Set `c/c++/objc/asm` linker

```bash
$ xmake f -p linux --sdk=/user/toolsdk --ld=armv7-linux-clang++
```

If the 'LD' environment variable exists, it will use the values specified in the current environment variables.

<p class="tips">
We can set a unknown compiler as like-gcc/clang linker, .e.g `xmake f --ld=g++@/home/xxx/c++mips.exe` 
</p>

###### --sh

- Set `c/c++/objc/asm` shared library linker

```bash
$ xmake f -p linux --sdk=/user/toolsdk --sh=armv7-linux-clang++
```

If the 'SH' environment variable exists, it will use the values specified in the current environment variables.

<p class="tips">
We can set a unknown compiler as like-gcc/clang linker, .e.g `xmake f --sh=g++@/home/xxx/c++mips.exe` 
</p>

###### --ar

- Set `c/c++/objc/asm` static library archiver

```bash
$ xmake f -p linux --sdk=/user/toolsdk --ar=armv7-linux-ar
```

If the 'AR' environment variable exists, it will use the values specified in the current environment variables.

<p class="tips">
We can set a unknown compiler as like-ar archiver, .e.g `xmake f --ar=ar@/home/xxx/armips.exe` 
</p>

#### Global Configuration

You can save to the global configuration for simplfying operation.

For example:

```bash
$ xmake g --ndk=~/files/android-ndk-r10e/
```

Now, we config and build project for android again.

```bash
$ xmake f -p android
$ xmake
```

<p class="tip">
    You can use short or long command option, for exmaple: `xmake g` or `xmake global`.<br>
</p>

#### Clean Configuration

We can clean all cached configuration and re-configure projecct.

```bash
$ xmake f -c
$ xmake
```

or 

```bash
$ xmake f -p iphoneos -c
$ xmake
```

## Syntax Description

xmake's project description file xmake.lua is based on the lua syntax, but in order to make the project build logic more convenient and concise, xmake encapsulates it, making writing xmake.lua not as cumbersome as some makefiles.

Basically write a simple project build description, just three lines, for example:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
```

#### Scope

The description syntax of xmake is divided by scope, which is mainly divided into:

- external scope
- Internal scope
- Interface scope

Which ones belong to the outside and which ones belong to the inside? if you look at the comments below, you know what it is:

```lua
-- external scope
target("test")

    -- external scope
    set_kind("binary")
    add_files("src/*.c")

    on_run(function ()
        -- Internal scope
        end)

    after_package(function ()
        -- Internal scope
        end)

-- external scope
task("hello")

    -- external scope
    on_run(function ()
        -- Internal scope
        end)
```

Simply put, all within the custom script `function () end` belongs to the internal scope, which is the script scope, and all other places belong to the external scope. .

##### external Scope

For most projects, you don't need complicated engineering descriptions, and you don't need custom scripting support. You just need a simple `set_xxx` or `add_xxx` to meet your needs.

Then according to the 28th law, 80% of the cases, we only need to write:

```lua
target("test")
    set_kind("static")
    add_files("src/test/*.c")

target("demo")
    add_deps("test")
    set_kind("binary")
    add_links("test")
    add_files("src/demo/*.c")
```

No complicated api calls, no complicated variable definitions, and if judgments and for loops. It's succinct and readable. At a glance, it doesn't matter if you don't understand lua grammar.

As a simple description of the syntax, it looks a bit like a function call, you will know how to configure it at a basic point of programming.

In order to be concise and secure, in this scope, many lua built-in apis are not open, especially related to writing files and modifying the operating environment, only providing some basic read-only interfaces, and logical operations.

The current external scope lating lua built-in apis are:

- table
- string
- pairs
- ipairs
- print
- os

Of course, although the built-in lua api does not provide much, xmake also provides a lot of extension APIs. It is not much to describe the api. For details, please refer to: [API Manual] (https://xmake.io/#/zh/manual)

There are also some auxiliary apis, for example:

- dirs: scan to get all the directories in the currently specified path
- files: scan to get all the files in the current specified path
- format: format string, short version of string.format

There are also variable definitions and logical operations that can be used. after all, it is based on lua. The basic syntax is still there. We can switch the compiled files by if:

```lua
target("test")
    set_kind("static")
    if is_plat("iphoneos") then
        add_files("src/test/ios/*.c")
    else
        add_files("src/test/*.c")
    end
```

It should be noted that the variable definition is divided into global variables and local variables. The local variables are only valid for the current xmake.lua, and do not affect the child xmake.lua.

```lua
-- local variables, only valid for current xmake.lua
local var1 = 0

-- global variables that affect all subsmake.lua included after includes()
var2 = 1

Includes("src")
```

##### Internal Scope

Also known as plug-ins, script scope, provide more complex and flexible script support, generally used to write some custom scripts, plug-in development, custom task tasks, custom modules, etc.

Usually included by `function () end`, and passed to the `on_xxx`, `before_xxx` and `after_xxx` interfaces, are all self-scoped.

E.g:

```lua
-- custom script
target("hello")
    after_build(function ()
        -- Internal scope
        end)

-- custom tasks, plugins
task("hello")
    on_run(function ()
        -- Internal scope
        end)
```

In this scope, not only can you use most lua apis, but you can also use many extension modules provided by xmake. All extension modules are imported through import.

For details, please refer to: [import module document](https://xmake.io/#/zh/manual?id=import)

Here we give a simple example, after the compilation is complete, ldid signature on the ios target program:

```lua
target("iosdemo")
    set_kind("binary")
    add_files("*.m")
    after_build(function (target)

        -- Execute signature, if it fails, automatically interrupt, giving a highlight error message
        Os.run("ldid -S$(projectdir)/entitlements.plist %s", target:targetfile())
    end)
```

It should be noted that in the internal scope, all calls are enabled with the exception catching mechanism. if the operation is wrong, xmake will be automatically interrupted and an error message will be given.

Therefore, the script is written without the cumbersome `if retval then` judgment, and the script logic is more clear.

##### Interface Scope

All descriptions of api settings in the external scope are also scoped. They are called in different places and have different scopes of influence, for example:

```lua
-- global root scope, affecting all targets, including subproject target settings in includes()
add_defines("DEBUG")

-- define or enter the demo target scope (support multiple entry to append settings)
target("demo")
    set_kind("shared")
    add_files("src/*.c")
    -- the current target scope only affects the current target
    add_defines("DEBUG2")

-- option settings, only local settings are supported, not affected by global api settings
option("test")
    -- local scope of the current option
    set_default(false)

-- other target settings, -DDEBUG will also be set
target("demo2")
    set_kind("binary")
    add_files("src/*.c")

-- re-enter the demo target scope
target("demo")
    -- append macro definitions, only valid for the current demo target
    add_defines("DEBUG3")
```

Normally, entering another target/option domain setting will automatically leave the previous target/option field, but sometimes in order to compare some scope pollution, we can show off a domain, for example:

```lua
option("test")
    set_default(false)
option_end()

target("demo")
    set_kind("binary")
    add_files("src/*.c")
target_end()
```

Call `option_end()`, `target_end()` to explicitly leave the current target/option field setting.

##### Scope indentation

Indentation in xmake.lua is just a specification for more clear distinction. The current setting is for that scope, although it is ok even if it is not indented, but it is not very readable. .

e.g:

```lua
target("xxxx")
    set_kind("binary")
    add_files("*.c")
```

with

```lua
target("xxxx")
set_kind("binary")
add_files("*.c")
```

The above two methods are the same in effect, but in understanding, the first one is more intuitive. At first glance, you know that `add_files` is only set for target, not global.

Therefore, proper indentation helps to better maintain xmake.lua

Finally attached, tbox's [xmake.lua](https://github.com/tboox/tbox/blob/master/src/tbox/xmake.lua) description, for reference only. .

#### Syntax simplification

The configuration field syntax of xmake.lua is very flexible and can be used in a variety of complex and flexible configurations in the relevant domain, but for many streamlined small block configurations, this time is slightly redundant:

```lua
option("test1")
    set_default(true)
    set_showmenu(true)
    set_description("test1 option")

option("test2")
    set_default(true)
    set_showmeu(true)

option("test3")
    set_default("hello")
```

xmake 2.2.6 or later, for the above small block option domain settings, we can simplify the description into a single line:

```lua
option("test1", {default = true, showmenu = true, description = "test1 option"})
option("test2", {default = true, showmenu = true})
option("test3", {default = "hello"})
```

In addition to the option field, this simplified writing is also supported for other domains, such as:

```lua
target("demo")
    set_kind("binary")
    add_files("src/*.c")
```

Simplified to:

```lua
target("demo", {kind = "binary", files = "src/*.c"})
```

Of course, if the configuration requirements are more complicated, or the original multi-line setting method is more convenient, this depends on your own needs to evaluate which method is used.

## Dependency Package Management

#### Local Package Mode

By including a dependency package directory and a binary package file in the project, it is convenient to integrate some third-party dependency libraries. This method is relatively simple and straightforward, but the disadvantages are also obvious and inconvenient to manage.

Take the tbox project as an example. The dependency package is as follows:

```
- base.pkg
- zlib.pkg
- polarssl.pkg
- openssl.pkg
- mysql.pkg
- pcre.pkg
- ...
```

If you want the current project to recognize loading these packages, you first need to specify the package directory path, for example:

```lua
add_packagedirs("packages")
```

Once specified, you can add integration package dependencies in the target scope via the [add_packages](https://xmake.io/#/zh/manual?id=targetadd_packages) interface, for example:

```lua
target("tbox")
    add_packages("zlib", "polarssl", "pcre", "mysql")
```

So how to generate a *.pkg package, if it is based on xmake project, the generation method is very simple, only need:

```console
$ cd tbox
$ xmake package
```

You can generate a tbox.pkg cross-platform package in the build directory for use by third-party projects. I can also directly set the output directory and compile and generate it into the other project, for example:

```console
$ cd tbox
$ xmake package -o ../test/packages
```

In this way, the test project can pass [add_packages](https://xmake.io/#/zh/manual?id=targetadd_packages) and [add_packagedirs](https://xmake.io/#/zh/manual?id= add_packagedirs) to configure and use the tbox.pkg package.

For a detailed description of the built-in package, you can also refer to the following related article, which is described in detail: [Dependency package addition and automatic detection mechanism](https://tboox.org/cn/2016/08/06/add-package-and-autocheck/)

#### System Search Mode

If you feel that the above built-in package management method is very inconvenient, you can use the extension interface [lib.detect.find_package] provided by xmake (https://xmake.io/#/zh/manual?id=detect-find_package) to find the system. Existing dependencies.

Currently this interface supports the following package management support:

* vcpkg
* homebrew
* pkg-config

And through the system and third-party package management tools for the installation of the dependency package, and then integrated with xmake, for example, we look for an openssl package:

```lua
local packages = find_packages("openssl", "zlib")
```

The returned results are as follows:

```lua
{
    {links = {"ssl", "crypto"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}},
    {links = {"z"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}}
}
```

If the search is successful, return a table containing all the package information, if it fails, return nil

The return result here can be directly passed as the parameter of `target:add`, `option:add`, which is used to dynamically increase the configuration of `target/option`:

```lua
option("zlib")
    set_showmenu(true)
    before_check(function (option)
        option:add(find_packages("openssl", "zlib"))
    end)
```

```lua
target("test")
    on_load(function (target)
        target:add(find_packages("openssl", "zlib"))
    end)
```

If third-party tools such as `homebrew`, `pkg-config` are installed on the system, then this interface will try to use them to improve the search results.

For a more complete description of the usage, please refer to the [find_packages](https://xmake.io/#/en/manual?id=find_packages) interface documentation.

##### Homebrew Integration Support

Since homebrew is generally installed directly into the system, users do not need to do any integration work, `lib.detect.find_package` has been natively seamlessly supported.

##### Vcpkg Integration Support

Currently xmake v2.2.2 version already supports vcpkg, users only need to install vcpkg, execute `$ vcpkg integrate install`, xmake will automatically detect the root path of vcpkg from the system, and then automatically adapt the bread.

Of course, we can also manually specify the root path of vcpkg to support:

```console
$ xmake f --vcpkg=f:\vcpkg
```

Or we can set it to the global configuration to avoid repeating the settings each time we switch configurations:

```console
$ xmake g --vcpkg=f:\vcpkg
```

#### Remote dependency mode

This has been initially supported after the 2.2.2 version, the usage is much simpler, just set the corresponding dependency package, for example:

```lua
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libpng", "zlib")
```

The above `add_requires` is used to describe the dependencies required by the current project, and `add_packages` is used to apply dependencies to the test target. Only settings will automatically add links, linkdirs, includedirs, etc.

Then directly compile:

```console
$ xmake
```

xmake will remotely pull the relevant source package, then automatically compile and install, finally compile the project, and link the dependency package. The specific effect is shown in the following figure:

<img src="/assets/img/index/package_manage.png" width="80%" />

For more information and progress on package dependency management see the related issues: [Remote package management](https://github.com/xmake-io/xmake/issues/69)

##### Currently Supported Features

* Semantic version support, for example: ">= 1.1.0 < 1.2", "~1.6", "1.2.x", "1.*"
* Provide multi-warehouse management support such as official package warehouse, self-built private warehouse, project built-in warehouse, etc.
* Cross-platform package compilation integration support (packages of different platforms and different architectures can be installed at the same time, fast switching use)
* Debug dependency package support, source code debugging

##### Dependency Package Processing Mechanism

Here we briefly introduce the processing mechanism of the entire dependency package:

<div align="center">
<img src="/assets/img/index/package_arch.png" width="80%" />
</div>

1. Priority check for the current system directory, whether there is a specified package under the third-party package management, if there is a matching package, then you do not need to download and install (of course you can also set the system package)
2. Retrieve the package matching the corresponding version, then download, compile, and install (Note: installed in a specific xmake directory, will not interfere with the system library environment)
3. Compile the project, and finally automatically link the enabled dependencies

##### Semantic Version Settings

Xmake's dependency package management fully supports semantic version selection, for example: "~1.6.1". For a detailed description of the semantic version, see: [https://semver.org/](https://semver.org/)

Some semantic versions are written:

```lua
add_requires("tbox 1.6.*", "pcre 1.3.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

The semantic version parser currently used by xmake is the [sv](https://github.com/uael/sv) library contributed by [uael](https://github.com/uael), which also has a description of the version. For detailed instructions, please refer to the following: [Version Description](https://github.com/uael/sv#versions)

Of course, if we have no special requirements for the current version of the dependency package, then we can write directly:

```lua
add_requires("tbox", "libpng", "zlib")
```

This will use the latest version of the package known, or the source code compiled by the master branch. If the current package has a git repo address, we can also specify a specific branch version:

```lua
add_requires("tbox master")
add_requires("tbox dev")
```

##### Extra Package Information Settings

###### Optional Package Settings

If the specified dependency package is not supported by the current platform, or if the compilation and installation fails, then xmake will compile the error, which is reasonable for some projects that must rely on certain packages to work.
However, if some packages are optional dependencies, they can be set to optional packages even if they are not compiled properly.

```lua
add_requires("tbox", {optional = true})
```

###### Disable System Library

With the default settings, xmake will first check to see if the system library exists (if no version is required). If the user does not want to use the system library and the library provided by the third-party package management, then you can set:

```lua
add_requires("tbox", {system = false})
```

###### Using the debug version of the package

If we want to debug the dependencies at the same time, we can set them to use the debug version of the package (provided that this package supports debug compilation):

```lua
add_requires("tbox", {debug = true})
```

If the current package does not support debug compilation, you can submit the modified compilation rules in the repository to support the debug, for example:

```lua
package("openssl")
    on_install("linux", "macosx", function (package)
        os.vrun("./config %s --prefix=\"%s\"", package:debug() and "--debug" or "", package:installdir())
        os.vrun("make -j4")
        os.vrun("make install")
    end)
```

###### Passing additional compilation information to the package

Some packages have various compile options at compile time, and we can pass them in. Of course, the package itself supports:

```lua
add_requires("tbox", {configs = {small=true}})
```

Pass `--small=true` to the tbox package so that compiling the installed tbox package is enabled.

##### Install third-party packages

After version 2.2.5, xmake supports support for dependency libraries in third-party package managers, such as: conan, brew, vcpkg, etc.

Add a homebrew dependency package:

```lua
add_requires("brew::zlib", {alias = "zlib"}})
add_requires("brew::pcre2/libpcre2-8", {alias = "pcre2"}})

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("pcre2", "zlib")
```

Add a dependency package for vcpkg:

```lua
add_requires("vcpkg::zlib", "vcpkg::pcre2")

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("vcpkg::zlib", "vcpkg::pcre2")
```

Add a conan dependency package:

```lua
add_requires("CONAN::zlib/1.2.11@conan/stable", {alias = "zlib", debug = true})
add_requires("CONAN::OpenSSL/1.0.2n@conan/stable", {alias = "openssl", 
    configs = {options = "OpenSSL:shared=True"}})

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("openssl", "zlib")
```

After executing xmake to compile:

```console
ruki:test_package ruki$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.14
note: try installing these packages (pass -y to skip confirm)?
  -> CONAN::zlib/1.2.11@conan/stable  (debug)
  -> CONAN::OpenSSL/1.0.2n@conan/stable  
please input: y (y/n)

  => installing CONAN::zlib/1.2.11@conan/stable .. ok
  => installing CONAN::OpenSSL/1.0.2n@conan/stable .. ok

[  0%]: ccache compiling.release src/main.c
[100%]: linking.release test
```

##### Using self-built private package warehouse

If the required package is not in the official repository [xmake-repo](https://github.com/xmake-io/xmake-repo), we can submit the contribution code to the repository for support.
But if some packages are only for personal or private projects, we can create a private repository repo. The repository organization structure can be found at: [xmake-repo](https://github.com/xmake-io/xmake-repo)

For example, now we have a private repository repo:`git@github.com:myrepo/xmake-repo.git`

We can add the repository with the following command:

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

Starting with v2.2.3, support for adding repos for specified branches, for example:

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git dev
```

Or we write directly in xmake.lua:

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git")
```

If we just want to add one or two private packages, this time to build a git repo is too big, we can directly put the package repository into the project, for example:

```
projectdir
  - myrepo
    - packages
      - t/tbox/xmake.lua
      - z/zlib/xmake.lua
  - src
    - main.c
  - xmake.lua
```

The above myrepo directory is your own private package repository, built into your own project, and then add this repository location in xmake.lua:

```lua
add_repositories("my-repo myrepo")
```

This can be referred to [benchbox](https://github.com/tboox/benchbox) project, which has a built-in private repository.

We can even build a package without directly building a package description into the project xmake.lua, which is useful for relying on one or two packages, for example:

```lua
package("libjpeg")

    set_urls("http://www.ijg.org/files/jpegsrc.$(version).tar.gz")

    add_versions("v9c", "650250979303a649e21f87b5ccd02672af1ea6954b911342ea491f351ceb7122")

    on_install("windows", function (package)
        os.mv("jconfig.vc", "jconfig.h")
        os.vrun("nmake -f makefile.vc")
        os.cp("*.h", package:installdir("include"))
        os.cp("libjpeg.lib", package:installdir("lib"))
    end)

    on_install("macosx", "linux", function (package)
        import("package.tools.autoconf").install(package)
    end)

package_end()

add_requires("libjpeg")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libjpeg")
```

##### Package Management Command Use

The package management command `$ xmake require` can be used to manually display the download, install, uninstall, retrieve, and view package information.

###### Install the specified package

```console
$ xmake require tbox
```

Install the specified version package:

```console
$ xmake require tbox "~1.6"
```

Force a re-download of the installation and display detailed installation information:

```console
$ xmake require -f -v tbox "1.5.x"
```

Pass additional setup information:

```console
$ xmake require --extra="debug=true,config={small=true}" tbox
```

Install the debug package and pass the compilation configuration information of `small=true` to the package.

###### Uninstalling the specified package

```console
$ xmake require --uninstall tbox
```

This will completely uninstall the removal package file.

###### View package details

```console
$ xmake require --info tbox
```

###### Search for packages in the current warehouse

```console
$ xmake require --search tbox
```

This is to support fuzzy search and lua pattern matching search:

```console
$ xmake require --search pcr
```

Will also search for pcre, pcre2 and other packages.

###### List the currently installed packages

```console
$ xmake require --list
```

##### Warehouse Management Command Use

As mentioned above, adding a private repository is available (supporting local path addition):

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

We can also remove a repository that has already been installed:

```console
$ xmake repo --remove myrepo
```

Or view all the added warehouses:

```console
$ xmake repo --list
```

If the remote repository has updates, you can manually perform a warehouse update to get more and the latest packages:

```console
$ xmake repo -u
```

##### Submit the package to the official warehouse

If you need a package that is not supported by the current official repository, you can commit it to the official repository after local tuning: [xmake-repo](https://github.com/xmake-io/xmake-repo)

For detailed contribution descriptions, see: [CONTRIBUTING.md](https://github.com/xmake-io/xmake-repo/blob/master/CONTRIBUTING.md)

## FAQ

#### How to get verbose command-line arguments info?

Get the help info of the main command.

```bash
$ xmake [-h|--help]
``` 

Get the help info of the configuration command.

```bash
$ xmake f [-h|--help]
``` 

Get the help info of the givent action or plugin command.

```bash
$ xmake [action|plugin] [-h|--help]
``` 

For example:

```bash
$ xmake run --help
``` 

#### How to suppress all output info?

```bash
$ xmake [-q|--quiet]
```

#### How to do if xmake fails?

Please attempt to clean configuration and rebuild it first.

```bash
$ xmake f -c
$ xmake
```

If it fails again, please add `-v` or `--verbose` options to get more verbose info.

For exmaple: 

```hash
$ xmake [-v|--verbose] 
```

And add `--backtrace` to get the verbose backtrace info, then you can submit these infos to [issues](https://github.com/xmake-io/xmake/issues).

```bash
$ xmake -v --backtrace
```

#### How to see verbose compiling warnings?

```bash
$ xmake [-w|--warning] 
```

#### How to scan source code and generate xmake.lua automaticlly

You only need run the following command:

```bash
$ xmake
```

xmake will scan all source code in current directory and build it automaticlly. 

And we can run it directly.

```bash
$ xmake run
```

If we only want to generate xmake.lua file, we can run:

```bash
$ xmake f -y
```

If you want to known more information please see [Scan source codes and build project without makefile](https://tboox.org/2017/01/07/build-without-makefile/)

## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/xmake#backer)]

<a href="https://opencollective.com/xmake#backers" target="_blank"><img src="https://opencollective.com/xmake/backers.svg?width=890"></a>

## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/xmake#sponsor)]

<a href="https://opencollective.com/xmake/sponsor/0/website" target="_blank"><img src="https://opencollective.com/xmake/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/xmake/sponsor/1/website" target="_blank"><img src="https://opencollective.com/xmake/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/xmake/sponsor/2/website" target="_blank"><img src="https://opencollective.com/xmake/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/xmake/sponsor/3/website" target="_blank"><img src="https://opencollective.com/xmake/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/xmake/sponsor/4/website" target="_blank"><img src="https://opencollective.com/xmake/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/xmake/sponsor/5/website" target="_blank"><img src="https://opencollective.com/xmake/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/xmake/sponsor/6/website" target="_blank"><img src="https://opencollective.com/xmake/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/xmake/sponsor/7/website" target="_blank"><img src="https://opencollective.com/xmake/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/xmake/sponsor/8/website" target="_blank"><img src="https://opencollective.com/xmake/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/xmake/sponsor/9/website" target="_blank"><img src="https://opencollective.com/xmake/sponsor/9/avatar.svg"></a>


