---
outline: deep
---

# Xrepo CLI

## Introduction

Xrepo is a cross-platform C/C++ package manager based on [Xmake](https://github.com/xmake-io/xmake).

It is based on the runtime provided by xmake, but it is a complete and independent package management program. Compared with package managers such as vcpkg/homebrew, xrepo can provide C/C++ packages for more platforms and architectures at the same time.

And it also supports multi-version semantic selection. In addition, it is also a decentralized distributed repository. It not only provides the official [xmake-repo](https://github.com/xmake-io/xmake-repo) repository, it also supports users to build multiple private repositories.

At the same time, xrepo also supports installing packages from third-party package managers such as vcpkg/homebrew/conan, and provides unified and consistent library link information to facilitate integration and docking with third-party projects.

If you want to know more, please refer to: [Documents](https://xmake.io), [Github](https://github.com/xmake-io/xrepo) and [Gitee](https://gitee.com/tboox/xrepo). You can also [search packages here](https://xmake.microblock.cc).

![](https://github.com/xmake-io/xrepo-docs/raw/master/assets/img/xrepo.gif)

## Installation

We only need to install xmake to use the xrepo command. About the installation of xmake, we can see: [Xmake Installation Document](/guide/quick-start.html#installation).

## Supported platforms

* Windows (x86, x64)
* macOS (i386, x86_64, arm64)
* Linux (i386, x86_64, cross-toolchains, ...)
* *BSD (i386, x86_64)
* Android (x86, x86_64, armeabi, armeabi-v7a, arm64-v8a)
* iOS (armv7, armv7s, arm64, i386, x86_64)
* MSYS (i386, x86_64)
* MinGW (i386, x86_64, arm, arm64)
* Cross Toolchains

## Support distributed repository

In addition to directly retrieving the installation package from the official repository: [xmake-repo](https://github.com/xmake-io/xmake-repo).

We can also add any number of self-built repositories, and even completely isolate the external network, and only maintain the installation and integration of private packages on the company's internal network.

Just use the following command to add your own repository address:

```sh
$ xrepo add-repo myrepo https://github.com/mygroup/myrepo
```

## Seamless integration with xmake project

```lua
add_requires("tbox >1.6.1", "libuv master", "vcpkg::ffmpeg", "brew::pcre2/libpcre2-8")
add_requires("conan::openssl/1.1.1g", {alias = "openssl", optional = true, debug = true})
target("test")
     set_kind("binary")
     add_files("src/*.c")
     add_packages("tbox", "libuv", "vcpkg::ffmpeg", "brew::pcre2/libpcre2-8", "openssl")
```

The following is the overall architecture and compilation process integrated with xmake.

<img src="https://xmake.io/assets/img/index/package_arch.png" width="650px" />

## Get started

### Installation package

#### Basic usage

```sh
$ xrepo install zlib tbox
```

#### Install the specified version package

```sh
$ xrepo install "zlib 1.2.x"
$ xrepo install "zlib >=1.2.0"
```

#### Install the specified platform package

```sh
$ xrepo install -p iphoneos -a arm64 zlib
$ xrepo install -p android [--ndk=/xxx] zlib
$ xrepo install -p mingw [--mingw=/xxx] zlib
$ xrepo install -p cross --sdk=/xxx/arm-linux-musleabi-cross zlib
```

#### Install the debug package

```sh
$ xrepo install -m debug zlib
```

#### Install the package with a dynamic library

```sh
$ xrepo install -k shared zlib
```

#### Install the specified configuration package

```sh
$ xrepo install -f "vs_runtime='MD'" zlib
$ xrepo install -f "regex=true,thread=true" boost
```

#### Install packages from a third-party package manager

```sh
$ xrepo install brew::zlib
$ xrepo install vcpkg::zlib
$ xrepo install conan::zlib/1.2.11
```

### Find the library information of the package

```sh
$ xrepo fetch pcre2
{
  {
    linkdirs = {
      "/usr/local/Cellar/pcre2/10.33/lib"
    },
    links = {
      "pcre2-8"
    },
    defines = {
      "PCRE2_CODE_UNIT_WIDTH=8"
    },
    includedirs = "/usr/local/Cellar/pcre2/10.33/include"
  }
}
```

```sh
$ xrepo fetch --ldflags openssl
-L/Users/ruki/.xmake/packages/o/openssl/1.1.1/d639b7d6e3244216b403b39df5101abf/lib -lcrypto -lssl
```

```sh
$ xrepo fetch --cflags openssl
-I/Users/ruki/.xmake/packages/o/openssl/1.1.1/d639b7d6e3244216b403b39df5101abf/include
```

```sh
$ xrepo fetch -p [iphoneos|android] --cflags "zlib 1.2.x"
-I/Users/ruki/.xmake/packages/z/zlib/1.2.11/df72d410e7e14391b1a4375d868a240c/include
```

```sh
$ xrepo fetch --cflags --ldflags conan::zlib/1.2.11
-I/Users/ruki/.conan/data/zlib/1.2.11/_/_/package/f74366f76f700cc6e991285892ad7a23c30e6d47/include -L/Users/ruki/.conan/data/zlib/1.2.11/_/_/package/f74366f76f700cc6e991285892ad7a23c30e6d47/lib -lz
```

### Export the installed packages

xrepo can quickly export installed packages, including corresponding library files, header files, etc.

```sh
$ xrepo export -o /tmp/output zlib
```

### Search supported packages

```sh
$ xrepo search zlib "pcr*"
    zlib:
      -> zlib: A Massively Spiffy Yet Delicately Unobtrusive Compression Library (in xmake-repo)
    pcr*:
      -> pcre2: A Perl Compatible Regular Expressions Library (in xmake-repo)
      -> pcre: A Perl Compatible Regular Expressions Library (in xmake-repo)
```

### Show package environment information

```sh
$ xrepo env --show luajit
{
   OLDPWD = "/mnt/tbox",
   HOME = "/home/ruki",
   PATH = "/home/ruki/.xmake/packages/l/luajit/2.1.0-beta3/fbac76d823b844f0b91abf3df0a3bc61/bin:/tmp:/tmp/arm-linux-musleabi-cross/bin:~/.local/bin: /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
   TERM = "xterm",
   PWD = "/mnt/xmake",
   XMAKE_PROGRAM_DIR = "/mnt/xmake/xmake",
   HOSTNAME = "e6edd61ff1ab",
   LD_LIBRARY_PATH = "/home/ruki/.xmake/packages/l/luajit/2.1.0-beta3/fbac76d823b844f0b91abf3df0a3bc61/lib",
   SHLVL = "1",
   _ = "/mnt/xmake/scripts/xrepo.sh"
}
```

### Package virtual environment

#### Enter the virtual environment

We can customize some package configurations by adding the xmake.lua file in the current directory, and then enter the specific package virtual environment.

```lua
add_requires("zlib 1.2.11")
add_requires("python 3.x", "luajit")
```

```sh
$ xrepo env shell
> python --version
> luajit --version
```

We can also configure and load the corresponding toolchain environment in xmake.lua, for example, load the VS compilation environment.

```lua
set_toolchains("msvc")
```

#### Manage virtual environments

We can use the following command to register the specified virtual environment configuration globally to the system for quick switching.

```sh
$ xrepo env --add /tmp/base.lua
```

At this time, we have saved a global virtual environment called base, and we can view it through the list command.

```sh
$ xrepo env --list
/Users/ruki/.xmake/envs:
  -base
envs(1) found!
```

We can also delete it.

```sh
$ xrepo env --remove base
```

#### Switch global virtual environment

If we register multiple virtual environments, we can also switch them quickly.

```sh
$ xrepo env -b base shell
> python --version
```

Or directly load the specified virtual environment to run specific commands

```sh
$ xrepo env -b base python --version
```

`xrepo env -b/--bind` is to bind the specified virtual environment. For more details, see: [#1762](https://github.com/xmake-io/xmake/issues/1762)

#### Quick switching of temporary virtual environments

Not only can we manage switching environments by configuring environment configuration files such as `myenv.lua`, but we can also specify a list of environment packages to bind to on the command line on an ad hoc basis, allowing for quick switching without any configuration.

For example, if we want to enter an environment with python 3.0, luajit and cmake, all we need to do is to execute

```sh
$ xrepo env -b "python 3.x,luajit,cmake" shell
[python,luajit,cmake] $ python --version
Python 3.10.6
[python,luajit,cmake] $ cmake --version
cmake version 3.25.3
````

Xmake will automatically install the dependencies and open a new shell environment, which will also have a prompt on the left side of the terminal.

If we want to exit the current environment, we simply need to run

```sh
[python,luajit,cmake] $ xrepo env quit
$
```

### Show the given package information

```sh
$ xrepo info zlib
The package info of project:
    require(zlib):
      -> description: A Massively Spiffy Yet Delicately Unobtrusive Compression Library
      -> version: 1.2.11
      -> urls:
         -> http://zlib.net/zlib-1.2.11.tar.gz
            -> c3e5e9fdd5004dcb542feda5ee4f0ff0744628baf8ed2dd5d66f8ca1197cb1a1
         -> https://downloads.sourceforge.net/project/libpng/zlib/1.2.11/zlib-1.2.11.tar.gz
            -> c3e5e9fdd5004dcb542feda5ee4f0ff0744628baf8ed2dd5d66f8ca1197cb1a1
      -> repo: xmake-repo https://gitee.com/tboox/xmake-repo.git master
      -> cachedir: /Users/ruki/.xmake/cache/packages/2010/z/zlib/1.2.11
      -> installdir: /Users/ruki/.xmake/packages/z/zlib/1.2.11/d639b7d6e3244216b403b39df5101abf
      -> searchdirs:
      -> searchnames: zlib-1.2.11.tar.gz
      -> fetchinfo: 1.2.11, system
          -> version: 1.2.11
          -> links: z
          -> linkdirs: /usr/local/Cellar/zlib/1.2.11/lib
          -> includedirs: /usr/local/Cellar/zlib/1.2.11/include
      -> platforms: iphoneos, mingw@windows, macosx, mingw@linux,macosx, android@linux,macosx, windows, linux
      -> requires:
         -> plat: macosx
         -> arch: x86_64
         -> configs:
            -> debug: false
            -> vs_runtime: MT
            -> shared: false
      -> configs:
      -> configs (builtin):
         -> debug: Enable debug symbols. (default: false)
         -> shared: Enable shared library. (default: false)
         -> cflags: Set the C compiler flags.
         -> cxflags: Set the C/C++ compiler flags.
         -> cxxflags: Set the C++ compiler flags.
         -> asflags: Set the assembler flags.
         -> vs_runtime: Set vs compiler runtime. (default: MT)
            -> values: {"MT","MD"}
```

### Download package source code

We can use the `xrepo download` command to only download the source code of the specified package without installing it.

```sh
$ xrepo download zlib
$ xrepo download "zlib 2.x"
```

The default download directory is in the `packages` subdirectory of the current directory. We can also modify the download directory through the `-o outputdir` parameter.

```sh
$ xrepo download -o /tmp zlib
```
