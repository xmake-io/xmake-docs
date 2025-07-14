---
title: xmake v2.3.3 released, Support for building iOS/MacOS Framework and App
tags: [xmake, lua, C/C++, framework, bundle, app, codesign]
date: 2020-04-27
author: Ruki
---

tags: [xmake, lua, C/C++, framework, bundle, app, codesign], date: '2020-04-27',]
---

This version mainly expands the built-in build rules, and adds relevant rules to support the construction of iOS / MacOS related App application projects, Framework and Bundle programs.

It also supports App signing, and provides related engineering templates to quickly create applications. In addition, this version has also made many improvements to Qt development and construction, adding support for Qt5.14.0 new version SDK and packaging and deployment support for Android It has also improved a lot.

In addition to processing, xmake also provides a special `xmake.cli` build rule, through the integration of libxmake engine library to expand the development of xmake engine-based programs, such as: make a customized version of xmake, you can also write some lua based on this Script program.

* [Github](https://github.com/xmake-io/xmake)
* [Documents](https://xmake.io)



## iOS/MacOS Program

### Application

Generate *.app/*.ipa application and supports iOS/MacOS.

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
```

#### Create Project

We can also quickly create project through template:

```console
$ xmake create -t xcode.macapp -l objc test
$ xmake create -t xcode.iosapp -l objc test
```

#### Build Program

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





#### Codesign

For iOS programs, it will detect that the system first signs the app with available signatures. Of course, we can also manually specify other signature certificates:

```console
$ xmake f -p iphoneos --xcode_codesign_identity='Apple Development: xxx@gmail.com (T3NA4MRVPU)' --xcode_mobile_provision='iOS Team Provisioning Profile: org.tboox.test --xcode_bundle_identifier=org.tboox.test'
$ xmake
```

If it is cumbersome to configure the signature every time, you can set it to the `xmake global` global configuration, or you can set it separately for each target in xmake.lua:

```lua
target("test")
    add_rules("xcode.application")
    add_files("src/*.m", "src/**.storyboard", "src/*.xcassets")
    add_files("src/Info.plist")
    add_values("xcode.bundle_identifier", "org.tboox.test")
    add_values("xcode.codesign_identity", "Apple Development: xxx@gmail.com (T3NA4MRVPU)")
    add_values("xcode.mobile_provision", "iOS Team Provisioning Profile: org.tboox.test")
```

How do we know the signature configuration we need? One is to view it in xcode. In addition, xmake also provides some auxiliary tools to dump all currently available signature configurations:

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
	<string>XC org tboox test</string>
	<key>ApplicationIdentifierPrefix</key>
	<array>
	<string>43AAQM58X3</string>
...
```

We also provide other auxiliary tools to re-sign existing ipa / app programs, for example:

```console
$ xmake l utils.ipa.resign test.ipa | test.app [codesign_identity] [mobile_provision] [bundle_identifier]
```

Among them, the following signature parameters are optional, if not set, then a valid signature will be detected by default:

```console
$ xmake l utils.ipa.resign test.ipa
$ xmake l utils.ipa.resign test.app "Apple Development: waruqi@gmail.com (T3NA4MRVPU)"
$ xmake l utils.ipa.resign test.ipa "Apple Development: waruqi@gmail.com (T3NA4MRVPU)" iOS Team Provisioning Profile: org.tboox.test" org.tboox.test
```

#### Run the application

Currently only supports running macos program:

`` `console
$ xmake run
`` `

The effect is as follows:

![](/assets/img/guide/macapp.png)

#### Package program

If it is an iOS program, it will generate an ipa installation package, if it is macos, it will generate a dmg package (dmg package generation is still under development for the time being).

```console
$ xmake package
output: build/iphoneos/release/arm64/test.ipa
package ok!
```

We also provide auxiliary tools to package the specified app program:

```console
$ xmake l utils.ipa.package test.app output.ipa [iconfile.png]
```

#### Install

If it is an iOS program, it will install ipa to the device, if it is macos, it will install the app to the `/Applications` directory.

```console
$ xmake install
```

We also provide auxiliary tools to install the specified ipa/app program to the device:

```console
$ xmake l utils.ipa.install test.app
$ xmake l utils.ipa.install test.ipa
```

#### Uninstall

!> Currently only the macos program is supported

```console
$ xmake uninstall
```

### Framework Program

```lua
target("test")
    add_rules("xcode.framework")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

We can also quickly create project through template:

```console
$ xmake create -t xcode.framework -l objc test
```

### Bundle Program

```lua
target("test")
    add_rules("xcode.bundle")
    add_files("src/*.m")
    add_files("src/Info.plist")
```

We can also quickly create project through template:

```console
$ xmake create -t xcode.bundle -l objc test
```

### New features

* [#727](https://github.com/xmake-io/xmake/issues/727): Strip and generate debug symbols file (.so/.dSYM) for android/ios program
* [#687](https://github.com/xmake-io/xmake/issues/687): Support to generate objc/bundle program.
* [#743](https://github.com/xmake-io/xmake/issues/743): Support to generate objc/framework program.
* Support to compile bundle, framework, mac application and ios application, and all some project templates
* Support generate ios *.ipa file and codesign
* Add xmake.cli rule to develop lua program with xmake core engine

### Change

* [#750](https://github.com/xmake-io/xmake/issues/750): Improve qt.widgetapp rule to support private slot
* Improve Qt/deploy for android and support Qt 5.14.0
