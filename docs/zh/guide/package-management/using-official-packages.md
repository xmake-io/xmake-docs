---
outline: deep
---

# 使用官方包 {#using-official-packages}

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

```sh
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

```sh
$ xmake create -t console_tbox test
$ cd test
```

执行编译即可，如果当前没有安装tbox库，则会自动下载安装后使用：

```sh
$ xmake
```

切换到iphoneos平台进行编译，将会重新安装iphoneos版本的tbox库进行链接使用：

```sh
$ xmake f -p iphoneos
$ xmake
```

切换到android平台arm64-v8a架构编译：

```sh
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

```sh
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

::: tip 注意
`vs_runtime`是用于msvc下vs runtime的设置，v2.2.9版本中，还支持所有static依赖包的自动继承，也就是说spdlog如果设置了MD，那么它依赖的fmt包也会自动继承设置MD。
:::

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

```sh
-isystem /Users/ruki/.xmake/packages/z/zlib/1.2.11/d639b7d6e3244216b403b39df5101abf/include
```

手动关闭 external 外部头文件的编译 flags 如下：

```lua
add_requires("zlib 1.x", {external = false})
```

```sh
-I /Users/ruki/.xmake/packages/z/zlib/1.2.11/d639b7d6e3244216b403b39df5101abf/include
```

## 使用自建私有包仓库 {#using-self-repository}

如果需要的包不在官方仓库[xmake-repo](https://github.com/xmake-io/xmake-repo)中，我们可以提交贡献代码到仓库进行支持。
但如果有些包仅用于个人或者私有项目，我们可以建立一个私有仓库repo，仓库组织结构可参考：[xmake-repo](https://github.com/xmake-io/xmake-repo)

比如，现在我们有一个一个私有仓库repo：`git@github.com:myrepo/xmake-repo.git`

我们可以通过下面的命令进行仓库添加：

```sh
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git [branch]
```

::: tip 注意
`[branch]` 是可选的，我们也可以切换到指定repo分支
:::

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

关于如何编写自定义包描述规则，详情见：[添加包到仓库](/zh/guide/package-management/package-distribution.html#submit-package-to-official-repository)

## 依赖包的锁定和升级 {#lock-and-upgrade-package}

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

```sh
$ xmake require --upgrade
upgrading packages ..
  zlib: 1.2.10 -> 1.2.11
1 package is upgraded!
```

