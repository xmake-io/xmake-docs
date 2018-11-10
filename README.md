---
search: en
---

<p>
<div align="center">
  <a href="http://xmake.io">
    <img width="200" heigth="200" src="http://tboox.org/static/img/xmake/logo256c.png">
  </a>  

  <h1>xmake</h1>

  <div>
    <a href="https://travis-ci.org/tboox/xmake">
      <img src="https://img.shields.io/travis/tboox/xmake/master.svg?style=flat-square" alt="travis-ci" />
    </a>
    <a href="https://ci.appveyor.com/project/waruqi/xmake/branch/master">
      <img src="https://img.shields.io/appveyor/ci/waruqi/xmake/master.svg?style=flat-square" alt="appveyor-ci" />
    </a>
    <a href="https://codecov.io/gh/tboox/xmake">
      <img src="https://img.shields.io/codecov/c/github/tboox/xmake/master.svg?style=flat-square" alt="Coverage" />
    </a>
    <a href="https://aur.archlinux.org/packages/xmake">
      <img src="https://img.shields.io/aur/votes/xmake.svg?style=flat-square" alt="AUR votes" />
    </a>
    <a href="https://github.com/tboox/xmake/releases">
      <img src="https://img.shields.io/github/release/tboox/xmake.svg?style=flat-square" alt="Github All Releases" />
    </a>
  </div>
  <div>
    <a href="https://github.com/tboox/xmake/blob/master/LICENSE.md">
      <img src="https://img.shields.io/github/license/tboox/xmake.svg?colorB=f48041&style=flat-square" alt="license" />
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
    <a href="http://xmake.io/pages/donation.html#donate">
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

##### via scoop

```bash
scoop install xmake
```

#### Windows

1. Download xmake windows installer from [Releases](https://github.com/tboox/xmake/releases)
2. Run xmake-[version].exe

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

1. Download xmake `.deb` install package from [Releases](https://github.com/tboox/xmake/releases) 
2. Run `dpkg -i xmake-xxxx.deb`

#### Compilation

Compile and install:

```bash
$ git clone https://github.com/tboox/xmake.git
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

If you want to known more information, you can see [#160](https://github.com/tboox/xmake/issues/160).

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

If you want to known more information, you can see [#158](https://github.com/tboox/xmake/issues/158).

#### WDK Driver Program

xmake will detect WDK automatically and we can also set the WDK directory manually.

```console
$ xmake f --wdk="G:\Program Files\Windows Kits\10" -c
$ xmake
```

If you want to known more information, you can see [#159](https://github.com/tboox/xmake/issues/159).

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

If you want to known more information, you can see [#173](https://github.com/tboox/xmake/issues/173).

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

For a detailed description of the built-in package, you can also refer to the following related article, which is described in detail: [Dependency package addition and automatic detection mechanism] (http://tboox.org/cn/2016/08/06/add-package -and-autocheck/)

#### System Search Mode

If you feel that the above built-in package management method is very inconvenient, you can use the extension interface [lib.detect.find_package] provided by xmake (https://xmake.io/#/zh/manual?id=detect-find_package) to find the system. Existing dependencies.

Currently this interface supports the following package management support:

* vcpkg
* homebrew
* pkg-config

And through the system and third-party package management tools for the installation of the dependency package, and then integrated with xmake, for example, we look for an openssl package:

```lua
import("lib.detect.find_package")

local package = find_package("openssl")
```

The returned results are as follows:

```lua
{links = {"ssl", "crypto", "z"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}}
```

If the search is successful, return a table containing all the package information, if it fails, return nil

The return result here can be directly passed as the parameter of `target:add`, `option:add`, which is used to dynamically increase the configuration of `target/option`:

```lua
option("zlib")
    set_showmenu(true)
    before_check(function (option)
        import("lib.detect.find_package")
        option:add(find_package("zlib"))
    end)
```

```lua
target("test")
    on_load(function (target)
        import("lib.detect.find_package")
        target:add(find_package("zlib"))
    end)
```

If third-party tools such as `homebrew`, `pkg-config` are installed on the system, then this interface will try to use them to improve the search results.

For a more complete description of the usage, please refer to the [lib.detect.find_package](https://xmake.io/#/en/manual?id=detect-find_package) interface documentation.

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

For more information and progress on package dependency management see the related issues: [Remote package management] (https://github.com/tboox/xmake/issues/69)

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

Xmake's dependency package management fully supports semantic version selection, for example: "~1.6.1". For a detailed description of the semantic version, see: [http://semver.org/] (http://semver.org/)

Some semantic versions are written:

```lua
add_requires("tbox 1.6.*", "pcre 1.3.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

The semantic version parser currently used by xmake is the [sv](https://github.com/uael/sv) library contributed by [uael](https://github.com/uael), which also has a description of the version. For detailed instructions, please refer to the following: [Version Description] (https://github.com/uael/sv#versions)

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
add_requires("tbox", {config = {small=true}})
```

Pass `--small=true` to the tbox package so that compiling the installed tbox package is enabled.
##### Using self-built private package warehouse

If the required package is not in the official repository [xmake-repo](https://github.com/tboox/xmake-repo), we can submit the contribution code to the repository for support.
But if some packages are only for personal or private projects, we can create a private repository repo. The repository organization structure can be found at: [xmake-repo](https://github.com/tboox/xmake-repo)

For example, now we have a private repository repo:`git@github.com:myrepo/xmake-repo.git`

We can add the repository with the following command:

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
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

This can be referred to [benchbox] (https://github.com/tboox/benchbox) project, which has a built-in private repository.

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

###### Remove the specified package

Only unlink specifies the package, it is not detected by the current project, but the package still exists locally. If it is reinstalled, it will be completed very quickly.

```console
$ xmake require --unlink tbox
```

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

If you need a package that is not supported by the current official repository, you can commit it to the official repository after local tuning: [xmake-repo](https://github.com/tboox/xmake-repo)

For detailed contribution descriptions, see: [CONTRIBUTING.md](https://github.com/tboox/xmake-repo/blob/master/CONTRIBUTING.md)

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

And add `--backtrace` to get the verbose backtrace info, then you can submit these infos to [issues](https://github.com/tboox/xmake/issues).

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

If you want to known more information please see [Scan source codes and build project without makefile](http://tboox.org/2017/01/07/build-without-makefile/)

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


