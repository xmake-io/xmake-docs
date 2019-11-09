
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

还是拿`spdlog->fmt`为例，对于`vs_runtime`这种可以自动继承配置，因为它是内置配置项，很多私有配置就没法处理了。

这个时候，我们可以通过在外层项目xmake.lua提前通过`add_requires`添加fmt包（这个时候你可以设置各种自己的配置），
确保spdlog在在安装之前，fmt已经通过`add_requires`的配置完成了安装，那么在安装spdlog的时候，就会自动检测到，并直接使用，不会在内部继续安装fmt依赖。

例如：

```lua
add_requires("fmt", {system = false, configs = {cxflags = "-fPIC"}})
add_requires("spdlog", {system = false, configs = {fmt_external = true, cxflags = "-fPIC"}})
```

我们的项目需要spdlog启用fPIC编译，那么它的fmt依赖包也需要启用，那么我们可以在spdlog的上面优先添加fmt包，也设置上fPIC提前安装掉即可。

通过这种方式，spdlog对应内部的fmt依赖包，我们也可以在上层通过`add_requires`灵活的设置各种复杂的自定义配置。

## 第三方依赖包安装

2.2.5版本之后，xmake支持对对第三方包管理器里面的依赖库安装支持，例如：conan，brew, vcpkg等

### 添加homebrew的依赖包

```lua
add_requires("brew::zlib", {alias = "zlib"}})
add_requires("brew::pcre2/libpcre2-8", {alias = "pcre2"}})

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("pcre2", "zlib")
```

### 添加vcpkg的依赖包

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

### 添加conan的依赖包

```lua
add_requires("CONAN::zlib/1.2.11@conan/stable", {alias = "zlib", debug = true})
add_requires("CONAN::OpenSSL/1.0.2n@conan/stable", {alias = "openssl", 
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
  -> CONAN::zlib/1.2.11@conan/stable  (debug)
  -> CONAN::OpenSSL/1.0.2n@conan/stable  
please input: y (y/n)

  => installing CONAN::zlib/1.2.11@conan/stable .. ok
  => installing CONAN::OpenSSL/1.0.2n@conan/stable .. ok

[  0%]: ccache compiling.release src/main.c
[100%]: linking.release test
```

### 添加clib的依赖包

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

## 使用自建私有包仓库

如果需要的包不在官方仓库[xmake-repo](https://github.com/xmake-io/xmake-repo)中，我们可以提交贡献代码到仓库进行支持。
但如果有些包仅用于个人或者私有项目，我们可以建立一个私有仓库repo，仓库组织结构可参考：[xmake-repo](https://github.com/xmake-io/xmake-repo)

比如，现在我们有一个一个私有仓库repo：`git@github.com:myrepo/xmake-repo.git`

我们可以通过下面的命令进行仓库添加：

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
```

或者我们直接写在xmake.lua中：

```lua
add_repositories("my-repo git@github.com:myrepo/xmake-repo.git")
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

这个可以参考[benchbox](https://github.com/tboox/benchbox)项目，里面就内置了一个私有仓库。

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
$ xmake require --extra="debug=true,config={small=true}" tbox
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
-- `android|armv7-a@macosx,linux`
-- `android|armv7-a@macosx,linux|x86_64`
-- `android|armv7-a@linux|x86_64`
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

