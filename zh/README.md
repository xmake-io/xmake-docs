---
nav: zh
search: zh
---

<p>
<div align="center">
  <a href="http://xmake.io/cn">
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

  <p>一个基于Lua的轻量级跨平台自动构建工具</p>
</div>
</p>

## 简介

XMake是一个基于Lua的轻量级跨平台自动构建工具，支持在各种主流平台上构建项目

xmake的目标是开发者更加关注于项目本身开发，简化项目的描述和构建，并且提供平台无关性，使得一次编写，随处构建

它跟cmake、automake、premake有点类似，但是机制不同，它默认不会去生成IDE相关的工程文件，采用直接编译，并且更加的方便易用
采用lua的工程描述语法更简洁直观，支持在大部分常用平台上进行构建，以及交叉编译

并且xmake提供了创建、配置、编译、打包、安装、卸载、运行等一些actions，使得开发和构建更加的方便和流程化。

不仅如此，它还提供了许多更加高级的特性，例如插件扩展、脚本宏记录、批量打包、自动文档生成等等。。

## 安装

#### Master版本

##### 使用curl

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh)
```

##### 使用wget

```bash
bash <(wget https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh -O -)
```

##### 使用powershell

```bash
Invoke-Expression (Invoke-Webrequest 'https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.ps1' -UseBasicParsing).Content
```

#### Windows

1. 从 [Releases](https://github.com/tboox/xmake/releases) 上下载windows安装包
2. 运行安装程序 xmake-[version].exe

#### MacOS

```bash
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew install xmake
```

或者：

1. 从 [Releases](https://github.com/tboox/xmake/releases) 上下载pkg安装包
2. 双击运行

或者安装master版本:

```bash
# 使用homebrew安装master版本
$ brew install xmake --HEAD

# 或者直接调用shell下载安装
$ bash <(curl -fsSL https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh)
```

#### Linux

在archlinux上安装：

```bash
$ yaourt xmake
```

在ubuntu上安装：

```bash
$ sudo add-apt-repository ppa:tboox/xmake
$ sudo apt-get update
$ sudo apt-get install xmake
```

或者手动添加包源：

```
deb http://ppa.launchpad.net/tboox/xmake/ubuntu yakkety main 
deb-src http://ppa.launchpad.net/tboox/xmake/ubuntu yakkety main 
```

然后执行：

```bash
$ sudo apt-get update
$ sudo apt-get install xmake
```

或者下载deb包来安装：

1. 从 [Releases](https://github.com/tboox/xmake/releases) 上下载deb安装包
2. 运行: `dpkg -i xmake-xxxx.deb`

在`redhat/centos`上安装：

1. 从 [Releases](https://github.com/tboox/xmake/releases) 上下载rpm安装包
2. 运行: `yum install xmake-xxx.rpm --nogpgcheck`

#### 编译安装

通过脚本编译安装:

```bash
$ git clone https://github.com/tboox/xmake.git
$ cd ./xmake
$ ./scripts/get.sh __local__
```

仅仅安装和更新xmake的lua脚本:

```bash
$ ./scripts/get.sh __local__ __install_only__
```

卸载:

```bash
$ ./scripts/get.sh __uninstall__
```

通过make进行编译安装:

```bash
$ make build; sudo make install
```

安装到其他指定目录:

```bash
$ sudo make install prefix=/usr/local
```

卸载:

```bash
$ sudo make uninstall
```

## 快速开始

[![asciicast](https://asciinema.org/a/133693.png)](https://asciinema.org/a/133693)

#### 创建工程

创建一个名叫`hello`的`c`控制台工程：

```bash
$ xmake create -l c -P ./hello
```

执行完后，将会生成一个简单工程结构：

```
hello
├── src
│   └── main.c
└── xmake.lua
```

其中`xmake.lua`是工程描述文件，内容非常简单，告诉xmake添加`src`目录下的所有`.c`源文件：

```lua
target("hello")
    set_kind("binary")
    add_files("src/*.c") 
```

目前支持的语言如下：

* c/c++
* objc/c++
* asm
* swift
* dlang
* golang
* rust

<p class="tip">
    如果你想了解更多参数选项，请运行: `xmake create --help`
</p>

#### 构建工程

```bash
$ xmake
```

#### 运行程序

```bash
$ xmake run hello
```

#### 调试程序

```bash
$ xmake run -d hello 
```

xmake将会使用系统自带的调试器去加载程序运行，目前支持：lldb, gdb, windbg, vsjitdebugger, ollydbg 等各种调试器。

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
    你也可以使用简写的命令行选项，例如: `xmake r` 或者 `xmake run`
</p>

## 工程实例

#### 可执行程序

```lua
target("test")
    set_kind("binary")
    add_files("src/*c")
```

#### 静态库程序

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

#### 动态库程序

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

#### Qt程序

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

更多详情可以参考：[#160](https://github.com/tboox/xmake/issues/160)

##### 静态库程序

```lua
target("qt_static_library")
    add_rules("qt.static")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

##### 动态库程序

```lua
target("qt_shared_library")
    add_rules("qt.shared")
    add_files("src/*.cpp")
    add_frameworks("QtNetwork", "QtGui")
```

##### 控制台程序

```lua
target("qt_console")
    add_rules("qt.console")
    add_files("src/*.cpp")
```

##### Quick应用程序

```lua
target("qt_quickapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/qml.qrc")
    add_frameworks("QtQuick")
```

##### Widgets应用程序

```lua
target("qt_widgetapp")
    add_rules("qt.application")
    add_files("src/*.cpp") 
    add_files("src/mainwindow.ui")
    add_files("src/mainwindow.h")  -- 添加带有 Q_OBJECT 的meta头文件
    add_frameworks("QtWidgets")
```

#### Cuda程序

创建一个空工程：

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

默认会自动探测cuda环境，当然也可以指定Cuda SDK环境目录：

```console
$ xmake f --cuda=/usr/local/cuda-9.1/ 
$ xmake
```

更多详情可以参考：[#158](https://github.com/tboox/xmake/issues/158)

#### WDK驱动程序

默认会自动探测wdk所在环境，当然也可以指定wdk sdk环境目录：

```console
$ xmake f --wdk="G:\Program Files\Windows Kits\10" -c 
$ xmake
```

更多详情可以参考：[#159](https://github.com/tboox/xmake/issues/159)

##### umdf驱动程序

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

##### kmdf驱动程序

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

##### wdm驱动程序

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

##### 生成驱动包

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

##### 驱动签名

默认编译禁用签名，可以通过`set_values("wdk.sign.mode", ...)`设置签名模式来启用签名。

###### 测试签名

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

###### 正式签名

通过指定对应的正式签名证书文件进行签名：

```lua
target("msdsm")
    add_rules("wdk.driver", "wdk.env.wdm")
    set_values("wdk.sign.mode", "release")
    set_values("wdk.sign.company", "xxxx")
    set_values("wdk.sign.certfile", path.join(os.projectdir(), "xxxx.cer"))
```

##### 生成低版本驱动

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

#### WinSDK程序

```lua
target("usbview")
    add_rules("win.sdk.application")

    add_files("*.c", "*.rc")
    add_files("xmlhelper.cpp", {rule = "win.sdk.dotnet"})
```

更多详情可以参考：[#173](https://github.com/tboox/xmake/issues/173)

## 配置

通过`xmake f|config`配置命令，设置构建前的相关配置信息，详细参数选项，请运行: `xmake f --help`。

<p class="tip">
    你可以使用命令行缩写来简化输入，也可以使用全名，例如: <br>
    `xmake f` 或者 `xmake config`.<br>
    `xmake f -p linux` 或者 `xmake config --plat=linux`.
</p>

#### 目标平台

##### 主机平台

```bash
$ xmake
```

<p class="tip">
    xmake将会自动探测当前主机平台，默认自动生成对应的目标程序。
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

如果要手动指定ndk中具体某个工具链，而不是使用默认检测的配置，可以通过[--toolchains](#-toolchains)来设置，例如：

```bash
$ xmake f -p android --ndk=~/files/android-ndk-r10e/ -a arm64-v8a --toolchains=~/files/android-ndk-r10e/toolchains/aarch64-linux-android-4.9/prebuilt/darwin-x86_64/bin
```

[--toolchains](#-toolchains)主要用于设置选择编译工具的具体bin目录，这个的使用跟[交叉编译](#交叉编译)中的[--toolchains](#-toolchains)的行为是一致的。

<p class="tip">
如果手动设置了`toolchains`的bin目录，没有通过检测，可以看下是否`--arch=`参数没有匹配对。
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

##### 交叉编译

linux平台的交叉编译：

```bash
$ xmake f -p linux --sdk=/usr/local/arm-linux-gcc/ [--bin=/sdk/bin] [--cross=arm-linux-]
$ xmake
``` 

其他平台的交叉编译：

```bash
$ xmake f -p cross --sdk=/usr/local/arm-xxx-gcc/ [--bin=/sdk/bin] [--cross=arm-linux-]
$ xmake
``` 

如果不关心实际的平台名，只想交叉编译，可以直接用上面的命令，如果需要通过`is_plat("myplat")`判断自己的平台逻辑，则：

```bash
$ xmake f -p myplat --sdk=/usr/local/arm-xxx-gcc/ [--bin=/sdk/bin] [--cross=arm-linux-]
$ xmake
``` 

其中：

| 参数名                       | 描述                             |
| ---------------------------- | -------------------------------- |
| [--sdk](#-sdk)               | 设置交叉工具链的sdk根目录        |
| [--bin](#-bin)               | 设置工具链bin目录                |
| [--cross](#-cross)           | 设置交叉工具链工具前缀           |
| [--as](#-as)                 | 设置`asm`汇编器                  |
| [--cc](#-cc)                 | 设置`c`编译器                    |
| [--cxx](#-cxx)               | 设置`c++`编译器                  |
| [--mm](#-mm)                 | 设置`objc`编译器                 |
| [--mxx](#-mxx)               | 设置`objc++`编译器               |
| [--sc](#-sc)                 | 设置`swift`编译器                |
| [--gc](#-gc)                 | 设置`golang`编译器               |
| [--dc](#-dc)                 | 设置`dlang`编译器                |
| [--rc](#-rc)                 | 设置`rust`编译器                 |
| [--cu](#-cu)                 | 设置`cuda`编译器                 |
| [--ld](#-ld)                 | 设置`c/c++/objc/asm`链接器       |
| [--sh](#-sh)                 | 设置`c/c++/objc/asm`共享库链接器 |
| [--ar](#-ar)                 | 设置`c/c++/objc/asm`静态库归档器 |
| [--sc-ld](#-sc-ld)           | 设置`swift`链接器                |
| [--sc-sh](#-sc-sh)           | 设置`swift`共享库链接器          |
| [--gc-ld](#-gc-ld)           | 设置`golang`链接器               |
| [--gc-ar](#-gc-ar)           | 设置`golang`静态库归档器         |
| [--dc-ld](#-dc-ld)           | 设置`dlang`链接器                |
| [--dc-sh](#-dc-sh)           | 设置`dlang`共享库链接器          |
| [--dc-ar](#-dc-ar)           | 设置`dlang`静态库归档器          |
| [--rc-ld](#-rc-ld)           | 设置`rust`链接器                 |
| [--rc-sh](#-rc-sh)           | 设置`rust`共享库链接器           |
| [--rc-ar](#-rc-ar)           | 设置`rust`静态库归档器           |
| [--cu-ld](#-cu-ld)           | 设置`cuda`链接器                 |
| [--cu-sh](#-cu-sh)           | 设置`cuda`共享库链接器           |
| [--cu-ar](#-cu-ar)           | 设置`cuda`静态库归档器           |
| [--asflags](#-asflags)       | 设置`asm`汇编编译选项            |
| [--cflags](#-cflags)         | 设置`c`编译选项                  |
| [--cxflags](#-cxflags)       | 设置`c/c++`编译选项              |
| [--cxxflags](#-cxxflags)     | 设置`c++`编译选项                |
| [--mflags](#-mflags)         | 设置`objc`编译选项               |
| [--mxflags](#-mxflags)       | 设置`objc/c++`编译选项           |
| [--mxxflags](#-mxxflags)     | 设置`objc++`编译选项             |
| [--scflags](#-scflags)       | 设置`swift`编译选项              |
| [--gcflags](#-gcflags)       | 设置`golang`编译选项             |
| [--dcflags](#-dcflags)       | 设置`dlang`编译选项              |
| [--rcflags](#-rcflags)       | 设置`rust`编译选项               |
| [--cuflags](#-cuflags)       | 设置`cuda`编译选项               |
| [--ldflags](#-ldflags)       | 设置链接选项                     |
| [--shflags](#-shflags)       | 设置共享库链接选项               |
| [--arflags](#-arflags)       | 设置静态库归档选项               |

<p class="tip">
如果你想要了解更多参数选项，请运行: `xmake f --help`。
</p>

###### --sdk

- 设置交叉工具链的sdk根目录

大部分情况下，都不需要配置很复杂的toolchains前缀，例如：`arm-linux-` 什么的

只要这个工具链的sdk目录满足如下结构（大部分的交叉工具链都是这个结构）：

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

那么，使用xmake进行交叉编译的时候，只需要进行如下配置和编译：

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir
$ xmake
```

这个时候，xmake会去自动探测，gcc等编译器的前缀名：`arm-linux-`，并且编译的时候，也会自动加上`链接库`和`头文件`的搜索选项，例如：

```
-I/home/toolchains_sdkdir/include -L/home/toolchains_sdkdir/lib
```

这些都是xmake自动处理的，不需要手动配置他们。。

###### --bin

- 设置工具链bin目录

对于不规则工具链目录结构，靠单纯地[--sdk](#-sdk)选项设置，没法完全检测通过的情况下，可以通过这个选项继续附加设置工具链的bin目录位置。

例如：一些特殊的交叉工具链的，编译器bin目录，并不在 `/home/toolchains_sdkdir/bin` 这个位置，而是独立到了 `/usr/opt/bin` 

```bash
$ xmake f -p linux --sdk=/home/toolchains_sdkdir --bin=/usr/opt/bin
$ xmake
```

<p class="tips">
v2.2.1版本之前，这个参数名是`--toolchains`，比较有歧义，因此新版本中，统一改成`--bin=`来设置bin目录。
</p>

###### --cross

- 设置交叉工具链工具前缀

像`aarch64-linux-android-`这种，通常如果你配置了[--sdk](#-sdk)或者[--bin](#-bin)的情况下，xmake会去自动检测的，不需要自己手动设置。

但是对于一些极特殊的工具链，一个目录下同时有多个cross前缀的工具bin混在一起的情况，你需要手动设置这个配置，来区分到底需要选用哪个bin。

例如，toolchains的bin目录下同时存在两个不同的编译器：

```
/opt/bin
 - armv7-linux-gcc
 - aarch64-linux-gcc
```

我们现在想要选用armv7的版本，则配置如下：

```bash
$ xmake f -p linux --sdk=/usr/toolsdk --bin=/opt/bin --cross=armv7-linux-
```

###### --as

- 设置`asm`汇编器

如果还要继续细分选择编译器，则继续追加相关编译器选项，例如：

```bash
$ xmake f -p linux --sdk=/user/toolsdk --as=armv7-linux-as
```

如果存在`AS`环境变量的话，会优先使用当前环境变量中指定的值。

<p class="tips">
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么编译器工具检测就会失败。
这个时候我们可以通过：`xmake f --as=gcc@/home/xxx/asmips.exe` 设置ccmips.exe编译器作为类gcc的使用方式来编译。
也就是说，在指定编译器为`asmips.exe`的同时，告诉xmake，它跟gcc用法和参数选项基本相同。
</p>

###### --cc

- 设置c编译器

如果还要继续细分选择编译器，则继续追加相关编译器选项，例如：

```bash
$ xmake f -p linux --sdk=/user/toolsdk --cc=armv7-linux-clang
```

如果存在`CC`环境变量的话，会优先使用当前环境变量中指定的值。

<p class="tips">
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么编译器工具检测就会失败。
这个时候我们可以通过：`xmake f --cc=gcc@/home/xxx/ccmips.exe` 设置ccmips.exe编译器作为类gcc的使用方式来编译。
也就是说，在指定编译器为`ccmips.exe`的同时，告诉xmake，它跟gcc用法和参数选项基本相同。
</p>

###### --cxx

- 设置`c++`编译器

如果还要继续细分选择编译器，则继续追加相关编译器选项，例如：

```bash
$ xmake f -p linux --sdk=/user/toolsdk --cxx=armv7-linux-clang++
```

如果存在`CXX`环境变量的话，会优先使用当前环境变量中指定的值。

<p class="tips">
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么编译器工具检测就会失败。
这个时候我们可以通过：`xmake f --cxx=clang++@/home/xxx/c++mips.exe` 设置c++mips.exe编译器作为类clang++的使用方式来编译。
也就是说，在指定编译器为`c++mips.exe`的同时，告诉xmake，它跟clang++用法和参数选项基本相同。
</p>

###### --ld

- 设置`c/c++/objc/asm`链接器

如果还要继续细分选择链接器，则继续追加相关编译器选项，例如：

```bash
$ xmake f -p linux --sdk=/user/toolsdk --ld=armv7-linux-clang++
```

如果存在`LD`环境变量的话，会优先使用当前环境变量中指定的值。

<p class="tips">
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么链接器工具检测就会失败。
这个时候我们可以通过：`xmake f --ld=g++@/home/xxx/c++mips.exe` 设置c++mips.exe链接器作为类g++的使用方式来编译。
也就是说，在指定链接器为`c++mips.exe`的同时，告诉xmake，它跟g++用法和参数选项基本相同。
</p>

###### --sh

- 设置`c/c++/objc/asm`共享库链接器

```bash
$ xmake f -p linux --sdk=/user/toolsdk --sh=armv7-linux-clang++
```

如果存在`SH`环境变量的话，会优先使用当前环境变量中指定的值。

<p class="tips">
如果指定的编译器名不是那些xmake内置可识别的名字（带有gcc, clang等字样），那么链接器工具检测就会失败。
这个时候我们可以通过：`xmake f --sh=g++@/home/xxx/c++mips.exe` 设置c++mips.exe链接器作为类g++的使用方式来编译。
也就是说，在指定链接器为`c++mips.exe`的同时，告诉xmake，它跟g++用法和参数选项基本相同。
</p>

###### --ar

- 设置`c/c++/objc/asm`静态库归档器

```bash
$ xmake f -p linux --sdk=/user/toolsdk --ar=armv7-linux-ar
```

如果存在`AR`环境变量的话，会优先使用当前环境变量中指定的值。

<p class="tips">
如果指定的编译器名不是那些xmake内置可识别的名字（带有ar等字样），那么链接器工具检测就会失败。
这个时候我们可以通过：`xmake f --ar=ar@/home/xxx/armips.exe` 设置armips.exe链接器作为类ar的使用方式来编译。
也就是说，在指定链接器为`armips.exe`的同时，告诉xmake，它跟ar用法和参数选项基本相同。
</p>

#### 全局配置

我们也可以将一些常用配置保存到全局配置中，来简化频繁地输入：

例如:

```bash
$ xmake g --ndk=~/files/android-ndk-r10e/
```

现在，我们重新配置和编译`android`程序：

```bash
$ xmake f -p android
$ xmake
```

以后，就不需要每次重复配置`--ndk=`参数了。

<p class="tip">
    每个命令都有其简写，例如: `xmake g` 或者 `xmake global`.<br>
</p>

#### 清除配置

有时候，配置出了问题编译不过，或者需要重新检测各种依赖库和接口，可以加上`-c`参数，清除缓存的配置，强制重新检测和配置

```bash
$ xmake f -c
$ xmake
```

或者：

```bash
$ xmake f -p iphoneos -c
$ xmake
```

## 问答

#### 怎样获取更多参数选项信息？

获取主菜单的帮助信息，里面有所有action和plugin的列表描述。

```bash
$ xmake [-h|--help]
``` 

获取配置菜单的帮助信息，里面有所有配置选项的描述信息，以及支持平台、架构列表。

```bash
$ xmake f [-h|--help]
``` 

获取action和plugin命令菜单的帮助信息，里面有所有内置命令和插件任务的参数使用信息。

```bash
$ xmake [action|plugin] [-h|--help]
``` 

例如，获取`run`命令的参数信息:

```bash
$ xmake run --help
``` 

#### 怎样实现静默构建，不输出任何信息？

```bash
$ xmake [-q|--quiet]
```

#### 如果xmake运行失败了怎么办？

可以先尝试清除下配置，重新构建下：

```bash
$ xmake f -c
$ xmake
```

如果还是失败了，请加上 `-v` 或者 `--verbose` 选项重新执行xmake后，获取更加详细的输出信息

例如：

```hash
$ xmake [-v|--verbose] 
```

并且可以加上 `--backtrace` 选项获取出错时的xmake的调试栈信息, 然后你可以提交这些信息到[issues](https://github.com/tboox/xmake/issues).

```bash
$ xmake -v --backtrace
```

#### 怎样看实时编译警告信息?

为了避免刷屏，在构建时候，默认是不实时输出警告信息的，如果想要看的话可以加上`-w`选项启用编译警告输出就行了。

```bash
$ xmake [-w|--warning] 
```

#### 怎样基于源码自动生成xmake.lua

如果你想临时写一两个测试代码、或者手上有一些移植过来的零散源码想要快速编译运行，可以不用专门xmake.lua，直接运行：

```bash
$ xmake
```

xmake会自动扫描分析当前的源码目录，识别程序结构和类型，生成一个xmake.lua，并且会尝试直接构建它。

如果编译成功，可以直接运行：

```bash
$ xmake run
```

当然，如果仅仅只是想要生成xmake.lua，默认不去构建，可以执行：

```bash
$ xmake f -y
```

更多相关介绍，请参考文章：[xmake新增智能代码扫描编译模式，无需手写任何make文件](http://tboox.org/cn/2017/01/07/build-without-makefile/)

## 支持项目

xmake项目属于个人开源项目，它的发展需要您的帮助，如果您愿意支持xmake项目的开发，欢迎为其捐赠，支持它的发展。 🙏 [[支持此项目](https://opencollective.com/xmake#backer)]

<a href="https://opencollective.com/xmake#backers" target="_blank"><img src="https://opencollective.com/xmake/backers.svg?width=890"></a>

## 赞助项目

通过赞助支持此项目，您的logo和网站链接将显示在这里。[[赞助此项目](https://opencollective.com/xmake#sponsor)]

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


