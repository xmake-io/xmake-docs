
## 安装

#### 使用curl

```bash
bash <(curl -fsSL https://xmake.io/shget.text)
```

#### 使用wget

```bash
bash <(wget https://xmake.io/shget.text -O -)
```

#### 使用powershell

```powershell
Invoke-Expression (Invoke-Webrequest 'https://xmake.io/psget.text' -UseBasicParsing).Content
```

## 简单的工程描述

<img src="https://xmake.io/assets/img/index/showcode1.png" width="340px" />

## 包依赖描述

<img src="https://xmake.io/assets/img/index/add_require.png" width="600px" />

官方的xmake包管理仓库: [xmake-repo](https://github.com/xmake-io/xmake-repo)

## 构建工程

```bash
$ xmake
```

## 运行目标

```bash
$ xmake run console
```

## 调试程序

```bash
$ xmake run -d console
```

## 配置平台

```bash
$ xmake f -p [windows|linux|macosx|android|iphoneos ..] -a [x86|arm64 ..] -m [debug|release]
$ xmake
```

## 图形化菜单配置

```bash
$ xmake f --menu
```

<img src="https://xmake.io/assets/img/index/menuconf.png" width="650px" />

## 跟ninja一样快的构建速度

测试工程: [xmake-core](https://github.com/xmake-io/xmake/tree/master/core)

### 多任务并行编译测试

| 构建系统        | Termux (8core/-j12) | 构建系统         | MacOS (8core/-j12) |
|-----            | ----                | ---              | ---                |
|xmake            | 24.890s             | xmake            | 12.264s            |
|ninja            | 25.682s             | ninja            | 11.327s            |
|cmake(gen+make)  | 5.416s+28.473s      | cmake(gen+make)  | 1.203s+14.030s     |
|cmake(gen+ninja) | 4.458s+24.842s      | cmake(gen+ninja) | 0.988s+11.644s     |

### 单任务编译测试

| 构建系统        | Termux (-j1)     | 构建系统         | MacOS (-j1)    |
|-----            | ----             | ---              | ---            |
|xmake            | 1m57.707s        | xmake            | 39.937s        |
|ninja            | 1m52.845s        | ninja            | 38.995s        |
|cmake(gen+make)  | 5.416s+2m10.539s | cmake(gen+make)  | 1.203s+41.737s |
|cmake(gen+ninja) | 4.458s+1m54.868s | cmake(gen+ninja) | 0.988s+38.022s |


## 包依赖管理

### 下载和编译

<img src="https://xmake.io/assets/img/index/package_manage.png" width="650px" />

### 架构和流程

<img src="https://xmake.io/assets/img/index/package_arch.png" width="650px" />

## 支持平台

* Windows (x86, x64)
* macOS (i386, x86_64)
* Linux (i386, x86_64, cross-toolchains ..)
* *BSD (i386, x86_64)
* Android (x86, x86_64, armeabi, armeabi-v7a, arm64-v8a)
* iOS (armv7, armv7s, arm64, i386, x86_64)
* WatchOS (armv7k, i386)
* MSYS (i386, x86_64)
* MinGW (i386, x86_64)
* Cygwin (i386, x86_64)
* SDCC (stm8, mcs51, ..)
* Cross (cross-toolchains ..)

## 支持语言

* C/C++
* Objc/Objc++
* Swift
* Assembly
* Golang
* Rust
* Dlang
* Cuda

## 工程类型

* 静态库程序
* 动态库类型
* 控制台程序
* Cuda程序
* Qt应用程序
* WDK驱动程序
* WinSDK应用程序
* MFC应用程序

## 更多例子

Debug和Release模式：

```lua
add_rules("mode.debug", "mode.release")

target("console")
    set_kind("binary")
    add_files("src/*.c")
    if is_mode("debug") then
        add_defines("DEBUG")
    end
```

自定义脚本:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.c")
    after_build(function (target)
        print("hello: %s", target:name())
        os.exec("echo %s", target:targetfile())
    end)
```

下载和使用在[xmake-repo](https://github.com/xmake-io/xmake-repo)和第三方包仓库的依赖包：

```lua
add_requires("tbox >1.6.1", "libuv master", "vcpkg::ffmpeg", "brew::pcre2/libpcre2-8")
add_requires("conan::OpenSSL/1.0.2n@conan/stable", {alias = "openssl", optional = true, debug = true}) 
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libuv", "vcpkg::ffmpeg", "brew::pcre2/libpcre2-8", "openssl")
```

Qt QuickApp应用程序:

```lua
target("test")
    add_rules("qt.quickapp")
    add_files("src/*.cpp")
    add_files("src/qml.qrc")
```

Cuda程序:

```lua
target("test")
    set_kind("binary")
    add_files("src/*.cu")
    add_cugencodes("native")
    add_cugencodes("compute_30")
```

WDK/UMDF驱动程序:

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

更多WDK驱动程序例子(umdf/kmdf/wdm)，见：[WDK工程例子](https://xmake.io/#/zh-cn/guide/project_examples?id=wdk%e9%a9%b1%e5%8a%a8%e7%a8%8b%e5%ba%8f)

## 插件

#### 生成IDE工程文件插件（makefile, vs2002 - vs2019, ...）

```bash
$ xmake project -k vsxmake -m "debug;release" # 新版vs工程生成插件（推荐）
$ xmake project -k vs -m "debug;release"
$ xmake project -k cmake
$ xmake project -k ninja
$ xmake project -k compile_commands
```

#### 加载自定义lua脚本插件

```bash
$ xmake l ./test.lua
$ xmake l -c "print('hello xmake!')"
$ xmake l lib.detect.find_tool gcc
$ xmake l
> print("hello xmake!")
> {1, 2, 3}
< { 
    1,
    2,
    3 
  }
```

更多内置插件见相关文档：[内置插件文档](https://xmake.io/#/zh-cn/plugin/builtin_plugins)

其他扩展插件，请到插件仓库进行下载安装: [xmake-plugins](https://github.com/xmake-io/xmake-plugins).

## IDE和编辑器插件

* [xmake-vscode](https://github.com/xmake-io/xmake-vscode)

<img src="https://raw.githubusercontent.com/xmake-io/xmake-vscode/master/res/problem.gif" width="650px" />

* [xmake-sublime](https://github.com/xmake-io/xmake-sublime)

<img src="https://raw.githubusercontent.com/xmake-io/xmake-sublime/master/res/problem.gif" width="650px" />

* [xmake-idea](https://github.com/xmake-io/xmake-idea)

<img src="https://raw.githubusercontent.com/xmake-io/xmake-idea/master/res/problem.gif" width="650px" />

* [xmake.vim](https://github.com/luzhlon/xmake.vim) (third-party, thanks [@luzhlon](https://github.com/luzhlon))

* [xmake-gradle](https://github.com/xmake-io/xmake-gradle): 一个无缝整合xmake的gradle插件

## 项目例子

一些使用xmake的项目：

* [tbox](https://github.com/tboox/tbox)
* [gbox](https://github.com/tboox/gbox)
* [vm86](https://github.com/tboox/vm86)
* [更多](https://github.com/xmake-io/awesome-xmake)

## 演示视频

<a href="https://asciinema.org/a/133693">
<img src="https://asciinema.org/a/133693.png" width="650px" />
</a>

## 联系方式

* 邮箱：[waruqi@gmail.com](mailto:waruqi@gmail.com)
* 主页：[tboox.org](https://tboox.org/cn)
* 社区：[Reddit论坛](https://www.reddit.com/r/tboox/)
* 聊天：[Telegram群组](https://t.me/tbooxorg), [Gitter聊天室](https://gitter.im/tboox/tboox?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
* 源码：[Github](https://github.com/xmake-io/xmake), [Gitee](https://gitee.com/tboox/xmake)
* QQ群：343118190(满), 662147501
* 微信公众号：tboox-os
 
## 感谢

感谢所有对xmake有所[贡献](CONTRIBUTING.md)的人:
<a href="https://github.com/xmake-io/xmake/graphs/contributors"><img src="https://opencollective.com/xmake/contributors.svg?width=890&button=false" /></a>

* [TitanSnow](https://github.com/TitanSnow): 提供xmake [logo](https://github.com/TitanSnow/ts-xmake-logo) 和安装脚本
* [uael](https://github.com/uael): 提供语义版本跨平台c库 [sv](https://github.com/uael/sv)
* [OpportunityLiu](https://github.com/OpportunityLiu): 改进cuda构建, tests框架和ci

