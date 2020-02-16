## Master

!> Note! xmake is not recommended to install under root!

#### via curl

```bash
bash <(curl -fsSL https://cdn.jsdelivr.net/gh/xmake-io/xmake@master/scripts/get.sh)
```

#### via wget

```bash
bash <(wget https://cdn.jsdelivr.net/gh/xmake-io/xmake@master/scripts/get.sh -O -)
```

#### via powershell

```bash
Invoke-Expression (Invoke-Webrequest 'https://cdn.jsdelivr.net/gh/xmake-io/xmake@master/scripts/get.ps1' -UseBasicParsing).Content
```

!> If the ps script execution prompt fails, you can try to execute in administrator mode.

## Windows

### via installer

1. Download xmake windows installer from [Releases](https://github.com/xmake-io/xmake/releases)
2. Run xmake-[version].exe

### via scoop

```bash
scoop install xmake
```

## MacOS

```bash
$ brew install xmake
```

## Linux

On Archlinux:

```bash
$ yaourt xmake
```

Or download deb package to install it:

1. Download xmake `.deb` install package from [Releases](https://github.com/xmake-io/xmake/releases) 
2. Run `dpkg -i xmake-xxxx.deb`

## Termux

Under the termux of Android, usually only need to execute the above one-click installation script. If it fails, you can refer to the following to pull the source code to compile and install.

## Source compilation and installation
 
### Installation

!> Note! xmake is not recommended to install under root!

```bash
$ git clone --recursive https://github.com/xmake-io/xmake.git
$ cd ./xmake
$ make build
$ ./scripts/get.sh __local__ __install_only__
$ source ~/.xmake/profile
```

If you think the source of github is too slow, you can pull it through the mirror source of gitee or gitlab: 

```bash
git clone --recursive https://gitee.com/tboox/xmake.git
git clone --recursive https://gitlab.com/tboox/xmake.git
```

!> Since the current xmake source maintains dependencies via git submodule, it is necessary to add the `--recursive` parameter to pull all submodules at the same time. Please do not download the tar.gz source directly, because github does not automatically package submodules. Code.

If you forget to add `--recursive` when git clone, you can also execute `git submodule update --init` to pull all submodules, for example:

```bash
$ git clone https://github.com/xmake-io/xmake.git
$ cd ./xmake
$ git submodule update --init
$ make build
$ ./scripts/get.sh __local__ __install_only__
```

!> `./get.sh __local__` is installed to `~/.local/xmake`, and then loaded by `source ~/.xmake/profile`, so after the installation, the current terminal fails to execute xmake, If the prompt is not found, manually execute `source ~/.xmake/profile`, and the next time you open the terminal, you don't need it.

### Uninstall

```bash
$ ./scripts/get.sh __uninstall__
```

### Only update the lua script

This developer needs to debug the xmake source locally:

```bash
$ ./scripts/get.sh __local__ __install_only__
```

### Root installation

Xmake is not recommended for root installation, because this is very insecure. If the user has to download the root, if the prompt xmake fails to run, please pass the `--root` parameter as prompted or set `XMAKE_ROOT=y`. The environment variable is forcibly enabled, provided that the user needs to pay attention to the risk of incorrect operating system file files under root.

### Dependency issues

1. If you encounter problems with readline, please install readline-devel or libreadline-dev dependencies. This is optional. It is only needed when the `xmake lua` command executes REPL.
2. If you want to speed up compilation, you can install ccache, xmake will automatically detect and use, which is also optional.

## Other installation methods

!> This is also the source code compilation and installation, but the installation path will be written directly to `/usr/`, which requires root privileges, so unless special circumstances, this installation method is not recommended, it is recommended to use the `./get. Sh __local__` way to install, the installation path of the two installation methods is different, do not mix.

Compile and install via make:

```bash
$ make build; sudo make install
```

Install to other specified directories:

```bash
$ sudo make install prefix=/usr/local
```

Uninstall:

```bash
$ sudo make uninstall
```

## Update Upgrade

Starting with v2.2.3, the `xmake update` command has been added to quickly update and upgrade itself. The default is to upgrade to the latest version. Of course, you can also specify to upgrade or roll back to a version:

```bash
$ xmake update 2.2.4
```

We can also specify an update to the master/dev branch version:

```bash
$ xmake update master
$ xmake update dev
```

Update from the specified git source

```bash
$ xmake update github:xmake-io/xmake#master
$ xmake update gitee:tboox/xmake#dev # gitee mirror
```

If just update the xaake lua script changes, you can add `-s/--scriptonly` to quickly update the lua script.

```bash
$ xmake update -s dev
```

Finally, if we want to uninstall xmake, it is also supported: `xmake update --uninstall`

