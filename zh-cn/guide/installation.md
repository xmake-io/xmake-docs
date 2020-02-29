
## Master版本

!> 切记，xmake不建议在root下安装和使用，所以尽量不要在root下拉取源码编译安装！

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

!> 如果ps脚本执行提示失败，可以尝试在管理员模式下执行

## Windows

### 使用安装包

1. 从 [Releases](https://github.com/xmake-io/xmake/releases) 上下载windows安装包
2. 运行安装程序 xmake-[version].exe

### 使用scoop

```bash
scoop install xmake
```

## Msys/Mingw

现在msys/pacman官方仓库已经收录xmake软件包，可直接通过pacman安装。

### mingw64

```bash
pacman -Sy mingw-w64-x86_x64-xmake
```

### mingw32

```bash
pacman -Sy mingw-w64-i686-xmake
```

## MacOS

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install xmake
```

或者：

1. 从 [Releases](https://github.com/xmake-io/xmake/releases) 上下载pkg安装包
2. 双击运行

或者安装master版本:

```bash
# 使用homebrew安装master版本
brew install xmake --HEAD

# 或者直接调用shell下载安装
bash <(curl -fsSL https://xmake.io/shget.text)
```

## Linux

在archlinux上安装：

```bash
yaourt xmake
```

或者下载deb包来安装：

1. 从 [Releases](https://github.com/xmake-io/xmake/releases) 上下载deb安装包
2. 运行: `dpkg -i xmake-xxxx.deb`

## Termux (Android)

```bash
pkg install xmake
```

## 源码编译安装

### 安装

!> 切记，xmake不建议在root下安装和使用，所以尽量不要在root下拉取源码编译安装！

```bash
git clone --recursive https://github.com/xmake-io/xmake.git
cd ./xmake
make build
./scripts/get.sh __local__ __install_only__
source ~/.xmake/profile
```

如果觉得github的源太慢，可以通过gitee的镜像源拉取：`clone --recursive https://gitee.com/tboox/xmake.git`

!> 由于目前xmake源码通过git submodule维护依赖，所以clone的时候需要加上`--recursive`参数同时拉取所有submodules代码，请不要直接下载tar.gz源码，因为github不会自动打包submodules里面的代码。

如果git clone的时候忘记加`--recursive`，那么也可以执行`git submodule update --init`来拉取所有submodules，例如：

```bash
git clone https://github.com/xmake-io/xmake.git
cd ./xmake
git submodule update --init
make build
./scripts/get.sh __local__ __install_only__
```

!> `./get.sh __local__`是安装到`~/.local/xmake`下，然后通过`source ~/.xmake/profile`方式来加载的，所以安装完，当前终端如果执行xmake失败，提示找不到，就手动执行下 `source ~/.xmake/profile`，而下次打开终端就不需要了。

### 卸载

```bash
./scripts/get.sh __uninstall__
```

### 仅仅更新安装lua脚本

这个开发者本地调试xmake源码才需要：

```bash
./scripts/get.sh __local__ __install_only__
```

### root下安装

xmake不推荐root下安装使用，因为这很不安全，如果用户非要root下装，装完后，如果提示xmake运行不了，请根据提示传递`--root`参数，或者设置`XMAKE_ROOT=y`环境变量强行启用下，前提是：用户需要随时注意root下误操作系统文件文件的风险。

### 依赖问题

1. 如果遇到readline相关问题，请装下readline-devel或者libreadline-dev依赖，这个是可选的，仅仅`xmake lua`命令执行REPL时候才需要。
2. 如果想要提速编译，可以装下ccache，xmake会自动检测并使用，这也是可选的。

## 其他安装方式 

!> 这种也是源码编译安装，但是安装路径会直接写入`/usr/`下，需要root权限，因此除非特殊情况，不推荐这种安装方式，建议采用上文提供的`./get.sh __local__`方式来安装，这两种安装方式的安装路径是不同的，不要混用。

通过make进行编译安装:

```bash
make build; sudo make install
```

安装到其他指定目录:

```bash
sudo make install prefix=/usr/local
```

卸载:

```bash
sudo make uninstall
```

## 更新升级

从v2.2.3版本开始，新增了`xmake update`命令，来快速进行自我更新和升级，默认是升级到最新版本，当然也可以指定升级或者回退到某个版本：

```bash
xmake update 2.2.4
```

我们也可以指定更新到master/dev分支版本：

```bash
xmake update master
xmake update dev
```

从指定git源更新

```bash
xmake update github:xmake-io/xmake#master
xmake update gitee:tboox/xmake#dev # gitee镜像
```

如果xmake/core没动过，仅仅更新xmake的lua脚本改动，可以加`-s/--scriptonly`快速更新lua脚本

```bash
xmake update -s dev
```

最后，我们如果要卸载xmake，也是支持的：`xmake update --uninstall`

