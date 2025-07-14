---
title: xmake v2.3.3 发布, 新增iOS/MacOS Framework和App构建支持
tags: [xmake, lua, C/C++, framework, bundle, app, 签名]
date: 2020-04-27
author: Ruki
---

这个版本主要是对内置的构建规则做了些扩展，新增了相关规则来实现对iOS/MacOS相关App应用程序项目、Framework和Bundle程序的构建支持。

并且支持App签名，也提供了相关工程模板来快速创建应用程序，另外此版本还对Qt的开发构建也做了不少改进，增加对Qt5.14.0新版本sdk的支持，对android的打包部署支持上也改进了不少。

处理之外，xmake还提供了一个特殊的`xmake.cli`构建rule，通过集成libxmake engine库，来扩展开发基于xmake引擎的程序，比如：做个定制版的xmake，也可以基于此写点lua脚本程序。

* [项目源码](https://github.com/xmake-io/xmake)
* [官方文档](https://xmake.io/zh/)


## 构建iOS/MacOS程序

### 构建App应用程序

用于生成*.app/*.ipa应用程序，同时支持iOS/MacOS。

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
```

#### 创建工程

我们也可以通过模板工程快速创建：

```console
$ xmake create -t xcode.macapp -l objc test
$ xmake create -t xcode.iosapp -l objc test
```

#### 编译

```console
$ xmake f -p [iphoneos|macosx]
$ xmake
[ 18%]: compiling.xcode.release src/Assets.xcassets
[ 27%]: processing.xcode.release src/Info.plist
[ 72%]: compiling.xcode.release src/Base.lproj/Main.storyboard
[ 81%]: compiling.xcode.release src/Base.lproj/LaunchScreen.storyboard
[ 45%]: ccache compiling.release src/ViewController.m
[ 63%]: ccache compiling.release src/AppDelegate.m
[ 54%]: ccache compiling.release src/SceneDelegate.m
[ 36%]: ccache compiling.release src/main.m
[ 90%]: linking.release test
[100%]: generating.xcode.release test.app
[100%]: build ok!
```








#### 配置签名

对于iOS程序，默认会检测系统先用可用签名来签名app，当然我们也可以手动指定其他签名证书：

```console
$ xmake f -p iphoneos --xcode_codesign_identity='Apple Development: xxx@gmail.com (T3NA4MRVPU)' --xcode_mobile_provision='iOS Team Provisioning Profile: org.tboox.test --xcode_bundle_identifier=org.tboox.test'
$ xmake
```

如果每次这么配置签名觉得繁琐的话，可以设置到`xmake global`全局配置中，也可以在xmake.lua中对每个target单独设置：

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
    add_values("xcode.bundle_identifier", "org.tboox.test")
    add_values("xcode.codesign_identity", "Apple Development: xxx@gmail.com (T3NA4MRVPU)")
    add_values("xcode.mobile_provision", "iOS Team Provisioning Profile: org.tboox.test")
```

那如何知道我们需要的签名配置呢？一种就是在xcode里面查看，另外xmake也提供了一些辅助工具可以dump出当前可用的所有签名配置：

```console
$ xmake l private.tools.codesign.dump
==================================== codesign identities ====================================
{ 
  "Apple Development: waruqi@gmail.com (T3NA4MRVPU)" = "AF73C231A0C35335B72761BD3759694739D34EB1" 
}

===================================== mobile provisions =====================================
{ 
  "iOS Team Provisioning Profile: org.tboox.test" = "<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>AppIDName</key>
	<string>XC org tboox test5</string>
	<key>ApplicationIdentifierPrefix</key>
	<array>
	<string>43AAQM58X3</string>
...
```

我们也提供了其他辅助工具来对已有的ipa/app程序进行重签名，例如：

```console
$ xmake l utils.ipa.resign test.ipa|test.app [codesign_identity] [mobile_provision] [bundle_identifier]
```

其中，后面的签名参数都是可选的，如果没设置，那么默认会探测使用一个有效的签名：

```console
$ xmake l utils.ipa.resign test.ipa
$ xmake l utils.ipa.resign test.app "Apple Development: waruqi@gmail.com (T3NA4MRVPU)"
$ xmake l utils.ipa.resign test.ipa "Apple Development: waruqi@gmail.com (T3NA4MRVPU)" iOS Team Provisioning Profile: org.tboox.test" org.tboox.test
```

#### 运行应用程序

目前仅支持运行macos程序：

```console
$ xmake run
```

效果如下：

![](/assets/img/guide/macapp.png)

#### 生成程序包

如果是iOS程序会生成ipa安装包，如果是macos会生成dmg包（dmg包生成暂时还在开发中）。

```console
$ xmake package
output: build/iphoneos/release/arm64/test.ipa
package ok!
```

我们也提供了辅助工具，来对指定app程序进行打包：

```console
$ xmake l utils.ipa.package test.app output.ipa [iconfile.png]
```

#### 安装

如果是iOS程序会安装ipa到设备，如果是macos会安装app到/Applications目录。

```console
$ xmake install
```

我们也提供了辅助工具，来对指定ipa/app程序安装到设备：

```console
$ xmake l utils.ipa.install test.app
$ xmake l utils.ipa.install test.ipa
```

#### 卸载

!> 目前仅支持macos程序卸载

```console
$ xmake uninstall
```

### 构建Framework库程序

```lua
target("test")
    add_rules("xcode.framework")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

我们也可以通过模板工程快速创建：

```console
$ xmake create -t xcode.framework -l objc test
```

### 构建Bundle程序

```lua
target("test")
    add_rules("xcode.bundle")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

我们也可以通过模板工程快速创建：

```console
$ xmake create -t xcode.bundle -l objc test
```

## xmake.cli程序

关于这块，主要还是方便我个人自己用来写一些基于xmake engine的lua程序，当然用户也可以用来扩展定制自己的xmake版本。现在xmake开放了libxmake开发库，我们可以通过：

```lua
add_requires("libxmake")
target("test")
    add_rules("xmake.cli")
    add_files("src/*.c")
    add_packages("libxmake")
```

来快速集成libxmake库做定制化开发。

### 定制化扩展xmake

一个典型的例子就是，我们可以用xmake.cli快速编译构建出xmake自身，并且用户可以在此基础做二次开发，相关例子代码见：[myxmake](https://github.com/xmake-io/xmake/tree/master/tests/projects/xmake_cli/xmake)

```lua
add_rules("mode.debug", "mode.release")
add_requires("libxmake")
target("xmake")
    add_rules("xmake.cli")
    add_files("src/*.c")
    if is_plat("windows") then
        add_files("src/*.rc")
    end
    add_packages("libxmake")
```

只需要自己在main函数里面调用libxmake接口创建自己的xmake engine就行了：

```c
#include <xmake/xmake.h>

tb_int_t main(tb_int_t argc, tb_char_t** argv)
{
    return xm_engine_run("xmake", argc, argv, tb_null, tb_null);
}
```

### lua脚本程序开发

我们可以利用xmake.cli快速写一些基于lua的xmake engine的命令行小工具，利用xmake内置的各种modules，来开发一些原型程序。

基于此，我写了个独立完整的小项目，可以参考下：[luject](https://github.com/lanoox/luject), 一个静态注入动态库的工具。

大致的项目结构非常简单：

```
luject
  - src
    - lni
      -- main.c
    -- lua
      -- main.lua
```

其中，lni目录用于通过c/lua交互，利用丰富的c/c++程序库对lua接口进行扩展，而lua目录用于通过lua脚本来快速实现程序逻辑，下面是luject的xmake.lua构建描述：

```lua
set_xmakever("2.3.3")

add_rules("mode.debug", "mode.release")
add_requires("libxmake", "lief")

if is_plat("windows") then 
    if is_mode("release") then
        add_cxflags("-MT") 
    elseif is_mode("debug") then
        add_cxflags("-MTd") 
    end
    add_cxxflags("-EHsc", "-FIiso646.h")
    add_ldflags("-nodefaultlib:msvcrt.lib")
end

target("luject")
    add_rules("xmake.cli")
    add_files("src/lni/*.cpp")
    set_languages("c++14")
    add_packages("libxmake", "lief")
    add_installfiles("res/*", {prefixdir = "share/luject/res"})

includes("tests")
```

编译安装非常简单，只需要：

```console
xmake
xmake install
```

我们也可以直接加载运行：

```console
xmake run
```

虽然跟python/ruby这种完整庞然大物和生态没法比，xmake.cli主要还是对于一些习惯lua语法的用户快速写一些小脚本程序，并且提供一种通过c快速扩展接口的能力。

后期，我会在[lanoox](https://github.com/lanoox)项目组专门放置自己平时写的一些xmake.cli程序。

## 更新内容

### 新特性

* [#727](https://github.com/xmake-io/xmake/issues/727): 支持为android, ios程序生成.so/.dSYM符号文件
* [#687](https://github.com/xmake-io/xmake/issues/687): 支持编译生成objc/bundle程序
* [#743](https://github.com/xmake-io/xmake/issues/743): 支持编译生成objc/framework程序
* 支持编译bundle, framework程序，以及mac, ios应用程序，并新增一些工程模板
* 支持对ios应用程序打包生成ipa文件，以及代码签名支持
* 增加一些ipa打包、安装、重签名等辅助工具
* 添加xmake.cli规则来支持开发带有xmake/core引擎的lua扩展程序

### 改进

* [#750](https://github.com/xmake-io/xmake/issues/750): 改进qt.widgetapp规则，支持qt私有槽
* 改进Qt/android的apk部署，并且支持Qt5.14.0新版本sdk
