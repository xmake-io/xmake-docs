---
title: Xmake Getting Started Tutorial 1, Installation and Updates
tags: [xmake, lua, installation, update]
date: 2019-11-09
author: Ruki
---

Xmake is a lightweight modern C/C++ project build tool based on Lua. Its main features are: easy to use syntax, more readable project maintenance, and a consistent build experience across platforms.

This article mainly explains the installation process of xmake under various platforms.

* [Project Source](https://github.com/xmake-io/xmake)
* [Official Document](https://xmake.io)

## Install the Master version

Usually we only need to install the script with a one-click installation script.

### Using curl

```bash
Bash <(curl -fsSL https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh)
```

### Using wget

```bash
Bash <(wget https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh -O -)
```

### Using powershell

```bash
Invoke-Expression (Invoke-Webrequest 'https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.ps1' -UseBasicParsing).Content
```

Note: If the ps script execution prompt fails, you can try to execute in administrator mode.







## Install Windows version

### Using the installation package

Windows provides a pre-made nsis installation package, we can download the installation package directly from github's Releases download page.

1. Download the windows installation package from [Releases] (https://github.com/xmake-io/xmake/releases)
2. Run the installer xmake-[version].exe

### Using scoop

```bash
Scoop install xmake
```

## MacOS

```bash
$ ruby ​​-e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ brew install xmake
```

or:

1. Download the pkg installation package from [Releases] (https://github.com/xmake-io/xmake/releases)
2. Double click to run

Or install the master version:

```bash
# Install the master version using homebrew
$ brew install xmake --HEAD

# or directly call the shell to download and install
$ bash <(curl -fsSL https://raw.githubusercontent.com/tboox/xmake/master/scripts/get.sh)
```

## Linux

Install on archlinux:

```bash
$ yaourt xmake
```

Or download the deb package to install:

1. Download the deb installation package from [Releases] (https://github.com/xmake-io/xmake/releases)
2. Run: `dpkg -i xmake-xxxx.deb`

## Termux

The latest version of xmake already supports termux well, and we usually only need to execute the above one-click installation script. If it fails, please refer to the following to pull the source code to compile and install.

## Source compilation and installation

### Installation

Note: Remember, xmake is not recommended to install under root, so try not to pull down the source to compile and install!

```bash
$ git clone --recursive https://github.com/xmake-io/xmake.git
$ cd ./xmake
$ ./scripts/get.sh __local__
$ source ~/.xmake/profile
```

If you think the source of github is too slow, you can pull it through gitee's image source: `clone --recursive https://gitee.com/tboox/xmake.git`

Note: Since the current xmake source maintains dependencies via git submodule, you need to add the `--recursive` parameter to pull all submodules at the same time. Please do not download the tar.gz source directly, because github does not automatically package submodules. Code.

If you forget to add `--recursive` when git clone, you can also execute `git submodule update --init` to pull all submodules, for example:

```bash
$ git clone https://github.com/xmake-io/xmake.git
$ cd ./xmake
$ git submodule update --init
$ ./scripts/get.sh __local__
```

Note: `./get.sh __local__` is installed to `~/.local/xmake`, and then loaded by `source ~/.xmake/profile`, so after the installation, the current terminal fails to execute xmake, If the prompt is not found, manually execute `source ~/.xmake/profile`, and the next time you open the terminal, you don't need it.

### Uninstall

```bash
$ ./scripts/get.sh __uninstall__
```

### Just update the installation lua script

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

Note: This is also the source code compilation and installation, but the installation path will be directly written to `/usr/`, which requires root privileges, so unless special circumstances, this installation method is not recommended, it is recommended to use the `./get. Sh __local__` way to install, the installation path of the two installation methods is different, do not mix.

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

If xmake/core hasn't moved, just update the xaake lua script changes, you can add `-s/--scriptonly` to quickly update the lua script.

```bash
$ xmake update -s dev
```

Finally, if we want to uninstall xmake, it is also supported: `xmake update --uninstall`