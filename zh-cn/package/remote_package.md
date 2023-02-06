
这个在2.2.2版本后已经初步支持，用法上更加的简单，只需要设置对应的依赖包就行了，例如：

```lua
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("tbox", "libpng", "zlib")
```

上面的`add_requires`用于描述当前项目需要的依赖包，而`add_packages`用于应用依赖包到test目标，只有设置这个才会自动追加links, linkdirs, includedirs等设置。

然后直接执行编译即可：

```console
$ xmake
```

xmake会去远程拉取相关源码包，然后自动编译安装，最后编译项目，进行依赖包的链接，具体效果见下图：

<img src="/assets/img/index/package_manage.png" width="80%" />

关于包依赖管理的更多相关信息和进展见相关issues：[Remote package management](https://github.com/xmake-io/xmake/issues/69)

## 目前支持的特性

* 语义版本支持，例如：">= 1.1.0 < 1.2", "~1.6", "1.2.x", "1.*"
* 提供官方包仓库、自建私有仓库、项目内置仓库等多仓库管理支持
* 跨平台包编译集成支持（不同平台、不同架构的包可同时安装，快速切换使用）
* debug依赖包支持，实现源码调试

## 依赖包处理机制

这里我们简单介绍下整个依赖包的处理机制：

<img src="/assets/img/index/package_arch.png" width="80%" />

1. 优先检测当前系统目录、第三方包管理下有没有存在指定的包，如果有匹配的包，那么就不需要下载安装了 （当然也可以设置不使用系统包）
2. 检索匹配对应版本的包，然后下载、编译、安装（注：安装在特定xmake目录，不会干扰系统库环境）
3. 编译项目，最后自动链接启用的依赖包

## 快速上手

新建一个依赖tbox库的空工程：

```console
$ xmake create -t console_tbox test
$ cd test
```

执行编译即可，如果当前没有安装tbox库，则会自动下载安装后使用：

```console
$ xmake
```

切换到iphoneos平台进行编译，将会重新安装iphoneos版本的tbox库进行链接使用：

```console
$ xmake f -p iphoneos
$ xmake
```

切换到android平台arm64-v8a架构编译：

```console
$ xmake f -p android [--ndk=~/android-ndk-r16b]
$ xmake
```

## 语义版本设置

xmake的依赖包管理是完全支持语义版本选择的，例如："~1.6.1"，对于语义版本的具体描述见：[https://semver.org/](https://semver.org/)

一些语义版本写法：

```lua
add_requires("tbox 1.6.*", "pcre 1.3.x", "libpng ^1.18")
add_requires("libpng ~1.16", "zlib 1.1.2 || >=1.2.11 <1.3.0")
```

目前xmake使用的语义版本解析器是[uael](https://github.com/uael)贡献的[sv](https://github.com/uael/sv)库，里面也有对版本描述写法的详细说明，可以参考下：[版本描述说明](https://github.com/uael/sv#versions)

当然，如果我们对当前的依赖包的版本没有特殊要求，那么可以直接这么写：

```lua
add_requires("tbox", "libpng", "zlib")
```

这会使用已知的最新版本包，或者是master分支的源码编译的包，如果当前包有git repo地址，我们也能指定特定分支版本：

```lua
add_requires("tbox master")
add_requires("tbox dev")
```

## 额外的包信息设置

### 可选包设置

如果指定的依赖包当前平台不支持，或者编译安装失败了，那么xmake会编译报错，这对于有些必须要依赖某些包才能工作的项目，这是合理的。
但是如果有些包是可选的依赖，即使没有也可以正常编译使用的话，可以设置为可选包：

```lua
add_requires("tbox", {optional = true})
```

### 禁用系统库

默认的设置，xmake会去优先检测系统库是否存在（如果没设置版本要求），如果用户完全不想使用系统库以及第三方包管理提供的库，那么可以设置：

```lua
add_requires("tbox", {system = false})
```

### 使用调试版本的包

如果我们想同时源码调试依赖包，那么可以设置为使用debug版本的包（当然前提是这个包支持debug编译）：

```lua
add_requires("tbox", {debug = true})
```

如果当前包还不支持debug编译，可在仓库中提交修改编译规则，对debug进行支持，例如：

```lua
package("openssl")
    on_install("linux", "macosx", function (package)
        os.vrun("./config %s --prefix=\"%s\"", package:debug() and "--debug" or "", package:installdir())
        os.vrun("make -j4")
        os.vrun("make install")
    end)
```

### 传递额外的编译信息到包

某些包在编译时候有各种编译选项，我们也可以传递进来，当然包本身得支持：

```lua
add_requires("tbox", {configs = {small = true}})
```

传递`--small=true`给tbox包，使得编译安装的tbox包是启用此选项的。

我们可以通过在工程目录中执行：`xmake require --info tbox` 来获取指定包所有的可配置参数列表和取值说明。

比如：

```console
xmake require --info spdlog
    require(spdlog):
      -> requires:
         -> plat: macosx
         -> arch: x86_64
         -> configs:
            -> header_only: true
            -> shared: false
            -> vs_runtime: MT
            -> debug: false
            -> fmt_external: true
            -> noexcept: false
      -> configs:
         -> header_only: Use header only (default: true)
         -> fmt_external: Use external fmt library instead of bundled (default: false)
         -> noexcept: Compile with -fno-exceptions. Call abort() on any spdlog exceptions (default: false)
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

其中，configs里面就是spdlog包自身提供的可配置参数，而下面带有builtin的configs部分，是所有包都会有的内置配置参数。
最上面requires部分，是项目当前配置值。

!> `vs_runtime`是用于msvc下vs runtime的设置，v2.2.9版本中，还支持所有static依赖包的自动继承，也就是说spdlog如果设置了MD，那么它依赖的fmt包也会自动继承设置MD。

可以看到，我们已经能够很方便的定制化获取需要的包，但是每个包自身也许有很多依赖，如果这些依赖也要各种定制化配置，怎么办？

可以通过 `add_requireconfs` 去重写内部依赖包的配置参数。

### 安装任意版本的包

默认情况下，`add_requires("zlib >1.2.x")` 只能选择到 `xmake-repo` 仓库中存在的包版本，因为每个版本的包，它们都会有一个sha256的校验值，用于包的完整性校验。

因此，未知版本的包不存在校验值，xmake 默认是不让选择使用的，这并不安全。

那如果，我们需要的包版本无法选择使用怎么办呢？有两种方式，一种是提交一个 pr 给 [xmake-repo](https://github.com/xmake-io/xmake-repo)，增加指定包的新版本以及对应的 sha256，例如：

```lua
package("zlib")
    add_versions("1.2.10", "8d7e9f698ce48787b6e1c67e6bff79e487303e66077e25cb9784ac8835978017")
    add_versions("1.2.11", "c3e5e9fdd5004dcb542feda5ee4f0ff0744628baf8ed2dd5d66f8ca1197cb1a1")
```

另外，还有一种方式，就是用户传递 `{verify = false}` 配置给 `add_requires`，强制忽略包的文件完整性校验，这样就不需要 sha256 值，因此就可以安装任意版本的包。

当然，这也会存在一定的安全性以及包不完整的风险，这就需要用户自己去选择评估了。

```lua
add_requires("zlib 1.2.11", {verify = false})
```

### 禁用外部头文件搜索路径

默认情况下，通过 `add_requires` 安装的包会采用 `-isystem` 或者 `/external:I` 来引用里面的头文件路径，这通常能够避免一些包头文件引入的不可修改的警告信息，
但是，我们还是可以通过设置 `{external = false}` 来禁用外部头文件，切回 `-I` 的使用。

默认启用了 external 外部头文件的编译 flags 如下：

```console
-isystem /Users/ruki/.xmake/packages/z/zlib/1.2.11/d639b7d6e3244216b403b39df5101abf/include
```

手动关闭 external 外部头文件的编译 flags 如下：

```lua
add_requires("zlib 1.x", {external = false})
```

```console
-I /Users/ruki/.xmake/packages/z/zlib/1.2.11/d639b7d6e3244216b403b39df5101abf/include
```

## 第三方依赖包安装

2.2.5版本之后，xmake支持对对第三方包管理器里面的依赖库安装支持，例如：conan，brew, vcpkg等

### 添加 homebrew 的依赖包

```lua
add_requires("brew::zlib", {alias = "zlib"})
add_requires("brew::pcre2/libpcre2-8", {alias = "pcre2"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("pcre2", "zlib")
```

### 添加 vcpkg 的依赖包

```lua
add_requires("vcpkg::zlib", "vcpkg::pcre2")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("vcpkg::zlib", "vcpkg::pcre2")
```

我们也可以加个包别名，简化对`add_packages`的使用：

```lua
add_requires("vcpkg::zlib", {alias = "zlib"})
add_requires("vcpkg::pcre2", {alias = "pcre2"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "pcre2")
```

如果 vcpkg 包带有可选特性，我们也可以直接使用 vcpkg 的语法格式 `packagename[feature1,feature2]` 来安装包。

例如：

```lua
add_requires("vcpkg::boost[core]")
```

v2.6.3 之后，xmake 支持 vcpkg 新的清单模式，通过它，我们就能支持 vcpkg 包的版本选择，例如：

```lua
add_requires("vcpkg::zlib 1.2.11+10")
add_requires("vcpkg::fmt >=8.0.1", {configs = {baseline = "50fd3d9957195575849a49fa591e645f1d8e7156"}})
add_requires("vcpkg::libpng", {configs = {features = {"apng"}}})

target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("vcpkg::zlib", "vcpkg::fmt", "vcpkg::libpng")
```

v2.6.8 之后，还可以额外配置私有仓库，仅清单模式有效。

```lua
local registries = {
    {
        kind = "git",
        repository = "https://github.com/SakuraEngine/vcpkg-registry",
        baseline = "e0e1e83ec66e3c9b36066f79d133b01eb68049f7",
        packages = {
            "skrgamenetworkingsockets"
        }
    }
}
add_requires("vcpkg::skrgamenetworkingsockets >=1.4.0+1", {configs = {registries = registries}})
```

### 添加 conan 的依赖包

```lua
add_requires("conan::zlib/1.2.11", {alias = "zlib", debug = true})
add_requires("conan::openssl/1.1.1g", {alias = "openssl",
    configs = {options = "OpenSSL:shared=True"}})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("openssl", "zlib")
```

执行xmake进行编译后：

```console
ruki:test_package ruki$ xmake
checking for the architecture ... x86_64
checking for the Xcode directory ... /Applications/Xcode.app
checking for the SDK version of Xcode ... 10.14
note: try installing these packages (pass -y to skip confirm)?
  -> conan::zlib/1.2.11 (debug)
  -> conan::openssl/1.1.1g
please input: y (y/n)

  => installing conan::zlib/1.2.11 .. ok
  => installing conan::openssl/1.1.1g .. ok

[  0%]: cache compiling.release src/main.c
[100%]: linking.release test
```

自定义 conan/settings 配置：

```lua
add_requires("conan::poco/1.10.0", {alias = "poco",
    configs = {settings = {"compiler=gcc", "compiler.libcxx=libstdc++11"}}})
```

其他一些 conan 相关配置项：

```
{
    build          = {description = "use it to choose if you want to build from sources.", default = "missing", values = {"all", "never", "missing", "outdated"}},
    remote         = {description = "Set the conan remote server."},
    options        = {description = "Set the options values, e.g. OpenSSL:shared=True"},
    imports        = {description = "Set the imports for conan."},
    settings       = {description = "Set the build settings for conan."},
    build_requires = {description = "Set the build requires for conan.", default = "xmake_generator/0.1.0@bincrafters/testing"}
}
```

### 添加 conda 的依赖包

```lua
add_requires("conda::zlib 1.2.11", {alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

### 添加 pacman 的依赖包

我们既支持 archlinux 上的 pacman 包安装和集成，也支持 msys2 上 pacman 的 mingw x86_64/i386 包安装和集成。

```lua
add_requires("pacman::zlib", {alias = "zlib"})
add_requires("pacman::libpng", {alias = "libpng"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib", "libpng")
```

archlinux 上只需要：

```console
xmake
```

msys2 上安装 mingw 包，需要指定到 mingw 平台：

```console
xmake f -p mingw -a [x86_64|i386]
xmake
```

### 添加 clib 的依赖包

clib是一款基于源码的依赖包管理器，拉取的依赖包是直接下载对应的库源码，集成到项目中编译，而不是二进制库依赖。

其在xmake中集成也很方便，唯一需要注意的是，还需要自己添加上对应库的源码到xmake.lua，例如：

```lua
add_requires("clib::clibs/bytes@0.0.4", {alias = "bytes"})

target("test")
    set_kind("binary")
    add_files("clib/bytes/*.c")
    add_files("src/*.c")
    add_packages("bytes")
```

### 添加 dub/dlang 的依赖包

xmake 也支持 dlang 的 dub 包管理器，集成 dlang 的依赖包来使用。

```lua
add_rules("mode.debug", "mode.release")

add_requires("dub::log 0.4.3", {alias = "log"})
add_requires("dub::dateparser", {alias = "dateparser"})
add_requires("dub::emsi_containers", {alias = "emsi_containers"})
add_requires("dub::stdx-allocator", {alias = "stdx-allocator"})
add_requires("dub::mir-core", {alias = "mir-core"})

target("test")
    set_kind("binary")
    add_files("src/*.d")
    add_packages("log", "dateparser", "emsi_containers", "stdx-allocator", "mir-core")
```

### 添加 ubuntu/apt 的依赖包

v2.5.4 之后版本支持使用 apt 集成依赖包，也会自动查找 ubuntu 系统上已经安装的包。

```lua
add_requires("apt::zlib1g-dev", {alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

### 添加 gentoo/portage 的依赖包

v2.5.4 之后版本支持使用 Portage 集成依赖包，也会自动查找 Gentoo 系统上已经安装的包。

```lua
add_requires("portage::libhandy", {alias = "libhandy"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libhandy")
```

### 添加 nimble 的依赖包

v2.5.8 之后支持集成 nimble 包管理器中的包，但是目前仅用于 nim 项目，因为它并没有提供二进制的包，而是直接安装的 nim 代码包。

```lua
add_requires("nimble::zip >1.3")

target("test")
    set_kind("binary")
    add_files("src/main.nim")
    add_packages("nimble::zip")
```

### 添加 cargo 的依赖包

Cargo 依赖包主要给 rust 项目集成使用，例如：

```lua
add_rules("mode.release", "mode.debug")
add_requires("cargo::base64 0.13.0")
add_requires("cargo::flate2 1.0.17", {configs = {features = "zlib"}})

target("test")
    set_kind("binary")
    add_files("src/main.rs")
    add_packages("cargo::base64", "cargo::flate2")
```

不过，我们也可以在 C++ 中通过 cxxbridge 的方式，调用 Rust 库接口，来变相复用所有的 Rust 包。

完整例子见：[Call Rust in C++](https://github.com/xmake-io/xmake/tree/dev/tests/projects/rust/cxx_call_rust_library)

## 使用自建私有包仓库

如果需要的包不在官方仓库[xmake-repo](https://github.com/xmake-io/xmake-repo)中，我们可以提交贡献代码到仓库进行支持。
但如果有些包仅用于个人或者私有项目，我们可以建立一个私有仓库repo，仓库组织结构可参考：[xmake-repo](https://github.com/xmake-io/xmake-repo)

比如，现在我们有一个一个私有仓库repo：`git@github.com:myrepo/xmake-repo.git`

我们可以通过下面的命令进行仓库添加：

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git [branch]
```

!> [branch]是可选的，我们也可以切换到指定repo分支

或者我们直接写在xmake.lua中：

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git")
```

同样，我们也可以切换到指定repo分支

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git dev")
```

如果我们只是想添加一两个私有包，这个时候特定去建立一个git repo太小题大做了，我们可以直接把包仓库放置项目里面，例如：

```
projectdir
  - myrepo
    - packages
      - t/tbox/xmake.lua
      - z/zlib/xmake.lua
  - src
    - main.c
  - xmake.lua
```

上面myrepo目录就是自己的私有包仓库，内置在自己的项目里面，然后在xmake.lua里面添加一下这个仓库位置：

```lua
add_repositories("my-repo myrepo")
```

这个可以参考[benchbox](https://github.com/xmake-io/benchbox)项目，里面就内置了一个私有仓库。

我们甚至可以连仓库也不用建，直接定义包描述到项目xmake.lua中，这对依赖一两个包的情况还是很有用的，例如：

```lua
package("libjpeg")

    set_urls("http://www.ijg.org/files/jpegsrc.$(version).tar.gz")

    add_versions("v9c", "650250979303a649e21f87b5ccd02672af1ea6954b911342ea491f351ceb7122")

    on_install("windows", function (package)
        os.mv("jconfig.vc", "jconfig.h")
        os.vrun("nmake -f makefile.vc")
        os.cp("*.h", package:installdir("include"))
        os.cp("libjpeg.lib", package:installdir("lib"))
    end)

    on_install("macosx", "linux", function (package)
        import("package.tools.autoconf").install(package)
    end)

package_end()

add_requires("libjpeg")

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libjpeg")
```

关于如何编写自定义包描述规则，详情见：[添加包到仓库](#添加包到仓库)

## 包管理命令使用

包管理命令`$ xmake require` 可用于手动显示的下载编译安装、卸载、检索、查看包信息。

### xrepo 命令

`xmake require` 仅用于当前工程，我们也提供了更加方便的独立 `xrepo` 包管理器命令，来全局对包进行安装，卸载和查找管理。

详细文档见：[Xrepo 命令使用入门](https://xrepo.xmake.io/#/zh-cn/getting_started)

### 安装指定包

```console
$ xmake require tbox
```

安装指定版本包：

```console
$ xmake require tbox "~1.6"
```

强制重新下载安装，并且显示详细安装信息：

```console
$ xmake require -f -v tbox "1.5.x"
```

传递额外的设置信息：

```console
$ xmake require --extra="{debug=true,config={small=true}}" tbox
```

安装debug包，并且传递`small=true`的编译配置信息到包中去。

### 卸载指定包

```console
$ xmake require --uninstall tbox
```

这会完全卸载删除包文件。

### 查看包详细信息

```console
$ xmake require --info tbox
```

### 在当前仓库中搜索包

```console
$ xmake require --search tbox
```

这个是支持模糊搜素以及lua模式匹配搜索的：

```console
$ xmake require --search pcr
```

会同时搜索到pcre, pcre2等包。

### 列举当前已安装的包

```console
$ xmake require --list
```

## 仓库管理命令使用

上文已经简单讲过，添加私有仓库可以用（支持本地路径添加）：

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

v2.2.3开始，支持添加指定分支的repo，例如：

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git dev
```

!> 我们也可以添加本地仓库路径，即使没有git也是可以支持的，用于在本地快速的调试repo中的包。

我们也可以移除已安装的某个仓库：

```console
$ xmake repo --remove myrepo
```

或者查看所有已添加的仓库：

```console
$ xmake repo --list
```

如果远程仓库有更新，可以手动执行仓库更新，来获取更多、最新的包：

```console
$ xmake repo -u
```

## 远程包下载优化

如果由于网络不稳定，导致下载包速度很慢或者下载失败，我们可以通过的下面的一些方式来解决。

### 手动下载

默认xmake会调用curl, wget等工具来下载，用户也可以手动用自己的下载器下载（也可以使用代理），把下载后的包放到自己的目录下，比如: `/download/packages/zlib-v1.0.tar.gz`

然后使用下面的命令，设置包下载的搜索目录：

```console
$ xmake g --pkg_searchdirs="/download/packages"
```

然后重新执行xmake编译时候，xmake会优先从`/download/packages`找寻源码包，然后直接使用，不再自己下载了。

至于找寻的包名是怎样的呢，可以通过下面的命令查看：

```console
$ xmake require --info zlib
-> searchdirs: /download/packages
-> searchnames: zlib-1.2.11.tar.gz
```

我们可以看到对应的搜索目录以及搜索的包名。

### 设置代理

如果觉得手动下载还是麻烦，我们也可以让xmake直接走代理。

```console
$ xmake g --proxy="socks5://127.0.0.1:1086"
$ xmake g --help
    -x PROXY, --proxy=PROXY  Use proxy on given port. [PROTOCOL://]HOST[:PORT]
                                 e.g.
                                 - xmake g --proxy='http://host:port'
                                 - xmake g --proxy='https://host:port'
                                 - xmake g --proxy='socks5://host:port'
```

`--proxy`参数指定代理协议和地址，具体语法可以参考curl的，通常可以支持http, https, socks5等协议，但实际支持力度依赖curl, wget和git，比如wget就不支持socks5协议。

我们可以通过下面的参数指定哪些host走代理，如果没设置，默认全局走代理。

```console
--proxy_hosts=PROXY_HOSTS    Only enable proxy for the given hosts list, it will enable all if be unset,
                             and we can pass match pattern to list:
                                 e.g.
                                 - xmake g --proxy_hosts='github.com,gitlab.*,*.xmake.io'
```

如果设置了hosts列表，那么之后这个列表里面匹配的host才走代理。。

`--proxy_host`支持多个hosts设置，逗号分隔，并且支持基础的模式匹配 *.github.com， 以及其他lua模式匹配规则也支持

如果觉得上面的hosts模式配置还不够灵活，我们也可以走pac的自动代理配置规则：

```console
--proxy_pac=PROXY_PAC    Set the auto proxy configuration file. (default: pac.lua)
                                     e.g.
                                     - xmake g --proxy_pac=pac.lua (in /Users/ruki/.xmake or absolute path)
                                     - function main(url, host)
                                           if host == 'github.com' then
                                                return true
                                           end
                                       end
```

!> 如果有proxy_hosts优先走hosts配置，没有的话才走pac配置。

pac的默认路径：~/.xmake/pac.lua，如果--proxy被设置，并且这个文件存在，就会自动走pac，如果不存在，也没hosts，那就全局生效代理。

也可以手动指定pac全路径

```console
$ xmake g --proxy_pac=/xxxx/xxxxx_pac.lua
```

配置规则描述：

```lua
function main(url, host)
    if host:find("bintray.com") then
        return true
    end
end
```

如果返回true，那么这个url和host就是走的代理，不返回或者返回false，就是不走代理。

这块的具体详情见：https://github.com/xmake-io/xmake/issues/854

!> 另外，除了依赖包下载，其他涉及网络下载的命令也都支持代理，比如：`xmake update`

#### 镜像代理

v2.5.4 之后，pac.lua 配置里面还可以配置镜像代理规则，比如对所有 github.com 域名的访问切到 hub.fastgit.org 域名，实现加速下载包。

```lua
function mirror(url)
     return url:gsub("github.com", "hub.fastgit.org")
end
```

```console
$ xrepo install libpng
> curl https://hub.fastgit.org/glennrp/libpng/archive/v1.6.37.zip -o v1.6.37.zip
```

v2.6.3 之后，xmake 提供了一些内置的镜像可以直接使用，例如 github 的镜像加速：

```console
$ xmake g --proxy_pac=github_mirror.lua
```

我们不用自己编写 pac.lua，就可以直接使用它来加速 github 源的下载。

更多内置镜像可以通过 `xmake g --help` 查看 `--proxy_pac=` 下列表。

## 添加包到仓库

### 仓库包结构

在制作自己的包之前，我们需要先了解下一个包仓库的结构，不管是官方包仓库，还是自建私有包仓库，结构都是相同的：

```
xmake-repo
  - packages
    - t/tbox/xmake.lua
    - z/zlib/xmake.lua
```

通过上面的结构，可以看到每个包都会有个xmake.lua用于描述它的安装规则，并且根据`z/zlib`两级子目录分类存储，方便快速检索。

### 包描述说明

关于包的描述规则，基本上都是在它的xmake.lua里面完成的，这跟项目工程里面的xmake.lua描述很类似，不同的是描述域仅支持`package()`，

不过，在项目xmake.lua里面，也是可以直接添加`package()`来内置包描述的，连包仓库都省了，有时候这样会更加方便。

首先，我们先拿zlib的描述规则，来直观感受下，这个规则可以在[xmake-repo/z/zlib/xmake.lua](https://github.com/xmake-io/xmake-repo/blob/master/packages/z/zlib/xmake.lua)下找到。

```
package("zlib")

    set_homepage("http://www.zlib.net")
    set_description("A Massively Spiffy Yet Delicately Unobtrusive Compression Library")

    set_urls("http://zlib.net/zlib-$(version).tar.gz",
             "https://downloads.sourceforge.net/project/libpng/zlib/$(version)/zlib-$(version).tar.gz")

    add_versions("1.2.10", "8d7e9f698ce48787b6e1c67e6bff79e487303e66077e25cb9784ac8835978017")
    add_versions("1.2.11", "c3e5e9fdd5004dcb542feda5ee4f0ff0744628baf8ed2dd5d66f8ca1197cb1a1")

    on_install("windows", function (package)
        io.gsub("win32/Makefile.msc", "%-MD", "-" .. package:config("vs_runtime"))
        os.vrun("nmake -f win32\\Makefile.msc zlib.lib")
        os.cp("zlib.lib", package:installdir("lib"))
        os.cp("*.h", package:installdir("include"))
    end)

    on_install("linux", "macosx", function (package)
        import("package.tools.autoconf").install(package, {"--static"})
    end)

    on_install("iphoneos", "android@linux,macosx", "mingw@linux,macosx", function (package)
        import("package.tools.autoconf").configure(package, {host = "", "--static"})
        io.gsub("Makefile", "\nAR=.-\n",      "\nAR=" .. (package:build_getenv("ar") or "") .. "\n")
        io.gsub("Makefile", "\nARFLAGS=.-\n", "\nARFLAGS=cr\n")
        io.gsub("Makefile", "\nRANLIB=.-\n",  "\nRANLIB=\n")
        os.vrun("make install -j4")
    end)

    on_test(function (package)
        assert(package:has_cfuncs("inflate", {includes = "zlib.h"}))
    end)
```

这个包规则对windows, linux, macosx, iphoneos，mingw等平台都添加了安装规则，基本上已经做到了全平台覆盖，甚至一些交叉编译平台，算是一个比较典型的例子了。

当然，有些包依赖源码实现力度，并不能完全跨平台，那么只需对它支持的平台设置安装规则即可。

#### set_homepage

设置包所在项目的官方页面地址。

#### set_description

设置包的相关描述信息，一般通过`xmake require --info zlib`查看相关包信息时候，会看到。

#### set_kind

设置包类型，对于依赖库，则不用设置，如果是可执行包，需要设置为binary。

```
package("cmake")

    set_kind("binary")
    set_homepage("https://cmake.org")
    set_description("A cross-platform family of tool designed to build, test and package software")
```

#### set_urls

设置包的源码包或者git仓库地址，跟add_urls不同的是，此接口是覆盖性设置，而add_urls是追加设置，其他使用方式类似，这个根据不同需要来选择。

#### add_urls

添加包的源码包或者git仓库地址，此接口一般跟add_version配对使用，用于设置每个源码包的版本和对应的sha256值。

!> 可以通过添加多个urls作为镜像源，xmake会自动检测优先选用最快的url进行下载，如果下载失败则会尝试其他urls。

```lua
add_urls("https://github.com/protobuf-c/protobuf-c/releases/download/v$(version)/protobuf-c-$(version).tar.gz")
add_versions("1.3.1", "51472d3a191d6d7b425e32b612e477c06f73fe23e07f6a6a839b11808e9d2267")
```

urls里面的`$(version)`内置变量，会根据实际安装时候选择的版本适配进去，而版本号都是从`add_versions`中指定的版本列表中选择的。

如果对于urls里面带有比较复杂的版本串，没有跟add_versions有直接对应关系，则需要通过下面的方式定制化转换下：

```lua
add_urls("https://sqlite.org/2018/sqlite-autoconf-$(version)000.tar.gz",
         {version = function (version) return version:gsub("%.", "") end})

add_versions("3.24.0", "d9d14e88c6fb6d68de9ca0d1f9797477d82fc3aed613558f87ffbdbbc5ceb74a")
add_versions("3.23.0", "b7711a1800a071674c2bf76898ae8584fc6c9643cfe933cfc1bc54361e3a6e49")
```

当然，我们也只可以添加git源码地址：

```lua
add_urls("https://gitlab.gnome.org/GNOME/libxml2.git")
```

如果设置的多个镜像地址对应的源码包sha256是不同的，我们可以通过alias的方式来分别设置

```lua
add_urls("https://ffmpeg.org/releases/ffmpeg-$(version).tar.bz2", {alias = "home"})
add_urls("https://github.com/FFmpeg/FFmpeg/archive/n$(version).zip", {alias = "github"})
add_versions("home:4.0.2", "346c51735f42c37e0712e0b3d2f6476c86ac15863e4445d9e823fe396420d056")
add_versions("github:4.0.2", "4df1ef0bf73b7148caea1270539ef7bd06607e0ea8aa2fbf1bb34062a097f026")
```

我们也可以设置指定的 urls 的 http headers：

```lua
add_urls("https://github.com/madler/zlib/archive/$(version).tar.gz", {
    http_headers = {"TEST1: foo", "TEST2: bar"}
})
```

#### add_versions

用于设置每个源码包的版本和对应的sha256值，具体描述见：[add_urls](#add_urls)

#### add_patches

此接口用于针对源码包，在编译安装前，先打对应设置的补丁包，再对其进行编译，并且可支持同时打多个补丁。

```lua
if is_plat("macosx") then
    add_patches("1.15", "https://raw.githubusercontent.com/Homebrew/patches/9be2793af/libiconv/patch-utf8mac.diff",
                        "e8128732f22f63b5c656659786d2cf76f1450008f36bcf541285268c66cabeab")
end
```

例如，上面的代码，就是针对macosx下编译的时候，打上对应的patch-utf8mac.diff补丁，并且每个补丁后面也是要设置sha256值的，确保完整性。

#### add_links

默认情况下，xmake会去自动检测安装后的库，设置链接关系，但是有时候并不是很准，如果要自己手动调整链接顺序，以及链接名，则可以通过这个接口来设置。

```lua
add_links("mbedtls", "mbedx509", "mbedcrypto")
```

#### add_syslinks

添加一些系统库链接，有些包集成链接的时候，还需要依赖一些系统库，才能链接通过，这个时候可以在包描述里面都附加上去。

```
if is_plat("macosx") then
    add_frameworks("CoreGraphics", "CoreFoundation", "Foundation")
elseif is_plat("windows") then
    add_defines("CAIRO_WIN32_STATIC_BUILD=1")
    add_syslinks("gdi32", "msimg32", "user32")
else
    add_syslinks("pthread")
end
```

#### add_frameworks

添加依赖的系统frameworks链接。

示例见：[add_syslinks](#add_syslinks)

#### add_linkdirs

包的链接库搜索目录也是可以调整的，不过通常都不需要，除非一些库安装完不在prefix/lib下面，而在lib的子目录下，默认搜索不到的话。

#### add_includedirs

添加其他头文件搜索目录。

#### add_defines

可以对集成的包对外输出一些特定的定义选项。

#### add_configs

我们可以通过此接口添加每个包的对外输出配置参数：

```lua
package("pcre2")

    set_homepage("https://www.pcre.org/")
    set_description("A Perl Compatible Regular Expressions Library")

    add_configs("bitwidth", {description = "Set the code unit width.", default = "8", values = {"8", "16", "32"}})

    on_load(function (package)
        local bitwidth = package:config("bitwidth") or "8"
        package:add("links", "pcre2-" .. bitwidth)
        package:add("defines", "PCRE2_CODE_UNIT_WIDTH=" .. bitwidth)
    end)
```

在工程项目里面，我们也可以查看特定包的可配置参数和值列表：

```bash
$ xmake require --info pcre2
The package info of project:
    require(pcre2):
      -> description: A Perl Compatible Regular Expressions Library
      -> version: 10.31
      ...
      -> configs:
         -> bitwidth:
            -> description: Set the code unit width.
            -> values: {"8","16","32"}
            -> default: 8
```

然后在项目里面，启用这些配置，编译集成带有特定配置的包：

```lua
add_requires("pcre2", {configs = {bitwidth = 16}})
```

#### add_extsources

2.5.2 版本开始，我们也新增了 `add_extsources` 和 `on_fetch` 两个配置接口，可以更好的配置 xmake 在安装 C/C++ 包的过程中，对系统库的查找过程。

至于具体背景，我们可以举个例子，比如我们在 [xmake-repo](https://github.com/xmake-io/xmake-repo) 仓库新增了一个 `package("libusb")` 的包。

那么用户就可以通过下面的方式，直接集成使用它：

```lua
add_requires("libusb")
target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libusb")
```

如果用户系统上确实没有安装 libusb，那么 xmake 会自动下载 libusb 库源码，自动编译安装集成，没啥问题。

但如果用户通过 `apt install libusb-1.0` 安装了 libusb 库到系统，那么按理 xmake 应该会自动优先查找用户安装到系统环境的 libusb 包，直接使用，避免额外的下载编译安装。

但是问题来了，xmake 内部通过 `find_package("libusb")` 并没有找打它，这是为什么呢？因为通过 apt 安装的 libusb 包名是 `libusb-1.0`, 而不是 libusb。

我们只能通过 `pkg-config --cflags libusb-1.0` 才能找到它，但是 xmake 内部的默认 find_package 逻辑并不知道 `libusb-1.0` 的存在，所以找不到。

因此为了更好地适配不同系统环境下，系统库的查找，我们可以通过 `add_extsources("pkgconfig::libusb-1.0")` 去让 xmake 改进查找逻辑，例如：

```lua
package("libusb")
    add_extsources("pkgconfig::libusb-1.0")
    on_install(function (package)
        -- ...
    end)
```

另外，我们也可以通过这个方式，改进查找 homebrew/pacman 等其他包管理器安装的包，例如：`add_extsources("pacman::libusb-1.0")`。

#### add_deps

添加包依赖接口，通过配置包之间的依赖关系，我们能够在安装包的同时，自动安装它的所有依赖包。

另外，默认情况下，我们只要配置了依赖关系，cmake/autoconf 就能够自动找到所有依赖包的库和头文件。

当然，如果由于一些特殊原因，导致当前包的 cmake 脚本没能够正常找到依赖包，那么我们也可以通过 `{packagedeps = "xxx"}` 来强行打入依赖包信息。

例如：

```lua
package("foo")
    add_deps("cmake", "bar")
    on_install(function (package)
        local configs = {}
        import("package.tools.cmake").install(package, configs)
    end)
```

foo 包是使用 CMakeLists.txt 维护的，它在安装过程中，依赖 bar 包，因此，xmake 会优先安装 bar，并且让 cmake.install 在调用 cmake 时候，自动找到 bar 安装后的库。

但是，如果 foo 的 CMakeLists.txt 还是无法自动找到 bar，那么我们可以修改成下面的配置，强制将 bar 的 includedirs/links 等信息通过 flags 的方式，传入 foo。

```lua
package("foo")
    add_deps("cmake", "bar")
    on_install(function (package)
        local configs = {}
        import("package.tools.cmake").install(package, configs, {packages = "bar"})
    end)
```

#### add_components

这是 2.7.3 新加的接口，用于支持包的组件化配置，详情见：[#2636](https://github.com/xmake-io/xmake/issues/2636)。

通过这个接口，我们可以配置当前包实际可以提供的组件列表。

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")
```

在用户端，我们可以通过下面的方式来使用包的特定组件。

```lua
add_requires("sfml")

target("test")
    add_packages("sfml", {components = "graphics")
```

!> 注：除了配置可用的组件列表，我们还需要对每个组件进行详细配置，才能正常使用，因此，它通常和 `on_componment` 接口配合使用。

一个关于包组件的配置和使用的完整例子见：[components example](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/components/xmake.lua)

#### set_base

这是 2.6.4 新加的接口，我们可以通过它去继承一个已有的包的全部配置，然后在此基础上重写部分配置。

这通常在用户自己的项目中，修改 xmake-repo 官方仓库的内置包比较有用，比如：修复改 urls，修改版本列表，安装逻辑等等。

例如，修改内置 zlib 包的 url，切到自己的 zlib 源码地址。

```lua
package("myzlib")
    set_base("zlib")
    set_urls("https://github.com/madler/zlib.git")
package_end()

add_requires("myzlib", {system = false, alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

我们也可以用来单纯添加一个别名包。

```lua
package("onetbb")
    set_base("tbb")
```

我们可以通过 `add_requires("onetbb")` 集成安装 tbb 包，只是包名不同而已。

#### on_load

这是个可选的接口，如果要更加灵活的动态判断各种平台架构，针对性做设置，可以在这个里面完成，例如：

```lua
on_load(function (package)
    local bitwidth = package:config("bitwidth") or "8"
    package:add("links", "pcre" .. (bitwidth ~= "8" and bitwidth or ""))
    if not package:config("shared") then
        package:add("defines", "PCRE_STATIC")
    end
end)
```

pcre包需要做一些针对bitwidth的判断，才能确定对外输出的链接库名字，还需要针对动态库增加一些defines导出，这个时候在on_load里面设置，就更加灵活了。

#### on_fetch

这是个可选配置，2.5.2 之后，如果不同系统下安装的系统库，仅仅只是包名不同，那么使用 `add_extsources` 改进系统库查找已经足够，简单方便。

但是如果有些安装到系统的包，位置更加复杂，想要找到它们，也许需要一些额外的脚本才能实现，例如：windows 下注册表的访问去查找包等等，这个时候，我们就可以通过 `on_fetch` 完全定制化查找系统库逻辑。

还是以 libusb 为例，我们不用 `add_extsources`，可以使用下面的方式，实现相同的效果，当然，我们可以在里面做更多的事情。

```
package("libusb")
    on_fetch("linux", function(package, opt)
        if opt.system then
            return find_package("pkgconfig::libusb-1.0")
        end
    end)
```

#### on_install

这个接口主要用于添加安装脚本，前面的字符串参数用于设置支持的平台，像`on_load`, `on_test`等其他脚本域也是同样支持的。

##### 平台过滤

完整的过滤语法如下：`plat|arch1,arch2@host|arch1,arch2`

看上去非常的复杂，其实很简单，其中每个阶段都是可选的，可部分省略，对应：`编译平台|编译架构@主机平台|主机架构`

如果不设置任何平台过滤条件，那么默认全平台支持，里面的脚本对所有平台生效，例如：

```lua
on_install(function (package)
    -- TODO
end)
```

如果安装脚本对特定平台生效，那么直接指定对应的编译平台，可以同时指定多个：

```lua
on_install("linux", "macosx", function (package)
    -- TODO
end)
```

如果还要细分到指定架构才能生效，可以这么写：


```lua
on_install("linux|x86_64", "iphoneos|arm64", function (package)
    -- TODO
end)
```

如果还要限制执行的主机环境平台和架构，可以在后面追加`@host|arch`，例如：

```lua
on_install("mingw@windows", function (package)
    -- TODO
end)
```

意思就是仅对windows下编译mingw平台生效。

我们也可以不指定比那一平台和架构，仅设置主机平台和架构，这通常用于描述一些跟编译工具相关的依赖包，只能在主机环境运行。

例如，我们编译的包，依赖了cmake，需要添加cmake的包描述，那么里面编译安装环境，只能是主机平台：

```lua
on_install("@windows", "@linux", "@macosx", function (package)
    -- TODO
end)
```

其他一些例子：

```lua
-- `@linux`
-- `@linux|x86_64`
-- `@macosx,linux`
-- `android@macosx,linux`
-- `android|armeabi-v7a@macosx,linux`
-- `android|armeabi-v7a@macosx,linux|x86_64`
-- `android|armeabi-v7a@linux|x86_64`
```

##### 编译工具

我们内置了一些安装常用编译工具脚本，用于针对不同源码依赖的构建工具链，进行方便的构架支持，例如：autoconf, cmake, meson等，

###### xmake

如果是基于xmake的依赖包，那么集成起来就非常简单了，xmake对其做了非常好的内置集成支持，可以直接对其进行跨平台编译支持，一般情况下只需要：

```lua
on_install(function (package)
    import("package.tools.xmake").install(package)
end)
```

如果要传递一些特有的编译配置参数：

```lua
on_install(function (package)
    import("package.tools.xmake").install(package, {"--xxx=y"})
end)
```

###### cmake

如果是基于cmake的包，集成起来也很简答，通常也只需要设置一些配置参数即可，不过还需要先添加上cmake的依赖才行：

```lua
add_deps("cmake")
on_install(function (package)
    import("package.tools.cmake").install(package, {"-Dxxx=ON"})
end)
```

###### autoconf

如果是基于autoconf的包，集成方式跟cmake类似，只是传递的配置参数不同而已，不过通常情况下，unix系统都内置了autoconf系列工具，所以不加相关依赖也没事。

```lua
on_install(function (package)
    import("package.tools.autoconf").install(package, {"--enable-shared=no"})
end)
```

不过，有些源码包用系统内置的autoconf可能不能完全满足，那么可以加上autoconf系列依赖，对其进行构建：

```lua
add_deps("autoconf", "automake", "libtool", "pkg-config")
on_install(function (package)
    import("package.tools.autoconf").install(package, {"--enable-shared=no"})
end)
```

###### meson

如果是meson，还需要加上ninja的依赖来执行构建才行。

```lua
add_deps("meson", "ninja")
on_install(function (package)
    import("package.tools.meson").install(package, {"-Dxxx=ON"})
end)
```

#### on_test

安装后，需要设置对应的测试脚本，执行一些测试，确保安装包的可靠性，如果测试不通过，则会撤销整个安装包。

```lua
on_test(function (package)
    assert(package:has_cfuncs("inflate", {includes = "zlib.h"}))
end)
```

上面的脚本调用包内置的`has_cfuncs`接口，检测安装后的包是否存在zlib.h头文件，以及库和头文件里面是否存在`inflate`这个接口函数。

xmake会去尝试编译链接来做测试，`has_cfuncs`用于检测c函数，而`has_cxxfuncs`则可以检测c++库函数。

而includes里面可以设置多个头文件，例如：`includes = {"xxx.h", "yyy.h"}`

我们还可以传递一些自己的编译参数进去检测，例如：

```lua
on_test(function (package)
    assert(package:has_cxxfuncs("func1", {includes = "xxx.h", configs = {defines = "c++14", cxflags = "-Dxxx"}}))
end)
```

我们也可以通过`check_csnippets`和`check_cxxsnippets`检测一个代码片段：

```lua
on_test(function (package)
    assert(package:check_cxxsnippets({test = [[
        #include <boost/algorithm/string.hpp>
        #include <string>
        #include <vector>
        #include <assert.h>
        using namespace boost::algorithm;
        using namespace std;
        static void test() {
            string str("a,b");
            vector<string> strVec;
            split(strVec, str, is_any_of(","));
            assert(strVec.size()==2);
            assert(strVec[0]=="a");
            assert(strVec[1]=="b");
        }
    ]]}, {configs = {languages = "c++14"}}))
end)
```

如果是可执行包，也可以通过尝试运行来检测：

```lua
on_test(function (package)
    os.run("xxx --help")
end)
```

如果运行失败，那么测试不会通过。

#### on_download

自定义包的下载逻辑，这是 2.6.4 新加的接口，通常用不到，使用 Xmake 的内置下载就足够了。

如果用户自建私有仓库，对包的下载有更复杂的鉴权机制，特殊处理逻辑，那么可以重写内部的下载逻辑来实现。

```lua
on_download(function (package, opt)
    local url = opt.url
    local sourcedir = opt.sourcedir

    -- download url to the current directory
    -- and extract it's source code to sourcedir
    -- ...
end)
```

opt 参数里面，可以获取到下载包的目的源码目录 `opt.sourcedir`，我们只需要从 `opt.url` 获取到包地址，下载下来就可以了。

然后，根据需要，添加一些自定义的处理逻辑。另外，自己可以添加下载缓存处理等等。

下面是一个自定义下载 tar.gz 文件，并且实现缓存和源文件目录解压的例子，可以参考下：

```lua
package("zlib")
    add_urls("https://github.com/madler/zlib/archive/$(version).tar.gz")
    add_versions("v1.2.10", "42cd7b2bdaf1c4570e0877e61f2fdc0bce8019492431d054d3d86925e5058dc5")

    on_download(function (package, opt)
        import("net.http")
        import("utils.archive")

        local url = opt.url
        local sourcedir = opt.sourcedir
        local packagefile = path.filename(url)
        local sourcehash = package:sourcehash(opt.url_alias)

        local cached = true
        if not os.isfile(packagefile) or sourcehash ~= hash.sha256(packagefile) then
            cached = false

            -- attempt to remove package file first
            os.tryrm(packagefile)
            http.download(url, packagefile)

            -- check hash
            if sourcehash and sourcehash ~= hash.sha256(packagefile) then
                raise("unmatched checksum, current hash(%s) != original hash(%s)", hash.sha256(packagefile):sub(1, 8), sourcehash:sub(1, 8))
            end
        end

        -- extract package file
        local sourcedir_tmp = sourcedir .. ".tmp"
        os.rm(sourcedir_tmp)
        if archive.extract(packagefile, sourcedir_tmp) then
            os.rm(sourcedir)
            os.mv(sourcedir_tmp, sourcedir)
        else
            -- if it is not archive file, we need only create empty source file and use package:originfile()
            os.tryrm(sourcedir)
            os.mkdir(sourcedir)
        end

        -- save original file path
        package:originfile_set(path.absolute(packagefile))
    end)
```

自定义下载需要用户完全自己控制下载逻辑，会比较复杂，除非必要，不推荐这么做。

如果仅仅只是想增加自定义 http headers 去获取下载授权，可以使用 [设置包下载的 http headers](https://xmake.io/#/zh-cn/manual/project_target?id=%e8%ae%be%e7%bd%ae%e5%8c%85%e4%b8%8b%e8%bd%bd%e7%9a%84-http-headers)

#### on_componment

这是 2.7.3 新加的接口，用于支持包的组件化配置，详情见：[#2636](https://github.com/xmake-io/xmake/issues/2636)。

通过这个接口，我们可以配置当前包，指定组件的详细信息，比如组件的链接，依赖等等。

##### 配置组件链接信息

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")

    on_component("graphics", function (package, component)
        local e = package:config("shared") and "" or "-s"
        component:add("links", "sfml-graphics" .. e)
        if package:is_plat("windows", "mingw") and not package:config("shared") then
            component:add("links", "freetype")
            component:add("syslinks", "opengl32", "gdi32", "user32", "advapi32")
        end
    end)

    on_component("window", function (package, component)
        local e = package:config("shared") and "" or "-s"
        component:add("links", "sfml-window" .. e)
        if package:is_plat("windows", "mingw") and not package:config("shared") then
            component:add("syslinks", "opengl32", "gdi32", "user32", "advapi32")
        end
    end)

    ...
```

在用户端，我们可以通过下面的方式来使用包的特定组件。

```lua
add_requires("sfml")

target("test")
    add_packages("sfml", {components = "graphics")
```

!> 注：除了配置组件信息，我们还需要配置可用的组件列表，才能正常使用，因此，它通常和 `add_components` 接口配合使用。

一个关于包组件的配置和使用的完整例子见：[components example](https://github.com/xmake-io/xmake/blob/master/tests/projects/package/components/xmake.lua)

##### 配置组件的编译信息

我们不仅可以配置每个组件的链接信息，还有 includedirs, defines 等等编译信息，我们也可以对每个组件单独配置。

```lua
package("sfml")
    on_component("graphics", function (package, component)
        package:add("defines", "TEST")
    end)
```

##### 配置组件依赖

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")

    on_component("graphics", function (package, component)
          component:add("deps", "window", "system")
    end)
```

上面的配置，告诉包，我们的 graphics 组件还会额外依赖 `window` 和 `system` 两个组件。

因此，在用户端，我们对 graphics 的组件使用，可以从

```lua
    add_packages("sfml", {components = {"graphics", "window", "system"})
```

简化为：

```lua
    add_packages("sfml", {components = "graphics")
```

因为，只要我们开启了 graphics 组件，它也会自动启用依赖的 window 和 system 组件。

另外，我们也可以通过 `add_components("graphics", {deps = {"window", "system"}})` 来配置组件依赖关系。

##### 从系统库中查找组件

我们知道，在包配置中，配置 `add_extsources` 可以改进包在系统中的查找，比如从 apt/pacman 等系统包管理器中找库。

当然，我们也可以让每个组件也能通过 `extsources` 配置，去优先从系统库中找到它们。

例如，sfml 包，它在 homebrew 中其实也是组件化的，我们完全可以让包从系统库中，找到对应的每个组件，而不需要每次源码安装它们。

```bash
$ ls -l /usr/local/opt/sfml/lib/pkgconfig
-r--r--r--  1 ruki  admin  317 10 19 17:52 sfml-all.pc
-r--r--r--  1 ruki  admin  534 10 19 17:52 sfml-audio.pc
-r--r--r--  1 ruki  admin  609 10 19 17:52 sfml-graphics.pc
-r--r--r--  1 ruki  admin  327 10 19 17:52 sfml-network.pc
-r--r--r--  1 ruki  admin  302 10 19 17:52 sfml-system.pc
-r--r--r--  1 ruki  admin  562 10 19 17:52 sfml-window.pc
```

我们只需要，对每个组件配置它的 extsources：

```lua
    if is_plat("macosx") then
        add_extsources("brew::sfml/sfml-all")
    end

    on_component("graphics", function (package, component)
        -- ...
        component:add("extsources", "brew::sfml/sfml-graphics")
    end)
```

##### 默认的全局组件配置

除了通过指定组件名的方式，配置特定组件，如果我们没有指定组件名，默认就是全局配置所有组件。

```lua
package("sfml")
    on_component(function (package, component)
        -- configure all components
    end)
```

当然，我们也可以通过下面的方式，指定配置 graphics 组件，剩下的组件通过默认的全局配置接口进行配置：

```lua
package("sfml")
    add_components("graphics")
    add_components("audio", "network", "window")
    add_components("system")

    on_component("graphics", function (package, component)
        -- configure graphics
    end)

    on_component(function (package, component)
        -- component audio, network, window, system
    end)
```

### 扩展配置参数

详情见：[add_configs](#add_configs)

### 内置配置参数

除了可以通过[add_configs](#add_configs)设置一些扩展的配置参数以外，xmake还提供了一些内置的配置参数，可以使用

#### 启用调试包

```lua
add_requires("xxx", {debug = true})
```

包描述里面必须有相关处理才能支持：

```lua
on_install(function (package)
    local configs = {}
    if package:debug() then
        table.insert(configs, "--enable-debug")
    end
    import("package.tools.autoconf").install(package)
end)
```

#### 设置msvc运行时库

```lua
add_requires("xxx", {configs = {vs_runtime = "MT"}})
```

通常情况下，通过`import("package.tools.autoconf").install`等内置工具脚本安装的包，内部都对vs_runtime自动处理过了。

但是如果是一些特殊的源码包，构建规则比较特殊，那么需要自己处理了：

```lua
on_install(function (package)
    io.gsub("build/Makefile.win32.common", "%-MD", "-" .. package:config("vs_runtime"))
end)
```

### 添加环境变量

对于一些库，里面也带了可执行的工具，如果需要在集成包的时候，使用上这些工具，那么也可以设置上对应PATH环境变量：

```lua
package("luajit")
    on_load(function (package)
        if is_plat("windows") then
            package:addenv("PATH", "lib")
        end
        package:addenv("PATH", "bin")
    end)
```

而在项目工程中，只有通过`add_packages`集成对应的包后，对应的环境变量才会生效。

```lua
add_requires("luajit")
target("test")
    set_kind("binary")
    add_packages("luajit")
    after_run(function (package)
        os.exec("luajit --version")
    end)
```

### 安装二进制包

xmake也是支持直接引用二进制版本包，直接安装使用，例如：

```lua
if is_plat("windows") then
    set_urls("https://www.libsdl.org/release/SDL2-devel-$(version)-VC.zip")
    add_versions("2.0.8", "68505e1f7c16d8538e116405411205355a029dcf2df738dbbc768b2fe95d20fd")
end

on_install("windows", function (package)
    os.cp("include", package:installdir())
    os.cp("lib/$(arch)/*.lib", package:installdir("lib"))
    os.cp("lib/$(arch)/*.dll", package:installdir("lib"))
end)
```

### 本地测试

如果在本地xmake-repo仓库中，已经添加和制作好了新的包，可以在本地运行测试下，是否通过，如果测试通过，即可提交pr到官方仓库，请求merge。

我们可以执行下面的脚本进行测试指定包：

```bash
cd xmake-repo
xmake l scripts/test.lua -v -D zlib
```

上面的命令，会强制重新下载和安装zlib包，测试整个安装流程是否ok，加上`-v -D`是为了可以看到完整详细的日志信息和出错信息，方便调试分析。

如果网络环境不好，不想每次测试都去重新下载所有依赖，可以加上`--shallow`参数来执行，这个参数告诉脚本，仅仅重新解压本地缓存的zlib源码包，重新执行安装命令，但不会下载各种依赖。

```bash
cd xmake-repo
xmake l scripts/test.lua -v -D --shallow zlib
```

如果我们想测试其他平台的包规则是否正常，比如: android, iphoneos等平台，可以通过`-p/--plat`或者`-a/--arch`来指定。

```bash
cd xmake-repo
xmake l scripts/test.lua -v -D --shallow -p iphoneos -a arm64 zlib
xmake l scripts/test.lua -v -D --shallow -p android --ndk=/xxxx zlib
```

## 提交包到官方仓库

目前这个特性刚完成不久，目前官方仓库的包还不是很多，有些包也许还不支持部分平台，不过这并不是太大问题，后期迭代几个版本后，我会不断扩充完善包仓库。

如果你需要的包，当前的官方仓库还没有收录，可以提交issues或者自己可以在本地调通后，贡献提交到官方仓库：[xmake-repo](https://github.com/xmake-io/xmake-repo)

详细的贡献说明，见：[CONTRIBUTING.md](https://github.com/xmake-io/xmake-repo/blob/master/CONTRIBUTING.md)

关于如何制作自己的包，可以看下上文：[添加包到仓库](#添加包到仓库)。

## 依赖包的锁定和升级

v2.5.7 之后，新增依赖包的版本锁定，类似 npm 的 package.lock, cargo 的 cargo.lock。

比如，我们引用一些包，默认情况下，如果不指定版本，那么 xmake 每次都会自动拉取最新版本的包来集成使用，例如：

```lua
add_requires("zlib")
```

但如果上游的包仓库更新改动，比如 zlib 新增了一个 1.2.11 版本，或者安装脚本有了变动，都会导致用户的依赖包发生改变。

这容易导致原本编译通过的一些项目，由于依赖包的变动出现一些不稳定因素，有可能编译失败等等。

为了确保用户的项目每次使用的包都是固定的，我们可以通过下面的配置去启用包依赖锁定。

```lua
set_policy("package.requires_lock", true)
```

这是一个全局设置，必须设置到全局根作用域，如果启用后，xmake 执行完包拉取，就会自动生成一个 `xmake-requires.lock` 的配置文件。

它包含了项目依赖的所有包，以及当前包的版本等信息。

```lua
{
    __meta__ = {
        version = "1.0"
    },
    ["macosx|x86_64"] = {
        ["cmake#31fecfc4"] = {
            repo = {
                branch = "master",
                commit = "4498f11267de5112199152ab030ed139c985ad5a",
                url = "https://github.com/xmake-io/xmake-repo.git"
            },
            version = "3.21.0"
        },
        ["glfw#31fecfc4"] = {
            repo = {
                branch = "master",
                commit = "eda7adee81bac151f87c507030cc0dd8ab299462",
                url = "https://github.com/xmake-io/xmake-repo.git"
            },
            version = "3.3.4"
        },
        ["opengl#31fecfc4"] = {
            repo = {
                branch = "master",
                commit = "94d2eee1f466092e04c5cf1e4ecc8c8883c1d0eb",
                url = "https://github.com/xmake-io/xmake-repo.git"
            }
        }
    }
}
```

当然，我们也可以执行下面的命令，强制升级包到最新版本。

```console
$ xmake require --upgrade
upgrading packages ..
  zlib: 1.2.10 -> 1.2.11
1 package is upgraded!
```

## 分发和使用自定义包规则

2.7.2 版本之后，我们可以在包管理仓库中，添加自定义构架规则脚本，实现跟随包进行动态下发和安装。

我们需要将自定义规则放到仓库的 `packages/x/xxx/rules` 目录中，它会跟随包一起被安装。

但是，它也存在一些限制：

- 在包中规则，我们不能添加 `on_load`, `after_load` 脚本，但是通常我们可以使用 `on_config` 来代替。

### 添加包规则

我们需要将规则脚本添加到 rules 固定目录下，例如：packages/z/zlib/rules/foo.lua

```lua
rule("foo")
    on_config(function (target)
        print("foo: on_config %s", target:name())
    end)
```

### 应用包规则

使用规则的方式跟之前类似，唯一的区别就是，我们需要通过 `@packagename/` 前缀去指定访问哪个包里面的规则。

具体格式：`add_rules("@packagename/rulename")`，例如：`add_rules("@zlib/foo")`。

```lua
add_requires("zlib", {system = false})
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("zlib")
    add_rules("@zlib/foo")
```

### 通过包别名引用规则

如果存在一个包的别名，xmake 将优先考虑包的别名来获得规则。

```lua
add_requires("zlib", {alias = "zlib2", system = false})
target("test")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("zlib2")
    add_rules("@zlib2/foo")
```

### 添加包规则依赖

我们可以使用`add_deps("@bar")`来添加相对于当前包目录的其他规则。

然而，我们不能添加来自其他包的规则依赖，它们是完全隔离的，我们只能参考用户项目中由`add_requires`导入的其他包的规则。

packages/z/zlib/rules/foo.lua

```lua
rule("foo")
    add_deps("@bar")
    on_config(function (target)
        print("foo: on_config %s", target:name())
    end)
```

packages/z/zlib/rules/bar.lua

```lua
rule("bar")
    on_config(function (target)
        print("bar: on_config %s", target:name())
    end)
```

## 在 CMake 中使用 Xrepo 的依赖包管理

我们新增了一个独立项目 [xrepo-cmake](https://github.com/xmake-io/xrepo-cmake)。

它是一个基于 Xrepo/Xmake 的 C/C++ 包管理器的 CMake 包装器。

这允许使用 CMake 来构建您的项目，同时使用 Xrepo 来管理依赖包。这个项目的部分灵感来自 [cmake-conan](https://github.com/conan-io/cmake-conan)。

此项目的示例用例：

- 想要使用 Xrepo 管理包的现有 CMake 项目。
- 必须使用 CMake，但想使用 Xrepo 管理的新项目包。

### Apis

#### xrepo_package

[xrepo.cmake](https://github.com/xmake-io/xrepo-cmake/blob/main/xrepo.cmake) 提供`xrepo_package`函数来管理包。

```cmake
xrepo_package(
    "foo 1.2.3"
    [CONFIGS feature1=true,feature2=false]
    [CONFIGS path/to/script.lua]
    [DEPS]
    [MODE debug|release]
    [ALIAS aliasname]
    [OUTPUT verbose|diagnosis|quiet]
    [DIRECTORY_SCOPE]
)
```

一些函数参数直接对应于 Xrepo 命令选项。

`xrepo_package` 将软件包安装目录添加到 `CMAKE_PREFIX_PATH`。所以`find_package`
可以使用。如果 `CMAKE_MINIMUM_REQUIRED_VERSION` >= 3.1，cmake `pkgConfig` 也会搜索
对于软件包安装目录下的 pkgconfig 文件。

调用 `xrepo_package(foo)` 后，有 `foo` 包的三种使用方式：

1. 如果包提供 cmake 配置文件，则调用 `find_package(foo)`。
    - 有关详细信息，请参阅 CMake [`find_package`](https://cmake.org/cmake/help/latest/command/find_package.html) 文档。
2.如果包没有提供cmake配置文件或者找不到模块
   - 以下变量可用于使用pacakge（cmake后的变量名
     查找模块 [标准变量名称](https://cmake.org/cmake/help/latest/manual/cmake-developer.7.html#standard-variable-names))
     - `foo_INCLUDE_DIRS`
     - `foo_LIBRARY_DIRS`
     - `foo_LIBRARIES`
     - `foo_DEFINITIONS`
   - 如果指定了 `DIRECTORY_SCOPE`，则 `xrepo_package` 将运行以下代码
     ```cmake
     include_directories(${foo_INCLUDE_DIRS})
     link_directories(${foo_LIBRARY_DIRS})
     ```
3. 使用`xrepo_target_packages`。请参阅以下部分。

注意 `CONFIGS path/to/script.lua` 用于对包配置进行精细控制。
例如：
  - 排除系统上的包。
  - 覆盖依赖包的默认配置，例如设置`shared=true`。

如果指定了 `DEPS`，所有依赖库都将添加到 `CMAKE_PREFIX_PATH`，以及 include 和 libraries 那四个变量中。

#### xrepo_target_packages

将包 includedirs 和 links/linkdirs 添加到给定的目标。

```cmake
xrepo_target_packages(
    target
    [NO_LINK_LIBRARIES]
    [PRIVATE|PUBLIC|INTERFACE]
    package1 package2 ...
)
```

### 使用来自官方存储库的包

Xrepo 官方仓库：[xmake-repo](https://github.com/xmake-io/xmake-repo)

这是一个使用 `gflags` 包版本 2.2.2 的示例 `CMakeLists.txt` 由 Xrepo 管理。

#### 集成 xrepo.cmake

```cmake
cmake_minimum_required(VERSION 3.13.0)

project(foo)

# Download xrepo.cmake if not exists in build directory.
if(NOT EXISTS "${CMAKE_BINARY_DIR}/xrepo.cmake")
    message(STATUS "Downloading xrepo.cmake from https://github.com/xmake-io/xrepo-cmake/")
    # mirror https://cdn.jsdelivr.net/gh/xmake-io/xrepo-cmake@main/xrepo.cmake
    file(DOWNLOAD "https://raw.githubusercontent.com/xmake-io/xrepo-cmake/main/xrepo.cmake"
                  "${CMAKE_BINARY_DIR}/xrepo.cmake"
                  TLS_VERIFY ON)
endif()

# Include xrepo.cmake so we can use xrepo_package function.
include(${CMAKE_BINARY_DIR}/xrepo.cmake)
```

#### 添加包

```cmake
xrepo_package("zlib")

add_executable(example-bin "")
target_sources(example-bin PRIVATE
    src/main.cpp
)
xrepo_target_packages(example-bin zlib)
```

#### 添加带有配置的包

```cmake
xrepo_package("gflags 2.2.2" CONFIGS "shared=true,mt=true")

add_executable(example-bin "")
target_sources(example-bin PRIVATE
    src/main.cpp
)
xrepo_target_packages(example-bin gflags)
```

#### 添加带有 cmake 导入模块的包

```cmake
xrepo_package("gflags 2.2.2" CONFIGS "shared=true,mt=true")

# `xrepo_package` 会将 gflags 安装目录添加到 CMAKE_PREFIX_PATH.
# `find_package(gflags)` 会从 CMAKE_PREFIX_PATH 包含的目录中找到 gflags 提供的
# config-file 文件。
# 参考 https://cmake.org/cmake/help/latest/command/find_package.html#search-modes
find_package(gflags CONFIG COMPONENTS shared)

add_executable(example-bin "")
target_sources(example-bin PRIVATE
    src/main.cpp
)
target_link_libraries(example-bin gflags)
```

#### 添加自定义包

```cmake
set(XREPO_XMAKEFILE ${CMAKE_CURRENT_SOURCE_DIR}/packages/xmake.lua)
xrepo_package("myzlib")

add_executable(example-bin "")
target_sources(example-bin PRIVATE
    src/main.cpp
)
xrepo_target_packages(example-bin myzlib)
```

在 packages/xmake.lua 中定义一个包：

```lua
package("myzlib")
    -- ...
```

我们可以自定义一个包，具体定义方式，参考文档：[自定义 Xrepo 包](https://xmake.io/#/zh-cn/package/remote_package?id=package-description)。


### 使用来自第三个存储库的包

除了从官方维护的存储库安装软件包之外，Xrepo 还可以安装来自第三方包管理器的包，例如 vcpkg/conan/conda/pacman/homebrew/apt/dub/cargo。

关于命令行的使用，我们可以参考文档：[Xrepo命令用法](https://xrepo.xmake.io/#/getting_started?id=install-packages-from-third-party-package-manager)

我们也可以直接在 cmake 中使用它来安装来自第三方仓库的包，只需将仓库名称添加为命名空间即可。例如：`vcpkg::zlib`, `conan::pcre2`

#### Conan

```cmake
xrepo_package("conan::gflags/2.2.2")
```

#### Conda

```cmake
xrepo_package("conda::gflags 2.2.2")
```

#### Vcpkg

```cmake
xrepo_package("vcpkg::gflags")
```

#### Homebrew

```cmake
xrepo_package("brew::gflags")
```
