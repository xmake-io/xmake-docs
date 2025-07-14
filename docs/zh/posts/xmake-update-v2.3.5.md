---
title: xmake v2.3.5 发布, 多工具链灵活切换支持
tags: [xmake, lua, C/C++, toolchains, 交叉编译]
date: 2020-06-28
author: Ruki
---

这个版本主要工作还是继续改进对工具链的支持，上个版本虽然通过重构实现了模块化的工具链扩展，但是对于一次编译想要灵活地在交叉工具链/Host工具链上切换编译，还不能很好的支持，因此这个版本重点改进了这块的支持力度。

另外，此版本还对使用`add_requires`集成的远程依赖包下载慢的问题做了改进，增加了代理设置、本地包检索复用的支持来改善此问题。当然，最好的方式还是搞个国内的cdn来加速下载，但是这个成本过高，暂时就不折腾了。

还有一些小改动和bug修复，可以看下文章最下面的更新内容。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)


## 新特性介绍

### 多工具链灵活切换

关于这块的一个example，可以参考luajit项目，里面的编译流程需要先编译host平台下minilua/buildvm两个target，然后再通过minilua/buildvm生成对应目标平台的jit代码参与整体luajit库的编译。

因此整个编译过程需要先对特定target采用host工具链，然后对其他target再使用交叉工具链完成编译。

那我们应该如何配置xmake.lua去实现这种方式呢，一种就是通过`set_toolchains`接口，对特定target设置指定的host工具链，例如：


```lua
target("buildvm")
    set_kind("binary")
    add_files("src/*.c")
    set_toolchains("xcode", {plat = os.host(), arch = os.arch()})

target("luajit")
    set_kind("static")
    add_deps("buildvm")
    add_files("src/*.c")
```

如果当前是在交叉编译模式，即使执行下面的命令配置成android编译平台，其buildvm实际还是在使用xcode编译macOS目标程序，仅仅luajit库是采用ndk工具链编译：

```console
$ xmake f -p android --ndk=/xxxx
```


但是，这还不是特别方便，尤其是跨平台编译时候，不同平台的pc工具链都是不同的，有msvc, xcode, clang等，还需要判断平台来指定。

我们还可以继续通用化，让xmake针对不同平台自动选用当前可用的Host工具链，而不是显式指定特定工具链，改进成下面的版本：

```lua
target("buildvm")
    set_kind("binary")
    add_files("src/*.c")
    set_plat(os.host())
    set_host(os.arch())

target("luajit")
    set_kind("static")
    add_deps("buildvm")
    add_files("src/*.c")
```

通过使用[set_plat](/zh/manual/project_target#set-plat)和[set_arch](/zh/manual/project_target#set-arch)接口，直接设置特定target到主机平台，就可以内部自动选择host工具链了。

关于这块的完整配置例子，可以参考：https://github.com/xmake-io/xmake-repo/blob/master/packages/l/luajit/port/xmake.lua










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

这块的具体详情见：[https://github.com/xmake-io/xmake/issues/854](https://github.com/xmake-io/xmake/issues/854)

!> 另外，除了依赖包下载，其他涉及网络下载的命令也都支持代理，比如：`xmake update`

## 其他的小改动

### rc文件头文件依赖编译支持

虽然msvc里面的rc编译器原生并不支持导出.rc文件里面`#include <xxx.h>`头文件列表，不过xmake还是通过直接解析提取.rc源文件的方式，变相的把里面的头文件列表也提取了出来，实现头文件依赖编译支持。

虽然也许不够精准（还不能对宏进行处理），但也基本可用。

### 改进mode.minsizerel编译模式

新版本对msvc下的最小编译，默认开启了`/GL`编译选项，进一步的优化目标文件的大小，优化效果还是比较明显的。

关于这块详情，可以参考下：[https://github.com/xmake-io/xmake/issues/835](https://github.com/xmake-io/xmake/issues/835)

### 改进protobuf规则支持

xmake内置的`protobuf.cpp`编译规则针对`*.proto`里面import多级子目录的情况，也进行了支持，之前只能使用同级下的proto文件。

也就是对`import common-files/b.proto`的这种情况：

```
proto-files
    a.proto
    common-files
        b.proto
```

对应的xmake.lua配置如下：


```lua
add_requires("protobuf-cpp")

target("test")
    set_kind("binary")
    set_languages("c++11")
    add_packages("protobuf-cpp")
    add_files("*.cpp")
    add_files("proto/**.proto", {rules = "protobuf.cpp", proto_rootdir = "proto"})
```

相比之前，需要额外传递一个`{proto_rootdir = ""}`配置，来指定相对于import的所有proto的根目录才行。

关于这块的详情，见：[https://github.com/xmake-io/xmake/issues/828](https://github.com/xmake-io/xmake/issues/828)


## 更新内容

### 新特性

* 添加`xmake show -l envs`去显示xmake内置的环境变量列表
* [#861](https://github.com/xmake-io/xmake/issues/861): 支持从指定目录搜索本地包去直接安装远程依赖包
* [#854](https://github.com/xmake-io/xmake/issues/854): 针对wget, curl和git支持全局代理设置

### 改进

* [#828](https://github.com/xmake-io/xmake/issues/828): 针对protobuf规则增加导入子目录proto文件支持
* [#835](https://github.com/xmake-io/xmake/issues/835): 改进mode.minsizerel模式，针对msvc增加/GL支持，进一步优化目标程序大小
* [#828](https://github.com/xmake-io/xmake/issues/828): protobuf规则支持import多级子目录
* [#838](https://github.com/xmake-io/xmake/issues/838#issuecomment-643570920): 支持完全重写内置的构建规则，`add_files("src/*.c", {rules = {"xx", override = true}})`
* [#847](https://github.com/xmake-io/xmake/issues/847): 支持rc文件的头文件依赖解析
* 改进msvc工具链，去除全局环境变量的依赖
* [#857](https://github.com/xmake-io/xmake/pull/857): 改进`set_toolchains()`支持交叉编译的时候，特定target可以切换到host工具链同时编译

### Bugs修复

* 修复进度字符显示
* [#829](https://github.com/xmake-io/xmake/issues/829): 修复由于macOS大小写不敏感系统导致的sysroot无效路径问题
* [#832](https://github.com/xmake-io/xmake/issues/832): 修复find_packages在debug模式下找不到的问题
