---
title: xmake v2.5.4 发布，支持 apt/portage 包管理器，改进 xrepo shell 环境
tags: [xmake, lua, C/C++, apt, portage, shell, package]
date: 2021-05-15
author: Ruki
---
在 2.5.4 版本中，我们新增了对 Apt、Portage 这两个包管理器的支持，在 Ubuntu/Gentoo 上我们也可以使用 `add_requires` 可以快速集成它们提供的包。

并且我们也改进支持了 Vcpkg 包管理器的支持，新增对 arm/arm64 架构包的安装支持。

另外，我们还增强了 `xrepo env shell` 环境，可以通过在 `xmake.lua` 中配置一系列 `add_requires` 包配置，加载带有特定包配置的 shell 环境。


* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)
* [入门课程](https://xmake.io/zh/)


## 新特性介绍

### 新的包管理器支持

#### 添加 ubuntu/apt 的依赖包

现在我们支持使用 apt 集成依赖包，也会自动查找 ubuntu 系统上已经安装的包。

```lua
add_requires("apt::zlib1g-dev", {alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

#### 添加 gentoo/portage 的依赖包

我们也支持了使用 Portage 集成依赖包，并且也会自动查找 Gentoo 系统上已经安装的包。

```lua
add_requires("portage::libhandy", {alias = "libhandy"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("libhandy")
```










#### 从 Vcpkg 集成 arm/arm64 架构包

```lua
add_requires("vcpkg::zlib", {alias = "zlib"})

target("test")
    set_kind("binary")
    add_files("src/*.c")
    add_packages("zlib")
```

配置方式还是跟之前的相同，只需要切换到 arm/arm64 架构编译就可以自动从 Vcpkg 拉取 arm/arm64 的包。

```console
$ xmake f -a arm64
$ xmake
```

#### 支持导入导出安装包

通常，我们使用 xrepo 命令或者 xmake 去安装完包后，如果相同的项目迁移到其他机器编译，那就要重新下载安装包。

为了提高开发效率，现在 xrepo 可以快速导出已经安装后的包，包括对应的库文件，头文件等等。

```console
$ xrepo export -o /tmp/output zlib
```

然后我们也可以在其他机器上导入之前导出的安装包，实现包的迁移。

```console
$ xrepo import -i /xxx/packagedir zlib
```

导入后，对应项目编译会直接使用它们，不再额外重新安装包。

#### 特定包 shell 环境支持

xrepo 有个 `xrepo env` 命令，可以指定加载特定包的环境，然后运行特定程序，例如加载 luajit 包的安装环境，然后运行 luajit：

```console
$ xrepo env luajit
```

或者绑定特定 luajit 版本包环境，加载 bash 后，就可以直接运行对应的 lujit。
```console
$ xrepo env -b "luajit 5.1" bash
> luajit --version
```

但是，这样有个问题，如果我们安装的包很多，不同的包配置和版本都还不同，如果我们想加载一个 bash，并且同时带有多个包的环境。

那么，之前的方式就无法支持了，因此，新版本中，我们对其进一步改进，是的可以通过在当前目录下，添加 xmake.lua 文件，定制化一些包配置，然后进入特定的包 shell 环境。

xmake.lua

```lua
add_requires("zlib 1.2.11")
add_requires("python 3.x", "luajit")
```

比如上面这样，我们通过在 xmake.lua 中配置了三个包，想在 shell 中同时使用它们，那么只需要在当前目录下运行下面的命令就行了。

```console
$ xrepo env shell
> python --version
> luajit --version
```

需要注意的是，这里我们使用了 `xrepo env shell` 而不是 `xrepo env bash`，是因为 bash 只能在特定平台使用，而 `xrepo env shell` 属于内置命令。

它可以自动检测当前用的终端环境，加载对应的 bash, sh, zsh 以及 windows 下的 cmd 或者 powershell 环境，这一切都是自动的。

另外，我们还加了一些辅助特性，比如 prompt 提示，`xrepo env quit` 环境退出命令，历史输入命令切换等等。

#### 设置镜像加速包下载

为了改进国内网络环境下载包慢的问题，xmake 是支持代理设置的，还可以支持 pac.lua 代理配置策略。

而新版本中，我们对 pac.lua 配置进行了改进，进一步支持配置镜像代理规则，比如对所有 github.com 域名的访问切到 hub.fastgit.org 域名，实现加速下载包。

pac.lua 配置：

```lua
function mirror(url)
     return url:gsub("github.com", "hub.fastgit.org")
end
```

然后我们设置次 pac.lua 文件，默认路径在 `~/.xmake/pac.lua`。

```console
$ xmake g --proxy_pac=/tmp/pac.lua
```

然后，我们安装包的时候，如果遇到 github.com 域名下的包源，下载时候会自动切到 fastgit 镜像加速下载。

```console
$ xrepo install libpng
> curl https://hub.fastgit.org/glennrp/libpng/archive/v1.6.37.zip -o v1.6.37.zip
```

#### 自定义切换包存储目录

之前我们只能通过 `xmake g --pkg_installdir=/tmp/xx` 来配置修改默认的包安装目录。

现在，我们也可以通过 `XMAKE_PKG_INSTALLDIR` 环境变量也修改它，默认路径在：`~/.xmake/packages`。

另外，我们还额外添加了 `XMAKE_PKG_CACHEDIR` 环境变量来修改包的缓存目录，默认路径在：`~/.xmake/cache/packages`。

## 更新内容

### 新特性

* [#1323](https://github.com/xmake-io/xmake/issues/1323): 支持从 apt 查找安装包，`add_requires("apt::zlib1g-dev")`
* [#1337](https://github.com/xmake-io/xmake/issues/1337): 添加环境变量去改进包安装和缓存目录
* [#1338](https://github.com/xmake-io/xmake/issues/1338): 支持导入导出已安装的包
* [#1087](https://github.com/xmake-io/xmake/issues/1087): 添加 `xrepo env shell` 并且支持从 `add_requires/xmake.lua` 加载包环境
* [#1313](https://github.com/xmake-io/xmake/issues/1313): 为 `add_requires/add_deps` 添加私有包支持
* [#1358](https://github.com/xmake-io/xmake/issues/1358): 支持设置镜像 url 站点加速包下载
* [#1369](https://github.com/xmake-io/xmake/pull/1369): 为 vcpkg 增加 arm/arm64 包集成支持，感谢 @fallending
* [#1405](https://github.com/xmake-io/xmake/pull/1405): 添加 portage 包管理器支持，感谢 @Phate6660

### 改进

* 改进 `find_package` 并且添加 `package:find_package` 接口在包定义中方便查找包
* 移除废弃的 `set_config_h` 和 `set_config_h_prefix` 接口
* [#1343](https://github.com/xmake-io/xmake/issues/1343): 改进搜索本地包文件
* [#1347](https://github.com/xmake-io/xmake/issues/1347): 针对 binary 包改进 vs_runtime 配置
* [#1353](https://github.com/xmake-io/xmake/issues/1353): 改进 del_files() 去加速匹配文件
* [#1349](https://github.com/xmake-io/xmake/issues/1349): 改进 xrepo env shell 支持，更好的支持 powershell

### Bugs 修复

* [#1380](https://github.com/xmake-io/xmake/issues/1380): 修复 `add_packages()` 失败问题
* [#1381](https://github.com/xmake-io/xmake/issues/1381): 修复添加本地 git 包源问题
* [#1391](https://github.com/xmake-io/xmake/issues/1391): 修复 cuda/nvcc 工具链
