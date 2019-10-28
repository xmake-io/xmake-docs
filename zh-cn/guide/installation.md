
## Master版本

### 使用curl

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh)
```

### 使用wget

```bash
bash <(wget https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh -O -)
```

### 使用powershell

```bash
Invoke-Expression (Invoke-Webrequest 'https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.ps1' -UseBasicParsing).Content
```

## Windows

### 使用安装包

1. 从 [Releases](https://github.com/xmake-io/xmake/releases) 上下载windows安装包
2. 运行安装程序 xmake-[version].exe

### 使用scoop

```bash
scoop install xmake
```

## MacOS

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

## Linux

在archlinux上安装：

```bash
$ yaourt xmake
```

或者下载deb包来安装：

1. 从 [Releases](https://github.com/xmake-io/xmake/releases) 上下载deb安装包
2. 运行: `dpkg -i xmake-xxxx.deb`

## 源码编译安装

### 安装

```bash
$ git clone --recursive https://github.com/xmake-io/xmake.git
$ cd ./xmake
$ ./scripts/get.sh __local__
$ source ~/.xmake/profile
```

如果觉得github的源太慢，可以通过gitee的镜像源拉取：`clone --recursive https://gitee.com/tboox/xmake.git`

!> 由于目前xmake源码通过git submodule维护依赖，所以clone的时候需要加上`--recursive`参数同时拉取所有submodules代码，请不要直接下载tar.gz源码，因为github不会自动打包submodules里面的代码。

如果git clone的时候忘记加`--recursive`，那么也可以执行`git submodule update --init`来拉取所有submodules，例如：

```bash
$ git clone https://github.com/xmake-io/xmake.git
$ cd ./xmake
$ git submodule update --init
$ ./scripts/get.sh __local__
```

!> `./get.sh __local__`是安装到`~/.local/xmake`下，然后通过`source ~/.xmake/profile`方式来加载的，所以安装完，当前终端如果执行xmake失败，提示找不到，就手动执行下 `source ~/.xmake/profile`，而下次打开终端就不需要了。

### 卸载

```bash
$ ./scripts/get.sh __uninstall__
```

### 仅仅更新安装lua脚本

这个开发者本地调试xmake源码才需要：

```bash
$ ./scripts/get.sh __local__ __install_only__
```

## 其他安装方式 

!> 这种也是源码编译安装，但是安装路径会直接写入`/usr/`下，需要root权限，因此除非特殊情况，不推荐这种安装方式，建议采用上文提供的`./get.sh __local__`方式来安装。

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

## 更新升级

从v2.2.3版本开始，新增了`xmake update`命令，来快速进行自我更新和升级，默认是升级到最新版本，当然也可以指定升级或者回退到某个版本：

```bash
$ xmake update 2.2.4
```

我们也可以指定更新到master/dev分支版本：

```bash
$ xmake update master
$ xmake update dev
```

从指定git源更新

```bash
$ xmake update github:xmake-io/xmake#master
$ xmake update gitee:tboox/xmake#dev # gitee镜像
```

如果xmake/core没动过，仅仅更新xmake的lua脚本改动，可以加`-s/--scriptonly`快速更新lua脚本

```bash
$ xmake update -s dev
```

最后，我们如果要卸载xmake，也是支持的：`xmake update --uninstall`

