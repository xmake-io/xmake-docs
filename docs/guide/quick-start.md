---
outline: deep
---

# Quick Start

## Installation

::: tip NOTE
Xmake is not recommended for root installation, because this is very insecure. If you must install as root and Xmake fails to run, please pass the `--root` parameter as prompted or set `XMAKE_ROOT=y`. The environment variable is forcibly enabled, but please be aware of the risk of operating system file errors under root.
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

If you want to install a specific version or branch, you can append the version number or branch parameter at the end

```sh
curl -fsSL https://xmake.io/shget.text | bash -s dev
curl -fsSL https://xmake.io/shget.text | bash -s v2.7.7
& ([ScriptBlock]::Create((irm https://xmake.io/psget.text))) -version 2.7.7
```

::: tip NOTE
If the ps script execution prompt fails, you can try to execute it in administrator mode.
:::

### Windows

1. Download the Xmake windows installer from [Releases](https://github.com/xmake-io/xmake/releases)
2. Run xmake-[version].[win32|win64].exe

::: tip NOTE
Releases/xmake-[version].[win32|win64].zip does not have an installer. We need to unzip it and add the PATH environment variable ourselves.
:::

In addition, the installation package with `xmake-tinyc-xxx.exe` integrates the tinyc compiler environment and comes with libc and winapi header files. By installing this package, you can compile C programs without MSVC.
This is very useful for users who want to write some C tests or algorithm code temporarily, but don't want to install MSVC. However, the installation package will be slightly larger (by 2-3MB).

::: code-group

```sh [scoop]
scoop install xmake
```

```sh [winget]
winget install xmake
```
:::

### Msys/Mingw

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

### Linux distributions

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

1. Refer to [here](https://wiki.gentoo.org/wiki/Project:GURU/Information_for_End_Users) to add GURU to your system repository
2. Install dev-util/xmake

```sh
sudo emerge -a --autounmask dev-util/xmake
```

### Other Linux

Download xmake `xmake-x.x.x.gz.run` install package from [Releases](https://github.com/xmake-io/xmake/releases)

```sh
sudo chmod 777 ./xmake-x.x.x.gz.run
./xmake-x.x.x.gz.run
```

### FreeBSD

Due to package name conflicts, only xmake-io can be used as the package name.

```sh
pkg install xmake-io
```

### Termux (Android)

```sh
pkg install xmake
```

### Bundle package

If you don't want to install, we also provide another Bundle packaging format, which does not require user installation, a single executable file, can be run and used after downloading, and is easy to distribute.

It will build all Lua scripts into the Xmake executable file, without the need for additional installation and configuration of any environment variables.

We can get them from [Releases](https://github.com/xmake-io/xmake/releases), and there are currently some Bundle packages as follows.

```
xmake-bundle-v2.9.8.arm64.exe
xmake-bundle-v2.9.8.cosmocc
xmake-bundle-v2.9.8.linux.x86_64
xmake-bundle-v2.9.8.macos.arm64
xmake-bundle-v2.9.8.macos.x86_64
xmake-bundle-v2.9.8.win32.exe
xmake-bundle-v2.9.8.win64.exe
```

Among them, the package with the `.cosmocc` suffix provides the ability to run across platforms, but support for Windows is still relatively weak, so it is not recommended to use it on Windows.

The others are single executable files for specific platforms, and users can download and use them as needed according to their own systems.

### Source compilation and installation

#### Download source code

```sh
git clone --recursive https://github.com/xmake-io/xmake.git
cd ./xmake
```

If you think the source from GitHub is too slow, you can clone it from the mirror source on Gitee or GitLab:

```sh
git clone --recursive https://gitee.com/tboox/xmake.git
git clone --recursive https://gitlab.com/tboox/xmake.git
```

::: tip NOTE
Since the current Xmake source maintains dependencies via git submodule, it is necessary to add the `--recursive` parameter to pull all submodules at the same time. Please do not download the tar.gz source directly, because GitHub does not automatically package submodules.
:::

If you forget to add `--recursive` when cloning, you can also execute `git submodule update --init` to pull all submodules, for example:

```sh
git submodule update --init
```

#### Build and install

::: code-group

```sh [Linux]
./configure
make -j4
./scripts/get.sh __local__ __install_only__
source ~/.xmake/profile
```

```sh [windows]
cd ./core
xmake
```

:::


::: tip NOTE
`./get.sh __local__` is installed to `~/.local/xmake`, and then loaded by `source ~/.xmake/profile`. So after installation, if the current terminal fails to execute Xmake, and the prompt says it is not found, manually execute `source ~/.xmake/profile`. The next time you open the terminal, you won't need to do this again.

If you encounter problems with readline, please install the readline-devel or libreadline-dev dependencies. This is optional and only needed when the `xmake lua` command executes REPL.
:::

### Update and Upgrade

Starting with v2.2.3, the `xmake update` command was added to quickly update and upgrade itself. By default, it upgrades to the latest version. Of course, you can also specify a version to upgrade or roll back to:

```sh
xmake update 2.7.1
```

You can also specify an update to the master/dev branch version:

```sh
xmake update master
xmake update dev
```

Update from a specified git source

```sh
xmake update github:xmake-io/xmake#master
xmake update gitee:tboox/xmake#dev # gitee mirror
```

If you just want to update the xmake lua script changes, you can add `-s/--scriptonly` to quickly update the lua script.

```sh
xmake update -s dev
```

Finally, if you want to uninstall Xmake, we're sorry to see you go! Still, it is supported: `xmake update --uninstall`.

## Create Project

```sh
$ xmake create hello
```

And xmake will generate some files for a C++ language project:

```
hello
├── src
│   └─main.cpp
└── xmake.lua
```

It is a simple console program that only prints `hello xmake!`

The content of `xmake.lua` is very simple:

```lua [xmake.lua]
add_rules("mode.debug", "mode.release")

target("hello")
    set_kind("binary")
    add_files("src/*.cpp")
```

## Build Project

```sh
$ cd hello
$ xmake
```

## Run Program

```sh
$ xmake run
```

## Debug Program

To debug the hello program, you need to change to debug mode and build it.

```sh
$ xmake config -m debug
$ xmake
```

Then run the following command to debug the target program.

```sh
$ xmake run -d hello
```

It will start the debugger (e.g. lldb, gdb, windbg, vsjitdebugger, ollydbg, etc.) to load your program.

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

To study more debug commands, please see the [GDB to LLDB command map](https://lldb.llvm.org/use/map.html)

If you want to use a specific debugger, try

```sh
$ xmake f --debugger=gdb
$ xmake run -d hello
```

## What's Next?

Continue with the guide: [Create Project](/guide/basic-commands/create-project)
Check out the examples: [Examples](/examples/cpp/basic)
Check out the API reference: [API Reference](/api/description/specification)

