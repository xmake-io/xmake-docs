---
title: xmake v2.5.5 发布，支持下载集成二进制镜像包
tags: [xmake, lua, C/C++, mirror, package]
date: 2021-06-30
author: Ruki
---

[xmake](https://github.com/xmake-io/xmake) 是一个基于 Lua 的轻量级跨平台构建工具，使用 xmake.lua 维护项目构建，相比 makefile/CMakeLists.txt，配置语法更加简洁直观，对新手非常友好，短时间内就能快速入门，能够让用户把更多的精力集中在实际的项目开发上。

2.5.5 版本中，我们继续改进远程包集成的体验，实现在云端预编译包，然后直接下载集成预编译的二进制包。这对于一些编译非常慢的包，可以极大的减少包的安装时间。

另外，新版本中，我们还重新实现了新版的本地包生成方案，完全无缝支持 `add_requires` 和 `add_packages`，从此远程包和本地包可以使用统一的集成方式来维护。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](/zh/about/course)

## 新特性介绍

### 下载安装预编译包

之前 xmake 内置的包管理器每次安装包，都必须下载对应的包源码，然后执行本地编译安装集成，这对于一些编译非常慢的大包，以及一些依赖的编译工具非常多的包，安装起来会非常的慢。

尤其是在 windows 上，不仅三方包对编译环境的依赖更加复杂，而且很多打包编译非常慢，例如：boost, openssl 等等。

为此，我们基于 github action 实现对包的云端预编译，会将常用配置的包都去预编译一遍，然后存储到 [build-artifacts](https://github.com/xmake-mirror/build-artifacts) 仓库的 Releases 下。

然后，我们在安装包的时候，会自动从二进制镜像包源下载，实现快速集成（目前仅支持预编译 windows 包，后期会逐步放开到其他平台）。

我们会预编译每个包的 plat/arch/MT/MD/static/shared 等各种配置组合，根据唯一的 buildhash 来精确拉取用户实际需要的包，所有的编译产物都会用 7zip 压缩打包，如下图：

![](/assets/img/posts/xmake/build-artifacts.png)







#### 配置镜像源加速下载

由于我们的预编译产物都放置在 github 上，对于国内用户，考虑到访问 github 并不是很稳定，我们也可以借助 xmake 镜像代理功能，将实际的下载自动切换到 fastgit 等镜像站点加速下载。


我们可以通过一个 pac.lua 文件，配置镜像代理规则，比如对所有 github.com 域名的访问切到 hub.fastgit.org 域名，实现加速下载包。

pac.lua 配置：

```lua
function mirror(url)
     return url:gsub("github.com", "hub.fastgit.org")
end
```

然后我们设置这个 pac.lua 文件，默认路径在 `~/.xmake/pac.lua`，也可以手动配置使用指定位置的 pac.lua 。

```console
$ xmake g --proxy_pac=/tmp/pac.lua
```

然后，我们安装包的时候，如果遇到 github.com 域名下的包源，下载时候会自动切到 fastgit 镜像加速下载。

```console
$ xrepo install libpng
> curl https://hub.fastgit.org/glennrp/libpng/archive/v1.6.37.zip -o v1.6.37.zip
```

因此，所有走预编译产物的下载也会得到提速，当然国内提供 github 镜像加速的不止 fastgit 一家，用户也可以切换到其他镜像源，比如 cnpmjs.org 等等。

#### 如何触发云端预编译

默认情况下，xmake 不会主动进行所有包的云端预编译缓存，这样太耗时耗力，目前仅仅只有提交 pr 到 [xmake-repo](https://github.com/xmake-io/xmake-repo) 官方包仓库，进行新包收录或者包版本更新时候，才会自动触发对应包的云端预编译行为。

所以，如果用户想要贡献包进我们的仓库，基本上都是可以被预编译缓存的（除了 headeronly 库），而如果用户不想贡献包，也想获取对应包的预编译加速，也是可以的。

只需要提交 pr 到 [build-artifacts](https://github.com/xmake-mirror/build-artifacts) 仓库的 build 分支，编辑 [build.txt](https://github.com/xmake-mirror/build-artifacts/blob/build/build.txt) 文件，修改里面需要触发预编译的包名和版本列表就行了，例如：

build.txt

```lua
{
    name = "asmjit",
    versions = {
        "2021.06.27"
    }
}
```

只要 pr 被 merge 之后，就会自动触发预编译行为，然后生成最终的编译产物到 releases 。

#### 强制源码编译安装

尽管我们提供了预编译下载安装的方式，但是如果用户还是想源码编译安装，我们也可以手动传入 `--build` 参数给 xrepo 命令，来强制切换到源码编译安装模式。

```console
$ xrepo install --build openssl
```

在 xmake.lua 中，我们也可以同样支持源码编译安装。

```lua
add_requires("openssl", {build = true})
```

如果没有指定，那么 xmake 会自动优先尝试走预编译包的下载安装。

#### 添加私有预编译包仓库

我们的官方预编译包仓库在：[build-artifacts](https://github.com/xmake-mirror/build-artifacts)。

同样，我们也可以配置添加自有的预编译仓库，添加方式类似：

```console
$ xmake repo --add local-repo git@github.com:xmake-mirror/myrepo-artifacts.git
```

也可以在 xmake.lua 中添加：

```lua
add_repositories("local-repo git@github.com:xmake-mirror/myrepo-artifacts.git")
```

### 新版本地包方案

#### 默认打包格式

新版本中，我们提供了一种新的本地包打包方案，将会更加无缝的对接 `add_requires` 和 `add_packages`。

我们执行 `xmake package` 命令就能够生成默认的新版打包格式。

```console
$ xmake package
package(foo): build/packages/f/foo generated
```

它将会产生 `build/packages/f/foo/xmake.lua` 文件，内容如下：

```lua
package("foo")
    set_description("The foo package")
    set_license("Apache-2.0")
    add_deps("add", "sub")

    on_load(function (package)
        package:set("installdir", path.join(os.scriptdir(), package:plat(), package:arch(), package:mode()))
    end)

    on_fetch(function (package)
        local result = {}
        result.links = "foo"
        result.linkdirs = package:installdir("lib")
        result.includedirs = package:installdir("include")
        return result
    end)
```

其实就是采用 `package()` 来定义描述本地包，就跟远程包一样。

而生成的目录结构如下：

```console
$ tree build/packages/f/foo/
build/packages/f/foo/
├── macosx
│   └── x86_64
│       └── release
│           ├── include
│           │   └── foo.h
│           └── lib
│               └── libfoo.a
└── xmake.lua
```

我们也能够使用 `add_requires`/`add_repositories` 接口来无缝集成这个包。

```lua
add_rules("mode.debug", "mode.release")

add_repositories("local-repo build")
add_requires("foo")

target("bar")
    set_kind("binary")
    add_files("src/*.cpp")
    add_packages("foo")
```

其中，`add_repositories` 配置指定本地包的仓库根目录，然后就可以通过 `add_requires` 来引用这个包了。

另外，生成的本地包，还有一个特性，就是支持 `target/add_deps`，会自动关联多个包的依赖关系，集成时候，也会自动对接所有依赖链接。

这里有完整的[测试例子](https://github.com/xmake-io/xmake/blob/dev/tests/actions/package/localpkg/test.lua)。

```console
"/usr/bin/xcrun -sdk macosx clang++" -o build/macosx/x86_64/release/bar build/.objs/bar/macosx/x86_64/release/src/main.cpp.o -arch x86_64 -mmacosx-version-min=10.15 -isysroot
/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX11.0.sdk -stdlib=libc++
 -L/Users/ruki/projects/personal/xmake/tests/actions/package/localpkg/bar/build/packages/f/foo/macosx/x86_64/release/lib
 -L/Users/ruki/projects/personal/xmake/tests/actions/package/localpkg/bar/build/packages/s/sub/macosx/x86_64/release/lib
 -L/Users/ruki/projects/personal/xmake/tests/actions/package/localpkg/bar/build/packages/a/add/macosx/x86_64/release/lib
 -Wl,-x -lfoo -lsub -ladd -lz
```

备注：之前的老版本本地打包格式属于早期产物，还是会被保留，但是不推荐继续使用，想要继续使用，可以执行下面的命令打包：

```console
$ xmake package -f oldpkg
```

#### 生成远程包

除了本地包格式，`xmake package` 现在也支持生成远程包，便于用户将他们快速提交到远程仓库。

我们只需要在打包时候，修改包格式。

```console
$ xmake package -f remote
```

他也会产生 packages/f/foo/xmake.lua 文件。

```lua
package("foo")
    set_description("The foo package")
    set_license("Apache-2.0")
    add_deps("add", "sub")

    add_urls("https://github.com/myrepo/foo.git")
    add_versions("1.0", "<shasum256 or gitcommit>")

    on_install(function (package)
        local configs = {}
        if package:config("shared") then
            configs.kind = "shared"
        end
        import("package.tools.xmake").install(package, configs)
    end)

    on_test(function (package)
        -- TODO check includes and interfaces
        -- assert(package:has_cfuncs("foo", {includes = "foo.h"})
    end)
```

包定义配置相比本地包，多了实际的安装逻辑，以及 urls 和 versions 的设置，

我们也能够通过附加参数，去修改 urls，versions 等配置值，例如：

```console
$ xmake package -f remote --url=https://xxxx/xxx.tar.gz --shasum=xxxxx --homepage=xxxxx`
```

xmake 也会从 target 的 `set_license` 和 `set_version` 等配置中读取相关配置信息。

### 从第三方仓库搜索包

xmake 内置的 xrepo 包管理器命令，之前可以支持搜索 xmake-repo 仓库中的内置包。

```console
$ xrepo search zlib "pcr*"
    zlib:
      -> zlib: A Massively Spiffy Yet Delicately Unobtrusive Compression Library (in xmake-repo)
    pcr*:
      -> pcre2: A Perl Compatible Regular Expressions Library (in xmake-repo)
      -> pcre: A Perl Compatible Regular Expressions Library (in xmake-repo)
```

而现在，我们还可以从 vcpkg, conan, conda 以及 apt 等第三方包管理器中搜索它们的包，只需要加上对应的包命名空间就行，例如：

```console
$ xrepo search vcpkg::pcre
The package names:
    vcpkg::pcre:
      -> vcpkg::pcre-8.44#8: Perl Compatible Regular Expressions
      -> vcpkg::pcre2-10.35#2: PCRE2 is a re-working of the original Perl Compatible Regular Expressions library
```

```console
$ xrepo search conan::openssl
The package names:
    conan::openssl:
      -> conan::openssl/1.1.1g:
      -> conan::openssl/1.1.1h:
```

### 修改目标文件名

我们知道，对于目标文件名的修改，我们可以使用 `set_basename` 或者使用 `set_filename` 接口来配置实现，前者修改 `libxxx.so` 中的 `xxx` 部分名字，后者可以修改完整的文件名。

但是有些情况，我们仅仅想要修改：扩展名 `.so`，前缀名 `lib`，或者增加后缀名比如：`libxxx-d.so` 就会很麻烦，要么使用 `set_filename` 进行完整修改。

现在，我们新提供了 `set_prefixname`, `set_suffixname` 和 `set_extension` 三个独立接口来更加灵活地配置它们。

#### 设置目标文件的前置名

例如将默认的：`libtest.so` 改成 `test.so`

```lua
target("test")
    set_prefixname("")
```

#### 设置目标文件的后置名

例如将默认的：`libtest.so` 改成 `libtest-d.so`

```lua
target("test")
    set_suffixname("-d")
```

#### 设置目标文件的扩展名

例如将默认的：`libtest.so` 改成 `test.dll`

```lua
target("test")
    set_prefixname("")
    set_extension(".dll")
```

### 默认的目标类型

新版本中，如果用户没有对 target 设置 `set_kind` 指定目标类型，那么默认就是 binary 程序。

因此，我们可以实现更小的配置，例如：

```lua
target("test")
    add_files("src/*.c")
```

只需两行就可以完成一些小项目的编译，甚至可以更加简短：

```lua
target("test", {files = "src/*.c"})
```

### 新增 appletvos 编译平台

我们还新增了一个 appletvos 的编译平台，用于支持 Apple 的 TVOS 系统上程序的编译，只需要：

```console
$ xmake f -p appletvos
$ xmake
```

### 导入导出编译配置

我们还可以导入导出已经配置好的配置集，方便配置的快速迁移。

#### 导出配置

```console
$ xmake f --export=/tmp/config.txt
$ xmake f -m debug --xxx=y --export=/tmp/config.txt
```

#### 导入配置

```console
$ xmake f --import=/tmp/config.txt
$ xmake f -m debug --xxx=y --import=/tmp/config.txt
```

#### 导出配置（带菜单）

```console
$ xmake f --menu --export=/tmp/config.txt
$ xmake f --menu -m debug --xxx=y --export=/tmp/config.txt
```


#### 导入配置（带菜单）

```console
$ xmake f --menu --import=/tmp/config.txt
$ xmake f --menu -m debug --xxx=y --import=/tmp/config.txt
```

### vs2022 支持

另外，新版本中，我们也增加了对 vs2020 预览版的支持。

### 改进 xrepo shell 环境

在上个版本，我们支持了通过在当前目录下，添加 xmake.lua 文件，来定制化一些包配置，然后进入特定的包 shell 环境。

```lua
add_requires("zlib 1.2.11")
add_requires("python 3.x", "luajit")
```

```console
$ xrepo env shell
> python --version
> luajit --version
```

而现在，我们还可以在 xmake.lua 配置加载对应的工具链环境，比如加载 vs 的编译环境。

```lua
set_toolchains("msvc")
```

## 更新内容

### 新特性

* [#1421](https://github.com/xmake-io/xmake/issues/1421): 针对 target 目标，增加目标文件名的前缀，后缀和扩展名设置接口。
* [#1422](https://github.com/xmake-io/xmake/issues/1422): 支持从 vcpkg, conan 中搜索包
* [#1424](https://github.com/xmake-io/xmake/issues/1424): 设置 binary 作为默认的 target 目标类型
* [#1140](https://github.com/xmake-io/xmake/issues/1140): 支持安装时候，手动选择从第三包包管理器安装包
* [#1339](https://github.com/xmake-io/xmake/issues/1339): 改进 `xmake package` 去产生新的本地包格式，无缝集成 `add_requires`，并且新增生成远程包支持
* 添加 `appletvos` 编译平台支持, `xmake f -p appletvos`
* [#1437](https://github.com/xmake-io/xmake/issues/1437): 为包添加 headeronly 库类型去忽略 `vs_runtime`
* [#1351](https://github.com/xmake-io/xmake/issues/1351): 支持导入导出当前配置
* [#1454](https://github.com/xmake-io/xmake/issues/1454): 支持下载安装 windows 预编译包

### 改进

* [#1425](https://github.com/xmake-io/xmake/issues/1425): 改进 tools/meson 去加载 msvc 环境，并且增加一些内置配置。
* [#1442](https://github.com/xmake-io/xmake/issues/1442): 支持从 git url 去下载包资源文件
* [#1389](https://github.com/xmake-io/xmake/issues/1389): 支持添加工具链环境到 `xrepo env`
* [#1453](https://github.com/xmake-io/xmake/issues/1453): 支持 protobuf 规则导出头文件搜索目录
* 新增对 vs2022 的支持

### Bugs 修复

* [#1413](https://github.com/xmake-io/xmake/issues/1413): 修复查找包过程中出现的挂起卡死问题
* [#1420](https://github.com/xmake-io/xmake/issues/1420): 修复包检测和配置缓存
* [#1445](https://github.com/xmake-io/xmake/issues/1445): 修复 WDK 驱动签名错误
* [#1465](https://github.com/xmake-io/xmake/issues/1465): 修复缺失的链接目录
