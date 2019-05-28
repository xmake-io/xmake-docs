---
nav: zh
search: zh
---

<p>
<div align="center">
  <a href="https://xmake.io/cn">
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

##### 使用安装包

1. 从 [Releases](https://github.com/xmake-io/xmake/releases) 上下载windows安装包
2. 运行安装程序 xmake-[version].exe

##### 使用scoop

```bash
scoop install xmake
```

#### MacOS

```bash
$ ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew install xmake
```

或者：

1. 从 [Releases](https://github.com/xmake-io/xmake/releases) 上下载pkg安装包
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

1. 从 [Releases](https://github.com/xmake-io/xmake/releases) 上下载deb安装包
2. 运行: `dpkg -i xmake-xxxx.deb`

在`redhat/centos`上安装：

1. 从 [Releases](https://github.com/xmake-io/xmake/releases) 上下载rpm安装包
2. 运行: `yum install xmake-xxx.rpm --nogpgcheck`

#### 编译安装

通过脚本编译安装:

```bash
$ git clone https://github.com/xmake-io/xmake.git
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

#### 更新升级

从v2.2.3版本开始，新增了`xmake update`命令，来快速进行自我更新和升级，默认是升级到最新版本，当然也可以指定升级或者回退到某个版本：

```bash
$ xmake update 2.2.4
```

我们也可以指定更新到master/dev分支版本：

```bash
$ xmake update master
$ xmake update dev
```

最后，我们如果要卸载xmake，也是支持的：`xmake update --uninstall`

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

更多详情可以参考：[#160](https://github.com/xmake-io/xmake/issues/160)

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

更多详情可以参考：[#158](https://github.com/xmake-io/xmake/issues/158)

#### WDK驱动程序

默认会自动探测wdk所在环境，当然也可以指定wdk sdk环境目录：

```console
$ xmake f --wdk="G:\Program Files\Windows Kits\10" -c 
$ xmake
```

更多详情可以参考：[#159](https://github.com/xmake-io/xmake/issues/159)

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

更多详情可以参考：[#173](https://github.com/xmake-io/xmake/issues/173)

## 编译配置

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

如果要手动指定ndk中具体某个工具链，而不是使用默认检测的配置，可以通过[--bin](#-bin)来设置，例如：

```bash
$ xmake f -p android --ndk=~/files/android-ndk-r10e/ -a arm64-v8a --bin=~/files/android-ndk-r10e/toolchains/aarch64-linux-android-4.9/prebuilt/darwin-x86_64/bin
```

[--bin](#-bin)主要用于设置选择编译工具的具体bin目录，这个的使用跟[交叉编译](#交叉编译)中的[--bin](#-bin)的行为是一致的。

<p class="tip">
如果手动设置了bin目录，没有通过检测，可以看下是否`--arch=`参数没有匹配对。
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

## 依赖包管理

#### 本地内置模式

通过在项目中内置依赖包目录以及二进制包文件，可以方便的集成一些第三方的依赖库，这种方式比较简单直接，但是缺点也很明显，不方便管理。

以tbox工程为例，其依赖包如下：

```
- base.pkg
- zlib.pkg
- polarssl.pkg
- openssl.pkg
- mysql.pkg
- pcre.pkg
- ...
```

如果要让当前工程识别加载这些包，首先要指定包目录路径，例如：

```lua
add_packagedirs("packages")
```

指定好后，就可以在target作用域中，通过[add_packages](https://xmake.io/#/zh/manual?id=targetadd_packages)接口，来添加集成包依赖了，例如：

```lua
target("tbox")
    add_packages("zlib", "polarssl", "pcre", "mysql")
```

那么如何去生成一个*.pkg的包呢，如果是基于xmake的工程，生成方式很简单，只需要：

```console
$ cd tbox
$ xmake package
```

即可在build目录下生成一个tbox.pkg的跨平台包，给第三方项目使用，我也可以直接设置输出目录，编译生成到对方项目中去，例如：

```console
$ cd tbox
$ xmake package -o ../test/packages
```

这样，test工程就可以通过[add_packages](https://xmake.io/#/zh/manual?id=targetadd_packages)和[add_packagedirs](https://xmake.io/#/zh/manual?id=add_packagedirs)去配置和使用tbox.pkg包了。

关于内置包的详细描述，还可以参考下相关文章，这里面有详细介绍：[依赖包的添加和自动检测机制](https://tboox.org/cn/2016/08/06/add-package-and-autocheck/)

#### 系统查找模式

如果觉得上述内置包的管理方式非常不方便，可以通过xmake提供的内置接口`find_packages`。

目前此接口支持以下一些包管理支持：

* vcpkg
* homebrew
* pkg-config

并且通过系统和第三方包管理工具进行依赖包的安装，然后与xmake进行集成使用，例如我们查找一个openssl包：

```lua
local packages = find_packages("openssl", "zlib")
```

返回的结果如下：

```lua
{
    {links = {"ssl", "crypto"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}},
    {links = {"z"}, linkdirs = {"/usr/local/lib"}, includedirs = {"/usr/local/include"}}
}
```

如果查找成功，则返回一个包含所有包信息的table，如果失败返回nil

这里的返回结果可以直接作为`target:add`, `option:add`的参数传入，用于动态增加`target/option`的配置：

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
        target:add(find_package("openssl", "zlib"))
    end)
```

如果系统上装有`homebrew`, `pkg-config`等第三方工具，那么此接口会尝试使用它们去改进查找结果。

更完整的使用描述，请参考：[find_packages](https://xmake.io/#/zh/manual?id=find_packages)接口文档。

##### homebrew集成支持

由于homebrew一般都是把包直接装到的系统中去了，因此用户不需要做任何集成工作，`find_packages`就已经原生无缝支持。

##### vcpkg集成支持

目前xmake v2.2.2版本已经支持了vcpkg，用户只需要装完vcpkg后，执行`$ vcpkg integrate install`，xmake就能自动从系统中检测到vcpkg的根路径，然后自动适配里面包。

当然，我们也可以手动指定vcpkg的根路径来支持：

```console
$ xmake f --vcpkg=f:\vcpkg
```

或者我们可以设置到全局配置中去，避免每次切换配置的时候，重复设置：

```console
$ xmake g --vcpkg=f:\vcpkg
```

#### 远程依赖模式

这个在2.2.2版本后已经初步支持，用法上更加的简单，只需要设置对应的依赖包就行了，例如：

```lua
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("tbox", "libpng", "zlib")
```

上面的`add_requires`用于描述当前项目需要的依赖包，而`add_packages`用于应用依赖包到test目标，只有设置这个才会自动追加links, linkdirs, includedirs等设置。

然后直接执行编译即可：

```console
$ xmake 
```

xmake会去远程拉取相关源码包，然后自动编译安装，最后编译项目，进行依赖包的链接，具体效果见下图：

<img src="/assets/img/index/package_manage.png" width="80%" />

关于包依赖管理的更多相关信息和进展见相关issues：[Remote package management](https://github.com/xmake-io/xmake/issues/69) 

##### 目前支持的特性

* 语义版本支持，例如：">= 1.1.0 < 1.2", "~1.6", "1.2.x", "1.*"
* 提供官方包仓库、自建私有仓库、项目内置仓库等多仓库管理支持
* 跨平台包编译集成支持（不同平台、不同架构的包可同时安装，快速切换使用）
* debug依赖包支持，实现源码调试

##### 依赖包处理机制

这里我们简单介绍下整个依赖包的处理机制：

<img src="/assets/img/index/package_arch.png" width="80%" />

1. 优先检测当前系统目录、第三方包管理下有没有存在指定的包，如果有匹配的包，那么就不需要下载安装了 （当然也可以设置不使用系统包）
2. 检索匹配对应版本的包，然后下载、编译、安装（注：安装在特定xmake目录，不会干扰系统库环境）
3. 编译项目，最后自动链接启用的依赖包

##### 快速上手

新建一个依赖tbox库的空工程：

```console
$ xmake create -t console_tbox test
$ cd test
```

执行编译即可，如果当前没有安装tbox库，则会自动下载安装后使用：

```console
$ xmake
```

切换到iphoneos平台进行编译，将会重新安装iphoneos版本的tbox库进行链接使用：

```console
$ xmake f -p iphoneos
$ xmake
```

切换到android平台arm64-v8a架构编译：

```console
$ xmake f -p android [--ndk=~/android-ndk-r16b]
$ xmake
```

##### 语义版本设置

xmake的依赖包管理是完全支持语义版本选择的，例如："~1.6.1"，对于语义版本的具体描述见：[https://semver.org/](https://semver.org/)

一些语义版本写法：

```lua
add_requires("tbox 1.6.*", "pcre 1.3.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

目前xmake使用的语义版本解析器是[uael](https://github.com/uael)贡献的[sv](https://github.com/uael/sv)库，里面也有对版本描述写法的详细说明，可以参考下：[版本描述说明](https://github.com/uael/sv#versions)

当然，如果我们对当前的依赖包的版本没有特殊要求，那么可以直接这么写：

```lua
add_requires("tbox", "libpng", "zlib")
```

这会使用已知的最新版本包，或者是master分支的源码编译的包，如果当前包有git repo地址，我们也能指定特定分支版本：

```lua
add_requires("tbox master")
add_requires("tbox dev")
```

##### 额外的包信息设置

###### 可选包设置

如果指定的依赖包当前平台不支持，或者编译安装失败了，那么xmake会编译报错，这对于有些必须要依赖某些包才能工作的项目，这是合理的。
但是如果有些包是可选的依赖，即使没有也可以正常编译使用的话，可以设置为可选包：

```lua
add_requires("tbox", {optional = true})
```

###### 禁用系统库

默认的设置，xmake会去优先检测系统库是否存在（如果没设置版本要求），如果用户完全不想使用系统库以及第三方包管理提供的库，那么可以设置：

```lua
add_requires("tbox", {system = false})
```

###### 使用调试版本的包

如果我们想同时源码调试依赖包，那么可以设置为使用debug版本的包（当然前提是这个包支持debug编译）：

```lua
add_requires("tbox", {debug = true})
```

如果当前包还不支持debug编译，可在仓库中提交修改编译规则，对debug进行支持，例如：

```lua
package("openssl")
    on_install("linux", "macosx", function (package)
        os.vrun("./config %s --prefix=\"%s\"", package:debug() and "--debug" or "", package:installdir())
        os.vrun("make -j4")
        os.vrun("make install")
    end)
```

###### 传递额外的编译信息到包

某些包在编译时候有各种编译选项，我们也可以传递进来，当然包本身得支持：

```lua
add_requires("tbox", {configs = {small=true}})
```

传递`--small=true`给tbox包，使得编译安装的tbox包是启用此选项的。

##### 第三方依赖包安装

2.2.5版本之后，xmake支持对对第三方包管理器里面的依赖库安装支持，例如：conan，brew, vcpkg等

添加homebrew的依赖包：

```lua
add_requires("brew::zlib", {alias = "zlib"}})
add_requires("brew::pcre2/libpcre2-8", {alias = "pcre2"}})

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("pcre2", "zlib")
```

添加vcpkg的依赖包：

```lua
add_requires("vcpkg::zlib", "vcpkg::pcre2")

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("vcpkg::zlib", "vcpkg::pcre2")
```

添加conan的依赖包：

```lua
add_requires("CONAN::zlib/1.2.11@conan/stable", {alias = "zlib", debug = true})
add_requires("CONAN::OpenSSL/1.0.2n@conan/stable", {alias = "openssl", 
    configs = {options = "OpenSSL:shared=True"}})

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("openssl", "zlib")
```

执行xmake进行编译后：

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

##### 使用自建私有包仓库

如果需要的包不在官方仓库[xmake-repo](https://github.com/xmake-io/xmake-repo)中，我们可以提交贡献代码到仓库进行支持。
但如果有些包仅用于个人或者私有项目，我们可以建立一个私有仓库repo，仓库组织结构可参考：[xmake-repo](https://github.com/xmake-io/xmake-repo)

比如，现在我们有一个一个私有仓库repo：`git@github.com:myrepo/xmake-repo.git`

我们可以通过下面的命令进行仓库添加：

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

或者我们直接写在xmake.lua中：

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git")
```

如果我们只是想添加一两个私有包，这个时候特定去建立一个git repo太小题大做了，我们可以直接把包仓库放置项目里面，例如：

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

上面myrepo目录就是自己的私有包仓库，内置在自己的项目里面，然后在xmake.lua里面添加一下这个仓库位置：

```lua
add_repositories("my-repo myrepo")
```

这个可以参考[benchbox](https://github.com/tboox/benchbox)项目，里面就内置了一个私有仓库。

我们甚至可以连仓库也不用建，直接定义包描述到项目xmake.lua中，这对依赖一两个包的情况还是很有用的，例如：

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

##### 包管理命令使用

包管理命令`$ xmake require` 可用于手动显示的下载编译安装、卸载、检索、查看包信息。

###### 安装指定包

```console
$ xmake require tbox
```

安装指定版本包：

```console
$ xmake require tbox "~1.6"
```

强制重新下载安装，并且显示详细安装信息：

```console
$ xmake require -f -v tbox "1.5.x"
```

传递额外的设置信息：

```console
$ xmake require --extra="debug=true,config={small=true}" tbox
```

安装debug包，并且传递`small=true`的编译配置信息到包中去。

###### 卸载指定包

```console
$ xmake require --uninstall tbox
```

这会完全卸载删除包文件。

###### 移除指定包

仅仅unlink指定包，不被当前项目检测到，但是包在本地还是存在的，如果重新安装的话，会很快完成。

```console
$ xmake require --unlink tbox
```

###### 查看包详细信息

```console
$ xmake require --info tbox
```

###### 在当前仓库中搜索包

```console
$ xmake require --search tbox
```

这个是支持模糊搜素以及lua模式匹配搜索的：

```console
$ xmake require --search pcr
```

会同时搜索到pcre, pcre2等包。

###### 列举当前已安装的包

```console
$ xmake require --list
```

##### 仓库管理命令使用

上文已经简单讲过，添加私有仓库可以用（支持本地路径添加）：

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

v2.2.3开始，支持添加指定分支的repo，例如：

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git dev
```

我们也可以移除已安装的某个仓库：

```console
$ xmake repo --remove myrepo
```

或者查看所有已添加的仓库：

```console
$ xmake repo --list
```

如果远程仓库有更新，可以手动执行仓库更新，来获取更多、最新的包：

```console
$ xmake repo -u
```

##### 提交包到官方仓库

目前这个特性刚完成不久，目前官方仓库的包还不是很多，有些包也许还不支持部分平台，不过这并不是太大问题，后期迭代几个版本后，我会不断扩充完善包仓库。

如果你需要的包，当前的官方仓库还没有收录，可以提交issues或者自己可以在本地调通后，贡献提交到官方仓库：[xmake-repo](https://github.com/xmake-io/xmake-repo)

详细的贡献说明，见：[CONTRIBUTING.md](https://github.com/xmake-io/xmake-repo/blob/master/CONTRIBUTING.md)

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

并且可以加上 `--backtrace` 选项获取出错时的xmake的调试栈信息, 然后你可以提交这些信息到[issues](https://github.com/xmake-io/xmake/issues).

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

更多相关介绍，请参考文章：[xmake新增智能代码扫描编译模式，无需手写任何make文件](https://tboox.org/cn/2017/01/07/build-without-makefile/)

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


