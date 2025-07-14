---
title: xmake v2.2.2, 让C/C++拥有包依赖自动构建
tags: [xmake, lua, C/C++, 版本更新, 远程包管理, 包依赖, 自动构建]
date: 2018-10-13
author: Ruki
---

### 前言

历经四个多月，[xmake](https://github.com/xmake-io/xmake)终于更新了新版本v2.2.2，并且上线了重量级功能：原生支持的远程依赖包管理。

而这个特性，其实我陆陆续续写了将近一年的时间，才初步完成，对于此特性的开发进展和历史，有兴趣的同学可以看下相关issues：[#69](https://github.com/xmake-io/xmake/issues/69)。

目前的实现效果如下，完全一致的语义版本依赖描述：

<img src="/assets/img/index/add_require.png" width="70%" />

完全一致的跨平台构建行为，一键xmake编译：

<img src="/assets/img/index/package_manage.png" width="80%" />

完整的项目描述：

```lua
add_requires("tbox 1.6.*", "libpng ~1.16", "zlib")

target("test")
    set_kind("binary")
    add_files("src/*.c") 
    add_packages("tbox", "libpng", "zlib")
```

我先简单介绍下我做这个功能的背景：

我们在写C/C++程序的时候，对于第三方依赖库的使用一直是一个老大难问题，因为每个依赖库的构建系统不同、代码平台支持力度的差异，导致没法像其他高级语言那样有方便好用的包管理支持。

虽然现在已经有了homebrew, vcpkg等包管理工具来解决这一问题，但是多少都有一些局限性，例如：

1. homebrew不支持iphoneos, android, windows平台
2. vcpkg不支持语义版本选择，多版本管理
3. 另外都不支持项目管理和构建

对于目前现有的跨平台构建工具，都缺少内置的包管理支持，像cmake仅提供了`find_package`去查找系统包，虽然可以和vcpkg等第三方包管理配合使用，但我个人觉得并不是很方便。
这会使得项目的其他用户在编译的时候，额外要求去安装vcpkg或者安装依赖库到系统上才行，对于pc平台还好弄些，对于iphoneos, android等平台的依赖库，用户就要折腾上一会了。

而xmake的理念就是：`真正的一致维护, 真正的一键编译`

* 构建行为的一致性: 不管你的项目是否有库依赖，工具依赖，只需要执行一个`xmake`命令，即可编译通过。
* 项目维护的一致性: 不管你的项目是在windows上用，还是给linux, iphone, android上用，都只需要一份xmake.lua维护项目即可。

而cmake还需要生成额外的第三方IDE工程文件，即使cmakelist.txt相同，但是构建、维护体验上对用户来讲都不可能保证完全一致，毕竟还受限于vc/make此类工具。





### 目前支持的特性

* 语义版本支持，例如：">= 1.1.0 < 1.2", "~1.6", "1.2.x", "1.*"
* 提供官方包仓库、自建私有仓库、项目内置仓库等多仓库管理支持
* 跨平台包编译集成支持（不同平台、不同架构的包可同时安装，快速切换使用）
* debug依赖包支持，实现源码调试

### 依赖包处理机制

这里我们简单介绍下整个依赖包的处理机制：

<div align="center">
<img src="/assets/img/index/package_arch.png" width="80%" />
</div>

1. 优先检测当前系统目录、第三方包管理下有没有存在指定的包，如果有匹配的包，那么就不需要下载安装了 （当然也可以设置不使用系统包）
2. 检索匹配对应版本的包，然后下载、编译、安装（注：安装在特定xmake目录，不会干扰系统库环境）
3. 编译项目，最后自动链接启用的依赖包

### 快速上手

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

### 语义版本设置

xmake的依赖包管理是完全支持语义版本选择的，例如："~1.6.1"，对于语义版本的具体描述见：[http://semver.org/](http://semver.org/)

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

### 额外的包信息设置

#### 可选包设置

如果指定的依赖包当前平台不支持，或者编译安装失败了，那么xmake会编译报错，这对于有些必须要依赖某些包才能工作的项目，这是合理的。
但是如果有些包是可选的依赖，即使没有也可以正常编译使用的话，可以设置为可选包：

```lua
add_requires("tbox", {optional = true})
```

#### 禁用系统库

默认的设置，xmake会去优先检测系统库是否存在（如果没设置版本要求），如果用户完全不想使用系统库以及第三方包管理提供的库，那么可以设置：

```lua
add_requires("tbox", {system = false})
```

#### 使用调试版本的包

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

#### 传递额外的编译信息到包

某些包在编译时候有各种编译选项，我们也可以传递进来，当然包本身得支持：

```lua
add_requires("tbox", {config = {small=true}})
```

传递`--small=true`给tbox包，使得编译安装的tbox包是启用此选项的。

### 使用自建私有包仓库

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

### 包管理命令使用

包管理命令`$ xmake require` 可用于手动显示的下载编译安装、卸载、检索、查看包信息。

#### 安装指定包

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

#### 卸载指定包

```console
$ xmake require --uninstall tbox
```

这会完全卸载删除包文件。

#### 移除指定包

仅仅unlink指定包，不被当前项目检测到，但是包在本地还是存在的，如果重新安装的话，会很快完成。

```console
$ xmake require --unlink tbox
```

#### 查看包详细信息

```console
$ xmake require --info tbox
```

#### 在当前仓库中搜索包

```console
$ xmake require --search tbox
```

这个是支持模糊搜素以及lua模式匹配搜索的：

```console
$ xmake require --search pcr
```

会同时搜索到pcre, pcre2等包。

#### 列举当前已安装的包

```console
$ xmake require --list
```

### 仓库管理命令使用

上文已经简单讲过，添加私有仓库可以用（支持本地路径添加）：

```console
$ xmake repo --add myrepo git@github.com:myrepo/xmake-repo.git
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

### 提交包到官方仓库

目前这个特性刚完成不久，目前官方仓库的包还不是很多，有些包也许还不支持部分平台，不过这并不是太大问题，后期迭代几个版本后，我会不断扩充完善包仓库。

如果你需要的包，当前的官方仓库还没有收录，可以提交issues或者自己可以在本地调通后，贡献提交到官方仓库：[xmake-repo](https://github.com/xmake-io/xmake-repo)

详细的贡献说明，见：[CONTRIBUTING.md](https://github.com/xmake-io/xmake-repo/blob/master/CONTRIBUTING.md)

关于远程依赖包的更多说明，可以看下官方文档：[远程依赖模式](/zh/#%E8%BF%9C%E7%A8%8B%E4%BE%9D%E8%B5%96%E6%A8%A1%E5%BC%8F)

其实xmake的包管理历经了三代，前两版v1.0, v2.0分别是本地包管理模式，系统库查找模式，这两种在有些情况下还是非常有用的。
关于这两者的介绍，这里就不多说了，可以看下文档说明：[依赖包管理](/zh/#%E4%BE%9D%E8%B5%96%E5%8C%85%E7%AE%A1%E7%90%86)

### 结语

说了这么多，我们最后来看下，新版本提供的一些其他新特性和更新内容：

#### 其他新特性

* 新增fasm汇编器支持
* 添加`has_config`, `get_config`和`is_config`接口去快速判断option和配置值
* 添加`set_config`接口去设置默认配置
* 添加`$xmake --try`去尝试构建工程
* 添加`set_enabled(false)`去显示的禁用target
* [#69](https://github.com/xmake-io/xmake/issues/69): 添加远程依赖包管理, `add_requires("tbox ~1.6.1")`
* [#216](https://github.com/xmake-io/xmake/pull/216): 添加windows mfc编译规则

#### 改进

* 改进Qt编译编译环境探测，增加对mingw sdk的支持
* 在自动扫描生成的xmake.lua中增加默认debug/release规则
* [#178](https://github.com/xmake-io/xmake/issues/178): 修改mingw平台下的目标名
* 对于`add_files()`在windows上支持大小写不敏感路径模式匹配
* 改进`detect.sdks.find_qt`对于Qt根目录的探测
* [#184](https://github.com/xmake-io/xmake/issues/184): 改进`lib.detect.find_package`支持vcpkg
* [#208](https://github.com/xmake-io/xmake/issues/208): 改进rpath对动态库的支持

#### Bugs修复

* [#177](https://github.com/xmake-io/xmake/issues/177): 修复被依赖的动态库target，如果设置了basename后链接失败问题
* 修复`$xmake f --menu`中Exit问题以及cpu过高问题
* [#197](https://github.com/xmake-io/xmake/issues/197): 修复生成的vs201x工程文件带有中文路径乱码问题
* 修复WDK规则编译生成的驱动在Win7下运行蓝屏问题
* [#205](https://github.com/xmake-io/xmake/pull/205): 修复vcproj工程生成targetdir, objectdir路径设置不匹配问题 

