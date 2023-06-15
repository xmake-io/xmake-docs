## Master

!> Note! Xmake is not recommended to install under root!

#### via curl

```bash
curl -fsSL https://xmake.io/shget.text | bash
```

If you want to install a specific version and branch, you can append the version number and branch parameters later

```bash
curl -fsSL https://xmake.io/shget.text | bash -s dev
curl -fsSL https://xmake.io/shget.text | bash -s v2.7.7
```

#### via wget

```bash
wget https://xmake.io/shget.text -O - | bash
```

#### via powershell

```powershell
Invoke-Expression (Invoke-Webrequest 'https://xmake.io/psget.text' -UseBasicParsing).Content
```

If you want to install a specific version and branch, you can append the version number and branch parameters later

```powershell
Invoke-Expression (Invoke-Webrequest 'https://xmake.io/psget.text' -UseBasicParsing).Content dev
Invoke-Expression (Invoke-Webrequest 'https://xmake.io/psget.text' -UseBasicParsing).Content v2.7.7
```

!> If the ps script execution prompt fails, you can try to execute in administrator mode.

## Windows

### via installer

1. Download the Xmake windows installer from [Releases](https://github.com/xmake-io/xmake/releases)
2. Run xmake-[version].[win32|win64].exe

!> Releases/xmake-[version].[win32|win64].zip has not installer, we need unzip it and add PATH environment variables by ourself.

In addition, the installation package with `xmake-tinyc-xxx.exe`, which integrates the tinyc compiler environment, and comes with libc and winapi header files. By installing this package, you can compile c programs normally without msvc.
This is very useful for users who want to write some c tests or algorithm codes temporarily, but don't want to install msvc, but the installation package will be slightly larger than 2-3M.

### via scoop

```bash
scoop install xmake
```

### via winget

```bash
winget install xmake
```

## Msys/Mingw

### mingw64

```bash
pacman -Sy mingw-w64-x86_64-xmake
```

### mingw32

```bash
pacman -Sy mingw-w64-i686-xmake
```

## MacOS

```bash
brew install xmake
```

## Archlinux

```bash
sudo pacman -Sy xmake
```

## Ubuntu

### via apt

```bash
sudo add-apt-repository ppa:xmake-io/xmake
sudo apt update
sudo apt install xmake
```

## Fedora/RHEL/OpenSUSE/CentOS

```bash
sudo dnf copr enable waruqi/xmake
sudo dnf install xmake
```

## Gentoo

1. Refer to [here](https://wiki.gentoo.org/wiki/Project:GURU/Information_for_End_Users) to add GURU to your system repository
2. Install dev-util/xmake

```bash
sudo emerge -a --autounmask dev-util/xmake
```

## Other Linux

Download xmake `xmake-x.x.x.gz.run` install package from [Releases](https://github.com/xmake-io/xmake/releases) 

```bash
sudo chmod 777 ./xmake-x.x.x.gz.run
./xmake-x.x.x.gz.run
```

## FreeBSD

We need [source compilation and installation](#source-compilation-and-installation) and use `gmake` instead of make.

## Termux (Android)

```bash
pkg install xmake
```

## Source compilation and installation
 
### Installation

!> Note! Xmake is not recommended to install under root!

```bash
git clone --recursive https://github.com/xmake-io/xmake.git
cd ./xmake
# On macOS, you may need to run: export SDKROOT=$(xcrun --sdk macosx --show-sdk-path)
./configure
make
./scripts/get.sh __local__ __install_only__
source ~/.xmake/profile
```

If you think the source of github is too slow, you can pull it through the mirror source of gitee or gitlab: 

```bash
git clone --recursive https://gitee.com/tboox/xmake.git
git clone --recursive https://gitlab.com/tboox/xmake.git
```

!> Since the current Xmake source maintains dependencies via git submodule, it is necessary to add the `--recursive` parameter to pull all submodules at the same time. Please do not download the tar.gz source directly, because github does not automatically package submodules. Code.

If you forget to add `--recursive` when git clone, you can also execute `git submodule update --init` to pull all submodules, for example:

```bash
git clone https://github.com/xmake-io/xmake.git
cd ./xmake
git submodule update --init
./configure
make
./scripts/get.sh __local__ __install_only__
```

!> `./get.sh __local__` is installed to `~/.local/xmake`, and then loaded by `source ~/.xmake/profile`, so after the installation, the current terminal fails to execute Xmake, If the prompt is not found, manually execute `source ~/.xmake/profile`, and the next time you open the terminal, you don't need it.

### Source compilation in Windows platform

```bash
git clone --recursive https://github.com/xmake-io/xmake.git
cd ./xmake/core
xmake
```

### Only update the lua script

This developer needs to debug the Xmake source locally:

```bash
./scripts/get.sh __local__ __install_only__
```

### Root installation

Xmake is not recommended for root installation, because this is very insecure. If the user has to download the root, if the prompt Xmake fails to run, please pass the `--root` parameter as prompted or set `XMAKE_ROOT=y`. The environment variable is forcibly enabled, provided that the user needs to pay attention to the risk of incorrect operating system file files under root.

### Dependency issues

1. If you encounter problems with readline, please install readline-devel or libreadline-dev dependencies. This is optional. It is only needed when the `xmake lua` command executes REPL.
2. If you want to speed up compilation, you can install ccache, Xmake will automatically detect and use, which is also optional.

## Other installation methods

!> This is also the source code compilation and installation, but the installation path will be written directly to `/usr/`, which requires root privileges, so unless special circumstances, this installation method is not recommended, it is recommended to use the `./get. Sh __local__` way to install, the installation path of the two installation methods is different, do not mix.

Compile and install via make:

```bash
./configure
make
sudo make install
```

Install to other specified directories:

```bash
sudo make install PREFIX=/usr/local
```

## Update Upgrade

Starting with v2.2.3, the `xmake update` command has been added to quickly update and upgrade itself. The default is to upgrade to the latest version. Of course, you can also specify to upgrade or roll back to a version:

```bash
xmake update 2.7.1
```

We can also specify an update to the master/dev branch version:

```bash
xmake update master
xmake update dev
```

Update from the specified git source

```bash
xmake update github:xmake-io/xmake#master
xmake update gitee:tboox/xmake#dev # gitee mirror
```

If just update the xaake lua script changes, you can add `-s/--scriptonly` to quickly update the lua script.

```bash
xmake update -s dev
```

Finally, if we want to uninstall Xmake, we're sorry to see you go! Still, it is supported: `xmake update --uninstall`.
