---
outline: deep
---

# 快速上手 {quick-start}

## 安装 {#installation}

::: tip 注意
Xmake 不推荐 root 下安装使用，因为这很不安全，如果用户非要 root 下装，装完后，如果提示xmake运行不了，请根据提示传递`--root`参数，或者设置`XMAKE_ROOT=y`环境变量强行启用下，前提是：用户需要随时注意root下误操作系统文件文件的风险。
:::

::: code-group

```sh [curl]
curl -fsSL https://xmake.io/shget.text | bash
```

```sh [wget]
wget https://xmake.io/shget.text -O - | bash
```

```powershell [powershell]
irm https://xmake.io/psget.text | iex
```

:::

如果要安装指定版本和分支，后面可以追加版本号和分支参数

```sh
curl -fsSL https://xmake.io/shget.text | bash -s dev
curl -fsSL https://xmake.io/shget.text | bash -s v2.7.7
& ([ScriptBlock]::Create((irm https://xmake.io/psget.text))) -version 2.7.7
```

::: tip 注意
如果ps脚本执行提示失败，可以尝试在管理员模式下执行
:::

### Windows

1. 从 [Releases](https://github.com/xmake-io/xmake/releases) 上下载windows安装包
2. 运行安装程序 xmake-[version].[win32|win64].exe

::: tip 注意
Releases 下面 xmake-[version].[win32|win64].zip 的包是不带安装程序的，可直接解压使用，绿色无依赖，不过需要自己添加PATH环境变量。
:::

此外，Releases下面带有 xmake-tinyc 开头的exe安装包，内部集成了 tinyc 编译器环境，自带 libc 和 winapi 头文件，安装这个包，可以实现在没有 msvc 环境下，也能正常编译 c 程序。
这对于临时想写一些 c 测试或者算法代码，又不想安装 msvc 的用户非常有用，不过安装包会稍微大2-3M，不过也还好。

::: code-group

```sh [scoop]
scoop install xmake
```

```sh [winget]
winget install xmake
```
:::

### Msys/Mingw

现在msys/pacman官方仓库已经收录xmake软件包，可直接通过pacman安装。

::: code-group

```sh [mingw64]
pacman -Sy mingw-w64-x86_64-xmake
```

```sh [mingw32]
pacman -Sy mingw-w64-i686-xmake
```

:::

### MacOS

```sh
brew install xmake
```

### Linux 发行版

::: code-group

```sh [Archlinux]
sudo pacman -Sy xmake
```

```sh [Alpine]
sudo apk add xmake
```

```sh [ubuntu]
sudo apt install xmake
```

```sh [debian]
sudo apt install xmake
```

```sh [fedora]
sudo dnf install xmake
```

:::

### Ubuntu PPA

```sh
sudo add-apt-repository ppa:xmake-io/xmake
sudo apt update
sudo apt install xmake
```

### Gentoo

1. 参考[这里](https://wiki.gentoo.org/wiki/Project:GURU/Information_for_End_Users)将GURU添加到你的系统仓库
2. 安装dev-util/xmake

```sh
sudo emerge -a --autounmask dev-util/xmake
```

### 其他 Linux

先从 [Releases](https://github.com/xmake-io/xmake/releases) 上下载xmake-x.x.x.gz.run自安装包

然后运行这个自安装包。

```sh
sudo chmod 777 ./xmake-x.x.x.gz.run
./xmake-x.x.x.gz.run
```

### FreeBSD

由于 BSD 上，已有的 xmake 包名已被占用，只能使用 xmake-io 作为包名来安装。

```sh
pkg install xmake-io
```

### Termux (Android)

```sh
pkg install xmake
```

### Bundle 包

如果不想安装，我们也提供了另外一种 Bundle 打包格式，它无需用户安装，单一可执行文件，下载即可运行使用，方便分发。

它会把所有 Lua 脚本内置到 Xmake 可执行文件中去，不需要额外安装和配置什么环境变量。

我们可以到 [Releases](https://github.com/xmake-io/xmake/releases) 中获取它们，目前有如下一些 Bundle 包。

```
xmake-bundle-v2.9.8.arm64.exe
xmake-bundle-v2.9.8.cosmocc
xmake-bundle-v2.9.8.linux.x86_64
xmake-bundle-v2.9.8.macos.arm64
xmake-bundle-v2.9.8.macos.x86_64
xmake-bundle-v2.9.8.win32.exe
xmake-bundle-v2.9.8.win64.exe
```

其中，`.cosmocc` 后缀的包，提供了跨平台运行的能力，但是目前对 Windows 上支持还比较弱，不推荐在 windows 上使用。

另外的都是针对特定平台的单一可执行文件，用户根据自己的系统按需下载使用。


### 源码编译安装 {#build-code-and-installation}

#### 下载源码 {#download-code}

```sh
git clone --recursive https://github.com/xmake-io/xmake.git
cd ./xmake
```

如果觉得github的源太慢，可以通过gitee的镜像源拉取：`clone --recursive https://gitee.com/tboox/xmake.git`
也可以如下修改 `~/.gitconfig`，永久解决github clone慢的问题

```
[url "ssh://git@github.com/"]
  insteadOf = https://github.com/
```

::: tip 注意
由于目前xmake源码通过git submodule维护依赖，所以clone的时候需要加上`--recursive`参数同时拉取所有submodules代码，请不要直接下载tar.gz源码，因为github不会自动打包submodules里面的代码。
:::

如果git clone的时候忘记加`--recursive`，那么也可以执行`git submodule update --init`来拉取所有submodules。

#### 编译安装 {#build-installation}

::: code-group

```sh [Linux]
./configure
make -j4
./scripts/get.sh __local__ __install_only__
source ~/.xmake/profile
```

```sh [Windows]
cd ./core
xmake
```

:::

::: tip 注意
`./get.sh __local__`是安装到`~/.local/xmake`下，然后通过`source ~/.xmake/profile`方式来加载的，所以安装完，当前终端如果执行xmake失败，提示找不到，就手动执行下 `source ~/.xmake/profile`，而下次打开终端就不需要了。

如果遇到readline相关问题，请装下readline-devel或者libreadline-dev依赖，这个是可选的，仅仅`xmake lua`命令执行REPL时候才需要。
:::

### 更新升级 {#update}

从 v2.2.3 版本开始，新增了`xmake update`命令，来快速进行自我更新和升级，默认是升级到最新版本，当然也可以指定升级或者回退到某个版本：

```sh
xmake update 2.7.1
```

我们也可以指定更新到master/dev分支版本：

```sh
xmake update master
xmake update dev
```

从指定git源更新

```sh
xmake update github:xmake-io/xmake#master
xmake update gitee:tboox/xmake#dev # gitee镜像
```

如果xmake/core没动过，仅仅更新xmake的lua脚本改动，可以加`-s/--scriptonly`快速更新lua脚本

```sh
xmake update -s dev
```

最后，我们如果要卸载xmake，也是支持的：`xmake update --uninstall`

## 创建工程 {#create-project}

创建一个名叫 `hello` 的 `c++` 控制台工程：

```sh
$ xmake create hello
```

执行完后，将会生成一个简单工程结构：

```
hello
├── src
│   └─main.cpp
└── xmake.lua
```

其中`xmake.lua`是工程描述文件，内容非常简单，告诉 xmake 添加`src`目录下的所有`.cpp`源文件：

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

target("hello")
    set_kind("binary")
    add_files("src/*.cpp")
```

## 构建工程 {#build-project}

```sh
$ cd hello
$ xmake
```

## 运行程序 {#run-program}

```sh
$ xmake run
```

## 调试程序 {#debug-program}

首先你需要切换到 debug 模式去重新编译程序。

```sh
$ xmake config -m debug
$ xmake
```

然后执行下面的命令去开始调试：

```sh
$ xmake run -d hello
```

Xmake 将会使用调试器去加载程序运行，目前支持：lldb, gdb, windbg, vsjitdebugger, ollydbg 等各种调试器。

```sh
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

如果想要使用指定的调试器：

```sh
$ xmake f --debugger=gdb
$ xmake run -d hello
```

## 下一步 {#next-steps}

- 继续阅读该指南. [创建工程](/zh/guide/basic-commands/create-project)
- 查看示例. [实例](/zh/examples/cpp/basic)
- 查看 API 手册. [API 手册](/zh/api/description/specification)

