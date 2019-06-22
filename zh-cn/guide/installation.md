
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

## 编译安装

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

最后，我们如果要卸载xmake，也是支持的：`xmake update --uninstall`

