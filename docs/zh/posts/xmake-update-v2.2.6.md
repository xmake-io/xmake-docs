---
title: xmake v2.2.6 发布, Qt/Android编译支持
tags: [xmake, lua, C/C++, 版本更新, Qt, Android]
date: 2019-05-26
author: Ruki
---

这个版本主要对远程依赖包的支持进一步完善，并且新增了对clib包依赖的支持，另外现在xmake已经能够直接编译Qt/Android项目，并且可以直接生成apk包，以及安装到设备支持。

此版本还对xmake的启动性能做了优化，解决了windows启动慢的问题，提速98%，整体编译速度也加快了不少。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)

最近正好写了篇与cmake的对比分析文章，有兴趣的同学可以看下：[xmake vs cmake对比分析](https://tboox.org/cn/2019/05/29/xmake-vs-cmake/)

## 新特性介绍

### Qt/Android编译支持

我们可以先创建一个Qt空项目，并且尝试编译生成apk，例如：

```console
xmake create -t quickapp_qt -l c++ appdemo
cd appdemo
xmake f -p android --ndk=~/Downloads/android-ndk-r19c/ --android_sdk=~/Library/Android/sdk/ -c 
xmake
[  0%]: compiling.qt.qrc src/qml.qrc
[ 50%]: ccache compiling.release src/main.cpp
[100%]: linking.release libappdemo.so
[100%]: generating.qt.app appdemo.apk
```

然后安装到设备：

```console
xmake install
installing appdemo ...
installing build/android/armv7-a/release/appdemo.apk ..
Success
install ok!👌
```

非常简单，我们可以看下其xmake.lua描述，其实跟在pc上编译维护Qt项目并没有区别，完全一样的描述文件，仅仅只是编译的时候切换到了android平台而已。

```lua
add_rules("mode.debug", "mode.release")

target("appdemo")
    add_rules("qt.application")
    add_headerfiles("src/*.h")

    add_files("src/*.cpp") 
    add_files("src/qml.qrc")

    add_frameworks("QtQuick")
```






### clib包依赖集成

clib是一款基于源码的依赖包管理器，拉取的依赖包是直接下载对应的库源码，集成到项目中编译，而不是二进制库依赖。

其在xmake中集成也很方便，唯一需要注意的是，还需要自己添加上对应库的源码到xmake.lua，例如：

```lua
add_requires("clib::clibs/bytes@0.0.4", {alias = "bytes"})

target("xmake-test")
    set_kind("binary")
    add_files("clib/bytes/*.c")
    add_files("src/*.c") 
    add_packages("bytes")
```

### 语法简化

xmake.lua的配置域语法，非常灵活，可以在相关域做各种复杂灵活的配置，但是对于许多精简的小块配置，这个时候就稍显冗余了：

```lua
option("test1")
    set_default(true)
    set_showmenu(true)
    set_description("test1 option")

option("test2")
    set_default(true)
    set_showmeu(true)

option("test3")
    set_default("hello")
```

对于上面的这些小块option域设置，我们可以简化下成单行描述：

```lua
option("test1", {default = true, showmenu = true, description = "test1 option"})
option("test2", {default = true, showmenu = true})
option("test3", {default = "hello"})
```

除了option域，对于其他域也是支持这种简化写法的，例如：

```lua
target("demo")
    set_kind("binary")
    add_files("src/*.c")
```

简化为：

```lua
target("demo", {kind = "binary", files = "src/*.c"})
```

当然，如果配置需求比较复杂的，还是原有的多行设置方式更加方便，这个就看自己的需求来评估到底使用哪种方式了。

## 更新内容

### 新特性

* [#380](https://github.com/xmake-io/xmake/pull/380): 添加导出compile_flags.txt 
* [#382](https://github.com/xmake-io/xmake/issues/382): 简化域设置语法
* [#397](https://github.com/xmake-io/xmake/issues/397): 添加clib包集成支持
* [#404](https://github.com/xmake-io/xmake/issues/404): 增加Qt/Android编译支持，并且支持android apk生成和部署
* 添加一些Qt空工程模板，例如：`widgetapp_qt`, `quickapp_qt_static` and `widgetapp_qt_static`
* [#415](https://github.com/xmake-io/xmake/issues/415): 添加`--cu-cxx`配置参数到`nvcc/-ccbin`
* 为Android NDK添加`--ndk_stdcxx=y`和`--ndk_cxxstl=gnustl_static`参数选项

### 改进

* 改进远程依赖包管理，丰富包仓库
* 改进`target:on_xxx`自定义脚本，去支持匹配`android|armv7-a@macosx,linux|x86_64`模式
* 改进loadfile，优化启动速度，windows上启动xmake时间提速98%

### Bugs修复

* [#400](https://github.com/xmake-io/xmake/issues/400): 修复qt项目c++语言标准设置无效问题